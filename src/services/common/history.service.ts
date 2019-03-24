
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

  private performStorageProcess(torrentDetails: IBasicTorrentDetails, type: THistoryTypes) {
    return new Promise((resolve, reject) => {
      if (torrentDetails) {
        const storageKey = `${ChromeStorageKeys.History}_${type}`;
        browserStorageService.getItem<IHistory>(storageKey).then(data => {
          if (!data) {
            data = {
              [type]: {
                items: [],
                total: 0,
              }
            };
          }

          if (data[type].items.length === 0 || data[type].items[0].id !== torrentDetails.id) {
            data[type].items.unshift(torrentDetails);
            data[type].total++;
            if (data[type].items.length > this.maxStoredTorrentsPerCategory) {
              data[type].items.pop();
            }
            browserStorageService.setItem<IHistory>(storageKey, data).then(resolve);
          } else {
            resolve();
          }
        });
      } else {
        reject(null);
      }
    });
  }
}

export default new HistoryService();
