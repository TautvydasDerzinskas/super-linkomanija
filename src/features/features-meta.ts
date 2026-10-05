import MetaCommentsBbcode from './comments-bbcode/meta';
import MetaTorrentPreview from './torrent-preview/meta';
import MetaViewModes from './view-modes/meta';
import MetaHomepageRedirect from './homepage-redirect/meta';
import MetaBackToTop from './back-to-top/meta';
import MetaRelatedTorrents from './related-torrents/meta';
import MetaReleaseTracker from './release-tracker/meta';
import MetaAutoLogin from './auto-login/meta';
import MetaThemeSync from './theme-sync/meta';

import IMeta from '../interfaces/meta';

// Kept apart from the feature contents, so background and popup do not bundle page scripts
export const FeaturesMeta: IMeta[] = [
  MetaCommentsBbcode,
  MetaTorrentPreview,
  MetaViewModes,
  MetaHomepageRedirect,
  MetaBackToTop,
  MetaRelatedTorrents,
  MetaReleaseTracker,
  MetaAutoLogin,
  MetaThemeSync,
];
