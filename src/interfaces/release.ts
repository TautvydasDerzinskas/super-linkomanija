export interface IReleaseComment {
  author: {
    name: string;
    title: string;
    id: number;
    imageLink: string;
  };
  message: string;
  rating: string;
}

export interface IReleaseCategory {
  title?: string;
  link?: string;
  imageLink: string;
}

export interface IBasicReleaseDetails {
  id: number;
  title: string;
  category: IReleaseCategory;
}

export interface IReleaseDetails extends IBasicReleaseDetails {
  detailsLink: string;
  downloadLink: string;
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
   * Data comming from release details page
   */
  comments?: IReleaseComment[];
  descriptionHtml?: string;
  imageLinks?: string[];
}
