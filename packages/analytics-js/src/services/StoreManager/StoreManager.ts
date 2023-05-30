import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { state } from '@rudderstack/analytics-js/state';
import { IPluginsManager } from '@rudderstack/analytics-js/components/pluginsManager/types';
import { configureStorageEngines, getStorageEngine } from './storages/storageEngine';
import { IStoreConfig, IStoreManager, StorageType, StoreId, StoreManagerOptions } from './types';
import { Store } from './Store';

/**
 * A service to manage stores & available storage client configurations
 */
class StoreManager implements IStoreManager {
  stores: Record<StoreId, Store> = {};
  isInitialized = false;
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  pluginManager?: IPluginsManager;
  hasErrorHandler = false;
  hasLogger = false;

  constructor(errorHandler?: IErrorHandler, logger?: ILogger, pluginManager?: IPluginsManager) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.hasErrorHandler = Boolean(this.errorHandler);
    this.hasLogger = Boolean(this.logger);
    this.pluginManager = pluginManager;
    this.onError = this.onError.bind(this);
  }

  /**
   * Configure available storage client instances
   */
  init() {
    if (this.isInitialized) {
      return;
    }

    const config: StoreManagerOptions = {
      cookieOptions: {
        samesite: state.loadOptions.value.sameSiteCookie,
        secure: state.loadOptions.value.secureCookie,
        domain: state.loadOptions.value.setCookieDomain,
        enabled: true,
      },
      localStorageOptions: { enabled: true },
      inMemoryStorageOptions: { enabled: true },
    };

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
    if (getStorageEngine('cookieStorage')?.isEnabled) {
      storageType = 'cookieStorage';
    } else if (getStorageEngine('localStorage')?.isEnabled) {
      storageType = 'localStorage';
    }
    // TODO: fallback to in-memory storage if not other storage is available

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
    this.setStore({
      id: 'clientData',
      name: 'clientData',
      isEncrypted: true,
      noCompoundKey: true,
      type: storageType,
    });
  }

  /**
   * Extension point to use with event queue plugins
   */
  initQueueStore() {
    // TODO: use this as extension point to create storage for event queues
    this.pluginManager?.invokeMultiple('queuestore.create', this.setStore);
  }
  /**
   * Create a new store
   */
  setStore(storeConfig: IStoreConfig) {
    const storageEngine = getStorageEngine(storeConfig.type);
    this.stores[storeConfig.id] = new Store(storeConfig, storageEngine, this.pluginManager);
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

export { StoreManager };
