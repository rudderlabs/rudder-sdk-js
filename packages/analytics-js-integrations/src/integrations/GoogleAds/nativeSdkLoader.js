import { DISPLAY_NAME } from '@rudderstack/analytics-js-common/constants/integrations/GoogleAds/constants';
import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';
import Logger from '../../utils/logger';

const logger = new Logger(DISPLAY_NAME);

function loadNativeSdk(sourceUrl) {
  (function (id, src, document) {
    logger.info(`in script loader=== ${id}`);
    const js = document.createElement('script');
    js.src = src;
    js.async = 1;
    js.setAttribute('data-loader', LOAD_ORIGIN);
    js.type = 'text/javascript';
    js.id = id;
    const e = document.getElementsByTagName('head')[0];
    e.appendChild(js);
  })('googleAds-integration', sourceUrl, document);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
}

export { loadNativeSdk };
