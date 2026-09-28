import urlService from '../../services/common/url.service';
import autoLoginService from '../../services/common/auto-login.service';
import languageService from '../../services/popup/language.service';

import IContent from '../../interfaces/content';

import './styles/auto-login.scss';

const loginCookieName = 'login';
// Same expiry the website gives its own "remember me" cookie
const loginCookieExpiry = 'Tue, 19 Jan 2038 03:14:07 GMT';
// Remembers the restore attempt for the tab, so an expired token does not cause a redirect loop
const restoreAttemptKey = 'sl-auto-login-attempt';

class ContentAutoLogin implements IContent {
  public extendPageUserInterface() {
    // Content script runs in every frame, logging in is up to the main page
    if (window === window.top) {
      this.synchronizeLogin();
    }
  }

  public setupEventListeners() {
    // Capturing, so the token is cleared before the website's logout link navigates away
    document.addEventListener('click', this.handleLogoutClick, true);
    if (urlService.isLoginPage()) {
      document.querySelector('form[action="takelogin.php"]')?.addEventListener('submit', this.handleLoginSubmit);
    }
  }

  public cleanUp() {
    document.removeEventListener('click', this.handleLogoutClick, true);
    document.querySelector('form[action="takelogin.php"]')?.removeEventListener('submit', this.handleLoginSubmit);
    document.querySelector('.auto-login-notice')?.remove();
  }

  private async synchronizeLogin() {
    const cookieToken = this.getLoginCookie();
    const [login, device] = await Promise.all([autoLoginService.getLogin(), autoLoginService.getDevice()]);

    if (cookieToken) {
      sessionStorage.removeItem(restoreAttemptKey);

      // Browser had the token before the user logged out in another browser, the website's logout also ends the session
      if (!login.token && login.loggedOutAt && device.syncedAt && login.loggedOutAt > device.syncedAt) {
        window.location.replace('/logout.php');
      } else if (login.token !== cookieToken) {
        await autoLoginService.saveToken(cookieToken);
      } else if (!device.syncedAt) {
        await autoLoginService.markDeviceSynced();
      }
      return;
    }

    if (urlService.isLoginPage()) {
      if (login.token && autoLoginService.isValidToken(login.token)) {
        await this.restoreLogin(login.token);
      } else {
        this.checkRememberMe();
      }
    }
  }

  private async restoreLogin(token: string) {
    // Website sent the user back to the login page, so the token no longer works (e.g. the password changed)
    if (sessionStorage.getItem(restoreAttemptKey) === token) {
      sessionStorage.removeItem(restoreAttemptKey);
      await autoLoginService.clear();
      this.checkRememberMe();
      this.showExpiredNotice();
      return;
    }

    sessionStorage.setItem(restoreAttemptKey, token);
    await autoLoginService.markDeviceSynced();
    document.cookie = `${loginCookieName}=${token}; expires=${loginCookieExpiry}; path=/`;
    window.location.replace(this.getReturnPath());
  }

  private handleLogoutClick = async (event: MouseEvent) => {
    const logoutLink = (event.target as HTMLElement).closest?.('a[href*="logout.php"]') as HTMLAnchorElement;
    if (!logoutLink) {
      return;
    }

    event.preventDefault();
    await autoLoginService.logOut();
    window.location.href = logoutLink.href;
  };

  // Logging in by hand after logging out elsewhere must not count as being logged out
  private handleLoginSubmit = () => {
    autoLoginService.markDeviceSynced();
  };

  // Website only sets the login cookie when "remember me" is checked, without it there is nothing to sync
  private checkRememberMe() {
    const rememberMe = document.querySelector<HTMLInputElement>('input[name="login_cookie"]');
    if (rememberMe) {
      rememberMe.checked = true;
    }
  }

  private async showExpiredNotice() {
    const { messages } = await languageService.getActiveLocale();
    const notice = document.createElement('div');
    notice.className = 'auto-login-notice';
    notice.textContent = messages.autoLoginExpiredNotice;
    document.querySelector('form[action="takelogin.php"]')?.before(notice);
  }

  private getLoginCookie() {
    const cookie = document.cookie.split('; ').find(part => part.startsWith(`${loginCookieName}=`));
    const token = cookie?.slice(loginCookieName.length + 1);
    return token && token !== 'deleted' ? token : null;
  }

  /**
   * Only paths on this website are followed, so the returnto parameter can not redirect elsewhere
   */
  private getReturnPath() {
    const returnTo = new URLSearchParams(window.location.search).get('returnto');
    return returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/';
  }
}

export default new ContentAutoLogin();
