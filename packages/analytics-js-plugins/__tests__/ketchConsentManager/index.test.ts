import { state, resetState } from '@rudderstack/analytics-js/state';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { StoreManager } from '@rudderstack/analytics-js/services/StoreManager/StoreManager';
import { KetchConsentManager } from '../../src/ketchConsentManager';

describe('Plugin - KetchConsentManager', () => {
  beforeEach(() => {
    resetState();
    (window as any).ketchConsent = undefined;
    (window as any).getKetchUserConsentedPurposes = undefined;
    (window as any).getKetchUserDeniedPurposes = undefined;
    // delete all cookies
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  });

  const mockLogger = {
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
  };

  const mockErrorHandler = {
    onError: jest.fn(),
  };

  it('should add KetchConsentManager plugin in the loaded plugin list', () => {
    KetchConsentManager().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('KetchConsentManager')).toBe(true);
  });

  it('should initialize the plugin if ketch consent data is already available on the window object', () => {
    // Mock the ketch data on the window object
    (window as any).ketchConsent = {
      purpose1: true,
      purpose2: false,
      purpose3: true,
      purpose4: false,
      purpose5: true,
    };

    // Initialize the plugin
    KetchConsentManager().consentManager.init(state, undefined, mockLogger);

    expect(state.consents.data.value).toStrictEqual({
      initialized: true,
      allowedConsents: ['purpose1', 'purpose3', 'purpose5'],
      deniedConsents: ['purpose2', 'purpose4'],
    });

    expect((window as any).getKetchUserConsentedPurposes()).toStrictEqual([
      'purpose1',
      'purpose3',
      'purpose5',
    ]);
    expect((window as any).getKetchUserDeniedPurposes()).toStrictEqual(['purpose2', 'purpose4']);
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
    KetchConsentManager().consentManager.init(state, undefined, mockLogger);

    // Call the callback function
    (window as any).updateKetchConsent({
      purpose1: false,
      purpose2: true,
      purpose3: false,
      purpose4: true,
      purpose5: false,
    });

    expect(state.consents.data.value).toStrictEqual({
      initialized: true,
      allowedConsents: ['purpose2', 'purpose4'],
      deniedConsents: ['purpose1', 'purpose3', 'purpose5'],
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

    const pluginsManager = new PluginsManager(defaultPluginEngine, undefined, mockLogger);
    const storeManager = new StoreManager(pluginsManager, undefined, mockLogger);

    // Initialize the plugin
    KetchConsentManager().consentManager.init(state, storeManager, mockLogger);

    expect(state.consents.data.value).toStrictEqual({
      initialized: true,
      allowedConsents: ['purpose1', 'purpose3', 'purpose5'],
      deniedConsents: ['purpose2', 'purpose4'],
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
        mockLogger,
      ),
    ).toBe(true);
  });

  it('should return true if the destination config does not contain ketch consent purposes data', () => {
    state.consents.data.value = {
      initialized: true,
      allowedConsents: ['purpose1', 'purpose3', 'purpose5'],
      deniedConsents: ['purpose2', 'purpose4'],
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
        mockLogger,
      ),
    ).toBe(true);
  });

  it('should return true if the ketch consent purposes data is empty in the destination config', () => {
    state.consents.data.value = {
      initialized: true,
      allowedConsents: ['purpose1', 'purpose3', 'purpose5'],
      deniedConsents: ['purpose2', 'purpose4'],
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
        mockLogger,
      ),
    ).toBe(true);
  });

  it('should return true if at least one of the ketch consent purposes in the destination config is allowed', () => {
    state.consents.data.value = {
      initialized: true,
      allowedConsents: ['purpose1', 'purpose3', 'purpose5'],
      deniedConsents: ['purpose2', 'purpose4'],
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
        mockLogger,
      ),
    ).toBe(true);
  });

  it('should return false if none of the ketch consent purposes in the destination config is allowed', () => {
    state.consents.data.value = {
      initialized: true,
      allowedConsents: ['purpose1', 'purpose3', 'purpose5'],
      deniedConsents: ['purpose2', 'purpose4'],
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
        mockLogger,
      ),
    ).toBe(false);
  });

  it('should return true and log an error if any exception is thrown while checking if the destination is consented', () => {
    state.consents.data.value = {
      initialized: true,
      allowedConsents: null, // This will throw an exception
      deniedConsents: ['purpose2', 'purpose4'],
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
        mockLogger,
      ),
    ).toBe(true);
    expect(mockErrorHandler.onError).toHaveBeenCalledWith(
      new TypeError("Cannot read properties of null (reading 'includes')"),
      'KetchConsentManagerPlugin',
      'Failed to determine the consent status for the destination. Please check the destination configuration and try again.',
    );
  });
});
