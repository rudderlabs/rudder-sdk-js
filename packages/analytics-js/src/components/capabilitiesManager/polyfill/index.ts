import { legacyJSEngineRequiredPolyfills } from '../detection/dom';

const POLYFILL_URL = `https://polyfill.io/v3/polyfill.min.js?features=${Object.keys(
  legacyJSEngineRequiredPolyfills,
).join('%2C')}`;

const POLYFILL_LOAD_TIMEOUT = 10 * 1000; // 10 seconds

const POLYFILL_SCRIPT_ID = 'rudderstackPolyfill';

export { POLYFILL_URL, POLYFILL_LOAD_TIMEOUT, POLYFILL_SCRIPT_ID };
