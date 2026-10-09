
import BrowserStorageService from './browser-storage.service';

import { IHistory } from '../../interfaces/history';
import { IBasicReleaseDetails } from '../../interfaces/release';
import { ChromeStorageKeys } from '../../enums';

const browserStorageService = new BrowserStorageService();

type THistoryTypes = 'viewed' | 'downloaded' | 'commented';

class HistoryService {
  get maxStoredReleasesPerCategory () { return 25; }

  public getHistory(type: THistoryTypes) {
    return browserStorageService.getItem<IHistory>(`${ChromeStorageKeys.History}_${type}`);
  }

  public addViewedRelease(releaseDetails: IBasicReleaseDetails) {
    return this.performStorageProcess(releaseDetails, 'viewed');
  }

  public addDownloadedRelease(releaseDetails: IBasicReleaseDetails) {
    return this.performStorageProcess(releaseDetails, 'downloaded');
  }

  public addCommentedRelease(releaseDetails: IBasicReleaseDetails) {
    return this.performStorageProcess(releaseDetails, 'commented');
  }

  private async performStorageProcess(releaseDetails: IBasicReleaseDetails, type: THistoryTypes) {
    if (!releaseDetails) {
      return;
    }

    const storageKey = `${ChromeStorageKeys.History}_${type}`;
    const data = await browserStorageService.getItem<IHistory>(storageKey) ?? {
      [type]: {
        items: [],
        total: 0,
      }
    };

    if (data[type].items.length === 0 || data[type].items[0].id !== releaseDetails.id) {
      data[type].items.unshift(releaseDetails);
      data[type].total++;
      if (data[type].items.length > this.maxStoredReleasesPerCategory) {
        data[type].items.pop();
      }
      await browserStorageService.setItem<IHistory>(storageKey, data);
    }
  }
}

export default new HistoryService();
