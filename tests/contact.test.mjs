import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { handleContact } from '../worker/index.js';

const origin='https://thepacificedge.ca';
const fields={name:'Example Person',email:'person@example.net',organization:'Example organization',message:'A synthetic enquiry for local testing.',website:'','cf-turnstile-response':'synthetic-token'};
function request(overrides={},headers={}){
 return new Request(origin+'/api/contact',{method:'POST',headers:{Origin:origin,'Content-Type':'application/x-www-form-urlencoded',Accept:'application/json','CF-Connecting-IP':'192.0.2.1',...headers},body:new URLSearchParams({...fields,...overrides})});
}
function harness(overrides={},verification={success:true,hostname:'thepacificedge.ca',action:'contact'}){
 const sent=[],verified=[];
 const env={SITE_ORIGIN:origin,CONTACT_FORM_ENABLED:'true',TURNSTILE_SECRET_KEY:'synthetic-secret',CONTACT_LIMITER:{limit:async()=>({success:true})},CONTACT_EMAIL:{send:async message=>{sent.push(message);return{messageId:'synthetic-message-id'};}},...overrides};
 const fetchImpl=async(url,options)=>{verified.push({url,body:JSON.parse(options.body)});return Response.json(verification);};
 return{env,sent,verified,fetchImpl};
}

test('verified enquiry goes only to the confirmed mailbox with fixed sender and visitor Reply-To',async()=>{
 const h=harness();
 const response=await handleContact(request({to:'other@example.net',from:'spoof@example.net'}),h.env,h.fetchImpl);
 assert.equal(response.status,200);assert.equal((await response.json()).ok,true);
 assert.equal(h.sent.length,1);assert.equal(h.sent[0].to,'hello@thepacificedge.ca');
 assert.equal(h.sent[0].from.email,'website@forms.thepacificedge.ca');assert.equal(h.sent[0].replyTo.email,fields.email);
 assert.equal(h.sent[0].subject,'Pacific Edge website enquiry');assert(h.sent[0].text.includes(fields.message));
 assert(!h.sent[0].text.includes('192.0.2.1'));assert(!h.sent[0].text.includes('synthetic-secret'));
 assert.equal(h.verified[0].body.response,'synthetic-token');assert.equal(response.headers.get('cache-control'),'no-store');
});

test('disabled or incomplete configuration cannot verify or send',async(t)=>{
 for(const overrides of [{CONTACT_FORM_ENABLED:'false'},{TURNSTILE_SECRET_KEY:''},{CONTACT_EMAIL:undefined},{CONTACT_LIMITER:undefined},{SITE_ORIGIN:''}]){
  await t.test(JSON.stringify(overrides),async()=>{const h=harness(overrides);const r=await handleContact(request(),h.env,h.fetchImpl);assert.equal(r.status,503);assert.equal(h.sent.length,0);assert.equal(h.verified.length,0);});
 }
});

test('cross-origin and missing-origin submissions are rejected',async()=>{
 const h=harness();
 for(const value of ['https://example.net','null','']){
  const r=await handleContact(request({}, {Origin:value}),h.env,h.fetchImpl);assert.equal(r.status,403);
 }
 assert.equal(h.sent.length,0);assert.equal(h.verified.length,0);
});

test('invalid fields, header injection and the honeypot are rejected before external calls',async()=>{
 const h=harness();
 for(const values of [{name:''},{email:'invalid'},{name:'Name\r\nBcc: other@example.net'},{organization:'x'.repeat(161)},{message:'x'.repeat(5001)},{message:'invalid\u0000message'},{website:'bot-filled-field'},{'cf-turnstile-response':''}]){
  const r=await handleContact(request(values),h.env,h.fetchImpl);assert.equal(r.status,400);
 }
 assert.equal(h.sent.length,0);assert.equal(h.verified.length,0);
});

test('duplicate fields are rejected',async()=>{
 const h=harness();const body=new URLSearchParams(fields);body.append('email','other@example.net');
 const req=new Request(origin+'/api/contact',{method:'POST',headers:{Origin:origin,'Content-Type':'application/x-www-form-urlencoded',Accept:'application/json','CF-Connecting-IP':'192.0.2.1'},body});
 assert.equal((await handleContact(req,h.env,h.fetchImpl)).status,400);assert.equal(h.verified.length,0);
});

test('request body limit applies without a Content-Length header',async()=>{
 const h=harness();const req=request();
 const oversized=new Request(req.url,{method:'POST',headers:req.headers,body:'x'.repeat(65537)});
 assert.equal((await handleContact(oversized,h.env,h.fetchImpl)).status,413);assert.equal(h.verified.length,0);assert.equal(h.sent.length,0);
});

