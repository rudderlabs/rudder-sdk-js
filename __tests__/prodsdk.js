rudderanalytics = (function (e) {
  function t(e) {
    return (t =
      typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              typeof Symbol === "function" &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function n(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function r(e, t) {
    for (let n = 0; n < t.length; n++) {
      const r = t[n];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(e, r.key, r);
    }
  }
  function i(e, t, n) {
    return t && r(e.prototype, t), n && r(e, n), e;
  }
  function o(e, t, n) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function s(e, t) {
    const n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      let r = Object.getOwnPropertySymbols(e);
      t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function a(e) {
    for (let t = 1; t < arguments.length; t++) {
      var n = arguments[t] != null ? arguments[t] : {};
      t % 2
        ? s(n, !0).forEach(function (t) {
            o(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : s(n).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
          });
    }
    return e;
  }
  function c(e) {
    return (
      (function (e) {
        if (Array.isArray(e)) {
          for (var t = 0, n = new Array(e.length); t < e.length; t++)
            n[t] = e[t];
          return n;
        }
      })(e) ||
      (function (e) {
        if (
          Symbol.iterator in Object(e) ||
          Object.prototype.toString.call(e) === "[object Arguments]"
        )
          return Array.from(e);
      })(e) ||
      (function () {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
      })()
    );
  }
  const u =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
      ? global
      : typeof self !== "undefined"
      ? self
      : {};
  function l(e, t) {
    return e((t = { exports: {} }), t.exports), t.exports;
  }
  const d = l(function (e) {
    function t(e) {
      if (e)
        return (function (e) {
          for (const n in t.prototype) e[n] = t.prototype[n];
          return e;
        })(e);
    }
    (e.exports = t),
      (t.prototype.on = t.prototype.addEventListener = function (e, t) {
        return (
          (this._callbacks = this._callbacks || {}),
          (this._callbacks[`$${e}`] = this._callbacks[`$${e}`] || []).push(t),
          this
        );
      }),
      (t.prototype.once = function (e, t) {
        function n() {
          this.off(e, n), t.apply(this, arguments);
        }
        return (n.fn = t), this.on(e, n), this;
      }),
      (t.prototype.off = t.prototype.removeListener = t.prototype.removeAllListeners = t.prototype.removeEventListener = function (
        e,
        t
      ) {
        if (((this._callbacks = this._callbacks || {}), arguments.length == 0))
          return (this._callbacks = {}), this;
        let n;
        const r = this._callbacks[`$${e}`];
        if (!r) return this;
        if (arguments.length == 1) return delete this._callbacks[`$${e}`], this;
        for (let i = 0; i < r.length; i++)
          if ((n = r[i]) === t || n.fn === t) {
            r.splice(i, 1);
            break;
          }
        return r.length === 0 && delete this._callbacks[`$${e}`], this;
      }),
      (t.prototype.emit = function (e) {
        this._callbacks = this._callbacks || {};
        for (
          var t = new Array(arguments.length - 1),
            n = this._callbacks[`$${e}`],
            r = 1;
          r < arguments.length;
          r++
        )
          t[r - 1] = arguments[r];
        if (n) {
          r = 0;
          for (let i = (n = n.slice(0)).length; r < i; ++r) n[r].apply(this, t);
        }
        return this;
      }),
      (t.prototype.listeners = function (e) {
        return (
          (this._callbacks = this._callbacks || {}),
          this._callbacks[`$${e}`] || []
        );
      }),
      (t.prototype.hasListeners = function (e) {
        return !!this.listeners(e).length;
      });
  });
  const p = function (e, t, n) {
    let r = !1;
    return (n = n || h), (i.count = e), e === 0 ? t() : i;
    function i(e, o) {
      if (i.count <= 0) throw new Error("after called too many times");
      --i.count,
        e ? ((r = !0), t(e), (t = n)) : i.count !== 0 || r || t(null, o);
    }
  };
  function h() {}
  let f = 4;
  const g = {
    setLogLevel(e) {
      switch (e.toUpperCase()) {
        case "INFO":
          return void (f = 1);
        case "DEBUG":
          return void (f = 2);
        case "WARN":
          return void (f = 3);
      }
    },
    info() {
      let e;
      f <= 1 && (e = console).info.apply(e, arguments);
    },
    debug() {
      let e;
      f <= 2 && (e = console).debug.apply(e, arguments);
    },
    warn() {
      let e;
      f <= 3 && (e = console).warn.apply(e, arguments);
    },
    error() {
      let e;
      f <= 4 && (e = console).error.apply(e, arguments);
    },
  };
  const m = {
    All: "All",
    "Google Analytics": "GA",
    GoogleAnalytics: "GA",
    GA: "GA",
    "Google Ads": "GOOGLEADS",
    GoogleAds: "GOOGLEADS",
    GOOGLEADS: "GOOGLEADS",
    Braze: "BRAZE",
    BRAZE: "BRAZE",
    Chartbeat: "CHARTBEAT",
    CHARTBEAT: "CHARTBEAT",
    Comscore: "COMSCORE",
    COMSCORE: "COMSCORE",
    Customerio: "CUSTOMERIO",
    "Customer.io": "CUSTOMERIO",
    "FB Pixel": "FACEBOOK_PIXEL",
    "Facebook Pixel": "FACEBOOK_PIXEL",
    FB_PIXEL: "FACEBOOK_PIXEL",
    "Google Tag Manager": "GOOGLETAGMANAGER",
    GTM: "GTM",
    Hotjar: "HOTJAR",
    hotjar: "HOTJAR",
    HOTJAR: "HOTJAR",
    Hubspot: "HS",
    HUBSPOT: "HS",
    Intercom: "INTERCOM",
    INTERCOM: "INTERCOM",
    Keen: "KEEN",
    "Keen.io": "KEEN",
    KEEN: "KEEN",
    Kissmetrics: "KISSMETRICS",
    KISSMETRICS: "KISSMETRICS",
    Lotame: "LOTAME",
    LOTAME: "LOTAME",
    "Visual Website Optimizer": "VWO",
    VWO: "VWO",
  };
  const y = {
    All: "All",
    GA: "Google Analytics",
    GOOGLEADS: "Google Ads",
    BRAZE: "Braze",
    CHARTBEAT: "Chartbeat",
    COMSCORE: "Comscore",
    CUSTOMERIO: "Customer IO",
    FACEBOOK_PIXEL: "Facebook Pixel",
    GTM: "Google Tag Manager",
    HOTJAR: "Hotjar",
    HS: "HubSpot",
    INTERCOM: "Intercom",
    KEEN: "Keen",
    KISSMETRICS: "Kiss Metrics",
    LOTAME: "Lotame",
    VWO: "VWO",
  };
  function v(e, t) {
    return t == null ? void 0 : t;
  }
  function b() {
    let e = new Date().getTime();
    return (
      typeof performance !== "undefined" &&
        typeof performance.now === "function" &&
        (e += performance.now()),
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (t) {
        const n = (e + 16 * Math.random()) % 16 | 0;
        return (
          (e = Math.floor(e / 16)), (t === "x" ? n : (3 & n) | 8).toString(16)
        );
      })
    );
  }
  function w() {
    return new Date().toISOString();
  }
  function k(e, t) {
    let n = e.message ? e.message : void 0;
    let r = void 0;
    try {
      e instanceof Event &&
        e.target &&
        e.target.localName == "script" &&
        ((n = `error in script loading:: src::  ${e.target.src} id:: ${e.target.id}`),
        t &&
          e.target.src.includes("adsbygoogle") &&
          ((r = !0),
          t.page(
            "RudderJS-Initiated",
            "ad-block page request",
            { path: "/ad-blocked", title: n },
            t.sendAdblockPageOptions
          ))),
        n && !r && g.error("[Util] handleError:: ", n);
    } catch (e) {
      g.error("[Util] handleError:: ", e);
    }
  }
  function E() {
    const e = I();
    const t = e ? e.pathname : window.location.pathname;
    const n = document.referrer;
    const r = window.location.search;
    return {
      path: t,
      referrer: n,
      search: r,
      title: document.title,
      url: (function (e) {
        const t = I();
        const n = t ? (t.indexOf("?") > -1 ? t : t + e) : window.location.href;
        const r = n.indexOf("#");
        return r > -1 ? n.slice(0, r) : n;
      })(r),
    };
  }
  function I() {
    for (
      var e, t = document.getElementsByTagName("link"), n = 0;
      (e = t[n]);
      n++
    )
      if (e.getAttribute("rel") === "canonical") return e.getAttribute("href");
  }
  function _(e, t) {
    let n = e.revenue;
    return (
      !n &&
        t &&
        t.match(
          /^[ _]?completed[ _]?order[ _]?|^[ _]?order[ _]?completed[ _]?$/i
        ) &&
        (n = e.total),
      (function (e) {
        if (e) {
          if (typeof e === "number") return e;
          if (typeof e === "string")
            return (
              (e = e.replace(/\$/g, "")),
              (e = parseFloat(e)),
              isNaN(e) ? void 0 : e
            );
        }
      })(n)
    );
  }
  function A(e) {
    Object.keys(e).forEach(function (t) {
      e.hasOwnProperty(t) &&
        (m[t] && (e[m[t]] = e[t]),
        t != "All" && m[t] != null && m[t] != t && delete e[t]);
    });
  }
  function C(e, n) {
    const r = [];
    if (!n || n.length == 0) return r;
    let i = !0;
    return typeof n[0] === "string"
      ? (e.All != null && (i = e.All),
        n.forEach(function (t) {
          if (i) {
            let n = !0;
            e[t] != null && e[t] == 0 && (n = !1), n && r.push(t);
          } else e[t] != null && e[t] == 1 && r.push(t);
        }),
        r)
      : t(n[0]) == "object"
      ? (e.All != null && (i = e.All),
        n.forEach(function (t) {
          if (i) {
            let n = !0;
            e[t.name] != null && e[t.name] == 0 && (n = !1), n && r.push(t);
          } else e[t.name] != null && e[t.name] == 1 && r.push(t);
        }),
        r)
      : void 0;
  }
  function T(e, n) {
    return (
      (n = n || S),
      (function (e) {
        switch (toString.call(e)) {
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
        return e === null
          ? "null"
          : void 0 === e
          ? "undefined"
          : e === Object(e)
          ? "object"
          : t(e);
      })(e) == "array"
        ? O(e, n)
        : P(e, n)
    );
  }
  var O = function (e, t) {
    for (var n = [], r = 0; r < e.length; ++r)
      t(e[r], r) || (n[n.length] = e[r]);
    return n;
  };
  var P = function (e, t) {
    const n = {};
    for (const r in e) e.hasOwnProperty(r) && !t(e[r], r) && (n[r] = e[r]);
    return n;
  };
  function S(e) {
    return e == null;
  }
  const x = { TRACK: "track", PAGE: "page", IDENTIFY: "identify" };
  const R = {
    PRODUCTS_SEARCHED: "Products Searched",
    PRODUCT_LIST_VIEWED: "Product List Viewed",
    PRODUCT_LIST_FILTERED: "Product List Filtered",
    PROMOTION_VIEWED: "Promotion Viewed",
    PROMOTION_CLICKED: "Promotion Clicked",
    PRODUCT_CLICKED: "Product Clicked",
    PRODUCT_VIEWED: "Product Viewed",
    PRODUCT_ADDED: "Product Added",
    PRODUCT_REMOVED: "Product Removed",
    CART_VIEWED: "Cart Viewed",
    CHECKOUT_STARTED: "Checkout Started",
    CHECKOUT_STEP_VIEWED: "Checkout Step Viewed",
    CHECKOUT_STEP_COMPLETED: "Checkout Step Completed",
    PAYMENT_INFO_ENTERED: "Payment Info Entered",
    ORDER_UPDATED: "Order Updated",
    ORDER_COMPLETED: "Order Completed",
    ORDER_REFUNDED: "Order Refunded",
    ORDER_CANCELLED: "Order Cancelled",
    COUPON_ENTERED: "Coupon Entered",
    COUPON_APPLIED: "Coupon Applied",
    COUPON_DENIED: "Coupon Denied",
    COUPON_REMOVED: "Coupon Removed",
    PRODUCT_ADDED_TO_WISHLIST: "Product Added to Wishlist",
    PRODUCT_REMOVED_FROM_WISHLIST: "Product Removed from Wishlist",
    WISH_LIST_PRODUCT_ADDED_TO_CART: "Wishlist Product Added to Cart",
    PRODUCT_SHARED: "Product Shared",
    CART_SHARED: "Cart Shared",
    PRODUCT_REVIEWED: "Product Reviewed",
  };
  const j = "https://hosted.rudderlabs.com";
  function L(e, t) {
    g.debug(`in script loader=== ${e}`);
    const n = document.createElement("script");
    (n.src = t), (n.async = !0), (n.type = "text/javascript"), (n.id = e);
    const r = document.getElementsByTagName("script")[0];
    g.debug("==script==", r), r.parentNode.insertBefore(n, r);
  }
  let D;
  let M;
  const U = (function () {
    function e(t) {
      n(this, e), (this.hubId = t.hubID), (this.name = "HS");
    }
    return (
      i(e, [
        {
          key: "init",
          value() {
            L(
              "hubspot-integration",
              `http://js.hs-scripts.com/${this.hubId}.js`
            ),
              g.debug("===in init HS===");
          },
        },
        {
          key: "identify",
          value(e) {
            g.debug("in HubspotAnalyticsManager identify");
            const n = e.message.context.traits;
            const r = {};
            for (const i in n)
              if (Object.getOwnPropertyDescriptor(n, i) && n[i]) {
                const o = i;
                toString.call(n[i]) == "[object Date]"
                  ? (r[o] = n[i].getTime())
                  : (r[o] = n[i]);
              }
            const s = e.message.context.user_properties;
            for (const a in s) {
              if (Object.getOwnPropertyDescriptor(s, a) && s[a]) r[a] = s[a];
            }
            (g.debug(r),
            void 0 !==
              (typeof window === "undefined" ? "undefined" : t(window))) &&
              (window._hsq = window._hsq || []).push(["identify", r]);
          },
        },
        {
          key: "track",
          value(e) {
            g.debug("in HubspotAnalyticsManager track");
            const t = (window._hsq = window._hsq || []);
            const n = {};
            (n.id = e.message.event),
              e.message.properties &&
                (e.message.properties.revenue || e.message.properties.value) &&
                (n.value =
                  e.message.properties.revenue || e.message.properties.value),
              t.push(["trackEvent", n]);
          },
        },
        {
          key: "page",
          value(e) {
            g.debug("in HubspotAnalyticsManager page");
            const t = (window._hsq = window._hsq || []);
            e.message.properties &&
              e.message.properties.path &&
              t.push(["setPath", e.message.properties.path]),
              t.push(["trackPageView"]);
          },
        },
        {
          key: "isLoaded",
          value() {
            return (
              g.debug("in hubspot isLoaded"),
              !(!window._hsq || window._hsq.push === Array.prototype.push)
            );
          },
        },
        {
          key: "isReady",
          value() {
            return !(!window._hsq || window._hsq.push === Array.prototype.push);
          },
        },
      ]),
      e
    );
  })();
  const N = Object.prototype;
  const q = N.hasOwnProperty;
  const B = N.toString;
  typeof Symbol === "function" && (D = Symbol.prototype.valueOf),
    typeof BigInt === "function" && (M = BigInt.prototype.valueOf);
  const F = function (e) {
    return e != e;
  };
  const G = { boolean: 1, number: 1, string: 1, undefined: 1 };
  const K = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
  const V = /^[A-Fa-f0-9]+$/;
  const H = {};
  (H.a = H.type = function (e, t) {
    return typeof e === t;
  }),
    (H.defined = function (e) {
      return void 0 !== e;
    }),
    (H.empty = function (e) {
      let t;
      const n = B.call(e);
      if (
        n === "[object Array]" ||
        n === "[object Arguments]" ||
        n === "[object String]"
      )
        return e.length === 0;
      if (n === "[object Object]") {
        for (t in e) if (q.call(e, t)) return !1;
        return !0;
      }
      return !e;
    }),
    (H.equal = function (e, t) {
      if (e === t) return !0;
      let n;
      const r = B.call(e);
      if (r !== B.call(t)) return !1;
      if (r === "[object Object]") {
        for (n in e) if (!(H.equal(e[n], t[n]) && n in t)) return !1;
        for (n in t) if (!(H.equal(e[n], t[n]) && n in e)) return !1;
        return !0;
      }
      if (r === "[object Array]") {
        if ((n = e.length) !== t.length) return !1;
        for (; n--; ) if (!H.equal(e[n], t[n])) return !1;
        return !0;
      }
      return r === "[object Function]"
        ? e.prototype === t.prototype
        : r === "[object Date]" && e.getTime() === t.getTime();
    }),
    (H.hosted = function (e, t) {
      const n = typeof t[e];
      return n === "object" ? !!t[e] : !G[n];
    }),
    (H.instance = H.instanceof = function (e, t) {
      return e instanceof t;
    }),
    (H.nil = H.null = function (e) {
      return e === null;
    }),
    (H.undef = H.undefined = function (e) {
      return void 0 === e;
    }),
    (H.args = H.arguments = function (e) {
      const t = B.call(e) === "[object Arguments]";
      const n = !H.array(e) && H.arraylike(e) && H.object(e) && H.fn(e.callee);
      return t || n;
    }),
    (H.array =
      Array.isArray ||
      function (e) {
        return B.call(e) === "[object Array]";
      }),
    (H.args.empty = function (e) {
      return H.args(e) && e.length === 0;
    }),
    (H.array.empty = function (e) {
      return H.array(e) && e.length === 0;
    }),
    (H.arraylike = function (e) {
      return (
        !!e &&
        !H.bool(e) &&
        q.call(e, "length") &&
        isFinite(e.length) &&
        H.number(e.length) &&
        e.length >= 0
      );
    }),
    (H.bool = H.boolean = function (e) {
      return B.call(e) === "[object Boolean]";
    }),
    (H.false = function (e) {
      return H.bool(e) && !1 === Boolean(Number(e));
    }),
    (H.true = function (e) {
      return H.bool(e) && !0 === Boolean(Number(e));
    }),
    (H.date = function (e) {
      return B.call(e) === "[object Date]";
    }),
    (H.date.valid = function (e) {
      return H.date(e) && !isNaN(Number(e));
    }),
    (H.element = function (e) {
      return (
        void 0 !== e &&
        typeof HTMLElement !== "undefined" &&
        e instanceof HTMLElement &&
        e.nodeType === 1
      );
    }),
    (H.error = function (e) {
      return B.call(e) === "[object Error]";
    }),
    (H.fn = H.function = function (e) {
      if (typeof window !== "undefined" && e === window.alert) return !0;
      const t = B.call(e);
      return (
        t === "[object Function]" ||
        t === "[object GeneratorFunction]" ||
        t === "[object AsyncFunction]"
      );
    }),
    (H.number = function (e) {
      return B.call(e) === "[object Number]";
    }),
    (H.infinite = function (e) {
      return e === 1 / 0 || e === -1 / 0;
    }),
    (H.decimal = function (e) {
      return H.number(e) && !F(e) && !H.infinite(e) && e % 1 != 0;
    }),
    (H.divisibleBy = function (e, t) {
      const n = H.infinite(e);
      const r = H.infinite(t);
      const i = H.number(e) && !F(e) && H.number(t) && !F(t) && t !== 0;
      return n || r || (i && e % t == 0);
    }),
    (H.integer = H.int = function (e) {
      return H.number(e) && !F(e) && e % 1 == 0;
    }),
    (H.maximum = function (e, t) {
      if (F(e)) throw new TypeError("NaN is not a valid value");
      if (!H.arraylike(t))
        throw new TypeError("second argument must be array-like");
      for (let n = t.length; --n >= 0; ) if (e < t[n]) return !1;
      return !0;
    }),
    (H.minimum = function (e, t) {
      if (F(e)) throw new TypeError("NaN is not a valid value");
      if (!H.arraylike(t))
        throw new TypeError("second argument must be array-like");
      for (let n = t.length; --n >= 0; ) if (e > t[n]) return !1;
      return !0;
    }),
    (H.nan = function (e) {
      return !H.number(e) || e != e;
    }),
    (H.even = function (e) {
      return H.infinite(e) || (H.number(e) && e == e && e % 2 == 0);
    }),
    (H.odd = function (e) {
      return H.infinite(e) || (H.number(e) && e == e && e % 2 != 0);
    }),
    (H.ge = function (e, t) {
      if (F(e) || F(t)) throw new TypeError("NaN is not a valid value");
      return !H.infinite(e) && !H.infinite(t) && e >= t;
    }),
    (H.gt = function (e, t) {
      if (F(e) || F(t)) throw new TypeError("NaN is not a valid value");
      return !H.infinite(e) && !H.infinite(t) && e > t;
    }),
    (H.le = function (e, t) {
      if (F(e) || F(t)) throw new TypeError("NaN is not a valid value");
      return !H.infinite(e) && !H.infinite(t) && e <= t;
    }),
    (H.lt = function (e, t) {
      if (F(e) || F(t)) throw new TypeError("NaN is not a valid value");
      return !H.infinite(e) && !H.infinite(t) && e < t;
    }),
    (H.within = function (e, t, n) {
      if (F(e) || F(t) || F(n)) throw new TypeError("NaN is not a valid value");
      if (!H.number(e) || !H.number(t) || !H.number(n))
        throw new TypeError("all arguments must be numbers");
      return (
        H.infinite(e) || H.infinite(t) || H.infinite(n) || (e >= t && e <= n)
      );
    }),
    (H.object = function (e) {
      return B.call(e) === "[object Object]";
    }),
    (H.primitive = function (e) {
      return (
        !e || !(typeof e === "object" || H.object(e) || H.fn(e) || H.array(e))
      );
    }),
    (H.hash = function (e) {
      return (
        H.object(e) && e.constructor === Object && !e.nodeType && !e.setInterval
      );
    }),
    (H.regexp = function (e) {
      return B.call(e) === "[object RegExp]";
    }),
    (H.string = function (e) {
      return B.call(e) === "[object String]";
    }),
    (H.base64 = function (e) {
      return H.string(e) && (!e.length || K.test(e));
    }),
    (H.hex = function (e) {
      return H.string(e) && (!e.length || V.test(e));
    }),
    (H.symbol = function (e) {
      return (
        typeof Symbol === "function" &&
        B.call(e) === "[object Symbol]" &&
        typeof D.call(e) === "symbol"
      );
    }),
    (H.bigint = function (e) {
      return (
        typeof BigInt === "function" &&
        B.call(e) === "[object BigInt]" &&
        typeof M.call(e) === "bigint"
      );
    });
  let z;
  const J = H;
  const W = Object.prototype.toString;
  const $ = function (e) {
    switch (W.call(e)) {
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
      case "[object String]":
        return "string";
    }
    return e === null
      ? "null"
      : void 0 === e
      ? "undefined"
      : e && e.nodeType === 1
      ? "element"
      : e === Object(e)
      ? "object"
      : typeof e;
  };
  const Y = /\b(Array|Date|Object|Math|JSON)\b/g;
  const Q = function (e, t) {
    const n = (function (e) {
      for (var t = [], n = 0; n < e.length; n++)
        ~t.indexOf(e[n]) || t.push(e[n]);
      return t;
    })(
      (function (e) {
        return (
          e
            .replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, "")
            .replace(Y, "")
            .match(/[a-zA-Z_]\w*/g) || []
        );
      })(e)
    );
    return (
      t &&
        typeof t === "string" &&
        (t = (function (e) {
          return function (t) {
            return e + t;
          };
        })(t)),
      t
        ? (function (e, t, n) {
            return e.replace(
              /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g,
              function (e) {
                return e[e.length - 1] == "(" ? n(e) : ~t.indexOf(e) ? n(e) : e;
              }
            );
          })(e, n, t)
        : n
    );
  };
  try {
    z = Q;
  } catch (e) {
    z = Q;
  }
  const Z = X;
  function X(e) {
    switch ({}.toString.call(e)) {
      case "[object Object]":
        return (function (e) {
          const t = {};
          for (const n in e)
            t[n] = typeof e[n] === "string" ? ee(e[n]) : X(e[n]);
          return function (e) {
            if (typeof e !== "object") return !1;
            for (const n in t) {
              if (!(n in e)) return !1;
              if (!t[n](e[n])) return !1;
            }
            return !0;
          };
        })(e);
      case "[object Function]":
        return e;
      case "[object String]":
        return /^ *\W+/.test((n = e))
          ? new Function("_", `return _ ${n}`)
          : new Function(
              "_",
              `return ${(function (e) {
                let t;
                let n;
                let r;
                const i = z(e);
                if (!i.length) return `_.${e}`;
                for (n = 0; n < i.length; n++)
                  (r = i[n]),
                    (e = te(
                      r,
                      e,
                      (t = `('function' == typeof ${(t = `_.${r}`)} ? ${t}() : ${t})`)
                    ));
                return e;
              })(n)}`
            );
      case "[object RegExp]":
        return (
          (t = e),
          function (e) {
            return t.test(e);
          }
        );
      default:
        return ee(e);
    }
    let t;
    let n;
  }
  function ee(e) {
    return function (t) {
      return e === t;
    };
  }
  function te(e, t, n) {
    return t.replace(new RegExp(`(\\.)?${e}`, "g"), function (e, t) {
      return t ? e : n;
    });
  }
  try {
    var ne = $;
  } catch (e) {
    ne = $;
  }
  const re = Object.prototype.hasOwnProperty;
  const ie = function (e, t, n) {
    switch (((t = Z(t)), (n = n || this), ne(e))) {
      case "array":
        return oe(e, t, n);
      case "object":
        return typeof e.length === "number"
          ? oe(e, t, n)
          : (function (e, t, n) {
              for (const r in e) re.call(e, r) && t.call(n, r, e[r]);
            })(e, t, n);
      case "string":
        return (function (e, t, n) {
          for (let r = 0; r < e.length; ++r) t.call(n, e.charAt(r), r);
        })(e, t, n);
    }
  };
  function oe(e, t, n) {
    for (let r = 0; r < e.length; ++r) t.call(n, e[r], r);
  }
  const se = Math.max;
  const ae = function (e, t) {
    const n = t ? t.length : 0;
    if (!n) return [];
    for (
      var r = se(Number(e) || 0, 0), i = se(n - r, 0), o = new Array(i), s = 0;
      s < i;
      s += 1
    )
      o[s] = t[s + r];
    return o;
  };
  const ce = Math.max;
  const ue = function (e) {
    if (e == null || !e.length) return [];
    for (var t = new Array(ce(e.length - 2, 0)), n = 1; n < e.length; n += 1)
      t[n - 1] = e[n];
    return t;
  };
  const le = Object.prototype.hasOwnProperty;
  const de = Object.prototype.toString;
  const pe = function (e) {
    return Boolean(e) && typeof e === "object";
  };
  const he = function (e) {
    return Boolean(e) && de.call(e) === "[object Object]";
  };
  const fe = function (e, t, n, r) {
    return le.call(t, r) && void 0 === e[r] && (e[r] = n), t;
  };
  const ge = function (e, t, n, r) {
    return (
      le.call(t, r) &&
        (he(e[r]) && he(n)
          ? (e[r] = ye(e[r], n))
          : void 0 === e[r] && (e[r] = n)),
      t
    );
  };
  const me = function (e, t) {
    if (!pe(t)) return t;
    e = e || fe;
    for (let n = ae(2, arguments), r = 0; r < n.length; r += 1)
      for (const i in n[r]) e(t, n[r], n[r][i], i);
    return t;
  };
  var ye = function (e) {
    return me.apply(null, [ge, e].concat(ue(arguments)));
  };
  const ve = function (e) {
    return me.apply(null, [null, e].concat(ue(arguments)));
  };
  const be = ye;
  ve.deep = be;
  const we = (function () {
    function e(t) {
      n(this, e),
        (this.trackingID = t.trackingID),
        (this.sendUserId = t.sendUserId || !1),
        (this.dimensions = t.dimensions || []),
        (this.metrics = t.metrics || []),
        (this.contentGroupings = t.contentGroupings || []),
        (this.nonInteraction = t.nonInteraction || !1),
        (this.anonymizeIp = t.anonymizeIp || !1),
        (this.useGoogleAmpClientId = t.useGoogleAmpClientId || !1),
        (this.domain = t.domain || "auto"),
        (this.doubleClick = t.doubleClick || !1),
        (this.enhancedEcommerce = t.enhancedEcommerce || !1),
        (this.enhancedLinkAttribution = t.enhancedLinkAttribution || !1),
        (this.includeSearch = t.includeSearch || !1),
        (this.setAllMappedProps = t.setAllMappedProps || !0),
        (this.siteSpeedSampleRate = t.siteSpeedSampleRate || 1),
        (this.sampleRate = t.sampleRate || 100),
        (this.trackCategorizedPages = t.trackCategorizedPages || !0),
        (this.trackNamedPages = t.trackNamedPages || !0),
        (this.optimizeContainerId = t.optimize || ""),
        (this.resetCustomDimensionsOnPage =
          t.resetCustomDimensionsOnPage || []),
        (this.inputs = t),
        (this.enhancedEcommerceLoaded = 0),
        (this.name = "GA"),
        (this.eventWithCategoryFieldProductScoped = [
          "product clicked",
          "product added",
          "product viewed",
          "product removed",
        ]);
    }
    return (
      i(e, [
        {
          key: "loadScript",
          value() {
            L(
              "google-analytics",
              "https://www.google-analytics.com/analytics.js"
            );
          },
        },
        {
          key: "init",
          value() {
            (this.pageCalled = !1), (this.dimensionsArray = {});
            let e = !0;
            let t = !1;
            let n = void 0;
            try {
              for (
                var r, i = this.dimensions[Symbol.iterator]();
                !(e = (r = i.next()).done);
                e = !0
              ) {
                const o = r.value;
                this.dimensionsArray[o.from] = o.to;
              }
            } catch (e) {
              (t = !0), (n = e);
            } finally {
              try {
                e || i.return == null || i.return();
              } finally {
                if (t) throw n;
              }
            }
            this.metricsArray = {};
            let s = !0;
            let a = !1;
            let c = void 0;
            try {
              for (
                var u, l = this.metrics[Symbol.iterator]();
                !(s = (u = l.next()).done);
                s = !0
              ) {
                const d = u.value;
                this.metricsArray[d.from] = d.to;
              }
            } catch (e) {
              (a = !0), (c = e);
            } finally {
              try {
                s || l.return == null || l.return();
              } finally {
                if (a) throw c;
              }
            }
            this.contentGroupingsArray = {};
            let p = !0;
            let h = !1;
            let f = void 0;
            try {
              for (
                var m, y = this.contentGroupings[Symbol.iterator]();
                !(p = (m = y.next()).done);
                p = !0
              ) {
                const v = m.value;
                this.contentGroupingsArray[v.from] = v.to;
              }
            } catch (e) {
              (h = !0), (f = e);
            } finally {
              try {
                p || y.return == null || y.return();
              } finally {
                if (h) throw f;
              }
            }
            (window.GoogleAnalyticsObject = "ga"),
              (window.ga =
                window.ga ||
                function () {
                  (window.ga.q = window.ga.q || []),
                    window.ga.q.push(arguments);
                }),
              (window.ga.l = new Date().getTime());
            const b = {
              cookieDomain: this.domain,
              siteSpeedSampleRate: this.siteSpeedSampleRate,
              sampleRate: this.sampleRate,
              allowLinker: !0,
              useAmpClientId: this.useGoogleAmpClientId,
            };
            window.ga("create", this.trackingID, b),
              this.optimizeContainerId &&
                window.ga("require", this.optimizeContainerId),
              this.ecommerce ||
                (window.ga("require", "ecommerce"), (this.ecommerce = !0)),
              this.doubleClick && window.ga("require", "displayfeatures"),
              this.enhancedLinkAttribution && window.ga("require", "linkid"),
              this.anonymizeIp && window.ga("set", "anonymizeIp", !0),
              g.debug("===in init GA===");
          },
        },
        {
          key: "identify",
          value(e) {
            this.sendUserId &&
              e.message.userId &&
              window.ga("set", "userId", e.message.userId);
            const t = this.metricsFunction(
              e.message.context.traits,
              this.dimensionsArray,
              this.metricsArray,
              this.contentGroupingsArray
            );
            console.log(Object.keys(t).length),
              Object.keys(t).length && window.ga("set", t),
              g.debug("in GoogleAnalyticsManager identify");
          },
        },
        {
          key: "track",
          value(e, t) {
            const n = this;
            const r = e.message.event;
            if (r !== "Order Completed" || this.enhancedEcommerce)
              if (this.enhancedEcommerce)
                switch (r) {
                  case "Checkout Started":
                  case "Checkout Step Viewed":
                  case "Order Updated":
                    (E = (b = e.message.properties).products),
                      (t = this.extractCheckoutOptions(e));
                    (this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
                      e,
                      this.enhancedEcommerceLoaded
                    )),
                      ie(E, function (t) {
                        let r = n.createProductTrack(e, t);
                        (r = { message: r }),
                          n.enhancedEcommerceTrackProduct(r, n.inputs);
                      }),
                      window.ga("ec:setAction", "checkout", {
                        step: b.step || 1,
                        option: t || void 0,
                      }),
                      this.pushEnhancedEcommerce(e, this.inputs);
                    break;
                  case "Checkout Step Completed":
                    var i = e.message.properties;
                    t = this.extractCheckoutOptions(e);
                    if (!i.step) return;
                    var o = { step: i.step || 1, option: t || void 0 };
                    (this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
                      e,
                      this.enhancedEcommerceLoaded
                    )),
                      window.ga("ec:setAction", "checkout_option", o),
                      window.ga("send", "event", "Checkout", "Option");
                    break;
                  case "Order Completed":
                    (w =
                      e.message.properties.total ||
                      e.message.properties.revenue ||
                      0),
                      (k = e.message.properties.orderId),
                      (E = e.message.properties.products),
                      (i = e.message.properties);
                    if (!k) return;
                    (this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
                      e,
                      this.enhancedEcommerceLoaded
                    )),
                      ie(E, function (t) {
                        let r = n.createProductTrack(e, t);
                        (r = { message: r }),
                          n.enhancedEcommerceTrackProduct(r, n.inputs);
                      }),
                      window.ga("ec:setAction", "purchase", {
                        id: k,
                        affiliation: i.affiliation,
                        revenue: w,
                        tax: i.tax,
                        shipping: i.shipping,
                        coupon: i.coupon,
                      }),
                      this.pushEnhancedEcommerce(e, this.inputs);
                    break;
                  case "Order Refunded":
                    (k = (i = e.message.properties).orderId), (E = i.products);
                    if (!k) return;
                    (this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
                      e,
                      this.enhancedEcommerceLoaded
                    )),
                      ie(E, function (e) {
                        const t = { properties: e };
                        window.ga("ec:addProduct", {
                          id:
                            t.properties.product_id ||
                            t.properties.id ||
                            t.properties.sku,
                          quantity: t.properties.quantity,
                        });
                      }),
                      window.ga("ec:setAction", "refund", { id: k }),
                      this.pushEnhancedEcommerce(e, this.inputs);
                    break;
                  case "Product Added":
                    (this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
                      e,
                      this.enhancedEcommerceLoaded
                    )),
                      this.enhancedEcommerceTrackProductAction(
                        e,
                        "add",
                        null,
                        this.inputs
                      ),
                      this.pushEnhancedEcommerce(e, this.inputs);
                    break;
                  case "Product Removed":
                    (this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
                      e,
                      this.enhancedEcommerceLoaded
                    )),
                      this.enhancedEcommerceTrackProductAction(
                        e,
                        "remove",
                        null,
                        this.inputs
                      ),
                      this.pushEnhancedEcommerce(e, this.inputs);
                    break;
                  case "Product Viewed":
                    i = e.message.properties;
                    var s = {};
                    (this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
                      e,
                      this.enhancedEcommerceLoaded
                    )),
                      i.list && (s.list = i.list),
                      this.enhancedEcommerceTrackProductAction(
                        e,
                        "detail",
                        s,
                        this.inputs
                      ),
                      this.pushEnhancedEcommerce(e, this.inputs);
                    break;
                  case "Product Clicked":
                    (i = e.message.properties), (s = {});
                    (this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
                      e,
                      this.enhancedEcommerceLoaded
                    )),
                      i.list && (s.list = i.list),
                      this.enhancedEcommerceTrackProductAction(
                        e,
                        "click",
                        s,
                        this.inputs
                      ),
                      this.pushEnhancedEcommerce(e, this.inputs);
                    break;
                  case "Promotion Viewed":
                    i = e.message.properties;
                    (this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
                      e,
                      this.enhancedEcommerceLoaded
                    )),
                      window.ga("ec:addPromo", {
                        id: i.promotionId || i.id,
                        name: i.name,
                        creative: i.creative,
                        position: i.position,
                      }),
                      this.pushEnhancedEcommerce(e, this.inputs);
                    break;
                  case "Promotion Clicked":
                    i = e.message.properties;
                    (this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
                      e,
                      this.enhancedEcommerceLoaded
                    )),
                      window.ga("ec:addPromo", {
                        id: i.promotionId || i.id,
                        name: i.name,
                        creative: i.creative,
                        position: i.position,
                      }),
                      window.ga("ec:setAction", "promo_click", {}),
                      this.pushEnhancedEcommerce(e, this.inputs);
                    break;
                  case "Product List Viewed":
                    E = (i = e.message.properties).products;
                    (this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
                      e,
                      this.enhancedEcommerceLoaded
                    )),
                      ie(E, function (e) {
                        const t = { properties: e };
                        if (
                          t.properties.product_id ||
                          t.properties.sku ||
                          t.properties.name
                        ) {
                          let r = {
                            id: t.properties.productId || t.properties.sku,
                            name: t.properties.name,
                            category: t.properties.category || i.category,
                            list: i.list_id || i.category || "products",
                            brand: t.properties.band,
                            variant: t.properties.variant,
                            price: t.properties.price,
                            position: n.getProductPosition(t, E),
                          };
                          for (const o in (r = a(
                            { impressionObj: r },
                            n.metricsFunction(
                              t.properties,
                              n.dimensionsArray,
                              n.metricsArray,
                              n.contentGroupingsArray
                            )
                          )))
                            void 0 === r[o] && delete r[o];
                          window.ga("ec:addImpression", r);
                        }
                      }),
                      this.pushEnhancedEcommerce(e, this.inputs);
                    break;
                  case "Product List Filtered":
                    E = (i = e.message.properties).products;
                    (i.filters = i.filters || []),
                      (i.sorters = i.sorters || []);
                    var c = i.filters
                      .map(function (e) {
                        return "".concat(e.type, ":").concat(e.value);
                      })
                      .join();
                    var u = i.sorters
                      .map(function (e) {
                        return "".concat(e.type, ":").concat(e.value);
                      })
                      .join();
                    (this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
                      e,
                      this.enhancedEcommerceLoaded
                    )),
                      ie(E, function (e) {
                        const t = { properties: e };
                        if (
                          t.properties.product_id ||
                          t.properties.sku ||
                          t.properties.name
                        ) {
                          let r = {
                            id: t.properties.product_id || t.sku,
                            name: t.name,
                            category: t.category || i.category,
                            list: i.list_id || i.category || "search results",
                            brand: i.brand,
                            variant: "".concat(c, "::").concat(u),
                            price: t.price,
                            position: n.getProductPosition(t, E),
                          };
                          for (const o in (r = a(
                            { impressionObj: r },
                            n.metricsFunction(
                              t.properties,
                              n.dimensionsArray,
                              n.metricsArray,
                              n.contentGroupingsArray
                            )
                          )))
                            void 0 === r[o] && delete r[o];
                          window.ga("ec:addImpression", r);
                        }
                      }),
                      this.pushEnhancedEcommerce(e, this.inputs);
                    break;
                  default:
                    var l = this.inputs;
                    y = ve((y = t || {}), l);
                    var d = e.message.properties.category;
                    var p = e.message.event;
                    var h = e.message.properties.label;
                    var f = "";
                    e.message.properties &&
                      (f = e.message.properties.value
                        ? e.message.properties.value
                        : e.message.properties.revenue);
                    var m = {
                      eventCategory: d || "All",
                      eventAction: p,
                      eventLabel: h,
                      eventValue: this.formatValue(f),
                      nonInteraction:
                        void 0 !== e.message.properties.nonInteraction
                          ? !!e.message.properties.nonInteraction
                          : !!y.nonInteraction,
                    };
                    (v = e.message.context.campaign) &&
                      (v.name && (m.campaignName = v.name),
                      v.source && (m.campaignSource = v.source),
                      v.medium && (m.campaignMedium = v.medium),
                      v.content && (m.campaignContent = v.content),
                      v.term && (m.campaignKeyword = v.term)),
                      (m = a(
                        { payload: m },
                        this.setCustomDimenionsAndMetrics(
                          e.message.properties,
                          this.inputs
                        )
                      )),
                      window.ga("send", "event", m),
                      g.debug("in GoogleAnalyticsManager track");
                }
              else {
                l = this.inputs;
                var y = ve(t || {}, void 0);
                y = ve(y, l);
                (d = e.message.properties.category),
                  (p = e.message.event),
                  (h = e.message.properties.label),
                  (f = "");
                e.message.properties &&
                  (f = e.message.properties.value
                    ? e.message.properties.value
                    : e.message.properties.revenue);
                var v;
                m = {
                  eventCategory: d || "All",
                  eventAction: p,
                  eventLabel: h,
                  eventValue: this.formatValue(f),
                  nonInteraction:
                    void 0 !== e.message.properties.nonInteraction
                      ? !!e.message.properties.nonInteraction
                      : !!y.nonInteraction,
                };
                (v = e.message.context.campaign) &&
                  (v.name && (m.campaignName = v.name),
                  v.source && (m.campaignSource = v.source),
                  v.medium && (m.campaignMedium = v.medium),
                  v.content && (m.campaignContent = v.content),
                  v.term && (m.campaignKeyword = v.term)),
                  (m = a(
                    { payload: m },
                    this.setCustomDimenionsAndMetrics(
                      e.message.properties,
                      this.inputs
                    )
                  )),
                  window.ga("send", "event", m),
                  g.debug("in GoogleAnalyticsManager track");
              }
            else {
              var b;
              var w = (b = e.message.properties).total;
              var k = b.orderId;
              var E = b.products;
              if (!k) return;
              window.ga("ecommerce:addTransaction", {
                affiliation: b.affiliation,
                shipping: b.shipping,
                revenue: w,
                tax: b.tax,
                id: k,
                currency: b.currency,
              }),
                ie(E, function (t) {
                  const r = n.createProductTrack(e, t);
                  window.ga("ecommerce:addItem", {
                    category: r.category,
                    quantity: r.quantity,
                    price: r.price,
                    name: r.name,
                    sku: r.sku,
                    id: k,
                    currency: r.currency,
                  });
                }),
                window.ga("ecommerce:send");
            }
          },
        },
        {
          key: "page",
          value(e) {
            g.debug("in GoogleAnalyticsManager page");
            let t;
            const n = e.message.properties.category;
            const r = e.message.properties;
            const i = ""
              .concat(e.message.properties.category, " ")
              .concat(e.message.name);
            const o = e.message.context.campaign | {};
            let s = {};
            const c = this.path(r, this.includeSearch);
            const u = e.message.properties.referrer || "";
            (t =
              e.message.properties.category || e.message.name
                ? e.message.properties.category
                  ? e.message.name
                    ? i
                    : e.message.properties.category
                  : e.message.name
                : r.title),
              (s.page = c),
              (s.title = t),
              (s.location = r.url),
              o &&
                (o.name && (s.campaignName = o.name),
                o.source && (s.campaignSource = o.source),
                o.medium && (s.campaignMedium = o.medium),
                o.content && (s.campaignContent = o.content),
                o.term && (s.campaignKeyword = o.term));
            for (
              var l = {}, d = 0;
              d < this.resetCustomDimensionsOnPage.length;
              d++
            ) {
              const p = this.resetCustomDimensionsOnPage[d];
              this.dimensionsArray[p] && (l[this.dimensionsArray[p]] = null);
            }
            window.ga("set", l),
              (s = a(
                { pageview: s },
                this.setCustomDimenionsAndMetrics(r, this.inputs)
              ));
            const h = { page: c, title: t };
            u !== document.referrer && (h.referrer = u),
              window.ga("set", h),
              this.pageCalled && delete s.location,
              window.ga("send", "pageview", s),
              n &&
                this.trackCategorizedPages &&
                this.track(e, { nonInteraction: 1 }),
              i && this.trackNamedPages && this.track(e, { nonInteraction: 1 }),
              (this.pageCalled = !0);
          },
        },
        {
          key: "isLoaded",
          value() {
            return g.debug("in GA isLoaded"), !!window.gaplugins;
          },
        },
        {
          key: "isReady",
          value() {
            return !!window.gaplugins;
          },
        },
        {
          key: "metricsFunction",
          value(e, t, n, r) {
            const i = {};
            return (
              ie([n, t, r], function (t) {
                ie(t, function (t, n) {
                  let r = e[t];
                  J.boolean(r) && (r = r.toString()),
                    (r || r === 0) && (i[n] = r);
                });
              }),
              i
            );
          },
        },
        {
          key: "formatValue",
          value(e) {
            return !e || e < 0 ? 0 : Math.round(e);
          },
        },
        {
          key: "setCustomDimenionsAndMetrics",
          value(e, t) {
            const n = {};
            const r = {};
            let i = !0;
            let o = !1;
            let s = void 0;
            try {
              for (
                var a, c = t.dimensions[Symbol.iterator]();
                !(i = (a = c.next()).done);
                i = !0
              ) {
                const u = a.value;
                r[u.from] = u.to;
              }
            } catch (e) {
              (o = !0), (s = e);
            } finally {
              try {
                i || c.return == null || c.return();
              } finally {
                if (o) throw s;
              }
            }
            const l = {};
            let d = !0;
            let p = !1;
            let h = void 0;
            try {
              for (
                var f, g = t.metrics[Symbol.iterator]();
                !(d = (f = g.next()).done);
                d = !0
              ) {
                const m = f.value;
                l[m.from] = m.to;
              }
            } catch (e) {
              (p = !0), (h = e);
            } finally {
              try {
                d || g.return == null || g.return();
              } finally {
                if (p) throw h;
              }
            }
            const y = {};
            let v = !0;
            let b = !1;
            let w = void 0;
            try {
              for (
                var k, E = t.contentGroupings[Symbol.iterator]();
                !(v = (k = E.next()).done);
                v = !0
              ) {
                const I = k.value;
                y[I.from] = I.to;
              }
            } catch (e) {
              (b = !0), (w = e);
            } finally {
              try {
                v || E.return == null || E.return();
              } finally {
                if (b) throw w;
              }
            }
            const _ = this.metricsFunction(e, r, l, y);
            if (Object.keys(_).length) {
              if (!t.setAllMappedProps)
                return (
                  ie(_, function (e, t) {
                    n[e] = t;
                  }),
                  n
                );
              window.ga("set", _);
            }
          },
        },
        {
          key: "path",
          value(e, t) {
            if (e) {
              let n = e.path;
              return t && e.search && (n += e.search), n;
            }
          },
        },
        {
          key: "createProductTrack",
          value(e, t) {
            const n = t || {};
            return (
              (n.currency = t.currency || e.message.properties.currency),
              { properties: n }
            );
          },
        },
        {
          key: "loadEnhancedEcommerce",
          value(e, t) {
            return (
              t === 0 && (window.ga("require", "ec"), (t = 1)),
              window.ga("set", "&cu", e.message.properties.currency),
              t
            );
          },
        },
        {
          key: "enhancedEcommerceTrackProduct",
          value(e, t) {
            const n = {};
            let r = !0;
            let i = !1;
            let o = void 0;
            try {
              for (
                var s, c = t.dimensions[Symbol.iterator]();
                !(r = (s = c.next()).done);
                r = !0
              ) {
                const u = s.value;
                n[u.from] = u.to;
              }
            } catch (e) {
              (i = !0), (o = e);
            } finally {
              try {
                r || c.return == null || c.return();
              } finally {
                if (i) throw o;
              }
            }
            const l = {};
            let d = !0;
            let p = !1;
            let h = void 0;
            try {
              for (
                var f, g = t.metrics[Symbol.iterator]();
                !(d = (f = g.next()).done);
                d = !0
              ) {
                const m = f.value;
                l[m.from] = m.to;
              }
            } catch (e) {
              (p = !0), (h = e);
            } finally {
              try {
                d || g.return == null || g.return();
              } finally {
                if (p) throw h;
              }
            }
            const y = {};
            let v = !0;
            let b = !1;
            let w = void 0;
            try {
              for (
                var k, E = t.contentGroupings[Symbol.iterator]();
                !(v = (k = E.next()).done);
                v = !0
              ) {
                const I = k.value;
                y[I.from] = I.to;
              }
            } catch (e) {
              (b = !0), (w = e);
            } finally {
              try {
                v || E.return == null || E.return();
              } finally {
                if (b) throw w;
              }
            }
            const _ = e.message.properties;
            let A = {
              id: _.productId || _.id || _.sku,
              name: _.name,
              category: _.category,
              quantity: _.quantity,
              price: _.price,
              brand: _.brand,
              variant: _.variant,
              currency: _.currency,
            };
            _.position != null && (A.position = Math.round(_.position));
            const C = _.coupon;
            C && (A.coupon = C),
              (A = a({ product: A }, this.metricsFunction(_, n, l, y))),
              window.ga("ec:addProduct", A);
          },
        },
        {
          key: "enhancedEcommerceTrackProductAction",
          value(e, t, n, r) {
            this.enhancedEcommerceTrackProduct(e, r),
              window.ga("ec:setAction", t, n || {});
          },
        },
        {
          key: "pushEnhancedEcommerce",
          value(e, t) {
            const n = T([
              "send",
              "event",
              e.message.properties.category || "EnhancedEcommerce",
              e.message.event || "Action not defined",
              e.message.properties.label,
              a(
                { nonInteraction: 1 },
                this.setCustomDimenionsAndMetrics(e.message.properties, t)
              ),
            ]);
            let r = e.message.event;
            (r = r.toLowerCase()),
              this.eventWithCategoryFieldProductScoped.includes(r) &&
                (n[2] = "EnhancedEcommerce"),
              ga.apply(window, n);
          },
        },
        {
          key: "getProductPosition",
          value(e, t) {
            const n = e.properties.position;
            return void 0 !== n && !Number.isNaN(Number(n)) && Number(n) > -1
              ? n
              : t
                  .map(function (e) {
                    return e.product_id;
                  })
                  .indexOf(e.properties.product_id) + 1;
          },
        },
        {
          key: "extractCheckoutOptions",
          value(e) {
            const t = T([
              e.message.properties.paymentMethod,
              e.message.properties.shippingMethod,
            ]);
            return t.length > 0 ? t.join(", ") : null;
          },
        },
      ]),
      e
    );
  })();
  const ke = (function () {
    function e(t) {
      n(this, e),
        (this.siteId = t.siteID),
        (this.name = "HOTJAR"),
        (this._ready = !1);
    }
    return (
      i(e, [
        {
          key: "init",
          value() {
            (window.hotjarSiteId = this.siteId),
              (function (e, t, n, r, i, o) {
                (e.hj =
                  e.hj ||
                  function () {
                    (e.hj.q = e.hj.q || []).push(arguments);
                  }),
                  (e._hjSettings = { hjid: e.hotjarSiteId, hjsv: 6 }),
                  (i = t.getElementsByTagName("head")[0]),
                  ((o = t.createElement("script")).async = 1),
                  (o.src = `https://static.hotjar.com/c/hotjar-${e._hjSettings.hjid}.js?sv=${e._hjSettings.hjsv}`),
                  i.appendChild(o);
              })(window, document),
              (this._ready = !0),
              g.debug("===in init Hotjar===");
          },
        },
        {
          key: "identify",
          value(e) {
            if (e.message.userId || e.message.anonymousId) {
              const t = e.message.context.traits;
              window.hj("identify", e.message.userId, t);
            } else g.debug("[Hotjar] identify:: user id is required");
          },
        },
        {
          key: "track",
          value(e) {
            g.debug("[Hotjar] track:: method not supported");
          },
        },
        {
          key: "page",
          value(e) {
            g.debug("[Hotjar] page:: method not supported");
          },
        },
        {
          key: "isLoaded",
          value() {
            return this._ready;
          },
        },
        {
          key: "isReady",
          value() {
            return this._ready;
          },
        },
      ]),
      e
    );
  })();
  const Ee = (function () {
    function e(t) {
      n(this, e),
        (this.conversionId = t.conversionID),
        (this.pageLoadConversions = t.pageLoadConversions),
        (this.clickEventConversions = t.clickEventConversions),
        (this.defaultPageConversion = t.defaultPageConversion),
        (this.name = "GOOGLEADS");
    }
    return (
      i(e, [
        {
          key: "init",
          value() {
            !(function (e, t, n) {
              g.debug(`in script loader=== ${e}`);
              const r = n.createElement("script");
              (r.src = t),
                (r.async = 1),
                (r.type = "text/javascript"),
                (r.id = e);
              const i = n.getElementsByTagName("head")[0];
              g.debug("==script==", i), i.appendChild(r);
            })(
              "googleAds-integration",
              `https://www.googletagmanager.com/gtag/js?id=${this.conversionId}`,
              document
            ),
              (window.dataLayer = window.dataLayer || []),
              (window.gtag = function () {
                window.dataLayer.push(arguments);
              }),
              window.gtag("js", new Date()),
              window.gtag("config", this.conversionId),
              g.debug("===in init Google Ads===");
          },
        },
        {
          key: "identify",
          value(e) {
            g.debug("[GoogleAds] identify:: method not supported");
          },
        },
        {
          key: "track",
          value(e) {
            g.debug("in GoogleAdsAnalyticsManager track");
            const t = this.getConversionData(
              this.clickEventConversions,
              e.message.event
            );
            if (t.conversionLabel) {
              const n = t.conversionLabel;
              const r = t.eventName;
              const i = `${this.conversionId}/${n}`;
              const o = {};
              e.properties &&
                ((o.value = e.properties.revenue),
                (o.currency = e.properties.currency),
                (o.transaction_id = e.properties.order_id)),
                (o.send_to = i),
                window.gtag("event", r, o);
            }
          },
        },
        {
          key: "page",
          value(e) {
            g.debug("in GoogleAdsAnalyticsManager page");
            const t = this.getConversionData(
              this.pageLoadConversions,
              e.message.name
            );
            if (t.conversionLabel) {
              const n = t.conversionLabel;
              const r = t.eventName;
              window.gtag("event", r, {
                send_to: `${this.conversionId}/${n}`,
              });
            }
          },
        },
        {
          key: "getConversionData",
          value(e, t) {
            const n = {};
            return (
              e &&
                (t
                  ? e.forEach(function (e) {
                      if (e.name.toLowerCase() === t.toLowerCase())
                        return (
                          (n.conversionLabel = e.conversionLabel),
                          void (n.eventName = e.name)
                        );
                    })
                  : this.defaultPageConversion &&
                    ((n.conversionLabel = this.defaultPageConversion),
                    (n.eventName = "Viewed a Page"))),
              n
            );
          },
        },
        {
          key: "isLoaded",
          value() {
            return window.dataLayer.push !== Array.prototype.push;
          },
        },
        {
          key: "isReady",
          value() {
            return window.dataLayer.push !== Array.prototype.push;
          },
        },
      ]),
      e
    );
  })();
  const Ie = (function () {
    function e(t, r) {
      n(this, e),
        (this.accountId = t.accountId),
        (this.settingsTolerance = t.settingsTolerance),
        (this.isSPA = t.isSPA),
        (this.libraryTolerance = t.libraryTolerance),
        (this.useExistingJquery = t.useExistingJquery),
        (this.sendExperimentTrack = t.sendExperimentTrack),
        (this.sendExperimentIdentify = t.sendExperimentIdentify),
        (this.name = "VWO"),
        (this.analytics = r),
        g.debug("Config ", t);
    }
    return (
      i(e, [
        {
          key: "init",
          value() {
            g.debug("===in init VWO===");
            const e = this.accountId;
            const t = this.settingsTolerance;
            const n = this.libraryTolerance;
            const r = this.useExistingJquery;
            const i = this.isSPA;
            (window._vwo_code = (function () {
              let o = !1;
              const s = document;
              return {
                use_existing_jquery() {
                  return r;
                },
                library_tolerance() {
                  return n;
                },
                finish() {
                  if (!o) {
                    o = !0;
                    const e = s.getElementById("_vis_opt_path_hides");
                    e && e.parentNode.removeChild(e);
                  }
                },
                finished() {
                  return o;
                },
                load(e) {
                  const t = s.createElement("script");
                  (t.src = e),
                    (t.type = "text/javascript"),
                    t.innerText,
                    (t.onerror = function () {
                      _vwo_code.finish();
                    }),
                    s.getElementsByTagName("head")[0].appendChild(t);
                },
                init() {
                  const n = setTimeout("_vwo_code.finish()", t);
                  const r = s.createElement("style");
                  const o =
                    "body{opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;}";
                  const a = s.getElementsByTagName("head")[0];
                  return (
                    r.setAttribute("id", "_vis_opt_path_hides"),
                    r.setAttribute("type", "text/css"),
                    r.styleSheet
                      ? (r.styleSheet.cssText = o)
                      : r.appendChild(s.createTextNode(o)),
                    a.appendChild(r),
                    this.load(
                      `//dev.visualwebsiteoptimizer.com/j.php?a=${e}&u=${encodeURIComponent(
                        s.URL
                      )}&r=${Math.random()}&f=${+i}`
                    ),
                    n
                  );
                },
              };
            })()),
              (window._vwo_settings_timer = window._vwo_code.init()),
              (this.sendExperimentTrack || this.experimentViewedIdentify) &&
                this.experimentViewed();
          },
        },
        {
          key: "experimentViewed",
          value() {
            const e = this;
            window.VWO = window.VWO || [];
            const t = this;
            window.VWO.push([
              "onVariationApplied",
              function (n) {
                if (n) {
                  g.debug("Variation Applied");
                  const r = n[1];
                  const i = n[2];
                  if (
                    (g.debug(
                      "experiment id:",
                      r,
                      "Variation Name:",
                      _vwo_exp[r].comb_n[i]
                    ),
                    void 0 !== _vwo_exp[r].comb_n[i] &&
                      ["VISUAL_AB", "VISUAL", "SPLIT_URL", "SURVEY"].indexOf(
                        _vwo_exp[r].type
                      ) > -1)
                  ) {
                    try {
                      t.sendExperimentTrack &&
                        (g.debug("Tracking..."),
                        e.analytics.track("Experiment Viewed", {
                          experimentId: r,
                          variationName: _vwo_exp[r].comb_n[i],
                        }));
                    } catch (e) {
                      g.error("[VWO] experimentViewed:: ", e);
                    }
                    try {
                      t.sendExperimentIdentify &&
                        (g.debug("Identifying..."),
                        e.analytics.identify(
                          o({}, "Experiment: ".concat(r), _vwo_exp[r].comb_n[i])
                        ));
                    } catch (e) {
                      g.error("[VWO] experimentViewed:: ", e);
                    }
                  }
                }
              },
            ]);
          },
        },
        {
          key: "identify",
          value(e) {
            g.debug("method not supported");
          },
        },
        {
          key: "track",
          value(e) {
            if (e.message.event === "Order Completed") {
              const t = e.message.properties
                ? e.message.properties.total || e.message.properties.revenue
                : 0;
              g.debug("Revenue", t),
                (window.VWO = window.VWO || []),
                window.VWO.push(["track.revenueConversion", t]);
            }
          },
        },
        {
          key: "page",
          value(e) {
            g.debug("method not supported");
          },
        },
        {
          key: "isLoaded",
          value() {
            return !!window._vwo_code;
          },
        },
        {
          key: "isReady",
          value() {
            return !!window._vwo_code;
          },
        },
      ]),
      e
    );
  })();
  const _e = (function () {
    function e(t) {
      n(this, e),
        (this.containerID = t.containerID),
        (this.name = "GOOGLETAGMANAGER");
    }
    return (
      i(e, [
        {
          key: "init",
          value() {
            g.debug("===in init GoogleTagManager==="),
              (function (e, t, n, r, i) {
                (e[r] = e[r] || []),
                  e[r].push({
                    "gtm.start": new Date().getTime(),
                    event: "gtm.js",
                  });
                const o = t.getElementsByTagName(n)[0];
                const s = t.createElement(n);
                (s.async = !0),
                  (s.src = `https://www.googletagmanager.com/gtm.js?id=${i}`),
                  o.parentNode.insertBefore(s, o);
              })(window, document, "script", "dataLayer", this.containerID);
          },
        },
        {
          key: "identify",
          value(e) {
            g.debug("[GTM] identify:: method not supported");
          },
        },
        {
          key: "track",
          value(e) {
            g.debug("===in track GoogleTagManager===");
            const t = e.message;
            const n = a(
              {
                event: t.event,
                userId: t.userId,
                anonymousId: t.anonymousId,
              },
              t.properties
            );
            this.sendToGTMDatalayer(n);
          },
        },
        {
          key: "page",
          value(e) {
            g.debug("===in page GoogleTagManager===");
            let t;
            const n = e.message;
            const r = n.name;
            const i = n.properties ? n.properties.category : void 0;
            r && (t = `Viewed ${r} page`),
              i && r && (t = `Viewed ${i} ${r} page`),
              t || (t = "Viewed a Page");
            const o = a(
              { event: t, userId: n.userId, anonymousId: n.anonymousId },
              n.properties
            );
            this.sendToGTMDatalayer(o);
          },
        },
        {
          key: "isLoaded",
          value() {
            return !(
              !window.dataLayer ||
              Array.prototype.push === window.dataLayer.push
            );
          },
        },
        {
          key: "sendToGTMDatalayer",
          value(e) {
            window.dataLayer.push(e);
          },
        },
        {
          key: "isReady",
          value() {
            return !(
              !window.dataLayer ||
              Array.prototype.push === window.dataLayer.push
            );
          },
        },
      ]),
      e
    );
  })();
  const Ae = (function () {
    function e(t, r) {
      if (
        (n(this, e),
        (this.analytics = r),
        (this.appKey = t.appKey),
        t.appKey || (this.appKey = ""),
        (this.endPoint = ""),
        t.dataCenter)
      ) {
        const i = t.dataCenter.trim().split("-");
        i[0].toLowerCase() === "eu"
          ? (this.endPoint = "sdk.fra-01.braze.eu")
          : (this.endPoint = `sdk.iad-${i[1]}.braze.com`);
      }
      (this.name = "BRAZE"), g.debug("Config ", t);
    }
    return (
      i(e, [
        {
          key: "formatGender",
          value(e) {
            if (e && typeof e === "string") {
              return ["woman", "female", "w", "f"].indexOf(e.toLowerCase()) > -1
                ? window.appboy.ab.User.Genders.FEMALE
                : ["man", "male", "m"].indexOf(e.toLowerCase()) > -1
                ? window.appboy.ab.User.Genders.MALE
                : ["other", "o"].indexOf(e.toLowerCase()) > -1
                ? window.appboy.ab.User.Genders.OTHER
                : void 0;
            }
          },
        },
        {
          key: "init",
          value() {
            g.debug("===in init Braze==="),
              (function (e, t, n, r, i) {
                (e.appboy = {}), (e.appboyQueue = []);
                for (
                  let o = "initialize destroy getDeviceId toggleAppboyLogging setLogger openSession changeUser requestImmediateDataFlush requestFeedRefresh subscribeToFeedUpdates requestContentCardsRefresh subscribeToContentCardsUpdates logCardImpressions logCardClick logCardDismissal logFeedDisplayed logContentCardsDisplayed logInAppMessageImpression logInAppMessageClick logInAppMessageButtonClick logInAppMessageHtmlClick subscribeToNewInAppMessages subscribeToInAppMessage removeSubscription removeAllSubscriptions logCustomEvent logPurchase isPushSupported isPushBlocked isPushGranted isPushPermissionGranted registerAppboyPushMessages unregisterAppboyPushMessages trackLocation stopWebTracking resumeWebTracking wipeData ab ab.DeviceProperties ab.User ab.User.Genders ab.User.NotificationSubscriptionTypes ab.User.prototype.getUserId ab.User.prototype.setFirstName ab.User.prototype.setLastName ab.User.prototype.setEmail ab.User.prototype.setGender ab.User.prototype.setDateOfBirth ab.User.prototype.setCountry ab.User.prototype.setHomeCity ab.User.prototype.setLanguage ab.User.prototype.setEmailNotificationSubscriptionType ab.User.prototype.setPushNotificationSubscriptionType ab.User.prototype.setPhoneNumber ab.User.prototype.setAvatarImageUrl ab.User.prototype.setLastKnownLocation ab.User.prototype.setUserAttribute ab.User.prototype.setCustomUserAttribute ab.User.prototype.addToCustomAttributeArray ab.User.prototype.removeFromCustomAttributeArray ab.User.prototype.incrementCustomUserAttribute ab.User.prototype.addAlias ab.User.prototype.setCustomLocationAttribute ab.InAppMessage ab.InAppMessage.SlideFrom ab.InAppMessage.ClickAction ab.InAppMessage.DismissType ab.InAppMessage.OpenTarget ab.InAppMessage.ImageStyle ab.InAppMessage.TextAlignment ab.InAppMessage.Orientation ab.InAppMessage.CropType ab.InAppMessage.prototype.subscribeToClickedEvent ab.InAppMessage.prototype.subscribeToDismissedEvent ab.InAppMessage.prototype.removeSubscription ab.InAppMessage.prototype.removeAllSubscriptions ab.InAppMessage.prototype.closeMessage ab.InAppMessage.Button ab.InAppMessage.Button.prototype.subscribeToClickedEvent ab.InAppMessage.Button.prototype.removeSubscription ab.InAppMessage.Button.prototype.removeAllSubscriptions ab.SlideUpMessage ab.ModalMessage ab.FullScreenMessage ab.HtmlMessage ab.ControlMessage ab.Feed ab.Feed.prototype.getUnreadCardCount ab.ContentCards ab.ContentCards.prototype.getUnviewedCardCount ab.Card ab.Card.prototype.dismissCard ab.ClassicCard ab.CaptionedImage ab.Banner ab.ControlCard ab.WindowUtils display display.automaticallyShowNewInAppMessages display.showInAppMessage display.showFeed display.destroyFeed display.toggleFeed display.showContentCards display.hideContentCards display.toggleContentCards sharedLib".split(
                      " "
                    ),
                    s = 0;
                  s < o.length;
                  s++
                ) {
                  for (
                    var a = o[s], c = e.appboy, u = a.split("."), l = 0;
                    l < u.length - 1;
                    l++
                  )
                    c = c[u[l]];
                  c[u[l]] = new Function(
                    `return function ${a.replace(
                      /\./g,
                      "_"
                    )}(){window.appboyQueue.push(arguments); return true}`
                  )();
                }
                (window.appboy.getUser = function () {
                  return new window.appboy.ab.User();
                }),
                  (window.appboy.getCachedFeed = function () {
                    return new window.appboy.ab.Feed();
                  }),
                  (window.appboy.getCachedContentCards = function () {
                    return new window.appboy.ab.ContentCards();
                  }),
                  ((i = t.createElement(n)).type = "text/javascript"),
                  (i.src =
                    "https://js.appboycdn.com/web-sdk/2.4/appboy.min.js"),
                  (i.async = 1),
                  (r = t.getElementsByTagName(n)[0]).parentNode.insertBefore(
                    i,
                    r
                  );
              })(window, document, "script"),
              window.appboy.initialize(this.appKey, {
                enableLogging: !0,
                baseUrl: this.endPoint,
              }),
              window.appboy.display.automaticallyShowNewInAppMessages();
            const e = this.analytics.userId;
            e && appboy.changeUser(e), window.appboy.openSession();
          },
        },
        {
          key: "handleReservedProperties",
          value(e) {
            return (
              [
                "time",
                "product_id",
                "quantity",
                "event_name",
                "price",
                "currency",
              ].forEach(function (t) {
                delete e[t];
              }),
              e
            );
          },
        },
        {
          key: "identify",
          value(e) {
            const t = e.message.userId;
            const n = e.message.context.traits.address;
            const r = e.message.context.traits.avatar;
            const i = e.message.context.traits.birthday;
            const o = e.message.context.traits.email;
            const s = e.message.context.traits.firstname;
            const a = e.message.context.traits.gender;
            const c = e.message.context.traits.lastname;
            const u = e.message.context.traits.phone;
            const l = JSON.parse(JSON.stringify(e.message.context.traits));
            window.appboy.changeUser(t),
              window.appboy.getUser().setAvatarImageUrl(r),
              o && window.appboy.getUser().setEmail(o),
              s && window.appboy.getUser().setFirstName(s),
              a && window.appboy.getUser().setGender(this.formatGender(a)),
              c && window.appboy.getUser().setLastName(c),
              u && window.appboy.getUser().setPhoneNumber(u),
              n &&
                (window.appboy.getUser().setCountry(n.country),
                window.appboy.getUser().setHomeCity(n.city)),
              i &&
                window.appboy
                  .getUser()
                  .setDateOfBirth(
                    i.getUTCFullYear(),
                    i.getUTCMonth() + 1,
                    i.getUTCDate()
                  );
            [
              "avatar",
              "address",
              "birthday",
              "email",
              "id",
              "firstname",
              "gender",
              "lastname",
              "phone",
              "facebook",
              "twitter",
              "first_name",
              "last_name",
              "dob",
              "external_id",
              "country",
              "home_city",
              "bio",
              "gender",
              "phone",
              "email_subscribe",
              "push_subscribe",
            ].forEach(function (e) {
              delete l[e];
            }),
              Object.keys(l).forEach(function (e) {
                window.appboy.getUser().setCustomUserAttribute(e, l[e]);
              });
          },
        },
        {
          key: "handlePurchase",
          value(e, t) {
            const n = e.products;
            const r = e.currency;
            window.appboy.changeUser(t),
              del(e, "products"),
              del(e, "currency"),
              n.forEach(function (t) {
                const n = t.product_id;
                const i = t.price;
                const o = t.quantity;
                o && i && n && window.appboy.logPurchase(n, i, r, o, e);
              });
          },
        },
        {
          key: "track",
          value(e) {
            const t = e.message.userId;
            const n = e.message.event;
            let r = e.message.properties;
            window.appboy.changeUser(t),
              n.toLowerCase() === "order completed"
                ? this.handlePurchase(r, t)
                : ((r = this.handleReservedProperties(r)),
                  window.appboy.logCustomEvent(n, r));
          },
        },
        {
          key: "page",
          value(e) {
            const t = e.message.userId;
            const n = e.message.name;
            let r = e.message.properties;
            (r = this.handleReservedProperties(r)),
              window.appboy.changeUser(t),
              window.appboy.logCustomEvent(n, r);
          },
        },
        {
          key: "isLoaded",
          value() {
            return window.appboyQueue === null;
          },
        },
        {
          key: "isReady",
          value() {
            return window.appboyQueue === null;
          },
        },
      ]),
      e
    );
  })();
  const Ce = l(function (e) {
    !(function () {
      const t =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var n = {
        rotl(e, t) {
          return (e << t) | (e >>> (32 - t));
        },
        rotr(e, t) {
          return (e << (32 - t)) | (e >>> t);
        },
        endian(e) {
          if (e.constructor == Number)
            return (16711935 & n.rotl(e, 8)) | (4278255360 & n.rotl(e, 24));
          for (let t = 0; t < e.length; t++) e[t] = n.endian(e[t]);
          return e;
        },
        randomBytes(e) {
          for (var t = []; e > 0; e--) t.push(Math.floor(256 * Math.random()));
          return t;
        },
        bytesToWords(e) {
          for (var t = [], n = 0, r = 0; n < e.length; n++, r += 8)
            t[r >>> 5] |= e[n] << (24 - (r % 32));
          return t;
        },
        wordsToBytes(e) {
          for (var t = [], n = 0; n < 32 * e.length; n += 8)
            t.push((e[n >>> 5] >>> (24 - (n % 32))) & 255);
          return t;
        },
        bytesToHex(e) {
          for (var t = [], n = 0; n < e.length; n++)
            t.push((e[n] >>> 4).toString(16)), t.push((15 & e[n]).toString(16));
          return t.join("");
        },
        hexToBytes(e) {
          for (var t = [], n = 0; n < e.length; n += 2)
            t.push(parseInt(e.substr(n, 2), 16));
          return t;
        },
        bytesToBase64(e) {
          for (var n = [], r = 0; r < e.length; r += 3)
            for (
              let i = (e[r] << 16) | (e[r + 1] << 8) | e[r + 2], o = 0;
              o < 4;
              o++
            )
              8 * r + 6 * o <= 8 * e.length
                ? n.push(t.charAt((i >>> (6 * (3 - o))) & 63))
                : n.push("=");
          return n.join("");
        },
        base64ToBytes(e) {
          e = e.replace(/[^A-Z0-9+\/]/gi, "");
          for (var n = [], r = 0, i = 0; r < e.length; i = ++r % 4)
            i != 0 &&
              n.push(
                ((t.indexOf(e.charAt(r - 1)) & (Math.pow(2, -2 * i + 8) - 1)) <<
                  (2 * i)) |
                  (t.indexOf(e.charAt(r)) >>> (6 - 2 * i))
              );
          return n;
        },
      };
      e.exports = n;
    })();
  });
  var Te = {
    utf8: {
      stringToBytes(e) {
        return Te.bin.stringToBytes(unescape(encodeURIComponent(e)));
      },
      bytesToString(e) {
        return decodeURIComponent(escape(Te.bin.bytesToString(e)));
      },
    },
    bin: {
      stringToBytes(e) {
        for (var t = [], n = 0; n < e.length; n++)
          t.push(255 & e.charCodeAt(n));
        return t;
      },
      bytesToString(e) {
        for (var t = [], n = 0; n < e.length; n++)
          t.push(String.fromCharCode(e[n]));
        return t.join("");
      },
    },
  };
  const Oe = Te;
  const Pe = function (e) {
    return (
      e != null &&
      (Se(e) ||
        (function (e) {
          return (
            typeof e.readFloatLE === "function" &&
            typeof e.slice === "function" &&
            Se(e.slice(0, 0))
          );
        })(e) ||
        !!e._isBuffer)
    );
  };
  function Se(e) {
    return (
      !!e.constructor &&
      typeof e.constructor.isBuffer === "function" &&
      e.constructor.isBuffer(e)
    );
  }
  const xe = l(function (e) {
    !(function () {
      const t = Ce;
      const n = Oe.utf8;
      const r = Pe;
      const i = Oe.bin;
      var o = function (e, s) {
        e.constructor == String
          ? (e =
              s && s.encoding === "binary"
                ? i.stringToBytes(e)
                : n.stringToBytes(e))
          : r(e)
          ? (e = Array.prototype.slice.call(e, 0))
          : Array.isArray(e) || (e = e.toString());
        for (
          var a = t.bytesToWords(e),
            c = 8 * e.length,
            u = 1732584193,
            l = -271733879,
            d = -1732584194,
            p = 271733878,
            h = 0;
          h < a.length;
          h++
        )
          a[h] =
            (16711935 & ((a[h] << 8) | (a[h] >>> 24))) |
            (4278255360 & ((a[h] << 24) | (a[h] >>> 8)));
        (a[c >>> 5] |= 128 << c % 32), (a[14 + (((c + 64) >>> 9) << 4)] = c);
        const f = o._ff;
        const g = o._gg;
        const m = o._hh;
        const y = o._ii;
        for (h = 0; h < a.length; h += 16) {
          const v = u;
          const b = l;
          const w = d;
          const k = p;
          (u = f(u, l, d, p, a[h + 0], 7, -680876936)),
            (p = f(p, u, l, d, a[h + 1], 12, -389564586)),
            (d = f(d, p, u, l, a[h + 2], 17, 606105819)),
            (l = f(l, d, p, u, a[h + 3], 22, -1044525330)),
            (u = f(u, l, d, p, a[h + 4], 7, -176418897)),
            (p = f(p, u, l, d, a[h + 5], 12, 1200080426)),
            (d = f(d, p, u, l, a[h + 6], 17, -1473231341)),
            (l = f(l, d, p, u, a[h + 7], 22, -45705983)),
            (u = f(u, l, d, p, a[h + 8], 7, 1770035416)),
            (p = f(p, u, l, d, a[h + 9], 12, -1958414417)),
            (d = f(d, p, u, l, a[h + 10], 17, -42063)),
            (l = f(l, d, p, u, a[h + 11], 22, -1990404162)),
            (u = f(u, l, d, p, a[h + 12], 7, 1804603682)),
            (p = f(p, u, l, d, a[h + 13], 12, -40341101)),
            (d = f(d, p, u, l, a[h + 14], 17, -1502002290)),
            (u = g(
              u,
              (l = f(l, d, p, u, a[h + 15], 22, 1236535329)),
              d,
              p,
              a[h + 1],
              5,
              -165796510
            )),
            (p = g(p, u, l, d, a[h + 6], 9, -1069501632)),
            (d = g(d, p, u, l, a[h + 11], 14, 643717713)),
            (l = g(l, d, p, u, a[h + 0], 20, -373897302)),
            (u = g(u, l, d, p, a[h + 5], 5, -701558691)),
            (p = g(p, u, l, d, a[h + 10], 9, 38016083)),
            (d = g(d, p, u, l, a[h + 15], 14, -660478335)),
            (l = g(l, d, p, u, a[h + 4], 20, -405537848)),
            (u = g(u, l, d, p, a[h + 9], 5, 568446438)),
            (p = g(p, u, l, d, a[h + 14], 9, -1019803690)),
            (d = g(d, p, u, l, a[h + 3], 14, -187363961)),
            (l = g(l, d, p, u, a[h + 8], 20, 1163531501)),
            (u = g(u, l, d, p, a[h + 13], 5, -1444681467)),
            (p = g(p, u, l, d, a[h + 2], 9, -51403784)),
            (d = g(d, p, u, l, a[h + 7], 14, 1735328473)),
            (u = m(
              u,
              (l = g(l, d, p, u, a[h + 12], 20, -1926607734)),
              d,
              p,
              a[h + 5],
              4,
              -378558
            )),
            (p = m(p, u, l, d, a[h + 8], 11, -2022574463)),
            (d = m(d, p, u, l, a[h + 11], 16, 1839030562)),
            (l = m(l, d, p, u, a[h + 14], 23, -35309556)),
            (u = m(u, l, d, p, a[h + 1], 4, -1530992060)),
            (p = m(p, u, l, d, a[h + 4], 11, 1272893353)),
            (d = m(d, p, u, l, a[h + 7], 16, -155497632)),
            (l = m(l, d, p, u, a[h + 10], 23, -1094730640)),
            (u = m(u, l, d, p, a[h + 13], 4, 681279174)),
            (p = m(p, u, l, d, a[h + 0], 11, -358537222)),
            (d = m(d, p, u, l, a[h + 3], 16, -722521979)),
            (l = m(l, d, p, u, a[h + 6], 23, 76029189)),
            (u = m(u, l, d, p, a[h + 9], 4, -640364487)),
            (p = m(p, u, l, d, a[h + 12], 11, -421815835)),
            (d = m(d, p, u, l, a[h + 15], 16, 530742520)),
            (u = y(
              u,
              (l = m(l, d, p, u, a[h + 2], 23, -995338651)),
              d,
              p,
              a[h + 0],
              6,
              -198630844
            )),
            (p = y(p, u, l, d, a[h + 7], 10, 1126891415)),
            (d = y(d, p, u, l, a[h + 14], 15, -1416354905)),
            (l = y(l, d, p, u, a[h + 5], 21, -57434055)),
            (u = y(u, l, d, p, a[h + 12], 6, 1700485571)),
            (p = y(p, u, l, d, a[h + 3], 10, -1894986606)),
            (d = y(d, p, u, l, a[h + 10], 15, -1051523)),
            (l = y(l, d, p, u, a[h + 1], 21, -2054922799)),
            (u = y(u, l, d, p, a[h + 8], 6, 1873313359)),
            (p = y(p, u, l, d, a[h + 15], 10, -30611744)),
            (d = y(d, p, u, l, a[h + 6], 15, -1560198380)),
            (l = y(l, d, p, u, a[h + 13], 21, 1309151649)),
            (u = y(u, l, d, p, a[h + 4], 6, -145523070)),
            (p = y(p, u, l, d, a[h + 11], 10, -1120210379)),
            (d = y(d, p, u, l, a[h + 2], 15, 718787259)),
            (l = y(l, d, p, u, a[h + 9], 21, -343485551)),
            (u = (u + v) >>> 0),
            (l = (l + b) >>> 0),
            (d = (d + w) >>> 0),
            (p = (p + k) >>> 0);
        }
        return t.endian([u, l, d, p]);
      };
      (o._ff = function (e, t, n, r, i, o, s) {
        const a = e + ((t & n) | (~t & r)) + (i >>> 0) + s;
        return ((a << o) | (a >>> (32 - o))) + t;
      }),
        (o._gg = function (e, t, n, r, i, o, s) {
          const a = e + ((t & r) | (n & ~r)) + (i >>> 0) + s;
          return ((a << o) | (a >>> (32 - o))) + t;
        }),
        (o._hh = function (e, t, n, r, i, o, s) {
          const a = e + (t ^ n ^ r) + (i >>> 0) + s;
          return ((a << o) | (a >>> (32 - o))) + t;
        }),
        (o._ii = function (e, t, n, r, i, o, s) {
          const a = e + (n ^ (t | ~r)) + (i >>> 0) + s;
          return ((a << o) | (a >>> (32 - o))) + t;
        }),
        (o._blocksize = 16),
        (o._digestsize = 16),
        (e.exports = function (e, n) {
          if (e == null) throw new Error(`Illegal argument ${e}`);
          const r = t.wordsToBytes(o(e, n));
          return n && n.asBytes
            ? r
            : n && n.asString
            ? i.bytesToString(r)
            : t.bytesToHex(r);
        });
    })();
  });
  const Re = (function () {
    function e(t) {
      n(this, e),
        (this.NAME = "INTERCOM"),
        (this.API_KEY = t.apiKey),
        (this.APP_ID = t.appId),
        (this.MOBILE_APP_ID = t.mobileAppId),
        g.debug("Config ", t);
    }
    return (
      i(e, [
        {
          key: "init",
          value() {
            (window.intercomSettings = { app_id: this.APP_ID }),
              (function () {
                const e = window;
                const t = e.Intercom;
                if (typeof t === "function")
                  t("reattach_activator"), t("update", e.intercomSettings);
                else {
                  const n = document;
                  const r = function e() {
                    e.c(arguments);
                  };
                  (r.q = []),
                    (r.c = function (e) {
                      r.q.push(e);
                    }),
                    (e.Intercom = r);
                  const i = function () {
                    const e = n.createElement("script");
                    (e.type = "text/javascript"),
                      (e.async = !0),
                      (e.src = `https://widget.intercom.io/widget/${window.intercomSettings.app_id}`);
                    const t = n.getElementsByTagName("script")[0];
                    t.parentNode.insertBefore(e, t);
                  };
                  document.readyState === "complete"
                    ? (i(), (window.intercom_code = !0))
                    : e.attachEvent
                    ? (e.attachEvent("onload", i), (window.intercom_code = !0))
                    : (e.addEventListener("load", i, !1),
                      (window.intercom_code = !0));
                }
              })();
          },
        },
        {
          key: "page",
          value() {
            window.Intercom("update");
          },
        },
        {
          key: "identify",
          value(e) {
            const n = {};
            const r = e.message.context;
            if ((r.Intercom ? r.Intercom : null) != null) {
              const i = r.Intercom.user_hash ? r.Intercom.user_hash : null;
              i != null && (n.user_hash = i);
              const o = r.Intercom.hideDefaultLauncher
                ? r.Intercom.hideDefaultLauncher
                : null;
              o != null && (n.hide_default_launcher = o);
            }
            Object.keys(r.traits).forEach(function (e) {
              if (r.traits.hasOwnProperty(e)) {
                const i = r.traits[e];
                if (e === "company") {
                  const o = [];
                  const s = {};
                  typeof r.traits[e] === "string" &&
                    (s.company_id = xe(r.traits[e]));
                  const a =
                    (t(r.traits[e]) == "object" && Object.keys(r.traits[e])) ||
                    [];
                  a.forEach(function (t) {
                    a.hasOwnProperty(t) &&
                      (t != "id"
                        ? (s[t] = r.traits[e][t])
                        : (s.company_id = r.traits[e][t]));
                  }),
                    t(r.traits[e]) != "object" ||
                      a.includes("id") ||
                      (s.company_id = xe(s.name)),
                    o.push(s),
                    (n.companies = o);
                } else n[e] = r.traits[e];
                switch (e) {
                  case "createdAt":
                    n.created_at = i;
                    break;
                  case "anonymousId":
                    n.user_id = i;
                }
              }
            }),
              (n.user_id = e.message.userId),
              window.Intercom("update", n);
          },
        },
        {
          key: "track",
          value(e) {
            const t = {};
            const n = e.message;
            (n.properties ? Object.keys(n.properties) : null).forEach(function (
              e
            ) {
              const r = n.properties[e];
              t[e] = r;
            }),
              n.event && (t.event_name = n.event),
              (t.user_id = n.userId ? n.userId : n.anonymousId),
              (t.created_at = Math.floor(
                new Date(n.originalTimestamp).getTime() / 1e3
              )),
              window.Intercom("trackEvent", t.event_name, t);
          },
        },
        {
          key: "isLoaded",
          value() {
            return !!window.intercom_code;
          },
        },
        {
          key: "isReady",
          value() {
            return !!window.intercom_code;
          },
        },
      ]),
      e
    );
  })();
  const je = (function () {
    function e(t) {
      n(this, e),
        (this.projectID = t.projectID),
        (this.writeKey = t.writeKey),
        (this.ipAddon = t.ipAddon),
        (this.uaAddon = t.uaAddon),
        (this.urlAddon = t.urlAddon),
        (this.referrerAddon = t.referrerAddon),
        (this.client = null),
        (this.name = "KEEN");
    }
    return (
      i(e, [
        {
          key: "init",
          value() {
            g.debug("===in init Keen==="),
              L(
                "keen-integration",
                "https://cdn.jsdelivr.net/npm/keen-tracking@4"
              );
            var e = setInterval(
              function () {
                void 0 !== window.KeenTracking &&
                  void 0 !== window.KeenTracking &&
                  ((this.client = (function (e) {
                    return (
                      (e.client = new window.KeenTracking({
                        projectId: e.projectID,
                        writeKey: e.writeKey,
                      })),
                      e.client
                    );
                  })(this)),
                  clearInterval(e));
              }.bind(this),
              1e3
            );
          },
        },
        {
          key: "identify",
          value(e) {
            g.debug("in Keen identify");
            const t = e.message.context.traits;
            const n = e.message.userId
              ? e.message.userId
              : e.message.anonymousId;
            var r = e.message.properties
              ? Object.assign(r, e.message.properties)
              : {};
            (r.user = { userId: n, traits: t }),
              (r = this.getAddOn(r)),
              this.client.extendEvents(r);
          },
        },
        {
          key: "track",
          value(e) {
            g.debug("in Keen track");
            const t = e.message.event;
            let n = e.message.properties;
            (n = this.getAddOn(n)), this.client.recordEvent(t, n);
          },
        },
        {
          key: "page",
          value(e) {
            g.debug("in Keen page");
            const t = e.message.name;
            const n = e.message.properties
              ? e.message.properties.category
              : void 0;
            let r = "Loaded a Page";
            t && (r = `Viewed ${t} page`),
              n && t && (r = `Viewed ${n} ${t} page`);
            let i = e.message.properties;
            (i = this.getAddOn(i)), this.client.recordEvent(r, i);
          },
        },
        {
          key: "isLoaded",
          value() {
            return g.debug("in Keen isLoaded"), !(this.client == null);
          },
        },
        {
          key: "isReady",
          value() {
            return !(this.client == null);
          },
        },
        {
          key: "getAddOn",
          value(e) {
            const t = [];
            return (
              this.ipAddon &&
                ((e.ip_address = "${keen.ip}"),
                t.push({
                  name: "keen:ip_to_geo",
                  input: { ip: "ip_address" },
                  output: "ip_geo_info",
                })),
              this.uaAddon &&
                ((e.user_agent = "${keen.user_agent}"),
                t.push({
                  name: "keen:ua_parser",
                  input: { ua_string: "user_agent" },
                  output: "parsed_user_agent",
                })),
              this.urlAddon &&
                ((e.page_url = document.location.href),
                t.push({
                  name: "keen:url_parser",
                  input: { url: "page_url" },
                  output: "parsed_page_url",
                })),
              this.referrerAddon &&
                ((e.page_url = document.location.href),
                (e.referrer_url = document.referrer),
                t.push({
                  name: "keen:referrer_parser",
                  input: {
                    referrer_url: "referrer_url",
                    page_url: "page_url",
                  },
                  output: "referrer_info",
                })),
              (e.keen = { addons: t }),
              e
            );
          },
        },
      ]),
      e
    );
  })();
  const Le = Object.prototype.hasOwnProperty;
  const De = function (e) {
    for (
      let t = Array.prototype.slice.call(arguments, 1), n = 0;
      n < t.length;
      n += 1
    )
      for (const r in t[n]) Le.call(t[n], r) && (e[r] = t[n][r]);
    return e;
  };
  const Me = l(function (e) {
    function t(e) {
      return function (t, n, r, o) {
        let s;
        (normalize =
          o &&
          (function (e) {
            return typeof e === "function";
          })(o.normalizer)
            ? o.normalizer
            : i),
          (n = normalize(n));
        for (var a = !1; !a; ) c();
        function c() {
          for (s in t) {
            const e = normalize(s);
            if (n.indexOf(e) === 0) {
              const r = n.substr(e.length);
              if (r.charAt(0) === "." || r.length === 0) {
                n = r.substr(1);
                const i = t[s];
                return i == null
                  ? void (a = !0)
                  : n.length
                  ? void (t = i)
                  : void (a = !0);
              }
            }
          }
          (s = void 0), (a = !0);
        }
        if (s) return t == null ? t : e(t, s, r);
      };
    }
    function n(e, t) {
      return e.hasOwnProperty(t) && delete e[t], e;
    }
    function r(e, t, n) {
      return e.hasOwnProperty(t) && (e[t] = n), e;
    }
    function i(e) {
      return e.replace(/[^a-zA-Z0-9\.]+/g, "").toLowerCase();
    }
    (e.exports = t(function (e, t) {
      if (e.hasOwnProperty(t)) return e[t];
    })),
      (e.exports.find = e.exports),
      (e.exports.replace = function (e, n, i, o) {
        return t(r).call(this, e, n, i, o), e;
      }),
      (e.exports.del = function (e, r, i) {
        return t(n).call(this, e, r, null, i), e;
      });
  });
  const Ue =
    (Me.find,
    Me.replace,
    Me.del,
    (function () {
      function e(t) {
        n(this, e),
          (this.apiKey = t.apiKey),
          (this.prefixProperties = t.prefixProperties),
          (this.name = "KISSMETRICS");
      }
      return (
        i(e, [
          {
            key: "init",
            value() {
              g.debug("===in init Kissmetrics==="),
                (window._kmq = window._kmq || []);
              const e = window._kmk || this.apiKey;
              function t(e) {
                setTimeout(function () {
                  const t = document;
                  const n = t.getElementsByTagName("script")[0];
                  const r = t.createElement("script");
                  (r.type = "text/javascript"),
                    (r.async = !0),
                    (r.src = e),
                    n.parentNode.insertBefore(r, n);
                }, 1);
              }
              t("//i.kissmetrics.com/i.js"),
                t(`//scripts.kissmetrics.com/${e}.2.js`),
                this.isEnvMobile() &&
                  window._kmq.push(["set", { "Mobile Session": "Yes" }]);
            },
          },
          {
            key: "isEnvMobile",
            value() {
              return (
                navigator.userAgent.match(/Android/i) ||
                navigator.userAgent.match(/BlackBerry/i) ||
                navigator.userAgent.match(/IEMobile/i) ||
                navigator.userAgent.match(/Opera Mini/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/iPhone|iPod/i)
              );
            },
          },
          {
            key: "toUnixTimestamp",
            value(e) {
              return (e = new Date(e)), Math.floor(e.getTime() / 1e3);
            },
          },
          {
            key: "clean",
            value(e) {
              let t = {};
              for (const n in e)
                if (e.hasOwnProperty(n)) {
                  const r = e[n];
                  if (r == null) continue;
                  if (J.date(r)) {
                    t[n] = this.toUnixTimestamp(r);
                    continue;
                  }
                  if (J.bool(r)) {
                    t[n] = r;
                    continue;
                  }
                  if (J.number(r)) {
                    t[n] = r;
                    continue;
                  }
                  if (
                    (g.debug(r.toString()), r.toString() !== "[object Object]")
                  ) {
                    t[n] = r.toString();
                    continue;
                  }
                  const i = {};
                  i[n] = r;
                  const o = this.flatten(i, { safe: !0 });
                  for (const s in o) J.array(o[s]) && (o[s] = o[s].toString());
                  delete (t = De(t, o))[n];
                }
              return t;
            },
          },
          {
            key: "flatten",
            value(e, t) {
              const n = (t = t || {}).delimiter || ".";
              let r = t.maxDepth;
              let i = 1;
              const o = {};
              return (
                (function e(s, a) {
                  for (const c in s)
                    if (s.hasOwnProperty(c)) {
                      const u = s[c];
                      const l = t.safe && J.array(u);
                      const d = Object.prototype.toString.call(u);
                      const p =
                        d === "[object Object]" || d === "[object Array]";
                      const h = [];
                      const f = a ? a + n + c : c;
                      for (const g in (t.maxDepth || (r = i + 1), u))
                        u.hasOwnProperty(g) && h.push(g);
                      if (!l && p && h.length && i < r) return ++i, e(u, f);
                      o[f] = u;
                    }
                })(e),
                o
              );
            },
          },
          {
            key: "prefix",
            value(e, t) {
              const n = {};
              return (
                ie(t, function (t, r) {
                  t === "Billing Amount"
                    ? (n[t] = r)
                    : t === "revenue"
                    ? ((n[`${e} - ${t}`] = r), (n["Billing Amount"] = r))
                    : (n[`${e} - ${t}`] = r);
                }),
                n
              );
            },
          },
          {
            key: "identify",
            value(e) {
              g.debug("in Kissmetrics identify");
              const t = this.clean(e.message.context.traits);
              const n =
                e.message.userId && e.message.userId != ""
                  ? e.message.userId
                  : void 0;
              n && window._kmq.push(["identify", n]),
                t && window._kmq.push(["set", t]);
            },
          },
          {
            key: "track",
            value(e) {
              g.debug("in Kissmetrics track");
              const t = e.message.event;
              let n = JSON.parse(JSON.stringify(e.message.properties));
              const r = this.toUnixTimestamp(new Date());
              const i = _(n);
              i && (n.revenue = i);
              const o = n.products;
              o && delete n.products,
                (n = this.clean(n)),
                g.debug(JSON.stringify(n)),
                this.prefixProperties && (n = this.prefix(t, n)),
                window._kmq.push(["record", t, n]);
              const s = function (e, n) {
                let i = e;
                this.prefixProperties && (i = this.prefix(t, i)),
                  (i._t = r + n),
                  (i._d = 1),
                  window.KM.set(i);
              }.bind(this);
              o &&
                window._kmq.push(function () {
                  ie(o, s);
                });
            },
          },
          {
            key: "page",
            value(e) {
              g.debug("in Kissmetrics page");
              const t = e.message.name;
              const n = e.message.properties
                ? e.message.properties.category
                : void 0;
              let r = "Loaded a Page";
              t && (r = `Viewed ${t} page`),
                n && t && (r = `Viewed ${n} ${t} page`);
              let i = e.message.properties;
              this.prefixProperties && (i = this.prefix("Page", i)),
                window._kmq.push(["record", r, i]);
            },
          },
          {
            key: "alias",
            value(e) {
              const t = e.message.previousId;
              const n = e.message.userId;
              window._kmq.push(["alias", n, t]);
            },
          },
          {
            key: "group",
            value(e) {
              const t = e.message.groupId;
              let n = e.message.traits;
              (n = this.prefix("Group", n)),
                t && (n["Group - id"] = t),
                window._kmq.push(["set", n]),
                g.debug("in Kissmetrics group");
            },
          },
          {
            key: "isLoaded",
            value() {
              return J.object(window.KM);
            },
          },
          {
            key: "isReady",
            value() {
              return J.object(window.KM);
            },
          },
        ]),
        e
      );
    })());
  const Ne = (function () {
    function e(t) {
      n(this, e),
        (this.siteID = t.siteID),
        (this.apiKey = t.apiKey),
        (this.name = "CUSTOMERIO");
    }
    return (
      i(e, [
        {
          key: "init",
          value() {
            g.debug("===in init Customer IO init==="),
              (window._cio = window._cio || []);
            const e = this.siteID;
            !(function () {
              let t;
              let n;
              let r;
              for (
                t = function (e) {
                  return function () {
                    window._cio.push(
                      [e].concat(Array.prototype.slice.call(arguments, 0))
                    );
                  };
                },
                  n = ["load", "identify", "sidentify", "track", "page"],
                  r = 0;
                r < n.length;
                r++
              )
                window._cio[n[r]] = t(n[r]);
              const i = document.createElement("script");
              const o = document.getElementsByTagName("script")[0];
              (i.async = !0),
                (i.id = "cio-tracker"),
                i.setAttribute("data-site-id", e),
                (i.src = "https://assets.customer.io/assets/track.js"),
                o.parentNode.insertBefore(i, o);
            })();
          },
        },
        {
          key: "identify",
          value(e) {
            g.debug("in Customer IO identify");
            const t = e.message.userId
              ? e.message.userId
              : e.message.anonymousId;
            const n = e.message.context.traits ? e.message.context.traits : {};
            n.created_at ||
              (n.created_at = Math.floor(new Date().getTime() / 1e3)),
              (n.id = t),
              window._cio.identify(n);
          },
        },
        {
          key: "track",
          value(e) {
            g.debug("in Customer IO track");
            const t = e.message.event;
            const n = e.message.properties;
            window._cio.track(t, n);
          },
        },
        {
          key: "page",
          value(e) {
            g.debug("in Customer IO page");
            const t = e.message.name || e.message.properties.url;
            window._cio.page(t, e.message.properties);
          },
        },
        {
          key: "isLoaded",
          value() {
            return !(!window._cio || window._cio.push === Array.prototype.push);
          },
        },
        {
          key: "isReady",
          value() {
            return !(!window._cio || window._cio.push === Array.prototype.push);
          },
        },
      ]),
      e
    );
  })();
  let qe = !1;
  const Be = [];
  var Fe = setInterval(function () {
    document.body && ((qe = !0), ie(Be, Ge), clearInterval(Fe));
  }, 5);
  function Ge(e) {
    e(document.body);
  }
  const Ke = (function () {
    function e(t, r) {
      n(this, e),
        (this.analytics = r),
        (this._sf_async_config = window._sf_async_config =
          window._sf_async_config || {}),
        (window._sf_async_config.useCanonical = !0),
        (window._sf_async_config.uid = t.uid),
        (window._sf_async_config.domain = t.domain),
        (this.isVideo = !!t.video),
        (this.sendNameAndCategoryAsTitle = t.sendNameAndCategoryAsTitle || !0),
        (this.subscriberEngagementKeys = t.subscriberEngagementKeys || []),
        (this.replayEvents = []),
        (this.failed = !1),
        (this.isFirstPageCallMade = !1),
        (this.name = "CHARTBEAT");
    }
    return (
      i(e, [
        {
          key: "init",
          value() {
            g.debug("===in init Chartbeat===");
          },
        },
        {
          key: "identify",
          value(e) {
            g.debug("in Chartbeat identify");
          },
        },
        {
          key: "track",
          value(e) {
            g.debug("in Chartbeat track");
          },
        },
        {
          key: "page",
          value(e) {
            if (
              (g.debug("in Chartbeat page"),
              this.loadConfig(e),
              this.isFirstPageCallMade)
            ) {
              if (this.failed)
                return (
                  g.debug("===ignoring cause failed integration==="),
                  void (this.replayEvents = [])
                );
              if (!this.isLoaded() && !this.failed)
                return (
                  g.debug("===pushing to replay queue for chartbeat==="),
                  void this.replayEvents.push(["page", e])
                );
              g.debug("===processing page event in chartbeat===");
              const t = e.message.properties;
              window.pSUPERFLY.virtualPage(t.path);
            } else (this.isFirstPageCallMade = !0), this.initAfterPage();
          },
        },
        {
          key: "isLoaded",
          value() {
            return (
              g.debug("in Chartbeat isLoaded"),
              !this.isFirstPageCallMade || !!window.pSUPERFLY
            );
          },
        },
        {
          key: "isFailed",
          value() {
            return this.failed;
          },
        },
        {
          key: "isReady",
          value() {
            return !!window.pSUPERFLY;
          },
        },
        {
          key: "loadConfig",
          value(e) {
            let t;
            const n = e.message.properties;
            const r = n ? n.category : void 0;
            const i = e.message.name;
            const o = n ? n.author : void 0;
            this.sendNameAndCategoryAsTitle && (t = r && i ? `${r} ${i}` : i),
              r && (window._sf_async_config.sections = r),
              o && (window._sf_async_config.authors = o),
              t && (window._sf_async_config.title = t);
            const s = (window._cbq = window._cbq || []);
            for (const a in n)
              n.hasOwnProperty(a) &&
                this.subscriberEngagementKeys.indexOf(a) > -1 &&
                s.push([a, n[a]]);
          },
        },
        {
          key: "initAfterPage",
          value() {
            let e;
            const t = this;
            (e = function () {
              let e;
              let n;
              const r = t.isVideo ? "chartbeat_video.js" : "chartbeat.js";
              (e = document.createElement("script")),
                (n = document.getElementsByTagName("script")[0]),
                (e.type = "text/javascript"),
                (e.async = !0),
                (e.src = `//static.chartbeat.com/js/${r}`),
                n.parentNode.insertBefore(e, n);
            }),
              qe ? Ge(e) : Be.push(e),
              this._isReady(this).then(function (e) {
                g.debug("===replaying on chartbeat==="),
                  e.replayEvents.forEach(function (t) {
                    e[t[0]](t[1]);
                  });
              });
          },
        },
        {
          key: "pause",
          value(e) {
            return new Promise(function (t) {
              setTimeout(t, e);
            });
          },
        },
        {
          key: "_isReady",
          value(e) {
            const t = this;
            const n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 0;
            return new Promise(function (r) {
              return t.isLoaded()
                ? ((t.failed = !1),
                  g.debug("===chartbeat loaded successfully==="),
                  e.analytics.emit("ready"),
                  r(e))
                : n >= 1e4
                ? ((t.failed = !0), g.debug("===chartbeat failed==="), r(e))
                : void t.pause(1e3).then(function () {
                    return t._isReady(e, n + 1e3).then(r);
                  });
            });
          },
        },
      ]),
      e
    );
  })();
  const Ve = (function () {
    function e(t, r) {
      n(this, e),
        (this.c2ID = t.c2ID),
        (this.analytics = r),
        (this.comScoreBeaconParam = t.comScoreBeaconParam
          ? t.comScoreBeaconParam
          : {}),
        (this.isFirstPageCallMade = !1),
        (this.failed = !1),
        (this.comScoreParams = {}),
        (this.replayEvents = []),
        (this.name = "COMSCORE");
    }
    return (
      i(e, [
        {
          key: "init",
          value() {
            g.debug("===in init Comscore init===");
          },
        },
        {
          key: "identify",
          value(e) {
            g.debug("in Comscore identify");
          },
        },
        {
          key: "track",
          value(e) {
            g.debug("in Comscore track");
          },
        },
        {
          key: "page",
          value(e) {
            if (
              (g.debug("in Comscore page"),
              this.loadConfig(e),
              this.isFirstPageCallMade)
            ) {
              if (this.failed) return void (this.replayEvents = []);
              if (!this.isLoaded() && !this.failed)
                return void this.replayEvents.push(["page", e]);
              e.message.properties;
              window.COMSCORE.beacon(this.comScoreParams);
            } else (this.isFirstPageCallMade = !0), this.initAfterPage();
          },
        },
        {
          key: "loadConfig",
          value(e) {
            g.debug("=====in loadConfig====="),
              (this.comScoreParams = this.mapComscoreParams(
                e.message.properties
              )),
              (window._comscore = window._comscore || []),
              window._comscore.push(this.comScoreParams);
          },
        },
        {
          key: "initAfterPage",
          value() {
            g.debug("=====in initAfterPage====="),
              (function () {
                const e = document.createElement("script");
                const t = document.getElementsByTagName("script")[0];
                (e.async = !0),
                  (e.src = `${
                    document.location.protocol == "https:"
                      ? "https://sb"
                      : "http://b"
                  }.scorecardresearch.com/beacon.js`),
                  t.parentNode.insertBefore(e, t);
              })(),
              this._isReady(this).then(function (e) {
                e.replayEvents.forEach(function (t) {
                  e[t[0]](t[1]);
                });
              });
          },
        },
        {
          key: "pause",
          value(e) {
            return new Promise(function (t) {
              setTimeout(t, e);
            });
          },
        },
        {
          key: "_isReady",
          value(e) {
            const t = this;
            const n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 0;
            return new Promise(function (r) {
              return t.isLoaded()
                ? ((t.failed = !1), e.analytics.emit("ready"), r(e))
                : n >= 1e4
                ? ((t.failed = !0), r(e))
                : void t.pause(1e3).then(function () {
                    return t._isReady(e, n + 1e3).then(r);
                  });
            });
          },
        },
        {
          key: "mapComscoreParams",
          value(e) {
            g.debug("=====in mapComscoreParams=====");
            const t = this.comScoreBeaconParam;
            const n = {};
            return (
              Object.keys(t).forEach(function (r) {
                if (r in e) {
                  const i = t[r];
                  const o = e[r];
                  n[i] = o;
                }
              }),
              (n.c1 = "2"),
              (n.c2 = this.c2ID),
              g.debug("=====in mapComscoreParams=====", n),
              n
            );
          },
        },
        {
          key: "isLoaded",
          value() {
            return (
              g.debug("in Comscore isLoaded"),
              !this.isFirstPageCallMade || !!window.COMSCORE
            );
          },
        },
        {
          key: "isReady",
          value() {
            return !!window.COMSCORE;
          },
        },
      ]),
      e
    );
  })();
  const He = Object.prototype.hasOwnProperty;
  const ze = String.prototype.charAt;
  const Je = Object.prototype.toString;
  const We = function (e, t) {
    return ze.call(e, t);
  };
  const $e = function (e, t) {
    return He.call(e, t);
  };
  const Ye = function (e, t) {
    t = t || $e;
    for (var n = [], r = 0, i = e.length; r < i; r += 1)
      t(e, r) && n.push(String(r));
    return n;
  };
  const Qe = function (e) {
    return e == null
      ? []
      : ((t = e),
        Je.call(t) === "[object String]"
          ? Ye(e, We)
          : (function (e) {
              return (
                e != null &&
                typeof e !== "function" &&
                typeof e.length === "number"
              );
            })(e)
          ? Ye(e, $e)
          : (function (e, t) {
              t = t || $e;
              const n = [];
              for (const r in e) t(e, r) && n.push(String(r));
              return n;
            })(e));
    let t;
  };
  const Ze = Object.prototype.toString;
  const Xe =
    typeof Array.isArray === "function"
      ? Array.isArray
      : function (e) {
          return Ze.call(e) === "[object Array]";
        };
  const et = function (e) {
    return (
      e != null &&
      (Xe(e) ||
        (e !== "function" &&
          (function (e) {
            const t = typeof e;
            return (
              t === "number" ||
              (t === "object" && Ze.call(e) === "[object Number]")
            );
          })(e.length)))
    );
  };
  const tt = function (e, t) {
    for (let n = 0; n < t.length && !1 !== e(t[n], n, t); n += 1);
  };
  const nt = function (e, t) {
    for (
      let n = Qe(t), r = 0;
      r < n.length && !1 !== e(t[n[r]], n[r], t);
      r += 1
    );
  };
  const rt = function (e, t) {
    return (et(t) ? tt : nt).call(this, e, t);
  };
  const it = (function () {
    function e(t) {
      n(this, e),
        (this.blacklistPiiProperties = t.blacklistPiiProperties),
        (this.categoryToContent = t.categoryToContent),
        (this.pixelId = t.pixelId),
        (this.eventsToEvents = t.eventsToEvents),
        (this.eventCustomProperties = t.eventCustomProperties),
        (this.valueFieldIdentifier = t.valueFieldIdentifier),
        (this.advancedMapping = t.advancedMapping),
        (this.traitKeyToExternalId = t.traitKeyToExternalId),
        (this.legacyConversionPixelId = t.legacyConversionPixelId),
        (this.userIdAsPixelId = t.userIdAsPixelId),
        (this.whitelistPiiProperties = t.whitelistPiiProperties),
        (this.name = "FB_PIXEL");
    }
    return (
      i(e, [
        {
          key: "init",
          value() {
            void 0 === this.categoryToContent && (this.categoryToContent = []),
              void 0 === this.legacyConversionPixelId &&
                (this.legacyConversionPixelId = []),
              void 0 === this.userIdAsPixelId && (this.userIdAsPixelId = []),
              g.debug("===in init FbPixel==="),
              (window._fbq = function () {
                window.fbq.callMethod
                  ? window.fbq.callMethod.apply(window.fbq, arguments)
                  : window.fbq.queue.push(arguments);
              }),
              (window.fbq = window.fbq || window._fbq),
              (window.fbq.push = window.fbq),
              (window.fbq.loaded = !0),
              (window.fbq.disablePushState = !0),
              (window.fbq.allowDuplicatePageViews = !0),
              (window.fbq.version = "2.0"),
              (window.fbq.queue = []),
              window.fbq("init", this.pixelId),
              L(
                "fbpixel-integration",
                "//connect.facebook.net/en_US/fbevents.js"
              );
          },
        },
        {
          key: "isLoaded",
          value() {
            return (
              g.debug("in FBPixel isLoaded"),
              !(!window.fbq || !window.fbq.callMethod)
            );
          },
        },
        {
          key: "isReady",
          value() {
            return (
              g.debug("in FBPixel isReady"),
              !(!window.fbq || !window.fbq.callMethod)
            );
          },
        },
        {
          key: "page",
          value(e) {
            window.fbq("track", "PageView");
          },
        },
        {
          key: "identify",
          value(e) {
            this.advancedMapping &&
              window.fbq("init", this.pixelId, e.message.context.traits);
          },
        },
        {
          key: "track",
          value(e) {
            const t = this;
            const n = this;
            const r = e.message.event;
            let i = this.formatRevenue(e.message.properties.revenue);
            const o = this.buildPayLoad(e, !0);
            void 0 === this.categoryToContent && (this.categoryToContent = []),
              void 0 === this.legacyConversionPixelId &&
                (this.legacyConversionPixelId = []),
              void 0 === this.userIdAsPixelId && (this.userIdAsPixelId = []),
              (o.value = i);
            let s;
            let a;
            const c = this.eventsToEvents;
            const u = this.legacyConversionPixelId;
            if (
              ((s = c.reduce(function (e, t) {
                return t.from === r && e.push(t.to), e;
              }, [])),
              (a = u.reduce(function (e, t) {
                return t.from === r && e.push(t.to), e;
              }, [])),
              rt(function (t) {
                (o.currency = e.message.properties.currency || "USD"),
                  window.fbq("trackSingle", n.pixelId, t, o, {
                    eventID: e.message.messageId,
                  });
              }, s),
              rt(function (t) {
                window.fbq(
                  "trackSingle",
                  n.pixelId,
                  t,
                  { currency: e.message.properties.currency, value: i },
                  { eventID: e.message.messageId }
                );
              }, a),
              r === "Product List Viewed")
            ) {
              var l = [];
              var d = e.message.properties.products;
              var p = this.buildPayLoad(e, !0);
              Array.isArray(d) &&
                d.forEach(function (t) {
                  const n = t.product_id;
                  n &&
                    (g.push(n),
                    l.push({
                      id: n,
                      quantity: e.message.properties.quantity,
                    }));
                }),
                g.length
                  ? (f = ["product"])
                  : (g.push(e.message.properties.category || ""),
                    l.push({
                      id: e.message.properties.category || "",
                      quantity: 1,
                    }),
                    (f = ["product_group"])),
                window.fbq(
                  "trackSingle",
                  n.pixelId,
                  "ViewContent",
                  this.merge(
                    {
                      content_ids: g,
                      content_type: this.getContentType(e, f),
                      contents: l,
                    },
                    p
                  ),
                  { eventID: e.message.messageId }
                ),
                rt(function (r) {
                  window.fbq(
                    "trackSingle",
                    n.pixelId,
                    r,
                    {
                      currency: e.message.properties.currency,
                      value: t.formatRevenue(e.message.properties.revenue),
                    },
                    { eventID: e.message.messageId }
                  );
                }, a);
            } else if (r === "Product Viewed") {
              var h = this.valueFieldIdentifier === "properties.value";
              p = this.buildPayLoad(e, !0);
              window.fbq(
                "trackSingle",
                n.pixelId,
                "ViewContent",
                this.merge(
                  {
                    content_ids: [
                      e.message.properties.product_id ||
                        e.message.properties.id ||
                        e.message.properties.sku ||
                        "",
                    ],
                    content_type: this.getContentType(e, ["product"]),
                    content_name: e.message.properties.product_name || "",
                    content_category: e.message.properties.category || "",
                    currency: e.message.properties.currency,
                    value: h
                      ? this.formatRevenue(e.message.properties.value)
                      : this.formatRevenue(e.message.properties.price),
                    contents: [
                      {
                        id:
                          e.message.properties.product_id ||
                          e.message.properties.id ||
                          e.message.properties.sku ||
                          "",
                        quantity: e.message.properties.quantity,
                        item_price: e.message.properties.price,
                      },
                    ],
                  },
                  p
                ),
                { eventID: e.message.messageId }
              ),
                rt(function (r) {
                  window.fbq(
                    "trackSingle",
                    n.pixelId,
                    r,
                    {
                      currency: e.message.properties.currency,
                      value: h
                        ? t.formatRevenue(e.message.properties.value)
                        : t.formatRevenue(e.message.properties.price),
                    },
                    { eventID: e.message.messageId }
                  );
                }, a);
            } else if (r === "Product Added") {
              (h = this.valueFieldIdentifier === "properties.value"),
                (p = this.buildPayLoad(e, !0));
              window.fbq(
                "trackSingle",
                n.pixelId,
                "AddToCart",
                this.merge(
                  {
                    content_ids: [
                      e.message.properties.product_id ||
                        e.message.properties.id ||
                        e.message.properties.sku ||
                        "",
                    ],
                    content_type: this.getContentType(e, ["product"]),
                    content_name: e.message.properties.product_name || "",
                    content_category: e.message.properties.category || "",
                    currency: e.message.properties.currency,
                    value: h
                      ? this.formatRevenue(e.message.properties.value)
                      : this.formatRevenue(e.message.properties.price),
                    contents: [
                      {
                        id:
                          e.message.properties.product_id ||
                          e.message.properties.id ||
                          e.message.properties.sku ||
                          "",
                        quantity: e.message.properties.quantity,
                        item_price: e.message.properties.price,
                      },
                    ],
                  },
                  p
                ),
                { eventID: e.message.messageId }
              ),
                rt(function (r) {
                  window.fbq(
                    "trackSingle",
                    n.pixelId,
                    r,
                    {
                      currency: e.message.properties.currency,
                      value: h
                        ? t.formatRevenue(e.message.properties.value)
                        : t.formatRevenue(e.message.properties.price),
                    },
                    { eventID: e.message.messageId }
                  );
                }, a),
                this.merge(
                  {
                    content_ids: [
                      e.message.properties.product_id ||
                        e.message.properties.id ||
                        e.message.properties.sku ||
                        "",
                    ],
                    content_type: this.getContentType(e, ["product"]),
                    content_name: e.message.properties.product_name || "",
                    content_category: e.message.properties.category || "",
                    currency: e.message.properties.currency,
                    value: h
                      ? this.formatRevenue(e.message.properties.value)
                      : this.formatRevenue(e.message.properties.price),
                    contents: [
                      {
                        id:
                          e.message.properties.product_id ||
                          e.message.properties.id ||
                          e.message.properties.sku ||
                          "",
                        quantity: e.message.properties.quantity,
                        item_price: e.message.properties.price,
                      },
                    ],
                  },
                  p
                );
            } else if (r === "Order Completed") {
              (d = e.message.properties.products),
                (p = this.buildPayLoad(e, !0)),
                (i = this.formatRevenue(e.message.properties.revenue));
              for (
                var f = this.getContentType(e, ["product"]),
                  g = [],
                  m = ((l = []), 0);
                m < d.length;
                m++
              ) {
                var y = product.product_id;
                g.push(y);
                var v = { id: y, quantity: e.message.properties.quantity };
                e.message.properties.price &&
                  (v.item_price = e.message.properties.price),
                  l.push(v);
              }
              window.fbq(
                "trackSingle",
                n.pixelId,
                "Purchase",
                this.merge(
                  {
                    content_ids: g,
                    content_type: f,
                    currency: e.message.properties.currency,
                    value: i,
                    contents: l,
                    num_items: g.length,
                  },
                  p
                ),
                { eventID: e.message.messageId }
              ),
                rt(function (r) {
                  window.fbq(
                    "trackSingle",
                    n.pixelId,
                    r,
                    {
                      currency: e.message.properties.currency,
                      value: t.formatRevenue(e.message.properties.revenue),
                    },
                    { eventID: e.message.messageId }
                  );
                }, a);
            } else if (r === "Products Searched") {
              p = this.buildPayLoad(e, !0);
              window.fbq(
                "trackSingle",
                n.pixelId,
                "Search",
                this.merge({ search_string: e.message.properties.query }, p),
                { eventID: e.message.messageId }
              ),
                rt(function (t) {
                  window.fbq(
                    "trackSingle",
                    n.pixelId,
                    t,
                    {
                      currency: e.message.properties.currency,
                      value: formatRevenue(e.message.properties.revenue),
                    },
                    { eventID: e.message.messageId }
                  );
                }, a);
            } else if (r === "Checkout Started") {
              (d = e.message.properties.products),
                (p = this.buildPayLoad(e, !0)),
                (i = this.formatRevenue(e.message.properties.revenue));
              let b = e.message.properties.category;
              for (g = [], l = [], m = 0; m < d.length; m++) {
                y = d[m].product_id;
                g.push(y);
                v = {
                  id: y,
                  quantity: e.message.properties.quantity,
                  item_price: e.message.properties.price,
                };
                e.message.properties.price &&
                  (v.item_price = e.message.properties.price),
                  l.push(v);
              }
              !b && d[0] && d[0].category && (b = d[0].category),
                window.fbq(
                  "trackSingle",
                  n.pixelId,
                  "InitiateCheckout",
                  this.merge(
                    {
                      content_category: b,
                      content_ids: g,
                      content_type: this.getContentType(e, ["product"]),
                      currency: e.message.properties.currency,
                      value: i,
                      contents: l,
                      num_items: g.length,
                    },
                    p
                  ),
                  { eventID: e.message.messageId }
                ),
                rt(function (r) {
                  window.fbq(
                    "trackSingle",
                    n.pixelId,
                    r,
                    {
                      currency: e.message.properties.currency,
                      value: t.formatRevenue(e.message.properties.revenue),
                    },
                    { eventID: e.message.messageId }
                  );
                }, a);
            }
          },
        },
        {
          key: "getContentType",
          value(e, t) {
            const n = e.message.options;
            if (n && n.contentType) return [n.contentType];
            let r;
            let i = e.message.properties.category;
            if (!i) {
              const o = e.message.properties.products;
              o && o.length && (i = o[0].category);
            }
            if (
              i &&
              (r = this.categoryToContent.reduce(function (e, t) {
                return t.from == i && e.push(t.to), e;
              }, [])).length
            )
              return r;
            return t;
          },
        },
        {
          key: "merge",
          value(e, t) {
            const n = {};
            for (const r in e) e.hasOwnProperty(r) && (n[r] = e[r]);
            for (const i in t)
              t.hasOwnProperty(i) && !n.hasOwnProperty(i) && (n[i] = t[i]);
            return n;
          },
        },
        {
          key: "formatRevenue",
          value(e) {
            return Number(e || 0).toFixed(2);
          },
        },
        {
          key: "buildPayLoad",
          value(e, t) {
            for (
              var n = [
                  "checkinDate",
                  "checkoutDate",
                  "departingArrivalDate",
                  "departingDepartureDate",
                  "returningArrivalDate",
                  "returningDepartureDate",
                  "travelEnd",
                  "travelStart",
                ],
                r = [
                  "email",
                  "firstName",
                  "lastName",
                  "gender",
                  "city",
                  "country",
                  "phone",
                  "state",
                  "zip",
                  "birthday",
                ],
                i = this.whitelistPiiProperties || [],
                o = this.blacklistPiiProperties || [],
                s = this.eventCustomProperties || [],
                a = {},
                c = 0;
              c < o[c];
              c++
            ) {
              const u = o[c];
              a[u.blacklistPiiProperties] = u.blacklistPiiHash;
            }
            const l = {};
            const d = e.message.properties;
            for (const p in d)
              if (d.hasOwnProperty(p) && !(t && s.indexOf(p) < 0)) {
                const h = d[p];
                if (n.indexOf(d) >= 0 && J.date(h))
                  l[p] = h.toISOTring().split("T")[0];
                else if (a.hasOwnProperty(p))
                  a[p] && typeof h === "string" && (l[p] = sha256(h));
                else {
                  const f = r.indexOf(p) >= 0;
                  const g = i.indexOf(p) >= 0;
                  (f && !g) || (l[p] = h);
                }
              }
            return l;
          },
        },
      ]),
      e
    );
  })();
  const ot = Object.prototype.toString;
  const st = function e(t) {
    const n = (function (e) {
      switch (ot.call(e)) {
        case "[object Date]":
          return "date";
        case "[object RegExp]":
          return "regexp";
        case "[object Arguments]":
          return "arguments";
        case "[object Array]":
          return "array";
        case "[object Error]":
          return "error";
      }
      return e === null
        ? "null"
        : void 0 === e
        ? "undefined"
        : e != e
        ? "nan"
        : e && e.nodeType === 1
        ? "element"
        : (t = e) != null &&
          (t._isBuffer ||
            (t.constructor &&
              typeof t.constructor.isBuffer === "function" &&
              t.constructor.isBuffer(t)))
        ? "buffer"
        : typeof (e = e.valueOf
            ? e.valueOf()
            : Object.prototype.valueOf.apply(e));
      let t;
    })(t);
    if (n === "object") {
      var r = {};
      for (const i in t) t.hasOwnProperty(i) && (r[i] = e(t[i]));
      return r;
    }
    if (n === "array") {
      r = new Array(t.length);
      for (let o = 0, s = t.length; o < s; o++) r[o] = e(t[o]);
      return r;
    }
    if (n === "regexp") {
      let a = "";
      return (
        (a += t.multiline ? "m" : ""),
        (a += t.global ? "g" : ""),
        (a += t.ignoreCase ? "i" : ""),
        new RegExp(t.source, a)
      );
    }
    return n === "date" ? new Date(t.getTime()) : t;
  };
  const at = 1e3;
  const ct = 60 * at;
  const ut = 60 * ct;
  const lt = 24 * ut;
  const dt = 365.25 * lt;
  const pt = function (e, t) {
    return (
      (t = t || {}),
      typeof e === "string"
        ? (function (e) {
            if ((e = `${e}`).length > 1e4) return;
            const t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
              e
            );
            if (!t) return;
            const n = parseFloat(t[1]);
            switch ((t[2] || "ms").toLowerCase()) {
              case "years":
              case "year":
              case "yrs":
              case "yr":
              case "y":
                return n * dt;
              case "days":
              case "day":
              case "d":
                return n * lt;
              case "hours":
              case "hour":
              case "hrs":
              case "hr":
              case "h":
                return n * ut;
              case "minutes":
              case "minute":
              case "mins":
              case "min":
              case "m":
                return n * ct;
              case "seconds":
              case "second":
              case "secs":
              case "sec":
              case "s":
                return n * at;
              case "milliseconds":
              case "millisecond":
              case "msecs":
              case "msec":
              case "ms":
                return n;
            }
          })(e)
        : t.long
        ? (function (e) {
            return (
              ht(e, lt, "day") ||
              ht(e, ut, "hour") ||
              ht(e, ct, "minute") ||
              ht(e, at, "second") ||
              `${e} ms`
            );
          })(e)
        : (function (e) {
            return e >= lt
              ? `${Math.round(e / lt)}d`
              : e >= ut
              ? `${Math.round(e / ut)}h`
              : e >= ct
              ? `${Math.round(e / ct)}m`
              : e >= at
              ? `${Math.round(e / at)}s`
              : `${e}ms`;
          })(e)
    );
  };
  function ht(e, t, n) {
    if (!(e < t))
      return e < 1.5 * t
        ? `${Math.floor(e / t)} ${n}`
        : `${Math.ceil(e / t)} ${n}s`;
  }
  const ft = l(function (e, t) {
    ((t = e.exports = function (e) {
      function i() {}
      function o() {
        const e = o;
        const i = +new Date();
        const s = i - (n || i);
        (e.diff = s),
          (e.prev = n),
          (e.curr = i),
          (n = i),
          e.useColors == null && (e.useColors = t.useColors()),
          e.color == null &&
            e.useColors &&
            (e.color = t.colors[r++ % t.colors.length]);
        let a = Array.prototype.slice.call(arguments);
        (a[0] = t.coerce(a[0])),
          typeof a[0] !== "string" && (a = ["%o"].concat(a));
        let c = 0;
        (a[0] = a[0].replace(/%([a-z%])/g, function (n, r) {
          if (n === "%%") return n;
          c++;
          const i = t.formatters[r];
          if (typeof i === "function") {
            const o = a[c];
            (n = i.call(e, o)), a.splice(c, 1), c--;
          }
          return n;
        })),
          typeof t.formatArgs === "function" && (a = t.formatArgs.apply(e, a)),
          (o.log || t.log || console.log.bind(console)).apply(e, a);
      }
      (i.enabled = !1), (o.enabled = !0);
      const s = t.enabled(e) ? o : i;
      return (s.namespace = e), s;
    }).coerce = function (e) {
      return e instanceof Error ? e.stack || e.message : e;
    }),
      (t.disable = function () {
        t.enable("");
      }),
      (t.enable = function (e) {
        t.save(e);
        for (let n = (e || "").split(/[\s,]+/), r = n.length, i = 0; i < r; i++)
          n[i] &&
            ((e = n[i].replace(/\*/g, ".*?"))[0] === "-"
              ? t.skips.push(new RegExp(`^${e.substr(1)}$`))
              : t.names.push(new RegExp(`^${e}$`)));
      }),
      (t.enabled = function (e) {
        let n;
        let r;
        for (n = 0, r = t.skips.length; n < r; n++)
          if (t.skips[n].test(e)) return !1;
        for (n = 0, r = t.names.length; n < r; n++)
          if (t.names[n].test(e)) return !0;
        return !1;
      }),
      (t.humanize = pt),
      (t.names = []),
      (t.skips = []),
      (t.formatters = {});
    let n;
    var r = 0;
  });
  const gt =
    (ft.coerce,
    ft.disable,
    ft.enable,
    ft.enabled,
    ft.humanize,
    ft.names,
    ft.skips,
    ft.formatters,
    l(function (e, t) {
      function n() {
        let e;
        try {
          e = t.storage.debug;
        } catch (e) {}
        return e;
      }
      ((t = e.exports = ft).log = function () {
        return (
          typeof console === "object" &&
          console.log &&
          Function.prototype.apply.call(console.log, console, arguments)
        );
      }),
        (t.formatArgs = function () {
          let e = arguments;
          const n = this.useColors;
          if (
            ((e[0] = `${
              (n ? "%c" : "") +
              this.namespace +
              (n ? " %c" : " ") +
              e[0] +
              (n ? "%c " : " ")
            }+${t.humanize(this.diff)}`),
            !n)
          )
            return e;
          const r = `color: ${this.color}`;
          e = [e[0], r, "color: inherit"].concat(
            Array.prototype.slice.call(e, 1)
          );
          let i = 0;
          let o = 0;
          return (
            e[0].replace(/%[a-z%]/g, function (e) {
              e !== "%%" && (i++, e === "%c" && (o = i));
            }),
            e.splice(o, 0, r),
            e
          );
        }),
        (t.save = function (e) {
          try {
            e == null ? t.storage.removeItem("debug") : (t.storage.debug = e);
          } catch (e) {}
        }),
        (t.load = n),
        (t.useColors = function () {
          return (
            "WebkitAppearance" in document.documentElement.style ||
            (window.console &&
              (console.firebug || (console.exception && console.table))) ||
            (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
              parseInt(RegExp.$1, 10) >= 31)
          );
        }),
        (t.storage =
          typeof chrome !== "undefined" && void 0 !== chrome.storage
            ? chrome.storage.local
            : (function () {
                try {
                  return window.localStorage;
                } catch (e) {}
              })()),
        (t.colors = [
          "lightseagreen",
          "forestgreen",
          "goldenrod",
          "dodgerblue",
          "darkorchid",
          "crimson",
        ]),
        (t.formatters.j = function (e) {
          return JSON.stringify(e);
        }),
        t.enable(n());
    }));
  const mt =
    (gt.log,
    gt.formatArgs,
    gt.save,
    gt.load,
    gt.useColors,
    gt.storage,
    gt.colors,
    gt("cookie"));
  const yt = function (e, t, n) {
    switch (arguments.length) {
      case 3:
      case 2:
        return vt(e, t, n);
      case 1:
        return wt(e);
      default:
        return bt();
    }
  };
  function vt(e, t, n) {
    n = n || {};
    let r = `${kt(e)}=${kt(t)}`;
    t == null && (n.maxage = -1),
      n.maxage && (n.expires = new Date(+new Date() + n.maxage)),
      n.path && (r += `; path=${n.path}`),
      n.domain && (r += `; domain=${n.domain}`),
      n.expires && (r += `; expires=${n.expires.toUTCString()}`),
      n.samesite && (r += `; samesite=${n.samesite}`),
      n.secure && (r += "; secure"),
      (document.cookie = r);
  }
  function bt() {
    let e;
    try {
      e = document.cookie;
    } catch (e) {
      return (
        typeof console !== "undefined" &&
          typeof console.error === "function" &&
          console.error(e.stack || e),
        {}
      );
    }
    return (function (e) {
      let t;
      const n = {};
      const r = e.split(/ *; */);
      if (r[0] == "") return n;
      for (let i = 0; i < r.length; ++i)
        (t = r[i].split("=")), (n[Et(t[0])] = Et(t[1]));
      return n;
    })(e);
  }
  function wt(e) {
    return bt()[e];
  }
  function kt(e) {
    try {
      return encodeURIComponent(e);
    } catch (t) {
      mt("error `encode(%o)` - %o", e, t);
    }
  }
  function Et(e) {
    try {
      return decodeURIComponent(e);
    } catch (t) {
      mt("error `decode(%o)` - %o", e, t);
    }
  }
  const It = l(function (e, t) {
    (function () {
      const n = { function: !0, object: !0 };
      const r = t && !t.nodeType && t;
      let i = (n[typeof window] && window) || this;
      const o = r && n.object && e && !e.nodeType && typeof u === "object" && u;
      function s(e, t) {
        e || (e = i.Object()), t || (t = i.Object());
        const r = e.Number || i.Number;
        const o = e.String || i.String;
        const a = e.Object || i.Object;
        const c = e.Date || i.Date;
        const u = e.SyntaxError || i.SyntaxError;
        const l = e.TypeError || i.TypeError;
        const d = e.Math || i.Math;
        const p = e.JSON || i.JSON;
        typeof p === "object" &&
          p &&
          ((t.stringify = p.stringify), (t.parse = p.parse));
        let h;
        const f = a.prototype;
        const g = f.toString;
        const m = f.hasOwnProperty;
        function y(e, t) {
          try {
            e();
          } catch (e) {
            t && t();
          }
        }
        let v = new c(-0xc782b5b800cec);
        function b(e) {
          if (b[e] != null) return b[e];
          let n;
          if (e == "bug-string-char-index") n = "a"[0] != "a";
          else if (e == "json")
            n =
              b("json-stringify") && b("date-serialization") && b("json-parse");
          else if (e == "date-serialization") {
            if ((n = b("json-stringify") && v)) {
              var i = t.stringify;
              y(function () {
                n =
                  i(new c(-864e13)) == '"-271821-04-20T00:00:00.000Z"' &&
                  i(new c(864e13)) == '"+275760-09-13T00:00:00.000Z"' &&
                  i(new c(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                  i(new c(-1)) == '"1969-12-31T23:59:59.999Z"';
              });
            }
          } else {
            let s;
            const a = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
            if (e == "json-stringify") {
              let u = typeof (i = t.stringify) === "function";
              u &&
                (((s = function () {
                  return 1;
                }).toJSON = s),
                y(
                  function () {
                    u =
                      i(0) === "0" &&
                      i(new r()) === "0" &&
                      i(new o()) == '""' &&
                      i(g) === h &&
                      i(h) === h &&
                      i() === h &&
                      i(s) === "1" &&
                      i([s]) == "[1]" &&
                      i([h]) == "[null]" &&
                      i(null) == "null" &&
                      i([h, g, null]) == "[null,null,null]" &&
                      i({ a: [s, !0, !1, null, "\0\b\n\f\r\t"] }) == a &&
                      i(null, s) === "1" &&
                      i([1, 2], null, 1) == "[\n 1,\n 2\n]";
                  },
                  function () {
                    u = !1;
                  }
                )),
                (n = u);
            }
            if (e == "json-parse") {
              let l;
              const d = t.parse;
              typeof d === "function" &&
                y(
                  function () {
                    d("0") !== 0 ||
                      d(!1) ||
                      ((s = d(a)),
                      (l = s.a.length == 5 && s.a[0] === 1) &&
                        (y(function () {
                          l = !d('"\t"');
                        }),
                        l &&
                          y(function () {
                            l = d("01") !== 1;
                          }),
                        l &&
                          y(function () {
                            l = d("1.") !== 1;
                          })));
                  },
                  function () {
                    l = !1;
                  }
                ),
                (n = l);
            }
          }
          return (b[e] = !!n);
        }
        if (
          (y(function () {
            v =
              v.getUTCFullYear() == -109252 &&
              v.getUTCMonth() === 0 &&
              v.getUTCDate() === 1 &&
              v.getUTCHours() == 10 &&
              v.getUTCMinutes() == 37 &&
              v.getUTCSeconds() == 6 &&
              v.getUTCMilliseconds() == 708;
          }),
          (b["bug-string-char-index"] = b["date-serialization"] = b.json = b[
            "json-stringify"
          ] = b["json-parse"] = null),
          !b("json"))
        ) {
          const w = b("bug-string-char-index");
          var k = function (e, t) {
            let r;
            let i;
            let o;
            let s = 0;
            for (o in (((r = function () {
              this.valueOf = 0;
            }).prototype.valueOf = 0),
            (i = new r())))
              m.call(i, o) && s++;
            return (
              (r = i = null),
              s
                ? (k = function (e, t) {
                    let n;
                    let r;
                    const i = g.call(e) == "[object Function]";
                    for (n in e)
                      (i && n == "prototype") ||
                        !m.call(e, n) ||
                        (r = n === "constructor") ||
                        t(n);
                    (r || m.call(e, (n = "constructor"))) && t(n);
                  })
                : ((i = [
                    "valueOf",
                    "toString",
                    "toLocaleString",
                    "propertyIsEnumerable",
                    "isPrototypeOf",
                    "hasOwnProperty",
                    "constructor",
                  ]),
                  (k = function (e, t) {
                    let r;
                    let o;
                    const s = g.call(e) == "[object Function]";
                    const a =
                      (!s &&
                        typeof e.constructor !== "function" &&
                        n[typeof e.hasOwnProperty] &&
                        e.hasOwnProperty) ||
                      m;
                    for (r in e)
                      (s && r == "prototype") || !a.call(e, r) || t(r);
                    for (o = i.length; (r = i[--o]); ) a.call(e, r) && t(r);
                  })),
              k(e, t)
            );
          };
          if (!b("json-stringify") && !b("date-serialization")) {
            const E = {
              92: "\\\\",
              34: '\\"',
              8: "\\b",
              12: "\\f",
              10: "\\n",
              13: "\\r",
              9: "\\t",
            };
            const I = function (e, t) {
              return `000000${t || 0}`.slice(-e);
            };
            var _ = function (e) {
              let t;
              let n;
              let r;
              let i;
              let o;
              let s;
              let a;
              let c;
              let u;
              if (v)
                t = function (e) {
                  (n = e.getUTCFullYear()),
                    (r = e.getUTCMonth()),
                    (i = e.getUTCDate()),
                    (s = e.getUTCHours()),
                    (a = e.getUTCMinutes()),
                    (c = e.getUTCSeconds()),
                    (u = e.getUTCMilliseconds());
                };
              else {
                const l = d.floor;
                const p = [
                  0,
                  31,
                  59,
                  90,
                  120,
                  151,
                  181,
                  212,
                  243,
                  273,
                  304,
                  334,
                ];
                const h = function (e, t) {
                  return (
                    p[t] +
                    365 * (e - 1970) +
                    l((e - 1969 + (t = +(t > 1))) / 4) -
                    l((e - 1901 + t) / 100) +
                    l((e - 1601 + t) / 400)
                  );
                };
                t = function (e) {
                  for (
                    i = l(e / 864e5), n = l(i / 365.2425) + 1970 - 1;
                    h(n + 1, 0) <= i;
                    n++
                  );
                  for (r = l((i - h(n, 0)) / 30.42); h(n, r + 1) <= i; r++);
                  (i = 1 + i - h(n, r)),
                    (s = l((o = ((e % 864e5) + 864e5) % 864e5) / 36e5) % 24),
                    (a = l(o / 6e4) % 60),
                    (c = l(o / 1e3) % 60),
                    (u = o % 1e3);
                };
              }
              return (_ = function (e) {
                return (
                  e > -1 / 0 && e < 1 / 0
                    ? (t(e),
                      (e = `${
                        n <= 0 || n >= 1e4
                          ? (n < 0 ? "-" : "+") + I(6, n < 0 ? -n : n)
                          : I(4, n)
                      }-${I(2, r + 1)}-${I(2, i)}T${I(2, s)}:${I(2, a)}:${I(
                        2,
                        c
                      )}.${I(3, u)}Z`),
                      (n = r = i = s = a = c = u = null))
                    : (e = null),
                  e
                );
              })(e);
            };
            if (b("json-stringify") && !b("date-serialization")) {
              function A(e) {
                return _(this);
              }
              const C = t.stringify;
              t.stringify = function (e, t, n) {
                const r = c.prototype.toJSON;
                c.prototype.toJSON = A;
                const i = C(e, t, n);
                return (c.prototype.toJSON = r), i;
              };
            } else {
              const T = function (e) {
                const t = e.charCodeAt(0);
                const n = E[t];
                return n || `\\u00${I(2, t.toString(16))}`;
              };
              const O = /[\x00-\x1f\x22\x5c]/g;
              const P = function (e) {
                return (
                  (O.lastIndex = 0), `"${O.test(e) ? e.replace(O, T) : e}"`
                );
              };
              var S = function (e, t, n, r, i, o, s) {
                let a;
                let u;
                let d;
                let p;
                let f;
                let m;
                let v;
                let b;
                let w;
                if (
                  (y(function () {
                    a = t[e];
                  }),
                  typeof a === "object" &&
                    a &&
                    (a.getUTCFullYear &&
                    g.call(a) == "[object Date]" &&
                    a.toJSON === c.prototype.toJSON
                      ? (a = _(a))
                      : typeof a.toJSON === "function" && (a = a.toJSON(e))),
                  n && (a = n.call(t, e, a)),
                  a == h)
                )
                  return a === h ? a : "null";
                switch (
                  ((u = typeof a) == "object" && (d = g.call(a)), d || u)
                ) {
                  case "boolean":
                  case "[object Boolean]":
                    return `${a}`;
                  case "number":
                  case "[object Number]":
                    return a > -1 / 0 && a < 1 / 0 ? `${a}` : "null";
                  case "string":
                  case "[object String]":
                    return P(`${a}`);
                }
                if (typeof a === "object") {
                  for (v = s.length; v--; ) if (s[v] === a) throw l();
                  if (
                    (s.push(a),
                    (p = []),
                    (b = o),
                    (o += i),
                    d == "[object Array]")
                  ) {
                    for (m = 0, v = a.length; m < v; m++)
                      (f = S(m, a, n, r, i, o, s)),
                        p.push(f === h ? "null" : f);
                    w = p.length
                      ? i
                        ? `[\n${o}${p.join(`,\n${o}`)}\n${b}]`
                        : `[${p.join(",")}]`
                      : "[]";
                  } else
                    k(r || a, function (e) {
                      const t = S(e, a, n, r, i, o, s);
                      t !== h && p.push(`${P(e)}:${i ? " " : ""}${t}`);
                    }),
                      (w = p.length
                        ? i
                          ? `{\n${o}${p.join(`,\n${o}`)}\n${b}}`
                          : `{${p.join(",")}}`
                        : "{}");
                  return s.pop(), w;
                }
              };
              t.stringify = function (e, t, r) {
                let i;
                let o;
                let s;
                let a;
                if (n[typeof t] && t)
                  if ((a = g.call(t)) == "[object Function]") o = t;
                  else if (a == "[object Array]") {
                    s = {};
                    for (var c, u = 0, l = t.length; u < l; )
                      (c = t[u++]),
                        ((a = g.call(c)) != "[object String]" &&
                          a != "[object Number]") ||
                          (s[c] = 1);
                  }
                if (r)
                  if ((a = g.call(r)) == "[object Number]") {
                    if ((r -= r % 1) > 0)
                      for (r > 10 && (r = 10), i = ""; i.length < r; ) i += " ";
                  } else
                    a == "[object String]" &&
                      (i = r.length <= 10 ? r : r.slice(0, 10));
                return S("", (((c = {})[""] = e), c), o, s, i, "", []);
              };
            }
          }
          if (!b("json-parse")) {
            let x;
            let R;
            const j = o.fromCharCode;
            const L = {
              92: "\\",
              34: '"',
              47: "/",
              98: "\b",
              116: "\t",
              110: "\n",
              102: "\f",
              114: "\r",
            };
            const D = function () {
              throw ((x = R = null), u());
            };
            const M = function () {
              for (var e, t, n, r, i, o = R, s = o.length; x < s; )
                switch ((i = o.charCodeAt(x))) {
                  case 9:
                  case 10:
                  case 13:
                  case 32:
                    x++;
                    break;
                  case 123:
                  case 125:
                  case 91:
                  case 93:
                  case 58:
                  case 44:
                    return (e = w ? o.charAt(x) : o[x]), x++, e;
                  case 34:
                    for (e = "@", x++; x < s; )
                      if ((i = o.charCodeAt(x)) < 32) D();
                      else if (i == 92)
                        switch ((i = o.charCodeAt(++x))) {
                          case 92:
                          case 34:
                          case 47:
                          case 98:
                          case 116:
                          case 110:
                          case 102:
                          case 114:
                            (e += L[i]), x++;
                            break;
                          case 117:
                            for (t = ++x, n = x + 4; x < n; x++)
                              ((i = o.charCodeAt(x)) >= 48 && i <= 57) ||
                                (i >= 97 && i <= 102) ||
                                (i >= 65 && i <= 70) ||
                                D();
                            e += j(`0x${o.slice(t, x)}`);
                            break;
                          default:
                            D();
                        }
                      else {
                        if (i == 34) break;
                        for (
                          i = o.charCodeAt(x), t = x;
                          i >= 32 && i != 92 && i != 34;

                        )
                          i = o.charCodeAt(++x);
                        e += o.slice(t, x);
                      }
                    if (o.charCodeAt(x) == 34) return x++, e;
                    D();
                  default:
                    if (
                      ((t = x),
                      i == 45 && ((r = !0), (i = o.charCodeAt(++x))),
                      i >= 48 && i <= 57)
                    ) {
                      for (
                        i == 48 &&
                          (i = o.charCodeAt(x + 1)) >= 48 &&
                          i <= 57 &&
                          D(),
                          r = !1;
                        x < s && (i = o.charCodeAt(x)) >= 48 && i <= 57;
                        x++
                      );
                      if (o.charCodeAt(x) == 46) {
                        for (
                          n = ++x;
                          n < s && !((i = o.charCodeAt(n)) < 48 || i > 57);
                          n++
                        );
                        n == x && D(), (x = n);
                      }
                      if ((i = o.charCodeAt(x)) == 101 || i == 69) {
                        for (
                          ((i = o.charCodeAt(++x)) != 43 && i != 45) || x++,
                            n = x;
                          n < s && !((i = o.charCodeAt(n)) < 48 || i > 57);
                          n++
                        );
                        n == x && D(), (x = n);
                      }
                      return +o.slice(t, x);
                    }
                    r && D();
                    var a = o.slice(x, x + 4);
                    if (a == "true") return (x += 4), !0;
                    if (a == "fals" && o.charCodeAt(x + 4) == 101)
                      return (x += 5), !1;
                    if (a == "null") return (x += 4), null;
                    D();
                }
              return "$";
            };
            var U = function (e) {
              let t;
              let n;
              if ((e == "$" && D(), typeof e === "string")) {
                if ((w ? e.charAt(0) : e[0]) == "@") return e.slice(1);
                if (e == "[") {
                  for (t = []; (e = M()) != "]"; )
                    n ? (e == "," ? (e = M()) == "]" && D() : D()) : (n = !0),
                      e == "," && D(),
                      t.push(U(e));
                  return t;
                }
                if (e == "{") {
                  for (t = {}; (e = M()) != "}"; )
                    n ? (e == "," ? (e = M()) == "}" && D() : D()) : (n = !0),
                      (e != "," &&
                        typeof e === "string" &&
                        (w ? e.charAt(0) : e[0]) == "@" &&
                        M() == ":") ||
                        D(),
                      (t[e.slice(1)] = U(M()));
                  return t;
                }
                D();
              }
              return e;
            };
            const N = function (e, t, n) {
              const r = q(e, t, n);
              r === h ? delete e[t] : (e[t] = r);
            };
            var q = function (e, t, n) {
              let r;
              const i = e[t];
              if (typeof i === "object" && i)
                if (g.call(i) == "[object Array]")
                  for (r = i.length; r--; ) N(g, k, i);
                else
                  k(i, function (e) {
                    N(i, e, n);
                  });
              return n.call(e, t, i);
            };
            t.parse = function (e, t) {
              let n;
              let r;
              return (
                (x = 0),
                (R = `${e}`),
                (n = U(M())),
                M() != "$" && D(),
                (x = R = null),
                t && g.call(t) == "[object Function]"
                  ? q((((r = {})[""] = n), r), "", t)
                  : n
              );
            };
          }
        }
        return (t.runInContext = s), t;
      }
      if (
        (!o || (o.global !== o && o.window !== o && o.self !== o) || (i = o), r)
      )
        s(i, r);
      else {
        let a = i.JSON;
        let c = i.JSON3;
        let l = !1;
        var d = s(
          i,
          (i.JSON3 = {
            noConflict() {
              return (
                l || ((l = !0), (i.JSON = a), (i.JSON3 = c), (a = c = null)), d
              );
            },
          })
        );
        i.JSON = { parse: d.parse, stringify: d.stringify };
      }
    }.call(u));
  });
  const _t = l(function (e, t) {
    function n(e) {
      switch (e) {
        case "http:":
          return 80;
        case "https:":
          return 443;
        default:
          return location.port;
      }
    }
    (t.parse = function (e) {
      const t = document.createElement("a");
      return (
        (t.href = e),
        {
          href: t.href,
          host: t.host || location.host,
          port: t.port === "0" || t.port === "" ? n(t.protocol) : t.port,
          hash: t.hash,
          hostname: t.hostname || location.hostname,
          pathname: t.pathname.charAt(0) != "/" ? `/${t.pathname}` : t.pathname,
          protocol:
            t.protocol && t.protocol != ":" ? t.protocol : location.protocol,
          search: t.search,
          query: t.search.slice(1),
        }
      );
    }),
      (t.isAbsolute = function (e) {
        return e.indexOf("//") == 0 || !!~e.indexOf("://");
      }),
      (t.isRelative = function (e) {
        return !t.isAbsolute(e);
      }),
      (t.isCrossDomain = function (e) {
        e = t.parse(e);
        const n = t.parse(window.location.href);
        return (
          e.hostname !== n.hostname ||
          e.port !== n.port ||
          e.protocol !== n.protocol
        );
      });
  });
  const At = (_t.parse, _t.isAbsolute, _t.isRelative, _t.isCrossDomain, 1e3);
  const Ct = 60 * At;
  const Tt = 60 * Ct;
  const Ot = 24 * Tt;
  const Pt = 365.25 * Ot;
  const St = function (e, t) {
    return (
      (t = t || {}),
      typeof e === "string"
        ? (function (e) {
            if ((e = `${e}`).length > 1e4) return;
            const t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
              e
            );
            if (!t) return;
            const n = parseFloat(t[1]);
            switch ((t[2] || "ms").toLowerCase()) {
              case "years":
              case "year":
              case "yrs":
              case "yr":
              case "y":
                return n * Pt;
              case "days":
              case "day":
              case "d":
                return n * Ot;
              case "hours":
              case "hour":
              case "hrs":
              case "hr":
              case "h":
                return n * Tt;
              case "minutes":
              case "minute":
              case "mins":
              case "min":
              case "m":
                return n * Ct;
              case "seconds":
              case "second":
              case "secs":
              case "sec":
              case "s":
                return n * At;
              case "milliseconds":
              case "millisecond":
              case "msecs":
              case "msec":
              case "ms":
                return n;
            }
          })(e)
        : t.long
        ? (function (e) {
            return (
              xt(e, Ot, "day") ||
              xt(e, Tt, "hour") ||
              xt(e, Ct, "minute") ||
              xt(e, At, "second") ||
              `${e} ms`
            );
          })(e)
        : (function (e) {
            return e >= Ot
              ? `${Math.round(e / Ot)}d`
              : e >= Tt
              ? `${Math.round(e / Tt)}h`
              : e >= Ct
              ? `${Math.round(e / Ct)}m`
              : e >= At
              ? `${Math.round(e / At)}s`
              : `${e}ms`;
          })(e)
    );
  };
  function xt(e, t, n) {
    if (!(e < t))
      return e < 1.5 * t
        ? `${Math.floor(e / t)} ${n}`
        : `${Math.ceil(e / t)} ${n}s`;
  }
  const Rt = l(function (e, t) {
    ((t = e.exports = function (e) {
      function i() {}
      function o() {
        const e = o;
        const i = +new Date();
        const s = i - (n || i);
        (e.diff = s),
          (e.prev = n),
          (e.curr = i),
          (n = i),
          e.useColors == null && (e.useColors = t.useColors()),
          e.color == null &&
            e.useColors &&
            (e.color = t.colors[r++ % t.colors.length]);
        let a = Array.prototype.slice.call(arguments);
        (a[0] = t.coerce(a[0])),
          typeof a[0] !== "string" && (a = ["%o"].concat(a));
        let c = 0;
        (a[0] = a[0].replace(/%([a-z%])/g, function (n, r) {
          if (n === "%%") return n;
          c++;
          const i = t.formatters[r];
          if (typeof i === "function") {
            const o = a[c];
            (n = i.call(e, o)), a.splice(c, 1), c--;
          }
          return n;
        })),
          typeof t.formatArgs === "function" && (a = t.formatArgs.apply(e, a)),
          (o.log || t.log || console.log.bind(console)).apply(e, a);
      }
      (i.enabled = !1), (o.enabled = !0);
      const s = t.enabled(e) ? o : i;
      return (s.namespace = e), s;
    }).coerce = function (e) {
      return e instanceof Error ? e.stack || e.message : e;
    }),
      (t.disable = function () {
        t.enable("");
      }),
      (t.enable = function (e) {
        t.save(e);
        for (let n = (e || "").split(/[\s,]+/), r = n.length, i = 0; i < r; i++)
          n[i] &&
            ((e = n[i].replace(/\*/g, ".*?"))[0] === "-"
              ? t.skips.push(new RegExp(`^${e.substr(1)}$`))
              : t.names.push(new RegExp(`^${e}$`)));
      }),
      (t.enabled = function (e) {
        let n;
        let r;
        for (n = 0, r = t.skips.length; n < r; n++)
          if (t.skips[n].test(e)) return !1;
        for (n = 0, r = t.names.length; n < r; n++)
          if (t.names[n].test(e)) return !0;
        return !1;
      }),
      (t.humanize = St),
      (t.names = []),
      (t.skips = []),
      (t.formatters = {});
    let n;
    var r = 0;
  });
  const jt =
    (Rt.coerce,
    Rt.disable,
    Rt.enable,
    Rt.enabled,
    Rt.humanize,
    Rt.names,
    Rt.skips,
    Rt.formatters,
    l(function (e, t) {
      function n() {
        let e;
        try {
          e = t.storage.debug;
        } catch (e) {}
        return e;
      }
      ((t = e.exports = Rt).log = function () {
        return (
          typeof console === "object" &&
          console.log &&
          Function.prototype.apply.call(console.log, console, arguments)
        );
      }),
        (t.formatArgs = function () {
          let e = arguments;
          const n = this.useColors;
          if (
            ((e[0] = `${
              (n ? "%c" : "") +
              this.namespace +
              (n ? " %c" : " ") +
              e[0] +
              (n ? "%c " : " ")
            }+${t.humanize(this.diff)}`),
            !n)
          )
            return e;
          const r = `color: ${this.color}`;
          e = [e[0], r, "color: inherit"].concat(
            Array.prototype.slice.call(e, 1)
          );
          let i = 0;
          let o = 0;
          return (
            e[0].replace(/%[a-z%]/g, function (e) {
              e !== "%%" && (i++, e === "%c" && (o = i));
            }),
            e.splice(o, 0, r),
            e
          );
        }),
        (t.save = function (e) {
          try {
            e == null ? t.storage.removeItem("debug") : (t.storage.debug = e);
          } catch (e) {}
        }),
        (t.load = n),
        (t.useColors = function () {
          return (
            "WebkitAppearance" in document.documentElement.style ||
            (window.console &&
              (console.firebug || (console.exception && console.table))) ||
            (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
              parseInt(RegExp.$1, 10) >= 31)
          );
        }),
        (t.storage =
          typeof chrome !== "undefined" && void 0 !== chrome.storage
            ? chrome.storage.local
            : (function () {
                try {
                  return window.localStorage;
                } catch (e) {}
              })()),
        (t.colors = [
          "lightseagreen",
          "forestgreen",
          "goldenrod",
          "dodgerblue",
          "darkorchid",
          "crimson",
        ]),
        (t.formatters.j = function (e) {
          return JSON.stringify(e);
        }),
        t.enable(n());
    }));
  const Lt =
    (jt.log,
    jt.formatArgs,
    jt.save,
    jt.load,
    jt.useColors,
    jt.storage,
    jt.colors,
    jt("cookie"));
  const Dt = function (e, t, n) {
    switch (arguments.length) {
      case 3:
      case 2:
        return Mt(e, t, n);
      case 1:
        return Nt(e);
      default:
        return Ut();
    }
  };
  function Mt(e, t, n) {
    n = n || {};
    let r = `${qt(e)}=${qt(t)}`;
    t == null && (n.maxage = -1),
      n.maxage && (n.expires = new Date(+new Date() + n.maxage)),
      n.path && (r += `; path=${n.path}`),
      n.domain && (r += `; domain=${n.domain}`),
      n.expires && (r += `; expires=${n.expires.toUTCString()}`),
      n.secure && (r += "; secure"),
      (document.cookie = r);
  }
  function Ut() {
    let e;
    try {
      e = document.cookie;
    } catch (e) {
      return (
        typeof console !== "undefined" &&
          typeof console.error === "function" &&
          console.error(e.stack || e),
        {}
      );
    }
    return (function (e) {
      let t;
      const n = {};
      const r = e.split(/ *; */);
      if (r[0] == "") return n;
      for (let i = 0; i < r.length; ++i)
        (t = r[i].split("=")), (n[Bt(t[0])] = Bt(t[1]));
      return n;
    })(e);
  }
  function Nt(e) {
    return Ut()[e];
  }
  function qt(e) {
    try {
      return encodeURIComponent(e);
    } catch (t) {
      Lt("error `encode(%o)` - %o", e, t);
    }
  }
  function Bt(e) {
    try {
      return decodeURIComponent(e);
    } catch (t) {
      Lt("error `decode(%o)` - %o", e, t);
    }
  }
  for (
    var Ft = l(function (e, t) {
        const n = _t.parse;
        function r(e) {
          for (let n = t.cookie, r = t.levels(e), i = 0; i < r.length; ++i) {
            const o = r[i];
            const s = { domain: `.${o}` };
            if ((n("__tld__", 1, s), n("__tld__")))
              return n("__tld__", null, s), o;
          }
          return "";
        }
        (r.levels = function (e) {
          const t = n(e).hostname.split(".");
          const r = t[t.length - 1];
          const i = [];
          if (t.length === 4 && r === parseInt(r, 10)) return i;
          if (t.length <= 1) return i;
          for (let o = t.length - 2; o >= 0; --o) i.push(t.slice(o).join("."));
          return i;
        }),
          (r.cookie = Dt),
          (t = e.exports = r);
      }),
      Gt = new ((function () {
        function e(t) {
          n(this, e), (this._options = {}), this.options(t);
        }
        return (
          i(e, [
            {
              key: "options",
              value() {
                const e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : {};
                if (arguments.length === 0) return this._options;
                let t = `.${Ft(window.location.href)}`;
                t === "." && (t = null),
                  (this._options = ve(e, {
                    maxage: 31536e6,
                    path: "/",
                    domain: t,
                    samesite: "Lax",
                  })),
                  this.set("test_rudder", !0),
                  this.get("test_rudder") || (this._options.domain = null),
                  this.remove("test_rudder");
              },
            },
            {
              key: "set",
              value(e, t) {
                try {
                  return (t = It.stringify(t)), yt(e, t, st(this._options)), !0;
                } catch (e) {
                  return !1;
                }
              },
            },
            {
              key: "get",
              value(e) {
                let t;
                try {
                  return (t = (t = yt(e)) ? It.parse(t) : null);
                } catch (e) {
                  return t || null;
                }
              },
            },
            {
              key: "remove",
              value(e) {
                try {
                  return yt(e, null, st(this._options)), !0;
                } catch (e) {
                  return !1;
                }
              },
            },
          ]),
          e
        );
      })())({}),
      Kt = (function () {
        let e;
        const t = {};
        const n = typeof window !== "undefined" ? window : u;
        const r = n.document;
        const i = "localStorage";
        if (
          ((t.disabled = !1),
          (t.version = "1.3.20"),
          (t.set = function (e, t) {}),
          (t.get = function (e, t) {}),
          (t.has = function (e) {
            return void 0 !== t.get(e);
          }),
          (t.remove = function (e) {}),
          (t.clear = function () {}),
          (t.transact = function (e, n, r) {
            r == null && ((r = n), (n = null)), n == null && (n = {});
            const i = t.get(e, n);
            r(i), t.set(e, i);
          }),
          (t.getAll = function () {
            const e = {};
            return (
              t.forEach(function (t, n) {
                e[t] = n;
              }),
              e
            );
          }),
          (t.forEach = function () {}),
          (t.serialize = function (e) {
            return It.stringify(e);
          }),
          (t.deserialize = function (e) {
            if (typeof e === "string")
              try {
                return It.parse(e);
              } catch (t) {
                return e || void 0;
              }
          }),
          (function () {
            try {
              return (i in n) && n[i];
            } catch (e) {
              return !1;
            }
          })())
        )
          (e = n[i]),
            (t.set = function (n, r) {
              return void 0 === r
                ? t.remove(n)
                : (e.setItem(n, t.serialize(r)), r);
            }),
            (t.get = function (n, r) {
              const i = t.deserialize(e.getItem(n));
              return void 0 === i ? r : i;
            }),
            (t.remove = function (t) {
              e.removeItem(t);
            }),
            (t.clear = function () {
              e.clear();
            }),
            (t.forEach = function (n) {
              for (let r = 0; r < e.length; r++) {
                const i = e.key(r);
                n(i, t.get(i));
              }
            });
        else if (r && r.documentElement.addBehavior) {
          let o;
          let s;
          try {
            (s = new ActiveXObject("htmlfile")).open(),
              s.write(
                '<script>document.w=window</script><iframe src="/favicon.ico"></iframe>'
              ),
              s.close(),
              (o = s.w.frames[0].document),
              (e = o.createElement("div"));
          } catch (t) {
            (e = r.createElement("div")), (o = r.body);
          }
          const a = function (n) {
            return function () {
              const r = Array.prototype.slice.call(arguments, 0);
              r.unshift(e),
                o.appendChild(e),
                e.addBehavior("#default#userData"),
                e.load(i);
              const s = n.apply(t, r);
              return o.removeChild(e), s;
            };
          };
          const c = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
          const l = function (e) {
            return e.replace(/^d/, "___$&").replace(c, "___");
          };
          (t.set = a(function (e, n, r) {
            return (
              (n = l(n)),
              void 0 === r
                ? t.remove(n)
                : (e.setAttribute(n, t.serialize(r)), e.save(i), r)
            );
          })),
            (t.get = a(function (e, n, r) {
              n = l(n);
              const i = t.deserialize(e.getAttribute(n));
              return void 0 === i ? r : i;
            })),
            (t.remove = a(function (e, t) {
              (t = l(t)), e.removeAttribute(t), e.save(i);
            })),
            (t.clear = a(function (e) {
              const t = e.XMLDocument.documentElement.attributes;
              e.load(i);
              for (let n = t.length - 1; n >= 0; n--)
                e.removeAttribute(t[n].name);
              e.save(i);
            })),
            (t.forEach = a(function (e, n) {
              for (
                var r, i = e.XMLDocument.documentElement.attributes, o = 0;
                (r = i[o]);
                ++o
              )
                n(r.name, t.deserialize(e.getAttribute(r.name)));
            }));
        }
        try {
          const d = "__storejs__";
          t.set(d, d), t.get(d) != d && (t.disabled = !0), t.remove(d);
        } catch (e) {
          t.disabled = !0;
        }
        return (t.enabled = !t.disabled), t;
      })(),
      Vt = new ((function () {
        function e(t) {
          n(this, e),
            (this._options = {}),
            (this.enabled = !1),
            this.options(t);
        }
        return (
          i(e, [
            {
              key: "options",
              value() {
                const e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : {};
                if (arguments.length === 0) return this._options;
                ve(e, { enabled: !0 }),
                  (this.enabled = e.enabled && Kt.enabled),
                  (this._options = e);
              },
            },
            {
              key: "set",
              value(e, t) {
                return !!this.enabled && Kt.set(e, t);
              },
            },
            {
              key: "get",
              value(e) {
                return this.enabled ? Kt.get(e) : null;
              },
            },
            {
              key: "remove",
              value(e) {
                return !!this.enabled && Kt.remove(e);
              },
            },
          ]),
          e
        );
      })())({}),
      Ht = "rl_user_id",
      zt = "rl_trait",
      Jt = "rl_anonymous_id",
      Wt = "rl_group_id",
      $t = "rl_group_trait",
      Yt = new ((function () {
        function e() {
          if (
            (n(this, e), Gt.set("rudder_cookies", !0), Gt.get("rudder_cookies"))
          )
            return Gt.remove("rudder_cookies"), void (this.storage = Gt);
          Vt.enabled && (this.storage = Vt);
        }
        return (
          i(e, [
            {
              key: "setItem",
              value(e, t) {
                this.storage.set(e, t);
              },
            },
            {
              key: "setUserId",
              value(e) {
                typeof e === "string"
                  ? this.storage.set(Ht, e)
                  : g.error("[Storage] setUserId:: userId should be string");
              },
            },
            {
              key: "setUserTraits",
              value(e) {
                this.storage.set(zt, e);
              },
            },
            {
              key: "setGroupId",
              value(e) {
                typeof e === "string"
                  ? this.storage.set(Wt, e)
                  : g.error("[Storage] setGroupId:: groupId should be string");
              },
            },
            {
              key: "setGroupTraits",
              value(e) {
                this.storage.set($t, e);
              },
            },
            {
              key: "setAnonymousId",
              value(e) {
                typeof e === "string"
                  ? this.storage.set(Jt, e)
                  : g.error(
                      "[Storage] setAnonymousId:: anonymousId should be string"
                    );
              },
            },
            {
              key: "getItem",
              value(e) {
                return this.storage.get(e);
              },
            },
            {
              key: "getUserId",
              value() {
                return this.storage.get(Ht);
              },
            },
            {
              key: "getUserTraits",
              value() {
                return this.storage.get(zt);
              },
            },
            {
              key: "getGroupId",
              value() {
                return this.storage.get(Wt);
              },
            },
            {
              key: "getGroupTraits",
              value() {
                return this.storage.get($t);
              },
            },
            {
              key: "getAnonymousId",
              value() {
                return this.storage.get(Jt);
              },
            },
            {
              key: "removeItem",
              value(e) {
                return this.storage.remove(e);
              },
            },
            {
              key: "clear",
              value() {
                this.storage.remove(Ht), this.storage.remove(zt);
              },
            },
          ]),
          e
        );
      })())(),
      Qt = "lt_synch_timestamp",
      Zt = new ((function () {
        function e() {
          n(this, e), (this.storage = Yt);
        }
        return (
          i(e, [
            {
              key: "setLotameSynchTime",
              value(e) {
                this.storage.setItem(Qt, e);
              },
            },
            {
              key: "getLotameSynchTime",
              value() {
                return this.storage.getItem(Qt);
              },
            },
          ]),
          e
        );
      })())(),
      Xt = {
        HS: U,
        GA: we,
        HOTJAR: ke,
        GOOGLEADS: Ee,
        VWO: Ie,
        GTM: _e,
        BRAZE: Ae,
        INTERCOM: Re,
        KEEN: je,
        KISSMETRICS: Ue,
        CUSTOMERIO: Ne,
        CHARTBEAT: Ke,
        COMSCORE: Ve,
        FACEBOOK_PIXEL: it,
        LOTAME: (function () {
          function e(t, r) {
            const i = this;
            n(this, e),
              (this.name = "LOTAME"),
              (this.analytics = r),
              (this.storage = Zt),
              (this.bcpUrlSettingsPixel = t.bcpUrlSettingsPixel),
              (this.bcpUrlSettingsIframe = t.bcpUrlSettingsIframe),
              (this.dspUrlSettingsPixel = t.dspUrlSettingsPixel),
              (this.dspUrlSettingsIframe = t.dspUrlSettingsIframe),
              (this.mappings = {}),
              t.mappings.forEach(function (e) {
                const t = e.key;
                const n = e.value;
                i.mappings[t] = n;
              });
          }
          return (
            i(e, [
              {
                key: "init",
                value() {
                  g.debug("===in init Lotame==="),
                    (window.LOTAME_SYNCH_CALLBACK = function () {});
                },
              },
              {
                key: "addPixel",
                value(e, t, n) {
                  g.debug(`Adding pixel for :: ${e}`);
                  const r = document.createElement("img");
                  (r.src = e),
                    r.setAttribute("width", t),
                    r.setAttribute("height", n),
                    g.debug(`Image Pixel :: ${r}`),
                    document.getElementsByTagName("body")[0].appendChild(r);
                },
              },
              {
                key: "addIFrame",
                value(e) {
                  g.debug(`Adding iframe for :: ${e}`);
                  const t = document.createElement("iframe");
                  (t.src = e),
                    (t.title = "empty"),
                    t.setAttribute("id", "LOTCCFrame"),
                    t.setAttribute("tabindex", "-1"),
                    t.setAttribute("role", "presentation"),
                    t.setAttribute("aria-hidden", "true"),
                    t.setAttribute(
                      "style",
                      "border: 0px; width: 0px; height: 0px; display: block;"
                    ),
                    g.debug(`IFrame :: ${t}`),
                    document.getElementsByTagName("body")[0].appendChild(t);
                },
              },
              {
                key: "syncPixel",
                value(e) {
                  const t = this;
                  if (
                    (g.debug("===== in syncPixel ======"),
                    g.debug("Firing DSP Pixel URLs"),
                    this.dspUrlSettingsPixel &&
                      this.dspUrlSettingsPixel.length > 0)
                  ) {
                    const n = Date.now();
                    this.dspUrlSettingsPixel.forEach(function (r) {
                      const i = t.compileUrl(
                        a({}, t.mappings, { userId: e, random: n }),
                        r.dspUrlTemplate
                      );
                      t.addPixel(i, "1", "1");
                    });
                  }
                  if (
                    (g.debug("Firing DSP IFrame URLs"),
                    this.dspUrlSettingsIframe &&
                      this.dspUrlSettingsIframe.length > 0)
                  ) {
                    const r = Date.now();
                    this.dspUrlSettingsIframe.forEach(function (n) {
                      const i = t.compileUrl(
                        a({}, t.mappings, { userId: e, random: r }),
                        n.dspUrlTemplate
                      );
                      t.addIFrame(i);
                    });
                  }
                  this.storage.setLotameSynchTime(Date.now()),
                    this.analytics.methodToCallbackMapping.syncPixel &&
                      this.analytics.emit("syncPixel", {
                        destination: this.name,
                      });
                },
              },
              {
                key: "compileUrl",
                value(e, t) {
                  return (
                    Object.keys(e).forEach(function (n) {
                      if (e.hasOwnProperty(n)) {
                        const r = new RegExp(`{{${n}}}`, "gi");
                        t = t.replace(r, e[n]);
                      }
                    }),
                    t
                  );
                },
              },
              {
                key: "identify",
                value(e) {
                  g.debug("in Lotame identify");
                  const t = e.message.userId;
                  this.syncPixel(t);
                },
              },
              {
                key: "track",
                value(e) {
                  g.debug("track not supported for lotame");
                },
              },
              {
                key: "page",
                value(e) {
                  const t = this;
                  if (
                    (g.debug("in Lotame page"),
                    g.debug("Firing BCP Pixel URLs"),
                    this.bcpUrlSettingsPixel &&
                      this.bcpUrlSettingsPixel.length > 0)
                  ) {
                    const n = Date.now();
                    this.bcpUrlSettingsPixel.forEach(function (e) {
                      const r = t.compileUrl(
                        a({}, t.mappings, { random: n }),
                        e.bcpUrlTemplate
                      );
                      t.addPixel(r, "1", "1");
                    });
                  }
                  if (
                    (g.debug("Firing BCP IFrame URLs"),
                    this.bcpUrlSettingsIframe &&
                      this.bcpUrlSettingsIframe.length > 0)
                  ) {
                    const r = Date.now();
                    this.bcpUrlSettingsIframe.forEach(function (e) {
                      const n = t.compileUrl(
                        a({}, t.mappings, { random: r }),
                        e.bcpUrlTemplate
                      );
                      t.addIFrame(n);
                    });
                  }
                  e.message.userId &&
                    this.isPixelToBeSynched() &&
                    this.syncPixel(e.message.userId);
                },
              },
              {
                key: "isPixelToBeSynched",
                value() {
                  const e = this.storage.getLotameSynchTime();
                  const t = Date.now();
                  return !e || Math.floor((t - e) / 864e5) >= 7;
                },
              },
              {
                key: "isLoaded",
                value() {
                  return g.debug("in Lotame isLoaded"), !0;
                },
              },
              {
                key: "isReady",
                value() {
                  return !0;
                },
              },
            ]),
            e
          );
        })(),
      },
      en = function e() {
        n(this, e),
          (this.build = "1.0.0"),
          (this.name = "RudderLabs JavaScript SDK"),
          (this.namespace = "com.rudderlabs.javascript"),
          (this.version = "1.1.2");
      },
      tn = function e() {
        n(this, e),
          (this.name = "RudderLabs JavaScript SDK"),
          (this.version = "1.1.2");
      },
      nn = function e() {
        n(this, e), (this.name = ""), (this.version = "");
      },
      rn = function e() {
        n(this, e), (this.density = 0), (this.width = 0), (this.height = 0);
      },
      on = function e() {
        n(this, e),
          (this.app = new en()),
          (this.traits = null),
          (this.library = new tn());
        const t = new nn();
        t.version = "";
        const r = new rn();
        (r.width = window.width),
          (r.height = window.height),
          (r.density = window.devicePixelRatio),
          (this.userAgent = navigator.userAgent),
          (this.locale = navigator.language || navigator.browserLanguage),
          (this.os = t),
          (this.screen = r),
          (this.device = null),
          (this.network = null);
      },
      sn = (function () {
        function e() {
          n(this, e),
            (this.channel = "web"),
            (this.context = new on()),
            (this.type = null),
            (this.action = null),
            (this.messageId = b().toString()),
            (this.originalTimestamp = new Date().toISOString()),
            (this.anonymousId = null),
            (this.userId = null),
            (this.event = null),
            (this.properties = {}),
            (this.integrations = {}),
            (this.integrations.All = !0);
        }
        return (
          i(e, [
            {
              key: "getProperty",
              value(e) {
                return this.properties[e];
              },
            },
            {
              key: "addProperty",
              value(e, t) {
                this.properties[e] = t;
              },
            },
            {
              key: "validateFor",
              value(e) {
                if (!this.properties)
                  throw new Error("Key properties is required");
                switch (e) {
                  case x.TRACK:
                    if (!this.event)
                      throw new Error("Key event is required for track event");
                    if ((this.event in Object.values(R)))
                      switch (this.event) {
                        case R.CHECKOUT_STEP_VIEWED:
                        case R.CHECKOUT_STEP_COMPLETED:
                        case R.PAYMENT_INFO_ENTERED:
                          this.checkForKey("checkout_id"),
                            this.checkForKey("step");
                          break;
                        case R.PROMOTION_VIEWED:
                        case R.PROMOTION_CLICKED:
                          this.checkForKey("promotion_id");
                          break;
                        case R.ORDER_REFUNDED:
                          this.checkForKey("order_id");
                      }
                    else
                      this.properties.category ||
                        (this.properties.category = this.event);
                    break;
                  case x.PAGE:
                    break;
                  case x.SCREEN:
                    if (!this.properties.name)
                      throw new Error("Key 'name' is required in properties");
                }
              },
            },
            {
              key: "checkForKey",
              value(e) {
                if (!this.properties[e])
                  throw new Error(`Key '${e}' is required in properties`);
              },
            },
          ]),
          e
        );
      })(),
      an = (function () {
        function e() {
          n(this, e), (this.message = new sn());
        }
        return (
          i(e, [
            {
              key: "setType",
              value(e) {
                this.message.type = e;
              },
            },
            {
              key: "setProperty",
              value(e) {
                this.message.properties = e;
              },
            },
            {
              key: "setUserProperty",
              value(e) {
                this.message.user_properties = e;
              },
            },
            {
              key: "setUserId",
              value(e) {
                this.message.userId = e;
              },
            },
            {
              key: "setEventName",
              value(e) {
                this.message.event = e;
              },
            },
            {
              key: "updateTraits",
              value(e) {
                this.message.context.traits = e;
              },
            },
            {
              key: "getElementContent",
              value() {
                return this.message;
              },
            },
          ]),
          e
        );
      })(),
      cn = (function () {
        function e() {
          n(this, e),
            (this.rudderProperty = null),
            (this.rudderUserProperty = null),
            (this.event = null),
            (this.userId = null),
            (this.channel = null),
            (this.type = null);
        }
        return (
          i(e, [
            {
              key: "setProperty",
              value(e) {
                return (this.rudderProperty = e), this;
              },
            },
            {
              key: "setPropertyBuilder",
              value(e) {
                return (this.rudderProperty = e.build()), this;
              },
            },
            {
              key: "setUserProperty",
              value(e) {
                return (this.rudderUserProperty = e), this;
              },
            },
            {
              key: "setUserPropertyBuilder",
              value(e) {
                return (this.rudderUserProperty = e.build()), this;
              },
            },
            {
              key: "setEvent",
              value(e) {
                return (this.event = e), this;
              },
            },
            {
              key: "setUserId",
              value(e) {
                return (this.userId = e), this;
              },
            },
            {
              key: "setChannel",
              value(e) {
                return (this.channel = e), this;
              },
            },
            {
              key: "setType",
              value(e) {
                return (this.type = e), this;
              },
            },
            {
              key: "build",
              value() {
                const e = new an();
                return (
                  e.setUserId(this.userId),
                  e.setType(this.type),
                  e.setEventName(this.event),
                  e.setProperty(this.rudderProperty),
                  e.setUserProperty(this.rudderUserProperty),
                  e
                );
              },
            },
          ]),
          e
        );
      })(),
      un = function e() {
        n(this, e), (this.batch = null), (this.writeKey = null);
      },
      ln = l(function (e) {
        const t =
          (typeof crypto !== "undefined" &&
            crypto.getRandomValues &&
            crypto.getRandomValues.bind(crypto)) ||
          (typeof msCrypto !== "undefined" &&
            typeof window.msCrypto.getRandomValues === "function" &&
            msCrypto.getRandomValues.bind(msCrypto));
        if (t) {
          const n = new Uint8Array(16);
          e.exports = function () {
            return t(n), n;
          };
        } else {
          const r = new Array(16);
          e.exports = function () {
            for (var e, t = 0; t < 16; t++)
              (3 & t) == 0 && (e = 4294967296 * Math.random()),
                (r[t] = (e >>> ((3 & t) << 3)) & 255);
            return r;
          };
        }
      }),
      dn = [],
      pn = 0;
    pn < 256;
    ++pn
  )
    dn[pn] = (pn + 256).toString(16).substr(1);
  let hn;
  let fn;
  const gn = function (e, t) {
    let n = t || 0;
    const r = dn;
    return [
      r[e[n++]],
      r[e[n++]],
      r[e[n++]],
      r[e[n++]],
      "-",
      r[e[n++]],
      r[e[n++]],
      "-",
      r[e[n++]],
      r[e[n++]],
      "-",
      r[e[n++]],
      r[e[n++]],
      "-",
      r[e[n++]],
      r[e[n++]],
      r[e[n++]],
      r[e[n++]],
      r[e[n++]],
      r[e[n++]],
    ].join("");
  };
  let mn = 0;
  let yn = 0;
  const vn = function (e, t, n) {
    let r = (t && n) || 0;
    const i = t || [];
    let o = (e = e || {}).node || hn;
    let s = void 0 !== e.clockseq ? e.clockseq : fn;
    if (o == null || s == null) {
      const a = ln();
      o == null && (o = hn = [1 | a[0], a[1], a[2], a[3], a[4], a[5]]),
        s == null && (s = fn = 16383 & ((a[6] << 8) | a[7]));
    }
    let c = void 0 !== e.msecs ? e.msecs : new Date().getTime();
    let u = void 0 !== e.nsecs ? e.nsecs : yn + 1;
    const l = c - mn + (u - yn) / 1e4;
    if (
      (l < 0 && void 0 === e.clockseq && (s = (s + 1) & 16383),
      (l < 0 || c > mn) && void 0 === e.nsecs && (u = 0),
      u >= 1e4)
    )
      throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    (mn = c), (yn = u), (fn = s);
    const d = (1e4 * (268435455 & (c += 122192928e5)) + u) % 4294967296;
    (i[r++] = (d >>> 24) & 255),
      (i[r++] = (d >>> 16) & 255),
      (i[r++] = (d >>> 8) & 255),
      (i[r++] = 255 & d);
    const p = ((c / 4294967296) * 1e4) & 268435455;
    (i[r++] = (p >>> 8) & 255),
      (i[r++] = 255 & p),
      (i[r++] = ((p >>> 24) & 15) | 16),
      (i[r++] = (p >>> 16) & 255),
      (i[r++] = (s >>> 8) | 128),
      (i[r++] = 255 & s);
    for (let h = 0; h < 6; ++h) i[r + h] = o[h];
    return t || gn(i);
  };
  const bn = function (e, t, n) {
    const r = (t && n) || 0;
    typeof e === "string" &&
      ((t = e === "binary" ? new Array(16) : null), (e = null));
    const i = (e = e || {}).random || (e.rng || ln)();
    if (((i[6] = (15 & i[6]) | 64), (i[8] = (63 & i[8]) | 128), t))
      for (let o = 0; o < 16; ++o) t[r + o] = i[o];
    return t || gn(i);
  };
  const wn = bn;
  (wn.v1 = vn), (wn.v4 = bn);
  const kn = wn;
  const En = kn.v4;
  const In = {
    _data: {},
    length: 0,
    setItem(e, t) {
      return (this._data[e] = t), (this.length = Qe(this._data).length), t;
    },
    getItem(e) {
      return e in this._data ? this._data[e] : null;
    },
    removeItem(e) {
      return (
        e in this._data && delete this._data[e],
        (this.length = Qe(this._data).length),
        null
      );
    },
    clear() {
      (this._data = {}), (this.length = 0);
    },
    key(e) {
      return Qe(this._data)[e];
    },
  };
  const _n = {
    defaultEngine: (function () {
      try {
        if (!window.localStorage) return !1;
        const e = En();
        window.localStorage.setItem(e, "test_value");
        const t = window.localStorage.getItem(e);
        return window.localStorage.removeItem(e), t === "test_value";
      } catch (e) {
        return !1;
      }
    })()
      ? window.localStorage
      : In,
    inMemoryEngine: In,
  };
  const An = _n.defaultEngine;
  const Cn = _n.inMemoryEngine;
  function Tn(e, t, n, r) {
    (this.id = t),
      (this.name = e),
      (this.keys = n || {}),
      (this.engine = r || An);
  }
  (Tn.prototype.set = function (e, t) {
    const n = this._createValidKey(e);
    if (n)
      try {
        this.engine.setItem(n, It.stringify(t));
      } catch (n) {
        (function (e) {
          let t = !1;
          if (e.code)
            switch (e.code) {
              case 22:
                t = !0;
                break;
              case 1014:
                e.name === "NS_ERROR_DOM_QUOTA_REACHED" && (t = !0);
            }
          else e.number === -2147024882 && (t = !0);
          return t;
        })(n) && (this._swapEngine(), this.set(e, t));
      }
  }),
    (Tn.prototype.get = function (e) {
      try {
        const t = this.engine.getItem(this._createValidKey(e));
        return t === null ? null : It.parse(t);
      } catch (e) {
        return null;
      }
    }),
    (Tn.prototype.remove = function (e) {
      this.engine.removeItem(this._createValidKey(e));
    }),
    (Tn.prototype._createValidKey = function (e) {
      let t;
      const n = this.name;
      const r = this.id;
      return Qe(this.keys).length
        ? (rt(function (i) {
            i === e && (t = [n, r, e].join("."));
          }, this.keys),
          t)
        : [n, r, e].join(".");
    }),
    (Tn.prototype._swapEngine = function () {
      const e = this;
      rt(function (t) {
        const n = e.get(t);
        Cn.setItem([e.name, e.id, t].join("."), n), e.remove(t);
      }, this.keys),
        (this.engine = Cn);
    });
  const On = Tn;
  const Pn = {
    setTimeout(e, t) {
      return window.setTimeout(e, t);
    },
    clearTimeout(e) {
      return window.clearTimeout(e);
    },
    Date: window.Date,
  };
  let Sn = Pn;
  function xn() {
    (this.tasks = {}), (this.nextId = 1);
  }
  (xn.prototype.now = function () {
    return +new Sn.Date();
  }),
    (xn.prototype.run = function (e, t) {
      const n = this.nextId++;
      return (this.tasks[n] = Sn.setTimeout(this._handle(n, e), t)), n;
    }),
    (xn.prototype.cancel = function (e) {
      this.tasks[e] && (Sn.clearTimeout(this.tasks[e]), delete this.tasks[e]);
    }),
    (xn.prototype.cancelAll = function () {
      rt(Sn.clearTimeout, this.tasks), (this.tasks = {});
    }),
    (xn.prototype._handle = function (e, t) {
      const n = this;
      return function () {
        return delete n.tasks[e], t();
      };
    }),
    (xn.setClock = function (e) {
      Sn = e;
    }),
    (xn.resetClock = function () {
      Sn = Pn;
    });
  const Rn = xn;
  const jn = Ln;
  function Ln(e) {
    return Ln.enabled(e)
      ? function (t) {
          t = Dn(t);
          const n = new Date();
          const r = n - (Ln[e] || n);
          (Ln[e] = n),
            (t = `${e} ${t} +${Ln.humanize(r)}`),
            window.console &&
              console.log &&
              Function.prototype.apply.call(console.log, console, arguments);
        }
      : function () {};
  }
  function Dn(e) {
    return e instanceof Error ? e.stack || e.message : e;
  }
  (Ln.names = []),
    (Ln.skips = []),
    (Ln.enable = function (e) {
      try {
        localStorage.debug = e;
      } catch (e) {}
      for (let t = (e || "").split(/[\s,]+/), n = t.length, r = 0; r < n; r++)
        (e = t[r].replace("*", ".*?"))[0] === "-"
          ? Ln.skips.push(new RegExp(`^${e.substr(1)}$`))
          : Ln.names.push(new RegExp(`^${e}$`));
    }),
    (Ln.disable = function () {
      Ln.enable("");
    }),
    (Ln.humanize = function (e) {
      return e >= 36e5
        ? `${(e / 36e5).toFixed(1)}h`
        : e >= 6e4
        ? `${(e / 6e4).toFixed(1)}m`
        : e >= 1e3
        ? `${(e / 1e3) | 0}s`
        : `${e}ms`;
    }),
    (Ln.enabled = function (e) {
      for (var t = 0, n = Ln.skips.length; t < n; t++)
        if (Ln.skips[t].test(e)) return !1;
      for (t = 0, n = Ln.names.length; t < n; t++)
        if (Ln.names[t].test(e)) return !0;
      return !1;
    });
  try {
    window.localStorage && Ln.enable(localStorage.debug);
  } catch (e) {}
  const Mn = kn.v4;
  const Un = jn("localstorage-retry");
  function Nn(e, t) {
    return function () {
      return e.apply(t, arguments);
    };
  }
  function qn(e, t, n) {
    typeof t === "function" && (n = t),
      (this.name = e),
      (this.id = Mn()),
      (this.fn = n),
      (this.maxItems = t.maxItems || 1 / 0),
      (this.maxAttempts = t.maxAttempts || 1 / 0),
      (this.backoff = {
        MIN_RETRY_DELAY: t.minRetryDelay || 1e3,
        MAX_RETRY_DELAY: t.maxRetryDelay || 3e4,
        FACTOR: t.backoffFactor || 2,
        JITTER: t.backoffJitter || 0,
      }),
      (this.timeouts = {
        ACK_TIMER: 1e3,
        RECLAIM_TIMER: 3e3,
        RECLAIM_TIMEOUT: 1e4,
        RECLAIM_WAIT: 500,
      }),
      (this.keys = {
        IN_PROGRESS: "inProgress",
        QUEUE: "queue",
        ACK: "ack",
        RECLAIM_START: "reclaimStart",
        RECLAIM_END: "reclaimEnd",
      }),
      (this._schedule = new Rn()),
      (this._processId = 0),
      (this._store = new On(this.name, this.id, this.keys)),
      this._store.set(this.keys.IN_PROGRESS, {}),
      this._store.set(this.keys.QUEUE, []),
      (this._ack = Nn(this._ack, this)),
      (this._checkReclaim = Nn(this._checkReclaim, this)),
      (this._processHead = Nn(this._processHead, this)),
      (this._running = !1);
  }
  d(qn.prototype),
    (qn.prototype.start = function () {
      this._running && this.stop(),
        (this._running = !0),
        this._ack(),
        this._checkReclaim(),
        this._processHead();
    }),
    (qn.prototype.stop = function () {
      this._schedule.cancelAll(), (this._running = !1);
    }),
    (qn.prototype.shouldRetry = function (e, t) {
      return !(t > this.maxAttempts);
    }),
    (qn.prototype.getDelay = function (e) {
      let t = this.backoff.MIN_RETRY_DELAY * Math.pow(this.backoff.FACTOR, e);
      if (this.backoff.JITTER) {
        const n = Math.random();
        const r = Math.floor(n * this.backoff.JITTER * t);
        Math.floor(10 * n) < 5 ? (t -= r) : (t += r);
      }
      return Number(Math.min(t, this.backoff.MAX_RETRY_DELAY).toPrecision(1));
    }),
    (qn.prototype.addItem = function (e) {
      this._enqueue({ item: e, attemptNumber: 0, time: this._schedule.now() });
    }),
    (qn.prototype.requeue = function (e, t, n) {
      this.shouldRetry(e, t, n)
        ? this._enqueue({
            item: e,
            attemptNumber: t,
            time: this._schedule.now() + this.getDelay(t),
          })
        : this.emit("discard", e, t);
    }),
    (qn.prototype._enqueue = function (e) {
      let t = this._store.get(this.keys.QUEUE) || [];
      (t = t.slice(-(this.maxItems - 1))).push(e),
        (t = t.sort(function (e, t) {
          return e.time - t.time;
        })),
        this._store.set(this.keys.QUEUE, t),
        this._running && this._processHead();
    }),
    (qn.prototype._processHead = function () {
      const e = this;
      const t = this._store;
      this._schedule.cancel(this._processId);
      let n = t.get(this.keys.QUEUE) || [];
      const r = t.get(this.keys.IN_PROGRESS) || {};
      const i = this._schedule.now();
      const o = [];
      function s(n, r) {
        o.push({
          item: n.item,
          done(i, o) {
            const s = t.get(e.keys.IN_PROGRESS) || {};
            delete s[r],
              t.set(e.keys.IN_PROGRESS, s),
              e.emit("processed", i, o, n.item),
              i && e.requeue(n.item, n.attemptNumber + 1, i);
          },
        });
      }
      for (
        let a = Object.keys(r).length;
        n.length && n[0].time <= i && a++ < e.maxItems;

      ) {
        const c = n.shift();
        const u = Mn();
        (r[u] = {
          item: c.item,
          attemptNumber: c.attemptNumber,
          time: e._schedule.now(),
        }),
          s(c, u);
      }
      t.set(this.keys.QUEUE, n),
        t.set(this.keys.IN_PROGRESS, r),
        rt(function (t) {
          try {
            e.fn(t.item, t.done);
          } catch (e) {
            Un(`Process function threw error: ${e}`);
          }
        }, o),
        (n = t.get(this.keys.QUEUE) || []),
        this._schedule.cancel(this._processId),
        n.length > 0 &&
          (this._processId = this._schedule.run(
            this._processHead,
            n[0].time - i
          ));
    }),
    (qn.prototype._ack = function () {
      this._store.set(this.keys.ACK, this._schedule.now()),
        this._store.set(this.keys.RECLAIM_START, null),
        this._store.set(this.keys.RECLAIM_END, null),
        this._schedule.run(this._ack, this.timeouts.ACK_TIMER);
    }),
    (qn.prototype._checkReclaim = function () {
      const e = this;
      rt(
        function (t) {
          t.id !== e.id &&
            (e._schedule.now() - t.get(e.keys.ACK) <
              e.timeouts.RECLAIM_TIMEOUT ||
              (function (t) {
                t.set(e.keys.RECLAIM_START, e.id),
                  t.set(e.keys.ACK, e._schedule.now()),
                  e._schedule.run(function () {
                    t.get(e.keys.RECLAIM_START) === e.id &&
                      (t.set(e.keys.RECLAIM_END, e.id),
                      e._schedule.run(function () {
                        t.get(e.keys.RECLAIM_END) === e.id &&
                          t.get(e.keys.RECLAIM_START) === e.id &&
                          e._reclaim(t.id);
                      }, e.timeouts.RECLAIM_WAIT));
                  }, e.timeouts.RECLAIM_WAIT);
              })(t));
        },
        (function (t) {
          for (var n = [], r = e._store.engine, i = 0; i < r.length; i++) {
            const o = r.key(i).split(".");
            o.length === 3 &&
              o[0] === t &&
              o[2] === "ack" &&
              n.push(new On(t, o[1], e.keys));
          }
          return n;
        })(this.name)
      ),
        this._schedule.run(this._checkReclaim, this.timeouts.RECLAIM_TIMER);
    }),
    (qn.prototype._reclaim = function (e) {
      const t = this;
      const n = new On(this.name, e, this.keys);
      const r = { queue: this._store.get(this.keys.QUEUE) || [] };
      const i = {
        inProgress: n.get(this.keys.IN_PROGRESS) || {},
        queue: n.get(this.keys.QUEUE) || [],
      };
      rt(function (e) {
        r.queue.push({
          item: e.item,
          attemptNumber: e.attemptNumber,
          time: t._schedule.now(),
        });
      }, i.queue),
        rt(function (e) {
          r.queue.push({
            item: e.item,
            attemptNumber: e.attemptNumber + 1,
            time: t._schedule.now(),
          });
        }, i.inProgress),
        (r.queue = r.queue.sort(function (e, t) {
          return e.time - t.time;
        })),
        this._store.set(this.keys.QUEUE, r.queue),
        n.remove(this.keys.ACK),
        n.remove(this.keys.RECLAIM_START),
        n.remove(this.keys.RECLAIM_END),
        n.remove(this.keys.IN_PROGRESS),
        n.remove(this.keys.QUEUE),
        this._processHead();
    });
  const Bn = qn;
  const Fn = {
    maxRetryDelay: 36e4,
    minRetryDelay: 1e3,
    backoffFactor: 2,
    maxAttempts: 10,
    maxItems: 100,
  };
  var Gn = new ((function () {
    function e() {
      n(this, e),
        (this.eventsBuffer = []),
        (this.writeKey = ""),
        (this.url = j),
        (this.state = "READY"),
        (this.batchSize = 0),
        (this.payloadQueue = new Bn("rudder", Fn, function (e, t) {
          (e.message.sentAt = w()),
            Gn.processQueueElement(e.url, e.headers, e.message, 1e4, function (
              e,
              n
            ) {
              if (e) return t(e);
              t(null, n);
            });
        })),
        this.payloadQueue.start();
    }
    return (
      i(e, [
        {
          key: "preaparePayloadAndFlush",
          value(e) {
            if (
              (g.debug(
                `==== in preaparePayloadAndFlush with state: ${e.state}`
              ),
              g.debug(e.eventsBuffer),
              e.eventsBuffer.length != 0 && e.state !== "PROCESSING")
            ) {
              const t = e.eventsBuffer;
              const n = new un();
              (n.batch = t),
                (n.writeKey = e.writeKey),
                (n.sentAt = w()),
                n.batch.forEach(function (e) {
                  e.sentAt = n.sentAt;
                }),
                (e.batchSize = e.eventsBuffer.length);
              const r = new XMLHttpRequest();
              g.debug("==== in flush sending to Rudder BE ===="),
                g.debug(JSON.stringify(n, v)),
                r.open("POST", e.url, !0),
                r.setRequestHeader("Content-Type", "application/json"),
                r.setRequestHeader(
                  "Authorization",
                  `Basic ${btoa(`${n.writeKey}:`)}`
                ),
                (r.onreadystatechange = function () {
                  r.readyState === 4 && r.status === 200
                    ? (g.debug(
                        `====== request processed successfully: ${r.status}`
                      ),
                      (e.eventsBuffer = e.eventsBuffer.slice(e.batchSize)),
                      g.debug(e.eventsBuffer.length))
                    : r.readyState === 4 &&
                      r.status !== 200 &&
                      k(
                        new Error(
                          `request failed with status: ${r.status} for url: ${e.url}`
                        )
                      ),
                    (e.state = "READY");
                }),
                r.send(JSON.stringify(n, v)),
                (e.state = "PROCESSING");
            }
          },
        },
        {
          key: "processQueueElement",
          value(e, t, n, r, i) {
            try {
              const o = new XMLHttpRequest();
              for (const s in (o.open("POST", e, !0), t))
                o.setRequestHeader(s, t[s]);
              (o.timeout = r),
                (o.ontimeout = i),
                (o.onerror = i),
                (o.onreadystatechange = function () {
                  o.readyState === 4 &&
                    (o.status === 429 || (o.status >= 500 && o.status < 600)
                      ? (k(
                          new Error(
                            `request failed with status: ${o.status}${o.statusText} for url: ${e}`
                          )
                        ),
                        i(
                          new Error(
                            `request failed with status: ${o.status}${o.statusText} for url: ${e}`
                          )
                        ))
                      : (g.debug(
                          `====== request processed successfully: ${o.status}`
                        ),
                        i(null, o.status)));
                }),
                o.send(JSON.stringify(n, v));
            } catch (e) {
              i(e);
            }
          },
        },
        {
          key: "enqueue",
          value(e, t) {
            const n = e.getElementContent();
            const r = {
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa(`${this.writeKey}:`)}`,
              AnonymousId: btoa(n.anonymousId),
            };
            (n.originalTimestamp = w()),
              (n.sentAt = w()),
              JSON.stringify(n).length > 32e3 &&
                g.error(
                  "[EventRepository] enqueue:: message length greater 32 Kb ",
                  n
                );
            const i =
              this.url.slice(-1) == "/" ? this.url.slice(0, -1) : this.url;
            this.payloadQueue.addItem({
              url: `${i}/v1/${t}`,
              headers: r,
              message: n,
            });
          },
        },
      ]),
      e
    );
  })())();
  function Kn(e) {
    const t = function (t) {
      let n = (t = t || window.event).target || t.srcElement;
      Wn(n) && (n = n.parentNode),
        Hn(n, t)
          ? g.debug("to be tracked ", t.type)
          : g.debug("not to be tracked ", t.type),
        (function (e, t) {
          let n = e.target || e.srcElement;
          let r = void 0;
          Wn(n) && (n = n.parentNode);
          if (Hn(n, e)) {
            if (n.tagName.toLowerCase() == "form") {
              r = {};
              for (let i = 0; i < n.elements.length; i++) {
                const o = n.elements[i];
                if (Qn(o) && Yn(o, t.trackValues)) {
                  const s = o.id ? o.id : o.name;
                  if (s && typeof s === "string") {
                    const a = o.id ? o.id : o.name;
                    let c = o.id
                      ? document.getElementById(o.id).value
                      : document.getElementsByName(o.name)[0].value;
                    (o.type !== "checkbox" && o.type !== "radio") ||
                      (c = o.checked),
                      a.trim() !== "" &&
                        (r[encodeURIComponent(a)] = encodeURIComponent(c));
                  }
                }
              }
            }
            for (var u = [n], l = n; l.parentNode && !zn(l, "body"); )
              u.push(l.parentNode), (l = l.parentNode);
            let d;
            const p = [];
            let h = !1;
            if (
              (u.forEach(function (e) {
                const n = (function (e) {
                  return !(!e.parentNode || zn(e, "body"));
                })(e);
                e.tagName.toLowerCase() === "a" &&
                  ((d = e.getAttribute("href")), (d = n && d)),
                  (h = h || !Qn(e)),
                  p.push(
                    (function (e, t) {
                      for (
                        var n = {
                            classes: $n(e).split(" "),
                            tag_name: e.tagName.toLowerCase(),
                          },
                          r = e.attributes.length,
                          i = 0;
                        i < r;
                        i++
                      ) {
                        const o = e.attributes[i].name;
                        const s = e.attributes[i].value;
                        s && (n[`attr__${o}`] = s),
                          (o != "name" && o != "id") ||
                            !Yn(e, t.trackValues) ||
                            ((n.field_value =
                              o == "id"
                                ? document.getElementById(s).value
                                : document.getElementsByName(s)[0].value),
                            (e.type !== "checkbox" && e.type !== "radio") ||
                              (n.field_value = e.checked));
                      }
                      let a = 1;
                      let c = 1;
                      let u = e;
                      for (; (u = Zn(u)); ) a++, u.tagName === e.tagName && c++;
                      return (n.nth_child = a), (n.nth_of_type = c), n;
                    })(e, t)
                  );
              }),
              h)
            )
              return !1;
            let f = "";
            const m = (function (e) {
              let t = "";
              return (
                e.childNodes.forEach(function (e) {
                  e.nodeType === Node.TEXT_NODE && (t += e.nodeValue);
                }),
                t.trim()
              );
            })(n);
            m && m.length && (f = m);
            const y = {
              event_type: e.type,
              page: E(),
              elements: p,
              el_attr_href: d,
              el_text: f,
            };
            r && (y.form_values = r),
              g.debug("web_event", y),
              t.track("autotrack", y);
          }
        })(t, e);
    };
    Vn(document, "submit", t, !0),
      Vn(document, "change", t, !0),
      Vn(document, "click", t, !0),
      e.page();
  }
  function Vn(e, t, n, r) {
    e
      ? e.addEventListener(t, n, !!r)
      : g.error(
          "[Autotrack] register_event:: No valid element provided to register_event"
        );
  }
  function Hn(e, t) {
    if (!e || zn(e, "html") || !Jn(e)) return !1;
    switch (e.tagName.toLowerCase()) {
      case "html":
        return !1;
      case "form":
        return t.type === "submit";
      case "input":
        return ["button", "submit"].indexOf(e.getAttribute("type")) === -1
          ? t.type === "change"
          : t.type === "click";
      case "select":
      case "textarea":
        return t.type === "change";
      default:
        return t.type === "click";
    }
  }
  function zn(e, t) {
    return e && e.tagName && e.tagName.toLowerCase() === t.toLowerCase();
  }
  function Jn(e) {
    return e && e.nodeType === 1;
  }
  function Wn(e) {
    return e && e.nodeType === 3;
  }
  function $n(e) {
    switch (t(e.className)) {
      case "string":
        return e.className;
      case "object":
        return e.className.baseVal || e.getAttribute("class") || "";
      default:
        return "";
    }
  }
  function Yn(e, t) {
    for (let n = e.attributes.length, r = 0; r < n; r++) {
      const i = e.attributes[r].value;
      if (t.indexOf(i) > -1) return !0;
    }
    return !1;
  }
  function Qn(e) {
    return !($n(e).split(" ").indexOf("rudder-no-track") >= 0);
  }
  function Zn(e) {
    if (e.previousElementSibling) return e.previousElementSibling;
    do {
      e = e.previousSibling;
    } while (e && !Jn(e));
    return e;
  }
  function Xn(e, t) {
    this.eventRepository || (this.eventRepository = Gn),
      this.eventRepository.enqueue(e, t);
  }
  var er = new ((function () {
    function e() {
      n(this, e),
        (this.autoTrackHandlersRegistered = !1),
        (this.autoTrackFeatureEnabled = !1),
        (this.initialized = !1),
        (this.trackValues = []),
        (this.eventsBuffer = []),
        (this.clientIntegrations = []),
        (this.loadOnlyIntegrations = {}),
        (this.clientIntegrationObjects = void 0),
        (this.successfullyLoadedIntegration = []),
        (this.failedToBeLoadedIntegration = []),
        (this.toBeProcessedArray = []),
        (this.toBeProcessedByIntegrationArray = []),
        (this.storage = Yt),
        (this.userId =
          this.storage.getUserId() != null ? this.storage.getUserId() : ""),
        (this.userTraits =
          this.storage.getUserTraits() != null
            ? this.storage.getUserTraits()
            : {}),
        (this.groupId =
          this.storage.getGroupId() != null ? this.storage.getGroupId() : ""),
        (this.groupTraits =
          this.storage.getGroupTraits() != null
            ? this.storage.getGroupTraits()
            : {}),
        (this.anonymousId = this.getAnonymousId()),
        this.storage.setUserId(this.userId),
        (this.eventRepository = Gn),
        (this.sendAdblockPage = !1),
        (this.sendAdblockPageOptions = {}),
        (this.clientSuppliedCallbacks = {}),
        (this.readyCallback = function () {}),
        (this.executeReadyCallback = void 0),
        (this.methodToCallbackMapping = { syncPixel: "syncPixelCallback" });
    }
    return (
      i(e, [
        {
          key: "processResponse",
          value(e, t) {
            try {
              g.debug("===in process response=== ".concat(e)),
                (t = JSON.parse(t)).source.useAutoTracking &&
                  !this.autoTrackHandlersRegistered &&
                  ((this.autoTrackFeatureEnabled = !0),
                  Kn(this),
                  (this.autoTrackHandlersRegistered = !0)),
                t.source.destinations.forEach(function (e, t) {
                  g.debug(
                    "Destination "
                      .concat(t, " Enabled? ")
                      .concat(e.enabled, " Type: ")
                      .concat(e.destinationDefinition.name, " Use Native SDK? ")
                      .concat(e.config.useNativeSDK)
                  ),
                    e.enabled &&
                      this.clientIntegrations.push({
                        name: e.destinationDefinition.name,
                        config: e.config,
                      });
                }, this),
                console.log(
                  "this.clientIntegrations: ",
                  this.clientIntegrations
                ),
                (this.clientIntegrations = C(
                  this.loadOnlyIntegrations,
                  this.clientIntegrations
                )),
                (this.clientIntegrations = this.clientIntegrations.filter(
                  function (e) {
                    return Xt[e.name] != null;
                  }
                )),
                this.init(this.clientIntegrations);
            } catch (e) {
              k(e),
                g.debug("===handling config BE response processing error==="),
                g.debug(
                  "autoTrackHandlersRegistered",
                  this.autoTrackHandlersRegistered
                ),
                this.autoTrackFeatureEnabled &&
                  !this.autoTrackHandlersRegistered &&
                  (Kn(this), (this.autoTrackHandlersRegistered = !0));
            }
          },
        },
        {
          key: "init",
          value(e) {
            const t = this;
            const n = this;
            if ((g.debug("supported intgs ", Xt), !e || e.length == 0))
              return (
                this.readyCallback && this.readyCallback(),
                void (this.toBeProcessedByIntegrationArray = [])
              );
            e.forEach(function (e) {
              try {
                g.debug(
                  "[Analytics] init :: trying to initialize integration name:: ",
                  e.name
                );
                const r = new (0, Xt[e.name])(e.config, n);
                r.init(),
                  g.debug("initializing destination: ", e),
                  t.isInitialized(r).then(t.replayEvents);
              } catch (t) {
                g.error(
                  "[Analytics] initialize integration (integration.init()) failed :: ",
                  e.name
                );
              }
            });
          },
        },
        {
          key: "replayEvents",
          value(e) {
            e.successfullyLoadedIntegration.length +
              e.failedToBeLoadedIntegration.length ==
              e.clientIntegrations.length &&
              e.toBeProcessedByIntegrationArray.length > 0 &&
              (g.debug(
                "===replay events called====",
                e.successfullyLoadedIntegration.length,
                e.failedToBeLoadedIntegration.length
              ),
              (e.clientIntegrationObjects = []),
              (e.clientIntegrationObjects = e.successfullyLoadedIntegration),
              g.debug(
                "==registering after callback===",
                e.clientIntegrationObjects.length
              ),
              (e.executeReadyCallback = p(
                e.clientIntegrationObjects.length,
                e.readyCallback
              )),
              g.debug("==registering ready callback==="),
              e.on("ready", e.executeReadyCallback),
              e.clientIntegrationObjects.forEach(function (t) {
                g.debug("===looping over each successful integration===="),
                  (t.isReady && !t.isReady()) ||
                    (g.debug("===letting know I am ready=====", t.name),
                    e.emit("ready"));
              }),
              e.toBeProcessedByIntegrationArray.forEach(function (t) {
                const n = t[0];
                t.shift(),
                  Object.keys(t[0].message.integrations).length > 0 &&
                    A(t[0].message.integrations);
                for (
                  let r = C(
                      t[0].message.integrations,
                      e.clientIntegrationObjects
                    ),
                    i = 0;
                  i < r.length;
                  i++
                )
                  try {
                    var o;
                    if (!r[i].isFailed || !r[i].isFailed())
                      if (r[i][n]) (o = r[i])[n].apply(o, c(t));
                  } catch (e) {
                    k(e);
                  }
              }),
              (e.toBeProcessedByIntegrationArray = []));
          },
        },
        {
          key: "pause",
          value(e) {
            return new Promise(function (t) {
              setTimeout(t, e);
            });
          },
        },
        {
          key: "isInitialized",
          value(e) {
            const t = this;
            const n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 0;
            return new Promise(function (r) {
              return e.isLoaded()
                ? (g.debug("===integration loaded successfully====", e.name),
                  t.successfullyLoadedIntegration.push(e),
                  r(t))
                : n >= 1e4
                ? (g.debug("====max wait over===="),
                  t.failedToBeLoadedIntegration.push(e),
                  r(t))
                : void t.pause(1e3).then(function () {
                    return (
                      g.debug("====after pause, again checking===="),
                      t.isInitialized(e, n + 1e3).then(r)
                    );
                  });
            });
          },
        },
        {
          key: "page",
          value(e, n, r, i, o) {
            typeof i === "function" && ((o = i), (i = null)),
              typeof r === "function" && ((o = r), (i = r = null)),
              typeof n === "function" && ((o = n), (i = r = n = null)),
              t(e) === "object" && ((i = n), (r = e), (n = e = null)),
              t(n) === "object" && ((i = r), (r = n), (n = null)),
              typeof e === "string" &&
                typeof n !== "string" &&
                ((n = e), (e = null)),
              this.sendAdblockPage &&
                e != "RudderJS-Initiated" &&
                this.sendSampleRequest(),
              this.processPage(e, n, r, i, o);
          },
        },
        {
          key: "track",
          value(e, t, n, r) {
            typeof n === "function" && ((r = n), (n = null)),
              typeof t === "function" && ((r = t), (n = null), (t = null)),
              this.processTrack(e, t, n, r);
          },
        },
        {
          key: "identify",
          value(e, n, r, i) {
            typeof r === "function" && ((i = r), (r = null)),
              typeof n === "function" && ((i = n), (r = null), (n = null)),
              t(e) === "object" && ((r = n), (n = e), (e = this.userId)),
              this.processIdentify(e, n, r, i);
          },
        },
        {
          key: "alias",
          value(e, n, r, i) {
            typeof r === "function" && ((i = r), (r = null)),
              typeof n === "function" && ((i = n), (r = null), (n = null)),
              t(n) === "object" && ((r = n), (n = null));
            const o = new cn().setType("alias").build();
            (o.message.previousId =
              n || (this.userId ? this.userId : this.getAnonymousId())),
              (o.message.userId = e),
              this.processAndSendDataToDestinations("alias", o, r, i);
          },
        },
        {
          key: "group",
          value(e, n, r, i) {
            if (arguments.length) {
              typeof r === "function" && ((i = r), (r = null)),
                typeof n === "function" && ((i = n), (r = null), (n = null)),
                t(e) === "object" && ((r = n), (n = e), (e = this.groupId)),
                (this.groupId = e),
                this.storage.setGroupId(this.groupId);
              const o = new cn().setType("group").build();
              if (n) for (const s in n) this.groupTraits[s] = n[s];
              else this.groupTraits = {};
              this.storage.setGroupTraits(this.groupTraits),
                this.processAndSendDataToDestinations("group", o, r, i);
            }
          },
        },
        {
          key: "processPage",
          value(e, t, n, r, i) {
            const o = new cn().setType("page").build();
            t && (o.message.name = t),
              n || (n = {}),
              e && (n.category = e),
              n && (o.message.properties = this.getPageProperties(n)),
              this.trackPage(o, r, i);
          },
        },
        {
          key: "processTrack",
          value(e, t, n, r) {
            const i = new cn().setType("track").build();
            e && i.setEventName(e),
              t ? i.setProperty(t) : i.setProperty({}),
              this.trackEvent(i, n, r);
          },
        },
        {
          key: "processIdentify",
          value(e, t, n, r) {
            e && this.userId && e !== this.userId && this.reset(),
              (this.userId = e),
              this.storage.setUserId(this.userId);
            const i = new cn().setType("identify").build();
            if (t) {
              for (const o in t) this.userTraits[o] = t[o];
              this.storage.setUserTraits(this.userTraits);
            }
            this.identifyUser(i, n, r);
          },
        },
        {
          key: "identifyUser",
          value(e, t, n) {
            e.message.userId &&
              ((this.userId = e.message.userId),
              this.storage.setUserId(this.userId)),
              e &&
                e.message &&
                e.message.context &&
                e.message.context.traits &&
                ((this.userTraits = a({}, e.message.context.traits)),
                this.storage.setUserTraits(this.userTraits)),
              this.processAndSendDataToDestinations("identify", e, t, n);
          },
        },
        {
          key: "trackPage",
          value(e, t, n) {
            this.processAndSendDataToDestinations("page", e, t, n);
          },
        },
        {
          key: "trackEvent",
          value(e, t, n) {
            this.processAndSendDataToDestinations("track", e, t, n);
          },
        },
        {
          key: "processAndSendDataToDestinations",
          value(e, t, n, r) {
            try {
              this.anonymousId || this.setAnonymousId(),
                (t.message.context.page = E()),
                (t.message.context.traits = a({}, this.userTraits)),
                g.debug("anonymousId: ", this.anonymousId),
                (t.message.anonymousId = this.anonymousId),
                (t.message.userId = t.message.userId
                  ? t.message.userId
                  : this.userId),
                e == "group" &&
                  (this.groupId && (t.message.groupId = this.groupId),
                  this.groupTraits &&
                    (t.message.traits = a({}, this.groupTraits))),
                n && this.processOptionsParam(t, n),
                g.debug(JSON.stringify(t)),
                Object.keys(t.message.integrations).length > 0 &&
                  A(t.message.integrations),
                C(
                  t.message.integrations,
                  this.clientIntegrationObjects
                ).forEach(function (n) {
                  (n.isFailed && n.isFailed()) || (n[e] && n[e](t));
                }),
                this.clientIntegrationObjects ||
                  (g.debug("pushing in replay queue"),
                  this.toBeProcessedByIntegrationArray.push([e, t])),
                (i = t.message.integrations),
                Object.keys(i).forEach(function (e) {
                  i.hasOwnProperty(e) &&
                    (y[e] && (i[y[e]] = i[e]),
                    e != "All" && y[e] != null && y[e] != e && delete i[e]);
                }),
                Xn.call(this, t, e),
                g.debug("".concat(e, " is called ")),
                r && r();
            } catch (e) {
              k(e);
            }
            let i;
          },
        },
        {
          key: "processOptionsParam",
          value(e, t) {
            const n = ["integrations", "anonymousId", "originalTimestamp"];
            for (const r in t)
              if (n.includes(r)) e.message[r] = t[r];
              else if (r !== "context") e.message.context[r] = t[r];
              else for (const i in t[r]) e.message.context[i] = t[r][i];
          },
        },
        {
          key: "getPageProperties",
          value(e) {
            const t = E();
            for (const n in t) void 0 === e[n] && (e[n] = t[n]);
            return e;
          },
        },
        {
          key: "reset",
          value() {
            (this.userId = ""), (this.userTraits = {}), this.storage.clear();
          },
        },
        {
          key: "getAnonymousId",
          value() {
            return (
              (this.anonymousId = this.storage.getAnonymousId()),
              this.anonymousId || this.setAnonymousId(),
              this.anonymousId
            );
          },
        },
        {
          key: "setAnonymousId",
          value(e) {
            (this.anonymousId = e || b()),
              this.storage.setAnonymousId(this.anonymousId);
          },
        },
        {
          key: "load",
          value(e, n, r) {
            const i = this;
            g.debug("inside load ");
            let o = "https://api.rudderlabs.com/sourceConfig/?p=web&v=1.1.2";
            if (!e || !n || n.length == 0)
              throw (
                (k({
                  message:
                    "[Analytics] load:: Unable to load due to wrong writeKey or serverUrl",
                }),
                Error("failed to initialize"))
              );
            if (
              (r && r.logLevel && g.setLogLevel(r.logLevel),
              r &&
                r.integrations &&
                (Object.assign(this.loadOnlyIntegrations, r.integrations),
                A(this.loadOnlyIntegrations)),
              r && r.configUrl && (o = r.configUrl),
              r && r.sendAdblockPage && (this.sendAdblockPage = !0),
              r &&
                r.sendAdblockPageOptions &&
                t(r.sendAdblockPageOptions) === "object" &&
                (this.sendAdblockPageOptions = r.sendAdblockPageOptions),
              r && r.clientSuppliedCallbacks)
            ) {
              const s = {};
              Object.keys(this.methodToCallbackMapping).forEach(function (e) {
                i.methodToCallbackMapping.hasOwnProperty(e) &&
                  r.clientSuppliedCallbacks[i.methodToCallbackMapping[e]] &&
                  (s[e] =
                    r.clientSuppliedCallbacks[i.methodToCallbackMapping[e]]);
              }),
                Object.assign(this.clientSuppliedCallbacks, s),
                this.registerCallbacks(!0);
            }
            (this.eventRepository.writeKey = e),
              n && (this.eventRepository.url = n),
              r &&
                r.valTrackingList &&
                r.valTrackingList.push == Array.prototype.push &&
                (this.trackValues = r.valTrackingList),
              r &&
                r.useAutoTracking &&
                ((this.autoTrackFeatureEnabled = !0),
                this.autoTrackFeatureEnabled &&
                  !this.autoTrackHandlersRegistered &&
                  (Kn(this),
                  (this.autoTrackHandlersRegistered = !0),
                  g.debug(
                    "autoTrackHandlersRegistered",
                    this.autoTrackHandlersRegistered
                  )));
            try {
              !(function (e, t, n, r) {
                let i;
                const o = r.bind(e);
                (i = new XMLHttpRequest()).open("GET", t, !0),
                  i.setRequestHeader("Authorization", `Basic ${btoa(`${n}:`)}`),
                  (i.onload = function () {
                    const e = i.status;
                    e == 200
                      ? (g.debug("status 200 calling callback"),
                        o(200, i.responseText))
                      : (k(
                          new Error(
                            `request failed with status: ${i.status} for url: ${t}`
                          )
                        ),
                        o(e));
                  }),
                  i.send();
              })(this, o, e, this.processResponse);
            } catch (e) {
              k(e),
                this.autoTrackFeatureEnabled &&
                  !this.autoTrackHandlersRegistered &&
                  Kn(er);
            }
          },
        },
        {
          key: "ready",
          value(e) {
            typeof e !== "function"
              ? g.error("ready callback is not a function")
              : (this.readyCallback = e);
          },
        },
        {
          key: "initializeCallbacks",
          value() {
            const e = this;
            Object.keys(this.methodToCallbackMapping).forEach(function (t) {
              e.methodToCallbackMapping.hasOwnProperty(t) &&
                e.on(t, function () {});
            });
          },
        },
        {
          key: "registerCallbacks",
          value(e) {
            const t = this;
            e ||
              Object.keys(this.methodToCallbackMapping).forEach(function (e) {
                t.methodToCallbackMapping.hasOwnProperty(e) &&
                  window.rudderanalytics &&
                  typeof window.rudderanalytics[
                    t.methodToCallbackMapping[e]
                  ] === "function" &&
                  (t.clientSuppliedCallbacks[e] =
                    window.rudderanalytics[t.methodToCallbackMapping[e]]);
              }),
              Object.keys(this.clientSuppliedCallbacks).forEach(function (e) {
                t.clientSuppliedCallbacks.hasOwnProperty(e) &&
                  (g.debug(
                    "registerCallbacks",
                    e,
                    t.clientSuppliedCallbacks[e]
                  ),
                  t.on(e, t.clientSuppliedCallbacks[e]));
              });
          },
        },
        {
          key: "sendSampleRequest",
          value() {
            L(
              "ad-block",
              "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            );
          },
        },
      ]),
      e
    );
  })())();
  console.log("====instance formed======="),
    d(er),
    window.addEventListener(
      "error",
      function (e) {
        k(e, er);
      },
      !0
    ),
    er.initializeCallbacks(),
    er.registerCallbacks(!1);
  const tr =
    !!window.rudderanalytics &&
    window.rudderanalytics.push == Array.prototype.push;
  const nr = window.rudderanalytics ? window.rudderanalytics[0] : [];
  if (nr.length > 0 && nr[0] == "load") {
    const rr = nr[0];
    nr.shift(),
      g.debug("=====from init, calling method:: ", rr),
      er[rr].apply(er, c(nr));
  }
  if (tr) {
    for (let ir = 1; ir < window.rudderanalytics.length; ir++)
      er.toBeProcessedArray.push(window.rudderanalytics[ir]);
    for (let or = 0; or < er.toBeProcessedArray.length; or++) {
      const sr = c(er.toBeProcessedArray[or]);
      const ar = sr[0];
      sr.shift(),
        g.debug("=====from init, calling method:: ", ar),
        er[ar].apply(er, c(sr));
    }
    er.toBeProcessedArray = [];
  }
  const cr = er.ready.bind(er);
  const ur = er.identify.bind(er);
  const lr = er.page.bind(er);
  const dr = er.track.bind(er);
  const pr = er.alias.bind(er);
  const hr = er.group.bind(er);
  const fr = er.reset.bind(er);
  const gr = er.load.bind(er);
  const mr = (er.initialized = !0);
  const yr = er.getAnonymousId.bind(er);
  const vr = er.setAnonymousId.bind(er);
  return (
    (e.alias = pr),
    (e.getAnonymousId = yr),
    (e.group = hr),
    (e.identify = ur),
    (e.initialized = mr),
    (e.load = gr),
    (e.page = lr),
    (e.ready = cr),
    (e.reset = fr),
    (e.setAnonymousId = vr),
    (e.track = dr),
    e
  );
})({});
// # sourceMappingURL=rudder-analytics.min.js.map
