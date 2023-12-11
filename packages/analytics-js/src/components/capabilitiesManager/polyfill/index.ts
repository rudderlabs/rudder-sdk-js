import { legacyJSEngineRequiredPolyfills } from '../detection/dom';

// eslint-disable-next-line no-constant-condition
const POLYFILL_URL = '__RS_POLYFILLIO_SDK_URL__'
  ? `__RS_POLYFILLIO_SDK_URL__?version=3.111.0&features=${Object.keys(
      legacyJSEngineRequiredPolyfills,
    ).join('%2C')}`
  : '';

const POLYFILL_LOAD_TIMEOUT = 10 * 1000; // 10 seconds

const POLYFILL_SCRIPT_ID = 'rudderstackPolyfill';

export { POLYFILL_URL, POLYFILL_LOAD_TIMEOUT, POLYFILL_SCRIPT_ID };
