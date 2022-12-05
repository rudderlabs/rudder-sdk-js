function ownKeys$1(object, enumerableOnly) {
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
        i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) {
            _defineProperty$1(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }

    return target;
}

function _regeneratorRuntime() {
    /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */

    _regeneratorRuntime = function () {
        return exports;
    };

    var exports = {},
        Op = Object.prototype,
        hasOwn = Op.hasOwnProperty,
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
        return generator._invoke = function (innerFn, self, context) {
            var state = "suspendedStart";
            return function (method, arg) {
                if ("executing" === state) throw new Error("Generator is already running");

                if ("completed" === state) {
                    if ("throw" === method) throw arg;
                    return doneResult();
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
        }(innerFn, self, context), generator;
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

        this._invoke = function (method, arg) {
            function callInvokeWithMethodAndArg() {
                return new PromiseImpl(function (resolve, reject) {
                    invoke(method, arg, resolve, reject);
                });
            }

            return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        };
    }

    function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];

        if (undefined === method) {
            if (context.delegate = null, "throw" === context.method) {
                if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
                context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
            }

            return ContinueSentinel;
        }

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
        if (iterable) {
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

        return {
            next: doneResult
        };
    }

    function doneResult() {
        return {
            value: undefined,
            done: !0
        };
    }

    return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
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
    }), exports.keys = function (object) {
        var keys = [];

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

function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) {
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

function _asyncToGenerator$1(fn) {
    return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args);

            function _next(value) {
                asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value);
            }

            function _throw(err) {
                asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err);
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

function _defineProperty$1(obj, key, value) {
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
var browser = true;
var env = {};
var argv = [];
var version$2 = ''; // empty string to avoid regexp issues

var versions = {};
var release = {};
var config = {};

function noop$1() {}

var on = noop$1;
var addListener = noop$1;
var once = noop$1;
var off = noop$1;
var removeListener = noop$1;
var removeAllListeners = noop$1;
var emit = noop$1;
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

var performance = global$1.performance || {};

var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
    return new Date().getTime();
}; // generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime


function hrtime(previousTimestamp) {
    var clocktime = performanceNow.call(performance) * 1e-3;
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
    browser: browser,
    env: env,
    argv: argv,
    version: version$2,
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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

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

var buffer = {};

var base64Js = {};

base64Js.byteLength = byteLength$1;
base64Js.toByteArray = toByteArray$1;
base64Js.fromByteArray = fromByteArray$1;
var lookup$1 = [];
var revLookup$1 = [];
var Arr$1 = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

for (var i$1 = 0, len = code.length; i$1 < len; ++i$1) {
    lookup$1[i$1] = code[i$1];
    revLookup$1[code.charCodeAt(i$1)] = i$1;
} // Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications


revLookup$1['-'.charCodeAt(0)] = 62;
revLookup$1['_'.charCodeAt(0)] = 63;

function getLens(b64) {
    var len = b64.length;

    if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4');
    } // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42


    var validLen = b64.indexOf('=');
    if (validLen === -1) validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [validLen, placeHoldersLen];
} // base64 is 4/3 + up to two characters of the original data


function byteLength$1(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function toByteArray$1(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr$1(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0; // if there are placeholders, only get up to the last complete 4 chars

    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i;

    for (i = 0; i < len; i += 4) {
        tmp = revLookup$1[b64.charCodeAt(i)] << 18 | revLookup$1[b64.charCodeAt(i + 1)] << 12 | revLookup$1[b64.charCodeAt(i + 2)] << 6 | revLookup$1[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 0xFF;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }

    if (placeHoldersLen === 2) {
        tmp = revLookup$1[b64.charCodeAt(i)] << 2 | revLookup$1[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = tmp & 0xFF;
    }

    if (placeHoldersLen === 1) {
        tmp = revLookup$1[b64.charCodeAt(i)] << 10 | revLookup$1[b64.charCodeAt(i + 1)] << 4 | revLookup$1[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }

    return arr;
}

function tripletToBase64$1(num) {
    return lookup$1[num >> 18 & 0x3F] + lookup$1[num >> 12 & 0x3F] + lookup$1[num >> 6 & 0x3F] + lookup$1[num & 0x3F];
}

function encodeChunk$1(uint8, start, end) {
    var tmp;
    var output = [];

    for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
        output.push(tripletToBase64$1(tmp));
    }

    return output.join('');
}

function fromByteArray$1(uint8) {
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

    var parts = [];
    var maxChunkLength = 16383; // must be multiple of 3
    // go through the array every three bytes, we'll deal with trailing stuff later

    for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
        parts.push(encodeChunk$1(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    } // pad the end with zeros, but make sure to not forget the extra bytes


    if (extraBytes === 1) {
        tmp = uint8[len - 1];
        parts.push(lookup$1[tmp >> 2] + lookup$1[tmp << 4 & 0x3F] + '==');
    } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup$1[tmp >> 10] + lookup$1[tmp >> 4 & 0x3F] + lookup$1[tmp << 2 & 0x3F] + '=');
    }

    return parts.join('');
}

var ieee754 = {};

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */

ieee754.read = function (buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;

    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;

    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    if (e === 0) {
        e = 1 - eBias;
    } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
    }

    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

ieee754.write = function (buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);

    if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
    } else {
        e = Math.floor(Math.log(value) / Math.LN2);

        if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
        }

        if (e + eBias >= 1) {
            value += rt / c;
        } else {
            value += rt * Math.pow(2, 1 - eBias);
        }

        if (value * c >= 2) {
            e++;
            c /= 2;
        }

        if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
        } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
        } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
        }
    }

    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

    e = e << mLen | m;
    eLen += mLen;

    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

    buffer[offset + i - d] |= s * 128;
};

(function (exports) {

    var base64 = base64Js;
    var ieee754$1 = ieee754;
    var customInspectSymbol = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' // eslint-disable-line dot-notation
        ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
        : null;
    exports.Buffer = Buffer;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 0x7fffffff;
    exports.kMaxLength = K_MAX_LENGTH;
    /**
     * If `Buffer.TYPED_ARRAY_SUPPORT`:
     *   === true    Use Uint8Array implementation (fastest)
     *   === false   Print warning and recommend using `buffer` v4.x which has an Object
     *               implementation (most compatible, even IE6)
     *
     * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
     * Opera 11.6+, iOS 4.2+.
     *
     * We report that the browser does not support typed arrays if the are not subclassable
     * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
     * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
     * for __proto__ and has a buggy typed array implementation.
     */

    Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

    if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') {
        console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.');
    }

    function typedArraySupport() {
        // Can typed array instances can be augmented?
        try {
            var arr = new Uint8Array(1);
            var proto = {
                foo: function foo() {
                    return 42;
                }
            };
            Object.setPrototypeOf(proto, Uint8Array.prototype);
            Object.setPrototypeOf(arr, proto);
            return arr.foo() === 42;
        } catch (e) {
            return false;
        }
    }

    Object.defineProperty(Buffer.prototype, 'parent', {
        enumerable: true,
        get: function get() {
            if (!Buffer.isBuffer(this)) return undefined;
            return this.buffer;
        }
    });
    Object.defineProperty(Buffer.prototype, 'offset', {
        enumerable: true,
        get: function get() {
            if (!Buffer.isBuffer(this)) return undefined;
            return this.byteOffset;
        }
    });

    function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
            throw new RangeError('The value "' + length + '" is invalid for option "size"');
        } // Return an augmented `Uint8Array` instance


        var buf = new Uint8Array(length);
        Object.setPrototypeOf(buf, Buffer.prototype);
        return buf;
    }
    /**
     * The Buffer constructor returns instances of `Uint8Array` that have their
     * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
     * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
     * and the `Uint8Array` methods. Square bracket notation works as expected -- it
     * returns a single octet.
     *
     * The `Uint8Array` prototype remains unmodified.
     */


    function Buffer(arg, encodingOrOffset, length) {
        // Common case.
        if (typeof arg === 'number') {
            if (typeof encodingOrOffset === 'string') {
                throw new TypeError('The "string" argument must be of type string. Received type number');
            }

            return allocUnsafe(arg);
        }

        return from(arg, encodingOrOffset, length);
    }

    Buffer.poolSize = 8192; // not used by this implementation

    function from(value, encodingOrOffset, length) {
        if (typeof value === 'string') {
            return fromString(value, encodingOrOffset);
        }

        if (ArrayBuffer.isView(value)) {
            return fromArrayView(value);
        }

        if (value == null) {
            throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + _typeof(value));
        }

        if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
            return fromArrayBuffer(value, encodingOrOffset, length);
        }

        if (typeof SharedArrayBuffer !== 'undefined' && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
            return fromArrayBuffer(value, encodingOrOffset, length);
        }

        if (typeof value === 'number') {
            throw new TypeError('The "value" argument must not be of type number. Received type number');
        }

        var valueOf = value.valueOf && value.valueOf();

        if (valueOf != null && valueOf !== value) {
            return Buffer.from(valueOf, encodingOrOffset, length);
        }

        var b = fromObject(value);
        if (b) return b;

        if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === 'function') {
            return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length);
        }

        throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' + 'or Array-like Object. Received type ' + _typeof(value));
    }
    /**
     * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
     * if value is a number.
     * Buffer.from(str[, encoding])
     * Buffer.from(array)
     * Buffer.from(buffer)
     * Buffer.from(arrayBuffer[, byteOffset[, length]])
     **/


    Buffer.from = function (value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
    }; // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
    // https://github.com/feross/buffer/pull/148


    Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer, Uint8Array);

    function assertSize(size) {
        if (typeof size !== 'number') {
            throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
            throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
    }

    function alloc(size, fill, encoding) {
        assertSize(size);

        if (size <= 0) {
            return createBuffer(size);
        }

        if (fill !== undefined) {
            // Only pay attention to encoding if it's a string. This
            // prevents accidentally sending in a number that would
            // be interpreted as a start offset.
            return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }

        return createBuffer(size);
    }
    /**
     * Creates a new filled Buffer instance.
     * alloc(size[, fill[, encoding]])
     **/


    Buffer.alloc = function (size, fill, encoding) {
        return alloc(size, fill, encoding);
    };

    function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    /**
     * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
     * */


    Buffer.allocUnsafe = function (size) {
        return allocUnsafe(size);
    };
    /**
     * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
     */


    Buffer.allocUnsafeSlow = function (size) {
        return allocUnsafe(size);
    };

    function fromString(string, encoding) {
        if (typeof encoding !== 'string' || encoding === '') {
            encoding = 'utf8';
        }

        if (!Buffer.isEncoding(encoding)) {
            throw new TypeError('Unknown encoding: ' + encoding);
        }

        var length = byteLength(string, encoding) | 0;
        var buf = createBuffer(length);
        var actual = buf.write(string, encoding);

        if (actual !== length) {
            // Writing a hex string, for example, that contains invalid characters will
            // cause everything after the first invalid character to be ignored. (e.g.
            // 'abxxcd' will be treated as 'ab')
            buf = buf.slice(0, actual);
        }

        return buf;
    }

    function fromArrayLike(array) {
        var length = array.length < 0 ? 0 : checked(array.length) | 0;
        var buf = createBuffer(length);

        for (var i = 0; i < length; i += 1) {
            buf[i] = array[i] & 255;
        }

        return buf;
    }

    function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
            var copy = new Uint8Array(arrayView);
            return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }

        return fromArrayLike(arrayView);
    }

    function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
            throw new RangeError('"offset" is outside of buffer bounds');
        }

        if (array.byteLength < byteOffset + (length || 0)) {
            throw new RangeError('"length" is outside of buffer bounds');
        }

        var buf;

        if (byteOffset === undefined && length === undefined) {
            buf = new Uint8Array(array);
        } else if (length === undefined) {
            buf = new Uint8Array(array, byteOffset);
        } else {
            buf = new Uint8Array(array, byteOffset, length);
        } // Return an augmented `Uint8Array` instance


        Object.setPrototypeOf(buf, Buffer.prototype);
        return buf;
    }

    function fromObject(obj) {
        if (Buffer.isBuffer(obj)) {
            var len = checked(obj.length) | 0;
            var buf = createBuffer(len);

            if (buf.length === 0) {
                return buf;
            }

            obj.copy(buf, 0, 0, len);
            return buf;
        }

        if (obj.length !== undefined) {
            if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
                return createBuffer(0);
            }

            return fromArrayLike(obj);
        }

        if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
            return fromArrayLike(obj.data);
        }
    }

    function checked(length) {
        // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
        // length is NaN (which is otherwise coerced to zero.)
        if (length >= K_MAX_LENGTH) {
            throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
        }

        return length | 0;
    }

    function SlowBuffer(length) {
        if (+length != length) {
            // eslint-disable-line eqeqeq
            length = 0;
        }

        return Buffer.alloc(+length);
    }

    Buffer.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer.prototype; // so Buffer.isBuffer(Buffer.prototype) will be false
    };

    Buffer.compare = function compare(a, b) {
        if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
        if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);

        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
            throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
        }

        if (a === b) return 0;
        var x = a.length;
        var y = b.length;

        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
            if (a[i] !== b[i]) {
                x = a[i];
                y = b[i];
                break;
            }
        }

        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
    };

    Buffer.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
            case 'hex':
            case 'utf8':
            case 'utf-8':
            case 'ascii':
            case 'latin1':
            case 'binary':
            case 'base64':
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return true;

            default:
                return false;
        }
    };

    Buffer.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
        }

        if (list.length === 0) {
            return Buffer.alloc(0);
        }

        var i;

        if (length === undefined) {
            length = 0;

            for (i = 0; i < list.length; ++i) {
                length += list[i].length;
            }
        }

        var buffer = Buffer.allocUnsafe(length);
        var pos = 0;

        for (i = 0; i < list.length; ++i) {
            var buf = list[i];

            if (isInstance(buf, Uint8Array)) {
                if (pos + buf.length > buffer.length) {
                    Buffer.from(buf).copy(buffer, pos);
                } else {
                    Uint8Array.prototype.set.call(buffer, buf, pos);
                }
            } else if (!Buffer.isBuffer(buf)) {
                throw new TypeError('"list" argument must be an Array of Buffers');
            } else {
                buf.copy(buffer, pos);
            }

            pos += buf.length;
        }

        return buffer;
    };

    function byteLength(string, encoding) {
        if (Buffer.isBuffer(string)) {
            return string.length;
        }

        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
            return string.byteLength;
        }

        if (typeof string !== 'string') {
            throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + 'Received type ' + _typeof(string));
        }

        var len = string.length;
        var mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0) return 0; // Use a for loop to avoid recursion

        var loweredCase = false;

        for (;;) {
            switch (encoding) {
                case 'ascii':
                case 'latin1':
                case 'binary':
                    return len;

                case 'utf8':
                case 'utf-8':
                    return utf8ToBytes(string).length;

                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                    return len * 2;

                case 'hex':
                    return len >>> 1;

                case 'base64':
                    return base64ToBytes(string).length;

                default:
                    if (loweredCase) {
                        return mustMatch ? -1 : utf8ToBytes(string).length; // assume utf8
                    }

                    encoding = ('' + encoding).toLowerCase();
                    loweredCase = true;
            }
        }
    }

    Buffer.byteLength = byteLength;

    function slowToString(encoding, start, end) {
        var loweredCase = false; // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
        // property of a typed array.
        // This behaves neither like String nor Uint8Array in that we set start/end
        // to their upper/lower bounds if the value passed is out of range.
        // undefined is handled specially as per ECMA-262 6th Edition,
        // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.

        if (start === undefined || start < 0) {
            start = 0;
        } // Return early if start > this.length. Done here to prevent potential uint32
        // coercion fail below.


        if (start > this.length) {
            return '';
        }

        if (end === undefined || end > this.length) {
            end = this.length;
        }

        if (end <= 0) {
            return '';
        } // Force coercion to uint32. This will also coerce falsey/NaN values to 0.


        end >>>= 0;
        start >>>= 0;

        if (end <= start) {
            return '';
        }

        if (!encoding) encoding = 'utf8';

        while (true) {
            switch (encoding) {
                case 'hex':
                    return hexSlice(this, start, end);

                case 'utf8':
                case 'utf-8':
                    return utf8Slice(this, start, end);

                case 'ascii':
                    return asciiSlice(this, start, end);

                case 'latin1':
                case 'binary':
                    return latin1Slice(this, start, end);

                case 'base64':
                    return base64Slice(this, start, end);

                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                    return utf16leSlice(this, start, end);

                default:
                    if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
                    encoding = (encoding + '').toLowerCase();
                    loweredCase = true;
            }
        }
    } // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
    // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
    // reliably in a browserify context because there could be multiple different
    // copies of the 'buffer' package in use. This method works even for Buffer
    // instances that were created from another copy of the `buffer` package.
    // See: https://github.com/feross/buffer/issues/154


    Buffer.prototype._isBuffer = true;

    function swap(b, n, m) {
        var i = b[n];
        b[n] = b[m];
        b[m] = i;
    }

    Buffer.prototype.swap16 = function swap16() {
        var len = this.length;

        if (len % 2 !== 0) {
            throw new RangeError('Buffer size must be a multiple of 16-bits');
        }

        for (var i = 0; i < len; i += 2) {
            swap(this, i, i + 1);
        }

        return this;
    };

    Buffer.prototype.swap32 = function swap32() {
        var len = this.length;

        if (len % 4 !== 0) {
            throw new RangeError('Buffer size must be a multiple of 32-bits');
        }

        for (var i = 0; i < len; i += 4) {
            swap(this, i, i + 3);
            swap(this, i + 1, i + 2);
        }

        return this;
    };

    Buffer.prototype.swap64 = function swap64() {
        var len = this.length;

        if (len % 8 !== 0) {
            throw new RangeError('Buffer size must be a multiple of 64-bits');
        }

        for (var i = 0; i < len; i += 8) {
            swap(this, i, i + 7);
            swap(this, i + 1, i + 6);
            swap(this, i + 2, i + 5);
            swap(this, i + 3, i + 4);
        }

        return this;
    };

    Buffer.prototype.toString = function toString() {
        var length = this.length;
        if (length === 0) return '';
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
    };

    Buffer.prototype.toLocaleString = Buffer.prototype.toString;

    Buffer.prototype.equals = function equals(b) {
        if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
        if (this === b) return true;
        return Buffer.compare(this, b) === 0;
    };

    Buffer.prototype.inspect = function inspect() {
        var str = '';
        var max = exports.INSPECT_MAX_BYTES;
        str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
        if (this.length > max) str += ' ... ';
        return '<Buffer ' + str + '>';
    };

    if (customInspectSymbol) {
        Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
    }

    Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
            target = Buffer.from(target, target.offset, target.byteLength);
        }

        if (!Buffer.isBuffer(target)) {
            throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + 'Received type ' + _typeof(target));
        }

        if (start === undefined) {
            start = 0;
        }

        if (end === undefined) {
            end = target ? target.length : 0;
        }

        if (thisStart === undefined) {
            thisStart = 0;
        }

        if (thisEnd === undefined) {
            thisEnd = this.length;
        }

        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
            throw new RangeError('out of range index');
        }

        if (thisStart >= thisEnd && start >= end) {
            return 0;
        }

        if (thisStart >= thisEnd) {
            return -1;
        }

        if (start >= end) {
            return 1;
        }

        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        var x = thisEnd - thisStart;
        var y = end - start;
        var len = Math.min(x, y);
        var thisCopy = this.slice(thisStart, thisEnd);
        var targetCopy = target.slice(start, end);

        for (var i = 0; i < len; ++i) {
            if (thisCopy[i] !== targetCopy[i]) {
                x = thisCopy[i];
                y = targetCopy[i];
                break;
            }
        }

        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
    }; // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
    // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
    //
    // Arguments:
    // - buffer - a Buffer to search
    // - val - a string, Buffer, or number
    // - byteOffset - an index into `buffer`; will be clamped to an int32
    // - encoding - an optional encoding, relevant is val is a string
    // - dir - true for indexOf, false for lastIndexOf


    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        // Empty buffer means no match
        if (buffer.length === 0) return -1; // Normalize byteOffset

        if (typeof byteOffset === 'string') {
            encoding = byteOffset;
            byteOffset = 0;
        } else if (byteOffset > 0x7fffffff) {
            byteOffset = 0x7fffffff;
        } else if (byteOffset < -0x80000000) {
            byteOffset = -0x80000000;
        }

        byteOffset = +byteOffset; // Coerce to Number.

        if (numberIsNaN(byteOffset)) {
            // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
            byteOffset = dir ? 0 : buffer.length - 1;
        } // Normalize byteOffset: negative offsets start from the end of the buffer


        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;

        if (byteOffset >= buffer.length) {
            if (dir) return -1;else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
            if (dir) byteOffset = 0;else return -1;
        } // Normalize val


        if (typeof val === 'string') {
            val = Buffer.from(val, encoding);
        } // Finally, search either indexOf (if dir is true) or lastIndexOf


        if (Buffer.isBuffer(val)) {
            // Special case: looking for empty string/buffer always fails
            if (val.length === 0) {
                return -1;
            }

            return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === 'number') {
            val = val & 0xFF; // Search for a byte value [0-255]

            if (typeof Uint8Array.prototype.indexOf === 'function') {
                if (dir) {
                    return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
                } else {
                    return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
                }
            }

            return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }

        throw new TypeError('val must be string, number or Buffer');
    }

    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        var indexSize = 1;
        var arrLength = arr.length;
        var valLength = val.length;

        if (encoding !== undefined) {
            encoding = String(encoding).toLowerCase();

            if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
                if (arr.length < 2 || val.length < 2) {
                    return -1;
                }

                indexSize = 2;
                arrLength /= 2;
                valLength /= 2;
                byteOffset /= 2;
            }
        }

        function read(buf, i) {
            if (indexSize === 1) {
                return buf[i];
            } else {
                return buf.readUInt16BE(i * indexSize);
            }
        }

        var i;

        if (dir) {
            var foundIndex = -1;

            for (i = byteOffset; i < arrLength; i++) {
                if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                    if (foundIndex === -1) foundIndex = i;
                    if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
                } else {
                    if (foundIndex !== -1) i -= i - foundIndex;
                    foundIndex = -1;
                }
            }
        } else {
            if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;

            for (i = byteOffset; i >= 0; i--) {
                var found = true;

                for (var j = 0; j < valLength; j++) {
                    if (read(arr, i + j) !== read(val, j)) {
                        found = false;
                        break;
                    }
                }

                if (found) return i;
            }
        }

        return -1;
    }

    Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
    };

    Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };

    Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };

    function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        var remaining = buf.length - offset;

        if (!length) {
            length = remaining;
        } else {
            length = Number(length);

            if (length > remaining) {
                length = remaining;
            }
        }

        var strLen = string.length;

        if (length > strLen / 2) {
            length = strLen / 2;
        }

        for (var i = 0; i < length; ++i) {
            var parsed = parseInt(string.substr(i * 2, 2), 16);
            if (numberIsNaN(parsed)) return i;
            buf[offset + i] = parsed;
        }

        return i;
    }

    function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }

    function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
    }

    function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
    }

    function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }

    Buffer.prototype.write = function write(string, offset, length, encoding) {
        // Buffer#write(string)
        if (offset === undefined) {
            encoding = 'utf8';
            length = this.length;
            offset = 0; // Buffer#write(string, encoding)
        } else if (length === undefined && typeof offset === 'string') {
            encoding = offset;
            length = this.length;
            offset = 0; // Buffer#write(string, offset[, length][, encoding])
        } else if (isFinite(offset)) {
            offset = offset >>> 0;

            if (isFinite(length)) {
                length = length >>> 0;
                if (encoding === undefined) encoding = 'utf8';
            } else {
                encoding = length;
                length = undefined;
            }
        } else {
            throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
        }

        var remaining = this.length - offset;
        if (length === undefined || length > remaining) length = remaining;

        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
            throw new RangeError('Attempt to write outside buffer bounds');
        }

        if (!encoding) encoding = 'utf8';
        var loweredCase = false;

        for (;;) {
            switch (encoding) {
                case 'hex':
                    return hexWrite(this, string, offset, length);

                case 'utf8':
                case 'utf-8':
                    return utf8Write(this, string, offset, length);

                case 'ascii':
                case 'latin1':
                case 'binary':
                    return asciiWrite(this, string, offset, length);

                case 'base64':
                    // Warning: maxLength not taken into account in base64Write
                    return base64Write(this, string, offset, length);

                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                    return ucs2Write(this, string, offset, length);

                default:
                    if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
                    encoding = ('' + encoding).toLowerCase();
                    loweredCase = true;
            }
        }
    };

    Buffer.prototype.toJSON = function toJSON() {
        return {
            type: 'Buffer',
            data: Array.prototype.slice.call(this._arr || this, 0)
        };
    };

    function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
            return base64.fromByteArray(buf);
        } else {
            return base64.fromByteArray(buf.slice(start, end));
        }
    }

    function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        var res = [];
        var i = start;

        while (i < end) {
            var firstByte = buf[i];
            var codePoint = null;
            var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

            if (i + bytesPerSequence <= end) {
                var secondByte, thirdByte, fourthByte, tempCodePoint;

                switch (bytesPerSequence) {
                    case 1:
                        if (firstByte < 0x80) {
                            codePoint = firstByte;
                        }

                        break;

                    case 2:
                        secondByte = buf[i + 1];

                        if ((secondByte & 0xC0) === 0x80) {
                            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;

                            if (tempCodePoint > 0x7F) {
                                codePoint = tempCodePoint;
                            }
                        }

                        break;

                    case 3:
                        secondByte = buf[i + 1];
                        thirdByte = buf[i + 2];

                        if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;

                            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                                codePoint = tempCodePoint;
                            }
                        }

                        break;

                    case 4:
                        secondByte = buf[i + 1];
                        thirdByte = buf[i + 2];
                        fourthByte = buf[i + 3];

                        if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;

                            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                                codePoint = tempCodePoint;
                            }
                        }

                }
            }

            if (codePoint === null) {
                // we did not generate a valid codePoint so insert a
                // replacement char (U+FFFD) and advance only 1 byte
                codePoint = 0xFFFD;
                bytesPerSequence = 1;
            } else if (codePoint > 0xFFFF) {
                // encode to utf16 (surrogate pair dance)
                codePoint -= 0x10000;
                res.push(codePoint >>> 10 & 0x3FF | 0xD800);
                codePoint = 0xDC00 | codePoint & 0x3FF;
            }

            res.push(codePoint);
            i += bytesPerSequence;
        }

        return decodeCodePointsArray(res);
    } // Based on http://stackoverflow.com/a/22747272/680742, the browser with
    // the lowest limit is Chrome, with 0x10000 args.
    // We go 1 magnitude less, for safety


    var MAX_ARGUMENTS_LENGTH = 0x1000;

    function decodeCodePointsArray(codePoints) {
        var len = codePoints.length;

        if (len <= MAX_ARGUMENTS_LENGTH) {
            return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
        } // Decode in chunks to avoid "call stack size exceeded".


        var res = '';
        var i = 0;

        while (i < len) {
            res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
        }

        return res;
    }

    function asciiSlice(buf, start, end) {
        var ret = '';
        end = Math.min(buf.length, end);

        for (var i = start; i < end; ++i) {
            ret += String.fromCharCode(buf[i] & 0x7F);
        }

        return ret;
    }

    function latin1Slice(buf, start, end) {
        var ret = '';
        end = Math.min(buf.length, end);

        for (var i = start; i < end; ++i) {
            ret += String.fromCharCode(buf[i]);
        }

        return ret;
    }

    function hexSlice(buf, start, end) {
        var len = buf.length;
        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;
        var out = '';

        for (var i = start; i < end; ++i) {
            out += hexSliceLookupTable[buf[i]];
        }

        return out;
    }

    function utf16leSlice(buf, start, end) {
        var bytes = buf.slice(start, end);
        var res = ''; // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)

        for (var i = 0; i < bytes.length - 1; i += 2) {
            res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }

        return res;
    }

    Buffer.prototype.slice = function slice(start, end) {
        var len = this.length;
        start = ~~start;
        end = end === undefined ? len : ~~end;

        if (start < 0) {
            start += len;
            if (start < 0) start = 0;
        } else if (start > len) {
            start = len;
        }

        if (end < 0) {
            end += len;
            if (end < 0) end = 0;
        } else if (end > len) {
            end = len;
        }

        if (end < start) end = start;
        var newBuf = this.subarray(start, end); // Return an augmented `Uint8Array` instance

        Object.setPrototypeOf(newBuf, Buffer.prototype);
        return newBuf;
    };
    /*
   * Need to make sure that buffer isn't trying to write out of bounds.
   */


    function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
        if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
    }

    Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
        offset = offset >>> 0;
        byteLength = byteLength >>> 0;
        if (!noAssert) checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;

        while (++i < byteLength && (mul *= 0x100)) {
            val += this[offset + i] * mul;
        }

        return val;
    };

    Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
        offset = offset >>> 0;
        byteLength = byteLength >>> 0;

        if (!noAssert) {
            checkOffset(offset, byteLength, this.length);
        }

        var val = this[offset + --byteLength];
        var mul = 1;

        while (byteLength > 0 && (mul *= 0x100)) {
            val += this[offset + --byteLength] * mul;
        }

        return val;
    };

    Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
    };

    Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
    };

    Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
    };

    Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
    };

    Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };

    Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
        offset = offset >>> 0;
        byteLength = byteLength >>> 0;
        if (!noAssert) checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;

        while (++i < byteLength && (mul *= 0x100)) {
            val += this[offset + i] * mul;
        }

        mul *= 0x80;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength);
        return val;
    };

    Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
        offset = offset >>> 0;
        byteLength = byteLength >>> 0;
        if (!noAssert) checkOffset(offset, byteLength, this.length);
        var i = byteLength;
        var mul = 1;
        var val = this[offset + --i];

        while (i > 0 && (mul *= 0x100)) {
            val += this[offset + --i] * mul;
        }

        mul *= 0x80;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength);
        return val;
    };

    Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 0x80)) return this[offset];
        return (0xff - this[offset] + 1) * -1;
    };

    Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        var val = this[offset] | this[offset + 1] << 8;
        return val & 0x8000 ? val | 0xFFFF0000 : val;
    };

    Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        var val = this[offset + 1] | this[offset] << 8;
        return val & 0x8000 ? val | 0xFFFF0000 : val;
    };

    Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };

    Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };

    Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754$1.read(this, offset, true, 23, 4);
    };

    Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754$1.read(this, offset, false, 23, 4);
    };

    Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754$1.read(this, offset, true, 52, 8);
    };

    Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754$1.read(this, offset, false, 52, 8);
    };

    function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError('Index out of range');
    }

    Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength = byteLength >>> 0;

        if (!noAssert) {
            var maxBytes = Math.pow(2, 8 * byteLength) - 1;
            checkInt(this, value, offset, byteLength, maxBytes, 0);
        }

        var mul = 1;
        var i = 0;
        this[offset] = value & 0xFF;

        while (++i < byteLength && (mul *= 0x100)) {
            this[offset + i] = value / mul & 0xFF;
        }

        return offset + byteLength;
    };

    Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength = byteLength >>> 0;

        if (!noAssert) {
            var maxBytes = Math.pow(2, 8 * byteLength) - 1;
            checkInt(this, value, offset, byteLength, maxBytes, 0);
        }

        var i = byteLength - 1;
        var mul = 1;
        this[offset + i] = value & 0xFF;

        while (--i >= 0 && (mul *= 0x100)) {
            this[offset + i] = value / mul & 0xFF;
        }

        return offset + byteLength;
    };

    Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
        this[offset] = value & 0xff;
        return offset + 1;
    };

    Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
        this[offset] = value & 0xff;
        this[offset + 1] = value >>> 8;
        return offset + 2;
    };

    Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 0xff;
        return offset + 2;
    };

    Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 0xff;
        return offset + 4;
    };

    Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 0xff;
        return offset + 4;
    };

    Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset >>> 0;

        if (!noAssert) {
            var limit = Math.pow(2, 8 * byteLength - 1);
            checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }

        var i = 0;
        var mul = 1;
        var sub = 0;
        this[offset] = value & 0xFF;

        while (++i < byteLength && (mul *= 0x100)) {
            if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                sub = 1;
            }

            this[offset + i] = (value / mul >> 0) - sub & 0xFF;
        }

        return offset + byteLength;
    };

    Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset >>> 0;

        if (!noAssert) {
            var limit = Math.pow(2, 8 * byteLength - 1);
            checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }

        var i = byteLength - 1;
        var mul = 1;
        var sub = 0;
        this[offset + i] = value & 0xFF;

        while (--i >= 0 && (mul *= 0x100)) {
            if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                sub = 1;
            }

            this[offset + i] = (value / mul >> 0) - sub & 0xFF;
        }

        return offset + byteLength;
    };

    Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
        if (value < 0) value = 0xff + value + 1;
        this[offset] = value & 0xff;
        return offset + 1;
    };

    Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
        this[offset] = value & 0xff;
        this[offset + 1] = value >>> 8;
        return offset + 2;
    };

    Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 0xff;
        return offset + 2;
    };

    Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
        this[offset] = value & 0xff;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
    };

    Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
        if (value < 0) value = 0xffffffff + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 0xff;
        return offset + 4;
    };

    function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError('Index out of range');
        if (offset < 0) throw new RangeError('Index out of range');
    }

    function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;

        if (!noAssert) {
            checkIEEE754(buf, value, offset, 4);
        }

        ieee754$1.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
    }

    Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
    };

    Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
    };

    function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;

        if (!noAssert) {
            checkIEEE754(buf, value, offset, 8);
        }

        ieee754$1.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
    }

    Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
    };

    Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
    }; // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)


    Buffer.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer');
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

        if (targetStart < 0) {
            throw new RangeError('targetStart out of bounds');
        }

        if (start < 0 || start >= this.length) throw new RangeError('Index out of range');
        if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

        if (end > this.length) end = this.length;

        if (target.length - targetStart < end - start) {
            end = target.length - targetStart + start;
        }

        var len = end - start;

        if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
            // Use built-in when available, missing from IE11
            this.copyWithin(targetStart, start, end);
        } else {
            Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
        }

        return len;
    }; // Usage:
    //    buffer.fill(number[, offset[, end]])
    //    buffer.fill(buffer[, offset[, end]])
    //    buffer.fill(string[, offset[, end]][, encoding])


    Buffer.prototype.fill = function fill(val, start, end, encoding) {
        // Handle string cases:
        if (typeof val === 'string') {
            if (typeof start === 'string') {
                encoding = start;
                start = 0;
                end = this.length;
            } else if (typeof end === 'string') {
                encoding = end;
                end = this.length;
            }

            if (encoding !== undefined && typeof encoding !== 'string') {
                throw new TypeError('encoding must be a string');
            }

            if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
                throw new TypeError('Unknown encoding: ' + encoding);
            }

            if (val.length === 1) {
                var code = val.charCodeAt(0);

                if (encoding === 'utf8' && code < 128 || encoding === 'latin1') {
                    // Fast path: If `val` fits into a single byte, use that numeric value.
                    val = code;
                }
            }
        } else if (typeof val === 'number') {
            val = val & 255;
        } else if (typeof val === 'boolean') {
            val = Number(val);
        } // Invalid ranges are not set to a default, so can range check early.


        if (start < 0 || this.length < start || this.length < end) {
            throw new RangeError('Out of range index');
        }

        if (end <= start) {
            return this;
        }

        start = start >>> 0;
        end = end === undefined ? this.length : end >>> 0;
        if (!val) val = 0;
        var i;

        if (typeof val === 'number') {
            for (i = start; i < end; ++i) {
                this[i] = val;
            }
        } else {
            var bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
            var len = bytes.length;

            if (len === 0) {
                throw new TypeError('The value "' + val + '" is invalid for argument "value"');
            }

            for (i = 0; i < end - start; ++i) {
                this[i + start] = bytes[i % len];
            }
        }

        return this;
    }; // HELPER FUNCTIONS
    // ================


    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

    function base64clean(str) {
        // Node takes equal signs as end of the Base64 encoding
        str = str.split('=')[0]; // Node strips out invalid characters like \n and \t from the string, base64-js does not

        str = str.trim().replace(INVALID_BASE64_RE, ''); // Node converts strings with length < 2 to ''

        if (str.length < 2) return ''; // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not

        while (str.length % 4 !== 0) {
            str = str + '=';
        }

        return str;
    }

    function utf8ToBytes(string, units) {
        units = units || Infinity;
        var codePoint;
        var length = string.length;
        var leadSurrogate = null;
        var bytes = [];

        for (var i = 0; i < length; ++i) {
            codePoint = string.charCodeAt(i); // is surrogate component

            if (codePoint > 0xD7FF && codePoint < 0xE000) {
                // last char was a lead
                if (!leadSurrogate) {
                    // no lead yet
                    if (codePoint > 0xDBFF) {
                        // unexpected trail
                        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                        continue;
                    } else if (i + 1 === length) {
                        // unpaired lead
                        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                        continue;
                    } // valid lead


                    leadSurrogate = codePoint;
                    continue;
                } // 2 leads in a row


                if (codePoint < 0xDC00) {
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    leadSurrogate = codePoint;
                    continue;
                } // valid surrogate pair


                codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
            } else if (leadSurrogate) {
                // valid bmp char, but last char was a lead
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
            }

            leadSurrogate = null; // encode utf8

            if (codePoint < 0x80) {
                if ((units -= 1) < 0) break;
                bytes.push(codePoint);
            } else if (codePoint < 0x800) {
                if ((units -= 2) < 0) break;
                bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
            } else if (codePoint < 0x10000) {
                if ((units -= 3) < 0) break;
                bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
            } else if (codePoint < 0x110000) {
                if ((units -= 4) < 0) break;
                bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
            } else {
                throw new Error('Invalid code point');
            }
        }

        return bytes;
    }

    function asciiToBytes(str) {
        var byteArray = [];

        for (var i = 0; i < str.length; ++i) {
            // Node's code seems to be doing this and not & 0x7F..
            byteArray.push(str.charCodeAt(i) & 0xFF);
        }

        return byteArray;
    }

    function utf16leToBytes(str, units) {
        var c, hi, lo;
        var byteArray = [];

        for (var i = 0; i < str.length; ++i) {
            if ((units -= 2) < 0) break;
            c = str.charCodeAt(i);
            hi = c >> 8;
            lo = c % 256;
            byteArray.push(lo);
            byteArray.push(hi);
        }

        return byteArray;
    }

    function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
    }

    function blitBuffer(src, dst, offset, length) {
        for (var i = 0; i < length; ++i) {
            if (i + offset >= dst.length || i >= src.length) break;
            dst[i + offset] = src[i];
        }

        return i;
    } // ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
    // the `instanceof` check but they should be treated as of that type.
    // See: https://github.com/feross/buffer/issues/166


    function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }

    function numberIsNaN(obj) {
        // For IE11 support
        return obj !== obj; // eslint-disable-line no-self-compare
    } // Create lookup table for `toString('hex')`
    // See: https://github.com/feross/buffer/issues/219


    var hexSliceLookupTable = function () {
        var alphabet = '0123456789abcdef';
        var table = new Array(256);

        for (var i = 0; i < 16; ++i) {
            var i16 = i * 16;

            for (var j = 0; j < 16; ++j) {
                table[i16 + j] = alphabet[i] + alphabet[j];
            }
        }

        return table;
    }();
})(buffer);

