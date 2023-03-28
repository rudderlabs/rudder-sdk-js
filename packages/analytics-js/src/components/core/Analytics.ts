import { defaultHttpClient, HttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { defaultLogger, Logger } from '@rudderstack/analytics-js/services/Logger';
import { defaultErrorHandler, ErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import {
  defaultPluginManager,
  PluginsManager,
} from '@rudderstack/analytics-js/components/pluginsManager';
import {
  defaultExternalSrcLoader,
  ExternalSrcLoader,
} from '@rudderstack/analytics-js/services/ExternalSrcLoader';
import {
  defaultStoreManager,
  Store,
  StoreManager,
} from '@rudderstack/analytics-js/services/StorageManager';
import { IAnalytics, LoadOptions } from '@rudderstack/analytics-js/components/core/IAnalytics';
import { LifecycleStatus } from '@rudderstack/analytics-js/state/slices/lifecycle';
import { effect } from '@preact/signals-core';
import { state } from '@rudderstack/analytics-js/state';
import { setExposedGlobal } from './exposedGlobals';

class Analytics {
  //implements IAnalytics {
  status: LifecycleStatus = 'mounted';
  httpClient: HttpClient;
  logger: Logger;
  errorHandler: ErrorHandler;
  pluginsManager: PluginsManager;
  externalSrcLoader: ExternalSrcLoader;
  storageManager: StoreManager;
  clientDataStore?: Store;

  constructor() {
    this.httpClient = defaultHttpClient;
    this.errorHandler = defaultErrorHandler;
    this.logger = defaultLogger;
    this.pluginsManager = defaultPluginManager;
    this.externalSrcLoader = defaultExternalSrcLoader;
    this.storageManager = defaultStoreManager;
  }

  load(writeKey: string, dataPlaneUrl: string, loadOptions?: LoadOptions) {
    // TODO: for multiple instances pass the write key or another unique analytics instance id here
    setExposedGlobal('state', state);

    // TODO: add any validation for arguments
    // TODO: run capabilities detection
    this.httpClient.setAuthHeader(writeKey);

    // TODO: start any other services or components needed
    // this.configManager(writeKey, dataPlaneUrl, loadOptions)

    this.startLifecycle();
  }

  startLifecycle() {
    effect(() => {
      // TODO: determine what methods to call based on app lifecycle status switch case
      this.init();
    });
  }

  init() {
    // TODO: pass values from sdk state config too
    this.storageManager.init({
      cookieOptions: { enabled: true },
      localStorageOptions: { enabled: true },
    });
    this.clientDataStore = this.storageManager.getStore('clientData');
  }
}

export { Analytics };
