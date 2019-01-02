import { addLocaleData } from 'react-intl';
import ChromeStorageService from './chrome-storage.service';

import { ChromeStorageKeys } from '../../enums';

const chromeStorageService = new ChromeStorageService();

const enLocale = require('../../_locales/en/messages.json');
const ltLocale = require( '../../_locales/lt/messages.json');

class LanguageService {
  public defaultLocale = 'lt';
  private availableLocales = [
    {
      codes: ['en-GB', 'en', 'en-US'],
      locale: enLocale,
    },
    {
      codes: ['lt', 'lt-LT'],
      locale: ltLocale,
    },
  ];

  constructor() {
    this.availableLocales.forEach(localeObject => {
      for (let i = 0, b = localeObject.codes.length; i < b; i += 1) {
        const localeCode = localeObject.codes[i];
        addLocaleData({ locale: localeCode, fields: this.getMessagesForLocale(localeCode) });
      }
    });
  }

  public getMessagesForLocale(localeCode: string) {
    const transformedLocale: any = {};
    const locale = this.getLocaleByCode(localeCode);
    if (locale) {
      Object.keys(locale).forEach((key) => {
        transformedLocale[key] = locale[key].message;
      });
    }
    return transformedLocale;
  }

  public getActiveLocale() {
    return new Promise((resolve) => {
      chromeStorageService.getItem(ChromeStorageKeys.Locale).then((localeData: { value: string; }) => {
        if (localeData && localeData.value) {
          resolve(localeData.value);
        } else {
          const browserLocaleCode = chrome.i18n.getUILanguage();
          const localeObject = this.getLocaleByCode(browserLocaleCode);
          const extensionLocale = localeObject ? browserLocaleCode : this.defaultLocale;
          resolve(extensionLocale);
        }
      });
    });
  }

  private getLocaleByCode(localeCode: string) {
    return this.availableLocales.filter((locale) => locale.codes.indexOf(localeCode) >= 0)[0].locale;
  }
}

export default new LanguageService();
