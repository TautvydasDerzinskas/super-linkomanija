import featureStorageService from '../../services/common/feature-storage.service';

import { ChromeStorageKeys } from '../../enums';
import { IFeaturesStorageObject } from '../../interfaces/feature';

import meta from './meta';
import { CATEGORY_ICONS } from './category-icons';

/**
 * Theme follows system: shows Linkomanija in its light or dark theme (and matching category icons) according to the
 * system theme, without changing the profile. The site only differs between themes in its stylesheet
 * (css/lmlight-<version>.css or css/lmdark-<version>.css) and the category icon set, so both are swapped in place.
 */

type Theme = 'light' | 'dark';

// Icon sets used with each theme: Spalvotos (colourful) for light, Tamsios (dark) for dark
const ICON_SETS: Record<Theme, number> = { light: 5, dark: 4 };

const STYLESHEET = /\/css\/lm(light|dark)-/;
const ICON = /\/categories\/(\d)\/([^?#]+)$/;

// Mirrors the feature status on the site, as chrome.storage can only be read asynchronously, too late to avoid a flash
const STATUS_CACHE_KEY = 'sl-theme-sync';

const ORIGINAL_HREF = 'slOriginalHref';
const ORIGINAL_SRC = 'slOriginalSrc';

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
let observer: MutationObserver = null;

const systemTheme = (): Theme => darkQuery.matches ? 'dark' : 'light';

const iconFor = (src: string, theme: Theme) => {
  const match = ICON.exec(src);
  if (!match) {
    return src;
  }

  const set = Number(match[1]);
  let file = match[2];
  try {
    file = decodeURIComponent(file);
  } catch {
    // Keep the name as it is
  }

  const row = CATEGORY_ICONS.find(files => files[set - 1] === file);
  return row ? `${src.slice(0, match.index)}/categories/${ICON_SETS[theme]}/${row[ICON_SETS[theme] - 1]}` : src;
};

const applyToElement = (element: Element, theme: Theme) => {
  if (element instanceof HTMLLinkElement) {
    const href = element.dataset[ORIGINAL_HREF] ?? element.getAttribute('href');
    if (href && STYLESHEET.test(href)) {
      element.dataset[ORIGINAL_HREF] = href;
      const themed = href.replace(STYLESHEET, `/css/lm${theme}-`);
      if (element.getAttribute('href') !== themed) {
        element.setAttribute('href', themed);
      }
    }
  } else if (element instanceof HTMLImageElement) {
    const src = element.dataset[ORIGINAL_SRC] ?? element.getAttribute('src');
    if (src && ICON.test(src)) {
      element.dataset[ORIGINAL_SRC] = src;
      const themed = iconFor(src, theme);
      if (element.getAttribute('src') !== themed) {
        element.setAttribute('src', themed);
      }
    }
  }
};

const applyToTree = (root: ParentNode, theme: Theme) => {
  if (root instanceof Element) {
    applyToElement(root, theme);
  }
  root.querySelectorAll('link[href*="/css/lm"], img[src*="/categories/"]').forEach(element => applyToElement(element, theme));
};

// The extension's own styles look for this class, see decideTheme in content.ts
const syncBodyClass = () => {
  const stylesheet = document.querySelector('link[href*="/css/lm"]');
  if (document.body && stylesheet) {
    document.body.classList.toggle('sl--theme-dark', stylesheet.getAttribute('href').includes('/css/lmdark-'));
  }
};

const applyTheme = () => {
  applyToTree(document, systemTheme());
  syncBodyClass();
};

const enable = () => {
  if (observer) {
    return;
  }

  // Swaps the stylesheet and icons as the page is parsed, and in content added later
  observer = new MutationObserver(mutations => {
    const theme = systemTheme();
    mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
      if (node instanceof Element) {
        applyToTree(node, theme);
      }
    }));
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  darkQuery.addEventListener('change', applyTheme);
  applyTheme();
};

const disable = () => {
  if (!observer) {
    return;
  }

  observer.disconnect();
  observer = null;
  darkQuery.removeEventListener('change', applyTheme);

  // Back to the theme and icons chosen in the profile
  document.querySelectorAll<HTMLElement>('[data-sl-original-href], [data-sl-original-src]').forEach(element => {
    if (element.dataset[ORIGINAL_HREF]) {
      element.setAttribute('href', element.dataset[ORIGINAL_HREF]);
    }
    if (element.dataset[ORIGINAL_SRC]) {
      element.setAttribute('src', element.dataset[ORIGINAL_SRC]);
    }
  });
  syncBodyClass();
};

const setStatus = (enabled: boolean) => {
  try {
    if (enabled) {
      localStorage.setItem(STATUS_CACHE_KEY, '1');
    } else {
      localStorage.removeItem(STATUS_CACHE_KEY);
    }
  } catch {
    // Storage can be blocked, the theme then switches once the extension storage is read
  }

  if (enabled) {
    enable();
  } else {
    disable();
  }
};

const readCachedStatus = () => {
  try {
    return localStorage.getItem(STATUS_CACHE_KEY) === '1';
  } catch {
    return false;
  }
};

// Start straight away when the feature was on last time, then confirm with the stored status
if (readCachedStatus()) {
  enable();
}
featureStorageService.getFeatureData(meta.id).then(featureData => setStatus(Boolean(featureData?.status)));

// Switching the feature in the popup applies to open tabs straight away
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes[ChromeStorageKeys.Features]) {
    const features = featureStorageService.convertToJson<IFeaturesStorageObject>(changes[ChromeStorageKeys.Features].newValue as string);
    if (features?.[meta.id]) {
      setStatus(features[meta.id].status);
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (observer) {
    syncBodyClass();
  }
});
