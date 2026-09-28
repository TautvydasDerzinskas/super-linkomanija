import urlService from '../common/url.service';
import featureStorageService from '../common/feature-storage.service';
import releaseTrackerService, { IFoundRelease } from '../common/release-tracker.service';
import languageService from '../popup/language.service';
import releaseTrackerMeta from '../../features/release-tracker/meta';

const releaseTrackerAlarm = 'sl-release-tracker';
const releaseTrackerCheckInterval = 6 * 60;
const releaseTrackerNotificationPrefix = 'sl-release-tracker:';
const maxNotificationsPerCheck = 3;

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

  public async scheduleReleaseTrackerChecks() {
    // Alarms are not guaranteed to survive browser restarts
    if (!await chrome.alarms.get(releaseTrackerAlarm)) {
      await chrome.alarms.create(releaseTrackerAlarm, { periodInMinutes: releaseTrackerCheckInterval });
    }
  }

  public isReleaseTrackerAlarm(alarm: chrome.alarms.Alarm) {
    return alarm.name === releaseTrackerAlarm;
  }

  public async checkTrackedReleases() {
    if (!await this.isReleaseTrackerEnabled()) {
      return;
    }

    try {
      const foundReleases = await releaseTrackerService.check();
      await this.notifyAboutFoundReleases(foundReleases);
    } catch (error) {
      console.error('Checking tracked releases failed', error);
    }
  }

  public async updateReleaseTrackerBadge() {
    const pendingMatches = await this.isReleaseTrackerEnabled() ? await releaseTrackerService.getPendingMatches() : [];
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
    if (notificationId.startsWith(releaseTrackerNotificationPrefix)) {
      chrome.tabs.create({ url: notificationId.slice(releaseTrackerNotificationPrefix.length) });
      chrome.notifications.clear(notificationId);
    }
  }

  private async notifyAboutFoundReleases(foundReleases: IFoundRelease[]) {
    if (foundReleases.length === 0 || !await chrome.permissions.contains({ permissions: ['notifications'] })) {
      return;
    }

    this.listenToNotificationClicks();
    const { messages } = await languageService.getActiveLocale();
    for (const { release, match } of foundReleases.slice(0, maxNotificationsPerCheck)) {
      await chrome.notifications.create(releaseTrackerNotificationPrefix + match.detailsLink, {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icons/icon_128x128.png'),
        title: `${messages.releaseTrackerNotificationTitle}: ${release.searchTerm}`,
        message: match.title,
      });
    }
  }

  private async isReleaseTrackerEnabled() {
    const featureData = await featureStorageService.getFeatureData(releaseTrackerMeta.id);
    return featureData?.status ?? false;
  }
}

export default new ExtensionService();
