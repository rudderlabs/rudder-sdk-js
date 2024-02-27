/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
import get from 'get-value';
import { DISPLAY_NAME } from '@rudderstack/analytics-js-common/constants/integrations/Mixpanel/constants';
import Logger from '../../utils/logger';
import { getDefinedTraits, extractCustomFields } from '../../utils/utils';

const logger = new Logger(DISPLAY_NAME);

const keysToExtract = ['context.traits'];
const exclusionKeys = [
  'email',
  'E-mail',
  'Email',
  'phone',
  'Phone',
  'name',
  'Name',
  'lastName',
  'lastname',
  'last_name',
  'firstName',
  'firstname',
  'first_name',
];

const traitAliases = {
  created: '$created',
  email: '$email',
  firstName: '$first_name',
  lastName: '$last_name',
  lastSeen: '$last_seen',
  name: '$name',
  username: '$username',
  phone: '$phone',
};

/**
 * Removes a property from an object based on a given property path.
 *
 * @param {object} obj - The object from which the property needs to be removed.
 * @param {string} propertyPath - The path of the property to be removed, using dot notation.
 * @returns {undefined} - This function does not return anything.
 *
 * @example
 * const obj = {
 *   person: {
 *     name: 'John',
 *     age: 30,
 *     address: {
 *       city: 'New York',
 *       state: 'NY'
 *     }
 *   }
 * };
 *
 * unset(obj, 'person.address.city');
 *  Output: { person: { name: 'John', age: 30, address: { state: 'NY' } } }
 */
function unset(obj, propertyPath) {
  const keys = propertyPath.split('.');
  const lastKey = keys.pop();

  let current = obj;
  for (const key of keys) {
    if (current[key] === undefined || current[key] === null) {
      return; // Property path not valid, nothing to unset
    }
    current = current[key];
  }

  delete current[lastKey];
}

function filterSetOnceTraits(outgoingTraits, setOnceProperties) {
  // Create a copy of the original traits object
  const traitsCopy = { ...outgoingTraits };

  // Initialize setOnce object
  const setOnceEligible = {};

  // Step 1: find the k-v pairs of setOnceProperties in traits and contextTraits

  setOnceProperties.forEach(propertyPath => {
    const pathSegments = propertyPath.split('.');
    const propName = pathSegments[pathSegments.length - 1];

    if (Object.keys(traitsCopy).length > 0 && get(traitsCopy, propertyPath)) {
      setOnceEligible[propName] = get(traitsCopy, propertyPath);
      unset(traitsCopy, propertyPath);
    }
  });

  return {
    setTraits: traitsCopy,
    setOnce: setOnceEligible,
    email: outgoingTraits.email,
    username: outgoingTraits.username,
  };
}

const formatTraits = (message, setOnceProperties) => {
  const { email, firstName, lastName, phone, name } = getDefinedTraits(message);
  let outgoingTraits = {
    email,
    firstName,
    lastName,
    phone,
    name,
  };
  // Extract other K-V property from traits about user custom properties
  try {
    outgoingTraits = extractCustomFields(message, outgoingTraits, keysToExtract, exclusionKeys);
  } catch (err) {
    logger.error(`Error occured at extractCustomFields ${err}`);
  }
  // Extract setOnce K-V property from traits about user custom properties
  return filterSetOnceTraits(outgoingTraits, setOnceProperties);
  // return outgoingTraits;
};

const parseConfigArray = (arr, key) => {
  if (!arr) {
    logger.error('arr is undefined or null');
    return;
  }
  // eslint-disable-next-line consistent-return
  return arr.map(item => item[key]);
};

/**
 * Since Mixpanel doesn't support lists of objects, invert each list of objects to a set of lists of object properties.
 * Treats list transformation atomically, e.g. will only transform if EVERY item in list is an object
 *
 * @api private
 * @param {Object} props
 * @example
 * input: {products: [{sku: 32, revenue: 99}, {sku:2, revenue: 103}]}
 * output: {products_skus: [32, 2], products_revenues: [99, 103]}
 */
