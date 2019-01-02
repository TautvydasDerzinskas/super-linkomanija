
import ChromeStorageService from './chrome-storage.service';

import { FeaturesMeta } from '../../features/features';
import { IFeaturesStorageObject, IFeatureStoredData, IFeatureData } from '../../interfaces/feature';

class FeatureStorageService extends ChromeStorageService {
  private FEATURES_STORAGE_KEY = 'mygaFeatures';

  constructor() {
    super();
  }

  public getFeatures(): Promise<IFeaturesStorageObject> {
    return this.getItem(this.FEATURES_STORAGE_KEY);
  }

  public getFeatureData<T>(featureId: string): Promise<IFeatureStoredData> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject) => {
        resolve(features[featureId]);
      });
    });
  }

  public toggleFeatureStatus(featureId: string, value?: boolean): Promise<IFeatureStoredData> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject) => {
        features[featureId].status = typeof value === 'boolean' ? value : !features[featureId].status;
        this.setItem(this.FEATURES_STORAGE_KEY, features).then(() => {
          resolve(features[featureId]);
        });
      });
    });
  }

  public storeFeatureData<T>(featureId: string, data: IFeatureData): Promise<IFeatureStoredData> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject) => {
        features[featureId].data = data;
        this.setItem(this.FEATURES_STORAGE_KEY, features).then(() => {
          resolve(features[featureId]);
        });
      });
    });
  }

  public initialize(): void {
    this.getFeatures().then((features: IFeaturesStorageObject) => {
        const freshFeatures: IFeaturesStorageObject = {};

        FeaturesMeta.forEach(featureMeta => {
          if (!features || !features[featureMeta.id]) {
            freshFeatures[featureMeta.id] = {
              status: featureMeta.defaultStatus != null ? featureMeta.defaultStatus : true,
              data: featureMeta.defaultData || {},
            };
          } else {
            freshFeatures[featureMeta.id] = features[featureMeta.id];
          }
        });

        this.setItem(this.FEATURES_STORAGE_KEY, freshFeatures);
    });
  }
}

export default new FeatureStorageService();
