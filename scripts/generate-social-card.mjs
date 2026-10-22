// Run manually after changing this design; the committed PNG is served as-is.
// Sharp is already supplied by Astro's installed image dependencies.
import sharp from 'sharp';
import {fileURLToPath} from 'node:url';

const root=new URL('../',import.meta.url);
const font=(family)=>fileURLToPath(new URL(`node_modules/@fontsource-variable/${family}/files/${family}-latin-wght-normal.woff2`,root));
const cream='#f5f1e8';
const background=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
 <rect width="1200" height="630" fill="#081726"/>
 <path d="M1150 0C1000 150 1180 300 1040 450S1020 580 1050 630H1200V0Z" fill="#132739"/>
 <path d="M1190 0C1040 160 1220 310 1080 460S1060 590 1090 630" fill="none" stroke="#2e6573" stroke-width="2"/>
 <path d="M1225 0C1075 160 1255 310 1115 460S1095 590 1125 630" fill="none" stroke="#49a9a7" stroke-opacity=".35" stroke-width="1"/>
 <path d="M80 79V177" stroke="#49a9a7" stroke-width="4"/>
 <path d="M80 517H980" stroke="#2e6573" stroke-width="1"/>
</svg>`);
const text=async(value,family,size,weight='normal',spacing=0)=>sharp({text:{
 text:`<span foreground="${cream}" weight="${weight}" letter_spacing="${spacing*1024}">${value}</span>`,
 font:`${family==='inter'?'Inter Variable':'Source Serif 4 Variable'} ${size}`,
 fontfile:font(family),rgba:true
}}).png().toBuffer();
await sharp(background).composite([
 {input:await text('PACIFIC','inter',43,'semibold',5),left:106,top:82},
 {input:await text('EDGE','inter',43,'semibold',5),left:106,top:133},
 {input:await text('Clarity at the edge','source-serif-4',66),left:80,top:273},
 {input:await text('of complexity.','source-serif-4',66),left:80,top:352},
 {input:await text('thepacificedge.ca','inter',25,'semibold'),left:80,top:551}
]).png().toFile(fileURLToPath(new URL('public/images/pacific-edge-share-v1.png',root)));
console.log('Generated 1200 x 630 Pacific Edge share card.');
