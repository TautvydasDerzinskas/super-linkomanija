import urlService from '../../services/common/url.service';
import apiService from '../../services/common/api.service';
import svgIconsService from '../../services/content/svg-icons.service';

import IContent from '../../interfaces/content';

import './styles/related-releases.scss';

// How similar a found release's name has to be to the current one, from 0 to 1
const minNameSimilarity = 0.7;
// Release details start at the year, season or episode, or resolution, e.g. "2023", "S01E02", "1080p"
const releaseDetailsWord = /^((19|20)\d{2}|s\d{1,2}(e\d{1,3})?|\d{3,4}p)$/;

class ContentRelatedReleases implements IContent {
  public extendPageUserInterface() {
    if (urlService.isReleaseDetailsPage()) {
      this.insertRelatedReleasesContainer();
      const releaseTitle = document.querySelector('#content h1').textContent;
      apiService.getRelatedReleases(releaseTitle).then((releasesTable) => {
        this.insertRelatedReleases(releaseTitle, releasesTable);
      });
    }
  }

  private insertRelatedReleasesContainer() {
    const target = document.querySelector('#content table');
    const relatedReleases = document.createElement('div');
    relatedReleases.setAttribute('class', 'related-releases');
    relatedReleases.innerHTML = `
      <h1>Susiję leidimai</h1>
      <div class="related-releases__releases sl-loading">${svgIconsService.iconLoading}</div>
    `;
    target.after(relatedReleases);
  }

  private insertRelatedReleases(releaseTitle: string, releasesTable: HTMLTableElement) {
    const target = document.getElementsByClassName('related-releases__releases')[0];
    target.classList.remove('sl-loading');

    const matchingRows = releasesTable ? this.filterMatchingRows(releaseTitle, releasesTable) : 0;
    if (matchingRows === 0) {
      target.innerHTML = '<p class="related-releases__empty">Susijusių leidimų nerasta</p>';
      return;
    }
    target.innerHTML = releasesTable.outerHTML;
  }

  /**
   * Removes the current release and the ones with a different title, returns how many are left
   */
  private filterMatchingRows(releaseTitle: string, releasesTable: HTMLTableElement) {
    const currentReleaseId = /details\?(\d+)/.exec(window.location.href)?.[1];
    let matchingRows = 0;

    for (const row of Array.from(releasesTable.rows)) {
      const link = row.querySelector<HTMLAnchorElement>('a[href^="details?"]');
      // Heading row
      if (!link) {
        continue;
      }

      const releaseId = /details\?(\d+)/.exec(link.getAttribute('href'))?.[1];
      if (releaseId === currentReleaseId || this.getNameSimilarity(releaseTitle, link.textContent) < minNameSimilarity) {
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
   * Lowercase words without diacritics before the release details, so "Nature.Documentary.2023.1080p" becomes ["nature", "documentary"]
   */
  private getNameWords(title: string) {
    const words = title
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean);
    // The first word is always part of the name, so a name like "1984" keeps it
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
    if (urlService.isReleaseDetailsPage()) {
      const relatedReleases = document.getElementsByClassName('related-releases')[0];
      if (relatedReleases) {
        relatedReleases.remove();
      }
    }
  }
}

export default new ContentRelatedReleases();
