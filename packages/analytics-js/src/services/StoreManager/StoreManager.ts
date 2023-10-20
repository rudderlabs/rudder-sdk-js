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
  SESSION_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import {
  mergeDeepRight,
  removeUndefinedValues,
} from '@rudderstack/analytics-js-common/utilities/object';
import { DEFAULT_STORAGE_TYPE, StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import { UserSessionKeys } from '@rudderstack/analytics-js-common/types/UserSessionStorage';
import { batch } from '@preact/signals-core';
import { USER_SESSION_STORAGE_KEYS } from '../../components/userSessionManager/constants';
import { STORAGE_UNAVAILABLE_WARNING } from '../../constants/logMessages';
import { StoreManagerOptions, storageClientDataStoreNameMap } from './types';
import { state } from '../../state';
import { configureStorageEngines, getStorageEngine } from './storages/storageEngine';
import { Store } from './Store';
import { getStorageTypeFromPreConsent } from './utils';

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
      cookieStorageOptions: {
        samesite: state.loadOptions.value.sameSiteCookie,
        secure: state.loadOptions.value.secureCookie,
        domain: state.loadOptions.value.setCookieDomain,
        enabled: true,
      },
      localStorageOptions: { enabled: true },
      inMemoryStorageOptions: { enabled: true },
      sessionStorageOptions: { enabled: true },
    };

    configureStorageEngines(
      removeUndefinedValues(
        mergeDeepRight(config.cookieStorageOptions ?? {}, state.storage.cookie?.value ?? {}),
      ),
      removeUndefinedValues(config.localStorageOptions),
      removeUndefinedValues(config.inMemoryStorageOptions),
      removeUndefinedValues(config.sessionStorageOptions),
    );

    this.initClientDataStores();
    this.isInitialized = true;
  }

  /**
   * Create store to persist data used by the SDK like session, used details etc
   */
  initClientDataStores() {
    this.initializeStorageState();

    // TODO: fill in extra config values and bring them in from StoreManagerOptions if needed
    // TODO: should we pass the keys for all in order to validate or leave free as v1.1?

    // Initializing all the enabled store because previous user data might be in different storage
    // that needs auto migration
    const storageTypesRequiringInitialization = [MEMORY_STORAGE];
    if (getStorageEngine(LOCAL_STORAGE)?.isEnabled) {
      storageTypesRequiringInitialization.push(LOCAL_STORAGE);
    }
    if (getStorageEngine(COOKIE_STORAGE)?.isEnabled) {
      storageTypesRequiringInitialization.push(COOKIE_STORAGE);
    }
    if (getStorageEngine(SESSION_STORAGE)?.isEnabled) {
      storageTypesRequiringInitialization.push(SESSION_STORAGE);
    }
    storageTypesRequiringInitialization.forEach(storageType => {
      this.setStore({
        id: storageClientDataStoreNameMap[storageType],
        name: storageClientDataStoreNameMap[storageType],
        isEncrypted: true,
        noCompoundKey: true,
        type: storageType as StorageType,
      });
    });
  }

  initializeStorageState() {
    const globalStorageType = state.storage.type.value;
    let trulyAnonymousTracking = true;
    const entries = mergeDeepRight(
      state.consents.postConsent.value.storage?.entries ?? {},
      state.loadOptions.value.storage?.entries ?? {},
    );
    const userSessionKeyValues: UserSessionKeys[] = [
      'userId',
      'userTraits',
      'anonymousId',
      'groupId',
      'groupTraits',
      'initialReferrer',
      'initialReferringDomain',
      'sessionInfo',
    ];

    let storageEntries = {};
    userSessionKeyValues.forEach(sessionKey => {
      const key = sessionKey;
      const storageKey = sessionKey;
      const configuredStorageType = entries?.[key]?.type;

      const preConsentStorageType = getStorageTypeFromPreConsent(state, sessionKey);

      // Storage type precedence order: pre-consent strategy > entry type > global type > default
      const storageType =
        preConsentStorageType ?? configuredStorageType ?? globalStorageType ?? DEFAULT_STORAGE_TYPE;
      let finalStorageType = storageType;

      switch (storageType) {
        case LOCAL_STORAGE:
          if (!getStorageEngine(LOCAL_STORAGE)?.isEnabled) {
            finalStorageType = MEMORY_STORAGE;
          }
          break;
        case SESSION_STORAGE:
          if (!getStorageEngine(SESSION_STORAGE)?.isEnabled) {
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
          } else if (getStorageEngine(SESSION_STORAGE)?.isEnabled) {
            finalStorageType = SESSION_STORAGE;
          } else {
            finalStorageType = MEMORY_STORAGE;
          }
          break;
      }
      if (finalStorageType !== storageType) {
        this.logger?.warn(
          STORAGE_UNAVAILABLE_WARNING(STORE_MANAGER, sessionKey, storageType, finalStorageType),
        );
      }
      if (finalStorageType !== NO_STORAGE) {
        trulyAnonymousTracking = false;
      }

      storageEntries = {
        ...storageEntries,
        [sessionKey]: {
          type: finalStorageType,
          key: USER_SESSION_STORAGE_KEYS[storageKey],
        },
      };
    });

    batch(() => {
      state.storage.entries.value = storageEntries;
      state.storage.trulyAnonymousTracking.value = trulyAnonymousTracking;
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
