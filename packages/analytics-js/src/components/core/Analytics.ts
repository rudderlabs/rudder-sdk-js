import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { defaultHttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { ExternalSrcLoader } from '@rudderstack/analytics-js/services/ExternalSrcLoader';
import { Store, StoreManager } from '@rudderstack/analytics-js/services/StoreManager';
import { batch, effect } from '@preact/signals-core';
import { state } from '@rudderstack/analytics-js/state';
import { ConfigManager } from '@rudderstack/analytics-js/components/configManager/ConfigManager';
import { ICapabilitiesManager } from '@rudderstack/analytics-js/components/capabilitiesManager/types';
import { CapabilitiesManager } from '@rudderstack/analytics-js/components/capabilitiesManager';
import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import {
  IEventManager,
  RudderEventType,
} from '@rudderstack/analytics-js/components/eventManager/types';
import { EventManager } from '@rudderstack/analytics-js/components/eventManager';
import { UserSessionManager } from '@rudderstack/analytics-js/components/userSessionManager/UserSessionManager';
import { Nullable } from '@rudderstack/analytics-js/types';
import {
  AnonymousIdOptions,
  ApiCallback,
  ApiObject,
  BufferedEvent,
  LifecycleStatus,
  LoadOptions,
} from '@rudderstack/analytics-js/state/types';
import { IHttpClient } from '@rudderstack/analytics-js/services/HttpClient/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { IPluginsManager } from '@rudderstack/analytics-js/components/pluginsManager/types';
import { IExternalSrcLoader } from '@rudderstack/analytics-js/services/ExternalSrcLoader/types';
import { IStoreManager } from '@rudderstack/analytics-js/services/StoreManager/types';
import { IUserSessionManager } from '@rudderstack/analytics-js/components/userSessionManager/types';
import { IConfigManager } from '@rudderstack/analytics-js/components/configManager/types';
import { setExposedGlobal } from '@rudderstack/analytics-js/components/utilities/globals';
import { normaliseLoadOptions } from '@rudderstack/analytics-js/components/utilities/loadOptions';
import {
  consumePreloadBufferedEvent,
  retrievePreloadBufferEvents,
} from '@rudderstack/analytics-js/components/preloadBuffer';
import { PreloadedEventCall } from '@rudderstack/analytics-js/components/preloadBuffer/types';
import { BufferQueue } from '@rudderstack/analytics-js/components/core/BufferQueue';
import { EventRepository } from '@rudderstack/analytics-js/components/eventRepository';
import { IEventRepository } from '@rudderstack/analytics-js/components/eventRepository/types';
import {
  AliasCallOptions,
  GroupCallOptions,
  IdentifyCallOptions,
  PageCallOptions,
  TrackCallOptions,
} from './eventMethodOverloads';
import { IAnalytics } from './IAnalytics';

/*
 * Analytics class with lifecycle based on state ad user triggered events
 */
class Analytics implements IAnalytics {
  preloadBuffer: BufferQueue<PreloadedEventCall> = new BufferQueue();
  initialized: boolean;
  status?: LifecycleStatus;
  logger: ILogger;
  errorHandler: IErrorHandler;
  httpClient: IHttpClient;
  externalSrcLoader: IExternalSrcLoader;
  capabilitiesManager: ICapabilitiesManager;
  pluginsManager?: IPluginsManager;
  storeManager?: IStoreManager;
  configManager?: IConfigManager;
  eventRepository?: IEventRepository;
  eventManager?: IEventManager;
  userSessionManager?: IUserSessionManager;
  clientDataStore?: Store;

  /**
   * Initialize services and components or use default ones if singletons
   */
  constructor() {
    this.initialized = false;
    this.errorHandler = defaultErrorHandler;
    this.logger = defaultLogger;
    this.externalSrcLoader = new ExternalSrcLoader(this.errorHandler, this.logger);
    this.capabilitiesManager = new CapabilitiesManager(this.errorHandler, this.logger);
    this.httpClient = defaultHttpClient;

    this.attachGlobalErrorHandler = this.attachGlobalErrorHandler.bind(this);
    this.load = this.load.bind(this);
    this.startLifecycle = this.startLifecycle.bind(this);
    this.prepareBrowserCapabilities = this.prepareBrowserCapabilities.bind(this);
    this.enqueuePreloadBufferEvents = this.enqueuePreloadBufferEvents.bind(this);
    this.processDataInPreloadBuffer = this.processDataInPreloadBuffer.bind(this);
    this.prepareInternalServices = this.prepareInternalServices.bind(this);
    this.loadConfig = this.loadConfig.bind(this);
    this.init = this.init.bind(this);
    this.loadPlugins = this.loadPlugins.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
    this.processBufferedEvents = this.processBufferedEvents.bind(this);
    this.loadIntegrations = this.loadIntegrations.bind(this);
    this.onReady = this.onReady.bind(this);
    this.ready = this.ready.bind(this);
    this.page = this.page.bind(this);
    this.track = this.track.bind(this);
    this.identify = this.identify.bind(this);
    this.alias = this.alias.bind(this);
    this.group = this.group.bind(this);
    this.reset = this.reset.bind(this);
    this.getAnonymousId = this.getAnonymousId.bind(this);
    this.setAnonymousId = this.setAnonymousId.bind(this);
    this.getUserId = this.getUserId.bind(this);
    this.getUserTraits = this.getUserTraits.bind(this);
    this.getGroupId = this.getGroupId.bind(this);
    this.getGroupTraits = this.getGroupTraits.bind(this);
    this.startSession = this.startSession.bind(this);
    this.endSession = this.endSession.bind(this);
    this.getSessionId = this.getSessionId.bind(this);
  }

  attachGlobalErrorHandler() {
    window.addEventListener(
      'error',
      e => {
        this.errorHandler.onError(e, 'Global Boundary', state.lifecycle.writeKey.value);
      },
      true,
    );
  }

  /**
   * Start application lifecycle if not already started
   */
  load(writeKey: string, dataPlaneUrl: string, loadOptions: Partial<LoadOptions> = {}) {
    if (state.lifecycle.status.value) {
      return;
    }

    // Attach global error boundary handler
    this.attachGlobalErrorHandler();

    // Set initial state values
    batch(() => {
      state.lifecycle.writeKey.value = writeKey;
      state.lifecycle.dataPlaneUrl.value = dataPlaneUrl;
      state.loadOptions.value = normaliseLoadOptions(state.loadOptions.value, loadOptions);
      state.lifecycle.status.value = LifecycleStatus.Mounted;
    });

    // Expose state to global objects
    setExposedGlobal('state', state, writeKey);

    // Configure initial config of any services or components here
    // TODO

    // State application lifecycle
    this.startLifecycle();
  }

  // Start lifecycle methods
  /**
   * Orchestrate the lifecycle of the application phases/status
   */
  startLifecycle() {
    effect(() => {
      switch (state.lifecycle.status.value) {
        case LifecycleStatus.Mounted:
          this.prepareBrowserCapabilities();
          break;
        case LifecycleStatus.BrowserCapabilitiesReady:
          // initialize the preloaded events enqueuing
          retrievePreloadBufferEvents(this);
          this.prepareInternalServices();
          this.loadConfig();
          break;
        case LifecycleStatus.Configured:
          this.loadPlugins();
          break;
        case LifecycleStatus.PluginsLoading:
          break;
        case LifecycleStatus.PluginsReady:
          this.init();
          break;
        case LifecycleStatus.Initialized:
          this.onLoaded();
          break;
        case LifecycleStatus.Loaded:
          this.processBufferedEvents();
          this.loadIntegrations();
          break;
        case LifecycleStatus.IntegrationsLoading:
          break;
        case LifecycleStatus.IntegrationsReady:
          this.onReady();
          break;
        case LifecycleStatus.Ready:
          break;
        default:
          break;
      }
    });
  }

  /**
   * Load browser polyfill if required
   */
  prepareBrowserCapabilities() {
    this.capabilitiesManager.init();
  }

  /**
   * Enqueue in SDK preload buffer events, used from preloadBuffer component
   */
  enqueuePreloadBufferEvents(bufferedEvents: PreloadedEventCall[]) {
    if (Array.isArray(bufferedEvents)) {
      bufferedEvents.forEach(bufferedEvent => this.preloadBuffer.enqueue(bufferedEvent));
    }
  }

  /**
   * Process the buffer preloaded events by passing their arguments to the respective facade methods
   */
  processDataInPreloadBuffer() {
    while (this.preloadBuffer.size() > 0) {
      const eventToProcess = this.preloadBuffer.dequeue();

      if (eventToProcess) {
        consumePreloadBufferedEvent([...eventToProcess], this);
      }
    }
  }

  prepareInternalServices() {
    this.pluginsManager = new PluginsManager(defaultPluginEngine, this.errorHandler, this.logger);
    this.storeManager = new StoreManager(this.errorHandler, this.logger, this.pluginsManager);
    this.configManager = new ConfigManager(this.httpClient, this.errorHandler, this.logger);
    this.userSessionManager = new UserSessionManager(
      this.errorHandler,
      this.logger,
      this.pluginsManager,
    );
    this.eventRepository = new EventRepository(this.pluginsManager, this.errorHandler, this.logger);
    this.eventManager = new EventManager(
      this.eventRepository,
      this.userSessionManager,
      this.errorHandler,
      this.logger,
    );
  }

  /**
   * Load configuration
   */
  loadConfig() {
    if (!state.lifecycle.writeKey.value) {
      this.errorHandler.onError(new Error('No write key is provided'), 'Load configuration');
      return;
    }

    this.httpClient.setAuthHeader(state.lifecycle.writeKey.value);
    this.configManager?.init();
  }

  /**
   * Initialize the storage and event queue
   */
  init() {
    // Initialise storage
    this.storeManager?.init();
    this.clientDataStore = this.storeManager?.getStore('clientData') as Store;
    this.userSessionManager?.init(this.clientDataStore);

    // Initialize consent manager
    if (state.consents.activeConsentProviderPluginName.value) {
      this.pluginsManager?.invokeSingle(
        `consentManager.init`,
        state,
        this.pluginsManager,
        batch,
        this.logger,
      );
    }

    // Initialise event manager
    this.eventManager?.init();
  }

  /**
   * Load plugins
   */
  loadPlugins() {
    this.pluginsManager?.init();
    // TODO: are we going to enable custom plugins to be passed as load options?
    // registerCustomPlugins(state.loadOptions.value.customPlugins);
  }

  /**
   * Trigger onLoaded callback if any is provided in config
   */
  onLoaded() {
    // Set lifecycle state
    batch(() => {
      state.lifecycle.loaded.value = true;
      state.lifecycle.status.value = LifecycleStatus.Loaded;
    });

    // Process any preloaded events
    this.processDataInPreloadBuffer();

    // Execute onLoaded callback if provided in load options
    if (state.loadOptions.value.onLoaded && isFunction(state.loadOptions.value.onLoaded)) {
      state.loadOptions.value.onLoaded(this);
    }
  }

  /**
   * Consume preloaded events buffer
   */
  processBufferedEvents() {
    // Process buffered events
    state.eventBuffer.toBeProcessedArray.value.forEach((bufferedItem: BufferedEvent) => {
      const methodName = bufferedItem[0];
      if (isFunction((this as any)[methodName])) {
        (this as any)[methodName](...bufferedItem.slice(1));
      }
    });
    state.eventBuffer.toBeProcessedArray.value = [];
  }

  /**
   * Load device mode integrations
   */
  loadIntegrations() {
    // Set in state the desired activeIntegrations to inject in DOM
    const totalClientIntegrationsToLoad = this.pluginsManager?.invokeSingle(
      'nativeDestinations.setActiveIntegrations',
      state,
    );

    if (totalClientIntegrationsToLoad === 0) {
      state.lifecycle.status.value = LifecycleStatus.IntegrationsReady;
      return;
    }

    // Start loading native integration scripts and create instances
    state.lifecycle.status.value = LifecycleStatus.IntegrationsLoading;
    this.pluginsManager?.invokeSingle(
      'nativeDestinations.loadIntegrations',
      state,
      this.externalSrcLoader,
      this.logger,
    );

    // Progress to next lifecycle phase if all native integrations are initialised or failed
    effect(() => {
      const isAllIntegrationsReady =
        state.nativeDestinations.activeIntegrations.value.length === 0 ||
        Object.keys(state.nativeDestinations.initialisedIntegrations.value ?? {}).length +
          state.nativeDestinations.failedIntegrationScripts.value.length ===
          state.nativeDestinations.activeIntegrations.value.length;

      if (isAllIntegrationsReady) {
        batch(() => {
          state.lifecycle.status.value = LifecycleStatus.IntegrationsReady;
          state.nativeDestinations.clientIntegrationsReady.value = true;
        });
      }
    });
  }

  /**
   * Invoke the ready callbacks if any exist
   */
  // eslint-disable-next-line class-methods-use-this
  onReady() {
    state.eventBuffer.readyCallbacksArray.value.forEach(callback => callback());
    state.lifecycle.status.value = LifecycleStatus.Ready;
  }
  // End lifecycle methods

  // Start consumer exposed methods
  ready(callback: ApiCallback) {
    const type = 'ready';
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);

    if (!isFunction(callback)) {
      // TODO: handle error
      this.logger.error('ready callback is not a function');
      return;
    }

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, callback]);
      return;
    }

    /**
     * If integrations are loaded or no integration is available for loading
     * execute the callback immediately else push the callbacks to a queue that
     * will be executed after loading completes
     */
    if (state.lifecycle.status.value === LifecycleStatus.Ready) {
      callback();
    } else {
      state.eventBuffer.readyCallbacksArray.value.push(callback);
    }
  }

  page(payload: PageCallOptions) {
    const type = 'page';
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }

    this.eventManager?.addEvent({
      type: RudderEventType.Page,
      category: payload.category,
      name: payload.name,
      properties: payload.properties,
      options: payload.options,
      callback: payload.callback,
    });
  }

  track(payload: TrackCallOptions) {
    const type = 'track';
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }

    this.eventManager?.addEvent({
      type: RudderEventType.Track,
      name: payload.name,
      properties: payload.properties,
      options: payload.options,
      callback: payload.callback,
    });
  }

  identify(payload: IdentifyCallOptions) {
    const type = 'identify';
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }

    const shouldResetSession = Boolean(
      payload.userId && state.session.userId.value && payload.userId !== state.session.userId.value,
    );

    if (shouldResetSession) {
      this.reset();
    }

    this.userSessionManager?.setUserId(payload.userId);
    this.userSessionManager?.setUserTraits(payload.traits);

    this.eventManager?.addEvent({
      type: RudderEventType.Identify,
      userId: payload.userId,
      traits: payload.traits,
      options: payload.options,
      callback: payload.callback,
    });
  }

  alias(payload: AliasCallOptions) {
    const type = 'alias';
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }

    const previousId =
      payload.from ??
      this.userSessionManager?.getUserId() ??
      this.userSessionManager?.getAnonymousId();

    this.eventManager?.addEvent({
      type: RudderEventType.Alias,
      to: payload.to,
      from: previousId,
      options: payload.options,
      callback: payload.callback,
    });
  }

  group(payload: GroupCallOptions) {
    const type = 'group';
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }

    this.userSessionManager?.setGroupId(payload.groupId);
    this.userSessionManager?.setGroupTraits(payload.traits);

    this.eventManager?.addEvent({
      type: RudderEventType.Group,
      groupId: payload.groupId,
      traits: payload.traits,
      options: payload.options,
      callback: payload.callback,
    });
  }

  reset(resetAnonymousId?: boolean) {
    const type = 'reset';
    this.errorHandler.leaveBreadcrumb(`New ${type} event, resetAnonymousId: ${resetAnonymousId}`);

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, resetAnonymousId]);
      return;
    }

    this.userSessionManager?.reset(resetAnonymousId);
  }

  getAnonymousId(options?: AnonymousIdOptions): string | undefined {
    return this.userSessionManager?.getAnonymousId(options);
  }

  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string) {
    this.userSessionManager?.setAnonymousId(anonymousId, rudderAmpLinkerParam);
  }

  // eslint-disable-next-line class-methods-use-this
  getUserId(): Nullable<string> | undefined {
    return state.session.userId.value;
  }

  // eslint-disable-next-line class-methods-use-this
  getUserTraits(): Nullable<ApiObject> | undefined {
    return state.session.userTraits.value;
  }

  // eslint-disable-next-line class-methods-use-this
  getGroupId(): Nullable<string> | undefined {
    return state.session.groupId.value;
  }

  // eslint-disable-next-line class-methods-use-this
  getGroupTraits(): Nullable<ApiObject> | undefined {
    return state.session.groupTraits.value;
  }

  startSession(sessionId?: number) {
    this.userSessionManager?.start(sessionId);
  }

  endSession() {
    this.userSessionManager?.end();
  }

  // eslint-disable-next-line class-methods-use-this
  getSessionId(): Nullable<number> {
    this.userSessionManager?.refreshSession();
    return state.session.sessionInfo.value?.id ?? null;
  }
  // End consumer exposed methods
}

export { Analytics };
