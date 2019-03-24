import extractTorrentDetailsService from '../../services/common/extract-torrent-details.service';

import { LinkomanijaSelectors } from '../../enums';
import { ITorrentComment } from '../../interfaces/torrent';

class ApiService {
  constructor() {
    if (!(window as any).superLinkomanijaResponseTable) {
      (window as any).superLinkomanijaResponseTable = {};
    }
  }

  public getRelatedTorrents(title: string) {
    return new Promise((resolve) => {
      this.get(`browse.php?search=${title}`).then((responseHtml: string) => {
        const virtualDom = this.htmlStringToVirtualDom(responseHtml);
        const torrentsTable = virtualDom.querySelector(LinkomanijaSelectors.TorrentTable).outerHTML;
        resolve(torrentsTable);
      });
    });
  }

  public getTorrentDetails(url: string): Promise<{ descriptionHtml: string; comments: ITorrentComment[] }> {
    return new Promise((resolve) => {
      this.get(url).then((responseHtml: string) => {
        const virtualDom = this.htmlStringToVirtualDom(responseHtml);
        const youtubeIframe = virtualDom.querySelector('.descr_text iframe');
        if (youtubeIframe) {
          youtubeIframe.setAttribute('width', '350');
          youtubeIframe.setAttribute('height', '213');
        }
        const descriptionHtml = virtualDom.getElementsByClassName('descr_text')[0].innerHTML;

        resolve({
          descriptionHtml: descriptionHtml,
          comments: extractTorrentDetailsService.extractComments(responseHtml),
        });
      });
    });
  }

  public addFavourite(id: string) {
    return new Promise((resolve) => {
      this.post('ajax/bookmarks.php', { type: 'master', action: 'add', tid: id }).then(response => {
        resolve(response);
      });
    });
  }

  public removeFavourite(id: string) {
    return new Promise((resolve) => {
      this.post('ajax/bookmarks.php', { type: 'master', action: 'remove', tid: id }).then(response => {
        resolve(response);
      });
    });
  }

  private post(url: string, data: { [index: string]: string; }) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      const urlEncodedDataPairs = [];
      for (const name in data) {
        if (data[name] !== null) {
          urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }
      }
      const urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

      xhr.open('POST', `https://www.linkomanija.net/${url}`);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = function() {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        }
      };
      xhr.send(urlEncodedData);
    });
  }

  private get(url: string) {
    return new Promise((resolve) => {
      if (!(window as any).superLinkomanijaResponseTable[url]) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
          (window as any).superLinkomanijaResponseTable[url] = xhr.response;
          resolve(xhr.response);
        }, false);
        xhr.open('GET', `https://www.linkomanija.net/${url}`);
        xhr.send();
      } else {
        resolve((window as any).superLinkomanijaResponseTable[url]);
      }
    });
  }

  private htmlStringToVirtualDom(html: string) {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  }
}

export default new ApiService();
