

import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import './language-picker.component.scss';

interface ILanguagePickerComponentProps extends InjectedIntlProps {
  updateLocale: (localeCode: string) => void;
}

class LanguagePickerComponent extends React.Component<ILanguagePickerComponentProps> {
  private pickLanguage(languageCode: string) {
    this.props.updateLocale(languageCode);
  }

  render() {
    const { intl } = this.props;

    return (
      <div className='language-picker'>
        <button
          className='language-picker__flag'
          onClick={this.pickLanguage.bind(this, 'en')}
          title={intl.formatMessage({ id: 'languagePickerEnglishFlagTitle' })}
        >
          <svg>
            <use xlinkHref='vectors/flag_english.svg#icon'></use>
          </svg>
        </button>
        <button
          className='language-picker__flag'
          onClick={this.pickLanguage.bind(this, 'lt')}
          title={intl.formatMessage({ id: 'languagePickerLithuanianFlagTitle' })}
        >
          <svg>
            <use xlinkHref='vectors/flag_lithuanian.svg#icon'></use>
          </svg>
        </button>
      </div>
    );
  }
}

export default injectIntl(LanguagePickerComponent);
