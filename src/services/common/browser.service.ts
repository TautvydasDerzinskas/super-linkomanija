declare let opr: any;
declare let InstallTrigger: any;

import { Browsers } from '../../enums';

class BrowserService {
  get window(): any { return window; }

  get browserName() {
    if ((!!this.window.opr && !!opr.addons) || !!this.window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
      return Browsers.Opera;
    } else if (typeof InstallTrigger !== 'undefined') {
      return Browsers.Firefox;
    } else if (navigator.userAgent.toLowerCase().indexOf('vivaldi') >= 0) {
      return Browsers.Vivaldi;
    } else if (!!this.window.chrome && (!!this.window.chrome.webstore || !!this.window.chrome.runtime)) {
      return Browsers.Chrome;
    }
    return Browsers.Other;
  }

  get browserExtensionWebStoreLink() {
    let link: string;

    switch (this.browserName) {
      case Browsers.Firefox:
        link = `https://addons.mozilla.org/en-GB/firefox/addon/${(window as any).sl.title}`;
        break;
      case Browsers.Opera:
        link = `https://addons.opera.com/en-gb/extensions/details/${(window as any).sl.title}`;
        break;
      default:
      case Browsers.Chrome:
      case Browsers.Other:
      case Browsers.Vivaldi:
        link = `https://chrome.google.com/webstore/detail/${chrome.runtime.id}`;
        break;
    }

    return link;
  }
}

export default new BrowserService();
