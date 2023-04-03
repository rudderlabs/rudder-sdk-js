import { ExposedGlobals, IRudderStackGlobals } from './IRudderStackGlobals';

const prepareExposedGlobal = (analyticsInstanceId = 'analytics') => {
  if (!(window as any).RudderStackGlobals) {
    (window as any).RudderStackGlobals = {} as IRudderStackGlobals;
  }

  if (!(window as any).RudderStackGlobals[analyticsInstanceId]) {
    (window as any).RudderStackGlobals[analyticsInstanceId] = {} as IRudderStackGlobals;
  }
};

const setExposedGlobal = (keyName: string, value?: any, analyticsInstanceId = 'analytics') => {
  prepareExposedGlobal(analyticsInstanceId);
  (window as any).RudderStackGlobals[analyticsInstanceId][keyName] = value;
};

const getExposedGlobal = (
  keyName: string,
  analyticsInstanceId = 'analytics',
): Partial<ExposedGlobals> => {
  prepareExposedGlobal(analyticsInstanceId);
  return (window as any).RudderStackGlobals[analyticsInstanceId][keyName];
};

export { prepareExposedGlobal, setExposedGlobal, getExposedGlobal };
