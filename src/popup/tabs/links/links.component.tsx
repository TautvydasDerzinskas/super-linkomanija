

import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import LinkBoxComponent from './link-box/link-box.component';
import PaypalLinkBoxComponent from './paypal-link-box/paypal-link-box.component';

import { ShareLinks } from '../../../enums';

import './links.component.scss';

class LinksComponent extends React.Component<InjectedIntlProps> {

  render() {
    const { intl } = this.props;
    const chromeStoreLink = `https://chrome.google.com/webstore/detail/${chrome.runtime.id}`;

    return (
      <div className='links'>
        <div className='links__column'>
          <LinkBoxComponent
            link={(window as any).myga.homepage}
            position='top-left'
            icon='github.svg'
            label={intl.formatMessage({ id: 'tabsLinksGithubRepositoryLabel' })} />
          <LinkBoxComponent
            link={(window as any).myga.bugs}
            position='top-right'
            icon='report_bug.svg'
            label={intl.formatMessage({ id: 'tabsLinksReportBugLabel' })} />
          <LinkBoxComponent
            link={(window as any).myga.authorPage}
            position='bottom-left'
            icon='author.jpg'
            label={intl.formatMessage({ id: 'tabsLinksExtensionAuthorLabel' })} />
          <PaypalLinkBoxComponent
            position='bottom-right'
            icon='beer.svg'
            label={intl.formatMessage({ id: 'tabsLinksBuyAuthorBeerLabel' })} />
        </div>
        <div className='links__column'>
          <LinkBoxComponent
            link={ShareLinks.Facebook + chromeStoreLink}
            position='top-left'
            icon='facebook.svg'
            label={intl.formatMessage({ id: 'tabsLinksShareFacebookLabel' })} />
          <LinkBoxComponent
            link={ShareLinks.Twitter + chromeStoreLink}
            position='top-right'
            icon='twitter.svg'
            label={intl.formatMessage({ id: 'tabsLinksShareTwitterLabel' })} />
          <LinkBoxComponent
            link={chromeStoreLink + '/reviews'}
            position='bottom-left-right'
            icon='star.svg'
            label={intl.formatMessage({ id: 'tabsLinksLeaveReviewLabel' })} />
        </div>
      </div>
    );
  }
}

export default injectIntl(LinksComponent);
