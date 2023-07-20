import { signal } from '@preact/signals-core';
import { StorageState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const storageState: StorageState = {
  encryptionPluginName: signal(undefined),
  migrate: signal(false),
};

export { storageState };
