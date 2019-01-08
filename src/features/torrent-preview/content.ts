import urlService from '../../services/common/url.service';
import previewService from '../../services/common/preview.service';
import extractTorrentDetailsService from '../../services/common/extract-torrent-details.service';
import svgIconsService from '../../services/content/svg-icons.service';

import IContent from '../../interfaces/content';
import { LinkomanijaSelectors } from '../../enums';

import './styles/torrent-preview.scss';

class ContentTorrentPreview implements IContent {
  public extendPageUserInterface() {
    if (urlService.isTorrentsListPage()) {
      const torrentRow = document.querySelectorAll(LinkomanijaSelectors.TorrentTableRows);
      for (let i = 0, b = torrentRow.length; i < b; i += 1) {
        if (i === 0) {
          this.injectHeadingColumnTpl(torrentRow[i] as HTMLElement);
        } else {
          this.injectNormalColumnTpl(torrentRow[i] as HTMLElement);
        }
      }
    }
  }

  private injectHeadingColumnTpl(element: HTMLElement) {
    const columnHeader = document.createElement('td');
    columnHeader.className = 'colhead sm--preview-torrent';
    columnHeader.innerHTML = svgIconsService.iconEye;
    element.appendChild(columnHeader);
  }

  private injectNormalColumnTpl(element: HTMLElement) {
    const columnCell = document.createElement('td');
    columnCell.className = 'sm--preview-torrent';
    columnCell.innerHTML = `<button>${svgIconsService.iconEye}</button>`;
    columnCell.setAttribute('title', 'Peržiūrėti');
    element.appendChild(columnCell);
  }

  public setupEventListeners() {
    if (urlService.isTorrentsListPage()) {
      const previewColumns = document.querySelectorAll('.sm--preview-torrent:not(.colhead)');
      for (let i = 0, b = previewColumns.length; i < b; i += 1) {
        const torrentDetails = extractTorrentDetailsService.getMainTorrentDetails(previewColumns[i].parentElement);
        previewService.add(previewColumns[i].children[0] as HTMLElement, torrentDetails);
      }
    }
  }

  public cleanUp() {
    if (urlService.isTorrentsListPage()) {
      const previewColumns = document.querySelectorAll('.sm--preview-torrent');
      for (let i = 0, b = previewColumns.length; i < b; i += 1) {
        if (i !== 0) {
          previewService.remove(previewColumns[i].children[0] as HTMLElement);
        }
        previewColumns[i].remove();
      }
    }
  }
}

export default new ContentTorrentPreview();
