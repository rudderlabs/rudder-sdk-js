import { clone } from 'ramda';
import { destCNamesToDisplayNamesMap } from '../constants/destCNamesToDisplayNames';
import { Destination, DestinationConnectionMode } from '../types/Destination';
import { IntegrationOpts } from '../types/Integration';
import { isUndefined } from './checks';

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

/**
 * Converts the common names of the destinations to their display names
 * @param intgOptions Load or API integration options
 */
const normalizeIntegrationOptions = (intgOptions?: IntegrationOpts): IntegrationOpts => {
  const normalizedIntegrationOptions: IntegrationOpts = {};
  if (intgOptions) {
    Object.keys(intgOptions).forEach(key => {
      const destOpts = clone(intgOptions[key]);
      if (key === 'All') {
        normalizedIntegrationOptions[key] = Boolean(destOpts);
      } else {
        const displayName = destCNamesToDisplayNamesMap[key];
        if (displayName) {
          normalizedIntegrationOptions[displayName] = destOpts;
        } else {
          normalizedIntegrationOptions[key] = destOpts;
        }
      }
    });
  }

  if (isUndefined(normalizedIntegrationOptions.All)) {
    normalizedIntegrationOptions.All = true;
  }

  return normalizedIntegrationOptions;
};

export {
  isNonCloudDestination,
  getNonCloudDestinations,
  isHybridModeDestination,
  normalizeIntegrationOptions,
};
