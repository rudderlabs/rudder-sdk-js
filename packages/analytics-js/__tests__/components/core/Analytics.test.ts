import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { COOKIE_KEYS } from '@rudderstack/analytics-js-cookies/constants/cookies';
import type { RSACustomIntegration } from '@rudderstack/analytics-js-common/types/IRudderAnalytics';
import type { BufferedEvent } from '@rudderstack/analytics-js-common/types/Event';
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
import {
  ADBLOCK_PAGE_CATEGORY,
  ADBLOCK_PAGE_NAME,
  ADBLOCK_PAGE_PATH,
} from '../../../src/constants/app';

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
      expect(analytics.customContextStore.get()).toEqual({});
    });

    it('uses the shared custom context state across Analytics components', () => {
      const otherAnalytics = new Analytics();
      analytics.customContextStore.set({ region: 'EU' });

      expect(otherAnalytics.customContextStore).not.toBe(analytics.customContextStore);
      expect(otherAnalytics.customContextStore.get()).toEqual({ region: 'EU' });
    });
  });

  describe('custom context APIs', () => {
    it('delegates set, get, and clear to the custom context store after load', () => {
      const update = { region: 'EU' };
      const setSpy = jest.spyOn(analytics.customContextStore, 'set');
      const getSpy = jest.spyOn(analytics.customContextStore, 'get');
      const clearSpy = jest.spyOn(analytics.customContextStore, 'clear');
      state.lifecycle.loaded.value = true;

      analytics.setCustomContext(update);
      expect(analytics.getCustomContext()).toEqual(update);
      analytics.clearCustomContext();

      expect(setSpy).toHaveBeenCalledWith(update);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(clearSpy).toHaveBeenCalledTimes(1);
    });

    it('buffers set and clear with event calls in invocation order before load', () => {
      const update = { region: 'EU' };
      const setSpy = jest.spyOn(analytics.customContextStore, 'set');
      const clearSpy = jest.spyOn(analytics.customContextStore, 'clear');

      analytics.setCustomContext(update);
      analytics.track({ name: 'buffered-event' });
      analytics.clearCustomContext();

      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([
        ['setCustomContext', update],
        ['track', { name: 'buffered-event' }],
        ['clearCustomContext'],
      ]);
      expect(setSpy).not.toHaveBeenCalled();
      expect(clearSpy).not.toHaveBeenCalled();

      analytics.prepareInternalServices();
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');
      state.lifecycle.loaded.value = true;
      analytics.processBufferedEvents();

      expect(setSpy).toHaveBeenCalledWith(update);
      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(setSpy.mock.invocationCallOrder[0]).toBeLessThan(
        addEventSpy.mock.invocationCallOrder[0]!,
      );
      expect(addEventSpy.mock.invocationCallOrder[0]).toBeLessThan(
        clearSpy.mock.invocationCallOrder[0]!,
      );
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
    });

    it('returns a fresh empty object while pre-load updates remain buffered', () => {
      analytics.setCustomContext({ region: 'EU' });

      const firstResult = analytics.getCustomContext();
      const secondResult = analytics.getCustomContext();

      expect(firstResult).toEqual({});
      expect(secondResult).toEqual({});
      expect(firstResult).not.toBe(secondResult);
    });

    it('keeps buffered custom context calls pending when load is invalid', () => {
      const update = { region: 'EU' };
      analytics.setCustomContext(update);

      analytics.load('', 'invalid-url');

      expect(state.lifecycle.status.value).toBeUndefined();
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([
        ['setCustomContext', update],
      ]);
      expect(analytics.getCustomContext()).toEqual({});
    });

    it('replays preloaded set and clear calls against the Analytics instance in order', () => {
      const setSpy = jest.spyOn(analytics.customContextStore, 'set');
      const clearSpy = jest.spyOn(analytics.customContextStore, 'clear');

      analytics.enqueuePreloadBufferEvents([
        ['setCustomContext', { region: 'EU' }],
        ['clearCustomContext'],
      ]);
      analytics.processDataInPreloadBuffer();

      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([
        ['setCustomContext', { region: 'EU' }],
        ['clearCustomContext'],
      ]);
      expect(setSpy).not.toHaveBeenCalled();
      expect(clearSpy).not.toHaveBeenCalled();

      state.lifecycle.loaded.value = true;
      analytics.processBufferedEvents();

      expect(setSpy).toHaveBeenCalledWith({ region: 'EU' });
      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(setSpy.mock.invocationCallOrder[0]).toBeLessThan(
        clearSpy.mock.invocationCallOrder[0]!,
      );
      expect(analytics.getCustomContext()).toEqual({});
    });
  });

  describe('processBufferedEvent', () => {
    it('dispatches every supported buffered event with the correct arguments', () => {
      const callback = jest.fn();
      const preservedContext = { region: 'EU' };
      const customIntegration: RSACustomIntegration = {
        init: jest.fn(),
        isReady: jest.fn(() => true),
        track: jest.fn(),
        page: jest.fn(),
        identify: jest.fn(),
        group: jest.fn(),
        alias: jest.fn(),
      };
      const spies = {
        setCustomContext: jest.spyOn(analytics, 'setCustomContext').mockImplementation(),
        clearCustomContext: jest.spyOn(analytics, 'clearCustomContext').mockImplementation(),
        ready: jest.spyOn(analytics, 'ready').mockImplementation(),
        page: jest.spyOn(analytics, 'page').mockImplementation(),
        track: jest.spyOn(analytics, 'track').mockImplementation(),
        identify: jest.spyOn(analytics, 'identify').mockImplementation(),
        alias: jest.spyOn(analytics, 'alias').mockImplementation(),
        group: jest.spyOn(analytics, 'group').mockImplementation(),
        reset: jest.spyOn(analytics, 'reset').mockImplementation(),
        setAnonymousId: jest.spyOn(analytics, 'setAnonymousId').mockImplementation(),
        startSession: jest.spyOn(analytics, 'startSession').mockImplementation(),
        endSession: jest.spyOn(analytics, 'endSession').mockImplementation(),
        consent: jest.spyOn(analytics, 'consent').mockImplementation(),
        addCustomIntegration: jest.spyOn(analytics, 'addCustomIntegration').mockImplementation(),
      };
      const cases: Array<{
        event: BufferedEvent;
        spy: jest.SpyInstance;
        expectedArguments: unknown[];
      }> = [
        {
          event: ['setCustomContext', { agentId: 'agent-1' }],
          spy: spies.setCustomContext,
          expectedArguments: [{ agentId: 'agent-1' }],
        },
        { event: ['clearCustomContext'], spy: spies.clearCustomContext, expectedArguments: [] },
        { event: ['ready', callback], spy: spies.ready, expectedArguments: [callback, true] },
        {
          event: ['page', { name: 'Docs' }, preservedContext],
          spy: spies.page,
          expectedArguments: [{ name: 'Docs' }, true, preservedContext],
        },
        {
          event: ['track', { name: 'Viewed Docs' }, preservedContext],
          spy: spies.track,
          expectedArguments: [{ name: 'Viewed Docs' }, true, preservedContext],
        },
        {
          event: ['identify', { userId: 'user-1' }, preservedContext],
          spy: spies.identify,
          expectedArguments: [{ userId: 'user-1' }, true, preservedContext],
        },
        {
          event: ['alias', { to: 'user-1' }, preservedContext],
          spy: spies.alias,
          expectedArguments: [{ to: 'user-1' }, true, preservedContext],
        },
        {
          event: ['group', { groupId: 'group-1' }, preservedContext],
          spy: spies.group,
          expectedArguments: [{ groupId: 'group-1' }, true, preservedContext],
        },
        { event: ['reset', true], spy: spies.reset, expectedArguments: [true, true] },
        {
          event: ['setAnonymousId', 'anonymous-1', 'linker-1'],
          spy: spies.setAnonymousId,
          expectedArguments: ['anonymous-1', 'linker-1', true],
        },
        {
          event: ['startSession', 123],
          spy: spies.startSession,
          expectedArguments: [123, true],
        },
        { event: ['endSession'], spy: spies.endSession, expectedArguments: [true] },
        {
          event: ['consent', { sendPageEvent: true }],
          spy: spies.consent,
          expectedArguments: [{ sendPageEvent: true }, true],
        },
        {
          event: ['addCustomIntegration', 'destination-1', customIntegration],
          spy: spies.addCustomIntegration,
          expectedArguments: ['destination-1', customIntegration, true],
        },
      ];

      cases.forEach(({ event, spy, expectedArguments }) => {
        analytics.processBufferedEvent(event);

        expect(spy).toHaveBeenCalledWith(...expectedArguments);
      });

      Object.values(spies).forEach(spy => {
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    it('ignores an unsupported buffered event', () => {
      const unsupportedEvent = ['unsupported'] as unknown as BufferedEvent;

      expect(analytics.processBufferedEvent(unsupportedEvent)).toBe(unsupportedEvent);
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

      state.nativeDestinations.clientDestinationsReady.value = false;
      state.lifecycle.status.value = 'initialized';
      expect(onInitializedSpy).toHaveBeenCalledTimes(2);
      expect(state.lifecycle.status.value).toBe('readyExecuted');

      state.nativeDestinations.clientDestinationsReady.value = false;
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

    it('seeds valid custom context before starting the lifecycle', () => {
      const startLifecycleSpy = jest.spyOn(analytics, 'startLifecycle').mockImplementation();
      const capturedAt = new Date('2026-07-21T00:00:00.000Z');
      const context = {
        region: 'EU',
        account: { plan: undefined, seats: 5 },
        capturedAt,
      };
      const loadOptions = {
        logLevel: 'ERROR' as const,
        context,
      };

      analytics.load(dummyWriteKey, sampleDataPlaneUrl, loadOptions);
      capturedAt.setUTCFullYear(2030);

      expect(analytics.customContextStore.get()).toEqual({
        region: 'EU',
        account: { seats: 5 },
        capturedAt: new Date('2026-07-21T00:00:00.000Z'),
      });
      expect(loadOptions.context).toBe(context);
      expect(state.loadOptions.value).not.toHaveProperty('context');
      expect(startLifecycleSpy).toHaveBeenCalledTimes(1);
    });

    it('seeds load-time context before replaying buffered context updates', () => {
      jest.spyOn(analytics, 'startLifecycle').mockImplementation();

      analytics.setCustomContext({ account: { plan: 'pro' } });
      analytics.load(dummyWriteKey, sampleDataPlaneUrl, {
        logLevel: 'ERROR',
        context: { region: 'EU', account: { source: 'load' } },
      });

      expect(analytics.getCustomContext()).toEqual({
        region: 'EU',
        account: { source: 'load' },
      });

      state.lifecycle.loaded.value = true;
      analytics.processBufferedEvents();

      expect(analytics.getCustomContext()).toEqual({
        region: 'EU',
        account: { source: 'load', plan: 'pro' },
      });
    });

    it('continues loading with an empty store when initial custom context is invalid', () => {
      const startLifecycleSpy = jest.spyOn(analytics, 'startLifecycle').mockImplementation();
      const loggerWarnSpy = jest.spyOn(analytics.logger, 'warn');

      analytics.load(dummyWriteKey, sampleDataPlaneUrl, {
        logLevel: 'ERROR',
        context: new Map([['key', 'value']]) as any,
      });

      expect(analytics.customContextStore.get()).toEqual({});
      expect(startLifecycleSpy).toHaveBeenCalledTimes(1);
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'CustomContext:: Invalid custom context. Use a plain object without prototype pollution keys.',
      );
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

      analytics.load('', sampleDataPlaneUrl, {
        logLevel: 'ERROR',
        context: { region: 'EU' },
      });

      expect(state.lifecycle.status.value).toBeUndefined();
      expect(analytics.customContextStore.get()).toEqual({});
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
      const initSpy = jest.spyOn(analytics.configManager!, 'init');
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
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        new CustomEvent('RSA_Initialised', {
          detail: { analyticsInstance: undefined },
        }),
      );
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
      expect(onReadySpy).not.toHaveBeenCalled();

      onReadySpy.mockRestore();
    });
  });

  describe('loadDestinations', () => {
    beforeEach(() => {
      analytics.prepareInternalServices();
    });

    it('should not load destinations when lifecycle status is destinationsLoading', () => {
      state.lifecycle.status.value = 'destinationsLoading';

      const invokeSingleSpy = jest.spyOn(
        analytics.pluginsManager as IPluginsManager,
        'invokeSingle',
      );

      analytics.loadDestinations();

      expect(invokeSingleSpy).not.toHaveBeenCalled();
    });

    it('should not load destinations when clientDestinationsReady is true', () => {
      state.nativeDestinations.clientDestinationsReady.value = true;

      const invokeSingleSpy = jest.spyOn(
        analytics.pluginsManager as IPluginsManager,
        'invokeSingle',
      );

      analytics.loadDestinations();

      expect(invokeSingleSpy).not.toHaveBeenCalled();
    });

    it('should set both destinationsReady and clientDestinationsReady when there are zero active destinations', () => {
      state.nativeDestinations.clientDestinationsReady.value = false;
      state.nativeDestinations.activeDestinations.value = [];
      state.lifecycle.status.value = 'loaded';

      const invokeSingleSpy = jest.spyOn(
        analytics.pluginsManager as IPluginsManager,
        'invokeSingle',
      );

      analytics.loadDestinations();

      // Should call setActiveDestinations
      expect(invokeSingleSpy).toHaveBeenCalledWith(
        'nativeDestinations.setActiveDestinations',
        state,
        analytics.pluginsManager,
        analytics.errorHandler,
        analytics.logger,
      );

      // Should set both flags when activeDestinations is empty
      expect(state.lifecycle.status.value).toBe('destinationsReady');
      expect(state.nativeDestinations.clientDestinationsReady.value).toBe(true);
    });

    it('should return early when called multiple times with zero active destinations', () => {
      state.nativeDestinations.clientDestinationsReady.value = false;
      state.nativeDestinations.activeDestinations.value = [];
      state.lifecycle.status.value = 'loaded';

      const invokeSingleSpy = jest.spyOn(
        analytics.pluginsManager as IPluginsManager,
        'invokeSingle',
      );

      // First call - should process
      analytics.loadDestinations();
      expect(invokeSingleSpy).toHaveBeenCalledTimes(1);
      expect(state.nativeDestinations.clientDestinationsReady.value).toBe(true);

      invokeSingleSpy.mockClear();

      // Second call - should return early because clientDestinationsReady is now true
      analytics.loadDestinations();
      expect(invokeSingleSpy).not.toHaveBeenCalled();
    });

    it('should load destinations when there are active destinations to load', () => {
      state.nativeDestinations.clientDestinationsReady.value = false;
      state.nativeDestinations.activeDestinations.value = [
        { id: 'destination-1' },
        { id: 'destination-2' },
      ];
      state.lifecycle.status.value = 'loaded';

      const invokeSingleSpy = jest.spyOn(
        analytics.pluginsManager as IPluginsManager,
        'invokeSingle',
      );

      analytics.loadDestinations();

      // Should call setActiveDestinations
      expect(invokeSingleSpy).toHaveBeenCalledWith(
        'nativeDestinations.setActiveDestinations',
        state,
        analytics.pluginsManager,
        analytics.errorHandler,
        analytics.logger,
      );

      // Should proceed to load destinations
      expect(invokeSingleSpy).toHaveBeenCalledWith(
        'nativeDestinations.load',
        state,
        analytics.externalSrcLoader,
        analytics.errorHandler,
        analytics.logger,
      );

      // Should set lifecycle status to destinationsLoading
      expect(state.lifecycle.status.value).toBe('destinationsLoading');
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
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        new CustomEvent('RSA_Ready', {
          detail: { analyticsInstance: undefined },
        }),
      );
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
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([['page', { name: 'name' }]]);
    });
    it('should sent events if loaded', () => {
      analytics.prepareInternalServices();
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');

      state.lifecycle.loaded.value = true;
      analytics.page({ name: 'name' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(addEventSpy).toHaveBeenCalledWith(
        {
          type: 'page',
          name: 'name',
        },
        {},
      );
    });

    it('enriches an automatic adblock page event with current custom context', () => {
      analytics.prepareInternalServices();
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');
      analytics.customContextStore.set({ region: 'EU' });
      state.lifecycle.loaded.value = true;
      state.capabilities.isAdBlocked.value = true;

      analytics.page({ name: 'customer-page' });

      expect(addEventSpy).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: 'page',
          category: ADBLOCK_PAGE_CATEGORY,
          name: ADBLOCK_PAGE_NAME,
          properties: expect.objectContaining({ path: ADBLOCK_PAGE_PATH }),
        }),
        { region: 'EU' },
      );
    });

    it('uses the captured context for an automatic adblock page event during replay', () => {
      analytics.prepareInternalServices();
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');
      state.lifecycle.loaded.value = true;
      state.capabilities.isAdBlocked.value = true;
      state.eventBuffer.toBeProcessedArray.value = [
        ['page', { name: 'customer-page' }, { region: 'before' }],
      ];
      analytics.customContextStore.set({ region: 'after' });

      analytics.processBufferedEvents();

      expect(addEventSpy).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: 'page',
          name: 'customer-page',
        }),
        { region: 'before' },
      );
      expect(addEventSpy).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: 'page',
          category: ADBLOCK_PAGE_CATEGORY,
          name: ADBLOCK_PAGE_NAME,
          properties: expect.objectContaining({ path: ADBLOCK_PAGE_PATH }),
        }),
        { region: 'before' },
      );
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
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');

      state.lifecycle.loaded.value = true;
      analytics.track({ name: 'name' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(addEventSpy).toHaveBeenCalledWith(
        {
          type: 'track',
          name: 'name',
        },
        {},
      );
    });

    it('captures context when a buffered event reaches its ordered replay position', () => {
      analytics.prepareInternalServices();
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');

      analytics.track({ name: 'before-update' });
      analytics.setCustomContext({ version: 'updated' });
      analytics.track({ name: 'after-update' });
      analytics.clearCustomContext();
      analytics.track({ name: 'after-clear' });

      analytics.customContextStore.set({ version: 'load-time' });
      state.lifecycle.loaded.value = true;
      analytics.processBufferedEvents();

      expect(addEventSpy).toHaveBeenNthCalledWith(
        1,
        { type: 'track', name: 'before-update' },
        { version: 'load-time' },
      );
      expect(addEventSpy).toHaveBeenNthCalledWith(
        2,
        { type: 'track', name: 'after-update' },
        { version: 'updated' },
      );
      expect(addEventSpy).toHaveBeenNthCalledWith(3, { type: 'track', name: 'after-clear' }, {});
    });

    it('retains a context snapshot supplied by a later internal buffering stage', () => {
      analytics.prepareInternalServices();
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');
      state.eventBuffer.toBeProcessedArray.value = [
        ['track', { name: 'internally-buffered' }, { version: 'captured' }],
      ];
      analytics.customContextStore.set({ version: 'current' });

      state.lifecycle.loaded.value = true;
      analytics.processBufferedEvents();

      expect(addEventSpy).toHaveBeenCalledWith(
        { type: 'track', name: 'internally-buffered' },
        { version: 'captured' },
      );
    });

    it('filters reserved keys from a context snapshot supplied by an internal buffering stage', () => {
      analytics.prepareInternalServices();
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');
      state.eventBuffer.toBeProcessedArray.value = [
        [
          'track',
          { name: 'internally-buffered' },
          { agentId: 'agent-1', library: { name: 'override' } },
        ],
      ];

      state.lifecycle.loaded.value = true;
      analytics.processBufferedEvents();

      expect(addEventSpy).toHaveBeenCalledWith(
        { type: 'track', name: 'internally-buffered' },
        { agentId: 'agent-1' },
      );
    });

    it('rejects an unsafe context snapshot supplied by an internal buffering stage', () => {
      analytics.prepareInternalServices();
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');
      const unsafeContext = JSON.parse('{"nested":{"__proto__":{"polluted":true}}}');
      state.eventBuffer.toBeProcessedArray.value = [
        ['track', { name: 'internally-buffered' }, unsafeContext],
      ];

      state.lifecycle.loaded.value = true;
      analytics.processBufferedEvents();

      expect(addEventSpy).toHaveBeenCalledWith({ type: 'track', name: 'internally-buffered' }, {});
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
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');
      const setUserIdSpy = jest.spyOn(analytics.userSessionManager!, 'setUserId');
      const setUserTraitsSpy = jest.spyOn(analytics.userSessionManager!, 'setUserTraits');
      const resetSpy = jest.spyOn(analytics, 'reset');

      state.lifecycle.loaded.value = true;
      state.session.userId.value = 'userId';
      analytics.identify({ userId: 'userId' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(setUserIdSpy).toHaveBeenCalledTimes(1);
      expect(setUserTraitsSpy).toHaveBeenCalledTimes(1);
      expect(resetSpy).toHaveBeenCalledTimes(0);
      expect(addEventSpy).toHaveBeenCalledWith(
        {
          type: 'identify',
          userId: 'userId',
        },
        {},
      );
    });
    it('should sent events if loaded and reset session if userID changed', () => {
      analytics.prepareInternalServices();
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');
      const setUserIdSpy = jest.spyOn(analytics.userSessionManager!, 'setUserId');
      const setUserTraitsSpy = jest.spyOn(analytics.userSessionManager!, 'setUserTraits');
      const resetSpy = jest.spyOn(analytics, 'reset');

      state.lifecycle.loaded.value = true;
      state.session.userId.value = 'dummyUserId';
      analytics.identify({ userId: 'userId' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(2);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(setUserIdSpy).toHaveBeenCalledTimes(1);
      expect(setUserTraitsSpy).toHaveBeenCalledTimes(1);
      expect(resetSpy).toHaveBeenCalledTimes(1);
      expect(addEventSpy).toHaveBeenCalledWith(
        {
          type: 'identify',
          userId: 'userId',
        },
        {},
      );
    });
  });

  describe('alias', () => {
    it('should buffer events until loaded', () => {
      analytics.alias({ to: 'to' });
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([
        ['alias', { to: 'to' }],
      ]);
    });
    it('should sent events if loaded', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      analytics.prepareInternalServices();
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');

      state.lifecycle.loaded.value = true;

      analytics.alias({ to: 'to', from: 'x' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(addEventSpy).toHaveBeenCalledWith(
        {
          type: 'alias',
          to: 'to',
          from: 'x',
        },
        {},
      );
    });

    it('should use the user ID if from is not provided', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      analytics.prepareInternalServices();
      state.session.userId.value = 'userId';
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');
      state.lifecycle.loaded.value = true;

      analytics.alias({ to: 'to' });

      expect(addEventSpy).toHaveBeenCalledWith(
        {
          type: 'alias',
          to: 'to',
          from: 'userId',
        },
        {},
      );
    });

    it('should use the anonymous ID if user ID is not set', () => {
      state.storage.entries.value = entriesWithOnlyCookieStorage;
      analytics.prepareInternalServices();
      state.session.userId.value = null;
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');
      state.lifecycle.loaded.value = true;

      analytics.alias({ to: 'to' });

      expect(addEventSpy).toHaveBeenCalledWith(
        {
          type: 'alias',
          to: 'to',
          from: 'test_uuid',
        },
        {},
      );
    });
  });

  describe('group', () => {
    it('should buffer events until loaded', () => {
      analytics.prepareInternalServices();
      const setGroupIdIdSpy = jest.spyOn(analytics.userSessionManager!, 'setGroupId');
      const setGroupTraitsSpy = jest.spyOn(analytics.userSessionManager!, 'setGroupTraits');

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
      const setGroupIdIdSpy = jest.spyOn(analytics.userSessionManager!, 'setGroupId');
      const setGroupTraitsSpy = jest.spyOn(analytics.userSessionManager!, 'setGroupTraits');
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');

      state.lifecycle.loaded.value = true;
      analytics.group({ groupId: 'groupId' });
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(setGroupIdIdSpy).toHaveBeenCalledTimes(1);
      expect(setGroupTraitsSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(addEventSpy).toHaveBeenCalledWith(
        {
          type: 'group',
          groupId: 'groupId',
        },
        {},
      );
    });
  });

  describe('reset', () => {
    it('should buffer events until loaded', () => {
      analytics.prepareInternalServices();
      const resetSpy = jest.spyOn(analytics.userSessionManager!, 'reset');

      analytics.reset({
        entries: {
          anonymousId: true,
        },
      });
      expect(resetSpy).toHaveBeenCalledTimes(0);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([
        ['reset', { entries: { anonymousId: true } }],
      ]);
    });

    it('should reset session if loaded', () => {
      analytics.prepareInternalServices();
      const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
      const resetSpy = jest.spyOn(analytics.userSessionManager!, 'reset');
      analytics.customContextStore.set({ region: 'EU' });

      state.lifecycle.loaded.value = true;
      analytics.reset(true);
      expect(leaveBreadcrumbSpy).toHaveBeenCalledTimes(1);
      expect(resetSpy).toHaveBeenCalledTimes(1);
      expect(state.eventBuffer.toBeProcessedArray.value).toStrictEqual([]);
      expect(analytics.customContextStore.get()).toEqual({ region: 'EU' });
    });

    it('should process the preload buffer', () => {
      analytics.prepareInternalServices();
      const enqueueSpy = jest.spyOn(analytics.preloadBuffer, 'enqueue');
      const dequeueSpy = jest
        .spyOn(analytics.preloadBuffer, 'dequeue')
        .mockImplementationOnce(() => ['page', { path: '/home' }])
        .mockImplementationOnce(() => ['track', 'buttonClicked', { color: 'blue' }]);
      jest
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

    it('captures load-time context when processing preloaded event calls', () => {
      jest.spyOn(analytics, 'startLifecycle').mockImplementation();
      analytics.prepareInternalServices();
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');

      analytics.enqueuePreloadBufferEvents([
        ['identify', 'preloaded-user', { source: 'query-string' }],
        ['track', 'preloaded-event', { source: 'preload-buffer' }],
      ]);
      analytics.load(dummyWriteKey, dummyDataplaneURL, {
        context: { region: 'EU', source: 'load-time' },
      });
      state.lifecycle.loaded.value = true;

      analytics.processDataInPreloadBuffer();

      expect(addEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'identify',
          userId: 'preloaded-user',
        }),
        { region: 'EU', source: 'load-time' },
      );
      expect(addEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'track',
          name: 'preloaded-event',
        }),
        { region: 'EU', source: 'load-time' },
      );
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
      analytics.customContextStore.set({ consentRegion: 'EU' });

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
          { consentRegion: 'EU' },
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
          { consentRegion: 'EU' },
        ],
      ]);
    });

    it('replays consent-generated events with the context captured when queued', () => {
      analytics.prepareInternalServices();
      const addEventSpy = jest.spyOn(analytics.eventManager!, 'addEvent');
      analytics.customContextStore.set({ consentRegion: 'before' });
      state.consents.enabled.value = true;
      state.lifecycle.loaded.value = true;
      state.consents.initialized.value = false;

      analytics.consent({ trackConsent: true }, true);
      analytics.customContextStore.set({ consentRegion: 'after' });
      analytics.processBufferedEvents();

      expect(addEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'track',
          name: 'Consent Management Interaction',
        }),
        { consentRegion: 'before' },
      );
      expect(analytics.customContextStore.get()).toEqual({ consentRegion: 'after' });
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

  describe('addCustomIntegration', () => {
    const mockCustomIntegration: RSACustomIntegration = {
      init: jest.fn(),
      isReady: jest.fn(() => true),
      track: jest.fn(),
      page: jest.fn(),
      identify: jest.fn(),
      group: jest.fn(),
      alias: jest.fn(),
    };

    beforeEach(() => {
      analytics.prepareInternalServices();
      state.lifecycle.loaded.value = false;
      state.eventBuffer.toBeProcessedArray.value = [];
    });

    describe('when the call is not buffered', () => {
      it('should buffer the addCustomIntegration call when SDK is not loaded', () => {
        const destinationId = 'custom-dest-123';

        analytics.addCustomIntegration(destinationId, mockCustomIntegration);

        expect(state.eventBuffer.toBeProcessedArray.value).toEqual([
          ['addCustomIntegration', destinationId, mockCustomIntegration],
        ]);
      });

      it('should add to existing buffered events when SDK is not loaded', () => {
        const destinationId = 'custom-dest-123';
        state.eventBuffer.toBeProcessedArray.value = [['track', { name: 'some_event' }]];

        analytics.addCustomIntegration(destinationId, mockCustomIntegration);

        expect(state.eventBuffer.toBeProcessedArray.value).toEqual([
          ['track', { name: 'some_event' }],
          ['addCustomIntegration', destinationId, mockCustomIntegration],
        ]);
      });

      it('should log error and return early when SDK is already loaded', () => {
        state.lifecycle.loaded.value = true;
        const loggerErrorSpy = jest.spyOn(analytics.logger, 'error');
        const invokeSingleSpy = jest.spyOn(
          analytics.pluginsManager as IPluginsManager,
          'invokeSingle',
        );

        const destinationId = 'custom-dest-123';

        analytics.addCustomIntegration(destinationId, mockCustomIntegration);

        expect(loggerErrorSpy).toHaveBeenCalledWith(
          'AnalyticsCore:: Cannot add custom integration for destination ID "custom-dest-123" after the SDK is loaded.',
        );
        expect(invokeSingleSpy).not.toHaveBeenCalled();
        expect(state.eventBuffer.toBeProcessedArray.value).toEqual([]);
      });

      it('should not leave breadcrumb when isBufferedInvocation is false', () => {
        const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');

        analytics.addCustomIntegration('custom-dest-123', mockCustomIntegration);

        expect(leaveBreadcrumbSpy).not.toHaveBeenCalled();
      });

      it('should not invoke plugin manager when isBufferedInvocation is false', () => {
        const invokeSingleSpy = jest.spyOn(
          analytics.pluginsManager as IPluginsManager,
          'invokeSingle',
        );

        analytics.addCustomIntegration('custom-dest-123', mockCustomIntegration);

        expect(invokeSingleSpy).not.toHaveBeenCalled();
      });
    });

    describe('when the call is buffered', () => {
      it('should leave breadcrumb and invoke plugin manager', () => {
        const leaveBreadcrumbSpy = jest.spyOn(analytics.errorHandler, 'leaveBreadcrumb');
        const invokeSingleSpy = jest.spyOn(
          analytics.pluginsManager as IPluginsManager,
          'invokeSingle',
        );

        const destinationId = 'custom-dest-123';

        analytics.addCustomIntegration(destinationId, mockCustomIntegration, true);

        expect(leaveBreadcrumbSpy).toHaveBeenCalledWith('New addCustomIntegration invocation');
        expect(invokeSingleSpy).toHaveBeenCalledWith(
          'nativeDestinations.addCustomIntegration',
          destinationId,
          mockCustomIntegration,
          state,
          analytics.logger,
        );
      });

      it('should handle undefined plugin manager gracefully', () => {
        const originalPluginsManager = analytics.pluginsManager;
        analytics.pluginsManager = undefined;

        expect(() => {
          analytics.addCustomIntegration('custom-dest-123', mockCustomIntegration, true);
        }).not.toThrow();

        // Restore the original plugins manager
        analytics.pluginsManager = originalPluginsManager;
      });
    });
  });
});
