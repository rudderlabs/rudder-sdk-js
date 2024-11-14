import get from 'get-value';
import { v4 as uuid } from '@lukeed/uuid';
import { v4 as uuidSecure } from '@lukeed/uuid/secure';
import { isDefined } from '@rudderstack/analytics-js-common/utilities/checks';
import { logger } from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';

/**
 * Utility method to remove '/' at the end of URL
 * @param {*} inURL
 */
function removeTrailingSlashes(inURL) {
  return inURL && inURL.endsWith('/') ? inURL.replace(/\/+$/, '') : inURL;
}

/**
 *
 * Utility function for UUID generation
 * @returns
 */
function generateUUID() {
  if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
    return uuidSecure();
  }

  return uuid();
}

function getCurrency(val) {
  if (!val) {
    return null;
  }

  if (typeof val === 'number') {
    return val;
  }

  if (typeof val === 'string') {
    const parsedValue = parseFloat(val.replace(/\$/g, ''));

    if (!Number.isNaN(parsedValue)) {
      return parsedValue;
    }
  }

  return null;
}

function getRevenue(properties, eventName) {
  let { revenue } = properties;
  const { total } = properties;
  const orderCompletedRegExp = /^[ _]?completed[ _]?order[ _]?|^[ _]?order[ _]?completed[ _]?$/i;

  // it's always revenue, unless it's called during an order completion.
  if (!revenue && eventName && eventName.match(orderCompletedRegExp)) {
    revenue = total;
  }

  return getCurrency(revenue);
}

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
    default:
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val === Object(val)) return 'object';

  return typeof val;
}

function compact(value) {
  return value == null;
}

/**
 * particular case when rejecting an array
 * @param  {} arr
 * @param  {} fn
 */
const rejectArray = (arr, fn) => arr.filter((value, index) => !fn(value, index));

/**
 * Rejecting null from any object other than arrays
 * @param  {} obj
 * @param  {} fn
 *
 */
const rejectObject = (obj, fn) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (!fn(value, key)) {
      acc[key] = value;
    }
    return acc;
  }, {});

/**
 * reject all null values from array/object
 * @param  {} obj
 * @param  {} fn
 */
function rejectArr(obj, fn) {
  fn = fn || compact;
  return type(obj) === 'array' ? rejectArray(obj, fn) : rejectObject(obj, fn);
}

/* ------- Start FlattenJson -----------
 * This function flatten given json object to single level.
 * So if there is nested object or array, all will appear in first level properties of an object.
 * Following is case we are handling in this function ::
 * condition 1: String
 * condition 2: Array
 * condition 3: Nested object
 */
function recurse(cur, prop, result, visited = new Set()) {
  const res = result;

  const processArray = () => {
    const l = cur.length;
    for (let i = 0; i < l; i += 1) {
      recurse(cur[i], prop ? `${prop}.${i}` : `${i}`, res, visited);
    }
    if (l === 0) res[prop] = [];
  };

  const processObject = () => {
    let isEmpty = true;
    Object.keys(cur).forEach(key => {
      isEmpty = false;
      recurse(cur[key], prop ? `${prop}.${key}` : key, res, visited);
    });
    if (isEmpty) res[prop] = {};
  };

  if (visited.has(cur)) {
    res[prop] = '[Circular Reference]';
    return result;
  }

  visited.add(cur);

  if (Object(cur) !== cur) {
    res[prop] = cur;
  } else if (Array.isArray(cur)) {
    processArray();
  } else {
    processObject();
  }

  visited.delete(cur);
  return res;
}

function flattenJsonPayload(data, property = '') {
  return recurse(data, property, {});
}
/* ------- End FlattenJson ----------- */
/**
 *
 * @param {*} message
 * @param {*} dest
 * @param {*} keys
 * @param {*} exclusionFields
 * Extract fields from message with exclusions
 * Pass the keys of message for extraction and
 * exclusion fields to exclude and the payload to map into
 * -----------------Example-------------------
 * extractCustomFields(message,payload,["traits", "context.traits", "properties"], "email",
 * ["firstName",
 * "lastName",
 * "phone",
 * "title",
 * "organization",
 * "city",
 * "region",
 * "country",
 * "zip",
 * "image",
 * "timezone"])
 * -------------------------------------------
 * The above call will map the fields other than the
 * exclusion list from the given keys to the destination payload
 *
 */

