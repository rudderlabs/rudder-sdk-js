import { Analytics } from '../../../src/components/core/Analytics';
import { resetState, state } from '../../../src/state';
import { setExposedGlobal } from '../../../src/components/utilities/globals';
import { entriesWithOnlyCookieStorage } from '../../../__fixtures__/fixtures';

jest.mock('../../../src/components/utilities/globals', () => {
  const originalModule = jest.requireActual('../../../src/components/utilities/globals');

  return {
    __esModule: true,
    ...originalModule,
    setExposedGlobal: jest.fn((): void => {}),
  };
});

jest.mock('@rudderstack/analytics-js-common/utilities/uuId', () => ({
  generateUUID: jest.fn().mockReturnValue('test_uuid'),
}));

describe('Core - Analytics', () => {
  let analytics: Analytics;
  const dummyWriteKey = 'qwertyuiopasdfghjklzxcvbnm1';

  beforeEach(() => {
    analytics = new Analytics();
  });

  afterEach(() => {
    resetState();
  });

  describe('constructor', () => {
    it('should initialize with default services and components', () => {
      expect(analytics.initialized).toBe(false);
      expect(analytics.errorHandler).toBeDefined();
      expect(analytics.logger).toBeDefined();
      expect(analytics.externalSrcLoader).toBeDefined();
      expect(analytics.capabilitiesManager).toBeDefined();
      expect(analytics.httpClient).toBeDefined();
    });
  });

  describe('startLifecycle', () => {
    it('should call expected methods in different state status', () => {
      analytics.startLifecycle();
      const prepareBrowserCapabilitiesSpy = jest.spyOn(analytics, 'prepareBrowserCapabilities');
      const loadConfigSpy = jest.spyOn(analytics, 'loadConfig');
      const initSpy = jest.spyOn(analytics, 'init');
      const loadPluginsSpy = jest.spyOn(analytics, 'loadPlugins');
      const onInitializedSpy = jest.spyOn(analytics, 'onInitialized');
      const loadDestinationsSpy = jest.spyOn(analytics, 'loadDestinations');
      const onDestinationsReadySpy = jest.spyOn(analytics, 'onDestinationsReady');

      state.lifecycle.status.value = 'mounted';
      expect(prepareBrowserCapabilitiesSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('browserCapabilitiesReady');

      state.lifecycle.status.value = 'browserCapabilitiesReady';
      expect(loadConfigSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('browserCapabilitiesReady');

      state.lifecycle.status.value = 'configured';
      expect(loadPluginsSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('pluginsLoading');

      state.lifecycle.status.value = 'pluginsLoading';
      expect(loadPluginsSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('pluginsLoading');

      state.lifecycle.status.value = 'pluginsReady';
      expect(initSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('ready');

      state.lifecycle.status.value = 'initialized';
      expect(onInitializedSpy).toHaveBeenCalledTimes(2);
      expect(state.lifecycle.status.value).toBe('ready');

      state.lifecycle.status.value = 'loaded';
      expect(loadDestinationsSpy).toHaveBeenCalledTimes(3);
      expect(state.lifecycle.status.value).toBe('ready');

      state.lifecycle.status.value = 'destinationsReady';
      expect(onDestinationsReadySpy).toHaveBeenCalledTimes(4);
      expect(state.lifecycle.status.value).toBe('ready');
    });
  });

  describe('load', () => {
    const sampleDataPlaneUrl = 'https://www.dummy.url';
    it('should load the analytics script with the given options', () => {
      const startLifecycleSpy = jest.spyOn(analytics, 'startLifecycle');
      analytics.load(dummyWriteKey, sampleDataPlaneUrl, { logLevel: 'ERROR' });
      expect(state.lifecycle.status.value).toBe('browserCapabilitiesReady');
      expect(startLifecycleSpy).toHaveBeenCalledTimes(1);
      expect(setExposedGlobal).toHaveBeenCalledWith('state', state, dummyWriteKey);
    });
    it('should load the analytics script without dataPlaneUrl with the given options', () => {
      const startLifecycleSpy = jest.spyOn(analytics, 'startLifecycle');
      analytics.load(dummyWriteKey, { logLevel: 'ERROR' });
      expect(state.lifecycle.status.value).toBe('browserCapabilitiesReady');
      expect(startLifecycleSpy).toHaveBeenCalledTimes(1);
      expect(setExposedGlobal).toHaveBeenCalledWith('state', state, dummyWriteKey);
    });
  });

  describe('loadConfig', () => {
    it('should set authentication request header', () => {
      analytics.prepareInternalServices();
      const setAuthHeaderSpy = jest.spyOn(analytics.httpClient, 'setAuthHeader');
      const initSpy = jest.spyOn(analytics.configManager, 'init');
      state.lifecycle.writeKey.value = dummyWriteKey;
      analytics.loadConfig();
      expect(setAuthHeaderSpy).toHaveBeenCalledTimes(1);
      expect(setAuthHeaderSpy).toHaveBeenCalledWith(dummyWriteKey);
      expect(initSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onLoaded', () => {
    it('should invoke callback passed in onLoaded option', () => {
      state.loadOptions.value.onLoaded = jest.fn();
      analytics.onInitialized();
      expect(state.loadOptions.value.onLoaded).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.loaded.value).toBeTruthy();
      expect(state.lifecycle.status.value).toBe('loaded');
    });
    it('should dispatch RSA initialised event', () => {
      const dispatchEventSpy = jest.spyOn(window.document, 'dispatchEvent');
      state.loadOptions.value.onLoaded = jest.fn();
      analytics.onInitialized();
      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      expect(dispatchEventSpy.mock.calls[0][0].detail).toStrictEqual({
        analyticsInstance: undefined,
      });
    });
  });

  describe('onDestinationsReady', () => {
    it('should invoke callbacks passed in onDestinationsReady calls', () => {
      const callback = jest.fn();
      state.eventBuffer.readyCallbacksArray.value = [callback, callback];
      analytics.onDestinationsReady();
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('ready', () => {
    it('should ignore calls with no function callback', () => {
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const errorSpy = jest.spyOn(analytics.logger, 'error');
      const callback = true;

      state.lifecycle.loaded.value = true;

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
    it('should dispatch RSA ready event', () => {
      const dispatchEventSpy = jest.spyOn(window.document, 'dispatchEvent');
      analytics.onReady();

      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      expect(dispatchEventSpy.mock.calls[0][0].detail).toStrictEqual({
        analyticsInstance: undefined,
      });
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
      analytics.prepareInternalServices();
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
      analytics.prepareInternalServices();
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
      analytics.prepareInternalServices();
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const addEventSpy = jest.spyOn(analytics.eventManager, 'addEvent');
      const setUserIdSpy = jest.spyOn(analytics.userSessionManager, 'setUserId');
      const setUserTraitsSpy = jest.spyOn(analytics.userSessionManager, 'setUserTraits');
      const resetSpy = jest.spyOn(analytics, 'reset');

      state.lifecycle.loaded.value = true;
      state.session.userId.value = 'userId';
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
      analytics.prepareInternalServices();
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const addEventSpy = jest.spyOn(analytics.eventManager, 'addEvent');
      const setUserIdSpy = jest.spyOn(analytics.userSessionManager, 'setUserId');
      const setUserTraitsSpy = jest.spyOn(analytics.userSessionManager, 'setUserTraits');
      const resetSpy = jest.spyOn(analytics, 'reset');

      state.lifecycle.loaded.value = true;
      state.session.userId.value = 'dummyUserId';
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
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      analytics.prepareInternalServices();
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const addEventSpy = jest.spyOn(analytics.eventManager, 'addEvent');

      state.lifecycle.loaded.value = true;
      analytics.alias({ to: 'to' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(addEventSpy).toHaveBeenCalledWith({
        type: 'alias',
        to: 'to',
        from: 'test_uuid', // this is the mocked value from UUID generation
      });
    });
  });

  describe('group', () => {
    it('should buffer events until loaded', () => {
      analytics.prepareInternalServices();
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
      analytics.prepareInternalServices();
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
      analytics.prepareInternalServices();
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const resetSpy = jest.spyOn(analytics.userSessionManager, 'reset');

      analytics.reset(true);
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(resetSpy).toHaveBeenCalledTimes(0);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([['reset', true]]);
    });
    it('should reset session if loaded', () => {
      analytics.prepareInternalServices();
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const resetSpy = jest.spyOn(analytics.userSessionManager, 'reset');

      state.lifecycle.loaded.value = true;
      analytics.reset(true);
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(resetSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
    });

    it('should process the preload buffer', () => {
      analytics.prepareInternalServices();
      const enqueueSpy = jest.spyOn(analytics.preloadBuffer, 'enqueue');
      const dequeueSpy = jest
        .spyOn(analytics.preloadBuffer, 'dequeue')
        .mockImplementationOnce(() => ['page', { path: '/home' }])
        .mockImplementationOnce(() => ['track', 'buttonClicked', { color: 'blue' }]);
      const sizeSpy = jest
        .spyOn(analytics.preloadBuffer, 'size')
        .mockImplementationOnce(() => 2)
        .mockImplementationOnce(() => 1)
        .mockImplementationOnce(() => 0);
      const pageSpy = jest.spyOn(analytics, 'page');
      const trackSpy = jest.spyOn(analytics, 'track');

      const events = [
        ['page', { path: '/home' }],
        ['track', 'buttonClicked', { color: 'blue' }],
      ];

      analytics.enqueuePreloadBufferEvents(events as any);
      expect(enqueueSpy).toHaveBeenCalledTimes(2);
      analytics.processDataInPreloadBuffer();

      expect(dequeueSpy).toHaveBeenCalledTimes(2);
      expect(pageSpy).toHaveBeenCalledWith({
        properties: { path: '/home', category: null, name: null },
      });
      expect(trackSpy).toHaveBeenCalledWith({
        name: 'buttonClicked',
        properties: { color: 'blue' },
      });
    });
  });
});
