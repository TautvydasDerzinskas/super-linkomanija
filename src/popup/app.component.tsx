import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router';
import { IntlProvider } from 'react-intl';

import languageService from '../services/popup/language.service';
import BrowserStorageService from '../services/common/browser-storage.service';

import { ChromeStorageKeys, Locales } from '../enums';

import HeaderComponent from './layout/header/header.component';
import HistoryComponent from './tabs/history/history.component';
import FeaturesComponent from './tabs/features/features.component';
import LinksComponent from './tabs/links/links.component';
import ReleaseTrackerComponent from './tabs/release-tracker/release-tracker.component';

import './app.component.scss';

const browserStorageService = new BrowserStorageService();

export default function AppComponent() {
  const [locale, setLocale] = useState<Locales>(languageService.defaultLocaleCode);

  useEffect(() => {
    languageService.getActiveLocale().then(activeLocale => setLocale(activeLocale.code));
  }, []);

  const updateLocale = async (localeCode: Locales) => {
    if (localeCode !== locale) {
      await browserStorageService.setItem(ChromeStorageKeys.Locale, { value: localeCode });
      setLocale(localeCode);
    }
  };

  return (
    <IntlProvider
      key={locale}
      locale={locale}
      messages={languageService.languages[locale].messages}
      defaultLocale={languageService.defaultLocaleCode}
    >
      <div>
        <HeaderComponent updateLocale={updateLocale} />
        <div className='tabs-content'>
          <Routes>
            <Route path='/' element={<FeaturesComponent />} />
            <Route path='/history' element={<HistoryComponent />} />
            <Route path='/links' element={<LinksComponent />} />
            <Route path='/release-tracker' element={<ReleaseTrackerComponent />} />
          </Routes>
        </div>
      </div>
    </IntlProvider>
  );
}
