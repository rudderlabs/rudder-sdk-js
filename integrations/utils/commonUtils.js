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
const pick = (argObj, argArr) => _.pick(argObj, argArr);

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

// function to flatten a json
function flattenJson(data) {
  const result = {};
  let l;

  // a recursive function to loop through the array of the data
  function recurse(cur, prop) {
    let i;
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (i = 0, l = cur.length; i < l; i += 1) {
        recurse(cur[i], `${prop}[${i}]`);
      }
      if (l === 0) {
        result[prop] = [];
      }
    } else {
      let isEmptyFlag = true;
      Object.keys(cur).forEach((key) => {
        isEmptyFlag = false;
        recurse(cur[key], prop ? `${prop}.${key}` : key);
      });
      if (isEmptyFlag && prop) result[prop] = {};
    }
  }

  recurse(data, "");
  return result;
}

export {
  getHashFromArray,
  toIso,
  flattenJson,
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
  pick,
};
