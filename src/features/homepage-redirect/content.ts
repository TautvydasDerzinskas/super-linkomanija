import IContent from '../../interfaces/content';

class ContentHomepageRedirect implements IContent {

  public setupEventListeners() {
    const activeUrl = window.location.href;
    if (activeUrl.endsWith('.net') || activeUrl.endsWith('.net/')) {
      window.location.assign('/browse.php');
    }
  }

  public cleanUp() {

  }
}

export default new ContentHomepageRedirect();
