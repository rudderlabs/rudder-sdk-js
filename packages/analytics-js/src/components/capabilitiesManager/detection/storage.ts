import {
  STORAGE_TEST_COOKIE,
  STORAGE_TEST_LOCAL_STORAGE,
  STORAGE_TEST_SESSION_STORAGE,
} from '@rudderstack/analytics-js/constants/storageKeyNames';
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
  type: StorageType = 'localStorage',
  storageInstance?: IStorage,
  logger?: ILogger,
) => {
  let storage;
  let testData;

  try {
    switch (type) {
      case 'memoryStorage':
        return true;
      case 'cookieStorage':
        storage = storageInstance;
        testData = `${STORAGE_TEST_COOKIE}`;
        break;
      case 'localStorage':
        storage = storageInstance ?? globalThis.localStorage;
        testData = `${STORAGE_TEST_LOCAL_STORAGE}`; // was STORAGE_TEST_LOCAL_STORAGE in ours and generateUUID() in segment retry one
        break;
      case 'sessionStorage':
        storage = storageInstance ?? globalThis.sessionStorage;
        testData = `${STORAGE_TEST_SESSION_STORAGE}`;
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
    const msgPrefix = `CapabilitiesManager:: "${type}" storage type is `;
    let reason = 'unavailable';
    if (isStorageQuotaExceeded(err)) {
      reason = 'full';
    }
    logger?.error(`${msgPrefix}${reason}.`, err);
    return false;
  }
};

export { isStorageQuotaExceeded, isStorageAvailable };
