import { resetState, state } from '@rudderstack/analytics-js/state';
import {
  getUserSelectedConsentManager,
  getValidPostConsentOptions,
  getConsentManagementData,
} from '../../../src/components/utilities/consent';

describe('consent utilties', () => {
  beforeEach(() => {
    resetState();
  });

  describe('getUserSelectedConsentManager', () => {
    it('should return the name of the consent manager if provided in load option', () => {
      const input1 = {
        oneTrust: {
          enabled: true,
        },
      };
      const input2 = {
        cookieBot: {
          enabled: true,
        },
      };
      const input3 = {
        oneTrust: {
          enabled: false,
        },
      };
      const input4 = {
        random: {},
      };
      const input5 = {};
      const input6 = 124356;
      const input7 = null;
      const input8 = undefined;
      const expectedOutcome1 = 'oneTrust';
      const expectedOutcome2 = 'cookieBot';
      const expectedOutcome3 = undefined;
      const expectedOutcome4 = undefined;
      const expectedOutcome5 = undefined;
      const expectedOutcome6 = undefined;
      const expectedOutcome7 = undefined;
      const expectedOutcome8 = undefined;
      const consentManager1 = getUserSelectedConsentManager(input1);
      const consentManager2 = getUserSelectedConsentManager(input2);
      const consentManager3 = getUserSelectedConsentManager(input3);
      const consentManager4 = getUserSelectedConsentManager(input4);
      const consentManager5 = getUserSelectedConsentManager(input5);
      const consentManager6 = getUserSelectedConsentManager(input6);
      const consentManager7 = getUserSelectedConsentManager(input7);
      const consentManager8 = getUserSelectedConsentManager(input8);
      expect(consentManager1).toBe(expectedOutcome1);
      expect(consentManager2).toBe(expectedOutcome2);
      expect(consentManager3).toBe(expectedOutcome3);
      expect(consentManager4).toBe(expectedOutcome4);
      expect(consentManager5).toBe(expectedOutcome5);
      expect(consentManager6).toBe(expectedOutcome6);
      expect(consentManager7).toBe(expectedOutcome7);
      expect(consentManager8).toBe(expectedOutcome8);
    });
  });

  describe('getValidPostConsentOptions', () => {
    // write tests for this utility function
    it('should return object with default values if no options are passed', () => {
      const expectedOutcome = {
        sendPageEvent: false,
        trackConsent: false,
        discardPreConsentEvents: false,
      };
      const validOptions = getValidPostConsentOptions();
      expect(validOptions).toEqual(expectedOutcome);
    });

    it('should return normalized options object if options are passed', () => {
      state.consents.enabled.value = true;

      const consentOptions = {
        integrations: {
          All: false,
          GoogleAnalytics: true,
          Braze: true,
        },
        discardPreConsentEvents: true,
        sendPageEvent: 'false',
        consentManagement: {
          allowedConsentIds: ['test1'],
          deniedConsentIds: ['test2'],
        },
      };

      const expectedOutcome = {
        integrations: {
          All: false,
          GoogleAnalytics: true,
          Braze: true,
        },
        discardPreConsentEvents: true,
        sendPageEvent: false,
        trackConsent: false,
        consentManagement: {
          allowedConsentIds: ['test1'],
          deniedConsentIds: ['test2'],
          enabled: true,
        },
      };

      const validOptions = getValidPostConsentOptions(consentOptions);
      expect(validOptions).toEqual(expectedOutcome);
    });
  });

  describe('getConsentManagementData', () => {
    it('should return an object with default values if no options are passed', () => {
      const expectedOutcome = {
        consentManagerPluginName: undefined,
        initialized: false,
        enabled: false,
        consentsData: {
          allowedConsentIds: [],
          deniedConsentIds: [],
        },
      };
      const validOptions = getConsentManagementData();
      expect(validOptions).toEqual(expectedOutcome);
    });

    it('should return consent management data based on the options provided', () => {
      const consentOptions = {
        enabled: true,
        provider: 'oneTrust',
        allowedConsentIds: ['test1'],
        deniedConsentIds: ['test2'],
      };

      const expectedOutcome = {
        consentManagerPluginName: 'OneTrustConsentManager',
        initialized: true,
        enabled: true,
        consentsData: {
          allowedConsentIds: ['test1'],
          deniedConsentIds: ['test2'],
        },
        provider: 'oneTrust',
      };

      const validOptions = getConsentManagementData(consentOptions);
      expect(validOptions).toEqual(expectedOutcome);
    });

    it('should log an error if the consent provider is not supported', () => {
      const consentOptions = {
        enabled: true,
        provider: 'random',
      };

      const expectedOutcome = {
        consentManagerPluginName: undefined,
        initialized: false,
        enabled: false,
        consentsData: {
          allowedConsentIds: [],
          deniedConsentIds: [],
        },
      };

      const validOptions = getConsentManagementData(consentOptions);
      expect(validOptions).toEqual(expectedOutcome);
    });
  });
});
