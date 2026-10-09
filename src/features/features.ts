import ContentCommentsBbcode from './comments-bbcode/content';
import ContentReleasePreview from './release-preview/content';
import ContentViewModes from './view-modes/content';
import ContentHomepageRedirect from './homepage-redirect/content';
import ContentBackToTop from './back-to-top/content';
import ContentRelatedReleases from './related-releases/content';
import ContentReleaseNotifier from './release-notifier/content';
import ContentAutoLogin from './auto-login/content';
import ContentThemeSync from './theme-sync/content';
import { FeaturesMeta } from './features-meta';

import IFeature from '../interfaces/feature';
import IContent from '../interfaces/content';

const contents: IContent[] = [
  ContentCommentsBbcode,
  ContentReleasePreview,
  ContentViewModes,
  ContentHomepageRedirect,
  ContentBackToTop,
  ContentRelatedReleases,
  ContentReleaseNotifier,
  ContentAutoLogin,
  ContentThemeSync,
];

export const Features: IFeature[] = FeaturesMeta.map((meta, index) => ({ meta, content: contents[index] }));
