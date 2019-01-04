import urlService from '../../services/common/url.service';
import IContent from '../../interfaces/content';
import { LinkomanijaSelectors } from '../../enums';

import './styles/comments-bbcode.scss';

class ContentCommentsBbcode implements IContent {

  public setupEventListeners() {
    if (urlService.isTorrentDetailsPage()) {
      this.fixYoutubeBbcode();
      this.setupReplyCommentBoxesTriggers();
    }
  }

  private fixYoutubeBbcode() {
    console.log(sceditor);
  }

  private setupReplyCommentBoxesTriggers() {
    const s = document.createElement('script');
    s.src = chrome.extension.getURL('bbcode.bundle.js');
    s.onload = function() {
        (this as HTMLElement).remove();
    };
    (document.head || document.documentElement).appendChild(s);
  }

  public extendPageUserInterface() {
    if (urlService.isTorrentDetailsPage()) {
      const textBoxes = document.querySelectorAll(LinkomanijaSelectors.CommentTextBoxes);
      for (let i = 0, b = textBoxes.length; i < b; i += 1) {
        const scEditorInstance = sceditor.instance(textBoxes[i]);

        if (!scEditorInstance) {
          sceditor.create(textBoxes[i], {
            format: 'bbcode',
            toolbar: 'bold,italic,underline,strike|font,size,color|quote,link,image,youtube,date,time|source',
            emoticonsEnabled: false,
            icons: 'monocons',
            style: null,
          });
        }
      }
    }
  }

  public cleanUp() {
    if (urlService.isTorrentDetailsPage()) {
      const textBoxes = document.querySelectorAll(LinkomanijaSelectors.CommentTextBoxes);
      for (let i = 0, b = textBoxes.length; i < b; i += 1) {
        const scEditorInstance = sceditor.instance(textBoxes[i]);
        if (scEditorInstance) {
          scEditorInstance.destroy();
        }
      }
    }
  }
}

export default new ContentCommentsBbcode();
