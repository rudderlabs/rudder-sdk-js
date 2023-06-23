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
        displayName: destination.destinationDefinition.displayName,
        config: destination.config,
        enableTransformationForDeviceMode: destination.enableTransformationForDeviceMode || false,
        propagateEventsUntransformedOnError:
          destination.propagateEventsUntransformedOnError || false,
        userFriendlyId: `${destination.destinationDefinition.displayName.replaceAll(' ', '_')}___${
          destination.id
        }`,
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
      destination.config.useNativeSDKToSend === true || // this is the older flag for hybrid mode destinations
      destination.config.useNativeSDK === true,
  );

const isHybridModeDestination = (destination: Destination): boolean =>
  Boolean(
    destination.config.connectionMode === DestinationConnectionMode.Hybrid ||
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

export {
  filterEnabledDestination,
  isNonCloudDestination,
  getNonCloudDestinations,
  isHybridModeDestination,
};
