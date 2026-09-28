import BrowserStorageService from './browser-storage.service';

import { ChromeStorageKeys } from '../../enums';
import { ITrackedRelease, IReleaseMatch, IReleaseTrackerState } from '../../interfaces/release-tracker';

// Releases sync between browsers, while found matches are per browser, as each one checks on its own
const releasesStorage = new BrowserStorageService();
const stateStorage = new BrowserStorageService('local');

const linkomanijaUrl = 'https://www.linkomanija.net/';
const maxRejectedTorrentIds = 100;
// Only the most relevant results are considered, so a broad search term does not match old torrents
const maxCheckedResults = 5;
const delayBetweenSearches = 1000;

export interface ISearchResult {
  torrentId: number;
  title: string;
  detailsLink: string;
  addedDate: string;
  size: string;
}

export interface IFoundRelease {
  release: ITrackedRelease;
  match: IReleaseMatch;
}

class ReleaseTrackerService {
  private runningCheck: Promise<IFoundRelease[]> = null;

  public async getReleases(): Promise<ITrackedRelease[]> {
    return await releasesStorage.getItem<ITrackedRelease[]>(ChromeStorageKeys.ReleaseTracker) ?? [];
  }

  public async getState(): Promise<IReleaseTrackerState> {
    const state = await stateStorage.getItem<IReleaseTrackerState>(ChromeStorageKeys.ReleaseTrackerState);
    return { matches: {}, dismissedTorrentIds: [], ...state };
  }

  public createRelease(searchTerm: string, excluded: string[], preferred: string[]): ITrackedRelease {
    return { id: crypto.randomUUID(), searchTerm, excluded, preferred, rejectedTorrentIds: [] };
  }

  public async saveRelease(release: ITrackedRelease) {
    const releases = await this.getReleases();
    const index = releases.findIndex(storedRelease => storedRelease.id === release.id);
    if (index < 0) {
      releases.push(release);
    } else {
      releases[index] = release;
    }
    await releasesStorage.setItem(ChromeStorageKeys.ReleaseTracker, releases);

    // Keywords might have changed, so the next check finds the matches again
    const state = await this.getState();
    delete state.matches[release.id];
    await stateStorage.setItem(ChromeStorageKeys.ReleaseTrackerState, state);
  }

  public async removeRelease(releaseId: string) {
    const releases = await this.getReleases();
    await releasesStorage.setItem(ChromeStorageKeys.ReleaseTracker, releases.filter(release => release.id !== releaseId));

    const state = await this.getState();
    delete state.matches[releaseId];
    await stateStorage.setItem(ChromeStorageKeys.ReleaseTrackerState, state);
  }

  public acceptMatch(releaseId: string) {
    return this.removeRelease(releaseId);
  }

  public async rejectMatch(releaseId: string, torrentId: number) {
    const releases = await this.getReleases();
    const release = releases.find(storedRelease => storedRelease.id === releaseId);
    if (release) {
      release.rejectedTorrentIds = [...release.rejectedTorrentIds, torrentId].slice(-maxRejectedTorrentIds);
      await releasesStorage.setItem(ChromeStorageKeys.ReleaseTracker, releases);
    }

    const state = await this.getState();
    state.matches[releaseId] = (state.matches[releaseId] ?? []).filter(match => match.torrentId !== torrentId);
    await stateStorage.setItem(ChromeStorageKeys.ReleaseTrackerState, state);
  }

  public async dismissMatches(torrentIds: number[]) {
    const state = await this.getState();
    state.dismissedTorrentIds = [...new Set([...state.dismissedTorrentIds, ...torrentIds])];
    await stateStorage.setItem(ChromeStorageKeys.ReleaseTrackerState, state);
  }

  public async getPendingMatches(): Promise<IFoundRelease[]> {
    const [releases, state] = await Promise.all([this.getReleases(), this.getState()]);
    return releases.flatMap(release => (state.matches[release.id] ?? []).map(match => ({ release, match })));
  }

  /**
   * Checks every tracked release, returns the matches found for the first time
   */
  public check(): Promise<IFoundRelease[]> {
    if (!this.runningCheck) {
      this.runningCheck = this.performCheck().finally(() => {
        this.runningCheck = null;
      });
    }
    return this.runningCheck;
  }

  public matchTitle(release: ITrackedRelease, title: string) {
    const titleWords = this.normalizeWords(title);
    const isMatch = this.containsKeyword(titleWords, release.searchTerm) &&
      !release.excluded.some(keyword => this.containsKeyword(titleWords, keyword));

    return {
      isMatch,
      isPreferred: isMatch && release.preferred.some(keyword => this.containsKeyword(titleWords, keyword)),
    };
  }

