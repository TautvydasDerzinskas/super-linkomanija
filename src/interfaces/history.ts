import { IBasicTorrentDetails } from './torrent';

export interface IHistory {
  viewed: IBasicTorrentDetails[];
  downloaded: IBasicTorrentDetails[];
  commented: IBasicTorrentDetails[];
}
