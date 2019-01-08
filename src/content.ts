import featureStorageService from './services/common/feature-storage.service';
import historyService from './services/common/history.service';
import urlService from './services/common/url.service';
import extractTorrentDetailsService from './services/common/extract-torrent-details.service';

import { Features } from './features/features';
import { IMessageToggle } from './interfaces/communication';

/**
 * Find out which theme is being used (light or dark)
 */
const decideTheme = () => {
  const themeStyleSheet = document.querySelector('head link');
  if (themeStyleSheet.getAttribute('href').includes('dark')) {
    document.getElementsByTagName('body')[0].classList.add('sl--theme-dark');
  }
};
decideTheme();

/**
 * Managing history
 */
const findParent = (tagName: string, element: HTMLElement) => {
  while (element) {
    if ((element.nodeName || element.tagName).toLowerCase() === tagName.toLowerCase()) {
      return element;
    }
    element = element.parentNode as HTMLElement;
  }
  return null;
};

const setupHistoryTracking = () => {
  if (urlService.isTorrentDetailsPage()) {
    const torrentDetails = extractTorrentDetailsService.getBasicTorrentDetailsInDetailsPage();

    // Tracking viewed torrents
    historyService.addViewedTorrent(torrentDetails);

    // Tracking commented torrents
    const commentSubmitButton = document.getElementById('comment-post-submit');
    if (commentSubmitButton) {
      commentSubmitButton.addEventListener('click', () => {
        historyService.addCommentedTorrent(torrentDetails);
      });
    }
  }

  // Tracking downloaded torrents
  document.body.onclick = (event) => {
    const linkElement = findParent('a', (event.target || event.srcElement) as HTMLElement);
    if (linkElement) {
      const downloadLink = (linkElement as HTMLElement).getAttribute('href');
      if (downloadLink) {
        const isDownloadLink = downloadLink.includes('download.php?');
        if (isDownloadLink) {
          if (urlService.isTorrentsListPage()) {
            const torrentDetails = extractTorrentDetailsService.getMainTorrentDetailsByDownloadLink(downloadLink);
            this.addDownloadedTorrent(torrentDetails);
          } else if (urlService.isTorrentDetailsPage()) {
            const torrentDetails = extractTorrentDetailsService.getBasicTorrentDetailsInDetailsPage();
            this.addDownloadedTorrent(torrentDetails);
          }
        }
      }
    }
  };
};
setupHistoryTracking();

/**
 * Initialize all the features
 */
const setupFeatureContents = () => {
  Features.forEach((feature) => {
    featureStorageService.getFeatureData(feature.meta.id).then(featureData => {
      if (featureData.status) {
        if (feature.content.extendPageUserInterface) {
          feature.content.extendPageUserInterface();
        }
        if (feature.content.setupEventListeners) {
          feature.content.setupEventListeners();
        }
      }
    });
  });
};

/**
 * Setup feature toggling listener
 */
const handleToggleRequest = (request: IMessageToggle) => {
  if (request.toggle && request.toggle.featureId) {
    const activeFeature = Features.filter(feature => feature.meta.id === request.toggle.featureId)[0];
    if (activeFeature) {
      if (request.toggle.value) {
        if (activeFeature.content.extendPageUserInterface) {
          activeFeature.content.extendPageUserInterface();
        }
        if (activeFeature.content.setupEventListeners) {
          activeFeature.content.setupEventListeners();
        }
      } else if (activeFeature.content.cleanUp) {
        activeFeature.content.cleanUp();
      }
    }
  }
};

// Listening messages from popup
chrome.runtime.onMessage.addListener(handleToggleRequest);
// Listening messages form web page
window.addEventListener('message', (event: { source: any, data: IMessageToggle }) => {
  if  (event.source === window && event.data.toggle.fromPage) {
    handleToggleRequest(event.data);
  }
});

setupFeatureContents();
