import { RegionDetails, ResidencyServerRegion } from '@rudderstack/analytics-js/state/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
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

const validateResidencyServerRegion = (
  residencyServerRegion?: ResidencyServerRegion,
  logger?: ILogger,
) => {
  if (
    residencyServerRegion &&
    !Object.values(ResidencyServerRegion).includes(residencyServerRegion)
  ) {
    logger?.warn(
      `ConfigManager:: The residency server region "${residencyServerRegion}" is not supported. Please choose one of the following supported regions: "${Object.values(
        ResidencyServerRegion,
      )}". The default region "${DEFAULT_REGION}" will be used instead.`,
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
const resolveDataPlaneUrl = (
  dataplanes?: Record<ResidencyServerRegion, RegionDetails[]>,
  serverUrl?: string,
  residencyServerRegion?: ResidencyServerRegion,
  logger?: ILogger,
) => {
  // Check if dataPlanes object is present in source config
  if (dataplanes && Object.keys(dataplanes).length > 0) {
    const region = validateResidencyServerRegion(residencyServerRegion, logger) ?? DEFAULT_REGION;
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
