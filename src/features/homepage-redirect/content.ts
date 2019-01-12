import urlService from '../../services/common/url.service';
import IContent from '../../interfaces/content';

class ContentHomepageRedirect implements IContent {
  public extendPageUserInterface() {
    document.getElementById('logo').setAttribute('href', '/index.php?news');
    document.querySelector('.tabs li a').setAttribute('href', '/index.php?news');
  }

  public setupEventListeners() {
    if (urlService.isHomepage()) {
      window.location.assign('/browse.php');
    }
  }
}

export default new ContentHomepageRedirect();
