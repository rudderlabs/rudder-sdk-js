import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import type { ConfigResponseDestinationItem } from '@rudderstack/analytics-js-common/types/LoadOptions';

/**
 * A function to filter enabled destinations and map to required properties only
 * @param destinations
 *
 * @returns Destination[]
 */
const filterEnabledDestination = (destinations: ConfigResponseDestinationItem[]): Destination[] => {
  const nativeDestinations: Destination[] = [];
  destinations.forEach((destination: ConfigResponseDestinationItem) => {
    if (destination.enabled) {
      nativeDestinations.push({
        id: destination.id,
        displayName: destination.destinationDefinition.displayName,
        config: destination.config,
        shouldApplyDeviceModeTransformation:
          destination.shouldApplyDeviceModeTransformation || false,
        propagateEventsUntransformedOnError:
          destination.propagateEventsUntransformedOnError || false,
        userFriendlyId: `${destination.destinationDefinition.displayName.replaceAll(' ', '-')}___${
          destination.id
        }`,
      });
    }
  });
  return nativeDestinations;
};

export { filterEnabledDestination };
