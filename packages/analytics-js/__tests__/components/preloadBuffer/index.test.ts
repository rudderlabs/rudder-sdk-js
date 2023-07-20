import {
  getEventDataFromQueryString,
  getPreloadedLoadEvent,
  retrieveEventsFromQueryString,
  retrievePreloadBufferEvents,
} from '@rudderstack/analytics-js/components/preloadBuffer';
import { PreloadedEventCall } from '@rudderstack/analytics-js/components/preloadBuffer/types';

describe('Preload Buffer', () => {
  const originalWindowLocation = window.location;

  const analytics = {
    enqueuePreloadBufferEvents: jest.fn(() => {}),
    load: jest.fn(() => {}),
  };

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: new URL(originalWindowLocation.href),
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: originalWindowLocation,
    });
    (window as any).RudderStackGlobals = undefined;
  });

  it('should get event data from query string with allowed keys', () => {
    const testUrlParams = new URLSearchParams('ajs_trait_dummy1=true&ajs_trait_dummy2=true');

    expect(getEventDataFromQueryString(testUrlParams, 'ajs_trait_')).toStrictEqual({
      dummy1: 'true',
      dummy2: 'true',
    });
  });

  it('should not get event data from query string with non allowed keys', () => {
    const testUrlParams = new URLSearchParams('ajs_trait_dummy1=true&ajs_trait_dummy2=true');

    expect(getEventDataFromQueryString(testUrlParams, 'ajs_dummy_')).toStrictEqual({});
  });

  it('should retrieve events data from query string with allowed keys', () => {
    const testUrlParams = `${originalWindowLocation.href}?ajs_aid=asdfghjkl&ajs_uid=qzxcvbnm&ajs_event=dummyName&ajs_trait_dummy1=true&ajs_prop_dummy=true`;
    window.location.href = testUrlParams;
    const argumentsArray: PreloadedEventCall[] = [];
    retrieveEventsFromQueryString(argumentsArray);

    expect(window.location.href).toBe(testUrlParams);
    expect(argumentsArray).toStrictEqual([
      ['setAnonymousId', 'asdfghjkl'],
      ['identify', 'qzxcvbnm', { dummy1: 'true' }],
      ['track', 'dummyName', { dummy: 'true' }],
    ]);
  });

  it('should retrieve the load event if any', () => {
    const argumentsArray: PreloadedEventCall[] = [
      ['track'],
      ['load', { option1: true }],
      ['track'],
    ];

    const loadEvent = getPreloadedLoadEvent(argumentsArray);

    expect(loadEvent).toStrictEqual(['load', { option1: true }]);
    expect(argumentsArray).toStrictEqual([['track'], ['track']]);
  });

  it('should retrieve all preloaded events from both array and query params', () => {
    const testUrlParams = `${originalWindowLocation.href}?ajs_aid=asdfghjkl&ajs_uid=qzxcvbnm&ajs_event=dummyName&ajs_trait_dummy1=true&ajs_prop_dummy=true`;
    window.location.href = testUrlParams;
    (window as any).RudderStackGlobals = {
      app: {
        preloadedEventsBuffer: [['track'], ['load', { option1: true }], ['track']],
      },
    };

    retrievePreloadBufferEvents(analytics as any);

    expect(analytics.enqueuePreloadBufferEvents).toHaveBeenCalledTimes(1);
    expect(analytics.enqueuePreloadBufferEvents).toHaveBeenCalledWith([
      ['setAnonymousId', 'asdfghjkl'],
      ['identify', 'qzxcvbnm', { dummy1: 'true' }],
      ['track', 'dummyName', { dummy: 'true' }],
      ['track'],
      ['track'],
    ]);

    expect(analytics.load).toHaveBeenCalledTimes(0);
  });

  it('should not buffer any events if no preload array or query params exist', () => {
    window.location.href = originalWindowLocation.href;
    (window as any).RudderStackGlobals = {
      app: {
        preloadedEventsBuffer: [],
      },
    };

    expect(analytics.enqueuePreloadBufferEvents).toHaveBeenCalledTimes(0);
    expect(analytics.load).toHaveBeenCalledTimes(0);
  });
});
