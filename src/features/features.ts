import MetaCommentsBbcode from './comments-bbcode/meta';
import ContentCommentsBbcode from './comments-bbcode/content';
import MetaTorrentPreview from './torrent-preview/meta';
import ContentTorrentPreview from './torrent-preview/content';
import MetaViewModes from './view-modes/meta';
import ContentViewModes from './view-modes/content';
import MetaHomepageRedirect from './homepage-redirect/meta';
import ContentHomepageRedirect from './homepage-redirect/content';
import MetaBackToTop from './back-to-top/meta';
import ContentBackToTop from './back-to-top/content';
import MetaRelatedTorrents from './related-torrents/meta';
import ContentRelatedTorrents from './related-torrents/content';

import IFeature from '../interfaces/feature';
import IMeta from '../interfaces/meta';

export const Features: IFeature[] = [
  {
    meta: MetaCommentsBbcode,
    content: ContentCommentsBbcode,
  },
  {
    meta: MetaTorrentPreview,
    content: ContentTorrentPreview,
  },
  {
    meta: MetaViewModes,
    content: ContentViewModes,
  },
  {
    meta: MetaHomepageRedirect,
    content: ContentHomepageRedirect,
  },
  {
    meta: MetaBackToTop,
    content: ContentBackToTop,
  },
  {
    meta: MetaRelatedTorrents,
    content: ContentRelatedTorrents,
  },
];

const FeaturesMeta: IMeta[] = [];
Features.forEach(feature => { FeaturesMeta.push(feature.meta); });
export { FeaturesMeta };
