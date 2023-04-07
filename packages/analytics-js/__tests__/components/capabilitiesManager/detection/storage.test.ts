import {
  isStorageQuotaExceeded,
  isStorageAvailable,
} from '@rudderstack/analytics-js/components/capabilitiesManager/detection/storage';
import {
  CookieStorage,
  InMemoryStorage,
} from '@rudderstack/analytics-js/services/StoreManager/storages';

describe('Capabilities Detection - Storage', () => {
  it('should detect localstorage size limit errors', () => {
    expect(
      isStorageQuotaExceeded(new DOMException('StorageQuotaExceeded', 'QuotaExceededError')),
    ).toBeTruthy();
  });
  it('should not detect localstorage size limit errors for not listed error names', () => {
    expect(
      isStorageQuotaExceeded(new DOMException('StorageQuotaExceeded', 'RandomError')),
    ).toBeFalsy();
  });
  it('should detect if localstorage is available', () => {
    expect(isStorageAvailable()).toBeTruthy();
  });
  it('should detect if cookieStorage is available', () => {
    expect(isStorageAvailable('cookieStorage', new CookieStorage())).toBeTruthy();
  });
  it('should detect if memoryStorage is available', () => {
    expect(isStorageAvailable('memoryStorage', new InMemoryStorage())).toBeTruthy();
  });
});
