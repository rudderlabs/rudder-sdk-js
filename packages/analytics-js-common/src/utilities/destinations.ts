import { Destination } from '../types/Destination';

/**
 * A function to filter and return non cloud mode destinations
 * @param destination
 *
 * @returns boolean
 */
const isNonCloudDestination = (destination: Destination): boolean =>
  Boolean(
    destination.config.connectionMode !== 'cloud' ||
      destination.config.useNativeSDKToSend === true || // this is the older flag for hybrid mode destinations
      destination.config.useNativeSDK === true,
  );

const isHybridModeDestination = (destination: Destination): boolean =>
  Boolean(
    destination.config.connectionMode === 'hybrid' ||
      destination.config.useNativeSDKToSend === true,
  );

/**
 * A function to filter and return non cloud mode destinations
 * @param destinations
 *
 * @returns destinations
 */
const getNonCloudDestinations = (destinations: Destination[]): Destination[] | [] =>
  destinations.filter(isNonCloudDestination);

export { isNonCloudDestination, getNonCloudDestinations, isHybridModeDestination };
