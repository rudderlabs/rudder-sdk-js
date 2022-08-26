import _ from "lodash";
import get from "get-value";

const isDefined = (x) => !_.isUndefined(x);
const isNotEmpty = (x) => !_.isEmpty(x);
const isNotNull = (x) => x != null;
const isDefinedAndNotNull = (x) => isDefined(x) && isNotNull(x);
const isDefinedAndNotNullAndNotEmpty = (x) => isDefined(x) && isNotNull(x) && isNotEmpty(x);
const removeUndefinedValues = (obj) => _.pickBy(obj, isDefined);
const removeNullValues = (obj) => _.pickBy(obj, isNotNull);
const removeUndefinedAndNullValues = (obj) => _.pickBy(obj, isDefinedAndNotNull);
const removeUndefinedAndNullAndEmptyValues = (obj) => _.pickBy(obj, isDefinedAndNotNullAndNotEmpty);
const isBlank = (value) => _.isEmpty(_.toString(value));
const pick = (argObj, argArr) => _.pick(argObj, argArr);

/**
 *
 * Convert an array map to hashmap(value as an array)
 * @param  {} arrays [{"from":"prop1","to":"val1"},{"from":"prop1","to":"val2"},{"from":"prop2","to":"val2"}]
 * @param  {} fromKey="from"
 * @param  {} toKey="to"
 * @param  {} isLowerCase=true
 * @param  {} return hashmap {"prop1":["val1","val2"],"prop2":["val2"]}
 */
const getHashFromArrayWithDuplicate = (
  arrays,
  fromKey = 'from',
  toKey = 'to',
  isLowerCase = true,
) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach((array) => {
      if (!isNotEmpty(array[fromKey])) return;
      const key = isLowerCase ? array[fromKey].toLowerCase().trim() : array[fromKey].trim();

      if (hashMap[key]) {
        const val = hashMap[key];
        if (!val.includes(array[toKey])) {
          hashMap[key].push(array[toKey]);
        }
      } else {
        hashMap[key] = [array[toKey]];
      }
    });
  }
  return hashMap;
};

/**
 *
 * Convert an array map to hashmap
 * @param  {} arrays [{"from":"prop1","to":"val1"},{"from":"prop2","to":"val2"}]
 * @param  {} fromKey="from"
 * @param  {} toKey="to"
 * @param  {} isLowerCase=true
 * @param  {} return hashmap {"prop1":"val1","prop2:"val2"}
 */
