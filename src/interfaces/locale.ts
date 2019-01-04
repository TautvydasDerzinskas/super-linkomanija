import { Locales } from '../enums';

export interface ILocaleMessages {
  [index: string]: string;
}

export interface ILocale {
  messages: ILocaleMessages;
  code: Locales;
}

export interface ILanguages {
  [index: string]: ILocale;
}

export interface IChromeLocale {
  [index: string]: {
    message: string;
    description: string;
  };
}
