

import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { Locales } from '../../../../enums';

import './language-picker.component.scss';

interface ILanguagePickerComponentProps extends InjectedIntlProps {
  updateLocale: (localeCode: Locales) => void;
}

class LanguagePickerComponent extends React.Component<ILanguagePickerComponentProps> {
  private pickLanguage(languageCode: Locales) {
    this.props.updateLocale(languageCode);
  }

  render() {
    const { intl } = this.props;

    return (
      <div className='language-picker'>
        <button
          className='language-picker__flag'
          onClick={this.pickLanguage.bind(this, Locales.English)}
          title={intl.formatMessage({ id: 'languagePickerEnglishFlagTitle' })}
        >
          <svg>
            <use xlinkHref='vectors/flag_english.svg#icon'></use>
          </svg>
        </button>
        <button
          className='language-picker__flag'
          onClick={this.pickLanguage.bind(this, Locales.Lithuanian)}
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
