import { defaultStoreManager } from '@rudderstack/analytics-js-common/__mocks__/StoreManager';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import type { ExtensionPoint } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { resetState, state } from '../../__mocks__/state';
import { IubendaConsentManager } from '../../src/iubendaConsentManager';
import { IUBENDA_CONSENT_EXAMPLE_COOKIE_NAME } from '../../src/iubendaConsentManager/constants';

describe('Plugin - IubendaConsentManager', () => {
  beforeEach(() => {
    resetState();
    // eslint-disable-next-line no-underscore-dangle
    (window as any)._iub = { cs: { consent: {} } };
    (window as any).getIubendaUserConsentedPurposes = undefined;
    (window as any).getIubendaUserDeniedPurposes = undefined;
    // delete all cookies
    document.cookie.split(';').forEach(c => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
  });

  it('should add IubendaConsentManager plugin in the loaded plugin list', () => {
    IubendaConsentManager()?.initialize?.(state);
    expect(state.plugins.loadedPlugins.value.includes('IubendaConsentManager')).toBe(true);
  });

  it('should initialize the plugin if iubenda consent data is already available on the window object', () => {
    // Initialize the plugin
    (IubendaConsentManager()?.consentManager as ExtensionPoint).init?.(state, defaultLogger);

    expect((window as any).getIubendaUserConsentedPurposes).toEqual(expect.any(Function));
    expect((window as any).getIubendaUserDeniedPurposes).toEqual(expect.any(Function));
    expect((window as any).updateIubendaConsent).toEqual(expect.any(Function));
  });

  it('should update state with consents data from iubenda window resources', () => {
    // Mock the iubenda data on the window object
    // eslint-disable-next-line no-underscore-dangle
    (window as any)._iub.cs.consent = {
      timestamp: '2024-10-1T01:57:25.825Z',
      version: '1.67.1',
      purposes: {
        '1': true,
        '2': false,
        '3': false,
        '4': true,
        '5': true,
      },
      id: 252372,
      cons: {
        rand: '92f72a',
      },
    };

    // Initialize the plugin
    (IubendaConsentManager()?.consentManager as ExtensionPoint).init?.(state, defaultLogger);

    // Update the state with the consent data
    (IubendaConsentManager()?.consentManager as ExtensionPoint).updateConsentsInfo?.(
      state,
      undefined,
      defaultLogger,
    );

    expect(state.consents.initialized.value).toBe(true);
    expect(state.consents.data.value).toStrictEqual({
      allowedConsentIds: ['1', '4', '5'],
      deniedConsentIds: ['2', '3'],
    });

    expect((window as any).getIubendaUserConsentedPurposes()).toStrictEqual(['1', '4', '5']);
    expect((window as any).getIubendaUserDeniedPurposes()).toStrictEqual(['2', '3']);
  });

  it('should return undefined values when the window callbacks are invoked and there is no data in the state', () => {
    // Initialize the plugin
    (IubendaConsentManager()?.consentManager as ExtensionPoint).init?.(state, defaultLogger);

    expect((window as any).getIubendaUserConsentedPurposes()).toStrictEqual(undefined);
    expect((window as any).getIubendaUserDeniedPurposes()).toStrictEqual(undefined);
  });

  it('should define a callback function on window to update consent data', () => {
    // Mock the iubenda data on the window object
    // eslint-disable-next-line no-underscore-dangle
    (window as any)._iub.cs.consent = {
      timestamp: '2024-10-1T01:57:25.825Z',
      version: '1.67.1',
      purposes: {
        '1': true,
        '2': false,
        '3': false,
        '4': true,
        '5': true,
      },
      id: 252372,
      cons: {
        rand: '92f72a',
      },
    };

    // Initialize the plugin
    (IubendaConsentManager()?.consentManager as ExtensionPoint).init?.(state, defaultLogger);

    // Call the callback function
    (window as any).updateIubendaConsent({
      '1': true,
      '2': true,
      '3': false,
      '4': true,
      '5': false,
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
      timestamp: '2024-10-1T01:57:25.825Z',
      version: '1.67.1',
      purposes: {
        '1': true,
        '2': false,
        '3': false,
        '4': true,
        '5': true,
      },
      id: 252372,
      cons: {
        rand: '92f72a',
      },
    };
    const iubendaConsentString = JSON.stringify(iubendaRawConsentData);

    // Mock the iubenda cookies
    document.cookie = `${IUBENDA_CONSENT_EXAMPLE_COOKIE_NAME}=${encodeURIComponent(iubendaConsentString)};`;

    // Initialize the plugin
    (IubendaConsentManager()?.consentManager as ExtensionPoint).init?.(state, defaultLogger);

    // Update the state with the consent data
    (IubendaConsentManager()?.consentManager as ExtensionPoint).updateConsentsInfo?.(
      state,
      defaultStoreManager,
      defaultLogger,
    );

    expect(state.consents.initialized.value).toBe(true);
    expect(state.consents.data.value).toStrictEqual({
      allowedConsentIds: ['1', '4', '5'],
      deniedConsentIds: ['2', '3'],
    });

    expect((window as any).getIubendaUserConsentedPurposes()).toStrictEqual(['1', '4', '5']);
    expect((window as any).getIubendaUserDeniedPurposes()).toStrictEqual(['2', '3']);
  });

  it('should return true if the consent manager is not initialized', () => {
    expect(
      (IubendaConsentManager()?.consentManager as ExtensionPoint).isDestinationConsented?.(
        state,
        undefined,
        defaultErrorHandler,
        defaultLogger,
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
      (IubendaConsentManager()?.consentManager as ExtensionPoint).isDestinationConsented?.(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should return true if the iubenda consent purposes data is empty in the destination config', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['1', '4', '5'],
      deniedConsentIds: ['2', '3'],
    };
    state.consents.provider.value = 'iubenda';

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      consentManagement: [
        {
          provider: 'iubenda',
        },
      ],
    };

    expect(
      (IubendaConsentManager()?.consentManager as ExtensionPoint).isDestinationConsented?.(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should return true if at least one of the iubenda consent purposes in the destination config is allowed', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['1', '4', '5'],
      deniedConsentIds: ['2', '3'],
    };
    state.consents.provider.value = 'iubenda';

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      consentManagement: [
        {
          provider: 'iubenda',
          consents: [{ consent: '1' }, { consent: '2' }],
          resolutionStrategy: 'or',
        },
      ],
    };

    expect(
      (IubendaConsentManager()?.consentManager as ExtensionPoint).isDestinationConsented?.(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should return false if none of the iubenda consent purposes in the destination config is allowed', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      allowedConsentIds: ['1', '3', '5'],
      deniedConsentIds: ['2', '4'],
    };
    state.consents.provider.value = 'iubenda';

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      consentManagement: [
        {
          provider: 'iubenda',
          consents: [{ consent: '2' }, { consent: '4' }],
          resolutionStrategy: 'and',
        },
      ],
    };

    expect(
      (IubendaConsentManager()?.consentManager as ExtensionPoint).isDestinationConsented?.(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(false);
  });

  it('should return true and log an error if any exception is thrown while checking if the destination is consented', () => {
    state.consents.initialized.value = true;
    state.consents.data.value = {
      // @ts-expect-error Intentionally setting null to test the error handling
      allowedConsentIds: null, // This will throw an exception
      deniedConsentIds: ['2', '4'],
    };
    state.consents.provider.value = 'iubenda';

    const destConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      consentManagement: [
        {
          provider: 'iubenda',
          consents: [{ consent: '2' }, { consent: '4' }],
          resolutionStrategy: 'and',
        },
      ],
    };
    expect(
      (IubendaConsentManager()?.consentManager as ExtensionPoint).isDestinationConsented?.(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
    expect(defaultErrorHandler.onError).toHaveBeenCalledWith({
      error: new TypeError("Cannot read properties of null (reading 'includes')"),
      context: 'IubendaConsentManagerPlugin',
      customMessage:
        'Failed to determine the consent status for the destination. Please check the destination configuration and try again.',
    });
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
    const isDestinationConsented = (
      IubendaConsentManager()?.consentManager as ExtensionPoint
    ).isDestinationConsented?.(state, destConfig, defaultErrorHandler, defaultLogger);
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
    const isDestinationConsented = (
      IubendaConsentManager()?.consentManager as ExtensionPoint
    ).isDestinationConsented?.(state, destConfig, defaultErrorHandler, defaultLogger);
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
    const isDestinationConsented = (
      IubendaConsentManager()?.consentManager as ExtensionPoint
    ).isDestinationConsented?.(state, destConfig, defaultErrorHandler, defaultLogger);
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
      (IubendaConsentManager()?.consentManager as ExtensionPoint).isDestinationConsented?.(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should return appropriate value when the resolution strategy not set', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'iubenda';
    state.consents.resolutionStrategy.value = undefined;
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
      (IubendaConsentManager()?.consentManager as ExtensionPoint).isDestinationConsented?.(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });
});
