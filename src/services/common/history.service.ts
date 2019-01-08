
import ChromeStorageService from './chrome-storage.service';

import { IHistory } from '../../interfaces/history';
import { IBasicTorrentDetails } from '../../interfaces/torrent';
import { ChromeStorageKeys } from '../../enums';

const chromeStorageService = new ChromeStorageService();

class HistoryService {
  get maxStoredTorrentsPerCategory () { return 25; }

  public getHistory() {
    return chromeStorageService.getItem<IHistory>(ChromeStorageKeys.History);
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

  private performStorageProcess(torrentDetails: IBasicTorrentDetails, type: 'viewed' | 'downloaded' | 'commented') {
    return new Promise((resolve, reject) => {
      if (torrentDetails) {
        chromeStorageService.getItem<IHistory>(ChromeStorageKeys.History).then(data => {
          if (!data) {
            data = {
              viewed: [],
              downloaded: [],
              commented: [],
            };
          }

          if (data[type][0].id !== torrentDetails.id) {
            data[type].unshift(torrentDetails);
            if (data[type].length > this.maxStoredTorrentsPerCategory) {
              data[type].pop();
            }
            chromeStorageService.setItem<IHistory>(ChromeStorageKeys.History, data).then(resolve);
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
