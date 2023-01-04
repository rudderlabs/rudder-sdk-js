/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */

import { isObject } from '../../utils/commonUtils';
import logger from '../../utils/logUtil';
import { NAME } from './constants';

class RollBar {
  constructor(config) {
    this.name = NAME;
    this.accessToken = config.accessToken;
    this.captureUncaughtException = config.captureUncaughtException;
    this.captureUnhandledRejections = config.captureUnhandledRejections;
    this.guessUncaughtFrames = config.guessUncaughtFrames;
    this.codeVersion = !config.codeVersion ? '' : config.codeVersion;
    this.ignoredMessages = config.ignoredMessages;
    this.environment = config.environment;
    this.sourceMapEnabled = config.sourceMapEnabled;
  }

  init() {
    logger.debug('===in init RollBar===');
    let _rollbarConfig = {
      accessToken: this.accessToken,
      captureUncaught: this.captureUncaughtException,
      captureUnhandledRejections: this.captureUnhandledRejections,
      payload: {
        environment: this.environment,
        client: {
          javascript: {
            code_version: this.codeVersion,
            source_map_enabled: this.sourceMapEnabled,
            guess_uncaught_frames: this.guessUncaughtFrames,
          },
        },
      },
    };
    const msg = this.ignoredMessages;
    if (msg.length > 0) {
      const ret = [];
      // clean out array
      for (const element of msg) {
        if (element !== null && element.singleIgnoredMessage !== '')
          ret.push(element.singleIgnoredMessage);
      }
      _rollbarConfig.ignoredMessages = ret;
    }
    // Rollbar Snippet
    !(function (r) {
      const e = {};
      function o(n) {
        if (e[n]) return e[n].exports;
        const t = (e[n] = { i: n, l: !1, exports: {} });
        return r[n].call(t.exports, t, t.exports, o), (t.l = !0), t.exports;
      }
      (o.m = r),
        (o.c = e),
        (o.d = function (r, e, n) {
          o.o(r, e) || Object.defineProperty(r, e, { enumerable: !0, get: n });
        }),
        (o.r = function (r) {
          typeof Symbol !== 'undefined' &&
            Symbol.toStringTag &&
            Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }),
            Object.defineProperty(r, '__esModule', { value: !0 });
        }),
        (o.t = function (r, e) {
          if ((1 & e && (r = o(r)), 8 & e)) return r;
          if (4 & e && typeof r === 'object' && r && r.__esModule) return r;
          const n = Object.create(null);
          if (
            (o.r(n),
            Object.defineProperty(n, 'default', { enumerable: !0, value: r }),
            2 & e && typeof r !== 'string')
          )
            for (const t in r)
              o.d(
                n,
                t,
                ((e) => r[e]).bind(null, t),
              );
          return n;
        }),
        (o.n = function (r) {
          const e =
            r && r.__esModule
              ? function () {
                  return r.default;
                }
              : function () {
                  return r;
                };
          return o.d(e, 'a', e), e;
        }),
        (o.o = function (r, e) {
          return Object.prototype.hasOwnProperty.call(r, e);
        }),
        (o.p = ''),
        o((o.s = 0));
    })([
      function (r, e, o) {
        
        const n = o(1);
          const t = o(5);
        (_rollbarConfig = _rollbarConfig || {}),
          (_rollbarConfig.rollbarJsUrl =
            _rollbarConfig.rollbarJsUrl ||
            'https://cdn.rollbar.com/rollbarjs/refs/tags/v2.24.0/rollbar.min.js'),
          (_rollbarConfig.async = void 0 === _rollbarConfig.async || _rollbarConfig.async);
        const a = n.setupShim(window, _rollbarConfig);
          const l = t(_rollbarConfig);
        (window.rollbar = n.Rollbar),
          a.loadFull(window, document, !_rollbarConfig.async, _rollbarConfig, l);
      },
      function (r, e, o) {
        
        const n = o(2);
          const t = o(3);
        function a(r) {
          return function () {
            try {
              return r.apply(this, arguments);
            } catch (r) {
              try {
                console.error('[Rollbar]: Internal error', r);
              } catch (r) {}
            }
          };
        }
        let l = 0;
        function i(r, e) {
          (this.options = r), (this._rollbarOldOnError = null);
          const o = l++;
          (this.shimId = function () {
            return o;
          }),
            typeof window !== 'undefined' &&
              window._rollbarShims &&
              (window._rollbarShims[o] = { handler: e, messages: [] });
        }
        const s = o(4);
          const d = function (r, e) {
            return new i(r, e);
          };
          const c = function (r) {
            return new s(d, r);
          };
        function u(r) {
          return a(function () {
            const e = this;
              const o = Array.prototype.slice.call(arguments, 0);
              const n = { shim: e, method: r, args: o, ts: new Date() };
            window._rollbarShims[this.shimId()].messages.push(n);
          });
        }
        (i.prototype.loadFull = function (r, e, o, n, t) {
          let l = !1;
            const i = e.createElement('script');
            const s = e.getElementsByTagName('script')[0];
            const d = s.parentNode;
          (i.crossOrigin = ''),
            (i.src = n.rollbarJsUrl),
            o || (i.async = !0),
            (i.onload = i.onreadystatechange =
              a(function () {
                if (
                  !(
                    l ||
                    (this.readyState &&
                      this.readyState !== 'loaded' &&
                      this.readyState !== 'complete')
                  )
                ) {
                  i.onload = i.onreadystatechange = null;
                  try {
                    d.removeChild(i);
                  } catch (r) {}
                  (l = !0),
                    (function () {
                      let e;
                      if (void 0 === r._rollbarDidLoad) {
                        e = new Error('rollbar.js did not load');
                        for (var o, n, a, l, i = 0; (o = r._rollbarShims[i++]); )
                          for (o = o.messages || []; (n = o.shift()); )
                            for (a = n.args || [], i = 0; i < a.length; ++i)
                              if (typeof (l = a[i]) === 'function') {
                                l(e);
                                break;
                              }
                      }
                      typeof t === 'function' && t(e);
                    })();
                }
              })),
            d.insertBefore(i, s);
        }),
          (i.prototype.wrap = function (r, e, o) {
            try {
              let n;
              if (
                ((n =
                  typeof e === 'function'
                    ? e
                    : function () {
                        return e || {};
                      }),
                typeof r !== 'function')
              )
                return r;
              if (r._isWrap) return r;
              if (
                !r._rollbar_wrapped &&
                ((r._rollbar_wrapped = function () {
                  o && typeof o === 'function' && o.apply(this, arguments);
                  try {
                    return r.apply(this, arguments);
                  } catch (o) {
                    let e = o;
                    throw (
                      (e &&
                        (typeof e === 'string' && (e = new String(e)),
                        (e._rollbarContext = n() || {}),
                        (e._rollbarContext._wrappedSource = r.toString()),
                        (window._rollbarWrappedError = e)),
                      e)
                    );
                  }
                }),
                (r._rollbar_wrapped._isWrap = !0),
                r.hasOwnProperty)
              )
                for (const t in r) r.hasOwnProperty(t) && (r._rollbar_wrapped[t] = r[t]);
              return r._rollbar_wrapped;
            } catch (e) {
              return r;
            }
          });
        for (
          let p =
              'log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleAnonymousErrors,handleUnhandledRejection,captureEvent,captureDomContentLoaded,captureLoad'.split(
                ',',
              ),
            f = 0;
          f < p.length;
          ++f
        )
          i.prototype[p[f]] = u(p[f]);
        r.exports = {
          setupShim (r, e) {
            if (r) {
              const o = e.globalAlias || 'Rollbar';
              if (typeof r[o] === 'object') return r[o];
              (r._rollbarShims = {}), (r._rollbarWrappedError = null);
              const l = new c(e);
              return a(() => {
                e.captureUncaught &&
                  ((l._rollbarOldOnError = r.onerror),
                  n.captureUncaughtExceptions(r, l, !0),
                  e.wrapGlobalEventHandlers && t(r, l, !0)),
                  e.captureUnhandledRejections && n.captureUnhandledRejections(r, l, !0);
                const a = e.autoInstrument;
                return (
                  !1 !== e.enabled &&
                    (void 0 === a || !0 === a || (typeof a === 'object' && a.network)) &&
                    r.addEventListener &&
                    (r.addEventListener('load', l.captureLoad.bind(l)),
                    r.addEventListener('DOMContentLoaded', l.captureDomContentLoaded.bind(l))),
                  (r[o] = l),
                  l
                );
              })();
            }
          },
          Rollbar: c,
        };
      },
      function (r, e, o) {
        
        function n(r, e, o, n) {
          r._rollbarWrappedError &&
            (n[4] || (n[4] = r._rollbarWrappedError),
            n[5] || (n[5] = r._rollbarWrappedError._rollbarContext),
            (r._rollbarWrappedError = null));
          const t = e.handleUncaughtException.apply(e, n);
          o && o.apply(r, n), t === 'anonymous' && (e.anonymousErrorsPending += 1);
        }
        r.exports = {
          captureUncaughtExceptions (r, e, o) {
            if (r) {
              let t;
              if (typeof e._rollbarOldOnError === 'function') t = e._rollbarOldOnError;
              else if (r.onerror) {
                for (t = r.onerror; t._rollbarOldOnError; ) t = t._rollbarOldOnError;
                e._rollbarOldOnError = t;
              }
              e.handleAnonymousErrors();
              const a = function () {
                const o = Array.prototype.slice.call(arguments, 0);
                n(r, e, t, o);
              };
              o && (a._rollbarOldOnError = t), (r.onerror = a);
            }
          },
          captureUnhandledRejections (r, e, o) {
            if (r) {
              typeof r._rollbarURH === 'function' &&
                r._rollbarURH.belongsToShim &&
                r.removeEventListener('unhandledrejection', r._rollbarURH);
              const n = function (r) {
                let o; let n; let t;
                try {
                  o = r.reason;
                } catch (r) {
                  o = void 0;
                }
                try {
                  n = r.promise;
                } catch (r) {
                  n = '[unhandledrejection] error getting `promise` from event';
                }
                try {
                  (t = r.detail), !o && t && ((o = t.reason), (n = t.promise));
                } catch (r) {}
                o || (o = '[unhandledrejection] error getting `reason` from event'),
                  e && e.handleUnhandledRejection && e.handleUnhandledRejection(o, n);
              };
              (n.belongsToShim = o),
                (r._rollbarURH = n),
                r.addEventListener('unhandledrejection', n);
            }
          },
        };
      },
      function (r, e, o) {
        
        function n(r, e, o) {
          if (e.hasOwnProperty && e.hasOwnProperty('addEventListener')) {
            for (var n = e.addEventListener; n._rollbarOldAdd && n.belongsToShim; )
              n = n._rollbarOldAdd;
            const t = function (e, o, t) {
              n.call(this, e, r.wrap(o), t);
            };
            (t._rollbarOldAdd = n), (t.belongsToShim = o), (e.addEventListener = t);
            for (var a = e.removeEventListener; a._rollbarOldRemove && a.belongsToShim; )
              a = a._rollbarOldRemove;
            const l = function (r, e, o) {
              a.call(this, r, (e && e._rollbar_wrapped) || e, o);
            };
            (l._rollbarOldRemove = a), (l.belongsToShim = o), (e.removeEventListener = l);
          }
        }
        r.exports = function (r, e, o) {
          if (r) {
            let t;
              let a;
              const l =
                'EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload'.split(
                  ',',
                );
            for (t = 0; t < l.length; ++t)
              r[(a = l[t])] && r[a].prototype && n(e, r[a].prototype, o);
          }
        };
      },
      function (r, e, o) {
        
        function n(r, e) {
          (this.impl = r(e, this)),
            (this.options = e),
            (function (r) {
              for (
                let e = function (r) {
                    return function () {
                      const e = Array.prototype.slice.call(arguments, 0);
                      if (this.impl[r]) return this.impl[r].apply(this.impl, e);
                    };
                  },
                  o =
                    'log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleAnonymousErrors,handleUnhandledRejection,_createItem,wrap,loadFull,shimId,captureEvent,captureDomContentLoaded,captureLoad'.split(
                      ',',
                    ),
                  n = 0;
                n < o.length;
                n++
              )
                r[o[n]] = e(o[n]);
            })(n.prototype);
        }
        (n.prototype._swapAndProcessMessages = function (r, e) {
          let o; let n; let t;
          for (this.impl = r(this.options); (o = e.shift()); )
            (n = o.method),
              (t = o.args),
              this[n] &&
                typeof this[n] === 'function' &&
                (n === 'captureDomContentLoaded' || n === 'captureLoad'
                  ? this[n].apply(this, [t[0], o.ts])
                  : this[n].apply(this, t));
          return this;
        }),
          (r.exports = n);
      },
      function (r, e, o) {
        
        r.exports = function (r) {
          return function (e) {
            if (!e && !window._rollbarInitialized) {
              for (
                var o,
                  n,
                  t = (r = r || {}).globalAlias || 'Rollbar',
                  a = window.rollbar,
                  l = function (r) {
                    return new a(r);
                  },
                  i = 0;
                (o = window._rollbarShims[i++]);

              )
                n || (n = o.handler), o.handler._swapAndProcessMessages(l, o.messages);
              (window[t] = n), (window._rollbarInitialized = !0);
            }
          };
        };
      },
    ]);
    // End Rollbar Snippet
  }

  isLoaded() {
    logger.debug('===In isLoaded RollBar===');
    return !!(window.Rollbar && isObject(window.Rollbar));
  }

  isReady() {
    logger.debug('===In isReady RollBar===');

    return !!window.Rollbar;
  }

  identify(rudderElement) {
    logger.debug('===In RollBar Identify===');
    const { message } = rudderElement;
    const { userId } = message;
    const { traits } = rudderElement.message.context;

    const person = traits;
    if (person.name) {
      person.username = person.name;
      delete person.name;
    }
    if (userId) person.id = userId;
    else logger.debug('=== userId is not found. no new user will be created in rollbar');
    window.Rollbar.configure({ payload: { person } });
  }
}

export default RollBar;
