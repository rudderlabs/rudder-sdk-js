import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { DestinationConfig } from '@rudderstack/analytics-js-common/types/Destination';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { DESTINATION_CONSENT_STATUS_ERROR } from './constants';
import type { ConsentResolutionStrategy } from '@rudderstack/analytics-js-common/types/Consent';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isDestinationConsented = (
  state: ApplicationState,
  destConfig: DestinationConfig,
  pluginName: string,
  errorHandler?: IErrorHandler,
  logger?: ILogger,
): boolean => {
  try {
    if (!state.consents.initialized.value) {
      return true;
    }

    const { consentManagement } = destConfig;
    if (!consentManagement) {
      return true;
    }

    // Get the corresponding consents configured for the provider
    const cmpConfig = consentManagement.find(c => c.provider === state.consents.provider.value);

    // If there are no consents configured for the destination for the current provider, events should be sent.
    if (!cmpConfig?.consents) {
      return true;
    }

    // sanitize the configured consents
    const configuredConsents = cmpConfig.consents.map(c => c.consent?.trim()).filter(Boolean);

    const allowedConsentIds = state.consents.data.value.allowedConsentIds as string[];
    const matchPredicate = (consent: string) => allowedConsentIds.includes(consent);

    // match the configured consents with user provided consents as per
    // the configured resolution strategy
    let resolutionStrategy = state.consents.resolutionStrategy.value;
    if (state.consents.provider.value === 'custom') {
      resolutionStrategy = cmpConfig.resolutionStrategy as ConsentResolutionStrategy;
    }

    switch (resolutionStrategy) {
      case 'any':
      case 'or': // Deprecated
        return configuredConsents.some(matchPredicate) || configuredConsents.length === 0;
      case 'all':
      case 'and': // Deprecated
      default:
        return configuredConsents.every(matchPredicate);
    }
  } catch (err) {
    errorHandler?.onError(err, pluginName, DESTINATION_CONSENT_STATUS_ERROR);
    return true;
  }
};

export { isDestinationConsented };
