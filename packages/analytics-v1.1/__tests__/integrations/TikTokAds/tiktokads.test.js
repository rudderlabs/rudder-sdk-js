import TiktokAds from 'rudder-sdk-js/integrations/TiktokAds/browser';

beforeEach(() => {
  // Add a dummy script as it is required by the init script
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
});

afterEach(() => {
  // Reset DOM to original state
  document.getElementById('dummyScript')?.remove();
});

afterAll(() => {
  jest.restoreAllMocks();
});
describe('tiktokads init tests', () => {
  let tiktokads;
  test('Testing init call of TiktokAds', () => {
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
      { loglevel: 'debug' },
    );
    tiktokads.init();
    expect(typeof window.ttq).toBe('object');
  });
});

describe('tiktokads page', () => {
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
      { loglevel: 'debug' },
    );
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
  beforeEach(() => {
    tiktokads = new TiktokAds(
      {
        pixelCode: '12567839',
        eventsToStandard: [
          { from: 'Sign Up', to: 'Signup' },
          { to: 'Lead', from: 'orderCompleted' },
          { from: 'Page View', to: 'PageVisit' },
          { from: 'Custom', to: 'AddToCart' },
        ],
      },
      { loglevel: 'DEBUG' },
    );
    tiktokads.init();
    window.ttq.track = jest.fn();
  });
  test('Testing Track Custom Events with no content_type in payload', () => {
    tiktokads.track({
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
              name: 'Food',
              brand: '',
              variant: 'Extra topped',
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
  test('Testing Track Custom Events with content type in payload and multiple products', () => {
    tiktokads.track({
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
    expect(window.ttq.track.mock.calls[0][0]).toEqual('AddToCart');
    expect(window.ttq.track.mock.calls[0][1]).toEqual({
      value: 35.0,
      currency: 'GBP',
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
