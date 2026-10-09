import { useState, type FormEvent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import releaseNotifierService from '../../../../services/common/release-notifier.service';
import { IWatchedRelease } from '../../../../interfaces/release-notifier';
import KeywordsInputComponent from '../keywords-input/keywords-input.component';

import './release-form.component.scss';

interface IReleaseFormComponentProps {
  // Edited release, a new one is created when left out
  release?: IWatchedRelease;
  onSave: (release: IWatchedRelease) => void;
  onCancel?: () => void;
}

export default function ReleaseFormComponent({ release, onSave, onCancel }: IReleaseFormComponentProps) {
  const intl = useIntl();
  const idPrefix = `release-form-${release?.id ?? 'new'}`;
  const [searchTerm, setSearchTerm] = useState(release?.searchTerm ?? '');
  const [excluded, setExcluded] = useState(release?.excluded ?? []);
  const [preferred, setPreferred] = useState(release?.preferred ?? []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    if (!trimmedSearchTerm) {
      return;
    }

    onSave(release
      ? { ...release, searchTerm: trimmedSearchTerm, excluded, preferred }
      : releaseNotifierService.createRelease(trimmedSearchTerm, excluded, preferred));

    if (!release) {
      setSearchTerm('');
      setExcluded([]);
      setPreferred([]);
    }
  };

  return (
    <form className='release-form' onSubmit={handleSubmit}>
      <label htmlFor={`${idPrefix}-term`}>
        <FormattedMessage id='releaseNotifierSearchTerm' />
      </label>
      <input
        id={`${idPrefix}-term`}
        className='release-form__term'
        type='text'
        required
        value={searchTerm}
        placeholder={intl.formatMessage({ id: 'releaseNotifierSearchTermPlaceholder' })}
        onChange={event => setSearchTerm(event.target.value)}
      />

      <div className='release-form__keywords'>
        <div>
          <label htmlFor={`${idPrefix}-excluded`}>
            <FormattedMessage id='releaseNotifierExcluded' />
          </label>
          <KeywordsInputComponent
            id={`${idPrefix}-excluded`}
            variant='excluded'
            keywords={excluded}
            placeholder={intl.formatMessage({ id: 'releaseNotifierExcludedPlaceholder' })}
            onChange={setExcluded}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-preferred`}>
            <FormattedMessage id='releaseNotifierPreferred' />
          </label>
          <KeywordsInputComponent
            id={`${idPrefix}-preferred`}
            variant='preferred'
            keywords={preferred}
            placeholder={intl.formatMessage({ id: 'releaseNotifierPreferredPlaceholder' })}
            onChange={setPreferred}
          />
        </div>
      </div>

      <div className='release-form__footer'>
        <span className='release-form__hint'>
          <FormattedMessage id='releaseNotifierKeywordsHint' />
        </span>
        {onCancel && (
          <button type='button' className='sl-button' onClick={onCancel}>
            <FormattedMessage id='releaseNotifierCancel' />
          </button>
        )}
        <button type='submit' className='sl-button sl-button--primary'>
          <FormattedMessage id={release ? 'releaseNotifierSave' : 'releaseNotifierAdd'} />
        </button>
      </div>
    </form>
  );
}
