import { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { ConfigResponseDestinationItem } from '../configManager/types';
/**
 * A function to filter enabled destinations and map to required properties only
 * @param destinations
 *
 * @returns Destination[]
 */
declare const filterEnabledDestination: (
  destinations: ConfigResponseDestinationItem[],
) => Destination[];
export { filterEnabledDestination };
