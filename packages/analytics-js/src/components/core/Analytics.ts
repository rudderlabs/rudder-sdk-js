import { ExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader';
import { batch, effect } from '@preact/signals-core';
import { isFunction, isNull } from '@rudderstack/analytics-js-common/utilities/checks';
import { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { clone } from 'ramda';
import { LifecycleStatus } from '@rudderstack/analytics-js-common/types/ApplicationLifecycle';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { getMutatedError } from '@rudderstack/analytics-js-common/utilities/errors';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import {
  AnonymousIdOptions,
  LoadOptions,
  OnLoadedCallback,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import { ApiCallback, RudderEventType } from '@rudderstack/analytics-js-common/types/EventApi';
import { BufferedEvent } from '@rudderstack/analytics-js-common/types/Event';
import { isObjectAndNotNull } from '@rudderstack/analytics-js-common/utilities/object';
import {
  ANALYTICS_CORE,
  LOAD_CONFIGURATION,
  READY_API,
} from '@rudderstack/analytics-js-common/constants/loggerContexts';
import {
  AliasCallOptions,
  GroupCallOptions,
  IdentifyCallOptions,
  PageCallOptions,
  TrackCallOptions,
} from '@rudderstack/analytics-js-common/utilities/eventMethodOverloads';
import { defaultLogger } from '../../services/Logger';
import { defaultErrorHandler } from '../../services/ErrorHandler';
import { defaultPluginEngine } from '../../services/PluginEngine';
import { PluginsManager } from '../pluginsManager';
import { defaultHttpClient } from '../../services/HttpClient';
import { Store, StoreManager } from '../../services/StoreManager';
import { state } from '../../state';
import { ConfigManager } from '../configManager/ConfigManager';
import { ICapabilitiesManager } from '../capabilitiesManager/types';
import { CapabilitiesManager } from '../capabilitiesManager';
import { IEventManager } from '../eventManager/types';
import { EventManager } from '../eventManager';
import { UserSessionManager } from '../userSessionManager/UserSessionManager';
import { IUserSessionManager } from '../userSessionManager/types';
import { IConfigManager } from '../configManager/types';
import { setExposedGlobal } from '../utilities/globals';
import { normalizeLoadOptions } from '../utilities/loadOptions';
import { consumePreloadBufferedEvent, retrievePreloadBufferEvents } from '../preloadBuffer';
import { PreloadedEventCall } from '../preloadBuffer/types';
import { BufferQueue } from './BufferQueue';
import { EventRepository } from '../eventRepository';
import { IEventRepository } from '../eventRepository/types';
import { ADBLOCK_PAGE_CATEGORY, ADBLOCK_PAGE_NAME, ADBLOCK_PAGE_PATH } from '../../constants/app';
import { READY_API_CALLBACK_ERROR, READY_CALLBACK_INVOKE_ERROR } from '../../constants/logMessages';
import { CLIENT_DATA_STORE_NAME } from '../../constants/storage';
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
    this.onInitialized = this.onInitialized.bind(this);
    this.processBufferedEvents = this.processBufferedEvents.bind(this);
    this.loadDestinations = this.loadDestinations.bind(this);
    this.onDestinationsReady = this.onDestinationsReady.bind(this);
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
      try {
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
            this.onInitialized();
            break;
          case LifecycleStatus.Loaded:
            this.loadDestinations();
            this.processBufferedEvents();
            break;
          case LifecycleStatus.DestinationsLoading:
            break;
          case LifecycleStatus.DestinationsReady:
            this.onDestinationsReady();
            break;
          case LifecycleStatus.Ready:
            break;
          default:
            break;
        }
      } catch (err) {
        const issue = 'Failed to load the SDK';
        this.errorHandler.onError(getMutatedError(err, issue), ANALYTICS_CORE);
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
    this.clientDataStore = this.storeManager?.getStore(CLIENT_DATA_STORE_NAME) as Store | undefined;
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

    // Mark the SDK as initialized
    state.lifecycle.status.value = LifecycleStatus.Initialized;
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
  onInitialized() {
    // Process any preloaded events
    this.processDataInPreloadBuffer();

    // TODO: we need to avoid passing the window object to the callback function
    // as this will prevent us from supporting multiple SDK instances in the same page
    // Execute onLoaded callback if provided in load options
    if (isFunction(state.loadOptions.value.onLoaded)) {
      (state.loadOptions.value.onLoaded as OnLoadedCallback)((globalThis as any).rudderanalytics);
    }

    // Set lifecycle state
    batch(() => {
      state.lifecycle.loaded.value = true;
      state.lifecycle.status.value = LifecycleStatus.Loaded;
    });

    this.initialized = true;
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
   * Load device mode destinations
   */
  loadDestinations() {
    // Set in state the desired activeDestinations to inject in DOM
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

    // Progress to next lifecycle phase if all native destinations are initialized or failed
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
  onDestinationsReady() {
    state.eventBuffer.readyCallbacksArray.value.forEach(callback => {
      try {
        callback();
      } catch (err) {
        this.logger.error(READY_CALLBACK_INVOKE_ERROR(ANALYTICS_CORE), err);
      }
    });
    state.lifecycle.status.value = LifecycleStatus.Ready;
  }
  // End lifecycle methods

  // Start consumer exposed methods
  ready(callback: ApiCallback) {
    const type = 'ready';
    this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, callback]);
      return;
    }

    if (!isFunction(callback)) {
      this.logger.error(READY_API_CALLBACK_ERROR(READY_API));
      return;
    }

    /**
     * If destinations are loaded or no integration is available for loading
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
    // Check page category to avoid infinite loop
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
      name: payload.name || undefined,
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

    // `null` value indicates that previous user ID needs to be retained
    if (!isNull(payload.userId)) {
      this.userSessionManager?.setUserId(payload.userId);
    }
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

    // `null` value indicates that previous group ID needs to be retained
    if (!isNull(payload.groupId)) {
      this.userSessionManager?.setGroupId(payload.groupId);
    }

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

  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string): void {
    const type = 'setAnonymousId';
    // Buffering is needed as setting the anonymous ID may require invoking the GoogleLinker plugin
    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, anonymousId, rudderAmpLinkerParam]);
      return;
    }

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

  startSession(sessionId?: number): void {
    const type = 'startSession';
    this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, sessionId]);
      return;
    }

    this.userSessionManager?.start(sessionId);
  }

  endSession(): void {
    const type = 'endSession';
    this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type]);
      return;
    }

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