test('rate limiting prevents verification and sending',async()=>{
 const h=harness({CONTACT_LIMITER:{limit:async()=>({success:false})}});
 const r=await handleContact(request(),h.env,h.fetchImpl);assert.equal(r.status,429);assert.equal(r.headers.get('retry-after'),'60');assert.equal(h.sent.length,0);assert.equal(h.verified.length,0);
});

test('verification must succeed for the configured hostname and contact action',async()=>{
 for(const verification of [{success:false,hostname:'thepacificedge.ca',action:'contact'},{success:true,hostname:'example.net',action:'contact'},{success:true,hostname:'thepacificedge.ca',action:'other'}]){
  const h=harness({},verification);assert.equal((await handleContact(request(),h.env,h.fetchImpl)).status,400);assert.equal(h.sent.length,0);
 }
});

test('verification service failures cannot send an email',async()=>{
 for(const fetchImpl of [async()=>{throw Error('unavailable');},async()=>new Response('unavailable',{status:503}),async()=>new Response('invalid-json')]){
  const h=harness();assert.equal((await handleContact(request(),h.env,fetchImpl)).status,503);assert.equal(h.sent.length,0);
 }
});

test('email rejection and missing service receipt never report success',async()=>{
 for(const send of [async()=>{throw Error('provider-failure');},async()=>({})]){
  const h=harness({CONTACT_EMAIL:{send}});const r=await handleContact(request(),h.env,h.fetchImpl);
  assert.equal(r.status,503);const data=await r.json();assert.equal(data.ok,false);assert(data.message.includes('could not confirm'));
 }
});

test('native HTML fallback contains no submitted message content',async()=>{
 const h=harness();const r=await handleContact(request({message:'<script>synthetic</script>'},{Accept:'text/html'}),h.env,h.fetchImpl);
 assert.equal(r.status,200);const html=await r.text();assert(html.includes('Enquiry submitted'));assert(!html.includes('<script>synthetic</script>'));
});

test('wrong method and content type cannot send',async()=>{
 const h=harness();const get=new Request(origin+'/api/contact');
 const response=await handleContact(get,h.env,h.fetchImpl);assert.equal(response.status,405);assert.equal(response.headers.get('allow'),'POST');
 assert.equal((await handleContact(request({}, {'Content-Type':'application/json'}),h.env,h.fetchImpl)).status,415);assert.equal(h.sent.length,0);
});

test('non-form requests are passed to static assets',async()=>{
 let path;const env={ASSETS:{fetch:async request=>{path=new URL(request.url).pathname;return new Response('asset');}}};
 assert.equal(await(await worker.fetch(new Request(origin+'/about'),env)).text(),'asset');assert.equal(path,'/about');
});

test('direct contact-handler checks identify missing configuration without external calls or private values',async()=>{
 const cases=[[{SITE_ORIGIN:''},'PE01'],[{CONTACT_FORM_ENABLED:'false'},'PE02'],[{TURNSTILE_SECRET_KEY:''},'PE03'],[{CONTACT_EMAIL:undefined},'PE04'],[{CONTACT_LIMITER:undefined},'PE05']];
 for(const [overrides,code] of cases){
  const h=harness(overrides);
  const r=await handleContact(new Request(origin+'/api/contact'),h.env,h.fetchImpl);
  assert.equal(r.status,405);assert.equal(r.headers.get('allow'),'POST');
  const html=await r.text();assert(html.includes(code));assert(!html.includes('synthetic-secret'));
  assert.equal(h.sent.length,0);assert.equal(h.verified.length,0);
 }
});

test('runtime failures have distinct references and cannot send an email',async()=>{
 const scenarios=[
  {h:harness(),headers:{'CF-Connecting-IP':''},code:'PE06'},
  {h:harness({CONTACT_LIMITER:{limit:async()=>{throw Error('synthetic-secret');}}}),code:'PE07'},
  {h:harness(),fetchImpl:async()=>new Response('',{status:503}),code:'PE08'},
  {h:harness(),fetchImpl:async()=>{throw Error('synthetic-secret');},code:'PE09'},
 ];
 for(const {h,headers,code,fetchImpl} of scenarios){
  const r=await handleContact(request({},headers),h.env,fetchImpl||h.fetchImpl);
  assert.equal(r.status,503);const body=await r.text();assert(body.includes(code));assert(!body.includes('synthetic-secret'));assert.equal(h.sent.length,0);
 }
});
