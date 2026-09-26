import BrowserStorageService from '../common/browser-storage.service';
import { ChromeStorageKeys, Locales } from '../../enums';
import { ILocale, ILocaleMessages, ILanguages, IChromeLocale } from '../../interfaces/locale';

import enMessages from '../../assets/_locales/en/messages.json';
import ltMessages from '../../assets/_locales/lt/messages.json';

const enLocale: IChromeLocale = enMessages;
const ltLocale: IChromeLocale = ltMessages;
const browserStorageService = new BrowserStorageService();

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

  public async getActiveLocale(): Promise<ILocale> {
    const localeStoredData = await browserStorageService.getItem<{ value: string; }>(ChromeStorageKeys.Locale);
    const storedLocale = this.languages[localeStoredData?.value];
    if (storedLocale) {
      return storedLocale;
    }

    const browserLocaleCode = chrome.i18n.getUILanguage().split(/[-_]/)[0];
    return this.languages[browserLocaleCode] ?? this.languages[this.defaultLocaleCode];
  }
}

export default new LanguageService();
