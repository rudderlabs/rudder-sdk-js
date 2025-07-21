import { NAME, DISPLAY_NAME } from './constants';
import { getHashFromArray, isDefinedAndNotNull } from '../../utils/commonUtils';

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

const getMappedData = (rudderElement, fieldMapping) => {
  const { message } = rudderElement;
  const mappedData = {};
  const fieldMapHashmap = getHashFromArray(fieldMapping, 'from', 'to', false);

  Object.keys(fieldMapHashmap).forEach(field => {
    if (isDefinedAndNotNull(message.properties[field])) {
      mappedData[fieldMapHashmap[field]] = message.properties[field];
    }
  });
  return mappedData;
};

export { getDestinationOptions, getMappedData };
