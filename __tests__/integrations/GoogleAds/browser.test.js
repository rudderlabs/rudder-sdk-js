import GoogleAds from '../../../src/integrations/GoogleAds/browser';
import {
  mockOrderId,
  orderCompleted,
  googleAdsConfigs,
  trackCallPayload,
  mockConversionId,
} from './__mocks__/data';

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

describe('Scenario to test conversion and dynamic remarketing events', () => {
  let googleAds;
  beforeEach(() => {
    googleAds = new GoogleAds(googleAdsConfigs[0], {});
    googleAds.init();
    window.gtag = jest.fn();
  });

  test('Send Order Completed event as conversion and dynamic remarketing', () => {
    googleAds.track(trackCallPayload);

    // verify conversion events
    expect(window.gtag.mock.calls[0][0]).toEqual('event');
    expect(window.gtag.mock.calls[0][1]).toEqual(orderCompleted);
    expect(window.gtag.mock.calls[0][2]).toEqual({
      currency: 'IND',
      send_to: `${mockConversionId}/TCBjCKjCs4gYEIXBi58p`,
      transaction_id: mockOrderId,
    });

    // verify dynamic remarketing events
    expect(window.gtag.mock.calls[1][0]).toEqual('event');
    expect(window.gtag.mock.calls[1][1]).toEqual('Lead');
    expect(window.gtag.mock.calls[1][2]).toEqual({
      send_to: mockConversionId,
      event_id: 'purchaseId',
      order_id: mockOrderId,
      value: 35.0,
      shipping: 4.0,
      currency: 'IND',
      products: [
        {
          product_id: 'abc',
          category: 'Merch',
          name: 'Food/Drink',
          brand: '',
          variant: 'Extra topped',
          price: 3.0,
          quantity: 2,
          currency: 'GBP',
          typeOfProduct: 'Food',
        },
      ],
    });
  });
});

describe('Scenario to test only conversion events when track conversion button is enabled', () => {
  let googleAds;
  beforeEach(() => {
    googleAds = new GoogleAds(googleAdsConfigs[1], {});
    googleAds.init();
    window.gtag = jest.fn();
  });

  test('Send Order Completed event as conversion but not dynamic remarketing', () => {
    googleAds.track(trackCallPayload);

    // verify conversion events
    expect(window.gtag.mock.calls[0][0]).toEqual('event');
    expect(window.gtag.mock.calls[0][1]).toEqual('Order Completed');
    expect(window.gtag.mock.calls[0][2]).toEqual({
      currency: 'IND',
      send_to: `${mockConversionId}/TCBjCKjCs4gYEIXBi58p`,
      transaction_id: mockOrderId,
    });
  });
});

describe('Scenario to test only dynamic remarketing events when track dynamic remarketing button is enabled', () => {
  let googleAds;
  beforeEach(() => {
    googleAds = new GoogleAds(googleAdsConfigs[2], {});
    googleAds.init();
    window.gtag = jest.fn();
  });

  test('Send Order Completed event as dynamic remarketing but not as conversion', () => {
    googleAds.track(trackCallPayload);

    // verify dynamic remarketing events
    expect(window.gtag.mock.calls[0][0]).toEqual('event');
    expect(window.gtag.mock.calls[0][1]).toEqual('Lead');
    expect(window.gtag.mock.calls[0][2]).toEqual({
      send_to: mockConversionId,
      event_id: 'purchaseId',
      order_id: mockOrderId,
      value: 35.0,
      shipping: 4.0,
      currency: 'IND',
      products: [
        {
          product_id: 'abc',
          category: 'Merch',
          name: 'Food/Drink',
          brand: '',
          variant: 'Extra topped',
          price: 3.0,
          quantity: 2,
          currency: 'GBP',
          typeOfProduct: 'Food',
        },
      ],
    });
  });
});

describe('Scenario to test only conversion events when track conversion button and event filtering is enabled', () => {
  let googleAds;
  beforeEach(() => {
    googleAds = new GoogleAds(googleAdsConfigs[3], {});
    googleAds.init();
    window.gtag = jest.fn();
  });

  test('Send Order Completed event as conversion', () => {
    googleAds.track(trackCallPayload);

    // verify conversion events
    expect(window.gtag.mock.calls[0][0]).toEqual('event');
    expect(window.gtag.mock.calls[0][1]).toEqual(orderCompleted);
    expect(window.gtag.mock.calls[0][2]).toEqual({
      currency: 'IND',
      send_to: `${mockConversionId}/TCBjCKjCs4gYEIXBi58p`,
      transaction_id: mockOrderId,
    });
  });
});
