import apiService from './api.service';
import { ITorrentDetails } from '../../interfaces/torrent';
import svgIconsService from '../content/svg-icons.service';

class PreviewService {
  public add(element: HTMLElement, details: ITorrentDetails) {
    let contentLoaded = false;
    const self = this;
    tippy(element, {
      maxWidth: '350px',
      theme: 'linkomanija',
      size: 'large',
      arrow: true,
      interactive: true,
      performance: true,
      content: this.getPreviewWindowPopupHtml(svgIconsService.iconLoading, details, true),
      animateFill: false,
      animation: 'scale',
      updateDuration: 0,
      interactiveBorder: 0,
      interactiveDebounce: 100,
      async onShow(tip: any) {
        if (!contentLoaded) {
          const response = await apiService.getTorrentDetails(details.detailsLink);
          tip.setContent(
            self.getPreviewWindowPopupHtml(
              response.descriptionHtml.replace('width="560" height="315"', 'width="350" height="213"'),
              details,
              false
              )
            );
          contentLoaded = true;
        }
      },
    });
  }

  public remove(element: HTMLElement) {
    (element as any)._tippy.destroy();
  }

  private getPreviewWindowPopupHtml(content: string, details: ITorrentDetails, isLoading: boolean) {
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
      <div class="torrent-preview__content ${isLoading ? 'sl-loading' : ''}">${content}</div>
    </div>
    `;
  }
}

export default new PreviewService();
