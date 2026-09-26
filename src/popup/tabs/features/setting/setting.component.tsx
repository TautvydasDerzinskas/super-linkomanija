import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import IMeta from '../../../../interfaces/meta';
import { IMessageToggle } from '../../../../interfaces/communication';
import featureStorageService from '../../../../services/common/feature-storage.service';
import Tooltip from '../../../shared/tooltip/tooltip.component';

import './setting.component.scss';

interface ISettingComponentProps {
  meta: IMeta;
}

async function notifyTabsAboutChange(featureId: string, newValue: boolean) {
  const message: IMessageToggle = {
    toggle: {
      featureId,
      value: newValue
    }
  };

  const tabs = await chrome.tabs.query({ url: '*://*.linkomanija.net/*' });
  for (const tab of tabs) {
    // Tabs opened before the extension was installed or updated have no content script to receive it
    chrome.tabs.sendMessage(tab.id, message).catch(() => {});
  }
}

export default function SettingComponent({ meta }: ISettingComponentProps) {
  const intl = useIntl();
  const [value, setValue] = useState(false);

  useEffect(() => {
    featureStorageService.getFeatureData(meta.id).then(featureData => {
      setValue(featureData.status);
    });
  }, [meta.id]);

  const toggleFeature = () => {
    featureStorageService.toggleFeatureStatus(meta.id).then(featureData => {
      setValue(featureData.status);
      notifyTabsAboutChange(meta.id, featureData.status);
    });
  };

  return (
    <div className='setting'>
      <div className='setting__column'>
        <div className='setting__title'>
          <FormattedMessage id={meta.title}></FormattedMessage>
        </div>
        <div>
          <FormattedMessage id={meta.description}></FormattedMessage>
        </div>
      </div>
      <div className='setting__column'>
        <Tooltip title={intl.formatMessage({ id: (value ? 'settingTurnOff' : 'settingTurnOn') })} position='top'>
          <label className='setting__switch'>
            <input type='checkbox' checked={value} onChange={toggleFeature} />
            <span className='slider slider--round'></span>
          </label>
        </Tooltip>
      </div>
    </div>
  );
}
