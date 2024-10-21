import { state, resetState } from '@rudderstack/analytics-js/state';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { StoreManager } from '@rudderstack/analytics-js/services/StoreManager/StoreManager';
import {
  updateConsentStateFromData,
  getConsentData,
  getIubendaConsentData,
} from '../../src/iubendaConsentManager/utils';
import { IUBENDA_CONSENT_EXAMPLE_COOKIE_NAME } from '../../src/iubendaConsentManager/constants';

describe('IubendaConsentManager - Utils', () => {
  const mockLogger = {
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
  };

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
    it('should update the consent state from the iubenda data', () => {
      const iubendaConsentData = {
        '1': true,
        '2': false,
        '3': true,
        '4': false,
        '5': true,
      };

      // Initialize the plugin
      updateConsentStateFromData(state, iubendaConsentData);

      expect(state.consents.data.value).toStrictEqual({
        allowedConsentIds: ['1', '3', '5'],
        deniedConsentIds: ['2', '4'],
      });
    });
  });

  describe('getConsentData', () => {
    it('should get consent data from iubenda consent data', () => {
      const iubendaConsentData = {
        '1': true,
        '2': false,
        '3': true,
        '4': false,
        '5': true,
      };

      const consentData = getConsentData(iubendaConsentData);

      expect(consentData).toStrictEqual({
        allowedConsentIds: ['1', '3', '5'],
        deniedConsentIds: ['2', '4'],
      });
    });

    it('should get consent data if the iubenda consent data is not provided', () => {
      const consentData = getConsentData();

      expect(consentData).toStrictEqual({
        allowedConsentIds: [],
        deniedConsentIds: [],
      });
    });
  });

  describe('getIubendaConsentData', () => {
    const pluginsManager = new PluginsManager(defaultPluginEngine, undefined, mockLogger);
    const storeManager = new StoreManager(pluginsManager, undefined, mockLogger);

    it('should get the iubenda consent data from cookies', () => {
      // Mock the iubenda data in the cookies
      const iubendaRawConsentData = {
        timestamp: '2024-10-1T01:57:25.825Z',
        version: '1.67.1',
        purposes: {
          '1': true,
          '2': false,
          '3': true,
          '4': false,
          '5': true,
        },
        id: 252372,
        cons: {
          rand: '92f72a',
        },
      };
      const iubendaConsentString = JSON.stringify(iubendaRawConsentData);

      // Mock the iubenda cookies
      document.cookie = `${IUBENDA_CONSENT_EXAMPLE_COOKIE_NAME}=${window.encodeURIComponent(iubendaConsentString)};`;

      const iubendaConsentData = getIubendaConsentData(storeManager, mockLogger);

      expect(iubendaConsentData).toStrictEqual({
        '1': true,
        '2': false,
        '3': true,
        '4': false,
        '5': true,
      });
    });

    it('should return undefined if iubenda consent cookie could not be read', () => {
      // mock store manager to intentionally throw error
      const mockStoreManager = {
        setStore: () => ({
          engine: null,
        }),
      };

      const iubendaConsentData = getIubendaConsentData(mockStoreManager, mockLogger);

      expect(iubendaConsentData).toBeUndefined();
    });

    it('should return undefined if iubenda consent cookie is not present', () => {
      const iubendaConsentData = getIubendaConsentData(storeManager, mockLogger);

      expect(iubendaConsentData).toBeUndefined();
    });

    it('should return undefined if iubenda consent data inside the cookie is null', () => {
      // Mock the iubenda cookie
      // The value is inside is null
      document.cookie = `${IUBENDA_CONSENT_EXAMPLE_COOKIE_NAME}=null;`;

      const iubendaConsentData = getIubendaConsentData(storeManager, mockLogger);

      expect(iubendaConsentData).toBeUndefined();
    });

    it('should return undefined if iubenda consent data inside the cookie is an empty string', () => {
      // Mock the iubenda cookie
      // The value is inside is empty string
      document.cookie = `${IUBENDA_CONSENT_EXAMPLE_COOKIE_NAME}=%22%22;`;

      const iubendaConsentData = getIubendaConsentData(storeManager, mockLogger);

      expect(iubendaConsentData).toBeUndefined();
    });
  });
});
