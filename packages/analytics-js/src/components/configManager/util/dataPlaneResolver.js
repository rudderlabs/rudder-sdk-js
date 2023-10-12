import { CONFIG_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { UNSUPPORTED_RESIDENCY_SERVER_REGION_WARNING } from '../../../constants/logMessages';
import { isValidUrl } from '../../utilities/url';
const DEFAULT_REGION = 'US';
/**
 * A function to get url from source config response
 * @param {array} urls    An array of objects containing urls
 * @returns
 */
const getDefaultUrlOfRegion = urls => {
  let url;
  if (Array.isArray(urls) && urls.length > 0) {
    const obj = urls.find(elem => elem.default === true);
    if (obj && isValidUrl(obj.url)) {
      return obj.url;
    }
  }
  return url;
};
const validateResidencyServerRegion = (residencyServerRegion, logger) => {
  const residencyServerRegions = ['US', 'EU'];
  if (residencyServerRegion && !residencyServerRegions.includes(residencyServerRegion)) {
    logger === null || logger === void 0
      ? void 0
      : logger.warn(
          UNSUPPORTED_RESIDENCY_SERVER_REGION_WARNING(
            CONFIG_MANAGER,
            residencyServerRegion,
            DEFAULT_REGION,
          ),
        );
    return undefined;
  }
  return residencyServerRegion;
};
/**
 * A function to determine the dataPlaneUrl
 * @param {Object} dataplanes An object containing dataPlaneUrl for different region
 * @param {String} serverUrl dataPlaneUrl provided in the load call
 * @param {String} residencyServerRegion User provided residency server region
 * @param {Logger} logger logger instance
 * @returns The data plane URL string to use
 */
const resolveDataPlaneUrl = (dataplanes, serverUrl, residencyServerRegion, logger) => {
  var _a;
  // Check if dataPlanes object is present in source config
  if (dataplanes && Object.keys(dataplanes).length > 0) {
    const region =
      (_a = validateResidencyServerRegion(residencyServerRegion, logger)) !== null && _a !== void 0
        ? _a
        : DEFAULT_REGION;
    const regionUrlArr = dataplanes[region] || dataplanes[DEFAULT_REGION];
    const defaultUrl = getDefaultUrlOfRegion(regionUrlArr);
    if (defaultUrl) {
      return defaultUrl;
    }
  }
  // return the dataPlaneUrl provided in load API(if available)
  if (serverUrl) {
    return serverUrl;
  }
  // return undefined if data plane url can not be determined
  return undefined;
};
export { resolveDataPlaneUrl };
