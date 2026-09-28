export interface ITrackedRelease {
  id: string;
  searchTerm: string;
  // A torrent is never matched when its title contains any of these
  excluded: string[];
  // Not required for a match, matches containing any of these are marked and listed first
  preferred: string[];
  rejectedTorrentIds: number[];
}

export interface IReleaseMatch {
  torrentId: number;
  title: string;
  detailsLink: string;
  addedDate: string;
  size: string;
  isPreferred: boolean;
  foundAt: number;
}

export interface IReleaseTrackerState {
  // Keyed by tracked release ID
  matches: Record<string, IReleaseMatch[]>;
  lastCheck?: number;
  loggedOut?: boolean;
  // Matches hidden from the page toast, they stay pending until accepted or rejected
  dismissedTorrentIds: number[];
}

export interface IMessageReleaseTracker {
  releaseTracker: 'check';
}
