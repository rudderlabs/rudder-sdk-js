import { InMemoryStorage } from './InMemoryStorage';
import { isStorageAvailable } from '../../components/capabilitiesManager/detection';

export type StorageType = 'localStorage' | 'sessionStorage' | 'memoryStorage';

const getStorage = (type: StorageType = 'localStorage') => {
  if (type === 'memoryStorage') {
    return new InMemoryStorage();
  }

  if (isStorageAvailable(type)) {
    return window[type];
  }

  // fall back to in-memory storage
  return new InMemoryStorage();
};

// Return a shared instance
const defaultStorageEngine = getStorage();

// Expose the in-memory store explicitly for testing
const inMemoryStorageEngine = new InMemoryStorage();

// TODO: should we also create the cookieStorage here?
export { getStorage, defaultStorageEngine, inMemoryStorageEngine };
