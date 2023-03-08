import { v4 as uuidv4 } from '@lukeed/uuid/secure';
import * as R from 'ramda';
import { effect } from '@preact/signals-core';
import { pluginEngineInstance } from '@rudderstack/analytics-js/npmPackages/js-plugin/PluginEngine';
import { initPlugins, registerCustomPlugins } from './plugins/indexPOCToDelete';
import { HttpClientPOC } from './services/HttpClient/HttpClientPOC';
import { Queue } from './npmPackages/localstorage-retry';
import { setExposedGlobal, state } from './state/index';
import type { GenericObject } from './types/GenericObject';
import { UserSession } from './services/StorageManager/POCStorageToDelete/session';

export interface IV3 {
  status?: 'starting' | 'ready';
  load: (writeKey: string, config: GenericObject) => void;
  ready: () => void;
  page: () => void;
  pluginRegister: (customPlugins?: any[]) => void;
}

class AnalyticsV3 implements IV3 {
  status?: 'starting' | 'ready';

  newData: any[];

  messageId: string;
  httpClient: any;
  payloadQueue: any;
  uSession: any;

  userSession: any;
  constructor() {
    this.status = 'starting';
    this.newData = [];
    this.messageId = uuidv4();
    this.userSession = UserSession;
    setExposedGlobal('state', state);
    this.httpClient = new HttpClientPOC();

    effect(() => {
      console.log('remote state in constructor: ', state.remoteState.value);
      console.log('local state in constructor: ', state.globalLocalState.value);
    });
    this.startStorage();
    this.load();
  }

  load() {
    initPlugins();
    console.log('exposed state', (window as any).RudderStackGlobals.state);
    this.ready();
  }

  ready() {
    this.status = 'ready';
    console.log(this);
    state.globalLocalState.value = { counter: 1 };

    effect(() => {
      console.log('remote state in ready: ', state.remoteState.value);
      console.log('local state in ready: ', state.globalLocalState.value);
    });

    pluginEngineInstance.invoke('init.pre', { data: {} }, state);
    pluginEngineInstance.invoke('init.post', state);
    pluginEngineInstance.invoke('ready.post');

    setTimeout(() => {
      this.loadIntegration();
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

  dummyPlugins(data: any[]) {
    const setData = (processedData: any[]) => {
      this.newData = processedData;
    };

    // Process value with assignment and return (plugin.invoke will return an array containing all returned values)\
    // TODO: need to add ability to chain and process sequentially the result by adding an invokeChain method
    // https://stackoverflow.com/questions/51822513/in-javascript-how-to-execute-next-function-from-an-array-of-functions
    this.newData = pluginEngineInstance.invoke('local.test', data) as any[];

    // Process value with callback
    pluginEngineInstance.invoke('localMutate.test', this.newData);

    // Process value with callback nd remote plugin
    pluginEngineInstance.invoke('remote.test', this.newData, setData);
  }

  async dummyFetch() {
    const request = this.httpClient.get('http://www.google.com');
  }

  dummyQueue() {
    // TODO: use existing localstorage retry lib (we should migrate in our code instead)
    this.payloadQueue = new Queue('rudder', {}, (item: any, done: Function) => {});

    // start queue
    this.payloadQueue.start();
  }

  startStorage() {
    this.uSession = UserSession;
  }

  pluginRegister(customPlugins?: any[]) {
    registerCustomPlugins(customPlugins);
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

    pluginEngineInstance.invoke('remote.load_integrations', clientIntegrations, state);

    effect(() => {
      console.log('successfullyLoadedIntegration', state.successfullyLoadedIntegration.value);
    });

    effect(() => {
      console.log('dynamicallyLoadedIntegrations', state.dynamicallyLoadedIntegrations.value);
    });
  }
}

const analytics = new AnalyticsV3();
// TODO: add analytics restart/reset mechanism

export { AnalyticsV3, analytics };
