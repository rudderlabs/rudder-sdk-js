import GA4 from '../../../src/integrations/GA4/browser';

import { identifyEvents, trackEvents, pageEvents, groupEvents } from './__mocks__/data';

afterAll(() => {
  jest.restoreAllMocks();
});
const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

// jest.mock('this.analytics.getUserId', () => '1234');

describe('Google Analytics 4 init tests', () => {
  test('Testing init call of Google Analytics 4 with MeasurementId and SdkBaseUrl', () => {
    const ga4 = new GA4(
      { measurementId: 'G-123456', debugView: true, sdkBaseUrl: 'https://www.example.com' },
      { getUserId: () => '1234', getUserTraits: () => {} },
      destinationInfo,
    );
    ga4.init();
    expect(typeof window.gtag).toBe('function');
  });
});

describe('Google Analytics 4 Track events tests', () => {
  let ga4;
  beforeEach(() => {
    ga4 = new GA4(
      { measurementId: 'G-123456', extendPageViewParams: true, capturePageView: 'rs' },
      { getUserId: () => '1234', getUserTraits: () => {} },
      destinationInfo,
    );
    ga4.init();
    window.gtag = jest.fn();
  });

  trackEvents.forEach(event => {
    test(`Track : ${event.description}`, () => {
      const { input, output } = event;
      try {
        ga4.track(input);
        // verifying events
        expect(window.gtag.mock.calls[0][1]).toEqual(output.event);
        expect(window.gtag.mock.calls[0][2]).toEqual(output.params);
      } catch (error) {
        expect(error.message).toEqual(output.message);
      }
    });
  });
});

describe('Google Analytics 4 Page events tests', () => {
  pageEvents.forEach(event => {
    let ga4;
    const { description, input, output } = event;
    beforeEach(() => {
      ga4 = new GA4(
        input.config,
        { getUserId: () => '1234', getUserTraits: () => {} },
        destinationInfo,
      );
      ga4.init();
      window.gtag = jest.fn();
    });

    test(`Page : ${description}`, () => {
      try {
        ga4.page(input);
        // verifying events
        expect(window.gtag.mock.calls[0][1]).toEqual(output.event);
        expect(window.gtag.mock.calls[0][2]).toEqual(output.params);
      } catch (error) {
        expect(error.message).toEqual(output.message);
      }
    });
  });
});

describe('Google Analytics 4 Group events tests', () => {
  let ga4;
  beforeEach(() => {
    ga4 = new GA4(
      {
        measurementId: 'G-123456',
        extendPageViewParams: true,
        capturePageView: 'rs',
        piiPropertiesToIgnore: [{ piiProperty: '' }],
      },
      { getUserId: () => '1234', getUserTraits: () => {} },
      destinationInfo,
    );
    ga4.init();
    window.gtag = jest.fn();
  });

  groupEvents.forEach(event => {
    test(`Group : ${event.description}`, () => {
      const { input, output } = event;
      try {
        ga4.group(input);
        // verifying events
        expect(window.gtag.mock.calls[0][1]).toEqual(output.event);
        expect(window.gtag.mock.calls[0][2]).toEqual(output.params);
      } catch (error) {
        expect(error.message).toEqual(output.message);
      }
    });
  });
});

describe('Google Analytics 4 Identify events tests with no piiPropertiesToIgnore', () => {
  let ga4;
  // Config 1 : default piiPropertiesToIgnore value
  beforeEach(() => {
    ga4 = new GA4(
      {
        measurementId: 'G-123456',
        extendPageViewParams: true,
        capturePageView: 'rs',
        piiPropertiesToIgnore: [{ piiProperty: '' }],
      },
      { getUserId: () => '1234', getUserTraits: () => {} },
      destinationInfo,
    );
    ga4.init();
    window.gtag = jest.fn();
  });

  identifyEvents.forEach(event => {
    test(`Identify : ${event.description}`, () => {
      const { input, output } = event;
      try {
        ga4.identify(input);
        // verifying events
        expect(window.gtag.mock.calls[0][2]).toEqual(output.traits);
        expect(window.gtag.mock.calls[1][2]).toEqual(output.userId);
      } catch (error) {
        expect(error.message).toEqual(output.message);
      }
    });
  });
});

describe('Google Analytics 4 Identify events tests with undefined piiPropertiesToIgnore', () => {
  let ga4;
  // Config 2 : empty piiPropertiesToIgnore value
  beforeEach(() => {
    ga4 = new GA4(
      { measurementId: 'G-123456', extendPageViewParams: true, capturePageView: 'rs' },
      { getUserId: () => '1234', getUserTraits: () => {} },
      destinationInfo,
    );
    ga4.init();
    window.gtag = jest.fn();
  });

  identifyEvents.forEach(event => {
    test(`Identify : ${event.description}`, () => {
      const { input, output } = event;
      try {
        ga4.identify(input);
        // verifying events
        expect(window.gtag.mock.calls[0][2]).toEqual(output.traits);
        expect(window.gtag.mock.calls[1][2]).toEqual(output.userId);
      } catch (error) {
        expect(error.message).toEqual(output.message);
      }
    });
  });
});

describe('Google Analytics 4 Identify events tests with piiPropertiesToIgnore', () => {
  let ga4;
  // Config 3 : valid piiPropertiesToIgnore values
  beforeEach(() => {
    ga4 = new GA4(
      {
        measurementId: 'G-123456',
        extendPageViewParams: true,
        capturePageView: 'rs',
        piiPropertiesToIgnore: [
          { piiProperty: 'email' },
          { piiProperty: 'phone' },
          { piiProperty: 'card_number' },
          { piiProperty: 'age' },
        ],
      },
      { getUserId: () => '1234', getUserTraits: () => {} },
      destinationInfo,
    );
    ga4.init();
    window.gtag = jest.fn();
  });

  identifyEvents.forEach(event => {
    test(`Identify : ${event.description}`, () => {
      const { input, output } = event;
      try {
        ga4.identify(input);
        expect(window.gtag.mock.calls[0][2]).toEqual({
          source: 'RudderStack',
          userInterest: 'high',
          age: null,
          card_number: null,
          email: null,
          phone: null,
        });
        expect(window.gtag.mock.calls[1][2]).toEqual(output.userId);
      } catch (error) {
        expect(error.message).toEqual(output.message);
      }
    });
  });
});
