
import ChromeStorageService from './chrome-storage.service';

import { IHistory } from '../../interfaces/history';
import { IBasicTorrentDetails } from '../../interfaces/torrent';
import { ChromeStorageKeys } from '../../enums';

const chromeStorageService = new ChromeStorageService();

type THistoryTypes = 'viewed' | 'downloaded' | 'commented';

class HistoryService {
  get maxStoredTorrentsPerCategory () { return 25; }

  public getHistory(type: THistoryTypes) {
    return chromeStorageService.getItem<IHistory>(`${ChromeStorageKeys.History}_${type}`);
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
        chromeStorageService.getItem<IHistory>(storageKey).then(data => {
          if (!data) {
            data = {
              [type]: []
            };
          }

          if (data[type].length === 0 || data[type][0].id !== torrentDetails.id) {
            data[type].unshift(torrentDetails);
            if (data[type].length > this.maxStoredTorrentsPerCategory) {
              data[type].pop();
            }
            chromeStorageService.setItem<IHistory>(storageKey, data).then(resolve);
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
