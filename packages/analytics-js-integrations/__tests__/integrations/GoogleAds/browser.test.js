import GoogleAds from '../../../src/integrations/GoogleAds/browser';
import {
  products,
  item_name,
  item_variant,
  transaction_id,
  mockOrderId,
  orderCompleted,
  googleAdsConfigs,
  trackCallPayload,
  mockConversionId,
  noEventNameTrackCallPayload,
} from './__fixtures__/data';

let errMock;

// Mock dependencies
jest.mock('../../../src/utils/logger', () => {
  const originalModule = jest.requireActual('../../../src/utils/logger');
  return {
    ...originalModule,
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      setLogLevel: jest.fn(),
      error: jest.fn().mockImplementation((...args) => errMock(...args)),
      info: jest.fn().mockImplementation((...args) => errMock(...args)),
    })),
  };
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  errMock = jest.fn();
});

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

describe('GoogleAds init tests', () => {
  let googleAds;

  test('Testing init call of Google Ads with ConversionId', () => {
    googleAds = new GoogleAds({ conversionID: 'AW-11071053757' }, {}, destinationInfo);
    googleAds.init();
    expect(typeof window.gtag).toBe('function');
  });

  test('should call window.gtag with config and dcfaId when dcfaId is truthy', () => {
    const googleAds = new GoogleAds(googleAdsConfigs[7], {}, destinationInfo);
    googleAds.init();
    expect(typeof window.gtag).toBe('function');
  });
});

// Old Config Test Cases
describe('Scenario to test conversion event by keeping dynamicRemarketing flag disabled', () => {
  let googleAds;
  beforeEach(() => {
    googleAds = new GoogleAds(googleAdsConfigs[0], {}, destinationInfo);
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
      transaction_id,
      event_id: 'purchaseId',
      shipping: 4,
      value: 35,
      items: [
        {
          currency: 'GBP',
          item_category: 'Merch',
          item_id: 'abc',
          item_name,
          item_variant,
          price: 3,
          quantity: 2,
          typeOfProduct: 'Food',
        },
      ],
    });
  });
});

describe('Scenario to test dynamic remarketing event by enabling the dynamicRemarketing flag', () => {
  let googleAds;
  beforeEach(() => {
    googleAds = new GoogleAds(googleAdsConfigs[1], {}, destinationInfo);
    googleAds.init();
    window.gtag = jest.fn();
  });

  test('Send Order Completed event as dynamic remarketing', () => {
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
      transaction_id,
      products,
      items: [
        {
          currency: 'GBP',
          item_category: 'Merch',
          item_id: 'abc',
          item_name,
          item_variant,
          price: 3,
          quantity: 2,
          typeOfProduct: 'Food',
        },
      ],
    });
  });
});

// New Config Test Cases
describe('Edge scenarios', () => {
  let googleAds;
  beforeEach(() => {
    googleAds = new GoogleAds(googleAdsConfigs[2], {}, destinationInfo);
    googleAds.init();
    window.gtag = jest.fn();
  });
  test('Scenario to test no event name for track call', () => {
    googleAds.track(noEventNameTrackCallPayload);
    // Validating no error is thrown in console if event name is not present
    expect(errMock).toHaveBeenLastCalledWith('in script loader=== googleAds-integration');
    // Validating no conversion event is sent to google ads if event name is not present
    expect(window.gtag.mock.calls[0]).toBeUndefined();
    // Validating no dynamic remarketing event is sent to google ads if event name is not present
    expect(window.gtag.mock.calls[1]).toBeUndefined();
  });

  test('Scenario to test no event name for page call', () => {
    googleAds.page({ message: {} });
    // Validating no error is thrown in console if event name is not present
    expect(errMock).toHaveBeenLastCalledWith('in script loader=== googleAds-integration');
    // Validating no conversion event is sent to google ads if event name is not present
    expect(window.gtag.mock.calls[0]).toBeUndefined();
    // Validating no dynamic remarketing event is sent to google ads if event name is not present
    expect(window.gtag.mock.calls[1]).toBeUndefined();
  });
});

