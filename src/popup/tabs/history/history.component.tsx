import { useIntl } from 'react-intl';
import TorrentHistoryGroupComponent from './torrent-history-group/torrent-history-group.component';

export default function HistoryComponent() {
  const intl = useIntl();

  return (
  <div className='history'>
    <TorrentHistoryGroupComponent title={intl.formatMessage({ id: 'tabsHistoryRecentViewedLabel' })} type='viewed'></TorrentHistoryGroupComponent>
    <TorrentHistoryGroupComponent title={intl.formatMessage({ id: 'tabsHistoryRecentDownloadedLabel' })} type='downloaded'></TorrentHistoryGroupComponent>
    <TorrentHistoryGroupComponent title={intl.formatMessage({ id: 'tabsHistoryRecentCommentedLabel' })} type='commented'></TorrentHistoryGroupComponent>
  </div>
  );
}
