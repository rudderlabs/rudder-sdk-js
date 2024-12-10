import type { IStore, IStoreConfig } from '../src/types/Store';
import { defaultInMemoryStorage, defaultLocalStorage } from './Storage';

// Mock all the methods of the Store class

class Store implements IStore {
  constructor(config: IStoreConfig, engine?: any) {
    this.id = config.id;
    this.name = config.name;
    this.isEncrypted = config.isEncrypted ?? false;
    this.validKeys = config.validKeys ?? [];
    this.engine = engine ?? defaultLocalStorage;
    this.originalEngine = this.engine;
  }
  id = 'test';
  name = 'test';
  isEncrypted = false;
  validKeys: string[];
  engine = defaultLocalStorage;
  originalEngine = defaultLocalStorage;
  createValidKey = (key: string) => {
    return [this.name, this.id, key].join('.');
  };
  swapQueueStoreToInMemoryEngine = () => {
    this.engine.keys().forEach(key => {
      const value = this.engine.getItem(key);
      defaultInMemoryStorage.setItem(key, value);
    });

    this.engine = defaultInMemoryStorage;
  };
  set = (key: string, value: any) => {
    const validKey = this.createValidKey(key);
    this.engine.setItem(validKey, value);
  };
  get = (key: string) => {
    const validKey = this.createValidKey(key);
    return this.engine.getItem(validKey);
  };
  remove = (key: string) => {
    const validKey = this.createValidKey(key);
    this.engine.removeItem(validKey);
  };
  clear = () => {
    this.engine.clear();
  };
  onError = jest.fn();
  crypto = jest.fn();
  encrypt = jest.fn();
  decrypt = jest.fn();
  getOriginalEngine = () => this.originalEngine;
}

const defaultStore = new Store({ id: 'test', name: 'test' });

export { Store, defaultStore };
