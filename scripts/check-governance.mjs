import assert from 'node:assert/strict';
import { visibleIn, partnerPublished, contactAction } from '../src/lib/publication.ts';

for (const status of ['draft', 'review', 'approved', 'published', 'archived', 'unknown']) {
  const entry = { data: { status } };
  assert.equal(visibleIn(entry, true), status === 'published');
  assert.equal(visibleIn(entry, false), ['draft', 'review', 'approved', 'published'].includes(status));
  for (const publish of [false, true]) assert.equal(partnerPublished({ data: { status, publish } }), status === 'published' && publish);
}
assert.equal(visibleIn({ data: { status: 'published', confidentiality: 'internal' } }, true), false);
assert.equal(visibleIn({ data: { status: 'draft', confidentiality: 'internal' } }, false), true);
assert.equal(visibleIn({ data: { status: 'published', confidentiality: 'anonymized' } }, true), true);
for (const endpoint of [undefined, '', ' ', 'javascript:alert(1)', 'http://example.com', '//example.com', '/\\example.com', 'https://user:pass@example.com', 'https://example.com/#fragment', 'https://example.com/a b']) {
  assert.equal(contactAction(endpoint, 'true'), undefined, `Unsafe endpoint accepted: ${endpoint}`);
}
assert.equal(contactAction('/api/contact', 'true'), '/api/contact');
assert.equal(contactAction('https://example.com/contact', 'true'), 'https://example.com/contact');
for (const enabled of [undefined, '', 'false', 'TRUE']) assert.equal(contactAction('/api/contact', enabled), undefined);
console.log('Governance checks passed: status matrix, internal Work exclusion, partner consent and explicit safe contact activation.');
