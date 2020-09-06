var GAPlugin = (function () {
  'use strict';

  const LOG_LEVEL_INFO = 1;
  const LOG_LEVEL_DEBUG = 2;
  const LOG_LEVEL_WARN = 3;
  const LOG_LEVEL_ERROR = 4;
  let LOG_LEVEL = LOG_LEVEL_ERROR;
  const logger = {
    setLogLevel(logLevel) {
      switch (logLevel.toUpperCase()) {
        case "INFO":
          LOG_LEVEL = LOG_LEVEL_INFO;
          return;

        case "DEBUG":
          LOG_LEVEL = LOG_LEVEL_DEBUG;
          return;

        case "WARN":
          LOG_LEVEL = LOG_LEVEL_WARN;
      }
    },

    info() {
      if (LOG_LEVEL <= LOG_LEVEL_INFO) {
        console.info(...arguments);
      }
    },

    debug() {
      if (LOG_LEVEL <= LOG_LEVEL_DEBUG) {
        console.debug(...arguments);
      }
    },

    warn() {
      if (LOG_LEVEL <= LOG_LEVEL_WARN) {
        console.warn(...arguments);
      }
    },

    error() {
      if (LOG_LEVEL <= LOG_LEVEL_ERROR) {
        console.error(...arguments);
      }
    }

  };

  /* globals window, HTMLElement */

  /**!
   * is
   * the definitive JavaScript type testing library
   *
   * @copyright 2013-2014 Enrico Marino / Jordan Harband
   * @license MIT
   */

  var objProto = Object.prototype;
  var owns = objProto.hasOwnProperty;
  var toStr = objProto.toString;
  var symbolValueOf;
  if (typeof Symbol === 'function') {
    symbolValueOf = Symbol.prototype.valueOf;
  }
  var bigIntValueOf;
  if (typeof BigInt === 'function') {
    bigIntValueOf = BigInt.prototype.valueOf;
  }
  var isActualNaN = function (value) {
    return value !== value;
  };
  var NON_HOST_TYPES = {
    'boolean': 1,
    number: 1,
    string: 1,
    undefined: 1
  };

  var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
  var hexRegex = /^[A-Fa-f0-9]+$/;

  /**
   * Expose `is`
   */

  var is = {};

  /**
   * Test general.
   */

  /**
   * is.type
   * Test if `value` is a type of `type`.
   *
   * @param {*} value value to test
   * @param {String} type type
   * @return {Boolean} true if `value` is a type of `type`, false otherwise
   * @api public
   */

  is.a = is.type = function (value, type) {
    return typeof value === type;
  };

  /**
   * is.defined
   * Test if `value` is defined.
   *
   * @param {*} value value to test
   * @return {Boolean} true if 'value' is defined, false otherwise
   * @api public
   */

  is.defined = function (value) {
    return typeof value !== 'undefined';
  };

  /**
   * is.empty
   * Test if `value` is empty.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is empty, false otherwise
   * @api public
   */

  is.empty = function (value) {
    var type = toStr.call(value);
    var key;

    if (type === '[object Array]' || type === '[object Arguments]' || type === '[object String]') {
      return value.length === 0;
    }

    if (type === '[object Object]') {
      for (key in value) {
        if (owns.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    return !value;
  };

  /**
   * is.equal
   * Test if `value` is equal to `other`.
   *
   * @param {*} value value to test
   * @param {*} other value to compare with
   * @return {Boolean} true if `value` is equal to `other`, false otherwise
   */

  is.equal = function equal(value, other) {
    if (value === other) {
      return true;
    }

    var type = toStr.call(value);
    var key;

    if (type !== toStr.call(other)) {
      return false;
    }

    if (type === '[object Object]') {
      for (key in value) {
        if (!is.equal(value[key], other[key]) || !(key in other)) {
          return false;
        }
      }
      for (key in other) {
        if (!is.equal(value[key], other[key]) || !(key in value)) {
          return false;
        }
      }
      return true;
    }

    if (type === '[object Array]') {
      key = value.length;
      if (key !== other.length) {
        return false;
      }
      while (key--) {
        if (!is.equal(value[key], other[key])) {
          return false;
        }
      }
      return true;
    }

    if (type === '[object Function]') {
      return value.prototype === other.prototype;
    }

    if (type === '[object Date]') {
      return value.getTime() === other.getTime();
    }

    return false;
  };

  /**
   * is.hosted
   * Test if `value` is hosted by `host`.
   *
   * @param {*} value to test
   * @param {*} host host to test with
   * @return {Boolean} true if `value` is hosted by `host`, false otherwise
   * @api public
   */

  is.hosted = function (value, host) {
    var type = typeof host[value];
    return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
  };

  /**
   * is.instance
   * Test if `value` is an instance of `constructor`.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an instance of `constructor`
   * @api public
   */

  is.instance = is['instanceof'] = function (value, constructor) {
    return value instanceof constructor;
  };

  /**
   * is.nil / is.null
   * Test if `value` is null.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is null, false otherwise
   * @api public
   */

  is.nil = is['null'] = function (value) {
    return value === null;
  };

  /**
   * is.undef / is.undefined
   * Test if `value` is undefined.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is undefined, false otherwise
   * @api public
   */

  is.undef = is.undefined = function (value) {
    return typeof value === 'undefined';
  };

  /**
   * Test arguments.
   */

  /**
   * is.args
   * Test if `value` is an arguments object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an arguments object, false otherwise
   * @api public
   */

  is.args = is.arguments = function (value) {
    var isStandardArguments = toStr.call(value) === '[object Arguments]';
    var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
    return isStandardArguments || isOldArguments;
  };

  /**
   * Test array.
   */

  /**
   * is.array
   * Test if 'value' is an array.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an array, false otherwise
   * @api public
   */

  is.array = Array.isArray || function (value) {
    return toStr.call(value) === '[object Array]';
  };

  /**
   * is.arguments.empty
   * Test if `value` is an empty arguments object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an empty arguments object, false otherwise
   * @api public
   */
  is.args.empty = function (value) {
    return is.args(value) && value.length === 0;
  };

  /**
   * is.array.empty
   * Test if `value` is an empty array.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an empty array, false otherwise
   * @api public
   */
  is.array.empty = function (value) {
    return is.array(value) && value.length === 0;
  };

  /**
   * is.arraylike
   * Test if `value` is an arraylike object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an arguments object, false otherwise
   * @api public
   */

  is.arraylike = function (value) {
    return !!value && !is.bool(value)
      && owns.call(value, 'length')
      && isFinite(value.length)
      && is.number(value.length)
      && value.length >= 0;
  };

  /**
   * Test boolean.
   */

  /**
   * is.bool
   * Test if `value` is a boolean.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a boolean, false otherwise
   * @api public
   */

  is.bool = is['boolean'] = function (value) {
    return toStr.call(value) === '[object Boolean]';
  };

  /**
   * is.false
   * Test if `value` is false.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is false, false otherwise
   * @api public
   */

  is['false'] = function (value) {
    return is.bool(value) && Boolean(Number(value)) === false;
  };

  /**
   * is.true
   * Test if `value` is true.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is true, false otherwise
   * @api public
   */

  is['true'] = function (value) {
    return is.bool(value) && Boolean(Number(value)) === true;
  };

  /**
   * Test date.
   */

  /**
   * is.date
   * Test if `value` is a date.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a date, false otherwise
   * @api public
   */

  is.date = function (value) {
    return toStr.call(value) === '[object Date]';
  };

  /**
   * is.date.valid
   * Test if `value` is a valid date.
   *
   * @param {*} value value to test
   * @returns {Boolean} true if `value` is a valid date, false otherwise
   */
  is.date.valid = function (value) {
    return is.date(value) && !isNaN(Number(value));
  };

  /**
   * Test element.
   */

  /**
   * is.element
   * Test if `value` is an html element.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an HTML Element, false otherwise
   * @api public
   */

  is.element = function (value) {
    return value !== undefined
      && typeof HTMLElement !== 'undefined'
      && value instanceof HTMLElement
      && value.nodeType === 1;
  };

  /**
   * Test error.
   */

  /**
   * is.error
   * Test if `value` is an error object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an error object, false otherwise
   * @api public
   */

  is.error = function (value) {
    return toStr.call(value) === '[object Error]';
  };

  /**
   * Test function.
   */

  /**
   * is.fn / is.function (deprecated)
   * Test if `value` is a function.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a function, false otherwise
   * @api public
   */

  is.fn = is['function'] = function (value) {
    var isAlert = typeof window !== 'undefined' && value === window.alert;
    if (isAlert) {
      return true;
    }
    var str = toStr.call(value);
    return str === '[object Function]' || str === '[object GeneratorFunction]' || str === '[object AsyncFunction]';
  };

  /**
   * Test number.
   */

  /**
   * is.number
   * Test if `value` is a number.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a number, false otherwise
   * @api public
   */

  is.number = function (value) {
    return toStr.call(value) === '[object Number]';
  };

  /**
   * is.infinite
   * Test if `value` is positive or negative infinity.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
   * @api public
   */
  is.infinite = function (value) {
    return value === Infinity || value === -Infinity;
  };

  /**
   * is.decimal
   * Test if `value` is a decimal number.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a decimal number, false otherwise
   * @api public
   */

  is.decimal = function (value) {
    return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
  };

  /**
   * is.divisibleBy
   * Test if `value` is divisible by `n`.
   *
   * @param {Number} value value to test
   * @param {Number} n dividend
   * @return {Boolean} true if `value` is divisible by `n`, false otherwise
   * @api public
   */

  is.divisibleBy = function (value, n) {
    var isDividendInfinite = is.infinite(value);
    var isDivisorInfinite = is.infinite(n);
    var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
    return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
  };

  /**
   * is.integer
   * Test if `value` is an integer.
   *
   * @param value to test
   * @return {Boolean} true if `value` is an integer, false otherwise
   * @api public
   */

  is.integer = is['int'] = function (value) {
    return is.number(value) && !isActualNaN(value) && value % 1 === 0;
  };

  /**
   * is.maximum
   * Test if `value` is greater than 'others' values.
   *
   * @param {Number} value value to test
   * @param {Array} others values to compare with
   * @return {Boolean} true if `value` is greater than `others` values
   * @api public
   */

  is.maximum = function (value, others) {
    if (isActualNaN(value)) {
      throw new TypeError('NaN is not a valid value');
    } else if (!is.arraylike(others)) {
      throw new TypeError('second argument must be array-like');
    }
    var len = others.length;

    while (--len >= 0) {
      if (value < others[len]) {
        return false;
      }
    }

    return true;
  };

  /**
   * is.minimum
   * Test if `value` is less than `others` values.
   *
   * @param {Number} value value to test
   * @param {Array} others values to compare with
   * @return {Boolean} true if `value` is less than `others` values
   * @api public
   */

  is.minimum = function (value, others) {
    if (isActualNaN(value)) {
      throw new TypeError('NaN is not a valid value');
    } else if (!is.arraylike(others)) {
      throw new TypeError('second argument must be array-like');
    }
    var len = others.length;

    while (--len >= 0) {
      if (value > others[len]) {
        return false;
      }
    }

    return true;
  };

  /**
   * is.nan
   * Test if `value` is not a number.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is not a number, false otherwise
   * @api public
   */

  is.nan = function (value) {
    return !is.number(value) || value !== value;
  };

  /**
   * is.even
   * Test if `value` is an even number.
   *
   * @param {Number} value value to test
   * @return {Boolean} true if `value` is an even number, false otherwise
   * @api public
   */

  is.even = function (value) {
    return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
  };

  /**
   * is.odd
   * Test if `value` is an odd number.
   *
   * @param {Number} value value to test
   * @return {Boolean} true if `value` is an odd number, false otherwise
   * @api public
   */

  is.odd = function (value) {
    return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
  };

  /**
   * is.ge
   * Test if `value` is greater than or equal to `other`.
   *
   * @param {Number} value value to test
   * @param {Number} other value to compare with
   * @return {Boolean}
   * @api public
   */

  is.ge = function (value, other) {
    if (isActualNaN(value) || isActualNaN(other)) {
      throw new TypeError('NaN is not a valid value');
    }
    return !is.infinite(value) && !is.infinite(other) && value >= other;
  };

  /**
   * is.gt
   * Test if `value` is greater than `other`.
   *
   * @param {Number} value value to test
   * @param {Number} other value to compare with
   * @return {Boolean}
   * @api public
   */

  is.gt = function (value, other) {
    if (isActualNaN(value) || isActualNaN(other)) {
      throw new TypeError('NaN is not a valid value');
    }
    return !is.infinite(value) && !is.infinite(other) && value > other;
  };

  /**
   * is.le
   * Test if `value` is less than or equal to `other`.
   *
   * @param {Number} value value to test
   * @param {Number} other value to compare with
   * @return {Boolean} if 'value' is less than or equal to 'other'
   * @api public
   */

  is.le = function (value, other) {
    if (isActualNaN(value) || isActualNaN(other)) {
      throw new TypeError('NaN is not a valid value');
    }
    return !is.infinite(value) && !is.infinite(other) && value <= other;
  };

  /**
   * is.lt
   * Test if `value` is less than `other`.
   *
   * @param {Number} value value to test
   * @param {Number} other value to compare with
   * @return {Boolean} if `value` is less than `other`
   * @api public
   */

  is.lt = function (value, other) {
    if (isActualNaN(value) || isActualNaN(other)) {
      throw new TypeError('NaN is not a valid value');
    }
    return !is.infinite(value) && !is.infinite(other) && value < other;
  };

  /**
   * is.within
   * Test if `value` is within `start` and `finish`.
   *
   * @param {Number} value value to test
   * @param {Number} start lower bound
   * @param {Number} finish upper bound
   * @return {Boolean} true if 'value' is is within 'start' and 'finish'
   * @api public
   */
  is.within = function (value, start, finish) {
    if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
      throw new TypeError('NaN is not a valid value');
    } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
      throw new TypeError('all arguments must be numbers');
    }
    var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
    return isAnyInfinite || (value >= start && value <= finish);
  };

  /**
   * Test object.
   */

  /**
   * is.object
   * Test if `value` is an object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an object, false otherwise
   * @api public
   */
  is.object = function (value) {
    return toStr.call(value) === '[object Object]';
  };

  /**
   * is.primitive
   * Test if `value` is a primitive.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a primitive, false otherwise
   * @api public
   */
  is.primitive = function isPrimitive(value) {
    if (!value) {
      return true;
    }
    if (typeof value === 'object' || is.object(value) || is.fn(value) || is.array(value)) {
      return false;
    }
    return true;
  };

  /**
   * is.hash
   * Test if `value` is a hash - a plain object literal.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a hash, false otherwise
   * @api public
   */

  is.hash = function (value) {
    return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
  };

  /**
   * Test regexp.
   */

  /**
   * is.regexp
   * Test if `value` is a regular expression.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a regexp, false otherwise
   * @api public
   */

  is.regexp = function (value) {
    return toStr.call(value) === '[object RegExp]';
  };

  /**
   * Test string.
   */

  /**
   * is.string
   * Test if `value` is a string.
   *
   * @param {*} value value to test
   * @return {Boolean} true if 'value' is a string, false otherwise
   * @api public
   */

  is.string = function (value) {
    return toStr.call(value) === '[object String]';
  };

  /**
   * Test base64 string.
   */

  /**
   * is.base64
   * Test if `value` is a valid base64 encoded string.
   *
   * @param {*} value value to test
   * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
   * @api public
   */

  is.base64 = function (value) {
    return is.string(value) && (!value.length || base64Regex.test(value));
  };

  /**
   * Test base64 string.
   */

  /**
   * is.hex
   * Test if `value` is a valid hex encoded string.
   *
   * @param {*} value value to test
   * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
   * @api public
   */

  is.hex = function (value) {
    return is.string(value) && (!value.length || hexRegex.test(value));
  };

  /**
   * is.symbol
   * Test if `value` is an ES6 Symbol
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a Symbol, false otherise
   * @api public
   */

  is.symbol = function (value) {
    return typeof Symbol === 'function' && toStr.call(value) === '[object Symbol]' && typeof symbolValueOf.call(value) === 'symbol';
  };

  /**
   * is.bigint
   * Test if `value` is an ES-proposed BigInt
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a BigInt, false otherise
   * @api public
   */

  is.bigint = function (value) {
    // eslint-disable-next-line valid-typeof
    return typeof BigInt === 'function' && toStr.call(value) === '[object BigInt]' && typeof bigIntValueOf.call(value) === 'bigint';
  };

  var is_1 = is;

  /**
   * toString ref.
   */

  var toString$1 = Object.prototype.toString;

  /**
   * Return the type of `val`.
   *
   * @param {Mixed} val
   * @return {String}
   * @api public
   */

  var componentType = function(val){
    switch (toString$1.call(val)) {
      case '[object Function]': return 'function';
      case '[object Date]': return 'date';
      case '[object RegExp]': return 'regexp';
      case '[object Arguments]': return 'arguments';
      case '[object Array]': return 'array';
      case '[object String]': return 'string';
    }

    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (val && val.nodeType === 1) return 'element';
    if (val === Object(val)) return 'object';

    return typeof val;
  };

  /**
   * Global Names
   */

  var globals = /\b(Array|Date|Object|Math|JSON)\b/g;

  /**
   * Return immediate identifiers parsed from `str`.
   *
   * @param {String} str
   * @param {String|Function} map function or prefix
   * @return {Array}
   * @api public
   */

  var componentProps = function(str, fn){
    var p = unique(props(str));
    if (fn && 'string' == typeof fn) fn = prefixed(fn);
    if (fn) return map(str, p, fn);
    return p;
  };

  /**
   * Return immediate identifiers in `str`.
   *
   * @param {String} str
   * @return {Array}
   * @api private
   */

  function props(str) {
    return str
      .replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '')
      .replace(globals, '')
      .match(/[a-zA-Z_]\w*/g)
      || [];
  }

  /**
   * Return `str` with `props` mapped with `fn`.
   *
   * @param {String} str
   * @param {Array} props
   * @param {Function} fn
   * @return {String}
   * @api private
   */

  function map(str, props, fn) {
    var re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
    return str.replace(re, function(_){
      if ('(' == _[_.length - 1]) return fn(_);
      if (!~props.indexOf(_)) return _;
      return fn(_);
    });
  }

  /**
   * Return unique array.
   *
   * @param {Array} arr
   * @return {Array}
   * @api private
   */

  function unique(arr) {
    var ret = [];

    for (var i = 0; i < arr.length; i++) {
      if (~ret.indexOf(arr[i])) continue;
      ret.push(arr[i]);
    }

    return ret;
  }

  /**
   * Map with prefix `str`.
   */

  function prefixed(str) {
    return function(_){
      return str + _;
    };
  }

  /**
   * Module Dependencies
   */

  var expr;
  try {
    expr = componentProps;
  } catch(e) {
    expr = componentProps;
  }

  /**
   * Expose `toFunction()`.
   */

  var toFunction_1 = toFunction;

  /**
   * Convert `obj` to a `Function`.
   *
   * @param {Mixed} obj
   * @return {Function}
   * @api private
   */

  function toFunction(obj) {
    switch ({}.toString.call(obj)) {
      case '[object Object]':
        return objectToFunction(obj);
      case '[object Function]':
        return obj;
      case '[object String]':
        return stringToFunction(obj);
      case '[object RegExp]':
        return regexpToFunction(obj);
      default:
        return defaultToFunction(obj);
    }
  }

  /**
   * Default to strict equality.
   *
   * @param {Mixed} val
   * @return {Function}
   * @api private
   */

  function defaultToFunction(val) {
    return function(obj){
      return val === obj;
    };
  }

  /**
   * Convert `re` to a function.
   *
   * @param {RegExp} re
   * @return {Function}
   * @api private
   */

  function regexpToFunction(re) {
    return function(obj){
      return re.test(obj);
    };
  }

  /**
   * Convert property `str` to a function.
   *
   * @param {String} str
   * @return {Function}
   * @api private
   */

  function stringToFunction(str) {
    // immediate such as "> 20"
    if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);

    // properties such as "name.first" or "age > 18" or "age > 18 && age < 36"
    return new Function('_', 'return ' + get(str));
  }

  /**
   * Convert `object` to a function.
   *
   * @param {Object} object
   * @return {Function}
   * @api private
   */

  function objectToFunction(obj) {
    var match = {};
    for (var key in obj) {
      match[key] = typeof obj[key] === 'string'
        ? defaultToFunction(obj[key])
        : toFunction(obj[key]);
    }
    return function(val){
      if (typeof val !== 'object') return false;
      for (var key in match) {
        if (!(key in val)) return false;
        if (!match[key](val[key])) return false;
      }
      return true;
    };
  }

  /**
   * Built the getter function. Supports getter style functions
   *
   * @param {String} str
   * @return {String}
   * @api private
   */

  function get(str) {
    var props = expr(str);
    if (!props.length) return '_.' + str;

    var val, i, prop;
    for (i = 0; i < props.length; i++) {
      prop = props[i];
      val = '_.' + prop;
      val = "('function' == typeof " + val + " ? " + val + "() : " + val + ")";

      // mimic negative lookbehind to avoid problems with nested properties
      str = stripNested(prop, str, val);
    }

    return str;
  }

  /**
   * Mimic negative lookbehind to avoid problems with nested properties.
   *
   * See: http://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript
   *
   * @param {String} prop
   * @param {String} str
   * @param {String} val
   * @return {String}
   * @api private
   */

  function stripNested (prop, str, val) {
    return str.replace(new RegExp('(\\.)?' + prop, 'g'), function($0, $1) {
      return $1 ? $0 : val;
    });
  }

  /**
   * Module dependencies.
   */

  try {
    var type = componentType;
  } catch (err) {
    var type = componentType;
  }



  /**
   * HOP reference.
   */

  var has = Object.prototype.hasOwnProperty;

  /**
   * Iterate the given `obj` and invoke `fn(val, i)`
   * in optional context `ctx`.
   *
   * @param {String|Array|Object} obj
   * @param {Function} fn
   * @param {Object} [ctx]
   * @api public
   */

  var componentEach = function(obj, fn, ctx){
    fn = toFunction_1(fn);
    ctx = ctx || this;
    switch (type(obj)) {
      case 'array':
        return array(obj, fn, ctx);
      case 'object':
        if ('number' == typeof obj.length) return array(obj, fn, ctx);
        return object(obj, fn, ctx);
      case 'string':
        return string(obj, fn, ctx);
    }
  };

  /**
   * Iterate string chars.
   *
   * @param {String} obj
   * @param {Function} fn
   * @param {Object} ctx
   * @api private
   */

  function string(obj, fn, ctx) {
    for (var i = 0; i < obj.length; ++i) {
      fn.call(ctx, obj.charAt(i), i);
    }
  }

  /**
   * Iterate object keys.
   *
   * @param {Object} obj
   * @param {Function} fn
   * @param {Object} ctx
   * @api private
   */

  function object(obj, fn, ctx) {
    for (var key in obj) {
      if (has.call(obj, key)) {
        fn.call(ctx, key, obj[key]);
      }
    }
  }

  /**
   * Iterate array-ish.
   *
   * @param {Array|Object} obj
   * @param {Function} fn
   * @param {Object} ctx
   * @api private
   */

  function array(obj, fn, ctx) {
    for (var i = 0; i < obj.length; ++i) {
      fn.call(ctx, obj[i], i);
    }
  }

  // import * as XMLHttpRequestNode from "Xmlhttprequest";
  /**
   * reject all null values from array/object
   * @param  {} obj
   * @param  {} fn
   */


  function rejectArr(obj, fn) {
    fn = fn || compact;
    return type$1(obj) == "array" ? rejectarray(obj, fn) : rejectobject(obj, fn);
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
  /**
   * check type of object incoming in the rejectArr function
   * @param  {} val
   */


  function type$1(val) {
    switch (toString.call(val)) {
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

  const ScriptLoader = (id, src) => {
    logger.debug(`in script loader=== ${id}`);
    const js = document.createElement("script");
    js.src = src; //js.async = true;

    js.async = false;
    js.type = "text/javascript";
    js.id = id;
    const e = document.getElementsByTagName("script")[0]; //logger.debug("==script==", e);

    e.parentNode.insertBefore(js, e);
  };

  /* eslint-disable class-methods-use-this */
  class GA {
    constructor(config) {
      this.trackingID = config.trackingID;
      this.sendUserId = config.sendUserId || false;
      this.dimensions = config.dimensions || [];
      this.metrics = config.metrics || [];
      this.contentGroupings = config.contentGroupings || [];
      this.nonInteraction = config.nonInteraction || false;
      this.anonymizeIp = config.anonymizeIp || false;
      this.useGoogleAmpClientId = config.useGoogleAmpClientId || false;
      this.domain = config.domain || "auto";
      this.doubleClick = config.doubleClick || false;
      this.enhancedEcommerce = config.enhancedEcommerce || false;
      this.enhancedLinkAttribution = config.enhancedLinkAttribution || false;
      this.includeSearch = config.includeSearch || false;
      this.setAllMappedProps = config.setAllMappedProps || true;
      this.siteSpeedSampleRate = config.siteSpeedSampleRate || 1;
      this.sampleRate = config.sampleRate || 100;
      this.trackCategorizedPages = config.trackCategorizedPages || true;
      this.trackNamedPages = config.trackNamedPages || true;
      this.optimizeContainerId = config.optimize || "";
      this.resetCustomDimensionsOnPage = config.resetCustomDimensionsOnPage || [];
      this.enhancedEcommerceLoaded = 0;
      this.name = "GA";
      this.eventWithCategoryFieldProductScoped = ["product clicked", "product added", "product viewed", "product removed"];
    }

    loadScript() {
      ScriptLoader("google-analytics", "https://www.google-analytics.com/analytics.js");
    }

    init() {
      this.pageCalled = false;
      this.dimensionsArray = {};
      let elementTo;
      this.dimensions.forEach(element => {
        if (element.to.startsWith("dimension")) {
          this.dimensionsArray[element.from] = element.to;
        } else {
          /* eslint-disable no-param-reassign */
          elementTo = element.to.replace(/cd/g, "dimension");
          this.dimensionsArray[element.from] = elementTo;
        }
      });
      this.metricsArray = {};
      this.metrics.forEach(element => {
        if (element.to.startsWith("dimension")) {
          this.metricsArray[element.from] = element.to;
        } else {
          elementTo = element.to.replace(/cm/g, "metric");
          this.metricsArray[element.from] = elementTo;
        }
      });
      this.contentGroupingsArray = {};
      this.contentGroupings.forEach(element => {
        this.contentGroupingsArray[element.from] = element.to;
      });
      window.GoogleAnalyticsObject = "ga";

      window.ga = window.ga || function a() {
        window.ga.q = window.ga.q || [];
        window.ga.q.push(arguments);
      };

      window.ga.l = new Date().getTime();
      this.loadScript(); // create ga with these properties. if the properties are empty it will take default values.

      const config = {
        cookieDomain: this.domain || GA.prototype.defaults.domain,
        siteSpeedSampleRate: this.siteSpeedSampleRate,
        sampleRate: this.sampleRate,
        allowLinker: true,
        useAmpClientId: this.useGoogleAmpClientId
      };
      window.ga("create", this.trackingID, config);

      if (this.optimizeContainerId) {
        window.ga("require", this.optimizeContainerId);
      } // ecommerce is required


      if (!this.ecommerce) {
        window.ga("require", "ecommerce");
        this.ecommerce = true;
      } // this is to display advertising


      if (this.doubleClick) {
        window.ga("require", "displayfeatures");
      } // https://support.google.com/analytics/answer/2558867?hl=en


      if (this.enhancedLinkAttribution) {
        window.ga("require", "linkid");
      } // a warning is in ga debugger if anonymize is false after initialization


      if (this.anonymizeIp) {
        window.ga("set", "anonymizeIp", true);
      }

      logger.debug("===in init GA===");
    }

    identify(rudderElement) {
      // send global id
      if (this.sendUserId && rudderElement.message.userId) {
        window.ga("set", "userId", rudderElement.message.userId);
      } // custom dimensions and metrics


      const custom = this.metricsFunction(rudderElement.message.context.traits, this.dimensionsArray, this.metricsArray, this.contentGroupingsArray);

      if (Object.keys(custom).length) {
        window.ga("set", custom);
      }

      logger.debug("in GoogleAnalyticsManager identify");
    }

    track(rudderElement) {
      const self = this; // Ecommerce events

      const {
        event,
        properties,
        name
      } = rudderElement.message;
      const options = this.extractCheckoutOptions(rudderElement);
      const props = rudderElement.message.properties;
      const {
        products
      } = properties;
      let {
        total
      } = properties;
      const data = {};
      const eventCategory = rudderElement.message.properties.category;
      const orderId = properties.order_id;
      const eventAction = event || name || "";
      const eventLabel = rudderElement.message.properties.label;
      let eventValue = "";
      let payload;
      const {
        campaign
      } = rudderElement.message.context;
      let params;
      let filters;
      let sorts;

      if (event === "Order Completed" && !this.enhancedEcommerce) {
        // order_id is required
        if (!orderId) {
          logger.debug("order_id not present events are not sent to GA");
          return;
        } // add transaction


        window.ga("ecommerce:addTransaction", {
          affiliation: properties.affiliation,
          shipping: properties.shipping,
          revenue: total,
          tax: properties.tax,
          id: orderId,
          currency: properties.currency
        }); // products added

        products.forEach(product => {
          const productTrack = self.createProductTrack(rudderElement, product);
          window.ga("ecommerce:addItem", {
            category: productTrack.properties.category,
            quantity: productTrack.properties.quantity,
            price: productTrack.properties.price,
            name: productTrack.properties.name,
            sku: productTrack.properties.sku,
            id: orderId,
            currency: productTrack.properties.currency
          });
        });
        window.ga("ecommerce:send");
      } // enhanced ecommerce events
      else if (this.enhancedEcommerce) {
          switch (event) {
            case "Checkout Started":
            case "Checkout Step Viewed":
            case "Order Updated":
              this.loadEnhancedEcommerce(rudderElement);
              componentEach(products, product => {
                let productTrack = self.createProductTrack(rudderElement, product);
                productTrack = {
                  message: productTrack
                };
                self.enhancedEcommerceTrackProduct(productTrack);
              });
              window.ga("ec:setAction", "checkout", {
                step: properties.step || 1,
                option: options || undefined
              });
              this.pushEnhancedEcommerce(rudderElement);
              break;

            case "Checkout Step Completed":
              if (!props.step) {
                logger.debug("step not present events are not sent to GA");
                return;
              }

              params = {
                step: props.step || 1,
                option: options || undefined
              };
              this.loadEnhancedEcommerce(rudderElement);
              window.ga("ec:setAction", "checkout_option", params);
              window.ga("send", "event", "Checkout", "Option");
              break;

            case "Order Completed":
              total = rudderElement.message.properties.total || rudderElement.message.properties.revenue || 0;

              if (!orderId) {
                logger.debug("order_id not present events are not sent to GA");
                return;
              }

              this.loadEnhancedEcommerce(rudderElement);
              componentEach(products, product => {
                let productTrack = self.createProductTrack(rudderElement, product);
                productTrack = {
                  message: productTrack
                };
                self.enhancedEcommerceTrackProduct(productTrack);
              });
              window.ga("ec:setAction", "purchase", {
                id: orderId,
                affiliation: props.affiliation,
                revenue: total,
                tax: props.tax,
                shipping: props.shipping,
                coupon: props.coupon
              });
              this.pushEnhancedEcommerce(rudderElement);
              break;

            case "Order Refunded":
              if (!orderId) {
                logger.debug("order_id not present events are not sent to GA");
                return;
              }

              this.loadEnhancedEcommerce(rudderElement);
              componentEach(products, product => {
                const track = {
                  properties: product
                };
                window.ga("ec:addProduct", {
                  id: track.properties.product_id || track.properties.id || track.properties.sku,
                  quantity: track.properties.quantity
                });
              });
              window.ga("ec:setAction", "refund", {
                id: orderId
              });
              this.pushEnhancedEcommerce(rudderElement);
              break;

            case "Product Added":
              this.loadEnhancedEcommerce(rudderElement);
              this.enhancedEcommerceTrackProductAction(rudderElement, "add", null);
              this.pushEnhancedEcommerce(rudderElement);
              break;

            case "Product Removed":
              this.loadEnhancedEcommerce(rudderElement);
              this.enhancedEcommerceTrackProductAction(rudderElement, "remove", null);
              this.pushEnhancedEcommerce(rudderElement);
              break;

            case "Product Viewed":
              this.loadEnhancedEcommerce(rudderElement);
              if (props.list) data.list = props.list;
              this.enhancedEcommerceTrackProductAction(rudderElement, "detail", data);
              this.pushEnhancedEcommerce(rudderElement);
              break;

            case "Product Clicked":
              this.loadEnhancedEcommerce(rudderElement);
              if (props.list) data.list = props.list;
              this.enhancedEcommerceTrackProductAction(rudderElement, "click", data);
              this.pushEnhancedEcommerce(rudderElement);
              break;

            case "Promotion Viewed":
              this.loadEnhancedEcommerce(rudderElement);
              window.ga("ec:addPromo", {
                id: props.promotion_id || props.id,
                name: props.name,
                creative: props.creative,
                position: props.position
              });
              this.pushEnhancedEcommerce(rudderElement);
              break;

            case "Promotion Clicked":
              this.loadEnhancedEcommerce(rudderElement);
              window.ga("ec:addPromo", {
                id: props.promotion_id || props.id,
                name: props.name,
                creative: props.creative,
                position: props.position
              });
              window.ga("ec:setAction", "promo_click", {});
              this.pushEnhancedEcommerce(rudderElement);
              break;

            case "Product List Viewed":
              this.loadEnhancedEcommerce(rudderElement);
              componentEach(products, product => {
                const item = {
                  properties: product
                };

                if (!(item.properties.product_id || item.properties.sku) && !item.properties.name) {
                  logger.debug("product_id/sku/name of product not present events are not sent to GA");
                  return;
                }

                let impressionObj = {
                  id: item.properties.product_id || item.properties.sku,
                  name: item.properties.name,
                  category: item.properties.category || props.category,
                  list: props.list_id || props.category || "products",
                  brand: item.properties.band,
                  variant: item.properties.variant,
                  price: item.properties.price,
                  position: self.getProductPosition(item, products)
                };
                impressionObj = { ...impressionObj,
                  ...self.metricsFunction(item.properties, self.dimensionsArray, self.metricsArray, self.contentGroupingsArray)
                };
                Object.keys(impressionObj).forEach(key => {
                  if (impressionObj[key] === undefined) delete impressionObj[key];
                });
                window.ga("ec:addImpression", impressionObj);
              });
              this.pushEnhancedEcommerce(rudderElement);
              break;

            case "Product List Filtered":
              props.filters = props.filters || [];
              props.sorters = props.sorters || [];
              filters = props.filters.map(obj => {
                return `${obj.type}:${obj.value}`;
              }).join();
              sorts = props.sorters.map(obj => {
                return `${obj.type}:${obj.value}`;
              }).join();
              this.loadEnhancedEcommerce(rudderElement);
              componentEach(products, product => {
                const item = {
                  properties: product
                };

                if (!(item.properties.product_id || item.properties.sku) && !item.properties.name) {
                  logger.debug("product_id/sku/name of product not present events are not sent to GA");
                  return;
                }

                let impressionObj = {
                  id: item.properties.product_id || item.sku,
                  name: item.name,
                  category: item.category || props.category,
                  list: props.list_id || props.category || "search results",
                  brand: props.brand,
                  variant: `${filters}::${sorts}`,
                  price: item.price,
                  position: self.getProductPosition(item, products)
                };
                impressionObj = {
                  impressionObj,
                  ...self.metricsFunction(item.properties, self.dimensionsArray, self.metricsArray, self.contentGroupingsArray)
                };
                Object.keys(impressionObj).forEach(key => {
                  if (impressionObj[key] === undefined) delete impressionObj[key];
                });
                window.ga("ec:addImpression", impressionObj);
              });
              this.pushEnhancedEcommerce(rudderElement);
              break;

            default:
              if (rudderElement.message.properties) {
                eventValue = rudderElement.message.properties.value ? rudderElement.message.properties.value : rudderElement.message.properties.revenue;
              }

              payload = {
                eventCategory: eventCategory || "All",
                eventAction,
                eventLabel,
                eventValue: this.formatValue(eventValue),
                // Allow users to override their nonInteraction integration setting for any single particluar event.
                nonInteraction: rudderElement.message.properties.nonInteraction !== undefined ? !!rudderElement.message.properties.nonInteraction : !!this.nonInteraction
              };

              if (campaign) {
                if (campaign.name) payload.campaignName = campaign.name;
                if (campaign.source) payload.campaignSource = campaign.source;
                if (campaign.medium) payload.campaignMedium = campaign.medium;
                if (campaign.content) payload.campaignContent = campaign.content;
                if (campaign.term) payload.campaignKeyword = campaign.term;
              }

              payload = {
                payload,
                ...this.setCustomDimenionsAndMetrics(rudderElement.message.properties)
              };
              window.ga("send", "event", payload.payload);
              logger.debug("in GoogleAnalyticsManager track");
          }
        } else {
          if (rudderElement.message.properties) {
            eventValue = rudderElement.message.properties.value ? rudderElement.message.properties.value : rudderElement.message.properties.revenue;
          }

          payload = {
            eventCategory: eventCategory || "All",
            eventAction,
            eventLabel,
            eventValue: this.formatValue(eventValue),
            // Allow users to override their nonInteraction integration setting for any single particluar event.
            nonInteraction: rudderElement.message.properties.nonInteraction !== undefined ? !!rudderElement.message.properties.nonInteraction : !!this.nonInteraction
          };

          if (campaign) {
            if (campaign.name) payload.campaignName = campaign.name;
            if (campaign.source) payload.campaignSource = campaign.source;
            if (campaign.medium) payload.campaignMedium = campaign.medium;
            if (campaign.content) payload.campaignContent = campaign.content;
            if (campaign.term) payload.campaignKeyword = campaign.term;
          }

          payload = {
            payload,
            ...this.setCustomDimenionsAndMetrics(rudderElement.message.properties)
          };
          window.ga("send", "event", payload.payload);
          logger.debug("in GoogleAnalyticsManager track");
        }
    }

    page(rudderElement) {
      logger.debug("in GoogleAnalyticsManager page");
      const {
        category
      } = rudderElement.message.properties;
      const eventProperties = rudderElement.message.properties;
      let name;

      if (rudderElement.message.properties.category && rudderElement.message.name) {
        name = `${rudderElement.message.properties.category} ${rudderElement.message.name}`;
      } else if (!rudderElement.message.properties.category && !rudderElement.message.name) {
        name = "";
      } else {
        name = rudderElement.message.name || rudderElement.message.properties.category;
      }

      const campaign = rudderElement.message.context.campaign || {};
      let pageview = {};
      const pagePath = this.path(eventProperties, this.includeSearch);
      const pageReferrer = rudderElement.message.properties.referrer || "";
      let pageTitle;
      if (!rudderElement.message.properties.category && !rudderElement.message.name) pageTitle = eventProperties.title;else if (!rudderElement.message.properties.category) pageTitle = rudderElement.message.name;else if (!rudderElement.message.name) pageTitle = rudderElement.message.properties.category;else pageTitle = name;
      pageview.page = pagePath;
      pageview.title = pageTitle;
      pageview.location = eventProperties.url;

      if (campaign) {
        if (campaign.name) pageview.campaignName = campaign.name;
        if (campaign.source) pageview.campaignSource = campaign.source;
        if (campaign.medium) pageview.campaignMedium = campaign.medium;
        if (campaign.content) pageview.campaignContent = campaign.content;
        if (campaign.term) pageview.campaignKeyword = campaign.term;
      }

      const resetCustomDimensions = {};

      for (let i = 0; i < this.resetCustomDimensionsOnPage.length; i += 1) {
        const property = this.resetCustomDimensionsOnPage[i].resetCustomDimensionsOnPage;

        if (this.dimensionsArray[property]) {
          resetCustomDimensions[this.dimensionsArray[property]] = null;
        }
      }

      window.ga("set", resetCustomDimensions); // adds more properties to pageview which will be sent

      pageview = { ...pageview,
        ...this.setCustomDimenionsAndMetrics(eventProperties)
      };
      const payload = {
        page: pagePath,
        title: pageTitle
      };
      logger.debug(pageReferrer);
      logger.debug(document.referrer);
      if (pageReferrer !== document.referrer) payload.referrer = pageReferrer;
      window.ga("set", payload);
      if (this.pageCalled) delete pageview.location;
      window.ga("send", "pageview", pageview); // categorized pages

      if (category && this.trackCategorizedPages) {
        this.track(rudderElement, {
          nonInteraction: 1
        });
      } // named pages


      if (name && this.trackNamedPages) {
        this.track(rudderElement, {
          nonInteraction: 1
        });
      }

      this.pageCalled = true;
    }

    isLoaded() {
      logger.debug("in GA isLoaded");
      return !!window.gaplugins;
    }

    isReady() {
      return !!window.gaplugins;
    }
    /**
     *
     *
     * @param  {} obj  incoming properties
     * @param  {} dimensions   the dimension mapping which is entered by the user in the ui. Eg: firstName : dimension1
     * @param  {} metrics  the metrics mapping which is entered by the user in the ui. Eg: age : metrics1
     * @param  {} contentGroupings the contentGrouping mapping which is entered by the user in the ui. Eg: section : contentGrouping1
     *
     * This function maps these dimensions,metrics and contentGroupings with the incoming properties to send it to GA where the user has to set the corresponding dimension/metric/content group.
     * For example if:
     * if obj -> {age: 24}
     * metrics -> {age: metric1}
     * then the function will return {metric1:24} and it will be shown sent to GA if metric1 is set there.
     *
     * if obj -> {age: 24}
     * metrics - {revenue: metric2}
     * then the function will return {} as there is no corresponding mapping of metric.
     *
     */


    metricsFunction(obj, dimensions, metrics, contentGroupings) {
      const ret = {};
      componentEach([metrics, dimensions, contentGroupings], group => {
        componentEach(group, (prop, key) => {
          let value = obj[prop];
          if (is_1.boolean(value)) value = value.toString();
          if (value || value === 0) ret[key] = value;
        });
      });
      return ret;
    }

    formatValue(value) {
      if (!value || value < 0) return 0;
      return Math.round(value);
    }
    /**
     * @param  {} props
     * @param  {} inputs
     */


    setCustomDimenionsAndMetrics(props) {
      const ret = {};
      const custom = this.metricsFunction(props, this.dimensionsArray, this.metricsArray, this.contentGroupingsArray);

      if (Object.keys(custom).length) {
        if (this.setAllMappedProps) {
          window.ga("set", custom);
        } else {
          Object.keys(custom).forEach(key => {
            ret[key] = custom[key];
          }); // each(custom, (key, value) => {
          //   ret[key] = value;
          // });
        }
      }

      return ret;
    }
    /**
     *  Return the path based on `properties` and `options`
     *
     * @param  {} properties
     * @param  {} includeSearch
     */


    path(properties, includeSearch) {
      let str = properties.path;

      if (properties) {
        if (includeSearch && properties.search) {
          str += properties.search;
        }
      }

      return str;
    }
    /**
     * Creates a track out of product properties
     * @param  {} rudderElement
     * @param  {} properties
     */


    createProductTrack(rudderElement, properties) {
      const props = properties || {};
      props.currency = properties.currency || rudderElement.message.properties.currency;
      return {
        properties: props
      };
    }
    /**
     * Loads ec.js (unless already loaded)
     * @param  {} rudderElement
     * @param  {} a
     */


    loadEnhancedEcommerce(rudderElement) {
      if (this.enhancedEcommerceLoaded === 0) {
        window.ga("require", "ec");
        this.enhancedEcommerceLoaded = 1;
      }

      window.ga("set", "&cu", rudderElement.message.properties.currency);
    }
    /**
     * helper class to not repeat `ec:addProduct`
     * @param  {} rudderElement
     * @param  {} inputs
     */


    enhancedEcommerceTrackProduct(rudderElement) {
      const props = rudderElement.message.properties;
      let product = {
        id: props.product_id || props.id || props.sku,
        name: props.name,
        category: props.category,
        quantity: props.quantity,
        price: props.price,
        brand: props.brand,
        variant: props.variant,
        currency: props.currency
      };

      if (props.position != null) {
        product.position = Math.round(props.position);
      }

      const {
        coupon
      } = props;
      if (coupon) product.coupon = coupon;
      product = { ...product,
        ...this.metricsFunction(props, this.dimensionsArray, this.metricsArray, this.contentGroupingsArray)
      };
      window.ga("ec:addProduct", product);
    }
    /**
     * set action with data
     * @param  {} rudderElement
     * @param  {} action
     * @param  {} data
     * @param  {} inputs
     */


    enhancedEcommerceTrackProductAction(rudderElement, action, data) {
      this.enhancedEcommerceTrackProduct(rudderElement);
      window.ga("ec:setAction", action, data || {});
    }
    /**
     * @param  {} rudderElement
     * @param  {} inputs
     */


    pushEnhancedEcommerce(rudderElement) {
      const args = rejectArr(["send", "event", rudderElement.message.properties.category || "EnhancedEcommerce", rudderElement.message.event || "Action not defined", rudderElement.message.properties.label, {
        nonInteraction: 1,
        ...this.setCustomDimenionsAndMetrics(rudderElement.message.properties)
      }]);
      let {
        event
      } = rudderElement.message;
      event = event.toLowerCase();

      if (this.eventWithCategoryFieldProductScoped.includes(event)) {
        args[2] = "EnhancedEcommerce";
      }

      window.ga.call(window, ...args);
    }
    /**
     * @param  {} item
     * @param  {} products
     */


    getProductPosition(item, products) {
      const {
        position
      } = item.properties;

      if (typeof position !== "undefined" && !Number.isNaN(Number(position)) && Number(position) > -1) {
        return position;
      }

      return products.map(x => {
        return x.product_id;
      }).indexOf(item.properties.product_id) + 1;
    }
    /**
     *extracts checkout options
     * @param  {} rudderElement
     */


    extractCheckoutOptions(rudderElement) {
      const options = [rudderElement.message.properties.paymentMethod, rudderElement.message.properties.shippingMethod]; // remove all nulls and join with commas.

      const valid = rejectArr(options);
      return valid.length > 0 ? valid.join(", ") : null;
    }

  }

  var index =  GA ;

  return index;

}());
