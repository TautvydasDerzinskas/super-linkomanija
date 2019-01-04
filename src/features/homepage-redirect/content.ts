import urlService from '../../services/common/url.service';
import IContent from '../../interfaces/content';

class ContentHomepageRedirect implements IContent {
  public setupEventListeners() {
    if (urlService.isHomepage()) {
      window.location.assign('/browse.php');
    }
  }
}

export default new ContentHomepageRedirect();
