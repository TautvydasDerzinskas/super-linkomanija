import { FormattedMessage } from 'react-intl';

import { IWatchedRelease, IReleaseMatch } from '../../../../interfaces/release-notifier';

import './watched-release.component.scss';

interface IWatchedReleaseComponentProps {
  release: IWatchedRelease;
  matches: IReleaseMatch[];
  onEdit: () => void;
  onDelete: () => void;
  onReject: (entryId: number) => void;
  onAccept: () => void;
}

export default function WatchedReleaseComponent({ release, matches, onEdit, onDelete, onReject, onAccept }: IWatchedReleaseComponentProps) {
  return (
    <div className={'watched-release' + (matches.length > 0 ? ' watched-release--found' : '')}>
      <div className='watched-release__heading'>
        <span className='watched-release__term'>{release.searchTerm}</span>
        <button type='button' className='sl-button sl-button--link' onClick={onEdit}>
          <FormattedMessage id='releaseNotifierEdit' />
        </button>
        <button type='button' className='sl-button sl-button--link' onClick={onDelete}>
          <FormattedMessage id='releaseNotifierDelete' />
        </button>
      </div>

      {(release.excluded.length > 0 || release.preferred.length > 0) && (
        <div className='watched-release__keywords'>
          {release.excluded.map(keyword => (
            <span key={`excluded-${keyword}`} className='watched-release__keyword watched-release__keyword--excluded'>−{keyword}</span>
          ))}
          {release.preferred.map(keyword => (
            <span key={`preferred-${keyword}`} className='watched-release__keyword watched-release__keyword--preferred'>+{keyword}</span>
          ))}
        </div>
      )}

      {matches.length === 0 ? (
        <div className='watched-release__waiting'>
          <FormattedMessage id='releaseNotifierWaiting' />
        </div>
      ) : (
        <ul className='watched-release__matches'>
          {matches.map(match => (
            <li key={match.entryId} className='watched-release__match'>
              <a href={match.detailsLink} target='_blank' title={match.title}>{match.title}</a>
              <div className='watched-release__match-footer'>
                <span className='watched-release__match-details'>
                  {match.isPreferred && (
                    <strong><FormattedMessage id='releaseNotifierPreferredMatch' /></strong>
                  )}
                  {[match.addedDate, match.size].filter(Boolean).join(' · ')}
                </span>
                <button type='button' className='sl-button' onClick={() => onReject(match.entryId)}>
                  <FormattedMessage id='releaseNotifierReject' />
                </button>
                <button type='button' className='sl-button sl-button--primary' onClick={onAccept}>
                  <FormattedMessage id='releaseNotifierAccept' />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
