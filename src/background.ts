import extensionService from './services/background/extension.service';
import featureStorageService from './services/common/feature-storage.service';

chrome.tabs.onRemoved.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onCreated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onUpdated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onActivated.addListener(() => { extensionService.updateToolbarIcon(); });

chrome.runtime.onInstalled.addListener(() => {
  // Runs on updates too, so newly added features get their default settings
  featureStorageService.initialize();
});

chrome.runtime.setUninstallURL('https://github.com/TautvydasDerzinskas/super-linkomanija');
