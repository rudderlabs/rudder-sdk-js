// import * as XMLHttpRequestNode from "Xmlhttprequest";
import get from 'get-value';
import { v4 as uuid } from '@lukeed/uuid';
import { v4 as uuidSecure } from '@lukeed/uuid/secure';
import logger from './logUtil';
import { commonNames } from './integration_cname';
import { clientToServerNames } from './client_server_name';
import {
  CONFIG_URL,
  RESERVED_KEYS,
  DEFAULT_REGION,
  RESIDENCY_SERVERS,
  SUPPORTED_CONSENT_MANAGERS,
  FAILED_REQUEST_ERR_MSG_PREFIX
} from './constants';
import { handleError } from './errorHandler';

/**
 *
 * Utility method for excluding null and empty values in JSON
 * @param {*} key
 * @param {*} value
 * @returns
 */
function replacer(key, value) {
  if (value === null || value === undefined) {
    return undefined;
  }
  return value;
}

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

/**
 *
 * Utility function to get current time (formatted) for including in sent_at field
 * @returns
 */
function getCurrentTimeFormatted() {
  const curDateTime = new Date().toISOString();
  // Keeping same as iso string
  /* let curDate = curDateTime.split("T")[0];
  let curTimeExceptMillis = curDateTime
    .split("T")[1]
    .split("Z")[0]
    .split(".")[0];
  let curTimeMillis = curDateTime.split("Z")[0].split(".")[1];
  return curDate + " " + curTimeExceptMillis + "+" + curTimeMillis; */
  return curDateTime;
}

/**
 *
 * Utility function to retrieve configuration JSON from server
 * @param {*} url
 * @param {*} wrappers
 * @param {*} isLoaded
 * @param {*} callback
 */
function getJSON(url, wrappers, isLoaded, callback) {
  // server-side integration, XHR is node module

  const xhr = new XMLHttpRequest();

  xhr.open('GET', url, false);
  xhr.onload = function () {
    const { status } = xhr;
    if (status == 200) {
      // logger.debug("status 200");
      callback(null, xhr.responseText, wrappers, isLoaded);
    } else {
      callback(status);
    }
  };
  xhr.send();
}

/**
 *
 * Utility function to retrieve configuration JSON from server
 * @param {*} context
 * @param {*} url
 * @param {*} callback
 */
function getJSONTrimmed(context, url, writeKey, callback) {
  // server-side integration, XHR is node module
  const cb_ = callback.bind(context);

  const xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.setRequestHeader(
    'Authorization',
    `Basic ${btoa(`${writeKey}:`)}`,
    // `Basic ${Buffer.from(`${writeKey}:`).toString("base64")}`
  );

  xhr.onload = function () {
    const { status } = xhr;
    if (status == 200) {
      // logger.debug("status 200 " + "calling callback");
      cb_(200, xhr.responseText);
    } else {
      handleError(new Error(`${FAILED_REQUEST_ERR_MSG_PREFIX} ${status} for url: ${url}`));
      cb_(status);
    }
  };
  xhr.send();
}

function getCurrency(val) {
  if (!val) return;
  if (typeof val === 'number') {
    return val;
  }
  if (typeof val !== 'string') {
    return;
  }

  val = val.replace(/\$/g, '');
  val = parseFloat(val);

  if (!isNaN(val)) {
    return val;
  }
}

function getRevenue(properties, eventName) {
  let { revenue } = properties;
  const orderCompletedRegExp = /^[ _]?completed[ _]?order[ _]?|^[ _]?order[ _]?completed[ _]?$/i;

  // it's always revenue, unless it's called during an order completion.
  if (!revenue && eventName && eventName.match(orderCompletedRegExp)) {
    revenue = properties.total;
  }

  return getCurrency(revenue);
}

function transformNamesCore(integrationObject, namesObj) {
  Object.keys(integrationObject).forEach((key) => {
    if (integrationObject.hasOwnProperty(key)) {
      if (namesObj[key]) {
        integrationObject[namesObj[key]] = integrationObject[key];
      }
      if (key != 'All') {
        // delete user supplied keys except All and if except those where oldkeys are not present or oldkeys are same as transformed keys
        if (namesObj[key] != undefined && namesObj[key] != key) {
          delete integrationObject[key];
        }
      }
    }
  });
}

