import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(
  account_id,
  settings_tolerance,
  library_tolerance,
  use_existing_jquery,
  isSPA,
) {
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
}

export { loadNativeSdk };
