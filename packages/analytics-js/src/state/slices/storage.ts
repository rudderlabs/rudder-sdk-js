import { signal } from '@preact/signals-core';
import { Entries, StorageState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { DEFAULT_STORAGE_TYPE } from '@rudderstack/analytics-js-common/types/Storage';

const defaultEntries: Entries = {
  userId: DEFAULT_STORAGE_TYPE,
  userTraits: DEFAULT_STORAGE_TYPE,
  anonymousId: DEFAULT_STORAGE_TYPE,
  groupId: DEFAULT_STORAGE_TYPE,
  groupTraits: DEFAULT_STORAGE_TYPE,
  initialReferrer: DEFAULT_STORAGE_TYPE,
  initialReferringDomain: DEFAULT_STORAGE_TYPE,
  sessionInfo: DEFAULT_STORAGE_TYPE,
};

const storageState: StorageState = {
  encryptionPluginName: signal(undefined),
  migrate: signal(false),
  type: signal(undefined),
  cookie: signal(undefined),
  entries: signal(defaultEntries),
};

export { storageState };
