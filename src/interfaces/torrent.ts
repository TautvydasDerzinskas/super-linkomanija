export interface ITorrentCategory {
  title: string;
  link: string;
  imageLink: string;
}

interface IBasicTorrentDetails {
  id: number;
  title: string;
  detailsLink: string;
  torrentLink: string;
  category: ITorrentCategory;
  size: string;
}

export interface ITorrentDetails extends IBasicTorrentDetails {
  subTitle?: string;
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
