import urlService from '../../services/common/url.service';
import previewService from '../../services/common/preview.service';

import IContent from '../../interfaces/content';
import { LinkomanijaSelectors } from '../../enums';

import './styles/torrent-preview.scss';

class ContentTorrentPreview implements IContent {
  public setupEventListeners() {
    if (urlService.isTorrentsListPage()) {
      const titleColumns = document.querySelectorAll(LinkomanijaSelectors.TorrentTableTitleColumn);
      for (let i = 0, b = titleColumns.length; i < b; i += 1) {
        const torrentDetailsLink = titleColumns[i].children[0].getAttribute('href');
        previewService.add(titleColumns[i].parentElement, torrentDetailsLink);
      }
    }
  }

  public cleanUp() {
    if (urlService.isTorrentsListPage()) {
      const titleColumns = document.querySelectorAll(LinkomanijaSelectors.TorrentTableTitleColumn);
      for (let i = 0, b = titleColumns.length; i < b; i += 1) {
        previewService.remove(titleColumns[i].parentElement);
      }
    }
  }
}

export default new ContentTorrentPreview();
