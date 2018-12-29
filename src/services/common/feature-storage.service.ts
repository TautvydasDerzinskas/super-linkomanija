
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

  public trackVideo(featureId: string, videoId: string) {
    this.getFeatureData(featureId).then(featureData => {
      if (featureData.data.songs[0] !== videoId) {
        if (featureData.data.songs.length === 25) {
          featureData.data.songs.pop();
        }
        featureData.data.songs.unshift(videoId);
        featureData.data.counter++;
        this.storeFeatureData(featureId, featureData.data);
      }
    });
  }

  public initialize(): void {
    this.getFeatures().then((features: IFeaturesStorageObject) => {
      if (features == null) {
        const freshFeatures: IFeaturesStorageObject = {};

        FeaturesMeta.forEach(featureMeta => {
          freshFeatures[featureMeta.id] = {
            status: featureMeta.defaultStatus != null ? featureMeta.defaultStatus : true,
            data: featureMeta.defaultData || {},
          };
        });

        this.setItem(this.FEATURES_STORAGE_KEY, freshFeatures);
      }
    });
  }
}

export default new FeatureStorageService();
