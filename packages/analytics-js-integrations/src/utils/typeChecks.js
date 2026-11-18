const objectToString = Object.prototype.toString;

// Tag checks preserve boxed primitives and values from another browser frame.
const isBoolean = value => objectToString.call(value) === '[object Boolean]';
const isDate = value => objectToString.call(value) === '[object Date]';
const isNumber = value => objectToString.call(value) === '[object Number]';
const isObject = value => objectToString.call(value) === '[object Object]';
const isArray = Array.isArray || (value => objectToString.call(value) === '[object Array]');

export { isArray, isBoolean, isDate, isNumber, isObject };
