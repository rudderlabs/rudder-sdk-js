import {
  NAME,
  DISPLAY_NAME,
  AMPLITUDE_SDK_V1,
  AMPLITUDE_SDK_V2,
  AMPLITUDE_SDK_VERSION_CONFIG_KEY,
  AMPLITUDE_AUTO_CAPTURE_PAGE_VIEWS_CONFIG_KEY,
  AMPLITUDE_PAGE_URL_ENRICHMENT_CONFIG_KEY,
  AMPLITUDE_TRACK_SESSION_EVENTS_CONFIG_KEY,
  AMPLITUDE_WEB_VITALS_CONFIG_KEY,
  AMPLITUDE_FILE_DOWNLOADS_CONFIG_KEY,
  AMPLITUDE_FRUSTRATION_INTERACTIONS_CONFIG_KEY,
  AMPLITUDE_NETWORK_TRACKING_CONFIG_KEY,
  AMPLITUDE_ELEMENT_INTERACTIONS_CONFIG_KEY,
  AMPLITUDE_FORM_INTERACTIONS_CONFIG_KEY,
} from './constants';

const getTraitsToSetOnce = config => {
  const traitsToSetOnce = [];
  if (config.traitsToSetOnce && config.traitsToSetOnce.length > 0) {
    config.traitsToSetOnce.forEach(element => {
      if (element?.traits && element.traits !== '') {
        traitsToSetOnce.push(element.traits);
      }
    });
  }
  return traitsToSetOnce;
};

const getTraitsToIncrement = config => {
  const traitsToIncrement = [];
  if (config.traitsToIncrement && config.traitsToIncrement.length > 0) {
    config.traitsToIncrement.forEach(element => {
      if (element?.traits && element.traits !== '') {
        traitsToIncrement.push(element.traits);
      }
    });
  }
  return traitsToIncrement;
};

/**
 * Get destination specific options from integrations options
 * By default, it will return options for the destination using its display name
 * If display name is not present, it will return options for the destination using its name
 * The fallback is only for backward compatibility with SDK versions < v1.1
 * @param {object} integrationsOptions Integrations options object
 * @returns destination specific options
 */
const getDestinationOptions = integrationsOptions =>
  integrationsOptions && (integrationsOptions[DISPLAY_NAME] || integrationsOptions[NAME]);

/**
 * Checks if there is any fieldsTounset provided and returns that list
 * @param {*} integrations integrations object
 */
const getFieldsToUnset = integrations => {
  const amplitudeIntgConfig = getDestinationOptions(integrations);
  const fieldsToUnset = amplitudeIntgConfig?.fieldsToUnset || undefined;
  if (fieldsToUnset && Array.isArray(fieldsToUnset) && fieldsToUnset.length > 0) {
    return fieldsToUnset;
  }
  return undefined;
};

/**
 * Formats the given URL by adding the "https://" prefix if it doesn't already have it.
 *
 * @param {string} url - The URL to be formatted.
 * @returns {string} - The formatted URL.
 */
function formatUrl(url) {
  if (url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
}

const getAmplitudeSdkVersion = config => {
  const configuredSdkVersion = Number(config?.[AMPLITUDE_SDK_VERSION_CONFIG_KEY]);
  return configuredSdkVersion === AMPLITUDE_SDK_V2
    ? AMPLITUDE_SDK_V2
    : AMPLITUDE_SDK_V1;
};

const getBooleanConfigValue = (config, key) => config?.[key] === true;

const getAutoCapturePageViews = config =>
  getBooleanConfigValue(config, AMPLITUDE_AUTO_CAPTURE_PAGE_VIEWS_CONFIG_KEY);

const getPageUrlEnrichment = config =>
  getBooleanConfigValue(config, AMPLITUDE_PAGE_URL_ENRICHMENT_CONFIG_KEY);

const getTrackSessionEvents = config =>
  getBooleanConfigValue(config, AMPLITUDE_TRACK_SESSION_EVENTS_CONFIG_KEY);

const getWebVitals = config => getBooleanConfigValue(config, AMPLITUDE_WEB_VITALS_CONFIG_KEY);

const getFileDownloads = config =>
  getBooleanConfigValue(config, AMPLITUDE_FILE_DOWNLOADS_CONFIG_KEY);

const getFrustrationInteractions = config =>
  getBooleanConfigValue(config, AMPLITUDE_FRUSTRATION_INTERACTIONS_CONFIG_KEY);

const getNetworkTracking = config =>
  getBooleanConfigValue(config, AMPLITUDE_NETWORK_TRACKING_CONFIG_KEY);

const getElementInteractions = config =>
  getBooleanConfigValue(config, AMPLITUDE_ELEMENT_INTERACTIONS_CONFIG_KEY);

const getFormInteractions = config =>
  getBooleanConfigValue(config, AMPLITUDE_FORM_INTERACTIONS_CONFIG_KEY);

export {
  getTraitsToSetOnce,
  getTraitsToIncrement,
  getDestinationOptions,
  getFieldsToUnset,
  formatUrl,
  getAmplitudeSdkVersion,
  getAutoCapturePageViews,
  getPageUrlEnrichment,
  getTrackSessionEvents,
  getWebVitals,
  getFileDownloads,
  getFrustrationInteractions,
  getNetworkTracking,
  getElementInteractions,
  getFormInteractions,
};
