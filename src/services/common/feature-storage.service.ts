
import ChromeStorageService from './chrome-storage.service';

import { ChromeStorageKeys } from '../../enums';

import { FeaturesMeta } from '../../features/features';
import { IFeaturesStorageObject, IFeatureStoredData, IFeatureData } from '../../interfaces/feature';

class FeatureStorageService extends ChromeStorageService {
  constructor() {
    super();
  }

  public getFeatures(): Promise<IFeaturesStorageObject> {
    return this.getItem(ChromeStorageKeys.Features);
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
        this.setItem(ChromeStorageKeys.Features, features).then(() => {
          resolve(features[featureId]);
        });
      });
    });
  }

  public storeFeatureData<T>(featureId: string, data: IFeatureData): Promise<IFeatureStoredData> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject) => {
        features[featureId].data = data;
        this.setItem(ChromeStorageKeys.Features, features).then(() => {
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

        this.setItem(ChromeStorageKeys.Features, freshFeatures);
    });
  }
}

export default new FeatureStorageService();
