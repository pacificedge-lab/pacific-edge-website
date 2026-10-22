import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const astro = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
const outputCheck = fileURLToPath(new URL('./check-output.mjs', import.meta.url));
// Production form activation follows Chris's confirmed hosted delivery and Reply-To acceptance.
const env = { ...process.env, SITE_REVIEW: 'false', SITE_CONTACT_TEST: 'false', PUBLIC_CONTACT_ENABLED: 'true', ASTRO_TELEMETRY_DISABLED: '1', TELEMETRY_DISABLED: '1' };
console.log('Building production: review and test modes disabled; accepted contact form enabled.');
for (const args of [[astro, 'check'], [astro, 'build'], [outputCheck]]) {
  const result = spawnSync(process.execPath, args, { cwd: root, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
