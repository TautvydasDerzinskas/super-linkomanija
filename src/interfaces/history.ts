import { IBasicTorrentDetails } from './torrent';

export interface IHistoryItemData {
  items: IBasicTorrentDetails[];
  total: number;
}

export interface IHistory {
  viewed?: IHistoryItemData;
  downloaded?: IHistoryItemData;
  commented?: IHistoryItemData;
}
