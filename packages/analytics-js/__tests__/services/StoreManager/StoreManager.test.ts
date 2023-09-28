import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import {
  LOCAL_STORAGE,
  MEMORY_STORAGE,
  NO_STORAGE,
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
      );

      expect(storeManager.stores).toHaveProperty('clientDataInCookie');
    });

    it('should not initialize if already initialized', () => {
      storeManager.isInitialized = true;
      storeManager.init();
      expect(configureStorageEngines).not.toHaveBeenCalled();
    });
  });

  describe('initClientDataStore', () => {
    it('should initialize client data store for cookie,LS,memory storage', () => {
      getStorageEngine.mockImplementation(() => ({
        isEnabled: true,
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      }));

      storeManager.initClientDataStores();

      expect(storeManager.stores).toHaveProperty('clientDataInCookie');
      expect(storeManager.stores).toHaveProperty('clientDataInLocalStorage');
      expect(storeManager.stores).toHaveProperty('clientDataInMemory');
    });

    it('should construct the storage entry state with default storage type if entries or global storage type not provided as load option', () => {
      getStorageEngine.mockImplementation(() => ({
        isEnabled: true,
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      }));
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithOnlyCookieStorage);
    });

    it('should construct the storage entry state with global storage type if only global storage type is provided as load option', () => {
      state.storage.type.value = LOCAL_STORAGE;
      getStorageEngine.mockImplementation(() => ({
        isEnabled: true,
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      }));
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithOnlyLocalStorage);
    });

    it('should enable truly anonymous tracking if all the persisted data have storage type none', () => {
      state.storage.type.value = NO_STORAGE;
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithOnlyNoStorage);
      expect(state.storage.trulyAnonymousTracking.value).toBe(true);
    });

    it('should construct the storage entry state with global type and load option', () => {
      state.storage.type.value = MEMORY_STORAGE;
      state.loadOptions.value.storage.entries = loadOptionWithEntry;
      getStorageEngine.mockImplementation(() => ({
        isEnabled: true,
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      }));
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithMixStorage);
      expect(state.storage.trulyAnonymousTracking.value).toBe(false);
    });

    it('should construct the valid storage entry state if invalid storage entry in load option', () => {
      state.loadOptions.value.storage.entries = loadOptionWithInvalidEntry;
      getStorageEngine.mockImplementation(() => ({
        isEnabled: true,
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      }));
      storeManager.initClientDataStores();
      expect(state.storage.entries.value).toEqual(entriesWithOnlyCookieStorage);
      expect(logger.warn).toHaveBeenCalled();
      expect(state.storage.trulyAnonymousTracking.value).toBe(false);
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
