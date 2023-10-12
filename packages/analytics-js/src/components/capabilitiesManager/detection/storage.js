import { CAPABILITIES_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  MEMORY_STORAGE,
  SESSION_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import {
  STORAGE_TEST_COOKIE,
  STORAGE_TEST_LOCAL_STORAGE,
  STORAGE_TEST_SESSION_STORAGE,
} from '../../../constants/storage';
import { STORAGE_UNAVAILABILITY_ERROR_PREFIX } from '../../../constants/logMessages';
const isStorageQuotaExceeded = e => {
  const matchingNames = ['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED']; // [everything except Firefox, Firefox]
  const matchingCodes = [22, 1014]; // [everything except Firefox, Firefox]
  const isQuotaExceededError = matchingNames.includes(e.name) || matchingCodes.includes(e.code);
  return e instanceof DOMException && isQuotaExceededError;
};
// TODO: also check for SecurityErrors
//  https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#exceptions
const isStorageAvailable = (type = LOCAL_STORAGE, storageInstance, logger) => {
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
        storage =
          storageInstance !== null && storageInstance !== void 0
            ? storageInstance
            : globalThis.localStorage;
        testData = STORAGE_TEST_LOCAL_STORAGE; // was STORAGE_TEST_LOCAL_STORAGE in ours and generateUUID() in segment retry one
        break;
      case SESSION_STORAGE:
        storage =
          storageInstance !== null && storageInstance !== void 0
            ? storageInstance
            : globalThis.sessionStorage;
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
    logger === null || logger === void 0 ? void 0 : logger.error(`${msgPrefix}${reason}.`, err);
    return false;
  }
};
export { isStorageQuotaExceeded, isStorageAvailable };
