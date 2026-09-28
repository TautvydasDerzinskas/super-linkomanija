import extensionService from './services/background/extension.service';
import featureStorageService from './services/common/feature-storage.service';

import { ChromeStorageKeys } from './enums';
import { IMessageReleaseTracker } from './interfaces/release-tracker';

chrome.tabs.onRemoved.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onCreated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onUpdated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onActivated.addListener(() => { extensionService.updateToolbarIcon(); });

chrome.runtime.onInstalled.addListener(async () => {
  // Runs on updates too, so newly added features get their default settings
  await featureStorageService.initialize();
  await extensionService.scheduleReleaseTrackerChecks();
  await extensionService.updateReleaseTrackerBadge();
});

chrome.runtime.onStartup.addListener(async () => {
  await extensionService.scheduleReleaseTrackerChecks();
  await extensionService.updateReleaseTrackerBadge();
  await extensionService.checkTrackedReleases();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (extensionService.isReleaseTrackerAlarm(alarm)) {
    extensionService.checkTrackedReleases();
  }
});

// Popup asks for a check when the tracker is turned on, a release is saved or the user clicks "Check now"
chrome.runtime.onMessage.addListener((request: IMessageReleaseTracker, _sender, sendResponse) => {
  if (request.releaseTracker === 'check') {
    extensionService.checkTrackedReleases().then(() => sendResponse(true));
    return true;
  }
});

// Keeps the badge in sync with matches accepted or rejected in the popup or on the website
chrome.storage.onChanged.addListener((changes) => {
  const trackedKeys: string[] = [ChromeStorageKeys.Features, ChromeStorageKeys.ReleaseTracker, ChromeStorageKeys.ReleaseTrackerState];
  if (Object.keys(changes).some(key => trackedKeys.includes(key))) {
    extensionService.updateReleaseTrackerBadge();
  }
  if (changes[ChromeStorageKeys.Features]) {
    extensionService.clearAutoLoginWhenDisabled();
  }
});

extensionService.listenToNotificationClicks();
chrome.permissions.onAdded.addListener(() => { extensionService.listenToNotificationClicks(); });

chrome.runtime.setUninstallURL('{{homepage}}');
