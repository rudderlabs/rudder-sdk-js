import { clone } from 'ramda';
import { destCNamesToDisplayNamesMap } from '../constants/destCNamesToDisplayNames';
import { IntegrationOpts } from '../types/Integration';
import { isUndefined } from './checks';

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

export { normalizeIntegrationOptions };
