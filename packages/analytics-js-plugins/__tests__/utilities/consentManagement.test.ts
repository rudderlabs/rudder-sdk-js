import type { DestinationConfig } from '@rudderstack/analytics-js-common/types/Destination';
import { isDestinationConsented } from '../../src/utilities/consentManagement';
import { resetState, state } from '../../__mocks__/state';

describe('Consent Management Utilities', () => {
  beforeEach(() => {
    resetState();
  });

  describe('isDestinationConsented', () => {
    const defaultDestinationConfig = {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
    } as DestinationConfig;

    it('should return true if consents are not initialized', () => {
      const result = isDestinationConsented(
        state,
        defaultDestinationConfig,
        'OneTrustConsentManagerPlugin',
      );
      expect(result).toBe(true);
    });

    it('should return true if the consent management config is not present', () => {
      state.consents.initialized.value = true;

      const result = isDestinationConsented(
        state,
        defaultDestinationConfig,
        'OneTrustConsentManagerPlugin',
      );
      expect(result).toBe(true);
    });

    it('should return true if the consent data is not present for the configured provider', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'oneTrust';

      const destinationConfig = {
        ...defaultDestinationConfig,
        consentManagement: [
          {
            provider: 'custom', // oneTrust is not defined
            consents: [],
          },
        ],
      } as DestinationConfig;

      const result = isDestinationConsented(
        state,
        destinationConfig,
        'OneTrustConsentManagerPlugin',
      );
      expect(result).toBe(true);
    });

    it('should return true if the consents data is not defined', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'oneTrust';

      const destinationConfig = {
        ...defaultDestinationConfig,
        consentManagement: [
          {
            provider: 'oneTrust',
          },
        ],
      } as DestinationConfig;

      const result = isDestinationConsented(
        state,
        destinationConfig,
        'OneTrustConsentManagerPlugin',
      );
      expect(result).toBe(true);
    });

    it('should return true if an exception occurs while checking the consent status', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'oneTrust';
      const destinationConfig = {
        ...defaultDestinationConfig,
        consentManagement: [
          {
            provider: 'oneTrust',
            consents: [
              {
                consent: 'C0001',
              },
            ],
          },
        ],
      } as DestinationConfig;

      // @ts-expect-error To test the error handling
      // This will throw an error
      state.consents.data.value.allowedConsentIds = null;

      const result = isDestinationConsented(
        state,
        destinationConfig,
        'OneTrustConsentManagerPlugin',
      );
      expect(result).toBe(true);
    });

    it('should return true if the resolution strategy is "any" and no consent IDs are not consented', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'ketch';
      state.consents.data.value.allowedConsentIds = ['C0002'];
      state.consents.resolutionStrategy.value = 'any';

      const destinationConfig = {
        ...defaultDestinationConfig,
        consentManagement: [
          {
            provider: 'ketch',
            consents: [
              {
                consent: 'C0001',
              },
            ],
          },
        ],
      } as DestinationConfig;

      const result = isDestinationConsented(state, destinationConfig, 'KetchConsentManagerPlugin');
      expect(result).toBe(false);
    });

    it('should return true if the resolution strategy is "any" and some of the consent IDs are consented', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'ketch';
      state.consents.data.value.allowedConsentIds = ['C0002'];
      state.consents.resolutionStrategy.value = 'any';

      const destinationConfig = {
        ...defaultDestinationConfig,
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
      } as DestinationConfig;

      const result = isDestinationConsented(state, destinationConfig, 'KetchConsentManagerPlugin');
      expect(result).toBe(true);
    });

    it('should return true if the resolution strategy is "any" and all the consent IDs are consented', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'ketch';
      state.consents.data.value.allowedConsentIds = ['C0001', 'C0002'];
      state.consents.resolutionStrategy.value = 'any';

      const destinationConfig = {
        ...defaultDestinationConfig,
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
      } as DestinationConfig;

      const result = isDestinationConsented(state, destinationConfig, 'KetchConsentManagerPlugin');
      expect(result).toBe(true);
    });

    it('should return true if the resolution strategy is "any" but the configured consents are empty', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'ketch';
      state.consents.data.value.allowedConsentIds = ['C0001', 'C0002'];
      state.consents.resolutionStrategy.value = 'any';

      const destinationConfig = {
        ...defaultDestinationConfig,
        consentManagement: [
          {
            provider: 'ketch',
            consents: [],
          },
        ],
      } as DestinationConfig;

      const result = isDestinationConsented(state, destinationConfig, 'KetchConsentManagerPlugin');
      expect(result).toBe(true);
    });

    it('should return true if the resolution strategy is "or" and no consent IDs are not consented', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'ketch';
      state.consents.data.value.allowedConsentIds = ['C0002'];
      state.consents.resolutionStrategy.value = 'or';

      const destinationConfig = {
        ...defaultDestinationConfig,
        consentManagement: [
          {
            provider: 'ketch',
            consents: [
              {
                consent: 'C0001',
              },
            ],
          },
        ],
      } as DestinationConfig;

      const result = isDestinationConsented(state, destinationConfig, 'KetchConsentManagerPlugin');
      expect(result).toBe(false);
    });

    it('should return true if the resolution strategy is "or" and some of the consent IDs are consented', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'ketch';
      state.consents.data.value.allowedConsentIds = ['C0002'];
      state.consents.resolutionStrategy.value = 'or';

      const destinationConfig = {
        ...defaultDestinationConfig,
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
      } as DestinationConfig;

      const result = isDestinationConsented(state, destinationConfig, 'KetchConsentManagerPlugin');
      expect(result).toBe(true);
    });

    it('should return true if the resolution strategy is "or" and all the consent IDs are consented', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'ketch';
      state.consents.data.value.allowedConsentIds = ['C0001', 'C0002'];
      state.consents.resolutionStrategy.value = 'or';

      const destinationConfig = {
        ...defaultDestinationConfig,
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
      } as DestinationConfig;

      const result = isDestinationConsented(state, destinationConfig, 'KetchConsentManagerPlugin');
      expect(result).toBe(true);
    });

    it('should return true if the resolution strategy is "or" but the configured consents are empty', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'ketch';
      state.consents.data.value.allowedConsentIds = ['C0001', 'C0002'];
      state.consents.resolutionStrategy.value = 'or';

      const destinationConfig = {
        ...defaultDestinationConfig,
        consentManagement: [
          {
            provider: 'ketch',
            consents: [],
          },
        ],
      } as DestinationConfig;

      const result = isDestinationConsented(state, destinationConfig, 'KetchConsentManagerPlugin');
      expect(result).toBe(true);
    });

    it('should return false if the resolution strategy is "and" and no consent IDs are not consented', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'oneTrust';
      state.consents.data.value.allowedConsentIds = ['C0002'];
      state.consents.resolutionStrategy.value = 'and';

      const destinationConfig = {
        ...defaultDestinationConfig,
        consentManagement: [
          {
            provider: 'oneTrust',
            consents: [
              {
                consent: 'C0001',
              },
            ],
          },
        ],
      } as DestinationConfig;

      const result = isDestinationConsented(
        state,
        destinationConfig,
        'OneTrustConsentManagerPlugin',
      );
      expect(result).toBe(false);
    });

    it('should return false if the resolution strategy is "and" and some of the consent IDs are consented', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'oneTrust';
      state.consents.data.value.allowedConsentIds = ['C0002'];
      state.consents.resolutionStrategy.value = 'and';

      const destinationConfig = {
        ...defaultDestinationConfig,
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
      } as DestinationConfig;

      const result = isDestinationConsented(
        state,
        destinationConfig,
        'OneTrustConsentManagerPlugin',
      );
      expect(result).toBe(false);
    });

    it('should return true if the resolution strategy is "and" and all the consent IDs are consented', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'oneTrust';
      state.consents.data.value.allowedConsentIds = ['C0001', 'C0002'];
      state.consents.resolutionStrategy.value = 'and';

      const destinationConfig = {
        ...defaultDestinationConfig,
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
      } as DestinationConfig;

      const result = isDestinationConsented(
        state,
        destinationConfig,
        'OneTrustConsentManagerPlugin',
      );
      expect(result).toBe(true);
    });

    it('should return true if the resolution strategy is "and" but the configured consents are empty', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'oneTrust';
      state.consents.data.value.allowedConsentIds = ['C0001', 'C0002'];
      state.consents.resolutionStrategy.value = 'and';

      const destinationConfig = {
        ...defaultDestinationConfig,
        consentManagement: [
          {
            provider: 'oneTrust',
            consents: [],
          },
        ],
      } as DestinationConfig;

      const result = isDestinationConsented(
        state,
        destinationConfig,
        'OneTrustConsentManagerPlugin',
      );
      expect(result).toBe(true);
    });

    it('should return false if the resolution strategy is "all" and no consent IDs are not consented', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'oneTrust';
      state.consents.data.value.allowedConsentIds = ['C0002'];
      state.consents.resolutionStrategy.value = 'all';

      const destinationConfig = {
        ...defaultDestinationConfig,
        consentManagement: [
          {
            provider: 'oneTrust',
            consents: [
              {
                consent: 'C0001',
              },
            ],
          },
        ],
      } as DestinationConfig;

      const result = isDestinationConsented(
        state,
        destinationConfig,
        'OneTrustConsentManagerPlugin',
      );
      expect(result).toBe(false);
    });

    it('should return false if the resolution strategy is "all" and some of the consent IDs are consented', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'oneTrust';
      state.consents.data.value.allowedConsentIds = ['C0002'];
      state.consents.resolutionStrategy.value = 'all';

      const destinationConfig = {
        ...defaultDestinationConfig,
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
      } as DestinationConfig;

      const result = isDestinationConsented(
        state,
        destinationConfig,
        'OneTrustConsentManagerPlugin',
      );
      expect(result).toBe(false);
    });

    it('should return true if the resolution strategy is "all" and all the consent IDs are consented', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'oneTrust';
      state.consents.data.value.allowedConsentIds = ['C0001', 'C0002'];
      state.consents.resolutionStrategy.value = 'all';

      const destinationConfig = {
        ...defaultDestinationConfig,
        consentManagement: [
          {
            provider: 'oneTrust',
            consents: [
              {
                consent: ' C0001',
              },
              {
                consent: 'C0002 ',
              },
              {
                consent: '',
              },
              {
                consent: undefined,
              },
              {
                consent: '    ',
              },
            ],
          },
        ],
      } as DestinationConfig;

      const result = isDestinationConsented(
        state,
        destinationConfig,
        'OneTrustConsentManagerPlugin',
      );
      expect(result).toBe(true);
    });

    it('should return true if the resolution strategy is "all" but the configured consents are empty', () => {
      state.consents.initialized.value = true;
      state.consents.provider.value = 'oneTrust';
      state.consents.data.value.allowedConsentIds = ['C0001', 'C0002'];
      state.consents.resolutionStrategy.value = 'all';

      const destinationConfig = {
        ...defaultDestinationConfig,
        consentManagement: [
          {
            provider: 'oneTrust',
            consents: [],
          },
        ],
      } as DestinationConfig;

      const result = isDestinationConsented(
        state,
        destinationConfig,
        'OneTrustConsentManagerPlugin',
      );
      expect(result).toBe(true);
    });
  });
});
