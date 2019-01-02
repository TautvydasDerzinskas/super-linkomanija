import extractTorrentDetailsService from '../../services/common/extract-torrent-details.service';
import svgIconsService from '../../services/content/svg-icons.service';
import featureStorageService from '../../services/common/feature-storage.service';

import meta from './meta';
import IContent from '../../interfaces/content';
import { ITorrentDetails } from '../../interfaces/torrent';
import { LinkomanijaSelectors, SvgIcons, ViewModes } from '../../enums';

import './styles/view-modes.scss';
import './styles/grid-view.scss';

class ContentViewModes implements IContent {
  private gridModeUiGenerated = false;
  private viewMode: ViewModes;

  public extendPageUserInterface() {
    featureStorageService.getFeatureData(meta.id).then((featureData) => {
      this.viewMode = featureData.data.mode;
      this.appendViewModeToggler();
      this.setBodyClass();
      if (this.viewMode === ViewModes.Grid) {
        this.generateGridModeUi();
      }
    });
  }

  private appendViewModeToggler() {
    /**
     * Append toggler UI
     */
    const modeSelector = document.createElement('div');
    modeSelector.innerHTML = `
      <button title="List view" class="view-modes__option${this.viewMode === ViewModes.List ? ' active' : ''}" data-mode="list" type="button">
        ${svgIconsService.getIcon(SvgIcons.List)}
      </button>
      <button title="Grid view" class="view-modes__option${this.viewMode === ViewModes.Grid ? ' active' : ''}" data-mode="grid" type="button">
        ${svgIconsService.getIcon(SvgIcons.Grid)}
      </button>
    `;
    modeSelector.className = 'view-modes';
    const torrentsList = document.querySelector(LinkomanijaSelectors.TorrentTable);
    torrentsList.parentNode.insertBefore(modeSelector, torrentsList);
    this.setUpViewModeButtonsClickEvent();
  }

  private setUpViewModeButtonsClickEvent() {
    const viewModeButtons = document.getElementsByClassName('view-modes__option');
    const self = this;
    for (let i = 0, b = viewModeButtons.length; i < b; i += 1) {
      viewModeButtons[i].addEventListener('click', function() {
        const selectedMode = (this as HTMLElement).getAttribute('data-mode');
        if (selectedMode === 'grid') {
          self.viewMode = ViewModes.Grid;
          if (!self.gridModeUiGenerated) {
            self.generateGridModeUi();
          }
        } else {
          self.viewMode = ViewModes.List;
        }

        featureStorageService.storeFeatureData(meta.id, { mode: self.viewMode }).then(() => {
          self.setBodyClass();
        });
      });
    }
  }

  private setBodyClass() {
    const bodyElement = document.getElementsByTagName('body')[0];
    const classPrefix = 'sl-view-mode--';
    const listButtonSelector = '.view-modes__option[data-mode="list"]';
    const gridButtonSelector = '.view-modes__option[data-mode="grid"]';
    if (this.viewMode === ViewModes.List) {
      bodyElement.classList.add(classPrefix + 'list');
      bodyElement.classList.remove(classPrefix + 'grid');
      document.querySelector(listButtonSelector).classList.add('active');
      document.querySelector(gridButtonSelector).classList.remove('active');
    } else {
      bodyElement.classList.add(classPrefix + 'grid');
      bodyElement.classList.remove(classPrefix + 'list');
      document.querySelector(listButtonSelector).classList.remove('active');
      document.querySelector(gridButtonSelector).classList.add('active');
    }
  }

  private generateGridModeUi() {
    extractTorrentDetailsService.generateTorrentDetailsObject().then(torrentDetails => {
      let cardsHtml = '';

      for (let i = 0, b = torrentDetails.length; i < b; i += 1) {
        cardsHtml += this.getTorrentCard(torrentDetails[i]);
      }

      const cards = document.createElement('ul');
      cards.innerHTML = cardsHtml;
      cards.className = 'torrents';

      const torrentsTable = document.querySelector(LinkomanijaSelectors.TorrentTable);
      torrentsTable.parentNode.insertBefore(cards, torrentsTable);

      this.gridModeUiGenerated = true;
    });
  }

  public cleanUp() {
    // Removing generated UI
    const gridContainer = document.getElementsByClassName('torrents')[0];
    if (gridContainer) { gridContainer.remove(); }
    document.getElementsByClassName('view-modes')[0].remove();
    // Removing body classes
    const classPrefix = 'sl-view-mode--';
    const bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.classList.remove(classPrefix + 'list');
    bodyElement.classList.remove(classPrefix + 'grid');

    this.gridModeUiGenerated = false;
  }

  private getTorrentCard(details: ITorrentDetails) {
    const downloadIcon = svgIconsService.getIcon(SvgIcons.Download);
    const seedersIcon = svgIconsService.getIcon(SvgIcons.MaleArrowUp);
    const leechersIcon = svgIconsService.getIcon(SvgIcons.MaleArrowDown);

    return `
    <li class="torrents__card">
      <div class="torrent">
        <div class="torrent__header" title="${details.title}">
          <a href="${details.category.link}" title="${details.category.title}" class="torrent__header__category">
            <img src="${details.category.imageLink}" />
          </a>
          <div class="torrent__header__title">
            ${details.title}
          </div>
        </div>
        <div class="torrent__image" style="background-image: url(${details.imageLinks[0]})">
          <div class="torrent__image__overlay">
            <div class="overlay__links">
              <a href="${details.detailsLink}">Atidaryti</a>
              <a href="${details.torrentLink}">Parsisiųsti</a>
              <a href="javascript:void(0);" onClick="addBookmark(${details.id});">Žymėti</a>
              <a class="sl-description-preview" href="javascript:void(0);">Žiūrėti aprašymą</a>
            </div>
          </div>
        </div>
        <div class="torrent__footer">
          <div class="footer__size">${details.size}</div>
          <div class="footer__stats">
            <span>${downloadIcon} ${details.downloadedTimes}</span>
            <span class="sl-seeders">${seedersIcon} ${details.seedersCount}</span>
            <span class="sl-leechers">${leechersIcon} ${details.leechersCount}</span>
          </div>
        </div>
      </div>
    </li>
    `;
  }
}

export default new ContentViewModes();
