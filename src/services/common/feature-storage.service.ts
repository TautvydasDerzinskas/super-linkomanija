
import BrowserStorageService from './browser-storage.service';

import { ChromeStorageKeys } from '../../enums';

import { FeaturesMeta } from '../../features/features-meta';
import { IFeaturesStorageObject, IFeatureStoredData, IFeatureData } from '../../interfaces/feature';

class FeatureStorageService extends BrowserStorageService {
  public getFeatures(): Promise<IFeaturesStorageObject> {
    return this.getItem<IFeaturesStorageObject>(ChromeStorageKeys.Features);
  }

  public async getFeatureData(featureId: string): Promise<IFeatureStoredData> {
    const features = await this.getFeatures();
    return features[featureId];
  }

  public async toggleFeatureStatus(featureId: string, value?: boolean): Promise<IFeatureStoredData> {
    const features = await this.getFeatures();
    features[featureId].status = typeof value === 'boolean' ? value : !features[featureId].status;
    await this.setItem<IFeaturesStorageObject>(ChromeStorageKeys.Features, features);
    return features[featureId];
  }

  public async storeFeatureData(featureId: string, data: IFeatureData): Promise<IFeatureStoredData> {
    const features = await this.getFeatures();
    features[featureId].data = data;
    await this.setItem<IFeaturesStorageObject>(ChromeStorageKeys.Features, features);
    return features[featureId];
  }

  public async initialize() {
    const features = await this.getFeatures();
    const freshFeatures: IFeaturesStorageObject = {};

    FeaturesMeta.forEach(featureMeta => {
      if (!features || !features[featureMeta.id]) {
        freshFeatures[featureMeta.id] = {
          status: featureMeta.defaultStatus ?? true,
          data: featureMeta.defaultData || {},
        };
      } else {
        freshFeatures[featureMeta.id] = features[featureMeta.id];
      }
    });

    await this.setItem<IFeaturesStorageObject>(ChromeStorageKeys.Features, freshFeatures);
  }
}

export default new FeatureStorageService();
