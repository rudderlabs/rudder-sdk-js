import type { IPluginsManager } from '../src/types/PluginsManager';
import type { IStorage, IStore, IStoreConfig } from '../src/types/Store';
import { defaultInMemoryStorage, defaultLocalStorage } from './Storage';
import { defaultPluginsManager } from './PluginsManager';
import { defaultLogger } from './Logger';
import { defaultErrorHandler } from './ErrorHandler';
import type { Nullable } from '../src/types/Nullable';

// Mock all the methods of the Store class

class Store implements IStore {
  constructor(config: IStoreConfig, engine: IStorage, pluginsManager: IPluginsManager) {
    this.id = config.id;
    this.name = config.name;
    this.isEncrypted = config.isEncrypted ?? false;
    this.validKeys = config.validKeys ?? {};
    this.engine = engine;
    this.originalEngine = this.engine;
    this.errorHandler = config.errorHandler;
    this.logger = config.logger;
    this.pluginsManager = pluginsManager;
  }
  id = 'test';
  name = 'test';
  isEncrypted = false;
  validKeys: Record<string, string>;
  engine: IStorage = defaultLocalStorage;
  originalEngine: IStorage = defaultLocalStorage;
  errorHandler;
  logger;
  pluginsManager;
  createValidKey = (key: string) => {
    return [this.name, this.id, key].join('.');
  };
  swapQueueStoreToInMemoryEngine = () => {
    this.engine.keys().forEach((key: string) => {
      const value = this.engine.getItem(key);
      defaultInMemoryStorage.setItem(key, value);
    });

    this.engine = defaultInMemoryStorage;
  };
  set = (key: string, value: any) => {
    const validKey = this.createValidKey(key);
    this.engine.setItem(validKey, value);
  };
  get = <T = string>(key: string) => {
    const validKey = this.createValidKey(key);
    return this.engine.getItem(validKey) as Nullable<T>;
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

const defaultStore = new Store(
  { id: 'test', name: 'test', errorHandler: defaultErrorHandler, logger: defaultLogger },
  defaultLocalStorage,
  defaultPluginsManager,
);

export { Store, defaultStore };