/**
 *
 *
 * @param {*} integrationObject
 */
function transformToRudderNames(integrationObject) {
  transformNamesCore(integrationObject, commonNames);
}

function transformToServerNames(integrationObject) {
  transformNamesCore(integrationObject, clientToServerNames);
}

/**
 *
 * @param {*} sdkSuppliedIntegrations
 * @param {*} configPlaneEnabledIntegrations
 */
function findAllEnabledDestinations(sdkSuppliedIntegrations, configPlaneEnabledIntegrations) {
  const enabledList = [];
  if (!configPlaneEnabledIntegrations || configPlaneEnabledIntegrations.length === 0) {
    return enabledList;
  }
  let allValue = true;
  if (sdkSuppliedIntegrations.All !== undefined) {
    allValue = sdkSuppliedIntegrations.All;
  }
  const intgData = [];
  if (typeof configPlaneEnabledIntegrations[0] === 'string') {
    configPlaneEnabledIntegrations.forEach((intg) => {
      intgData.push({
        intgName: intg,
        intObj: intg,
      });
    });
  } else if (typeof configPlaneEnabledIntegrations[0] === 'object') {
    configPlaneEnabledIntegrations.forEach((intg) => {
      intgData.push({
        intgName: intg.name,
        intObj: intg,
      });
    });
  }

  intgData.forEach(({ intgName, intObj }) => {
    if (!allValue) {
      // All false ==> check if intg true supplied
      if (
        sdkSuppliedIntegrations[intgName] != undefined &&
        sdkSuppliedIntegrations[intgName] == true
      ) {
        enabledList.push(intObj);
      }
    } else {
      // All true ==> intg true by default
      let intgValue = true;
      // check if intg false supplied
      if (
        sdkSuppliedIntegrations[intgName] != undefined &&
        sdkSuppliedIntegrations[intgName] == false
      ) {
        intgValue = false;
      }
      if (intgValue) {
        enabledList.push(intObj);
      }
    }
  });

  return enabledList;
}

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

function compact(value) {
  return value == null;
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
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val === Object(val)) return 'object';

  return typeof val;
}

function getUserProvidedConfigUrl(configUrl, defConfigUrl) {
  let url = configUrl;
  if (url.indexOf('sourceConfig') === -1) {
    url = `${removeTrailingSlashes(url)}/sourceConfig/`;
  }
  url = url.slice(-1) === '/' ? url : `${url}/`;
  const defQueryParams = defConfigUrl.split('?')[1];
  const urlSplitItems = url.split('?');
  if (urlSplitItems.length > 1 && urlSplitItems[1] !== defQueryParams) {
    url = `${urlSplitItems[0]}?${defQueryParams}`;
  } else {
    url = `${url}?${defQueryParams}`;
  }
  return url;
}
/**
 * Check if a reserved keyword is present in properties/traits
 * @param {*} properties
 * @param {*} reservedKeywords
 * @param {*} type
 */
function checkReservedKeywords(message, messageType) {
  //  properties, traits, contextualTraits are either undefined or object
  const { properties, traits } = message;
  if (properties) {
    Object.keys(properties).forEach((property) => {
      if (RESERVED_KEYS.indexOf(property.toLowerCase()) >= 0) {
        logger.error(
          `Warning! : Reserved keyword used in properties--> ${property} with ${messageType} call`,
        );
      }
    });
  }
  if (traits) {
    Object.keys(traits).forEach((trait) => {
      if (RESERVED_KEYS.indexOf(trait.toLowerCase()) >= 0) {
        logger.error(
          `Warning! : Reserved keyword used in traits--> ${trait} with ${messageType} call`,
        );
      }
    });
  }
  const contextualTraits = message.context.traits;
  if (contextualTraits) {
    Object.keys(contextualTraits).forEach((contextTrait) => {
      if (RESERVED_KEYS.indexOf(contextTrait.toLowerCase()) >= 0) {
        logger.error(
          `Warning! : Reserved keyword used in traits --> ${contextTrait} with ${messageType} call`,
        );
      }
    });
  }
}

