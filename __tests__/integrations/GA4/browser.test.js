import GA4 from '../../../src/integrations/GA4/browser';

import { events } from './__mocks__/data';

afterAll(() => {
  jest.restoreAllMocks();
});
const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

// jest.mock('this.analytics.getUserId', () => '1234');

describe('Google Analytics 4 init tests', () => {
  test('Testing init call of Google Ads with ConversionId', () => {
    const ga4 = new GA4(
      { measurementId: 'G-123456' },
      { getUserId: () => '1234', getUserTraits: () => {} },
      destinationInfo,
    );
    ga4.init();
    expect(typeof window.gtag).toBe('function');
  });
});

// Test cases for all the standard and custom ga4 events
describe('Google Analytics 4 e-commerce events', () => {
  let ga4;
  beforeEach(() => {
    ga4 = new GA4(
      { measurementId: 'G-123456' },
      { getUserId: () => '1234', getUserTraits: () => {} },
      destinationInfo,
    );
    ga4.init();
    window.gtag = jest.fn();
  });

  events.forEach((event) => {
    test(`${event.description}`, () => {
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
