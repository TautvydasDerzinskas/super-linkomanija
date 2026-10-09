export interface IWatchedRelease {
  id: string;
  searchTerm: string;
  // A result is never matched when its title contains any of these
  excluded: string[];
  // Not required for a match, matches containing any of these are marked and listed first
  preferred: string[];
  rejectedEntryIds: number[];
}

export interface IReleaseMatch {
  entryId: number;
  title: string;
  detailsLink: string;
  addedDate: string;
  size: string;
  isPreferred: boolean;
  foundAt: number;
}

export interface IReleaseNotifierState {
  // Keyed by watched release ID
  matches: Record<string, IReleaseMatch[]>;
  lastCheck?: number;
  loggedOut?: boolean;
  // Matches hidden from the page toast, they stay pending until accepted or rejected
  dismissedEntryIds: number[];
}

export interface IMessageReleaseNotifier {
  releaseNotifier: 'check';
}
