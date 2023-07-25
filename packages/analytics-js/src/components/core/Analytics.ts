import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { defaultHttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { ExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader';
import { Store, StoreManager } from '@rudderstack/analytics-js/services/StoreManager';
import { batch, effect } from '@preact/signals-core';
import { state } from '@rudderstack/analytics-js/state';
import { ConfigManager } from '@rudderstack/analytics-js/components/configManager/ConfigManager';
import { ICapabilitiesManager } from '@rudderstack/analytics-js/components/capabilitiesManager/types';
import { CapabilitiesManager } from '@rudderstack/analytics-js/components/capabilitiesManager';
import { isFunction } from '@rudderstack/analytics-js-common/utilities/checks';
import { IEventManager } from '@rudderstack/analytics-js/components/eventManager/types';
import { EventManager } from '@rudderstack/analytics-js/components/eventManager';
import { UserSessionManager } from '@rudderstack/analytics-js/components/userSessionManager/UserSessionManager';
import { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { IUserSessionManager } from '@rudderstack/analytics-js/components/userSessionManager/types';
import { IConfigManager } from '@rudderstack/analytics-js/components/configManager/types';
import { setExposedGlobal } from '@rudderstack/analytics-js/components/utilities/globals';
import { normalizeLoadOptions } from '@rudderstack/analytics-js/components/utilities/loadOptions';
import {
  consumePreloadBufferedEvent,
  retrievePreloadBufferEvents,
} from '@rudderstack/analytics-js/components/preloadBuffer';
import { PreloadedEventCall } from '@rudderstack/analytics-js/components/preloadBuffer/types';
import { BufferQueue } from '@rudderstack/analytics-js/components/core/BufferQueue';
import { EventRepository } from '@rudderstack/analytics-js/components/eventRepository';
import { IEventRepository } from '@rudderstack/analytics-js/components/eventRepository/types';
import { clone } from 'ramda';
import { LifecycleStatus } from '@rudderstack/analytics-js-common/types/ApplicationLifecycle';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import {
  AnonymousIdOptions,
  LoadOptions,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import { ApiCallback, RudderEventType } from '@rudderstack/analytics-js-common/types/EventApi';
import { BufferedEvent } from '@rudderstack/analytics-js-common/types/Event';
import { isObjectAndNotNull } from '@rudderstack/analytics-js-common/utilities/object';
import {
  ADBLOCK_PAGE_CATEGORY,
  ADBLOCK_PAGE_NAME,
  ADBLOCK_PAGE_PATH,
} from '@rudderstack/analytics-js/constants/app';
import {
  LOAD_CONFIGURATION,
  READY_API,
} from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { READY_API_CALLBACK_ERROR } from '@rudderstack/analytics-js/constants/logMessages';
import {
  AliasCallOptions,
  GroupCallOptions,
  IdentifyCallOptions,
  PageCallOptions,
  TrackCallOptions,
} from '@rudderstack/analytics-js-common/utilities/eventMethodOverloads';
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

  /**
   * Start application lifecycle if not already started
   */
  load(
    writeKey: string,
    dataPlaneUrl?: string | Partial<LoadOptions>,
    loadOptions: Partial<LoadOptions> = {},
  ) {
    if (state.lifecycle.status.value) {
      return;
    }

    let clonedDataPlaneUrl = clone(dataPlaneUrl);
    let clonedLoadOptions = clone(loadOptions);

    // dataPlaneUrl is not provided
    if (isObjectAndNotNull(dataPlaneUrl)) {
      clonedLoadOptions = dataPlaneUrl as Partial<LoadOptions>;
      clonedDataPlaneUrl = undefined;
    }

    // Set initial state values
    batch(() => {
      state.lifecycle.writeKey.value = writeKey;
      state.lifecycle.dataPlaneUrl.value = clonedDataPlaneUrl as string | undefined;
      state.loadOptions.value = normalizeLoadOptions(state.loadOptions.value, clonedLoadOptions);
      state.lifecycle.status.value = LifecycleStatus.Mounted;
    });

    // Expose state to global objects
    setExposedGlobal('state', state, writeKey);

    // Configure initial config of any services or components here

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
          this.loadIntegrations();
          this.processBufferedEvents();
          break;
        case LifecycleStatus.DestinationsLoading:
          break;
        case LifecycleStatus.DestinationsReady:
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
      bufferedEvents.forEach(bufferedEvent => this.preloadBuffer.enqueue(clone(bufferedEvent)));
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
    this.storeManager = new StoreManager(this.pluginsManager, this.errorHandler, this.logger);
    this.configManager = new ConfigManager(this.httpClient, this.errorHandler, this.logger);
    this.userSessionManager = new UserSessionManager(
      this.errorHandler,
      this.logger,
      this.pluginsManager,
    );
    this.eventRepository = new EventRepository(
      this.pluginsManager,
      this.storeManager,
      this.errorHandler,
      this.logger,
    );
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
      this.errorHandler.onError(
        new Error('A write key is required to load the SDK. Please provide a valid write key.'),
        LOAD_CONFIGURATION,
      );
      return;
    }

    this.httpClient.setAuthHeader(state.lifecycle.writeKey.value);
    this.configManager?.init();
  }

  /**
   * Initialize the storage and event queue
   */
  init() {
    this.errorHandler.init(this.externalSrcLoader);

    // Initialize storage
    this.storeManager?.init();
    this.clientDataStore = this.storeManager?.getStore('clientData') as Store;
    this.userSessionManager?.init(this.clientDataStore);

    // Initialize consent manager
    if (state.consents.activeConsentManagerPluginName.value) {
      this.pluginsManager?.invokeSingle(
        `consentManager.init`,
        state,
        this.storeManager,
        this.logger,
      );
    }

    // Initialize event manager
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
    // Process any preloaded events
    this.processDataInPreloadBuffer();

    // Set lifecycle state
    batch(() => {
      state.lifecycle.loaded.value = true;
      state.lifecycle.status.value = LifecycleStatus.Loaded;
    });

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
    this.pluginsManager?.invokeSingle(
      'nativeDestinations.setActiveDestinations',
      state,
      this.pluginsManager,
      this.logger,
    );

    const totalDestinationsToLoad = state.nativeDestinations.activeDestinations.value.length;
    if (totalDestinationsToLoad === 0) {
      state.lifecycle.status.value = LifecycleStatus.DestinationsReady;
      return;
    }

    // Start loading native integration scripts and create instances
    state.lifecycle.status.value = LifecycleStatus.DestinationsLoading;
    this.pluginsManager?.invokeSingle(
      'nativeDestinations.load',
      state,
      this.externalSrcLoader,
      this.logger,
    );

    // Progress to next lifecycle phase if all native integrations are initialized or failed
    effect(() => {
      const areAllDestinationsReady =
        totalDestinationsToLoad === 0 ||
        state.nativeDestinations.initializedDestinations.value.length +
          state.nativeDestinations.failedDestinations.value.length ===
          totalDestinationsToLoad;

      if (areAllDestinationsReady) {
        batch(() => {
          state.lifecycle.status.value = LifecycleStatus.DestinationsReady;
          state.nativeDestinations.clientDestinationsReady.value = true;
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
    this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);

    if (!isFunction(callback)) {
      this.logger.error(READY_API_CALLBACK_ERROR(READY_API));
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

    // TODO: Maybe we should alter the behavior to send the ad-block page event even if the SDK is still loaded. It'll be pushed into the to be processed queue.

    // Send automatic ad blocked page event if adblockers are detected on the page
    if (
      state.capabilities.isAdBlocked.value === true &&
      payload.category !== ADBLOCK_PAGE_CATEGORY
    ) {
      const pageCallArgs = {
        category: ADBLOCK_PAGE_CATEGORY,
        name: ADBLOCK_PAGE_NAME,
        properties: {
          // 'title' is intentionally omitted as it does not make sense
          // in v3 implementation
          path: ADBLOCK_PAGE_PATH,
        },
        options: state.loadOptions.value.sendAdblockPageOptions,
      } as PageCallOptions;

      this.page(pageCallArgs);
    }
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
    this.errorHandler.leaveBreadcrumb(
      `New ${type} invocation, resetAnonymousId: ${resetAnonymousId}`,
    );

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
