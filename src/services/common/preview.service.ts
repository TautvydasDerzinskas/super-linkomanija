import apiService from './api.service';

class PreviewService {
  public add(element: HTMLElement, detailsUrl: string) {
    let contentLoaded = false;
    tippy(element, {
      maxWidth: '600px',
      theme: 'linkomanija',
      size: 'large',
      arrow: true,
      interactive: true,
      performance: true,
      content: '<div class="torrent-preview">Loading...</div>',
      async onShow(tip: any) {
        if (!contentLoaded) {
          const response = await apiService.getTorrentDescription(detailsUrl);
          tip.setContent(`<div class="torrent-preview">${response}</div>`);
          contentLoaded = true;
        }
      },
    });
  }

  public remove(element: HTMLElement) {
    (element as any)._tippy.destroy();
  }
}

export default new PreviewService();
