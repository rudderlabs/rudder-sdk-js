import Lemnisk from '../../../src/integrations/Lemnisk/browser';

afterAll(() => {
  jest.restoreAllMocks();
});
const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

describe('lemnisk init tests', () => {
  let lemnisk;

  test('Testing init call of Lemnisk', () => {
    lemnisk = new Lemnisk(
      { accountId: '12567839', writeKey: '04789yt8rfhbkwjenkl' },
      { loglevel: 'debug' },
      destinationInfo,
    );
    lemnisk.init();
    expect(typeof window.lmSMTObj).toBe('object');
  });
});

describe('lemnisk page', () => {
  let lemnisk;
  beforeEach(() => {
    lemnisk = new Lemnisk(
      { accountId: '12567839', writeKey: '04789yt8rfhbkwjenkl' },
      { loglevel: 'debug' },
      destinationInfo,
    );
    lemnisk.init();
    window.lmSMTObj.page = jest.fn();
  });

  test('send pageview', () => {
    lemnisk.page({
      message: {
        context: {},
        properties: {
          category: 'test cat',
          path: '/test',
          url: 'http://localhost',
          referrer: '',
          title: 'test page',
          testDimension: 'abc',
          isRudderEvents: true,
        },
      },
    });
    expect(window.lmSMTObj.page.mock.calls[0][0]).toEqual({
      category: 'test cat',
      path: '/test',
      url: 'http://localhost',
      referrer: '',
      title: 'test page',
      testDimension: 'abc',
      isRudderEvents: true,
    });
  });
});

describe('Lemnisk Track event', () => {
  let lemnisk;
  beforeEach(() => {
    lemnisk = new Lemnisk(
      { accountId: '12567839', writeKey: '04789yt8rfhbkwjenkl' },
      { loglevel: 'DEBUG' },
      destinationInfo,
    );
    lemnisk.init();
    window.lmSMTObj.track = jest.fn();
  });
  test('Testing Track Custom Events', () => {
    lemnisk.track({
      message: {
        context: {},
        event: 'Custom',
        properties: {
          customProp: 'testProp',
          checkout_id: 'what is checkout id here??',
          event_id: 'purchaseId',
          order_id: 'transactionId',
          value: 35.0,
          shipping: 4.0,
          coupon: 'APPARELSALE',
          currency: 'GBP',
          products: [
            {
              customPropProd: 'testPropProd',
              product_id: 'abc',
              category: 'Merch',
              name: 'Food/Drink',
              brand: '',
              variant: 'Extra topped',
              price: 3.0,
              quantity: 2,
              currency: 'GBP',
              position: 1,
              value: 6.0,
              typeOfProduct: 'Food',
              url: 'https://www.example.com/product/bacon-jam',
              image_url: 'https://www.example.com/product/bacon-jam.jpg',
            },
          ],
          isRudderEvents: true,
        },
      },
    });
    expect(window.lmSMTObj.track.mock.calls[0][0]).toEqual('Custom');
    expect(window.lmSMTObj.track.mock.calls[0][1]).toEqual({
      customProp: 'testProp',
      checkout_id: 'what is checkout id here??',
      event_id: 'purchaseId',
      order_id: 'transactionId',
      value: 35.0,
      shipping: 4.0,
      coupon: 'APPARELSALE',
      currency: 'GBP',
      products: [
        {
          customPropProd: 'testPropProd',
          product_id: 'abc',
          category: 'Merch',
          name: 'Food/Drink',
          brand: '',
          variant: 'Extra topped',
          price: 3.0,
          quantity: 2,
          currency: 'GBP',
          position: 1,
          value: 6.0,
          typeOfProduct: 'Food',
          url: 'https://www.example.com/product/bacon-jam',
          image_url: 'https://www.example.com/product/bacon-jam.jpg',
        },
      ],
      isRudderEvents: true,
    });
  });
});
describe('Lemnisk Identify event', () => {
  let lemnisk;
  beforeEach(() => {
    lemnisk = new Lemnisk(
      { accountId: '12567839', writeKey: '04789yt8rfhbkwjenkl' },
      { loglevel: 'DEBUG' },
      destinationInfo,
    );
    lemnisk.init();
    window.lmSMTObj.identify = jest.fn();
  });
  test('Testing Identify Custom Events', () => {
    lemnisk.identify({
      message: {
        userId: 'rudder01',
        context: {
          traits: {
            email: 'abc@ruddertack.com',
            isRudderEvents: true,
          },
        },
      },
    });
    expect(window.lmSMTObj.identify.mock.calls[0][0]).toEqual('rudder01');
    expect(window.lmSMTObj.identify.mock.calls[0][1]).toEqual({
      email: 'abc@ruddertack.com',
      isRudderEvents: true,
    });
  });
});
