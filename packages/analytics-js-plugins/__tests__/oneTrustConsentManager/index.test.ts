import { OneTrustConsentManager } from '@rudderstack/analytics-js-plugins/oneTrustConsentManager';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { state, resetState } from '@rudderstack/analytics-js/state';

describe('Plugin - OneTrustConsentManager', () => {
  beforeEach(() => {
    resetState();
  });
  it('should add OneTrustConsentManager plugin in the loaded plugin list', () => {
    OneTrustConsentManager().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('OneTrustConsentManager')).toBe(true);
  });

  it('should initialize the OneTrustConsentManager and compute consentInfo if OneTrustConsentManager native SDK is loaded', () => {
    (window as any).OneTrustConsentManager = {
      GetDomainData: jest.fn(() => ({
        Groups: [
          { CustomGroupId: 'C0001', GroupName: 'Functional Cookies' },
          { CustomGroupId: 'C0002', GroupName: 'Performance Cookies' },
          { CustomGroupId: 'C0003', GroupName: 'Analytical Cookies' },
          { CustomGroupId: 'C0004', GroupName: 'Targeting Cookies' },
          { CustomGroupId: 'C0005', GroupName: 'Social Media Cookies' },
          { CustomGroupId: 'C0006', GroupName: 'Advertisement Cookies' },
        ],
      })),
    };
    (window as any).OnetrustActiveGroups = ',C0001,C0003,';
    const mockResponseFromOneTrust = {
      consentManagerInitialized: true,
      allowedConsents: { C0001: 'Functional Cookies', C0003: 'Analytical Cookies' },
      deniedConsentIds: ['C0002', 'C0004', 'C0005', 'C0006'],
    };
    const consentInfo = OneTrustConsentManager().consentManager.getConsentInfo(
      undefined,
      defaultLogger,
    );
    expect(consentInfo).toStrictEqual(mockResponseFromOneTrust);
  });
  it('should not initialize the OneTrustConsentManager plugin and return consentManagerInitialized as false if OneTrustConsentManager native SDK is not loaded', () => {
    (window as any).OneTrustConsentManager = undefined;
    (window as any).OnetrustActiveGroups = undefined;
    defaultLogger.error = jest.fn();
    const mockResponseFromOneTrust = {
      consentManagerInitialized: false,
    };
    const consentInfo = OneTrustConsentManager().consentManager.getConsentInfo(
      undefined,
      defaultLogger,
    );
    expect(defaultLogger.error).toHaveBeenCalledWith(
      `OneTrustPlugin:: Failed to access OneTrustConsentManager SDK resources. Please ensure that the OneTrustConsentManager SDK is loaded successfully before RudderStack's JS SDK.`,
    );
    expect(consentInfo).toStrictEqual(mockResponseFromOneTrust);
  });
  it('should return true if destination specific category is consented', () => {
    state.consents.consentManagerInitialized.value = true;
    state.consents.allowedConsents.value = {
      C0001: 'Functional Cookies',
      C0003: 'Analytical Cookies',
    };
    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      oneTrustCookieCategories: [
        {
          oneTrustCookieCategory: 'Functional Cookies',
        },
        {
          oneTrustCookieCategory: 'C0003',
        },
        {
          oneTrustCookieCategory: '',
        },
      ],
      key: 'value',
    };

    const isDestinationConsented = OneTrustConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      defaultLogger,
    );
    expect(isDestinationConsented).toBeTruthy();
  });
  it('should return true if consentManager is not initialized', () => {
    state.consents.consentManagerInitialized.value = false;

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      oneTrustCookieCategories: [
        {
          oneTrustCookieCategory: 'Functional Cookies',
        },
        {
          oneTrustCookieCategory: '',
        },
      ],
      key: 'value',
    };

    const isDestinationConsented = OneTrustConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      defaultLogger,
    );
    expect(isDestinationConsented).toBeTruthy();
  });
  it('should return true if destination config does not have any mapping', () => {
    state.consents.consentManagerInitialized.value = true;
    state.consents.allowedConsents.value = {
      C0001: 'Functional Cookies',
      C0003: 'Analytical Cookies',
    };
    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      key: 'value',
    };

    const isDestinationConsented = OneTrustConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      defaultLogger,
    );
    expect(isDestinationConsented).toBeTruthy();
  });
  it('should return false if destination categories are not consented', () => {
    state.consents.consentManagerInitialized.value = true;
    state.consents.allowedConsents.value = {
      C0001: 'Functional Cookies',
      C0003: 'Analytical Cookies',
    };
    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      oneTrustCookieCategories: [
        {
          oneTrustCookieCategory: 'Functional Cookies',
        },
        {
          oneTrustCookieCategory: 'C0004',
        },
      ],
      key: 'value',
    };
    const isDestinationConsented = OneTrustConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      defaultLogger,
    );
    expect(isDestinationConsented).toBeFalsy();
  });
});
