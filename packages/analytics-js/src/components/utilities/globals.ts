import { ExposedGlobals, IRudderStackGlobals } from '../../app/IRudderStackGlobals';

/**
 * Create globally accessible RudderStackGlobals object
 */
const createExposedGlobals = (analyticsInstanceId = 'app') => {
  if (!(window as any).RudderStackGlobals) {
    (window as any).RudderStackGlobals = {} as IRudderStackGlobals;
  }

  if (!(window as any).RudderStackGlobals[analyticsInstanceId]) {
    (window as any).RudderStackGlobals[analyticsInstanceId] = {} as IRudderStackGlobals;
  }
};

/**
 * Add move values to globally accessible RudderStackGlobals object per analytics instance
 */
const setExposedGlobal = (keyName: string, value?: any, analyticsInstanceId = 'app') => {
  createExposedGlobals(analyticsInstanceId);
  (window as any).RudderStackGlobals[analyticsInstanceId][keyName] = value;
};

/**
 * Get values from globally accessible RudderStackGlobals object by analytics instance
 */
const getExposedGlobal = (
  keyName: string,
  analyticsInstanceId = 'app',
): Partial<ExposedGlobals> => {
  createExposedGlobals(analyticsInstanceId);
  return (window as any).RudderStackGlobals[analyticsInstanceId][keyName];
};

export { createExposedGlobals, setExposedGlobal, getExposedGlobal };
