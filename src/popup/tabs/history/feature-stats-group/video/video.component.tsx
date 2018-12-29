import * as React from 'react';

import { IYoutubeSnippetItem } from '../feature-stats.interface';

import './video.component.scss';

export default class VideoComponent extends React.Component<{ video: IYoutubeSnippetItem }, {}> {
  constructor(props: { video: IYoutubeSnippetItem }) {
    super(props);
  }

  render() {
    return (
      <a className='video' href={'https://www.youtube.com/watch?v=' + this.props.video.id} title={this.props.video.snippet.title} target='_blank'>
        <span className='video__thumbnail'>
          <img height='30px' src={this.props.video.snippet.thumbnails.default.url} />
        </span>
        <span className='video__title'>{this.props.video.snippet.title}</span>
        <span className='video__play-button'>
          <img className='play-button--active' src='icons/icon_19x19.png' height='10px' width='10px' />
          <img className='play-button--disabled' src='icons/icon_disabled_19x19.png' height='10px' width='10px' />
        </span>
      </a>
    );
  }
}
