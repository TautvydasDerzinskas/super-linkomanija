import svgIconsService from '../../services/content/svg-icons.service';

import { ITorrentDetails } from '../../interfaces/torrent';

class TemplateService {
  public getTorrentPreviewPopup(content: string, details: ITorrentDetails, isLoading: boolean) {
    return `
    <div class="torrent-preview">
      <div class="torrent-preview__header">
        <a href="${details.category.link}" title="${details.category.title}" class="header__category">
          <img src="${details.category.imageLink}" />
        </a>
        <a href="${details.detailsLink}" title="${details.title}" class="header__title">
          ${details.title}
        </a>
        <div class="header__actions"></div>
      </div>
      <div class="torrent-preview__content ${isLoading ? 'sl-loading' : ''}">${content ? content : svgIconsService.iconLoading}</div>
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

  public getTorrentGridCard(details: ITorrentDetails) {
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
}

export default new TemplateService();
