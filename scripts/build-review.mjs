import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const astro = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
const outputCheck = fileURLToPath(new URL('./check-output.mjs', import.meta.url));
const env = {
  ...process.env,
  SITE_REVIEW: 'true',
  PUBLIC_CONTACT_ENABLED: 'false',
  ASTRO_TELEMETRY_DISABLED: '1',
  TELEMETRY_DISABLED: '1',
};

console.log('Building website review: SITE_REVIEW=true; contact form disabled.');
for (const args of [[astro, 'check'], [astro, 'build'], [outputCheck, '--review']]) {
  const result = spawnSync(process.execPath, args, { cwd: root, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (result.signal) console.error(`Review build stopped by ${result.signal}.`);
    process.exit(result.status ?? 1);
  }
}
