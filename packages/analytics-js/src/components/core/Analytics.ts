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
import { isObjectAndNotNull } from '@rudderstack/analytics-js-common/utilities/object';
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
import { HttpClient } from '../../services/HttpClient';
import { defaultLogger } from '../../services/Logger';
import { defaultErrorHandler } from '../../services/ErrorHandler';
import { defaultPluginEngine } from '../../services/PluginEngine';
import { PluginsManager } from '../pluginsManager';
import { StoreManager } from '../../services/StoreManager';
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
import { READY_API_CALLBACK_ERROR, READY_CALLBACK_INVOKE_ERROR } from '../../constants/logMessages';
import type { IAnalytics } from './IAnalytics';
import { getConsentManagementData, getValidPostConsentOptions } from '../utilities/consent';
import { dispatchSDKEvent } from './utilities';

/*
 * Analytics class with lifecycle based on state ad user triggered events
 */
class Analytics implements IAnalytics {
  private_preloadBuffer: BufferQueue<PreloadedEventCall>;
  private_initialized: boolean;
  private_logger: ILogger;
  private_errorHandler: IErrorHandler;
  private_httpClient: IHttpClient;
  private_externalSrcLoader: IExternalSrcLoader;
  private_capabilitiesManager: ICapabilitiesManager;
  private_pluginsManager?: IPluginsManager;
  private_storeManager?: IStoreManager;
  private_configManager?: IConfigManager;
  private_eventRepository?: IEventRepository;
  private_eventManager?: IEventManager;
  private_userSessionManager?: IUserSessionManager;

  /**
   * Initialize services and components or use default ones if singletons
   */
  constructor() {
    this.private_logger = defaultLogger;
    this.private_httpClient = new HttpClient(this.private_logger);
    this.private_preloadBuffer = new BufferQueue();
    this.private_initialized = false;
    this.private_errorHandler = defaultErrorHandler;
    this.private_externalSrcLoader = new ExternalSrcLoader(
      this.private_errorHandler,
      this.private_logger,
    );
    this.private_capabilitiesManager = new CapabilitiesManager(
      this.private_httpClient,
      this.private_errorHandler,
      this.private_logger,
    );
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
      this.private_logger?.setMinLogLevel(state.loadOptions.value.logLevel);
    }

    // Expose state to global objects
    setExposedGlobal('state', state, writeKey);

    // Configure initial config of any services or components here

