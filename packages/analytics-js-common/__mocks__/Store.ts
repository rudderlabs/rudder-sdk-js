import type { IStore, IStoreConfig } from '../src/types/Store';
import { defaultInMemoryStorage, defaultLocalStorage } from './Storage';

// Mock all the methods of the Store class

class Store implements IStore {
  constructor(config: IStoreConfig, engine?: any) {
    this.private_id = config.id;
    this.private_name = config.name;
    this.private_isEncrypted = config.isEncrypted ?? false;
    this.private_validKeys = config.validKeys ?? [];
    this.private_engine = engine ?? defaultLocalStorage;
    this.private_originalEngine = this.private_engine;
  }
  private_id = 'test';
  private_name = 'test';
  private_isEncrypted = false;
  private_validKeys: string[];
  private_engine = defaultLocalStorage;
  private_originalEngine = defaultLocalStorage;
  private_createValidKey = (key: string) => {
    return [this.private_name, this.private_id, key].join('.');
  };
  swapQueueStoreToInMemoryEngine = () => {
    this.private_engine.keys().forEach(key => {
      const value = this.private_engine.getItem(key);
      defaultInMemoryStorage.setItem(key, value);
    });

    this.private_engine = defaultInMemoryStorage;
  };
  set = (key: string, value) => {
    const validKey = this.private_createValidKey(key);
    this.private_engine.setItem(validKey, value);
  };
  get = (key: string) => {
    const validKey = this.private_createValidKey(key);
    return this.private_engine.getItem(validKey);
  };
  remove = (key: string) => {
    const validKey = this.private_createValidKey(key);
    this.private_engine.removeItem(validKey);
  };
  clear = this.private_engine.clear;
  onError = jest.fn();
  private_crypto = jest.fn();
  private_encrypt = jest.fn();
  private_decrypt = jest.fn();
  getOriginalEngine = () => this.private_originalEngine;
}

const defaultStore = new Store({ id: 'test', name: 'test' });

export { Store, defaultStore };
