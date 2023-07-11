import { SourceConfigResponse } from '@rudderstack/analytics-js/components/configManager/types';
import {
  getSDKUrl,
  updateReportingState,
} from '@rudderstack/analytics-js/components/configManager/util/commonUtil';
import { state, resetState } from '@rudderstack/analytics-js/state';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';

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
      const dummySdkURL = 'https://www.dummy.url/fromScript/v3/rudder-analytics.min.js';
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
      const dummySdkURL = 'https://www.dummy.url/fromScript/v3/rudder-analytics.js';
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
      const dummySdkURL = 'https://www.dummy.url/fromScript/v3/rudder-analytics.min';
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
      expect(state.reporting.errorReportingProviderPlugin.value).toBe('Bugsnag');

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
      expect(state.reporting.errorReportingProviderPlugin.value).toBe('Bugsnag');

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
      expect(state.reporting.errorReportingProviderPlugin.value).toBe('Bugsnag');

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'The configured error reporting provider "random-provider" is not supported. Supported provider(s) is/are "bugsnag". Using the default provider (bugsnag).',
      );
    });
  });
});
