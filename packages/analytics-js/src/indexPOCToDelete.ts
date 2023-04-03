import * as R from 'ramda';
import { effect } from '@preact/signals-core';
import { defaultHttpClient, HttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { defaultErrorHandler, ErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger, Logger } from '@rudderstack/analytics-js/services/Logger';
import {
  defaultPluginManager,
  PluginsManager,
} from '@rudderstack/analytics-js/components/pluginsManager';
import {
  defaultExternalSrcLoader,
  ExternalSrcLoader,
} from '@rudderstack/analytics-js/services/ExternalSrcLoader';
import { defaultStoreManager, StoreManager } from '@rudderstack/analytics-js/services/StoreManager';
import { Store } from '@rudderstack/analytics-js/services/StoreManager/Store';
import { defaultUserSessionManager } from '@rudderstack/analytics-js/components/userSessionManager';
import { setExposedGlobal } from '@rudderstack/analytics-js/components/utilities/globals';
import { Queue } from './npmPackages/localstorage-retry';
import { state } from './state';
import { generateUUID } from './components/utilities/uuId';
import { dummyState } from './dummyStateToDelete';

export interface IV3 {
  status?: 'starting' | 'ready';
  load: (writeKey: string, config: Record<string, any>) => void;
  ready: () => void;
  page: () => void;
  pluginRegister: (customPlugins?: any[]) => void;
}

class AnalyticsV3 implements IV3 {
  status?: 'starting' | 'ready';
  newData: any[];
  messageId: string;
  httpClient: HttpClient;
  logger: Logger;
  errorHandler: ErrorHandler;
  pluginsManager: PluginsManager;
  externalSrcLoader: ExternalSrcLoader;
  storageManager: StoreManager;
  clientDataStore?: Store;
  payloadQueue: any;
  userSession: any;

  constructor() {
    this.status = 'starting';
    this.newData = [];
    this.messageId = generateUUID();
    this.userSession = defaultUserSessionManager;
    setExposedGlobal('state', state);
    this.httpClient = defaultHttpClient;
    this.errorHandler = defaultErrorHandler;
    this.logger = defaultLogger;
    this.pluginsManager = defaultPluginManager;
    this.externalSrcLoader = defaultExternalSrcLoader;
    this.storageManager = defaultStoreManager;
    // TODO: pass values from sdk init config too
    this.storageManager.init({
      cookieOptions: { enabled: true },
      localStorageOptions: { enabled: true },
    });
    this.clientDataStore = this.storageManager.getStore('clientData');
    this.httpClient.setAuthHeader('2L8Fl7ryPss3Zku133Pj5ox7NeP');

    effect(() => {
      console.log('remote state in constructor: ', dummyState.remoteState.value);
      console.log('local state in constructor: ', dummyState.globalLocalState.value);
    });
    this.load();
  }

  load() {
    this.pluginsManager.init();
    console.log('exposed state', (window as any).RudderStackGlobals.state);
    this.ready();
  }

  ready() {
    this.status = 'ready';
    console.log(this);
    dummyState.globalLocalState.value = { counter: 1 };

    effect(() => {
      console.log('remote state in ready: ', dummyState.remoteState.value);
      console.log('local state in ready: ', dummyState.globalLocalState.value);
    });

    this.pluginsManager.invoke('init.pre', { data: {} }, state);
    this.pluginsManager.invoke('init.post', state);
    this.pluginsManager.invoke('ready.post');

    window.setTimeout(() => {
      this.loadIntegration();
      this.startSessionTracking();
      this.page();
    }, 5000);
  }

  page() {
    const data = ['initial data'];
    this.dummyPlugins(data);

    // Adding ramda imports
    let cloned = R.clone({});
    let clonedMerged = R.mergeDeepWith(n => n, {}, {});
    console.log(this.newData);
    this.dummyFetch();
  }

  dummyError() {
    try {
      throw new Error('Caught dummy error');
    } catch (err) {
      this.errorHandler.onError(err, 'Dummy', 'V3 test');
    }

    throw new Error('Uncaught dummy error');
  }

  dummyLog() {
    this.logger.error('this is a dummy error level log');
    this.logger.info('this is a dummy info level log');
  }

  dummyPlugins(data: any[]) {
    const setData = (processedData: any[]) => {
      this.newData = processedData;
    };

    // Process value with assignment and return (plugin.invoke will return an array containing all returned values)\
    // TODO: need to add ability to chain and process sequentially the result by adding an invokeChain method
    // https://stackoverflow.com/questions/51822513/in-javascript-how-to-execute-next-function-from-an-array-of-functions
    this.newData = this.pluginsManager.invoke('local.test', data) as any[];

    // Process value with callback
    this.pluginsManager.invoke('localMutate.test', this.newData);

    // Process value with callback nd remote plugin
    this.pluginsManager.invoke('remote.test', this.newData, setData);
  }

  async dummyFetch() {
    console.log('start request sequence');
    const response = await this.httpClient.getData({
      url: 'https://apiiii.rudderlabs.com/sourceConfig/?p=cdn&v=dev-snapshot&writeKey=2L8Fl7ryPss3Zku133Pj5ox7NeP',
      isRawResponse: true,
      timeout: 1000,
    });
    console.log('blocking response', response);

    this.httpClient.getAsyncData({
      url: 'https://api.rudderlabs.com/sourceConfig/?p=cdn&v=dev-snapshot&writeKey=2L8Fl7ryPss3Zku133Pj5ox7NeP',
      callback: data => {
        console.log('async response via callback', data);
        console.log('end sequence');
      },
    });
    console.log('after async call');
  }

  dummyQueue() {
    // TODO: use existing localstorage retry lib (we should migrate in our code instead)
    this.payloadQueue = new Queue('rudder', {}, (item: any, done: Function) => {});

    // start queue
    this.payloadQueue.start();
  }

  startSessionTracking() {
    //this.userSession.setStorage(this.clientDataStore);
  }

  pluginRegister(customPlugins: any[] = []) {
    this.pluginsManager.register(customPlugins);
  }

  loadIntegration() {
    const clientIntegrations = [
      {
        name: 'GA',
        config: {
          trackingID: 'UA-179234741-1',
          doubleClick: false,
          enhancedLinkAttribution: false,
          includeSearch: false,
          trackCategorizedPages: true,
          trackNamedPages: true,
          useRichEventNames: false,
          sampleRate: '100',
          siteSpeedSampleRate: '1',
          resetCustomDimensionsOnPage: [
            {
              resetCustomDimensionsOnPage: '',
            },
          ],
          setAllMappedProps: true,
          anonymizeIp: false,
          domain: 'auto',
          enhancedEcommerce: false,
          nonInteraction: false,
          optimize: '',
          sendUserId: false,
          useGoogleAmpClientId: false,
          namedTracker: false,
          blacklistedEvents: [
            {
              eventName: '',
            },
          ],
          whitelistedEvents: [
            {
              eventName: '',
            },
          ],
          oneTrustCookieCategories: [
            {
              oneTrustCookieCategory: '',
            },
          ],
          eventFilteringOption: 'disable',
        },
      },
    ];

    // TODO: store in state and calculate is all are loaded to fire the onReady
    const extScriptOnLoad = (id?: string) => {
      if (!id) {
        return;
      }

      console.log(`${id} Script loaded`);
    };

    this.pluginsManager.invoke(
      'remote.load_integrations',
      clientIntegrations,
      state,
      this.externalSrcLoader,
      extScriptOnLoad,
    );

    effect(() => {
      console.log('successfullyLoadedIntegration', dummyState.successfullyLoadedIntegration.value);
    });

    effect(() => {
      console.log('dynamicallyLoadedIntegrations', dummyState.dynamicallyLoadedIntegrations.value);
    });
  }
}

const analytics = new AnalyticsV3();
// TODO: add analytics restart/reset mechanism

export { analytics };
