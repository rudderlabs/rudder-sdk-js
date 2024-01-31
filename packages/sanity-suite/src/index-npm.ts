// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RudderAnalytics, type LoadOptions } from '@rudderstack/analytics-js';
import { initSanitySuite } from './testBook';

const getWriteKey = () => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch ('FEATURE' as string) {
    default:
      return 'WRITE_KEY';
  }
};

const getLoadOptions = (): Partial<LoadOptions> => {
  const defaultLoadOptions: Partial<LoadOptions> = {
    logLevel: 'DEBUG',
    configUrl: 'CONFIG_SERVER_HOST',
    lockIntegrationsVersion: true,
    destSDKBaseURL: 'APP_DEST_SDK_BASE_URL',
    pluginsSDKBaseURL: 'REMOTE_MODULES_BASE_PATH',
    consentManagement: {
      enabled: true,
      provider: 'oneTrust',
    },
    storage: {
      migrate: true,
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
  const rudderAnalytics = new RudderAnalytics();
  rudderAnalytics.load(getWriteKey(), 'DATA_PLANE_URL', getLoadOptions());

  (window as any).userWriteKey = getWriteKey();
  (window as any).userConfigUrl = getLoadOptions().configUrl;

  rudderAnalytics.ready(() => {
    console.log('We are all set!!!');
    initSanitySuite();
  });
};

sanitySuiteApp();
