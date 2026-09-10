/**
 * Loader for the OpenAI Ads Measurement Pixel.
 * https://developers.openai.com/ads/measurement-pixel
 *
 * `installQueue` and the async script insert mirror OpenAI's own install snippet. The `oaiq.q`
 * array is load-bearing: calls made before `oaiq.min.js` arrives are buffered there, and the
 * vendor script drains that exact property on load, so it must not be renamed.
 */
import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';
import { PIXEL_URL, SCRIPT_ID } from './constants';

let sdkLoadStarted = false;

const installQueue = () => {
  if (typeof window.oaiq === 'function') {
    return;
  }

  const oaiq = function () {
    oaiq.q.push(arguments);
  };
  oaiq.q = [];
  window.oaiq = oaiq;
};

const loadNativeSdk = () => {
  installQueue();

  if (sdkLoadStarted || document.getElementById(SCRIPT_ID)) {
    sdkLoadStarted = true;
    return;
  }

  sdkLoadStarted = true;
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = PIXEL_URL;
  script.setAttribute('data-loader', LOAD_ORIGIN);

  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.getElementsByTagName('head')[0].appendChild(script);
  }
};

const initPixel = pixelId => {
  if (typeof window.oaiq !== 'function') {
    return;
  }
  window.oaiq('init', { pixelId });
};

const isNativeSdkLoaded = () => typeof window.oaiq === 'function';

const resetNativeSdkLoaderForTests = () => {
  sdkLoadStarted = false;
};

export { loadNativeSdk, initPixel, isNativeSdkLoaded, resetNativeSdkLoaderForTests };
