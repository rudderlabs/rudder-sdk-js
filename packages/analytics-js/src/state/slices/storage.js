import { signal } from '@preact/signals-core';
const storageState = {
  encryptionPluginName: signal(undefined),
  migrate: signal(false),
  type: signal(undefined),
  cookie: signal(undefined),
  entries: signal({}),
  trulyAnonymousTracking: signal(false),
};
export { storageState };
