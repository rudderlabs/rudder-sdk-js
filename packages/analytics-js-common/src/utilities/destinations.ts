import type { Destination } from '../types/Destination';

/**
 * A function to filter and return non cloud mode destinations
 * A destination is considered non cloud mode if it is not a cloud mode destination or if it is a hybrid mode destination
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

/**
 * A function to get the user friendly id for a destination
 * Replaces all spaces with hyphens and appends the id to the display name
 * @param displayName The display name of the destination
 * @param id The id of the destination
 *
 * @returns the user friendly id
 */
const getDestinationUserFriendlyId = (displayName: string, id: string): string =>
  `${displayName.replaceAll(' ', '-')}___${id}`;

export {
  isNonCloudDestination,
  getNonCloudDestinations,
  isHybridModeDestination,
  getDestinationUserFriendlyId,
};
