import { isDefined, isString } from '@rudderstack/analytics-js-common/utilities/checks';
import { pick as ramdaPick, pickBy, isEmpty } from 'ramda';

const isNotEmpty = x => !isEmpty(x);
const isNotNull = x => x != null;
const isDefinedAndNotNull = x => isDefined(x) && isNotNull(x);
const isDefinedAndNotNullAndNotEmpty = x => isDefined(x) && isNotNull(x) && isNotEmpty(x);
const removeUndefinedValues = obj => pickBy(isDefined, obj);
const removeNullValues = obj => pickBy(isNotNull, obj);
const removeUndefinedAndNullValues = obj => pickBy(isDefinedAndNotNull, obj);
const removeUndefinedAndNullAndEmptyValues = obj => pickBy(isDefinedAndNotNullAndNotEmpty, obj);
const isBlank = value => isEmpty(value);
const pick = (argObj, argArr) => ramdaPick(argArr, argObj);

/**
 *
 * Convert an array map to hashmap(value as an array)
 * @param  {} arrays [{"from":"prop1","to":"val1"},{"from":"prop1","to":"val2"},{"from":"prop2","to":"val2"}]
 * @param  {} fromKey="from"
 * @param  {} toKey="to"
 * @param  {} isLowerCase=true
 * @param  {} return hashmap {"prop1":["val1","val2"],"prop2":["val2"]}
 */
const getHashFromArrayWithDuplicate = (
  arrays,
  fromKey = 'from',
  toKey = 'to',
  isLowerCase = true,
) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach(array => {
      if (!isNotEmpty(array[fromKey])) return;
      if (!isString(array[fromKey])) return;
      const key = isLowerCase ? array[fromKey].toLowerCase().trim() : array[fromKey].trim();

      if (hashMap[key]) {
        const val = hashMap[key];
        if (!val.includes(array[toKey])) {
          hashMap[key].push(array[toKey]);
        }
      } else {
        hashMap[key] = [array[toKey]];
      }
    });
  }
  return hashMap;
};

/**
 *
 * Convert an array map to hashmap
 * @param  {} arrays [{"from":"prop1","to":"val1"},{"from":"prop2","to":"val2"}]
 * @param  {} fromKey="from"
 * @param  {} toKey="to"
 * @param  {} isLowerCase=true
 * @param  {} return hashmap {"prop1":"val1","prop2:"val2"}
 */
const getHashFromArray = (arrays, fromKey = 'from', toKey = 'to', isLowerCase = true) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach(array => {
      if (!isNotEmpty(array[fromKey])) return;
      hashMap[isLowerCase ? array[fromKey].toLowerCase() : array[fromKey]] = array[toKey];
    });
  }
  return hashMap;
};

/**
 * @param  {} timestamp
 * @param  {} return iso format of date
 */
const toIso = timestamp => new Date(timestamp).toISOString();

// function to flatten a json
function flattenJson(data, separator = '.', mode = 'normal') {
  const result = {};
  let l;

  // a recursive function to loop through the array of the data
  function recurse(cur, prop, visited = new Set()) {
    let i;
    if (visited.has(cur)) {
      result[prop] = '[Circular Reference]';
      return;
    }

    visited.add(cur);
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (i = 0, l = cur.length; i < l; i += 1) {
        if (mode === 'strict') {
          recurse(cur[i], `${prop}${separator}${i}`, visited);
        } else {
          recurse(cur[i], `${prop}[${i}]`, visited);
        }
      }
      if (l === 0) {
        result[prop] = [];
      }
    } else {
      let isEmptyFlag = true;
      Object.keys(cur).forEach(key => {
        isEmptyFlag = false;
        recurse(cur[key], prop ? `${prop}${separator}${key}` : key, visited);
      });
      if (isEmptyFlag && prop) result[prop] = {};
    }
    visited.delete(cur);
  }

  recurse(data, '');
  return result;
}

/**
 * Check whether the passed eventname is mapped in the config
 * and return the mapped event name.
 * @param {*} event
 * @param {*} eventsHashmap
 * @returns mappedEventName
 */
function getEventMappingFromConfig(event, eventsHashmap) {
  // if the event name is mapped in the config, use the mapped name
  // else use the original event name
  if (eventsHashmap[event]) {
    return eventsHashmap[event];
  }
  return null;
}

// External ID format
// {
//   "context": {
//     "externalId": [
//       {
//         "type": "kustomerId",
//         "id": "12345678"
//       }
//     ]
//   }
// }
// to get destination specific external id passed in context.
function getDestinationExternalID(message, type) {
  let externalIdArray = null;
  let destinationExternalId = null;
  if (message.context && message.context.externalId) {
    externalIdArray = message.context.externalId;
  }
  if (externalIdArray && Array.isArray(externalIdArray)) {
    externalIdArray.forEach(extIdObj => {
      if (extIdObj.type === type) {
        destinationExternalId = extIdObj.id;
      }
    });
  }
  return destinationExternalId;
}

/**
 * Function to check if value is Defined, Not null and Not Empty.
 * Created this function, Because existing isDefinedAndNotNullAndNotEmpty(123) is returning false due to lodash _.isEmpty function.
 * _.isEmpty is used to detect empty collections/objects and it will return true for Integer, Boolean values.
 * ref: https://github.com/lodash/lodash/issues/496
 * @param {*} value 123
 * @returns yes
 */
const isDefinedNotNullNotEmpty = value =>
  !(
    value === undefined ||
    value === null ||
    Number.isNaN(value) ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );

const validateEmail = email => {
  const regex =
    /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/;
  return !!regex.test(email);
};

const validatePhoneWithCountryCode = phone => {
  const regex = /^\+(?:[\d{] ?){6,14}\d$/;
  return !!regex.test(phone);
};

export {
  getEventMappingFromConfig,
  getHashFromArrayWithDuplicate,
  getHashFromArray,
  getDestinationExternalID,
  toIso,
  flattenJson,
  removeUndefinedValues,
  removeUndefinedAndNullValues,
  removeNullValues,
  removeUndefinedAndNullAndEmptyValues,
  isNotEmpty,
  isNotNull,
  isDefinedAndNotNull,
  isDefinedAndNotNullAndNotEmpty,
  isDefinedNotNullNotEmpty,
  isBlank,
  pick,
  validateEmail,
  validatePhoneWithCountryCode,
};
