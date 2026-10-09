import extensionService from './services/background/extension.service';
import featureStorageService from './services/common/feature-storage.service';

import { ChromeStorageKeys } from './enums';
import { IMessageReleaseNotifier } from './interfaces/release-notifier';

chrome.tabs.onRemoved.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onCreated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onUpdated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onActivated.addListener(() => { extensionService.updateToolbarIcon(); });

chrome.runtime.onInstalled.addListener(async () => {
  // Runs on updates too, so newly added features get their default settings
  await extensionService.migrateLegacyStorage();
  await featureStorageService.initialize();
  await extensionService.scheduleReleaseNotifierChecks();
  await extensionService.updateReleaseNotifierBadge();
});

chrome.runtime.onStartup.addListener(async () => {
  await extensionService.scheduleReleaseNotifierChecks();
  await extensionService.updateReleaseNotifierBadge();
  await extensionService.checkWatchedReleases();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (extensionService.isReleaseNotifierAlarm(alarm)) {
    extensionService.checkWatchedReleases();
  }
});

// Popup asks for a check when the notifier is turned on, a release is saved or the user clicks "Check now"
chrome.runtime.onMessage.addListener((request: IMessageReleaseNotifier, _sender, sendResponse) => {
  if (request.releaseNotifier === 'check') {
    extensionService.checkWatchedReleases().then(() => sendResponse(true));
    return true;
  }
});

// Keeps the badge in sync with matches accepted or rejected in the popup or on the website
chrome.storage.onChanged.addListener((changes) => {
  const watchedKeys: string[] = [ChromeStorageKeys.Features, ChromeStorageKeys.ReleaseNotifier, ChromeStorageKeys.ReleaseNotifierState];
  if (Object.keys(changes).some(key => watchedKeys.includes(key))) {
    extensionService.updateReleaseNotifierBadge();
  }
  if (changes[ChromeStorageKeys.Features]) {
    extensionService.clearAutoLoginWhenDisabled();
  }
});

extensionService.listenToNotificationClicks();
chrome.permissions.onAdded.addListener(() => { extensionService.listenToNotificationClicks(); });

chrome.runtime.setUninstallURL('{{homepage}}');