const getHashFromArray = (arrays, fromKey = 'from', toKey = 'to', isLowerCase = true) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach((array) => {
      if (!isNotEmpty(array[fromKey])) return;
      hashMap[isLowerCase ? array[fromKey].toLowerCase() : array[fromKey]] = array[toKey];
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

  recurse(data, '');
  return result;
}

/**
 * check type of object incoming in the rejectArr function
 * @param  {} val
 */
 function type(val) {
  switch (Object.prototype.toString.call(val)) {
    case "[object Function]":
      return "function";
    case "[object Date]":
      return "date";
    case "[object RegExp]":
      return "regexp";
    case "[object Arguments]":
      return "arguments";
    case "[object Array]":
      return "array";
  }

  if (val === null) return "null";
  if (val === undefined) return "undefined";
  if (val === Object(val)) return "object";

  return typeof val;
}

/* ------- End FlattenJson ----------- */
/**
 *
 * @param {*} message
 * @param {*} destination
 * @param {*} keys
 * @param {*} exclusionFields
 * Extract fields from message with exclusions
 * Pass the keys of message for extraction and
 * exclusion fields to exclude and the payload to map into
 * -----------------Example-------------------
 * extractCustomFields(message,payload,["traits", "context.traits", "properties"], "email",
 * ["firstName",
 * "lastName",
 * "phone",
 * "title",
 * "organization",
 * "city",
 * "region",
 * "country",
 * "zip",
 * "image",
 * "timezone"])
 * -------------------------------------------
 * The above call will map the fields other than the
 * exclusion list from the given keys to the destination payload
 *
 */

 function extractCustomFields(message, destination, keys, exclusionFields) {
  keys.map((key) => {
    const messageContext = get(message, key);
    if (messageContext) {
      const objKeys = [];
      Object.keys(messageContext).map((k) => {
        if (exclusionFields.indexOf(k) < 0) {
          objKeys.push(k);
        }
      });
      objKeys.map((k) => {
        if (!(typeof messageContext[k] === "undefined")) {
          if (destination) {
            destination[k] = get(messageContext, k);
          } else {
            destination = {
              k: get(messageContext, k),
            };
          }
        }
      });
    }
  });
  return destination;
}

/**
 *
 * @param {*} message
 *
 * Use get-value to retrieve defined traits from message traits
 */
function getDefinedTraits(message) {
  const traitsValue = {
    userId:
      get(message, "userId") ||
      get(message, "context.traits.userId") ||
      get(message, "anonymousId"),
    email:
      get(message, "context.traits.email") ||
      get(message, "context.traits.Email") ||
      get(message, "context.traits.E-mail"),
    phone:
      get(message, "context.traits.phone") ||
      get(message, "context.traits.Phone"),
    firstName:
      get(message, "context.traits.firstName") ||
      get(message, "context.traits.firstname") ||
      get(message, "context.traits.first_name"),
    lastName:
      get(message, "context.traits.lastName") ||
      get(message, "context.traits.lastname") ||
      get(message, "context.traits.last_name"),
    name:
      get(message, "context.traits.name") ||
      get(message, "context.traits.Name"),
    city:
      get(message, "context.traits.city") ||
      get(message, "context.traits.City"),
    country:
      get(message, "context.traits.country") ||
      get(message, "context.traits.Country"),
  };

  if (
    !get(traitsValue, "name") &&
    get(traitsValue, "firstName") &&
    get(traitsValue, "lastName")
  ) {
    traitsValue.name = `${get(traitsValue, "firstName")} ${get(
      traitsValue,
      "lastName"
    )}`;
  }
  return traitsValue;
}

/**
 * To check if a variable is storing object or not
 */
const isObject = (obj) => {
  return type(obj) === "object";
};

/**
 * To check if a variable is storing array or not
 */
const isArray = (obj) => {
  return type(obj) === "array";
};


/**
 * Using this function we can create a payload from a mapping object.
 * @param {*} object = {
   traits:{
     name: "abcd efgh",
     address: {
       city: "xyz"
     }
   }
  }
 * @param {*} mapper = [
  {
    destKey: "userName",
    sourceKeys: "traits.name",
  },
  {
    destKey: "city",
    sourceKeys: "traits.address.city",
  },
]
 * @returns {
userName : "abcd efgh",
city : "xyz"
}

*/
const constructPayload = (object, mapper) => {
  const payload = {};
  if (object) {
    mapper.forEach((element) => {
      if (!Array.isArray(element.sourceKeys)) {
        payload[element.destKey] = get(object, element.sourceKeys);
      } else {
        for (let i = 0; i < element.sourceKeys.length; i += 1) {
          if (get(object, element.sourceKeys[i])) {
            payload[element.destKey] = get(object, element.sourceKeys[i]);
            break;
          }
        }
      }
    });
  }

  return payload;
};

/**
 * reject all null values from array/object
 * @param  {} obj
 * @param  {} fn
 */
 function rejectArr(obj, fn) {
  fn = fn || compact;
  return type(obj) == "array" ? rejectarray(obj, fn) : rejectobject(obj, fn);
}

/**
 * particular case when rejecting an array
 * @param  {} arr
 * @param  {} fn
 */
var rejectarray = function (arr, fn) {
  const ret = [];

  for (let i = 0; i < arr.length; ++i) {
    if (!fn(arr[i], i)) ret[ret.length] = arr[i];
  }

  return ret;
};

/**
 * Rejecting null from any object other than arrays
 * @param  {} obj
 * @param  {} fn
 *
 */
var rejectobject = function (obj, fn) {
  const ret = {};

  for (const k in obj) {
    if (obj.hasOwnProperty(k) && !fn(obj[k], k)) {
      ret[k] = obj[k];
    }
  }

  return ret;
};

function compact(value) {
  return value == null;
}

/* ------- Start FlattenJson -----------
 * This function flatten given json object to single level.
 * So if there is nested object or array, all will appear in first level properties of an object.
 * Following is case we are handling in this function ::
 * condition 1: String
 * condition 2: Array
 * condition 3: Nested object
 */
function recurse(cur, prop, result) {
  const res = result;
  if (Object(cur) !== cur) {
    res[prop] = cur;
  } else if (Array.isArray(cur)) {
    const l = cur.length;
    for (let i = 0; i < l; i += 1)
      recurse(cur[i], prop ? `${prop}.${i}` : `${i}`, res);
    if (l === 0) res[prop] = [];
  } else {
    let isEmpty = true;
    Object.keys(cur).forEach((key) => {
      isEmpty = false;
      recurse(cur[key], prop ? `${prop}.${key}` : key, res);
    });
    if (isEmpty) res[prop] = {};
  }
  return res;
}

function flattenJsonPayload(data) {
  return recurse(data, "", {});
}

function getCurrency(val) {
  if (!val) return;
  if (typeof val === "number") {
    return val;
  }
  if (typeof val !== "string") {
    return;
  }

  val = val.replace(/\$/g, "");
  val = parseFloat(val);

  if (!isNaN(val)) {
    return val;
  }
}

function getRevenue(properties, eventName) {
  let { revenue } = properties;
  const orderCompletedRegExp =
    /^[ _]?completed[ _]?order[ _]?|^[ _]?order[ _]?completed[ _]?$/i;

  // it's always revenue, unless it's called during an order completion.
  if (!revenue && eventName && eventName.match(orderCompletedRegExp)) {
    revenue = properties.total;
  }

  return getCurrency(revenue);
}

const getDataFromSource = (src, dest, properties) => {
  const data = {};
  if (isArray(src)) {
    for (let index = 0; index < src.length; index += 1) {
      if (properties[src[index]]) {
        data[dest] = properties[src[index]];
        if (data) {
          // return only if the value is valid.
          // else look for next possible source in precedence
          return data;
        }
      }
    }
  } else if (typeof src === "string") {
    if (properties[src]) {
      data[dest] = properties[src];
    }
  }
  return data;
};

export {
  getHashFromArrayWithDuplicate,
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
  type,
  extractCustomFields,
  getDefinedTraits,
  isObject,
  isArray,
  constructPayload,
  rejectArr,
  flattenJsonPayload,
  getRevenue,
  getDataFromSource,
};
