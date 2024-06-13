import type { DebouncedFunction } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { DEBOUNCED_TIMEOUT_MS } from '../../constants/timeouts';
import type { ExposedGlobals, IRudderStackGlobals } from '../../app/IRudderStackGlobals';

/**
 * Create globally accessible RudderStackGlobals object
 */
const createExposedGlobals = (analyticsInstanceId = 'app') => {
  if (!(globalThis as typeof window).RudderStackGlobals) {
    (globalThis as typeof window).RudderStackGlobals = {} as IRudderStackGlobals;
  }

  if (!(globalThis as typeof window).RudderStackGlobals[analyticsInstanceId]) {
    (globalThis as typeof window).RudderStackGlobals[analyticsInstanceId] =
      {} as IRudderStackGlobals;
  }
};

/**
 * Add move values to globally accessible RudderStackGlobals object per analytics instance
 */
const setExposedGlobal = (keyName: string, value?: any, analyticsInstanceId = 'app') => {
  createExposedGlobals(analyticsInstanceId);
  ((globalThis as typeof window).RudderStackGlobals[analyticsInstanceId] as ExposedGlobals)[
    keyName
  ] = value;
};

/**
 * Get values from globally accessible RudderStackGlobals object by analytics instance
 */
const getExposedGlobal = (
  keyName: string,
  analyticsInstanceId = 'app',
): Partial<ExposedGlobals> => {
  createExposedGlobals(analyticsInstanceId);
  return ((globalThis as typeof window).RudderStackGlobals[analyticsInstanceId] as ExposedGlobals)[
    keyName
  ];
};

function debounce(
  func: DebouncedFunction,
  thisArg: any,
  delay: number = DEBOUNCED_TIMEOUT_MS,
): DebouncedFunction {
  let timeoutId: number;

  return (...args: any[]) => {
    (globalThis as typeof window).clearTimeout(timeoutId);

    timeoutId = (globalThis as typeof window).setTimeout(() => {
      func.apply(thisArg, args);
    }, delay);
  };
}

export { createExposedGlobals, setExposedGlobal, getExposedGlobal, debounce };
