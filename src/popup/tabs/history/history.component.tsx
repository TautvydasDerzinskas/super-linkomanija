

import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import TorrentHistoryGroupComponent from './torrent-history-group/torrent-history-group.component';

class HistoryComponent extends React.Component<InjectedIntlProps, {}> {
  constructor(props: InjectedIntlProps) {
    super(props);
    this.state = { data: {} };
  }

  render() {
    const { intl } = this.props;

    return (
    <div className='history'>
      <TorrentHistoryGroupComponent title={intl.formatMessage({ id: 'tabsHistoryRecentViewedLabel' })} type='viewed'></TorrentHistoryGroupComponent>
      <TorrentHistoryGroupComponent title={intl.formatMessage({ id: 'tabsHistoryRecentDownloadedLabel' })} type='downloaded'></TorrentHistoryGroupComponent>
      <TorrentHistoryGroupComponent title={intl.formatMessage({ id: 'tabsHistoryRecentCommentedLabel' })} type='commented'></TorrentHistoryGroupComponent>
    </div>
    );
  }
}

export default injectIntl(HistoryComponent);
