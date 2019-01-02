import { addLocaleData } from 'react-intl';

const enLocale = require('../../_locales/en/messages.json');
const ltLocale = require( '../../_locales/lt/messages.json');

class LanguageService {
  private browserLocaleCode = chrome.i18n.getUILanguage();
  public defaultLocale = 'lt';
  private availableLocales: { [index: string]: any; } = {
    en: enLocale,
    lt: ltLocale,
  };

  public localeMessages: any = {};

  public initialize() {
    for (const localeKey in this.availableLocales) {
      if (localeKey !== null) {
        addLocaleData({ locale: localeKey, fields: this.convertLocaleToIntl(localeKey) });
      }
    }
    this.localeMessages = this.convertLocaleToIntl(this.extensionLocale);
  }

  private convertLocaleToIntl(locale: string) {
    const transformedLocale: any = {};
    Object.keys(this.availableLocales[locale]).forEach((key) => {
      transformedLocale[key] = this.availableLocales[locale][key].message;
    });
    return transformedLocale;
  }

  get extensionLocale() {
    if (this.availableLocales[this.browserLocaleCode]) {
      return this.browserLocaleCode;
    } else {
      return this.defaultLocale;
    }
  }
}

export default new LanguageService();
