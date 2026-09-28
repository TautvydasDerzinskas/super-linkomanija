import { FormattedMessage } from 'react-intl';

import { ITrackedRelease, IReleaseMatch } from '../../../../interfaces/release-tracker';

import './tracked-release.component.scss';

interface ITrackedReleaseComponentProps {
  release: ITrackedRelease;
  matches: IReleaseMatch[];
  onEdit: () => void;
  onDelete: () => void;
  onReject: (torrentId: number) => void;
  onAccept: () => void;
}

export default function TrackedReleaseComponent({ release, matches, onEdit, onDelete, onReject, onAccept }: ITrackedReleaseComponentProps) {
  return (
    <div className={'tracked-release' + (matches.length > 0 ? ' tracked-release--found' : '')}>
      <div className='tracked-release__heading'>
        <span className='tracked-release__term'>{release.searchTerm}</span>
        <button type='button' className='sl-button sl-button--link' onClick={onEdit}>
          <FormattedMessage id='releaseTrackerEdit' />
        </button>
        <button type='button' className='sl-button sl-button--link' onClick={onDelete}>
          <FormattedMessage id='releaseTrackerDelete' />
        </button>
      </div>

      {(release.excluded.length > 0 || release.preferred.length > 0) && (
        <div className='tracked-release__keywords'>
          {release.excluded.map(keyword => (
            <span key={`excluded-${keyword}`} className='tracked-release__keyword tracked-release__keyword--excluded'>−{keyword}</span>
          ))}
          {release.preferred.map(keyword => (
            <span key={`preferred-${keyword}`} className='tracked-release__keyword tracked-release__keyword--preferred'>+{keyword}</span>
          ))}
        </div>
      )}

      {matches.length === 0 ? (
        <div className='tracked-release__waiting'>
          <FormattedMessage id='releaseTrackerWaiting' />
        </div>
      ) : (
        <ul className='tracked-release__matches'>
          {matches.map(match => (
            <li key={match.torrentId} className='tracked-release__match'>
              <a href={match.detailsLink} target='_blank' title={match.title}>{match.title}</a>
              <div className='tracked-release__match-footer'>
                <span className='tracked-release__match-details'>
                  {match.isPreferred && (
                    <strong><FormattedMessage id='releaseTrackerPreferredMatch' /></strong>
                  )}
                  {[match.addedDate, match.size].filter(Boolean).join(' · ')}
                </span>
                <button type='button' className='sl-button' onClick={() => onReject(match.torrentId)}>
                  <FormattedMessage id='releaseTrackerReject' />
                </button>
                <button type='button' className='sl-button sl-button--primary' onClick={onAccept}>
                  <FormattedMessage id='releaseTrackerAccept' />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
