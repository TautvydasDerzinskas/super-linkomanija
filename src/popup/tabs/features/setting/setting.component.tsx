import * as React from 'react';

import IMeta from '../../../../interfaces/meta';
import { IMessageToggle } from '../../../../interfaces/communication';
import featureStorageService from '../../../../services/common/feature-storage.service';

import './setting.component.scss';

interface ISettingComponentState {
  data: {
    value: boolean;
  };
}

export default class SettingComponent extends React.Component<{ meta: IMeta }, ISettingComponentState> {
  constructor(props: { meta: IMeta }) {
    super(props);
    this.state = {
      data: {
        value: false,
      },
    };
  }

  componentDidMount() {
    featureStorageService.getFeatureData(this.props.meta.id).then(featureData => {
      this.setState({
        data: {
          value: featureData.status,
        }
      });
    });
  }

  public toggleFeature() {
    featureStorageService.toggleFeatureStatus(this.props.meta.id).then(featureData => {
      this.setState({
        data: {
          value: featureData.status,
        }
      });
      this.notifyTabsAboutChange(featureData.status);
    });
  }

  private notifyTabsAboutChange(newValue: boolean) {
    const message: IMessageToggle = {
      toggle: {
        featureId: this.props.meta.id,
        value: newValue
      }
    };

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, message);
      });
    });
  }

  render() {
    return (
      <div className='setting'>
        <div className='setting__column'>
          <div className='setting__title'>{this.props.meta.title}</div>
          <div>{this.props.meta.description}</div>
        </div>
        <div className='setting__column'>
          <label className='setting__switch'>
            <input type='checkbox' checked={this.state.data.value} onChange={this.toggleFeature.bind(this)} />
            <span className='slider slider--round'></span>
          </label>
        </div>
      </div>
    );
  }
}
