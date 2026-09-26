

import { useIntl } from 'react-intl';

import LinkBoxComponent from './link-box/link-box.component';
import PaypalLinkBoxComponent from './paypal-link-box/paypal-link-box.component';

import browserService from '../../../services/common/browser.service';

import { ShareLinks } from '../../../enums';

import './links.component.scss';

export default function LinksComponent() {
  const intl = useIntl();
  const { homepage, repository, bugs, authorPage } = (window as any).sl;
  // Sharing the website instead of one store, so it works for friends on any browser
  const shareLink = encodeURIComponent(homepage);

  return (
    <div className='links'>
      <div className='links__column'>
        <LinkBoxComponent
          link={repository}
          position='top-left'
          icon='github.svg'
          label={intl.formatMessage({ id: 'tabsLinksGithubRepositoryLabel' })} />
        <LinkBoxComponent
          link={bugs}
          position='top-right'
          icon='report_bug.svg'
          label={intl.formatMessage({ id: 'tabsLinksReportBugLabel' })} />
        <LinkBoxComponent
          link={authorPage}
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
          link={ShareLinks.Facebook + shareLink}
          position='top-left'
          icon='facebook.svg'
          label={intl.formatMessage({ id: 'tabsLinksShareFacebookLabel' })} />
        <LinkBoxComponent
          link={ShareLinks.Twitter + shareLink}
          position='top-right'
          icon='twitter.svg'
          label={intl.formatMessage({ id: 'tabsLinksShareTwitterLabel' })} />
        <LinkBoxComponent
          link={homepage}
          position='bottom-left'
          icon='website.svg'
          label={intl.formatMessage({ id: 'tabsLinksWebsiteLabel' })} />
        <LinkBoxComponent
          link={browserService.browserExtensionReviewLink}
          position='bottom-right'
          icon='star.svg'
          label={intl.formatMessage({ id: 'tabsLinksLeaveReviewLabel' })} />
      </div>
    </div>
  );
}
