import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import TorrentComponent from './torrent/torrent.component';

import { IBasicTorrentDetails } from '../../../../interfaces/torrent';

import './torrent-history-group.component.scss';

interface ITorrentHistoryGroupComponentProps {
  title: string;
  torrents: IBasicTorrentDetails[];
}

export default class TorrentHistoryGroupComponent extends React.Component<ITorrentHistoryGroupComponentProps> {
  constructor(props: ITorrentHistoryGroupComponentProps) {
    super(props);
  }

  render() {
    let allTorrentItems: any = <FormattedMessage id='tabsHistoryNoTorrentEntriesLabel'></FormattedMessage>;

    if (this.props.torrents != null && this.props.torrents.length > 0) {
      allTorrentItems = this.props.torrents.map((torrentDetails) => {
        if (torrentDetails) {
          return <TorrentComponent key={torrentDetails.id} torrent={torrentDetails}></TorrentComponent>;
        }
      });
    }

    return (
      <div className='torrent-group'>
        <div className='torrent-group__title'>{this.props.title}</div>
        <div className='torrent-group__torrents'>{allTorrentItems}</div>
      </div>
    );
  }
}
