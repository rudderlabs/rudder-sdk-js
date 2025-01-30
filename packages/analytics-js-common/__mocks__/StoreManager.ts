import type { IStoreConfig, IStoreManager } from '../src/types/Store';
import { defaultPluginsManager } from './PluginsManager';
import { defaultCookieStorage, defaultInMemoryStorage, defaultLocalStorage } from './Storage';
import { defaultStore, Store } from './Store';

// Mock all the methods of the StoreManager class

class StoreManager implements IStoreManager {
  init = jest.fn();
  setStore = (config: IStoreConfig) => {
    let storageEngine;
    switch (config.type) {
      case 'localStorage':
        storageEngine = defaultLocalStorage;
        break;
      case 'cookieStorage':
        storageEngine = defaultCookieStorage;
        break;
      case 'memoryStorage':
      default:
        storageEngine = defaultInMemoryStorage;
        break;
    }

    return new Store(config, storageEngine, defaultPluginsManager);
  };
  getStore = jest.fn(() => defaultStore);
  initializeStorageState = jest.fn();
}

const defaultStoreManager = new StoreManager();

export { StoreManager, defaultStoreManager };
