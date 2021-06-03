/* eslint-disable no-param-reassign */
import _ from "lodash";

function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
}
const getHashFromArray = (
  arrays,
  fromKey = "from",
  toKey = "to",
  isLowerCase = true
) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach((array) => {
      if (isEmpty(array[fromKey])) return;
      hashMap[isLowerCase ? array[fromKey].toLowerCase() : array[fromKey]] =
        array[toKey];
    });
  }
  return hashMap;
};

const toIso = (stringTimestamp) => {
  return new Date(stringTimestamp).toISOString();
};

const getDataFromContext = (contextMap, rudderElement) => {
  const { context } = rudderElement.message;
  const contextDataMap = {};
  if (context) {
    Object.keys(contextMap).forEach((value) => {
      if (value) {
        const val = _.get(context, value);
        contextDataMap[contextMap[value]] = val;
      }
    });
  }
  return contextDataMap;
};
export { toIso, getHashFromArray, getDataFromContext };
