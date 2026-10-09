/**
 * Page templates for the website, rendered by site/build.js once per language.
 * Content strings come from site/content/<lang>.json and may contain trusted HTML.
 */

// Replaces {name} placeholders with values, used for links inside translated text
export const fill = (text, values) => text.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);

// Full size screenshots from docs/images, in the order of the screenshots' captions, each with an 800px wide
// JPEG thumbnail named <name>-800.jpg in site/public/images
export const SCREENSHOTS = ['screenshot_01.png', 'screenshot_02.png', 'screenshot_03.png', 'screenshot_04.png', 'screenshot_05.png'];
const thumbnail = (file) => file.replace(/\.\w+$/, '-800.jpg');

const escapeAttribute = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const stripTags = (html) => html.replace(/<[^>]+>/g, '');

const GITHUB_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';

// Social preview image in the page's language, sources in site/og/
const ogImage = ({ t, siteUrl }) => `${siteUrl}${t.lang === 'lt' ? 'og-image-lt.jpg' : 'og-image.jpg'}`;

function structuredData(page) {
  const { t, links, siteUrl, pageUrl, version } = page;
  const application = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Super Linkomanija',
    description: t.meta.description,
    inLanguage: t.lang,
    url: pageUrl,
    image: ogImage(page),
    screenshot: SCREENSHOTS.map(file => `${siteUrl}images/${file}`),
    softwareVersion: version,
    applicationCategory: 'BrowserApplication',
    applicationSubCategory: 'Browser extension',
    operatingSystem: 'Chrome, Edge, Firefox, Opera, Vivaldi, Brave',
    downloadUrl: links.chrome,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    isAccessibleForFree: true,
    license: 'https://opensource.org/licenses/MIT',
    author: { '@type': 'Person', name: 'Tautvydas Derzinskas', url: links.author },
    sameAs: [links.repository, links.chrome, links.edge, links.firefox],
  };
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: t.lang,
    mainEntity: t.faq.items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: stripTags(fill(item.a, page.values)) },
    })),
  };
  // Escaped so the JSON can't close the script element
  return JSON.stringify(page.kind === 'home' ? [application, faq] : application).replace(/</g, '\\u003c');
}

