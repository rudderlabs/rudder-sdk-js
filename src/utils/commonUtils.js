import _isUndefined from 'lodash.isundefined';
import _isEmpty from 'lodash.isempty';
import _pickBy from 'lodash.pickby';
import _pick from 'lodash.pick';
import _toString from 'lodash.tostring';
import get from 'get-value';

const isDefined = (x) => !_isUndefined(x);
const isNotEmpty = (x) => !_isEmpty(x);
const isNotNull = (x) => x != null;
const isDefinedAndNotNull = (x) => isDefined(x) && isNotNull(x);
const isDefinedAndNotNullAndNotEmpty = (x) => isDefined(x) && isNotNull(x) && isNotEmpty(x);
const removeUndefinedValues = (obj) => _pickBy(obj, isDefined);
const removeNullValues = (obj) => _pickBy(obj, isNotNull);
const removeUndefinedAndNullValues = (obj) => _pickBy(obj, isDefinedAndNotNull);
const removeUndefinedAndNullAndEmptyValues = (obj) => _pickBy(obj, isDefinedAndNotNullAndNotEmpty);
const isBlank = (value) => _isEmpty(_toString(value));
const pick = (argObj, argArr) => _pick(argObj, argArr);

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
    arrays.forEach((array) => {
      if (!isNotEmpty(array[fromKey])) return;
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
    arrays.forEach((array) => {
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
  if (externalIdArray) {
    externalIdArray.forEach((extIdObj) => {
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
const isDefinedNotNullNotEmpty = (value) => {
  return !(
    value === undefined ||
    value === null ||
    Number.isNaN(value) ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

/**
 * check type of object incoming in the rejectArr function
 * @param  {} val
 */
function type(val) {
  switch (Object.prototype.toString.call(val)) {
    case '[object Function]':
      return 'function';
    case '[object Date]':
      return 'date';
    case '[object RegExp]':
      return 'regexp';
    case '[object Arguments]':
      return 'arguments';
    case '[object Array]':
      return 'array';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val === Object(val)) return 'object';

  return typeof val;
}

/**
 * To check if a variable is storing object or not
 */
const isObject = (obj) => {
  return type(obj) === 'object';
};

/**
 * To check if a variable is storing array or not
 */
const isArray = (obj) => {
  return type(obj) === 'array';
};

function compact(value) {
  return value == null;
}

/**
 * particular case when rejecting an array
 * @param  {} arr
 * @param  {} fn
 */
var rejectarray = function (arr, fn) {
  const ret = [];

  for (let i = 0; i < arr.length; ++i) {
    if (!fn(arr[i], i)) ret[ret.length] = arr[i];
  }

  return ret;
};

/**
 * Rejecting null from any object other than arrays
 * @param  {} obj
 * @param  {} fn
 *
 */
var rejectobject = function (obj, fn) {
  const ret = {};

  for (const k in obj) {
    if (obj.hasOwnProperty(k) && !fn(obj[k], k)) {
      ret[k] = obj[k];
    }
  }

  return ret;
};

/**
 * reject all null values from array/object
 * @param  {} obj
 * @param  {} fn
 */
function rejectArr(obj, fn) {
  fn = fn || compact;
  return type(obj) == 'array' ? rejectarray(obj, fn) : rejectobject(obj, fn);
}

/**
 *
 * @param {*} message
 *
 * Use get-value to retrieve defined traits from message traits
 */
function getDefinedTraits(message) {
  const traitsValue = {
    userId:
      get(message, 'userId') ||
      get(message, 'context.traits.userId') ||
      get(message, 'anonymousId'),
    userIdOnly: get(message, 'userId') || get(message, 'context.traits.userId'),
    email:
      get(message, 'context.traits.email') ||
      get(message, 'context.traits.Email') ||
      get(message, 'context.traits.E-mail'),
    phone: get(message, 'context.traits.phone') || get(message, 'context.traits.Phone'),
    firstName:
      get(message, 'context.traits.firstName') ||
      get(message, 'context.traits.firstname') ||
      get(message, 'context.traits.first_name'),
    lastName:
      get(message, 'context.traits.lastName') ||
      get(message, 'context.traits.lastname') ||
      get(message, 'context.traits.last_name'),
    name: get(message, 'context.traits.name') || get(message, 'context.traits.Name'),
    city:
      get(message, 'context.traits.city') ||
      get(message, 'context.traits.City') ||
      get(message, 'context.traits.address.city') ||
      get(message, 'context.traits.address.City'),
    country:
      get(message, 'context.traits.country') ||
      get(message, 'context.traits.Country') ||
      get(message, 'context.traits.address.country') ||
      get(message, 'context.traits.address.Country'),
  };

  if (!get(traitsValue, 'name') && get(traitsValue, 'firstName') && get(traitsValue, 'lastName')) {
    traitsValue.name = `${get(traitsValue, 'firstName')} ${get(traitsValue, 'lastName')}`;
  }
  return traitsValue;
}

const getDataFromSource = (src, dest, properties) => {
  const data = {};
  if (isArray(src)) {
    for (let index = 0; index < src.length; index += 1) {
      if (properties[src[index]]) {
        data[dest] = properties[src[index]];
        if (data) {
          // return only if the value is valid.
          // else look for next possible source in precedence
          return data;
        }
      }
    }
  } else if (typeof src === 'string') {
    if (properties[src]) {
      data[dest] = properties[src];
    }
  }
  return data;
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
  isDefined,
  isNotEmpty,
  isNotNull,
  isDefinedAndNotNull,
  isDefinedAndNotNullAndNotEmpty,
  isDefinedNotNullNotEmpty,
  isBlank,
  pick,
  type,
  getDefinedTraits,
  isObject,
  isArray,
  rejectArr,
  getDataFromSource,
};
