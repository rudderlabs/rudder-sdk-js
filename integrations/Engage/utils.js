/* eslint-disable import/no-extraneous-dependencies */
import set from "lodash";

const identifyExcludeFields = [
  "firstName",
  "firstname",
  "first_name",
  "lastName",
  "lastname",
  "last_name",
  "phone",
];
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
  console.log("in", flattenedPayload);
  const payload = {};
  Object.keys(flattenedPayload).forEach((v) => {
    if (!identifyFlag || !identifyExcludeFields.includes(v)) {
      payload[v] = flattenedPayload[v];
    }
  });
  console.log("return: ", payload);
  return payload;
};

// eslint-disable-next-line import/prefer-default-export
export { refinePayload };
