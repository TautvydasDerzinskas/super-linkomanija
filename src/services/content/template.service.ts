import svgIconsService from '../../services/content/svg-icons.service';

import { IReleaseDetails } from '../../interfaces/release';

class TemplateService {
  public getReleasePreviewPopup(content: string, details: IReleaseDetails, isLoading: boolean) {
    return `
    <div class="release-preview">
      <div class="release-preview__header">
        <a href="${details.category.link}" title="${details.category.title}" class="header__category">
          <img src="${details.category.imageLink}" />
        </a>
        <a href="${details.detailsLink}" title="${details.title}" class="header__title">
          ${details.title}
        </a>
        <div class="header__actions"></div>
      </div>
      <div class="release-preview__content ${isLoading ? 'sl-loading' : ''}">${content ? content : svgIconsService.iconLoading}</div>
    </div>
    `;
  }

  public getLoadingSpinner() {
    return `<div class="sl-loading">${svgIconsService.iconLoading}</div>`;
  }

  public getViewModeToggler(listModeIsActive: boolean) {
    return `
    <button title="List view" class="view-modes__option ${listModeIsActive ? 'active' : ''}" data-mode="list" type="button">
      ${svgIconsService.iconList}
    </button>
    <button title="Grid view" class="view-modes__option ${!listModeIsActive ? ' active' : ''}" data-mode="grid" type="button">
      ${svgIconsService.iconGrid}
    </button>
  `;
  }

  public getReleaseGridCard(details: IReleaseDetails) {
    const isNewCornerRibbon = details.isNew ? `<div class="corner-ribbon top-left corner-ribbon--red" title="Naujas">Naujas</div>` : '';
    const isFreeLeechRibbon = details.isFreeLeech ? `<a href="/faq.php#stat9" target="_blank" class="corner-ribbon top-right corner-ribbon--green" title="Free leech">Free leech</a>` : '';
    const subtitle = details.subTitle ? `<div class="release__subtitle" title="${details.subTitle}">${details.subTitle}</div>` : '';
    const comments = details.commentsCount !== 0 ? `<span class="release__comments" title="Komentarai">${svgIconsService.iconComments} ${details.commentsCount}</span>` : '';

    return `
    <li class="releases__card">
      <div class="release">
        <div class="release__header">
          <a href="${details.category.link}" title="${details.category.title}" class="release__header__category">
            <img src="${details.category.imageLink}" />
          </a>
          <a href="${details.detailsLink}" title="${details.title}" class="release__header__title">
            ${details.title} ${comments}
          </a>
        </div>
        <div class="release__image" style="background-image: url(${details.imageLinks[0]})">
          ${isNewCornerRibbon}
          ${isFreeLeechRibbon}
          ${subtitle}
          <div class="release__image__overlay">
            <div>
              <a title="Atidaryti leidimo puslapį" href="${details.detailsLink}">
                ${svgIconsService.iconOpen}
              </a>
            </div>
            <div>
              <a title="Parsisiųsti" href="${details.downloadLink}">
                ${svgIconsService.iconDownload}
              </a>
            </div>
            <div>
              <span title="Įtraukti/išimti iš žymų sąrašo" class="release__favourite ${details.isFavourite ? 'remove' : 'add'}" data-id="${details.id}">
                ${svgIconsService.iconStar}
              </span>
            </div>
            <div>
              <span title="Peržiūrėti aprašymą" class="release-preview">
                ${svgIconsService.iconEye}
              </span>
            </div>
          </div>
        </div>
        <div class="release__footer">
          <div class="footer__size">
            <span title="Dydis: ${details.size}">
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
}

export default new TemplateService();
