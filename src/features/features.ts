import ContentCommentsBbcode from './comments-bbcode/content';
import ContentTorrentPreview from './torrent-preview/content';
import ContentViewModes from './view-modes/content';
import ContentHomepageRedirect from './homepage-redirect/content';
import ContentBackToTop from './back-to-top/content';
import ContentRelatedTorrents from './related-torrents/content';
import ContentReleaseTracker from './release-tracker/content';
import ContentAutoLogin from './auto-login/content';
import ContentThemeSync from './theme-sync/content';
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
  ContentReleaseTracker,
  ContentAutoLogin,
  ContentThemeSync,
];

export const Features: IFeature[] = FeaturesMeta.map((meta, index) => ({ meta, content: contents[index] }));
