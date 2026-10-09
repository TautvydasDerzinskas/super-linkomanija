import extractReleaseDetailsService from '../../services/common/extract-release-details.service';
import featureStorageService from '../../services/common/feature-storage.service';
import urlService from '../../services/common/url.service';
import previewService from '../../services/common/preview.service';
import templateService from '../../services/content/template.service';

import meta from './meta';
import IContent from '../../interfaces/content';
import { IReleaseDetails } from '../../interfaces/release';
import { LinkomanijaSelectors, ViewModes } from '../../enums';

import './styles/view-modes.scss';
import './styles/grid-view.scss';
import './styles/corner-ribbon.scss';
import apiService from '../../services/common/api.service';

class ContentViewModes implements IContent {
  private gridModeUiGenerated = false;
  private viewMode: ViewModes;

  public extendPageUserInterface() {
    if (urlService.isReleasesListPage()) {
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
    modeSelector.innerHTML = templateService.getViewModeToggler(this.viewMode === ViewModes.List);
    modeSelector.className = 'view-modes';
    const releasesList = document.querySelector(LinkomanijaSelectors.ReleaseTable);
    releasesList.parentNode.insertBefore(modeSelector, releasesList);
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
    cards.innerHTML = templateService.getLoadingSpinner();
    cards.className = 'releases';

    const releasesTable = document.querySelector(LinkomanijaSelectors.ReleaseTable);
    releasesTable.parentNode.insertBefore(cards, releasesTable);

    extractReleaseDetailsService.generateMultipleReleasesData().then(releaseDetails => {
      let cardsHtml = '';

      for (let i = 0, b = releaseDetails.length; i < b; i += 1) {
        cardsHtml += templateService.getReleaseGridCard(releaseDetails[i]);
      }

      document.querySelector('ul.releases').innerHTML = cardsHtml;

      this.setupPreviewHover(releaseDetails);
      this.setupFavouriteClicks();

      this.gridModeUiGenerated = true;
    });
  }

  public cleanUp() {
    if (urlService.isReleasesListPage()) {
      // Removing generated UI
      const gridContainer = document.getElementsByClassName('releases')[0];
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

  private setupPreviewHover(releaseDetails: IReleaseDetails[]) {
    const previewButtons = document.getElementsByClassName('release-preview');
    for (let i = 0, b = previewButtons.length; i < b; i += 1) {
      const button = previewButtons[i];
      previewService.add(button as HTMLElement, releaseDetails[i]);
    }
  }

  private setupFavouriteClicks() {
    /**
     * Setting up grid mode favourite button clicks
     */
    const self = this;
    const favouriteButtons = document.querySelectorAll('.release__favourite');
    for (let i = 0, b = favouriteButtons.length; i < b; i += 1) {
      favouriteButtons[i].addEventListener('click', function () {
        self.favouriteClickEvent(this as HTMLElement, i);
      });
    }

    /**
     * Sync list mode buttons with grid mode favourite buttons
     */
    const releaseListRows = document.querySelectorAll(LinkomanijaSelectors.ReleaseTableTitleColumn);
    for (let i = 0, b = releaseListRows.length; i < b; i += 1) {
      const addFavouriteElement = releaseListRows[i].children[(releaseListRows[i].children.length - 5)];
      const removeFavouriteElement = releaseListRows[i].children[(releaseListRows[i].children.length - 4)];
      const id = parseInt((addFavouriteElement as HTMLElement).getAttribute('id').replace('ba_', ''), 10);
      const element = document.querySelector(`.release__favourite[data-id="${id}"]`) as HTMLElement;

      addFavouriteElement.addEventListener('click', () => { element.className = 'release__favourite remove'; });
      removeFavouriteElement.addEventListener('click', () => { element.className = 'release__favourite add'; });
    }
  }

  private favouriteClickEvent(element: HTMLElement, rowIndex: number) {
    const id = element.getAttribute('data-id');
    const isAdd = element.className.includes('add');
    const method = isAdd ? 'addFavourite' : 'removeFavourite';
    const className = isAdd ? 'remove' : 'add';

    apiService[method](id).then((response: string) => {
      if (parseInt(response, 10) === 1) {
        element.className = `release__favourite ${className}`;
        const releaseListRows = document.querySelectorAll(LinkomanijaSelectors.ReleaseTableTitleColumn);
        releaseListRows[rowIndex].children[(releaseListRows[rowIndex].children.length - 5)]
          .setAttribute('style', `display: ${isAdd ? 'none' : 'inline'};`);
        releaseListRows[rowIndex].children[(releaseListRows[rowIndex].children.length - 4)]
          .setAttribute('style', `display: ${isAdd ? 'inline' : 'none'};`);
      }
    });
  }
}

export default new ContentViewModes();
