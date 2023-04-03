import { ExposedGlobals, IRudderStackGlobals } from '../core/IRudderStackGlobals';

const createExposedGlobals = (analyticsInstanceId = 'analytics') => {
  if (!(window as any).RudderStackGlobals) {
    (window as any).RudderStackGlobals = {} as IRudderStackGlobals;
  }

  if (!(window as any).RudderStackGlobals[analyticsInstanceId]) {
    (window as any).RudderStackGlobals[analyticsInstanceId] = {} as IRudderStackGlobals;
  }
};

const setExposedGlobal = (keyName: string, value?: any, analyticsInstanceId = 'analytics') => {
  createExposedGlobals(analyticsInstanceId);
  (window as any).RudderStackGlobals[analyticsInstanceId][keyName] = value;
};

const getExposedGlobal = (
  keyName: string,
  analyticsInstanceId = 'analytics',
): Partial<ExposedGlobals> => {
  createExposedGlobals(analyticsInstanceId);
  return (window as any).RudderStackGlobals[analyticsInstanceId][keyName];
};

export { createExposedGlobals, setExposedGlobal, getExposedGlobal };
