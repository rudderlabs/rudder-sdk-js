import { state, resetState } from '@rudderstack/analytics-js/state';
import { CustomConsentManager } from '../../src/customConsentManager';

describe('Plugin - CustomConsentManager', () => {
  beforeEach(() => {
    resetState();
  });

  const mockLogger = {
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
  };

  const mockErrorHandler = {
    onError: jest.fn(),
  };

  it('should add CustomConsentManager plugin in the loaded plugin list', () => {
    CustomConsentManager().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('CustomConsentManager')).toBe(true);
  });

  it('should return true if the consent manager is not initialized', () => {
    expect(
      CustomConsentManager().consentManager.isDestinationConsented(
        state,
        undefined,
        mockErrorHandler,
        mockLogger,
      ),
    ).toBe(true);
  });

  it('should return true if the destination config does not have consent management config', () => {
    state.consents.initialized.value = true;
    state.consents.provider.value = 'custom';
    expect(
      CustomConsentManager().consentManager.isDestinationConsented(
        state,
        undefined,
        mockErrorHandler,
        mockLogger,
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
        mockErrorHandler,
        mockLogger,
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
        mockErrorHandler,
        mockLogger,
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
        mockErrorHandler,
        mockLogger,
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
        mockErrorHandler,
        mockLogger,
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
        mockErrorHandler,
        mockLogger,
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
        mockErrorHandler,
        mockLogger,
      ),
    ).toBe(true);

    expect(mockErrorHandler.onError).toBeCalledWith(
      new TypeError("Cannot read properties of null (reading 'includes')"),
      'CustomConsentManagerPlugin',
      'Failed to determine the consent status for the destination. Please check the destination configuration and try again.',
    );
  });
});
