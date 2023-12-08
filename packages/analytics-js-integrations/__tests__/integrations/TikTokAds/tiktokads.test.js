import TiktokAds from '../../../src/integrations/TiktokAds/browser';

beforeEach(() => {
  // Add a dummy script as it is required by the init script
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
});

const basicConfig = {
  pixelCode: '12567839',
  eventsToStandard: [
    { from: 'Sign Up', to: 'Signup' },
    { to: 'Lead', from: 'orderCompleted' },
    { from: 'Page View', to: 'PageVisit' },
    { from: 'product_added', to: 'AddToCart' },
  ],
  sendCustomEvents: true,
};

describe('tiktokads init tests', () => {
  let tiktokads;
  test('Testing init call of TiktokAds', () => {
    tiktokads = new TiktokAds(basicConfig, { loglevel: 'debug' });
    tiktokads.init();
    expect(typeof window.ttq).toBe('object');
  });
});

describe('tiktokads page', () => {
  let tiktokads;
  beforeEach(() => {
    tiktokads = new TiktokAds(basicConfig, { loglevel: 'debug' });
    tiktokads.init();
    window.ttq.page = jest.fn();
  });

  test('send pageview', () => {
    tiktokads.page({
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
    expect(window.ttq.page.mock.calls[0][0]).toEqual();
  });
});

describe('TiktokAds Track event', () => {
  let tiktokads;
  test('Testing Track product_added with no content_type in payload', () => {
    tiktokads = new TiktokAds(basicConfig, { loglevel: 'DEBUG' });
    tiktokads.init();
    window.ttq.track = jest.fn();
    tiktokads.track({
      message: {
        context: {},
        event: 'product_added',
        properties: {
          customProp: 'testProp',
          checkout_id: 'some_checkout_id',
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
              name: 'Food',
              brand: '',
              variant: 'Extra topped 1',
              price: 3.0,
              quantity: 2,
              currency: 'GBP',
              position: 1,
              value: 6.0,
              typeOfProduct: 'Food',
            },
          ],
        },
      },
    });
    expect(window.ttq.track.mock.calls[0][0]).toEqual('AddToCart');
    expect(window.ttq.track.mock.calls[0][1]).toEqual({
      value: 35.0,
      currency: 'GBP',
      event_id: 'purchaseId',
      partner_name: 'RudderStack',
      contents: [
        {
          content_category: 'Merch',
          content_id: 'abc',
          content_name: 'Food',
          content_type: 'product',
          price: 3.0,
          quantity: 2,
        },
      ],
    });
  });
  test('Testing Track product_added with content type in payload and multiple products', () => {
    tiktokads = new TiktokAds(basicConfig, { loglevel: 'DEBUG' });
    tiktokads.init();
    window.ttq.track = jest.fn();
    tiktokads.track({
      message: {
        context: {},
        event: 'product_added',
        properties: {
          customProp: 'testProp',
          checkout_id: 'some_checkout_id',
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
              name: 'Drink',
              brand: '',
              variant: 'Extra topped2',
              price: 3.0,
              quantity: 2,
              currency: 'GBP',
              position: 1,
              value: 6.0,
              typeOfProduct: 'Food',
              url: 'https://www.example.com/product/some_product',
              image_url: 'https://www.example.com/product/some_product.jpg',
            },
            {
              product_id: 'PRODUCT_ID',
              category: 'Wholesaler',
              name: 'Drink',
              brand: '',
              variant: 'Extra Cheese2',
              price: 50.0,
              quantity: 1,
              currency: 'GBP',
              position: 1,
              value: 30.0,
              typeOfProduct: 'Food',
              content_type: 'CONTENT_TYPE',
              url: 'https://www.example.com/product/some_product2',
              image_url: 'https://www.example.com/product/some_product2.jpg',
            },
          ],
        },
      },
    });
    expect(window.ttq.track.mock.calls[0][0]).toEqual('AddToCart');
    expect(window.ttq.track.mock.calls[0][1]).toEqual({
      value: 35.0,
      currency: 'GBP',
      event_id: 'purchaseId',
      partner_name: 'RudderStack',
      contents: [
        {
          content_category: 'Merch',
          content_id: 'abc',
          content_name: 'Drink',
          content_type: 'product',
          price: 3.0,
          quantity: 2,
        },
        {
          content_category: 'Wholesaler',
          content_id: 'PRODUCT_ID',
          content_name: 'Drink',
          content_type: 'CONTENT_TYPE',
          price: 50.0,
          quantity: 1,
        },
      ],
    });
  });

  test('Testing Track custom_event with no mapping and sendCustomEvents flag as true', () => {
    tiktokads = new TiktokAds({ ...basicConfig, sendCustomEvents: true }, { loglevel: 'DEBUG' });
    tiktokads.init();
    window.ttq.track = jest.fn();
    tiktokads.track({
      message: {
        context: {},
        event: 'custom_event',
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
              name: 'Drink',
              brand: '',
              variant: 'Extra topped',
              price: 3.0,
              quantity: 2,
              currency: 'GBP',
              position: 1,
              value: 6.0,
              typeOfProduct: 'Food',
              url: 'https://www.example.com/product/bacon-jam1',
              image_url: 'https://www.example.com/product/bacon-jam1.jpg',
            },
            {
              product_id: 'PRODUCT_ID',
              category: 'Wholesaler',
              name: 'Drink',
              brand: '',
              variant: 'Extra Cheese',
              price: 50.0,
              quantity: 1,
              currency: 'GBP',
              position: 1,
              value: 30.0,
              typeOfProduct: 'Food',
              content_type: 'CONTENT_TYPE',
              url: 'https://www.example.com/product/bacon-jam2',
              image_url: 'https://www.example.com/product/bacon-jam2.jpg',
            },
          ],
        },
      },
    });
    expect(window.ttq.track.mock.calls[0][0]).toEqual('custom_event');
    expect(window.ttq.track.mock.calls[0][1]).toEqual({
      value: 35.0,
      currency: 'GBP',
      event_id: 'purchaseId',
      partner_name: 'RudderStack',
      contents: [
        {
          content_category: 'Merch',
          content_id: 'abc',
          content_name: 'Drink',
          content_type: 'product',
          price: 3.0,
          quantity: 2,
        },
        {
          content_category: 'Wholesaler',
          content_id: 'PRODUCT_ID',
          content_name: 'Drink',
          content_type: 'CONTENT_TYPE',
          price: 50.0,
          quantity: 1,
        },
      ],
    });
  });

  test('Testing Track custom_event with no mapping and sendCustomEvents flag as false', () => {
    tiktokads = new TiktokAds({ ...basicConfig, sendCustomEvents: false }, { loglevel: 'DEBUG' });
    tiktokads.init();
    window.ttq.track = jest.fn();
    tiktokads.track({
      message: {
        context: {},
        event: 'custom_event',
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
              name: 'Drink',
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
            {
              product_id: 'PRODUCT_ID',
              category: 'Wholesaler',
              name: 'Drink',
              brand: '',
              variant: 'Extra Cheese',
              price: 50.0,
              quantity: 1,
              currency: 'GBP',
              position: 1,
              value: 30.0,
              typeOfProduct: 'Food',
              content_type: 'CONTENT_TYPE',
              url: 'https://www.example.com/product/bacon-jam',
              image_url: 'https://www.example.com/product/bacon-jam.jpg',
            },
          ],
        },
      },
    });
    expect(window.ttq.track).not.toHaveBeenCalledWith();
  });
});

describe('TiktokAds Identify event', () => {
  let tiktokads;
  beforeEach(() => {
    tiktokads = new TiktokAds(
      {
        pixelCode: '12567839',
        eventsToStandard: [
          { from: 'Sign Up', to: 'Signup' },
          { to: 'Lead', from: 'orderCompleted' },
          { from: 'Page View', to: 'PageVisit' },
          { from: 'productAdded', to: 'AddToCart' },
        ],
      },
      { loglevel: 'DEBUG' },
    );
    tiktokads.init();
    window.ttq.identify = jest.fn();
  });
  test('Testing Identify Custom Events', () => {
    tiktokads.identify({
      message: {
        userId: 'rudder01',
        context: {
          traits: {
            email: 'abc@ruddertack.com',
          },
        },
      },
    });
    expect(window.ttq.identify.mock.calls[0][0]).toEqual({ email: 'abc@ruddertack.com' });
  });
});
