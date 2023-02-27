const getUserAgentClientHint = async (level = 'none') => {
  let uach;

  switch (level) {
    case 'none':
      break;
    case 'default':
      if (navigator.userAgentData) {
        uach = navigator.userAgentData;
      }
      break;
    case 'full':
      if (navigator.userAgentData) {
        uach = await navigator.userAgentData.getHighEntropyValues([
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
        ]);
      }
      break;
    default:
      break;
  }
  return uach;
};

export { getUserAgentClientHint };
