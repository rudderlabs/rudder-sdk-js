import GoogleAds from '../../../src/integrations/GoogleAds/browser';
import shouldSendEvent from '../../../src/integrations/GoogleAds/utils';

const mockEvents = [
  { eventName: 'Product Viewed' },
  { eventName: 'Order Completed' },
  { eventName: 'Sign Up' },
  { eventName: 'Lead' },
];

beforeAll(() => {});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('GoogleAds init tests', () => {
  let googleAds;

  test('Testing init call of Google Ads with ConversionId', () => {
    googleAds = new GoogleAds({ conversionID: 'AW-11071053757' }, {});
    googleAds.init();
    expect(typeof window.gtag).toBe('function');
  });
});

describe('GoogleAds utilities', () => {
  it('event tracking is enabled and event filtering is disabled', () => {
    const eventToSend = shouldSendEvent('Product Added', true, false, mockEvents);
    expect(eventToSend).toEqual(true);
  });

  it('event tracking is disabled and event filtering is disabled', () => {
    const eventToSend = shouldSendEvent('Product Viewed', false, false, mockEvents);
    expect(eventToSend).toEqual(false);
  });

  it('event tracking is enabled and event filtering is enabled but event is not added to events list', () => {
    const eventToSend = shouldSendEvent('Cart Checkout', true, true, mockEvents);
    expect(eventToSend).toEqual(false);
  });

  it('event tracking is enabled and event filtering is enabled and event is added to events list', () => {
    const eventToSend = shouldSendEvent('Order Completed', true, true, mockEvents);
    expect(eventToSend).toEqual(true);
  });
});
