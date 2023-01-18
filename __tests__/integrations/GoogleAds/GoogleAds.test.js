import GoogleAds from '../../../src/integrations/GoogleAds/browser';
import { shouldSendEvent, getConversionData } from '../../../src/integrations/GoogleAds/utils';

const orderCompleted = 'Order Completed';

const mockEvents = [
  { eventName: 'Product Viewed' },
  { eventName: orderCompleted },
  { eventName: 'Sign Up' },
  { eventName: 'Lead' },
];

const mockEventTypeConversions = [
  { conversionLabel: '15klCKLCs4gYETIBi58p', name: 'Sign Up' },
  { conversionLabel: '9Hr5CKXCs4gYETIBi58p', name: 'Page View' },
  { conversionLabel: 'TCBjCKjCs4gYETIBi58p', name: orderCompleted },
  { conversionLabel: 'KhF2CKvCs4gYETIBi58p', name: 'Product Added' },
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

describe('GoogleAds utilities shouldSendEvent function tests', () => {
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
    const eventToSend = shouldSendEvent(orderCompleted, true, true, mockEvents);
    expect(eventToSend).toEqual(true);
  });
});

describe('GoogleAds utilities getConversionData function tests', () => {
  it('Should return matching conversionLabel and eventName', () => {
    const conversionData = getConversionData(mockEventTypeConversions, 'Sign Up', '');
    expect(conversionData.eventName).toEqual('Sign Up');
    expect(conversionData.conversionLabel).toEqual('15klCKLCs4gYETIBi58p');
  });

  it('Should return default conversionLabel and eventName', () => {
    const conversionData = getConversionData(mockEventTypeConversions, '', 'KhF2CKvCs4gYETIBi58p');
    expect(conversionData.eventName).toEqual('Viewed a Page');
    expect(conversionData.conversionLabel).toEqual('KhF2CKvCs4gYETIBi58p');
  });

  it('Should return empty object as no matching event name is present and no defaultPageConversion is present', () => {
    const conversionData = getConversionData(mockEventTypeConversions, 'Cart Checkout', '');
    expect(conversionData).toEqual({});
  });
});
