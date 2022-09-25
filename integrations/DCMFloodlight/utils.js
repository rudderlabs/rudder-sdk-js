import get from 'get-value';
import { GENERIC_FALSE_VALUES, GENERIC_TRUE_VALUES } from '../../utils/constants';
import logger from '../../utils/logUtil';
import { isDefinedAndNotNull, isNotEmpty } from '../utils/commonUtils';

/**
 * transform webapp dynamicForm custom floodlight variable
 * [
      {
        "from": "property1",
        "to": "1"
      },
      {
        "from": "property2",
        "to": "2"
      }
  ]
 * into { property1: u1, property2: u2, ... }
 * Ref - https://support.google.com/campaignmanager/answer/2823222?hl=en
 * @param {*} customFloodlightVariable
 * @returns
 */
const transformCustomVariable = (customFloodlightVariable, message) => {
  const customVariable = {};
  const DENIED_CHARACTERS = ['"', '<', '>', '#'];
  customFloodlightVariable.forEach((item) => {
    if (item && isNotEmpty(item.from) && isNotEmpty(item.to)) {
      // remove u if already there
      // first we consider taking custom variable from properties
      // if not found we will take it from traits
      let itemValue = get(message, `properties.${item.from.trim()}`);
      // this condition adds support for numeric 0
      if (!isDefinedAndNotNull(itemValue)) {
        const traits = message.traits || message.context?.traits;
        if (traits) {
          itemValue = traits[item.from.trim()];
        }
      }
      if (
        itemValue &&
        typeof itemValue === 'string' &&
        DENIED_CHARACTERS.some((key) => itemValue.includes(key))
      ) {
        logger.info(`${DENIED_CHARACTERS} string variable is not acceptable`);
        itemValue = undefined;
      }
      // supported data types are number and string
      if (isDefinedAndNotNull(itemValue) && typeof itemValue !== 'boolean') {
        customVariable[`u${item.to.trim().replace(/u/g, '')}`] = encodeURIComponent(itemValue);
      }
    }
  });

  return customVariable;
};

// valid flag should be provided [1|true] or [0|false]
const mapFlagValue = (key, value) => {
  if (GENERIC_TRUE_VALUES.includes(value.toString())) {
    return 1;
  }
  if (GENERIC_FALSE_VALUES.includes(value.toString())) {
    return 0;
  }

  throw Error(`[DCM Floodlight]:: ${key}: valid parameters are [1|true] or [0|false]`);
};

export { transformCustomVariable, mapFlagValue };
