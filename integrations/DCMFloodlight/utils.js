import { isNotEmpty } from "../utils/commonUtils";

/**
 * transform webapp dynamicForm custom floodlight variable
 * into {u1: [value], u2: [value], ...}
 * @param {*} customFloodlightVariable
 * @returns
 */
function transformCustomVariable(customFloodlightVariable) {
  const customVariable = {};
  customFloodlightVariable.forEach((item) => {
    if (item && isNotEmpty(item.from) && isNotEmpty(item.to)) {
      // remove u if already there
      customVariable[
        `u${item.from.trim().replace(/u/g, "")}`
      ] = `[${item.to.trim()}]`;
    }
  });

  return customVariable;
}

/**
 * append properties to endpoint
 * eg: ${endpoint}key1=value1;key2=value2;....
 * @param {*} endpoint
 * @param {*} payload
 * @returns
 */
function appendProperties(endpoint, payload) {
  Object.keys(payload).forEach((key) => {
    // eslint-disable-next-line no-param-reassign
    endpoint += `${key}=${payload[key]};`;
  });

  return endpoint;
}

// valid flag should be provided [1|true] or [0|false]
function isValidFlag(key, value) {
  if (["true", "1"].includes(value.toString())) {
    return 1;
  }
  if (["false", "0"].includes(value.toString())) {
    return 0;
  }

  throw Error(
    `[DCM Floodlight]:: ${key}: valid parameters are [1|true] or [0|false]`
  );
}

export { transformCustomVariable, appendProperties, isValidFlag };
