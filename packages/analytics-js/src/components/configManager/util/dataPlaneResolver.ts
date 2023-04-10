import { RegionDetails, ResidencyServerRegion } from '@rudderstack/analytics-js/state/types';
import { isValidUrl } from '../../utilities/url';

const DEFAULT_REGION = 'US';

/**
 * A function to get url from source config response
 * @param {array} urls    An array of objects containing urls
 * @returns
 */
const getDefaultUrlofRegion = (urls?: RegionDetails[]) => {
  let url;
  if (Array.isArray(urls) && urls.length > 0) {
    const obj = urls.find(elem => elem.default === true);
    if (obj && isValidUrl(obj.url)) {
      return obj.url;
    }
  }
  return url;
};
/**
 * A function to determine the dataPlaneUrl
 * @param {Object} dataPlaneUrls An object containing dataPlaneUrl for different region
 * @param {String} serverUrl dataPlaneUrl provided in the load call
 * @param {String} residencyServerRegion User provided residency server region
 * @returns string
 */
const resolveDataPlaneUrl = (
  dataplanes?: Record<ResidencyServerRegion, RegionDetails[]>,
  serverUrl?: string,
  residencyServerRegion?: ResidencyServerRegion,
) => {
  // Check if dataPlanes object is present in source config
  if (dataplanes && Object.keys(dataplanes).length > 0) {
    const region = residencyServerRegion || DEFAULT_REGION;
    const regionUrlArr: RegionDetails[] = dataplanes[region] || dataplanes[DEFAULT_REGION];

    const defaultUrl = getDefaultUrlofRegion(regionUrlArr);
    if (defaultUrl) {
      return defaultUrl;
    }
  }
  // return the dataPlaneUrl provided in load API(if available)
  if (serverUrl) {
    return serverUrl;
  }

  // TODO: do we need to format the error message?
  // Throw error if correct data plane url is not provided
  throw Error(`Unable to load the SDK due to invalid data plane URL`);
};

export { resolveDataPlaneUrl };
