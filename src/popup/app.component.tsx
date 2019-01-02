

import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import languageService from '../services/common/language.service';
import ChromeStorageService from '../services/common/chrome-storage.service';

import { ChromeStorageKeys } from '../enums';

// Layout components
import HeaderComponent from './layout/header/header.component';

// Tab components
import HistoryComponent from './tabs/history/history.component';
import FeaturesComponent from './tabs/features/features.component';
import LinksComponent from './tabs/links/links.component';

import './app.component.scss';

const chromeStorageService = new ChromeStorageService();

interface IAppComponentState {
  locale: string;
  messages: { [index: string]: string; };
  defaultLocale: string;
}

export default class AppComponent extends React.Component<{}, IAppComponentState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      locale: languageService.defaultLocale,
      messages: languageService.getMessagesForLocale(languageService.defaultLocale),
      defaultLocale: languageService.defaultLocale
    };
  }

  componentDidMount() {
    languageService.getActiveLocale().then((activeLocale: string) => {
      this.setState({
        locale: activeLocale,
        messages: languageService.getMessagesForLocale(activeLocale),
      });
    });
  }

  public updateLocale(localeCode: string) {
    if (localeCode !== this.state.locale) {
      chromeStorageService.setItem(ChromeStorageKeys.Locale, { value: localeCode }).then(() => {
        this.setState({
          locale: localeCode,
          messages: languageService.getMessagesForLocale(localeCode),
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
