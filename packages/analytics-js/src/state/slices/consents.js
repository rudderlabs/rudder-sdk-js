import { signal } from '@preact/signals-core';
const consentsState = {
  data: signal({ initialized: false }),
  activeConsentManagerPluginName: signal(undefined),
  preConsentOptions: signal({ enabled: false }),
};
export { consentsState };
