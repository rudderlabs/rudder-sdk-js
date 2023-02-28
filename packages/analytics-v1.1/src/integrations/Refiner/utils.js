import { getHashFromArray } from '../../utils/commonUtils';

/**
 * Replace the attributes name using webapp configuration mapping
 * @param {*} attributesMap
 * @param {*} destinationPayload
 * @returns
 */
const replaceDestAttributes = (attributesMap, destinationPayload) => {
  const payload = destinationPayload;
  const keys = Object.keys(attributesMap);
  keys.forEach(key => {
    if (payload[key]) {
      const value = payload[key];
      payload[attributesMap[key]] = value;
      delete payload[key];
    }
  });
  return payload;
};

/**
 * Returns the userTraits
 * @param {*} userTraits
 * @param {*} userAttributesMapping
 * @returns
 */
const replaceUserTraits = (userTraits, userAttributesMapping) => {
  const userAttributesMap = getHashFromArray(userAttributesMapping, 'from', 'to', false);
  return replaceDestAttributes(userAttributesMap, userTraits);
};

/**
 * Replace the accountTraits
 * @param {*} accountTraits
 * @param {*} accountAttributesMapping
 * @returns
 */
const replaceAccountTraits = (accountTraits, accountAttributesMapping) => {
  const accountAttributesMap = getHashFromArray(accountAttributesMapping, 'from', 'to', false);
  return replaceDestAttributes(accountAttributesMap, accountTraits);
};

export { replaceUserTraits, replaceAccountTraits };
