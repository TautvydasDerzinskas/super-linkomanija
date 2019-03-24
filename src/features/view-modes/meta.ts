import IMeta from '../../interfaces/meta';
import { ViewModes } from '../../enums';

const meta: IMeta = {
  id: 'sl-view-modes',
  description: 'featureViewModesDescription',
  title: 'featureViewModesTitle',
  defaultStatus: true,
  defaultData: {
    mode: ViewModes.List,
  },
  excludedBrowsers: [],
};

export default meta;
