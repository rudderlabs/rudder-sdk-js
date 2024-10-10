import { Store } from '../../../src/services/StoreManager/Store';
import { getStorageEngine } from '../../../src/services/StoreManager/storages/storageEngine';

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

  const validKeys = ['queue', 'ack', 'batchQueue', 'inProgress', 'reclaimStart', 'reclaimEnd'];

  beforeEach(() => {
    engine.clear();
    store = new Store(
      {
        name: 'name',
        id: 'id',
        validKeys,
      },
      getStorageEngine('localStorage'),
    );
  });

  describe('get', () => {
    it('should default to null', () => {
      validKeys.forEach(keyValue => {
        expect(store.get(keyValue)).toBeNull();
      });
    });

    it('should de-serialize json', () => {
      validKeys.forEach(keyValue => {
        engine.setItem(`name.id.${keyValue}`, '"[\\"a\\",\\"b\\",{}]"');
        expect(store.get(keyValue)).toStrictEqual(['a', 'b', {}]);
      });
    });

    // TODO: fix, caused by Difference is the storejs and retry-queue localstorage implementation
    it('should return null if value is not valid json', () => {
      engine.setItem('name.id.queue', '[{]}');
      expect(store.get('queue')).toBeNull();
    });
  });

  describe('set', () => {
    it('should serialize json', () => {
      validKeys.forEach(keyValue => {
        store.set(keyValue, ['a', 'b', {}]);
        expect(engine.getItem(`name.id.${keyValue}`)).toStrictEqual('"[\\"a\\",\\"b\\",{}]"');
      });
    });
  });

  describe('remove', () => {
    it('should remove the item', () => {
      validKeys.forEach(keyValue => {
        store.set(keyValue, 'a');
        store.remove(keyValue);
        expect(engine.getItem(`name.id.${keyValue}`)).toBeNull();
      });
    });
  });

  describe('createValidKey', () => {
    it('should return compound if no valid keys are specified', () => {
      validKeys.forEach(() => {
        store = new Store(
          {
            name: 'name',
            id: 'id',
          },
          getStorageEngine('localStorage'),
        );
        expect(store.private_createValidKey('test')).toStrictEqual('name.id.test');
      });
    });

    it('should return undefined if invalid key', () => {
      validKeys.forEach(() => {
        store = new Store(
          {
            name: 'name',
            id: 'id',
            validKeys: ['wrongKey'],
          },
          getStorageEngine('localStorage'),
        );
        expect(store.private_createValidKey('test')).toBeUndefined();
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
      expect(store.private_createValidKey('queue')).toStrictEqual('name.id.queue');
    });
  });

  describe('.swapEngine', () => {
    it('should switch the underlying storage mechanism', () => {
      expect(store.private_engine).toStrictEqual(getStorageEngine('localStorage'));
      store.swapQueueStoreToInMemoryEngine();
      expect(store.private_engine).toStrictEqual(getStorageEngine('memoryStorage'));
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
          validKeys,
        },
        lsProxy,
      );

      validKeys.forEach(keyValue => {
        store.set(keyValue, 'stuff');
      });

      store.getOriginalEngine().setItem = () => {
        throw new DOMException('error', 'QuotaExceededError');
      };

      store.set('queue', 'other');
      expect(store.get('queue')).toStrictEqual('other');
    });
  });
});
