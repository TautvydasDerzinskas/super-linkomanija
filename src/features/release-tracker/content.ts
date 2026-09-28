import urlService from '../../services/common/url.service';
import languageService from '../../services/popup/language.service';
import releaseTrackerService, { IFoundRelease } from '../../services/common/release-tracker.service';

import IContent from '../../interfaces/content';
import { ILocaleMessages } from '../../interfaces/locale';

import './styles/release-tracker.scss';

const noticeDuration = 3000;

class ContentReleaseTracker implements IContent {
  public async extendPageUserInterface() {
    // Content script runs in every frame, the notices belong to the main page only
    if (window !== window.top) {
      return;
    }

    const [pendingMatches, state, locale] = await Promise.all([
      releaseTrackerService.getPendingMatches(),
      releaseTrackerService.getState(),
      languageService.getActiveLocale(),
    ]);

    if (urlService.isTorrentDetailsPage()) {
      const torrentId = parseInt(window.location.href.split('details?')[1], 10);
      const openedMatch = pendingMatches.find(({ match }) => match.torrentId === torrentId);
      if (openedMatch) {
        this.insertDecisionBar(openedMatch, locale.messages);
        return;
      }
    }

    const undismissedMatches = pendingMatches.filter(({ match }) => !state.dismissedTorrentIds.includes(match.torrentId));
    if (undismissedMatches.length > 0) {
      this.insertToast(undismissedMatches, locale.messages);
    }
  }

  public cleanUp() {
    document.querySelectorAll('.release-tracker-bar, .release-tracker-toast').forEach(element => element.remove());
  }

  private insertDecisionBar({ release, match }: IFoundRelease, messages: ILocaleMessages) {
    const bar = this.createElement('div', 'release-tracker-bar');
    const text = this.createElement('div', 'release-tracker-bar__text');
    text.append(
      this.createElement('strong', '', messages.appName),
      ` · ${messages.releaseTrackerPageMatch} `,
      this.createElement('strong', '', `"${release.searchTerm}"`),
    );

    const rejectButton = this.createElement('button', 'release-tracker-bar__button', messages.releaseTrackerReject);
    const acceptButton = this.createElement(
      'button',
      'release-tracker-bar__button release-tracker-bar__button--primary',
      messages.releaseTrackerAccept,
    );

    const showNotice = (notice: string) => {
      text.textContent = notice;
      rejectButton.remove();
      acceptButton.remove();
      setTimeout(() => bar.remove(), noticeDuration);
    };
    rejectButton.addEventListener('click', async () => {
      await releaseTrackerService.rejectMatch(release.id, match.torrentId);
      showNotice(messages.releaseTrackerRejectedNotice);
    });
    acceptButton.addEventListener('click', async () => {
      await releaseTrackerService.acceptMatch(release.id);
      showNotice(messages.releaseTrackerAcceptedNotice);
    });

    bar.append(text, rejectButton, acceptButton);
    document.body.appendChild(bar);
  }

  private insertToast(foundReleases: IFoundRelease[], messages: ILocaleMessages) {
    const toast = this.createElement('div', 'release-tracker-toast');
    const header = this.createElement('div', 'release-tracker-toast__header');
    const dismissButton = this.createElement('button', 'release-tracker-toast__dismiss', '×');
    dismissButton.title = messages.releaseTrackerDismiss;
    dismissButton.addEventListener('click', () => {
      releaseTrackerService.dismissMatches(foundReleases.map(({ match }) => match.torrentId));
      toast.remove();
    });
    header.append(this.createElement('strong', '', messages.releaseTrackerToastTitle), dismissButton);

    const list = this.createElement('ul', 'release-tracker-toast__list');
    foundReleases.forEach(({ release, match }) => {
      const item = this.createElement('li', '');
      const link = this.createElement('a', '', match.title) as HTMLAnchorElement;
      link.href = match.detailsLink;
      item.append(this.createElement('span', 'release-tracker-toast__term', release.searchTerm), link);
      list.appendChild(item);
    });

    toast.append(header, list);
    document.body.appendChild(toast);
  }

  // Text is set through textContent, as search terms and torrent titles must not be treated as HTML
  private createElement(tagName: string, className: string, text?: string) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (text) {
      element.textContent = text;
    }
    return element;
  }
}

export default new ContentReleaseTracker();
