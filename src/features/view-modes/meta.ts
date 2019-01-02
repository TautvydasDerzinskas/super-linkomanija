import IMeta from '../../interfaces/meta';
import { ViewModes } from '../../enums';

const meta: IMeta = {
  id: 'sl-view-modes',
  description: 'Switch between list and grid view modes while browsing torrents',
  title: 'View modes',
  defaultStatus: true,
  defaultData: {
    mode: ViewModes.List,
  },
};

export default meta;
