import MetaCommentsBbcode from './comments-bbcode/meta';
import ContentCommentsBbcode from './comments-bbcode/content';

import IFeature from '../interfaces/feature';
import IMeta from '../interfaces/meta';

export const Features: IFeature[] = [
  {
    meta: MetaCommentsBbcode,
    content: ContentCommentsBbcode,
  },
];

const FeaturesMeta: IMeta[] = [];
Features.forEach(feature => { FeaturesMeta.push(feature.meta); });
export { FeaturesMeta };
