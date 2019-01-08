import * as React from 'react';
import { IBasicTorrentDetails } from '../../../../../interfaces/torrent';

import './torrent.component.scss';

export default class TorrentComponent extends React.Component<{ torrent: IBasicTorrentDetails }, {}> {
  constructor(props: { torrent: IBasicTorrentDetails }) {
    super(props);
  }

  render() {
    const linkomanijaLink = 'http://www.linkomanija.net/';

    return (
      <a className='torrent' target='_blank' href={linkomanijaLink + this.props.torrent.detailsLink} title={this.props.torrent.title}>
        <span className='torrent__category' title={this.props.torrent.category.title}>
          <img src={'http:' + this.props.torrent.category.imageLink} />
        </span>
        <span className='torrent__title'>
          {this.props.torrent.title}
        </span>
      </a>
    );
  }
}
