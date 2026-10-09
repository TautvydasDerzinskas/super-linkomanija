export enum ShareLinks {
  Facebook = 'https://www.facebook.com/sharer/sharer.php?u=',
  Twitter = 'https://twitter.com/intent/tweet?text=Super%20Linkomanija&url=',
}

export enum LinkomanijaSelectors {
  CommentTextBoxes = 'form > textarea',
  ReleaseTable = '#content form[action="browse.php"] > table:not(.bottom)',
  ReleaseTableRows = '#content form[action="browse.php"] > table:not(.bottom) tr',
  ReleaseTableTitleColumn = '#content form[action="browse.php"] > table tr td[align="left"]:not([class])',
}

export enum ViewModes {
  List,
  Grid,
}

export enum ChromeStorageKeys {
  Locale = 'sm-locale',
  Features = 'sm-features',
  History = 'sm-history',
  ReleaseNotifier = 'sm-release-notifier',
  ReleaseNotifierState = 'sm-release-notifier-state',
  AutoLogin = 'sm-auto-login',
  AutoLoginDevice = 'sm-auto-login-device',
}

export enum Locales {
  English = 'en',
  Lithuanian = 'lt',
}

export enum Browsers {
  Chrome = 'chrome',
  Edge = 'edge',
  Firefox = 'firefox',
  Opera = 'opera',
  Vivaldi = 'vivaldi',
  Other = 'other',
}
