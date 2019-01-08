import extractTorrentDetailsService from '../../services/common/extract-torrent-details.service';
import svgIconsService from '../../services/content/svg-icons.service';
import featureStorageService from '../../services/common/feature-storage.service';
import urlService from '../../services/common/url.service';
import previewService from '../../services/common/preview.service';

import meta from './meta';
import IContent from '../../interfaces/content';
import { ITorrentDetails } from '../../interfaces/torrent';
import { LinkomanijaSelectors, ViewModes } from '../../enums';

import './styles/view-modes.scss';
import './styles/grid-view.scss';
import './styles/corner-ribbon.scss';
import apiService from '../../services/common/api.service';

class ContentViewModes implements IContent {
  private gridModeUiGenerated = false;
  private viewMode: ViewModes;

  public extendPageUserInterface() {
    if (urlService.isTorrentsListPage()) {
      featureStorageService.getFeatureData(meta.id).then((featureData) => {
        this.viewMode = featureData.data.mode;
        this.appendViewModeToggler();
        this.setBodyClass();
        if (this.viewMode === ViewModes.Grid) {
          this.generateGridModeUi();
        }
      });
    }
  }

  private appendViewModeToggler() {
    /**
     * Append toggler UI
     */
    const modeSelector = document.createElement('div');
    modeSelector.innerHTML = `
      <button title="List view" class="view-modes__option${this.viewMode === ViewModes.List ? ' active' : ''}" data-mode="list" type="button">
        ${svgIconsService.iconList}
      </button>
      <button title="Grid view" class="view-modes__option${this.viewMode === ViewModes.Grid ? ' active' : ''}" data-mode="grid" type="button">
        ${svgIconsService.iconGrid}
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
    const cards = document.createElement('ul');
    cards.innerHTML = `<div class="sl-loading">${svgIconsService.iconLoading}</div>`;
    cards.className = 'torrents';

    const torrentsTable = document.querySelector(LinkomanijaSelectors.TorrentTable);
    torrentsTable.parentNode.insertBefore(cards, torrentsTable);

    extractTorrentDetailsService.generateMultipleTorrentsData().then(torrentDetails => {
      let cardsHtml = '';

      for (let i = 0, b = torrentDetails.length; i < b; i += 1) {
        cardsHtml += this.getTorrentCard(torrentDetails[i]);
      }

      document.querySelector('ul.torrents').innerHTML = cardsHtml;

      this.setupPreviewHover(torrentDetails);
      this.setupFavouriteClicks();

      this.gridModeUiGenerated = true;
    });
  }

  public cleanUp() {
    if (urlService.isTorrentsListPage()) {
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
  }

  private getTorrentCard(details: ITorrentDetails) {
    const isNewCornerRibbon = details.isNew ? `<div class="corner-ribbon top-left corner-ribbon--red" title="Naujas">Naujas</div>` : '';
    const isFreeLeechRibbon = details.isFreeLeech ? `<a href="/faq.php#stat9" target="_blank" class="corner-ribbon top-right corner-ribbon--green" title="Free leech">Free leech</a>` : '';
    const subtitle = details.subTitle ? `<div class="torrent__subtitle" title="${details.subTitle}">${details.subTitle}</div>` : '';
    const comments = details.commentsCount !== 0 ? `<span class="torrent__comments" title="Komentarai">${svgIconsService.iconComments} ${details.commentsCount}</span>` : '';

    return `
    <li class="torrents__card">
      <div class="torrent">
        <div class="torrent__header">
          <a href="${details.category.link}" title="${details.category.title}" class="torrent__header__category">
            <img src="${details.category.imageLink}" />
          </a>
          <a href="${details.detailsLink}" title="${details.title}" class="torrent__header__title">
            ${details.title} ${comments}
          </a>
        </div>
        <div class="torrent__image" style="background-image: url(${details.imageLinks[0]})">
          ${isNewCornerRibbon}
          ${isFreeLeechRibbon}
          ${subtitle}
          <div class="torrent__image__overlay">
            <div>
              <a title="Atidaryti torento puslapį" href="${details.detailsLink}">
                ${svgIconsService.iconOpen}
              </a>
            </div>
            <div>
              <a title="Parsisiųsti torentą" href="${details.torrentLink}">
                ${svgIconsService.iconDownload}
              </a>
            </div>
            <div>
              <span title="Įtraukti/išimti iš žymų sąrašo" class="torrent__favourite ${details.isFavourite ? 'remove' : 'add'}" data-id="${details.id}">
                ${svgIconsService.iconStar}
              </span>
            </div>
            <div>
              <span title="Peržiūrėti aprašymą" class="torrent-preview">
                ${svgIconsService.iconEye}
              </span>
            </div>
          </div>
        </div>
        <div class="torrent__footer">
          <div class="footer__size">
            <span title="Torrento dydis: ${details.size}">
              ${svgIconsService.iconFileSize} ${details.size}
            </span>
          </div>
          <div class="footer__stats">
            <span title="Parsisiųsta ${details.downloadedTimes}">
              ${svgIconsService.iconDownload} ${details.downloadedTimes}
            </span>
            <span title="Skledėjai ${details.seedersCount}" class="sl-seeders">
              ${svgIconsService.iconMaleArrowUp} ${details.seedersCount}
            </span>
            <span title="Siurbelės ${details.leechersCount}" class="sl-leechers">
              ${svgIconsService.iconMaleArrowDown} ${details.leechersCount}
            </span>
          </div>
        </div>
      </div>
    </li>
    `;
  }

  private setupPreviewHover(torrentDetails: ITorrentDetails[]) {
    const previewButtons = document.getElementsByClassName('torrent-preview');
    for (let i = 0, b = previewButtons.length; i < b; i += 1) {
      const button = previewButtons[i];
      previewService.add(button as HTMLElement, torrentDetails[i]);
    }
  }

  private setupFavouriteClicks() {
    /**
     * Setting up grid mode favourite button clicks
     */
    const self = this;
    const favouriteButtons = document.querySelectorAll('.torrent__favourite');
    for (let i = 0, b = favouriteButtons.length; i < b; i += 1) {
      favouriteButtons[i].addEventListener('click', function () {
        self.favouriteClickEvent(this as HTMLElement, i);
      });
    }

    /**
     * Sync list mode buttons with grid mode favourite buttons
     */
    const torrentListRows = document.querySelectorAll(LinkomanijaSelectors.TorrentTableTitleColumn);
    for (let i = 0, b = torrentListRows.length; i < b; i += 1) {
      const addFavouriteElement = torrentListRows[i].children[(torrentListRows[i].children.length - 5)];
      const removeFavouriteElement = torrentListRows[i].children[(torrentListRows[i].children.length - 4)];
      const id = parseInt((addFavouriteElement as HTMLElement).getAttribute('id').replace('ba_', ''), 10);
      const element = document.querySelector(`.torrent__favourite[data-id="${id}"]`) as HTMLElement;

      addFavouriteElement.addEventListener('click', () => { element.className = 'torrent__favourite remove'; });
      removeFavouriteElement.addEventListener('click', () => { element.className = 'torrent__favourite add'; });
    }
  }

  private favouriteClickEvent(element: HTMLElement, rowIndex: number) {
    const id = element.getAttribute('data-id');
    const isAdd = element.className.includes('add');
    const method = isAdd ? 'addFavourite' : 'removeFavourite';
    const className = isAdd ? 'remove' : 'add';

    apiService[method](id).then((response: string) => {
      if (parseInt(response, 10) === 1) {
        element.className = `torrent__favourite ${className}`;
        const torrentListRows = document.querySelectorAll(LinkomanijaSelectors.TorrentTableTitleColumn);
        torrentListRows[rowIndex].children[(torrentListRows[rowIndex].children.length - 5)]
          .setAttribute('style', `display: ${isAdd ? 'none' : 'inline'};`);
        torrentListRows[rowIndex].children[(torrentListRows[rowIndex].children.length - 4)]
          .setAttribute('style', `display: ${isAdd ? 'inline' : 'none'};`);
      }
    });
  }
}

export default new ContentViewModes();
