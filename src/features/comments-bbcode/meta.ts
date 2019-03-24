import IMeta from '../../interfaces/meta';
import { Browsers } from '../../enums';

const meta: IMeta = {
  id: 'sl-comments-bbcode',
  description: 'featureCommentsFormattingDescription',
  title: 'featureCommentsFormattingTitle',
  defaultStatus: true,
  excludedBrowsers: [Browsers.Firefox],
};

export default meta;
