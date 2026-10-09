import MetaCommentsBbcode from './comments-bbcode/meta';
import MetaReleasePreview from './release-preview/meta';
import MetaViewModes from './view-modes/meta';
import MetaHomepageRedirect from './homepage-redirect/meta';
import MetaBackToTop from './back-to-top/meta';
import MetaRelatedReleases from './related-releases/meta';
import MetaReleaseNotifier from './release-notifier/meta';
import MetaAutoLogin from './auto-login/meta';
import MetaThemeSync from './theme-sync/meta';

import IMeta from '../interfaces/meta';

// Kept apart from the feature contents, so background and popup do not bundle page scripts
export const FeaturesMeta: IMeta[] = [
  MetaCommentsBbcode,
  MetaReleasePreview,
  MetaViewModes,
  MetaHomepageRedirect,
  MetaBackToTop,
  MetaRelatedReleases,
  MetaReleaseNotifier,
  MetaAutoLogin,
  MetaThemeSync,
];
