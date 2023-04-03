import { Destination } from '@rudderstack/analytics-js/state/types';
import { ConfigResponseDestinationItem } from '../types';

const filterEnabledDestination = (
  destinations: ConfigResponseDestinationItem[],
): Destination[] | [] => {
  const nativeDestinations: Destination[] = [];
  destinations.forEach((destination: ConfigResponseDestinationItem) => {
    if (destination.enabled && destination.deleted !== true) {
      nativeDestinations.push({
        id: destination.id,
        name: destination.destinationDefinition.name,
        config: destination.config,
        areTransformationsConnected: destination.areTransformationsConnected || false,
      });
    }
  });
  return nativeDestinations;
};

export { filterEnabledDestination };
