import { QueueStatuses } from '@rudderstack/analytics-js-common/constants/QueueStatuses';
import { COOKIE_KEYS } from '@rudderstack/analytics-js-cookies/constants/cookies';
import { decryptBrowser } from '@rudderstack/analytics-js-cookies/cookiesUtilities';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
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
    state.plugins.loadedPlugins.value = [];
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

    it('should drop the entry and report only once if the value cannot be parsed', () => {
      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError').mockImplementation();
      const reclaimStartKey = `name.id.${QueueStatuses.RECLAIM_START}`;

      // A single encoded value: set() writes two JSON layers and get() strips both,
      // so an entry that is missing one of them throws on parse.
      engine.setItem(reclaimStartKey, JSON.stringify('c68ffc7a-5e1a-4b2d-8c3f-9a1e0d7b6c45'));

      expect(store.get(QueueStatuses.RECLAIM_START)).toBeNull();
      expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
      expect(engine.getItem(reclaimStartKey)).toBeNull();

      // The corrupt entry is gone, so the next read is a clean miss and is not reported again
      expect(store.get(QueueStatuses.RECLAIM_START)).toBeNull();
      expect(errorHandlerSpy).toHaveBeenCalledTimes(1);

      errorHandlerSpy.mockRestore();
    });

    it('should leave the stored value in place when decryption fails', () => {
      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError').mockImplementation();
      const reclaimStartKey = `name.id.${QueueStatuses.RECLAIM_START}`;

      store.set(QueueStatuses.RECLAIM_START, 'c68ffc7a-5e1a-4b2d-8c3f-9a1e0d7b6c45');
      const storedValue = engine.getItem(reclaimStartKey);

      const decryptSpy = jest.spyOn(store, 'decrypt').mockImplementation(() => {
        throw new Error('Decryption failed');
      });

      expect(store.get(QueueStatuses.RECLAIM_START)).toBeNull();
      // A transiently failing encryption plugin must not cost the value; it is
      // readable again as soon as the plugin recovers.
      expect(engine.getItem(reclaimStartKey)).toBe(storedValue);
      expect(errorHandlerSpy).toHaveBeenCalledTimes(1);

      decryptSpy.mockRestore();
      errorHandlerSpy.mockRestore();
    });

    it('should not remove anything when the engine fails to retrieve the value', () => {
      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError').mockImplementation();
      const removeItemSpy = jest.spyOn(store.engine, 'removeItem');
      const getItemSpy = jest.spyOn(store.engine, 'getItem').mockImplementation(() => {
        throw new Error('NS_ERROR_STORAGE_BUSY');
      });

      expect(store.get(QueueStatuses.RECLAIM_START)).toBeNull();
      expect(removeItemSpy).not.toHaveBeenCalled();
      expect(errorHandlerSpy).toHaveBeenCalledTimes(1);

      getItemSpy.mockRestore();
      removeItemSpy.mockRestore();
      errorHandlerSpy.mockRestore();
    });

    it('should not remove an unparseable value that was rewritten after it was read', () => {
      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError').mockImplementation();
      const reclaimStartKey = `name.id.${QueueStatuses.RECLAIM_START}`;
      const corruptValue = 'c68ffc7a-5e1a-4b2d-8c3f-9a1e0d7b6c45';

      engine.setItem(reclaimStartKey, JSON.stringify(corruptValue));

      const removeItemSpy = jest.spyOn(store.engine, 'removeItem');
      // Another tab writes a healthy reclaimStart marker between the read and the removal
      const getItemSpy = jest
        .spyOn(store.engine, 'getItem')
        .mockReturnValueOnce(corruptValue)
        .mockReturnValue('1758440000000');

      expect(store.get(QueueStatuses.RECLAIM_START)).toBeNull();
      expect(removeItemSpy).not.toHaveBeenCalled();
      expect(errorHandlerSpy).toHaveBeenCalledTimes(1);

      getItemSpy.mockRestore();
      removeItemSpy.mockRestore();
      errorHandlerSpy.mockRestore();
    });

    it('should drop an unparseable value that the engine deserializes on every read', () => {
      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError').mockImplementation();
      const queueKey = `name.id.${QueueStatuses.QUEUE}`;

      // storejs parses the entry on every read, so the engine hands back a new array
      // each time. The value still fails to parse, and a reference comparison would
      // never match it against itself.
      engine.setItem(queueKey, '[{}]');

      expect(store.get(QueueStatuses.QUEUE)).toBeNull();
      expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
      expect(engine.getItem(queueKey)).toBeNull();

      // The corrupt entry is gone, so the next read is a clean miss and is not reported again
      expect(store.get(QueueStatuses.QUEUE)).toBeNull();
      expect(errorHandlerSpy).toHaveBeenCalledTimes(1);

      errorHandlerSpy.mockRestore();
    });

    it('should not remove an unparseable object value that was rewritten after it was read', () => {
      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError').mockImplementation();
      const queueKey = `name.id.${QueueStatuses.QUEUE}`;

      engine.setItem(queueKey, '[{}]');

      const removeItemSpy = jest.spyOn(store.engine, 'removeItem');
      // Another tab writes a different queue between the read and the removal
      const getItemSpy = jest
        .spyOn(store.engine, 'getItem')
        .mockReturnValueOnce([{}])
        .mockReturnValue([{ id: 'from-another-tab' }]);

      expect(store.get(QueueStatuses.QUEUE)).toBeNull();
      expect(removeItemSpy).not.toHaveBeenCalled();
      expect(errorHandlerSpy).toHaveBeenCalledTimes(1);

      getItemSpy.mockRestore();
      removeItemSpy.mockRestore();
      errorHandlerSpy.mockRestore();
    });

    it.each([
      ['has not loaded yet', [] as string[]],
      ['failed to load', ['StorageEncryption']],
    ])(
      'should keep an encrypted value when the encryption plugin %s',
      (_scenario, failedPlugins) => {
        const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError').mockImplementation();
        const encryptedStore = new Store(
          {
            name: 'name',
            id: 'id',
            validKeys: { ...QueueStatuses, ...COOKIE_KEYS },
            isEncrypted: true,
            errorHandler: defaultErrorHandler,
            logger: defaultLogger,
          },
          getStorageEngine('localStorage'),
          pluginsManager,
        );
        const reclaimStartKey = `name.id.${QueueStatuses.RECLAIM_START}`;
        const cipherText = 'RudderEncrypt:U2FsdGVkX1+x4Hn1Qb9Zq0pTn0X8';

        // No decrypt extension point is registered, so invokeSingle returns undefined and
        // crypto hands the ciphertext straight back. This is the real fallback, not a
        // throwing decrypt: the value looks retrieved and then fails to parse.
        state.storage.encryptionPluginName.value = 'StorageEncryption';
        state.plugins.loadedPlugins.value = [];
        state.plugins.failedPlugins.value = failedPlugins;

        engine.setItem(reclaimStartKey, cipherText);

        expect(encryptedStore.get(QueueStatuses.RECLAIM_START)).toBeNull();
        // Deleting here would destroy the only copy of a value the plugin can still read
        expect(engine.getItem(reclaimStartKey)).toBe(cipherText);

        errorHandlerSpy.mockRestore();
      },
    );

    it('should keep an encrypted value that the configured plugin cannot decrypt', () => {
      const errorHandlerSpy = jest.spyOn(defaultErrorHandler, 'onError').mockImplementation();
      const encryptedStore = new Store(
        {
          name: 'name',
          id: 'id',
          validKeys: { ...QueueStatuses, ...COOKIE_KEYS },
          isEncrypted: true,
          errorHandler: defaultErrorHandler,
          logger: defaultLogger,
        },
        getStorageEngine('localStorage'),
        pluginsManager,
      );
      const reclaimStartKey = `name.id.${QueueStatuses.RECLAIM_START}`;
      // A v1 value in a store configured for v3. The real v3 decrypt only handles the
      // RS_ENC_v3_ prefix and returns anything else untouched, so the ciphertext reaches
      // JSON.parse and throws just as it would if no plugin had run at all.
      const legacyCipherText = 'RudderEncrypt:U2FsdGVkX1+x4Hn1Qb9Zq0pTn0X8';

      pluginEngine.register(
        {
          name: 'StorageEncryption',
          storage: { decrypt: (value: string) => decryptBrowser(value) },
        } as unknown as ExtensionPlugin,
        state,
      );
      state.storage.encryptionPluginName.value = 'StorageEncryption';
      state.plugins.loadedPlugins.value = ['StorageEncryption'];

      engine.setItem(reclaimStartKey, legacyCipherText);

      try {
        expect(encryptedStore.get(QueueStatuses.RECLAIM_START)).toBeNull();
        // The legacy plugin can still read this value; deleting it loses it for good
        expect(engine.getItem(reclaimStartKey)).toBe(legacyCipherText);
      } finally {
        pluginEngine.unregister('StorageEncryption');
        errorHandlerSpy.mockRestore();
      }
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

    it('should save the triggering value when the durable engine refuses removal', () => {
      // localStorage.removeItem can throw NS_ERROR_STORAGE_BUSY. The swap runs from
      // inside set()'s catch, so an escaping error loses the very event that
      // triggered the quota fallback. See SDK-5473.
      let quotaArmed = false;
      const busyEngine = {
        ...lsProxy,
        setItem(key: string, value: any) {
          if (quotaArmed) {
            quotaArmed = false;
            throw new DOMException('Quota exceeded', 'QuotaExceededError');
          }
          return window.localStorage.setItem(key, value);
        },
        removeItem() {
          throw new DOMException('busy', 'NS_ERROR_STORAGE_BUSY');
        },
      };

      store = new Store(
        {
          name: 'swapBusy',
          id: 'b1',
          validKeys: QueueStatuses,
          errorHandler: defaultErrorHandler,
          logger: defaultLogger,
        },
        busyEngine,
        pluginsManager,
      );

      store.set(QueueStatuses.QUEUE, ['event-1']);
      quotaArmed = true;

      expect(() => store.set(QueueStatuses.BATCH_QUEUE, ['event-2'])).not.toThrow();
      expect(store.get(QueueStatuses.BATCH_QUEUE)).toStrictEqual(['event-2']);
      expect(store.get(QueueStatuses.QUEUE)).toStrictEqual(['event-1']);
    });

    it('should not fall back to memory when the store opts out', () => {
      // Stores that represent another queue's entries must keep those entries in
      // durable storage, so an interrupted reclaim can still find them later.
      const quotaEngine = {
        ...lsProxy,
        setItem() {
          throw new DOMException('Quota exceeded', 'QuotaExceededError');
        },
      };

      store = new Store(
        {
          name: 'noFallback',
          id: 'n1',
          validKeys: QueueStatuses,
          noSwapOnQuota: true,
          errorHandler: defaultErrorHandler,
          logger: defaultLogger,
        },
        quotaEngine,
        pluginsManager,
      );

      expect(() => store.set(QueueStatuses.QUEUE, ['event-1'])).not.toThrow();
      expect(store.engine).toStrictEqual(quotaEngine);
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
