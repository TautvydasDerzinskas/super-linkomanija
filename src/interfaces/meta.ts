import { Browsers } from '../enums';

export default interface IMeta {
  id: string;
  description: string;
  title: string;
  defaultStatus?: boolean;
  defaultData?: any;
  excludedBrowsers: Browsers[];
}
