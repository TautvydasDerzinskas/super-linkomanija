import urlService from '../../services/common/url.service';
import languageService from '../../services/popup/language.service';
import releaseNotifierService, { IFoundRelease } from '../../services/common/release-notifier.service';

import IContent from '../../interfaces/content';
import { ILocaleMessages } from '../../interfaces/locale';

import './styles/release-notifier.scss';

const noticeDuration = 3000;

class ContentReleaseNotifier implements IContent {
  public async extendPageUserInterface() {
    // Content script runs in every frame, the notices belong to the main page only
    if (window !== window.top) {
      return;
    }

    const [pendingMatches, state, locale] = await Promise.all([
      releaseNotifierService.getPendingMatches(),
      releaseNotifierService.getState(),
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
    document.querySelectorAll('.release-notifier-bar, .release-notifier-toast').forEach(element => element.remove());
  }

  private insertDecisionBar({ release, match }: IFoundRelease, messages: ILocaleMessages) {
    const bar = this.createElement('div', 'release-notifier-bar');
    const text = this.createElement('div', 'release-notifier-bar__text');
    text.append(
      this.createElement('strong', '', messages.appName),
      ` · ${messages.releaseNotifierPageMatch} `,
      this.createElement('strong', '', `"${release.searchTerm}"`),
    );

    const rejectButton = this.createElement('button', 'release-notifier-bar__button', messages.releaseNotifierReject);
    const acceptButton = this.createElement(
      'button',
      'release-notifier-bar__button release-notifier-bar__button--primary',
      messages.releaseNotifierAccept,
    );

    const showNotice = (notice: string) => {
      text.textContent = notice;
      rejectButton.remove();
      acceptButton.remove();
      setTimeout(() => bar.remove(), noticeDuration);
    };
    rejectButton.addEventListener('click', async () => {
      await releaseNotifierService.rejectMatch(release.id, match.torrentId);
      showNotice(messages.releaseNotifierRejectedNotice);
    });
    acceptButton.addEventListener('click', async () => {
      await releaseNotifierService.acceptMatch(release.id);
      showNotice(messages.releaseNotifierAcceptedNotice);
    });

    bar.append(text, rejectButton, acceptButton);
    document.body.appendChild(bar);
  }

  private insertToast(foundReleases: IFoundRelease[], messages: ILocaleMessages) {
    const toast = this.createElement('div', 'release-notifier-toast');
    const header = this.createElement('div', 'release-notifier-toast__header');
    const dismissButton = this.createElement('button', 'release-notifier-toast__dismiss', '×');
    dismissButton.title = messages.releaseNotifierDismiss;
    dismissButton.addEventListener('click', () => {
      releaseNotifierService.dismissMatches(foundReleases.map(({ match }) => match.torrentId));
      toast.remove();
    });
    header.append(this.createElement('strong', '', messages.releaseNotifierToastTitle), dismissButton);

    const list = this.createElement('ul', 'release-notifier-toast__list');
    foundReleases.forEach(({ release, match }) => {
      const item = this.createElement('li', '');
      const link = this.createElement('a', '', match.title) as HTMLAnchorElement;
      link.href = match.detailsLink;
      item.append(this.createElement('span', 'release-notifier-toast__term', release.searchTerm), link);
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

export default new ContentReleaseNotifier();
