import GA from '../../../src/integrations/GA/browser';

beforeAll(() => {});

afterAll(() => {
  jest.restoreAllMocks();
});

const destinationInfo = {
  shouldApplyDeviceModeTransformation: false,
  propagateEventsUntransformedOnError: false,
  destinationId: 'sample-destination-id',
};

const trackingId = 'UA-143161493-8';
const eventName = 'test track';
const label = 'test label';

GA.prototype.loadScript = jest.fn();

describe('GA init tests', () => {
  let googleAnalytics;
  beforeEach(() => {
    googleAnalytics = new GA(
      { trackingID: trackingId },
      { loadIntegration: true },
      destinationInfo,
    );
    googleAnalytics.init();
  });

  test('GA init default config test time', () => {
    // const googleAnalytics = new GA({ trackingID: "UA-143161493-8" });
    // googleAnalytics.init();
    expect(typeof window.ga.l).toBe('number');
  });

  test('GA init default config test create and require', () => {
    expect(window.GoogleAnalyticsObject).toEqual('ga');
    expect(typeof window.ga).toBe('function');
    expect(typeof window.ga.l).toBe('number');
    // expect(window.ga.q[0]).toEqual();
    expect(window.ga.q[0][0]).toEqual('create');
    expect(window.ga.q[0][1]).toEqual(trackingId);
    expect(window.ga.q[0][2]).toEqual({
      cookieDomain: 'auto',
      siteSpeedSampleRate: 1,
      sampleRate: 100,
      allowLinker: true,
      useAmpClientId: false,
    });
    expect(window.ga.q[1][0]).toEqual('require');
    expect(window.ga.q[1][1]).toEqual('ecommerce');
  });

  describe('GA page', () => {
    beforeEach(() => {
      googleAnalytics = new GA(
        {
          trackingID: trackingId,
          dimensions: [
            {
              from: 'testDimension',
              to: 'dimension1',
            },
          ],
          metrics: [],
          contentGroupings: [],
          resetCustomDimensionsOnPage: [
            {
              resetCustomDimensionsOnPage: 'testDimension',
            },
          ],
        },
        { loadIntegration: true },
        destinationInfo,
      );
      googleAnalytics.init();
      window.ga = jest.fn();
    });

    test('send pageview', () => {
      googleAnalytics.page({
        message: {
          context: {},
          properties: {
            category: 'test cat',
            path: '/test',
            url: 'http://localhost',
            referrer: '',
            title: 'test page',
            testDimension: 'abc',
          },
        },
      });
      expect(window.ga.mock.calls[0][0]).toEqual('set');
      expect(window.ga.mock.calls[0][1]).toEqual({ dimension1: null });
      expect(window.ga.mock.calls[1][0]).toEqual('set');
      expect(window.ga.mock.calls[1][1]).toEqual({ dimension1: 'abc' });
      expect(window.ga.mock.calls[3][0]).toEqual('send');
      expect(window.ga.mock.calls[3][1]).toEqual('pageview');

      // it has a pageview as a top level key..expected??
      expect(window.ga.mock.calls[3][2]).toEqual({
        page: '/test',
        title: 'test cat',
        location: 'http://localhost',
      });
      // TODO: call another page, check location not set
    });
  });

  describe('GA simple non ecomm event', () => {
    beforeEach(() => {
      googleAnalytics = new GA(
        {
          trackingID: trackingId,
          dimensions: [],
          metrics: [],
          contentGroupings: [],
        },
        { loadIntegration: true },
        destinationInfo,
      );
      googleAnalytics.init();
      window.ga = jest.fn();
    });

    test('send track call interaction and default category', () => {
      googleAnalytics.track({
        message: {
          context: {},
          event: eventName,
          properties: {
            value: 20,
            label,
          },
        },
      });

      expect(window.ga.mock.calls[0][0]).toEqual('send');
      expect(window.ga.mock.calls[0][1]).toEqual('event');

      expect(window.ga.mock.calls[0][2]).toEqual({
        eventCategory: 'All',
        eventAction: eventName,
        eventLabel: label,
        eventValue: 20,
        nonInteraction: false,
      });
    });

    test('send track call non-interaction and explicit category', () => {
      googleAnalytics.track({
        message: {
          context: {},
          event: eventName,
          properties: {
            category: 'test cat',
            value: 20,
            label,
            nonInteraction: 1,
          },
        },
      });

      expect(window.ga.mock.calls[0][0]).toEqual('send');
      expect(window.ga.mock.calls[0][1]).toEqual('event');

      expect(window.ga.mock.calls[0][2]).toEqual({
        eventCategory: 'test cat',
        eventAction: eventName,
        eventLabel: label,
        eventValue: 20,
        nonInteraction: true,
      });
    });
  });
});