  public parseSearchResults(html: string): ISearchResult[] {
    // Parsed with regular expressions, as the background service worker has no DOMParser
    return html.split(/<tr[\s>]/).flatMap((row) => {
      const title = /<a href="(details\?(\d+)[^"]*)"><b>([^<]*)<\/b>/.exec(row);
      if (!title) {
        return [];
      }
      const added = /<nobr>([^<]*)<br \/>([^<]*)<\/nobr>/.exec(row);
      const size = /<td class=center>([\d.,]+)<br>(\w+)<\/td>/.exec(row);

      return [{
        torrentId: parseInt(title[2], 10),
        title: this.decodeHtmlEntities(title[3]).trim(),
        detailsLink: linkomanijaUrl + title[1],
        addedDate: added ? `${added[1]} ${added[2]}` : '',
        size: size ? `${size[1]} ${size[2]}` : '',
      }];
    });
  }

  private async performCheck(): Promise<IFoundRelease[]> {
    const releases = await this.getReleases();
    const state = await this.getState();
    const found: IFoundRelease[] = [];
    let loggedOut = false;

    for (const [index, release] of releases.entries()) {
      if (index > 0) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenSearches));
      }

      const results = await this.search(release.searchTerm);
      if (results === null) {
        loggedOut = true;
        break;
      }

      const matches = state.matches[release.id] ?? [];
      for (const result of results.slice(0, maxCheckedResults)) {
        const isKnown = release.rejectedTorrentIds.includes(result.torrentId) ||
          matches.some(match => match.torrentId === result.torrentId);
        const { isMatch, isPreferred } = this.matchTitle(release, result.title);
        if (!isKnown && isMatch) {
          const match: IReleaseMatch = { ...result, isPreferred, foundAt: Date.now() };
          matches.push(match);
          found.push({ release, match });
        }
      }
      // Stable sort keeps the website's order within both groups
      state.matches[release.id] = matches.sort((a, b) => Number(b.isPreferred) - Number(a.isPreferred));
    }

    // Releases could have been edited, accepted or rejected while searching
    const latestReleases = await this.getReleases();
    const latestState = await this.getState();
    const latestMatches: IReleaseTrackerState['matches'] = {};
    for (const release of latestReleases) {
      latestMatches[release.id] = (state.matches[release.id] ?? latestState.matches[release.id] ?? [])
        .filter(match => !release.rejectedTorrentIds.includes(match.torrentId));
    }
    const pendingTorrentIds = Object.values(latestMatches).flat().map(match => match.torrentId);

    await stateStorage.setItem<IReleaseTrackerState>(ChromeStorageKeys.ReleaseTrackerState, {
      matches: latestMatches,
      lastCheck: loggedOut ? latestState.lastCheck : Date.now(),
      loggedOut,
      dismissedTorrentIds: latestState.dismissedTorrentIds.filter(torrentId => pendingTorrentIds.includes(torrentId)),
    });

    return found.filter(({ release, match }) =>
      latestMatches[release.id]?.some(latestMatch => latestMatch.torrentId === match.torrentId));
  }

  /**
   * Resolves to null when the user is logged out of linkomanija.net
   */
  private async search(searchTerm: string): Promise<ISearchResult[]> {
    // Quotes make the website search for the exact phrase instead of any of its words
    const query = encodeURIComponent(`"${searchTerm.replace(/"/g, '')}"`);
    // Sent with the browser's linkomanija.net cookies, so the user's own session is used
    const response = await fetch(`${linkomanijaUrl}browse.php?search=${query}`, { credentials: 'include' });
    if (response.url.includes('login.php')) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Search for "${searchTerm}" failed with status ${response.status}`);
    }
    return this.parseSearchResults(await response.text());
  }

  /**
   * Splits text into lowercase words without diacritics, so "WEB-Rip" becomes ["web", "rip"]
   */
  private normalizeWords(text: string) {
    return text
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean);
  }

  /**
   * Whole word match which ignores separators, so "webrip" matches "WEB-Rip" and "ts" does not match "Tapes"
   */
  private containsKeyword(titleWords: string[], keyword: string) {
    const target = this.normalizeWords(keyword).join('');
    if (!target) {
      return false;
    }

    for (let start = 0; start < titleWords.length; start++) {
      let joined = '';
      for (let end = start; end < titleWords.length && target.startsWith(joined + titleWords[end]); end++) {
        joined += titleWords[end];
        if (joined === target) {
          return true;
        }
      }
    }
    return false;
  }

  private decodeHtmlEntities(text: string) {
    const namedEntities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: '\'', nbsp: ' ' };
    return text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (entity, code: string) => {
      if (code.startsWith('#x') || code.startsWith('#X')) {
        return String.fromCodePoint(parseInt(code.slice(2), 16));
      }
      if (code.startsWith('#')) {
        return String.fromCodePoint(parseInt(code.slice(1), 10));
      }
      return namedEntities[code.toLowerCase()] ?? entity;
    });
  }
}

export default new ReleaseTrackerService();
