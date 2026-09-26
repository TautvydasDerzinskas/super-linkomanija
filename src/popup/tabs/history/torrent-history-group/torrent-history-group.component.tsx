import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import TorrentComponent from './torrent/torrent.component';

import historyService from '../../../../services/common/history.service';
import { IBasicTorrentDetails } from '../../../../interfaces/torrent';

import './torrent-history-group.component.scss';

interface ITorrentHistoryGroupComponentProps {
  title: string;
  type: 'viewed' | 'downloaded' | 'commented';
}

export default function TorrentHistoryGroupComponent({ title, type }: ITorrentHistoryGroupComponentProps) {
  const [torrents, setTorrents] = useState<IBasicTorrentDetails[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    historyService.getHistory(type).then(historyData => {
      if (historyData) {
        setTorrents(historyData[type].items);
        setTotal(historyData[type].total);
      }
    });
  }, [type]);

  const validTorrents = torrents.filter(Boolean);

  return (
    <div className='torrent-group'>
      <div className='torrent-group__heading'>
        <div className='heading__title'>{title}</div>
        <div className='heading__sub-title'>
          <FormattedMessage id='tabsHistoryTotalLabel'></FormattedMessage> <strong>{total}</strong>
        </div>
      </div>
      <div className='torrent-group__torrents'>
        {validTorrents.length > 0
          ? validTorrents.map(torrentDetails => <TorrentComponent key={torrentDetails.id} torrent={torrentDetails}></TorrentComponent>)
          : <FormattedMessage id='tabsHistoryNoTorrentEntriesLabel'></FormattedMessage>}
      </div>
    </div>
  );
}
