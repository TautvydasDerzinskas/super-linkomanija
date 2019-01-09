export interface ITorrentCategory {
  title?: string;
  link?: string;
  imageLink: string;
}

export interface IBasicTorrentDetails {
  id: number;
  title: string;
  category: ITorrentCategory;
}

export interface ITorrentDetails extends IBasicTorrentDetails {
  detailsLink: string;
  torrentLink: string;
  subTitle?: string;
  size: string;
  isNew: boolean;
  isFavourite: boolean;
  isFreeLeech: boolean;
  filesCount: number;
  commentsCount: number;
  addedDate: string;
  downloadedTimes: number;
  seedersCount: number;
  leechersCount: number;
  /**
   * Data comming from torrent details page
   */
  descriptionHtml?: string;
  commentsHtml?: string;
  imageLinks?: string[];
}
