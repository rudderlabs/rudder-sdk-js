import { QueueStatuses } from '@rudderstack/analytics-js-common/constants/QueueStatuses';
import { Store } from '../../../src/services/StoreManager/Store';
import { getStorageEngine } from '../../../src/services/StoreManager/storages/storageEngine';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { defaultLogger } from '../../../src/services/Logger';
import { PluginsManager } from '../../../src/components/pluginsManager';
import { PluginEngine } from '../../../src/services/PluginEngine';

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
  };

  const pluginEngine = new PluginEngine(defaultLogger);
  const pluginsManager = new PluginsManager(pluginEngine, defaultErrorHandler, defaultLogger);

  beforeEach(() => {
    engine.clear();
    store = new Store(
      {
        name: 'name',
        id: 'id',
        validKeys: QueueStatuses,
        errorHandler: defaultErrorHandler,
        logger: defaultLogger,
      },
      getStorageEngine('localStorage'),
      pluginsManager,
    );
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
  });

  describe('.set', () => {
    it('should serialize json', () => {
      Object.values(QueueStatuses).forEach(keyValue => {
        store.set(keyValue, ['a', 'b', {}]);
        expect(engine.getItem(`name.id.${keyValue}`)).toStrictEqual('"[\\"a\\",\\"b\\",{}]"');
      });
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

      Object.keys(QueueStatuses).forEach(keyValue => {
        store.set(keyValue, 'stuff');
      });

      store.engine.setItem = () => {
        throw new DOMException('error', 'QuotaExceededError');
      };

      store.set(QueueStatuses.QUEUE, 'other');
      expect(store.get(QueueStatuses.QUEUE)).toStrictEqual('other');
    });
  });
});