var util = {};

var types = {};

/* eslint complexity: [2, 18], max-statements: [2, 33] */


var shams$1 = function hasSymbols() {
    if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
        return false;
    }

    if (_typeof(Symbol.iterator) === 'symbol') {
        return true;
    }

    var obj = {};
    var sym = Symbol('test');
    var symObj = Object(sym);

    if (typeof sym === 'string') {
        return false;
    }

    if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
        return false;
    }

    if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
        return false;
    } // temp disabled per https://github.com/ljharb/object.assign/issues/17
    // if (sym instanceof Symbol) { return false; }
    // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
    // if (!(symObj instanceof Symbol)) { return false; }
    // if (typeof Symbol.prototype.toString !== 'function') { return false; }
    // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }


    var symVal = 42;
    obj[sym] = symVal;

    for (sym in obj) {
        return false;
    } // eslint-disable-line no-restricted-syntax, no-unreachable-loop


    if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
        return false;
    }

    if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
    }

    var syms = Object.getOwnPropertySymbols(obj);

    if (syms.length !== 1 || syms[0] !== sym) {
        return false;
    }

    if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
    }

    if (typeof Object.getOwnPropertyDescriptor === 'function') {
        var descriptor = Object.getOwnPropertyDescriptor(obj, sym);

        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
        }
    }

    return true;
};

var hasSymbols$2 = shams$1;

var shams = function hasToStringTagShams() {
    return hasSymbols$2() && !!Symbol.toStringTag;
};

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = shams$1;

var hasSymbols$1 = function hasNativeSymbols() {
    if (typeof origSymbol !== 'function') {
        return false;
    }

    if (typeof Symbol !== 'function') {
        return false;
    }

    if (_typeof(origSymbol('foo')) !== 'symbol') {
        return false;
    }

    if (_typeof(Symbol('bar')) !== 'symbol') {
        return false;
    }

    return hasSymbolSham();
};

/* eslint no-invalid-this: 1 */


var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr$3 = Object.prototype.toString;
var funcType = '[object Function]';

var implementation$1 = function bind(that) {
    var target = this;

    if (typeof target !== 'function' || toStr$3.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }

    var args = slice.call(arguments, 1);
    var bound;

    var binder = function binder() {
        if (this instanceof bound) {
            var result = target.apply(this, args.concat(slice.call(arguments)));

            if (Object(result) === result) {
                return result;
            }

            return this;
        } else {
            return target.apply(that, args.concat(slice.call(arguments)));
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];

    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};

        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

var implementation = implementation$1;
var functionBind = Function.prototype.bind || implementation;

var bind$4 = functionBind;
var src = bind$4.call(Function.call, Object.prototype.hasOwnProperty);

var undefined$1;
var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError; // eslint-disable-next-line consistent-return

var getEvalledConstructor = function getEvalledConstructor(expressionSyntax) {
    try {
        return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
    } catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;

if ($gOPD) {
    try {
        $gOPD({}, '');
    } catch (e) {
        $gOPD = null; // this is IE 8, which has a broken gOPD
    }
}

var throwTypeError = function throwTypeError() {
    throw new $TypeError();
};

var ThrowTypeError = $gOPD ? function () {
    try {
        // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
        arguments.callee; // IE 8 does not throw here

        return throwTypeError;
    } catch (calleeThrows) {
        try {
            // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
            return $gOPD(arguments, 'callee').get;
        } catch (gOPDthrows) {
            return throwTypeError;
        }
    }
}() : throwTypeError;
var hasSymbols = hasSymbols$1();

var getProto$1 = Object.getPrototypeOf || function (x) {
    return x.__proto__;
}; // eslint-disable-line no-proto


var needsEval = {};
var TypedArray = typeof Uint8Array === 'undefined' ? undefined$1 : getProto$1(Uint8Array);
var INTRINSICS = {
    '%AggregateError%': typeof AggregateError === 'undefined' ? undefined$1 : AggregateError,
    '%Array%': Array,
    '%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
    '%ArrayIteratorPrototype%': hasSymbols ? getProto$1([][Symbol.iterator]()) : undefined$1,
    '%AsyncFromSyncIteratorPrototype%': undefined$1,
    '%AsyncFunction%': needsEval,
    '%AsyncGenerator%': needsEval,
    '%AsyncGeneratorFunction%': needsEval,
    '%AsyncIteratorPrototype%': needsEval,
    '%Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
    '%BigInt%': typeof BigInt === 'undefined' ? undefined$1 : BigInt,
    '%Boolean%': Boolean,
    '%DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
    '%Date%': Date,
    '%decodeURI%': decodeURI,
    '%decodeURIComponent%': decodeURIComponent,
    '%encodeURI%': encodeURI,
    '%encodeURIComponent%': encodeURIComponent,
    '%Error%': Error,
    '%eval%': eval,
    // eslint-disable-line no-eval
    '%EvalError%': EvalError,
    '%Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
    '%Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
    '%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined$1 : FinalizationRegistry,
    '%Function%': $Function,
    '%GeneratorFunction%': needsEval,
    '%Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
    '%Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
    '%Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
    '%isFinite%': isFinite,
    '%isNaN%': isNaN,
    '%IteratorPrototype%': hasSymbols ? getProto$1(getProto$1([][Symbol.iterator]())) : undefined$1,
    '%JSON%': (typeof JSON === "undefined" ? "undefined" : _typeof(JSON)) === 'object' ? JSON : undefined$1,
    '%Map%': typeof Map === 'undefined' ? undefined$1 : Map,
    '%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined$1 : getProto$1(new Map()[Symbol.iterator]()),
    '%Math%': Math,
    '%Number%': Number,
    '%Object%': Object,
    '%parseFloat%': parseFloat,
    '%parseInt%': parseInt,
    '%Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
    '%Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
    '%RangeError%': RangeError,
    '%ReferenceError%': ReferenceError,
    '%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
    '%RegExp%': RegExp,
    '%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
    '%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined$1 : getProto$1(new Set()[Symbol.iterator]()),
    '%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
    '%String%': String,
    '%StringIteratorPrototype%': hasSymbols ? getProto$1(''[Symbol.iterator]()) : undefined$1,
    '%Symbol%': hasSymbols ? Symbol : undefined$1,
    '%SyntaxError%': $SyntaxError,
    '%ThrowTypeError%': ThrowTypeError,
    '%TypedArray%': TypedArray,
    '%TypeError%': $TypeError,
    '%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
    '%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
    '%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
    '%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
    '%URIError%': URIError,
    '%WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
    '%WeakRef%': typeof WeakRef === 'undefined' ? undefined$1 : WeakRef,
    '%WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet
};

var doEval = function doEval(name) {
    var value;

    if (name === '%AsyncFunction%') {
        value = getEvalledConstructor('async function () {}');
    } else if (name === '%GeneratorFunction%') {
        value = getEvalledConstructor('function* () {}');
    } else if (name === '%AsyncGeneratorFunction%') {
        value = getEvalledConstructor('async function* () {}');
    } else if (name === '%AsyncGenerator%') {
        var fn = doEval('%AsyncGeneratorFunction%');

        if (fn) {
            value = fn.prototype;
        }
    } else if (name === '%AsyncIteratorPrototype%') {
        var gen = doEval('%AsyncGenerator%');

        if (gen) {
            value = getProto$1(gen.prototype);
        }
    }

    INTRINSICS[name] = value;
    return value;
};

var LEGACY_ALIASES = {
    '%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
    '%ArrayPrototype%': ['Array', 'prototype'],
    '%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
    '%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
    '%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
    '%ArrayProto_values%': ['Array', 'prototype', 'values'],
    '%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
    '%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
    '%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
    '%BooleanPrototype%': ['Boolean', 'prototype'],
    '%DataViewPrototype%': ['DataView', 'prototype'],
    '%DatePrototype%': ['Date', 'prototype'],
    '%ErrorPrototype%': ['Error', 'prototype'],
    '%EvalErrorPrototype%': ['EvalError', 'prototype'],
    '%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
    '%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
    '%FunctionPrototype%': ['Function', 'prototype'],
    '%Generator%': ['GeneratorFunction', 'prototype'],
    '%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
    '%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
    '%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
    '%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
    '%JSONParse%': ['JSON', 'parse'],
    '%JSONStringify%': ['JSON', 'stringify'],
    '%MapPrototype%': ['Map', 'prototype'],
    '%NumberPrototype%': ['Number', 'prototype'],
    '%ObjectPrototype%': ['Object', 'prototype'],
    '%ObjProto_toString%': ['Object', 'prototype', 'toString'],
    '%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
    '%PromisePrototype%': ['Promise', 'prototype'],
    '%PromiseProto_then%': ['Promise', 'prototype', 'then'],
    '%Promise_all%': ['Promise', 'all'],
    '%Promise_reject%': ['Promise', 'reject'],
    '%Promise_resolve%': ['Promise', 'resolve'],
    '%RangeErrorPrototype%': ['RangeError', 'prototype'],
    '%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
    '%RegExpPrototype%': ['RegExp', 'prototype'],
    '%SetPrototype%': ['Set', 'prototype'],
    '%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
    '%StringPrototype%': ['String', 'prototype'],
    '%SymbolPrototype%': ['Symbol', 'prototype'],
    '%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
    '%TypedArrayPrototype%': ['TypedArray', 'prototype'],
    '%TypeErrorPrototype%': ['TypeError', 'prototype'],
    '%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
    '%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
    '%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
    '%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
    '%URIErrorPrototype%': ['URIError', 'prototype'],
    '%WeakMapPrototype%': ['WeakMap', 'prototype'],
    '%WeakSetPrototype%': ['WeakSet', 'prototype']
};
var bind$3 = functionBind;
var hasOwn$1 = src;
var $concat = bind$3.call(Function.call, Array.prototype.concat);
var $spliceApply = bind$3.call(Function.apply, Array.prototype.splice);
var $replace = bind$3.call(Function.call, String.prototype.replace);
var $strSlice = bind$3.call(Function.call, String.prototype.slice);
var $exec = bind$3.call(Function.call, RegExp.prototype.exec);
/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */

var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g;
/** Used to match backslashes in property paths. */

var stringToPath = function stringToPath(string) {
    var first = $strSlice(string, 0, 1);
    var last = $strSlice(string, -1);

    if (first === '%' && last !== '%') {
        throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
    } else if (last === '%' && first !== '%') {
        throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
    }

    var result = [];
    $replace(string, rePropName, function (match, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
    });
    return result;
};
/* end adaptation */


var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
    var intrinsicName = name;
    var alias;

    if (hasOwn$1(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = '%' + alias[0] + '%';
    }

    if (hasOwn$1(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];

        if (value === needsEval) {
            value = doEval(intrinsicName);
        }

        if (typeof value === 'undefined' && !allowMissing) {
            throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
        }

        return {
            alias: alias,
            name: intrinsicName,
            value: value
        };
    }

    throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

var getIntrinsic = function GetIntrinsic(name, allowMissing) {
    if (typeof name !== 'string' || name.length === 0) {
        throw new $TypeError('intrinsic name must be a non-empty string');
    }

    if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
        throw new $TypeError('"allowMissing" argument must be a boolean');
    }

    if ($exec(/^%?[^%]*%?$/g, name) === null) {
        throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
    }

    var parts = stringToPath(name);
    var intrinsicBaseName = parts.length > 0 ? parts[0] : '';
    var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
    var intrinsicRealName = intrinsic.name;
    var value = intrinsic.value;
    var skipFurtherCaching = false;
    var alias = intrinsic.alias;

    if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
    }

    for (var i = 1, isOwn = true; i < parts.length; i += 1) {
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);

        if ((first === '"' || first === "'" || first === '`' || last === '"' || last === "'" || last === '`') && first !== last) {
            throw new $SyntaxError('property names with quotes must have matching quotes');
        }

        if (part === 'constructor' || !isOwn) {
            skipFurtherCaching = true;
        }

        intrinsicBaseName += '.' + part;
        intrinsicRealName = '%' + intrinsicBaseName + '%';

        if (hasOwn$1(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
            if (!(part in value)) {
                if (!allowMissing) {
                    throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
                }

                return void undefined$1;
            }

            if ($gOPD && i + 1 >= parts.length) {
                var desc = $gOPD(value, part);
                isOwn = !!desc; // By convention, when a data property is converted to an accessor
                // property to emulate a data property that does not suffer from
                // the override mistake, that accessor's getter is marked with
                // an `originalValue` property. Here, when we detect this, we
                // uphold the illusion by pretending to see that original data
                // property, i.e., returning the value rather than the getter
                // itself.

                if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
                    value = desc.get;
                } else {
                    value = value[part];
                }
            } else {
                isOwn = hasOwn$1(value, part);
                value = value[part];
            }

            if (isOwn && !skipFurtherCaching) {
                INTRINSICS[intrinsicRealName] = value;
            }
        }
    }

    return value;
};

var callBind$1 = {exports: {}};

