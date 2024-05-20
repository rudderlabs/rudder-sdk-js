import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import {
  LOCAL_STORAGE,
  MEMORY_STORAGE,
  NO_STORAGE,
  SESSION_STORAGE,
  COOKIE_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import {
  configureStorageEngines,
  getStorageEngine,
} from '../../../src/services/StoreManager/storages/storageEngine';
import { state, resetState } from '../../../src/state';
import { StoreManager } from '../../../src/services/StoreManager';
import { PluginsManager } from '../../../src/components/pluginsManager';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { defaultLogger } from '../../../src/services/Logger';
import {
  entriesWithOnlyCookieStorage,
  entriesWithOnlyLocalStorage,
  entriesWithOnlyNoStorage,
  entriesWithMixStorage,
  loadOptionWithEntry,
  loadOptionWithInvalidEntry,
  entriesWithStorageOnlyForSession,
  entriesWithStorageOnlyForAnonymousId,
  entriesWithOnlySessionStorage,
  entriesWithInMemoryFallback,
  postConsentStorageEntryOptions,
  entriesWithoutCookieStorage,
  entriesWithoutCookieAndLocalStorage,
} from '../../../__fixtures__/fixtures';

jest.mock('../../../src/services/StoreManager/storages/storageEngine', () => ({
  __esModule: true,
  configureStorageEngines: jest.fn(),
  getStorageEngine: jest.fn().mockReturnValue({
    isEnabled: true,
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }),
}));

describe('StoreManager', () => {
  let errorHandler: IErrorHandler;
  let logger: ILogger;
  let storeManager: StoreManager;
  const defaultPluginsManager = new PluginsManager(
    defaultPluginEngine,
    defaultErrorHandler,
    defaultLogger,
  );

  beforeEach(() => {
    resetState();
    errorHandler = { onError: jest.fn() };
    logger = { error: jest.fn(), warn: jest.fn() };
    storeManager = new StoreManager(defaultPluginsManager, errorHandler, logger);
  });

  afterEach(() => {
    storeManager.isInitialized = false;
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('init', () => {
    it('should initialize storage engines and create stores', () => {
      storeManager.init();

      expect(configureStorageEngines).toHaveBeenCalledWith(
        {
          samesite: state.loadOptions.value.sameSiteCookie,
          secure: state.loadOptions.value.secureCookie,
          domain: state.loadOptions.value.setCookieDomain,
          enabled: true,
        },
        { enabled: true },
        { enabled: true },
        { enabled: true },
      );

      expect(storeManager.stores).toHaveProperty('clientDataInCookie');
    });

    it('should not initialize if already initialized', () => {
      storeManager.isInitialized = true;
      storeManager.init();
      expect(configureStorageEngines).not.toHaveBeenCalled();
    });
  });

  describe('initClientDataStores', () => {
    beforeEach(() => {
      getStorageEngine.mockImplementation(() => ({
        isEnabled: true,
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      }));
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should initialize client data store for cookie,LS,memory storage,session storage', () => {
      storeManager.initClientDataStores();

      expect(storeManager.stores).toHaveProperty('clientDataInCookie');
      expect(storeManager.stores).toHaveProperty('clientDataInLocalStorage');
      expect(storeManager.stores).toHaveProperty('clientDataInMemory');
      expect(storeManager.stores).toHaveProperty('clientDataInSessionStorage');
    });

    it('should construct the storage entry state with default storage type if entries or global storage type not provided as load option', () => {
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithOnlyCookieStorage);
      expect(state.storage.trulyAnonymousTracking.value).toBe(false);
    });

    it('should construct the storage entry state with global storage type if only global storage type is provided as load option', () => {
      state.storage.type.value = LOCAL_STORAGE;
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithOnlyLocalStorage);
    });

    it('should enable truly anonymous tracking if all the persisted data have storage type none', () => {
      state.storage.type.value = NO_STORAGE;
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithOnlyNoStorage);
      expect(state.storage.trulyAnonymousTracking.value).toBe(true);
    });

    it('should construct the storage entry state with global type session storage', () => {
      state.storage.type.value = SESSION_STORAGE;
      getStorageEngine.mockImplementation(() => ({
        isEnabled: true,
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      }));
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithOnlySessionStorage);
    });

    it('should construct the storage entry state with global type and load options', () => {
      state.storage.type.value = MEMORY_STORAGE;
      state.loadOptions.value.storage.entries = loadOptionWithEntry;
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithMixStorage);
      expect(state.storage.trulyAnonymousTracking.value).toBe(false);
    });

    it('should construct the valid storage entry state if invalid storage entry in load option', () => {
      state.loadOptions.value.storage.entries = loadOptionWithInvalidEntry;
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithOnlyCookieStorage);
      expect(logger.warn).toHaveBeenCalled();
      expect(state.storage.trulyAnonymousTracking.value).toBe(false);
    });

    it('should fallback to localstorage for storage type cookie if localstorage is available', () => {
      getStorageEngine.mockImplementation(type => ({
        isEnabled: type !== COOKIE_STORAGE,
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      }));

      state.loadOptions.value.storage.entries = loadOptionWithEntry;

      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithoutCookieStorage);
    });

    it('should fallback to session storage for storage type cookie if cookie and local storage are unavailable', () => {
      getStorageEngine.mockImplementation(type => ({
        isEnabled: type === SESSION_STORAGE || type === MEMORY_STORAGE,
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      }));

      state.loadOptions.value.storage.entries = loadOptionWithEntry;

      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithoutCookieAndLocalStorage);
    });

    it('should fallback to default storage type if specified storage type is unavailable', () => {
      getStorageEngine.mockImplementation(() => ({
        isEnabled: false,
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      }));

      state.loadOptions.value.storage.entries = loadOptionWithEntry;
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithInMemoryFallback);
      expect(logger.warn).toBeCalledTimes(8);
    });

    it('should construct the appropriate storage entry state if the pre-consent storage strategy is set to none', () => {
      state.consents.preConsent.value = {
        enabled: true,
        storage: {
          strategy: 'none',
        },
      };
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithOnlyNoStorage);
      expect(state.storage.trulyAnonymousTracking.value).toBe(true);
    });

    it('should construct the appropriate storage entry state if the pre-consent storage strategy is set to session', () => {
      state.consents.preConsent.value = {
        enabled: true,
        storage: {
          strategy: 'session',
        },
      };
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithStorageOnlyForSession);
      expect(state.storage.trulyAnonymousTracking.value).toBe(false);
    });

    it('should construct the appropriate storage entry state if the pre-consent storage strategy is set to anonymousId', () => {
      state.consents.preConsent.value = {
        enabled: true,
        storage: {
          strategy: 'anonymousId',
        },
      };
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithStorageOnlyForAnonymousId);
      expect(state.storage.trulyAnonymousTracking.value).toBe(false);
    });

    it('should construct the appropriate storage entry state if post consent storage options are available', () => {
      state.loadOptions.value.storage.entries = entriesWithOnlyNoStorage; // these options should be ignored
      state.consents.postConsent.value = {
        storage: {
          type: MEMORY_STORAGE,
          entries: postConsentStorageEntryOptions,
        },
      };

      storeManager.initClientDataStores();

      expect(state.storage.entries.value).toEqual(entriesWithMixStorage);
    });

    describe('Stores', () => {
      it('should set store', () => {
        storeManager.setStore({
          id: 'dummyStore',
          name: 'dummy',
          isEncrypted: true,
          noCompoundKey: true,
          type: 'cookieStorage',
        });

        expect(storeManager.stores).toHaveProperty('dummyStore');
      });
    });
  });
});
