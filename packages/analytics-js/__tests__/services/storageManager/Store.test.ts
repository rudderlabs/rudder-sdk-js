import {
  defaultStorageEngine,
  inMemoryStorageEngine,
} from '@rudderstack/analytics-js/services/StorageManager/storage';
import { Store } from '@rudderstack/analytics-js/services/StorageManager/Store';
import { QueueStatuses } from '@rudderstack/analytics-js/npmPackages/localstorage-retry/QueueStatuses';

describe('Store', () => {
  let store: Store;
  const engine = defaultStorageEngine;
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
    store = new Store('name', 'id', QueueStatuses);
  });

  describe('.get', () => {
    it('should default to null', () => {
      Object.values(QueueStatuses).forEach(keyValue => {
        expect(store.get(keyValue)).toBeNull();
      });
    });

    it('should de-serialize json', () => {
      Object.values(QueueStatuses).forEach(keyValue => {
        engine.setItem(`name.id.${keyValue}`, '["a","b",{}]');
        expect(store.get(keyValue)).toStrictEqual(['a', 'b', {}]);
      });
    });

    it('should return null if value is not valid json', () => {
      engine.setItem('name.id.queue', '[{]}');
      expect(store.get(QueueStatuses.QUEUE)).toBeNull();
    });
  });

  describe('.set', () => {
    it('should serialize json', () => {
      Object.values(QueueStatuses).forEach(keyValue => {
        store.set(keyValue, ['a', 'b', {}]);
        expect(engine.getItem(`name.id.${keyValue}`)).toStrictEqual('["a","b",{}]');
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
        store = new Store('name', 'id');
        expect(store.createValidKey('test')).toStrictEqual('name.id.test');
      });
    });

    it('should return undefined if invalid key', () => {
      Object.values(QueueStatuses).forEach(() => {
        store = new Store('name', 'id', { nope: 'wrongKey' });
        expect(store.createValidKey('test')).toBeUndefined();
      });
    });

    it('should return compound if valid key', () => {
      store = new Store('name', 'id');
      expect(store.createValidKey('queue')).toStrictEqual('name.id.queue');
    });
  });

  describe('.swapEngine', () => {
    it('should switch the underlying storage mechanism', () => {
      expect(store.engine).toStrictEqual(engine);
      store.swapToInMemoryEngine();
      expect(store.engine).toStrictEqual(inMemoryStorageEngine);
    });

    it('should not switch the original storage mechanism', () => {
      expect(store.getOriginalEngine()).toStrictEqual(engine);
      store.swapToInMemoryEngine();
      expect(store.getOriginalEngine()).toStrictEqual(engine);
    });

    it('should swap upon quotaExceeded on set', () => {
      store = new Store('name', 'id', QueueStatuses, lsProxy);

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
