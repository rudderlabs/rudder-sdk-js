// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.
(() => {
    //======================== npm cjs package code ==========================================

    function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter(function (r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable;
            })), t.push.apply(t, o);
        }
        return t;
    }
    function _objectSpread2(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
                _defineProperty(e, r, t[r]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
            });
        }
        return e;
    }
    function _regeneratorRuntime() {
        _regeneratorRuntime = function () {
            return e;
        };
        var t,
            e = {},
            r = Object.prototype,
            n = r.hasOwnProperty,
            o = Object.defineProperty || function (t, e, r) {
                t[e] = r.value;
            },
            i = "function" == typeof Symbol ? Symbol : {},
            a = i.iterator || "@@iterator",
            c = i.asyncIterator || "@@asyncIterator",
            u = i.toStringTag || "@@toStringTag";
        function define(t, e, r) {
            return Object.defineProperty(t, e, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }), t[e];
        }
        try {
            define({}, "");
        } catch (t) {
            define = function (t, e, r) {
                return t[e] = r;
            };
        }
        function wrap(t, e, r, n) {
            var i = e && e.prototype instanceof Generator ? e : Generator,
                a = Object.create(i.prototype),
                c = new Context(n || []);
            return o(a, "_invoke", {
                value: makeInvokeMethod(t, r, c)
            }), a;
        }
        function tryCatch(t, e, r) {
            try {
                return {
                    type: "normal",
                    arg: t.call(e, r)
                };
            } catch (t) {
                return {
                    type: "throw",
                    arg: t
                };
            }
        }
        e.wrap = wrap;
        var h = "suspendedStart",
            l = "suspendedYield",
            f = "executing",
            s = "completed",
            y = {};
        function Generator() {}
        function GeneratorFunction() {}
        function GeneratorFunctionPrototype() {}
        var p = {};
        define(p, a, function () {
            return this;
        });
        var d = Object.getPrototypeOf,
            v = d && d(d(values([])));
        v && v !== r && n.call(v, a) && (p = v);
        var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
        function defineIteratorMethods(t) {
            ["next", "throw", "return"].forEach(function (e) {
                define(t, e, function (t) {
                    return this._invoke(e, t);
                });
            });
        }
        function AsyncIterator(t, e) {
            function invoke(r, o, i, a) {
                var c = tryCatch(t[r], t, o);
                if ("throw" !== c.type) {
                    var u = c.arg,
                        h = u.value;
                    return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
                        invoke("next", t, i, a);
                    }, function (t) {
                        invoke("throw", t, i, a);
                    }) : e.resolve(h).then(function (t) {
                        u.value = t, i(u);
                    }, function (t) {
                        return invoke("throw", t, i, a);
                    });
                }
                a(c.arg);
            }
            var r;
            o(this, "_invoke", {
                value: function (t, n) {
                    function callInvokeWithMethodAndArg() {
                        return new e(function (e, r) {
                            invoke(t, n, e, r);
                        });
                    }
                    return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
                }
            });
        }
        function makeInvokeMethod(e, r, n) {
            var o = h;
            return function (i, a) {
                if (o === f) throw new Error("Generator is already running");
                if (o === s) {
                    if ("throw" === i) throw a;
                    return {
                        value: t,
                        done: !0
                    };
                }
                for (n.method = i, n.arg = a;;) {
                    var c = n.delegate;
                    if (c) {
                        var u = maybeInvokeDelegate(c, n);
                        if (u) {
                            if (u === y) continue;
                            return u;
                        }
                    }
                    if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
                        if (o === h) throw o = s, n.arg;
                        n.dispatchException(n.arg);
                    } else "return" === n.method && n.abrupt("return", n.arg);
                    o = f;
                    var p = tryCatch(e, r, n);
                    if ("normal" === p.type) {
                        if (o = n.done ? s : l, p.arg === y) continue;
                        return {
                            value: p.arg,
                            done: n.done
                        };
                    }
                    "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
                }
            };
        }
        function maybeInvokeDelegate(e, r) {
            var n = r.method,
                o = e.iterator[n];
            if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
            var i = tryCatch(o, e.iterator, r.arg);
            if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
            var a = i.arg;
            return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
        }
        function pushTryEntry(t) {
            var e = {
                tryLoc: t[0]
            };
            1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
        }
        function resetTryEntry(t) {
            var e = t.completion || {};
            e.type = "normal", delete e.arg, t.completion = e;
        }
        function Context(t) {
            this.tryEntries = [{
                tryLoc: "root"
            }], t.forEach(pushTryEntry, this), this.reset(!0);
        }
        function values(e) {
            if (e || "" === e) {
                var r = e[a];
                if (r) return r.call(e);
                if ("function" == typeof e.next) return e;
                if (!isNaN(e.length)) {
                    var o = -1,
                        i = function next() {
                            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
                            return next.value = t, next.done = !0, next;
                        };
                    return i.next = i;
                }
            }
            throw new TypeError(typeof e + " is not iterable");
        }
        return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
            value: GeneratorFunctionPrototype,
            configurable: !0
        }), o(GeneratorFunctionPrototype, "constructor", {
            value: GeneratorFunction,
            configurable: !0
        }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
            var e = "function" == typeof t && t.constructor;
            return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
        }, e.mark = function (t) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
        }, e.awrap = function (t) {
            return {
                __await: t
            };
        }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
            return this;
        }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
            void 0 === i && (i = Promise);
            var a = new AsyncIterator(wrap(t, r, n, o), i);
            return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
                return t.done ? t.value : a.next();
            });
        }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
            return this;
        }), define(g, "toString", function () {
            return "[object Generator]";
        }), e.keys = function (t) {
            var e = Object(t),
                r = [];
            for (var n in e) r.push(n);
            return r.reverse(), function next() {
                for (; r.length;) {
                    var t = r.pop();
                    if (t in e) return next.value = t, next.done = !1, next;
                }
                return next.done = !0, next;
            };
        }, e.values = values, Context.prototype = {
            constructor: Context,
            reset: function (e) {
                if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
            },
            stop: function () {
                this.done = !0;
                var t = this.tryEntries[0].completion;
                if ("throw" === t.type) throw t.arg;
                return this.rval;
            },
            dispatchException: function (e) {
                if (this.done) throw e;
                var r = this;
                function handle(n, o) {
                    return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
                }
                for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                    var i = this.tryEntries[o],
                        a = i.completion;
                    if ("root" === i.tryLoc) return handle("end");
                    if (i.tryLoc <= this.prev) {
                        var c = n.call(i, "catchLoc"),
                            u = n.call(i, "finallyLoc");
                        if (c && u) {
                            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
                            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
                        } else if (c) {
                            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
                        } else {
                            if (!u) throw new Error("try statement without catch or finally");
                            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
                        }
                    }
                }
            },
            abrupt: function (t, e) {
                for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var o = this.tryEntries[r];
                    if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
                        var i = o;
                        break;
                    }
                }
                i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
                var a = i ? i.completion : {};
                return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
            },
            complete: function (t, e) {
                if ("throw" === t.type) throw t.arg;
                return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
            },
            finish: function (t) {
                for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
                }
            },
            catch: function (t) {
                for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.tryLoc === t) {
                        var n = r.completion;
                        if ("throw" === n.type) {
                            var o = n.arg;
                            resetTryEntry(r);
                        }
                        return o;
                    }
                }
                throw new Error("illegal catch attempt");
            },
            delegateYield: function (e, r, n) {
                return this.delegate = {
                    iterator: values(e),
                    resultName: r,
                    nextLoc: n
                }, "next" === this.method && (this.arg = t), y;
            }
        }, e;
    }
    function _typeof(o) {
        "@babel/helpers - typeof";

        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
            return typeof o;
        } : function (o) {
            return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
        }, _typeof(o);
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
    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: true,
                configurable: true
            }
        });
        Object.defineProperty(subClass, "prototype", {
            writable: false
        });
        if (superClass) _setPrototypeOf(subClass, superClass);
    }
    function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
        };
        return _getPrototypeOf(o);
    }
    function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
        };
        return _setPrototypeOf(o, p);
    }
    function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === "function") return true;
        try {
            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
            return true;
        } catch (e) {
            return false;
        }
    }
    function _construct(Parent, args, Class) {
        if (_isNativeReflectConstruct()) {
            _construct = Reflect.construct.bind();
        } else {
            _construct = function _construct(Parent, args, Class) {
                var a = [null];
                a.push.apply(a, args);
                var Constructor = Function.bind.apply(Parent, a);
                var instance = new Constructor();
                if (Class) _setPrototypeOf(instance, Class.prototype);
                return instance;
            };
        }
        return _construct.apply(null, arguments);
    }
    function _assertThisInitialized(self) {
        if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return self;
    }
    function _possibleConstructorReturn(self, call) {
        if (call && (typeof call === "object" || typeof call === "function")) {
            return call;
        } else if (call !== void 0) {
            throw new TypeError("Derived constructors may only return object or undefined");
        }
        return _assertThisInitialized(self);
    }
    function _createSuper(Derived) {
        var hasNativeReflectConstruct = _isNativeReflectConstruct();
        return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
                result;
            if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
            } else {
                result = Super.apply(this, arguments);
            }
            return _possibleConstructorReturn(this, result);
        };
    }
    function _superPropBase(object, property) {
        while (!Object.prototype.hasOwnProperty.call(object, property)) {
            object = _getPrototypeOf(object);
            if (object === null) break;
        }
        return object;
    }
    function _get() {
        if (typeof Reflect !== "undefined" && Reflect.get) {
            _get = Reflect.get.bind();
        } else {
            _get = function _get(target, property, receiver) {
                var base = _superPropBase(target, property);
                if (!base) return;
                var desc = Object.getOwnPropertyDescriptor(base, property);
                if (desc.get) {
                    return desc.get.call(arguments.length < 3 ? target : receiver);
                }
                return desc.value;
            };
        }
        return _get.apply(this, arguments);
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

    function _has(prop,obj){return Object.prototype.hasOwnProperty.call(obj,prop);}

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
     *      R.type(async () => {}); //=> "AsyncFunction"
     *      R.type(undefined); //=> "Undefined"
     */var type=/*#__PURE__*/_curry1(function type(val){return val===null?'Null':val===undefined?'Undefined':Object.prototype.toString.call(val).slice(8,-1);});var type$1 = type;

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
     */var nth=/*#__PURE__*/_curry2(function nth(offset,list){var idx=offset<0?list.length+offset:offset;return _isString(list)?list.charAt(idx):list[idx];});var nth$1 = nth;

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
            var cachedCopy=map.get(value);if(cachedCopy){return cachedCopy;}map.set(value,copiedValue);for(var key in value){if(Object.prototype.hasOwnProperty.call(value,key)){copiedValue[key]=deep?_clone(value[key],true,map):value[key];}}return copiedValue;};switch(type$1(value)){case'Object':return copy(Object.create(Object.getPrototypeOf(value)));case'Array':return copy([]);case'Date':return new Date(value.valueOf());case'RegExp':return _cloneRegExp(value);case'Int8Array':case'Uint8Array':case'Uint8ClampedArray':case'Int16Array':case'Uint16Array':case'Int32Array':case'Uint32Array':case'Float32Array':case'Float64Array':case'BigInt64Array':case'BigUint64Array':return value.slice();default:return value;}}function _isPrimitive(param){var type=_typeof(param);return param==null||type!='object'&&type!='function';}var _ObjectMap=/*#__PURE__*/function(){function _ObjectMap(){this.map={};this.length=0;}_ObjectMap.prototype.set=function(key,value){var hashedKey=this.hash(key);var bucket=this.map[hashedKey];if(!bucket){this.map[hashedKey]=bucket=[];}bucket.push([key,value]);this.length+=1;};_ObjectMap.prototype.hash=function(key){var hashedKey=[];for(var value in key){hashedKey.push(Object.prototype.toString.call(key[value]));}return hashedKey.join();};_ObjectMap.prototype.get=function(key){/**
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
     */var paths=/*#__PURE__*/_curry2(function paths(pathsArray,obj){return pathsArray.map(function(paths){var val=obj;var idx=0;var p;while(idx<paths.length){if(val==null){return;}p=paths[idx];val=_isInteger(p)?nth$1(p,val):val[p];idx+=1;}return val;});});var paths$1 = paths;

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
     */var path=/*#__PURE__*/_curry2(function path(pathAr,obj){return paths$1([pathAr],obj)[0];});var path$1 = path;

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
     */var mergeWithKey=/*#__PURE__*/_curry3(function mergeWithKey(fn,l,r){var result={};var k;l=l||{};r=r||{};for(k in l){if(_has(k,l)){result[k]=_has(k,r)?fn(k,l[k],r[k]):l[k];}}for(k in r){if(_has(k,r)&&!_has(k,result)){result[k]=r[k];}}return result;});var mergeWithKey$1 = mergeWithKey;

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
     */var mergeDeepWithKey=/*#__PURE__*/_curry3(function mergeDeepWithKey(fn,lObj,rObj){return mergeWithKey$1(function(k,lVal,rVal){if(_isObject(lVal)&&_isObject(rVal)){return mergeDeepWithKey(fn,lVal,rVal);}else {return fn(k,lVal,rVal);}},lObj,rObj);});var mergeDeepWithKey$1 = mergeDeepWithKey;

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
     */var mergeDeepWith=/*#__PURE__*/_curry3(function mergeDeepWith(fn,lObj,rObj){return mergeDeepWithKey$1(function(k,lVal,rVal){return fn(lVal,rVal);},lObj,rObj);});var mergeDeepWith$1 = mergeDeepWith;

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
     */ // eslint-disable-next-line @typescript-eslint/ban-types
    var isFunction=function isFunction(value){return typeof value==='function'&&Boolean(value.constructor&&value.call&&value.apply);};/**
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
     * A function to check given value is defined and not null
     * @param value input value
     * @returns boolean
     */var isDefinedNotNullAndNotEmptyString=function isDefinedNotNullAndNotEmptyString(value){return isDefinedAndNotNull(value)&&value!=='';};/**
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
     */var removeUndefinedAndNullValues=function removeUndefinedAndNullValues(obj){var result=pickBy$1(isDefinedAndNotNull,obj);Object.keys(result).forEach(function(key){var value=result[key];if(isObjectLiteralAndNotNull(value)){result[key]=removeUndefinedAndNullValues(value);}});return result;};

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

    var CAPABILITIES_MANAGER='CapabilitiesManager';var CONFIG_MANAGER='ConfigManager';var EVENT_MANAGER='EventManager';var PLUGINS_MANAGER='PluginsManager';var USER_SESSION_MANAGER='UserSessionManager';var ERROR_HANDLER='ErrorHandler';var PLUGIN_ENGINE='PluginEngine';var STORE_MANAGER='StoreManager';var READY_API='readyApi';var EVENT_REPOSITORY='EventRepository';var EXTERNAL_SRC_LOADER='ExternalSrcLoader';var HTTP_CLIENT='HttpClient';var RS_APP='RudderStackApplication';var ANALYTICS_CORE='AnalyticsCore';

    var APP_NAME='RudderLabs JavaScript SDK';var APP_VERSION='3.0.0-beta.14';var APP_NAMESPACE='com.rudderlabs.javascript';var MODULE_TYPE='npm';var ADBLOCK_PAGE_CATEGORY='RudderJS-Initiated';var ADBLOCK_PAGE_NAME='ad-block page request';var ADBLOCK_PAGE_PATH='/ad-blocked';var GLOBAL_PRELOAD_BUFFER='preloadedEventsBuffer';var CONSENT_TRACK_EVENT_NAME='Consent Management Interaction';

    var QUERY_PARAM_TRAIT_PREFIX='ajs_trait_';var QUERY_PARAM_PROPERTY_PREFIX='ajs_prop_';var QUERY_PARAM_ANONYMOUS_ID_KEY='ajs_aid';var QUERY_PARAM_USER_ID_KEY='ajs_uid';var QUERY_PARAM_TRACK_EVENT_NAME_KEY='ajs_event';

    var DEFAULT_XHR_TIMEOUT_MS=10*1000;// 10 seconds
    var DEFAULT_COOKIE_MAX_AGE_MS=31536000*1000;// 1 year
    var DEFAULT_SESSION_TIMEOUT_MS=30*60*1000;// 30 minutes
    var MIN_SESSION_TIMEOUT_MS=10*1000;// 10 seconds
    var DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS=10*1000;// 10 seconds
    var DEBOUNCED_TIMEOUT_MS=250;// 250 milliseconds

    /**
     * Create globally accessible RudderStackGlobals object
     */var createExposedGlobals=function createExposedGlobals(){var analyticsInstanceId=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'app';if(!globalThis.RudderStackGlobals){globalThis.RudderStackGlobals={};}if(!globalThis.RudderStackGlobals[analyticsInstanceId]){globalThis.RudderStackGlobals[analyticsInstanceId]={};}};/**
     * Add move values to globally accessible RudderStackGlobals object per analytics instance
     */var setExposedGlobal=function setExposedGlobal(keyName,value){var analyticsInstanceId=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'app';createExposedGlobals(analyticsInstanceId);globalThis.RudderStackGlobals[analyticsInstanceId][keyName]=value;};/**
     * Get values from globally accessible RudderStackGlobals object by analytics instance
     */var getExposedGlobal=function getExposedGlobal(keyName){var analyticsInstanceId=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'app';createExposedGlobals(analyticsInstanceId);return globalThis.RudderStackGlobals[analyticsInstanceId][keyName];};function debounce(func,thisArg){var delay=arguments.length>2&&arguments[2]!==undefined?arguments[2]:DEBOUNCED_TIMEOUT_MS;var timeoutId;return function(){for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}globalThis.clearTimeout(timeoutId);timeoutId=globalThis.setTimeout(function(){func.apply(thisArg,args);},delay);};}

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
            while(ancestors.length>0&&ancestors[ancestors.length-1]!==this){ancestors.pop();}if(ancestors.includes(value)){logger===null||logger===void 0||logger.warn(CIRCULAR_REFERENCE_WARNING(JSON_STRINGIFY,key));return '[Circular Reference]';}ancestors.push(value);return value;};};/**
     * Utility method for JSON stringify object excluding null values & circular references
     *
     * @param {*} value input
     * @param {boolean} excludeNull if it should exclude nul or not
     * @param {function} logger optional logger methods for warning
     * @returns string
     */var stringifyWithoutCircular=function stringifyWithoutCircular(value,excludeNull,excludeKeys,logger){try{return JSON.stringify(value,getCircularReplacer(excludeNull,excludeKeys,logger));}catch(err){logger===null||logger===void 0||logger.warn(JSON_STRINGIFY_WARNING,err);return null;}};

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
     */var insertScript=function insertScript(newScriptElement){var _scriptElements$;// First try to add it to the head
        var headElements=document.getElementsByTagName('head');if(headElements.length>0){var _headElements$,_headElements$2;(_headElements$=headElements[0])===null||_headElements$===void 0||_headElements$.insertBefore(newScriptElement,(_headElements$2=headElements[0])===null||_headElements$2===void 0?void 0:_headElements$2.firstChild);return;}// Else wise add it before the first script tag
        var scriptElements=document.getElementsByTagName('script');if(scriptElements.length>0&&(_scriptElements$=scriptElements[0])!==null&&_scriptElements$!==void 0&&_scriptElements$.parentNode){var _scriptElements$2;(_scriptElements$2=scriptElements[0])===null||_scriptElements$2===void 0||_scriptElements$2.parentNode.insertBefore(newScriptElement,scriptElements[0]);return;}// Create a new head element and add the script as fallback
        var headElement=document.createElement('head');headElement.appendChild(newScriptElement);var htmlElement=document.getElementsByTagName('html')[0];htmlElement===null||htmlElement===void 0||htmlElement.insertBefore(headElement,htmlElement.firstChild);};/**
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
     */_createClass(ExternalSrcLoader,[{key:"loadJSFile",value:function loadJSFile(config){var _this=this;var url=config.url,id=config.id,timeout=config.timeout,async=config.async,callback=config.callback,extraAttributes=config.extraAttributes;var isFireAndForget=!isFunction(callback);jsFileLoader(url,id,timeout||this.timeout,async,extraAttributes).then(function(id){if(!isFireAndForget){callback(id);}}).catch(function(err){_this.onError(err);if(!isFireAndForget){callback();}});}/**
         * Handle errors
         */},{key:"onError",value:function onError(error){if(this.hasErrorHandler){var _this$errorHandler;(_this$errorHandler=this.errorHandler)===null||_this$errorHandler===void 0||_this$errorHandler.onError(error,EXTERNAL_SRC_LOADER);}else {throw error;}}}]);return ExternalSrcLoader;}();

    function i$2(){throw new Error("Cycle detected");}var t$1=Symbol.for("preact-signals");function r(){if(!(v>1)){var i,t=!1;while(void 0!==f){var r=f;f=void 0;e++;while(void 0!==r){var n=r.o;r.o=void 0;r.f&=-3;if(!(8&r.f)&&l(r))try{r.c();}catch(r){if(!t){i=r;t=!0;}}r=n;}}e=0;v--;if(t)throw i;}else v--;}function n(i){if(v>0)return i();v++;try{return i();}finally{r();}}var o=void 0;var f=void 0,v=0,e=0,u=0;function c(i){if(void 0!==o){var t=i.n;if(void 0===t||t.t!==o){t={i:0,S:i,p:o.s,n:void 0,t:o,e:void 0,x:void 0,r:t};if(void 0!==o.s)o.s.n=t;o.s=t;i.n=t;if(32&o.f)i.S(t);return t;}else if(-1===t.i){t.i=0;if(void 0!==t.n){t.n.p=t.p;if(void 0!==t.p)t.p.n=t.n;t.p=o.s;t.n=void 0;o.s.n=t;o.s=t;}return t;}}}function d$1(i){this.v=i;this.i=0;this.n=void 0;this.t=void 0;}d$1.prototype.brand=t$1;d$1.prototype.h=function(){return !0;};d$1.prototype.S=function(i){if(this.t!==i&&void 0===i.e){i.x=this.t;if(void 0!==this.t)this.t.e=i;this.t=i;}};d$1.prototype.U=function(i){if(void 0!==this.t){var t=i.e,r=i.x;if(void 0!==t){t.x=r;i.e=void 0;}if(void 0!==r){r.e=t;i.x=void 0;}if(i===this.t)this.t=r;}};d$1.prototype.subscribe=function(i){var t=this;return O(function(){var r=t.value,n=32&this.f;this.f&=-33;try{i(r);}finally{this.f|=n;}});};d$1.prototype.valueOf=function(){return this.value;};d$1.prototype.toString=function(){return this.value+"";};d$1.prototype.toJSON=function(){return this.value;};d$1.prototype.peek=function(){return this.v;};Object.defineProperty(d$1.prototype,"value",{get:function get(){var i=c(this);if(void 0!==i)i.i=this.i;return this.v;},set:function set(t){if(o instanceof _)!function(){throw new Error("Computed cannot have side-effects");}();if(t!==this.v){if(e>100)i$2();this.v=t;this.i++;u++;v++;try{for(var n=this.t;void 0!==n;n=n.x)n.t.N();}finally{r();}}}});function a(i){return new d$1(i);}function l(i){for(var t=i.s;void 0!==t;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return !0;return !1;}function y(i){for(var t=i.s;void 0!==t;t=t.n){var r=t.S.n;if(void 0!==r)t.r=r;t.S.n=t;t.i=-1;if(void 0===t.n){i.s=t;break;}}}function w(i){var t=i.s,r=void 0;while(void 0!==t){var n=t.p;if(-1===t.i){t.S.U(t);if(void 0!==n)n.n=t.n;if(void 0!==t.n)t.n.p=n;}else r=t;t.S.n=t.r;if(void 0!==t.r)t.r=void 0;t=n;}i.s=r;}function _(i){d$1.call(this,void 0);this.x=i;this.s=void 0;this.g=u-1;this.f=4;}(_.prototype=new d$1()).h=function(){this.f&=-3;if(1&this.f)return !1;if(32==(36&this.f))return !0;this.f&=-5;if(this.g===u)return !0;this.g=u;this.f|=1;if(this.i>0&&!l(this)){this.f&=-2;return !0;}var i=o;try{y(this);o=this;var t=this.x();if(16&this.f||this.v!==t||0===this.i){this.v=t;this.f&=-17;this.i++;}}catch(i){this.v=i;this.f|=16;this.i++;}o=i;w(this);this.f&=-2;return !0;};_.prototype.S=function(i){if(void 0===this.t){this.f|=36;for(var t=this.s;void 0!==t;t=t.n)t.S.S(t);}d$1.prototype.S.call(this,i);};_.prototype.U=function(i){if(void 0!==this.t){d$1.prototype.U.call(this,i);if(void 0===this.t){this.f&=-33;for(var t=this.s;void 0!==t;t=t.n)t.S.U(t);}}};_.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var i=this.t;void 0!==i;i=i.x)i.t.N();}};_.prototype.peek=function(){if(!this.h())i$2();if(16&this.f)throw this.v;return this.v;};Object.defineProperty(_.prototype,"value",{get:function get(){if(1&this.f)i$2();var t=c(this);this.h();if(void 0!==t)t.i=this.i;if(16&this.f)throw this.v;return this.v;}});function g(i){var t=i.u;i.u=void 0;if("function"==typeof t){v++;var n=o;o=void 0;try{t();}catch(t){i.f&=-2;i.f|=8;b(i);throw t;}finally{o=n;r();}}}function b(i){for(var t=i.s;void 0!==t;t=t.n)t.S.U(t);i.x=void 0;i.s=void 0;g(i);}function x$1(i){if(o!==this)throw new Error("Out-of-order effect");w(this);o=i;this.f&=-2;if(8&this.f)b(this);r();}function E(i){this.x=i;this.u=void 0;this.s=void 0;this.o=void 0;this.f=32;}E.prototype.c=function(){var i=this.S();try{if(8&this.f)return;if(void 0===this.x)return;var t=this.x();if("function"==typeof t)this.u=t;}finally{i();}};E.prototype.S=function(){if(1&this.f)i$2();this.f|=1;this.f&=-9;g(this);y(this);v++;var t=o;o=this;return x$1.bind(this,t);};E.prototype.N=function(){if(!(2&this.f)){this.f|=2;this.o=f;f=this;}};E.prototype.d=function(){this.f|=8;if(!(1&this.f))b(this);};function O(i){var t=new E(i);try{t.c();}catch(i){t.d();throw i;}return t.d.bind(t);}

    var LOG_LEVEL_MAP={LOG:0,INFO:1,DEBUG:2,WARN:3,ERROR:4,NONE:5};var DEFAULT_LOG_LEVEL='ERROR';var LOG_MSG_PREFIX='RS SDK';var LOG_MSG_PREFIX_STYLE='font-weight: bold; background: black; color: white;';var LOG_MSG_STYLE='font-weight: normal;';/**
     * Service to log messages/data to output provider, default is console
     */var Logger=/*#__PURE__*/function(){function Logger(){var minLogLevel=arguments.length>0&&arguments[0]!==undefined?arguments[0]:DEFAULT_LOG_LEVEL;var scope=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';var logProvider=arguments.length>2&&arguments[2]!==undefined?arguments[2]:console;_classCallCheck(this,Logger);this.minLogLevel=LOG_LEVEL_MAP[minLogLevel];this.scope=scope;this.logProvider=logProvider;}_createClass(Logger,[{key:"log",value:function log(){for(var _len=arguments.length,data=new Array(_len),_key=0;_key<_len;_key++){data[_key]=arguments[_key];}this.outputLog('LOG',data);}},{key:"info",value:function info(){for(var _len2=arguments.length,data=new Array(_len2),_key2=0;_key2<_len2;_key2++){data[_key2]=arguments[_key2];}this.outputLog('INFO',data);}},{key:"debug",value:function debug(){for(var _len3=arguments.length,data=new Array(_len3),_key3=0;_key3<_len3;_key3++){data[_key3]=arguments[_key3];}this.outputLog('DEBUG',data);}},{key:"warn",value:function warn(){for(var _len4=arguments.length,data=new Array(_len4),_key4=0;_key4<_len4;_key4++){data[_key4]=arguments[_key4];}this.outputLog('WARN',data);}},{key:"error",value:function error(){for(var _len5=arguments.length,data=new Array(_len5),_key5=0;_key5<_len5;_key5++){data[_key5]=arguments[_key5];}this.outputLog('ERROR',data);}},{key:"outputLog",value:function outputLog(logMethod,data){if(this.minLogLevel<=LOG_LEVEL_MAP[logMethod]){var _this$logProvider,_this$logProvider2;(_this$logProvider=(_this$logProvider2=this.logProvider)[logMethod.toLowerCase()])===null||_this$logProvider===void 0||_this$logProvider.call.apply(_this$logProvider,[_this$logProvider2].concat(_toConsumableArray(this.formatLogData(data))));}}},{key:"setScope",value:function setScope(scopeVal){this.scope=scopeVal||this.scope;}// TODO: should we allow to change the level via global variable on run time
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

// default is v3
    var SUPPORTED_STORAGE_TYPES=['localStorage','memoryStorage','cookieStorage','sessionStorage','none'];var DEFAULT_STORAGE_TYPE='cookieStorage';

    var SOURCE_CONFIG_OPTION_ERROR="\"getSourceConfig\" must be a function. Please make sure that it is defined and returns a valid source configuration object.";var INTG_CDN_BASE_URL_ERROR="Failed to load the SDK as the CDN base URL for integrations is not valid.";var PLUGINS_CDN_BASE_URL_ERROR="Failed to load the SDK as the CDN base URL for plugins is not valid.";var DATA_PLANE_URL_ERROR="Failed to load the SDK as the data plane URL could not be determined. Please check that the data plane URL is set correctly and try again.";var SOURCE_CONFIG_RESOLUTION_ERROR="Unable to process/parse source configuration response.";var XHR_PAYLOAD_PREP_ERROR="Failed to prepare data for the request.";var EVENT_OBJECT_GENERATION_ERROR="Failed to generate the event object.";var PLUGIN_EXT_POINT_MISSING_ERROR="Failed to invoke plugin because the extension point name is missing.";var PLUGIN_EXT_POINT_INVALID_ERROR="Failed to invoke plugin because the extension point name is invalid.";// ERROR
    var UNSUPPORTED_CONSENT_MANAGER_ERROR=function UNSUPPORTED_CONSENT_MANAGER_ERROR(context,selectedConsentManager,consentManagersToPluginNameMap){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The consent manager \"").concat(selectedConsentManager,"\" is not supported. Please choose one of the following supported consent managers: \"").concat(Object.keys(consentManagersToPluginNameMap),"\".");};var REPORTING_PLUGIN_INIT_FAILURE_ERROR=function REPORTING_PLUGIN_INIT_FAILURE_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to initialize the error reporting plugin.");};var NOTIFY_FAILURE_ERROR=function NOTIFY_FAILURE_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to notify the error.");};var PLUGIN_NAME_MISSING_ERROR=function PLUGIN_NAME_MISSING_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Plugin name is missing.");};var PLUGIN_ALREADY_EXISTS_ERROR=function PLUGIN_ALREADY_EXISTS_ERROR(context,pluginName){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Plugin \"").concat(pluginName,"\" already exists.");};var PLUGIN_NOT_FOUND_ERROR=function PLUGIN_NOT_FOUND_ERROR(context,pluginName){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Plugin \"").concat(pluginName,"\" not found.");};var PLUGIN_ENGINE_BUG_ERROR=function PLUGIN_ENGINE_BUG_ERROR(context,pluginName){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Plugin \"").concat(pluginName,"\" not found in plugins but found in byName. This indicates a bug in the plugin engine. Please report this issue to the development team.");};var PLUGIN_DEPS_ERROR=function PLUGIN_DEPS_ERROR(context,pluginName,notExistDeps){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Plugin \"").concat(pluginName,"\" could not be loaded because some of its dependencies \"").concat(notExistDeps,"\" do not exist.");};var PLUGIN_INVOCATION_ERROR=function PLUGIN_INVOCATION_ERROR(context,extPoint,pluginName){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to invoke the \"").concat(extPoint,"\" extension point of plugin \"").concat(pluginName,"\".");};var STORAGE_UNAVAILABILITY_ERROR_PREFIX=function STORAGE_UNAVAILABILITY_ERROR_PREFIX(context,storageType){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The \"").concat(storageType,"\" storage type is ");};var SOURCE_CONFIG_FETCH_ERROR=function SOURCE_CONFIG_FETCH_ERROR(reason){return "Failed to fetch the source config. Reason: ".concat(reason);};var WRITE_KEY_VALIDATION_ERROR=function WRITE_KEY_VALIDATION_ERROR(writeKey){return "The write key \"".concat(writeKey,"\" is invalid. It must be a non-empty string. Please check that the write key is correct and try again.");};var DATA_PLANE_URL_VALIDATION_ERROR=function DATA_PLANE_URL_VALIDATION_ERROR(dataPlaneUrl){return "The data plane URL \"".concat(dataPlaneUrl,"\" is invalid. It must be a valid URL string. Please check that the data plane URL is correct and try again.");};var READY_API_CALLBACK_ERROR=function READY_API_CALLBACK_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The callback is not a function.");};var XHR_DELIVERY_ERROR=function XHR_DELIVERY_ERROR(prefix,status,statusText,url){return "".concat(prefix," with status: ").concat(status,", ").concat(statusText," for URL: ").concat(url,".");};var XHR_REQUEST_ERROR=function XHR_REQUEST_ERROR(prefix,e,url){return "".concat(prefix," due to timeout or no connection (").concat(e?e.type:'',") for URL: ").concat(url,".");};var XHR_SEND_ERROR=function XHR_SEND_ERROR(prefix,url){return "".concat(prefix," for URL: ").concat(url);};var STORE_DATA_SAVE_ERROR=function STORE_DATA_SAVE_ERROR(key){return "Failed to save the value for \"".concat(key,"\" to storage");};var STORE_DATA_FETCH_ERROR=function STORE_DATA_FETCH_ERROR(key){return "Failed to retrieve or parse data for \"".concat(key,"\" from storage");};// WARNING
    var STORAGE_TYPE_VALIDATION_WARNING=function STORAGE_TYPE_VALIDATION_WARNING(context,storageType,defaultStorageType){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The storage type \"").concat(storageType,"\" is not supported. Please choose one of the following supported types: \"").concat(SUPPORTED_STORAGE_TYPES,"\". The default type \"").concat(defaultStorageType,"\" will be used instead.");};var UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING=function UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING(context,selectedErrorReportingProvider,errorReportingProvidersToPluginNameMap,defaultProvider){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The error reporting provider \"").concat(selectedErrorReportingProvider,"\" is not supported. Please choose one of the following supported providers: \"").concat(Object.keys(errorReportingProvidersToPluginNameMap),"\". The default provider \"").concat(defaultProvider,"\" will be used instead.");};var UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING=function UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING(context,selectedStorageEncryptionVersion,storageEncryptionVersionsToPluginNameMap,defaultVersion){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The storage encryption version \"").concat(selectedStorageEncryptionVersion,"\" is not supported. Please choose one of the following supported versions: \"").concat(Object.keys(storageEncryptionVersionsToPluginNameMap),"\". The default version \"").concat(defaultVersion,"\" will be used instead.");};var STORAGE_DATA_MIGRATION_OVERRIDE_WARNING=function STORAGE_DATA_MIGRATION_OVERRIDE_WARNING(context,storageEncryptionVersion,defaultVersion){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The storage data migration has been disabled because the configured storage encryption version (").concat(storageEncryptionVersion,") is not the latest (").concat(defaultVersion,"). To enable storage data migration, please update the storage encryption version to the latest version.");};var UNSUPPORTED_RESIDENCY_SERVER_REGION_WARNING=function UNSUPPORTED_RESIDENCY_SERVER_REGION_WARNING(context,selectedResidencyServerRegion,defaultRegion){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The residency server region \"").concat(selectedResidencyServerRegion,"\" is not supported. Please choose one of the following supported regions: \"US, EU\". The default region \"").concat(defaultRegion,"\" will be used instead.");};var RESERVED_KEYWORD_WARNING=function RESERVED_KEYWORD_WARNING(context,property,parentKeyPath,reservedElements){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The \"").concat(property,"\" property defined under \"").concat(parentKeyPath,"\" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (").concat(reservedElements,").");};var INVALID_CONTEXT_OBJECT_WARNING=function INVALID_CONTEXT_OBJECT_WARNING(logContext){return "".concat(logContext).concat(LOG_CONTEXT_SEPARATOR,"Please make sure that the \"context\" property in the event API's \"options\" argument is a valid object literal with key-value pairs.");};var UNSUPPORTED_BEACON_API_WARNING=function UNSUPPORTED_BEACON_API_WARNING(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The Beacon API is not supported by your browser. The events will be sent using XHR instead.");};var TIMEOUT_NOT_NUMBER_WARNING=function TIMEOUT_NOT_NUMBER_WARNING(context,timeout,defaultValue){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The session timeout value \"").concat(timeout,"\" is not a number. The default timeout of ").concat(defaultValue," ms will be used instead.");};var TIMEOUT_ZERO_WARNING=function TIMEOUT_ZERO_WARNING(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The session timeout value is 0, which disables the automatic session tracking feature. If you want to enable session tracking, please provide a positive integer value for the timeout.");};var TIMEOUT_NOT_RECOMMENDED_WARNING=function TIMEOUT_NOT_RECOMMENDED_WARNING(context,timeout,minTimeout){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The session timeout value ").concat(timeout," ms is less than the recommended minimum of ").concat(minTimeout," ms. Please consider increasing the timeout value to ensure optimal performance and reliability.");};var INVALID_SESSION_ID_WARNING=function INVALID_SESSION_ID_WARNING(context,sessionId,minSessionIdLength){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The provided session ID (").concat(sessionId,") is either invalid, not a positive integer, or not at least \"").concat(minSessionIdLength,"\" digits long. A new session ID will be auto-generated instead.");};var STORAGE_QUOTA_EXCEEDED_WARNING=function STORAGE_QUOTA_EXCEEDED_WARNING(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The storage is either full or unavailable, so the data will not be persisted. Switching to in-memory storage.");};var STORAGE_UNAVAILABLE_WARNING=function STORAGE_UNAVAILABLE_WARNING(context,entry,selectedStorageType,finalStorageType){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The storage type \"").concat(selectedStorageType,"\" is not available for entry \"").concat(entry,"\". The SDK will initialize the entry with \"").concat(finalStorageType,"\" storage type instead.");};var WRITE_KEY_NOT_A_STRING_ERROR=function WRITE_KEY_NOT_A_STRING_ERROR(context,writeKey){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The write key \"").concat(writeKey,"\" is not a string. Please check that the write key is correct and try again.");};var EMPTY_GROUP_CALL_ERROR=function EMPTY_GROUP_CALL_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The group() method must be called with at least one argument.");};var READY_CALLBACK_INVOKE_ERROR="Failed to invoke the ready callback";var API_CALLBACK_INVOKE_ERROR="API Callback Invocation Failed";var INVALID_CONFIG_URL_WARNING=function INVALID_CONFIG_URL_WARNING(context,configUrl){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The provided config URL \"").concat(configUrl,"\" is invalid. Using the default value instead.");};var POLYFILL_SCRIPT_LOAD_ERROR=function POLYFILL_SCRIPT_LOAD_ERROR(scriptId,url){return "Failed to load the polyfill script with ID \"".concat(scriptId,"\" from URL ").concat(url,".");};var COOKIE_DATA_ENCODING_ERROR="Failed to encode the cookie data.";var UNSUPPORTED_PRE_CONSENT_STORAGE_STRATEGY=function UNSUPPORTED_PRE_CONSENT_STORAGE_STRATEGY(context,selectedStrategy,defaultStrategy){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The pre-consent storage strategy \"").concat(selectedStrategy,"\" is not supported. Please choose one of the following supported strategies: \"none, session, anonymousId\". The default strategy \"").concat(defaultStrategy,"\" will be used instead.");};var UNSUPPORTED_PRE_CONSENT_EVENTS_DELIVERY_TYPE=function UNSUPPORTED_PRE_CONSENT_EVENTS_DELIVERY_TYPE(context,selectedDeliveryType,defaultDeliveryType){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The pre-consent events delivery type \"").concat(selectedDeliveryType,"\" is not supported. Please choose one of the following supported types: \"immediate, buffer\". The default type \"").concat(defaultDeliveryType,"\" will be used instead.");};// DEBUG

    var CDN_INT_DIR='js-integrations';var CDN_PLUGINS_DIR='plugins';

    var BUILD_TYPE='legacy';var SDK_CDN_BASE_URL='https://cdn.rudderlabs.com';var CDN_ARCH_VERSION_DIR='v3';var DEST_SDK_BASE_URL="".concat(SDK_CDN_BASE_URL,"/beta/3.0.0-beta/").concat(BUILD_TYPE,"/").concat(CDN_INT_DIR);var PLUGINS_BASE_URL="".concat(SDK_CDN_BASE_URL,"/beta/3.0.0-beta/").concat(BUILD_TYPE,"/").concat(CDN_PLUGINS_DIR);// TODO: change the above to production URLs when beta phase is done
// const DEST_SDK_BASE_URL = `${SDK_CDN_BASE_URL}/latest/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${CDN_INT_DIR}`;
// const PLUGINS_BASE_URL = `${SDK_CDN_BASE_URL}/latest/${CDN_ARCH_VERSION_DIR}/${BUILD_TYPE}/${CDN_PLUGINS_DIR}`;
    var DEFAULT_CONFIG_BE_URL='https://api.rudderstack.com';

    var _StorageEncryptionVer;var DEFAULT_ERROR_REPORTING_PROVIDER='bugsnag';var DEFAULT_STORAGE_ENCRYPTION_VERSION='v3';var ConsentManagersToPluginNameMap={oneTrust:'OneTrustConsentManager',ketch:'KetchConsentManager',custom:'CustomConsentManager'};var ErrorReportingProvidersToPluginNameMap=_defineProperty({},DEFAULT_ERROR_REPORTING_PROVIDER,'Bugsnag');var StorageEncryptionVersionsToPluginNameMap=(_StorageEncryptionVer={},_defineProperty(_StorageEncryptionVer,DEFAULT_STORAGE_ENCRYPTION_VERSION,'StorageEncryption'),_defineProperty(_StorageEncryptionVer,"legacy",'StorageEncryptionLegacy'),_StorageEncryptionVer);

    var defaultLoadOptions={logLevel:'ERROR',configUrl:DEFAULT_CONFIG_BE_URL,loadIntegration:true,sessions:{autoTrack:true,timeout:DEFAULT_SESSION_TIMEOUT_MS},sameSiteCookie:'Lax',polyfillIfRequired:true,integrations:{All:true},useBeacon:false,beaconQueueOptions:{},destinationsQueueOptions:{},queueOptions:{},lockIntegrationsVersion:false,uaChTrackLevel:'none',plugins:[],useGlobalIntegrationsConfigInEvents:false,bufferDataPlaneEventsUntilReady:false,dataPlaneEventsBufferTimeout:DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS,storage:{encryption:{version:DEFAULT_STORAGE_ENCRYPTION_VERSION},migrate:false},sendAdblockPageOptions:{}};var loadOptionsState=a(clone$1(defaultLoadOptions));

    var USER_SESSION_STORAGE_KEYS={userId:'rl_user_id',userTraits:'rl_trait',anonymousId:'rl_anonymous_id',groupId:'rl_group_id',groupTraits:'rl_group_trait',initialReferrer:'rl_page_init_referrer',initialReferringDomain:'rl_page_init_referring_domain',sessionInfo:'rl_session',authToken:'rl_auth_token'};var DEFAULT_USER_SESSION_VALUES={userId:'',userTraits:{},anonymousId:'',groupId:'',groupTraits:{},initialReferrer:'',initialReferringDomain:'',sessionInfo:{},authToken:null};

    var defaultSessionInfo={autoTrack:true,timeout:DEFAULT_SESSION_TIMEOUT_MS};var sessionState={userId:a(DEFAULT_USER_SESSION_VALUES.userId),userTraits:a(DEFAULT_USER_SESSION_VALUES.userTraits),anonymousId:a(DEFAULT_USER_SESSION_VALUES.anonymousId),groupId:a(DEFAULT_USER_SESSION_VALUES.groupId),groupTraits:a(DEFAULT_USER_SESSION_VALUES.groupTraits),initialReferrer:a(DEFAULT_USER_SESSION_VALUES.initialReferrer),initialReferringDomain:a(DEFAULT_USER_SESSION_VALUES.initialReferringDomain),sessionInfo:a(DEFAULT_USER_SESSION_VALUES.sessionInfo),authToken:a(DEFAULT_USER_SESSION_VALUES.authToken)};

    var capabilitiesState={isOnline:a(true),storage:{isLocalStorageAvailable:a(false),isCookieStorageAvailable:a(false),isSessionStorageAvailable:a(false)},isBeaconAvailable:a(false),isLegacyDOM:a(false),isUaCHAvailable:a(false),isCryptoAvailable:a(false),isIE11:a(false),isAdBlocked:a(false)};

    var reportingState={isErrorReportingEnabled:a(false),isMetricsReportingEnabled:a(false),errorReportingProviderPluginName:a(undefined)};

    var sourceConfigState=a(undefined);

    var lifecycleState={activeDataplaneUrl:a(undefined),integrationsCDNPath:a(DEST_SDK_BASE_URL),pluginsCDNPath:a(PLUGINS_BASE_URL),sourceConfigUrl:a(undefined),status:a(undefined),initialized:a(false),logLevel:a('ERROR'),loaded:a(false),readyCallbacks:a([]),writeKey:a(undefined),dataPlaneUrl:a(undefined)};

    var consentsState={enabled:a(false),initialized:a(false),data:a({}),activeConsentManagerPluginName:a(undefined),preConsent:a({enabled:false}),postConsent:a({}),resolutionStrategy:a('and'),provider:a(undefined),metadata:a(undefined)};

    var metricsState={retries:a(0),dropped:a(0),sent:a(0),queued:a(0),triggered:a(0)};

    var contextState={app:a({name:APP_NAME,namespace:APP_NAMESPACE,version:APP_VERSION}),traits:a(null),library:a({name:APP_NAME,version:APP_VERSION}),userAgent:a(''),device:a(null),network:a(null),os:a({name:'',version:''}),locale:a(null),screen:a({density:0,width:0,height:0,innerWidth:0,innerHeight:0}),'ua-ch':a(undefined),timezone:a(undefined)};

    var nativeDestinationsState={configuredDestinations:a([]),activeDestinations:a([]),loadOnlyIntegrations:a({}),failedDestinations:a([]),loadIntegration:a(true),initializedDestinations:a([]),clientDestinationsReady:a(false),integrationsConfig:a({})};

    var eventBufferState={toBeProcessedArray:a([]),readyCallbacksArray:a([])};

    var pluginsState={ready:a(false),loadedPlugins:a([]),failedPlugins:a([]),pluginsToLoadFromConfig:a([]),activePlugins:a([]),totalPluginsToLoad:a(0)};

    var storageState={encryptionPluginName:a(undefined),migrate:a(false),type:a(undefined),cookie:a(undefined),entries:a({}),trulyAnonymousTracking:a(false)};

    var defaultStateValues={capabilities:capabilitiesState,consents:consentsState,context:contextState,eventBuffer:eventBufferState,lifecycle:lifecycleState,loadOptions:loadOptionsState,metrics:metricsState,nativeDestinations:nativeDestinationsState,plugins:pluginsState,reporting:reportingState,session:sessionState,source:sourceConfigState,storage:storageState};var state=_objectSpread2({},clone$1(defaultStateValues));

//  to next or return the value if it is the last one instead of an array per
//  plugin that is the normal invoke
// TODO: add invoke method for extension point that we know only one plugin can be used. add invokeMultiple and invokeSingle methods
    var PluginEngine=/*#__PURE__*/function(){function PluginEngine(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var logger=arguments.length>1?arguments[1]:undefined;_classCallCheck(this,PluginEngine);_defineProperty(this,"plugins",[]);_defineProperty(this,"byName",{});_defineProperty(this,"cache",{});_defineProperty(this,"config",{throws:true});this.config=_objectSpread2({throws:true},options);this.logger=logger;}_createClass(PluginEngine,[{key:"register",value:function register(plugin,state){if(!plugin.name){var errorMessage=PLUGIN_NAME_MISSING_ERROR(PLUGIN_ENGINE);if(this.config.throws){throw new Error(errorMessage);}else {var _this$logger;(_this$logger=this.logger)===null||_this$logger===void 0||_this$logger.error(errorMessage,plugin);}}if(this.byName[plugin.name]){var _errorMessage=PLUGIN_ALREADY_EXISTS_ERROR(PLUGIN_ENGINE,plugin.name);if(this.config.throws){throw new Error(_errorMessage);}else {var _this$logger2;(_this$logger2=this.logger)===null||_this$logger2===void 0||_this$logger2.error(_errorMessage);}}this.cache={};this.plugins=this.plugins.slice();var pos=this.plugins.length;this.plugins.forEach(function(pluginItem,index){var _pluginItem$deps;if((_pluginItem$deps=pluginItem.deps)!==null&&_pluginItem$deps!==void 0&&_pluginItem$deps.includes(plugin.name)){pos=Math.min(pos,index);}});this.plugins.splice(pos,0,plugin);this.byName[plugin.name]=plugin;if(isFunction(plugin.initialize)){plugin.initialize(state);}}},{key:"unregister",value:function unregister(name){var plugin=this.byName[name];if(!plugin){var errorMessage=PLUGIN_NOT_FOUND_ERROR(PLUGIN_ENGINE,name);if(this.config.throws){throw new Error(errorMessage);}else {var _this$logger3;(_this$logger3=this.logger)===null||_this$logger3===void 0||_this$logger3.error(errorMessage);}}var index=this.plugins.indexOf(plugin);if(index===-1){var _errorMessage2=PLUGIN_ENGINE_BUG_ERROR(PLUGIN_ENGINE,name);if(this.config.throws){throw new Error(_errorMessage2);}else {var _this$logger4;(_this$logger4=this.logger)===null||_this$logger4===void 0||_this$logger4.error(_errorMessage2);}}this.cache={};delete this.byName[name];this.plugins=this.plugins.slice();this.plugins.splice(index,1);}},{key:"getPlugin",value:function getPlugin(name){return this.byName[name];}},{key:"getPlugins",value:function getPlugins(extPoint){var _this=this;var lifeCycleName=extPoint!==null&&extPoint!==void 0?extPoint:'.';if(!this.cache[lifeCycleName]){this.cache[lifeCycleName]=this.plugins.filter(function(plugin){var _plugin$deps;if((_plugin$deps=plugin.deps)!==null&&_plugin$deps!==void 0&&_plugin$deps.some(function(dependency){return !_this.byName[dependency];})){var _this$logger5;// If deps not exist, then not load it.
            var notExistDeps=plugin.deps.filter(function(dependency){return !_this.byName[dependency];});(_this$logger5=_this.logger)===null||_this$logger5===void 0||_this$logger5.error(PLUGIN_DEPS_ERROR(PLUGIN_ENGINE,plugin.name,notExistDeps));return false;}return lifeCycleName==='.'?true:hasValueByPath(plugin,lifeCycleName);});}return this.cache[lifeCycleName];}// This method allows to process this.plugins so that it could
// do some unified pre-process before application starts.
    },{key:"processRawPlugins",value:function processRawPlugins(callback){callback(this.plugins);this.cache={};}},{key:"invoke",value:function invoke(extPoint){var _this$config$throws,_this2=this;var allowMultiple=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;for(var _len=arguments.length,args=new Array(_len>2?_len-2:0),_key=2;_key<_len;_key++){args[_key-2]=arguments[_key];}var extensionPointName=extPoint;if(!extensionPointName){throw new Error(PLUGIN_EXT_POINT_MISSING_ERROR);}var noCall=extensionPointName.startsWith('!');var throws=(_this$config$throws=this.config.throws)!==null&&_this$config$throws!==void 0?_this$config$throws:extensionPointName.endsWith('!');// eslint-disable-next-line unicorn/better-regex
            extensionPointName=extensionPointName.replace(/(^!|!$)/g,'');if(!extensionPointName){throw new Error(PLUGIN_EXT_POINT_INVALID_ERROR);}var extensionPointNameParts=extensionPointName.split('.');extensionPointNameParts.pop();var pluginMethodPath=extensionPointNameParts.join('.');var pluginsToInvoke=allowMultiple?this.getPlugins(extensionPointName):[this.getPlugins(extensionPointName)[0]];return pluginsToInvoke.map(function(plugin){var method=getValueByPath(plugin,extensionPointName);if(!isFunction(method)||noCall){return method;}try{return method.apply(getValueByPath(plugin,pluginMethodPath),args);}catch(err){// When a plugin failed, doesn't break the app
                if(throws){throw err;}else {var _this2$logger;(_this2$logger=_this2.logger)===null||_this2$logger===void 0||_this2$logger.error(PLUGIN_INVOCATION_ERROR(PLUGIN_ENGINE,extensionPointName,plugin.name),err);}}return null;});}},{key:"invokeSingle",value:function invokeSingle(extPoint){for(var _len2=arguments.length,args=new Array(_len2>1?_len2-1:0),_key2=1;_key2<_len2;_key2++){args[_key2-1]=arguments[_key2];}return this.invoke.apply(this,[extPoint,false].concat(args))[0];}},{key:"invokeMultiple",value:function invokeMultiple(extPoint){for(var _len3=arguments.length,args=new Array(_len3>1?_len3-1:0),_key3=1;_key3<_len3;_key3++){args[_key3-1]=arguments[_key3];}return this.invoke.apply(this,[extPoint,true].concat(args));}}]);return PluginEngine;}();var defaultPluginEngine=new PluginEngine({throws:true},defaultLogger);

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
        function ErrorHandler(logger,pluginEngine){_classCallCheck(this,ErrorHandler);this.logger=logger;this.pluginEngine=pluginEngine;}_createClass(ErrorHandler,[{key:"init",value:function init(externalSrcLoader){var _this=this;if(!this.pluginEngine){return;}try{var extPoint='errorReporting.init';var errReportingInitVal=this.pluginEngine.invokeSingle(extPoint,state,this.pluginEngine,externalSrcLoader,this.logger);if(errReportingInitVal instanceof Promise){errReportingInitVal.then(function(client){_this.errReportingClient=client;}).catch(function(err){var _this$logger;(_this$logger=_this.logger)===null||_this$logger===void 0||_this$logger.error(REPORTING_PLUGIN_INIT_FAILURE_ERROR(ERROR_HANDLER),err);});}}catch(err){this.onError(err,ERROR_HANDLER);}}},{key:"onError",value:function onError(error){var context=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';var customMessage=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'';var shouldAlwaysThrow=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;// Error handling is already implemented in processError method
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
                (_this$logger2=this.logger)===null||_this$logger2===void 0||_this$logger2.error(NOTIFY_FAILURE_ERROR(ERROR_HANDLER),err);}}}}]);return ErrorHandler;}();var defaultErrorHandler=new ErrorHandler(defaultLogger,defaultPluginEngine);

    /**
     * A function to filter and return non cloud mode destinations
     * @param destination
     *
     * @returns boolean
     */var isNonCloudDestination=function isNonCloudDestination(destination){return Boolean(destination.config.connectionMode!=='cloud'||destination.config.useNativeSDKToSend===true||// this is the older flag for hybrid mode destinations
        destination.config.useNativeSDK===true);};var isHybridModeDestination=function isHybridModeDestination(destination){return Boolean(destination.config.connectionMode==='hybrid'||destination.config.useNativeSDKToSend===true);};/**
     * A function to filter and return non cloud mode destinations
     * @param destinations
     *
     * @returns destinations
     */var getNonCloudDestinations=function getNonCloudDestinations(destinations){return destinations.filter(isNonCloudDestination);};

    /**
     * List of plugin names that are loaded as dynamic imports in modern builds
     */var pluginNamesList=['BeaconQueue','Bugsnag','CustomConsentManager','DeviceModeDestinations','DeviceModeTransformation','ErrorReporting','ExternalAnonymousId','GoogleLinker','KetchConsentManager','NativeDestinationQueue','OneTrustConsentManager','StorageEncryption','StorageEncryptionLegacy','StorageMigrator','XhrQueue'];

    var COOKIE_STORAGE='cookieStorage';var LOCAL_STORAGE='localStorage';var SESSION_STORAGE='sessionStorage';var MEMORY_STORAGE='memoryStorage';var NO_STORAGE='none';

    var removeDuplicateSlashes=function removeDuplicateSlashes(str){return str.replace(/\/{2,}/g,'/');};

    function random(len){return crypto.getRandomValues(new Uint8Array(len));}

    var SIZE=4096,HEX$1=[],IDX$1=0,BUFFER$1;for(;IDX$1<256;IDX$1++){HEX$1[IDX$1]=(IDX$1+256).toString(16).substring(1);}function v4$1(){if(!BUFFER$1||IDX$1+16>SIZE){BUFFER$1=random(SIZE);IDX$1=0;}var i=0,tmp,out='';for(;i<16;i++){tmp=BUFFER$1[IDX$1+i];if(i==6)out+=HEX$1[tmp&15|64];else if(i==8)out+=HEX$1[tmp&63|128];else out+=HEX$1[tmp];if(i&1&&i>1&&i<11)out+='-';}IDX$1+=16;return out;}

    var IDX=256,HEX=[],BUFFER;while(IDX--)HEX[IDX]=(IDX+256).toString(16).substring(1);function v4(){var i=0,num,out='';if(!BUFFER||IDX+16>256){BUFFER=Array(i=256);while(i--)BUFFER[i]=256*Math.random()|0;i=IDX=0;}for(;i<16;i++){num=BUFFER[IDX+i];if(i==6)out+=HEX[num&15|64];else if(i==8)out+=HEX[num&63|128];else out+=HEX[num];if(i&1&&i>1&&i<11)out+='-';}IDX++;return out;}

    var hasCrypto$1=function hasCrypto(){return !isNullOrUndefined(globalThis.crypto)&&isFunction(globalThis.crypto.getRandomValues);};

    var generateUUID=function generateUUID(){if(hasCrypto$1()){return v4$1();}return v4();};

    var isErrRetryable=function isErrRetryable(details){var isRetryableNWFailure=false;if(details!==null&&details!==void 0&&details.error&&details!==null&&details!==void 0&&details.xhr){var xhrStatus=details.xhr.status;// same as in v1.1
        isRetryableNWFailure=xhrStatus===429||xhrStatus>=500&&xhrStatus<600;}return isRetryableNWFailure;};

    /**
     * To get the current timestamp in ISO string format
     * @returns ISO formatted timestamp string
     */var getCurrentTimeFormatted=function getCurrentTimeFormatted(){var curDateTime=new Date().toISOString();return curDateTime;};

    var EVENT_PAYLOAD_SIZE_BYTES_LIMIT=32*1024;// 32 KB

    var EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING=function EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING(context,payloadSize,sizeLimit){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The size of the event payload (").concat(payloadSize," bytes) exceeds the maximum limit of ").concat(sizeLimit," bytes. Events with large payloads may be dropped in the future. Please review your instrumentation to ensure that event payloads are within the size limit.");};var EVENT_PAYLOAD_SIZE_VALIDATION_WARNING=function EVENT_PAYLOAD_SIZE_VALIDATION_WARNING(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to validate event payload size. Please make sure that the event payload is within the size limit and is a valid JSON object.");};var QUEUE_UTILITIES='QueueUtilities';/**
     * Utility to get the stringified event payload
     * @param event RudderEvent object
     * @param logger Logger instance
     * @returns stringified event payload. Empty string if error occurs.
     */var getDeliveryPayload=function getDeliveryPayload(event,logger){return stringifyWithoutCircular(event,true,undefined,logger);};var getDMTDeliveryPayload=function getDMTDeliveryPayload(dmtRequestPayload,logger){return stringifyWithoutCircular(dmtRequestPayload,true,undefined,logger);};/**
     * Utility to validate final payload size before sending to server
     * @param event RudderEvent object
     * @param logger Logger instance
     */var validateEventPayloadSize=function validateEventPayloadSize(event,logger){var payloadStr=getDeliveryPayload(event,logger);if(payloadStr){var payloadSize=payloadStr.length;if(payloadSize>EVENT_PAYLOAD_SIZE_BYTES_LIMIT){logger===null||logger===void 0||logger.warn(EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING(QUEUE_UTILITIES,payloadSize,EVENT_PAYLOAD_SIZE_BYTES_LIMIT));}}else {logger===null||logger===void 0||logger.warn(EVENT_PAYLOAD_SIZE_VALIDATION_WARNING(QUEUE_UTILITIES));}};/**
     * Mutates the event and return final event for delivery
     * Updates certain parameters like sentAt timestamp, integrations config etc.
     * @param event RudderEvent object
     * @returns Final event ready to be delivered
     */var getFinalEventForDeliveryMutator=function getFinalEventForDeliveryMutator(event){var finalEvent=clone$1(event);// Update sentAt timestamp to the latest timestamp
        finalEvent.sentAt=getCurrentTimeFormatted();return finalEvent;};

    var ENCRYPTION_PREFIX_V3='RS_ENC_v3_';

    var encrypt$1=function encrypt(value){return "".concat(ENCRYPTION_PREFIX_V3).concat(toBase64(value));};var decrypt$1=function decrypt(value){if(value.startsWith(ENCRYPTION_PREFIX_V3)){return fromBase64(value.substring(ENCRYPTION_PREFIX_V3.length));}return value;};

    var BEACON_PLUGIN_EVENTS_QUEUE_DEBUG=function BEACON_PLUGIN_EVENTS_QUEUE_DEBUG(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Sending events to data plane.");};var BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR=function BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to convert events batch object to string.");};var BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR=function BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to convert events batch object to Blob.");};var BEACON_QUEUE_SEND_ERROR=function BEACON_QUEUE_SEND_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to send events batch data to the browser's beacon queue. The events will be dropped.");};var BEACON_QUEUE_DELIVERY_ERROR=function BEACON_QUEUE_DELIVERY_ERROR(url){return "Failed to send events batch data to the browser's beacon queue for URL ".concat(url,".");};

    var DEFAULT_BEACON_QUEUE_MAX_SIZE=10;var DEFAULT_BEACON_QUEUE_FLUSH_INTERVAL_MS=10*60*1000;// 10 minutes
// Limit of the Beacon transfer mechanism on the browsers
    var MAX_BATCH_PAYLOAD_SIZE_BYTES=64*1024;// 64 KB
    var DEFAULT_BEACON_QUEUE_OPTIONS={maxItems:DEFAULT_BEACON_QUEUE_MAX_SIZE,flushQueueInterval:DEFAULT_BEACON_QUEUE_FLUSH_INTERVAL_MS};var DATA_PLANE_API_VERSION$1='v1';var QUEUE_NAME$3='rudder_beacon';var BEACON_QUEUE_PLUGIN='BeaconQueuePlugin';

    /**
     * Utility to get the stringified event payload as Blob
     * @param events RudderEvent object array
     * @param logger Logger instance
     * @returns stringified events payload as Blob, undefined if error occurs.
     */var getBatchDeliveryPayload$1=function getBatchDeliveryPayload(events,logger){var data={batch:events};try{var blobPayload=stringifyWithoutCircular(data,true);var blobOptions={type:'text/plain'};if(blobPayload){return new Blob([blobPayload],blobOptions);}logger===null||logger===void 0||logger.error(BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR(BEACON_QUEUE_PLUGIN));}catch(err){logger===null||logger===void 0||logger.error(BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR(BEACON_QUEUE_PLUGIN),err);}return undefined;};var getNormalizedBeaconQueueOptions=function getNormalizedBeaconQueueOptions(queueOpts){return mergeDeepRight(DEFAULT_BEACON_QUEUE_OPTIONS,queueOpts);};var getDeliveryUrl$1=function getDeliveryUrl(dataplaneUrl,writeKey){var dpUrl=new URL(dataplaneUrl);return new URL(removeDuplicateSlashes([dpUrl.pathname,'/','beacon','/',DATA_PLANE_API_VERSION$1,'/',"batch?writeKey=".concat(writeKey)].join('')),dpUrl).href;};

    var QueueStatuses={IN_PROGRESS:'inProgress',QUEUE:'queue',RECLAIM_START:'reclaimStart',RECLAIM_END:'reclaimEnd',ACK:'ack',BATCH_QUEUE:'batchQueue'};

    var ScheduleModes=/*#__PURE__*/function(ScheduleModes){ScheduleModes[ScheduleModes["ASAP"]=1]="ASAP";ScheduleModes[ScheduleModes["RESCHEDULE"]=2]="RESCHEDULE";ScheduleModes[ScheduleModes["ABANDON"]=3]="ABANDON";return ScheduleModes;}({});var DEFAULT_CLOCK_LATE_FACTOR=2;var DEFAULT_CLOCK={setTimeout:function setTimeout(fn,ms){return globalThis.setTimeout(fn,ms);},clearTimeout:function clearTimeout(id){return globalThis.clearTimeout(id);},Date:globalThis.Date,clockLateFactor:DEFAULT_CLOCK_LATE_FACTOR};var Schedule=/*#__PURE__*/function(){function Schedule(){_classCallCheck(this,Schedule);this.tasks={};this.nextId=1;this.clock=DEFAULT_CLOCK;}_createClass(Schedule,[{key:"now",value:function now(){return +new this.clock.Date();}},{key:"run",value:function run(task,timeout,mode){var id=(this.nextId+1).toString();this.tasks[id]=this.clock.setTimeout(this.handle(id,task,timeout,mode||ScheduleModes.ASAP),timeout);return id;}},{key:"handle",value:function handle(id,callback,timeout,mode){var _this=this;var start=this.now();return function(){delete _this.tasks[id];var elapsedTimeoutTime=start+timeout*(_this.clock.clockLateFactor||DEFAULT_CLOCK_LATE_FACTOR);var currentTime=_this.now();var notCompletedOrTimedOut=mode>=ScheduleModes.RESCHEDULE&&elapsedTimeoutTime<currentTime;if(notCompletedOrTimedOut){if(mode===ScheduleModes.RESCHEDULE){_this.run(callback,timeout,mode);}return undefined;}return callback();};}},{key:"cancel",value:function cancel(id){if(this.tasks[id]){this.clock.clearTimeout(this.tasks[id]);delete this.tasks[id];}}},{key:"cancelAll",value:function cancelAll(){Object.values(this.tasks).forEach(this.clock.clearTimeout);this.tasks={};}}]);return Schedule;}();

    var RETRY_QUEUE_PROCESS_ERROR=function RETRY_QUEUE_PROCESS_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Process function threw an error.");};var RETRY_QUEUE_ENTRY_REMOVE_ERROR=function RETRY_QUEUE_ENTRY_REMOVE_ERROR(context,entry,attempt){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to remove local storage entry \"").concat(entry,"\" (attempt: ").concat(attempt,".");};

    var DEFAULT_MIN_RETRY_DELAY_MS=1000;var DEFAULT_MAX_RETRY_DELAY_MS=30000;var DEFAULT_BACKOFF_FACTOR=2;var DEFAULT_BACKOFF_JITTER=0;var DEFAULT_MAX_RETRY_ATTEMPTS=Infinity;var DEFAULT_MAX_ITEMS=Infinity;var DEFAULT_ACK_TIMER_MS=1000;var DEFAULT_RECLAIM_TIMER_MS=3000;var DEFAULT_RECLAIM_TIMEOUT_MS=10000;var DEFAULT_RECLAIM_WAIT_MS=500;var DEFAULT_MAX_BATCH_SIZE_BYTES=512*1024;// 512 KB; this is also the max size of a batch
    var DEFAULT_MAX_BATCH_ITEMS=100;var DEFAULT_BATCH_FLUSH_INTERVAL_MS=60*1000;// 1 minutes

    var sortByTime=function sortByTime(a,b){return a.time-b.time;};var RETRY_QUEUE='RetryQueue';/**
     * Constructs a RetryQueue backed by localStorage
     *
     * @constructor
     * @param {String} name The name of the queue. Will be used to find abandoned queues and retry their items
     * @param {Object} [opts] Optional argument to override `maxItems`, `maxAttempts`, `minRetryDelay, `maxRetryDelay`, `backoffFactor` and `backoffJitter`.
     * @param {QueueProcessCallback} fn The function to call in order to process an item added to the queue
     */var RetryQueue=/*#__PURE__*/function(){function RetryQueue(name,options,queueProcessCb,storeManager){var storageType=arguments.length>4&&arguments[4]!==undefined?arguments[4]:LOCAL_STORAGE;var logger=arguments.length>5?arguments[5]:undefined;var queueBatchItemsSizeCalculatorCb=arguments.length>6?arguments[6]:undefined;_classCallCheck(this,RetryQueue);this.storeManager=storeManager;this.logger=logger;this.name=name;this.id=generateUUID();this.processQueueCb=queueProcessCb;this.batchSizeCalcCb=queueBatchItemsSizeCalculatorCb;this.maxItems=options.maxItems||DEFAULT_MAX_ITEMS;this.maxAttempts=options.maxAttempts||DEFAULT_MAX_RETRY_ATTEMPTS;this.batch={enabled:false};this.configureBatchMode(options);this.backoff={minRetryDelay:options.minRetryDelay||DEFAULT_MIN_RETRY_DELAY_MS,maxRetryDelay:options.maxRetryDelay||DEFAULT_MAX_RETRY_DELAY_MS,factor:options.backoffFactor||DEFAULT_BACKOFF_FACTOR,jitter:options.backoffJitter||DEFAULT_BACKOFF_JITTER};// painstakingly tuned. that's why they're not "easily" configurable
        this.timeouts={ackTimer:DEFAULT_ACK_TIMER_MS,reclaimTimer:DEFAULT_RECLAIM_TIMER_MS,reclaimTimeout:DEFAULT_RECLAIM_TIMEOUT_MS,reclaimWait:DEFAULT_RECLAIM_WAIT_MS};this.schedule=new Schedule();this.processId='0';// Set up our empty queues
        this.store=this.storeManager.setStore({id:this.id,name:this.name,validKeys:QueueStatuses,type:storageType});this.setDefaultQueueEntries();// bind recurring tasks for ease of use
        this.ack=this.ack.bind(this);this.checkReclaim=this.checkReclaim.bind(this);this.processHead=this.processHead.bind(this);this.flushBatch=this.flushBatch.bind(this);// Attach visibility change listener to flush the queue
        this.attachListeners();this.scheduleTimeoutActive=false;}_createClass(RetryQueue,[{key:"setDefaultQueueEntries",value:function setDefaultQueueEntries(){this.setStorageEntry(QueueStatuses.IN_PROGRESS,{});this.setStorageEntry(QueueStatuses.QUEUE,[]);this.setStorageEntry(QueueStatuses.BATCH_QUEUE,[]);}},{key:"configureBatchMode",value:function configureBatchMode(options){this.batchingInProgress=false;if(!isObjectLiteralAndNotNull(options.batch)){return;}var batchOptions=options.batch;this.batch.enabled=batchOptions.enabled===true;if(this.batch.enabled){var _batchOptions$maxSize,_batchOptions$maxItem,_batchOptions$flushIn;// Set upper cap on the batch payload size
            this.batch.maxSize=Math.min((_batchOptions$maxSize=batchOptions.maxSize)!==null&&_batchOptions$maxSize!==void 0?_batchOptions$maxSize:DEFAULT_MAX_BATCH_SIZE_BYTES,DEFAULT_MAX_BATCH_SIZE_BYTES);this.batch.maxItems=(_batchOptions$maxItem=batchOptions.maxItems)!==null&&_batchOptions$maxItem!==void 0?_batchOptions$maxItem:DEFAULT_MAX_BATCH_ITEMS;this.batch.flushInterval=(_batchOptions$flushIn=batchOptions.flushInterval)!==null&&_batchOptions$flushIn!==void 0?_batchOptions$flushIn:DEFAULT_BATCH_FLUSH_INTERVAL_MS;}}},{key:"attachListeners",value:function attachListeners(){var _this=this;if(this.batch.enabled){globalThis.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden'){_this.flushBatch();}});}}},{key:"getStorageEntry",value:function getStorageEntry(name){return this.store.get(name!==null&&name!==void 0?name:this.name);}// TODO: fix the type of different queues to be the same if possible
    },{key:"setStorageEntry",value:function setStorageEntry(name,value){this.store.set(name!==null&&name!==void 0?name:this.name,value!==null&&value!==void 0?value:[]);}/**
         * Stops processing the queue
         */},{key:"stop",value:function stop(){this.schedule.cancelAll();this.scheduleTimeoutActive=false;}/**
         * Starts processing the queue
         */},{key:"start",value:function start(){if(this.scheduleTimeoutActive){this.stop();}this.scheduleTimeoutActive=true;this.scheduleFlushBatch();this.ack();this.checkReclaim();this.processHead();}/**
         * Configures the timeout handler for flushing the batch queue
         */},{key:"scheduleFlushBatch",value:function scheduleFlushBatch(){var _this$batch;if(this.batch.enabled&&(_this$batch=this.batch)!==null&&_this$batch!==void 0&&_this$batch.flushInterval){if(this.flushBatchTaskId){this.schedule.cancel(this.flushBatchTaskId);}this.flushBatchTaskId=this.schedule.run(this.flushBatch,this.batch.flushInterval,ScheduleModes.ASAP);}}/**
         * Flushes the batch queue
         */},{key:"flushBatch",value:function flushBatch(){if(!this.batchingInProgress){var _ref;this.batchingInProgress=true;var batchQueue=(_ref=this.getStorageEntry(QueueStatuses.BATCH_QUEUE))!==null&&_ref!==void 0?_ref:[];if(batchQueue.length>0){batchQueue=batchQueue.slice(-batchQueue.length);var batchEntry=this.genQueueItem(batchQueue.map(function(queueItem){return queueItem.item;}));this.setStorageEntry(QueueStatuses.BATCH_QUEUE,[]);this.pushToMainQueue(batchEntry);}this.batchingInProgress=false;// Re-schedule the flush task
            this.scheduleFlushBatch();}}/**
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
         */},{key:"getDelay",value:function getDelay(attemptNumber){var ms=this.backoff.minRetryDelay*Math.pow(this.backoff.factor,attemptNumber);if(this.backoff.jitter){var rand=Math.random();var deviation=Math.floor(rand*this.backoff.jitter*ms);if(Math.floor(rand*10)<5){ms-=deviation;}else {ms+=deviation;}}return Number(Math.min(ms,this.backoff.maxRetryDelay).toPrecision(1));}},{key:"enqueue",value:function enqueue(entry){var curEntry;if(this.batch.enabled){curEntry=this.handleNewItemForBatch(entry);}else {curEntry=entry;}// when batching is enabled, `curEntry` could be `undefined` if the batch criteria is not met
            if(curEntry){this.pushToMainQueue(curEntry);}}/**
         * Handles a new item added to the retry queue when batching is enabled
         * @param entry New item added to the retry queue
         * @returns Undefined or batch entry object
         */},{key:"handleNewItemForBatch",value:function handleNewItemForBatch(entry){var _ref2;var curEntry;var batchQueue=(_ref2=this.getStorageEntry(QueueStatuses.BATCH_QUEUE))!==null&&_ref2!==void 0?_ref2:[];if(!this.batchingInProgress){this.batchingInProgress=true;batchQueue=batchQueue.slice(-batchQueue.length);batchQueue.push(entry);var batchDispatchInfo=this.getBatchDispInfo(batchQueue);// if batch criteria is met, queue the batch events to the main queue and clear batch queue
            if(batchDispatchInfo.criteriaMet||batchDispatchInfo.criteriaExceeded){var batchItems;if(batchDispatchInfo.criteriaExceeded){batchItems=batchQueue.slice(0,batchQueue.length-1).map(function(queueItem){return queueItem.item;});batchQueue=[entry];}else {batchItems=batchQueue.map(function(queueItem){return queueItem.item;});batchQueue=[];}// Don't make any batch request if there are no items
                if(batchItems.length>0){curEntry=this.genQueueItem(batchItems);}// re-attach the timeout handler
                this.scheduleFlushBatch();}this.batchingInProgress=false;}else {batchQueue.push(entry);}// update the batch queue
            this.setStorageEntry(QueueStatuses.BATCH_QUEUE,batchQueue);return curEntry;}},{key:"pushToMainQueue",value:function pushToMainQueue(curEntry){var _ref3;var queue=(_ref3=this.getStorageEntry(QueueStatuses.QUEUE))!==null&&_ref3!==void 0?_ref3:[];queue=queue.slice(-(this.maxItems-1));queue.push(curEntry);queue=queue.sort(sortByTime);this.setStorageEntry(QueueStatuses.QUEUE,queue);if(this.scheduleTimeoutActive){this.processHead();}}/**
         * Adds an item to the queue
         *
         * @param {Object} itemData The item to process
         */},{key:"addItem",value:function addItem(itemData){this.enqueue(this.genQueueItem(itemData));}/**
         * Generates a queue item
         * @param itemData Queue item data
         * @returns Queue item
         */},{key:"genQueueItem",value:function genQueueItem(itemData){return {item:itemData,attemptNumber:0,time:this.schedule.now(),id:generateUUID()};}/**
         * Adds an item to the retry queue
         *
         * @param {Object} itemData The item to retry
         * @param {Number} attemptNumber The attempt number (1 for first retry)
         * @param {Error} [error] The error from previous attempt, if there was one
         * @param {String} [id] The id of the queued message used for tracking duplicate entries
         */},{key:"requeue",value:function requeue(itemData,attemptNumber,error,id){if(this.shouldRetry(itemData,attemptNumber)){this.enqueue({item:itemData,attemptNumber:attemptNumber,time:this.schedule.now()+this.getDelay(attemptNumber),id:id!==null&&id!==void 0?id:generateUUID()});}}/**
         * Returns the information about whether the batch criteria is met or exceeded
         * @param batchItems Prospective batch items
         * @returns Batch dispatch info
         */},{key:"getBatchDispInfo",value:function getBatchDispInfo(batchItems){var _this$batch2,_this$batch3;var lengthCriteriaMet=false;var lengthCriteriaExceeded=false;var configuredBatchMaxItems=(_this$batch2=this.batch)===null||_this$batch2===void 0?void 0:_this$batch2.maxItems;if(isDefined(configuredBatchMaxItems)){lengthCriteriaMet=batchItems.length===configuredBatchMaxItems;lengthCriteriaExceeded=batchItems.length>configuredBatchMaxItems;}if(lengthCriteriaMet||lengthCriteriaExceeded){return {criteriaMet:lengthCriteriaMet,criteriaExceeded:lengthCriteriaExceeded};}var sizeCriteriaMet=false;var sizeCriteriaExceeded=false;var configuredBatchMaxSize=(_this$batch3=this.batch)===null||_this$batch3===void 0?void 0:_this$batch3.maxSize;if(isDefined(configuredBatchMaxSize)&&isDefined(this.batchSizeCalcCb)){var curBatchSize=this.batchSizeCalcCb(batchItems.map(function(queueItem){return queueItem.item;}));sizeCriteriaMet=curBatchSize===configuredBatchMaxSize;sizeCriteriaExceeded=curBatchSize>configuredBatchMaxSize;}return {criteriaMet:sizeCriteriaMet,criteriaExceeded:sizeCriteriaExceeded};}},{key:"processHead",value:function processHead(){var _ref4,_ref5,_this2=this,_ref7;// cancel the scheduled task if it exists
            this.schedule.cancel(this.processId);// Pop the head off the queue
            var queue=(_ref4=this.getStorageEntry(QueueStatuses.QUEUE))!==null&&_ref4!==void 0?_ref4:[];var inProgress=(_ref5=this.getStorageEntry(QueueStatuses.IN_PROGRESS))!==null&&_ref5!==void 0?_ref5:{};var now=this.schedule.now();var toRun=[];// eslint-disable-next-line @typescript-eslint/no-unused-vars
            var processItemCallback=function processItemCallback(el,id){return function(err,res){var _ref6;var inProgress=(_ref6=_this2.getStorageEntry(QueueStatuses.IN_PROGRESS))!==null&&_ref6!==void 0?_ref6:{};delete inProgress[id];_this2.setStorageEntry(QueueStatuses.IN_PROGRESS,inProgress);if(err){_this2.requeue(el.item,el.attemptNumber+1,err,el.id);}};};var enqueueItem=function enqueueItem(el,id){toRun.push({item:el.item,done:processItemCallback(el,id),attemptNumber:el.attemptNumber});};var inProgressSize=Object.keys(inProgress).length;// eslint-disable-next-line no-plusplus
            while(queue.length>0&&queue[0].time<=now&&inProgressSize++<this.maxItems){var el=queue.shift();if(el){var id=generateUUID();// Save this to the in progress map
                inProgress[id]={item:el.item,attemptNumber:el.attemptNumber,time:this.schedule.now()};enqueueItem(el,id);}}this.setStorageEntry(QueueStatuses.QUEUE,queue);this.setStorageEntry(QueueStatuses.IN_PROGRESS,inProgress);toRun.forEach(function(el){// TODO: handle processQueueCb timeout
                try{var willBeRetried=_this2.shouldRetry(el.item,el.attemptNumber+1);_this2.processQueueCb(el.item,el.done,el.attemptNumber,_this2.maxAttempts,willBeRetried);}catch(err){var _this2$logger;(_this2$logger=_this2.logger)===null||_this2$logger===void 0||_this2$logger.error(RETRY_QUEUE_PROCESS_ERROR(RETRY_QUEUE),err);}});// re-read the queue in case the process function finished immediately or added another item
            queue=(_ref7=this.getStorageEntry(QueueStatuses.QUEUE))!==null&&_ref7!==void 0?_ref7:[];this.schedule.cancel(this.processId);if(queue.length>0){var nextProcessExecutionTime=queue[0].time-now;this.processId=this.schedule.run(this.processHead,nextProcessExecutionTime,ScheduleModes.ASAP);}}// Ack continuously to prevent other tabs from claiming our queue
    },{key:"ack",value:function ack(){this.setStorageEntry(QueueStatuses.ACK,this.schedule.now());this.setStorageEntry(QueueStatuses.RECLAIM_START,null);this.setStorageEntry(QueueStatuses.RECLAIM_END,null);this.schedule.run(this.ack,this.timeouts.ackTimer,ScheduleModes.ASAP);}},{key:"reclaim",value:function reclaim(id){var _this$getStorageEntry,_other$get,_other$get2,_other$get3,_this3=this;var other=this.storeManager.setStore({id:id,name:this.name,validKeys:QueueStatuses,type:LOCAL_STORAGE});var our={queue:(_this$getStorageEntry=this.getStorageEntry(QueueStatuses.QUEUE))!==null&&_this$getStorageEntry!==void 0?_this$getStorageEntry:[]};var their={inProgress:(_other$get=other.get(QueueStatuses.IN_PROGRESS))!==null&&_other$get!==void 0?_other$get:{},batchQueue:(_other$get2=other.get(QueueStatuses.BATCH_QUEUE))!==null&&_other$get2!==void 0?_other$get2:[],queue:(_other$get3=other.get(QueueStatuses.QUEUE))!==null&&_other$get3!==void 0?_other$get3:[]};var trackMessageIds=[];var addConcatQueue=function addConcatQueue(queue,incrementAttemptNumberBy){var concatIterator=function concatIterator(el){var _el$id;var id=(_el$id=el.id)!==null&&_el$id!==void 0?_el$id:generateUUID();if(trackMessageIds.includes(id));else {our.queue.push({item:el.item,attemptNumber:el.attemptNumber+incrementAttemptNumberBy,time:_this3.schedule.now(),id:id});trackMessageIds.push(id);}};if(Array.isArray(queue)){queue.forEach(concatIterator);}else if(queue){Object.values(queue).forEach(concatIterator);}};// add their queue to ours, resetting run-time to immediate and copying the attempt#
            addConcatQueue(their.queue,0);// Process batch queue items
            if(this.batch.enabled){their.batchQueue.forEach(function(el){var _el$id2;var id=(_el$id2=el.id)!==null&&_el$id2!==void 0?_el$id2:generateUUID();if(trackMessageIds.includes(id));else {_this3.enqueue(el);trackMessageIds.push(id);}});}else {// if batching is not enabled in the current instance, add those items to the main queue directly
                addConcatQueue(their.batchQueue,0);}// if the queue is abandoned, all the in-progress are failed. retry them immediately and increment the attempt#
            addConcatQueue(their.inProgress,1);our.queue=our.queue.sort(sortByTime);this.setStorageEntry(QueueStatuses.QUEUE,our.queue);// remove all keys one by on next tick to avoid NS_ERROR_STORAGE_BUSY error
            this.clearQueueEntries(other,1);// process the new items we claimed
            this.processHead();}// eslint-disable-next-line class-methods-use-this
    },{key:"clearQueueEntries",value:function clearQueueEntries(other,localStorageBackoff){this.removeStorageEntry(other,0,localStorageBackoff);}},{key:"removeStorageEntry",value:function removeStorageEntry(store,entryIdx,backoff){var _this4=this;var attempt=arguments.length>3&&arguments[3]!==undefined?arguments[3]:1;var maxAttempts=2;globalThis.setTimeout(function(){var queueEntryKeys=Object.keys(QueueStatuses);var entry=QueueStatuses[queueEntryKeys[entryIdx]];try{store.remove(entry);// clear the next entry
            if(entryIdx+1<queueEntryKeys.length){_this4.removeStorageEntry(store,entryIdx+1,backoff);}}catch(err){var storageBusyErr='NS_ERROR_STORAGE_BUSY';var isLocalStorageBusy=err.name===storageBusyErr||err.code===storageBusyErr||err.code===0x80630001;if(isLocalStorageBusy&&attempt<maxAttempts){// Try clearing the same entry again with some extra delay
            _this4.removeStorageEntry(store,entryIdx,backoff+40,attempt+1);}else {var _this4$logger;(_this4$logger=_this4.logger)===null||_this4$logger===void 0||_this4$logger.error(RETRY_QUEUE_ENTRY_REMOVE_ERROR(RETRY_QUEUE,entry,attempt),err);}// clear the next entry
            if(attempt===maxAttempts&&entryIdx+1<queueEntryKeys.length){_this4.removeStorageEntry(store,entryIdx+1,backoff);}}},backoff);}},{key:"checkReclaim",value:function checkReclaim(){var _this5=this;var createReclaimStartTask=function createReclaimStartTask(store){return function(){if(store.get(QueueStatuses.RECLAIM_END)!==_this5.id){return;}if(store.get(QueueStatuses.RECLAIM_START)!==_this5.id){return;}_this5.reclaim(store.id);};};var createReclaimEndTask=function createReclaimEndTask(store){return function(){if(store.get(QueueStatuses.RECLAIM_START)!==_this5.id){return;}store.set(QueueStatuses.RECLAIM_END,_this5.id);_this5.schedule.run(createReclaimStartTask(store),_this5.timeouts.reclaimWait,ScheduleModes.ABANDON);};};var tryReclaim=function tryReclaim(store){store.set(QueueStatuses.RECLAIM_START,_this5.id);store.set(QueueStatuses.ACK,_this5.schedule.now());_this5.schedule.run(createReclaimEndTask(store),_this5.timeouts.reclaimWait,ScheduleModes.ABANDON);};var findOtherQueues=function findOtherQueues(name){var res=[];var storage=_this5.store.getOriginalEngine();for(var i=0;i<storage.length;i++){var k=storage.key(i);var parts=k?k.split('.'):[];if(parts.length!==3){// eslint-disable-next-line no-continue
            continue;}if(parts[0]!==name){// eslint-disable-next-line no-continue
            continue;}if(parts[2]!==QueueStatuses.ACK){// eslint-disable-next-line no-continue
            continue;}res.push(_this5.storeManager.setStore({id:parts[1],name:name,validKeys:QueueStatuses,type:LOCAL_STORAGE}));}return res;};findOtherQueues(this.name).forEach(function(store){if(store.id===_this5.id){return;}if(_this5.schedule.now()-store.get(QueueStatuses.ACK)<_this5.timeouts.reclaimTimeout){return;}tryReclaim(store);});this.schedule.run(this.checkReclaim,this.timeouts.reclaimTimer,ScheduleModes.RESCHEDULE);}},{key:"clear",value:function clear(){this.schedule.cancelAll();this.setDefaultQueueEntries();}}]);return RetryQueue;}();

    var pluginName$e='BeaconQueue';var BeaconQueue=function BeaconQueue(){return {name:pluginName$e,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$e]);},dataplaneEventsQueue:{/**
             * Initialize the queue for delivery
             * @param state Application state
             * @param httpClient http client instance
             * @param storeManager Store Manager instance
             * @param errorHandler Error handler instance
             * @param logger Logger instance
             * @returns BeaconItemsQueue instance
             */init:function init(state,httpClient,storeManager,errorHandler,logger){var _state$loadOptions$va;var writeKey=state.lifecycle.writeKey.value;var dataplaneUrl=state.lifecycle.activeDataplaneUrl.value;var url=getDeliveryUrl$1(dataplaneUrl,writeKey);var finalQOpts=getNormalizedBeaconQueueOptions((_state$loadOptions$va=state.loadOptions.value.beaconQueueOptions)!==null&&_state$loadOptions$va!==void 0?_state$loadOptions$va:{});var queueProcessCallback=function queueProcessCallback(itemData,done){logger===null||logger===void 0||logger.debug(BEACON_PLUGIN_EVENTS_QUEUE_DEBUG(BEACON_QUEUE_PLUGIN));var finalEvents=itemData.map(function(queueItemData){return getFinalEventForDeliveryMutator(queueItemData.event);});var data=getBatchDeliveryPayload$1(finalEvents,logger);if(data){try{var isEnqueuedInBeacon=navigator.sendBeacon(url,data);if(!isEnqueuedInBeacon){logger===null||logger===void 0||logger.error(BEACON_QUEUE_SEND_ERROR(BEACON_QUEUE_PLUGIN));}done(null,isEnqueuedInBeacon);}catch(err){errorHandler===null||errorHandler===void 0||errorHandler.onError(err,BEACON_QUEUE_PLUGIN,BEACON_QUEUE_DELIVERY_ERROR(url));// Remove the item from queue
                done(null);}}else {// Mark the item as done so that it can be removed from the queue
                done(null);}};var eventsQueue=new RetryQueue("".concat(QUEUE_NAME$3,"_").concat(writeKey),{batch:{enabled:true,flushInterval:finalQOpts.flushQueueInterval,maxSize:MAX_BATCH_PAYLOAD_SIZE_BYTES,// set the hard limit
                    maxItems:finalQOpts.maxItems}},queueProcessCallback,storeManager,LOCAL_STORAGE,logger,function(itemData){var events=itemData.map(function(queueItemData){return queueItemData.event;});// type casting to Blob as we know that the event has already been validated prior to enqueue
                return getBatchDeliveryPayload$1(events,logger).size;});return eventsQueue;},/**
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

    var BUGSNAG_API_KEY_VALIDATION_ERROR=function BUGSNAG_API_KEY_VALIDATION_ERROR(apiKey){return "The Bugsnag API key (".concat(apiKey,") is invalid or not provided.");};var BUGSNAG_SDK_LOAD_TIMEOUT_ERROR=function BUGSNAG_SDK_LOAD_TIMEOUT_ERROR(timeout){return "A timeout ".concat(timeout," ms occurred while trying to load the Bugsnag SDK.");};var BUGSNAG_SDK_LOAD_ERROR=function BUGSNAG_SDK_LOAD_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to load the Bugsnag SDK.");};

    var BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME='bugsnag';// For version 6 and below
    var BUGSNAG_LIB_V7_INSTANCE_GLOBAL_KEY_NAME='Bugsnag';var GLOBAL_LIBRARY_OBJECT_NAMES=[BUGSNAG_LIB_V7_INSTANCE_GLOBAL_KEY_NAME,BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME];var BUGSNAG_CDN_URL='https://d2wy8f7a9ursnm.cloudfront.net/v6/bugsnag.min.js';var ERROR_REPORT_PROVIDER_NAME_BUGSNAG='rs-bugsnag';// This API key token is parsed in the CI pipeline
    var API_KEY='0d96a60df267f4a13f808bbaa54e535c';var BUGSNAG_VALID_MAJOR_VERSION='6';var SDK_LOAD_POLL_INTERVAL_MS=100;// ms
    var MAX_WAIT_FOR_SDK_LOAD_MS=100*SDK_LOAD_POLL_INTERVAL_MS;// ms
// Errors from the below scripts are NOT allowed to reach Bugsnag
    var SDK_FILE_NAME_PREFIXES=function SDK_FILE_NAME_PREFIXES(){return ['rsa'// Prefix for all the SDK scripts including plugins and module federated chunks
    ];};var DEV_HOSTS=['www.test-host.com','localhost','127.0.0.1','[::1]'];// List of keys to exclude from the metadata
// Potential PII or sensitive data
    var APP_STATE_EXCLUDE_KEYS=['userId','userTraits','groupId','groupTraits','anonymousId','config','instance',// destination instance objects
        'eventBuffer',// pre-load event buffer (may contain PII)
        'traits'];var BUGSNAG_PLUGIN='BugsnagPlugin';

    var isValidVersion=function isValidVersion(globalLibInstance){var _globalLibInstance$_c;// For version 7
// eslint-disable-next-line no-underscore-dangle
        var version=globalLibInstance===null||globalLibInstance===void 0||(_globalLibInstance$_c=globalLibInstance._client)===null||_globalLibInstance$_c===void 0||(_globalLibInstance$_c=_globalLibInstance$_c._notifier)===null||_globalLibInstance$_c===void 0?void 0:_globalLibInstance$_c.version;// For versions older than 7
        if(!version){var _tempInstance$notifie;var tempInstance=globalLibInstance({apiKey:API_KEY,releaseStage:'version-test',// eslint-disable-next-line func-names, object-shorthand
            beforeSend:function beforeSend(){return false;}});version=(_tempInstance$notifie=tempInstance.notifier)===null||_tempInstance$notifie===void 0?void 0:_tempInstance$notifie.version;}return version&&version.charAt(0)===BUGSNAG_VALID_MAJOR_VERSION;};var isRudderSDKError=function isRudderSDKError(event){var _event$stacktrace;var errorOrigin=(_event$stacktrace=event.stacktrace)===null||_event$stacktrace===void 0||(_event$stacktrace=_event$stacktrace[0])===null||_event$stacktrace===void 0?void 0:_event$stacktrace.file;if(!errorOrigin||typeof errorOrigin!=='string'){return false;}// Prefix folder for all the destination SDK scripts
        var isDestinationIntegrationBundle=errorOrigin.includes(CDN_INT_DIR);var srcFileName=errorOrigin.substring(errorOrigin.lastIndexOf('/')+1);return isDestinationIntegrationBundle||SDK_FILE_NAME_PREFIXES().some(function(prefix){return srcFileName.startsWith(prefix)&&srcFileName.endsWith('.js');});};var enhanceErrorEventMutator=function enhanceErrorEventMutator(event,metadataSource){event.updateMetaData('source',{metadataSource:metadataSource});var errorMessage=event.errorMessage;// eslint-disable-next-line no-param-reassign
        event.context=errorMessage;// Hack for easily grouping the script load errors
// on the dashboard
        if(errorMessage.includes('error in script loading')){// eslint-disable-next-line no-param-reassign
            event.context='Script load failures';}// eslint-disable-next-line no-param-reassign
        event.severity='error';};var onError=function onError(state){var _state$source$value;var metadataSource=(_state$source$value=state.source.value)===null||_state$source$value===void 0?void 0:_state$source$value.id;return function(event){try{// Discard the event if it's not originated at the SDK
        if(!isRudderSDKError(event)){return false;}enhanceErrorEventMutator(event,metadataSource);return true;}catch(_unused){// Drop the error event if it couldn't be filtered as
// it is most likely a non-SDK error
        return false;}};};var getReleaseStage=function getReleaseStage(){var host=globalThis.location.hostname;return host&&DEV_HOSTS.includes(host)?'development':'development';};var getGlobalBugsnagLibInstance=function getGlobalBugsnagLibInstance(){return globalThis[BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME];};var getNewClient=function getNewClient(state,logger){var globalBugsnagLibInstance=getGlobalBugsnagLibInstance();var clientConfig={apiKey:API_KEY,appVersion:'3.0.0-beta.14',// Set SDK version as the app version from build config
        metaData:{SDK:{name:'JS',installType:'npm'}},beforeSend:onError(state),autoCaptureSessions:false,// auto capture sessions is disabled
        collectUserIp:false,// collecting user's IP is disabled
// enabledBreadcrumbTypes: ['error', 'log', 'user'], // for v7 and above
        maxEvents:100,maxBreadcrumbs:40,releaseStage:getReleaseStage(),user:{id:state.lifecycle.writeKey.value},logger:logger,networkBreadcrumbsEnabled:false};var client=globalBugsnagLibInstance(clientConfig);return client;};var isApiKeyValid=function isApiKeyValid(apiKey){var isAPIKeyValid=!(apiKey.startsWith('{{')||apiKey.endsWith('}}')||apiKey.length===0);return isAPIKeyValid;};var loadBugsnagSDK=function loadBugsnagSDK(externalSrcLoader,logger){var isNotLoaded=GLOBAL_LIBRARY_OBJECT_NAMES.every(function(globalKeyName){return !globalThis[globalKeyName];});if(!isNotLoaded){return;}externalSrcLoader.loadJSFile({url:BUGSNAG_CDN_URL,id:ERROR_REPORT_PROVIDER_NAME_BUGSNAG,callback:function callback(id){if(!id){logger===null||logger===void 0||logger.error(BUGSNAG_SDK_LOAD_ERROR(BUGSNAG_PLUGIN));}}});};var initBugsnagClient=function initBugsnagClient(state,promiseResolve,promiseReject,logger){var time=arguments.length>4&&arguments[4]!==undefined?arguments[4]:0;var globalBugsnagLibInstance=getGlobalBugsnagLibInstance();if(typeof globalBugsnagLibInstance==='function'){if(isValidVersion(globalBugsnagLibInstance)){var client=getNewClient(state,logger);promiseResolve(client);}}else if(time>=MAX_WAIT_FOR_SDK_LOAD_MS){promiseReject(new Error(BUGSNAG_SDK_LOAD_TIMEOUT_ERROR(MAX_WAIT_FOR_SDK_LOAD_MS)));}else {// Try to initialize the client after a delay
        globalThis.setTimeout(initBugsnagClient,SDK_LOAD_POLL_INTERVAL_MS,state,promiseResolve,promiseReject,logger,time+SDK_LOAD_POLL_INTERVAL_MS);}};var getAppStateForMetadata=function getAppStateForMetadata(state){var stateStr=stringifyWithoutCircular(state,false,APP_STATE_EXCLUDE_KEYS);return stateStr!==null?JSON.parse(stateStr):undefined;};

    var pluginName$d='Bugsnag';var Bugsnag=function Bugsnag(){return {name:pluginName$d,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$d]);},errorReportingProvider:{init:function init(state,externalSrcLoader,logger){return new Promise(function(resolve,reject){// If API key token is not parsed or invalid, don't proceed to initialize the client
                if(!isApiKeyValid(API_KEY)){reject(new Error(BUGSNAG_API_KEY_VALIDATION_ERROR(API_KEY)));return;}loadBugsnagSDK(externalSrcLoader,logger);initBugsnagClient(state,resolve,reject,logger);});},notify:function notify(client,error,state,logger){client===null||client===void 0||client.notify(error,{metaData:{state:getAppStateForMetadata(state)}});},breadcrumb:function breadcrumb(client,message,logger){client===null||client===void 0||client.leaveBreadcrumb(message);}}};};

    var CUSTOM_CONSENT_MANAGER_PLUGIN='CustomConsentManagerPlugin';

    var DESTINATION_CONSENT_STATUS_ERROR$2="Failed to determine the consent status for the destination. Please check the destination configuration and try again.";

    var pluginName$c='CustomConsentManager';var CustomConsentManager=function CustomConsentManager(){return {name:pluginName$c,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$c]);},consentManager:{init:function init(state,logger){// Nothing to initialize
            },updateConsentsInfo:function updateConsentsInfo(state,storeManager,logger){// Nothing to update. Already provided by the user
            },isDestinationConsented:function isDestinationConsented(state,destConfig,errorHandler,logger){if(!state.consents.initialized.value){return true;}var allowedConsentIds=state.consents.data.value.allowedConsentIds;try{var _cmpConfig$resolution;var consentManagement=destConfig.consentManagement;// If the destination does not have consent management config, events should be sent.
                if(!consentManagement){return true;}// Get the corresponding consents for the destination
                var cmpConfig=consentManagement.find(function(c){return c.provider===state.consents.provider.value;});// If there are no consents configured for the destination for the current provider, events should be sent.
                if(!(cmpConfig!==null&&cmpConfig!==void 0&&cmpConfig.consents)){return true;}var configuredConsents=cmpConfig.consents.map(function(c){return c.consent.trim();}).filter(function(n){return n;});var resolutionStrategy=(_cmpConfig$resolution=cmpConfig.resolutionStrategy)!==null&&_cmpConfig$resolution!==void 0?_cmpConfig$resolution:state.consents.resolutionStrategy.value;// match the configured consents with user provided consents as per
// the configured resolution strategy
                var matchPredicate=function matchPredicate(consent){return allowedConsentIds.includes(consent);};switch(resolutionStrategy){case'or':return configuredConsents.some(matchPredicate)||configuredConsents.length===0;case'and':default:return configuredConsents.every(matchPredicate);}}catch(err){errorHandler===null||errorHandler===void 0||errorHandler.onError(err,CUSTOM_CONSENT_MANAGER_PLUGIN,DESTINATION_CONSENT_STATUS_ERROR$2);return true;}}}};};

    var _CNameMapping$19;var DIR_NAME$19='AdobeAnalytics';var NAME$19='ADOBE_ANALYTICS';var DISPLAY_NAME$19='Adobe Analytics';_defineProperty({},DISPLAY_NAME$19,DIR_NAME$19);(_CNameMapping$19={'Adobe Analytics':NAME$19,ADOBEANALYTICS:NAME$19,'ADOBE ANALYTICS':NAME$19},_defineProperty(_CNameMapping$19,NAME$19,NAME$19),_defineProperty(_CNameMapping$19,"AdobeAnalytics",NAME$19),_defineProperty(_CNameMapping$19,"adobeanalytics",NAME$19),_defineProperty(_CNameMapping$19,'adobe analytics',NAME$19),_defineProperty(_CNameMapping$19,'Adobe analytics',NAME$19),_defineProperty(_CNameMapping$19,'adobe Analytics',NAME$19),_CNameMapping$19);

    var _CNameMapping$18;var DIR_NAME$18='Amplitude';var NAME$18='AM';var DISPLAY_NAME$18='Amplitude';_defineProperty({},DISPLAY_NAME$18,DIR_NAME$18);(_CNameMapping$18={},_defineProperty(_CNameMapping$18,NAME$18,NAME$18),_defineProperty(_CNameMapping$18,"AMPLITUDE",NAME$18),_defineProperty(_CNameMapping$18,"Amplitude",NAME$18),_defineProperty(_CNameMapping$18,"am",NAME$18),_CNameMapping$18);

    var _CNameMapping$17;var DIR_NAME$17='Appcues';var NAME$17='APPCUES';var DISPLAY_NAME$17='Appcues';_defineProperty({},DISPLAY_NAME$17,DIR_NAME$17);(_CNameMapping$17={},_defineProperty(_CNameMapping$17,NAME$17,NAME$17),_defineProperty(_CNameMapping$17,"Appcues",NAME$17),_defineProperty(_CNameMapping$17,'App Cues',NAME$17),_defineProperty(_CNameMapping$17,"appcues",NAME$17),_CNameMapping$17);

    var _CNameMapping$16;var DIR_NAME$16='BingAds';var NAME$16='BINGADS';var DISPLAY_NAME$16='Bing Ads';_defineProperty({},DISPLAY_NAME$16,DIR_NAME$16);(_CNameMapping$16={},_defineProperty(_CNameMapping$16,NAME$16,NAME$16),_defineProperty(_CNameMapping$16,"BingAds",NAME$16),_defineProperty(_CNameMapping$16,"bingads",NAME$16),_defineProperty(_CNameMapping$16,'Bing Ads',NAME$16),_defineProperty(_CNameMapping$16,'Bing ads',NAME$16),_defineProperty(_CNameMapping$16,'bing Ads',NAME$16),_defineProperty(_CNameMapping$16,'bing ads',NAME$16),_CNameMapping$16);

    var _CNameMapping$15;var DIR_NAME$15='Braze';var NAME$15='BRAZE';var DISPLAY_NAME$15='Braze';_defineProperty({},DISPLAY_NAME$15,DIR_NAME$15);(_CNameMapping$15={},_defineProperty(_CNameMapping$15,NAME$15,NAME$15),_defineProperty(_CNameMapping$15,"Braze",NAME$15),_defineProperty(_CNameMapping$15,"braze",NAME$15),_CNameMapping$15);

    var _CNameMapping$14;var DIR_NAME$14='Bugsnag';var NAME$14='BUGSNAG';var DISPLAY_NAME$14='Bugsnag';_defineProperty({},DISPLAY_NAME$14,DIR_NAME$14);(_CNameMapping$14={},_defineProperty(_CNameMapping$14,NAME$14,NAME$14),_defineProperty(_CNameMapping$14,"bugsnag",NAME$14),_defineProperty(_CNameMapping$14,"Bugsnag",NAME$14),_CNameMapping$14);

    var _CNameMapping$13;var DIR_NAME$13='Chartbeat';var NAME$13='CHARTBEAT';var DISPLAY_NAME$13='Chartbeat';_defineProperty({},DISPLAY_NAME$13,DIR_NAME$13);(_CNameMapping$13={},_defineProperty(_CNameMapping$13,NAME$13,NAME$13),_defineProperty(_CNameMapping$13,"Chartbeat",NAME$13),_defineProperty(_CNameMapping$13,"chartbeat",NAME$13),_defineProperty(_CNameMapping$13,'Chart Beat',NAME$13),_defineProperty(_CNameMapping$13,'chart beat',NAME$13),_CNameMapping$13);

    var _CNameMapping$12;var DIR_NAME$12='Clevertap';var NAME$12='CLEVERTAP';var DISPLAY_NAME$12='CleverTap';_defineProperty({},DISPLAY_NAME$12,DIR_NAME$12);(_CNameMapping$12={},_defineProperty(_CNameMapping$12,NAME$12,NAME$12),_defineProperty(_CNameMapping$12,"Clevertap",NAME$12),_defineProperty(_CNameMapping$12,"clevertap",NAME$12),_CNameMapping$12);

    var _CNameMapping$11;var DIR_NAME$11='Comscore';var NAME$11='COMSCORE';var DISPLAY_NAME$11='Comscore';_defineProperty({},DISPLAY_NAME$11,DIR_NAME$11);(_CNameMapping$11={},_defineProperty(_CNameMapping$11,NAME$11,NAME$11),_defineProperty(_CNameMapping$11,"Comscore",NAME$11),_defineProperty(_CNameMapping$11,'Com Score',NAME$11),_defineProperty(_CNameMapping$11,'com Score',NAME$11),_defineProperty(_CNameMapping$11,'com score',NAME$11),_defineProperty(_CNameMapping$11,'Com score',NAME$11),_CNameMapping$11);

    var _CNameMapping$10;var DIR_NAME$10='Criteo';var NAME$10='CRITEO';var DISPLAY_NAME$10='Criteo';_defineProperty({},DISPLAY_NAME$10,DIR_NAME$10);(_CNameMapping$10={},_defineProperty(_CNameMapping$10,NAME$10,NAME$10),_defineProperty(_CNameMapping$10,"Criteo",NAME$10),_defineProperty(_CNameMapping$10,"criteo",NAME$10),_CNameMapping$10);

    var _CNameMapping$$;var DIR_NAME$$='CustomerIO';var NAME$$='CUSTOMERIO';var DISPLAY_NAME$$='Customer IO';_defineProperty({},DISPLAY_NAME$$,DIR_NAME$$);(_CNameMapping$$={},_defineProperty(_CNameMapping$$,NAME$$,NAME$$),_defineProperty(_CNameMapping$$,"Customerio",NAME$$),_defineProperty(_CNameMapping$$,'Customer.io',NAME$$),_defineProperty(_CNameMapping$$,'CUSTOMER.IO',NAME$$),_defineProperty(_CNameMapping$$,'customer.io',NAME$$),_CNameMapping$$);

    var _CNameMapping$_;var DIR_NAME$_='Drip';var NAME$_='DRIP';var DISPLAY_NAME$_='Drip';_defineProperty({},DISPLAY_NAME$_,DIR_NAME$_);(_CNameMapping$_={},_defineProperty(_CNameMapping$_,NAME$_,NAME$_),_defineProperty(_CNameMapping$_,"Drip",NAME$_),_defineProperty(_CNameMapping$_,"drip",NAME$_),_CNameMapping$_);

    var _CNameMapping$Z;var DIR_NAME$Z='FacebookPixel';var NAME$Z='FACEBOOK_PIXEL';var DISPLAY_NAME$Z='Facebook Pixel';_defineProperty({},DISPLAY_NAME$Z,DIR_NAME$Z);(_CNameMapping$Z={},_defineProperty(_CNameMapping$Z,NAME$Z,NAME$Z),_defineProperty(_CNameMapping$Z,'FB Pixel',NAME$Z),_defineProperty(_CNameMapping$Z,'Facebook Pixel',NAME$Z),_defineProperty(_CNameMapping$Z,'facebook pixel',NAME$Z),_defineProperty(_CNameMapping$Z,"fbpixel",NAME$Z),_defineProperty(_CNameMapping$Z,"FBPIXEL",NAME$Z),_defineProperty(_CNameMapping$Z,"FB_PIXEL",NAME$Z),_CNameMapping$Z);

    var _CNameMapping$Y;var DIR_NAME$Y='Fullstory';var NAME$Y='FULLSTORY';var DISPLAY_NAME$Y='Fullstory';_defineProperty({},DISPLAY_NAME$Y,DIR_NAME$Y);(_CNameMapping$Y={},_defineProperty(_CNameMapping$Y,NAME$Y,NAME$Y),_defineProperty(_CNameMapping$Y,"Fullstory",NAME$Y),_defineProperty(_CNameMapping$Y,"FullStory",NAME$Y),_defineProperty(_CNameMapping$Y,'full Story',NAME$Y),_defineProperty(_CNameMapping$Y,'Full Story',NAME$Y),_defineProperty(_CNameMapping$Y,'Full story',NAME$Y),_defineProperty(_CNameMapping$Y,'full story',NAME$Y),_defineProperty(_CNameMapping$Y,"fullstory",NAME$Y),_CNameMapping$Y);

    var _CNameMapping$X;var DIR_NAME$X='GA';var NAME$X='GA';var DISPLAY_NAME$X='Google Analytics';_defineProperty({},DISPLAY_NAME$X,DIR_NAME$X);(_CNameMapping$X={},_defineProperty(_CNameMapping$X,NAME$X,NAME$X),_defineProperty(_CNameMapping$X,'Google Analytics',NAME$X),_defineProperty(_CNameMapping$X,"GoogleAnalytics",NAME$X),_defineProperty(_CNameMapping$X,'GOOGLE ANALYTICS',NAME$X),_defineProperty(_CNameMapping$X,'google analytics',NAME$X),_CNameMapping$X);

    var _CNameMapping$W;var DIR_NAME$W='GA4';var NAME$W='GA4';var DISPLAY_NAME$W='Google Analytics 4 (GA4)';_defineProperty({},DISPLAY_NAME$W,DIR_NAME$W);(_CNameMapping$W={},_defineProperty(_CNameMapping$W,NAME$W,NAME$W),_defineProperty(_CNameMapping$W,'Google Analytics 4',NAME$W),_defineProperty(_CNameMapping$W,'Google analytics 4',NAME$W),_defineProperty(_CNameMapping$W,'google analytics 4',NAME$W),_defineProperty(_CNameMapping$W,'Google Analytics4',NAME$W),_defineProperty(_CNameMapping$W,'Google analytics4',NAME$W),_defineProperty(_CNameMapping$W,'google analytics4',NAME$W),_defineProperty(_CNameMapping$W,'Google Analytics 4 (GA4)',NAME$W),_defineProperty(_CNameMapping$W,'google analytics 4 (ga4)',NAME$W),_defineProperty(_CNameMapping$W,"GoogleAnalytics4",NAME$W),_CNameMapping$W);

    var _CNameMapping$V;var DIR_NAME$V='GoogleAds';var NAME$V='GOOGLEADS';var DISPLAY_NAME$V='Google Ads';_defineProperty({},DISPLAY_NAME$V,DIR_NAME$V);(_CNameMapping$V={},_defineProperty(_CNameMapping$V,NAME$V,NAME$V),_defineProperty(_CNameMapping$V,'Google Ads',NAME$V),_defineProperty(_CNameMapping$V,"GoogleAds",NAME$V),_defineProperty(_CNameMapping$V,'GOOGLE ADS',NAME$V),_defineProperty(_CNameMapping$V,'google ads',NAME$V),_defineProperty(_CNameMapping$V,"googleads",NAME$V),_CNameMapping$V);

    var _CNameMapping$U;var DIR_NAME$U='GoogleOptimize';var NAME$U='GOOGLE_OPTIMIZE';var DISPLAY_NAME$U='Google Optimize';_defineProperty({},DISPLAY_NAME$U,DIR_NAME$U);(_CNameMapping$U={},_defineProperty(_CNameMapping$U,NAME$U,NAME$U),_defineProperty(_CNameMapping$U,'Google Optimize',NAME$U),_defineProperty(_CNameMapping$U,"GoogleOptimize",NAME$U),_defineProperty(_CNameMapping$U,"Googleoptimize",NAME$U),_defineProperty(_CNameMapping$U,"GOOGLEOPTIMIZE",NAME$U),_defineProperty(_CNameMapping$U,'google optimize',NAME$U),_defineProperty(_CNameMapping$U,'Google optimize',NAME$U),_defineProperty(_CNameMapping$U,'GOOGLE OPTIMIZE',NAME$U),_CNameMapping$U);

    var _CNameMapping$T;var DIR_NAME$T='GoogleTagManager';var NAME$T='GTM';var DISPLAY_NAME$T='Google Tag Manager';_defineProperty({},DISPLAY_NAME$T,DIR_NAME$T);(_CNameMapping$T={},_defineProperty(_CNameMapping$T,NAME$T,NAME$T),_defineProperty(_CNameMapping$T,'Google Tag Manager',NAME$T),_defineProperty(_CNameMapping$T,'google tag manager',NAME$T),_defineProperty(_CNameMapping$T,'googletag manager',NAME$T),_defineProperty(_CNameMapping$T,"googletagmanager",NAME$T),_CNameMapping$T);

    var _CNameMapping$S;var DIR_NAME$S='Heap';var NAME$S='HEAP';var DISPLAY_NAME$S='Heap.io';_defineProperty({},DISPLAY_NAME$S,DIR_NAME$S);(_CNameMapping$S={},_defineProperty(_CNameMapping$S,NAME$S,NAME$S),_defineProperty(_CNameMapping$S,"Heap",NAME$S),_defineProperty(_CNameMapping$S,"heap",NAME$S),_defineProperty(_CNameMapping$S,'Heap.io',NAME$S),_CNameMapping$S);

    var _CNameMapping$R;var DIR_NAME$R='Hotjar';var NAME$R='HOTJAR';var DISPLAY_NAME$R='Hotjar';_defineProperty({},DISPLAY_NAME$R,DIR_NAME$R);(_CNameMapping$R={},_defineProperty(_CNameMapping$R,NAME$R,NAME$R),_defineProperty(_CNameMapping$R,"Hotjar",NAME$R),_defineProperty(_CNameMapping$R,"hotjar",NAME$R),_defineProperty(_CNameMapping$R,'Hot Jar',NAME$R),_defineProperty(_CNameMapping$R,'hot jar',NAME$R),_CNameMapping$R);

    var _CNameMapping$Q;var DIR_NAME$Q='HubSpot';var NAME$Q='HS';var DISPLAY_NAME$Q='HubSpot';_defineProperty({},DISPLAY_NAME$Q,DIR_NAME$Q);(_CNameMapping$Q={},_defineProperty(_CNameMapping$Q,NAME$Q,NAME$Q),_defineProperty(_CNameMapping$Q,"Hubspot",NAME$Q),_defineProperty(_CNameMapping$Q,"HUBSPOT",NAME$Q),_defineProperty(_CNameMapping$Q,'hub spot',NAME$Q),_defineProperty(_CNameMapping$Q,'Hub Spot',NAME$Q),_defineProperty(_CNameMapping$Q,'Hub spot',NAME$Q),_CNameMapping$Q);

    var _CNameMapping$P;var DIR_NAME$P='INTERCOM';var NAME$P='INTERCOM';var DISPLAY_NAME$P='Intercom';_defineProperty({},DISPLAY_NAME$P,DIR_NAME$P);(_CNameMapping$P={},_defineProperty(_CNameMapping$P,NAME$P,NAME$P),_defineProperty(_CNameMapping$P,"Intercom",NAME$P),_defineProperty(_CNameMapping$P,"intercom",NAME$P),_CNameMapping$P);

    var _CNameMapping$O;var DIR_NAME$O='Keen';var NAME$O='KEEN';var DISPLAY_NAME$O='Keen';_defineProperty({},DISPLAY_NAME$O,DIR_NAME$O);(_CNameMapping$O={},_defineProperty(_CNameMapping$O,NAME$O,NAME$O),_defineProperty(_CNameMapping$O,"Keen",NAME$O),_defineProperty(_CNameMapping$O,'Keen.io',NAME$O),_defineProperty(_CNameMapping$O,"keen",NAME$O),_defineProperty(_CNameMapping$O,'keen.io',NAME$O),_CNameMapping$O);

    var _CNameMapping$N;var DIR_NAME$N='Kissmetrics';var NAME$N='KISSMETRICS';var DISPLAY_NAME$N='Kiss Metrics';_defineProperty({},DISPLAY_NAME$N,DIR_NAME$N);(_CNameMapping$N={},_defineProperty(_CNameMapping$N,NAME$N,NAME$N),_defineProperty(_CNameMapping$N,"Kissmetrics",NAME$N),_defineProperty(_CNameMapping$N,"kissmetrics",NAME$N),_CNameMapping$N);

    var _CNameMapping$M;var DIR_NAME$M='Klaviyo';var NAME$M='KLAVIYO';var DISPLAY_NAME$M='Klaviyo';_defineProperty({},DISPLAY_NAME$M,DIR_NAME$M);(_CNameMapping$M={},_defineProperty(_CNameMapping$M,NAME$M,NAME$M),_defineProperty(_CNameMapping$M,"Klaviyo",NAME$M),_defineProperty(_CNameMapping$M,"klaviyo",NAME$M),_CNameMapping$M);

    var _CNameMapping$L;var DIR_NAME$L='LaunchDarkly';var NAME$L='LAUNCHDARKLY';var DISPLAY_NAME$L='LaunchDarkly';_defineProperty({},DISPLAY_NAME$L,DIR_NAME$L);(_CNameMapping$L={},_defineProperty(_CNameMapping$L,NAME$L,NAME$L),_defineProperty(_CNameMapping$L,"LaunchDarkly",NAME$L),_defineProperty(_CNameMapping$L,"Launch_Darkly",NAME$L),_defineProperty(_CNameMapping$L,'Launch Darkly',NAME$L),_defineProperty(_CNameMapping$L,"launchDarkly",NAME$L),_defineProperty(_CNameMapping$L,'launch darkly',NAME$L),_CNameMapping$L);

    var _CNameMapping$K;var DIR_NAME$K='LinkedInInsightTag';var NAME$K='LINKEDIN_INSIGHT_TAG';var DISPLAY_NAME$K='Linkedin Insight Tag';_defineProperty({},DISPLAY_NAME$K,DIR_NAME$K);(_CNameMapping$K={},_defineProperty(_CNameMapping$K,NAME$K,NAME$K),_defineProperty(_CNameMapping$K,'LinkedIn Insight Tag',NAME$K),_defineProperty(_CNameMapping$K,'LinkedIn insight tag',NAME$K),_defineProperty(_CNameMapping$K,'linkedIn insight tag',NAME$K),_defineProperty(_CNameMapping$K,"Linkedin_insight_tag",NAME$K),_defineProperty(_CNameMapping$K,"LinkedinInsighttag",NAME$K),_defineProperty(_CNameMapping$K,"LinkedinInsightTag",NAME$K),_defineProperty(_CNameMapping$K,"LinkedInInsightTag",NAME$K),_defineProperty(_CNameMapping$K,"Linkedininsighttag",NAME$K),_defineProperty(_CNameMapping$K,"LINKEDININSIGHTTAG",NAME$K),_defineProperty(_CNameMapping$K,"linkedininsighttag",NAME$K),_CNameMapping$K);

    var _CNameMapping$J;var DIR_NAME$J='Lotame';var NAME$J='LOTAME';var DISPLAY_NAME$J='Lotame';_defineProperty({},DISPLAY_NAME$J,DIR_NAME$J);(_CNameMapping$J={},_defineProperty(_CNameMapping$J,NAME$J,NAME$J),_defineProperty(_CNameMapping$J,"Lotame",NAME$J),_defineProperty(_CNameMapping$J,"lotame",NAME$J),_CNameMapping$J);

    var _CNameMapping$I;var DIR_NAME$I='Lytics';var NAME$I='LYTICS';var DISPLAY_NAME$I='Lytics';_defineProperty({},DISPLAY_NAME$I,DIR_NAME$I);(_CNameMapping$I={},_defineProperty(_CNameMapping$I,NAME$I,NAME$I),_defineProperty(_CNameMapping$I,"Lytics",NAME$I),_defineProperty(_CNameMapping$I,"lytics",NAME$I),_CNameMapping$I);

    var _CNameMapping$H;var DIR_NAME$H='Mixpanel';var NAME$H='MP';var DISPLAY_NAME$H='Mixpanel';_defineProperty({},DISPLAY_NAME$H,DIR_NAME$H);(_CNameMapping$H={},_defineProperty(_CNameMapping$H,NAME$H,NAME$H),_defineProperty(_CNameMapping$H,"MIXPANEL",NAME$H),_defineProperty(_CNameMapping$H,"Mixpanel",NAME$H),_defineProperty(_CNameMapping$H,'MIX PANEL',NAME$H),_defineProperty(_CNameMapping$H,'Mix panel',NAME$H),_defineProperty(_CNameMapping$H,'Mix Panel',NAME$H),_CNameMapping$H);

    var _CNameMapping$G;var DIR_NAME$G='MoEngage';var NAME$G='MOENGAGE';var DISPLAY_NAME$G='MoEngage';_defineProperty({},DISPLAY_NAME$G,DIR_NAME$G);(_CNameMapping$G={},_defineProperty(_CNameMapping$G,NAME$G,NAME$G),_defineProperty(_CNameMapping$G,"MoEngage",NAME$G),_defineProperty(_CNameMapping$G,"moengage",NAME$G),_defineProperty(_CNameMapping$G,"Moengage",NAME$G),_defineProperty(_CNameMapping$G,'Mo Engage',NAME$G),_defineProperty(_CNameMapping$G,'mo engage',NAME$G),_defineProperty(_CNameMapping$G,'Mo engage',NAME$G),_CNameMapping$G);

    var _CNameMapping$F;var DIR_NAME$F='Optimizely';var NAME$F='OPTIMIZELY';var DISPLAY_NAME$F='Optimizely Web';_defineProperty({},DISPLAY_NAME$F,DIR_NAME$F);(_CNameMapping$F={},_defineProperty(_CNameMapping$F,NAME$F,NAME$F),_defineProperty(_CNameMapping$F,"Optimizely",NAME$F),_defineProperty(_CNameMapping$F,"optimizely",NAME$F),_CNameMapping$F);

    var _CNameMapping$E;var DIR_NAME$E='Pendo';var NAME$E='PENDO';var DISPLAY_NAME$E='Pendo';_defineProperty({},DISPLAY_NAME$E,DIR_NAME$E);(_CNameMapping$E={},_defineProperty(_CNameMapping$E,NAME$E,NAME$E),_defineProperty(_CNameMapping$E,"Pendo",NAME$E),_defineProperty(_CNameMapping$E,"pendo",NAME$E),_CNameMapping$E);

    var _CNameMapping$D;var DIR_NAME$D='PinterestTag';var NAME$D='PINTEREST_TAG';var DISPLAY_NAME$D='Pinterest Tag';_defineProperty({},DISPLAY_NAME$D,DIR_NAME$D);(_CNameMapping$D={},_defineProperty(_CNameMapping$D,NAME$D,NAME$D),_defineProperty(_CNameMapping$D,"PinterestTag",NAME$D),_defineProperty(_CNameMapping$D,"Pinterest_Tag",NAME$D),_defineProperty(_CNameMapping$D,"PINTERESTTAG",NAME$D),_defineProperty(_CNameMapping$D,"pinterest",NAME$D),_defineProperty(_CNameMapping$D,"PinterestAds",NAME$D),_defineProperty(_CNameMapping$D,"Pinterest_Ads",NAME$D),_defineProperty(_CNameMapping$D,"Pinterest",NAME$D),_defineProperty(_CNameMapping$D,'Pinterest Tag',NAME$D),_defineProperty(_CNameMapping$D,'Pinterest tag',NAME$D),_defineProperty(_CNameMapping$D,'PINTEREST TAG',NAME$D),_defineProperty(_CNameMapping$D,'pinterest tag',NAME$D),_defineProperty(_CNameMapping$D,'Pinterest Ads',NAME$D),_defineProperty(_CNameMapping$D,'Pinterest ads',NAME$D),_CNameMapping$D);

    var _CNameMapping$C;var DIR_NAME$C='PostAffiliatePro';var NAME$C='POST_AFFILIATE_PRO';var DISPLAY_NAME$C='Post Affiliate Pro';_defineProperty({},DISPLAY_NAME$C,DIR_NAME$C);(_CNameMapping$C={},_defineProperty(_CNameMapping$C,NAME$C,NAME$C),_defineProperty(_CNameMapping$C,"PostAffiliatePro",NAME$C),_defineProperty(_CNameMapping$C,"Post_affiliate_pro",NAME$C),_defineProperty(_CNameMapping$C,'Post Affiliate Pro',NAME$C),_defineProperty(_CNameMapping$C,'Post affiliate pro',NAME$C),_defineProperty(_CNameMapping$C,'post affiliate pro',NAME$C),_defineProperty(_CNameMapping$C,"postaffiliatepro",NAME$C),_defineProperty(_CNameMapping$C,"POSTAFFILIATEPRO",NAME$C),_CNameMapping$C);

    var _CNameMapping$B;var DIR_NAME$B='Posthog';var NAME$B='POSTHOG';var DISPLAY_NAME$B='PostHog';_defineProperty({},DISPLAY_NAME$B,DIR_NAME$B);(_CNameMapping$B={},_defineProperty(_CNameMapping$B,NAME$B,NAME$B),_defineProperty(_CNameMapping$B,"PostHog",NAME$B),_defineProperty(_CNameMapping$B,"Posthog",NAME$B),_defineProperty(_CNameMapping$B,"posthog",NAME$B),_defineProperty(_CNameMapping$B,'Post Hog',NAME$B),_defineProperty(_CNameMapping$B,'Post hog',NAME$B),_defineProperty(_CNameMapping$B,'post hog',NAME$B),_CNameMapping$B);

    var _CNameMapping$A;var DIR_NAME$A='ProfitWell';var NAME$A='PROFITWELL';var DISPLAY_NAME$A='ProfitWell';_defineProperty({},DISPLAY_NAME$A,DIR_NAME$A);(_CNameMapping$A={},_defineProperty(_CNameMapping$A,NAME$A,NAME$A),_defineProperty(_CNameMapping$A,"ProfitWell",NAME$A),_defineProperty(_CNameMapping$A,"profitwell",NAME$A),_defineProperty(_CNameMapping$A,"Profitwell",NAME$A),_defineProperty(_CNameMapping$A,'Profit Well',NAME$A),_defineProperty(_CNameMapping$A,'profit well',NAME$A),_defineProperty(_CNameMapping$A,'Profit well',NAME$A),_CNameMapping$A);

    var _CNameMapping$z;var DIR_NAME$z='Qualtrics';var NAME$z='QUALTRICS';var DISPLAY_NAME$z='Qualtrics';_defineProperty({},DISPLAY_NAME$z,DIR_NAME$z);(_CNameMapping$z={},_defineProperty(_CNameMapping$z,NAME$z,NAME$z),_defineProperty(_CNameMapping$z,"Qualtrics",NAME$z),_defineProperty(_CNameMapping$z,"qualtrics",NAME$z),_CNameMapping$z);

    var _CNameMapping$y;var DIR_NAME$y='QuantumMetric';var NAME$y='QUANTUMMETRIC';var DISPLAY_NAME$y='Quantum Metric';_defineProperty({},DISPLAY_NAME$y,DIR_NAME$y);(_CNameMapping$y={},_defineProperty(_CNameMapping$y,NAME$y,NAME$y),_defineProperty(_CNameMapping$y,'Quantum Metric',NAME$y),_defineProperty(_CNameMapping$y,'quantum Metric',NAME$y),_defineProperty(_CNameMapping$y,'quantum metric',NAME$y),_defineProperty(_CNameMapping$y,"QuantumMetric",NAME$y),_defineProperty(_CNameMapping$y,"quantumMetric",NAME$y),_defineProperty(_CNameMapping$y,"quantummetric",NAME$y),_defineProperty(_CNameMapping$y,"Quantum_Metric",NAME$y),_CNameMapping$y);

    var _CNameMapping$x;var DIR_NAME$x='RedditPixel';var NAME$x='REDDIT_PIXEL';var DISPLAY_NAME$x='Reddit Pixel';_defineProperty({},DISPLAY_NAME$x,DIR_NAME$x);(_CNameMapping$x={},_defineProperty(_CNameMapping$x,NAME$x,NAME$x),_defineProperty(_CNameMapping$x,"Reddit_Pixel",NAME$x),_defineProperty(_CNameMapping$x,"RedditPixel",NAME$x),_defineProperty(_CNameMapping$x,"REDDITPIXEL",NAME$x),_defineProperty(_CNameMapping$x,"redditpixel",NAME$x),_defineProperty(_CNameMapping$x,'Reddit Pixel',NAME$x),_defineProperty(_CNameMapping$x,'REDDIT PIXEL',NAME$x),_defineProperty(_CNameMapping$x,'reddit pixel',NAME$x),_CNameMapping$x);

    var _CNameMapping$w;var DIR_NAME$w='Sentry';var NAME$w='SENTRY';var DISPLAY_NAME$w='Sentry';_defineProperty({},DISPLAY_NAME$w,DIR_NAME$w);(_CNameMapping$w={},_defineProperty(_CNameMapping$w,NAME$w,NAME$w),_defineProperty(_CNameMapping$w,"sentry",NAME$w),_defineProperty(_CNameMapping$w,"Sentry",NAME$w),_CNameMapping$w);

    var _CNameMapping$v;var DIR_NAME$v='SnapPixel';var NAME$v='SNAP_PIXEL';var DISPLAY_NAME$v='Snap Pixel';_defineProperty({},DISPLAY_NAME$v,DIR_NAME$v);(_CNameMapping$v={},_defineProperty(_CNameMapping$v,NAME$v,NAME$v),_defineProperty(_CNameMapping$v,"Snap_Pixel",NAME$v),_defineProperty(_CNameMapping$v,"SnapPixel",NAME$v),_defineProperty(_CNameMapping$v,"SNAPPIXEL",NAME$v),_defineProperty(_CNameMapping$v,"snappixel",NAME$v),_defineProperty(_CNameMapping$v,'Snap Pixel',NAME$v),_defineProperty(_CNameMapping$v,'SNAP PIXEL',NAME$v),_defineProperty(_CNameMapping$v,'snap pixel',NAME$v),_CNameMapping$v);

    var _CNameMapping$u;var DIR_NAME$u='TVSquared';var NAME$u='TVSQUARED';var DISPLAY_NAME$u='TVSquared';_defineProperty({},DISPLAY_NAME$u,DIR_NAME$u);(_CNameMapping$u={},_defineProperty(_CNameMapping$u,NAME$u,NAME$u),_defineProperty(_CNameMapping$u,"TVSquared",NAME$u),_defineProperty(_CNameMapping$u,"tvsquared",NAME$u),_defineProperty(_CNameMapping$u,"tvSquared",NAME$u),_defineProperty(_CNameMapping$u,"TvSquared",NAME$u),_defineProperty(_CNameMapping$u,"Tvsquared",NAME$u),_defineProperty(_CNameMapping$u,'TV Squared',NAME$u),_defineProperty(_CNameMapping$u,'tv squared',NAME$u),_defineProperty(_CNameMapping$u,'tv Squared',NAME$u),_CNameMapping$u);

    var _CNameMapping$t;var DIR_NAME$t='VWO';var NAME$t='VWO';var DISPLAY_NAME$t='VWO';_defineProperty({},DISPLAY_NAME$t,DIR_NAME$t);(_CNameMapping$t={},_defineProperty(_CNameMapping$t,NAME$t,NAME$t),_defineProperty(_CNameMapping$t,"VisualWebsiteOptimizer",NAME$t),_defineProperty(_CNameMapping$t,"Visualwebsiteoptimizer",NAME$t),_defineProperty(_CNameMapping$t,"visualwebsiteoptimizer",NAME$t),_defineProperty(_CNameMapping$t,"vwo",NAME$t),_defineProperty(_CNameMapping$t,'Visual Website Optimizer',NAME$t),_defineProperty(_CNameMapping$t,'Visual website optimizer',NAME$t),_defineProperty(_CNameMapping$t,'visual website optimizer',NAME$t),_CNameMapping$t);

    var _CNameMapping$s;var DIR_NAME$s='GA360';var NAME$s='GA360';var DISPLAY_NAME$s='Google Analytics 360';_defineProperty({},DISPLAY_NAME$s,DIR_NAME$s);(_CNameMapping$s={},_defineProperty(_CNameMapping$s,NAME$s,NAME$s),_defineProperty(_CNameMapping$s,'Google Analytics 360',NAME$s),_defineProperty(_CNameMapping$s,'Google analytics 360',NAME$s),_defineProperty(_CNameMapping$s,'google analytics 360',NAME$s),_defineProperty(_CNameMapping$s,'Google Analytics360',NAME$s),_defineProperty(_CNameMapping$s,'Google analytics360',NAME$s),_defineProperty(_CNameMapping$s,'google analytics360',NAME$s),_defineProperty(_CNameMapping$s,"GoogleAnalytics360",NAME$s),_defineProperty(_CNameMapping$s,'GA 360',NAME$s),_CNameMapping$s);

    var _CNameMapping$r;var DIR_NAME$r='Adroll';var NAME$r='ADROLL';var DISPLAY_NAME$r='Adroll';_defineProperty({},DISPLAY_NAME$r,DIR_NAME$r);(_CNameMapping$r={},_defineProperty(_CNameMapping$r,NAME$r,NAME$r),_defineProperty(_CNameMapping$r,"Adroll",NAME$r),_defineProperty(_CNameMapping$r,'Ad roll',NAME$r),_defineProperty(_CNameMapping$r,'ad roll',NAME$r),_defineProperty(_CNameMapping$r,"adroll",NAME$r),_CNameMapping$r);

    var _CNameMapping$q;var DIR_NAME$q='DCMFloodlight';var NAME$q='DCM_FLOODLIGHT';var DISPLAY_NAME$q='DCM Floodlight';_defineProperty({},DISPLAY_NAME$q,DIR_NAME$q);(_CNameMapping$q={},_defineProperty(_CNameMapping$q,NAME$q,NAME$q),_defineProperty(_CNameMapping$q,'DCM Floodlight',NAME$q),_defineProperty(_CNameMapping$q,'dcm floodlight',NAME$q),_defineProperty(_CNameMapping$q,'Dcm Floodlight',NAME$q),_defineProperty(_CNameMapping$q,"DCMFloodlight",NAME$q),_defineProperty(_CNameMapping$q,"dcmfloodlight",NAME$q),_defineProperty(_CNameMapping$q,"DcmFloodlight",NAME$q),_defineProperty(_CNameMapping$q,"dcm_floodlight",NAME$q),_defineProperty(_CNameMapping$q,"DCM_Floodlight",NAME$q),_CNameMapping$q);

    var _CNameMapping$p;var DIR_NAME$p='Matomo';var NAME$p='MATOMO';var DISPLAY_NAME$p='Matomo';_defineProperty({},DISPLAY_NAME$p,DIR_NAME$p);(_CNameMapping$p={},_defineProperty(_CNameMapping$p,NAME$p,NAME$p),_defineProperty(_CNameMapping$p,"Matomo",NAME$p),_defineProperty(_CNameMapping$p,"matomo",NAME$p),_CNameMapping$p);

    var _CNameMapping$o;var DIR_NAME$o='Vero';var NAME$o='VERO';var DISPLAY_NAME$o='Vero';_defineProperty({},DISPLAY_NAME$o,DIR_NAME$o);(_CNameMapping$o={},_defineProperty(_CNameMapping$o,NAME$o,NAME$o),_defineProperty(_CNameMapping$o,"Vero",NAME$o),_defineProperty(_CNameMapping$o,"vero",NAME$o),_CNameMapping$o);

    var _CNameMapping$n;var DIR_NAME$n='Mouseflow';var NAME$n='MOUSEFLOW';var DISPLAY_NAME$n='Mouseflow';_defineProperty({},DISPLAY_NAME$n,DIR_NAME$n);(_CNameMapping$n={},_defineProperty(_CNameMapping$n,NAME$n,NAME$n),_defineProperty(_CNameMapping$n,"Mouseflow",NAME$n),_defineProperty(_CNameMapping$n,"mouseflow",NAME$n),_defineProperty(_CNameMapping$n,"mouseFlow",NAME$n),_defineProperty(_CNameMapping$n,"MouseFlow",NAME$n),_defineProperty(_CNameMapping$n,'Mouse flow',NAME$n),_defineProperty(_CNameMapping$n,'mouse flow',NAME$n),_defineProperty(_CNameMapping$n,'mouse Flow',NAME$n),_defineProperty(_CNameMapping$n,'Mouse Flow',NAME$n),_CNameMapping$n);

    var _CNameMapping$m;var DIR_NAME$m='Rockerbox';var NAME$m='ROCKERBOX';var DISPLAY_NAME$m='Rockerbox';_defineProperty({},DISPLAY_NAME$m,DIR_NAME$m);(_CNameMapping$m={},_defineProperty(_CNameMapping$m,NAME$m,NAME$m),_defineProperty(_CNameMapping$m,"Rockerbox",NAME$m),_defineProperty(_CNameMapping$m,"rockerbox",NAME$m),_defineProperty(_CNameMapping$m,"RockerBox",NAME$m),_defineProperty(_CNameMapping$m,'Rocker box',NAME$m),_defineProperty(_CNameMapping$m,'rocker box',NAME$m),_defineProperty(_CNameMapping$m,'Rocker Box',NAME$m),_CNameMapping$m);

    var _CNameMapping$l;var DIR_NAME$l='ConvertFlow';var NAME$l='CONVERTFLOW';var DISPLAY_NAME$l='ConvertFlow';_defineProperty({},DISPLAY_NAME$l,DIR_NAME$l);(_CNameMapping$l={},_defineProperty(_CNameMapping$l,NAME$l,NAME$l),_defineProperty(_CNameMapping$l,"Convertflow",NAME$l),_defineProperty(_CNameMapping$l,"convertflow",NAME$l),_defineProperty(_CNameMapping$l,"convertFlow",NAME$l),_defineProperty(_CNameMapping$l,"ConvertFlow",NAME$l),_defineProperty(_CNameMapping$l,'Convert flow',NAME$l),_defineProperty(_CNameMapping$l,'convert flow',NAME$l),_defineProperty(_CNameMapping$l,'convert Flow',NAME$l),_defineProperty(_CNameMapping$l,'Convert Flow',NAME$l),_defineProperty(_CNameMapping$l,'CONVERT FLOW',NAME$l),_CNameMapping$l);

    var _CNameMapping$k;var DIR_NAME$k='SnapEngage';var NAME$k='SNAPENGAGE';var DISPLAY_NAME$k='SnapEngage';_defineProperty({},DISPLAY_NAME$k,DIR_NAME$k);(_CNameMapping$k={},_defineProperty(_CNameMapping$k,NAME$k,NAME$k),_defineProperty(_CNameMapping$k,"SnapEngage",NAME$k),_defineProperty(_CNameMapping$k,"Snap_Engage",NAME$k),_defineProperty(_CNameMapping$k,"snapengage",NAME$k),_defineProperty(_CNameMapping$k,'SNAP ENGAGE',NAME$k),_defineProperty(_CNameMapping$k,'Snap Engage',NAME$k),_defineProperty(_CNameMapping$k,'snap engage',NAME$k),_CNameMapping$k);

    var _CNameMapping$j;var DIR_NAME$j='LiveChat';var NAME$j='LIVECHAT';var DISPLAY_NAME$j='LiveChat';_defineProperty({},DISPLAY_NAME$j,DIR_NAME$j);(_CNameMapping$j={},_defineProperty(_CNameMapping$j,NAME$j,NAME$j),_defineProperty(_CNameMapping$j,"LiveChat",NAME$j),_defineProperty(_CNameMapping$j,"Live_Chat",NAME$j),_defineProperty(_CNameMapping$j,"livechat",NAME$j),_defineProperty(_CNameMapping$j,'LIVE CHAT',NAME$j),_defineProperty(_CNameMapping$j,'Live Chat',NAME$j),_defineProperty(_CNameMapping$j,'live chat',NAME$j),_CNameMapping$j);

    var _CNameMapping$i;var DIR_NAME$i='Shynet';var NAME$i='SHYNET';var DISPLAY_NAME$i='Shynet';_defineProperty({},DISPLAY_NAME$i,DIR_NAME$i);(_CNameMapping$i={},_defineProperty(_CNameMapping$i,NAME$i,NAME$i),_defineProperty(_CNameMapping$i,"shynet",NAME$i),_defineProperty(_CNameMapping$i,"ShyNet",NAME$i),_defineProperty(_CNameMapping$i,"shyNet",NAME$i),_defineProperty(_CNameMapping$i,"Shynet",NAME$i),_defineProperty(_CNameMapping$i,'shy net',NAME$i),_defineProperty(_CNameMapping$i,'Shy Net',NAME$i),_defineProperty(_CNameMapping$i,'shy Net',NAME$i),_defineProperty(_CNameMapping$i,'Shy net',NAME$i),_CNameMapping$i);

    var _CNameMapping$h;var DIR_NAME$h='Woopra';var NAME$h='WOOPRA';var DISPLAY_NAME$h='Woopra';_defineProperty({},DISPLAY_NAME$h,DIR_NAME$h);(_CNameMapping$h={},_defineProperty(_CNameMapping$h,NAME$h,NAME$h),_defineProperty(_CNameMapping$h,"Woopra",NAME$h),_defineProperty(_CNameMapping$h,"woopra",NAME$h),_CNameMapping$h);

    var _CNameMapping$g;var DIR_NAME$g='RollBar';var NAME$g='ROLLBAR';var DISPLAY_NAME$g='RollBar';_defineProperty({},DISPLAY_NAME$g,DIR_NAME$g);(_CNameMapping$g={},_defineProperty(_CNameMapping$g,NAME$g,NAME$g),_defineProperty(_CNameMapping$g,"RollBar",NAME$g),_defineProperty(_CNameMapping$g,"Roll_Bar",NAME$g),_defineProperty(_CNameMapping$g,"rollbar",NAME$g),_defineProperty(_CNameMapping$g,"Rollbar",NAME$g),_defineProperty(_CNameMapping$g,'ROLL BAR',NAME$g),_defineProperty(_CNameMapping$g,'Roll Bar',NAME$g),_defineProperty(_CNameMapping$g,'roll bar',NAME$g),_CNameMapping$g);

    var _CNameMapping$f;var DIR_NAME$f='QuoraPixel';var NAME$f='QUORA_PIXEL';var DISPLAY_NAME$f='Quora Pixel';_defineProperty({},DISPLAY_NAME$f,DIR_NAME$f);(_CNameMapping$f={},_defineProperty(_CNameMapping$f,NAME$f,NAME$f),_defineProperty(_CNameMapping$f,'Quora Pixel',NAME$f),_defineProperty(_CNameMapping$f,'Quora pixel',NAME$f),_defineProperty(_CNameMapping$f,'QUORA PIXEL',NAME$f),_defineProperty(_CNameMapping$f,"QuoraPixel",NAME$f),_defineProperty(_CNameMapping$f,"Quorapixel",NAME$f),_defineProperty(_CNameMapping$f,"QUORAPIXEL",NAME$f),_defineProperty(_CNameMapping$f,"Quora_Pixel",NAME$f),_defineProperty(_CNameMapping$f,"quora_pixel",NAME$f),_defineProperty(_CNameMapping$f,"Quora",NAME$f),_CNameMapping$f);

    var _CNameMapping$e;var DIR_NAME$e='June';var NAME$e='JUNE';var DISPLAY_NAME$e='June';_defineProperty({},DISPLAY_NAME$e,DIR_NAME$e);(_CNameMapping$e={},_defineProperty(_CNameMapping$e,NAME$e,NAME$e),_defineProperty(_CNameMapping$e,"June",NAME$e),_defineProperty(_CNameMapping$e,"june",NAME$e),_CNameMapping$e);

    var _CNameMapping$d;var DIR_NAME$d='Engage';var NAME$d='ENGAGE';var DISPLAY_NAME$d='Engage';_defineProperty({},DISPLAY_NAME$d,DIR_NAME$d);(_CNameMapping$d={},_defineProperty(_CNameMapping$d,NAME$d,NAME$d),_defineProperty(_CNameMapping$d,"Engage",NAME$d),_defineProperty(_CNameMapping$d,"engage",NAME$d),_CNameMapping$d);

    var _CNameMapping$c;var DIR_NAME$c='Iterable';var NAME$c='ITERABLE';var DISPLAY_NAME$c='Iterable';_defineProperty({},DISPLAY_NAME$c,DIR_NAME$c);(_CNameMapping$c={},_defineProperty(_CNameMapping$c,NAME$c,NAME$c),_defineProperty(_CNameMapping$c,"Iterable",NAME$c),_defineProperty(_CNameMapping$c,"iterable",NAME$c),_CNameMapping$c);

    var _CNameMapping$b;var DIR_NAME$b='YandexMetrica';var NAME$b='YANDEX_METRICA';var DISPLAY_NAME$b='Yandex.Metrica';_defineProperty({},DISPLAY_NAME$b,DIR_NAME$b);(_CNameMapping$b={},_defineProperty(_CNameMapping$b,NAME$b,NAME$b),_defineProperty(_CNameMapping$b,"Yandexmetrica",NAME$b),_defineProperty(_CNameMapping$b,"yandexmetrica",NAME$b),_defineProperty(_CNameMapping$b,"yandexMetrica",NAME$b),_defineProperty(_CNameMapping$b,"YandexMetrica",NAME$b),_CNameMapping$b);

    var _CNameMapping$a;var DIR_NAME$a='Refiner';var NAME$a='REFINER';var DISPLAY_NAME$a='Refiner';_defineProperty({},DISPLAY_NAME$a,DIR_NAME$a);(_CNameMapping$a={},_defineProperty(_CNameMapping$a,NAME$a,NAME$a),_defineProperty(_CNameMapping$a,"Refiner",NAME$a),_defineProperty(_CNameMapping$a,"refiner",NAME$a),_CNameMapping$a);

    var _CNameMapping$9;var DIR_NAME$9='Qualaroo';var NAME$9='QUALAROO';var DISPLAY_NAME$9='Qualaroo';_defineProperty({},DISPLAY_NAME$9,DIR_NAME$9);(_CNameMapping$9={},_defineProperty(_CNameMapping$9,NAME$9,NAME$9),_defineProperty(_CNameMapping$9,"Qualaroo",NAME$9),_defineProperty(_CNameMapping$9,"qualaroo",NAME$9),_CNameMapping$9);

    var _CNameMapping$8;var DIR_NAME$8='Podsights';var NAME$8='PODSIGHTS';var DISPLAY_NAME$8='Podsights';_defineProperty({},DISPLAY_NAME$8,DIR_NAME$8);(_CNameMapping$8={},_defineProperty(_CNameMapping$8,NAME$8,NAME$8),_defineProperty(_CNameMapping$8,"Podsights",NAME$8),_defineProperty(_CNameMapping$8,"PodSights",NAME$8),_defineProperty(_CNameMapping$8,'pod Sights',NAME$8),_defineProperty(_CNameMapping$8,'Pod Sights',NAME$8),_defineProperty(_CNameMapping$8,'pod sights',NAME$8),_defineProperty(_CNameMapping$8,'POD SIGHTS',NAME$8),_defineProperty(_CNameMapping$8,'Pod sights',NAME$8),_CNameMapping$8);// default mapping for the events

    var _CNameMapping$7;var DIR_NAME$7='Axeptio';var NAME$7='AXEPTIO';var DISPLAY_NAME$7='Axeptio';_defineProperty({},DISPLAY_NAME$7,DIR_NAME$7);(_CNameMapping$7={},_defineProperty(_CNameMapping$7,NAME$7,NAME$7),_defineProperty(_CNameMapping$7,"Axeptio",NAME$7),_defineProperty(_CNameMapping$7,"axeptio",NAME$7),_CNameMapping$7);

    var _CNameMapping$6;var DIR_NAME$6='Satismeter';var NAME$6='SATISMETER';var DISPLAY_NAME$6='Satismeter';_defineProperty({},DISPLAY_NAME$6,DIR_NAME$6);(_CNameMapping$6={},_defineProperty(_CNameMapping$6,NAME$6,NAME$6),_defineProperty(_CNameMapping$6,"Satismeter",NAME$6),_defineProperty(_CNameMapping$6,"SatisMeter",NAME$6),_CNameMapping$6);

    var _CNameMapping$5;var DIR_NAME$5='MicrosoftClarity';var NAME$5='MICROSOFT_CLARITY';var DISPLAY_NAME$5='Microsoft Clarity';_defineProperty({},DISPLAY_NAME$5,DIR_NAME$5);(_CNameMapping$5={},_defineProperty(_CNameMapping$5,NAME$5,NAME$5),_defineProperty(_CNameMapping$5,'Microsoft Clarity',NAME$5),_defineProperty(_CNameMapping$5,'Microsoft clarity',NAME$5),_defineProperty(_CNameMapping$5,'microsoft clarity',NAME$5),_defineProperty(_CNameMapping$5,"Microsoft_clarity",NAME$5),_defineProperty(_CNameMapping$5,"MicrosoftClarity",NAME$5),_defineProperty(_CNameMapping$5,"MICROSOFTCLARITY",NAME$5),_defineProperty(_CNameMapping$5,"microsoftclarity",NAME$5),_defineProperty(_CNameMapping$5,"microsoftClarity",NAME$5),_CNameMapping$5);

    var _CNameMapping$4;var DIR_NAME$4='Sendinblue';var NAME$4='SENDINBLUE';var DISPLAY_NAME$4='Sendinblue';_defineProperty({},DISPLAY_NAME$4,DIR_NAME$4);(_CNameMapping$4={},_defineProperty(_CNameMapping$4,NAME$4,NAME$4),_defineProperty(_CNameMapping$4,"Sendinblue",NAME$4),_defineProperty(_CNameMapping$4,"sendinblue",NAME$4),_defineProperty(_CNameMapping$4,"SendinBlue",NAME$4),_CNameMapping$4);

    var _CNameMapping$3;var DIR_NAME$3='Olark';var NAME$3='OLARK';var DISPLAY_NAME$3='Olark';_defineProperty({},DISPLAY_NAME$3,DIR_NAME$3);(_CNameMapping$3={},_defineProperty(_CNameMapping$3,NAME$3,NAME$3),_defineProperty(_CNameMapping$3,"Olark",NAME$3),_defineProperty(_CNameMapping$3,"olark",NAME$3),_CNameMapping$3);

    var _CNameMapping$2;var DIR_NAME$2='Lemnisk';var NAME$2='LEMNISK';var DISPLAY_NAME$2='Lemnisk';_defineProperty({},DISPLAY_NAME$2,DIR_NAME$2);(_CNameMapping$2={},_defineProperty(_CNameMapping$2,NAME$2,NAME$2),_defineProperty(_CNameMapping$2,"LEMNISK_MARKETING_AUTOMATION",NAME$2),_defineProperty(_CNameMapping$2,'Lemnisk Marketing Automation',NAME$2),_defineProperty(_CNameMapping$2,"LemniskMarketingAutomation",NAME$2),_defineProperty(_CNameMapping$2,"lemniskmarketingautomation",NAME$2),_defineProperty(_CNameMapping$2,"lemniskMarketingAutomation",NAME$2),_defineProperty(_CNameMapping$2,"lemnisk",NAME$2),_defineProperty(_CNameMapping$2,"Lemnisk",NAME$2),_CNameMapping$2);

    var _CNameMapping$1;var DIR_NAME$1='TiktokAds';var NAME$1='TIKTOK_ADS';var DISPLAY_NAME$1='TikTok Ads';_defineProperty({},DISPLAY_NAME$1,DIR_NAME$1);(_CNameMapping$1={},_defineProperty(_CNameMapping$1,NAME$1,NAME$1),_defineProperty(_CNameMapping$1,"TiktokAds",NAME$1),_defineProperty(_CNameMapping$1,'Tiktok ads',NAME$1),_defineProperty(_CNameMapping$1,'Tiktok Ads',NAME$1),_defineProperty(_CNameMapping$1,'Tik Tok Ads',NAME$1),_defineProperty(_CNameMapping$1,'tik tok ads',NAME$1),_defineProperty(_CNameMapping$1,"tiktokads",NAME$1),_CNameMapping$1);

    var _CNameMapping;var DIR_NAME='ActiveCampaign';var NAME='ACTIVE_CAMPAIGN';var DISPLAY_NAME='Active Campaign';_defineProperty({},DISPLAY_NAME,DIR_NAME);(_CNameMapping={ActiveCampaign:NAME,'Active Campaign':NAME,'ACTIVE CAMPAIGN':NAME},_defineProperty(_CNameMapping,NAME,NAME),_defineProperty(_CNameMapping,"activecampaign",NAME),_defineProperty(_CNameMapping,'active campaign',NAME),_defineProperty(_CNameMapping,'Active campaign',NAME),_defineProperty(_CNameMapping,'active Campaign',NAME),_defineProperty(_CNameMapping,"active_campaign",NAME),_CNameMapping);

    var _destDisplayNamesToFi;// map of the destination display names to the destination directory names
    var destDisplayNamesToFileNamesMap=(_destDisplayNamesToFi={},_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$Q,DIR_NAME$Q),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$X,DIR_NAME$X),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$R,DIR_NAME$R),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$V,DIR_NAME$V),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$t,DIR_NAME$t),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$T,DIR_NAME$T),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$15,DIR_NAME$15),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$P,DIR_NAME$P),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$O,DIR_NAME$O),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$N,DIR_NAME$N),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$$,DIR_NAME$$),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$13,DIR_NAME$13),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$11,DIR_NAME$11),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$Z,DIR_NAME$Z),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$J,DIR_NAME$J),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$F,DIR_NAME$F),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$14,DIR_NAME$14),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$Y,DIR_NAME$Y),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$u,DIR_NAME$u),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$W,DIR_NAME$W),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$G,DIR_NAME$G),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$18,DIR_NAME$18),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$E,DIR_NAME$E),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$I,DIR_NAME$I),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$17,DIR_NAME$17),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$B,DIR_NAME$B),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$M,DIR_NAME$M),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$12,DIR_NAME$12),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$16,DIR_NAME$16),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$D,DIR_NAME$D),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$19,DIR_NAME$19),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$K,DIR_NAME$K),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$x,DIR_NAME$x),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$_,DIR_NAME$_),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$S,DIR_NAME$S),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$10,DIR_NAME$10),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$H,DIR_NAME$H),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$z,DIR_NAME$z),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$A,DIR_NAME$A),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$w,DIR_NAME$w),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$y,DIR_NAME$y),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$v,DIR_NAME$v),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$C,DIR_NAME$C),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$U,DIR_NAME$U),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$L,DIR_NAME$L),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$s,DIR_NAME$s),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$r,DIR_NAME$r),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$q,DIR_NAME$q),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$p,DIR_NAME$p),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$o,DIR_NAME$o),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$n,DIR_NAME$n),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$m,DIR_NAME$m),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$l,DIR_NAME$l),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$k,DIR_NAME$k),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$j,DIR_NAME$j),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$i,DIR_NAME$i),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$h,DIR_NAME$h),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$g,DIR_NAME$g),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$f,DIR_NAME$f),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$e,DIR_NAME$e),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$d,DIR_NAME$d),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$c,DIR_NAME$c),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$b,DIR_NAME$b),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$a,DIR_NAME$a),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$9,DIR_NAME$9),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$8,DIR_NAME$8),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$7,DIR_NAME$7),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$6,DIR_NAME$6),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$5,DIR_NAME$5),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$4,DIR_NAME$4),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$3,DIR_NAME$3),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$2,DIR_NAME$2),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME$1,DIR_NAME$1),_defineProperty(_destDisplayNamesToFi,DISPLAY_NAME,DIR_NAME),_destDisplayNamesToFi);

    var DEFAULT_INTEGRATIONS_CONFIG={All:true};

    var isDestIntgConfigTruthy=function isDestIntgConfigTruthy(destIntgConfig){return !isUndefined(destIntgConfig)&&Boolean(destIntgConfig)===true;};var isDestIntgConfigFalsy=function isDestIntgConfigFalsy(destIntgConfig){return !isUndefined(destIntgConfig)&&Boolean(destIntgConfig)===false;};/**
     * Filters the destinations that should not be loaded or forwarded events to based on the integration options (load or events API)
     * @param intgOpts Integration options object
     * @param destinations Destinations array
     * @returns Destinations array filtered based on the integration options
     */var filterDestinations=function filterDestinations(intgOpts,destinations){var allOptVal=intgOpts.All;return destinations.filter(function(dest){var destDisplayName=dest.displayName;var isDestEnabled;if(allOptVal){isDestEnabled=true;if(isDestIntgConfigFalsy(intgOpts[destDisplayName])){isDestEnabled=false;}}else {isDestEnabled=false;if(isDestIntgConfigTruthy(intgOpts[destDisplayName])){isDestEnabled=true;}}return isDestEnabled;});};

    var READY_CHECK_TIMEOUT_MS=11*1000;// 11 seconds
    var SCRIPT_LOAD_TIMEOUT_MS=10*1000;// 10 seconds
    var DEVICE_MODE_DESTINATIONS_PLUGIN='DeviceModeDestinationsPlugin';

    var DESTINATION_NOT_SUPPORTED_ERROR=function DESTINATION_NOT_SUPPORTED_ERROR(destUserFriendlyId){return "Destination ".concat(destUserFriendlyId," is not supported.");};var DESTINATION_SDK_LOAD_ERROR=function DESTINATION_SDK_LOAD_ERROR(context,destUserFriendlyId){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to load script for destination ").concat(destUserFriendlyId,".");};var DESTINATION_INIT_ERROR=function DESTINATION_INIT_ERROR(destUserFriendlyId){return "Failed to initialize destination ".concat(destUserFriendlyId,".");};var DESTINATION_INTEGRATIONS_DATA_ERROR=function DESTINATION_INTEGRATIONS_DATA_ERROR(destUserFriendlyId){return "Failed to get integrations data for destination ".concat(destUserFriendlyId,".");};var DESTINATION_READY_TIMEOUT_ERROR=function DESTINATION_READY_TIMEOUT_ERROR(timeout,destUserFriendlyId){return "A timeout of ".concat(timeout," ms occurred while trying to check the ready status for \"").concat(destUserFriendlyId,"\" destination.");};

    /**
     * Determines if the destination SDK code is evaluated
     * @param destSDKIdentifier The name of the global globalThis object that contains the destination SDK
     * @param sdkTypeName The name of the destination SDK type
     * @param logger Logger instance
     * @returns true if the destination SDK code is evaluated, false otherwise
     */var isDestinationSDKMounted=function isDestinationSDKMounted(destSDKIdentifier,sdkTypeName,logger){return Boolean(globalThis[destSDKIdentifier]&&globalThis[destSDKIdentifier][sdkTypeName]&&globalThis[destSDKIdentifier][sdkTypeName].prototype&&typeof globalThis[destSDKIdentifier][sdkTypeName].prototype.constructor!=='undefined');};var createDestinationInstance=function createDestinationInstance(destSDKIdentifier,sdkTypeName,dest,state){var rAnalytics=globalThis.rudderanalytics;var analytics=rAnalytics.getAnalyticsInstance(state.lifecycle.writeKey.value);return new globalThis[destSDKIdentifier][sdkTypeName](clone$1(dest.config),{loadIntegration:state.nativeDestinations.loadIntegration.value,logLevel:state.lifecycle.logLevel.value,loadOnlyIntegrations:state.nativeDestinations.loadOnlyIntegrations.value,page:function page(category,name,properties,options,callback){return analytics.page(pageArgumentsToCallOptions(category,name,properties,options,callback));},track:function track(event,properties,options,callback){return analytics.track(trackArgumentsToCallOptions(event,properties,options,callback));},identify:function identify(userId,traits,options,callback){return analytics.identify(identifyArgumentsToCallOptions(userId,traits,options,callback));},alias:function alias(to,from,options,callback){return analytics.alias(aliasArgumentsToCallOptions(to,from,options,callback));},group:function group(groupId,traits,options,callback){return analytics.group(groupArgumentsToCallOptions(groupId,traits,options,callback));},getAnonymousId:function getAnonymousId(){return analytics.getAnonymousId();},getUserId:function getUserId(){return analytics.getUserId();},getUserTraits:function getUserTraits(){return analytics.getUserTraits();},getGroupId:function getGroupId(){return analytics.getGroupId();},getGroupTraits:function getGroupTraits(){return analytics.getGroupTraits();},getSessionId:function getSessionId(){return analytics.getSessionId();}},{shouldApplyDeviceModeTransformation:dest.shouldApplyDeviceModeTransformation,propagateEventsUntransformedOnError:dest.propagateEventsUntransformedOnError,destinationId:dest.id});};var isDestinationReady=function isDestinationReady(dest){return new Promise(function(resolve,reject){var instance=dest.instance;var handleNumber;var checkReady=function checkReady(){if(instance.isLoaded()&&(!instance.isReady||instance.isReady())){resolve(true);}else {handleNumber=globalThis.requestAnimationFrame(checkReady);}};checkReady();setTimeout(function(){globalThis.cancelAnimationFrame(handleNumber);reject(new Error(DESTINATION_READY_TIMEOUT_ERROR(READY_CHECK_TIMEOUT_MS,dest.userFriendlyId)));},READY_CHECK_TIMEOUT_MS);});};/**
     * Extracts the integration config, if any, from the given destination
     * and merges it with the current integrations config
     * @param dest Destination object
     * @param curDestIntgConfig Current destinations integration config
     * @param logger Logger object
     * @returns Combined destinations integrations config
     */var getCumulativeIntegrationsConfig=function getCumulativeIntegrationsConfig(dest,curDestIntgConfig,errorHandler){var _dest$instance;var integrationsConfig=curDestIntgConfig;if(isFunction((_dest$instance=dest.instance)===null||_dest$instance===void 0?void 0:_dest$instance.getDataForIntegrationsObject)){try{var _dest$instance2;integrationsConfig=mergeDeepRight(curDestIntgConfig,(_dest$instance2=dest.instance)===null||_dest$instance2===void 0?void 0:_dest$instance2.getDataForIntegrationsObject());}catch(err){errorHandler===null||errorHandler===void 0||errorHandler.onError(err,DEVICE_MODE_DESTINATIONS_PLUGIN,DESTINATION_INTEGRATIONS_DATA_ERROR(dest.userFriendlyId));}}return integrationsConfig;};var initializeDestination=function initializeDestination(dest,state,destSDKIdentifier,sdkTypeName,errorHandler,logger){try{var initializedDestination=clone$1(dest);var destInstance=createDestinationInstance(destSDKIdentifier,sdkTypeName,dest,state);initializedDestination.instance=destInstance;destInstance.init();isDestinationReady(initializedDestination).then(function(){// Collect the integrations data for the hybrid mode destinations
        if(isHybridModeDestination(initializedDestination)){state.nativeDestinations.integrationsConfig.value=getCumulativeIntegrationsConfig(initializedDestination,state.nativeDestinations.integrationsConfig.value,errorHandler);}state.nativeDestinations.initializedDestinations.value=[].concat(_toConsumableArray(state.nativeDestinations.initializedDestinations.value),[initializedDestination]);}).catch(function(err){state.nativeDestinations.failedDestinations.value=[].concat(_toConsumableArray(state.nativeDestinations.failedDestinations.value),[dest]);// The error message is already formatted in the isDestinationReady function
        logger===null||logger===void 0||logger.error(err);});}catch(err){state.nativeDestinations.failedDestinations.value=[].concat(_toConsumableArray(state.nativeDestinations.failedDestinations.value),[dest]);errorHandler===null||errorHandler===void 0||errorHandler.onError(err,DEVICE_MODE_DESTINATIONS_PLUGIN,DESTINATION_INIT_ERROR(dest.userFriendlyId));}};

    var pluginName$b='DeviceModeDestinations';var DeviceModeDestinations=function DeviceModeDestinations(){return {name:pluginName$b,initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$b]);},nativeDestinations:{setActiveDestinations:function setActiveDestinations(state,pluginsManager,errorHandler,logger){var _clone,_state$consents$postC,_state$consents$postC2;// Normalize the integration options from the load API call
                state.nativeDestinations.loadOnlyIntegrations.value=(_clone=clone$1(state.loadOptions.value.integrations))!==null&&_clone!==void 0?_clone:DEFAULT_INTEGRATIONS_CONFIG;state.nativeDestinations.loadIntegration.value=state.loadOptions.value.loadIntegration;// Filter destination that doesn't have mapping config-->Integration names
                var configSupportedDestinations=state.nativeDestinations.configuredDestinations.value.filter(function(configDest){if(destDisplayNamesToFileNamesMap[configDest.displayName]){return true;}errorHandler===null||errorHandler===void 0||errorHandler.onError(new Error(DESTINATION_NOT_SUPPORTED_ERROR(configDest.userFriendlyId)),DEVICE_MODE_DESTINATIONS_PLUGIN);return false;});// Filter destinations that are disabled through load and consent API options
                var destinationsToLoad=filterDestinations(mergeDeepRight(state.nativeDestinations.loadOnlyIntegrations.value,(_state$consents$postC=(_state$consents$postC2=state.consents.postConsent.value)===null||_state$consents$postC2===void 0?void 0:_state$consents$postC2.integrations)!==null&&_state$consents$postC!==void 0?_state$consents$postC:{}),configSupportedDestinations);var consentedDestinations=destinationsToLoad.filter(function(dest){var _pluginsManager$invok;return(// if consent manager is not configured, then default to load the destination
                    (_pluginsManager$invok=pluginsManager.invokeSingle("consentManager.isDestinationConsented",state,dest.config,errorHandler,logger))!==null&&_pluginsManager$invok!==void 0?_pluginsManager$invok:true);});state.nativeDestinations.activeDestinations.value=consentedDestinations;},load:function load(state,externalSrcLoader,errorHandler,logger,externalScriptOnLoad){var integrationsCDNPath=state.lifecycle.integrationsCDNPath.value;var activeDestinations=state.nativeDestinations.activeDestinations.value;activeDestinations.forEach(function(dest){var sdkName=destDisplayNamesToFileNamesMap[dest.displayName];var destSDKIdentifier="".concat(sdkName,"_RS");// this is the name of the object loaded on the window
                var sdkTypeName=sdkName;if(sdkTypeName&&!isDestinationSDKMounted(destSDKIdentifier,sdkTypeName)){var destSdkURL="".concat(integrationsCDNPath,"/").concat(sdkName,".min.js");externalSrcLoader.loadJSFile({url:destSdkURL,id:dest.userFriendlyId,callback:externalScriptOnLoad!==null&&externalScriptOnLoad!==void 0?externalScriptOnLoad:function(id){if(!id){logger===null||logger===void 0||logger.error(DESTINATION_SDK_LOAD_ERROR(DEVICE_MODE_DESTINATIONS_PLUGIN,dest.userFriendlyId));state.nativeDestinations.failedDestinations.value=[].concat(_toConsumableArray(state.nativeDestinations.failedDestinations.value),[dest]);}else {initializeDestination(dest,state,destSDKIdentifier,sdkTypeName,errorHandler,logger);}},timeout:SCRIPT_LOAD_TIMEOUT_MS});}else if(sdkTypeName){initializeDestination(dest,state,destSDKIdentifier,sdkTypeName,errorHandler,logger);}else {logger===null||logger===void 0||logger.error(DESTINATION_SDK_LOAD_ERROR(DEVICE_MODE_DESTINATIONS_PLUGIN,dest.displayName));}});}}};};

    var DEFAULT_TRANSFORMATION_QUEUE_OPTIONS={minRetryDelay:500,backoffFactor:2,maxAttempts:3};var REQUEST_TIMEOUT_MS$1=10*1000;// 10 seconds
    var QUEUE_NAME$2='rudder';var DMT_PLUGIN='DeviceModeTransformationPlugin';

    var DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR=function DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR(context,displayName,reason,action){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Event transformation unsuccessful for destination \"").concat(displayName,"\". Reason: ").concat(reason,". ").concat(action,".");};var DMT_REQUEST_FAILED_ERROR=function DMT_REQUEST_FAILED_ERROR(context,displayName,status,action){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"[Destination: ").concat(displayName,"].Transformation request failed with status: ").concat(status,". Retries exhausted. ").concat(action,".");};var DMT_EXCEPTION=function DMT_EXCEPTION(displayName){return "[Destination:".concat(displayName,"].");};var DMT_SERVER_ACCESS_DENIED_WARNING=function DMT_SERVER_ACCESS_DENIED_WARNING(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Transformation server access is denied. The configuration data seems to be out of sync. Sending untransformed event to the destination.");};

    /**
     * A helper function that will take rudderEvent and generate
     * a batch payload that will be sent to transformation server
     *
     */var createPayload=function createPayload(event,destinationIds,token){var orderNo=Date.now();var payload={metadata:{'Custom-Authorization':token},batch:[{orderNo:orderNo,destinationIds:destinationIds,event:event}]};return payload;};var sendTransformedEventToDestinations=function sendTransformedEventToDestinations(state,pluginsManager,destinationIds,result,status,event,errorHandler,logger){var NATIVE_DEST_EXT_POINT='destinationsEventsQueue.enqueueEventToDestination';var ACTION_TO_SEND_UNTRANSFORMED_EVENT='Sending untransformed event';var ACTION_TO_DROP_EVENT='Dropping the event';var destinations=state.nativeDestinations.initializedDestinations.value.filter(function(d){return d&&destinationIds.includes(d.id);});destinations.forEach(function(dest){try{var eventsToSend=[];switch(status){case 200:{var response=JSON.parse(result);var destTransformedResult=response.transformedBatch.find(function(e){return e.id===dest.id;});destTransformedResult===null||destTransformedResult===void 0||destTransformedResult.payload.forEach(function(tEvent){if(tEvent.status==='200'){eventsToSend.push(tEvent.event);}else {var reason='Unknown';if(tEvent.status==='410'){reason='Transformation is not available';}var action=ACTION_TO_DROP_EVENT;if(dest.propagateEventsUntransformedOnError===true){action=ACTION_TO_SEND_UNTRANSFORMED_EVENT;eventsToSend.push(event);logger===null||logger===void 0||logger.warn(DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR(DMT_PLUGIN,dest.displayName,reason,action));}else {logger===null||logger===void 0||logger.error(DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR(DMT_PLUGIN,dest.displayName,reason,action));}}});break;}// Transformation server access denied
        case 404:{logger===null||logger===void 0||logger.warn(DMT_SERVER_ACCESS_DENIED_WARNING(DMT_PLUGIN));eventsToSend.push(event);break;}default:{if(dest.propagateEventsUntransformedOnError===true){logger===null||logger===void 0||logger.warn(DMT_REQUEST_FAILED_ERROR(DMT_PLUGIN,dest.displayName,status,ACTION_TO_SEND_UNTRANSFORMED_EVENT));eventsToSend.push(event);}else {logger===null||logger===void 0||logger.error(DMT_REQUEST_FAILED_ERROR(DMT_PLUGIN,dest.displayName,status,ACTION_TO_DROP_EVENT));}break;}}eventsToSend===null||eventsToSend===void 0||eventsToSend.forEach(function(tEvent){if(isNonEmptyObject(tEvent)){pluginsManager.invokeSingle(NATIVE_DEST_EXT_POINT,state,tEvent,dest,errorHandler,logger);}});}catch(e){errorHandler===null||errorHandler===void 0||errorHandler.onError(e,DMT_PLUGIN,DMT_EXCEPTION(dest.displayName));}});};

    var pluginName$a='DeviceModeTransformation';var DeviceModeTransformation=function DeviceModeTransformation(){return {name:pluginName$a,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$a]);},transformEvent:{init:function init(state,pluginsManager,httpClient,storeManager,errorHandler,logger){var writeKey=state.lifecycle.writeKey.value;httpClient.setAuthHeader(writeKey);var eventsQueue=new RetryQueue(// adding write key to the queue name to avoid conflicts
                "".concat(QUEUE_NAME$2,"_").concat(writeKey),DEFAULT_TRANSFORMATION_QUEUE_OPTIONS,function(item,done,attemptNumber,maxRetryAttempts){var payload=createPayload(item.event,item.destinationIds,item.token);httpClient.getAsyncData({url:"".concat(state.lifecycle.dataPlaneUrl.value,"/transform"),options:{method:'POST',data:getDMTDeliveryPayload(payload),sendRawData:true},isRawResponse:true,timeout:REQUEST_TIMEOUT_MS$1,callback:function callback(result,details){// null means item will not be requeued
                        var queueErrResp=isErrRetryable(details)?details:null;if(!queueErrResp||attemptNumber===maxRetryAttempts){var _details$xhr;sendTransformedEventToDestinations(state,pluginsManager,item.destinationIds,result,details===null||details===void 0||(_details$xhr=details.xhr)===null||_details$xhr===void 0?void 0:_details$xhr.status,item.event,errorHandler,logger);}done(queueErrResp,result);}});},storeManager,MEMORY_STORAGE);return eventsQueue;},enqueue:function enqueue(state,eventsQueue,event,destinations){var destinationIds=destinations.map(function(d){return d.id;});eventsQueue.addItem({event:event,destinationIds:destinationIds,token:state.session.authToken.value});}}};};

    var INVALID_SOURCE_CONFIG_ERROR="Invalid source configuration or source id.";

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
     */var crc32=function crc32(str){var crcTable=makeCRCTable();var crc=0^-1;for(var i=0;i<str.length;i++){// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
        crc=crc>>>8^crcTable[(crc^str.charCodeAt(i))&0xff];}return (crc^-1)>>>0;};

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
     */var deserialize=function deserialize(serializedIds){if(!serializedIds){return {};}var keyValuePairs={};var params=serializedIds.split(DELIMITER);for(var i=0;i<params.length;i+=2){var key=params[i];var valid=KEY_VALIDATOR.test(key);if(valid){keyValuePairs[key]=decode$1(params[i+1]);}}return keyValuePairs;};/**
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
     */var parseLinker=function parseLinker(value){var linkerObj=parseLinkerParamValue(value);if(!linkerObj){return null;}var checksum=linkerObj.checksum,serializedIds=linkerObj.serializedIds;if(!serializedIds||!checksum||!isCheckSumValid(serializedIds,checksum)){return null;}return deserialize(serializedIds);};

    var pluginName$7='GoogleLinker';var GoogleLinker=function GoogleLinker(){return {name:pluginName$7,initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$7]);},userSession:{anonymousIdGoogleLinker:function anonymousIdGoogleLinker(rudderAmpLinkerParam){if(!rudderAmpLinkerParam){return null;}var parsedAnonymousIdObj=rudderAmpLinkerParam?parseLinker(rudderAmpLinkerParam):null;return parsedAnonymousIdObj?parsedAnonymousIdObj[AMP_LINKER_ANONYMOUS_ID_KEY]:null;}}};};

    var KETCH_CONSENT_COOKIE_READ_ERROR=function KETCH_CONSENT_COOKIE_READ_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to read the consent cookie.");};var KETCH_CONSENT_COOKIE_PARSE_ERROR=function KETCH_CONSENT_COOKIE_PARSE_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to parse the consent cookie.");};var DESTINATION_CONSENT_STATUS_ERROR$1="Failed to determine the consent status for the destination. Please check the destination configuration and try again.";

    var KETCH_CONSENT_MANAGER_PLUGIN='KetchConsentManagerPlugin';var KETCH_CONSENT_COOKIE_NAME_V1='_ketch_consent_v1_';

    /**
     * Gets the consent data from the Ketch's consent cookie
     * @param storeManager Store manager instance
     * @param logger Logger instance
     * @returns Consent data from the consent cookie
     */var getKetchConsentData=function getKetchConsentData(storeManager,logger){var rawConsentCookieData=null;try{// Create a data store instance to read the consent cookie
        var dataStore=storeManager===null||storeManager===void 0?void 0:storeManager.setStore({id:KETCH_CONSENT_MANAGER_PLUGIN,name:KETCH_CONSENT_MANAGER_PLUGIN,type:COOKIE_STORAGE});rawConsentCookieData=dataStore===null||dataStore===void 0?void 0:dataStore.engine.getItem(KETCH_CONSENT_COOKIE_NAME_V1);}catch(err){logger===null||logger===void 0||logger.error(KETCH_CONSENT_COOKIE_READ_ERROR(KETCH_CONSENT_MANAGER_PLUGIN),err);return undefined;}if(isNullOrUndefined(rawConsentCookieData)){return undefined;}// Decode and parse the cookie data to JSON
        var consentCookieData;try{consentCookieData=JSON.parse(fromBase64(rawConsentCookieData));}catch(err){logger===null||logger===void 0||logger.error(KETCH_CONSENT_COOKIE_PARSE_ERROR(KETCH_CONSENT_MANAGER_PLUGIN),err);return undefined;}if(!consentCookieData){return undefined;}// Convert the cookie data to consent data
        var consentPurposes={};Object.entries(consentCookieData).forEach(function(pEntry){var purposeCode=pEntry[0];var purposeValue=pEntry[1];consentPurposes[purposeCode]=(purposeValue===null||purposeValue===void 0?void 0:purposeValue.status)==='granted';});return consentPurposes;};/**
     * Gets the consent data in the format expected by the application state
     * @param ketchConsentData Consent data derived from the consent cookie
     * @returns Consent data
     */var getConsentData=function getConsentData(ketchConsentData){var allowedConsentIds=[];var deniedConsentIds=[];if(ketchConsentData){Object.entries(ketchConsentData).forEach(function(e){var purposeCode=e[0];var isConsented=e[1];if(isConsented){allowedConsentIds.push(purposeCode);}else {deniedConsentIds.push(purposeCode);}});}return {allowedConsentIds:allowedConsentIds,deniedConsentIds:deniedConsentIds};};var updateConsentStateFromData=function updateConsentStateFromData(state,ketchConsentData){var consentData=getConsentData(ketchConsentData);state.consents.initialized.value=isDefined(ketchConsentData);state.consents.data.value=consentData;};

    var pluginName$6='KetchConsentManager';var KetchConsentManager=function KetchConsentManager(){return {name:pluginName$6,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$6]);},consentManager:{init:function init(state,logger){// getKetchUserConsentedPurposes returns current ketch opted-in purposes
// This will be helpful for debugging
                globalThis.getKetchUserConsentedPurposes=function(){var _state$consents$data$;return (_state$consents$data$=state.consents.data.value.allowedConsentIds)===null||_state$consents$data$===void 0?void 0:_state$consents$data$.slice();};// getKetchUserDeniedPurposes returns current ketch opted-out purposes
// This will be helpful for debugging
                globalThis.getKetchUserDeniedPurposes=function(){var _state$consents$data$2;return (_state$consents$data$2=state.consents.data.value.deniedConsentIds)===null||_state$consents$data$2===void 0?void 0:_state$consents$data$2.slice();};// updateKetchConsent callback function to update current consent purpose state
// this will be called from ketch rudderstack plugin
                globalThis.updateKetchConsent=function(ketchConsentData){updateConsentStateFromData(state,ketchConsentData);};},updateConsentsInfo:function updateConsentsInfo(state,storeManager,logger){// retrieve consent data and update the state
                var ketchConsentData;if(!isUndefined(globalThis.ketchConsent)){ketchConsentData=globalThis.ketchConsent;}else {ketchConsentData=getKetchConsentData(storeManager,logger);}updateConsentStateFromData(state,ketchConsentData);},isDestinationConsented:function isDestinationConsented(state,destConfig,errorHandler,logger){if(!state.consents.initialized.value){return true;}var allowedConsentIds=state.consents.data.value.allowedConsentIds;try{var ketchConsentPurposes=destConfig.ketchConsentPurposes,consentManagement=destConfig.consentManagement;var matchPredicate=function matchPredicate(consent){return allowedConsentIds.includes(consent);};// Generic consent management
                if(consentManagement){var _consentManagement$fi;// Get the corresponding consents for the destination
                    var cmpConsents=(_consentManagement$fi=consentManagement.find(function(c){return c.provider===state.consents.provider.value;}))===null||_consentManagement$fi===void 0?void 0:_consentManagement$fi.consents;// If there are no consents configured for the destination for the current provider, events should be sent.
                    if(!cmpConsents){return true;}var configuredConsents=cmpConsents.map(function(c){return c.consent.trim();}).filter(function(n){return n;});// match the configured consents with user provided consents as per
// the configured resolution strategy
                    switch(state.consents.resolutionStrategy.value){case'or':return configuredConsents.some(matchPredicate)||configuredConsents.length===0;case'and':default:return configuredConsents.every(matchPredicate);}// Legacy cookie consent management
// TODO: To be removed once the source config API is updated to support generic consent management
                }else if(ketchConsentPurposes){var _configuredConsents=ketchConsentPurposes.map(function(p){return p.purpose.trim();}).filter(function(n){return n;});// Check if any of the destination's mapped ketch purposes are consented by the user in the browser.
                    return _configuredConsents.some(matchPredicate)||_configuredConsents.length===0;}// If there are no consents configured for the destination for the current provider, events should be sent.
                return true;}catch(err){errorHandler===null||errorHandler===void 0||errorHandler.onError(err,KETCH_CONSENT_MANAGER_PLUGIN,DESTINATION_CONSENT_STATUS_ERROR$1);return true;}}}};};

    var DEFAULT_QUEUE_OPTIONS={maxItems:100};var QUEUE_NAME$1='rudder_destinations_events';var NATIVE_DESTINATION_QUEUE_PLUGIN='NativeDestinationQueuePlugin';

    var DESTINATION_EVENT_FILTERING_WARNING=function DESTINATION_EVENT_FILTERING_WARNING(context,eventName,destUserFriendlyId){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"The \"").concat(eventName,"\" track event has been filtered for the \"").concat(destUserFriendlyId,"\" destination.");};var DESTINATION_EVENT_FORWARDING_ERROR=function DESTINATION_EVENT_FORWARDING_ERROR(destUserFriendlyId){return "Failed to forward event to destination \"".concat(destUserFriendlyId,"\".");};

    var getNormalizedQueueOptions$1=function getNormalizedQueueOptions(queueOpts){return mergeDeepRight(DEFAULT_QUEUE_OPTIONS,queueOpts);};var isValidEventName=function isValidEventName(eventName){return eventName&&typeof eventName==='string';};var isEventDenyListed=function isEventDenyListed(eventType,eventName,dest){if(eventType!=='track'){return false;}var _dest$config=dest.config,blacklistedEvents=_dest$config.blacklistedEvents,whitelistedEvents=_dest$config.whitelistedEvents,eventFilteringOption=_dest$config.eventFilteringOption;switch(eventFilteringOption){// Blacklist is chosen for filtering events
        case'blacklistedEvents':{if(!isValidEventName(eventName)){return false;}var trimmedEventName=eventName.trim();if(Array.isArray(blacklistedEvents)){return blacklistedEvents.some(function(eventObj){return eventObj.eventName.trim()===trimmedEventName;});}return false;}// Whitelist is chosen for filtering events
        case'whitelistedEvents':{if(!isValidEventName(eventName)){return true;}var _trimmedEventName=eventName.trim();if(Array.isArray(whitelistedEvents)){return !whitelistedEvents.some(function(eventObj){return eventObj.eventName.trim()===_trimmedEventName;});}return true;}case'disable':default:return false;}};var sendEventToDestination=function sendEventToDestination(item,dest,errorHandler,logger){var methodName=item.type.toString();try{var _dest$instance,_dest$instance$method;// Destinations expect the event to be wrapped under the `message` key
// This will remain until we update the destinations to accept the event directly
        (_dest$instance=dest.instance)===null||_dest$instance===void 0||(_dest$instance$method=_dest$instance[methodName])===null||_dest$instance$method===void 0||_dest$instance$method.call(_dest$instance,{message:item});}catch(err){errorHandler===null||errorHandler===void 0||errorHandler.onError(err,NATIVE_DESTINATION_QUEUE_PLUGIN,DESTINATION_EVENT_FORWARDING_ERROR(dest.userFriendlyId));}};

    var pluginName$5='NativeDestinationQueue';var NativeDestinationQueue=function NativeDestinationQueue(){return {name:pluginName$5,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$5]);},destinationsEventsQueue:{/**
             * Initialize the queue for delivery to destinations
             * @param state Application state
             * @param pluginsManager PluginsManager instance
             * @param storeManager StoreManager instance
             * @param errorHandler Error handler instance
             * @param logger Logger instance
             * @returns IQueue instance
             */init:function init(state,pluginsManager,storeManager,dmtQueue,errorHandler,logger){var finalQOpts=getNormalizedQueueOptions$1(state.loadOptions.value.destinationsQueueOptions);var writeKey=state.lifecycle.writeKey.value;var eventsQueue=new RetryQueue(// adding write key to the queue name to avoid conflicts
                "".concat(QUEUE_NAME$1,"_").concat(writeKey),finalQOpts,function(rudderEvent,done){var destinationsToSend=filterDestinations(rudderEvent.integrations,state.nativeDestinations.initializedDestinations.value);// list of destinations which are enable for DMT
                    var destWithTransformationEnabled=[];var clonedRudderEvent=clone$1(rudderEvent);destinationsToSend.forEach(function(dest){var sendEvent=!isEventDenyListed(clonedRudderEvent.type,clonedRudderEvent.event,dest);if(!sendEvent){logger===null||logger===void 0||logger.warn(DESTINATION_EVENT_FILTERING_WARNING(NATIVE_DESTINATION_QUEUE_PLUGIN,clonedRudderEvent.event,dest.userFriendlyId));return;}if(dest.shouldApplyDeviceModeTransformation){destWithTransformationEnabled.push(dest);}else {sendEventToDestination(clonedRudderEvent,dest,errorHandler);}});if(destWithTransformationEnabled.length>0){pluginsManager.invokeSingle('transformEvent.enqueue',state,dmtQueue,clonedRudderEvent,destWithTransformationEnabled,errorHandler,logger);}// Mark success always
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
             */enqueue:function enqueue(state,eventsQueue,event,errorHandler,logger){eventsQueue.addItem(event);},/**
             * This extension point is used to directly send the transformed event to the destination
             * @param state Application state
             * @param event RudderEvent Object
             * @param destination Destination Object
             * @param errorHandler Error handler instance
             * @param logger Logger instance
             */enqueueEventToDestination:function enqueueEventToDestination(state,event,destination,errorHandler,logger){sendEventToDestination(event,destination,errorHandler);}}};};

    var ONETRUST_ACCESS_ERROR=function ONETRUST_ACCESS_ERROR(context){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to access OneTrust SDK resources. Please ensure that the OneTrust SDK is loaded successfully before RudderStack SDK.");};var DESTINATION_CONSENT_STATUS_ERROR="Failed to determine the consent status for the destination. Please check the destination configuration and try again.";

    var ONETRUST_CONSENT_MANAGER_PLUGIN='OneTrustConsentManagerPlugin';

    var pluginName$4='OneTrustConsentManager';var OneTrustConsentManager=function OneTrustConsentManager(){return {name:pluginName$4,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$4]);},consentManager:{init:function init(state,logger){// Nothing to initialize
            },updateConsentsInfo:function updateConsentsInfo(state,storeManager,logger){if(!globalThis.OneTrust||!globalThis.OnetrustActiveGroups){logger===null||logger===void 0||logger.error(ONETRUST_ACCESS_ERROR(ONETRUST_CONSENT_MANAGER_PLUGIN));state.consents.initialized.value=false;return;}// OneTrustConsentManager SDK populates a data layer object OnetrustActiveGroups with
// the cookie categories Ids that the user has consented to.
// Eg: ',C0001,C0003,'
// We split it and save it as an array.
                var allowedConsentIds=globalThis.OnetrustActiveGroups.split(',').filter(function(n){return n;});var allowedConsents={};var deniedConsentIds=[];// Get the groups (cookie categorization), user has created in OneTrust account.
                var oneTrustAllGroupsInfo=globalThis.OneTrust.GetDomainData().Groups;oneTrustAllGroupsInfo.forEach(function(group){var CustomGroupId=group.CustomGroupId,GroupName=group.GroupName;if(allowedConsentIds.includes(CustomGroupId)){allowedConsents[CustomGroupId]=GroupName;}else {deniedConsentIds.push(CustomGroupId);}});state.consents.initialized.value=true;// In case of OneTrust, as we still support both category names and IDs, the allowed consents
// are stored as an object with key as the category ID and value as the category name.
                state.consents.data.value={allowedConsentIds:allowedConsents,deniedConsentIds:deniedConsentIds};},isDestinationConsented:function isDestinationConsented(state,destConfig,errorHandler,logger){if(!state.consents.initialized.value){return true;}var allowedConsents=state.consents.data.value.allowedConsentIds;try{// mapping of the destination with the consent group name
                var oneTrustCookieCategories=destConfig.oneTrustCookieCategories,consentManagement=destConfig.consentManagement;var allowedConsentIds=Object.keys(allowedConsents);var allowedConsentNames=Object.values(allowedConsents);// Match the consent in both IDs and names
                var matchPredicate=function matchPredicate(consent){return allowedConsentIds.includes(consent)||allowedConsentNames.includes(consent);};// Generic consent management
                if(consentManagement){var _consentManagement$fi;// Get the corresponding consents for the destination
                    var cmpConsents=(_consentManagement$fi=consentManagement.find(function(c){return c.provider===state.consents.provider.value;}))===null||_consentManagement$fi===void 0?void 0:_consentManagement$fi.consents;// If there are no consents configured for the destination for the current provider, events should be sent.
                    if(!cmpConsents){return true;}var configuredConsents=cmpConsents.map(function(c){return c.consent.trim();}).filter(function(n){return n;});// match the configured consents with user provided consents as per
// the configured resolution strategy
                    switch(state.consents.resolutionStrategy.value){case'or':return configuredConsents.some(matchPredicate)||configuredConsents.length===0;case'and':default:return configuredConsents.every(matchPredicate);}// Legacy cookie consent management
// TODO: To be removed once the source config API is updated to support generic consent management
                }else if(oneTrustCookieCategories){// Change the structure of oneTrustConsentGroup as an array and filter values if empty string
// Eg:
// ["Performance Cookies", "Functional Cookies"]
                    var _configuredConsents=oneTrustCookieCategories.map(function(c){return c.oneTrustCookieCategory.trim();}).filter(function(n){return n;});// Check if all the destination's mapped cookie categories are consented by the user in the browser.
                    return _configuredConsents.every(matchPredicate);}// If there are no consents configured for the destination for the current provider, events should be sent.
                return true;}catch(err){errorHandler===null||errorHandler===void 0||errorHandler.onError(err,ONETRUST_CONSENT_MANAGER_PLUGIN,DESTINATION_CONSENT_STATUS_ERROR);return true;}}}};};

    var pluginName$3='StorageEncryption';var StorageEncryption=function StorageEncryption(){return {name:pluginName$3,initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$3]);},storage:{encrypt:function encrypt(value){return encrypt$1(value);},decrypt:function decrypt(value){return decrypt$1(value);}}};};

    var _ref,_ref2,_ref3,_ref4,_ref5;/* eslint-disable no-use-before-define */var crypto$1=((_ref=typeof globalThis!='undefined'?globalThis:void 0)===null||_ref===void 0?void 0:_ref.crypto)||((_ref2=typeof global!='undefined'?global:void 0)===null||_ref2===void 0?void 0:_ref2.crypto)||((_ref3=typeof window!='undefined'?window:void 0)===null||_ref3===void 0?void 0:_ref3.crypto)||((_ref4=typeof self!='undefined'?self:void 0)===null||_ref4===void 0?void 0:_ref4.crypto)||((_ref5=typeof frames!='undefined'?frames:void 0)===null||_ref5===void 0||(_ref5=_ref5[0])===null||_ref5===void 0?void 0:_ref5.crypto);var randomWordArray;if(crypto$1){randomWordArray=function randomWordArray(nBytes){var words=[];for(var i=0,rcache;i<nBytes;i+=4){words.push(crypto$1.getRandomValues(new Uint32Array(1))[0]);}return new WordArray(words,nBytes);};}else {// Because there is no global crypto property in this context, cryptographically unsafe Math.random() is used.
        randomWordArray=function randomWordArray(nBytes){var words=[];var r=function r(m_w){var _m_w=m_w;var _m_z=0x3ade68b1;var mask=0xffffffff;return function(){_m_z=0x9069*(_m_z&0xFFFF)+(_m_z>>0x10)&mask;_m_w=0x4650*(_m_w&0xFFFF)+(_m_w>>0x10)&mask;var result=(_m_z<<0x10)+_m_w&mask;result/=0x100000000;result+=0.5;return result*(Math.random()>0.5?1:-1);};};for(var i=0,rcache;i<nBytes;i+=4){var _r=r((rcache||Math.random())*0x100000000);rcache=_r()*0x3ade67b7;words.push(_r()*0x100000000|0);}return new WordArray(words,nBytes);};}/**
     * Base class for inheritance.
     */var Base=/*#__PURE__*/function(){function Base(){_classCallCheck(this,Base);}_createClass(Base,[{key:"mixIn",value:/**
         * Copies properties into this object.
         *
         * @param {Object} properties The properties to mix in.
         *
         * @example
         *
         *     MyType.mixIn({
         *         field: 'value'
         *     });
         */function mixIn(properties){return Object.assign(this,properties);}/**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = instance.clone();
         */},{key:"clone",value:function clone(){var clone=new this.constructor();Object.assign(clone,this);return clone;}}],[{key:"create",value:/**
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
         */function create(){for(var _len=arguments.length,args=new Array(_len),_key2=0;_key2<_len;_key2++){args[_key2]=arguments[_key2];}return _construct(this,args);}}]);return Base;}();/**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */var WordArray=/*#__PURE__*/function(_Base){_inherits(WordArray,_Base);var _super=_createSuper(WordArray);/**
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
     */function WordArray(){var _this;var words=arguments.length>0&&arguments[0]!==undefined?arguments[0]:[];var sigBytes=arguments.length>1&&arguments[1]!==undefined?arguments[1]:words.length*4;_classCallCheck(this,WordArray);_this=_super.call(this);var typedArray=words;// Convert buffers to uint8
        if(typedArray instanceof ArrayBuffer){typedArray=new Uint8Array(typedArray);}// Convert other array views to uint8
        if(typedArray instanceof Int8Array||typedArray instanceof Uint8ClampedArray||typedArray instanceof Int16Array||typedArray instanceof Uint16Array||typedArray instanceof Int32Array||typedArray instanceof Uint32Array||typedArray instanceof Float32Array||typedArray instanceof Float64Array){typedArray=new Uint8Array(typedArray.buffer,typedArray.byteOffset,typedArray.byteLength);}// Handle Uint8Array
        if(typedArray instanceof Uint8Array){// Shortcut
            var typedArrayByteLength=typedArray.byteLength;// Extract bytes
            var _words=[];for(var i=0;i<typedArrayByteLength;i+=1){_words[i>>>2]|=typedArray[i]<<24-i%4*8;}// Initialize this word array
            _this.words=_words;_this.sigBytes=typedArrayByteLength;}else {// Else call normal init
            _this.words=words;_this.sigBytes=sigBytes;}return _this;}/**
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
     */_createClass(WordArray,[{key:"toString",value:/**
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
         */function toString(){var encoder=arguments.length>0&&arguments[0]!==undefined?arguments[0]:Hex;return encoder.stringify(this);}/**
         * Concatenates a word array to this word array.
         *
         * @param {WordArray} wordArray The word array to append.
         *
         * @return {WordArray} This word array.
         *
         * @example
         *
         *     wordArray1.concat(wordArray2);
         */},{key:"concat",value:function concat(wordArray){// Shortcuts
            var thisWords=this.words;var thatWords=wordArray.words;var thisSigBytes=this.sigBytes;var thatSigBytes=wordArray.sigBytes;// Clamp excess bits
            this.clamp();// Concat
            if(thisSigBytes%4){// Copy one byte at a time
                for(var i=0;i<thatSigBytes;i+=1){var thatByte=thatWords[i>>>2]>>>24-i%4*8&0xff;thisWords[thisSigBytes+i>>>2]|=thatByte<<24-(thisSigBytes+i)%4*8;}}else {// Copy one word at a time
                for(var _i=0;_i<thatSigBytes;_i+=4){thisWords[thisSigBytes+_i>>>2]=thatWords[_i>>>2];}}this.sigBytes+=thatSigBytes;// Chainable
            return this;}/**
         * Removes insignificant bits.
         *
         * @example
         *
         *     wordArray.clamp();
         */},{key:"clamp",value:function clamp(){// Shortcuts
            var words=this.words,sigBytes=this.sigBytes;// Clamp
            words[sigBytes>>>2]&=0xffffffff<<32-sigBytes%4*8;words.length=Math.ceil(sigBytes/4);}/**
         * Creates a copy of this word array.
         *
         * @return {WordArray} The clone.
         *
         * @example
         *
         *     var clone = wordArray.clone();
         */},{key:"clone",value:function clone(){var clone=_get(_getPrototypeOf(WordArray.prototype),"clone",this).call(this);clone.words=this.words.slice(0);return clone;}}]);return WordArray;}(Base);/**
     * Hex encoding strategy.
     */_defineProperty(WordArray,"random",randomWordArray);var Hex={/**
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
            var words=wordArray.words,sigBytes=wordArray.sigBytes;// Convert
            var hexChars=[];for(var i=0;i<sigBytes;i+=1){var bite=words[i>>>2]>>>24-i%4*8&0xff;hexChars.push((bite>>>4).toString(16));hexChars.push((bite&0x0f).toString(16));}return hexChars.join('');},/**
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
            var words=[];for(var i=0;i<hexStrLength;i+=2){words[i>>>3]|=parseInt(hexStr.substr(i,2),16)<<24-i%8*4;}return new WordArray(words,hexStrLength/2);}};/**
     * Latin1 encoding strategy.
     */var Latin1={/**
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
            var words=wordArray.words,sigBytes=wordArray.sigBytes;// Convert
            var latin1Chars=[];for(var i=0;i<sigBytes;i+=1){var bite=words[i>>>2]>>>24-i%4*8&0xff;latin1Chars.push(String.fromCharCode(bite));}return latin1Chars.join('');},/**
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
            var words=[];for(var i=0;i<latin1StrLength;i+=1){words[i>>>2]|=(latin1Str.charCodeAt(i)&0xff)<<24-i%4*8;}return new WordArray(words,latin1StrLength);}};/**
     * UTF-8 encoding strategy.
     */var Utf8={/**
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
     * @property {number} _minBufferSize
     *
     *     The number of blocks that should be kept unprocessed in the buffer. Default: 0
     */var BufferedBlockAlgorithm=/*#__PURE__*/function(_Base2){_inherits(BufferedBlockAlgorithm,_Base2);var _super2=_createSuper(BufferedBlockAlgorithm);function BufferedBlockAlgorithm(){var _this2;_classCallCheck(this,BufferedBlockAlgorithm);_this2=_super2.call(this);_this2._minBufferSize=0;return _this2;}/**
     * Resets this block algorithm's data buffer to its initial state.
     *
     * @example
     *
     *     bufferedBlockAlgorithm.reset();
     */_createClass(BufferedBlockAlgorithm,[{key:"reset",value:function reset(){// Initial values
            this._data=new WordArray();this._nDataBytes=0;}/**
         * Adds new data to this block algorithm's buffer.
         *
         * @param {WordArray|string} data
         *
         *     The data to append. Strings are converted to a WordArray using UTF-8.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._append('data');
         *     bufferedBlockAlgorithm._append(wordArray);
         */},{key:"_append",value:function _append(data){var m_data=data;// Convert string to WordArray, else assume WordArray already
            if(typeof m_data==='string'){m_data=Utf8.parse(m_data);}// Append
            this._data.concat(m_data);this._nDataBytes+=m_data.sigBytes;}/**
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
         */},{key:"_process",value:function _process(doFlush){var processedWords;// Shortcuts
            var data=this._data,blockSize=this.blockSize;var dataWords=data.words;var dataSigBytes=data.sigBytes;var blockSizeBytes=blockSize*4;// Count blocks ready
            var nBlocksReady=dataSigBytes/blockSizeBytes;if(doFlush){// Round up to include partial blocks
                nBlocksReady=Math.ceil(nBlocksReady);}else {// Round down to include only full blocks,
// less the number of blocks that must remain in the buffer
                nBlocksReady=Math.max((nBlocksReady|0)-this._minBufferSize,0);}// Count words ready
            var nWordsReady=nBlocksReady*blockSize;// Count bytes ready
            var nBytesReady=Math.min(nWordsReady*4,dataSigBytes);// Process blocks
            if(nWordsReady){for(var offset=0;offset<nWordsReady;offset+=blockSize){// Perform concrete-algorithm logic
                this._doProcessBlock(dataWords,offset);}// Remove processed words
                processedWords=dataWords.splice(0,nWordsReady);data.sigBytes-=nBytesReady;}// Return processed words
            return new WordArray(processedWords,nBytesReady);}/**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = bufferedBlockAlgorithm.clone();
         */},{key:"clone",value:function clone(){var clone=_get(_getPrototypeOf(BufferedBlockAlgorithm.prototype),"clone",this).call(this);clone._data=this._data.clone();return clone;}}]);return BufferedBlockAlgorithm;}(Base);/**
     * Abstract hasher template.
     *
     * @property {number} blockSize
     *
     *     The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
     */var Hasher=/*#__PURE__*/function(_BufferedBlockAlgorit){_inherits(Hasher,_BufferedBlockAlgorit);var _super3=_createSuper(Hasher);function Hasher(cfg){var _this3;_classCallCheck(this,Hasher);_this3=_super3.call(this);_this3.blockSize=512/32;/**
     * Configuration options.
     */_this3.cfg=Object.assign(new Base(),cfg);// Set initial values
        _this3.reset();return _this3;}/**
     * Creates a shortcut function to a hasher's object interface.
     *
     * @param {Hasher} SubHasher The hasher to create a helper for.
     *
     * @return {Function} The shortcut function.
     *
     * @static
     *
     * @example
     *
     *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
     */_createClass(Hasher,[{key:"reset",value:/**
         * Resets this hasher to its initial state.
         *
         * @example
         *
         *     hasher.reset();
         */function reset(){// Reset data buffer
            _get(_getPrototypeOf(Hasher.prototype),"reset",this).call(this);// Perform concrete-hasher logic
            this._doReset();}/**
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
         */},{key:"update",value:function update(messageUpdate){// Append
            this._append(messageUpdate);// Update the hash
            this._process();// Chainable
            return this;}/**
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
         */},{key:"finalize",value:function finalize(messageUpdate){// Final message update
            if(messageUpdate){this._append(messageUpdate);}// Perform concrete-hasher logic
            var hash=this._doFinalize();return hash;}}],[{key:"_createHelper",value:function _createHelper(SubHasher){return function(message,cfg){return new SubHasher(cfg).finalize(message);};}/**
         * Creates a shortcut function to the HMAC's object interface.
         *
         * @param {Hasher} SubHasher The hasher to use in this HMAC helper.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
         */},{key:"_createHmacHelper",value:function _createHmacHelper(SubHasher){return function(message,key){return new HMAC(SubHasher,key).finalize(message);};}}]);return Hasher;}(BufferedBlockAlgorithm);/**
     * HMAC algorithm.
     */var HMAC=/*#__PURE__*/function(_Base3){_inherits(HMAC,_Base3);var _super4=_createSuper(HMAC);/**
     * Initializes a newly created HMAC.
     *
     * @param {Hasher} SubHasher The hash algorithm to use.
     * @param {WordArray|string} key The secret key.
     *
     * @example
     *
     *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
     */function HMAC(SubHasher,key){var _this4;_classCallCheck(this,HMAC);_this4=_super4.call(this);var hasher=new SubHasher();_this4._hasher=hasher;// Convert string to WordArray, else assume WordArray already
        var _key=key;if(typeof _key==='string'){_key=Utf8.parse(_key);}// Shortcuts
        var hasherBlockSize=hasher.blockSize;var hasherBlockSizeBytes=hasherBlockSize*4;// Allow arbitrary length keys
        if(_key.sigBytes>hasherBlockSizeBytes){_key=hasher.finalize(key);}// Clamp excess bits
        _key.clamp();// Clone key for inner and outer pads
        var oKey=_key.clone();_this4._oKey=oKey;var iKey=_key.clone();_this4._iKey=iKey;// Shortcuts
        var oKeyWords=oKey.words;var iKeyWords=iKey.words;// XOR keys with pad constants
        for(var i=0;i<hasherBlockSize;i+=1){oKeyWords[i]^=0x5c5c5c5c;iKeyWords[i]^=0x36363636;}oKey.sigBytes=hasherBlockSizeBytes;iKey.sigBytes=hasherBlockSizeBytes;// Set initial values
        _this4.reset();return _this4;}/**
     * Resets this HMAC to its initial state.
     *
     * @example
     *
     *     hmacHasher.reset();
     */_createClass(HMAC,[{key:"reset",value:function reset(){// Shortcut
            var hasher=this._hasher;// Reset
            hasher.reset();hasher.update(this._iKey);}/**
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
         */},{key:"update",value:function update(messageUpdate){this._hasher.update(messageUpdate);// Chainable
            return this;}/**
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
         */},{key:"finalize",value:function finalize(messageUpdate){// Shortcut
            var hasher=this._hasher;// Compute HMAC
            var innerHash=hasher.finalize(messageUpdate);hasher.reset();var hmac=hasher.finalize(this._oKey.clone().concat(innerHash));return hmac;}}]);return HMAC;}(Base);

    var parseLoop=function parseLoop(base64Str,base64StrLength,reverseMap){var words=[];var nBytes=0;for(var i=0;i<base64StrLength;i+=1){if(i%4){var bits1=reverseMap[base64Str.charCodeAt(i-1)]<<i%4*2;var bits2=reverseMap[base64Str.charCodeAt(i)]>>>6-i%4*2;var bitsCombined=bits1|bits2;words[nBytes>>>2]|=bitsCombined<<24-nBytes%4*8;nBytes+=1;}}return WordArray.create(words,nBytes);};/**
     * Base64 encoding strategy.
     */var Base64={/**
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
         *     const base64String = CryptoJS.enc.Base64.stringify(wordArray);
         */stringify:function stringify(wordArray){// Shortcuts
            var words=wordArray.words,sigBytes=wordArray.sigBytes;var map=this._map;// Clamp excess bits
            wordArray.clamp();// Convert
            var base64Chars=[];for(var i=0;i<sigBytes;i+=3){var byte1=words[i>>>2]>>>24-i%4*8&0xff;var byte2=words[i+1>>>2]>>>24-(i+1)%4*8&0xff;var byte3=words[i+2>>>2]>>>24-(i+2)%4*8&0xff;var triplet=byte1<<16|byte2<<8|byte3;for(var j=0;j<4&&i+j*0.75<sigBytes;j+=1){base64Chars.push(map.charAt(triplet>>>6*(3-j)&0x3f));}}// Add padding
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
         *     const wordArray = CryptoJS.enc.Base64.parse(base64String);
         */parse:function parse(base64Str){// Shortcuts
            var base64StrLength=base64Str.length;var map=this._map;var reverseMap=this._reverseMap;if(!reverseMap){this._reverseMap=[];reverseMap=this._reverseMap;for(var j=0;j<map.length;j+=1){reverseMap[map.charCodeAt(j)]=j;}}// Ignore padding
            var paddingChar=map.charAt(64);if(paddingChar){var paddingIndex=base64Str.indexOf(paddingChar);if(paddingIndex!==-1){base64StrLength=paddingIndex;}}// Convert
            return parseLoop(base64Str,base64StrLength,reverseMap);},_map:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='};

    var T=[];// Compute constants
    for(var i$1=0;i$1<64;i$1+=1){T[i$1]=Math.abs(Math.sin(i$1+1))*0x100000000|0;}var FF=function FF(a,b,c,d,x,s,t){var n=a+(b&c|~b&d)+x+t;return (n<<s|n>>>32-s)+b;};var GG=function GG(a,b,c,d,x,s,t){var n=a+(b&d|c&~d)+x+t;return (n<<s|n>>>32-s)+b;};var HH=function HH(a,b,c,d,x,s,t){var n=a+(b^c^d)+x+t;return (n<<s|n>>>32-s)+b;};var II=function II(a,b,c,d,x,s,t){var n=a+(c^(b|~d))+x+t;return (n<<s|n>>>32-s)+b;};/**
     * MD5 hash algorithm.
     */var MD5Algo=/*#__PURE__*/function(_Hasher){_inherits(MD5Algo,_Hasher);var _super=_createSuper(MD5Algo);function MD5Algo(){_classCallCheck(this,MD5Algo);return _super.apply(this,arguments);}_createClass(MD5Algo,[{key:"_doReset",value:function _doReset(){this._hash=new WordArray([0x67452301,0xefcdab89,0x98badcfe,0x10325476]);}},{key:"_doProcessBlock",value:function _doProcessBlock(M,offset){var _M=M;// Swap endian
            for(var _i=0;_i<16;_i+=1){// Shortcuts
                var offset_i=offset+_i;var M_offset_i=M[offset_i];_M[offset_i]=(M_offset_i<<8|M_offset_i>>>24)&0x00ff00ff|(M_offset_i<<24|M_offset_i>>>8)&0xff00ff00;}// Shortcuts
            var H=this._hash.words;var M_offset_0=_M[offset+0];var M_offset_1=_M[offset+1];var M_offset_2=_M[offset+2];var M_offset_3=_M[offset+3];var M_offset_4=_M[offset+4];var M_offset_5=_M[offset+5];var M_offset_6=_M[offset+6];var M_offset_7=_M[offset+7];var M_offset_8=_M[offset+8];var M_offset_9=_M[offset+9];var M_offset_10=_M[offset+10];var M_offset_11=_M[offset+11];var M_offset_12=_M[offset+12];var M_offset_13=_M[offset+13];var M_offset_14=_M[offset+14];var M_offset_15=_M[offset+15];// Working varialbes
            var a=H[0];var b=H[1];var c=H[2];var d=H[3];// Computation
            a=FF(a,b,c,d,M_offset_0,7,T[0]);d=FF(d,a,b,c,M_offset_1,12,T[1]);c=FF(c,d,a,b,M_offset_2,17,T[2]);b=FF(b,c,d,a,M_offset_3,22,T[3]);a=FF(a,b,c,d,M_offset_4,7,T[4]);d=FF(d,a,b,c,M_offset_5,12,T[5]);c=FF(c,d,a,b,M_offset_6,17,T[6]);b=FF(b,c,d,a,M_offset_7,22,T[7]);a=FF(a,b,c,d,M_offset_8,7,T[8]);d=FF(d,a,b,c,M_offset_9,12,T[9]);c=FF(c,d,a,b,M_offset_10,17,T[10]);b=FF(b,c,d,a,M_offset_11,22,T[11]);a=FF(a,b,c,d,M_offset_12,7,T[12]);d=FF(d,a,b,c,M_offset_13,12,T[13]);c=FF(c,d,a,b,M_offset_14,17,T[14]);b=FF(b,c,d,a,M_offset_15,22,T[15]);a=GG(a,b,c,d,M_offset_1,5,T[16]);d=GG(d,a,b,c,M_offset_6,9,T[17]);c=GG(c,d,a,b,M_offset_11,14,T[18]);b=GG(b,c,d,a,M_offset_0,20,T[19]);a=GG(a,b,c,d,M_offset_5,5,T[20]);d=GG(d,a,b,c,M_offset_10,9,T[21]);c=GG(c,d,a,b,M_offset_15,14,T[22]);b=GG(b,c,d,a,M_offset_4,20,T[23]);a=GG(a,b,c,d,M_offset_9,5,T[24]);d=GG(d,a,b,c,M_offset_14,9,T[25]);c=GG(c,d,a,b,M_offset_3,14,T[26]);b=GG(b,c,d,a,M_offset_8,20,T[27]);a=GG(a,b,c,d,M_offset_13,5,T[28]);d=GG(d,a,b,c,M_offset_2,9,T[29]);c=GG(c,d,a,b,M_offset_7,14,T[30]);b=GG(b,c,d,a,M_offset_12,20,T[31]);a=HH(a,b,c,d,M_offset_5,4,T[32]);d=HH(d,a,b,c,M_offset_8,11,T[33]);c=HH(c,d,a,b,M_offset_11,16,T[34]);b=HH(b,c,d,a,M_offset_14,23,T[35]);a=HH(a,b,c,d,M_offset_1,4,T[36]);d=HH(d,a,b,c,M_offset_4,11,T[37]);c=HH(c,d,a,b,M_offset_7,16,T[38]);b=HH(b,c,d,a,M_offset_10,23,T[39]);a=HH(a,b,c,d,M_offset_13,4,T[40]);d=HH(d,a,b,c,M_offset_0,11,T[41]);c=HH(c,d,a,b,M_offset_3,16,T[42]);b=HH(b,c,d,a,M_offset_6,23,T[43]);a=HH(a,b,c,d,M_offset_9,4,T[44]);d=HH(d,a,b,c,M_offset_12,11,T[45]);c=HH(c,d,a,b,M_offset_15,16,T[46]);b=HH(b,c,d,a,M_offset_2,23,T[47]);a=II(a,b,c,d,M_offset_0,6,T[48]);d=II(d,a,b,c,M_offset_7,10,T[49]);c=II(c,d,a,b,M_offset_14,15,T[50]);b=II(b,c,d,a,M_offset_5,21,T[51]);a=II(a,b,c,d,M_offset_12,6,T[52]);d=II(d,a,b,c,M_offset_3,10,T[53]);c=II(c,d,a,b,M_offset_10,15,T[54]);b=II(b,c,d,a,M_offset_1,21,T[55]);a=II(a,b,c,d,M_offset_8,6,T[56]);d=II(d,a,b,c,M_offset_15,10,T[57]);c=II(c,d,a,b,M_offset_6,15,T[58]);b=II(b,c,d,a,M_offset_13,21,T[59]);a=II(a,b,c,d,M_offset_4,6,T[60]);d=II(d,a,b,c,M_offset_11,10,T[61]);c=II(c,d,a,b,M_offset_2,15,T[62]);b=II(b,c,d,a,M_offset_9,21,T[63]);// Intermediate hash value
            H[0]=H[0]+a|0;H[1]=H[1]+b|0;H[2]=H[2]+c|0;H[3]=H[3]+d|0;}/* eslint-ensable no-param-reassign */},{key:"_doFinalize",value:function _doFinalize(){// Shortcuts
            var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;// Add padding
            dataWords[nBitsLeft>>>5]|=0x80<<24-nBitsLeft%32;var nBitsTotalH=Math.floor(nBitsTotal/0x100000000);var nBitsTotalL=nBitsTotal;dataWords[(nBitsLeft+64>>>9<<4)+15]=(nBitsTotalH<<8|nBitsTotalH>>>24)&0x00ff00ff|(nBitsTotalH<<24|nBitsTotalH>>>8)&0xff00ff00;dataWords[(nBitsLeft+64>>>9<<4)+14]=(nBitsTotalL<<8|nBitsTotalL>>>24)&0x00ff00ff|(nBitsTotalL<<24|nBitsTotalL>>>8)&0xff00ff00;data.sigBytes=(dataWords.length+1)*4;// Hash final blocks
            this._process();// Shortcuts
            var hash=this._hash;var H=hash.words;// Swap endian
            for(var _i2=0;_i2<4;_i2+=1){// Shortcut
                var H_i=H[_i2];H[_i2]=(H_i<<8|H_i>>>24)&0x00ff00ff|(H_i<<24|H_i>>>8)&0xff00ff00;}// Return final computed hash
            return hash;}},{key:"clone",value:function clone(){var clone=_get(_getPrototypeOf(MD5Algo.prototype),"clone",this).call(this);clone._hash=this._hash.clone();return clone;}}]);return MD5Algo;}(Hasher);/**
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
     */Hasher._createHelper(MD5Algo);/**
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
     */Hasher._createHmacHelper(MD5Algo);

    /**
     * This key derivation function is meant to conform with EVP_BytesToKey.
     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
     */var EvpKDFAlgo=/*#__PURE__*/function(_Base){_inherits(EvpKDFAlgo,_Base);var _super=_createSuper(EvpKDFAlgo);/**
     * Initializes a newly created key derivation function.
     *
     * @param {Object} cfg (Optional) The configuration options to use for the derivation.
     *
     * @example
     *
     *     const kdf = CryptoJS.algo.EvpKDF.create();
     *     const kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
     *     const kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
     */function EvpKDFAlgo(cfg){var _this;_classCallCheck(this,EvpKDFAlgo);_this=_super.call(this);/**
     * Configuration options.
     *
     * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
     * @property {Hasher} hasher The hash algorithm to use. Default: MD5
     * @property {number} iterations The number of iterations to perform. Default: 1
     */_this.cfg=Object.assign(new Base(),{keySize:128/32,hasher:MD5Algo,iterations:1},cfg);return _this;}/**
     * Derives a key from a password.
     *
     * @param {WordArray|string} password The password.
     * @param {WordArray|string} salt A salt.
     *
     * @return {WordArray} The derived key.
     *
     * @example
     *
     *     const key = kdf.compute(password, salt);
     */_createClass(EvpKDFAlgo,[{key:"compute",value:function compute(password,salt){var block;// Shortcut
            var cfg=this.cfg;// Init hasher
            var hasher=cfg.hasher.create();// Initial values
            var derivedKey=WordArray.create();// Shortcuts
            var derivedKeyWords=derivedKey.words;var keySize=cfg.keySize,iterations=cfg.iterations;// Generate key
            while(derivedKeyWords.length<keySize){if(block){hasher.update(block);}block=hasher.update(password).finalize(salt);hasher.reset();// Iterations
                for(var i=1;i<iterations;i+=1){block=hasher.finalize(block);hasher.reset();}derivedKey.concat(block);}derivedKey.sigBytes=keySize*4;return derivedKey;}}]);return EvpKDFAlgo;}(Base);

    var ObjectAssign=typeof Object.assign!=="function"?function(target){if(target==null){throw new TypeError('Cannot convert undefined or null to object');}target=Object(target);for(var index=1;index<arguments.length;index++){var source=arguments[index];if(source!=null){for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}}return target;}:Object.assign;/**
     * Abstract base cipher template.
     *
     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
     */var Cipher=/*#__PURE__*/function(_BufferedBlockAlgorit){_inherits(Cipher,_BufferedBlockAlgorit);var _super=_createSuper(Cipher);/**
     * Initializes a newly created cipher.
     *
     * @param {number} xformMode Either the encryption or decryption transormation mode constant.
     * @param {WordArray} key The key.
     * @param {Object} cfg (Optional) The configuration options to use for this operation.
     *
     * @example
     *
     *     const cipher = CryptoJS.algo.AES.create(
     *       CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray }
     *     );
     */function Cipher(xformMode,key,cfg){var _this;_classCallCheck(this,Cipher);_this=_super.call(this);/**
     * Configuration options.
     *
     * @property {WordArray} iv The IV to use for this operation.
     */_this.cfg=ObjectAssign(new Base(),cfg);// Store transform mode and key
        _this._xformMode=xformMode;_this._key=key;// Set initial values
        _this.reset();return _this;}/**
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
     *     const cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
     */_createClass(Cipher,[{key:"reset",value:/**
         * Resets this cipher to its initial state.
         *
         * @example
         *
         *     cipher.reset();
         */function reset(){// Reset data buffer
            _get(_getPrototypeOf(Cipher.prototype),"reset",this).call(this);// Perform concrete-cipher logic
            this._doReset();}/**
         * Adds data to be encrypted or decrypted.
         *
         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
         *
         * @return {WordArray} The data after processing.
         *
         * @example
         *
         *     const encrypted = cipher.process('data');
         *     const encrypted = cipher.process(wordArray);
         */},{key:"process",value:function process(dataUpdate){// Append
            this._append(dataUpdate);// Process available blocks
            return this._process();}/**
         * Finalizes the encryption or decryption process.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
         *
         * @return {WordArray} The data after final processing.
         *
         * @example
         *
         *     const encrypted = cipher.finalize();
         *     const encrypted = cipher.finalize('data');
         *     const encrypted = cipher.finalize(wordArray);
         */},{key:"finalize",value:function finalize(dataUpdate){// Final data update
            if(dataUpdate){this._append(dataUpdate);}// Perform concrete-cipher logic
            var finalProcessedData=this._doFinalize();return finalProcessedData;}}],[{key:"createEncryptor",value:function createEncryptor(key,cfg){return this.create(this._ENC_XFORM_MODE,key,cfg);}/**
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
         *     const cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
         */},{key:"createDecryptor",value:function createDecryptor(key,cfg){return this.create(this._DEC_XFORM_MODE,key,cfg);}/**
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
         *     const AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
         */},{key:"_createHelper",value:function _createHelper(SubCipher){var selectCipherStrategy=function selectCipherStrategy(key){if(typeof key==='string'){return PasswordBasedCipher;}return SerializableCipher;};return {encrypt:function encrypt(message,key,cfg){return selectCipherStrategy(key).encrypt(SubCipher,message,key,cfg);},decrypt:function decrypt(ciphertext,key,cfg){return selectCipherStrategy(key).decrypt(SubCipher,ciphertext,key,cfg);}};}}]);return Cipher;}(BufferedBlockAlgorithm);Cipher._ENC_XFORM_MODE=1;Cipher._DEC_XFORM_MODE=2;Cipher.keySize=128/32;Cipher.ivSize=128/32;/**
     * Abstract base block cipher mode template.
     */var BlockCipherMode=/*#__PURE__*/function(_Base){_inherits(BlockCipherMode,_Base);var _super3=_createSuper(BlockCipherMode);/**
     * Initializes a newly created mode.
     *
     * @param {Cipher} cipher A block cipher instance.
     * @param {Array} iv The IV words.
     *
     * @example
     *
     *     const mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
     */function BlockCipherMode(cipher,iv){var _this3;_classCallCheck(this,BlockCipherMode);_this3=_super3.call(this);_this3._cipher=cipher;_this3._iv=iv;return _this3;}/**
     * Creates this mode for encryption.
     *
     * @param {Cipher} cipher A block cipher instance.
     * @param {Array} iv The IV words.
     *
     * @static
     *
     * @example
     *
     *     const mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
     */_createClass(BlockCipherMode,null,[{key:"createEncryptor",value:function createEncryptor(cipher,iv){return this.Encryptor.create(cipher,iv);}/**
         * Creates this mode for decryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @static
         *
         * @example
         *
         *     const mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
         */},{key:"createDecryptor",value:function createDecryptor(cipher,iv){return this.Decryptor.create(cipher,iv);}}]);return BlockCipherMode;}(Base);function xorBlock(words,offset,blockSize){var _words=words;var block;// Shortcut
        var iv=this._iv;// Choose mixing block
        if(iv){block=iv;// Remove IV for subsequent blocks
            this._iv=undefined;}else {block=this._prevBlock;}// XOR blocks
        for(var i=0;i<blockSize;i+=1){_words[offset+i]^=block[i];}}/**
     * Cipher Block Chaining mode.
     */ /**
     * Abstract base CBC mode.
     */var CBC=/*#__PURE__*/function(_BlockCipherMode){_inherits(CBC,_BlockCipherMode);var _super4=_createSuper(CBC);function CBC(){_classCallCheck(this,CBC);return _super4.apply(this,arguments);}return _createClass(CBC);}(BlockCipherMode);/**
     * CBC encryptor.
     */CBC.Encryptor=/*#__PURE__*/function(_CBC){_inherits(_class,_CBC);var _super5=_createSuper(_class);function _class(){_classCallCheck(this,_class);return _super5.apply(this,arguments);}_createClass(_class,[{key:"processBlock",value:/**
         * Processes the data block at offset.
         *
         * @param {Array} words The data words to operate on.
         * @param {number} offset The offset where the block starts.
         *
         * @example
         *
         *     mode.processBlock(data.words, offset);
         */function processBlock(words,offset){// Shortcuts
            var cipher=this._cipher;var blockSize=cipher.blockSize;// XOR and encrypt
            xorBlock.call(this,words,offset,blockSize);cipher.encryptBlock(words,offset);// Remember this block to use with next block
            this._prevBlock=words.slice(offset,offset+blockSize);}}]);return _class;}(CBC);/**
     * CBC decryptor.
     */CBC.Decryptor=/*#__PURE__*/function(_CBC2){_inherits(_class2,_CBC2);var _super6=_createSuper(_class2);function _class2(){_classCallCheck(this,_class2);return _super6.apply(this,arguments);}_createClass(_class2,[{key:"processBlock",value:/**
         * Processes the data block at offset.
         *
         * @param {Array} words The data words to operate on.
         * @param {number} offset The offset where the block starts.
         *
         * @example
         *
         *     mode.processBlock(data.words, offset);
         */function processBlock(words,offset){// Shortcuts
            var cipher=this._cipher;var blockSize=cipher.blockSize;// Remember this block to use with next block
            var thisBlock=words.slice(offset,offset+blockSize);// Decrypt and XOR
            cipher.decryptBlock(words,offset);xorBlock.call(this,words,offset,blockSize);// This block becomes the previous block
            this._prevBlock=thisBlock;}}]);return _class2;}(CBC);/**
     * PKCS #5/7 padding strategy.
     */var Pkcs7={/**
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
         */unpad:function unpad(data){var _data=data;// Get number of padding bytes from last byte
            var nPaddingBytes=_data.words[_data.sigBytes-1>>>2]&0xff;// Remove padding
            _data.sigBytes-=nPaddingBytes;}};/**
     * Abstract base block cipher template.
     *
     * @property {number} blockSize
     *
     *    The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
     */var BlockCipher=/*#__PURE__*/function(_Cipher2){_inherits(BlockCipher,_Cipher2);var _super7=_createSuper(BlockCipher);function BlockCipher(xformMode,key,cfg){var _this4;_classCallCheck(this,BlockCipher);/**
     * Configuration options.
     *
     * @property {Mode} mode The block mode to use. Default: CBC
     * @property {Padding} padding The padding strategy to use. Default: Pkcs7
     */_this4=_super7.call(this,xformMode,key,ObjectAssign({mode:CBC,padding:Pkcs7},cfg));_this4.blockSize=128/32;return _this4;}_createClass(BlockCipher,[{key:"reset",value:function reset(){var modeCreator;// Reset cipher
            _get(_getPrototypeOf(BlockCipher.prototype),"reset",this).call(this);// Shortcuts
            var cfg=this.cfg;var iv=cfg.iv,mode=cfg.mode;// Reset block mode
            if(this._xformMode===this.constructor._ENC_XFORM_MODE){modeCreator=mode.createEncryptor;}else/* if (this._xformMode == this._DEC_XFORM_MODE) */{modeCreator=mode.createDecryptor;// Keep at least one block in the buffer for unpadding
                this._minBufferSize=1;}this._mode=modeCreator.call(mode,this,iv&&iv.words);this._mode.__creator=modeCreator;}},{key:"_doProcessBlock",value:function _doProcessBlock(words,offset){this._mode.processBlock(words,offset);}},{key:"_doFinalize",value:function _doFinalize(){var finalProcessedBlocks;// Shortcut
            var padding=this.cfg.padding;// Finalize
            if(this._xformMode===this.constructor._ENC_XFORM_MODE){// Pad data
                padding.pad(this._data,this.blockSize);// Process final blocks
                finalProcessedBlocks=this._process(!!'flush');}else/* if (this._xformMode == this._DEC_XFORM_MODE) */{// Process final blocks
                finalProcessedBlocks=this._process(!!'flush');// Unpad data
                padding.unpad(finalProcessedBlocks);}return finalProcessedBlocks;}}]);return BlockCipher;}(Cipher);/**
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
     * @property {Format} formatter
     *    The default formatting strategy to convert this cipher params object to a string.
     */var CipherParams=/*#__PURE__*/function(_Base2){_inherits(CipherParams,_Base2);var _super8=_createSuper(CipherParams);/**
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
     */function CipherParams(cipherParams){var _this5;_classCallCheck(this,CipherParams);_this5=_super8.call(this);_this5.mixIn(cipherParams);return _this5;}/**
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
     */_createClass(CipherParams,[{key:"toString",value:function toString(formatter){return (formatter||this.formatter).stringify(this);}}]);return CipherParams;}(Base);/**
     * OpenSSL formatting strategy.
     */var OpenSSLFormatter={/**
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
            var ciphertext=cipherParams.ciphertext,salt=cipherParams.salt;// Format
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
            if(ciphertextWords[0]===0x53616c74&&ciphertextWords[1]===0x65645f5f){// Extract salt
                salt=WordArray.create(ciphertextWords.slice(2,4));// Remove salt from ciphertext
                ciphertextWords.splice(0,4);ciphertext.sigBytes-=16;}return CipherParams.create({ciphertext:ciphertext,salt:salt});}};/**
     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
     */var SerializableCipher=/*#__PURE__*/function(_Base3){_inherits(SerializableCipher,_Base3);var _super9=_createSuper(SerializableCipher);function SerializableCipher(){_classCallCheck(this,SerializableCipher);return _super9.apply(this,arguments);}_createClass(SerializableCipher,null,[{key:"encrypt",value:/**
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
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher
         *       .encrypt(CryptoJS.algo.AES, message, key);
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher
         *       .encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher
         *       .encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         */function encrypt(cipher,message,key,cfg){// Apply config defaults
            var _cfg=ObjectAssign(new Base(),this.cfg,cfg);// Encrypt
            var encryptor=cipher.createEncryptor(key,_cfg);var ciphertext=encryptor.finalize(message);// Shortcut
            var cipherCfg=encryptor.cfg;// Create and return serializable cipher params
            return CipherParams.create({ciphertext:ciphertext,key:key,iv:cipherCfg.iv,algorithm:cipher,mode:cipherCfg.mode,padding:cipherCfg.padding,blockSize:encryptor.blockSize,formatter:_cfg.format});}/**
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
         *     var plaintext = CryptoJS.lib.SerializableCipher
         *       .decrypt(CryptoJS.algo.AES, formattedCiphertext, key,
         *         { iv: iv, format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.SerializableCipher
         *       .decrypt(CryptoJS.algo.AES, ciphertextParams, key,
         *         { iv: iv, format: CryptoJS.format.OpenSSL });
         */},{key:"decrypt",value:function decrypt(cipher,ciphertext,key,cfg){var _ciphertext=ciphertext;// Apply config defaults
            var _cfg=ObjectAssign(new Base(),this.cfg,cfg);// Convert string to CipherParams
            _ciphertext=this._parse(_ciphertext,_cfg.format);// Decrypt
            var plaintext=cipher.createDecryptor(key,_cfg).finalize(_ciphertext.ciphertext);return plaintext;}/**
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
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher
         *       ._parse(ciphertextStringOrParams, format);
         */},{key:"_parse",value:function _parse(ciphertext,format){if(typeof ciphertext==='string'){return format.parse(ciphertext,this);}return ciphertext;}}]);return SerializableCipher;}(Base);/**
     * Configuration options.
     *
     * @property {Formatter} format
     *
     *    The formatting strategy to convert cipher param objects to and from a string.
     *    Default: OpenSSL
     */SerializableCipher.cfg=ObjectAssign(new Base(),{format:OpenSSLFormatter});/**
     * OpenSSL key derivation function.
     */var OpenSSLKdf={/**
         * Derives a key and IV from a password.
         *
         * @param {string} password The password to derive from.
         * @param {number} keySize The size in words of the key to generate.
         * @param {number} ivSize The size in words of the IV to generate.
         * @param {WordArray|string} salt
         *     (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
         *
         * @return {CipherParams} A cipher params object with the key, IV, and salt.
         *
         * @static
         *
         * @example
         *
         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
         */execute:function execute(password,keySize,ivSize,salt,hasher){var _salt=salt;// Generate random salt
            if(!_salt){_salt=WordArray.random(64/8);}// Derive key and IV
            var key;if(!hasher){key=EvpKDFAlgo.create({keySize:keySize+ivSize}).compute(password,_salt);}else {key=EvpKDFAlgo.create({keySize:keySize+ivSize,hasher:hasher}).compute(password,_salt);}// Separate key and IV
            var iv=WordArray.create(key.words.slice(keySize),ivSize*4);key.sigBytes=keySize*4;// Return params
            return CipherParams.create({key:key,iv:iv,salt:_salt});}};/**
     * A serializable cipher wrapper that derives the key from a password,
     * and returns ciphertext as a serializable cipher params object.
     */var PasswordBasedCipher=/*#__PURE__*/function(_SerializableCipher){_inherits(PasswordBasedCipher,_SerializableCipher);var _super10=_createSuper(PasswordBasedCipher);function PasswordBasedCipher(){_classCallCheck(this,PasswordBasedCipher);return _super10.apply(this,arguments);}_createClass(PasswordBasedCipher,null,[{key:"encrypt",value:/**
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
         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher
         *       .encrypt(CryptoJS.algo.AES, message, 'password');
         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher
         *       .encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
         */function encrypt(cipher,message,password,cfg){// Apply config defaults
            var _cfg=ObjectAssign(new Base(),this.cfg,cfg);// Derive key and other params
            var derivedParams=_cfg.kdf.execute(password,cipher.keySize,cipher.ivSize,_cfg.salt,_cfg.hasher);// Add IV to config
            _cfg.iv=derivedParams.iv;// Encrypt
            var ciphertext=SerializableCipher.encrypt.call(this,cipher,message,derivedParams.key,_cfg);// Mix in derived params
            ciphertext.mixIn(derivedParams);return ciphertext;}/**
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
         *     var plaintext = CryptoJS.lib.PasswordBasedCipher
         *       .decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password',
         *         { format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.PasswordBasedCipher
         *       .decrypt(CryptoJS.algo.AES, ciphertextParams, 'password',
         *         { format: CryptoJS.format.OpenSSL });
         */},{key:"decrypt",value:function decrypt(cipher,ciphertext,password,cfg){var _ciphertext=ciphertext;// Apply config defaults
            var _cfg=ObjectAssign(new Base(),this.cfg,cfg);// Convert string to CipherParams
            _ciphertext=this._parse(_ciphertext,_cfg.format);// Derive key and other params
            var derivedParams=_cfg.kdf.execute(password,cipher.keySize,cipher.ivSize,_ciphertext.salt,_cfg.hasher);// Add IV to config
            _cfg.iv=derivedParams.iv;// Decrypt
            var plaintext=SerializableCipher.decrypt.call(this,cipher,_ciphertext,derivedParams.key,_cfg);return plaintext;}}]);return PasswordBasedCipher;}(SerializableCipher);/**
     * Configuration options.
     *
     * @property {KDF} kdf
     *     The key derivation function to use to generate a key and IV from a password.
     *     Default: OpenSSL
     */PasswordBasedCipher.cfg=ObjectAssign(SerializableCipher.cfg,{kdf:OpenSSLKdf});

    var _SBOX=[];var INV_SBOX=[];var _SUB_MIX_0=[];var _SUB_MIX_1=[];var _SUB_MIX_2=[];var _SUB_MIX_3=[];var INV_SUB_MIX_0=[];var INV_SUB_MIX_1=[];var INV_SUB_MIX_2=[];var INV_SUB_MIX_3=[];// Compute lookup tables
// Compute double table
    var d=[];for(var i=0;i<256;i+=1){if(i<128){d[i]=i<<1;}else {d[i]=i<<1^0x11b;}}// Walk GF(2^8)
    var x=0;var xi=0;for(var _i=0;_i<256;_i+=1){// Compute sbox
        var sx=xi^xi<<1^xi<<2^xi<<3^xi<<4;sx=sx>>>8^sx&0xff^0x63;_SBOX[x]=sx;INV_SBOX[sx]=x;// Compute multiplication
        var x2=d[x];var x4=d[x2];var x8=d[x4];// Compute sub bytes, mix columns tables
        var t=d[sx]*0x101^sx*0x1010100;_SUB_MIX_0[x]=t<<24|t>>>8;_SUB_MIX_1[x]=t<<16|t>>>16;_SUB_MIX_2[x]=t<<8|t>>>24;_SUB_MIX_3[x]=t;// Compute inv sub bytes, inv mix columns tables
        t=x8*0x1010101^x4*0x10001^x2*0x101^x*0x1010100;INV_SUB_MIX_0[sx]=t<<24|t>>>8;INV_SUB_MIX_1[sx]=t<<16|t>>>16;INV_SUB_MIX_2[sx]=t<<8|t>>>24;INV_SUB_MIX_3[sx]=t;// Compute next counter
        if(!x){xi=1;x=xi;}else {x=x2^d[d[d[x8^x2]]];xi^=d[d[xi]];}}// Precomputed Rcon lookup
    var RCON=[0x00,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36];/**
     * AES block cipher algorithm.
     */var AESAlgo=/*#__PURE__*/function(_BlockCipher){_inherits(AESAlgo,_BlockCipher);var _super=_createSuper(AESAlgo);function AESAlgo(){_classCallCheck(this,AESAlgo);return _super.apply(this,arguments);}_createClass(AESAlgo,[{key:"_doReset",value:function _doReset(){var t;// Skip reset of nRounds has been set before and key did not change
            if(this._nRounds&&this._keyPriorReset===this._key){return;}// Shortcuts
            this._keyPriorReset=this._key;var key=this._keyPriorReset;var keyWords=key.words;var keySize=key.sigBytes/4;// Compute number of rounds
            this._nRounds=keySize+6;var nRounds=this._nRounds;// Compute number of key schedule rows
            var ksRows=(nRounds+1)*4;// Compute key schedule
            this._keySchedule=[];var keySchedule=this._keySchedule;for(var ksRow=0;ksRow<ksRows;ksRow+=1){if(ksRow<keySize){keySchedule[ksRow]=keyWords[ksRow];}else {t=keySchedule[ksRow-1];if(!(ksRow%keySize)){// Rot word
                t=t<<8|t>>>24;// Sub word
                t=_SBOX[t>>>24]<<24|_SBOX[t>>>16&0xff]<<16|_SBOX[t>>>8&0xff]<<8|_SBOX[t&0xff];// Mix Rcon
                t^=RCON[ksRow/keySize|0]<<24;}else if(keySize>6&&ksRow%keySize===4){// Sub word
                t=_SBOX[t>>>24]<<24|_SBOX[t>>>16&0xff]<<16|_SBOX[t>>>8&0xff]<<8|_SBOX[t&0xff];}keySchedule[ksRow]=keySchedule[ksRow-keySize]^t;}}// Compute inv key schedule
            this._invKeySchedule=[];var invKeySchedule=this._invKeySchedule;for(var invKsRow=0;invKsRow<ksRows;invKsRow+=1){var _ksRow=ksRows-invKsRow;if(invKsRow%4){t=keySchedule[_ksRow];}else {t=keySchedule[_ksRow-4];}if(invKsRow<4||_ksRow<=4){invKeySchedule[invKsRow]=t;}else {invKeySchedule[invKsRow]=INV_SUB_MIX_0[_SBOX[t>>>24]]^INV_SUB_MIX_1[_SBOX[t>>>16&0xff]]^INV_SUB_MIX_2[_SBOX[t>>>8&0xff]]^INV_SUB_MIX_3[_SBOX[t&0xff]];}}}},{key:"encryptBlock",value:function encryptBlock(M,offset){this._doCryptBlock(M,offset,this._keySchedule,_SUB_MIX_0,_SUB_MIX_1,_SUB_MIX_2,_SUB_MIX_3,_SBOX);}},{key:"decryptBlock",value:function decryptBlock(M,offset){var _M=M;// Swap 2nd and 4th rows
            var t=_M[offset+1];_M[offset+1]=_M[offset+3];_M[offset+3]=t;this._doCryptBlock(_M,offset,this._invKeySchedule,INV_SUB_MIX_0,INV_SUB_MIX_1,INV_SUB_MIX_2,INV_SUB_MIX_3,INV_SBOX);// Inv swap 2nd and 4th rows
            t=_M[offset+1];_M[offset+1]=_M[offset+3];_M[offset+3]=t;}},{key:"_doCryptBlock",value:function _doCryptBlock(M,offset,keySchedule,SUB_MIX_0,SUB_MIX_1,SUB_MIX_2,SUB_MIX_3,SBOX){var _M=M;// Shortcut
            var nRounds=this._nRounds;// Get input, add round key
            var s0=_M[offset]^keySchedule[0];var s1=_M[offset+1]^keySchedule[1];var s2=_M[offset+2]^keySchedule[2];var s3=_M[offset+3]^keySchedule[3];// Key schedule row counter
            var ksRow=4;// Rounds
            for(var round=1;round<nRounds;round+=1){// Shift rows, sub bytes, mix columns, add round key
                var _t=SUB_MIX_0[s0>>>24]^SUB_MIX_1[s1>>>16&0xff]^SUB_MIX_2[s2>>>8&0xff]^SUB_MIX_3[s3&0xff]^keySchedule[ksRow];ksRow+=1;var _t2=SUB_MIX_0[s1>>>24]^SUB_MIX_1[s2>>>16&0xff]^SUB_MIX_2[s3>>>8&0xff]^SUB_MIX_3[s0&0xff]^keySchedule[ksRow];ksRow+=1;var _t3=SUB_MIX_0[s2>>>24]^SUB_MIX_1[s3>>>16&0xff]^SUB_MIX_2[s0>>>8&0xff]^SUB_MIX_3[s1&0xff]^keySchedule[ksRow];ksRow+=1;var _t4=SUB_MIX_0[s3>>>24]^SUB_MIX_1[s0>>>16&0xff]^SUB_MIX_2[s1>>>8&0xff]^SUB_MIX_3[s2&0xff]^keySchedule[ksRow];ksRow+=1;// Update state
                s0=_t;s1=_t2;s2=_t3;s3=_t4;}// Shift rows, sub bytes, add round key
            var t0=(SBOX[s0>>>24]<<24|SBOX[s1>>>16&0xff]<<16|SBOX[s2>>>8&0xff]<<8|SBOX[s3&0xff])^keySchedule[ksRow];ksRow+=1;var t1=(SBOX[s1>>>24]<<24|SBOX[s2>>>16&0xff]<<16|SBOX[s3>>>8&0xff]<<8|SBOX[s0&0xff])^keySchedule[ksRow];ksRow+=1;var t2=(SBOX[s2>>>24]<<24|SBOX[s3>>>16&0xff]<<16|SBOX[s0>>>8&0xff]<<8|SBOX[s1&0xff])^keySchedule[ksRow];ksRow+=1;var t3=(SBOX[s3>>>24]<<24|SBOX[s0>>>16&0xff]<<16|SBOX[s1>>>8&0xff]<<8|SBOX[s2&0xff])^keySchedule[ksRow];ksRow+=1;// Set output
            _M[offset]=t0;_M[offset+1]=t1;_M[offset+2]=t2;_M[offset+3]=t3;}}]);return AESAlgo;}(BlockCipher);AESAlgo.keySize=256/32;/**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
     */var AES=BlockCipher._createHelper(AESAlgo);

    var ENCRYPTION_PREFIX_V1='RudderEncrypt:';var ENCRYPTION_KEY_V1='Rudder';

    var encrypt=function encrypt(value){return "".concat(ENCRYPTION_PREFIX_V1).concat(AES.encrypt(value,ENCRYPTION_KEY_V1).toString());};var decrypt=function decrypt(value){if(value.startsWith(ENCRYPTION_PREFIX_V1)){return AES.decrypt(value.substring(ENCRYPTION_PREFIX_V1.length),ENCRYPTION_KEY_V1).toString(Utf8);}return value;};

    var pluginName$2='StorageEncryptionLegacy';var StorageEncryptionLegacy=function StorageEncryptionLegacy(){return {name:pluginName$2,initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$2]);},storage:{encrypt:function encrypt$1(value){return encrypt(value);},decrypt:function decrypt$1(value){return decrypt(value);}}};};

    var STORAGE_MIGRATION_ERROR=function STORAGE_MIGRATION_ERROR(key){return "Failed to retrieve or parse data for ".concat(key," from storage.");};

    var STORAGE_MIGRATOR_PLUGIN='StorageMigratorPlugin';

    var pluginName$1='StorageMigrator';var StorageMigrator=function StorageMigrator(){return {name:pluginName$1,initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName$1]);},storage:{migrate:function migrate(key,storageEngine,errorHandler,logger){try{var storedVal=storageEngine.getItem(key);if(isNullOrUndefined(storedVal)){return null;}var decryptedVal=decrypt(storedVal);// The value is not encrypted using legacy encryption
// Try latest
                if(decryptedVal===storedVal){decryptedVal=decrypt$1(storedVal);}if(isNullOrUndefined(decryptedVal)){return null;}// storejs that is used in localstorage engine already deserializes json strings but swallows errors
                return JSON.parse(decryptedVal);}catch(err){errorHandler===null||errorHandler===void 0||errorHandler.onError(err,STORAGE_MIGRATOR_PLUGIN,STORAGE_MIGRATION_ERROR(key));return null;}}}};};

    var DEFAULT_RETRY_QUEUE_OPTIONS={maxRetryDelay:360000,minRetryDelay:1000,backoffFactor:2,maxAttempts:10,maxItems:100};var REQUEST_TIMEOUT_MS=10*1000;// 10 seconds
    var DATA_PLANE_API_VERSION='v1';var QUEUE_NAME='rudder';var XHR_QUEUE_PLUGIN='XhrQueuePlugin';

    var EVENT_DELIVERY_FAILURE_ERROR_PREFIX=function EVENT_DELIVERY_FAILURE_ERROR_PREFIX(context,url){return "".concat(context).concat(LOG_CONTEXT_SEPARATOR,"Failed to deliver event(s) to ").concat(url,".");};

    var getBatchDeliveryPayload=function getBatchDeliveryPayload(events,logger){var batchPayload={batch:events};return stringifyWithoutCircular(batchPayload,true,undefined,logger);};var getNormalizedQueueOptions=function getNormalizedQueueOptions(queueOpts){return mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS,queueOpts);};var getDeliveryUrl=function getDeliveryUrl(dataplaneUrl,endpoint){var dpUrl=new URL(dataplaneUrl);return new URL(removeDuplicateSlashes([dpUrl.pathname,'/',DATA_PLANE_API_VERSION,'/',endpoint].join('')),dpUrl).href;};var getBatchDeliveryUrl=function getBatchDeliveryUrl(dataplaneUrl){return getDeliveryUrl(dataplaneUrl,'batch');};var logErrorOnFailure=function logErrorOnFailure(details,url,willBeRetried,attemptNumber,maxRetryAttempts,logger){if(isUndefined(details===null||details===void 0?void 0:details.error)||isUndefined(logger)){return;}var isRetryableFailure=isErrRetryable(details);var errMsg=EVENT_DELIVERY_FAILURE_ERROR_PREFIX(XHR_QUEUE_PLUGIN,url);var dropMsg="The event(s) will be dropped.";if(isRetryableFailure){if(willBeRetried){errMsg="".concat(errMsg," It/they will be retried.");if(attemptNumber>0){errMsg="".concat(errMsg," Retry attempt ").concat(attemptNumber," of ").concat(maxRetryAttempts,".");}}else {errMsg="".concat(errMsg," Retries exhausted (").concat(maxRetryAttempts,"). ").concat(dropMsg);}}else {errMsg="".concat(errMsg," ").concat(dropMsg);}logger===null||logger===void 0||logger.error(errMsg);};var getRequestInfo=function getRequestInfo(itemData,state,logger){var data;var headers;var url;if(Array.isArray(itemData)){var finalEvents=itemData.map(function(queueItemData){return getFinalEventForDeliveryMutator(queueItemData.event);});data=getBatchDeliveryPayload(finalEvents,logger);headers=itemData[0]?clone$1(itemData[0].headers):{};url=getBatchDeliveryUrl(state.lifecycle.activeDataplaneUrl.value);}else {var eventUrl=itemData.url,event=itemData.event,eventHeaders=itemData.headers;var finalEvent=getFinalEventForDeliveryMutator(event);data=getDeliveryPayload(finalEvent,logger);headers=clone$1(eventHeaders);url=eventUrl;}return {data:data,headers:headers,url:url};};

    var pluginName='XhrQueue';var XhrQueue=function XhrQueue(){return {name:pluginName,deps:[],initialize:function initialize(state){state.plugins.loadedPlugins.value=[].concat(_toConsumableArray(state.plugins.loadedPlugins.value),[pluginName]);},dataplaneEventsQueue:{/**
             * Initialize the queue for delivery
             * @param state Application state
             * @param httpClient http client instance
             * @param storeManager Store Manager instance
             * @param errorHandler Error handler instance
             * @param logger Logger instance
             * @returns RetryQueue instance
             */init:function init(state,httpClient,storeManager,errorHandler,logger){var writeKey=state.lifecycle.writeKey.value;httpClient.setAuthHeader(writeKey);var finalQOpts=getNormalizedQueueOptions(state.loadOptions.value.queueOptions);var eventsQueue=new RetryQueue(// adding write key to the queue name to avoid conflicts
                "".concat(QUEUE_NAME,"_").concat(writeKey),finalQOpts,function(itemData,done,attemptNumber,maxRetryAttempts,willBeRetried){var _getRequestInfo=getRequestInfo(itemData,state,logger),data=_getRequestInfo.data,url=_getRequestInfo.url,headers=_getRequestInfo.headers;httpClient.getAsyncData({url:url,options:{method:'POST',headers:headers,data:data,sendRawData:true},isRawResponse:true,timeout:REQUEST_TIMEOUT_MS,callback:function callback(result,details){// null means item will not be requeued
                        var queueErrResp=isErrRetryable(details)?details:null;logErrorOnFailure(details,url,willBeRetried,attemptNumber,maxRetryAttempts,logger);done(queueErrResp,result);}});},storeManager,LOCAL_STORAGE,logger,function(itemData){var _getBatchDeliveryPayl;var events=itemData.map(function(queueItemData){return queueItemData.event;});// type casting to string as we know that the event has already been validated prior to enqueue
                    return (_getBatchDeliveryPayl=getBatchDeliveryPayload(events,logger))===null||_getBatchDeliveryPayl===void 0?void 0:_getBatchDeliveryPayl.length;});return eventsQueue;},/**
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
                var headers={// To maintain event ordering while using the HTTP API as per is documentation,
// make sure to include anonymousId as a header
                    AnonymousId:toBase64(event.anonymousId)};eventsQueue.addItem({url:url,headers:headers,event:event});}}};};

    /**
     * Map plugin names to direct code imports from plugins package
     */var getBundledBuildPluginImports=function getBundledBuildPluginImports(){return {BeaconQueue:BeaconQueue,Bugsnag:Bugsnag,CustomConsentManager:CustomConsentManager,DeviceModeDestinations:DeviceModeDestinations,DeviceModeTransformation:DeviceModeTransformation,ErrorReporting:ErrorReporting,ExternalAnonymousId:ExternalAnonymousId,GoogleLinker:GoogleLinker,KetchConsentManager:KetchConsentManager,NativeDestinationQueue:NativeDestinationQueue,OneTrustConsentManager:OneTrustConsentManager,StorageEncryption:StorageEncryption,StorageEncryptionLegacy:StorageEncryptionLegacy,StorageMigrator:StorageMigrator,XhrQueue:XhrQueue};};

    /**
     * Map of mandatory plugin names and direct imports
     */var getMandatoryPluginsMap=function getMandatoryPluginsMap(){return {};};/**
     * Map of optional plugin names and direct imports for legacy builds
     */var getOptionalPluginsMap=function getOptionalPluginsMap(){return getBundledBuildPluginImports();};/**
     * Map of optional plugin names and dynamic imports for modern builds
     */var getRemotePluginsMap=function getRemotePluginsMap(activePluginNames){{return {};}};var pluginsInventory=_objectSpread2(_objectSpread2({},getMandatoryPluginsMap()),getOptionalPluginsMap());var remotePluginsInventory=function remotePluginsInventory(activePluginNames){return _objectSpread2({},getRemotePluginsMap());};

// TODO: add retry mechanism for getting remote plugins
// TODO: add timeout error mechanism for marking remote plugins that failed to load as failed in state
    var PluginsManager=/*#__PURE__*/function(){function PluginsManager(engine,errorHandler,logger){_classCallCheck(this,PluginsManager);this.engine=engine;this.errorHandler=errorHandler;this.logger=logger;this.onError=this.onError.bind(this);}/**
     * Orchestrate the plugin loading and registering
     */_createClass(PluginsManager,[{key:"init",value:function init(){state.lifecycle.status.value='pluginsLoading';// Expose pluginsCDNPath to global object, so it can be used in the promise that determines
            this.setActivePlugins();this.registerLocalPlugins();this.registerRemotePlugins();this.attachEffects();}/**
         * Update state based on plugin loaded status
         */ // eslint-disable-next-line class-methods-use-this
    },{key:"attachEffects",value:function attachEffects(){O(function(){var isAllPluginsReady=state.plugins.activePlugins.value.length===0||state.plugins.loadedPlugins.value.length+state.plugins.failedPlugins.value.length===state.plugins.totalPluginsToLoad.value;if(isAllPluginsReady){n(function(){state.plugins.ready.value=true;// TODO: decide what to do if a plugin fails to load for any reason.
//  Should we stop here or should we progress?
            state.lifecycle.status.value='pluginsReady';});}});}/**
         * Determine the list of plugins that should be loaded based on sourceConfig & load options
         */ // eslint-disable-next-line class-methods-use-this
    },{key:"getPluginsToLoadBasedOnConfig",value:function getPluginsToLoadBasedOnConfig(){var _state$nativeDestinat;// This contains the default plugins if load option has been omitted by user
            var pluginsToLoadFromConfig=state.plugins.pluginsToLoadFromConfig.value;if(!pluginsToLoadFromConfig){return [];}// Error reporting related plugins
            var supportedErrReportingProviderPluginNames=Object.values(ErrorReportingProvidersToPluginNameMap);if(state.reporting.errorReportingProviderPluginName.value){pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return !(pluginName!==state.reporting.errorReportingProviderPluginName.value&&supportedErrReportingProviderPluginNames.includes(pluginName));});}else {pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return !(pluginName==='ErrorReporting'||supportedErrReportingProviderPluginNames.includes(pluginName));});}// Cloud mode (dataplane) events delivery plugins
            if(state.loadOptions.value.useBeacon===true&&state.capabilities.isBeaconAvailable.value){pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return pluginName!=='XhrQueue';});}else {if(state.loadOptions.value.useBeacon===true){var _this$logger;(_this$logger=this.logger)===null||_this$logger===void 0||_this$logger.warn(UNSUPPORTED_BEACON_API_WARNING(PLUGINS_MANAGER));}pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return pluginName!=='BeaconQueue';});}// Enforce default cloud mode event delivery queue plugin is none exists
            if(!pluginsToLoadFromConfig.includes('XhrQueue')&&!pluginsToLoadFromConfig.includes('BeaconQueue')){pluginsToLoadFromConfig.push('XhrQueue');}// Device mode destinations related plugins
            if(getNonCloudDestinations((_state$nativeDestinat=state.nativeDestinations.configuredDestinations.value)!==null&&_state$nativeDestinat!==void 0?_state$nativeDestinat:[]).length===0){pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return !['DeviceModeDestinations','DeviceModeTransformation','NativeDestinationQueue'].includes(pluginName);});}// Consent Management related plugins
            var supportedConsentManagerPlugins=Object.values(ConsentManagersToPluginNameMap);var filterCondition=function filterCondition(pluginName){return !(pluginName!==state.consents.activeConsentManagerPluginName.value&&supportedConsentManagerPlugins.includes(pluginName));};if(!state.consents.enabled.value){filterCondition=function filterCondition(pluginName){return !supportedConsentManagerPlugins.includes(pluginName);};}pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(filterCondition);// Storage encryption related plugins
            var supportedStorageEncryptionPlugins=Object.values(StorageEncryptionVersionsToPluginNameMap);pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return !(pluginName!==state.storage.encryptionPluginName.value&&supportedStorageEncryptionPlugins.includes(pluginName));});// Storage migrator related plugins
            if(!state.storage.migrate.value){pluginsToLoadFromConfig=pluginsToLoadFromConfig.filter(function(pluginName){return pluginName!=='StorageMigrator';});}return [].concat(_toConsumableArray(Object.keys(getMandatoryPluginsMap())),_toConsumableArray(pluginsToLoadFromConfig));}/**
         * Determine the list of plugins that should be activated
         */},{key:"setActivePlugins",value:function setActivePlugins(){var pluginsToLoad=this.getPluginsToLoadBasedOnConfig();// Merging available mandatory and optional plugin name list
            var availablePlugins=[].concat(_toConsumableArray(Object.keys(pluginsInventory)),_toConsumableArray(pluginNamesList));var activePlugins=[];var failedPlugins=[];pluginsToLoad.forEach(function(pluginName){if(availablePlugins.includes(pluginName)){activePlugins.push(pluginName);}else {failedPlugins.push(pluginName);}});if(failedPlugins.length>0){this.onError(new Error("Ignoring loading of unknown plugins: ".concat(failedPlugins.join(','),". Mandatory plugins: ").concat(Object.keys(getMandatoryPluginsMap()).join(','),". Load option plugins: ").concat(state.plugins.pluginsToLoadFromConfig.value.join(','))));}n(function(){state.plugins.totalPluginsToLoad.value=pluginsToLoad.length;state.plugins.activePlugins.value=activePlugins;state.plugins.failedPlugins.value=failedPlugins;});}/**
         * Register plugins that are direct imports to PluginEngine
         */},{key:"registerLocalPlugins",value:function registerLocalPlugins(){var _this=this;Object.values(pluginsInventory).forEach(function(localPlugin){if(isFunction(localPlugin)&&state.plugins.activePlugins.value.includes(localPlugin().name)){_this.register([localPlugin()]);}});}/**
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
     */var responseTextToJson=function responseTextToJson(responseText,onError){try{return JSON.parse(responseText||'');}catch(err){var error=getMutatedError(err,'Failed to parse response data');if(isFunction(onError)){onError(error);}else {throw error;}}return undefined;};

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
         */},{key:"getAsyncData",value:function getAsyncData(config){var _this=this;var callback=config.callback,url=config.url,options=config.options,timeout=config.timeout,isRawResponse=config.isRawResponse;var isFireAndForget=!isFunction(callback);xhrRequest(createXhrRequestOptions(url,options,this.basicAuthHeader),timeout,this.logger).then(function(data){if(!isFireAndForget){callback(isRawResponse?data.response:responseTextToJson(data.response,_this.onError),data);}}).catch(function(data){var _data$error;_this.onError((_data$error=data.error)!==null&&_data$error!==void 0?_data$error:data);if(!isFireAndForget){callback(undefined,data);}});}/**
         * Handle errors
         */},{key:"onError",value:function onError(error){if(this.hasErrorHandler){var _this$errorHandler;(_this$errorHandler=this.errorHandler)===null||_this$errorHandler===void 0||_this$errorHandler.onError(error,HTTP_CLIENT);}else {throw error;}}/**
         * Set basic authentication header (eg writekey)
         */},{key:"setAuthHeader",value:function setAuthHeader(value){var noBtoa=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;var authVal=noBtoa?value:toBase64("".concat(value,":"));this.basicAuthHeader="Basic ".concat(authVal);}/**
         * Clear basic authentication header
         */},{key:"resetAuthHeader",value:function resetAuthHeader(){this.basicAuthHeader=undefined;}}]);return HttpClient;}();var defaultHttpClient=new HttpClient(defaultErrorHandler,defaultLogger);

    var STORAGE_TEST_COOKIE='test_rudder_cookie';var STORAGE_TEST_LOCAL_STORAGE='test_rudder_ls';var STORAGE_TEST_SESSION_STORAGE='test_rudder_ss';var STORAGE_TEST_TOP_LEVEL_DOMAIN='__tld__';var CLIENT_DATA_STORE_COOKIE='clientDataInCookie';var CLIENT_DATA_STORE_LS='clientDataInLocalStorage';var CLIENT_DATA_STORE_MEMORY='clientDataInMemory';var CLIENT_DATA_STORE_SESSION='clientDataInSessionStorage';var USER_SESSION_KEYS=['userId','userTraits','anonymousId','groupId','groupTraits','initialReferrer','initialReferringDomain','sessionInfo','authToken'];

    var _storageClientDataSto;var storageClientDataStoreNameMap=(_storageClientDataSto={},_defineProperty(_storageClientDataSto,COOKIE_STORAGE,CLIENT_DATA_STORE_COOKIE),_defineProperty(_storageClientDataSto,LOCAL_STORAGE,CLIENT_DATA_STORE_LS),_defineProperty(_storageClientDataSto,MEMORY_STORAGE,CLIENT_DATA_STORE_MEMORY),_defineProperty(_storageClientDataSto,SESSION_STORAGE,CLIENT_DATA_STORE_SESSION),_storageClientDataSto);

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

    var getUserAgentClientHint=function getUserAgentClientHint(callback){var level=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'none';if(level==='none'){callback(undefined);}if(level==='default'){callback(navigator.userAgentData);}if(level==='full'){var _navigator$userAgentD;(_navigator$userAgentD=navigator.userAgentData)===null||_navigator$userAgentD===void 0||_navigator$userAgentD.getHighEntropyValues(['architecture','bitness','brands','mobile','model','platform','platformVersion','uaFullVersion','fullVersionList','wow64']).then(function(ua){callback(ua);}).catch(function(){callback();});}};

    var isDatasetAvailable=function isDatasetAvailable(){var testElement=document.createElement('div');testElement.setAttribute('data-a-b','c');return testElement.dataset?testElement.dataset.aB==='c':false;};var legacyJSEngineRequiredPolyfills={URLSearchParams:function URLSearchParams(){return !globalThis.URLSearchParams;},URL:function URL(){return !isFunction(globalThis.URL);},MutationObserver:function(_MutationObserver){function MutationObserver(){return _MutationObserver.apply(this,arguments);}MutationObserver.toString=function(){return _MutationObserver.toString();};return MutationObserver;}(function(){return isUndefined(MutationObserver);}),Promise:function(_Promise){function Promise(){return _Promise.apply(this,arguments);}Promise.toString=function(){return _Promise.toString();};return Promise;}(function(){return isUndefined(Promise);}),'Number.isNaN':function NumberIsNaN(){return !Number.isNaN;},'Number.isInteger':function NumberIsInteger(){return !Number.isInteger;},'Array.from':function ArrayFrom(){return !Array.from;},'Array.prototype.find':function ArrayPrototypeFind(){return !Array.prototype.find;},'Array.prototype.includes':function ArrayPrototypeIncludes(){return !Array.prototype.includes;},'String.prototype.endsWith':function StringPrototypeEndsWith(){return !String.prototype.endsWith;},'String.prototype.startsWith':function StringPrototypeStartsWith(){return !String.prototype.startsWith;},'String.prototype.includes':function StringPrototypeIncludes(){return !String.prototype.includes;},'Object.entries':function ObjectEntries(){return !Object.entries;},'Object.values':function ObjectValues(){return !Object.values;},'Object.assign':function ObjectAssign(){return typeof Object.assign!=='function';},'Element.prototype.dataset':function ElementPrototypeDataset(){return !isDatasetAvailable();},'String.prototype.replaceAll':function StringPrototypeReplaceAll(){return !String.prototype.replaceAll;},TextEncoder:function(_TextEncoder){function TextEncoder(){return _TextEncoder.apply(this,arguments);}TextEncoder.toString=function(){return _TextEncoder.toString();};return TextEncoder;}(function(){return isUndefined(TextEncoder);}),TextDecoder:function(_TextDecoder){function TextDecoder(){return _TextDecoder.apply(this,arguments);}TextDecoder.toString=function(){return _TextDecoder.toString();};return TextDecoder;}(function(){return isUndefined(TextDecoder);}),'String.fromCodePoint':function StringFromCodePoint(){return !String.fromCodePoint;},requestAnimationFrame:function requestAnimationFrame(){return !isFunction(globalThis.requestAnimationFrame);},cancelAnimationFrame:function cancelAnimationFrame(){return !isFunction(globalThis.cancelAnimationFrame);},CustomEvent:function CustomEvent(){return !isFunction(globalThis.CustomEvent);},/* eslint-disable-next-line */'navigator.sendBeacon':function navigatorSendBeacon(){return !isFunction(navigator.sendBeacon);}};var isLegacyJSEngine=function isLegacyJSEngine(){var requiredCapabilitiesList=Object.keys(legacyJSEngineRequiredPolyfills);var needsPolyfill=false;/* eslint-disable-next-line unicorn/no-for-loop */for(var i=0;i<requiredCapabilitiesList.length;i++){var isCapabilityMissing=legacyJSEngineRequiredPolyfills[requiredCapabilitiesList[i]];if(isFunction(isCapabilityMissing)&&isCapabilityMissing()){needsPolyfill=true;break;}}return needsPolyfill;};

    var getScreenDetails=function getScreenDetails(){var screenDetails={density:0,width:0,height:0,innerWidth:0,innerHeight:0};screenDetails={width:globalThis.screen.width,height:globalThis.screen.height,density:globalThis.devicePixelRatio,innerWidth:globalThis.innerWidth,innerHeight:globalThis.innerHeight};return screenDetails;};

    var isStorageQuotaExceeded=function isStorageQuotaExceeded(e){var matchingNames=['QuotaExceededError','NS_ERROR_DOM_QUOTA_REACHED'];// [everything except Firefox, Firefox]
        var matchingCodes=[22,1014];// [everything except Firefox, Firefox]
        var isQuotaExceededError=matchingNames.includes(e.name)||matchingCodes.includes(e.code);return e instanceof DOMException&&isQuotaExceededError;};// TODO: also check for SecurityErrors
//  https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#exceptions
    var isStorageAvailable=function isStorageAvailable(){var type=arguments.length>0&&arguments[0]!==undefined?arguments[0]:LOCAL_STORAGE;var storageInstance=arguments.length>1?arguments[1]:undefined;var logger=arguments.length>2?arguments[2]:undefined;var storage;var testData;try{switch(type){case MEMORY_STORAGE:return true;case COOKIE_STORAGE:storage=storageInstance;testData=STORAGE_TEST_COOKIE;break;case LOCAL_STORAGE:storage=storageInstance!==null&&storageInstance!==void 0?storageInstance:globalThis.localStorage;testData=STORAGE_TEST_LOCAL_STORAGE;// was STORAGE_TEST_LOCAL_STORAGE in ours and generateUUID() in segment retry one
        break;case SESSION_STORAGE:storage=storageInstance!==null&&storageInstance!==void 0?storageInstance:globalThis.sessionStorage;testData=STORAGE_TEST_SESSION_STORAGE;break;default:return false;}if(!storage){return false;}storage.setItem(testData,'true');if(storage.getItem(testData)){storage.removeItem(testData);return true;}return false;}catch(err){var msgPrefix=STORAGE_UNAVAILABILITY_ERROR_PREFIX(CAPABILITIES_MANAGER,type);var reason='unavailable';if(isStorageQuotaExceeded(err)){reason='full';}logger===null||logger===void 0||logger.error("".concat(msgPrefix).concat(reason,"."),err);return false;}};

    /**
     * Encode.
     */var encode=function encode(value,logger){try{return encodeURIComponent(value);}catch(err){logger===null||logger===void 0||logger.error(COOKIE_DATA_ENCODING_ERROR,err);return undefined;}};/**
     * Decode
     */var decode=function decode(value){try{return decodeURIComponent(value);}catch(err){// Do nothing as non-RS SDK cookies may not be URI encoded
        return undefined;}};/**
     * Parse cookie `str`
     */var parse=function parse(str){var obj={};var pairs=str.split(/\s*;\s*/);var pair;if(!pairs[0]){return obj;}// TODO: Decode only the cookies that are needed by the SDK
        pairs.forEach(function(pairItem){pair=pairItem.split('=');var keyName=pair[0]?decode(pair[0]):undefined;if(keyName){obj[keyName]=pair[1]?decode(pair[1]):undefined;}});return obj;};/**
     * Set cookie `name` to `value`
     */var set=function set(name,value,optionsConfig,logger){var options=_objectSpread2({},optionsConfig)||{};var cookieString="".concat(encode(name,logger),"=").concat(encode(value,logger));if(isNull(value)){options.maxage=-1;}if(options.maxage){options.expires=new Date(+new Date()+options.maxage);}if(options.path){cookieString+="; path=".concat(options.path);}if(options.domain){cookieString+="; domain=".concat(options.domain);}if(options.expires){cookieString+="; expires=".concat(options.expires.toUTCString());}if(options.samesite){cookieString+="; samesite=".concat(options.samesite);}if(options.secure){cookieString+="; secure";}globalThis.document.cookie=cookieString;};/**
     * Return all cookies
     */var all=function all(){var cookieStringValue=globalThis.document.cookie;return parse(cookieStringValue);};/**
     * Get cookie `name`
     */var get=function get(name){return all()[name];};/**
     * Set or get cookie `name` with `value` and `options` object
     */ // eslint-disable-next-line func-names
    var cookie=function cookie(name,value,options,logger){switch(arguments.length){case 4:case 3:case 2:return set(name,value,options,logger);case 1:if(name){return get(name);}return all();default:return all();}};

    var legacyGetHostname=function legacyGetHostname(href){var l=document.createElement('a');l.href=href;return l.hostname;};/**
     * Levels returns all levels of the given url
     *
     * The method returns an empty array when the hostname is an ip.
     */var levelsFunc=function levelsFunc(url){var _host$split;// This is called before the polyfills load thus new URL cannot be used
        var host=typeof globalThis.URL!=='function'?legacyGetHostname(url):new URL(url).hostname;var parts=(_host$split=host===null||host===void 0?void 0:host.split('.'))!==null&&_host$split!==void 0?_host$split:[];var last=parts[parts.length-1];var levels=[];// Ip address.
        if(parts.length===4&&last&&last===parseInt(last,10).toString()){return levels;}// Localhost.
        if(parts.length<=1){// Fix to support localhost
            if(parts[0]&&parts[0].indexOf('localhost')!==-1){return ['localhost'];}return levels;}// Create levels.
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

    var getDefaultCookieOptions=function getDefaultCookieOptions(){var topDomain=domain(globalThis.location.href);return {maxage:DEFAULT_COOKIE_MAX_AGE_MS,path:'/',domain:!topDomain||topDomain==='.'?undefined:topDomain,samesite:'Lax',enabled:true};};var getDefaultLocalStorageOptions=function getDefaultLocalStorageOptions(){return {enabled:true};};var getDefaultSessionStorageOptions=function getDefaultSessionStorageOptions(){return {enabled:true};};var getDefaultInMemoryStorageOptions=function getDefaultInMemoryStorageOptions(){return {enabled:true};};

    /**
     * A storage utility to persist values in cookies via Storage interface
     */var CookieStorage=/*#__PURE__*/function(){function CookieStorage(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var logger=arguments.length>1?arguments[1]:undefined;_classCallCheck(this,CookieStorage);_defineProperty(this,"isSupportAvailable",true);_defineProperty(this,"isEnabled",true);_defineProperty(this,"length",0);if(CookieStorage.globalSingleton){// eslint-disable-next-line no-constructor-return
        return CookieStorage.globalSingleton;}this.options=getDefaultCookieOptions();this.logger=logger;this.configure(options);CookieStorage.globalSingleton=this;}_createClass(CookieStorage,[{key:"configure",value:function configure(options){var _this$options;this.options=mergeDeepRight((_this$options=this.options)!==null&&_this$options!==void 0?_this$options:{},options);if(options.sameDomainCookiesOnly){delete this.options.domain;}this.isSupportAvailable=isStorageAvailable(COOKIE_STORAGE,this,this.logger);this.isEnabled=Boolean(this.options.enabled&&this.isSupportAvailable);return this.options;}},{key:"setItem",value:function setItem(key,value){cookie(key,value,this.options,this.logger);this.length=Object.keys(cookie()).length;return true;}// eslint-disable-next-line class-methods-use-this
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
     */var InMemoryStorage=/*#__PURE__*/function(){function InMemoryStorage(options,logger){_classCallCheck(this,InMemoryStorage);_defineProperty(this,"isEnabled",true);_defineProperty(this,"length",0);_defineProperty(this,"data",{});this.options=getDefaultInMemoryStorageOptions();this.logger=logger;this.configure(options!==null&&options!==void 0?options:{});}_createClass(InMemoryStorage,[{key:"configure",value:function configure(options){this.options=mergeDeepRight(this.options,options);this.isEnabled=Boolean(this.options.enabled);return this.options;}},{key:"setItem",value:function setItem(key,value){this.data[key]=value;this.length=Object.keys(this.data).length;return value;}},{key:"getItem",value:function getItem(key){if(key in this.data){return this.data[key];}return null;}},{key:"removeItem",value:function removeItem(key){if(key in this.data){delete this.data[key];}this.length=Object.keys(this.data).length;return null;}},{key:"clear",value:function clear(){this.data={};this.length=0;}},{key:"key",value:function key(index){return Object.keys(this.data)[index]?Object.keys(this.data)[index]:null;}}]);return InMemoryStorage;}();var defaultInMemoryStorage=new InMemoryStorage({},defaultLogger);

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var store$1 = {exports: {}};

    (function(module,exports){(function(global,factory){module.exports=factory();})(commonjsGlobal,function(){function isJSON(obj){obj=JSON.stringify(obj);if(!/^\{[\s\S]*\}$/.test(obj)){return false;}return true;}function stringify(val){return val===undefined||typeof val==="function"?val+'':JSON.stringify(val);}function deserialize(value){if(typeof value!=='string'){return undefined;}try{return JSON.parse(value);}catch(e){return value;}}function isFunction(value){return {}.toString.call(value)==="[object Function]";}function isArray(value){return Object.prototype.toString.call(value)==="[object Array]";}// https://github.com/jaywcjlove/store.js/pull/8
// Error: QuotaExceededError
        function dealIncognito(storage){var _KEY='_Is_Incognit',_VALUE='yes';try{// NOTE: set default storage when not passed in
            if(!storage){storage=window.localStorage;}storage.setItem(_KEY,_VALUE);storage.removeItem(_KEY);}catch(e){var inMemoryStorage={};inMemoryStorage._data={};inMemoryStorage.setItem=function(id,val){return inMemoryStorage._data[id]=String(val);};inMemoryStorage.getItem=function(id){return inMemoryStorage._data.hasOwnProperty(id)?inMemoryStorage._data[id]:undefined;};inMemoryStorage.removeItem=function(id){return delete inMemoryStorage._data[id];};inMemoryStorage.clear=function(){return inMemoryStorage._data={};};storage=inMemoryStorage;}finally{if(storage.getItem(_KEY)===_VALUE)storage.removeItem(_KEY);}return storage;}// deal QuotaExceededError if user use incognito mode in browser
        var storage=dealIncognito();function Store(){if(!(this instanceof Store)){return new Store();}}Store.prototype={set:function set(key,val){if(key&&!isJSON(key)){storage.setItem(key,stringify(val));}else if(isJSON(key)){for(var a in key)this.set(a,key[a]);}return this;},get:function get(key){// Return all entries if no key
                if(key===undefined){var ret={};this.forEach(function(key,val){return ret[key]=val;});return ret;}if(key.charAt(0)==='?'){return this.has(key.substr(1));}var args=arguments;if(args.length>1){var dt={};for(var i=0,len=args.length;i<len;i++){var value=deserialize(storage.getItem(args[i]));if(this.has(args[i])){dt[args[i]]=value;}}return dt;}return deserialize(storage.getItem(key));},clear:function clear(){storage.clear();return this;},remove:function remove(key){var val=this.get(key);storage.removeItem(key);return val;},has:function has(key){return {}.hasOwnProperty.call(this.get(),key);},keys:function keys(){var d=[];this.forEach(function(k){d.push(k);});return d;},forEach:function forEach(callback){for(var i=0,len=storage.length;i<len;i++){var key=storage.key(i);callback(key,this.get(key));}return this;},search:function search(str){var arr=this.keys(),dt={};for(var i=0,len=arr.length;i<len;i++){if(arr[i].indexOf(str)>-1)dt[arr[i]]=this.get(arr[i]);}return dt;}};var _Store=null;function store(key,data){var argm=arguments;var dt=null;if(!_Store)_Store=Store();if(argm.length===0)return _Store.get();if(argm.length===1){if(typeof key==="string")return _Store.get(key);if(isJSON(key))return _Store.set(key);}if(argm.length===2&&typeof key==="string"){if(!data)return _Store.remove(key);if(data&&typeof data==="string")return _Store.set(key,data);if(data&&isFunction(data)){dt=null;dt=data(key,_Store.get(key));store.set(key,dt);}}if(argm.length===2&&isArray(key)&&isFunction(data)){for(var i=0,len=key.length;i<len;i++){dt=data(key[i],_Store.get(key[i]));store.set(key[i],dt);}}return store;}for(var a in Store.prototype)store[a]=Store.prototype[a];return store;});})(store$1);var storeExports=store$1.exports;var store = /*@__PURE__*/getDefaultExportFromCjs(storeExports);

//  check if the get, set overloads and search methods are used at all
//  if we do, ensure we provide types to support overloads as per storejs docs
//  https://www.npmjs.com/package/storejs
    /**
     * A storage utility to persist values in localstorage via Storage interface
     */var LocalStorage=/*#__PURE__*/function(){function LocalStorage(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var logger=arguments.length>1?arguments[1]:undefined;_classCallCheck(this,LocalStorage);_defineProperty(this,"isSupportAvailable",true);_defineProperty(this,"isEnabled",true);_defineProperty(this,"length",0);this.options=getDefaultLocalStorageOptions();this.logger=logger;this.configure(options);}_createClass(LocalStorage,[{key:"configure",value:function configure(options){this.options=mergeDeepRight(this.options,options);this.isSupportAvailable=isStorageAvailable(LOCAL_STORAGE,this,this.logger);this.isEnabled=Boolean(this.options.enabled&&this.isSupportAvailable);return this.options;}},{key:"setItem",value:function setItem(key,value){store.set(key,value);this.length=store.keys().length;}// eslint-disable-next-line class-methods-use-this
    },{key:"getItem",value:function getItem(key){var value=store.get(key);return isUndefined(value)?null:value;}},{key:"removeItem",value:function removeItem(key){store.remove(key);this.length=store.keys().length;}},{key:"clear",value:function clear(){store.clear();this.length=0;}// eslint-disable-next-line class-methods-use-this
    },{key:"key",value:function key(index){return store.keys()[index]?store.keys()[index]:null;}}]);return LocalStorage;}();var defaultLocalStorage=new LocalStorage({},defaultLogger);

    /**
     * A storage utility to persist values in SessionStorage via Storage interface
     */var SessionStorage=/*#__PURE__*/function(){function SessionStorage(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var logger=arguments.length>1?arguments[1]:undefined;_classCallCheck(this,SessionStorage);_defineProperty(this,"isSupportAvailable",true);_defineProperty(this,"isEnabled",true);_defineProperty(this,"length",0);_defineProperty(this,"store",globalThis.sessionStorage);this.options=getDefaultSessionStorageOptions();this.logger=logger;this.configure(options);}_createClass(SessionStorage,[{key:"configure",value:function configure(options){this.options=mergeDeepRight(this.options,options);this.isSupportAvailable=isStorageAvailable(SESSION_STORAGE,this,this.logger);this.isEnabled=Boolean(this.options.enabled&&this.isSupportAvailable);return this.options;}},{key:"setItem",value:function setItem(key,value){this.store.setItem(key,value);this.length=this.store.length;}},{key:"getItem",value:function getItem(key){var value=this.store.getItem(key);return isUndefined(value)?null:value;}},{key:"removeItem",value:function removeItem(key){this.store.removeItem(key);this.length=this.store.length;}},{key:"clear",value:function clear(){this.store.clear();this.length=0;}},{key:"key",value:function key(index){return this.store.key(index);}}]);return SessionStorage;}();var defaultSessionStorage=new SessionStorage({},defaultLogger);

    /**
     * A utility to retrieve the storage singleton instance by type
     */var getStorageEngine=function getStorageEngine(type){switch(type){case LOCAL_STORAGE:return defaultLocalStorage;case SESSION_STORAGE:return defaultSessionStorage;case MEMORY_STORAGE:return defaultInMemoryStorage;case COOKIE_STORAGE:return new CookieStorage({},defaultLogger);default:return defaultInMemoryStorage;}};/**
     * Configure cookie storage singleton
     */var configureCookieStorageEngine=function configureCookieStorageEngine(options){new CookieStorage({},defaultLogger).configure(options);};/**
     * Configure local storage singleton
     */var configureLocalStorageEngine=function configureLocalStorageEngine(options){defaultLocalStorage.configure(options);};/**
     * Configure in memory storage singleton
     */var configureInMemoryStorageEngine=function configureInMemoryStorageEngine(options){defaultInMemoryStorage.configure(options);};/**
     * Configure session storage singleton
     */var configureSessionStorageEngine=function configureSessionStorageEngine(options){defaultSessionStorage.configure(options);};/**
     * Configure all storage singleton instances
     */var configureStorageEngines=function configureStorageEngines(){var cookieStorageOptions=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var localStorageOptions=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var inMemoryStorageOptions=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};var sessionStorageOptions=arguments.length>3&&arguments[3]!==undefined?arguments[3]:{};configureCookieStorageEngine(cookieStorageOptions);configureLocalStorageEngine(localStorageOptions);configureInMemoryStorageEngine(inMemoryStorageOptions);configureSessionStorageEngine(sessionStorageOptions);};

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
            this.engine.setItem(validKey,this.encrypt(stringifyWithoutCircular(value,false,[],this.logger)));}catch(err){if(isStorageQuotaExceeded(err)){var _this$logger;(_this$logger=this.logger)===null||_this$logger===void 0||_this$logger.warn(STORAGE_QUOTA_EXCEEDED_WARNING("Store ".concat(this.id)));// switch to inMemory engine
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
         */},{key:"onError",value:function onError(error){if(this.hasErrorHandler){var _this$errorHandler;(_this$errorHandler=this.errorHandler)===null||_this$errorHandler===void 0||_this$errorHandler.onError(error,"Store ".concat(this.id));}else {throw error;}}}]);return Store;}();

    var getStorageTypeFromPreConsentIfApplicable=function getStorageTypeFromPreConsentIfApplicable(state,sessionKey){var overriddenStorageType;if(state.consents.preConsent.value.enabled){var _state$consents$preCo;switch((_state$consents$preCo=state.consents.preConsent.value.storage)===null||_state$consents$preCo===void 0?void 0:_state$consents$preCo.strategy){case'none':overriddenStorageType=NO_STORAGE;break;case'session':if(sessionKey!=='sessionInfo'){overriddenStorageType=NO_STORAGE;}break;case'anonymousId':if(sessionKey!=='anonymousId'){overriddenStorageType=NO_STORAGE;}break;}}return overriddenStorageType;};

    /**
     * A service to manage stores & available storage client configurations
     */var StoreManager=/*#__PURE__*/function(){function StoreManager(pluginsManager,errorHandler,logger){_classCallCheck(this,StoreManager);_defineProperty(this,"stores",{});_defineProperty(this,"isInitialized",false);_defineProperty(this,"hasErrorHandler",false);this.errorHandler=errorHandler;this.logger=logger;this.hasErrorHandler=Boolean(this.errorHandler);this.pluginsManager=pluginsManager;this.onError=this.onError.bind(this);}/**
     * Configure available storage client instances
     */_createClass(StoreManager,[{key:"init",value:function init(){var _config$cookieStorage,_state$storage$cookie,_state$storage$cookie2;if(this.isInitialized){return;}var loadOptions=state.loadOptions.value;var config={cookieStorageOptions:{samesite:loadOptions.sameSiteCookie,secure:loadOptions.secureCookie,domain:loadOptions.setCookieDomain,sameDomainCookiesOnly:loadOptions.sameDomainCookiesOnly,enabled:true},localStorageOptions:{enabled:true},inMemoryStorageOptions:{enabled:true},sessionStorageOptions:{enabled:true}};configureStorageEngines(removeUndefinedValues(mergeDeepRight((_config$cookieStorage=config.cookieStorageOptions)!==null&&_config$cookieStorage!==void 0?_config$cookieStorage:{},(_state$storage$cookie=(_state$storage$cookie2=state.storage.cookie)===null||_state$storage$cookie2===void 0?void 0:_state$storage$cookie2.value)!==null&&_state$storage$cookie!==void 0?_state$storage$cookie:{})),removeUndefinedValues(config.localStorageOptions),removeUndefinedValues(config.inMemoryStorageOptions),removeUndefinedValues(config.sessionStorageOptions));this.initClientDataStores();this.isInitialized=true;}/**
         * Create store to persist data used by the SDK like session, used details etc
         */},{key:"initClientDataStores",value:function initClientDataStores(){var _this=this;this.initializeStorageState();// TODO: fill in extra config values and bring them in from StoreManagerOptions if needed
// TODO: should we pass the keys for all in order to validate or leave free as v1.1?
// Initializing all the enabled store because previous user data might be in different storage
// that needs auto migration
            var storageTypes=[MEMORY_STORAGE,LOCAL_STORAGE,COOKIE_STORAGE,SESSION_STORAGE];storageTypes.forEach(function(storageType){var _getStorageEngine;if((_getStorageEngine=getStorageEngine(storageType))!==null&&_getStorageEngine!==void 0&&_getStorageEngine.isEnabled){_this.setStore({id:storageClientDataStoreNameMap[storageType],name:storageClientDataStoreNameMap[storageType],isEncrypted:true,noCompoundKey:true,type:storageType});}});}},{key:"initializeStorageState",value:function initializeStorageState(){var _state$loadOptions$va,_this2=this;var globalStorageType=state.storage.type.value;var entriesOptions=(_state$loadOptions$va=state.loadOptions.value.storage)===null||_state$loadOptions$va===void 0?void 0:_state$loadOptions$va.entries;// Use the storage options from post consent if anything is defined
            var postConsentStorageOpts=state.consents.postConsent.value.storage;if(isDefined(postConsentStorageOpts===null||postConsentStorageOpts===void 0?void 0:postConsentStorageOpts.type)||isDefined(postConsentStorageOpts===null||postConsentStorageOpts===void 0?void 0:postConsentStorageOpts.entries)){globalStorageType=postConsentStorageOpts===null||postConsentStorageOpts===void 0?void 0:postConsentStorageOpts.type;entriesOptions=postConsentStorageOpts===null||postConsentStorageOpts===void 0?void 0:postConsentStorageOpts.entries;}var trulyAnonymousTracking=true;var storageEntries={};USER_SESSION_KEYS.forEach(function(sessionKey){var _entriesOptions,_ref,_ref2;var key=sessionKey;var storageKey=sessionKey;var configuredStorageType=(_entriesOptions=entriesOptions)===null||_entriesOptions===void 0||(_entriesOptions=_entriesOptions[key])===null||_entriesOptions===void 0?void 0:_entriesOptions.type;var preConsentStorageType=getStorageTypeFromPreConsentIfApplicable(state,sessionKey);// Storage type precedence order: pre-consent strategy > entry type > global type > default
                var storageType=(_ref=(_ref2=preConsentStorageType!==null&&preConsentStorageType!==void 0?preConsentStorageType:configuredStorageType)!==null&&_ref2!==void 0?_ref2:globalStorageType)!==null&&_ref!==void 0?_ref:DEFAULT_STORAGE_TYPE;var finalStorageType=_this2.getResolvedStorageTypeForEntry(storageType,sessionKey);if(finalStorageType!==NO_STORAGE){trulyAnonymousTracking=false;}storageEntries=_objectSpread2(_objectSpread2({},storageEntries),{},_defineProperty({},sessionKey,{type:finalStorageType,key:USER_SESSION_STORAGE_KEYS[storageKey]}));});n(function(){state.storage.type.value=globalStorageType;state.storage.entries.value=storageEntries;state.storage.trulyAnonymousTracking.value=trulyAnonymousTracking;});}},{key:"getResolvedStorageTypeForEntry",value:function getResolvedStorageTypeForEntry(storageType,sessionKey){var _getStorageEngine2,_getStorageEngine3,_getStorageEngine4,_getStorageEngine5,_getStorageEngine6;var finalStorageType=storageType;switch(storageType){case LOCAL_STORAGE:if(!((_getStorageEngine2=getStorageEngine(LOCAL_STORAGE))!==null&&_getStorageEngine2!==void 0&&_getStorageEngine2.isEnabled)){finalStorageType=MEMORY_STORAGE;}break;case SESSION_STORAGE:if(!((_getStorageEngine3=getStorageEngine(SESSION_STORAGE))!==null&&_getStorageEngine3!==void 0&&_getStorageEngine3.isEnabled)){finalStorageType=MEMORY_STORAGE;}break;case MEMORY_STORAGE:case NO_STORAGE:break;case COOKIE_STORAGE:default:// First try setting the storage to cookie else to local storage
            if((_getStorageEngine4=getStorageEngine(COOKIE_STORAGE))!==null&&_getStorageEngine4!==void 0&&_getStorageEngine4.isEnabled){finalStorageType=COOKIE_STORAGE;}else if((_getStorageEngine5=getStorageEngine(LOCAL_STORAGE))!==null&&_getStorageEngine5!==void 0&&_getStorageEngine5.isEnabled){finalStorageType=LOCAL_STORAGE;}else if((_getStorageEngine6=getStorageEngine(SESSION_STORAGE))!==null&&_getStorageEngine6!==void 0&&_getStorageEngine6.isEnabled){finalStorageType=SESSION_STORAGE;}else {finalStorageType=MEMORY_STORAGE;}break;}if(finalStorageType!==storageType){var _this$logger;(_this$logger=this.logger)===null||_this$logger===void 0||_this$logger.warn(STORAGE_UNAVAILABLE_WARNING(STORE_MANAGER,sessionKey,storageType,finalStorageType));}return finalStorageType;}/**
         * Create a new store
         */},{key:"setStore",value:function setStore(storeConfig){var storageEngine=getStorageEngine(storeConfig.type);this.stores[storeConfig.id]=new Store(storeConfig,storageEngine,this.pluginsManager);return this.stores[storeConfig.id];}/**
         * Retrieve a store
         */},{key:"getStore",value:function getStore(id){return this.stores[id];}/**
         * Handle errors
         */},{key:"onError",value:function onError(error){if(this.hasErrorHandler){var _this$errorHandler;(_this$errorHandler=this.errorHandler)===null||_this$errorHandler===void 0||_this$errorHandler.onError(error,STORE_MANAGER);}else {throw error;}}}]);return StoreManager;}();

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

    /**
     * Plugins to be loaded in the plugins loadOption is not defined
     */var defaultOptionalPluginsList=['BeaconQueue','Bugsnag','CustomConsentManager','DeviceModeDestinations','DeviceModeTransformation','ErrorReporting','ExternalAnonymousId','GoogleLinker','KetchConsentManager','NativeDestinationQueue','OneTrustConsentManager','StorageEncryption','StorageEncryptionLegacy','StorageMigrator','XhrQueue'];

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

    var normalizeLoadOptions=function normalizeLoadOptions(loadOptionsFromState,loadOptions){var _normalizedLoadOpts$p,_normalizedLoadOpts$s2;// TODO: Maybe add warnings for invalid values
        var normalizedLoadOpts=clone$1(loadOptions);if(!isString(normalizedLoadOpts.setCookieDomain)){delete normalizedLoadOpts.setCookieDomain;}var cookieSameSiteValues=['Strict','Lax','None'];if(!cookieSameSiteValues.includes(normalizedLoadOpts.sameSiteCookie)){delete normalizedLoadOpts.sameSiteCookie;}normalizedLoadOpts.secureCookie=normalizedLoadOpts.secureCookie===true;var uaChTrackLevels=['none','default','full'];if(!uaChTrackLevels.includes(normalizedLoadOpts.uaChTrackLevel)){delete normalizedLoadOpts.uaChTrackLevel;}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.integrations)){delete normalizedLoadOpts.integrations;}normalizedLoadOpts.plugins=(_normalizedLoadOpts$p=normalizedLoadOpts.plugins)!==null&&_normalizedLoadOpts$p!==void 0?_normalizedLoadOpts$p:defaultOptionalPluginsList;normalizedLoadOpts.useGlobalIntegrationsConfigInEvents=normalizedLoadOpts.useGlobalIntegrationsConfigInEvents===true;normalizedLoadOpts.bufferDataPlaneEventsUntilReady=normalizedLoadOpts.bufferDataPlaneEventsUntilReady===true;normalizedLoadOpts.sendAdblockPage=normalizedLoadOpts.sendAdblockPage===true;if(!isObjectLiteralAndNotNull(normalizedLoadOpts.sendAdblockPageOptions)){delete normalizedLoadOpts.sendAdblockPageOptions;}if(!isDefined(normalizedLoadOpts.loadIntegration)){delete normalizedLoadOpts.loadIntegration;}else {normalizedLoadOpts.loadIntegration=normalizedLoadOpts.loadIntegration===true;}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.storage)){delete normalizedLoadOpts.storage;}else {var _normalizedLoadOpts$s;normalizedLoadOpts.storage=removeUndefinedAndNullValues(normalizedLoadOpts.storage);normalizedLoadOpts.storage.migrate=((_normalizedLoadOpts$s=normalizedLoadOpts.storage)===null||_normalizedLoadOpts$s===void 0?void 0:_normalizedLoadOpts$s.migrate)===true;}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.beaconQueueOptions)){delete normalizedLoadOpts.beaconQueueOptions;}else {normalizedLoadOpts.beaconQueueOptions=removeUndefinedAndNullValues(normalizedLoadOpts.beaconQueueOptions);}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.destinationsQueueOptions)){delete normalizedLoadOpts.destinationsQueueOptions;}else {normalizedLoadOpts.destinationsQueueOptions=removeUndefinedAndNullValues(normalizedLoadOpts.destinationsQueueOptions);}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.queueOptions)){delete normalizedLoadOpts.queueOptions;}else {normalizedLoadOpts.queueOptions=removeUndefinedAndNullValues(normalizedLoadOpts.queueOptions);}normalizedLoadOpts.lockIntegrationsVersion=normalizedLoadOpts.lockIntegrationsVersion===true;if(!isNumber(normalizedLoadOpts.dataPlaneEventsBufferTimeout)){delete normalizedLoadOpts.dataPlaneEventsBufferTimeout;}if(!isObjectLiteralAndNotNull((_normalizedLoadOpts$s2=normalizedLoadOpts.storage)===null||_normalizedLoadOpts$s2===void 0?void 0:_normalizedLoadOpts$s2.cookie)){var _normalizedLoadOpts$s3;(_normalizedLoadOpts$s3=normalizedLoadOpts.storage)===null||_normalizedLoadOpts$s3===void 0||delete _normalizedLoadOpts$s3.cookie;}else {var _normalizedLoadOpts$s4;normalizedLoadOpts.storage.cookie=removeUndefinedAndNullValues((_normalizedLoadOpts$s4=normalizedLoadOpts.storage)===null||_normalizedLoadOpts$s4===void 0?void 0:_normalizedLoadOpts$s4.cookie);}if(!isObjectLiteralAndNotNull(normalizedLoadOpts.preConsent)){delete normalizedLoadOpts.preConsent;}else {normalizedLoadOpts.preConsent=removeUndefinedAndNullValues(normalizedLoadOpts.preConsent);}var mergedLoadOptions=mergeDeepRight(loadOptionsFromState,normalizedLoadOpts);return mergedLoadOptions;};var getSourceConfigURL=function getSourceConfigURL(configUrl,writeKey,lockIntegrationsVersion,logger){var defSearchParams=new URLSearchParams({p:MODULE_TYPE,v:APP_VERSION,build:BUILD_TYPE,writeKey:writeKey,lockIntegrationsVersion:lockIntegrationsVersion.toString()});var origin=DEFAULT_CONFIG_BE_URL;var searchParams=defSearchParams;var pathname='/sourceConfig/';var hash='';// Ideally, this check is not required but URL polyfill
// doesn't seem to throw errors for empty URLs
// TODO: Need to improve this check to find out if the URL is valid or not
        if(configUrl){try{var configUrlInstance=new URL(configUrl);if(!removeTrailingSlashes(configUrlInstance.pathname).endsWith('/sourceConfig')){configUrlInstance.pathname="".concat(removeTrailingSlashes(configUrlInstance.pathname),"/sourceConfig/");}configUrlInstance.pathname=removeDuplicateSlashes(configUrlInstance.pathname);defSearchParams.forEach(function(value,key){if(configUrlInstance.searchParams.get(key)===null){configUrlInstance.searchParams.set(key,value);}});origin=configUrlInstance.origin;pathname=configUrlInstance.pathname;searchParams=configUrlInstance.searchParams;hash=configUrlInstance.hash;}catch(err){logger===null||logger===void 0||logger.warn(INVALID_CONFIG_URL_WARNING(CONFIG_MANAGER,configUrl));}}return "".concat(origin).concat(pathname,"?").concat(searchParams).concat(hash);};

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
     */var getDefaultUrlOfRegion=function getDefaultUrlOfRegion(urls){var url;if(Array.isArray(urls)&&urls.length>0){var obj=urls.find(function(elem){return elem.default===true;});if(obj&&isValidUrl(obj.url)){return obj.url;}}return url;};var validateResidencyServerRegion=function validateResidencyServerRegion(residencyServerRegion,logger){var residencyServerRegions=['US','EU'];if(residencyServerRegion&&!residencyServerRegions.includes(residencyServerRegion)){logger===null||logger===void 0||logger.warn(UNSUPPORTED_RESIDENCY_SERVER_REGION_WARNING(CONFIG_MANAGER,residencyServerRegion,DEFAULT_REGION));return undefined;}return residencyServerRegion;};/**
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

    var DEFAULT_PRE_CONSENT_STORAGE_STRATEGY='none';var DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE='immediate';

    var isErrorReportingEnabled=function isErrorReportingEnabled(sourceConfig){var _sourceConfig$statsCo;return (sourceConfig===null||sourceConfig===void 0||(_sourceConfig$statsCo=sourceConfig.statsCollection)===null||_sourceConfig$statsCo===void 0||(_sourceConfig$statsCo=_sourceConfig$statsCo.errors)===null||_sourceConfig$statsCo===void 0?void 0:_sourceConfig$statsCo.enabled)===true;};var getErrorReportingProviderNameFromConfig=function getErrorReportingProviderNameFromConfig(sourceConfig){var _sourceConfig$statsCo2;return sourceConfig===null||sourceConfig===void 0||(_sourceConfig$statsCo2=sourceConfig.statsCollection)===null||_sourceConfig$statsCo2===void 0||(_sourceConfig$statsCo2=_sourceConfig$statsCo2.errors)===null||_sourceConfig$statsCo2===void 0?void 0:_sourceConfig$statsCo2.provider;};var isMetricsReportingEnabled=function isMetricsReportingEnabled(sourceConfig){var _sourceConfig$statsCo3;return (sourceConfig===null||sourceConfig===void 0||(_sourceConfig$statsCo3=sourceConfig.statsCollection)===null||_sourceConfig$statsCo3===void 0||(_sourceConfig$statsCo3=_sourceConfig$statsCo3.metrics)===null||_sourceConfig$statsCo3===void 0?void 0:_sourceConfig$statsCo3.enabled)===true;};

    /**
     * Validates and normalizes the consent options provided by the user
     * @param options Consent options provided by the user
     * @returns Validated and normalized consent options
     */var getValidPostConsentOptions=function getValidPostConsentOptions(options){var validOptions={sendPageEvent:false,trackConsent:false,discardPreConsentEvents:false};if(isObjectLiteralAndNotNull(options)){var _clonedOptions$integr;var clonedOptions=clone$1(options);validOptions.storage=clonedOptions.storage;validOptions.integrations=(_clonedOptions$integr=clonedOptions.integrations)!==null&&_clonedOptions$integr!==void 0?_clonedOptions$integr:DEFAULT_INTEGRATIONS_CONFIG;validOptions.discardPreConsentEvents=clonedOptions.discardPreConsentEvents===true;validOptions.sendPageEvent=clonedOptions.sendPageEvent===true;validOptions.trackConsent=clonedOptions.trackConsent===true;if(isNonEmptyObject(clonedOptions.consentManagement)){// Override enabled value with the current state value
        validOptions.consentManagement=mergeDeepRight(clonedOptions.consentManagement,{enabled:state.consents.enabled.value});}}return validOptions;};/**
     * Validates if the input is a valid consents data
     * @param value Input consents data
     * @returns true if the input is a valid consents data else false
     */var isValidConsentsData=function isValidConsentsData(value){return isNonEmptyObject(value)||Array.isArray(value);};/**
     * Retrieves the corresponding provider and plugin name of the selected consent manager from the supported consent managers
     * @param consentManagementOpts consent management options
     * @param logger logger instance
     * @returns Corresponding provider and plugin name of the selected consent manager from the supported consent managers
     */var getConsentManagerInfo=function getConsentManagerInfo(consentManagementOpts,logger){var provider=consentManagementOpts.provider;var consentManagerPluginName=ConsentManagersToPluginNameMap[provider];if(provider&&!consentManagerPluginName){logger===null||logger===void 0||logger.error(UNSUPPORTED_CONSENT_MANAGER_ERROR(CONFIG_MANAGER,provider,ConsentManagersToPluginNameMap));// Reset the provider value
        provider=undefined;}return {provider:provider,consentManagerPluginName:consentManagerPluginName};};/**
     * Validates and converts the consent management options into a normalized format
     * @param consentManagementOpts Consent management options provided by the user
     * @param logger logger instance
     * @returns An object containing the consent manager plugin name, initialized, enabled and consents data
     */var getConsentManagementData=function getConsentManagementData(consentManagementOpts,logger){var consentManagerPluginName;var allowedConsentIds=[];var deniedConsentIds=[];var initialized=false;var provider;var enabled=(consentManagementOpts===null||consentManagementOpts===void 0?void 0:consentManagementOpts.enabled)===true;if(isNonEmptyObject(consentManagementOpts)&&enabled){// Get the corresponding plugin name of the selected consent manager from the supported consent managers
        var _getConsentManagerInf=getConsentManagerInfo(consentManagementOpts,logger);provider=_getConsentManagerInf.provider;consentManagerPluginName=_getConsentManagerInf.consentManagerPluginName;if(isValidConsentsData(consentManagementOpts.allowedConsentIds)){allowedConsentIds=consentManagementOpts.allowedConsentIds;initialized=true;}if(isValidConsentsData(consentManagementOpts.deniedConsentIds)){deniedConsentIds=consentManagementOpts.deniedConsentIds;initialized=true;}}var consentsData={allowedConsentIds:allowedConsentIds,deniedConsentIds:deniedConsentIds};// Enable consent management only if consent manager is supported
        enabled=enabled&&Boolean(consentManagerPluginName);return {provider:provider,consentManagerPluginName:consentManagerPluginName,initialized:initialized,enabled:enabled,consentsData:consentsData};};

    /**
     * Determines the SDK url
     * @returns sdkURL
     */var getSDKUrl=function getSDKUrl(){var scripts=document.getElementsByTagName('script');var sdkURL;var scriptList=Array.prototype.slice.call(scripts);scriptList.some(function(script){var curScriptSrc=removeTrailingSlashes(script.getAttribute('src'));if(curScriptSrc){var urlMatches=curScriptSrc.match(/^.*rsa?(\.min)?\.js$/);if(urlMatches){sdkURL=curScriptSrc;return true;}}return false;});return sdkURL;};/**
     * Updates the reporting state variables from the source config data
     * @param res Source config
     * @param logger Logger instance
     */var updateReportingState=function updateReportingState(res,logger){state.reporting.isErrorReportingEnabled.value=isErrorReportingEnabled(res.source.config);state.reporting.isMetricsReportingEnabled.value=isMetricsReportingEnabled(res.source.config);if(state.reporting.isErrorReportingEnabled.value){var errReportingProvider=getErrorReportingProviderNameFromConfig(res.source.config);// Get the corresponding plugin name of the selected error reporting provider from the supported error reporting providers
        var errReportingProviderPlugin=errReportingProvider?ErrorReportingProvidersToPluginNameMap[errReportingProvider]:undefined;if(!isUndefined(errReportingProvider)&&!errReportingProviderPlugin){// set the default error reporting provider
            logger===null||logger===void 0||logger.warn(UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING(CONFIG_MANAGER,errReportingProvider,ErrorReportingProvidersToPluginNameMap,DEFAULT_ERROR_REPORTING_PROVIDER));}state.reporting.errorReportingProviderPluginName.value=errReportingProviderPlugin!==null&&errReportingProviderPlugin!==void 0?errReportingProviderPlugin:ErrorReportingProvidersToPluginNameMap[DEFAULT_ERROR_REPORTING_PROVIDER];}};var updateStorageStateFromLoadOptions=function updateStorageStateFromLoadOptions(logger){var _storageOptsFromLoad$;var storageOptsFromLoad=state.loadOptions.value.storage;var storageType=storageOptsFromLoad===null||storageOptsFromLoad===void 0?void 0:storageOptsFromLoad.type;if(isDefined(storageType)&&!isValidStorageType(storageType)){logger===null||logger===void 0||logger.warn(STORAGE_TYPE_VALIDATION_WARNING(CONFIG_MANAGER,storageType,DEFAULT_STORAGE_TYPE));storageType=DEFAULT_STORAGE_TYPE;}var storageEncryptionVersion=storageOptsFromLoad===null||storageOptsFromLoad===void 0||(_storageOptsFromLoad$=storageOptsFromLoad.encryption)===null||_storageOptsFromLoad$===void 0?void 0:_storageOptsFromLoad$.version;var encryptionPluginName=storageEncryptionVersion&&StorageEncryptionVersionsToPluginNameMap[storageEncryptionVersion];if(!isUndefined(storageEncryptionVersion)&&isUndefined(encryptionPluginName)){// set the default encryption plugin
        logger===null||logger===void 0||logger.warn(UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING(CONFIG_MANAGER,storageEncryptionVersion,StorageEncryptionVersionsToPluginNameMap,DEFAULT_STORAGE_ENCRYPTION_VERSION));storageEncryptionVersion=DEFAULT_STORAGE_ENCRYPTION_VERSION;}else if(isUndefined(storageEncryptionVersion)){storageEncryptionVersion=DEFAULT_STORAGE_ENCRYPTION_VERSION;}// Allow migration only if the configured encryption version is the default encryption version
        var configuredMigrationValue=storageOptsFromLoad===null||storageOptsFromLoad===void 0?void 0:storageOptsFromLoad.migrate;var finalMigrationVal=configuredMigrationValue&&storageEncryptionVersion===DEFAULT_STORAGE_ENCRYPTION_VERSION;if(configuredMigrationValue===true&&finalMigrationVal!==configuredMigrationValue){logger===null||logger===void 0||logger.warn(STORAGE_DATA_MIGRATION_OVERRIDE_WARNING(CONFIG_MANAGER,storageEncryptionVersion,DEFAULT_STORAGE_ENCRYPTION_VERSION));}n(function(){state.storage.type.value=storageType;state.storage.cookie.value=storageOptsFromLoad===null||storageOptsFromLoad===void 0?void 0:storageOptsFromLoad.cookie;state.storage.encryptionPluginName.value=StorageEncryptionVersionsToPluginNameMap[storageEncryptionVersion];state.storage.migrate.value=finalMigrationVal;});};var updateConsentsStateFromLoadOptions=function updateConsentsStateFromLoadOptions(logger){var _preConsentOpts$stora,_preConsentOpts$stora2,_preConsentOpts$event,_preConsentOpts$event2;var _getConsentManagement=getConsentManagementData(state.loadOptions.value.consentManagement,logger),provider=_getConsentManagement.provider,consentManagerPluginName=_getConsentManagement.consentManagerPluginName,initialized=_getConsentManagement.initialized,enabled=_getConsentManagement.enabled,consentsData=_getConsentManagement.consentsData;// Pre-consent
        var preConsentOpts=state.loadOptions.value.preConsent;var storageStrategy=(_preConsentOpts$stora=preConsentOpts===null||preConsentOpts===void 0||(_preConsentOpts$stora2=preConsentOpts.storage)===null||_preConsentOpts$stora2===void 0?void 0:_preConsentOpts$stora2.strategy)!==null&&_preConsentOpts$stora!==void 0?_preConsentOpts$stora:DEFAULT_PRE_CONSENT_STORAGE_STRATEGY;var StorageStrategies=['none','session','anonymousId'];if(isDefined(storageStrategy)&&!StorageStrategies.includes(storageStrategy)){var _preConsentOpts$stora3;storageStrategy=DEFAULT_PRE_CONSENT_STORAGE_STRATEGY;logger===null||logger===void 0||logger.warn(UNSUPPORTED_PRE_CONSENT_STORAGE_STRATEGY(CONFIG_MANAGER,preConsentOpts===null||preConsentOpts===void 0||(_preConsentOpts$stora3=preConsentOpts.storage)===null||_preConsentOpts$stora3===void 0?void 0:_preConsentOpts$stora3.strategy,DEFAULT_PRE_CONSENT_STORAGE_STRATEGY));}var eventsDeliveryType=(_preConsentOpts$event=preConsentOpts===null||preConsentOpts===void 0||(_preConsentOpts$event2=preConsentOpts.events)===null||_preConsentOpts$event2===void 0?void 0:_preConsentOpts$event2.delivery)!==null&&_preConsentOpts$event!==void 0?_preConsentOpts$event:DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE;var deliveryTypes=['immediate','buffer'];if(isDefined(eventsDeliveryType)&&!deliveryTypes.includes(eventsDeliveryType)){var _preConsentOpts$event3;eventsDeliveryType=DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE;logger===null||logger===void 0||logger.warn(UNSUPPORTED_PRE_CONSENT_EVENTS_DELIVERY_TYPE(CONFIG_MANAGER,preConsentOpts===null||preConsentOpts===void 0||(_preConsentOpts$event3=preConsentOpts.events)===null||_preConsentOpts$event3===void 0?void 0:_preConsentOpts$event3.delivery,DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE));}n(function(){var _state$loadOptions$va;state.consents.activeConsentManagerPluginName.value=consentManagerPluginName;state.consents.initialized.value=initialized;state.consents.enabled.value=enabled;state.consents.data.value=consentsData;state.consents.provider.value=provider;state.consents.preConsent.value={// Only enable pre-consent if it is explicitly enabled and
// if it is not already initialized and
// if consent management is enabled
            enabled:((_state$loadOptions$va=state.loadOptions.value.preConsent)===null||_state$loadOptions$va===void 0?void 0:_state$loadOptions$va.enabled)===true&&initialized===false&&enabled===true,storage:{strategy:storageStrategy},events:{delivery:eventsDeliveryType}};});};/**
     * Determines the consent management state variables from the source config data
     * @param resp Source config response
     * @param logger Logger instance
     */var updateConsentsState=function updateConsentsState(resp){var resolutionStrategy=state.consents.resolutionStrategy.value;var cmpMetadata;if(isObjectLiteralAndNotNull(resp.consentManagementMetadata)){if(state.consents.provider.value){var _resp$consentManageme,_resp$consentManageme2;resolutionStrategy=(_resp$consentManageme=(_resp$consentManageme2=resp.consentManagementMetadata.providers.find(function(p){return p.provider===state.consents.provider.value;}))===null||_resp$consentManageme2===void 0?void 0:_resp$consentManageme2.resolutionStrategy)!==null&&_resp$consentManageme!==void 0?_resp$consentManageme:state.consents.resolutionStrategy.value;}cmpMetadata=resp.consentManagementMetadata;}// If the provider is custom, then the resolution strategy is not applicable
        if(state.consents.provider.value==='custom'){resolutionStrategy=undefined;}n(function(){state.consents.metadata.value=clone$1(cmpMetadata);state.consents.resolutionStrategy.value=resolutionStrategy;});};

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

    var ConfigManager=/*#__PURE__*/function(){function ConfigManager(httpClient,errorHandler,logger){_classCallCheck(this,ConfigManager);_defineProperty(this,"hasErrorHandler",false);this.errorHandler=errorHandler;this.logger=logger;this.httpClient=httpClient;this.hasErrorHandler=Boolean(this.errorHandler);this.onError=this.onError.bind(this);this.processConfig=this.processConfig.bind(this);}_createClass(ConfigManager,[{key:"attachEffects",value:function attachEffects(){var _this=this;O(function(){var _this$logger;(_this$logger=_this.logger)===null||_this$logger===void 0||_this$logger.setMinLogLevel(state.lifecycle.logLevel.value);});}/**
         * A function to validate, construct and store loadOption, lifecycle, source and destination
         * config related information in global state
         */},{key:"init",value:function init(){var _this2=this;this.attachEffects();validateLoadArgs(state.lifecycle.writeKey.value,state.lifecycle.dataPlaneUrl.value);var lockIntegrationsVersion=state.loadOptions.value.lockIntegrationsVersion;// determine the path to fetch integration SDK from
            var intgCdnUrl=getIntegrationsCDNPath(APP_VERSION,lockIntegrationsVersion,state.loadOptions.value.destSDKBaseURL);// determine the path to fetch remote plugins from
            var pluginsCDNPath=getPluginsCDNPath(state.loadOptions.value.pluginsSDKBaseURL);updateStorageStateFromLoadOptions(this.logger);updateConsentsStateFromLoadOptions(this.logger);// set application lifecycle state in global state
            n(function(){state.lifecycle.integrationsCDNPath.value=intgCdnUrl;state.lifecycle.pluginsCDNPath.value=pluginsCDNPath;if(state.loadOptions.value.logLevel){state.lifecycle.logLevel.value=state.loadOptions.value.logLevel;}state.lifecycle.sourceConfigUrl.value=getSourceConfigURL(state.loadOptions.value.configUrl,state.lifecycle.writeKey.value,lockIntegrationsVersion,_this2.logger);});this.getConfig();}/**
         * Handle errors
         */},{key:"onError",value:function onError(error,customMessage,shouldAlwaysThrow){if(this.hasErrorHandler){var _this$errorHandler;(_this$errorHandler=this.errorHandler)===null||_this$errorHandler===void 0||_this$errorHandler.onError(error,CONFIG_MANAGER,customMessage,shouldAlwaysThrow);}else {throw error;}}/**
         * A callback function that is executed once we fetch the source config response.
         * Use to construct and store information that are dependent on the sourceConfig.
         */},{key:"processConfig",value:function processConfig(response,details){// TODO: add retry logic with backoff based on rejectionDetails.xhr.status
// We can use isErrRetryable utility method
            if(!response){this.onError(SOURCE_CONFIG_FETCH_ERROR(details===null||details===void 0?void 0:details.error));return;}var res;try{if(isString(response)){res=JSON.parse(response);}else {res=response;}}catch(err){this.onError(err,SOURCE_CONFIG_RESOLUTION_ERROR,true);return;}if(!isValidSourceConfig(res)){this.onError(new Error(SOURCE_CONFIG_RESOLUTION_ERROR),undefined,true);return;}// set the values in state for reporting slice
            updateReportingState(res,this.logger);// determine the dataPlane url
            var dataPlaneUrl=resolveDataPlaneUrl(res.source.dataplanes,state.lifecycle.dataPlaneUrl.value,state.loadOptions.value.residencyServer,this.logger);if(!dataPlaneUrl){this.onError(new Error(DATA_PLANE_URL_ERROR),undefined,true);return;}var nativeDestinations=res.source.destinations.length>0?filterEnabledDestination(res.source.destinations):[];// set in the state --> source, destination, lifecycle, reporting
            n(function(){var _state$loadOptions$va;// set source related information in state
                state.source.value={config:res.source.config,id:res.source.id};// set device mode destination related information in state
                state.nativeDestinations.configuredDestinations.value=nativeDestinations;// set the desired optional plugins
                state.plugins.pluginsToLoadFromConfig.value=(_state$loadOptions$va=state.loadOptions.value.plugins)!==null&&_state$loadOptions$va!==void 0?_state$loadOptions$va:[];updateConsentsState(res);// set application lifecycle state
// Cast to string as we are sure that the value is not undefined
                state.lifecycle.activeDataplaneUrl.value=removeTrailingSlashes(dataPlaneUrl);state.lifecycle.status.value='configured';});}/**
         * A function to fetch source config either from /sourceConfig endpoint
         * or from getSourceConfig load option
         * @returns
         */},{key:"getConfig",value:function getConfig(){var _this3=this;var sourceConfigFunc=state.loadOptions.value.getSourceConfig;if(sourceConfigFunc){if(!isFunction(sourceConfigFunc)){throw new Error(SOURCE_CONFIG_OPTION_ERROR);}// fetch source config from the function
            var res=sourceConfigFunc();if(res instanceof Promise){res.then(function(pRes){return _this3.processConfig(pRes);}).catch(function(err){_this3.onError(err,'SourceConfig');});}else {this.processConfig(res);}}else {// fetch source config from config url API
            this.httpClient.getAsyncData({url:state.lifecycle.sourceConfigUrl.value,options:{headers:{'Content-Type':undefined}},callback:this.processConfig});}}}]);return ConfigManager;}();

    /**
     * To get the timezone of the user
     *
     * @returns string
     */var getTimezone=function getTimezone(){var timezone=new Date().toString().match(/([A-Z]+[+-]\d+)/);return timezone&&timezone[1]?timezone[1]:'NA';};

    /**
     * Get the referrer URL
     * @returns The referrer URL
     */var getReferrer=function getReferrer(){var _document;return ((_document=document)===null||_document===void 0?void 0:_document.referrer)||'$direct';};/**
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
        }}var url=getUrlWithoutHash(pageUrl);var _document2=document,title=_document2.title;var referrer=getReferrer();return {path:path,referrer:referrer,referring_domain:getReferringDomain(referrer),search:search,title:title,url:url,tab_url:tabUrl};};

    var POLYFILL_URL="https://polyfill.io/v3/polyfill.min.js?features=".concat(Object.keys(legacyJSEngineRequiredPolyfills).join('%2C'));var POLYFILL_LOAD_TIMEOUT=10*1000;// 10 seconds
    var POLYFILL_SCRIPT_ID='rudderstackPolyfill';

    var CapabilitiesManager=/*#__PURE__*/function(){function CapabilitiesManager(errorHandler,logger){_classCallCheck(this,CapabilitiesManager);this.logger=logger;this.errorHandler=errorHandler;this.externalSrcLoader=new ExternalSrcLoader(this.errorHandler,this.logger);this.onError=this.onError.bind(this);this.onReady=this.onReady.bind(this);}_createClass(CapabilitiesManager,[{key:"init",value:function init(){try{this.prepareBrowserCapabilities();this.attachWindowListeners();}catch(err){this.onError(err);}}/**
         * Detect supported capabilities and set values in state
         */ // eslint-disable-next-line class-methods-use-this
    },{key:"detectBrowserCapabilities",value:function detectBrowserCapabilities(){var _this=this;n(function(){// Storage related details
            state.capabilities.storage.isCookieStorageAvailable.value=isStorageAvailable(COOKIE_STORAGE,getStorageEngine(COOKIE_STORAGE),_this.logger);state.capabilities.storage.isLocalStorageAvailable.value=isStorageAvailable(LOCAL_STORAGE,undefined,_this.logger);state.capabilities.storage.isSessionStorageAvailable.value=isStorageAvailable(SESSION_STORAGE,undefined,_this.logger);// Browser feature detection details
            state.capabilities.isBeaconAvailable.value=hasBeacon();state.capabilities.isUaCHAvailable.value=hasUAClientHints();state.capabilities.isCryptoAvailable.value=hasCrypto();state.capabilities.isIE11.value=isIE11();state.capabilities.isOnline.value=globalThis.navigator.onLine;// Get page context details
            state.context.userAgent.value=getUserAgent();state.context.locale.value=getLanguage();state.context.screen.value=getScreenDetails();state.context.timezone.value=getTimezone();if(hasUAClientHints()){getUserAgentClientHint(function(uach){state.context['ua-ch'].value=uach;},state.loadOptions.value.uaChTrackLevel);}});// Ad blocker detection
            O(function(){if(state.loadOptions.value.sendAdblockPage===true&&state.lifecycle.sourceConfigUrl.value!==undefined){detectAdBlockers(_this.errorHandler,_this.logger);}});}/**
         * Detect if polyfills are required and then load script from polyfill URL
         */},{key:"prepareBrowserCapabilities",value:function prepareBrowserCapabilities(){var _state$loadOptions$va,_this2=this;state.capabilities.isLegacyDOM.value=isLegacyJSEngine();var polyfillUrl=(_state$loadOptions$va=state.loadOptions.value.polyfillURL)!==null&&_state$loadOptions$va!==void 0?_state$loadOptions$va:POLYFILL_URL;var shouldLoadPolyfill=state.loadOptions.value.polyfillIfRequired&&state.capabilities.isLegacyDOM.value&&Boolean(polyfillUrl);if(shouldLoadPolyfill){var _this$externalSrcLoad;var isDefaultPolyfillService=polyfillUrl!==state.loadOptions.value.polyfillURL;if(isDefaultPolyfillService){// write key specific callback
// NOTE: we're not putting this into RudderStackGlobals as providing the property path to the callback function in the polyfill URL is not possible
            var polyfillCallbackName="RS_polyfillCallback_".concat(state.lifecycle.writeKey.value);var polyfillCallback=function polyfillCallback(){_this2.onReady();// Remove the entry from window so we don't leave room for calling it again
                delete globalThis[polyfillCallbackName];};globalThis[polyfillCallbackName]=polyfillCallback;polyfillUrl="".concat(polyfillUrl,"&callback=").concat(polyfillCallbackName);}(_this$externalSrcLoad=this.externalSrcLoader)===null||_this$externalSrcLoad===void 0||_this$externalSrcLoad.loadJSFile({url:polyfillUrl,id:POLYFILL_SCRIPT_ID,async:true,timeout:POLYFILL_LOAD_TIMEOUT,callback:function callback(scriptId){if(!scriptId){_this2.onError(new Error(POLYFILL_SCRIPT_LOAD_ERROR(POLYFILL_SCRIPT_ID,polyfillUrl)));}else if(!isDefaultPolyfillService){_this2.onReady();}}});}else {this.onReady();}}/**
         * Attach listeners to window to observe event that update capabilities state values
         */},{key:"attachWindowListeners",value:function attachWindowListeners(){globalThis.addEventListener('offline',function(){state.capabilities.isOnline.value=false;});globalThis.addEventListener('online',function(){state.capabilities.isOnline.value=true;});globalThis.addEventListener('resize',debounce(function(){state.context.screen.value=getScreenDetails();},this));}/**
         * Set the lifecycle status to next phase
         */ // eslint-disable-next-line class-methods-use-this
    },{key:"onReady",value:function onReady(){this.detectBrowserCapabilities();state.lifecycle.status.value='browserCapabilitiesReady';}/**
         * Handles error
         * @param error The error object
         */},{key:"onError",value:function onError(error){if(this.errorHandler){this.errorHandler.onError(error,CAPABILITIES_MANAGER);}else {throw error;}}}]);return CapabilitiesManager;}();

    var CHANNEL='web';// These are the top-level elements in the standard RudderStack event spec
    var TOP_LEVEL_ELEMENTS=['integrations','anonymousId','originalTimestamp'];// Reserved elements in the context of standard RudderStack event spec
// Typically, these elements are not allowed to be overridden by the user
    var CONTEXT_RESERVED_ELEMENTS=['library','consentManagement','userAgent','ua-ch','screen'];// Reserved elements in the standard RudderStack event spec
    var RESERVED_ELEMENTS=['anonymousId','sentAt','receivedAt','timestamp','originalTimestamp','event','messageId','channel'];

    var MIN_SESSION_ID_LENGTH=10;/**
     * A function to validate current session and return true/false depending on that
     * @returns boolean
     */var hasSessionExpired=function hasSessionExpired(expiresAt){var timestamp=Date.now();return Boolean(!expiresAt||timestamp>expiresAt);};/**
     * A function to generate session id
     * @returns number
     */var generateSessionId=function generateSessionId(){return Date.now();};/**
     * Function to validate user provided sessionId
     * @param {number} sessionId
     * @param logger logger
     * @returns
     */var isManualSessionIdValid=function isManualSessionIdValid(sessionId,logger){if(!sessionId||!isPositiveInteger(sessionId)||!hasMinLength(MIN_SESSION_ID_LENGTH,sessionId)){logger===null||logger===void 0||logger.warn(INVALID_SESSION_ID_WARNING(USER_SESSION_MANAGER,sessionId,MIN_SESSION_ID_LENGTH));return false;}return true;};/**
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
     */var generateManualTrackingSession=function generateManualTrackingSession(id,logger){var sessionId=isManualSessionIdValid(id,logger)?id:generateSessionId();return {id:sessionId,sessionStart:undefined,manualTrack:true};};var isStorageTypeValidForStoringData=function isStorageTypeValidForStoringData(storageType){return Boolean(storageType===COOKIE_STORAGE||storageType===LOCAL_STORAGE||storageType===SESSION_STORAGE||storageType===MEMORY_STORAGE);};/**
     * Generate a new anonymousId
     * @returns string anonymousID
     */var generateAnonymousId=function generateAnonymousId(){return generateUUID();};

    /**
     * To get the page properties for context object
     * @param pageProps Page properties
     * @returns page properties object for context
     */var getContextPageProperties=function getContextPageProperties(pageProps){// Need to get updated page details on each event as an event to notify on SPA url changes does not seem to exist
        var curPageProps=getDefaultPageProperties();var ctxPageProps={};Object.keys(curPageProps).forEach(function(key){ctxPageProps[key]=(pageProps===null||pageProps===void 0?void 0:pageProps[key])||curPageProps[key];});ctxPageProps.initial_referrer=(pageProps===null||pageProps===void 0?void 0:pageProps.initial_referrer)||state.session.initialReferrer.value;ctxPageProps.initial_referring_domain=(pageProps===null||pageProps===void 0?void 0:pageProps.initial_referring_domain)||state.session.initialReferringDomain.value;return ctxPageProps;};/**
     * Add any missing default page properties using values from options and defaults
     * @param properties Input page properties
     * @param options API options
     */var getUpdatedPageProperties=function getUpdatedPageProperties(properties,options){var optionsPageProps=(options===null||options===void 0?void 0:options.page)||{};var pageProps=properties;// Need to get updated page details on each event as an event to notify on SPA url changes does not seem to exist
        var curPageProps=getDefaultPageProperties();Object.keys(curPageProps).forEach(function(key){if(isUndefined(pageProps[key])){pageProps[key]=optionsPageProps[key]||curPageProps[key];}});if(isUndefined(pageProps.initial_referrer)){pageProps.initial_referrer=optionsPageProps.initial_referrer||state.session.initialReferrer.value;}if(isUndefined(pageProps.initial_referring_domain)){pageProps.initial_referring_domain=optionsPageProps.initial_referring_domain||state.session.initialReferringDomain.value;}return pageProps;};/**
     * Utility to check for reserved keys in the input object
     * @param obj Generic object
     * @param parentKeyPath Object's parent key path
     * @param logger Logger instance
     */var checkForReservedElementsInObject=function checkForReservedElementsInObject(obj,parentKeyPath,logger){if(isObjectLiteralAndNotNull(obj)){Object.keys(obj).forEach(function(property){if(RESERVED_ELEMENTS.includes(property)||RESERVED_ELEMENTS.includes(property.toLowerCase())){logger===null||logger===void 0||logger.warn(RESERVED_KEYWORD_WARNING(EVENT_MANAGER,property,parentKeyPath,RESERVED_ELEMENTS));}});}};/**
     * Checks for reserved keys in traits, properties, and contextual traits
     * @param rudderEvent Generated rudder event
     * @param logger Logger instance
     */var checkForReservedElements=function checkForReservedElements(rudderEvent,logger){//  properties, traits, contextualTraits are either undefined or object
        var properties=rudderEvent.properties,traits=rudderEvent.traits,context=rudderEvent.context;var contextualTraits=context.traits;checkForReservedElementsInObject(properties,'properties',logger);checkForReservedElementsInObject(traits,'traits',logger);checkForReservedElementsInObject(contextualTraits,'context.traits',logger);};/**
     * Overrides the top-level event properties with data from API options
     * @param rudderEvent Generated rudder event
     * @param options API options
     */var updateTopLevelEventElements=function updateTopLevelEventElements(rudderEvent,options){if(options.anonymousId&&isString(options.anonymousId)){// eslint-disable-next-line no-param-reassign
        rudderEvent.anonymousId=options.anonymousId;}if(isObjectLiteralAndNotNull(options.integrations)){// eslint-disable-next-line no-param-reassign
        rudderEvent.integrations=options.integrations;}if(options.originalTimestamp&&isString(options.originalTimestamp)){// eslint-disable-next-line no-param-reassign
        rudderEvent.originalTimestamp=options.originalTimestamp;}};/**
     * To merge the contextual information in API options with existing data
     * @param rudderContext Generated rudder event
     * @param options API options
     * @param logger Logger instance
     */var getMergedContext=function getMergedContext(rudderContext,options,logger){var context=rudderContext;Object.keys(options).forEach(function(key){if(!TOP_LEVEL_ELEMENTS.includes(key)&&!CONTEXT_RESERVED_ELEMENTS.includes(key)){if(key!=='context'){context=mergeDeepRight(context,_defineProperty({},key,options[key]));}else if(!isUndefined(options[key])&&isObjectLiteralAndNotNull(options[key])){var tempContext={};Object.keys(options[key]).forEach(function(e){if(!CONTEXT_RESERVED_ELEMENTS.includes(e)){tempContext[e]=options[key][e];}});context=mergeDeepRight(context,_objectSpread2({},tempContext));}else {logger===null||logger===void 0||logger.warn(INVALID_CONTEXT_OBJECT_WARNING(EVENT_MANAGER));}}});return context;};/**
     * A function to determine whether SDK should use the integration option provided in load call
     * @returns boolean
     */var shouldUseGlobalIntegrationsConfigInEvents=function shouldUseGlobalIntegrationsConfigInEvents(){return state.loadOptions.value.useGlobalIntegrationsConfigInEvents&&isObjectLiteralAndNotNull(state.nativeDestinations.loadOnlyIntegrations.value);};/**
     * Updates rudder event object with data from the API options
     * @param rudderEvent Generated rudder event
     * @param options API options
     */var processOptions=function processOptions(rudderEvent,options){// Only allow object type for options
        if(isObjectLiteralAndNotNull(options)){updateTopLevelEventElements(rudderEvent,options);// eslint-disable-next-line no-param-reassign
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
     */var getEnrichedEvent=function getEnrichedEvent(rudderEvent,options,pageProps,logger){var _state$storage$entrie;var commonEventData={channel:CHANNEL,context:{traits:clone$1(state.session.userTraits.value),sessionId:state.session.sessionInfo.value.id||undefined,sessionStart:state.session.sessionInfo.value.sessionStart||undefined,consentManagement:{deniedConsentIds:clone$1(state.consents.data.value.deniedConsentIds),allowedConsentIds:clone$1(state.consents.data.value.allowedConsentIds),provider:state.consents.provider.value,resolutionStrategy:state.consents.resolutionStrategy.value},'ua-ch':state.context['ua-ch'].value,app:state.context.app.value,library:state.context.library.value,userAgent:state.context.userAgent.value,os:state.context.os.value,locale:state.context.locale.value,screen:state.context.screen.value,campaign:extractUTMParameters(globalThis.location.href),page:getContextPageProperties(pageProps),timezone:state.context.timezone.value},originalTimestamp:getCurrentTimeFormatted(),integrations:DEFAULT_INTEGRATIONS_CONFIG,messageId:generateUUID(),userId:rudderEvent.userId||state.session.userId.value};if(!isStorageTypeValidForStoringData((_state$storage$entrie=state.storage.entries.value.anonymousId)===null||_state$storage$entrie===void 0?void 0:_state$storage$entrie.type)){// Generate new anonymous id for each request
        commonEventData.anonymousId=generateAnonymousId();}else {// Type casting to string as the user session manager will take care of initializing the value
        commonEventData.anonymousId=state.session.anonymousId.value;}// set truly anonymous tracking flag
        if(state.storage.trulyAnonymousTracking.value){commonEventData.context.trulyAnonymousTracking=true;}if(rudderEvent.type==='identify'){var _state$storage$entrie2;commonEventData.context.traits=((_state$storage$entrie2=state.storage.entries.value.userTraits)===null||_state$storage$entrie2===void 0?void 0:_state$storage$entrie2.type)!==NO_STORAGE?clone$1(state.session.userTraits.value):rudderEvent.context.traits;}if(rudderEvent.type==='group'){if(rudderEvent.groupId||state.session.groupId.value){commonEventData.groupId=rudderEvent.groupId||state.session.groupId.value;}if(rudderEvent.traits||state.session.groupTraits.value){var _state$storage$entrie3;commonEventData.traits=((_state$storage$entrie3=state.storage.entries.value.groupTraits)===null||_state$storage$entrie3===void 0?void 0:_state$storage$entrie3.type)!==NO_STORAGE?clone$1(state.session.groupTraits.value):rudderEvent.traits;}}var processedEvent=mergeDeepRight(rudderEvent,commonEventData);// Set the default values for the event properties
// matching with v1.1 payload
        if(processedEvent.event===undefined){processedEvent.event=null;}if(processedEvent.properties===undefined){processedEvent.properties=null;}processOptions(processedEvent,options);checkForReservedElements(processedEvent,logger);// Update the integrations config for the event
        processedEvent.integrations=getEventIntegrationsConfig(processedEvent.integrations);return processedEvent;};

    var RudderEventFactory=/*#__PURE__*/function(){function RudderEventFactory(logger){_classCallCheck(this,RudderEventFactory);this.logger=logger;}/**
     * Generate a 'page' event based on the user-input fields
     * @param category Page's category
     * @param name Page name
     * @param properties Page properties
     * @param options API options
     */_createClass(RudderEventFactory,[{key:"generatePageEvent",value:function generatePageEvent(category,name,properties,options){var props=properties!==null&&properties!==void 0?properties:{};props.name=name;props.category=category;props=getUpdatedPageProperties(props,options);var pageEvent={properties:props,name:name,category:category,type:'page'};return getEnrichedEvent(pageEvent,options,props,this.logger);}/**
         * Generate a 'track' event based on the user-input fields
         * @param event The event name
         * @param properties Event properties
         * @param options API options
         */},{key:"generateTrackEvent",value:function generateTrackEvent(event,properties,options){var trackEvent={properties:properties,event:event,type:'track'};return getEnrichedEvent(trackEvent,options,undefined,this.logger);}/**
         * Generate an 'identify' event based on the user-input fields
         * @param userId New user ID
         * @param traits new traits
         * @param options API options
         */},{key:"generateIdentifyEvent",value:function generateIdentifyEvent(userId,traits,options){var identifyEvent={userId:userId,type:'identify',context:{traits:traits}};return getEnrichedEvent(identifyEvent,options,undefined,this.logger);}/**
         * Generate an 'alias' event based on the user-input fields
         * @param to New user ID
         * @param from Old user ID
         * @param options API options
         */},{key:"generateAliasEvent",value:function generateAliasEvent(to,from,options){var aliasEvent={previousId:from,type:'alias'};var enrichedEvent=getEnrichedEvent(aliasEvent,options,undefined,this.logger);// override the User ID from the API inputs
            enrichedEvent.userId=to!==null&&to!==void 0?to:enrichedEvent.userId;return enrichedEvent;}/**
         * Generate a 'group' event based on the user-input fields
         * @param groupId New group ID
         * @param traits new group traits
         * @param options API options
         */},{key:"generateGroupEvent",value:function generateGroupEvent(groupId,traits,options){var groupEvent={type:'group'};if(groupId){groupEvent.groupId=groupId;}if(traits){groupEvent.traits=traits;}return getEnrichedEvent(groupEvent,options,undefined,this.logger);}/**
         * Generates a new RudderEvent object based on the user-input fields
         * @param event API event parameters object
         * @returns A RudderEvent object
         */},{key:"create",value:function create(event){var eventObj;switch(event.type){case'page':eventObj=this.generatePageEvent(event.category,event.name,event.properties,event.options);break;case'track':eventObj=this.generateTrackEvent(event.name,event.properties,event.options);break;case'identify':eventObj=this.generateIdentifyEvent(event.userId,event.traits,event.options);break;case'alias':eventObj=this.generateAliasEvent(event.to,event.from,event.options);break;case'group':eventObj=this.generateGroupEvent(event.groupId,event.traits,event.options);break;}return eventObj;}}]);return RudderEventFactory;}();

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
     */_createClass(EventManager,[{key:"init",value:function init(){this.eventRepository.init();}},{key:"resume",value:function resume(){this.eventRepository.resume();}/**
         * Consumes a new incoming event
         * @param event Incoming event data
         */},{key:"addEvent",value:function addEvent(event){this.userSessionManager.refreshSession();var rudderEvent=this.eventFactory.create(event);if(rudderEvent){this.eventRepository.enqueue(rudderEvent,event.callback);}else {this.onError(new Error(EVENT_OBJECT_GENERATION_ERROR));}}/**
         * Handles error
         * @param error The error object
         */},{key:"onError",value:function onError(error,customMessage,shouldAlwaysThrow){if(this.errorHandler){this.errorHandler.onError(error,EVENT_MANAGER,customMessage,shouldAlwaysThrow);}else {throw error;}}}]);return EventManager;}();

    var UserSessionManager=/*#__PURE__*/function(){function UserSessionManager(errorHandler,logger,pluginsManager,storeManager){_classCallCheck(this,UserSessionManager);this.storeManager=storeManager;this.pluginsManager=pluginsManager;this.logger=logger;this.errorHandler=errorHandler;this.onError=this.onError.bind(this);}/**
     * Initialize User session with values from storage
     */_createClass(UserSessionManager,[{key:"init",value:function init(){this.syncStorageDataToState();// Register the effect to sync with storage
            this.registerEffects();}},{key:"syncStorageDataToState",value:function syncStorageDataToState(){this.migrateStorageIfNeeded();this.migrateDataFromPreviousStorage();// get the values from storage and set it again
            this.setUserId(this.getUserId());this.setUserTraits(this.getUserTraits());this.setGroupId(this.getGroupId());this.setGroupTraits(this.getGroupTraits());this.setAnonymousId(this.getAnonymousId(state.loadOptions.value.anonymousIdOptions));this.setAuthToken(this.getAuthToken());this.setInitialReferrerInfo();this.configureSessionTracking();}},{key:"configureSessionTracking",value:function configureSessionTracking(){var sessionInfo=this.getSessionInfo();if(this.isPersistenceEnabledForStorageEntry('sessionInfo')){var _this$getSessionInfo;var configuredSessionTrackingInfo=this.getConfiguredSessionTrackingInfo();var persistedSessionInfo=(_this$getSessionInfo=this.getSessionInfo())!==null&&_this$getSessionInfo!==void 0?_this$getSessionInfo:defaultSessionInfo;sessionInfo=_objectSpread2(_objectSpread2(_objectSpread2({},persistedSessionInfo),configuredSessionTrackingInfo),{},{autoTrack:configuredSessionTrackingInfo.autoTrack&&persistedSessionInfo.manualTrack!==true});}this.setSessionInfo(sessionInfo);}},{key:"setInitialReferrerInfo",value:function setInitialReferrerInfo(){var persistedInitialReferrer=this.getInitialReferrer();var persistedInitialReferringDomain=this.getInitialReferringDomain();if(persistedInitialReferrer&&persistedInitialReferringDomain){this.setInitialReferrer(persistedInitialReferrer);this.setInitialReferringDomain(persistedInitialReferringDomain);}else {var initialReferrer=persistedInitialReferrer||getReferrer();this.setInitialReferrer(initialReferrer);this.setInitialReferringDomain(getReferringDomain(initialReferrer));}}},{key:"isPersistenceEnabledForStorageEntry",value:function isPersistenceEnabledForStorageEntry(entryName){var _state$storage$entrie;return isStorageTypeValidForStoringData((_state$storage$entrie=state.storage.entries.value[entryName])===null||_state$storage$entrie===void 0?void 0:_state$storage$entrie.type);}},{key:"migrateDataFromPreviousStorage",value:function migrateDataFromPreviousStorage(){var _this=this;var entries=state.storage.entries.value;var storageTypesForMigration=[COOKIE_STORAGE,LOCAL_STORAGE,SESSION_STORAGE];Object.keys(entries).forEach(function(entry){var _entries$key,_this$storeManager;var key=entry;var currentStorage=(_entries$key=entries[key])===null||_entries$key===void 0?void 0:_entries$key.type;var curStore=(_this$storeManager=_this.storeManager)===null||_this$storeManager===void 0?void 0:_this$storeManager.getStore(storageClientDataStoreNameMap[currentStorage]);if(curStore){storageTypesForMigration.forEach(function(storage){var _this$storeManager2;var store=(_this$storeManager2=_this.storeManager)===null||_this$storeManager2===void 0?void 0:_this$storeManager2.getStore(storageClientDataStoreNameMap[storage]);if(store&&storage!==currentStorage){var value=store.get(USER_SESSION_STORAGE_KEYS[key]);if(isDefinedNotNullAndNotEmptyString(value)){curStore.set(USER_SESSION_STORAGE_KEYS[key],value);}store.remove(USER_SESSION_STORAGE_KEYS[key]);}});}});}},{key:"migrateStorageIfNeeded",value:function migrateStorageIfNeeded(){var _this2=this;if(!state.storage.migrate.value){return;}var persistentStoreNames=[CLIENT_DATA_STORE_COOKIE,CLIENT_DATA_STORE_LS,CLIENT_DATA_STORE_SESSION];var stores=[];persistentStoreNames.forEach(function(storeName){var _this2$storeManager;var store=(_this2$storeManager=_this2.storeManager)===null||_this2$storeManager===void 0?void 0:_this2$storeManager.getStore(storeName);if(store){stores.push(store);}});Object.keys(USER_SESSION_STORAGE_KEYS).forEach(function(storageKey){var storageEntry=USER_SESSION_STORAGE_KEYS[storageKey];stores.forEach(function(store){var _this2$pluginsManager;var migratedVal=(_this2$pluginsManager=_this2.pluginsManager)===null||_this2$pluginsManager===void 0?void 0:_this2$pluginsManager.invokeSingle('storage.migrate',storageEntry,store.engine,_this2.errorHandler,_this2.logger);// Skip setting the value if it is null or undefined
// as those values indicate there is no need for migration or
// migration failed
            if(!isNullOrUndefined(migratedVal)){store.set(storageEntry,migratedVal);}});});}},{key:"getConfiguredSessionTrackingInfo",value:function getConfiguredSessionTrackingInfo(){var _state$loadOptions$va,_state$loadOptions$va2;var autoTrack=((_state$loadOptions$va=state.loadOptions.value.sessions)===null||_state$loadOptions$va===void 0?void 0:_state$loadOptions$va.autoTrack)!==false;// Do not validate any further if autoTrack is disabled
            if(!autoTrack){return {autoTrack:autoTrack};}var timeout;var configuredSessionTimeout=(_state$loadOptions$va2=state.loadOptions.value.sessions)===null||_state$loadOptions$va2===void 0?void 0:_state$loadOptions$va2.timeout;if(!isPositiveInteger(configuredSessionTimeout)){var _this$logger;(_this$logger=this.logger)===null||_this$logger===void 0||_this$logger.warn(TIMEOUT_NOT_NUMBER_WARNING(USER_SESSION_MANAGER,configuredSessionTimeout,DEFAULT_SESSION_TIMEOUT_MS));timeout=DEFAULT_SESSION_TIMEOUT_MS;}else {timeout=configuredSessionTimeout;}if(timeout===0){var _this$logger2;(_this$logger2=this.logger)===null||_this$logger2===void 0||_this$logger2.warn(TIMEOUT_ZERO_WARNING(USER_SESSION_MANAGER));autoTrack=false;}// In case user provides a timeout value greater than 0 but less than 10 seconds SDK will show a warning
// and will proceed with it
            if(timeout>0&&timeout<MIN_SESSION_TIMEOUT_MS){var _this$logger3;(_this$logger3=this.logger)===null||_this$logger3===void 0||_this$logger3.warn(TIMEOUT_NOT_RECOMMENDED_WARNING(USER_SESSION_MANAGER,timeout,MIN_SESSION_TIMEOUT_MS));}return {timeout:timeout,autoTrack:autoTrack};}/**
         * Handles error
         * @param error The error object
         */},{key:"onError",value:function onError(error){if(this.errorHandler){this.errorHandler.onError(error,USER_SESSION_MANAGER);}else {throw error;}}/**
         * A function to sync values in storage
         * @param sessionKey
         * @param value
         */},{key:"syncValueToStorage",value:function syncValueToStorage(sessionKey,value){var _entries$sessionKey,_entries$sessionKey2;var entries=state.storage.entries.value;var storage=(_entries$sessionKey=entries[sessionKey])===null||_entries$sessionKey===void 0?void 0:_entries$sessionKey.type;var key=(_entries$sessionKey2=entries[sessionKey])===null||_entries$sessionKey2===void 0?void 0:_entries$sessionKey2.key;if(isStorageTypeValidForStoringData(storage)){var _this$storeManager3;var curStore=(_this$storeManager3=this.storeManager)===null||_this$storeManager3===void 0?void 0:_this$storeManager3.getStore(storageClientDataStoreNameMap[storage]);if(value&&isString(value)||isNonEmptyObject(value)){curStore===null||curStore===void 0||curStore.set(key,value);}else {curStore===null||curStore===void 0||curStore.remove(key);}}}/**
         * Function to update storage whenever state value changes
         */},{key:"registerEffects",value:function registerEffects(){var _this3=this;// This will work as long as the user session entry key names are same as the state keys
            USER_SESSION_KEYS.forEach(function(sessionKey){O(function(){_this3.syncValueToStorage(sessionKey,state.session[sessionKey].value);});});}/**
         * Sets anonymous id in the following precedence:
         *
         * 1. anonymousId: Id directly provided to the function.
         * 2. rudderAmpLinkerParam: value generated from linker query parm (rudderstack)
         *    using parseLinker util.
         * 3. generateUUID: A new unique id is generated and assigned.
         */},{key:"setAnonymousId",value:function setAnonymousId(anonymousId,rudderAmpLinkerParam){var finalAnonymousId=anonymousId;if(this.isPersistenceEnabledForStorageEntry('anonymousId')){if(!finalAnonymousId&&rudderAmpLinkerParam){var _this$pluginsManager;var linkerPluginsResult=(_this$pluginsManager=this.pluginsManager)===null||_this$pluginsManager===void 0?void 0:_this$pluginsManager.invokeSingle('userSession.anonymousIdGoogleLinker',rudderAmpLinkerParam);finalAnonymousId=linkerPluginsResult;}finalAnonymousId=finalAnonymousId||generateAnonymousId();}else {finalAnonymousId=DEFAULT_USER_SESSION_VALUES.anonymousId;}state.session.anonymousId.value=finalAnonymousId;}/**
         * Fetches anonymousId
         * @param options option to fetch it from external source
         * @returns anonymousId
         */},{key:"getAnonymousId",value:function getAnonymousId(options){var _state$storage$entrie2;var storage=(_state$storage$entrie2=state.storage.entries.value.anonymousId)===null||_state$storage$entrie2===void 0?void 0:_state$storage$entrie2.type;// fetch the anonymousId from storage
            if(isStorageTypeValidForStoringData(storage)){var persistedAnonymousId=this.getEntryValue('anonymousId');if(!persistedAnonymousId&&options){var _this$pluginsManager2;// fetch anonymousId from external source
                var autoCapturedAnonymousId=(_this$pluginsManager2=this.pluginsManager)===null||_this$pluginsManager2===void 0?void 0:_this$pluginsManager2.invokeSingle('storage.getAnonymousId',getStorageEngine,options);persistedAnonymousId=autoCapturedAnonymousId;}state.session.anonymousId.value=persistedAnonymousId||generateAnonymousId();}return state.session.anonymousId.value;}},{key:"getEntryValue",value:function getEntryValue(sessionKey){var _entries$sessionKey3;var entries=state.storage.entries.value;var storageType=(_entries$sessionKey3=entries[sessionKey])===null||_entries$sessionKey3===void 0?void 0:_entries$sessionKey3.type;if(isStorageTypeValidForStoringData(storageType)){var _this$storeManager4,_entries$sessionKey4,_store$get;var store=(_this$storeManager4=this.storeManager)===null||_this$storeManager4===void 0?void 0:_this$storeManager4.getStore(storageClientDataStoreNameMap[storageType]);var storageKey=(_entries$sessionKey4=entries[sessionKey])===null||_entries$sessionKey4===void 0?void 0:_entries$sessionKey4.key;return (_store$get=store===null||store===void 0?void 0:store.get(storageKey))!==null&&_store$get!==void 0?_store$get:null;}return null;}/**
         * Fetches User Id
         * @returns
         */},{key:"getUserId",value:function getUserId(){return this.getEntryValue('userId');}/**
         * Fetches User Traits
         * @returns
         */},{key:"getUserTraits",value:function getUserTraits(){return this.getEntryValue('userTraits');}/**
         * Fetches Group Id
         * @returns
         */},{key:"getGroupId",value:function getGroupId(){return this.getEntryValue('groupId');}/**
         * Fetches Group Traits
         * @returns
         */},{key:"getGroupTraits",value:function getGroupTraits(){return this.getEntryValue('groupTraits');}/**
         * Fetches Initial Referrer
         * @returns
         */},{key:"getInitialReferrer",value:function getInitialReferrer(){return this.getEntryValue('initialReferrer');}/**
         * Fetches Initial Referring domain
         * @returns
         */},{key:"getInitialReferringDomain",value:function getInitialReferringDomain(){return this.getEntryValue('initialReferringDomain');}/**
         * Fetches session tracking information from storage
         * @returns
         */},{key:"getSessionInfo",value:function getSessionInfo(){return this.getEntryValue('sessionInfo');}/**
         * Fetches auth token from storage
         * @returns
         */},{key:"getAuthToken",value:function getAuthToken(){return this.getEntryValue('authToken');}/**
         * If session is active it returns the sessionId
         * @returns
         */},{key:"getSessionId",value:function getSessionId(){var sessionInfo=state.session.sessionInfo.value;if(sessionInfo.autoTrack&&!hasSessionExpired(sessionInfo.expiresAt)||sessionInfo.manualTrack){var _sessionInfo$id;return (_sessionInfo$id=sessionInfo.id)!==null&&_sessionInfo$id!==void 0?_sessionInfo$id:null;}return null;}/**
         * A function to update current session info after each event call
         */},{key:"refreshSession",value:function refreshSession(){var sessionInfo=state.session.sessionInfo.value;if(sessionInfo.autoTrack||sessionInfo.manualTrack){if(sessionInfo.autoTrack){this.startOrRenewAutoTracking();}// Re-assigning the variable with the same value intentionally as
// startOrRenewAutoTracking() will update the sessionInfo value
            sessionInfo=state.session.sessionInfo.value;if(sessionInfo.sessionStart===undefined){state.session.sessionInfo.value=_objectSpread2(_objectSpread2({},sessionInfo),{},{sessionStart:true});}else if(sessionInfo.sessionStart){state.session.sessionInfo.value=_objectSpread2(_objectSpread2({},sessionInfo),{},{sessionStart:false});}}}/**
         * Reset state values
         * @param resetAnonymousId
         * @param noNewSessionStart
         * @returns
         */},{key:"reset",value:function reset(resetAnonymousId,noNewSessionStart){var _this4=this;var session=state.session;var _session$sessionInfo$=session.sessionInfo.value,manualTrack=_session$sessionInfo$.manualTrack,autoTrack=_session$sessionInfo$.autoTrack;n(function(){session.userId.value=DEFAULT_USER_SESSION_VALUES.userId;session.userTraits.value=DEFAULT_USER_SESSION_VALUES.userTraits;session.groupId.value=DEFAULT_USER_SESSION_VALUES.groupId;session.groupTraits.value=DEFAULT_USER_SESSION_VALUES.groupTraits;session.authToken.value=DEFAULT_USER_SESSION_VALUES.authToken;if(resetAnonymousId){// This will generate a new anonymous ID
            _this4.setAnonymousId();}if(noNewSessionStart){return;}if(autoTrack){session.sessionInfo.value=DEFAULT_USER_SESSION_VALUES.sessionInfo;_this4.startOrRenewAutoTracking();}else if(manualTrack){_this4.startManualTrackingInternal();}});}},{key:"setSessionInfo",value:function setSessionInfo(sessionInfo){state.session.sessionInfo.value=this.isPersistenceEnabledForStorageEntry('sessionInfo')?sessionInfo:DEFAULT_USER_SESSION_VALUES.sessionInfo;// If auto session tracking is enabled start the session tracking
            if(state.session.sessionInfo.value.autoTrack){this.startOrRenewAutoTracking();}}/**
         * Set user Id
         * @param userId
         */},{key:"setUserId",value:function setUserId(userId){state.session.userId.value=this.isPersistenceEnabledForStorageEntry('userId')&&userId?userId:DEFAULT_USER_SESSION_VALUES.userId;}/**
         * Set user traits
         * @param traits
         */},{key:"setUserTraits",value:function setUserTraits(traits){var _state$session$userTr;state.session.userTraits.value=this.isPersistenceEnabledForStorageEntry('userTraits')&&traits?mergeDeepRight((_state$session$userTr=state.session.userTraits.value)!==null&&_state$session$userTr!==void 0?_state$session$userTr:{},traits):DEFAULT_USER_SESSION_VALUES.userTraits;}/**
         * Set group Id
         * @param groupId
         */},{key:"setGroupId",value:function setGroupId(groupId){state.session.groupId.value=this.isPersistenceEnabledForStorageEntry('groupId')&&groupId?groupId:DEFAULT_USER_SESSION_VALUES.groupId;}/**
         * Set group traits
         * @param traits
         */},{key:"setGroupTraits",value:function setGroupTraits(traits){var _state$session$groupT;state.session.groupTraits.value=this.isPersistenceEnabledForStorageEntry('groupTraits')&&traits?mergeDeepRight((_state$session$groupT=state.session.groupTraits.value)!==null&&_state$session$groupT!==void 0?_state$session$groupT:{},traits):DEFAULT_USER_SESSION_VALUES.groupTraits;}/**
         * Set initial referrer
         * @param referrer
         */},{key:"setInitialReferrer",value:function setInitialReferrer(referrer){state.session.initialReferrer.value=this.isPersistenceEnabledForStorageEntry('initialReferrer')&&referrer?referrer:DEFAULT_USER_SESSION_VALUES.initialReferrer;}/**
         * Set initial referring domain
         * @param {String} referringDomain
         */},{key:"setInitialReferringDomain",value:function setInitialReferringDomain(referringDomain){state.session.initialReferringDomain.value=this.isPersistenceEnabledForStorageEntry('initialReferringDomain')&&referringDomain?referringDomain:DEFAULT_USER_SESSION_VALUES.initialReferringDomain;}/**
         * A function to check for existing session details and depending on that create a new session
         */},{key:"startOrRenewAutoTracking",value:function startOrRenewAutoTracking(){var sessionInfo=state.session.sessionInfo.value;if(hasSessionExpired(sessionInfo.expiresAt)){state.session.sessionInfo.value=generateAutoTrackingSession(sessionInfo.timeout);}else {var timestamp=Date.now();var timeout=sessionInfo.timeout;state.session.sessionInfo.value=mergeDeepRight(sessionInfo,{expiresAt:timestamp+timeout// set the expiry time of the session
        });}}/**
         * A function method to start a manual session
         * @param {number} id     session identifier
         * @returns
         */},{key:"start",value:function start(id){state.session.sessionInfo.value=generateManualTrackingSession(id,this.logger);}/**
         * An internal function to start manual session
         */},{key:"startManualTrackingInternal",value:function startManualTrackingInternal(){this.start(Date.now());}/**
         * A public method to end an ongoing session.
         */},{key:"end",value:function end(){state.session.sessionInfo.value={};}/**
         * Set auth token
         * @param userId
         */},{key:"setAuthToken",value:function setAuthToken(token){state.session.authToken.value=this.isPersistenceEnabledForStorageEntry('authToken')&&token?token:DEFAULT_USER_SESSION_VALUES.authToken;}}]);return UserSessionManager;}();

    /**
     * A buffer queue to serve as a store for any type of data
     */var BufferQueue=/*#__PURE__*/function(){function BufferQueue(){_classCallCheck(this,BufferQueue);this.items=[];}_createClass(BufferQueue,[{key:"enqueue",value:function enqueue(item){this.items.push(item);}},{key:"dequeue",value:function dequeue(){if(this.items.length===0){return null;}return this.items.shift();}},{key:"isEmpty",value:function isEmpty(){return this.items.length===0;}},{key:"size",value:function size(){return this.items.length;}},{key:"clear",value:function clear(){this.items=[];}}]);return BufferQueue;}();

    var DATA_PLANE_QUEUE_EXT_POINT_PREFIX='dataplaneEventsQueue';var DESTINATIONS_QUEUE_EXT_POINT_PREFIX='destinationsEventsQueue';var DMT_EXT_POINT_PREFIX='transformEvent';

    /**
     * Filters and returns the user supplied integrations config that should take preference over the destination specific integrations config
     * @param eventIntgConfig User supplied integrations config at event level
     * @param destinationsIntgConfig Cumulative integrations config from all destinations
     * @returns Filtered user supplied integrations config
     */var getOverriddenIntegrationOptions=function getOverriddenIntegrationOptions(eventIntgConfig,destinationsIntgConfig){return Object.keys(eventIntgConfig).filter(function(intgName){return eventIntgConfig[intgName]!==true||!destinationsIntgConfig[intgName];}).reduce(function(obj,key){var retVal=clone$1(obj);retVal[key]=eventIntgConfig[key];return retVal;},{});};/**
     * Returns the event object with final integrations config
     * @param event RudderEvent object
     * @param state Application state
     * @returns Mutated event with final integrations config
     */var getFinalEvent=function getFinalEvent(event,state){var _event$integrations;var finalEvent=clone$1(event);// Merge the destination specific integrations config with the event's integrations config
// In general, the preference is given to the event's integrations config
        var eventIntgConfig=(_event$integrations=event.integrations)!==null&&_event$integrations!==void 0?_event$integrations:DEFAULT_INTEGRATIONS_CONFIG;var destinationsIntgConfig=state.nativeDestinations.integrationsConfig.value;var overriddenIntgOpts=getOverriddenIntegrationOptions(eventIntgConfig,destinationsIntgConfig);finalEvent.integrations=mergeDeepRight(destinationsIntgConfig,overriddenIntgOpts);return finalEvent;};var shouldBufferEventsForPreConsent=function shouldBufferEventsForPreConsent(state){var _state$consents$preCo,_state$consents$preCo2,_state$consents$preCo3;return state.consents.preConsent.value.enabled&&((_state$consents$preCo=state.consents.preConsent.value.events)===null||_state$consents$preCo===void 0?void 0:_state$consents$preCo.delivery)==='buffer'&&(((_state$consents$preCo2=state.consents.preConsent.value.storage)===null||_state$consents$preCo2===void 0?void 0:_state$consents$preCo2.strategy)==='session'||((_state$consents$preCo3=state.consents.preConsent.value.storage)===null||_state$consents$preCo3===void 0?void 0:_state$consents$preCo3.strategy)==='none');};

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
     */_createClass(EventRepository,[{key:"init",value:function init(){var _this=this;this.dataplaneEventsQueue=this.pluginsManager.invokeSingle("".concat(DATA_PLANE_QUEUE_EXT_POINT_PREFIX,".init"),state,this.httpClient,this.storeManager,this.errorHandler,this.logger);this.dmtEventsQueue=this.pluginsManager.invokeSingle("".concat(DMT_EXT_POINT_PREFIX,".init"),state,this.pluginsManager,this.httpClient,this.storeManager,this.errorHandler,this.logger);this.destinationsEventsQueue=this.pluginsManager.invokeSingle("".concat(DESTINATIONS_QUEUE_EXT_POINT_PREFIX,".init"),state,this.pluginsManager,this.storeManager,this.dmtEventsQueue,this.errorHandler,this.logger);// Start the queue once the client destinations are ready
            O(function(){if(state.nativeDestinations.clientDestinationsReady.value===true){var _this$destinationsEve,_this$dmtEventsQueue;(_this$destinationsEve=_this.destinationsEventsQueue)===null||_this$destinationsEve===void 0||_this$destinationsEve.start();(_this$dmtEventsQueue=_this.dmtEventsQueue)===null||_this$dmtEventsQueue===void 0||_this$dmtEventsQueue.start();}});var bufferEventsBeforeConsent=shouldBufferEventsForPreConsent(state);// Start the queue processing only when the destinations are ready or hybrid mode destinations exist
// However, events will be enqueued for now.
// At the time of processing the events, the integrations config data from destinations
// is merged into the event object
            var timeoutId;O(function(){var _this$dataplaneEvents;var shouldBufferDpEvents=state.loadOptions.value.bufferDataPlaneEventsUntilReady===true&&state.nativeDestinations.clientDestinationsReady.value===false;var hybridDestExist=state.nativeDestinations.activeDestinations.value.some(function(dest){return isHybridModeDestination(dest);});if((hybridDestExist===false||shouldBufferDpEvents===false)&&!bufferEventsBeforeConsent&&((_this$dataplaneEvents=_this.dataplaneEventsQueue)===null||_this$dataplaneEvents===void 0?void 0:_this$dataplaneEvents.scheduleTimeoutActive)!==true){var _this$dataplaneEvents2;globalThis.clearTimeout(timeoutId);(_this$dataplaneEvents2=_this.dataplaneEventsQueue)===null||_this$dataplaneEvents2===void 0||_this$dataplaneEvents2.start();}});// Force start the data plane events queue processing after a timeout
            if(state.loadOptions.value.bufferDataPlaneEventsUntilReady===true){timeoutId=globalThis.setTimeout(function(){var _this$dataplaneEvents3;if(((_this$dataplaneEvents3=_this.dataplaneEventsQueue)===null||_this$dataplaneEvents3===void 0?void 0:_this$dataplaneEvents3.scheduleTimeoutActive)!==true){var _this$dataplaneEvents4;(_this$dataplaneEvents4=_this.dataplaneEventsQueue)===null||_this$dataplaneEvents4===void 0||_this$dataplaneEvents4.start();}},state.loadOptions.value.dataPlaneEventsBufferTimeout);}}},{key:"resume",value:function resume(){var _this$dataplaneEvents5;if(((_this$dataplaneEvents5=this.dataplaneEventsQueue)===null||_this$dataplaneEvents5===void 0?void 0:_this$dataplaneEvents5.scheduleTimeoutActive)!==true){var _this$dataplaneEvents7;if(state.consents.postConsent.value.discardPreConsentEvents){var _this$dataplaneEvents6,_this$destinationsEve2;(_this$dataplaneEvents6=this.dataplaneEventsQueue)===null||_this$dataplaneEvents6===void 0||_this$dataplaneEvents6.clear();(_this$destinationsEve2=this.destinationsEventsQueue)===null||_this$destinationsEve2===void 0||_this$destinationsEve2.clear();}(_this$dataplaneEvents7=this.dataplaneEventsQueue)===null||_this$dataplaneEvents7===void 0||_this$dataplaneEvents7.start();}}/**
         * Enqueues the event for processing
         * @param event RudderEvent object
         * @param callback API callback function
         */},{key:"enqueue",value:function enqueue(event,callback){var dpQEvent=getFinalEvent(event,state);this.pluginsManager.invokeSingle("".concat(DATA_PLANE_QUEUE_EXT_POINT_PREFIX,".enqueue"),state,this.dataplaneEventsQueue,dpQEvent,this.errorHandler,this.logger);var dQEvent=clone$1(event);this.pluginsManager.invokeSingle("".concat(DESTINATIONS_QUEUE_EXT_POINT_PREFIX,".enqueue"),state,this.destinationsEventsQueue,dQEvent,this.errorHandler,this.logger);// Invoke the callback if it exists
            try{// Using the event sent to the data plane queue here
// to ensure the mutated (if any) event is sent to the callback
                callback===null||callback===void 0||callback(dpQEvent);}catch(error){this.onError(error,API_CALLBACK_INVOKE_ERROR);}}/**
         * Handles error
         * @param error The error object
         * @param customMessage a message
         * @param shouldAlwaysThrow if it should throw or use logger
         */},{key:"onError",value:function onError(error,customMessage,shouldAlwaysThrow){if(this.errorHandler){this.errorHandler.onError(error,EVENT_REPOSITORY,customMessage,shouldAlwaysThrow);}else {throw error;}}}]);return EventRepository;}();

    var dispatchSDKEvent=function dispatchSDKEvent(event){var customEvent=new CustomEvent(event,{detail:{analyticsInstance:globalThis.rudderanalytics},bubbles:true,cancelable:true,composed:true});globalThis.document.dispatchEvent(customEvent);};

    /*
 * Analytics class with lifecycle based on state ad user triggered events
 */var Analytics=/*#__PURE__*/function(){/**
     * Initialize services and components or use default ones if singletons
     */function Analytics(){_classCallCheck(this,Analytics);this.preloadBuffer=new BufferQueue();this.initialized=false;this.errorHandler=defaultErrorHandler;this.logger=defaultLogger;this.externalSrcLoader=new ExternalSrcLoader(this.errorHandler,this.logger);this.capabilitiesManager=new CapabilitiesManager(this.errorHandler,this.logger);this.httpClient=defaultHttpClient;}/**
     * Start application lifecycle if not already started
     */_createClass(Analytics,[{key:"load",value:function load(writeKey,dataPlaneUrl){var loadOptions=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};if(state.lifecycle.status.value){return;}var clonedDataPlaneUrl=clone$1(dataPlaneUrl);var clonedLoadOptions=clone$1(loadOptions);// dataPlaneUrl is not provided
            if(isObjectAndNotNull(dataPlaneUrl)){clonedLoadOptions=dataPlaneUrl;clonedDataPlaneUrl=undefined;}// Set initial state values
            n(function(){state.lifecycle.writeKey.value=writeKey;state.lifecycle.dataPlaneUrl.value=clonedDataPlaneUrl;state.loadOptions.value=normalizeLoadOptions(state.loadOptions.value,clonedLoadOptions);state.lifecycle.status.value='mounted';});// set log level as early as possible
            if(state.loadOptions.value.logLevel){var _this$logger;(_this$logger=this.logger)===null||_this$logger===void 0||_this$logger.setMinLogLevel(state.loadOptions.value.logLevel);}// Expose state to global objects
            setExposedGlobal('state',state,writeKey);// Configure initial config of any services or components here
// State application lifecycle
            this.startLifecycle();}// Start lifecycle methods
        /**
         * Orchestrate the lifecycle of the application phases/status
         */},{key:"startLifecycle",value:function startLifecycle(){var _this=this;O(function(){try{switch(state.lifecycle.status.value){case'mounted':_this.onMounted();break;case'browserCapabilitiesReady':_this.onBrowserCapabilitiesReady();break;case'configured':_this.onConfigured();break;case'pluginsLoading':break;case'pluginsReady':_this.onPluginsReady();break;case'initialized':_this.onInitialized();break;case'loaded':_this.onLoaded();break;case'destinationsLoading':break;case'destinationsReady':_this.onDestinationsReady();break;case'ready':_this.onReady();break;default:break;}}catch(err){var issue='Failed to load the SDK';_this.errorHandler.onError(getMutatedError(err,issue),ANALYTICS_CORE);}});}},{key:"onBrowserCapabilitiesReady",value:function onBrowserCapabilitiesReady(){// initialize the preloaded events enqueuing
            retrievePreloadBufferEvents(this);this.prepareInternalServices();this.loadConfig();}},{key:"onLoaded",value:function onLoaded(){this.processBufferedEvents();// Short-circuit the life cycle and move to the ready state if pre-consent behavior is enabled
            if(state.consents.preConsent.value.enabled===true){state.lifecycle.status.value='ready';}else {this.loadDestinations();}}/**
         * Load browser polyfill if required
         */},{key:"onMounted",value:function onMounted(){this.capabilitiesManager.init();}/**
         * Enqueue in SDK preload buffer events, used from preloadBuffer component
         */},{key:"enqueuePreloadBufferEvents",value:function enqueuePreloadBufferEvents(bufferedEvents){var _this2=this;if(Array.isArray(bufferedEvents)){bufferedEvents.forEach(function(bufferedEvent){return _this2.preloadBuffer.enqueue(clone$1(bufferedEvent));});}}/**
         * Process the buffer preloaded events by passing their arguments to the respective facade methods
         */},{key:"processDataInPreloadBuffer",value:function processDataInPreloadBuffer(){while(this.preloadBuffer.size()>0){var eventToProcess=this.preloadBuffer.dequeue();if(eventToProcess){consumePreloadBufferedEvent(_toConsumableArray(eventToProcess),this);}}}},{key:"prepareInternalServices",value:function prepareInternalServices(){this.pluginsManager=new PluginsManager(defaultPluginEngine,this.errorHandler,this.logger);this.storeManager=new StoreManager(this.pluginsManager,this.errorHandler,this.logger);this.configManager=new ConfigManager(this.httpClient,this.errorHandler,this.logger);this.userSessionManager=new UserSessionManager(this.errorHandler,this.logger,this.pluginsManager,this.storeManager);this.eventRepository=new EventRepository(this.pluginsManager,this.storeManager,this.errorHandler,this.logger);this.eventManager=new EventManager(this.eventRepository,this.userSessionManager,this.errorHandler,this.logger);}/**
         * Load configuration
         */},{key:"loadConfig",value:function loadConfig(){var _this$configManager;if(state.lifecycle.writeKey.value){this.httpClient.setAuthHeader(state.lifecycle.writeKey.value);}(_this$configManager=this.configManager)===null||_this$configManager===void 0||_this$configManager.init();}/**
         * Initialize the storage and event queue
         */},{key:"onPluginsReady",value:function onPluginsReady(){var _this$storeManager,_this$userSessionMana,_this$eventManager;this.errorHandler.init(this.externalSrcLoader);// Initialize storage
            (_this$storeManager=this.storeManager)===null||_this$storeManager===void 0||_this$storeManager.init();(_this$userSessionMana=this.userSessionManager)===null||_this$userSessionMana===void 0||_this$userSessionMana.init();// Initialize the appropriate consent manager plugin
            if(state.consents.enabled.value&&!state.consents.initialized.value){var _this$pluginsManager;(_this$pluginsManager=this.pluginsManager)===null||_this$pluginsManager===void 0||_this$pluginsManager.invokeSingle("consentManager.init",state,this.logger);if(state.consents.preConsent.value.enabled===false){var _this$pluginsManager2;(_this$pluginsManager2=this.pluginsManager)===null||_this$pluginsManager2===void 0||_this$pluginsManager2.invokeSingle("consentManager.updateConsentsInfo",state,this.storeManager,this.logger);}}// Initialize event manager
            (_this$eventManager=this.eventManager)===null||_this$eventManager===void 0||_this$eventManager.init();// Mark the SDK as initialized
            state.lifecycle.status.value='initialized';}/**
         * Load plugins
         */},{key:"onConfigured",value:function onConfigured(){var _this$pluginsManager3;(_this$pluginsManager3=this.pluginsManager)===null||_this$pluginsManager3===void 0||_this$pluginsManager3.init();// TODO: are we going to enable custom plugins to be passed as load options?
// registerCustomPlugins(state.loadOptions.value.customPlugins);
        }/**
         * Trigger onLoaded callback if any is provided in config & emit initialised event
         */},{key:"onInitialized",value:function onInitialized(){// Process any preloaded events
            this.processDataInPreloadBuffer();// TODO: we need to avoid passing the window object to the callback function
// as this will prevent us from supporting multiple SDK instances in the same page
// Execute onLoaded callback if provided in load options
            if(isFunction(state.loadOptions.value.onLoaded)){state.loadOptions.value.onLoaded(globalThis.rudderanalytics);}// Set lifecycle state
            n(function(){state.lifecycle.loaded.value=true;state.lifecycle.status.value='loaded';});this.initialized=true;// Emit an event to use as substitute to the onLoaded callback
            dispatchSDKEvent('RSA_Initialised');}/**
         * Emit ready event
         */ // eslint-disable-next-line class-methods-use-this
    },{key:"onReady",value:function onReady(){var _this3=this;state.eventBuffer.readyCallbacksArray.value.forEach(function(callback){try{callback();}catch(err){_this3.errorHandler.onError(err,ANALYTICS_CORE,READY_CALLBACK_INVOKE_ERROR);}});// Emit an event to use as substitute to the ready callback
            dispatchSDKEvent('RSA_Ready');}/**
         * Consume preloaded events buffer
         */},{key:"processBufferedEvents",value:function processBufferedEvents(){var _this4=this;// Process buffered events
            state.eventBuffer.toBeProcessedArray.value.forEach(function(bufferedItem){var methodName=bufferedItem[0];if(isFunction(_this4[methodName])){var _ref;(_ref=_this4)[methodName].apply(_ref,_toConsumableArray(bufferedItem.slice(1)));}});state.eventBuffer.toBeProcessedArray.value=[];}/**
         * Load device mode destinations
         */},{key:"loadDestinations",value:function loadDestinations(){var _this$pluginsManager4,_this$pluginsManager5;if(state.nativeDestinations.clientDestinationsReady.value){return;}// Set in state the desired activeDestinations to inject in DOM
            (_this$pluginsManager4=this.pluginsManager)===null||_this$pluginsManager4===void 0||_this$pluginsManager4.invokeSingle('nativeDestinations.setActiveDestinations',state,this.pluginsManager,this.errorHandler,this.logger);var totalDestinationsToLoad=state.nativeDestinations.activeDestinations.value.length;if(totalDestinationsToLoad===0){state.lifecycle.status.value='destinationsReady';return;}// Start loading native integration scripts and create instances
            state.lifecycle.status.value='destinationsLoading';(_this$pluginsManager5=this.pluginsManager)===null||_this$pluginsManager5===void 0||_this$pluginsManager5.invokeSingle('nativeDestinations.load',state,this.externalSrcLoader,this.errorHandler,this.logger);// Progress to next lifecycle phase if all native destinations are initialized or failed
            O(function(){var areAllDestinationsReady=totalDestinationsToLoad===0||state.nativeDestinations.initializedDestinations.value.length+state.nativeDestinations.failedDestinations.value.length===totalDestinationsToLoad;if(areAllDestinationsReady){n(function(){state.lifecycle.status.value='destinationsReady';state.nativeDestinations.clientDestinationsReady.value=true;});}});}/**
         * Move to the ready state
         */ // eslint-disable-next-line class-methods-use-this
    },{key:"onDestinationsReady",value:function onDestinationsReady(){// May be do any destination specific actions here
// Mark the ready status if not already done
            if(state.lifecycle.status.value!=='ready'){state.lifecycle.status.value='ready';}}// End lifecycle methods
// Start consumer exposed methods
    },{key:"ready",value:function ready(callback){var type='ready';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,callback]);return;}this.errorHandler.leaveBreadcrumb("New ".concat(type," invocation"));if(!isFunction(callback)){this.logger.error(READY_API_CALLBACK_ERROR(READY_API));return;}/**
         * If destinations are loaded or no integration is available for loading
         * execute the callback immediately else push the callbacks to a queue that
         * will be executed after loading completes
         */if(state.lifecycle.status.value==='ready'){try{callback();}catch(err){this.errorHandler.onError(err,ANALYTICS_CORE,READY_CALLBACK_INVOKE_ERROR);}}else {state.eventBuffer.readyCallbacksArray.value.push(callback);}}},{key:"page",value:function page(payload){var _this$eventManager2;var type='page';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,payload]);return;}this.errorHandler.leaveBreadcrumb("New ".concat(type," event"));state.metrics.triggered.value+=1;(_this$eventManager2=this.eventManager)===null||_this$eventManager2===void 0||_this$eventManager2.addEvent({type:'page',category:payload.category,name:payload.name,properties:payload.properties,options:payload.options,callback:payload.callback});// TODO: Maybe we should alter the behavior to send the ad-block page event even if the SDK is still loaded. It'll be pushed into the to be processed queue.
// Send automatic ad blocked page event if ad-blockers are detected on the page
// Check page category to avoid infinite loop
            if(state.capabilities.isAdBlocked.value===true&&payload.category!==ADBLOCK_PAGE_CATEGORY){this.page(pageArgumentsToCallOptions(ADBLOCK_PAGE_CATEGORY,ADBLOCK_PAGE_NAME,{// 'title' is intentionally omitted as it does not make sense
// in v3 implementation
                path:ADBLOCK_PAGE_PATH},state.loadOptions.value.sendAdblockPageOptions));}}},{key:"track",value:function track(payload){var _this$eventManager3;var type='track';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,payload]);return;}this.errorHandler.leaveBreadcrumb("New ".concat(type," event"));state.metrics.triggered.value+=1;(_this$eventManager3=this.eventManager)===null||_this$eventManager3===void 0||_this$eventManager3.addEvent({type:type,name:payload.name||undefined,properties:payload.properties,options:payload.options,callback:payload.callback});}},{key:"identify",value:function identify(payload){var _this$userSessionMana3,_this$eventManager4;var type='identify';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,payload]);return;}this.errorHandler.leaveBreadcrumb("New ".concat(type," event"));state.metrics.triggered.value+=1;var shouldResetSession=Boolean(payload.userId&&state.session.userId.value&&payload.userId!==state.session.userId.value);if(shouldResetSession){this.reset();}// `null` value indicates that previous user ID needs to be retained
            if(!isNull(payload.userId)){var _this$userSessionMana2;(_this$userSessionMana2=this.userSessionManager)===null||_this$userSessionMana2===void 0||_this$userSessionMana2.setUserId(payload.userId);}(_this$userSessionMana3=this.userSessionManager)===null||_this$userSessionMana3===void 0||_this$userSessionMana3.setUserTraits(payload.traits);(_this$eventManager4=this.eventManager)===null||_this$eventManager4===void 0||_this$eventManager4.addEvent({type:type,userId:payload.userId,traits:payload.traits,options:payload.options,callback:payload.callback});}},{key:"alias",value:function alias(payload){var _ref2,_payload$from,_this$userSessionMana4,_this$userSessionMana5,_this$eventManager5;var type='alias';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,payload]);return;}this.errorHandler.leaveBreadcrumb("New ".concat(type," event"));state.metrics.triggered.value+=1;var previousId=(_ref2=(_payload$from=payload.from)!==null&&_payload$from!==void 0?_payload$from:(_this$userSessionMana4=this.userSessionManager)===null||_this$userSessionMana4===void 0?void 0:_this$userSessionMana4.getUserId())!==null&&_ref2!==void 0?_ref2:(_this$userSessionMana5=this.userSessionManager)===null||_this$userSessionMana5===void 0?void 0:_this$userSessionMana5.getAnonymousId();(_this$eventManager5=this.eventManager)===null||_this$eventManager5===void 0||_this$eventManager5.addEvent({type:type,to:payload.to,from:previousId,options:payload.options,callback:payload.callback});}},{key:"group",value:function group(payload){var _this$userSessionMana7,_this$eventManager6;var type='group';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,payload]);return;}this.errorHandler.leaveBreadcrumb("New ".concat(type," event"));state.metrics.triggered.value+=1;// `null` value indicates that previous group ID needs to be retained
            if(!isNull(payload.groupId)){var _this$userSessionMana6;(_this$userSessionMana6=this.userSessionManager)===null||_this$userSessionMana6===void 0||_this$userSessionMana6.setGroupId(payload.groupId);}(_this$userSessionMana7=this.userSessionManager)===null||_this$userSessionMana7===void 0||_this$userSessionMana7.setGroupTraits(payload.traits);(_this$eventManager6=this.eventManager)===null||_this$eventManager6===void 0||_this$eventManager6.addEvent({type:type,groupId:payload.groupId,traits:payload.traits,options:payload.options,callback:payload.callback});}},{key:"reset",value:function reset(resetAnonymousId){var _this$userSessionMana8;var type='reset';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,resetAnonymousId]);return;}this.errorHandler.leaveBreadcrumb("New ".concat(type," invocation, resetAnonymousId: ").concat(resetAnonymousId));(_this$userSessionMana8=this.userSessionManager)===null||_this$userSessionMana8===void 0||_this$userSessionMana8.reset(resetAnonymousId);}},{key:"getAnonymousId",value:function getAnonymousId(options){var _this$userSessionMana9;return (_this$userSessionMana9=this.userSessionManager)===null||_this$userSessionMana9===void 0?void 0:_this$userSessionMana9.getAnonymousId(options);}},{key:"setAnonymousId",value:function setAnonymousId(anonymousId,rudderAmpLinkerParam){var _this$userSessionMana10;var type='setAnonymousId';// Buffering is needed as setting the anonymous ID may require invoking the GoogleLinker plugin
            if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,anonymousId,rudderAmpLinkerParam]);return;}this.errorHandler.leaveBreadcrumb("New ".concat(type," invocation"));(_this$userSessionMana10=this.userSessionManager)===null||_this$userSessionMana10===void 0||_this$userSessionMana10.setAnonymousId(anonymousId,rudderAmpLinkerParam);}// eslint-disable-next-line class-methods-use-this
    },{key:"getUserId",value:function getUserId(){return state.session.userId.value;}// eslint-disable-next-line class-methods-use-this
    },{key:"getUserTraits",value:function getUserTraits(){return state.session.userTraits.value;}// eslint-disable-next-line class-methods-use-this
    },{key:"getGroupId",value:function getGroupId(){return state.session.groupId.value;}// eslint-disable-next-line class-methods-use-this
    },{key:"getGroupTraits",value:function getGroupTraits(){return state.session.groupTraits.value;}},{key:"startSession",value:function startSession(sessionId){var _this$userSessionMana11;var type='startSession';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type,sessionId]);return;}this.errorHandler.leaveBreadcrumb("New ".concat(type," invocation"));(_this$userSessionMana11=this.userSessionManager)===null||_this$userSessionMana11===void 0||_this$userSessionMana11.start(sessionId);}},{key:"endSession",value:function endSession(){var _this$userSessionMana12;var type='endSession';if(!state.lifecycle.loaded.value){state.eventBuffer.toBeProcessedArray.value.push([type]);return;}this.errorHandler.leaveBreadcrumb("New ".concat(type," invocation"));(_this$userSessionMana12=this.userSessionManager)===null||_this$userSessionMana12===void 0||_this$userSessionMana12.end();}// eslint-disable-next-line class-methods-use-this
    },{key:"getSessionId",value:function getSessionId(){var _this$userSessionMana13;var sessionId=(_this$userSessionMana13=this.userSessionManager)===null||_this$userSessionMana13===void 0?void 0:_this$userSessionMana13.getSessionId();return sessionId!==null&&sessionId!==void 0?sessionId:null;}},{key:"consent",value:function consent(options){var _this5=this,_this$storeManager2,_this$userSessionMana14,_this$eventManager7;this.errorHandler.leaveBreadcrumb("New consent invocation");n(function(){state.consents.preConsent.value=_objectSpread2(_objectSpread2({},state.consents.preConsent.value),{},{enabled:false});state.consents.postConsent.value=getValidPostConsentOptions(options);var _getConsentManagement=getConsentManagementData(state.consents.postConsent.value.consentManagement,_this5.logger),initialized=_getConsentManagement.initialized,consentsData=_getConsentManagement.consentsData;state.consents.initialized.value=initialized||state.consents.initialized.value;state.consents.data.value=consentsData;});// Update consents data in state
            if(state.consents.enabled.value&&!state.consents.initialized.value){var _this$pluginsManager6;(_this$pluginsManager6=this.pluginsManager)===null||_this$pluginsManager6===void 0||_this$pluginsManager6.invokeSingle("consentManager.updateConsentsInfo",state,this.storeManager,this.logger);}// Re-init store manager
            (_this$storeManager2=this.storeManager)===null||_this$storeManager2===void 0||_this$storeManager2.initializeStorageState();// Re-init user session manager
            (_this$userSessionMana14=this.userSessionManager)===null||_this$userSessionMana14===void 0||_this$userSessionMana14.syncStorageDataToState();// Resume event manager to process the events to destinations
            (_this$eventManager7=this.eventManager)===null||_this$eventManager7===void 0||_this$eventManager7.resume();this.loadDestinations();this.sendTrackingEvents();}},{key:"sendTrackingEvents",value:function sendTrackingEvents(){if(state.consents.postConsent.value.trackConsent){this.track(trackArgumentsToCallOptions(CONSENT_TRACK_EVENT_NAME));}if(state.consents.postConsent.value.sendPageEvent){this.page(pageArgumentsToCallOptions());}}},{key:"setAuthToken",value:function setAuthToken(token){var _this$userSessionMana15;(_this$userSessionMana15=this.userSessionManager)===null||_this$userSessionMana15===void 0||_this$userSessionMana15.setAuthToken(token);}// End consumer exposed methods
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
        }this.setDefaultInstanceKey=this.setDefaultInstanceKey.bind(this);this.getAnalyticsInstance=this.getAnalyticsInstance.bind(this);this.load=this.load.bind(this);this.ready=this.ready.bind(this);this.getPreloadBuffer=this.getPreloadBuffer.bind(this);this.triggerBufferedLoadEvent=this.triggerBufferedLoadEvent.bind(this);this.page=this.page.bind(this);this.track=this.track.bind(this);this.identify=this.identify.bind(this);this.alias=this.alias.bind(this);this.group=this.group.bind(this);this.reset=this.reset.bind(this);this.getAnonymousId=this.getAnonymousId.bind(this);this.setAnonymousId=this.setAnonymousId.bind(this);this.getUserId=this.getUserId.bind(this);this.getUserTraits=this.getUserTraits.bind(this);this.getGroupId=this.getGroupId.bind(this);this.getGroupTraits=this.getGroupTraits.bind(this);this.startSession=this.startSession.bind(this);this.endSession=this.endSession.bind(this);this.getSessionId=this.getSessionId.bind(this);this.setAuthToken=this.setAuthToken.bind(this);this.consent=this.consent.bind(this);RudderAnalytics.globalSingleton=this;// get the preloaded events before replacing global object
            this.getPreloadBuffer();// start loading if a load event was buffered or wait for explicit load call
            this.triggerBufferedLoadEvent();}/**
         * Set instance to use if no specific writeKey is provided in methods
         * automatically for the first created instance
         * TODO: to support multiple analytics instances in the near future
         */_createClass(RudderAnalytics,[{key:"setDefaultInstanceKey",value:function setDefaultInstanceKey(writeKey){if(writeKey){this.defaultAnalyticsKey=writeKey;}}/**
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
             */},{key:"group",value:function group(groupId,traits,options,callback){if(arguments.length===0){this.logger.error(EMPTY_GROUP_CALL_ERROR(RS_APP));return;}this.getAnalyticsInstance().group(groupArgumentsToCallOptions(groupId,traits,options,callback));}},{key:"reset",value:function reset(resetAnonymousId){this.getAnalyticsInstance().reset(resetAnonymousId);}},{key:"getAnonymousId",value:function getAnonymousId(options){return this.getAnalyticsInstance().getAnonymousId(options);}},{key:"setAnonymousId",value:function setAnonymousId(anonymousId,rudderAmpLinkerParam){this.getAnalyticsInstance().setAnonymousId(anonymousId,rudderAmpLinkerParam);}},{key:"getUserId",value:function getUserId(){return this.getAnalyticsInstance().getUserId();}},{key:"getUserTraits",value:function getUserTraits(){return this.getAnalyticsInstance().getUserTraits();}},{key:"getGroupId",value:function getGroupId(){return this.getAnalyticsInstance().getGroupId();}},{key:"getGroupTraits",value:function getGroupTraits(){return this.getAnalyticsInstance().getGroupTraits();}},{key:"startSession",value:function startSession(sessionId){return this.getAnalyticsInstance().startSession(sessionId);}},{key:"endSession",value:function endSession(){return this.getAnalyticsInstance().endSession();}},{key:"getSessionId",value:function getSessionId(){return this.getAnalyticsInstance().getSessionId();}},{key:"setAuthToken",value:function setAuthToken(token){return this.getAnalyticsInstance().setAuthToken(token);}},{key:"consent",value:function consent(options){return this.getAnalyticsInstance().consent(options);}}]);return RudderAnalytics;}();_defineProperty(RudderAnalytics,"globalSingleton",null);

    //=====================================================================================

    console.log("This prints to the console of the page (injected only if the page url matched)");

    const rudderanalytics = new RudderAnalytics();

    const initialiseRudderstack = () => {
        rudderanalytics.load(
          "2L8Fl7ryPss3Zku133Pj5ox7NeP",
          "https://rudderstacpn.dataplane.rudderstack.com",
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
