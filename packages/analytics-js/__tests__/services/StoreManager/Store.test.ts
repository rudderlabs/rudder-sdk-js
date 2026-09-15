import { QueueStatuses } from '@rudderstack/analytics-js-common/constants/QueueStatuses';
import { COOKIE_KEYS } from '@rudderstack/analytics-js-cookies/constants/cookies';
import { Store } from '../../../src/services/StoreManager/Store';
import { getStorageEngine } from '../../../src/services/StoreManager/storages/storageEngine';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { defaultLogger } from '../../../src/services/Logger';
import { PluginsManager } from '../../../src/components/pluginsManager';
import { PluginEngine } from '../../../src/services/PluginEngine';
import { state } from '../../../src/state';

describe('Store', () => {
  let store: Store;
  const engine = window.localStorage;
  const lsProxy = {
    length: window.localStorage.length,
    setItem(k: string, v: any) {
      return window.localStorage.setItem(k, v);
    },
    getItem(k: string) {
      return window.localStorage.getItem(k);
    },
    removeItem(k: string) {
      return window.localStorage.removeItem(k);
    },
    clear: () => window.localStorage.clear(),
    key(i: number) {
      return window.localStorage.key(i);
    },
    keys() {
      const keys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key !== null) {
          keys.push(key);
        }
      }
      return keys;
    },
    isEnabled: true,
  };
  // `should swap upon quotaExceeded on set` replaces this with a throwing stub;
  // keep the original so beforeEach can restore it for every later test.
  const originalLsProxySetItem = lsProxy.setItem;

  const pluginEngine = new PluginEngine(defaultLogger);
  const pluginsManager = new PluginsManager(pluginEngine, defaultErrorHandler, defaultLogger);

  beforeEach(() => {
    engine.clear();
    lsProxy.setItem = originalLsProxySetItem;
    store = new Store(
      {
        name: 'name',
        id: 'id',
        validKeys: { ...QueueStatuses, ...COOKIE_KEYS },
        errorHandler: defaultErrorHandler,
        logger: defaultLogger,
      },
      getStorageEngine('localStorage'),
      pluginsManager,
    );
    // Reset state values before each test
    state.storage.encryptionPluginName.value = undefined;
    state.plugins.failedPlugins.value = [];
  });

  describe('.get', () => {
    it('should default to null', () => {
      Object.values(QueueStatuses).forEach(keyValue => {
        expect(store.get(keyValue)).toBeNull();
      });
    });

    it('should de-serialize json', () => {
      Object.values(QueueStatuses).forEach(keyValue => {
        engine.setItem(`name.id.${keyValue}`, '"[\\"a\\",\\"b\\",{}]"');
        expect(store.get(keyValue)).toStrictEqual(['a', 'b', {}]);
      });
    });

    // TODO: fix, caused by Difference is the storejs and retry-queue localstorage implementation
    it('should return null if value is not valid json', () => {
      engine.setItem('name.id.queue', '[{]}');
      expect(store.get(QueueStatuses.QUEUE)).toBeNull();
    });

    it('should not report errors when encryption plugin failed to load', () => {
      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError').mockImplementation();

      // Mock decrypt to throw an error
      const decryptSpy = jest.spyOn(store, 'decrypt').mockImplementation(() => {
        throw new Error('Decryption failed');
      });

      // Set up state to indicate encryption plugin is configured but failed to load
      state.storage.encryptionPluginName.value = 'StorageEncryption';
      state.plugins.failedPlugins.value = ['StorageEncryption'];

      // Mock engine to return an encrypted value
      const getItemSpy = jest.spyOn(store.engine, 'getItem').mockReturnValue('encrypted-value');

      const result = store.get('rl_anonymous_id');

      expect(result).toBeNull();
      expect(decryptSpy).toHaveBeenCalled();
      expect(errorHandlerSpy).not.toHaveBeenCalled();

      // Clean up
      errorHandlerSpy.mockRestore();
      decryptSpy.mockRestore();
      getItemSpy.mockRestore();
      state.storage.encryptionPluginName.value = undefined;
      state.plugins.failedPlugins.value = [];
    });

    it('should report errors when encryption plugin loaded successfully but decryption fails', () => {
      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError').mockImplementation();

      // Mock decrypt to throw an error
      const decryptSpy = jest.spyOn(store, 'decrypt').mockImplementation(() => {
        throw new Error('Decryption failed');
      });

      // Set up state to indicate encryption plugin is loaded successfully
      state.storage.encryptionPluginName.value = 'StorageEncryption';
      state.plugins.failedPlugins.value = [];

      // Mock engine to return an encrypted value
      const getItemSpy = jest.spyOn(store.engine, 'getItem').mockReturnValue('encrypted-value');

      const result = store.get('rl_anonymous_id');

      expect(result).toBeNull();
      expect(decryptSpy).toHaveBeenCalled();
      expect(errorHandlerSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Error),
          context: 'Store id',
          customMessage: 'Failed to retrieve or parse data for "rl_anonymous_id" from storage',
          groupingHash: 'Failed to retrieve or parse data for "rl_anonymous_id" from storage',
        }),
      );

      // Clean up
      errorHandlerSpy.mockRestore();
      decryptSpy.mockRestore();
      getItemSpy.mockRestore();
      state.storage.encryptionPluginName.value = undefined;
      state.plugins.failedPlugins.value = [];
    });

    it('should report errors when no encryption plugin is configured', () => {
      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError').mockImplementation();

      // Mock JSON.parse to throw an error
      const jsonParseSpy = jest.spyOn(JSON, 'parse').mockImplementation(() => {
        throw new Error('Invalid JSON');
      });

      // Set up state with no encryption plugin
      state.storage.encryptionPluginName.value = undefined;
      state.plugins.failedPlugins.value = [];

      // Mock engine to return a value
      const getItemSpy = jest.spyOn(store.engine, 'getItem').mockReturnValue('invalid-json');

      const result = store.get('rl_anonymous_id');

      expect(result).toBeNull();
      expect(errorHandlerSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Error),
          context: 'Store id',
          customMessage: 'Failed to retrieve or parse data for "rl_anonymous_id" from storage',
          groupingHash: 'Failed to retrieve or parse data for "rl_anonymous_id" from storage',
        }),
      );

      // Clean up
      errorHandlerSpy.mockRestore();
      jsonParseSpy.mockRestore();
      getItemSpy.mockRestore();
      state.storage.encryptionPluginName.value = undefined;
      state.plugins.failedPlugins.value = [];
    });
  });

  describe('.set', () => {
    it('should serialize json', () => {
      Object.values(QueueStatuses).forEach(keyValue => {
        store.set(keyValue, ['a', 'b', {}]);
        expect(engine.getItem(`name.id.${keyValue}`)).toStrictEqual('"[\\"a\\",\\"b\\",{}]"');
      });
    });

    it('should return early if invalid key is provided', () => {
      const testStore = new Store(
        {
          name: 'name',
          id: 'id',
          validKeys: { validKey: 'validKey' },
          errorHandler: defaultErrorHandler,
          logger: defaultLogger,
        },
        getStorageEngine('localStorage'),
        pluginsManager,
      );

      // Spy on the engine's setItem to ensure it's not called for invalid keys
      const setItemSpy = jest.spyOn(testStore.engine, 'setItem');

      testStore.set('invalidKey', 'value');

      expect(setItemSpy).not.toHaveBeenCalled();

      setItemSpy.mockRestore();
    });

    it('should handle undefined and null values correctly', () => {
      const testValues = [undefined, null, '', 0, false];
      const resultValues = [null, null, '', 0, false];

      testValues.forEach((value, index) => {
        store.set(QueueStatuses.QUEUE, value);
        const storedValue = store.get(QueueStatuses.QUEUE);
        expect(storedValue).toEqual(resultValues[index]);
      });
    });

    it('should return null when decrypted value is an empty string', () => {
      // Mock the decrypt method to return an empty string
      const decryptSpy = jest.spyOn(store, 'decrypt').mockReturnValue('');

      // Mock the engine to return a non-null value so we can test the empty string check
      const getItemSpy = jest
        .spyOn(store.engine, 'getItem')
        .mockReturnValue('some-encrypted-value');

      const result = store.get(QueueStatuses.QUEUE);

      expect(result).toBeNull();
      expect(decryptSpy).toHaveBeenCalledWith('some-encrypted-value');

      // Clean up spies
      decryptSpy.mockRestore();
      getItemSpy.mockRestore();
    });

    it('should handle complex objects with circular references', () => {
      const complexObject: any = {
        name: 'test',
        nested: {
          value: 42,
        },
      };
      // Create circular reference
      complexObject.self = complexObject;

      // Should not throw an error due to stringifyWithoutCircular usage
      expect(() => store.set(QueueStatuses.QUEUE, complexObject)).not.toThrow();

      const retrieved = store.get(QueueStatuses.QUEUE);
      expect(retrieved.name).toBe('test');
      expect(retrieved.nested.value).toBe(42);
      // Circular reference should be handled (removed or replaced)
    });

    it('should handle storage errors by calling error handler when not quota exceeded', () => {
      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError').mockImplementation();
      const loggerWarnSpy = jest.spyOn(defaultLogger, 'warn').mockImplementation();

      // Mock setItem to throw a non-quota error
      const setItemSpy = jest.spyOn(store.engine, 'setItem').mockImplementation(() => {
        throw new Error('Generic storage error');
      });

      store.set(QueueStatuses.QUEUE, 'test-value');

      expect(errorHandlerSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Error),
          context: 'Store id',
          customMessage: 'Failed to save the value for "queue" to storage',
          groupingHash: 'Failed to save the value for "queue" to storage',
        }),
      );

      // Clean up spies
      errorHandlerSpy.mockRestore();
      loggerWarnSpy.mockRestore();
      setItemSpy.mockRestore();
    });

    it('should handle quota exceeded error and switch to in-memory storage', () => {
      const loggerWarnSpy = jest.spyOn(defaultLogger, 'warn').mockImplementation();
      const swapEngineSpy = jest.spyOn(store, 'swapQueueStoreToInMemoryEngine');

      // Mock setItem to throw quota exceeded error
      const setItemSpy = jest.spyOn(store.engine, 'setItem').mockImplementation(() => {
        throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
      });

      store.set(QueueStatuses.QUEUE, 'test-value');

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('The storage is either full or unavailable'),
      );
      expect(swapEngineSpy).toHaveBeenCalled();

      // Clean up spies
      loggerWarnSpy.mockRestore();
      swapEngineSpy.mockRestore();
      setItemSpy.mockRestore();
    });
  });

  describe('.remove', () => {
    it('should remove the item', () => {
      Object.values(QueueStatuses).forEach(keyValue => {
        store.set(keyValue, 'a');
        store.remove(keyValue);
        expect(engine.getItem(`name.id.${keyValue}`)).toBeNull();
      });
    });
  });

  describe('.createValidKey', () => {
    it('should return compound if no QueueStatuses specd', () => {
      Object.values(QueueStatuses).forEach(() => {
        store = new Store(
          {
            name: 'name',
            id: 'id',
            errorHandler: defaultErrorHandler,
            logger: defaultLogger,
          },
          getStorageEngine('localStorage'),
          pluginsManager,
        );
        expect(store.createValidKey('test')).toStrictEqual('name.id.test');
      });
    });

    it('should return undefined if invalid key', () => {
      Object.values(QueueStatuses).forEach(() => {
        store = new Store(
          {
            name: 'name',
            id: 'id',
            validKeys: { nope: 'wrongKey' },
            errorHandler: defaultErrorHandler,
            logger: defaultLogger,
          },
          getStorageEngine('localStorage'),
          pluginsManager,
        );
        expect(store.createValidKey('test')).toBeUndefined();
      });
    });

    it('should return compound if valid key', () => {
      store = new Store(
        {
          name: 'name',
          id: 'id',
          errorHandler: defaultErrorHandler,
          logger: defaultLogger,
        },
        getStorageEngine('localStorage'),
        pluginsManager,
      );
      expect(store.createValidKey('queue')).toStrictEqual('name.id.queue');
    });
  });

  describe('.swapEngine', () => {
    it('should switch the underlying storage mechanism', () => {
      expect(store.engine).toStrictEqual(getStorageEngine('localStorage'));
      store.swapQueueStoreToInMemoryEngine();
      expect(store.engine).toStrictEqual(getStorageEngine('memoryStorage'));
    });

    it('should not switch the original storage mechanism', () => {
      expect(store.getOriginalEngine()).toStrictEqual(getStorageEngine('localStorage'));
      store.swapQueueStoreToInMemoryEngine();
      expect(store.getOriginalEngine()).toStrictEqual(getStorageEngine('localStorage'));
    });

    it('should swap upon quotaExceeded on set', () => {
      store = new Store(
        {
          name: 'name',
          id: 'id',
          validKeys: QueueStatuses,
          errorHandler: defaultErrorHandler,
          logger: defaultLogger,
        },
        lsProxy,
        pluginsManager,
      );

      Object.values(QueueStatuses).forEach(keyValue => {
        store.set(keyValue, 'stuff');
      });

      store.engine.setItem = () => {
        throw new DOMException('error', 'QuotaExceededError');
      };

      store.set(QueueStatuses.QUEUE, 'other');
      expect(store.get(QueueStatuses.QUEUE)).toStrictEqual('other');
    });

    it('should migrate existing queue entries to the in-memory engine', () => {
      store = new Store(
        {
          name: 'swapMigrate',
          id: 'q1',
          validKeys: QueueStatuses,
          errorHandler: defaultErrorHandler,
          logger: defaultLogger,
        },
        lsProxy,
        pluginsManager,
      );

      store.set(QueueStatuses.QUEUE, ['event-1']);
      store.set(QueueStatuses.ACK, 1735689600000);

      store.swapQueueStoreToInMemoryEngine();

      expect(store.get(QueueStatuses.QUEUE)).toStrictEqual(['event-1']);
      expect(store.get(QueueStatuses.ACK)).toStrictEqual(1735689600000);
    });

    it('should remove the migrated queue entries from the original engine', () => {
      store = new Store(
        {
          name: 'swapRemove',
          id: 'q2',
          validKeys: QueueStatuses,
          errorHandler: defaultErrorHandler,
          logger: defaultLogger,
        },
        lsProxy,
        pluginsManager,
      );

      store.set(QueueStatuses.QUEUE, ['event-1']);

      store.swapQueueStoreToInMemoryEngine();

      expect(store.getOriginalEngine().getItem('swapRemove.q2.queue')).toBeNull();
    });

    // Regression guard: the quota swap serves the client data store too, where
    // dropping the durable copy would lose identity on the next page load.
    // Production client data stores are created without validKeys
    // (StoreManager.initClientDataStores), so nothing migrates for them today;
    // this pins the noCompoundKey branch regardless of how they are configured.
    it('should retain client data in the original engine after the swap', () => {
      store = new Store(
        {
          name: 'swapClientRetain',
          id: 'c2',
          validKeys: COOKIE_KEYS,
          noCompoundKey: true,
          errorHandler: defaultErrorHandler,
          logger: defaultLogger,
        },
        lsProxy,
        pluginsManager,
      );

      store.set(COOKIE_KEYS.userId, 'user-1');

      store.swapQueueStoreToInMemoryEngine();

      expect(store.getOriginalEngine().getItem(COOKIE_KEYS.userId)).not.toBeNull();
    });
  });
});
