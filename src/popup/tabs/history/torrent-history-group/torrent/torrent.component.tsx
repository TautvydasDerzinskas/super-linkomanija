import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { Tooltip } from 'react-tippy';

import { IBasicTorrentDetails } from '../../../../../interfaces/torrent';

import './torrent.component.scss';

interface ITorrentComponentProps extends InjectedIntlProps {
  torrent: IBasicTorrentDetails;
}

class TorrentComponent extends React.Component<ITorrentComponentProps, {}> {
  constructor(props: ITorrentComponentProps) {
    super(props);
  }

  render() {
    const { intl } = this.props;
    const linkomanijaLink = 'http://www.linkomanija.net/';

    return (
      <Tooltip title={intl.formatMessage({ id: 'open' })} arrow={true} position='top'>
        <a className='torrent' target='_blank' href={linkomanijaLink + 'details?' + this.props.torrent.id} title={this.props.torrent.title}>
          <span className='torrent__category'>
            <img src={'http:' + this.props.torrent.category.imageLink} />
          </span>
          <span className='torrent__title'>
            {this.props.torrent.title}
          </span>
        </a>
      </Tooltip>
    );
  }
}

export default injectIntl(TorrentComponent);
