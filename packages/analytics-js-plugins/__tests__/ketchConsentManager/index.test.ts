import { state, resetState } from '@rudderstack/analytics-js/state';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { StoreManager } from '@rudderstack/analytics-js/services/StoreManager/StoreManager';
import { KetchConsentManager } from '../../src/ketchConsentManager';
import { defaultLogger } from '../../__mocks__/Logger';

describe('Plugin - KetchConsentManager', () => {
  beforeEach(() => {
    resetState();
    (window as any).ketchConsent = undefined;
    (window as any).getKetchUserConsentedPurposes = undefined;
    (window as any).getKetchUserDeniedPurposes = undefined;
    // delete all cookies
    document.cookie.split(';').forEach(c => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
  });

  const mockErrorHandler = {
    onError: jest.fn(),
  };

  it('should add KetchConsentManager plugin in the loaded plugin list', () => {
    KetchConsentManager().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('KetchConsentManager')).toBe(true);
  });

  it('should initialize the plugin if ketch consent data is already available on the window object', () => {
    // Initialize the plugin
    KetchConsentManager().consentManager.init(state, defaultLogger);

    expect((window as any).getKetchUserConsentedPurposes).toEqual(expect.any(Function));
    expect((window as any).getKetchUserDeniedPurposes).toEqual(expect.any(Function));
    expect((window as any).updateKetchConsent).toEqual(expect.any(Function));
  });

  it('should update state with consents data from ketch window resources', () => {
    // Mock the ketch data on the window object
    (window as any).ketchConsent = {
      purpose1: true,
      purpose2: false,
      purpose3: true,
      purpose4: false,
      purpose5: true,
    };

    // Initialize the plugin
    KetchConsentManager().consentManager.init(state, defaultLogger);

    // Update the state with the consent data
    KetchConsentManager().consentManager.updateConsentsInfo(state, undefined, defaultLogger);

    expect(state.consents.initialized.value).toBe(true);
    expect(state.consents.data.value).toStrictEqual({
      allowedConsentIds: ['purpose1', 'purpose3', 'purpose5'],
      deniedConsentIds: ['purpose2', 'purpose4'],
    });

    expect((window as any).getKetchUserConsentedPurposes()).toStrictEqual([
      'purpose1',
      'purpose3',
      'purpose5',
    ]);
    expect((window as any).getKetchUserDeniedPurposes()).toStrictEqual(['purpose2', 'purpose4']);
  });

  it('should return undefined values when the window callbacks are invoked and there is no data in the state', () => {
    // Initialize the plugin
    KetchConsentManager().consentManager.init(state, defaultLogger);

    expect((window as any).getKetchUserConsentedPurposes()).toStrictEqual(undefined);
    expect((window as any).getKetchUserDeniedPurposes()).toStrictEqual(undefined);
  });

  it('should define a callback function on window to update consent data', () => {
    // Mock the ketch data on the window object
    (window as any).ketchConsent = {
      purpose1: true,
      purpose2: false,
      purpose3: true,
      purpose4: false,
      purpose5: true,
    };

    // Initialize the plugin
    KetchConsentManager().consentManager.init(state, defaultLogger);

    // Call the callback function
    (window as any).updateKetchConsent({
      purpose1: false,
      purpose2: true,
      purpose3: false,
      purpose4: true,
      purpose5: false,
    });

    expect(state.consents.data.value).toStrictEqual({
      allowedConsentIds: ['purpose2', 'purpose4'],
      deniedConsentIds: ['purpose1', 'purpose3', 'purpose5'],
    });

    expect((window as any).getKetchUserConsentedPurposes()).toStrictEqual(['purpose2', 'purpose4']);
    expect((window as any).getKetchUserDeniedPurposes()).toStrictEqual([
      'purpose1',
      'purpose3',
      'purpose5',
    ]);
  });

  it('should get consent data from ketch cookies if ketch consent data is not available on the window object', () => {
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

    const pluginsManager = new PluginsManager(defaultPluginEngine, undefined, defaultLogger);
    const storeManager = new StoreManager(pluginsManager, undefined, defaultLogger);

    // Initialize the plugin
    KetchConsentManager().consentManager.init(state, defaultLogger);

    // Update the state with the consent data
    KetchConsentManager().consentManager.updateConsentsInfo(state, storeManager, defaultLogger);

    expect(state.consents.initialized.value).toBe(true);
    expect(state.consents.data.value).toStrictEqual({
      allowedConsentIds: ['purpose1', 'purpose3', 'purpose5'],
      deniedConsentIds: ['purpose2', 'purpose4'],
    });

    expect((window as any).getKetchUserConsentedPurposes()).toStrictEqual([
      'purpose1',
      'purpose3',
      'purpose5',
    ]);
    expect((window as any).getKetchUserDeniedPurposes()).toStrictEqual(['purpose2', 'purpose4']);
  });

  it('should return true if the consent manager is not initialized', () => {
    expect(
      KetchConsentManager().consentManager.isDestinationConsented(
        state,
        undefined,
        mockErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should return true if the destination config does not contain ketch consent purposes data', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['purpose1', 'purpose3', 'purpose5'],
      deniedConsentIds: ['purpose2', 'purpose4'],
    };

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
    };

    expect(
      KetchConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        mockErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should return true if the ketch consent purposes data is empty in the destination config', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['purpose1', 'purpose3', 'purpose5'],
      deniedConsentIds: ['purpose2', 'purpose4'],
    };

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      ketchConsentPurposes: [],
    };

    expect(
      KetchConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        mockErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should return true if at least one of the ketch consent purposes in the destination config is allowed', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['purpose1', 'purpose3', 'purpose5'],
      deniedConsentIds: ['purpose2', 'purpose4'],
    };

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      ketchConsentPurposes: [
        {
          purpose: 'purpose1',
        },
        {
          purpose: 'purpose2',
        },
      ],
    };

    expect(
      KetchConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        mockErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should return false if none of the ketch consent purposes in the destination config is allowed', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['purpose1', 'purpose3', 'purpose5'],
      deniedConsentIds: ['purpose2', 'purpose4'],
    };

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      ketchConsentPurposes: [
        {
          purpose: 'purpose2',
        },
        {
          purpose: 'purpose4',
        },
      ],
    };

    expect(
      KetchConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        mockErrorHandler,
        defaultLogger,
      ),
    ).toBe(false);
  });

  it('should return true and log an error if any exception is thrown while checking if the destination is consented', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: null, // This will throw an exception
      deniedConsentIds: ['purpose2', 'purpose4'],
    };

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      ketchConsentPurposes: [
        {
          purpose: 'purpose2',
        },
        {
          purpose: 'purpose4',
        },
      ],
    };

    expect(
      KetchConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        mockErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
    expect(mockErrorHandler.onError).toHaveBeenCalledWith(
      new TypeError("Cannot read properties of null (reading 'includes')"),
      'KetchConsentManagerPlugin',
      'Failed to determine the consent status for the destination. Please check the destination configuration and try again.',
    );
  });

  it('should return false if the destination categories are not consented in generic consent management config', () => {
    state.consents.initialized.value = true;
    state.consents.resolutionStrategy.value = 'or';
    state.consents.provider.value = 'ketch';
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
              consent: 'Functional Cookies',
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
              consent: 'C0004',
            },
          ],
        },
      ],
    };
    const isDestinationConsented = KetchConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      mockErrorHandler,
      defaultLogger,
    );
    expect(isDestinationConsented).toBe(false);
  });

  it("should return true if the active consent provider's configuration data is not present in the destination config", () => {
    state.consents.initialized.value = true;
    state.consents.resolutionStrategy.value = 'or';
    state.consents.provider.value = 'ketch';
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
              consent: 'Functional Cookies',
            },
          ],
        },
      ],
    };
    const isDestinationConsented = KetchConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      mockErrorHandler,
      defaultLogger,
    );
    expect(isDestinationConsented).toBe(true);
  });

  it('should return true if at least one of the configured consents in generic consent management are consented', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'ketch';
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
              consent: 'Functional Cookies',
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
    const isDestinationConsented = KetchConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      mockErrorHandler,
      defaultLogger,
    );
    expect(isDestinationConsented).toBe(true);
  });

  it('should return appropriate value when the resolution strategy is set to "and"', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'ketch';
    state.consents.resolutionStrategy.value = 'and';
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0002', 'C0003'],
    };
    const destConfig = {
      consentManagement: [
        {
          provider: 'ketch',
          consents: [
            {
              consent: 'C0001',
            },
            {
              consent: 'C0002',
            },
          ],
        },
      ],
    };
    expect(
      KetchConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        mockErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should return appropriate value when the resolution strategy not set', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'ketch';
    state.consents.resolutionStrategy.value = null;
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0002', 'C0003'],
    };
    const destConfig = {
      consentManagement: [
        {
          provider: 'ketch',
          consents: [
            {
              consent: 'C0001',
            },
            {
              consent: 'C0002',
            },
          ],
        },
      ],
    };
    expect(
      KetchConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        mockErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });
});
