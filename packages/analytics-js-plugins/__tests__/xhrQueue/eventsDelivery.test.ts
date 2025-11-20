import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import {
  LOCAL_STORAGE,
  MEMORY_STORAGE,
  SESSION_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import * as storageUtils from '@rudderstack/analytics-js-common/utilities/storage';
import { getStorageTypeForEventsPersistence } from '../../src/utilities/eventsDelivery';

jest.mock('@rudderstack/analytics-js-common/utilities/storage');

describe('Events Delivery Utilities', () => {
  describe('getStorageTypeForEventsPersistence', () => {
    const mockIsStorageAvailable = storageUtils.isStorageAvailable as jest.MockedFunction<
      typeof storageUtils.isStorageAvailable
    >;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return LOCAL_STORAGE when local storage is available', () => {
      mockIsStorageAvailable.mockReturnValueOnce(true);

      const result = getStorageTypeForEventsPersistence();

      expect(result).toBe(LOCAL_STORAGE);
      expect(mockIsStorageAvailable).toHaveBeenCalledTimes(1);
      expect(mockIsStorageAvailable).toHaveBeenCalledWith(LOCAL_STORAGE, undefined, undefined);
    });

    it('should return LOCAL_STORAGE when local storage is available with logger', () => {
      mockIsStorageAvailable.mockReturnValueOnce(true);

      const result = getStorageTypeForEventsPersistence(defaultLogger);

      expect(result).toBe(LOCAL_STORAGE);
      expect(mockIsStorageAvailable).toHaveBeenCalledTimes(1);
      expect(mockIsStorageAvailable).toHaveBeenCalledWith(LOCAL_STORAGE, undefined, defaultLogger);
    });

    it('should fall back to SESSION_STORAGE when local storage is unavailable but session storage is available', () => {
      mockIsStorageAvailable
        .mockReturnValueOnce(false) // localStorage check fails
        .mockReturnValueOnce(true); // sessionStorage check succeeds

      const result = getStorageTypeForEventsPersistence();

      expect(result).toBe(SESSION_STORAGE);
      expect(mockIsStorageAvailable).toHaveBeenCalledTimes(2);
      expect(mockIsStorageAvailable).toHaveBeenNthCalledWith(
        1,
        LOCAL_STORAGE,
        undefined,
        undefined,
      );
      expect(mockIsStorageAvailable).toHaveBeenNthCalledWith(
        2,
        SESSION_STORAGE,
        undefined,
        undefined,
      );
    });

    it('should fall back to SESSION_STORAGE when local storage is unavailable but session storage is available with logger', () => {
      mockIsStorageAvailable
        .mockReturnValueOnce(false) // localStorage check fails
        .mockReturnValueOnce(true); // sessionStorage check succeeds

      const result = getStorageTypeForEventsPersistence(defaultLogger);

      expect(result).toBe(SESSION_STORAGE);
      expect(mockIsStorageAvailable).toHaveBeenCalledTimes(2);
      expect(mockIsStorageAvailable).toHaveBeenNthCalledWith(
        1,
        LOCAL_STORAGE,
        undefined,
        defaultLogger,
      );
      expect(mockIsStorageAvailable).toHaveBeenNthCalledWith(
        2,
        SESSION_STORAGE,
        undefined,
        defaultLogger,
      );
    });

    it('should fall back to MEMORY_STORAGE when both local storage and session storage are unavailable', () => {
      mockIsStorageAvailable
        .mockReturnValueOnce(false) // localStorage check fails
        .mockReturnValueOnce(false); // sessionStorage check fails

      const result = getStorageTypeForEventsPersistence();

      expect(result).toBe(MEMORY_STORAGE);
      expect(mockIsStorageAvailable).toHaveBeenCalledTimes(2);
      expect(mockIsStorageAvailable).toHaveBeenNthCalledWith(
        1,
        LOCAL_STORAGE,
        undefined,
        undefined,
      );
      expect(mockIsStorageAvailable).toHaveBeenNthCalledWith(
        2,
        SESSION_STORAGE,
        undefined,
        undefined,
      );
    });

    it('should fall back to MEMORY_STORAGE when both local storage and session storage are unavailable with logger', () => {
      mockIsStorageAvailable
        .mockReturnValueOnce(false) // localStorage check fails
        .mockReturnValueOnce(false); // sessionStorage check fails

      const result = getStorageTypeForEventsPersistence(defaultLogger);

      expect(result).toBe(MEMORY_STORAGE);
      expect(mockIsStorageAvailable).toHaveBeenCalledTimes(2);
      expect(mockIsStorageAvailable).toHaveBeenNthCalledWith(
        1,
        LOCAL_STORAGE,
        undefined,
        defaultLogger,
      );
      expect(mockIsStorageAvailable).toHaveBeenNthCalledWith(
        2,
        SESSION_STORAGE,
        undefined,
        defaultLogger,
      );
    });

    it('should not check session storage if local storage is available', () => {
      mockIsStorageAvailable.mockReturnValueOnce(true); // localStorage check succeeds

      const result = getStorageTypeForEventsPersistence();

      expect(result).toBe(LOCAL_STORAGE);
      expect(mockIsStorageAvailable).toHaveBeenCalledTimes(1);
      // Should only check localStorage, not sessionStorage
      expect(mockIsStorageAvailable).toHaveBeenCalledWith(LOCAL_STORAGE, undefined, undefined);
    });

    it('should follow the priority order: localStorage > sessionStorage > memoryStorage', () => {
      // Test case 1: All available - should return localStorage
      mockIsStorageAvailable.mockReturnValueOnce(true);
      let result = getStorageTypeForEventsPersistence();
      expect(result).toBe(LOCAL_STORAGE);

      jest.clearAllMocks();

      // Test case 2: Only sessionStorage available - should return sessionStorage
      mockIsStorageAvailable
        .mockReturnValueOnce(false) // localStorage unavailable
        .mockReturnValueOnce(true); // sessionStorage available
      result = getStorageTypeForEventsPersistence();
      expect(result).toBe(SESSION_STORAGE);

      jest.clearAllMocks();

      // Test case 3: None available - should return memoryStorage
      mockIsStorageAvailable
        .mockReturnValueOnce(false) // localStorage unavailable
        .mockReturnValueOnce(false); // sessionStorage unavailable
      result = getStorageTypeForEventsPersistence();
      expect(result).toBe(MEMORY_STORAGE);
    });

    it('should handle storage availability check throwing errors gracefully', () => {
      // isStorageAvailable should handle errors internally and return false
      // but we test that the function still works if it throws
      mockIsStorageAvailable
        .mockImplementationOnce(() => {
          throw new Error('Unexpected error');
        })
        .mockReturnValueOnce(true); // sessionStorage check succeeds

      expect(() => getStorageTypeForEventsPersistence()).toThrow('Unexpected error');
    });

    it('should return MEMORY_STORAGE when all storage checks return false without logger', () => {
      mockIsStorageAvailable.mockReturnValue(false);

      const result = getStorageTypeForEventsPersistence();

      expect(result).toBe(MEMORY_STORAGE);
      // No logger passed, so logger parameter should be undefined
      expect(mockIsStorageAvailable).toHaveBeenCalledWith(LOCAL_STORAGE, undefined, undefined);
      expect(mockIsStorageAvailable).toHaveBeenCalledWith(SESSION_STORAGE, undefined, undefined);
    });

    it('should pass logger instance to all storage availability checks', () => {
      mockIsStorageAvailable
        .mockReturnValueOnce(false) // localStorage check fails
        .mockReturnValueOnce(false); // sessionStorage check fails

      getStorageTypeForEventsPersistence(defaultLogger);

      // Verify logger was passed to both checks
      expect(mockIsStorageAvailable).toHaveBeenNthCalledWith(
        1,
        LOCAL_STORAGE,
        undefined,
        defaultLogger,
      );
      expect(mockIsStorageAvailable).toHaveBeenNthCalledWith(
        2,
        SESSION_STORAGE,
        undefined,
        defaultLogger,
      );
    });

    it('should not invoke isStorageAvailable for memory storage', () => {
      mockIsStorageAvailable
        .mockReturnValueOnce(false) // localStorage check fails
        .mockReturnValueOnce(false); // sessionStorage check fails

      const result = getStorageTypeForEventsPersistence();

      expect(result).toBe(MEMORY_STORAGE);
      // Should only check localStorage and sessionStorage, never memoryStorage
      expect(mockIsStorageAvailable).toHaveBeenCalledTimes(2);
      expect(mockIsStorageAvailable).not.toHaveBeenCalledWith(
        MEMORY_STORAGE,
        expect.anything(),
        expect.anything(),
      );
    });

    it('should handle undefined logger correctly', () => {
      mockIsStorageAvailable.mockReturnValueOnce(true);

      const result = getStorageTypeForEventsPersistence(undefined);

      expect(result).toBe(LOCAL_STORAGE);
      expect(mockIsStorageAvailable).toHaveBeenCalledWith(LOCAL_STORAGE, undefined, undefined);
    });

    it('should return correct storage type when localStorage is blocked (e.g., in cross-origin iframe)', () => {
      // Simulating scenario where localStorage is blocked (common in iframes)
      mockIsStorageAvailable
        .mockReturnValueOnce(false) // localStorage blocked
        .mockReturnValueOnce(true); // sessionStorage available

      const result = getStorageTypeForEventsPersistence(defaultLogger);

      expect(result).toBe(SESSION_STORAGE);
    });

    it('should return correct storage type when both localStorage and sessionStorage are blocked', () => {
      // Simulating scenario where all persistence storage is blocked
      mockIsStorageAvailable
        .mockReturnValueOnce(false) // localStorage blocked
        .mockReturnValueOnce(false); // sessionStorage blocked

      const result = getStorageTypeForEventsPersistence(defaultLogger);

      expect(result).toBe(MEMORY_STORAGE);
    });

    it('should work correctly with multiple consecutive calls', () => {
      // First call: localStorage available
      mockIsStorageAvailable.mockReturnValueOnce(true);
      expect(getStorageTypeForEventsPersistence()).toBe(LOCAL_STORAGE);

      // Second call: only sessionStorage available
      mockIsStorageAvailable.mockReturnValueOnce(false).mockReturnValueOnce(true);
      expect(getStorageTypeForEventsPersistence()).toBe(SESSION_STORAGE);

      // Third call: none available
      mockIsStorageAvailable.mockReturnValueOnce(false).mockReturnValueOnce(false);
      expect(getStorageTypeForEventsPersistence()).toBe(MEMORY_STORAGE);

      expect(mockIsStorageAvailable).toHaveBeenCalledTimes(5);
    });

    it('should never return cookie storage type', () => {
      // Even if all checks fail, should return memory storage, not cookie storage
      mockIsStorageAvailable.mockReturnValue(false);

      const result = getStorageTypeForEventsPersistence();

      expect(result).toBe(MEMORY_STORAGE);
      expect(result).not.toBe('cookieStorage');
    });
  });
});
