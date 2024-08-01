import * as RudderAnalytics from 'rudder-sdk-js';
import { initSanitySuite } from './testBook';

const getWriteKey = () => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch ('FEATURE' as string) {
    default:
      return 'WRITE_KEY';
  }
};

const getLoadOptions = () => {
  const defaultLoadOptions = {
    logLevel: 'DEBUG',
    configUrl: 'CONFIG_SERVER_HOST',
    destSDKBaseURL: 'APP_DEST_SDK_BASE_URL',
    cookieConsentManager: {
      oneTrust: {
        enabled: true,
      },
    },
    anonymousIdOptions: {
      autoCapture: {
        enabled: true,
        source: 'segment',
      },
    },
  };

  // eslint-disable-next-line sonarjs/no-all-duplicated-branches,sonarjs/no-small-switch
  switch ('FEATURE' as string) {
    // eslint-disable-next-line sonarjs/no-duplicated-branches
    default:
      return defaultLoadOptions;
  }
};

const sanitySuiteApp = () => {
  (RudderAnalytics as any).load(getWriteKey(), 'DATA_PLANE_URL', getLoadOptions());

  (window as any).userWriteKey = getWriteKey();
  (window as any).userConfigUrl = getLoadOptions().configUrl;

  (RudderAnalytics as any).ready(() => {
    console.log('We are all set!!!');
    initSanitySuite();
  });

  (window as any).rudderanalytics = RudderAnalytics;
};

sanitySuiteApp();
