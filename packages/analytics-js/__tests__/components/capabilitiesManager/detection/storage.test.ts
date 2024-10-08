import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
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

  it('should log a warning when storage is unavailable', () => {
    const mockLogger = {
      warn: jest.fn(),
    } as ILogger;

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
    const mockLogger = {
      warn: jest.fn(),
    } as ILogger;

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