describe('Scenario to test conversion and dynamic remarketing events', () => {
  let googleAds;
  beforeEach(() => {
    googleAds = new GoogleAds(googleAdsConfigs[2], {}, destinationInfo);
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
      transaction_id,
      event_id: 'purchaseId',
      shipping: 4,
      value: 35,
      items: [
        {
          currency: 'GBP',
          item_category: 'Merch',
          item_id: 'abc',
          item_name,
          item_variant,
          price: 3,
          quantity: 2,
          typeOfProduct: 'Food',
        },
      ],
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
      products,
      transaction_id,
      items: [
        {
          currency: 'GBP',
          item_category: 'Merch',
          item_id: 'abc',
          item_name,
          item_variant,
          price: 3,
          quantity: 2,
          typeOfProduct: 'Food',
        },
      ],
    });
  });
});

describe('Scenario to test only conversion events when track conversion button is enabled', () => {
  let googleAds;
  beforeEach(() => {
    googleAds = new GoogleAds(googleAdsConfigs[3], {}, destinationInfo);
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
      event_id: 'purchaseId',
      shipping: 4,
      value: 35,
      items: [
        {
          currency: 'GBP',
          item_category: 'Merch',
          item_id: 'abc',
          item_name,
          item_variant,
          price: 3,
          quantity: 2,
          typeOfProduct: 'Food',
        },
      ],
    });
  });
});

describe('Scenario to test only dynamic remarketing events when track dynamic remarketing button is enabled', () => {
  let googleAds;
  beforeEach(() => {
    googleAds = new GoogleAds(googleAdsConfigs[4], {}, destinationInfo);
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
      transaction_id,
      order_id: mockOrderId,
      value: 35.0,
      shipping: 4.0,
      currency: 'IND',
      products,
      items: [
        {
          currency: 'GBP',
          item_category: 'Merch',
          item_id: 'abc',
          item_name,
          item_variant,
          price: 3,
          quantity: 2,
          typeOfProduct: 'Food',
        },
      ],
    });
  });
});

describe('Scenario to test only conversion events when track conversion button and event filtering is enabled', () => {
  let googleAds;
  beforeEach(() => {
    googleAds = new GoogleAds(googleAdsConfigs[5], {}, destinationInfo);
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
      event_id: 'purchaseId',
      shipping: 4,
      value: 35,
      items: [
        {
          currency: 'GBP',
          item_category: 'Merch',
          item_id: 'abc',
          item_name,
          item_variant,
          price: 3,
          quantity: 2,
          typeOfProduct: 'Food',
        },
      ],
    });
  });
});

// Old + New config test
describe('Scenario to test both configs together, old config should be given first priority', () => {
  let googleAds;
  beforeEach(() => {
    googleAds = new GoogleAds(googleAdsConfigs[6], {}, destinationInfo);
    googleAds.init();
    window.gtag = jest.fn();
  });

  test('As dynamicRemarketing flag is disabled, send order completed event as conversion event', () => {
    googleAds.track(trackCallPayload);

    // verify conversion events
    expect(window.gtag.mock.calls[0][0]).toEqual('event');
    expect(window.gtag.mock.calls[0][1]).toEqual(orderCompleted);
    expect(window.gtag.mock.calls[0][2]).toEqual({
      currency: 'IND',
      send_to: `${mockConversionId}/TCBjCKjCs4gYEIXBi58p`,
      transaction_id: mockOrderId,
      event_id: 'purchaseId',
      shipping: 4,
      value: 35,
      items: [
        {
          currency: 'GBP',
          item_category: 'Merch',
          item_id: 'abc',
          item_name,
          item_variant,
          price: 3,
          quantity: 2,
          typeOfProduct: 'Food',
        },
      ],
    });
  });
});
