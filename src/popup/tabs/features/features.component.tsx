import SettingComponent from './setting/setting.component';
import { FeaturesMeta } from '../../../features/features-meta';
import browserService from '../../../services/common/browser.service';

export default function FeaturesComponent() {
  const availableFeatures = FeaturesMeta.filter(featureMeta => !featureMeta.excludedBrowsers.includes(browserService.browserName));

  return (
    <div className='settings'>
      {availableFeatures.map(featureMeta => (
        <SettingComponent key={featureMeta.id} meta={featureMeta}></SettingComponent>
      ))}
    </div>
  );
}
