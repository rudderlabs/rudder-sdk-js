import type { LoadOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { resetState, state } from '../../src/state';
import { RudderAnalytics } from '../../src/app/RudderAnalytics';
import { Analytics } from '../../src/components/core/Analytics';

jest.mock('../../src/components/core/Analytics');

describe('Core - Rudder Analytics Facade', () => {
  let analyticsInstanceMock: Analytics;
  let rudderAnalytics: RudderAnalytics;
  const mockLoadOptions = {
    integrations: {
      All: false,
    },
  } as LoadOptions;

  beforeEach(() => {
    analyticsInstanceMock = new Analytics() as jest.Mocked<Analytics>;
    (window as any).rudderanalytics = [
      ['track'],
      ['consent', { sendPageEvent: true }],
      ['load', 'dummyWriteKey', 'dummyDataPlaneUrl', { option1: true }],
      ['consent', { sendPageEvent: false }],
      ['track'],
    ];
    rudderAnalytics = new RudderAnalytics();
    (rudderAnalytics as any).analyticsInstances = { writeKey: analyticsInstanceMock };
    (rudderAnalytics as any).defaultAnalyticsKey = 'writeKey';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return the global singleton from "rudderanalytics" global object', () => {
    const expectedPreloadedEvents = [
      ['consent', { sendPageEvent: true }],
      ['consent', { sendPageEvent: false }],
      ['track'],
      ['track'],
    ];
    const globalSingleton = rudderAnalytics;

    expect(window.RudderStackGlobals?.app?.preloadedEventsBuffer).toEqual(expectedPreloadedEvents);
    expect(window.rudderanalytics).toEqual(globalSingleton);
  });

  it('should retrieve all preloaded events and set to global', () => {
    expect((window as any).RudderStackGlobals.app.preloadedEventsBuffer).toEqual([
      ['consent', { sendPageEvent: true }],
      ['consent', { sendPageEvent: false }],
      ['track'],
      ['track'],
    ]);
  });

  it('should return the global singleton if it exists', () => {
    const globalSingleton = rudderAnalytics;
    rudderAnalytics = new RudderAnalytics();

    expect(rudderAnalytics).toEqual(globalSingleton);
  });

  it('should dispatch an error event if an exception is thrown during the construction', () => {
    const originalSingleton = RudderAnalytics.globalSingleton;

    RudderAnalytics.globalSingleton = null;

    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Explicitly throw an error during the construction
    const nowSpy = jest.spyOn(Date, 'now').mockImplementation(() => {
      throw new Error('Error in now function');
    });

    // eslint-disable-next-line sonarjs/constructor-for-side-effects, no-new
    new RudderAnalytics();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in now function'),
      }),
    );

    RudderAnalytics.globalSingleton = originalSingleton;
    nowSpy.mockRestore();

    dispatchEventSpy.mockRestore();
  });

  it('should auto set the default analytics key if no analytics instances exist', () => {
    (rudderAnalytics as any).analyticsInstances = {};
    (rudderAnalytics as any).defaultAnalyticsKey = '';

    rudderAnalytics.setDefaultInstanceKey('writeKey');

    expect(rudderAnalytics.defaultAnalyticsKey).toEqual('writeKey');
  });

  it('should set the default analytics key even if analytics instances exist', () => {
    rudderAnalytics.setDefaultInstanceKey('writeKey2');

    expect(rudderAnalytics.defaultAnalyticsKey).toEqual('writeKey2');
  });

  it('should not set default analytics key if the key is not a valid string', () => {
    rudderAnalytics.setDefaultInstanceKey('');

    expect(rudderAnalytics.defaultAnalyticsKey).toEqual('writeKey');
  });

  it('should return an existing analytics instance', () => {
    expect(rudderAnalytics.getAnalyticsInstance('writeKey')).toStrictEqual(analyticsInstanceMock);
  });

  it('should create a new analytics instance if none exists', () => {
    (rudderAnalytics as any).analyticsInstances = {};
    (rudderAnalytics as any).defaultAnalyticsKey = '';
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance('writeKey');

    expect(analyticsInstance).toBeInstanceOf(Analytics);
  });

  it('should create a new analytics instance with the default key if none is provided', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();

    expect(analyticsInstance).toBeInstanceOf(Analytics);
    expect(rudderAnalytics.analyticsInstances).toHaveProperty('writeKey', analyticsInstance);
  });

  it('should not create a new analytics instance if one already exists for the write key', () => {
    const analyticsInstance = analyticsInstanceMock;
    rudderAnalytics.analyticsInstances = { writeKey: analyticsInstance };
    rudderAnalytics.load('writeKey', 'data-plane-url');

    expect(rudderAnalytics.getAnalyticsInstance('writeKey')).toStrictEqual(analyticsInstance);
  });

  it('should return undefined and log error if an exception is thrown while getting the analytics instance', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally set the parameter to undefined to trigger an error
    (rudderAnalytics as any).analyticsInstances = undefined;

    const result = rudderAnalytics.getAnalyticsInstance('writeKey2');

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new TypeError("Cannot read properties of undefined (reading 'writeKey2')"),
      }),
    );

    expect(result).toBeUndefined();

    dispatchEventSpy.mockRestore();
  });

  it('should set the default analytics key if none has been set', () => {
    rudderAnalytics.load('writeKey', 'data-plane-url');

    expect(rudderAnalytics.defaultAnalyticsKey).toEqual('writeKey');
  });

  it('should create a new analytics instance with the write key on load and trigger its load method', () => {
    const trackPageLifecycleEventsSpy = jest.spyOn(rudderAnalytics, 'trackPageLifecycleEvents');

    rudderAnalytics.analyticsInstances = {};
    rudderAnalytics.defaultAnalyticsKey = '';
    rudderAnalytics.load('writeKey', 'data-plane-url', mockLoadOptions);
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance('writeKey') as Analytics;
    const loadSpy = jest.spyOn(analyticsInstance, 'load');

    expect(rudderAnalytics.analyticsInstances).toHaveProperty('writeKey', analyticsInstance);
    expect(loadSpy).toHaveBeenCalledWith('writeKey', 'data-plane-url', mockLoadOptions);
    expect(trackPageLifecycleEventsSpy).toHaveBeenCalledWith(mockLoadOptions);

    trackPageLifecycleEventsSpy.mockRestore();
    loadSpy.mockRestore();
  });

  it('should dispatch an error event if an exception is thrown during the load', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally set the parameter to undefined to trigger an error
    (rudderAnalytics as any).analyticsInstances = undefined;

    rudderAnalytics.defaultAnalyticsKey = '';
    rudderAnalytics.load('writeKey', 'data-plane-url', mockLoadOptions);

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new TypeError("Cannot read properties of undefined (reading 'writeKey')"),
      }),
    );

    dispatchEventSpy.mockRestore();
  });

  it('should process ready arguments and forwards to ready call', () => {
    const callback = () => console.log('Ready!');

    rudderAnalytics.ready(callback);
    expect(analyticsInstanceMock.ready).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should dispatch an error event if an exception is thrown during the ready call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the ready call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    const callback = () => console.log('Ready!');

    rudderAnalytics.ready(callback);

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    dispatchEventSpy.mockRestore();
    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should process page arguments and forwards to page call', () => {
    rudderAnalytics.page('category');
    expect(analyticsInstanceMock.page).toHaveBeenCalledWith({
      name: 'category',
      properties: { name: 'category' },
    });
  });

  it('should dispatch an error event if an exception is thrown during the page call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the page call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    rudderAnalytics.page('category');

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should process track arguments and forwards to track call', () => {
    rudderAnalytics.track('event');
    expect(analyticsInstanceMock.track).toHaveBeenCalledWith({ name: 'event', properties: {} });
  });

  it('should dispatch an error event if an exception is thrown during the track call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the track call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    rudderAnalytics.track('event');

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should process identify arguments and forwards to identify call', () => {
    rudderAnalytics.identify('1234');
    expect(analyticsInstanceMock.identify).toHaveBeenCalledWith({ userId: '1234' });
  });

  it('should dispatch an error event if an exception is thrown during the identify call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the identify call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    rudderAnalytics.identify('1234');

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should process alias arguments and forwards to alias call', () => {
    rudderAnalytics.alias('abc');
    expect(analyticsInstanceMock.alias).toHaveBeenCalledWith({ to: 'abc' });
  });

  it('should dispatch an error event if an exception is thrown during the alias call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the alias call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    rudderAnalytics.alias('abc');

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should process group arguments and forwards to group call', () => {
    rudderAnalytics.group('5678');
    expect(analyticsInstanceMock.group).toHaveBeenCalledWith({ groupId: '5678' });
  });

  it('should dispatch an error event if an exception is thrown during the group call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the group call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    rudderAnalytics.group('5678');

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should process reset arguments and forwards to reset call', () => {
    rudderAnalytics.reset(true);
    expect(analyticsInstanceMock.reset).toHaveBeenCalledWith(true);
  });

  it('should dispatch an error event if an exception is thrown during the reset call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the reset call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    rudderAnalytics.reset(true);

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should process getAnonymousId arguments and forwards to getAnonymousId call', () => {
    rudderAnalytics.getAnonymousId({
      autoCapture: {
        enabled: true,
      },
    });
    expect(analyticsInstanceMock.getAnonymousId).toHaveBeenCalledWith({
      autoCapture: { enabled: true },
    });
  });

  it('should return undefined and log an error if an exception is thrown during the getAnonymousId call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the getAnonymousId call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    const result = rudderAnalytics.getAnonymousId();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    dispatchEventSpy.mockRestore();
    expect(result).toBeUndefined();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should process setAnonymousId arguments and forwards to setAnonymousId call', () => {
    rudderAnalytics.setAnonymousId('id', 'param');
    expect(analyticsInstanceMock.setAnonymousId).toHaveBeenCalledWith('id', 'param');
  });

  it('should dispatch an error event if an exception is thrown during the setAnonymousId call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the setAnonymousId call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    rudderAnalytics.setAnonymousId('id');

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should process getUserId arguments and forwards to getUserId call', () => {
    rudderAnalytics.getUserId();
    expect(analyticsInstanceMock.getUserId).toHaveBeenCalledTimes(1);
  });

  it('should process getUserTraits arguments and forwards to getUserTraits call', () => {
    rudderAnalytics.getUserTraits();
    expect(analyticsInstanceMock.getUserTraits).toHaveBeenCalledTimes(1);
  });

  it('should process getGroupId arguments and forwards to getGroupId call', () => {
    rudderAnalytics.getGroupId();
    expect(analyticsInstanceMock.getGroupId).toHaveBeenCalledTimes(1);
  });

  it('should process getGroupTraits arguments and forwards to getGroupTraits call', () => {
    rudderAnalytics.getGroupTraits();
    expect(analyticsInstanceMock.getGroupTraits).toHaveBeenCalledTimes(1);
  });

  it('should process startSession arguments and forwards to startSession call', () => {
    rudderAnalytics.startSession(1234);
    expect(analyticsInstanceMock.startSession).toHaveBeenCalledWith(1234);
  });

  it('should dispatch an error event if an exception is thrown during the startSession call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the startSession call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    rudderAnalytics.startSession(1234);

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should process endSession arguments and forwards to endSession call', () => {
    rudderAnalytics.endSession();
    expect(analyticsInstanceMock.endSession).toHaveBeenCalledTimes(1);
  });

  it('should process getSessionId arguments and forwards to getSessionId call', () => {
    rudderAnalytics.getSessionId();
    expect(analyticsInstanceMock.getSessionId).toHaveBeenCalledTimes(1);
  });

  it('should process setAuthToken arguments and forwards to setAuthToken call', () => {
    rudderAnalytics.setAuthToken('token');
    expect(analyticsInstanceMock.setAuthToken).toHaveBeenCalledWith('token');
  });

  it('should dispatch an error event if an exception is thrown during the setAuthToken call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the setAuthToken call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    rudderAnalytics.setAuthToken('token');

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should process consent arguments and forwards to consent call', () => {
    rudderAnalytics.consent({
      consentManagement: {
        allowedConsentIds: ['1'],
        deniedConsentIds: ['2'],
      },
    });
    expect(analyticsInstanceMock.consent).toHaveBeenCalledWith({
      consentManagement: {
        allowedConsentIds: ['1'],
        deniedConsentIds: ['2'],
      },
    });
  });

  it('should dispatch an error event if an exception is thrown during the consent call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the consent call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    rudderAnalytics.consent({
      consentManagement: {
        allowedConsentIds: ['1'],
        deniedConsentIds: ['2'],
      },
    });

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should dispatch an error event if an exception is thrown during the getUserId call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the getUserId call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    const userIdVal = rudderAnalytics.getUserId();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    expect(userIdVal).toBeUndefined();

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should dispatch an error event if an exception is thrown during the getUserTraits call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the getUserTraits call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    const traitsVal = rudderAnalytics.getUserTraits();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    expect(traitsVal).toBeUndefined();

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should dispatch an error event if an exception is thrown during the getGroupId call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the getGroupId call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    const groupId = rudderAnalytics.getGroupId();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    expect(groupId).toBeUndefined();

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should dispatch an error event if an exception is thrown during the getGroupTraits call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the getGroupTraits call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    const traitsVal = rudderAnalytics.getGroupTraits();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    expect(traitsVal).toBeUndefined();

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should dispatch an error event if an exception is thrown during the endSession call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the endSession call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    rudderAnalytics.endSession();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  it('should dispatch an error event if an exception is thrown during the getSessionId call', () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    // Intentionally cause an error during the getSessionId call
    const getAnalyticsInstanceSpy = jest
      .spyOn(rudderAnalytics, 'getAnalyticsInstance')
      .mockImplementation(() => {
        throw new Error('Error in getAnalyticsInstance');
      });

    const sessionId = rudderAnalytics.getSessionId();

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      new ErrorEvent('error', {
        error: new Error('Error in getAnalyticsInstance'),
      }),
    );

    expect(sessionId).toBeUndefined();

    dispatchEventSpy.mockRestore();

    getAnalyticsInstanceSpy.mockRestore();
  });

  describe('trackPageLifecycleEvents', () => {
    let rudderAnalyticsInstance: RudderAnalytics;

    beforeEach(() => {
      (window as any).rudderanalytics = [];
      rudderAnalyticsInstance = new RudderAnalytics();
      rudderAnalyticsInstance.analyticsInstances = {};
    });

    afterEach(() => {
      resetState();
      (rudderAnalyticsInstance as any).globalSingleton = null;
      jest.resetAllMocks();
    });

    const simulatePageBeingUnloadedAfterSDKLoad = (sdkLoaded = true) => {
      // Simulate page being unloaded
      state.lifecycle.loaded.value = sdkLoaded;
      const event = new Event('beforeunload');
      window.dispatchEvent(event);
    };

    it('should inherit properties of autoTrack for page lifecycle events', () => {
      rudderAnalyticsInstance.track = jest.fn();
      rudderAnalyticsInstance.trackPageLifecycleEvents({
        useBeacon: true,
        autoTrack: {
          enabled: true,
          options: { key: 'value' },
        },
      });

      simulatePageBeingUnloadedAfterSDKLoad();

      expect(rudderAnalyticsInstance.track).toHaveBeenCalledWith(
        'Page Unloaded',
        { timeOnPage: expect.any(Number) },
        { originalTimestamp: expect.any(String), key: 'value' },
      );

      expect(state.autoTrack.enabled.value).toBe(true);
      expect(state.autoTrack.pageLifecycle.enabled.value).toBe(true);
    });

    it('should override properties of autoTrack for page lifecycle events', () => {
      rudderAnalyticsInstance.track = jest.fn();
      rudderAnalyticsInstance.trackPageLifecycleEvents({
        useBeacon: true,
        autoTrack: {
          enabled: false,
          options: { key: 'value' },
          pageLifecycle: {
            enabled: true,
            options: { key: 'value2' },
          },
        },
      });

      simulatePageBeingUnloadedAfterSDKLoad();

      expect(rudderAnalyticsInstance.track).toHaveBeenCalledWith(
        'Page Unloaded',
        { timeOnPage: expect.any(Number) },
        { originalTimestamp: expect.any(String), key: 'value2' },
      );

      expect(state.autoTrack.enabled.value).toBe(true);
      expect(state.autoTrack.pageLifecycle.enabled.value).toBe(true);
    });

    it('should track Page Unloaded event if useBeacon is set to true and trackPageLifecycle feature is enabled', () => {
      jest.useFakeTimers();
      jest.setSystemTime(0);

      state.autoTrack.pageLifecycle.pageLoadedTimestamp.value = 0;

      rudderAnalyticsInstance.track = jest.fn();
      rudderAnalyticsInstance.trackPageLifecycleEvents({
        useBeacon: true,
        autoTrack: {
          options: { key: 'value' },
          pageLifecycle: {
            enabled: true,
          },
        },
      });

      // Advance the timer to get the visit duration
      jest.advanceTimersByTime(1500);

      simulatePageBeingUnloadedAfterSDKLoad();

      expect(rudderAnalyticsInstance.track).toHaveBeenCalledWith(
        'Page Unloaded',
        { timeOnPage: 1500 },
        { originalTimestamp: '1970-01-01T00:00:01.500Z', key: 'value' },
      );

      jest.useRealTimers();
    });

    it('should log a warning and not track Page Unloaded event if useBeacon is set to false and trackPageLifecycle feature is enabled', () => {
      const warnSpy = jest.spyOn(rudderAnalyticsInstance.logger, 'warn');
      rudderAnalyticsInstance.track = jest.fn();

      rudderAnalyticsInstance.trackPageLifecycleEvents({
        useBeacon: false,
        autoTrack: {
          enabled: true,
          options: { key: 'value' },
          pageLifecycle: {
            enabled: true,
          },
        },
      });

      simulatePageBeingUnloadedAfterSDKLoad();

      expect(rudderAnalyticsInstance.track).not.toHaveBeenCalled();

      expect(warnSpy).toHaveBeenCalledWith(
        'RudderStackAnalytics:: Page Unloaded event can only be tracked when the Beacon transport is active. Please enable "useBeacon" load API option.',
      );
    });

    it('should not track Page Unloaded event if the page is not actually unloaded', () => {
      rudderAnalyticsInstance.track = jest.fn();
      rudderAnalyticsInstance.trackPageLifecycleEvents({
        useBeacon: true,
        autoTrack: {
          enabled: true,
          options: { key: 'value' },
          pageLifecycle: {
            enabled: true,
          },
        },
      });

      // Simulate tab switch
      Object.defineProperty(document, 'visibilityState', {
        value: 'hidden',
        writable: true,
      });
      document.dispatchEvent(new Event('visibilitychange'));

      expect(rudderAnalyticsInstance.track).not.toHaveBeenCalled();
    });

    it('should not track Page Unloaded event on page unload but the SDK is not loaded', () => {
      rudderAnalyticsInstance.track = jest.fn();
      rudderAnalyticsInstance.trackPageLifecycleEvents({
        useBeacon: true,
        autoTrack: {
          enabled: true,
          options: { key: 'value' },
          pageLifecycle: {
            enabled: true,
          },
        },
      });

      simulatePageBeingUnloadedAfterSDKLoad(false);

      expect(rudderAnalyticsInstance.track).not.toHaveBeenCalled();
    });
  });
});
