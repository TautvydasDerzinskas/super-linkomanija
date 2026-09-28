import { Browsers } from '../enums';

export default interface IMeta {
  id: string;
  description: string;
  title: string;
  defaultStatus?: boolean;
  defaultData?: any;
  excludedBrowsers: Browsers[];
  // Popup route with the feature's settings, reachable through a cog while the feature is on
  settingsRoute?: string;
}
