import { signal } from '@preact/signals-core';
import { ConsentsState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const consentsState: ConsentsState = {
  enabled: signal(false),
  initialized: signal(false),
  data: signal({}),
  activeConsentManagerPluginName: signal(undefined),
  preConsent: signal({ enabled: false }),
  postConsent: signal({
    discardPreConsentEvents: false,
    sendPageEvent: false,
    trackConsent: false,
  }),
};

export { consentsState };
