import { v4 as uuid } from '@lukeed/uuid';
import { v4 as uuidSecure } from '@lukeed/uuid/secure';
import { commonNames } from '@rudderstack/analytics-js-common/v1.1/utils/integration_cname';
import { clientToServerNames } from '@rudderstack/analytics-js-common/v1.1/utils/client_server_name';
import { logger } from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { FAILED_REQUEST_ERR_MSG_PREFIX } from '@rudderstack/analytics-js-common/v1.1/utils/constants';
import { handleError } from '@rudderstack/analytics-js-common/v1.1/utils/errorHandler';
import {
  CONFIG_URL,
  RESERVED_KEYS,
  DEFAULT_REGION,
  RESIDENCY_SERVERS,
  SUPPORTED_CONSENT_MANAGERS,
} from './constants';

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
    const { status, responseText } = xhr;
    if (status === 200) {
      // logger.debug("status 200");
      callback(null, responseText, wrappers, isLoaded);
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
  const cb = callback.bind(context);

  const xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.setRequestHeader(
    'Authorization',
    `Basic ${btoa(`${writeKey}:`)}`,
    // `Basic ${Buffer.from(`${writeKey}:`).toString("base64")}`
  );

  // eslint-disable-next-line func-names
  xhr.onload = function () {
    const { status, responseText } = xhr;
    if (status === 200) {
      // logger.debug("status 200 " + "calling callback");
      cb(200, responseText);
    } else {
      handleError(new Error(`${FAILED_REQUEST_ERR_MSG_PREFIX} ${status} for url: ${url}`));
      cb(status);
    }
  };
  xhr.send();
}

function transformNamesCore(integrationObject, namesObj) {
  Object.keys(integrationObject).forEach(key => {
    // eslint-disable-next-line no-prototype-builtins
    if (integrationObject.hasOwnProperty(key)) {
      if (namesObj[key]) {
        integrationObject[namesObj[key]] = integrationObject[key];
      }
      if (
        key !== 'All' && // delete user supplied keys except All and if except those where oldkeys are not present or oldkeys are same as transformed keys
        namesObj[key] !== undefined &&
        namesObj[key] !== key
      ) {
        delete integrationObject[key];
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
    configPlaneEnabledIntegrations.forEach(intg => {
      intgData.push({
        intgName: intg,
        intObj: intg,
      });
    });
  } else if (typeof configPlaneEnabledIntegrations[0] === 'object') {
    configPlaneEnabledIntegrations.forEach(intg => {
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
        sdkSuppliedIntegrations[intgName] !== undefined &&
        Boolean(sdkSuppliedIntegrations[intgName]) === true
      ) {
        enabledList.push(intObj);
      }
    } else {
      // All true ==> intg true by default
      let intgValue = true;
      // check if intg false supplied
      if (
        sdkSuppliedIntegrations[intgName] !== undefined &&
        Boolean(sdkSuppliedIntegrations[intgName]) === false
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
 * @param {*} message
 * @param {*} messageType
 */
function checkReservedKeywords(message, messageType) {
  //  properties, traits, contextualTraits are either undefined or object
  const { properties, traits, context } = message;
  if (properties) {
    Object.keys(properties).forEach(property => {
      if (RESERVED_KEYS.indexOf(property.toLowerCase()) >= 0) {
        logger.error(
          `Warning! : Reserved keyword used in properties--> ${property} with ${messageType} call`,
        );
      }
    });
  }
  if (traits) {
    Object.keys(traits).forEach(trait => {
      if (RESERVED_KEYS.indexOf(trait.toLowerCase()) >= 0) {
        logger.error(
          `Warning! : Reserved keyword used in traits--> ${trait} with ${messageType} call`,
        );
      }
    });
  }
  const contextualTraits = context.traits;
  if (contextualTraits) {
    Object.keys(contextualTraits).forEach(contextTrait => {
      if (RESERVED_KEYS.indexOf(contextTrait.toLowerCase()) >= 0) {
        logger.error(
          `Warning! : Reserved keyword used in traits --> ${contextTrait} with ${messageType} call`,
        );
      }
    });
  }
}

const isDefined = x => x !== undefined;
const isNotNull = x => x !== null;
const isDefinedAndNotNull = x => isDefined(x) && isNotNull(x);

const getConfigUrl = writeKey =>
  CONFIG_URL.concat(CONFIG_URL.includes('?') ? '&' : '?').concat(
    writeKey ? `writeKey=${writeKey}` : '',
  );

const getSDKUrlInfo = () => {
  const scripts = document.getElementsByTagName('script');
  let sdkURL;
  let isStaging = false;
  // eslint-disable-next-line unicorn/no-for-loop
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

const countDigits = number => (number ? number.toString().length : 0);

/**
 * A function to convert non-string IDs to string format
 * @param {any} id
 * @returns
 */
const getStringId = id =>
  typeof id === 'string' || typeof id === 'undefined' || id === null ? id : JSON.stringify(id);

/**
 * A function to validate and return Residency server input
 * @returns string/undefined
 */
const getResidencyServer = options => {
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

const isValidServerUrl = serverUrl => typeof serverUrl === 'string' && serverUrl.trim().length > 0;

/**
 * A function to get url from source config response
 * @param {array} urls    An array of objects containing urls
 * @returns
 */
const getDefaultUrlofRegion = urls => {
  let url;
  if (Array.isArray(urls) && urls.length > 0) {
    const obj = urls.find(elem => elem.default === true);
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
    if (Object.keys(dataPlanes).length > 0) {
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
const fetchCookieConsentState = cookieConsentOptions => {
  let isEnabled = false;
  // eslint-disable-next-line consistent-return
  Object.keys(cookieConsentOptions).forEach(e => {
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

const parseQueryString = url => {
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
};

export {
  generateUUID,
  getCurrentTimeFormatted,
  getJSONTrimmed,
  getJSON,
  getUserProvidedConfigUrl,
  findAllEnabledDestinations,
  transformToRudderNames,
  transformToServerNames,
  checkReservedKeywords,
  isDefinedAndNotNull,
  removeTrailingSlashes,
  getConfigUrl,
  getSDKUrlInfo,
  countDigits,
  getStringId,
  resolveDataPlaneUrl,
  fetchCookieConsentState,
  parseQueryString,
};
