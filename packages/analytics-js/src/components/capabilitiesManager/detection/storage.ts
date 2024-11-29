import { CAPABILITIES_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import type { IStorage } from '@rudderstack/analytics-js-common/types/Store';
import type { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  MEMORY_STORAGE,
  SESSION_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import {
  STORAGE_TEST_COOKIE,
  STORAGE_TEST_LOCAL_STORAGE,
  STORAGE_TEST_SESSION_STORAGE,
} from '../../../constants/storage';
import { STORAGE_UNAVAILABILITY_ERROR_PREFIX } from '../../../constants/logMessages';

const isStorageQuotaExceeded = (e: any): boolean => {
  const matchingNames = ['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED']; // [everything except Firefox, Firefox]
  const matchingCodes = [22, 1014]; // [everything except Firefox, Firefox]
  const isQuotaExceededError = matchingNames.includes(e.name) || matchingCodes.includes(e.code);

  return e instanceof DOMException && isQuotaExceededError;
};

// TODO: also check for SecurityErrors
//  https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#exceptions
const isStorageAvailable = (
  type: StorageType = LOCAL_STORAGE,
  storageInstance?: IStorage,
  logger?: ILogger,
) => {
  let storage;
  let testData;

  const msgPrefix = STORAGE_UNAVAILABILITY_ERROR_PREFIX(CAPABILITIES_MANAGER, type);
  let reason = 'unavailable';
  let isAccessible = true;
  let errObj;

  try {
    switch (type) {
      case MEMORY_STORAGE:
        return true;
      case COOKIE_STORAGE:
        storage = storageInstance;
        testData = STORAGE_TEST_COOKIE;
        break;
      case LOCAL_STORAGE:
        storage = storageInstance ?? globalThis.localStorage;
        testData = STORAGE_TEST_LOCAL_STORAGE; // was STORAGE_TEST_LOCAL_STORAGE in ours and generateUUID() in segment retry one
        break;
      case SESSION_STORAGE:
        storage = storageInstance ?? globalThis.sessionStorage;
        testData = STORAGE_TEST_SESSION_STORAGE;
        break;
      default:
        return false;
    }

    if (storage) {
      storage.setItem(testData, 'true');
      if (storage.getItem(testData)) {
        storage.removeItem(testData);
        return true;
      }
    }

    isAccessible = false;
  } catch (err) {
    isAccessible = false;
    errObj = err;
    if (isStorageQuotaExceeded(err)) {
      reason = 'full';
    }
  }

  if (!isAccessible) {
    logger?.warn(`${msgPrefix}${reason}.`, errObj);
  }

  // if we've have reached here, it means the storage is not available
  return false;
};

export { isStorageQuotaExceeded, isStorageAvailable };
