import { defaultStoreManager } from '@rudderstack/analytics-js-common/__mocks__/StoreManager';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { resetState, state } from '../../__mocks__/state';
import {
  updateConsentStateFromData,
  getConsentData,
  getKetchConsentData,
} from '../../src/ketchConsentManager/utils';

describe('KetchConsentManager - Utils', () => {
  beforeEach(() => {
    resetState();

    // delete all cookies
    document.cookie.split(';').forEach(c => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
  });

  describe('updateConsentStateFromData', () => {
    it('should update the consent state from the ketch data', () => {
      const ketchConsentData = {
        purpose1: true,
        purpose2: false,
        purpose3: true,
        purpose4: false,
        purpose5: true,
      };

      // Initialize the plugin
      updateConsentStateFromData(state, ketchConsentData);

      expect(state.consents.data.value).toStrictEqual({
        allowedConsentIds: ['purpose1', 'purpose3', 'purpose5'],
        deniedConsentIds: ['purpose2', 'purpose4'],
      });
    });
  });

  describe('getConsentData', () => {
    it('should get consent data from ketch consent data', () => {
      const ketchConsentData = {
        purpose1: true,
        purpose2: false,
        purpose3: true,
        purpose4: false,
        purpose5: true,
      };

      const consentData = getConsentData(ketchConsentData);

      expect(consentData).toStrictEqual({
        allowedConsentIds: ['purpose1', 'purpose3', 'purpose5'],
        deniedConsentIds: ['purpose2', 'purpose4'],
      });
    });

    it('should get consent data if the ketch consent data is not provided', () => {
      const consentData = getConsentData();

      expect(consentData).toStrictEqual({
        allowedConsentIds: [],
        deniedConsentIds: [],
      });
    });
  });

  describe('getKetchConsentData', () => {
    it('should get the ketch consent data from cookies', () => {
      // Mock the ketch data in the cookies
      const ketchRawConsentData = {
        purpose1: {
          status: 'granted',
        },
        purpose2: {
          status: 'denied',
        },
        purpose3: {
          status: 'granted',
        },
        purpose4: {
          status: 'denied',
        },
        purpose5: {
          status: 'granted',
        },
      };
      const ketchConsentString = JSON.stringify(ketchRawConsentData);

      // Mock the ketch cookies
      document.cookie = `_ketch_consent_v1_=${window.btoa(ketchConsentString)};`;

      const ketchConsentData = getKetchConsentData(defaultStoreManager, defaultLogger);

      expect(ketchConsentData).toStrictEqual({
        purpose1: true,
        purpose2: false,
        purpose3: true,
        purpose4: false,
        purpose5: true,
      });
    });

    it('should return undefined if ketch consent cookie could not be read', () => {
      // mock store manager to intentionally throw error
      const mockStoreManager = {
        setStore: () => ({
          engine: null,
        }),
      };

      const ketchConsentData = getKetchConsentData(mockStoreManager, defaultLogger);

      expect(ketchConsentData).toBeUndefined();
      expect(defaultLogger.error).toHaveBeenCalledWith(
        'KetchConsentManagerPlugin:: Failed to read the consent cookie.',
        new TypeError("Cannot read properties of null (reading 'getItem')"),
      );
    });

    it('should return undefined if ketch consent cookie is not present', () => {
      const ketchConsentData = getKetchConsentData(defaultStoreManager, defaultLogger);

      expect(ketchConsentData).toBeUndefined();
    });

    it('should return undefined if ketch consent cookie data is not properly encoded', () => {
      // Mock the ketch cookie
      // The value is incorrect Base64 encoded string of "xyz"
      document.cookie = `_ketch_consent_v1_=eHl;`;

      const ketchConsentData = getKetchConsentData(defaultStoreManager, defaultLogger);

      expect(ketchConsentData).toBeUndefined();
      expect(defaultLogger.error).toHaveBeenCalledWith(
        'KetchConsentManagerPlugin:: Failed to parse the consent cookie.',
        new SyntaxError('Unexpected token \'x\', "xy" is not valid JSON'),
      );
    });

    it('should return undefined if ketch consent cookie data is not JSON string', () => {
      // Mock the ketch cookie
      // The value is not JSON stringified
      document.cookie = `_ketch_consent_v1_=YWJjZGU=;`;

      const ketchConsentData = getKetchConsentData(defaultStoreManager, defaultLogger);

      expect(ketchConsentData).toBeUndefined();
      expect(defaultLogger.error).toHaveBeenCalledWith(
        'KetchConsentManagerPlugin:: Failed to parse the consent cookie.',
        new SyntaxError('Unexpected token \'a\', "abcde" is not valid JSON'),
      );
    });

    it('should return undefined if ketch consent data inside the cookie is null', () => {
      // Mock the ketch cookie
      // The value is inside is null
      document.cookie = `_ketch_consent_v1_=bnVsbA==;`;

      const ketchConsentData = getKetchConsentData(defaultStoreManager, defaultLogger);

      expect(ketchConsentData).toBeUndefined();
    });

    it('should return undefined if ketch consent data inside the cookie is an empty string', () => {
      // Mock the ketch cookie
      // The value is inside is empty string
      document.cookie = `_ketch_consent_v1_=IiI=;`;

      const ketchConsentData = getKetchConsentData(defaultStoreManager, defaultLogger);

      expect(ketchConsentData).toBeUndefined();
    });
  });
});
