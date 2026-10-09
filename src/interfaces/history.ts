import { IBasicReleaseDetails } from './release';

export interface IHistoryItemData {
  items: IBasicReleaseDetails[];
  total: number;
}

export interface IHistory {
  viewed?: IHistoryItemData;
  downloaded?: IHistoryItemData;
  commented?: IHistoryItemData;
}
