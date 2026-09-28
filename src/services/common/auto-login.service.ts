import BrowserStorageService from './browser-storage.service';

import { ChromeStorageKeys } from '../../enums';

// The login token syncs between browsers of the same account, while each browser keeps when it last had it
const loginStorage = new BrowserStorageService();
const deviceStorage = new BrowserStorageService('local');

export interface IAutoLogin {
  token?: string;
  savedAt?: number;
  // Set when the user logs out, so other browsers log out too
  loggedOutAt?: number;
}

export interface IAutoLoginDevice {
  // Last time this browser saved, restored or logged in with the token
  syncedAt?: number;
}

class AutoLoginService {
  public async getLogin(): Promise<IAutoLogin> {
    return await loginStorage.getItem<IAutoLogin>(ChromeStorageKeys.AutoLogin) ?? {};
  }

  public async getDevice(): Promise<IAutoLoginDevice> {
    return await deviceStorage.getItem<IAutoLoginDevice>(ChromeStorageKeys.AutoLoginDevice) ?? {};
  }

  public async saveToken(token: string) {
    const now = Date.now();
    await loginStorage.setItem<IAutoLogin>(ChromeStorageKeys.AutoLogin, { token, savedAt: now });
    await this.markDeviceSynced(now);
  }

  public markDeviceSynced(time = Date.now()) {
    return deviceStorage.setItem<IAutoLoginDevice>(ChromeStorageKeys.AutoLoginDevice, { syncedAt: time });
  }

  public logOut() {
    return loginStorage.setItem<IAutoLogin>(ChromeStorageKeys.AutoLogin, { loggedOutAt: Date.now() });
  }

  public clear() {
    return loginStorage.setItem<IAutoLogin>(ChromeStorageKeys.AutoLogin, {});
  }

  /**
   * Token is written straight into a cookie, so anything else than the website's base64 format is refused
   */
  public isValidToken(token: string) {
    return /^[A-Za-z0-9+/=%]{1,500}$/.test(token);
  }
}

export default new AutoLoginService();
