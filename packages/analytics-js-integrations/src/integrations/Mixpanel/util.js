/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
import { DISPLAY_NAME } from '@rudderstack/analytics-js-common/constants/integrations/Amplitude/constants';
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

const formatTraits = message => {
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
    logger.debug(`Error occured at extractCustomFields ${err}`);
  }
  return outgoingTraits;
};

const parseConfigArray = (arr, key) => {
  if (!arr) {
    logger.debug('arr is undefined or null');
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
  const ret = new Array(arr.length);

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

export {
  mapTraits,
  unionArrays,
  extendTraits,
  formatTraits,
  extractTraits,
  parseConfigArray,
  inverseObjectArrays,
  getConsolidatedPageCalls,
};
