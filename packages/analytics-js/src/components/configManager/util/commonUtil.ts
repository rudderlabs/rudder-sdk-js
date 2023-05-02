import { removeTrailingSlashes } from '../../utilities/url';

/**
 * Determines the SDK url and also returns a boolean value determining if SDK is a staging SDK
 * @returns { sdkURL, isStaging }
 */
const getSDKUrlInfo = () => {
  const scripts = document.getElementsByTagName('script');
  let sdkURL: string | undefined;
  let isStaging = false;
  const scriptList = Array.prototype.slice.call(scripts);
  scriptList.some(script => {
    const curScriptSrc = removeTrailingSlashes(script.getAttribute('src'));
    if (curScriptSrc) {
      const urlMatches = curScriptSrc.match(/^.*rudder-analytics(-staging)?(\.min)?\.js$/); // TODO: fetch 'rudder-analytics' this string from rollup
      if (urlMatches) {
        sdkURL = curScriptSrc;
        isStaging = urlMatches[1] !== undefined;
        return true;
      }
    }
    return false;
  });
  // TODO: Return the URL object instead of the plain URL string
  return { sdkURL, isStaging };
};

export { getSDKUrlInfo };
