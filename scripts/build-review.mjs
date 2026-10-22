import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const astro = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
const outputCheck = fileURLToPath(new URL('./check-output.mjs', import.meta.url));
const contactTest = process.argv.includes('--contact-test');
const env = {
  ...process.env,
  SITE_REVIEW: 'true',
  PUBLIC_CONTACT_ENABLED: contactTest ? 'true' : 'false',
  SITE_CONTACT_TEST: contactTest ? 'true' : 'false',
  ASTRO_TELEMETRY_DISABLED: '1',
  TELEMETRY_DISABLED: '1',
};

console.log(contactTest ? 'Building contact form test: review banner and noindex retained; real submissions enabled. Use only behind Cloudflare Access.' : 'Building website review: SITE_REVIEW=true; contact form disabled.');
for (const args of [[astro, 'check'], [astro, 'build'], [outputCheck, contactTest ? '--contact-test' : '--review']]) {
  const result = spawnSync(process.execPath, args, { cwd: root, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (result.signal) console.error(`Review build stopped by ${result.signal}.`);
    process.exit(result.status ?? 1);
  }
}
