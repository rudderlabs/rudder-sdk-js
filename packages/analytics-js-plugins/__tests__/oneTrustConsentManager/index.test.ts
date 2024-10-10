import { state, resetState } from '@rudderstack/analytics-js/state';
import { OneTrustConsentManager } from '../../src/oneTrustConsentManager';
import { defaultLogger } from '../../__mocks__/Logger';

describe('Plugin - OneTrustConsentManager', () => {
  beforeEach(() => {
    resetState();
    delete (window as any).OneTrust;
    delete (window as any).OnetrustActiveGroups;
  });

  const mockErrorHandler = {
    onError: jest.fn(),
  };

  it('should add OneTrustConsentManager plugin in the loaded plugin list', () => {
    OneTrustConsentManager().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('OneTrustConsentManager')).toBe(true);
  });

  it('should update the consent info if OneTrust SDK is already loaded', () => {
    // Mock the OneTrust data on the window object
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

    // Initialize the plugin
    OneTrustConsentManager().consentManager.init(state, defaultLogger);

    // Update the consent info from state
    OneTrustConsentManager().consentManager.updateConsentsInfo(state, undefined, defaultLogger);

    expect(state.consents.initialized.value).toBe(true);
    expect(state.consents.data.value).toStrictEqual({
      allowedConsentIds: ['C0001', 'C0003'],
      deniedConsentIds: ['C0002', 'C0004', 'C0005', 'C0006'],
    });
  });

  it('should not successfully update consents data the plugin if OneTrust SDK is not loaded', () => {
    // Initialize the plugin
    OneTrustConsentManager().consentManager.init(state, defaultLogger);

    // Update the consent info from state
    OneTrustConsentManager().consentManager.updateConsentsInfo(state, undefined, defaultLogger);

    expect(state.consents.initialized.value).toStrictEqual(false);
    expect(defaultLogger.error).toHaveBeenCalledWith(
      `OneTrustConsentManagerPlugin:: Failed to access OneTrust SDK resources. Please ensure that the OneTrust SDK is loaded successfully before RudderStack SDK.`,
    );
  });

  it('should return true if destination specific category is consented', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0003'],
    };

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      oneTrustCookieCategories: [
        {
          oneTrustCookieCategory: 'C0001',
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
      mockErrorHandler,
      defaultLogger,
    );
    expect(isDestinationConsented).toBe(true);
  });

  it('should return true if plugin is not initialized', () => {
    state.consents.initialized.value = false;

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      oneTrustCookieCategories: [
        {
          oneTrustCookieCategory: 'C0001',
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
      mockErrorHandler,
      defaultLogger,
    );
    expect(isDestinationConsented).toBe(true);
  });

  it('should return true if destination config does not have any mapping', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0003'],
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
      mockErrorHandler,
      defaultLogger,
    );
    expect(isDestinationConsented).toBe(true);
  });

  it('should return false if destination categories are not consented', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0003'],
    };
    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      oneTrustCookieCategories: [
        {
          oneTrustCookieCategory: 'C0001',
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
      mockErrorHandler,
      defaultLogger,
    );
    expect(isDestinationConsented).toBe(false);
  });

  it('should return true and log error if an exception occurs during destination consent status check', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0003'],
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
      mockErrorHandler,
      defaultLogger,
    );
    expect(isDestinationConsented).toBe(true);
    expect(mockErrorHandler.onError).toHaveBeenCalledWith(
      new TypeError('oneTrustCookieCategories.map is not a function'),
      'OneTrustConsentManagerPlugin',
      'Failed to determine the consent status for the destination. Please check the destination configuration and try again.',
    );
  });

  it('should return false if the destination categories are not consented in generic consent management config', () => {
    state.consents.initialized.value = true;
    state.consents.resolutionStrategy.value = 'and';
    state.consents.provider.value = 'oneTrust';
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0003'],
    };
    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      consentManagement: [
        {
          provider: 'oneTrust',
          consents: [
            {
              consent: 'C0001',
            },
            {
              consent: 'C0004',
            },
          ],
        },
        {
          provider: 'ketch',
          consents: [
            {
              consent: 'C0003',
            },
          ],
        },
      ],
    };
    const isDestinationConsented = OneTrustConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      mockErrorHandler,
      defaultLogger,
    );
    expect(isDestinationConsented).toBe(false);
  });

  it("should return true if the active consent provider's configuration data is not present in the destination config", () => {
    state.consents.initialized.value = true;
    state.consents.resolutionStrategy.value = 'and';
    state.consents.provider.value = 'oneTrust';
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0003'],
    };
    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      consentManagement: [
        {
          provider: 'ketch',
          consents: [
            {
              consent: 'C0003',
            },
          ],
        },
      ],
    };
    const isDestinationConsented = OneTrustConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      mockErrorHandler,
      defaultLogger,
    );
    expect(isDestinationConsented).toBe(true);
  });

  it('should return true if all the configured consents in generic consent management are consented', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'oneTrust';
    state.consents.resolutionStrategy.value = 'and';
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0003'],
    };
    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      consentManagement: [
        {
          provider: 'oneTrust',
          consents: [
            {
              consent: 'C0001',
            },
            {
              consent: 'C0003',
            },
          ],
        },
        {
          provider: 'ketch',
          consents: [
            {
              consent: 'C0003',
            },
          ],
        },
      ],
    };
    const isDestinationConsented = OneTrustConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      mockErrorHandler,
      defaultLogger,
    );
    expect(isDestinationConsented).toBe(true);
  });

  it('should return appropriate consent status if the resolution strategy is "or"', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'oneTrust';
    state.consents.resolutionStrategy.value = 'or';
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0003'],
    };
    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      consentManagement: [
        {
          provider: 'oneTrust',
          consents: [
            {
              consent: 'C0001',
            },
            {
              consent: 'C0004',
            },
          ],
        },
        {
          provider: 'ketch',
          consents: [
            {
              consent: 'C0003',
            },
          ],
        },
      ],
    };
    const isDestinationConsented = OneTrustConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      mockErrorHandler,
      defaultLogger,
    );
    expect(isDestinationConsented).toBe(true);
  });

  it('should return true when the consent values are empty in the generic consent management config and resolution strategy is "or"', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'oneTrust';
    state.consents.resolutionStrategy.value = 'or';
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0003'],
    };
    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      consentManagement: [
        {
          provider: 'oneTrust',
          consents: [],
        },
        {
          provider: 'ketch',
          consents: [
            {
              consent: 'C0003',
            },
          ],
        },
      ],
    };
    const isDestinationConsented = OneTrustConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      mockErrorHandler,
      defaultLogger,
    );
    expect(isDestinationConsented).toBe(true);
  });
});
