import urlService from '../../services/common/url.service';
import apiService from '../../services/common/api.service';
import svgIconsService from '../../services/content/svg-icons.service';

import IContent from '../../interfaces/content';

import './styles/related-torrents.scss';

// How similar a found torrent's name has to be to the current one, from 0 to 1
const minNameSimilarity = 0.7;
// Release details start at the year, season or episode, or resolution, e.g. "2023", "S01E02", "1080p"
const releaseDetailsWord = /^((19|20)\d{2}|s\d{1,2}(e\d{1,3})?|\d{3,4}p)$/;

class ContentRelatedTorrents implements IContent {
  public extendPageUserInterface() {
    if (urlService.isTorrentDetailsPage()) {
      this.insertRelatedTorrentsContainer();
      const torrentTitle = document.querySelector('#content h1').textContent;
      apiService.getRelatedTorrents(torrentTitle).then((torrentsTable) => {
        this.insertRelatedTorrents(torrentTitle, torrentsTable);
      });
    }
  }

  private insertRelatedTorrentsContainer() {
    const target = document.querySelector('#content table');
    const relatedTorrents = document.createElement('div');
    relatedTorrents.setAttribute('class', 'related-torrents');
    relatedTorrents.innerHTML = `
      <h1>Susiję torrentai</h1>
      <div class="related-torrents__torrents sl-loading">${svgIconsService.iconLoading}</div>
    `;
    target.after(relatedTorrents);
  }

  private insertRelatedTorrents(torrentTitle: string, torrentsTable: HTMLTableElement) {
    const target = document.getElementsByClassName('related-torrents__torrents')[0];
    target.classList.remove('sl-loading');

    const matchingRows = torrentsTable ? this.filterMatchingRows(torrentTitle, torrentsTable) : 0;
    if (matchingRows === 0) {
      target.innerHTML = '<p class="related-torrents__empty">Susijusių torrentų nerasta</p>';
      return;
    }
    target.innerHTML = torrentsTable.outerHTML;
  }

  /**
   * Removes the current torrent and the ones with a different title, returns how many are left
   */
  private filterMatchingRows(torrentTitle: string, torrentsTable: HTMLTableElement) {
    const currentTorrentId = /details\?(\d+)/.exec(window.location.href)?.[1];
    let matchingRows = 0;

    for (const row of Array.from(torrentsTable.rows)) {
      const link = row.querySelector<HTMLAnchorElement>('a[href^="details?"]');
      // Heading row
      if (!link) {
        continue;
      }

      const torrentId = /details\?(\d+)/.exec(link.getAttribute('href'))?.[1];
      if (torrentId === currentTorrentId || this.getNameSimilarity(torrentTitle, link.textContent) < minNameSimilarity) {
        row.remove();
      } else {
        matchingRows++;
      }
    }
    return matchingRows;
  }

  /**
   * Sørensen–Dice coefficient of the names' letter pairs, so release details like quality or group do not count
   */
  private getNameSimilarity(firstTitle: string, secondTitle: string) {
    const firstPairs = this.getLetterPairs(this.getNameWords(firstTitle));
    const secondPairs = this.getLetterPairs(this.getNameWords(secondTitle));
    if (firstPairs.length === 0 || secondPairs.length === 0) {
      return 0;
    }

    const remainingPairs = new Map<string, number>();
    for (const pair of firstPairs) {
      remainingPairs.set(pair, (remainingPairs.get(pair) ?? 0) + 1);
    }

    let sharedPairs = 0;
    for (const pair of secondPairs) {
      const count = remainingPairs.get(pair) ?? 0;
      if (count > 0) {
        remainingPairs.set(pair, count - 1);
        sharedPairs++;
      }
    }
    return (2 * sharedPairs) / (firstPairs.length + secondPairs.length);
  }

  /**
   * Lowercase words without diacritics before the release details, so "Oppenheimer.2023.1080p" becomes ["oppenheimer"]
   */
  private getNameWords(title: string) {
    const words = title
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean);
    // The first word is always part of the name, so a movie like "1917" keeps it
    const detailsStart = words.findIndex((word, index) => index > 0 && releaseDetailsWord.test(word));
    return detailsStart < 0 ? words : words.slice(0, detailsStart);
  }

  /**
   * ["web", "rip"] becomes ["we", "eb", "ri", "ip"], pairs never span two words
   */
  private getLetterPairs(words: string[]) {
    return words.flatMap(word => Array.from({ length: word.length - 1 }, (_, index) => word.slice(index, index + 2)));
  }

  public cleanUp() {
    if (urlService.isTorrentDetailsPage()) {
      const relatedTorrents = document.getElementsByClassName('related-torrents')[0];
      if (relatedTorrents) {
        relatedTorrents.remove();
      }
    }
  }
}

export default new ContentRelatedTorrents();
