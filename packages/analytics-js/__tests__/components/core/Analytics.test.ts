import { Analytics } from '@rudderstack/analytics-js/components/core/Analytics';
import { resetState, state } from '@rudderstack/analytics-js/state';
import { setExposedGlobal } from '@rudderstack/analytics-js/components/utilities/globals';

jest.mock('../../../src/components/utilities/globals', () => {
  const originalModule = jest.requireActual('../../../src/components/utilities/globals');

  return {
    __esModule: true,
    ...originalModule,
    setExposedGlobal: jest.fn((): void => {}),
  };
});

describe('Core - Analytics', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics();
  });

  afterEach(() => {
    resetState();
  });

  describe('constructor', () => {
    it('should initialize with default services and components', () => {
      expect(analytics.initialized).toBe(false);
      expect(analytics.httpClient).toBeDefined();
      expect(analytics.errorHandler).toBeDefined();
      expect(analytics.logger).toBeDefined();
      expect(analytics.pluginsManager).toBeDefined();
      expect(analytics.externalSrcLoader).toBeDefined();
      expect(analytics.storeManager).toBeDefined();
      expect(analytics.configManager).toBeDefined();
      expect(analytics.capabilitiesManager).toBeDefined();
      expect(analytics.eventManager).toBeDefined();
      expect(analytics.userSessionManager).toBeDefined();
    });
  });

  describe('attachGlobalErrorHandler', () => {
    it('should attach an error event listener to the window', () => {
      const mockAddEventListener = jest.spyOn(window, 'addEventListener');
      analytics.attachGlobalErrorHandler();
      expect(mockAddEventListener).toHaveBeenCalledTimes(1);
      expect(mockAddEventListener).toHaveBeenCalledWith('error', expect.any(Function), true);
    });
  });

  describe('startLifecycle', () => {
    it('should call expected methods in different state status', () => {
      analytics.startLifecycle();
      const loadPolyfillSpy = jest.spyOn(analytics, 'loadPolyfill');
      const loadConfigSpy = jest.spyOn(analytics, 'loadConfig');
      const initSpy = jest.spyOn(analytics, 'init');
      const loadPluginsSpy = jest.spyOn(analytics, 'loadPlugins');
      const onLoadedSpy = jest.spyOn(analytics, 'onLoaded');
      const loadIntegrationsSpy = jest.spyOn(analytics, 'loadIntegrations');
      const onReadySpy = jest.spyOn(analytics, 'onReady');

      state.lifecycle.status.value = 'mounted';
      expect(loadPolyfillSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('polyfillLoaded');

      state.lifecycle.status.value = 'polyfillLoaded';
      expect(loadConfigSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('polyfillLoaded');

      state.lifecycle.status.value = 'configured';
      expect(initSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('initialized');

      state.lifecycle.status.value = 'initialized';
      expect(loadPluginsSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('initialized');

      state.lifecycle.status.value = 'pluginsReady';
      expect(onLoadedSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('loaded');

      state.lifecycle.status.value = 'loaded';
      expect(loadIntegrationsSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('loaded');

      state.lifecycle.status.value = 'integrationsReady';
      expect(onReadySpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('integrationsReady');
    });
  });

  describe('load', () => {
    it('should load the analytics script with the given options', () => {
      const attachGlobalErrorHandlerSpy = jest.spyOn(analytics, 'attachGlobalErrorHandler');
      const startLifecycleSpy = jest.spyOn(analytics, 'startLifecycle');
      analytics.load('writeKey', 'dataPlaneUrl', { logLevel: 'ERROR' });
      expect(attachGlobalErrorHandlerSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('polyfillLoaded');
      expect(startLifecycleSpy).toHaveBeenCalledTimes(1);
      expect(setExposedGlobal).toHaveBeenCalledWith('state', state, 'writeKey');
    });
  });

  describe('loadConfig', () => {
    it('should handle error if no write key exists', () => {
      const onErrorSpy = jest.spyOn(analytics.errorHandler, 'onError');
      analytics.loadConfig();
      expect(onErrorSpy).toHaveBeenCalledTimes(1);
    });
    it('should set authentication request header', () => {
      const setAuthHeaderSpy = jest.spyOn(analytics.httpClient, 'setAuthHeader');
      const initSpy = jest.spyOn(analytics.configManager, 'init');
      state.lifecycle.writeKey.value = 'writeKey';
      analytics.loadConfig();
      expect(setAuthHeaderSpy).toHaveBeenCalledTimes(1);
      expect(setAuthHeaderSpy).toHaveBeenCalledWith('writeKey');
      expect(initSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onLoaded', () => {
    it('should invoke callback passed in onLoaded option', () => {
      state.loadOptions.value.onLoaded = jest.fn();
      analytics.onLoaded();
      expect(state.loadOptions.value.onLoaded).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.loaded.value).toBeTruthy();
      expect(state.lifecycle.status.value).toBe('loaded');
    });
  });

  describe('onReady', () => {
    it('should invoke callbacks passed in onReady calls', () => {
      const callback = jest.fn();
      state.eventBuffer.readyCallbacksArray.value = [callback, callback];
      analytics.onReady();
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('ready', () => {
    it('should ignore calls with no function callback', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const errorSpy = jest.spyOn(analytics.logger, 'error');
      const callback = true;

      analytics.ready(callback as any);
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
    });
    it('should buffer events until loaded', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const callback = jest.fn();

      analytics.ready(callback);
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([['ready', callback]]);
    });
    it('should buffer callback trigger until ready', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const callback = jest.fn();

      state.lifecycle.loaded.value = true;
      analytics.ready(callback);
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.readyCallbacksArray.value).toStrictEqual([callback]);
    });
    it('should trigger callback if ready', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const callback = jest.fn();

      state.lifecycle.loaded.value = true;
      state.lifecycle.status.value = 'ready';
      analytics.ready(callback);
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.readyCallbacksArray.value).toStrictEqual([]);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
    });
  });

  describe('page', () => {
    it('should buffer events until loaded', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');

      analytics.page({ name: 'name' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([
        ['page', { name: 'name' }],
      ]);
    });
    it('should sent events if loaded', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const addEventSpy = jest.spyOn(analytics.eventManager, 'addEvent');

      state.lifecycle.loaded.value = true;
      analytics.page({ name: 'name' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(addEventSpy).toHaveBeenCalledWith({
        type: 'page',
        name: 'name',
      });
    });
  });

  describe('track', () => {
    it('should buffer events until loaded', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');

      analytics.track({ name: 'name' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([
        ['track', { name: 'name' }],
      ]);
    });
    it('should sent events if loaded', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const addEventSpy = jest.spyOn(analytics.eventManager, 'addEvent');

      state.lifecycle.loaded.value = true;
      analytics.track({ name: 'name' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(addEventSpy).toHaveBeenCalledWith({
        type: 'track',
        name: 'name',
      });
    });
  });

  describe('identify', () => {
    it('should buffer events until loaded', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');

      analytics.identify({ userId: 'userId' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([
        ['identify', { userId: 'userId' }],
      ]);
    });
    it('should sent events if loaded', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const addEventSpy = jest.spyOn(analytics.eventManager, 'addEvent');
      const setUserIdSpy = jest.spyOn(analytics.userSessionManager, 'setUserId');
      const setUserTraitsSpy = jest.spyOn(analytics.userSessionManager, 'setUserTraits');
      const resetSpy = jest.spyOn(analytics, 'reset');

      state.lifecycle.loaded.value = true;
      state.session.rl_user_id.value = 'userId';
      analytics.identify({ userId: 'userId' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(setUserIdSpy).toHaveBeenCalledTimes(1);
      expect(setUserTraitsSpy).toHaveBeenCalledTimes(1);
      expect(resetSpy).toHaveBeenCalledTimes(0);
      expect(addEventSpy).toHaveBeenCalledWith({
        type: 'identify',
        userId: 'userId',
      });
    });
    it('should sent events if loaded and reset session if userID changed', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const addEventSpy = jest.spyOn(analytics.eventManager, 'addEvent');
      const setUserIdSpy = jest.spyOn(analytics.userSessionManager, 'setUserId');
      const setUserTraitsSpy = jest.spyOn(analytics.userSessionManager, 'setUserTraits');
      const resetSpy = jest.spyOn(analytics, 'reset');

      state.lifecycle.loaded.value = true;
      state.session.rl_user_id.value = 'dummyUserId';
      analytics.identify({ userId: 'userId' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(2);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(setUserIdSpy).toHaveBeenCalledTimes(1);
      expect(setUserTraitsSpy).toHaveBeenCalledTimes(1);
      expect(resetSpy).toHaveBeenCalledTimes(1);
      expect(addEventSpy).toHaveBeenCalledWith({
        type: 'identify',
        userId: 'userId',
      });
    });
  });

  describe('alias', () => {
    it('should buffer events until loaded', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');

      analytics.alias({ to: 'to' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([['alias', { to: 'to' }]]);
    });
    it('should sent events if loaded', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const addEventSpy = jest.spyOn(analytics.eventManager, 'addEvent');

      state.lifecycle.loaded.value = true;
      analytics.alias({ to: 'to' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(addEventSpy).toHaveBeenCalledWith({
        type: 'alias',
        to: 'to',
      });
    });
  });

  describe('group', () => {
    it('should buffer events until loaded', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const setGroupIdIdSpy = jest.spyOn(analytics.userSessionManager, 'setGroupId');
      const setGroupTraitsSpy = jest.spyOn(analytics.userSessionManager, 'setGroupTraits');

      analytics.group({ groupId: 'groupId' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(setGroupIdIdSpy).toHaveBeenCalledTimes(0);
      expect(setGroupTraitsSpy).toHaveBeenCalledTimes(0);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([
        ['group', { groupId: 'groupId' }],
      ]);
    });
    it('should sent events if loaded', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const setGroupIdIdSpy = jest.spyOn(analytics.userSessionManager, 'setGroupId');
      const setGroupTraitsSpy = jest.spyOn(analytics.userSessionManager, 'setGroupTraits');
      const addEventSpy = jest.spyOn(analytics.eventManager, 'addEvent');

      state.lifecycle.loaded.value = true;
      analytics.group({ groupId: 'groupId' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(setGroupIdIdSpy).toHaveBeenCalledTimes(1);
      expect(setGroupTraitsSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(addEventSpy).toHaveBeenCalledWith({
        type: 'group',
        groupId: 'groupId',
      });
    });
  });

  describe('reset', () => {
    it('should buffer events until loaded', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const resetSpy = jest.spyOn(analytics.userSessionManager, 'reset');
      const clearUserSessionStorageSpy = jest.spyOn(
        analytics.userSessionManager,
        'clearUserSessionStorage',
      );

      analytics.reset(true);
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(resetSpy).toHaveBeenCalledTimes(0);
      expect(clearUserSessionStorageSpy).toHaveBeenCalledTimes(0);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([['reset', true]]);
    });
    it('should reset session if loaded', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const resetSpy = jest.spyOn(analytics.userSessionManager, 'reset');
      const clearUserSessionStorageSpy = jest.spyOn(
        analytics.userSessionManager,
        'clearUserSessionStorage',
      );

      state.lifecycle.loaded.value = true;
      analytics.reset(true);
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(resetSpy).toHaveBeenCalledTimes(1);
      expect(clearUserSessionStorageSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
    });
  });
});
