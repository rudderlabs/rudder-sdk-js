import { OneTrustConsentManager } from '@rudderstack/analytics-js-plugins/oneTrustConsentManager';
import { state, resetState } from '@rudderstack/analytics-js/state';

describe('Plugin - OneTrustConsentManager', () => {
  beforeEach(() => {
    resetState();
    delete (window as any).OneTrustConsentManager;
    delete (window as any).OnetrustActiveGroups;
  });

  const mockLogger = {
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
  };

  it('should add OneTrustConsentManager plugin in the loaded plugin list', () => {
    OneTrustConsentManager().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('OneTrustConsentManager')).toBe(true);
  });

  it('should initialize the plugin and compute consentInfo if OneTrust SDK is already loaded', () => {
    // Mock the OneTrust data on the window object
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

    // Initialize the plugin
    OneTrustConsentManager().consentManager.init(state, undefined, mockLogger);

    expect(state.consents.data.value).toStrictEqual({
      initialized: true,
      allowedConsents: { C0001: 'Functional Cookies', C0003: 'Analytical Cookies' },
      deniedConsentIds: ['C0002', 'C0004', 'C0005', 'C0006'],
    });
  });

  it('should not successfully initialize the plugin if OneTrust SDK is not loaded', () => {
    OneTrustConsentManager().consentManager.init(state, undefined, mockLogger);
    expect(state.consents.data.value.initialized).toStrictEqual(false);
    expect(mockLogger.error).toHaveBeenCalledWith(
      `OneTrustConsentManagerPlugin:: Failed to access OneTrust SDK resources. Please ensure that the OneTrust SDK is loaded successfully before RudderStack SDK.`,
    );
  });

  it('should return true if destination specific category is consented', () => {
    state.consents.data.value = {
      initialized: true,
      allowedConsents: { C0001: 'Functional Cookies', C0003: 'Analytical Cookies' },
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
      mockLogger,
    );
    expect(isDestinationConsented).toBe(true);
  });

  it('should return true if plugin is not initialized', () => {
    state.consents.data.value = {
      initialized: false,
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
          oneTrustCookieCategory: '',
        },
      ],
      key: 'value',
    };

    const isDestinationConsented = OneTrustConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      mockLogger,
    );
    expect(isDestinationConsented).toBe(true);
  });

  it('should return true if destination config does not have any mapping', () => {
    state.consents.data.value = {
      initialized: true,
      allowedConsents: { C0001: 'Functional Cookies', C0003: 'Analytical Cookies' },
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
      mockLogger,
    );
    expect(isDestinationConsented).toBe(true);
  });

  it('should return false if destination categories are not consented', () => {
    state.consents.data.value = {
      initialized: true,
      allowedConsents: { C0001: 'Functional Cookies', C0003: 'Analytical Cookies' },
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
      mockLogger,
    );
    expect(isDestinationConsented).toBe(false);
  });

  it('should return true and log error if an exception occurs during destination consent status check', () => {
    state.consents.data.value = {
      initialized: true,
      allowedConsents: { C0001: 'Functional Cookies', C0003: 'Analytical Cookies' },
    };
    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      oneTrustCookieCategories: {}, // Invalid config
      key: 'value',
    };

    const isDestinationConsented = OneTrustConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      mockLogger,
    );
    expect(isDestinationConsented).toBe(true);
    expect(mockLogger.error).toHaveBeenCalledWith(
      'OneTrustConsentManagerPlugin:: Failed to determine the consent status for the destination. Please check the destination configuration and try again.',
      new TypeError('oneTrustCookieCategories.map is not a function'),
    );
  });
});
