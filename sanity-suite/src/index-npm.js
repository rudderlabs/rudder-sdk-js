import * as rudderanalytics from 'rudder-sdk-js';
import { initSanitySuite } from './testBook/index';

const getWriteKey = () => {
  switch ('FEATURE') {
    case 'preloadBuffer':
      return 'FEATURE_PRELOAD_BUFFER_WRITE_KEY';
    case 'eventFiltering':
      return 'FEATURE_EVENT_FILTERING_WRITE_KEY';
    default:
      return 'WRITE_KEY';
  }
};

const getLoadOptions = () => {
  switch ('FEATURE') {
    case 'preloadBuffer':
      return {
        logLevel: 'DEBUG',
        configUrl: 'CONFIG_SERVER_HOST',
        lockIntegrationsVersion: true,
        destSDKBaseURL: 'DEST_SDK_BASE_URL',
        cookieConsentManager: {
          oneTrust: {
            enabled: true,
          },
        },
      };
    case 'eventFiltering':
      return {
        logLevel: 'DEBUG',
        configUrl: 'CONFIG_SERVER_HOST',
        lockIntegrationsVersion: true,
        destSDKBaseURL: 'DEST_SDK_BASE_URL',
        cookieConsentManager: {
          oneTrust: {
            enabled: true,
          },
        },
      };
    default:
      return {
        logLevel: 'DEBUG',
        configUrl: 'CONFIG_SERVER_HOST',
        lockIntegrationsVersion: true,
        destSDKBaseURL: 'DEST_SDK_BASE_URL',
        cookieConsentManager: {
          oneTrust: {
            enabled: true,
          },
        },
      };
  }
};

rudderanalytics.load(getWriteKey(), 'DATA_PLANE_URL', getLoadOptions());

rudderanalytics.ready(() => {
  console.log('We are all set!!!');
});

window.rudderanalytics = rudderanalytics;

initSanitySuite();

export { rudderanalytics };
