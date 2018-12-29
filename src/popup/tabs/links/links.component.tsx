

import * as React from 'react';
import LinkBoxComponent from './link-box/link-box.component';
import PaypalLinkBoxComponent from './paypal-link-box/paypal-link-box.component';

import { ShareLinks } from '../../../enums';

import './links.component.scss';

export default class LinksComponent extends React.Component<{}> {

  render() {
    const chromeStoreLink = `https://chrome.google.com/webstore/detail/${chrome.runtime.id}`;

    return (
      <div className='links'>
        <div className='links__column'>
          <LinkBoxComponent
            link={(window as any).myga.homepage}
            position='top-left'
            icon='github.svg'
            label='GitHub repository' />
          <LinkBoxComponent
            link={(window as any).myga.bugs}
            position='top-right'
            icon='report_bug.svg'
            label='Report a bug' />
          <LinkBoxComponent
            link={(window as any).myga.authorPage}
            position='bottom-left'
            icon='author.jpg'
            label='Extension author' />
          <PaypalLinkBoxComponent
            position='bottom-right'
            icon='beer.svg'
            label='Buy author a beer' />
        </div>
        <div className='links__column'>
          <LinkBoxComponent
            link={ShareLinks.Facebook + chromeStoreLink}
            position='top-left'
            icon='facebook.svg'
            label='Share to Facebook' />
          <LinkBoxComponent
            link={ShareLinks.Twitter + chromeStoreLink}
            position='top-right'
            icon='twitter.svg'
            label='Share to Twitter' />
          <LinkBoxComponent
            link={chromeStoreLink + '/reviews'}
            position='bottom-left-right'
            icon='star.svg'
            label='Love this extension? Leave a review!' />
        </div>
      </div>
    );
  }
}
