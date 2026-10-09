import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import apiService from './api.service';
import { IReleaseDetails } from '../../interfaces/release';
import templateService from '../content/template.service';

class PreviewService {
  public add(element: HTMLElement, details: IReleaseDetails) {
    let contentLoaded = false;
    tippy(element, {
      maxWidth: 350,
      theme: 'linkomanija',
      arrow: true,
      interactive: true,
      allowHTML: true,
      appendTo: () => document.body,
      content: templateService.getReleasePreviewPopup(null, details, true),
      animation: 'scale',
      interactiveBorder: 0,
      interactiveDebounce: 100,
      onShow(tip) {
        if (!contentLoaded) {
          apiService.getReleaseDetails(details.detailsLink).then(response => {
            tip.setContent(
              templateService.getReleasePreviewPopup(response.descriptionHtml, details, false),
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