(function (module) {

    var bind = functionBind;
    var GetIntrinsic = getIntrinsic;
    var $apply = GetIntrinsic('%Function.prototype.apply%');
    var $call = GetIntrinsic('%Function.prototype.call%');
    var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);
    var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
    var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
    var $max = GetIntrinsic('%Math.max%');

    if ($defineProperty) {
        try {
            $defineProperty({}, 'a', {
                value: 1
            });
        } catch (e) {
            // IE 8 has a broken defineProperty
            $defineProperty = null;
        }
    }

    module.exports = function callBind(originalFunction) {
        var func = $reflectApply(bind, $call, arguments);

        if ($gOPD && $defineProperty) {
            var desc = $gOPD(func, 'length');

            if (desc.configurable) {
                // original length, plus the receiver, minus any additional arguments (after the receiver)
                $defineProperty(func, 'length', {
                    value: 1 + $max(0, originalFunction.length - (arguments.length - 1))
                });
            }
        }

        return func;
    };

    var applyBind = function applyBind() {
        return $reflectApply(bind, $apply, arguments);
    };

    if ($defineProperty) {
        $defineProperty(module.exports, 'apply', {
            value: applyBind
        });
    } else {
        module.exports.apply = applyBind;
    }
})(callBind$1);

var GetIntrinsic = getIntrinsic;
var callBind = callBind$1.exports;
var $indexOf$1 = callBind(GetIntrinsic('String.prototype.indexOf'));

var callBound$3 = function callBoundIntrinsic(name, allowMissing) {
    var intrinsic = GetIntrinsic(name, !!allowMissing);

    if (typeof intrinsic === 'function' && $indexOf$1(name, '.prototype.') > -1) {
        return callBind(intrinsic);
    }

    return intrinsic;
};

var hasToStringTag$4 = shams();
var callBound$2 = callBound$3;
var $toString$2 = callBound$2('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
    if (hasToStringTag$4 && value && _typeof(value) === 'object' && Symbol.toStringTag in value) {
        return false;
    }

    return $toString$2(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
    if (isStandardArguments(value)) {
        return true;
    }

    return value !== null && _typeof(value) === 'object' && typeof value.length === 'number' && value.length >= 0 && $toString$2(value) !== '[object Array]' && $toString$2(value.callee) === '[object Function]';
};

var supportsStandardArguments = function () {
    return isStandardArguments(arguments);
}();

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

var isArguments$1 = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

var toStr$2 = Object.prototype.toString;
var fnToStr$1 = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag$3 = shams();
var getProto = Object.getPrototypeOf;

var getGeneratorFunc = function getGeneratorFunc() {
    // eslint-disable-line consistent-return
    if (!hasToStringTag$3) {
        return false;
    }

    try {
        return Function('return function*() {}')();
    } catch (e) {}
};

var GeneratorFunction;

var isGeneratorFunction = function isGeneratorFunction(fn) {
    if (typeof fn !== 'function') {
        return false;
    }

    if (isFnRegex.test(fnToStr$1.call(fn))) {
        return true;
    }

    if (!hasToStringTag$3) {
        var str = toStr$2.call(fn);
        return str === '[object GeneratorFunction]';
    }

    if (!getProto) {
        return false;
    }

    if (typeof GeneratorFunction === 'undefined') {
        var generatorFunc = getGeneratorFunc();
        GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
    }

    return getProto(fn) === GeneratorFunction;
};

var fnToStr = Function.prototype.toString;
var reflectApply = (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === 'object' && Reflect !== null && Reflect.apply;
var badArrayLike;
var isCallableMarker;

if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
    try {
        badArrayLike = Object.defineProperty({}, 'length', {
            get: function get() {
                throw isCallableMarker;
            }
        });
        isCallableMarker = {}; // eslint-disable-next-line no-throw-literal

        reflectApply(function () {
            throw 42;
        }, null, badArrayLike);
    } catch (_) {
        if (_ !== isCallableMarker) {
            reflectApply = null;
        }
    }
} else {
    reflectApply = null;
}

var constructorRegex = /^\s*class\b/;

var isES6ClassFn = function isES6ClassFunction(value) {
    try {
        var fnStr = fnToStr.call(value);
        return constructorRegex.test(fnStr);
    } catch (e) {
        return false; // not a function
    }
};

var tryFunctionObject = function tryFunctionToStr(value) {
    try {
        if (isES6ClassFn(value)) {
            return false;
        }

        fnToStr.call(value);
        return true;
    } catch (e) {
        return false;
    }
};

var toStr$1 = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag$2 = typeof Symbol === 'function' && !!Symbol.toStringTag; // better: use `has-tostringtag`

/* globals document: false */

var documentDotAll = (typeof document === "undefined" ? "undefined" : _typeof(document)) === 'object' && typeof document.all === 'undefined' && document.all !== undefined ? document.all : {};
var isCallable$1 = reflectApply ? function isCallable(value) {
    if (value === documentDotAll) {
        return true;
    }

    if (!value) {
        return false;
    }

    if (typeof value !== 'function' && _typeof(value) !== 'object') {
        return false;
    }

    if (typeof value === 'function' && !value.prototype) {
        return true;
    }

    try {
        reflectApply(value, null, badArrayLike);
    } catch (e) {
        if (e !== isCallableMarker) {
            return false;
        }
    }

    return !isES6ClassFn(value);
} : function isCallable(value) {
    if (value === documentDotAll) {
        return true;
    }

    if (!value) {
        return false;
    }

    if (typeof value !== 'function' && _typeof(value) !== 'object') {
        return false;
    }

    if (typeof value === 'function' && !value.prototype) {
        return true;
    }

    if (hasToStringTag$2) {
        return tryFunctionObject(value);
    }

    if (isES6ClassFn(value)) {
        return false;
    }

    var strClass = toStr$1.call(value);
    return strClass === fnClass || strClass === genClass;
};

var isCallable = isCallable$1;
var toStr = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var forEachArray = function forEachArray(array, iterator, receiver) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
                iterator(array[i], i, array);
            } else {
                iterator.call(receiver, array[i], i, array);
            }
        }
    }
};

var forEachString = function forEachString(string, iterator, receiver) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        if (receiver == null) {
            iterator(string.charAt(i), i, string);
        } else {
            iterator.call(receiver, string.charAt(i), i, string);
        }
    }
};

var forEachObject = function forEachObject(object, iterator, receiver) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
                iterator(object[k], k, object);
            } else {
                iterator.call(receiver, object[k], k, object);
            }
        }
    }
};

var forEach$3 = function forEach(list, iterator, thisArg) {
    if (!isCallable(iterator)) {
        throw new TypeError('iterator must be a function');
    }

    var receiver;

    if (arguments.length >= 3) {
        receiver = thisArg;
    }

    if (toStr.call(list) === '[object Array]') {
        forEachArray(list, iterator, receiver);
    } else if (typeof list === 'string') {
        forEachString(list, iterator, receiver);
    } else {
        forEachObject(list, iterator, receiver);
    }
};

var forEach_1 = forEach$3;

var possibleNames = ['BigInt64Array', 'BigUint64Array', 'Float32Array', 'Float64Array', 'Int16Array', 'Int32Array', 'Int8Array', 'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray'];
var g$2 = typeof globalThis === 'undefined' ? commonjsGlobal : globalThis;

var availableTypedArrays$2 = function availableTypedArrays() {
    var out = [];

    for (var i = 0; i < possibleNames.length; i++) {
        if (typeof g$2[possibleNames[i]] === 'function') {
            out[out.length] = possibleNames[i];
        }
    }

    return out;
};

var getOwnPropertyDescriptor;
var hasRequiredGetOwnPropertyDescriptor;

function requireGetOwnPropertyDescriptor() {
    if (hasRequiredGetOwnPropertyDescriptor) return getOwnPropertyDescriptor;
    hasRequiredGetOwnPropertyDescriptor = 1;

    var GetIntrinsic = getIntrinsic;
    var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);

    if ($gOPD) {
        try {
            $gOPD([], 'length');
        } catch (e) {
            // IE 8 has a broken gOPD
            $gOPD = null;
        }
    }

    getOwnPropertyDescriptor = $gOPD;
    return getOwnPropertyDescriptor;
}

var forEach$2 = forEach_1;
var availableTypedArrays$1 = availableTypedArrays$2;
var callBound$1 = callBound$3;
var $toString$1 = callBound$1('Object.prototype.toString');
var hasToStringTag$1 = shams();
var g$1 = typeof globalThis === 'undefined' ? commonjsGlobal : globalThis;
var typedArrays$1 = availableTypedArrays$1();

var $indexOf = callBound$1('Array.prototype.indexOf', true) || function indexOf(array, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i] === value) {
            return i;
        }
    }

    return -1;
};

var $slice$1 = callBound$1('String.prototype.slice');
var toStrTags$1 = {};
var gOPD$1 = requireGetOwnPropertyDescriptor();
var getPrototypeOf$1 = Object.getPrototypeOf; // require('getprototypeof');

if (hasToStringTag$1 && gOPD$1 && getPrototypeOf$1) {
    forEach$2(typedArrays$1, function (typedArray) {
        var arr = new g$1[typedArray]();

        if (Symbol.toStringTag in arr) {
            var proto = getPrototypeOf$1(arr);
            var descriptor = gOPD$1(proto, Symbol.toStringTag);

            if (!descriptor) {
                var superProto = getPrototypeOf$1(proto);
                descriptor = gOPD$1(superProto, Symbol.toStringTag);
            }

            toStrTags$1[typedArray] = descriptor.get;
        }
    });
}

var tryTypedArrays$1 = function tryAllTypedArrays(value) {
    var anyTrue = false;
    forEach$2(toStrTags$1, function (getter, typedArray) {
        if (!anyTrue) {
            try {
                anyTrue = getter.call(value) === typedArray;
            } catch (e) {
                /**/
            }
        }
    });
    return anyTrue;
};

var isTypedArray$2 = function isTypedArray(value) {
    if (!value || _typeof(value) !== 'object') {
        return false;
    }

    if (!hasToStringTag$1 || !(Symbol.toStringTag in value)) {
        var tag = $slice$1($toString$1(value), 8, -1);
        return $indexOf(typedArrays$1, tag) > -1;
    }

    if (!gOPD$1) {
        return false;
    }

    return tryTypedArrays$1(value);
};

var forEach$1 = forEach_1;
var availableTypedArrays = availableTypedArrays$2;
var callBound = callBound$3;
var $toString = callBound('Object.prototype.toString');
var hasToStringTag = shams();
var g = typeof globalThis === 'undefined' ? commonjsGlobal : globalThis;
var typedArrays = availableTypedArrays();
var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = requireGetOwnPropertyDescriptor();
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');

if (hasToStringTag && gOPD && getPrototypeOf) {
    forEach$1(typedArrays, function (typedArray) {
        if (typeof g[typedArray] === 'function') {
            var arr = new g[typedArray]();

            if (Symbol.toStringTag in arr) {
                var proto = getPrototypeOf(arr);
                var descriptor = gOPD(proto, Symbol.toStringTag);

                if (!descriptor) {
                    var superProto = getPrototypeOf(proto);
                    descriptor = gOPD(superProto, Symbol.toStringTag);
                }

                toStrTags[typedArray] = descriptor.get;
            }
        }
    });
}

var tryTypedArrays = function tryAllTypedArrays(value) {
    var foundName = false;
    forEach$1(toStrTags, function (getter, typedArray) {
        if (!foundName) {
            try {
                var name = getter.call(value);

                if (name === typedArray) {
                    foundName = name;
                }
            } catch (e) {}
        }
    });
    return foundName;
};

var isTypedArray$1 = isTypedArray$2;

var whichTypedArray = function whichTypedArray(value) {
    if (!isTypedArray$1(value)) {
        return false;
    }

    if (!hasToStringTag || !(Symbol.toStringTag in value)) {
        return $slice($toString(value), 8, -1);
    }

    return tryTypedArrays(value);
};

(function (exports) {

    var isArgumentsObject = isArguments$1;
    var isGeneratorFunction$1 = isGeneratorFunction;
    var whichTypedArray$1 = whichTypedArray;
    var isTypedArray = isTypedArray$2;

    function uncurryThis(f) {
        return f.call.bind(f);
    }

    var BigIntSupported = typeof BigInt !== 'undefined';
    var SymbolSupported = typeof Symbol !== 'undefined';
    var ObjectToString = uncurryThis(Object.prototype.toString);
    var numberValue = uncurryThis(Number.prototype.valueOf);
    var stringValue = uncurryThis(String.prototype.valueOf);
    var booleanValue = uncurryThis(Boolean.prototype.valueOf);

    if (BigIntSupported) {
        var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
    }

    if (SymbolSupported) {
        var symbolValue = uncurryThis(Symbol.prototype.valueOf);
    }

    function checkBoxedPrimitive(value, prototypeValueOf) {
        if (_typeof(value) !== 'object') {
            return false;
        }

        try {
            prototypeValueOf(value);
            return true;
        } catch (e) {
            return false;
        }
    }

    exports.isArgumentsObject = isArgumentsObject;
    exports.isGeneratorFunction = isGeneratorFunction$1;
    exports.isTypedArray = isTypedArray; // Taken from here and modified for better browser support
    // https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js

    function isPromise(input) {
        return typeof Promise !== 'undefined' && input instanceof Promise || input !== null && _typeof(input) === 'object' && typeof input.then === 'function' && typeof input.catch === 'function';
    }

    exports.isPromise = isPromise;

    function isArrayBufferView(value) {
        if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
            return ArrayBuffer.isView(value);
        }

        return isTypedArray(value) || isDataView(value);
    }

    exports.isArrayBufferView = isArrayBufferView;

    function isUint8Array(value) {
        return whichTypedArray$1(value) === 'Uint8Array';
    }

    exports.isUint8Array = isUint8Array;

    function isUint8ClampedArray(value) {
        return whichTypedArray$1(value) === 'Uint8ClampedArray';
    }

    exports.isUint8ClampedArray = isUint8ClampedArray;

    function isUint16Array(value) {
        return whichTypedArray$1(value) === 'Uint16Array';
    }

    exports.isUint16Array = isUint16Array;

    function isUint32Array(value) {
        return whichTypedArray$1(value) === 'Uint32Array';
    }

    exports.isUint32Array = isUint32Array;

    function isInt8Array(value) {
        return whichTypedArray$1(value) === 'Int8Array';
    }

    exports.isInt8Array = isInt8Array;

    function isInt16Array(value) {
        return whichTypedArray$1(value) === 'Int16Array';
    }

    exports.isInt16Array = isInt16Array;

    function isInt32Array(value) {
        return whichTypedArray$1(value) === 'Int32Array';
    }

    exports.isInt32Array = isInt32Array;

    function isFloat32Array(value) {
        return whichTypedArray$1(value) === 'Float32Array';
    }

    exports.isFloat32Array = isFloat32Array;

    function isFloat64Array(value) {
        return whichTypedArray$1(value) === 'Float64Array';
    }

    exports.isFloat64Array = isFloat64Array;

    function isBigInt64Array(value) {
        return whichTypedArray$1(value) === 'BigInt64Array';
    }

    exports.isBigInt64Array = isBigInt64Array;

    function isBigUint64Array(value) {
        return whichTypedArray$1(value) === 'BigUint64Array';
    }

    exports.isBigUint64Array = isBigUint64Array;

    function isMapToString(value) {
        return ObjectToString(value) === '[object Map]';
    }

    isMapToString.working = typeof Map !== 'undefined' && isMapToString(new Map());

    function isMap(value) {
        if (typeof Map === 'undefined') {
            return false;
        }

        return isMapToString.working ? isMapToString(value) : value instanceof Map;
    }

    exports.isMap = isMap;

    function isSetToString(value) {
        return ObjectToString(value) === '[object Set]';
    }

    isSetToString.working = typeof Set !== 'undefined' && isSetToString(new Set());

    function isSet(value) {
        if (typeof Set === 'undefined') {
            return false;
        }

        return isSetToString.working ? isSetToString(value) : value instanceof Set;
    }

    exports.isSet = isSet;

    function isWeakMapToString(value) {
        return ObjectToString(value) === '[object WeakMap]';
    }

    isWeakMapToString.working = typeof WeakMap !== 'undefined' && isWeakMapToString(new WeakMap());

    function isWeakMap(value) {
        if (typeof WeakMap === 'undefined') {
            return false;
        }

        return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
    }

    exports.isWeakMap = isWeakMap;

    function isWeakSetToString(value) {
        return ObjectToString(value) === '[object WeakSet]';
    }

    isWeakSetToString.working = typeof WeakSet !== 'undefined' && isWeakSetToString(new WeakSet());

    function isWeakSet(value) {
        return isWeakSetToString(value);
    }

    exports.isWeakSet = isWeakSet;

    function isArrayBufferToString(value) {
        return ObjectToString(value) === '[object ArrayBuffer]';
    }

    isArrayBufferToString.working = typeof ArrayBuffer !== 'undefined' && isArrayBufferToString(new ArrayBuffer());

    function isArrayBuffer(value) {
        if (typeof ArrayBuffer === 'undefined') {
            return false;
        }

        return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
    }

    exports.isArrayBuffer = isArrayBuffer;

    function isDataViewToString(value) {
        return ObjectToString(value) === '[object DataView]';
    }

    isDataViewToString.working = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined' && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));

    function isDataView(value) {
        if (typeof DataView === 'undefined') {
            return false;
        }

        return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
    }

    exports.isDataView = isDataView; // Store a copy of SharedArrayBuffer in case it's deleted elsewhere

    var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;

    function isSharedArrayBufferToString(value) {
        return ObjectToString(value) === '[object SharedArrayBuffer]';
    }

    function isSharedArrayBuffer(value) {
        if (typeof SharedArrayBufferCopy === 'undefined') {
            return false;
        }

        if (typeof isSharedArrayBufferToString.working === 'undefined') {
            isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
        }

        return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy;
    }

    exports.isSharedArrayBuffer = isSharedArrayBuffer;

    function isAsyncFunction(value) {
        return ObjectToString(value) === '[object AsyncFunction]';
    }

    exports.isAsyncFunction = isAsyncFunction;

    function isMapIterator(value) {
        return ObjectToString(value) === '[object Map Iterator]';
    }

    exports.isMapIterator = isMapIterator;

    function isSetIterator(value) {
        return ObjectToString(value) === '[object Set Iterator]';
    }

    exports.isSetIterator = isSetIterator;

    function isGeneratorObject(value) {
        return ObjectToString(value) === '[object Generator]';
    }

    exports.isGeneratorObject = isGeneratorObject;

    function isWebAssemblyCompiledModule(value) {
        return ObjectToString(value) === '[object WebAssembly.Module]';
    }

    exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

    function isNumberObject(value) {
        return checkBoxedPrimitive(value, numberValue);
    }

    exports.isNumberObject = isNumberObject;

    function isStringObject(value) {
        return checkBoxedPrimitive(value, stringValue);
    }

    exports.isStringObject = isStringObject;

    function isBooleanObject(value) {
        return checkBoxedPrimitive(value, booleanValue);
    }

    exports.isBooleanObject = isBooleanObject;

    function isBigIntObject(value) {
        return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
    }

    exports.isBigIntObject = isBigIntObject;

    function isSymbolObject(value) {
        return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
    }

    exports.isSymbolObject = isSymbolObject;

    function isBoxedPrimitive(value) {
        return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
    }

    exports.isBoxedPrimitive = isBoxedPrimitive;

    function isAnyArrayBuffer(value) {
        return typeof Uint8Array !== 'undefined' && (isArrayBuffer(value) || isSharedArrayBuffer(value));
    }

    exports.isAnyArrayBuffer = isAnyArrayBuffer;
    ['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function (method) {
        Object.defineProperty(exports, method, {
            enumerable: false,
            value: function value() {
                throw new Error(method + ' is not supported in userland');
            }
        });
    });
})(types);

var isBufferBrowser = function isBuffer(arg) {
    return arg && _typeof(arg) === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
};

var inherits_browser = {exports: {}};

if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    inherits_browser.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
        }
    };
} else {
    // old school shim for old browsers
    inherits_browser.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
            ctor.super_ = superCtor;

            var TempCtor = function TempCtor() {};

            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
        }
    };
}

