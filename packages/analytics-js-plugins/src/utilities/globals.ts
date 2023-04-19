const getExposedGlobal = (keyName: string, analyticsInstanceId = 'analytics'): any => {
  return (window as any).RudderStackGlobals[analyticsInstanceId][keyName];
};

export { getExposedGlobal };
