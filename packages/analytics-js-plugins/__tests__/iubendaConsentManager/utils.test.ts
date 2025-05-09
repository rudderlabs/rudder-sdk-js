import { defaultStoreManager } from '@rudderstack/analytics-js-common/__mocks__/StoreManager';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { resetState, state } from '../../__mocks__/state';
import {
  updateConsentStateFromData,
  getConsentData,
  getIubendaConsentData,
} from '../../src/iubendaConsentManager/utils';
import { IUBENDA_CONSENT_EXAMPLE_COOKIE_NAME } from '../../src/iubendaConsentManager/constants';

describe('IubendaConsentManager - Utils', () => {
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

      const iubendaConsentData = getIubendaConsentData(defaultStoreManager, defaultLogger);

      expect(iubendaConsentData).toStrictEqual({
        '1': true,
        '2': false,
        '3': true,
        '4': false,
        '5': true,
      });
    });

    it('should return undefined if iubenda consent cookie could not be read', () => {
      // Mock the iubenda cookie
      document.cookie = `${IUBENDA_CONSENT_EXAMPLE_COOKIE_NAME}={};`;

      // mock store manager to intentionally throw error
      const mockStoreManager = {
        setStore: () => ({
          engine: null,
        }),
      } as unknown as IStoreManager;

      const iubendaConsentData = getIubendaConsentData(mockStoreManager, defaultLogger);

      expect(iubendaConsentData).toBeUndefined();
    });

    it('should return undefined if iubenda consent cookie is not present', () => {
      const iubendaConsentData = getIubendaConsentData(defaultStoreManager, defaultLogger);

      expect(iubendaConsentData).toBeUndefined();
    });

    it('should return undefined if iubenda consent data inside the cookie is null', () => {
      // Mock the iubenda cookie
      // The value is inside is null
      document.cookie = `${IUBENDA_CONSENT_EXAMPLE_COOKIE_NAME}=null;`;

      const iubendaConsentData = getIubendaConsentData(defaultStoreManager, defaultLogger);

      expect(iubendaConsentData).toBeUndefined();
    });

    it('should return undefined if iubenda consent data inside the cookie is not parseable', () => {
      // Mock the iubenda cookie
      document.cookie = `${IUBENDA_CONSENT_EXAMPLE_COOKIE_NAME}={""};`;

      const iubendaConsentData = getIubendaConsentData(defaultStoreManager, defaultLogger);

      expect(iubendaConsentData).toBeUndefined();
    });
  });
});
