import './styles/comments-bbcode.scss';
declare let sceditor: any;

import IContent from '../../interfaces/content';
import { LinkomanijaSelectors } from '../../enums';

class ContentCommentsBbcode implements IContent {

  public setupEventListeners() {
    if (this.scEditorAvailable) {
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
    if (this.scEditorAvailable) {
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
    if (this.scEditorAvailable) {
      const textBoxes = document.querySelectorAll(LinkomanijaSelectors.CommentTextBoxes);
      for (let i = 0, b = textBoxes.length; i < b; i += 1) {
        const scEditorInstance = sceditor.instance(textBoxes[i]);
        if (scEditorInstance) {
          scEditorInstance.destroy();
        }
      }
    }
  }

  get scEditorAvailable() {
    return typeof sceditor !== 'undefined';
  }

}

export default new ContentCommentsBbcode();
