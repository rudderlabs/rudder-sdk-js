import { state, resetState } from '@rudderstack/analytics-js/state';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { StoreManager } from '@rudderstack/analytics-js/services/StoreManager/StoreManager';
import { IubendaConsentManager } from '../../src/iubendaConsentManager';
import { IUBENDA_CONSENT_EXAMPLE_COOKIE_NAME} from '../../src/iubendaConsentManager/constants';

describe('Plugin - IubendaConsentManager', () => {
  beforeEach(() => {
    resetState();
    (window as any)._iub = {cs: {consent:{}}};
    (window as any).getIubendaUserConsentedPurposes = undefined;
    (window as any).getIubendaUserDeniedPurposes = undefined;
    // delete all cookies
    document.cookie.split(';').forEach(c => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
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

  it('should add IubendaConsentManager plugin in the loaded plugin list', () => {
    IubendaConsentManager().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('IubendaConsentManager')).toBe(true);
  });

  it('should initialize the plugin if iubenda consent data is already available on the window object', () => {
    // Initialize the plugin
    IubendaConsentManager().consentManager.init(state, mockLogger);

    expect((window as any).getIubendaUserConsentedPurposes).toEqual(expect.any(Function));
    expect((window as any).getIubendaUserDeniedPurposes).toEqual(expect.any(Function));
    expect((window as any).updateIubendaConsent).toEqual(expect.any(Function));
  });

  it('should update state with consents data from iubenda window resources', () => {
    // Mock the iubenda data on the window object
    (window as any)._iub.cs.consent = {
      timestamp: "2024-10-1T01:57:25.825Z",
      version: "1.67.1",
      purposes: {
        '1': true,
        '2': false,
        '3': false,
        '4': true,
        '5': true
      },
      id: 252372,
      cons: {
        rand: "92f72a"
      }
    };

    // Initialize the plugin
    IubendaConsentManager().consentManager.init(state, mockLogger);

    // Update the state with the consent data
    IubendaConsentManager().consentManager.updateConsentsInfo(state, undefined, mockLogger);

    expect(state.consents.initialized.value).toBe(true);
    expect(state.consents.data.value).toStrictEqual({
      allowedConsentIds: ['1', '4', '5'],
      deniedConsentIds: ['2', '3'],
    });

    expect((window as any).getIubendaUserConsentedPurposes()).toStrictEqual([
      '1',
      '4',
      '5',
    ]);
    expect((window as any).getIubendaUserDeniedPurposes()).toStrictEqual(['2', '3']);
  });

  it('should return undefined values when the window callbacks are invoked and there is no data in the state', () => {
    // Initialize the plugin
    IubendaConsentManager().consentManager.init(state, mockLogger);

    expect((window as any).getIubendaUserConsentedPurposes()).toStrictEqual(undefined);
    expect((window as any).getIubendaUserDeniedPurposes()).toStrictEqual(undefined);
  });

  it('should define a callback function on window to update consent data', () => {
    // Mock the iubenda data on the window object
    (window as any)._iub.cs.consent = {
      timestamp: "2024-10-1T01:57:25.825Z",
      version: "1.67.1",
      purposes: {
        '1': true,
        '2': false,
        '3': false,
        '4': true,
        '5': true
      },
      id: 252372,
      cons: {
        rand: "92f72a"
      }
    };

    // Initialize the plugin
    IubendaConsentManager().consentManager.init(state, mockLogger);

    // Call the callback function
    (window as any).updateIubendaConsent({
      '1': true,
      '2': true,
      '3': false,
      '4': true,
      '5': false
    });

    expect(state.consents.data.value).toStrictEqual({
      allowedConsentIds: ['1', '2', '4'],
      deniedConsentIds: ['3', '5'],
    });

    expect((window as any).getIubendaUserConsentedPurposes()).toStrictEqual(['1', '2', '4']);
    expect((window as any).getIubendaUserDeniedPurposes()).toStrictEqual(['3', '5']);
  });

  it('should get consent data from iubenda cookies if iubenda consent data is not available on the window object', () => {
    const iubendaRawConsentData = {
      timestamp: "2024-10-1T01:57:25.825Z",
      version: "1.67.1",
      purposes: {
        '1': true,
        '2': false,
        '3': false,
        '4': true,
        '5': true
      },
      id: 252372,
      cons: {
        rand: "92f72a"
      }
    };
    const iubendaConsentString = JSON.stringify(iubendaRawConsentData);

    // Mock the iubenda cookies
    document.cookie = `${IUBENDA_CONSENT_EXAMPLE_COOKIE_NAME}=${window.encodeURIComponent(iubendaConsentString)};`;

    const pluginsManager = new PluginsManager(defaultPluginEngine, undefined, mockLogger);
    const storeManager = new StoreManager(pluginsManager, undefined, mockLogger);

    // Initialize the plugin
    IubendaConsentManager().consentManager.init(state, mockLogger);

    // Update the state with the consent data
    IubendaConsentManager().consentManager.updateConsentsInfo(state, storeManager, mockLogger);
    
    expect(state.consents.initialized.value).toBe(true);
    expect(state.consents.data.value).toStrictEqual({
      allowedConsentIds: ['1', '4', '5'],
      deniedConsentIds: ['2', '3'],
    });

    expect((window as any).getIubendaUserConsentedPurposes()).toStrictEqual([
      '1',
      '4',
      '5',
    ]);
    expect((window as any).getIubendaUserDeniedPurposes()).toStrictEqual(['2', '3']);
  });

  it('should return true if the consent manager is not initialized', () => {
    expect(
      IubendaConsentManager().consentManager.isDestinationConsented(
        state,
        undefined,
        mockErrorHandler,
        mockLogger,
      ),
    ).toBe(true);
  });

  it('should return true if the destination config does not contain iubenda consent purposes data', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['1', '4', '5'],
      deniedConsentIds: ['2', '3'],
    };

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
    };

    expect(
      IubendaConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        mockErrorHandler,
        mockLogger,
      ),
    ).toBe(true);
  });

  it('should return true if the iubenda consent purposes data is empty in the destination config', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['1', '4', '5'],
      deniedConsentIds: ['2', '3'],
    };

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      iubendaConsentPurposes: [],
    };

    expect(
      IubendaConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        mockErrorHandler,
        mockLogger,
      ),
    ).toBe(true);
  });

  it('should return true if at least one of the iubenda consent purposes in the destination config is allowed', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['1', '4', '5'],
      deniedConsentIds: ['2', '3'],
    };

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      iubendaConsentPurposes: [
        {
          purpose: '1',
        },
        {
          purpose: '2',
        },
      ],
    };

    expect(
      IubendaConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        mockErrorHandler,
        mockLogger,
      ),
    ).toBe(true);
  });

  it('should return false if none of the iubenda consent purposes in the destination config is allowed', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['1', '3', '5'],
      deniedConsentIds: ['2', '4'],
    };

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      iubendaConsentPurposes: [
        {
          purpose: '2',
        },
        {
          purpose: '4',
        },
      ],
    };

    expect(
      IubendaConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        mockErrorHandler,
        mockLogger,
      ),
    ).toBe(false);
  });

  it('should return true and log an error if any exception is thrown while checking if the destination is consented', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: null, // This will throw an exception
      deniedConsentIds: ['2', '4'],
    };

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      iubendaConsentPurposes: [
        {
          purpose: '2',
        },
        {
          purpose: '4',
        },
      ],
    };

    expect(
      IubendaConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        mockErrorHandler,
        mockLogger,
      ),
    ).toBe(true);
    expect(mockErrorHandler.onError).toHaveBeenCalledWith(
      new TypeError("Cannot read properties of null (reading 'includes')"),
      'IubendaConsentManagerPlugin',
      'Failed to determine the consent status for the destination. Please check the destination configuration and try again.',
    );
  });

  it('should return false if the destination categories are not consented in generic consent management config', () => {
    state.consents.initialized.value = true;
    state.consents.resolutionStrategy.value = 'or';
    state.consents.provider.value = 'iubenda';
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
          provider: 'iubenda',
          consents: [
            {
              consent: 'C0004',
            },
          ],
        },
      ],
    };
    const isDestinationConsented = IubendaConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      mockErrorHandler,
      mockLogger,
    );
    expect(isDestinationConsented).toBe(false);
  });

  it("should return true if the active consent provider's configuration data is not present in the destination config", () => {
    state.consents.initialized.value = true;
    state.consents.resolutionStrategy.value = 'or';
    state.consents.provider.value = 'iubenda';
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
    const isDestinationConsented = IubendaConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      mockErrorHandler,
      mockLogger,
    );
    expect(isDestinationConsented).toBe(true);
  });

  it('should return true if at least one of the configured consents in generic consent management are consented', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'iubenda';
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
          provider: 'iubenda',
          consents: [
            {
              consent: 'C0003',
            },
          ],
        },
      ],
    };
    const isDestinationConsented = IubendaConsentManager().consentManager.isDestinationConsented(
      state,
      destConfig,
      mockErrorHandler,
      mockLogger,
    );
    expect(isDestinationConsented).toBe(true);
  });

  it('should return appropriate value when the resolution strategy is set to "and"', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'iubenda';
    state.consents.resolutionStrategy.value = 'and';
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0002', 'C0003'],
    };
    const destConfig = {
      consentManagement: [
        {
          provider: 'iubenda',
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
      IubendaConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        mockErrorHandler,
        mockLogger,
      ),
    ).toBe(true);
  });

  it('should return appropriate value when the resolution strategy not set', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'iubenda';
    state.consents.resolutionStrategy.value = null;
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0002', 'C0003'],
    };
    const destConfig = {
      consentManagement: [
        {
          provider: 'iubenda',
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
      IubendaConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        mockErrorHandler,
        mockLogger,
      ),
    ).toBe(true);
  });
});
