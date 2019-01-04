import featureStorageService from './services/common/feature-storage.service';

import { Features } from './features/features';
import { IMessageToggle } from './interfaces/communication';

/**
 * Initialize all the featues
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
 * Settup feature toggling listener
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
