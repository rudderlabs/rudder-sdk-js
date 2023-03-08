import { generateUUID } from "../common/uuId";
import { InMemoryStorage } from "./InMemoryStorage";

export type StorageType = 'localStorage' | 'sessionStorage' | 'memoryStorage';

const isStorageQuotaExceeded = (e: DOMException | any): boolean => {
  const matchingNames = ['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED']; // everything except Firefox, Firefox
  const matchingCodes = [22, 1014]; // everything except Firefox, Firefox
  const isQuotaExceededError = (e.name && matchingNames.includes(e.name)) || (e.code && matchingCodes.includes(e.code));

  return e instanceof DOMException && isQuotaExceededError;
}

const isStorageAvailable = (type: 'localStorage' | 'sessionStorage' = 'localStorage') => {
  let storage;

  try {
    storage = window[type];

    if (!storage) {
      return false;
    }

    const uuId = generateUUID();
    const testData = `__storage_test__${uuId}}`;

    storage.setItem(testData, testData);
    storage.removeItem(testData);
    return true;
  }
  catch (e: any) {
    if(isStorageQuotaExceeded(e)) {
      console.error(`error: storage '${type}' is not full`);
    } else {
      console.error(`error: storage '${type}' is not available`);
    }

    return false;
  }
}

const getStorage = (type: StorageType = 'localStorage') => {
  if(type === 'memoryStorage') {
    return new InMemoryStorage();
  }

  if (isStorageAvailable(type)) {
    return window[type];
  }

  // fall back to in-memory storage
  return new InMemoryStorage();
}

// Return a shared instance
const defaultStorageEngine = getStorage();

// Expose the in-memory store explicitly for testing
const inMemoryStorageEngine = new InMemoryStorage();

// TODO: should we also create the cookieStorage here?
export {
  isStorageAvailable,
  isStorageQuotaExceeded,
  getStorage,
  defaultStorageEngine,
  inMemoryStorageEngine
}
