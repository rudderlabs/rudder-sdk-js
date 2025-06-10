import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { COOKIE_KEYS } from '@rudderstack/analytics-js-cookies/constants/cookies';
import { batch } from '@preact/signals-core';
import type { IUserSessionManager } from '../../../src/components/userSessionManager/types';
import type { IEventManager } from '../../../src/components/eventManager/types';
import {
  entriesWithMixStorage,
  entriesWithOnlyCookieStorage,
} from '../../../__fixtures__/fixtures';
import { setExposedGlobal } from '../../../src/components/utilities/globals';
import { resetState, state } from '../../../src/state';
import { Analytics } from '../../../src/components/core/Analytics';

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
  const dummyDataplaneURL = 'https://dummy.dataplane.url';

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
      batch(() => {
        state.lifecycle.writeKey.value = dummyWriteKey;
        state.lifecycle.dataPlaneUrl.value = 'https://dummy.dataplane.url';
      });

      analytics.startLifecycle();
      const onMountedSpy = jest.spyOn(analytics, 'onMounted');
      const loadConfigSpy = jest.spyOn(analytics, 'loadConfig');
      const onPluginsReadySpy = jest.spyOn(analytics, 'onPluginsReady');
      const onConfiguredSpy = jest.spyOn(analytics, 'onConfigured');
      const onInitializedSpy = jest.spyOn(analytics, 'onInitialized');
      const loadDestinationsSpy = jest.spyOn(analytics, 'loadDestinations');
      const onDestinationsReadySpy = jest.spyOn(analytics, 'onDestinationsReady');
      const onReadySpy = jest.spyOn(analytics, 'onReady');

      state.lifecycle.status.value = 'mounted';
      expect(onMountedSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('browserCapabilitiesReady');

      state.lifecycle.status.value = 'browserCapabilitiesReady';
      expect(loadConfigSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('browserCapabilitiesReady');

      state.lifecycle.status.value = 'configured';
      expect(onConfiguredSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('pluginsLoading');

      state.lifecycle.status.value = 'pluginsLoading';
      expect(onConfiguredSpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('pluginsLoading');

      state.lifecycle.status.value = 'pluginsReady';
      expect(onPluginsReadySpy).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.status.value).toBe('readyExecuted');

      state.lifecycle.status.value = 'initialized';
      expect(onInitializedSpy).toHaveBeenCalledTimes(2);
      expect(state.lifecycle.status.value).toBe('readyExecuted');

      state.lifecycle.status.value = 'loaded';
      expect(loadDestinationsSpy).toHaveBeenCalledTimes(3);
      expect(state.lifecycle.status.value).toBe('readyExecuted');

      state.lifecycle.status.value = 'destinationsReady';
      expect(onDestinationsReadySpy).toHaveBeenCalledTimes(4);
      expect(state.lifecycle.status.value).toBe('readyExecuted');

      state.lifecycle.status.value = 'ready';
      expect(onReadySpy).toHaveBeenCalledTimes(5);
      expect(state.lifecycle.status.value).toBe('readyExecuted');
    });

    it('should short circuit the lifecycle when pre-consent behavior is enabled', () => {
      analytics.startLifecycle();
      const loadDestinationsSpy = jest.spyOn(analytics, 'loadDestinations');
      const processBufferedEventsSpy = jest.spyOn(analytics, 'processBufferedEvents');

      state.consents.preConsent.value = { enabled: true };
      state.lifecycle.status.value = 'loaded';
      expect(processBufferedEventsSpy).toHaveBeenCalledTimes(1);
      expect(loadDestinationsSpy).not.toHaveBeenCalled();
      expect(state.lifecycle.status.value).toBe('readyExecuted');
    });

    it('should handle errors in lifecycle methods via errorHandler', () => {
      const errorHandlerSpy = jest.spyOn(analytics.errorHandler, 'onError');

      // Mock onPluginsReady to throw an error
      const originalOnPluginsReady = analytics.onPluginsReady;
      analytics.onPluginsReady = jest.fn(() => {
        throw new Error('Plugins initialization failed');
      });

      analytics.startLifecycle();

      // Trigger the error by setting lifecycle status to 'pluginsReady'
      state.lifecycle.status.value = 'pluginsReady';

      // Verify error handler was called with correct parameters
      expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
      expect(errorHandlerSpy).toHaveBeenCalledWith({
        error: new Error('Plugins initialization failed'),
        context: 'AnalyticsCore',
        customMessage: 'Failed to load the SDK',
        groupingHash: 'Failed to load the SDK',
      });

      // Restore original method
      analytics.onPluginsReady = originalOnPluginsReady;
    });
  });

  describe('load', () => {
    const sampleDataPlaneUrl = 'https://www.dummy.url';
    it('should load the analytics script with the given options', () => {
      state.loadOptions.value.logLevel = 'WARN';

      const startLifecycleSpy = jest.spyOn(analytics, 'startLifecycle');
      const setMinLogLevelSpy = jest.spyOn(analytics.logger, 'setMinLogLevel');

      analytics.load(dummyWriteKey, sampleDataPlaneUrl, { logLevel: 'ERROR' });

      expect(state.lifecycle.status.value).toBe('browserCapabilitiesReady');
      expect(startLifecycleSpy).toHaveBeenCalledTimes(1);
      // Once in load API and then in config manager
      expect(setMinLogLevelSpy).toHaveBeenCalledTimes(2);
      expect(setMinLogLevelSpy).toHaveBeenNthCalledWith(1, 'ERROR');
      expect(setExposedGlobal).toHaveBeenCalledWith('state', state, dummyWriteKey);
    });

    it('should set the log level if it is not configured', () => {
      state.loadOptions.value.logLevel = undefined;
      const setMinLogLevelSpy = jest.spyOn(analytics.logger, 'setMinLogLevel');

      analytics.load(dummyWriteKey, sampleDataPlaneUrl);

      expect(state.lifecycle.status.value).toBe('browserCapabilitiesReady');
      // Once in load API and then in config manager
      expect(setMinLogLevelSpy).toHaveBeenCalledTimes(2);
      expect(setMinLogLevelSpy).toHaveBeenNthCalledWith(1, 'ERROR');
    });

    it('should not load if the write key is invalid', () => {
      const startLifecycleSpy = jest.spyOn(analytics, 'startLifecycle');
      const errorSpy = jest.spyOn(analytics.logger, 'error');

      analytics.load('', sampleDataPlaneUrl, { logLevel: 'ERROR' });

      expect(state.lifecycle.status.value).toBeUndefined();
      expect(startLifecycleSpy).not.toHaveBeenCalled();

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenNthCalledWith(
        1,
        'AnalyticsCore:: The write key "" is invalid. It must be a non-empty string. Please check that the write key is correct and try again.',
      );

      // Try with different invalid write key
      errorSpy.mockClear();
      analytics.load('  ', sampleDataPlaneUrl, { logLevel: 'ERROR' });

      expect(errorSpy).toHaveBeenNthCalledWith(
        1,
        'AnalyticsCore:: The write key "  " is invalid. It must be a non-empty string. Please check that the write key is correct and try again.',
      );

      // Try with different invalid write key
      errorSpy.mockClear();
      analytics.load({} as any, sampleDataPlaneUrl, { logLevel: 'ERROR' });

      expect(errorSpy).toHaveBeenNthCalledWith(
        1,
        'AnalyticsCore:: The write key "[object Object]" is invalid. It must be a non-empty string. Please check that the write key is correct and try again.',
      );

      errorSpy.mockRestore();
    });

    it('should not load if the data plane URL is invalid', () => {
      const startLifecycleSpy = jest.spyOn(analytics, 'startLifecycle');
      const errorSpy = jest.spyOn(analytics.logger, 'error');

      analytics.load(dummyWriteKey, '', { logLevel: 'ERROR' });

      expect(state.lifecycle.status.value).toBeUndefined();
      expect(startLifecycleSpy).not.toHaveBeenCalled();

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenNthCalledWith(
        1,
        'AnalyticsCore:: The data plane URL "" is invalid. It must be a valid URL string. Please check that the data plane URL is correct and try again.',
      );

      // Try with different invalid data plane URL
      errorSpy.mockClear();
      analytics.load(dummyWriteKey, undefined as any, { logLevel: 'ERROR' });

      expect(errorSpy).toHaveBeenNthCalledWith(
        1,
        'AnalyticsCore:: The data plane URL "undefined" is invalid. It must be a valid URL string. Please check that the data plane URL is correct and try again.',
      );

      // Try with different invalid data plane URL
      errorSpy.mockClear();
      analytics.load(dummyWriteKey, 'https:///someinvalidurl', { logLevel: 'ERROR' });

      expect(errorSpy).toHaveBeenNthCalledWith(
        1,
        'AnalyticsCore:: The data plane URL "https:///someinvalidurl" is invalid. It must be a valid URL string. Please check that the data plane URL is correct and try again.',
      );

      errorSpy.mockRestore();
    });
  });

  describe('loadConfig', () => {
    it('should set authentication request header', () => {
      analytics.prepareInternalServices();
      const setAuthHeaderSpy = jest.spyOn(analytics.httpClient, 'setAuthHeader');
      const initSpy = jest.spyOn(analytics.configManager, 'init');
      state.lifecycle.writeKey.value = dummyWriteKey;
      state.lifecycle.dataPlaneUrl.value = dummyDataplaneURL;
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

    it('should log an error if the onLoaded callback is not a function', () => {
      const errorSpy = jest.spyOn(analytics.logger, 'error');
      // @ts-expect-error testing invalid callback
      state.loadOptions.value.onLoaded = true;

      analytics.onInitialized();

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        'LoadAPI:: The provided callback parameter is not a function.',
      );
    });

    it('should log an error if the onLoaded callback throws an error', () => {
      const errorSpy = jest.spyOn(analytics.logger, 'error');
      state.loadOptions.value.onLoaded = () => {
        throw new Error('Test error');
      };

      analytics.onInitialized();

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        'LoadAPI:: The callback threw an exception',
        new Error('Test error'),
      );
    });
  });

  describe('onDestinationsReady', () => {
    it('should update the life cycle status to ready when onDestinationsReady is called', () => {
      analytics.onDestinationsReady();
      expect(state.lifecycle.status.value).toBe('ready');
    });

    it('should not update the life cycle status to ready if it is already in that state', () => {
      const onReadySpy = jest.spyOn(analytics, 'onReady');
      state.lifecycle.status.value = 'ready';
      analytics.onDestinationsReady();
      expect(onReadySpy).not.toBeCalled();

      onReadySpy.mockRestore();
    });
  });

  describe('ready', () => {
    it('should invoke callbacks passed', () => {
      const callback = jest.fn();
      state.eventBuffer.readyCallbacksArray.value = [callback, callback];
      analytics.onReady();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should log an error if a ready callback throws an error', () => {
      const errorSpy = jest.spyOn(analytics.logger, 'error');
      const callback = () => {
        throw new Error('Test error');
      };
      state.eventBuffer.readyCallbacksArray.value = [callback, jest.fn()];

      analytics.onReady();

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        'ReadyAPI:: The callback threw an exception',
        new Error('Test error'),
      );
    });

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
      const callback = jest.fn();

      analytics.ready(callback);
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
      // Using the next lifecycle state ('readyExecuted') here as lifecycle is not started in this test
      // In the real scenario, once the SDK is ready, the lifecycle state will be 'readyExecuted'
      state.lifecycle.status.value = 'readyExecuted';
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

    it('should log an error if the provided callback is not a function', () => {
      state.lifecycle.loaded.value = true;

      const errorSpy = jest.spyOn(analytics.logger, 'error');
      // @ts-expect-error testing invalid callback
      analytics.ready(true);

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        'ReadyAPI:: The provided callback parameter is not a function.',
      );
    });

    it('should log an error if the provided callback throws an error', () => {
      state.lifecycle.loaded.value = true;
      state.lifecycle.status.value = 'readyExecuted';

      const errorSpy = jest.spyOn(analytics.logger, 'error');
      const callback = () => {
        throw new Error('Test error');
      };

      analytics.ready(callback);

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        'ReadyAPI:: The callback threw an exception',
        new Error('Test error'),
      );
    });
  });

  describe('page', () => {
    it('should buffer events until loaded', () => {
      analytics.page({ name: 'name' });
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
      analytics.track({ name: 'name' });
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
      analytics.identify({ userId: 'userId' });
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
      analytics.alias({ to: 'to' });
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([['alias', { to: 'to' }]]);
    });
    it('should sent events if loaded', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      analytics.prepareInternalServices();
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const addEventSpy = jest.spyOn(analytics.eventManager, 'addEvent');

      state.lifecycle.loaded.value = true;

      analytics.alias({ to: 'to', from: 'x' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(addEventSpy).toHaveBeenCalledWith({
        type: 'alias',
        to: 'to',
        from: 'x',
      });
    });

    it('should use the user ID if from is not provided', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      analytics.prepareInternalServices();
      state.session.userId.value = 'userId';
      const addEventSpy = jest.spyOn(analytics.eventManager, 'addEvent');
      state.lifecycle.loaded.value = true;

      analytics.alias({ to: 'to' });

      expect(addEventSpy).toHaveBeenCalledWith({
        type: 'alias',
        to: 'to',
        from: 'userId',
      });
    });

    it('should use the anonymous ID if user ID is not set', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      analytics.prepareInternalServices();
      state.session.userId.value = null;
      const addEventSpy = jest.spyOn(analytics.eventManager, 'addEvent');
      state.lifecycle.loaded.value = true;

      analytics.alias({ to: 'to' });

      expect(addEventSpy).toHaveBeenCalledWith({
        type: 'alias',
        to: 'to',
        from: 'test_uuid',
      });
    });
  });

  describe('group', () => {
    it('should buffer events until loaded', () => {
      analytics.prepareInternalServices();
      const setGroupIdIdSpy = jest.spyOn(analytics.userSessionManager, 'setGroupId');
      const setGroupTraitsSpy = jest.spyOn(analytics.userSessionManager, 'setGroupTraits');

      analytics.group({ groupId: 'groupId' });
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
      const resetSpy = jest.spyOn(analytics.userSessionManager, 'reset');

      analytics.reset(true);
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
        properties: { path: '/home' },
      });
      expect(trackSpy).toHaveBeenCalledWith({
        name: 'buttonClicked',
        properties: { color: 'blue' },
      });
    });
  });

  describe('consent', () => {
    it('should buffer methods until loaded', () => {
      analytics.consent({ sendPageEvent: true });
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([
        ['consent', { sendPageEvent: true }],
      ]);
    });

    it('should resume SDK processing on consent', () => {
      analytics.prepareInternalServices();

      state.consents.enabled.value = true;
      state.lifecycle.loaded.value = true;
      state.consents.initialized.value = false;
      state.storage.type.value = 'localStorage';
      state.storage.entries.value = entriesWithMixStorage;

      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const invokeSingleSpy = jest.spyOn(
        analytics.pluginsManager as IPluginsManager,
        'invokeSingle',
      );
      const resumeSpy = jest.spyOn(analytics.eventManager as IEventManager, 'resume');
      const loadDestinationsSpy = jest.spyOn(analytics, 'loadDestinations');
      const initializeStorageStateSpy = jest.spyOn(
        analytics.storeManager as IStoreManager,
        'initializeStorageState',
      );
      const syncStorageDataToStateSpy = jest.spyOn(
        analytics.userSessionManager as IUserSessionManager,
        'syncStorageDataToState',
      );

      const trackSpy = jest.spyOn(analytics, 'track');
      const pageSpy = jest.spyOn(analytics, 'page');

      analytics.consent({
        consentManagement: {
          provider: 'custom',
          enabled: true,
        },
        storage: {
          type: 'cookieStorage',
          entries: {
            userId: {
              type: 'sessionStorage',
            },
            userTraits: {
              type: 'localStorage',
            },
            groupId: {
              type: 'memoryStorage',
            },
            groupTraits: {
              type: 'memoryStorage',
            },
            authToken: {
              type: 'none',
            },
          },
        },
        discardPreConsentEvents: true,
        sendPageEvent: true,
        trackConsent: true,
      });

      expect(state.consents.preConsent.value.enabled).toBe(false);
      expect(state.consents.postConsent.value).toEqual({
        discardPreConsentEvents: true,
        sendPageEvent: true,
        trackConsent: true,
        consentManagement: {
          enabled: true,
          provider: 'custom',
        },
        storage: {
          type: 'cookieStorage',
          entries: {
            userId: {
              type: 'sessionStorage',
            },
            userTraits: {
              type: 'localStorage',
            },
            groupId: {
              type: 'memoryStorage',
            },
            groupTraits: {
              type: 'memoryStorage',
            },
            authToken: {
              type: 'none',
            },
          },
        },
      });

      expect(state.consents.initialized.value).toBe(false);
      expect(state.consents.data.value).toStrictEqual({
        allowedConsentIds: [],
        deniedConsentIds: [],
      });

      expect(leaveBreadcrumbSpy).toHaveBeenCalledWith('New consent invocation');
      expect(invokeSingleSpy).toHaveBeenCalledTimes(6); // 1 for consents data fetch and other for setting active destinations, 2 x 2 for queueing consent track and page events to event queue plugins
      expect(initializeStorageStateSpy).toHaveBeenCalledTimes(1);
      expect(syncStorageDataToStateSpy).toHaveBeenCalledTimes(1);
      expect(resumeSpy).toHaveBeenCalledTimes(1);
      expect(loadDestinationsSpy).toHaveBeenCalledTimes(1);

      expect(state.storage.type.value).toBe('cookieStorage');
      expect(state.storage.entries.value).toStrictEqual({
        userId: {
          type: 'sessionStorage',
          key: COOKIE_KEYS.userId,
        },
        userTraits: {
          type: 'localStorage',
          key: COOKIE_KEYS.userTraits,
        },
        anonymousId: {
          type: 'cookieStorage',
          key: COOKIE_KEYS.anonymousId,
        },
        groupId: {
          type: 'memoryStorage',
          key: COOKIE_KEYS.groupId,
        },
        groupTraits: {
          type: 'memoryStorage',
          key: COOKIE_KEYS.groupTraits,
        },
        initialReferrer: {
          type: 'cookieStorage',
          key: COOKIE_KEYS.initialReferrer,
        },
        initialReferringDomain: {
          type: 'cookieStorage',
          key: COOKIE_KEYS.initialReferringDomain,
        },
        sessionInfo: {
          type: 'cookieStorage',
          key: COOKIE_KEYS.sessionInfo,
        },
        authToken: {
          type: 'none',
          key: COOKIE_KEYS.authToken,
        },
      });

      expect(trackSpy).toHaveBeenCalled();
      expect(pageSpy).toHaveBeenCalled();
    });

    it('should add consent auto tracking events to the end of the buffered events', () => {
      analytics.prepareInternalServices();

      state.eventBuffer.toBeProcessedArray.value = [['identify', { userId: 'test_user_id' }]];

      state.consents.enabled.value = true;
      state.lifecycle.loaded.value = true;
      state.consents.initialized.value = false;

      analytics.consent(
        {
          sendPageEvent: true,
          trackConsent: true,
        },
        true,
      ); // Send true to mimic buffered invocation

      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([
        ['identify', { userId: 'test_user_id' }],
        [
          'track',
          {
            name: 'Consent Management Interaction',
            properties: {},
            options: undefined,
            callback: undefined,
          },
        ],
        [
          'page',
          {
            properties: {},
            category: undefined,
            name: undefined,
            options: undefined,
            callback: undefined,
          },
        ],
      ]);
    });

    it('should refresh consents data when the API is invoked multiple times', () => {
      analytics.prepareInternalServices();

      state.consents.enabled.value = true;
      state.lifecycle.loaded.value = true;
      state.consents.initialized.value = false;
      state.storage.type.value = 'localStorage';
      state.storage.entries.value = entriesWithMixStorage;

      const invokeSingleSpy = jest.spyOn(
        analytics.pluginsManager as IPluginsManager,
        'invokeSingle',
      );

      analytics.consent();

      expect(invokeSingleSpy).toHaveBeenCalledTimes(2);

      // Update consents data to simulate the plugin populating the data
      state.consents.data.value = {
        allowedConsentIds: ['allowed_consent_id'],
        deniedConsentIds: ['denied_consent_id'],
      };
      state.consents.initialized.value = true;

      // Set the state to simulate destinations being ready
      state.nativeDestinations.clientDestinationsReady.value = true;

      invokeSingleSpy.mockClear();

      // Invoke the API again to refresh the consents data
      analytics.consent();

      expect(invokeSingleSpy).toHaveBeenCalledTimes(1);
    });
  });
});
