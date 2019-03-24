
import extensionService from './services/background/extension.service';
import analyticsService from './services/common/analytics.service';
import featureStorageService from './services/common/feature-storage.service';

analyticsService.initialize();

chrome.tabs.onRemoved.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onCreated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onUpdated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onActivated.addListener(() => { extensionService.updateToolbarIcon(); });

const gitRepoUrl = 'https://github.com/SlimDogs/super-linkomanija';
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason = 'install') {
    featureStorageService.initialize();
    analyticsService.trackPageView('install');
  }
});
chrome.runtime.setUninstallURL(gitRepoUrl, () => {
  analyticsService.trackPageView('uninstall');
});
