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
  test('Testing init call of Google Analytics 4 with MeasurementId', () => {
    const ga4 = new GA4(
      { measurementId: 'G-123456', debugView: true, piiPropertiesToIgnore: [{ piiProperty: '' }] },
      { getUserId: () => '1234', getUserTraits: () => {} },
      destinationInfo,
    );
    ga4.init();
    expect(typeof window.gtag).toBe('function');
  });
});

describe('Google Analytics 4 events tests', () => {
  let ga4;
  beforeEach(() => {
    ga4 = new GA4(
      { measurementId: 'G-123456', extendPageViewParams: true, capturePageView: 'rs', piiPropertiesToIgnore: [{piiProperty: ''}] },
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

  pageEvents.forEach(event => {
    test(`Page : ${event.description}`, () => {
      const { input, output } = event;
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
