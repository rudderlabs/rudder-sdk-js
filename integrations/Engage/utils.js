import { identifyExcludeFields } from "./constants";
/**
 * Flatens the input payload
 * @param {*} payload Input payload that needs to be flattened
 * @returns the flattened payload at all levels
 */
const flattenPayload = (payload) => {
  const flattenedPayload = {};
  if (payload) {
    Object.keys(payload).forEach((v) => {
      if (typeof payload[v] === "object" && !Array.isArray(payload[v])) {
        const temp = flattenPayload(payload[v]);
        Object.keys(temp).forEach((i) => {
          flattenedPayload[i] = temp[i];
        });
      } else {
        flattenedPayload[v] = payload[v];
      }
    });
  }
  return flattenedPayload;
};

/**
 * @param {*} attributes payload that needs modification and transistion to payload
 * @param {*} specificGenericFields fields that should be overlooked when adding fields to payload
 * @returns payload
 */
const refinePayload = (attributes, identifyFlag = false) => {
  const flattenedPayload = flattenPayload(attributes);
  const payload = {};
  Object.keys(flattenedPayload).forEach((v) => {
    if (!identifyFlag || !identifyExcludeFields.includes(v)) {
      payload[v] = flattenedPayload[v];
    }
  });
  return payload;
};

// eslint-disable-next-line import/prefer-default-export
export { refinePayload };
