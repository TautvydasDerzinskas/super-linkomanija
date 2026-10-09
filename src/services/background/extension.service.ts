import urlService from '../common/url.service';
import featureStorageService from '../common/feature-storage.service';
import releaseNotifierService, { IFoundRelease } from '../common/release-notifier.service';
import languageService from '../popup/language.service';
import autoLoginService from '../common/auto-login.service';
import releaseNotifierMeta from '../../features/release-notifier/meta';
import autoLoginMeta from '../../features/auto-login/meta';

import { ChromeStorageKeys } from '../../enums';

const releaseNotifierAlarm = 'sl-release-notifier';
const releaseNotifierCheckInterval = 6 * 60;
const releaseNotifierNotificationPrefix = 'sl-release-notifier:';
const maxNotificationsPerCheck = 3;

// Version 2.1.0 stored the release notifier under its former name
const legacyReleaseNotifierStorage = [
  { area: 'sync', key: 'sm-release-tracker', newKey: ChromeStorageKeys.ReleaseNotifier },
  { area: 'local', key: 'sm-release-tracker-state', newKey: ChromeStorageKeys.ReleaseNotifierState },
] as const;
const legacyReleaseNotifierId = 'sl-release-tracker';

class ExtensionService {
  public async updateToolbarIcon() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url == null) {
      return;
    }

    const iconSuffix = urlService.isLinkomanija(tab.url) ? '' : '_disabled';
    await chrome.action.setIcon({
      path: `icons/icon${iconSuffix}_16x16.png`,
      tabId: tab.id,
    });
  }

  /**
   * Moves the release notifier's data from its former name, has to run before the feature settings are initialized
   */
  public async migrateLegacyReleaseNotifier() {
    for (const { area, key, newKey } of legacyReleaseNotifierStorage) {
      const stored = await chrome.storage[area].get(key);
      if (stored[key] !== undefined) {
        await chrome.storage[area].set({ [newKey]: stored[key] });
        await chrome.storage[area].remove(key);
      }
    }

    const features = await featureStorageService.getFeatures();
    if (features?.[legacyReleaseNotifierId]) {
      features[releaseNotifierMeta.id] = features[legacyReleaseNotifierId];
      delete features[legacyReleaseNotifierId];
      await featureStorageService.setItem(ChromeStorageKeys.Features, features);
    }

    await chrome.alarms.clear(legacyReleaseNotifierId);
  }

  public async scheduleReleaseNotifierChecks() {
    // Alarms are not guaranteed to survive browser restarts
    if (!await chrome.alarms.get(releaseNotifierAlarm)) {
      await chrome.alarms.create(releaseNotifierAlarm, { periodInMinutes: releaseNotifierCheckInterval });
    }
  }

  public isReleaseNotifierAlarm(alarm: chrome.alarms.Alarm) {
    return alarm.name === releaseNotifierAlarm;
  }

  public async checkWatchedReleases() {
    if (!await this.isReleaseNotifierEnabled()) {
      return;
    }

    try {
      const foundReleases = await releaseNotifierService.check();
      await this.notifyAboutFoundReleases(foundReleases);
    } catch (error) {
      console.error('Checking watched releases failed', error);
    }
  }

  public async updateReleaseNotifierBadge() {
    const pendingMatches = await this.isReleaseNotifierEnabled() ? await releaseNotifierService.getPendingMatches() : [];
    await chrome.action.setBadgeBackgroundColor({ color: '#eb1c24' });
    await chrome.action.setBadgeText({ text: pendingMatches.length > 0 ? String(pendingMatches.length) : '' });
  }

  /**
   * Notifications are an optional permission, so the listener is added once the user grants it
   */
  public listenToNotificationClicks() {
    if (!chrome.notifications || chrome.notifications.onClicked.hasListener(this.openNotifiedTorrent)) {
      return;
    }
    chrome.notifications.onClicked.addListener(this.openNotifiedTorrent);
  }

  private openNotifiedTorrent(notificationId: string) {
    if (notificationId.startsWith(releaseNotifierNotificationPrefix)) {
      chrome.tabs.create({ url: notificationId.slice(releaseNotifierNotificationPrefix.length) });
      chrome.notifications.clear(notificationId);
    }
  }

  // Turning auto login off must not leave the token synced between browsers
  public async clearAutoLoginWhenDisabled() {
    const featureData = await featureStorageService.getFeatureData(autoLoginMeta.id);
    if (featureData && !featureData.status && (await autoLoginService.getLogin()).token) {
      await autoLoginService.clear();
    }
  }

  private async notifyAboutFoundReleases(foundReleases: IFoundRelease[]) {
    if (foundReleases.length === 0 || !await chrome.permissions.contains({ permissions: ['notifications'] })) {
      return;
    }

    this.listenToNotificationClicks();
    const { messages } = await languageService.getActiveLocale();
    for (const { release, match } of foundReleases.slice(0, maxNotificationsPerCheck)) {
      await chrome.notifications.create(releaseNotifierNotificationPrefix + match.detailsLink, {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icons/icon_128x128.png'),
        title: `${messages.releaseNotifierNotificationTitle}: ${release.searchTerm}`,
        message: match.title,
      });
    }
  }

  private async isReleaseNotifierEnabled() {
    const featureData = await featureStorageService.getFeatureData(releaseNotifierMeta.id);
    return featureData?.status ?? false;
  }
}

export default new ExtensionService();
