const MAILBOX = 'hello@thepacificedge.ca';
const SENDER = 'website@forms.thepacificedge.ca';
const MAX_BODY_BYTES = 65536;
const messages = {
  sent: 'Your enquiry has been submitted. Thank you for getting in touch.',
  unavailable: 'The enquiry form is temporarily unavailable. Please email hello@thepacificedge.ca.',
  invalid: 'Please check your name, email address and message, then try again.',
  verification: 'Please complete the security check again before sending your enquiry.',
  limited: 'Too many attempts have been made. Please wait a minute or email hello@thepacificedge.ca.',
  uncertain: 'We could not confirm submission. Your message has been kept on this page. Please email hello@thepacificedge.ca before trying again.',
};

function configurationIssue(env) {
  try { new URL(env.SITE_ORIGIN); } catch { return 'PE01'; }
  if (env.CONTACT_FORM_ENABLED !== 'true') return 'PE02';
  if (!env.TURNSTILE_SECRET_KEY) return 'PE03';
  if (typeof env.CONTACT_EMAIL?.send !== 'function') return 'PE04';
  if (typeof env.CONTACT_LIMITER?.limit !== 'function') return 'PE05';
  return null;
}

function unavailable(request, code) {
  return response(request, 503, `${messages.unavailable} Reference: ${code}.`);
}

function response(request, status, message, ok = false) {
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', Vary: 'Accept' };
  if (request.headers.get('accept')?.includes('application/json')) {
    return Response.json({ ok, message }, { status, headers });
  }
  // All text is fixed application copy; submitted values are never echoed into HTML.
  if (message === messages.uncertain) message = 'We could not confirm submission. Please email hello@thepacificedge.ca before trying again.';
  headers['Content-Type'] = 'text/html; charset=utf-8';
  headers['Content-Security-Policy'] = "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'";
  return new Response(`<!doctype html><html lang="en-CA"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Enquiry — Pacific Edge</title><style>body{margin:0;background:#f5f1e8;color:#081726;font:18px/1.6 system-ui}main{max-width:38rem;margin:10vh auto;padding:24px}a{color:#176678}h1{font-family:Georgia,serif;font-weight:400}</style><main><p>Pacific Edge</p><h1>${ok ? 'Enquiry submitted' : 'Your enquiry'}</h1><p>${message}</p><p><a href="/contact">Return to the contact page</a></p><p><a href="mailto:${MAILBOX}">${MAILBOX}</a></p></main></html>`, { status, headers });
}

async function readBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) throw new Error('size');
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new Error('size'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export async function handleContact(request, env, fetchImpl = fetch) {
  if (request.method !== 'POST') {
    const issue = configurationIssue(env);
    const result = response(request, 405, 'Please use the contact form to submit an enquiry. ' + (issue ? `Configuration reference: ${issue}.` : 'Configuration checks passed.'));
    result.headers.set('Allow', 'POST');
    return result;
  }
  let origin;
  try { origin = new URL(env.SITE_ORIGIN).origin; } catch { return unavailable(request, 'PE01'); }
  if (new URL(request.url).origin !== origin || request.headers.get('origin') !== origin) {
    return response(request, 403, 'Please submit the enquiry from the Pacific Edge website.');
  }
  const issue = configurationIssue(env);
  if (issue) return unavailable(request, issue);
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/x-www-form-urlencoded') {
    return response(request, 415, messages.invalid);
  }
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip) return unavailable(request, 'PE06');
  try {
    const limit = await env.CONTACT_LIMITER.limit({ key: `contact:${ip}` });
    if (!limit.success) {
      const result = response(request, 429, messages.limited);
      result.headers.set('Retry-After', '60');
      return result;
    }
  } catch { return unavailable(request, 'PE07'); }
  let params;
  try { params = new URLSearchParams(await readBody(request)); }
  catch { return response(request, 413, 'Please shorten your enquiry and try again.'); }
  const keys = ['name', 'email', 'organization', 'message', 'website', 'cf-turnstile-response'];
  if (keys.some(key => params.getAll(key).length > 1)) return response(request, 400, messages.invalid);
  if (params.get('website')?.trim()) return response(request, 400, messages.invalid);
  const name = (params.get('name') || '').trim();
  const email = (params.get('email') || '').trim();
  const organization = (params.get('organization') || '').trim();
  const message = (params.get('message') || '').trim();
  const token = params.get('cf-turnstile-response') || '';
  const badSingleLine = /[\r\n\u0000-\u001f\u007f]/;
  if (!name || name.length > 100 || email.length > 254 || organization.length > 160 || !message || message.length > 5000
      || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)
      || [name, email, organization].some(value => badSingleLine.test(value))
      || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(message)) {
    return response(request, 400, messages.invalid);
  }
  if (!token || token.length > 2048) return response(request, 400, messages.verification);
  try {
    const verificationResponse = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
      signal: AbortSignal.timeout(8000),
    });
    if (!verificationResponse.ok) return unavailable(request, 'PE08');
    const verification = await verificationResponse.json();
    if (verification.success !== true || verification.hostname !== new URL(origin).hostname || verification.action !== 'contact') {
      return response(request, 400, messages.verification);
    }
  } catch { return unavailable(request, 'PE09'); }
  try {
    const result = await env.CONTACT_EMAIL.send({
      to: MAILBOX,
      from: { email: SENDER, name: 'Pacific Edge website' },
      replyTo: { email, name },
      subject: 'Pacific Edge website enquiry',
      text: `Name: ${name}\nEmail: ${email}\nOrganization: ${organization || 'Not supplied'}\n\n${message}`,
    });
    if (!result || typeof result.messageId !== 'string' || !result.messageId) return response(request, 503, messages.uncertain);
    return response(request, 200, messages.sent, true);
  } catch { return response(request, 503, messages.uncertain); }
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === '/api/contact') return handleContact(request, env);
    return env.ASSETS.fetch(request);
  },
};
