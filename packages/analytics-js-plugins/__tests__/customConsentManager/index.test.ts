import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { resetState, state } from '../../__mocks__/state';
import { CustomConsentManager } from '../../src/customConsentManager';

describe('Plugin - CustomConsentManager', () => {
  beforeEach(() => {
    resetState();
  });

  it('should add CustomConsentManager plugin in the loaded plugin list', () => {
    CustomConsentManager().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('CustomConsentManager')).toBe(true);
  });

  it('ensure default extension points are defined', () => {
    expect(CustomConsentManager().consentManager.init()).toBeUndefined();
    expect(CustomConsentManager().consentManager.updateConsentsInfo()).toBeUndefined();
  });

  it('should return true if the consent manager is not initialized', () => {
    expect(
      CustomConsentManager().consentManager.isDestinationConsented(
        state,
        undefined,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should return true if the destination config does not have consent management config', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'custom';
    const destConfig = {};
    expect(
      CustomConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should return true if the destination config does not have data for the active provider', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'custom';
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0002', 'C0003'],
    };

    const destConfig = {
      consentManagement: [
        {
          provider: 'oneTrust',
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
      CustomConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should return true if the destination config does not have consents field', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'custom';

    const destConfig = {
      consentManagement: [{ provider: 'custom', resolutionStrategy: 'or' }],
    };

    expect(
      CustomConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should return true if the destination config has empty consents array for resolution strategy "or"', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'custom';

    const destConfig = {
      consentManagement: [{ provider: 'custom', consents: [], resolutionStrategy: 'or' }],
    };

    expect(
      CustomConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should use the global resolution strategy if it is missing in the destination config', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'custom';
    state.consents.resolutionStrategy.value = 'and';
    state.consents.data.value = {
      allowedConsentIds: ['C0001', 'C0002', 'C0003'],
    };

    const destConfig = {
      consentManagement: [
        {
          provider: 'custom',
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
      CustomConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should resolve the consents as per the configured resolution strategy "or"', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'custom';
    state.consents.data.value = {
      allowedConsentIds: ['C0002', 'C0003'],
    };

    const destConfig = {
      consentManagement: [
        {
          provider: 'custom',
          consents: [
            {
              consent: 'C0001',
            },
            {
              consent: 'C0002',
            },
          ],
          resolutionStrategy: 'or',
        },
      ],
    };

    expect(
      CustomConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);
  });

  it('should resolve the consents as per the configured resolution strategy "and"', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'custom';
    state.consents.data.value = {
      allowedConsentIds: ['C0002', 'C0003'],
    };

    const destConfig = {
      consentManagement: [
        {
          provider: 'custom',
          consents: [
            {
              consent: 'C0001',
            },
            {
              consent: 'C0002',
            },
          ],
          resolutionStrategy: 'and',
        },
      ],
    };

    expect(
      CustomConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(false);
  });

  it('should return true and log an error if any exception is thrown while resolving the consents', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'custom';
    state.consents.data.value = {
      allowedConsentIds: null, // This will throw an exception
    };

    const destConfig = {
      consentManagement: [
        {
          provider: 'custom',
          consents: [
            {
              consent: 'C0001',
            },
            {
              consent: 'C0002',
            },
          ],
          resolutionStrategy: 'and',
        },
      ],
    };

    expect(
      CustomConsentManager().consentManager.isDestinationConsented(
        state,
        destConfig,
        defaultErrorHandler,
        defaultLogger,
      ),
    ).toBe(true);

    expect(defaultErrorHandler.onError).toBeCalledWith(
      new TypeError("Cannot read properties of null (reading 'includes')"),
      'CustomConsentManagerPlugin',
      'Failed to determine the consent status for the destination. Please check the destination configuration and try again.',
    );
  });
});
