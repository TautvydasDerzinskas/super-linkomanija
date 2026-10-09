import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router';

import releaseNotifierService from '../../../services/common/release-notifier.service';
import { IWatchedRelease, IReleaseNotifierState, IMessageReleaseNotifier } from '../../../interfaces/release-notifier';

import ReleaseFormComponent from './release-form/release-form.component';
import WatchedReleaseComponent from './watched-release/watched-release.component';

import './release-notifier.component.scss';

const linkomanijaOrigins = ['*://*.linkomanija.net/*'];

function requestCheck() {
  const message: IMessageReleaseNotifier = { releaseNotifier: 'check' };
  return chrome.runtime.sendMessage(message);
}

export default function ReleaseNotifierComponent() {
  const intl = useIntl();
  const [releases, setReleases] = useState<IWatchedRelease[]>([]);
  const [notifierState, setNotifierState] = useState<IReleaseNotifierState>({ matches: {}, dismissedTorrentIds: [] });
  const [editedReleaseId, setEditedReleaseId] = useState<string>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [hasHostAccess, setHasHostAccess] = useState(true);

  useEffect(() => {
    const load = () => {
      Promise.all([releaseNotifierService.getReleases(), releaseNotifierService.getState()]).then(([storedReleases, storedState]) => {
        setReleases(storedReleases);
        setNotifierState(storedState);
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

  const saveRelease = async (release: IWatchedRelease) => {
    await releaseNotifierService.saveRelease(release);
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
        <div className='release-notifier__warning'>
          <FormattedMessage id='releaseNotifierNoAccess' />{' '}
          <button type='button' className='sl-button sl-button--link' onClick={grantHostAccess}>
            <FormattedMessage id='releaseNotifierGrantAccess' />
          </button>
        </div>
      );
    }
    if (notifierState.loggedOut) {
      return (
        <div className='release-notifier__warning'>
          <FormattedMessage id='releaseNotifierLoggedOut' />{' '}
          <a href='https://www.linkomanija.net/login.php' target='_blank'>
            <FormattedMessage id='releaseNotifierLogIn' />
          </a>
        </div>
      );
    }
    return (
      <div className='release-notifier__status'>
        {notifierState.lastCheck
          ? intl.formatMessage(
            { id: 'releaseNotifierLastCheck' },
            { time: intl.formatDate(notifierState.lastCheck, { dateStyle: 'short', timeStyle: 'short' }) },
          )
          : intl.formatMessage({ id: 'releaseNotifierNeverChecked' })}
      </div>
    );
  };

  return (
    <div className='release-notifier'>
      <div className='release-notifier__heading'>
        <Link to='/' className='release-notifier__back'>
          ← <FormattedMessage id='releaseNotifierBack' />
        </Link>
        <span className='release-notifier__title'>
          <FormattedMessage id='featureReleaseNotifierTitle' />
        </span>
        <button type='button' className='sl-button' disabled={isChecking || releases.length === 0} onClick={checkNow}>
          <FormattedMessage id={isChecking ? 'releaseNotifierChecking' : 'releaseNotifierCheckNow'} />
        </button>
      </div>

      {renderStatus()}

      <label className='release-notifier__notifications'>
        <input type='checkbox' checked={hasNotifications} onChange={toggleNotifications} />
        <FormattedMessage id='releaseNotifierSystemNotifications' />
      </label>

      <ReleaseFormComponent onSave={saveRelease} />

      <div className='release-notifier__releases'>
        {releases.length === 0 && (
          <div className='release-notifier__empty'>
            <FormattedMessage id='releaseNotifierEmpty' />
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
          <WatchedReleaseComponent
            key={release.id}
            release={release}
            matches={notifierState.matches[release.id] ?? []}
            onEdit={() => setEditedReleaseId(release.id)}
            onDelete={() => releaseNotifierService.removeRelease(release.id)}
            onReject={torrentId => releaseNotifierService.rejectMatch(release.id, torrentId)}
            onAccept={() => releaseNotifierService.acceptMatch(release.id)}
          />
        )))}
      </div>
    </div>
  );
}
