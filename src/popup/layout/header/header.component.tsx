

import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import NavigationComponent from './navigation/navigation.component';
import LanguagePickerComponent from './language-picker/language-picker.component';

import './header.component.scss';

interface IHeaderComponentProps extends InjectedIntlProps {
  updateLocale: (localeCode: string) => void;
}

class HeaderComponent extends React.Component<IHeaderComponentProps> {
  private closePopup() {
    window.close();
  }

  render() {
    const { intl } = this.props;

    return (
      <div className='layout__header'>
        <div className='header__logo'>
          <img src='images/header.jpg' />
          <NavigationComponent />
        </div>
        <div
          className='header__close-button'
          title={intl.formatMessage({ id: 'popupCloseTitle' })}
          onClick={this.closePopup}
        >
          <svg viewBox='0 0 24 24' preserveAspectRatio='xMidYMid meet' focusable='false'>
            <g>
              <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
            </g>
          </svg>
        </div>
        <LanguagePickerComponent updateLocale={this.props.updateLocale}></LanguagePickerComponent>
      </div>
    );
  }
}

export default injectIntl(HeaderComponent);