(function (exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(obj) {
        var keys = Object.keys(obj);
        var descriptors = {};

        for (var i = 0; i < keys.length; i++) {
            descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
        }

        return descriptors;
    };

    var formatRegExp = /%[sdj%]/g;

    exports.format = function (f) {
        if (!isString(f)) {
            var objects = [];

            for (var i = 0; i < arguments.length; i++) {
                objects.push(inspect(arguments[i]));
            }

            return objects.join(' ');
        }

        var i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function (x) {
            if (x === '%%') return '%';
            if (i >= len) return x;

            switch (x) {
                case '%s':
                    return String(args[i++]);

                case '%d':
                    return Number(args[i++]);

                case '%j':
                    try {
                        return JSON.stringify(args[i++]);
                    } catch (_) {
                        return '[Circular]';
                    }

                default:
                    return x;
            }
        });

        for (var x = args[i]; i < len; x = args[++i]) {
            if (isNull(x) || !isObject(x)) {
                str += ' ' + x;
            } else {
                str += ' ' + inspect(x);
            }
        }

        return str;
    }; // Mark that a method should not be used.
    // Returns a modified function which warns once by default.
    // If --no-deprecation is set, then it is a no-op.


    exports.deprecate = function (fn, msg) {
        if (typeof process !== 'undefined' && process.noDeprecation === true) {
            return fn;
        } // Allow for deprecating things in the process of starting up.


        if (typeof process === 'undefined') {
            return function () {
                return exports.deprecate(fn, msg).apply(this, arguments);
            };
        }

        var warned = false;

        function deprecated() {
            if (!warned) {
                if (process.throwDeprecation) {
                    throw new Error(msg);
                } else if (process.traceDeprecation) {
                    console.trace(msg);
                } else {
                    console.error(msg);
                }

                warned = true;
            }

            return fn.apply(this, arguments);
        }

        return deprecated;
    };

    var debugs = {};
    var debugEnvRegex = /^$/;

    if (process.env.NODE_DEBUG) {
        var debugEnv = process.env.NODE_DEBUG;
        debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&').replace(/\*/g, '.*').replace(/,/g, '$|^').toUpperCase();
        debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
    }

    exports.debuglog = function (set) {
        set = set.toUpperCase();

        if (!debugs[set]) {
            if (debugEnvRegex.test(set)) {
                var pid = process.pid;

                debugs[set] = function () {
                    var msg = exports.format.apply(exports, arguments);
                    console.error('%s %d: %s', set, pid, msg);
                };
            } else {
                debugs[set] = function () {};
            }
        }

        return debugs[set];
    };
    /**
     * Echos the value of a value. Trys to print the value out
     * in the best way possible given the different types.
     *
     * @param {Object} obj The object to print out.
     * @param {Object} opts Optional options object that alters the output.
     */

    /* legacy: obj, showHidden, depth, colors*/


    function inspect(obj, opts) {
        // default options
        var ctx = {
            seen: [],
            stylize: stylizeNoColor
        }; // legacy...

        if (arguments.length >= 3) ctx.depth = arguments[2];
        if (arguments.length >= 4) ctx.colors = arguments[3];

        if (isBoolean(opts)) {
            // legacy...
            ctx.showHidden = opts;
        } else if (opts) {
            // got an "options" object
            exports._extend(ctx, opts);
        } // set default options


        if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
        if (isUndefined(ctx.depth)) ctx.depth = 2;
        if (isUndefined(ctx.colors)) ctx.colors = false;
        if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
        if (ctx.colors) ctx.stylize = stylizeWithColor;
        return formatValue(ctx, obj, ctx.depth);
    }

    exports.inspect = inspect; // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

    inspect.colors = {
        'bold': [1, 22],
        'italic': [3, 23],
        'underline': [4, 24],
        'inverse': [7, 27],
        'white': [37, 39],
        'grey': [90, 39],
        'black': [30, 39],
        'blue': [34, 39],
        'cyan': [36, 39],
        'green': [32, 39],
        'magenta': [35, 39],
        'red': [31, 39],
        'yellow': [33, 39]
    }; // Don't use 'blue' not visible on cmd.exe

    inspect.styles = {
        'special': 'cyan',
        'number': 'yellow',
        'boolean': 'yellow',
        'undefined': 'grey',
        'null': 'bold',
        'string': 'green',
        'date': 'magenta',
        // "name": intentionally not styling
        'regexp': 'red'
    };

    function stylizeWithColor(str, styleType) {
        var style = inspect.styles[styleType];

        if (style) {
            return "\x1B[" + inspect.colors[style][0] + 'm' + str + "\x1B[" + inspect.colors[style][1] + 'm';
        } else {
            return str;
        }
    }

    function stylizeNoColor(str, styleType) {
        return str;
    }

    function arrayToHash(array) {
        var hash = {};
        array.forEach(function (val, idx) {
            hash[val] = true;
        });
        return hash;
    }

    function formatValue(ctx, value, recurseTimes) {
        // Provide a hook for user-specified inspect functions.
        // Check that value is an object with an inspect function on it
        if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
            value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
            !(value.constructor && value.constructor.prototype === value)) {
            var ret = value.inspect(recurseTimes, ctx);

            if (!isString(ret)) {
                ret = formatValue(ctx, ret, recurseTimes);
            }

            return ret;
        } // Primitive types cannot have properties


        var primitive = formatPrimitive(ctx, value);

        if (primitive) {
            return primitive;
        } // Look up the keys of the object.


        var keys = Object.keys(value);
        var visibleKeys = arrayToHash(keys);

        if (ctx.showHidden) {
            keys = Object.getOwnPropertyNames(value);
        } // IE doesn't make error fields non-enumerable
        // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


        if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
            return formatError(value);
        } // Some type of object without properties can be shortcutted.


        if (keys.length === 0) {
            if (isFunction(value)) {
                var name = value.name ? ': ' + value.name : '';
                return ctx.stylize('[Function' + name + ']', 'special');
            }

            if (isRegExp(value)) {
                return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
            }

            if (isDate(value)) {
                return ctx.stylize(Date.prototype.toString.call(value), 'date');
            }

            if (isError(value)) {
                return formatError(value);
            }
        }

        var base = '',
            array = false,
            braces = ['{', '}']; // Make Array say that they are Array

        if (isArray(value)) {
            array = true;
            braces = ['[', ']'];
        } // Make functions say that they are functions


        if (isFunction(value)) {
            var n = value.name ? ': ' + value.name : '';
            base = ' [Function' + n + ']';
        } // Make RegExps say that they are RegExps


        if (isRegExp(value)) {
            base = ' ' + RegExp.prototype.toString.call(value);
        } // Make dates with properties first say the date


        if (isDate(value)) {
            base = ' ' + Date.prototype.toUTCString.call(value);
        } // Make error with message first say the error


        if (isError(value)) {
            base = ' ' + formatError(value);
        }

        if (keys.length === 0 && (!array || value.length == 0)) {
            return braces[0] + base + braces[1];
        }

        if (recurseTimes < 0) {
            if (isRegExp(value)) {
                return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
            } else {
                return ctx.stylize('[Object]', 'special');
            }
        }

        ctx.seen.push(value);
        var output;

        if (array) {
            output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
        } else {
            output = keys.map(function (key) {
                return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
            });
        }

        ctx.seen.pop();
        return reduceToSingleString(output, base, braces);
    }

    function formatPrimitive(ctx, value) {
        if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

        if (isString(value)) {
            var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
            return ctx.stylize(simple, 'string');
        }

        if (isNumber(value)) return ctx.stylize('' + value, 'number');
        if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

        if (isNull(value)) return ctx.stylize('null', 'null');
    }

    function formatError(value) {
        return '[' + Error.prototype.toString.call(value) + ']';
    }

    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
        var output = [];

        for (var i = 0, l = value.length; i < l; ++i) {
            if (hasOwnProperty(value, String(i))) {
                output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
            } else {
                output.push('');
            }
        }

        keys.forEach(function (key) {
            if (!key.match(/^\d+$/)) {
                output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
            }
        });
        return output;
    }

    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
        var name, str, desc;
        desc = Object.getOwnPropertyDescriptor(value, key) || {
            value: value[key]
        };

        if (desc.get) {
            if (desc.set) {
                str = ctx.stylize('[Getter/Setter]', 'special');
            } else {
                str = ctx.stylize('[Getter]', 'special');
            }
        } else {
            if (desc.set) {
                str = ctx.stylize('[Setter]', 'special');
            }
        }

        if (!hasOwnProperty(visibleKeys, key)) {
            name = '[' + key + ']';
        }

        if (!str) {
            if (ctx.seen.indexOf(desc.value) < 0) {
                if (isNull(recurseTimes)) {
                    str = formatValue(ctx, desc.value, null);
                } else {
                    str = formatValue(ctx, desc.value, recurseTimes - 1);
                }

                if (str.indexOf('\n') > -1) {
                    if (array) {
                        str = str.split('\n').map(function (line) {
                            return '  ' + line;
                        }).join('\n').substr(2);
                    } else {
                        str = '\n' + str.split('\n').map(function (line) {
                            return '   ' + line;
                        }).join('\n');
                    }
                }
            } else {
                str = ctx.stylize('[Circular]', 'special');
            }
        }

        if (isUndefined(name)) {
            if (array && key.match(/^\d+$/)) {
                return str;
            }

            name = JSON.stringify('' + key);

            if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                name = name.substr(1, name.length - 2);
                name = ctx.stylize(name, 'name');
            } else {
                name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
                name = ctx.stylize(name, 'string');
            }
        }

        return name + ': ' + str;
    }

    function reduceToSingleString(output, base, braces) {
        var length = output.reduce(function (prev, cur) {
            if (cur.indexOf('\n') >= 0) ;
            return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
        }, 0);

        if (length > 60) {
            return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
        }

        return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    } // NOTE: These type checking functions intentionally don't use `instanceof`
    // because it is fragile and can be easily faked with `Object.create()`.


    exports.types = types;

    function isArray(ar) {
        return Array.isArray(ar);
    }

    exports.isArray = isArray;

    function isBoolean(arg) {
        return typeof arg === 'boolean';
    }

    exports.isBoolean = isBoolean;

    function isNull(arg) {
        return arg === null;
    }

    exports.isNull = isNull;

    function isNullOrUndefined(arg) {
        return arg == null;
    }

    exports.isNullOrUndefined = isNullOrUndefined;

    function isNumber(arg) {
        return typeof arg === 'number';
    }

    exports.isNumber = isNumber;

    function isString(arg) {
        return typeof arg === 'string';
    }

    exports.isString = isString;

    function isSymbol(arg) {
        return _typeof(arg) === 'symbol';
    }

    exports.isSymbol = isSymbol;

    function isUndefined(arg) {
        return arg === void 0;
    }

    exports.isUndefined = isUndefined;

    function isRegExp(re) {
        return isObject(re) && objectToString(re) === '[object RegExp]';
    }

    exports.isRegExp = isRegExp;
    exports.types.isRegExp = isRegExp;

    function isObject(arg) {
        return _typeof(arg) === 'object' && arg !== null;
    }

    exports.isObject = isObject;

    function isDate(d) {
        return isObject(d) && objectToString(d) === '[object Date]';
    }

    exports.isDate = isDate;
    exports.types.isDate = isDate;

    function isError(e) {
        return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
    }

    exports.isError = isError;
    exports.types.isNativeError = isError;

    function isFunction(arg) {
        return typeof arg === 'function';
    }

    exports.isFunction = isFunction;

    function isPrimitive(arg) {
        return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || _typeof(arg) === 'symbol' || // ES6 symbol
            typeof arg === 'undefined';
    }

    exports.isPrimitive = isPrimitive;
    exports.isBuffer = isBufferBrowser;

    function objectToString(o) {
        return Object.prototype.toString.call(o);
    }

    function pad(n) {
        return n < 10 ? '0' + n.toString(10) : n.toString(10);
    }

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

    function timestamp() {
        var d = new Date();
        var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
        return [d.getDate(), months[d.getMonth()], time].join(' ');
    } // log is just a thin wrapper to console.log that prepends a timestamp


    exports.log = function () {
        console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
    };
    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * The Function.prototype.inherits from lang.js rewritten as a standalone
     * function (not on Function.prototype). NOTE: If this file is to be loaded
     * during bootstrapping this function needs to be rewritten using some native
     * functions as prototype setup using normal JavaScript does not work as
     * expected during bootstrapping (see mirror.js in r114903).
     *
     * @param {function} ctor Constructor function which needs to inherit the
     *     prototype.
     * @param {function} superCtor Constructor function to inherit prototype from.
     */


    exports.inherits = inherits_browser.exports;

    exports._extend = function (origin, add) {
        // Don't do anything if add isn't an object
        if (!add || !isObject(add)) return origin;
        var keys = Object.keys(add);
        var i = keys.length;

        while (i--) {
            origin[keys[i]] = add[keys[i]];
        }

        return origin;
    };

    function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

    exports.promisify = function promisify(original) {
        if (typeof original !== 'function') throw new TypeError('The "original" argument must be of type Function');

        if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
            var fn = original[kCustomPromisifiedSymbol];

            if (typeof fn !== 'function') {
                throw new TypeError('The "util.promisify.custom" argument must be of type Function');
            }

            Object.defineProperty(fn, kCustomPromisifiedSymbol, {
                value: fn,
                enumerable: false,
                writable: false,
                configurable: true
            });
            return fn;
        }

        function fn() {
            var promiseResolve, promiseReject;
            var promise = new Promise(function (resolve, reject) {
                promiseResolve = resolve;
                promiseReject = reject;
            });
            var args = [];

            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            args.push(function (err, value) {
                if (err) {
                    promiseReject(err);
                } else {
                    promiseResolve(value);
                }
            });

            try {
                original.apply(this, args);
            } catch (err) {
                promiseReject(err);
            }

            return promise;
        }

        Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
        if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
            value: fn,
            enumerable: false,
            writable: false,
            configurable: true
        });
        return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
    };

    exports.promisify.custom = kCustomPromisifiedSymbol;

    function callbackifyOnRejected(reason, cb) {
        // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
        // Because `null` is a special error value in callbacks which means "no error
        // occurred", we error-wrap so the callback consumer can distinguish between
        // "the promise rejected with null" or "the promise fulfilled with undefined".
        if (!reason) {
            var newReason = new Error('Promise was rejected with a falsy value');
            newReason.reason = reason;
            reason = newReason;
        }

        return cb(reason);
    }

    function callbackify(original) {
        if (typeof original !== 'function') {
            throw new TypeError('The "original" argument must be of type Function');
        } // We DO NOT return the promise as it gives the user a false sense that
        // the promise is actually somehow related to the callback's execution
        // and that the callback throwing will reject the promise.


        function callbackified() {
            var args = [];

            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            var maybeCb = args.pop();

            if (typeof maybeCb !== 'function') {
                throw new TypeError('The last argument must be of type Function');
            }

            var self = this;

            var cb = function cb() {
                return maybeCb.apply(self, arguments);
            }; // In true node style we process the callback on `nextTick` with all the
            // implications (stack, `uncaughtException`, `async_hooks`)


            original.apply(this, args).then(function (ret) {
                nextTick(cb.bind(null, null, ret));
            }, function (rej) {
                nextTick(callbackifyOnRejected.bind(null, rej, cb));
            });
        }

        Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
        Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
        return callbackified;
    }

    exports.callbackify = callbackify;
})(util);

function compare(a, b) {
    if (a === b) {
        return 0;
    }

    var x = a.length;
    var y = b.length;

    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
        }
    }

    if (x < y) {
        return -1;
    }

    if (y < x) {
        return 1;
    }

    return 0;
}

var hasOwn = Object.prototype.hasOwnProperty;

var objectKeys = Object.keys || function (obj) {
    var keys = [];

    for (var key in obj) {
        if (hasOwn.call(obj, key)) keys.push(key);
    }

    return keys;
}; // based on node assert, original notice:
var pSlice = Array.prototype.slice;

var _functionsHaveNames;

function functionsHaveNames() {
    if (typeof _functionsHaveNames !== 'undefined') {
        return _functionsHaveNames;
    }

    return _functionsHaveNames = function () {
        return function foo() {}.name === 'foo';
    }();
}

function pToString(obj) {
    return Object.prototype.toString.call(obj);
}

function isView(arrbuf) {
    if (buffer.isBuffer(arrbuf)) {
        return false;
    }

    if (typeof global$1.ArrayBuffer !== 'function') {
        return false;
    }

    if (typeof ArrayBuffer.isView === 'function') {
        return ArrayBuffer.isView(arrbuf);
    }

    if (!arrbuf) {
        return false;
    }

    if (arrbuf instanceof DataView) {
        return true;
    }

    if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
        return true;
    }

    return false;
} // 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.


function assert$1(value, message) {
    if (!value) fail(value, true, message, '==', ok);
}
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/; // based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js

function getName(func) {
    if (!util.isFunction(func)) {
        return;
    }

    if (functionsHaveNames()) {
        return func.name;
    }

    var str = func.toString();
    var match = str.match(regex);
    return match && match[1];
}

assert$1.AssertionError = AssertionError;
function AssertionError(options) {
    this.name = 'AssertionError';
    this.actual = options.actual;
    this.expected = options.expected;
    this.operator = options.operator;

    if (options.message) {
        this.message = options.message;
        this.generatedMessage = false;
    } else {
        this.message = getMessage(this);
        this.generatedMessage = true;
    }

    var stackStartFunction = options.stackStartFunction || fail;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, stackStartFunction);
    } else {
        // non v8 browsers so we can have a stacktrace
        var err = new Error();

        if (err.stack) {
            var out = err.stack; // try to strip useless frames

            var fn_name = getName(stackStartFunction);
            var idx = out.indexOf('\n' + fn_name);

            if (idx >= 0) {
                // once we have located the function frame
                // we need to strip out everything before it (and its line)
                var next_line = out.indexOf('\n', idx + 1);
                out = out.substring(next_line + 1);
            }

            this.stack = out;
        }
    }
} // assert.AssertionError instanceof Error

util.inherits(AssertionError, Error);

function truncate(s, n) {
    if (typeof s === 'string') {
        return s.length < n ? s : s.slice(0, n);
    } else {
        return s;
    }
}

function inspect(something) {
    if (functionsHaveNames() || !util.isFunction(something)) {
        return util.inspect(something);
    }

    var rawname = getName(something);
    var name = rawname ? ': ' + rawname : '';
    return '[Function' + name + ']';
}

function getMessage(self) {
    return truncate(inspect(self.actual), 128) + ' ' + self.operator + ' ' + truncate(inspect(self.expected), 128);
} // At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.
// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.


function fail(actual, expected, message, operator, stackStartFunction) {
    throw new AssertionError({
        message: message,
        actual: actual,
        expected: expected,
        operator: operator,
        stackStartFunction: stackStartFunction
    });
} // EXTENSION! allows for well behaved errors defined elsewhere.

assert$1.fail = fail; // 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
    if (!value) fail(value, true, message, '==', ok);
}
assert$1.ok = ok;
// ==.
// assert.equal(actual, expected, message_opt);

assert$1.equal = equal;
function equal(actual, expected, message) {
    if (actual != expected) fail(actual, expected, message, '==', equal);
} // 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert$1.notEqual = notEqual;
function notEqual(actual, expected, message) {
    if (actual == expected) {
        fail(actual, expected, message, '!=', notEqual);
    }
} // 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert$1.deepEqual = deepEqual;
function deepEqual(actual, expected, message) {
    if (!_deepEqual(actual, expected, false)) {
        fail(actual, expected, message, 'deepEqual', deepEqual);
    }
}
assert$1.deepStrictEqual = deepStrictEqual;
function deepStrictEqual(actual, expected, message) {
    if (!_deepEqual(actual, expected, true)) {
        fail(actual, expected, message, 'deepStrictEqual', deepStrictEqual);
    }
}

function _deepEqual(actual, expected, strict, memos) {
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
        return true;
    } else if (buffer.isBuffer(actual) && buffer.isBuffer(expected)) {
        return compare(actual, expected) === 0; // 7.2. If the expected value is a Date object, the actual value is
        // equivalent if it is also a Date object that refers to the same time.
    } else if (util.isDate(actual) && util.isDate(expected)) {
        return actual.getTime() === expected.getTime(); // 7.3 If the expected value is a RegExp object, the actual value is
        // equivalent if it is also a RegExp object with the same source and
        // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
    } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
        return actual.source === expected.source && actual.global === expected.global && actual.multiline === expected.multiline && actual.lastIndex === expected.lastIndex && actual.ignoreCase === expected.ignoreCase; // 7.4. Other pairs that do not both pass typeof value == 'object',
        // equivalence is determined by ==.
    } else if ((actual === null || _typeof(actual) !== 'object') && (expected === null || _typeof(expected) !== 'object')) {
        return strict ? actual === expected : actual == expected; // If both values are instances of typed arrays, wrap their underlying
        // ArrayBuffers in a Buffer each to increase performance
        // This optimization requires the arrays to have the same type as checked by
        // Object.prototype.toString (aka pToString). Never perform binary
        // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
        // bit patterns are not identical.
    } else if (isView(actual) && isView(expected) && pToString(actual) === pToString(expected) && !(actual instanceof Float32Array || actual instanceof Float64Array)) {
        return compare(new Uint8Array(actual.buffer), new Uint8Array(expected.buffer)) === 0; // 7.5 For all other Object pairs, including Array objects, equivalence is
        // determined by having the same number of owned properties (as verified
        // with Object.prototype.hasOwnProperty.call), the same set of keys
        // (although not necessarily the same order), equivalent values for every
        // corresponding key, and an identical 'prototype' property. Note: this
        // accounts for both named and indexed properties on Arrays.
    } else if (buffer.isBuffer(actual) !== buffer.isBuffer(expected)) {
        return false;
    } else {
        memos = memos || {
            actual: [],
            expected: []
        };
        var actualIndex = memos.actual.indexOf(actual);

        if (actualIndex !== -1) {
            if (actualIndex === memos.expected.indexOf(expected)) {
                return true;
            }
        }

        memos.actual.push(actual);
        memos.expected.push(expected);
        return objEquiv(actual, expected, strict, memos);
    }
}

function isArguments(object) {
    return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
    if (a === null || a === undefined || b === null || b === undefined) return false; // if one is a primitive, the other must be same

    if (util.isPrimitive(a) || util.isPrimitive(b)) return a === b;
    if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
    var aIsArgs = isArguments(a);
    var bIsArgs = isArguments(b);
    if (aIsArgs && !bIsArgs || !aIsArgs && bIsArgs) return false;

    if (aIsArgs) {
        a = pSlice.call(a);
        b = pSlice.call(b);
        return _deepEqual(a, b, strict);
    }

    var ka = objectKeys(a);
    var kb = objectKeys(b);
    var key, i; // having the same number of owned properties (keys incorporates
    // hasOwnProperty)

    if (ka.length !== kb.length) return false; //the same set of keys (although not necessarily the same order),

    ka.sort();
    kb.sort(); //~~~cheap key test

    for (i = ka.length - 1; i >= 0; i--) {
        if (ka[i] !== kb[i]) return false;
    } //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test


    for (i = ka.length - 1; i >= 0; i--) {
        key = ka[i];
        if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects)) return false;
    }

    return true;
} // 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);


assert$1.notDeepEqual = notDeepEqual;
function notDeepEqual(actual, expected, message) {
    if (_deepEqual(actual, expected, false)) {
        fail(actual, expected, message, 'notDeepEqual', notDeepEqual);
    }
}
assert$1.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
    if (_deepEqual(actual, expected, true)) {
        fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
    }
} // 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert$1.strictEqual = strictEqual;
function strictEqual(actual, expected, message) {
    if (actual !== expected) {
        fail(actual, expected, message, '===', strictEqual);
    }
} // 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert$1.notStrictEqual = notStrictEqual;
function notStrictEqual(actual, expected, message) {
    if (actual === expected) {
        fail(actual, expected, message, '!==', notStrictEqual);
    }
}

function expectedException(actual, expected) {
    if (!actual || !expected) {
        return false;
    }

    if (Object.prototype.toString.call(expected) == '[object RegExp]') {
        return expected.test(actual);
    }

    try {
        if (actual instanceof expected) {
            return true;
        }
    } catch (e) {// Ignore.  The instanceof check doesn't work for arrow functions.
    }

    if (Error.isPrototypeOf(expected)) {
        return false;
    }

    return expected.call({}, actual) === true;
}

function _tryBlock(block) {
    var error;

    try {
        block();
    } catch (e) {
        error = e;
    }

    return error;
}

function _throws(shouldThrow, block, expected, message) {
    var actual;

    if (typeof block !== 'function') {
        throw new TypeError('"block" argument must be a function');
    }

    if (typeof expected === 'string') {
        message = expected;
        expected = null;
    }

    actual = _tryBlock(block);
    message = (expected && expected.name ? ' (' + expected.name + ').' : '.') + (message ? ' ' + message : '.');

    if (shouldThrow && !actual) {
        fail(actual, expected, 'Missing expected exception' + message);
    }

    var userProvidedMessage = typeof message === 'string';
    var isUnwantedException = !shouldThrow && util.isError(actual);
    var isUnexpectedException = !shouldThrow && actual && !expected;

    if (isUnwantedException && userProvidedMessage && expectedException(actual, expected) || isUnexpectedException) {
        fail(actual, expected, 'Got unwanted exception' + message);
    }

    if (shouldThrow && actual && expected && !expectedException(actual, expected) || !shouldThrow && actual) {
        throw actual;
    }
} // 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);


assert$1.throws = throws;
function throws(block,
                /*optional*/
                error,
                /*optional*/
                message) {
    _throws(true, block, error, message);
} // EXTENSION! This is annoying to write outside this module.

assert$1.doesNotThrow = doesNotThrow;
function doesNotThrow(block,
                      /*optional*/
                      error,
                      /*optional*/
                      message) {
    _throws(false, block, error, message);
}
assert$1.ifError = ifError;
function ifError(err) {
    if (err) throw err;
}

var assert$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': assert$1,
    AssertionError: AssertionError,
    fail: fail,
    ok: ok,
    assert: ok,
    equal: equal,
    notEqual: notEqual,
    deepEqual: deepEqual,
    deepStrictEqual: deepStrictEqual,
    notDeepEqual: notDeepEqual,
    notDeepStrictEqual: notDeepStrictEqual,
    strictEqual: strictEqual,
    notStrictEqual: notStrictEqual,
    throws: throws,
    doesNotThrow: doesNotThrow,
    ifError: ifError
});

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;

function init() {
    inited = true;
    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    for (var i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
    }

    revLookup['-'.charCodeAt(0)] = 62;
    revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray(b64) {
    if (!inited) {
        init();
    }

    var i, j, l, tmp, placeHolders, arr;
    var len = b64.length;

    if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4');
    } // the number of equal signs (place holders)
    // if there are two placeholders, than the two characters before it
    // represent one byte
    // if there is only one, then the three characters before it represent 2 bytes
    // this is just a cheap hack to not do indexOf twice


    placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0; // base64 is 4/3 + up to two characters of the original data

    arr = new Arr(len * 3 / 4 - placeHolders); // if there are placeholders, only get up to the last complete 4 chars

    l = placeHolders > 0 ? len - 4 : len;
    var L = 0;

    for (i = 0, j = 0; i < l; i += 4, j += 3) {
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[L++] = tmp >> 16 & 0xFF;
        arr[L++] = tmp >> 8 & 0xFF;
        arr[L++] = tmp & 0xFF;
    }

    if (placeHolders === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[L++] = tmp & 0xFF;
    } else if (placeHolders === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[L++] = tmp >> 8 & 0xFF;
        arr[L++] = tmp & 0xFF;
    }

    return arr;
}

function tripletToBase64(num) {
    return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];

    for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
        output.push(tripletToBase64(tmp));
    }

    return output.join('');
}

function fromByteArray(uint8) {
    if (!inited) {
        init();
    }

    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

    var output = '';
    var parts = [];
    var maxChunkLength = 16383; // must be multiple of 3
    // go through the array every three bytes, we'll deal with trailing stuff later

    for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
        parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    } // pad the end with zeros, but make sure to not forget the extra bytes


    if (extraBytes === 1) {
        tmp = uint8[len - 1];
        output += lookup[tmp >> 2];
        output += lookup[tmp << 4 & 0x3F];
        output += '==';
    } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        output += lookup[tmp >> 10];
        output += lookup[tmp >> 4 & 0x3F];
        output += lookup[tmp << 2 & 0x3F];
        output += '=';
    }

    parts.push(output);
    return parts.join('');
}

function read(buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;

    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;

    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    if (e === 0) {
        e = 1 - eBias;
    } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
    }

    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}
function write(buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);

    if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
    } else {
        e = Math.floor(Math.log(value) / Math.LN2);

        if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
        }

        if (e + eBias >= 1) {
            value += rt / c;
        } else {
            value += rt * Math.pow(2, 1 - eBias);
        }

        if (value * c >= 2) {
            e++;
            c /= 2;
        }

        if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
        } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
        } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
        }
    }

    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

    e = e << mLen | m;
    eLen += mLen;

    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

    buffer[offset + i - d] |= s * 128;
}

var toString$2 = {}.toString;
var isArray$2 = Array.isArray || function (arr) {
    return toString$2.call(arr) == '[object Array]';
};

var INSPECT_MAX_BYTES = 50;
/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */

Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined ? global$1.TYPED_ARRAY_SUPPORT : true;
/*
 * Export kMaxLength after typed array support is determined.
 */

kMaxLength();

function kMaxLength() {
    return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
}

function createBuffer(that, length) {
    if (kMaxLength() < length) {
        throw new RangeError('Invalid typed array length');
    }

    if (Buffer.TYPED_ARRAY_SUPPORT) {
        // Return an augmented `Uint8Array` instance, for best performance
        that = new Uint8Array(length);
        that.__proto__ = Buffer.prototype;
    } else {
        // Fallback: Return an object instance of the Buffer class
        if (that === null) {
            that = new Buffer(length);
        }

        that.length = length;
    }

    return that;
}
/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */


function Buffer(arg, encodingOrOffset, length) {
    if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
        return new Buffer(arg, encodingOrOffset, length);
    } // Common case.


    if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
            throw new Error('If encoding is specified then the first argument must be a string');
        }

        return allocUnsafe(this, arg);
    }

    return from(this, arg, encodingOrOffset, length);
}
Buffer.poolSize = 8192; // not used by this implementation
// TODO: Legacy, not needed anymore. Remove in next major version.

Buffer._augment = function (arr) {
    arr.__proto__ = Buffer.prototype;
    return arr;
};

function from(that, value, encodingOrOffset, length) {
    if (typeof value === 'number') {
        throw new TypeError('"value" argument must not be a number');
    }

    if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
        return fromArrayBuffer(that, value, encodingOrOffset, length);
    }

    if (typeof value === 'string') {
        return fromString(that, value, encodingOrOffset);
    }

    return fromObject(that, value);
}
/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/


Buffer.from = function (value, encodingOrOffset, length) {
    return from(null, value, encodingOrOffset, length);
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
    Buffer.prototype.__proto__ = Uint8Array.prototype;
    Buffer.__proto__ = Uint8Array;

    if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) ;
}

function assertSize(size) {
    if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be a number');
    } else if (size < 0) {
        throw new RangeError('"size" argument must not be negative');
    }
}

function alloc(that, size, fill, encoding) {
    assertSize(size);

    if (size <= 0) {
        return createBuffer(that, size);
    }

    if (fill !== undefined) {
        // Only pay attention to encoding if it's a string. This
        // prevents accidentally sending in a number that would
        // be interpretted as a start offset.
        return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
    }

    return createBuffer(that, size);
}
/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/


Buffer.alloc = function (size, fill, encoding) {
    return alloc(null, size, fill, encoding);
};

function allocUnsafe(that, size) {
    assertSize(size);
    that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);

    if (!Buffer.TYPED_ARRAY_SUPPORT) {
        for (var i = 0; i < size; ++i) {
            that[i] = 0;
        }
    }

    return that;
}
/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */


Buffer.allocUnsafe = function (size) {
    return allocUnsafe(null, size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */


Buffer.allocUnsafeSlow = function (size) {
    return allocUnsafe(null, size);
};

function fromString(that, string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') {
        encoding = 'utf8';
    }

    if (!Buffer.isEncoding(encoding)) {
        throw new TypeError('"encoding" must be a valid string encoding');
    }

    var length = byteLength(string, encoding) | 0;
    that = createBuffer(that, length);
    var actual = that.write(string, encoding);

    if (actual !== length) {
        // Writing a hex string, for example, that contains invalid characters will
        // cause everything after the first invalid character to be ignored. (e.g.
        // 'abxxcd' will be treated as 'ab')
        that = that.slice(0, actual);
    }

    return that;
}

function fromArrayLike(that, array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0;
    that = createBuffer(that, length);

    for (var i = 0; i < length; i += 1) {
        that[i] = array[i] & 255;
    }

    return that;
}

function fromArrayBuffer(that, array, byteOffset, length) {
    array.byteLength; // this throws if `array` is not a valid ArrayBuffer

    if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('\'offset\' is out of bounds');
    }

    if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('\'length\' is out of bounds');
    }

    if (byteOffset === undefined && length === undefined) {
        array = new Uint8Array(array);
    } else if (length === undefined) {
        array = new Uint8Array(array, byteOffset);
    } else {
        array = new Uint8Array(array, byteOffset, length);
    }

    if (Buffer.TYPED_ARRAY_SUPPORT) {
        // Return an augmented `Uint8Array` instance, for best performance
        that = array;
        that.__proto__ = Buffer.prototype;
    } else {
        // Fallback: Return an object instance of the Buffer class
        that = fromArrayLike(that, array);
    }

    return that;
}

function fromObject(that, obj) {
    if (internalIsBuffer(obj)) {
        var len = checked(obj.length) | 0;
        that = createBuffer(that, len);

        if (that.length === 0) {
            return that;
        }

        obj.copy(that, 0, 0, len);
        return that;
    }

    if (obj) {
        if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
            if (typeof obj.length !== 'number' || isnan(obj.length)) {
                return createBuffer(that, 0);
            }

            return fromArrayLike(that, obj);
        }

        if (obj.type === 'Buffer' && isArray$2(obj.data)) {
            return fromArrayLike(that, obj.data);
        }
    }

    throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}

function checked(length) {
    // Note: cannot use `length < kMaxLength()` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= kMaxLength()) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
    }

    return length | 0;
}
Buffer.isBuffer = isBuffer$3;

function internalIsBuffer(b) {
    return !!(b != null && b._isBuffer);
}

Buffer.compare = function compare(a, b) {
    if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
        throw new TypeError('Arguments must be Buffers');
    }

    if (a === b) return 0;
    var x = a.length;
    var y = b.length;

    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
        }
    }

    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return true;

        default:
            return false;
    }
};

Buffer.concat = function concat(list, length) {
    if (!isArray$2(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
    }

    if (list.length === 0) {
        return Buffer.alloc(0);
    }

    var i;

    if (length === undefined) {
        length = 0;

        for (i = 0; i < list.length; ++i) {
            length += list[i].length;
        }
    }

    var buffer = Buffer.allocUnsafe(length);
    var pos = 0;

    for (i = 0; i < list.length; ++i) {
        var buf = list[i];

        if (!internalIsBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
        }

        buf.copy(buffer, pos);
        pos += buf.length;
    }

    return buffer;
};

function byteLength(string, encoding) {
    if (internalIsBuffer(string)) {
        return string.length;
    }

    if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
        return string.byteLength;
    }

    if (typeof string !== 'string') {
        string = '' + string;
    }

    var len = string.length;
    if (len === 0) return 0; // Use a for loop to avoid recursion

    var loweredCase = false;

    for (;;) {
        switch (encoding) {
            case 'ascii':
            case 'latin1':
            case 'binary':
                return len;

            case 'utf8':
            case 'utf-8':
            case undefined:
                return utf8ToBytes(string).length;

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return len * 2;

            case 'hex':
                return len >>> 1;

            case 'base64':
                return base64ToBytes(string).length;

            default:
                if (loweredCase) return utf8ToBytes(string).length; // assume utf8

                encoding = ('' + encoding).toLowerCase();
                loweredCase = true;
        }
    }
}

Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
    var loweredCase = false; // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
    // property of a typed array.
    // This behaves neither like String nor Uint8Array in that we set start/end
    // to their upper/lower bounds if the value passed is out of range.
    // undefined is handled specially as per ECMA-262 6th Edition,
    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.

    if (start === undefined || start < 0) {
        start = 0;
    } // Return early if start > this.length. Done here to prevent potential uint32
    // coercion fail below.


    if (start > this.length) {
        return '';
    }

    if (end === undefined || end > this.length) {
        end = this.length;
    }

    if (end <= 0) {
        return '';
    } // Force coersion to uint32. This will also coerce falsey/NaN values to 0.


    end >>>= 0;
    start >>>= 0;

    if (end <= start) {
        return '';
    }

    if (!encoding) encoding = 'utf8';

    while (true) {
        switch (encoding) {
            case 'hex':
                return hexSlice(this, start, end);

            case 'utf8':
            case 'utf-8':
                return utf8Slice(this, start, end);

            case 'ascii':
                return asciiSlice(this, start, end);

            case 'latin1':
            case 'binary':
                return latin1Slice(this, start, end);

            case 'base64':
                return base64Slice(this, start, end);

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return utf16leSlice(this, start, end);

            default:
                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
                encoding = (encoding + '').toLowerCase();
                loweredCase = true;
        }
    }
} // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.


Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
    var i = b[n];
    b[n] = b[m];
    b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
    var len = this.length;

    if (len % 2 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 16-bits');
    }

    for (var i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
    }

    return this;
};

Buffer.prototype.swap32 = function swap32() {
    var len = this.length;

    if (len % 4 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 32-bits');
    }

    for (var i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
    }

    return this;
};

Buffer.prototype.swap64 = function swap64() {
    var len = this.length;

    if (len % 8 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 64-bits');
    }

    for (var i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
    }

    return this;
};

Buffer.prototype.toString = function toString() {
    var length = this.length | 0;
    if (length === 0) return '';
    if (arguments.length === 0) return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
};

Buffer.prototype.equals = function equals(b) {
    if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer');
    if (this === b) return true;
    return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
    var str = '';
    var max = INSPECT_MAX_BYTES;

    if (this.length > 0) {
        str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
        if (this.length > max) str += ' ... ';
    }

    return '<Buffer ' + str + '>';
};

Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (!internalIsBuffer(target)) {
        throw new TypeError('Argument must be a Buffer');
    }

    if (start === undefined) {
        start = 0;
    }

    if (end === undefined) {
        end = target ? target.length : 0;
    }

    if (thisStart === undefined) {
        thisStart = 0;
    }

    if (thisEnd === undefined) {
        thisEnd = this.length;
    }

    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError('out of range index');
    }

    if (thisStart >= thisEnd && start >= end) {
        return 0;
    }

    if (thisStart >= thisEnd) {
        return -1;
    }

    if (start >= end) {
        return 1;
    }

    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target) return 0;
    var x = thisEnd - thisStart;
    var y = end - start;
    var len = Math.min(x, y);
    var thisCopy = this.slice(thisStart, thisEnd);
    var targetCopy = target.slice(start, end);

    for (var i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
        }
    }

    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
}; // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf


function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
    // Empty buffer means no match
    if (buffer.length === 0) return -1; // Normalize byteOffset

    if (typeof byteOffset === 'string') {
        encoding = byteOffset;
        byteOffset = 0;
    } else if (byteOffset > 0x7fffffff) {
        byteOffset = 0x7fffffff;
    } else if (byteOffset < -0x80000000) {
        byteOffset = -0x80000000;
    }

    byteOffset = +byteOffset; // Coerce to Number.

    if (isNaN(byteOffset)) {
        // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
        byteOffset = dir ? 0 : buffer.length - 1;
    } // Normalize byteOffset: negative offsets start from the end of the buffer


    if (byteOffset < 0) byteOffset = buffer.length + byteOffset;

    if (byteOffset >= buffer.length) {
        if (dir) return -1;else byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;else return -1;
    } // Normalize val


    if (typeof val === 'string') {
        val = Buffer.from(val, encoding);
    } // Finally, search either indexOf (if dir is true) or lastIndexOf


    if (internalIsBuffer(val)) {
        // Special case: looking for empty string/buffer always fails
        if (val.length === 0) {
            return -1;
        }

        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === 'number') {
        val = val & 0xFF; // Search for a byte value [0-255]

        if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
            if (dir) {
                return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
                return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
        }

        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
    }

    throw new TypeError('val must be string, number or Buffer');
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    var indexSize = 1;
    var arrLength = arr.length;
    var valLength = val.length;

    if (encoding !== undefined) {
        encoding = String(encoding).toLowerCase();

        if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
            if (arr.length < 2 || val.length < 2) {
                return -1;
            }

            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
        }
    }

    function read(buf, i) {
        if (indexSize === 1) {
            return buf[i];
        } else {
            return buf.readUInt16BE(i * indexSize);
        }
    }

    var i;

    if (dir) {
        var foundIndex = -1;

        for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                if (foundIndex === -1) foundIndex = i;
                if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
                if (foundIndex !== -1) i -= i - foundIndex;
                foundIndex = -1;
            }
        }
    } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;

        for (i = byteOffset; i >= 0; i--) {
            var found = true;

            for (var j = 0; j < valLength; j++) {
                if (read(arr, i + j) !== read(val, j)) {
                    found = false;
                    break;
                }
            }

            if (found) return i;
        }
    }

    return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    var remaining = buf.length - offset;

    if (!length) {
        length = remaining;
    } else {
        length = Number(length);

        if (length > remaining) {
            length = remaining;
        }
    } // must be an even number of digits


    var strLen = string.length;
    if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

    if (length > strLen / 2) {
        length = strLen / 2;
    }

    for (var i = 0; i < length; ++i) {
        var parsed = parseInt(string.substr(i * 2, 2), 16);
        if (isNaN(parsed)) return i;
        buf[offset + i] = parsed;
    }

    return i;
}

function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf, string, offset, length) {
    return asciiWrite(buf, string, offset, length);
}

function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}

Buffer.prototype.write = function write(string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
        encoding = 'utf8';
        length = this.length;
        offset = 0; // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
        encoding = offset;
        length = this.length;
        offset = 0; // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
        offset = offset | 0;

        if (isFinite(length)) {
            length = length | 0;
            if (encoding === undefined) encoding = 'utf8';
        } else {
            encoding = length;
            length = undefined;
        } // legacy write(string, encoding, offset, length) - remove in v0.13

    } else {
        throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
    }

    var remaining = this.length - offset;
    if (length === undefined || length > remaining) length = remaining;

    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError('Attempt to write outside buffer bounds');
    }

    if (!encoding) encoding = 'utf8';
    var loweredCase = false;

    for (;;) {
        switch (encoding) {
            case 'hex':
                return hexWrite(this, string, offset, length);

            case 'utf8':
            case 'utf-8':
                return utf8Write(this, string, offset, length);

            case 'ascii':
                return asciiWrite(this, string, offset, length);

            case 'latin1':
            case 'binary':
                return latin1Write(this, string, offset, length);

            case 'base64':
                // Warning: maxLength not taken into account in base64Write
                return base64Write(this, string, offset, length);

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return ucs2Write(this, string, offset, length);

            default:
                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
                encoding = ('' + encoding).toLowerCase();
                loweredCase = true;
        }
    }
};

Buffer.prototype.toJSON = function toJSON() {
    return {
        type: 'Buffer',
        data: Array.prototype.slice.call(this._arr || this, 0)
    };
};

function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
        return fromByteArray(buf);
    } else {
        return fromByteArray(buf.slice(start, end));
    }
}

function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    var res = [];
    var i = start;

    while (i < end) {
        var firstByte = buf[i];
        var codePoint = null;
        var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

        if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;

            switch (bytesPerSequence) {
                case 1:
                    if (firstByte < 0x80) {
                        codePoint = firstByte;
                    }

                    break;

                case 2:
                    secondByte = buf[i + 1];

                    if ((secondByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;

                        if (tempCodePoint > 0x7F) {
                            codePoint = tempCodePoint;
                        }
                    }

                    break;

                case 3:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];

                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;

                        if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                            codePoint = tempCodePoint;
                        }
                    }

                    break;

                case 4:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    fourthByte = buf[i + 3];

                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;

                        if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                            codePoint = tempCodePoint;
                        }
                    }

            }
        }

        if (codePoint === null) {
            // we did not generate a valid codePoint so insert a
            // replacement char (U+FFFD) and advance only 1 byte
            codePoint = 0xFFFD;
            bytesPerSequence = 1;
        } else if (codePoint > 0xFFFF) {
            // encode to utf16 (surrogate pair dance)
            codePoint -= 0x10000;
            res.push(codePoint >>> 10 & 0x3FF | 0xD800);
            codePoint = 0xDC00 | codePoint & 0x3FF;
        }

        res.push(codePoint);
        i += bytesPerSequence;
    }

    return decodeCodePointsArray(res);
} // Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety


var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
    var len = codePoints.length;

    if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
    } // Decode in chunks to avoid "call stack size exceeded".


    var res = '';
    var i = 0;

    while (i < len) {
        res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    }

    return res;
}

function asciiSlice(buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);

    for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 0x7F);
    }

    return ret;
}

function latin1Slice(buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);

    for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
    }

    return ret;
}

function hexSlice(buf, start, end) {
    var len = buf.length;
    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;
    var out = '';

    for (var i = start; i < end; ++i) {
        out += toHex(buf[i]);
    }

    return out;
}

function utf16leSlice(buf, start, end) {
    var bytes = buf.slice(start, end);
    var res = '';

    for (var i = 0; i < bytes.length; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }

    return res;
}

Buffer.prototype.slice = function slice(start, end) {
    var len = this.length;
    start = ~~start;
    end = end === undefined ? len : ~~end;

    if (start < 0) {
        start += len;
        if (start < 0) start = 0;
    } else if (start > len) {
        start = len;
    }

    if (end < 0) {
        end += len;
        if (end < 0) end = 0;
    } else if (end > len) {
        end = len;
    }

    if (end < start) end = start;
    var newBuf;

    if (Buffer.TYPED_ARRAY_SUPPORT) {
        newBuf = this.subarray(start, end);
        newBuf.__proto__ = Buffer.prototype;
    } else {
        var sliceLen = end - start;
        newBuf = new Buffer(sliceLen, undefined);

        for (var i = 0; i < sliceLen; ++i) {
            newBuf[i] = this[i + start];
        }
    }

    return newBuf;
};
/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */


function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}

Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;

    while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul;
    }

    return val;
};

Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;

    if (!noAssert) {
        checkOffset(offset, byteLength, this.length);
    }

    var val = this[offset + --byteLength];
    var mul = 1;

    while (byteLength > 0 && (mul *= 0x100)) {
        val += this[offset + --byteLength] * mul;
    }

    return val;
};

Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
};

Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
};

Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
};

Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};

Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;

    while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul;
    }

    mul *= 0x80;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
    return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var i = byteLength;
    var mul = 1;
    var val = this[offset + --i];

    while (i > 0 && (mul *= 0x100)) {
        val += this[offset + --i] * mul;
    }

    mul *= 0x80;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
    return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 0x80)) return this[offset];
    return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset] | this[offset + 1] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset + 1] | this[offset] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length);
    return read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length);
    return read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
    if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
}

Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;
    byteLength = byteLength | 0;

    if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }

    var mul = 1;
    var i = 0;
    this[offset] = value & 0xFF;

    while (++i < byteLength && (mul *= 0x100)) {
        this[offset + i] = value / mul & 0xFF;
    }

    return offset + byteLength;
};

Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;
    byteLength = byteLength | 0;

    if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }

    var i = byteLength - 1;
    var mul = 1;
    this[offset + i] = value & 0xFF;

    while (--i >= 0 && (mul *= 0x100)) {
        this[offset + i] = value / mul & 0xFF;
    }

    return offset + byteLength;
};

Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
    this[offset] = value & 0xff;
    return offset + 1;
};

function objectWriteUInt16(buf, value, offset, littleEndian) {
    if (value < 0) value = 0xffff + value + 1;

    for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
        buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
    }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);

    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 0xff;
        this[offset + 1] = value >>> 8;
    } else {
        objectWriteUInt16(this, value, offset, true);
    }

    return offset + 2;
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);

    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 8;
        this[offset + 1] = value & 0xff;
    } else {
        objectWriteUInt16(this, value, offset, false);
    }

    return offset + 2;
};

function objectWriteUInt32(buf, value, offset, littleEndian) {
    if (value < 0) value = 0xffffffff + value + 1;

    for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
        buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
    }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);

    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 0xff;
    } else {
        objectWriteUInt32(this, value, offset, true);
    }

    return offset + 4;
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);

    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 0xff;
    } else {
        objectWriteUInt32(this, value, offset, false);
    }

    return offset + 4;
};

Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;

    if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }

    var i = 0;
    var mul = 1;
    var sub = 0;
    this[offset] = value & 0xFF;

    while (++i < byteLength && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
        }

        this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }

    return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;

    if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }

    var i = byteLength - 1;
    var mul = 1;
    var sub = 0;
    this[offset + i] = value & 0xFF;

    while (--i >= 0 && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
        }

        this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }

    return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
    if (value < 0) value = 0xff + value + 1;
    this[offset] = value & 0xff;
    return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);

    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 0xff;
        this[offset + 1] = value >>> 8;
    } else {
        objectWriteUInt16(this, value, offset, true);
    }

    return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);

    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 8;
        this[offset + 1] = value & 0xff;
    } else {
        objectWriteUInt16(this, value, offset, false);
    }

    return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);

    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 0xff;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
    } else {
        objectWriteUInt32(this, value, offset, true);
    }

    return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    if (value < 0) value = 0xffffffff + value + 1;

    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 0xff;
    } else {
        objectWriteUInt32(this, value, offset, false);
    }

    return offset + 4;
};

function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
    if (offset < 0) throw new RangeError('Index out of range');
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
        checkIEEE754(buf, value, offset, 4);
    }

    write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
        checkIEEE754(buf, value, offset, 8);
    }

    write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
}; // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)


Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

    if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds');
    }

    if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
    if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

    if (end > this.length) end = this.length;

    if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
    }

    var len = end - start;
    var i;

    if (this === target && start < targetStart && targetStart < end) {
        // descending copy from end
        for (i = len - 1; i >= 0; --i) {
            target[i + targetStart] = this[i + start];
        }
    } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
        // ascending copy from start
        for (i = 0; i < len; ++i) {
            target[i + targetStart] = this[i + start];
        }
    } else {
        Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
    }

    return len;
}; // Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])


Buffer.prototype.fill = function fill(val, start, end, encoding) {
    // Handle string cases:
    if (typeof val === 'string') {
        if (typeof start === 'string') {
            encoding = start;
            start = 0;
            end = this.length;
        } else if (typeof end === 'string') {
            encoding = end;
            end = this.length;
        }

        if (val.length === 1) {
            var code = val.charCodeAt(0);

            if (code < 256) {
                val = code;
            }
        }

        if (encoding !== undefined && typeof encoding !== 'string') {
            throw new TypeError('encoding must be a string');
        }

        if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
            throw new TypeError('Unknown encoding: ' + encoding);
        }
    } else if (typeof val === 'number') {
        val = val & 255;
    } // Invalid ranges are not set to a default, so can range check early.


    if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError('Out of range index');
    }

    if (end <= start) {
        return this;
    }

    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;
    if (!val) val = 0;
    var i;

    if (typeof val === 'number') {
        for (i = start; i < end; ++i) {
            this[i] = val;
        }
    } else {
        var bytes = internalIsBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
        var len = bytes.length;

        for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
        }
    }

    return this;
}; // HELPER FUNCTIONS
// ================


var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean(str) {
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = stringtrim(str).replace(INVALID_BASE64_RE, ''); // Node converts strings with length < 2 to ''

    if (str.length < 2) return ''; // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not

    while (str.length % 4 !== 0) {
        str = str + '=';
    }

    return str;
}

function stringtrim(str) {
    if (str.trim) return str.trim();
    return str.replace(/^\s+|\s+$/g, '');
}

function toHex(n) {
    if (n < 16) return '0' + n.toString(16);
    return n.toString(16);
}

function utf8ToBytes(string, units) {
    units = units || Infinity;
    var codePoint;
    var length = string.length;
    var leadSurrogate = null;
    var bytes = [];

    for (var i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i); // is surrogate component

        if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (!leadSurrogate) {
                // no lead yet
                if (codePoint > 0xDBFF) {
                    // unexpected trail
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    continue;
                } else if (i + 1 === length) {
                    // unpaired lead
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    continue;
                } // valid lead


                leadSurrogate = codePoint;
                continue;
            } // 2 leads in a row


            if (codePoint < 0xDC00) {
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                leadSurrogate = codePoint;
                continue;
            } // valid surrogate pair


            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
        } else if (leadSurrogate) {
            // valid bmp char, but last char was a lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        }

        leadSurrogate = null; // encode utf8

        if (codePoint < 0x80) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
        } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
        } else {
            throw new Error('Invalid code point');
        }
    }

    return bytes;
}

function asciiToBytes(str) {
    var byteArray = [];

    for (var i = 0; i < str.length; ++i) {
        // Node's code seems to be doing this and not & 0x7F..
        byteArray.push(str.charCodeAt(i) & 0xFF);
    }

    return byteArray;
}

function utf16leToBytes(str, units) {
    var c, hi, lo;
    var byteArray = [];

    for (var i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
    }

    return byteArray;
}

function base64ToBytes(str) {
    return toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
    for (var i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
    }

    return i;
}

function isnan(val) {
    return val !== val; // eslint-disable-line no-self-compare
} // the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually


function isBuffer$3(obj) {
    return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer$1(obj));
}

function isFastBuffer(obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
} // For Node v0.10 support. Remove this eventually.


function isSlowBuffer$1(obj) {
    return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0));
}

var toString$1 = Object.prototype.toString;
/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

var componentType = function componentType(val) {
    switch (toString$1.call(val)) {
        case '[object Date]':
            return 'date';

        case '[object RegExp]':
            return 'regexp';

        case '[object Arguments]':
            return 'arguments';

        case '[object Array]':
            return 'array';

        case '[object Error]':
            return 'error';
    }

    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (val !== val) return 'nan';
    if (val && val.nodeType === 1) return 'element';
    if (isBuffer$2(val)) return 'buffer';
    val = val.valueOf ? val.valueOf() : Object.prototype.valueOf.apply(val);
    return _typeof(val);
}; // code borrowed from https://github.com/feross/is-buffer/blob/master/index.js


function isBuffer$2(obj) {
    return !!(obj != null && (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
        obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)));
}

/**
 * Join `arr` with the trailing `str` defaulting to "and",
 * and `sep` string defaulting to ", ".
 *
 * @param {Array} arr
 * @param {String} str
 * @param {String} sep
 * @return {String}
 * @api public
 */

var joinComponent = function joinComponent(arr, str, sep) {
    str = str || 'and';
    sep = sep || ', ';
    if (arr.length < 2) return arr[0] || '';
    var oxford = str.slice(0, 2) === sep;

    if (!oxford) {
        str = ' ' + str;
    } else if (arr.length == 2) {
        str = str.slice(1);
    }

    return arr.slice(0, -1).join(sep) + str + ' ' + arr[arr.length - 1];
};

var require$$2 = /*@__PURE__*/getAugmentedNamespace(assert$2);

var type = componentType;
var join = joinComponent;
var assert = require$$2; // Segment messages can be a maximum of 32kb.

var MAX_SIZE = 32 << 10;
var looselyValidateEvent_1 = looselyValidateEvent;
/**
 * Validate an event.
 */

function looselyValidateEvent(event, type) {
    validateGenericEvent(event);
    type = type || event.type;
    assert(type, 'You must pass an event type.');

    switch (type) {
        case 'track':
            return validateTrackEvent(event);

        case 'group':
            return validateGroupEvent(event);

        case 'identify':
            return validateIdentifyEvent(event);

        case 'page':
            return validatePageEvent(event);

        case 'screen':
            return validateScreenEvent(event);

        case 'alias':
            return validateAliasEvent(event);

        default:
            assert(0, 'Invalid event type: "' + type + '"');
    }
}
/**
 * Validate a "track" event.
 */


function validateTrackEvent(event) {
    assert(event.anonymousId || event.userId, 'You must pass either an "anonymousId" or a "userId".');
    assert(event.event, 'You must pass an "event".');
}
/**
 * Validate a "group" event.
 */


function validateGroupEvent(event) {
    assert(event.anonymousId || event.userId, 'You must pass either an "anonymousId" or a "userId".');
    assert(event.groupId, 'You must pass a "groupId".');
}
/**
 * Validate a "identify" event.
 */


function validateIdentifyEvent(event) {
    assert(event.anonymousId || event.userId, 'You must pass either an "anonymousId" or a "userId".');
}
/**
 * Validate a "page" event.
 */


function validatePageEvent(event) {
    assert(event.anonymousId || event.userId, 'You must pass either an "anonymousId" or a "userId".');
}
/**
 * Validate a "screen" event.
 */


function validateScreenEvent(event) {
    assert(event.anonymousId || event.userId, 'You must pass either an "anonymousId" or a "userId".');
}
/**
 * Validate an "alias" event.
 */


function validateAliasEvent(event) {
    assert(event.userId, 'You must pass a "userId".');
    assert(event.previousId, 'You must pass a "previousId".');
}
/**
 * Validation rules.
 */


var genericValidationRules = {
    anonymousId: ['string', 'number'],
    category: 'string',
    context: 'object',
    event: 'string',
    groupId: ['string', 'number'],
    integrations: 'object',
    name: 'string',
    previousId: ['string', 'number'],
    timestamp: 'date',
    userId: ['string', 'number'],
    type: 'string'
};
/**
 * Validate an event object.
 */

