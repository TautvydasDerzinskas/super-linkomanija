class UrlService {
  public getQueryParameterByName(name: string, url = window.location.href.toLowerCase()) {
    name = name.replace(/[\[\]]/g, '\\$&');

    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);

    if (!results) {
      return null;
    } else if (!results[2]) {
      return '';
    } else {
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
  }

  public isLinkomanija(url = window.location.href.toLowerCase()) {
    return url.toLowerCase().includes('linkomanija.net');
  }

  public isHomepage(url = window.location.href.toLowerCase()) {
    return url.endsWith('.net') || url.endsWith('.net/') || url.endsWith('/index.php');
  }

  public isTorrentsListPage(url = window.location.href.toLowerCase()) {
    return url.includes('/browse.php');
  }

  public isTorrentDetailsPage(url = window.location.href.toLowerCase()) {
    return url.includes('/details?');
  }
}

export default new UrlService();
