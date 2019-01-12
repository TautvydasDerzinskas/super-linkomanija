import ChromeStorageService from '../common/chrome-storage.service';
import { ChromeStorageKeys, Locales } from '../../enums';
import { ILocaleMessages, ILanguages, IChromeLocale } from '../../interfaces/locale';

const enLocale: IChromeLocale = require('../../assets/_locales/en/messages.json');
const ltLocale: IChromeLocale = require( '../../assets/_locales/lt/messages.json');
const chromeStorageService = new ChromeStorageService();

class LanguageService {
  public defaultLocaleCode = Locales.Lithuanian;
  get languages(): ILanguages {
    return {
      en: {
        messages: this.convertLocaleToMessages(enLocale),
        code: Locales.English,
      },
      lt: {
        messages: this.convertLocaleToMessages(ltLocale),
        code: Locales.Lithuanian,
      }
    };
  }

  private convertLocaleToMessages(locale: IChromeLocale) {
    const transformedLocale: ILocaleMessages = {};
    Object.keys(locale).forEach((key) => {
      transformedLocale[key] = locale[key].message;
    });
    return transformedLocale;
  }

  public getActiveLocale() {
    return new Promise((resolve) => {
      chromeStorageService.getItem(ChromeStorageKeys.Locale).then((localeStoredData: { value: string; }) => {
        if (localeStoredData && localeStoredData.value) {
          const activeLocale = this.languages[localeStoredData.value];
          if (activeLocale) {
            resolve(activeLocale);
          }
        } else {
          const browserLocaleCode = chrome.i18n.getUILanguage().split('_')[0];
          const browserLocaleObject = this.languages[browserLocaleCode];
          if (browserLocaleObject) {
            resolve(browserLocaleObject);
          } else {
            resolve(this.languages[this.defaultLocaleCode]);
          }
        }
      });
    });
  }
}

export default new LanguageService();
