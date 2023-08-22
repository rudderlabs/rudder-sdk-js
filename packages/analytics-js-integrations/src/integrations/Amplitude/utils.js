import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Amplitude/constants';

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

export { getTraitsToSetOnce, getTraitsToIncrement, getDestinationOptions };