    // State application lifecycle
    this.private_startLifecycle();
  }

  // Start lifecycle methods
  /**
   * Orchestrate the lifecycle of the application phases/status
   */
  private_startLifecycle() {
    effect(() => {
      try {
        switch (state.lifecycle.status.value) {
          case 'mounted':
            this.private_onMounted();
            break;
          case 'browserCapabilitiesReady':
            this.private_onBrowserCapabilitiesReady();
            break;
          case 'configured':
            this.private_onConfigured();
            break;
          case 'pluginsLoading':
            break;
          case 'pluginsReady':
            this.private_onPluginsReady();
            break;
          case 'initialized':
            this.private_onInitialized();
            break;
          case 'loaded':
            this.private_onLoaded();
            break;
          case 'destinationsLoading':
            break;
          case 'destinationsReady':
            this.private_onDestinationsReady();
            break;
          case 'ready':
            this.private_onReady();
            break;
          case 'readyExecuted':
          default:
            break;
        }
      } catch (err) {
        const issue = 'Failed to load the SDK';
        this.private_errorHandler.onError(getMutatedError(err, issue), ANALYTICS_CORE);
      }
    });
  }

  private_onBrowserCapabilitiesReady() {
    // initialize the preloaded events enqueuing
    retrievePreloadBufferEvents(this);
    this.private_prepareInternalServices();
    this.private_loadConfig();
  }

  private_onLoaded() {
    this.private_processBufferedEvents();
    // Short-circuit the life cycle and move to the ready state if pre-consent behavior is enabled
    if (state.consents.preConsent.value.enabled === true) {
      state.lifecycle.status.value = 'ready';
    } else {
      this.private_loadDestinations();
    }
  }

  /**
   * Load browser polyfill if required
   */
  private_onMounted() {
    if (state.lifecycle.writeKey.value) {
      this.private_httpClient.setAuthHeader(state.lifecycle.writeKey.value);
    }

    this.private_capabilitiesManager.init(this.private_httpClient);
  }

  /**
   * Enqueue in SDK preload buffer events, used from preloadBuffer component
   */
  enqueuePreloadBufferEvents(bufferedEvents: PreloadedEventCall[]) {
    if (Array.isArray(bufferedEvents)) {
      bufferedEvents.forEach(bufferedEvent =>
        this.private_preloadBuffer.enqueue(clone(bufferedEvent)),
      );
    }
  }

  /**
   * Process the buffer preloaded events by passing their arguments to the respective facade methods
   */
  private_processDataInPreloadBuffer() {
    while (this.private_preloadBuffer.size() > 0) {
      const eventToProcess = this.private_preloadBuffer.dequeue();

      if (eventToProcess) {
        consumePreloadBufferedEvent([...eventToProcess], this);
      }
    }
  }

  private_prepareInternalServices() {
    this.private_pluginsManager = new PluginsManager(
      defaultPluginEngine,
      this.private_errorHandler,
      this.private_logger,
    );
    this.private_storeManager = new StoreManager(
      this.private_pluginsManager,
      this.private_errorHandler,
      this.private_logger,
    );
    this.private_configManager = new ConfigManager(
      this.private_httpClient,
      this.private_errorHandler,
      this.private_logger,
    );
    this.private_userSessionManager = new UserSessionManager(
      this.private_errorHandler,
      this.private_logger,
      this.private_pluginsManager,
      this.private_storeManager,
      this.private_httpClient,
    );
    this.private_eventRepository = new EventRepository(
      this.private_httpClient,
      this.private_pluginsManager,
      this.private_storeManager,
      this.private_errorHandler,
      this.private_logger,
    );
    this.private_eventManager = new EventManager(
      this.private_eventRepository,
      this.private_userSessionManager,
      this.private_errorHandler,
      this.private_logger,
    );
  }

  /**
   * Load configuration
   */
  private_loadConfig() {
    this.private_configManager?.init();
  }

  /**
   * Initialize the storage and event queue
   */
  private_onPluginsReady() {
    this.private_errorHandler.init(this.private_httpClient, this.private_externalSrcLoader);
    // Initialize storage
    this.private_storeManager?.init();
    this.private_userSessionManager?.init();

    // Initialize the appropriate consent manager plugin
    if (state.consents.enabled.value && !state.consents.initialized.value) {
      this.private_pluginsManager?.invokeSingle(`consentManager.init`, state, this.private_logger);

      if (state.consents.preConsent.value.enabled === false) {
        this.private_pluginsManager?.invokeSingle(
          `consentManager.updateConsentsInfo`,
          state,
          this.private_storeManager,
          this.private_logger,
        );
      }
    }

    // Initialize event manager
    this.private_eventManager?.init();

    // Mark the SDK as initialized
    state.lifecycle.status.value = 'initialized';
  }

  /**
   * Load plugins
   */
  private_onConfigured() {
    this.private_pluginsManager?.init();
    // TODO: are we going to enable custom plugins to be passed as load options?
    // registerCustomPlugins(state.loadOptions.value.customPlugins);
  }

  /**
   * Trigger onLoaded callback if any is provided in config & emit initialised event
   */
  private_onInitialized() {
    // Process any preloaded events
    this.private_processDataInPreloadBuffer();

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

    this.private_initialized = true;

    // Emit an event to use as substitute to the onLoaded callback
    dispatchSDKEvent('RSA_Initialised');
  }

  /**
   * Emit ready event
   */
  // eslint-disable-next-line class-methods-use-this
  private_onReady() {
    state.lifecycle.status.value = 'readyExecuted';
    state.eventBuffer.readyCallbacksArray.value.forEach((callback: ApiCallback) => {
      try {
        callback();
      } catch (err) {
        this.private_errorHandler.onError(err, ANALYTICS_CORE, READY_CALLBACK_INVOKE_ERROR);
      }
    });

    // Emit an event to use as substitute to the ready callback
    dispatchSDKEvent('RSA_Ready');
  }

  /**
   * Consume preloaded events buffer
   */
  private_processBufferedEvents() {
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
  private_loadDestinations() {
    if (state.nativeDestinations.clientDestinationsReady.value) {
      return;
    }

    // Set in state the desired activeDestinations to inject in DOM
    this.private_pluginsManager?.invokeSingle(
      'nativeDestinations.setActiveDestinations',
      state,
      this.private_pluginsManager,
      this.private_errorHandler,
      this.private_logger,
    );

    const totalDestinationsToLoad = state.nativeDestinations.activeDestinations.value.length;
    if (totalDestinationsToLoad === 0) {
      state.lifecycle.status.value = 'destinationsReady';
      return;
    }

    // Start loading native integration scripts and create instances
    state.lifecycle.status.value = 'destinationsLoading';
    this.private_pluginsManager?.invokeSingle(
      'nativeDestinations.load',
      state,
      this.private_externalSrcLoader,
      this.private_errorHandler,
      this.private_logger,
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
  private_onDestinationsReady() {
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

    this.private_errorHandler.leaveBreadcrumb(`New ${type} invocation`);

    if (!isFunction(callback)) {
      this.private_logger.error(READY_API_CALLBACK_ERROR(READY_API));
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
        this.private_errorHandler.onError(err, ANALYTICS_CORE, READY_CALLBACK_INVOKE_ERROR);
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

    this.private_errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;

    this.private_eventManager?.addEvent({
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

    this.private_errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;

    this.private_eventManager?.addEvent({
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

    this.private_errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;

    const shouldResetSession = Boolean(
      payload.userId && state.session.userId.value && payload.userId !== state.session.userId.value,
    );

    if (shouldResetSession) {
      this.reset();
    }

    // `null` value indicates that previous user ID needs to be retained
    if (!isNull(payload.userId)) {
      this.private_userSessionManager?.setUserId(payload.userId);
    }
    this.private_userSessionManager?.setUserTraits(payload.traits);

    this.private_eventManager?.addEvent({
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

    this.private_errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;

    const previousId =
      payload.from ??
      this.private_userSessionManager?.getUserId() ??
      this.private_userSessionManager?.getAnonymousId();

    this.private_eventManager?.addEvent({
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

    this.private_errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;

    // `null` value indicates that previous group ID needs to be retained
    if (!isNull(payload.groupId)) {
      this.private_userSessionManager?.setGroupId(payload.groupId);
    }

    this.private_userSessionManager?.setGroupTraits(payload.traits);

    this.private_eventManager?.addEvent({
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

    this.private_errorHandler.leaveBreadcrumb(
      `New ${type} invocation, resetAnonymousId: ${resetAnonymousId}`,
    );
    this.private_userSessionManager?.reset(resetAnonymousId);
  }

  getAnonymousId(options?: AnonymousIdOptions): string | undefined {
    return this.private_userSessionManager?.getAnonymousId(options);
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

    this.private_errorHandler.leaveBreadcrumb(`New ${type} invocation`);
    this.private_userSessionManager?.setAnonymousId(anonymousId, rudderAmpLinkerParam);
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

    this.private_errorHandler.leaveBreadcrumb(`New ${type} invocation`);
    this.private_userSessionManager?.start(sessionId);
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

    this.private_errorHandler.leaveBreadcrumb(`New ${type} invocation`);
    this.private_userSessionManager?.end();
  }

  // eslint-disable-next-line class-methods-use-this
  getSessionId(): Nullable<number> {
    const sessionId = this.private_userSessionManager?.getSessionId();
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

    this.private_errorHandler.leaveBreadcrumb(`New consent invocation`);

    batch(() => {
      state.consents.preConsent.value = { ...state.consents.preConsent.value, enabled: false };
      state.consents.postConsent.value = getValidPostConsentOptions(options);

      const { initialized, consentsData } = getConsentManagementData(
        state.consents.postConsent.value.consentManagement,
        this.private_logger,
      );

      state.consents.initialized.value = initialized || state.consents.initialized.value;
      state.consents.data.value = consentsData;
    });

    // Update consents data in state
    if (state.consents.enabled.value && !state.consents.initialized.value) {
      this.private_pluginsManager?.invokeSingle(
        `consentManager.updateConsentsInfo`,
        state,
        this.private_storeManager,
        this.private_logger,
      );
    }

    // Re-init store manager
    this.private_storeManager?.initializeStorageState();

    // Re-init user session manager
    this.private_userSessionManager?.syncStorageDataToState();

    // Resume event manager to process the events to destinations
    this.private_eventManager?.resume();

    this.private_loadDestinations();

    this.private_sendTrackingEvents(isBufferedInvocation);
  }

  private_sendTrackingEvents(isBufferedInvocation: boolean) {
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
    this.private_userSessionManager?.setAuthToken(token);
  }
  // End consumer exposed methods
}

export { Analytics };
