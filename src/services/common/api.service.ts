import extractTorrentDetailsService from '../../services/common/extract-torrent-details.service';

import { LinkomanijaSelectors } from '../../enums';
import { ITorrentComment } from '../../interfaces/torrent';

class ApiService {
  constructor() {
    if (!(window as any).superLinkomanijaResponseTable) {
      (window as any).superLinkomanijaResponseTable = {};
    }
  }

  /**
   * Resolves to null when the search found nothing
   */
  public async getRelatedTorrents(title: string): Promise<HTMLTableElement> {
    const responseHtml = await this.get(`browse.php?search=${encodeURIComponent(title)}`);
    const virtualDom = this.htmlStringToVirtualDom(responseHtml);
    return virtualDom.querySelector<HTMLTableElement>(LinkomanijaSelectors.TorrentTable);
  }

  public async getTorrentDetails(url: string): Promise<{ descriptionHtml: string; comments: ITorrentComment[] }> {
    const responseHtml = await this.get(url);
    const virtualDom = this.htmlStringToVirtualDom(responseHtml);
    const youtubeIframe = virtualDom.querySelector('.descr_text iframe');
    if (youtubeIframe) {
      youtubeIframe.setAttribute('width', '350');
      youtubeIframe.setAttribute('height', '213');
    }

    return {
      descriptionHtml: virtualDom.getElementsByClassName('descr_text')[0].innerHTML,
      comments: extractTorrentDetailsService.extractComments(responseHtml),
    };
  }

  public addFavourite(id: string) {
    return this.post('ajax/bookmarks.php', { type: 'master', action: 'add', tid: id });
  }

  public removeFavourite(id: string) {
    return this.post('ajax/bookmarks.php', { type: 'master', action: 'remove', tid: id });
  }

  private async post(url: string, data: Record<string, string>) {
    const response = await fetch(`https://www.linkomanija.net/${url}`, {
      method: 'POST',
      body: new URLSearchParams(data),
    });
    if (!response.ok) {
      throw new Error(`POST ${url} failed with status ${response.status}`);
    }
    return response.text();
  }

  private async get(url: string): Promise<string> {
    const responseTable = (window as any).superLinkomanijaResponseTable;
    if (!responseTable[url]) {
      const response = await fetch(`https://www.linkomanija.net/${url}`);
      responseTable[url] = await response.text();
    }
    return responseTable[url];
  }

  private htmlStringToVirtualDom(html: string) {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  }
}

export default new ApiService();