function extractCustomFields(message, dest, keys, exclusionFields) {
  const mappingKeys = [];
  const destination = dest || {};
  if (Array.isArray(keys)) {
    keys.forEach(key => {
      const messageContext = get(message, key);
      if (messageContext) {
        Object.keys(messageContext).forEach(k => {
          if (!exclusionFields.includes(k)) mappingKeys.push(k);
        });
        mappingKeys.forEach(mappingKey => {
          if (!(typeof messageContext[mappingKey] === 'undefined')) {
            destination[mappingKey] = get(messageContext, mappingKey);
          }
        });
      }
    });
  } else if (keys === 'root') {
    Object.keys(message).forEach(k => {
      if (!exclusionFields.includes(k)) mappingKeys.push(k);
    });
    mappingKeys.forEach(mappingKey => {
      if (!(typeof message[mappingKey] === 'undefined')) {
        destination[mappingKey] = get(message, mappingKey);
      }
    });
  } else {
    logger.debug('unable to parse keys');
  }
  return destination;
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
    state:
      get(message, 'context.traits.state') ||
      get(message, 'context.traits.State') ||
      get(message, 'context.traits.address.state') ||
      get(message, 'context.traits.address.State'),
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
    postalCode:
      get(message, 'context.traits.postalCode') ||
      get(message, 'context.traits.postalcode') ||
      get(message, 'context.traits.postal_code') ||
      get(message, 'context.traits.address.postalCode') ||
      get(message, 'context.traits.address.postal_code') ||
      get(message, 'context.traits.address.postalcode'),
  };

  if (!get(traitsValue, 'name') && get(traitsValue, 'firstName') && get(traitsValue, 'lastName')) {
    traitsValue.name = `${get(traitsValue, 'firstName')} ${get(traitsValue, 'lastName')}`;
  }
  return traitsValue;
}

/**
 * To check if a variable is storing object or not
 */
const isObject = obj => type(obj) === 'object';

/**
 * Returns true for empty object {}
 * @param {*} obj
 * @returns
 */
const isEmptyObject = obj => {
  if (!obj) {
    logger.warn('input is undefined or null');
    return true;
  }
  return Object.keys(obj).length === 0;
};

/**
 * To check if a variable is storing array or not
 */
const isArray = obj => type(obj) === 'array';

const isNotNull = x => x !== null;
const isDefinedAndNotNull = x => isDefined(x) && isNotNull(x);

const getDataFromSource = (src, dest, properties) => {
  const data = {};
  if (isArray(src)) {
    for (const element of src) {
      if (properties[element]) {
        data[dest] = properties[element];
        if (data) {
          // return only if the value is valid.
          // else look for next possible source in precedence
          return data;
        }
      }
    }
  } else if (typeof src === 'string' && properties[src]) {
    data[dest] = properties[src];
  }
  return data;
};

/**
 * This method handles the operations between two keys from the sourceKeys. One of the possible
 * Use case is to calculate the value from the "price" and "quantity"
 * Definition of the operation object is as follows
 * {
 *    "operation": "multiplication",
 *    "args": [
 *      {
 *        "sourceKeys": "properties.price"
 *      },
 *      {
 *        "sourceKeys": "properties.quantity",
 *        "defaultVal": 1
 *      }
 *    ]
 *  }
 *  Supported operations are "addition", "multiplication"
 * @param {*} param0
 * @returns
 */
const handleSourceKeysOperation = ({ message, operationObject }) => {
  const { operation, args } = operationObject;

  // populate the values from the arguments
  // in the same order it is populated
  const argValues = args.map(arg => {
    const { sourceKeys, defaultVal } = arg;
    const val = get(message, sourceKeys);
    if (val || val === false || val === 0) {
      return val;
    }
    return defaultVal;
  });

  // quick sanity check for the undefined values in the list.
  // if there is any undefined values, return null
  // without going further for operations
  const isAllDefined = argValues.every(value => isDefinedAndNotNull(value));
  if (!isAllDefined) {
    return null;
  }

  // start handling operations
  let result = null;
  switch (operation) {
    case 'multiplication':
      result = 1;
      // eslint-disable-next-line no-restricted-syntax
      for (const v of argValues) {
        if (typeof v === 'number') {
          result *= v;
        } else {
          // if there is a non number argument simply return null
          // non numbers can't be operated arithmatically
          return null;
        }
      }
      return result.toFixed(2);
    case 'addition':
      result = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const v of argValues) {
        if (typeof v === 'number') {
          result += v;
        } else {
          // if there is a non number argument simply return null
          // non numbers can't be operated arithmatically
          return null;
        }
      }
      return result.toFixed(2);
    default:
      return null;
  }
};

