import { STORAGE_UNAVAILABILITY_ERROR_PREFIX } from '@rudderstack/analytics-js/constants/logMessages';
import { CAPABILITIES_MANAGER } from '@rudderstack/analytics-js/constants/loggerContexts';
import {
  STORAGE_TEST_COOKIE,
  STORAGE_TEST_LOCAL_STORAGE,
  STORAGE_TEST_SESSION_STORAGE,
} from '@rudderstack/analytics-js/constants/storageKeyNames';
import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  MEMORY_STORAGE,
  SESSION_STORAGE,
} from '@rudderstack/analytics-js/constants/storages';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { IStorage, StorageType } from '@rudderstack/analytics-js/services/StoreManager/types';

const isStorageQuotaExceeded = (e: DOMException | any): boolean => {
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

    if (!storage) {
      return false;
    }

    storage.setItem(testData, 'true');
    if (storage.getItem(testData)) {
      storage.removeItem(testData);
      return true;
    }
    return false;
  } catch (err) {
    const msgPrefix = STORAGE_UNAVAILABILITY_ERROR_PREFIX(CAPABILITIES_MANAGER, type);
    let reason = 'unavailable';
    if (isStorageQuotaExceeded(err)) {
      reason = 'full';
    }
    logger?.error(`${msgPrefix}${reason}.`, err);
    return false;
  }
};

export { isStorageQuotaExceeded, isStorageAvailable };
