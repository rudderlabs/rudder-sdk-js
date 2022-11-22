// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.
(() => {
    //======================== npm package code ==========================================
    (function (global, factory) {
        typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
            typeof define === 'function' && define.amd ? define(['exports'], factory) :
                (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rudderanalytics = {}));
    })(this, (function (exports) {
        'use strict';

        function ownKeys(object, enumerableOnly) {
            var keys = Object.keys(object);

            if (Object.getOwnPropertySymbols) {
                var symbols = Object.getOwnPropertySymbols(object);
                enumerableOnly && (symbols = symbols.filter(function (sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                })), keys.push.apply(keys, symbols);
            }

            return keys;
        }

        function _objectSpread2(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = null != arguments[i] ? arguments[i] : {};
                i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
                    _defineProperty(target, key, source[key]);
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                });
            }

            return target;
        }

        function _typeof(obj) {
            "@babel/helpers - typeof";

            return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
                return typeof obj;
            } : function (obj) {
                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            }, _typeof(obj);
        }

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps) _defineProperties(Constructor.prototype, protoProps);
            if (staticProps) _defineProperties(Constructor, staticProps);
            Object.defineProperty(Constructor, "prototype", {
                writable: false
            });
            return Constructor;
        }

        function _defineProperty(obj, key, value) {
            if (key in obj) {
                Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true
                });
            } else {
                obj[key] = value;
            }

            return obj;
        }

        function _extends() {
            _extends = Object.assign ? Object.assign.bind() : function (target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];

                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }

                return target;
            };
            return _extends.apply(this, arguments);
        }

        function _toConsumableArray(arr) {
            return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
        }

        function _arrayWithoutHoles(arr) {
            if (Array.isArray(arr)) return _arrayLikeToArray(arr);
        }

        function _iterableToArray(iter) {
            if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
        }

        function _unsupportedIterableToArray(o, minLen) {
            if (!o) return;
            if (typeof o === "string") return _arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if (n === "Object" && o.constructor) n = o.constructor.name;
            if (n === "Map" || n === "Set") return Array.from(o);
            if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
        }

        function _arrayLikeToArray(arr, len) {
            if (len == null || len > arr.length) len = arr.length;

            for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

            return arr2;
        }

        function _nonIterableSpread() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }

        var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

        function getAugmentedNamespace(n) {
            var f = n.default;
            if (typeof f == "function") {
                var a = function () {
                    return f.apply(this, arguments);
                };
                a.prototype = f.prototype;
            } else a = {};
            Object.defineProperty(a, '__esModule', {value: true});
            Object.keys(n).forEach(function (k) {
                var d = Object.getOwnPropertyDescriptor(n, k);
                Object.defineProperty(a, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return n[k];
                    }
                });
            });
            return a;
        }

        var componentEmitter = {exports: {}};

        (function (module) {
            /**
             * Expose `Emitter`.
             */
            {
                module.exports = Emitter;
            }

            /**
             * Initialize a new `Emitter`.
             *
             * @api public
             */


            function Emitter(obj) {
                if (obj) return mixin(obj);
            }

            /**
             * Mixin the emitter properties.
             *
             * @param {Object} obj
             * @return {Object}
             * @api private
             */

            function mixin(obj) {
                for (var key in Emitter.prototype) {
                    obj[key] = Emitter.prototype[key];
                }

                return obj;
            }

            /**
             * Listen on the given `event` with `fn`.
             *
             * @param {String} event
             * @param {Function} fn
             * @return {Emitter}
             * @api public
             */


            Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
                this._callbacks = this._callbacks || {};
                (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
                return this;
            };
            /**
             * Adds an `event` listener that will be invoked a single
             * time then automatically removed.
             *
             * @param {String} event
             * @param {Function} fn
             * @return {Emitter}
             * @api public
             */


            Emitter.prototype.once = function (event, fn) {
                function on() {
                    this.off(event, on);
                    fn.apply(this, arguments);
                }

                on.fn = fn;
                this.on(event, on);
                return this;
            };
            /**
             * Remove the given callback for `event` or all
             * registered callbacks.
             *
             * @param {String} event
             * @param {Function} fn
             * @return {Emitter}
             * @api public
             */


            Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
                this._callbacks = this._callbacks || {}; // all

                if (0 == arguments.length) {
                    this._callbacks = {};
                    return this;
                } // specific event


                var callbacks = this._callbacks['$' + event];
                if (!callbacks) return this; // remove all handlers

                if (1 == arguments.length) {
                    delete this._callbacks['$' + event];
                    return this;
                } // remove specific handler


                var cb;

                for (var i = 0; i < callbacks.length; i++) {
                    cb = callbacks[i];

                    if (cb === fn || cb.fn === fn) {
                        callbacks.splice(i, 1);
                        break;
                    }
                } // Remove event specific arrays for event types that no
                // one is subscribed for to avoid memory leak.


                if (callbacks.length === 0) {
                    delete this._callbacks['$' + event];
                }

                return this;
            };
            /**
             * Emit `event` with the given args.
             *
             * @param {String} event
             * @param {Mixed} ...
             * @return {Emitter}
             */


            Emitter.prototype.emit = function (event) {
                this._callbacks = this._callbacks || {};
                var args = new Array(arguments.length - 1),
                    callbacks = this._callbacks['$' + event];

                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }

                if (callbacks) {
                    callbacks = callbacks.slice(0);

                    for (var i = 0, len = callbacks.length; i < len; ++i) {
                        callbacks[i].apply(this, args);
                    }
                }

                return this;
            };
            /**
             * Return array of callbacks for `event`.
             *
             * @param {String} event
             * @return {Array}
             * @api public
             */


            Emitter.prototype.listeners = function (event) {
                this._callbacks = this._callbacks || {};
                return this._callbacks['$' + event] || [];
            };
            /**
             * Check if this emitter has `event` handlers.
             *
             * @param {String} event
             * @return {Boolean}
             * @api public
             */


            Emitter.prototype.hasListeners = function (event) {
                return !!this.listeners(event).length;
            };
        })(componentEmitter);

        var Emitter$1 = componentEmitter.exports;

        var trim$2 = {exports: {}};

        (function (module, exports) {
            exports = module.exports = trim;

            function trim(str) {
                if (str.trim) return str.trim();
                return exports.right(exports.left(str));
            }

            exports.left = function (str) {
                if (str.trimLeft) return str.trimLeft();
                return str.replace(/^\s\s*/, '');
            };

            exports.right = function (str) {
                if (str.trimRight) return str.trimRight();
                var whitespace_pattern = /\s/,
                    i = str.length;

                while (whitespace_pattern.test(str.charAt(--i))) {
                }

                return str.slice(0, i + 1);
            };
        })(trim$2, trim$2.exports);

        /**
         * Module dependencies.
         */

        var trim$1 = trim$2.exports;
        var pattern = /(\w+)\[(\d+)\]/;
        /**
         * Safely decode the string
         *
         * @param {String} str
         * @return {String}
         * @api private
         */


        var decode$3 = function decode(str) {
            try {
                return decodeURIComponent(str.replace(/\+/g, ' '));
            } catch (e) {
                return str;
            }
        };
        /**
         * Parse the given query `str`.
         *
         * @param {String} str
         * @return {Object}
         * @api public
         */


        var parse$6 = function (str) {
            if ('string' != typeof str) return {};
            str = trim$1(str);
            if ('' == str) return {};
            if ('?' == str.charAt(0)) str = str.slice(1);
            var obj = {};
            var pairs = str.split('&');

            for (var i = 0; i < pairs.length; i++) {
                var parts = pairs[i].split('=');
                var key = decode$3(parts[0]);
                var m;

                if (m = pattern.exec(key)) {
                    obj[m[1]] = obj[m[1]] || [];
                    obj[m[1]][m[2]] = decode$3(parts[1]);
                    continue;
                }

                obj[parts[0]] = null == parts[1] ? '' : decode$3(parts[1]);
            }

            return obj;
        };

        var lodash_merge = {exports: {}};

        (function (module, exports) {
            /** Used as the size to enable large array optimizations. */
            var LARGE_ARRAY_SIZE = 200;
            /** Used to stand-in for `undefined` hash values. */

            var HASH_UNDEFINED = '__lodash_hash_undefined__';
            /** Used to detect hot functions by number of calls within a span of milliseconds. */

            var HOT_COUNT = 800,
                HOT_SPAN = 16;
            /** Used as references for various `Number` constants. */

            var MAX_SAFE_INTEGER = 9007199254740991;
            /** `Object#toString` result references. */

            var argsTag = '[object Arguments]',
                arrayTag = '[object Array]',
                asyncTag = '[object AsyncFunction]',
                boolTag = '[object Boolean]',
                dateTag = '[object Date]',
                errorTag = '[object Error]',
                funcTag = '[object Function]',
                genTag = '[object GeneratorFunction]',
                mapTag = '[object Map]',
                numberTag = '[object Number]',
                nullTag = '[object Null]',
                objectTag = '[object Object]',
                proxyTag = '[object Proxy]',
                regexpTag = '[object RegExp]',
                setTag = '[object Set]',
                stringTag = '[object String]',
                undefinedTag = '[object Undefined]',
                weakMapTag = '[object WeakMap]';
            var arrayBufferTag = '[object ArrayBuffer]',
                dataViewTag = '[object DataView]',
                float32Tag = '[object Float32Array]',
                float64Tag = '[object Float64Array]',
                int8Tag = '[object Int8Array]',
                int16Tag = '[object Int16Array]',
                int32Tag = '[object Int32Array]',
                uint8Tag = '[object Uint8Array]',
                uint8ClampedTag = '[object Uint8ClampedArray]',
                uint16Tag = '[object Uint16Array]',
                uint32Tag = '[object Uint32Array]';
            /**
             * Used to match `RegExp`
             * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
             */

            var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
            /** Used to detect host constructors (Safari). */

            var reIsHostCtor = /^\[object .+?Constructor\]$/;
            /** Used to detect unsigned integer values. */

            var reIsUint = /^(?:0|[1-9]\d*)$/;
            /** Used to identify `toStringTag` values of typed arrays. */

            var typedArrayTags = {};
            typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
            typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
            /** Detect free variable `global` from Node.js. */

            var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
            /** Detect free variable `self`. */

            var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
            /** Used as a reference to the global object. */

            var root = freeGlobal || freeSelf || Function('return this')();
            /** Detect free variable `exports`. */

            var freeExports = exports && !exports.nodeType && exports;
            /** Detect free variable `module`. */

            var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
            /** Detect the popular CommonJS extension `module.exports`. */

            var moduleExports = freeModule && freeModule.exports === freeExports;
            /** Detect free variable `process` from Node.js. */

            var freeProcess = moduleExports && freeGlobal.process;
            /** Used to access faster Node.js helpers. */

            var nodeUtil = function () {
                try {
                    // Use `util.types` for Node.js 10+.
                    var types = freeModule && freeModule.require && freeModule.require('util').types;

                    if (types) {
                        return types;
                    } // Legacy `process.binding('util')` for Node.js < 10.


                    return freeProcess && freeProcess.binding && freeProcess.binding('util');
                } catch (e) {
                }
            }();
            /* Node.js helper references. */


            var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

            /**
             * A faster alternative to `Function#apply`, this function invokes `func`
             * with the `this` binding of `thisArg` and the arguments of `args`.
             *
             * @private
             * @param {Function} func The function to invoke.
             * @param {*} thisArg The `this` binding of `func`.
             * @param {Array} args The arguments to invoke `func` with.
             * @returns {*} Returns the result of `func`.
             */

            function apply(func, thisArg, args) {
                switch (args.length) {
                    case 0:
                        return func.call(thisArg);

                    case 1:
                        return func.call(thisArg, args[0]);

                    case 2:
                        return func.call(thisArg, args[0], args[1]);

                    case 3:
                        return func.call(thisArg, args[0], args[1], args[2]);
                }

                return func.apply(thisArg, args);
            }

            /**
             * The base implementation of `_.times` without support for iteratee shorthands
             * or max array length checks.
             *
             * @private
             * @param {number} n The number of times to invoke `iteratee`.
             * @param {Function} iteratee The function invoked per iteration.
             * @returns {Array} Returns the array of results.
             */


            function baseTimes(n, iteratee) {
                var index = -1,
                    result = Array(n);

                while (++index < n) {
                    result[index] = iteratee(index);
                }

                return result;
            }

            /**
             * The base implementation of `_.unary` without support for storing metadata.
             *
             * @private
             * @param {Function} func The function to cap arguments for.
             * @returns {Function} Returns the new capped function.
             */


            function baseUnary(func) {
                return function (value) {
                    return func(value);
                };
            }

            /**
             * Gets the value at `key` of `object`.
             *
             * @private
             * @param {Object} [object] The object to query.
             * @param {string} key The key of the property to get.
             * @returns {*} Returns the property value.
             */


            function getValue(object, key) {
                return object == null ? undefined : object[key];
            }

            /**
             * Creates a unary function that invokes `func` with its argument transformed.
             *
             * @private
             * @param {Function} func The function to wrap.
             * @param {Function} transform The argument transform.
             * @returns {Function} Returns the new function.
             */


            function overArg(func, transform) {
                return function (arg) {
                    return func(transform(arg));
                };
            }

            /** Used for built-in method references. */


            var arrayProto = Array.prototype,
                funcProto = Function.prototype,
                objectProto = Object.prototype;
            /** Used to detect overreaching core-js shims. */

            var coreJsData = root['__core-js_shared__'];
            /** Used to resolve the decompiled source of functions. */

            var funcToString = funcProto.toString;
            /** Used to check objects for own properties. */

            var hasOwnProperty = objectProto.hasOwnProperty;
            /** Used to detect methods masquerading as native. */

            var maskSrcKey = function () {
                var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
                return uid ? 'Symbol(src)_1.' + uid : '';
            }();
            /**
             * Used to resolve the
             * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
             * of values.
             */


            var nativeObjectToString = objectProto.toString;
            /** Used to infer the `Object` constructor. */

            var objectCtorString = funcToString.call(Object);
            /** Used to detect if a method is native. */

            var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
            /** Built-in value references. */

            var Buffer = moduleExports ? root.Buffer : undefined,
                _Symbol = root.Symbol,
                Uint8Array = root.Uint8Array,
                allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
                getPrototype = overArg(Object.getPrototypeOf, Object),
                objectCreate = Object.create,
                propertyIsEnumerable = objectProto.propertyIsEnumerable,
                splice = arrayProto.splice,
                symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

            var defineProperty = function () {
                try {
                    var func = getNative(Object, 'defineProperty');
                    func({}, '', {});
                    return func;
                } catch (e) {
                }
            }();
            /* Built-in method references for those with the same name as other `lodash` methods. */


            var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
                nativeMax = Math.max,
                nativeNow = Date.now;
            /* Built-in method references that are verified to be native. */

            var Map = getNative(root, 'Map'),
                nativeCreate = getNative(Object, 'create');
            /**
             * The base implementation of `_.create` without support for assigning
             * properties to the created object.
             *
             * @private
             * @param {Object} proto The object to inherit from.
             * @returns {Object} Returns the new object.
             */

            var baseCreate = function () {
                function object() {
                }

                return function (proto) {
                    if (!isObject(proto)) {
                        return {};
                    }

                    if (objectCreate) {
                        return objectCreate(proto);
                    }

                    object.prototype = proto;
                    var result = new object();
                    object.prototype = undefined;
                    return result;
                };
            }();

            /**
             * Creates a hash object.
             *
             * @private
             * @constructor
             * @param {Array} [entries] The key-value pairs to cache.
             */


            function Hash(entries) {
                var index = -1,
                    length = entries == null ? 0 : entries.length;
                this.clear();

                while (++index < length) {
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            }

            /**
             * Removes all key-value entries from the hash.
             *
             * @private
             * @name clear
             * @memberOf Hash
             */


            function hashClear() {
                this.__data__ = nativeCreate ? nativeCreate(null) : {};
                this.size = 0;
            }

            /**
             * Removes `key` and its value from the hash.
             *
             * @private
             * @name delete
             * @memberOf Hash
             * @param {Object} hash The hash to modify.
             * @param {string} key The key of the value to remove.
             * @returns {boolean} Returns `true` if the entry was removed, else `false`.
             */


            function hashDelete(key) {
                var result = this.has(key) && delete this.__data__[key];
                this.size -= result ? 1 : 0;
                return result;
            }

            /**
             * Gets the hash value for `key`.
             *
             * @private
             * @name get
             * @memberOf Hash
             * @param {string} key The key of the value to get.
             * @returns {*} Returns the entry value.
             */


            function hashGet(key) {
                var data = this.__data__;

                if (nativeCreate) {
                    var result = data[key];
                    return result === HASH_UNDEFINED ? undefined : result;
                }

                return hasOwnProperty.call(data, key) ? data[key] : undefined;
            }

            /**
             * Checks if a hash value for `key` exists.
             *
             * @private
             * @name has
             * @memberOf Hash
             * @param {string} key The key of the entry to check.
             * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
             */


            function hashHas(key) {
                var data = this.__data__;
                return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
            }

            /**
             * Sets the hash `key` to `value`.
             *
             * @private
             * @name set
             * @memberOf Hash
             * @param {string} key The key of the value to set.
             * @param {*} value The value to set.
             * @returns {Object} Returns the hash instance.
             */


            function hashSet(key, value) {
                var data = this.__data__;
                this.size += this.has(key) ? 0 : 1;
                data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
                return this;
            } // Add methods to `Hash`.


            Hash.prototype.clear = hashClear;
            Hash.prototype['delete'] = hashDelete;
            Hash.prototype.get = hashGet;
            Hash.prototype.has = hashHas;
            Hash.prototype.set = hashSet;

            /**
             * Creates an list cache object.
             *
             * @private
             * @constructor
             * @param {Array} [entries] The key-value pairs to cache.
             */

            function ListCache(entries) {
                var index = -1,
                    length = entries == null ? 0 : entries.length;
                this.clear();

                while (++index < length) {
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            }

            /**
             * Removes all key-value entries from the list cache.
             *
             * @private
             * @name clear
             * @memberOf ListCache
             */


            function listCacheClear() {
                this.__data__ = [];
                this.size = 0;
            }

            /**
             * Removes `key` and its value from the list cache.
             *
             * @private
             * @name delete
             * @memberOf ListCache
             * @param {string} key The key of the value to remove.
             * @returns {boolean} Returns `true` if the entry was removed, else `false`.
             */


            function listCacheDelete(key) {
                var data = this.__data__,
                    index = assocIndexOf(data, key);

                if (index < 0) {
                    return false;
                }

                var lastIndex = data.length - 1;

                if (index == lastIndex) {
                    data.pop();
                } else {
                    splice.call(data, index, 1);
                }

                --this.size;
                return true;
            }

            /**
             * Gets the list cache value for `key`.
             *
             * @private
             * @name get
             * @memberOf ListCache
             * @param {string} key The key of the value to get.
             * @returns {*} Returns the entry value.
             */


            function listCacheGet(key) {
                var data = this.__data__,
                    index = assocIndexOf(data, key);
                return index < 0 ? undefined : data[index][1];
            }

            /**
             * Checks if a list cache value for `key` exists.
             *
             * @private
             * @name has
             * @memberOf ListCache
             * @param {string} key The key of the entry to check.
             * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
             */


            function listCacheHas(key) {
                return assocIndexOf(this.__data__, key) > -1;
            }

            /**
             * Sets the list cache `key` to `value`.
             *
             * @private
             * @name set
             * @memberOf ListCache
             * @param {string} key The key of the value to set.
             * @param {*} value The value to set.
             * @returns {Object} Returns the list cache instance.
             */


            function listCacheSet(key, value) {
                var data = this.__data__,
                    index = assocIndexOf(data, key);

                if (index < 0) {
                    ++this.size;
                    data.push([key, value]);
                } else {
                    data[index][1] = value;
                }

                return this;
            } // Add methods to `ListCache`.


            ListCache.prototype.clear = listCacheClear;
            ListCache.prototype['delete'] = listCacheDelete;
            ListCache.prototype.get = listCacheGet;
            ListCache.prototype.has = listCacheHas;
            ListCache.prototype.set = listCacheSet;

            /**
             * Creates a map cache object to store key-value pairs.
             *
             * @private
             * @constructor
             * @param {Array} [entries] The key-value pairs to cache.
             */

            function MapCache(entries) {
                var index = -1,
                    length = entries == null ? 0 : entries.length;
                this.clear();

                while (++index < length) {
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            }

            /**
             * Removes all key-value entries from the map.
             *
             * @private
             * @name clear
             * @memberOf MapCache
             */


            function mapCacheClear() {
                this.size = 0;
                this.__data__ = {
                    'hash': new Hash(),
                    'map': new (Map || ListCache)(),
                    'string': new Hash()
                };
            }

            /**
             * Removes `key` and its value from the map.
             *
             * @private
             * @name delete
             * @memberOf MapCache
             * @param {string} key The key of the value to remove.
             * @returns {boolean} Returns `true` if the entry was removed, else `false`.
             */


            function mapCacheDelete(key) {
                var result = getMapData(this, key)['delete'](key);
                this.size -= result ? 1 : 0;
                return result;
            }

            /**
             * Gets the map value for `key`.
             *
             * @private
             * @name get
             * @memberOf MapCache
             * @param {string} key The key of the value to get.
             * @returns {*} Returns the entry value.
             */


            function mapCacheGet(key) {
                return getMapData(this, key).get(key);
            }

            /**
             * Checks if a map value for `key` exists.
             *
             * @private
             * @name has
             * @memberOf MapCache
             * @param {string} key The key of the entry to check.
             * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
             */


            function mapCacheHas(key) {
                return getMapData(this, key).has(key);
            }

            /**
             * Sets the map `key` to `value`.
             *
             * @private
             * @name set
             * @memberOf MapCache
             * @param {string} key The key of the value to set.
             * @param {*} value The value to set.
             * @returns {Object} Returns the map cache instance.
             */


            function mapCacheSet(key, value) {
                var data = getMapData(this, key),
                    size = data.size;
                data.set(key, value);
                this.size += data.size == size ? 0 : 1;
                return this;
            } // Add methods to `MapCache`.


            MapCache.prototype.clear = mapCacheClear;
            MapCache.prototype['delete'] = mapCacheDelete;
            MapCache.prototype.get = mapCacheGet;
            MapCache.prototype.has = mapCacheHas;
            MapCache.prototype.set = mapCacheSet;

            /**
             * Creates a stack cache object to store key-value pairs.
             *
             * @private
             * @constructor
             * @param {Array} [entries] The key-value pairs to cache.
             */

            function Stack(entries) {
                var data = this.__data__ = new ListCache(entries);
                this.size = data.size;
            }

            /**
             * Removes all key-value entries from the stack.
             *
             * @private
             * @name clear
             * @memberOf Stack
             */


            function stackClear() {
                this.__data__ = new ListCache();
                this.size = 0;
            }

            /**
             * Removes `key` and its value from the stack.
             *
             * @private
             * @name delete
             * @memberOf Stack
             * @param {string} key The key of the value to remove.
             * @returns {boolean} Returns `true` if the entry was removed, else `false`.
             */


            function stackDelete(key) {
                var data = this.__data__,
                    result = data['delete'](key);
                this.size = data.size;
                return result;
            }

            /**
             * Gets the stack value for `key`.
             *
             * @private
             * @name get
             * @memberOf Stack
             * @param {string} key The key of the value to get.
             * @returns {*} Returns the entry value.
             */


            function stackGet(key) {
                return this.__data__.get(key);
            }

            /**
             * Checks if a stack value for `key` exists.
             *
             * @private
             * @name has
             * @memberOf Stack
             * @param {string} key The key of the entry to check.
             * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
             */


            function stackHas(key) {
                return this.__data__.has(key);
            }

            /**
             * Sets the stack `key` to `value`.
             *
             * @private
             * @name set
             * @memberOf Stack
             * @param {string} key The key of the value to set.
             * @param {*} value The value to set.
             * @returns {Object} Returns the stack cache instance.
             */


            function stackSet(key, value) {
                var data = this.__data__;

                if (data instanceof ListCache) {
                    var pairs = data.__data__;

                    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
                        pairs.push([key, value]);
                        this.size = ++data.size;
                        return this;
                    }

                    data = this.__data__ = new MapCache(pairs);
                }

                data.set(key, value);
                this.size = data.size;
                return this;
            } // Add methods to `Stack`.


            Stack.prototype.clear = stackClear;
            Stack.prototype['delete'] = stackDelete;
            Stack.prototype.get = stackGet;
            Stack.prototype.has = stackHas;
            Stack.prototype.set = stackSet;

            /**
             * Creates an array of the enumerable property names of the array-like `value`.
             *
             * @private
             * @param {*} value The value to query.
             * @param {boolean} inherited Specify returning inherited property names.
             * @returns {Array} Returns the array of property names.
             */

            function arrayLikeKeys(value, inherited) {
                var isArr = isArray(value),
                    isArg = !isArr && isArguments(value),
                    isBuff = !isArr && !isArg && isBuffer(value),
                    isType = !isArr && !isArg && !isBuff && isTypedArray(value),
                    skipIndexes = isArr || isArg || isBuff || isType,
                    result = skipIndexes ? baseTimes(value.length, String) : [],
                    length = result.length;

                for (var key in value) {
                    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
                        key == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
                        isBuff && (key == 'offset' || key == 'parent') || // PhantomJS 2 has enumerable non-index properties on typed arrays.
                        isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || // Skip index properties.
                        isIndex(key, length)))) {
                        result.push(key);
                    }
                }

                return result;
            }

            /**
             * This function is like `assignValue` except that it doesn't assign
             * `undefined` values.
             *
             * @private
             * @param {Object} object The object to modify.
             * @param {string} key The key of the property to assign.
             * @param {*} value The value to assign.
             */


            function assignMergeValue(object, key, value) {
                if (value !== undefined && !eq(object[key], value) || value === undefined && !(key in object)) {
                    baseAssignValue(object, key, value);
                }
            }

            /**
             * Assigns `value` to `key` of `object` if the existing value is not equivalent
             * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
             * for equality comparisons.
             *
             * @private
             * @param {Object} object The object to modify.
             * @param {string} key The key of the property to assign.
             * @param {*} value The value to assign.
             */


            function assignValue(object, key, value) {
                var objValue = object[key];

                if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
                    baseAssignValue(object, key, value);
                }
            }

            /**
             * Gets the index at which the `key` is found in `array` of key-value pairs.
             *
             * @private
             * @param {Array} array The array to inspect.
             * @param {*} key The key to search for.
             * @returns {number} Returns the index of the matched value, else `-1`.
             */


            function assocIndexOf(array, key) {
                var length = array.length;

                while (length--) {
                    if (eq(array[length][0], key)) {
                        return length;
                    }
                }

                return -1;
            }

            /**
             * The base implementation of `assignValue` and `assignMergeValue` without
             * value checks.
             *
             * @private
             * @param {Object} object The object to modify.
             * @param {string} key The key of the property to assign.
             * @param {*} value The value to assign.
             */


            function baseAssignValue(object, key, value) {
                if (key == '__proto__' && defineProperty) {
                    defineProperty(object, key, {
                        'configurable': true,
                        'enumerable': true,
                        'value': value,
                        'writable': true
                    });
                } else {
                    object[key] = value;
                }
            }

            /**
             * The base implementation of `baseForOwn` which iterates over `object`
             * properties returned by `keysFunc` and invokes `iteratee` for each property.
             * Iteratee functions may exit iteration early by explicitly returning `false`.
             *
             * @private
             * @param {Object} object The object to iterate over.
             * @param {Function} iteratee The function invoked per iteration.
             * @param {Function} keysFunc The function to get the keys of `object`.
             * @returns {Object} Returns `object`.
             */


            var baseFor = createBaseFor();

            /**
             * The base implementation of `getTag` without fallbacks for buggy environments.
             *
             * @private
             * @param {*} value The value to query.
             * @returns {string} Returns the `toStringTag`.
             */

            function baseGetTag(value) {
                if (value == null) {
                    return value === undefined ? undefinedTag : nullTag;
                }

                return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
            }

            /**
             * The base implementation of `_.isArguments`.
             *
             * @private
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is an `arguments` object,
             */


            function baseIsArguments(value) {
                return isObjectLike(value) && baseGetTag(value) == argsTag;
            }

            /**
             * The base implementation of `_.isNative` without bad shim checks.
             *
             * @private
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a native function,
             *  else `false`.
             */


            function baseIsNative(value) {
                if (!isObject(value) || isMasked(value)) {
                    return false;
                }

                var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
                return pattern.test(toSource(value));
            }

            /**
             * The base implementation of `_.isTypedArray` without Node.js optimizations.
             *
             * @private
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
             */


            function baseIsTypedArray(value) {
                return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
            }

            /**
             * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
             *
             * @private
             * @param {Object} object The object to query.
             * @returns {Array} Returns the array of property names.
             */


            function baseKeysIn(object) {
                if (!isObject(object)) {
                    return nativeKeysIn(object);
                }

                var isProto = isPrototype(object),
                    result = [];

                for (var key in object) {
                    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
                        result.push(key);
                    }
                }

                return result;
            }

            /**
             * The base implementation of `_.merge` without support for multiple sources.
             *
             * @private
             * @param {Object} object The destination object.
             * @param {Object} source The source object.
             * @param {number} srcIndex The index of `source`.
             * @param {Function} [customizer] The function to customize merged values.
             * @param {Object} [stack] Tracks traversed source values and their merged
             *  counterparts.
             */


            function baseMerge(object, source, srcIndex, customizer, stack) {
                if (object === source) {
                    return;
                }

                baseFor(source, function (srcValue, key) {
                    stack || (stack = new Stack());

                    if (isObject(srcValue)) {
                        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
                    } else {
                        var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + '', object, source, stack) : undefined;

                        if (newValue === undefined) {
                            newValue = srcValue;
                        }

                        assignMergeValue(object, key, newValue);
                    }
                }, keysIn);
            }

            /**
             * A specialized version of `baseMerge` for arrays and objects which performs
             * deep merges and tracks traversed objects enabling objects with circular
             * references to be merged.
             *
             * @private
             * @param {Object} object The destination object.
             * @param {Object} source The source object.
             * @param {string} key The key of the value to merge.
             * @param {number} srcIndex The index of `source`.
             * @param {Function} mergeFunc The function to merge values.
             * @param {Function} [customizer] The function to customize assigned values.
             * @param {Object} [stack] Tracks traversed source values and their merged
             *  counterparts.
             */


            function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
                var objValue = safeGet(object, key),
                    srcValue = safeGet(source, key),
                    stacked = stack.get(srcValue);

                if (stacked) {
                    assignMergeValue(object, key, stacked);
                    return;
                }

                var newValue = customizer ? customizer(objValue, srcValue, key + '', object, source, stack) : undefined;
                var isCommon = newValue === undefined;

                if (isCommon) {
                    var isArr = isArray(srcValue),
                        isBuff = !isArr && isBuffer(srcValue),
                        isTyped = !isArr && !isBuff && isTypedArray(srcValue);
                    newValue = srcValue;

                    if (isArr || isBuff || isTyped) {
                        if (isArray(objValue)) {
                            newValue = objValue;
                        } else if (isArrayLikeObject(objValue)) {
                            newValue = copyArray(objValue);
                        } else if (isBuff) {
                            isCommon = false;
                            newValue = cloneBuffer(srcValue, true);
                        } else if (isTyped) {
                            isCommon = false;
                            newValue = cloneTypedArray(srcValue, true);
                        } else {
                            newValue = [];
                        }
                    } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
                        newValue = objValue;

                        if (isArguments(objValue)) {
                            newValue = toPlainObject(objValue);
                        } else if (!isObject(objValue) || isFunction(objValue)) {
                            newValue = initCloneObject(srcValue);
                        }
                    } else {
                        isCommon = false;
                    }
                }

                if (isCommon) {
                    // Recursively merge objects and arrays (susceptible to call stack limits).
                    stack.set(srcValue, newValue);
                    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
                    stack['delete'](srcValue);
                }

                assignMergeValue(object, key, newValue);
            }

            /**
             * The base implementation of `_.rest` which doesn't validate or coerce arguments.
             *
             * @private
             * @param {Function} func The function to apply a rest parameter to.
             * @param {number} [start=func.length-1] The start position of the rest parameter.
             * @returns {Function} Returns the new function.
             */


            function baseRest(func, start) {
                return setToString(overRest(func, start, identity), func + '');
            }

            /**
             * The base implementation of `setToString` without support for hot loop shorting.
             *
             * @private
             * @param {Function} func The function to modify.
             * @param {Function} string The `toString` result.
             * @returns {Function} Returns `func`.
             */


            var baseSetToString = !defineProperty ? identity : function (func, string) {
                return defineProperty(func, 'toString', {
                    'configurable': true,
                    'enumerable': false,
                    'value': constant(string),
                    'writable': true
                });
            };

            /**
             * Creates a clone of  `buffer`.
             *
             * @private
             * @param {Buffer} buffer The buffer to clone.
             * @param {boolean} [isDeep] Specify a deep clone.
             * @returns {Buffer} Returns the cloned buffer.
             */

            function cloneBuffer(buffer, isDeep) {
                if (isDeep) {
                    return buffer.slice();
                }

                var length = buffer.length,
                    result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
                buffer.copy(result);
                return result;
            }

            /**
             * Creates a clone of `arrayBuffer`.
             *
             * @private
             * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
             * @returns {ArrayBuffer} Returns the cloned array buffer.
             */


            function cloneArrayBuffer(arrayBuffer) {
                var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
                new Uint8Array(result).set(new Uint8Array(arrayBuffer));
                return result;
            }

            /**
             * Creates a clone of `typedArray`.
             *
             * @private
             * @param {Object} typedArray The typed array to clone.
             * @param {boolean} [isDeep] Specify a deep clone.
             * @returns {Object} Returns the cloned typed array.
             */


            function cloneTypedArray(typedArray, isDeep) {
                var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
                return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
            }

            /**
             * Copies the values of `source` to `array`.
             *
             * @private
             * @param {Array} source The array to copy values from.
             * @param {Array} [array=[]] The array to copy values to.
             * @returns {Array} Returns `array`.
             */


            function copyArray(source, array) {
                var index = -1,
                    length = source.length;
                array || (array = Array(length));

                while (++index < length) {
                    array[index] = source[index];
                }

                return array;
            }

            /**
             * Copies properties of `source` to `object`.
             *
             * @private
             * @param {Object} source The object to copy properties from.
             * @param {Array} props The property identifiers to copy.
             * @param {Object} [object={}] The object to copy properties to.
             * @param {Function} [customizer] The function to customize copied values.
             * @returns {Object} Returns `object`.
             */


            function copyObject(source, props, object, customizer) {
                var isNew = !object;
                object || (object = {});
                var index = -1,
                    length = props.length;

                while (++index < length) {
                    var key = props[index];
                    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;

                    if (newValue === undefined) {
                        newValue = source[key];
                    }

                    if (isNew) {
                        baseAssignValue(object, key, newValue);
                    } else {
                        assignValue(object, key, newValue);
                    }
                }

                return object;
            }

            /**
             * Creates a function like `_.assign`.
             *
             * @private
             * @param {Function} assigner The function to assign values.
             * @returns {Function} Returns the new assigner function.
             */


            function createAssigner(assigner) {
                return baseRest(function (object, sources) {
                    var index = -1,
                        length = sources.length,
                        customizer = length > 1 ? sources[length - 1] : undefined,
                        guard = length > 2 ? sources[2] : undefined;
                    customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;

                    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
                        customizer = length < 3 ? undefined : customizer;
                        length = 1;
                    }

                    object = Object(object);

                    while (++index < length) {
                        var source = sources[index];

                        if (source) {
                            assigner(object, source, index, customizer);
                        }
                    }

                    return object;
                });
            }

            /**
             * Creates a base function for methods like `_.forIn` and `_.forOwn`.
             *
             * @private
             * @param {boolean} [fromRight] Specify iterating from right to left.
             * @returns {Function} Returns the new base function.
             */


            function createBaseFor(fromRight) {
                return function (object, iteratee, keysFunc) {
                    var index = -1,
                        iterable = Object(object),
                        props = keysFunc(object),
                        length = props.length;

                    while (length--) {
                        var key = props[fromRight ? length : ++index];

                        if (iteratee(iterable[key], key, iterable) === false) {
                            break;
                        }
                    }

                    return object;
                };
            }

            /**
             * Gets the data for `map`.
             *
             * @private
             * @param {Object} map The map to query.
             * @param {string} key The reference key.
             * @returns {*} Returns the map data.
             */


            function getMapData(map, key) {
                var data = map.__data__;
                return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
            }

            /**
             * Gets the native function at `key` of `object`.
             *
             * @private
             * @param {Object} object The object to query.
             * @param {string} key The key of the method to get.
             * @returns {*} Returns the function if it's native, else `undefined`.
             */


            function getNative(object, key) {
                var value = getValue(object, key);
                return baseIsNative(value) ? value : undefined;
            }

            /**
             * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
             *
             * @private
             * @param {*} value The value to query.
             * @returns {string} Returns the raw `toStringTag`.
             */


            function getRawTag(value) {
                var isOwn = hasOwnProperty.call(value, symToStringTag),
                    tag = value[symToStringTag];

                try {
                    value[symToStringTag] = undefined;
                    var unmasked = true;
                } catch (e) {
                }

                var result = nativeObjectToString.call(value);

                if (unmasked) {
                    if (isOwn) {
                        value[symToStringTag] = tag;
                    } else {
                        delete value[symToStringTag];
                    }
                }

                return result;
            }

            /**
             * Initializes an object clone.
             *
             * @private
             * @param {Object} object The object to clone.
             * @returns {Object} Returns the initialized clone.
             */


            function initCloneObject(object) {
                return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
            }

            /**
             * Checks if `value` is a valid array-like index.
             *
             * @private
             * @param {*} value The value to check.
             * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
             * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
             */


            function isIndex(value, length) {
                var type = _typeof(value);

                length = length == null ? MAX_SAFE_INTEGER : length;
                return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
            }

            /**
             * Checks if the given arguments are from an iteratee call.
             *
             * @private
             * @param {*} value The potential iteratee value argument.
             * @param {*} index The potential iteratee index or key argument.
             * @param {*} object The potential iteratee object argument.
             * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
             *  else `false`.
             */


            function isIterateeCall(value, index, object) {
                if (!isObject(object)) {
                    return false;
                }

                var type = _typeof(index);

                if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
                    return eq(object[index], value);
                }

                return false;
            }

            /**
             * Checks if `value` is suitable for use as unique object key.
             *
             * @private
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
             */


            function isKeyable(value) {
                var type = _typeof(value);

                return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
            }

            /**
             * Checks if `func` has its source masked.
             *
             * @private
             * @param {Function} func The function to check.
             * @returns {boolean} Returns `true` if `func` is masked, else `false`.
             */


            function isMasked(func) {
                return !!maskSrcKey && maskSrcKey in func;
            }

            /**
             * Checks if `value` is likely a prototype object.
             *
             * @private
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
             */


            function isPrototype(value) {
                var Ctor = value && value.constructor,
                    proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
                return value === proto;
            }

            /**
             * This function is like
             * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
             * except that it includes inherited enumerable properties.
             *
             * @private
             * @param {Object} object The object to query.
             * @returns {Array} Returns the array of property names.
             */


            function nativeKeysIn(object) {
                var result = [];

                if (object != null) {
                    for (var key in Object(object)) {
                        result.push(key);
                    }
                }

                return result;
            }

            /**
             * Converts `value` to a string using `Object.prototype.toString`.
             *
             * @private
             * @param {*} value The value to convert.
             * @returns {string} Returns the converted string.
             */


            function objectToString(value) {
                return nativeObjectToString.call(value);
            }

            /**
             * A specialized version of `baseRest` which transforms the rest array.
             *
             * @private
             * @param {Function} func The function to apply a rest parameter to.
             * @param {number} [start=func.length-1] The start position of the rest parameter.
             * @param {Function} transform The rest array transform.
             * @returns {Function} Returns the new function.
             */


            function overRest(func, start, transform) {
                start = nativeMax(start === undefined ? func.length - 1 : start, 0);
                return function () {
                    var args = arguments,
                        index = -1,
                        length = nativeMax(args.length - start, 0),
                        array = Array(length);

                    while (++index < length) {
                        array[index] = args[start + index];
                    }

                    index = -1;
                    var otherArgs = Array(start + 1);

                    while (++index < start) {
                        otherArgs[index] = args[index];
                    }

                    otherArgs[start] = transform(array);
                    return apply(func, this, otherArgs);
                };
            }

            /**
             * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
             *
             * @private
             * @param {Object} object The object to query.
             * @param {string} key The key of the property to get.
             * @returns {*} Returns the property value.
             */


            function safeGet(object, key) {
                if (key === 'constructor' && typeof object[key] === 'function') {
                    return;
                }

                if (key == '__proto__') {
                    return;
                }

                return object[key];
            }

            /**
             * Sets the `toString` method of `func` to return `string`.
             *
             * @private
             * @param {Function} func The function to modify.
             * @param {Function} string The `toString` result.
             * @returns {Function} Returns `func`.
             */


            var setToString = shortOut(baseSetToString);

            /**
             * Creates a function that'll short out and invoke `identity` instead
             * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
             * milliseconds.
             *
             * @private
             * @param {Function} func The function to restrict.
             * @returns {Function} Returns the new shortable function.
             */

            function shortOut(func) {
                var count = 0,
                    lastCalled = 0;
                return function () {
                    var stamp = nativeNow(),
                        remaining = HOT_SPAN - (stamp - lastCalled);
                    lastCalled = stamp;

                    if (remaining > 0) {
                        if (++count >= HOT_COUNT) {
                            return arguments[0];
                        }
                    } else {
                        count = 0;
                    }

                    return func.apply(undefined, arguments);
                };
            }

            /**
             * Converts `func` to its source code.
             *
             * @private
             * @param {Function} func The function to convert.
             * @returns {string} Returns the source code.
             */


            function toSource(func) {
                if (func != null) {
                    try {
                        return funcToString.call(func);
                    } catch (e) {
                    }

                    try {
                        return func + '';
                    } catch (e) {
                    }
                }

                return '';
            }

            /**
             * Performs a
             * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
             * comparison between two values to determine if they are equivalent.
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to compare.
             * @param {*} other The other value to compare.
             * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
             * @example
             *
             * var object = { 'a': 1 };
             * var other = { 'a': 1 };
             *
             * _.eq(object, object);
             * // => true
             *
             * _.eq(object, other);
             * // => false
             *
             * _.eq('a', 'a');
             * // => true
             *
             * _.eq('a', Object('a'));
             * // => false
             *
             * _.eq(NaN, NaN);
             * // => true
             */


            function eq(value, other) {
                return value === other || value !== value && other !== other;
            }

            /**
             * Checks if `value` is likely an `arguments` object.
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is an `arguments` object,
             *  else `false`.
             * @example
             *
             * _.isArguments(function() { return arguments; }());
             * // => true
             *
             * _.isArguments([1, 2, 3]);
             * // => false
             */


            var isArguments = baseIsArguments(function () {
                return arguments;
            }()) ? baseIsArguments : function (value) {
                return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
            };
            /**
             * Checks if `value` is classified as an `Array` object.
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is an array, else `false`.
             * @example
             *
             * _.isArray([1, 2, 3]);
             * // => true
             *
             * _.isArray(document.body.children);
             * // => false
             *
             * _.isArray('abc');
             * // => false
             *
             * _.isArray(_.noop);
             * // => false
             */

            var isArray = Array.isArray;

            /**
             * Checks if `value` is array-like. A value is considered array-like if it's
             * not a function and has a `value.length` that's an integer greater than or
             * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
             * @example
             *
             * _.isArrayLike([1, 2, 3]);
             * // => true
             *
             * _.isArrayLike(document.body.children);
             * // => true
             *
             * _.isArrayLike('abc');
             * // => true
             *
             * _.isArrayLike(_.noop);
             * // => false
             */

            function isArrayLike(value) {
                return value != null && isLength(value.length) && !isFunction(value);
            }

            /**
             * This method is like `_.isArrayLike` except that it also checks if `value`
             * is an object.
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is an array-like object,
             *  else `false`.
             * @example
             *
             * _.isArrayLikeObject([1, 2, 3]);
             * // => true
             *
             * _.isArrayLikeObject(document.body.children);
             * // => true
             *
             * _.isArrayLikeObject('abc');
             * // => false
             *
             * _.isArrayLikeObject(_.noop);
             * // => false
             */


            function isArrayLikeObject(value) {
                return isObjectLike(value) && isArrayLike(value);
            }

            /**
             * Checks if `value` is a buffer.
             *
             * @static
             * @memberOf _
             * @since 4.3.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
             * @example
             *
             * _.isBuffer(new Buffer(2));
             * // => true
             *
             * _.isBuffer(new Uint8Array(2));
             * // => false
             */


            var isBuffer = nativeIsBuffer || stubFalse;

            /**
             * Checks if `value` is classified as a `Function` object.
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a function, else `false`.
             * @example
             *
             * _.isFunction(_);
             * // => true
             *
             * _.isFunction(/abc/);
             * // => false
             */

            function isFunction(value) {
                if (!isObject(value)) {
                    return false;
                } // The use of `Object#toString` avoids issues with the `typeof` operator
                // in Safari 9 which returns 'object' for typed arrays and other constructors.


                var tag = baseGetTag(value);
                return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
            }

            /**
             * Checks if `value` is a valid array-like length.
             *
             * **Note:** This method is loosely based on
             * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
             * @example
             *
             * _.isLength(3);
             * // => true
             *
             * _.isLength(Number.MIN_VALUE);
             * // => false
             *
             * _.isLength(Infinity);
             * // => false
             *
             * _.isLength('3');
             * // => false
             */


            function isLength(value) {
                return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
            }

            /**
             * Checks if `value` is the
             * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
             * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is an object, else `false`.
             * @example
             *
             * _.isObject({});
             * // => true
             *
             * _.isObject([1, 2, 3]);
             * // => true
             *
             * _.isObject(_.noop);
             * // => true
             *
             * _.isObject(null);
             * // => false
             */


            function isObject(value) {
                var type = _typeof(value);

                return value != null && (type == 'object' || type == 'function');
            }

            /**
             * Checks if `value` is object-like. A value is object-like if it's not `null`
             * and has a `typeof` result of "object".
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
             * @example
             *
             * _.isObjectLike({});
             * // => true
             *
             * _.isObjectLike([1, 2, 3]);
             * // => true
             *
             * _.isObjectLike(_.noop);
             * // => false
             *
             * _.isObjectLike(null);
             * // => false
             */


            function isObjectLike(value) {
                return value != null && _typeof(value) == 'object';
            }

            /**
             * Checks if `value` is a plain object, that is, an object created by the
             * `Object` constructor or one with a `[[Prototype]]` of `null`.
             *
             * @static
             * @memberOf _
             * @since 0.8.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
             * @example
             *
             * function Foo() {
             *   this.a = 1;
             * }
             *
             * _.isPlainObject(new Foo);
             * // => false
             *
             * _.isPlainObject([1, 2, 3]);
             * // => false
             *
             * _.isPlainObject({ 'x': 0, 'y': 0 });
             * // => true
             *
             * _.isPlainObject(Object.create(null));
             * // => true
             */


            function isPlainObject(value) {
                if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
                    return false;
                }

                var proto = getPrototype(value);

                if (proto === null) {
                    return true;
                }

                var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
                return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
            }

            /**
             * Checks if `value` is classified as a typed array.
             *
             * @static
             * @memberOf _
             * @since 3.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
             * @example
             *
             * _.isTypedArray(new Uint8Array);
             * // => true
             *
             * _.isTypedArray([]);
             * // => false
             */


            var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

            /**
             * Converts `value` to a plain object flattening inherited enumerable string
             * keyed properties of `value` to own properties of the plain object.
             *
             * @static
             * @memberOf _
             * @since 3.0.0
             * @category Lang
             * @param {*} value The value to convert.
             * @returns {Object} Returns the converted plain object.
             * @example
             *
             * function Foo() {
             *   this.b = 2;
             * }
             *
             * Foo.prototype.c = 3;
             *
             * _.assign({ 'a': 1 }, new Foo);
             * // => { 'a': 1, 'b': 2 }
             *
             * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
             * // => { 'a': 1, 'b': 2, 'c': 3 }
             */

            function toPlainObject(value) {
                return copyObject(value, keysIn(value));
            }

            /**
             * Creates an array of the own and inherited enumerable property names of `object`.
             *
             * **Note:** Non-object values are coerced to objects.
             *
             * @static
             * @memberOf _
             * @since 3.0.0
             * @category Object
             * @param {Object} object The object to query.
             * @returns {Array} Returns the array of property names.
             * @example
             *
             * function Foo() {
             *   this.a = 1;
             *   this.b = 2;
             * }
             *
             * Foo.prototype.c = 3;
             *
             * _.keysIn(new Foo);
             * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
             */


            function keysIn(object) {
                return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
            }

            /**
             * This method is like `_.assign` except that it recursively merges own and
             * inherited enumerable string keyed properties of source objects into the
             * destination object. Source properties that resolve to `undefined` are
             * skipped if a destination value exists. Array and plain object properties
             * are merged recursively. Other objects and value types are overridden by
             * assignment. Source objects are applied from left to right. Subsequent
             * sources overwrite property assignments of previous sources.
             *
             * **Note:** This method mutates `object`.
             *
             * @static
             * @memberOf _
             * @since 0.5.0
             * @category Object
             * @param {Object} object The destination object.
             * @param {...Object} [sources] The source objects.
             * @returns {Object} Returns `object`.
             * @example
             *
             * var object = {
             *   'a': [{ 'b': 2 }, { 'd': 4 }]
             * };
             *
             * var other = {
             *   'a': [{ 'c': 3 }, { 'e': 5 }]
             * };
             *
             * _.merge(object, other);
             * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
             */


            var merge = createAssigner(function (object, source, srcIndex) {
                baseMerge(object, source, srcIndex);
            });

            /**
             * Creates a function that returns `value`.
             *
             * @static
             * @memberOf _
             * @since 2.4.0
             * @category Util
             * @param {*} value The value to return from the new function.
             * @returns {Function} Returns the new constant function.
             * @example
             *
             * var objects = _.times(2, _.constant({ 'a': 1 }));
             *
             * console.log(objects);
             * // => [{ 'a': 1 }, { 'a': 1 }]
             *
             * console.log(objects[0] === objects[1]);
             * // => true
             */

            function constant(value) {
                return function () {
                    return value;
                };
            }

            /**
             * This method returns the first argument it receives.
             *
             * @static
             * @since 0.1.0
             * @memberOf _
             * @category Util
             * @param {*} value Any value.
             * @returns {*} Returns `value`.
             * @example
             *
             * var object = { 'a': 1 };
             *
             * console.log(_.identity(object) === object);
             * // => true
             */


            function identity(value) {
                return value;
            }

            /**
             * This method returns `false`.
             *
             * @static
             * @memberOf _
             * @since 4.13.0
             * @category Util
             * @returns {boolean} Returns `false`.
             * @example
             *
             * _.times(2, _.stubFalse);
             * // => [false, false]
             */


            function stubFalse() {
                return false;
            }

            module.exports = merge;
        })(lodash_merge, lodash_merge.exports);

        var merge = lodash_merge.exports;

        var lodash_clonedeep = {exports: {}};

        (function (module, exports) {
            /** Used as the size to enable large array optimizations. */
            var LARGE_ARRAY_SIZE = 200;
            /** Used to stand-in for `undefined` hash values. */

            var HASH_UNDEFINED = '__lodash_hash_undefined__';
            /** Used as references for various `Number` constants. */

            var MAX_SAFE_INTEGER = 9007199254740991;
            /** `Object#toString` result references. */

            var argsTag = '[object Arguments]',
                arrayTag = '[object Array]',
                boolTag = '[object Boolean]',
                dateTag = '[object Date]',
                errorTag = '[object Error]',
                funcTag = '[object Function]',
                genTag = '[object GeneratorFunction]',
                mapTag = '[object Map]',
                numberTag = '[object Number]',
                objectTag = '[object Object]',
                promiseTag = '[object Promise]',
                regexpTag = '[object RegExp]',
                setTag = '[object Set]',
                stringTag = '[object String]',
                symbolTag = '[object Symbol]',
                weakMapTag = '[object WeakMap]';
            var arrayBufferTag = '[object ArrayBuffer]',
                dataViewTag = '[object DataView]',
                float32Tag = '[object Float32Array]',
                float64Tag = '[object Float64Array]',
                int8Tag = '[object Int8Array]',
                int16Tag = '[object Int16Array]',
                int32Tag = '[object Int32Array]',
                uint8Tag = '[object Uint8Array]',
                uint8ClampedTag = '[object Uint8ClampedArray]',
                uint16Tag = '[object Uint16Array]',
                uint32Tag = '[object Uint32Array]';
            /**
             * Used to match `RegExp`
             * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
             */

            var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
            /** Used to match `RegExp` flags from their coerced string values. */

            var reFlags = /\w*$/;
            /** Used to detect host constructors (Safari). */

            var reIsHostCtor = /^\[object .+?Constructor\]$/;
            /** Used to detect unsigned integer values. */

            var reIsUint = /^(?:0|[1-9]\d*)$/;
            /** Used to identify `toStringTag` values supported by `_.clone`. */

            var cloneableTags = {};
            cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
            cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
            /** Detect free variable `global` from Node.js. */

            var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
            /** Detect free variable `self`. */

            var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
            /** Used as a reference to the global object. */

            var root = freeGlobal || freeSelf || Function('return this')();
            /** Detect free variable `exports`. */

            var freeExports = exports && !exports.nodeType && exports;
            /** Detect free variable `module`. */

            var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
            /** Detect the popular CommonJS extension `module.exports`. */

            var moduleExports = freeModule && freeModule.exports === freeExports;

            /**
             * Adds the key-value `pair` to `map`.
             *
             * @private
             * @param {Object} map The map to modify.
             * @param {Array} pair The key-value pair to add.
             * @returns {Object} Returns `map`.
             */

            function addMapEntry(map, pair) {
                // Don't return `map.set` because it's not chainable in IE 11.
                map.set(pair[0], pair[1]);
                return map;
            }

            /**
             * Adds `value` to `set`.
             *
             * @private
             * @param {Object} set The set to modify.
             * @param {*} value The value to add.
             * @returns {Object} Returns `set`.
             */


            function addSetEntry(set, value) {
                // Don't return `set.add` because it's not chainable in IE 11.
                set.add(value);
                return set;
            }

            /**
             * A specialized version of `_.forEach` for arrays without support for
             * iteratee shorthands.
             *
             * @private
             * @param {Array} [array] The array to iterate over.
             * @param {Function} iteratee The function invoked per iteration.
             * @returns {Array} Returns `array`.
             */


            function arrayEach(array, iteratee) {
                var index = -1,
                    length = array ? array.length : 0;

                while (++index < length) {
                    if (iteratee(array[index], index, array) === false) {
                        break;
                    }
                }

                return array;
            }

            /**
             * Appends the elements of `values` to `array`.
             *
             * @private
             * @param {Array} array The array to modify.
             * @param {Array} values The values to append.
             * @returns {Array} Returns `array`.
             */


            function arrayPush(array, values) {
                var index = -1,
                    length = values.length,
                    offset = array.length;

                while (++index < length) {
                    array[offset + index] = values[index];
                }

                return array;
            }

            /**
             * A specialized version of `_.reduce` for arrays without support for
             * iteratee shorthands.
             *
             * @private
             * @param {Array} [array] The array to iterate over.
             * @param {Function} iteratee The function invoked per iteration.
             * @param {*} [accumulator] The initial value.
             * @param {boolean} [initAccum] Specify using the first element of `array` as
             *  the initial value.
             * @returns {*} Returns the accumulated value.
             */


            function arrayReduce(array, iteratee, accumulator, initAccum) {
                var index = -1,
                    length = array ? array.length : 0;

                if (initAccum && length) {
                    accumulator = array[++index];
                }

                while (++index < length) {
                    accumulator = iteratee(accumulator, array[index], index, array);
                }

                return accumulator;
            }

            /**
             * The base implementation of `_.times` without support for iteratee shorthands
             * or max array length checks.
             *
             * @private
             * @param {number} n The number of times to invoke `iteratee`.
             * @param {Function} iteratee The function invoked per iteration.
             * @returns {Array} Returns the array of results.
             */


            function baseTimes(n, iteratee) {
                var index = -1,
                    result = Array(n);

                while (++index < n) {
                    result[index] = iteratee(index);
                }

                return result;
            }

            /**
             * Gets the value at `key` of `object`.
             *
             * @private
             * @param {Object} [object] The object to query.
             * @param {string} key The key of the property to get.
             * @returns {*} Returns the property value.
             */


            function getValue(object, key) {
                return object == null ? undefined : object[key];
            }

            /**
             * Checks if `value` is a host object in IE < 9.
             *
             * @private
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
             */


            function isHostObject(value) {
                // Many host objects are `Object` objects that can coerce to strings
                // despite having improperly defined `toString` methods.
                var result = false;

                if (value != null && typeof value.toString != 'function') {
                    try {
                        result = !!(value + '');
                    } catch (e) {
                    }
                }

                return result;
            }

            /**
             * Converts `map` to its key-value pairs.
             *
             * @private
             * @param {Object} map The map to convert.
             * @returns {Array} Returns the key-value pairs.
             */


            function mapToArray(map) {
                var index = -1,
                    result = Array(map.size);
                map.forEach(function (value, key) {
                    result[++index] = [key, value];
                });
                return result;
            }

            /**
             * Creates a unary function that invokes `func` with its argument transformed.
             *
             * @private
             * @param {Function} func The function to wrap.
             * @param {Function} transform The argument transform.
             * @returns {Function} Returns the new function.
             */


            function overArg(func, transform) {
                return function (arg) {
                    return func(transform(arg));
                };
            }

            /**
             * Converts `set` to an array of its values.
             *
             * @private
             * @param {Object} set The set to convert.
             * @returns {Array} Returns the values.
             */


            function setToArray(set) {
                var index = -1,
                    result = Array(set.size);
                set.forEach(function (value) {
                    result[++index] = value;
                });
                return result;
            }

            /** Used for built-in method references. */


            var arrayProto = Array.prototype,
                funcProto = Function.prototype,
                objectProto = Object.prototype;
            /** Used to detect overreaching core-js shims. */

            var coreJsData = root['__core-js_shared__'];
            /** Used to detect methods masquerading as native. */

            var maskSrcKey = function () {
                var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
                return uid ? 'Symbol(src)_1.' + uid : '';
            }();
            /** Used to resolve the decompiled source of functions. */


            var funcToString = funcProto.toString;
            /** Used to check objects for own properties. */

            var hasOwnProperty = objectProto.hasOwnProperty;
            /**
             * Used to resolve the
             * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
             * of values.
             */

            var objectToString = objectProto.toString;
            /** Used to detect if a method is native. */

            var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
            /** Built-in value references. */

            var Buffer = moduleExports ? root.Buffer : undefined,
                _Symbol = root.Symbol,
                Uint8Array = root.Uint8Array,
                getPrototype = overArg(Object.getPrototypeOf, Object),
                objectCreate = Object.create,
                propertyIsEnumerable = objectProto.propertyIsEnumerable,
                splice = arrayProto.splice;
            /* Built-in method references for those with the same name as other `lodash` methods. */

            var nativeGetSymbols = Object.getOwnPropertySymbols,
                nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
                nativeKeys = overArg(Object.keys, Object);
            /* Built-in method references that are verified to be native. */

            var DataView = getNative(root, 'DataView'),
                Map = getNative(root, 'Map'),
                Promise = getNative(root, 'Promise'),
                Set = getNative(root, 'Set'),
                WeakMap = getNative(root, 'WeakMap'),
                nativeCreate = getNative(Object, 'create');
            /** Used to detect maps, sets, and weakmaps. */

            var dataViewCtorString = toSource(DataView),
                mapCtorString = toSource(Map),
                promiseCtorString = toSource(Promise),
                setCtorString = toSource(Set),
                weakMapCtorString = toSource(WeakMap);
            /** Used to convert symbols to primitives and strings. */

            var symbolProto = _Symbol ? _Symbol.prototype : undefined,
                symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

            /**
             * Creates a hash object.
             *
             * @private
             * @constructor
             * @param {Array} [entries] The key-value pairs to cache.
             */

            function Hash(entries) {
                var index = -1,
                    length = entries ? entries.length : 0;
                this.clear();

                while (++index < length) {
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            }

            /**
             * Removes all key-value entries from the hash.
             *
             * @private
             * @name clear
             * @memberOf Hash
             */


            function hashClear() {
                this.__data__ = nativeCreate ? nativeCreate(null) : {};
            }

            /**
             * Removes `key` and its value from the hash.
             *
             * @private
             * @name delete
             * @memberOf Hash
             * @param {Object} hash The hash to modify.
             * @param {string} key The key of the value to remove.
             * @returns {boolean} Returns `true` if the entry was removed, else `false`.
             */


            function hashDelete(key) {
                return this.has(key) && delete this.__data__[key];
            }

            /**
             * Gets the hash value for `key`.
             *
             * @private
             * @name get
             * @memberOf Hash
             * @param {string} key The key of the value to get.
             * @returns {*} Returns the entry value.
             */


            function hashGet(key) {
                var data = this.__data__;

                if (nativeCreate) {
                    var result = data[key];
                    return result === HASH_UNDEFINED ? undefined : result;
                }

                return hasOwnProperty.call(data, key) ? data[key] : undefined;
            }

            /**
             * Checks if a hash value for `key` exists.
             *
             * @private
             * @name has
             * @memberOf Hash
             * @param {string} key The key of the entry to check.
             * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
             */


            function hashHas(key) {
                var data = this.__data__;
                return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
            }

            /**
             * Sets the hash `key` to `value`.
             *
             * @private
             * @name set
             * @memberOf Hash
             * @param {string} key The key of the value to set.
             * @param {*} value The value to set.
             * @returns {Object} Returns the hash instance.
             */


            function hashSet(key, value) {
                var data = this.__data__;
                data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
                return this;
            } // Add methods to `Hash`.


            Hash.prototype.clear = hashClear;
            Hash.prototype['delete'] = hashDelete;
            Hash.prototype.get = hashGet;
            Hash.prototype.has = hashHas;
            Hash.prototype.set = hashSet;

            /**
             * Creates an list cache object.
             *
             * @private
             * @constructor
             * @param {Array} [entries] The key-value pairs to cache.
             */

            function ListCache(entries) {
                var index = -1,
                    length = entries ? entries.length : 0;
                this.clear();

                while (++index < length) {
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            }

            /**
             * Removes all key-value entries from the list cache.
             *
             * @private
             * @name clear
             * @memberOf ListCache
             */


            function listCacheClear() {
                this.__data__ = [];
            }

            /**
             * Removes `key` and its value from the list cache.
             *
             * @private
             * @name delete
             * @memberOf ListCache
             * @param {string} key The key of the value to remove.
             * @returns {boolean} Returns `true` if the entry was removed, else `false`.
             */


            function listCacheDelete(key) {
                var data = this.__data__,
                    index = assocIndexOf(data, key);

                if (index < 0) {
                    return false;
                }

                var lastIndex = data.length - 1;

                if (index == lastIndex) {
                    data.pop();
                } else {
                    splice.call(data, index, 1);
                }

                return true;
            }

            /**
             * Gets the list cache value for `key`.
             *
             * @private
             * @name get
             * @memberOf ListCache
             * @param {string} key The key of the value to get.
             * @returns {*} Returns the entry value.
             */


            function listCacheGet(key) {
                var data = this.__data__,
                    index = assocIndexOf(data, key);
                return index < 0 ? undefined : data[index][1];
            }

            /**
             * Checks if a list cache value for `key` exists.
             *
             * @private
             * @name has
             * @memberOf ListCache
             * @param {string} key The key of the entry to check.
             * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
             */


            function listCacheHas(key) {
                return assocIndexOf(this.__data__, key) > -1;
            }

            /**
             * Sets the list cache `key` to `value`.
             *
             * @private
             * @name set
             * @memberOf ListCache
             * @param {string} key The key of the value to set.
             * @param {*} value The value to set.
             * @returns {Object} Returns the list cache instance.
             */


            function listCacheSet(key, value) {
                var data = this.__data__,
                    index = assocIndexOf(data, key);

                if (index < 0) {
                    data.push([key, value]);
                } else {
                    data[index][1] = value;
                }

                return this;
            } // Add methods to `ListCache`.


            ListCache.prototype.clear = listCacheClear;
            ListCache.prototype['delete'] = listCacheDelete;
            ListCache.prototype.get = listCacheGet;
            ListCache.prototype.has = listCacheHas;
            ListCache.prototype.set = listCacheSet;

            /**
             * Creates a map cache object to store key-value pairs.
             *
             * @private
             * @constructor
             * @param {Array} [entries] The key-value pairs to cache.
             */

            function MapCache(entries) {
                var index = -1,
                    length = entries ? entries.length : 0;
                this.clear();

                while (++index < length) {
                    var entry = entries[index];
                    this.set(entry[0], entry[1]);
                }
            }

            /**
             * Removes all key-value entries from the map.
             *
             * @private
             * @name clear
             * @memberOf MapCache
             */


            function mapCacheClear() {
                this.__data__ = {
                    'hash': new Hash(),
                    'map': new (Map || ListCache)(),
                    'string': new Hash()
                };
            }

            /**
             * Removes `key` and its value from the map.
             *
             * @private
             * @name delete
             * @memberOf MapCache
             * @param {string} key The key of the value to remove.
             * @returns {boolean} Returns `true` if the entry was removed, else `false`.
             */


            function mapCacheDelete(key) {
                return getMapData(this, key)['delete'](key);
            }

            /**
             * Gets the map value for `key`.
             *
             * @private
             * @name get
             * @memberOf MapCache
             * @param {string} key The key of the value to get.
             * @returns {*} Returns the entry value.
             */


            function mapCacheGet(key) {
                return getMapData(this, key).get(key);
            }

            /**
             * Checks if a map value for `key` exists.
             *
             * @private
             * @name has
             * @memberOf MapCache
             * @param {string} key The key of the entry to check.
             * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
             */


            function mapCacheHas(key) {
                return getMapData(this, key).has(key);
            }

            /**
             * Sets the map `key` to `value`.
             *
             * @private
             * @name set
             * @memberOf MapCache
             * @param {string} key The key of the value to set.
             * @param {*} value The value to set.
             * @returns {Object} Returns the map cache instance.
             */


            function mapCacheSet(key, value) {
                getMapData(this, key).set(key, value);
                return this;
            } // Add methods to `MapCache`.


            MapCache.prototype.clear = mapCacheClear;
            MapCache.prototype['delete'] = mapCacheDelete;
            MapCache.prototype.get = mapCacheGet;
            MapCache.prototype.has = mapCacheHas;
            MapCache.prototype.set = mapCacheSet;

            /**
             * Creates a stack cache object to store key-value pairs.
             *
             * @private
             * @constructor
             * @param {Array} [entries] The key-value pairs to cache.
             */

            function Stack(entries) {
                this.__data__ = new ListCache(entries);
            }

            /**
             * Removes all key-value entries from the stack.
             *
             * @private
             * @name clear
             * @memberOf Stack
             */


            function stackClear() {
                this.__data__ = new ListCache();
            }

            /**
             * Removes `key` and its value from the stack.
             *
             * @private
             * @name delete
             * @memberOf Stack
             * @param {string} key The key of the value to remove.
             * @returns {boolean} Returns `true` if the entry was removed, else `false`.
             */


            function stackDelete(key) {
                return this.__data__['delete'](key);
            }

            /**
             * Gets the stack value for `key`.
             *
             * @private
             * @name get
             * @memberOf Stack
             * @param {string} key The key of the value to get.
             * @returns {*} Returns the entry value.
             */


            function stackGet(key) {
                return this.__data__.get(key);
            }

            /**
             * Checks if a stack value for `key` exists.
             *
             * @private
             * @name has
             * @memberOf Stack
             * @param {string} key The key of the entry to check.
             * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
             */


            function stackHas(key) {
                return this.__data__.has(key);
            }

            /**
             * Sets the stack `key` to `value`.
             *
             * @private
             * @name set
             * @memberOf Stack
             * @param {string} key The key of the value to set.
             * @param {*} value The value to set.
             * @returns {Object} Returns the stack cache instance.
             */


            function stackSet(key, value) {
                var cache = this.__data__;

                if (cache instanceof ListCache) {
                    var pairs = cache.__data__;

                    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
                        pairs.push([key, value]);
                        return this;
                    }

                    cache = this.__data__ = new MapCache(pairs);
                }

                cache.set(key, value);
                return this;
            } // Add methods to `Stack`.


            Stack.prototype.clear = stackClear;
            Stack.prototype['delete'] = stackDelete;
            Stack.prototype.get = stackGet;
            Stack.prototype.has = stackHas;
            Stack.prototype.set = stackSet;

            /**
             * Creates an array of the enumerable property names of the array-like `value`.
             *
             * @private
             * @param {*} value The value to query.
             * @param {boolean} inherited Specify returning inherited property names.
             * @returns {Array} Returns the array of property names.
             */

            function arrayLikeKeys(value, inherited) {
                // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
                // Safari 9 makes `arguments.length` enumerable in strict mode.
                var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
                var length = result.length,
                    skipIndexes = !!length;

                for (var key in value) {
                    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
                        result.push(key);
                    }
                }

                return result;
            }

            /**
             * Assigns `value` to `key` of `object` if the existing value is not equivalent
             * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
             * for equality comparisons.
             *
             * @private
             * @param {Object} object The object to modify.
             * @param {string} key The key of the property to assign.
             * @param {*} value The value to assign.
             */


            function assignValue(object, key, value) {
                var objValue = object[key];

                if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
                    object[key] = value;
                }
            }

            /**
             * Gets the index at which the `key` is found in `array` of key-value pairs.
             *
             * @private
             * @param {Array} array The array to inspect.
             * @param {*} key The key to search for.
             * @returns {number} Returns the index of the matched value, else `-1`.
             */


            function assocIndexOf(array, key) {
                var length = array.length;

                while (length--) {
                    if (eq(array[length][0], key)) {
                        return length;
                    }
                }

                return -1;
            }

            /**
             * The base implementation of `_.assign` without support for multiple sources
             * or `customizer` functions.
             *
             * @private
             * @param {Object} object The destination object.
             * @param {Object} source The source object.
             * @returns {Object} Returns `object`.
             */


            function baseAssign(object, source) {
                return object && copyObject(source, keys(source), object);
            }

            /**
             * The base implementation of `_.clone` and `_.cloneDeep` which tracks
             * traversed objects.
             *
             * @private
             * @param {*} value The value to clone.
             * @param {boolean} [isDeep] Specify a deep clone.
             * @param {boolean} [isFull] Specify a clone including symbols.
             * @param {Function} [customizer] The function to customize cloning.
             * @param {string} [key] The key of `value`.
             * @param {Object} [object] The parent object of `value`.
             * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
             * @returns {*} Returns the cloned value.
             */


            function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
                var result;

                if (customizer) {
                    result = object ? customizer(value, key, object, stack) : customizer(value);
                }

                if (result !== undefined) {
                    return result;
                }

                if (!isObject(value)) {
                    return value;
                }

                var isArr = isArray(value);

                if (isArr) {
                    result = initCloneArray(value);

                    if (!isDeep) {
                        return copyArray(value, result);
                    }
                } else {
                    var tag = getTag(value),
                        isFunc = tag == funcTag || tag == genTag;

                    if (isBuffer(value)) {
                        return cloneBuffer(value, isDeep);
                    }

                    if (tag == objectTag || tag == argsTag || isFunc && !object) {
                        if (isHostObject(value)) {
                            return object ? value : {};
                        }

                        result = initCloneObject(isFunc ? {} : value);

                        if (!isDeep) {
                            return copySymbols(value, baseAssign(result, value));
                        }
                    } else {
                        if (!cloneableTags[tag]) {
                            return object ? value : {};
                        }

                        result = initCloneByTag(value, tag, baseClone, isDeep);
                    }
                } // Check for circular references and return its corresponding clone.


                stack || (stack = new Stack());
                var stacked = stack.get(value);

                if (stacked) {
                    return stacked;
                }

                stack.set(value, result);

                if (!isArr) {
                    var props = isFull ? getAllKeys(value) : keys(value);
                }

                arrayEach(props || value, function (subValue, key) {
                    if (props) {
                        key = subValue;
                        subValue = value[key];
                    } // Recursively populate clone (susceptible to call stack limits).


                    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
                });
                return result;
            }

            /**
             * The base implementation of `_.create` without support for assigning
             * properties to the created object.
             *
             * @private
             * @param {Object} prototype The object to inherit from.
             * @returns {Object} Returns the new object.
             */


            function baseCreate(proto) {
                return isObject(proto) ? objectCreate(proto) : {};
            }

            /**
             * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
             * `keysFunc` and `symbolsFunc` to get the enumerable property names and
             * symbols of `object`.
             *
             * @private
             * @param {Object} object The object to query.
             * @param {Function} keysFunc The function to get the keys of `object`.
             * @param {Function} symbolsFunc The function to get the symbols of `object`.
             * @returns {Array} Returns the array of property names and symbols.
             */


            function baseGetAllKeys(object, keysFunc, symbolsFunc) {
                var result = keysFunc(object);
                return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
            }

            /**
             * The base implementation of `getTag`.
             *
             * @private
             * @param {*} value The value to query.
             * @returns {string} Returns the `toStringTag`.
             */


            function baseGetTag(value) {
                return objectToString.call(value);
            }

            /**
             * The base implementation of `_.isNative` without bad shim checks.
             *
             * @private
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a native function,
             *  else `false`.
             */


            function baseIsNative(value) {
                if (!isObject(value) || isMasked(value)) {
                    return false;
                }

                var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
                return pattern.test(toSource(value));
            }

            /**
             * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
             *
             * @private
             * @param {Object} object The object to query.
             * @returns {Array} Returns the array of property names.
             */


            function baseKeys(object) {
                if (!isPrototype(object)) {
                    return nativeKeys(object);
                }

                var result = [];

                for (var key in Object(object)) {
                    if (hasOwnProperty.call(object, key) && key != 'constructor') {
                        result.push(key);
                    }
                }

                return result;
            }

            /**
             * Creates a clone of  `buffer`.
             *
             * @private
             * @param {Buffer} buffer The buffer to clone.
             * @param {boolean} [isDeep] Specify a deep clone.
             * @returns {Buffer} Returns the cloned buffer.
             */


            function cloneBuffer(buffer, isDeep) {
                if (isDeep) {
                    return buffer.slice();
                }

                var result = new buffer.constructor(buffer.length);
                buffer.copy(result);
                return result;
            }

            /**
             * Creates a clone of `arrayBuffer`.
             *
             * @private
             * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
             * @returns {ArrayBuffer} Returns the cloned array buffer.
             */


            function cloneArrayBuffer(arrayBuffer) {
                var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
                new Uint8Array(result).set(new Uint8Array(arrayBuffer));
                return result;
            }

            /**
             * Creates a clone of `dataView`.
             *
             * @private
             * @param {Object} dataView The data view to clone.
             * @param {boolean} [isDeep] Specify a deep clone.
             * @returns {Object} Returns the cloned data view.
             */


            function cloneDataView(dataView, isDeep) {
                var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
                return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
            }

            /**
             * Creates a clone of `map`.
             *
             * @private
             * @param {Object} map The map to clone.
             * @param {Function} cloneFunc The function to clone values.
             * @param {boolean} [isDeep] Specify a deep clone.
             * @returns {Object} Returns the cloned map.
             */


            function cloneMap(map, isDeep, cloneFunc) {
                var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
                return arrayReduce(array, addMapEntry, new map.constructor());
            }

            /**
             * Creates a clone of `regexp`.
             *
             * @private
             * @param {Object} regexp The regexp to clone.
             * @returns {Object} Returns the cloned regexp.
             */


            function cloneRegExp(regexp) {
                var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
                result.lastIndex = regexp.lastIndex;
                return result;
            }

            /**
             * Creates a clone of `set`.
             *
             * @private
             * @param {Object} set The set to clone.
             * @param {Function} cloneFunc The function to clone values.
             * @param {boolean} [isDeep] Specify a deep clone.
             * @returns {Object} Returns the cloned set.
             */


            function cloneSet(set, isDeep, cloneFunc) {
                var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
                return arrayReduce(array, addSetEntry, new set.constructor());
            }

            /**
             * Creates a clone of the `symbol` object.
             *
             * @private
             * @param {Object} symbol The symbol object to clone.
             * @returns {Object} Returns the cloned symbol object.
             */


            function cloneSymbol(symbol) {
                return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
            }

            /**
             * Creates a clone of `typedArray`.
             *
             * @private
             * @param {Object} typedArray The typed array to clone.
             * @param {boolean} [isDeep] Specify a deep clone.
             * @returns {Object} Returns the cloned typed array.
             */


            function cloneTypedArray(typedArray, isDeep) {
                var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
                return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
            }

            /**
             * Copies the values of `source` to `array`.
             *
             * @private
             * @param {Array} source The array to copy values from.
             * @param {Array} [array=[]] The array to copy values to.
             * @returns {Array} Returns `array`.
             */


            function copyArray(source, array) {
                var index = -1,
                    length = source.length;
                array || (array = Array(length));

                while (++index < length) {
                    array[index] = source[index];
                }

                return array;
            }

            /**
             * Copies properties of `source` to `object`.
             *
             * @private
             * @param {Object} source The object to copy properties from.
             * @param {Array} props The property identifiers to copy.
             * @param {Object} [object={}] The object to copy properties to.
             * @param {Function} [customizer] The function to customize copied values.
             * @returns {Object} Returns `object`.
             */


            function copyObject(source, props, object, customizer) {
                object || (object = {});
                var index = -1,
                    length = props.length;

                while (++index < length) {
                    var key = props[index];
                    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
                    assignValue(object, key, newValue === undefined ? source[key] : newValue);
                }

                return object;
            }

            /**
             * Copies own symbol properties of `source` to `object`.
             *
             * @private
             * @param {Object} source The object to copy symbols from.
             * @param {Object} [object={}] The object to copy symbols to.
             * @returns {Object} Returns `object`.
             */


            function copySymbols(source, object) {
                return copyObject(source, getSymbols(source), object);
            }

            /**
             * Creates an array of own enumerable property names and symbols of `object`.
             *
             * @private
             * @param {Object} object The object to query.
             * @returns {Array} Returns the array of property names and symbols.
             */


            function getAllKeys(object) {
                return baseGetAllKeys(object, keys, getSymbols);
            }

            /**
             * Gets the data for `map`.
             *
             * @private
             * @param {Object} map The map to query.
             * @param {string} key The reference key.
             * @returns {*} Returns the map data.
             */


            function getMapData(map, key) {
                var data = map.__data__;
                return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
            }

            /**
             * Gets the native function at `key` of `object`.
             *
             * @private
             * @param {Object} object The object to query.
             * @param {string} key The key of the method to get.
             * @returns {*} Returns the function if it's native, else `undefined`.
             */


            function getNative(object, key) {
                var value = getValue(object, key);
                return baseIsNative(value) ? value : undefined;
            }

            /**
             * Creates an array of the own enumerable symbol properties of `object`.
             *
             * @private
             * @param {Object} object The object to query.
             * @returns {Array} Returns the array of symbols.
             */


            var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
            /**
             * Gets the `toStringTag` of `value`.
             *
             * @private
             * @param {*} value The value to query.
             * @returns {string} Returns the `toStringTag`.
             */

            var getTag = baseGetTag; // Fallback for data views, maps, sets, and weak maps in IE 11,
            // for data views in Edge < 14, and promises in Node.js.

            if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
                getTag = function getTag(value) {
                    var result = objectToString.call(value),
                        Ctor = result == objectTag ? value.constructor : undefined,
                        ctorString = Ctor ? toSource(Ctor) : undefined;

                    if (ctorString) {
                        switch (ctorString) {
                            case dataViewCtorString:
                                return dataViewTag;

                            case mapCtorString:
                                return mapTag;

                            case promiseCtorString:
                                return promiseTag;

                            case setCtorString:
                                return setTag;

                            case weakMapCtorString:
                                return weakMapTag;
                        }
                    }

                    return result;
                };
            }

            /**
             * Initializes an array clone.
             *
             * @private
             * @param {Array} array The array to clone.
             * @returns {Array} Returns the initialized clone.
             */


            function initCloneArray(array) {
                var length = array.length,
                    result = array.constructor(length); // Add properties assigned by `RegExp#exec`.

                if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
                    result.index = array.index;
                    result.input = array.input;
                }

                return result;
            }

            /**
             * Initializes an object clone.
             *
             * @private
             * @param {Object} object The object to clone.
             * @returns {Object} Returns the initialized clone.
             */


            function initCloneObject(object) {
                return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
            }

            /**
             * Initializes an object clone based on its `toStringTag`.
             *
             * **Note:** This function only supports cloning values with tags of
             * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
             *
             * @private
             * @param {Object} object The object to clone.
             * @param {string} tag The `toStringTag` of the object to clone.
             * @param {Function} cloneFunc The function to clone values.
             * @param {boolean} [isDeep] Specify a deep clone.
             * @returns {Object} Returns the initialized clone.
             */


            function initCloneByTag(object, tag, cloneFunc, isDeep) {
                var Ctor = object.constructor;

                switch (tag) {
                    case arrayBufferTag:
                        return cloneArrayBuffer(object);

                    case boolTag:
                    case dateTag:
                        return new Ctor(+object);

                    case dataViewTag:
                        return cloneDataView(object, isDeep);

                    case float32Tag:
                    case float64Tag:
                    case int8Tag:
                    case int16Tag:
                    case int32Tag:
                    case uint8Tag:
                    case uint8ClampedTag:
                    case uint16Tag:
                    case uint32Tag:
                        return cloneTypedArray(object, isDeep);

                    case mapTag:
                        return cloneMap(object, isDeep, cloneFunc);

                    case numberTag:
                    case stringTag:
                        return new Ctor(object);

                    case regexpTag:
                        return cloneRegExp(object);

                    case setTag:
                        return cloneSet(object, isDeep, cloneFunc);

                    case symbolTag:
                        return cloneSymbol(object);
                }
            }

            /**
             * Checks if `value` is a valid array-like index.
             *
             * @private
             * @param {*} value The value to check.
             * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
             * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
             */


            function isIndex(value, length) {
                length = length == null ? MAX_SAFE_INTEGER : length;
                return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
            }

            /**
             * Checks if `value` is suitable for use as unique object key.
             *
             * @private
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
             */


            function isKeyable(value) {
                var type = _typeof(value);

                return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
            }

            /**
             * Checks if `func` has its source masked.
             *
             * @private
             * @param {Function} func The function to check.
             * @returns {boolean} Returns `true` if `func` is masked, else `false`.
             */


            function isMasked(func) {
                return !!maskSrcKey && maskSrcKey in func;
            }

            /**
             * Checks if `value` is likely a prototype object.
             *
             * @private
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
             */


            function isPrototype(value) {
                var Ctor = value && value.constructor,
                    proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
                return value === proto;
            }

            /**
             * Converts `func` to its source code.
             *
             * @private
             * @param {Function} func The function to process.
             * @returns {string} Returns the source code.
             */


            function toSource(func) {
                if (func != null) {
                    try {
                        return funcToString.call(func);
                    } catch (e) {
                    }

                    try {
                        return func + '';
                    } catch (e) {
                    }
                }

                return '';
            }

            /**
             * This method is like `_.clone` except that it recursively clones `value`.
             *
             * @static
             * @memberOf _
             * @since 1.0.0
             * @category Lang
             * @param {*} value The value to recursively clone.
             * @returns {*} Returns the deep cloned value.
             * @see _.clone
             * @example
             *
             * var objects = [{ 'a': 1 }, { 'b': 2 }];
             *
             * var deep = _.cloneDeep(objects);
             * console.log(deep[0] === objects[0]);
             * // => false
             */


            function cloneDeep(value) {
                return baseClone(value, true, true);
            }

            /**
             * Performs a
             * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
             * comparison between two values to determine if they are equivalent.
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to compare.
             * @param {*} other The other value to compare.
             * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
             * @example
             *
             * var object = { 'a': 1 };
             * var other = { 'a': 1 };
             *
             * _.eq(object, object);
             * // => true
             *
             * _.eq(object, other);
             * // => false
             *
             * _.eq('a', 'a');
             * // => true
             *
             * _.eq('a', Object('a'));
             * // => false
             *
             * _.eq(NaN, NaN);
             * // => true
             */


            function eq(value, other) {
                return value === other || value !== value && other !== other;
            }

            /**
             * Checks if `value` is likely an `arguments` object.
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is an `arguments` object,
             *  else `false`.
             * @example
             *
             * _.isArguments(function() { return arguments; }());
             * // => true
             *
             * _.isArguments([1, 2, 3]);
             * // => false
             */


            function isArguments(value) {
                // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
                return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
            }

            /**
             * Checks if `value` is classified as an `Array` object.
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is an array, else `false`.
             * @example
             *
             * _.isArray([1, 2, 3]);
             * // => true
             *
             * _.isArray(document.body.children);
             * // => false
             *
             * _.isArray('abc');
             * // => false
             *
             * _.isArray(_.noop);
             * // => false
             */


            var isArray = Array.isArray;

            /**
             * Checks if `value` is array-like. A value is considered array-like if it's
             * not a function and has a `value.length` that's an integer greater than or
             * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
             * @example
             *
             * _.isArrayLike([1, 2, 3]);
             * // => true
             *
             * _.isArrayLike(document.body.children);
             * // => true
             *
             * _.isArrayLike('abc');
             * // => true
             *
             * _.isArrayLike(_.noop);
             * // => false
             */

            function isArrayLike(value) {
                return value != null && isLength(value.length) && !isFunction(value);
            }

            /**
             * This method is like `_.isArrayLike` except that it also checks if `value`
             * is an object.
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is an array-like object,
             *  else `false`.
             * @example
             *
             * _.isArrayLikeObject([1, 2, 3]);
             * // => true
             *
             * _.isArrayLikeObject(document.body.children);
             * // => true
             *
             * _.isArrayLikeObject('abc');
             * // => false
             *
             * _.isArrayLikeObject(_.noop);
             * // => false
             */


            function isArrayLikeObject(value) {
                return isObjectLike(value) && isArrayLike(value);
            }

            /**
             * Checks if `value` is a buffer.
             *
             * @static
             * @memberOf _
             * @since 4.3.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
             * @example
             *
             * _.isBuffer(new Buffer(2));
             * // => true
             *
             * _.isBuffer(new Uint8Array(2));
             * // => false
             */


            var isBuffer = nativeIsBuffer || stubFalse;

            /**
             * Checks if `value` is classified as a `Function` object.
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a function, else `false`.
             * @example
             *
             * _.isFunction(_);
             * // => true
             *
             * _.isFunction(/abc/);
             * // => false
             */

            function isFunction(value) {
                // The use of `Object#toString` avoids issues with the `typeof` operator
                // in Safari 8-9 which returns 'object' for typed array and other constructors.
                var tag = isObject(value) ? objectToString.call(value) : '';
                return tag == funcTag || tag == genTag;
            }

            /**
             * Checks if `value` is a valid array-like length.
             *
             * **Note:** This method is loosely based on
             * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
             * @example
             *
             * _.isLength(3);
             * // => true
             *
             * _.isLength(Number.MIN_VALUE);
             * // => false
             *
             * _.isLength(Infinity);
             * // => false
             *
             * _.isLength('3');
             * // => false
             */


            function isLength(value) {
                return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
            }

            /**
             * Checks if `value` is the
             * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
             * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is an object, else `false`.
             * @example
             *
             * _.isObject({});
             * // => true
             *
             * _.isObject([1, 2, 3]);
             * // => true
             *
             * _.isObject(_.noop);
             * // => true
             *
             * _.isObject(null);
             * // => false
             */


            function isObject(value) {
                var type = _typeof(value);

                return !!value && (type == 'object' || type == 'function');
            }

            /**
             * Checks if `value` is object-like. A value is object-like if it's not `null`
             * and has a `typeof` result of "object".
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
             * @example
             *
             * _.isObjectLike({});
             * // => true
             *
             * _.isObjectLike([1, 2, 3]);
             * // => true
             *
             * _.isObjectLike(_.noop);
             * // => false
             *
             * _.isObjectLike(null);
             * // => false
             */


            function isObjectLike(value) {
                return !!value && _typeof(value) == 'object';
            }

            /**
             * Creates an array of the own enumerable property names of `object`.
             *
             * **Note:** Non-object values are coerced to objects. See the
             * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
             * for more details.
             *
             * @static
             * @since 0.1.0
             * @memberOf _
             * @category Object
             * @param {Object} object The object to query.
             * @returns {Array} Returns the array of property names.
             * @example
             *
             * function Foo() {
             *   this.a = 1;
             *   this.b = 2;
             * }
             *
             * Foo.prototype.c = 3;
             *
             * _.keys(new Foo);
             * // => ['a', 'b'] (iteration order is not guaranteed)
             *
             * _.keys('hi');
             * // => ['0', '1']
             */


            function keys(object) {
                return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
            }

            /**
             * This method returns a new empty array.
             *
             * @static
             * @memberOf _
             * @since 4.13.0
             * @category Util
             * @returns {Array} Returns the new empty array.
             * @example
             *
             * var arrays = _.times(2, _.stubArray);
             *
             * console.log(arrays);
             * // => [[], []]
             *
             * console.log(arrays[0] === arrays[1]);
             * // => false
             */


            function stubArray() {
                return [];
            }

            /**
             * This method returns `false`.
             *
             * @static
             * @memberOf _
             * @since 4.13.0
             * @category Util
             * @returns {boolean} Returns `false`.
             * @example
             *
             * _.times(2, _.stubFalse);
             * // => [false, false]
             */


            function stubFalse() {
                return false;
            }

            module.exports = cloneDeep;
        })(lodash_clonedeep, lodash_clonedeep.exports);

        var cloneDeep = lodash_clonedeep.exports;

        var componentUrl = {};

        (function (exports) {
            /**
             * Parse the given `url`.
             *
             * @param {String} str
             * @return {Object}
             * @api public
             */
            exports.parse = function (url) {
                var a = document.createElement('a');
                a.href = url;
                return {
                    href: a.href,
                    host: a.host || location.host,
                    port: '0' === a.port || '' === a.port ? port(a.protocol) : a.port,
                    hash: a.hash,
                    hostname: a.hostname || location.hostname,
                    pathname: a.pathname.charAt(0) != '/' ? '/' + a.pathname : a.pathname,
                    protocol: !a.protocol || ':' == a.protocol ? location.protocol : a.protocol,
                    search: a.search,
                    query: a.search.slice(1)
                };
            };
            /**
             * Check if `url` is absolute.
             *
             * @param {String} url
             * @return {Boolean}
             * @api public
             */


            exports.isAbsolute = function (url) {
                return 0 == url.indexOf('//') || !!~url.indexOf('://');
            };
            /**
             * Check if `url` is relative.
             *
             * @param {String} url
             * @return {Boolean}
             * @api public
             */


            exports.isRelative = function (url) {
                return !exports.isAbsolute(url);
            };
            /**
             * Check if `url` is cross domain.
             *
             * @param {String} url
             * @return {Boolean}
             * @api public
             */


            exports.isCrossDomain = function (url) {
                url = exports.parse(url);
                var location = exports.parse(window.location.href);
                return url.hostname !== location.hostname || url.port !== location.port || url.protocol !== location.protocol;
            };

            /**
             * Return default port for `protocol`.
             *
             * @param  {String} protocol
             * @return {String}
             * @api private
             */


            function port(protocol) {
                switch (protocol) {
                    case 'http:':
                        return 80;

                    case 'https:':
                        return 443;

                    default:
                        return location.port;
                }
            }
        })(componentUrl);

        var isobject = function isObject(val) {
            return val != null && _typeof(val) === 'object' && Array.isArray(val) === false;
        };

        /*!
   * get-value <https://github.com/jonschlinkert/get-value>
   *
   * Copyright (c) 2014-2018, Jon Schlinkert.
   * Released under the MIT License.
   */
        var isObject$1 = isobject;

        var getValue = function getValue(target, path, options) {
            if (!isObject$1(options)) {
                options = {
                    default: options
                };
            }

            if (!isValidObject(target)) {
                return typeof options.default !== 'undefined' ? options.default : target;
            }

            if (typeof path === 'number') {
                path = String(path);
            }

            var isArray = Array.isArray(path);
            var isString = typeof path === 'string';
            var splitChar = options.separator || '.';
            var joinChar = options.joinChar || (typeof splitChar === 'string' ? splitChar : '.');

            if (!isString && !isArray) {
                return target;
            }

            if (isString && path in target) {
                return isValid(path, target, options) ? target[path] : options.default;
            }

            var segs = isArray ? path : split(path, splitChar, options);
            var len = segs.length;
            var idx = 0;

            do {
                var prop = segs[idx];

                if (typeof prop === 'number') {
                    prop = String(prop);
                }

                while (prop && prop.slice(-1) === '\\') {
                    prop = join([prop.slice(0, -1), segs[++idx] || ''], joinChar, options);
                }

                if (prop in target) {
                    if (!isValid(prop, target, options)) {
                        return options.default;
                    }

                    target = target[prop];
                } else {
                    var hasProp = false;
                    var n = idx + 1;

                    while (n < len) {
                        prop = join([prop, segs[n++]], joinChar, options);

                        if (hasProp = prop in target) {
                            if (!isValid(prop, target, options)) {
                                return options.default;
                            }

                            target = target[prop];
                            idx = n - 1;
                            break;
                        }
                    }

                    if (!hasProp) {
                        return options.default;
                    }
                }
            } while (++idx < len && isValidObject(target));

            if (idx === len) {
                return target;
            }

            return options.default;
        };

        function join(segs, joinChar, options) {
            if (typeof options.join === 'function') {
                return options.join(segs);
            }

            return segs[0] + joinChar + segs[1];
        }

        function split(path, splitChar, options) {
            if (typeof options.split === 'function') {
                return options.split(path);
            }

            return path.split(splitChar);
        }

        function isValid(key, target, options) {
            if (typeof options.isValid === 'function') {
                return options.isValid(key, target);
            }

            return true;
        }

        function isValidObject(val) {
            return isObject$1(val) || Array.isArray(val) || typeof val === 'function';
        }

        var IDX$1 = 256,
            HEX$1 = [],
            BUFFER$1;

        while (IDX$1--) {
            HEX$1[IDX$1] = (IDX$1 + 256).toString(16).substring(1);
        }

        function v4$2() {
            var i = 0,
                num,
                out = '';

            if (!BUFFER$1 || IDX$1 + 16 > 256) {
                BUFFER$1 = Array(i = 256);

                while (i--) {
                    BUFFER$1[i] = 256 * Math.random() | 0;
                }

                i = IDX$1 = 0;
            }

            for (; i < 16; i++) {
                num = BUFFER$1[IDX$1 + i];
                if (i == 6) out += HEX$1[num & 15 | 64]; else if (i == 8) out += HEX$1[num & 63 | 128]; else out += HEX$1[num];
                if (i & 1 && i > 1 && i < 11) out += '-';
            }

            IDX$1++;
            return out;
        }

        /* eslint-disable no-use-before-define */
        // import logger from "../utils/logUtil";
        var defaultAsyncState = true;
        var LOAD_ORIGIN = 'RS_JS_SDK';
        /**
         * Script loader
         * @param {String} id                               Id of the script
         * @param {String} src                              URL of the script
         * @param {Object} options                          Object containing different configuaration
         * @param {Boolean} options.async                   Determines script will be loaded asynchronously or not
         * @param {Boolean} options.isNonNativeSDK          Determines whether the script that will be loaded is one of RS's own
         * @param {Boolean} options.skipDatasetAttributes   Determines whether to add or skip dataset attribute
         */

        var ScriptLoader = function ScriptLoader(id, src) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var exists = document.getElementById(id);

            if (exists) {
                // logger.debug("script already loaded");
                return;
            }

            var js = document.createElement('script');
            js.src = src;
            js.async = options.async === undefined ? defaultAsyncState : options.async;
            js.type = 'text/javascript';
            js.id = id; // This checking is in place to skip the dataset attribute for some cases(while loading polyfill)

            if (options.skipDatasetAttributes !== true) {
                js.setAttribute('data-loader', LOAD_ORIGIN);

                if (options.isNonNativeSDK !== undefined) {
                    js.setAttribute('data-isNonNativeSDK', options.isNonNativeSDK);
                }
            }

            var headElmColl = document.getElementsByTagName('head');

            if (headElmColl.length !== 0) {
                // logger.debug("==adding script==", js);
                headElmColl[0].insertBefore(js, headElmColl[0].firstChild);
            } else {
                var e = document.getElementsByTagName('script')[0]; // logger.debug("==parent script==", e);
                // logger.debug("==adding script==", js);

                e.parentNode.insertBefore(js, e);
            }
        };

        var LOG_LEVEL_INFO = 1;
        var LOG_LEVEL_DEBUG = 2;
        var LOG_LEVEL_WARN = 3;
        var LOG_LEVEL_ERROR = 4;
        var DEF_LOG_LEVEL = LOG_LEVEL_ERROR;
        var LOG_LEVEL = DEF_LOG_LEVEL;
        var logger = {
            setLogLevel: function setLogLevel(logLevel) {
                switch (logLevel.toUpperCase()) {
                    case 'INFO':
                        LOG_LEVEL = LOG_LEVEL_INFO;
                        break;

                    case 'DEBUG':
                        LOG_LEVEL = LOG_LEVEL_DEBUG;
                        break;

                    case 'WARN':
                        LOG_LEVEL = LOG_LEVEL_WARN;
                        break;

                    default:
                        LOG_LEVEL = DEF_LOG_LEVEL;
                        break;
                }
            },
            info: function info() {
                if (LOG_LEVEL <= LOG_LEVEL_INFO) {
                    var _console;

                    (_console = console).info.apply(_console, arguments);
                }
            },
            debug: function debug() {
                if (LOG_LEVEL <= LOG_LEVEL_DEBUG) {
                    var _console2;

                    (_console2 = console).log.apply(_console2, arguments);
                }
            },
            warn: function warn() {
                if (LOG_LEVEL <= LOG_LEVEL_WARN) {
                    var _console3;

                    (_console3 = console).warn.apply(_console3, arguments);
                }
            },
            error: function error() {
                if (LOG_LEVEL <= LOG_LEVEL_ERROR) {
                    var _console4;

                    (_console4 = console).error.apply(_console4, arguments);
                }
            }
        };

        var _CNameMapping$V;

        var NAME$W = 'ADOBE_ANALYTICS';
        var CNameMapping$V = (_CNameMapping$V = {
            'Adobe Analytics': NAME$W
        }, _defineProperty(_CNameMapping$V, NAME$W, NAME$W), _defineProperty(_CNameMapping$V, "AdobeAnalytics", NAME$W), _defineProperty(_CNameMapping$V, "adobeanalytics", NAME$W), _CNameMapping$V);

        var _CNameMapping$U;

        var NAME$V = 'AM';
        var CNameMapping$U = (_CNameMapping$U = {}, _defineProperty(_CNameMapping$U, NAME$V, NAME$V), _defineProperty(_CNameMapping$U, "AMPLITUDE", NAME$V), _defineProperty(_CNameMapping$U, "Amplitude", NAME$V), _CNameMapping$U);

        var _CNameMapping$T;

        var NAME$U = 'APPCUES';
        var CNameMapping$T = (_CNameMapping$T = {}, _defineProperty(_CNameMapping$T, NAME$U, NAME$U), _defineProperty(_CNameMapping$T, "Appcues", NAME$U), _CNameMapping$T);

        var _CNameMapping$S;

        var NAME$T = 'BINGADS';
        var CNameMapping$S = (_CNameMapping$S = {}, _defineProperty(_CNameMapping$S, NAME$T, NAME$T), _defineProperty(_CNameMapping$S, "BingAds", NAME$T), _CNameMapping$S);

        var _CNameMapping$R;

        var NAME$S = 'BRAZE';
        var CNameMapping$R = (_CNameMapping$R = {}, _defineProperty(_CNameMapping$R, NAME$S, NAME$S), _defineProperty(_CNameMapping$R, "Braze", NAME$S), _CNameMapping$R);

        var NAME$R = 'BUGSNAG';

        var CNameMapping$Q = _defineProperty({}, NAME$R, NAME$R);

        var _CNameMapping$Q;

        var NAME$Q = 'CHARTBEAT';
        var CNameMapping$P = (_CNameMapping$Q = {}, _defineProperty(_CNameMapping$Q, NAME$Q, NAME$Q), _defineProperty(_CNameMapping$Q, "Chartbeat", NAME$Q), _CNameMapping$Q);

        var _CNameMapping$P;

        var NAME$P = 'CLEVERTAP';
        var CNameMapping$O = (_CNameMapping$P = {}, _defineProperty(_CNameMapping$P, NAME$P, NAME$P), _defineProperty(_CNameMapping$P, "Clevertap", NAME$P), _CNameMapping$P);

        var _CNameMapping$O;

        var NAME$O = 'COMSCORE';
        var CNameMapping$N = (_CNameMapping$O = {}, _defineProperty(_CNameMapping$O, NAME$O, NAME$O), _defineProperty(_CNameMapping$O, "Comscore", NAME$O), _CNameMapping$O);

        var _CNameMapping$N;

        var NAME$N = 'CRITEO';
        var CNameMapping$M = (_CNameMapping$N = {}, _defineProperty(_CNameMapping$N, NAME$N, NAME$N), _defineProperty(_CNameMapping$N, "Criteo", NAME$N), _defineProperty(_CNameMapping$N, "criteo", NAME$N), _CNameMapping$N);

        var _CNameMapping$M;

        var NAME$M = 'CUSTOMERIO';
        var CNameMapping$L = (_CNameMapping$M = {}, _defineProperty(_CNameMapping$M, NAME$M, NAME$M), _defineProperty(_CNameMapping$M, "Customerio", NAME$M), _defineProperty(_CNameMapping$M, 'Customer.io', NAME$M), _CNameMapping$M);

        var _CNameMapping$L;

        var NAME$L = 'DRIP';
        var CNameMapping$K = (_CNameMapping$L = {}, _defineProperty(_CNameMapping$L, NAME$L, NAME$L), _defineProperty(_CNameMapping$L, "Drip", NAME$L), _defineProperty(_CNameMapping$L, "drip", NAME$L), _CNameMapping$L);

        var _CNameMapping$K;

        var NAME$K = 'FACEBOOK_PIXEL';
        var CNameMapping$J = (_CNameMapping$K = {}, _defineProperty(_CNameMapping$K, NAME$K, NAME$K), _defineProperty(_CNameMapping$K, 'FB Pixel', NAME$K), _defineProperty(_CNameMapping$K, 'Facebook Pixel', NAME$K), _defineProperty(_CNameMapping$K, "FB_PIXEL", NAME$K), _CNameMapping$K);

        var _CNameMapping$J;

        var NAME$J = 'FULLSTORY';
        var CNameMapping$I = (_CNameMapping$J = {}, _defineProperty(_CNameMapping$J, NAME$J, NAME$J), _defineProperty(_CNameMapping$J, "Fullstory", NAME$J), _defineProperty(_CNameMapping$J, "FullStory", NAME$J), _CNameMapping$J);

        var _CNameMapping$I;

        var NAME$I = 'GA';
        var CNameMapping$H = (_CNameMapping$I = {}, _defineProperty(_CNameMapping$I, NAME$I, NAME$I), _defineProperty(_CNameMapping$I, 'Google Analytics', NAME$I), _defineProperty(_CNameMapping$I, "GoogleAnalytics", NAME$I), _CNameMapping$I);

        var _CNameMapping$H;

        var NAME$H = 'GA4';
        var CNameMapping$G = (_CNameMapping$H = {}, _defineProperty(_CNameMapping$H, NAME$H, NAME$H), _defineProperty(_CNameMapping$H, 'Google Analytics 4', NAME$H), _defineProperty(_CNameMapping$H, "GoogleAnalytics4", NAME$H), _CNameMapping$H);

        var _CNameMapping$G;

        var NAME$G = 'GOOGLEADS';
        var CNameMapping$F = (_CNameMapping$G = {}, _defineProperty(_CNameMapping$G, NAME$G, NAME$G), _defineProperty(_CNameMapping$G, 'Google Ads', NAME$G), _defineProperty(_CNameMapping$G, "GoogleAds", NAME$G), _CNameMapping$G);

        var _CNameMapping$F;

        var NAME$F = 'GOOGLE_OPTIMIZE';
        var CNameMapping$E = (_CNameMapping$F = {}, _defineProperty(_CNameMapping$F, NAME$F, NAME$F), _defineProperty(_CNameMapping$F, 'Google Optimize', NAME$F), _defineProperty(_CNameMapping$F, "GoogleOptimize", NAME$F), _defineProperty(_CNameMapping$F, "Googleoptimize", NAME$F), _defineProperty(_CNameMapping$F, "GOOGLEOPTIMIZE", NAME$F), _CNameMapping$F);

        var _CNameMapping$E;

        var NAME$E = 'GTM';
        var CNameMapping$D = (_CNameMapping$E = {}, _defineProperty(_CNameMapping$E, NAME$E, NAME$E), _defineProperty(_CNameMapping$E, 'Google Tag Manager', NAME$E), _CNameMapping$E);

        var _CNameMapping$D;

        var NAME$D = 'HEAP';
        var CNameMapping$C = (_CNameMapping$D = {}, _defineProperty(_CNameMapping$D, NAME$D, NAME$D), _defineProperty(_CNameMapping$D, "Heap", NAME$D), _defineProperty(_CNameMapping$D, "heap", NAME$D), _defineProperty(_CNameMapping$D, 'Heap.io', NAME$D), _CNameMapping$D);

        var _CNameMapping$C;

        var NAME$C = 'HOTJAR';
        var CNameMapping$B = (_CNameMapping$C = {}, _defineProperty(_CNameMapping$C, NAME$C, NAME$C), _defineProperty(_CNameMapping$C, "Hotjar", NAME$C), _defineProperty(_CNameMapping$C, "hotjar", NAME$C), _CNameMapping$C);

        var _CNameMapping$B;

        var NAME$B = 'HS';
        var CNameMapping$A = (_CNameMapping$B = {}, _defineProperty(_CNameMapping$B, NAME$B, NAME$B), _defineProperty(_CNameMapping$B, "Hubspot", NAME$B), _defineProperty(_CNameMapping$B, "HUBSPOT", NAME$B), _CNameMapping$B);

        var _CNameMapping$A;

        var NAME$A = 'INTERCOM';
        var CNameMapping$z = (_CNameMapping$A = {}, _defineProperty(_CNameMapping$A, NAME$A, NAME$A), _defineProperty(_CNameMapping$A, "Intercom", NAME$A), _CNameMapping$A);

        var _CNameMapping$z;

        var NAME$z = 'KEEN';
        var CNameMapping$y = (_CNameMapping$z = {}, _defineProperty(_CNameMapping$z, NAME$z, NAME$z), _defineProperty(_CNameMapping$z, "Keen", NAME$z), _defineProperty(_CNameMapping$z, 'Keen.io', NAME$z), _CNameMapping$z);

        var _CNameMapping$y;

        var NAME$y = 'KISSMETRICS';
        var CNameMapping$x = (_CNameMapping$y = {}, _defineProperty(_CNameMapping$y, NAME$y, NAME$y), _defineProperty(_CNameMapping$y, "Kissmetrics", NAME$y), _CNameMapping$y);

        var _CNameMapping$x;

        var NAME$x = 'KLAVIYO';
        var CNameMapping$w = (_CNameMapping$x = {}, _defineProperty(_CNameMapping$x, NAME$x, NAME$x), _defineProperty(_CNameMapping$x, "Klaviyo", NAME$x), _CNameMapping$x);

        var _CNameMapping$w;

        var NAME$w = 'LAUNCHDARKLY';
        var CNameMapping$v = (_CNameMapping$w = {}, _defineProperty(_CNameMapping$w, NAME$w, NAME$w), _defineProperty(_CNameMapping$w, "LaunchDarkly", NAME$w), _defineProperty(_CNameMapping$w, "Launch_Darkly", NAME$w), _defineProperty(_CNameMapping$w, 'Launch Darkly', NAME$w), _defineProperty(_CNameMapping$w, "launchDarkly", NAME$w), _CNameMapping$w);

        var _CNameMapping$v;

        var NAME$v = 'LINKEDIN_INSIGHT_TAG';
        var CNameMapping$u = (_CNameMapping$v = {}, _defineProperty(_CNameMapping$v, NAME$v, NAME$v), _defineProperty(_CNameMapping$v, 'LinkedIn Insight Tag', NAME$v), _defineProperty(_CNameMapping$v, "Linkedin_insight_tag", NAME$v), _defineProperty(_CNameMapping$v, "LinkedinInsighttag", NAME$v), _defineProperty(_CNameMapping$v, "LinkedinInsightTag", NAME$v), _defineProperty(_CNameMapping$v, "LinkedInInsightTag", NAME$v), _defineProperty(_CNameMapping$v, "Linkedininsighttag", NAME$v), _defineProperty(_CNameMapping$v, "LINKEDININSIGHTTAG", NAME$v), _CNameMapping$v);

        var _CNameMapping$u;

        var NAME$u = 'LOTAME';
        var CNameMapping$t = (_CNameMapping$u = {}, _defineProperty(_CNameMapping$u, NAME$u, NAME$u), _defineProperty(_CNameMapping$u, "Lotame", NAME$u), _CNameMapping$u);

        var _CNameMapping$t;

        var NAME$t = 'LYTICS';
        var CNameMapping$s = (_CNameMapping$t = {}, _defineProperty(_CNameMapping$t, NAME$t, NAME$t), _defineProperty(_CNameMapping$t, "Lytics", NAME$t), _CNameMapping$t);

        var _CNameMapping$s;

        var NAME$s = 'MP';
        var CNameMapping$r = (_CNameMapping$s = {}, _defineProperty(_CNameMapping$s, NAME$s, NAME$s), _defineProperty(_CNameMapping$s, "MIXPANEL", NAME$s), _defineProperty(_CNameMapping$s, "Mixpanel", NAME$s), _CNameMapping$s);

        var _CNameMapping$r;

        var NAME$r = 'MOENGAGE';
        var CNameMapping$q = (_CNameMapping$r = {}, _defineProperty(_CNameMapping$r, NAME$r, NAME$r), _defineProperty(_CNameMapping$r, "MoEngage", NAME$r), _CNameMapping$r);

        var _CNameMapping$q;

        var NAME$q = 'OPTIMIZELY';
        var CNameMapping$p = (_CNameMapping$q = {}, _defineProperty(_CNameMapping$q, NAME$q, NAME$q), _defineProperty(_CNameMapping$q, "Optimizely", NAME$q), _CNameMapping$q);

        var _CNameMapping$p;

        var NAME$p = 'PENDO';
        var CNameMapping$o = (_CNameMapping$p = {}, _defineProperty(_CNameMapping$p, NAME$p, NAME$p), _defineProperty(_CNameMapping$p, "Pendo", NAME$p), _CNameMapping$p);

        var _CNameMapping$o;

        var NAME$o = 'PINTEREST_TAG';
        var CNameMapping$n = (_CNameMapping$o = {}, _defineProperty(_CNameMapping$o, NAME$o, NAME$o), _defineProperty(_CNameMapping$o, "PinterestTag", NAME$o), _defineProperty(_CNameMapping$o, "Pinterest_Tag", NAME$o), _defineProperty(_CNameMapping$o, "PINTERESTTAG", NAME$o), _defineProperty(_CNameMapping$o, "pinterest", NAME$o), _defineProperty(_CNameMapping$o, "PinterestAds", NAME$o), _defineProperty(_CNameMapping$o, "Pinterest_Ads", NAME$o), _defineProperty(_CNameMapping$o, "Pinterest", NAME$o), _CNameMapping$o);

        var _CNameMapping$n;

        var NAME$n = 'POST_AFFILIATE_PRO';
        var CNameMapping$m = (_CNameMapping$n = {}, _defineProperty(_CNameMapping$n, NAME$n, NAME$n), _defineProperty(_CNameMapping$n, "PostAffiliatePro", NAME$n), _defineProperty(_CNameMapping$n, "Post_affiliate_pro", NAME$n), _defineProperty(_CNameMapping$n, 'Post Affiliate Pro', NAME$n), _defineProperty(_CNameMapping$n, "postaffiliatepro", NAME$n), _defineProperty(_CNameMapping$n, "POSTAFFILIATEPRO", NAME$n), _CNameMapping$n);

        var _CNameMapping$m;

        var NAME$m = 'POSTHOG';
        var CNameMapping$l = (_CNameMapping$m = {}, _defineProperty(_CNameMapping$m, NAME$m, NAME$m), _defineProperty(_CNameMapping$m, "PostHog", NAME$m), _defineProperty(_CNameMapping$m, "Posthog", NAME$m), _CNameMapping$m);

        var _CNameMapping$l;

        var NAME$l = 'PROFITWELL';
        var CNameMapping$k = (_CNameMapping$l = {}, _defineProperty(_CNameMapping$l, NAME$l, NAME$l), _defineProperty(_CNameMapping$l, "ProfitWell", NAME$l), _defineProperty(_CNameMapping$l, "profitwell", NAME$l), _defineProperty(_CNameMapping$l, "Profitwell", NAME$l), _CNameMapping$l);

        var _CNameMapping$k;

        var NAME$k = 'QUALTRICS';
        var CNameMapping$j = (_CNameMapping$k = {}, _defineProperty(_CNameMapping$k, NAME$k, NAME$k), _defineProperty(_CNameMapping$k, "Qualtrics", NAME$k), _defineProperty(_CNameMapping$k, "qualtrics", NAME$k), _CNameMapping$k);

        var _CNameMapping$j;

        var NAME$j = 'QUANTUMMETRIC';
        var CNameMapping$i = (_CNameMapping$j = {}, _defineProperty(_CNameMapping$j, NAME$j, NAME$j), _defineProperty(_CNameMapping$j, 'Quantum Metric', NAME$j), _defineProperty(_CNameMapping$j, "QuantumMetric", NAME$j), _defineProperty(_CNameMapping$j, "quantumMetric", NAME$j), _defineProperty(_CNameMapping$j, "quantummetric", NAME$j), _defineProperty(_CNameMapping$j, "Quantum_Metric", NAME$j), _CNameMapping$j);

        var _CNameMapping$i;

        var NAME$i = 'REDDIT_PIXEL';
        var CNameMapping$h = (_CNameMapping$i = {}, _defineProperty(_CNameMapping$i, NAME$i, NAME$i), _defineProperty(_CNameMapping$i, "Reddit_Pixel", NAME$i), _defineProperty(_CNameMapping$i, "RedditPixel", NAME$i), _defineProperty(_CNameMapping$i, "REDDITPIXEL", NAME$i), _defineProperty(_CNameMapping$i, "redditpixel", NAME$i), _defineProperty(_CNameMapping$i, 'Reddit Pixel', NAME$i), _defineProperty(_CNameMapping$i, 'REDDIT PIXEL', NAME$i), _defineProperty(_CNameMapping$i, 'reddit pixel', NAME$i), _CNameMapping$i);

        var _CNameMapping$h;

        var NAME$h = 'SENTRY';
        var CNameMapping$g = (_CNameMapping$h = {}, _defineProperty(_CNameMapping$h, NAME$h, NAME$h), _defineProperty(_CNameMapping$h, "sentry", NAME$h), _defineProperty(_CNameMapping$h, "Sentry", NAME$h), _CNameMapping$h);

        var _CNameMapping$g;

        var NAME$g = 'SNAP_PIXEL';
        var CNameMapping$f = (_CNameMapping$g = {}, _defineProperty(_CNameMapping$g, NAME$g, NAME$g), _defineProperty(_CNameMapping$g, "Snap_Pixel", NAME$g), _defineProperty(_CNameMapping$g, "SnapPixel", NAME$g), _defineProperty(_CNameMapping$g, "SNAPPIXEL", NAME$g), _defineProperty(_CNameMapping$g, "snappixel", NAME$g), _defineProperty(_CNameMapping$g, 'Snap Pixel', NAME$g), _defineProperty(_CNameMapping$g, 'SNAP PIXEL', NAME$g), _defineProperty(_CNameMapping$g, 'snap pixel', NAME$g), _CNameMapping$g);

        var _CNameMapping$f;

        var NAME$f = 'TVSQUARED';
        var CNameMapping$e = (_CNameMapping$f = {}, _defineProperty(_CNameMapping$f, NAME$f, NAME$f), _defineProperty(_CNameMapping$f, "TVSquared", NAME$f), _CNameMapping$f);

        var _CNameMapping$e;

        var NAME$e = 'VWO';
        var CNameMapping$d = (_CNameMapping$e = {}, _defineProperty(_CNameMapping$e, NAME$e, NAME$e), _defineProperty(_CNameMapping$e, 'Visual Website Optimizer', NAME$e), _CNameMapping$e);

        var _CNameMapping$d;

        var NAME$d = 'GA360';
        var CNameMapping$c = (_CNameMapping$d = {}, _defineProperty(_CNameMapping$d, NAME$d, NAME$d), _defineProperty(_CNameMapping$d, 'Google Analytics 360', NAME$d), _defineProperty(_CNameMapping$d, "GoogleAnalytics360", NAME$d), _defineProperty(_CNameMapping$d, 'GA 360', NAME$d), _CNameMapping$d);

        var _CNameMapping$c;

        var NAME$c = 'ADROLL';
        var CNameMapping$b = (_CNameMapping$c = {}, _defineProperty(_CNameMapping$c, NAME$c, NAME$c), _defineProperty(_CNameMapping$c, "Adroll", NAME$c), _defineProperty(_CNameMapping$c, 'Ad roll', NAME$c), _CNameMapping$c);

        var _CNameMapping$b;

        var NAME$b = 'DCM_FLOODLIGHT';
        var CNameMapping$a = (_CNameMapping$b = {}, _defineProperty(_CNameMapping$b, NAME$b, NAME$b), _defineProperty(_CNameMapping$b, 'DCM Floodlight', NAME$b), _defineProperty(_CNameMapping$b, 'dcm floodlight', NAME$b), _defineProperty(_CNameMapping$b, 'Dcm Floodlight', NAME$b), _defineProperty(_CNameMapping$b, "DCMFloodlight", NAME$b), _defineProperty(_CNameMapping$b, "dcmfloodlight", NAME$b), _defineProperty(_CNameMapping$b, "DcmFloodlight", NAME$b), _defineProperty(_CNameMapping$b, "DCM_FLOODLIGHT", NAME$b), _defineProperty(_CNameMapping$b, "dcm_floodlight", NAME$b), _defineProperty(_CNameMapping$b, "DCM_Floodlight", NAME$b), _CNameMapping$b);

        var _CNameMapping$a;

        var NAME$a = 'MATOMO';
        var CNameMapping$9 = (_CNameMapping$a = {}, _defineProperty(_CNameMapping$a, NAME$a, NAME$a), _defineProperty(_CNameMapping$a, "MATOMO", NAME$a), _defineProperty(_CNameMapping$a, "Matomo", NAME$a), _defineProperty(_CNameMapping$a, "matomo", NAME$a), _CNameMapping$a);

        var _CNameMapping$9;

        var NAME$9 = 'VERO';
        var CNameMapping$8 = (_CNameMapping$9 = {}, _defineProperty(_CNameMapping$9, NAME$9, NAME$9), _defineProperty(_CNameMapping$9, "Vero", NAME$9), _defineProperty(_CNameMapping$9, "vero", NAME$9), _CNameMapping$9);

        var _CNameMapping$8;

        var NAME$8 = 'MOUSEFLOW';
        var CNameMapping$7 = (_CNameMapping$8 = {}, _defineProperty(_CNameMapping$8, NAME$8, NAME$8), _defineProperty(_CNameMapping$8, "Mouseflow", NAME$8), _defineProperty(_CNameMapping$8, "mouseflow", NAME$8), _defineProperty(_CNameMapping$8, "mouseFlow", NAME$8), _defineProperty(_CNameMapping$8, "MouseFlow", NAME$8), _CNameMapping$8);

        var _CNameMapping$7;

        var NAME$7 = 'ROCKERBOX';
        (_CNameMapping$7 = {}, _defineProperty(_CNameMapping$7, NAME$7, NAME$7), _defineProperty(_CNameMapping$7, "Rockerbox", NAME$7), _defineProperty(_CNameMapping$7, "rockerbox", NAME$7), _defineProperty(_CNameMapping$7, "RockerBox", NAME$7), _CNameMapping$7);

        var _CNameMapping$6;

        var NAME$6 = 'CONVERTFLOW';
        var CNameMapping$6 = (_CNameMapping$6 = {}, _defineProperty(_CNameMapping$6, NAME$6, NAME$6), _defineProperty(_CNameMapping$6, "Convertflow", NAME$6), _defineProperty(_CNameMapping$6, "convertflow", NAME$6), _defineProperty(_CNameMapping$6, "convertFlow", NAME$6), _defineProperty(_CNameMapping$6, "ConvertFlow", NAME$6), _CNameMapping$6);

        var _CNameMapping$5;

        var NAME$5 = 'SNAPENGAGE';
        var CNameMapping$5 = (_CNameMapping$5 = {}, _defineProperty(_CNameMapping$5, NAME$5, NAME$5), _defineProperty(_CNameMapping$5, "SNAPENGAGE", NAME$5), _defineProperty(_CNameMapping$5, "SnapEngage", NAME$5), _defineProperty(_CNameMapping$5, "Snap_Engage", NAME$5), _defineProperty(_CNameMapping$5, "snapengage", NAME$5), _defineProperty(_CNameMapping$5, 'SNAP ENGAGE', NAME$5), _defineProperty(_CNameMapping$5, 'Snap Engage', NAME$5), _defineProperty(_CNameMapping$5, 'snap engage', NAME$5), _CNameMapping$5);

        var _CNameMapping$4;

        var NAME$4 = 'LIVECHAT';
        var CNameMapping$4 = (_CNameMapping$4 = {}, _defineProperty(_CNameMapping$4, NAME$4, NAME$4), _defineProperty(_CNameMapping$4, "LIVECHAT", NAME$4), _defineProperty(_CNameMapping$4, "LiveChat", NAME$4), _defineProperty(_CNameMapping$4, "Live_Chat", NAME$4), _defineProperty(_CNameMapping$4, "livechat", NAME$4), _defineProperty(_CNameMapping$4, 'LIVE CHAT', NAME$4), _defineProperty(_CNameMapping$4, 'Live Chat', NAME$4), _defineProperty(_CNameMapping$4, 'live chat', NAME$4), _CNameMapping$4);

        var _CNameMapping$3;

        var NAME$3 = 'SHYNET';
        var CNameMapping$3 = (_CNameMapping$3 = {}, _defineProperty(_CNameMapping$3, NAME$3, NAME$3), _defineProperty(_CNameMapping$3, "shynet", NAME$3), _defineProperty(_CNameMapping$3, "ShyNet", NAME$3), _defineProperty(_CNameMapping$3, "shyNet", NAME$3), _defineProperty(_CNameMapping$3, "Shynet", NAME$3), _CNameMapping$3);

        var _CNameMapping$2;

        var NAME$2 = 'WOOPRA';
        var CNameMapping$2 = (_CNameMapping$2 = {}, _defineProperty(_CNameMapping$2, NAME$2, NAME$2), _defineProperty(_CNameMapping$2, "Woopra", NAME$2), _CNameMapping$2);

        var _CNameMapping$1;

        var NAME$1 = 'ROLLBAR';
        var CNameMapping$1 = (_CNameMapping$1 = {}, _defineProperty(_CNameMapping$1, NAME$1, NAME$1), _defineProperty(_CNameMapping$1, "RollBar", NAME$1), _defineProperty(_CNameMapping$1, "Roll_Bar", NAME$1), _defineProperty(_CNameMapping$1, "rollbar", NAME$1), _defineProperty(_CNameMapping$1, "Rollbar", NAME$1), _defineProperty(_CNameMapping$1, 'ROLL BAR', NAME$1), _defineProperty(_CNameMapping$1, 'Roll Bar', NAME$1), _defineProperty(_CNameMapping$1, 'roll bar', NAME$1), _CNameMapping$1);

        var _CNameMapping;

        var NAME = 'QUORA_PIXEL';
        var CNameMapping = (_CNameMapping = {}, _defineProperty(_CNameMapping, NAME, NAME), _defineProperty(_CNameMapping, 'Quora Pixel', NAME), _defineProperty(_CNameMapping, "QuoraPixel", NAME), _defineProperty(_CNameMapping, "Quorapixel", NAME), _defineProperty(_CNameMapping, "QUORAPIXEL", NAME), _defineProperty(_CNameMapping, "Quora_Pixel", NAME), _defineProperty(_CNameMapping, "quora_pixel", NAME), _defineProperty(_CNameMapping, "Quora", NAME), _CNameMapping);

        // add a mapping from common names to index.js exported key names as identified by Rudder

        var commonNames = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({
            All: 'All'
        }, CNameMapping$V), CNameMapping$U), CNameMapping$T), CNameMapping$S), CNameMapping$R), CNameMapping$Q), CNameMapping$P), CNameMapping$O), CNameMapping$N), CNameMapping$M), CNameMapping$L), CNameMapping$K), CNameMapping$J), CNameMapping$I), CNameMapping$H), CNameMapping$G), CNameMapping$c), CNameMapping$F), CNameMapping$E), CNameMapping$D), CNameMapping$C), CNameMapping$B), CNameMapping$A), CNameMapping$z), CNameMapping$y), CNameMapping$x), CNameMapping$w), CNameMapping$v), CNameMapping$u), CNameMapping$t), CNameMapping$s), CNameMapping$r), CNameMapping$q), CNameMapping$p), CNameMapping$o), CNameMapping$n), CNameMapping$m), CNameMapping$l), CNameMapping$k), CNameMapping$j), CNameMapping$i), CNameMapping$h), CNameMapping$g), CNameMapping$f), CNameMapping$e), CNameMapping$d), CNameMapping$b), CNameMapping$a), CNameMapping$9), CNameMapping$8), CNameMapping$7), CNameMapping$6), CNameMapping$5), CNameMapping$4), CNameMapping$3), CNameMapping$2), CNameMapping$1), CNameMapping);

        // from client native integration name to server identified display name
        // add a mapping from Rudder identified key names to Rudder server recognizable names
        var clientToServerNames = {
            All: 'All',
            GA: 'Google Analytics',
            GOOGLEADS: 'Google Ads',
            BRAZE: 'Braze',
            CHARTBEAT: 'Chartbeat',
            COMSCORE: 'Comscore',
            CUSTOMERIO: 'Customer IO',
            DCM_Floodlight: 'DCM Floodlight',
            FACEBOOK_PIXEL: 'Facebook Pixel',
            GTM: 'Google Tag Manager',
            HOTJAR: 'Hotjar',
            HS: 'HubSpot',
            INTERCOM: 'Intercom',
            KEEN: 'Keen',
            KISSMETRICS: 'Kiss Metrics',
            LOTAME: 'Lotame',
            VWO: 'VWO',
            OPTIMIZELY: 'Optimizely Web',
            FULLSTORY: 'Fullstory',
            TVSQUARED: 'TVSquared',
            GA4: 'Google Analytics 4',
            MOENGAGE: 'MoEngage',
            AM: 'Amplitude',
            PENDO: 'Pendo',
            LYTICS: 'Lytics',
            APPCUES: 'Appcues',
            POSTHOG: 'PostHog',
            PROFITWELL: 'ProfitWell',
            KLAVIYO: 'Klaviyo',
            CLEVERTAP: 'CleverTap',
            BINGADS: 'Bing Ads',
            PINTEREST_TAG: 'Pinterest Tag',
            SNAP_PIXEL: 'Snap Pixel',
            LINKEDIN_INSIGHT_TAG: 'Linkedin Insight Tag',
            REDDIT_PIXEL: 'Reddit Pixel',
            DRIP: 'Drip',
            HEAP: 'Heap.io',
            CRITEO: 'Criteo',
            MP: 'Mixpanel',
            QUALTRICS: 'Qualtrics',
            SENTRY: 'Sentry',
            GOOGLE_OPTIMIZE: 'Google Optimize',
            POST_AFFILIATE_PRO: 'Post Affiliate Pro',
            LAUNCHDARKLY: 'LaunchDarkly',
            GA360: 'Google Analytics 360',
            ADROLL: 'Adroll',
            VERO: 'Vero',
            MATOMO: 'Matomo',
            MOUSEFLOW: 'Mouseflow',
            ROCKERBOX: 'Rockerbox',
            CONVERTFLOW: 'ConvertFlow',
            SNAPENGAGE: 'SnapEngage',
            LIVECHAT: 'LiveChat',
            SHYNET: 'Shynet',
            WOOPRA: 'Woopra',
            ROLLBAR: 'RollBar',
            QUORA_PIXEL: 'Quora Pixel'
        };

        // Reserved Keywords for properties/traits
        var RESERVED_KEYS = ['anonymous_id', 'id', 'sent_at', 'received_at', 'timestamp', 'original_timestamp', 'event_text', 'event'];
        var CONFIG_URL = 'https://api.rudderlabs.com/sourceConfig/?p=npm&v=2.15.0';
        var CDN_INT_DIR = 'js-integrations';
        var DEST_SDK_BASE_URL = "https://cdn.rudderlabs.com/v1.1/".concat(CDN_INT_DIR);
        var MAX_WAIT_FOR_INTEGRATION_LOAD = 10000;
        var INTEGRATION_LOAD_CHECK_INTERVAL = 1000;
        var INTG_SUFFIX = '_RS';
        var POLYFILL_URL = 'https://polyfill.io/v3/polyfill.min.js?features=Array.prototype.find%2CArray.prototype.includes%2CPromise%2CString.prototype.endsWith%2CString.prototype.includes%2CString.prototype.startsWith%2CObject.entries%2CObject.values%2CElement.prototype.dataset%2CString.prototype.replaceAll';
        var DEFAULT_ERROR_REPORT_PROVIDER = 'bugsnag';
        var ERROR_REPORT_PROVIDERS = [DEFAULT_ERROR_REPORT_PROVIDER];
        var SAMESITE_COOKIE_OPTS = ['Lax', 'None', 'Strict'];
        var DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000; // 30 min in milliseconds

        var MIN_SESSION_TIMEOUT = 10 * 1000; // 10 sec in milliseconds

        var MIN_SESSION_ID_LENGTH = 10;

        var aes = {exports: {}};

        var core = {exports: {}};

        var hasRequiredCore;

        function requireCore() {
            if (hasRequiredCore) return core.exports;
            hasRequiredCore = 1;

            (function (module, exports) {

                (function (root, factory) {
                    {
                        // CommonJS
                        module.exports = factory();
                    }
                })(commonjsGlobal, function () {
                    /**
                     * CryptoJS core components.
                     */
                    var CryptoJS = CryptoJS || function (Math, undefined$1) {
                        /*
           * Local polyfil of Object.create
           */
                        var create = Object.create || function () {
                            function F() {
                            }

                            return function (obj) {
                                var subtype;
                                F.prototype = obj;
                                subtype = new F();
                                F.prototype = null;
                                return subtype;
                            };
                        }();
                        /**
                         * CryptoJS namespace.
                         */


                        var C = {};
                        /**
                         * Library namespace.
                         */

                        var C_lib = C.lib = {};
                        /**
                         * Base object for prototypal inheritance.
                         */

                        var Base = C_lib.Base = function () {
                            return {
                                /**
                                 * Creates a new object that inherits from this object.
                                 *
                                 * @param {Object} overrides Properties to copy into the new object.
                                 *
                                 * @return {Object} The new object.
                                 *
                                 * @static
                                 *
                                 * @example
                                 *
                                 *     var MyType = CryptoJS.lib.Base.extend({
                                 *         field: 'value',
                                 *
                                 *         method: function () {
                                 *         }
                                 *     });
                                 */
                                extend: function extend(overrides) {
                                    // Spawn
                                    var subtype = create(this); // Augment

                                    if (overrides) {
                                        subtype.mixIn(overrides);
                                    } // Create default initializer


                                    if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
                                        subtype.init = function () {
                                            subtype.$super.init.apply(this, arguments);
                                        };
                                    } // Initializer's prototype is the subtype object


                                    subtype.init.prototype = subtype; // Reference supertype

                                    subtype.$super = this;
                                    return subtype;
                                },

                                /**
                                 * Extends this object and runs the init method.
                                 * Arguments to create() will be passed to init().
                                 *
                                 * @return {Object} The new object.
                                 *
                                 * @static
                                 *
                                 * @example
                                 *
                                 *     var instance = MyType.create();
                                 */
                                create: function create() {
                                    var instance = this.extend();
                                    instance.init.apply(instance, arguments);
                                    return instance;
                                },

                                /**
                                 * Initializes a newly created object.
                                 * Override this method to add some logic when your objects are created.
                                 *
                                 * @example
                                 *
                                 *     var MyType = CryptoJS.lib.Base.extend({
                                 *         init: function () {
                                 *             // ...
                                 *         }
                                 *     });
                                 */
                                init: function init() {
                                },

                                /**
                                 * Copies properties into this object.
                                 *
                                 * @param {Object} properties The properties to mix in.
                                 *
                                 * @example
                                 *
                                 *     MyType.mixIn({
                                 *         field: 'value'
                                 *     });
                                 */
                                mixIn: function mixIn(properties) {
                                    for (var propertyName in properties) {
                                        if (properties.hasOwnProperty(propertyName)) {
                                            this[propertyName] = properties[propertyName];
                                        }
                                    } // IE won't copy toString using the loop above


                                    if (properties.hasOwnProperty('toString')) {
                                        this.toString = properties.toString;
                                    }
                                },

                                /**
                                 * Creates a copy of this object.
                                 *
                                 * @return {Object} The clone.
                                 *
                                 * @example
                                 *
                                 *     var clone = instance.clone();
                                 */
                                clone: function clone() {
                                    return this.init.prototype.extend(this);
                                }
                            };
                        }();
                        /**
                         * An array of 32-bit words.
                         *
                         * @property {Array} words The array of 32-bit words.
                         * @property {number} sigBytes The number of significant bytes in this word array.
                         */


                        var WordArray = C_lib.WordArray = Base.extend({
                            /**
                             * Initializes a newly created word array.
                             *
                             * @param {Array} words (Optional) An array of 32-bit words.
                             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
                             *
                             * @example
                             *
                             *     var wordArray = CryptoJS.lib.WordArray.create();
                             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
                             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
                             */
                            init: function init(words, sigBytes) {
                                words = this.words = words || [];

                                if (sigBytes != undefined$1) {
                                    this.sigBytes = sigBytes;
                                } else {
                                    this.sigBytes = words.length * 4;
                                }
                            },

                            /**
                             * Converts this word array to a string.
                             *
                             * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
                             *
                             * @return {string} The stringified word array.
                             *
                             * @example
                             *
                             *     var string = wordArray + '';
                             *     var string = wordArray.toString();
                             *     var string = wordArray.toString(CryptoJS.enc.Utf8);
                             */
                            toString: function toString(encoder) {
                                return (encoder || Hex).stringify(this);
                            },

                            /**
                             * Concatenates a word array to this word array.
                             *
                             * @param {WordArray} wordArray The word array to append.
                             *
                             * @return {WordArray} This word array.
                             *
                             * @example
                             *
                             *     wordArray1.concat(wordArray2);
                             */
                            concat: function concat(wordArray) {
                                // Shortcuts
                                var thisWords = this.words;
                                var thatWords = wordArray.words;
                                var thisSigBytes = this.sigBytes;
                                var thatSigBytes = wordArray.sigBytes; // Clamp excess bits

                                this.clamp(); // Concat

                                if (thisSigBytes % 4) {
                                    // Copy one byte at a time
                                    for (var i = 0; i < thatSigBytes; i++) {
                                        var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                                        thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
                                    }
                                } else {
                                    // Copy one word at a time
                                    for (var i = 0; i < thatSigBytes; i += 4) {
                                        thisWords[thisSigBytes + i >>> 2] = thatWords[i >>> 2];
                                    }
                                }

                                this.sigBytes += thatSigBytes; // Chainable

                                return this;
                            },

                            /**
                             * Removes insignificant bits.
                             *
                             * @example
                             *
                             *     wordArray.clamp();
                             */
                            clamp: function clamp() {
                                // Shortcuts
                                var words = this.words;
                                var sigBytes = this.sigBytes; // Clamp

                                words[sigBytes >>> 2] &= 0xffffffff << 32 - sigBytes % 4 * 8;
                                words.length = Math.ceil(sigBytes / 4);
                            },

                            /**
                             * Creates a copy of this word array.
                             *
                             * @return {WordArray} The clone.
                             *
                             * @example
                             *
                             *     var clone = wordArray.clone();
                             */
                            clone: function clone() {
                                var clone = Base.clone.call(this);
                                clone.words = this.words.slice(0);
                                return clone;
                            },

                            /**
                             * Creates a word array filled with random bytes.
                             *
                             * @param {number} nBytes The number of random bytes to generate.
                             *
                             * @return {WordArray} The random word array.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var wordArray = CryptoJS.lib.WordArray.random(16);
                             */
                            random: function random(nBytes) {
                                var words = [];

                                var r = function r(m_w) {
                                    var m_w = m_w;
                                    var m_z = 0x3ade68b1;
                                    var mask = 0xffffffff;
                                    return function () {
                                        m_z = 0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10) & mask;
                                        m_w = 0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10) & mask;
                                        var result = (m_z << 0x10) + m_w & mask;
                                        result /= 0x100000000;
                                        result += 0.5;
                                        return result * (Math.random() > .5 ? 1 : -1);
                                    };
                                };

                                for (var i = 0, rcache; i < nBytes; i += 4) {
                                    var _r = r((rcache || Math.random()) * 0x100000000);

                                    rcache = _r() * 0x3ade67b7;
                                    words.push(_r() * 0x100000000 | 0);
                                }

                                return new WordArray.init(words, nBytes);
                            }
                        });
                        /**
                         * Encoder namespace.
                         */

                        var C_enc = C.enc = {};
                        /**
                         * Hex encoding strategy.
                         */

                        var Hex = C_enc.Hex = {
                            /**
                             * Converts a word array to a hex string.
                             *
                             * @param {WordArray} wordArray The word array.
                             *
                             * @return {string} The hex string.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
                             */
                            stringify: function stringify(wordArray) {
                                // Shortcuts
                                var words = wordArray.words;
                                var sigBytes = wordArray.sigBytes; // Convert

                                var hexChars = [];

                                for (var i = 0; i < sigBytes; i++) {
                                    var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                                    hexChars.push((bite >>> 4).toString(16));
                                    hexChars.push((bite & 0x0f).toString(16));
                                }

                                return hexChars.join('');
                            },

                            /**
                             * Converts a hex string to a word array.
                             *
                             * @param {string} hexStr The hex string.
                             *
                             * @return {WordArray} The word array.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
                             */
                            parse: function parse(hexStr) {
                                // Shortcut
                                var hexStrLength = hexStr.length; // Convert

                                var words = [];

                                for (var i = 0; i < hexStrLength; i += 2) {
                                    words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
                                }

                                return new WordArray.init(words, hexStrLength / 2);
                            }
                        };
                        /**
                         * Latin1 encoding strategy.
                         */

                        var Latin1 = C_enc.Latin1 = {
                            /**
                             * Converts a word array to a Latin1 string.
                             *
                             * @param {WordArray} wordArray The word array.
                             *
                             * @return {string} The Latin1 string.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
                             */
                            stringify: function stringify(wordArray) {
                                // Shortcuts
                                var words = wordArray.words;
                                var sigBytes = wordArray.sigBytes; // Convert

                                var latin1Chars = [];

                                for (var i = 0; i < sigBytes; i++) {
                                    var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                                    latin1Chars.push(String.fromCharCode(bite));
                                }

                                return latin1Chars.join('');
                            },

                            /**
                             * Converts a Latin1 string to a word array.
                             *
                             * @param {string} latin1Str The Latin1 string.
                             *
                             * @return {WordArray} The word array.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
                             */
                            parse: function parse(latin1Str) {
                                // Shortcut
                                var latin1StrLength = latin1Str.length; // Convert

                                var words = [];

                                for (var i = 0; i < latin1StrLength; i++) {
                                    words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << 24 - i % 4 * 8;
                                }

                                return new WordArray.init(words, latin1StrLength);
                            }
                        };
                        /**
                         * UTF-8 encoding strategy.
                         */

                        var Utf8 = C_enc.Utf8 = {
                            /**
                             * Converts a word array to a UTF-8 string.
                             *
                             * @param {WordArray} wordArray The word array.
                             *
                             * @return {string} The UTF-8 string.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
                             */
                            stringify: function stringify(wordArray) {
                                try {
                                    return decodeURIComponent(escape(Latin1.stringify(wordArray)));
                                } catch (e) {
                                    throw new Error('Malformed UTF-8 data');
                                }
                            },

                            /**
                             * Converts a UTF-8 string to a word array.
                             *
                             * @param {string} utf8Str The UTF-8 string.
                             *
                             * @return {WordArray} The word array.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
                             */
                            parse: function parse(utf8Str) {
                                return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
                            }
                        };
                        /**
                         * Abstract buffered block algorithm template.
                         *
                         * The property blockSize must be implemented in a concrete subtype.
                         *
                         * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
                         */

                        var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
                            /**
                             * Resets this block algorithm's data buffer to its initial state.
                             *
                             * @example
                             *
                             *     bufferedBlockAlgorithm.reset();
                             */
                            reset: function reset() {
                                // Initial values
                                this._data = new WordArray.init();
                                this._nDataBytes = 0;
                            },

                            /**
                             * Adds new data to this block algorithm's buffer.
                             *
                             * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
                             *
                             * @example
                             *
                             *     bufferedBlockAlgorithm._append('data');
                             *     bufferedBlockAlgorithm._append(wordArray);
                             */
                            _append: function _append(data) {
                                // Convert string to WordArray, else assume WordArray already
                                if (typeof data == 'string') {
                                    data = Utf8.parse(data);
                                } // Append


                                this._data.concat(data);

                                this._nDataBytes += data.sigBytes;
                            },

                            /**
                             * Processes available data blocks.
                             *
                             * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
                             *
                             * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
                             *
                             * @return {WordArray} The processed data.
                             *
                             * @example
                             *
                             *     var processedData = bufferedBlockAlgorithm._process();
                             *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
                             */
                            _process: function _process(doFlush) {
                                // Shortcuts
                                var data = this._data;
                                var dataWords = data.words;
                                var dataSigBytes = data.sigBytes;
                                var blockSize = this.blockSize;
                                var blockSizeBytes = blockSize * 4; // Count blocks ready

                                var nBlocksReady = dataSigBytes / blockSizeBytes;

                                if (doFlush) {
                                    // Round up to include partial blocks
                                    nBlocksReady = Math.ceil(nBlocksReady);
                                } else {
                                    // Round down to include only full blocks,
                                    // less the number of blocks that must remain in the buffer
                                    nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
                                } // Count words ready


                                var nWordsReady = nBlocksReady * blockSize; // Count bytes ready

                                var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes); // Process blocks

                                if (nWordsReady) {
                                    for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                                        // Perform concrete-algorithm logic
                                        this._doProcessBlock(dataWords, offset);
                                    } // Remove processed words


                                    var processedWords = dataWords.splice(0, nWordsReady);
                                    data.sigBytes -= nBytesReady;
                                } // Return processed words


                                return new WordArray.init(processedWords, nBytesReady);
                            },

                            /**
                             * Creates a copy of this object.
                             *
                             * @return {Object} The clone.
                             *
                             * @example
                             *
                             *     var clone = bufferedBlockAlgorithm.clone();
                             */
                            clone: function clone() {
                                var clone = Base.clone.call(this);
                                clone._data = this._data.clone();
                                return clone;
                            },
                            _minBufferSize: 0
                        });
                        /**
                         * Abstract hasher template.
                         *
                         * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
                         */

                        C_lib.Hasher = BufferedBlockAlgorithm.extend({
                            /**
                             * Configuration options.
                             */
                            cfg: Base.extend(),

                            /**
                             * Initializes a newly created hasher.
                             *
                             * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
                             *
                             * @example
                             *
                             *     var hasher = CryptoJS.algo.SHA256.create();
                             */
                            init: function init(cfg) {
                                // Apply config defaults
                                this.cfg = this.cfg.extend(cfg); // Set initial values

                                this.reset();
                            },

                            /**
                             * Resets this hasher to its initial state.
                             *
                             * @example
                             *
                             *     hasher.reset();
                             */
                            reset: function reset() {
                                // Reset data buffer
                                BufferedBlockAlgorithm.reset.call(this); // Perform concrete-hasher logic

                                this._doReset();
                            },

                            /**
                             * Updates this hasher with a message.
                             *
                             * @param {WordArray|string} messageUpdate The message to append.
                             *
                             * @return {Hasher} This hasher.
                             *
                             * @example
                             *
                             *     hasher.update('message');
                             *     hasher.update(wordArray);
                             */
                            update: function update(messageUpdate) {
                                // Append
                                this._append(messageUpdate); // Update the hash


                                this._process(); // Chainable


                                return this;
                            },

                            /**
                             * Finalizes the hash computation.
                             * Note that the finalize operation is effectively a destructive, read-once operation.
                             *
                             * @param {WordArray|string} messageUpdate (Optional) A final message update.
                             *
                             * @return {WordArray} The hash.
                             *
                             * @example
                             *
                             *     var hash = hasher.finalize();
                             *     var hash = hasher.finalize('message');
                             *     var hash = hasher.finalize(wordArray);
                             */
                            finalize: function finalize(messageUpdate) {
                                // Final message update
                                if (messageUpdate) {
                                    this._append(messageUpdate);
                                } // Perform concrete-hasher logic


                                var hash = this._doFinalize();

                                return hash;
                            },
                            blockSize: 512 / 32,

                            /**
                             * Creates a shortcut function to a hasher's object interface.
                             *
                             * @param {Hasher} hasher The hasher to create a helper for.
                             *
                             * @return {Function} The shortcut function.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
                             */
                            _createHelper: function _createHelper(hasher) {
                                return function (message, cfg) {
                                    return new hasher.init(cfg).finalize(message);
                                };
                            },

                            /**
                             * Creates a shortcut function to the HMAC's object interface.
                             *
                             * @param {Hasher} hasher The hasher to use in this HMAC helper.
                             *
                             * @return {Function} The shortcut function.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
                             */
                            _createHmacHelper: function _createHmacHelper(hasher) {
                                return function (message, key) {
                                    return new C_algo.HMAC.init(hasher, key).finalize(message);
                                };
                            }
                        });
                        /**
                         * Algorithm namespace.
                         */

                        var C_algo = C.algo = {};
                        return C;
                    }(Math);

                    return CryptoJS;
                });
            })(core);

            return core.exports;
        }

        var encBase64 = {exports: {}};

        var hasRequiredEncBase64;

        function requireEncBase64() {
            if (hasRequiredEncBase64) return encBase64.exports;
            hasRequiredEncBase64 = 1;

            (function (module, exports) {

                (function (root, factory) {
                    {
                        // CommonJS
                        module.exports = factory(requireCore());
                    }
                })(commonjsGlobal, function (CryptoJS) {
                    (function () {
                        // Shortcuts
                        var C = CryptoJS;
                        var C_lib = C.lib;
                        var WordArray = C_lib.WordArray;
                        var C_enc = C.enc;
                        /**
                         * Base64 encoding strategy.
                         */

                        C_enc.Base64 = {
                            /**
                             * Converts a word array to a Base64 string.
                             *
                             * @param {WordArray} wordArray The word array.
                             *
                             * @return {string} The Base64 string.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
                             */
                            stringify: function stringify(wordArray) {
                                // Shortcuts
                                var words = wordArray.words;
                                var sigBytes = wordArray.sigBytes;
                                var map = this._map; // Clamp excess bits

                                wordArray.clamp(); // Convert

                                var base64Chars = [];

                                for (var i = 0; i < sigBytes; i += 3) {
                                    var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                                    var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 0xff;
                                    var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 0xff;
                                    var triplet = byte1 << 16 | byte2 << 8 | byte3;

                                    for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
                                        base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 0x3f));
                                    }
                                } // Add padding


                                var paddingChar = map.charAt(64);

                                if (paddingChar) {
                                    while (base64Chars.length % 4) {
                                        base64Chars.push(paddingChar);
                                    }
                                }

                                return base64Chars.join('');
                            },

                            /**
                             * Converts a Base64 string to a word array.
                             *
                             * @param {string} base64Str The Base64 string.
                             *
                             * @return {WordArray} The word array.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
                             */
                            parse: function parse(base64Str) {
                                // Shortcuts
                                var base64StrLength = base64Str.length;
                                var map = this._map;
                                var reverseMap = this._reverseMap;

                                if (!reverseMap) {
                                    reverseMap = this._reverseMap = [];

                                    for (var j = 0; j < map.length; j++) {
                                        reverseMap[map.charCodeAt(j)] = j;
                                    }
                                } // Ignore padding


                                var paddingChar = map.charAt(64);

                                if (paddingChar) {
                                    var paddingIndex = base64Str.indexOf(paddingChar);

                                    if (paddingIndex !== -1) {
                                        base64StrLength = paddingIndex;
                                    }
                                } // Convert


                                return parseLoop(base64Str, base64StrLength, reverseMap);
                            },
                            _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
                        };

                        function parseLoop(base64Str, base64StrLength, reverseMap) {
                            var words = [];
                            var nBytes = 0;

                            for (var i = 0; i < base64StrLength; i++) {
                                if (i % 4) {
                                    var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2;
                                    var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
                                    words[nBytes >>> 2] |= (bits1 | bits2) << 24 - nBytes % 4 * 8;
                                    nBytes++;
                                }
                            }

                            return WordArray.create(words, nBytes);
                        }
                    })();

                    return CryptoJS.enc.Base64;
                });
            })(encBase64);

            return encBase64.exports;
        }

        var md5$1 = {exports: {}};

        var hasRequiredMd5;

        function requireMd5() {
            if (hasRequiredMd5) return md5$1.exports;
            hasRequiredMd5 = 1;

            (function (module, exports) {

                (function (root, factory) {
                    {
                        // CommonJS
                        module.exports = factory(requireCore());
                    }
                })(commonjsGlobal, function (CryptoJS) {
                    (function (Math) {
                        // Shortcuts
                        var C = CryptoJS;
                        var C_lib = C.lib;
                        var WordArray = C_lib.WordArray;
                        var Hasher = C_lib.Hasher;
                        var C_algo = C.algo; // Constants table

                        var T = []; // Compute constants

                        (function () {
                            for (var i = 0; i < 64; i++) {
                                T[i] = Math.abs(Math.sin(i + 1)) * 0x100000000 | 0;
                            }
                        })();
                        /**
                         * MD5 hash algorithm.
                         */


                        var MD5 = C_algo.MD5 = Hasher.extend({
                            _doReset: function _doReset() {
                                this._hash = new WordArray.init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);
                            },
                            _doProcessBlock: function _doProcessBlock(M, offset) {
                                // Swap endian
                                for (var i = 0; i < 16; i++) {
                                    // Shortcuts
                                    var offset_i = offset + i;
                                    var M_offset_i = M[offset_i];
                                    M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 0x00ff00ff | (M_offset_i << 24 | M_offset_i >>> 8) & 0xff00ff00;
                                } // Shortcuts


                                var H = this._hash.words;
                                var M_offset_0 = M[offset + 0];
                                var M_offset_1 = M[offset + 1];
                                var M_offset_2 = M[offset + 2];
                                var M_offset_3 = M[offset + 3];
                                var M_offset_4 = M[offset + 4];
                                var M_offset_5 = M[offset + 5];
                                var M_offset_6 = M[offset + 6];
                                var M_offset_7 = M[offset + 7];
                                var M_offset_8 = M[offset + 8];
                                var M_offset_9 = M[offset + 9];
                                var M_offset_10 = M[offset + 10];
                                var M_offset_11 = M[offset + 11];
                                var M_offset_12 = M[offset + 12];
                                var M_offset_13 = M[offset + 13];
                                var M_offset_14 = M[offset + 14];
                                var M_offset_15 = M[offset + 15]; // Working varialbes

                                var a = H[0];
                                var b = H[1];
                                var c = H[2];
                                var d = H[3]; // Computation

                                a = FF(a, b, c, d, M_offset_0, 7, T[0]);
                                d = FF(d, a, b, c, M_offset_1, 12, T[1]);
                                c = FF(c, d, a, b, M_offset_2, 17, T[2]);
                                b = FF(b, c, d, a, M_offset_3, 22, T[3]);
                                a = FF(a, b, c, d, M_offset_4, 7, T[4]);
                                d = FF(d, a, b, c, M_offset_5, 12, T[5]);
                                c = FF(c, d, a, b, M_offset_6, 17, T[6]);
                                b = FF(b, c, d, a, M_offset_7, 22, T[7]);
                                a = FF(a, b, c, d, M_offset_8, 7, T[8]);
                                d = FF(d, a, b, c, M_offset_9, 12, T[9]);
                                c = FF(c, d, a, b, M_offset_10, 17, T[10]);
                                b = FF(b, c, d, a, M_offset_11, 22, T[11]);
                                a = FF(a, b, c, d, M_offset_12, 7, T[12]);
                                d = FF(d, a, b, c, M_offset_13, 12, T[13]);
                                c = FF(c, d, a, b, M_offset_14, 17, T[14]);
                                b = FF(b, c, d, a, M_offset_15, 22, T[15]);
                                a = GG(a, b, c, d, M_offset_1, 5, T[16]);
                                d = GG(d, a, b, c, M_offset_6, 9, T[17]);
                                c = GG(c, d, a, b, M_offset_11, 14, T[18]);
                                b = GG(b, c, d, a, M_offset_0, 20, T[19]);
                                a = GG(a, b, c, d, M_offset_5, 5, T[20]);
                                d = GG(d, a, b, c, M_offset_10, 9, T[21]);
                                c = GG(c, d, a, b, M_offset_15, 14, T[22]);
                                b = GG(b, c, d, a, M_offset_4, 20, T[23]);
                                a = GG(a, b, c, d, M_offset_9, 5, T[24]);
                                d = GG(d, a, b, c, M_offset_14, 9, T[25]);
                                c = GG(c, d, a, b, M_offset_3, 14, T[26]);
                                b = GG(b, c, d, a, M_offset_8, 20, T[27]);
                                a = GG(a, b, c, d, M_offset_13, 5, T[28]);
                                d = GG(d, a, b, c, M_offset_2, 9, T[29]);
                                c = GG(c, d, a, b, M_offset_7, 14, T[30]);
                                b = GG(b, c, d, a, M_offset_12, 20, T[31]);
                                a = HH(a, b, c, d, M_offset_5, 4, T[32]);
                                d = HH(d, a, b, c, M_offset_8, 11, T[33]);
                                c = HH(c, d, a, b, M_offset_11, 16, T[34]);
                                b = HH(b, c, d, a, M_offset_14, 23, T[35]);
                                a = HH(a, b, c, d, M_offset_1, 4, T[36]);
                                d = HH(d, a, b, c, M_offset_4, 11, T[37]);
                                c = HH(c, d, a, b, M_offset_7, 16, T[38]);
                                b = HH(b, c, d, a, M_offset_10, 23, T[39]);
                                a = HH(a, b, c, d, M_offset_13, 4, T[40]);
                                d = HH(d, a, b, c, M_offset_0, 11, T[41]);
                                c = HH(c, d, a, b, M_offset_3, 16, T[42]);
                                b = HH(b, c, d, a, M_offset_6, 23, T[43]);
                                a = HH(a, b, c, d, M_offset_9, 4, T[44]);
                                d = HH(d, a, b, c, M_offset_12, 11, T[45]);
                                c = HH(c, d, a, b, M_offset_15, 16, T[46]);
                                b = HH(b, c, d, a, M_offset_2, 23, T[47]);
                                a = II(a, b, c, d, M_offset_0, 6, T[48]);
                                d = II(d, a, b, c, M_offset_7, 10, T[49]);
                                c = II(c, d, a, b, M_offset_14, 15, T[50]);
                                b = II(b, c, d, a, M_offset_5, 21, T[51]);
                                a = II(a, b, c, d, M_offset_12, 6, T[52]);
                                d = II(d, a, b, c, M_offset_3, 10, T[53]);
                                c = II(c, d, a, b, M_offset_10, 15, T[54]);
                                b = II(b, c, d, a, M_offset_1, 21, T[55]);
                                a = II(a, b, c, d, M_offset_8, 6, T[56]);
                                d = II(d, a, b, c, M_offset_15, 10, T[57]);
                                c = II(c, d, a, b, M_offset_6, 15, T[58]);
                                b = II(b, c, d, a, M_offset_13, 21, T[59]);
                                a = II(a, b, c, d, M_offset_4, 6, T[60]);
                                d = II(d, a, b, c, M_offset_11, 10, T[61]);
                                c = II(c, d, a, b, M_offset_2, 15, T[62]);
                                b = II(b, c, d, a, M_offset_9, 21, T[63]); // Intermediate hash value

                                H[0] = H[0] + a | 0;
                                H[1] = H[1] + b | 0;
                                H[2] = H[2] + c | 0;
                                H[3] = H[3] + d | 0;
                            },
                            _doFinalize: function _doFinalize() {
                                // Shortcuts
                                var data = this._data;
                                var dataWords = data.words;
                                var nBitsTotal = this._nDataBytes * 8;
                                var nBitsLeft = data.sigBytes * 8; // Add padding

                                dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
                                var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
                                var nBitsTotalL = nBitsTotal;
                                dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 0x00ff00ff | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 0xff00ff00;
                                dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 0x00ff00ff | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 0xff00ff00;
                                data.sigBytes = (dataWords.length + 1) * 4; // Hash final blocks

                                this._process(); // Shortcuts


                                var hash = this._hash;
                                var H = hash.words; // Swap endian

                                for (var i = 0; i < 4; i++) {
                                    // Shortcut
                                    var H_i = H[i];
                                    H[i] = (H_i << 8 | H_i >>> 24) & 0x00ff00ff | (H_i << 24 | H_i >>> 8) & 0xff00ff00;
                                } // Return final computed hash


                                return hash;
                            },
                            clone: function clone() {
                                var clone = Hasher.clone.call(this);
                                clone._hash = this._hash.clone();
                                return clone;
                            }
                        });

                        function FF(a, b, c, d, x, s, t) {
                            var n = a + (b & c | ~b & d) + x + t;
                            return (n << s | n >>> 32 - s) + b;
                        }

                        function GG(a, b, c, d, x, s, t) {
                            var n = a + (b & d | c & ~d) + x + t;
                            return (n << s | n >>> 32 - s) + b;
                        }

                        function HH(a, b, c, d, x, s, t) {
                            var n = a + (b ^ c ^ d) + x + t;
                            return (n << s | n >>> 32 - s) + b;
                        }

                        function II(a, b, c, d, x, s, t) {
                            var n = a + (c ^ (b | ~d)) + x + t;
                            return (n << s | n >>> 32 - s) + b;
                        }

                        /**
                         * Shortcut function to the hasher's object interface.
                         *
                         * @param {WordArray|string} message The message to hash.
                         *
                         * @return {WordArray} The hash.
                         *
                         * @static
                         *
                         * @example
                         *
                         *     var hash = CryptoJS.MD5('message');
                         *     var hash = CryptoJS.MD5(wordArray);
                         */


                        C.MD5 = Hasher._createHelper(MD5);
                        /**
                         * Shortcut function to the HMAC's object interface.
                         *
                         * @param {WordArray|string} message The message to hash.
                         * @param {WordArray|string} key The secret key.
                         *
                         * @return {WordArray} The HMAC.
                         *
                         * @static
                         *
                         * @example
                         *
                         *     var hmac = CryptoJS.HmacMD5(message, key);
                         */

                        C.HmacMD5 = Hasher._createHmacHelper(MD5);
                    })(Math);

                    return CryptoJS.MD5;
                });
            })(md5$1);

            return md5$1.exports;
        }

        var evpkdf = {exports: {}};

        var sha1$1 = {exports: {}};

        var hasRequiredSha1;

        function requireSha1() {
            if (hasRequiredSha1) return sha1$1.exports;
            hasRequiredSha1 = 1;

            (function (module, exports) {

                (function (root, factory) {
                    {
                        // CommonJS
                        module.exports = factory(requireCore());
                    }
                })(commonjsGlobal, function (CryptoJS) {
                    (function () {
                        // Shortcuts
                        var C = CryptoJS;
                        var C_lib = C.lib;
                        var WordArray = C_lib.WordArray;
                        var Hasher = C_lib.Hasher;
                        var C_algo = C.algo; // Reusable object

                        var W = [];
                        /**
                         * SHA-1 hash algorithm.
                         */

                        var SHA1 = C_algo.SHA1 = Hasher.extend({
                            _doReset: function _doReset() {
                                this._hash = new WordArray.init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
                            },
                            _doProcessBlock: function _doProcessBlock(M, offset) {
                                // Shortcut
                                var H = this._hash.words; // Working variables

                                var a = H[0];
                                var b = H[1];
                                var c = H[2];
                                var d = H[3];
                                var e = H[4]; // Computation

                                for (var i = 0; i < 80; i++) {
                                    if (i < 16) {
                                        W[i] = M[offset + i] | 0;
                                    } else {
                                        var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                                        W[i] = n << 1 | n >>> 31;
                                    }

                                    var t = (a << 5 | a >>> 27) + e + W[i];

                                    if (i < 20) {
                                        t += (b & c | ~b & d) + 0x5a827999;
                                    } else if (i < 40) {
                                        t += (b ^ c ^ d) + 0x6ed9eba1;
                                    } else if (i < 60) {
                                        t += (b & c | b & d | c & d) - 0x70e44324;
                                    } else
                                        /* if (i < 80) */
                                    {
                                        t += (b ^ c ^ d) - 0x359d3e2a;
                                    }

                                    e = d;
                                    d = c;
                                    c = b << 30 | b >>> 2;
                                    b = a;
                                    a = t;
                                } // Intermediate hash value


                                H[0] = H[0] + a | 0;
                                H[1] = H[1] + b | 0;
                                H[2] = H[2] + c | 0;
                                H[3] = H[3] + d | 0;
                                H[4] = H[4] + e | 0;
                            },
                            _doFinalize: function _doFinalize() {
                                // Shortcuts
                                var data = this._data;
                                var dataWords = data.words;
                                var nBitsTotal = this._nDataBytes * 8;
                                var nBitsLeft = data.sigBytes * 8; // Add padding

                                dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
                                dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
                                dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
                                data.sigBytes = dataWords.length * 4; // Hash final blocks

                                this._process(); // Return final computed hash


                                return this._hash;
                            },
                            clone: function clone() {
                                var clone = Hasher.clone.call(this);
                                clone._hash = this._hash.clone();
                                return clone;
                            }
                        });
                        /**
                         * Shortcut function to the hasher's object interface.
                         *
                         * @param {WordArray|string} message The message to hash.
                         *
                         * @return {WordArray} The hash.
                         *
                         * @static
                         *
                         * @example
                         *
                         *     var hash = CryptoJS.SHA1('message');
                         *     var hash = CryptoJS.SHA1(wordArray);
                         */

                        C.SHA1 = Hasher._createHelper(SHA1);
                        /**
                         * Shortcut function to the HMAC's object interface.
                         *
                         * @param {WordArray|string} message The message to hash.
                         * @param {WordArray|string} key The secret key.
                         *
                         * @return {WordArray} The HMAC.
                         *
                         * @static
                         *
                         * @example
                         *
                         *     var hmac = CryptoJS.HmacSHA1(message, key);
                         */

                        C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
                    })();

                    return CryptoJS.SHA1;
                });
            })(sha1$1);

            return sha1$1.exports;
        }

        var hmac = {exports: {}};

        var hasRequiredHmac;

        function requireHmac() {
            if (hasRequiredHmac) return hmac.exports;
            hasRequiredHmac = 1;

            (function (module, exports) {

                (function (root, factory) {
                    {
                        // CommonJS
                        module.exports = factory(requireCore());
                    }
                })(commonjsGlobal, function (CryptoJS) {
                    (function () {
                        // Shortcuts
                        var C = CryptoJS;
                        var C_lib = C.lib;
                        var Base = C_lib.Base;
                        var C_enc = C.enc;
                        var Utf8 = C_enc.Utf8;
                        var C_algo = C.algo;
                        /**
                         * HMAC algorithm.
                         */

                        C_algo.HMAC = Base.extend({
                            /**
                             * Initializes a newly created HMAC.
                             *
                             * @param {Hasher} hasher The hash algorithm to use.
                             * @param {WordArray|string} key The secret key.
                             *
                             * @example
                             *
                             *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
                             */
                            init: function init(hasher, key) {
                                // Init hasher
                                hasher = this._hasher = new hasher.init(); // Convert string to WordArray, else assume WordArray already

                                if (typeof key == 'string') {
                                    key = Utf8.parse(key);
                                } // Shortcuts


                                var hasherBlockSize = hasher.blockSize;
                                var hasherBlockSizeBytes = hasherBlockSize * 4; // Allow arbitrary length keys

                                if (key.sigBytes > hasherBlockSizeBytes) {
                                    key = hasher.finalize(key);
                                } // Clamp excess bits


                                key.clamp(); // Clone key for inner and outer pads

                                var oKey = this._oKey = key.clone();
                                var iKey = this._iKey = key.clone(); // Shortcuts

                                var oKeyWords = oKey.words;
                                var iKeyWords = iKey.words; // XOR keys with pad constants

                                for (var i = 0; i < hasherBlockSize; i++) {
                                    oKeyWords[i] ^= 0x5c5c5c5c;
                                    iKeyWords[i] ^= 0x36363636;
                                }

                                oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes; // Set initial values

                                this.reset();
                            },

                            /**
                             * Resets this HMAC to its initial state.
                             *
                             * @example
                             *
                             *     hmacHasher.reset();
                             */
                            reset: function reset() {
                                // Shortcut
                                var hasher = this._hasher; // Reset

                                hasher.reset();
                                hasher.update(this._iKey);
                            },

                            /**
                             * Updates this HMAC with a message.
                             *
                             * @param {WordArray|string} messageUpdate The message to append.
                             *
                             * @return {HMAC} This HMAC instance.
                             *
                             * @example
                             *
                             *     hmacHasher.update('message');
                             *     hmacHasher.update(wordArray);
                             */
                            update: function update(messageUpdate) {
                                this._hasher.update(messageUpdate); // Chainable


                                return this;
                            },

                            /**
                             * Finalizes the HMAC computation.
                             * Note that the finalize operation is effectively a destructive, read-once operation.
                             *
                             * @param {WordArray|string} messageUpdate (Optional) A final message update.
                             *
                             * @return {WordArray} The HMAC.
                             *
                             * @example
                             *
                             *     var hmac = hmacHasher.finalize();
                             *     var hmac = hmacHasher.finalize('message');
                             *     var hmac = hmacHasher.finalize(wordArray);
                             */
                            finalize: function finalize(messageUpdate) {
                                // Shortcut
                                var hasher = this._hasher; // Compute HMAC

                                var innerHash = hasher.finalize(messageUpdate);
                                hasher.reset();
                                var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));
                                return hmac;
                            }
                        });
                    })();
                });
            })(hmac);

            return hmac.exports;
        }

        var hasRequiredEvpkdf;

        function requireEvpkdf() {
            if (hasRequiredEvpkdf) return evpkdf.exports;
            hasRequiredEvpkdf = 1;

            (function (module, exports) {

                (function (root, factory, undef) {
                    {
                        // CommonJS
                        module.exports = factory(requireCore(), requireSha1(), requireHmac());
                    }
                })(commonjsGlobal, function (CryptoJS) {
                    (function () {
                        // Shortcuts
                        var C = CryptoJS;
                        var C_lib = C.lib;
                        var Base = C_lib.Base;
                        var WordArray = C_lib.WordArray;
                        var C_algo = C.algo;
                        var MD5 = C_algo.MD5;
                        /**
                         * This key derivation function is meant to conform with EVP_BytesToKey.
                         * www.openssl.org/docs/crypto/EVP_BytesToKey.html
                         */

                        var EvpKDF = C_algo.EvpKDF = Base.extend({
                            /**
                             * Configuration options.
                             *
                             * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
                             * @property {Hasher} hasher The hash algorithm to use. Default: MD5
                             * @property {number} iterations The number of iterations to perform. Default: 1
                             */
                            cfg: Base.extend({
                                keySize: 128 / 32,
                                hasher: MD5,
                                iterations: 1
                            }),

                            /**
                             * Initializes a newly created key derivation function.
                             *
                             * @param {Object} cfg (Optional) The configuration options to use for the derivation.
                             *
                             * @example
                             *
                             *     var kdf = CryptoJS.algo.EvpKDF.create();
                             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
                             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
                             */
                            init: function init(cfg) {
                                this.cfg = this.cfg.extend(cfg);
                            },

                            /**
                             * Derives a key from a password.
                             *
                             * @param {WordArray|string} password The password.
                             * @param {WordArray|string} salt A salt.
                             *
                             * @return {WordArray} The derived key.
                             *
                             * @example
                             *
                             *     var key = kdf.compute(password, salt);
                             */
                            compute: function compute(password, salt) {
                                // Shortcut
                                var cfg = this.cfg; // Init hasher

                                var hasher = cfg.hasher.create(); // Initial values

                                var derivedKey = WordArray.create(); // Shortcuts

                                var derivedKeyWords = derivedKey.words;
                                var keySize = cfg.keySize;
                                var iterations = cfg.iterations; // Generate key

                                while (derivedKeyWords.length < keySize) {
                                    if (block) {
                                        hasher.update(block);
                                    }

                                    var block = hasher.update(password).finalize(salt);
                                    hasher.reset(); // Iterations

                                    for (var i = 1; i < iterations; i++) {
                                        block = hasher.finalize(block);
                                        hasher.reset();
                                    }

                                    derivedKey.concat(block);
                                }

                                derivedKey.sigBytes = keySize * 4;
                                return derivedKey;
                            }
                        });
                        /**
                         * Derives a key from a password.
                         *
                         * @param {WordArray|string} password The password.
                         * @param {WordArray|string} salt A salt.
                         * @param {Object} cfg (Optional) The configuration options to use for this computation.
                         *
                         * @return {WordArray} The derived key.
                         *
                         * @static
                         *
                         * @example
                         *
                         *     var key = CryptoJS.EvpKDF(password, salt);
                         *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
                         *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
                         */

                        C.EvpKDF = function (password, salt, cfg) {
                            return EvpKDF.create(cfg).compute(password, salt);
                        };
                    })();

                    return CryptoJS.EvpKDF;
                });
            })(evpkdf);

            return evpkdf.exports;
        }

        var cipherCore = {exports: {}};

        var hasRequiredCipherCore;

        function requireCipherCore() {
            if (hasRequiredCipherCore) return cipherCore.exports;
            hasRequiredCipherCore = 1;

            (function (module, exports) {

                (function (root, factory, undef) {
                    {
                        // CommonJS
                        module.exports = factory(requireCore(), requireEvpkdf());
                    }
                })(commonjsGlobal, function (CryptoJS) {
                    /**
                     * Cipher core components.
                     */
                    CryptoJS.lib.Cipher || function (undefined$1) {
                        // Shortcuts
                        var C = CryptoJS;
                        var C_lib = C.lib;
                        var Base = C_lib.Base;
                        var WordArray = C_lib.WordArray;
                        var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
                        var C_enc = C.enc;
                        C_enc.Utf8;
                        var Base64 = C_enc.Base64;
                        var C_algo = C.algo;
                        var EvpKDF = C_algo.EvpKDF;
                        /**
                         * Abstract base cipher template.
                         *
                         * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
                         * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
                         * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
                         * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
                         */

                        var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
                            /**
                             * Configuration options.
                             *
                             * @property {WordArray} iv The IV to use for this operation.
                             */
                            cfg: Base.extend(),

                            /**
                             * Creates this cipher in encryption mode.
                             *
                             * @param {WordArray} key The key.
                             * @param {Object} cfg (Optional) The configuration options to use for this operation.
                             *
                             * @return {Cipher} A cipher instance.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
                             */
                            createEncryptor: function createEncryptor(key, cfg) {
                                return this.create(this._ENC_XFORM_MODE, key, cfg);
                            },

                            /**
                             * Creates this cipher in decryption mode.
                             *
                             * @param {WordArray} key The key.
                             * @param {Object} cfg (Optional) The configuration options to use for this operation.
                             *
                             * @return {Cipher} A cipher instance.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
                             */
                            createDecryptor: function createDecryptor(key, cfg) {
                                return this.create(this._DEC_XFORM_MODE, key, cfg);
                            },

                            /**
                             * Initializes a newly created cipher.
                             *
                             * @param {number} xformMode Either the encryption or decryption transormation mode constant.
                             * @param {WordArray} key The key.
                             * @param {Object} cfg (Optional) The configuration options to use for this operation.
                             *
                             * @example
                             *
                             *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
                             */
                            init: function init(xformMode, key, cfg) {
                                // Apply config defaults
                                this.cfg = this.cfg.extend(cfg); // Store transform mode and key

                                this._xformMode = xformMode;
                                this._key = key; // Set initial values

                                this.reset();
                            },

                            /**
                             * Resets this cipher to its initial state.
                             *
                             * @example
                             *
                             *     cipher.reset();
                             */
                            reset: function reset() {
                                // Reset data buffer
                                BufferedBlockAlgorithm.reset.call(this); // Perform concrete-cipher logic

                                this._doReset();
                            },

                            /**
                             * Adds data to be encrypted or decrypted.
                             *
                             * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
                             *
                             * @return {WordArray} The data after processing.
                             *
                             * @example
                             *
                             *     var encrypted = cipher.process('data');
                             *     var encrypted = cipher.process(wordArray);
                             */
                            process: function process(dataUpdate) {
                                // Append
                                this._append(dataUpdate); // Process available blocks


                                return this._process();
                            },

                            /**
                             * Finalizes the encryption or decryption process.
                             * Note that the finalize operation is effectively a destructive, read-once operation.
                             *
                             * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
                             *
                             * @return {WordArray} The data after final processing.
                             *
                             * @example
                             *
                             *     var encrypted = cipher.finalize();
                             *     var encrypted = cipher.finalize('data');
                             *     var encrypted = cipher.finalize(wordArray);
                             */
                            finalize: function finalize(dataUpdate) {
                                // Final data update
                                if (dataUpdate) {
                                    this._append(dataUpdate);
                                } // Perform concrete-cipher logic


                                var finalProcessedData = this._doFinalize();

                                return finalProcessedData;
                            },
                            keySize: 128 / 32,
                            ivSize: 128 / 32,
                            _ENC_XFORM_MODE: 1,
                            _DEC_XFORM_MODE: 2,

                            /**
                             * Creates shortcut functions to a cipher's object interface.
                             *
                             * @param {Cipher} cipher The cipher to create a helper for.
                             *
                             * @return {Object} An object with encrypt and decrypt shortcut functions.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
                             */
                            _createHelper: function () {
                                function selectCipherStrategy(key) {
                                    if (typeof key == 'string') {
                                        return PasswordBasedCipher;
                                    } else {
                                        return SerializableCipher;
                                    }
                                }

                                return function (cipher) {
                                    return {
                                        encrypt: function encrypt(message, key, cfg) {
                                            return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                                        },
                                        decrypt: function decrypt(ciphertext, key, cfg) {
                                            return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                                        }
                                    };
                                };
                            }()
                        });
                        /**
                         * Abstract base stream cipher template.
                         *
                         * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
                         */

                        C_lib.StreamCipher = Cipher.extend({
                            _doFinalize: function _doFinalize() {
                                // Process partial blocks
                                var finalProcessedBlocks = this._process(!!'flush');

                                return finalProcessedBlocks;
                            },
                            blockSize: 1
                        });
                        /**
                         * Mode namespace.
                         */

                        var C_mode = C.mode = {};
                        /**
                         * Abstract base block cipher mode template.
                         */

                        var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
                            /**
                             * Creates this mode for encryption.
                             *
                             * @param {Cipher} cipher A block cipher instance.
                             * @param {Array} iv The IV words.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
                             */
                            createEncryptor: function createEncryptor(cipher, iv) {
                                return this.Encryptor.create(cipher, iv);
                            },

                            /**
                             * Creates this mode for decryption.
                             *
                             * @param {Cipher} cipher A block cipher instance.
                             * @param {Array} iv The IV words.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
                             */
                            createDecryptor: function createDecryptor(cipher, iv) {
                                return this.Decryptor.create(cipher, iv);
                            },

                            /**
                             * Initializes a newly created mode.
                             *
                             * @param {Cipher} cipher A block cipher instance.
                             * @param {Array} iv The IV words.
                             *
                             * @example
                             *
                             *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
                             */
                            init: function init(cipher, iv) {
                                this._cipher = cipher;
                                this._iv = iv;
                            }
                        });
                        /**
                         * Cipher Block Chaining mode.
                         */

                        var CBC = C_mode.CBC = function () {
                            /**
                             * Abstract base CBC mode.
                             */
                            var CBC = BlockCipherMode.extend();
                            /**
                             * CBC encryptor.
                             */

                            CBC.Encryptor = CBC.extend({
                                /**
                                 * Processes the data block at offset.
                                 *
                                 * @param {Array} words The data words to operate on.
                                 * @param {number} offset The offset where the block starts.
                                 *
                                 * @example
                                 *
                                 *     mode.processBlock(data.words, offset);
                                 */
                                processBlock: function processBlock(words, offset) {
                                    // Shortcuts
                                    var cipher = this._cipher;
                                    var blockSize = cipher.blockSize; // XOR and encrypt

                                    xorBlock.call(this, words, offset, blockSize);
                                    cipher.encryptBlock(words, offset); // Remember this block to use with next block

                                    this._prevBlock = words.slice(offset, offset + blockSize);
                                }
                            });
                            /**
                             * CBC decryptor.
                             */

                            CBC.Decryptor = CBC.extend({
                                /**
                                 * Processes the data block at offset.
                                 *
                                 * @param {Array} words The data words to operate on.
                                 * @param {number} offset The offset where the block starts.
                                 *
                                 * @example
                                 *
                                 *     mode.processBlock(data.words, offset);
                                 */
                                processBlock: function processBlock(words, offset) {
                                    // Shortcuts
                                    var cipher = this._cipher;
                                    var blockSize = cipher.blockSize; // Remember this block to use with next block

                                    var thisBlock = words.slice(offset, offset + blockSize); // Decrypt and XOR

                                    cipher.decryptBlock(words, offset);
                                    xorBlock.call(this, words, offset, blockSize); // This block becomes the previous block

                                    this._prevBlock = thisBlock;
                                }
                            });

                            function xorBlock(words, offset, blockSize) {
                                // Shortcut
                                var iv = this._iv; // Choose mixing block

                                if (iv) {
                                    var block = iv; // Remove IV for subsequent blocks

                                    this._iv = undefined$1;
                                } else {
                                    var block = this._prevBlock;
                                } // XOR blocks


                                for (var i = 0; i < blockSize; i++) {
                                    words[offset + i] ^= block[i];
                                }
                            }

                            return CBC;
                        }();
                        /**
                         * Padding namespace.
                         */


                        var C_pad = C.pad = {};
                        /**
                         * PKCS #5/7 padding strategy.
                         */

                        var Pkcs7 = C_pad.Pkcs7 = {
                            /**
                             * Pads data using the algorithm defined in PKCS #5/7.
                             *
                             * @param {WordArray} data The data to pad.
                             * @param {number} blockSize The multiple that the data should be padded to.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
                             */
                            pad: function pad(data, blockSize) {
                                // Shortcut
                                var blockSizeBytes = blockSize * 4; // Count padding bytes

                                var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes; // Create padding word

                                var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes; // Create padding

                                var paddingWords = [];

                                for (var i = 0; i < nPaddingBytes; i += 4) {
                                    paddingWords.push(paddingWord);
                                }

                                var padding = WordArray.create(paddingWords, nPaddingBytes); // Add padding

                                data.concat(padding);
                            },

                            /**
                             * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
                             *
                             * @param {WordArray} data The data to unpad.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     CryptoJS.pad.Pkcs7.unpad(wordArray);
                             */
                            unpad: function unpad(data) {
                                // Get number of padding bytes from last byte
                                var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 0xff; // Remove padding

                                data.sigBytes -= nPaddingBytes;
                            }
                        };
                        /**
                         * Abstract base block cipher template.
                         *
                         * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
                         */

                        C_lib.BlockCipher = Cipher.extend({
                            /**
                             * Configuration options.
                             *
                             * @property {Mode} mode The block mode to use. Default: CBC
                             * @property {Padding} padding The padding strategy to use. Default: Pkcs7
                             */
                            cfg: Cipher.cfg.extend({
                                mode: CBC,
                                padding: Pkcs7
                            }),
                            reset: function reset() {
                                // Reset cipher
                                Cipher.reset.call(this); // Shortcuts

                                var cfg = this.cfg;
                                var iv = cfg.iv;
                                var mode = cfg.mode; // Reset block mode

                                if (this._xformMode == this._ENC_XFORM_MODE) {
                                    var modeCreator = mode.createEncryptor;
                                } else
                                    /* if (this._xformMode == this._DEC_XFORM_MODE) */
                                {
                                    var modeCreator = mode.createDecryptor; // Keep at least one block in the buffer for unpadding

                                    this._minBufferSize = 1;
                                }

                                if (this._mode && this._mode.__creator == modeCreator) {
                                    this._mode.init(this, iv && iv.words);
                                } else {
                                    this._mode = modeCreator.call(mode, this, iv && iv.words);
                                    this._mode.__creator = modeCreator;
                                }
                            },
                            _doProcessBlock: function _doProcessBlock(words, offset) {
                                this._mode.processBlock(words, offset);
                            },
                            _doFinalize: function _doFinalize() {
                                // Shortcut
                                var padding = this.cfg.padding; // Finalize

                                if (this._xformMode == this._ENC_XFORM_MODE) {
                                    // Pad data
                                    padding.pad(this._data, this.blockSize); // Process final blocks

                                    var finalProcessedBlocks = this._process(!!'flush');
                                } else
                                    /* if (this._xformMode == this._DEC_XFORM_MODE) */
                                {
                                    // Process final blocks
                                    var finalProcessedBlocks = this._process(!!'flush'); // Unpad data


                                    padding.unpad(finalProcessedBlocks);
                                }

                                return finalProcessedBlocks;
                            },
                            blockSize: 128 / 32
                        });
                        /**
                         * A collection of cipher parameters.
                         *
                         * @property {WordArray} ciphertext The raw ciphertext.
                         * @property {WordArray} key The key to this ciphertext.
                         * @property {WordArray} iv The IV used in the ciphering operation.
                         * @property {WordArray} salt The salt used with a key derivation function.
                         * @property {Cipher} algorithm The cipher algorithm.
                         * @property {Mode} mode The block mode used in the ciphering operation.
                         * @property {Padding} padding The padding scheme used in the ciphering operation.
                         * @property {number} blockSize The block size of the cipher.
                         * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
                         */

                        var CipherParams = C_lib.CipherParams = Base.extend({
                            /**
                             * Initializes a newly created cipher params object.
                             *
                             * @param {Object} cipherParams An object with any of the possible cipher parameters.
                             *
                             * @example
                             *
                             *     var cipherParams = CryptoJS.lib.CipherParams.create({
                             *         ciphertext: ciphertextWordArray,
                             *         key: keyWordArray,
                             *         iv: ivWordArray,
                             *         salt: saltWordArray,
                             *         algorithm: CryptoJS.algo.AES,
                             *         mode: CryptoJS.mode.CBC,
                             *         padding: CryptoJS.pad.PKCS7,
                             *         blockSize: 4,
                             *         formatter: CryptoJS.format.OpenSSL
                             *     });
                             */
                            init: function init(cipherParams) {
                                this.mixIn(cipherParams);
                            },

                            /**
                             * Converts this cipher params object to a string.
                             *
                             * @param {Format} formatter (Optional) The formatting strategy to use.
                             *
                             * @return {string} The stringified cipher params.
                             *
                             * @throws Error If neither the formatter nor the default formatter is set.
                             *
                             * @example
                             *
                             *     var string = cipherParams + '';
                             *     var string = cipherParams.toString();
                             *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
                             */
                            toString: function toString(formatter) {
                                return (formatter || this.formatter).stringify(this);
                            }
                        });
                        /**
                         * Format namespace.
                         */

                        var C_format = C.format = {};
                        /**
                         * OpenSSL formatting strategy.
                         */

                        var OpenSSLFormatter = C_format.OpenSSL = {
                            /**
                             * Converts a cipher params object to an OpenSSL-compatible string.
                             *
                             * @param {CipherParams} cipherParams The cipher params object.
                             *
                             * @return {string} The OpenSSL-compatible string.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
                             */
                            stringify: function stringify(cipherParams) {
                                // Shortcuts
                                var ciphertext = cipherParams.ciphertext;
                                var salt = cipherParams.salt; // Format

                                if (salt) {
                                    var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
                                } else {
                                    var wordArray = ciphertext;
                                }

                                return wordArray.toString(Base64);
                            },

                            /**
                             * Converts an OpenSSL-compatible string to a cipher params object.
                             *
                             * @param {string} openSSLStr The OpenSSL-compatible string.
                             *
                             * @return {CipherParams} The cipher params object.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
                             */
                            parse: function parse(openSSLStr) {
                                // Parse base64
                                var ciphertext = Base64.parse(openSSLStr); // Shortcut

                                var ciphertextWords = ciphertext.words; // Test for salt

                                if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
                                    // Extract salt
                                    var salt = WordArray.create(ciphertextWords.slice(2, 4)); // Remove salt from ciphertext

                                    ciphertextWords.splice(0, 4);
                                    ciphertext.sigBytes -= 16;
                                }

                                return CipherParams.create({
                                    ciphertext: ciphertext,
                                    salt: salt
                                });
                            }
                        };
                        /**
                         * A cipher wrapper that returns ciphertext as a serializable cipher params object.
                         */

                        var SerializableCipher = C_lib.SerializableCipher = Base.extend({
                            /**
                             * Configuration options.
                             *
                             * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
                             */
                            cfg: Base.extend({
                                format: OpenSSLFormatter
                            }),

                            /**
                             * Encrypts a message.
                             *
                             * @param {Cipher} cipher The cipher algorithm to use.
                             * @param {WordArray|string} message The message to encrypt.
                             * @param {WordArray} key The key.
                             * @param {Object} cfg (Optional) The configuration options to use for this operation.
                             *
                             * @return {CipherParams} A cipher params object.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
                             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
                             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
                             */
                            encrypt: function encrypt(cipher, message, key, cfg) {
                                // Apply config defaults
                                cfg = this.cfg.extend(cfg); // Encrypt

                                var encryptor = cipher.createEncryptor(key, cfg);
                                var ciphertext = encryptor.finalize(message); // Shortcut

                                var cipherCfg = encryptor.cfg; // Create and return serializable cipher params

                                return CipherParams.create({
                                    ciphertext: ciphertext,
                                    key: key,
                                    iv: cipherCfg.iv,
                                    algorithm: cipher,
                                    mode: cipherCfg.mode,
                                    padding: cipherCfg.padding,
                                    blockSize: cipher.blockSize,
                                    formatter: cfg.format
                                });
                            },

                            /**
                             * Decrypts serialized ciphertext.
                             *
                             * @param {Cipher} cipher The cipher algorithm to use.
                             * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
                             * @param {WordArray} key The key.
                             * @param {Object} cfg (Optional) The configuration options to use for this operation.
                             *
                             * @return {WordArray} The plaintext.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
                             *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
                             */
                            decrypt: function decrypt(cipher, ciphertext, key, cfg) {
                                // Apply config defaults
                                cfg = this.cfg.extend(cfg); // Convert string to CipherParams

                                ciphertext = this._parse(ciphertext, cfg.format); // Decrypt

                                var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
                                return plaintext;
                            },

                            /**
                             * Converts serialized ciphertext to CipherParams,
                             * else assumed CipherParams already and returns ciphertext unchanged.
                             *
                             * @param {CipherParams|string} ciphertext The ciphertext.
                             * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
                             *
                             * @return {CipherParams} The unserialized ciphertext.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
                             */
                            _parse: function _parse(ciphertext, format) {
                                if (typeof ciphertext == 'string') {
                                    return format.parse(ciphertext, this);
                                } else {
                                    return ciphertext;
                                }
                            }
                        });
                        /**
                         * Key derivation function namespace.
                         */

                        var C_kdf = C.kdf = {};
                        /**
                         * OpenSSL key derivation function.
                         */

                        var OpenSSLKdf = C_kdf.OpenSSL = {
                            /**
                             * Derives a key and IV from a password.
                             *
                             * @param {string} password The password to derive from.
                             * @param {number} keySize The size in words of the key to generate.
                             * @param {number} ivSize The size in words of the IV to generate.
                             * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
                             *
                             * @return {CipherParams} A cipher params object with the key, IV, and salt.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
                             *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
                             */
                            execute: function execute(password, keySize, ivSize, salt) {
                                // Generate random salt
                                if (!salt) {
                                    salt = WordArray.random(64 / 8);
                                } // Derive key and IV


                                var key = EvpKDF.create({
                                    keySize: keySize + ivSize
                                }).compute(password, salt); // Separate key and IV

                                var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
                                key.sigBytes = keySize * 4; // Return params

                                return CipherParams.create({
                                    key: key,
                                    iv: iv,
                                    salt: salt
                                });
                            }
                        };
                        /**
                         * A serializable cipher wrapper that derives the key from a password,
                         * and returns ciphertext as a serializable cipher params object.
                         */

                        var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
                            /**
                             * Configuration options.
                             *
                             * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
                             */
                            cfg: SerializableCipher.cfg.extend({
                                kdf: OpenSSLKdf
                            }),

                            /**
                             * Encrypts a message using a password.
                             *
                             * @param {Cipher} cipher The cipher algorithm to use.
                             * @param {WordArray|string} message The message to encrypt.
                             * @param {string} password The password.
                             * @param {Object} cfg (Optional) The configuration options to use for this operation.
                             *
                             * @return {CipherParams} A cipher params object.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
                             *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
                             */
                            encrypt: function encrypt(cipher, message, password, cfg) {
                                // Apply config defaults
                                cfg = this.cfg.extend(cfg); // Derive key and other params

                                var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize); // Add IV to config

                                cfg.iv = derivedParams.iv; // Encrypt

                                var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg); // Mix in derived params

                                ciphertext.mixIn(derivedParams);
                                return ciphertext;
                            },

                            /**
                             * Decrypts serialized ciphertext using a password.
                             *
                             * @param {Cipher} cipher The cipher algorithm to use.
                             * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
                             * @param {string} password The password.
                             * @param {Object} cfg (Optional) The configuration options to use for this operation.
                             *
                             * @return {WordArray} The plaintext.
                             *
                             * @static
                             *
                             * @example
                             *
                             *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
                             *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
                             */
                            decrypt: function decrypt(cipher, ciphertext, password, cfg) {
                                // Apply config defaults
                                cfg = this.cfg.extend(cfg); // Convert string to CipherParams

                                ciphertext = this._parse(ciphertext, cfg.format); // Derive key and other params

                                var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt); // Add IV to config

                                cfg.iv = derivedParams.iv; // Decrypt

                                var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
                                return plaintext;
                            }
                        });
                    }();
                });
            })(cipherCore);

            return cipherCore.exports;
        }

        (function (module, exports) {

            (function (root, factory, undef) {
                {
                    // CommonJS
                    module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
                }
            })(commonjsGlobal, function (CryptoJS) {
                (function () {
                    // Shortcuts
                    var C = CryptoJS;
                    var C_lib = C.lib;
                    var BlockCipher = C_lib.BlockCipher;
                    var C_algo = C.algo; // Lookup tables

                    var SBOX = [];
                    var INV_SBOX = [];
                    var SUB_MIX_0 = [];
                    var SUB_MIX_1 = [];
                    var SUB_MIX_2 = [];
                    var SUB_MIX_3 = [];
                    var INV_SUB_MIX_0 = [];
                    var INV_SUB_MIX_1 = [];
                    var INV_SUB_MIX_2 = [];
                    var INV_SUB_MIX_3 = []; // Compute lookup tables

                    (function () {
                        // Compute double table
                        var d = [];

                        for (var i = 0; i < 256; i++) {
                            if (i < 128) {
                                d[i] = i << 1;
                            } else {
                                d[i] = i << 1 ^ 0x11b;
                            }
                        } // Walk GF(2^8)


                        var x = 0;
                        var xi = 0;

                        for (var i = 0; i < 256; i++) {
                            // Compute sbox
                            var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
                            sx = sx >>> 8 ^ sx & 0xff ^ 0x63;
                            SBOX[x] = sx;
                            INV_SBOX[sx] = x; // Compute multiplication

                            var x2 = d[x];
                            var x4 = d[x2];
                            var x8 = d[x4]; // Compute sub bytes, mix columns tables

                            var t = d[sx] * 0x101 ^ sx * 0x1010100;
                            SUB_MIX_0[x] = t << 24 | t >>> 8;
                            SUB_MIX_1[x] = t << 16 | t >>> 16;
                            SUB_MIX_2[x] = t << 8 | t >>> 24;
                            SUB_MIX_3[x] = t; // Compute inv sub bytes, inv mix columns tables

                            var t = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;
                            INV_SUB_MIX_0[sx] = t << 24 | t >>> 8;
                            INV_SUB_MIX_1[sx] = t << 16 | t >>> 16;
                            INV_SUB_MIX_2[sx] = t << 8 | t >>> 24;
                            INV_SUB_MIX_3[sx] = t; // Compute next counter

                            if (!x) {
                                x = xi = 1;
                            } else {
                                x = x2 ^ d[d[d[x8 ^ x2]]];
                                xi ^= d[d[xi]];
                            }
                        }
                    })(); // Precomputed Rcon lookup


                    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
                    /**
                     * AES block cipher algorithm.
                     */

                    var AES = C_algo.AES = BlockCipher.extend({
                        _doReset: function _doReset() {
                            // Skip reset of nRounds has been set before and key did not change
                            if (this._nRounds && this._keyPriorReset === this._key) {
                                return;
                            } // Shortcuts


                            var key = this._keyPriorReset = this._key;
                            var keyWords = key.words;
                            var keySize = key.sigBytes / 4; // Compute number of rounds

                            var nRounds = this._nRounds = keySize + 6; // Compute number of key schedule rows

                            var ksRows = (nRounds + 1) * 4; // Compute key schedule

                            var keySchedule = this._keySchedule = [];

                            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
                                if (ksRow < keySize) {
                                    keySchedule[ksRow] = keyWords[ksRow];
                                } else {
                                    var t = keySchedule[ksRow - 1];

                                    if (!(ksRow % keySize)) {
                                        // Rot word
                                        t = t << 8 | t >>> 24; // Sub word

                                        t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 0xff] << 16 | SBOX[t >>> 8 & 0xff] << 8 | SBOX[t & 0xff]; // Mix Rcon

                                        t ^= RCON[ksRow / keySize | 0] << 24;
                                    } else if (keySize > 6 && ksRow % keySize == 4) {
                                        // Sub word
                                        t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 0xff] << 16 | SBOX[t >>> 8 & 0xff] << 8 | SBOX[t & 0xff];
                                    }

                                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
                                }
                            } // Compute inv key schedule


                            var invKeySchedule = this._invKeySchedule = [];

                            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
                                var ksRow = ksRows - invKsRow;

                                if (invKsRow % 4) {
                                    var t = keySchedule[ksRow];
                                } else {
                                    var t = keySchedule[ksRow - 4];
                                }

                                if (invKsRow < 4 || ksRow <= 4) {
                                    invKeySchedule[invKsRow] = t;
                                } else {
                                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[t >>> 16 & 0xff]] ^ INV_SUB_MIX_2[SBOX[t >>> 8 & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
                                }
                            }
                        },
                        encryptBlock: function encryptBlock(M, offset) {
                            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
                        },
                        decryptBlock: function decryptBlock(M, offset) {
                            // Swap 2nd and 4th rows
                            var t = M[offset + 1];
                            M[offset + 1] = M[offset + 3];
                            M[offset + 3] = t;

                            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX); // Inv swap 2nd and 4th rows


                            var t = M[offset + 1];
                            M[offset + 1] = M[offset + 3];
                            M[offset + 3] = t;
                        },
                        _doCryptBlock: function _doCryptBlock(M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
                            // Shortcut
                            var nRounds = this._nRounds; // Get input, add round key

                            var s0 = M[offset] ^ keySchedule[0];
                            var s1 = M[offset + 1] ^ keySchedule[1];
                            var s2 = M[offset + 2] ^ keySchedule[2];
                            var s3 = M[offset + 3] ^ keySchedule[3]; // Key schedule row counter

                            var ksRow = 4; // Rounds

                            for (var round = 1; round < nRounds; round++) {
                                // Shift rows, sub bytes, mix columns, add round key
                                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[s1 >>> 16 & 0xff] ^ SUB_MIX_2[s2 >>> 8 & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
                                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[s2 >>> 16 & 0xff] ^ SUB_MIX_2[s3 >>> 8 & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
                                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[s3 >>> 16 & 0xff] ^ SUB_MIX_2[s0 >>> 8 & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
                                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[s0 >>> 16 & 0xff] ^ SUB_MIX_2[s1 >>> 8 & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++]; // Update state

                                s0 = t0;
                                s1 = t1;
                                s2 = t2;
                                s3 = t3;
                            } // Shift rows, sub bytes, add round key


                            var t0 = (SBOX[s0 >>> 24] << 24 | SBOX[s1 >>> 16 & 0xff] << 16 | SBOX[s2 >>> 8 & 0xff] << 8 | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
                            var t1 = (SBOX[s1 >>> 24] << 24 | SBOX[s2 >>> 16 & 0xff] << 16 | SBOX[s3 >>> 8 & 0xff] << 8 | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
                            var t2 = (SBOX[s2 >>> 24] << 24 | SBOX[s3 >>> 16 & 0xff] << 16 | SBOX[s0 >>> 8 & 0xff] << 8 | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
                            var t3 = (SBOX[s3 >>> 24] << 24 | SBOX[s0 >>> 16 & 0xff] << 16 | SBOX[s1 >>> 8 & 0xff] << 8 | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++]; // Set output

                            M[offset] = t0;
                            M[offset + 1] = t1;
                            M[offset + 2] = t2;
                            M[offset + 3] = t3;
                        },
                        keySize: 256 / 32
                    });
                    /**
                     * Shortcut functions to the cipher's object interface.
                     *
                     * @example
                     *
                     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
                     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
                     */

                    C.AES = BlockCipher._createHelper(AES);
                })();

                return CryptoJS.AES;
            });
        })(aes);

        var AES = aes.exports;

        var encUtf8 = {exports: {}};

        (function (module, exports) {

            (function (root, factory) {
                {
                    // CommonJS
                    module.exports = factory(requireCore());
                }
            })(commonjsGlobal, function (CryptoJS) {
                return CryptoJS.enc.Utf8;
            });
        })(encUtf8);

        var Utf8 = encUtf8.exports;

        var browser$2 = {exports: {}};

        var debug$5 = {exports: {}};

        /**
         * Helpers.
         */
        var s$1 = 1000;
        var m$1 = s$1 * 60;
        var h$1 = m$1 * 60;
        var d$1 = h$1 * 24;
        var y$1 = d$1 * 365.25;
        /**
         * Parse or format the given `val`.
         *
         * Options:
         *
         *  - `long` verbose formatting [false]
         *
         * @param {String|Number} val
         * @param {Object} options
         * @return {String|Number}
         * @api public
         */

        var ms$1 = function ms(val, options) {
            options = options || {};
            if ('string' == typeof val) return parse$5(val);
            return options.long ? long(val) : short(val);
        };

        /**
         * Parse the given `str` and return milliseconds.
         *
         * @param {String} str
         * @return {Number}
         * @api private
         */


        function parse$5(str) {
            str = '' + str;
            if (str.length > 10000) return;
            var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
            if (!match) return;
            var n = parseFloat(match[1]);
            var type = (match[2] || 'ms').toLowerCase();

            switch (type) {
                case 'years':
                case 'year':
                case 'yrs':
                case 'yr':
                case 'y':
                    return n * y$1;

                case 'days':
                case 'day':
                case 'd':
                    return n * d$1;

                case 'hours':
                case 'hour':
                case 'hrs':
                case 'hr':
                case 'h':
                    return n * h$1;

                case 'minutes':
                case 'minute':
                case 'mins':
                case 'min':
                case 'm':
                    return n * m$1;

                case 'seconds':
                case 'second':
                case 'secs':
                case 'sec':
                case 's':
                    return n * s$1;

                case 'milliseconds':
                case 'millisecond':
                case 'msecs':
                case 'msec':
                case 'ms':
                    return n;
            }
        }

        /**
         * Short format for `ms`.
         *
         * @param {Number} ms
         * @return {String}
         * @api private
         */


        function short(ms) {
            if (ms >= d$1) return Math.round(ms / d$1) + 'd';
            if (ms >= h$1) return Math.round(ms / h$1) + 'h';
            if (ms >= m$1) return Math.round(ms / m$1) + 'm';
            if (ms >= s$1) return Math.round(ms / s$1) + 's';
            return ms + 'ms';
        }

        /**
         * Long format for `ms`.
         *
         * @param {Number} ms
         * @return {String}
         * @api private
         */


        function long(ms) {
            return plural$1(ms, d$1, 'day') || plural$1(ms, h$1, 'hour') || plural$1(ms, m$1, 'minute') || plural$1(ms, s$1, 'second') || ms + ' ms';
        }

        /**
         * Pluralization helper.
         */


        function plural$1(ms, n, name) {
            if (ms < n) return;
            if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
            return Math.ceil(ms / n) + ' ' + name + 's';
        }

        (function (module, exports) {
            /**
             * This is the common logic for both the Node.js and web browser
             * implementations of `debug()`.
             *
             * Expose `debug()` as the module.
             */
            exports = module.exports = debug;
            exports.coerce = coerce;
            exports.disable = disable;
            exports.enable = enable;
            exports.enabled = enabled;
            exports.humanize = ms$1;
            /**
             * The currently active debug mode names, and names to skip.
             */

            exports.names = [];
            exports.skips = [];
            /**
             * Map of special "%n" handling functions, for the debug "format" argument.
             *
             * Valid key names are a single, lowercased letter, i.e. "n".
             */

            exports.formatters = {};
            /**
             * Previously assigned color.
             */

            var prevColor = 0;
            /**
             * Previous log timestamp.
             */

            var prevTime;

            /**
             * Select a color.
             *
             * @return {Number}
             * @api private
             */

            function selectColor() {
                return exports.colors[prevColor++ % exports.colors.length];
            }

            /**
             * Create a debugger with the given `namespace`.
             *
             * @param {String} namespace
             * @return {Function}
             * @api public
             */


            function debug(namespace) {
                // define the `disabled` version
                function disabled() {
                }

                disabled.enabled = false; // define the `enabled` version

                function enabled() {
                    var self = enabled; // set `diff` timestamp

                    var curr = +new Date();
                    var ms = curr - (prevTime || curr);
                    self.diff = ms;
                    self.prev = prevTime;
                    self.curr = curr;
                    prevTime = curr; // add the `color` if not set

                    if (null == self.useColors) self.useColors = exports.useColors();
                    if (null == self.color && self.useColors) self.color = selectColor();
                    var args = Array.prototype.slice.call(arguments);
                    args[0] = exports.coerce(args[0]);

                    if ('string' !== typeof args[0]) {
                        // anything else let's inspect with %o
                        args = ['%o'].concat(args);
                    } // apply any `formatters` transformations


                    var index = 0;
                    args[0] = args[0].replace(/%([a-z%])/g, function (match, format) {
                        // if we encounter an escaped % then don't increase the array index
                        if (match === '%%') return match;
                        index++;
                        var formatter = exports.formatters[format];

                        if ('function' === typeof formatter) {
                            var val = args[index];
                            match = formatter.call(self, val); // now we need to remove `args[index]` since it's inlined in the `format`

                            args.splice(index, 1);
                            index--;
                        }

                        return match;
                    });

                    if ('function' === typeof exports.formatArgs) {
                        args = exports.formatArgs.apply(self, args);
                    }

                    var logFn = enabled.log || exports.log || console.log.bind(console);
                    logFn.apply(self, args);
                }

                enabled.enabled = true;
                var fn = exports.enabled(namespace) ? enabled : disabled;
                fn.namespace = namespace;
                return fn;
            }

            /**
             * Enables a debug mode by namespaces. This can include modes
             * separated by a colon and wildcards.
             *
             * @param {String} namespaces
             * @api public
             */


            function enable(namespaces) {
                exports.save(namespaces);
                var split = (namespaces || '').split(/[\s,]+/);
                var len = split.length;

                for (var i = 0; i < len; i++) {
                    if (!split[i]) continue; // ignore empty strings

                    namespaces = split[i].replace(/\*/g, '.*?');

                    if (namespaces[0] === '-') {
                        exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
                    } else {
                        exports.names.push(new RegExp('^' + namespaces + '$'));
                    }
                }
            }

            /**
             * Disable debug output.
             *
             * @api public
             */


            function disable() {
                exports.enable('');
            }

            /**
             * Returns true if the given mode name is enabled, false otherwise.
             *
             * @param {String} name
             * @return {Boolean}
             * @api public
             */


            function enabled(name) {
                var i, len;

                for (i = 0, len = exports.skips.length; i < len; i++) {
                    if (exports.skips[i].test(name)) {
                        return false;
                    }
                }

                for (i = 0, len = exports.names.length; i < len; i++) {
                    if (exports.names[i].test(name)) {
                        return true;
                    }
                }

                return false;
            }

            /**
             * Coerce `val`.
             *
             * @param {Mixed} val
             * @return {Mixed}
             * @api private
             */


            function coerce(val) {
                if (val instanceof Error) return val.stack || val.message;
                return val;
            }
        })(debug$5, debug$5.exports);

        (function (module, exports) {
            /**
             * This is the web browser implementation of `debug()`.
             *
             * Expose `debug()` as the module.
             */
            exports = module.exports = debug$5.exports;
            exports.log = log;
            exports.formatArgs = formatArgs;
            exports.save = save;
            exports.load = load;
            exports.useColors = useColors;
            exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();
            /**
             * Colors.
             */

            exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];

            /**
             * Currently only WebKit-based Web Inspectors, Firefox >= v31,
             * and the Firebug extension (any Firefox version) are known
             * to support "%c" CSS customizations.
             *
             * TODO: add a `localStorage` variable to explicitly enable/disable colors
             */

            function useColors() {
                // is webkit? http://stackoverflow.com/a/16459606/376773
                return 'WebkitAppearance' in document.documentElement.style || // is firebug? http://stackoverflow.com/a/398120/376773
                    window.console && (console.firebug || console.exception && console.table) || // is firefox >= v31?
                    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
                    navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31;
            }

            /**
             * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
             */


            exports.formatters.j = function (v) {
                return JSON.stringify(v);
            };

            /**
             * Colorize log arguments if enabled.
             *
             * @api public
             */


            function formatArgs() {
                var args = arguments;
                var useColors = this.useColors;
                args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);
                if (!useColors) return args;
                var c = 'color: ' + this.color;
                args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1)); // the final "%c" is somewhat tricky, because there could be other
                // arguments passed either before or after the %c, so we need to
                // figure out the correct index to insert the CSS into

                var index = 0;
                var lastC = 0;
                args[0].replace(/%[a-z%]/g, function (match) {
                    if ('%%' === match) return;
                    index++;

                    if ('%c' === match) {
                        // we only are interested in the *last* %c
                        // (the user may have provided their own)
                        lastC = index;
                    }
                });
                args.splice(lastC, 0, c);
                return args;
            }

            /**
             * Invokes `console.log()` when available.
             * No-op when `console.log` is not a "function".
             *
             * @api public
             */


            function log() {
                // this hackery is required for IE8/9, where
                // the `console.log` function doesn't have 'apply'
                return 'object' === (typeof console === "undefined" ? "undefined" : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
            }

            /**
             * Save `namespaces`.
             *
             * @param {String} namespaces
             * @api private
             */


            function save(namespaces) {
                try {
                    if (null == namespaces) {
                        exports.storage.removeItem('debug');
                    } else {
                        exports.storage.debug = namespaces;
                    }
                } catch (e) {
                }
            }

            /**
             * Load `namespaces`.
             *
             * @return {String} returns the previously persisted debug modes
             * @api private
             */


            function load() {
                var r;

                try {
                    r = exports.storage.debug;
                } catch (e) {
                }

                return r;
            }

            /**
             * Enable namespaces listed in `localStorage.debug` initially.
             */


            exports.enable(load());

            /**
             * Localstorage attempts to return the localstorage.
             *
             * This is necessary because safari throws
             * when a user disables cookies/localstorage
             * and you attempt to access it.
             *
             * @return {LocalStorage}
             * @api private
             */

            function localstorage() {
                try {
                    return window.localStorage;
                } catch (e) {
                }
            }
        })(browser$2, browser$2.exports);

        /**
         * Module dependencies.
         */

        var debug$4 = browser$2.exports('cookie');
        /**
         * Set or get cookie `name` with `value` and `options` object.
         *
         * @param {String} name
         * @param {String} value
         * @param {Object} options
         * @return {Mixed}
         * @api public
         */

        var rudderComponentCookie = function rudderComponentCookie(name, value, options) {
            switch (arguments.length) {
                case 3:
                case 2:
                    return set$1(name, value, options);

                case 1:
                    return get$1(name);

                default:
                    return all$1();
            }
        };

        /**
         * Set cookie `name` to `value`.
         *
         * @param {String} name
         * @param {String} value
         * @param {Object} options
         * @api private
         */


        function set$1(name, value, options) {
            options = options || {};
            var str = encode$1(name) + '=' + encode$1(value);
            if (null == value) options.maxage = -1;

            if (options.maxage) {
                options.expires = new Date(+new Date() + options.maxage);
            }

            if (options.path) str += '; path=' + options.path;
            if (options.domain) str += '; domain=' + options.domain;
            if (options.expires) str += '; expires=' + options.expires.toUTCString();
            if (options.samesite) str += '; samesite=' + options.samesite;
            if (options.secure) str += '; secure';
            document.cookie = str;
        }

        /**
         * Return all cookies.
         *
         * @return {Object}
         * @api private
         */


        function all$1() {
            var str;

            try {
                str = document.cookie;
            } catch (err) {
                if (typeof console !== 'undefined' && typeof console.error === 'function') {
                    console.error(err.stack || err);
                }

                return {};
            }

            return parse$4(str);
        }

        /**
         * Get cookie `name`.
         *
         * @param {String} name
         * @return {String}
         * @api private
         */


        function get$1(name) {
            return all$1()[name];
        }

        /**
         * Parse cookie `str`.
         *
         * @param {String} str
         * @return {Object}
         * @api private
         */


        function parse$4(str) {
            var obj = {};
            var pairs = str.split(/ *; */);
            var pair;
            if ('' == pairs[0]) return obj;

            for (var i = 0; i < pairs.length; ++i) {
                pair = pairs[i].split('=');
                obj[decode$2(pair[0])] = decode$2(pair[1]);
            }

            return obj;
        }

        /**
         * Encode.
         */


        function encode$1(value) {
            try {
                return encodeURIComponent(value);
            } catch (e) {
                debug$4('error `encode(%o)` - %o', value, e);
            }
        }

        /**
         * Decode.
         */


        function decode$2(value) {
            try {
                return decodeURIComponent(value);
            } catch (e) {
                debug$4('error `decode(%o)` - %o', value, e);
            }
        }

        var defaults$3 = {exports: {}};

        var max$1 = Math.max;
        /**
         * Produce a new array composed of all but the first `n` elements of an input `collection`.
         *
         * @name drop
         * @api public
         * @param {number} count The number of elements to drop.
         * @param {Array} collection The collection to iterate over.
         * @return {Array} A new array containing all but the first element from `collection`.
         * @example
         * drop(0, [1, 2, 3]); // => [1, 2, 3]
         * drop(1, [1, 2, 3]); // => [2, 3]
         * drop(2, [1, 2, 3]); // => [3]
         * drop(3, [1, 2, 3]); // => []
         * drop(4, [1, 2, 3]); // => []
         */

        var drop$1 = function drop(count, collection) {
            var length = collection ? collection.length : 0;

            if (!length) {
                return [];
            } // Preallocating an array *significantly* boosts performance when dealing with
            // `arguments` objects on v8. For a summary, see:
            // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments


            var toDrop = max$1(Number(count) || 0, 0);
            var resultsLength = max$1(length - toDrop, 0);
            var results = new Array(resultsLength);

            for (var i = 0; i < resultsLength; i += 1) {
                results[i] = collection[i + toDrop];
            }

            return results;
        };
        /*
   * Exports.
   */


        var drop_1 = drop$1;

        var max = Math.max;
        /**
         * Produce a new array by passing each value in the input `collection` through a transformative
         * `iterator` function. The `iterator` function is passed three arguments:
         * `(value, index, collection)`.
         *
         * @name rest
         * @api public
         * @param {Array} collection The collection to iterate over.
         * @return {Array} A new array containing all but the first element from `collection`.
         * @example
         * rest([1, 2, 3]); // => [2, 3]
         */

        var rest$1 = function rest(collection) {
            if (collection == null || !collection.length) {
                return [];
            } // Preallocating an array *significantly* boosts performance when dealing with
            // `arguments` objects on v8. For a summary, see:
            // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments


            var results = new Array(max(collection.length - 2, 0));

            for (var i = 1; i < collection.length; i += 1) {
                results[i - 1] = collection[i];
            }

            return results;
        };
        /*
   * Exports.
   */


        var rest_1 = rest$1;

        /*
   * Module dependencies.
   */


        var drop = drop_1;
        var rest = rest_1;
        var has$1 = Object.prototype.hasOwnProperty;
        var objToString$1 = Object.prototype.toString;
        /**
         * Returns `true` if a value is an object, otherwise `false`.
         *
         * @name isObject
         * @api private
         * @param {*} val The value to test.
         * @return {boolean}
         */
            // TODO: Move to a library

        var isObject = function isObject(value) {
                return Boolean(value) && _typeof(value) === 'object';
            };
        /**
         * Returns `true` if a value is a plain object, otherwise `false`.
         *
         * @name isPlainObject
         * @api private
         * @param {*} val The value to test.
         * @return {boolean}
         */
            // TODO: Move to a library


        var isPlainObject = function isPlainObject(value) {
                return Boolean(value) && objToString$1.call(value) === '[object Object]';
            };
        /**
         * Assigns a key-value pair to a target object when the value assigned is owned,
         * and where target[key] is undefined.
         *
         * @name shallowCombiner
         * @api private
         * @param {Object} target
         * @param {Object} source
         * @param {*} value
         * @param {string} key
         */


        var shallowCombiner = function shallowCombiner(target, source, value, key) {
            if (has$1.call(source, key) && target[key] === undefined) {
                target[key] = value;
            }

            return source;
        };
        /**
         * Assigns a key-value pair to a target object when the value assigned is owned,
         * and where target[key] is undefined; also merges objects recursively.
         *
         * @name deepCombiner
         * @api private
         * @param {Object} target
         * @param {Object} source
         * @param {*} value
         * @param {string} key
         * @return {Object}
         */


        var deepCombiner = function deepCombiner(target, source, value, key) {
            if (has$1.call(source, key)) {
                if (isPlainObject(target[key]) && isPlainObject(value)) {
                    target[key] = defaultsDeep(target[key], value);
                } else if (target[key] === undefined) {
                    target[key] = value;
                }
            }

            return source;
        };
        /**
         * TODO: Document
         *
         * @name defaultsWith
         * @api private
         * @param {Function} combiner
         * @param {Object} target
         * @param {...Object} sources
         * @return {Object} Return the input `target`.
         */


        var defaultsWith = function defaultsWith(combiner, target
                                                 /*, ...sources */
        ) {
            if (!isObject(target)) {
                return target;
            }

            combiner = combiner || shallowCombiner;
            var sources = drop(2, arguments);

            for (var i = 0; i < sources.length; i += 1) {
                for (var key in sources[i]) {
                    combiner(target, sources[i], sources[i][key], key);
                }
            }

            return target;
        };
        /**
         * Copies owned, enumerable properties from a source object(s) to a target
         * object when the value of that property on the source object is `undefined`.
         * Recurses on objects.
         *
         * @name defaultsDeep
         * @api public
         * @param {Object} target
         * @param {...Object} sources
         * @return {Object} The input `target`.
         */


        var defaultsDeep = function defaultsDeep(target
                                                 /*, sources */
        ) {
            // TODO: Replace with `partial` call?
            return defaultsWith.apply(null, [deepCombiner, target].concat(rest(arguments)));
        };
        /**
         * Copies owned, enumerable properties from a source object(s) to a target
         * object when the value of that property on the source object is `undefined`.
         *
         * @name defaults
         * @api public
         * @param {Object} target
         * @param {...Object} sources
         * @return {Object}
         * @example
         * var a = { a: 1 };
         * var b = { a: 2, b: 2 };
         *
         * defaults(a, b);
         * console.log(a); //=> { a: 1, b: 2 }
         */


        var defaults$2 = function defaults(target
                                           /*, ...sources */
        ) {
            // TODO: Replace with `partial` call?
            return defaultsWith.apply(null, [null, target].concat(rest(arguments)));
        };
        /*
   * Exports.
   */


        defaults$3.exports = defaults$2;
        defaults$3.exports.deep = defaultsDeep;

        var lib$1 = {exports: {}};

        var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};

        // based off https://github.com/defunctzombie/node-process/blob/master/browser.js

        function defaultSetTimout() {
            throw new Error('setTimeout has not been defined');
        }

        function defaultClearTimeout() {
            throw new Error('clearTimeout has not been defined');
        }

        var cachedSetTimeout = defaultSetTimout;
        var cachedClearTimeout = defaultClearTimeout;

        if (typeof global$1.setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        }

        if (typeof global$1.clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        }

        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
                //normal enviroments in sane situations
                return setTimeout(fun, 0);
            } // if setTimeout wasn't available but was latter defined


            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
            }

            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }
        }

        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
                //normal enviroments in sane situations
                return clearTimeout(marker);
            } // if clearTimeout wasn't available but was latter defined


            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
            }

            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                    // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                    return cachedClearTimeout.call(this, marker);
                }
            }
        }

        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;

        function cleanUpNextTick() {
            if (!draining || !currentQueue) {
                return;
            }

            draining = false;

            if (currentQueue.length) {
                queue = currentQueue.concat(queue);
            } else {
                queueIndex = -1;
            }

            if (queue.length) {
                drainQueue();
            }
        }

        function drainQueue() {
            if (draining) {
                return;
            }

            var timeout = runTimeout(cleanUpNextTick);
            draining = true;
            var len = queue.length;

            while (len) {
                currentQueue = queue;
                queue = [];

                while (++queueIndex < len) {
                    if (currentQueue) {
                        currentQueue[queueIndex].run();
                    }
                }

                queueIndex = -1;
                len = queue.length;
            }

            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
        }

        function nextTick(fun) {
            var args = new Array(arguments.length - 1);

            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }

            queue.push(new Item(fun, args));

            if (queue.length === 1 && !draining) {
                runTimeout(drainQueue);
            }
        } // v8 likes predictible objects

        function Item(fun, array) {
            this.fun = fun;
            this.array = array;
        }

        Item.prototype.run = function () {
            this.fun.apply(null, this.array);
        };

        var title = 'browser';
        var platform = 'browser';
        var browser$1 = true;
        var env = {};
        var argv = [];
        var version$1 = ''; // empty string to avoid regexp issues

        var versions = {};
        var release = {};
        var config = {};

        function noop() {
        }

        var on = noop;
        var addListener = noop;
        var once = noop;
        var off = noop;
        var removeListener = noop;
        var removeAllListeners = noop;
        var emit = noop;

        function binding(name) {
            throw new Error('process.binding is not supported');
        }

        function cwd() {
            return '/';
        }

        function chdir(dir) {
            throw new Error('process.chdir is not supported');
        }

        function umask() {
            return 0;
        } // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js

        var performance$1 = global$1.performance || {};

        var performanceNow = performance$1.now || performance$1.mozNow || performance$1.msNow || performance$1.oNow || performance$1.webkitNow || function () {
            return new Date().getTime();
        }; // generate timestamp or delta
        // see http://nodejs.org/api/process.html#process_process_hrtime


        function hrtime(previousTimestamp) {
            var clocktime = performanceNow.call(performance$1) * 1e-3;
            var seconds = Math.floor(clocktime);
            var nanoseconds = Math.floor(clocktime % 1 * 1e9);

            if (previousTimestamp) {
                seconds = seconds - previousTimestamp[0];
                nanoseconds = nanoseconds - previousTimestamp[1];

                if (nanoseconds < 0) {
                    seconds--;
                    nanoseconds += 1e9;
                }
            }

            return [seconds, nanoseconds];
        }

        var startTime = new Date();

        function uptime() {
            var currentTime = new Date();
            var dif = currentTime - startTime;
            return dif / 1000;
        }

        var process = {
            nextTick: nextTick,
            title: title,
            browser: browser$1,
            env: env,
            argv: argv,
            version: version$1,
            versions: versions,
            on: on,
            addListener: addListener,
            once: once,
            off: off,
            removeListener: removeListener,
            removeAllListeners: removeAllListeners,
            emit: emit,
            binding: binding,
            cwd: cwd,
            chdir: chdir,
            umask: umask,
            hrtime: hrtime,
            platform: platform,
            release: release,
            config: config,
            uptime: uptime
        };

        var browser = {exports: {}};

        var debug$3 = {exports: {}};

        var s = 1000;
        var m = s * 60;
        var h = m * 60;
        var d = h * 24;
        var y = d * 365.25;
        /**
         * Parse or format the given `val`.
         *
         * Options:
         *
         *  - `long` verbose formatting [false]
         *
         * @param {String|Number} val
         * @param {Object} [options]
         * @throws {Error} throw an error if val is not a non-empty string or a number
         * @return {String|Number}
         * @api public
         */

        var ms = function ms(val, options) {
            options = options || {};

            var type = _typeof(val);

            if (type === 'string' && val.length > 0) {
                return parse$3(val);
            } else if (type === 'number' && isNaN(val) === false) {
                return options.long ? fmtLong(val) : fmtShort(val);
            }

            throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
        };

        /**
         * Parse the given `str` and return milliseconds.
         *
         * @param {String} str
         * @return {Number}
         * @api private
         */


        function parse$3(str) {
            str = String(str);

            if (str.length > 100) {
                return;
            }

            var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);

            if (!match) {
                return;
            }

            var n = parseFloat(match[1]);
            var type = (match[2] || 'ms').toLowerCase();

            switch (type) {
                case 'years':
                case 'year':
                case 'yrs':
                case 'yr':
                case 'y':
                    return n * y;

                case 'days':
                case 'day':
                case 'd':
                    return n * d;

                case 'hours':
                case 'hour':
                case 'hrs':
                case 'hr':
                case 'h':
                    return n * h;

                case 'minutes':
                case 'minute':
                case 'mins':
                case 'min':
                case 'm':
                    return n * m;

                case 'seconds':
                case 'second':
                case 'secs':
                case 'sec':
                case 's':
                    return n * s;

                case 'milliseconds':
                case 'millisecond':
                case 'msecs':
                case 'msec':
                case 'ms':
                    return n;

                default:
                    return undefined;
            }
        }

        /**
         * Short format for `ms`.
         *
         * @param {Number} ms
         * @return {String}
         * @api private
         */


        function fmtShort(ms) {
            if (ms >= d) {
                return Math.round(ms / d) + 'd';
            }

            if (ms >= h) {
                return Math.round(ms / h) + 'h';
            }

            if (ms >= m) {
                return Math.round(ms / m) + 'm';
            }

            if (ms >= s) {
                return Math.round(ms / s) + 's';
            }

            return ms + 'ms';
        }

        /**
         * Long format for `ms`.
         *
         * @param {Number} ms
         * @return {String}
         * @api private
         */


        function fmtLong(ms) {
            return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
        }

        /**
         * Pluralization helper.
         */


        function plural(ms, n, name) {
            if (ms < n) {
                return;
            }

            if (ms < n * 1.5) {
                return Math.floor(ms / n) + ' ' + name;
            }

            return Math.ceil(ms / n) + ' ' + name + 's';
        }

        (function (module, exports) {
            /**
             * This is the common logic for both the Node.js and web browser
             * implementations of `debug()`.
             *
             * Expose `debug()` as the module.
             */
            exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
            exports.coerce = coerce;
            exports.disable = disable;
            exports.enable = enable;
            exports.enabled = enabled;
            exports.humanize = ms;
            /**
             * The currently active debug mode names, and names to skip.
             */

            exports.names = [];
            exports.skips = [];
            /**
             * Map of special "%n" handling functions, for the debug "format" argument.
             *
             * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
             */

            exports.formatters = {};
            /**
             * Previous log timestamp.
             */

            var prevTime;

            /**
             * Select a color.
             * @param {String} namespace
             * @return {Number}
             * @api private
             */

            function selectColor(namespace) {
                var hash = 0,
                    i;

                for (i in namespace) {
                    hash = (hash << 5) - hash + namespace.charCodeAt(i);
                    hash |= 0; // Convert to 32bit integer
                }

                return exports.colors[Math.abs(hash) % exports.colors.length];
            }

            /**
             * Create a debugger with the given `namespace`.
             *
             * @param {String} namespace
             * @return {Function}
             * @api public
             */


            function createDebug(namespace) {
                function debug() {
                    // disabled?
                    if (!debug.enabled) return;
                    var self = debug; // set `diff` timestamp

                    var curr = +new Date();
                    var ms = curr - (prevTime || curr);
                    self.diff = ms;
                    self.prev = prevTime;
                    self.curr = curr;
                    prevTime = curr; // turn the `arguments` into a proper Array

                    var args = new Array(arguments.length);

                    for (var i = 0; i < args.length; i++) {
                        args[i] = arguments[i];
                    }

                    args[0] = exports.coerce(args[0]);

                    if ('string' !== typeof args[0]) {
                        // anything else let's inspect with %O
                        args.unshift('%O');
                    } // apply any `formatters` transformations


                    var index = 0;
                    args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
                        // if we encounter an escaped % then don't increase the array index
                        if (match === '%%') return match;
                        index++;
                        var formatter = exports.formatters[format];

                        if ('function' === typeof formatter) {
                            var val = args[index];
                            match = formatter.call(self, val); // now we need to remove `args[index]` since it's inlined in the `format`

                            args.splice(index, 1);
                            index--;
                        }

                        return match;
                    }); // apply env-specific formatting (colors, etc.)

                    exports.formatArgs.call(self, args);
                    var logFn = debug.log || exports.log || console.log.bind(console);
                    logFn.apply(self, args);
                }

                debug.namespace = namespace;
                debug.enabled = exports.enabled(namespace);
                debug.useColors = exports.useColors();
                debug.color = selectColor(namespace); // env-specific initialization logic for debug instances

                if ('function' === typeof exports.init) {
                    exports.init(debug);
                }

                return debug;
            }

            /**
             * Enables a debug mode by namespaces. This can include modes
             * separated by a colon and wildcards.
             *
             * @param {String} namespaces
             * @api public
             */


            function enable(namespaces) {
                exports.save(namespaces);
                exports.names = [];
                exports.skips = [];
                var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
                var len = split.length;

                for (var i = 0; i < len; i++) {
                    if (!split[i]) continue; // ignore empty strings

                    namespaces = split[i].replace(/\*/g, '.*?');

                    if (namespaces[0] === '-') {
                        exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
                    } else {
                        exports.names.push(new RegExp('^' + namespaces + '$'));
                    }
                }
            }

            /**
             * Disable debug output.
             *
             * @api public
             */


            function disable() {
                exports.enable('');
            }

            /**
             * Returns true if the given mode name is enabled, false otherwise.
             *
             * @param {String} name
             * @return {Boolean}
             * @api public
             */


            function enabled(name) {
                var i, len;

                for (i = 0, len = exports.skips.length; i < len; i++) {
                    if (exports.skips[i].test(name)) {
                        return false;
                    }
                }

                for (i = 0, len = exports.names.length; i < len; i++) {
                    if (exports.names[i].test(name)) {
                        return true;
                    }
                }

                return false;
            }

            /**
             * Coerce `val`.
             *
             * @param {Mixed} val
             * @return {Mixed}
             * @api private
             */


            function coerce(val) {
                if (val instanceof Error) return val.stack || val.message;
                return val;
            }
        })(debug$3, debug$3.exports);

        (function (module, exports) {
            exports = module.exports = debug$3.exports;
            exports.log = log;
            exports.formatArgs = formatArgs;
            exports.save = save;
            exports.load = load;
            exports.useColors = useColors;
            exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();
            /**
             * Colors.
             */

            exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];

            /**
             * Currently only WebKit-based Web Inspectors, Firefox >= v31,
             * and the Firebug extension (any Firefox version) are known
             * to support "%c" CSS customizations.
             *
             * TODO: add a `localStorage` variable to explicitly enable/disable colors
             */

            function useColors() {
                // NB: In an Electron preload script, document will be defined but not fully
                // initialized. Since we know we're in Chrome, we'll just detect this case
                // explicitly
                if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
                    return true;
                } // is webkit? http://stackoverflow.com/a/16459606/376773
                // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


                return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
                    typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
                    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
                    typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
                    typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
            }

            /**
             * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
             */


            exports.formatters.j = function (v) {
                try {
                    return JSON.stringify(v);
                } catch (err) {
                    return '[UnexpectedJSONParseError]: ' + err.message;
                }
            };

            /**
             * Colorize log arguments if enabled.
             *
             * @api public
             */


            function formatArgs(args) {
                var useColors = this.useColors;
                args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);
                if (!useColors) return;
                var c = 'color: ' + this.color;
                args.splice(1, 0, c, 'color: inherit'); // the final "%c" is somewhat tricky, because there could be other
                // arguments passed either before or after the %c, so we need to
                // figure out the correct index to insert the CSS into

                var index = 0;
                var lastC = 0;
                args[0].replace(/%[a-zA-Z%]/g, function (match) {
                    if ('%%' === match) return;
                    index++;

                    if ('%c' === match) {
                        // we only are interested in the *last* %c
                        // (the user may have provided their own)
                        lastC = index;
                    }
                });
                args.splice(lastC, 0, c);
            }

            /**
             * Invokes `console.log()` when available.
             * No-op when `console.log` is not a "function".
             *
             * @api public
             */


            function log() {
                // this hackery is required for IE8/9, where
                // the `console.log` function doesn't have 'apply'
                return 'object' === (typeof console === "undefined" ? "undefined" : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
            }

            /**
             * Save `namespaces`.
             *
             * @param {String} namespaces
             * @api private
             */


            function save(namespaces) {
                try {
                    if (null == namespaces) {
                        exports.storage.removeItem('debug');
                    } else {
                        exports.storage.debug = namespaces;
                    }
                } catch (e) {
                }
            }

            /**
             * Load `namespaces`.
             *
             * @return {String} returns the previously persisted debug modes
             * @api private
             */


            function load() {
                var r;

                try {
                    r = exports.storage.debug;
                } catch (e) {
                } // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


                if (!r && typeof process !== 'undefined' && 'env' in process) {
                    r = process.env.DEBUG;
                }

                return r;
            }

            /**
             * Enable namespaces listed in `localStorage.debug` initially.
             */


            exports.enable(load());

            /**
             * Localstorage attempts to return the localstorage.
             *
             * This is necessary because safari throws
             * when a user disables cookies/localstorage
             * and you attempt to access it.
             *
             * @return {LocalStorage}
             * @api private
             */

            function localstorage() {
                try {
                    return window.localStorage;
                } catch (e) {
                }
            }
        })(browser, browser.exports);

        /**
         * Module dependencies.
         */

        var debug$2 = browser.exports('cookie');
        /**
         * Set or get cookie `name` with `value` and `options` object.
         *
         * @param {String} name
         * @param {String} value
         * @param {Object} options
         * @return {Mixed}
         * @api public
         */

        var componentCookie = function componentCookie(name, value, options) {
            switch (arguments.length) {
                case 3:
                case 2:
                    return set(name, value, options);

                case 1:
                    return get(name);

                default:
                    return all();
            }
        };

        /**
         * Set cookie `name` to `value`.
         *
         * @param {String} name
         * @param {String} value
         * @param {Object} options
         * @api private
         */


        function set(name, value, options) {
            options = options || {};
            var str = encode(name) + '=' + encode(value);
            if (null == value) options.maxage = -1;

            if (options.maxage) {
                options.expires = new Date(+new Date() + options.maxage);
            }

            if (options.path) str += '; path=' + options.path;
            if (options.domain) str += '; domain=' + options.domain;
            if (options.expires) str += '; expires=' + options.expires.toUTCString();
            if (options.secure) str += '; secure';
            document.cookie = str;
        }

        /**
         * Return all cookies.
         *
         * @return {Object}
         * @api private
         */


        function all() {
            var str;

            try {
                str = document.cookie;
            } catch (err) {
                if (typeof console !== 'undefined' && typeof console.error === 'function') {
                    console.error(err.stack || err);
                }

                return {};
            }

            return parse$2(str);
        }

        /**
         * Get cookie `name`.
         *
         * @param {String} name
         * @return {String}
         * @api private
         */


        function get(name) {
            return all()[name];
        }

        /**
         * Parse cookie `str`.
         *
         * @param {String} str
         * @return {Object}
         * @api private
         */


        function parse$2(str) {
            var obj = {};
            var pairs = str.split(/ *; */);
            var pair;
            if ('' == pairs[0]) return obj;

            for (var i = 0; i < pairs.length; ++i) {
                pair = pairs[i].split('=');
                obj[decode$1(pair[0])] = decode$1(pair[1]);
            }

            return obj;
        }

        /**
         * Encode.
         */


        function encode(value) {
            try {
                return encodeURIComponent(value);
            } catch (e) {
                debug$2('error `encode(%o)` - %o', value, e);
            }
        }

        /**
         * Decode.
         */


        function decode$1(value) {
            try {
                return decodeURIComponent(value);
            } catch (e) {
                debug$2('error `decode(%o)` - %o', value, e);
            }
        }

        (function (module, exports) {
            /**
             * Module dependencies.
             */

            var parse = componentUrl.parse;
            var cookie = componentCookie;

            /**
             * Get the top domain.
             *
             * The function constructs the levels of domain and attempts to set a global
             * cookie on each one when it succeeds it returns the top level domain.
             *
             * The method returns an empty string when the hostname is an ip or `localhost`.
             *
             * Example levels:
             *
             *      domain.levels('http://www.google.co.uk');
             *      // => ["co.uk", "google.co.uk", "www.google.co.uk"]
             *
             * Example:
             *
             *      domain('http://localhost:3000/baz');
             *      // => ''
             *      domain('http://dev:3000/baz');
             *      // => ''
             *      domain('http://127.0.0.1:3000/baz');
             *      // => ''
             *      domain('http://segment.io/baz');
             *      // => 'segment.io'
             *
             * @param {string} url
             * @return {string}
             * @api public
             */

            function domain(url) {
                var cookie = exports.cookie;
                var levels = exports.levels(url); // Lookup the real top level one.

                for (var i = 0; i < levels.length; ++i) {
                    var cname = '__tld__';
                    var domain = levels[i];
                    var opts = {
                        domain: '.' + domain
                    };
                    cookie(cname, 1, opts);

                    if (cookie(cname)) {
                        cookie(cname, null, opts);
                        return domain;
                    }
                }

                return '';
            }

            /**
             * Levels returns all levels of the given url.
             *
             * @param {string} url
             * @return {Array}
             * @api public
             */


            domain.levels = function (url) {
                var host = parse(url).hostname;
                var parts = host.split('.');
                var last = parts[parts.length - 1];
                var levels = []; // Ip address.

                if (parts.length === 4 && last === parseInt(last, 10)) {
                    return levels;
                } // Localhost.


                if (parts.length <= 1) {
                    return levels;
                } // Create levels.


                for (var i = parts.length - 2; i >= 0; --i) {
                    levels.push(parts.slice(i).join('.'));
                }

                return levels;
            };
            /**
             * Expose cookie on domain.
             */


            domain.cookie = cookie;
            /*
     * Exports.
     */

            exports = module.exports = domain;
        })(lib$1, lib$1.exports);

        var topDomain = lib$1.exports;

        /**
         * An object utility to persist values in cookies
         */

        var CookieLocal = /*#__PURE__*/function () {
            function CookieLocal(options) {
                _classCallCheck(this, CookieLocal);

                this.cOpts = {};
                this.options(options);
                this.isSupportAvailable = this.checkSupportAvailability();
            }

            /**
             *
             * @param {*} inOpts
             */


            _createClass(CookieLocal, [{
                key: "options",
                value: function options() {
                    var inOpts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                    if (arguments.length === 0) return this.cOpts;
                    var domain = ".".concat(topDomain(window.location.href));
                    if (domain === '.') domain = null; // the default maxage and path

                    this.cOpts = defaults$3.exports(inOpts, {
                        maxage: 31536000000,
                        path: '/',
                        domain: domain,
                        samesite: 'Lax'
                    });
                    return this.cOpts;
                }
                /**
                 *
                 * @param {*} key
                 * @param {*} value
                 */

            }, {
                key: "set",
                value: function set(key, value) {
                    try {
                        rudderComponentCookie(key, value, cloneDeep(this.cOpts));
                        return true;
                    } catch (e) {
                        logger.error(e);
                        return false;
                    }
                }
                /**
                 *
                 * @param {*} key
                 */

            }, {
                key: "get",
                value: function get(key) {
                    return rudderComponentCookie(key);
                }
                /**
                 *
                 * @param {*} key
                 */

            }, {
                key: "remove",
                value: function remove(key) {
                    try {
                        rudderComponentCookie(key, null, cloneDeep(this.cOpts));
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
                /**
                 * Function to check cookie support exists or not
                 * @returns boolean
                 */

            }, {
                key: "checkSupportAvailability",
                value: function checkSupportAvailability() {
                    var name = 'test_rudder_cookie';
                    this.set(name, true);

                    if (this.get(name)) {
                        this.remove(name);
                        return true;
                    }

                    return false;
                }
            }]);

            return CookieLocal;
        }(); // Exporting only the instance


        var Cookie = new CookieLocal({});

        var store$2 = {exports: {}};

        /**!
         * storejs v2.0.1
         * Local storage localstorage package provides a simple API
         *
         * Copyright (c) 2021 kenny wang <wowohoo@qq.com>
         * https://jaywcjlove.github.io/store.js/
         *
         * Licensed under the MIT license.
         */

        (function (module, exports) {
            (function (global, factory) {
                module.exports = factory();
            })(commonjsGlobal, function () {

                var storage = window.localStorage;

                function isJSON(obj) {
                    obj = JSON.stringify(obj);

                    if (!/^\{[\s\S]*\}$/.test(obj)) {
                        return false;
                    }

                    return true;
                }

                function stringify(val) {
                    return val === undefined || typeof val === "function" ? val + '' : JSON.stringify(val);
                }

                function deserialize(value) {
                    if (typeof value !== 'string') {
                        return undefined;
                    }

                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        return value;
                    }
                }

                function isFunction(value) {
                    return {}.toString.call(value) === "[object Function]";
                }

                function isArray(value) {
                    return Object.prototype.toString.call(value) === "[object Array]";
                } // https://github.com/jaywcjlove/store.js/pull/8
                // Error: QuotaExceededError


                function dealIncognito(storage) {
                    var _KEY = '_Is_Incognit',
                        _VALUE = 'yes';

                    try {
                        storage.setItem(_KEY, _VALUE);
                    } catch (e) {
                        if (e.name === 'QuotaExceededError') {
                            var _nothing = function _nothing() {
                            };

                            storage.__proto__ = {
                                setItem: _nothing,
                                getItem: _nothing,
                                removeItem: _nothing,
                                clear: _nothing
                            };
                        }
                    } finally {
                        if (storage.getItem(_KEY) === _VALUE) storage.removeItem(_KEY);
                    }

                    return storage;
                } // deal QuotaExceededError if user use incognito mode in browser


                storage = dealIncognito(storage);

                function Store() {
                    if (!(this instanceof Store)) {
                        return new Store();
                    }
                }

                Store.prototype = {
                    set: function set(key, val) {
                        if (key && !isJSON(key)) {
                            storage.setItem(key, stringify(val));
                        } else if (isJSON(key)) {
                            for (var a in key) {
                                this.set(a, key[a]);
                            }
                        }

                        return this;
                    },
                    get: function get(key) {
                        if (!key) {
                            var ret = {};
                            this.forEach(function (key, val) {
                                return ret[key] = val;
                            });
                            return ret;
                        }

                        if (key.charAt(0) === '?') {
                            return this.has(key.substr(1));
                        }

                        var args = arguments;

                        if (args.length > 1) {
                            var dt = {};

                            for (var i = 0, len = args.length; i < len; i++) {
                                var value = deserialize(storage.getItem(args[i]));

                                if (this.has(args[i])) {
                                    dt[args[i]] = value;
                                }
                            }

                            return dt;
                        }

                        return deserialize(storage.getItem(key));
                    },
                    clear: function clear() {
                        storage.clear();
                        return this;
                    },
                    remove: function remove(key) {
                        var val = this.get(key);
                        storage.removeItem(key);
                        return val;
                    },
                    has: function has(key) {
                        return {}.hasOwnProperty.call(this.get(), key);
                    },
                    keys: function keys() {
                        var d = [];
                        this.forEach(function (k) {
                            d.push(k);
                        });
                        return d;
                    },
                    forEach: function forEach(callback) {
                        for (var i = 0, len = storage.length; i < len; i++) {
                            var key = storage.key(i);
                            callback(key, this.get(key));
                        }

                        return this;
                    },
                    search: function search(str) {
                        var arr = this.keys(),
                            dt = {};

                        for (var i = 0, len = arr.length; i < len; i++) {
                            if (arr[i].indexOf(str) > -1) dt[arr[i]] = this.get(arr[i]);
                        }

                        return dt;
                    }
                };
                var _Store = null;

                function store(key, data) {
                    var argm = arguments;
                    var dt = null;
                    if (!_Store) _Store = Store();
                    if (argm.length === 0) return _Store.get();

                    if (argm.length === 1) {
                        if (typeof key === "string") return _Store.get(key);
                        if (isJSON(key)) return _Store.set(key);
                    }

                    if (argm.length === 2 && typeof key === "string") {
                        if (!data) return _Store.remove(key);
                        if (data && typeof data === "string") return _Store.set(key, data);

                        if (data && isFunction(data)) {
                            dt = null;
                            dt = data(key, _Store.get(key));
                            store.set(key, dt);
                        }
                    }

                    if (argm.length === 2 && isArray(key) && isFunction(data)) {
                        for (var i = 0, len = key.length; i < len; i++) {
                            dt = data(key[i], _Store.get(key[i]));
                            store.set(key[i], dt);
                        }
                    }

                    return store;
                }

                for (var a in Store.prototype) {
                    store[a] = Store.prototype[a];
                }

                return store;
            });
        })(store$2);

        var store$1 = store$2.exports;

        /**
         * An object utility to persist user and other values in localstorage
         */

        var StoreLocal = /*#__PURE__*/function () {
            function StoreLocal(options) {
                _classCallCheck(this, StoreLocal);

                this.sOpts = {};
                this.enabled = this.checkSupportAvailability();
                this.options(options);
            }

            /**
             *
             * @param {*} options
             */


            _createClass(StoreLocal, [{
                key: "options",
                value: function options() {
                    var _options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                    if (arguments.length === 0) return this.sOpts;
                    defaults$3.exports(_options, {
                        enabled: true
                    });
                    this.enabled = _options.enabled && this.enabled;
                    this.sOpts = _options;
                    return this.sOpts;
                }
                /**
                 *
                 * @param {*} key
                 * @param {*} value
                 */

            }, {
                key: "set",
                value: function set(key, value) {
                    return store$1.set(key, value);
                }
                /**
                 *
                 * @param {*} key
                 */

            }, {
                key: "get",
                value: function get(key) {
                    return store$1.get(key);
                }
                /**
                 *
                 * @param {*} key
                 */

            }, {
                key: "remove",
                value: function remove(key) {
                    return store$1.remove(key);
                }
                /**
                 * Function to check local storage is accessible or not
                 * @returns boolean
                 */

            }, {
                key: "checkSupportAvailability",
                value: function checkSupportAvailability() {
                    var name = 'test_rudder_ls';
                    this.set(name, true);

                    if (this.get(name)) {
                        this.remove(name);
                        return true;
                    }

                    return false;
                }
            }]);

            return StoreLocal;
        }(); // Exporting only the instance


        var Store$2 = new StoreLocal({});

        var defaults$1 = {
            user_storage_key: 'rl_user_id',
            user_storage_trait: 'rl_trait',
            user_storage_anonymousId: 'rl_anonymous_id',
            group_storage_key: 'rl_group_id',
            group_storage_trait: 'rl_group_trait',
            page_storage_init_referrer: 'rl_page_init_referrer',
            page_storage_init_referring_domain: 'rl_page_init_referring_domain',
            session_info: 'rl_session',
            prefix: 'RudderEncrypt:',
            key: 'Rudder'
        };
        var anonymousIdKeyMap = {
            segment: 'ajs_anonymous_id'
        };

        /**
         * Json stringify the given value
         * @param {*} value
         */

        function stringify$1(value) {
            return JSON.stringify(value);
        }

        /**
         * JSON parse the value
         * @param {*} value
         */


        function parse$1(value) {
            // if not parsable, return as is without json parse
            try {
                return value ? JSON.parse(value) : null;
            } catch (e) {
                logger.error(e);
                return value || null;
            }
        }

        /**
         * trim using regex for browser polyfill
         * @param {*} value
         */


        function trim(value) {
            return value.replace(/^\s+|\s+$/gm, '');
        }

        /**
         * decrypt value
         * @param {*} value
         */


        function decryptValue(value) {
            if (!value || typeof value === 'string' && trim(value) === '') {
                return value;
            }

            if (value.substring(0, defaults$1.prefix.length) === defaults$1.prefix) {
                return AES.decrypt(value.substring(defaults$1.prefix.length), defaults$1.key).toString(Utf8);
            }

            return value;
        }

        /**
         * AES encrypt value with constant prefix
         * @param {*} value
         */


        function encryptValue(value) {
            if (trim(value) === '') {
                return value;
            }

            var prefixedVal = "".concat(defaults$1.prefix).concat(AES.encrypt(value, defaults$1.key).toString());
            return prefixedVal;
        }

        /**
         * An object that handles persisting key-val from Analytics
         */


        var Storage$1 = /*#__PURE__*/function () {
            function Storage() {
                _classCallCheck(this, Storage);

                // First try setting the storage to cookie else to localstorage
                if (Cookie.isSupportAvailable) {
                    this.storage = Cookie;
                    return;
                } // localStorage is enabled.


                if (Store$2.enabled) {
                    this.storage = Store$2;
                }

                if (!this.storage) {
                    logger.error('No storage is available :: initializing the SDK without storage');
                }
            }

            _createClass(Storage, [{
                key: "options",
                value: function options() {
                    var _options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                    this.storage.options(_options);
                }
                /**
                 *
                 * @param {*} key
                 * @param {*} value
                 */

            }, {
                key: "setItem",
                value: function setItem(key, value) {
                    this.storage.set(key, encryptValue(stringify$1(value)));
                }
                /**
                 *
                 * @param {*} key
                 * @param {*} value
                 */

            }, {
                key: "setStringItem",
                value: function setStringItem(key, value) {
                    if (typeof value !== 'string') {
                        logger.error("[Storage] ".concat(key, " should be string"));
                        return;
                    }

                    this.setItem(key, value);
                }
                /**
                 *
                 * @param {*} value
                 */

            }, {
                key: "setUserId",
                value: function setUserId(value) {
                    this.setStringItem(defaults$1.user_storage_key, value);
                }
                /**
                 *
                 * @param {*} value
                 */

            }, {
                key: "setUserTraits",
                value: function setUserTraits(value) {
                    this.setItem(defaults$1.user_storage_trait, value);
                }
                /**
                 *
                 * @param {*} value
                 */

            }, {
                key: "setGroupId",
                value: function setGroupId(value) {
                    this.setStringItem(defaults$1.group_storage_key, value);
                }
                /**
                 *
                 * @param {*} value
                 */

            }, {
                key: "setGroupTraits",
                value: function setGroupTraits(value) {
                    this.setItem(defaults$1.group_storage_trait, value);
                }
                /**
                 *
                 * @param {*} value
                 */

            }, {
                key: "setAnonymousId",
                value: function setAnonymousId(value) {
                    this.setStringItem(defaults$1.user_storage_anonymousId, value);
                }
                /**
                 * @param {*} value
                 */

            }, {
                key: "setInitialReferrer",
                value: function setInitialReferrer(value) {
                    this.setItem(defaults$1.page_storage_init_referrer, value);
                }
                /**
                 * @param {*} value
                 */

            }, {
                key: "setInitialReferringDomain",
                value: function setInitialReferringDomain(value) {
                    this.setItem(defaults$1.page_storage_init_referring_domain, value);
                }
                /**
                 * Set session information
                 * @param {*} value
                 */

            }, {
                key: "setSessionInfo",
                value: function setSessionInfo(value) {
                    this.setItem(defaults$1.session_info, value);
                }
                /**
                 *
                 * @param {*} key
                 */

            }, {
                key: "getItem",
                value: function getItem(key) {
                    return parse$1(decryptValue(this.storage.get(key)));
                }
                /**
                 * get the stored userId
                 */

            }, {
                key: "getUserId",
                value: function getUserId() {
                    return this.getItem(defaults$1.user_storage_key);
                }
                /**
                 * get the stored user traits
                 */

            }, {
                key: "getUserTraits",
                value: function getUserTraits() {
                    return this.getItem(defaults$1.user_storage_trait);
                }
                /**
                 * get the stored userId
                 */

            }, {
                key: "getGroupId",
                value: function getGroupId() {
                    return this.getItem(defaults$1.group_storage_key);
                }
                /**
                 * get the stored user traits
                 */

            }, {
                key: "getGroupTraits",
                value: function getGroupTraits() {
                    return this.getItem(defaults$1.group_storage_trait);
                }
                /**
                 * Function to fetch anonymousId from external source
                 * @param {string} key source of the anonymousId
                 * @returns string
                 */

            }, {
                key: "fetchExternalAnonymousId",
                value: function fetchExternalAnonymousId(source) {
                    var anonId;
                    var key = source.toLowerCase();

                    if (!Object.keys(anonymousIdKeyMap).includes(key)) {
                        return anonId;
                    }

                    switch (key) {
                        case 'segment':
                            /**
                             * First check the local storage for anonymousId
                             * Ref: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#identify
                             */
                            if (Store$2.enabled) {
                                anonId = Store$2.get(anonymousIdKeyMap[key]);
                            } // If anonymousId is not present in local storage and check cookie support exists
                            // fetch it from cookie


                            if (!anonId && Cookie.isSupportAvailable) {
                                anonId = Cookie.get(anonymousIdKeyMap[key]);
                            }

                            return anonId;

                        default:
                            return anonId;
                    }
                }
                /**
                 * get stored anonymous id
                 *
                 * Use cases:
                 * 1. getAnonymousId() ->  anonymousIdOptions is undefined this function will return rl_anonymous_id
                 * if present otherwise undefined
                 *
                 * 2. getAnonymousId(anonymousIdOptions) -> In case anonymousIdOptions is present this function will check
                 * if rl_anonymous_id is present then it will return that
                 *
                 * otherwise it will validate the anonymousIdOptions and try to fetch the anonymous Id from the provided source.
                 * Finally if no anonymous Id is present in the source it will return undefined.
                 *
                 * anonymousIdOptions example:
                 *  {
            autoCapture: {
              enabled: true,
              source: "segment",
            },
          }
                 *
                 */

            }, {
                key: "getAnonymousId",
                value: function getAnonymousId(anonymousIdOptions) {
                    // fetch the rl_anonymous_id from storage
                    var rlAnonymousId = parse$1(decryptValue(this.storage.get(defaults$1.user_storage_anonymousId)));
                    /**
                     * If RS's anonymous ID is available, return from here.
                     *
                     * The user, while migrating from a different analytics SDK,
                     * will only need to auto-capture the anonymous ID when the RS SDK
                     * loads for the first time.
                     *
                     * The captured anonymous ID would be available in RS's persistent storage
                     * for all the subsequent SDK runs.
                     * So, instead of always grabbing the ID from the migration source when
                     * the options are specified, it is first checked in the RS's persistent storage.
                     *
                     * Moreover, the user can also clear the anonymous ID from the storage via
                     * the 'reset' API, which renders the migration source's data useless.
                     */

                    if (rlAnonymousId) {
                        return rlAnonymousId;
                    } // validate the provided anonymousIdOptions argument


                    var source = getValue(anonymousIdOptions, 'autoCapture.source');

                    if (getValue(anonymousIdOptions, 'autoCapture.enabled') === true && typeof source === 'string') {
                        // fetch the anonymousId from the external source
                        // ex - segment
                        var anonId = this.fetchExternalAnonymousId(source);
                        if (anonId) return anonId; // return anonymousId if present
                    }

                    return rlAnonymousId; // return undefined
                }
                /**
                 * get stored initial referrer
                 */

            }, {
                key: "getInitialReferrer",
                value: function getInitialReferrer() {
                    return this.getItem(defaults$1.page_storage_init_referrer);
                }
                /**
                 * get stored initial referring domain
                 */

            }, {
                key: "getInitialReferringDomain",
                value: function getInitialReferringDomain() {
                    return this.getItem(defaults$1.page_storage_init_referring_domain);
                }
                /**
                 * get the stored session info
                 */

            }, {
                key: "getSessionInfo",
                value: function getSessionInfo() {
                    return this.getItem(defaults$1.session_info);
                }
                /**
                 *
                 * @param {*} key
                 */

            }, {
                key: "removeItem",
                value: function removeItem(key) {
                    return this.storage.remove(key);
                }
            }, {
                key: "removeSessionInfo",
                value: function removeSessionInfo() {
                    this.removeItem(defaults$1.session_info);
                }
                /**
                 * remove stored keys
                 */

            }, {
                key: "clear",
                value: function clear(flag) {
                    this.storage.remove(defaults$1.user_storage_key);
                    this.storage.remove(defaults$1.user_storage_trait);
                    this.storage.remove(defaults$1.group_storage_key);
                    this.storage.remove(defaults$1.group_storage_trait);

                    if (flag) {
                        this.storage.remove(defaults$1.user_storage_anonymousId);
                    }
                }
            }]);

            return Storage;
        }();

        var Storage = new Storage$1();

        /**
         *
         * Utility method for excluding null and empty values in JSON
         * @param {*} key
         * @param {*} value
         * @returns
         */

        function replacer(key, value) {
            if (value === null || value === undefined) {
                return undefined;
            }

            return value;
        }

        /**
         * Utility method to remove '/' at the end of URL
         * @param {*} inURL
         */


        function removeTrailingSlashes(inURL) {
            return inURL && inURL.endsWith('/') ? inURL.replace(/\/+$/, '') : inURL;
        }

        /**
         *
         * Utility function for UUID generation
         * @returns
         */


        function generateUUID() {
            return v4$2();
        }

        /**
         *
         * Utility function to get current time (formatted) for including in sent_at field
         * @returns
         */


        function getCurrentTimeFormatted() {
            var curDateTime = new Date().toISOString(); // Keeping same as iso string

            /* let curDate = curDateTime.split("T")[0];
    let curTimeExceptMillis = curDateTime
      .split("T")[1]
      .split("Z")[0]
      .split(".")[0];
    let curTimeMillis = curDateTime.split("Z")[0].split(".")[1];
    return curDate + " " + curTimeExceptMillis + "+" + curTimeMillis; */

            return curDateTime;
        }

        /**
         *
         * Utility function to retrieve configuration JSON from server
         * @param {*} context
         * @param {*} url
         * @param {*} callback
         */


        function getJSONTrimmed(context, url, writeKey, callback) {
            // server-side integration, XHR is node module
            var cb_ = callback.bind(context);
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Authorization', "Basic ".concat(btoa("".concat(writeKey, ":"))) // `Basic ${Buffer.from(`${writeKey}:`).toString("base64")}`
            );

            xhr.onload = function () {
                var status = xhr.status;

                if (status == 200) {
                    // logger.debug("status 200 " + "calling callback");
                    cb_(200, xhr.responseText);
                } else {
                    handleError(new Error("request failed with status: ".concat(xhr.status, " for url: ").concat(url)));
                    cb_(status);
                }
            };

            xhr.send();
        }

        /**
         * This function is to add breadcrumbs
         * @param {string} breadcrumb Message to add insight of an user's journey before the error occurred
         */


        function leaveBreadcrumb(breadcrumb) {
            if (window.rsBugsnagClient) {
                window.rsBugsnagClient.leaveBreadcrumb(breadcrumb);
            }
        }

        /**
         * This function is to send handled errors to Bugsnag if Bugsnag client is available
         * @param {Error} error Error instance from handled error
         */


        function notifyError(error) {
            if (window.rsBugsnagClient) {
                window.rsBugsnagClient.notify(error);
            }
        }

        function handleError(error, analyticsInstance) {
            var errorMessage = error.message;

            try {
                if (error instanceof Event) {
                    // Discard all the non-script loading errors
                    if (error.target && error.target.localName !== 'script') return; // Discard script errors that are not originated at SDK or from native SDKs

                    if (error.target.dataset && (error.target.dataset.loader !== LOAD_ORIGIN || error.target.dataset.isNonNativeSDK !== 'true')) return;
                    errorMessage = "error in script loading:: src::  ".concat(error.target.src, " id:: ").concat(error.target.id); // SDK triggered ad-blocker script

                    if (error.target.id === 'ad-block') {
                        analyticsInstance.page('RudderJS-Initiated', 'ad-block page request', {
                            path: '/ad-blocked',
                            title: errorMessage
                        }, analyticsInstance.sendAdblockPageOptions); // No need to proceed further for Ad-block errors

                        return;
                    }
                }

                errorMessage = "[handleError]:: \"".concat(errorMessage, "\"");
                logger.error(errorMessage);
                var errorObj = error;
                if (!(error instanceof Error)) errorObj = new Error(errorMessage);
                notifyError(errorObj);
            } catch (err) {
                logger.error('[handleError] Exception:: ', err);
                notifyError(err);
            }
        }

        function getDefaultPageProperties() {
            var canonicalUrl = getCanonicalUrl();
            var path = canonicalUrl ? componentUrl.parse(canonicalUrl).pathname : window.location.pathname; // const { referrer } = document;

            var search = window.location.search;
            var _document = document,
                title = _document.title;
            var url = getUrl(search);
            var tab_url = window.location.href;
            var referrer = getReferrer();
            var referring_domain = getReferringDomain(referrer);
            var initial_referrer = Storage.getInitialReferrer();
            var initial_referring_domain = Storage.getInitialReferringDomain();
            return {
                path: path,
                referrer: referrer,
                referring_domain: referring_domain,
                search: search,
                title: title,
                url: url,
                tab_url: tab_url,
                initial_referrer: initial_referrer,
                initial_referring_domain: initial_referring_domain
            };
        }

        function getReferrer() {
            return document.referrer || '$direct';
        }

        function getReferringDomain(referrer) {
            var split = referrer.split('/');

            if (split.length >= 3) {
                return split[2];
            }

            return '';
        }

        function getUrl(search) {
            var canonicalUrl = getCanonicalUrl();
            var url = canonicalUrl ? canonicalUrl.indexOf('?') > -1 ? canonicalUrl : canonicalUrl + search : window.location.href;
            var hashIndex = url.indexOf('#');
            return hashIndex > -1 ? url.slice(0, hashIndex) : url;
        }

        function getCanonicalUrl() {
            var tags = document.getElementsByTagName('link');

            for (var i = 0, tag; tag = tags[i]; i++) {
                if (tag.getAttribute('rel') === 'canonical') {
                    return tag.getAttribute('href');
                }
            }
        }

        function transformNamesCore(integrationObject, namesObj) {
            Object.keys(integrationObject).forEach(function (key) {
                if (integrationObject.hasOwnProperty(key)) {
                    if (namesObj[key]) {
                        integrationObject[namesObj[key]] = integrationObject[key];
                    }

                    if (key != 'All') {
                        // delete user supplied keys except All and if except those where oldkeys are not present or oldkeys are same as transformed keys
                        if (namesObj[key] != undefined && namesObj[key] != key) {
                            delete integrationObject[key];
                        }
                    }
                }
            });
        }

        /**
         *
         *
         * @param {*} integrationObject
         */


        function transformToRudderNames(integrationObject) {
            transformNamesCore(integrationObject, commonNames);
        }

        function transformToServerNames(integrationObject) {
            transformNamesCore(integrationObject, clientToServerNames);
        }

        /**
         *
         * @param {*} sdkSuppliedIntegrations
         * @param {*} configPlaneEnabledIntegrations
         */


        function findAllEnabledDestinations(sdkSuppliedIntegrations, configPlaneEnabledIntegrations) {
            var enabledList = [];

            if (!configPlaneEnabledIntegrations || configPlaneEnabledIntegrations.length === 0) {
                return enabledList;
            }

            var allValue = true;

            if (sdkSuppliedIntegrations.All !== undefined) {
                allValue = sdkSuppliedIntegrations.All;
            }

            var intgData = [];

            if (typeof configPlaneEnabledIntegrations[0] === 'string') {
                configPlaneEnabledIntegrations.forEach(function (intg) {
                    intgData.push({
                        intgName: intg,
                        intObj: intg
                    });
                });
            } else if (_typeof(configPlaneEnabledIntegrations[0]) === 'object') {
                configPlaneEnabledIntegrations.forEach(function (intg) {
                    intgData.push({
                        intgName: intg.name,
                        intObj: intg
                    });
                });
            }

            intgData.forEach(function (_ref) {
                var intgName = _ref.intgName,
                    intObj = _ref.intObj;

                if (!allValue) {
                    // All false ==> check if intg true supplied
                    if (sdkSuppliedIntegrations[intgName] != undefined && sdkSuppliedIntegrations[intgName] == true) {
                        enabledList.push(intObj);
                    }
                } else {
                    // All true ==> intg true by default
                    var intgValue = true; // check if intg false supplied

                    if (sdkSuppliedIntegrations[intgName] != undefined && sdkSuppliedIntegrations[intgName] == false) {
                        intgValue = false;
                    }

                    if (intgValue) {
                        enabledList.push(intObj);
                    }
                }
            });
            return enabledList;
        }

        function getUserProvidedConfigUrl(configUrl, defConfigUrl) {
            var url = configUrl;

            if (url.indexOf('sourceConfig') === -1) {
                url = "".concat(removeTrailingSlashes(url), "/sourceConfig/");
            }

            url = url.slice(-1) === '/' ? url : "".concat(url, "/");
            var defQueryParams = defConfigUrl.split('?')[1];
            var urlSplitItems = url.split('?');

            if (urlSplitItems.length > 1 && urlSplitItems[1] !== defQueryParams) {
                url = "".concat(urlSplitItems[0], "?").concat(defQueryParams);
            } else {
                url = "".concat(url, "?").concat(defQueryParams);
            }

            return url;
        }

        /**
         * Check if a reserved keyword is present in properties/traits
         * @param {*} properties
         * @param {*} reservedKeywords
         * @param {*} type
         */


        function checkReservedKeywords(message, messageType) {
            //  properties, traits, contextualTraits are either undefined or object
            var properties = message.properties,
                traits = message.traits;

            if (properties) {
                Object.keys(properties).forEach(function (property) {
                    if (RESERVED_KEYS.indexOf(property.toLowerCase()) >= 0) {
                        logger.error("Warning! : Reserved keyword used in properties--> ".concat(property, " with ").concat(messageType, " call"));
                    }
                });
            }

            if (traits) {
                Object.keys(traits).forEach(function (trait) {
                    if (RESERVED_KEYS.indexOf(trait.toLowerCase()) >= 0) {
                        logger.error("Warning! : Reserved keyword used in traits--> ".concat(trait, " with ").concat(messageType, " call"));
                    }
                });
            }

            var contextualTraits = message.context.traits;

            if (contextualTraits) {
                Object.keys(contextualTraits).forEach(function (contextTrait) {
                    if (RESERVED_KEYS.indexOf(contextTrait.toLowerCase()) >= 0) {
                        logger.error("Warning! : Reserved keyword used in traits --> ".concat(contextTrait, " with ").concat(messageType, " call"));
                    }
                });
            }
        }

        var getConfigUrl = function getConfigUrl(writeKey) {
            return CONFIG_URL.concat(CONFIG_URL.includes('?') ? '&' : '?').concat(writeKey ? "writeKey=".concat(writeKey) : '');
        };

        var getSDKUrlInfo = function getSDKUrlInfo() {
            var scripts = document.getElementsByTagName('script');
            var sdkURL;
            var isStaging = false;

            for (var i = 0; i < scripts.length; i += 1) {
                var curScriptSrc = removeTrailingSlashes(scripts[i].getAttribute('src'));

                if (curScriptSrc) {
                    var urlMatches = curScriptSrc.match(/^.*rudder-analytics(-staging)?(\.min)?\.js$/);

                    if (urlMatches) {
                        sdkURL = curScriptSrc;
                        isStaging = urlMatches[1] !== undefined;
                        break;
                    }
                }
            }

            return {
                sdkURL: sdkURL,
                isStaging: isStaging
            };
        };

        var countDigits = function countDigits(number) {
            return number ? number.toString().length : 0;
        };

        // Application class
        var RudderApp = /*#__PURE__*/_createClass(function RudderApp() {
            _classCallCheck(this, RudderApp);

            this.build = '1.0.0';
            this.name = 'RudderLabs JavaScript SDK';
            this.namespace = 'com.rudderlabs.javascript';
            this.version = '2.15.0';
        });

        /* eslint-disable max-classes-per-file */
        // Library information class
        var RudderLibraryInfo = /*#__PURE__*/_createClass(function RudderLibraryInfo() {
            _classCallCheck(this, RudderLibraryInfo);

            this.name = 'RudderLabs JavaScript SDK';
            this.version = '2.15.0';
        }); // Operating System information class


        var RudderOSInfo = /*#__PURE__*/_createClass(function RudderOSInfo() {
            _classCallCheck(this, RudderOSInfo);

            this.name = '';
            this.version = '';
        }); // Screen information class


        var RudderScreenInfo = /*#__PURE__*/_createClass(function RudderScreenInfo() {
            _classCallCheck(this, RudderScreenInfo);

            this.density = 0;
            this.width = 0;
            this.height = 0;
            this.innerWidth = 0;
            this.innerHeight = 0;
        }); // Device information class

        var RudderContext = /*#__PURE__*/_createClass(function RudderContext() {
            _classCallCheck(this, RudderContext);

            this.app = new RudderApp();
            this.traits = null;
            this.library = new RudderLibraryInfo();
            this.userAgent = null;
            this.device = null;
            this.network = null;
            this.os = new RudderOSInfo();
            this.locale = null;
            this.screen = new RudderScreenInfo(); // Depending on environment within which the code is executing, screen
            // dimensions can be set
            // User agent and locale can be retrieved only for browser
            // For server-side integration, same needs to be set by calling program

            {
                // running within browser
                this.screen.width = window.screen.width;
                this.screen.height = window.screen.height;
                this.screen.density = window.devicePixelRatio;
                this.screen.innerWidth = window.innerWidth;
                this.screen.innerHeight = window.innerHeight;
                this.userAgent = navigator.userAgent; // For supporting Brave browser detection,
                // add "Brave/<version>" to the user agent with the version value from the Chrome component

                if (navigator.brave && Object.getPrototypeOf(navigator.brave).isBrave) {
                    // Example:
                    // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36
                    var matchedArr = this.userAgent.match(/(Chrome)\/([\w\.]+)/i);

                    if (matchedArr) {
                        this.userAgent = "".concat(this.userAgent, " Brave/").concat(matchedArr[2]);
                    }
                } // property name differs based on browser version


                this.locale = navigator.language || navigator.browserLanguage;
            }
        });

        var RudderMessage = /*#__PURE__*/function () {
            function RudderMessage() {
                _classCallCheck(this, RudderMessage);

                this.channel = 'web';
                this.context = new RudderContext();
                this.type = null;
                this.messageId = generateUUID();
                this.originalTimestamp = new Date().toISOString();
                this.anonymousId = null;
                this.userId = null;
                this.event = null;
                this.properties = {};
                this.integrations = {}; // By default, all integrations will be set as enabled from client
                // Decision to route to specific destinations will be taken at server end

                this.integrations.All = true;
            } // Get property


            _createClass(RudderMessage, [{
                key: "getProperty",
                value: function getProperty(key) {
                    return this.properties[key];
                } // Add property

            }, {
                key: "addProperty",
                value: function addProperty(key, value) {
                    this.properties[key] = value;
                }
            }]);

            return RudderMessage;
        }();

        var RudderElement = /*#__PURE__*/function () {
            function RudderElement() {
                _classCallCheck(this, RudderElement);

                this.message = new RudderMessage();
            } // Setters that in turn set the field values for the contained object


            _createClass(RudderElement, [{
                key: "setType",
                value: function setType(type) {
                    this.message.type = type;
                }
            }, {
                key: "setProperty",
                value: function setProperty(rudderProperty) {
                    this.message.properties = rudderProperty;
                }
            }, {
                key: "setUserProperty",
                value: function setUserProperty(rudderUserProperty) {
                    this.message.user_properties = rudderUserProperty;
                }
            }, {
                key: "setUserId",
                value: function setUserId(userId) {
                    this.message.userId = userId;
                }
            }, {
                key: "setEventName",
                value: function setEventName(eventName) {
                    this.message.event = eventName;
                }
            }, {
                key: "getElementContent",
                value: function getElementContent() {
                    return this.message;
                }
            }]);

            return RudderElement;
        }();

        var RudderElementBuilder = /*#__PURE__*/function () {
            function RudderElementBuilder() {
                _classCallCheck(this, RudderElementBuilder);

                this.rudderProperty = null;
                this.rudderUserProperty = null;
                this.event = null;
                this.userId = null;
                this.type = null;
            }

            _createClass(RudderElementBuilder, [{
                key: "setType",
                value: function setType(eventType) {
                    this.type = eventType;
                    return this;
                }
            }, {
                key: "build",
                value: function build() {
                    var element = new RudderElement();
                    element.setUserId(this.userId);
                    element.setType(this.type);
                    element.setEventName(this.event);
                    element.setProperty(this.rudderProperty);
                    element.setUserProperty(this.rudderUserProperty);
                    return element;
                }
            }]);

            return RudderElementBuilder;
        }();

        var dist = {};

        var IDX = 256,
            HEX = [],
            BUFFER;

        while (IDX--) {
            HEX[IDX] = (IDX + 256).toString(16).substring(1);
        }

        function v4$1() {
            var i = 0,
                num,
                out = '';

            if (!BUFFER || IDX + 16 > 256) {
                BUFFER = Array(i = 256);

                while (i--) {
                    BUFFER[i] = 256 * Math.random() | 0;
                }

                i = IDX = 0;
            }

            for (; i < 16; i++) {
                num = BUFFER[IDX + i];
                if (i == 6) out += HEX[num & 15 | 64]; else if (i == 8) out += HEX[num & 63 | 128]; else out += HEX[num];
                if (i & 1 && i > 1 && i < 11) out += '-';
            }

            IDX++;
            return out;
        }

        dist.v4 = v4$1;

        var engine = {};

        var hop = Object.prototype.hasOwnProperty;
        var strCharAt = String.prototype.charAt;
        var toStr = Object.prototype.toString;
        /**
         * Returns the character at a given index.
         *
         * @param {string} str
         * @param {number} index
         * @return {string|undefined}
         */
            // TODO: Move to a library

        var charAt = function charAt(str, index) {
                return strCharAt.call(str, index);
            };
        /**
         * hasOwnProperty, wrapped as a function.
         *
         * @name has
         * @api private
         * @param {*} context
         * @param {string|number} prop
         * @return {boolean}
         */
            // TODO: Move to a library


        var has = function has(context, prop) {
                return hop.call(context, prop);
            };
        /**
         * Returns true if a value is a string, otherwise false.
         *
         * @name isString
         * @api private
         * @param {*} val
         * @return {boolean}
         */
            // TODO: Move to a library


        var isString = function isString(val) {
                return toStr.call(val) === '[object String]';
            };
        /**
         * Returns true if a value is array-like, otherwise false. Array-like means a
         * value is not null, undefined, or a function, and has a numeric `length`
         * property.
         *
         * @name isArrayLike
         * @api private
         * @param {*} val
         * @return {boolean}
         */
            // TODO: Move to a library


        var isArrayLike$1 = function isArrayLike(val) {
                return val != null && typeof val !== 'function' && typeof val.length === 'number';
            };
        /**
         * indexKeys
         *
         * @name indexKeys
         * @api private
         * @param {} target
         * @param {Function} pred
         * @return {Array}
         */


        var indexKeys = function indexKeys(target, pred) {
            pred = pred || has;
            var results = [];

            for (var i = 0, len = target.length; i < len; i += 1) {
                if (pred(target, i)) {
                    results.push(String(i));
                }
            }

            return results;
        };
        /**
         * Returns an array of an object's owned keys.
         *
         * @name objectKeys
         * @api private
         * @param {*} target
         * @param {Function} pred Predicate function used to include/exclude values from
         * the resulting array.
         * @return {Array}
         */


        var objectKeys = function objectKeys(target, pred) {
            pred = pred || has;
            var results = [];

            for (var key in target) {
                if (pred(target, key)) {
                    results.push(String(key));
                }
            }

            return results;
        };
        /**
         * Creates an array composed of all keys on the input object. Ignores any non-enumerable properties.
         * More permissive than the native `Object.keys` function (non-objects will not throw errors).
         *
         * @name keys
         * @api public
         * @category Object
         * @param {Object} source The value to retrieve keys from.
         * @return {Array} An array containing all the input `source`'s keys.
         * @example
         * keys({ likes: 'avocado', hates: 'pineapple' });
         * //=> ['likes', 'pineapple'];
         *
         * // Ignores non-enumerable properties
         * var hasHiddenKey = { name: 'Tim' };
         * Object.defineProperty(hasHiddenKey, 'hidden', {
         *   value: 'i am not enumerable!',
         *   enumerable: false
         * })
         * keys(hasHiddenKey);
         * //=> ['name'];
         *
         * // Works on arrays
         * keys(['a', 'b', 'c']);
         * //=> ['0', '1', '2']
         *
         * // Skips unpopulated indices in sparse arrays
         * var arr = [1];
         * arr[4] = 4;
         * keys(arr);
         * //=> ['0', '4']
         */


        var keys$3 = function keys(source) {
            if (source == null) {
                return [];
            } // IE6-8 compatibility (string)


            if (isString(source)) {
                return indexKeys(source, charAt);
            } // IE6-8 compatibility (arguments)


            if (isArrayLike$1(source)) {
                return indexKeys(source, has);
            }

            return objectKeys(source);
        };
        /*
   * Exports.
   */


        var keys_1 = keys$3;

        // Unique ID creation requires a high quality random # generator. In the browser we therefore
        // require the crypto API and do not support built-in fallback to lower quality random number
        // generators (like Math.random()).
        var getRandomValues;
        var rnds8 = new Uint8Array(16);

        function rng() {
            // lazy load so that environments that need to polyfill have a chance to do so
            if (!getRandomValues) {
                // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
                // find the complete implementation of crypto (msCrypto) on IE11.
                getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

                if (!getRandomValues) {
                    throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
                }
            }

            return getRandomValues(rnds8);
        }

        var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

        function validate(uuid) {
            return typeof uuid === 'string' && REGEX.test(uuid);
        }

        /**
         * Convert array of 16 byte values to UUID string format of the form:
         * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
         */

        var byteToHex = [];

        for (var i$1 = 0; i$1 < 256; ++i$1) {
            byteToHex.push((i$1 + 0x100).toString(16).substr(1));
        }

        function stringify(arr) {
            var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0; // Note: Be careful editing this code!  It's been tuned for performance
            // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434

            var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
            // of the following:
            // - One or more input array values don't map to a hex octet (leading to
            // "undefined" in the uuid)
            // - Invalid input values for the RFC `version` or `variant` fields

            if (!validate(uuid)) {
                throw TypeError('Stringified UUID is invalid');
            }

            return uuid;
        }

        //
        // Inspired by https://github.com/LiosK/UUID.js
        // and http://docs.python.org/library/uuid.html

        var _nodeId;

        var _clockseq; // Previous uuid creation time


        var _lastMSecs = 0;
        var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

        function v1(options, buf, offset) {
            var i = buf && offset || 0;
            var b = buf || new Array(16);
            options = options || {};
            var node = options.node || _nodeId;
            var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
            // specified.  We do this lazily to minimize issues related to insufficient
            // system entropy.  See #189

            if (node == null || clockseq == null) {
                var seedBytes = options.random || (options.rng || rng)();

                if (node == null) {
                    // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
                    node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
                }

                if (clockseq == null) {
                    // Per 4.2.2, randomize (14 bit) clockseq
                    clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
                }
            } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
            // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
            // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
            // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


            var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
            // cycle to simulate higher resolution clock

            var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

            var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

            if (dt < 0 && options.clockseq === undefined) {
                clockseq = clockseq + 1 & 0x3fff;
            } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
            // time interval


            if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
                nsecs = 0;
            } // Per 4.2.1.2 Throw error if too many uuids are requested


            if (nsecs >= 10000) {
                throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
            }

            _lastMSecs = msecs;
            _lastNSecs = nsecs;
            _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

            msecs += 12219292800000; // `time_low`

            var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
            b[i++] = tl >>> 24 & 0xff;
            b[i++] = tl >>> 16 & 0xff;
            b[i++] = tl >>> 8 & 0xff;
            b[i++] = tl & 0xff; // `time_mid`

            var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
            b[i++] = tmh >>> 8 & 0xff;
            b[i++] = tmh & 0xff; // `time_high_and_version`

            b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

            b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

            b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

            b[i++] = clockseq & 0xff; // `node`

            for (var n = 0; n < 6; ++n) {
                b[i + n] = node[n];
            }

            return buf || stringify(b);
        }

        function parse(uuid) {
            if (!validate(uuid)) {
                throw TypeError('Invalid UUID');
            }

            var v;
            var arr = new Uint8Array(16); // Parse ########-....-....-....-............

            arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
            arr[1] = v >>> 16 & 0xff;
            arr[2] = v >>> 8 & 0xff;
            arr[3] = v & 0xff; // Parse ........-####-....-....-............

            arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
            arr[5] = v & 0xff; // Parse ........-....-####-....-............

            arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
            arr[7] = v & 0xff; // Parse ........-....-....-####-............

            arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
            arr[9] = v & 0xff; // Parse ........-....-....-....-############
            // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

            arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
            arr[11] = v / 0x100000000 & 0xff;
            arr[12] = v >>> 24 & 0xff;
            arr[13] = v >>> 16 & 0xff;
            arr[14] = v >>> 8 & 0xff;
            arr[15] = v & 0xff;
            return arr;
        }

        function stringToBytes(str) {
            str = unescape(encodeURIComponent(str)); // UTF8 escape

            var bytes = [];

            for (var i = 0; i < str.length; ++i) {
                bytes.push(str.charCodeAt(i));
            }

            return bytes;
        }

        var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
        var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';

        function v35(name, version, hashfunc) {
            function generateUUID(value, namespace, buf, offset) {
                if (typeof value === 'string') {
                    value = stringToBytes(value);
                }

                if (typeof namespace === 'string') {
                    namespace = parse(namespace);
                }

                if (namespace.length !== 16) {
                    throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
                } // Compute hash of namespace and value, Per 4.3
                // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
                // hashfunc([...namespace, ... value])`


                var bytes = new Uint8Array(16 + value.length);
                bytes.set(namespace);
                bytes.set(value, namespace.length);
                bytes = hashfunc(bytes);
                bytes[6] = bytes[6] & 0x0f | version;
                bytes[8] = bytes[8] & 0x3f | 0x80;

                if (buf) {
                    offset = offset || 0;

                    for (var i = 0; i < 16; ++i) {
                        buf[offset + i] = bytes[i];
                    }

                    return buf;
                }

                return stringify(bytes);
            } // Function#name is not settable on some platforms (#270)


            try {
                generateUUID.name = name; // eslint-disable-next-line no-empty
            } catch (err) {
            } // For CommonJS default export support


            generateUUID.DNS = DNS;
            generateUUID.URL = URL;
            return generateUUID;
        }

        /*
   * Browser-compatible JavaScript MD5
   *
   * Modification of JavaScript MD5
   * https://github.com/blueimp/JavaScript-MD5
   *
   * Copyright 2011, Sebastian Tschan
   * https://blueimp.net
   *
   * Licensed under the MIT license:
   * https://opensource.org/licenses/MIT
   *
   * Based on
   * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
   * Digest Algorithm, as defined in RFC 1321.
   * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * Distributed under the BSD License
   * See http://pajhome.org.uk/crypt/md5 for more info.
   */
        function md5(bytes) {
            if (typeof bytes === 'string') {
                var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

                bytes = new Uint8Array(msg.length);

                for (var i = 0; i < msg.length; ++i) {
                    bytes[i] = msg.charCodeAt(i);
                }
            }

            return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
        }

        /*
   * Convert an array of little-endian words to an array of bytes
   */


        function md5ToHexEncodedArray(input) {
            var output = [];
            var length32 = input.length * 32;
            var hexTab = '0123456789abcdef';

            for (var i = 0; i < length32; i += 8) {
                var x = input[i >> 5] >>> i % 32 & 0xff;
                var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
                output.push(hex);
            }

            return output;
        }

        /**
         * Calculate output length with padding and bit length
         */


        function getOutputLength(inputLength8) {
            return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
        }

        /*
   * Calculate the MD5 of an array of little-endian words, and a bit length.
   */


        function wordsToMd5(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << len % 32;
            x[getOutputLength(len) - 1] = len;
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                a = md5ff(a, b, c, d, x[i], 7, -680876936);
                d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
                b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = md5gg(b, c, d, a, x[i], 20, -373897302);
                a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
                d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = md5hh(d, a, b, c, x[i], 11, -358537222);
                c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = md5ii(a, b, c, d, x[i], 6, -198630844);
                d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = safeAdd(a, olda);
                b = safeAdd(b, oldb);
                c = safeAdd(c, oldc);
                d = safeAdd(d, oldd);
            }

            return [a, b, c, d];
        }

        /*
   * Convert an array bytes to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   */


        function bytesToWords(input) {
            if (input.length === 0) {
                return [];
            }

            var length8 = input.length * 8;
            var output = new Uint32Array(getOutputLength(length8));

            for (var i = 0; i < length8; i += 8) {
                output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
            }

            return output;
        }

        /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */


        function safeAdd(x, y) {
            var lsw = (x & 0xffff) + (y & 0xffff);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return msw << 16 | lsw & 0xffff;
        }

        /*
   * Bitwise rotate a 32-bit number to the left.
   */


        function bitRotateLeft(num, cnt) {
            return num << cnt | num >>> 32 - cnt;
        }

        /*
   * These functions implement the four basic operations the algorithm uses.
   */


        function md5cmn(q, a, b, x, s, t) {
            return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
        }

        function md5ff(a, b, c, d, x, s, t) {
            return md5cmn(b & c | ~b & d, a, b, x, s, t);
        }

        function md5gg(a, b, c, d, x, s, t) {
            return md5cmn(b & d | c & ~d, a, b, x, s, t);
        }

        function md5hh(a, b, c, d, x, s, t) {
            return md5cmn(b ^ c ^ d, a, b, x, s, t);
        }

        function md5ii(a, b, c, d, x, s, t) {
            return md5cmn(c ^ (b | ~d), a, b, x, s, t);
        }

        var v3 = v35('v3', 0x30, md5);
        var v3$1 = v3;

        function v4(options, buf, offset) {
            options = options || {};
            var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

            rnds[6] = rnds[6] & 0x0f | 0x40;
            rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

            if (buf) {
                offset = offset || 0;

                for (var i = 0; i < 16; ++i) {
                    buf[offset + i] = rnds[i];
                }

                return buf;
            }

            return stringify(rnds);
        }

        // Adapted from Chris Veness' SHA1 code at
        // http://www.movable-type.co.uk/scripts/sha1.html
        function f(s, x, y, z) {
            switch (s) {
                case 0:
                    return x & y ^ ~x & z;

                case 1:
                    return x ^ y ^ z;

                case 2:
                    return x & y ^ x & z ^ y & z;

                case 3:
                    return x ^ y ^ z;
            }
        }

        function ROTL(x, n) {
            return x << n | x >>> 32 - n;
        }

        function sha1(bytes) {
            var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
            var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

            if (typeof bytes === 'string') {
                var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

                bytes = [];

                for (var i = 0; i < msg.length; ++i) {
                    bytes.push(msg.charCodeAt(i));
                }
            } else if (!Array.isArray(bytes)) {
                // Convert Array-like to Array
                bytes = Array.prototype.slice.call(bytes);
            }

            bytes.push(0x80);
            var l = bytes.length / 4 + 2;
            var N = Math.ceil(l / 16);
            var M = new Array(N);

            for (var _i = 0; _i < N; ++_i) {
                var arr = new Uint32Array(16);

                for (var j = 0; j < 16; ++j) {
                    arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
                }

                M[_i] = arr;
            }

            M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
            M[N - 1][14] = Math.floor(M[N - 1][14]);
            M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

            for (var _i2 = 0; _i2 < N; ++_i2) {
                var W = new Uint32Array(80);

                for (var t = 0; t < 16; ++t) {
                    W[t] = M[_i2][t];
                }

                for (var _t = 16; _t < 80; ++_t) {
                    W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
                }

                var a = H[0];
                var b = H[1];
                var c = H[2];
                var d = H[3];
                var e = H[4];

                for (var _t2 = 0; _t2 < 80; ++_t2) {
                    var s = Math.floor(_t2 / 20);
                    var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
                    e = d;
                    d = c;
                    c = ROTL(b, 30) >>> 0;
                    b = a;
                    a = T;
                }

                H[0] = H[0] + a >>> 0;
                H[1] = H[1] + b >>> 0;
                H[2] = H[2] + c >>> 0;
                H[3] = H[3] + d >>> 0;
                H[4] = H[4] + e >>> 0;
            }

            return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
        }

        var v5 = v35('v5', 0x50, sha1);
        var v5$1 = v5;

        var nil = '00000000-0000-0000-0000-000000000000';

        function version(uuid) {
            if (!validate(uuid)) {
                throw TypeError('Invalid UUID');
            }

            return parseInt(uuid.substr(14, 1), 16);
        }

        var esmBrowser = /*#__PURE__*/Object.freeze({
            __proto__: null,
            v1: v1,
            v3: v3$1,
            v4: v4,
            v5: v5$1,
            NIL: nil,
            version: version,
            validate: validate,
            stringify: stringify,
            parse: parse
        });

        var require$$1 = /*@__PURE__*/getAugmentedNamespace(esmBrowser);

        var keys$2 = keys_1;
        var uuid$1 = require$$1.v4;
        var inMemoryStore = {
            _data: {},
            length: 0,
            setItem: function setItem(key, value) {
                this._data[key] = value;
                this.length = keys$2(this._data).length;
                return value;
            },
            getItem: function getItem(key) {
                if (key in this._data) {
                    return this._data[key];
                }

                return null;
            },
            removeItem: function removeItem(key) {
                if (key in this._data) {
                    delete this._data[key];
                }

                this.length = keys$2(this._data).length;
                return null;
            },
            clear: function clear() {
                this._data = {};
                this.length = 0;
            },
            key: function key(index) {
                return keys$2(this._data)[index];
            }
        };

        function isSupportedNatively() {
            try {
                if (!window.localStorage) return false;
                var key = uuid$1();
                window.localStorage.setItem(key, 'test_value');
                var value = window.localStorage.getItem(key);
                window.localStorage.removeItem(key); // handle localStorage silently failing

                return value === 'test_value';
            } catch (e) {
                // Can throw if localStorage is disabled
                return false;
            }
        }

        function pickStorage() {
            if (isSupportedNatively()) {
                return window.localStorage;
            } // fall back to in-memory


            return inMemoryStore;
        } // Return a shared instance


        engine.defaultEngine = pickStorage(); // Expose the in-memory store explicitly for testing

        engine.inMemoryEngine = inMemoryStore;

        /*
   * Module dependencies.
   */


        var keys$1 = keys_1;
        var objToString = Object.prototype.toString;
        /**
         * Tests if a value is a number.
         *
         * @name isNumber
         * @api private
         * @param {*} val The value to test.
         * @return {boolean} Returns `true` if `val` is a number, otherwise `false`.
         */
            // TODO: Move to library

        var isNumber = function isNumber(val) {
                var type = _typeof(val);

                return type === 'number' || type === 'object' && objToString.call(val) === '[object Number]';
            };
        /**
         * Tests if a value is an array.
         *
         * @name isArray
         * @api private
         * @param {*} val The value to test.
         * @return {boolean} Returns `true` if the value is an array, otherwise `false`.
         */
            // TODO: Move to library


        var isArray = typeof Array.isArray === 'function' ? Array.isArray : function isArray(val) {
                return objToString.call(val) === '[object Array]';
            };
        /**
         * Tests if a value is array-like. Array-like means the value is not a function and has a numeric
         * `.length` property.
         *
         * @name isArrayLike
         * @api private
         * @param {*} val
         * @return {boolean}
         */
            // TODO: Move to library

        var isArrayLike = function isArrayLike(val) {
                return val != null && (isArray(val) || val !== 'function' && isNumber(val.length));
            };
        /**
         * Internal implementation of `each`. Works on arrays and array-like data structures.
         *
         * @name arrayEach
         * @api private
         * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
         * @param {Array} array The array(-like) structure to iterate over.
         * @return {undefined}
         */


        var arrayEach = function arrayEach(iterator, array) {
            for (var i = 0; i < array.length; i += 1) {
                // Break iteration early if `iterator` returns `false`
                if (iterator(array[i], i, array) === false) {
                    break;
                }
            }
        };
        /**
         * Internal implementation of `each`. Works on objects.
         *
         * @name baseEach
         * @api private
         * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
         * @param {Object} object The object to iterate over.
         * @return {undefined}
         */


        var baseEach = function baseEach(iterator, object) {
            var ks = keys$1(object);

            for (var i = 0; i < ks.length; i += 1) {
                // Break iteration early if `iterator` returns `false`
                if (iterator(object[ks[i]], ks[i], object) === false) {
                    break;
                }
            }
        };
        /**
         * Iterate over an input collection, invoking an `iterator` function for each element in the
         * collection and passing to it three arguments: `(value, index, collection)`. The `iterator`
         * function can end iteration early by returning `false`.
         *
         * @name each
         * @api public
         * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
         * @param {Array|Object|string} collection The collection to iterate over.
         * @return {undefined} Because `each` is run only for side effects, always returns `undefined`.
         * @example
         * var log = console.log.bind(console);
         *
         * each(log, ['a', 'b', 'c']);
         * //-> 'a', 0, ['a', 'b', 'c']
         * //-> 'b', 1, ['a', 'b', 'c']
         * //-> 'c', 2, ['a', 'b', 'c']
         * //=> undefined
         *
         * each(log, 'tim');
         * //-> 't', 2, 'tim'
         * //-> 'i', 1, 'tim'
         * //-> 'm', 0, 'tim'
         * //=> undefined
         *
         * // Note: Iteration order not guaranteed across environments
         * each(log, { name: 'tim', occupation: 'enchanter' });
         * //-> 'tim', 'name', { name: 'tim', occupation: 'enchanter' }
         * //-> 'enchanter', 'occupation', { name: 'tim', occupation: 'enchanter' }
         * //=> undefined
         */


        var each$3 = function each(iterator, collection) {
            return (isArrayLike(collection) ? arrayEach : baseEach).call(this, iterator, collection);
        };
        /*
   * Exports.
   */


        var each_1 = each$3;

        var defaultEngine = engine.defaultEngine;
        var inMemoryEngine = engine.inMemoryEngine;
        var each$2 = each_1;
        var keys = keys_1;
        var json = JSON;

        /**
         * Store Implementation with dedicated
         */

        function Store$1(name, id, keys, optionalEngine) {
            this.id = id;
            this.name = name;
            this.keys = keys || {};
            this.engine = optionalEngine || defaultEngine;
            this.originalEngine = this.engine;
        }

        /**
         * Set value by key.
         */


        Store$1.prototype.set = function (key, value) {
            var compoundKey = this._createValidKey(key);

            if (!compoundKey) return;

            try {
                this.engine.setItem(compoundKey, json.stringify(value));
            } catch (err) {
                if (isQuotaExceeded(err)) {
                    // switch to inMemory engine
                    this._swapEngine(); // and save it there


                    this.set(key, value);
                }
            }
        };
        /**
         * Get by Key.
         */


        Store$1.prototype.get = function (key) {
            try {
                var str = this.engine.getItem(this._createValidKey(key));

                if (str === null) {
                    return null;
                }

                return json.parse(str);
            } catch (err) {
                return null;
            }
        };
        /**
         * Get original engine
         */


        Store$1.prototype.getOriginalEngine = function () {
            return this.originalEngine;
        };
        /**
         * Remove by Key.
         */


        Store$1.prototype.remove = function (key) {
            this.engine.removeItem(this._createValidKey(key));
        };
        /**
         * Ensure the key is valid
         */


        Store$1.prototype._createValidKey = function (key) {
            var name = this.name;
            var id = this.id;
            if (!keys(this.keys).length) return [name, id, key].join('.'); // validate and return undefined if invalid key

            var compoundKey;
            each$2(function (value) {
                if (value === key) {
                    compoundKey = [name, id, key].join('.');
                }
            }, this.keys);
            return compoundKey;
        };
        /**
         * Switch to inMemoryEngine, bringing any existing data with.
         */


        Store$1.prototype._swapEngine = function () {
            var self = this; // grab existing data, but only for this page's queue instance, not all
            // better to keep other queues in localstorage to be flushed later
            // than to pull them into memory and remove them from durable storage

            each$2(function (key) {
                var value = self.get(key);
                inMemoryEngine.setItem([self.name, self.id, key].join('.'), value);
                self.remove(key);
            }, this.keys);
            this.engine = inMemoryEngine;
        };

        var store = Store$1;

        function isQuotaExceeded(e) {
            var quotaExceeded = false;

            if (e.code) {
                switch (e.code) {
                    case 22:
                        quotaExceeded = true;
                        break;

                    case 1014:
                        // Firefox
                        if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                            quotaExceeded = true;
                        }

                        break;
                }
            } else if (e.number === -2147024882) {
                // Internet Explorer 8
                quotaExceeded = true;
            }

            return quotaExceeded;
        }

        var each$1 = each_1;
        var CLOCK_LATE_FACTOR = 2;
        var defaultClock = {
            setTimeout: function setTimeout(fn, ms) {
                return window.setTimeout(fn, ms);
            },
            clearTimeout: function clearTimeout(id) {
                return window.clearTimeout(id);
            },
            Date: window.Date
        };
        var clock = defaultClock;
        var modes = {
            ASAP: 1,
            RESCHEDULE: 2,
            ABANDON: 3
        };

        function Schedule$1() {
            this.tasks = {};
            this.nextId = 1;
        }

        Schedule$1.prototype.now = function () {
            return +new clock.Date();
        };

        Schedule$1.prototype.run = function (task, timeout, mode) {
            var id = this.nextId++;
            this.tasks[id] = clock.setTimeout(this._handle(id, task, timeout, mode || modes.ASAP), timeout);
            return id;
        };

        Schedule$1.prototype.cancel = function (id) {
            if (this.tasks[id]) {
                clock.clearTimeout(this.tasks[id]);
                delete this.tasks[id];
            }
        };

        Schedule$1.prototype.cancelAll = function () {
            each$1(clock.clearTimeout, this.tasks);
            this.tasks = {};
        };

        Schedule$1.prototype._handle = function (id, callback, timeout, mode) {
            var self = this;
            var start = self.now();
            return function () {
                delete self.tasks[id];

                if (mode >= modes.RESCHEDULE && start + timeout * CLOCK_LATE_FACTOR < self.now()) {
                    if (mode === modes.RESCHEDULE) {
                        self.run(callback, timeout, mode);
                    }

                    return;
                }

                return callback();
            };
        };

        Schedule$1.setClock = function (newClock) {
            clock = newClock;
        };

        Schedule$1.resetClock = function () {
            clock = defaultClock;
        };

        Schedule$1.Modes = modes;
        var schedule = Schedule$1;

        /**
         * Expose `debug()` as the module.
         */

        var debug_1 = debug$1;

        /**
         * Create a debugger with the given `name`.
         *
         * @param {String} name
         * @return {Type}
         * @api public
         */

        function debug$1(name) {
            if (!debug$1.enabled(name)) return function () {
            };
            return function (fmt) {
                fmt = coerce(fmt);
                var curr = new Date();
                var ms = curr - (debug$1[name] || curr);
                debug$1[name] = curr;
                fmt = name + ' ' + fmt + ' +' + debug$1.humanize(ms); // This hackery is required for IE8
                // where `console.log` doesn't have 'apply'

                window.console && console.log && Function.prototype.apply.call(console.log, console, arguments);
            };
        }

        /**
         * The currently active debug mode names.
         */


        debug$1.names = [];
        debug$1.skips = [];
        /**
         * Enables a debug mode by name. This can include modes
         * separated by a colon and wildcards.
         *
         * @param {String} name
         * @api public
         */

        debug$1.enable = function (name) {
            try {
                localStorage.debug = name;
            } catch (e) {
            }

            var split = (name || '').split(/[\s,]+/),
                len = split.length;

            for (var i = 0; i < len; i++) {
                name = split[i].replace('*', '.*?');

                if (name[0] === '-') {
                    debug$1.skips.push(new RegExp('^' + name.substr(1) + '$'));
                } else {
                    debug$1.names.push(new RegExp('^' + name + '$'));
                }
            }
        };
        /**
         * Disable debug output.
         *
         * @api public
         */


        debug$1.disable = function () {
            debug$1.enable('');
        };
        /**
         * Humanize the given `ms`.
         *
         * @param {Number} m
         * @return {String}
         * @api private
         */


        debug$1.humanize = function (ms) {
            var sec = 1000,
                min = 60 * 1000,
                hour = 60 * min;
            if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
            if (ms >= min) return (ms / min).toFixed(1) + 'm';
            if (ms >= sec) return (ms / sec | 0) + 's';
            return ms + 'ms';
        };
        /**
         * Returns true if the given mode name is enabled, false otherwise.
         *
         * @param {String} name
         * @return {Boolean}
         * @api public
         */


        debug$1.enabled = function (name) {
            for (var i = 0, len = debug$1.skips.length; i < len; i++) {
                if (debug$1.skips[i].test(name)) {
                    return false;
                }
            }

            for (var i = 0, len = debug$1.names.length; i < len; i++) {
                if (debug$1.names[i].test(name)) {
                    return true;
                }
            }

            return false;
        };

        /**
         * Coerce `val`.
         */


        function coerce(val) {
            if (val instanceof Error) return val.stack || val.message;
            return val;
        } // persist


        try {
            if (window.localStorage) debug$1.enable(localStorage.debug);
        } catch (e) {
        }

        var uuid = dist.v4;
        var Store = store;
        var each = each_1;
        var Schedule = schedule;
        var debug = debug_1('localstorage-retry');
        var Emitter = componentEmitter.exports; // Some browsers don't support Function.prototype.bind, so just including a simplified version here

        function bind(func, obj) {
            return function () {
                return func.apply(obj, arguments);
            };
        }

        /**
         * @callback processFunc
         * @param {Mixed} item The item added to the queue to process
         * @param {Function} done A function to call when processing is completed.
         *   @param {Error} Optional error parameter if the processing failed
         *   @param {Response} Optional response parameter to emit for async handling
         */

        /**
         * Constructs a Queue backed by localStorage
         *
         * @constructor
         * @param {String} name The name of the queue. Will be used to find abandoned queues and retry their items
         * @param {Object} [opts] Optional argument to override `maxItems`, `maxAttempts`, `minRetryDelay, `maxRetryDelay`, `backoffFactor` and `backoffJitter`.
         * @param {processFunc} fn The function to call in order to process an item added to the queue
         */


        function Queue(name, opts, fn) {
            if (typeof opts === 'function') fn = opts;
            this.name = name;
            this.id = uuid();
            this.fn = fn;
            this.maxItems = opts.maxItems || Infinity;
            this.maxAttempts = opts.maxAttempts || Infinity;
            this.backoff = {
                MIN_RETRY_DELAY: opts.minRetryDelay || 1000,
                MAX_RETRY_DELAY: opts.maxRetryDelay || 30000,
                FACTOR: opts.backoffFactor || 2,
                JITTER: opts.backoffJitter || 0
            }; // painstakingly tuned. that's why they're not "easily" configurable

            this.timeouts = {
                ACK_TIMER: 1000,
                RECLAIM_TIMER: 3000,
                RECLAIM_TIMEOUT: 10000,
                RECLAIM_WAIT: 500
            };
            this.keys = {
                IN_PROGRESS: 'inProgress',
                QUEUE: 'queue',
                RECLAIM_START: 'reclaimStart',
                RECLAIM_END: 'reclaimEnd',
                ACK: 'ack'
            };
            this._schedule = new Schedule();
            this._processId = 0; // Set up our empty queues

            this._store = new Store(this.name, this.id, this.keys);

            this._store.set(this.keys.IN_PROGRESS, {});

            this._store.set(this.keys.QUEUE, []); // bind recurring tasks for ease of use


            this._ack = bind(this._ack, this);
            this._checkReclaim = bind(this._checkReclaim, this);
            this._processHead = bind(this._processHead, this);
            this._running = false;
        }

        /**
         * Mix in event emitter
         */


        Emitter(Queue.prototype);
        /**
         * Starts processing the queue
         */

        Queue.prototype.start = function () {
            if (this._running) {
                this.stop();
            }

            this._running = true;

            this._ack();

            this._checkReclaim();

            this._processHead();
        };
        /**
         * Stops processing the queue
         */


        Queue.prototype.stop = function () {
            this._schedule.cancelAll();

            this._running = false;
        };
        /**
         * Decides whether to retry. Overridable.
         *
         * @param {Object} item The item being processed
         * @param {Number} attemptNumber The attemptNumber (1 for first retry)
         * @param {Error} error The error from previous attempt, if there was one
         * @return {Boolean} Whether to requeue the message
         */


        Queue.prototype.shouldRetry = function (_, attemptNumber) {
            if (attemptNumber > this.maxAttempts) return false;
            return true;
        };
        /**
         * Calculates the delay (in ms) for a retry attempt
         *
         * @param {Number} attemptNumber The attemptNumber (1 for first retry)
         * @return {Number} The delay in milliseconds to wait before attempting a retry
         */


        Queue.prototype.getDelay = function (attemptNumber) {
            var ms = this.backoff.MIN_RETRY_DELAY * Math.pow(this.backoff.FACTOR, attemptNumber);

            if (this.backoff.JITTER) {
                var rand = Math.random();
                var deviation = Math.floor(rand * this.backoff.JITTER * ms);

                if (Math.floor(rand * 10) < 5) {
                    ms -= deviation;
                } else {
                    ms += deviation;
                }
            }

            return Number(Math.min(ms, this.backoff.MAX_RETRY_DELAY).toPrecision(1));
        };
        /**
         * Adds an item to the queue
         *
         * @param {Mixed} item The item to process
         */


        Queue.prototype.addItem = function (item) {
            this._enqueue({
                item: item,
                attemptNumber: 0,
                time: this._schedule.now(),
                id: uuid()
            });
        };
        /**
         * Adds an item to the retry queue
         *
         * @param {Mixed} item The item to retry
         * @param {Number} attemptNumber The attempt number (1 for first retry)
         * @param {Error} [error] The error from previous attempt, if there was one
         * @param {String} [id] The id of the queued message used for tracking duplicate entries
         */


        Queue.prototype.requeue = function (item, attemptNumber, error, id) {
            if (this.shouldRetry(item, attemptNumber, error)) {
                this._enqueue({
                    item: item,
                    attemptNumber: attemptNumber,
                    time: this._schedule.now() + this.getDelay(attemptNumber),
                    id: id || uuid()
                });
            } else {
                this.emit('discard', item, attemptNumber);
            }
        };

        Queue.prototype._enqueue = function (entry) {
            var queue = this._store.get(this.keys.QUEUE) || [];
            queue = queue.slice(-(this.maxItems - 1));
            queue.push(entry);
            queue = queue.sort(function (a, b) {
                return a.time - b.time;
            });

            this._store.set(this.keys.QUEUE, queue);

            if (this._running) {
                this._processHead();
            }
        };

        Queue.prototype._processHead = function () {
            var self = this;
            var store = this._store; // cancel the scheduled task if it exists

            this._schedule.cancel(this._processId); // Pop the head off the queue


            var queue = store.get(this.keys.QUEUE) || [];
            var inProgress = store.get(this.keys.IN_PROGRESS) || {};

            var now = this._schedule.now();

            var toRun = [];

            function enqueue(el, id) {
                toRun.push({
                    item: el.item,
                    done: function handle(err, res) {
                        var inProgress = store.get(self.keys.IN_PROGRESS) || {};
                        delete inProgress[id];
                        store.set(self.keys.IN_PROGRESS, inProgress);
                        self.emit('processed', err, res, el.item);

                        if (err) {
                            self.requeue(el.item, el.attemptNumber + 1, err, el.id);
                        }
                    }
                });
            }

            var inProgressSize = Object.keys(inProgress).length;

            while (queue.length && queue[0].time <= now && inProgressSize++ < self.maxItems) {
                var el = queue.shift();
                var id = uuid(); // Save this to the in progress map

                inProgress[id] = {
                    item: el.item,
                    attemptNumber: el.attemptNumber,
                    time: self._schedule.now()
                };
                enqueue(el, id);
            }

            store.set(this.keys.QUEUE, queue);
            store.set(this.keys.IN_PROGRESS, inProgress);
            each(function (el) {
                // TODO: handle fn timeout
                try {
                    self.fn(el.item, el.done);
                } catch (err) {
                    debug('Process function threw error: ' + err);
                }
            }, toRun); // re-read the queue in case the process function finished immediately or added another item

            queue = store.get(this.keys.QUEUE) || [];

            this._schedule.cancel(this._processId);

            if (queue.length > 0) {
                this._processId = this._schedule.run(this._processHead, queue[0].time - now, Schedule.Modes.ASAP);
            }
        }; // Ack continuously to prevent other tabs from claiming our queue


        Queue.prototype._ack = function () {
            this._store.set(this.keys.ACK, this._schedule.now());

            this._store.set(this.keys.RECLAIM_START, null);

            this._store.set(this.keys.RECLAIM_END, null);

            this._schedule.run(this._ack, this.timeouts.ACK_TIMER, Schedule.Modes.ASAP);
        };

        Queue.prototype._checkReclaim = function () {
            var self = this;

            function tryReclaim(store) {
                store.set(self.keys.RECLAIM_START, self.id);
                store.set(self.keys.ACK, self._schedule.now());

                self._schedule.run(function () {
                    if (store.get(self.keys.RECLAIM_START) !== self.id) return;
                    store.set(self.keys.RECLAIM_END, self.id);

                    self._schedule.run(function () {
                        if (store.get(self.keys.RECLAIM_END) !== self.id) return;
                        if (store.get(self.keys.RECLAIM_START) !== self.id) return;

                        self._reclaim(store.id);
                    }, self.timeouts.RECLAIM_WAIT, Schedule.Modes.ABANDON);
                }, self.timeouts.RECLAIM_WAIT, Schedule.Modes.ABANDON);
            }

            function findOtherQueues(name) {
                var res = [];

                var storage = self._store.getOriginalEngine();

                for (var i = 0; i < storage.length; i++) {
                    var k = storage.key(i);
                    var parts = k.split('.');
                    if (parts.length !== 3) continue;
                    if (parts[0] !== name) continue;
                    if (parts[2] !== 'ack') continue;
                    res.push(new Store(name, parts[1], self.keys));
                }

                return res;
            }

            each(function (store) {
                if (store.id === self.id) return;
                if (self._schedule.now() - store.get(self.keys.ACK) < self.timeouts.RECLAIM_TIMEOUT) return;
                tryReclaim(store);
            }, findOtherQueues(this.name));

            this._schedule.run(this._checkReclaim, this.timeouts.RECLAIM_TIMER, Schedule.Modes.RESCHEDULE);
        };

        Queue.prototype._reclaim = function (id) {
            var self = this;
            var other = new Store(this.name, id, this.keys);
            var our = {
                queue: this._store.get(this.keys.QUEUE) || []
            };
            var their = {
                inProgress: other.get(this.keys.IN_PROGRESS) || {},
                queue: other.get(this.keys.QUEUE) || []
            };
            var trackMessageIds = [];

            var addConcatQueue = function addConcatQueue(queue, incrementAttemptNumberBy) {
                each(function (el) {
                    var id = el.id || uuid();

                    if (trackMessageIds.indexOf(id) >= 0) {
                        self.emit('duplication', el.item, el.attemptNumber);
                    } else {
                        our.queue.push({
                            item: el.item,
                            attemptNumber: el.attemptNumber + incrementAttemptNumberBy,
                            time: self._schedule.now(),
                            id: id
                        });
                        trackMessageIds.push(id);
                    }
                }, queue);
            }; // add their queue to ours, resetting run-time to immediate and copying the attempt#


            addConcatQueue(their.queue, 0); // if the queue is abandoned, all the in-progress are failed. retry them immediately and increment the attempt#

            addConcatQueue(their.inProgress, 1);
            our.queue = our.queue.sort(function (a, b) {
                return a.time - b.time;
            });

            this._store.set(this.keys.QUEUE, our.queue); // remove all keys


            other.remove(this.keys.IN_PROGRESS);
            other.remove(this.keys.QUEUE);
            other.remove(this.keys.RECLAIM_START);
            other.remove(this.keys.RECLAIM_END);
            other.remove(this.keys.ACK); // process the new items we claimed

            this._processHead();
        };

        var lib = Queue;

        var queueOptions = {
            maxRetryDelay: 360000,
            minRetryDelay: 1000,
            backoffFactor: 2,
            maxAttempts: 10,
            maxItems: 100
        };

        var XHRQueue = /*#__PURE__*/function () {
            function XHRQueue() {
                _classCallCheck(this, XHRQueue);

                this.url = '';
                this.writeKey = '';
            }

            _createClass(XHRQueue, [{
                key: "init",
                value: function init(writeKey, url, options) {
                    this.url = url;
                    this.writeKey = writeKey;

                    if (options) {
                        // TODO: add checks for value - has to be +ve?
                        _extends(queueOptions, options);
                    }

                    this.payloadQueue = new lib('rudder', queueOptions, function (item, done) {
                        // apply sentAt at flush time and reset on each retry
                        item.message.sentAt = getCurrentTimeFormatted(); // send this item for processing, with a callback to enable queue to get the done status
                        // eslint-disable-next-line no-use-before-define

                        this.processQueueElement(item.url, item.headers, item.message, 10 * 1000, // eslint-disable-next-line consistent-return
                            function (err, res) {
                                if (err) {
                                    return done(err);
                                }

                                done(null, res);
                            });
                    }.bind(this)); // start queue

                    this.payloadQueue.start();
                }
                /**
                 * the queue item proceesor
                 * @param {*} url to send requests to
                 * @param {*} headers
                 * @param {*} message
                 * @param {*} timeout
                 * @param {*} queueFn the function to call after request completion
                 */

            }, {
                key: "processQueueElement",
                value: function processQueueElement(url, headers, message, timeout, queueFn) {
                    try {
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', url, true);

                        for (var k in headers) {
                            xhr.setRequestHeader(k, headers[k]);
                        }

                        xhr.timeout = timeout;
                        xhr.ontimeout = queueFn;
                        xhr.onerror = queueFn;

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 429 || xhr.status >= 500 && xhr.status < 600) {
                                    handleError(new Error("request failed with status: ".concat(xhr.status).concat(xhr.statusText, " for url: ").concat(url)));
                                    queueFn(new Error("request failed with status: ".concat(xhr.status).concat(xhr.statusText, " for url: ").concat(url)));
                                } else {
                                    queueFn(null, xhr.status);
                                }
                            }
                        };

                        xhr.send(JSON.stringify(message, replacer));
                    } catch (error) {
                        queueFn(error);
                    }
                }
            }, {
                key: "enqueue",
                value: function enqueue(message, type) {
                    var headers = {
                        'Content-Type': 'application/json',
                        Authorization: "Basic ".concat(btoa("".concat(this.writeKey, ":"))),
                        AnonymousId: btoa(message.anonymousId)
                    }; // add items to the queue

                    this.payloadQueue.addItem({
                        url: "".concat(this.url, "/v1/").concat(type),
                        headers: headers,
                        message: message
                    });
                }
            }]);

            return XHRQueue;
        }();

        var defaults = {
            queue: 'queue',
            maxPayloadSize: 64 * 1000
        };

        var BeaconQueue = /*#__PURE__*/function () {
            function BeaconQueue() {
                _classCallCheck(this, BeaconQueue);

                this.storage = Store$2;
                this.maxItems = 10;
                this.flushQueueTimeOut = undefined;
                this.timeOutActive = false;
                this.flushQueueTimeOutInterval = 1000 * 60 * 10; // 10 mins

                this.url = '';
                this.writekey = '';
                this.queueName = "".concat(defaults.queue, ".").concat(Date.now());
            }

            _createClass(BeaconQueue, [{
                key: "sendQueueDataForBeacon",
                value: function sendQueueDataForBeacon() {
                    this.sendDataFromQueueAndDestroyQueue();
                }
            }, {
                key: "init",
                value: function init(writekey, url, options) {
                    this.url = url;
                    this.writekey = writekey;
                    if (options.maxItems) this.maxItems = options.maxItems;
                    if (options.flushQueueInterval) this.flushQueueTimeOutInterval = options.flushQueueInterval;
                    var sendQueueData = this.sendQueueDataForBeacon.bind(this);
                    window.addEventListener('unload', sendQueueData);
                }
            }, {
                key: "getQueue",
                value: function getQueue() {
                    return this.storage.get(this.queueName);
                }
            }, {
                key: "setQueue",
                value: function setQueue(value) {
                    this.storage.set(this.queueName, value);
                }
            }, {
                key: "enqueue",
                value: function enqueue(message) {
                    var queue = this.getQueue() || [];
                    queue = queue.slice(-(this.maxItems - 1));
                    queue.push(message);
                    var batch = queue.slice(0);
                    var data = {
                        batch: batch
                    };
                    var dataToSend = JSON.stringify(data, replacer);

                    if (dataToSend.length > defaults.maxPayloadSize) {
                        batch = queue.slice(0, queue.length - 1);
                        this.flushQueue(batch);
                        queue = this.getQueue();
                        queue.push(message);
                    }

                    this.setQueue(queue);
                    this.setTimer();

                    if (queue.length === this.maxItems) {
                        this.flushQueue(batch);
                    }
                }
            }, {
                key: "sendDataFromQueueAndDestroyQueue",
                value: function sendDataFromQueueAndDestroyQueue() {
                    this.sendDataFromQueue();
                    this.storage.remove(this.queueName);
                }
            }, {
                key: "sendDataFromQueue",
                value: function sendDataFromQueue() {
                    var queue = this.getQueue();

                    if (queue && queue.length > 0) {
                        var batch = queue.slice(0, queue.length);
                        this.flushQueue(batch);
                    }
                }
            }, {
                key: "flushQueue",
                value: function flushQueue(batch) {
                    batch.forEach(function (event) {
                        event.sentAt = new Date().toISOString();
                    });
                    var data = {
                        batch: batch
                    };
                    var payload = JSON.stringify(data, replacer);
                    var blob = new Blob([payload], {
                        type: 'text/plain'
                    });
                    var isPushed = navigator.sendBeacon("".concat(this.url, "?writeKey=").concat(this.writekey), blob);

                    if (!isPushed) {
                        handleError(new Error("Unable to queue data to browser's beacon queue"));
                    }

                    this.setQueue([]);
                    this.clearTimer();
                }
            }, {
                key: "setTimer",
                value: function setTimer() {
                    if (!this.timeOutActive) {
                        this.flushQueueTimeOut = setTimeout(this.sendDataFromQueue.bind(this), this.flushQueueTimeOutInterval);
                        this.timeOutActive = true;
                    }
                }
            }, {
                key: "clearTimer",
                value: function clearTimer() {
                    if (this.timeOutActive) {
                        clearTimeout(this.flushQueueTimeOut);
                        this.timeOutActive = false;
                    }
                }
            }]);

            return BeaconQueue;
        }();

        var MESSAGE_LENGTH = 32 * 1000; // ~32 Kb

        /**
         *
         * @class EventRepository responsible for adding events into
         * flush queue and sending data to rudder backend
         * in batch and maintains order of the event.
         */

        var EventRepository = /*#__PURE__*/function () {
            /**
             *Creates an instance of EventRepository.
             * @memberof EventRepository
             */
            function EventRepository() {
                _classCallCheck(this, EventRepository);

                this.queue = undefined;
            }

            _createClass(EventRepository, [{
                key: "initialize",
                value: function initialize(writeKey, url, options) {
                    var queueOptions = {};
                    var targetUrl = removeTrailingSlashes(url);

                    if (options && options.useBeacon && navigator.sendBeacon) {
                        if (options && options.beaconQueueOptions && options.beaconQueueOptions != null && _typeof(options.beaconQueueOptions) === 'object') {
                            queueOptions = options.beaconQueueOptions;
                        }

                        targetUrl = "".concat(targetUrl, "/beacon/v1/batch");
                        this.queue = new BeaconQueue();
                    } else {
                        if (options && options.useBeacon) {
                            logger.info('[EventRepository] sendBeacon feature not available in this browser :: fallback to XHR');
                        }

                        if (options && options.queueOptions && options.queueOptions != null && _typeof(options.queueOptions) === 'object') {
                            queueOptions = options.queueOptions;
                        }

                        this.queue = new XHRQueue();
                    }

                    this.queue.init(writeKey, targetUrl, queueOptions);
                }
                /**
                 *
                 *
                 * @param {RudderElement} rudderElement
                 * @memberof EventRepository
                 */

            }, {
                key: "enqueue",
                value: function enqueue(rudderElement, type) {
                    var message = rudderElement.getElementContent();
                    message.originalTimestamp = message.originalTimestamp || getCurrentTimeFormatted();
                    message.sentAt = getCurrentTimeFormatted(); // add this, will get modified when actually being sent
                    // check message size, if greater log an error

                    if (JSON.stringify(message, replacer).length > MESSAGE_LENGTH) {
                        logger.error('[EventRepository] enqueue:: message length greater 32 Kb ', message);
                    }

                    this.queue.enqueue(message, type);
                }
            }]);

            return EventRepository;
        }();

        var eventRepository = new EventRepository();

        /* eslint-disable no-bitwise */

        /**
         * @description This is utility function for crc32 algorithm
         * @version v1.0.0
         */

        /**
         * @description generate crc table
         * @params none
         * @returns array of CRC table
         */
        var makeCRCTable = function makeCRCTable() {
            var crcTable = [];
            var c;

            for (var n = 0; n < 256; n++) {
                c = n;

                for (var k = 0; k < 8; k++) {
                    c = c & 1 ? 0xedb88320 ^ c >>> 1 : c >>> 1;
                }

                crcTable[n] = c;
            }

            return crcTable;
        };
        /**
         *
         * @param {string} str
         * @returns {Bytestream} crc32
         */


        var crc32 = function crc32(str) {
            var crcTable = makeCRCTable();
            var crc = 0 ^ -1;

            for (var i = 0; i < str.length; i++) {
                crc = crc >>> 8 ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xff];
            }

            return (crc ^ -1) >>> 0;
        };

        /**
         * @description An interface to fetch user device details.
         * @version v1.0.0
         */
        var USER_INTERFACE = {
            /**
             * @param {*} req
             * @returns {string} user language
             */
            getUserLanguage: function getUserLanguage() {
                return navigator && navigator.language;
            },

            /**
             * @param {*} req
             * @returns {string} userAgent
             */
            getUserAgent: function getUserAgent() {
                return navigator && navigator.userAgent;
            }
        };

        /**
         * @description This is utility function for decoding from base 64 to utf8
         * @version v1.0.0
         */

        /**
         * @param {string} str base64
         * @returns {string} utf8
         */
        function b64DecodeUnicode(str) {
            // Going backwards: from bytestream, to percent-encoding, to original string.
            return decodeURIComponent(atob(str).split('').map(function (c) {
                return "%".concat("00".concat(c.charCodeAt(0).toString(16)).slice(-2));
            }).join(''));
        }

        /**
         * @param {string} value
         * @return {string}
         */


        function decode() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            data = data.endsWith('..') ? data.substr(0, data.length - 2) : data;
            return b64DecodeUnicode(data);
        }

        /**
         * @description AMP Linker Parser (works for Rudder, GA or any other linker created by following Google's linker standard.)
         * @version v1.0.0
         * @author Parth Mahajan, Ayush Mehra
         */
        var KEY_VALIDATOR = /^[a-zA-Z0-9\-_.]+$/;
        var CHECKSUM_OFFSET_MAX_MIN = 1;
        var VALID_VERSION = 1;
        var DELIMITER = '*';

        /**
         * Parse the linker param value to version checksum and serializedParams
         * @param {string} value
         * @return {?Object}
         */

        function parseLinkerParamValue(value) {
            var parts = value.split(DELIMITER);
            var isEven = parts.length % 2 === 0;

            if (parts.length < 4 || !isEven) {
                // Format <version>*<checksum>*<key1>*<value1>
                // Note: linker makes sure there's at least one pair of non empty key value
                // Make sure there is at least three delimiters.
                return null;
            }

            var version = Number(parts.shift());

            if (version !== VALID_VERSION) {
                return null;
            }

            var checksum = parts.shift();
            var serializedIds = parts.join(DELIMITER);
            return {
                checksum: checksum,
                serializedIds: serializedIds
            };
        }

        /**
         * Deserialize the serializedIds and return keyValue pairs.
         * @param {string} serializedIds
         * @return {!Object<string, string>}
         */


        function deserialize(serializedIds) {
            var keyValuePairs = {};
            var params = serializedIds.split(DELIMITER);

            for (var i = 0; i < params.length; i += 2) {
                var key = params[i];
                var valid = KEY_VALIDATOR.test(key);

                if (valid) {
                    var value = decode(params[i + 1]); // const value = params[i + 1];

                    keyValuePairs[key] = value;
                }
            }

            return keyValuePairs;
        }

        /**
         * Generates a semi-unique value for page visitor.
         * @return {string}
         */


        function getFingerprint(userAgent, language) {
            var date = new Date();
            var timezone = date.getTimezoneOffset();
            return [userAgent, timezone, language].join(DELIMITER);
        }

        /**
         * Rounded time used to check if t2 - t1 is within our time tolerance.
         * @return {number}
         */


        function getMinSinceEpoch() {
            // Timestamp in minutes, floored.
            return Math.floor(Date.now() / 60000);
        }

        /**
         * Create a unique checksum hashing the fingerprint and a few other values.
         * @param {string} serializedIds
         * @param {number=} optOffsetMin
         * @return {string}
         */


        function getCheckSum(serializedIds, optOffsetMin, userAgent, language) {
            var fingerprint = getFingerprint(userAgent, language);
            var offset = optOffsetMin || 0;
            var timestamp = getMinSinceEpoch() - offset;
            var crc = crc32([fingerprint, timestamp, serializedIds].join(DELIMITER)); // Encoded to base36 for less bytes.

            return crc.toString(36);
        }

        /**
         * Check if the checksum is valid with time offset tolerance.
         * @param {string} serializedIds
         * @param {string} checksum
         * @return {boolean}
         */


        function isCheckSumValid(serializedIds, checksum) {
            var userAgent = USER_INTERFACE.getUserAgent();
            var language = USER_INTERFACE.getUserLanguage();

            for (var i = 0; i <= CHECKSUM_OFFSET_MAX_MIN; i += 1) {
                var calculateCheckSum = getCheckSum(serializedIds, i, userAgent, language);

                if (calculateCheckSum === checksum) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Return the key value pairs
         * @param {string} value
         * @return {?Object<string, string>}
         */


        function parseLinker(value) {
            var linkerObj = parseLinkerParamValue(value);

            if (!linkerObj) {
                return null;
            }

            var checksum = linkerObj.checksum,
                serializedIds = linkerObj.serializedIds;

            if (!isCheckSumValid(serializedIds, checksum)) {
                return null;
            }

            return deserialize(serializedIds);
        }

        // map b/w the names of integrations coming from config plane to
        // integration module names
        var configToIntNames = {
            HS: 'HubSpot',
            GA: 'GA',
            HOTJAR: 'Hotjar',
            GOOGLEADS: 'GoogleAds',
            VWO: 'VWO',
            GTM: 'GoogleTagManager',
            BRAZE: 'Braze',
            INTERCOM: 'INTERCOM',
            KEEN: 'Keen',
            KISSMETRICS: 'Kissmetrics',
            CUSTOMERIO: 'CustomerIO',
            CHARTBEAT: 'Chartbeat',
            COMSCORE: 'Comscore',
            FACEBOOK_PIXEL: 'FacebookPixel',
            LOTAME: 'Lotame',
            OPTIMIZELY: 'Optimizely',
            BUGSNAG: 'Bugsnag',
            FULLSTORY: 'Fullstory',
            TVSQUARED: 'TVSquared',
            GA4: 'GA4',
            MOENGAGE: 'MoEngage',
            AM: 'Amplitude',
            PENDO: 'Pendo',
            LYTICS: 'Lytics',
            APPCUES: 'Appcues',
            POSTHOG: 'Posthog',
            KLAVIYO: 'Klaviyo',
            CLEVERTAP: 'Clevertap',
            BINGADS: 'BingAds',
            PINTEREST_TAG: 'PinterestTag',
            ADOBE_ANALYTICS: 'AdobeAnalytics',
            LINKEDIN_INSIGHT_TAG: 'LinkedInInsightTag',
            REDDIT_PIXEL: 'RedditPixel',
            DRIP: 'Drip',
            HEAP: 'Heap',
            CRITEO: 'Criteo',
            MP: 'Mixpanel',
            QUALTRICS: 'Qualtrics',
            PROFITWELL: 'ProfitWell',
            SENTRY: 'Sentry',
            QUANTUMMETRIC: 'QuantumMetric',
            SNAP_PIXEL: 'SnapPixel',
            POST_AFFILIATE_PRO: 'PostAffiliatePro',
            GOOGLE_OPTIMIZE: 'GoogleOptimize',
            LAUNCHDARKLY: 'LaunchDarkly',
            GA360: 'GA360',
            ADROLL: 'Adroll',
            DCM_FLOODLIGHT: 'DCMFloodlight',
            MATOMO: 'Matomo',
            VERO: 'Vero',
            MOUSEFLOW: 'Mouseflow',
            ROCKERBOX: 'Rockerbox',
            CONVERTFLOW: 'ConvertFlow',
            SNAPENGAGE: 'SnapEngage',
            LIVECHAT: 'LiveChat',
            SHYNET: 'Shynet',
            WOOPRA: 'Woopra',
            ROLLBAR: 'RollBar',
            QUORA_PIXEL: 'QuoraPixel'
        };

        /* eslint-disable class-methods-use-this */

        var OneTrust = /*#__PURE__*/function () {
            function OneTrust() {
                var _this = this;

                _classCallCheck(this, OneTrust);

                // If user does not load onetrust sdk before loading rudderstack sdk
                // we will not be filtering any of the destinations.
                if (!window.OneTrust || !window.OnetrustActiveGroups) {
                    throw new Error('OneTrust resources are not accessible. Thus all the destinations will be loaded');
                } // OneTrust Cookie Compliance populates a data layer object OnetrustActiveGroups with
                // the cookie categories that the user has consented to.
                // Eg: ',C0001,C0003,'
                // We split it and save it as an array.


                var userSetConsentGroupIds = window.OnetrustActiveGroups.split(','); // Ids user has consented
                // Get information about the cookie script - data includes, consent models, cookies in preference centre, etc.
                // We get the groups(cookie categorization), user has created in one trust account.

                var oneTrustAllGroupsInfo = window.OneTrust.GetDomainData().Groups;
                this.userSetConsentGroupNames = []; // Get the names of the cookies consented by the user in the browser.

                oneTrustAllGroupsInfo.forEach(function (group) {
                    var CustomGroupId = group.CustomGroupId,
                        GroupName = group.GroupName;

                    if (userSetConsentGroupIds.includes(CustomGroupId)) {
                        _this.userSetConsentGroupNames.push(GroupName.toUpperCase().trim());
                    }
                });
            }

            _createClass(OneTrust, [{
                key: "isEnabled",
                value: function isEnabled(destConfig) {
                    var _this2 = this;

                    try {
                        /**
                         * Structure of onetrust consent group destination config.
                         *
                         * "oneTrustConsentGroup": [
                         {
                                "oneTrustConsentGroup": "Performance Cookies"
                            },
                         {
                                "oneTrustConsentGroup": "Functional Cookies"
                            },
                         {
                                "oneTrustConsentGroup": ""
                            }
                         ]
                         *
                         */
                        var oneTrustCookieCategories = destConfig.oneTrustCookieCategories; // mapping of the destination with the consent group name
                        // If the destination do not have this mapping events will be sent.

                        if (!oneTrustCookieCategories) {
                            return true;
                        } // Change the structure of oneTrustConsentGroup as an array and filter values if empty string
                        // Eg:
                        // ["Performance Cookies", "Functional Cookies"]


                        var oneTrustConsentGroupArr = oneTrustCookieCategories.map(function (c) {
                            return c.oneTrustCookieCategory;
                        }).filter(function (n) {
                            return n;
                        });
                        var containsAllConsent = true; // Check if all the destination's mapped cookie categories are consented by the user in the browser.

                        containsAllConsent = oneTrustConsentGroupArr.every(function (element) {
                            return _this2.userSetConsentGroupNames.includes(element.toUpperCase().trim());
                        });
                        return containsAllConsent;
                    } catch (e) {
                        logger.error("Error during onetrust cookie consent management ".concat(e));
                        return true;
                    }
                }
            }]);

            return OneTrust;
        }();

        var CookieConsentFactory = /*#__PURE__*/function () {
            function CookieConsentFactory() {
                _classCallCheck(this, CookieConsentFactory);
            }

            _createClass(CookieConsentFactory, null, [{
                key: "initialize",
                value: function initialize(cookieConsentOptions) {
                    var _cookieConsentOptions;

                    /**
                     *
                     * check which type of cookie consent manager needs to be called if enabled
                     * for now we have only OneTrust.
                     * But if new cookie consent manager options are implemented,
                     * we need to make sure only one of them is enabled by the user in the
                     * load options
                     *
                     */
                    if (cookieConsentOptions !== null && cookieConsentOptions !== void 0 && (_cookieConsentOptions = cookieConsentOptions.oneTrust) !== null && _cookieConsentOptions !== void 0 && _cookieConsentOptions.enabled) {
                        // This is P1. When we have an ui in source side to turn on/off of cookie consent
                        // if (sourceConfig &&
                        //     sourceConfig.cookieConsentManager &&
                        // sourceConfig.cookieConsentManager.oneTrust &&
                        // sourceConfig.cookieConsentManager.oneTrustenabled) {
                        return new OneTrust(); // }
                    }

                    return null;
                }
            }]);

            return CookieConsentFactory;
        }();

        var META_DATA = {
            SDK: {
                name: 'JS',
                installType: 'npm'
            }
        }; // This API key token is parsed in the CI pipeline

        var API_KEY = '{{RS_BUGSNAG_API_KEY}}'; // Errors only from Below SDKs are allowed to reach Bugsnag

        var SDK_FILE_NAMES = ['rudder-analytics.min.js'].concat(_toConsumableArray(Object.keys(configToIntNames).map(function (intgName) {
            return "".concat(configToIntNames[intgName], ".min.js");
        })));
        /**
         * This function will load the Bugsnag native SDK through CDN
         * Once loaded it will be available in window.Bugsnag
         */

        var load$1 = function load() {
            var pluginName = 'bugsnag';

            if (!window.hasOwnProperty(pluginName)) {
                ScriptLoader(pluginName, 'https://d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js', {
                    isNonNativeSDK: 'true'
                });
            }
        };

        /**
         * This function is to initialize the bugsnag with apiKey, SDK meta data
         * and custom configuration for onError method.
         * After initialization Bugsnag instance will be available in window.rsBugsnagClient
         * @param {string} sourceId
         */


        function initClient(sourceId) {
            if (window.Bugsnag === undefined) return; // If the API key token is not parsed yet, don't proceed to initialize the client
            // This also prevents unnecessary errors sent to Bugsnag during development phase.

            var apiKeyRegex = /{{.+}}/;
            if (API_KEY.match(apiKeyRegex) !== null) return;
            var host = window.location.hostname;
            var devHosts = ['localhost', '127.0.0.1', '[::1]'];
            window.rsBugsnagClient = window.Bugsnag.start({
                apiKey: API_KEY,
                appVersion: '2.15.0',
                // Set SDK version as the app version
                metadata: META_DATA,
                onError: function onError(event) {
                    try {
                        var errorOrigin = getValue(event, 'errors.0.stacktrace.0.file'); // Skip errors that do not have a valid stack trace

                        if (!errorOrigin || typeof errorOrigin !== 'string') return false;
                        var srcFileName = errorOrigin.substring(errorOrigin.lastIndexOf('/') + 1);
                        if (!SDK_FILE_NAMES.includes(srcFileName)) // Discard the event if it's not originated at the SDK
                            return false;
                        event.addMetadata('source', {
                            sourceId: sourceId
                        });
                        var errMsg = event.errors[0].errorMessage;
                        event.context = errMsg; // Hack for easily grouping the script load errors
                        // on the dashboard

                        if (errMsg.includes('error in script loading')) event.context = 'Script load failures';
                        event.severity = 'error';
                        return true;
                    } catch (_unused) {
                        // Drop the error event if it couldn't be filtered as
                        // it is most likely a non-SDK error
                        return false;
                    }
                },
                autoTrackSessions: false,
                // auto tracking sessions is disabled
                collectUserIp: false,
                // collecting user's IP is disabled
                enabledBreadcrumbTypes: ['error', 'log', 'user'],
                maxEvents: 100,
                releaseStage: host && devHosts.includes(host) ? 'development' : 'production' // set the release stage

            });
        }

        /**
         * The responsibility of this function is to check Bugsnag native SDK
         * has been loaded or not in a certain interval.
         * If already loaded initialize the SDK.
         * @param {*} sourceId
         */


        var init = function init(sourceId) {
            if (window.hasOwnProperty('rsBugsnagClient')) return; // return if already initialized

            if (window.Bugsnag !== undefined) {
                initClient(sourceId);
            } else {
                // Check if Bugsnag is loaded every '100'ms
                var interval = setInterval(function () {
                    if (window.Bugsnag !== undefined) {
                        clearInterval(interval);
                        initClient(sourceId);
                    }
                }, 100);
                setTimeout(function () {
                    clearInterval(interval);
                }, MAX_WAIT_FOR_INTEGRATION_LOAD);
            }
        };

        var UserSession = /*#__PURE__*/function () {
            function UserSession() {
                _classCallCheck(this, UserSession);

                this.storage = Storage;
                this.timeout = DEFAULT_SESSION_TIMEOUT;
                this.sessionInfo = {
                    autoTrack: true
                };
            }

            /**
             * A function to initialize session information
             * @param {object} options    load call options
             */


            _createClass(UserSession, [{
                key: "initialize",
                value: function initialize(options) {
                    try {
                        var _options$sessions;

                        // Fetch session information from storage if any or initialize with an empty object
                        this.sessionInfo = this.storage.getSessionInfo() || this.sessionInfo;
                        /**
                         * By default this.autoTrack will be true
                         * Cases where this.autoTrack will be false:
                         * 1. User explicitly set autoTrack load option to false
                         * 2. When user is manually tracking the session
                         *
                         * Depending on the use case, this.autoTrack is set to true/false.
                         */

                        this.sessionInfo.autoTrack = !((options === null || options === void 0 ? void 0 : (_options$sessions = options.sessions) === null || _options$sessions === void 0 ? void 0 : _options$sessions.autoTrack) === false || this.sessionInfo.manualTrack);
                        /**
                         * Validate "timeout" input. Should be provided in milliseconds.
                         * Session timeout: By default, a session lasts until there's 30 minutes of inactivity,
                         * but you can configure this limit using "timeout" load option
                         */

                        if (options !== null && options !== void 0 && options.sessions && !isNaN(options.sessions.timeout)) {
                            var timeout = options.sessions.timeout; // In case user provides 0 as the timeout, auto session tracking will be disabled

                            if (timeout === 0) {
                                logger.warn('[Session]:: Provided timeout value 0 will disable the auto session tracking feature.');
                                this.sessionInfo.autoTrack = false;
                            } // In case user provides a setTimeout value greater than 0 but less than 10 seconds SDK will show a warning
                            // and will proceed with it


                            if (timeout > 0 && timeout < MIN_SESSION_TIMEOUT) {
                                logger.warn('[Session]:: It is not advised to set "timeout" less than 10 seconds');
                            }

                            this.timeout = timeout;
                        } // If auto session tracking is enabled start the session tracking


                        if (this.sessionInfo.autoTrack) {
                            this.startAutoTracking();
                        } else if (this.sessionInfo.autoTrack === false && !this.sessionInfo.manualTrack) {
                            /**
                             * Use case:
                             * By default user session is enabled which means storage will have session data.
                             * In case user wanted to opt out and set auto track to false through load option,
                             * clear stored session info.
                             */
                            this.end();
                        }
                    } catch (e) {
                        handleError(e);
                    }
                }
                /**
                 * A function to validate current session and return true/false depending on that
                 * @param {number} timestamp
                 * @returns boolean
                 */

            }, {
                key: "isValidSession",
                value: function isValidSession(timestamp) {
                    return timestamp <= this.sessionInfo.expiresAt;
                }
                /**
                 * A function to generate session id
                 * @returns number
                 */

            }, {
                key: "generateSessionId",
                value: function generateSessionId() {
                    return Date.now();
                }
                /**
                 * A function to check for existing session details and depending on that create a new session.
                 */

            }, {
                key: "startAutoTracking",
                value: function startAutoTracking() {
                    var timestamp = Date.now();

                    if (!this.isValidSession(timestamp)) {
                        this.sessionInfo = {};
                        this.sessionInfo.id = timestamp; // set the current timestamp

                        this.sessionInfo.expiresAt = timestamp + this.timeout; // set the expiry time of the session

                        this.sessionInfo.sessionStart = true;
                        this.sessionInfo.autoTrack = true;
                    }

                    this.storage.setSessionInfo(this.sessionInfo);
                }
                /**
                 * Function to validate user provided sessionId
                 * @param {number} sessionId
                 * @returns
                 */

            }, {
                key: "validateSessionId",
                value: function validateSessionId(sessionId) {
                    if (typeof sessionId !== 'number' || sessionId % 1 !== 0) {
                        logger.error("[Session]:: \"sessionId\" should only be a positive integer");
                        return;
                    }

                    if (countDigits(sessionId) < MIN_SESSION_ID_LENGTH) {
                        logger.error("[Session]:: \"sessionId\" should at least be \"".concat(MIN_SESSION_ID_LENGTH, "\" digits long"));
                        return;
                    }

                    return sessionId;
                }
                /**
                 * A public method to start a session
                 * @param {number} sessionId     session identifier
                 * @returns
                 */

            }, {
                key: "start",
                value: function start(id) {
                    var sessionId = id ? this.validateSessionId(id) : this.generateSessionId();
                    this.sessionInfo = {
                        id: sessionId || this.generateSessionId(),
                        sessionStart: true,
                        manualTrack: true
                    };
                    this.storage.setSessionInfo(this.sessionInfo);
                }
                /**
                 * A public method to end an ongoing session.
                 */

            }, {
                key: "end",
                value: function end() {
                    this.sessionInfo = {};
                    this.storage.removeSessionInfo();
                }
                /**
                 * A function get ongoing sessionId.
                 */

            }, {
                key: "getSessionInfo",
                value: function getSessionInfo() {
                    var session = {};

                    if (this.sessionInfo.autoTrack || this.sessionInfo.manualTrack) {
                        // renew or create a new auto-tracking session
                        if (this.sessionInfo.autoTrack) {
                            var timestamp = Date.now();

                            if (!this.isValidSession(timestamp)) {
                                this.startAutoTracking();
                            } else {
                                this.sessionInfo.expiresAt = timestamp + this.timeout; // set the expiry time of the session
                            }
                        }

                        if (this.sessionInfo.sessionStart) {
                            session.sessionStart = true;
                            this.sessionInfo.sessionStart = false;
                        }

                        session.sessionId = this.sessionInfo.id;
                        this.storage.setSessionInfo(this.sessionInfo);
                    }

                    return session;
                }
                /**
                 * Refresh session info on reset API call
                 */

            }, {
                key: "reset",
                value: function reset() {
                    var _this$sessionInfo = this.sessionInfo,
                        manualTrack = _this$sessionInfo.manualTrack,
                        autoTrack = _this$sessionInfo.autoTrack;

                    if (autoTrack) {
                        this.sessionInfo = {};
                        this.startAutoTracking();
                    } else if (manualTrack) {
                        this.start();
                    }
                }
            }]);

            return UserSession;
        }();

        var userSession = new UserSession();

        /**
         * class responsible for handling core
         * event tracking functionalities
         */

        var Analytics = /*#__PURE__*/function () {
            /**
             * Creates an instance of Analytics.
             * @memberof Analytics
             */
            function Analytics() {
                _classCallCheck(this, Analytics);

                this.initialized = false;
                this.clientIntegrations = [];
                this.loadOnlyIntegrations = {};
                this.clientIntegrationObjects = undefined;
                this.successfullyLoadedIntegration = [];
                this.failedToBeLoadedIntegration = [];
                this.toBeProcessedArray = [];
                this.toBeProcessedByIntegrationArray = [];
                this.storage = Storage;
                this.eventRepository = eventRepository;
                this.sendAdblockPage = false;
                this.sendAdblockPageOptions = {};
                this.clientSuppliedCallbacks = {}; // Array to store the callback functions registered in the ready API

                this.readyCallbacks = [];
                this.methodToCallbackMapping = {
                    syncPixel: 'syncPixelCallback'
                };
                this.loaded = false;
                this.loadIntegration = true;
                this.dynamicallyLoadedIntegrations = {};
                this.destSDKBaseURL = DEST_SDK_BASE_URL;
                this.cookieConsentOptions = {};
                this.logLevel = undefined; // flag to indicate client integrations` ready status

                this.clientIntegrationsReady = false;
                this.uSession = userSession;
            }

            /**
             * initialize the user after load config
             */


            _createClass(Analytics, [{
                key: "initializeUser",
                value: function initializeUser(anonymousIdOptions) {
                    // save once for storing older values to encrypted
                    this.userId = this.storage.getUserId() || '';
                    this.storage.setUserId(this.userId);
                    this.userTraits = this.storage.getUserTraits() || {};
                    this.storage.setUserTraits(this.userTraits);
                    this.groupId = this.storage.getGroupId() || '';
                    this.storage.setGroupId(this.groupId);
                    this.groupTraits = this.storage.getGroupTraits() || {};
                    this.storage.setGroupTraits(this.groupTraits);
                    this.anonymousId = this.getAnonymousId(anonymousIdOptions);
                    this.storage.setAnonymousId(this.anonymousId);
                }
            }, {
                key: "setInitialPageProperties",
                value: function setInitialPageProperties() {
                    if (this.storage.getInitialReferrer() == null && this.storage.getInitialReferringDomain() == null) {
                        var initialReferrer = getReferrer();
                        this.storage.setInitialReferrer(initialReferrer);
                        this.storage.setInitialReferringDomain(getReferringDomain(initialReferrer));
                    }
                }
            }, {
                key: "allModulesInitialized",
                value: function allModulesInitialized() {
                    var _this = this;

                    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                    return new Promise(function (resolve) {
                        if (_this.clientIntegrations.every(function (intg) {
                            return _this.dynamicallyLoadedIntegrations["".concat(configToIntNames[intg.name]).concat(INTG_SUFFIX)] != undefined;
                        })) {
                            // logger.debug(
                            //   "All integrations loaded dynamically",
                            //   this.dynamicallyLoadedIntegrations
                            // );
                            resolve(_this);
                        } else if (time >= 2 * MAX_WAIT_FOR_INTEGRATION_LOAD) {
                            // logger.debug("Max wait for dynamically loaded integrations over")
                            resolve(_this);
                        } else {
                            _this.pause(INTEGRATION_LOAD_CHECK_INTERVAL).then(function () {
                                // logger.debug("Check if all integration SDKs are loaded after pause")
                                return _this.allModulesInitialized(time + INTEGRATION_LOAD_CHECK_INTERVAL).then(resolve);
                            });
                        }
                    });
                }
                /**
                 * Function to execute the ready method callbacks
                 * @param {Analytics} self
                 */

            }, {
                key: "executeReadyCallback",
                value: function executeReadyCallback() {
                    this.readyCallbacks.forEach(function (callback) {
                        return callback();
                    });
                }
                /**
                 * A function to validate integration SDK is available in window
                 * and integration constructor is not undefined
                 * @param {string} pluginName
                 * @param {string} modName
                 * @returns boolean
                 */

            }, {
                key: "integrationSDKLoaded",
                value: function integrationSDKLoaded(pluginName, modName) {
                    try {
                        return window.hasOwnProperty(pluginName) && window[pluginName][modName] && typeof window[pluginName][modName].prototype.constructor !== 'undefined';
                    } catch (e) {
                        handleError(e);
                        return false;
                    }
                }
                /**
                 * Process the response from control plane and
                 * call initialize for integrations
                 *
                 * @param {*} status
                 * @param {*} response
                 * @memberof Analytics
                 */

            }, {
                key: "processResponse",
                value: function processResponse(status, responseVal) {
                    var _this2 = this;

                    try {
                        // logger.debug(`===in process response=== ${status}`);
                        var response = responseVal;

                        try {
                            if (typeof responseVal === 'string') {
                                response = JSON.parse(responseVal);
                            } // Do not proceed if the ultimate response value is not an object


                            if (!response || _typeof(response) !== 'object' || Array.isArray(response)) {
                                throw new Error('Invalid source configuration');
                            }
                        } catch (err) {
                            handleError(err);
                            return;
                        } // Fetch Error reporting enable option from sourceConfig


                        var isErrorReportEnabled = getValue(response.source.config, 'statsCollection.errorReports.enabled'); // Load Bugsnag only if it is enabled in the source config

                        if (isErrorReportEnabled === true) {
                            // Fetch the name of the Error reporter from sourceConfig
                            var provider = getValue(response.source.config, 'statsCollection.errorReports.provider') || DEFAULT_ERROR_REPORT_PROVIDER;

                            if (!ERROR_REPORT_PROVIDERS.includes(provider)) {
                                logger.error('Invalid error reporting provider value');
                            }

                            if (provider === 'bugsnag') {
                                // Load Bugsnag client SDK
                                load$1();
                                init(response.source.id);
                            }
                        }

                        response.source.destinations.forEach(function (destination, index) {
                            // logger.debug(
                            //   `Destination ${index} Enabled? ${destination.enabled} Type: ${destination.destinationDefinition.name} Use Native SDK? true`
                            // );
                            if (destination.enabled) {
                                this.clientIntegrations.push({
                                    name: destination.destinationDefinition.name,
                                    config: destination.config
                                });
                            }
                        }, this); // intersection of config-plane native sdk destinations with sdk load time destination list

                        this.clientIntegrations = findAllEnabledDestinations(this.loadOnlyIntegrations, this.clientIntegrations); // Check if cookie consent manager is being set through load options

                        if (Object.keys(this.cookieConsentOptions).length) {
                            // Call the cookie consent factory to initialise and return the type of cookie
                            // consent being set. For now we only support OneTrust.
                            try {
                                var cookieConsent = CookieConsentFactory.initialize(this.cookieConsentOptions); // If cookie consent object is return we filter according to consents given by user
                                // else we do not consider any filtering for cookie consent.

                                this.clientIntegrations = this.clientIntegrations.filter(function (intg) {
                                    return !cookieConsent || // check if cookieconsent object is present and then do filtering
                                        cookieConsent && cookieConsent.isEnabled(intg.config);
                                });
                            } catch (e) {
                                handleError(e);
                            }
                        }

                        var suffix = ''; // default suffix
                        // Get the CDN base URL is rudder staging url

                        var _getSDKUrlInfo = getSDKUrlInfo(),
                            isStaging = _getSDKUrlInfo.isStaging;

                        if (isStaging) {
                            suffix = '-staging'; // stagging suffix
                        }

                        leaveBreadcrumb('Starting device-mode initialization'); // logger.debug("this.clientIntegrations: ", this.clientIntegrations)
                        // Load all the client integrations dynamically

                        this.clientIntegrations.forEach(function (intg) {
                            var modName = configToIntNames[intg.name]; // script URL can be constructed from this

                            var pluginName = "".concat(modName).concat(INTG_SUFFIX); // this is the name of the object loaded on the window

                            var modURL = "".concat(_this2.destSDKBaseURL, "/").concat(modName).concat(suffix, ".min.js");

                            if (!window.hasOwnProperty(pluginName)) {
                                ScriptLoader(pluginName, modURL, {
                                    isNonNativeSDK: true
                                });
                            }

                            var self = _this2;
                            var interval = setInterval(function () {
                                if (self.integrationSDKLoaded(pluginName, modName)) {
                                    var intMod = window[pluginName];
                                    clearInterval(interval); // logger.debug(pluginName, " dynamically loaded integration SDK");

                                    var intgInstance;

                                    try {
                                        var msg = "[Analytics] processResponse :: trying to initialize integration name:: ".concat(pluginName); // logger.debug(msg);

                                        leaveBreadcrumb(msg);
                                        intgInstance = new intMod[modName](intg.config, self);
                                        intgInstance.init(); // logger.debug(pluginName, " initializing destination");

                                        self.isInitialized(intgInstance).then(function () {
                                            // logger.debug(pluginName, " module init sequence complete");
                                            self.dynamicallyLoadedIntegrations[pluginName] = intMod[modName];
                                        });
                                    } catch (e) {
                                        e.message = "[Analytics] 'integration.init()' failed :: ".concat(pluginName, " :: ").concat(e.message);
                                        handleError(e);
                                        self.failedToBeLoadedIntegration.push(intgInstance);
                                    }
                                }
                            }, 100);
                            setTimeout(function () {
                                clearInterval(interval);
                            }, MAX_WAIT_FOR_INTEGRATION_LOAD);
                        });
                        var self = this;
                        this.allModulesInitialized().then(function () {
                            if (!self.clientIntegrations || self.clientIntegrations.length == 0) {
                                // If no integrations are there to be loaded
                                // set clientIntegrationsReady to be true
                                _this2.clientIntegrationsReady = true; // Execute the callbacks if any

                                _this2.executeReadyCallback();

                                _this2.toBeProcessedByIntegrationArray = [];
                                return;
                            }

                            self.replayEvents(self);
                        });
                    } catch (error) {
                        handleError(error);
                    }
                } // eslint-disable-next-line class-methods-use-this

            }, {
                key: "replayEvents",
                value: function replayEvents(object) {
                    // logger.debug(
                    //   "===replay events called====",
                    //   " successfully loaded count: ",
                    //   object.successfullyLoadedIntegration.length,
                    //   " failed loaded count: ",
                    //   object.failedToBeLoadedIntegration.length
                    // );
                    leaveBreadcrumb("Started replaying buffered events"); // eslint-disable-next-line no-param-reassign

                    object.clientIntegrationObjects = []; // eslint-disable-next-line no-param-reassign

                    object.clientIntegrationObjects = object.successfullyLoadedIntegration; // logger.debug(
                    //   "==registering after callback===",
                    //   " after to be called after count : ",
                    //   object.clientIntegrationObjects.length
                    // );

                    if (object.clientIntegrationObjects.every(function (intg) {
                        return !intg.isReady || intg.isReady();
                    })) {
                        // Integrations are ready
                        // set clientIntegrationsReady to be true
                        object.clientIntegrationsReady = true; // Execute the callbacks if any

                        object.executeReadyCallback();
                    } // send the queued events to the fetched integration


                    object.toBeProcessedByIntegrationArray.forEach(function (event) {
                        var methodName = event[0];
                        event.shift(); // convert common names to sdk identified name

                        if (Object.keys(event[0].message.integrations).length > 0) {
                            transformToRudderNames(event[0].message.integrations);
                        } // if not specified at event level, All: true is default


                        var clientSuppliedIntegrations = event[0].message.integrations; // get intersection between config plane native enabled destinations
                        // (which were able to successfully load on the page) vs user supplied integrations

                        var succesfulLoadedIntersectClientSuppliedIntegrations = findAllEnabledDestinations(clientSuppliedIntegrations, object.clientIntegrationObjects); // send to all integrations now from the 'toBeProcessedByIntegrationArray' replay queue

                        for (var i = 0; i < succesfulLoadedIntersectClientSuppliedIntegrations.length; i += 1) {
                            try {
                                if (!succesfulLoadedIntersectClientSuppliedIntegrations[i].isFailed || !succesfulLoadedIntersectClientSuppliedIntegrations[i].isFailed()) {
                                    if (succesfulLoadedIntersectClientSuppliedIntegrations[i][methodName]) {
                                        var sendEvent = !object.IsEventBlackListed(event[0].message.event, succesfulLoadedIntersectClientSuppliedIntegrations[i].name); // Block the event if it is blacklisted for the device-mode destination

                                        if (sendEvent) {
                                            var _succesfulLoadedInter;

                                            var clonedBufferEvent = cloneDeep(event);

                                            (_succesfulLoadedInter = succesfulLoadedIntersectClientSuppliedIntegrations[i])[methodName].apply(_succesfulLoadedInter, _toConsumableArray(clonedBufferEvent));
                                        }
                                    }
                                }
                            } catch (error) {
                                handleError(error);
                            }
                        }
                    });
                    object.toBeProcessedByIntegrationArray = [];
                }
            }, {
                key: "pause",
                value: function pause(time) {
                    return new Promise(function (resolve) {
                        setTimeout(resolve, time);
                    });
                }
            }, {
                key: "isInitialized",
                value: function isInitialized(instance) {
                    var _this3 = this;

                    var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                    return new Promise(function (resolve) {
                        if (instance.isLoaded()) {
                            // logger.debug("===integration loaded successfully====", instance.name)
                            _this3.successfullyLoadedIntegration.push(instance);

                            resolve(_this3);
                        } else if (time >= MAX_WAIT_FOR_INTEGRATION_LOAD) {
                            // logger.debug("====max wait over====")
                            _this3.failedToBeLoadedIntegration.push(instance);

                            resolve(_this3);
                        } else {
                            _this3.pause(INTEGRATION_LOAD_CHECK_INTERVAL).then(function () {
                                // logger.debug("====after pause, again checking====")
                                return _this3.isInitialized(instance, time + INTEGRATION_LOAD_CHECK_INTERVAL).then(resolve);
                            });
                        }
                    });
                }
                /**
                 * Process page params and forward to page call
                 *
                 * @param {*} category
                 * @param {*} name
                 * @param {*} properties
                 * @param {*} options
                 * @param {*} callback
                 * @memberof Analytics
                 */

            }, {
                key: "page",
                value: function page(category, name, properties, options, callback) {
                    leaveBreadcrumb("Page event");
                    if (!this.loaded) return;
                    if (typeof options === 'function') callback = options, options = null;
                    if (typeof properties === 'function') callback = properties, options = properties = null;
                    if (typeof name === 'function') callback = name, options = properties = name = null;
                    if (_typeof(category) === 'object' && category != null && category != undefined) options = name, properties = category, name = category = null;
                    if (_typeof(name) === 'object' && name != null && name != undefined) options = properties, properties = name, name = null;
                    if (typeof category === 'string' && typeof name !== 'string') name = category, category = null;

                    if (this.sendAdblockPage && category != 'RudderJS-Initiated') {
                        this.sendSampleRequest();
                    }

                    var rudderElement = new RudderElementBuilder().setType('page').build();

                    if (!properties) {
                        properties = {};
                    }

                    if (name) {
                        rudderElement.message.name = properties.name = name;
                    }

                    if (category) {
                        rudderElement.message.category = properties.category = category;
                    }

                    rudderElement.message.properties = this.getPageProperties(properties);
                    this.processAndSendDataToDestinations('page', rudderElement, options, callback);
                }
                /**
                 * Process track params and forward to track call
                 *
                 * @param {*} event
                 * @param {*} properties
                 * @param {*} options
                 * @param {*} callback
                 * @memberof Analytics
                 */

            }, {
                key: "track",
                value: function track(event, properties, options, callback) {
                    leaveBreadcrumb("Track event");
                    if (!this.loaded) return;
                    if (typeof options === 'function') callback = options, options = null;
                    if (typeof properties === 'function') callback = properties, options = null, properties = null;
                    var rudderElement = new RudderElementBuilder().setType('track').build();

                    if (event) {
                        rudderElement.setEventName(event);
                    }

                    rudderElement.setProperty(properties || {});
                    this.processAndSendDataToDestinations('track', rudderElement, options, callback);
                }
                /**
                 * Process identify params and forward to identify  call
                 *
                 * @param {*} userId
                 * @param {*} traits
                 * @param {*} options
                 * @param {*} callback
                 * @memberof Analytics
                 */

            }, {
                key: "identify",
                value: function identify(userId, traits, options, callback) {
                    leaveBreadcrumb("Identify event");
                    if (!this.loaded) return;
                    if (typeof options === 'function') callback = options, options = null;
                    if (typeof traits === 'function') callback = traits, options = null, traits = null;
                    if (_typeof(userId) === 'object') options = traits, traits = userId, userId = this.userId;

                    if (userId && this.userId && userId !== this.userId) {
                        this.reset();
                    }

                    this.userId = userId;
                    this.storage.setUserId(this.userId);

                    if (traits) {
                        for (var key in traits) {
                            this.userTraits[key] = traits[key];
                        }

                        this.storage.setUserTraits(this.userTraits);
                    }

                    var rudderElement = new RudderElementBuilder().setType('identify').build();
                    this.processAndSendDataToDestinations('identify', rudderElement, options, callback);
                }
                /**
                 *
                 * @param {*} to
                 * @param {*} from
                 * @param {*} options
                 * @param {*} callback
                 */

            }, {
                key: "alias",
                value: function alias(to, from, options, callback) {
                    leaveBreadcrumb("Alias event");
                    if (!this.loaded) return;
                    if (typeof options === 'function') callback = options, options = null;
                    if (typeof from === 'function') callback = from, options = null, from = null;
                    if (_typeof(from) === 'object') options = from, from = null;
                    var rudderElement = new RudderElementBuilder().setType('alias').build();
                    rudderElement.message.previousId = from || (this.userId ? this.userId : this.getAnonymousId());
                    rudderElement.message.userId = to;
                    this.processAndSendDataToDestinations('alias', rudderElement, options, callback);
                }
                /**
                 *
                 * @param {*} to
                 * @param {*} from
                 * @param {*} options
                 * @param {*} callback
                 */

            }, {
                key: "group",
                value: function group(groupId, traits, options, callback) {
                    leaveBreadcrumb("Group event");
                    if (!this.loaded) return;
                    if (!arguments.length) return;
                    if (typeof options === 'function') callback = options, options = null;
                    if (typeof traits === 'function') callback = traits, options = null, traits = null;
                    if (_typeof(groupId) === 'object') options = traits, traits = groupId, groupId = this.groupId;
                    this.groupId = groupId;
                    this.storage.setGroupId(this.groupId);
                    var rudderElement = new RudderElementBuilder().setType('group').build();

                    if (traits) {
                        for (var key in traits) {
                            this.groupTraits[key] = traits[key];
                        }
                    } else {
                        this.groupTraits = {};
                    }

                    this.storage.setGroupTraits(this.groupTraits);
                    this.processAndSendDataToDestinations('group', rudderElement, options, callback);
                }
            }, {
                key: "IsEventBlackListed",
                value: function IsEventBlackListed(eventName, intgName) {
                    if (!eventName || !(typeof eventName === 'string')) {
                        return false;
                    }

                    var sdkIntgName = commonNames[intgName];
                    var intg = this.clientIntegrations.find(function (intg) {
                        return intg.name === sdkIntgName;
                    });
                    var _intg$config = intg.config,
                        blacklistedEvents = _intg$config.blacklistedEvents,
                        whitelistedEvents = _intg$config.whitelistedEvents,
                        eventFilteringOption = _intg$config.eventFilteringOption;

                    if (!eventFilteringOption) {
                        return false;
                    }

                    var formattedEventName = eventName.trim().toUpperCase();

                    switch (eventFilteringOption) {
                        // disabled filtering
                        case 'disable':
                            return false;
                        // Blacklist is choosen for filtering events

                        case 'blacklistedEvents':
                            if (Array.isArray(blacklistedEvents)) {
                                return blacklistedEvents.find(function (eventObj) {
                                    return eventObj.eventName.trim().toUpperCase() === formattedEventName;
                                }) !== undefined;
                            }

                            return false;
                        // Whitelist is choosen for filtering events

                        case 'whitelistedEvents':
                            if (Array.isArray(whitelistedEvents)) {
                                return whitelistedEvents.find(function (eventObj) {
                                    return eventObj.eventName.trim().toUpperCase() === formattedEventName;
                                }) === undefined;
                            }

                            return true;

                        default:
                            return false;
                    }
                }
                /**
                 * Process and send data to destinations along with rudder BE
                 *
                 * @param {*} type
                 * @param {*} rudderElement
                 * @param {*} callback
                 * @memberof Analytics
                 */

            }, {
                key: "processAndSendDataToDestinations",
                value: function processAndSendDataToDestinations(type, rudderElement, options, callback) {
                    var _this4 = this;

                    try {
                        if (!this.anonymousId) {
                            this.setAnonymousId();
                        } // assign page properties to context
                        // rudderElement.message.context.page = getDefaultPageProperties();


                        leaveBreadcrumb('Started sending data to destinations');
                        rudderElement.message.context.traits = _objectSpread2({}, this.userTraits); // logger.debug("anonymousId: ", this.anonymousId)

                        rudderElement.message.anonymousId = this.anonymousId;
                        rudderElement.message.userId = rudderElement.message.userId ? rudderElement.message.userId : this.userId;

                        if (type == 'group') {
                            if (this.groupId) {
                                rudderElement.message.groupId = this.groupId;
                            }

                            if (this.groupTraits) {
                                rudderElement.message.traits = _objectSpread2({}, this.groupTraits);
                            }
                        } // If auto/manual session tracking is enabled sessionId will be sent in the context


                        try {
                            var _this$uSession$getSes = this.uSession.getSessionInfo(),
                                sessionId = _this$uSession$getSes.sessionId,
                                sessionStart = _this$uSession$getSes.sessionStart;

                            rudderElement.message.context.sessionId = sessionId;
                            if (sessionStart) rudderElement.message.context.sessionStart = true;
                        } catch (e) {
                            handleError(e);
                        }

                        this.processOptionsParam(rudderElement, options); // logger.debug(JSON.stringify(rudderElement))
                        // check for reserved keys and log

                        checkReservedKeywords(rudderElement.message, type); // if not specified at event level, All: true is default

                        var clientSuppliedIntegrations = rudderElement.message.integrations || {
                            All: true
                        }; // structure user supplied integrations object to rudder format

                        transformToRudderNames(clientSuppliedIntegrations);
                        rudderElement.message.integrations = clientSuppliedIntegrations; // config plane native enabled destinations, still not completely loaded
                        // in the page, add the events to a queue and process later

                        if (!this.clientIntegrationObjects) {
                            // logger.debug("pushing in replay queue")
                            // new event processing after analytics initialized  but integrations not fetched from BE
                            this.toBeProcessedByIntegrationArray.push([type, rudderElement]);
                        } else {
                            // get intersection between config plane native enabled destinations
                            // (which were able to successfully load on the page) vs user supplied integrations
                            var succesfulLoadedIntersectClientSuppliedIntegrations = findAllEnabledDestinations(clientSuppliedIntegrations, this.clientIntegrationObjects); // try to first send to all integrations, if list populated from BE

                            succesfulLoadedIntersectClientSuppliedIntegrations.forEach(function (obj) {
                                try {
                                    if (!obj.isFailed || !obj.isFailed()) {
                                        if (obj[type]) {
                                            var sendEvent = !_this4.IsEventBlackListed(rudderElement.message.event, obj.name); // Block the event if it is blacklisted for the device-mode destination

                                            if (sendEvent) {
                                                var clonedRudderElement = cloneDeep(rudderElement);
                                                obj[type](clonedRudderElement);
                                            }
                                        }
                                    }
                                } catch (err) {
                                    err.message = "[sendToNative]::[Destination:".concat(obj.name, "]:: ").concat(err);
                                    handleError(err);
                                }
                            });
                        } // convert integrations object to server identified names, kind of hack now!


                        transformToServerNames(rudderElement.message.integrations); // self analytics process, send to rudder

                        this.eventRepository.enqueue(rudderElement, type); // logger.debug(`${type} is called `)

                        if (callback) {
                            callback();
                        }
                    } catch (error) {
                        handleError(error);
                    }
                }
            }, {
                key: "utm",
                value: function utm(query) {
                    // Remove leading ? if present
                    if (query.charAt(0) === '?') {
                        query = query.substring(1);
                    }

                    query = query.replace(/\?/g, '&');
                    var param;
                    var params = parse$6(query);
                    var results = {};

                    for (var key in params) {
                        if (Object.prototype.hasOwnProperty.call(params, key)) {
                            if (key.substr(0, 4) === 'utm_') {
                                param = key.substr(4);
                                if (param === 'campaign') param = 'name';
                                results[param] = params[key];
                            }
                        }
                    }

                    return results;
                }
                /**
                 * add campaign parsed details under context
                 * @param {*} rudderElement
                 */

            }, {
                key: "addCampaignInfo",
                value: function addCampaignInfo(rudderElement) {
                    var msgContext = rudderElement.message.context;

                    if (msgContext && _typeof(msgContext) === 'object') {
                        var _getDefaultPageProper = getDefaultPageProperties(),
                            search = _getDefaultPageProper.search;

                        rudderElement.message.context.campaign = this.utm(search);
                    }
                }
                /**
                 * process options parameter
                 * Apart from top level keys merge everything under context
                 * context.page's default properties are overridden by same keys of
                 * provided properties in case of page call
                 *
                 * @param {*} rudderElement
                 * @param {*} options
                 * @memberof Analytics
                 */

            }, {
                key: "processOptionsParam",
                value: function processOptionsParam(rudderElement, options) {
                    var _rudderElement$messag = rudderElement.message,
                        type = _rudderElement$messag.type,
                        properties = _rudderElement$messag.properties;
                    this.addCampaignInfo(rudderElement); // assign page properties to context.page

                    rudderElement.message.context.page = this.getContextPageProperties(type === 'page' ? properties : undefined);
                    var topLevelElements = ['integrations', 'anonymousId', 'originalTimestamp'];

                    for (var key in options) {
                        if (topLevelElements.includes(key)) {
                            rudderElement.message[key] = options[key];
                        } else if (key !== 'context') {
                            rudderElement.message.context = merge(rudderElement.message.context, _defineProperty({}, key, options[key]));
                        } else if (_typeof(options[key]) === 'object' && options[key] != null) {
                            rudderElement.message.context = merge(rudderElement.message.context, _objectSpread2({}, options[key]));
                        } else {
                            logger.error('[Analytics: processOptionsParam] context passed in options is not object');
                        }
                    }
                }
            }, {
                key: "getPageProperties",
                value: function getPageProperties(properties, options) {
                    var defaultPageProperties = getDefaultPageProperties();
                    var optionPageProperties = options && options.page || {};

                    for (var key in defaultPageProperties) {
                        if (properties[key] === undefined) {
                            properties[key] = optionPageProperties[key] || defaultPageProperties[key];
                        }
                    }

                    return properties;
                } // Assign page properties to context.page if the same property is not provided under context.page

            }, {
                key: "getContextPageProperties",
                value: function getContextPageProperties(properties) {
                    var defaultPageProperties = getDefaultPageProperties();
                    var contextPageProperties = {};

                    for (var key in defaultPageProperties) {
                        contextPageProperties[key] = properties && properties[key] ? properties[key] : defaultPageProperties[key];
                    }

                    return contextPageProperties;
                }
                /**
                 * Clear user information
                 *
                 * @memberof Analytics
                 */

            }, {
                key: "reset",
                value: function reset(flag) {
                    leaveBreadcrumb("reset API :: flag: ".concat(flag));
                    if (!this.loaded) return;

                    if (flag) {
                        this.anonymousId = '';
                    }

                    this.userId = '';
                    this.userTraits = {};
                    this.groupId = '';
                    this.groupTraits = {};
                    this.uSession.reset();
                    this.storage.clear(flag);
                }
            }, {
                key: "getAnonymousId",
                value: function getAnonymousId(anonymousIdOptions) {
                    // if (!this.loaded) return;
                    this.anonymousId = this.storage.getAnonymousId(anonymousIdOptions);

                    if (!this.anonymousId) {
                        this.setAnonymousId();
                    }

                    return this.anonymousId;
                }
            }, {
                key: "getUserId",
                value: function getUserId() {
                    return this.userId;
                }
            }, {
                key: "getUserTraits",
                value: function getUserTraits() {
                    return this.userTraits;
                }
            }, {
                key: "getGroupId",
                value: function getGroupId() {
                    return this.groupId;
                }
            }, {
                key: "getGroupTraits",
                value: function getGroupTraits() {
                    return this.groupTraits;
                }
                /**
                 * Sets anonymous id in the following precedence:
                 * 1. anonymousId: Id directly provided to the function.
                 * 2. rudderAmpLinkerParm: value generated from linker query parm (rudderstack)
                 *    using praseLinker util.
                 * 3. generateUUID: A new unique id is generated and assigned.
                 *
                 * @param {string} anonymousId
                 * @param {string} rudderAmpLinkerParm
                 */

            }, {
                key: "setAnonymousId",
                value: function setAnonymousId(anonymousId, rudderAmpLinkerParm) {
                    // if (!this.loaded) return;
                    var parsedAnonymousIdObj = rudderAmpLinkerParm ? parseLinker(rudderAmpLinkerParm) : null;
                    var parsedAnonymousId = parsedAnonymousIdObj ? parsedAnonymousIdObj.rs_amp_id : null;
                    this.anonymousId = anonymousId || parsedAnonymousId || generateUUID();
                    this.storage.setAnonymousId(this.anonymousId);
                }
            }, {
                key: "isValidWriteKey",
                value: function isValidWriteKey(writeKey) {
                    if (!writeKey || typeof writeKey !== 'string' || writeKey.trim().length == 0) {
                        return false;
                    }

                    return true;
                }
            }, {
                key: "isValidServerUrl",
                value: function isValidServerUrl(serverUrl) {
                    if (!serverUrl || typeof serverUrl !== 'string' || serverUrl.trim().length == 0) {
                        return false;
                    }

                    return true;
                }
            }, {
                key: "isDatasetAvailable",
                value: function isDatasetAvailable() {
                    var t = document.createElement('div');
                    return t.setAttribute('data-a-b', 'c'), t.dataset ? t.dataset.aB === 'c' : false;
                }
                /**
                 * Load after polyfills are loaded
                 * @param {*} writeKey
                 * @param {*} serverUrl
                 * @param {*} options
                 * @returns
                 */

            }, {
                key: "loadAfterPolyfill",
                value: function loadAfterPolyfill(writeKey, serverUrl, options) {
                    var _this5 = this;

                    if (options && options.logLevel) {
                        this.logLevel = options.logLevel;
                        logger.setLogLevel(options.logLevel);
                    }

                    if (!this.storage || Object.keys(this.storage).length === 0) {
                        throw Error('Cannot proceed as no storage is available');
                    }

                    if (options && options.cookieConsentManager) this.cookieConsentOptions = cloneDeep(options.cookieConsentManager);

                    if (!this.isValidWriteKey(writeKey) || !this.isValidServerUrl(serverUrl)) {
                        throw Error('Unable to load the SDK due to invalid writeKey or serverUrl');
                    }

                    var storageOptions = {};

                    if (options && options.setCookieDomain) {
                        storageOptions = _objectSpread2(_objectSpread2({}, storageOptions), {}, {
                            domain: options.setCookieDomain
                        });
                    }

                    if (options && typeof options.secureCookie === 'boolean') {
                        storageOptions = _objectSpread2(_objectSpread2({}, storageOptions), {}, {
                            secure: options.secureCookie
                        });
                    }

                    if (options && SAMESITE_COOKIE_OPTS.includes(options.sameSiteCookie)) {
                        storageOptions = _objectSpread2(_objectSpread2({}, storageOptions), {}, {
                            samesite: options.sameSiteCookie
                        });
                    }

                    this.storage.options(storageOptions);

                    if (options && options.integrations) {
                        _extends(this.loadOnlyIntegrations, options.integrations);

                        transformToRudderNames(this.loadOnlyIntegrations);
                    }

                    if (options && options.sendAdblockPage) {
                        this.sendAdblockPage = true;
                    }

                    if (options && options.sendAdblockPageOptions && _typeof(options.sendAdblockPageOptions) === 'object') {
                        this.sendAdblockPageOptions = options.sendAdblockPageOptions;
                    } // Session initialization


                    this.uSession.initialize(options);

                    if (options && options.clientSuppliedCallbacks) {
                        // convert to rudder recognized method names
                        var transformedCallbackMapping = {};
                        Object.keys(this.methodToCallbackMapping).forEach(function (methodName) {
                            if (_this5.methodToCallbackMapping.hasOwnProperty(methodName)) {
                                if (options.clientSuppliedCallbacks[_this5.methodToCallbackMapping[methodName]]) {
                                    transformedCallbackMapping[methodName] = options.clientSuppliedCallbacks[_this5.methodToCallbackMapping[methodName]];
                                }
                            }
                        });

                        _extends(this.clientSuppliedCallbacks, transformedCallbackMapping);

                        this.registerCallbacks(true);
                    }

                    if (options && options.loadIntegration != undefined) {
                        this.loadIntegration = !!options.loadIntegration;
                    }

                    this.eventRepository.initialize(writeKey, serverUrl, options);
                    this.initializeUser(options ? options.anonymousIdOptions : undefined);
                    this.setInitialPageProperties();
                    this.loaded = true;

                    if (options && options.destSDKBaseURL) {
                        this.destSDKBaseURL = removeTrailingSlashes(options.destSDKBaseURL);

                        if (!this.destSDKBaseURL) {
                            handleError({
                                message: '[Analytics] load:: CDN base URL is not valid'
                            });
                            throw Error('failed to load');
                        }
                    } else {
                        // Get the CDN base URL from the included 'rudder-analytics.min.js' script tag
                        var _getSDKUrlInfo2 = getSDKUrlInfo(),
                            sdkURL = _getSDKUrlInfo2.sdkURL;

                        if (sdkURL) {
                            this.destSDKBaseURL = sdkURL.split('/').slice(0, -1).concat(CDN_INT_DIR).join('/');
                        }
                    }

                    if (options && options.getSourceConfig) {
                        if (typeof options.getSourceConfig !== 'function') {
                            handleError(new Error('option "getSourceConfig" must be a function'));
                        } else {
                            var res = options.getSourceConfig();

                            if (res instanceof Promise) {
                                res.then(function (pRes) {
                                    return _this5.processResponse(200, pRes);
                                }).catch(handleError);
                            } else {
                                this.processResponse(200, res);
                            }
                        }

                        return;
                    }

                    var configUrl = getConfigUrl(writeKey);

                    if (options && options.configUrl) {
                        configUrl = getUserProvidedConfigUrl(options.configUrl, configUrl);
                    }

                    try {
                        getJSONTrimmed(this, configUrl, writeKey, this.processResponse);
                    } catch (error) {
                        handleError(error);
                    }
                }
                /**
                 * Call control pane to get client configs
                 *
                 * @param {*} writeKey
                 * @memberof Analytics
                 */

            }, {
                key: "load",
                value: function load(writeKey, serverUrl, options) {
                    // logger.debug("inside load ");
                    if (this.loaded) return; // check if the below features are available in the browser or not
                    // If not present dynamically load from the polyfill cdn

                    if (!String.prototype.endsWith || !String.prototype.startsWith || !String.prototype.includes || !Array.prototype.find || !Array.prototype.includes || !Promise || !Object.entries || !Object.values || !String.prototype.replaceAll || !this.isDatasetAvailable()) {
                        var id = 'polyfill';
                        ScriptLoader(id, POLYFILL_URL, {
                            skipDatasetAttributes: true
                        });
                        var self = this;
                        var interval = setInterval(function () {
                            // check if the polyfill is loaded
                            // In chrome 83 and below versions ID of a script is not part of window's scope
                            // even though it is loaded and returns false for <window.hasOwnProperty("polyfill")> this.
                            // So, added another checking to fulfill that purpose.
                            if (window.hasOwnProperty(id) || document.getElementById(id) !== null) {
                                clearInterval(interval);
                                self.loadAfterPolyfill(writeKey, serverUrl, options);
                            }
                        }, 100);
                        setTimeout(function () {
                            clearInterval(interval);
                        }, MAX_WAIT_FOR_INTEGRATION_LOAD);
                    } else {
                        this.loadAfterPolyfill(writeKey, serverUrl, options);
                    }
                }
            }, {
                key: "ready",
                value: function ready(callback) {
                    if (!this.loaded) return;

                    if (typeof callback === 'function') {
                        /**
                         * If integrations are loaded or no integration is available for loading
                         * execute the callback immediately
                         * else push the callbacks to a queue that will be executed after loading completes
                         */
                        if (this.clientIntegrationsReady) {
                            callback();
                        } else {
                            this.readyCallbacks.push(callback);
                        }

                        return;
                    }

                    logger.error('ready callback is not a function');
                }
            }, {
                key: "initializeCallbacks",
                value: function initializeCallbacks() {
                    var _this6 = this;

                    Object.keys(this.methodToCallbackMapping).forEach(function (methodName) {
                        if (_this6.methodToCallbackMapping.hasOwnProperty(methodName)) {
                            _this6.on(methodName, function () {
                            });
                        }
                    });
                }
            }, {
                key: "registerCallbacks",
                value: function registerCallbacks(calledFromLoad) {
                    var _this7 = this;

                    if (!calledFromLoad) {
                        Object.keys(this.methodToCallbackMapping).forEach(function (methodName) {
                            if (_this7.methodToCallbackMapping.hasOwnProperty(methodName)) {
                                if (window.rudderanalytics) {
                                    if (typeof window.rudderanalytics[_this7.methodToCallbackMapping[methodName]] === 'function') {
                                        _this7.clientSuppliedCallbacks[methodName] = window.rudderanalytics[_this7.methodToCallbackMapping[methodName]];
                                    }
                                } // let callback =
                                //   ? typeof window.rudderanalytics[
                                //       this.methodToCallbackMapping[methodName]
                                //     ] == "function"
                                //     ? window.rudderanalytics[this.methodToCallbackMapping[methodName]]
                                //     : () => {}
                                //   : () => {};
                                // logger.debug("registerCallbacks", methodName, callback);
                                // this.on(methodName, callback);

                            }
                        });
                    }

                    Object.keys(this.clientSuppliedCallbacks).forEach(function (methodName) {
                        if (_this7.clientSuppliedCallbacks.hasOwnProperty(methodName)) {
                            // logger.debug(
                            //   "registerCallbacks",
                            //   methodName,
                            //   this.clientSuppliedCallbacks[methodName]
                            // );
                            _this7.on(methodName, _this7.clientSuppliedCallbacks[methodName]);
                        }
                    });
                }
            }, {
                key: "sendSampleRequest",
                value: function sendSampleRequest() {
                    ScriptLoader('ad-block', '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
                }
                /**
                 * A public method to start a session
                 * @param {string} sessionId     session identifier
                 * @returns
                 */

            }, {
                key: "startSession",
                value: function startSession(sessionId) {
                    this.uSession.start(sessionId);
                }
                /**
                 * A public method to end an ongoing session.
                 */

            }, {
                key: "endSession",
                value: function endSession() {
                    this.uSession.end();
                }
            }]);

            return Analytics;
        }();

        var instance = new Analytics();

        function processDataInAnalyticsArray(analytics) {
            analytics.toBeProcessedArray.forEach(function (x) {
                var event = _toConsumableArray(x);

                var method = event[0];
                event.shift(); // logger.debug("=====from analytics array, calling method:: ", method)

                analytics[method].apply(analytics, _toConsumableArray(event));
            });
            instance.toBeProcessedArray = [];
        }

        /**
         * parse the given query string into usable Rudder object
         * @param {*} query
         */


        function parseQueryString(query) {
            var queryDefaults = {
                trait: 'ajs_trait_',
                prop: 'ajs_prop_'
            };

            function getDataFromQueryObj(qObj, dataType) {
                var data = {};
                Object.keys(qObj).forEach(function (key) {
                    if (key.startsWith(dataType)) {
                        data[key.substr(dataType.length)] = qObj[key];
                    }
                });
                return data;
            }

            var queryObject = parse$6(query);

            if (queryObject.ajs_aid) {
                instance.toBeProcessedArray.push(['setAnonymousId', queryObject.ajs_aid]);
            }

            if (queryObject.ajs_uid) {
                instance.toBeProcessedArray.push(['identify', queryObject.ajs_uid, getDataFromQueryObj(queryObject, queryDefaults.trait)]);
            }

            if (queryObject.ajs_event) {
                instance.toBeProcessedArray.push(['track', queryObject.ajs_event, getDataFromQueryObj(queryObject, queryDefaults.prop)]);
            }
        }

        Emitter$1(instance);
        window.addEventListener('error', function (e) {
            handleError(e, instance);
        }, true); // initialize supported callbacks

        instance.initializeCallbacks(); // register supported callbacks

        instance.registerCallbacks(false);
        var defaultMethod = 'load';
        var argumentsArray = window.rudderanalytics;
        var isValidArgsArray = Array.isArray(argumentsArray);

        if (isValidArgsArray) {
            /**
             * Iterate the buffered API calls until we find load call and
             * queue it first for processing
             */
            var i = 0;

            while (i < argumentsArray.length) {
                if (argumentsArray[i] && argumentsArray[i][0] === defaultMethod) {
                    instance.toBeProcessedArray.push(argumentsArray[i]);
                    argumentsArray.splice(i, 1);
                    break;
                }

                i += 1;
            }
        } // parse querystring of the page url to send events


        parseQueryString(window.location.search);
        if (isValidArgsArray) argumentsArray.forEach(function (x) {
            return instance.toBeProcessedArray.push(x);
        });
        processDataInAnalyticsArray(instance);
        var ready = instance.ready.bind(instance);
        var identify = instance.identify.bind(instance);
        var page = instance.page.bind(instance);
        var track = instance.track.bind(instance);
        var alias = instance.alias.bind(instance);
        var group = instance.group.bind(instance);
        var reset = instance.reset.bind(instance);
        var load = instance.load.bind(instance);
        var initialized = instance.initialized = true;
        var getUserId = instance.getUserId.bind(instance);
        var getUserTraits = instance.getUserTraits.bind(instance);
        var getAnonymousId = instance.getAnonymousId.bind(instance);
        var setAnonymousId = instance.setAnonymousId.bind(instance);
        var getGroupId = instance.getGroupId.bind(instance);
        var getGroupTraits = instance.getGroupTraits.bind(instance);
        var startSession = instance.startSession.bind(instance);
        var endSession = instance.endSession.bind(instance);

        exports.alias = alias;
        exports.endSession = endSession;
        exports.getAnonymousId = getAnonymousId;
        exports.getGroupId = getGroupId;
        exports.getGroupTraits = getGroupTraits;
        exports.getUserId = getUserId;
        exports.getUserTraits = getUserTraits;
        exports.group = group;
        exports.identify = identify;
        exports.initialized = initialized;
        exports.load = load;
        exports.page = page;
        exports.ready = ready;
        exports.reset = reset;
        exports.setAnonymousId = setAnonymousId;
        exports.startSession = startSession;
        exports.track = track;

        Object.defineProperty(exports, '__esModule', {value: true});
    }));
    //=====================================================================================

    console.log("This prints to the console of the page (injected only if the page url matched)");

    const initialiseRudderstack = () => {
        rudderanalytics.ready(() => {
            console.log("we are all set!!!");
        });

        rudderanalytics.load("<writeKey>", "<dataPlaneURL>");
    }


    const testEvents = () => {
        rudderanalytics.page();

        rudderanalytics.identify(
            "moumita123",
            {email: "name@domain.com"},
            {
                page: {
                    path: "",
                    referrer: "",
                    search: "",
                    title: "",
                    url: "",
                },
            },
            () => {
                console.log("in identify call");
            }
        );

        rudderanalytics.track(
            "test track event GA3",
            {
                revenue: 30,
                currency: "USD",
                user_actual_id: 12345,
            },
            () => {
                console.log("in track call");
            }
        );
    };

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value} = obj;

        if (type === "track") {
            testEvents(value);
        }
    });

    initialiseRudderstack();
})();
