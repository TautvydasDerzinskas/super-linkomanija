import { useIntl } from 'react-intl';
import { Locales } from '../../../../enums';

import './language-picker.component.scss';

interface ILanguagePickerComponentProps {
  updateLocale: (localeCode: Locales) => void;
}

const LANGUAGES = [
  { locale: Locales.English, flag: 'flag_english', titleId: 'languagePickerEnglishFlagTitle' },
  { locale: Locales.Lithuanian, flag: 'flag_lithuanian', titleId: 'languagePickerLithuanianFlagTitle' },
];

export default function LanguagePickerComponent({ updateLocale }: ILanguagePickerComponentProps) {
  const intl = useIntl();

  // The current language's flag comes first, the others slide out to its right on hover
  const current = LANGUAGES.find(language => language.locale === intl.locale) ?? LANGUAGES[0];
  const others = LANGUAGES.filter(language => language !== current);

  const flagButton = (language: typeof LANGUAGES[number], isCurrent = false) => (
    <button
      key={language.locale}
      className={'language-picker__flag' + (isCurrent ? ' flag--current' : '')}
      onClick={() => updateLocale(language.locale)}
      title={intl.formatMessage({ id: language.titleId })}
      aria-current={isCurrent || undefined}
    >
      <svg>
        <use xlinkHref={`vectors/${language.flag}.svg#icon`}></use>
      </svg>
    </button>
  );

  return (
    <div className='language-picker'>
      {flagButton(current, true)}
      <div className='language-picker__options'>
        {others.map(language => flagButton(language))}
      </div>
    </div>
  );
}
