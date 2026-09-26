/**
 * Builds the website into _site/ for GitHub Pages: node site/build.js
 * English is served from the root, Lithuanian from /lt/, each page linking the other as its translation.
 */
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { homePage, notFoundPage, privacyPage } from './templates.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.resolve(ROOT, '_site');
const pkg = JSON.parse(readFileSync(path.resolve(ROOT, 'package.json'), 'utf8'));

const SITE_URL = pkg.homepage.endsWith('/') ? pkg.homepage : `${pkg.homepage}/`;
const REPOSITORY = pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, '');
// Date shown on the privacy policy, change it together with the policy's text
const PRIVACY_UPDATED = { en: 'September 26, 2026', lt: '2026 m. rugsėjo 26 d.' };

const links = {
  chrome: 'https://chromewebstore.google.com/detail/gmdhkalbljdblbogfladannflinppnji',
  edge: 'https://microsoftedge.microsoft.com/addons/detail/dhmdmhhmpkhafcffhbihnpnfeknnnmlk',
  firefox: 'https://addons.mozilla.org/en-GB/firefox/addon/super-linkomanija/',
  repository: REPOSITORY,
  releases: `${REPOSITORY}/releases/latest`,
  issues: `${REPOSITORY}/issues`,
  changelog: `${REPOSITORY}/blob/main/CHANGELOG.md`,
  sponsors: 'https://github.com/sponsors/TautvydasDerzinskas',
  coffee: 'https://buymeacoffee.com/TautvydasDerzinskas',
  author: pkg.author.url,
};

const languages = ['en', 'lt'];
const content = Object.fromEntries(languages.map(lang => [lang, JSON.parse(readFileSync(path.resolve(import.meta.dirname, `content/${lang}.json`), 'utf8'))]));
const directory = (lang) => (lang === 'en' ? '' : `${lang}/`);

// Both languages must have the same structure, otherwise a translation was missed
function keysOf(value, prefix = '') {
  if (Array.isArray(value)) {
    return [`${prefix}[${value.length}]`, ...value.flatMap((item, index) => keysOf(item, `${prefix}[${index}]`))];
  }
  return value && typeof value === 'object' ? Object.entries(value).flatMap(([key, item]) => keysOf(item, `${prefix}.${key}`)) : [prefix];
}
const [enKeys, ltKeys] = languages.map(lang => new Set(keysOf(content[lang])));
const untranslated = [...enKeys].filter(key => !ltKeys.has(key)).concat([...ltKeys].filter(key => !enKeys.has(key)));
if (untranslated.length) {
  throw new Error(`site/content/en.json and lt.json differ at: ${untranslated.join(', ')}`);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(path.resolve(OUT, 'images'), { recursive: true });

const write = (file, html) => {
  // A placeholder left in the output means a missing value
  const leftover = html.match(/\{[a-z]+\}/i);
  if (leftover && !file.endsWith('.xml')) {
    throw new Error(`Unfilled placeholder ${leftover[0]} in ${file}`);
  }
  mkdirSync(path.dirname(path.resolve(OUT, file)), { recursive: true });
  writeFileSync(path.resolve(OUT, file), html);
};

// The extension's icons, inlined so they take the page's colours
const icons = Object.fromEntries([...new Set(content.en.features.items.map(item => item.icon))].map(name => [
  name,
  readFileSync(path.resolve(ROOT, `src/assets/vectors/${name}.svg`), 'utf8')
    .replace(/<\?xml[^>]*>\s*/, '')
    .replace('<svg', '<svg aria-hidden="true" focusable="false"')
    .replace(/\s+/g, ' ')
    .trim(),
]));

const pages = [
  { kind: 'home', file: 'index.html', render: homePage, url: '' },
  { kind: 'privacy', file: 'privacy.html', render: privacyPage, url: 'privacy.html' },
];

for (const lang of languages) {
  const root = lang === 'en' ? '' : '../';
  for (const { kind, file, render, url } of pages) {
    const other = lang === 'en' ? 'lt' : 'en';
    write(`${directory(lang)}${file}`, render({
      kind,
      t: content[lang],
      root,
      home: `${root}${directory(lang)}` || './',
      alternatePage: `${root}${directory(other)}${url}`,
      pageUrl: `${SITE_URL}${directory(lang)}${url}`,
      alternates: Object.fromEntries(languages.map(code => [code, `${SITE_URL}${directory(code)}${url}`])),
      siteUrl: SITE_URL,
      links,
      icons,
      version: pkg.version,
      updated: PRIVACY_UPDATED[lang],
      values: { ...links, privacy: `${root}${directory(lang)}privacy.html` },
    }));
  }
}

// GitHub Pages serves 404.html for any missing path, so it links with absolute paths
const basePath = new URL(SITE_URL).pathname;
write('404.html', notFoundPage({
  kind: 'not-found',
  t: content.en,
  root: basePath,
  home: basePath,
  alternatePage: `${basePath}lt/`,
  pageUrl: `${SITE_URL}404.html`,
  siteUrl: SITE_URL,
  links,
}));

const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.flatMap(({ url, kind }) => languages.map(lang => `  <url>
    <loc>${SITE_URL}${directory(lang)}${url}</loc>
${languages.map(code => `    <xhtml:link rel="alternate" hreflang="${code}" href="${SITE_URL}${directory(code)}${url}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${url}"/>
    <lastmod>${today}</lastmod>
    <priority>${kind === 'home' ? '1.0' : '0.3'}</priority>
  </url>`)).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`);

// Static files and images shared with the extension and the README
const copy = (from, to) => cpSync(path.resolve(ROOT, from), path.resolve(OUT, to), { recursive: true });
copy('site/public', '.');
for (const number of [1, 2, 3, 4]) {
  copy(`docs/images/screenshot_0${number}.jpg`, `images/screenshot_0${number}.jpg`);
}
for (const icon of ['icon_48x48.png', 'icon_128x128.png']) {
  copy(`src/assets/icons/${icon}`, `images/${icon}`);
}
copy('src/assets/images/header_0.webp', 'images/header_0.webp');
copy('src/assets/images/header_1.webp', 'images/header_1.webp');
for (const flag of ['flag_english', 'flag_lithuanian']) {
  copy(`src/assets/vectors/${flag}.svg`, `images/${flag}.svg`);
}

console.log(`Website built into ${path.relative(ROOT, OUT)}/ for ${SITE_URL}`);
