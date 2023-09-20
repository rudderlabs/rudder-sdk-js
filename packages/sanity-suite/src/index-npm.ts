// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RudderAnalytics, LoadOptions, LogLevel } from '@rudderstack/analytics-js/legacy';
import { initSanitySuite } from './testBook';

const getWriteKey = () => {
  switch ('FEATURE' as string) {
    case 'dataResidency':
      return 'FEATURE_DATA_RESIDENCY_WRITE_KEY';
    case 'preloadBuffer':
      return 'FEATURE_PRELOAD_BUFFER_WRITE_KEY';
    case 'eventFiltering':
      return 'FEATURE_EVENT_FILTERING_WRITE_KEY';
    default:
      return 'WRITE_KEY';
  }
};

const getLoadOptions = (): Partial<LoadOptions> => {
  // eslint-disable-next-line sonarjs/no-all-duplicated-branches
  switch ('FEATURE' as string) {
    case 'dataResidency':
      return {
        logLevel: LogLevel.Debug,
        configUrl: 'CONFIG_SERVER_HOST',
        lockIntegrationsVersion: true,
        destSDKBaseURL: 'APP_DEST_SDK_BASE_URL',
        cookieConsentManager: {
          oneTrust: {
            enabled: true,
          },
        },
        storage: {
          migrate: true,
        },
      };
    case 'preloadBuffer':
      return {
        logLevel: LogLevel.Debug,
        configUrl: 'CONFIG_SERVER_HOST',
        lockIntegrationsVersion: true,
        destSDKBaseURL: 'APP_DEST_SDK_BASE_URL',
        cookieConsentManager: {
          oneTrust: {
            enabled: true,
          },
        },
        storage: {
          migrate: true,
        },
      };
    // eslint-disable-next-line sonarjs/no-duplicated-branches
    case 'eventFiltering':
      return {
        logLevel: LogLevel.Debug,
        configUrl: 'CONFIG_SERVER_HOST',
        lockIntegrationsVersion: true,
        destSDKBaseURL: 'APP_DEST_SDK_BASE_URL',
        cookieConsentManager: {
          oneTrust: {
            enabled: true,
          },
        },
        storage: {
          migrate: true,
        },
      };
    // eslint-disable-next-line sonarjs/no-duplicated-branches
    default:
      return {
        logLevel: LogLevel.Debug,
        configUrl: 'CONFIG_SERVER_HOST',
        lockIntegrationsVersion: true,
        destSDKBaseURL: 'APP_DEST_SDK_BASE_URL',
        cookieConsentManager: {
          oneTrust: {
            enabled: true,
          },
        },
        storage: {
          migrate: true,
        },
      };
  }
};

const sanitySuiteApp = () => {
  const rudderAnalytics = new RudderAnalytics();
  rudderAnalytics.load(getWriteKey(), 'DATA_PLANE_URL', getLoadOptions());

  rudderAnalytics.ready(() => {
    console.log('We are all set!!!');
    initSanitySuite();
  });

  window.rudderanalytics = rudderAnalytics;
};

sanitySuiteApp();
