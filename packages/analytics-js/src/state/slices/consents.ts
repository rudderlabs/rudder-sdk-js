import { signal } from '@preact/signals-core';
import { ConsentsState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const consentsState: ConsentsState = {
  data: signal({ initialized: false }),
  activeConsentManagerPluginName: signal(undefined),
};

export { consentsState };
