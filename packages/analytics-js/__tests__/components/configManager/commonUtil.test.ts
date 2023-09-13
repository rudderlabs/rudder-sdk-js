import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { SourceConfigResponse } from '../../../src/components/configManager/types';
import {
  getSDKUrl,
  updateReportingState,
  updateStorageState,
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
    afterEach(() => {
      resetState();
    });

    const mockLogger = {
      warn: jest.fn(),
    } as unknown as ILogger;

    it('should update reporting state with the data from source config', () => {
      const mockSourceConfig = {
        source: {
          config: {
            statsCollection: {
              errors: {
                enabled: true,
                provider: 'bugsnag',
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
      expect(state.reporting.errorReportingProviderPluginName.value).toBe('Bugsnag');

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
      expect(state.reporting.errorReportingProviderPluginName.value).toBe('Bugsnag');

      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should log a warning if the error reporting provider is not supported', () => {
      const mockSourceConfig = {
        source: {
          config: {
            statsCollection: {
              errors: {
                enabled: true,
                provider: 'random-provider',
              },
              metrics: {
                enabled: false,
              },
            },
          },
        },
      } as SourceConfigResponse;

      updateReportingState(mockSourceConfig, mockLogger);

      expect(state.reporting.isErrorReportingEnabled.value).toBe(true);
      expect(state.reporting.isMetricsReportingEnabled.value).toBe(false);
      expect(state.reporting.errorReportingProviderPluginName.value).toBe('Bugsnag');

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The error reporting provider "random-provider" is not supported. Please choose one of the following supported providers: "bugsnag". The default provider "bugsnag" will be used instead.',
      );
    });
  });

  describe('updateStorageState', () => {
    const mockLogger = {
      warn: jest.fn(),
    } as unknown as ILogger;

    beforeEach(() => {
      resetState();
    });

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

      updateStorageState();

      expect(state.storage.encryptionPluginName.value).toBe('StorageEncryption');
      expect(state.storage.migrate.value).toBe(true);
      expect(state.storage.cookie.value).toStrictEqual({ domain: 'rudderstack.com' });
    });

    it('should update storage state with the data even if encryption version is not specified', () => {
      state.loadOptions.value.storage = {};

      updateStorageState(mockLogger);

      expect(state.storage.encryptionPluginName.value).toBe('StorageEncryption');
    });

    it('should log a warning if the specified storage type is not valid', () => {
      state.loadOptions.value.storage = {
        type: 'random-type',
      };

      updateStorageState(mockLogger);

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

      updateStorageState(mockLogger);

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

      updateStorageState(mockLogger);

      expect(state.storage.encryptionPluginName.value).toBe('StorageEncryptionLegacy');
    });

    it('should set the migration to false if the encryption version is not latest even if migrate is set to true', () => {
      state.loadOptions.value.storage = {
        encryption: {
          version: 'legacy',
        },
        migrate: true,
      };

      updateStorageState(mockLogger);

      expect(state.storage.migrate.value).toBe(false);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The storage data migration has been disabled because the configured storage encryption version (legacy) is not the latest (v3). To enable storage data migration, please update the storage encryption version to the latest version.',
      );
    });
  });
});
