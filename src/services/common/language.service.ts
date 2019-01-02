import { addLocaleData } from 'react-intl';

const enLocale = require('../../_locales/en/messages.json');
const ltLocale = require( '../../_locales/lt/messages.json');

class LanguageService {
  private browserLocaleCode = chrome.i18n.getUILanguage();
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

  public localeMessages: any = {};

  constructor() {
    this.availableLocales.forEach(localeObject => {
      for (let i = 0, b = localeObject.codes.length; i < b; i += 1) {
        const localeCode = localeObject.codes[i];
        addLocaleData({ locale: localeCode, fields: this.convertLocaleToIntl(localeCode) });
      }
    });

    this.localeMessages = this.convertLocaleToIntl(this.extensionLocale);
  }

  public convertLocaleToIntl(localeCode: string) {
    const transformedLocale: any = {};
    const locale = this.getLocaleByCode(localeCode);
    if (locale) {
      Object.keys(locale).forEach((key) => {
        transformedLocale[key] = locale[key].message;
      });
    }
    return transformedLocale;
  }

  private getLocaleByCode(localeCode: string) {
    return this.availableLocales.filter((locale) => locale.codes.indexOf(localeCode) >= 0)[0].locale;
  }

  get extensionLocale() {
    const localeObject = this.getLocaleByCode(this.browserLocaleCode);
    const extensionLocale = localeObject ? this.browserLocaleCode : this.defaultLocale;
    return extensionLocale;
  }
}

export default new LanguageService();
