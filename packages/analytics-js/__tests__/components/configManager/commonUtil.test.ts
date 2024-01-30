import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { SourceConfigResponse } from '../../../src/components/configManager/types';
import {
  getSDKUrl,
  updateReportingState,
  updateStorageStateFromLoadOptions,
  updateConsentsStateFromLoadOptions,
  updateConsentsState,
} from '../../../src/components/configManager/util/commonUtil';
import { state, resetState } from '../../../src/state';

const createScriptElement = (url: string) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.id = 'SOME_ID';
  document.head.appendChild(script);
};

const removeScriptElement = () => {
  const scriptElem = document.getElementById('SOME_ID');
  scriptElem?.remove();
};

describe('Config Manager Common Utilities', () => {
  const mockLogger = {
    warn: jest.fn(),
    error: jest.fn(),
  } as unknown as ILogger;

  beforeEach(() => {
    resetState();
  });

  describe('getSDKUrl', () => {
    afterEach(() => {
      removeScriptElement();
    });

    it('should return SDK url that is being used', () => {
      const dummySdkURL = 'https://www.dummy.url/fromScript/v3/rsa.min.js';
      createScriptElement(dummySdkURL);

      const sdkURL = getSDKUrl();
      expect(sdkURL).toBe(dummySdkURL);
    });

    it('should return sdkURL as undefined when rudder SDK is not used', () => {
      const dummySdkURL = 'https://www.dummy.url/fromScript/v3/other.min.js';
      createScriptElement(dummySdkURL);

      const sdkURL = getSDKUrl();
      expect(sdkURL).toBe(undefined);
    });
    it('should return sdkURL when development rudder SDK is used', () => {
      const dummySdkURL = 'https://www.dummy.url/fromScript/v3/rsa.js';
      createScriptElement(dummySdkURL);

      const sdkURL = getSDKUrl();
      expect(sdkURL).toBe(dummySdkURL);
    });
    it('should return sdkURL as undefined when different SDK is used with similar name', () => {
      const dummySdkURL = 'https://www.dummy.url/fromScript/v3/rudder.min.js';
      createScriptElement(dummySdkURL);

      const sdkURL = getSDKUrl();
      expect(sdkURL).toBe(undefined);
    });
    it('should return sdkURL as undefined when different SDK is used with the name analytics', () => {
      const dummySdkURL = 'https://www.dummy.url/fromScript/v3/analytics.min.js';
      createScriptElement(dummySdkURL);

      const sdkURL = getSDKUrl();
      expect(sdkURL).toBe(undefined);
    });
    it('should return sdkURL as undefined when rudder SDK is used with incomplete name', () => {
      const dummySdkURL = 'https://www.dummy.url/fromScript/v3/rsa.min';
      createScriptElement(dummySdkURL);

      const sdkURL = getSDKUrl();
      expect(sdkURL).toBe(undefined);
    });
  });

  describe('updateReportingState', () => {
    it('should update reporting state with the data from source config', () => {
      const mockSourceConfig = {
        source: {
          config: {
            statsCollection: {
              errors: {
                enabled: true,
              },
              metrics: {
                enabled: true,
              },
            },
          },
        },
      } as SourceConfigResponse;

      updateReportingState(mockSourceConfig, mockLogger);

      expect(state.reporting.isErrorReportingEnabled.value).toBe(true);
      expect(state.reporting.isMetricsReportingEnabled.value).toBe(true);
      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should update reporting state with the data from source config even if error reporting provider is not specified', () => {
      const mockSourceConfig = {
        source: {
          config: {
            statsCollection: {
              errors: {
                enabled: true,
              },
              metrics: {
                enabled: true,
              },
            },
          },
        },
      } as SourceConfigResponse;

      updateReportingState(mockSourceConfig, mockLogger);

      expect(state.reporting.isErrorReportingEnabled.value).toBe(true);
      expect(state.reporting.isMetricsReportingEnabled.value).toBe(true);
      expect(mockLogger.warn).not.toHaveBeenCalled();
    });
  });

  describe('updateStorageStateFromLoadOptions', () => {
    it('should update storage state with the data from load options', () => {
      state.loadOptions.value.storage = {
        encryption: {
          version: 'v3',
        },
        migrate: true,
        cookie: {
          domain: 'rudderstack.com',
        },
      };

      updateStorageStateFromLoadOptions();

      expect(state.storage.encryptionPluginName.value).toBe('StorageEncryption');
      expect(state.storage.migrate.value).toBe(true);
      expect(state.storage.cookie.value).toStrictEqual({ domain: 'rudderstack.com' });
    });

    it('should update storage state with the data even if encryption version is not specified', () => {
      state.loadOptions.value.storage = {};

      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.storage.encryptionPluginName.value).toBe('StorageEncryption');
    });

    it('should log a warning if the specified storage type is not valid', () => {
      state.loadOptions.value.storage = {
        type: 'random-type',
      };

      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.storage.type.value).toBe('cookieStorage');
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The storage type "random-type" is not supported. Please choose one of the following supported types: "localStorage,memoryStorage,cookieStorage,sessionStorage,none". The default type "cookieStorage" will be used instead.',
      );
    });

    it('should log a warning if the encryption version is not supported', () => {
      state.loadOptions.value.storage = {
        encryption: {
          version: 'v2',
        },
      };

      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.storage.encryptionPluginName.value).toBe('StorageEncryption');
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The storage encryption version "v2" is not supported. Please choose one of the following supported versions: "v3,legacy". The default version "v3" will be used instead.',
      );
    });

    it('should update the storage state from load options for legacy encryption version', () => {
      state.loadOptions.value.storage = {
        encryption: {
          version: 'legacy',
        },
      };

      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.storage.encryptionPluginName.value).toBe('StorageEncryptionLegacy');
    });

    it('should set the migration to false if the encryption version is not latest even if migrate is set to true', () => {
      state.loadOptions.value.storage = {
        encryption: {
          version: 'legacy',
        },
        migrate: true,
      };

      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.storage.migrate.value).toBe(false);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The storage data migration has been disabled because the configured storage encryption version (legacy) is not the latest (v3). To enable storage data migration, please update the storage encryption version to the latest version.',
      );
    });
  });

  describe('updateConsentsStateFromLoadOptions', () => {
    it('should update consents state with the data from load options', () => {
      state.loadOptions.value.consentManagement = {
        enabled: true,
        provider: 'oneTrust',
      };

      state.loadOptions.value.preConsent = {
        enabled: true,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      };

      updateConsentsStateFromLoadOptions();

      expect(state.consents.activeConsentManagerPluginName.value).toBe('OneTrustConsentManager');
      expect(state.consents.preConsent.value).toStrictEqual({
        enabled: true,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      });
      expect(state.consents.initialized.value).toBe(false);
      expect(state.consents.data.value).toStrictEqual({
        allowedConsentIds: [],
        deniedConsentIds: [],
      });
    });

    it('should log an error if the specified consent manager is not supported', () => {
      state.loadOptions.value.consentManagement = {
        enabled: true,
        provider: 'randomManager',
      };

      updateConsentsStateFromLoadOptions(mockLogger);

      expect(state.consents.activeConsentManagerPluginName.value).toBe(undefined);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'ConfigManager:: The consent manager "randomManager" is not supported. Please choose one of the following supported consent managers: "oneTrust,ketch,custom".',
      );
    });

    it('should log a warning if the specified storage strategy is not supported', () => {
      state.loadOptions.value.consentManagement = {
        enabled: true,
        provider: 'oneTrust',
      };

      state.loadOptions.value.preConsent = {
        enabled: true,
        storage: {
          strategy: 'random-strategy',
        },
        events: {
          delivery: 'immediate',
        },
      };

      updateConsentsStateFromLoadOptions(mockLogger);

      expect(state.consents.preConsent.value).toStrictEqual({
        enabled: true,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      });
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The pre-consent storage strategy "random-strategy" is not supported. Please choose one of the following supported strategies: "none, session, anonymousId". The default strategy "none" will be used instead.',
      );
    });

    it('should log a warning if the specified events delivery type is not supported', () => {
      state.loadOptions.value.consentManagement = {
        enabled: true,
        provider: 'oneTrust',
      };

      state.loadOptions.value.preConsent = {
        enabled: true,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'random-delivery',
        },
      };

      updateConsentsStateFromLoadOptions(mockLogger);

      expect(state.consents.preConsent.value).toStrictEqual({
        enabled: true,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      });
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The pre-consent events delivery type "random-delivery" is not supported. Please choose one of the following supported types: "immediate, buffer". The default type "immediate" will be used instead.',
      );
    });

    it('should set pre-consent enabled status to false if the consents data is already provided for custom CMP', () => {
      state.loadOptions.value.preConsent = {
        enabled: true,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      };

      state.loadOptions.value.consentManagement = {
        enabled: true,
        provider: 'custom',
        allowedConsentIds: ['consent1'],
        deniedConsentIds: ['consent2'],
      };

      updateConsentsStateFromLoadOptions();

      expect(state.consents.preConsent.value).toStrictEqual({
        enabled: false,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      });
    });

    it('should set pre-consent enabled status to false if the consent management itself is disabled', () => {
      state.loadOptions.value.preConsent = {
        enabled: true,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      };

      state.loadOptions.value.consentManagement = {
        enabled: false,
      };

      updateConsentsStateFromLoadOptions();

      expect(state.consents.preConsent.value).toStrictEqual({
        enabled: false,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      });
    });
  });

  describe('updateConsentsState', () => {
    it('should update the consent management state with the data from the source config response', () => {
      state.consents.provider.value = 'ketch';
      const mockSourceConfig = {
        consentManagementMetadata: {
          providers: [
            {
              provider: 'oneTrust',
              resolutionStrategy: 'and',
            },
            {
              provider: 'ketch',
              resolutionStrategy: 'or',
            },
          ],
        },
      } as SourceConfigResponse;

      updateConsentsState(mockSourceConfig);

      expect(state.consents.metadata.value).toStrictEqual(
        mockSourceConfig.consentManagementMetadata,
      );
      expect(state.consents.resolutionStrategy.value).toBe('or');
    });

    it('should set the resolution strategy as undefined if the provider is set to "custom"', () => {
      state.consents.provider.value = 'custom';
      const mockSourceConfig = {
        consentManagementMetadata: {
          providers: [
            {
              provider: 'oneTrust',
              resolutionStrategy: 'and',
            },
            {
              provider: 'ketch',
              resolutionStrategy: 'or',
            },
          ],
        },
      } as SourceConfigResponse;

      updateConsentsState(mockSourceConfig);

      expect(state.consents.metadata.value).toStrictEqual(
        mockSourceConfig.consentManagementMetadata,
      );
      expect(state.consents.resolutionStrategy.value).toBe(undefined);
    });

    it('should not update the metadata and resolution strategy to state if the metadata in source config is not an object literal', () => {
      state.consents.provider.value = 'ketch';
      const mockSourceConfig = {
        consentManagementMetadata: 'random-metadata',
      } as SourceConfigResponse;

      updateConsentsState(mockSourceConfig);

      expect(state.consents.metadata.value).toBe(undefined);
      expect(state.consents.resolutionStrategy.value).toBe('and'); // default value
    });

    it('should not update the resolution strategy to state if the provider is not set', () => {
      state.consents.provider.value = undefined;
      const mockSourceConfig = {
        consentManagementMetadata: {
          providers: [
            {
              provider: 'oneTrust',
              resolutionStrategy: 'and',
            },
            {
              provider: 'ketch',
              resolutionStrategy: 'or',
            },
          ],
        },
      } as SourceConfigResponse;

      updateConsentsState(mockSourceConfig);

      expect(state.consents.resolutionStrategy.value).toBe('and'); // default value
    });

    it('should not update the resolution strategy to state if the provider is not supported', () => {
      state.consents.provider.value = 'random-provider';
      const mockSourceConfig = {
        consentManagementMetadata: {
          providers: [
            {
              provider: 'oneTrust',
              resolutionStrategy: 'and',
            },
            {
              provider: 'ketch',
              resolutionStrategy: 'or',
            },
          ],
        },
      } as SourceConfigResponse;

      updateConsentsState(mockSourceConfig);

      expect(state.consents.resolutionStrategy.value).toBe('and'); // default value
    });
  });
});
