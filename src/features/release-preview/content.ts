import urlService from '../../services/common/url.service';
import previewService from '../../services/common/preview.service';
import extractReleaseDetailsService from '../../services/common/extract-release-details.service';
import svgIconsService from '../../services/content/svg-icons.service';

import IContent from '../../interfaces/content';
import { LinkomanijaSelectors } from '../../enums';

import './styles/release-preview.scss';

class ContentReleasePreview implements IContent {
  public extendPageUserInterface() {
    if (urlService.isReleasesListPage()) {
      const releaseRow = document.querySelectorAll(LinkomanijaSelectors.ReleaseTableRows);
      for (let i = 0, b = releaseRow.length; i < b; i += 1) {
        if (i === 0) {
          this.injectHeadingColumnTpl(releaseRow[i] as HTMLElement);
        } else {
          this.injectNormalColumnTpl(releaseRow[i] as HTMLElement);
        }
      }
    }
  }

  private injectHeadingColumnTpl(element: HTMLElement) {
    const columnHeader = document.createElement('td');
    columnHeader.className = 'colhead sm--preview-release';
    columnHeader.innerHTML = svgIconsService.iconEye;
    element.appendChild(columnHeader);
  }

  private injectNormalColumnTpl(element: HTMLElement) {
    const columnCell = document.createElement('td');
    columnCell.className = 'sm--preview-release';
    columnCell.innerHTML = `<button>${svgIconsService.iconEye}</button>`;
    columnCell.setAttribute('title', 'Peržiūrėti');
    element.appendChild(columnCell);
  }

  public setupEventListeners() {
    if (urlService.isReleasesListPage()) {
      const previewColumns = document.querySelectorAll('.sm--preview-release:not(.colhead)');
      for (let i = 0, b = previewColumns.length; i < b; i += 1) {
        const releaseDetails = extractReleaseDetailsService.getMainReleaseDetails(previewColumns[i].parentElement);
        previewService.add(previewColumns[i].children[0] as HTMLElement, releaseDetails);
      }
    }
  }

  public cleanUp() {
    if (urlService.isReleasesListPage()) {
      const previewColumns = document.querySelectorAll('.sm--preview-release');
      for (let i = 0, b = previewColumns.length; i < b; i += 1) {
        if (i !== 0) {
          previewService.remove(previewColumns[i].children[0] as HTMLElement);
        }
        previewColumns[i].remove();
      }
    }
  }
}

export default new ContentReleasePreview();
