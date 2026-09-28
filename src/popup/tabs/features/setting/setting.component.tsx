import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router';

import IMeta from '../../../../interfaces/meta';
import { IMessageToggle } from '../../../../interfaces/communication';
import { IMessageReleaseTracker } from '../../../../interfaces/release-tracker';
import releaseTrackerMeta from '../../../../features/release-tracker/meta';
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
      if (meta.id === releaseTrackerMeta.id && featureData.status) {
        const message: IMessageReleaseTracker = { releaseTracker: 'check' };
        chrome.runtime.sendMessage(message);
      }
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
      <div className='setting__column setting__column--controls'>
        {value && meta.settingsRoute && (
          <Tooltip title={intl.formatMessage({ id: 'settingConfigure' })} position='top'>
            <Link className='setting__configure' to={meta.settingsRoute} aria-label={intl.formatMessage({ id: 'settingConfigure' })}>
              <svg viewBox='0 0 24 24' width='18' height='18' aria-hidden='true'>
                <path d='M19.14 12.94a7.07 7.07 0 0 0 0-1.88l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.61.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.07 7.07 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.3.61.22l2.39-.96c.49.38 1.03.7 1.62.94l.36 2.54c.05.24.26.42.5.42h3.84c.25 0 .46-.18.5-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.48 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z' />
              </svg>
            </Link>
          </Tooltip>
        )}
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
