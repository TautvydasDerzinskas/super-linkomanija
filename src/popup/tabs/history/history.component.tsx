

import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import TorrentHistoryGroupComponent from './torrent-history-group/torrent-history-group.component';
import historyService from '../../../services/common/history.service';

import { IHistory } from '../../../interfaces/history';

interface HistoryComponentState {
  data: IHistory;
}

class HistoryComponent extends React.Component<InjectedIntlProps, HistoryComponentState> {
  constructor(props: InjectedIntlProps) {
    super(props);
    this.state = { data: null };
  }

  componentDidMount() {
    historyService.getHistory().then(historyData => {
      this.setState({ data: historyData });
    });
  }


  render() {
    const { intl } = this.props;

    let torrentGroupsHtml;
    if (this.state.data) {
      torrentGroupsHtml = (
        <div className='history'>
          <TorrentHistoryGroupComponent title={intl.formatMessage({ id: 'tabsHistoryRecentViewedLabel' })} torrents={this.state.data.viewed}></TorrentHistoryGroupComponent>
          <TorrentHistoryGroupComponent title={intl.formatMessage({ id: 'tabsHistoryRecentDownloadedLabel' })} torrents={this.state.data.downloaded}></TorrentHistoryGroupComponent>
          <TorrentHistoryGroupComponent title={intl.formatMessage({ id: 'tabsHistoryRecentCommentedLabel' })} torrents={this.state.data.commented}></TorrentHistoryGroupComponent>
        </div>
      );
    }

    return torrentGroupsHtml || <div></div>;
  }
}

export default injectIntl(HistoryComponent);
