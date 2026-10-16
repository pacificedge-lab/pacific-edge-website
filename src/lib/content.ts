import type { CollectionEntry } from 'astro:content';
export const isReview=import.meta.env.DEV || import.meta.env.SITE_REVIEW === 'true';
export function visible<T extends { data: { status: string; confidentiality?: string } }>(entry:T){
 if(entry.data.confidentiality==='internal')return false;
 return isReview ? entry.data.status!=='archived' : entry.data.status==='published';
}
export function partnerVisible(entry:CollectionEntry<'partners'>){return visible(entry)&&entry.data.publish;}
export function sortByOrder<T extends {data:{order:number}}>(entries:T[]){return [...entries].sort((a,b)=>a.data.order-b.data.order);}
export function titleFromKind(kind:CollectionEntry<'ideas'>['data']['kind']){return kind.split('-').map(part=>part[0].toUpperCase()+part.slice(1)).join(' ');}