function validateGenericEvent(event) {
    assert(type(event) === 'object', 'You must pass a message object.');
    var json = JSON.stringify(event); // Strings are variable byte encoded, so json.length is not sufficient.

    assert(Buffer.byteLength(json, 'utf8') < MAX_SIZE, 'Your message must be < 32kb.');

    for (var key in genericValidationRules) {
        var val = event[key];
        if (!val) continue;
        var rule = genericValidationRules[key];

        if (type(rule) !== 'array') {
            rule = [rule];
        }

        var a = rule[0] === 'object' ? 'an' : 'a';
        assert(rule.some(function (e) {
            return type(val) === e;
        }), '"' + key + '" must be ' + a + ' ' + join(rule, 'or') + '.');
    }
}

var axios$3 = {exports: {}};

var axios$2 = {exports: {}};

var bind$2 = function bind(fn, thisArg) {
    return function wrap() {
        var args = new Array(arguments.length);

        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
        }

        return fn.apply(thisArg, args);
    };
};

var bind$1 = bind$2; // utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString; // eslint-disable-next-line func-names

var kindOf = function (cache) {
    // eslint-disable-next-line func-names
    return function (thing) {
        var str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    };
}(Object.create(null));

function kindOfTest(type) {
    type = type.toLowerCase();
    return function isKindOf(thing) {
        return kindOf(thing) === type;
    };
}
/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */


function isArray$1(val) {
    return Array.isArray(val);
}
/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */


function isUndefined(val) {
    return typeof val === 'undefined';
}
/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */


function isBuffer$1(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}
/**
 * Determine if a value is an ArrayBuffer
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */


var isArrayBuffer = kindOfTest('ArrayBuffer');
/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */

function isArrayBufferView(val) {
    var result;

    if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
    } else {
        result = val && val.buffer && isArrayBuffer(val.buffer);
    }

    return result;
}
/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */


function isString$1(val) {
    return typeof val === 'string';
}
/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */


function isNumber(val) {
    return typeof val === 'number';
}
/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */


function isObject(val) {
    return val !== null && _typeof(val) === 'object';
}
/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */


function isPlainObject(val) {
    if (kindOf(val) !== 'object') {
        return false;
    }

    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
}
/**
 * Determine if a value is a Date
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */


var isDate = kindOfTest('Date');
/**
 * Determine if a value is a File
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */

var isFile = kindOfTest('File');
/**
 * Determine if a value is a Blob
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */

var isBlob = kindOfTest('Blob');
/**
 * Determine if a value is a FileList
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */

var isFileList = kindOfTest('FileList');
/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */

function isFunction(val) {
    return toString.call(val) === '[object Function]';
}
/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */


function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
}
/**
 * Determine if a value is a FormData
 *
 * @param {Object} thing The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */


function isFormData(thing) {
    var pattern = '[object FormData]';
    return thing && (typeof FormData === 'function' && thing instanceof FormData || toString.call(thing) === pattern || isFunction(thing.toString) && thing.toString() === pattern);
}
/**
 * Determine if a value is a URLSearchParams object
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */


var isURLSearchParams = kindOfTest('URLSearchParams');
/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */

function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}
/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */


function isStandardBrowserEnv() {
    if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' || navigator.product === 'NativeScript' || navigator.product === 'NS')) {
        return false;
    }

    return typeof window !== 'undefined' && typeof document !== 'undefined';
}
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */


function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
        return;
    } // Force an array if not already something iterable


    if (_typeof(obj) !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
    }

    if (isArray$1(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
        }
    } else {
        // Iterate over object keys
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                fn.call(null, obj[key], key, obj);
            }
        }
    }
}
/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */


function
/* obj1, obj2, obj3, ... */
merge() {
    var result = {};

    function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
            result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
            result[key] = merge({}, val);
        } else if (isArray$1(val)) {
            result[key] = val.slice();
        } else {
            result[key] = val;
        }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
    }

    return result;
}
/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */


function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
            a[key] = bind$1(val, thisArg);
        } else {
            a[key] = val;
        }
    });
    return a;
}
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */


function stripBOM(content) {
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }

    return content;
}
/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 */


function inherits(constructor, superConstructor, props, descriptors) {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors);
    constructor.prototype.constructor = constructor;
    props && _extends(constructor.prototype, props);
}
/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function} [filter]
 * @returns {Object}
 */


function toFlatObject(sourceObj, destObj, filter) {
    var props;
    var i;
    var prop;
    var merged = {};
    destObj = destObj || {};

    do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;

        while (i-- > 0) {
            prop = props[i];

            if (!merged[prop]) {
                destObj[prop] = sourceObj[prop];
                merged[prop] = true;
            }
        }

        sourceObj = Object.getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

    return destObj;
}
/*
 * determines whether a string ends with the characters of a specified string
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 * @returns {boolean}
 */


function endsWith(str, searchString, position) {
    str = String(str);

    if (position === undefined || position > str.length) {
        position = str.length;
    }

    position -= searchString.length;
    var lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
}
/**
 * Returns new array from array like object
 * @param {*} [thing]
 * @returns {Array}
 */


function toArray(thing) {
    if (!thing) return null;
    var i = thing.length;
    if (isUndefined(i)) return null;
    var arr = new Array(i);

    while (i-- > 0) {
        arr[i] = thing[i];
    }

    return arr;
} // eslint-disable-next-line func-names


var isTypedArray = function (TypedArray) {
    // eslint-disable-next-line func-names
    return function (thing) {
        return TypedArray && thing instanceof TypedArray;
    };
}(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

var utils$9 = {
    isArray: isArray$1,
    isArrayBuffer: isArrayBuffer,
    isBuffer: isBuffer$1,
    isFormData: isFormData,
    isArrayBufferView: isArrayBufferView,
    isString: isString$1,
    isNumber: isNumber,
    isObject: isObject,
    isPlainObject: isPlainObject,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isFunction: isFunction,
    isStream: isStream,
    isURLSearchParams: isURLSearchParams,
    isStandardBrowserEnv: isStandardBrowserEnv,
    forEach: forEach,
    merge: merge,
    extend: extend,
    trim: trim,
    stripBOM: stripBOM,
    inherits: inherits,
    toFlatObject: toFlatObject,
    kindOf: kindOf,
    kindOfTest: kindOfTest,
    endsWith: endsWith,
    toArray: toArray,
    isTypedArray: isTypedArray,
    isFileList: isFileList
};

var utils$8 = utils$9;

function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}
/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */


var buildURL$1 = function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
        return url;
    }

    var serializedParams;

    if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
    } else if (utils$8.isURLSearchParams(params)) {
        serializedParams = params.toString();
    } else {
        var parts = [];
        utils$8.forEach(params, function serialize(val, key) {
            if (val === null || typeof val === 'undefined') {
                return;
            }

            if (utils$8.isArray(val)) {
                key = key + '[]';
            } else {
                val = [val];
            }

            utils$8.forEach(val, function parseValue(v) {
                if (utils$8.isDate(v)) {
                    v = v.toISOString();
                } else if (utils$8.isObject(v)) {
                    v = JSON.stringify(v);
                }

                parts.push(encode(key) + '=' + encode(v));
            });
        });
        serializedParams = parts.join('&');
    }

    if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');

        if (hashmarkIndex !== -1) {
            url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
};

var utils$7 = utils$9;

function InterceptorManager$1() {
    this.handlers = [];
}
/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */


InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
    this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
};
/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */


InterceptorManager$1.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
        this.handlers[id] = null;
    }
};
/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */


InterceptorManager$1.prototype.forEach = function forEach(fn) {
    utils$7.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
            fn(h);
        }
    });
};

var InterceptorManager_1 = InterceptorManager$1;

var utils$6 = utils$9;

var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
    utils$6.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = value;
            delete headers[name];
        }
    });
};

var AxiosError_1;
var hasRequiredAxiosError;

function requireAxiosError() {
    if (hasRequiredAxiosError) return AxiosError_1;
    hasRequiredAxiosError = 1;

    var utils = utils$9;
    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [config] The config.
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */

    function AxiosError(message, code, config, request, response) {
        Error.call(this);
        this.message = message;
        this.name = 'AxiosError';
        code && (this.code = code);
        config && (this.config = config);
        request && (this.request = request);
        response && (this.response = response);
    }

    utils.inherits(AxiosError, Error, {
        toJSON: function toJSON() {
            return {
                // Standard
                message: this.message,
                name: this.name,
                // Microsoft
                description: this.description,
                number: this.number,
                // Mozilla
                fileName: this.fileName,
                lineNumber: this.lineNumber,
                columnNumber: this.columnNumber,
                stack: this.stack,
                // Axios
                config: this.config,
                code: this.code,
                status: this.response && this.response.status ? this.response.status : null
            };
        }
    });
    var prototype = AxiosError.prototype;
    var descriptors = {};
    ['ERR_BAD_OPTION_VALUE', 'ERR_BAD_OPTION', 'ECONNABORTED', 'ETIMEDOUT', 'ERR_NETWORK', 'ERR_FR_TOO_MANY_REDIRECTS', 'ERR_DEPRECATED', 'ERR_BAD_RESPONSE', 'ERR_BAD_REQUEST', 'ERR_CANCELED' // eslint-disable-next-line func-names
    ].forEach(function (code) {
        descriptors[code] = {
            value: code
        };
    });
    Object.defineProperties(AxiosError, descriptors);
    Object.defineProperty(prototype, 'isAxiosError', {
        value: true
    }); // eslint-disable-next-line func-names

    AxiosError.from = function (error, code, config, request, response, customProps) {
        var axiosError = Object.create(prototype);
        utils.toFlatObject(error, axiosError, function filter(obj) {
            return obj !== Error.prototype;
        });
        AxiosError.call(axiosError, error.message, code, config, request, response);
        axiosError.name = error.name;
        customProps && _extends(axiosError, customProps);
        return axiosError;
    };

    AxiosError_1 = AxiosError;
    return AxiosError_1;
}

var transitional = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
};

var toFormData_1;
var hasRequiredToFormData;

function requireToFormData() {
    if (hasRequiredToFormData) return toFormData_1;
    hasRequiredToFormData = 1;

    var utils = utils$9;
    /**
     * Convert a data object to FormData
     * @param {Object} obj
     * @param {?Object} [formData]
     * @returns {Object}
     **/

    function toFormData(obj, formData) {
        // eslint-disable-next-line no-param-reassign
        formData = formData || new FormData();
        var stack = [];

        function convertValue(value) {
            if (value === null) return '';

            if (utils.isDate(value)) {
                return value.toISOString();
            }

            if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
                return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
            }

            return value;
        }

        function build(data, parentKey) {
            if (utils.isPlainObject(data) || utils.isArray(data)) {
                if (stack.indexOf(data) !== -1) {
                    throw Error('Circular reference detected in ' + parentKey);
                }

                stack.push(data);
                utils.forEach(data, function each(value, key) {
                    if (utils.isUndefined(value)) return;
                    var fullKey = parentKey ? parentKey + '.' + key : key;
                    var arr;

                    if (value && !parentKey && _typeof(value) === 'object') {
                        if (utils.endsWith(key, '{}')) {
                            // eslint-disable-next-line no-param-reassign
                            value = JSON.stringify(value);
                        } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
                            // eslint-disable-next-line func-names
                            arr.forEach(function (el) {
                                !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
                            });
                            return;
                        }
                    }

                    build(value, fullKey);
                });
                stack.pop();
            } else {
                formData.append(parentKey, convertValue(data));
            }
        }

        build(obj);
        return formData;
    }

    toFormData_1 = toFormData;
    return toFormData_1;
}

var AxiosError$2 = requireAxiosError();
/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */

var settle = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;

    if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
    } else {
        reject(new AxiosError$2('Request failed with status code ' + response.status, [AxiosError$2.ERR_BAD_REQUEST, AxiosError$2.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4], response.config, response.request, response));
    }
};

var cookies;
var hasRequiredCookies;

function requireCookies() {
    if (hasRequiredCookies) return cookies;
    hasRequiredCookies = 1;

    var utils = utils$9;
    cookies = utils.isStandardBrowserEnv() ? // Standard browser envs support document.cookie
        function standardBrowserEnv() {
            return {
                write: function write(name, value, expires, path, domain, secure) {
                    var cookie = [];
                    cookie.push(name + '=' + encodeURIComponent(value));

                    if (utils.isNumber(expires)) {
                        cookie.push('expires=' + new Date(expires).toGMTString());
                    }

                    if (utils.isString(path)) {
                        cookie.push('path=' + path);
                    }

                    if (utils.isString(domain)) {
                        cookie.push('domain=' + domain);
                    }

                    if (secure === true) {
                        cookie.push('secure');
                    }

                    document.cookie = cookie.join('; ');
                },
                read: function read(name) {
                    var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
                    return match ? decodeURIComponent(match[3]) : null;
                },
                remove: function remove(name) {
                    this.write(name, '', Date.now() - 86400000);
                }
            };
        }() : // Non standard browser env (web workers, react-native) lack needed support.
        function nonStandardBrowserEnv() {
            return {
                write: function write() {},
                read: function read() {
                    return null;
                },
                remove: function remove() {}
            };
        }();
    return cookies;
}

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */


var isAbsoluteURL$1 = function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */


var combineURLs$1 = function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
};

var isAbsoluteURL = isAbsoluteURL$1;
var combineURLs = combineURLs$1;
/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */

var buildFullPath$1 = function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
    }

    return requestedURL;
};

var parseHeaders;
var hasRequiredParseHeaders;

function requireParseHeaders() {
    if (hasRequiredParseHeaders) return parseHeaders;
    hasRequiredParseHeaders = 1;

    var utils = utils$9; // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers

    var ignoreDuplicateOf = ['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent'];
    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */

    parseHeaders = function parseHeaders(headers) {
        var parsed = {};
        var key;
        var val;
        var i;

        if (!headers) {
            return parsed;
        }

        utils.forEach(headers.split('\n'), function parser(line) {
            i = line.indexOf(':');
            key = utils.trim(line.substr(0, i)).toLowerCase();
            val = utils.trim(line.substr(i + 1));

            if (key) {
                if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
                    return;
                }

                if (key === 'set-cookie') {
                    parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
                } else {
                    parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
                }
            }
        });
        return parsed;
    };

    return parseHeaders;
}

var isURLSameOrigin;
var hasRequiredIsURLSameOrigin;

function requireIsURLSameOrigin() {
    if (hasRequiredIsURLSameOrigin) return isURLSameOrigin;
    hasRequiredIsURLSameOrigin = 1;

    var utils = utils$9;
    isURLSameOrigin = utils.isStandardBrowserEnv() ? // Standard browser envs have full support of the APIs needed to test
        // whether the request URL is of the same origin as current location.
        function standardBrowserEnv() {
            var msie = /(msie|trident)/i.test(navigator.userAgent);
            var urlParsingNode = document.createElement('a');
            var originURL;
            /**
             * Parse a URL to discover it's components
             *
             * @param {String} url The URL to be parsed
             * @returns {Object}
             */

            function resolveURL(url) {
                var href = url;

                if (msie) {
                    // IE needs attribute set twice to normalize properties
                    urlParsingNode.setAttribute('href', href);
                    href = urlParsingNode.href;
                }

                urlParsingNode.setAttribute('href', href); // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils

                return {
                    href: urlParsingNode.href,
                    protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
                    host: urlParsingNode.host,
                    search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
                    hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
                    hostname: urlParsingNode.hostname,
                    port: urlParsingNode.port,
                    pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
                };
            }

            originURL = resolveURL(window.location.href);
            /**
             * Determine if a URL shares the same origin as the current location
             *
             * @param {String} requestURL The URL to test
             * @returns {boolean} True if URL shares the same origin, otherwise false
             */

            return function isURLSameOrigin(requestURL) {
                var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
                return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
            };
        }() : // Non standard browser envs (web workers, react-native) lack needed support.
        function nonStandardBrowserEnv() {
            return function isURLSameOrigin() {
                return true;
            };
        }();
    return isURLSameOrigin;
}

var CanceledError_1;
var hasRequiredCanceledError;

function requireCanceledError() {
    if (hasRequiredCanceledError) return CanceledError_1;
    hasRequiredCanceledError = 1;

    var AxiosError = requireAxiosError();
    var utils = utils$9;
    /**
     * A `CanceledError` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */

    function CanceledError(message) {
        // eslint-disable-next-line no-eq-null,eqeqeq
        AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED);
        this.name = 'CanceledError';
    }

    utils.inherits(CanceledError, AxiosError, {
        __CANCEL__: true
    });
    CanceledError_1 = CanceledError;
    return CanceledError_1;
}

var parseProtocol;
var hasRequiredParseProtocol;

function requireParseProtocol() {
    if (hasRequiredParseProtocol) return parseProtocol;
    hasRequiredParseProtocol = 1;

    parseProtocol = function parseProtocol(url) {
        var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
        return match && match[1] || '';
    };

    return parseProtocol;
}

var xhr;
var hasRequiredXhr;

function requireXhr() {
    if (hasRequiredXhr) return xhr;
    hasRequiredXhr = 1;

    var utils = utils$9;
    var settle$1 = settle;
    var cookies = requireCookies();
    var buildURL = buildURL$1;
    var buildFullPath = buildFullPath$1;
    var parseHeaders = requireParseHeaders();
    var isURLSameOrigin = requireIsURLSameOrigin();
    var transitionalDefaults = transitional;
    var AxiosError = requireAxiosError();
    var CanceledError = requireCanceledError();
    var parseProtocol = requireParseProtocol();

    xhr = function xhrAdapter(config) {
        return new Promise(function dispatchXhrRequest(resolve, reject) {
            var requestData = config.data;
            var requestHeaders = config.headers;
            var responseType = config.responseType;
            var onCanceled;

            function done() {
                if (config.cancelToken) {
                    config.cancelToken.unsubscribe(onCanceled);
                }

                if (config.signal) {
                    config.signal.removeEventListener('abort', onCanceled);
                }
            }

            if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
                delete requestHeaders['Content-Type']; // Let the browser set it
            }

            var request = new XMLHttpRequest(); // HTTP basic authentication

            if (config.auth) {
                var username = config.auth.username || '';
                var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
                requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
            }

            var fullPath = buildFullPath(config.baseURL, config.url);
            request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true); // Set the request timeout in MS

            request.timeout = config.timeout;

            function onloadend() {
                if (!request) {
                    return;
                } // Prepare the response


                var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
                var responseData = !responseType || responseType === 'text' || responseType === 'json' ? request.responseText : request.response;
                var response = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config: config,
                    request: request
                };
                settle$1(function _resolve(value) {
                    resolve(value);
                    done();
                }, function _reject(err) {
                    reject(err);
                    done();
                }, response); // Clean up request

                request = null;
            }

            if ('onloadend' in request) {
                // Use onloadend if available
                request.onloadend = onloadend;
            } else {
                // Listen for ready state to emulate onloadend
                request.onreadystatechange = function handleLoad() {
                    if (!request || request.readyState !== 4) {
                        return;
                    } // The request errored out and we didn't get a response, this will be
                    // handled by onerror instead
                    // With one exception: request that using file: protocol, most browsers
                    // will return status as 0 even though it's a successful request


                    if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
                        return;
                    } // readystate handler is calling before onerror or ontimeout handlers,
                    // so we should call onloadend on the next 'tick'


                    setTimeout(onloadend);
                };
            } // Handle browser request cancellation (as opposed to a manual cancellation)


            request.onabort = function handleAbort() {
                if (!request) {
                    return;
                }

                reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request)); // Clean up request

                request = null;
            }; // Handle low level network errors


            request.onerror = function handleError() {
                // Real errors are hidden from us by the browser
                // onerror should only fire if it's a network error
                reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request, request)); // Clean up request

                request = null;
            }; // Handle timeout


            request.ontimeout = function handleTimeout() {
                var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
                var transitional = config.transitional || transitionalDefaults;

                if (config.timeoutErrorMessage) {
                    timeoutErrorMessage = config.timeoutErrorMessage;
                }

                reject(new AxiosError(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED, config, request)); // Clean up request

                request = null;
            }; // Add xsrf header
            // This is only done if running in a standard browser environment.
            // Specifically not if we're in a web worker, or react-native.


            if (utils.isStandardBrowserEnv()) {
                // Add xsrf header
                var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

                if (xsrfValue) {
                    requestHeaders[config.xsrfHeaderName] = xsrfValue;
                }
            } // Add headers to the request


            if ('setRequestHeader' in request) {
                utils.forEach(requestHeaders, function setRequestHeader(val, key) {
                    if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
                        // Remove Content-Type if data is undefined
                        delete requestHeaders[key];
                    } else {
                        // Otherwise add header to the request
                        request.setRequestHeader(key, val);
                    }
                });
            } // Add withCredentials to request if needed


            if (!utils.isUndefined(config.withCredentials)) {
                request.withCredentials = !!config.withCredentials;
            } // Add responseType to request if needed


            if (responseType && responseType !== 'json') {
                request.responseType = config.responseType;
            } // Handle progress if needed


            if (typeof config.onDownloadProgress === 'function') {
                request.addEventListener('progress', config.onDownloadProgress);
            } // Not all browsers support upload events


            if (typeof config.onUploadProgress === 'function' && request.upload) {
                request.upload.addEventListener('progress', config.onUploadProgress);
            }

            if (config.cancelToken || config.signal) {
                // Handle cancellation
                // eslint-disable-next-line func-names
                onCanceled = function onCanceled(cancel) {
                    if (!request) {
                        return;
                    }

                    reject(!cancel || cancel && cancel.type ? new CanceledError() : cancel);
                    request.abort();
                    request = null;
                };

                config.cancelToken && config.cancelToken.subscribe(onCanceled);

                if (config.signal) {
                    config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
                }
            }

            if (!requestData) {
                requestData = null;
            }

            var protocol = parseProtocol(fullPath);

            if (protocol && ['http', 'https', 'file'].indexOf(protocol) === -1) {
                reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
                return;
            } // Send the request


            request.send(requestData);
        });
    };

    return xhr;
}

var _null;

var hasRequired_null;

function require_null() {
    if (hasRequired_null) return _null;
    hasRequired_null = 1; // eslint-disable-next-line strict

    _null = null;
    return _null;
}

var utils$5 = utils$9;
var normalizeHeaderName = normalizeHeaderName$1;
var AxiosError$1 = requireAxiosError();
var transitionalDefaults = transitional;
var toFormData = requireToFormData();
var DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
    if (!utils$5.isUndefined(headers) && utils$5.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
    }
}

function getDefaultAdapter() {
    var adapter;

    if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = requireXhr();
    } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = requireXhr();
    }

    return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
    if (utils$5.isString(rawValue)) {
        try {
            (parser || JSON.parse)(rawValue);
            return utils$5.trim(rawValue);
        } catch (e) {
            if (e.name !== 'SyntaxError') {
                throw e;
            }
        }
    }

    return (encoder || JSON.stringify)(rawValue);
}

var defaults$3 = {
    transitional: transitionalDefaults,
    adapter: getDefaultAdapter(),
    transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');

        if (utils$5.isFormData(data) || utils$5.isArrayBuffer(data) || utils$5.isBuffer(data) || utils$5.isStream(data) || utils$5.isFile(data) || utils$5.isBlob(data)) {
            return data;
        }

        if (utils$5.isArrayBufferView(data)) {
            return data.buffer;
        }

        if (utils$5.isURLSearchParams(data)) {
            setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
            return data.toString();
        }

        var isObjectPayload = utils$5.isObject(data);
        var contentType = headers && headers['Content-Type'];
        var isFileList;

        if ((isFileList = utils$5.isFileList(data)) || isObjectPayload && contentType === 'multipart/form-data') {
            var _FormData = this.env && this.env.FormData;

            return toFormData(isFileList ? {
                'files[]': data
            } : data, _FormData && new _FormData());
        } else if (isObjectPayload || contentType === 'application/json') {
            setContentTypeIfUnset(headers, 'application/json');
            return stringifySafely(data);
        }

        return data;
    }],
    transformResponse: [function transformResponse(data) {
        var transitional = this.transitional || defaults$3.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

        if (strictJSONParsing || forcedJSONParsing && utils$5.isString(data) && data.length) {
            try {
                return JSON.parse(data);
            } catch (e) {
                if (strictJSONParsing) {
                    if (e.name === 'SyntaxError') {
                        throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
                    }

                    throw e;
                }
            }
        }

        return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
        FormData: require_null()
    },
    validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
    },
    headers: {
        common: {
            'Accept': 'application/json, text/plain, */*'
        }
    }
};
utils$5.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults$3.headers[method] = {};
});
utils$5.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults$3.headers[method] = utils$5.merge(DEFAULT_CONTENT_TYPE);
});
var defaults_1 = defaults$3;

var utils$4 = utils$9;
var defaults$2 = defaults_1;
/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */

var transformData$1 = function transformData(data, headers, fns) {
    var context = this || defaults$2;
    /*eslint no-param-reassign:0*/

    utils$4.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
    });
    return data;
};

var isCancel$1;
var hasRequiredIsCancel;

function requireIsCancel() {
    if (hasRequiredIsCancel) return isCancel$1;
    hasRequiredIsCancel = 1;

    isCancel$1 = function isCancel(value) {
        return !!(value && value.__CANCEL__);
    };

    return isCancel$1;
}

var utils$3 = utils$9;
var transformData = transformData$1;
var isCancel = requireIsCancel();
var defaults$1 = defaults_1;
var CanceledError = requireCanceledError();
/**
 * Throws a `CanceledError` if cancellation has been requested.
 */

function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }

    if (config.signal && config.signal.aborted) {
        throw new CanceledError();
    }
}
/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */


var dispatchRequest$1 = function dispatchRequest(config) {
    throwIfCancellationRequested(config); // Ensure headers exist

    config.headers = config.headers || {}; // Transform request data

    config.data = transformData.call(config, config.data, config.headers, config.transformRequest); // Flatten headers

    config.headers = utils$3.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
    utils$3.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
        delete config.headers[method];
    });
    var adapter = config.adapter || defaults$1.adapter;
    return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config); // Transform response data

        response.data = transformData.call(config, response.data, response.headers, config.transformResponse);
        return response;
    }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
            throwIfCancellationRequested(config); // Transform response data

            if (reason && reason.response) {
                reason.response.data = transformData.call(config, reason.response.data, reason.response.headers, config.transformResponse);
            }
        }

        return Promise.reject(reason);
    });
};

