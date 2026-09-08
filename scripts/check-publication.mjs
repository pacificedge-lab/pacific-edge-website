import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const exists = async (file) => access(file).then(() => true, () => false);
async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory()
    ? htmlFiles(path.join(directory, entry.name))
    : entry.name.endsWith('.html') ? [path.join(directory, entry.name)] : []))).flat();
}
const files = await htmlFiles(dist);
const pages = await Promise.all(files.map((file) => readFile(file, 'utf8')));
const allHtml = pages.join('\n');
let unpublished = 0;
for (const collection of ['work', 'labs', 'ideas']) {
  const directory = path.join(root, 'src/content', collection);
  for (const name of await readdir(directory)) {
    if (!name.endsWith('.md')) continue;
    const source = await readFile(path.join(directory, name), 'utf8');
    if (/^status: published\s*$/m.test(source)) continue;
    const slug = name.slice(0, -3);
    assert.equal(await exists(path.join(dist, collection, slug, 'index.html')), false, `Unpublished route leaked: ${collection}/${slug}`);
    assert.equal(allHtml.includes(`/${collection}/${slug}`), false, `Unpublished link leaked: ${slug}`);
    const title = source.match(/^title: (.+)$/m)?.[1];
    if (title) assert.equal(allHtml.includes(title), false, `Unpublished title leaked: ${title}`);
    unpublished++;
  }
}
for (const html of pages) {
  assert.equal(/<script\b/i.test(html), false, 'Unexpected client-side JavaScript in static output');
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const relative = decodeURIComponent(href).replace(/^\//, '');
    assert.ok(await exists(path.join(dist, relative)) || await exists(path.join(dist, relative, 'index.html')), `Broken local link: ${href}`);
  }
}
const homepage = await readFile(path.join(dist, 'index.html'), 'utf8');
assert.equal(homepage.includes('home-partners'), false, 'Partners unexpectedly published in the dormant baseline');
const contact = await readFile(path.join(dist, 'contact/index.html'), 'utf8');
assert.equal(/<form\b/i.test(contact), false, 'Contact form must remain disabled in the endpoint-free baseline');
console.log(`Publication checks passed: ${unpublished} unpublished entries excluded, ${files.length} static pages, valid local links, no client scripts, dormant Partners and disabled contact.`);
