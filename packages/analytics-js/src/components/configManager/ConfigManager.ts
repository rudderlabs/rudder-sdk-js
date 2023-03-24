/* eslint-disable class-methods-use-this */
import { defaultLogger, Logger } from '@rudderstack/analytics-js/services/Logger';
import { defaultErrorHandler, ErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { HttpClient, defaultHttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';

const DEF_LOAD_OPTIONS = {
  logLevel: 'ERROR',
  integrations: { All: true },
  configUrl: 'https://api.rudderlabs.com',
  queueOptions: {},
  loadIntegration: true,
  sessions: {
    timeout: 30 * 60 * 1000, // 30 min in milliseconds
  },
  secureCookie: false,
  destSDKBaseURL: 'https://cdn.rudderlabs.com/v1.1/js-integrations',
  useBeacon: false,
  beaconQueueOptions: {},
  sameSiteCookie: 'Lax',
  lockIntegrationsVersion: false,
  polyfillIfRequired: true,
  uaChTrackLevel: 'none',
};

class ConfigManager {
  httpClient: HttpClient;
  errorHandler?: ErrorHandler;
  logger?: Logger;
  hasErrorHandler = false;
  hasLogger = false;

  constructor(httpClient: HttpClient, errorHandler?: ErrorHandler, logger?: Logger) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.httpClient = httpClient;
    this.hasErrorHandler = Boolean(this.errorHandler);
    this.hasLogger = Boolean(this.logger);
  }

  setLoadOptions(loadOptions: any) {
    // TODO: create a deepcopy of loadOption if not done in previous step
    this.validateLoadOptions(loadOptions);
    const finalLoacOption = mergeDeepRight(DEF_LOAD_OPTIONS, loadOptions || {});
    // set the final load option in state
    return finalLoacOption;
  }

  validateLoadOptions(loadOptions: any) {
    console.log(loadOptions);
  }

  fetchSourceConfig(url: string, writeKey: string) {
    this.httpClient
      .getData({
        url: `${url}/sourceConfig/?p=process.module_type&v=process.package_version&w=${writeKey}`,
      })
      .then(() => {
        // set required parameters in the state from response
      });
  }
}

const defaultConfigManager = new ConfigManager(
  defaultHttpClient,
  defaultErrorHandler,
  defaultLogger,
);

export { ConfigManager, defaultConfigManager };
