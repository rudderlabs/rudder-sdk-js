const getExposedGlobal = (keyName: string, analyticsInstanceId = 'analytics'): any =>
  (globalThis as any).RudderStackGlobals[analyticsInstanceId][keyName];

export { getExposedGlobal };
