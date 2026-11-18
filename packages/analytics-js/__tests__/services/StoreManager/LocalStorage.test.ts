import { LocalStorage } from '../../../src/services/StoreManager/storages/LocalStorage';

describe('LocalStorage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    window.localStorage.clear();
  });

  it.each([
    ['"\\"anonymous-id\\""', '"anonymous-id"'],
    ['{"event":"test"}', { event: 'test' }],
    ['false', false],
    ['0', 0],
    ['null', null],
    ['"123"', '123'],
    ['{invalid JSON', '{invalid JSON'],
    ['', ''],
  ])('reads the previous storage format for %j', (storedValue, expectedValue) => {
    window.localStorage.setItem('previous-key', storedValue);
    expect(new LocalStorage().getItem('previous-key')).toEqual(expectedValue);
  });

  it('preserves the stored bytes and returns null for a missing key', () => {
    const storage = new LocalStorage();

    storage.setItem('identity', '"anonymous-id"');
    storage.setItem('undefined-value', undefined);

    expect(window.localStorage.getItem('identity')).toBe('"\\"anonymous-id\\""');
    expect(window.localStorage.getItem('undefined-value')).toBe('undefined');
    expect(storage.getItem('missing')).toBeNull();
  });

  it('enumerates native keys and maintains length after writes and removals', () => {
    const storage = new LocalStorage();
    window.localStorage.setItem('existing', 'true');

    storage.setItem('added', { count: 1 });

    expect(storage).toHaveLength(2);
    expect(storage.keys()).toEqual(['existing', 'added']);
    expect(storage.key(1)).toBe('added');
    expect(storage.key(2)).toBeNull();

    storage.removeItem('existing');
    expect(storage).toHaveLength(1);
    storage.clear();
    expect(storage).toHaveLength(0);
    expect(storage.keys()).toEqual([]);
  });

  it('ignores empty keys and keeps the legacy string encoding for functions', () => {
    const storage = new LocalStorage();
    const value = () => 'example';

    storage.setItem('', 'invalid-key');
    storage.setItem('function', value);

    expect(window.localStorage.getItem('')).toBeNull();
    expect(storage.getItem('function')).toBe(String(value));
  });

  it('skips a key that disappears during enumeration', () => {
    const storage = new LocalStorage();
    storage.setItem('existing', 'value');
    jest.spyOn(Storage.prototype, 'key').mockReturnValueOnce(null);

    expect(storage.keys()).toEqual([]);
  });

  it('uses a private in-memory fallback if localStorage is blocked at startup', () => {
    const getStorage = jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('Storage is blocked', 'SecurityError');
    });

    jest.isolateModules(() => {
      const { defaultLocalStorage } = jest.requireActual<
        typeof import('../../../src/services/StoreManager/storages/LocalStorage')
      >('../../../src/services/StoreManager/storages/LocalStorage');
      defaultLocalStorage.configure();
      expect(defaultLocalStorage.isEnabled).toBe(false);
      expect(defaultLocalStorage.getItem('toString')).toBeNull();

      defaultLocalStorage.setItem('identity', { id: 'anonymous-id' });
      expect(defaultLocalStorage.getItem('identity')).toEqual({ id: 'anonymous-id' });
    });

    getStorage.mockRestore();
    expect(window.localStorage.getItem('identity')).toBeNull();
  });

  it('propagates quota errors after startup so the queue can switch engines', () => {
    const storage = new LocalStorage();
    const quotaError = new DOMException('Storage is full', 'QuotaExceededError');
    storage.setItem('identity', 'anonymous-id');

    jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw quotaError;
    });

    expect(() => storage.setItem('queue', [])).toThrow(quotaError);
    expect(window.localStorage.getItem('identity')).toBe('"anonymous-id"');
    expect(window.localStorage.getItem('queue')).toBeNull();
  });
});
