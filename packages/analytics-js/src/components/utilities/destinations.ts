import { Destination, DestinationConnectionMode } from '@rudderstack/analytics-js/state/types';
import { ConfigResponseDestinationItem } from '../configManager/types';

/**
 * A function to filter enabled destinations and map to required properties only
 * @param destinations
 *
 * @returns Destination[]
 */
const filterEnabledDestination = (destinations: ConfigResponseDestinationItem[]): Destination[] => {
  const nativeDestinations: Destination[] = [];
  destinations.forEach((destination: ConfigResponseDestinationItem) => {
    if (destination.enabled && !destination.deleted) {
      nativeDestinations.push({
        id: destination.id,
        definitionName: destination.destinationDefinition.name,
        config: destination.config,
        areTransformationsConnected: destination.areTransformationsConnected,
      });
    }
  });
  return nativeDestinations;
};

/**
 * A function to filter and return non cloud mode destinations
 * @param destination
 *
 * @returns boolean
 */
const isNonCloudDestination = (destination: Destination): boolean =>
  Boolean(
    destination.config.connectionMode !== DestinationConnectionMode.Cloud ||
      destination.config.useNativeSDKToSend,
  );

/**
 * A function to filter and return non cloud mode destinations
 * @param destinations
 *
 * @returns destinations
 */
const getNonCloudDestinations = (destinations: Destination[]): Destination[] | [] =>
  destinations.filter(isNonCloudDestination);

export { filterEnabledDestination, isNonCloudDestination, getNonCloudDestinations };
