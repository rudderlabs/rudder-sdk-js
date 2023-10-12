import {
  RegionDetails,
  ResidencyServerRegion,
} from '@rudderstack/analytics-js-common/types/DataResidency';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
/**
 * A function to determine the dataPlaneUrl
 * @param {Object} dataplanes An object containing dataPlaneUrl for different region
 * @param {String} serverUrl dataPlaneUrl provided in the load call
 * @param {String} residencyServerRegion User provided residency server region
 * @param {Logger} logger logger instance
 * @returns The data plane URL string to use
 */
declare const resolveDataPlaneUrl: (
  dataplanes?: Record<ResidencyServerRegion, RegionDetails[]>,
  serverUrl?: string,
  residencyServerRegion?: ResidencyServerRegion,
  logger?: ILogger,
) => string | undefined;
export { resolveDataPlaneUrl };
