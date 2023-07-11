import { Destination } from '@rudderstack/analytics-js-common/types/Destination';
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

export { filterEnabledDestination };