function head(page, { title, description }) {
  const { t, root, pageUrl, alternates } = page;
  const image = ogImage(page);

  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="google-site-verification" content="y4GVVvIBxmNQEKnAO3zzxa-eARxy0kimDkY0uIiSyHc">
  <title>${title}</title>
  <meta name="description" content="${escapeAttribute(description)}">
  ${page.kind === 'not-found' ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${pageUrl}">
  <link rel="alternate" hreflang="en" href="${alternates.en}">
  <link rel="alternate" hreflang="lt" href="${alternates.lt}">
  <link rel="alternate" hreflang="x-default" href="${alternates.en}">`}
  <meta name="author" content="Tautvydas Derzinskas">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Super Linkomanija">
  <meta property="og:locale" content="${t.locale}">
  <meta property="og:locale:alternate" content="${t.lang === 'en' ? 'lt_LT' : 'en_US'}">
  <meta property="og:title" content="${escapeAttribute(title)}">
  <meta property="og:description" content="${escapeAttribute(description)}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeAttribute(t.meta.ogImageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttribute(title)}">
  <meta name="twitter:description" content="${escapeAttribute(description)}">
  <meta name="twitter:image" content="${image}">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#020617" media="(prefers-color-scheme: dark)">
  <link rel="icon" type="image/png" sizes="48x48" href="${root}images/icon_48x48.png">
  <link rel="apple-touch-icon" href="${root}images/icon_128x128.png">
  <link rel="preload" as="font" type="font/woff2" href="${root}fonts/inter-latin.woff2" crossorigin>
  <link rel="stylesheet" href="${root}styles.css">
  ${page.kind === 'home' ? `<link rel="preload" as="image" href="${root}images/header_0.webp" media="(prefers-color-scheme: light)" fetchpriority="high">
  <link rel="preload" as="image" href="${root}images/header_night.webp" media="(prefers-color-scheme: dark)" fetchpriority="high">` : ''}
  <script src="${root}main.js" defer></script>
  ${page.kind === 'home' && t.lang === 'en' ? `<script>
    // First visit with a Lithuanian browser: open the Lithuanian page, unless a language was picked before
    try { if (!localStorage.getItem('sl-lang') && /^lt\\b/i.test(navigator.language)) location.replace('lt/'); } catch {}
  </script>` : ''}
  ${page.kind === 'not-found' ? '' : `<script type="application/ld+json">${structuredData(page)}</script>`}
</head>`;
}

function header(page) {
  const { t, root, home, alternatePage } = page;
  const other = t.lang === 'en' ? 'lt' : 'en';

  return `<a class="skip-link" href="#content">${t.skipLink}</a>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="${home}" aria-label="Super Linkomanija"><img src="${root}images/icon_128x128.png" alt="" width="32" height="32"><span>Super Linkomanija</span></a>
      <nav class="site-nav" aria-label="${t.nav.label}">
        <a href="${home}#features">${t.nav.features}</a>
        <a href="${home}#screenshots">${t.nav.screenshots}</a>
        <a href="${home}#install">${t.nav.install}</a>
        <a href="${home}#faq">${t.nav.faq}</a>
        <a href="${home}#support">${t.nav.support}</a>
      </nav>
      <a class="lang-switch" href="${alternatePage}" hreflang="${other}" lang="${other}" title="${t.langSwitch.title}" data-lang="${other}">
        <img src="${root}images/flag_${other === 'lt' ? 'lithuanian' : 'english'}.svg" alt="" width="24" height="12">
        <span>${t.langSwitch.short}</span>
      </a>
      <a class="button button--small button--ghost" href="${page.links.repository}" aria-label="GitHub">${GITHUB_ICON}<span>GitHub</span></a>
    </div>
  </header>`;
}

function footer(page) {
  const { t, links, root, alternatePage } = page;
  const other = t.lang === 'en' ? 'lt' : 'en';

  return `<footer class="site-footer">
    <div class="container">
      <nav class="footer__links">
        <a href="${root}${t.lang === 'lt' ? 'lt/' : ''}privacy.html">${t.footer.privacy}</a>
        <a href="${links.repository}">${t.footer.source}</a>
        <a href="${links.changelog}">${t.footer.changelog}</a>
        <a href="${alternatePage}" hreflang="${other}" lang="${other}" data-lang="${other}">${t.langSwitch.label}</a>
      </nav>
      <p class="muted">${t.footer.license} ${t.footer.disclaimer}</p>
    </div>
  </footer>`;
}

function layout(page, meta, main) {
  return `<!doctype html>
<html lang="${page.t.lang}">
${head(page, meta)}
<body>
  ${header(page)}
  <main id="content">
${main}
  </main>
  ${footer(page)}
</body>
</html>
`;
}

export function homePage(page) {
  const { t, root, links, version, values } = page;
  const storeButtons = `<a class="button button--primary" href="${links.chrome}">${t.hero.chrome}</a>
          <a class="button button--primary" href="${links.edge}">${t.hero.edge}</a>
          <a class="button button--primary" href="${links.firefox}">${t.hero.firefox}</a>`;
  const installCard = (store) => `<div class="card install__card">
            <h3>${t.install[store].title}</h3>
            <p>${t.install[store].text}</p>
            <a class="button button--primary" href="${links[store]}">${t.install[store].button}</a>
          </div>`;

  return layout(page, { title: t.meta.title, description: t.meta.description }, `
    <section class="hero">
      <canvas class="hero__particles" aria-hidden="true"></canvas>
      <div class="container">
        <h1 class="hero__heading"><img class="hero__logo" src="${root}images/header_1.webp" alt="${t.hero.logoAlt}" width="1000" height="333" fetchpriority="high"></h1>
        <p class="hero__tagline">${t.hero.tagline}</p>
        <div class="hero__actions">
          ${storeButtons}
          <a class="button button--ghost" href="#install">${t.hero.allWays}</a>
        </div>
        <p class="hero__version">${fill(t.hero.version, { version })}</p>
      </div>
    </section>

    <section class="section" id="features">
      <div class="container">
        <div class="section__intro">
          <h2>${t.features.title}</h2>
          <p class="muted">${t.features.intro}</p>
        </div>
        <div class="features">
          ${t.features.items.map(item => `<article class="card feature">
            <span class="feature__icon">${page.icons[item.icon]}</span>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
            ${item.note ? `<p class="feature__note">${item.note}</p>` : ''}
          </article>`).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section section--alt" id="screenshots">
      <div class="container">
        <div class="section__intro"><h2>${t.screenshots.title}</h2></div>
        <div class="shots">
          ${t.screenshots.items.map((alt, index) => `<figure>
            <a href="${root}images/${SCREENSHOTS[index]}"><img src="${root}images/${thumbnail(SCREENSHOTS[index])}" alt="${escapeAttribute(alt)}" width="800" height="500" loading="lazy" decoding="async"></a>
            <figcaption>${alt}</figcaption>
          </figure>`).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section" id="install">
      <div class="container">
        <div class="section__intro">
          <h2>${t.install.title}</h2>
          <p class="muted">${t.install.intro}</p>
        </div>
        <div class="install">
          ${['chrome', 'edge', 'firefox'].map(installCard).join('\n          ')}
        </div>
        <div class="install__more">
          <div>
            <h3>${t.install.afterTitle}</h3>
            <ol>
              ${t.install.after.map(step => `<li>${step}</li>`).join('\n              ')}
            </ol>
          </div>
          <div>
            <h3>${t.install.manualTitle}</h3>
            <p>${fill(t.install.manual, values)}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt" id="faq">
      <div class="container container--narrow">
        <div class="section__intro"><h2>${t.faq.title}</h2></div>
        ${t.faq.items.map(item => `<details class="faq">
          <summary>${item.q}</summary>
          <p>${fill(item.a, values)}</p>
        </details>`).join('\n        ')}
      </div>
    </section>

    <section class="section" id="support">
      <div class="container container--narrow support">
        <h2>${t.support.title}</h2>
        <p class="muted">${t.support.text}</p>
        <div class="hero__actions">
          <a class="button button--primary" href="${links.sponsors}">${t.support.sponsors}</a>
          <a class="button button--ghost" href="${links.coffee}">${t.support.coffee}</a>
        </div>
      </div>
    </section>`);
}

export function privacyPage(page) {
  const { t, home, values, updated } = page;

  return layout(page, { title: t.privacy.metaTitle, description: t.privacy.description }, `
    <section class="section">
      <div class="container container--narrow prose">
        <h1>${t.privacy.title}</h1>
        <p class="muted">${fill(t.privacy.updated, { date: updated })}</p>
        ${t.privacy.sections.map(section => `<h2>${section.title}</h2>
        ${fill(section.body, values)}`).join('\n        ')}
        <p><a href="${home}">${t.privacy.back}</a></p>
      </div>
    </section>`);
}

export function notFoundPage(page) {
  const { t, home } = page;

  return layout(page, { title: `${t.notFound.title} – Super Linkomanija`, description: t.notFound.text }, `
    <section class="section">
      <div class="container container--narrow prose">
        <h1>${t.notFound.title}</h1>
        <p>${t.notFound.text}</p>
        <p><a class="button button--primary" href="${home}">${t.notFound.home}</a></p>
      </div>
    </section>`);
}