const inverseObjectArrays = input => {
  const response = input;
  Object.keys(input).forEach(key => {
    let markToDelete = false;
    if (Array.isArray(input[key])) {
      // [{sku: 32, revenue: 99}, {sku:2, revenue: 103}]
      const tempArray = input[key];
      tempArray.forEach(obj => {
        // operate if object encountered in array
        if (typeof obj === 'object') {
          // {sku: 32, revenue: 99}
          Object.entries(obj).forEach(k => {
            const attrKey = `${key}_${k[0]}s`;
            if (attrKey in response) response[attrKey].push(k[1]);
            else response[attrKey] = [k[1]];
          });
          markToDelete = true;
        }
      });
      if (markToDelete) delete response[key];
    }
  });
  return response;
};

const extractTraits = (traits, traitAliasesParam) => {
  const extractedTraits = traits;
  Object.keys(traitAliasesParam).forEach(key => {
    const value = traitAliasesParam[key];
    extractedTraits[value] = extractedTraits[key];
    delete extractedTraits[key];
  });
  return extractedTraits;
};

/**
 * Return union of two arrays
 *
 * @param {Array} x
 * @param {Array} y
 * @return {Array} res
 */
const unionArrays = (x, y) => {
  const res = new Set();
  // store items of each array as set entries to avoid duplicates
  x.forEach(value => {
    res.add(value);
  });
  y.forEach(value => {
    res.add(value);
  });
  return [...res];
};

/**
 * extend Mixpanel's special trait keys in the given `arr`.
 * @param {Array} arr
 * @return {Array}
 */
const extendTraits = arr => {
  const keys = [];
  Object.keys(traitAliases).forEach(key => {
    keys.push(key);
  });

  keys.forEach(key => {
    if (arr.indexOf(key) < 0) {
      arr.push(key);
    }
  });

  return arr;
};

/**
 * Map Special traits in the given `arr`.
 * From the TraitAliases for Mixpanel's special props
 *
 * @param {Array} arr
 * @return {Array}
 */
const mapTraits = arr => {
  const ret = [];

  arr.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(traitAliases, key)) {
      ret.push(traitAliases[key]);
    } else {
      ret.push(key);
    }
  });

  return ret;
};

const getConsolidatedPageCalls = config =>
  Object.prototype.hasOwnProperty.call(config, 'consolidatedPageCalls')
    ? config.consolidatedPageCalls
    : true;

/**
 * Generates a custom event name for a page or screen.
 *
 * @param {Object} message - The message object
 * @param {string} userDefinedEventTemplate - The user-defined event template to be used for generating the event name.
 * @throws {ConfigurationError} If the event template is missing.
 * @returns {string} The generated custom event name.
 * @example
 * const userDefinedEventTemplate = "Viewed {{ category }} {{ name }} Page";
 * const message = {name: 'Home', properties: {category: 'Index'}};
 * output: "Viewed Index Home Page"
 */
const generatePageCustomEventName = (message, userDefinedEventTemplate) => {
  let eventName = userDefinedEventTemplate
    .replace('{{ category }}', message.properties?.category || '').replace('{{ name }}', message.name || '').trim();
  // Remove any extra space between placeholders
  eventName = eventName.replace(/\s{2,}/g, ' ');

  // Check if any placeholders remain
  if (eventName.includes('{{')) {
    // Handle the case where either name or category is missing
    eventName = eventName.replace(/{{\s*\w+\s*}}/g, '');
  }

  return eventName.trim();
};

export {
  mapTraits,
  unionArrays,
  extendTraits,
  formatTraits,
  extractTraits,
  parseConfigArray,
  inverseObjectArrays,
  getConsolidatedPageCalls,
  filterSetOnceTraits,
  unset,
  generatePageCustomEventName,
};
