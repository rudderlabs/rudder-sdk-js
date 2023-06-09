import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import {
  configureStorageEngines,
  getStorageEngine,
} from '@rudderstack/analytics-js/services/StoreManager/storages/storageEngine';
import { state } from '@rudderstack/analytics-js/state';
import { StoreManager } from '@rudderstack/analytics-js/services/StoreManager';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';

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
    errorHandler = { onError: jest.fn() };
    logger = { error: jest.fn() };
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

      expect(storeManager.stores).toHaveProperty('clientData');
    });

    it('should not initialize if already initialized', () => {
      storeManager.isInitialized = true;
      storeManager.init();
      expect(configureStorageEngines).not.toHaveBeenCalled();
    });
  });

  describe('initClientDataStore', () => {
    it('should initialize client data store using cookie storage', () => {
      getStorageEngine.mockImplementation(type => {
        return {
          isEnabled: type === 'cookieStorage',
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn(),
        };
      });

      storeManager.initClientDataStore();

      expect(storeManager.stores).toHaveProperty('clientData');
    });

    it('should initialize client data store using local storage', () => {
      getStorageEngine.mockImplementation(type => {
        return {
          isEnabled: type === 'localStorage',
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn(),
        };
      });

      storeManager.initClientDataStore();

      expect(storeManager.stores).toHaveProperty('clientData');
    });

    it('should log an error if neither cookie nor local storage is available', () => {
      getStorageEngine.mockImplementation(type => {
        return {
          isEnabled: false,
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn(),
        };
      });

      storeManager.initClientDataStore();

      expect(storeManager.stores).not.toHaveProperty('clientData');
      expect(storeManager.logger?.error).toHaveBeenCalledTimes(1);
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
