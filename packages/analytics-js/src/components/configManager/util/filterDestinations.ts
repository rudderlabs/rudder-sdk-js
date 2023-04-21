import { Destination } from '@rudderstack/analytics-js/state/types';
import { ConfigResponseDestinationItem } from '../types';

/**
 * A function to filter enabled destinations and map required properties
 * @param destinations
 * @returns
 */
const filterEnabledDestination = (
  destinations: ConfigResponseDestinationItem[],
): Destination[] | [] => {
  const nativeDestinations: Destination[] = [];
  destinations.forEach((destination: ConfigResponseDestinationItem) => {
    if (destination.enabled && destination.deleted !== true) {
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

export { filterEnabledDestination };
