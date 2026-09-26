import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import apiService from './api.service';
import { ITorrentDetails } from '../../interfaces/torrent';
import templateService from '../content/template.service';

class PreviewService {
  public add(element: HTMLElement, details: ITorrentDetails) {
    let contentLoaded = false;
    tippy(element, {
      maxWidth: 350,
      theme: 'linkomanija',
      arrow: true,
      interactive: true,
      allowHTML: true,
      appendTo: () => document.body,
      content: templateService.getTorrentPreviewPopup(null, details, true),
      animation: 'scale',
      interactiveBorder: 0,
      interactiveDebounce: 100,
      onShow(tip) {
        if (!contentLoaded) {
          apiService.getTorrentDetails(details.detailsLink).then(response => {
            tip.setContent(
              templateService.getTorrentPreviewPopup(response.descriptionHtml, details, false),
            );
            contentLoaded = true;
          });
        }
      },
    });
  }

  public remove(element: HTMLElement) {
    (element as any)._tippy.destroy();
  }
}

export default new PreviewService();
