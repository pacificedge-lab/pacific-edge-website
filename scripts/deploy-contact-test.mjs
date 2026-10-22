import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function deployContactTest({ secret = process.env.TURNSTILE_SECRET_KEY, npmCli = process.env.npm_execpath, run = spawnSync, log = console.log } = {}) {
  if (!secret?.trim() || /[\r\n]/.test(secret) || !npmCli) {
    log('Contact test deployment stopped: configure TURNSTILE_SECRET_KEY in this Preview build and run through npm.');
    return 1;
  }
  const prefix = [npmCli, 'exec', '--yes', '--package=wrangler@4.151.1', '--', 'wrangler'];
  const target = ['--name', 'feature/coastal-editorial-site', '--config', 'wrangler.contact-test.jsonc'];
  // Build secrets are not runtime bindings. Transfer through stdin, never arguments or logs.
  // Capture both output streams so even a CLI failure cannot echo a private value.
  const upload = run(process.execPath, [...prefix, 'preview', 'secret', 'put', 'TURNSTILE_SECRET_KEY', ...target], {
    input: secret.trim() + '\n', encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
  });
  if (upload.error || upload.status !== 0) {
    log('Contact test deployment stopped: could not store the Preview runtime secret. No deployment was attempted.');
    return 1;
  }
  log('Preview runtime secret stored. Deploying the protected contact test.');
  const deployment = run(process.execPath, [...prefix, 'preview', ...target], { stdio: 'inherit' });
  return deployment.error ? 1 : deployment.status ?? 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = deployContactTest();
