import { IStorage } from '@rudderstack/analytics-js-common/types/Store';
import { getStorageEngine } from '../../../../src/services/StoreManager/storages/storageEngine';

describe('SessionStorage', () => {
  let engine: IStorage;

  beforeEach(() => {
    engine = getStorageEngine('sessionStorage');
    engine.clear();
  });

  it('should function as expected', () => {
    engine.setItem('test-key', 'abc');
    expect(engine.getItem('test-key')).toStrictEqual('abc');
    expect(engine.length).toStrictEqual(1);
    expect(engine.key(0)).toStrictEqual('test-key');

    engine.removeItem('test-key');
    expect(engine.getItem('test-key')).toBeNull();
    expect(engine.length).toStrictEqual(0);

    engine.setItem('test-key', 'abc');
    engine.clear();
    expect(engine.length).toStrictEqual(0);
  });
});
