const getUserAgentClientHint = (callback, level = 'none') => {
  var _a;
  if (level === 'none') {
    callback(undefined);
  }
  if (level === 'default') {
    callback(navigator.userAgentData);
  }
  if (level === 'full') {
    (_a = navigator.userAgentData) === null || _a === void 0
      ? void 0
      : _a
          .getHighEntropyValues([
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
