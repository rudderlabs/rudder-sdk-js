import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';
import { PIXEL_URL } from './constants';

const SCRIPT_ID = 'openai-ads-measurement-pixel';
const initializedPixels = new Set();

let sdkLoadStarted = false;
let sdkLoaded = false;

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
  script.onload = script.onreadystatechange = function () {
    const readyState = this.readyState;
    if (!readyState || readyState === 'loaded' || readyState === 'complete') {
      sdkLoaded = true;
      script.onload = null;
      script.onreadystatechange = null;
    }
  };

  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.getElementsByTagName('head')[0].appendChild(script);
  }
};

const initPixel = pixelId => {
  if (!pixelId || initializedPixels.has(pixelId)) {
    return;
  }
  initializedPixels.add(pixelId);
  window.oaiq('init', { pixelId });
};

const isNativeSdkLoaded = () => sdkLoaded === true && typeof window.oaiq === 'function';

const resetNativeSdkLoaderForTests = () => {
  sdkLoadStarted = false;
  sdkLoaded = false;
  initializedPixels.clear();
};

export { loadNativeSdk, initPixel, isNativeSdkLoaded, resetNativeSdkLoaderForTests };
