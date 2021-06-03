/* eslint-disable no-param-reassign */
import _ from "lodash";

/**
 * @param  {} value
 * @param  {} return true or false accordingly if value is empty
 */

function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
}
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
      if (isEmpty(array[fromKey])) return;
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
/**
 * @param  {} contextMap { "page.name" : "pName", "page.url": "pUrl"}
 * @param  {} rudderElement
 *  Find page.name, page.url from context of rudder message.
 *  If context = {"page": {"name": "Home Page", "url":"https://example.com"},{"path", "/page1"}}
 * @param  {} return a hash map of {"pName": "Home Page", "pUrl": "https://example.com"}
 */
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
