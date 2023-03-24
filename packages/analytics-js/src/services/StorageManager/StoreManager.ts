import { defaultErrorHandler, ErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger, Logger } from '@rudderstack/analytics-js/services/Logger';
import { defaultPluginManager } from '@rudderstack/analytics-js/components/pluginsManager';
import {
  ICookieStorageOptions,
  IInMemoryStorageOptions,
  ILocalStorageOptions,
  StorageType,
  StoreId,
} from './types';
import { configureStorageEngines, getStorageEngine } from './storages/storageEngine';
import { IStoreConfig, Store } from './Store';

export type StoreManagerOptions = {
  cookieOptions?: Partial<ICookieStorageOptions>;
  localStorageOptions?: Partial<ILocalStorageOptions>;
  inMemoryStorageOptions?: Partial<IInMemoryStorageOptions>;
};

/**
 * A service to manage stores & available storage client configurations
 */
class StoreManager {
  stores: Record<StoreId, Store> = {};
  isInitialized = false;
  errorHandler?: ErrorHandler;
  logger?: Logger;
  hasErrorHandler = false;
  hasLogger = false;

  constructor(errorHandler?: ErrorHandler, logger?: Logger) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.hasErrorHandler = Boolean(this.errorHandler);
    this.hasLogger = Boolean(this.logger);
    this.onError = this.onError.bind(this);
  }

  /**
   * Configure available storage client instances
   */
  init(config: StoreManagerOptions = {}) {
    if (this.isInitialized) {
      return;
    }

    configureStorageEngines(
      config.cookieOptions,
      config.localStorageOptions,
      config.inMemoryStorageOptions,
    );

    this.initClientDataStore();
    this.initQueueStore();
    this.isInitialized = true;
  }

  /**
   * Create store to persist data used by the SDK like session, used details etc
   */
  initClientDataStore() {
    let storageType: StorageType | '' = '';

    // First try setting the storage to cookie else to localstorage
    if (getStorageEngine('cookieStorage').isEnabled) {
      storageType = 'cookieStorage';
    } else if (getStorageEngine('localStorage').isEnabled) {
      storageType = 'localStorage';
    }

    // TODO: should we fallback to session storage instead so we retain values
    //  on page refresh, navigation etc?
    if (!storageType) {
      this.logger?.error(
        'No storage is available for data store :: initializing the SDK without storage',
      );
      return;
    }

    // TODO: fill in extra config values and bring them in from StoreManagerOptions if needed
    // TODO: should we pass the keys for all in order to validate or leave free as v1.1?
    this.setStore(
      'clientData',
      {
        id: 'clientData',
        name: 'clientData',
        isEncrypted: true,
        noCompoundKey: true,
      },
      storageType,
    );
  }

  /**
   * Extension point to use with event queue plugins
   */
  initQueueStore() {
    // TODO: use this as extension point to create storage for event queues
    defaultPluginManager.invoke('queuestore.create', this.setStore);
  }
  /**
   * Create a new store
   */
  setStore(id: StoreId, storeConfig: IStoreConfig, type?: StorageType) {
    const storageEngine = getStorageEngine(type);
    this.stores[id] = new Store(storeConfig, storageEngine);
  }

  /**
   * Retrieve a store
   */
  getStore(id: StoreId): Store | undefined {
    return this.stores[id];
  }

  /**
   * Handle errors
   */
  onError(error: Error | unknown) {
    if (this.hasErrorHandler) {
      this.errorHandler?.onError(error, 'StorageManager');
    } else {
      throw error;
    }
  }
}

const defaultStoreManager = new StoreManager(defaultErrorHandler, defaultLogger);

export { StoreManager, defaultStoreManager };
