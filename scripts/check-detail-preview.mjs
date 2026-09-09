import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';

// Exercise the real draft routes in a running local development server.
const origin = process.argv[2] || 'http://127.0.0.1:4321';
const url = new URL(origin);
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname), 'Use a local preview server');
let count = 0;
for (const collection of ['work', 'labs', 'ideas']) {
  const entries = (await readdir(new URL(`../src/content/${collection}/`, import.meta.url))).filter((name) => name.endsWith('.md'));
  for (const file of entries) {
    const slug = file.slice(0, -3);
    const response = await fetch(new URL(`/${collection}/${slug}`, origin));
    assert.equal(response.status, 200, `${collection}/${slug} failed`);
    const html = await response.text();
    assert.ok(html.includes(`detail-page--${collection}`), `Wrong template: ${slug}`);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `Expected one h1: ${slug}`);
    assert.ok(html.includes('aria-label="Back to collection"'), `Missing collection navigation: ${slug}`);
    assert.ok(html.includes(`property="og:type" content="${collection === 'ideas' ? 'article' : 'website'}"`), `Wrong social type: ${slug}`);
    const related = html.split('class="detail-related-grid"')[1]?.split('</section>')[0] || '';
    assert.equal(related.includes(`href="/${collection}/${slug}"`), false, `Self-link in related entries: ${slug}`);
    assert.equal((related.match(/<article[ >]/g) || []).length, Math.min(2, entries.length - 1), `Unexpected related count: ${slug}`);
    if (collection === 'labs') {
      assert.ok(html.includes('Development status'), `Missing status: ${slug}`);
      const header = html.match(/<header class="site-header[^\"]*"/)?.[0];
      assert.ok(header && !header.includes('site-header--light'), `Wrong dark-hero navigation contrast: ${slug}`);
    }
    count++;
  }
}
console.log(`Detail preview passed: ${count} routes, template variants, headings, metadata, collection navigation and related entries.`);
