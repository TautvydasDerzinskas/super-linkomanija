import IMeta from './meta';
import IContent from './content';
import { ViewModes } from '../enums';

export interface IFeatureData {
  mode?: ViewModes;
}

export interface IFeatureStoredData {
  status: boolean;
  data: IFeatureData;
}

export interface IFeaturesStorageObject {
  [index: string]: IFeatureStoredData;
}

interface IFeature {
  meta: IMeta;
  content: IContent;
}

export default IFeature;
