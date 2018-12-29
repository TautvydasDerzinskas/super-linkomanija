import * as React from 'react';
import VideoComponent from './video/video.component';

import IMeta from '../../../../interfaces/meta';
import { IFeatureData } from '../../../../interfaces/feature';
import { IYoutubeSnippetResponse, IYoutubeSnippetItem } from './feature-stats.interface';

import { ApiKeys } from '../../../../enums';


import './feature-stats-group.component.scss';

interface IFeatureStatsGroupComponentState {
  data: {
    videos: IYoutubeSnippetItem[];
  };
}

export default class FeatureStatsGroupComponent extends React.Component<{ meta: IMeta, data: IFeatureData }, IFeatureStatsGroupComponentState> {
  constructor(props: { meta: IMeta, data: IFeatureData }) {
    super(props);
    this.state = {
      data: {
        videos: []
      },
    };
  }

  render() {
    return (
      <div className='feature-group'>
        <div className='feature-group__heading'>
          <div className='feature-group__title'>Recent video(s) {this.props.meta.actionTitle}:</div>
          <div className='feature-group__sub-title'>Total <strong>{this.props.data.counter}</strong> video(s) {this.props.meta.actionTitle}</div>
        </div>
      </div>
    );
  }
}
