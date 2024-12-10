import type { IStoreConfig, IStoreManager } from '../src/types/Store';
import { defaultStore, Store } from './Store';

// Mock all the methods of the StoreManager class

class StoreManager implements IStoreManager {
  init = jest.fn();
  setStore = (config: IStoreConfig) => {
    return new Store(config);
  };
  getStore = jest.fn(() => defaultStore);
  initializeStorageState = jest.fn();
}

const defaultStoreManager = new StoreManager();

export { StoreManager, defaultStoreManager };
