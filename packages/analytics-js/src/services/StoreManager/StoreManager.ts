import { state } from '@rudderstack/analytics-js/state';
import {
  IStoreConfig,
  IStoreManager,
  StorageType,
  StoreId,
} from '@rudderstack/analytics-js-common/types/Store';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { StoreManagerOptions } from '@rudderstack/analytics-js/services/StoreManager/types';
import { STORE_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { COOKIE_STORAGE, LOCAL_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import { STORAGE_UNAVAILABLE_ERROR } from '@rudderstack/analytics-js/constants/logMessages';
import { removeUndefinedValues } from '@rudderstack/analytics-js-common/utilities/object';
import { configureStorageEngines, getStorageEngine } from './storages/storageEngine';
import { Store } from './Store';

/**
 * A service to manage stores & available storage client configurations
 */
class StoreManager implements IStoreManager {
  stores: Record<StoreId, Store> = {};
  isInitialized = false;
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  pluginsManager?: IPluginsManager;
  hasErrorHandler = false;

  constructor(pluginsManager?: IPluginsManager, errorHandler?: IErrorHandler, logger?: ILogger) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.hasErrorHandler = Boolean(this.errorHandler);
    this.pluginsManager = pluginsManager;
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
      removeUndefinedValues(config.cookieOptions),
      removeUndefinedValues(config.localStorageOptions),
      removeUndefinedValues(config.inMemoryStorageOptions),
    );

    this.initClientDataStore();
    this.isInitialized = true;
  }

  /**
   * Create store to persist data used by the SDK like session, used details etc
   */
  initClientDataStore() {
    let storageType: StorageType | '' = '';

    // First try setting the storage to cookie else to localstorage
    if (getStorageEngine(COOKIE_STORAGE)?.isEnabled) {
      storageType = COOKIE_STORAGE;
    } else if (getStorageEngine(LOCAL_STORAGE)?.isEnabled) {
      storageType = LOCAL_STORAGE;
    }
    // TODO: fallback to in-memory storage if not other storage is available

    // TODO: should we fallback to session storage instead so we retain values on page refresh, navigation etc?
    if (!storageType) {
      this.logger?.error(STORAGE_UNAVAILABLE_ERROR(STORE_MANAGER));
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
   * Create a new store
   */
  setStore(storeConfig: IStoreConfig): Store {
    const storageEngine = getStorageEngine(storeConfig.type);
    this.stores[storeConfig.id] = new Store(storeConfig, storageEngine, this.pluginsManager);
    return this.stores[storeConfig.id];
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
  onError(error: unknown) {
    if (this.hasErrorHandler) {
      this.errorHandler?.onError(error, STORE_MANAGER);
    } else {
      throw error;
    }
  }
}

export { StoreManager };
