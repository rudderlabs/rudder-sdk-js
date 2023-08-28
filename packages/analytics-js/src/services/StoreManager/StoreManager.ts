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
import {
  DEFAULT_STORAGE_TYPE,
  StorageType,
  UserSessionKeysType,
} from '@rudderstack/analytics-js-common/types/Storage';
import { clone } from 'ramda';
import { userSessionStorageKeys } from '@rudderstack/analytics-js/components/userSessionManager/userSessionStorageKeys';
import { UserSessionStorageKeysType } from '@rudderstack/analytics-js/components/userSessionManager/types';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/index';
import { STORAGE_UNAVAILABLE_WARNING } from '../../constants/logMessages';
import { StoreManagerOptions, storageClientDataStoreNameMap } from './types';
import { state } from '../../state';
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
      removeUndefinedValues(
        mergeDeepRight(config.cookieOptions || {}, state.storage.cookie?.value || {}),
      ),
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
    const globalStorageType = state.storage.type.value;
    const storageTypesRequiringInitialization = [MEMORY_STORAGE];
    if (getStorageEngine(LOCAL_STORAGE)?.isEnabled) {
      storageTypesRequiringInitialization.push(LOCAL_STORAGE);
    }
    if (getStorageEngine(COOKIE_STORAGE)?.isEnabled) {
      storageTypesRequiringInitialization.push(COOKIE_STORAGE);
    }

    let trulyAnonymousTracking = true;
    const entries = state.loadOptions.value.storage?.entries;
    Object.keys(state.storage.entries.value).forEach(entry => {
      const key = entry as UserSessionKeysType;
      const storageKey = entry as UserSessionStorageKeysType;
      const providedStorageType = entries ? entries[key]?.type : undefined;
      const storageType = providedStorageType || globalStorageType || DEFAULT_STORAGE_TYPE;
      let finalStorageType = storageType;

      switch (storageType) {
        case LOCAL_STORAGE:
          if (!getStorageEngine(LOCAL_STORAGE)?.isEnabled) {
            finalStorageType = MEMORY_STORAGE;
          }
          break;
        case MEMORY_STORAGE:
        case NO_STORAGE:
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
        this.logger?.warn(
          STORAGE_UNAVAILABLE_WARNING(STORE_MANAGER, storageType, finalStorageType),
        );
      }
      if (finalStorageType !== NO_STORAGE) {
        trulyAnonymousTracking = false;
      }
      const clonedStorageState = clone(state.storage.entries.value);
      state.storage.entries.value = {
        ...clonedStorageState,
        [entry]: {
          storage: finalStorageType,
          key: userSessionStorageKeys[storageKey],
        },
      };
    });

    state.storage.trulyAnonymousTracking.value = trulyAnonymousTracking;

    // TODO: fill in extra config values and bring them in from StoreManagerOptions if needed
    // TODO: should we pass the keys for all in order to validate or leave free as v1.1?

    // Initializing all the enabled store because previous user data might be in different storage
    // that needs auto migration
    storageTypesRequiringInitialization.forEach(storage => {
      this.setStore({
        id: storageClientDataStoreNameMap[storage],
        name: storageClientDataStoreNameMap[storage],
        isEncrypted: true,
        noCompoundKey: true,
        type: storage as StorageType,
      });
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
