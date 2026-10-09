import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ReleaseComponent from './release/release.component';

import historyService from '../../../../services/common/history.service';
import { IBasicReleaseDetails } from '../../../../interfaces/release';

import './release-history-group.component.scss';

interface IReleaseHistoryGroupComponentProps {
  title: string;
  type: 'viewed' | 'downloaded' | 'commented';
}

export default function ReleaseHistoryGroupComponent({ title, type }: IReleaseHistoryGroupComponentProps) {
  const [releases, setReleases] = useState<IBasicReleaseDetails[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    historyService.getHistory(type).then(historyData => {
      if (historyData) {
        setReleases(historyData[type].items);
        setTotal(historyData[type].total);
      }
    });
  }, [type]);

  const validReleases = releases.filter(Boolean);

  return (
    <div className='release-group'>
      <div className='release-group__heading'>
        <div className='heading__title'>{title}</div>
        <div className='heading__sub-title'>
          <FormattedMessage id='tabsHistoryTotalLabel'></FormattedMessage> <strong>{total}</strong>
        </div>
      </div>
      <div className='release-group__releases'>
        {validReleases.length > 0
          ? validReleases.map(releaseDetails => <ReleaseComponent key={releaseDetails.id} release={releaseDetails}></ReleaseComponent>)
          : <FormattedMessage id='tabsHistoryNoReleaseEntriesLabel'></FormattedMessage>}
      </div>
    </div>
  );
}
