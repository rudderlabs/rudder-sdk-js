import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';

const ACCOUNT_ID_THRESHOLD = 1200000;

function loadNativeSdk(
  account_id,
  settings_tolerance,
  library_tolerance,
  use_existing_jquery,
  isSPA,
) {

  if (Number(account_id) > ACCOUNT_ID_THRESHOLD) {
    window._vwo_code || (function() {
      var account_id = account_id,
          version = 3.0,
          settings_tolerance = settings_tolerance,
          hide_element = 'body',
          hide_element_style =
          'opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;transition:none !important';

      /* DO NOT EDIT BELOW THIS LINE */
      var t = window,
          n = document;
      if (-1 < n.URL.indexOf('__vwo_disable__') || t._vwo_code) return;
      var i = !1,
          o = n.currentScript,
          e = {
              sT: settings_tolerance,
              hES: hide_element_style,
              hE: hide_element
          };
      try {
          e = Object.assign(JSON.parse(localStorage.getItem('_vwo_' + account_id + '_config')), e)
      } catch (e) {}
      var code = {
          nonce: o && o.nonce,
          settings_tolerance: function() {
              return e.sT
          },
          hide_element: function() {
              return performance.getEntriesByName('first-contentful-paint')[0] ? '' : e.hE
          },
          hide_element_style: function() {
              return '{' + e.hES + '}'
          },
          getVersion: function() {
              return version
          },
          finish: function() {
              var e;
              i || (i = !0, (e = n.getElementById('_vis_opt_path_hides')) && e.parentNode && e.parentNode.removeChild(e))
          },
          finished: function() {
              return i
          },
          addScript: function(e) {
              var t = n.createElement('script');
              t.type = 'text/javascript', t.src = e, o && o.nonce && t.setAttribute('nonce', o.nonce), n.getElementsByTagName('head')[0].appendChild(t)
          },
          init: function() {
              t._vwo_settings_timer = setTimeout(function() {
                  code.finish()
              }, this.settings_tolerance());
              var e = n.createElement('style');
              e.setAttribute('id', '_vis_opt_path_hides'), e.type = 'text/css', code && code.nonce && e.setAttribute('nonce', code.nonce), e.appendChild(n.createTextNode(this.hide_element() + this.hide_element_style())), n.head.appendChild(e), this.addScript('https://dev.visualwebsiteoptimizer.com/tag/' + account_id + '.js')
          }
      };
      t._vwo_code = code;
      code.init();
    })();
    return;
  }

  // Existing loader (for older VWO accounts)
  window._vwo_code = (function () {
    let f = false;
    const d = document;
    return {
      use_existing_jquery() {
        return use_existing_jquery;
      },
      library_tolerance() {
        return library_tolerance;
      },
      finish() {
        if (!f) {
          f = true;
          const a = d.getElementById('_vis_opt_path_hides');
          if (a) a.parentNode.removeChild(a);
        }
      },
      finished() {
        return f;
      },
      load(a) {
        const b = d.createElement('script');
        b.src = a;
        b.type = 'text/javascript';
        b.setAttribute('data-loader', LOAD_ORIGIN);
        b.innerText;
        b.onerror = function () {
          _vwo_code.finish();
        };
        d.getElementsByTagName('head')[0].appendChild(b);
      },
      init() {
        const settings_timer = setTimeout('_vwo_code.finish()', settings_tolerance);
        const a = d.createElement('style');
        const b =
          'body{opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;}';
        const h = d.getElementsByTagName('head')[0];
        a.setAttribute('id', '_vis_opt_path_hides');
        a.setAttribute('type', 'text/css');
        if (a.styleSheet) a.styleSheet.cssText = b;
        else a.appendChild(d.createTextNode(b));
        h.appendChild(a);
        this.load(
          `//dev.visualwebsiteoptimizer.com/j.php?a=${account_id}&u=${encodeURIComponent(
            d.URL,
          )}&r=${Math.random()}&f=${+isSPA}`,
        );
        return settings_timer;
      },
    };
  })();
  window._vwo_settings_timer = window._vwo_code.init();
}

export { loadNativeSdk };
