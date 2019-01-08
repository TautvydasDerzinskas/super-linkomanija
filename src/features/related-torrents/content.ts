import urlService from '../../services/common/url.service';
import apiService from '../../services/common/api.service';
import svgIconsService from '../../services/content/svg-icons.service';

import IContent from '../../interfaces/content';

import './styles/related-torrents.scss';

class ContentRelatedTorrents implements IContent {
  public extendPageUserInterface() {
    if (urlService.isTorrentDetailsPage()) {
      this.insertRelatedTorrentsContainer();
      const torrentTitle = document.querySelector('#content h1').textContent;
      apiService.getRelatedTorrents(torrentTitle).then((relatedTorrentsHtml: string) => {
        this.insertRelatedTorrents(relatedTorrentsHtml);
      });
    }
  }

  private insertRelatedTorrentsContainer() {
    const target = document.querySelector('#content table');
    const relatedTorrents = document.createElement('div');
    relatedTorrents.setAttribute('class', 'related-torrents');
    relatedTorrents.innerHTML = `
      <h1>Susiję torrentai</h1>
      <div class="related-torrents__torrents sl-loading">${svgIconsService.iconLoading}</div>
    `;
    target.after(relatedTorrents);
  }

  private insertRelatedTorrents(relatedTorrentsHtml: string) {
    const target = document.getElementsByClassName('related-torrents__torrents')[0];
    target.classList.remove('sl-loading');
    target.innerHTML = relatedTorrentsHtml;
  }

  public cleanUp() {
    if (urlService.isTorrentDetailsPage()) {
      const relatedTorrents = document.getElementsByClassName('related-torrents')[0];
      if (relatedTorrents) {
        relatedTorrents.remove();
      }
    }
  }
}

export default new ContentRelatedTorrents();
