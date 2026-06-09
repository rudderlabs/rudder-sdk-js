import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';

function loadNativeSdk(account_id, settings_tolerance) {
  if (window._wingify_code) {
    return;
  }

  const version = 3.0;
  const hide_element = 'body';
  const hide_element_style =
    'opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;transition:none !important';

  const t = window;
  const n = document;

  if (n.URL.indexOf('__wingify_disable__') !== -1) {
    return;
  }

  let finished = false;
  const o = n.currentScript;
  let config = { sT: settings_tolerance, hES: hide_element_style, hE: hide_element };

  try {
    config = Object.assign(JSON.parse(localStorage.getItem(`_wingify_${account_id}_config`)), config);
  } catch (e) {
    // ignore invalid localStorage config
  }

  const code = {
    nonce: o?.nonce,
    settings_tolerance() {
      return config.sT;
    },
    hide_element() {
      if (
        typeof performance !== 'undefined' &&
        typeof performance.getEntriesByName === 'function' &&
        performance.getEntriesByName('first-contentful-paint')[0]
      ) {
        return '';
      }
      return config.hE;
    },
    hide_element_style() {
      return `{${config.hES}}`;
    },
    getVersion() {
      return version;
    },
    finish() {
      if (!finished) {
        finished = true;
        const hideEl = n.getElementById('_vis_opt_path_hides');
        if (hideEl) {
          hideEl.parentNode.removeChild(hideEl);
        }
      }
    },
    finished() {
      return finished;
    },
    addScript(src) {
      const script = n.createElement('script');
      script.src = src;
      if (o?.nonce) {
        script.setAttribute('nonce', o.nonce);
      }
      script.setAttribute('data-loader', LOAD_ORIGIN);
      script.fetchPriority = 'high';
      n.head.appendChild(script);
    },
    init() {
      t._settings_timer = setTimeout(() => {
        code.finish();
      }, this.settings_tolerance());

      const style = n.createElement('style');
      style.id = '_vis_opt_path_hides';
      if (o?.nonce) {
        style.setAttribute('nonce', o.nonce);
      }
      style.textContent = this.hide_element() + this.hide_element_style();
      n.head.appendChild(style);
      this.addScript(`https://edge.wingify.net/tag/${account_id}.js`);
    },
  };

  t._wingify_code = code;
  code.init();
}

export { loadNativeSdk };
