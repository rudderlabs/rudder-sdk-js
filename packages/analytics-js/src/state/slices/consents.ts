import { signal } from '@preact/signals-core';
import { ConsentsState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const consentsState: ConsentsState = {
  initialized: signal(false),
  data: signal({}),
  activeConsentManagerPluginName: signal(undefined),
  preConsent: signal({ enabled: false }),
};

export { consentsState };
