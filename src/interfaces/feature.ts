import IMeta from './meta';
import IContent from './content';

export interface IFeatureData {
  songs?: string[];
  counter?: number;
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