var utils$2 = utils$9;
/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */

var mergeConfig$2 = function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    var config = {};

    function getMergedValue(target, source) {
        if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
            return utils$2.merge(target, source);
        } else if (utils$2.isPlainObject(source)) {
            return utils$2.merge({}, source);
        } else if (utils$2.isArray(source)) {
            return source.slice();
        }

        return source;
    } // eslint-disable-next-line consistent-return


    function mergeDeepProperties(prop) {
        if (!utils$2.isUndefined(config2[prop])) {
            return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils$2.isUndefined(config1[prop])) {
            return getMergedValue(undefined, config1[prop]);
        }
    } // eslint-disable-next-line consistent-return


    function valueFromConfig2(prop) {
        if (!utils$2.isUndefined(config2[prop])) {
            return getMergedValue(undefined, config2[prop]);
        }
    } // eslint-disable-next-line consistent-return


    function defaultToConfig2(prop) {
        if (!utils$2.isUndefined(config2[prop])) {
            return getMergedValue(undefined, config2[prop]);
        } else if (!utils$2.isUndefined(config1[prop])) {
            return getMergedValue(undefined, config1[prop]);
        }
    } // eslint-disable-next-line consistent-return


    function mergeDirectKeys(prop) {
        if (prop in config2) {
            return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
            return getMergedValue(undefined, config1[prop]);
        }
    }

    var mergeMap = {
        'url': valueFromConfig2,
        'method': valueFromConfig2,
        'data': valueFromConfig2,
        'baseURL': defaultToConfig2,
        'transformRequest': defaultToConfig2,
        'transformResponse': defaultToConfig2,
        'paramsSerializer': defaultToConfig2,
        'timeout': defaultToConfig2,
        'timeoutMessage': defaultToConfig2,
        'withCredentials': defaultToConfig2,
        'adapter': defaultToConfig2,
        'responseType': defaultToConfig2,
        'xsrfCookieName': defaultToConfig2,
        'xsrfHeaderName': defaultToConfig2,
        'onUploadProgress': defaultToConfig2,
        'onDownloadProgress': defaultToConfig2,
        'decompress': defaultToConfig2,
        'maxContentLength': defaultToConfig2,
        'maxBodyLength': defaultToConfig2,
        'beforeRedirect': defaultToConfig2,
        'transport': defaultToConfig2,
        'httpAgent': defaultToConfig2,
        'httpsAgent': defaultToConfig2,
        'cancelToken': defaultToConfig2,
        'socketPath': defaultToConfig2,
        'responseEncoding': defaultToConfig2,
        'validateStatus': mergeDirectKeys
    };
    utils$2.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        var merge = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge(prop);
        utils$2.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
};

var data;
var hasRequiredData;

function requireData() {
    if (hasRequiredData) return data;
    hasRequiredData = 1;
    data = {
        "version": "0.27.2"
    };
    return data;
}

var VERSION = requireData().version;
var AxiosError = requireAxiosError();
var validators$1 = {}; // eslint-disable-next-line func-names

['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function (type, i) {
    validators$1[type] = function validator(thing) {
        return _typeof(thing) === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
    };
});
var deprecatedWarnings = {};
/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */

validators$1.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
        return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
    } // eslint-disable-next-line func-names


    return function (value, opt, opts) {
        if (validator === false) {
            throw new AxiosError(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')), AxiosError.ERR_DEPRECATED);
        }

        if (version && !deprecatedWarnings[opt]) {
            deprecatedWarnings[opt] = true; // eslint-disable-next-line no-console

            console.warn(formatMessage(opt, ' has been deprecated since v' + version + ' and will be removed in the near future'));
        }

        return validator ? validator(value, opt, opts) : true;
    };
};
/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */


function assertOptions(options, schema, allowUnknown) {
    if (_typeof(options) !== 'object') {
        throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
    }

    var keys = Object.keys(options);
    var i = keys.length;

    while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];

        if (validator) {
            var value = options[opt];
            var result = value === undefined || validator(value, opt, options);

            if (result !== true) {
                throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
            }

            continue;
        }

        if (allowUnknown !== true) {
            throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
        }
    }
}

var validator$1 = {
    assertOptions: assertOptions,
    validators: validators$1
};

var utils$1 = utils$9;
var buildURL = buildURL$1;
var InterceptorManager = InterceptorManager_1;
var dispatchRequest = dispatchRequest$1;
var mergeConfig$1 = mergeConfig$2;
var buildFullPath = buildFullPath$1;
var validator = validator$1;
var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */

function Axios$1(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
    };
}
/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */


Axios$1.prototype.request = function request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
        config = config || {};
        config.url = configOrUrl;
    } else {
        config = configOrUrl || {};
    }

    config = mergeConfig$1(this.defaults, config); // Set config.method

    if (config.method) {
        config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
    } else {
        config.method = 'get';
    }

    var transitional = config.transitional;

    if (transitional !== undefined) {
        validator.assertOptions(transitional, {
            silentJSONParsing: validators.transitional(validators.boolean),
            forcedJSONParsing: validators.transitional(validators.boolean),
            clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
    } // filter out skipped interceptors


    var requestInterceptorChain = [];
    var synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
            return;
        }

        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    var responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    var promise;

    if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, undefined];
        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);
        promise = Promise.resolve(config);

        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
    }

    var newConfig = config;

    while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();

        try {
            newConfig = onFulfilled(newConfig);
        } catch (error) {
            onRejected(error);
            break;
        }
    }

    try {
        promise = dispatchRequest(newConfig);
    } catch (error) {
        return Promise.reject(error);
    }

    while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
    }

    return promise;
};

Axios$1.prototype.getUri = function getUri(config) {
    config = mergeConfig$1(this.defaults, config);
    var fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
}; // Provide aliases for supported request methods


utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios$1.prototype[method] = function (url, config) {
        return this.request(mergeConfig$1(config || {}, {
            method: method,
            url: url,
            data: (config || {}).data
        }));
    };
});
utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
            return this.request(mergeConfig$1(config || {}, {
                method: method,
                headers: isForm ? {
                    'Content-Type': 'multipart/form-data'
                } : {},
                url: url,
                data: data
            }));
        };
    }

    Axios$1.prototype[method] = generateHTTPMethod();
    Axios$1.prototype[method + 'Form'] = generateHTTPMethod(true);
});
var Axios_1 = Axios$1;

var CancelToken_1;
var hasRequiredCancelToken;

function requireCancelToken() {
    if (hasRequiredCancelToken) return CancelToken_1;
    hasRequiredCancelToken = 1;

    var CanceledError = requireCanceledError();
    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */

    function CancelToken(executor) {
        if (typeof executor !== 'function') {
            throw new TypeError('executor must be a function.');
        }

        var resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
            resolvePromise = resolve;
        });
        var token = this; // eslint-disable-next-line func-names

        this.promise.then(function (cancel) {
            if (!token._listeners) return;
            var i;
            var l = token._listeners.length;

            for (i = 0; i < l; i++) {
                token._listeners[i](cancel);
            }

            token._listeners = null;
        }); // eslint-disable-next-line func-names

        this.promise.then = function (onfulfilled) {
            var _resolve; // eslint-disable-next-line func-names


            var promise = new Promise(function (resolve) {
                token.subscribe(resolve);
                _resolve = resolve;
            }).then(onfulfilled);

            promise.cancel = function reject() {
                token.unsubscribe(_resolve);
            };

            return promise;
        };

        executor(function cancel(message) {
            if (token.reason) {
                // Cancellation has already been requested
                return;
            }

            token.reason = new CanceledError(message);
            resolvePromise(token.reason);
        });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */


    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
        if (this.reason) {
            throw this.reason;
        }
    };
    /**
     * Subscribe to the cancel signal
     */


    CancelToken.prototype.subscribe = function subscribe(listener) {
        if (this.reason) {
            listener(this.reason);
            return;
        }

        if (this._listeners) {
            this._listeners.push(listener);
        } else {
            this._listeners = [listener];
        }
    };
    /**
     * Unsubscribe from the cancel signal
     */


    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
        if (!this._listeners) {
            return;
        }

        var index = this._listeners.indexOf(listener);

        if (index !== -1) {
            this._listeners.splice(index, 1);
        }
    };
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */


    CancelToken.source = function source() {
        var cancel;
        var token = new CancelToken(function executor(c) {
            cancel = c;
        });
        return {
            token: token,
            cancel: cancel
        };
    };

    CancelToken_1 = CancelToken;
    return CancelToken_1;
}

var spread;
var hasRequiredSpread;

function requireSpread() {
    if (hasRequiredSpread) return spread;
    hasRequiredSpread = 1;
    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */


    spread = function spread(callback) {
        return function wrap(arr) {
            return callback.apply(null, arr);
        };
    };

    return spread;
}

var isAxiosError;
var hasRequiredIsAxiosError;

function requireIsAxiosError() {
    if (hasRequiredIsAxiosError) return isAxiosError;
    hasRequiredIsAxiosError = 1;

    var utils = utils$9;
    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */

    isAxiosError = function isAxiosError(payload) {
        return utils.isObject(payload) && payload.isAxiosError === true;
    };

    return isAxiosError;
}

var utils = utils$9;
var bind = bind$2;
var Axios = Axios_1;
var mergeConfig = mergeConfig$2;
var defaults = defaults_1;
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */

function createInstance(defaultConfig) {
    var context = new Axios(defaultConfig);
    var instance = bind(Axios.prototype.request, context); // Copy axios.prototype to instance

    utils.extend(instance, Axios.prototype, context); // Copy context to instance

    utils.extend(instance, context); // Factory for creating new instances

    instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };

    return instance;
} // Create the default instance to be exported


var axios$1 = createInstance(defaults); // Expose Axios class to allow class inheritance

axios$1.Axios = Axios; // Expose Cancel & CancelToken

axios$1.CanceledError = requireCanceledError();
axios$1.CancelToken = requireCancelToken();
axios$1.isCancel = requireIsCancel();
axios$1.VERSION = requireData().version;
axios$1.toFormData = requireToFormData(); // Expose AxiosError class

axios$1.AxiosError = requireAxiosError(); // alias for CanceledError for backward compatibility

axios$1.Cancel = axios$1.CanceledError; // Expose all/spread

axios$1.all = function all(promises) {
    return Promise.all(promises);
};

axios$1.spread = requireSpread(); // Expose isAxiosError

axios$1.isAxiosError = requireIsAxiosError();
axios$2.exports = axios$1; // Allow use of default import syntax in TypeScript

axios$2.exports.default = axios$1;

(function (module) {
    module.exports = axios$2.exports;
})(axios$3);

var axios = /*@__PURE__*/getDefaultExportFromCjs(axios$3.exports);

var denyList = new Set(['ENOTFOUND', 'ENETUNREACH', // SSL errors from https://github.com/nodejs/node/blob/fc8e3e2cdc521978351de257030db0076d79e0ab/src/crypto/crypto_common.cc#L301-L328
    'UNABLE_TO_GET_ISSUER_CERT', 'UNABLE_TO_GET_CRL', 'UNABLE_TO_DECRYPT_CERT_SIGNATURE', 'UNABLE_TO_DECRYPT_CRL_SIGNATURE', 'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY', 'CERT_SIGNATURE_FAILURE', 'CRL_SIGNATURE_FAILURE', 'CERT_NOT_YET_VALID', 'CERT_HAS_EXPIRED', 'CRL_NOT_YET_VALID', 'CRL_HAS_EXPIRED', 'ERROR_IN_CERT_NOT_BEFORE_FIELD', 'ERROR_IN_CERT_NOT_AFTER_FIELD', 'ERROR_IN_CRL_LAST_UPDATE_FIELD', 'ERROR_IN_CRL_NEXT_UPDATE_FIELD', 'OUT_OF_MEM', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'SELF_SIGNED_CERT_IN_CHAIN', 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'CERT_CHAIN_TOO_LONG', 'CERT_REVOKED', 'INVALID_CA', 'PATH_LENGTH_EXCEEDED', 'INVALID_PURPOSE', 'CERT_UNTRUSTED', 'CERT_REJECTED', 'HOSTNAME_MISMATCH']); // TODO: Use `error?.code` when targeting Node.js 14

var isRetryAllowed = function isRetryAllowed(error) {
    return !denyList.has(error && error.code);
};

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

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);

        if (enumerableOnly) {
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }

        keys.push.apply(keys, symbols);
    }

    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};

        if (i % 2) {
            ownKeys(Object(source), true).forEach(function (key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function (key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
    }

    return target;
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
var namespace = 'axios-retry';
/**
 * @param  {Error}  error
 * @return {boolean}
 */

function isNetworkError(error) {
    return !error.response && Boolean(error.code) && // Prevents retrying cancelled requests
        error.code !== 'ECONNABORTED' && // Prevents retrying timed out requests
        isRetryAllowed(error); // Prevents retrying unsafe errors
}
var SAFE_HTTP_METHODS = ['get', 'head', 'options'];
var IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat(['put', 'delete']);
/**
 * @param  {Error}  error
 * @return {boolean}
 */

function isRetryableError(error) {
    return error.code !== 'ECONNABORTED' && (!error.response || error.response.status >= 500 && error.response.status <= 599);
}
/**
 * @param  {Error}  error
 * @return {boolean}
 */

function isSafeRequestError(error) {
    if (!error.config) {
        // Cannot determine if the request can be retried
        return false;
    }

    return isRetryableError(error) && SAFE_HTTP_METHODS.indexOf(error.config.method) !== -1;
}
/**
 * @param  {Error}  error
 * @return {boolean}
 */

function isIdempotentRequestError(error) {
    if (!error.config) {
        // Cannot determine if the request can be retried
        return false;
    }

    return isRetryableError(error) && IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1;
}
/**
 * @param  {Error}  error
 * @return {boolean}
 */

function isNetworkOrIdempotentRequestError(error) {
    return isNetworkError(error) || isIdempotentRequestError(error);
}
/**
 * @return {number} - delay in milliseconds, always 0
 */

function noDelay() {
    return 0;
}
/**
 * @param  {number} [retryNumber=0]
 * @return {number} - delay in milliseconds
 */


function exponentialDelay() {
    var retryNumber = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var delay = Math.pow(2, retryNumber) * 100;
    var randomSum = delay * 0.2 * Math.random(); // 0-20% of the delay

    return delay + randomSum;
}
/**
 * Initializes and returns the retry state for the given request/config
 * @param  {AxiosRequestConfig} config
 * @return {Object}
 */

function getCurrentState(config) {
    var currentState = config[namespace] || {};
    currentState.retryCount = currentState.retryCount || 0;
    config[namespace] = currentState;
    return currentState;
}
/**
 * Returns the axios-retry options for the current request
 * @param  {AxiosRequestConfig} config
 * @param  {AxiosRetryConfig} defaultOptions
 * @return {AxiosRetryConfig}
 */


function getRequestOptions(config, defaultOptions) {
    return _objectSpread(_objectSpread({}, defaultOptions), config[namespace]);
}
/**
 * @param  {Axios} axios
 * @param  {AxiosRequestConfig} config
 */


function fixConfig(axios, config) {
    if (axios.defaults.agent === config.agent) {
        delete config.agent;
    }

    if (axios.defaults.httpAgent === config.httpAgent) {
        delete config.httpAgent;
    }

    if (axios.defaults.httpsAgent === config.httpsAgent) {
        delete config.httpsAgent;
    }
}
/**
 * Checks retryCondition if request can be retried. Handles it's retruning value or Promise.
 * @param  {number} retries
 * @param  {Function} retryCondition
 * @param  {Object} currentState
 * @param  {Error} error
 * @return {boolean}
 */


function shouldRetry(_x, _x2, _x3, _x4) {
    return _shouldRetry.apply(this, arguments);
}
/**
 * Adds response interceptors to an axios instance to retry requests failed due to network issues
 *
 * @example
 *
 * import axios from 'axios';
 *
 * axiosRetry(axios, { retries: 3 });
 *
 * axios.get('http://example.com/test') // The first request fails and the second returns 'ok'
 *   .then(result => {
 *     result.data; // 'ok'
 *   });
 *
 * // Exponential back-off retry delay between requests
 * axiosRetry(axios, { retryDelay : axiosRetry.exponentialDelay});
 *
 * // Custom retry delay
 * axiosRetry(axios, { retryDelay : (retryCount) => {
 *   return retryCount * 1000;
 * }});
 *
 * // Also works with custom axios instances
 * const client = axios.create({ baseURL: 'http://example.com' });
 * axiosRetry(client, { retries: 3 });
 *
 * client.get('/test') // The first request fails and the second returns 'ok'
 *   .then(result => {
 *     result.data; // 'ok'
 *   });
 *
 * // Allows request-specific configuration
 * client
 *   .get('/test', {
 *     'axios-retry': {
 *       retries: 0
 *     }
 *   })
 *   .catch(error => { // The first request fails
 *     error !== undefined
 *   });
 *
 * @param {Axios} axios An axios instance (the axios object or one created from axios.create)
 * @param {Object} [defaultOptions]
 * @param {number} [defaultOptions.retries=3] Number of retries
 * @param {boolean} [defaultOptions.shouldResetTimeout=false]
 *        Defines if the timeout should be reset between retries
 * @param {Function} [defaultOptions.retryCondition=isNetworkOrIdempotentRequestError]
 *        A function to determine if the error can be retried
 * @param {Function} [defaultOptions.retryDelay=noDelay]
 *        A function to determine the delay between retry requests
 * @param {Function} [defaultOptions.onRetry=()=>{}]
 *        A function to get notified when a retry occurs
 */


function _shouldRetry() {
    _shouldRetry = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(retries, retryCondition, currentState, error) {
        var shouldRetryOrPromise, shouldRetryPromiseResult;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        shouldRetryOrPromise = currentState.retryCount < retries && retryCondition(error); // This could be a promise

                        if (!(_typeof(shouldRetryOrPromise) === 'object')) {
                            _context.next = 12;
                            break;
                        }

                        _context.prev = 2;
                        _context.next = 5;
                        return shouldRetryOrPromise;

                    case 5:
                        shouldRetryPromiseResult = _context.sent;
                        return _context.abrupt("return", shouldRetryPromiseResult !== false);

                    case 9:
                        _context.prev = 9;
                        _context.t0 = _context["catch"](2);
                        return _context.abrupt("return", false);

                    case 12:
                        return _context.abrupt("return", shouldRetryOrPromise);

                    case 13:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, null, [[2, 9]]);
    }));
    return _shouldRetry.apply(this, arguments);
}

function axiosRetry(axios, defaultOptions) {
    axios.interceptors.request.use(function (config) {
        var currentState = getCurrentState(config);
        currentState.lastRequestTime = Date.now();
        return config;
    });
    axios.interceptors.response.use(null, /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(error) {
            var config, _getRequestOptions, _getRequestOptions$re, retries, _getRequestOptions$re2, retryCondition, _getRequestOptions$re3, retryDelay, _getRequestOptions$sh, shouldResetTimeout, _getRequestOptions$on, onRetry, currentState, delay, lastRequestDuration;

            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            config = error.config; // If we have no information to retry the request

                            if (config) {
                                _context2.next = 3;
                                break;
                            }

                            return _context2.abrupt("return", Promise.reject(error));

                        case 3:
                            _getRequestOptions = getRequestOptions(config, defaultOptions), _getRequestOptions$re = _getRequestOptions.retries, retries = _getRequestOptions$re === void 0 ? 3 : _getRequestOptions$re, _getRequestOptions$re2 = _getRequestOptions.retryCondition, retryCondition = _getRequestOptions$re2 === void 0 ? isNetworkOrIdempotentRequestError : _getRequestOptions$re2, _getRequestOptions$re3 = _getRequestOptions.retryDelay, retryDelay = _getRequestOptions$re3 === void 0 ? noDelay : _getRequestOptions$re3, _getRequestOptions$sh = _getRequestOptions.shouldResetTimeout, shouldResetTimeout = _getRequestOptions$sh === void 0 ? false : _getRequestOptions$sh, _getRequestOptions$on = _getRequestOptions.onRetry, onRetry = _getRequestOptions$on === void 0 ? function () {} : _getRequestOptions$on;
                            currentState = getCurrentState(config);
                            _context2.next = 7;
                            return shouldRetry(retries, retryCondition, currentState, error);

                        case 7:
                            if (!_context2.sent) {
                                _context2.next = 15;
                                break;
                            }

                            currentState.retryCount += 1;
                            delay = retryDelay(currentState.retryCount, error); // Axios fails merging this configuration to the default configuration because it has an issue
                            // with circular structures: https://github.com/mzabriskie/axios/issues/370

                            fixConfig(axios, config);

                            if (!shouldResetTimeout && config.timeout && currentState.lastRequestTime) {
                                lastRequestDuration = Date.now() - currentState.lastRequestTime; // Minimum 1ms timeout (passing 0 or less to XHR means no timeout)

                                config.timeout = Math.max(config.timeout - lastRequestDuration - delay, 1);
                            }

                            config.transformRequest = [function (data) {
                                return data;
                            }];
                            onRetry(currentState.retryCount, error, config);
                            return _context2.abrupt("return", new Promise(function (resolve) {
                                return setTimeout(function () {
                                    return resolve(axios(config));
                                }, delay);
                            }));

                        case 15:
                            return _context2.abrupt("return", Promise.reject(error));

                        case 16:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2);
        }));

        return function (_x5) {
            return _ref.apply(this, arguments);
        };
    }());
} // Compatibility with CommonJS

axiosRetry.isNetworkError = isNetworkError;
axiosRetry.isSafeRequestError = isSafeRequestError;
axiosRetry.isIdempotentRequestError = isIdempotentRequestError;
axiosRetry.isNetworkOrIdempotentRequestError = isNetworkOrIdempotentRequestError;
axiosRetry.exponentialDelay = exponentialDelay;
axiosRetry.isRetryableError = isRetryableError;

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
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
        return parse$1(val);
    } else if (type === 'number' && isFinite(val)) {
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


function parse$1(str) {
    str = String(str);

    if (str.length > 100) {
        return;
    }

    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);

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

        case 'weeks':
        case 'week':
        case 'w':
            return n * w;

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
    var msAbs = Math.abs(ms);

    if (msAbs >= d) {
        return Math.round(ms / d) + 'd';
    }

    if (msAbs >= h) {
        return Math.round(ms / h) + 'h';
    }

    if (msAbs >= m) {
        return Math.round(ms / m) + 'm';
    }

    if (msAbs >= s) {
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
    var msAbs = Math.abs(ms);

    if (msAbs >= d) {
        return plural(ms, msAbs, d, 'day');
    }

    if (msAbs >= h) {
        return plural(ms, msAbs, h, 'hour');
    }

    if (msAbs >= m) {
        return plural(ms, msAbs, m, 'minute');
    }

    if (msAbs >= s) {
        return plural(ms, msAbs, s, 'second');
    }

    return ms + ' ms';
}
/**
 * Pluralization helper.
 */


function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

var md5$1 = {exports: {}};

var crypt = {exports: {}};

(function () {
    var base64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        crypt$1 = {
            // Bit-wise rotation left
            rotl: function rotl(n, b) {
                return n << b | n >>> 32 - b;
            },
            // Bit-wise rotation right
            rotr: function rotr(n, b) {
                return n << 32 - b | n >>> b;
            },
            // Swap big-endian to little-endian and vice versa
            endian: function endian(n) {
                // If number given, swap endian
                if (n.constructor == Number) {
                    return crypt$1.rotl(n, 8) & 0x00FF00FF | crypt$1.rotl(n, 24) & 0xFF00FF00;
                } // Else, assume array and swap all items


                for (var i = 0; i < n.length; i++) {
                    n[i] = crypt$1.endian(n[i]);
                }

                return n;
            },
            // Generate an array of any length of random bytes
            randomBytes: function randomBytes(n) {
                for (var bytes = []; n > 0; n--) {
                    bytes.push(Math.floor(Math.random() * 256));
                }

                return bytes;
            },
            // Convert a byte array to big-endian 32-bit words
            bytesToWords: function bytesToWords(bytes) {
                for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8) {
                    words[b >>> 5] |= bytes[i] << 24 - b % 32;
                }

                return words;
            },
            // Convert big-endian 32-bit words to a byte array
            wordsToBytes: function wordsToBytes(words) {
                for (var bytes = [], b = 0; b < words.length * 32; b += 8) {
                    bytes.push(words[b >>> 5] >>> 24 - b % 32 & 0xFF);
                }

                return bytes;
            },
            // Convert a byte array to a hex string
            bytesToHex: function bytesToHex(bytes) {
                for (var hex = [], i = 0; i < bytes.length; i++) {
                    hex.push((bytes[i] >>> 4).toString(16));
                    hex.push((bytes[i] & 0xF).toString(16));
                }

                return hex.join('');
            },
            // Convert a hex string to a byte array
            hexToBytes: function hexToBytes(hex) {
                for (var bytes = [], c = 0; c < hex.length; c += 2) {
                    bytes.push(parseInt(hex.substr(c, 2), 16));
                }

                return bytes;
            },
            // Convert a byte array to a base-64 string
            bytesToBase64: function bytesToBase64(bytes) {
                for (var base64 = [], i = 0; i < bytes.length; i += 3) {
                    var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];

                    for (var j = 0; j < 4; j++) {
                        if (i * 8 + j * 6 <= bytes.length * 8) base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 0x3F));else base64.push('=');
                    }
                }

                return base64.join('');
            },
            // Convert a base-64 string to a byte array
            base64ToBytes: function base64ToBytes(base64) {
                // Remove non-base-64 characters
                base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

                for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
                    if (imod4 == 0) continue;
                    bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
                }

                return bytes;
            }
        };
    crypt.exports = crypt$1;
})();

