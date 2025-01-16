/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader';
import { batch, effect } from '@preact/signals-core';
import { isFunction, isNull } from '@rudderstack/analytics-js-common/utilities/checks';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { clone } from 'ramda';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { getMutatedError } from '@rudderstack/analytics-js-common/utilities/errors';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import type {
  AnonymousIdOptions,
  ConsentOptions,
  LoadOptions,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { ApiCallback } from '@rudderstack/analytics-js-common/types/EventApi';
import {
  ANALYTICS_CORE,
  READY_API,
} from '@rudderstack/analytics-js-common/constants/loggerContexts';
import {
  pageArgumentsToCallOptions,
  type AliasCallOptions,
  type GroupCallOptions,
  type IdentifyCallOptions,
  type PageCallOptions,
  type TrackCallOptions,
  trackArgumentsToCallOptions,
} from '@rudderstack/analytics-js-common/utilities/eventMethodOverloads';
import { BufferQueue } from '@rudderstack/analytics-js-common/services/BufferQueue/BufferQueue';
import { POST_LOAD_LOG_LEVEL, defaultLogger } from '../../services/Logger';
import { defaultErrorHandler } from '../../services/ErrorHandler';
import { defaultPluginEngine } from '../../services/PluginEngine';
import { PluginsManager } from '../pluginsManager';
import { defaultHttpClient } from '../../services/HttpClient';
import { type Store, StoreManager } from '../../services/StoreManager';
import { state } from '../../state';
import { ConfigManager } from '../configManager/ConfigManager';
import type { ICapabilitiesManager } from '../capabilitiesManager/types';
import { CapabilitiesManager } from '../capabilitiesManager';
import type { IEventManager } from '../eventManager/types';
import { EventManager } from '../eventManager';
import { UserSessionManager } from '../userSessionManager/UserSessionManager';
import type { IUserSessionManager } from '../userSessionManager/types';
import type { IConfigManager } from '../configManager/types';
import { setExposedGlobal } from '../utilities/globals';
import { normalizeLoadOptions } from '../utilities/loadOptions';
import { consumePreloadBufferedEvent, retrievePreloadBufferEvents } from '../preloadBuffer';
import type { PreloadedEventCall } from '../preloadBuffer/types';
import { EventRepository } from '../eventRepository';
import type { IEventRepository } from '../eventRepository/types';
import {
  ADBLOCK_PAGE_CATEGORY,
  ADBLOCK_PAGE_NAME,
  ADBLOCK_PAGE_PATH,
  CONSENT_TRACK_EVENT_NAME,
} from '../../constants/app';
import {
  DATA_PLANE_URL_VALIDATION_ERROR,
  READY_API_CALLBACK_ERROR,
  READY_CALLBACK_INVOKE_ERROR,
  WRITE_KEY_VALIDATION_ERROR,
} from '../../constants/logMessages';
import type { IAnalytics } from './IAnalytics';
import { getConsentManagementData, getValidPostConsentOptions } from '../utilities/consent';
import { dispatchSDKEvent, isDataPlaneUrlValid, isWriteKeyValid } from './utilities';

/*
 * Analytics class with lifecycle based on state ad user triggered events
 */
class Analytics implements IAnalytics {
  preloadBuffer: BufferQueue<PreloadedEventCall>;
  initialized: boolean;
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
    this.preloadBuffer = new BufferQueue();
    this.initialized = false;
    this.errorHandler = defaultErrorHandler;
    this.logger = defaultLogger;
    this.externalSrcLoader = new ExternalSrcLoader(this.errorHandler, this.logger);
    this.capabilitiesManager = new CapabilitiesManager(this.errorHandler, this.logger);
    this.httpClient = defaultHttpClient;
  }

  /**
   * Start application lifecycle if not already started
   */
  load(writeKey: string, dataPlaneUrl: string, loadOptions: Partial<LoadOptions> = {}) {
    if (state.lifecycle.status.value) {
      return;
    }

    if (!isWriteKeyValid(writeKey)) {
      this.logger.error(WRITE_KEY_VALIDATION_ERROR(ANALYTICS_CORE, writeKey));
      return;
    }

    if (!isDataPlaneUrlValid(dataPlaneUrl)) {
      this.logger.error(DATA_PLANE_URL_VALIDATION_ERROR(ANALYTICS_CORE, dataPlaneUrl));
      return;
    }

    // Set initial state values
    batch(() => {
      state.lifecycle.writeKey.value = clone(writeKey);
      state.lifecycle.dataPlaneUrl.value = clone(dataPlaneUrl);
      state.loadOptions.value = normalizeLoadOptions(state.loadOptions.value, loadOptions);
      state.lifecycle.status.value = 'mounted';
    });

    // set log level as early as possible
    this.logger?.setMinLogLevel(state.loadOptions.value.logLevel ?? POST_LOAD_LOG_LEVEL);

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
            this.onMounted();
            break;
          case 'browserCapabilitiesReady':
            this.onBrowserCapabilitiesReady();
            break;
          case 'configured':
            this.onConfigured();
            break;
          case 'pluginsLoading':
            break;
          case 'pluginsReady':
            this.onPluginsReady();
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
          case 'readyExecuted':
          default:
            break;
        }
      } catch (err) {
        const issue = 'Failed to load the SDK';
        this.errorHandler.onError(getMutatedError(err, issue), ANALYTICS_CORE);
      }
    });
  }

  onBrowserCapabilitiesReady() {
    // initialize the preloaded events enqueuing
    retrievePreloadBufferEvents(this);
    this.prepareInternalServices();
    this.loadConfig();
  }

  onLoaded() {
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
  onMounted() {
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
      this.httpClient,
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
  onPluginsReady() {
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
  onConfigured() {
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
    dispatchSDKEvent('RSA_Initialised');
  }

  /**
   * Emit ready event
   */
  // eslint-disable-next-line class-methods-use-this
  onReady() {
    state.lifecycle.status.value = 'readyExecuted';
    state.eventBuffer.readyCallbacksArray.value.forEach((callback: ApiCallback) => {
      try {
        callback();
      } catch (err) {
        this.errorHandler.onError(err, ANALYTICS_CORE, READY_CALLBACK_INVOKE_ERROR);
      }
    });

    // Emit an event to use as substitute to the ready callback
    dispatchSDKEvent('RSA_Ready');
  }

  /**
   * Consume preloaded events buffer
   */
  processBufferedEvents() {
    // This logic has been intentionally implemented without a simple
    // for-loop as the individual events that are processed may
    // add more events to the buffer (this is needed for the consent API)
    let bufferedEvents = state.eventBuffer.toBeProcessedArray.value;
    while (bufferedEvents.length > 0) {
      const bufferedEvent = bufferedEvents.shift();
      state.eventBuffer.toBeProcessedArray.value = bufferedEvents;

      if (bufferedEvent) {
        const methodName = bufferedEvent[0];
        if (isFunction((this as any)[methodName])) {
          // Send additional arg 'true' to indicate that this is a buffered invocation
          (this as any)[methodName](...bufferedEvent.slice(1), true);
        }
      }

      bufferedEvents = state.eventBuffer.toBeProcessedArray.value;
    }
  }

  /**
   * Load device mode destinations
   */
  loadDestinations() {
    if (state.nativeDestinations.clientDestinationsReady.value) {
      return;
    }

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
  ready(callback: ApiCallback, isBufferedInvocation = false) {
    const type = 'ready';

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value = [
        ...state.eventBuffer.toBeProcessedArray.value,
        [type, callback],
      ];
      return;
    }

    this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);

    if (!isFunction(callback)) {
      this.logger.error(READY_API_CALLBACK_ERROR(READY_API));
      return;
    }

    /**
     * If destinations are loaded or no integration is available for loading
     * execute the callback immediately else push the callbacks to a queue that
     * will be executed after loading completes
     */
    if (state.lifecycle.status.value === 'readyExecuted') {
      try {
        callback();
      } catch (err) {
        this.errorHandler.onError(err, ANALYTICS_CORE, READY_CALLBACK_INVOKE_ERROR);
      }
    } else {
      state.eventBuffer.readyCallbacksArray.value = [
        ...state.eventBuffer.readyCallbacksArray.value,
        callback,
      ];
    }
  }

  page(payload: PageCallOptions, isBufferedInvocation = false) {
    const type = 'page';

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value = [
        ...state.eventBuffer.toBeProcessedArray.value,
        [type, payload],
      ];
      return;
    }

    this.errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;

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
      this.page(
        pageArgumentsToCallOptions(
          ADBLOCK_PAGE_CATEGORY,
          ADBLOCK_PAGE_NAME,
          {
            // 'title' is intentionally omitted as it does not make sense
            // in v3 implementation
            path: ADBLOCK_PAGE_PATH,
          },
          state.loadOptions.value.sendAdblockPageOptions,
        ),
      );
    }
  }

  track(payload: TrackCallOptions, isBufferedInvocation = false) {
    const type = 'track';

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value = [
        ...state.eventBuffer.toBeProcessedArray.value,
        [type, payload],
      ];
      return;
    }

    this.errorHandler.leaveBreadcrumb(`New ${type} event - ${payload.name}`);
    state.metrics.triggered.value += 1;

    this.eventManager?.addEvent({
      type,
      name: payload.name || undefined,
      properties: payload.properties,
      options: payload.options,
      callback: payload.callback,
    });
  }

  identify(payload: IdentifyCallOptions, isBufferedInvocation = false) {
    const type = 'identify';

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value = [
        ...state.eventBuffer.toBeProcessedArray.value,
        [type, payload],
      ];
      return;
    }

    this.errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;

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

  alias(payload: AliasCallOptions, isBufferedInvocation = false) {
    const type = 'alias';

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value = [
        ...state.eventBuffer.toBeProcessedArray.value,
        [type, payload],
      ];
      return;
    }

    this.errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;

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

  group(payload: GroupCallOptions, isBufferedInvocation = false) {
    const type = 'group';

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value = [
        ...state.eventBuffer.toBeProcessedArray.value,
        [type, payload],
      ];
      return;
    }

    this.errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;

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

  reset(resetAnonymousId?: boolean, isBufferedInvocation = false) {
    const type = 'reset';

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value = [
        ...state.eventBuffer.toBeProcessedArray.value,
        [type, resetAnonymousId],
      ];
      return;
    }

    this.errorHandler.leaveBreadcrumb(
      `New ${type} invocation, resetAnonymousId: ${resetAnonymousId}`,
    );
    this.userSessionManager?.reset(resetAnonymousId);
  }

  getAnonymousId(options?: AnonymousIdOptions): string | undefined {
    return this.userSessionManager?.getAnonymousId(options);
  }

  setAnonymousId(
    anonymousId?: string,
    rudderAmpLinkerParam?: string,
    isBufferedInvocation = false,
  ): void {
    const type = 'setAnonymousId';
    // Buffering is needed as setting the anonymous ID may require invoking the GoogleLinker plugin
    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value = [
        ...state.eventBuffer.toBeProcessedArray.value,
        [type, anonymousId, rudderAmpLinkerParam],
      ];
      return;
    }

    this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);
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

  startSession(sessionId?: number, isBufferedInvocation = false): void {
    const type = 'startSession';

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value = [
        ...state.eventBuffer.toBeProcessedArray.value,
        [type, sessionId],
      ];
      return;
    }

    this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);
    this.userSessionManager?.start(sessionId);
  }

  endSession(isBufferedInvocation = false): void {
    const type = 'endSession';

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value = [
        ...state.eventBuffer.toBeProcessedArray.value,
        [type],
      ];
      return;
    }

    this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);
    this.userSessionManager?.end();
  }

  // eslint-disable-next-line class-methods-use-this
  getSessionId(): Nullable<number> {
    const sessionId = this.userSessionManager?.getSessionId();
    return sessionId ?? null;
  }

  consent(options?: ConsentOptions, isBufferedInvocation = false) {
    const type = 'consent';

    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value = [
        ...state.eventBuffer.toBeProcessedArray.value,
        [type, options],
      ];
      return;
    }

    this.errorHandler.leaveBreadcrumb(`New consent invocation`);

    batch(() => {
      state.consents.preConsent.value = { ...state.consents.preConsent.value, enabled: false };
      state.consents.postConsent.value = getValidPostConsentOptions(options);

      const { initialized, consentsData } = getConsentManagementData(
        state.consents.postConsent.value.consentManagement,
        this.logger,
      );

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

    // Re-init store manager
    this.storeManager?.initializeStorageState();

    // Re-init user session manager
    this.userSessionManager?.syncStorageDataToState();

    // Resume event manager to process the events to destinations
    this.eventManager?.resume();

    this.loadDestinations();

    this.sendTrackingEvents(isBufferedInvocation);
  }

  sendTrackingEvents(isBufferedInvocation: boolean) {
    // If isBufferedInvocation is true, then the tracking events will be added to the end of the
    // events buffer array so that any other preload events (mainly from query string API) will be processed first.
    if (state.consents.postConsent.value.trackConsent) {
      const trackOptions = trackArgumentsToCallOptions(CONSENT_TRACK_EVENT_NAME);
      if (isBufferedInvocation) {
        state.eventBuffer.toBeProcessedArray.value = [
          ...state.eventBuffer.toBeProcessedArray.value,
          ['track', trackOptions],
        ];
      } else {
        this.track(trackOptions);
      }
    }

    if (state.consents.postConsent.value.sendPageEvent) {
      const pageOptions = pageArgumentsToCallOptions();
      if (isBufferedInvocation) {
        state.eventBuffer.toBeProcessedArray.value = [
          ...state.eventBuffer.toBeProcessedArray.value,
          ['page', pageOptions],
        ];
      } else {
        this.page(pageOptions);
      }
    }
  }

  setAuthToken(token: string): void {
    this.userSessionManager?.setAuthToken(token);
  }
  // End consumer exposed methods
}

export { Analytics };
