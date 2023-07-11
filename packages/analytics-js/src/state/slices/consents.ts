import { signal } from '@preact/signals-core';
import { ConsentsState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const consentsState: ConsentsState = {
  deniedConsentIds: signal([]),
  allowedConsents: signal({}),
  activeConsentProviderPluginName: signal(undefined),
  consentProviderInitialized: signal(false),
};

export { consentsState };
