import { DEBOUNCED_TIMEOUT_MS } from '../../constants/timeouts';
/**
 * Create globally accessible RudderStackGlobals object
 */
const createExposedGlobals = (analyticsInstanceId = 'app') => {
  if (!globalThis.RudderStackGlobals) {
    globalThis.RudderStackGlobals = {};
  }
  if (!globalThis.RudderStackGlobals[analyticsInstanceId]) {
    globalThis.RudderStackGlobals[analyticsInstanceId] = {};
  }
};
/**
 * Add move values to globally accessible RudderStackGlobals object per analytics instance
 */
const setExposedGlobal = (keyName, value, analyticsInstanceId = 'app') => {
  createExposedGlobals(analyticsInstanceId);
  globalThis.RudderStackGlobals[analyticsInstanceId][keyName] = value;
};
/**
 * Get values from globally accessible RudderStackGlobals object by analytics instance
 */
const getExposedGlobal = (keyName, analyticsInstanceId = 'app') => {
  createExposedGlobals(analyticsInstanceId);
  return globalThis.RudderStackGlobals[analyticsInstanceId][keyName];
};
function debounce(func, thisArg, delay = DEBOUNCED_TIMEOUT_MS) {
  let timeoutId;
  return (...args) => {
    globalThis.clearTimeout(timeoutId);
    timeoutId = globalThis.setTimeout(() => {
      func.apply(thisArg, args);
    }, delay);
  };
}
export { createExposedGlobals, setExposedGlobal, getExposedGlobal, debounce };
