import apiService from './api.service';
import { ITorrentDetails } from '../../interfaces/torrent';
import templateService from '../content/template.service';

class PreviewService {
  public add(element: HTMLElement, details: ITorrentDetails) {
    let contentLoaded = false;
    tippy(element, {
      maxWidth: '350px',
      theme: 'linkomanija',
      size: 'large',
      arrow: true,
      interactive: true,
      performance: true,
      content: templateService.getTorrentPreviewPopup(null, details, true),
      animateFill: false,
      animation: 'scale',
      updateDuration: 0,
      interactiveBorder: 0,
      interactiveDebounce: 100,
      async onShow(tip: any) {
        if (!contentLoaded) {
          const response = await apiService.getTorrentDetails(details.detailsLink);
          tip.setContent(
            templateService.getTorrentPreviewPopup(response.descriptionHtml, details, false),
            );
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
