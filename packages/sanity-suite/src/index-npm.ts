import * as RudderAnalytics from 'rudder-sdk-js';
import { initSanitySuite } from './testBook';

const sanitySuiteApp = () => {
  (RudderAnalytics as any).load('WRITE_KEY', 'DATA_PLANE_URL', {
    logLevel: 'DEBUG',
    configUrl: 'CONFIG_SERVER_HOST',
    lockIntegrationsVersion: true,
    destSDKBaseURL: 'DEST_SDK_BASE_URL',
    cookieConsentManager: {
      oneTrust: {
        enabled: true,
      },
    },
  });

  (RudderAnalytics as any).ready(() => {
    console.log('We are all set!!!');
  });

  (window as any).rudderanalytics = RudderAnalytics;

  initSanitySuite();
};

sanitySuiteApp();
