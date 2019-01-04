

import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import * as enLocale from 'react-intl/locale-data/en';
import * as ltLocale from 'react-intl/locale-data/lt';

import languageService from '../services/common/language.service';
import ChromeStorageService from '../services/common/chrome-storage.service';

import { ChromeStorageKeys, Locales } from '../enums';
import { ILocale, ILocaleMessages } from '../interfaces/locale';

import HeaderComponent from './layout/header/header.component';
import HistoryComponent from './tabs/history/history.component';
import FeaturesComponent from './tabs/features/features.component';
import LinksComponent from './tabs/links/links.component';

import './app.component.scss';

const chromeStorageService = new ChromeStorageService();

interface IAppComponentState {
  locale: Locales;
  messages: ILocaleMessages;
  defaultLocale: Locales;
}

export default class AppComponent extends React.Component<{}, IAppComponentState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      locale: languageService.defaultLocaleCode,
      messages: languageService.languages[languageService.defaultLocaleCode].messages,
      defaultLocale: languageService.defaultLocaleCode,
    };
    this.initializeLocales();
  }

  private initializeLocales() {
    addLocaleData(enLocale);
    addLocaleData(ltLocale);
  }

  componentDidMount() {
    languageService.getActiveLocale().then((locale: ILocale) => {
      this.setState({
        locale: locale.code,
        messages: locale.messages,
      });
    });
  }

  public updateLocale(localeCode: Locales) {
    if (localeCode !== this.state.locale) {
      chromeStorageService.setItem(ChromeStorageKeys.Locale, { value: localeCode }).then(() => {
        this.setState({
          locale: localeCode,
          messages: languageService.languages[localeCode].messages,
        });
      });
    }
  }

  render() {
    return (
      <IntlProvider
        key={this.state.locale}
        locale={this.state.locale}
        messages={this.state.messages}
        defaultLocale={this.state.defaultLocale}
      >
        <div>
          <HeaderComponent updateLocale={this.updateLocale.bind(this)} />
          <div className='tabs-content'>
            <Switch>
              <Route exact path='/' component={FeaturesComponent} />
              <Route exact path='/history' component={HistoryComponent} />
              <Route exact path='/links' component={LinksComponent} />
            </Switch>
          </div>
        </div>
      </IntlProvider>
    );
  }
}
