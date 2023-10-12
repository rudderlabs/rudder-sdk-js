import { ExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader';
import { batch, effect } from '@preact/signals-core';
import { isFunction, isNull } from '@rudderstack/analytics-js-common/utilities/checks';
import { clone } from 'ramda';
import { getMutatedError } from '@rudderstack/analytics-js-common/utilities/errors';
import { isObjectAndNotNull } from '@rudderstack/analytics-js-common/utilities/object';
import {
  ANALYTICS_CORE,
  LOAD_CONFIGURATION,
  READY_API,
} from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { defaultLogger } from '../../services/Logger';
import { defaultErrorHandler } from '../../services/ErrorHandler';
import { defaultPluginEngine } from '../../services/PluginEngine';
import { PluginsManager } from '../pluginsManager';
import { defaultHttpClient } from '../../services/HttpClient';
import { StoreManager } from '../../services/StoreManager';
import { state } from '../../state';
import { ConfigManager } from '../configManager/ConfigManager';
import { CapabilitiesManager } from '../capabilitiesManager';
import { EventManager } from '../eventManager';
import { UserSessionManager } from '../userSessionManager/UserSessionManager';
import { setExposedGlobal } from '../utilities/globals';
import { normalizeLoadOptions } from '../utilities/loadOptions';
import { consumePreloadBufferedEvent, retrievePreloadBufferEvents } from '../preloadBuffer';
import { BufferQueue } from './BufferQueue';
import { EventRepository } from '../eventRepository';
import { ADBLOCK_PAGE_CATEGORY, ADBLOCK_PAGE_NAME, ADBLOCK_PAGE_PATH } from '../../constants/app';
import { READY_API_CALLBACK_ERROR, READY_CALLBACK_INVOKE_ERROR } from '../../constants/logMessages';
/*
 * Analytics class with lifecycle based on state ad user triggered events
 */
class Analytics {
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
  load(writeKey, dataPlaneUrl, loadOptions = {}) {
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
      state.lifecycle.dataPlaneUrl.value = clonedDataPlaneUrl;
      state.loadOptions.value = normalizeLoadOptions(state.loadOptions.value, clonedLoadOptions);
      state.lifecycle.status.value = 'mounted';
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
            this.loadDestinations();
            this.processBufferedEvents();
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
  /**
   * Load browser polyfill if required
   */
  prepareBrowserCapabilities() {
    this.capabilitiesManager.init();
  }
  /**
   * Enqueue in SDK preload buffer events, used from preloadBuffer component
   */
  enqueuePreloadBufferEvents(bufferedEvents) {
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
    var _a;
    if (!state.lifecycle.writeKey.value) {
      this.errorHandler.onError(
        new Error('A write key is required to load the SDK. Please provide a valid write key.'),
        LOAD_CONFIGURATION,
      );
      return;
    }
    this.httpClient.setAuthHeader(state.lifecycle.writeKey.value);
    (_a = this.configManager) === null || _a === void 0 ? void 0 : _a.init();
  }
  /**
   * Initialize the storage and event queue
   */
  init() {
    var _a, _b, _c, _d;
    this.errorHandler.init(this.externalSrcLoader);
    // Initialize storage
    (_a = this.storeManager) === null || _a === void 0 ? void 0 : _a.init();
    (_b = this.userSessionManager) === null || _b === void 0 ? void 0 : _b.init();
    // Initialize consent manager
    if (state.consents.activeConsentManagerPluginName.value) {
      (_c = this.pluginsManager) === null || _c === void 0
        ? void 0
        : _c.invokeSingle(`consentManager.init`, state, this.storeManager, this.logger);
    }
    // Initialize event manager
    (_d = this.eventManager) === null || _d === void 0 ? void 0 : _d.init();
    // Mark the SDK as initialized
    state.lifecycle.status.value = 'initialized';
  }
  /**
   * Load plugins
   */
  loadPlugins() {
    var _a;
    (_a = this.pluginsManager) === null || _a === void 0 ? void 0 : _a.init();
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
      state.loadOptions.value.onLoaded(globalThis.rudderanalytics);
    }
    // Set lifecycle state
    batch(() => {
      state.lifecycle.loaded.value = true;
      state.lifecycle.status.value = 'loaded';
    });
    this.initialized = true;
    // Emit an event to use as substitute to the onLoaded callback
    const initializedEvent = new CustomEvent('RSA_Initialised', {
      detail: { analyticsInstance: globalThis.rudderanalytics },
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    globalThis.document.dispatchEvent(initializedEvent);
  }
  /**
   * Emit ready event
   */
  // eslint-disable-next-line class-methods-use-this
  onReady() {
    // Emit an event to use as substitute to the ready callback
    const readyEvent = new CustomEvent('RSA_Ready', {
      detail: { analyticsInstance: globalThis.rudderanalytics },
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    globalThis.document.dispatchEvent(readyEvent);
  }
  /**
   * Consume preloaded events buffer
   */
  processBufferedEvents() {
    // Process buffered events
    state.eventBuffer.toBeProcessedArray.value.forEach(bufferedItem => {
      const methodName = bufferedItem[0];
      if (isFunction(this[methodName])) {
        this[methodName](...bufferedItem.slice(1));
      }
    });
    state.eventBuffer.toBeProcessedArray.value = [];
  }
  /**
   * Load device mode destinations
   */
  loadDestinations() {
    var _a, _b;
    // Set in state the desired activeDestinations to inject in DOM
    (_a = this.pluginsManager) === null || _a === void 0
      ? void 0
      : _a.invokeSingle(
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
    (_b = this.pluginsManager) === null || _b === void 0
      ? void 0
      : _b.invokeSingle(
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
   * Invoke the ready callbacks if any exist
   */
  // eslint-disable-next-line class-methods-use-this
  onDestinationsReady() {
    state.eventBuffer.readyCallbacksArray.value.forEach(callback => {
      try {
        callback();
      } catch (err) {
        this.errorHandler.onError(err, ANALYTICS_CORE, READY_CALLBACK_INVOKE_ERROR);
      }
    });
    state.lifecycle.status.value = 'ready';
  }
  // End lifecycle methods
  // Start consumer exposed methods
  ready(callback) {
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
  page(payload) {
    var _a;
    const type = 'page';
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;
    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }
    (_a = this.eventManager) === null || _a === void 0
      ? void 0
      : _a.addEvent({
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
      };
      this.page(pageCallArgs);
    }
  }
  track(payload) {
    var _a;
    const type = 'track';
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;
    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }
    (_a = this.eventManager) === null || _a === void 0
      ? void 0
      : _a.addEvent({
          type,
          name: payload.name || undefined,
          properties: payload.properties,
          options: payload.options,
          callback: payload.callback,
        });
  }
  identify(payload) {
    var _a, _b, _c;
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
      (_a = this.userSessionManager) === null || _a === void 0
        ? void 0
        : _a.setUserId(payload.userId);
    }
    (_b = this.userSessionManager) === null || _b === void 0
      ? void 0
      : _b.setUserTraits(payload.traits);
    (_c = this.eventManager) === null || _c === void 0
      ? void 0
      : _c.addEvent({
          type,
          userId: payload.userId,
          traits: payload.traits,
          options: payload.options,
          callback: payload.callback,
        });
  }
  alias(payload) {
    var _a, _b, _c, _d, _e;
    const type = 'alias';
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;
    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }
    const previousId =
      (_c =
        (_a = payload.from) !== null && _a !== void 0
          ? _a
          : (_b = this.userSessionManager) === null || _b === void 0
          ? void 0
          : _b.getUserId()) !== null && _c !== void 0
        ? _c
        : (_d = this.userSessionManager) === null || _d === void 0
        ? void 0
        : _d.getAnonymousId();
    (_e = this.eventManager) === null || _e === void 0
      ? void 0
      : _e.addEvent({
          type,
          to: payload.to,
          from: previousId,
          options: payload.options,
          callback: payload.callback,
        });
  }
  group(payload) {
    var _a, _b, _c;
    const type = 'group';
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);
    state.metrics.triggered.value += 1;
    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }
    // `null` value indicates that previous group ID needs to be retained
    if (!isNull(payload.groupId)) {
      (_a = this.userSessionManager) === null || _a === void 0
        ? void 0
        : _a.setGroupId(payload.groupId);
    }
    (_b = this.userSessionManager) === null || _b === void 0
      ? void 0
      : _b.setGroupTraits(payload.traits);
    (_c = this.eventManager) === null || _c === void 0
      ? void 0
      : _c.addEvent({
          type,
          groupId: payload.groupId,
          traits: payload.traits,
          options: payload.options,
          callback: payload.callback,
        });
  }
  reset(resetAnonymousId) {
    var _a;
    const type = 'reset';
    this.errorHandler.leaveBreadcrumb(
      `New ${type} invocation, resetAnonymousId: ${resetAnonymousId}`,
    );
    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, resetAnonymousId]);
      return;
    }
    (_a = this.userSessionManager) === null || _a === void 0 ? void 0 : _a.reset(resetAnonymousId);
  }
  getAnonymousId(options) {
    var _a;
    return (_a = this.userSessionManager) === null || _a === void 0
      ? void 0
      : _a.getAnonymousId(options);
  }
  setAnonymousId(anonymousId, rudderAmpLinkerParam) {
    var _a;
    const type = 'setAnonymousId';
    // Buffering is needed as setting the anonymous ID may require invoking the GoogleLinker plugin
    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, anonymousId, rudderAmpLinkerParam]);
      return;
    }
    (_a = this.userSessionManager) === null || _a === void 0
      ? void 0
      : _a.setAnonymousId(anonymousId, rudderAmpLinkerParam);
  }
  // eslint-disable-next-line class-methods-use-this
  getUserId() {
    return state.session.userId.value;
  }
  // eslint-disable-next-line class-methods-use-this
  getUserTraits() {
    return state.session.userTraits.value;
  }
  // eslint-disable-next-line class-methods-use-this
  getGroupId() {
    return state.session.groupId.value;
  }
  // eslint-disable-next-line class-methods-use-this
  getGroupTraits() {
    return state.session.groupTraits.value;
  }
  startSession(sessionId) {
    var _a;
    const type = 'startSession';
    this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);
    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type, sessionId]);
      return;
    }
    (_a = this.userSessionManager) === null || _a === void 0 ? void 0 : _a.start(sessionId);
  }
  endSession() {
    var _a;
    const type = 'endSession';
    this.errorHandler.leaveBreadcrumb(`New ${type} invocation`);
    if (!state.lifecycle.loaded.value) {
      state.eventBuffer.toBeProcessedArray.value.push([type]);
      return;
    }
    (_a = this.userSessionManager) === null || _a === void 0 ? void 0 : _a.end();
  }
  // eslint-disable-next-line class-methods-use-this
  getSessionId() {
    var _a;
    const sessionId =
      (_a = this.userSessionManager) === null || _a === void 0 ? void 0 : _a.getSessionId();
    return sessionId !== null && sessionId !== void 0 ? sessionId : null;
  }
  setAuthToken(token) {
    var _a;
    (_a = this.userSessionManager) === null || _a === void 0 ? void 0 : _a.setAuthToken(token);
  }
}
export { Analytics };
