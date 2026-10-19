import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const review=process.argv.includes('--review');
const directory=path.resolve('dist');
const files=fs.readdirSync(directory,{recursive:true}).filter(file=>file.endsWith('.html'));
const failures=[];
let links=0;
const resolveRoute=(url)=>{
 const local=path.join(directory,decodeURIComponent(url));
 return [local,path.join(local,'index.html'),local+'.html'].find(file=>fs.existsSync(file)&&fs.statSync(file).isFile());
};
for(const file of files){
 const html=fs.readFileSync(path.join(directory,file),'utf8');
 if(html.includes('http-equiv="refresh"'))continue;
 const check=(test,message)=>{if(!test)failures.push(file+': '+message);};
 check((html.match(/<h1(?:\s|>)/g)||[]).length===1,'expected one primary heading');
 check(/<meta name="description" content="[^"]+"/.test(html),'missing description');
 check(/<link rel="canonical" href="https:\/\/thepacificedge.ca\//.test(html),'incorrect canonical domain');
 check(!html.includes('PE_ASSET_'),'unresolved image token');
 check(!html.includes('data-page='),'prototype-only page interaction remains');
 if(review){
  check(html.includes('noindex, nofollow'),'review page must not be indexed');
  check(html.includes('Website draft for review'),'review banner missing');
 }
 if(!review){
  check(!html.includes('data-case-placeholder'),'case placeholder leaked into public output');
  check(!html.includes('Website draft for review'),'draft banner leaked into public output');
 }
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
 check(new Set(ids).size===ids.length,'duplicate element ids');
 for(const match of html.matchAll(/(?:href|src)="([^"\s]+)"/g)){
  const url=match[1];
  if(!url.startsWith('/')&&!url.startsWith('#'))continue;
  if(url.startsWith('//'))continue;
  links++;
  const [urlPath,hash]=url.split('#');
  const target=urlPath?resolveRoute(urlPath.split('?')[0]):path.join(directory,file);
  check(Boolean(target),'broken local resource '+url);
  if(target&&hash&&target.endsWith('.html')){
   const targetHtml=target===path.join(directory,file)?html:fs.readFileSync(target,'utf8');
   check(targetHtml.includes('id="'+decodeURIComponent(hash)+'"'),'missing anchor '+url);
  }
 }
}
const home=fs.readFileSync(path.join(directory,'index.html'),'utf8');
for(const service of ['Strategy and direction','Operations and capability','Advisory and leadership'])assert(home.includes(service),'missing core service '+service);
if(review){
 const contact=fs.readFileSync(path.join(directory,'contact/index.html'),'utf8');
 const form=contact.match(/<form\b[^>]*>/)?.[0];
 assert(form&&form.includes('data-live="false"'),'review contact form must be disabled');
 assert(!/\saction=/.test(form),'review contact form must have no submission URL');
 const fields=[...contact.matchAll(/<(?:input|textarea|button)\b[^>]*>/g)];
 assert(fields.length>=6&&fields.every(([tag])=>/\sdisabled(?:[\s=>])/.test(tag)),'all review contact fields and submit button must be disabled');
 assert(contact.includes('Review preview: enquiries are not submitted.'),'review contact explanation missing');
 assert(!contact.includes('src="https://challenges.cloudflare.com/turnstile/'),'review must not load the live verification widget');
 const advisory=fs.readFileSync(path.join(directory,'advisory/index.html'),'utf8');
 for(const id of ['fibre-delivery-operating-model','workforce-reporting-recovery']){
  const route='/work/'+id;
  assert(resolveRoute(route),'review case account missing: '+route);
  assert(home.includes('href="'+route+'"'),'homepage case link missing: '+route);
  assert(advisory.includes('href="'+route+'"'),'advisory case link missing: '+route);
  const account=fs.readFileSync(resolveRoute(route),'utf8');
  assert(account.replaceAll('&#39;', "'").includes("Chris McLean's prior professional experience"),'prior-experience attribution missing: '+route);
 }
 assert(!home.includes('data-case-placeholder'),'supplied case accounts must replace homepage placeholders');
 assert(resolveRoute('/labs/isef-support'),'ISEF review entry missing');
}else{
 for(const id of ['fibre-delivery-operating-model','workforce-reporting-recovery']){
  assert(!resolveRoute('/work/'+id),'review-only case account was emitted: '+id);
  assert(!home.includes('/work/'+id),'unpublished case link was emitted: '+id);
 }
 assert(!resolveRoute('/labs/isef-support'),'unpublished ISEF entry was emitted');
 assert(!resolveRoute('/work/ai-operating-capability'),'archived work was emitted');
 assert(!resolveRoute('/labs/proposal-environment'),'archived internal portfolio was emitted');
 assert(!home.includes('href="/partners"'),'unconfirmed partner link emitted');
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log(`${review?'Review':'Production'} output passed: ${files.length} HTML files, ${links} local references, headings, metadata and publication checks.`);
