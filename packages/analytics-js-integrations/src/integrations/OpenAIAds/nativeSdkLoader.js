import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';
import { PIXEL_URL } from './constants';

const SCRIPT_ID = 'openai-ads-measurement-pixel';

let sdkLoadStarted = false;

const installQueue = () => {
  if (typeof window.oaiq === 'function') {
    window.oaiq.queue = window.oaiq.queue || [];
    return;
  }

  const queue = [];
  window.oaiq = function () {
    queue.push(arguments);
  };
  window.oaiq.queue = queue;
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
  if (!pixelId || typeof window.oaiq !== 'function') {
    return;
  }
  window.oaiq('init', { pixelId });
};

const isNativeSdkLoaded = () => typeof window.oaiq === 'function';

const resetNativeSdkLoaderForTests = () => {
  sdkLoadStarted = false;
};

export { loadNativeSdk, initPixel, isNativeSdkLoaded, resetNativeSdkLoaderForTests };
