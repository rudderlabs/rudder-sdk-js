import { legacyJSEngineRequiredPolyfills } from '../detection/dom';
const polyfillIoSdkUrl: string = __RS_POLYFILLIO_SDK_URL__;
const POLYFILL_URL =
  polyfillIoSdkUrl !== ''
    ? `${polyfillIoSdkUrl}?version=3.111.0&features=${Object.keys(
        legacyJSEngineRequiredPolyfills,
      ).join('%2C')}`
    : '';

const POLYFILL_LOAD_TIMEOUT = 10 * 1000; // 10 seconds

const POLYFILL_SCRIPT_ID = 'rudderstackPolyfill';

export { POLYFILL_URL, POLYFILL_LOAD_TIMEOUT, POLYFILL_SCRIPT_ID };
