import * as React from 'react';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import TorrentComponent from './torrent/torrent.component';

import { IBasicTorrentDetails } from '../../../../interfaces/torrent';

import './torrent-history-group.component.scss';

interface ITorrentHistoryGroupComponentProps extends InjectedIntlProps {
  title: string;
  torrents: IBasicTorrentDetails[];
}

class TorrentHistoryGroupComponent extends React.Component<ITorrentHistoryGroupComponentProps> {
  constructor(props: ITorrentHistoryGroupComponentProps) {
    super(props);
  }

  render() {
    const { intl } = this.props;

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

export default injectIntl(TorrentHistoryGroupComponent);
