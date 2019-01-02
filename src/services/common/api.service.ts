class ApiService {
  constructor() {
    if (!(window as any).superLinkomanijaResponseTable) {
      (window as any).superLinkomanijaResponseTable = {};
    }
  }

  public getTorrentDescription(url: string) {
    return new Promise((resolve, reject) => {
      this.get(url).then((responseHtml: string) => {
        const data = responseHtml
          .trim()
          .split('<td class="descr_text">')[1]
          .split('<td class="rowhead">Įdėjo</td>')[0]
          .replace(/(?:\r\n|\r|\n)/g, '')
          .replace('</td></tr><tr>', '');

          resolve(data);
      });
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
