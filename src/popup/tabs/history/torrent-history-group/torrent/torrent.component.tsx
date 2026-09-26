import { useIntl } from 'react-intl';

import { IBasicTorrentDetails } from '../../../../../interfaces/torrent';
import Tooltip from '../../../../shared/tooltip/tooltip.component';

import './torrent.component.scss';

interface ITorrentComponentProps {
  torrent: IBasicTorrentDetails;
}

const linkomanijaLink = 'http://www.linkomanija.net/';

export default function TorrentComponent({ torrent }: ITorrentComponentProps) {
  const intl = useIntl();

  return (
    <Tooltip title={intl.formatMessage({ id: 'open' })} position='top'>
      <a className='torrent' target='_blank' href={linkomanijaLink + 'details?' + torrent.id} title={torrent.title}>
        <span className='torrent__category'>
          <img src={'http:' + torrent.category.imageLink} />
        </span>
        <span className='torrent__title'>
          {torrent.title}
        </span>
      </a>
    </Tooltip>
  );
}
