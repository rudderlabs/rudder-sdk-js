import {
  DestinationIntgConfig,
  IntegrationOpts,
} from '@rudderstack/analytics-js-common/types/Integration';
import { Destination } from '@rudderstack/analytics-js-common/types/Destination';
declare const isDestIntgConfigTruthy: (destIntgConfig: DestinationIntgConfig) => boolean;
declare const isDestIntgConfigFalsy: (destIntgConfig: DestinationIntgConfig) => boolean;
/**
 * Filters the destinations that should not be loaded or forwarded events to based on the integration options (load or events API)
 * @param intgOpts Integration options object
 * @param destinations Destinations array
 * @returns Destinations array filtered based on the integration options
 */
declare const filterDestinations: (
  intgOpts: IntegrationOpts,
  destinations: Destination[],
) => Destination[];
export { isDestIntgConfigTruthy, isDestIntgConfigFalsy, filterDestinations };
