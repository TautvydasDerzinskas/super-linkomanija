
import ChromeStorageService from './chrome-storage.service';
import extractTorrentDetailsService from './extract-torrent-details.service';
import urlService from './url.service';

import { IBasicTorrentDetails } from '../../interfaces/torrent';
import { ChromeStorageKeys } from '../../enums';

const chromeStorageService = new ChromeStorageService();

interface IStoredHistoryData {
  viewed: IBasicTorrentDetails[];
  downloaded: IBasicTorrentDetails[];
  commented: IBasicTorrentDetails[];
}

class HistoryService {
  get maxStoredTorrentsPerCategory () { return 25; }

  public addViewedTorrent(torrentDetails: IBasicTorrentDetails) {
    return this.performStorageProcess(torrentDetails, 'viewed');
  }

  public addDownloadedTorrent(torrentDetails: IBasicTorrentDetails) {
    return this.performStorageProcess(torrentDetails, 'downloaded');
  }

  public addCommentedTorrent(torrentDetails: IBasicTorrentDetails) {
    return this.performStorageProcess(torrentDetails, 'viewed');
  }

  private performStorageProcess(torrentDetails: IBasicTorrentDetails, type: 'viewed' | 'downloaded' | 'commented') {
    return new Promise((resolve, reject) => {
      if (torrentDetails) {
        chromeStorageService.getItem<IStoredHistoryData>(ChromeStorageKeys.History).then(data => {
          if (!data) {
            data = {
              viewed: [],
              downloaded: [],
              commented: [],
            };
          }

          data[type].push(torrentDetails);
          if (data[type].length > this.maxStoredTorrentsPerCategory) {
            data[type].pop();
          }
          chromeStorageService.setItem<IStoredHistoryData>(ChromeStorageKeys.History, data).then(resolve);
        });
      } else {
        reject(null);
      }
    });
  }
}

export default new HistoryService();
