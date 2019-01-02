import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import languageService from './services/common/language.service';

import './popup.meta';

import AppComponent from './popup/app.component';

languageService.initialize();

ReactDOM.render(
  <IntlProvider
    locale={languageService.extensionLocale}
    messages={languageService.localeMessages}
    defaultLocale={languageService.defaultLocale}>
    <HashRouter>
      <AppComponent/>
    </HashRouter>
  </IntlProvider>,
  document.getElementById('application')
);