/* ------- Start FlattenJson -----------
 * This function flatten given json object to single level.
 * So if there is nested object or array, all will appear in first level properties of an object.
 * Following is case we are handling in this function ::
 * condition 1: String
 * condition 2: Array
 * condition 3: Nested object
 */
function recurse(cur, prop, result) {
  const res = result;
  if (Object(cur) !== cur) {
    res[prop] = cur;
  } else if (Array.isArray(cur)) {
    const l = cur.length;
    for (let i = 0; i < l; i += 1) recurse(cur[i], prop ? `${prop}.${i}` : `${i}`, res);
    if (l === 0) res[prop] = [];
  } else {
    let isEmpty = true;
    Object.keys(cur).forEach((key) => {
      isEmpty = false;
      recurse(cur[key], prop ? `${prop}.${key}` : key, res);
    });
    if (isEmpty) res[prop] = {};
  }
  return res;
}

function flattenJsonPayload(data, property = '') {
  return recurse(data, property, {});
}
/* ------- End FlattenJson ----------- */
/**
 *
 * @param {*} message
 * @param {*} destination
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

function extractCustomFields(message, destination, keys, exclusionFields) {
  keys.map((key) => {
    const messageContext = get(message, key);
    if (messageContext) {
      const objKeys = [];
      Object.keys(messageContext).map((k) => {
        if (exclusionFields.indexOf(k) < 0) {
          objKeys.push(k);
        }
      });
      objKeys.map((k) => {
        if (!(typeof messageContext[k] === 'undefined')) {
          if (destination) {
            destination[k] = get(messageContext, k);
          } else {
            destination = {
              k: get(messageContext, k),
            };
          }
        }
      });
    }
  });
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
  };

  if (!get(traitsValue, 'name') && get(traitsValue, 'firstName') && get(traitsValue, 'lastName')) {
    traitsValue.name = `${get(traitsValue, 'firstName')} ${get(traitsValue, 'lastName')}`;
  }
  return traitsValue;
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

const isDefined = (x) => x !== undefined;
const isNotNull = (x) => x !== null;
const isDefinedAndNotNull = (x) => isDefined(x) && isNotNull(x);

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

const getConfigUrl = (writeKey) => {
  return CONFIG_URL.concat(CONFIG_URL.includes('?') ? '&' : '?').concat(
    writeKey ? `writeKey=${writeKey}` : '',
  );
};

const getSDKUrlInfo = () => {
  const scripts = document.getElementsByTagName('script');
  let sdkURL;
  let isStaging = false;
  for (let i = 0; i < scripts.length; i += 1) {
    const curScriptSrc = removeTrailingSlashes(scripts[i].getAttribute('src'));
    if (curScriptSrc) {
      const urlMatches = curScriptSrc.match(/^.*rudder-analytics(-staging)?(\.min)?\.js$/);
      if (urlMatches) {
        sdkURL = curScriptSrc;
        isStaging = urlMatches[1] !== undefined;
        break;
      }
    }
  }
  return { sdkURL, isStaging };
};

/**
 * Using this function we can create a payload from a mapping object.
 * @param {*} object = {
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
const constructPayload = (object, mapper) => {
  const payload = {};
  if (object)
    mapper.forEach((element) => {
      if (!Array.isArray(element.sourceKeys)) {
        payload[element.destKey] = get(object, element.sourceKeys);
      } else {
        for (let i = 0; i < element.sourceKeys.length; i += 1) {
          if (get(object, element.sourceKeys[i])) {
            payload[element.destKey] = get(object, element.sourceKeys[i]);
            break;
          }
        }
      }
    });
  return payload;
};

const countDigits = (number) => {
  return number ? number.toString().length : 0;
};

/**
 * A function to convert non-string IDs to string format
 * @param {any} id
 * @returns
 */
