import * as R from 'ramda';
import { defaultHttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultPluginManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { defaultExternalSrcLoader } from '@rudderstack/analytics-js/services/ExternalSrcLoader';
import { defaultStoreManager, Store } from '@rudderstack/analytics-js/services/StoreManager';
import { effect } from '@preact/signals-core';
import { state } from '@rudderstack/analytics-js/state';
import { defaultConfigManager } from '@rudderstack/analytics-js/components/configManager/ConfigManager';
import { ICapabilitiesManager } from '@rudderstack/analytics-js/components/capabilitiesManager/types';
import { defaultCapabilitiesManager } from '@rudderstack/analytics-js/components/capabilitiesManager/CapabilitiesManager';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import { IEventManager } from '@rudderstack/analytics-js/components/eventManager/types';
import { defaultEventManager } from '@rudderstack/analytics-js/components/eventManager/EventManager';
import { defaultUserSessionManager } from '@rudderstack/analytics-js/components/userSessionManager/UserSessionManager';
import { Nullable } from '@rudderstack/analytics-js/types';
import {
  AnonymousIdOptions,
  ApiCallback,
  ApiObject,
  LifecycleStatus,
  LoadOptions,
  SessionInfo,
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
  initialized: boolean;
  status: LifecycleStatus;
  httpClient: IHttpClient;
  logger: ILogger;
  errorHandler: IErrorHandler;
  pluginsManager: IPluginsManager;
  externalSrcLoader: IExternalSrcLoader;
  storageManager: IStoreManager;
  configManager: IConfigManager;
  capabilitiesManager: ICapabilitiesManager;
  eventManager: IEventManager;
  userSessionManager: IUserSessionManager;
  clientDataStore?: Store;

  /**
   * Initialize services and components or use default ones if singletons
   */
  constructor() {
    this.initialized = false;
    this.httpClient = defaultHttpClient;
    this.errorHandler = defaultErrorHandler;
    this.logger = defaultLogger;
    this.pluginsManager = defaultPluginManager;
    this.externalSrcLoader = defaultExternalSrcLoader;
    this.storageManager = defaultStoreManager;
    this.configManager = defaultConfigManager;
    this.capabilitiesManager = defaultCapabilitiesManager;
    this.eventManager = defaultEventManager;
    this.userSessionManager = defaultUserSessionManager;

    this.attachGlobalErrorHandler = this.attachGlobalErrorHandler.bind(this);
    this.load = this.load.bind(this);
    this.startLifecycle = this.startLifecycle.bind(this);
    this.loadPolyfill = this.loadPolyfill.bind(this);
    this.loadConfig = this.loadConfig.bind(this);
    this.init = this.init.bind(this);
    this.loadPlugins = this.loadPlugins.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
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
    this.getSessionInfo = this.getSessionInfo.bind(this);
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
    state.lifecycle.status.value = 'mounted';
    state.lifecycle.writeKey.value = writeKey;
    state.lifecycle.dataPlaneUrl.value = dataPlaneUrl;
    state.loadOptions.value = mergeDeepRight(state.loadOptions.value, R.clone(loadOptions));

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
        case 'mounted':
          this.loadPolyfill();
          break;
        case 'polyfillLoaded':
          this.loadConfig();
          break;
        case 'configured':
          this.init();
          break;
        case 'initialized':
          this.loadPlugins();
          break;
        case 'pluginsReady':
          this.onLoaded();
          break;
        case 'loaded':
          this.loadIntegrations();
          break;
        case 'integrationsReady':
          this.onReady();
          break;
        case 'ready':
          break;
        default:
          break;
      }
    });
  }

  /**
   * Load browser polyfill if required
   */
  loadPolyfill() {
    this.capabilitiesManager.loadPolyfill();
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
    this.configManager.init();
  }

  /**
   * Initialize the storage and event queue
   */
  init() {
    // Initialise storage
    this.storageManager.init();
    this.clientDataStore = this.storageManager.getStore('clientData') as Store;
    this.userSessionManager.setStorage(this.clientDataStore);

    // Initialise event manager
    this.eventManager.init();
  }

  /**
   * Load plugins
   */
  // TODO: dummy implementation for testing until we implement plugin manager
  //  create proper implementation once relevant task is picked up
  loadPlugins() {
    // TODO: maybe we need to separate the plugins that are required before the eventManager init and after
    this.pluginsManager.init();
    // TODO: are we going to enable custom plugins to be passed as load options?
    // registerCustomPlugins(state.loadOptions.value.customPlugins);
  }

  /**
   * Trigger onLoaded callback if any is provided in config
   */
  onLoaded() {
    // Set lifecycle state
    state.lifecycle.loaded.value = true;
    state.lifecycle.status.value = 'loaded';

    // Execute onLoaded callback if provided in load options
    if (state.loadOptions.value.onLoaded && isFunction(state.loadOptions.value.onLoaded)) {
      state.loadOptions.value.onLoaded(this);
    }
  }

  /**
   * Load device mode integrations
   */
  // TODO: dummy implementation for testing until we implement device mode
  //  create proper implementation once relevant task is picked up
  loadIntegrations() {
    if (R.isEmpty(state.nativeDestinations.clientIntegrations)) {
      state.lifecycle.status.value = 'ready';
      return;
    }

    // TODO: store in state and calculate if all integrations are loaded, then set status to onReady
    // TODO: decouple in separate file
    const integrationOnLoadCallback = (id?: string) => {
      if (!id) {
        return;
      }

      console.log(`${id} Script loaded`);
    };

    this.pluginsManager.invoke(
      'remote.load_integrations',
      state.nativeDestinations.clientIntegrations.value,
      state,
      this.externalSrcLoader,
      integrationOnLoadCallback,
    );

    effect(() => {
      console.log(
        'successfullyLoadedIntegration',
        state.nativeDestinations.successfullyLoadedIntegration.value,
      );
    });

    effect(() => {
      console.log(
        'dynamicallyLoadedIntegrations',
        state.nativeDestinations.dynamicallyLoadedIntegrations.value,
      );
    });

    // TODO: fix await until all remote integrations have been fetched, this can be
    //  done using a callback to notify state that the integration is loaded and
    //  calculate signal when all are loaded, once all loaded then set status to ready
    window.setTimeout(() => {
      state.lifecycle.status.value = 'ready';
    }, 3000);
  }

  /**
   * Invoke the ready callbacks if any exist
   */
  // eslint-disable-next-line class-methods-use-this
  onReady() {
    state.eventBuffer.readyCallbacksArray.value.forEach(callback => callback());
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

    if (!state.lifecycle.loaded) {
      state.eventBuffer.toBeProcessedArray.value.push([type, callback]);
      return;
    }

    /**
     * If integrations are loaded or no integration is available for loading
     * execute the callback immediately else push the callbacks to a queue that
     * will be executed after loading completes
     */
    if (state.lifecycle.status.value === 'ready') {
      callback();
    } else {
      state.eventBuffer.readyCallbacksArray.value.push(callback);
    }
  }

  page(payload: PageCallOptions) {
    const type = 'page';
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);

    if (!state.lifecycle.loaded) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }

    this.eventManager.addEvent({
      type,
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

    if (!state.lifecycle.loaded) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }

    this.eventManager.addEvent({
      type,
      name: payload.name,
      properties: payload.properties,
      options: payload.options,
      callback: payload.callback,
    });
  }

  identify(payload: IdentifyCallOptions) {
    const type = 'identify';
    const normalisedUserId =
      payload.userId || payload.userId === 0 ? payload.userId.toString() : null;
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);

    if (!state.lifecycle.loaded) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }

    const shouldResetSession = Boolean(
      normalisedUserId &&
        state.session.rl_user_id.value &&
        normalisedUserId !== state.session.rl_user_id.value,
    );

    if (shouldResetSession) {
      this.reset();
    }

    this.userSessionManager.setUserId(normalisedUserId);
    this.userSessionManager.setUserTraits(payload.traits);

    this.eventManager.addEvent({
      type: 'identify',
      userId: normalisedUserId,
      traits: payload.traits,
      options: payload.options,
      callback: payload.callback,
    });
  }

  alias(payload: AliasCallOptions) {
    const type = 'alias';
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);

    if (!state.lifecycle.loaded) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }

    this.eventManager.addEvent({
      type,
      to: payload.to,
      from: payload.from,
      options: payload.options,
      callback: payload.callback,
    });
  }

  group(payload: GroupCallOptions) {
    const type = 'group';
    const normalisedGroupId =
      payload.groupId || payload.groupId === 0 ? payload.groupId.toString() : null;
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);

    if (!state.lifecycle.loaded) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }

    this.userSessionManager.setGroupId(normalisedGroupId);
    this.userSessionManager.setGroupTraits(payload.traits);

    this.eventManager.addEvent({
      type,
      groupId: normalisedGroupId,
      traits: payload.traits,
      options: payload.options,
      callback: payload.callback,
    });
  }

  reset(resetAnonymousId?: boolean) {
    const type = 'reset';
    this.errorHandler.leaveBreadcrumb(`New ${type} event, resetAnonymousId: ${resetAnonymousId}`);

    if (!state.lifecycle.loaded) {
      state.eventBuffer.toBeProcessedArray.value.push([type, resetAnonymousId]);
      return;
    }

    this.userSessionManager.reset(resetAnonymousId);
    this.userSessionManager.clearUserSessionStorage(resetAnonymousId);
  }

  getAnonymousId(options?: AnonymousIdOptions): string {
    return this.userSessionManager.getAnonymousId(options);
  }

  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string): string {
    return this.userSessionManager.setAnonymousId(anonymousId, rudderAmpLinkerParam);
  }

  // eslint-disable-next-line class-methods-use-this
  getUserId(): Nullable<string> | undefined {
    return state.session.rl_user_id.value;
  }

  // eslint-disable-next-line class-methods-use-this
  getUserTraits(): Nullable<ApiObject> | undefined {
    return state.session.rl_trait.value;
  }

  // eslint-disable-next-line class-methods-use-this
  getGroupId(): Nullable<string> | undefined {
    return state.session.rl_group_id.value;
  }

  // eslint-disable-next-line class-methods-use-this
  getGroupTraits(): Nullable<ApiObject> | undefined {
    return state.session.rl_group_trait.value;
  }

  startSession(sessionId?: number) {
    this.userSessionManager.start(sessionId);
  }

  endSession() {
    this.userSessionManager.end();
  }

  getSessionId(): Nullable<number> {
    const sessionInfo = this.getSessionInfo();
    return sessionInfo?.id || null;
  }

  getSessionInfo(): Nullable<SessionInfo> {
    return this.userSessionManager.getSessionInfo();
  }
  // End consumer exposed methods

  // TODO: should we still implement methodToCallbackMapping? Seems we will deprecate this
  //  non used feature https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/supported-api/#callbacks-to-common-methods
  //  if we need to keep we need initializeCallbacks & registerCallbacks methods
}

export { Analytics };
