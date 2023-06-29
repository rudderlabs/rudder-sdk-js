import { RegionDetails, ResidencyServerRegion } from '@rudderstack/common/types/DataResidency';
import { ILogger } from '@rudderstack/common/types/Logger';
import { isValidUrl } from '../../utilities/url';

const DEFAULT_REGION = 'US';

/**
 * A function to get url from source config response
 * @param {array} urls    An array of objects containing urls
 * @returns
 */
const getDefaultUrlOfRegion = (urls?: RegionDetails[]) => {
  let url;
  if (Array.isArray(urls) && urls.length > 0) {
    const obj = urls.find(elem => elem.default === true);
    if (obj && isValidUrl(obj.url)) {
      return obj.url;
    }
  }
  return url;
};

const validateResidencyServerRegionInput = (
  residencyServerRegion?: ResidencyServerRegion,
  logger?: ILogger,
) => {
  if (
    residencyServerRegion &&
    !Object.values(ResidencyServerRegion).includes(residencyServerRegion)
  ) {
    logger?.error(`Invalid residencyServer input: '${residencyServerRegion}'`);
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
const resolveDataPlaneUrl = (
  dataplanes?: Record<ResidencyServerRegion, RegionDetails[]>,
  serverUrl?: string,
  residencyServerRegion?: ResidencyServerRegion,
  logger?: ILogger,
) => {
  // Check if dataPlanes object is present in source config
  if (dataplanes && Object.keys(dataplanes).length > 0) {
    const region =
      validateResidencyServerRegionInput(residencyServerRegion, logger) ?? DEFAULT_REGION;
    const regionUrlArr: RegionDetails[] = dataplanes[region] || dataplanes[DEFAULT_REGION];

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
