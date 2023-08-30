import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';

function loadNativeSdk(widgetId) {
  (function (widgetId) {
    const se = document.createElement('script');
    se.type = 'text/javascript';
    se.async = true;
    se.src = `https://storage.googleapis.com/code.snapengage.com/js/${widgetId}.js`;
    se.setAttribute('data-loader', LOAD_ORIGIN);
    let done = false;
    se.onload = se.onreadystatechange = function () {
      if (
        !done &&
        (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')
      ) {
        done = true;
      }
    };
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(se, s);
  })(widgetId);
}

export { loadNativeSdk };
