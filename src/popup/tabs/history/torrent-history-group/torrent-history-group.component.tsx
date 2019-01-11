import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import TorrentComponent from './torrent/torrent.component';

import historyService from '../../../../services/common/history.service';
import { IBasicTorrentDetails } from '../../../../interfaces/torrent';

import './torrent-history-group.component.scss';

interface ITorrentHistoryGroupComponentProps {
  title: string;
  type: 'viewed' | 'downloaded' | 'commented';
}

interface ITorrentHistoryGroupComponentState {
  torrents: IBasicTorrentDetails[];
  total: number;
}

export default class TorrentHistoryGroupComponent extends React.Component<ITorrentHistoryGroupComponentProps, ITorrentHistoryGroupComponentState> {
  constructor(props: ITorrentHistoryGroupComponentProps) {
    super(props);
    this.state = {
      torrents: [],
      total: 0,
    };
  }

  componentDidMount() {
    historyService.getHistory(this.props.type).then(historyData => {
      if (historyData) {
        this.setState({
          torrents: historyData[this.props.type].items,
          total: historyData[this.props.type].total,
        });
      }
    });
  }


  render() {
    let allTorrentItems: any = <FormattedMessage id='tabsHistoryNoTorrentEntriesLabel'></FormattedMessage>;

    if (this.state.torrents.length > 0) {
      allTorrentItems = this.state.torrents.map((torrentDetails) => {
        if (torrentDetails) {
          return <TorrentComponent key={torrentDetails.id} torrent={torrentDetails}></TorrentComponent>;
        }
      });
    }

    return (
      <div className='torrent-group'>
        <div className='torrent-group__heading'>
          <div className='heading__title'>{this.props.title}</div>
          <div className='heading__sub-title'>
            <FormattedMessage id='tabsHistoryTotalLabel'></FormattedMessage> <strong>{this.state.total}</strong>
          </div>
        </div>
        <div className='torrent-group__torrents'>{allTorrentItems}</div>
      </div>
    );
  }
}