/**
 * Handle type and format
 * @param {*} formattedVal
 * @param {*} formattingType
 * @returns
 */
const formatValues = (formattedVal, formattingType) => {
  let curFormattedVal = formattedVal;

  const formattingFunctions = {
    jsonStringify: () => {
      curFormattedVal = JSON.stringify(formattedVal);
    },
    jsonStringifyOnObject: () => {
      if (typeof formattedVal !== 'string') {
        curFormattedVal = JSON.stringify(formattedVal);
      }
    },
    toString: () => {
      curFormattedVal = String(formattedVal);
    },
    toNumber: () => {
      curFormattedVal = Number(formattedVal);
    },
    toFloat: () => {
      curFormattedVal = parseFloat(formattedVal);
    },
    toInt: () => {
      curFormattedVal = parseInt(formattedVal, 10);
    },
    toLower: () => {
      curFormattedVal = formattedVal.toString().toLowerCase();
    },
    trim: () => {
      if (typeof formattedVal === 'string') {
        curFormattedVal = formattedVal.trim();
      }
    },
    IsBoolean: () => {
      curFormattedVal = true;
      if (!(typeof formattedVal === 'boolean')) {
        logger.debug('Boolean value missing, so dropping it');
        curFormattedVal = false;
      }
    },
  };

  if (formattingType in formattingFunctions) {
    const formattingFunction = formattingFunctions[formattingType];
    formattingFunction();
  }

  return curFormattedVal;
};

/**
 * format the value as per the metadata values
 * Expected metadata keys are: (according to precedence)
 * type, typeFormat: expected data type
 * @param {*} value
 * @param {*} metadata
 * @returns
 */
const handleMetadataForValue = (value, metadata) => {
  if (!metadata) {
    return value;
  }

  const { type: valFormat, defaultValue } = metadata;

  // if value is null and defaultValue is supplied - use that
  if (!isDefinedAndNotNull(value)) {
    return defaultValue || value;
  }

  // we've got a correct value. start processing
  let formattedVal = value;
  if (valFormat) {
    if (Array.isArray(valFormat)) {
      valFormat.forEach(eachType => {
        formattedVal = formatValues(formattedVal, eachType);
      });
    } else {
      formattedVal = formatValues(formattedVal, valFormat);
    }
  }

  return formattedVal;
};

/**
 * Finds and returns the value of key from message
 * @param {*} message
 * @param {*} sourceKeys
 * @returns
 */
const getValueFromMessage = (message, sourceKeys) => {
  if (Array.isArray(sourceKeys) && sourceKeys.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const sourceKey of sourceKeys) {
      let val;
      if (typeof sourceKey === 'object') {
        val = handleSourceKeysOperation({
          message,
          operationObject: sourceKey,
        });
      } else {
        val = get(message, sourceKey);
      }
      if (val || val === false || val === 0) {
        // return only if the value is valid.
        // else look for next possible source in precedence
        return val;
      }
    }
    return null;
  }

  if (typeof sourceKeys === 'object') {
    // if the sourceKey is an object we expect it to be a operation
    return handleSourceKeysOperation({ message, operationObject: sourceKeys });
  }

  return get(message, sourceKeys);
};

/**
 * Using this function we can create a payload from a mapping object.
 * @param {*} message = {
     traits:{
       name: "abcd efgh",
       address: {
        city: "xyz"
       }
     }
   }
 * @param {*} mapper = [
     {
       destKey: "userName",
       sourceKeys: "traits.name",
     },
     {
       destKey: "city",
       sourceKeys: "traits.address.city",
     },
   ]
 * @returns {
     userName : "abcd efgh",
     city : "xyz"
  }
 */
const constructPayload = (message, mapper) => {
  const payload = {};
  // Mapping JSON should be an array
  if (Array.isArray(mapper) && mapper.length > 0) {
    mapper.forEach(mapping => {
      const { sourceKeys, destKey, metadata } = mapping;
      const value = handleMetadataForValue(getValueFromMessage(message, sourceKeys), metadata);
      if ((value || value === 0 || value === false) && destKey) {
        // set the value only if correct
        payload[destKey] = value;
      }
    });
  }
  return payload;
};

export {
  generateUUID,
  getRevenue,
  rejectArr,
  type,
  flattenJsonPayload,
  extractCustomFields,
  getDefinedTraits,
  isObject,
  isArray,
  isDefinedAndNotNull,
  getDataFromSource,
  removeTrailingSlashes,
  constructPayload,
  isEmptyObject,
};
