import test from 'node:test';
import assert from 'node:assert/strict';
import { deployContactTest } from '../scripts/deploy-contact-test.mjs';

test('contact deploy requires a build secret before making external calls', () => {
  let calls = 0;
  const result = deployContactTest({ secret: '', npmCli: '/npm-cli.js', run: () => { calls++; }, log: () => {} });
  assert.equal(result, 1);
  assert.equal(calls, 0);
});

test('runtime secret is sent through stdin to the exact preview before deployment', () => {
  const calls = [], logs = [], secret = 'synthetic-private-key';
  const result = deployContactTest({ secret, npmCli: '/npm-cli.js', run: (...args) => { calls.push(args); return { status: 0 }; }, log: message => logs.push(message) });
  assert.equal(result, 0);
  assert.equal(calls.length, 2);
  assert(calls[0][1].includes('TURNSTILE_SECRET_KEY'));
  assert(calls[0][1].includes('feature/coastal-editorial-site'));
  assert.equal(calls[0][2].input, secret + '\n');
  assert.deepEqual(calls[0][2].stdio, ['pipe', 'pipe', 'pipe']);
  assert(!JSON.stringify(calls.map(call => call[1])).includes(secret));
  assert(!logs.join('').includes(secret));
  assert(!calls[1][1].includes('put'));
  assert(calls[1][1].includes('wrangler.contact-test.jsonc'));
});

test('failed secret upload prevents deployment and does not echo CLI output', () => {
  let calls = 0; const logs = [];
  const result = deployContactTest({ secret: 'synthetic-private-key', npmCli: '/npm-cli.js', run: () => { calls++; return { status: 1, stderr: 'synthetic-private-key' }; }, log: message => logs.push(message) });
  assert.equal(result, 1);
  assert.equal(calls, 1);
  assert(!logs.join('').includes('synthetic-private-key'));
});

test('deployment failure is not reported as success', () => {
  let calls = 0;
  assert.equal(deployContactTest({ secret: 'synthetic-private-key', npmCli: '/npm-cli.js', run: () => ({ status: ++calls === 1 ? 0 : 1 }), log: () => {} }), 1);
});
