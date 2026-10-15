import type {APIRoute} from 'astro';
import {getCollection} from 'astro:content';
import {isReview,visible,partnerVisible} from '../lib/content';
export const GET:APIRoute=async({site})=>{
 const work=(await getCollection('work')).filter(visible);
 const labs=(await getCollection('labs')).filter(visible);
 const ideas=(await getCollection('ideas')).filter(visible);
 const partners=(await getCollection('partners')).filter(partnerVisible);
 const routes=['/','/advisory','/ai','/first-nations','/labs','/about','/contact',...(work.length?['/work']:[]),...(partners.length?['/partners']:[]),...(ideas.length?['/ideas']:[]),...work.map(e=>'/work/'+e.id),...labs.map(e=>'/labs/'+e.id),...ideas.map(e=>'/ideas/'+e.id)];
 const urls=isReview?[]:routes;
 return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(route=>'<url><loc>'+new URL(route,site).href+'</loc></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml'}});
};
