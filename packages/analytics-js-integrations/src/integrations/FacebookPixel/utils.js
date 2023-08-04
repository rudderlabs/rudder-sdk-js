import is from 'is';
import get from 'get-value';
import sha256 from 'crypto-js/sha256';
import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/FacebookPixel/constants';

function getEventId(message) {
  return (
    get(message, 'traits.event_id') ||
    get(message, 'context.traits.event_id') ||
    get(message, 'properties.event_id') ||
    message.messageId
  );
}

/**
 * This method gets content category
 *
 * @param {*} category
 * @returns The content category as a string
 */
const getContentCategory = category => {
  let contentCategory = category;
  if (Array.isArray(contentCategory)) {
    contentCategory = contentCategory.map(String).join(',');
  }
  if (
    contentCategory &&
    typeof contentCategory !== 'string' &&
    typeof contentCategory !== 'object'
  ) {
    contentCategory = String(contentCategory);
  }
  if (
    contentCategory &&
    typeof contentCategory !== 'string' &&
    !Array.isArray(contentCategory) &&
    typeof contentCategory === 'object'
  ) {
    logger.error("'properties.category' must be either be a string or an array");
    return;
  }
  // eslint-disable-next-line consistent-return
  return contentCategory;
};

const getHashedStatus = (message, integrationName) => {
  const val = get(message, `integrations.${integrationName}.hashed`);
  return val;
};

const buildPayLoad = (
  rudderElement,
  configWhilistedProperties,
  configBlacklistedProperties,
  hashedPii,
) => {
  const dateFields = [
    'checkinDate',
    'checkoutDate',
    'departingArrivalDate',
    'departingDepartureDate',
    'returningArrivalDate',
    'returningDepartureDate',
    'travelEnd',
    'travelStart',
  ];
  const defaultPiiProperties = [
    'email',
    'firstName',
    'lastName',
    'gender',
    'city',
    'country',
    'phone',
    'state',
    'zip',
    'birthday',
  ];
  const whitelistPiiProperties = configWhilistedProperties || [];
  const blacklistPiiProperties = configBlacklistedProperties || [];

  /**
   * shouldPropBeHashedMap = {
   * <blacklisted_property_name>: <hash_required_boolean>,
   * }
   */

  const shouldPropBeHashedMap = blacklistPiiProperties.reduce((acc, currProp) => {
    acc[currProp.blacklistPiiProperties] = currProp.blacklistPiiHash;
    return acc;
  }, {});
  const whitelistPiiPropertiesNames = whitelistPiiProperties.map(
    propObject => propObject.whitelistPiiProperties,
  );

  const { properties } = rudderElement.message;

  const payload = Object.entries(properties).reduce((acc, [currPropName, currPropValue]) => {
    const isPropertyPii =
      defaultPiiProperties.includes(currPropName) ||
      Object.prototype.hasOwnProperty.call(shouldPropBeHashedMap, currPropName);

    const isProperyWhiteListed = whitelistPiiPropertiesNames.includes(currPropName);

    const isDateProp = dateFields.includes(currPropName) && is.date(currPropValue);

    if (isDateProp) {
      [acc[currPropName]] = currPropValue.toISOString().split('T');
    }

    if (shouldPropBeHashedMap[currPropName] && typeof currPropValue === 'string') {
      acc[currPropName] = hashedPii ? currPropValue.toString() : sha256(currPropValue).toString();
    } else if ((!isPropertyPii || isProperyWhiteListed) && !isDateProp) {
      acc[currPropName] = currPropValue;
    } else {
      logger.debug(
        `[Facebook Pixel] PII Property '${currPropValue}' is neither hashed nor whitelisted and will be ignored`,
      );
    }

    return acc;
  }, {});
  return payload;
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

export { getEventId, getContentCategory, buildPayLoad, getHashedStatus, getDestinationOptions };
