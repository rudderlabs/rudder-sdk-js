// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.
(() => {
    //======================== npm cjs package code ==========================================

    var UaChTrackLevel=/*#__PURE__*/function(UaChTrackLevel){UaChTrackLevel["None"]="none";UaChTrackLevel["Default"]="default";UaChTrackLevel["Full"]="full";return UaChTrackLevel;}({});/**
     * Represents the options parameter for anonymousId
     */ /**
     * Represents the beacon queue options parameter in loadOptions type
     */var CookieSameSite=/*#__PURE__*/function(CookieSameSite){CookieSameSite["Strict"]="Strict";CookieSameSite["Lax"]="Lax";CookieSameSite["None"]="None";return CookieSameSite;}({});/**
     * Represents the queue options parameter in loadOptions type
     */ /**
     * Represents the destinations queue options parameter in loadOptions type
     */ /**
     * Represents the options parameter in the load API
     */

    /**
     * Represents residency server input the options
     */var ResidencyServerRegion=/*#__PURE__*/function(ResidencyServerRegion){ResidencyServerRegion["US"]="US";ResidencyServerRegion["EU"]="EU";return ResidencyServerRegion;}({});

    var LogLevel=/*#__PURE__*/function(LogLevel){LogLevel["Log"]="LOG";LogLevel["Info"]="INFO";LogLevel["Debug"]="DEBUG";LogLevel["Warn"]="WARN";LogLevel["Error"]="ERROR";LogLevel["None"]="NONE";return LogLevel;}({});

    var PluginName=/*#__PURE__*/function(PluginName){PluginName["BeaconQueue"]="BeaconQueue";PluginName["DeviceModeDestinations"]="DeviceModeDestinations";PluginName["DeviceModeTransformation"]="DeviceModeTransformation";PluginName["ErrorReporting"]="ErrorReporting";PluginName["ExternalAnonymousId"]="ExternalAnonymousId";PluginName["GoogleLinker"]="GoogleLinker";PluginName["NativeDestinationQueue"]="NativeDestinationQueue";PluginName["StorageEncryption"]="StorageEncryption";PluginName["StorageEncryptionLegacy"]="StorageEncryptionLegacy";PluginName["StorageMigrator"]="StorageMigrator";PluginName["XhrQueue"]="XhrQueue";PluginName["OneTrustConsentManager"]="OneTrustConsentManager";PluginName["KetchConsentManager"]="KetchConsentManager";PluginName["Bugsnag"]="Bugsnag";return PluginName;}({});

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
    function _regeneratorRuntime() {
        _regeneratorRuntime = function () {
            return exports;
        };
        var exports = {},
          Op = Object.prototype,
          hasOwn = Op.hasOwnProperty,
          defineProperty = Object.defineProperty || function (obj, key, desc) {
              obj[key] = desc.value;
          },
          $Symbol = "function" == typeof Symbol ? Symbol : {},
          iteratorSymbol = $Symbol.iterator || "@@iterator",
          asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
          toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
        function define(obj, key, value) {
            return Object.defineProperty(obj, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }), obj[key];
        }
        try {
            define({}, "");
        } catch (err) {
            define = function (obj, key, value) {
                return obj[key] = value;
            };
        }
        function wrap(innerFn, outerFn, self, tryLocsList) {
            var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
              generator = Object.create(protoGenerator.prototype),
              context = new Context(tryLocsList || []);
            return defineProperty(generator, "_invoke", {
                value: makeInvokeMethod(innerFn, self, context)
            }), generator;
        }
        function tryCatch(fn, obj, arg) {
            try {
                return {
                    type: "normal",
                    arg: fn.call(obj, arg)
                };
            } catch (err) {
                return {
                    type: "throw",
                    arg: err
                };
            }
        }
        exports.wrap = wrap;
        var ContinueSentinel = {};
        function Generator() {}
        function GeneratorFunction() {}
        function GeneratorFunctionPrototype() {}
        var IteratorPrototype = {};
        define(IteratorPrototype, iteratorSymbol, function () {
            return this;
        });
        var getProto = Object.getPrototypeOf,
          NativeIteratorPrototype = getProto && getProto(getProto(values([])));
        NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
        var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
        function defineIteratorMethods(prototype) {
            ["next", "throw", "return"].forEach(function (method) {
                define(prototype, method, function (arg) {
                    return this._invoke(method, arg);
                });
            });
        }
        function AsyncIterator(generator, PromiseImpl) {
            function invoke(method, arg, resolve, reject) {
                var record = tryCatch(generator[method], generator, arg);
                if ("throw" !== record.type) {
                    var result = record.arg,
                      value = result.value;
                    return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
                        invoke("next", value, resolve, reject);
                    }, function (err) {
                        invoke("throw", err, resolve, reject);
                    }) : PromiseImpl.resolve(value).then(function (unwrapped) {
                        result.value = unwrapped, resolve(result);
                    }, function (error) {
                        return invoke("throw", error, resolve, reject);
                    });
                }
                reject(record.arg);
            }
            var previousPromise;
            defineProperty(this, "_invoke", {
                value: function (method, arg) {
                    function callInvokeWithMethodAndArg() {
                        return new PromiseImpl(function (resolve, reject) {
                            invoke(method, arg, resolve, reject);
                        });
                    }
                    return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
                }
            });
        }
        function makeInvokeMethod(innerFn, self, context) {
            var state = "suspendedStart";
            return function (method, arg) {
                if ("executing" === state) throw new Error("Generator is already running");
                if ("completed" === state) {
                    if ("throw" === method) throw arg;
                    return {
                        value: void 0,
                        done: !0
                    };
                }
                for (context.method = method, context.arg = arg;;) {
                    var delegate = context.delegate;
                    if (delegate) {
                        var delegateResult = maybeInvokeDelegate(delegate, context);
                        if (delegateResult) {
                            if (delegateResult === ContinueSentinel) continue;
                            return delegateResult;
                        }
                    }
                    if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
                        if ("suspendedStart" === state) throw state = "completed", context.arg;
                        context.dispatchException(context.arg);
                    } else "return" === context.method && context.abrupt("return", context.arg);
                    state = "executing";
                    var record = tryCatch(innerFn, self, context);
                    if ("normal" === record.type) {
                        if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
                        return {
                            value: record.arg,
                            done: context.done
                        };
                    }
                    "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
                }
            };
        }
        function maybeInvokeDelegate(delegate, context) {
            var methodName = context.method,
              method = delegate.iterator[methodName];
            if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
            var record = tryCatch(method, delegate.iterator, context.arg);
            if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
            var info = record.arg;
            return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
        }
        function pushTryEntry(locs) {
            var entry = {
                tryLoc: locs[0]
            };
            1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
        }
        function resetTryEntry(entry) {
            var record = entry.completion || {};
            record.type = "normal", delete record.arg, entry.completion = record;
        }
        function Context(tryLocsList) {
            this.tryEntries = [{
                tryLoc: "root"
            }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
        }
        function values(iterable) {
            if (iterable || "" === iterable) {
                var iteratorMethod = iterable[iteratorSymbol];
                if (iteratorMethod) return iteratorMethod.call(iterable);
                if ("function" == typeof iterable.next) return iterable;
                if (!isNaN(iterable.length)) {
                    var i = -1,
                      next = function next() {
                          for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
                          return next.value = undefined, next.done = !0, next;
                      };
                    return next.next = next;
                }
            }
            throw new TypeError(typeof iterable + " is not iterable");
        }
        return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
            value: GeneratorFunctionPrototype,
            configurable: !0
        }), defineProperty(GeneratorFunctionPrototype, "constructor", {
            value: GeneratorFunction,
            configurable: !0
        }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
            var ctor = "function" == typeof genFun && genFun.constructor;
            return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
        }, exports.mark = function (genFun) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
        }, exports.awrap = function (arg) {
            return {
                __await: arg
            };
        }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
            return this;
        }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
            void 0 === PromiseImpl && (PromiseImpl = Promise);
            var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
            return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
                return result.done ? result.value : iter.next();
            });
        }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
            return this;
        }), define(Gp, "toString", function () {
            return "[object Generator]";
        }), exports.keys = function (val) {
            var object = Object(val),
              keys = [];
            for (var key in object) keys.push(key);
            return keys.reverse(), function next() {
                for (; keys.length;) {
                    var key = keys.pop();
                    if (key in object) return next.value = key, next.done = !1, next;
                }
                return next.done = !0, next;
            };
        }, exports.values = values, Context.prototype = {
            constructor: Context,
            reset: function (skipTempReset) {
                if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
            },
            stop: function () {
                this.done = !0;
                var rootRecord = this.tryEntries[0].completion;
                if ("throw" === rootRecord.type) throw rootRecord.arg;
                return this.rval;
            },
            dispatchException: function (exception) {
                if (this.done) throw exception;
                var context = this;
                function handle(loc, caught) {
                    return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
                }
                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                    var entry = this.tryEntries[i],
                      record = entry.completion;
                    if ("root" === entry.tryLoc) return handle("end");
                    if (entry.tryLoc <= this.prev) {
                        var hasCatch = hasOwn.call(entry, "catchLoc"),
                          hasFinally = hasOwn.call(entry, "finallyLoc");
                        if (hasCatch && hasFinally) {
                            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
                            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
                        } else if (hasCatch) {
                            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
                        } else {
                            if (!hasFinally) throw new Error("try statement without catch or finally");
                            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
                        }
                    }
                }
            },
            abrupt: function (type, arg) {
                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                    var entry = this.tryEntries[i];
                    if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                        var finallyEntry = entry;
                        break;
                    }
                }
                finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
                var record = finallyEntry ? finallyEntry.completion : {};
                return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
            },
            complete: function (record, afterLoc) {
                if ("throw" === record.type) throw record.arg;
                return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
            },
            finish: function (finallyLoc) {
                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                    var entry = this.tryEntries[i];
                    if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
                }
            },
            catch: function (tryLoc) {
                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                    var entry = this.tryEntries[i];
                    if (entry.tryLoc === tryLoc) {
                        var record = entry.completion;
                        if ("throw" === record.type) {
                            var thrown = record.arg;
                            resetTryEntry(entry);
                        }
                        return thrown;
                    }
                }
                throw new Error("illegal catch attempt");
            },
            delegateYield: function (iterable, resultName, nextLoc) {
                return this.delegate = {
                    iterator: values(iterable),
                    resultName: resultName,
                    nextLoc: nextLoc
                }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
            }
        }, exports;
    }
    function _typeof(obj) {
        "@babel/helpers - typeof";

        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
            return typeof obj;
        } : function (obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        }, _typeof(obj);
    }
    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try {
            var info = gen[key](arg);
            var value = info.value;
        } catch (error) {
            reject(error);
            return;
        }
        if (info.done) {
            resolve(value);
        } else {
            Promise.resolve(value).then(_next, _throw);
        }
    }
    function _asyncToGenerator(fn) {
        return function () {
            var self = this,
              args = arguments;
            return new Promise(function (resolve, reject) {
                var gen = fn.apply(self, args);
                function _next(value) {
                    asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                }
                function _throw(err) {
                    asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                }
                _next(undefined);
            });
        };
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
            Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
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
        key = _toPropertyKey(key);
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
    function _toPrimitive(input, hint) {
        if (typeof input !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== undefined) {
            var res = prim.call(input, hint || "default");
            if (typeof res !== "object") return res;
            throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
    }
    function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");
        return typeof key === "symbol" ? key : String(key);
    }

    function _isPlaceholder(a){return a!=null&&_typeof(a)==='object'&&a['@@functional/placeholder']===true;}

    /**
     * Optimized internal one-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */function _curry1(fn){return function f1(a){if(arguments.length===0||_isPlaceholder(a)){return f1;}else {return fn.apply(this,arguments);}};}

    /**
     * Optimized internal two-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */function _curry2(fn){return function f2(a,b){switch(arguments.length){case 0:return f2;case 1:return _isPlaceholder(a)?f2:_curry1(function(_b){return fn(a,_b);});default:return _isPlaceholder(a)&&_isPlaceholder(b)?f2:_isPlaceholder(a)?_curry1(function(_a){return fn(_a,b);}):_isPlaceholder(b)?_curry1(function(_b){return fn(a,_b);}):fn(a,b);}};}

    /**
     * Optimized internal three-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */function _curry3(fn){return function f3(a,b,c){switch(arguments.length){case 0:return f3;case 1:return _isPlaceholder(a)?f3:_curry2(function(_b,_c){return fn(a,_b,_c);});case 2:return _isPlaceholder(a)&&_isPlaceholder(b)?f3:_isPlaceholder(a)?_curry2(function(_a,_c){return fn(_a,b,_c);}):_isPlaceholder(b)?_curry2(function(_b,_c){return fn(a,_b,_c);}):_curry1(function(_c){return fn(a,b,_c);});default:return _isPlaceholder(a)&&_isPlaceholder(b)&&_isPlaceholder(c)?f3:_isPlaceholder(a)&&_isPlaceholder(b)?_curry2(function(_a,_b){return fn(_a,_b,c);}):_isPlaceholder(a)&&_isPlaceholder(c)?_curry2(function(_a,_c){return fn(_a,b,_c);}):_isPlaceholder(b)&&_isPlaceholder(c)?_curry2(function(_b,_c){return fn(a,_b,_c);}):_isPlaceholder(a)?_curry1(function(_a){return fn(_a,b,c);}):_isPlaceholder(b)?_curry1(function(_b){return fn(a,_b,c);}):_isPlaceholder(c)?_curry1(function(_c){return fn(a,b,_c);}):fn(a,b,c);}};}

    /**
     * Tests whether or not an object is an array.
     *
     * @private
     * @param {*} val The object to test.
     * @return {Boolean} `true` if `val` is an array, `false` otherwise.
     * @example
     *
     *      _isArray([]); //=> true
     *      _isArray(null); //=> false
     *      _isArray({}); //=> false
     */var _isArray = Array.isArray||function _isArray(val){return val!=null&&val.length>=0&&Object.prototype.toString.call(val)==='[object Array]';};

    function _arrayFromIterator(iter){var list=[];var next;while(!(next=iter.next()).done){list.push(next.value);}return list;}

    function _includesWith(pred,x,list){var idx=0;var len=list.length;while(idx<len){if(pred(x,list[idx])){return true;}idx+=1;}return false;}

    function _functionName(f){// String(x => x) evaluates to "x => x", so the pattern may not match.
        var match=String(f).match(/^function (\w*)/);return match==null?'':match[1];}

    function _has(prop,obj){return Object.prototype.hasOwnProperty.call(obj,prop);}

// Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
    function _objectIs(a,b){// SameValue algorithm
        if(a===b){// Steps 1-5, 7-10
// Steps 6.b-6.e: +0 != -0
            return a!==0||1/a===1/b;}else {// Step 6.a: NaN == NaN
            return a!==a&&b!==b;}}var _objectIs$1 = typeof Object.is==='function'?Object.is:_objectIs;

    var toString=Object.prototype.toString;var _isArguments=/*#__PURE__*/function(){return toString.call(arguments)==='[object Arguments]'?function _isArguments(x){return toString.call(x)==='[object Arguments]';}:function _isArguments(x){return _has('callee',x);};}();

    var hasEnumBug=!/*#__PURE__*/{toString:null}.propertyIsEnumerable('toString');var nonEnumerableProps=['constructor','valueOf','isPrototypeOf','toString','propertyIsEnumerable','hasOwnProperty','toLocaleString'];// Safari bug
    var hasArgsEnumBug=/*#__PURE__*/function(){return arguments.propertyIsEnumerable('length');}();var contains=function contains(list,item){var idx=0;while(idx<list.length){if(list[idx]===item){return true;}idx+=1;}return false;};/**
     * Returns a list containing the names of all the enumerable own properties of
     * the supplied object.
     * Note that the order of the output array is not guaranteed to be consistent
     * across different JS platforms.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig {k: v} -> [k]
     * @param {Object} obj The object to extract properties from
     * @return {Array} An array of the object's own properties.
     * @see R.keysIn, R.values, R.toPairs
     * @example
     *
     *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
     */var keys=typeof Object.keys==='function'&&!hasArgsEnumBug?/*#__PURE__*/_curry1(function keys(obj){return Object(obj)!==obj?[]:Object.keys(obj);}):/*#__PURE__*/_curry1(function keys(obj){if(Object(obj)!==obj){return [];}var prop,nIdx;var ks=[];var checkArgsLength=hasArgsEnumBug&&_isArguments(obj);for(prop in obj){if(_has(prop,obj)&&(!checkArgsLength||prop!=='length')){ks[ks.length]=prop;}}if(hasEnumBug){nIdx=nonEnumerableProps.length-1;while(nIdx>=0){prop=nonEnumerableProps[nIdx];if(_has(prop,obj)&&!contains(ks,prop)){ks[ks.length]=prop;}nIdx-=1;}}return ks;});

    /**
     * Gives a single-word string description of the (native) type of a value,
     * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
     * attempt to distinguish user Object types any further, reporting them all as
     * 'Object'.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Type
     * @sig * -> String
     * @param {*} val The value to test
     * @return {String}
     * @example
     *
     *      R.type({}); //=> "Object"
     *      R.type(1); //=> "Number"
     *      R.type(false); //=> "Boolean"
     *      R.type('s'); //=> "String"
     *      R.type(null); //=> "Null"
     *      R.type([]); //=> "Array"
     *      R.type(/[A-z]/); //=> "RegExp"
     *      R.type(() => {}); //=> "Function"
     *      R.type(undefined); //=> "Undefined"
     */var type=/*#__PURE__*/_curry1(function type(val){return val===null?'Null':val===undefined?'Undefined':Object.prototype.toString.call(val).slice(8,-1);});

    /**
     * private _uniqContentEquals function.
     * That function is checking equality of 2 iterator contents with 2 assumptions
     * - iterators lengths are the same
     * - iterators values are unique
     *
     * false-positive result will be returned for comparison of, e.g.
     * - [1,2,3] and [1,2,3,4]
     * - [1,1,1] and [1,2,3]
     * */function _uniqContentEquals(aIterator,bIterator,stackA,stackB){var a=_arrayFromIterator(aIterator);var b=_arrayFromIterator(bIterator);function eq(_a,_b){return _equals(_a,_b,stackA.slice(),stackB.slice());}// if *a* array contains any element that is not included in *b*
        return !_includesWith(function(b,aItem){return !_includesWith(eq,aItem,b);},b,a);}function _equals(a,b,stackA,stackB){if(_objectIs$1(a,b)){return true;}var typeA=type(a);if(typeA!==type(b)){return false;}if(typeof a['fantasy-land/equals']==='function'||typeof b['fantasy-land/equals']==='function'){return typeof a['fantasy-land/equals']==='function'&&a['fantasy-land/equals'](b)&&typeof b['fantasy-land/equals']==='function'&&b['fantasy-land/equals'](a);}if(typeof a.equals==='function'||typeof b.equals==='function'){return typeof a.equals==='function'&&a.equals(b)&&typeof b.equals==='function'&&b.equals(a);}switch(typeA){case'Arguments':case'Array':case'Object':if(typeof a.constructor==='function'&&_functionName(a.constructor)==='Promise'){return a===b;}break;case'Boolean':case'Number':case'String':if(!(_typeof(a)===_typeof(b)&&_objectIs$1(a.valueOf(),b.valueOf()))){return false;}break;case'Date':if(!_objectIs$1(a.valueOf(),b.valueOf())){return false;}break;case'Error':return a.name===b.name&&a.message===b.message;case'RegExp':if(!(a.source===b.source&&a.global===b.global&&a.ignoreCase===b.ignoreCase&&a.multiline===b.multiline&&a.sticky===b.sticky&&a.unicode===b.unicode)){return false;}break;}var idx=stackA.length-1;while(idx>=0){if(stackA[idx]===a){return stackB[idx]===b;}idx-=1;}switch(typeA){case'Map':if(a.size!==b.size){return false;}return _uniqContentEquals(a.entries(),b.entries(),stackA.concat([a]),stackB.concat([b]));case'Set':if(a.size!==b.size){return false;}return _uniqContentEquals(a.values(),b.values(),stackA.concat([a]),stackB.concat([b]));case'Arguments':case'Array':case'Object':case'Boolean':case'Number':case'String':case'Date':case'Error':case'RegExp':case'Int8Array':case'Uint8Array':case'Uint8ClampedArray':case'Int16Array':case'Uint16Array':case'Int32Array':case'Uint32Array':case'Float32Array':case'Float64Array':case'ArrayBuffer':break;default:// Values of other types are only equal if identical.
        return false;}var keysA=keys(a);if(keysA.length!==keys(b).length){return false;}var extendedStackA=stackA.concat([a]);var extendedStackB=stackB.concat([b]);idx=keysA.length-1;while(idx>=0){var key=keysA[idx];if(!(_has(key,b)&&_equals(b[key],a[key],extendedStackA,extendedStackB))){return false;}idx-=1;}return true;}

    /**
     * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
     * cyclical data structures.
     *
     * Dispatches symmetrically to the `equals` methods of both arguments, if
     * present.
     *
     * @func
     * @memberOf R
     * @since v0.15.0
     * @category Relation
     * @sig a -> b -> Boolean
     * @param {*} a
     * @param {*} b
     * @return {Boolean}
     * @example
     *
     *      R.equals(1, 1); //=> true
     *      R.equals(1, '1'); //=> false
     *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
     *
     *      const a = {}; a.v = a;
     *      const b = {}; b.v = b;
     *      R.equals(a, b); //=> true
     */var equals=/*#__PURE__*/_curry2(function equals(a,b){return _equals(a,b,[],[]);});

    function _isObject(x){return Object.prototype.toString.call(x)==='[object Object]';}

    /**
     * Determine if the passed argument is an integer.
     *
     * @private
     * @param {*} n
     * @category Type
     * @return {Boolean}
     */var _isInteger = Number.isInteger||function _isInteger(n){return n<<0===n;};

    function _isString(x){return Object.prototype.toString.call(x)==='[object String]';}

    /**
     * Returns the nth element of the given list or string. If n is negative the
     * element at index length + n is returned.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig Number -> [a] -> a | Undefined
     * @sig Number -> String -> String
     * @param {Number} offset
     * @param {*} list
     * @return {*}
     * @example
     *
     *      const list = ['foo', 'bar', 'baz', 'quux'];
     *      R.nth(1, list); //=> 'bar'
     *      R.nth(-1, list); //=> 'quux'
     *      R.nth(-99, list); //=> undefined
     *
     *      R.nth(2, 'abc'); //=> 'c'
     *      R.nth(3, 'abc'); //=> ''
     * @symb R.nth(-1, [a, b, c]) = c
     * @symb R.nth(0, [a, b, c]) = a
     * @symb R.nth(1, [a, b, c]) = b
     */var nth=/*#__PURE__*/_curry2(function nth(offset,list){var idx=offset<0?list.length+offset:offset;return _isString(list)?list.charAt(idx):list[idx];});

    function _cloneRegExp(pattern){return new RegExp(pattern.source,pattern.flags?pattern.flags:(pattern.global?'g':'')+(pattern.ignoreCase?'i':'')+(pattern.multiline?'m':'')+(pattern.sticky?'y':'')+(pattern.unicode?'u':'')+(pattern.dotAll?'s':''));}

    /**
     * Copies an object.
     *
     * @private
     * @param {*} value The value to be copied
     * @param {Boolean} deep Whether or not to perform deep cloning.
     * @return {*} The copied value.
     */function _clone(value,deep,map){map||(map=new _ObjectMap());// this avoids the slower switch with a quick if decision removing some milliseconds in each run.
        if(_isPrimitive(value)){return value;}var copy=function copy(copiedValue){// Check for circular and same references on the object graph and return its corresponding clone.
            var cachedCopy=map.get(value);if(cachedCopy){return cachedCopy;}map.set(value,copiedValue);for(var key in value){if(Object.prototype.hasOwnProperty.call(value,key)){copiedValue[key]=deep?_clone(value[key],true,map):value[key];}}return copiedValue;};switch(type(value)){case'Object':return copy(Object.create(Object.getPrototypeOf(value)));case'Array':return copy([]);case'Date':return new Date(value.valueOf());case'RegExp':return _cloneRegExp(value);case'Int8Array':case'Uint8Array':case'Uint8ClampedArray':case'Int16Array':case'Uint16Array':case'Int32Array':case'Uint32Array':case'Float32Array':case'Float64Array':case'BigInt64Array':case'BigUint64Array':return value.slice();default:return value;}}function _isPrimitive(param){var type=_typeof(param);return param==null||type!='object'&&type!='function';}var _ObjectMap=/*#__PURE__*/function(){function _ObjectMap(){this.map={};this.length=0;}_ObjectMap.prototype.set=function(key,value){var hashedKey=this.hash(key);var bucket=this.map[hashedKey];if(!bucket){this.map[hashedKey]=bucket=[];}bucket.push([key,value]);this.length+=1;};_ObjectMap.prototype.hash=function(key){var hashedKey=[];for(var value in key){hashedKey.push(Object.prototype.toString.call(key[value]));}return hashedKey.join();};_ObjectMap.prototype.get=function(key){/**
     * depending on the number of objects to be cloned is faster to just iterate over the items in the map just because the hash function is so costly,
     * on my tests this number is 180, anything above that using the hash function is faster.
     */if(this.length<=180){for(var p in this.map){var _bucket=this.map[p];for(var i=0;i<_bucket.length;i+=1){var element=_bucket[i];if(element[0]===key){return element[1];}}}return;}var hashedKey=this.hash(key);var bucket=this.map[hashedKey];if(!bucket){return;}for(var _i=0;_i<bucket.length;_i+=1){var _element=bucket[_i];if(_element[0]===key){return _element[1];}}};return _ObjectMap;}();

    /**
     * Creates a deep copy of the source that can be used in place of the source
     * object without retaining any references to it.
     * The source object may contain (nested) `Array`s and `Object`s,
     * `Number`s, `String`s, `Boolean`s and `Date`s.
     * `Function`s are assigned by reference rather than copied.
     *
     * Dispatches to a `clone` method if present.
     *
     * Note that if the source object has multiple nodes that share a reference,
     * the returned object will have the same structure, but the references will
     * be pointed to the location within the cloned value.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig {*} -> {*}
     * @param {*} value The object or array to clone
     * @return {*} A deeply cloned copy of `val`
     * @example
     *
     *      const objects = [{}, {}, {}];
     *      const objectsClone = R.clone(objects);
     *      objects === objectsClone; //=> false
     *      objects[0] === objectsClone[0]; //=> false
     */var clone=/*#__PURE__*/_curry1(function clone(value){return value!=null&&typeof value.clone==='function'?value.clone():_clone(value,true);});var clone$1 = clone;

    /**
     * Tests whether or not an object is a typed array.
     *
     * @private
     * @param {*} val The object to test.
     * @return {Boolean} `true` if `val` is a typed array, `false` otherwise.
     * @example
     *
     *      _isTypedArray(new Uint8Array([])); //=> true
     *      _isTypedArray(new Float32Array([])); //=> true
     *      _isTypedArray([]); //=> false
     *      _isTypedArray(null); //=> false
     *      _isTypedArray({}); //=> false
     */function _isTypedArray(val){var type=Object.prototype.toString.call(val);return type==='[object Uint8ClampedArray]'||type==='[object Int8Array]'||type==='[object Uint8Array]'||type==='[object Int16Array]'||type==='[object Uint16Array]'||type==='[object Int32Array]'||type==='[object Uint32Array]'||type==='[object Float32Array]'||type==='[object Float64Array]'||type==='[object BigInt64Array]'||type==='[object BigUint64Array]';}

    /**
     * Returns the empty value of its argument's type. Ramda defines the empty
     * value of Array (`[]`), Object (`{}`), String (`''`),
     * TypedArray (`Uint8Array []`, `Float32Array []`, etc), and Arguments. Other
     * types are supported if they define `<Type>.empty`,
     * `<Type>.prototype.empty` or implement the
     * [FantasyLand Monoid spec](https://github.com/fantasyland/fantasy-land#monoid).
     *
     * Dispatches to the `empty` method of the first argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.3.0
     * @category Function
     * @sig a -> a
     * @param {*} x
     * @return {*}
     * @example
     *
     *      R.empty(Just(42));               //=> Nothing()
     *      R.empty([1, 2, 3]);              //=> []
     *      R.empty('unicorns');             //=> ''
     *      R.empty({x: 1, y: 2});           //=> {}
     *      R.empty(Uint8Array.from('123')); //=> Uint8Array []
     */var empty=/*#__PURE__*/_curry1(function empty(x){return x!=null&&typeof x['fantasy-land/empty']==='function'?x['fantasy-land/empty']():x!=null&&x.constructor!=null&&typeof x.constructor['fantasy-land/empty']==='function'?x.constructor['fantasy-land/empty']():x!=null&&typeof x.empty==='function'?x.empty():x!=null&&x.constructor!=null&&typeof x.constructor.empty==='function'?x.constructor.empty():_isArray(x)?[]:_isString(x)?'':_isObject(x)?{}:_isArguments(x)?function(){return arguments;}():_isTypedArray(x)?x.constructor.from(''):void 0// else
      ;});

    /**
     * Returns `true` if the given value is its type's empty value; `false`
     * otherwise.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Logic
     * @sig a -> Boolean
     * @param {*} x
     * @return {Boolean}
     * @see R.empty
     * @example
     *
     *      R.isEmpty([1, 2, 3]);           //=> false
     *      R.isEmpty([]);                  //=> true
     *      R.isEmpty('');                  //=> true
     *      R.isEmpty(null);                //=> false
     *      R.isEmpty({});                  //=> true
     *      R.isEmpty({length: 0});         //=> false
     *      R.isEmpty(Uint8Array.from('')); //=> true
     */var isEmpty=/*#__PURE__*/_curry1(function isEmpty(x){return x!=null&&equals(x,empty(x));});var isEmpty$1 = isEmpty;

    /**
     * Retrieves the values at given paths of an object.
     *
     * @func
     * @memberOf R
     * @since v0.27.1
     * @category Object
     * @typedefn Idx = [String | Int | Symbol]
     * @sig [Idx] -> {a} -> [a | Undefined]
     * @param {Array} pathsArray The array of paths to be fetched.
     * @param {Object} obj The object to retrieve the nested properties from.
     * @return {Array} A list consisting of values at paths specified by "pathsArray".
     * @see R.path
     * @example
     *
     *      R.paths([['a', 'b'], ['p', 0, 'q']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, 3]
     *      R.paths([['a', 'b'], ['p', 'r']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, undefined]
     */var paths=/*#__PURE__*/_curry2(function paths(pathsArray,obj){return pathsArray.map(function(paths){var val=obj;var idx=0;var p;while(idx<paths.length){if(val==null){return;}p=paths[idx];val=_isInteger(p)?nth(p,val):val[p];idx+=1;}return val;});});

    /**
     * Retrieves the value at a given path. The nodes of the path can be arbitrary strings or non-negative integers.
     * For anything else, the value is unspecified. Integer paths are meant to index arrays, strings are meant for objects.
     *
     * @func
     * @memberOf R
     * @since v0.2.0
     * @category Object
     * @typedefn Idx = String | Int | Symbol
     * @sig [Idx] -> {a} -> a | Undefined
     * @sig Idx = String | NonNegativeInt
     * @param {Array} path The path to use.
     * @param {Object} obj The object or array to retrieve the nested property from.
     * @return {*} The data at `path`.
     * @see R.prop, R.nth, R.assocPath, R.dissocPath
     * @example
     *
     *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
     *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
     *      R.path(['a', 'b', 0], {a: {b: [1, 2, 3]}}); //=> 1
     *      R.path(['a', 'b', -2], {a: {b: [1, 2, 3]}}); //=> 2
     *      R.path([2], {'2': 2}); //=> 2
     *      R.path([-2], {'-2': 'a'}); //=> undefined
     */var path=/*#__PURE__*/_curry2(function path(pathAr,obj){return paths([pathAr],obj)[0];});var path$1 = path;

    /**
     * Creates a new object with the own properties of the two provided objects. If
     * a key exists in both objects, the provided function is applied to the key
     * and the values associated with the key in each object, with the result being
     * used as the value associated with the key in the returned object.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category Object
     * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
     * @param {Function} fn
     * @param {Object} l
     * @param {Object} r
     * @return {Object}
     * @see R.mergeDeepWithKey, R.merge, R.mergeWith
     * @example
     *
     *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
     *      R.mergeWithKey(concatValues,
     *                     { a: true, thing: 'foo', values: [10, 20] },
     *                     { b: true, thing: 'bar', values: [15, 35] });
     *      //=> { a: true, b: true, thing: 'bar', values: [10, 20, 15, 35] }
     * @symb R.mergeWithKey(f, { x: 1, y: 2 }, { y: 5, z: 3 }) = { x: 1, y: f('y', 2, 5), z: 3 }
     */var mergeWithKey=/*#__PURE__*/_curry3(function mergeWithKey(fn,l,r){var result={};var k;l=l||{};r=r||{};for(k in l){if(_has(k,l)){result[k]=_has(k,r)?fn(k,l[k],r[k]):l[k];}}for(k in r){if(_has(k,r)&&!_has(k,result)){result[k]=r[k];}}return result;});

    /**
     * Creates a new object with the own properties of the two provided objects.
     * If a key exists in both objects:
     * - and both associated values are also objects then the values will be
     *   recursively merged.
     * - otherwise the provided function is applied to the key and associated values
     *   using the resulting value as the new value associated with the key.
     * If a key only exists in one object, the value will be associated with the key
     * of the resulting object.
     *
     * @func
     * @memberOf R
     * @since v0.24.0
     * @category Object
     * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
     * @param {Function} fn
     * @param {Object} lObj
     * @param {Object} rObj
     * @return {Object}
     * @see R.mergeWithKey, R.mergeDeepWith
     * @example
     *
     *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
     *      R.mergeDeepWithKey(concatValues,
     *                         { a: true, c: { thing: 'foo', values: [10, 20] }},
     *                         { b: true, c: { thing: 'bar', values: [15, 35] }});
     *      //=> { a: true, b: true, c: { thing: 'bar', values: [10, 20, 15, 35] }}
     */var mergeDeepWithKey=/*#__PURE__*/_curry3(function mergeDeepWithKey(fn,lObj,rObj){return mergeWithKey(function(k,lVal,rVal){if(_isObject(lVal)&&_isObject(rVal)){return mergeDeepWithKey(fn,lVal,rVal);}else {return fn(k,lVal,rVal);}},lObj,rObj);});

    /**
     * Creates a new object with the own properties of the two provided objects.
     * If a key exists in both objects:
     * - and both associated values are also objects then the values will be
     *   recursively merged.
     * - otherwise the provided function is applied to associated values using the
     *   resulting value as the new value associated with the key.
     * If a key only exists in one object, the value will be associated with the key
     * of the resulting object.
     *
     * @func
     * @memberOf R
     * @since v0.24.0
     * @category Object
     * @sig ((a, a) -> a) -> {a} -> {a} -> {a}
     * @param {Function} fn
     * @param {Object} lObj
     * @param {Object} rObj
     * @return {Object}
     * @see R.mergeWith, R.mergeDeepWithKey
     * @example
     *
     *      R.mergeDeepWith(R.concat,
     *                      { a: true, c: { values: [10, 20] }},
     *                      { b: true, c: { values: [15, 35] }});
     *      //=> { a: true, b: true, c: { values: [10, 20, 15, 35] }}
     */var mergeDeepWith=/*#__PURE__*/_curry3(function mergeDeepWith(fn,lObj,rObj){return mergeDeepWithKey(function(k,lVal,rVal){return fn(lVal,rVal);},lObj,rObj);});var mergeDeepWith$1 = mergeDeepWith;

    /**
     * Returns a partial copy of an object containing only the keys that satisfy
     * the supplied predicate.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Object
     * @sig ((v, k) -> Boolean) -> {k: v} -> {k: v}
     * @param {Function} pred A predicate to determine whether or not a key
     *        should be included on the output object.
     * @param {Object} obj The object to copy from
     * @return {Object} A new object with only properties that satisfy `pred`
     *         on it.
     * @see R.pick, R.filter
     * @example
     *
     *      const isUpperCase = (val, key) => key.toUpperCase() === key;
     *      R.pickBy(isUpperCase, {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}
     */var pickBy=/*#__PURE__*/_curry2(function pickBy(test,obj){var result={};for(var prop in obj){if(test(obj[prop],prop,obj)){result[prop]=obj[prop];}}return result;});var pickBy$1 = pickBy;

    /**
     * A function to check given value is a function
     * @param value input value
     * @returns boolean
     */var isFunction=function isFunction(value){return typeof value==='function'&&Boolean(value.constructor&&value.call&&value.apply);};/**
     * A function to check given value is a string
     * @param value input value
     * @returns boolean
     */var isString=function isString(value){return typeof value==='string';};/**
     * A function to check given value is null or not
     * @param value input value
     * @returns boolean
     */var isNull=function isNull(value){return value===null;};/**
     * A function to check given value is undefined
     * @param value input value
     * @returns boolean
     */var isUndefined=function isUndefined(value){return typeof value==='undefined';};/**
     * A function to check given value is null or undefined
     * @param value input value
     * @returns boolean
     */var isNullOrUndefined=function isNullOrUndefined(value){return isNull(value)||isUndefined(value);};/**
     * A function to check given value is defined
     * @param value input value
     * @returns boolean
     */var isDefined=function isDefined(value){return !isUndefined(value);};/**
     * A function to check given value is defined and not null
     * @param value input value
     * @returns boolean
     */var isDefinedAndNotNull=function isDefinedAndNotNull(value){return !isNullOrUndefined(value);};/**
     * Determines if the input is an instance of Error
     * @param obj input value
     * @returns true if the input is an instance of Error and false otherwise
     */var isTypeOfError=function isTypeOfError(obj){return obj instanceof Error;};

    var getValueByPath=function getValueByPath(obj,keyPath){var pathParts=keyPath.split('.');return path$1(pathParts,obj);};var hasValueByPath=function hasValueByPath(obj,path){return Boolean(getValueByPath(obj,path));};/**
     * Checks if the input is an object literal or built-in object type and not null
     * @param value Input value
     * @returns true if the input is an object and not null
     */var isObjectAndNotNull=function isObjectAndNotNull(value){return !isNull(value)&&_typeof(value)==='object'&&!Array.isArray(value);};/**
     * Checks if the input is an object literal and not null
     * @param value Input value
     * @returns true if the input is an object and not null
     */var isObjectLiteralAndNotNull=function isObjectLiteralAndNotNull(value){return !isNull(value)&&Object.prototype.toString.call(value)==='[object Object]';};var mergeDeepRightObjectArrays=function mergeDeepRightObjectArrays(leftValue,rightValue){if(!Array.isArray(leftValue)||!Array.isArray(rightValue)){return clone$1(rightValue);}var mergedArray=clone$1(leftValue);rightValue.forEach(function(value,index){mergedArray[index]=Array.isArray(value)||isObjectAndNotNull(value)?// eslint-disable-next-line @typescript-eslint/no-use-before-define
      mergeDeepRight(mergedArray[index],value):value;});return mergedArray;};var mergeDeepRight=function mergeDeepRight(leftObject,rightObject){return mergeDeepWith$1(mergeDeepRightObjectArrays,leftObject,rightObject);};/**
     Checks if the input is a non-empty object literal type and not undefined or null
     * @param value input any
     * @returns boolean
     */var isNonEmptyObject=function isNonEmptyObject(value){return isObjectLiteralAndNotNull(value)&&Object.keys(value).length>0;};/**
     * A utility to recursively remove undefined values from an object
     * @param obj input object
     * @returns a new object
     */var removeUndefinedValues=function removeUndefinedValues(obj){var result=pickBy$1(isDefined,obj);Object.keys(result).forEach(function(key){var value=result[key];if(isObjectLiteralAndNotNull(value)){result[key]=removeUndefinedValues(value);}});return result;};/**
     * A utility to recursively remove undefined and null values from an object
     * @param obj input object
     * @returns a new object
     */var removeUndefinedAndNullValues=function removeUndefinedAndNullValues(obj){var result=pickBy$1(isDefinedAndNotNull,obj);Object.keys(result).forEach(function(key){var value=result[key];if(isObjectLiteralAndNotNull(value)){result[key]=removeUndefinedAndNullValues(value);}});return result;};/**
     * A utility to get all the values from an object
     * @param obj Input object
     * @returns an array of values from the input object
     */var getObjectValues=function getObjectValues(obj){var result=[];Object.keys(obj).forEach(function(key){result.push(obj[key]);});return result;};

    var trim=function trim(value){return value.replace(/^\s+|\s+$/gm,'');};var removeDoubleSpaces=function removeDoubleSpaces(value){return value.replace(/ {2,}/g,' ');};/**
     * A function to convert values to string
     * @param val input value
     * @returns stringified value
     */var tryStringify=function tryStringify(val){var retVal=val;if(!isString(val)&&!isNullOrUndefined(val)){try{retVal=JSON.stringify(val);}catch(e){retVal=null;}}return retVal;};// The following text encoding and decoding is done before base64 encoding to prevent
// https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
    /**
     * Converts a base64 encoded string to bytes array
     * @param base64Str base64 encoded string
     * @returns bytes array
     */var base64ToBytes=function base64ToBytes(base64Str){var binString=globalThis.atob(base64Str);var bytes=binString.split('').map(function(char){return char.charCodeAt(0);});return new Uint8Array(bytes);};/**
     * Converts a bytes array to base64 encoded string
     * @param bytes bytes array to be converted to base64
     * @returns base64 encoded string
     */var bytesToBase64=function bytesToBase64(bytes){var binString=Array.from(bytes,function(x){return String.fromCodePoint(x);}).join('');return globalThis.btoa(binString);};/**
     * Encodes a string to base64 even with unicode characters
     * @param value input string
     * @returns base64 encoded string
     */var toBase64=function toBase64(value){return bytesToBase64(new TextEncoder().encode(value));};/**
     * Decodes a base64 encoded string
     * @param value base64 encoded string
     * @returns decoded string
     */var fromBase64=function fromBase64(value){return new TextDecoder().decode(base64ToBytes(value));};

//   if yes make them null instead of omitting in overloaded cases
    /*
 * Normalise the overloaded arguments of the page call facade
 */var pageArgumentsToCallOptions=function pageArgumentsToCallOptions(category,name,properties,options,callback){var payload={category:category,name:name,properties:properties,options:options};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.category=category;payload.name=name;payload.properties=properties;delete payload.options;payload.callback=options;}if(isFunction(properties)){payload.category=category;payload.name=name;delete payload.properties;delete payload.options;payload.callback=properties;}if(isFunction(name)){payload.category=category;delete payload.name;delete payload.properties;delete payload.options;payload.callback=name;}if(isFunction(category)){delete payload.category;delete payload.name;delete payload.properties;delete payload.options;payload.callback=category;}if(isObjectLiteralAndNotNull(category)){delete payload.name;delete payload.category;payload.properties=category;payload.options=name;}else if(isObjectLiteralAndNotNull(name)){delete payload.name;payload.properties=name;payload.options=!isFunction(properties)?properties:null;}// if the category argument alone is provided b/w category and name,
// use it as name and set category to undefined
        if(isString(category)&&!isString(name)){delete payload.category;payload.name=category;}// Rest of the code is just to clean up undefined values
// and set some proper defaults
// Also, to clone the incoming object type arguments
        if(!isDefined(payload.category)){delete payload.category;}if(!isDefined(payload.name)){delete payload.name;}payload.properties=payload.properties?clone$1(payload.properties):{};if(isDefined(payload.options)){payload.options=clone$1(payload.options);}else {delete payload.options;}// add name and category to properties
        payload.properties=mergeDeepRight(isObjectLiteralAndNotNull(payload.properties)?payload.properties:{},{name:isString(payload.name)?payload.name:null,category:isString(payload.category)?payload.category:null});return payload;};/*
 * Normalise the overloaded arguments of the track call facade
 */var trackArgumentsToCallOptions=function trackArgumentsToCallOptions(event,properties,options,callback){var payload={name:event,properties:properties,options:options};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.properties=properties;delete payload.options;payload.callback=options;}if(isFunction(properties)){delete payload.properties;delete payload.options;payload.callback=properties;}// Rest of the code is just to clean up undefined values
// and set some proper defaults
// Also, to clone the incoming object type arguments
        payload.properties=isDefinedAndNotNull(payload.properties)?clone$1(payload.properties):{};if(isDefined(payload.options)){payload.options=clone$1(payload.options);}else {delete payload.options;}return payload;};/*
 * Normalise the overloaded arguments of the identify call facade
 */var identifyArgumentsToCallOptions=function identifyArgumentsToCallOptions(userId,traits,options,callback){var payload={userId:userId,traits:traits,options:options};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.userId=userId;payload.traits=traits;delete payload.options;payload.callback=options;}if(isFunction(traits)){payload.userId=userId;delete payload.traits;delete payload.options;payload.callback=traits;}if(isObjectLiteralAndNotNull(userId)||isNull(userId)){// Explicitly set null to prevent resetting the existing value
// in the Analytics class
        payload.userId=null;payload.traits=userId;payload.options=traits;}// Rest of the code is just to clean up undefined values
// and set some proper defaults
// Also, to clone the incoming object type arguments
        if(isDefined(payload.userId)){payload.userId=tryStringify(payload.userId);}else {delete payload.userId;}if(isObjectLiteralAndNotNull(payload.traits)){payload.traits=clone$1(payload.traits);}else {delete payload.traits;}if(isDefined(payload.options)){payload.options=clone$1(payload.options);}else {delete payload.options;}return payload;};/*
 * Normalise the overloaded arguments of the alias call facade
 */var aliasArgumentsToCallOptions=function aliasArgumentsToCallOptions(to,from,options,callback){var payload={to:to,from:from,options:options};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.to=to;payload.from=from;delete payload.options;payload.callback=options;}if(isFunction(from)){payload.to=to;delete payload.from;delete payload.options;payload.callback=from;}else if(isObjectLiteralAndNotNull(from)||isNull(from)){payload.to=to;delete payload.from;payload.options=from;}if(isFunction(to)){delete payload.to;delete payload.from;delete payload.options;payload.callback=to;}else if(isObjectLiteralAndNotNull(to)||isNull(to)){delete payload.to;delete payload.from;payload.options=to;}// Rest of the code is just to clean up undefined values
// and set some proper defaults
// Also, to clone the incoming object type arguments
        if(isDefined(payload.to)){payload.to=tryStringify(payload.to);}else {delete payload.to;}if(isDefined(payload.from)){payload.from=tryStringify(payload.from);}else {delete payload.from;}if(isDefined(payload.options)){payload.options=clone$1(payload.options);}else {delete payload.options;}return payload;};/*
 * Normalise the overloaded arguments of the group call facade
 */var groupArgumentsToCallOptions=function groupArgumentsToCallOptions(groupId,traits,options,callback){var payload={groupId:groupId,traits:traits,options:options};if(isFunction(callback)){payload.callback=callback;}if(isFunction(options)){payload.groupId=groupId;payload.traits=traits;delete payload.options;payload.callback=options;}if(isFunction(traits)){payload.groupId=groupId;delete payload.traits;delete payload.options;payload.callback=traits;}// TODO: why do we enable overload for group that only passes callback? is there any use case?
        if(isFunction(groupId)){// Explicitly set null to prevent resetting the existing value
            payload.groupId=null;delete payload.traits;delete payload.options;payload.callback=groupId;}else if(isObjectLiteralAndNotNull(groupId)||isNull(groupId)){// Explicitly set null to prevent resetting the existing value
// in the Analytics class
            payload.groupId=null;payload.traits=groupId;payload.options=!isFunction(traits)?traits:null;}// Rest of the code is just to clean up undefined values
// and set some proper defaults
// Also, to clone the incoming object type arguments
        if(isDefined(payload.groupId)){payload.groupId=tryStringify(payload.groupId);}else {delete payload.groupId;}payload.traits=isObjectLiteralAndNotNull(payload.traits)?clone$1(payload.traits):{};if(isDefined(payload.options)){payload.options=clone$1(payload.options);}else {delete payload.options;}return payload;};

    var CAPABILITIES_MANAGER='CapabilitiesManager';var CONFIG_MANAGER='ConfigManager';var EVENT_MANAGER='EventManager';var PLUGINS_MANAGER='PluginsManager';var USER_SESSION_MANAGER='UserSessionManager';var ERROR_HANDLER='ErrorHandler';var PLUGIN_ENGINE='PluginEngine';var STORE_MANAGER='StoreManager';var READY_API='readyApi';var LOAD_CONFIGURATION='LoadConfiguration';var EVENT_REPOSITORY='EventRepository';var EXTERNAL_SRC_LOADER='ExternalSrcLoader';var HTTP_CLIENT='HttpClient';var RS_APP='RudderStackApplication';var ANALYTICS_CORE='AnalyticsCore';

    var APP_NAME='RudderLabs JavaScript SDK';var APP_VERSION='3.0.0-beta.3';var APP_NAMESPACE='com.rudderlabs.javascript';var MODULE_TYPE='npm';var ADBLOCK_PAGE_CATEGORY='RudderJS-Initiated';var ADBLOCK_PAGE_NAME='ad-block page request';var ADBLOCK_PAGE_PATH='/ad-blocked';var GLOBAL_PRELOAD_BUFFER='preloadedEventsBuffer';

    var QUERY_PARAM_TRAIT_PREFIX='ajs_trait_';var QUERY_PARAM_PROPERTY_PREFIX='ajs_prop_';var QUERY_PARAM_ANONYMOUS_ID_KEY='ajs_aid';var QUERY_PARAM_USER_ID_KEY='ajs_uid';var QUERY_PARAM_TRACK_EVENT_NAME_KEY='ajs_event';

    /**
     * Create globally accessible RudderStackGlobals object
     */var createExposedGlobals=function createExposedGlobals(){var analyticsInstanceId=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'app';if(!globalThis.RudderStackGlobals){globalThis.RudderStackGlobals={};}if(!globalThis.RudderStackGlobals[analyticsInstanceId]){globalThis.RudderStackGlobals[analyticsInstanceId]={};}};/**
     * Add move values to globally accessible RudderStackGlobals object per analytics instance
     */var setExposedGlobal=function setExposedGlobal(keyName,value){var analyticsInstanceId=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'app';createExposedGlobals(analyticsInstanceId);globalThis.RudderStackGlobals[analyticsInstanceId][keyName]=value;};/**
     * Get values from globally accessible RudderStackGlobals object by analytics instance
     */var getExposedGlobal=function getExposedGlobal(keyName){var analyticsInstanceId=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'app';createExposedGlobals(analyticsInstanceId);return globalThis.RudderStackGlobals[analyticsInstanceId][keyName];};

    /**
     * Parse query string params into object values for keys that start with a defined prefix
     */var getEventDataFromQueryString=function getEventDataFromQueryString(params,dataTypeNamePrefix){var data={};params.forEach(function(value,key){if(key.startsWith(dataTypeNamePrefix)){// remove prefix from key name
        var dataKey=key.substring(dataTypeNamePrefix.length);// add new key value pair in generated object
        data[dataKey]=params.get(key);}});return data;};/**
     * Parse query string into preload buffer events & push into existing array before any other events
     */var retrieveEventsFromQueryString=function retrieveEventsFromQueryString(){var argumentsArray=arguments.length>0&&arguments[0]!==undefined?arguments[0]:[];// Mapping for trait and properties values based on key prefix
        var eventArgumentToQueryParamMap={trait:QUERY_PARAM_TRAIT_PREFIX,properties:QUERY_PARAM_PROPERTY_PREFIX};var queryObject=new URLSearchParams(globalThis.location.search);// Add track events with name and properties
        if(queryObject.get(QUERY_PARAM_TRACK_EVENT_NAME_KEY)){argumentsArray.unshift(['track',queryObject.get(QUERY_PARAM_TRACK_EVENT_NAME_KEY),getEventDataFromQueryString(queryObject,eventArgumentToQueryParamMap.properties)]);}// Set userId and user traits
        if(queryObject.get(QUERY_PARAM_USER_ID_KEY)){argumentsArray.unshift(['identify',queryObject.get(QUERY_PARAM_USER_ID_KEY),getEventDataFromQueryString(queryObject,eventArgumentToQueryParamMap.trait)]);}// Set anonymousID
        if(queryObject.get(QUERY_PARAM_ANONYMOUS_ID_KEY)){argumentsArray.unshift(['setAnonymousId',queryObject.get(QUERY_PARAM_ANONYMOUS_ID_KEY)]);}};/**
     * Retrieve an existing buffered load method call and remove from the existing array
     */var getPreloadedLoadEvent=function getPreloadedLoadEvent(preloadedEventsArray){var loadMethodName='load';var loadEvent=[];/**
     * Iterate the buffered API calls until we find load call and process it separately
     */var i=0;while(i<preloadedEventsArray.length){if(preloadedEventsArray[i]&&preloadedEventsArray[i][0]===loadMethodName){loadEvent=preloadedEventsArray[i];preloadedEventsArray.splice(i,1);break;}i+=1;}return loadEvent;};/**
     * Retrieve any existing events that were triggered before SDK load and enqueue in buffer
     */var retrievePreloadBufferEvents=function retrievePreloadBufferEvents(instance){var preloadedEventsArray=getExposedGlobal(GLOBAL_PRELOAD_BUFFER)||[];// Get events that are pre-populated via query string params
        retrieveEventsFromQueryString(preloadedEventsArray);var sanitizedPreloadedEventsArray=preloadedEventsArray.filter(function(bufferedEvent){return bufferedEvent[0]!=='load';});// Enqueue the non load events in the buffer of the global rudder analytics singleton
        if(sanitizedPreloadedEventsArray.length>0){instance.enqueuePreloadBufferEvents(sanitizedPreloadedEventsArray);setExposedGlobal(GLOBAL_PRELOAD_BUFFER,[]);}};var consumePreloadBufferedEvent=function consumePreloadBufferedEvent(event,analyticsInstance){var _ref;var methodName=event.shift();var callOptions;if(isFunction(analyticsInstance[methodName])){switch(methodName){case'page':callOptions=pageArgumentsToCallOptions.apply(void 0,_toConsumableArray(event));break;case'track':callOptions=trackArgumentsToCallOptions.apply(void 0,_toConsumableArray(event));break;case'identify':callOptions=identifyArgumentsToCallOptions.apply(void 0,_toConsumableArray(event));break;case'alias':callOptions=aliasArgumentsToCallOptions.apply(void 0,_toConsumableArray(event));break;case'group':callOptions=groupArgumentsToCallOptions.apply(void 0,_toConsumableArray(event));break;default:(_ref=analyticsInstance)[methodName].apply(_ref,_toConsumableArray(event));break;}if(callOptions){analyticsInstance[methodName](callOptions);}}};

    var DEFAULT_EXT_SRC_LOAD_TIMEOUT_MS=10*1000;// 10 seconds

    var LOG_CONTEXT_SEPARATOR=':: ';var SCRIPT_ALREADY_EXISTS_ERROR=function SCRIPT_ALREADY_EXISTS_ERROR(id){return "A script with the id \"".concat(id,"\" is already loaded. Skipping the loading of this script to prevent conflicts.");};var SCRIPT_LOAD_ERROR=function SCRIPT_LOAD_ERROR(id,url){return "Failed to load the script with the id \"".concat(id,"\" from URL \"").concat(url,"\".");};var SCRIPT_LOAD_TIMEOUT_ERROR=function SCRIPT_LOAD_TIMEOUT_ERROR(id,url,timeout){return "A timeout of ".concat(timeout," ms occurred while trying to load the script with id \"").concat(id,"\" from URL \"").concat(url,"\".");};var CIRCULAR_REFERENCE_WARNING=function CIRCULAR_REFERENCE_WARNING(context,key){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"A circular reference has been detected in the object and the property \"").concat(key,"\" has been dropped from the output.");};var JSON_STRINGIFY_WARNING="Failed to convert the value to a JSON string.";

    var JSON_STRINGIFY='JSONStringify';var getCircularReplacer=function getCircularReplacer(excludeNull,excludeKeys,logger){var ancestors=[];// Here we do not want to use arrow function to use "this" in function context
// eslint-disable-next-line func-names
        return function(key,value){if(excludeKeys!==null&&excludeKeys!==void 0&&excludeKeys.includes(key)){return undefined;}if(excludeNull&&isNullOrUndefined(value)){return undefined;}if(_typeof(value)!=='object'||isNull(value)){return value;}// `this` is the object that value is contained in, i.e., its direct parent.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
            while(ancestors.length>0&&ancestors[ancestors.length-1]!==this){ancestors.pop();}if(ancestors.includes(value)){logger===null||logger===void 0?void 0:logger.warn(CIRCULAR_REFERENCE_WARNING(JSON_STRINGIFY,key));return '[Circular Reference]';}ancestors.push(value);return value;};};/**
     * Utility method for JSON stringify object excluding null values & circular references
     *
     * @param {*} value input
     * @param {boolean} excludeNull if it should exclude nul or not
     * @param {function} logger optional logger methods for warning
     * @returns string
     */var stringifyWithoutCircular=function stringifyWithoutCircular(value,excludeNull,excludeKeys,logger){try{return JSON.stringify(value,getCircularReplacer(excludeNull,excludeKeys,logger));}catch(err){logger===null||logger===void 0?void 0:logger.warn(JSON_STRINGIFY_WARNING,err);return null;}};

    /**
     * Get mutated error with issue prepended to error message
     * @param err Original error
     * @param issue Issue to prepend to error message
     * @returns Instance of Error with message prepended with issue
     */var getMutatedError=function getMutatedError(err,issue){var finalError=err;if(!isTypeOfError(err)){finalError=new Error("".concat(issue,": ").concat(stringifyWithoutCircular(err)));}else {finalError.message="".concat(issue,": ").concat(err.message);}return finalError;};

    var EXTERNAL_SOURCE_LOAD_ORIGIN='RS_JS_SDK';

    /**
     * Create the DOM element to load a script marked as RS SDK originated
     *
     * @param {*} url The URL of the script to be loaded
     * @param {*} id ID for the script tag
     * @param {*} async Whether to load the script in async mode. Defaults to `true` [optional]
     * @param {*} onload callback to invoke onload [optional]
     * @param {*} onerror callback to invoke onerror [optional]
     * @param {*} extraAttributes key/value pair with html attributes to add in html tag [optional]
     *
     * @returns HTMLScriptElement
     */var createScriptElement=function createScriptElement(url,id){var async=arguments.length>2&&arguments[2]!==undefined?arguments[2]:true;var onload=arguments.length>3&&arguments[3]!==undefined?arguments[3]:null;var onerror=arguments.length>4&&arguments[4]!==undefined?arguments[4]:null;var extraAttributes=arguments.length>5&&arguments[5]!==undefined?arguments[5]:{};var scriptElement=document.createElement('script');scriptElement.type='text/javascript';scriptElement.onload=onload;scriptElement.onerror=onerror;scriptElement.src=url;scriptElement.id=id;scriptElement.async=async;scriptElement.setAttribute('data-append-origin',EXTERNAL_SOURCE_LOAD_ORIGIN);Object.keys(extraAttributes).forEach(function(attributeName){scriptElement.setAttribute(attributeName,extraAttributes[attributeName]);});return scriptElement;};/**
     * Add script DOM element to DOM
     *
     * @param {*} newScriptElement the script element to add
     *
     * @returns
     */var insertScript=function insertScript(newScriptElement){// First try to add it to the head
        var headElements=document.getElementsByTagName('head');if(headElements.length>0){headElements[0].insertBefore(newScriptElement,headElements[0].firstChild);return;}// Else wise add it before the first script tag
        var scriptElements=document.getElementsByTagName('script');if(scriptElements.length>0&&scriptElements[0].parentNode){scriptElements[0].parentNode.insertBefore(newScriptElement,scriptElements[0]);return;}// Create a new head element and add the script as fallback
        var headElement=document.createElement('head');headElement.appendChild(newScriptElement);var htmlElement=document.getElementsByTagName('html')[0];htmlElement.insertBefore(headElement,htmlElement.firstChild);};/**
     * Loads external js file as a script html tag
     *
     * @param {*} url The URL of the script to be loaded
     * @param {*} id ID for the script tag
     * @param {*} timeout loading timeout
     * @param {*} async Whether to load the script in async mode. Defaults to `true` [optional]
     * @param {*} extraAttributes key/value pair with html attributes to add in html tag [optional]
     *
     * @returns
     */var jsFileLoader=function jsFileLoader(url,id,timeout){var async=arguments.length>3&&arguments[3]!==undefined?arguments[3]:true;var extraAttributes=arguments.length>4?arguments[4]:undefined;return new Promise(function(resolve,reject){var scriptExists=document.getElementById(id);if(scriptExists){reject(new Error(SCRIPT_ALREADY_EXISTS_ERROR(id)));}try{var timeoutID;var onload=function onload(){globalThis.clearTimeout(timeoutID);resolve(id);};var onerror=function onerror(){globalThis.clearTimeout(timeoutID);reject(new Error(SCRIPT_LOAD_ERROR(id,url)));};// Create the DOM element to load the script and add it to the DOM
        insertScript(createScriptElement(url,id,async,onload,onerror,extraAttributes));// Reject on timeout
        timeoutID=globalThis.setTimeout(function(){reject(new Error(SCRIPT_LOAD_TIMEOUT_ERROR(id,url,timeout)));},timeout);}catch(err){reject(getMutatedError(err,SCRIPT_LOAD_ERROR(id,url)));}});};

    /**
     * Service to load external resources/files
     */var ExternalSrcLoader=/*#__PURE__*/function(){function ExternalSrcLoader(errorHandler,logger){var timeout=arguments.length>2&&arguments[2]!==undefined?arguments[2]:DEFAULT_EXT_SRC_LOAD_TIMEOUT_MS;_classCallCheck(this,ExternalSrcLoader);_defineProperty(this,"hasErrorHandler",false);this.errorHandler=errorHandler;this.logger=logger;this.timeout=timeout;this.hasErrorHandler=Boolean(this.errorHandler);this.onError=this.onError.bind(this);}/**
     * Load external resource of type javascript
     */_createClass(ExternalSrcLoader,[{key:"loadJSFile",value:function loadJSFile(config){var _this=this;var url=config.url,id=config.id,timeout=config.timeout,async=config.async,callback=config.callback,extraAttributes=config.extraAttributes;var isFireAndForget=!(callback&&isFunction(callback));jsFileLoader(url,id,timeout||this.timeout,async,extraAttributes).then(function(id){if(!isFireAndForget){callback(id);}}).catch(function(err){_this.onError(err);if(!isFireAndForget){callback();}});}/**
         * Handle errors
         */},{key:"onError",value:function onError(error){if(this.hasErrorHandler){var _this$errorHandler;(_this$errorHandler=this.errorHandler)===null||_this$errorHandler===void 0?void 0:_this$errorHandler.onError(error,EXTERNAL_SRC_LOADER);}else {throw error;}}}]);return ExternalSrcLoader;}();

    function i(){throw new Error("Cycle detected");}function t(){if(!(h>1)){var i,t=!1;while(void 0!==n){var o=n;n=void 0;s++;while(void 0!==o){var r=o.o;o.o=void 0;o.f&=-3;if(!(8&o.f)&&c(o))try{o.c();}catch(o){if(!t){i=o;t=!0;}}o=r;}}s=0;h--;if(t)throw i;}else h--;}function o(i){if(h>0)return i();h++;try{return i();}finally{t();}}var r=void 0,n=void 0,h=0,s=0,f=0;function v(i){if(void 0!==r){var t=i.n;if(void 0===t||t.t!==r){t={i:0,S:i,p:r.s,n:void 0,t:r,e:void 0,x:void 0,r:t};if(void 0!==r.s)r.s.n=t;r.s=t;i.n=t;if(32&r.f)i.S(t);return t;}else if(-1===t.i){t.i=0;if(void 0!==t.n){t.n.p=t.p;if(void 0!==t.p)t.p.n=t.n;t.p=r.s;t.n=void 0;r.s.n=t;r.s=t;}return t;}}}function e(i){this.v=i;this.i=0;this.n=void 0;this.t=void 0;}e.prototype.h=function(){return !0;};e.prototype.S=function(i){if(this.t!==i&&void 0===i.e){i.x=this.t;if(void 0!==this.t)this.t.e=i;this.t=i;}};e.prototype.U=function(i){if(void 0!==this.t){var t=i.e,o=i.x;if(void 0!==t){t.x=o;i.e=void 0;}if(void 0!==o){o.e=t;i.x=void 0;}if(i===this.t)this.t=o;}};e.prototype.subscribe=function(i){var t=this;return b(function(){var o=t.value,r=32&this.f;this.f&=-33;try{i(o);}finally{this.f|=r;}});};e.prototype.valueOf=function(){return this.value;};e.prototype.toString=function(){return this.value+"";};e.prototype.toJSON=function(){return this.value;};e.prototype.peek=function(){return this.v;};Object.defineProperty(e.prototype,"value",{get:function get(){var i=v(this);if(void 0!==i)i.i=this.i;return this.v;},set:function set(o){if(r instanceof l)!function(){throw new Error("Computed cannot have side-effects");}();if(o!==this.v){if(s>100)i();this.v=o;this.i++;f++;h++;try{for(var n=this.t;void 0!==n;n=n.x)n.t.N();}finally{t();}}}});function u(i){return new e(i);}function c(i){for(var t=i.s;void 0!==t;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return !0;return !1;}function d(i){for(var t=i.s;void 0!==t;t=t.n){var o=t.S.n;if(void 0!==o)t.r=o;t.S.n=t;t.i=-1;if(void 0===t.n){i.s=t;break;}}}function a(i){var t=i.s,o=void 0;while(void 0!==t){var r=t.p;if(-1===t.i){t.S.U(t);if(void 0!==r)r.n=t.n;if(void 0!==t.n)t.n.p=r;}else o=t;t.S.n=t.r;if(void 0!==t.r)t.r=void 0;t=r;}i.s=o;}function l(i){e.call(this,void 0);this.x=i;this.s=void 0;this.g=f-1;this.f=4;}(l.prototype=new e()).h=function(){this.f&=-3;if(1&this.f)return !1;if(32==(36&this.f))return !0;this.f&=-5;if(this.g===f)return !0;this.g=f;this.f|=1;if(this.i>0&&!c(this)){this.f&=-2;return !0;}var i=r;try{d(this);r=this;var t=this.x();if(16&this.f||this.v!==t||0===this.i){this.v=t;this.f&=-17;this.i++;}}catch(i){this.v=i;this.f|=16;this.i++;}r=i;a(this);this.f&=-2;return !0;};l.prototype.S=function(i){if(void 0===this.t){this.f|=36;for(var t=this.s;void 0!==t;t=t.n)t.S.S(t);}e.prototype.S.call(this,i);};l.prototype.U=function(i){if(void 0!==this.t){e.prototype.U.call(this,i);if(void 0===this.t){this.f&=-33;for(var t=this.s;void 0!==t;t=t.n)t.S.U(t);}}};l.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var i=this.t;void 0!==i;i=i.x)i.t.N();}};l.prototype.peek=function(){if(!this.h())i();if(16&this.f)throw this.v;return this.v;};Object.defineProperty(l.prototype,"value",{get:function get(){if(1&this.f)i();var t=v(this);this.h();if(void 0!==t)t.i=this.i;if(16&this.f)throw this.v;return this.v;}});function y(i){var o=i.u;i.u=void 0;if("function"==typeof o){h++;var n=r;r=void 0;try{o();}catch(t){i.f&=-2;i.f|=8;_(i);throw t;}finally{r=n;t();}}}function _(i){for(var t=i.s;void 0!==t;t=t.n)t.S.U(t);i.x=void 0;i.s=void 0;y(i);}function p(i){if(r!==this)throw new Error("Out-of-order effect");a(this);r=i;this.f&=-2;if(8&this.f)_(this);t();}function g(i){this.x=i;this.u=void 0;this.s=void 0;this.o=void 0;this.f=32;}g.prototype.c=function(){var i=this.S();try{if(8&this.f)return;if(void 0===this.x)return;var t=this.x();if("function"==typeof t)this.u=t;}finally{i();}};g.prototype.S=function(){if(1&this.f)i();this.f|=1;this.f&=-9;y(this);d(this);h++;var t=r;r=this;return p.bind(this,t);};g.prototype.N=function(){if(!(2&this.f)){this.f|=2;this.o=n;n=this;}};g.prototype.d=function(){this.f|=8;if(!(1&this.f))_(this);};function b(i){var t=new g(i);try{t.c();}catch(i){t.d();throw i;}return t.d.bind(t);}

    var LifecycleStatus=/*#__PURE__*/function(LifecycleStatus){LifecycleStatus["Mounted"]="mounted";LifecycleStatus["BrowserCapabilitiesReady"]="browserCapabilitiesReady";LifecycleStatus["Configured"]="configured";LifecycleStatus["PluginsLoading"]="pluginsLoading";LifecycleStatus["PluginsReady"]="pluginsReady";LifecycleStatus["Initialized"]="initialized";LifecycleStatus["Loaded"]="loaded";LifecycleStatus["DestinationsLoading"]="destinationsLoading";LifecycleStatus["DestinationsReady"]="destinationsReady";LifecycleStatus["Ready"]="ready";return LifecycleStatus;}({});

// TODO: should we take the types from IdentifyTrait instead of any string key?
//  https://www.rudderstack.com/docs/event-spec/standard-events/identify/#identify-traits
    /**
     * Represents the options parameter in the APIs
     */var RudderEventType=/*#__PURE__*/function(RudderEventType){RudderEventType["Page"]="page";RudderEventType["Track"]="track";RudderEventType["Identify"]="identify";RudderEventType["Alias"]="alias";RudderEventType["Group"]="group";return RudderEventType;}({});

    var _LOG_LEVEL_MAP;var LOG_LEVEL_MAP=(_LOG_LEVEL_MAP={},_defineProperty(_LOG_LEVEL_MAP,LogLevel.Log,0),_defineProperty(_LOG_LEVEL_MAP,LogLevel.Info,1),_defineProperty(_LOG_LEVEL_MAP,LogLevel.Debug,2),_defineProperty(_LOG_LEVEL_MAP,LogLevel.Warn,3),_defineProperty(_LOG_LEVEL_MAP,LogLevel.Error,4),_defineProperty(_LOG_LEVEL_MAP,LogLevel.None,5),_LOG_LEVEL_MAP);var DEFAULT_LOG_LEVEL=LogLevel.Error;var LOG_MSG_PREFIX='RS SDK';var LOG_MSG_PREFIX_STYLE='font-weight: bold; background: black; color: white;';var LOG_MSG_STYLE='font-weight: normal;';/**
     * Service to log messages/data to output provider, default is console
     */var Logger=/*#__PURE__*/function(){function Logger(){var minLogLevel=arguments.length>0&&arguments[0]!==undefined?arguments[0]:DEFAULT_LOG_LEVEL;var scope=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';var logProvider=arguments.length>2&&arguments[2]!==undefined?arguments[2]:console;_classCallCheck(this,Logger);this.minLogLevel=LOG_LEVEL_MAP[minLogLevel];this.scope=scope;this.logProvider=logProvider;}_createClass(Logger,[{key:"log",value:function log(){for(var _len=arguments.length,data=new Array(_len),_key=0;_key<_len;_key++){data[_key]=arguments[_key];}this.outputLog(LogLevel.Log,data);}},{key:"info",value:function info(){for(var _len2=arguments.length,data=new Array(_len2),_key2=0;_key2<_len2;_key2++){data[_key2]=arguments[_key2];}this.outputLog(LogLevel.Info,data);}},{key:"debug",value:function debug(){for(var _len3=arguments.length,data=new Array(_len3),_key3=0;_key3<_len3;_key3++){data[_key3]=arguments[_key3];}this.outputLog(LogLevel.Debug,data);}},{key:"warn",value:function warn(){for(var _len4=arguments.length,data=new Array(_len4),_key4=0;_key4<_len4;_key4++){data[_key4]=arguments[_key4];}this.outputLog(LogLevel.Warn,data);}},{key:"error",value:function error(){for(var _len5=arguments.length,data=new Array(_len5),_key5=0;_key5<_len5;_key5++){data[_key5]=arguments[_key5];}this.outputLog(LogLevel.Error,data);}},{key:"outputLog",value:function outputLog(logMethod,data){if(this.minLogLevel<=LOG_LEVEL_MAP[logMethod]){var _this$logProvider;(_this$logProvider=this.logProvider)[logMethod.toLowerCase()].apply(_this$logProvider,_toConsumableArray(this.formatLogData(data)));}}},{key:"setScope",value:function setScope(scopeVal){this.scope=scopeVal||this.scope;}// TODO: should we allow to change the level via global variable on run time
//  to assist on the fly debugging?
    },{key:"setMinLogLevel",value:function setMinLogLevel(logLevel){this.minLogLevel=LOG_LEVEL_MAP[logLevel];if(isUndefined(this.minLogLevel)){this.minLogLevel=LOG_LEVEL_MAP[DEFAULT_LOG_LEVEL];}}/**
         * Formats the console message using `scope` and styles
         */},{key:"formatLogData",value:function formatLogData(data){if(Array.isArray(data)&&data.length>0){// prefix SDK identifier
            var msg="%c ".concat(LOG_MSG_PREFIX);// format the log message using `scope`
            if(this.scope){msg="".concat(msg," - ").concat(this.scope);}// trim whitespaces for original message
            var originalMsg=isString(data[0])?data[0].trim():'';// prepare the final message
            msg="".concat(msg," %c ").concat(originalMsg);var styledLogArgs=[msg,LOG_MSG_PREFIX_STYLE,// add style for the prefix
                LOG_MSG_STYLE// reset the style for the actual message
            ];// add first it if it was not a string msg
            if(!isString(data[0])){styledLogArgs.push(data[0]);}// append rest of the original arguments
            styledLogArgs.push.apply(styledLogArgs,_toConsumableArray(data.slice(1)));return styledLogArgs;}return data;}}]);return Logger;}();var defaultLogger=new Logger();

    var StorageEncryptionVersion=/*#__PURE__*/function(StorageEncryptionVersion){StorageEncryptionVersion["Legacy"]="legacy";StorageEncryptionVersion["V3"]="v3";return StorageEncryptionVersion;}({});// default
    var SUPPORTED_STORAGE_TYPES=['localStorage','memoryStorage','cookieStorage','sessionStorage','none'];var DEFAULT_STORAGE_TYPE='cookieStorage';

    var SOURCE_CONFIG_OPTION_ERROR="\"getSourceConfig\" must be a function. Please make sure that it is defined and returns a valid source configuration object.";var INTG_CDN_BASE_URL_ERROR="Failed to load the SDK as the CDN base URL for integrations is not valid.";var PLUGINS_CDN_BASE_URL_ERROR="Failed to load the SDK as the CDN base URL for plugins is not valid.";var DATA_PLANE_URL_ERROR="Failed to load the SDK as the data plane URL could not be determined. Please check that the data plane URL is set correctly and try again.";var XHR_PAYLOAD_PREP_ERROR="Failed to prepare data for the request.";var EVENT_OBJECT_GENERATION_ERROR="Failed to generate the event object.";var PLUGIN_EXT_POINT_MISSING_ERROR="Failed to invoke plugin because the extension point name is missing.";var PLUGIN_EXT_POINT_INVALID_ERROR="Failed to invoke plugin because the extension point name is invalid.";// ERROR
    var UNSUPPORTED_CONSENT_MANAGER_ERROR=function UNSUPPORTED_CONSENT_MANAGER_ERROR(context,selectedConsentManager,consentManagersToPluginNameMap){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The consent manager \"").concat(selectedConsentManager,"\" is not supported. Please choose one of the following supported consent managers: \"").concat(Object.keys(consentManagersToPluginNameMap),"\".");};var REPORTING_PLUGIN_INIT_FAILURE_ERROR=function REPORTING_PLUGIN_INIT_FAILURE_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to initialize the error reporting plugin.");};var NOTIFY_FAILURE_ERROR=function NOTIFY_FAILURE_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to notify the error.");};var PLUGIN_NAME_MISSING_ERROR=function PLUGIN_NAME_MISSING_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Plugin name is missing.");};var PLUGIN_ALREADY_EXISTS_ERROR=function PLUGIN_ALREADY_EXISTS_ERROR(context,pluginName){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Plugin \"").concat(pluginName,"\" already exists.");};var PLUGIN_NOT_FOUND_ERROR=function PLUGIN_NOT_FOUND_ERROR(context,pluginName){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Plugin \"").concat(pluginName,"\" not found.");};var PLUGIN_ENGINE_BUG_ERROR=function PLUGIN_ENGINE_BUG_ERROR(context,pluginName){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Plugin \"").concat(pluginName,"\" not found in plugins but found in byName. This indicates a bug in the plugin engine. Please report this issue to the development team.");};var PLUGIN_DEPS_ERROR=function PLUGIN_DEPS_ERROR(context,pluginName,notExistDeps){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Plugin \"").concat(pluginName,"\" could not be loaded because some of its dependencies \"").concat(notExistDeps,"\" do not exist.");};var PLUGIN_INVOCATION_ERROR=function PLUGIN_INVOCATION_ERROR(context,extPoint,pluginName){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to invoke the \"").concat(extPoint,"\" extension point of plugin \"").concat(pluginName,"\".");};var STORAGE_UNAVAILABILITY_ERROR_PREFIX=function STORAGE_UNAVAILABILITY_ERROR_PREFIX(context,storageType){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The \"").concat(storageType,"\" storage type is ");};var SOURCE_CONFIG_FETCH_ERROR=function SOURCE_CONFIG_FETCH_ERROR(reason){return "Failed to fetch the source config. Reason: ".concat(reason);};var WRITE_KEY_VALIDATION_ERROR=function WRITE_KEY_VALIDATION_ERROR(writeKey){return "The write key \"".concat(writeKey,"\" is invalid. It must be a non-empty string. Please check that the write key is correct and try again.");};var DATA_PLANE_URL_VALIDATION_ERROR=function DATA_PLANE_URL_VALIDATION_ERROR(dataPlaneUrl){return "The data plane URL \"".concat(dataPlaneUrl,"\" is invalid. It must be a valid URL string. Please check that the data plane URL is correct and try again.");};var READY_API_CALLBACK_ERROR=function READY_API_CALLBACK_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The callback is not a function.");};var XHR_DELIVERY_ERROR=function XHR_DELIVERY_ERROR(prefix,status,statusText,url){return "".concat(prefix," with status: ").concat(status,", ").concat(statusText," for URL: ").concat(url,".");};var XHR_REQUEST_ERROR=function XHR_REQUEST_ERROR(prefix,e,url){return "".concat(prefix," due to timeout or no connection (").concat(e?e.type:'',") for URL: ").concat(url,".");};var XHR_SEND_ERROR=function XHR_SEND_ERROR(prefix,url){return "".concat(prefix," for URL: ").concat(url);};var STORE_DATA_SAVE_ERROR=function STORE_DATA_SAVE_ERROR(key){return "Failed to save the value for \"".concat(key,"\" to storage");};var STORE_DATA_FETCH_ERROR=function STORE_DATA_FETCH_ERROR(key){return "Failed to retrieve or parse data for \"".concat(key,"\" from storage");};// WARNING
    var STORAGE_TYPE_VALIDATION_WARNING=function STORAGE_TYPE_VALIDATION_WARNING(context,storageType,defaultStorageType){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The storage type \"").concat(storageType,"\" is not supported. Please choose one of the following supported storage types: \"").concat(SUPPORTED_STORAGE_TYPES,"\". The default storage \"").concat(defaultStorageType,"\" will be used instead.");};var UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING=function UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING(context,selectedErrorReportingProvider,errorReportingProvidersToPluginNameMap,defaultProvider){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The error reporting provider \"").concat(selectedErrorReportingProvider,"\" is not supported. Please choose one of the following supported providers: \"").concat(Object.keys(errorReportingProvidersToPluginNameMap),"\". The default provider \"").concat(defaultProvider,"\" will be used instead.");};var UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING=function UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING(context,selectedStorageEncryptionVersion,storageEncryptionVersionsToPluginNameMap,defaultVersion){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The storage encryption version \"").concat(selectedStorageEncryptionVersion,"\" is not supported. Please choose one of the following supported versions: \"").concat(Object.keys(storageEncryptionVersionsToPluginNameMap),"\". The default version \"").concat(defaultVersion,"\" will be used instead.");};var STORAGE_DATA_MIGRATION_OVERRIDE_WARNING=function STORAGE_DATA_MIGRATION_OVERRIDE_WARNING(context,storageEncryptionVersion,defaultVersion){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The storage data migration has been disabled because the configured storage encryption version (").concat(storageEncryptionVersion,") is not the latest (").concat(defaultVersion,"). To enable storage data migration, please update the storage encryption version to the latest version.");};var UNSUPPORTED_RESIDENCY_SERVER_REGION_WARNING=function UNSUPPORTED_RESIDENCY_SERVER_REGION_WARNING(context,selectedResidencyServerRegion,defaultRegion){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The residency server region \"").concat(selectedResidencyServerRegion,"\" is not supported. Please choose one of the following supported regions: \"").concat(Object.values(ResidencyServerRegion),"\". The default region \"").concat(defaultRegion,"\" will be used instead.");};var RESERVED_KEYWORD_WARNING=function RESERVED_KEYWORD_WARNING(context,property,parentKeyPath,reservedElements){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The \"").concat(property,"\" property defined under \"").concat(parentKeyPath,"\" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (").concat(reservedElements,").");};var INVALID_CONTEXT_OBJECT_WARNING=function INVALID_CONTEXT_OBJECT_WARNING(logContext){return "".concat(logContext).concat(LOG_CONTEXT_SEPARATOR,"Please make sure that the \"context\" property in the event API's \"options\" argument is a valid object literal with key-value pairs.");};var UNSUPPORTED_BEACON_API_WARNING=function UNSUPPORTED_BEACON_API_WARNING(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The Beacon API is not supported by your browser. The events will be sent using XHR instead.");};var TIMEOUT_NOT_NUMBER_WARNING=function TIMEOUT_NOT_NUMBER_WARNING(context,timeout,defaultValue){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The session timeout value \"").concat(timeout,"\" is not a number. The default timeout of ").concat(defaultValue," ms will be used instead.");};var TIMEOUT_ZERO_WARNING=function TIMEOUT_ZERO_WARNING(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The session timeout value is 0, which disables the automatic session tracking feature. If you want to enable session tracking, please provide a positive integer value for the timeout.");};var TIMEOUT_NOT_RECOMMENDED_WARNING=function TIMEOUT_NOT_RECOMMENDED_WARNING(context,timeout,minTimeout){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The session timeout value ").concat(timeout," ms is less than the recommended minimum of ").concat(minTimeout," ms. Please consider increasing the timeout value to ensure optimal performance and reliability.");};var INVALID_SESSION_ID_WARNING=function INVALID_SESSION_ID_WARNING(context,sessionId,minSessionIdLength){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The provided session ID (").concat(sessionId,") is either invalid, not a positive integer, or not at least \"").concat(minSessionIdLength,"\" digits long. A new session ID will be auto-generated instead.");};var STORAGE_QUOTA_EXCEEDED_WARNING=function STORAGE_QUOTA_EXCEEDED_WARNING(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The storage is either full or unavailable, so the data will not be persisted. Switching to in-memory storage.");};var STORAGE_UNAVAILABLE_WARNING=function STORAGE_UNAVAILABLE_WARNING(context,selectedStorageType,finalStorageType){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The storage type \"").concat(selectedStorageType,"\" is not available. The SDK will be initialized with \"").concat(finalStorageType,"\" instead.");};var WRITE_KEY_NOT_A_STRING_ERROR=function WRITE_KEY_NOT_A_STRING_ERROR(context,writeKey){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The write key \"").concat(writeKey,"\" is not a string. Please check that the write key is correct and try again.");};var EMPTY_GROUP_CALL_ERROR=function EMPTY_GROUP_CALL_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The group() method must be called with at least one argument.");};var READY_CALLBACK_INVOKE_ERROR="Failed to invoke the ready callback";var API_CALLBACK_INVOKE_ERROR="API Callback Invocation Failed";var INVALID_CONFIG_URL_WARNING=function INVALID_CONFIG_URL_WARNING(context,configUrl){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The provided config URL \"").concat(configUrl,"\" is invalid. Using the default value instead.");};// DEBUG

    var DEFAULT_XHR_TIMEOUT_MS=10*1000;// 10 seconds
    var DEFAULT_COOKIE_MAX_AGE_MS=31536000*1000;// 1 year
    var DEFAULT_SESSION_TIMEOUT_MS=30*60*1000;// 30 minutes
    var MIN_SESSION_TIMEOUT_MS=10*1000;// 10 seconds
    var DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS=10*1000;// 10 seconds

    var BUILD_TYPE='legacy';var SDK_CDN_BASE_URL='https://cdn.rudderlabs.com';var CDN_ARCH_VERSION_DIR='v3';var CDN_INT_DIR='js-integrations';var CDN_PLUGINS_DIR='plugins';var DEST_SDK_BASE_URL="".concat(SDK_CDN_BASE_URL,"/beta/3.0.0-beta/").concat(BUILD_TYPE,"/").concat(CDN_INT_DIR);var PLUGINS_BASE_URL="".concat(SDK_CDN_BASE_URL,"/beta/3.0.0-beta/").concat(BUILD_TYPE,"/").concat(CDN_PLUGINS_DIR);// TODO: change the above to production URLs when beta phase is done
// const DEST_SDK_BASE_URL = `${SDK_CDN_BASE_URL}/latest/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${CDN_INT_DIR}`;
// const PLUGINS_BASE_URL = `${SDK_CDN_BASE_URL}/latest/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${CDN_PLUGINS_DIR}`;
    var DEFAULT_CONFIG_BE_URL='https://api.rudderstack.com';

    var _StorageEncryptionVer;var DEFAULT_ERROR_REPORTING_PROVIDER='bugsnag';var DEFAULT_STORAGE_ENCRYPTION_VERSION=StorageEncryptionVersion.V3;var ConsentManagersToPluginNameMap={oneTrust:PluginName.OneTrustConsentManager,ketch:PluginName.KetchConsentManager};var ErrorReportingProvidersToPluginNameMap=_defineProperty({},DEFAULT_ERROR_REPORTING_PROVIDER,PluginName.Bugsnag);var StorageEncryptionVersionsToPluginNameMap=(_StorageEncryptionVer={},_defineProperty(_StorageEncryptionVer,DEFAULT_STORAGE_ENCRYPTION_VERSION,PluginName.StorageEncryption),_defineProperty(_StorageEncryptionVer,StorageEncryptionVersion.Legacy,PluginName.StorageEncryptionLegacy),_StorageEncryptionVer);

    var defaultLoadOptions={logLevel:LogLevel.Error,configUrl:DEFAULT_CONFIG_BE_URL,loadIntegration:true,sessions:{autoTrack:true,timeout:DEFAULT_SESSION_TIMEOUT_MS},sameSiteCookie:CookieSameSite.Lax,polyfillIfRequired:true,integrations:{All:true},useBeacon:false,beaconQueueOptions:{},destinationsQueueOptions:{},queueOptions:{},lockIntegrationsVersion:false,uaChTrackLevel:UaChTrackLevel.None,plugins:[],useGlobalIntegrationsConfigInEvents:false,bufferDataPlaneEventsUntilReady:false,dataPlaneEventsBufferTimeout:DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS,storage:{encryption:{version:DEFAULT_STORAGE_ENCRYPTION_VERSION},migrate:false},sendAdblockPageOptions:{}};var loadOptionsState=u(clone$1(defaultLoadOptions));

    var defaultSessionInfo={autoTrack:true,timeout:DEFAULT_SESSION_TIMEOUT_MS};var sessionState={userId:u(undefined),userTraits:u(undefined),anonymousUserId:u(undefined),groupId:u(undefined),groupTraits:u(undefined),initialReferrer:u(undefined),initialReferringDomain:u(undefined),sessionInfo:u(_objectSpread2({},defaultSessionInfo))};

    var capabilitiesState={isOnline:u(true),storage:{isLocalStorageAvailable:u(false),isCookieStorageAvailable:u(false),isSessionStorageAvailable:u(false)},isBeaconAvailable:u(false),isLegacyDOM:u(false),isUaCHAvailable:u(false),isCryptoAvailable:u(false),isIE11:u(false),isAdBlocked:u(false)};

    var reportingState={isErrorReportingEnabled:u(false),isMetricsReportingEnabled:u(false),errorReportingProviderPluginName:u(undefined)};

    var sourceConfigState=u(undefined);

    var lifecycleState={activeDataplaneUrl:u(undefined),integrationsCDNPath:u(DEST_SDK_BASE_URL),pluginsCDNPath:u(PLUGINS_BASE_URL),sourceConfigUrl:u(undefined),status:u(undefined),initialized:u(false),logLevel:u(LogLevel.Error),loaded:u(false),readyCallbacks:u([]),writeKey:u(undefined),dataPlaneUrl:u(undefined)};

    var consentsState={data:u({initialized:false}),activeConsentManagerPluginName:u(undefined)};

    var metricsState={retries:u(0),dropped:u(0),sent:u(0),queued:u(0),triggered:u(0)};

    var contextState={app:u({name:APP_NAME,namespace:APP_NAMESPACE,version:APP_VERSION}),traits:u(null),library:u({name:APP_NAME,version:APP_VERSION}),userAgent:u(''),device:u(null),network:u(null),os:u({name:'',version:''}),locale:u(null),screen:u({density:0,width:0,height:0,innerWidth:0,innerHeight:0}),'ua-ch':u(undefined),campaign:u({})};

    var nativeDestinationsState={configuredDestinations:u([]),activeDestinations:u([]),loadOnlyIntegrations:u({}),failedDestinations:u([]),loadIntegration:u(true),initializedDestinations:u([]),clientDestinationsReady:u(false),integrationsConfig:u({})};

    var eventBufferState={toBeProcessedArray:u([]),readyCallbacksArray:u([])};

    var pluginsState={ready:u(false),loadedPlugins:u([]),failedPlugins:u([]),pluginsToLoadFromConfig:u([]),activePlugins:u([]),totalPluginsToLoad:u(0)};

    var pagePropertiesState={path:u(''),referrer:u(''),referring_domain:u(''),search:u(''),title:u(''),url:u(''),tab_url:u('')};

    var storageState={encryptionPluginName:u(undefined),migrate:u(false),type:u(undefined)};

    var defaultStateValues={capabilities:capabilitiesState,consents:consentsState,context:contextState,eventBuffer:eventBufferState,lifecycle:lifecycleState,loadOptions:loadOptionsState,metrics:metricsState,nativeDestinations:nativeDestinationsState,plugins:pluginsState,reporting:reportingState,session:sessionState,source:sourceConfigState,page:pagePropertiesState,storage:storageState};var state=_objectSpread2({},clone$1(defaultStateValues));

//  to next or return the value if it is the last one instead of an array per
//  plugin that is the normal invoke
// TODO: add invoke method for extension point that we know only one plugin can be used. add invokeMultiple and invokeSingle methods
    var PluginEngine=/*#__PURE__*/function(){function PluginEngine(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var logger=arguments.length>1?arguments[1]:undefined;_classCallCheck(this,PluginEngine);_defineProperty(this,"plugins",[]);_defineProperty(this,"byName",{});_defineProperty(this,"cache",{});_defineProperty(this,"config",{throws:true});this.config=_objectSpread2({throws:true},options);this.logger=logger;}_createClass(PluginEngine,[{key:"register",value:function register(plugin,state){if(!plugin.name){var errorMessage=PLUGIN_NAME_MISSING_ERROR(PLUGIN_ENGINE);if(this.config.throws){throw new Error(errorMessage);}else {var _this$logger;(_this$logger=this.logger)===null||_this$logger===void 0?void 0:_this$logger.error(errorMessage,plugin);}}if(this.byName[plugin.name]){var _errorMessage=PLUGIN_ALREADY_EXISTS_ERROR(PLUGIN_ENGINE,plugin.name);if(this.config.throws){throw new Error(_errorMessage);}else {var _this$logger2;(_this$logger2=this.logger)===null||_this$logger2===void 0?void 0:_this$logger2.error(_errorMessage);}}this.cache={};this.plugins=this.plugins.slice();var pos=this.plugins.length;this.plugins.forEach(function(pluginItem,index){var _pluginItem$deps;if((_pluginItem$deps=pluginItem.deps)!==null&&_pluginItem$deps!==void 0&&_pluginItem$deps.includes(plugin.name)){pos=Math.min(pos,index);}});this.plugins.splice(pos,0,plugin);this.byName[plugin.name]=plugin;if(plugin.initialize&&isFunction(plugin.initialize)){plugin.initialize(state);}}},{key:"unregister",value:function unregister(name){var plugin=this.byName[name];if(!plugin){var errorMessage=PLUGIN_NOT_FOUND_ERROR(PLUGIN_ENGINE,name);if(this.config.throws){throw new Error(errorMessage);}else {var _this$logger3;(_this$logger3=this.logger)===null||_this$logger3===void 0?void 0:_this$logger3.error(errorMessage);}}var index=this.plugins.indexOf(plugin);if(index===-1){var _errorMessage2=PLUGIN_ENGINE_BUG_ERROR(PLUGIN_ENGINE,name);if(this.config.throws){throw new Error(_errorMessage2);}else {var _this$logger4;(_this$logger4=this.logger)===null||_this$logger4===void 0?void 0:_this$logger4.error(_errorMessage2);}}this.cache={};delete this.byName[name];this.plugins=this.plugins.slice();this.plugins.splice(index,1);}},{key:"getPlugin",value:function getPlugin(name){return this.byName[name];}},{key:"getPlugins",value:function getPlugins(extPoint){var _this=this;var lifeCycleName=extPoint!==null&&extPoint!==void 0?extPoint:'.';if(!this.cache[lifeCycleName]){this.cache[lifeCycleName]=this.plugins.filter(function(plugin){var _plugin$deps;if((_plugin$deps=plugin.deps)!==null&&_plugin$deps!==void 0&&_plugin$deps.some(function(dependency){return !_this.byName[dependency];})){var _this$logger5;// If deps not exist, then not load it.
            var notExistDeps=plugin.deps.filter(function(dependency){return !_this.byName[dependency];});(_this$logger5=_this.logger)===null||_this$logger5===void 0?void 0:_this$logger5.error(PLUGIN_DEPS_ERROR(PLUGIN_ENGINE,plugin.name,notExistDeps));return false;}return lifeCycleName==='.'?true:hasValueByPath(plugin,lifeCycleName);});}return this.cache[lifeCycleName];}// This method allows to process this.plugins so that it could
// do some unified pre-process before application starts.
    },{key:"processRawPlugins",value:function processRawPlugins(callback){callback(this.plugins);this.cache={};}},{key:"invoke",value:function invoke(extPoint){var _this$config$throws,_this2=this;var allowMultiple=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;for(var _len=arguments.length,args=new Array(_len>2?_len-2:0),_key=2;_key<_len;_key++){args[_key-2]=arguments[_key];}var extensionPointName=extPoint;if(!extensionPointName){throw new Error(PLUGIN_EXT_POINT_MISSING_ERROR);}var noCall=extensionPointName.startsWith('!');var throws=(_this$config$throws=this.config.throws)!==null&&_this$config$throws!==void 0?_this$config$throws:extensionPointName.endsWith('!');// eslint-disable-next-line unicorn/better-regex
            extensionPointName=extensionPointName.replace(/(^!|!$)/g,'');if(!extensionPointName){throw new Error(PLUGIN_EXT_POINT_INVALID_ERROR);}var extensionPointNameParts=extensionPointName.split('.');extensionPointNameParts.pop();var pluginMethodPath=extensionPointNameParts.join('.');var pluginsToInvoke=allowMultiple?this.getPlugins(extensionPointName):[this.getPlugins(extensionPointName)[0]];return pluginsToInvoke.map(function(plugin){var method=getValueByPath(plugin,extensionPointName);if(!isFunction(method)||noCall){return method;}try{return method.apply(getValueByPath(plugin,pluginMethodPath),args);}catch(err){// When a plugin failed, doesn't break the app
                if(throws){throw err;}else {var _this2$logger;(_this2$logger=_this2.logger)===null||_this2$logger===void 0?void 0:_this2$logger.error(PLUGIN_INVOCATION_ERROR(PLUGIN_ENGINE,extensionPointName,plugin.name),err);}}return null;});}},{key:"invokeSingle",value:function invokeSingle(extPoint){for(var _len2=arguments.length,args=new Array(_len2>1?_len2-1:0),_key2=1;_key2<_len2;_key2++){args[_key2-1]=arguments[_key2];}return this.invoke.apply(this,[extPoint,false].concat(args))[0];}},{key:"invokeMultiple",value:function invokeMultiple(extPoint){for(var _len3=arguments.length,args=new Array(_len3>1?_len3-1:0),_key3=1;_key3<_len3;_key3++){args[_key3-1]=arguments[_key3];}return this.invoke.apply(this,[extPoint,true].concat(args));}}]);return PluginEngine;}();var defaultPluginEngine=new PluginEngine({throws:true},defaultLogger);

    var FAILED_REQUEST_ERR_MSG_PREFIX='The request failed';var ERROR_MESSAGES_TO_BE_FILTERED=[FAILED_REQUEST_ERR_MSG_PREFIX];

    /**
     * Utility method to normalise errors
     */var processError=function processError(error){var errorMessage;try{if(isString(error)){errorMessage=error;}else if(error instanceof Error){errorMessage=error.message;}else {errorMessage=error.message?error.message:stringifyWithoutCircular(error);}}catch(e){errorMessage="Unknown error: ".concat(e.message);}return errorMessage;};/**
     * A function to determine whether the error should be promoted to notify or not
     * @param {Error} error
     * @returns
     */var isAllowedToBeNotified=function isAllowedToBeNotified(error){if(error.message){return !ERROR_MESSAGES_TO_BE_FILTERED.some(function(e){return error.message.includes(e);});}return true;};

    /**
     * A service to handle errors
     */var ErrorHandler=/*#__PURE__*/function(){// If no logger is passed errors will be thrown as unhandled error
        function ErrorHandler(logger,pluginEngine){_classCallCheck(this,ErrorHandler);this.logger=logger;this.pluginEngine=pluginEngine;}_createClass(ErrorHandler,[{key:"init",value:function init(externalSrcLoader){var _this=this;if(!this.pluginEngine){return;}try{var extPoint='errorReporting.init';var errReportingInitVal=this.pluginEngine.invokeSingle(extPoint,state,this.pluginEngine,externalSrcLoader,this.logger);if(errReportingInitVal instanceof Promise){errReportingInitVal.then(function(client){_this.errReportingClient=client;}).catch(function(err){var _this$logger;(_this$logger=_this.logger)===null||_this$logger===void 0?void 0:_this$logger.error(REPORTING_PLUGIN_INIT_FAILURE_ERROR(ERROR_HANDLER),err);});}}catch(err){this.onError(err,ERROR_HANDLER);}}},{key:"onError",value:function onError(error){var context=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';var customMessage=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'';var shouldAlwaysThrow=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;// Error handling is already implemented in processError method
                var errorMessage=processError(error);// If no error message after we normalize, then we swallow/ignore the errors
                if(!errorMessage){return;}errorMessage=removeDoubleSpaces("".concat(context).concat(LOG_CONTEXT_SEPARATOR).concat(customMessage," ").concat(errorMessage));var normalizedError=error;// Enhance error message
                if(isTypeOfError(error)){normalizedError.message=errorMessage;}else {normalizedError=new Error(errorMessage);}this.notifyError(normalizedError);if(this.logger){this.logger.error(errorMessage);if(shouldAlwaysThrow){throw normalizedError;}}else {throw normalizedError;}}/**
             * Add breadcrumbs to add insight of a user's journey before an error
             * occurred and send to external error monitoring service via a plugin
             *
             * @param {string} breadcrumb breadcrumbs message
             */},{key:"leaveBreadcrumb",value:function leaveBreadcrumb(breadcrumb){if(this.pluginEngine){try{this.pluginEngine.invokeSingle('errorReporting.breadcrumb',this.pluginEngine,this.errReportingClient,breadcrumb,this.logger);}catch(err){this.onError(err,ERROR_HANDLER,'errorReporting.breadcrumb');}}}/**
             * Send handled errors to external error monitoring service via a plugin
             *
             * @param {Error} error Error instance from handled error
             */},{key:"notifyError",value:function notifyError(error){if(this.pluginEngine&&isAllowedToBeNotified(error)){try{this.pluginEngine.invokeSingle('errorReporting.notify',this.pluginEngine,this.errReportingClient,error,state,this.logger);}catch(err){var _this$logger2;// Not calling onError here as we don't want to go into infinite loop
                (_this$logger2=this.logger)===null||_this$logger2===void 0?void 0:_this$logger2.error(NOTIFY_FAILURE_ERROR(ERROR_HANDLER),err);}}}}]);return ErrorHandler;}();var defaultErrorHandler=new ErrorHandler(defaultLogger,defaultPluginEngine);

    var DestinationConnectionMode=/*#__PURE__*/function(DestinationConnectionMode){DestinationConnectionMode["Hybrid"]="hybrid";DestinationConnectionMode["Cloud"]="cloud";DestinationConnectionMode["Device"]="device";return DestinationConnectionMode;}({});

    /**
     * A function to filter and return non cloud mode destinations
     * @param destination
     *
     * @returns boolean
     */var isNonCloudDestination=function isNonCloudDestination(destination){return Boolean(destination.config.connectionMode!==DestinationConnectionMode.Cloud||destination.config.useNativeSDKToSend===true||// this is the older flag for hybrid mode destinations
      destination.config.useNativeSDK===true);};var isHybridModeDestination=function isHybridModeDestination(destination){return Boolean(destination.config.connectionMode===DestinationConnectionMode.Hybrid||destination.config.useNativeSDKToSend===true);};/**
     * A function to filter and return non cloud mode destinations
     * @param destinations
     *
     * @returns destinations
     */var getNonCloudDestinations=function getNonCloudDestinations(destinations){return destinations.filter(isNonCloudDestination);};

    /**
     * List of plugin names that are loaded as dynamic imports in modern builds
     */var remotePluginNames=[PluginName.BeaconQueue,PluginName.DeviceModeTransformation,PluginName.DeviceModeDestinations,PluginName.ErrorReporting,PluginName.ExternalAnonymousId,PluginName.GoogleLinker,PluginName.NativeDestinationQueue,PluginName.StorageEncryption,PluginName.StorageEncryptionLegacy,PluginName.StorageMigrator,PluginName.XhrQueue,PluginName.OneTrustConsentManager,PluginName.KetchConsentManager,PluginName.Bugsnag];

    /**
     * To get the current timestamp in ISO string format
     * @returns ISO formatted timestamp string
     */var getCurrentTimeFormatted=function getCurrentTimeFormatted(){var curDateTime=new Date().toISOString();return curDateTime;};

    function random(len){return crypto.getRandomValues(new Uint8Array(len));}

    var SIZE=4096,HEX$1=[],IDX$1=0,BUFFER$1;for(;IDX$1<256;IDX$1++){HEX$1[IDX$1]=(IDX$1+256).toString(16).substring(1);}function v4$1(){if(!BUFFER$1||IDX$1+16>SIZE){BUFFER$1=random(SIZE);IDX$1=0;}var i=0,tmp,out='';for(;i<16;i++){tmp=BUFFER$1[IDX$1+i];if(i==6)out+=HEX$1[tmp&15|64];else if(i==8)out+=HEX$1[tmp&63|128];else out+=HEX$1[tmp];if(i&1&&i>1&&i<11)out+='-';}IDX$1+=16;return out;}

    var IDX=256,HEX=[],BUFFER;while(IDX--)HEX[IDX]=(IDX+256).toString(16).substring(1);function v4(){var i=0,num,out='';if(!BUFFER||IDX+16>256){BUFFER=Array(i=256);while(i--)BUFFER[i]=256*Math.random()|0;i=IDX=0;}for(;i<16;i++){num=BUFFER[IDX+i];if(i==6)out+=HEX[num&15|64];else if(i==8)out+=HEX[num&63|128];else out+=HEX[num];if(i&1&&i>1&&i<11)out+='-';}IDX++;return out;}

    var hasCrypto$1=function hasCrypto(){return !isNullOrUndefined(globalThis.crypto)&&isFunction(globalThis.crypto.getRandomValues);};

    var generateUUID=function generateUUID(){if(hasCrypto$1()){return v4$1();}return v4();};

    var QueueStatuses={IN_PROGRESS:'inProgress',QUEUE:'queue',RECLAIM_START:'reclaimStart',RECLAIM_END:'reclaimEnd',ACK:'ack'};

    var _CNameMapping$18;var DIR_NAME$18='AdobeAnalytics';var NAME$18='ADOBE_ANALYTICS';var DISPLAY_NAME$18='Adobe Analytics';var DISPLAY_NAME_TO_DIR_NAME_MAP$18=_defineProperty({},DISPLAY_NAME$18,DIR_NAME$18);var CNameMapping$18=(_CNameMapping$18={'Adobe Analytics':NAME$18,ADOBEANALYTICS:NAME$18,'ADOBE ANALYTICS':NAME$18},_defineProperty(_CNameMapping$18,NAME$18,NAME$18),_defineProperty(_CNameMapping$18,"AdobeAnalytics",NAME$18),_defineProperty(_CNameMapping$18,"adobeanalytics",NAME$18),_defineProperty(_CNameMapping$18,'adobe analytics',NAME$18),_defineProperty(_CNameMapping$18,'Adobe analytics',NAME$18),_defineProperty(_CNameMapping$18,'adobe Analytics',NAME$18),_CNameMapping$18);

    var _CNameMapping$17;var DIR_NAME$17='Amplitude';var NAME$17='AM';var DISPLAY_NAME$17='Amplitude';var DISPLAY_NAME_TO_DIR_NAME_MAP$17=_defineProperty({},DISPLAY_NAME$17,DIR_NAME$17);var CNameMapping$17=(_CNameMapping$17={},_defineProperty(_CNameMapping$17,NAME$17,NAME$17),_defineProperty(_CNameMapping$17,"AMPLITUDE",NAME$17),_defineProperty(_CNameMapping$17,"Amplitude",NAME$17),_defineProperty(_CNameMapping$17,"am",NAME$17),_CNameMapping$17);

    var _CNameMapping$16;var DIR_NAME$16='Appcues';var NAME$16='APPCUES';var DISPLAY_NAME$16='Appcues';var DISPLAY_NAME_TO_DIR_NAME_MAP$16=_defineProperty({},DISPLAY_NAME$16,DIR_NAME$16);var CNameMapping$16=(_CNameMapping$16={},_defineProperty(_CNameMapping$16,NAME$16,NAME$16),_defineProperty(_CNameMapping$16,"Appcues",NAME$16),_defineProperty(_CNameMapping$16,'App Cues',NAME$16),_defineProperty(_CNameMapping$16,"appcues",NAME$16),_CNameMapping$16);

    var _CNameMapping$15;var DIR_NAME$15='BingAds';var NAME$15='BINGADS';var DISPLAY_NAME$15='Bing Ads';var DISPLAY_NAME_TO_DIR_NAME_MAP$15=_defineProperty({},DISPLAY_NAME$15,DIR_NAME$15);var CNameMapping$15=(_CNameMapping$15={},_defineProperty(_CNameMapping$15,NAME$15,NAME$15),_defineProperty(_CNameMapping$15,"BingAds",NAME$15),_defineProperty(_CNameMapping$15,"bingads",NAME$15),_defineProperty(_CNameMapping$15,'Bing Ads',NAME$15),_defineProperty(_CNameMapping$15,'Bing ads',NAME$15),_defineProperty(_CNameMapping$15,'bing Ads',NAME$15),_defineProperty(_CNameMapping$15,'bing ads',NAME$15),_CNameMapping$15);

    var _CNameMapping$14;var DIR_NAME$14='Braze';var NAME$14='BRAZE';var DISPLAY_NAME$14='Braze';var DISPLAY_NAME_TO_DIR_NAME_MAP$14=_defineProperty({},DISPLAY_NAME$14,DIR_NAME$14);var CNameMapping$14=(_CNameMapping$14={},_defineProperty(_CNameMapping$14,NAME$14,NAME$14),_defineProperty(_CNameMapping$14,"Braze",NAME$14),_defineProperty(_CNameMapping$14,"braze",NAME$14),_CNameMapping$14);

    var _CNameMapping$13;var DIR_NAME$13='Bugsnag';var NAME$13='BUGSNAG';var DISPLAY_NAME$13='Bugsnag';var DISPLAY_NAME_TO_DIR_NAME_MAP$13=_defineProperty({},DISPLAY_NAME$13,DIR_NAME$13);var CNameMapping$13=(_CNameMapping$13={},_defineProperty(_CNameMapping$13,NAME$13,NAME$13),_defineProperty(_CNameMapping$13,"bugsnag",NAME$13),_defineProperty(_CNameMapping$13,"Bugsnag",NAME$13),_CNameMapping$13);

    var _CNameMapping$12;var DIR_NAME$12='Chartbeat';var NAME$12='CHARTBEAT';var DISPLAY_NAME$12='Chartbeat';var DISPLAY_NAME_TO_DIR_NAME_MAP$12=_defineProperty({},DISPLAY_NAME$12,DIR_NAME$12);var CNameMapping$12=(_CNameMapping$12={},_defineProperty(_CNameMapping$12,NAME$12,NAME$12),_defineProperty(_CNameMapping$12,"Chartbeat",NAME$12),_defineProperty(_CNameMapping$12,"chartbeat",NAME$12),_defineProperty(_CNameMapping$12,'Chart Beat',NAME$12),_defineProperty(_CNameMapping$12,'chart beat',NAME$12),_CNameMapping$12);

    var _CNameMapping$11;var DIR_NAME$11='Clevertap';var NAME$11='CLEVERTAP';var DISPLAY_NAME$11='CleverTap';var DISPLAY_NAME_TO_DIR_NAME_MAP$11=_defineProperty({},DISPLAY_NAME$11,DIR_NAME$11);var CNameMapping$11=(_CNameMapping$11={},_defineProperty(_CNameMapping$11,NAME$11,NAME$11),_defineProperty(_CNameMapping$11,"Clevertap",NAME$11),_defineProperty(_CNameMapping$11,"clevertap",NAME$11),_CNameMapping$11);

    var _CNameMapping$10;var DIR_NAME$10='Comscore';var NAME$10='COMSCORE';var DISPLAY_NAME$10='Comscore';var DISPLAY_NAME_TO_DIR_NAME_MAP$10=_defineProperty({},DISPLAY_NAME$10,DIR_NAME$10);var CNameMapping$10=(_CNameMapping$10={},_defineProperty(_CNameMapping$10,NAME$10,NAME$10),_defineProperty(_CNameMapping$10,"Comscore",NAME$10),_defineProperty(_CNameMapping$10,'Com Score',NAME$10),_defineProperty(_CNameMapping$10,'com Score',NAME$10),_defineProperty(_CNameMapping$10,'com score',NAME$10),_defineProperty(_CNameMapping$10,'Com score',NAME$10),_CNameMapping$10);

    var _CNameMapping$$;var DIR_NAME$$='Criteo';var NAME$$='CRITEO';var DISPLAY_NAME$$='Criteo';var DISPLAY_NAME_TO_DIR_NAME_MAP$$=_defineProperty({},DISPLAY_NAME$$,DIR_NAME$$);var CNameMapping$$=(_CNameMapping$$={},_defineProperty(_CNameMapping$$,NAME$$,NAME$$),_defineProperty(_CNameMapping$$,"Criteo",NAME$$),_defineProperty(_CNameMapping$$,"criteo",NAME$$),_CNameMapping$$);

    var _CNameMapping$_;var DIR_NAME$_='CustomerIO';var NAME$_='CUSTOMERIO';var DISPLAY_NAME$_='Customer IO';var DISPLAY_NAME_TO_DIR_NAME_MAP$_=_defineProperty({},DISPLAY_NAME$_,DIR_NAME$_);var CNameMapping$_=(_CNameMapping$_={},_defineProperty(_CNameMapping$_,NAME$_,NAME$_),_defineProperty(_CNameMapping$_,"Customerio",NAME$_),_defineProperty(_CNameMapping$_,'Customer.io',NAME$_),_defineProperty(_CNameMapping$_,'CUSTOMER.IO',NAME$_),_defineProperty(_CNameMapping$_,'customer.io',NAME$_),_CNameMapping$_);

    var _CNameMapping$Z;var DIR_NAME$Z='Drip';var NAME$Z='DRIP';var DISPLAY_NAME$Z='Drip';var DISPLAY_NAME_TO_DIR_NAME_MAP$Z=_defineProperty({},DISPLAY_NAME$Z,DIR_NAME$Z);var CNameMapping$Z=(_CNameMapping$Z={},_defineProperty(_CNameMapping$Z,NAME$Z,NAME$Z),_defineProperty(_CNameMapping$Z,"Drip",NAME$Z),_defineProperty(_CNameMapping$Z,"drip",NAME$Z),_CNameMapping$Z);

    var _CNameMapping$Y;var DIR_NAME$Y='FacebookPixel';var NAME$Y='FACEBOOK_PIXEL';var DISPLAY_NAME$Y='Facebook Pixel';var DISPLAY_NAME_TO_DIR_NAME_MAP$Y=_defineProperty({},DISPLAY_NAME$Y,DIR_NAME$Y);var CNameMapping$Y=(_CNameMapping$Y={},_defineProperty(_CNameMapping$Y,NAME$Y,NAME$Y),_defineProperty(_CNameMapping$Y,'FB Pixel',NAME$Y),_defineProperty(_CNameMapping$Y,'Facebook Pixel',NAME$Y),_defineProperty(_CNameMapping$Y,'facebook pixel',NAME$Y),_defineProperty(_CNameMapping$Y,"fbpixel",NAME$Y),_defineProperty(_CNameMapping$Y,"FBPIXEL",NAME$Y),_defineProperty(_CNameMapping$Y,"FB_PIXEL",NAME$Y),_CNameMapping$Y);

    var _CNameMapping$X;var DIR_NAME$X='Fullstory';var NAME$X='FULLSTORY';var DISPLAY_NAME$X='Fullstory';var DISPLAY_NAME_TO_DIR_NAME_MAP$X=_defineProperty({},DISPLAY_NAME$X,DIR_NAME$X);var CNameMapping$X=(_CNameMapping$X={},_defineProperty(_CNameMapping$X,NAME$X,NAME$X),_defineProperty(_CNameMapping$X,"Fullstory",NAME$X),_defineProperty(_CNameMapping$X,"FullStory",NAME$X),_defineProperty(_CNameMapping$X,'full Story',NAME$X),_defineProperty(_CNameMapping$X,'Full Story',NAME$X),_defineProperty(_CNameMapping$X,'Full story',NAME$X),_defineProperty(_CNameMapping$X,'full story',NAME$X),_defineProperty(_CNameMapping$X,"fullstory",NAME$X),_CNameMapping$X);

    var _CNameMapping$W;var DIR_NAME$W='GA';var NAME$W='GA';var DISPLAY_NAME$W='Google Analytics';var DISPLAY_NAME_TO_DIR_NAME_MAP$W=_defineProperty({},DISPLAY_NAME$W,DIR_NAME$W);var CNameMapping$W=(_CNameMapping$W={},_defineProperty(_CNameMapping$W,NAME$W,NAME$W),_defineProperty(_CNameMapping$W,'Google Analytics',NAME$W),_defineProperty(_CNameMapping$W,"GoogleAnalytics",NAME$W),_defineProperty(_CNameMapping$W,'GOOGLE ANALYTICS',NAME$W),_defineProperty(_CNameMapping$W,'google analytics',NAME$W),_CNameMapping$W);

    var _CNameMapping$V;var DIR_NAME$V='GA4';var NAME$V='GA4';var DISPLAY_NAME$V='Google Analytics 4 (GA4)';var DISPLAY_NAME_TO_DIR_NAME_MAP$V=_defineProperty({},DISPLAY_NAME$V,DIR_NAME$V);var CNameMapping$V=(_CNameMapping$V={},_defineProperty(_CNameMapping$V,NAME$V,NAME$V),_defineProperty(_CNameMapping$V,'Google Analytics 4',NAME$V),_defineProperty(_CNameMapping$V,'Google analytics 4',NAME$V),_defineProperty(_CNameMapping$V,'google analytics 4',NAME$V),_defineProperty(_CNameMapping$V,'Google Analytics4',NAME$V),_defineProperty(_CNameMapping$V,'Google analytics4',NAME$V),_defineProperty(_CNameMapping$V,'google analytics4',NAME$V),_defineProperty(_CNameMapping$V,"GoogleAnalytics4",NAME$V),_CNameMapping$V);

    var _CNameMapping$U;var DIR_NAME$U='GoogleAds';var NAME$U='GOOGLEADS';var DISPLAY_NAME$U='Google Ads';var DISPLAY_NAME_TO_DIR_NAME_MAP$U=_defineProperty({},DISPLAY_NAME$U,DIR_NAME$U);var CNameMapping$U=(_CNameMapping$U={},_defineProperty(_CNameMapping$U,NAME$U,NAME$U),_defineProperty(_CNameMapping$U,'Google Ads',NAME$U),_defineProperty(_CNameMapping$U,"GoogleAds",NAME$U),_defineProperty(_CNameMapping$U,'GOOGLE ADS',NAME$U),_defineProperty(_CNameMapping$U,'google ads',NAME$U),_defineProperty(_CNameMapping$U,"googleads",NAME$U),_CNameMapping$U);

    var _CNameMapping$T;var DIR_NAME$T='GoogleOptimize';var NAME$T='GOOGLE_OPTIMIZE';var DISPLAY_NAME$T='Google Optimize';var DISPLAY_NAME_TO_DIR_NAME_MAP$T=_defineProperty({},DISPLAY_NAME$T,DIR_NAME$T);var CNameMapping$T=(_CNameMapping$T={},_defineProperty(_CNameMapping$T,NAME$T,NAME$T),_defineProperty(_CNameMapping$T,'Google Optimize',NAME$T),_defineProperty(_CNameMapping$T,"GoogleOptimize",NAME$T),_defineProperty(_CNameMapping$T,"Googleoptimize",NAME$T),_defineProperty(_CNameMapping$T,"GOOGLEOPTIMIZE",NAME$T),_defineProperty(_CNameMapping$T,'google optimize',NAME$T),_defineProperty(_CNameMapping$T,'Google optimize',NAME$T),_defineProperty(_CNameMapping$T,'GOOGLE OPTIMIZE',NAME$T),_CNameMapping$T);

    var _CNameMapping$S;var DIR_NAME$S='GoogleTagManager';var NAME$S='GTM';var DISPLAY_NAME$S='Google Tag Manager';var DISPLAY_NAME_TO_DIR_NAME_MAP$S=_defineProperty({},DISPLAY_NAME$S,DIR_NAME$S);var CNameMapping$S=(_CNameMapping$S={},_defineProperty(_CNameMapping$S,NAME$S,NAME$S),_defineProperty(_CNameMapping$S,'Google Tag Manager',NAME$S),_defineProperty(_CNameMapping$S,'google tag manager',NAME$S),_defineProperty(_CNameMapping$S,'googletag manager',NAME$S),_defineProperty(_CNameMapping$S,"googletagmanager",NAME$S),_CNameMapping$S);

    var _CNameMapping$R;var DIR_NAME$R='Heap';var NAME$R='HEAP';var DISPLAY_NAME$R='Heap.io';var DISPLAY_NAME_TO_DIR_NAME_MAP$R=_defineProperty({},DISPLAY_NAME$R,DIR_NAME$R);var CNameMapping$R=(_CNameMapping$R={},_defineProperty(_CNameMapping$R,NAME$R,NAME$R),_defineProperty(_CNameMapping$R,"Heap",NAME$R),_defineProperty(_CNameMapping$R,"heap",NAME$R),_defineProperty(_CNameMapping$R,'Heap.io',NAME$R),_CNameMapping$R);

    var _CNameMapping$Q;var DIR_NAME$Q='Hotjar';var NAME$Q='HOTJAR';var DISPLAY_NAME$Q='Hotjar';var DISPLAY_NAME_TO_DIR_NAME_MAP$Q=_defineProperty({},DISPLAY_NAME$Q,DIR_NAME$Q);var CNameMapping$Q=(_CNameMapping$Q={},_defineProperty(_CNameMapping$Q,NAME$Q,NAME$Q),_defineProperty(_CNameMapping$Q,"Hotjar",NAME$Q),_defineProperty(_CNameMapping$Q,"hotjar",NAME$Q),_defineProperty(_CNameMapping$Q,'Hot Jar',NAME$Q),_defineProperty(_CNameMapping$Q,'hot jar',NAME$Q),_CNameMapping$Q);

    var _CNameMapping$P;var DIR_NAME$P='HubSpot';var NAME$P='HS';var DISPLAY_NAME$P='HubSpot';var DISPLAY_NAME_TO_DIR_NAME_MAP$P=_defineProperty({},DISPLAY_NAME$P,DIR_NAME$P);var CNameMapping$P=(_CNameMapping$P={},_defineProperty(_CNameMapping$P,NAME$P,NAME$P),_defineProperty(_CNameMapping$P,"Hubspot",NAME$P),_defineProperty(_CNameMapping$P,"HUBSPOT",NAME$P),_defineProperty(_CNameMapping$P,'hub spot',NAME$P),_defineProperty(_CNameMapping$P,'Hub Spot',NAME$P),_defineProperty(_CNameMapping$P,'Hub spot',NAME$P),_CNameMapping$P);

    var _CNameMapping$O;var DIR_NAME$O='INTERCOM';var NAME$O='INTERCOM';var DISPLAY_NAME$O='Intercom';var DISPLAY_NAME_TO_DIR_NAME_MAP$O=_defineProperty({},DISPLAY_NAME$O,DIR_NAME$O);var CNameMapping$O=(_CNameMapping$O={},_defineProperty(_CNameMapping$O,NAME$O,NAME$O),_defineProperty(_CNameMapping$O,"Intercom",NAME$O),_defineProperty(_CNameMapping$O,"intercom",NAME$O),_CNameMapping$O);

    var _CNameMapping$N;var DIR_NAME$N='Keen';var NAME$N='KEEN';var DISPLAY_NAME$N='Keen';var DISPLAY_NAME_TO_DIR_NAME_MAP$N=_defineProperty({},DISPLAY_NAME$N,DIR_NAME$N);var CNameMapping$N=(_CNameMapping$N={},_defineProperty(_CNameMapping$N,NAME$N,NAME$N),_defineProperty(_CNameMapping$N,"Keen",NAME$N),_defineProperty(_CNameMapping$N,'Keen.io',NAME$N),_defineProperty(_CNameMapping$N,"keen",NAME$N),_defineProperty(_CNameMapping$N,'keen.io',NAME$N),_CNameMapping$N);

    var _CNameMapping$M;var DIR_NAME$M='Kissmetrics';var NAME$M='KISSMETRICS';var DISPLAY_NAME$M='Kiss Metrics';var DISPLAY_NAME_TO_DIR_NAME_MAP$M=_defineProperty({},DISPLAY_NAME$M,DIR_NAME$M);var CNameMapping$M=(_CNameMapping$M={},_defineProperty(_CNameMapping$M,NAME$M,NAME$M),_defineProperty(_CNameMapping$M,"Kissmetrics",NAME$M),_defineProperty(_CNameMapping$M,"kissmetrics",NAME$M),_CNameMapping$M);

    var _CNameMapping$L;var DIR_NAME$L='Klaviyo';var NAME$L='KLAVIYO';var DISPLAY_NAME$L='Klaviyo';var DISPLAY_NAME_TO_DIR_NAME_MAP$L=_defineProperty({},DISPLAY_NAME$L,DIR_NAME$L);var CNameMapping$L=(_CNameMapping$L={},_defineProperty(_CNameMapping$L,NAME$L,NAME$L),_defineProperty(_CNameMapping$L,"Klaviyo",NAME$L),_defineProperty(_CNameMapping$L,"klaviyo",NAME$L),_CNameMapping$L);

    var _CNameMapping$K;var DIR_NAME$K='LaunchDarkly';var NAME$K='LAUNCHDARKLY';var DISPLAY_NAME$K='LaunchDarkly';var DISPLAY_NAME_TO_DIR_NAME_MAP$K=_defineProperty({},DISPLAY_NAME$K,DIR_NAME$K);var CNameMapping$K=(_CNameMapping$K={},_defineProperty(_CNameMapping$K,NAME$K,NAME$K),_defineProperty(_CNameMapping$K,"LaunchDarkly",NAME$K),_defineProperty(_CNameMapping$K,"Launch_Darkly",NAME$K),_defineProperty(_CNameMapping$K,'Launch Darkly',NAME$K),_defineProperty(_CNameMapping$K,"launchDarkly",NAME$K),_defineProperty(_CNameMapping$K,'launch darkly',NAME$K),_CNameMapping$K);

    var _CNameMapping$J;var DIR_NAME$J='LinkedInInsightTag';var NAME$J='LINKEDIN_INSIGHT_TAG';var DISPLAY_NAME$J='Linkedin Insight Tag';var DISPLAY_NAME_TO_DIR_NAME_MAP$J=_defineProperty({},DISPLAY_NAME$J,DIR_NAME$J);var CNameMapping$J=(_CNameMapping$J={},_defineProperty(_CNameMapping$J,NAME$J,NAME$J),_defineProperty(_CNameMapping$J,'LinkedIn Insight Tag',NAME$J),_defineProperty(_CNameMapping$J,'LinkedIn insight tag',NAME$J),_defineProperty(_CNameMapping$J,'linkedIn insight tag',NAME$J),_defineProperty(_CNameMapping$J,"Linkedin_insight_tag",NAME$J),_defineProperty(_CNameMapping$J,"LinkedinInsighttag",NAME$J),_defineProperty(_CNameMapping$J,"LinkedinInsightTag",NAME$J),_defineProperty(_CNameMapping$J,"LinkedInInsightTag",NAME$J),_defineProperty(_CNameMapping$J,"Linkedininsighttag",NAME$J),_defineProperty(_CNameMapping$J,"LINKEDININSIGHTTAG",NAME$J),_defineProperty(_CNameMapping$J,"linkedininsighttag",NAME$J),_CNameMapping$J);

    var _CNameMapping$I;var DIR_NAME$I='Lotame';var NAME$I='LOTAME';var DISPLAY_NAME$I='Lotame';var DISPLAY_NAME_TO_DIR_NAME_MAP$I=_defineProperty({},DISPLAY_NAME$I,DIR_NAME$I);var CNameMapping$I=(_CNameMapping$I={},_defineProperty(_CNameMapping$I,NAME$I,NAME$I),_defineProperty(_CNameMapping$I,"Lotame",NAME$I),_defineProperty(_CNameMapping$I,"lotame",NAME$I),_CNameMapping$I);

    var _CNameMapping$H;var DIR_NAME$H='Lytics';var NAME$H='LYTICS';var DISPLAY_NAME$H='Lytics';var DISPLAY_NAME_TO_DIR_NAME_MAP$H=_defineProperty({},DISPLAY_NAME$H,DIR_NAME$H);var CNameMapping$H=(_CNameMapping$H={},_defineProperty(_CNameMapping$H,NAME$H,NAME$H),_defineProperty(_CNameMapping$H,"Lytics",NAME$H),_defineProperty(_CNameMapping$H,"lytics",NAME$H),_CNameMapping$H);

    var _CNameMapping$G;var DIR_NAME$G='Mixpanel';var NAME$G='MP';var DISPLAY_NAME$G='Mixpanel';var DISPLAY_NAME_TO_DIR_NAME_MAP$G=_defineProperty({},DISPLAY_NAME$G,DIR_NAME$G);var CNameMapping$G=(_CNameMapping$G={},_defineProperty(_CNameMapping$G,NAME$G,NAME$G),_defineProperty(_CNameMapping$G,"MIXPANEL",NAME$G),_defineProperty(_CNameMapping$G,"Mixpanel",NAME$G),_defineProperty(_CNameMapping$G,'MIX PANEL',NAME$G),_defineProperty(_CNameMapping$G,'Mix panel',NAME$G),_defineProperty(_CNameMapping$G,'Mix Panel',NAME$G),_CNameMapping$G);

    var _CNameMapping$F;var DIR_NAME$F='MoEngage';var NAME$F='MOENGAGE';var DISPLAY_NAME$F='MoEngage';var DISPLAY_NAME_TO_DIR_NAME_MAP$F=_defineProperty({},DISPLAY_NAME$F,DIR_NAME$F);var CNameMapping$F=(_CNameMapping$F={},_defineProperty(_CNameMapping$F,NAME$F,NAME$F),_defineProperty(_CNameMapping$F,"MoEngage",NAME$F),_defineProperty(_CNameMapping$F,"moengage",NAME$F),_defineProperty(_CNameMapping$F,"Moengage",NAME$F),_defineProperty(_CNameMapping$F,'Mo Engage',NAME$F),_defineProperty(_CNameMapping$F,'mo engage',NAME$F),_defineProperty(_CNameMapping$F,'Mo engage',NAME$F),_CNameMapping$F);

    var _CNameMapping$E;var DIR_NAME$E='Optimizely';var NAME$E='OPTIMIZELY';var DISPLAY_NAME$E='Optimizely Web';var DISPLAY_NAME_TO_DIR_NAME_MAP$E=_defineProperty({},DISPLAY_NAME$E,DIR_NAME$E);var CNameMapping$E=(_CNameMapping$E={},_defineProperty(_CNameMapping$E,NAME$E,NAME$E),_defineProperty(_CNameMapping$E,"Optimizely",NAME$E),_defineProperty(_CNameMapping$E,"optimizely",NAME$E),_CNameMapping$E);

    var _CNameMapping$D;var DIR_NAME$D='Pendo';var NAME$D='PENDO';var DISPLAY_NAME$D='Pendo';var DISPLAY_NAME_TO_DIR_NAME_MAP$D=_defineProperty({},DISPLAY_NAME$D,DIR_NAME$D);var CNameMapping$D=(_CNameMapping$D={},_defineProperty(_CNameMapping$D,NAME$D,NAME$D),_defineProperty(_CNameMapping$D,"Pendo",NAME$D),_defineProperty(_CNameMapping$D,"pendo",NAME$D),_CNameMapping$D);

    var _CNameMapping$C;var DIR_NAME$C='PinterestTag';var NAME$C='PINTEREST_TAG';var DISPLAY_NAME$C='Pinterest Tag';var DISPLAY_NAME_TO_DIR_NAME_MAP$C=_defineProperty({},DISPLAY_NAME$C,DIR_NAME$C);var CNameMapping$C=(_CNameMapping$C={},_defineProperty(_CNameMapping$C,NAME$C,NAME$C),_defineProperty(_CNameMapping$C,"PinterestTag",NAME$C),_defineProperty(_CNameMapping$C,"Pinterest_Tag",NAME$C),_defineProperty(_CNameMapping$C,"PINTERESTTAG",NAME$C),_defineProperty(_CNameMapping$C,"pinterest",NAME$C),_defineProperty(_CNameMapping$C,"PinterestAds",NAME$C),_defineProperty(_CNameMapping$C,"Pinterest_Ads",NAME$C),_defineProperty(_CNameMapping$C,"Pinterest",NAME$C),_defineProperty(_CNameMapping$C,'Pinterest Tag',NAME$C),_defineProperty(_CNameMapping$C,'Pinterest tag',NAME$C),_defineProperty(_CNameMapping$C,'PINTEREST TAG',NAME$C),_defineProperty(_CNameMapping$C,'pinterest tag',NAME$C),_defineProperty(_CNameMapping$C,'Pinterest Ads',NAME$C),_defineProperty(_CNameMapping$C,'Pinterest ads',NAME$C),_CNameMapping$C);

    var _CNameMapping$B;var DIR_NAME$B='PostAffiliatePro';var NAME$B='POST_AFFILIATE_PRO';var DISPLAY_NAME$B='Post Affiliate Pro';var DISPLAY_NAME_TO_DIR_NAME_MAP$B=_defineProperty({},DISPLAY_NAME$B,DIR_NAME$B);var CNameMapping$B=(_CNameMapping$B={},_defineProperty(_CNameMapping$B,NAME$B,NAME$B),_defineProperty(_CNameMapping$B,"PostAffiliatePro",NAME$B),_defineProperty(_CNameMapping$B,"Post_affiliate_pro",NAME$B),_defineProperty(_CNameMapping$B,'Post Affiliate Pro',NAME$B),_defineProperty(_CNameMapping$B,'Post affiliate pro',NAME$B),_defineProperty(_CNameMapping$B,'post affiliate pro',NAME$B),_defineProperty(_CNameMapping$B,"postaffiliatepro",NAME$B),_defineProperty(_CNameMapping$B,"POSTAFFILIATEPRO",NAME$B),_CNameMapping$B);

    var _CNameMapping$A;var DIR_NAME$A='Posthog';var NAME$A='POSTHOG';var DISPLAY_NAME$A='PostHog';var DISPLAY_NAME_TO_DIR_NAME_MAP$A=_defineProperty({},DISPLAY_NAME$A,DIR_NAME$A);var CNameMapping$A=(_CNameMapping$A={},_defineProperty(_CNameMapping$A,NAME$A,NAME$A),_defineProperty(_CNameMapping$A,"PostHog",NAME$A),_defineProperty(_CNameMapping$A,"Posthog",NAME$A),_defineProperty(_CNameMapping$A,"posthog",NAME$A),_defineProperty(_CNameMapping$A,'Post Hog',NAME$A),_defineProperty(_CNameMapping$A,'Post hog',NAME$A),_defineProperty(_CNameMapping$A,'post hog',NAME$A),_CNameMapping$A);

    var _CNameMapping$z;var DIR_NAME$z='ProfitWell';var NAME$z='PROFITWELL';var DISPLAY_NAME$z='ProfitWell';var DISPLAY_NAME_TO_DIR_NAME_MAP$z=_defineProperty({},DISPLAY_NAME$z,DIR_NAME$z);var CNameMapping$z=(_CNameMapping$z={},_defineProperty(_CNameMapping$z,NAME$z,NAME$z),_defineProperty(_CNameMapping$z,"ProfitWell",NAME$z),_defineProperty(_CNameMapping$z,"profitwell",NAME$z),_defineProperty(_CNameMapping$z,"Profitwell",NAME$z),_defineProperty(_CNameMapping$z,'Profit Well',NAME$z),_defineProperty(_CNameMapping$z,'profit well',NAME$z),_defineProperty(_CNameMapping$z,'Profit well',NAME$z),_CNameMapping$z);

    var _CNameMapping$y;var DIR_NAME$y='Qualtrics';var NAME$y='QUALTRICS';var DISPLAY_NAME$y='Qualtrics';var DISPLAY_NAME_TO_DIR_NAME_MAP$y=_defineProperty({},DISPLAY_NAME$y,DIR_NAME$y);var CNameMapping$y=(_CNameMapping$y={},_defineProperty(_CNameMapping$y,NAME$y,NAME$y),_defineProperty(_CNameMapping$y,"Qualtrics",NAME$y),_defineProperty(_CNameMapping$y,"qualtrics",NAME$y),_CNameMapping$y);

    var _CNameMapping$x;var DIR_NAME$x='QuantumMetric';var NAME$x='QUANTUMMETRIC';var DISPLAY_NAME$x='Quantum Metric';var DISPLAY_NAME_TO_DIR_NAME_MAP$x=_defineProperty({},DISPLAY_NAME$x,DIR_NAME$x);var CNameMapping$x=(_CNameMapping$x={},_defineProperty(_CNameMapping$x,NAME$x,NAME$x),_defineProperty(_CNameMapping$x,'Quantum Metric',NAME$x),_defineProperty(_CNameMapping$x,'quantum Metric',NAME$x),_defineProperty(_CNameMapping$x,'quantum metric',NAME$x),_defineProperty(_CNameMapping$x,"QuantumMetric",NAME$x),_defineProperty(_CNameMapping$x,"quantumMetric",NAME$x),_defineProperty(_CNameMapping$x,"quantummetric",NAME$x),_defineProperty(_CNameMapping$x,"Quantum_Metric",NAME$x),_CNameMapping$x);

    var _CNameMapping$w;var DIR_NAME$w='RedditPixel';var NAME$w='REDDIT_PIXEL';var DISPLAY_NAME$w='Reddit Pixel';var DISPLAY_NAME_TO_DIR_NAME_MAP$w=_defineProperty({},DISPLAY_NAME$w,DIR_NAME$w);var CNameMapping$w=(_CNameMapping$w={},_defineProperty(_CNameMapping$w,NAME$w,NAME$w),_defineProperty(_CNameMapping$w,"Reddit_Pixel",NAME$w),_defineProperty(_CNameMapping$w,"RedditPixel",NAME$w),_defineProperty(_CNameMapping$w,"REDDITPIXEL",NAME$w),_defineProperty(_CNameMapping$w,"redditpixel",NAME$w),_defineProperty(_CNameMapping$w,'Reddit Pixel',NAME$w),_defineProperty(_CNameMapping$w,'REDDIT PIXEL',NAME$w),_defineProperty(_CNameMapping$w,'reddit pixel',NAME$w),_CNameMapping$w);

    var _CNameMapping$v;var DIR_NAME$v='Sentry';var NAME$v='SENTRY';var DISPLAY_NAME$v='Sentry';var DISPLAY_NAME_TO_DIR_NAME_MAP$v=_defineProperty({},DISPLAY_NAME$v,DIR_NAME$v);var CNameMapping$v=(_CNameMapping$v={},_defineProperty(_CNameMapping$v,NAME$v,NAME$v),_defineProperty(_CNameMapping$v,"sentry",NAME$v),_defineProperty(_CNameMapping$v,"Sentry",NAME$v),_CNameMapping$v);

    var _CNameMapping$u;var DIR_NAME$u='SnapPixel';var NAME$u='SNAP_PIXEL';var DISPLAY_NAME$u='Snap Pixel';var DISPLAY_NAME_TO_DIR_NAME_MAP$u=_defineProperty({},DISPLAY_NAME$u,DIR_NAME$u);var CNameMapping$u=(_CNameMapping$u={},_defineProperty(_CNameMapping$u,NAME$u,NAME$u),_defineProperty(_CNameMapping$u,"Snap_Pixel",NAME$u),_defineProperty(_CNameMapping$u,"SnapPixel",NAME$u),_defineProperty(_CNameMapping$u,"SNAPPIXEL",NAME$u),_defineProperty(_CNameMapping$u,"snappixel",NAME$u),_defineProperty(_CNameMapping$u,'Snap Pixel',NAME$u),_defineProperty(_CNameMapping$u,'SNAP PIXEL',NAME$u),_defineProperty(_CNameMapping$u,'snap pixel',NAME$u),_CNameMapping$u);

    var _CNameMapping$t;var DIR_NAME$t='TVSquared';var NAME$t='TVSQUARED';var DISPLAY_NAME$t='TVSquared';var DISPLAY_NAME_TO_DIR_NAME_MAP$t=_defineProperty({},DISPLAY_NAME$t,DIR_NAME$t);var CNameMapping$t=(_CNameMapping$t={},_defineProperty(_CNameMapping$t,NAME$t,NAME$t),_defineProperty(_CNameMapping$t,"TVSquared",NAME$t),_defineProperty(_CNameMapping$t,"tvsquared",NAME$t),_defineProperty(_CNameMapping$t,"tvSquared",NAME$t),_defineProperty(_CNameMapping$t,"TvSquared",NAME$t),_defineProperty(_CNameMapping$t,"Tvsquared",NAME$t),_defineProperty(_CNameMapping$t,'TV Squared',NAME$t),_defineProperty(_CNameMapping$t,'tv squared',NAME$t),_defineProperty(_CNameMapping$t,'tv Squared',NAME$t),_CNameMapping$t);

    var _CNameMapping$s;var DIR_NAME$s='VWO';var NAME$s='VWO';var DISPLAY_NAME$s='VWO';var DISPLAY_NAME_TO_DIR_NAME_MAP$s=_defineProperty({},DISPLAY_NAME$s,DIR_NAME$s);var CNameMapping$s=(_CNameMapping$s={},_defineProperty(_CNameMapping$s,NAME$s,NAME$s),_defineProperty(_CNameMapping$s,"VisualWebsiteOptimizer",NAME$s),_defineProperty(_CNameMapping$s,"Visualwebsiteoptimizer",NAME$s),_defineProperty(_CNameMapping$s,"visualwebsiteoptimizer",NAME$s),_defineProperty(_CNameMapping$s,"vwo",NAME$s),_defineProperty(_CNameMapping$s,'Visual Website Optimizer',NAME$s),_defineProperty(_CNameMapping$s,'Visual website optimizer',NAME$s),_defineProperty(_CNameMapping$s,'visual website optimizer',NAME$s),_CNameMapping$s);

    var _CNameMapping$r;var DIR_NAME$r='GA360';var NAME$r='GA360';var DISPLAY_NAME$r='Google Analytics 360';var DISPLAY_NAME_TO_DIR_NAME_MAP$r=_defineProperty({},DISPLAY_NAME$r,DIR_NAME$r);var CNameMapping$r=(_CNameMapping$r={},_defineProperty(_CNameMapping$r,NAME$r,NAME$r),_defineProperty(_CNameMapping$r,'Google Analytics 360',NAME$r),_defineProperty(_CNameMapping$r,'Google analytics 360',NAME$r),_defineProperty(_CNameMapping$r,'google analytics 360',NAME$r),_defineProperty(_CNameMapping$r,'Google Analytics360',NAME$r),_defineProperty(_CNameMapping$r,'Google analytics360',NAME$r),_defineProperty(_CNameMapping$r,'google analytics360',NAME$r),_defineProperty(_CNameMapping$r,"GoogleAnalytics360",NAME$r),_defineProperty(_CNameMapping$r,'GA 360',NAME$r),_CNameMapping$r);

    var _CNameMapping$q;var DIR_NAME$q='Adroll';var NAME$q='ADROLL';var DISPLAY_NAME$q='Adroll';var DISPLAY_NAME_TO_DIR_NAME_MAP$q=_defineProperty({},DISPLAY_NAME$q,DIR_NAME$q);var CNameMapping$q=(_CNameMapping$q={},_defineProperty(_CNameMapping$q,NAME$q,NAME$q),_defineProperty(_CNameMapping$q,"Adroll",NAME$q),_defineProperty(_CNameMapping$q,'Ad roll',NAME$q),_defineProperty(_CNameMapping$q,'ad roll',NAME$q),_defineProperty(_CNameMapping$q,"adroll",NAME$q),_CNameMapping$q);

    var _CNameMapping$p;var DIR_NAME$p='DCMFloodlight';var NAME$p='DCM_FLOODLIGHT';var DISPLAY_NAME$p='DCM Floodlight';var DISPLAY_NAME_TO_DIR_NAME_MAP$p=_defineProperty({},DISPLAY_NAME$p,DIR_NAME$p);var CNameMapping$p=(_CNameMapping$p={},_defineProperty(_CNameMapping$p,NAME$p,NAME$p),_defineProperty(_CNameMapping$p,'DCM Floodlight',NAME$p),_defineProperty(_CNameMapping$p,'dcm floodlight',NAME$p),_defineProperty(_CNameMapping$p,'Dcm Floodlight',NAME$p),_defineProperty(_CNameMapping$p,"DCMFloodlight",NAME$p),_defineProperty(_CNameMapping$p,"dcmfloodlight",NAME$p),_defineProperty(_CNameMapping$p,"DcmFloodlight",NAME$p),_defineProperty(_CNameMapping$p,"dcm_floodlight",NAME$p),_defineProperty(_CNameMapping$p,"DCM_Floodlight",NAME$p),_CNameMapping$p);

    var _CNameMapping$o;var DIR_NAME$o='Matomo';var NAME$o='MATOMO';var DISPLAY_NAME$o='Matomo';var DISPLAY_NAME_TO_DIR_NAME_MAP$o=_defineProperty({},DISPLAY_NAME$o,DIR_NAME$o);var CNameMapping$o=(_CNameMapping$o={},_defineProperty(_CNameMapping$o,NAME$o,NAME$o),_defineProperty(_CNameMapping$o,"Matomo",NAME$o),_defineProperty(_CNameMapping$o,"matomo",NAME$o),_CNameMapping$o);

    var _CNameMapping$n;var DIR_NAME$n='Vero';var NAME$n='VERO';var DISPLAY_NAME$n='Vero';var DISPLAY_NAME_TO_DIR_NAME_MAP$n=_defineProperty({},DISPLAY_NAME$n,DIR_NAME$n);var CNameMapping$n=(_CNameMapping$n={},_defineProperty(_CNameMapping$n,NAME$n,NAME$n),_defineProperty(_CNameMapping$n,"Vero",NAME$n),_defineProperty(_CNameMapping$n,"vero",NAME$n),_CNameMapping$n);

    var _CNameMapping$m;var DIR_NAME$m='Mouseflow';var NAME$m='MOUSEFLOW';var DISPLAY_NAME$m='Mouseflow';var DISPLAY_NAME_TO_DIR_NAME_MAP$m=_defineProperty({},DISPLAY_NAME$m,DIR_NAME$m);var CNameMapping$m=(_CNameMapping$m={},_defineProperty(_CNameMapping$m,NAME$m,NAME$m),_defineProperty(_CNameMapping$m,"Mouseflow",NAME$m),_defineProperty(_CNameMapping$m,"mouseflow",NAME$m),_defineProperty(_CNameMapping$m,"mouseFlow",NAME$m),_defineProperty(_CNameMapping$m,"MouseFlow",NAME$m),_defineProperty(_CNameMapping$m,'Mouse flow',NAME$m),_defineProperty(_CNameMapping$m,'mouse flow',NAME$m),_defineProperty(_CNameMapping$m,'mouse Flow',NAME$m),_defineProperty(_CNameMapping$m,'Mouse Flow',NAME$m),_CNameMapping$m);

    var _CNameMapping$l;var DIR_NAME$l='Rockerbox';var NAME$l='ROCKERBOX';var DISPLAY_NAME$l='Rockerbox';var DISPLAY_NAME_TO_DIR_NAME_MAP$l=_defineProperty({},DISPLAY_NAME$l,DIR_NAME$l);var CNameMapping$l=(_CNameMapping$l={},_defineProperty(_CNameMapping$l,NAME$l,NAME$l),_defineProperty(_CNameMapping$l,"Rockerbox",NAME$l),_defineProperty(_CNameMapping$l,"rockerbox",NAME$l),_defineProperty(_CNameMapping$l,"RockerBox",NAME$l),_defineProperty(_CNameMapping$l,'Rocker box',NAME$l),_defineProperty(_CNameMapping$l,'rocker box',NAME$l),_defineProperty(_CNameMapping$l,'Rocker Box',NAME$l),_CNameMapping$l);

    var _CNameMapping$k;var DIR_NAME$k='ConvertFlow';var NAME$k='CONVERTFLOW';var DISPLAY_NAME$k='ConvertFlow';var DISPLAY_NAME_TO_DIR_NAME_MAP$k=_defineProperty({},DISPLAY_NAME$k,DIR_NAME$k);var CNameMapping$k=(_CNameMapping$k={},_defineProperty(_CNameMapping$k,NAME$k,NAME$k),_defineProperty(_CNameMapping$k,"Convertflow",NAME$k),_defineProperty(_CNameMapping$k,"convertflow",NAME$k),_defineProperty(_CNameMapping$k,"convertFlow",NAME$k),_defineProperty(_CNameMapping$k,"ConvertFlow",NAME$k),_defineProperty(_CNameMapping$k,'Convert flow',NAME$k),_defineProperty(_CNameMapping$k,'convert flow',NAME$k),_defineProperty(_CNameMapping$k,'convert Flow',NAME$k),_defineProperty(_CNameMapping$k,'Convert Flow',NAME$k),_defineProperty(_CNameMapping$k,'CONVERT FLOW',NAME$k),_CNameMapping$k);

    var _CNameMapping$j;var DIR_NAME$j='SnapEngage';var NAME$j='SNAPENGAGE';var DISPLAY_NAME$j='SnapEngage';var DISPLAY_NAME_TO_DIR_NAME_MAP$j=_defineProperty({},DISPLAY_NAME$j,DIR_NAME$j);var CNameMapping$j=(_CNameMapping$j={},_defineProperty(_CNameMapping$j,NAME$j,NAME$j),_defineProperty(_CNameMapping$j,"SnapEngage",NAME$j),_defineProperty(_CNameMapping$j,"Snap_Engage",NAME$j),_defineProperty(_CNameMapping$j,"snapengage",NAME$j),_defineProperty(_CNameMapping$j,'SNAP ENGAGE',NAME$j),_defineProperty(_CNameMapping$j,'Snap Engage',NAME$j),_defineProperty(_CNameMapping$j,'snap engage',NAME$j),_CNameMapping$j);

    var _CNameMapping$i;var DIR_NAME$i='LiveChat';var NAME$i='LIVECHAT';var DISPLAY_NAME$i='LiveChat';var DISPLAY_NAME_TO_DIR_NAME_MAP$i=_defineProperty({},DISPLAY_NAME$i,DIR_NAME$i);var CNameMapping$i=(_CNameMapping$i={},_defineProperty(_CNameMapping$i,NAME$i,NAME$i),_defineProperty(_CNameMapping$i,"LiveChat",NAME$i),_defineProperty(_CNameMapping$i,"Live_Chat",NAME$i),_defineProperty(_CNameMapping$i,"livechat",NAME$i),_defineProperty(_CNameMapping$i,'LIVE CHAT',NAME$i),_defineProperty(_CNameMapping$i,'Live Chat',NAME$i),_defineProperty(_CNameMapping$i,'live chat',NAME$i),_CNameMapping$i);

    var _CNameMapping$h;var DIR_NAME$h='Shynet';var NAME$h='SHYNET';var DISPLAY_NAME$h='Shynet';var DISPLAY_NAME_TO_DIR_NAME_MAP$h=_defineProperty({},DISPLAY_NAME$h,DIR_NAME$h);var CNameMapping$h=(_CNameMapping$h={},_defineProperty(_CNameMapping$h,NAME$h,NAME$h),_defineProperty(_CNameMapping$h,"shynet",NAME$h),_defineProperty(_CNameMapping$h,"ShyNet",NAME$h),_defineProperty(_CNameMapping$h,"shyNet",NAME$h),_defineProperty(_CNameMapping$h,"Shynet",NAME$h),_defineProperty(_CNameMapping$h,'shy net',NAME$h),_defineProperty(_CNameMapping$h,'Shy Net',NAME$h),_defineProperty(_CNameMapping$h,'shy Net',NAME$h),_defineProperty(_CNameMapping$h,'Shy net',NAME$h),_CNameMapping$h);

    var _CNameMapping$g;var DIR_NAME$g='Woopra';var NAME$g='WOOPRA';var DISPLAY_NAME$g='Woopra';var DISPLAY_NAME_TO_DIR_NAME_MAP$g=_defineProperty({},DISPLAY_NAME$g,DIR_NAME$g);var CNameMapping$g=(_CNameMapping$g={},_defineProperty(_CNameMapping$g,NAME$g,NAME$g),_defineProperty(_CNameMapping$g,"Woopra",NAME$g),_defineProperty(_CNameMapping$g,"woopra",NAME$g),_CNameMapping$g);

    var _CNameMapping$f;var DIR_NAME$f='RollBar';var NAME$f='ROLLBAR';var DISPLAY_NAME$f='RollBar';var DISPLAY_NAME_TO_DIR_NAME_MAP$f=_defineProperty({},DISPLAY_NAME$f,DIR_NAME$f);var CNameMapping$f=(_CNameMapping$f={},_defineProperty(_CNameMapping$f,NAME$f,NAME$f),_defineProperty(_CNameMapping$f,"RollBar",NAME$f),_defineProperty(_CNameMapping$f,"Roll_Bar",NAME$f),_defineProperty(_CNameMapping$f,"rollbar",NAME$f),_defineProperty(_CNameMapping$f,"Rollbar",NAME$f),_defineProperty(_CNameMapping$f,'ROLL BAR',NAME$f),_defineProperty(_CNameMapping$f,'Roll Bar',NAME$f),_defineProperty(_CNameMapping$f,'roll bar',NAME$f),_CNameMapping$f);

    var _CNameMapping$e;var DIR_NAME$e='QuoraPixel';var NAME$e='QUORA_PIXEL';var DISPLAY_NAME$e='Quora Pixel';var DISPLAY_NAME_TO_DIR_NAME_MAP$e=_defineProperty({},DISPLAY_NAME$e,DIR_NAME$e);var CNameMapping$e=(_CNameMapping$e={},_defineProperty(_CNameMapping$e,NAME$e,NAME$e),_defineProperty(_CNameMapping$e,'Quora Pixel',NAME$e),_defineProperty(_CNameMapping$e,'Quora pixel',NAME$e),_defineProperty(_CNameMapping$e,'QUORA PIXEL',NAME$e),_defineProperty(_CNameMapping$e,"QuoraPixel",NAME$e),_defineProperty(_CNameMapping$e,"Quorapixel",NAME$e),_defineProperty(_CNameMapping$e,"QUORAPIXEL",NAME$e),_defineProperty(_CNameMapping$e,"Quora_Pixel",NAME$e),_defineProperty(_CNameMapping$e,"quora_pixel",NAME$e),_defineProperty(_CNameMapping$e,"Quora",NAME$e),_CNameMapping$e);

    var _CNameMapping$d;var DIR_NAME$d='June';var NAME$d='JUNE';var DISPLAY_NAME$d='June';var DISPLAY_NAME_TO_DIR_NAME_MAP$d=_defineProperty({},DISPLAY_NAME$d,DIR_NAME$d);var CNameMapping$d=(_CNameMapping$d={},_defineProperty(_CNameMapping$d,NAME$d,NAME$d),_defineProperty(_CNameMapping$d,"June",NAME$d),_defineProperty(_CNameMapping$d,"june",NAME$d),_CNameMapping$d);

    var _CNameMapping$c;var DIR_NAME$c='Engage';var NAME$c='ENGAGE';var DISPLAY_NAME$c='Engage';var DISPLAY_NAME_TO_DIR_NAME_MAP$c=_defineProperty({},DISPLAY_NAME$c,DIR_NAME$c);var CNameMapping$c=(_CNameMapping$c={},_defineProperty(_CNameMapping$c,NAME$c,NAME$c),_defineProperty(_CNameMapping$c,"Engage",NAME$c),_defineProperty(_CNameMapping$c,"engage",NAME$c),_CNameMapping$c);

    var _CNameMapping$b;var DIR_NAME$b='Iterable';var NAME$b='ITERABLE';var DISPLAY_NAME$b='Iterable';var DISPLAY_NAME_TO_DIR_NAME_MAP$b=_defineProperty({},DISPLAY_NAME$b,DIR_NAME$b);var CNameMapping$b=(_CNameMapping$b={},_defineProperty(_CNameMapping$b,NAME$b,NAME$b),_defineProperty(_CNameMapping$b,"Iterable",NAME$b),_defineProperty(_CNameMapping$b,"iterable",NAME$b),_CNameMapping$b);

    var _CNameMapping$a;var DIR_NAME$a='YandexMetrica';var NAME$a='YANDEX_METRICA';var DISPLAY_NAME$a='Yandex.Metrica';var DISPLAY_NAME_TO_DIR_NAME_MAP$a=_defineProperty({},DISPLAY_NAME$a,DIR_NAME$a);var CNameMapping$a=(_CNameMapping$a={},_defineProperty(_CNameMapping$a,NAME$a,NAME$a),_defineProperty(_CNameMapping$a,"Yandexmetrica",NAME$a),_defineProperty(_CNameMapping$a,"yandexmetrica",NAME$a),_defineProperty(_CNameMapping$a,"yandexMetrica",NAME$a),_defineProperty(_CNameMapping$a,"YandexMetrica",NAME$a),_CNameMapping$a);

    var _CNameMapping$9;var DIR_NAME$9='Refiner';var NAME$9='REFINER';var DISPLAY_NAME$9='Refiner';var DISPLAY_NAME_TO_DIR_NAME_MAP$9=_defineProperty({},DISPLAY_NAME$9,DIR_NAME$9);var CNameMapping$9=(_CNameMapping$9={},_defineProperty(_CNameMapping$9,NAME$9,NAME$9),_defineProperty(_CNameMapping$9,"Refiner",NAME$9),_defineProperty(_CNameMapping$9,"refiner",NAME$9),_CNameMapping$9);

    var _CNameMapping$8;var DIR_NAME$8='Qualaroo';var NAME$8='QUALAROO';var DISPLAY_NAME$8='Qualaroo';var DISPLAY_NAME_TO_DIR_NAME_MAP$8=_defineProperty({},DISPLAY_NAME$8,DIR_NAME$8);var CNameMapping$8=(_CNameMapping$8={},_defineProperty(_CNameMapping$8,NAME$8,NAME$8),_defineProperty(_CNameMapping$8,"Qualaroo",NAME$8),_defineProperty(_CNameMapping$8,"qualaroo",NAME$8),_CNameMapping$8);

    var _CNameMapping$7;var DIR_NAME$7='Podsights';var NAME$7='PODSIGHTS';var DISPLAY_NAME$7='Podsights';var DISPLAY_NAME_TO_DIR_NAME_MAP$7=_defineProperty({},DISPLAY_NAME$7,DIR_NAME$7);var CNameMapping$7=(_CNameMapping$7={},_defineProperty(_CNameMapping$7,NAME$7,NAME$7),_defineProperty(_CNameMapping$7,"Podsights",NAME$7),_defineProperty(_CNameMapping$7,"PodSights",NAME$7),_defineProperty(_CNameMapping$7,'pod Sights',NAME$7),_defineProperty(_CNameMapping$7,'Pod Sights',NAME$7),_defineProperty(_CNameMapping$7,'pod sights',NAME$7),_defineProperty(_CNameMapping$7,'POD SIGHTS',NAME$7),_defineProperty(_CNameMapping$7,'Pod sights',NAME$7),_CNameMapping$7);// default mapping for the events

    var _CNameMapping$6;var DIR_NAME$6='Axeptio';var NAME$6='AXEPTIO';var DISPLAY_NAME$6='Axeptio';var DISPLAY_NAME_TO_DIR_NAME_MAP$6=_defineProperty({},DISPLAY_NAME$6,DIR_NAME$6);var CNameMapping$6=(_CNameMapping$6={},_defineProperty(_CNameMapping$6,NAME$6,NAME$6),_defineProperty(_CNameMapping$6,"Axeptio",NAME$6),_defineProperty(_CNameMapping$6,"axeptio",NAME$6),_CNameMapping$6);

    var _CNameMapping$5;var DIR_NAME$5='Satismeter';var NAME$5='SATISMETER';var DISPLAY_NAME$5='Satismeter';var DISPLAY_NAME_TO_DIR_NAME_MAP$5=_defineProperty({},DISPLAY_NAME$5,DIR_NAME$5);var CNameMapping$5=(_CNameMapping$5={},_defineProperty(_CNameMapping$5,NAME$5,NAME$5),_defineProperty(_CNameMapping$5,"Satismeter",NAME$5),_defineProperty(_CNameMapping$5,"SatisMeter",NAME$5),_CNameMapping$5);

    var _CNameMapping$4;var DIR_NAME$4='MicrosoftClarity';var NAME$4='MICROSOFT_CLARITY';var DISPLAY_NAME$4='Microsoft Clarity';var DISPLAY_NAME_TO_DIR_NAME_MAP$4=_defineProperty({},DISPLAY_NAME$4,DIR_NAME$4);var CNameMapping$4=(_CNameMapping$4={},_defineProperty(_CNameMapping$4,NAME$4,NAME$4),_defineProperty(_CNameMapping$4,'Microsoft Clarity',NAME$4),_defineProperty(_CNameMapping$4,'Microsoft clarity',NAME$4),_defineProperty(_CNameMapping$4,'microsoft clarity',NAME$4),_defineProperty(_CNameMapping$4,"Microsoft_clarity",NAME$4),_defineProperty(_CNameMapping$4,"MicrosoftClarity",NAME$4),_defineProperty(_CNameMapping$4,"MICROSOFTCLARITY",NAME$4),_defineProperty(_CNameMapping$4,"microsoftclarity",NAME$4),_defineProperty(_CNameMapping$4,"microsoftClarity",NAME$4),_CNameMapping$4);

    var _CNameMapping$3;var DIR_NAME$3='Sendinblue';var NAME$3='SENDINBLUE';var DISPLAY_NAME$3='Sendinblue';var DISPLAY_NAME_TO_DIR_NAME_MAP$3=_defineProperty({},DISPLAY_NAME$3,DIR_NAME$3);var CNameMapping$3=(_CNameMapping$3={},_defineProperty(_CNameMapping$3,NAME$3,NAME$3),_defineProperty(_CNameMapping$3,"Sendinblue",NAME$3),_defineProperty(_CNameMapping$3,"sendinblue",NAME$3),_defineProperty(_CNameMapping$3,"SendinBlue",NAME$3),_CNameMapping$3);

    var _CNameMapping$2;var DIR_NAME$2='Olark';var NAME$2='OLARK';var DISPLAY_NAME$2='Olark';var DISPLAY_NAME_TO_DIR_NAME_MAP$2=_defineProperty({},DISPLAY_NAME$2,DIR_NAME$2);var CNameMapping$2=(_CNameMapping$2={},_defineProperty(_CNameMapping$2,NAME$2,NAME$2),_defineProperty(_CNameMapping$2,"Olark",NAME$2),_defineProperty(_CNameMapping$2,"olark",NAME$2),_CNameMapping$2);

    var _CNameMapping$1;var DIR_NAME$1='Lemnisk';var NAME$1='LEMNISK';var DISPLAY_NAME$1='Lemnisk';var DISPLAY_NAME_TO_DIR_NAME_MAP$1=_defineProperty({},DISPLAY_NAME$1,DIR_NAME$1);var CNameMapping$1=(_CNameMapping$1={},_defineProperty(_CNameMapping$1,NAME$1,NAME$1),_defineProperty(_CNameMapping$1,"LEMNISK_MARKETING_AUTOMATION",NAME$1),_defineProperty(_CNameMapping$1,'Lemnisk Marketing Automation',NAME$1),_defineProperty(_CNameMapping$1,"LemniskMarketingAutomation",NAME$1),_defineProperty(_CNameMapping$1,"lemniskmarketingautomation",NAME$1),_defineProperty(_CNameMapping$1,"lemniskMarketingAutomation",NAME$1),_defineProperty(_CNameMapping$1,"lemnisk",NAME$1),_defineProperty(_CNameMapping$1,"Lemnisk",NAME$1),_CNameMapping$1);

    var _CNameMapping;var DIR_NAME='TiktokAds';var NAME='TIKTOK_ADS';var DISPLAY_NAME='TikTok Ads';var DISPLAY_NAME_TO_DIR_NAME_MAP=_defineProperty({},DISPLAY_NAME,DIR_NAME);var CNameMapping=(_CNameMapping={},_defineProperty(_CNameMapping,NAME,NAME),_defineProperty(_CNameMapping,"TiktokAds",NAME),_defineProperty(_CNameMapping,'Tiktok ads',NAME),_defineProperty(_CNameMapping,'Tiktok Ads',NAME),_defineProperty(_CNameMapping,'Tik Tok Ads',NAME),_defineProperty(_CNameMapping,'tik tok ads',NAME),_defineProperty(_CNameMapping,"tiktokads",NAME),_CNameMapping);

    var replaceValuesWithDisplayName=function replaceValuesWithDisplayName(CNameMapping,displayName){var updatedCNameMapping={};Object.keys(CNameMapping).forEach(function(key){updatedCNameMapping[key]=displayName;});return updatedCNameMapping;};// As the common names mapping in v1.1 is mapped to the definition name
// we're converting the definition name to display names temporarily
    var destCNamesToDisplayNamesMap=_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({},replaceValuesWithDisplayName(CNameMapping$18,DISPLAY_NAME$18)),replaceValuesWithDisplayName(CNameMapping$17,DISPLAY_NAME$17)),replaceValuesWithDisplayName(CNameMapping$16,DISPLAY_NAME$16)),replaceValuesWithDisplayName(CNameMapping$15,DISPLAY_NAME$15)),replaceValuesWithDisplayName(CNameMapping$14,DISPLAY_NAME$14)),replaceValuesWithDisplayName(CNameMapping$13,DISPLAY_NAME$13)),replaceValuesWithDisplayName(CNameMapping$12,DISPLAY_NAME$12)),replaceValuesWithDisplayName(CNameMapping$11,DISPLAY_NAME$11)),replaceValuesWithDisplayName(CNameMapping$10,DISPLAY_NAME$10)),replaceValuesWithDisplayName(CNameMapping$$,DISPLAY_NAME$$)),replaceValuesWithDisplayName(CNameMapping$_,DISPLAY_NAME$_)),replaceValuesWithDisplayName(CNameMapping$Z,DISPLAY_NAME$Z)),replaceValuesWithDisplayName(CNameMapping$Y,DISPLAY_NAME$Y)),replaceValuesWithDisplayName(CNameMapping$X,DISPLAY_NAME$X)),replaceValuesWithDisplayName(CNameMapping$W,DISPLAY_NAME$W)),replaceValuesWithDisplayName(CNameMapping$V,DISPLAY_NAME$V)),replaceValuesWithDisplayName(CNameMapping$r,DISPLAY_NAME$r)),replaceValuesWithDisplayName(CNameMapping$U,DISPLAY_NAME$U)),replaceValuesWithDisplayName(CNameMapping$T,DISPLAY_NAME$T)),replaceValuesWithDisplayName(CNameMapping$S,DISPLAY_NAME$S)),replaceValuesWithDisplayName(CNameMapping$R,DISPLAY_NAME$R)),replaceValuesWithDisplayName(CNameMapping$Q,DISPLAY_NAME$Q)),replaceValuesWithDisplayName(CNameMapping$P,DISPLAY_NAME$P)),replaceValuesWithDisplayName(CNameMapping$O,DISPLAY_NAME$O)),replaceValuesWithDisplayName(CNameMapping$N,DISPLAY_NAME$N)),replaceValuesWithDisplayName(CNameMapping$M,DISPLAY_NAME$M)),replaceValuesWithDisplayName(CNameMapping$L,DISPLAY_NAME$L)),replaceValuesWithDisplayName(CNameMapping$K,DISPLAY_NAME$K)),replaceValuesWithDisplayName(CNameMapping$J,DISPLAY_NAME$J)),replaceValuesWithDisplayName(CNameMapping$I,DISPLAY_NAME$I)),replaceValuesWithDisplayName(CNameMapping$H,DISPLAY_NAME$H)),replaceValuesWithDisplayName(CNameMapping$G,DISPLAY_NAME$G)),replaceValuesWithDisplayName(CNameMapping$F,DISPLAY_NAME$F)),replaceValuesWithDisplayName(CNameMapping$E,DISPLAY_NAME$E)),replaceValuesWithDisplayName(CNameMapping$D,DISPLAY_NAME$D)),replaceValuesWithDisplayName(CNameMapping$C,DISPLAY_NAME$C)),replaceValuesWithDisplayName(CNameMapping$B,DISPLAY_NAME$B)),replaceValuesWithDisplayName(CNameMapping$A,DISPLAY_NAME$A)),replaceValuesWithDisplayName(CNameMapping$z,DISPLAY_NAME$z)),replaceValuesWithDisplayName(CNameMapping$y,DISPLAY_NAME$y)),replaceValuesWithDisplayName(CNameMapping$x,DISPLAY_NAME$x)),replaceValuesWithDisplayName(CNameMapping$w,DISPLAY_NAME$w)),replaceValuesWithDisplayName(CNameMapping$v,DISPLAY_NAME$v)),replaceValuesWithDisplayName(CNameMapping$u,DISPLAY_NAME$u)),replaceValuesWithDisplayName(CNameMapping$t,DISPLAY_NAME$t)),replaceValuesWithDisplayName(CNameMapping$s,DISPLAY_NAME$s)),replaceValuesWithDisplayName(CNameMapping$q,DISPLAY_NAME$q)),replaceValuesWithDisplayName(CNameMapping$p,DISPLAY_NAME$p)),replaceValuesWithDisplayName(CNameMapping$o,DISPLAY_NAME$o)),replaceValuesWithDisplayName(CNameMapping$n,DISPLAY_NAME$n)),replaceValuesWithDisplayName(CNameMapping$m,DISPLAY_NAME$m)),replaceValuesWithDisplayName(CNameMapping$k,DISPLAY_NAME$k)),replaceValuesWithDisplayName(CNameMapping$j,DISPLAY_NAME$j)),replaceValuesWithDisplayName(CNameMapping$i,DISPLAY_NAME$i)),replaceValuesWithDisplayName(CNameMapping$h,DISPLAY_NAME$h)),replaceValuesWithDisplayName(CNameMapping$g,DISPLAY_NAME$g)),replaceValuesWithDisplayName(CNameMapping$f,DISPLAY_NAME$f)),replaceValuesWithDisplayName(CNameMapping$e,DISPLAY_NAME$e)),replaceValuesWithDisplayName(CNameMapping$d,DISPLAY_NAME$d)),replaceValuesWithDisplayName(CNameMapping$c,DISPLAY_NAME$c)),replaceValuesWithDisplayName(CNameMapping$b,DISPLAY_NAME$b)),replaceValuesWithDisplayName(CNameMapping$l,DISPLAY_NAME$l)),replaceValuesWithDisplayName(CNameMapping$a,DISPLAY_NAME$a)),replaceValuesWithDisplayName(CNameMapping$9,DISPLAY_NAME$9)),replaceValuesWithDisplayName(CNameMapping$8,DISPLAY_NAME$8)),replaceValuesWithDisplayName(CNameMapping$7,DISPLAY_NAME$7)),replaceValuesWithDisplayName(CNameMapping$6,DISPLAY_NAME$6)),replaceValuesWithDisplayName(CNameMapping$5,DISPLAY_NAME$5)),replaceValuesWithDisplayName(CNameMapping$4,DISPLAY_NAME$4)),replaceValuesWithDisplayName(CNameMapping$3,DISPLAY_NAME$3)),replaceValuesWithDisplayName(CNameMapping$2,DISPLAY_NAME$2)),replaceValuesWithDisplayName(CNameMapping$1,DISPLAY_NAME$1)),replaceValuesWithDisplayName(CNameMapping,DISPLAY_NAME));

    /**
     * Converts the common names of the destinations to their display names
     * @param intgOptions Load or API integration options
     */var normalizeIntegrationOptions=function normalizeIntegrationOptions(intgOptions){var normalizedIntegrationOptions={};if(intgOptions){Object.keys(intgOptions).forEach(function(key){var destOpts=clone$1(intgOptions[key]);if(key==='All'){normalizedIntegrationOptions[key]=Boolean(destOpts);}else {var displayName=destCNamesToDisplayNamesMap[key];if(displayName){normalizedIntegrationOptions[displayName]=destOpts;}else {normalizedIntegrationOptions[key]=destOpts;}}});}if(isUndefined(normalizedIntegrationOptions.All)){normalizedIntegrationOptions.All=true;}return normalizedIntegrationOptions;};

    var EVENT_PAYLOAD_SIZE_BYTES_LIMIT=32*1024;// 32 KB

    var INVALID_SOURCE_CONFIG_ERROR="Invalid source configuration or source id.";// ERROR
    var BEACON_QUEUE_SEND_ERROR=function BEACON_QUEUE_SEND_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to send events batch data to the browser's beacon queue. The events will be dropped.");};var BEACON_QUEUE_DELIVERY_ERROR=function BEACON_QUEUE_DELIVERY_ERROR(url){return "Failed to send events batch data to the browser's beacon queue for URL ".concat(url,".");};var BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR=function BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to convert events batch object to string.");};var BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR=function BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to convert events batch object to Blob.");};var BUGSNAG_SDK_LOAD_ERROR=function BUGSNAG_SDK_LOAD_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to load the Bugsnag SDK.");};var DESTINATION_NOT_SUPPORTED_ERROR=function DESTINATION_NOT_SUPPORTED_ERROR(destUserFriendlyId){return "Destination ".concat(destUserFriendlyId," is not supported.");};var DESTINATION_SDK_LOAD_ERROR=function DESTINATION_SDK_LOAD_ERROR(context,destUserFriendlyId){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to load script for destination ").concat(destUserFriendlyId,".");};var DESTINATION_INIT_ERROR=function DESTINATION_INIT_ERROR(destUserFriendlyId){return "Failed to initialize destination ".concat(destUserFriendlyId,".");};var DESTINATION_INTEGRATIONS_DATA_ERROR=function DESTINATION_INTEGRATIONS_DATA_ERROR(destUserFriendlyId){return "Failed to get integrations data for destination ".concat(destUserFriendlyId,".");};var DESTINATION_EVENT_FILTERING_WARNING=function DESTINATION_EVENT_FILTERING_WARNING(context,eventName,destUserFriendlyId){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The \"").concat(eventName,"\" track event has been filtered for the \"").concat(destUserFriendlyId,"\" destination.");};var ONETRUST_ACCESS_ERROR=function ONETRUST_ACCESS_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to access OneTrust SDK resources. Please ensure that the OneTrust SDK is loaded successfully before RudderStack SDK.");};var KETCH_CONSENT_COOKIE_READ_ERROR=function KETCH_CONSENT_COOKIE_READ_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to read the consent cookie.");};var KETCH_CONSENT_COOKIE_PARSE_ERROR=function KETCH_CONSENT_COOKIE_PARSE_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to parse the consent cookie.");};var DESTINATION_CONSENT_STATUS_ERROR="Failed to determine the consent status for the destination. Please check the destination configuration and try again.";var STORAGE_MIGRATION_ERROR=function STORAGE_MIGRATION_ERROR(key){return "Failed to retrieve or parse data for ".concat(key," from storage.");};var EVENT_STRINGIFY_ERROR=function EVENT_STRINGIFY_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to convert event object to string.");};var RETRY_QUEUE_PROCESS_ERROR=function RETRY_QUEUE_PROCESS_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Process function threw an error.");};var EVENT_PAYLOAD_PREPARATION_ERROR=function EVENT_PAYLOAD_PREPARATION_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to prepare the event payload for delivery. The event will be dropped.");};var EVENT_DELIVERY_FAILURE_ERROR_PREFIX=function EVENT_DELIVERY_FAILURE_ERROR_PREFIX(context,url){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to deliver event to ").concat(url,".");};var BUGSNAG_API_KEY_VALIDATION_ERROR=function BUGSNAG_API_KEY_VALIDATION_ERROR(apiKey){return "The Bugsnag API key (".concat(apiKey,") is invalid or not provided.");};var DESTINATION_READY_TIMEOUT_ERROR=function DESTINATION_READY_TIMEOUT_ERROR(timeout,destUserFriendlyId){return "A timeout of ".concat(timeout," ms occurred while trying to check the ready status for \"").concat(destUserFriendlyId,"\" destination.");};var DESTINATION_EVENT_FORWARDING_ERROR=function DESTINATION_EVENT_FORWARDING_ERROR(destUserFriendlyId){return "Failed to forward event to destination \"".concat(destUserFriendlyId,"\".");};var BUGSNAG_SDK_LOAD_TIMEOUT_ERROR=function BUGSNAG_SDK_LOAD_TIMEOUT_ERROR(timeout){return "A timeout ".concat(timeout," ms occurred while trying to load the Bugsnag SDK.");};// WARN
    var EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING=function EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING(context,payloadSize,sizeLimit){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The size of the event payload (").concat(payloadSize," bytes) exceeds the maximum limit of ").concat(sizeLimit," bytes. Events with large payloads may be dropped in the future. Please review your instrumentation to ensure that event payloads are within the size limit.");};var EVENT_PAYLOAD_SIZE_VALIDATION_WARNING=function EVENT_PAYLOAD_SIZE_VALIDATION_WARNING(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to validate event payload size. Please make sure that the event payload is within the size limit and is a valid JSON object.");};// DEBUG
    var BEACON_PLUGIN_EVENTS_QUEUE_DEBUG=function BEACON_PLUGIN_EVENTS_QUEUE_DEBUG(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Sending events to data plane.");};

    var QUEUE_UTILITIES='QueueUtilities';/**
     * Utility to get the stringified event payload
     * @param event RudderEvent object
     * @param logger Logger instance
     * @returns stringified event payload. Empty string if error occurs.
     */var getDeliveryPayload$1=function getDeliveryPayload(event,logger){var deliveryPayloadStr='';try{deliveryPayloadStr=stringifyWithoutCircular(event,true);}catch(err){logger===null||logger===void 0?void 0:logger.error(EVENT_STRINGIFY_ERROR(QUEUE_UTILITIES),err);}return deliveryPayloadStr;};/**
     * Utility to validate final payload size before sending to server
     * @param event RudderEvent object
     * @param logger Logger instance
     */var validateEventPayloadSize=function validateEventPayloadSize(event,logger){var payloadStr=getDeliveryPayload$1(event,logger);if(payloadStr){var payloadSize=payloadStr.length;if(payloadSize>EVENT_PAYLOAD_SIZE_BYTES_LIMIT){logger===null||logger===void 0?void 0:logger.warn(EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING(QUEUE_UTILITIES,payloadSize,EVENT_PAYLOAD_SIZE_BYTES_LIMIT));}}else {logger===null||logger===void 0?void 0:logger.warn(EVENT_PAYLOAD_SIZE_VALIDATION_WARNING(QUEUE_UTILITIES));}};/**
     * Filters and returns the user supplied integrations config that should take preference over the destination specific integrations config
     * @param eventIntgConfig User supplied integrations config at event level
     * @param destinationsIntgConfig Cumulative integrations config from all destinations
     * @returns Filtered user supplied integrations config
     */var getOverriddenIntegrationOptions=function getOverriddenIntegrationOptions(eventIntgConfig,destinationsIntgConfig){return Object.keys(eventIntgConfig).filter(function(intgName){return eventIntgConfig[intgName]!==true||!destinationsIntgConfig[intgName];}).reduce(function(obj,key){var retVal=clone$1(obj);retVal[key]=eventIntgConfig[key];return retVal;},{});};/**
     * Mutates the event and return final event for delivery
     * Updates certain parameters like sentAt timestamp, integrations config etc.
     * @param event RudderEvent object
     * @param state Application state
     * @returns Final event ready to be delivered
     */var getFinalEventForDeliveryMutator=function getFinalEventForDeliveryMutator(event,state){var finalEvent=clone$1(event);// Update sentAt timestamp to the latest timestamp
        finalEvent.sentAt=getCurrentTimeFormatted();// Merge the destination specific integrations config with the event's integrations config
// In general, the preference is given to the event's integrations config
        var eventIntgConfig=normalizeIntegrationOptions(event.integrations);var destinationsIntgConfig=state.nativeDestinations.integrationsConfig.value;var overriddenIntgOpts=getOverriddenIntegrationOptions(eventIntgConfig,destinationsIntgConfig);finalEvent.integrations=mergeDeepRight(destinationsIntgConfig,overriddenIntgOpts);return finalEvent;};

    var removeDuplicateSlashes=function removeDuplicateSlashes(str){return str.replace(/\/{2,}/g,'/');};

    var DEFAULT_BEACON_QUEUE_MAX_SIZE=10;var DEFAULT_BEACON_QUEUE_FLUSH_INTERVAL_MS=10*60*1000;// 10 minutes
// Limit of the Beacon transfer mechanism on the browsers
    var MAX_BATCH_PAYLOAD_SIZE_BYTES=64*1024;// 64 KB
    var DEFAULT_BEACON_QUEUE_OPTIONS={maxItems:DEFAULT_BEACON_QUEUE_MAX_SIZE,flushQueueInterval:DEFAULT_BEACON_QUEUE_FLUSH_INTERVAL_MS};var DATA_PLANE_API_VERSION$1='v1';var QUEUE_NAME$2='rudder_beacon';var BEACON_QUEUE_PLUGIN='BeaconQueuePlugin';

    /**
     * Utility to get the stringified event payload as Blob
     * @param events RudderEvent object array
     * @param logger Logger instance
     * @returns stringified events payload as Blob, undefined if error occurs.
     */var getDeliveryPayload=function getDeliveryPayload(events,logger){var data={batch:events};try{var blobPayload=stringifyWithoutCircular(data,true);var blobOptions={type:'text/plain'};if(blobPayload){return new Blob([blobPayload],blobOptions);}logger===null||logger===void 0?void 0:logger.error(BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR(BEACON_QUEUE_PLUGIN));}catch(err){logger===null||logger===void 0?void 0:logger.error(BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR(BEACON_QUEUE_PLUGIN),err);}return undefined;};var getNormalizedBeaconQueueOptions=function getNormalizedBeaconQueueOptions(queueOpts){return mergeDeepRight(DEFAULT_BEACON_QUEUE_OPTIONS,queueOpts);};var getDeliveryUrl$1=function getDeliveryUrl(dataplaneUrl,writeKey){var dpUrl=new URL(dataplaneUrl);return new URL(removeDuplicateSlashes([dpUrl.pathname,'/','beacon','/',DATA_PLANE_API_VERSION$1,'/',"batch?writeKey=".concat(writeKey)].join('')),dpUrl).href;};

    var COOKIE_STORAGE='cookieStorage';var LOCAL_STORAGE='localStorage';var SESSION_STORAGE='sessionStorage';var MEMORY_STORAGE='memoryStorage';var NO_STORAGE='none';

    var sortByTime$1=function sortByTime(a,b){return a.time-b.time;};var BeaconItemsQueue=/*#__PURE__*/function(){function BeaconItemsQueue(name,options,queueProcessCb,storeManager){var _options$maxItems,_options$flushQueueIn;var storageType=arguments.length>4&&arguments[4]!==undefined?arguments[4]:MEMORY_STORAGE;_classCallCheck(this,BeaconItemsQueue);this.storeManager=storeManager;this.name=name;this.id=generateUUID();this.processQueueCb=queueProcessCb;this.maxItems=(_options$maxItems=options.maxItems)!==null&&_options$maxItems!==void 0?_options$maxItems:DEFAULT_BEACON_QUEUE_OPTIONS.maxItems;this.timeouts={flushQueueTimeOutInterval:(_options$flushQueueIn=options.flushQueueInterval)!==null&&_options$flushQueueIn!==void 0?_options$flushQueueIn:DEFAULT_BEACON_QUEUE_OPTIONS.flushQueueInterval};this.flushInProgress=false;this.nextFlushPending=false;// Set up our empty queues
        this.store=this.storeManager.setStore({id:this.id,name:this.name,type:storageType});this.flushQueue=this.flushQueue.bind(this);this.attachListeners();this.flushQueueTimeOut=undefined;this.scheduleTimeoutActive=false;}_createClass(BeaconItemsQueue,[{key:"attachListeners",value:function attachListeners(){var _this=this;globalThis.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden'){_this.flushQueue();}});}},{key:"getQueue",value:function getQueue(name){var _this$store$get;return (_this$store$get=this.store.get(name!==null&&name!==void 0?name:this.name))!==null&&_this$store$get!==void 0?_this$store$get:[];}},{key:"setQueue",value:function setQueue(name,value){this.store.set(name!==null&&name!==void 0?name:this.name,value!==null&&value!==void 0?value:[]);}},{key:"start",value:function start(){if(!this.scheduleTimeoutActive){this.flushQueueTimeOut=globalThis.setTimeout(this.flushQueue,this.timeouts.flushQueueTimeOutInterval);this.scheduleTimeoutActive=true;}}},{key:"stop",value:function stop(){if(this.scheduleTimeoutActive){clearTimeout(this.flushQueueTimeOut);this.scheduleTimeoutActive=false;}}},{key:"enqueue",value:function enqueue(entry){var queue=this.getQueue();// Get max items from the queue minus one
            queue=queue.slice(-(this.maxItems-1));queue.push(entry);queue=queue.sort(sortByTime$1);// Calculate response payload size after the addition of new event
            var eventsToSend=queue.slice(0);var batchData=getDeliveryPayload(eventsToSend.map(function(queueItem){return queueItem.item.event;}));// Send events that existed in the queue if totaling more max payload size
            var isExceededMaxPayloadSize=Boolean(batchData&&batchData.length>MAX_BATCH_PAYLOAD_SIZE_BYTES);if(isExceededMaxPayloadSize){// Flush all previous items
                eventsToSend=queue.slice(0,queue.length-1);this.flushQueue(eventsToSend);// Add only latest item in the remaining queue that is cleared appropriately in flushQueue
                queue=this.getQueue();queue.push(entry);}this.setQueue(this.name,queue);// If queue has total of max items then flush
            if(queue.length===this.maxItems){this.flushQueue();}this.start();}},{key:"addItem",value:function addItem(item){this.enqueue({item:item,attemptNumber:0,time:Date.now(),id:generateUUID()});}},{key:"flushQueue",value:function flushQueue(queueItems){var _this2=this;if(!this.flushInProgress){this.flushInProgress=true;var batchItems=queueItems!==null&&queueItems!==void 0?queueItems:this.getQueue();var batchData=batchItems&&batchItems.length>0?batchItems.slice(0,batchItems.length):[];// TODO: add retry mechanism here
// eslint-disable-next-line @typescript-eslint/no-unused-vars
            var beaconSendCallback=function beaconSendCallback(error,response){_this2.setQueue(_this2.name,[]);_this2.stop();_this2.flushInProgress=false;if(_this2.nextFlushPending){_this2.nextFlushPending=false;_this2.flushQueue();}};if(batchData.length>0){this.processQueueCb(batchData,beaconSendCallback);return;}// If no items to send just clear timer
            beaconSendCallback(null);}else {this.nextFlushPending=true;}}}]);return BeaconItemsQueue;}();

    var pluginName$d='BeaconQueue';var BeaconQueue=function BeaconQueue(){return {name:pluginName$d,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$d]);},dataplaneEventsQueue:{/**
             * Initialize the queue for delivery
             * @param state Application state
             * @param httpClient http client instance
             * @param storeManager Store Manager instance
             * @param errorHandler Error handler instance
             * @param logger Logger instance
             * @returns BeaconItemsQueue instance
             */init:function init(state,httpClient,storeManager,errorHandler,logger){var _state$loadOptions$va;var writeKey=state.lifecycle.writeKey.value;var dataplaneUrl=state.lifecycle.activeDataplaneUrl.value;var url=getDeliveryUrl$1(dataplaneUrl,writeKey);var finalQOpts=getNormalizedBeaconQueueOptions((_state$loadOptions$va=state.loadOptions.value.beaconQueueOptions)!==null&&_state$loadOptions$va!==void 0?_state$loadOptions$va:{});var queueProcessCallback=function queueProcessCallback(queueItems,done){logger===null||logger===void 0?void 0:logger.debug(BEACON_PLUGIN_EVENTS_QUEUE_DEBUG(BEACON_QUEUE_PLUGIN));var finalEvents=queueItems.map(function(queueItem){return getFinalEventForDeliveryMutator(queueItem.item.event,state);});var data=getDeliveryPayload(finalEvents);if(data){try{var isEnqueuedInBeacon=navigator.sendBeacon(url,data);if(!isEnqueuedInBeacon){logger===null||logger===void 0?void 0:logger.error(BEACON_QUEUE_SEND_ERROR(BEACON_QUEUE_PLUGIN));}done(null,isEnqueuedInBeacon);}catch(err){errorHandler===null||errorHandler===void 0?void 0:errorHandler.onError(err,BEACON_QUEUE_PLUGIN,BEACON_QUEUE_DELIVERY_ERROR(url));done(err);}}else {// Mark the item as done so that it can be removed from the queue
                done(null);}};var eventsQueue=new BeaconItemsQueue("".concat(QUEUE_NAME$2,"_").concat(writeKey,"}"),finalQOpts,queueProcessCallback,storeManager);return eventsQueue;},/**
             * Add event to the queue for delivery
             * @param state Application state
             * @param eventsQueue IQueue instance
             * @param event RudderEvent object
             * @param errorHandler Error handler instance
             * @param logger Logger instance
             * @returns none
             */enqueue:function enqueue(state,eventsQueue,event,errorHandler,logger){// sentAt is only added here for the validation step
// It'll be updated to the latest timestamp during actual delivery
                event.sentAt=getCurrentTimeFormatted();validateEventPayloadSize(event,logger);eventsQueue.addItem({event:event});}}};};

    var destDisplayNamesToFileNamesMap=_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({},DISPLAY_NAME_TO_DIR_NAME_MAP$P),DISPLAY_NAME_TO_DIR_NAME_MAP$W),DISPLAY_NAME_TO_DIR_NAME_MAP$Q),DISPLAY_NAME_TO_DIR_NAME_MAP$U),DISPLAY_NAME_TO_DIR_NAME_MAP$s),DISPLAY_NAME_TO_DIR_NAME_MAP$S),DISPLAY_NAME_TO_DIR_NAME_MAP$14),DISPLAY_NAME_TO_DIR_NAME_MAP$O),DISPLAY_NAME_TO_DIR_NAME_MAP$N),DISPLAY_NAME_TO_DIR_NAME_MAP$M),DISPLAY_NAME_TO_DIR_NAME_MAP$_),DISPLAY_NAME_TO_DIR_NAME_MAP$12),DISPLAY_NAME_TO_DIR_NAME_MAP$10),DISPLAY_NAME_TO_DIR_NAME_MAP$Y),DISPLAY_NAME_TO_DIR_NAME_MAP$I),DISPLAY_NAME_TO_DIR_NAME_MAP$E),DISPLAY_NAME_TO_DIR_NAME_MAP$13),DISPLAY_NAME_TO_DIR_NAME_MAP$X),DISPLAY_NAME_TO_DIR_NAME_MAP$t),DISPLAY_NAME_TO_DIR_NAME_MAP$V),DISPLAY_NAME_TO_DIR_NAME_MAP$F),DISPLAY_NAME_TO_DIR_NAME_MAP$17),DISPLAY_NAME_TO_DIR_NAME_MAP$D),DISPLAY_NAME_TO_DIR_NAME_MAP$H),DISPLAY_NAME_TO_DIR_NAME_MAP$16),DISPLAY_NAME_TO_DIR_NAME_MAP$A),DISPLAY_NAME_TO_DIR_NAME_MAP$L),DISPLAY_NAME_TO_DIR_NAME_MAP$11),DISPLAY_NAME_TO_DIR_NAME_MAP$15),DISPLAY_NAME_TO_DIR_NAME_MAP$C),DISPLAY_NAME_TO_DIR_NAME_MAP$18),DISPLAY_NAME_TO_DIR_NAME_MAP$J),DISPLAY_NAME_TO_DIR_NAME_MAP$w),DISPLAY_NAME_TO_DIR_NAME_MAP$Z),DISPLAY_NAME_TO_DIR_NAME_MAP$R),DISPLAY_NAME_TO_DIR_NAME_MAP$$),DISPLAY_NAME_TO_DIR_NAME_MAP$G),DISPLAY_NAME_TO_DIR_NAME_MAP$y),DISPLAY_NAME_TO_DIR_NAME_MAP$z),DISPLAY_NAME_TO_DIR_NAME_MAP$v),DISPLAY_NAME_TO_DIR_NAME_MAP$x),DISPLAY_NAME_TO_DIR_NAME_MAP$u),DISPLAY_NAME_TO_DIR_NAME_MAP$B),DISPLAY_NAME_TO_DIR_NAME_MAP$T),DISPLAY_NAME_TO_DIR_NAME_MAP$K),DISPLAY_NAME_TO_DIR_NAME_MAP$r),DISPLAY_NAME_TO_DIR_NAME_MAP$q),DISPLAY_NAME_TO_DIR_NAME_MAP$p),DISPLAY_NAME_TO_DIR_NAME_MAP$o),DISPLAY_NAME_TO_DIR_NAME_MAP$n),DISPLAY_NAME_TO_DIR_NAME_MAP$m),DISPLAY_NAME_TO_DIR_NAME_MAP$l),DISPLAY_NAME_TO_DIR_NAME_MAP$k),DISPLAY_NAME_TO_DIR_NAME_MAP$j),DISPLAY_NAME_TO_DIR_NAME_MAP$i),DISPLAY_NAME_TO_DIR_NAME_MAP$h),DISPLAY_NAME_TO_DIR_NAME_MAP$g),DISPLAY_NAME_TO_DIR_NAME_MAP$f),DISPLAY_NAME_TO_DIR_NAME_MAP$e),DISPLAY_NAME_TO_DIR_NAME_MAP$d),DISPLAY_NAME_TO_DIR_NAME_MAP$c),DISPLAY_NAME_TO_DIR_NAME_MAP$b),DISPLAY_NAME_TO_DIR_NAME_MAP$a),DISPLAY_NAME_TO_DIR_NAME_MAP$9),DISPLAY_NAME_TO_DIR_NAME_MAP$8),DISPLAY_NAME_TO_DIR_NAME_MAP$7),DISPLAY_NAME_TO_DIR_NAME_MAP$6),DISPLAY_NAME_TO_DIR_NAME_MAP$5),DISPLAY_NAME_TO_DIR_NAME_MAP$4),DISPLAY_NAME_TO_DIR_NAME_MAP$3),DISPLAY_NAME_TO_DIR_NAME_MAP$2),DISPLAY_NAME_TO_DIR_NAME_MAP$1),DISPLAY_NAME_TO_DIR_NAME_MAP);

    var BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME='bugsnag';// For version 6 and below
    var BUGSNAG_LIB_V7_INSTANCE_GLOBAL_KEY_NAME='Bugsnag';var GLOBAL_LIBRARY_OBJECT_NAMES=[BUGSNAG_LIB_V7_INSTANCE_GLOBAL_KEY_NAME,BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME];var BUGSNAG_CDN_URL='https://d2wy8f7a9ursnm.cloudfront.net/v6/bugsnag.min.js';var ERROR_REPORT_PROVIDER_NAME_BUGSNAG='rs-bugsnag';// This API key token is parsed in the CI pipeline
    var API_KEY='0d96a60df267f4a13f808bbaa54e535c';var BUGSNAG_VALID_MAJOR_VERSION='6';var SDK_LOAD_POLL_INTERVAL_MS=100;// ms
    var MAX_WAIT_FOR_SDK_LOAD_MS=100*SDK_LOAD_POLL_INTERVAL_MS;// ms
// Errors from the below scripts are NOT allowed to reach Bugsnag
    var SDK_FILE_NAME_PREFIXES=function SDK_FILE_NAME_PREFIXES(){return ['rsa'].concat(_toConsumableArray(Object.values(destDisplayNamesToFileNamesMap)));};var DEV_HOSTS=['www.test-host.com','localhost','127.0.0.1','[::1]'];// List of keys to exclude from the metadata
// Potential PII or sensitive data
    var APP_STATE_EXCLUDE_KEYS=['userId','userTraits','groupId','groupTraits','anonymousId','config','instance',// destination instance objects
        'anonymousUserId','eventBuffer',// pre-load event buffer (may contain PII)
        'traits'];var BUGSNAG_PLUGIN='BugsnagPlugin';

    var isValidVersion=function isValidVersion(globalLibInstance){var _globalLibInstance$_c;// For version 7
// eslint-disable-next-line no-underscore-dangle
        var version=globalLibInstance===null||globalLibInstance===void 0||(_globalLibInstance$_c=globalLibInstance._client)===null||_globalLibInstance$_c===void 0||(_globalLibInstance$_c=_globalLibInstance$_c._notifier)===null||_globalLibInstance$_c===void 0?void 0:_globalLibInstance$_c.version;// For versions older than 7
        if(!version){var _tempInstance$notifie;var tempInstance=globalLibInstance({apiKey:API_KEY,releaseStage:'version-test',// eslint-disable-next-line func-names, object-shorthand
            beforeSend:function beforeSend(){return false;}});version=(_tempInstance$notifie=tempInstance.notifier)===null||_tempInstance$notifie===void 0?void 0:_tempInstance$notifie.version;}return version&&version.charAt(0)===BUGSNAG_VALID_MAJOR_VERSION;};var isRudderSDKError=function isRudderSDKError(event){var _event$stacktrace;var errorOrigin=(_event$stacktrace=event.stacktrace)===null||_event$stacktrace===void 0||(_event$stacktrace=_event$stacktrace[0])===null||_event$stacktrace===void 0?void 0:_event$stacktrace.file;if(!errorOrigin||typeof errorOrigin!=='string'){return false;}var srcFileName=errorOrigin.substring(errorOrigin.lastIndexOf('/')+1);return SDK_FILE_NAME_PREFIXES().some(function(prefix){return srcFileName.startsWith(prefix)&&srcFileName.endsWith('.js');});};var enhanceErrorEventMutator=function enhanceErrorEventMutator(event,metadataSource){event.updateMetaData('source',{metadataSource:metadataSource});var errorMessage=event.errorMessage;// eslint-disable-next-line no-param-reassign
        event.context=errorMessage;// Hack for easily grouping the script load errors
// on the dashboard
        if(errorMessage.includes('error in script loading')){// eslint-disable-next-line no-param-reassign
            event.context='Script load failures';}// eslint-disable-next-line no-param-reassign
        event.severity='error';};var onError=function onError(state){var _state$source$value;var metadataSource=(_state$source$value=state.source.value)===null||_state$source$value===void 0?void 0:_state$source$value.id;return function(event){try{// Discard the event if it's not originated at the SDK
        if(!isRudderSDKError(event)){return false;}enhanceErrorEventMutator(event,metadataSource);return true;}catch(_unused){// Drop the error event if it couldn't be filtered as
// it is most likely a non-SDK error
        return false;}};};var getReleaseStage=function getReleaseStage(){var host=globalThis.location.hostname;return host&&DEV_HOSTS.includes(host)?'development':'production';};var getGlobalBugsnagLibInstance=function getGlobalBugsnagLibInstance(){return globalThis[BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME];};var getNewClient=function getNewClient(state,logger){var globalBugsnagLibInstance=getGlobalBugsnagLibInstance();var clientConfig={apiKey:API_KEY,appVersion:'3.0.0-beta.3',// Set SDK version as the app version from build config
        metaData:{SDK:{name:'JS',installType:'npm'}},beforeSend:onError(state),autoCaptureSessions:false,// auto capture sessions is disabled
        collectUserIp:false,// collecting user's IP is disabled
// enabledBreadcrumbTypes: ['error', 'log', 'user'], // for v7 and above
        maxEvents:100,maxBreadcrumbs:40,releaseStage:getReleaseStage(),user:{id:state.lifecycle.writeKey.value},logger:logger};var client=globalBugsnagLibInstance(clientConfig);return client;};var isApiKeyValid=function isApiKeyValid(apiKey){var isAPIKeyValid=!(apiKey.startsWith('{{')||apiKey.endsWith('}}')||apiKey.length===0);return isAPIKeyValid;};var loadBugsnagSDK=function loadBugsnagSDK(externalSrcLoader,logger){var isNotLoaded=GLOBAL_LIBRARY_OBJECT_NAMES.every(function(globalKeyName){return !globalThis[globalKeyName];});if(!isNotLoaded){return;}externalSrcLoader.loadJSFile({url:BUGSNAG_CDN_URL,id:ERROR_REPORT_PROVIDER_NAME_BUGSNAG,callback:function callback(id){if(!id){logger===null||logger===void 0?void 0:logger.error(BUGSNAG_SDK_LOAD_ERROR(BUGSNAG_PLUGIN));}}});};var initBugsnagClient=function initBugsnagClient(state,promiseResolve,promiseReject,logger){var time=arguments.length>4&&arguments[4]!==undefined?arguments[4]:0;var globalBugsnagLibInstance=getGlobalBugsnagLibInstance();if(typeof globalBugsnagLibInstance==='function'){if(isValidVersion(globalBugsnagLibInstance)){var client=getNewClient(state,logger);promiseResolve(client);}}else if(time>=MAX_WAIT_FOR_SDK_LOAD_MS){promiseReject(new Error(BUGSNAG_SDK_LOAD_TIMEOUT_ERROR(MAX_WAIT_FOR_SDK_LOAD_MS)));}else {// Try to initialize the client after a delay
        globalThis.setTimeout(initBugsnagClient,SDK_LOAD_POLL_INTERVAL_MS,state,promiseResolve,promiseReject,logger,time+SDK_LOAD_POLL_INTERVAL_MS);}};var getAppStateForMetadata=function getAppStateForMetadata(state){var stateStr=stringifyWithoutCircular(state,false,APP_STATE_EXCLUDE_KEYS);return stateStr!==null?JSON.parse(stateStr):undefined;};

    var pluginName$c='Bugsnag';var Bugsnag=function Bugsnag(){return {name:pluginName$c,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$c]);},errorReportingProvider:{init:function init(state,externalSrcLoader,logger){return new Promise(function(resolve,reject){// If API key token is not parsed or invalid, don't proceed to initialize the client
                if(!isApiKeyValid(API_KEY)){reject(new Error(BUGSNAG_API_KEY_VALIDATION_ERROR(API_KEY)));return;}loadBugsnagSDK(externalSrcLoader,logger);initBugsnagClient(state,resolve,reject,logger);});},notify:function notify(client,error,state,logger){client===null||client===void 0?void 0:client.notify(error,{metaData:{state:getAppStateForMetadata(state)}});},breadcrumb:function breadcrumb(client,message,logger){client===null||client===void 0?void 0:client.leaveBreadcrumb(message);}}};};

    var READY_CHECK_TIMEOUT_MS=11*1000;// 11 seconds
    var SCRIPT_LOAD_TIMEOUT_MS=10*1000;// 10 seconds
    var DEVICE_MODE_DESTINATIONS_PLUGIN='DeviceModeDestinationsPlugin';

    var isDestIntgConfigTruthy=function isDestIntgConfigTruthy(destIntgConfig){return !isUndefined(destIntgConfig)&&Boolean(destIntgConfig)===true;};var isDestIntgConfigFalsy=function isDestIntgConfigFalsy(destIntgConfig){return !isUndefined(destIntgConfig)&&Boolean(destIntgConfig)===false;};

    /**
     * Determines if the destination SDK code is evaluated
     * @param destSDKIdentifier The name of the global globalThis object that contains the destination SDK
     * @param sdkTypeName The name of the destination SDK type
     * @param logger Logger instance
     * @returns true if the destination SDK code is evaluated, false otherwise
     */var isDestinationSDKMounted=function isDestinationSDKMounted(destSDKIdentifier,sdkTypeName,logger){return Boolean(globalThis[destSDKIdentifier]&&globalThis[destSDKIdentifier][sdkTypeName]&&globalThis[destSDKIdentifier][sdkTypeName].prototype&&typeof globalThis[destSDKIdentifier][sdkTypeName].prototype.constructor!=='undefined');};var createDestinationInstance=function createDestinationInstance(destSDKIdentifier,sdkTypeName,dest,state){var rAnalytics=globalThis.rudderanalytics;var analytics=rAnalytics.getAnalyticsInstance(state.lifecycle.writeKey.value);return new globalThis[destSDKIdentifier][sdkTypeName](clone$1(dest.config),{loadIntegration:state.nativeDestinations.loadIntegration.value,logLevel:state.lifecycle.logLevel.value,loadOnlyIntegrations:state.nativeDestinations.loadOnlyIntegrations.value,page:function page(category,name,properties,options,callback){return analytics.page(pageArgumentsToCallOptions(category,name,properties,options,callback));},track:function track(event,properties,options,callback){return analytics.track(trackArgumentsToCallOptions(event,properties,options,callback));},identify:function identify(userId,traits,options,callback){return analytics.identify(identifyArgumentsToCallOptions(userId,traits,options,callback));},alias:function alias(to,from,options,callback){return analytics.alias(aliasArgumentsToCallOptions(to,from,options,callback));},group:function group(groupId,traits,options,callback){return analytics.group(groupArgumentsToCallOptions(groupId,traits,options,callback));},getAnonymousId:function getAnonymousId(){return analytics.getAnonymousId();},getUserId:function getUserId(){return analytics.getUserId();},getUserTraits:function getUserTraits(){return analytics.getUserTraits();},getGroupId:function getGroupId(){return analytics.getGroupId();},getGroupTraits:function getGroupTraits(){return analytics.getGroupTraits();},getSessionId:function getSessionId(){return analytics.getSessionId();}},{shouldApplyDeviceModeTransformation:dest.shouldApplyDeviceModeTransformation,propagateEventsUntransformedOnError:dest.propagateEventsUntransformedOnError,destinationId:dest.id});};var isDestinationReady=function isDestinationReady(dest){return new Promise(function(resolve,reject){var instance=dest.instance;var handleNumber;var checkReady=function checkReady(){if(instance.isLoaded()&&(!instance.isReady||instance.isReady())){resolve(true);}else {handleNumber=globalThis.requestAnimationFrame(checkReady);}};checkReady();setTimeout(function(){globalThis.cancelAnimationFrame(handleNumber);reject(new Error(DESTINATION_READY_TIMEOUT_ERROR(READY_CHECK_TIMEOUT_MS,dest.userFriendlyId)));},READY_CHECK_TIMEOUT_MS);});};/**
     * Filters the destinations that should not be loaded or forwarded events to based on the integration options (load or events API)
     * @param intgOpts Integration options object
     * @param destinations Destinations array
     * @returns Destinations array filtered based on the integration options
     */var filterDestinations=function filterDestinations(intgOpts,destinations){var allOptVal=intgOpts.All;return destinations.filter(function(dest){var destDisplayName=dest.displayName;var isDestEnabled;if(allOptVal){isDestEnabled=true;if(isDestIntgConfigFalsy(intgOpts[destDisplayName])){isDestEnabled=false;}}else {isDestEnabled=false;if(isDestIntgConfigTruthy(intgOpts[destDisplayName])){isDestEnabled=true;}}return isDestEnabled;});};/**
     * Extracts the integration config, if any, from the given destination
     * and merges it with the current integrations config
     * @param dest Destination object
     * @param curDestIntgConfig Current destinations integration config
     * @param logger Logger object
     * @returns Combined destinations integrations config
     */var getCumulativeIntegrationsConfig=function getCumulativeIntegrationsConfig(dest,curDestIntgConfig,errorHandler){var _dest$instance;var integrationsConfig=curDestIntgConfig;if(isFunction((_dest$instance=dest.instance)===null||_dest$instance===void 0?void 0:_dest$instance.getDataForIntegrationsObject)){try{var _dest$instance2;integrationsConfig=mergeDeepRight(curDestIntgConfig,normalizeIntegrationOptions((_dest$instance2=dest.instance)===null||_dest$instance2===void 0?void 0:_dest$instance2.getDataForIntegrationsObject()));}catch(err){errorHandler===null||errorHandler===void 0?void 0:errorHandler.onError(err,DEVICE_MODE_DESTINATIONS_PLUGIN,DESTINATION_INTEGRATIONS_DATA_ERROR(dest.userFriendlyId));}}return integrationsConfig;};var initializeDestination=function initializeDestination(dest,state,destSDKIdentifier,sdkTypeName,errorHandler,logger){try{var initializedDestination=clone$1(dest);var destInstance=createDestinationInstance(destSDKIdentifier,sdkTypeName,dest,state);initializedDestination.instance=destInstance;destInstance.init();isDestinationReady(initializedDestination).then(function(){// Collect the integrations data for the hybrid mode destinations
        if(isHybridModeDestination(initializedDestination)){state.nativeDestinations.integrationsConfig.value=getCumulativeIntegrationsConfig(initializedDestination,state.nativeDestinations.integrationsConfig.value,errorHandler);}state.nativeDestinations.initializedDestinations.value=[].concat(_toConsumableArray(state.nativeDestinations.initializedDestinations.value),[initializedDestination]);}).catch(function(err){// The error message is already formatted in the isDestinationReady function
        logger===null||logger===void 0?void 0:logger.error(err);state.nativeDestinations.failedDestinations.value=[].concat(_toConsumableArray(state.nativeDestinations.failedDestinations.value),[dest]);});}catch(err){errorHandler===null||errorHandler===void 0?void 0:errorHandler.onError(err,DEVICE_MODE_DESTINATIONS_PLUGIN,DESTINATION_INIT_ERROR(dest.userFriendlyId));state.nativeDestinations.failedDestinations.value=[].concat(_toConsumableArray(state.nativeDestinations.failedDestinations.value),[dest]);}};

    var pluginName$b='DeviceModeDestinations';var DeviceModeDestinations=function DeviceModeDestinations(){return {name:pluginName$b,initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$b]);},nativeDestinations:{setActiveDestinations:function setActiveDestinations(state,pluginsManager,errorHandler,logger){// Normalize the integration options from the load API call
                state.nativeDestinations.loadOnlyIntegrations.value=normalizeIntegrationOptions(state.loadOptions.value.integrations);state.nativeDestinations.loadIntegration.value=state.loadOptions.value.loadIntegration;// Filter destination that doesn't have mapping config-->Integration names
                var configSupportedDestinations=state.nativeDestinations.configuredDestinations.value.filter(function(configDest){if(destDisplayNamesToFileNamesMap[configDest.displayName]){return true;}errorHandler===null||errorHandler===void 0?void 0:errorHandler.onError(new Error(DESTINATION_NOT_SUPPORTED_ERROR(configDest.userFriendlyId)),DEVICE_MODE_DESTINATIONS_PLUGIN);return false;});// Filter destinations that are disabled through load options
                var destinationsToLoad=filterDestinations(state.nativeDestinations.loadOnlyIntegrations.value,configSupportedDestinations);var consentedDestinations=destinationsToLoad.filter(function(dest){var _pluginsManager$invok;return(// if consent manager is not configured, then default to load the destination
                  (_pluginsManager$invok=pluginsManager.invokeSingle("consentManager.isDestinationConsented",state,dest.config,errorHandler,logger))!==null&&_pluginsManager$invok!==void 0?_pluginsManager$invok:true);});state.nativeDestinations.activeDestinations.value=consentedDestinations;},load:function load(state,externalSrcLoader,errorHandler,logger,externalScriptOnLoad){var integrationsCDNPath=state.lifecycle.integrationsCDNPath.value;var activeDestinations=state.nativeDestinations.activeDestinations.value;activeDestinations.forEach(function(dest){var sdkName=destDisplayNamesToFileNamesMap[dest.displayName];var destSDKIdentifier="".concat(sdkName,"_RS");// this is the name of the object loaded on the window
                var sdkTypeName=sdkName;if(!isDestinationSDKMounted(destSDKIdentifier,sdkTypeName)){var destSdkURL="".concat(integrationsCDNPath,"/").concat(sdkName,".min.js");externalSrcLoader.loadJSFile({url:destSdkURL,id:dest.userFriendlyId,callback:externalScriptOnLoad!==null&&externalScriptOnLoad!==void 0?externalScriptOnLoad:function(id){if(!id){logger===null||logger===void 0?void 0:logger.error(DESTINATION_SDK_LOAD_ERROR(DEVICE_MODE_DESTINATIONS_PLUGIN,dest.userFriendlyId));state.nativeDestinations.failedDestinations.value=[].concat(_toConsumableArray(state.nativeDestinations.failedDestinations.value),[dest]);}else {initializeDestination(dest,state,destSDKIdentifier,sdkTypeName,errorHandler,logger);}},timeout:SCRIPT_LOAD_TIMEOUT_MS});}else {initializeDestination(dest,state,destSDKIdentifier,sdkTypeName,errorHandler,logger);}});}}};};

    /* eslint-disable @typescript-eslint/no-unused-vars */ /* eslint-disable no-param-reassign */var pluginName$a='DeviceModeTransformation';var DeviceModeTransformation=function DeviceModeTransformation(){return {name:pluginName$a,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$a]);},transformEvent:{enqueue:function enqueue(state,pluginsManager,event,destination,errorHandler,logger){// TODO: Implement DMT logic here
// TODO: for now this is a pass through
                pluginsManager.invokeSingle('destinationsEventsQueue.enqueueEventToDestination',state,event,destination,errorHandler,logger);}}};};

    var pluginName$9='ErrorReporting';var ErrorReporting=function ErrorReporting(){return {name:pluginName$9,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$9]);},errorReporting:{init:function init(state,pluginEngine,externalSrcLoader,logger){var _state$source$value,_state$source$value2;if(!((_state$source$value=state.source.value)!==null&&_state$source$value!==void 0&&_state$source$value.config)||!((_state$source$value2=state.source.value)!==null&&_state$source$value2!==void 0&&_state$source$value2.id)){return Promise.reject(new Error(INVALID_SOURCE_CONFIG_ERROR));}return pluginEngine.invokeSingle('errorReportingProvider.init',state,externalSrcLoader,logger);},notify:function notify(pluginEngine,client,error,state,logger){pluginEngine.invokeSingle('errorReportingProvider.notify',client,error,state,logger);},breadcrumb:function breadcrumb(pluginEngine,client,message,logger){pluginEngine.invokeSingle('errorReportingProvider.breadcrumb',client,message,logger);}}};};

    var externallyLoadedSessionStorageKeys={segment:'ajs_anonymous_id'};

    var getSegmentAnonymousId=function getSegmentAnonymousId(getStorageEngine){var anonymousId;/**
     * First check the local storage for anonymousId
     * Ref: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#identify
     */var lsEngine=getStorageEngine(LOCAL_STORAGE);if(lsEngine!==null&&lsEngine!==void 0&&lsEngine.isEnabled){anonymousId=lsEngine.getItem(externallyLoadedSessionStorageKeys.segment);}// If anonymousId is not present in local storage and find it in cookies
        var csEngine=getStorageEngine(COOKIE_STORAGE);if(!anonymousId&&csEngine!==null&&csEngine!==void 0&&csEngine.isEnabled){anonymousId=csEngine.getItem(externallyLoadedSessionStorageKeys.segment);}return anonymousId;};

    var pluginName$8='ExternalAnonymousId';var ExternalAnonymousId=function ExternalAnonymousId(){return {name:pluginName$8,initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$8]);},storage:{getAnonymousId:function getAnonymousId(getStorageEngine,options){var _options$autoCapture;var anonymousId;if(options!==null&&options!==void 0&&(_options$autoCapture=options.autoCapture)!==null&&_options$autoCapture!==void 0&&_options$autoCapture.enabled&&options.autoCapture.source){var source=options.autoCapture.source.toLowerCase();if(!Object.keys(externallyLoadedSessionStorageKeys).includes(source)){return anonymousId;}// eslint-disable-next-line sonarjs/no-small-switch
                switch(source){case'segment':anonymousId=getSegmentAnonymousId(getStorageEngine);break;}}return anonymousId;}}};};

    var AMP_LINKER_ANONYMOUS_ID_KEY='rs_amp_id';

    /* eslint-disable no-bitwise */ /**
     * generate crc table
     *
     * @params none
     * @returns array of CRC table
     */var makeCRCTable=function makeCRCTable(){var crcTable=[];var c;for(var n=0;n<256;n++){c=n;for(var k=0;k<8;k++){c=c&1?0xedb88320^c>>>1:c>>>1;}crcTable[n]=c;}return crcTable;};/**
     * This is utility function for crc32 algorithm
     *
     * @param {string} str
     * @returns {number} crc32
     */var crc32=function crc32(str){var crcTable=makeCRCTable();var crc=0^-1;for(var i=0;i<str.length;i++){crc=crc>>>8^crcTable[(crc^str.charCodeAt(i))&0xff];}return (crc^-1)>>>0;};

    /**
     * An interface to fetch user device details.
     */var USER_INTERFACE={/**
         * @returns {string} user language
         */getUserLanguage:function getUserLanguage(){var _navigator;return (_navigator=navigator)===null||_navigator===void 0?void 0:_navigator.language;},/**
         * @returns {string} userAgent
         */getUserAgent:function getUserAgent(){var _navigator2;return (_navigator2=navigator)===null||_navigator2===void 0?void 0:_navigator2.userAgent;}};

    /**
     * This is utility function for decoding from base 64 to utf8
     *
     * @param {string} str base64
     *
     * @returns {string} utf8
     */var b64DecodeUnicode=function b64DecodeUnicode(str){return(// Going backwards: from bytestream, to percent-encoding, to original string.
      decodeURIComponent(globalThis.atob(str).split('').map(function(c){var percentEncodingChar="00".concat(c.charCodeAt(0).toString(16));return "%".concat(percentEncodingChar.slice(-2));}).join('')));};/**
     * This is utility function for decoding from base 64 to utf8
     *
     * @param {string} data
     *
     * @return {string}
     */var decode$1=function decode(){var data=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'';var decodedData=data.endsWith('..')?data.substring(0,data.length-2):data;return b64DecodeUnicode(decodedData);};

    var KEY_VALIDATOR=/^[\w.-]+$/;var CHECKSUM_OFFSET_MAX_MIN=1;var VALID_VERSION=1;var DELIMITER='*';/**
     * Parse the linker param value to version checksum and serializedParams
     *
     * @param {string} value
     *
     * @return {?Object}
     */var parseLinkerParamValue=function parseLinkerParamValue(value){var parts=value.split(DELIMITER);var isEven=parts.length%2===0;if(parts.length<4||!isEven){// Format <version>*<checksum>*<key1>*<value1>
// Note: linker makes sure there's at least one pair of non empty key value
// Make sure there is at least three delimiters.
        return null;}var version=Number(parts.shift());if(version!==VALID_VERSION){return null;}var checksum=parts.shift();var serializedIds=parts.join(DELIMITER);return {checksum:checksum!==null&&checksum!==void 0?checksum:'',serializedIds:serializedIds};};/**
     * Deserialize the serializedIds and return keyValue pairs.
     *
     * @param {string} serializedIds
     *
     * @return {!Object<string, string>}
     */var deserialize=function deserialize(serializedIds){var keyValuePairs={};var params=serializedIds.split(DELIMITER);for(var i=0;i<params.length;i+=2){var key=params[i];var valid=KEY_VALIDATOR.test(key);if(valid){keyValuePairs[key]=decode$1(params[i+1]);}}return keyValuePairs;};/**
     * Generates a semi-unique value for page visitor.
     *
     * @return {string}
     */var getFingerprint=function getFingerprint(userAgent,language){var date=new Date();var timezone=date.getTimezoneOffset();return [userAgent,timezone,language].join(DELIMITER);};/**
     * Rounded time used to check if t2 - t1 is within our time tolerance.
     * Timestamp in minutes, floored.
     *
     * @return {number}
     */var getMinSinceEpoch=function getMinSinceEpoch(){return Math.floor(Date.now()/60000);};/**
     * Create a unique checksum hashing the fingerprint and a few other values.
     *
     * @param {string} serializedIds
     * @param {number=} optOffsetMin
     * @param {string} userAgent
     * @param {string} language
     *
     * @return {string}
     */var getCheckSum=function getCheckSum(serializedIds,optOffsetMin,userAgent,language){var fingerprint=getFingerprint(userAgent,language);var offset=optOffsetMin||0;var timestamp=getMinSinceEpoch()-offset;var crc=crc32([fingerprint,timestamp,serializedIds].join(DELIMITER));// Encoded to base36 for fewer bytes.
        return crc.toString(36);};/**
     * Check if the checksum is valid with time offset tolerance.
     *
     * @param {string} serializedIds
     * @param {string} checksum
     *
     * @return {boolean}
     */var isCheckSumValid=function isCheckSumValid(serializedIds,checksum){var userAgent=USER_INTERFACE.getUserAgent();var language=USER_INTERFACE.getUserLanguage();for(var i=0;i<=CHECKSUM_OFFSET_MAX_MIN;i+=1){var calculateCheckSum=getCheckSum(serializedIds,i,userAgent,language);if(calculateCheckSum===checksum){return true;}}return false;};/**
     * AMP Linker Parser (works for Rudder, GA or any other linker created by following Google's linker standard.)
     *
     * @param {string} value
     *
     * @return {?Object<string, string>}
     */var parseLinker=function parseLinker(value){var linkerObj=parseLinkerParamValue(value);if(!linkerObj){return null;}var checksum=linkerObj.checksum,serializedIds=linkerObj.serializedIds;if(!isCheckSumValid(serializedIds,checksum)){return null;}return deserialize(serializedIds);};

    var pluginName$7='GoogleLinker';// TODO: refactor this plugin and all related source code to be type-safe
    var GoogleLinker=function GoogleLinker(){return {name:pluginName$7,initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$7]);},userSession:{anonymousIdGoogleLinker:function anonymousIdGoogleLinker(rudderAmpLinkerParam){if(!rudderAmpLinkerParam){return null;}var parsedAnonymousIdObj=rudderAmpLinkerParam?parseLinker(rudderAmpLinkerParam):null;return parsedAnonymousIdObj?parsedAnonymousIdObj[AMP_LINKER_ANONYMOUS_ID_KEY]:null;}}};};

    var ScheduleModes=/*#__PURE__*/function(ScheduleModes){ScheduleModes[ScheduleModes["ASAP"]=1]="ASAP";ScheduleModes[ScheduleModes["RESCHEDULE"]=2]="RESCHEDULE";ScheduleModes[ScheduleModes["ABANDON"]=3]="ABANDON";return ScheduleModes;}({});var DEFAULT_CLOCK_LATE_FACTOR=2;var DEFAULT_CLOCK={setTimeout:function setTimeout(fn,ms){return globalThis.setTimeout(fn,ms);},clearTimeout:function clearTimeout(id){return globalThis.clearTimeout(id);},Date:globalThis.Date,clockLateFactor:DEFAULT_CLOCK_LATE_FACTOR};var Schedule=/*#__PURE__*/function(){function Schedule(){_classCallCheck(this,Schedule);_defineProperty(this,"tasks",{});_defineProperty(this,"nextId",1);_defineProperty(this,"clock",DEFAULT_CLOCK);}_createClass(Schedule,[{key:"now",value:function now(){return +new this.clock.Date();}},{key:"run",value:function run(task,timeout,mode){var id=(this.nextId+1).toString();this.tasks[id]=this.clock.setTimeout(this.handle(id,task,timeout,mode||ScheduleModes.ASAP),timeout);return id;}},{key:"handle",value:function handle(id,callback,timeout,mode){var _this=this;var start=this.now();return function(){delete _this.tasks[id];var elapsedTimeoutTime=start+timeout*(_this.clock.clockLateFactor||DEFAULT_CLOCK_LATE_FACTOR);var currentTime=_this.now();var notCompletedOrTimedOut=mode>=ScheduleModes.RESCHEDULE&&elapsedTimeoutTime<currentTime;if(notCompletedOrTimedOut){if(mode===ScheduleModes.RESCHEDULE){_this.run(callback,timeout,mode);}return undefined;}return callback();};}},{key:"cancel",value:function cancel(id){if(this.tasks[id]){this.clock.clearTimeout(this.tasks[id]);delete this.tasks[id];}}},{key:"cancelAll",value:function cancelAll(){Object.values(this.tasks).forEach(this.clock.clearTimeout);this.tasks={};}},{key:"setClock",value:function setClock(newClock){this.clock=newClock;}},{key:"resetClock",value:function resetClock(){this.clock=DEFAULT_CLOCK;}}]);return Schedule;}();

    var sortByTime=function sortByTime(a,b){return a.time-b.time;};var RETRY_QUEUE='RetryQueue';/**
     * Constructs a RetryQueue backed by localStorage
     *
     * @constructor
     * @param {String} name The name of the queue. Will be used to find abandoned queues and retry their items
     * @param {Object} [opts] Optional argument to override `maxItems`, `maxAttempts`, `minRetryDelay, `maxRetryDelay`, `backoffFactor` and `backoffJitter`.
     * @param {QueueProcessCallback} fn The function to call in order to process an item added to the queue
     */var RetryQueue=/*#__PURE__*/function(){function RetryQueue(name,options,queueProcessCb,storeManager){var storageType=arguments.length>4&&arguments[4]!==undefined?arguments[4]:LOCAL_STORAGE;var logger=arguments.length>5?arguments[5]:undefined;_classCallCheck(this,RetryQueue);this.storeManager=storeManager;this.name=name;this.id=generateUUID();this.processQueueCb=queueProcessCb;this.maxItems=options.maxItems||Infinity;this.maxAttempts=options.maxAttempts||Infinity;this.logger=logger;this.backoff={MIN_RETRY_DELAY:options.minRetryDelay||1000,MAX_RETRY_DELAY:options.maxRetryDelay||30000,FACTOR:options.backoffFactor||2,JITTER:options.backoffJitter||0};// painstakingly tuned. that's why they're not "easily" configurable
        this.timeouts={ACK_TIMER:1000,RECLAIM_TIMER:3000,RECLAIM_TIMEOUT:10000,RECLAIM_WAIT:500};this.schedule=new Schedule();this.processId='0';// Set up our empty queues
        this.store=this.storeManager.setStore({id:this.id,name:this.name,validKeys:QueueStatuses,type:storageType});this.setQueue(QueueStatuses.IN_PROGRESS,{});this.setQueue(QueueStatuses.QUEUE,[]);// bind recurring tasks for ease of use
        this.ack=this.ack.bind(this);this.checkReclaim=this.checkReclaim.bind(this);this.processHead=this.processHead.bind(this);this.scheduleTimeoutActive=false;}_createClass(RetryQueue,[{key:"getQueue",value:function getQueue(name){return this.store.get(name!==null&&name!==void 0?name:this.name);}// TODO: fix the type of different queues to be the same if possible
    },{key:"setQueue",value:function setQueue(name,value){this.store.set(name!==null&&name!==void 0?name:this.name,value!==null&&value!==void 0?value:[]);}/**
         * Stops processing the queue
         */},{key:"stop",value:function stop(){this.schedule.cancelAll();this.scheduleTimeoutActive=false;}/**
         * Starts processing the queue
         */},{key:"start",value:function start(){if(this.scheduleTimeoutActive){this.stop();}this.scheduleTimeoutActive=true;this.ack();this.checkReclaim();this.processHead();}/**
         * Decides whether to retry. Overridable.
         *
         * @param {Object} item The item being processed
         * @param {Number} attemptNumber The attemptNumber (1 for first retry)
         * @return {Boolean} Whether to requeue the message
         */},{key:"shouldRetry",value:function shouldRetry(item,attemptNumber){return attemptNumber<=this.maxAttempts;}/**
         * Calculates the delay (in ms) for a retry attempt
         *
         * @param {Number} attemptNumber The attemptNumber (1 for first retry)
         * @return {Number} The delay in milliseconds to wait before attempting a retry
         */},{key:"getDelay",value:function getDelay(attemptNumber){var ms=this.backoff.MIN_RETRY_DELAY*Math.pow(this.backoff.FACTOR,attemptNumber);if(this.backoff.JITTER){var rand=Math.random();var deviation=Math.floor(rand*this.backoff.JITTER*ms);if(Math.floor(rand*10)<5){ms-=deviation;}else {ms+=deviation;}}return Number(Math.min(ms,this.backoff.MAX_RETRY_DELAY).toPrecision(1));}},{key:"enqueue",value:function enqueue(entry){var _ref;var queue=(_ref=this.getQueue(QueueStatuses.QUEUE))!==null&&_ref!==void 0?_ref:[];queue=queue.slice(-(this.maxItems-1));queue.push(entry);queue=queue.sort(sortByTime);this.setQueue(QueueStatuses.QUEUE,queue);if(this.scheduleTimeoutActive){this.processHead();}}/**
         * Adds an item to the queue
         *
         * @param {Object} item The item to process
         */},{key:"addItem",value:function addItem(item){this.enqueue({item:item,attemptNumber:0,time:this.schedule.now(),id:generateUUID()});}/**
         * Adds an item to the retry queue
         *
         * @param {Object} item The item to retry
         * @param {Number} attemptNumber The attempt number (1 for first retry)
         * @param {Error} [error] The error from previous attempt, if there was one
         * @param {String} [id] The id of the queued message used for tracking duplicate entries
         */},{key:"requeue",value:function requeue(item,attemptNumber,error,id){if(this.shouldRetry(item,attemptNumber)){this.enqueue({item:item,attemptNumber:attemptNumber,time:this.schedule.now()+this.getDelay(attemptNumber),id:id||generateUUID()});}}},{key:"processHead",value:function processHead(){var _ref2,_ref3,_this=this,_ref5;// cancel the scheduled task if it exists
            this.schedule.cancel(this.processId);// Pop the head off the queue
            var queue=(_ref2=this.getQueue(QueueStatuses.QUEUE))!==null&&_ref2!==void 0?_ref2:[];var inProgress=(_ref3=this.getQueue(QueueStatuses.IN_PROGRESS))!==null&&_ref3!==void 0?_ref3:{};var now=this.schedule.now();var toRun=[];// eslint-disable-next-line @typescript-eslint/no-unused-vars
            var processItemCallback=function processItemCallback(el,id){return function(err,res){var _ref4;var inProgress=(_ref4=_this.getQueue(QueueStatuses.IN_PROGRESS))!==null&&_ref4!==void 0?_ref4:{};delete inProgress[id];_this.setQueue(QueueStatuses.IN_PROGRESS,inProgress);if(err){_this.requeue(el.item,el.attemptNumber+1,err,el.id);}};};var enqueueItem=function enqueueItem(el,id){toRun.push({item:el.item,done:processItemCallback(el,id),attemptNumber:el.attemptNumber});};var inProgressSize=Object.keys(inProgress).length;// eslint-disable-next-line no-plusplus
            while(queue.length>0&&queue[0].time<=now&&inProgressSize++<this.maxItems){var el=queue.shift();if(el){var id=generateUUID();// Save this to the in progress map
                inProgress[id]={item:el.item,attemptNumber:el.attemptNumber,time:this.schedule.now()};enqueueItem(el,id);}}this.setQueue(QueueStatuses.QUEUE,queue);this.setQueue(QueueStatuses.IN_PROGRESS,inProgress);toRun.forEach(function(el){// TODO: handle processQueueCb timeout
                try{var willBeRetried=_this.shouldRetry(el.item,el.attemptNumber+1);_this.processQueueCb(el.item,el.done,el.attemptNumber,_this.maxAttempts,willBeRetried);}catch(err){var _this$logger;(_this$logger=_this.logger)===null||_this$logger===void 0?void 0:_this$logger.error(RETRY_QUEUE_PROCESS_ERROR(RETRY_QUEUE),err);}});// re-read the queue in case the process function finished immediately or added another item
            queue=(_ref5=this.getQueue(QueueStatuses.QUEUE))!==null&&_ref5!==void 0?_ref5:[];this.schedule.cancel(this.processId);if(queue.length>0){var nextProcessExecutionTime=queue[0].time-now;this.processId=this.schedule.run(this.processHead,nextProcessExecutionTime,ScheduleModes.ASAP);}}// Ack continuously to prevent other tabs from claiming our queue
    },{key:"ack",value:function ack(){this.setQueue(QueueStatuses.ACK,this.schedule.now());this.setQueue(QueueStatuses.RECLAIM_START,null);this.setQueue(QueueStatuses.RECLAIM_END,null);this.schedule.run(this.ack,this.timeouts.ACK_TIMER,ScheduleModes.ASAP);}},{key:"reclaim",value:function reclaim(id){var _this$getQueue,_other$get,_other$get2,_this2=this;var other=this.storeManager.setStore({id:id,name:this.name,validKeys:QueueStatuses,type:LOCAL_STORAGE});var our={queue:(_this$getQueue=this.getQueue(QueueStatuses.QUEUE))!==null&&_this$getQueue!==void 0?_this$getQueue:[]};var their={inProgress:(_other$get=other.get(QueueStatuses.IN_PROGRESS))!==null&&_other$get!==void 0?_other$get:{},queue:(_other$get2=other.get(QueueStatuses.QUEUE))!==null&&_other$get2!==void 0?_other$get2:[]};var trackMessageIds=[];var addConcatQueue=function addConcatQueue(queue,incrementAttemptNumberBy){var concatIterator=function concatIterator(el){var id=el.id||generateUUID();if(trackMessageIds.includes(id));else {our.queue.push({item:el.item,attemptNumber:el.attemptNumber+incrementAttemptNumberBy,time:_this2.schedule.now(),id:id});trackMessageIds.push(id);}};if(Array.isArray(queue)){queue.forEach(concatIterator);}else if(queue){Object.values(queue).forEach(concatIterator);}};// add their queue to ours, resetting run-time to immediate and copying the attempt#
            addConcatQueue(their.queue,0);// if the queue is abandoned, all the in-progress are failed. retry them immediately and increment the attempt#
            addConcatQueue(their.inProgress,1);our.queue=our.queue.sort(sortByTime);this.setQueue(QueueStatuses.QUEUE,our.queue);// remove all keys one by on next tick to avoid NS_ERROR_STORAGE_BUSY error
            try{this.clearOtherQueue(other,1);}catch(e){var isLocalStorageBusy=e.name==='NS_ERROR_STORAGE_BUSY'||e.code==='NS_ERROR_STORAGE_BUSY'||e.code===0x80630001;if(isLocalStorageBusy){try{this.clearOtherQueue(other,40);}catch(retryError){console.error(retryError);}}else {console.error(e);}}// process the new items we claimed
            this.processHead();}// eslint-disable-next-line class-methods-use-this
    },{key:"clearOtherQueue",value:function clearOtherQueue(other,localStorageBackoff){globalThis.setTimeout(function(){other.remove(QueueStatuses.IN_PROGRESS);globalThis.setTimeout(function(){other.remove(QueueStatuses.QUEUE);globalThis.setTimeout(function(){other.remove(QueueStatuses.RECLAIM_START);globalThis.setTimeout(function(){other.remove(QueueStatuses.RECLAIM_END);globalThis.setTimeout(function(){other.remove(QueueStatuses.ACK);},localStorageBackoff);},localStorageBackoff);},localStorageBackoff);},localStorageBackoff);},localStorageBackoff);}},{key:"checkReclaim",value:function checkReclaim(){var _this3=this;var createReclaimStartTask=function createReclaimStartTask(store){return function(){if(store.get(QueueStatuses.RECLAIM_END)!==_this3.id){return;}if(store.get(QueueStatuses.RECLAIM_START)!==_this3.id){return;}_this3.reclaim(store.id);};};var createReclaimEndTask=function createReclaimEndTask(store){return function(){if(store.get(QueueStatuses.RECLAIM_START)!==_this3.id){return;}store.set(QueueStatuses.RECLAIM_END,_this3.id);_this3.schedule.run(createReclaimStartTask(store),_this3.timeouts.RECLAIM_WAIT,ScheduleModes.ABANDON);};};var tryReclaim=function tryReclaim(store){store.set(QueueStatuses.RECLAIM_START,_this3.id);store.set(QueueStatuses.ACK,_this3.schedule.now());_this3.schedule.run(createReclaimEndTask(store),_this3.timeouts.RECLAIM_WAIT,ScheduleModes.ABANDON);};var findOtherQueues=function findOtherQueues(name){var res=[];var storage=_this3.store.getOriginalEngine();for(var i=0;i<storage.length;i++){var k=storage.key(i);var parts=k?k.split('.'):[];if(parts.length!==3){// eslint-disable-next-line no-continue
            continue;}if(parts[0]!==name){// eslint-disable-next-line no-continue
            continue;}if(parts[2]!==QueueStatuses.ACK){// eslint-disable-next-line no-continue
            continue;}res.push(_this3.storeManager.setStore({id:parts[1],name:name,validKeys:QueueStatuses,type:LOCAL_STORAGE}));}return res;};findOtherQueues(this.name).forEach(function(store){if(store.id===_this3.id){return;}if(_this3.schedule.now()-store.get(QueueStatuses.ACK)<_this3.timeouts.RECLAIM_TIMEOUT){return;}tryReclaim(store);});this.schedule.run(this.checkReclaim,this.timeouts.RECLAIM_TIMER,ScheduleModes.RESCHEDULE);}}]);return RetryQueue;}();

    var DEFAULT_QUEUE_OPTIONS={maxItems:100};var QUEUE_NAME$1='rudder_destinations_events';var NATIVE_DESTINATION_QUEUE_PLUGIN='NativeDestinationQueuePlugin';

    var getNormalizedQueueOptions$1=function getNormalizedQueueOptions(queueOpts){return mergeDeepRight(DEFAULT_QUEUE_OPTIONS,queueOpts);};var isValidEventName=function isValidEventName(eventName){return eventName&&typeof eventName==='string';};var isEventDenyListed=function isEventDenyListed(eventType,eventName,dest){if(eventType!=='track'){return false;}var _dest$config=dest.config,blacklistedEvents=_dest$config.blacklistedEvents,whitelistedEvents=_dest$config.whitelistedEvents,eventFilteringOption=_dest$config.eventFilteringOption;switch(eventFilteringOption){// Blacklist is chosen for filtering events
        case'blacklistedEvents':{if(!isValidEventName(eventName)){return false;}var trimmedEventName=eventName.trim();if(Array.isArray(blacklistedEvents)){return blacklistedEvents.some(function(eventObj){return eventObj.eventName.trim()===trimmedEventName;});}return false;}// Whitelist is chosen for filtering events
        case'whitelistedEvents':{if(!isValidEventName(eventName)){return true;}var _trimmedEventName=eventName.trim();if(Array.isArray(whitelistedEvents)){return !whitelistedEvents.some(function(eventObj){return eventObj.eventName.trim()===_trimmedEventName;});}return true;}case'disable':default:return false;}};var sendEventToDestination=function sendEventToDestination(item,dest,errorHandler,logger){var methodName=item.type.toString();try{var _dest$instance,_dest$instance$method;// Destinations expect the event to be wrapped under the `message` key
// This will remain until we update the destinations to accept the event directly
        (_dest$instance=dest.instance)===null||_dest$instance===void 0||(_dest$instance$method=_dest$instance[methodName])===null||_dest$instance$method===void 0?void 0:_dest$instance$method.call(_dest$instance,{message:item});}catch(err){errorHandler===null||errorHandler===void 0?void 0:errorHandler.onError(err,NATIVE_DESTINATION_QUEUE_PLUGIN,DESTINATION_EVENT_FORWARDING_ERROR(dest.userFriendlyId));}};

    var pluginName$6='NativeDestinationQueue';var NativeDestinationQueue=function NativeDestinationQueue(){return {name:pluginName$6,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$6]);},destinationsEventsQueue:{/**
             * Initialize the queue for delivery to destinations
             * @param state Application state
             * @param pluginsManager PluginsManager instance
             * @param storeManager StoreManager instance
             * @param errorHandler Error handler instance
             * @param logger Logger instance
             * @returns IQueue instance
             */init:function init(state,pluginsManager,storeManager,errorHandler,logger){var finalQOpts=getNormalizedQueueOptions$1(state.loadOptions.value.destinationsQueueOptions);var writeKey=state.lifecycle.writeKey.value;var eventsQueue=new RetryQueue(// adding write key to the queue name to avoid conflicts
              "".concat(QUEUE_NAME$1,"_").concat(writeKey),finalQOpts,function(rudderEvent,done){var destinationsToSend=filterDestinations(rudderEvent.integrations,state.nativeDestinations.initializedDestinations.value);destinationsToSend.forEach(function(dest){var clonedRudderEvent=clone$1(rudderEvent);var sendEvent=!isEventDenyListed(clonedRudderEvent.type,clonedRudderEvent.event,dest);if(!sendEvent){logger===null||logger===void 0?void 0:logger.warn(DESTINATION_EVENT_FILTERING_WARNING(NATIVE_DESTINATION_QUEUE_PLUGIN,clonedRudderEvent.event,dest.userFriendlyId));return;}if(dest.shouldApplyDeviceModeTransformation){pluginsManager.invokeSingle('transformEvent.enqueue',state,clonedRudderEvent,dest,logger);}else {sendEventToDestination(clonedRudderEvent,dest,errorHandler);}});// Mark success always
                  done(null);},storeManager,MEMORY_STORAGE);// TODO: This seems to not work as expected. Need to investigate
// effect(() => {
//   if (state.nativeDestinations.clientDestinationsReady.value === true) {
//     eventsQueue.start();
//   }
// });
                return eventsQueue;},/**
             * Add event to the queue for delivery to destinations
             * @param state Application state
             * @param eventsQueue IQueue instance
             * @param event RudderEvent object
             * @param errorHandler Error handler instance
             * @param logger Logger instance
             * @returns none
             */enqueue:function enqueue(state,eventsQueue,event,errorHandler,logger){event.integrations=normalizeIntegrationOptions(event.integrations);eventsQueue.addItem(event);},/**
             * This extension point is used to directly send the transformed event to the destination
             * @param state Application state
             * @param event RudderEvent Object
             * @param destination Destination Object
             * @param errorHandler Error handler instance
             * @param logger Logger instance
             */enqueueEventToDestination:function enqueueEventToDestination(state,event,destination,errorHandler,logger){sendEventToDestination(event,destination,errorHandler);}}};};

    var ONETRUST_CONSENT_MANAGER_PLUGIN='OneTrustConsentManagerPlugin';

    var pluginName$5='OneTrustConsentManager';var OneTrustConsentManager=function OneTrustConsentManager(){return {name:pluginName$5,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$5]);},consentManager:{init:function init(state,storeManager,logger){if(!globalThis.OneTrust||!globalThis.OnetrustActiveGroups){logger===null||logger===void 0?void 0:logger.error(ONETRUST_ACCESS_ERROR(ONETRUST_CONSENT_MANAGER_PLUGIN));state.consents.data.value={initialized:false};return;}// OneTrustConsentManager SDK populates a data layer object OnetrustActiveGroups with
// the cookie categories Ids that the user has consented to.
// Eg: ',C0001,C0003,'
// We split it and save it as an array.
                var allowedConsentIds=globalThis.OnetrustActiveGroups.split(',').filter(function(n){return n;});var allowedConsents={};var deniedConsentIds=[];// Get the groups(cookie categorization), user has created in one trust account.
                var oneTrustAllGroupsInfo=globalThis.OneTrust.GetDomainData().Groups;oneTrustAllGroupsInfo.forEach(function(group){var CustomGroupId=group.CustomGroupId,GroupName=group.GroupName;if(allowedConsentIds.includes(CustomGroupId)){allowedConsents[CustomGroupId]=GroupName;}else {deniedConsentIds.push(CustomGroupId);}});state.consents.data.value={initialized:true,allowedConsents:allowedConsents,deniedConsentIds:deniedConsentIds};},isDestinationConsented:function isDestinationConsented(state,destConfig,errorHandler,logger){var consentData=state.consents.data.value;if(!consentData.initialized){return true;}var allowedConsents=consentData.allowedConsents;try{// mapping of the destination with the consent group name
                var oneTrustCookieCategories=destConfig.oneTrustCookieCategories;// If the destination do not have this mapping events will be sent.
                if(!oneTrustCookieCategories){return true;}// Change the structure of oneTrustConsentGroup as an array and filter values if empty string
// Eg:
// ["Performance Cookies", "Functional Cookies"]
                var validOneTrustCookieCategories=oneTrustCookieCategories.map(function(c){return c.oneTrustCookieCategory;}).filter(function(n){return n;});var containsAllConsent=true;// Check if all the destination's mapped cookie categories are consented by the user in the browser.
                containsAllConsent=validOneTrustCookieCategories.every(function(element){return Object.keys(allowedConsents).includes(element.trim())||Object.values(allowedConsents).includes(element.trim());});return containsAllConsent;}catch(err){errorHandler===null||errorHandler===void 0?void 0:errorHandler.onError(err,ONETRUST_CONSENT_MANAGER_PLUGIN,DESTINATION_CONSENT_STATUS_ERROR);return true;}}}};};

    var KETCH_CONSENT_MANAGER_PLUGIN='KetchConsentManagerPlugin';var KETCH_CONSENT_COOKIE_NAME_V1='_ketch_consent_v1_';

    /**
     * Gets the consent data from the Ketch's consent cookie
     * @param storeManager Store manager instance
     * @param logger Logger instance
     * @returns Consent data from the consent cookie
     */var getKetchConsentData=function getKetchConsentData(storeManager,logger){var rawConsentCookieData=null;try{// Create a data store instance to read the consent cookie
        var dataStore=storeManager===null||storeManager===void 0?void 0:storeManager.setStore({id:KETCH_CONSENT_MANAGER_PLUGIN,name:KETCH_CONSENT_MANAGER_PLUGIN,type:COOKIE_STORAGE});rawConsentCookieData=dataStore===null||dataStore===void 0?void 0:dataStore.engine.getItem(KETCH_CONSENT_COOKIE_NAME_V1);}catch(err){logger===null||logger===void 0?void 0:logger.error(KETCH_CONSENT_COOKIE_READ_ERROR(KETCH_CONSENT_MANAGER_PLUGIN),err);return undefined;}if(isNullOrUndefined(rawConsentCookieData)){return undefined;}// Decode and parse the cookie data to JSON
        var consentCookieData;try{consentCookieData=JSON.parse(fromBase64(rawConsentCookieData));}catch(err){logger===null||logger===void 0?void 0:logger.error(KETCH_CONSENT_COOKIE_PARSE_ERROR(KETCH_CONSENT_MANAGER_PLUGIN),err);return undefined;}if(!consentCookieData){return undefined;}// Convert the cookie data to consent data
        var consentPurposes={};Object.entries(consentCookieData).forEach(function(pEntry){var purposeCode=pEntry[0];var purposeValue=pEntry[1];consentPurposes[purposeCode]=(purposeValue===null||purposeValue===void 0?void 0:purposeValue.status)==='granted';});return consentPurposes;};/**
     * Gets the consent data in the format expected by the application state
     * @param ketchConsentData Consent data derived from the consent cookie
     * @returns Consent data
     */var getConsentData=function getConsentData(ketchConsentData){var allowedConsents=[];var deniedConsentIds=[];var initialized=false;if(ketchConsentData){Object.entries(ketchConsentData).forEach(function(e){var purposeCode=e[0];var isConsented=e[1];if(isConsented){allowedConsents.push(purposeCode);}else {deniedConsentIds.push(purposeCode);}});initialized=true;}return {initialized:initialized,allowedConsents:allowedConsents,deniedConsentIds:deniedConsentIds};};var updateConsentStateFromData=function updateConsentStateFromData(state,ketchConsentData){var consentData=getConsentData(ketchConsentData);state.consents.data.value=consentData;};

    var pluginName$4='KetchConsentManager';var KetchConsentManager=function KetchConsentManager(){return {name:pluginName$4,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$4]);},consentManager:{init:function init(state,storeManager,logger){// getKetchUserConsentedPurposes returns current ketch opted-in purposes
// This will be helpful for debugging
                globalThis.getKetchUserConsentedPurposes=function(){var _state$consents$data$;return (_state$consents$data$=state.consents.data.value.allowedConsents)===null||_state$consents$data$===void 0?void 0:_state$consents$data$.slice();};// getKetchUserDeniedPurposes returns current ketch opted-out purposes
// This will be helpful for debugging
                globalThis.getKetchUserDeniedPurposes=function(){var _state$consents$data$2;return (_state$consents$data$2=state.consents.data.value.deniedConsentIds)===null||_state$consents$data$2===void 0?void 0:_state$consents$data$2.slice();};// updateKetchConsent callback function to update current consent purpose state
// this will be called from ketch rudderstack plugin
                globalThis.updateKetchConsent=function(ketchConsentData){updateConsentStateFromData(state,ketchConsentData);};// retrieve consent data and update the state
                var ketchConsentData;if(!isUndefined(globalThis.ketchConsent)){ketchConsentData=globalThis.ketchConsent;}else {ketchConsentData=getKetchConsentData(storeManager,logger);}updateConsentStateFromData(state,ketchConsentData);},isDestinationConsented:function isDestinationConsented(state,destConfig,errorHandler,logger){var consentData=state.consents.data.value;if(!consentData.initialized){return true;}var allowedConsents=consentData.allowedConsents;try{var ketchConsentPurposes=destConfig.ketchConsentPurposes;// If the destination do not have this mapping events will be sent.
                if(!ketchConsentPurposes||ketchConsentPurposes.length===0){return true;}var purposes=ketchConsentPurposes.map(function(p){return p.purpose;}).filter(function(n){return n;});// Check if any of the destination's mapped ketch purposes are consented by the user in the browser.
                var containsAnyOfConsent=purposes.some(function(element){return allowedConsents.includes(element.trim());});return containsAnyOfConsent;}catch(err){errorHandler===null||errorHandler===void 0?void 0:errorHandler.onError(err,KETCH_CONSENT_MANAGER_PLUGIN,DESTINATION_CONSENT_STATUS_ERROR);return true;}}}};};

    var ENCRYPTION_PREFIX_V3='RS_ENC_v3_';

    var encrypt$1=function encrypt(value){return "".concat(ENCRYPTION_PREFIX_V3).concat(toBase64(value));};var decrypt$1=function decrypt(value){if(value.startsWith(ENCRYPTION_PREFIX_V3)){return fromBase64(value.substring(ENCRYPTION_PREFIX_V3.length));}return value;};

    var pluginName$3='StorageEncryption';var StorageEncryption=function StorageEncryption(){return {name:pluginName$3,initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$3]);},storage:{encrypt:function encrypt(value){return encrypt$1(value);},decrypt:function decrypt(value){return decrypt$1(value);}}};};

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function getDefaultExportFromNamespaceIfNotNamed (n) {
        return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
    }

    var aes = {exports: {}};

    function commonjsRequire(path) {
        throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
    }

    var core = {exports: {}};

    var _polyfillNode_crypto = {};

    var _polyfillNode_crypto$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        default: _polyfillNode_crypto
    });

    var require$$0 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(_polyfillNode_crypto$1);

    var hasRequiredCore;function requireCore(){if(hasRequiredCore)return core.exports;hasRequiredCore=1;(function(module,exports){(function(root,factory){{// CommonJS
        module.exports=factory();}})(commonjsGlobal,function(){/*globals window, global, require*/ /**
     * CryptoJS core components.
     */var CryptoJS=CryptoJS||function(Math,undefined$1){var crypto;// Native crypto from window (Browser)
        if(typeof window!=='undefined'&&window.crypto){crypto=window.crypto;}// Native crypto in web worker (Browser)
        if(typeof self!=='undefined'&&self.crypto){crypto=self.crypto;}// Native crypto from worker
        if(typeof globalThis!=='undefined'&&globalThis.crypto){crypto=globalThis.crypto;}// Native (experimental IE 11) crypto from window (Browser)
        if(!crypto&&typeof window!=='undefined'&&window.msCrypto){crypto=window.msCrypto;}// Native crypto from global (NodeJS)
        if(!crypto&&typeof commonjsGlobal!=='undefined'&&commonjsGlobal.crypto){crypto=commonjsGlobal.crypto;}// Native crypto import via require (NodeJS)
        if(!crypto&&typeof commonjsRequire==='function'){try{crypto=require$$0;}catch(err){}}/*
			     * Cryptographically secure pseudorandom number generator
			     *
			     * As Math.random() is cryptographically not safe to use
			     */var cryptoSecureRandomInt=function cryptoSecureRandomInt(){if(crypto){// Use getRandomValues method (Browser)
            if(typeof crypto.getRandomValues==='function'){try{return crypto.getRandomValues(new Uint32Array(1))[0];}catch(err){}}// Use randomBytes method (NodeJS)
            if(typeof crypto.randomBytes==='function'){try{return crypto.randomBytes(4).readInt32LE();}catch(err){}}}throw new Error('Native crypto module could not be used to get secure random number.');};/*
			     * Local polyfill of Object.create

			     */var create=Object.create||function(){function F(){}return function(obj){var subtype;F.prototype=obj;subtype=new F();F.prototype=null;return subtype;};}();/**
         * CryptoJS namespace.
         */var C={};/**
         * Library namespace.
         */var C_lib=C.lib={};/**
         * Base object for prototypal inheritance.
         */var Base=C_lib.Base=function(){return {/**
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
             */extend:function extend(overrides){// Spawn
                var subtype=create(this);// Augment
                if(overrides){subtype.mixIn(overrides);}// Create default initializer
                if(!subtype.hasOwnProperty('init')||this.init===subtype.init){subtype.init=function(){subtype.$super.init.apply(this,arguments);};}// Initializer's prototype is the subtype object
                subtype.init.prototype=subtype;// Reference supertype
                subtype.$super=this;return subtype;},/**
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
             */create:function create(){var instance=this.extend();instance.init.apply(instance,arguments);return instance;},/**
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
             */init:function init(){},/**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */mixIn:function mixIn(properties){for(var propertyName in properties){if(properties.hasOwnProperty(propertyName)){this[propertyName]=properties[propertyName];}}// IE won't copy toString using the loop above
                if(properties.hasOwnProperty('toString')){this.toString=properties.toString;}},/**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */clone:function clone(){return this.init.prototype.extend(this);}};}();/**
         * An array of 32-bit words.
         *
         * @property {Array} words The array of 32-bit words.
         * @property {number} sigBytes The number of significant bytes in this word array.
         */var WordArray=C_lib.WordArray=Base.extend({/**
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
             */init:function init(words,sigBytes){words=this.words=words||[];if(sigBytes!=undefined$1){this.sigBytes=sigBytes;}else {this.sigBytes=words.length*4;}},/**
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
             */toString:function toString(encoder){return (encoder||Hex).stringify(this);},/**
             * Concatenates a word array to this word array.
             *
             * @param {WordArray} wordArray The word array to append.
             *
             * @return {WordArray} This word array.
             *
             * @example
             *
             *     wordArray1.concat(wordArray2);
             */concat:function concat(wordArray){// Shortcuts
                var thisWords=this.words;var thatWords=wordArray.words;var thisSigBytes=this.sigBytes;var thatSigBytes=wordArray.sigBytes;// Clamp excess bits
                this.clamp();// Concat
                if(thisSigBytes%4){// Copy one byte at a time
                    for(var i=0;i<thatSigBytes;i++){var thatByte=thatWords[i>>>2]>>>24-i%4*8&0xff;thisWords[thisSigBytes+i>>>2]|=thatByte<<24-(thisSigBytes+i)%4*8;}}else {// Copy one word at a time
                    for(var j=0;j<thatSigBytes;j+=4){thisWords[thisSigBytes+j>>>2]=thatWords[j>>>2];}}this.sigBytes+=thatSigBytes;// Chainable
                return this;},/**
             * Removes insignificant bits.
             *
             * @example
             *
             *     wordArray.clamp();
             */clamp:function clamp(){// Shortcuts
                var words=this.words;var sigBytes=this.sigBytes;// Clamp
                words[sigBytes>>>2]&=0xffffffff<<32-sigBytes%4*8;words.length=Math.ceil(sigBytes/4);},/**
             * Creates a copy of this word array.
             *
             * @return {WordArray} The clone.
             *
             * @example
             *
             *     var clone = wordArray.clone();
             */clone:function clone(){var clone=Base.clone.call(this);clone.words=this.words.slice(0);return clone;},/**
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
             */random:function random(nBytes){var words=[];for(var i=0;i<nBytes;i+=4){words.push(cryptoSecureRandomInt());}return new WordArray.init(words,nBytes);}});/**
         * Encoder namespace.
         */var C_enc=C.enc={};/**
         * Hex encoding strategy.
         */var Hex=C_enc.Hex={/**
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
             */stringify:function stringify(wordArray){// Shortcuts
                var words=wordArray.words;var sigBytes=wordArray.sigBytes;// Convert
                var hexChars=[];for(var i=0;i<sigBytes;i++){var bite=words[i>>>2]>>>24-i%4*8&0xff;hexChars.push((bite>>>4).toString(16));hexChars.push((bite&0x0f).toString(16));}return hexChars.join('');},/**
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
             */parse:function parse(hexStr){// Shortcut
                var hexStrLength=hexStr.length;// Convert
                var words=[];for(var i=0;i<hexStrLength;i+=2){words[i>>>3]|=parseInt(hexStr.substr(i,2),16)<<24-i%8*4;}return new WordArray.init(words,hexStrLength/2);}};/**
         * Latin1 encoding strategy.
         */var Latin1=C_enc.Latin1={/**
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
             */stringify:function stringify(wordArray){// Shortcuts
                var words=wordArray.words;var sigBytes=wordArray.sigBytes;// Convert
                var latin1Chars=[];for(var i=0;i<sigBytes;i++){var bite=words[i>>>2]>>>24-i%4*8&0xff;latin1Chars.push(String.fromCharCode(bite));}return latin1Chars.join('');},/**
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
             */parse:function parse(latin1Str){// Shortcut
                var latin1StrLength=latin1Str.length;// Convert
                var words=[];for(var i=0;i<latin1StrLength;i++){words[i>>>2]|=(latin1Str.charCodeAt(i)&0xff)<<24-i%4*8;}return new WordArray.init(words,latin1StrLength);}};/**
         * UTF-8 encoding strategy.
         */var Utf8=C_enc.Utf8={/**
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
             */stringify:function stringify(wordArray){try{return decodeURIComponent(escape(Latin1.stringify(wordArray)));}catch(e){throw new Error('Malformed UTF-8 data');}},/**
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
             */parse:function parse(utf8Str){return Latin1.parse(unescape(encodeURIComponent(utf8Str)));}};/**
         * Abstract buffered block algorithm template.
         *
         * The property blockSize must be implemented in a concrete subtype.
         *
         * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
         */var BufferedBlockAlgorithm=C_lib.BufferedBlockAlgorithm=Base.extend({/**
             * Resets this block algorithm's data buffer to its initial state.
             *
             * @example
             *
             *     bufferedBlockAlgorithm.reset();
             */reset:function reset(){// Initial values
                this._data=new WordArray.init();this._nDataBytes=0;},/**
             * Adds new data to this block algorithm's buffer.
             *
             * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
             *
             * @example
             *
             *     bufferedBlockAlgorithm._append('data');
             *     bufferedBlockAlgorithm._append(wordArray);
             */_append:function _append(data){// Convert string to WordArray, else assume WordArray already
                if(typeof data=='string'){data=Utf8.parse(data);}// Append
                this._data.concat(data);this._nDataBytes+=data.sigBytes;},/**
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
             */_process:function _process(doFlush){var processedWords;// Shortcuts
                var data=this._data;var dataWords=data.words;var dataSigBytes=data.sigBytes;var blockSize=this.blockSize;var blockSizeBytes=blockSize*4;// Count blocks ready
                var nBlocksReady=dataSigBytes/blockSizeBytes;if(doFlush){// Round up to include partial blocks
                    nBlocksReady=Math.ceil(nBlocksReady);}else {// Round down to include only full blocks,
// less the number of blocks that must remain in the buffer
                    nBlocksReady=Math.max((nBlocksReady|0)-this._minBufferSize,0);}// Count words ready
                var nWordsReady=nBlocksReady*blockSize;// Count bytes ready
                var nBytesReady=Math.min(nWordsReady*4,dataSigBytes);// Process blocks
                if(nWordsReady){for(var offset=0;offset<nWordsReady;offset+=blockSize){// Perform concrete-algorithm logic
                    this._doProcessBlock(dataWords,offset);}// Remove processed words
                    processedWords=dataWords.splice(0,nWordsReady);data.sigBytes-=nBytesReady;}// Return processed words
                return new WordArray.init(processedWords,nBytesReady);},/**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = bufferedBlockAlgorithm.clone();
             */clone:function clone(){var clone=Base.clone.call(this);clone._data=this._data.clone();return clone;},_minBufferSize:0});/**
         * Abstract hasher template.
         *
         * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
         */C_lib.Hasher=BufferedBlockAlgorithm.extend({/**
             * Configuration options.
             */cfg:Base.extend(),/**
             * Initializes a newly created hasher.
             *
             * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
             *
             * @example
             *
             *     var hasher = CryptoJS.algo.SHA256.create();
             */init:function init(cfg){// Apply config defaults
                this.cfg=this.cfg.extend(cfg);// Set initial values
                this.reset();},/**
             * Resets this hasher to its initial state.
             *
             * @example
             *
             *     hasher.reset();
             */reset:function reset(){// Reset data buffer
                BufferedBlockAlgorithm.reset.call(this);// Perform concrete-hasher logic
                this._doReset();},/**
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
             */update:function update(messageUpdate){// Append
                this._append(messageUpdate);// Update the hash
                this._process();// Chainable
                return this;},/**
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
             */finalize:function finalize(messageUpdate){// Final message update
                if(messageUpdate){this._append(messageUpdate);}// Perform concrete-hasher logic
                var hash=this._doFinalize();return hash;},blockSize:512/32,/**
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
             */_createHelper:function _createHelper(hasher){return function(message,cfg){return new hasher.init(cfg).finalize(message);};},/**
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
             */_createHmacHelper:function _createHmacHelper(hasher){return function(message,key){return new C_algo.HMAC.init(hasher,key).finalize(message);};}});/**
         * Algorithm namespace.
         */var C_algo=C.algo={};return C;}(Math);return CryptoJS;});})(core);return core.exports;}

    var encBase64 = {exports: {}};

    var hasRequiredEncBase64;function requireEncBase64(){if(hasRequiredEncBase64)return encBase64.exports;hasRequiredEncBase64=1;(function(module,exports){(function(root,factory){{// CommonJS
        module.exports=factory(requireCore());}})(commonjsGlobal,function(CryptoJS){(function(){// Shortcuts
        var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var C_enc=C.enc;/**
         * Base64 encoding strategy.
         */C_enc.Base64={/**
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
             */stringify:function stringify(wordArray){// Shortcuts
                var words=wordArray.words;var sigBytes=wordArray.sigBytes;var map=this._map;// Clamp excess bits
                wordArray.clamp();// Convert
                var base64Chars=[];for(var i=0;i<sigBytes;i+=3){var byte1=words[i>>>2]>>>24-i%4*8&0xff;var byte2=words[i+1>>>2]>>>24-(i+1)%4*8&0xff;var byte3=words[i+2>>>2]>>>24-(i+2)%4*8&0xff;var triplet=byte1<<16|byte2<<8|byte3;for(var j=0;j<4&&i+j*0.75<sigBytes;j++){base64Chars.push(map.charAt(triplet>>>6*(3-j)&0x3f));}}// Add padding
                var paddingChar=map.charAt(64);if(paddingChar){while(base64Chars.length%4){base64Chars.push(paddingChar);}}return base64Chars.join('');},/**
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
             */parse:function parse(base64Str){// Shortcuts
                var base64StrLength=base64Str.length;var map=this._map;var reverseMap=this._reverseMap;if(!reverseMap){reverseMap=this._reverseMap=[];for(var j=0;j<map.length;j++){reverseMap[map.charCodeAt(j)]=j;}}// Ignore padding
                var paddingChar=map.charAt(64);if(paddingChar){var paddingIndex=base64Str.indexOf(paddingChar);if(paddingIndex!==-1){base64StrLength=paddingIndex;}}// Convert
                return parseLoop(base64Str,base64StrLength,reverseMap);},_map:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='};function parseLoop(base64Str,base64StrLength,reverseMap){var words=[];var nBytes=0;for(var i=0;i<base64StrLength;i++){if(i%4){var bits1=reverseMap[base64Str.charCodeAt(i-1)]<<i%4*2;var bits2=reverseMap[base64Str.charCodeAt(i)]>>>6-i%4*2;var bitsCombined=bits1|bits2;words[nBytes>>>2]|=bitsCombined<<24-nBytes%4*8;nBytes++;}}return WordArray.create(words,nBytes);}})();return CryptoJS.enc.Base64;});})(encBase64);return encBase64.exports;}

    var md5 = {exports: {}};

    var hasRequiredMd5;function requireMd5(){if(hasRequiredMd5)return md5.exports;hasRequiredMd5=1;(function(module,exports){(function(root,factory){{// CommonJS
        module.exports=factory(requireCore());}})(commonjsGlobal,function(CryptoJS){(function(Math){// Shortcuts
        var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var Hasher=C_lib.Hasher;var C_algo=C.algo;// Constants table
        var T=[];// Compute constants
        (function(){for(var i=0;i<64;i++){T[i]=Math.abs(Math.sin(i+1))*0x100000000|0;}})();/**
         * MD5 hash algorithm.
         */var MD5=C_algo.MD5=Hasher.extend({_doReset:function _doReset(){this._hash=new WordArray.init([0x67452301,0xefcdab89,0x98badcfe,0x10325476]);},_doProcessBlock:function _doProcessBlock(M,offset){// Swap endian
                for(var i=0;i<16;i++){// Shortcuts
                    var offset_i=offset+i;var M_offset_i=M[offset_i];M[offset_i]=(M_offset_i<<8|M_offset_i>>>24)&0x00ff00ff|(M_offset_i<<24|M_offset_i>>>8)&0xff00ff00;}// Shortcuts
                var H=this._hash.words;var M_offset_0=M[offset+0];var M_offset_1=M[offset+1];var M_offset_2=M[offset+2];var M_offset_3=M[offset+3];var M_offset_4=M[offset+4];var M_offset_5=M[offset+5];var M_offset_6=M[offset+6];var M_offset_7=M[offset+7];var M_offset_8=M[offset+8];var M_offset_9=M[offset+9];var M_offset_10=M[offset+10];var M_offset_11=M[offset+11];var M_offset_12=M[offset+12];var M_offset_13=M[offset+13];var M_offset_14=M[offset+14];var M_offset_15=M[offset+15];// Working varialbes
                var a=H[0];var b=H[1];var c=H[2];var d=H[3];// Computation
                a=FF(a,b,c,d,M_offset_0,7,T[0]);d=FF(d,a,b,c,M_offset_1,12,T[1]);c=FF(c,d,a,b,M_offset_2,17,T[2]);b=FF(b,c,d,a,M_offset_3,22,T[3]);a=FF(a,b,c,d,M_offset_4,7,T[4]);d=FF(d,a,b,c,M_offset_5,12,T[5]);c=FF(c,d,a,b,M_offset_6,17,T[6]);b=FF(b,c,d,a,M_offset_7,22,T[7]);a=FF(a,b,c,d,M_offset_8,7,T[8]);d=FF(d,a,b,c,M_offset_9,12,T[9]);c=FF(c,d,a,b,M_offset_10,17,T[10]);b=FF(b,c,d,a,M_offset_11,22,T[11]);a=FF(a,b,c,d,M_offset_12,7,T[12]);d=FF(d,a,b,c,M_offset_13,12,T[13]);c=FF(c,d,a,b,M_offset_14,17,T[14]);b=FF(b,c,d,a,M_offset_15,22,T[15]);a=GG(a,b,c,d,M_offset_1,5,T[16]);d=GG(d,a,b,c,M_offset_6,9,T[17]);c=GG(c,d,a,b,M_offset_11,14,T[18]);b=GG(b,c,d,a,M_offset_0,20,T[19]);a=GG(a,b,c,d,M_offset_5,5,T[20]);d=GG(d,a,b,c,M_offset_10,9,T[21]);c=GG(c,d,a,b,M_offset_15,14,T[22]);b=GG(b,c,d,a,M_offset_4,20,T[23]);a=GG(a,b,c,d,M_offset_9,5,T[24]);d=GG(d,a,b,c,M_offset_14,9,T[25]);c=GG(c,d,a,b,M_offset_3,14,T[26]);b=GG(b,c,d,a,M_offset_8,20,T[27]);a=GG(a,b,c,d,M_offset_13,5,T[28]);d=GG(d,a,b,c,M_offset_2,9,T[29]);c=GG(c,d,a,b,M_offset_7,14,T[30]);b=GG(b,c,d,a,M_offset_12,20,T[31]);a=HH(a,b,c,d,M_offset_5,4,T[32]);d=HH(d,a,b,c,M_offset_8,11,T[33]);c=HH(c,d,a,b,M_offset_11,16,T[34]);b=HH(b,c,d,a,M_offset_14,23,T[35]);a=HH(a,b,c,d,M_offset_1,4,T[36]);d=HH(d,a,b,c,M_offset_4,11,T[37]);c=HH(c,d,a,b,M_offset_7,16,T[38]);b=HH(b,c,d,a,M_offset_10,23,T[39]);a=HH(a,b,c,d,M_offset_13,4,T[40]);d=HH(d,a,b,c,M_offset_0,11,T[41]);c=HH(c,d,a,b,M_offset_3,16,T[42]);b=HH(b,c,d,a,M_offset_6,23,T[43]);a=HH(a,b,c,d,M_offset_9,4,T[44]);d=HH(d,a,b,c,M_offset_12,11,T[45]);c=HH(c,d,a,b,M_offset_15,16,T[46]);b=HH(b,c,d,a,M_offset_2,23,T[47]);a=II(a,b,c,d,M_offset_0,6,T[48]);d=II(d,a,b,c,M_offset_7,10,T[49]);c=II(c,d,a,b,M_offset_14,15,T[50]);b=II(b,c,d,a,M_offset_5,21,T[51]);a=II(a,b,c,d,M_offset_12,6,T[52]);d=II(d,a,b,c,M_offset_3,10,T[53]);c=II(c,d,a,b,M_offset_10,15,T[54]);b=II(b,c,d,a,M_offset_1,21,T[55]);a=II(a,b,c,d,M_offset_8,6,T[56]);d=II(d,a,b,c,M_offset_15,10,T[57]);c=II(c,d,a,b,M_offset_6,15,T[58]);b=II(b,c,d,a,M_offset_13,21,T[59]);a=II(a,b,c,d,M_offset_4,6,T[60]);d=II(d,a,b,c,M_offset_11,10,T[61]);c=II(c,d,a,b,M_offset_2,15,T[62]);b=II(b,c,d,a,M_offset_9,21,T[63]);// Intermediate hash value
                H[0]=H[0]+a|0;H[1]=H[1]+b|0;H[2]=H[2]+c|0;H[3]=H[3]+d|0;},_doFinalize:function _doFinalize(){// Shortcuts
                var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;// Add padding
                dataWords[nBitsLeft>>>5]|=0x80<<24-nBitsLeft%32;var nBitsTotalH=Math.floor(nBitsTotal/0x100000000);var nBitsTotalL=nBitsTotal;dataWords[(nBitsLeft+64>>>9<<4)+15]=(nBitsTotalH<<8|nBitsTotalH>>>24)&0x00ff00ff|(nBitsTotalH<<24|nBitsTotalH>>>8)&0xff00ff00;dataWords[(nBitsLeft+64>>>9<<4)+14]=(nBitsTotalL<<8|nBitsTotalL>>>24)&0x00ff00ff|(nBitsTotalL<<24|nBitsTotalL>>>8)&0xff00ff00;data.sigBytes=(dataWords.length+1)*4;// Hash final blocks
                this._process();// Shortcuts
                var hash=this._hash;var H=hash.words;// Swap endian
                for(var i=0;i<4;i++){// Shortcut
                    var H_i=H[i];H[i]=(H_i<<8|H_i>>>24)&0x00ff00ff|(H_i<<24|H_i>>>8)&0xff00ff00;}// Return final computed hash
                return hash;},clone:function clone(){var clone=Hasher.clone.call(this);clone._hash=this._hash.clone();return clone;}});function FF(a,b,c,d,x,s,t){var n=a+(b&c|~b&d)+x+t;return (n<<s|n>>>32-s)+b;}function GG(a,b,c,d,x,s,t){var n=a+(b&d|c&~d)+x+t;return (n<<s|n>>>32-s)+b;}function HH(a,b,c,d,x,s,t){var n=a+(b^c^d)+x+t;return (n<<s|n>>>32-s)+b;}function II(a,b,c,d,x,s,t){var n=a+(c^(b|~d))+x+t;return (n<<s|n>>>32-s)+b;}/**
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
         */C.MD5=Hasher._createHelper(MD5);/**
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
         */C.HmacMD5=Hasher._createHmacHelper(MD5);})(Math);return CryptoJS.MD5;});})(md5);return md5.exports;}

    var evpkdf = {exports: {}};

    var sha1 = {exports: {}};

    var hasRequiredSha1;function requireSha1(){if(hasRequiredSha1)return sha1.exports;hasRequiredSha1=1;(function(module,exports){(function(root,factory){{// CommonJS
        module.exports=factory(requireCore());}})(commonjsGlobal,function(CryptoJS){(function(){// Shortcuts
        var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var Hasher=C_lib.Hasher;var C_algo=C.algo;// Reusable object
        var W=[];/**
         * SHA-1 hash algorithm.
         */var SHA1=C_algo.SHA1=Hasher.extend({_doReset:function _doReset(){this._hash=new WordArray.init([0x67452301,0xefcdab89,0x98badcfe,0x10325476,0xc3d2e1f0]);},_doProcessBlock:function _doProcessBlock(M,offset){// Shortcut
                var H=this._hash.words;// Working variables
                var a=H[0];var b=H[1];var c=H[2];var d=H[3];var e=H[4];// Computation
                for(var i=0;i<80;i++){if(i<16){W[i]=M[offset+i]|0;}else {var n=W[i-3]^W[i-8]^W[i-14]^W[i-16];W[i]=n<<1|n>>>31;}var t=(a<<5|a>>>27)+e+W[i];if(i<20){t+=(b&c|~b&d)+0x5a827999;}else if(i<40){t+=(b^c^d)+0x6ed9eba1;}else if(i<60){t+=(b&c|b&d|c&d)-0x70e44324;}else/* if (i < 80) */{t+=(b^c^d)-0x359d3e2a;}e=d;d=c;c=b<<30|b>>>2;b=a;a=t;}// Intermediate hash value
                H[0]=H[0]+a|0;H[1]=H[1]+b|0;H[2]=H[2]+c|0;H[3]=H[3]+d|0;H[4]=H[4]+e|0;},_doFinalize:function _doFinalize(){// Shortcuts
                var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;// Add padding
                dataWords[nBitsLeft>>>5]|=0x80<<24-nBitsLeft%32;dataWords[(nBitsLeft+64>>>9<<4)+14]=Math.floor(nBitsTotal/0x100000000);dataWords[(nBitsLeft+64>>>9<<4)+15]=nBitsTotal;data.sigBytes=dataWords.length*4;// Hash final blocks
                this._process();// Return final computed hash
                return this._hash;},clone:function clone(){var clone=Hasher.clone.call(this);clone._hash=this._hash.clone();return clone;}});/**
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
         */C.SHA1=Hasher._createHelper(SHA1);/**
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
         */C.HmacSHA1=Hasher._createHmacHelper(SHA1);})();return CryptoJS.SHA1;});})(sha1);return sha1.exports;}

    var hmac = {exports: {}};

    var hasRequiredHmac;function requireHmac(){if(hasRequiredHmac)return hmac.exports;hasRequiredHmac=1;(function(module,exports){(function(root,factory){{// CommonJS
        module.exports=factory(requireCore());}})(commonjsGlobal,function(CryptoJS){(function(){// Shortcuts
        var C=CryptoJS;var C_lib=C.lib;var Base=C_lib.Base;var C_enc=C.enc;var Utf8=C_enc.Utf8;var C_algo=C.algo;/**
         * HMAC algorithm.
         */C_algo.HMAC=Base.extend({/**
             * Initializes a newly created HMAC.
             *
             * @param {Hasher} hasher The hash algorithm to use.
             * @param {WordArray|string} key The secret key.
             *
             * @example
             *
             *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
             */init:function init(hasher,key){// Init hasher
                hasher=this._hasher=new hasher.init();// Convert string to WordArray, else assume WordArray already
                if(typeof key=='string'){key=Utf8.parse(key);}// Shortcuts
                var hasherBlockSize=hasher.blockSize;var hasherBlockSizeBytes=hasherBlockSize*4;// Allow arbitrary length keys
                if(key.sigBytes>hasherBlockSizeBytes){key=hasher.finalize(key);}// Clamp excess bits
                key.clamp();// Clone key for inner and outer pads
                var oKey=this._oKey=key.clone();var iKey=this._iKey=key.clone();// Shortcuts
                var oKeyWords=oKey.words;var iKeyWords=iKey.words;// XOR keys with pad constants
                for(var i=0;i<hasherBlockSize;i++){oKeyWords[i]^=0x5c5c5c5c;iKeyWords[i]^=0x36363636;}oKey.sigBytes=iKey.sigBytes=hasherBlockSizeBytes;// Set initial values
                this.reset();},/**
             * Resets this HMAC to its initial state.
             *
             * @example
             *
             *     hmacHasher.reset();
             */reset:function reset(){// Shortcut
                var hasher=this._hasher;// Reset
                hasher.reset();hasher.update(this._iKey);},/**
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
             */update:function update(messageUpdate){this._hasher.update(messageUpdate);// Chainable
                return this;},/**
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
             */finalize:function finalize(messageUpdate){// Shortcut
                var hasher=this._hasher;// Compute HMAC
                var innerHash=hasher.finalize(messageUpdate);hasher.reset();var hmac=hasher.finalize(this._oKey.clone().concat(innerHash));return hmac;}});})();});})(hmac);return hmac.exports;}

    var hasRequiredEvpkdf;function requireEvpkdf(){if(hasRequiredEvpkdf)return evpkdf.exports;hasRequiredEvpkdf=1;(function(module,exports){(function(root,factory,undef){{// CommonJS
        module.exports=factory(requireCore(),requireSha1(),requireHmac());}})(commonjsGlobal,function(CryptoJS){(function(){// Shortcuts
        var C=CryptoJS;var C_lib=C.lib;var Base=C_lib.Base;var WordArray=C_lib.WordArray;var C_algo=C.algo;var MD5=C_algo.MD5;/**
         * This key derivation function is meant to conform with EVP_BytesToKey.
         * www.openssl.org/docs/crypto/EVP_BytesToKey.html
         */var EvpKDF=C_algo.EvpKDF=Base.extend({/**
             * Configuration options.
             *
             * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
             * @property {Hasher} hasher The hash algorithm to use. Default: MD5
             * @property {number} iterations The number of iterations to perform. Default: 1
             */cfg:Base.extend({keySize:128/32,hasher:MD5,iterations:1}),/**
             * Initializes a newly created key derivation function.
             *
             * @param {Object} cfg (Optional) The configuration options to use for the derivation.
             *
             * @example
             *
             *     var kdf = CryptoJS.algo.EvpKDF.create();
             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
             */init:function init(cfg){this.cfg=this.cfg.extend(cfg);},/**
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
             */compute:function compute(password,salt){var block;// Shortcut
                var cfg=this.cfg;// Init hasher
                var hasher=cfg.hasher.create();// Initial values
                var derivedKey=WordArray.create();// Shortcuts
                var derivedKeyWords=derivedKey.words;var keySize=cfg.keySize;var iterations=cfg.iterations;// Generate key
                while(derivedKeyWords.length<keySize){if(block){hasher.update(block);}block=hasher.update(password).finalize(salt);hasher.reset();// Iterations
                    for(var i=1;i<iterations;i++){block=hasher.finalize(block);hasher.reset();}derivedKey.concat(block);}derivedKey.sigBytes=keySize*4;return derivedKey;}});/**
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
         */C.EvpKDF=function(password,salt,cfg){return EvpKDF.create(cfg).compute(password,salt);};})();return CryptoJS.EvpKDF;});})(evpkdf);return evpkdf.exports;}

    var cipherCore = {exports: {}};

    var hasRequiredCipherCore;function requireCipherCore(){if(hasRequiredCipherCore)return cipherCore.exports;hasRequiredCipherCore=1;(function(module,exports){(function(root,factory,undef){{// CommonJS
        module.exports=factory(requireCore(),requireEvpkdf());}})(commonjsGlobal,function(CryptoJS){/**
     * Cipher core components.
     */CryptoJS.lib.Cipher||function(undefined$1){// Shortcuts
        var C=CryptoJS;var C_lib=C.lib;var Base=C_lib.Base;var WordArray=C_lib.WordArray;var BufferedBlockAlgorithm=C_lib.BufferedBlockAlgorithm;var C_enc=C.enc;C_enc.Utf8;var Base64=C_enc.Base64;var C_algo=C.algo;var EvpKDF=C_algo.EvpKDF;/**
         * Abstract base cipher template.
         *
         * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
         * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
         * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
         * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
         */var Cipher=C_lib.Cipher=BufferedBlockAlgorithm.extend({/**
             * Configuration options.
             *
             * @property {WordArray} iv The IV to use for this operation.
             */cfg:Base.extend(),/**
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
             */createEncryptor:function createEncryptor(key,cfg){return this.create(this._ENC_XFORM_MODE,key,cfg);},/**
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
             */createDecryptor:function createDecryptor(key,cfg){return this.create(this._DEC_XFORM_MODE,key,cfg);},/**
             * Initializes a newly created cipher.
             *
             * @param {number} xformMode Either the encryption or decryption transormation mode constant.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
             */init:function init(xformMode,key,cfg){// Apply config defaults
                this.cfg=this.cfg.extend(cfg);// Store transform mode and key
                this._xformMode=xformMode;this._key=key;// Set initial values
                this.reset();},/**
             * Resets this cipher to its initial state.
             *
             * @example
             *
             *     cipher.reset();
             */reset:function reset(){// Reset data buffer
                BufferedBlockAlgorithm.reset.call(this);// Perform concrete-cipher logic
                this._doReset();},/**
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
             */process:function process(dataUpdate){// Append
                this._append(dataUpdate);// Process available blocks
                return this._process();},/**
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
             */finalize:function finalize(dataUpdate){// Final data update
                if(dataUpdate){this._append(dataUpdate);}// Perform concrete-cipher logic
                var finalProcessedData=this._doFinalize();return finalProcessedData;},keySize:128/32,ivSize:128/32,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,/**
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
             */_createHelper:function(){function selectCipherStrategy(key){if(typeof key=='string'){return PasswordBasedCipher;}else {return SerializableCipher;}}return function(cipher){return {encrypt:function encrypt(message,key,cfg){return selectCipherStrategy(key).encrypt(cipher,message,key,cfg);},decrypt:function decrypt(ciphertext,key,cfg){return selectCipherStrategy(key).decrypt(cipher,ciphertext,key,cfg);}};};}()});/**
         * Abstract base stream cipher template.
         *
         * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
         */C_lib.StreamCipher=Cipher.extend({_doFinalize:function _doFinalize(){// Process partial blocks
                var finalProcessedBlocks=this._process(!!'flush');return finalProcessedBlocks;},blockSize:1});/**
         * Mode namespace.
         */var C_mode=C.mode={};/**
         * Abstract base block cipher mode template.
         */var BlockCipherMode=C_lib.BlockCipherMode=Base.extend({/**
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
             */createEncryptor:function createEncryptor(cipher,iv){return this.Encryptor.create(cipher,iv);},/**
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
             */createDecryptor:function createDecryptor(cipher,iv){return this.Decryptor.create(cipher,iv);},/**
             * Initializes a newly created mode.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
             */init:function init(cipher,iv){this._cipher=cipher;this._iv=iv;}});/**
         * Cipher Block Chaining mode.
         */var CBC=C_mode.CBC=function(){/**
         * Abstract base CBC mode.
         */var CBC=BlockCipherMode.extend();/**
         * CBC encryptor.
         */CBC.Encryptor=CBC.extend({/**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */processBlock:function processBlock(words,offset){// Shortcuts
                var cipher=this._cipher;var blockSize=cipher.blockSize;// XOR and encrypt
                xorBlock.call(this,words,offset,blockSize);cipher.encryptBlock(words,offset);// Remember this block to use with next block
                this._prevBlock=words.slice(offset,offset+blockSize);}});/**
         * CBC decryptor.
         */CBC.Decryptor=CBC.extend({/**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */processBlock:function processBlock(words,offset){// Shortcuts
                var cipher=this._cipher;var blockSize=cipher.blockSize;// Remember this block to use with next block
                var thisBlock=words.slice(offset,offset+blockSize);// Decrypt and XOR
                cipher.decryptBlock(words,offset);xorBlock.call(this,words,offset,blockSize);// This block becomes the previous block
                this._prevBlock=thisBlock;}});function xorBlock(words,offset,blockSize){var block;// Shortcut
            var iv=this._iv;// Choose mixing block
            if(iv){block=iv;// Remove IV for subsequent blocks
                this._iv=undefined$1;}else {block=this._prevBlock;}// XOR blocks
            for(var i=0;i<blockSize;i++){words[offset+i]^=block[i];}}return CBC;}();/**
         * Padding namespace.
         */var C_pad=C.pad={};/**
         * PKCS #5/7 padding strategy.
         */var Pkcs7=C_pad.Pkcs7={/**
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
             */pad:function pad(data,blockSize){// Shortcut
                var blockSizeBytes=blockSize*4;// Count padding bytes
                var nPaddingBytes=blockSizeBytes-data.sigBytes%blockSizeBytes;// Create padding word
                var paddingWord=nPaddingBytes<<24|nPaddingBytes<<16|nPaddingBytes<<8|nPaddingBytes;// Create padding
                var paddingWords=[];for(var i=0;i<nPaddingBytes;i+=4){paddingWords.push(paddingWord);}var padding=WordArray.create(paddingWords,nPaddingBytes);// Add padding
                data.concat(padding);},/**
             * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
             *
             * @param {WordArray} data The data to unpad.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.pad.Pkcs7.unpad(wordArray);
             */unpad:function unpad(data){// Get number of padding bytes from last byte
                var nPaddingBytes=data.words[data.sigBytes-1>>>2]&0xff;// Remove padding
                data.sigBytes-=nPaddingBytes;}};/**
         * Abstract base block cipher template.
         *
         * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
         */C_lib.BlockCipher=Cipher.extend({/**
             * Configuration options.
             *
             * @property {Mode} mode The block mode to use. Default: CBC
             * @property {Padding} padding The padding strategy to use. Default: Pkcs7
             */cfg:Cipher.cfg.extend({mode:CBC,padding:Pkcs7}),reset:function reset(){var modeCreator;// Reset cipher
                Cipher.reset.call(this);// Shortcuts
                var cfg=this.cfg;var iv=cfg.iv;var mode=cfg.mode;// Reset block mode
                if(this._xformMode==this._ENC_XFORM_MODE){modeCreator=mode.createEncryptor;}else/* if (this._xformMode == this._DEC_XFORM_MODE) */{modeCreator=mode.createDecryptor;// Keep at least one block in the buffer for unpadding
                    this._minBufferSize=1;}if(this._mode&&this._mode.__creator==modeCreator){this._mode.init(this,iv&&iv.words);}else {this._mode=modeCreator.call(mode,this,iv&&iv.words);this._mode.__creator=modeCreator;}},_doProcessBlock:function _doProcessBlock(words,offset){this._mode.processBlock(words,offset);},_doFinalize:function _doFinalize(){var finalProcessedBlocks;// Shortcut
                var padding=this.cfg.padding;// Finalize
                if(this._xformMode==this._ENC_XFORM_MODE){// Pad data
                    padding.pad(this._data,this.blockSize);// Process final blocks
                    finalProcessedBlocks=this._process(!!'flush');}else/* if (this._xformMode == this._DEC_XFORM_MODE) */{// Process final blocks
                    finalProcessedBlocks=this._process(!!'flush');// Unpad data
                    padding.unpad(finalProcessedBlocks);}return finalProcessedBlocks;},blockSize:128/32});/**
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
         */var CipherParams=C_lib.CipherParams=Base.extend({/**
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
             */init:function init(cipherParams){this.mixIn(cipherParams);},/**
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
             */toString:function toString(formatter){return (formatter||this.formatter).stringify(this);}});/**
         * Format namespace.
         */var C_format=C.format={};/**
         * OpenSSL formatting strategy.
         */var OpenSSLFormatter=C_format.OpenSSL={/**
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
             */stringify:function stringify(cipherParams){var wordArray;// Shortcuts
                var ciphertext=cipherParams.ciphertext;var salt=cipherParams.salt;// Format
                if(salt){wordArray=WordArray.create([0x53616c74,0x65645f5f]).concat(salt).concat(ciphertext);}else {wordArray=ciphertext;}return wordArray.toString(Base64);},/**
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
             */parse:function parse(openSSLStr){var salt;// Parse base64
                var ciphertext=Base64.parse(openSSLStr);// Shortcut
                var ciphertextWords=ciphertext.words;// Test for salt
                if(ciphertextWords[0]==0x53616c74&&ciphertextWords[1]==0x65645f5f){// Extract salt
                    salt=WordArray.create(ciphertextWords.slice(2,4));// Remove salt from ciphertext
                    ciphertextWords.splice(0,4);ciphertext.sigBytes-=16;}return CipherParams.create({ciphertext:ciphertext,salt:salt});}};/**
         * A cipher wrapper that returns ciphertext as a serializable cipher params object.
         */var SerializableCipher=C_lib.SerializableCipher=Base.extend({/**
             * Configuration options.
             *
             * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
             */cfg:Base.extend({format:OpenSSLFormatter}),/**
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
             */encrypt:function encrypt(cipher,message,key,cfg){// Apply config defaults
                cfg=this.cfg.extend(cfg);// Encrypt
                var encryptor=cipher.createEncryptor(key,cfg);var ciphertext=encryptor.finalize(message);// Shortcut
                var cipherCfg=encryptor.cfg;// Create and return serializable cipher params
                return CipherParams.create({ciphertext:ciphertext,key:key,iv:cipherCfg.iv,algorithm:cipher,mode:cipherCfg.mode,padding:cipherCfg.padding,blockSize:cipher.blockSize,formatter:cfg.format});},/**
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
             */decrypt:function decrypt(cipher,ciphertext,key,cfg){// Apply config defaults
                cfg=this.cfg.extend(cfg);// Convert string to CipherParams
                ciphertext=this._parse(ciphertext,cfg.format);// Decrypt
                var plaintext=cipher.createDecryptor(key,cfg).finalize(ciphertext.ciphertext);return plaintext;},/**
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
             */_parse:function _parse(ciphertext,format){if(typeof ciphertext=='string'){return format.parse(ciphertext,this);}else {return ciphertext;}}});/**
         * Key derivation function namespace.
         */var C_kdf=C.kdf={};/**
         * OpenSSL key derivation function.
         */var OpenSSLKdf=C_kdf.OpenSSL={/**
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
             */execute:function execute(password,keySize,ivSize,salt){// Generate random salt
                if(!salt){salt=WordArray.random(64/8);}// Derive key and IV
                var key=EvpKDF.create({keySize:keySize+ivSize}).compute(password,salt);// Separate key and IV
                var iv=WordArray.create(key.words.slice(keySize),ivSize*4);key.sigBytes=keySize*4;// Return params
                return CipherParams.create({key:key,iv:iv,salt:salt});}};/**
         * A serializable cipher wrapper that derives the key from a password,
         * and returns ciphertext as a serializable cipher params object.
         */var PasswordBasedCipher=C_lib.PasswordBasedCipher=SerializableCipher.extend({/**
             * Configuration options.
             *
             * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
             */cfg:SerializableCipher.cfg.extend({kdf:OpenSSLKdf}),/**
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
             */encrypt:function encrypt(cipher,message,password,cfg){// Apply config defaults
                cfg=this.cfg.extend(cfg);// Derive key and other params
                var derivedParams=cfg.kdf.execute(password,cipher.keySize,cipher.ivSize);// Add IV to config
                cfg.iv=derivedParams.iv;// Encrypt
                var ciphertext=SerializableCipher.encrypt.call(this,cipher,message,derivedParams.key,cfg);// Mix in derived params
                ciphertext.mixIn(derivedParams);return ciphertext;},/**
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
             */decrypt:function decrypt(cipher,ciphertext,password,cfg){// Apply config defaults
                cfg=this.cfg.extend(cfg);// Convert string to CipherParams
                ciphertext=this._parse(ciphertext,cfg.format);// Derive key and other params
                var derivedParams=cfg.kdf.execute(password,cipher.keySize,cipher.ivSize,ciphertext.salt);// Add IV to config
                cfg.iv=derivedParams.iv;// Decrypt
                var plaintext=SerializableCipher.decrypt.call(this,cipher,ciphertext,derivedParams.key,cfg);return plaintext;}});}();});})(cipherCore);return cipherCore.exports;}

    (function(module,exports){(function(root,factory,undef){{// CommonJS
        module.exports=factory(requireCore(),requireEncBase64(),requireMd5(),requireEvpkdf(),requireCipherCore());}})(commonjsGlobal,function(CryptoJS){(function(){// Shortcuts
        var C=CryptoJS;var C_lib=C.lib;var BlockCipher=C_lib.BlockCipher;var C_algo=C.algo;// Lookup tables
        var SBOX=[];var INV_SBOX=[];var SUB_MIX_0=[];var SUB_MIX_1=[];var SUB_MIX_2=[];var SUB_MIX_3=[];var INV_SUB_MIX_0=[];var INV_SUB_MIX_1=[];var INV_SUB_MIX_2=[];var INV_SUB_MIX_3=[];// Compute lookup tables
        (function(){// Compute double table
            var d=[];for(var i=0;i<256;i++){if(i<128){d[i]=i<<1;}else {d[i]=i<<1^0x11b;}}// Walk GF(2^8)
            var x=0;var xi=0;for(var i=0;i<256;i++){// Compute sbox
                var sx=xi^xi<<1^xi<<2^xi<<3^xi<<4;sx=sx>>>8^sx&0xff^0x63;SBOX[x]=sx;INV_SBOX[sx]=x;// Compute multiplication
                var x2=d[x];var x4=d[x2];var x8=d[x4];// Compute sub bytes, mix columns tables
                var t=d[sx]*0x101^sx*0x1010100;SUB_MIX_0[x]=t<<24|t>>>8;SUB_MIX_1[x]=t<<16|t>>>16;SUB_MIX_2[x]=t<<8|t>>>24;SUB_MIX_3[x]=t;// Compute inv sub bytes, inv mix columns tables
                var t=x8*0x1010101^x4*0x10001^x2*0x101^x*0x1010100;INV_SUB_MIX_0[sx]=t<<24|t>>>8;INV_SUB_MIX_1[sx]=t<<16|t>>>16;INV_SUB_MIX_2[sx]=t<<8|t>>>24;INV_SUB_MIX_3[sx]=t;// Compute next counter
                if(!x){x=xi=1;}else {x=x2^d[d[d[x8^x2]]];xi^=d[d[xi]];}}})();// Precomputed Rcon lookup
        var RCON=[0x00,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36];/**
         * AES block cipher algorithm.
         */var AES=C_algo.AES=BlockCipher.extend({_doReset:function _doReset(){var t;// Skip reset of nRounds has been set before and key did not change
                if(this._nRounds&&this._keyPriorReset===this._key){return;}// Shortcuts
                var key=this._keyPriorReset=this._key;var keyWords=key.words;var keySize=key.sigBytes/4;// Compute number of rounds
                var nRounds=this._nRounds=keySize+6;// Compute number of key schedule rows
                var ksRows=(nRounds+1)*4;// Compute key schedule
                var keySchedule=this._keySchedule=[];for(var ksRow=0;ksRow<ksRows;ksRow++){if(ksRow<keySize){keySchedule[ksRow]=keyWords[ksRow];}else {t=keySchedule[ksRow-1];if(!(ksRow%keySize)){// Rot word
                    t=t<<8|t>>>24;// Sub word
                    t=SBOX[t>>>24]<<24|SBOX[t>>>16&0xff]<<16|SBOX[t>>>8&0xff]<<8|SBOX[t&0xff];// Mix Rcon
                    t^=RCON[ksRow/keySize|0]<<24;}else if(keySize>6&&ksRow%keySize==4){// Sub word
                    t=SBOX[t>>>24]<<24|SBOX[t>>>16&0xff]<<16|SBOX[t>>>8&0xff]<<8|SBOX[t&0xff];}keySchedule[ksRow]=keySchedule[ksRow-keySize]^t;}}// Compute inv key schedule
                var invKeySchedule=this._invKeySchedule=[];for(var invKsRow=0;invKsRow<ksRows;invKsRow++){var ksRow=ksRows-invKsRow;if(invKsRow%4){var t=keySchedule[ksRow];}else {var t=keySchedule[ksRow-4];}if(invKsRow<4||ksRow<=4){invKeySchedule[invKsRow]=t;}else {invKeySchedule[invKsRow]=INV_SUB_MIX_0[SBOX[t>>>24]]^INV_SUB_MIX_1[SBOX[t>>>16&0xff]]^INV_SUB_MIX_2[SBOX[t>>>8&0xff]]^INV_SUB_MIX_3[SBOX[t&0xff]];}}},encryptBlock:function encryptBlock(M,offset){this._doCryptBlock(M,offset,this._keySchedule,SUB_MIX_0,SUB_MIX_1,SUB_MIX_2,SUB_MIX_3,SBOX);},decryptBlock:function decryptBlock(M,offset){// Swap 2nd and 4th rows
                var t=M[offset+1];M[offset+1]=M[offset+3];M[offset+3]=t;this._doCryptBlock(M,offset,this._invKeySchedule,INV_SUB_MIX_0,INV_SUB_MIX_1,INV_SUB_MIX_2,INV_SUB_MIX_3,INV_SBOX);// Inv swap 2nd and 4th rows
                var t=M[offset+1];M[offset+1]=M[offset+3];M[offset+3]=t;},_doCryptBlock:function _doCryptBlock(M,offset,keySchedule,SUB_MIX_0,SUB_MIX_1,SUB_MIX_2,SUB_MIX_3,SBOX){// Shortcut
                var nRounds=this._nRounds;// Get input, add round key
                var s0=M[offset]^keySchedule[0];var s1=M[offset+1]^keySchedule[1];var s2=M[offset+2]^keySchedule[2];var s3=M[offset+3]^keySchedule[3];// Key schedule row counter
                var ksRow=4;// Rounds
                for(var round=1;round<nRounds;round++){// Shift rows, sub bytes, mix columns, add round key
                    var t0=SUB_MIX_0[s0>>>24]^SUB_MIX_1[s1>>>16&0xff]^SUB_MIX_2[s2>>>8&0xff]^SUB_MIX_3[s3&0xff]^keySchedule[ksRow++];var t1=SUB_MIX_0[s1>>>24]^SUB_MIX_1[s2>>>16&0xff]^SUB_MIX_2[s3>>>8&0xff]^SUB_MIX_3[s0&0xff]^keySchedule[ksRow++];var t2=SUB_MIX_0[s2>>>24]^SUB_MIX_1[s3>>>16&0xff]^SUB_MIX_2[s0>>>8&0xff]^SUB_MIX_3[s1&0xff]^keySchedule[ksRow++];var t3=SUB_MIX_0[s3>>>24]^SUB_MIX_1[s0>>>16&0xff]^SUB_MIX_2[s1>>>8&0xff]^SUB_MIX_3[s2&0xff]^keySchedule[ksRow++];// Update state
                    s0=t0;s1=t1;s2=t2;s3=t3;}// Shift rows, sub bytes, add round key
                var t0=(SBOX[s0>>>24]<<24|SBOX[s1>>>16&0xff]<<16|SBOX[s2>>>8&0xff]<<8|SBOX[s3&0xff])^keySchedule[ksRow++];var t1=(SBOX[s1>>>24]<<24|SBOX[s2>>>16&0xff]<<16|SBOX[s3>>>8&0xff]<<8|SBOX[s0&0xff])^keySchedule[ksRow++];var t2=(SBOX[s2>>>24]<<24|SBOX[s3>>>16&0xff]<<16|SBOX[s0>>>8&0xff]<<8|SBOX[s1&0xff])^keySchedule[ksRow++];var t3=(SBOX[s3>>>24]<<24|SBOX[s0>>>16&0xff]<<16|SBOX[s1>>>8&0xff]<<8|SBOX[s2&0xff])^keySchedule[ksRow++];// Set output
                M[offset]=t0;M[offset+1]=t1;M[offset+2]=t2;M[offset+3]=t3;},keySize:256/32});/**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
         */C.AES=BlockCipher._createHelper(AES);})();return CryptoJS.AES;});})(aes);var aesExports=aes.exports;var AES = /*@__PURE__*/getDefaultExportFromCjs(aesExports);

    var encUtf8 = {exports: {}};

    (function(module,exports){(function(root,factory){{// CommonJS
        module.exports=factory(requireCore());}})(commonjsGlobal,function(CryptoJS){return CryptoJS.enc.Utf8;});})(encUtf8);var encUtf8Exports=encUtf8.exports;var Utf8 = /*@__PURE__*/getDefaultExportFromCjs(encUtf8Exports);

    var ENCRYPTION_PREFIX_V1='RudderEncrypt:';var ENCRYPTION_KEY_V1='Rudder';

    var encrypt=function encrypt(value){return "".concat(ENCRYPTION_PREFIX_V1).concat(AES.encrypt(value,ENCRYPTION_KEY_V1).toString());};var decrypt=function decrypt(value){if(value.startsWith(ENCRYPTION_PREFIX_V1)){return AES.decrypt(value.substring(ENCRYPTION_PREFIX_V1.length),ENCRYPTION_KEY_V1).toString(Utf8);}return value;};

    var pluginName$2='StorageEncryptionLegacy';var StorageEncryptionLegacy=function StorageEncryptionLegacy(){return {name:pluginName$2,initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$2]);},storage:{encrypt:function encrypt$1(value){return encrypt(value);},decrypt:function decrypt$1(value){return decrypt(value);}}};};

    var STORAGE_MIGRATOR_PLUGIN='StorageMigratorPlugin';

    var pluginName$1='StorageMigrator';var StorageMigrator=function StorageMigrator(){return {name:pluginName$1,initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$1]);},storage:{migrate:function migrate(key,storageEngine,errorHandler,logger){try{var storedVal=storageEngine.getItem(key);if(isNullOrUndefined(storedVal)){return null;}var decryptedVal=decrypt(storedVal);// The value is not encrypted using legacy encryption
// Try latest
                if(decryptedVal===storedVal){decryptedVal=decrypt$1(storedVal);}if(isNullOrUndefined(decryptedVal)){return null;}// storejs that is used in localstorage engine already deserializes json strings but swallows errors
                return JSON.parse(decryptedVal);}catch(err){errorHandler===null||errorHandler===void 0?void 0:errorHandler.onError(err,STORAGE_MIGRATOR_PLUGIN,STORAGE_MIGRATION_ERROR(key));return null;}}}};};

    var isErrRetryable=function isErrRetryable(details){var isRetryableNWFailure=false;if(details!==null&&details!==void 0&&details.error&&details!==null&&details!==void 0&&details.xhr){var xhrStatus=details.xhr.status;// same as in v1.1
        isRetryableNWFailure=xhrStatus===429||xhrStatus>=500&&xhrStatus<600;}return isRetryableNWFailure;};

    var DEFAULT_RETRY_QUEUE_OPTIONS={maxRetryDelay:360000,minRetryDelay:1000,backoffFactor:2,maxAttempts:10,maxItems:100};var REQUEST_TIMEOUT_MS=10*1000;// 10 seconds
    var DATA_PLANE_API_VERSION='v1';var QUEUE_NAME='rudder';var XHR_QUEUE_PLUGIN='XhrQueuePlugin';

    var getNormalizedQueueOptions=function getNormalizedQueueOptions(queueOpts){return mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS,queueOpts);};var getDeliveryUrl=function getDeliveryUrl(dataplaneUrl,eventType){var dpUrl=new URL(dataplaneUrl);return new URL(removeDuplicateSlashes([dpUrl.pathname,'/',DATA_PLANE_API_VERSION,'/',eventType].join('')),dpUrl).href;};var logErrorOnFailure=function logErrorOnFailure(details,item,willBeRetried,attemptNumber,maxRetryAttempts,logger){if(isUndefined(details===null||details===void 0?void 0:details.error)||isUndefined(logger)){return;}var isRetryableFailure=isErrRetryable(details);var errMsg=EVENT_DELIVERY_FAILURE_ERROR_PREFIX(XHR_QUEUE_PLUGIN,item.url);var eventDropMsg="The event will be dropped.";if(isRetryableFailure){if(willBeRetried){errMsg="".concat(errMsg," It'll be retried.");if(attemptNumber>0){errMsg="".concat(errMsg," Retry attempt ").concat(attemptNumber," of ").concat(maxRetryAttempts,".");}}else {errMsg="".concat(errMsg," Retries exhausted (").concat(maxRetryAttempts,"). ").concat(eventDropMsg);}}else {errMsg="".concat(errMsg," ").concat(eventDropMsg);}logger===null||logger===void 0?void 0:logger.error(errMsg);};

    var pluginName='XhrQueue';var XhrQueue=function XhrQueue(){return {name:pluginName,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName]);},dataplaneEventsQueue:{/**
             * Initialize the queue for delivery
             * @param state Application state
             * @param httpClient http client instance
             * @param storeManager Store Manager instance
             * @param errorHandler Error handler instance
             * @param logger Logger instance
             * @returns RetryQueue instance
             */init:function init(state,httpClient,storeManager,errorHandler,logger){var writeKey=state.lifecycle.writeKey.value;httpClient.setAuthHeader(writeKey);var finalQOpts=getNormalizedQueueOptions(state.loadOptions.value.queueOptions);var eventsQueue=new RetryQueue(// adding write key to the queue name to avoid conflicts
              "".concat(QUEUE_NAME,"_").concat(writeKey),finalQOpts,function(item,done,attemptNumber,maxRetryAttempts,willBeRetried){var url=item.url,event=item.event,headers=item.headers;var finalEvent=getFinalEventForDeliveryMutator(event,state);var data=getDeliveryPayload$1(finalEvent);if(data){httpClient.getAsyncData({url:url,options:{method:'POST',headers:headers,data:data,sendRawData:true},isRawResponse:true,timeout:REQUEST_TIMEOUT_MS,callback:function callback(result,details){// null means item will not be requeued
                      var queueErrResp=isErrRetryable(details)?details:null;logErrorOnFailure(details,item,willBeRetried,attemptNumber,maxRetryAttempts,logger);done(queueErrResp,result);}});}else {logger===null||logger===void 0?void 0:logger.error(EVENT_PAYLOAD_PREPARATION_ERROR(XHR_QUEUE_PLUGIN));// Mark the item as done so that it can be removed from the queue
                  done(null);}},storeManager);return eventsQueue;},/**
             * Add event to the queue for delivery
             * @param state Application state
             * @param eventsQueue RetryQueue instance
             * @param event RudderEvent object
             * @param errorHandler Error handler instance
             * @param logger Logger instance
             * @returns none
             */enqueue:function enqueue(state,eventsQueue,event,errorHandler,logger){// sentAt is only added here for the validation step
// It'll be updated to the latest timestamp during actual delivery
                event.sentAt=getCurrentTimeFormatted();validateEventPayloadSize(event,logger);var dataplaneUrl=state.lifecycle.activeDataplaneUrl.value;var url=getDeliveryUrl(dataplaneUrl,event.type);// Other default headers are added by the HttpClient
// Auth header is added during initialization
                var headers={// TODO: why do we need this header value?
                    AnonymousId:toBase64(event.anonymousId)};eventsQueue.addItem({url:url,headers:headers,event:event});}}};};

// eslint-disable-next-line import/no-extraneous-dependencies
    /**
     * Map plugin names to direct code imports from plugins package
     */var legacyBuildPluginImports=function legacyBuildPluginImports(){return {Bugsnag:Bugsnag,BeaconQueue:BeaconQueue,DeviceModeTransformation:DeviceModeTransformation,DeviceModeDestinations:DeviceModeDestinations,ErrorReporting:ErrorReporting,ExternalAnonymousId:ExternalAnonymousId,GoogleLinker:GoogleLinker,NativeDestinationQueue:NativeDestinationQueue,StorageEncryption:StorageEncryption,StorageEncryptionLegacy:StorageEncryptionLegacy,StorageMigrator:StorageMigrator,XhrQueue:XhrQueue,OneTrustConsentManager:OneTrustConsentManager,KetchConsentManager:KetchConsentManager};};

    /**
     * Map of mandatory plugin names and direct imports
     */var getMandatoryPluginsMap=function getMandatoryPluginsMap(){return {};};/**
     * Map of optional plugin names and direct imports for legacy builds
     */var getOptionalPluginsMap=function getOptionalPluginsMap(){return _objectSpread2({},(legacyBuildPluginImports===null||legacyBuildPluginImports===void 0?void 0:legacyBuildPluginImports())||{});};/**
     * Map of optional plugin names and dynamic imports for modern builds
     */var getRemotePluginsMap=function getRemotePluginsMap(activePluginNames){{return {};}};var pluginsInventory=_objectSpread2(_objectSpread2({},getMandatoryPluginsMap()),getOptionalPluginsMap());var remotePluginsInventory=function remotePluginsInventory(activePluginNames){return _objectSpread2({},getRemotePluginsMap());};

// TODO: add retry mechanism for getting remote plugins
// TODO: add timeout error mechanism for marking remote plugins that failed to load as failed in state
    var PluginsManager=/*#__PURE__*/function(){function PluginsManager(engine,errorHandler,logger){_classCallCheck(this,PluginsManager);this.engine=engine;this.errorHandler=errorHandler;this.logger=logger;this.onError=this.onError.bind(this);}/**
     * Orchestrate the plugin loading and registering
     */_createClass(PluginsManager,[{key:"init",value:function init(){state.lifecycle.status.value=LifecycleStatus.PluginsLoading;// Expose pluginsCDNPath to global object, so it can be used in the promise that determines
            this.setActivePlugins();this.registerLocalPlugins();this.registerRemotePlugins();this.attachEffects();}/**
         * Update state based on plugin loaded status
         */ // eslint-disable-next-line class-methods-use-this
    },{key:"attachEffects",value:function attachEffects(){b(function(){var isAllPluginsReady=state.plugins.activePlugins.value.length===0||state.plugins.loadedPlugins.value.length+state.plugins.failedPlugins.value.length===state.plugins.totalPluginsToLoad.value;if(isAllPluginsReady){o(function(){state.plugins.ready.value=true;// TODO: decide what to do if a plugin fails to load for any reason.
//  Should we stop here or should we progress?
            state.lifecycle.status.value=LifecycleStatus.PluginsReady;});}});}/**
         * Determine the list of plugins that should be loaded based on sourceConfig & load options
         */ // eslint-disable-next-line class-methods-use-this
    },{key:"getPluginsToLoadBasedOnConfig",value:function getPluginsToLoadBasedOnConfig(){var _state$nativeDestinat;// This contains the default plugins if load option has been omitted by user
            var pluginsToLoadFromConfig=state.plugins.pluginsToLoadFromConfig.value;if(!pluginsToLoadFromConfig){return [];}// Error reporting related plugins
            var supportedErrReportingProviderPluginNames=Object.values(ErrorReportingProvidersToPluginNameMap);if(state.reporting.errorReportingProviderPluginName.value){pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return !(pluginName!==state.reporting.errorReportingProviderPluginName.value&&supportedErrReportingProviderPluginNames.includes(pluginName));});}else {pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return !(pluginName===PluginName.ErrorReporting||supportedErrReportingProviderPluginNames.includes(pluginName));});}// dataplane events delivery plugins
            if(state.loadOptions.value.useBeacon===true&&state.capabilities.isBeaconAvailable.value){pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return pluginName!==PluginName.XhrQueue;});}else {if(state.loadOptions.value.useBeacon===true){var _this$logger;(_this$logger=this.logger)===null||_this$logger===void 0?void 0:_this$logger.warn(UNSUPPORTED_BEACON_API_WARNING(PLUGINS_MANAGER));}pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return pluginName!==PluginName.BeaconQueue;});}// Device mode destinations related plugins
            if(getNonCloudDestinations((_state$nativeDestinat=state.nativeDestinations.configuredDestinations.value)!==null&&_state$nativeDestinat!==void 0?_state$nativeDestinat:[]).length===0){pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return ![PluginName.DeviceModeDestinations,PluginName.DeviceModeTransformation,PluginName.NativeDestinationQueue].includes(pluginName);});}// Consent Management related plugins
            var supportedConsentManagerPlugins=Object.values(ConsentManagersToPluginNameMap);pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return !(pluginName!==state.consents.activeConsentManagerPluginName.value&&supportedConsentManagerPlugins.includes(pluginName));});// Storage encryption related plugins
            var supportedStorageEncryptionPlugins=Object.values(StorageEncryptionVersionsToPluginNameMap);pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return !(pluginName!==state.storage.encryptionPluginName.value&&supportedStorageEncryptionPlugins.includes(pluginName));});// Storage migrator related plugins
            if(!state.storage.migrate.value){pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return pluginName!==PluginName.StorageMigrator;});}return [].concat(_toConsumableArray(Object.keys(getMandatoryPluginsMap())),_toConsumableArray(pluginsToLoadFromConfig));}/**
         * Determine the list of plugins that should be activated
         */},{key:"setActivePlugins",value:function setActivePlugins(){var pluginsToLoad=this.getPluginsToLoadBasedOnConfig();// Merging available mandatory and optional plugin name list
            var availablePlugins=[].concat(_toConsumableArray(Object.keys(pluginsInventory)),_toConsumableArray(remotePluginNames));var activePlugins=[];var failedPlugins=[];pluginsToLoad.forEach(function(pluginName){if(availablePlugins.includes(pluginName)){activePlugins.push(pluginName);}else {failedPlugins.push(pluginName);}});if(failedPlugins.length>0){this.onError(new Error("Ignoring loading of unknown plugins: ".concat(failedPlugins.join(','),". Mandatory plugins: ").concat(Object.keys(getMandatoryPluginsMap()).join(','),". Load option plugins: ").concat(state.plugins.pluginsToLoadFromConfig.value.join(','))));}o(function(){state.plugins.totalPluginsToLoad.value=pluginsToLoad.length;state.plugins.activePlugins.value=activePlugins;state.plugins.failedPlugins.value=failedPlugins;});}/**
         * Register plugins that are direct imports to PluginEngine
         */},{key:"registerLocalPlugins",value:function registerLocalPlugins(){var _this=this;Object.values(pluginsInventory).forEach(function(localPlugin){if(state.plugins.activePlugins.value.includes(localPlugin().name)){_this.register([localPlugin()]);}});}/**
         * Register plugins that are dynamic imports to PluginEngine
         */},{key:"registerRemotePlugins",value:function registerRemotePlugins(){var _this2=this;var remotePluginsList=remotePluginsInventory(state.plugins.activePlugins.value);Promise.all(Object.keys(remotePluginsList).map(/*#__PURE__*/function(){var _ref=_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(remotePluginKey){return _regeneratorRuntime().wrap(function _callee$(_context){while(1)switch(_context.prev=_context.next){case 0:_context.next=2;return remotePluginsList[remotePluginKey]().then(function(remotePluginModule){return _this2.register([remotePluginModule.default()]);}).catch(function(err){// TODO: add retry here if dynamic import fails
            state.plugins.failedPlugins.value=[].concat(_toConsumableArray(state.plugins.failedPlugins.value),[remotePluginKey]);_this2.onError(err,remotePluginKey);});case 2:case"end":return _context.stop();}},_callee);}));return function(_x){return _ref.apply(this,arguments);};}())).catch(function(err){_this2.onError(err);});}/**
         * Extension point invoke that allows multiple plugins to be registered to it with error handling
         */},{key:"invokeMultiple",value:function invokeMultiple(extPoint){try{var _this$engine;for(var _len=arguments.length,args=new Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){args[_key-1]=arguments[_key];}return (_this$engine=this.engine).invokeMultiple.apply(_this$engine,[extPoint].concat(args));}catch(e){this.onError(e,extPoint);return [];}}/**
         * Extension point invoke that allows a single plugin to be registered to it with error handling
         */},{key:"invokeSingle",value:function invokeSingle(extPoint){try{var _this$engine2;for(var _len2=arguments.length,args=new Array(_len2>1?_len2-1:0),_key2=1;_key2<_len2;_key2++){args[_key2-1]=arguments[_key2];}return (_this$engine2=this.engine).invokeSingle.apply(_this$engine2,[extPoint].concat(args));}catch(e){this.onError(e,extPoint);return null;}}/**
         * Plugin engine register with error handling
         */},{key:"register",value:function register(plugins){var _this3=this;plugins.forEach(function(plugin){try{_this3.engine.register(plugin,state);}catch(e){state.plugins.failedPlugins.value=[].concat(_toConsumableArray(state.plugins.failedPlugins.value),[plugin.name]);_this3.onError(e);}});}// TODO: Implement reset API instead
    },{key:"unregisterLocalPlugins",value:function unregisterLocalPlugins(){var _this4=this;Object.values(pluginsInventory).forEach(function(localPlugin){try{_this4.engine.unregister(localPlugin().name);}catch(e){_this4.onError(e);}});}/**
         * Handle errors
         */},{key:"onError",value:function onError(error,customMessage){if(this.errorHandler){this.errorHandler.onError(error,PLUGINS_MANAGER,customMessage);}else {throw error;}}}]);return PluginsManager;}();

    /**
     * Utility to parse XHR JSON response
     */var responseTextToJson=function responseTextToJson(responseText,onError){try{return JSON.parse(responseText||'');}catch(err){var error=getMutatedError(err,'Failed to parse response data');if(onError&&isFunction(onError)){onError(error);}else {throw error;}}return undefined;};

    var DEFAULT_XHR_REQUEST_OPTIONS={headers:{Accept:'application/json','Content-Type':'application/json;charset=UTF-8'},method:'GET'};/**
     * Utility to create request configuration based on default options
     */var createXhrRequestOptions=function createXhrRequestOptions(url,options,basicAuthHeader){var requestOptions=mergeDeepRight(DEFAULT_XHR_REQUEST_OPTIONS,options||{});if(basicAuthHeader){requestOptions.headers=mergeDeepRight(requestOptions.headers,{Authorization:basicAuthHeader});}requestOptions.url=url;return requestOptions;};/**
     * Utility implementation of XHR, fetch cannot be used as it requires explicit
     * origin allowed values and not wildcard for CORS requests with credentials and
     * this is not supported by our sourceConfig API
     */var xhrRequest=function xhrRequest(options){var timeout=arguments.length>1&&arguments[1]!==undefined?arguments[1]:DEFAULT_XHR_TIMEOUT_MS;var logger=arguments.length>2?arguments[2]:undefined;return new Promise(function(resolve,reject){var payload;if(options.sendRawData===true){payload=options.data;}else {payload=stringifyWithoutCircular(options.data,false,[],logger);if(isNull(payload)){reject({error:new Error(XHR_PAYLOAD_PREP_ERROR),undefined:undefined,options:options});// return and don't process further if the payload could not be stringified
        return;}}var xhr=new XMLHttpRequest();// eslint-disable-next-line @typescript-eslint/no-unused-vars
        var xhrReject=function xhrReject(e){reject({error:new Error(XHR_DELIVERY_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX,xhr.status,xhr.statusText,options.url)),xhr:xhr,options:options});};var xhrError=function xhrError(e){reject({error:new Error(XHR_REQUEST_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX,e,options.url)),xhr:xhr,options:options});};xhr.ontimeout=xhrError;xhr.onerror=xhrError;xhr.onload=function(){if(xhr.status>=200&&xhr.status<400){resolve({response:xhr.responseText,xhr:xhr,options:options});}else {xhrReject();}};xhr.open(options.method,options.url);// The timeout property may be set only in the time interval between a call to the open method
// and the first call to the send method in legacy browsers
        xhr.timeout=timeout;Object.keys(options.headers).forEach(function(headerName){if(options.headers[headerName]){xhr.setRequestHeader(headerName,options.headers[headerName]);}});try{xhr.send(payload);}catch(err){reject({error:getMutatedError(err,XHR_SEND_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX,options.url)),xhr:xhr,options:options});}});};

    /**
     * Service to handle data communication with APIs
     */var HttpClient=/*#__PURE__*/function(){function HttpClient(errorHandler,logger){_classCallCheck(this,HttpClient);_defineProperty(this,"hasErrorHandler",false);this.errorHandler=errorHandler;this.logger=logger;this.hasErrorHandler=Boolean(this.errorHandler);this.onError=this.onError.bind(this);}/**
     * Implement requests in a blocking way
     */_createClass(HttpClient,[{key:"getData",value:function(){var _getData=_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(config){var url,options,timeout,isRawResponse,data,_error;return _regeneratorRuntime().wrap(function _callee$(_context){while(1)switch(_context.prev=_context.next){case 0:url=config.url,options=config.options,timeout=config.timeout,isRawResponse=config.isRawResponse;_context.prev=1;_context.next=4;return xhrRequest(createXhrRequestOptions(url,options,this.basicAuthHeader),timeout,this.logger);case 4:data=_context.sent;return _context.abrupt("return",{data:isRawResponse?data.response:responseTextToJson(data.response,this.onError),details:data});case 8:_context.prev=8;_context.t0=_context["catch"](1);this.onError((_error=_context.t0.error)!==null&&_error!==void 0?_error:_context.t0);return _context.abrupt("return",{data:undefined,details:_context.t0});case 12:case"end":return _context.stop();}},_callee,this,[[1,8]]);}));function getData(_x){return _getData.apply(this,arguments);}return getData;}()/**
         * Implement requests in a non-blocking way
         */},{key:"getAsyncData",value:function getAsyncData(config){var _this=this;var callback=config.callback,url=config.url,options=config.options,timeout=config.timeout,isRawResponse=config.isRawResponse;var isFireAndForget=!(callback&&isFunction(callback));xhrRequest(createXhrRequestOptions(url,options,this.basicAuthHeader),timeout,this.logger).then(function(data){if(!isFireAndForget){callback(isRawResponse?data.response:responseTextToJson(data.response,_this.onError),data);}}).catch(function(data){var _data$error;_this.onError((_data$error=data.error)!==null&&_data$error!==void 0?_data$error:data);if(!isFireAndForget){callback(undefined,data);}});}/**
         * Handle errors
         */},{key:"onError",value:function onError(error){if(this.hasErrorHandler){var _this$errorHandler;(_this$errorHandler=this.errorHandler)===null||_this$errorHandler===void 0?void 0:_this$errorHandler.onError(error,HTTP_CLIENT);}else {throw error;}}/**
         * Set basic authentication header (eg writekey)
         */},{key:"setAuthHeader",value:function setAuthHeader(value){var noBtoa=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;var authVal=noBtoa?value:toBase64("".concat(value,":"));this.basicAuthHeader="Basic ".concat(authVal);}/**
         * Clear basic authentication header
         */},{key:"resetAuthHeader",value:function resetAuthHeader(){this.basicAuthHeader=undefined;}}]);return HttpClient;}();var defaultHttpClient=new HttpClient(defaultErrorHandler,defaultLogger);

    var STORAGE_TEST_COOKIE='test_rudder_cookie';var STORAGE_TEST_LOCAL_STORAGE='test_rudder_ls';var STORAGE_TEST_SESSION_STORAGE='test_rudder_ss';var STORAGE_TEST_TOP_LEVEL_DOMAIN='__tld__';var CLIENT_DATA_STORE_NAME='clientData';

    var detectAdBlockers=function detectAdBlockers(errorHandler,logger){// Apparently, '?view=ad' is a query param that is blocked by majority of adblockers
// Use source config URL here as it is very unlikely to be blocked by adblockers
// Only the extra query param should make it vulnerable to adblockers
// This will work even if the users proxies it.
// The edge case where this doesn't work is when HEAD method is not allowed by the server (user's)
        var baseUrl=new URL(state.lifecycle.sourceConfigUrl.value);var url="".concat(baseUrl.origin).concat(baseUrl.pathname,"?view=ad");var httpClient=new HttpClient(errorHandler,logger);httpClient.setAuthHeader(state.lifecycle.writeKey.value);httpClient.getAsyncData({url:url,options:{// We actually don't need the response from the request, so we are using HEAD
                method:'HEAD',headers:{'Content-Type':undefined}},isRawResponse:true,callback:function callback(result,details){var _details$xhr;// not ad blocked if the request is successful or it is not internally redirected on the client side
// Often adblockers instead of blocking the request, they redirect it to an internal URL
                state.capabilities.isAdBlocked.value=(details===null||details===void 0?void 0:details.error)!==undefined||(details===null||details===void 0||(_details$xhr=details.xhr)===null||_details$xhr===void 0?void 0:_details$xhr.responseURL)!==url;}});};

    var hasCrypto=function hasCrypto(){return !isNullOrUndefined(globalThis.crypto)&&isFunction(globalThis.crypto.getRandomValues);};var hasUAClientHints=function hasUAClientHints(){return !isNullOrUndefined(globalThis.navigator.userAgentData);};var hasBeacon=function hasBeacon(){return !isNullOrUndefined(globalThis.navigator.sendBeacon)&&isFunction(globalThis.navigator.sendBeacon);};var isIE11=function isIE11(){return Boolean(globalThis.navigator.userAgent.match(/Trident.*rv:11\./));};

    var getUserAgentClientHint=function getUserAgentClientHint(callback){var level=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'none';if(level==='none'){callback(undefined);}if(level==='default'){callback(navigator.userAgentData);}if(level==='full'){var _navigator$userAgentD;(_navigator$userAgentD=navigator.userAgentData)===null||_navigator$userAgentD===void 0?void 0:_navigator$userAgentD.getHighEntropyValues(['architecture','bitness','brands','mobile','model','platform','platformVersion','uaFullVersion','fullVersionList','wow64']).then(function(ua){callback(ua);}).catch(function(){callback();});}};

    var isDatasetAvailable=function isDatasetAvailable(){var testElement=document.createElement('div');testElement.setAttribute('data-a-b','c');return testElement.dataset?testElement.dataset.aB==='c':false;};var legacyJSEngineRequiredPolyfills={URLSearchParams:function URLSearchParams(){return !globalThis.URLSearchParams;},URL:function URL(){return !isFunction(globalThis.URL);},MutationObserver:function(_MutationObserver){function MutationObserver(){return _MutationObserver.apply(this,arguments);}MutationObserver.toString=function(){return _MutationObserver.toString();};return MutationObserver;}(function(){return isUndefined(MutationObserver);}),Promise:function(_Promise){function Promise(){return _Promise.apply(this,arguments);}Promise.toString=function(){return _Promise.toString();};return Promise;}(function(){return isUndefined(Promise);}),'Number.isNaN':function NumberIsNaN(){return !Number.isNaN;},'Number.isInteger':function NumberIsInteger(){return !Number.isInteger;},'Array.from':function ArrayFrom(){return !Array.from;},'Array.prototype.find':function ArrayPrototypeFind(){return !Array.prototype.find;},'Array.prototype.includes':function ArrayPrototypeIncludes(){return !Array.prototype.includes;},'String.prototype.endsWith':function StringPrototypeEndsWith(){return !String.prototype.endsWith;},'String.prototype.startsWith':function StringPrototypeStartsWith(){return !String.prototype.startsWith;},'String.prototype.includes':function StringPrototypeIncludes(){return !String.prototype.includes;},'Object.entries':function ObjectEntries(){return !Object.entries;},'Object.values':function ObjectValues(){return !Object.values;},'Element.prototype.dataset':function ElementPrototypeDataset(){return !isDatasetAvailable();},'String.prototype.replaceAll':function StringPrototypeReplaceAll(){return !String.prototype.replaceAll;},TextEncoder:function(_TextEncoder){function TextEncoder(){return _TextEncoder.apply(this,arguments);}TextEncoder.toString=function(){return _TextEncoder.toString();};return TextEncoder;}(function(){return isUndefined(TextEncoder);}),TextDecoder:function(_TextDecoder){function TextDecoder(){return _TextDecoder.apply(this,arguments);}TextDecoder.toString=function(){return _TextDecoder.toString();};return TextDecoder;}(function(){return isUndefined(TextDecoder);}),'String.fromCodePoint':function StringFromCodePoint(){return !String.fromCodePoint;},requestAnimationFrame:function requestAnimationFrame(){return !isFunction(globalThis.requestAnimationFrame);},cancelAnimationFrame:function cancelAnimationFrame(){return !isFunction(globalThis.cancelAnimationFrame);},CustomEvent:function CustomEvent(){return !isFunction(globalThis.CustomEvent);}};var isLegacyJSEngine=function isLegacyJSEngine(){var requiredCapabilitiesList=Object.keys(legacyJSEngineRequiredPolyfills);var needsPolyfill=false;/* eslint-disable-next-line unicorn/no-for-loop */for(var i=0;i<requiredCapabilitiesList.length;i++){var isCapabilityMissing=legacyJSEngineRequiredPolyfills[requiredCapabilitiesList[i]];if(isCapabilityMissing()){needsPolyfill=true;break;}}return needsPolyfill;};

    var getScreenDetails=function getScreenDetails(){var screenDetails={density:0,width:0,height:0,innerWidth:0,innerHeight:0};screenDetails={width:globalThis.screen.width,height:globalThis.screen.height,density:globalThis.devicePixelRatio,innerWidth:globalThis.innerWidth,innerHeight:globalThis.innerHeight};return screenDetails;};

    var isStorageQuotaExceeded=function isStorageQuotaExceeded(e){var matchingNames=['QuotaExceededError','NS_ERROR_DOM_QUOTA_REACHED'];// [everything except Firefox, Firefox]
        var matchingCodes=[22,1014];// [everything except Firefox, Firefox]
        var isQuotaExceededError=matchingNames.includes(e.name)||matchingCodes.includes(e.code);return e instanceof DOMException&&isQuotaExceededError;};// TODO: also check for SecurityErrors
//  https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#exceptions
    var isStorageAvailable=function isStorageAvailable(){var type=arguments.length>0&&arguments[0]!==undefined?arguments[0]:LOCAL_STORAGE;var storageInstance=arguments.length>1?arguments[1]:undefined;var logger=arguments.length>2?arguments[2]:undefined;var storage;var testData;try{switch(type){case MEMORY_STORAGE:return true;case COOKIE_STORAGE:storage=storageInstance;testData=STORAGE_TEST_COOKIE;break;case LOCAL_STORAGE:storage=storageInstance!==null&&storageInstance!==void 0?storageInstance:globalThis.localStorage;testData=STORAGE_TEST_LOCAL_STORAGE;// was STORAGE_TEST_LOCAL_STORAGE in ours and generateUUID() in segment retry one
        break;case SESSION_STORAGE:storage=storageInstance!==null&&storageInstance!==void 0?storageInstance:globalThis.sessionStorage;testData=STORAGE_TEST_SESSION_STORAGE;break;default:return false;}if(!storage){return false;}storage.setItem(testData,'true');if(storage.getItem(testData)){storage.removeItem(testData);return true;}return false;}catch(err){var msgPrefix=STORAGE_UNAVAILABILITY_ERROR_PREFIX(CAPABILITIES_MANAGER,type);var reason='unavailable';if(isStorageQuotaExceeded(err)){reason='full';}logger===null||logger===void 0?void 0:logger.error("".concat(msgPrefix).concat(reason,"."),err);return false;}};

    /**
     * Encode.
     */var encode=function encode(value){return encodeURIComponent(value);};/**
     * Decode
     */var decode=function decode(value){return decodeURIComponent(value);};/**
     * Parse cookie `str`
     */var parse=function parse(str){var obj={};var pairs=str.split(/\s*;\s*/);var pair;if(!pairs[0]){return obj;}pairs.forEach(function(pairItem){pair=pairItem.split('=');obj[decode(pair[0])]=decode(pair[1]);});return obj;};/**
     * Set cookie `name` to `value`
     */var set=function set(name,value,optionsConfig){var options=_objectSpread2({},optionsConfig)||{};var cookieString="".concat(encode(name),"=").concat(encode(value));if(isNull(value)){options.maxage=-1;}if(options.maxage){options.expires=new Date(+new Date()+options.maxage);}if(options.path){cookieString+="; path=".concat(options.path);}if(options.domain){cookieString+="; domain=".concat(options.domain);}if(options.expires){cookieString+="; expires=".concat(options.expires.toUTCString());}if(options.samesite){cookieString+="; samesite=".concat(options.samesite);}if(options.secure){cookieString+="; secure";}globalThis.document.cookie=cookieString;};/**
     * Return all cookies
     */var all=function all(){var cookieStringValue=globalThis.document.cookie;return parse(cookieStringValue);};/**
     * Get cookie `name`
     */var get=function get(name){return all()[name];};/**
     * Set or get cookie `name` with `value` and `options` object
     */ // eslint-disable-next-line func-names
    var cookie=function cookie(name,value,options){switch(arguments.length){case 3:case 2:return set(name,value,options);case 1:if(name){return get(name);}return all();default:return all();}};

    var legacyGetHostname=function legacyGetHostname(href){var l=document.createElement('a');l.href=href;return l.hostname;};/**
     * Levels returns all levels of the given url
     *
     * The method returns an empty array when the hostname is an ip.
     */var levelsFunc=function levelsFunc(url){var _host$split;// This is called before the polyfills load thus new URL cannot be used
        var host=typeof globalThis.URL!=='function'?legacyGetHostname(url):new URL(url).hostname;var parts=(_host$split=host===null||host===void 0?void 0:host.split('.'))!==null&&_host$split!==void 0?_host$split:[];var last=parts[parts.length-1];var levels=[];// Ip address.
        if(parts.length===4&&last===parseInt(last,10).toString()){return levels;}// Localhost.
        if(parts.length<=1){// Fix to support localhost
            if(parts[0].indexOf('localhost')!==-1){return ['localhost'];}return levels;}// Create levels.
        for(var i=parts.length-2;i>=0;i-=1){levels.push(parts.slice(i).join('.'));}return levels;};/**
     * Get the top domain.
     *
     * The function constructs the levels of domain and attempts to set a global
     * cookie on each one when it succeeds it returns the top level domain.
     *
     * The method returns an empty string when the hostname is an ip.
     */var domain=function domain(url){var levels=levelsFunc(url);// Lookup the real top level one.
// eslint-disable-next-line unicorn/no-for-loop
        for(var i=0;i<levels.length;i+=1){var _domain=levels[i];var cname=STORAGE_TEST_TOP_LEVEL_DOMAIN;var opts={domain:"".concat(_domain.indexOf('localhost')!==-1?'':'.').concat(_domain)};// Set cookie on domain
            cookie(cname,1,opts);// If successful
            if(cookie(cname)){// Remove cookie from domain
                cookie(cname,null,opts);return _domain;}}return '';};

    var getDefaultCookieOptions=function getDefaultCookieOptions(){var topDomain=domain(globalThis.location.href);return {maxage:DEFAULT_COOKIE_MAX_AGE_MS,path:'/',domain:!topDomain||topDomain==='.'?undefined:topDomain,samesite:CookieSameSite.Lax,enabled:true};};var getDefaultLocalStorageOptions=function getDefaultLocalStorageOptions(){return {enabled:true};};var getDefaultInMemoryStorageOptions=function getDefaultInMemoryStorageOptions(){return {enabled:true};};

    /**
     * A storage utility to persist values in cookies via Storage interface
     */var CookieStorage=/*#__PURE__*/function(){function CookieStorage(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var logger=arguments.length>1?arguments[1]:undefined;_classCallCheck(this,CookieStorage);_defineProperty(this,"isSupportAvailable",true);_defineProperty(this,"isEnabled",true);_defineProperty(this,"length",0);if(CookieStorage.globalSingleton){// eslint-disable-next-line no-constructor-return
        return CookieStorage.globalSingleton;}this.options=getDefaultCookieOptions();this.logger=logger;this.configure(options);CookieStorage.globalSingleton=this;}_createClass(CookieStorage,[{key:"configure",value:function configure(options){var _this$options;this.options=mergeDeepRight((_this$options=this.options)!==null&&_this$options!==void 0?_this$options:{},options);this.isSupportAvailable=isStorageAvailable(COOKIE_STORAGE,this,this.logger);this.isEnabled=Boolean(this.options.enabled&&this.isSupportAvailable);return this.options;}},{key:"setItem",value:function setItem(key,value){cookie(key,value,this.options);this.length=Object.keys(cookie()).length;return true;}// eslint-disable-next-line class-methods-use-this
    },{key:"getItem",value:function getItem(key){var value=cookie(key);return isUndefined(value)?null:value;}},{key:"removeItem",value:function removeItem(key){var result=this.setItem(key,null);this.length=Object.keys(cookie()).length;return result;}// eslint-disable-next-line class-methods-use-this
    },{key:"clear",value:function clear(){// Not implemented
// getting a list of all cookie storage keys and remove all values
// sounds risky to do as it will take on all top domain cookies
// better to explicitly clear specific ones if needed
        }// This cannot be implemented for cookies
// eslint-disable-next-line class-methods-use-this
    },{key:"key",value:function key(index){var cookies=cookie();var cookieNames=Object.keys(cookies);return isUndefined(cookieNames[index])?null:cookieNames[index];}}]);return CookieStorage;}();_defineProperty(CookieStorage,"globalSingleton",null);

    /**
     * A storage utility to retain values in memory via Storage interface
     */var InMemoryStorage=/*#__PURE__*/function(){function InMemoryStorage(options,logger){_classCallCheck(this,InMemoryStorage);_defineProperty(this,"isEnabled",true);_defineProperty(this,"length",0);_defineProperty(this,"data",{});this.options=getDefaultInMemoryStorageOptions();this.logger=logger;this.configure(options!==null&&options!==void 0?options:{});}_createClass(InMemoryStorage,[{key:"configure",value:function configure(options){this.options=mergeDeepRight(this.options,options);this.isEnabled=Boolean(this.options.enabled);return this.options;}},{key:"setItem",value:function setItem(key,value){this.data[key]=value;this.length=Object.keys(this.data).length;return value;}},{key:"getItem",value:function getItem(key){if(key in this.data){return this.data[key];}return null;}},{key:"removeItem",value:function removeItem(key){if(key in this.data){delete this.data[key];}this.length=Object.keys(this.data).length;return null;}},{key:"clear",value:function clear(){this.data={};this.length=0;}},{key:"key",value:function key(index){return Object.keys(this.data)[index];}}]);return InMemoryStorage;}();var defaultInMemoryStorage=new InMemoryStorage({},defaultLogger);

    var store$1 = {exports: {}};

    (function(module,exports){(function(global,factory){module.exports=factory();})(commonjsGlobal,function(){function isJSON(obj){obj=JSON.stringify(obj);if(!/^\{[\s\S]*\}$/.test(obj)){return false;}return true;}function stringify(val){return val===undefined||typeof val==="function"?val+'':JSON.stringify(val);}function deserialize(value){if(typeof value!=='string'){return undefined;}try{return JSON.parse(value);}catch(e){return value;}}function isFunction(value){return {}.toString.call(value)==="[object Function]";}function isArray(value){return Object.prototype.toString.call(value)==="[object Array]";}// https://github.com/jaywcjlove/store.js/pull/8
// Error: QuotaExceededError
        function dealIncognito(storage){var _KEY='_Is_Incognit',_VALUE='yes';try{// NOTE: set default storage when not passed in
            if(!storage){storage=window.localStorage;}storage.setItem(_KEY,_VALUE);storage.removeItem(_KEY);}catch(e){var inMemoryStorage={};inMemoryStorage._data={};inMemoryStorage.setItem=function(id,val){return inMemoryStorage._data[id]=String(val);};inMemoryStorage.getItem=function(id){return inMemoryStorage._data.hasOwnProperty(id)?inMemoryStorage._data[id]:undefined;};inMemoryStorage.removeItem=function(id){return delete inMemoryStorage._data[id];};inMemoryStorage.clear=function(){return inMemoryStorage._data={};};storage=inMemoryStorage;}finally{if(storage.getItem(_KEY)===_VALUE)storage.removeItem(_KEY);}return storage;}// deal QuotaExceededError if user use incognito mode in browser
        var storage=dealIncognito();function Store(){if(!(this instanceof Store)){return new Store();}}Store.prototype={set:function set(key,val){if(key&&!isJSON(key)){storage.setItem(key,stringify(val));}else if(isJSON(key)){for(var a in key)this.set(a,key[a]);}return this;},get:function get(key){if(!key){var ret={};this.forEach(function(key,val){return ret[key]=val;});return ret;}if(key.charAt(0)==='?'){return this.has(key.substr(1));}var args=arguments;if(args.length>1){var dt={};for(var i=0,len=args.length;i<len;i++){var value=deserialize(storage.getItem(args[i]));if(this.has(args[i])){dt[args[i]]=value;}}return dt;}return deserialize(storage.getItem(key));},clear:function clear(){storage.clear();return this;},remove:function remove(key){var val=this.get(key);storage.removeItem(key);return val;},has:function has(key){return {}.hasOwnProperty.call(this.get(),key);},keys:function keys(){var d=[];this.forEach(function(k){d.push(k);});return d;},forEach:function forEach(callback){for(var i=0,len=storage.length;i<len;i++){var key=storage.key(i);callback(key,this.get(key));}return this;},search:function search(str){var arr=this.keys(),dt={};for(var i=0,len=arr.length;i<len;i++){if(arr[i].indexOf(str)>-1)dt[arr[i]]=this.get(arr[i]);}return dt;}};var _Store=null;function store(key,data){var argm=arguments;var dt=null;if(!_Store)_Store=Store();if(argm.length===0)return _Store.get();if(argm.length===1){if(typeof key==="string")return _Store.get(key);if(isJSON(key))return _Store.set(key);}if(argm.length===2&&typeof key==="string"){if(!data)return _Store.remove(key);if(data&&typeof data==="string")return _Store.set(key,data);if(data&&isFunction(data)){dt=null;dt=data(key,_Store.get(key));store.set(key,dt);}}if(argm.length===2&&isArray(key)&&isFunction(data)){for(var i=0,len=key.length;i<len;i++){dt=data(key[i],_Store.get(key[i]));store.set(key[i],dt);}}return store;}for(var a in Store.prototype)store[a]=Store.prototype[a];return store;});})(store$1);var storeExports=store$1.exports;var store = /*@__PURE__*/getDefaultExportFromCjs(storeExports);

//  check if the get, set overloads and search methods are used at all
//  if we do, ensure we provide types to support overloads as per storejs docs
//  https://www.npmjs.com/package/storejs
    /**
     * A storage utility to persist values in localstorage via Storage interface
     */var LocalStorage=/*#__PURE__*/function(){function LocalStorage(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var logger=arguments.length>1?arguments[1]:undefined;_classCallCheck(this,LocalStorage);_defineProperty(this,"isSupportAvailable",true);_defineProperty(this,"isEnabled",true);_defineProperty(this,"length",0);this.options=getDefaultLocalStorageOptions();this.logger=logger;this.configure(options);}_createClass(LocalStorage,[{key:"configure",value:function configure(options){this.options=mergeDeepRight(this.options,options);this.isSupportAvailable=isStorageAvailable(LOCAL_STORAGE,this,this.logger);this.isEnabled=Boolean(this.options.enabled&&this.isSupportAvailable);return this.options;}},{key:"setItem",value:function setItem(key,value){store.set(key,value);this.length=store.keys().length;}// eslint-disable-next-line class-methods-use-this
    },{key:"getItem",value:function getItem(key){var value=store.get(key);return isUndefined(value)?null:value;}},{key:"removeItem",value:function removeItem(key){store.remove(key);this.length=store.keys().length;}},{key:"clear",value:function clear(){store.clear();this.length=0;}// eslint-disable-next-line class-methods-use-this
    },{key:"key",value:function key(index){return store.keys()[index];}}]);return LocalStorage;}();var defaultLocalStorage=new LocalStorage({},defaultLogger);

    /**
     * A utility to retrieve the storage singleton instance by type
     */var getStorageEngine=function getStorageEngine(type){switch(type){case LOCAL_STORAGE:return defaultLocalStorage;case SESSION_STORAGE:return globalThis.sessionStorage;case MEMORY_STORAGE:return defaultInMemoryStorage;case COOKIE_STORAGE:return new CookieStorage({},defaultLogger);default:return defaultInMemoryStorage;}};/**
     * Configure cookie storage singleton
     */var configureCookieStorageEngine=function configureCookieStorageEngine(options){new CookieStorage({},defaultLogger).configure(options);};/**
     * Configure local storage singleton
     */var configureLocalStorageEngine=function configureLocalStorageEngine(options){defaultLocalStorage.configure(options);};/**
     * Configure in memory storage singleton
     */var configureInMemoryStorageEngine=function configureInMemoryStorageEngine(options){defaultInMemoryStorage.configure(options);};/**
     * Configure all storage singleton instances
     */var configureStorageEngines=function configureStorageEngines(){var cookieOptions=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var localStorageOptions=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var inMemoryStorageOptions=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};configureCookieStorageEngine(cookieOptions);configureLocalStorageEngine(localStorageOptions);configureInMemoryStorageEngine(inMemoryStorageOptions);};

    /**
     * Store Implementation with dedicated storage
     */var Store=/*#__PURE__*/function(){function Store(config,engine,pluginsManager){var _config$isEncrypted,_config$validKeys,_config$errorHandler,_config$logger;_classCallCheck(this,Store);_defineProperty(this,"hasErrorHandler",false);this.id=config.id;this.name=config.name;this.isEncrypted=(_config$isEncrypted=config.isEncrypted)!==null&&_config$isEncrypted!==void 0?_config$isEncrypted:false;this.validKeys=(_config$validKeys=config.validKeys)!==null&&_config$validKeys!==void 0?_config$validKeys:{};this.engine=engine!==null&&engine!==void 0?engine:getStorageEngine(LOCAL_STORAGE);this.noKeyValidation=Object.keys(this.validKeys).length===0;this.noCompoundKey=config.noCompoundKey;this.originalEngine=this.engine;this.errorHandler=(_config$errorHandler=config.errorHandler)!==null&&_config$errorHandler!==void 0?_config$errorHandler:defaultErrorHandler;this.hasErrorHandler=Boolean(this.errorHandler);this.logger=(_config$logger=config.logger)!==null&&_config$logger!==void 0?_config$logger:defaultLogger;this.pluginsManager=pluginsManager;}/**
     * Ensure the key is valid and with correct format
     */_createClass(Store,[{key:"createValidKey",value:function createValidKey(key){var name=this.name,id=this.id,validKeys=this.validKeys,noKeyValidation=this.noKeyValidation,noCompoundKey=this.noCompoundKey;if(noKeyValidation){return noCompoundKey?key:[name,id,key].join('.');}// validate and return undefined if invalid key
            var compoundKey;Object.values(validKeys).forEach(function(validKeyName){if(validKeyName===key){compoundKey=noCompoundKey?key:[name,id,key].join('.');}});return compoundKey;}/**
         * Switch to inMemoryEngine, bringing any existing data with.
         */},{key:"swapQueueStoreToInMemoryEngine",value:function swapQueueStoreToInMemoryEngine(){var _this=this;var name=this.name,id=this.id,validKeys=this.validKeys,noCompoundKey=this.noCompoundKey;var inMemoryStorage=getStorageEngine(MEMORY_STORAGE);// grab existing data, but only for this page's queue instance, not all
// better to keep other queues in localstorage to be flushed later
// than to pull them into memory and remove them from durable storage
            Object.keys(validKeys).forEach(function(key){var value=_this.get(validKeys[key]);var validKey=noCompoundKey?key:[name,id,key].join('.');inMemoryStorage.setItem(validKey,value);// TODO: are we sure we want to drop clientData
//  if cookies are not available and localstorage is full?
                _this.remove(key);});this.engine=inMemoryStorage;}/**
         * Set value by key.
         */},{key:"set",value:function set(key,value){var validKey=this.createValidKey(key);if(!validKey){return;}try{// storejs that is used in localstorage engine already stringifies json
            this.engine.setItem(validKey,this.encrypt(stringifyWithoutCircular(value,false,[],this.logger)));}catch(err){if(isStorageQuotaExceeded(err)){var _this$logger;(_this$logger=this.logger)===null||_this$logger===void 0?void 0:_this$logger.warn(STORAGE_QUOTA_EXCEEDED_WARNING("Store ".concat(this.id)));// switch to inMemory engine
            this.swapQueueStoreToInMemoryEngine();// and save it there
            this.set(key,value);}else {this.onError(getMutatedError(err,STORE_DATA_SAVE_ERROR(key)));}}}/**
         * Get by Key.
         */},{key:"get",value:function get(key){var validKey=this.createValidKey(key);try{if(!validKey){return null;}var str=this.decrypt(this.engine.getItem(validKey));if(isNullOrUndefined(str)){return null;}// storejs that is used in localstorage engine already deserializes json strings but swallows errors
            return JSON.parse(str);}catch(err){this.onError(new Error("".concat(STORE_DATA_FETCH_ERROR(key),": ").concat(err.message)));return null;}}/**
         * Remove by Key.
         */},{key:"remove",value:function remove(key){var validKey=this.createValidKey(key);if(validKey){this.engine.removeItem(validKey);}}/**
         * Get original engine
         */},{key:"getOriginalEngine",value:function getOriginalEngine(){return this.originalEngine;}/**
         * Decrypt values
         */},{key:"decrypt",value:function decrypt(value){if(isNullOrUndefined(value)){return null;}return this.crypto(value,'decrypt');}/**
         * Encrypt value
         */},{key:"encrypt",value:function encrypt(value){return this.crypto(value,'encrypt');}/**
         * Extension point to use with encryption plugins
         */},{key:"crypto",value:function crypto(value,mode){var noEncryption=!this.isEncrypted||!value||typeof value!=='string'||trim(value)==='';if(noEncryption){return value;}var extensionPointName="storage.".concat(mode);var formattedValue=this.pluginsManager?this.pluginsManager.invokeSingle(extensionPointName,value):value;return typeof formattedValue==='undefined'?value:formattedValue!==null&&formattedValue!==void 0?formattedValue:'';}/**
         * Handle errors
         */},{key:"onError",value:function onError(error){if(this.hasErrorHandler){var _this$errorHandler;(_this$errorHandler=this.errorHandler)===null||_this$errorHandler===void 0?void 0:_this$errorHandler.onError(error,"Store ".concat(this.id));}else {throw error;}}}]);return Store;}();

    /**
     * A service to manage stores & available storage client configurations
     */var StoreManager=/*#__PURE__*/function(){function StoreManager(pluginsManager,errorHandler,logger){_classCallCheck(this,StoreManager);_defineProperty(this,"stores",{});_defineProperty(this,"isInitialized",false);_defineProperty(this,"hasErrorHandler",false);this.errorHandler=errorHandler;this.logger=logger;this.hasErrorHandler=Boolean(this.errorHandler);this.pluginsManager=pluginsManager;this.onError=this.onError.bind(this);}/**
     * Configure available storage client instances
     */_createClass(StoreManager,[{key:"init",value:function init(){if(this.isInitialized){return;}var config={cookieOptions:{samesite:state.loadOptions.value.sameSiteCookie,secure:state.loadOptions.value.secureCookie,domain:state.loadOptions.value.setCookieDomain,enabled:true},localStorageOptions:{enabled:true},inMemoryStorageOptions:{enabled:true}};configureStorageEngines(removeUndefinedValues(config.cookieOptions),removeUndefinedValues(config.localStorageOptions),removeUndefinedValues(config.inMemoryStorageOptions));this.initClientDataStore();this.isInitialized=true;}/**
         * Create store to persist data used by the SDK like session, used details etc
         */},{key:"initClientDataStore",value:function initClientDataStore(){var _getStorageEngine,_getStorageEngine2,_getStorageEngine3;var storageType=state.storage.type.value||COOKIE_STORAGE;var finalStorageType=storageType;switch(storageType){case LOCAL_STORAGE:if(!((_getStorageEngine=getStorageEngine(LOCAL_STORAGE))!==null&&_getStorageEngine!==void 0&&_getStorageEngine.isEnabled)){finalStorageType=MEMORY_STORAGE;}break;case MEMORY_STORAGE:finalStorageType=MEMORY_STORAGE;break;case NO_STORAGE:finalStorageType=NO_STORAGE;break;case COOKIE_STORAGE:default:// First try setting the storage to cookie else to local storage
            if((_getStorageEngine2=getStorageEngine(COOKIE_STORAGE))!==null&&_getStorageEngine2!==void 0&&_getStorageEngine2.isEnabled){finalStorageType=COOKIE_STORAGE;}else if((_getStorageEngine3=getStorageEngine(LOCAL_STORAGE))!==null&&_getStorageEngine3!==void 0&&_getStorageEngine3.isEnabled){finalStorageType=LOCAL_STORAGE;}else {finalStorageType=MEMORY_STORAGE;}break;}if(finalStorageType!==storageType){var _this$logger;(_this$logger=this.logger)===null||_this$logger===void 0?void 0:_this$logger.warn(STORAGE_UNAVAILABLE_WARNING(STORE_MANAGER,storageType,finalStorageType));}// TODO: fill in extra config values and bring them in from StoreManagerOptions if needed
// TODO: should we pass the keys for all in order to validate or leave free as v1.1?
            if(finalStorageType!==NO_STORAGE){this.setStore({id:CLIENT_DATA_STORE_NAME,name:CLIENT_DATA_STORE_NAME,isEncrypted:true,noCompoundKey:true,type:finalStorageType});}}/**
         * Create a new store
         */},{key:"setStore",value:function setStore(storeConfig){var storageEngine=getStorageEngine(storeConfig.type);this.stores[storeConfig.id]=new Store(storeConfig,storageEngine,this.pluginsManager);return this.stores[storeConfig.id];}/**
         * Retrieve a store
         */},{key:"getStore",value:function getStore(id){return this.stores[id];}/**
         * Handle errors
         */},{key:"onError",value:function onError(error){if(this.hasErrorHandler){var _this$errorHandler;(_this$errorHandler=this.errorHandler)===null||_this$errorHandler===void 0?void 0:_this$errorHandler.onError(error,STORE_MANAGER);}else {throw error;}}}]);return StoreManager;}();

    /**
     * Removes trailing slash from url
     * @param url
     * @returns url
     */var removeTrailingSlashes=function removeTrailingSlashes(url){return url&&url.endsWith('/')?removeTrailingSlashes(url.substring(0,url.length-1)):url;};/**
     * Checks if provided url is valid or not
     * @param url
     * @returns true if `url` is valid and false otherwise
     */var isValidUrl=function isValidUrl(url){try{var validUrl=new URL(url);return Boolean(validUrl);}catch(err){return false;}};/**
     * Get the referring domain from the referrer URL
     * @param referrer Page referrer
     * @returns Page referring domain
     */var getReferringDomain=function getReferringDomain(referrer){var referringDomain='';try{var url=new URL(referrer);referringDomain=url.host;}catch(error){// Do nothing
    }return referringDomain;};/**
     * Extracts UTM parameters from the URL
     * @param url Page URL
     * @returns UTM parameters
     */var extractUTMParameters=function extractUTMParameters(url){var result={};try{var urlObj=new URL(url);var UTM_PREFIX='utm_';urlObj.searchParams.forEach(function(value,sParam){if(sParam.startsWith(UTM_PREFIX)){var utmParam=sParam.substring(UTM_PREFIX.length);// Not sure why we're doing this
        if(utmParam==='campaign'){utmParam='name';}result[utmParam]=value;}});}catch(error){// Do nothing
    }return result;};/**
     * To get the URL until the hash
     * @param url The input URL
     * @returns URL until the hash
     */var getUrlWithoutHash=function getUrlWithoutHash(url){var urlWithoutHash=url;try{var urlObj=new URL(url);urlWithoutHash=urlObj.origin+urlObj.pathname+urlObj.search;}catch(error){// Do nothing
    }return urlWithoutHash;};

    var validateWriteKey=function validateWriteKey(writeKey){if(!isString(writeKey)||writeKey.trim().length===0){throw new Error(WRITE_KEY_VALIDATION_ERROR(writeKey));}};var validateDataPlaneUrl=function validateDataPlaneUrl(dataPlaneUrl){if(dataPlaneUrl&&!isValidUrl(dataPlaneUrl)){throw new Error(DATA_PLANE_URL_VALIDATION_ERROR(dataPlaneUrl));}};var validateLoadArgs=function validateLoadArgs(writeKey,dataPlaneUrl){validateWriteKey(writeKey);validateDataPlaneUrl(dataPlaneUrl);};var isValidSourceConfig=function isValidSourceConfig(res){return isObjectLiteralAndNotNull(res)&&isObjectLiteralAndNotNull(res.source)&&!isNullOrUndefined(res.source.id)&&isObjectLiteralAndNotNull(res.source.config)&&Array.isArray(res.source.destinations);};var isValidStorageType=function isValidStorageType(storageType){return typeof storageType==='string'&&SUPPORTED_STORAGE_TYPES.includes(storageType);};

    var defaultOptionalPluginsList=[PluginName.Bugsnag,PluginName.DeviceModeDestinations,PluginName.ErrorReporting,PluginName.ExternalAnonymousId,PluginName.GoogleLinker,PluginName.NativeDestinationQueue,PluginName.StorageEncryption,PluginName.StorageEncryptionLegacy,PluginName.StorageMigrator,PluginName.XhrQueue,PluginName.OneTrustConsentManager,PluginName.KetchConsentManager,PluginName.BeaconQueue];

    /**
     * A function to check given value is a number or not
     * @param num input value
     * @returns boolean
     */var isNumber=function isNumber(num){return typeof num==='number'&&!Number.isNaN(num);};/**
     * A function to check given number has minimum length or not
     * @param minimumLength     minimum length
     * @param num               input number
     * @returns boolean
     */var hasMinLength=function hasMinLength(minimumLength,num){return num.toString().length>=minimumLength;};/**
     * A function to check given value is a positive integer or not
     * @param num input value
     * @returns boolean
     */var isPositiveInteger=function isPositiveInteger(num){return isNumber(num)&&num>=0&&Number.isInteger(num);};

    var normalizeLoadOptions=function normalizeLoadOptions(loadOptionsFromState,loadOptions){var _normalizedLoadOpts$p;// TODO: Maybe add warnings for invalid values
        var normalizedLoadOpts=clone$1(loadOptions);if(!isString(normalizedLoadOpts.setCookieDomain)){delete normalizedLoadOpts.setCookieDomain;}if(!getObjectValues(CookieSameSite).includes(normalizedLoadOpts.sameSiteCookie)){delete normalizedLoadOpts.sameSiteCookie;}normalizedLoadOpts.secureCookie=normalizedLoadOpts.secureCookie===true;if(!getObjectValues(UaChTrackLevel).includes(normalizedLoadOpts.uaChTrackLevel)){delete normalizedLoadOpts.uaChTrackLevel;}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.integrations)){delete normalizedLoadOpts.integrations;}normalizedLoadOpts.plugins=(_normalizedLoadOpts$p=normalizedLoadOpts.plugins)!==null&&_normalizedLoadOpts$p!==void 0?_normalizedLoadOpts$p:defaultOptionalPluginsList;normalizedLoadOpts.useGlobalIntegrationsConfigInEvents=normalizedLoadOpts.useGlobalIntegrationsConfigInEvents===true;normalizedLoadOpts.bufferDataPlaneEventsUntilReady=normalizedLoadOpts.bufferDataPlaneEventsUntilReady===true;normalizedLoadOpts.sendAdblockPage=normalizedLoadOpts.sendAdblockPage===true;if(!isObjectLiteralAndNotNull(normalizedLoadOpts.sendAdblockPageOptions)){delete normalizedLoadOpts.sendAdblockPageOptions;}if(!isDefined(normalizedLoadOpts.loadIntegration)){delete normalizedLoadOpts.loadIntegration;}else {normalizedLoadOpts.loadIntegration=normalizedLoadOpts.loadIntegration===true;}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.storage)){delete normalizedLoadOpts.storage;}else {var _normalizedLoadOpts$s;normalizedLoadOpts.storage=removeUndefinedAndNullValues(normalizedLoadOpts.storage);normalizedLoadOpts.storage.migrate=((_normalizedLoadOpts$s=normalizedLoadOpts.storage)===null||_normalizedLoadOpts$s===void 0?void 0:_normalizedLoadOpts$s.migrate)===true;}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.beaconQueueOptions)){delete normalizedLoadOpts.beaconQueueOptions;}else {normalizedLoadOpts.beaconQueueOptions=removeUndefinedAndNullValues(normalizedLoadOpts.beaconQueueOptions);}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.destinationsQueueOptions)){delete normalizedLoadOpts.destinationsQueueOptions;}else {normalizedLoadOpts.destinationsQueueOptions=removeUndefinedAndNullValues(normalizedLoadOpts.destinationsQueueOptions);}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.queueOptions)){delete normalizedLoadOpts.queueOptions;}else {normalizedLoadOpts.queueOptions=removeUndefinedAndNullValues(normalizedLoadOpts.queueOptions);}normalizedLoadOpts.lockIntegrationsVersion=normalizedLoadOpts.lockIntegrationsVersion===true;if(!isNumber(normalizedLoadOpts.dataPlaneEventsBufferTimeout)){delete normalizedLoadOpts.dataPlaneEventsBufferTimeout;}var mergedLoadOptions=mergeDeepRight(loadOptionsFromState,normalizedLoadOpts);return mergedLoadOptions;};var getSourceConfigURL=function getSourceConfigURL(configUrl,writeKey,lockIntegrationsVersion,logger){var defSearchParams=new URLSearchParams({p:MODULE_TYPE,v:APP_VERSION,build:BUILD_TYPE,writeKey:writeKey,lockIntegrationsVersion:lockIntegrationsVersion.toString()});var origin=DEFAULT_CONFIG_BE_URL;var searchParams=defSearchParams;var pathname='/sourceConfig/';var hash='';try{var configUrlInstance=new URL(configUrl);if(!removeTrailingSlashes(configUrlInstance.pathname).endsWith('/sourceConfig')){configUrlInstance.pathname="".concat(removeTrailingSlashes(configUrlInstance.pathname),"/sourceConfig/");}configUrlInstance.pathname=removeDuplicateSlashes(configUrlInstance.pathname);defSearchParams.forEach(function(value,key){if(configUrlInstance.searchParams.get(key)===null){configUrlInstance.searchParams.set(key,value);}});origin=configUrlInstance.origin;pathname=configUrlInstance.pathname;searchParams=configUrlInstance.searchParams;hash=configUrlInstance.hash;}catch(err){logger===null||logger===void 0?void 0:logger.warn(INVALID_CONFIG_URL_WARNING(CONFIG_MANAGER,configUrl));}return "".concat(origin).concat(pathname,"?").concat(searchParams).concat(hash);};

    /**
     * A function to filter enabled destinations and map to required properties only
     * @param destinations
     *
     * @returns Destination[]
     */var filterEnabledDestination=function filterEnabledDestination(destinations){var nativeDestinations=[];destinations.forEach(function(destination){if(destination.enabled&&!destination.deleted){nativeDestinations.push({id:destination.id,displayName:destination.destinationDefinition.displayName,config:destination.config,shouldApplyDeviceModeTransformation:destination.shouldApplyDeviceModeTransformation||false,propagateEventsUntransformedOnError:destination.propagateEventsUntransformedOnError||false,userFriendlyId:"".concat(destination.destinationDefinition.displayName.replaceAll(' ','-'),"___").concat(destination.id)});}});return nativeDestinations;};

    var DEFAULT_REGION='US';/**
     * A function to get url from source config response
     * @param {array} urls    An array of objects containing urls
     * @returns
     */var getDefaultUrlOfRegion=function getDefaultUrlOfRegion(urls){var url;if(Array.isArray(urls)&&urls.length>0){var obj=urls.find(function(elem){return elem.default===true;});if(obj&&isValidUrl(obj.url)){return obj.url;}}return url;};var validateResidencyServerRegion=function validateResidencyServerRegion(residencyServerRegion,logger){if(residencyServerRegion&&!Object.values(ResidencyServerRegion).includes(residencyServerRegion)){logger===null||logger===void 0?void 0:logger.warn(UNSUPPORTED_RESIDENCY_SERVER_REGION_WARNING(CONFIG_MANAGER,residencyServerRegion,DEFAULT_REGION));return undefined;}return residencyServerRegion;};/**
     * A function to determine the dataPlaneUrl
     * @param {Object} dataplanes An object containing dataPlaneUrl for different region
     * @param {String} serverUrl dataPlaneUrl provided in the load call
     * @param {String} residencyServerRegion User provided residency server region
     * @param {Logger} logger logger instance
     * @returns The data plane URL string to use
     */var resolveDataPlaneUrl=function resolveDataPlaneUrl(dataplanes,serverUrl,residencyServerRegion,logger){// Check if dataPlanes object is present in source config
        if(dataplanes&&Object.keys(dataplanes).length>0){var _validateResidencySer;var region=(_validateResidencySer=validateResidencyServerRegion(residencyServerRegion,logger))!==null&&_validateResidencySer!==void 0?_validateResidencySer:DEFAULT_REGION;var regionUrlArr=dataplanes[region]||dataplanes[DEFAULT_REGION];var defaultUrl=getDefaultUrlOfRegion(regionUrlArr);if(defaultUrl){return defaultUrl;}}// return the dataPlaneUrl provided in load API(if available)
        if(serverUrl){return serverUrl;}// return undefined if data plane url can not be determined
        return undefined;};

    var isErrorReportingEnabled=function isErrorReportingEnabled(sourceConfig){var _sourceConfig$statsCo;return (sourceConfig===null||sourceConfig===void 0||(_sourceConfig$statsCo=sourceConfig.statsCollection)===null||_sourceConfig$statsCo===void 0||(_sourceConfig$statsCo=_sourceConfig$statsCo.errors)===null||_sourceConfig$statsCo===void 0?void 0:_sourceConfig$statsCo.enabled)===true;};var getErrorReportingProviderNameFromConfig=function getErrorReportingProviderNameFromConfig(sourceConfig){var _sourceConfig$statsCo2;return sourceConfig===null||sourceConfig===void 0||(_sourceConfig$statsCo2=sourceConfig.statsCollection)===null||_sourceConfig$statsCo2===void 0||(_sourceConfig$statsCo2=_sourceConfig$statsCo2.errors)===null||_sourceConfig$statsCo2===void 0?void 0:_sourceConfig$statsCo2.provider;};var isMetricsReportingEnabled=function isMetricsReportingEnabled(sourceConfig){var _sourceConfig$statsCo3;return (sourceConfig===null||sourceConfig===void 0||(_sourceConfig$statsCo3=sourceConfig.statsCollection)===null||_sourceConfig$statsCo3===void 0||(_sourceConfig$statsCo3=_sourceConfig$statsCo3.metrics)===null||_sourceConfig$statsCo3===void 0?void 0:_sourceConfig$statsCo3.enabled)===true;};

    /**
     * Determines the SDK url
     * @returns sdkURL
     */var getSDKUrl=function getSDKUrl(){var scripts=document.getElementsByTagName('script');var sdkURL;var scriptList=Array.prototype.slice.call(scripts);scriptList.some(function(script){var curScriptSrc=removeTrailingSlashes(script.getAttribute('src'));if(curScriptSrc){var urlMatches=curScriptSrc.match(/^.*rsa?(\.min)?\.js$/);if(urlMatches){sdkURL=curScriptSrc;return true;}}return false;});// TODO: Return the URL object instead of the plain URL string
        return sdkURL;};/**
     * Updates the reporting state variables from the source config data
     * @param res Source config
     * @param logger Logger instance
     */var updateReportingState=function updateReportingState(res,logger){state.reporting.isErrorReportingEnabled.value=isErrorReportingEnabled(res.source.config);state.reporting.isMetricsReportingEnabled.value=isMetricsReportingEnabled(res.source.config);if(state.reporting.isErrorReportingEnabled.value){var errReportingProvider=getErrorReportingProviderNameFromConfig(res.source.config);// Get the corresponding plugin name of the selected error reporting provider from the supported error reporting providers
        var errReportingProviderPlugin=errReportingProvider?ErrorReportingProvidersToPluginNameMap[errReportingProvider]:undefined;if(!isUndefined(errReportingProvider)&&!errReportingProviderPlugin){// set the default error reporting provider
            logger===null||logger===void 0?void 0:logger.warn(UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING(CONFIG_MANAGER,errReportingProvider,ErrorReportingProvidersToPluginNameMap,DEFAULT_ERROR_REPORTING_PROVIDER));}state.reporting.errorReportingProviderPluginName.value=errReportingProviderPlugin!==null&&errReportingProviderPlugin!==void 0?errReportingProviderPlugin:ErrorReportingProvidersToPluginNameMap[DEFAULT_ERROR_REPORTING_PROVIDER];}};var updateStorageState=function updateStorageState(logger){var _state$loadOptions$va;var storageEncryptionVersion=(_state$loadOptions$va=state.loadOptions.value.storage)===null||_state$loadOptions$va===void 0||(_state$loadOptions$va=_state$loadOptions$va.encryption)===null||_state$loadOptions$va===void 0?void 0:_state$loadOptions$va.version;var encryptionPluginName=storageEncryptionVersion&&StorageEncryptionVersionsToPluginNameMap[storageEncryptionVersion];if(!isUndefined(storageEncryptionVersion)&&isUndefined(encryptionPluginName)){// set the default encryption plugin
        logger===null||logger===void 0?void 0:logger.warn(UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING(CONFIG_MANAGER,storageEncryptionVersion,StorageEncryptionVersionsToPluginNameMap,DEFAULT_STORAGE_ENCRYPTION_VERSION));storageEncryptionVersion=DEFAULT_STORAGE_ENCRYPTION_VERSION;}else if(isUndefined(storageEncryptionVersion)){storageEncryptionVersion=DEFAULT_STORAGE_ENCRYPTION_VERSION;}o(function(){var _state$loadOptions$va2;state.storage.encryptionPluginName.value=StorageEncryptionVersionsToPluginNameMap[storageEncryptionVersion];// Allow migration only if the configured encryption version is the default encryption version
        var configuredMigrationValue=(_state$loadOptions$va2=state.loadOptions.value.storage)===null||_state$loadOptions$va2===void 0?void 0:_state$loadOptions$va2.migrate;state.storage.migrate.value=configuredMigrationValue&&storageEncryptionVersion===DEFAULT_STORAGE_ENCRYPTION_VERSION;if(configuredMigrationValue===true&&state.storage.migrate.value!==configuredMigrationValue){logger===null||logger===void 0?void 0:logger.warn(STORAGE_DATA_MIGRATION_OVERRIDE_WARNING(CONFIG_MANAGER,storageEncryptionVersion,DEFAULT_STORAGE_ENCRYPTION_VERSION));}});};

    /**
     * A function that determines integration SDK loading path
     * @param requiredVersion
     * @param lockIntegrationsVersion
     * @param customIntegrationsCDNPath
     * @returns
     */var getIntegrationsCDNPath=function getIntegrationsCDNPath(requiredVersion,lockIntegrationsVersion,customIntegrationsCDNPath){var integrationsCDNPath='';// Get the CDN base URL from the user provided URL if any
        if(customIntegrationsCDNPath){integrationsCDNPath=removeTrailingSlashes(customIntegrationsCDNPath);if(!integrationsCDNPath||integrationsCDNPath&&!isValidUrl(integrationsCDNPath)){throw new Error(INTG_CDN_BASE_URL_ERROR);}return integrationsCDNPath;}// Get the base path from the SDK script tag src attribute or use the default path
        var sdkURL=getSDKUrl();integrationsCDNPath=sdkURL&&isString(sdkURL)?sdkURL.split('/').slice(0,-1).concat(CDN_INT_DIR).join('/'):DEST_SDK_BASE_URL;// If version is not locked it will always get the latest version of the integrations
        if(lockIntegrationsVersion){integrationsCDNPath=integrationsCDNPath.replace(CDN_ARCH_VERSION_DIR,requiredVersion);}return integrationsCDNPath;};/**
     * A function that determines plugins SDK loading path
     * @param customPluginsCDNPath
     * @returns
     */var getPluginsCDNPath=function getPluginsCDNPath(customPluginsCDNPath){var pluginsCDNPath='';// Get the CDN base URL from the user provided URL if any
        if(customPluginsCDNPath){pluginsCDNPath=removeTrailingSlashes(customPluginsCDNPath);if(!pluginsCDNPath||pluginsCDNPath&&!isValidUrl(pluginsCDNPath)){throw new Error(PLUGINS_CDN_BASE_URL_ERROR);}return pluginsCDNPath;}// Get the base path from the SDK script tag src attribute or use the default path
        var sdkURL=getSDKUrl();pluginsCDNPath=sdkURL&&isString(sdkURL)?sdkURL.split('/').slice(0,-1).concat(CDN_PLUGINS_DIR).join('/'):PLUGINS_BASE_URL;return pluginsCDNPath;};

    /**
     * A function to get the name of the consent manager with enabled true set in the load options
     * @param cookieConsentOptions Input provided as load option
     * @returns string|undefined
     *
     * Example input: {
     *   oneTrust:{
     *     enabled: true
     *   }
     * }
     *
     * Output: 'oneTrust'
     */var getUserSelectedConsentManager=function getUserSelectedConsentManager(cookieConsentOptions){if(!isNonEmptyObject(cookieConsentOptions)){return undefined;}var validCookieConsentOptions=cookieConsentOptions;return Object.keys(validCookieConsentOptions).find(function(e){return e&&validCookieConsentOptions[e].enabled===true;});};

    var ConfigManager=/*#__PURE__*/function(){function ConfigManager(httpClient,errorHandler,logger){_classCallCheck(this,ConfigManager);_defineProperty(this,"hasErrorHandler",false);this.errorHandler=errorHandler;this.logger=logger;this.httpClient=httpClient;this.hasErrorHandler=Boolean(this.errorHandler);this.onError=this.onError.bind(this);this.processConfig=this.processConfig.bind(this);}_createClass(ConfigManager,[{key:"attachEffects",value:function attachEffects(){var _this=this;b(function(){var _this$logger;(_this$logger=_this.logger)===null||_this$logger===void 0?void 0:_this$logger.setMinLogLevel(state.lifecycle.logLevel.value);});}/**
         * A function to validate, construct and store loadOption, lifecycle, source and destination
         * config related information in global state
         */},{key:"init",value:function init(){var _this2=this;var consentManagerPluginName;this.attachEffects();var lockIntegrationsVersion=state.loadOptions.value.lockIntegrationsVersion;validateLoadArgs(state.lifecycle.writeKey.value,state.lifecycle.dataPlaneUrl.value);// determine the path to fetch integration SDK from
            var intgCdnUrl=getIntegrationsCDNPath(APP_VERSION,lockIntegrationsVersion,state.loadOptions.value.destSDKBaseURL);// determine the path to fetch remote plugins from
            var pluginsCDNPath=getPluginsCDNPath(state.loadOptions.value.pluginsSDKBaseURL);// Get the consent manager if provided as load option
            var selectedConsentManager=getUserSelectedConsentManager(state.loadOptions.value.cookieConsentManager);if(selectedConsentManager){// Get the corresponding plugin name of the selected consent manager from the supported consent managers
                consentManagerPluginName=ConsentManagersToPluginNameMap[selectedConsentManager];if(!consentManagerPluginName){var _this$logger2;(_this$logger2=this.logger)===null||_this$logger2===void 0?void 0:_this$logger2.error(UNSUPPORTED_CONSENT_MANAGER_ERROR(CONFIG_MANAGER,selectedConsentManager,ConsentManagersToPluginNameMap));}}updateStorageState(this.logger);// set application lifecycle state in global state
            o(function(){var _state$loadOptions$va;state.lifecycle.integrationsCDNPath.value=intgCdnUrl;state.lifecycle.pluginsCDNPath.value=pluginsCDNPath;if(state.loadOptions.value.logLevel){state.lifecycle.logLevel.value=state.loadOptions.value.logLevel;}if(state.loadOptions.value.configUrl){state.lifecycle.sourceConfigUrl.value=getSourceConfigURL(state.loadOptions.value.configUrl,state.lifecycle.writeKey.value,lockIntegrationsVersion,_this2.logger);}// Set consent manager plugin name in state
                state.consents.activeConsentManagerPluginName.value=consentManagerPluginName;// set storage type in state
                var storageType=(_state$loadOptions$va=state.loadOptions.value.storage)===null||_state$loadOptions$va===void 0?void 0:_state$loadOptions$va.type;if(!isValidStorageType(storageType)){var _this2$logger;(_this2$logger=_this2.logger)===null||_this2$logger===void 0?void 0:_this2$logger.warn(STORAGE_TYPE_VALIDATION_WARNING(CONFIG_MANAGER,storageType,DEFAULT_STORAGE_TYPE));state.storage.type.value=DEFAULT_STORAGE_TYPE;}else {state.storage.type.value=storageType;}});this.getConfig();}/**
         * Handle errors
         */},{key:"onError",value:function onError(error,customMessage,shouldAlwaysThrow){if(this.hasErrorHandler){var _this$errorHandler;(_this$errorHandler=this.errorHandler)===null||_this$errorHandler===void 0?void 0:_this$errorHandler.onError(error,CONFIG_MANAGER,customMessage,shouldAlwaysThrow);}else {throw error;}}/**
         * A callback function that is executed once we fetch the source config response.
         * Use to construct and store information that are dependent on the sourceConfig.
         */},{key:"processConfig",value:function processConfig(response,details){var _this3=this;// TODO: add retry logic with backoff based on rejectionDetails.xhr.status
// We can use isErrRetryable utility method
            if(!response){this.onError(SOURCE_CONFIG_FETCH_ERROR(details===null||details===void 0?void 0:details.error));return;}var res;var errMessage='Unable to process/parse source config';try{if(isString(response)){res=JSON.parse(response);}else {res=response;}}catch(e){this.onError(e,errMessage,true);return;}if(!isValidSourceConfig(res)){this.onError(new Error(errMessage),undefined,true);return;}// determine the dataPlane url
            var dataPlaneUrl=resolveDataPlaneUrl(res.source.dataplanes,state.lifecycle.dataPlaneUrl.value,state.loadOptions.value.residencyServer,this.logger);if(!dataPlaneUrl){this.onError(new Error(DATA_PLANE_URL_ERROR),undefined,true);return;}var nativeDestinations=res.source.destinations.length>0?filterEnabledDestination(res.source.destinations):[];// set in the state --> source, destination, lifecycle, reporting
            o(function(){var _state$loadOptions$va2;// set source related information in state
                state.source.value={config:res.source.config,id:res.source.id};// set device mode destination related information in state
                state.nativeDestinations.configuredDestinations.value=nativeDestinations;// set the values in state for reporting slice
                updateReportingState(res,_this3.logger);// set the desired optional plugins
                state.plugins.pluginsToLoadFromConfig.value=(_state$loadOptions$va2=state.loadOptions.value.plugins)!==null&&_state$loadOptions$va2!==void 0?_state$loadOptions$va2:[];// set application lifecycle state
// Cast to string as we are sure that the value is not undefined
                state.lifecycle.activeDataplaneUrl.value=removeTrailingSlashes(dataPlaneUrl);state.lifecycle.status.value=LifecycleStatus.Configured;});}/**
         * A function to fetch source config either from /sourceConfig endpoint
         * or from getSourceConfig load option
         * @returns
         */},{key:"getConfig",value:function getConfig(){var _this4=this;var sourceConfigFunc=state.loadOptions.value.getSourceConfig;if(sourceConfigFunc){if(!isFunction(sourceConfigFunc)){throw new Error(SOURCE_CONFIG_OPTION_ERROR);}// fetch source config from the function
            var res=sourceConfigFunc();if(res instanceof Promise){res.then(function(pRes){return _this4.processConfig(pRes);}).catch(function(err){_this4.onError(err,'SourceConfig');});}else {this.processConfig(res);}}else {// fetch source config from config url API
            this.httpClient.getAsyncData({url:state.lifecycle.sourceConfigUrl.value,options:{headers:{'Content-Type':undefined}},callback:this.processConfig});}}}]);return ConfigManager;}();

    /**
     * Get the referrer URL
     * @returns The referrer URL
     */var getReferrer=function getReferrer(){return document.referrer||'$direct';};/**
     * To get the canonical URL of the page
     * @returns canonical URL
     */var getCanonicalUrl=function getCanonicalUrl(){var tags=document.getElementsByTagName('link');var canonicalUrl='';for(var i=0;tags[i];i+=1){var tag=tags[i];if(tag.getAttribute('rel')==='canonical'&&!canonicalUrl){var _tag$getAttribute;canonicalUrl=(_tag$getAttribute=tag.getAttribute('href'))!==null&&_tag$getAttribute!==void 0?_tag$getAttribute:'';break;}}return canonicalUrl;};var getUserAgent=function getUserAgent(){if(isUndefined(globalThis.navigator)){return null;}var userAgent=globalThis.navigator.userAgent;var _ref=globalThis.navigator,brave=_ref.brave;// For supporting Brave browser detection,
// add "Brave/<version>" to the user agent with the version value from the Chrome component
        if(brave&&Object.getPrototypeOf(brave).isBrave){// Example:
// Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36
            var matchedArr=userAgent.match(/(chrome)\/([\w.]+)/i);if(matchedArr){userAgent="".concat(userAgent," Brave/").concat(matchedArr[2]);}}return userAgent;};var getLanguage=function getLanguage(){var _globalThis$navigator;if(isUndefined(globalThis.navigator)){return null;}return (_globalThis$navigator=globalThis.navigator.language)!==null&&_globalThis$navigator!==void 0?_globalThis$navigator:globalThis.navigator.browserLanguage;};/**
     * Default page properties
     * @returns Default page properties
     */var getDefaultPageProperties=function getDefaultPageProperties(){var canonicalUrl=getCanonicalUrl();var path=globalThis.location.pathname;var tabUrl=globalThis.location.href;var pageUrl=tabUrl;var search=globalThis.location.search;// If valid canonical url is provided use this as page url.
        if(canonicalUrl){try{var urlObj=new URL(canonicalUrl);// If existing, query params of canonical url will be used instead of the location.search ones
            if(urlObj.search===''){pageUrl=canonicalUrl+search;}else {pageUrl=canonicalUrl;}path=urlObj.pathname;}catch(err){// Do nothing
        }}var url=getUrlWithoutHash(pageUrl);var _document=document,title=_document.title;var referrer=getReferrer();return {path:path,referrer:referrer,referring_domain:getReferringDomain(referrer),search:search,title:title,url:url,tab_url:tabUrl};};

    var POLYFILL_URL="https://polyfill.io/v3/polyfill.min.js?features=".concat(Object.keys(legacyJSEngineRequiredPolyfills).join('%2C'));var POLYFILL_LOAD_TIMEOUT=10*1000;// 10 seconds
    var POLYFILL_SCRIPT_ID='rudderstackPolyfill';

    var CapabilitiesManager=/*#__PURE__*/function(){function CapabilitiesManager(errorHandler,logger){_classCallCheck(this,CapabilitiesManager);this.logger=logger;this.errorHandler=errorHandler;this.externalSrcLoader=new ExternalSrcLoader(this.errorHandler,this.logger);this.onError=this.onError.bind(this);this.onReady=this.onReady.bind(this);}_createClass(CapabilitiesManager,[{key:"init",value:function init(){try{this.prepareBrowserCapabilities();this.attachWindowListeners();}catch(err){this.onError(err);}}/**
         * Detect supported capabilities and set values in state
         */ // eslint-disable-next-line class-methods-use-this
    },{key:"detectBrowserCapabilities",value:function detectBrowserCapabilities(){var _this=this;o(function(){// Storage related details
            state.capabilities.storage.isCookieStorageAvailable.value=isStorageAvailable(COOKIE_STORAGE,getStorageEngine(COOKIE_STORAGE),_this.logger);state.capabilities.storage.isLocalStorageAvailable.value=isStorageAvailable(LOCAL_STORAGE,undefined,_this.logger);state.capabilities.storage.isSessionStorageAvailable.value=isStorageAvailable(SESSION_STORAGE,undefined,_this.logger);// Browser feature detection details
            state.capabilities.isBeaconAvailable.value=hasBeacon();state.capabilities.isUaCHAvailable.value=hasUAClientHints();state.capabilities.isCryptoAvailable.value=hasCrypto();state.capabilities.isIE11.value=isIE11();state.capabilities.isOnline.value=globalThis.navigator.onLine;// Get page context details
            state.context.userAgent.value=getUserAgent();state.context.locale.value=getLanguage();state.context.screen.value=getScreenDetails();state.context.campaign.value=extractUTMParameters(globalThis.location.href);if(hasUAClientHints()){getUserAgentClientHint(function(uach){state.context['ua-ch'].value=uach;},state.loadOptions.value.uaChTrackLevel);}// Get page properties details
            var pageProperties=getDefaultPageProperties();state.page.path.value=pageProperties.path;state.page.referrer.value=pageProperties.referrer;state.page.referring_domain.value=pageProperties.referring_domain;state.page.search.value=pageProperties.search;state.page.title.value=pageProperties.title;state.page.url.value=pageProperties.url;state.page.tab_url.value=pageProperties.tab_url;});// Ad blocker detection
            b(function(){if(state.loadOptions.value.sendAdblockPage===true&&state.lifecycle.sourceConfigUrl.value!==undefined){detectAdBlockers(_this.errorHandler,_this.logger);}});}/**
         * Detect if polyfills are required and then load script from polyfill URL
         */},{key:"prepareBrowserCapabilities",value:function prepareBrowserCapabilities(){var _state$loadOptions$va,_this2=this;state.capabilities.isLegacyDOM.value=isLegacyJSEngine();var polyfillUrl=(_state$loadOptions$va=state.loadOptions.value.polyfillURL)!==null&&_state$loadOptions$va!==void 0?_state$loadOptions$va:POLYFILL_URL;var shouldLoadPolyfill=state.loadOptions.value.polyfillIfRequired&&state.capabilities.isLegacyDOM.value&&Boolean(polyfillUrl);if(shouldLoadPolyfill){var _this$externalSrcLoad,_state$loadOptions$va2;// TODO: check if polyfill has been evaluated via polling or
//  with the callback param in its url and an exposed function
            var onPolyfillLoad=function onPolyfillLoad(scriptId){return Boolean(scriptId)&&_this2.onReady();};(_this$externalSrcLoad=this.externalSrcLoader)===null||_this$externalSrcLoad===void 0?void 0:_this$externalSrcLoad.loadJSFile({url:(_state$loadOptions$va2=state.loadOptions.value.polyfillURL)!==null&&_state$loadOptions$va2!==void 0?_state$loadOptions$va2:POLYFILL_URL,id:POLYFILL_SCRIPT_ID,async:true,timeout:POLYFILL_LOAD_TIMEOUT,callback:onPolyfillLoad});}else {this.onReady();}}/**
         * Attach listeners to window to observe event that update capabilities state values
         */ // eslint-disable-next-line class-methods-use-this
    },{key:"attachWindowListeners",value:function attachWindowListeners(){globalThis.addEventListener('offline',function(){state.capabilities.isOnline.value=false;});globalThis.addEventListener('online',function(){state.capabilities.isOnline.value=true;});// TODO: add debounced listener for globalThis.onResize event and update state.context.screen.value
        }/**
         * Set the lifecycle status to next phase
         */ // eslint-disable-next-line class-methods-use-this
    },{key:"onReady",value:function onReady(){this.detectBrowserCapabilities();state.lifecycle.status.value=LifecycleStatus.BrowserCapabilitiesReady;}/**
         * Handles error
         * @param error The error object
         */},{key:"onError",value:function onError(error){if(this.errorHandler){this.errorHandler.onError(error,CAPABILITIES_MANAGER);}else {throw error;}}}]);return CapabilitiesManager;}();

    var CHANNEL='web';// These are the top-level elements in the standard RudderStack event spec
    var TOP_LEVEL_ELEMENTS=['integrations','anonymousId','originalTimestamp'];// Reserved elements in the context of standard RudderStack event spec
// Typically, these elements are not allowed to be overridden by the user
    var CONTEXT_RESERVED_ELEMENTS=['library','consentManagement','userAgent','ua-ch','screen'];// Reserved elements in the standard RudderStack event spec
    var RESERVED_ELEMENTS=['anonymousId','sentAt','receivedAt','timestamp','originalTimestamp','event','messageId','channel'];var DEFAULT_INTEGRATIONS_CONFIG={All:true};

    /**
     * To get the page properties for context object
     * @param pageProps Page properties
     * @returns page properties object for context
     */var getContextPageProperties=function getContextPageProperties(pageProps){var ctxPageProps={};Object.keys(state.page).forEach(function(key){ctxPageProps[key]=(pageProps===null||pageProps===void 0?void 0:pageProps[key])||state.page[key].value;});ctxPageProps.initial_referrer=(pageProps===null||pageProps===void 0?void 0:pageProps.initial_referrer)||state.session.initialReferrer.value;ctxPageProps.initial_referring_domain=(pageProps===null||pageProps===void 0?void 0:pageProps.initial_referring_domain)||state.session.initialReferringDomain.value;return ctxPageProps;};/**
     * Add any missing default page properties using values from options and defaults
     * @param properties Input page properties
     * @param options API options
     */var getUpdatedPageProperties=function getUpdatedPageProperties(properties,options){var optionsPageProps=(options===null||options===void 0?void 0:options.page)||{};var pageProps=properties;Object.keys(state.page).forEach(function(key){if(isUndefined(pageProps[key])){pageProps[key]=optionsPageProps[key]||state.page[key].value;}});if(isUndefined(pageProps.initial_referrer)){pageProps.initial_referrer=optionsPageProps.initial_referrer||state.session.initialReferrer.value;}if(isUndefined(pageProps.initial_referring_domain)){pageProps.initial_referring_domain=optionsPageProps.initial_referring_domain||state.session.initialReferringDomain.value;}return pageProps;};/**
     * Utility to check for reserved keys in the input object
     * @param obj Generic object
     * @param eventType Rudder event type
     * @param parentKeyPath Object's parent key path
     * @param logger Logger instance
     */var checkForReservedElementsInObject=function checkForReservedElementsInObject(obj,parentKeyPath,logger){if(isObjectLiteralAndNotNull(obj)){Object.keys(obj).forEach(function(property){if(RESERVED_ELEMENTS.includes(property)||RESERVED_ELEMENTS.includes(property.toLowerCase())){logger===null||logger===void 0?void 0:logger.warn(RESERVED_KEYWORD_WARNING(EVENT_MANAGER,property,parentKeyPath,RESERVED_ELEMENTS));}});}};/**
     * Checks for reserved keys in traits, properties, and contextual traits
     * @param rudderEvent Generated rudder event
     * @param logger Logger instance
     */var checkForReservedElements=function checkForReservedElements(rudderEvent,logger){//  properties, traits, contextualTraits are either undefined or object
        var properties=rudderEvent.properties,traits=rudderEvent.traits,context=rudderEvent.context;var contextualTraits=context.traits;checkForReservedElementsInObject(properties,'properties',logger);checkForReservedElementsInObject(traits,'traits',logger);checkForReservedElementsInObject(contextualTraits,'context.traits',logger);};/**
     * Overrides the top-level event properties with data from API options
     * @param rudderEvent Generated rudder event
     * @param options API options
     */var updateTopLevelEventElements=function updateTopLevelEventElements(rudderEvent,options){if(options.anonymousId&&isString(options.anonymousId)){// eslint-disable-next-line no-param-reassign
        rudderEvent.anonymousId=options.anonymousId;}if(options.integrations&&isObjectLiteralAndNotNull(options.integrations)){// eslint-disable-next-line no-param-reassign
        rudderEvent.integrations=options.integrations;}if(options.originalTimestamp&&isString(options.originalTimestamp)){// eslint-disable-next-line no-param-reassign
        rudderEvent.originalTimestamp=options.originalTimestamp;}};/**
     * To merge the contextual information in API options with existing data
     * @param rudderContext Generated rudder event
     * @param options API options
     * @param logger Logger instance
     */var getMergedContext=function getMergedContext(rudderContext,options,logger){var context=rudderContext;Object.keys(options).forEach(function(key){if(!TOP_LEVEL_ELEMENTS.includes(key)&&!CONTEXT_RESERVED_ELEMENTS.includes(key)){if(key!=='context'){context=mergeDeepRight(context,_defineProperty({},key,options[key]));}else if(!isUndefined(options[key])&&isObjectLiteralAndNotNull(options[key])){var tempContext={};Object.keys(options[key]).forEach(function(e){if(!CONTEXT_RESERVED_ELEMENTS.includes(e)){tempContext[e]=options[key][e];}});context=mergeDeepRight(context,_objectSpread2({},tempContext));}else {logger===null||logger===void 0?void 0:logger.warn(INVALID_CONTEXT_OBJECT_WARNING(EVENT_MANAGER));}}});return context;};/**
     * A function to determine whether SDK should use the integration option provided in load call
     * @returns boolean
     */var shouldUseGlobalIntegrationsConfigInEvents=function shouldUseGlobalIntegrationsConfigInEvents(){return state.loadOptions.value.useGlobalIntegrationsConfigInEvents&&isObjectLiteralAndNotNull(state.nativeDestinations.loadOnlyIntegrations.value);};/**
     * Updates rudder event object with data from the API options
     * @param rudderEvent Generated rudder event
     * @param options API options
     */var processOptions=function processOptions(rudderEvent,options){// Only allow object type for options
        if(!isNullOrUndefined(options)&&isObjectLiteralAndNotNull(options)){updateTopLevelEventElements(rudderEvent,options);// eslint-disable-next-line no-param-reassign
            rudderEvent.context=getMergedContext(rudderEvent.context,options);}};/**
     * Returns the final integrations config for the event based on the global config and event's config
     * @param integrationsConfig Event's integrations config
     * @returns Final integrations config
     */var getEventIntegrationsConfig=function getEventIntegrationsConfig(integrationsConfig){var finalIntgConfig;if(shouldUseGlobalIntegrationsConfigInEvents()){finalIntgConfig=state.nativeDestinations.loadOnlyIntegrations.value;}else if(isObjectLiteralAndNotNull(integrationsConfig)){finalIntgConfig=integrationsConfig;}else {finalIntgConfig=DEFAULT_INTEGRATIONS_CONFIG;}return finalIntgConfig;};/**
     * Enrich the base event object with data from state and the API options
     * @param rudderEvent RudderEvent object
     * @param options API options
     * @param pageProps Page properties
     * @param logger logger
     * @returns Enriched RudderEvent object
     */var getEnrichedEvent=function getEnrichedEvent(rudderEvent,options,pageProps,logger){var commonEventData={channel:CHANNEL,context:{traits:clone$1(state.session.userTraits.value),sessionId:state.session.sessionInfo.value.id||undefined,sessionStart:state.session.sessionInfo.value.sessionStart||undefined,consentManagement:{deniedConsentIds:clone$1(state.consents.data.value.deniedConsentIds)},'ua-ch':state.context['ua-ch'].value,app:state.context.app.value,library:state.context.library.value,userAgent:state.context.userAgent.value,os:state.context.os.value,locale:state.context.locale.value,screen:state.context.screen.value,campaign:clone$1(state.context.campaign.value),page:getContextPageProperties(pageProps)},originalTimestamp:getCurrentTimeFormatted(),integrations:DEFAULT_INTEGRATIONS_CONFIG,messageId:generateUUID(),userId:rudderEvent.userId||state.session.userId.value};if(state.storage.type.value===NO_STORAGE){// Generate new anonymous id for each request
        commonEventData.anonymousId=generateUUID();commonEventData.context.anonymousTracking=true;}else {// Type casting to string as the user session manager will take care of initializing the value
        commonEventData.anonymousId=state.session.anonymousUserId.value;}if(rudderEvent.type===RudderEventType.Identify){commonEventData.context.traits=state.storage.type.value!==NO_STORAGE?clone$1(state.session.userTraits.value):rudderEvent.context.traits;}if(rudderEvent.type===RudderEventType.Group){if(rudderEvent.groupId||state.session.groupId.value){commonEventData.groupId=rudderEvent.groupId||state.session.groupId.value;}if(rudderEvent.traits||state.session.groupTraits.value){commonEventData.traits=state.storage.type.value!==NO_STORAGE?clone$1(state.session.groupTraits.value):rudderEvent.traits;}}var processedEvent=mergeDeepRight(rudderEvent,commonEventData);// Set the default values for the event properties
// matching with v1.1 payload
        if(processedEvent.event===undefined){processedEvent.event=null;}if(processedEvent.properties===undefined){processedEvent.properties=null;}processOptions(processedEvent,options);// TODO: We might not need this check altogether
        checkForReservedElements(processedEvent,logger);// Update the integrations config for the event
        processedEvent.integrations=getEventIntegrationsConfig(processedEvent.integrations);return processedEvent;};

    var RudderEventFactory=/*#__PURE__*/function(){function RudderEventFactory(logger){_classCallCheck(this,RudderEventFactory);this.logger=logger;}/**
     * Generate a 'page' event based on the user-input fields
     * @param category Page's category
     * @param name Page name
     * @param properties Page properties
     * @param options API options
     */_createClass(RudderEventFactory,[{key:"generatePageEvent",value:function generatePageEvent(category,name,properties,options){var props=properties!==null&&properties!==void 0?properties:{};props.name=name;props.category=category;props=getUpdatedPageProperties(props,options);var pageEvent={properties:props,name:name,category:category,type:RudderEventType.Page};return getEnrichedEvent(pageEvent,options,props,this.logger);}/**
         * Generate a 'track' event based on the user-input fields
         * @param event The event name
         * @param properties Event properties
         * @param options API options
         */},{key:"generateTrackEvent",value:function generateTrackEvent(event,properties,options){var trackEvent={properties:properties,event:event,type:RudderEventType.Track};return getEnrichedEvent(trackEvent,options,undefined,this.logger);}/**
         * Generate an 'identify' event based on the user-input fields
         * @param options API options
         */},{key:"generateIdentifyEvent",value:function generateIdentifyEvent(userId,traits,options){var identifyEvent={userId:userId,type:RudderEventType.Identify,context:{traits:traits}};return getEnrichedEvent(identifyEvent,options,undefined,this.logger);}/**
         * Generate an 'alias' event based on the user-input fields
         * @param to New user ID
         * @param from Old user ID
         * @param options API options
         */},{key:"generateAliasEvent",value:function generateAliasEvent(to,from,options){var aliasEvent={previousId:from,type:RudderEventType.Alias};var enrichedEvent=getEnrichedEvent(aliasEvent,options,undefined,this.logger);// override the User ID from the API inputs
            enrichedEvent.userId=to!==null&&to!==void 0?to:enrichedEvent.userId;return enrichedEvent;}/**
         * Generate a 'group' event based on the user-input fields
         * @param options API options
         */},{key:"generateGroupEvent",value:function generateGroupEvent(groupId,traits,options){var groupEvent={type:RudderEventType.Group};if(groupId){groupEvent.groupId=groupId;}if(traits){groupEvent.traits=traits;}return getEnrichedEvent(groupEvent,options,undefined,this.logger);}/**
         * Generates a new RudderEvent object based on the user-input fields
         * @param event API event parameters object
         * @returns A RudderEvent object
         */},{key:"create",value:function create(event){var eventObj;switch(event.type){case RudderEventType.Page:eventObj=this.generatePageEvent(event.category,event.name,event.properties,event.options);break;case RudderEventType.Track:eventObj=this.generateTrackEvent(event.name,event.properties,event.options);break;case RudderEventType.Identify:eventObj=this.generateIdentifyEvent(event.userId,event.traits,event.options);break;case RudderEventType.Alias:eventObj=this.generateAliasEvent(event.to,event.from,event.options);break;case RudderEventType.Group:eventObj=this.generateGroupEvent(event.groupId,event.traits,event.options);break;}return eventObj;}}]);return RudderEventFactory;}();

    /**
     * A service to generate valid event payloads and queue them for processing
     */var EventManager=/*#__PURE__*/function(){/**
     *
     * @param eventRepository Event repository instance
     * @param userSessionManager UserSession Manager instance
     * @param errorHandler Error handler object
     * @param logger Logger object
     */function EventManager(eventRepository,userSessionManager,errorHandler,logger){_classCallCheck(this,EventManager);this.eventRepository=eventRepository;this.userSessionManager=userSessionManager;this.errorHandler=errorHandler;this.logger=logger;this.eventFactory=new RudderEventFactory(this.logger);this.onError=this.onError.bind(this);}/**
     * Initializes the event manager
     */_createClass(EventManager,[{key:"init",value:function init(){this.eventRepository.init();}/**
         * Consumes a new incoming event
         * @param event Incoming event data
         */},{key:"addEvent",value:function addEvent(event){this.userSessionManager.refreshSession();var rudderEvent=this.eventFactory.create(event);if(rudderEvent){this.eventRepository.enqueue(rudderEvent,event.callback);}else {this.onError(new Error(EVENT_OBJECT_GENERATION_ERROR));}}/**
         * Handles error
         * @param error The error object
         */},{key:"onError",value:function onError(error,customMessage,shouldAlwaysThrow){if(this.errorHandler){this.errorHandler.onError(error,EVENT_MANAGER,customMessage,shouldAlwaysThrow);}else {throw error;}}}]);return EventManager;}();

    var MIN_SESSION_ID_LENGTH=10;/**
     * A function to validate current session and return true/false depending on that
     * @returns boolean
     */var hasSessionExpired=function hasSessionExpired(expiresAt){var timestamp=Date.now();return Boolean(!expiresAt||timestamp>expiresAt);};/**
     * A function to generate session id
     * @returns number
     */var generateSessionId=function generateSessionId(){return Date.now();};/**
     * Function to validate user provided sessionId
     * @param {number} sessionId
     * @returns
     */var isManualSessionIdValid=function isManualSessionIdValid(sessionId,logger){if(!sessionId||!isPositiveInteger(sessionId)||!hasMinLength(MIN_SESSION_ID_LENGTH,sessionId)){logger===null||logger===void 0?void 0:logger.warn(INVALID_SESSION_ID_WARNING(USER_SESSION_MANAGER,sessionId,MIN_SESSION_ID_LENGTH));return false;}return true;};/**
     * A function to generate new auto tracking session
     * @param sessionTimeout current timestamp
     * @returns SessionInfo
     */var generateAutoTrackingSession=function generateAutoTrackingSession(sessionTimeout){var timestamp=Date.now();var timeout=sessionTimeout||DEFAULT_SESSION_TIMEOUT_MS;return {id:timestamp,// set the current timestamp
        expiresAt:timestamp+timeout,// set the expiry time of the session
        timeout:timeout,sessionStart:undefined,autoTrack:true};};/**
     * A function to generate new manual tracking session
     * @param id Provided sessionId
     * @param logger Logger module
     * @returns SessionInfo
     */var generateManualTrackingSession=function generateManualTrackingSession(id,logger){var sessionId=isManualSessionIdValid(id,logger)?id:generateSessionId();return {id:sessionId,sessionStart:undefined,manualTrack:true};};

    var userSessionStorageKeys={userId:'rl_user_id',userTraits:'rl_trait',anonymousUserId:'rl_anonymous_id',groupId:'rl_group_id',groupTraits:'rl_group_trait',initialReferrer:'rl_page_init_referrer',initialReferringDomain:'rl_page_init_referring_domain',sessionInfo:'rl_session'};var defaultUserSessionValues={userId:'',userTraits:{},anonymousUserId:'',groupId:'',groupTraits:{},initialReferrer:'',initialReferringDomain:'',sessionInfo:{}};

    var UserSessionManager=/*#__PURE__*/function(){function UserSessionManager(errorHandler,logger,pluginsManager,store){_classCallCheck(this,UserSessionManager);this.store=store;this.pluginsManager=pluginsManager;this.logger=logger;this.errorHandler=errorHandler;this.onError=this.onError.bind(this);}/**
     * Initialize User session with values from storage
     * @param store Selected store
     */_createClass(UserSessionManager,[{key:"init",value:function init(store){if(!store){this.setDefaultValues();}else {var _this$getUserId,_this$getUserTraits,_this$getGroupId,_this$getGroupTraits;this.store=store;this.migrateStorageIfNeeded();// get the values from storage and set it again
            this.setUserId((_this$getUserId=this.getUserId())!==null&&_this$getUserId!==void 0?_this$getUserId:defaultUserSessionValues.userId);this.setUserTraits((_this$getUserTraits=this.getUserTraits())!==null&&_this$getUserTraits!==void 0?_this$getUserTraits:defaultUserSessionValues.userTraits);this.setGroupId((_this$getGroupId=this.getGroupId())!==null&&_this$getGroupId!==void 0?_this$getGroupId:defaultUserSessionValues.groupId);this.setGroupTraits((_this$getGroupTraits=this.getGroupTraits())!==null&&_this$getGroupTraits!==void 0?_this$getGroupTraits:defaultUserSessionValues.groupTraits);this.setAnonymousId(this.getAnonymousId(state.loadOptions.value.anonymousIdOptions));var initialReferrer=this.getInitialReferrer();var initialReferringDomain=this.getInitialReferringDomain();if(initialReferrer&&initialReferringDomain){this.setInitialReferrer(initialReferrer);this.setInitialReferringDomain(initialReferringDomain);}else if(initialReferrer){this.setInitialReferrer(initialReferrer);this.setInitialReferringDomain(getReferringDomain(initialReferrer));}else {var referrer=getReferrer();this.setInitialReferrer(referrer);this.setInitialReferringDomain(getReferringDomain(referrer));}// Initialize session tracking
            this.initializeSessionTracking();// Register the effect to sync with storage
            this.registerEffects();}}},{key:"setDefaultValues",value:function setDefaultValues(){o(function(){state.session.userId.value=defaultUserSessionValues.userId;state.session.userTraits.value=defaultUserSessionValues.userTraits;state.session.groupId.value=defaultUserSessionValues.groupId;state.session.groupTraits.value=defaultUserSessionValues.groupTraits;state.session.anonymousUserId.value=defaultUserSessionValues.anonymousUserId;state.session.initialReferrer.value=defaultUserSessionValues.initialReferrer;state.session.initialReferringDomain.value=defaultUserSessionValues.initialReferringDomain;state.session.sessionInfo.value=defaultUserSessionValues.sessionInfo;});}},{key:"migrateStorageIfNeeded",value:function migrateStorageIfNeeded(){var _this=this;if(!state.storage.migrate.value){return;}Object.values(userSessionStorageKeys).forEach(function(storageEntry){var _this$pluginsManager,_this$store;var migratedVal=(_this$pluginsManager=_this.pluginsManager)===null||_this$pluginsManager===void 0?void 0:_this$pluginsManager.invokeSingle('storage.migrate',storageEntry,(_this$store=_this.store)===null||_this$store===void 0?void 0:_this$store.engine,_this.errorHandler,_this.logger);_this.syncValueToStorage(storageEntry,migratedVal);});}/**
         * A function to initialize sessionTracking
         */},{key:"initializeSessionTracking",value:function initializeSessionTracking(){var _this$getSessionFromS;var sessionInfo=(_this$getSessionFromS=this.getSessionFromStorage())!==null&&_this$getSessionFromS!==void 0?_this$getSessionFromS:defaultSessionInfo;var finalAutoTrackingStatus=!(state.loadOptions.value.sessions.autoTrack===false||sessionInfo.manualTrack===true);var sessionTimeout;var configuredSessionTimeout=state.loadOptions.value.sessions.timeout;if(!isPositiveInteger(configuredSessionTimeout)){var _this$logger;(_this$logger=this.logger)===null||_this$logger===void 0?void 0:_this$logger.warn(TIMEOUT_NOT_NUMBER_WARNING(USER_SESSION_MANAGER,configuredSessionTimeout,DEFAULT_SESSION_TIMEOUT_MS));sessionTimeout=DEFAULT_SESSION_TIMEOUT_MS;}else {sessionTimeout=configuredSessionTimeout;}if(sessionTimeout===0){var _this$logger2;(_this$logger2=this.logger)===null||_this$logger2===void 0?void 0:_this$logger2.warn(TIMEOUT_ZERO_WARNING(USER_SESSION_MANAGER));finalAutoTrackingStatus=false;}// In case user provides a timeout value greater than 0 but less than 10 seconds SDK will show a warning
// and will proceed with it
            if(sessionTimeout>0&&sessionTimeout<MIN_SESSION_TIMEOUT_MS){var _this$logger3;(_this$logger3=this.logger)===null||_this$logger3===void 0?void 0:_this$logger3.warn(TIMEOUT_NOT_RECOMMENDED_WARNING(USER_SESSION_MANAGER,sessionTimeout,MIN_SESSION_TIMEOUT_MS));}state.session.sessionInfo.value=_objectSpread2(_objectSpread2({},sessionInfo),{},{timeout:sessionTimeout,autoTrack:finalAutoTrackingStatus});// If auto session tracking is enabled start the session tracking
            if(state.session.sessionInfo.value.autoTrack){this.startOrRenewAutoTracking();}}/**
         * Handles error
         * @param error The error object
         */},{key:"onError",value:function onError(error){if(this.errorHandler){this.errorHandler.onError(error,USER_SESSION_MANAGER);}else {throw error;}}/**
         * A function to sync values in storage
         * @param key
         * @param value
         */},{key:"syncValueToStorage",value:function syncValueToStorage(key,value){if(value&&isString(value)||isNonEmptyObject(value)){var _this$store2;(_this$store2=this.store)===null||_this$store2===void 0?void 0:_this$store2.set(key,value);}else {var _this$store3;(_this$store3=this.store)===null||_this$store3===void 0?void 0:_this$store3.remove(key);}}/**
         * Function to update storage whenever state value changes
         */},{key:"registerEffects",value:function registerEffects(){var _this2=this;/**
         * Update userId in storage automatically when userId is updated in state
         */b(function(){_this2.syncValueToStorage(userSessionStorageKeys.userId,state.session.userId.value);});/**
         * Update user traits in storage automatically when it is updated in state
         */b(function(){_this2.syncValueToStorage(userSessionStorageKeys.userTraits,state.session.userTraits.value);});/**
         * Update group id in storage automatically when it is updated in state
         */b(function(){_this2.syncValueToStorage(userSessionStorageKeys.groupId,state.session.groupId.value);});/**
         * Update group traits in storage automatically when it is updated in state
         */b(function(){_this2.syncValueToStorage(userSessionStorageKeys.groupTraits,state.session.groupTraits.value);});/**
         * Update anonymous user id in storage automatically when it is updated in state
         */b(function(){_this2.syncValueToStorage(userSessionStorageKeys.anonymousUserId,state.session.anonymousUserId.value);});/**
         * Update initial referrer in storage automatically when it is updated in state
         */b(function(){_this2.syncValueToStorage(userSessionStorageKeys.initialReferrer,state.session.initialReferrer.value);});/**
         * Update initial referring domain in storage automatically when it is updated in state
         */b(function(){_this2.syncValueToStorage(userSessionStorageKeys.initialReferringDomain,state.session.initialReferringDomain.value);});/**
         * Update session tracking info in storage automatically when it is updated in state
         */b(function(){_this2.syncValueToStorage(userSessionStorageKeys.sessionInfo,state.session.sessionInfo.value);});}/**
         * Sets anonymous id in the following precedence:
         *
         * 1. anonymousId: Id directly provided to the function.
         * 2. rudderAmpLinkerParam: value generated from linker query parm (rudderstack)
         *    using parseLinker util.
         * 3. generateUUID: A new unique id is generated and assigned.
         */},{key:"setAnonymousId",value:function setAnonymousId(anonymousId,rudderAmpLinkerParam){if(this.store){var finalAnonymousId=anonymousId;if(!finalAnonymousId&&rudderAmpLinkerParam){var _this$pluginsManager2;var linkerPluginsResult=(_this$pluginsManager2=this.pluginsManager)===null||_this$pluginsManager2===void 0?void 0:_this$pluginsManager2.invokeMultiple('userSession.anonymousIdGoogleLinker',rudderAmpLinkerParam);finalAnonymousId=linkerPluginsResult===null||linkerPluginsResult===void 0?void 0:linkerPluginsResult[0];}state.session.anonymousUserId.value=finalAnonymousId||this.generateAnonymousId();}}/**
         * Generate a new anonymousId
         * @returns string anonymousID
         */},{key:"generateAnonymousId",value:function generateAnonymousId(){return generateUUID();}/**
         * Fetches anonymousId
         * @param options option to fetch it from external source
         * @returns anonymousId
         */},{key:"getAnonymousId",value:function getAnonymousId(options){var _this$store4;// fetch the anonymousUserId from storage
            var persistedAnonymousId=(_this$store4=this.store)===null||_this$store4===void 0?void 0:_this$store4.get(userSessionStorageKeys.anonymousUserId);if(!persistedAnonymousId&&options){var _this$pluginsManager3;// fetch anonymousId from external source
                var autoCapturedAnonymousId=(_this$pluginsManager3=this.pluginsManager)===null||_this$pluginsManager3===void 0?void 0:_this$pluginsManager3.invokeSingle('storage.getAnonymousId',getStorageEngine,options);persistedAnonymousId=autoCapturedAnonymousId;}state.session.anonymousUserId.value=persistedAnonymousId||this.generateAnonymousId();return state.session.anonymousUserId.value;}/**
         * Fetches User Id
         * @returns
         */},{key:"getUserId",value:function getUserId(){var _this$store$get,_this$store5;return (_this$store$get=(_this$store5=this.store)===null||_this$store5===void 0?void 0:_this$store5.get(userSessionStorageKeys.userId))!==null&&_this$store$get!==void 0?_this$store$get:null;}/**
         * Fetches User Traits
         * @returns
         */},{key:"getUserTraits",value:function getUserTraits(){var _this$store$get2,_this$store6;return (_this$store$get2=(_this$store6=this.store)===null||_this$store6===void 0?void 0:_this$store6.get(userSessionStorageKeys.userTraits))!==null&&_this$store$get2!==void 0?_this$store$get2:null;}/**
         * Fetches Group Id
         * @returns
         */},{key:"getGroupId",value:function getGroupId(){var _this$store$get3,_this$store7;return (_this$store$get3=(_this$store7=this.store)===null||_this$store7===void 0?void 0:_this$store7.get(userSessionStorageKeys.groupId))!==null&&_this$store$get3!==void 0?_this$store$get3:null;}/**
         * Fetches Group Traits
         * @returns
         */},{key:"getGroupTraits",value:function getGroupTraits(){var _this$store$get4,_this$store8;return (_this$store$get4=(_this$store8=this.store)===null||_this$store8===void 0?void 0:_this$store8.get(userSessionStorageKeys.groupTraits))!==null&&_this$store$get4!==void 0?_this$store$get4:null;}/**
         * Fetches Initial Referrer
         * @returns
         */},{key:"getInitialReferrer",value:function getInitialReferrer(){var _this$store$get5,_this$store9;return (_this$store$get5=(_this$store9=this.store)===null||_this$store9===void 0?void 0:_this$store9.get(userSessionStorageKeys.initialReferrer))!==null&&_this$store$get5!==void 0?_this$store$get5:null;}/**
         * Fetches Initial Referring domain
         * @returns
         */},{key:"getInitialReferringDomain",value:function getInitialReferringDomain(){var _this$store$get6,_this$store10;return (_this$store$get6=(_this$store10=this.store)===null||_this$store10===void 0?void 0:_this$store10.get(userSessionStorageKeys.initialReferringDomain))!==null&&_this$store$get6!==void 0?_this$store$get6:null;}/**
         * Fetches session tracking information from storage
         * @returns
         */},{key:"getSessionFromStorage",value:function getSessionFromStorage(){var _this$store$get7,_this$store11;return (_this$store$get7=(_this$store11=this.store)===null||_this$store11===void 0?void 0:_this$store11.get(userSessionStorageKeys.sessionInfo))!==null&&_this$store$get7!==void 0?_this$store$get7:null;}/**
         * A function to update current session info after each event call
         */},{key:"refreshSession",value:function refreshSession(){if(state.session.sessionInfo.value.autoTrack||state.session.sessionInfo.value.manualTrack){if(state.session.sessionInfo.value.autoTrack){this.startOrRenewAutoTracking();}if(state.session.sessionInfo.value.sessionStart===undefined){state.session.sessionInfo.value=_objectSpread2(_objectSpread2({},state.session.sessionInfo.value),{},{sessionStart:true});}else if(state.session.sessionInfo.value.sessionStart){state.session.sessionInfo.value=_objectSpread2(_objectSpread2({},state.session.sessionInfo.value),{},{sessionStart:false});}}}/**
         * Reset state values
         * @param resetAnonymousId
         * @param noNewSessionStart
         * @returns
         */},{key:"reset",value:function reset(resetAnonymousId,noNewSessionStart){var _this3=this;var _state$session$sessio=state.session.sessionInfo.value,manualTrack=_state$session$sessio.manualTrack,autoTrack=_state$session$sessio.autoTrack;o(function(){state.session.userId.value='';state.session.userTraits.value={};state.session.groupId.value='';state.session.groupTraits.value={};if(resetAnonymousId){state.session.anonymousUserId.value='';}if(noNewSessionStart){return;}if(autoTrack){state.session.sessionInfo.value={};_this3.startOrRenewAutoTracking();}else if(manualTrack){_this3.startManualTrackingInternal();}});}/**
         * Set user Id
         * @param userId
         */},{key:"setUserId",value:function setUserId(userId){if(this.store){state.session.userId.value=userId;}}/**
         * Set user traits
         * @param traits
         */},{key:"setUserTraits",value:function setUserTraits(traits){if(traits&&this.store){var _state$session$userTr;state.session.userTraits.value=mergeDeepRight((_state$session$userTr=state.session.userTraits.value)!==null&&_state$session$userTr!==void 0?_state$session$userTr:{},traits);}}/**
         * Set group Id
         * @param groupId
         */},{key:"setGroupId",value:function setGroupId(groupId){if(this.store){state.session.groupId.value=groupId;}}/**
         * Set group traits
         * @param traits
         */},{key:"setGroupTraits",value:function setGroupTraits(traits){if(traits&&this.store){var _state$session$groupT;state.session.groupTraits.value=mergeDeepRight((_state$session$groupT=state.session.groupTraits.value)!==null&&_state$session$groupT!==void 0?_state$session$groupT:{},traits);}}/**
         * Set initial referrer
         * @param referrer
         */},{key:"setInitialReferrer",value:function setInitialReferrer(referrer){if(this.store){state.session.initialReferrer.value=referrer;}}/**
         * Set initial referring domain
         * @param referrer
         */},{key:"setInitialReferringDomain",value:function setInitialReferringDomain(referrer){if(this.store){state.session.initialReferringDomain.value=referrer;}}/**
         * A function to check for existing session details and depending on that create a new session.
         */},{key:"startOrRenewAutoTracking",value:function startOrRenewAutoTracking(){if(hasSessionExpired(state.session.sessionInfo.value.expiresAt)){state.session.sessionInfo.value=generateAutoTrackingSession(state.session.sessionInfo.value.timeout);}else {var timestamp=Date.now();var timeout=state.session.sessionInfo.value.timeout;state.session.sessionInfo.value=mergeDeepRight(state.session.sessionInfo.value,{expiresAt:timestamp+timeout// set the expiry time of the session
        });}}/**
         * A function method to start a manual session
         * @param {number} id     session identifier
         * @returns
         */},{key:"start",value:function start(id){state.session.sessionInfo.value=generateManualTrackingSession(id,this.logger);}/**
         * An internal function to start manual session
         */},{key:"startManualTrackingInternal",value:function startManualTrackingInternal(){this.start(Date.now());}/**
         * A public method to end an ongoing session.
         */},{key:"end",value:function end(){state.session.sessionInfo.value={};}/**
         * Clear storage
         * @param resetAnonymousId
         */},{key:"clearUserSessionStorage",value:function clearUserSessionStorage(resetAnonymousId){var _this$store12,_this$store13,_this$store14,_this$store15;(_this$store12=this.store)===null||_this$store12===void 0?void 0:_this$store12.remove(userSessionStorageKeys.userId);(_this$store13=this.store)===null||_this$store13===void 0?void 0:_this$store13.remove(userSessionStorageKeys.userTraits);(_this$store14=this.store)===null||_this$store14===void 0?void 0:_this$store14.remove(userSessionStorageKeys.groupId);(_this$store15=this.store)===null||_this$store15===void 0?void 0:_this$store15.remove(userSessionStorageKeys.groupTraits);if(resetAnonymousId){var _this$store16;(_this$store16=this.store)===null||_this$store16===void 0?void 0:_this$store16.remove(userSessionStorageKeys.anonymousUserId);}}}]);return UserSessionManager;}();

    /**
     * A buffer queue to serve as a store for any type of data
     */var BufferQueue=/*#__PURE__*/function(){function BufferQueue(){_classCallCheck(this,BufferQueue);this.items=[];}_createClass(BufferQueue,[{key:"enqueue",value:function enqueue(item){this.items.push(item);}},{key:"dequeue",value:function dequeue(){if(this.items.length===0){return null;}return this.items.shift();}},{key:"isEmpty",value:function isEmpty(){return this.items.length===0;}},{key:"size",value:function size(){return this.items.length;}},{key:"clear",value:function clear(){this.items=[];}}]);return BufferQueue;}();

    var DATA_PLANE_QUEUE_EXT_POINT_PREFIX='dataplaneEventsQueue';var DESTINATIONS_QUEUE_EXT_POINT_PREFIX='destinationsEventsQueue';

    /**
     * Event repository class responsible for queuing events for further processing and delivery
     */var EventRepository=/*#__PURE__*/function(){/**
     *
     * @param pluginsManager Plugins manager instance
     * @param storeManager Store Manager instance
     * @param errorHandler Error handler object
     * @param logger Logger object
     */function EventRepository(pluginsManager,storeManager,errorHandler,logger){_classCallCheck(this,EventRepository);this.pluginsManager=pluginsManager;this.errorHandler=errorHandler;this.logger=logger;this.httpClient=new HttpClient(errorHandler,logger);this.storeManager=storeManager;this.onError=this.onError.bind(this);}/**
     * Initializes the event repository
     */_createClass(EventRepository,[{key:"init",value:function init(){var _this=this;this.dataplaneEventsQueue=this.pluginsManager.invokeSingle("".concat(DATA_PLANE_QUEUE_EXT_POINT_PREFIX,".init"),state,this.httpClient,this.storeManager,this.errorHandler,this.logger);this.destinationsEventsQueue=this.pluginsManager.invokeSingle("".concat(DESTINATIONS_QUEUE_EXT_POINT_PREFIX,".init"),state,this.pluginsManager,this.storeManager,this.errorHandler,this.logger);// Start the queue once the client destinations are ready
            b(function(){if(state.nativeDestinations.clientDestinationsReady.value===true){_this.destinationsEventsQueue.start();}});}/**
         * Enqueues the event for processing
         * @param event RudderEvent object
         * @param callback API callback function
         */},{key:"enqueue",value:function enqueue(event,callback){var _this2=this;// Start the queue processing only when the destinations are ready or hybrid mode destinations exist
// However, events will be enqueued for now.
// At the time of processing the events, the integrations config data from destinations
// is merged into the event object
            b(function(){var _this2$dataplaneEvent;var shouldBufferDpEvents=state.loadOptions.value.bufferDataPlaneEventsUntilReady===true&&state.nativeDestinations.clientDestinationsReady.value===false;var hybridDestExist=state.nativeDestinations.activeDestinations.value.some(function(dest){return isHybridModeDestination(dest);});if(hybridDestExist===false||shouldBufferDpEvents===false&&((_this2$dataplaneEvent=_this2.dataplaneEventsQueue)===null||_this2$dataplaneEvent===void 0?void 0:_this2$dataplaneEvent.scheduleTimeoutActive)!==true){var _this2$dataplaneEvent2;(_this2$dataplaneEvent2=_this2.dataplaneEventsQueue)===null||_this2$dataplaneEvent2===void 0?void 0:_this2$dataplaneEvent2.start();}});// Force start the data plane events queue processing after a timeout
            if(state.loadOptions.value.bufferDataPlaneEventsUntilReady===true){globalThis.setTimeout(function(){var _this2$dataplaneEvent3;if(((_this2$dataplaneEvent3=_this2.dataplaneEventsQueue)===null||_this2$dataplaneEvent3===void 0?void 0:_this2$dataplaneEvent3.scheduleTimeoutActive)!==true){var _this2$dataplaneEvent4;(_this2$dataplaneEvent4=_this2.dataplaneEventsQueue)===null||_this2$dataplaneEvent4===void 0?void 0:_this2$dataplaneEvent4.start();}},state.loadOptions.value.dataPlaneEventsBufferTimeout);}var dpQEvent=clone$1(event);this.pluginsManager.invokeSingle("".concat(DATA_PLANE_QUEUE_EXT_POINT_PREFIX,".enqueue"),state,this.dataplaneEventsQueue,dpQEvent,this.errorHandler,this.logger);var dQEvent=clone$1(event);this.pluginsManager.invokeSingle("".concat(DESTINATIONS_QUEUE_EXT_POINT_PREFIX,".enqueue"),state,this.destinationsEventsQueue,dQEvent,this.errorHandler,this.logger);// Invoke the callback if it exists
            try{// Using the event sent to the data plane queue here
// to ensure the mutated (if any) event is sent to the callback
                callback===null||callback===void 0?void 0:callback(dpQEvent);}catch(error){this.onError(error,API_CALLBACK_INVOKE_ERROR);}}/**
         * Handles error
         * @param error The error object
         * @param customMessage a message
         * @param shouldAlwaysThrow if it should throw or use logger
         */},{key:"onError",value:function onError(error,customMessage,shouldAlwaysThrow){if(this.errorHandler){this.errorHandler.onError(error,EVENT_REPOSITORY,customMessage,shouldAlwaysThrow);}else {throw error;}}}]);return EventRepository;}();

    /*
 * Analytics class with lifecycle based on state ad user triggered events
 */var Analytics=/*#__PURE__*/function(){/**
     * Initialize services and components or use default ones if singletons
     */function Analytics(){_classCallCheck(this,Analytics);_defineProperty(this,"preloadBuffer",new BufferQueue());this.initialized=false;this.errorHandler=defaultErrorHandler;this.logger=defaultLogger;this.externalSrcLoader=new ExternalSrcLoader(this.errorHandler,this.logger);this.capabilitiesManager=new CapabilitiesManager(this.errorHandler,this.logger);this.httpClient=defaultHttpClient;this.load=this.load.bind(this);this.startLifecycle=this.startLifecycle.bind(this);this.prepareBrowserCapabilities=this.prepareBrowserCapabilities.bind(this);this.enqueuePreloadBufferEvents=this.enqueuePreloadBufferEvents.bind(this);this.processDataInPreloadBuffer=this.processDataInPreloadBuffer.bind(this);this.prepareInternalServices=this.prepareInternalServices.bind(this);this.loadConfig=this.loadConfig.bind(this);this.init=this.init.bind(this);this.loadPlugins=this.loadPlugins.bind(this);this.onInitialized=this.onInitialized.bind(this);this.processBufferedEvents=this.processBufferedEvents.bind(this);this.loadDestinations=this.loadDestinations.bind(this);this.onDestinationsReady=this.onDestinationsReady.bind(this);this.onReady=this.onReady.bind(this);this.ready=this.ready.bind(this);this.page=this.page.bind(this);this.track=this.track.bind(this);this.identify=this.identify.bind(this);this.alias=this.alias.bind(this);this.group=this.group.bind(this);this.reset=this.reset.bind(this);this.getAnonymousId=this.getAnonymousId.bind(this);this.setAnonymousId=this.setAnonymousId.bind(this);this.getUserId=this.getUserId.bind(this);this.getUserTraits=this.getUserTraits.bind(this);this.getGroupId=this.getGroupId.bind(this);this.getGroupTraits=this.getGroupTraits.bind(this);this.startSession=this.startSession.bind(this);this.endSession=this.endSession.bind(this);this.getSessionId=this.getSessionId.bind(this);}/**
     * Start application lifecycle if not already started
     */_createClass(Analytics,[{key:"load",value:function load(writeKey,dataPlaneUrl){var loadOptions=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};if(state.lifecycle.status.value){return;}var clonedDataPlaneUrl=clone$1(dataPlaneUrl);var clonedLoadOptions=clone$1(loadOptions);// dataPlaneUrl is not provided
            if(isObjectAndNotNull(dataPlaneUrl)){clonedLoadOptions=dataPlaneUrl;clonedDataPlaneUrl=undefined;}// Set initial state values
            o(function(){state.lifecycle.writeKey.value=writeKey;state.lifecycle.dataPlaneUrl.value=clonedDataPlaneUrl;state.loadOptions.value=normalizeLoadOptions(state.loadOptions.value,clonedLoadOptions);state.lifecycle.status.value=LifecycleStatus.Mounted;});// Expose state to global objects
            setExposedGlobal('state',state,writeKey);// Configure initial config of any services or components here
// State application lifecycle
            this.startLifecycle();}// Start lifecycle methods
        /**
         * Orchestrate the lifecycle of the application phases/status
         */},{key:"startLifecycle",value:function startLifecycle(){var _this=this;b(function(){try{switch(state.lifecycle.status.value){case LifecycleStatus.Mounted:_this.prepareBrowserCapabilities();break;case LifecycleStatus.BrowserCapabilitiesReady:// initialize the preloaded events enqueuing
            retrievePreloadBufferEvents(_this);_this.prepareInternalServices();_this.loadConfig();break;case LifecycleStatus.Configured:_this.loadPlugins();break;case LifecycleStatus.PluginsLoading:break;case LifecycleStatus.PluginsReady:_this.init();break;case LifecycleStatus.Initialized:_this.onInitialized();break;case LifecycleStatus.Loaded:_this.loadDestinations();_this.processBufferedEvents();break;case LifecycleStatus.DestinationsLoading:break;case LifecycleStatus.DestinationsReady:_this.onDestinationsReady();break;case LifecycleStatus.Ready:_this.onReady();break;default:break;}}catch(err){var issue='Failed to load the SDK';_this.errorHandler.onError(getMutatedError(err,issue),ANALYTICS_CORE);}});}/**
         * Load browser polyfill if required
         */},{key:"prepareBrowserCapabilities",value:function prepareBrowserCapabilities(){this.capabilitiesManager.init();}/**
         * Enqueue in SDK preload buffer events, used from preloadBuffer component
         */},{key:"enqueuePreloadBufferEvents",value:function enqueuePreloadBufferEvents(bufferedEvents){var _this2=this;if(Array.isArray(bufferedEvents)){bufferedEvents.forEach(function(bufferedEvent){return _this2.preloadBuffer.enqueue(clone$1(bufferedEvent));});}}/**
         * Process the buffer preloaded events by passing their arguments to the respective facade methods
         */},{key:"processDataInPreloadBuffer",value:function processDataInPreloadBuffer(){while(this.preloadBuffer.size()>0){var eventToProcess=this.preloadBuffer.dequeue();if(eventToProcess){consumePreloadBufferedEvent(_toConsumableArray(eventToProcess),this);}}}},{key:"prepareInternalServices",value:function prepareInternalServices(){this.pluginsManager=new PluginsManager(defaultPluginEngine,this.errorHandler,this.logger);this.storeManager=new StoreManager(this.pluginsManager,this.errorHandler,this.logger);this.configManager=new ConfigManager(this.httpClient,this.errorHandler,this.logger);this.userSessionManager=new UserSessionManager(this.errorHandler,this.logger,this.pluginsManager);this.eventRepository=new EventRepository(this.pluginsManager,this.storeManager,this.errorHandler,this.logger);this.eventManager=new EventManager(this.eventRepository,this.userSessionManager,this.errorHandler,this.logger);}/**
         * Load configuration
         */},{key:"loadConfig",value:function loadConfig(){var _this$configManager;if(!state.lifecycle.writeKey.value){this.errorHandler.onError(new Error('A write key is required to load the SDK. Please provide a valid write key.'),LOAD_CONFIGURATION);return;}this.httpClient.setAuthHeader(state.lifecycle.writeKey.value);(_this$configManager=this.configManager)===null||_this$configManager===void 0?void 0:_this$configManager.init();}/**
         * Initialize the storage and event queue
         */},{key:"init",value:function init(){var _this$storeManager,_this$storeManager2,_this$userSessionMana,_this$eventManager;this.errorHandler.init(this.externalSrcLoader);// Initialize storage
            (_this$storeManager=this.storeManager)===null||_this$storeManager===void 0?void 0:_this$storeManager.init();this.clientDataStore=(_this$storeManager2=this.storeManager)===null||_this$storeManager2===void 0?void 0:_this$storeManager2.getStore(CLIENT_DATA_STORE_NAME);(_this$userSessionMana=this.userSessionManager)===null||_this$userSessionMana===void 0?void 0:_this$userSessionMana.init(this.clientDataStore);// Initialize consent manager
            if(state.consents.activeConsentManagerPluginName.value){var _this$pluginsManager;(_this$pluginsManager=this.pluginsManager)===null||_this$pluginsManager===void 0?void 0:_this$pluginsManager.invokeSingle("consentManager.init",state,this.storeManager,this.logger);}// Initialize event manager
            (_this$eventManager=this.eventManager)===null||_this$eventManager===void 0?void 0:_this$eventManager.init();// Mark the SDK as initialized
            state.lifecycle.status.value=LifecycleStatus.Initialized;}/**
         * Load plugins
         */},{key:"loadPlugins",value:function loadPlugins(){var _this$pluginsManager2;(_this$pluginsManager2=this.pluginsManager)===null||_this$pluginsManager2===void 0?void 0:_this$pluginsManager2.init();// TODO: are we going to enable custom plugins to be passed as load options?
// registerCustomPlugins(state.loadOptions.value.customPlugins);
        }/**
         * Trigger onLoaded callback if any is provided in config & emit initialised event
         */},{key:"onInitialized",value:function onInitialized(){// Process any preloaded events
            this.processDataInPreloadBuffer();// TODO: we need to avoid passing the window object to the callback function
// as this will prevent us from supporting multiple SDK instances in the same page
// Execute onLoaded callback if provided in load options
            if(isFunction(state.loadOptions.value.onLoaded)){state.loadOptions.value.onLoaded(globalThis.rudderanalytics);}// Set lifecycle state
            o(function(){state.lifecycle.loaded.value=true;state.lifecycle.status.value=LifecycleStatus.Loaded;});this.initialized=true;// Emit an event to use as substitute to the onLoaded callback
            var initializedEvent=new CustomEvent('RSA_Initialised',{detail:{analyticsInstance:globalThis.rudderanalytics},bubbles:true,cancelable:true,composed:true});globalThis.document.dispatchEvent(initializedEvent);}/**
         * Emit ready event
         */ // eslint-disable-next-line class-methods-use-this
    },{key:"onReady",value:function onReady(){// Emit an event to use as substitute to the ready callback
            var readyEvent=new CustomEvent('RSA_Ready',{detail:{analyticsInstance:globalThis.rudderanalytics},bubbles:true,cancelable:true,composed:true});globalThis.document.dispatchEvent(readyEvent);}/**
         * Consume preloaded events buffer
         */},{key:"processBufferedEvents",value:function processBufferedEvents(){var _this3=this;// Process buffered events
            state.eventBuffer.toBeProcessedArray.value.forEach(function(bufferedItem){var methodName=bufferedItem[0];if(isFunction(_this3[methodName])){var _ref;(_ref=_this3)[methodName].apply(_ref,_toConsumableArray(bufferedItem.slice(1)));}});state.eventBuffer.toBeProcessedArray.value=[];}/**
         * Load device mode destinations
         */},{key:"loadDestinations",value:function loadDestinations(){var _this$pluginsManager3,_this$pluginsManager4;// Set in state the desired activeDestinations to inject in DOM
            (_this$pluginsManager3=this.pluginsManager)===null||_this$pluginsManager3===void 0?void 0:_this$pluginsManager3.invokeSingle('nativeDestinations.setActiveDestinations',state,this.pluginsManager,this.errorHandler,this.logger);var totalDestinationsToLoad=state.nativeDestinations.activeDestinations.value.length;if(totalDestinationsToLoad===0){state.lifecycle.status.value=LifecycleStatus.DestinationsReady;return;}// Start loading native integration scripts and create instances
            state.lifecycle.status.value=LifecycleStatus.DestinationsLoading;(_this$pluginsManager4=this.pluginsManager)===null||_this$pluginsManager4===void 0?void 0:_this$pluginsManager4.invokeSingle('nativeDestinations.load',state,this.externalSrcLoader,this.errorHandler,this.logger);// Progress to next lifecycle phase if all native destinations are initialized or failed
            b(function(){var areAllDestinationsReady=totalDestinationsToLoad===0||state.nativeDestinations.initializedDestinations.value.length+state.nativeDestinations.failedDestinations.value.length===totalDestinationsToLoad;if(areAllDestinationsReady){o(function(){state.lifecycle.status.value=LifecycleStatus.DestinationsReady;state.nativeDestinations.clientDestinationsReady.value=true;});}});}/**
         * Invoke the ready callbacks if any exist
         */ // eslint-disable-next-line class-methods-use-this
    },{key:"onDestinationsReady",value:function onDestinationsReady(){var _this4=this;state.eventBuffer.readyCallbacksArray.value.forEach(function(callback){try{callback();}catch(err){_this4.errorHandler.onError(err,ANALYTICS_CORE,READY_CALLBACK_INVOKE_ERROR);}});state.lifecycle.status.value=LifecycleStatus.Ready;}// End lifecycle methods
// Start consumer exposed methods
    },{key:"ready",value:function ready(callback){var type='ready';this.errorHandler.leaveBreadcrumb("New ".concat(type," invocation"));if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,callback]);return;}if(!isFunction(callback)){this.logger.error(READY_API_CALLBACK_ERROR(READY_API));return;}/**
         * If destinations are loaded or no integration is available for loading
         * execute the callback immediately else push the callbacks to a queue that
         * will be executed after loading completes
         */if(state.lifecycle.status.value===LifecycleStatus.Ready){try{callback();}catch(err){this.errorHandler.onError(err,ANALYTICS_CORE,READY_CALLBACK_INVOKE_ERROR);}}else {state.eventBuffer.readyCallbacksArray.value.push(callback);}}},{key:"page",value:function page(payload){var _this$eventManager2;var type='page';this.errorHandler.leaveBreadcrumb("New ".concat(type," event"));state.metrics.triggered.value+=1;if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,payload]);return;}(_this$eventManager2=this.eventManager)===null||_this$eventManager2===void 0?void 0:_this$eventManager2.addEvent({type:RudderEventType.Page,category:payload.category,name:payload.name,properties:payload.properties,options:payload.options,callback:payload.callback});// TODO: Maybe we should alter the behavior to send the ad-block page event even if the SDK is still loaded. It'll be pushed into the to be processed queue.
// Send automatic ad blocked page event if adblockers are detected on the page
// Check page category to avoid infinite loop
            if(state.capabilities.isAdBlocked.value===true&&payload.category!==ADBLOCK_PAGE_CATEGORY){var pageCallArgs={category:ADBLOCK_PAGE_CATEGORY,name:ADBLOCK_PAGE_NAME,properties:{// 'title' is intentionally omitted as it does not make sense
// in v3 implementation
                    path:ADBLOCK_PAGE_PATH},options:state.loadOptions.value.sendAdblockPageOptions};this.page(pageCallArgs);}}},{key:"track",value:function track(payload){var _this$eventManager3;var type='track';this.errorHandler.leaveBreadcrumb("New ".concat(type," event"));state.metrics.triggered.value+=1;if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,payload]);return;}(_this$eventManager3=this.eventManager)===null||_this$eventManager3===void 0?void 0:_this$eventManager3.addEvent({type:RudderEventType.Track,name:payload.name||undefined,properties:payload.properties,options:payload.options,callback:payload.callback});}},{key:"identify",value:function identify(payload){var _this$userSessionMana3,_this$eventManager4;var type='identify';this.errorHandler.leaveBreadcrumb("New ".concat(type," event"));state.metrics.triggered.value+=1;if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,payload]);return;}var shouldResetSession=Boolean(payload.userId&&state.session.userId.value&&payload.userId!==state.session.userId.value);if(shouldResetSession){this.reset();}// `null` value indicates that previous user ID needs to be retained
            if(!isNull(payload.userId)){var _this$userSessionMana2;(_this$userSessionMana2=this.userSessionManager)===null||_this$userSessionMana2===void 0?void 0:_this$userSessionMana2.setUserId(payload.userId);}(_this$userSessionMana3=this.userSessionManager)===null||_this$userSessionMana3===void 0?void 0:_this$userSessionMana3.setUserTraits(payload.traits);(_this$eventManager4=this.eventManager)===null||_this$eventManager4===void 0?void 0:_this$eventManager4.addEvent({type:RudderEventType.Identify,userId:payload.userId,traits:payload.traits,options:payload.options,callback:payload.callback});}},{key:"alias",value:function alias(payload){var _ref2,_payload$from,_this$userSessionMana4,_this$userSessionMana5,_this$eventManager5;var type='alias';this.errorHandler.leaveBreadcrumb("New ".concat(type," event"));state.metrics.triggered.value+=1;if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,payload]);return;}var previousId=(_ref2=(_payload$from=payload.from)!==null&&_payload$from!==void 0?_payload$from:(_this$userSessionMana4=this.userSessionManager)===null||_this$userSessionMana4===void 0?void 0:_this$userSessionMana4.getUserId())!==null&&_ref2!==void 0?_ref2:(_this$userSessionMana5=this.userSessionManager)===null||_this$userSessionMana5===void 0?void 0:_this$userSessionMana5.getAnonymousId();(_this$eventManager5=this.eventManager)===null||_this$eventManager5===void 0?void 0:_this$eventManager5.addEvent({type:RudderEventType.Alias,to:payload.to,from:previousId,options:payload.options,callback:payload.callback});}},{key:"group",value:function group(payload){var _this$userSessionMana7,_this$eventManager6;var type='group';this.errorHandler.leaveBreadcrumb("New ".concat(type," event"));state.metrics.triggered.value+=1;if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,payload]);return;}// `null` value indicates that previous group ID needs to be retained
            if(!isNull(payload.groupId)){var _this$userSessionMana6;(_this$userSessionMana6=this.userSessionManager)===null||_this$userSessionMana6===void 0?void 0:_this$userSessionMana6.setGroupId(payload.groupId);}(_this$userSessionMana7=this.userSessionManager)===null||_this$userSessionMana7===void 0?void 0:_this$userSessionMana7.setGroupTraits(payload.traits);(_this$eventManager6=this.eventManager)===null||_this$eventManager6===void 0?void 0:_this$eventManager6.addEvent({type:RudderEventType.Group,groupId:payload.groupId,traits:payload.traits,options:payload.options,callback:payload.callback});}},{key:"reset",value:function reset(resetAnonymousId){var _this$userSessionMana8;var type='reset';this.errorHandler.leaveBreadcrumb("New ".concat(type," invocation, resetAnonymousId: ").concat(resetAnonymousId));if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,resetAnonymousId]);return;}(_this$userSessionMana8=this.userSessionManager)===null||_this$userSessionMana8===void 0?void 0:_this$userSessionMana8.reset(resetAnonymousId);}},{key:"getAnonymousId",value:function getAnonymousId(options){var _this$userSessionMana9;return (_this$userSessionMana9=this.userSessionManager)===null||_this$userSessionMana9===void 0?void 0:_this$userSessionMana9.getAnonymousId(options);}},{key:"setAnonymousId",value:function setAnonymousId(anonymousId,rudderAmpLinkerParam){var _this$userSessionMana10;var type='setAnonymousId';// Buffering is needed as setting the anonymous ID may require invoking the GoogleLinker plugin
            if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,anonymousId,rudderAmpLinkerParam]);return;}(_this$userSessionMana10=this.userSessionManager)===null||_this$userSessionMana10===void 0?void 0:_this$userSessionMana10.setAnonymousId(anonymousId,rudderAmpLinkerParam);}// eslint-disable-next-line class-methods-use-this
    },{key:"getUserId",value:function getUserId(){return state.session.userId.value;}// eslint-disable-next-line class-methods-use-this
    },{key:"getUserTraits",value:function getUserTraits(){return state.session.userTraits.value;}// eslint-disable-next-line class-methods-use-this
    },{key:"getGroupId",value:function getGroupId(){return state.session.groupId.value;}// eslint-disable-next-line class-methods-use-this
    },{key:"getGroupTraits",value:function getGroupTraits(){return state.session.groupTraits.value;}},{key:"startSession",value:function startSession(sessionId){var _this$userSessionMana11;var type='startSession';this.errorHandler.leaveBreadcrumb("New ".concat(type," invocation"));if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,sessionId]);return;}(_this$userSessionMana11=this.userSessionManager)===null||_this$userSessionMana11===void 0?void 0:_this$userSessionMana11.start(sessionId);}},{key:"endSession",value:function endSession(){var _this$userSessionMana12;var type='endSession';this.errorHandler.leaveBreadcrumb("New ".concat(type," invocation"));if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type]);return;}(_this$userSessionMana12=this.userSessionManager)===null||_this$userSessionMana12===void 0?void 0:_this$userSessionMana12.end();}// eslint-disable-next-line class-methods-use-this
    },{key:"getSessionId",value:function getSessionId(){var _this$userSessionMana13,_state$session$sessio,_state$session$sessio2;(_this$userSessionMana13=this.userSessionManager)===null||_this$userSessionMana13===void 0?void 0:_this$userSessionMana13.refreshSession();return (_state$session$sessio=(_state$session$sessio2=state.session.sessionInfo.value)===null||_state$session$sessio2===void 0?void 0:_state$session$sessio2.id)!==null&&_state$session$sessio!==void 0?_state$session$sessio:null;}// End consumer exposed methods
    }]);return Analytics;}();

    /*
 * RudderAnalytics facade singleton that is exposed as global object and will:
 * expose overloaded methods
 * handle multiple Analytics instances
 * consume SDK preload event buffer
 */var RudderAnalytics=/*#__PURE__*/function(){// Singleton with constructor bind methods
        function RudderAnalytics(){_classCallCheck(this,RudderAnalytics);_defineProperty(this,"analyticsInstances",{});_defineProperty(this,"defaultAnalyticsKey",'');_defineProperty(this,"logger",defaultLogger);if(RudderAnalytics.globalSingleton){// START-NO-SONAR-SCAN
// eslint-disable-next-line no-constructor-return
            return RudderAnalytics.globalSingleton;// END-NO-SONAR-SCAN
        }this.setDefaultInstanceKey=this.setDefaultInstanceKey.bind(this);this.getAnalyticsInstance=this.getAnalyticsInstance.bind(this);this.load=this.load.bind(this);this.ready=this.ready.bind(this);this.getPreloadBuffer=this.getPreloadBuffer.bind(this);this.triggerBufferedLoadEvent=this.triggerBufferedLoadEvent.bind(this);this.page=this.page.bind(this);this.track=this.track.bind(this);this.identify=this.identify.bind(this);this.alias=this.alias.bind(this);this.group=this.group.bind(this);this.reset=this.reset.bind(this);this.getAnonymousId=this.getAnonymousId.bind(this);this.setAnonymousId=this.setAnonymousId.bind(this);this.getUserId=this.getUserId.bind(this);this.getUserTraits=this.getUserTraits.bind(this);this.getGroupId=this.getGroupId.bind(this);this.getGroupTraits=this.getGroupTraits.bind(this);this.startSession=this.startSession.bind(this);this.endSession=this.endSession.bind(this);this.getSessionId=this.getSessionId.bind(this);RudderAnalytics.globalSingleton=this;// get the preloaded events before replacing global object
            this.getPreloadBuffer();// start loading if a load event was buffered or wait for explicit load call
            this.triggerBufferedLoadEvent();}/**
         * Set instance to use if no specific writeKey is provided in methods
         * automatically for the first created instance
         * TODO: to support multiple analytics instances in the near future
         */_createClass(RudderAnalytics,[{key:"setDefaultInstanceKey",value:function setDefaultInstanceKey(writeKey){if(!isEmpty$1(this.analyticsInstances)){this.defaultAnalyticsKey=writeKey;}}/**
             * Retrieve an existing analytics instance
             */},{key:"getAnalyticsInstance",value:function getAnalyticsInstance(writeKey){var instanceId=writeKey!==null&&writeKey!==void 0?writeKey:this.defaultAnalyticsKey;var analyticsInstanceExists=Boolean(this.analyticsInstances[instanceId]);if(!analyticsInstanceExists){this.analyticsInstances[instanceId]=new Analytics();}return this.analyticsInstances[instanceId];}/**
             * Create new analytics instance and trigger application lifecycle start
             */},{key:"load",value:function load(writeKey,dataPlaneUrl,loadOptions){if(!isString(writeKey)){this.logger.error(WRITE_KEY_NOT_A_STRING_ERROR(RS_APP,writeKey));return;}if(this.analyticsInstances[writeKey]){return;}this.setDefaultInstanceKey(writeKey);this.analyticsInstances[writeKey]=new Analytics();this.getAnalyticsInstance(writeKey).load(writeKey,dataPlaneUrl,loadOptions);}/**
             * Get preloaded events in buffer queue if exists
             */ // eslint-disable-next-line class-methods-use-this
        },{key:"getPreloadBuffer",value:function getPreloadBuffer(){var preloadedEventsArray=Array.isArray(globalThis.rudderanalytics)?globalThis.rudderanalytics:[];// Expose buffer to global objects
                setExposedGlobal(GLOBAL_PRELOAD_BUFFER,clone$1(preloadedEventsArray));}/**
             * Trigger load event in buffer queue if exists
             */},{key:"triggerBufferedLoadEvent",value:function triggerBufferedLoadEvent(){var preloadedEventsArray=Array.isArray(globalThis.rudderanalytics)?globalThis.rudderanalytics:[];// Get any load method call that is buffered if any
                var loadEvent=getPreloadedLoadEvent(preloadedEventsArray);// Process load method if present in the buffered requests
                if(loadEvent.length>0){// Remove the event name from the Buffered Event array and keep only arguments
                    loadEvent.shift();// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
                    this.load.apply(null,loadEvent);}}/**
             * Get ready callback arguments and forward to ready call
             */},{key:"ready",value:function ready(callback){this.getAnalyticsInstance().ready(callback);}/**
             * Process page arguments and forward to page call
             */},{key:"page",value:function page(category,name,properties,options,callback){this.getAnalyticsInstance().page(pageArgumentsToCallOptions(category,name,properties,options,callback));}/**
             * Process track arguments and forward to page call
             */},{key:"track",value:function track(event,properties,options,callback){this.getAnalyticsInstance().track(trackArgumentsToCallOptions(event,properties,options,callback));}/**
             * Process identify arguments and forward to page call
             */},{key:"identify",value:function identify(userId,traits,options,callback){this.getAnalyticsInstance().identify(identifyArgumentsToCallOptions(userId,traits,options,callback));}/**
             * Process alias arguments and forward to page call
             */},{key:"alias",value:function alias(to,from,options,callback){this.getAnalyticsInstance().alias(aliasArgumentsToCallOptions(to,from,options,callback));}/**
             * Process group arguments and forward to page call
             */},{key:"group",value:function group(groupId,traits,options,callback){if(arguments.length===0){this.logger.error(EMPTY_GROUP_CALL_ERROR(RS_APP));return;}this.getAnalyticsInstance().group(groupArgumentsToCallOptions(groupId,traits,options,callback));}},{key:"reset",value:function reset(resetAnonymousId){this.getAnalyticsInstance().reset(resetAnonymousId);}},{key:"getAnonymousId",value:function getAnonymousId(options){return this.getAnalyticsInstance().getAnonymousId(options);}},{key:"setAnonymousId",value:function setAnonymousId(anonymousId,rudderAmpLinkerParam){this.getAnalyticsInstance().setAnonymousId(anonymousId,rudderAmpLinkerParam);}},{key:"getUserId",value:function getUserId(){return this.getAnalyticsInstance().getUserId();}},{key:"getUserTraits",value:function getUserTraits(){return this.getAnalyticsInstance().getUserTraits();}},{key:"getGroupId",value:function getGroupId(){return this.getAnalyticsInstance().getGroupId();}},{key:"getGroupTraits",value:function getGroupTraits(){return this.getAnalyticsInstance().getGroupTraits();}},{key:"startSession",value:function startSession(sessionId){return this.getAnalyticsInstance().startSession(sessionId);}},{key:"endSession",value:function endSession(){return this.getAnalyticsInstance().endSession();}},{key:"getSessionId",value:function getSessionId(){return this.getAnalyticsInstance().getSessionId();}}]);return RudderAnalytics;}();_defineProperty(RudderAnalytics,"globalSingleton",null);



    //=====================================================================================

    console.log("This prints to the console of the page (injected only if the page url matched)");

    const rudderanalytics = new RudderAnalytics();

    const initialiseRudderstack = () => {
        rudderanalytics.load(
          "<writeKey>",
          "<dataPlaneURL>",
          {
              integrations: {
                  All: false
              },
              plugins: [
                  'StorageEncryption',
                  'XhrQueue',
              ]
          }
        );

        rudderanalytics.ready(() => {
            console.log("we are all set!!!");
        });

        rudderanalytics.setDefaultInstanceKey("<writeKey>");
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
