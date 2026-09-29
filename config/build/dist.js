/**
 * Builds the extension for every browser into dist/:
 *   dist/chrome  - Chrome build
 *   dist/edge    - Edge build (same as Chrome, Edge runs Chromium extensions)
 *   dist/firefox - Firefox build
 */
import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DIST = path.resolve(ROOT, 'dist');
const WEBPACK_CONFIG = path.resolve(ROOT, 'config/webpack/webpack.config.js');
const TARGETS = ['chrome', 'edge', 'firefox'];

rmSync(DIST, { recursive: true, force: true });

for (const target of TARGETS) {
  console.log(`Building ${target}...`);
  execFileSync('npx', [
    'webpack',
    `--config=${WEBPACK_CONFIG}`,
    '--mode=production',
    '--env', `target=${target}`,
    '--output-path', path.resolve(DIST, target),
  ], { cwd: ROOT, stdio: 'inherit' });
}
