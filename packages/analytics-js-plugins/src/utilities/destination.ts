import { isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import {
  DestinationIntgConfig,
  IntegrationOpts,
} from '@rudderstack/analytics-js-common/types/Integration';
import { Destination } from '@rudderstack/analytics-js-common/types/Destination';

const isDestIntgConfigTruthy = (destIntgConfig: DestinationIntgConfig): boolean =>
  !isUndefined(destIntgConfig) && Boolean(destIntgConfig) === true;

const isDestIntgConfigFalsy = (destIntgConfig: DestinationIntgConfig): boolean =>
  !isUndefined(destIntgConfig) && Boolean(destIntgConfig) === false;

/**
 * Filters the destinations that should not be loaded or forwarded events to based on the integration options (load or events API)
 * @param intgOpts Integration options object
 * @param destinations Destinations array
 * @returns Destinations array filtered based on the integration options
 */
const filterDestinations = (intgOpts: IntegrationOpts, destinations: Destination[]) => {
  const allOptVal = intgOpts.All;
  return destinations.filter(dest => {
    const destDisplayName = dest.displayName;
    let isDestEnabled;
    if (allOptVal) {
      isDestEnabled = true;
      if (isDestIntgConfigFalsy(intgOpts[destDisplayName])) {
        isDestEnabled = false;
      }
    } else {
      isDestEnabled = false;
      if (isDestIntgConfigTruthy(intgOpts[destDisplayName])) {
        isDestEnabled = true;
      }
    }
    return isDestEnabled;
  });
};

export { isDestIntgConfigTruthy, isDestIntgConfigFalsy, filterDestinations };
