import apiService from './api.service';
import { ITorrentDetails } from '../../interfaces/torrent';

class PreviewService {
  public add(element: HTMLElement, details: ITorrentDetails) {
    let contentLoaded = false;
    const self = this;
    tippy(element, {
      maxWidth: '600px',
      theme: 'linkomanija',
      size: 'large',
      arrow: true,
      interactive: true,
      performance: true,
      content: this.getPreviewWindowPopupHtml('Loading...', details),
      animateFill: false,
      animation: 'scale',
      updateDuration: 0,
      sticky: true,
      async onShow(tip: any) {
        if (!contentLoaded) {
          const response = await apiService.getTorrentDescription(details.detailsLink);
          tip.setContent(self.getPreviewWindowPopupHtml(response as string, details));
          contentLoaded = true;
        }
      },
    });
  }

  public remove(element: HTMLElement) {
    (element as any)._tippy.destroy();
  }

  private getPreviewWindowPopupHtml(content: string, details: ITorrentDetails) {
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
      <div class="torrent-preview__content">${content}</div>
    </div>
    `;
  }
}

export default new PreviewService();
