const getExposedGlobal = (keyName: string, analyticsInstanceId = 'analytics'): any =>
  (window as any).RudderStackGlobals[analyticsInstanceId][keyName];

export { getExposedGlobal };
