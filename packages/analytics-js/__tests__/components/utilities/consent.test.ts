import { resetState, state } from '../../../src/state';
import {
  getUserSelectedConsentManager,
  getValidPostConsentOptions,
  getConsentManagementData,
} from '../../../src/components/utilities/consent';
import { defaultLogger } from '../../../src/services/Logger';
import type {
  ConsentManagementOptions,
  CookieConsentOptions,
} from '@rudderstack/analytics-js-common/types/Consent';
import type { ConsentOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';

describe('consent utilities', () => {
  beforeEach(() => {
    resetState();
  });

  describe('getUserSelectedConsentManager', () => {
    const testCases: {
      input: CookieConsentOptions | undefined;
      expectedOutcome: string | undefined;
    }[] = [
      {
        input: {
          oneTrust: {
            enabled: true,
          },
        },
        expectedOutcome: 'oneTrust',
      },
      {
        input: {
          cookieBot: {
            enabled: true,
          },
        },
        expectedOutcome: 'cookieBot',
      },
      {
        input: {
          // @ts-expect-error intentionally passing an invalid type
          random: {},
        },
        expectedOutcome: undefined,
      },
      {
        input: {},
        expectedOutcome: undefined,
      },
      {
        // @ts-expect-error intentionally passing an invalid type
        input: 124356,
        expectedOutcome: undefined,
      },
      {
        // @ts-expect-error intentionally passing an invalid type
        input: null,
        expectedOutcome: undefined,
      },
      {
        input: undefined,
        expectedOutcome: undefined,
      },
    ];

    it.each(testCases)(
      'should return the name of the consent manager if provided in load option',
      ({ input, expectedOutcome }) => {
        const consentManager = getUserSelectedConsentManager(input);
        expect(consentManager).toBe(expectedOutcome);
      },
    );
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

      const consentOptions: ConsentOptions = {
        integrations: {
          All: false,
          GoogleAnalytics: true,
          Braze: true,
        },
        discardPreConsentEvents: true,
        // @ts-expect-error intentionally passing an invalid type
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

    it('should return default integrations object if integrations is not an object literal', () => {
      state.consents.enabled.value = true;

      const consentOptions: ConsentOptions = {
        // @ts-expect-error intentionally passing an invalid type
        integrations: [], // not an object literal
      };

      const expectedOutcome = {
        discardPreConsentEvents: false,
        sendPageEvent: false,
        trackConsent: false,
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

      const validOptions = getConsentManagementData(undefined, defaultLogger);
      expect(validOptions).toEqual(expectedOutcome);
    });

    it('should return consent management data based on the options provided', () => {
      const consentOptions: ConsentManagementOptions = {
        enabled: true,
        provider: 'oneTrust',
        allowedConsentIds: [' test1', '', '  '],
        deniedConsentIds: ['  test2 '],
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

      const validOptions = getConsentManagementData(consentOptions, defaultLogger);
      expect(validOptions).toEqual(expectedOutcome);
    });

    it('should log an error if the consent provider is not supported', () => {
      const consentOptions: ConsentManagementOptions = {
        enabled: true,
        // @ts-expect-error intentionally passing an invalid type
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

      const validOptions = getConsentManagementData(consentOptions, defaultLogger);
      expect(validOptions).toEqual(expectedOutcome);
    });
  });
});
