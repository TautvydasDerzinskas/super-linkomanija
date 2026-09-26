import urlService from '../common/url.service';

class ExtensionService {
  public async updateToolbarIcon() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url == null) {
      return;
    }

    const iconSuffix = urlService.isLinkomanija(tab.url) ? '' : '_disabled';
    await chrome.action.setIcon({
      path: `icons/icon${iconSuffix}_16x16.png`,
      tabId: tab.id,
    });
  }
}

export default new ExtensionService();