const getStringId = (id) => {
  return typeof id === 'string' || typeof id === 'undefined' || id === null
    ? id
    : JSON.stringify(id);
};

/**
 * A function to validate and return Residency server input
 * @returns string/undefined
 */
const getResidencyServer = (options) => {
  const region = options ? options.residencyServer : undefined;
  if (region) {
    if (typeof region !== 'string' || !RESIDENCY_SERVERS.includes(region.toUpperCase())) {
      logger.error('Invalid residencyServer input');
      return undefined;
    }
    return region.toUpperCase();
  }
  return undefined;
};

const isValidServerUrl = (serverUrl) => {
  if (!serverUrl || typeof serverUrl !== 'string' || serverUrl.trim().length === 0) {
    return false;
  }
  return true;
};

/**
 * A function to get url from source config response
 * @param {array} urls    An array of objects containing urls
 * @returns
 */
const getDefaultUrlofRegion = (urls) => {
  let url;
  if (Array.isArray(urls) && urls.length) {
    const obj = urls.find((elem) => elem.default === true);
    if (obj && isValidServerUrl(obj.url)) {
      return obj.url;
    }
  }
  return url;
};

/**
 * A function to determine the dataPlaneUrl
 * @param {Object} dataPlaneUrls An object containing dataPlaneUrl for different region
 * @returns string
 */
const resolveDataPlaneUrl = (response, serverUrl, options) => {
  try {
    const dataPlanes = response.source.dataplanes || {};
    // Check if dataPlanes object is present in source config
    if (Object.keys(dataPlanes).length) {
      const inputRegion = getResidencyServer(options);
      const regionUrlArr = dataPlanes[inputRegion] || dataPlanes[DEFAULT_REGION];

      if (regionUrlArr) {
        const defaultUrl = getDefaultUrlofRegion(regionUrlArr);
        if (defaultUrl) {
          return defaultUrl;
        }
      }
    }
    // return the dataPlaneUrl provided in load API(if available)
    if (isValidServerUrl(serverUrl)) {
      return serverUrl;
    }
    // return the default dataPlaneUrl
    // return DEFAULT_DATAPLANE_URL; // we do not want to divert the events to hosted data plane url

    // Throw error if correct data plane url is not provided
    throw Error('Unable to load the SDK due to invalid data plane url');
  } catch (e) {
    throw Error(e);
  }
};

/**
 * Function to return the state of consent management based on config passed in load options
 * @param {Object} cookieConsentOptions
 * @returns
 */
const fetchCookieConsentState = (cookieConsentOptions) => {
  let isEnabled = false;
  // eslint-disable-next-line consistent-return
  Object.keys(cookieConsentOptions).forEach((e) => {
    const isSupportedAndEnabled =
      SUPPORTED_CONSENT_MANAGERS.includes(e) &&
      typeof cookieConsentOptions[e].enabled === 'boolean' &&
      cookieConsentOptions[e].enabled === true;

    if (isSupportedAndEnabled) {
      isEnabled = true;
    }
  });
  return isEnabled;
};

const parseQueryString = (url)=>{
  const result = {};
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.forEach((value, qParam) => {
        result[qParam] = value;
    });
  } catch (error) {
    // Do nothing
  }
  return result;
}

export {
  replacer,
  generateUUID,
  getCurrentTimeFormatted,
  getJSONTrimmed,
  getJSON,
  getRevenue,
  getUserProvidedConfigUrl,
  findAllEnabledDestinations,
  transformToRudderNames,
  transformToServerNames,
  rejectArr,
  type,
  flattenJsonPayload,
  checkReservedKeywords,
  extractCustomFields,
  getDefinedTraits,
  isObject,
  isArray,
  isDefinedAndNotNull,
  getDataFromSource,
  commonNames,
  removeTrailingSlashes,
  constructPayload,
  getConfigUrl,
  getSDKUrlInfo,
  get,
  countDigits,
  getStringId,
  resolveDataPlaneUrl,
  fetchCookieConsentState,
  parseQueryString,
};
