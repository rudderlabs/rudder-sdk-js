const isString = function isString(val) {
  return Object.prototype.toString.call(val) === "[object String]";
};

export default isString;
