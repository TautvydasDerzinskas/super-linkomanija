import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router';

import releaseTrackerService from '../../../services/common/release-tracker.service';
import { ITrackedRelease, IReleaseTrackerState, IMessageReleaseTracker } from '../../../interfaces/release-tracker';

import ReleaseFormComponent from './release-form/release-form.component';
import TrackedReleaseComponent from './tracked-release/tracked-release.component';

import './release-tracker.component.scss';

const linkomanijaOrigins = ['*://*.linkomanija.net/*'];

function requestCheck() {
  const message: IMessageReleaseTracker = { releaseTracker: 'check' };
  return chrome.runtime.sendMessage(message);
}

export default function ReleaseTrackerComponent() {
  const intl = useIntl();
  const [releases, setReleases] = useState<ITrackedRelease[]>([]);
  const [trackerState, setTrackerState] = useState<IReleaseTrackerState>({ matches: {}, dismissedTorrentIds: [] });
  const [editedReleaseId, setEditedReleaseId] = useState<string>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [hasHostAccess, setHasHostAccess] = useState(true);

  useEffect(() => {
    const load = () => {
      Promise.all([releaseTrackerService.getReleases(), releaseTrackerService.getState()]).then(([storedReleases, storedState]) => {
        setReleases(storedReleases);
        setTrackerState(storedState);
      });
    };

    load();
    chrome.permissions.contains({ permissions: ['notifications'] }).then(setHasNotifications);
    chrome.permissions.contains({ origins: linkomanijaOrigins }).then(setHasHostAccess);

    // Background checks and decisions made on the website update the view while it's open
    chrome.storage.onChanged.addListener(load);
    return () => chrome.storage.onChanged.removeListener(load);
  }, []);

  const checkNow = async () => {
    setIsChecking(true);
    try {
      await requestCheck();
    } finally {
      setIsChecking(false);
    }
  };

  const saveRelease = async (release: ITrackedRelease) => {
    await releaseTrackerService.saveRelease(release);
    setEditedReleaseId(null);
    checkNow();
  };

  // Permission requests must be made straight from the click, without awaiting anything before them
  const toggleNotifications = () => {
    const request = hasNotifications
      ? chrome.permissions.remove({ permissions: ['notifications'] }).then(removed => !removed)
      : chrome.permissions.request({ permissions: ['notifications'] });
    request.then(setHasNotifications);
  };

  const grantHostAccess = () => {
    chrome.permissions.request({ origins: linkomanijaOrigins }).then((granted) => {
      setHasHostAccess(granted);
      if (granted) {
        checkNow();
      }
    });
  };

  const renderStatus = () => {
    if (!hasHostAccess) {
      return (
        <div className='release-tracker__warning'>
          <FormattedMessage id='releaseTrackerNoAccess' />{' '}
          <button type='button' className='sl-button sl-button--link' onClick={grantHostAccess}>
            <FormattedMessage id='releaseTrackerGrantAccess' />
          </button>
        </div>
      );
    }
    if (trackerState.loggedOut) {
      return (
        <div className='release-tracker__warning'>
          <FormattedMessage id='releaseTrackerLoggedOut' />{' '}
          <a href='https://www.linkomanija.net/login.php' target='_blank'>
            <FormattedMessage id='releaseTrackerLogIn' />
          </a>
        </div>
      );
    }
    return (
      <div className='release-tracker__status'>
        {trackerState.lastCheck
          ? intl.formatMessage(
            { id: 'releaseTrackerLastCheck' },
            { time: intl.formatDate(trackerState.lastCheck, { dateStyle: 'short', timeStyle: 'short' }) },
          )
          : intl.formatMessage({ id: 'releaseTrackerNeverChecked' })}
      </div>
    );
  };

  return (
    <div className='release-tracker'>
      <div className='release-tracker__heading'>
        <Link to='/' className='release-tracker__back'>
          ← <FormattedMessage id='releaseTrackerBack' />
        </Link>
        <span className='release-tracker__title'>
          <FormattedMessage id='featureReleaseTrackerTitle' />
        </span>
        <button type='button' className='sl-button' disabled={isChecking || releases.length === 0} onClick={checkNow}>
          <FormattedMessage id={isChecking ? 'releaseTrackerChecking' : 'releaseTrackerCheckNow'} />
        </button>
      </div>

      {renderStatus()}

      <label className='release-tracker__notifications'>
        <input type='checkbox' checked={hasNotifications} onChange={toggleNotifications} />
        <FormattedMessage id='releaseTrackerSystemNotifications' />
      </label>

      <ReleaseFormComponent onSave={saveRelease} />

      <div className='release-tracker__releases'>
        {releases.length === 0 && (
          <div className='release-tracker__empty'>
            <FormattedMessage id='releaseTrackerEmpty' />
          </div>
        )}
        {releases.map(release => (release.id === editedReleaseId ? (
          <ReleaseFormComponent
            key={release.id}
            release={release}
            onSave={saveRelease}
            onCancel={() => setEditedReleaseId(null)}
          />
        ) : (
          <TrackedReleaseComponent
            key={release.id}
            release={release}
            matches={trackerState.matches[release.id] ?? []}
            onEdit={() => setEditedReleaseId(release.id)}
            onDelete={() => releaseTrackerService.removeRelease(release.id)}
            onReject={torrentId => releaseTrackerService.rejectMatch(release.id, torrentId)}
            onAccept={() => releaseTrackerService.acceptMatch(release.id)}
          />
        )))}
      </div>
    </div>
  );
}
