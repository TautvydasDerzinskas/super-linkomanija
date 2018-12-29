class UrlService {
  public getQueryParameterByName(name: string, url?: string) {
    if (!url) {
      url = window.location.href;
    }
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

  public isLinkomanija(url: string) {
    return url.toLowerCase().includes('linkomanija.net');
  }
}

export default new UrlService();
