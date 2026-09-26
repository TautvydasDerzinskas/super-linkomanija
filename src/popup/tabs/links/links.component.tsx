

import { useIntl } from 'react-intl';

import LinkBoxComponent from './link-box/link-box.component';
import PaypalLinkBoxComponent from './paypal-link-box/paypal-link-box.component';

import browserService from '../../../services/common/browser.service';

import { ShareLinks } from '../../../enums';

import './links.component.scss';

export default function LinksComponent() {
  const intl = useIntl();
  const browserStoreLink = browserService.browserExtensionWebStoreLink;

  return (
    <div className='links'>
      <div className='links__column'>
        <LinkBoxComponent
          link={(window as any).sl.homepage}
          position='top-left'
          icon='github.svg'
          label={intl.formatMessage({ id: 'tabsLinksGithubRepositoryLabel' })} />
        <LinkBoxComponent
          link={(window as any).sl.bugs}
          position='top-right'
          icon='report_bug.svg'
          label={intl.formatMessage({ id: 'tabsLinksReportBugLabel' })} />
        <LinkBoxComponent
          link={(window as any).sl.authorPage}
          position='bottom-left'
          icon='author.webp'
          label={intl.formatMessage({ id: 'tabsLinksExtensionAuthorLabel' })} />
        <PaypalLinkBoxComponent
          position='bottom-right'
          icon='beer.svg'
          label={intl.formatMessage({ id: 'tabsLinksBuyAuthorBeerLabel' })} />
      </div>
      <div className='links__column'>
        <LinkBoxComponent
          link={ShareLinks.Facebook + browserStoreLink}
          position='top-left'
          icon='facebook.svg'
          label={intl.formatMessage({ id: 'tabsLinksShareFacebookLabel' })} />
        <LinkBoxComponent
          link={ShareLinks.Twitter + browserStoreLink}
          position='top-right'
          icon='twitter.svg'
          label={intl.formatMessage({ id: 'tabsLinksShareTwitterLabel' })} />
        <LinkBoxComponent
          link={browserService.browserExtensionReviewLink}
          position='bottom-left-right'
          icon='star.svg'
          label={intl.formatMessage({ id: 'tabsLinksLeaveReviewLabel' })} />
      </div>
    </div>
  );
}
