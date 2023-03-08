import {
  defaultStorageEngine,
  inMemoryStorageEngine,
} from '../../../src/components/storage/storage';

describe('localStorage', () => {
  let engine: Storage;

  describe('when supported', () => {
    beforeEach(() => {
      engine = defaultStorageEngine;
      engine.clear();
    });

    it('should function', () => {
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

  describe('when not supported', () => {
    beforeEach(() => {
      engine = inMemoryStorageEngine;
      engine.clear();
    });

    it('should function', () => {
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
});
