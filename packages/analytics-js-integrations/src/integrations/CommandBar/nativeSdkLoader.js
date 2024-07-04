import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';

function loadNativeSdk(orgId) {
  var o = orgId,
    n = ['Object.assign', 'Symbol', 'Symbol.for'].join('%2C'),
    a = window;
  function r(o, n) {
    void 0 === n && (n = !1),
      'complete' !== document.readyState &&
        window.addEventListener('load', r.bind(null, o, n), { capture: !1, once: !0 });
    var a = document.createElement('script');
    a.setAttribute('data-loader', LOAD_ORIGIN);
    (a.type = 'text/javascript'), (a.async = n), (a.src = o), document.head.appendChild(a);
  }
  function t() {
    var n;
    if (void 0 === a.CommandBar) {
      delete a.__CommandBarBootstrap__;
      var t = Symbol.for('CommandBar::configuration'),
        e = Symbol.for('CommandBar::orgConfig'),
        i = Symbol.for('CommandBar::disposed'),
        c = Symbol.for('CommandBar::isProxy'),
        m = Symbol.for('CommandBar::queue'),
        d = Symbol.for('CommandBar::unwrap'),
        l = Symbol.for('CommandBar::eventSubscriptions'),
        s = [],
        u = localStorage.getItem('commandbar.lc'),
        f = u && u.includes('local') ? 'http://localhost:8000' : 'https://api.commandbar.com',
        p = Object.assign(
          (((n = {})[t] = { uuid: o }),
          (n[e] = {}),
          (n[i] = !1),
          (n[c] = !0),
          (n[m] = new Array()),
          (n[d] = function () {
            return p;
          }),
          (n[l] = void 0),
          n),
          a.CommandBar,
        ),
        b = ['addCommand', 'boot', 'addEventSubscriber', 'addRecordAction', 'setFormFactor'],
        y = p;
      Object.assign(p, {
        shareCallbacks: function () {
          return {};
        },
        shareContext: function () {
          return {};
        },
      }),
        (a.CommandBar = new Proxy(p, {
          get: function (o, n) {
            return n in y
              ? p[n]
              : 'then' !== n
                ? b.includes(n)
                  ? function () {
                      var o = Array.prototype.slice.call(arguments);
                      return new Promise(function (a, r) {
                        o.unshift(n, a, r), p[m].push(o);
                      });
                    }
                  : function () {
                      var o = Array.prototype.slice.call(arguments);
                      o.unshift(n), p[m].push(o);
                    }
                : void 0;
          },
        })),
        null !== u && s.push('lc='.concat(u)),
        s.push('version=2'),
        r(''.concat(f, '/latest/').concat(o, '?').concat(s.join('&')), !0);
    }
  }
  t();
}

export { loadNativeSdk };
