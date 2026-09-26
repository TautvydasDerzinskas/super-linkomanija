declare let opr: any;

import { Browsers } from '../../enums';

class BrowserService {
  get window(): any { return window; }

  get browserName() {
    if ((!!this.window.opr && !!opr.addons) || !!this.window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
      return Browsers.Opera;
    } else if (chrome.runtime.getURL('').startsWith('moz-extension://')) {
      return Browsers.Firefox;
    } else if (navigator.userAgent.includes(' Edg/')) {
      return Browsers.Edge;
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
      case Browsers.Edge:
        link = `https://microsoftedge.microsoft.com/addons/detail/${chrome.runtime.id}`;
        break;
      default:
      case Browsers.Chrome:
      case Browsers.Other:
      case Browsers.Vivaldi:
        link = `https://chromewebstore.google.com/detail/${chrome.runtime.id}`;
        break;
    }

    return link;
  }

  get browserExtensionReviewLink() {
    const storeLink = this.browserExtensionWebStoreLink;

    switch (this.browserName) {
      case Browsers.Firefox:
        return `${storeLink}/reviews/`;
      // Edge Add-ons shows reviews on the listing page itself
      case Browsers.Edge:
        return storeLink;
      default:
        return `${storeLink}/reviews`;
    }
  }
}

export default new BrowserService();
