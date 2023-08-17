import { getDefinedTraits } from '../../utils/utils';
import { NAME, excludeReservedTraits, excludePageProperties } from './constants';
import {
  getHashFromArray,
  removeUndefinedAndNullValues,
  isNotEmpty,
} from '../../utils/commonUtils';

// FIRSTNAME, LASTNAME, SMS are the default created contact attributes in sendinblue
const prepareDefaultContactAttributes = (message) => {
  const { firstName, lastName, phone } = getDefinedTraits(message);
  return { FIRSTNAME: firstName, LASTNAME: lastName, SMS: phone };
};

/**
 * Function to remove duplicate traits from user traits
 * @param {*} userTraits {"FIRSTNAME":"John","firstname":"John","location":"San Francisco","LOCATIOn":"San Francisco"}
 * @param {*} attributeMap {"area_code":"AREA","location":"LOCATION"}
 * @returns // {"FIRSTNAME":"John","LOCATIOn":"San Francisco"}
 */
const refineUserTraits = (userTraits, attributeMap) => {
  const refinedTraits = userTraits;
  Object.keys(userTraits).forEach((key) => {
    if (
      excludeReservedTraits.includes(key) ||
      Object.prototype.hasOwnProperty.call(attributeMap, key)
    ) {
      delete refinedTraits[key];
    }
  });
  return refinedTraits;
};

/**
 * Function to prepare user traits for identify and track call.
 * User traits is a combination of some reserved traits and transformation of reset of the traits with the help of contact attribute mapping defined in webapp.
 * Reserved traits -> first name, last name, phone, email
 * Contact attribute mapping -> [{"from":"area_code","to":"AREA"},{"from":"location","to":"LOCATION"}]
 * @param {*} message
 * @param {*} contactAttributeMapping traits to Sendinblue contact attribute mapping defined in webapp
 * @returns
 */
const prepareUserTraits = (message, contactAttributeMapping) => {
  const { traits } = message.context;
  const reservedTraits = prepareDefaultContactAttributes(message);

  // convert destination.Config.contactAttributeMapping to hashMap
  const attributeMap = getHashFromArray(contactAttributeMapping, 'from', 'to', false);

  let userTraits = traits;
  Object.keys(attributeMap).forEach((key) => {
    const traitValue = traits[key];
    if (traitValue) {
      userTraits[attributeMap[key]] = traitValue;
    }
  });

  userTraits = { ...reservedTraits, ...userTraits };
  userTraits = refineUserTraits(userTraits, attributeMap);

  // eslint-disable-next-line consistent-return
  return removeUndefinedAndNullValues(userTraits);
};

// Prepare track event data. Event data consists `id` and `data`.
// id -> from integration object or messageId
// data -> properties
const prepareTrackEventData = (message) => {
  const { properties, integrations, messageId } = message;
  let eventData = {};
  if (isNotEmpty(properties)) {
    let id;
    if (integrations?.[NAME]) {
      const key = integrations[NAME]?.propertiesIdKey;
      if (key) {
        id = properties[key];
      }
    }

    id = id || messageId;
    eventData = { id, data: removeUndefinedAndNullValues(properties) };
  }
  return eventData;
};

const refinePageProperties = (properties) => {
  const refinedProperties = properties;
  excludePageProperties.forEach((key) => delete refinedProperties[key]);
  return refinedProperties;
};

const preparePagePayload = (message) => {
  const { properties, context } = message;
  const { page } = context;

  const title = properties?.title || page?.title;
  const url = properties?.url || page?.url;
  const path = properties?.path || page?.path;
  const referrer = properties?.referrer || page?.referrer;

  const refinedProperties = refinePageProperties(properties);
  const payload = {
    ma_title: title,
    ma_url: url,
    ma_path: path,
    ma_referrer: referrer,
    ...refinedProperties,
  };
  return removeUndefinedAndNullValues(payload);
};

export { prepareUserTraits, prepareTrackEventData, preparePagePayload };
