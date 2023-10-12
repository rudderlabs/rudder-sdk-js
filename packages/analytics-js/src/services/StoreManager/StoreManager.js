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
import { DEFAULT_STORAGE_TYPE } from '@rudderstack/analytics-js-common/types/Storage';
import { userSessionStorageKeys } from '../../components/userSessionManager/userSessionStorageKeys';
import { STORAGE_UNAVAILABLE_WARNING } from '../../constants/logMessages';
import { storageClientDataStoreNameMap } from './types';
import { state } from '../../state';
import { configureStorageEngines, getStorageEngine } from './storages/storageEngine';
import { Store } from './Store';
/**
 * A service to manage stores & available storage client configurations
 */
class StoreManager {
  constructor(pluginsManager, errorHandler, logger) {
    this.stores = {};
    this.isInitialized = false;
    this.hasErrorHandler = false;
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
    var _a;
    if (this.isInitialized) {
      return;
    }
    const config = {
      cookieOptions: {
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
        mergeDeepRight(
          config.cookieOptions || {},
          ((_a = state.storage.cookie) === null || _a === void 0 ? void 0 : _a.value) || {},
        ),
      ),
      removeUndefinedValues(config.localStorageOptions),
      removeUndefinedValues(config.inMemoryStorageOptions),
      removeUndefinedValues(config.sessionStorageOptions),
    );
    this.initClientDataStore();
    this.isInitialized = true;
  }
  /**
   * Create store to persist data used by the SDK like session, used details etc
   */
  initClientDataStore() {
    var _a, _b, _c, _d;
    const globalStorageType = state.storage.type.value;
    let trulyAnonymousTracking = true;
    const entries =
      (_a = state.loadOptions.value.storage) === null || _a === void 0 ? void 0 : _a.entries;
    const userSessionKeyValues = [
      'userId',
      'userTraits',
      'anonymousId',
      'groupId',
      'groupTraits',
      'initialReferrer',
      'initialReferringDomain',
      'sessionInfo',
    ];
    userSessionKeyValues.forEach(sessionKey => {
      var _a, _b, _c, _d, _e, _f, _g;
      const key = sessionKey;
      const storageKey = sessionKey;
      const providedStorageType =
        (_a = entries === null || entries === void 0 ? void 0 : entries[key]) === null ||
        _a === void 0
          ? void 0
          : _a.type;
      const storageType = providedStorageType || globalStorageType || DEFAULT_STORAGE_TYPE;
      let finalStorageType = storageType;
      switch (storageType) {
        case LOCAL_STORAGE:
          if (
            !((_b = getStorageEngine(LOCAL_STORAGE)) === null || _b === void 0
              ? void 0
              : _b.isEnabled)
          ) {
            finalStorageType = MEMORY_STORAGE;
          }
          break;
        case SESSION_STORAGE:
          if (
            !((_c = getStorageEngine(SESSION_STORAGE)) === null || _c === void 0
              ? void 0
              : _c.isEnabled)
          ) {
            finalStorageType = MEMORY_STORAGE;
          }
          break;
        case MEMORY_STORAGE:
        case NO_STORAGE:
          break;
        case COOKIE_STORAGE:
        default:
          // First try setting the storage to cookie else to local storage
          if (
            (_d = getStorageEngine(COOKIE_STORAGE)) === null || _d === void 0
              ? void 0
              : _d.isEnabled
          ) {
            finalStorageType = COOKIE_STORAGE;
          } else if (
            (_e = getStorageEngine(LOCAL_STORAGE)) === null || _e === void 0 ? void 0 : _e.isEnabled
          ) {
            finalStorageType = LOCAL_STORAGE;
          } else if (
            (_f = getStorageEngine(SESSION_STORAGE)) === null || _f === void 0
              ? void 0
              : _f.isEnabled
          ) {
            finalStorageType = SESSION_STORAGE;
          } else {
            finalStorageType = MEMORY_STORAGE;
          }
          break;
      }
      if (finalStorageType !== storageType) {
        (_g = this.logger) === null || _g === void 0
          ? void 0
          : _g.warn(STORAGE_UNAVAILABLE_WARNING(STORE_MANAGER, storageType, finalStorageType));
      }
      if (finalStorageType !== NO_STORAGE) {
        trulyAnonymousTracking = false;
      }
      const storageState = state.storage.entries.value;
      state.storage.entries.value = {
        ...storageState,
        [sessionKey]: {
          type: finalStorageType,
          key: userSessionStorageKeys[storageKey],
        },
      };
    });
    state.storage.trulyAnonymousTracking.value = trulyAnonymousTracking;
    // TODO: fill in extra config values and bring them in from StoreManagerOptions if needed
    // TODO: should we pass the keys for all in order to validate or leave free as v1.1?
    // Initializing all the enabled store because previous user data might be in different storage
    // that needs auto migration
    const storageTypesRequiringInitialization = [MEMORY_STORAGE];
    if ((_b = getStorageEngine(LOCAL_STORAGE)) === null || _b === void 0 ? void 0 : _b.isEnabled) {
      storageTypesRequiringInitialization.push(LOCAL_STORAGE);
    }
    if ((_c = getStorageEngine(COOKIE_STORAGE)) === null || _c === void 0 ? void 0 : _c.isEnabled) {
      storageTypesRequiringInitialization.push(COOKIE_STORAGE);
    }
    if (
      (_d = getStorageEngine(SESSION_STORAGE)) === null || _d === void 0 ? void 0 : _d.isEnabled
    ) {
      storageTypesRequiringInitialization.push(SESSION_STORAGE);
    }
    storageTypesRequiringInitialization.forEach(storageType => {
      this.setStore({
        id: storageClientDataStoreNameMap[storageType],
        name: storageClientDataStoreNameMap[storageType],
        isEncrypted: true,
        noCompoundKey: true,
        type: storageType,
      });
    });
  }
  /**
   * Create a new store
   */
  setStore(storeConfig) {
    const storageEngine = getStorageEngine(storeConfig.type);
    this.stores[storeConfig.id] = new Store(storeConfig, storageEngine, this.pluginsManager);
    return this.stores[storeConfig.id];
  }
  /**
   * Retrieve a store
   */
  getStore(id) {
    return this.stores[id];
  }
  /**
   * Handle errors
   */
  onError(error) {
    var _a;
    if (this.hasErrorHandler) {
      (_a = this.errorHandler) === null || _a === void 0
        ? void 0
        : _a.onError(error, STORE_MANAGER);
    } else {
      throw error;
    }
  }
}
export { StoreManager };
