import { Store } from '@rudderstack/analytics-js/services/StoreManager/Store';
import { QueueStatuses } from '@rudderstack/analytics-js-plugins/xhrQueue/localstorage-retry/QueueStatuses';
import { getStorageEngine } from '@rudderstack/analytics-js/services/StoreManager/storages/storageEngine';

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

  beforeEach(() => {
    engine.clear();
    store = new Store(
      {
        name: 'name',
        id: 'id',
        validKeys: QueueStatuses,
      },
      getStorageEngine('localStorage'),
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
          },
          getStorageEngine('localStorage'),
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
          },
          getStorageEngine('localStorage'),
        );
        expect(store.createValidKey('test')).toBeUndefined();
      });
    });

    it('should return compound if valid key', () => {
      store = new Store(
        {
          name: 'name',
          id: 'id',
        },
        getStorageEngine('localStorage'),
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
        },
        lsProxy,
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
