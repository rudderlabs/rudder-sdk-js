import { signal } from '@preact/signals-core';
import {
  // StorageEntries,
  StorageState,
} from '@rudderstack/analytics-js-common/types/ApplicationState';
// import { DEFAULT_STORAGE_TYPE } from '@rudderstack/analytics-js-common/types/Storage';
// import { userSessionStorageKeys } from '@rudderstack/analytics-js/components/userSessionManager/userSessionStorageKeys';

// const defaultEntries: StorageEntries = {
//   userId: {
//     storage: DEFAULT_STORAGE_TYPE,
//     key: userSessionStorageKeys.userId,
//   },
//   userTraits: {
//     storage: DEFAULT_STORAGE_TYPE,
//     key: userSessionStorageKeys.userTraits,
//   },
//   anonymousId: {
//     storage: DEFAULT_STORAGE_TYPE,
//     key: userSessionStorageKeys.anonymousId,
//   },
//   groupId: {
//     storage: DEFAULT_STORAGE_TYPE,
//     key: userSessionStorageKeys.groupId,
//   },
//   groupTraits: {
//     storage: DEFAULT_STORAGE_TYPE,
//     key: userSessionStorageKeys.groupTraits,
//   },
//   initialReferrer: {
//     storage: DEFAULT_STORAGE_TYPE,
//     key: userSessionStorageKeys.initialReferrer,
//   },
//   initialReferringDomain: {
//     storage: DEFAULT_STORAGE_TYPE,
//     key: userSessionStorageKeys.initialReferringDomain,
//   },
//   sessionInfo: {
//     storage: DEFAULT_STORAGE_TYPE,
//     key: userSessionStorageKeys.sessionInfo,
//   },
// };

const storageState: StorageState = {
  encryptionPluginName: signal(undefined),
  migrate: signal(false),
  type: signal(undefined),
  cookie: signal(undefined),
  entries: signal({}),
  trulyAnonymousTracking: signal(false),
};

export { storageState };
