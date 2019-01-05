export interface ITorrentCategory {
  title: string;
  link: string;
  imageLink: string;
}

export interface ITorrentDetails {
  id: number;
  title: string;
  isNew: boolean;
  isFavourite: boolean;
  isFreeLeech: boolean;
  subTitle?: string;
  detailsLink: string;
  torrentLink: string;
  category: ITorrentCategory;
  filesCount: number;
  commentsCount: number;
  addedDate: string;
  size: string;
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
