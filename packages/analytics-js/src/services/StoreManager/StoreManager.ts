import type {
  IStoreConfig,
  IStoreManager,
  StoreId,
} from '@rudderstack/analytics-js-common/types/Store';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
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
import {
  DEFAULT_STORAGE_TYPE,
  type StorageType,
} from '@rudderstack/analytics-js-common/types/Storage';
import type { UserSessionKey } from '@rudderstack/analytics-js-common/types/UserSessionStorage';
import { batch } from '@preact/signals-core';
import { isDefined } from '@rudderstack/analytics-js-common/utilities/checks';
import { COOKIE_KEYS } from '@rudderstack/analytics-js-cookies/constants/cookies';
import { USER_SESSION_KEYS } from '../../constants/storage';
import { STORAGE_UNAVAILABLE_WARNING } from '../../constants/logMessages';
import { type StoreManagerOptions, storageClientDataStoreNameMap } from './types';
import { state } from '../../state';
import { configureStorageEngines, getStorageEngine } from './storages/storageEngine';
import { Store } from './Store';
import { getStorageTypeFromPreConsentIfApplicable } from './utils';

/**
 * A service to manage stores & available storage client configurations
 */
class StoreManager implements IStoreManager {
  stores: Record<StoreId, Store> = {};
  isInitialized = false;
  errorHandler: IErrorHandler;
  logger: ILogger;
  pluginsManager: IPluginsManager;

  constructor(pluginsManager: IPluginsManager, errorHandler: IErrorHandler, logger: ILogger) {
    this.errorHandler = errorHandler;
    this.logger = logger;
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

    const loadOptions = state.loadOptions.value;
    const config: StoreManagerOptions = {
      cookieStorageOptions: {
        samesite: loadOptions.sameSiteCookie,
        secure: loadOptions.secureCookie,
        domain: loadOptions.setCookieDomain,
        sameDomainCookiesOnly: loadOptions.sameDomainCookiesOnly,
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
    const storageTypes = [MEMORY_STORAGE, LOCAL_STORAGE, COOKIE_STORAGE, SESSION_STORAGE];

    storageTypes.forEach(storageType => {
      if (getStorageEngine(storageType)?.isEnabled) {
        this.setStore({
          id: storageClientDataStoreNameMap[storageType] as string,
          name: storageClientDataStoreNameMap[storageType] as string,
          isEncrypted: true,
          noCompoundKey: true,
          type: storageType,
          errorHandler: this.errorHandler,
          logger: this.logger,
        });
      }
    });
  }

  initializeStorageState() {
    let globalStorageType = state.storage.type.value;
    let entriesOptions = state.loadOptions.value.storage?.entries;

    // Use the storage options from post consent if anything is defined
    const postConsentStorageOpts = state.consents.postConsent.value.storage;
    if (isDefined(postConsentStorageOpts?.type) || isDefined(postConsentStorageOpts?.entries)) {
      globalStorageType = postConsentStorageOpts?.type;
      entriesOptions = postConsentStorageOpts?.entries;
    }

    let trulyAnonymousTracking = true;
    let storageEntries = {};
    USER_SESSION_KEYS.forEach(sessionKey => {
      const key = sessionKey;
      const storageKey = sessionKey;
      const configuredStorageType = entriesOptions?.[key]?.type;

      const preConsentStorageType = getStorageTypeFromPreConsentIfApplicable(state, sessionKey);

      // Storage type precedence order: pre-consent strategy > entry type > global type > default
      const storageType =
        preConsentStorageType ?? configuredStorageType ?? globalStorageType ?? DEFAULT_STORAGE_TYPE;

      const finalStorageType = this.getResolvedStorageTypeForEntry(storageType, sessionKey);

      if (finalStorageType !== NO_STORAGE) {
        trulyAnonymousTracking = false;
      }

      storageEntries = {
        ...storageEntries,
        [sessionKey]: {
          type: finalStorageType,
          key: COOKIE_KEYS[storageKey],
        },
      };
    });

    batch(() => {
      state.storage.type.value = globalStorageType;
      state.storage.entries.value = storageEntries;
      state.storage.trulyAnonymousTracking.value = trulyAnonymousTracking;
    });
  }

  private getResolvedStorageTypeForEntry(storageType: StorageType, sessionKey: UserSessionKey) {
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
      this.logger.warn(
        STORAGE_UNAVAILABLE_WARNING(STORE_MANAGER, sessionKey, storageType, finalStorageType),
      );
    }

    return finalStorageType;
  }

  /**
   * Create a new store
   */
  setStore(storeConfig: IStoreConfig): Store {
    const storageEngine = getStorageEngine(storeConfig.type);
    this.stores[storeConfig.id] = new Store(storeConfig, storageEngine, this.pluginsManager);
    return this.stores[storeConfig.id] as Store;
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
    this.errorHandler.onError(error, STORE_MANAGER);
  }
}

export { StoreManager };
