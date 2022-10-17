import _ from "lodash";

const isDefined = (x) => !_.isUndefined(x);
const isNotEmpty = (x) => !_.isEmpty(x);
const isNotNull = (x) => x != null;
const isDefinedAndNotNull = (x) => isDefined(x) && isNotNull(x);
const isDefinedAndNotNullAndNotEmpty = (x) =>
  isDefined(x) && isNotNull(x) && isNotEmpty(x);
const removeUndefinedValues = (obj) => _.pickBy(obj, isDefined);
const removeNullValues = (obj) => _.pickBy(obj, isNotNull);
const removeUndefinedAndNullValues = (obj) =>
  _.pickBy(obj, isDefinedAndNotNull);
const removeUndefinedAndNullAndEmptyValues = (obj) =>
  _.pickBy(obj, isDefinedAndNotNullAndNotEmpty);
const isBlank = (value) => _.isEmpty(_.toString(value));
const pick = (argObj, argArr) => _.pick(argObj, argArr);

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
  fromKey = "from",
  toKey = "to",
  isLowerCase = true
) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach((array) => {
      if (!isNotEmpty(array[fromKey])) return;
      const key = isLowerCase
        ? array[fromKey].toLowerCase().trim()
        : array[fromKey].trim();

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
const getHashFromArray = (
  arrays,
  fromKey = "from",
  toKey = "to",
  isLowerCase = true
) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach((array) => {
      if (!isNotEmpty(array[fromKey])) return;
      hashMap[isLowerCase ? array[fromKey].toLowerCase() : array[fromKey]] =
        array[toKey];
    });
  }
  return hashMap;
};

/**
 * @param  {} timestamp
 * @param  {} return iso format of date
 */
const toIso = (timestamp) => {
  return new Date(timestamp).toISOString();
};

// function to flatten a json
function flattenJson(data) {
  const result = {};
  let l;

  // a recursive function to loop through the array of the data
  function recurse(cur, prop) {
    let i;
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (i = 0, l = cur.length; i < l; i += 1) {
        recurse(cur[i], `${prop}[${i}]`);
      }
      if (l === 0) {
        result[prop] = [];
      }
    } else {
      let isEmptyFlag = true;
      Object.keys(cur).forEach((key) => {
        isEmptyFlag = false;
        recurse(cur[key], prop ? `${prop}.${key}` : key);
      });
      if (isEmptyFlag && prop) result[prop] = {};
    }
  }

  recurse(data, "");
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
  if (externalIdArray) {
    externalIdArray.forEach((extIdObj) => {
      if (extIdObj.type === type) {
        destinationExternalId = extIdObj.id;
      }
    });
  }
  return destinationExternalId;
}

function getIntgCommonNames(displayName, name) {
  const cNames = {};
  cNames[name] = name;

  const displayNameSanitized = displayName.toLowerCase().trim();
  // Add the sanitized display name
  cNames[displayNameSanitized] = name;

  const words = displayNameSanitized.split(" ");

  cNames[words.join("_")] = name;
  cNames[words.join("")] = name;

  return cNames;
}

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
  isDefined,
  isNotEmpty,
  isNotNull,
  isDefinedAndNotNull,
  isDefinedAndNotNullAndNotEmpty,
  isBlank,
  pick,
  getIntgCommonNames,
};
