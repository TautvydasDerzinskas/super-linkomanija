
import BrowserStorageService from './browser-storage.service';

import { IHistory } from '../../interfaces/history';
import { IBasicTorrentDetails } from '../../interfaces/torrent';
import { ChromeStorageKeys } from '../../enums';

const browserStorageService = new BrowserStorageService();

type THistoryTypes = 'viewed' | 'downloaded' | 'commented';

class HistoryService {
  get maxStoredTorrentsPerCategory () { return 25; }

  public getHistory(type: THistoryTypes) {
    return browserStorageService.getItem<IHistory>(`${ChromeStorageKeys.History}_${type}`);
  }

  public addViewedTorrent(torrentDetails: IBasicTorrentDetails) {
    return this.performStorageProcess(torrentDetails, 'viewed');
  }

  public addDownloadedTorrent(torrentDetails: IBasicTorrentDetails) {
    return this.performStorageProcess(torrentDetails, 'downloaded');
  }

  public addCommentedTorrent(torrentDetails: IBasicTorrentDetails) {
    return this.performStorageProcess(torrentDetails, 'commented');
  }

  private async performStorageProcess(torrentDetails: IBasicTorrentDetails, type: THistoryTypes) {
    if (!torrentDetails) {
      return;
    }

    const storageKey = `${ChromeStorageKeys.History}_${type}`;
    const data = await browserStorageService.getItem<IHistory>(storageKey) ?? {
      [type]: {
        items: [],
        total: 0,
      }
    };

    if (data[type].items.length === 0 || data[type].items[0].id !== torrentDetails.id) {
      data[type].items.unshift(torrentDetails);
      data[type].total++;
      if (data[type].items.length > this.maxStoredTorrentsPerCategory) {
        data[type].items.pop();
      }
      await browserStorageService.setItem<IHistory>(storageKey, data);
    }
  }
}

export default new HistoryService();
