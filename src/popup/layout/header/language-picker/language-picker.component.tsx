import { useIntl } from 'react-intl';
import { Locales } from '../../../../enums';

import './language-picker.component.scss';

interface ILanguagePickerComponentProps {
  updateLocale: (localeCode: Locales) => void;
}

export default function LanguagePickerComponent({ updateLocale }: ILanguagePickerComponentProps) {
  const intl = useIntl();

  return (
    <div className='language-picker'>
      <button
        className='language-picker__flag'
        onClick={() => updateLocale(Locales.English)}
        title={intl.formatMessage({ id: 'languagePickerEnglishFlagTitle' })}
      >
        <svg>
          <use xlinkHref='vectors/flag_english.svg#icon'></use>
        </svg>
      </button>
      <button
        className='language-picker__flag'
        onClick={() => updateLocale(Locales.Lithuanian)}
        title={intl.formatMessage({ id: 'languagePickerLithuanianFlagTitle' })}
      >
        <svg>
          <use xlinkHref='vectors/flag_lithuanian.svg#icon'></use>
        </svg>
      </button>
    </div>
  );
}
