import { signal } from '@preact/signals-core';
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { clone } from 'ramda';

const defaultStateValues: ApplicationState = {
  capabilities: {
    isOnline: signal(true),
    storage: {
      isLocalStorageAvailable: signal(false),
      isCookieStorageAvailable: signal(false),
      isSessionStorageAvailable: signal(false),
    },
    isBeaconAvailable: signal(false),
    isLegacyDOM: signal(false),
    isUaCHAvailable: signal(false),
    isCryptoAvailable: signal(false),
    isIE11: signal(false),
    isAdBlocked: signal(false),
  },
  consents: {
    enabled: signal(false),
    initialized: signal(false),
    data: signal({}),
    activeConsentManagerPluginName: signal(undefined),
    preConsent: signal({ enabled: false }),
    postConsent: signal({}),
    resolutionStrategy: signal('and'),
    provider: signal(undefined),
    metadata: signal(undefined),
  },
  context: {
    app: signal({
      name: 'RudderLabs JavaScript SDK',
      namespace: 'com.rudderlabs.javascript',
      version: 'dev-snapshot',
      installType: 'cdn',
    }),
    traits: signal(null),
    library: signal({
      name: 'RudderLabs JavaScript SDK',
      version: 'dev-snapshot',
      snippetVersion: (globalThis as typeof window).RudderSnippetVersion,
    }),
    userAgent: signal(''),
    device: signal(null),
    network: signal(null),
    os: signal({
      name: '',
      version: '',
    }),
    locale: signal(null),
    screen: signal({
      density: 0,
      width: 0,
      height: 0,
      innerWidth: 0,
      innerHeight: 0,
    }),
    'ua-ch': signal(undefined),
    timezone: signal(undefined),
  },
  eventBuffer: {
    toBeProcessedArray: signal([]),
    readyCallbacksArray: signal([]),
  },
  lifecycle: {
    activeDataplaneUrl: signal(undefined),
    integrationsCDNPath: signal(undefined),
    pluginsCDNPath: signal(undefined),
    sourceConfigUrl: signal(undefined),
    status: signal(undefined),
    initialized: signal(false),
    logLevel: signal('ERROR'),
    loaded: signal(false),
    readyCallbacks: signal([]),
    writeKey: signal(undefined),
    dataPlaneUrl: signal(undefined),
    safeAnalyticsInstance: signal({
      track: jest.fn(),
      page: jest.fn(),
      identify: jest.fn(),
      group: jest.fn(),
      alias: jest.fn(),
      getAnonymousId: jest.fn(),
      getUserId: jest.fn(),
      getUserTraits: jest.fn(),
      getGroupId: jest.fn(),
      getGroupTraits: jest.fn(),
      getSessionId: jest.fn(),
    }),
  },
  loadOptions: signal({
    logLevel: 'ERROR',
    configUrl: 'https://api.rudderstack.com',
    loadIntegration: true,
    sessions: {
      autoTrack: true,
      timeout: 30 * 60 * 1000,
    },
    sameSiteCookie: 'Lax',
    polyfillIfRequired: true,
    integrations: { All: true },
    useBeacon: false,
    beaconQueueOptions: {},
    destinationsQueueOptions: {},
    queueOptions: {},
    lockIntegrationsVersion: false,
    lockPluginsVersion: false,
    uaChTrackLevel: 'none',
    plugins: [],
    useGlobalIntegrationsConfigInEvents: false,
    bufferDataPlaneEventsUntilReady: false,
    dataPlaneEventsBufferTimeout: 1000,
    storage: {
      encryption: {
        version: 'v3',
      },
      migrate: true,
      cookie: {},
    },
    sendAdblockPageOptions: {},
    useServerSideCookies: false,
  }),
  metrics: {
    retries: signal(0),
    dropped: signal(0),
    sent: signal(0),
    queued: signal(0),
    triggered: signal(0),
    metricsServiceUrl: signal(undefined),
  },
  nativeDestinations: {
    configuredDestinations: signal([]),
    activeDestinations: signal([]),
    loadOnlyIntegrations: signal({}),
    failedDestinations: signal([]),
    loadIntegration: signal(true),
    initializedDestinations: signal([]),
    clientDestinationsReady: signal(false),
    integrationsConfig: signal({}),
  },
  plugins: {
    ready: signal(false),
    loadedPlugins: signal([]),
    failedPlugins: signal([]),
    pluginsToLoadFromConfig: signal([]),
    activePlugins: signal([]),
    totalPluginsToLoad: signal(0),
  },
  reporting: {
    isErrorReportingEnabled: signal(false),
    isMetricsReportingEnabled: signal(false),
    breadcrumbs: signal([]),
  },
  session: {
    userId: signal(''),
    userTraits: signal({}),
    anonymousId: signal(''),
    groupId: signal(''),
    groupTraits: signal({}),
    initialReferrer: signal(''),
    initialReferringDomain: signal(''),
    sessionInfo: signal({}),
    authToken: signal(''),
  },
  source: signal({
    id: 'dummy-source-id',
    workspaceId: 'dummy-workspace-id',
    name: 'dummy-source-name',
  }),
  storage: {
    encryptionPluginName: signal(undefined),
    migrate: signal(false),
    type: signal(undefined),
    cookie: signal(undefined),
    entries: signal({}),
    trulyAnonymousTracking: signal(false),
  },
  serverCookies: {
    isEnabledServerSideCookies: signal(false),
    dataServiceUrl: signal(undefined),
  },
  dataPlaneEvents: {
    eventsQueuePluginName: signal<PluginName | undefined>(undefined),
    deliveryEnabled: signal(true), // Delivery should always happen
  },
  autoTrack: {
    enabled: signal(false),
    pageLifecycle: {
      enabled: signal(false),
      pageViewId: signal(undefined),
      pageLoadedTimestamp: signal(undefined),
    },
  },
};

const state: ApplicationState = {
  ...clone(defaultStateValues),
};

const resetState = () => {
  state.capabilities = clone(defaultStateValues.capabilities);
  state.consents = clone(defaultStateValues.consents);
  state.context = clone(defaultStateValues.context);
  state.eventBuffer = clone(defaultStateValues.eventBuffer);
  state.lifecycle = clone(defaultStateValues.lifecycle);
  state.loadOptions = clone(defaultStateValues.loadOptions);
  state.metrics = clone(defaultStateValues.metrics);
  state.nativeDestinations = clone(defaultStateValues.nativeDestinations);
  state.plugins = clone(defaultStateValues.plugins);
  state.reporting = clone(defaultStateValues.reporting);
  state.session = clone(defaultStateValues.session);
  state.source = clone(defaultStateValues.source);
  state.storage = clone(defaultStateValues.storage);
  state.serverCookies = clone(defaultStateValues.serverCookies);
  state.dataPlaneEvents = clone(defaultStateValues.dataPlaneEvents);
  state.autoTrack = clone(defaultStateValues.autoTrack);
};

export { state, resetState };
