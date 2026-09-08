import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Pass the original generated image path; keep only optimized derivatives in public.
const source = process.argv[2];
if (!source) throw new Error('Provide the original coastal image path.');
await mkdir(new URL('../public/images/', import.meta.url), { recursive: true });
for (const width of [768, 1536]) {
  const name = width === 1536 ? 'pacific-coast.webp' : 'pacific-coast-768.webp';
  await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 82 })
    .toFile(fileURLToPath(new URL(`../public/images/${name}`, import.meta.url)));
}
