import { useIntl } from 'react-intl';
import ReleaseHistoryGroupComponent from './release-history-group/release-history-group.component';

export default function HistoryComponent() {
  const intl = useIntl();

  return (
  <div className='history'>
    <ReleaseHistoryGroupComponent title={intl.formatMessage({ id: 'tabsHistoryRecentViewedLabel' })} type='viewed'></ReleaseHistoryGroupComponent>
    <ReleaseHistoryGroupComponent title={intl.formatMessage({ id: 'tabsHistoryRecentDownloadedLabel' })} type='downloaded'></ReleaseHistoryGroupComponent>
    <ReleaseHistoryGroupComponent title={intl.formatMessage({ id: 'tabsHistoryRecentCommentedLabel' })} type='commented'></ReleaseHistoryGroupComponent>
  </div>
  );
}
