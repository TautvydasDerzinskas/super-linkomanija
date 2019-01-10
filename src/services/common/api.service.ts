import { ITorrentComment } from '../../interfaces/torrent';
import extractTorrentDetailsService from '../../services/common/extract-torrent-details.service';

class ApiService {
  constructor() {
    if (!(window as any).superLinkomanijaResponseTable) {
      (window as any).superLinkomanijaResponseTable = {};
    }
  }

  public getRelatedTorrents(title: string) {
    return new Promise((resolve, reject) => {
      this.get('/browse.php?search=' + title).then((responseHtml: string) => {
        const data = responseHtml
          .trim()
          .split('Kitas&nbsp&raquo;</a></p>')[1]
          .split('<p align="center"><span class="pageinactive">&laquo;&nbsp;Ankstesnis')[0]
          .replace(/(?:\r\n|\r|\n)/g, '');

          resolve(data);
      });
    });
  }

  public getTorrentDetails(url: string): Promise<{ descriptionHtml: string; comments: ITorrentComment[] }> {
    return new Promise((resolve, reject) => {
      this.get(url).then((responseHtml: string) => {
        const descriptionHtml = responseHtml
          .trim()
          .split('<td class="descr_text">')[1]
          .split('<td class="rowhead">Įdėjo</td>')[0]
          .replace(/(?:\r\n|\r|\n)/g, '')
          .replace('</td></tr><tr>', '');

        resolve({
          descriptionHtml: descriptionHtml,
          comments: extractTorrentDetailsService.extractComments(responseHtml),
        });
      });
    });
  }

  public addFavourite(id: string) {
    return new Promise((resolve, reject) => {
      this.post('/ajax/bookmarks.php', { type: 'master', action: 'add', tid: id }).then(response => {
        resolve(response);
      });
    });
  }

  public removeFavourite(id: string) {
    return new Promise((resolve, reject) => {
      this.post('/ajax/bookmarks.php', { type: 'master', action: 'remove', tid: id }).then(response => {
        resolve(response);
      });
    });
  }

  private post(url: string, data: { [index: string]: string; }) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      const urlEncodedDataPairs = [];
      for (const name in data) {
        if (data[name] !== null) {
          urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }
      }
      const urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

      xhr.open('POST', url);
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
    return new Promise((resolve, reject) => {
      if (!(window as any).superLinkomanijaResponseTable[url]) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
          (window as any).superLinkomanijaResponseTable[url] = xhr.response;
          resolve(xhr.response);
        }, false);
        xhr.open('GET', url);
        xhr.send();
      } else {
        resolve((window as any).superLinkomanijaResponseTable[url]);
      }
    });
  }
}

export default new ApiService();
