import { IStoreConfig, IStoreManager, StoreId } from '@rudderstack/analytics-js-common/types/Store';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { STORE_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  MEMORY_STORAGE,
  NO_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import { removeUndefinedValues } from '@rudderstack/analytics-js-common/utilities/object';
import { STORAGE_UNAVAILABLE_WARNING } from '@rudderstack/analytics-js/constants/logMessages';
import { StoreManagerOptions } from '@rudderstack/analytics-js/services/StoreManager/types';
import { state } from '@rudderstack/analytics-js/state';
import { CLIENT_DATA_STORE_NAME } from '@rudderstack/analytics-js/constants/storage';
import {
  configureStorageEngines,
  getStorageEngine,
} from '@rudderstack/analytics-js/services/StoreManager/storages/storageEngine';
import { Store } from '@rudderstack/analytics-js/services/StoreManager/Store';

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
    const storageType = state.storage.type.value || COOKIE_STORAGE;
    let finalStorageType = storageType;

    switch (storageType) {
      case LOCAL_STORAGE:
        if (!getStorageEngine(LOCAL_STORAGE)?.isEnabled) {
          finalStorageType = MEMORY_STORAGE;
        }
        break;
      case MEMORY_STORAGE:
        finalStorageType = MEMORY_STORAGE;
        break;
      case NO_STORAGE:
        finalStorageType = NO_STORAGE;
        break;
      case COOKIE_STORAGE:
      default:
        // First try setting the storage to cookie else to local storage
        if (getStorageEngine(COOKIE_STORAGE)?.isEnabled) {
          finalStorageType = COOKIE_STORAGE;
        } else if (getStorageEngine(LOCAL_STORAGE)?.isEnabled) {
          finalStorageType = LOCAL_STORAGE;
        } else {
          finalStorageType = MEMORY_STORAGE;
        }
        break;
    }

    if (finalStorageType !== storageType) {
      this.logger?.warn(STORAGE_UNAVAILABLE_WARNING(STORE_MANAGER, storageType, finalStorageType));
    }

    // TODO: fill in extra config values and bring them in from StoreManagerOptions if needed
    // TODO: should we pass the keys for all in order to validate or leave free as v1.1?
    if (finalStorageType !== NO_STORAGE) {
      this.setStore({
        id: CLIENT_DATA_STORE_NAME,
        name: CLIENT_DATA_STORE_NAME,
        isEncrypted: true,
        noCompoundKey: true,
        type: finalStorageType,
      });
    }
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
