import urlService from '../../services/common/url.service';
import apiService from '../../services/common/api.service';

import IContent from '../../interfaces/content';

import './styles/related-torrents.scss';

class ContentRelatedTorrents implements IContent {
  public extendPageUserInterface() {
    if (urlService.isTorrentDetailsPage()) {
      const torrentTitle = document.querySelector('#content h1').textContent;
      apiService.getRelatedTorrents(torrentTitle).then((relatedTorrentsHtml: string) => {
        this.insertRelatedTorrents(relatedTorrentsHtml);
      });
    }
  }

  private insertRelatedTorrents(relatedTorrentsHtml: string) {
    const target = document.getElementById('content');
    const relatedTorrents = document.createElement('div');
    relatedTorrents.setAttribute('class', 'related-torrents');
    relatedTorrents.innerHTML = relatedTorrentsHtml;
    target.appendChild(relatedTorrents);
  }

  public cleanUp() {

  }
}

export default new ContentRelatedTorrents();
