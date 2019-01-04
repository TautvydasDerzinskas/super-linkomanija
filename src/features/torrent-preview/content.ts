import apiService from '../../services/common/api.service';
import urlService from '../../services/common/url.service';

import IContent from '../../interfaces/content';
import { LinkomanijaSelectors } from '../../enums';

import './styles/torrent-preview.scss';

class ContentTorrentPreview implements IContent {
  public setupEventListeners() {
    if (urlService.isTorrentsListPage()) {
      const titleColumns = document.querySelectorAll(LinkomanijaSelectors.TorrentTableTitleColumn);
      for (let i = 0, b = titleColumns.length; i < b; i += 1) {
        const torrentDetailsLink = titleColumns[i].children[0].getAttribute('href');
        this.setupDesriptionPreview(titleColumns[i].parentElement, torrentDetailsLink);
      }
    }
  }

  public cleanUp() {
    if (urlService.isTorrentsListPage()) {
      const titleColumns = document.querySelectorAll(LinkomanijaSelectors.TorrentTableTitleColumn);
      for (let i = 0, b = titleColumns.length; i < b; i += 1) {
        (titleColumns[i].parentElement as any)._tippy.destroy();
      }
    }
  }

  private setupDesriptionPreview(element: HTMLElement, detailsUrl: string) {
    let contentLoaded = false;
    tippy(element, {
      maxWidth: '600px',
      theme: 'linkomanija',
      size: 'large',
      arrow: true,
      interactive: true,
      performance: true,
      content: '<div class="torrent-preview">Loading...</div>',
      async onShow(tip: any) {
        if (!contentLoaded) {
          const response = await apiService.getTorrentDescription(detailsUrl);
          tip.setContent(`<div class="torrent-preview">${response}</div>`);
          contentLoaded = true;
        }
      },
    });
  }
}

export default new ContentTorrentPreview();