var charenc = {
    // UTF-8 encoding
    utf8: {
        // Convert a string to a byte array
        stringToBytes: function stringToBytes(str) {
            return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
        },
        // Convert a byte array to a string
        bytesToString: function bytesToString(bytes) {
            return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
        }
    },
    // Binary encoding
    bin: {
        // Convert a string to a byte array
        stringToBytes: function stringToBytes(str) {
            for (var bytes = [], i = 0; i < str.length; i++) {
                bytes.push(str.charCodeAt(i) & 0xFF);
            }

            return bytes;
        },
        // Convert a byte array to a string
        bytesToString: function bytesToString(bytes) {
            for (var str = [], i = 0; i < bytes.length; i++) {
                str.push(String.fromCharCode(bytes[i]));
            }

            return str.join('');
        }
    }
};
var charenc_1 = charenc;

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
// Object.prototype.constructor. Remove this eventually

var isBuffer_1 = function isBuffer_1(obj) {
    return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
};

function isBuffer(obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
} // For Node v0.10 support. Remove this eventually.


function isSlowBuffer(obj) {
    return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0));
}

(function () {
    var crypt$1 = crypt.exports,
        utf8 = charenc_1.utf8,
        isBuffer = isBuffer_1,
        bin = charenc_1.bin,
        // The core
        md5 = function md5(message, options) {
            // Convert to byte array
            if (message.constructor == String) {
                if (options && options.encoding === 'binary') message = bin.stringToBytes(message);else message = utf8.stringToBytes(message);
            } else if (isBuffer(message)) message = Array.prototype.slice.call(message, 0);else if (!Array.isArray(message) && message.constructor !== Uint8Array) message = message.toString(); // else, assume byte array already

            var m = crypt$1.bytesToWords(message),
                l = message.length * 8,
                a = 1732584193,
                b = -271733879,
                c = -1732584194,
                d = 271733878; // Swap endian

            for (var i = 0; i < m.length; i++) {
                m[i] = (m[i] << 8 | m[i] >>> 24) & 0x00FF00FF | (m[i] << 24 | m[i] >>> 8) & 0xFF00FF00;
            } // Padding


            m[l >>> 5] |= 0x80 << l % 32;
            m[(l + 64 >>> 9 << 4) + 14] = l; // Method shortcuts

            var FF = md5._ff,
                GG = md5._gg,
                HH = md5._hh,
                II = md5._ii;

            for (var i = 0; i < m.length; i += 16) {
                var aa = a,
                    bb = b,
                    cc = c,
                    dd = d;
                a = FF(a, b, c, d, m[i + 0], 7, -680876936);
                d = FF(d, a, b, c, m[i + 1], 12, -389564586);
                c = FF(c, d, a, b, m[i + 2], 17, 606105819);
                b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
                a = FF(a, b, c, d, m[i + 4], 7, -176418897);
                d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
                c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
                b = FF(b, c, d, a, m[i + 7], 22, -45705983);
                a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
                d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
                c = FF(c, d, a, b, m[i + 10], 17, -42063);
                b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
                a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
                d = FF(d, a, b, c, m[i + 13], 12, -40341101);
                c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
                b = FF(b, c, d, a, m[i + 15], 22, 1236535329);
                a = GG(a, b, c, d, m[i + 1], 5, -165796510);
                d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
                c = GG(c, d, a, b, m[i + 11], 14, 643717713);
                b = GG(b, c, d, a, m[i + 0], 20, -373897302);
                a = GG(a, b, c, d, m[i + 5], 5, -701558691);
                d = GG(d, a, b, c, m[i + 10], 9, 38016083);
                c = GG(c, d, a, b, m[i + 15], 14, -660478335);
                b = GG(b, c, d, a, m[i + 4], 20, -405537848);
                a = GG(a, b, c, d, m[i + 9], 5, 568446438);
                d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
                c = GG(c, d, a, b, m[i + 3], 14, -187363961);
                b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
                a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
                d = GG(d, a, b, c, m[i + 2], 9, -51403784);
                c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
                b = GG(b, c, d, a, m[i + 12], 20, -1926607734);
                a = HH(a, b, c, d, m[i + 5], 4, -378558);
                d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
                c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
                b = HH(b, c, d, a, m[i + 14], 23, -35309556);
                a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
                d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
                c = HH(c, d, a, b, m[i + 7], 16, -155497632);
                b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
                a = HH(a, b, c, d, m[i + 13], 4, 681279174);
                d = HH(d, a, b, c, m[i + 0], 11, -358537222);
                c = HH(c, d, a, b, m[i + 3], 16, -722521979);
                b = HH(b, c, d, a, m[i + 6], 23, 76029189);
                a = HH(a, b, c, d, m[i + 9], 4, -640364487);
                d = HH(d, a, b, c, m[i + 12], 11, -421815835);
                c = HH(c, d, a, b, m[i + 15], 16, 530742520);
                b = HH(b, c, d, a, m[i + 2], 23, -995338651);
                a = II(a, b, c, d, m[i + 0], 6, -198630844);
                d = II(d, a, b, c, m[i + 7], 10, 1126891415);
                c = II(c, d, a, b, m[i + 14], 15, -1416354905);
                b = II(b, c, d, a, m[i + 5], 21, -57434055);
                a = II(a, b, c, d, m[i + 12], 6, 1700485571);
                d = II(d, a, b, c, m[i + 3], 10, -1894986606);
                c = II(c, d, a, b, m[i + 10], 15, -1051523);
                b = II(b, c, d, a, m[i + 1], 21, -2054922799);
                a = II(a, b, c, d, m[i + 8], 6, 1873313359);
                d = II(d, a, b, c, m[i + 15], 10, -30611744);
                c = II(c, d, a, b, m[i + 6], 15, -1560198380);
                b = II(b, c, d, a, m[i + 13], 21, 1309151649);
                a = II(a, b, c, d, m[i + 4], 6, -145523070);
                d = II(d, a, b, c, m[i + 11], 10, -1120210379);
                c = II(c, d, a, b, m[i + 2], 15, 718787259);
                b = II(b, c, d, a, m[i + 9], 21, -343485551);
                a = a + aa >>> 0;
                b = b + bb >>> 0;
                c = c + cc >>> 0;
                d = d + dd >>> 0;
            }

            return crypt$1.endian([a, b, c, d]);
        }; // Auxiliary functions


    md5._ff = function (a, b, c, d, x, s, t) {
        var n = a + (b & c | ~b & d) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
    };

    md5._gg = function (a, b, c, d, x, s, t) {
        var n = a + (b & d | c & ~d) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
    };

    md5._hh = function (a, b, c, d, x, s, t) {
        var n = a + (b ^ c ^ d) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
    };

    md5._ii = function (a, b, c, d, x, s, t) {
        var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
        return (n << s | n >>> 32 - s) + b;
    }; // Package private blocksize


    md5._blocksize = 16;
    md5._digestsize = 16;

    md5$1.exports = function (message, options) {
        if (message === undefined || message === null) throw new Error('Illegal argument ' + message);
        var digestbytes = crypt$1.wordsToBytes(md5(message, options));
        return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt$1.bytesToHex(digestbytes);
    };
})();

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

for (var i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).substr(1));
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
function v35 (name, version, hashfunc) {
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
    } catch (err) {} // For CommonJS default export support


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

v35('v3', 0x30, md5);

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

v35('v5', 0x50, sha1);

/** `Object#toString` result references. */

var stringTag = '[object String]';
/** Used for built-in method references. */

var objectProto = Object.prototype;
/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */

var objectToString = objectProto.toString;
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
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
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
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
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */


function isString(value) {
    return typeof value == 'string' || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
}

var lodash_isstring = isString;

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
            } catch (e) {}
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
            } catch (e) {}

            try {
                return func + '';
            } catch (e) {}
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

/**
 * - Create a request object
 * - Get response body
 * - Check if timeout
 */

function fetchAdapter(_x) {
    return _fetchAdapter.apply(this, arguments);
}
/**
 * Fetch API stage two is to get response body. This funtion tries to retrieve
 * response body based on response's type
 */

function _fetchAdapter() {
    _fetchAdapter = _asyncToGenerator$1( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(config) {
        var request, promiseChain, data;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        request = createRequest(config);
                        promiseChain = [getResponse(request, config)];

                        if (config.timeout && config.timeout > 0) {
                            promiseChain.push(new Promise(function (res) {
                                setTimeout(function () {
                                    var message = config.timeoutErrorMessage ? config.timeoutErrorMessage : 'timeout of ' + config.timeout + 'ms exceeded';
                                    res(createError(message, config, 'ECONNABORTED', request));
                                }, config.timeout);
                            }));
                        }

                        _context.next = 5;
                        return Promise.race(promiseChain);

                    case 5:
                        data = _context.sent;
                        return _context.abrupt("return", new Promise(function (resolve, reject) {
                            if (data instanceof Error) {
                                reject(data);
                            } else {
                                Object.prototype.toString.call(config.settle) === '[object Function]' ? config.settle(resolve, reject, data) : settle(resolve, reject, data);
                            }
                        }));

                    case 7:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee);
    }));
    return _fetchAdapter.apply(this, arguments);
}

function getResponse(_x2, _x3) {
    return _getResponse.apply(this, arguments);
}
/**
 * This function will create a Request object based on configuration's axios
 */


function _getResponse() {
    _getResponse = _asyncToGenerator$1( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(request, config) {
        var stageOne, response;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return fetch(request);

                    case 3:
                        stageOne = _context2.sent;
                        _context2.next = 9;
                        break;

                    case 6:
                        _context2.prev = 6;
                        _context2.t0 = _context2["catch"](0);
                        return _context2.abrupt("return", createError('Network Error', config, 'ERR_NETWORK', request));

                    case 9:
                        response = {
                            ok: stageOne.ok,
                            status: stageOne.status,
                            statusText: stageOne.statusText,
                            headers: new Headers(stageOne.headers),
                            // Make a copy of headers
                            config: config,
                            request: request
                        };

                        if (!(stageOne.status >= 200 && stageOne.status !== 204)) {
                            _context2.next = 34;
                            break;
                        }

                        _context2.t1 = config.responseType;
                        _context2.next = _context2.t1 === 'arraybuffer' ? 14 : _context2.t1 === 'blob' ? 18 : _context2.t1 === 'json' ? 22 : _context2.t1 === 'formData' ? 26 : 30;
                        break;

                    case 14:
                        _context2.next = 16;
                        return stageOne.arrayBuffer();

                    case 16:
                        response.data = _context2.sent;
                        return _context2.abrupt("break", 34);

                    case 18:
                        _context2.next = 20;
                        return stageOne.blob();

                    case 20:
                        response.data = _context2.sent;
                        return _context2.abrupt("break", 34);

                    case 22:
                        _context2.next = 24;
                        return stageOne.json();

                    case 24:
                        response.data = _context2.sent;
                        return _context2.abrupt("break", 34);

                    case 26:
                        _context2.next = 28;
                        return stageOne.formData();

                    case 28:
                        response.data = _context2.sent;
                        return _context2.abrupt("break", 34);

                    case 30:
                        _context2.next = 32;
                        return stageOne.text();

                    case 32:
                        response.data = _context2.sent;
                        return _context2.abrupt("break", 34);

                    case 34:
                        return _context2.abrupt("return", response);

                    case 35:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, null, [[0, 6]]);
    }));
    return _getResponse.apply(this, arguments);
}

function createRequest(config) {
    var headers = new Headers(config.headers); // HTTP basic authentication

    if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password ? decodeURI(encodeURIComponent(config.auth.password)) : '';
        headers.set('Authorization', "Basic ".concat(btoa(username + ':' + password)));
    }

    var method = config.method.toUpperCase();
    var options = {
        headers: headers,
        method: method
    };

    if (method !== 'GET' && method !== 'HEAD') {
        options.body = config.data;
    }

    if (config.mode) {
        options.mode = config.mode;
    }

    if (config.cache) {
        options.cache = config.cache;
    }

    if (config.integrity) {
        options.integrity = config.integrity;
    }

    if (config.redirect) {
        options.redirect = config.redirect;
    }

    if (config.referrer) {
        options.referrer = config.referrer;
    } // This config is similar to XHR’s withCredentials flag, but with three available values instead of two.
    // So if withCredentials is not set, default value 'same-origin' will be used


    if (!utils$9.isUndefined(config.withCredentials)) {
        options.credentials = config.withCredentials ? 'include' : 'omit';
    }

    var fullPath = buildFullPath$1(config.baseURL, config.url);
    var url = buildURL$1(fullPath, config.params, config.paramsSerializer); // Expected browser to throw error if there is any wrong configuration value

    return new Request(url, options);
}
/**
 * Note:
 *
 *   From version >= 0.27.0, createError function is replaced by AxiosError class.
 *   So I copy the old createError function here for backward compatible.
 *
 *
 *
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */


function createError(message, config, code, request, response) {
    if (axios.AxiosError && typeof axios.AxiosError === 'function') {
        return new axios.AxiosError(message, axios.AxiosError[code], config, request, response);
    }

    var error = new Error(message);
    return enhanceError(error, config, code, request, response);
}
/**
 *
 * Note:
 *
 *   This function is for backward compatible.
 *
 *
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */

function enhanceError(error, config, code, request, response) {
    error.config = config;

    if (code) {
        error.code = code;
    }

    error.request = request;
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = function toJSON() {
        return {
            // Standard
            message: this.message,
            name: this.name,
            // Microsoft
            description: this.description,
            number: this.number,
            // Mozilla
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            // Axios
            config: this.config,
            code: this.code,
            status: this.response && this.response.status ? this.response.status : null
        };
    };

    return error;
}

var version$1 = "2.18.0";

var version = version$1;

var removeTrailingSlashes = function removeTrailingSlashes(inURL) {
    return inURL && inURL.endsWith('/') ? inURL.replace(/\/+$/, '') : inURL;
};

var setImmediate = global$1.setImmediate || nextTick.bind(process);

var noop = function noop() {};

var Analytics = /*#__PURE__*/function () {
    /**
     * Initialize a new `Analytics` with your RudderStack source's `writeKey` and an
     * optional dictionary of `options`.
     *
     * @param {String} writeKey
     * @param {String} dataPlaneURL
     * @param {Object=} options (optional)
     * @param {Number=20} options.flushAt (default: 20)
     * @param {Number=20000} options.flushInterval (default: 20000)
     * @param {Boolean=true} options.enable (default: true)
     * @param {Number=20000} options.maxInternalQueueSize (default: 20000)
     * @param {Number} options.timeout (default: false)
     * @param {String=info} options.logLevel (default: info)
     * @param {Boolean=true} options.enable (default: true)
     */
    function Analytics(writeKey, dataPlaneURL, options) {
        _classCallCheck(this, Analytics);

        options = options || {};
        assert$1(writeKey, "You must pass your project's write key.");
        assert$1(dataPlaneURL, 'You must pass your data plane url.');
        this.queue = [];
        this.writeKey = writeKey;
        this.host = removeTrailingSlashes(dataPlaneURL);
        this.timeout = options.timeout || false;
        this.flushAt = Math.max(options.flushAt, 1) || 20;
        this.flushInterval = options.flushInterval || 20000;
        this.maxInternalQueueSize = options.maxInternalQueueSize || 20000;
        this.logLevel = options.logLevel || 'info';
        this.flushed = false;
        this.axiosInstance = axios.create({
            adapter: fetchAdapter
        });
        Object.defineProperty(this, 'enable', {
            configurable: false,
            writable: false,
            enumerable: true,
            value: typeof options.enable === 'boolean' ? options.enable : true
        });
        this.logger = {
            error: function error(message) {
                if (this.logLevel !== 'off') {
                    var _console;

                    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        args[_key - 1] = arguments[_key];
                    }

                    (_console = console).error.apply(_console, ["".concat(new Date().toISOString(), " [\"Rudder\"] error: ").concat(message)].concat(args));
                }
            },
            info: function info(message) {
                if (['silly', 'debug', 'info'].includes(this.logLevel)) {
                    var _console2;

                    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                        args[_key2 - 1] = arguments[_key2];
                    }

                    (_console2 = console).log.apply(_console2, ["".concat(new Date().toISOString(), " [\"Rudder\"] info: ").concat(message)].concat(args));
                }
            },
            debug: function debug(message) {
                if (['silly', 'debug'].includes(this.logLevel)) {
                    var _console3;

                    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                        args[_key3 - 1] = arguments[_key3];
                    }

                    (_console3 = console).debug.apply(_console3, ["".concat(new Date().toISOString(), " [\"Rudder\"] debug: ").concat(message)].concat(args));
                }
            },
            silly: function silly(message) {
                if (['silly'].includes(this.logLevel)) {
                    var _console4;

                    for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                        args[_key4 - 1] = arguments[_key4];
                    }

                    (_console4 = console).info.apply(_console4, ["".concat(new Date().toISOString(), " [\"Rudder\"] silly: ").concat(message)].concat(args));
                }
            }
        };
        axiosRetry(this.axiosInstance, {
            retries: 0
        });
    }

    _createClass(Analytics, [{
        key: "_validate",
        value: function _validate(message, type) {
            try {
                looselyValidateEvent_1(message, type);
            } catch (e) {
                if (e.message === 'Your message must be < 32kb.') {
                    this.logger.info('Your message must be < 32kb. This is currently surfaced as a warning. Please update your code', message);
                    return;
                }

                throw e;
            }
        }
        /**
         * Send an identify `message`.
         *
         * @param {Object} message
         * @param {String=} message.userId (optional)
         * @param {String=} message.anonymousId (optional)
         * @param {Object=} message.context (optional)
         * @param {Object=} message.traits (optional)
         * @param {Object=} message.integrations (optional)
         * @param {Date=} message.timestamp (optional)
         * @param {Function=} callback (optional)
         * @return {Analytics}
         */

    }, {
        key: "identify",
        value: function identify(message, callback) {
            this._validate(message, 'identify');

            this.enqueue('identify', message, callback);
            return this;
        }
        /**
         * Send a group `message`.
         *
         * @param {Object} message
         * @param {String} message.groupId
         * @param {String=} message.userId (optional)
         * @param {String=} message.anonymousId (optional)
         * @param {Object=} message.context (optional)
         * @param {Object=} message.traits (optional)
         * @param {Object=} message.integrations (optional)
         * @param {Date=} message.timestamp (optional)
         * @param {Function=} callback (optional)
         * @return {Analytics}
         */

    }, {
        key: "group",
        value: function group(message, callback) {
            this._validate(message, 'group');

            this.enqueue('group', message, callback);
            return this;
        }
        /**
         * Send a track `message`.
         *
         * @param {Object} message
         * @param {String} message.event
         * @param {String=} message.userId (optional)
         * @param {String=} message.anonymousId (optional)
         * @param {Object=} message.context (optional)
         * @param {Object=} message.properties (optional)
         * @param {Object=} message.integrations (optional)
         * @param {Date=} message.timestamp (optional)
         * @param {Function=} callback (optional)
         * @return {Analytics}
         */

    }, {
        key: "track",
        value: function track(message, callback) {
            this._validate(message, 'track');

            this.enqueue('track', message, callback);
            return this;
        }
        /**
         * Send a page `message`.
         *
         * @param {Object} message
         * @param {String} message.name
         * @param {String=} message.userId (optional)
         * @param {String=} message.anonymousId (optional)
         * @param {Object=} message.context (optional)
         * @param {Object=} message.properties (optional)
         * @param {Object=} message.integrations (optional)
         * @param {Date=} message.timestamp (optional)
         * @param {Function=} callback (optional)
         * @return {Analytics}
         */

    }, {
        key: "page",
        value: function page(message, callback) {
            this._validate(message, 'page');

            this.enqueue('page', message, callback);
            return this;
        }
        /**
         * Send a screen `message`.
         *
         * @param {Object} message
         * @param {Function} callback (optional)
         * @return {Analytics}
         */

    }, {
        key: "screen",
        value: function screen(message, callback) {
            this._validate(message, 'screen');

            this.enqueue('screen', message, callback);
            return this;
        }
        /**
         * Send an alias `message`.
         *
         * @param {Object} message
         * @param {String} message.previousId
         * @param {String=} message.userId (optional)
         * @param {String=} message.anonymousId (optional)
         * @param {Object=} message.context (optional)
         * @param {Object=} message.properties (optional)
         * @param {Object=} message.integrations (optional)
         * @param {Date=} message.timestamp (optional)
         * @param {Function=} callback (optional)
         * @return {Analytics}
         */

    }, {
        key: "alias",
        value: function alias(message, callback) {
            this._validate(message, 'alias');

            this.enqueue('alias', message, callback);
            return this;
        }
        /**
         * Add a `message` of type `type` to the queue and
         * check whether it should be flushed.
         *
         * @param {String} type
         * @param {Object} message
         * @param {Function} [callback] (optional)
         * @api private
         */

    }, {
        key: "enqueue",
        value: function enqueue(type, message, callback) {
            if (this.queue.length >= this.maxInternalQueueSize) {
                this.logger.error("not adding events for processing as queue size ".concat(this.queue.length, " >= than max configuration ").concat(this.maxInternalQueueSize));
                return;
            } // Clone the incoming message object
            // before altering the data


            var lMessage = cloneDeep(message);
            callback = callback || noop;

            if (!this.enable) {
                return setImmediate(callback);
            }

            if (type == 'identify') {
                if (lMessage.traits) {
                    if (!lMessage.context) {
                        lMessage.context = {};
                    }

                    lMessage.context.traits = lMessage.traits;
                }
            }

            lMessage = _objectSpread2({}, lMessage);
            lMessage.type = type;
            lMessage.context = _objectSpread2({
                library: {
                    name: 'analytics-service-worker',
                    version: version
                }
            }, lMessage.context);
            lMessage.channel = 'service-worker';
            lMessage._metadata = _objectSpread2({
                serviceWorkerVersion: version
            }, lMessage._metadata);

            if (!lMessage.originalTimestamp) {
                lMessage.originalTimestamp = new Date();
            }

            if (!lMessage.messageId) {
                lMessage.messageId = "service-worker-".concat(md5$1.exports(JSON.stringify(lMessage)), "-").concat(v4());
            } // Historically this library has accepted strings and numbers as IDs.
            // However, our spec only allows strings. To avoid breaking compatibility,
            // we'll coerce these to strings if they aren't already.


            if (lMessage.anonymousId && !lodash_isstring(lMessage.anonymousId)) {
                lMessage.anonymousId = JSON.stringify(lMessage.anonymousId);
            }

            if (lMessage.userId && !lodash_isstring(lMessage.userId)) {
                lMessage.userId = JSON.stringify(lMessage.userId);
            }

            this.queue.push({
                message: lMessage,
                callback: callback
            });

            if (!this.flushed) {
                this.flushed = true;
                this.flush();
                return;
            }

            if (this.queue.length >= this.flushAt) {
                this.logger.debug('flushAt reached, trying flush...');
                this.flush();
            }

            if (this.flushInterval && !this.flushTimer) {
                this.logger.debug('no existing flush timer, creating new one');
                this.flushTimer = setTimeout(this.flush.bind(this), this.flushInterval);
            }
        }
        /**
         * Flush the current queue
         *
         * @param {Function} [callback] (optional)
         * @return {Analytics}
         */

    }, {
        key: "flush",
        value: function flush(callback) {
            var _this = this;

            // check if earlier flush was pushed to queue
            this.logger.debug('in flush');
            callback = callback || noop;

            if (!this.enable) {
                return setImmediate(callback);
            }

            if (this.timer) {
                this.logger.debug('cancelling existing timer...');
                clearTimeout(this.timer);
                this.timer = null;
            }

            if (this.flushTimer) {
                this.logger.debug('cancelling existing flushTimer...');
                clearTimeout(this.flushTimer);
                this.flushTimer = null;
            }

            if (!this.queue.length) {
                this.logger.debug('queue is empty, nothing to flush');
                return setImmediate(callback);
            }

            var items = this.queue.splice(0, this.flushAt);
            var callbacks = items.map(function (item) {
                return item.callback;
            });
            var messages = items.map(function (item) {
                // if someone mangles directly with queue
                if (_typeof(item.message) === 'object') {
                    item.message.sentAt = new Date();
                }

                return item.message;
            });
            var data = {
                batch: messages,
                sentAt: new Date()
            };
            this.logger.debug("batch size is ".concat(items.length));
            this.logger.silly('===data===', data);

            var done = function done(err) {
                callbacks.forEach(function (callback_) {
                    callback_(err);
                });
                callback(err, data);
            }; // Don't set the user agent if we're not on a browser. The latest spec allows
            // the User-Agent header (see https://fetch.spec.whatwg.org/#terminology-headers
            // and https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader),
            // but browsers such as Chrome and Safari have not caught up.


            var headers = {};

            if (typeof window === 'undefined') {
                headers['user-agent'] = "analytics-service-worker/".concat(version);
                headers['Content-Type'] = "application/json";
            }

            var req = {
                method: 'POST',
                url: "".concat(this.host),
                auth: {
                    username: this.writeKey
                },
                data: data,
                headers: headers
            };

            if (this.timeout) {
                req.timeout = typeof this.timeout === 'string' ? ms(this.timeout) : this.timeout;
            }

            this.axiosInstance(_objectSpread2(_objectSpread2({}, req), {}, {
                'axios-retry': {
                    retries: 3,
                    retryCondition: this._isErrorRetryable.bind(this),
                    retryDelay: axiosRetry.exponentialDelay
                }
            })).then(function (response) {
                _this.timer = setTimeout(_this.flush.bind(_this), _this.flushInterval);
                done();
            }).catch(function (err) {
                console.log(err);

                _this.logger.error("got error while attempting send for 3 times, dropping ".concat(items.length, " events"));

                _this.timer = setTimeout(_this.flush.bind(_this), _this.flushInterval);

                if (err.response) {
                    var error = new Error(err.response.statusText);
                    return done(error);
                }

                done(err);
            });
        }
    }, {
        key: "_isErrorRetryable",
        value: function _isErrorRetryable(error) {
            // Retry Network Errors.
            if (axiosRetry.isNetworkError(error)) {
                return true;
            }

            if (!error.response) {
                // Cannot determine if the request can be retried
                return false;
            }

            this.logger.error("error status: ".concat(error.response.status)); // Retry Server Errors (5xx).

            if (error.response.status >= 500 && error.response.status <= 599) {
                return true;
            } // Retry if rate limited.


            if (error.response.status === 429) {
                return true;
            }

            return false;
        }
    }]);

    return Analytics;
}();

export { Analytics };
