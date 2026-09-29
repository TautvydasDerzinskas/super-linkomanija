/**
 * Zips every browser build from dist/ (run `npm run build:dist` first) into dist/zips/:
 *   dist/zips/sl-chrome.zip, dist/zips/sl-edge.zip, dist/zips/sl-firefox.zip
 */
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { zip } from 'bestzip';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DIST = path.resolve(ROOT, 'dist');
const ZIPS = path.resolve(DIST, 'zips');
const TARGETS = ['chrome', 'edge', 'firefox'];

const missing = TARGETS.filter(target => !existsSync(path.resolve(DIST, target)));
if (missing.length) {
  throw new Error(`Missing builds in dist/: ${missing.join(', ')}. Run \`npm run build:dist\` first.`);
}

rmSync(ZIPS, { recursive: true, force: true });
mkdirSync(ZIPS, { recursive: true });

for (const target of TARGETS) {
  const destination = path.resolve(ZIPS, `sl-${target}.zip`);
  // Files go in the zip root, stores expect manifest.json at the top level
  await zip({ cwd: path.resolve(DIST, target), source: '*', destination });
  console.log(`Created ${path.relative(ROOT, destination)}`);
}
