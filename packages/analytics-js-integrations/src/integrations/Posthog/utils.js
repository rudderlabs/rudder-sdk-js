import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Posthog/constants';

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
 * Returns xhrHeaders object
 * @param {*} config
 * @returns
 */
const getXhrHeaders = config => {
  const xhrHeaders = {};
  if (config.xhrHeaders && config.xhrHeaders.length > 0) {
    config.xhrHeaders.forEach(header => {
      if (header?.key?.trim() !== '' && header?.value?.trim() !== '') {
        xhrHeaders[header.key] = header.value;
      }
    });
  }

  return xhrHeaders;
};

/**
 * Returns propertyBlackList array
 * @param {*} config
 * @returns
 */
const getPropertyBlackList = config => {
  const propertyBlackList = [];
  if (config.propertyBlackList && config.propertyBlackList.length > 0) {
    config.propertyBlackList.forEach(element => {
      if (element?.property?.trim() !== '') {
        propertyBlackList.push(element.property);
      }
    });
  }
  return propertyBlackList;
};

export { getXhrHeaders, getPropertyBlackList, getDestinationOptions };
