import { NAME, DISPLAY_NAME } from './constants';

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
 * Sanitizes the given event name by trimming any leading or trailing whitespace and prefixing it with "rudder.".
 *
 * @param {string} eventName - The event name to be sanitized.
 * @return {string} The sanitized event name.
 */
const sanitizeName = eventName => `rudder.${eventName.trim()}`;

/**
 * Sanitizes the properties object by formatting the keys and returning a new object with the formatted keys.
 *
 * @param {object} properties - The properties object to be sanitized.
 * @return {object} - The sanitized properties object with formatted keys.
 */
const sanitizeAttributes = attributes => {
  const formattedAttributes = {};
  for (const key in attributes) {
    const formattedKey = sanitizeName(key);
    formattedAttributes[formattedKey] = attributes[key];
  }
  return formattedAttributes;
};

export { getDestinationOptions, sanitizeName, sanitizeAttributes };
