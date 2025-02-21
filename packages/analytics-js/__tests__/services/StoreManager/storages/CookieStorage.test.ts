import type { IStorage } from '@rudderstack/analytics-js-common/types/Store';
import {
  getStorageEngine,
  configureCookieStorageEngine,
} from '../../../../src/services/StoreManager/storages/storageEngine';

describe('CookieStorage', () => {
  let engine: IStorage;

  beforeEach(() => {
    engine = getStorageEngine('cookieStorage');
    engine.configure?.();
    engine.clear();
  });

  it('should function as expected', () => {
    engine.setItem('test-key', 'abc');
    expect(engine.getItem('test-key')).toStrictEqual('abc');
    expect(engine.length).toStrictEqual(1);
    expect(engine.key(0)).toStrictEqual('test-key');
    expect(engine.key(1)).toBeNull();
    expect(engine.keys()).toStrictEqual(['test-key']);

    engine.removeItem('test-key');
    expect(engine.getItem('test-key')).toBeNull();
    expect(engine.length).toStrictEqual(0);
    expect(engine.keys()).toStrictEqual([]);

    // clear not implemented intentionally, see source code comments
    // engine.setItem('test-key', 'abc');
    // engine.clear();
    // expect(engine.length).toStrictEqual(0);
  });
  it('should not set domain if sameDomainCookiesOnly is set to true', () => {
    expect(typeof engine.options.domain).toBe('string');
    configureCookieStorageEngine({
      samesite: 'Lax',
      domain: 'example.com',
      maxage: 31536000000,
      enabled: true,
      sameDomainCookiesOnly: true,
    });
    const newEngine = getStorageEngine('cookieStorage');
    expect(newEngine.options.domain).toBe(undefined);
  });
});
