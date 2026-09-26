import ContentCommentsBbcode from './comments-bbcode/content';
import ContentTorrentPreview from './torrent-preview/content';
import ContentViewModes from './view-modes/content';
import ContentHomepageRedirect from './homepage-redirect/content';
import ContentBackToTop from './back-to-top/content';
import ContentRelatedTorrents from './related-torrents/content';
import { FeaturesMeta } from './features-meta';

import IFeature from '../interfaces/feature';
import IContent from '../interfaces/content';

const contents: IContent[] = [
  ContentCommentsBbcode,
  ContentTorrentPreview,
  ContentViewModes,
  ContentHomepageRedirect,
  ContentBackToTop,
  ContentRelatedTorrents,
];

export const Features: IFeature[] = FeaturesMeta.map((meta, index) => ({ meta, content: contents[index] }));
