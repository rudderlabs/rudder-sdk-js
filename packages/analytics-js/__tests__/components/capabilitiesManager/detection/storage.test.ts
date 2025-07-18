import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import {
  isStorageQuotaExceeded,
  isStorageAvailable,
} from '../../../../src/components/capabilitiesManager/detection/storage';
import { CookieStorage, InMemoryStorage } from '../../../../src/services/StoreManager/storages';

describe('Capabilities Detection - Storage', () => {
  it('should detect localstorage size limit errors', () => {
    expect(
      isStorageQuotaExceeded(new DOMException('StorageQuotaExceeded', 'QuotaExceededError')),
    ).toBeTruthy();
  });

  it('should detect Firefox storage quota exceeded errors', () => {
    const firefoxError = new DOMException('StorageQuotaExceeded', 'NS_ERROR_DOM_QUOTA_REACHED');
    // Mock the code property since it's read-only
    Object.defineProperty(firefoxError, 'code', { value: 1014, writable: false });
    expect(isStorageQuotaExceeded(firefoxError)).toBeTruthy();
  });

  it('should detect quota exceeded errors by error code', () => {
    const errorWithCode = new DOMException('Some message', 'SomeError');
    // Mock the code property since it's read-only
    Object.defineProperty(errorWithCode, 'code', { value: 22, writable: false });
    expect(isStorageQuotaExceeded(errorWithCode)).toBeTruthy();
  });

  it('should not detect localstorage size limit errors for not listed error names', () => {
    expect(
      isStorageQuotaExceeded(new DOMException('StorageQuotaExceeded', 'RandomError')),
    ).toBeFalsy();
  });

  it('should handle non-DOMException errors gracefully', () => {
    const regularError = new Error('Regular error');
    expect(() => isStorageQuotaExceeded(regularError)).not.toThrow();
    expect(isStorageQuotaExceeded(regularError)).toBeFalsy();
  });

  it('should handle null and undefined inputs gracefully', () => {
    expect(() => isStorageQuotaExceeded(null)).not.toThrow();
    expect(() => isStorageQuotaExceeded(undefined)).not.toThrow();
    expect(isStorageQuotaExceeded(null)).toBeFalsy();
    expect(isStorageQuotaExceeded(undefined)).toBeFalsy();
  });

  it('should handle objects without name or code properties gracefully', () => {
    const weirdObject = { message: 'weird object' };
    expect(() => isStorageQuotaExceeded(weirdObject)).not.toThrow();
    expect(isStorageQuotaExceeded(weirdObject)).toBeFalsy();
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

  it('should log a warning when storage is unavailable', () => {
    const mockLogger = defaultLogger;

    // Store the original descriptor so we can restore it later
    const originalLsDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
    const originalSessionStorageDescriptor = Object.getOwnPropertyDescriptor(
      window,
      'sessionStorage',
    );

    // Mock using Object.defineProperty
    Object.defineProperty(window, 'localStorage', {
      get: jest.fn(),
      set: jest.fn(),
      configurable: true,
    });

    // Mock using Object.defineProperty
    Object.defineProperty(window, 'sessionStorage', {
      get: jest.fn(),
      set: jest.fn(),
      configurable: true,
    });

    isStorageAvailable('localStorage', undefined, mockLogger);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      'CapabilitiesManager:: The "localStorage" storage type is unavailable.',
      undefined,
    );

    isStorageAvailable('sessionStorage', undefined, mockLogger);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      'CapabilitiesManager:: The "sessionStorage" storage type is unavailable.',
      undefined,
    );

    // Restore the original document.cookie descriptor
    Object.defineProperty(window, 'localStorage', originalLsDescriptor as PropertyDescriptor);
    Object.defineProperty(
      window,
      'sessionStorage',
      originalSessionStorageDescriptor as PropertyDescriptor,
    );
  });

  it('should log a warning when the local storage is full', () => {
    const mockLogger = defaultLogger;

    // Store the original descriptor so we can restore it later
    const originalLsDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');

    // Mock using Object.defineProperty
    Object.defineProperty(window, 'localStorage', {
      get: jest.fn(() => {
        throw new DOMException('StorageQuotaExceeded', 'QuotaExceededError');
      }),
      set: jest.fn(),
      configurable: true,
    });

    isStorageAvailable('localStorage', undefined, mockLogger);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      'CapabilitiesManager:: The "localStorage" storage type is full.',
      new DOMException('StorageQuotaExceeded', 'QuotaExceededError'),
    );

    // Restore the original document.cookie descriptor
    Object.defineProperty(window, 'localStorage', originalLsDescriptor as PropertyDescriptor);
  });
});
