import { legacyJSEngineRequiredPolyfills } from '../detection/dom';
const polyfillIoSdkUrl: string = __RS_POLYFILLIO_SDK_URL__;
const POLYFILL_URL =
  polyfillIoSdkUrl !== ''
    ? // Pure so the modern build, which never reads it, drops it and the detection list
      `${polyfillIoSdkUrl}?version=3.111.0&flags=always%2Cgated&features=${
        /* @__PURE__ */ Object.keys(legacyJSEngineRequiredPolyfills).join('%2C')
      }`
    : '';

const POLYFILL_LOAD_TIMEOUT = 10 * 1000; // 10 seconds

const POLYFILL_SCRIPT_ID = 'rudderstackPolyfill';

export { POLYFILL_URL, POLYFILL_LOAD_TIMEOUT, POLYFILL_SCRIPT_ID };
