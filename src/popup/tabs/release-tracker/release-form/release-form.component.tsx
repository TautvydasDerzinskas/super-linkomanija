import { useState, type FormEvent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import releaseTrackerService from '../../../../services/common/release-tracker.service';
import { ITrackedRelease } from '../../../../interfaces/release-tracker';
import KeywordsInputComponent from '../keywords-input/keywords-input.component';

import './release-form.component.scss';

interface IReleaseFormComponentProps {
  // Edited release, a new one is created when left out
  release?: ITrackedRelease;
  onSave: (release: ITrackedRelease) => void;
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
      : releaseTrackerService.createRelease(trimmedSearchTerm, excluded, preferred));

    if (!release) {
      setSearchTerm('');
      setExcluded([]);
      setPreferred([]);
    }
  };

  return (
    <form className='release-form' onSubmit={handleSubmit}>
      <label htmlFor={`${idPrefix}-term`}>
        <FormattedMessage id='releaseTrackerSearchTerm' />
      </label>
      <input
        id={`${idPrefix}-term`}
        className='release-form__term'
        type='text'
        required
        value={searchTerm}
        placeholder={intl.formatMessage({ id: 'releaseTrackerSearchTermPlaceholder' })}
        onChange={event => setSearchTerm(event.target.value)}
      />

      <div className='release-form__keywords'>
        <div>
          <label htmlFor={`${idPrefix}-excluded`}>
            <FormattedMessage id='releaseTrackerExcluded' />
          </label>
          <KeywordsInputComponent
            id={`${idPrefix}-excluded`}
            variant='excluded'
            keywords={excluded}
            placeholder={intl.formatMessage({ id: 'releaseTrackerExcludedPlaceholder' })}
            onChange={setExcluded}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-preferred`}>
            <FormattedMessage id='releaseTrackerPreferred' />
          </label>
          <KeywordsInputComponent
            id={`${idPrefix}-preferred`}
            variant='preferred'
            keywords={preferred}
            placeholder={intl.formatMessage({ id: 'releaseTrackerPreferredPlaceholder' })}
            onChange={setPreferred}
          />
        </div>
      </div>

      <div className='release-form__footer'>
        <span className='release-form__hint'>
          <FormattedMessage id='releaseTrackerKeywordsHint' />
        </span>
        {onCancel && (
          <button type='button' className='sl-button' onClick={onCancel}>
            <FormattedMessage id='releaseTrackerCancel' />
          </button>
        )}
        <button type='submit' className='sl-button sl-button--primary'>
          <FormattedMessage id={release ? 'releaseTrackerSave' : 'releaseTrackerAdd'} />
        </button>
      </div>
    </form>
  );
}
