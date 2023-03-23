import * as rudderanalytics from 'rudder-sdk-js';
import { initSanitySuite } from './testBook/index';

rudderanalytics.load('WRITE_KEY', 'DATA_PLANE_URL', {
  logLevel: 'DEBUG',
  configUrl: 'CONFIG_SERVER_HOST',
  lockIntegrationsVersion: true,
  destSDKBaseURL: 'DEST_SDK_BASE_URL',
  cookieConsentManager: {
    oneTrust: {
      enabled: true,
    }
  }
});

rudderanalytics.ready(() => {
  console.log('We are all set!!!');
});

window.rudderanalytics = rudderanalytics;

initSanitySuite();

export { rudderanalytics };
