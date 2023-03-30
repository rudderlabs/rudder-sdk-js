import * as R from 'ramda';
import { defaultHttpClient, HttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { defaultLogger, Logger } from '@rudderstack/analytics-js/services/Logger';
import { defaultErrorHandler, ErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import {
  defaultPluginManager,
  PluginsManager,
} from '@rudderstack/analytics-js/components/pluginsManager';
import {
  defaultExternalSrcLoader,
  ExternalSrcLoader,
} from '@rudderstack/analytics-js/services/ExternalSrcLoader';
import {
  defaultStoreManager,
  Store,
  StoreManager,
} from '@rudderstack/analytics-js/services/StorageManager';
import { LifecycleStatus } from '@rudderstack/analytics-js/state/slices/lifecycle';
import { effect } from '@preact/signals-core';
import { state } from '@rudderstack/analytics-js/state';
import { ConfigManager } from '@rudderstack/analytics-js/components/configManager';
import { defaultConfigManager } from '@rudderstack/analytics-js/components/configManager/ConfigManager';
import { CapabilitiesManager } from '@rudderstack/analytics-js/components/capabilitiesManager';
import { defaultCapabilitiesManager } from '@rudderstack/analytics-js/components/capabilitiesManager/CapabilitiesManager';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import {
  AliasCallOptions,
  GroupCallOptions,
  IAnalytics,
  IdentifyCallOptions,
  PageCallOptions,
  TrackCallOptions,
} from '@rudderstack/analytics-js/components/core/IAnalytics';
import {
  AnonymousIdOptions,
  ApiObject,
  LoadOptions,
} from '@rudderstack/analytics-js/IRudderAnalytics';
import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import { EventManager } from '@rudderstack/analytics-js/components/eventManager';
import { defaultEventManager } from '@rudderstack/analytics-js/components/eventManager/EventManager';
import {
  defaultUserSessionManager,
  UserSessionManager,
} from '@rudderstack/analytics-js/components/userSessionManager/UserSessionManager';
import { Nullable } from '@rudderstack/analytics-js/types';
import { SessionInfo } from '@rudderstack/analytics-js/state/slices/session';
import { ApiCallback } from '@rudderstack/analytics-js/state/slices/eventBuffer';
import { setExposedGlobal } from './exposedGlobals';

class Analytics implements IAnalytics {
  initialized: boolean;
  status: LifecycleStatus;
  httpClient: HttpClient;
  logger: Logger;
  errorHandler: ErrorHandler;
  pluginsManager: PluginsManager;
  externalSrcLoader: ExternalSrcLoader;
  storageManager: StoreManager;
  configManager: ConfigManager;
  capabilitiesManager: CapabilitiesManager;
  eventManager: EventManager;
  clientDataStore?: Store;
  userSessionManager: UserSessionManager;

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

    this.ready = this.ready.bind(this);
    this.identify = this.identify.bind(this);
    this.page = this.page.bind(this);
    this.track = this.track.bind(this);
    this.alias = this.alias.bind(this);
    this.group = this.group.bind(this);
    this.reset = this.reset.bind(this);
    this.load = this.load.bind(this);
    this.getUserId = this.getUserId.bind(this);
    this.getSessionId = this.getSessionId.bind(this);
    this.getSessionInfo = this.getSessionInfo.bind(this);
    this.getUserTraits = this.getUserTraits.bind(this);
    this.getAnonymousId = this.getAnonymousId.bind(this);
    this.setAnonymousId = this.setAnonymousId.bind(this);
    this.getGroupId = this.getGroupId.bind(this);
    this.getGroupTraits = this.getGroupTraits.bind(this);
    this.startSession = this.startSession.bind(this);
    this.endSession = this.endSession.bind(this);
  }

  load(writeKey: string, dataPlaneUrl: string, loadOptions: Partial<LoadOptions> = {}) {
    if (state.lifecycle.status.value) {
      return;
    }

    // Set initial state values and expose state global this
    state.lifecycle.status.value = 'mounted';
    state.lifecycle.writeKey.value = writeKey;
    state.lifecycle.dataPlaneUrl.value = dataPlaneUrl;
    state.loadOptions.value = mergeDeepRight(state.loadOptions.value, R.clone(loadOptions));
    setExposedGlobal('state', state, writeKey);

    // Configure initial config of any services or components here

    // State application lifecycle
    this.startLifecycle();
  }

  // Start lifecycle methods

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

  loadPolyfill() {
    this.capabilitiesManager.loadPolyfill();
  }

  loadConfig() {
    // TODO: handle missing write key as error
    if (!state.lifecycle.writeKey.value) {
      return;
    }

    this.httpClient.setAuthHeader(state.lifecycle.writeKey.value);
    this.configManager.init();
  }

  init() {
    // Initialise storage
    const storageConfig = {
      cookieOptions: {
        samesite: state.loadOptions.value.sameSiteCookie,
        secure: state.loadOptions.value.secureCookie,
        domain: state.loadOptions.value.setCookieDomain,
        enabled: true,
      },
      localStorageOptions: { enabled: true },
      inMemoryStorageOptions: { enabled: true },
    };
    this.storageManager.init(storageConfig);
    this.clientDataStore = this.storageManager.getStore('clientData') as Store;
    this.userSessionManager.setStorage(this.clientDataStore);

    // TODO: add eventManager and set status.value = 'initialized'; once eventManager event repository is ready
    state.lifecycle.status.value = 'initialized';
  }

  loadPlugins() {
    // TODO: maybe we need to separate the plugins that are required before the eventManager init and after
    this.pluginsManager.init();
    // TODO: are we going to enable custom plugins to be passed as load options?
    // registerCustomPlugins(state.loadOptions.value.customPlugins);
  }

  onLoaded() {
    this.eventManager.init();
    state.lifecycle.loaded.value = true;
    state.lifecycle.status.value = 'loaded';

    // Execute onLoaded callback if provided in load options
    if (state.loadOptions.value.onLoaded && isFunction(state.loadOptions.value.onLoaded)) {
      state.loadOptions.value.onLoaded(this);
    }
  }

  // TODO: dummy implementation for testing until we implement device mode
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

  // eslint-disable-next-line class-methods-use-this
  onReady() {
    state.eventBuffer.readyCallbacksArray.value.forEach(callback => callback());
  }

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
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);

    if (!state.lifecycle.loaded) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }

    this.eventManager.addEvent({
      type: 'identify',
      userId: payload.userId,
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
    this.errorHandler.leaveBreadcrumb(`New ${type} event`);

    if (!state.lifecycle.loaded) {
      state.eventBuffer.toBeProcessedArray.value.push([type, payload]);
      return;
    }

    this.eventManager.addEvent({
      type,
      groupId: payload.groupId,
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

  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string): string {
    return this.userSessionManager.setAnonymousId(anonymousId, rudderAmpLinkerParam);
  }

  startSession(sessionId?: number) {
    this.userSessionManager.start(sessionId);
  }

  endSession() {
    this.userSessionManager.end();
  }

  getAnonymousId(options?: AnonymousIdOptions): string {
    return this.userSessionManager.getAnonymousId(options);
  }

  // eslint-disable-next-line class-methods-use-this
  getUserId(): string | undefined {
    return state.session.rl_user_id.value;
  }

  // eslint-disable-next-line class-methods-use-this
  getUserTraits(): ApiObject | undefined {
    return state.session.rl_trait.value;
  }

  // eslint-disable-next-line class-methods-use-this
  getGroupId(): string | undefined {
    return state.session.rl_group_id.value;
  }

  // eslint-disable-next-line class-methods-use-this
  getGroupTraits(): ApiObject | undefined {
    return state.session.rl_group_trait.value;
  }

  getSessionId(): Nullable<number> {
    const sessionInfo = this.getSessionInfo();
    return sessionInfo?.id || null;
  }

  getSessionInfo(): Nullable<SessionInfo> {
    return this.userSessionManager.getSessionInfo();
  }

  // TODO: should we still implement methodToCallbackMapping?
  //  if yes we need initializeCallbacks & registerCallbacks methods
}

export { Analytics };
