import { signal } from '@preact/signals-core';
import type { StorageState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const storageState: StorageState = {
  encryptionPluginName: signal(undefined),
  migrate: signal(false),
  type: signal(undefined),
  cookie: signal(undefined),
  entries: signal({}),
  trulyAnonymousTracking: signal(false),
};

export { storageState };
