/**
 * Publishes the Firefox build to addons.mozilla.org, used by semantic-release:
 *   node config/release/firefox.js verify   - checks that AMO credentials are set
 *   node config/release/firefox.js publish  - uploads extension-firefox/ with its source code
 *
 * Credentials come from WEB_EXT_API_KEY and WEB_EXT_API_SECRET (read by web-ext directly).
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const TMP = path.resolve(ROOT, '.tmp');

const APPROVAL_NOTES = `The source is TypeScript, SCSS and React, bundled with webpack 5.

Build environment: Node.js 24 with the npm version bundled with it (any OS).

Build steps:
1. Unzip the source code package and open a terminal in its root folder (the one containing package.json).
2. Run \`npm ci\` - installs the exact dependency versions pinned in package-lock.json.
3. Run \`npm run build:firefox\`.
4. The built add-on is written to the \`extension-firefox/\` folder, identical to the submitted package.

Third-party files: \`sceditor.min.js\` and \`bbcode.js\` are copied unmodified from the \`sceditor\` npm package (node_modules/sceditor/minified/). All other JavaScript is compiled from \`src/\`.

The add-on only runs on linkomanija.net pages. It collects no data and loads no remote code. The dynamic import() in popup.bundle.js is unused React Router code for loading route modules, the popup uses plain declarative routes so it never runs.`;

// Latest CHANGELOG.md section as plain text, AMO release notes do not render markdown
function latestReleaseNotes() {
  const changelog = readFileSync(path.resolve(ROOT, 'CHANGELOG.md'), 'utf8');
  const [, section = ''] = changelog.split(/^#{1,2} \[?\d+\.\d+\.\d+.*$/m);
  return section
    .replace(/\s*\(\[[0-9a-f]{7,}\]\([^)]*\)\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^\* /gm, '- ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function verify() {
  const missing = ['WEB_EXT_API_KEY', 'WEB_EXT_API_SECRET'].filter(name => !process.env[name]);
  if (missing.length) {
    throw new Error(`Missing AMO credentials: ${missing.join(', ')}`);
  }
}

function publish() {
  mkdirSync(TMP, { recursive: true });

  // Runs after @semantic-release/git committed the release, so HEAD matches the uploaded build
  execFileSync('npm', ['run', 'zip:source'], { cwd: ROOT, stdio: 'inherit' });

  const metadataPath = path.resolve(TMP, 'amo-metadata.json');
  writeFileSync(metadataPath, JSON.stringify({
    version: {
      approval_notes: APPROVAL_NOTES,
      release_notes: { 'en-US': latestReleaseNotes() },
    },
  }));

  execFileSync('npx', [
    'web-ext', 'sign',
    '--channel', 'listed',
    '--source-dir', 'extension-firefox',
    '--upload-source-code', 'sl-source.zip',
    '--amo-metadata', metadataPath,
    '--artifacts-dir', path.resolve(TMP, 'web-ext-artifacts'),
    // Only wait for AMO validation, human review can take days
    '--approval-timeout', '0',
  ], { cwd: ROOT, stdio: 'inherit' });
}

const command = process.argv[2];
if (command === 'verify') {
  verify();
} else if (command === 'publish') {
  verify();
  publish();
} else {
  throw new Error(`Unknown command "${command}", expected "verify" or "publish"`);
}
