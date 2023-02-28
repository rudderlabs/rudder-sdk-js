rudderanalytics = (function (t) {
  'use strict';
  function e(t, e) {
    var n = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(t);
      e &&
        (r = r.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function n(t) {
    for (var n = 1; n < arguments.length; n++) {
      var r = null != arguments[n] ? arguments[n] : {};
      n % 2
        ? e(Object(r), !0).forEach(function (e) {
            l(t, e, r[e]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
        : e(Object(r)).forEach(function (e) {
            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e));
          });
    }
    return t;
  }
  function r() {
    r = function () {
      return t;
    };
    var t = {},
      e = Object.prototype,
      n = e.hasOwnProperty,
      i =
        Object.defineProperty ||
        function (t, e, n) {
          t[e] = n.value;
        },
      o = 'function' == typeof Symbol ? Symbol : {},
      s = o.iterator || '@@iterator',
      a = o.asyncIterator || '@@asyncIterator',
      u = o.toStringTag || '@@toStringTag';
    function c(t, e, n) {
      return (
        Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }),
        t[e]
      );
    }
    try {
      c({}, '');
    } catch (T) {
      c = function (t, e, n) {
        return (t[e] = n);
      };
    }
    function l(t, e, n, r) {
      var o = e && e.prototype instanceof p ? e : p,
        s = Object.create(o.prototype),
        a = new A(r || []);
      return i(s, '_invoke', { value: b(t, n, a) }), s;
    }
    function f(t, e, n) {
      try {
        return { type: 'normal', arg: t.call(e, n) };
      } catch (T) {
        return { type: 'throw', arg: T };
      }
    }
    t.wrap = l;
    var h = {};
    function p() {}
    function d() {}
    function v() {}
    var g = {};
    c(g, s, function () {
      return this;
    });
    var y = Object.getPrototypeOf,
      m = y && y(y(O([])));
    m && m !== e && n.call(m, s) && (g = m);
    var _ = (v.prototype = p.prototype = Object.create(g));
    function k(t) {
      ['next', 'throw', 'return'].forEach(function (e) {
        c(t, e, function (t) {
          return this._invoke(e, t);
        });
      });
    }
    function w(t, e) {
      function r(i, o, s, a) {
        var u = f(t[i], t, o);
        if ('throw' !== u.type) {
          var c = u.arg,
            l = c.value;
          return l && 'object' == typeof l && n.call(l, '__await')
            ? e.resolve(l.__await).then(
                function (t) {
                  r('next', t, s, a);
                },
                function (t) {
                  r('throw', t, s, a);
                },
              )
            : e.resolve(l).then(
                function (t) {
                  (c.value = t), s(c);
                },
                function (t) {
                  return r('throw', t, s, a);
                },
              );
        }
        a(u.arg);
      }
      var o;
      i(this, '_invoke', {
        value: function (t, n) {
          function i() {
            return new e(function (e, i) {
              r(t, n, e, i);
            });
          }
          return (o = o ? o.then(i, i) : i());
        },
      });
    }
    function b(t, e, n) {
      var r = 'suspendedStart';
      return function (i, o) {
        if ('executing' === r) throw new Error('Generator is already running');
        if ('completed' === r) {
          if ('throw' === i) throw o;
          return R();
        }
        for (n.method = i, n.arg = o; ; ) {
          var s = n.delegate;
          if (s) {
            var a = I(s, n);
            if (a) {
              if (a === h) continue;
              return a;
            }
          }
          if ('next' === n.method) n.sent = n._sent = n.arg;
          else if ('throw' === n.method) {
            if ('suspendedStart' === r) throw ((r = 'completed'), n.arg);
            n.dispatchException(n.arg);
          } else 'return' === n.method && n.abrupt('return', n.arg);
          r = 'executing';
          var u = f(t, e, n);
          if ('normal' === u.type) {
            if (((r = n.done ? 'completed' : 'suspendedYield'), u.arg === h)) continue;
            return { value: u.arg, done: n.done };
          }
          'throw' === u.type && ((r = 'completed'), (n.method = 'throw'), (n.arg = u.arg));
        }
      };
    }
    function I(t, e) {
      var n = e.method,
        r = t.iterator[n];
      if (void 0 === r)
        return (
          (e.delegate = null),
          ('throw' === n &&
            t.iterator.return &&
            ((e.method = 'return'), (e.arg = void 0), I(t, e), 'throw' === e.method)) ||
            ('return' !== n &&
              ((e.method = 'throw'),
              (e.arg = new TypeError("The iterator does not provide a '" + n + "' method")))),
          h
        );
      var i = f(r, t.iterator, e.arg);
      if ('throw' === i.type) return (e.method = 'throw'), (e.arg = i.arg), (e.delegate = null), h;
      var o = i.arg;
      return o
        ? o.done
          ? ((e[t.resultName] = o.value),
            (e.next = t.nextLoc),
            'return' !== e.method && ((e.method = 'next'), (e.arg = void 0)),
            (e.delegate = null),
            h)
          : o
        : ((e.method = 'throw'),
          (e.arg = new TypeError('iterator result is not an object')),
          (e.delegate = null),
          h);
    }
    function E(t) {
      var e = { tryLoc: t[0] };
      1 in t && (e.catchLoc = t[1]),
        2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
        this.tryEntries.push(e);
    }
    function S(t) {
      var e = t.completion || {};
      (e.type = 'normal'), delete e.arg, (t.completion = e);
    }
    function A(t) {
      (this.tryEntries = [{ tryLoc: 'root' }]), t.forEach(E, this), this.reset(!0);
    }
    function O(t) {
      if (t) {
        var e = t[s];
        if (e) return e.call(t);
        if ('function' == typeof t.next) return t;
        if (!isNaN(t.length)) {
          var r = -1,
            i = function e() {
              for (; ++r < t.length; ) if (n.call(t, r)) return (e.value = t[r]), (e.done = !1), e;
              return (e.value = void 0), (e.done = !0), e;
            };
          return (i.next = i);
        }
      }
      return { next: R };
    }
    function R() {
      return { value: void 0, done: !0 };
    }
    return (
      (d.prototype = v),
      i(_, 'constructor', { value: v, configurable: !0 }),
      i(v, 'constructor', { value: d, configurable: !0 }),
      (d.displayName = c(v, u, 'GeneratorFunction')),
      (t.isGeneratorFunction = function (t) {
        var e = 'function' == typeof t && t.constructor;
        return !!e && (e === d || 'GeneratorFunction' === (e.displayName || e.name));
      }),
      (t.mark = function (t) {
        return (
          Object.setPrototypeOf
            ? Object.setPrototypeOf(t, v)
            : ((t.__proto__ = v), c(t, u, 'GeneratorFunction')),
          (t.prototype = Object.create(_)),
          t
        );
      }),
      (t.awrap = function (t) {
        return { __await: t };
      }),
      k(w.prototype),
      c(w.prototype, a, function () {
        return this;
      }),
      (t.AsyncIterator = w),
      (t.async = function (e, n, r, i, o) {
        void 0 === o && (o = Promise);
        var s = new w(l(e, n, r, i), o);
        return t.isGeneratorFunction(n)
          ? s
          : s.next().then(function (t) {
              return t.done ? t.value : s.next();
            });
      }),
      k(_),
      c(_, u, 'Generator'),
      c(_, s, function () {
        return this;
      }),
      c(_, 'toString', function () {
        return '[object Generator]';
      }),
      (t.keys = function (t) {
        var e = Object(t),
          n = [];
        for (var r in e) n.push(r);
        return (
          n.reverse(),
          function t() {
            for (; n.length; ) {
              var r = n.pop();
              if (r in e) return (t.value = r), (t.done = !1), t;
            }
            return (t.done = !0), t;
          }
        );
      }),
      (t.values = O),
      (A.prototype = {
        constructor: A,
        reset: function (t) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = void 0),
            (this.done = !1),
            (this.delegate = null),
            (this.method = 'next'),
            (this.arg = void 0),
            this.tryEntries.forEach(S),
            !t)
          )
            for (var e in this)
              't' === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = void 0);
        },
        stop: function () {
          this.done = !0;
          var t = this.tryEntries[0].completion;
          if ('throw' === t.type) throw t.arg;
          return this.rval;
        },
        dispatchException: function (t) {
          if (this.done) throw t;
          var e = this;
          function r(n, r) {
            return (
              (s.type = 'throw'),
              (s.arg = t),
              (e.next = n),
              r && ((e.method = 'next'), (e.arg = void 0)),
              !!r
            );
          }
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var o = this.tryEntries[i],
              s = o.completion;
            if ('root' === o.tryLoc) return r('end');
            if (o.tryLoc <= this.prev) {
              var a = n.call(o, 'catchLoc'),
                u = n.call(o, 'finallyLoc');
              if (a && u) {
                if (this.prev < o.catchLoc) return r(o.catchLoc, !0);
                if (this.prev < o.finallyLoc) return r(o.finallyLoc);
              } else if (a) {
                if (this.prev < o.catchLoc) return r(o.catchLoc, !0);
              } else {
                if (!u) throw new Error('try statement without catch or finally');
                if (this.prev < o.finallyLoc) return r(o.finallyLoc);
              }
            }
          }
        },
        abrupt: function (t, e) {
          for (var r = this.tryEntries.length - 1; r >= 0; --r) {
            var i = this.tryEntries[r];
            if (i.tryLoc <= this.prev && n.call(i, 'finallyLoc') && this.prev < i.finallyLoc) {
              var o = i;
              break;
            }
          }
          o &&
            ('break' === t || 'continue' === t) &&
            o.tryLoc <= e &&
            e <= o.finallyLoc &&
            (o = null);
          var s = o ? o.completion : {};
          return (
            (s.type = t),
            (s.arg = e),
            o ? ((this.method = 'next'), (this.next = o.finallyLoc), h) : this.complete(s)
          );
        },
        complete: function (t, e) {
          if ('throw' === t.type) throw t.arg;
          return (
            'break' === t.type || 'continue' === t.type
              ? (this.next = t.arg)
              : 'return' === t.type
              ? ((this.rval = this.arg = t.arg), (this.method = 'return'), (this.next = 'end'))
              : 'normal' === t.type && e && (this.next = e),
            h
          );
        },
        finish: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var n = this.tryEntries[e];
            if (n.finallyLoc === t) return this.complete(n.completion, n.afterLoc), S(n), h;
          }
        },
        catch: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var n = this.tryEntries[e];
            if (n.tryLoc === t) {
              var r = n.completion;
              if ('throw' === r.type) {
                var i = r.arg;
                S(n);
              }
              return i;
            }
          }
          throw new Error('illegal catch attempt');
        },
        delegateYield: function (t, e, n) {
          return (
            (this.delegate = { iterator: O(t), resultName: e, nextLoc: n }),
            'next' === this.method && (this.arg = void 0),
            h
          );
        },
      }),
      t
    );
  }
  function i(t) {
    return (
      (i =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t &&
                'function' == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? 'symbol'
                : typeof t;
            }),
      i(t)
    );
  }
  function o(t, e, n, r, i, o, s) {
    try {
      var a = t[o](s),
        u = a.value;
    } catch (c) {
      return void n(c);
    }
    a.done ? e(u) : Promise.resolve(u).then(r, i);
  }
  function s(t) {
    return function () {
      var e = this,
        n = arguments;
      return new Promise(function (r, i) {
        var s = t.apply(e, n);
        function a(t) {
          o(s, r, i, a, u, 'next', t);
        }
        function u(t) {
          o(s, r, i, a, u, 'throw', t);
        }
        a(void 0);
      });
    };
  }
  function a(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
  }
  function u(t, e) {
    for (var n = 0; n < e.length; n++) {
      var r = e[n];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        'value' in r && (r.writable = !0),
        Object.defineProperty(t, p(r.key), r);
    }
  }
  function c(t, e, n) {
    return (
      e && u(t.prototype, e),
      n && u(t, n),
      Object.defineProperty(t, 'prototype', { writable: !1 }),
      t
    );
  }
  function l(t, e, n) {
    return (
      (e = p(e)) in t
        ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 })
        : (t[e] = n),
      t
    );
  }
  function f(t) {
    return (
      (function (t) {
        if (Array.isArray(t)) return h(t);
      })(t) ||
      (function (t) {
        if (('undefined' != typeof Symbol && null != t[Symbol.iterator]) || null != t['@@iterator'])
          return Array.from(t);
      })(t) ||
      (function (t, e) {
        if (!t) return;
        if ('string' == typeof t) return h(t, e);
        var n = Object.prototype.toString.call(t).slice(8, -1);
        'Object' === n && t.constructor && (n = t.constructor.name);
        if ('Map' === n || 'Set' === n) return Array.from(t);
        if ('Arguments' === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return h(t, e);
      })(t) ||
      (function () {
        throw new TypeError(
          'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
        );
      })()
    );
  }
  function h(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
    return r;
  }
  function p(t) {
    var e = (function (t, e) {
      if ('object' != typeof t || null === t) return t;
      var n = t[Symbol.toPrimitive];
      if (void 0 !== n) {
        var r = n.call(t, e || 'default');
        if ('object' != typeof r) return r;
        throw new TypeError('@@toPrimitive must return a primitive value.');
      }
      return ('string' === e ? String : Number)(t);
    })(t, 'string');
    return 'symbol' == typeof e ? e : String(e);
  }
  'undefined' != typeof globalThis
    ? globalThis
    : 'undefined' != typeof window
    ? window
    : 'undefined' != typeof global
    ? global
    : 'undefined' != typeof self && self;
  var d = [],
    v = {},
    g = {},
    y = 'undefined' != typeof window && void 0 !== window.document,
    m = 'undefined' != typeof process && null != process.versions && null != process.versions.node,
    _ =
      (y && document.location.search.includes('JS_PLUGIN_DEBUG')) ||
      (m && process.env && process.env.JS_PLUGIN_DEBUG);
  function k(t, e) {
    for (var n = e.split('.'), r = 0; r < n.length; r++) {
      if (!(n[r] in t)) return;
      t = t[n[r]];
    }
    return t;
  }
  var w = {
    config: {},
    register: function (t) {
      if (!t.name)
        throw (
          (console.log('Every plugin should have a name.'),
          console.log(t),
          new Error('Every plugin should have a name.'))
        );
      if (v[t.name]) throw new Error('Plugin "' + t.name + '" already exits.');
      g = {};
      var e = (d = d.slice()).length;
      d.forEach(function (n, r) {
        n.deps && n.deps.indexOf(t.name) >= 0 && (e = Math.min(e, r));
      }),
        d.splice(e, 0, t),
        (v[t.name] = t),
        t.initialize && t.initialize();
    },
    unregister: function (t) {
      var e = v[t];
      if (!e) throw new Error('Plugin "' + t + '" does\'t exist.');
      var n = d.indexOf(e);
      if (-1 === n)
        throw new Error(
          'Plugin "' +
            t +
            '" does\'t exist in _plugins but in _byName. This seems to be a bug of js-plugin.',
        );
      (g = {}), delete v[t], (d = d.slice()).splice(n, 1);
    },
    getPlugin: function (t) {
      return v[t];
    },
    getPlugins: function (t) {
      return (
        t || (t = '.'),
        g[t] ||
          (g[t] = d.filter(function (e) {
            if (
              e.deps &&
              e.deps.some(function (t) {
                return !v[t];
              })
            ) {
              var n = e.deps.filter(function (t) {
                return !v[t];
              });
              return (
                console.log(
                  'Plugin '
                    .concat(e.name, ' is not loaded because its deps do not exist: ')
                    .concat(n, '.'),
                ),
                !1
              );
            }
            return (
              '.' === t ||
              (function (t, e) {
                for (var n = e.split('.'), r = 0; r < n.length; r++) {
                  if (!(n[r] in t)) return;
                  t = t[n[r]];
                }
                return !0;
              })(e, t)
            );
          })),
        g[t]
      );
    },
    processRawPlugins: function (t) {
      t(d), (g = {});
    },
    invoke: function (t) {
      var e = Array.prototype.slice.call(arguments, 1);
      if (!t) throw new Error('Invoke on plugin should have prop argument');
      var n = /^!/.test(t),
        r = this.config.throws || /!$/.test(t),
        i = (t = t.replace(/^!|!$/g, '')).split('.');
      i.pop();
      var o = i.join('.');
      return this.getPlugins(t).map(function (i) {
        var s = k(i, t);
        if (
          !(function (t) {
            return !!(t.constructor && t.call && t.apply);
          })(s) ||
          n
        )
          return s;
        try {
          return _ && console.log('Before', i.name, t, e), s.apply(k(i, o), e);
        } catch (a) {
          if ((console.log('Failed to invoke plugin: ' + i.name + '!' + t), r)) throw a;
          console.log(a);
        } finally {
          _ && console.log('After ', i.name, t, e);
        }
        return null;
      });
    },
    sort: function (t, e) {
      (e = e || 'order'),
        t.sort(function (t, n) {
          return (t.hasOwnProperty(e) ? t[e] : 1e6) - (n.hasOwnProperty(e) ? n[e] : 1e6);
        });
    },
  };
  for (var b, I = 4096, E = [], S = 0; S < 256; S++) E[S] = (S + 256).toString(16).substring(1);
  function A() {
    var t;
    (!b || S + 16 > I) && ((t = I), (b = crypto.getRandomValues(new Uint8Array(t))), (S = 0));
    for (var e, n = 0, r = ''; n < 16; n++)
      (e = b[S + n]),
        (r += 6 == n ? E[(15 & e) | 64] : 8 == n ? E[(63 & e) | 128] : E[e]),
        1 & n && n > 1 && n < 11 && (r += '-');
    return (S += 16), r;
  }
  function O(t) {
    return null != t && 'object' === i(t) && !0 === t['@@functional/placeholder'];
  }
  function R(t) {
    return function e(n) {
      return 0 === arguments.length || O(n) ? e : t.apply(this, arguments);
    };
  }
  function T(t) {
    return function e(n, r) {
      switch (arguments.length) {
        case 0:
          return e;
        case 1:
          return O(n)
            ? e
            : R(function (e) {
                return t(n, e);
              });
        default:
          return O(n) && O(r)
            ? e
            : O(n)
            ? R(function (e) {
                return t(e, r);
              })
            : O(r)
            ? R(function (e) {
                return t(n, e);
              })
            : t(n, r);
      }
    };
  }
  function x(t) {
    return function e(n, r, i) {
      switch (arguments.length) {
        case 0:
          return e;
        case 1:
          return O(n)
            ? e
            : T(function (e, r) {
                return t(n, e, r);
              });
        case 2:
          return O(n) && O(r)
            ? e
            : O(n)
            ? T(function (e, n) {
                return t(e, r, n);
              })
            : O(r)
            ? T(function (e, r) {
                return t(n, e, r);
              })
            : R(function (e) {
                return t(n, r, e);
              });
        default:
          return O(n) && O(r) && O(i)
            ? e
            : O(n) && O(r)
            ? T(function (e, n) {
                return t(e, n, i);
              })
            : O(n) && O(i)
            ? T(function (e, n) {
                return t(e, r, n);
              })
            : O(r) && O(i)
            ? T(function (e, r) {
                return t(n, e, r);
              })
            : O(n)
            ? R(function (e) {
                return t(e, r, i);
              })
            : O(r)
            ? R(function (e) {
                return t(n, e, i);
              })
            : O(i)
            ? R(function (e) {
                return t(n, r, e);
              })
            : t(n, r, i);
      }
    };
  }
  function L(t, e) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }
  var P = R(function (t) {
    return null === t
      ? 'Null'
      : void 0 === t
      ? 'Undefined'
      : Object.prototype.toString.call(t).slice(8, -1);
  });
  function j(t, e, n, r) {
    var i,
      o = function (i) {
        for (var o = e.length, s = 0; s < o; ) {
          if (t === e[s]) return n[s];
          s += 1;
        }
        for (var a in ((e[s] = t), (n[s] = i), t))
          t.hasOwnProperty(a) && (i[a] = r ? j(t[a], e, n, !0) : t[a]);
        return i;
      };
    switch (P(t)) {
      case 'Object':
        return o(Object.create(Object.getPrototypeOf(t)));
      case 'Array':
        return o([]);
      case 'Date':
        return new Date(t.valueOf());
      case 'RegExp':
        return (
          (i = t),
          new RegExp(
            i.source,
            (i.global ? 'g' : '') +
              (i.ignoreCase ? 'i' : '') +
              (i.multiline ? 'm' : '') +
              (i.sticky ? 'y' : '') +
              (i.unicode ? 'u' : ''),
          )
        );
      case 'Int8Array':
      case 'Uint8Array':
      case 'Uint8ClampedArray':
      case 'Int16Array':
      case 'Uint16Array':
      case 'Int32Array':
      case 'Uint32Array':
      case 'Float32Array':
      case 'Float64Array':
      case 'BigInt64Array':
      case 'BigUint64Array':
        return t.slice();
      default:
        return t;
    }
  }
  var N = R(function (t) {
    return null != t && 'function' == typeof t.clone ? t.clone() : j(t, [], [], !0);
  });
  function C(t) {
    return '[object Object]' === Object.prototype.toString.call(t);
  }
  var U =
      'function' == typeof Object.assign
        ? Object.assign
        : function (t) {
            if (null == t) throw new TypeError('Cannot convert undefined or null to object');
            for (var e = Object(t), n = 1, r = arguments.length; n < r; ) {
              var i = arguments[n];
              if (null != i) for (var o in i) L(o, i) && (e[o] = i[o]);
              n += 1;
            }
            return e;
          },
    D = x(function (t, e, n) {
      var r,
        i = {};
      for (r in e) L(r, e) && (i[r] = L(r, n) ? t(r, e[r], n[r]) : e[r]);
      for (r in n) L(r, n) && !L(r, i) && (i[r] = n[r]);
      return i;
    }),
    M = x(function t(e, n, r) {
      return D(
        function (n, r, i) {
          return C(r) && C(i) ? t(e, r, i) : e(n, r, i);
        },
        n,
        r,
      );
    }),
    G = x(function (t, e, n) {
      return M(
        function (e, n, r) {
          return t(n, r);
        },
        e,
        n,
      );
    }),
    J = T(function (t, e) {
      return U({}, t, e);
    }),
    F = J;
  function Q() {
    throw new Error('Cycle detected');
  }
  function q() {
    if (H > 1) H--;
    else {
      for (var t, e = !1; void 0 !== B; ) {
        var n = B;
        for (B = void 0, V++; void 0 !== n; ) {
          var r = n.o;
          if (((n.o = void 0), (n.f &= -3), !(8 & n.f) && X(n)))
            try {
              n.c();
            } catch (n) {
              e || ((t = n), (e = !0));
            }
          n = r;
        }
      }
      if (((V = 0), H--, e)) throw t;
    }
  }
  var K = void 0,
    B = void 0,
    H = 0,
    V = 0,
    $ = 0;
  function Y(t) {
    if (void 0 !== K) {
      var e = t.n;
      if (void 0 === e || e.t !== K)
        return (
          (e = { i: 0, S: t, p: K.s, n: void 0, t: K, e: void 0, x: void 0, r: e }),
          void 0 !== K.s && (K.s.n = e),
          (K.s = e),
          (t.n = e),
          32 & K.f && t.S(e),
          e
        );
      if (-1 === e.i)
        return (
          (e.i = 0),
          void 0 !== e.n &&
            ((e.n.p = e.p),
            void 0 !== e.p && (e.p.n = e.n),
            (e.p = K.s),
            (e.n = void 0),
            (K.s.n = e),
            (K.s = e)),
          e
        );
    }
  }
  function z(t) {
    (this.v = t), (this.i = 0), (this.n = void 0), (this.t = void 0);
  }
  function W(t) {
    return new z(t);
  }
  function X(t) {
    for (var e = t.s; void 0 !== e; e = e.n)
      if (e.S.i !== e.i || !e.S.h() || e.S.i !== e.i) return !0;
    return !1;
  }
  function Z(t) {
    for (var e = t.s; void 0 !== e; e = e.n) {
      var n = e.S.n;
      if ((void 0 !== n && (e.r = n), (e.S.n = e), (e.i = -1), void 0 === e.n)) {
        t.s = e;
        break;
      }
    }
  }
  function tt(t) {
    for (var e = t.s, n = void 0; void 0 !== e; ) {
      var r = e.p;
      -1 === e.i ? (e.S.U(e), void 0 !== r && (r.n = e.n), void 0 !== e.n && (e.n.p = r)) : (n = e),
        (e.S.n = e.r),
        void 0 !== e.r && (e.r = void 0),
        (e = r);
    }
    t.s = n;
  }
  function et(t) {
    z.call(this, void 0), (this.x = t), (this.s = void 0), (this.g = $ - 1), (this.f = 4);
  }
  function nt(t) {
    var e = t.u;
    if (((t.u = void 0), 'function' == typeof e)) {
      H++;
      var n = K;
      K = void 0;
      try {
        e();
      } catch (q) {
        throw ((t.f &= -2), (t.f |= 8), rt(t), q);
      } finally {
        (K = n), q();
      }
    }
  }
  function rt(t) {
    for (var e = t.s; void 0 !== e; e = e.n) e.S.U(e);
    (t.x = void 0), (t.s = void 0), nt(t);
  }
  function it(t) {
    if (K !== this) throw new Error('Out-of-order effect');
    tt(this), (K = t), (this.f &= -2), 8 & this.f && rt(this), q();
  }
  function ot(t) {
    (this.x = t), (this.u = void 0), (this.s = void 0), (this.o = void 0), (this.f = 32);
  }
  function st(t) {
    var e = new ot(t);
    try {
      e.c();
    } catch (t) {
      throw (e.d(), t);
    }
    return e.d.bind(e);
  }
  (z.prototype.h = function () {
    return !0;
  }),
    (z.prototype.S = function (t) {
      this.t !== t &&
        void 0 === t.e &&
        ((t.x = this.t), void 0 !== this.t && (this.t.e = t), (this.t = t));
    }),
    (z.prototype.U = function (t) {
      if (void 0 !== this.t) {
        var e = t.e,
          n = t.x;
        void 0 !== e && ((e.x = n), (t.e = void 0)),
          void 0 !== n && ((n.e = e), (t.x = void 0)),
          t === this.t && (this.t = n);
      }
    }),
    (z.prototype.subscribe = function (t) {
      var e = this;
      return st(function () {
        var n = e.value,
          r = 32 & this.f;
        this.f &= -33;
        try {
          t(n);
        } finally {
          this.f |= r;
        }
      });
    }),
    (z.prototype.valueOf = function () {
      return this.value;
    }),
    (z.prototype.toString = function () {
      return this.value + '';
    }),
    (z.prototype.peek = function () {
      return this.v;
    }),
    Object.defineProperty(z.prototype, 'value', {
      get: function () {
        var t = Y(this);
        return void 0 !== t && (t.i = this.i), this.v;
      },
      set: function (t) {
        if (t !== this.v) {
          V > 100 && Q(), (this.v = t), this.i++, $++, H++;
          try {
            for (var e = this.t; void 0 !== e; e = e.x) e.t.N();
          } finally {
            q();
          }
        }
      },
    }),
    ((et.prototype = new z()).h = function () {
      if (((this.f &= -3), 1 & this.f)) return !1;
      if (32 == (36 & this.f)) return !0;
      if (((this.f &= -5), this.g === $)) return !0;
      if (((this.g = $), (this.f |= 1), this.i > 0 && !X(this))) return (this.f &= -2), !0;
      var t = K;
      try {
        Z(this), (K = this);
        var e = this.x();
        (16 & this.f || this.v !== e || 0 === this.i) && ((this.v = e), (this.f &= -17), this.i++);
      } catch (t) {
        (this.v = t), (this.f |= 16), this.i++;
      }
      return (K = t), tt(this), (this.f &= -2), !0;
    }),
    (et.prototype.S = function (t) {
      if (void 0 === this.t) {
        this.f |= 36;
        for (var e = this.s; void 0 !== e; e = e.n) e.S.S(e);
      }
      z.prototype.S.call(this, t);
    }),
    (et.prototype.U = function (t) {
      if (void 0 !== this.t && (z.prototype.U.call(this, t), void 0 === this.t)) {
        this.f &= -33;
        for (var e = this.s; void 0 !== e; e = e.n) e.S.U(e);
      }
    }),
    (et.prototype.N = function () {
      if (!(2 & this.f)) {
        this.f |= 6;
        for (var t = this.t; void 0 !== t; t = t.x) t.t.N();
      }
    }),
    (et.prototype.peek = function () {
      if ((this.h() || Q(), 16 & this.f)) throw this.v;
      return this.v;
    }),
    Object.defineProperty(et.prototype, 'value', {
      get: function () {
        1 & this.f && Q();
        var t = Y(this);
        if ((this.h(), void 0 !== t && (t.i = this.i), 16 & this.f)) throw this.v;
        return this.v;
      },
    }),
    (ot.prototype.c = function () {
      var t = this.S();
      try {
        8 & this.f || void 0 === this.x || (this.u = this.x());
      } finally {
        t();
      }
    }),
    (ot.prototype.S = function () {
      1 & this.f && Q(), (this.f |= 1), (this.f &= -9), nt(this), Z(this), H++;
      var t = K;
      return (K = this), it.bind(this, t);
    }),
    (ot.prototype.N = function () {
      2 & this.f || ((this.f |= 2), (this.o = B), (B = this));
    }),
    (ot.prototype.d = function () {
      (this.f |= 8), 1 & this.f || rt(this);
    });
  const at = {
      remoteModules: {
        url: 'http://localhost:3002/dist/modern/remoteEntry.js',
        format: 'esm',
        from: 'vite',
      },
    },
    ut = async (t, e) => {
      const n = 'function' == typeof t ? await t() : t,
        r = document.createElement('script');
      (r.type = 'text/javascript'),
        (r.onload = e),
        (r.src = n),
        document.getElementsByTagName('head')[0].appendChild(r);
    },
    ct = ['var'],
    lt = ['esm', 'systemjs'],
    ft = t => ({});
  function ht(t, e) {
    if (!t?.default && e) {
      let e = Object.create(null);
      return (e.default = t), (e.__esModule = !0), e;
    }
    return t;
  }
  function pt(t, e) {
    return (async function (t) {
      const e = at[t];
      return e.inited
        ? e.lib
        : ct.includes(e.format)
        ? new Promise(n =>
            ut(e.url, () => {
              e.inited || ((e.lib = window[t]), e.lib.init(ft(e.from)), (e.inited = !0)), n(e.lib);
            }),
          )
        : lt.includes(e.format)
        ? new Promise(t => {
            ('function' == typeof e.url ? e.url : () => Promise.resolve(e.url))().then(n => {
              import(n).then(n => {
                if (!e.inited) {
                  const t = ft(e.from);
                  n.init(t), (e.lib = n), e.lib.init(t), (e.inited = !0);
                }
                t(e.lib);
              });
            });
          })
        : void 0;
    })(t).then(t => t.get(e).then(t => t()));
  }
  for (
    var dt,
      vt = { counter: 0 },
      gt = W(n({}, vt)),
      yt = W(n({}, vt)),
      mt = W([]),
      _t = W([]),
      kt = W({}),
      wt = W({}),
      bt = {
        globalLocalState: gt,
        remoteState: yt,
        successfullyLoadedIntegration: mt,
        failedToBeLoadedIntegration: _t,
        dynamicallyLoadedIntegrations: kt,
        config: wt,
      },
      It = function (t, e) {
        window.RudderStackGlobals || (window.RudderStackGlobals = {}),
          (window.RudderStackGlobals[t] = e);
      },
      Et = (function () {
        var t = s(
          r().mark(function t() {
            return r().wrap(function (t) {
              for (;;)
                switch ((t.prev = t.next)) {
                  case 0:
                    w.register({
                      name: 'localTest',
                      deps: ['localTest2', 'localTest3'],
                      local: {
                        test: function (t) {
                          var e = f(t);
                          return (
                            e.push('item from local plugin'),
                            st(function () {
                              var t = n({}, gt.peek());
                              (t.counter += 1), (gt.value = t);
                            }),
                            st(function () {
                              console.log('local state in local plugin: ', gt.value);
                            }),
                            st(function () {
                              console.log('remote state in local plugin: ', yt.value);
                            }),
                            e
                          );
                        },
                      },
                    }),
                      w.register({
                        name: 'localTest2',
                        local: {
                          test: function (t) {
                            var e = f(t);
                            return e.push('item from local plugin 2'), e;
                          },
                        },
                      }),
                      w.register({
                        name: 'localTest3',
                        localMutate: {
                          test: function (t) {
                            t.push('item from local plugin 3');
                          },
                        },
                      }),
                      w.register({
                        name: 'dummyMultiLifeCyclePlugin',
                        init: {
                          pre: function (t, e) {
                            console.log(
                              'init.pre lifecycle event: '.concat(JSON.stringify(e.config.value)),
                            ),
                              (e.config.value = t);
                          },
                          post: function (t) {
                            console.log(
                              'init.post lifecycle event: '.concat(JSON.stringify(t.config.value)),
                            );
                          },
                        },
                        ready: {
                          post: function () {
                            console.log('ready.post lifecycle event'),
                              w.invoke('ready.insidePlugin');
                          },
                          insidePlugin: function () {
                            console.log('ready.insidePlugin lifecycle event');
                          },
                        },
                      }),
                      [
                        function () {
                          return pt('remoteModules', './RemotePlugin').then(t => ht(t, !0));
                        },
                        function () {
                          return pt('remoteModules', './RemotePlugin2').then(t => ht(t, !0));
                        },
                        function () {
                          return pt('remoteModules', './LoadIntegrations').then(t => ht(t, !0));
                        },
                      ].forEach(
                        (function () {
                          var t = s(
                            r().mark(function t(e) {
                              return r().wrap(function (t) {
                                for (;;)
                                  switch ((t.prev = t.next)) {
                                    case 0:
                                      return (
                                        (t.next = 2),
                                        e().then(function (t) {
                                          return w.register(t.default());
                                        })
                                      );
                                    case 2:
                                    case 'end':
                                      return t.stop();
                                  }
                              }, t);
                            }),
                          );
                          return function (e) {
                            return t.apply(this, arguments);
                          };
                        })(),
                      );
                  case 9:
                  case 'end':
                    return t.stop();
                }
            }, t);
          }),
        );
        return function () {
          return t.apply(this, arguments);
        };
      })(),
      St = (function () {
        function t() {
          a(this, t);
        }
        return (
          c(t, [
            {
              key: 'get',
              value: function (t) {
                return fetch('/dummyUrlToTestFetch')
                  .then(function (t) {
                    if (t.ok) return t;
                    var e = new Error(t.statusText);
                    return (e.response = t), Promise.reject(e);
                  })
                  .then(function (t) {
                    return t.json();
                  })
                  .then(function (t) {
                    return t;
                  });
              },
            },
          ]),
          t
        );
      })(),
      At = 256,
      Ot = [];
    At--;

  )
    Ot[At] = (At + 256).toString(16).substring(1);
  function Rt() {
    var t,
      e = 0,
      n = '';
    if (!dt || At + 16 > 256) {
      for (dt = Array((e = 256)); e--; ) dt[e] = (256 * Math.random()) | 0;
      e = At = 0;
    }
    for (; e < 16; e++)
      (t = dt[At + e]),
        (n += 6 == e ? Ot[(15 & t) | 64] : 8 == e ? Ot[(63 & t) | 128] : Ot[t]),
        1 & e && e > 1 && e < 11 && (n += '-');
    return At++, n;
  }
  var Tt = {},
    xt = {
      get exports() {
        return Tt;
      },
      set exports(t) {
        Tt = t;
      },
    };
  !(function (t) {
    function e(t) {
      if (t)
        return (function (t) {
          for (var n in e.prototype) t[n] = e.prototype[n];
          return t;
        })(t);
    }
    (t.exports = e),
      (e.prototype.on = e.prototype.addEventListener =
        function (t, e) {
          return (
            (this._callbacks = this._callbacks || {}),
            (this._callbacks['$' + t] = this._callbacks['$' + t] || []).push(e),
            this
          );
        }),
      (e.prototype.once = function (t, e) {
        function n() {
          this.off(t, n), e.apply(this, arguments);
        }
        return (n.fn = e), this.on(t, n), this;
      }),
      (e.prototype.off =
        e.prototype.removeListener =
        e.prototype.removeAllListeners =
        e.prototype.removeEventListener =
          function (t, e) {
            if (((this._callbacks = this._callbacks || {}), 0 == arguments.length))
              return (this._callbacks = {}), this;
            var n,
              r = this._callbacks['$' + t];
            if (!r) return this;
            if (1 == arguments.length) return delete this._callbacks['$' + t], this;
            for (var i = 0; i < r.length; i++)
              if ((n = r[i]) === e || n.fn === e) {
                r.splice(i, 1);
                break;
              }
            return 0 === r.length && delete this._callbacks['$' + t], this;
          }),
      (e.prototype.emit = function (t) {
        this._callbacks = this._callbacks || {};
        for (
          var e = new Array(arguments.length - 1), n = this._callbacks['$' + t], r = 1;
          r < arguments.length;
          r++
        )
          e[r - 1] = arguments[r];
        if (n) {
          r = 0;
          for (var i = (n = n.slice(0)).length; r < i; ++r) n[r].apply(this, e);
        }
        return this;
      }),
      (e.prototype.listeners = function (t) {
        return (this._callbacks = this._callbacks || {}), this._callbacks['$' + t] || [];
      }),
      (e.prototype.hasListeners = function (t) {
        return !!this.listeners(t).length;
      });
  })(xt);
  var Lt = Tt,
    Pt = {
      setTimeout: function (t, e) {
        return window.setTimeout(t, e);
      },
      clearTimeout: function (t) {
        return window.clearTimeout(t);
      },
      Date: window.Date,
    },
    jt = Pt,
    Nt = { ASAP: 1, RESCHEDULE: 2, ABANDON: 3 };
  function Ct() {
    (this.tasks = {}), (this.nextId = 1);
  }
  (Ct.prototype.now = function () {
    return +new jt.Date();
  }),
    (Ct.prototype.run = function (t, e, n) {
      var r = this.nextId++;
      return (this.tasks[r] = jt.setTimeout(this._handle(r, t, e, n || Nt.ASAP), e)), r;
    }),
    (Ct.prototype.cancel = function (t) {
      this.tasks[t] && (jt.clearTimeout(this.tasks[t]), delete this.tasks[t]);
    }),
    (Ct.prototype.cancelAll = function () {
      this.tasks.forEach(jt.clearTimeout), (this.tasks = {});
    }),
    (Ct.prototype._handle = function (t, e, n, r) {
      var i = this,
        o = i.now();
      return function () {
        if ((delete i.tasks[t], !(r >= Nt.RESCHEDULE && o + 2 * n < i.now()))) return e();
        r === Nt.RESCHEDULE && i.run(e, n, r);
      };
    }),
    (Ct.setClock = function (t) {
      jt = t;
    }),
    (Ct.resetClock = function () {
      jt = Pt;
    }),
    (Ct.Modes = Nt);
  var Ut = {
    _data: {},
    length: 0,
    setItem: function (t, e) {
      return (this._data[t] = e), (this.length = Object.keys(this._data).length), e;
    },
    getItem: function (t) {
      return t in this._data ? this._data[t] : null;
    },
    removeItem: function (t) {
      return (
        t in this._data && delete this._data[t],
        (this.length = Object.keys(this._data).length),
        null
      );
    },
    clear: function () {
      (this._data = {}), (this.length = 0);
    },
    key: function (t) {
      return Object.keys(this._data)[t];
    },
  };
  var Dt = (function () {
      try {
        if (!window.localStorage) return !1;
        var t = Rt();
        window.localStorage.setItem(t, 'test_value');
        var e = window.localStorage.getItem(t);
        return window.localStorage.removeItem(t), 'test_value' === e;
      } catch (z) {
        return !1;
      }
    })()
      ? window.localStorage
      : Ut,
    Mt = Ut,
    Gt = JSON;
  function Jt(t, e, n, r) {
    (this.id = e),
      (this.name = t),
      (this.keys = n || {}),
      (this.engine = r || Dt),
      (this.originalEngine = this.engine);
  }
  function Ft(t, e) {
    return function () {
      return t.apply(e, arguments);
    };
  }
  function Qt(t, e, n) {
    'function' == typeof e && (n = e),
      (this.name = t),
      (this.id = Rt()),
      (this.fn = n),
      (this.maxItems = e.maxItems || 1 / 0),
      (this.maxAttempts = e.maxAttempts || 1 / 0),
      (this.backoff = {
        MIN_RETRY_DELAY: e.minRetryDelay || 1e3,
        MAX_RETRY_DELAY: e.maxRetryDelay || 3e4,
        FACTOR: e.backoffFactor || 2,
        JITTER: e.backoffJitter || 0,
      }),
      (this.timeouts = {
        ACK_TIMER: 1e3,
        RECLAIM_TIMER: 3e3,
        RECLAIM_TIMEOUT: 1e4,
        RECLAIM_WAIT: 500,
      }),
      (this.keys = {
        IN_PROGRESS: 'inProgress',
        QUEUE: 'queue',
        RECLAIM_START: 'reclaimStart',
        RECLAIM_END: 'reclaimEnd',
        ACK: 'ack',
      }),
      (this._schedule = new Ct()),
      (this._processId = 0),
      (this._store = new Jt(this.name, this.id, this.keys)),
      this._store.set(this.keys.IN_PROGRESS, {}),
      this._store.set(this.keys.QUEUE, []),
      (this._ack = Ft(this._ack, this)),
      (this._checkReclaim = Ft(this._checkReclaim, this)),
      (this._processHead = Ft(this._processHead, this)),
      (this._running = !1);
  }
  (Jt.prototype.set = function (t, e) {
    var n = this._createValidKey(t);
    if (n)
      try {
        this.engine.setItem(n, Gt.stringify(e));
      } catch (r) {
        (function (t) {
          var e = !1;
          if (t.code)
            switch (t.code) {
              case 22:
                e = !0;
                break;
              case 1014:
                'NS_ERROR_DOM_QUOTA_REACHED' === t.name && (e = !0);
            }
          else -2147024882 === t.number && (e = !0);
          return e;
        })(r) && (this._swapEngine(), this.set(t, e));
      }
  }),
    (Jt.prototype.get = function (t) {
      try {
        var e = this.engine.getItem(this._createValidKey(t));
        return null === e ? null : Gt.parse(e);
      } catch (n) {
        return null;
      }
    }),
    (Jt.prototype.getOriginalEngine = function () {
      return this.originalEngine;
    }),
    (Jt.prototype.remove = function (t) {
      this.engine.removeItem(this._createValidKey(t));
    }),
    (Jt.prototype._createValidKey = function (t) {
      var e,
        n = this.name,
        r = this.id;
      return Object.keys(this.keys).length
        ? (this.keys.forEach(function (i) {
            i === t && (e = [n, r, t].join('.'));
          }),
          e)
        : [n, r, t].join('.');
    }),
    (Jt.prototype._swapEngine = function () {
      var t = this;
      this.keys.forEach(function (e) {
        var n = t.get(e);
        Mt.setItem([t.name, t.id, e].join('.'), n), t.remove(e);
      }),
        (this.engine = Mt);
    }),
    Lt(Qt.prototype),
    (Qt.prototype.start = function () {
      this._running && this.stop(),
        (this._running = !0),
        this._ack(),
        this._checkReclaim(),
        this._processHead();
    }),
    (Qt.prototype.stop = function () {
      this._schedule.cancelAll(), (this._running = !1);
    }),
    (Qt.prototype.shouldRetry = function (t, e) {
      return !(e > this.maxAttempts);
    }),
    (Qt.prototype.getDelay = function (t) {
      var e = this.backoff.MIN_RETRY_DELAY * Math.pow(this.backoff.FACTOR, t);
      if (this.backoff.JITTER) {
        var n = Math.random(),
          r = Math.floor(n * this.backoff.JITTER * e);
        Math.floor(10 * n) < 5 ? (e -= r) : (e += r);
      }
      return Number(Math.min(e, this.backoff.MAX_RETRY_DELAY).toPrecision(1));
    }),
    (Qt.prototype.addItem = function (t) {
      this._enqueue({ item: t, attemptNumber: 0, time: this._schedule.now(), id: Rt() });
    }),
    (Qt.prototype.requeue = function (t, e, n, r) {
      this.shouldRetry(t, e, n)
        ? this._enqueue({
            item: t,
            attemptNumber: e,
            time: this._schedule.now() + this.getDelay(e),
            id: r || Rt(),
          })
        : this.emit('discard', t, e);
    }),
    (Qt.prototype._enqueue = function (t) {
      var e = this._store.get(this.keys.QUEUE) || [];
      (e = e.slice(-(this.maxItems - 1))).push(t),
        (e = e.sort(function (t, e) {
          return t.time - e.time;
        })),
        this._store.set(this.keys.QUEUE, e),
        this._running && this._processHead();
    }),
    (Qt.prototype._processHead = function () {
      var t = this,
        e = this._store;
      this._schedule.cancel(this._processId);
      var n = e.get(this.keys.QUEUE) || [],
        r = e.get(this.keys.IN_PROGRESS) || {},
        i = this._schedule.now(),
        o = [];
      function s(n, r) {
        o.push({
          item: n.item,
          done: function (i, o) {
            var s = e.get(t.keys.IN_PROGRESS) || {};
            delete s[r],
              e.set(t.keys.IN_PROGRESS, s),
              t.emit('processed', i, o, n.item),
              i && t.requeue(n.item, n.attemptNumber + 1, i, n.id);
          },
        });
      }
      for (var a = Object.keys(r).length; n.length && n[0].time <= i && a++ < t.maxItems; ) {
        var u = n.shift(),
          c = Rt();
        (r[c] = { item: u.item, attemptNumber: u.attemptNumber, time: t._schedule.now() }), s(u, c);
      }
      e.set(this.keys.QUEUE, n),
        e.set(this.keys.IN_PROGRESS, r),
        o.forEach(function (e) {
          try {
            t.fn(e.item, e.done);
          } catch (n) {
            console.error('Process function threw error: ' + n);
          }
        }),
        (n = e.get(this.keys.QUEUE) || []),
        this._schedule.cancel(this._processId),
        n.length > 0 &&
          (this._processId = this._schedule.run(this._processHead, n[0].time - i, Ct.Modes.ASAP));
    }),
    (Qt.prototype._ack = function () {
      this._store.set(this.keys.ACK, this._schedule.now()),
        this._store.set(this.keys.RECLAIM_START, null),
        this._store.set(this.keys.RECLAIM_END, null),
        this._schedule.run(this._ack, this.timeouts.ACK_TIMER, Ct.Modes.ASAP);
    }),
    (Qt.prototype._checkReclaim = function () {
      var t = this;
      (function (e) {
        for (var n = [], r = t._store.getOriginalEngine(), i = 0; i < r.length; i++) {
          var o = r.key(i).split('.');
          3 === o.length && o[0] === e && 'ack' === o[2] && n.push(new Jt(e, o[1], t.keys));
        }
        return n;
      })(this.name).forEach(function (e) {
        e.id !== t.id &&
          (t._schedule.now() - e.get(t.keys.ACK) < t.timeouts.RECLAIM_TIMEOUT ||
            (function (e) {
              e.set(t.keys.RECLAIM_START, t.id),
                e.set(t.keys.ACK, t._schedule.now()),
                t._schedule.run(
                  function () {
                    e.get(t.keys.RECLAIM_START) === t.id &&
                      (e.set(t.keys.RECLAIM_END, t.id),
                      t._schedule.run(
                        function () {
                          e.get(t.keys.RECLAIM_END) === t.id &&
                            e.get(t.keys.RECLAIM_START) === t.id &&
                            t._reclaim(e.id);
                        },
                        t.timeouts.RECLAIM_WAIT,
                        Ct.Modes.ABANDON,
                      ));
                  },
                  t.timeouts.RECLAIM_WAIT,
                  Ct.Modes.ABANDON,
                );
            })(e));
      }),
        this._schedule.run(this._checkReclaim, this.timeouts.RECLAIM_TIMER, Ct.Modes.RESCHEDULE);
    }),
    (Qt.prototype._reclaim = function (t) {
      var e = this,
        n = new Jt(this.name, t, this.keys),
        r = { queue: this._store.get(this.keys.QUEUE) || [] },
        i = { inProgress: n.get(this.keys.IN_PROGRESS) || {}, queue: n.get(this.keys.QUEUE) || [] },
        o = [],
        s = function (t, n) {
          t.forEach(function (t) {
            var i = t.id || Rt();
            o.indexOf(i) >= 0
              ? e.emit('duplication', t.item, t.attemptNumber)
              : (r.queue.push({
                  item: t.item,
                  attemptNumber: t.attemptNumber + n,
                  time: e._schedule.now(),
                  id: i,
                }),
                o.push(i));
          });
        };
      s(i.queue, 0),
        s(i.inProgress, 1),
        (r.queue = r.queue.sort(function (t, e) {
          return t.time - e.time;
        })),
        this._store.set(this.keys.QUEUE, r.queue),
        n.remove(this.keys.IN_PROGRESS),
        n.remove(this.keys.QUEUE),
        n.remove(this.keys.RECLAIM_START),
        n.remove(this.keys.RECLAIM_END),
        n.remove(this.keys.ACK),
        this._processHead();
    });
  var qt = function (t) {
      return null != t && 'object' === i(t) && !1 === Array.isArray(t);
    },
    Kt = function (t, e, n) {
      if ((qt(n) || (n = { default: n }), !Vt(t))) return void 0 !== n.default ? n.default : t;
      'number' == typeof e && (e = String(e));
      var r = Array.isArray(e),
        i = 'string' == typeof e,
        o = n.separator || '.',
        s = n.joinChar || ('string' == typeof o ? o : '.');
      if (!i && !r) return t;
      if (i && e in t) return Ht(e, t, n) ? t[e] : n.default;
      var a = r
          ? e
          : (function (t, e, n) {
              if ('function' == typeof n.split) return n.split(t);
              return t.split(e);
            })(e, o, n),
        u = a.length,
        c = 0;
      do {
        var l = a[c];
        for ('number' == typeof l && (l = String(l)); l && '\\' === l.slice(-1); )
          l = Bt([l.slice(0, -1), a[++c] || ''], s, n);
        if (l in t) {
          if (!Ht(l, t, n)) return n.default;
          t = t[l];
        } else {
          for (var f = !1, h = c + 1; h < u; )
            if ((f = (l = Bt([l, a[h++]], s, n)) in t)) {
              if (!Ht(l, t, n)) return n.default;
              (t = t[l]), (c = h - 1);
              break;
            }
          if (!f) return n.default;
        }
      } while (++c < u && Vt(t));
      return c === u ? t : n.default;
    };
  function Bt(t, e, n) {
    return 'function' == typeof n.join ? n.join(t) : t[0] + e + t[1];
  }
  function Ht(t, e, n) {
    return 'function' != typeof n.isValid || n.isValid(t, e);
  }
  function Vt(t) {
    return qt(t) || Array.isArray(t) || 'function' == typeof t;
  }
  var $t = 1,
    Yt = 2,
    zt = 3,
    Wt = 4,
    Xt = Wt,
    Zt = Xt,
    te = {
      setLogLevel: function (t) {
        switch (t.toUpperCase()) {
          case 'INFO':
            Zt = $t;
            break;
          case 'DEBUG':
            Zt = Yt;
            break;
          case 'WARN':
            Zt = zt;
            break;
          default:
            Zt = Xt;
        }
      },
      info: function () {
        var t;
        Zt <= $t && (t = console).info.apply(t, arguments);
      },
      debug: function () {
        var t;
        Zt <= Yt && (t = console).log.apply(t, arguments);
      },
      warn: function () {
        var t;
        Zt <= zt && (t = console).warn.apply(t, arguments);
      },
      error: function () {
        var t;
        Zt <= Wt && (t = console).error.apply(t, arguments);
      },
    },
    ee = function (t, e, n) {
      switch (arguments.length) {
        case 3:
        case 2:
          return (function (t, e, n) {
            n = n || {};
            var r = re(t) + '=' + re(e);
            null == e && (n.maxage = -1);
            n.maxage && (n.expires = new Date(+new Date() + n.maxage));
            n.path && (r += '; path=' + n.path);
            n.domain && (r += '; domain=' + n.domain);
            n.expires && (r += '; expires=' + n.expires.toUTCString());
            n.secure && (r += '; secure');
            document.cookie = r;
          })(t, e, n);
        case 1:
          return (function (t) {
            return ne()[t];
          })(t);
        default:
          return ne();
      }
    };
  function ne() {
    var t;
    try {
      t = document.cookie;
    } catch (e) {
      return (
        'undefined' != typeof console &&
          'function' == typeof console.error &&
          console.error(e.stack || e),
        {}
      );
    }
    return (function (t) {
      var e,
        n = {},
        r = t.split(/ *; */);
      if (!r[0]) return n;
      for (var i = 0; i < r.length; ++i) n[ie((e = r[i].split('='))[0])] = ie(e[1]);
      return n;
    })(t);
  }
  function re(t) {
    try {
      return encodeURIComponent(t);
    } catch (z) {
      console.error('error `encode(%o)` - %o', t, z);
    }
  }
  function ie(t) {
    try {
      return decodeURIComponent(t);
    } catch (z) {
      console.error('error `decode(%o)` - %o', t, z);
    }
  }
  function oe(t) {
    switch (t) {
      case 'http:':
        return 80;
      case 'https:':
        return 443;
      default:
        return location.port;
    }
  }
  var se = function (t) {
      var e = (function (t) {
          var e = document.createElement('a');
          return (
            (e.href = t),
            {
              href: e.href,
              host: e.host || location.host,
              port: '0' === e.port || '' === e.port ? oe(e.protocol) : e.port,
              hash: e.hash,
              hostname: e.hostname || location.hostname,
              pathname: '/' != e.pathname.charAt(0) ? '/' + e.pathname : e.pathname,
              protocol: e.protocol && ':' != e.protocol ? e.protocol : location.protocol,
              search: e.search,
              query: e.search.slice(1),
            }
          );
        })(t).hostname,
        n = e.split('.'),
        r = n[n.length - 1],
        i = [];
      if (4 === n.length && r === parseInt(r, 10).toString()) return i;
      if (n.length <= 1) return i;
      for (var o = n.length - 2; o >= 0; --o) i.push(n.slice(o).join('.'));
      return i;
    },
    ae = function (t) {
      for (var e = se(t), n = 0; n < e.length; ++n) {
        var r = '__tld__',
          i = e[n],
          o = { domain: '.' + i };
        if ((ee(r, 1, o), ee(r))) return ee(r, null, o), i;
      }
      return '';
    },
    ue = (function () {
      function t(e) {
        a(this, t),
          (this.cOpts = {}),
          this.options(e),
          (this.isSupportAvailable = this.checkSupportAvailability());
      }
      return (
        c(t, [
          {
            key: 'options',
            value: function () {
              var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              if (0 === arguments.length) return this.cOpts;
              var e = '.'.concat(ae(window.location.href));
              return (
                '.' === e && (e = null),
                (this.cOpts = F({ maxage: 31536e6, path: '/', domain: e, samesite: 'Lax' }, t)),
                this.cOpts
              );
            },
          },
          {
            key: 'set',
            value: function (t, e) {
              try {
                return ee(t, e, N(this.cOpts)), !0;
              } catch (z) {
                return te.error(z), !1;
              }
            },
          },
          {
            key: 'get',
            value: function (t) {
              return ee(t);
            },
          },
          {
            key: 'remove',
            value: function (t) {
              try {
                return ee(t, null, N(this.cOpts)), !0;
              } catch (z) {
                return !1;
              }
            },
          },
          {
            key: 'checkSupportAvailability',
            value: function () {
              var t = 'test_rudder_cookie';
              return this.set(t, !0), !!this.get(t) && (this.remove(t), !0);
            },
          },
        ]),
        t
      );
    })(),
    ce = new ue({}),
    le = {},
    fe = {
      get exports() {
        return le;
      },
      set exports(t) {
        le = t;
      },
    };
  fe.exports = (function () {
    var t = window.localStorage;
    function e(t) {
      return (t = JSON.stringify(t)), !!/^\{[\s\S]*\}$/.test(t);
    }
    function n(t) {
      return void 0 === t || 'function' == typeof t ? t + '' : JSON.stringify(t);
    }
    function r(t) {
      if ('string' == typeof t)
        try {
          return JSON.parse(t);
        } catch (z) {
          return t;
        }
    }
    function i(t) {
      return '[object Function]' === {}.toString.call(t);
    }
    function o(t) {
      return '[object Array]' === Object.prototype.toString.call(t);
    }
    function s(t) {
      var e = '_Is_Incognit',
        n = 'yes';
      try {
        t.setItem(e, n);
      } catch (z) {
        if ('QuotaExceededError' === z.name) {
          var r = function () {};
          t.__proto__ = { setItem: r, getItem: r, removeItem: r, clear: r };
        }
      } finally {
        t.getItem(e) === n && t.removeItem(e);
      }
      return t;
    }
    function a() {
      if (!(this instanceof a)) return new a();
    }
    (t = s(t)),
      (a.prototype = {
        set: function (r, i) {
          if (r && !e(r)) t.setItem(r, n(i));
          else if (e(r)) for (var o in r) this.set(o, r[o]);
          return this;
        },
        get: function (e) {
          if (!e) {
            var n = {};
            return (
              this.forEach(function (t, e) {
                return (n[t] = e);
              }),
              n
            );
          }
          if ('?' === e.charAt(0)) return this.has(e.substr(1));
          var i = arguments;
          if (i.length > 1) {
            for (var o = {}, s = 0, a = i.length; s < a; s++) {
              var u = r(t.getItem(i[s]));
              this.has(i[s]) && (o[i[s]] = u);
            }
            return o;
          }
          return r(t.getItem(e));
        },
        clear: function () {
          return t.clear(), this;
        },
        remove: function (e) {
          var n = this.get(e);
          return t.removeItem(e), n;
        },
        has: function (t) {
          return {}.hasOwnProperty.call(this.get(), t);
        },
        keys: function () {
          var t = [];
          return (
            this.forEach(function (e) {
              t.push(e);
            }),
            t
          );
        },
        forEach: function (e) {
          for (var n = 0, r = t.length; n < r; n++) {
            var i = t.key(n);
            e(i, this.get(i));
          }
          return this;
        },
        search: function (t) {
          for (var e = this.keys(), n = {}, r = 0, i = e.length; r < i; r++)
            e[r].indexOf(t) > -1 && (n[e[r]] = this.get(e[r]));
          return n;
        },
      });
    var u = null;
    function c(t, n) {
      var r = arguments,
        s = null;
      if ((u || (u = a()), 0 === r.length)) return u.get();
      if (1 === r.length) {
        if ('string' == typeof t) return u.get(t);
        if (e(t)) return u.set(t);
      }
      if (2 === r.length && 'string' == typeof t) {
        if (!n) return u.remove(t);
        if (n && 'string' == typeof n) return u.set(t, n);
        n && i(n) && ((s = null), (s = n(t, u.get(t))), c.set(t, s));
      }
      if (2 === r.length && o(t) && i(n))
        for (var l = 0, f = t.length; l < f; l++) (s = n(t[l], u.get(t[l]))), c.set(t[l], s);
      return c;
    }
    for (var l in a.prototype) c[l] = a.prototype[l];
    return c;
  })();
  var he = le,
    pe = (function () {
      function t(e) {
        a(this, t),
          (this.sOpts = {}),
          (this.enabled = this.checkSupportAvailability()),
          this.options(e);
      }
      return (
        c(t, [
          {
            key: 'options',
            value: function () {
              var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              return (
                0 === arguments.length ||
                  ((t = F({ enabled: !0 }, t)),
                  (this.enabled = t.enabled && this.enabled),
                  (this.sOpts = t)),
                this.sOpts
              );
            },
          },
          {
            key: 'set',
            value: function (t, e) {
              return he.set(t, e);
            },
          },
          {
            key: 'get',
            value: function (t) {
              return he.get(t);
            },
          },
          {
            key: 'remove',
            value: function (t) {
              return he.remove(t);
            },
          },
          {
            key: 'checkSupportAvailability',
            value: function () {
              var t = 'test_rudder_ls';
              return this.set(t, !0), !!this.get(t) && (this.remove(t), !0);
            },
          },
        ]),
        t
      );
    })(),
    de = new pe({}),
    ve = {
      user_storage_key: 'rl_user_id',
      user_storage_trait: 'rl_trait',
      user_storage_anonymousId: 'rl_anonymous_id',
      group_storage_key: 'rl_group_id',
      group_storage_trait: 'rl_group_trait',
      page_storage_init_referrer: 'rl_page_init_referrer',
      page_storage_init_referring_domain: 'rl_page_init_referring_domain',
      session_info: 'rl_session',
      prefix: 'RudderEncrypt:',
      key: 'Rudder',
    },
    ge = { segment: 'ajs_anonymous_id' };
  function ye(t) {
    try {
      return t ? JSON.parse(t) : null;
    } catch (z) {
      return te.error(z), t || null;
    }
  }
  function me(t) {
    return t.replace(/^\s+|\s+$/gm, '');
  }
  function _e(t) {
    return !t || ('string' == typeof t && '' === me(t))
      ? t
      : t.substring(0, ve.prefix.length) === ve.prefix
      ? t.substring(ve.prefix.length)
      : t;
  }
  var ke = (function () {
      function t() {
        a(this, t),
          ce.isSupportAvailable
            ? (this.storage = ce)
            : (de.enabled && (this.storage = de),
              this.storage ||
                te.error('No storage is available :: initializing the SDK without storage'));
      }
      return (
        c(t, [
          {
            key: 'options',
            value: function () {
              var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              this.storage.options(t);
            },
          },
          {
            key: 'setItem',
            value: function (t, e) {
              this.storage.set(
                t,
                (function (t) {
                  return '' === me(t) ? t : ''.concat(ve.prefix).concat(t);
                })(
                  (function (t) {
                    return JSON.stringify(t);
                  })(e),
                ),
              );
            },
          },
          {
            key: 'setStringItem',
            value: function (t, e) {
              'string' == typeof e
                ? this.setItem(t, e)
                : te.error('[Storage] '.concat(t, ' should be string'));
            },
          },
          {
            key: 'setUserId',
            value: function (t) {
              this.setStringItem(ve.user_storage_key, t);
            },
          },
          {
            key: 'setUserTraits',
            value: function (t) {
              this.setItem(ve.user_storage_trait, t);
            },
          },
          {
            key: 'setGroupId',
            value: function (t) {
              this.setStringItem(ve.group_storage_key, t);
            },
          },
          {
            key: 'setGroupTraits',
            value: function (t) {
              this.setItem(ve.group_storage_trait, t);
            },
          },
          {
            key: 'setAnonymousId',
            value: function (t) {
              this.setStringItem(ve.user_storage_anonymousId, t);
            },
          },
          {
            key: 'setInitialReferrer',
            value: function (t) {
              this.setItem(ve.page_storage_init_referrer, t);
            },
          },
          {
            key: 'setInitialReferringDomain',
            value: function (t) {
              this.setItem(ve.page_storage_init_referring_domain, t);
            },
          },
          {
            key: 'setSessionInfo',
            value: function (t) {
              this.setItem(ve.session_info, t);
            },
          },
          {
            key: 'getItem',
            value: function (t) {
              return ye(_e(this.storage.get(t)));
            },
          },
          {
            key: 'getUserId',
            value: function () {
              return this.getItem(ve.user_storage_key);
            },
          },
          {
            key: 'getUserTraits',
            value: function () {
              return this.getItem(ve.user_storage_trait);
            },
          },
          {
            key: 'getGroupId',
            value: function () {
              return this.getItem(ve.group_storage_key);
            },
          },
          {
            key: 'getGroupTraits',
            value: function () {
              return this.getItem(ve.group_storage_trait);
            },
          },
          {
            key: 'fetchExternalAnonymousId',
            value: function (t) {
              var e,
                n = t.toLowerCase();
              return Object.keys(ge).includes(n) && 'segment' === n
                ? (de.enabled && (e = de.get(ge[n])),
                  !e && ce.isSupportAvailable && (e = ce.get(ge[n])),
                  e)
                : e;
            },
          },
          {
            key: 'getAnonymousId',
            value: function (t) {
              var e = ye(_e(this.storage.get(ve.user_storage_anonymousId)));
              if (e) return e;
              var n = Kt(t, 'autoCapture.source');
              if (!0 === Kt(t, 'autoCapture.enabled') && 'string' == typeof n) {
                var r = this.fetchExternalAnonymousId(n);
                if (r) return r;
              }
              return e;
            },
          },
          {
            key: 'getInitialReferrer',
            value: function () {
              return this.getItem(ve.page_storage_init_referrer);
            },
          },
          {
            key: 'getInitialReferringDomain',
            value: function () {
              return this.getItem(ve.page_storage_init_referring_domain);
            },
          },
          {
            key: 'getSessionInfo',
            value: function () {
              return this.getItem(ve.session_info);
            },
          },
          {
            key: 'removeItem',
            value: function (t) {
              return this.storage.remove(t);
            },
          },
          {
            key: 'removeSessionInfo',
            value: function () {
              this.removeItem(ve.session_info);
            },
          },
          {
            key: 'clear',
            value: function (t) {
              this.storage.remove(ve.user_storage_key),
                this.storage.remove(ve.user_storage_trait),
                this.storage.remove(ve.group_storage_key),
                this.storage.remove(ve.group_storage_trait),
                t && this.storage.remove(ve.user_storage_anonymousId);
            },
          },
        ]),
        t
      );
    })(),
    we = new ke(),
    be = 18e5,
    Ie = 'RS_JS_SDK';
  function Ee(t) {
    window.rsBugsnagClient && window.rsBugsnagClient.notify(t);
  }
  function Se(t, e, n) {
    var r;
    try {
      r = (function (t, e, n) {
        var r;
        try {
          r =
            'string' == typeof t
              ? t
              : t instanceof Error || t.message
              ? t.message
              : JSON.stringify(t);
        } catch (z) {
          r = '';
        }
        if (t instanceof Event) {
          if (t.target && 'script' !== t.target.localName) return '';
          if (
            t.target.dataset &&
            (t.target.dataset.loader !== Ie || 'true' !== t.target.dataset.isNonNativeSDK)
          )
            return '';
          if (
            ((r = 'error in script loading:: src::  '
              .concat(t.target.src, ' id:: ')
              .concat(t.target.id)),
            'ad-block' === t.target.id)
          )
            return (
              n.page(
                'RudderJS-Initiated',
                'ad-block page request',
                { path: '/ad-blocked', title: r },
                n.sendAdblockPageOptions,
              ),
              ''
            );
        }
        return '[handleError]::'.concat(e || '', ' "').concat(r, '"');
      })(t, e, n);
    } catch (o) {
      te.error('[handleError] Exception:: ', o),
        te.error('[handleError] Original error:: ', JSON.stringify(t)),
        Ee(o);
    }
    if (r) {
      te.error(r);
      var i = t;
      t instanceof Error || (i = new Error(r)), Ee(i);
    }
  }
  var Ae = (function () {
      function t() {
        a(this, t),
          (this.storage = we),
          (this.timeout = be),
          (this.sessionInfo = this.storage.getSessionInfo() || { autoTrack: !0 });
      }
      return (
        c(t, [
          {
            key: 'initialize',
            value: function (t) {
              try {
                var e;
                if (
                  ((this.sessionInfo.autoTrack = !(
                    !1 ===
                      (null == t || null === (e = t.sessions) || void 0 === e
                        ? void 0
                        : e.autoTrack) || this.sessionInfo.manualTrack
                  )),
                  null != t && t.sessions && !isNaN(t.sessions.timeout))
                ) {
                  var n = t.sessions.timeout;
                  0 === n &&
                    (te.warn(
                      '[Session]:: Provided timeout value 0 will disable the auto session tracking feature.',
                    ),
                    (this.sessionInfo.autoTrack = !1)),
                    n > 0 &&
                      n < 1e4 &&
                      te.warn(
                        '[Session]:: It is not advised to set "timeout" less than 10 seconds',
                      ),
                    (this.timeout = n);
                }
                this.sessionInfo.autoTrack
                  ? this.startAutoTracking()
                  : !1 !== this.sessionInfo.autoTrack || this.sessionInfo.manualTrack || this.end();
              } catch (z) {
                Se(z);
              }
            },
          },
          {
            key: 'isValidSession',
            value: function (t) {
              return t <= this.sessionInfo.expiresAt;
            },
          },
          {
            key: 'generateSessionId',
            value: function () {
              return Date.now();
            },
          },
          {
            key: 'startAutoTracking',
            value: function () {
              var t = Date.now();
              this.isValidSession(t) ||
                ((this.sessionInfo = {}),
                (this.sessionInfo.id = t),
                (this.sessionInfo.expiresAt = t + this.timeout),
                (this.sessionInfo.sessionStart = !0),
                (this.sessionInfo.autoTrack = !0)),
                this.storage.setSessionInfo(this.sessionInfo);
            },
          },
          {
            key: 'validateSessionId',
            value: function (t) {
              if ('number' == typeof t && t % 1 == 0) {
                var e;
                if (!(((e = t) ? e.toString().length : 0) < 10)) return t;
                te.error(
                  '[Session]:: "sessionId" should at least be "'.concat(10, '" digits long'),
                );
              } else te.error('[Session]:: "sessionId" should only be a positive integer');
            },
          },
          {
            key: 'start',
            value: function (t) {
              var e = t ? this.validateSessionId(t) : this.generateSessionId();
              (this.sessionInfo = {
                id: e || this.generateSessionId(),
                sessionStart: !0,
                manualTrack: !0,
              }),
                this.storage.setSessionInfo(this.sessionInfo);
            },
          },
          {
            key: 'getSessionId',
            value: function () {
              return (this.sessionInfo.autoTrack && this.isValidSession(Date.now())) ||
                this.sessionInfo.manualTrack
                ? this.sessionInfo.id
                : null;
            },
          },
          {
            key: 'end',
            value: function () {
              (this.sessionInfo = {}), this.storage.removeSessionInfo();
            },
          },
          {
            key: 'getSessionInfo',
            value: function () {
              var t = {};
              if (this.sessionInfo.autoTrack || this.sessionInfo.manualTrack) {
                if (this.sessionInfo.autoTrack) {
                  var e = Date.now();
                  this.isValidSession(e)
                    ? (this.sessionInfo.expiresAt = e + this.timeout)
                    : this.startAutoTracking();
                }
                this.sessionInfo.sessionStart &&
                  ((t.sessionStart = !0), (this.sessionInfo.sessionStart = !1)),
                  (t.sessionId = this.sessionInfo.id),
                  this.storage.setSessionInfo(this.sessionInfo);
              }
              return t;
            },
          },
          {
            key: 'reset',
            value: function () {
              var t = this.sessionInfo,
                e = t.manualTrack;
              t.autoTrack ? ((this.sessionInfo = {}), this.startAutoTracking()) : e && this.start();
            },
          },
        ]),
        t
      );
    })(),
    Oe = new Ae(),
    Re = (function () {
      function t() {
        a(this, t),
          (this.status = 'starting'),
          (this.newData = []),
          (this.messageId = A()),
          (this.userSession = Oe),
          It('state', bt),
          (this.httpClient = new St()),
          st(function () {
            console.log('remote state in constructor: ', bt.remoteState.value),
              console.log('local state in constructor: ', bt.globalLocalState.value);
          }),
          this.startStorage(),
          this.load();
      }
      var e;
      return (
        c(t, [
          {
            key: 'load',
            value: function () {
              Et(), console.log('exposed state', window.RudderStackGlobals.state), this.ready();
            },
          },
          {
            key: 'ready',
            value: function () {
              var t = this;
              (this.status = 'ready'),
                console.log(this),
                (bt.globalLocalState.value = { counter: 1 }),
                st(function () {
                  console.log('remote state in ready: ', bt.remoteState.value),
                    console.log('local state in ready: ', bt.globalLocalState.value);
                }),
                w.invoke('init.pre', { data: {} }, bt),
                w.invoke('init.post', bt),
                w.invoke('ready.post'),
                setTimeout(function () {
                  t.loadIntegration(), t.page();
                }, 5e3);
            },
          },
          {
            key: 'page',
            value: function () {
              this.dummyPlugins(['initial data']),
                N({}),
                G(
                  function (t) {
                    return t;
                  },
                  {},
                  {},
                ),
                console.log(this.newData),
                this.dummyFetch();
            },
          },
          {
            key: 'dummyPlugins',
            value: function (t) {
              var e = this;
              (this.newData = w.invoke('local.test', t)),
                w.invoke('localMutate.test', this.newData),
                w.invoke('remote.test', this.newData, function (t) {
                  e.newData = t;
                });
            },
          },
          {
            key: 'dummyFetch',
            value:
              ((e = s(
                r().mark(function t() {
                  return r().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            this.httpClient.get('http://www.google.com');
                          case 1:
                          case 'end':
                            return t.stop();
                        }
                    },
                    t,
                    this,
                  );
                }),
              )),
              function () {
                return e.apply(this, arguments);
              }),
          },
          {
            key: 'dummyQueue',
            value: function () {
              (this.payloadQueue = new Qt('rudder', {}, function (t, e) {})),
                this.payloadQueue.start();
            },
          },
          {
            key: 'startStorage',
            value: function () {
              this.uSession = Oe;
            },
          },
          {
            key: 'pluginRegister',
            value: function (t) {
              !(function (t) {
                null == t ||
                  t.forEach(function (t) {
                    w.register(t);
                  });
              })(t);
            },
          },
          {
            key: 'loadIntegration',
            value: function () {
              w.invoke(
                'remote.load_integrations',
                [
                  {
                    name: 'GA',
                    config: {
                      trackingID: 'UA-179234741-1',
                      doubleClick: !1,
                      enhancedLinkAttribution: !1,
                      includeSearch: !1,
                      trackCategorizedPages: !0,
                      trackNamedPages: !0,
                      useRichEventNames: !1,
                      sampleRate: '100',
                      siteSpeedSampleRate: '1',
                      resetCustomDimensionsOnPage: [{ resetCustomDimensionsOnPage: '' }],
                      setAllMappedProps: !0,
                      anonymizeIp: !1,
                      domain: 'auto',
                      enhancedEcommerce: !1,
                      nonInteraction: !1,
                      optimize: '',
                      sendUserId: !1,
                      useGoogleAmpClientId: !1,
                      namedTracker: !1,
                      blacklistedEvents: [{ eventName: '' }],
                      whitelistedEvents: [{ eventName: '' }],
                      oneTrustCookieCategories: [{ oneTrustCookieCategory: '' }],
                      eventFilteringOption: 'disable',
                    },
                  },
                ],
                bt,
              ),
                st(function () {
                  console.log(
                    'successfullyLoadedIntegration',
                    bt.successfullyLoadedIntegration.value,
                  );
                }),
                st(function () {
                  console.log(
                    'dynamicallyLoadedIntegrations',
                    bt.dynamicallyLoadedIntegrations.value,
                  );
                });
            },
          },
        ]),
        t
      );
    })(),
    Te = new Re();
  return (t.AnalyticsV3 = Re), (t.analytics = Te), t;
})({});
//# sourceMappingURL=index.js.map
