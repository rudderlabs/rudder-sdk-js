const getUserAgentClientHint = (callback: (uaCH?: UADataValues) => void, level = 'none') => {
  if (level === 'none') {
    callback(undefined);
  }
  if (level === 'default') {
    callback(navigator.userAgentData);
  }
  if (level === 'full') {
    navigator.userAgentData
      ?.getHighEntropyValues([
        'architecture',
        'bitness',
        'brands',
        'mobile',
        'model',
        'platform',
        'platformVersion',
        'uaFullVersion',
        'fullVersionList',
        'wow64',
      ])
      .then(ua => {
        callback(ua);
      })
      .catch(() => {
        callback();
      });
  }
};

export { getUserAgentClientHint };
