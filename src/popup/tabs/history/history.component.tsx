

import * as React from 'react';
import FeatureStatsGroupComponent from './feature-stats-group/feature-stats-group.component';
import featureStorageService from '../../../services/common/feature-storage.service';
import { IFeaturesStorageObject } from '../../../interfaces/feature';

import { FeaturesMeta } from '../../../features/features';

interface HistoryComponentState {
  data: IFeaturesStorageObject;
}

export default class HistoryComponent extends React.Component<{}, HistoryComponentState> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    featureStorageService.getFeatures().then(featuresData => {
      this.setState({
        data: featuresData,
      });
    });
  }


  render() {
    let allGroupsHtml;
    if (this.state.data != null) {
      allGroupsHtml = FeaturesMeta.map((featureMeta) => {
        return (<FeatureStatsGroupComponent
          key={featureMeta.id}
          meta={featureMeta}
          data={this.state.data[featureMeta.id].data}>
        </FeatureStatsGroupComponent>);
      });
    }

    return (
      <div className='history'>
        {allGroupsHtml}
      </div>
    );
  }
}
