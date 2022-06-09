import { isNotEmpty } from '../utils/commonUtils';

/**
 * transform webapp dynamicForm custom floodlight variable
 * [
      {
        "from": "1",
        "to": "value1"
      },
      {
        "from": "2",
        "to": "value2"
      }
  ]
 * into {u1: [value1], u2: [value2], ...}
 * @param {*} customFloodlightVariable
 * @returns
 */
function transformCustomVariable(customFloodlightVariable) {
  const customVariable = {};
  customFloodlightVariable.forEach((item) => {
    if (item && isNotEmpty(item.from) && isNotEmpty(item.to)) {
      // remove u if already there
      customVariable[`u${item.from.trim().replace(/u/g, '')}`] = `[${item.to.trim()}]`;
    }
  });

  return customVariable;
}

// valid flag should be provided [1|true] or [0|false]
function isValidFlag(key, value) {
  if (['true', '1'].includes(value.toString())) {
    return 1;
  }
  if (['false', '0'].includes(value.toString())) {
    return 0;
  }

  throw Error(`[DCM Floodlight]:: ${key}: valid parameters are [1|true] or [0|false]`);
}

export { transformCustomVariable, isValidFlag };
