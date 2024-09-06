import type { LoadOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
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
    Analytics.mockClear();
    analyticsInstanceMock = new Analytics() as jest.Mocked<Analytics>;
    (window as any).rudderanalytics = [
      ['track'],
      ['consent', { sendPageEvent: true }],
      ['load', { option1: true }],
      ['consent', { sendPageEvent: false }],
      ['track'],
    ];
    rudderAnalytics = new RudderAnalytics();
    (rudderAnalytics as any).private_analyticsInstances = { writeKey: analyticsInstanceMock };
    (rudderAnalytics as any).private_defaultAnalyticsKey = 'writeKey';
  });

  afterEach(() => {
    (rudderAnalytics as any).globalSingleton = null;
    jest.resetAllMocks();
  });

  it('should return the global singleton from "rudderanalytics" global object', done => {
    const expectedPreloadedEvents = [
      ['consent', { sendPageEvent: true }],
      ['consent', { sendPageEvent: false }],
      ['track'],
      ['track'],
    ];
    const globalSingleton = rudderAnalytics;

    expect(window.RudderStackGlobals?.app?.preloadedEventsBuffer).toEqual(expectedPreloadedEvents);
    expect(window.rudderanalytics).toEqual(globalSingleton);
    done();
  });

  it('should return the global singleton if it exists', () => {
    const globalSingleton = rudderAnalytics;
    rudderAnalytics = new RudderAnalytics();

    expect(rudderAnalytics).toEqual(globalSingleton);
  });

  it('should auto set the default analytics key if no analytics instances exist', () => {
    (rudderAnalytics as any).analyticsInstances = {};
    (rudderAnalytics as any).defaultAnalyticsKey = '';
    rudderAnalytics.setDefaultInstanceKey('writeKey');

    expect(rudderAnalytics.private_defaultAnalyticsKey).toEqual('writeKey');
  });

  it('should auto set the default analytics key if analytics instances exist', () => {
    rudderAnalytics.setDefaultInstanceKey('writeKey2');

    expect(rudderAnalytics.private_defaultAnalyticsKey).toEqual('writeKey2');
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
    expect(rudderAnalytics.private_analyticsInstances).toHaveProperty(
      'writeKey',
      analyticsInstance,
    );
  });

  it('should not create a new analytics instance if one already exists for the write key', () => {
    const analyticsInstance = analyticsInstanceMock;
    rudderAnalytics.private_analyticsInstances = { writeKey: analyticsInstance };
    rudderAnalytics.load('writeKey', 'data-plane-url');

    expect(rudderAnalytics.getAnalyticsInstance('writeKey')).toStrictEqual(analyticsInstance);
  });

  it('should set the default analytics key if none has been set', () => {
    rudderAnalytics.load('writeKey', 'data-plane-url');

    expect(rudderAnalytics.private_defaultAnalyticsKey).toEqual('writeKey');
  });

  it('should create a new analytics instance with the write key on load and trigger its load method', () => {
    rudderAnalytics.private_analyticsInstances = {};
    rudderAnalytics.private_defaultAnalyticsKey = '';
    rudderAnalytics.load('writeKey', 'data-plane-url', mockLoadOptions);
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance('writeKey');
    const loadSpy = jest.spyOn(analyticsInstance, 'load');

    expect(rudderAnalytics.private_analyticsInstances).toHaveProperty(
      'writeKey',
      analyticsInstance,
    );
    expect(loadSpy).toHaveBeenCalledWith('writeKey', 'data-plane-url', mockLoadOptions);
  });

  it('should process ready arguments and forwards to ready call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const readySpy = jest.spyOn(analyticsInstance, 'ready');

    const callback = () => console.log('Ready!');

    rudderAnalytics.ready(callback);
    expect(readySpy).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should process page arguments and forwards to page call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const pageSpy = jest.spyOn(analyticsInstance, 'page');

    rudderAnalytics.page('category');
    expect(pageSpy).toHaveBeenCalledWith({
      name: 'category',
      properties: { name: 'category' },
    });
  });

  it('should process track arguments and forwards to track call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const trackSpy = jest.spyOn(analyticsInstance, 'track');

    rudderAnalytics.track('event');
    expect(trackSpy).toHaveBeenCalledWith({ name: 'event', properties: {} });
  });

  it('should process identify arguments and forwards to identify call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const identifySpy = jest.spyOn(analyticsInstance, 'identify');

    rudderAnalytics.identify(1234);
    expect(identifySpy).toHaveBeenCalledWith({ userId: '1234' });
  });

  it('should process alias arguments and forwards to alias call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const aliasSpy = jest.spyOn(analyticsInstance, 'alias');

    rudderAnalytics.alias('1234');
    expect(aliasSpy).toHaveBeenCalledWith({ to: '1234' });
  });

  it('should process group arguments and forwards to group call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const groupSpy = jest.spyOn(analyticsInstance, 'group');

    rudderAnalytics.group(1234);
    expect(groupSpy).toHaveBeenCalledWith({ groupId: '1234' });
  });

  it('should process reset arguments and forwards to reset call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const resetSpy = jest.spyOn(analyticsInstance, 'reset');

    rudderAnalytics.reset(true);
    expect(resetSpy).toHaveBeenCalledWith(true);
  });

  it('should process getAnonymousId arguments and forwards to getAnonymousId call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const getAnonymousIdSpy = jest.spyOn(analyticsInstance, 'getAnonymousId');

    rudderAnalytics.getAnonymousId({
      autoCapture: {
        enabled: true,
      },
    });
    expect(getAnonymousIdSpy).toHaveBeenCalledWith({ autoCapture: { enabled: true } });
  });

  it('should process setAnonymousId arguments and forwards to setAnonymousId call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const setAnonymousIdSpy = jest.spyOn(analyticsInstance, 'setAnonymousId');

    rudderAnalytics.setAnonymousId('id', 'param');
    expect(setAnonymousIdSpy).toHaveBeenCalledWith('id', 'param');
  });

  it('should process getUserId arguments and forwards to getUserId call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const getUserIdSpy = jest.spyOn(analyticsInstance, 'getUserId');

    rudderAnalytics.getUserId();
    expect(getUserIdSpy).toHaveBeenCalledTimes(1);
  });

  it('should process getUserTraits arguments and forwards to getUserTraits call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const getUserTraitsSpy = jest.spyOn(analyticsInstance, 'getUserTraits');

    rudderAnalytics.getUserTraits();
    expect(getUserTraitsSpy).toHaveBeenCalledTimes(1);
  });

  it('should process getGroupId arguments and forwards to getGroupId call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const getGroupIdSpy = jest.spyOn(analyticsInstance, 'getGroupId');

    rudderAnalytics.getGroupId();
    expect(getGroupIdSpy).toHaveBeenCalledTimes(1);
  });

  it('should process getGroupTraits arguments and forwards to getGroupTraits call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const getGroupTraitsSpy = jest.spyOn(analyticsInstance, 'getGroupTraits');

    rudderAnalytics.getGroupTraits();
    expect(getGroupTraitsSpy).toHaveBeenCalledTimes(1);
  });

  it('should process startSession arguments and forwards to startSession call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const startSessionSpy = jest.spyOn(analyticsInstance, 'startSession');

    rudderAnalytics.startSession(1234);
    expect(startSessionSpy).toHaveBeenCalledWith(1234);
  });

  it('should process endSession arguments and forwards to endSession call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const endSessionSpy = jest.spyOn(analyticsInstance, 'endSession');

    rudderAnalytics.endSession();
    expect(endSessionSpy).toHaveBeenCalledTimes(1);
  });

  it('should process getSessionId arguments and forwards to getSessionId call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const getSessionIdSpy = jest.spyOn(analyticsInstance, 'getSessionId');

    rudderAnalytics.getSessionId();
    expect(getSessionIdSpy).toHaveBeenCalledTimes(1);
  });

  it('should retrieve all preloaded events and set to global', () => {
    expect((window as any).RudderStackGlobals.app.preloadedEventsBuffer).toEqual([
      ['consent', { sendPageEvent: true }],
      ['consent', { sendPageEvent: false }],
      ['track'],
      ['track'],
    ]);
  });

  it('should process setAuthToken arguments and forwards to setAuthToken call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const setAuthTokenSpy = jest.spyOn(analyticsInstance, 'setAuthToken');

    rudderAnalytics.setAuthToken('token');
    expect(setAuthTokenSpy).toHaveBeenCalledWith('token');
  });

  it('should process consent arguments and forwards to consent call', () => {
    const analyticsInstance = rudderAnalytics.getAnalyticsInstance();
    const consentSpy = jest.spyOn(analyticsInstance, 'consent');

    rudderAnalytics.consent({
      consentManagement: {
        allowedConsentIds: ['1'],
        deniedConsentIds: ['2'],
      },
    });
    expect(consentSpy).toHaveBeenCalledWith({
      consentManagement: {
        allowedConsentIds: ['1'],
        deniedConsentIds: ['2'],
      },
    });
  });
});
