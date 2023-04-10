import { removeTrailingSlashes } from '../../utilities/url';

/**
 * Determines the SDK url and also returns a boolean value determining if SDK is a staging SDK
 * @returns { sdkURL, isStaging }
 */
const getSDKUrlInfo = () => {
  const scripts = document.getElementsByTagName('script');
  let sdkURL;
  let isStaging = false;
  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < scripts.length; i += 1) {
    const curScriptSrc = removeTrailingSlashes(scripts[i].getAttribute('src'));
    if (curScriptSrc) {
      const urlMatches = curScriptSrc.match(/^.*rudder-analytics(-staging)?(\.min)?\.js$/);
      if (urlMatches) {
        sdkURL = curScriptSrc;
        isStaging = urlMatches[1] !== undefined;
        break;
      }
    }
  }
  return { sdkURL, isStaging };
};

export { getSDKUrlInfo };
