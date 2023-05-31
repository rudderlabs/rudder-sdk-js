import { OneTrust } from '@rudderstack/analytics-js-plugins/oneTrust';
import { PluginName } from '@rudderstack/analytics-js-plugins/types/common';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { state, resetState } from '@rudderstack/analytics-js/state';

describe('Plugin - OneTrust', () => {
  beforeEach(() => {
    resetState();
  });
  it('should add OneTrust plugin in the loaded plugin list', () => {
    OneTrust().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes(PluginName.OneTrust)).toBe(true);
  });

  it('should initialize the OneTrust and compute consentInfo if OneTrust native SDK is loaded', () => {
    (window as any).OneTrust = {
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
      consentProviderInitialized: true,
      allowedConsents: { C0001: 'Functional Cookies', C0003: 'Analytical Cookies' },
      deniedConsentIds: ['C0002', 'C0004', 'C0005', 'C0006'],
    };
    const consentInfo = OneTrust().consentProvider.getConsentInfo(defaultLogger);
    expect(consentInfo).toStrictEqual(mockResponseFromOneTrust);
  });
  it('should not initialize the OneTrust plugin and return consentProviderInitialized as false if OneTrust native SDK is not loaded', () => {
    (window as any).OneTrust = undefined;
    (window as any).OnetrustActiveGroups = undefined;
    defaultLogger.error = jest.fn();
    const mockResponseFromOneTrust = {
      consentProviderInitialized: false,
    };
    const consentInfo = OneTrust().consentProvider.getConsentInfo(defaultLogger);
    expect(defaultLogger.error).toHaveBeenCalledWith('OneTrust resources are not accessible.');
    expect(consentInfo).toStrictEqual(mockResponseFromOneTrust);
  });
  it('should return true if destination specific category is consented', () => {
    state.consents.consentProviderInitialized.value = true;
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

    const isDestinationConsented = OneTrust().consentProvider.isDestinationConsented(
      state,
      destConfig,
      defaultLogger,
    );
    expect(isDestinationConsented).toBeTruthy();
  });
  it('should return true if consentProvider is not initialized', () => {
    state.consents.consentProviderInitialized.value = false;

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

    const isDestinationConsented = OneTrust().consentProvider.isDestinationConsented(
      state,
      destConfig,
      defaultLogger,
    );
    expect(isDestinationConsented).toBeTruthy();
  });
  it('should return true if destination config does not have any mapping', () => {
    state.consents.consentProviderInitialized.value = true;
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

    const isDestinationConsented = OneTrust().consentProvider.isDestinationConsented(
      state,
      destConfig,
      defaultLogger,
    );
    expect(isDestinationConsented).toBeTruthy();
  });
  it('should return false if destination categories are not consented', () => {
    state.consents.consentProviderInitialized.value = true;
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
    const isDestinationConsented = OneTrust().consentProvider.isDestinationConsented(
      state,
      destConfig,
      defaultLogger,
    );
    expect(isDestinationConsented).toBeFalsy();
  });
});
