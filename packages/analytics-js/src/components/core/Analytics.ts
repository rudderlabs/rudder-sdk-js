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
  ConsentOptions,
  LoadOptions,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import { ApiCallback } from '@rudderstack/analytics-js-common/types/EventApi';
import { BufferedEvent } from '@rudderstack/analytics-js-common/types/Event';
import { isObjectAndNotNull } from '@rudderstack/analytics-js-common/utilities/object';
import {
  ANALYTICS_CORE,
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
import { IAnalytics } from './IAnalytics';
import { getConsentManagementData, getValidPostConsentOptions } from '../utilities/consent';

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
      clonedLoadOptions = dataPlaneUrl;
      clonedDataPlaneUrl = undefined;
    }

    // Set initial state values
    batch(() => {
      state.lifecycle.writeKey.value = writeKey;
      state.lifecycle.dataPlaneUrl.value = clonedDataPlaneUrl as string | undefined;
      state.loadOptions.value = normalizeLoadOptions(state.loadOptions.value, clonedLoadOptions);
      state.lifecycle.status.value = 'mounted';
    });

    // set log level as early as possible
    if (state.loadOptions.value.logLevel) {
      this.logger?.setMinLogLevel(state.loadOptions.value.logLevel);
    }

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
          case 'mounted':
            this.prepareBrowserCapabilities();
            break;
          case 'browserCapabilitiesReady':
            // initialize the preloaded events enqueuing
            retrievePreloadBufferEvents(this);
            this.prepareInternalServices();
            this.loadConfig();
            break;
          case 'configured':
            this.loadPlugins();
            break;
          case 'pluginsLoading':
            break;
          case 'pluginsReady':
            this.init();
            break;
          case 'initialized':
            this.onInitialized();
            break;
          case 'loaded':
            this.onLoaded();
            break;
          case 'destinationsLoading':
            break;
          case 'destinationsReady':
            this.onDestinationsReady();
            break;
          case 'ready':
            this.onReady();
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

  private onLoaded() {
    this.processBufferedEvents();
    // Short-circuit the life cycle and move to the ready state if pre-consent behavior is enabled
    if (state.consents.preConsent.value.enabled === true) {
      state.lifecycle.status.value = 'ready';
    } else {
      this.loadDestinations();
    }
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
      this.storeManager,
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
    if (state.lifecycle.writeKey.value) {
      this.httpClient.setAuthHeader(state.lifecycle.writeKey.value);
    }

    this.configManager?.init();
  }

  /**
   * Initialize the storage and event queue
   */
  init() {
    this.errorHandler.init(this.externalSrcLoader);

    // Initialize storage
    this.storeManager?.init();
    this.userSessionManager?.init();

    // Initialize the appropriate consent manager plugin
    if (state.consents.enabled.value && !state.consents.initialized.value) {
      this.pluginsManager?.invokeSingle(`consentManager.init`, state, this.logger);

      if (state.consents.preConsent.value.enabled === false) {
        this.pluginsManager?.invokeSingle(
          `consentManager.updateConsentsInfo`,
          state,
          this.storeManager,
          this.logger,
        );
      }
    }

    // Initialize event manager
    this.eventManager?.init();

    // Mark the SDK as initialized
    state.lifecycle.status.value = 'initialized';
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
   * Trigger onLoaded callback if any is provided in config & emit initialised event
   */
  onInitialized() {
    // Process any preloaded events
    this.processDataInPreloadBuffer();

    // TODO: we need to avoid passing the window object to the callback function
    // as this will prevent us from supporting multiple SDK instances in the same page
    // Execute onLoaded callback if provided in load options
    if (isFunction(state.loadOptions.value.onLoaded)) {
      state.loadOptions.value.onLoaded((globalThis as typeof window).rudderanalytics);
    }

    // Set lifecycle state
    batch(() => {
      state.lifecycle.loaded.value = true;
      state.lifecycle.status.value = 'loaded';
    });

    this.initialized = true;

    // Emit an event to use as substitute to the onLoaded callback
    const initializedEvent = new CustomEvent('RSA_Initialised', {
      detail: { analyticsInstance: (globalThis as typeof window).rudderanalytics },
      bubbles: true,
      cancelable: true,
      composed: true,
    });

    (globalThis as typeof window).document.dispatchEvent(initializedEvent);
  }

  /**
   * Emit ready event
   */
  // eslint-disable-next-line class-methods-use-this
  onReady() {
    state.eventBuffer.readyCallbacksArray.value.forEach((callback: ApiCallback) => {
      try {
        callback();
      } catch (err) {
        this.errorHandler.onError(err, ANALYTICS_CORE, READY_CALLBACK_INVOKE_ERROR);
      }
    });

    // Emit an event to use as substitute to the ready callback
    const readyEvent = new CustomEvent('RSA_Ready', {
      detail: { analyticsInstance: (globalThis as typeof window).rudderanalytics },
      bubbles: true,
      cancelable: true,
      composed: true,
    });

    (globalThis as typeof window).document.dispatchEvent(readyEvent);
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
      this.errorHandler,
      this.logger,
    );

    const totalDestinationsToLoad = state.nativeDestinations.activeDestinations.value.length;
    if (totalDestinationsToLoad === 0) {
      state.lifecycle.status.value = 'destinationsReady';
      return;
    }

    // Start loading native integration scripts and create instances
    state.lifecycle.status.value = 'destinationsLoading';
    this.pluginsManager?.invokeSingle(
      'nativeDestinations.load',
      state,
      this.externalSrcLoader,
      this.errorHandler,
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
          state.lifecycle.status.value = 'destinationsReady';
          state.nativeDestinations.clientDestinationsReady.value = true;
        });
      }
    });
  }

  /**
   * Move to the ready state
   */
  // eslint-disable-next-line class-methods-use-this
  onDestinationsReady() {
    // May be do any destination specific actions here

    // Mark the ready status if not already done
    if (state.lifecycle.status.value !== 'ready') {
      state.lifecycle.status.value = 'ready';
    }
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
    if (state.lifecycle.status.value === 'ready') {
      try {
        callback();
      } catch (err) {
        this.errorHandler.onError(err, ANALYTICS_CORE, READY_CALLBACK_INVOKE_ERROR);
      }
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
      type: 'page',
      category: payload.category,
      name: payload.name,
      properties: payload.properties,
      options: payload.options,
      callback: payload.callback,
    });

    // TODO: Maybe we should alter the behavior to send the ad-block page event even if the SDK is still loaded. It'll be pushed into the to be processed queue.

    // Send automatic ad blocked page event if ad-blockers are detected on the page
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
      type,
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
      type,
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
      type,
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
      type,
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
    const sessionId = this.userSessionManager?.getSessionId();
    return sessionId ?? null;
  }

  consent(options?: ConsentOptions) {
    if (!state.consents.preConsent.value.enabled) {
      // TODO: Maybe log a warning here
      return;
    }

    batch(() => {
      state.consents.preConsent.value = { ...state.consents.preConsent.value, enabled: false };
      state.consents.postConsent.value = getValidPostConsentOptions(options);

      const { initialized, enabled, consentsData } = getConsentManagementData(
        state.consents.postConsent.value.consentManagement,
        this.logger,
      );

      state.consents.enabled.value = enabled || state.consents.enabled.value;
      state.consents.initialized.value = initialized || state.consents.initialized.value;
      state.consents.data.value = consentsData;
    });

    // Update consents data in state
    if (state.consents.enabled.value && !state.consents.initialized.value) {
      this.pluginsManager?.invokeSingle(
        `consentManager.updateConsentsInfo`,
        state,
        this.storeManager,
        this.logger,
      );
    }

    // TODO: Re-init store manager
    // this.storeManager?.initClientDataStores();

    // TODO: Re-init user session manager
    // this.userSessionManager?.syncStorageDataToState();

    // TODO: Re-init event manager
    // this.eventManager?.resume();
  }

  setAuthToken(token: string): void {
    this.userSessionManager?.setAuthToken(token);
  }
  // End consumer exposed methods
}

export { Analytics };
