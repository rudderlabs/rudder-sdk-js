/* eslint-disable no-underscore-dangle */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Mouseflow/constants';

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

/*
 * Here, we are iterating each key-value pair of object 'Obj' and
 * checks if typeof value is string then we pass it as custom variable in mouseflow.
 */
const setCustomVariables = userProperties => {
  if (userProperties && typeof userProperties === 'object') {
    Object.entries(userProperties).forEach(item => {
      const [key, value] = item;
      if (typeof value === 'string' || typeof value === 'number')
        window._mfq.push(['setVariable', key, value]);
    });
  }
};

/*
 * Set custom Variables from integrations Object
 */
const addCustomVariables = message => {
  const mouseflowIntgConfig = getDestinationOptions(message.integrations);
  const customVariables = mouseflowIntgConfig?.customVariables;
  setCustomVariables(customVariables);
};

export { setCustomVariables, addCustomVariables };
