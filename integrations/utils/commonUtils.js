import _ from "lodash";

const isDefined = (x) => !_.isUndefined(x);
const isNotEmpty = (x) => !_.isEmpty(x);
const isNotNull = (x) => x != null;
const isDefinedAndNotNull = (x) => isDefined(x) && isNotNull(x);
const isDefinedAndNotNullAndNotEmpty = (x) =>
  isDefined(x) && isNotNull(x) && isNotEmpty(x);
const removeUndefinedValues = (obj) => _.pickBy(obj, isDefined);
const removeNullValues = (obj) => _.pickBy(obj, isNotNull);
const removeUndefinedAndNullValues = (obj) =>
  _.pickBy(obj, isDefinedAndNotNull);
const removeUndefinedAndNullAndEmptyValues = (obj) =>
  _.pickBy(obj, isDefinedAndNotNullAndNotEmpty);
const isBlank = (value) => _.isEmpty(_.toString(value));

/**
 *
 * Convert an array map to hashmap
 * @param  {} arrays [{"from":"prop1","to":"val1"},{"from":"prop2","to":"val2"}]
 * @param  {} fromKey="from"
 * @param  {} toKey="to"
 * @param  {} isLowerCase=true
 * @param  {} return hashmap {"prop1":"val1","prop2:"val2"}
 */
const getHashFromArray = (
  arrays,
  fromKey = "from",
  toKey = "to",
  isLowerCase = true
) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach((array) => {
      if (!isNotEmpty(array[fromKey])) return;
      hashMap[isLowerCase ? array[fromKey].toLowerCase() : array[fromKey]] =
        array[toKey];
    });
  }
  return hashMap;
};
/**
 * @param  {} timestamp
 * @param  {} return iso format of date
 */
const toIso = (timestamp) => {
  return new Date(timestamp).toISOString();
};

export {
  getHashFromArray,
  toIso,
  removeUndefinedValues,
  removeUndefinedAndNullValues,
  removeNullValues,
  removeUndefinedAndNullAndEmptyValues,
  isDefined,
  isNotEmpty,
  isNotNull,
  isDefinedAndNotNull,
  isDefinedAndNotNullAndNotEmpty,
  isBlank,
};
