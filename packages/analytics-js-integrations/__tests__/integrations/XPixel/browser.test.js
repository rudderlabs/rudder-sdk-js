import { XPixel } from '../../../src/integrations/XPixel';

afterAll(() => {
  jest.restoreAllMocks();
});
const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

const basicConfig = {
  pixelId: '12567839',
  eventToEventIdMap: [
    { from: 'Sign Up', to: '123' },
    { from: 'Custom', to: '987' },
    { from: 'Page View', to: '456' },
    { from: 'Page View', to: '467' },
    { from: 'product_added', to: '789' },
  ],
};

describe('XPixel init tests', () => {
  beforeAll(() => {
    // Add a dummy script as it is required by the init script
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.id = 'dummyScript';
    const headElements = document.getElementsByTagName('head');
    headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
  });

  let xPixel;

  test('Testing init call of XPixel', () => {
    xPixel = new XPixel(basicConfig, { loglevel: 'debug' }, destinationInfo);
    xPixel.init();
    expect(typeof window.twq).toBe('function');
  });
});

describe('xPixel page', () => {
  let xPixel;
  beforeEach(() => {
    xPixel = new XPixel(basicConfig, { loglevel: 'debug' });
    xPixel.init();
    window.twq = jest.fn();
  });

  test('send pageview', () => {
    xPixel.page({
      message: {
        context: {},
        properties: {
          category: 'test cat',
          path: '/test',
          url: 'http://localhost',
          referrer: '',
          title: 'test page',
          testDimension: 'abc',
          value: 35.0,
          currency: 'GBP',
        },
      },
    });
    expect(window.twq.mock.calls[0]).toEqual(['event', '456', { currency: 'GBP', value: 35 }]);
    expect(window.twq.mock.calls[1]).toEqual(['event', '467', { currency: 'GBP', value: 35 }]);
  });
});

describe('XPixel Track event', () => {
  let xPixel;
  beforeEach(() => {});
  test('Testing Track Simple Event with contents build properties.products', () => {
    xPixel = new XPixel(basicConfig, { loglevel: 'DEBUG' }, destinationInfo);
    xPixel.init();
    window.twq = jest.fn();
    xPixel.track({
      message: {
        context: {},
        event: 'Custom',
        properties: {
          customProp: 'testProp',
          order_id: 'transactionId',
          value: 35.0,
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
    expect(window.twq.mock.calls[0]).toEqual([
      'event',
      '987',
      {
        currency: 'GBP',
        value: 35,
        contents: [
          {
            content_type: 'product',
            content_id: 'abc',
            content_name: 'Food',
            price: 3,
            num_items: 2,
          },
        ],
      },
    ]);
  });

  test('Testing Track product_added with contents', () => {
    xPixel = new XPixel(basicConfig, { loglevel: 'DEBUG' });
    xPixel.init();
    window.twq = jest.fn();
    xPixel.track({
      message: {
        context: {},
        event: 'product_added',
        properties: {
          customProp: 'testProp',
          event_id: 'purchaseId',
          order_id: 'transactionId',
          value: 35.0,
          currency: 'GBP',
          contents: {
            content_type: 'product',
            content_id: 'abc',
            content_name: 'Food/Drink',
            price: 3,
            num_items: 2,
          },
        },
      },
    });
    expect(window.twq.mock.calls[0]).toEqual([
      'event',
      '789',
      {
        currency: 'GBP',
        value: 35,
        event_id: 'purchaseId',
        contents: [
          {
            content_type: 'product',
            content_id: 'abc',
            content_name: 'Food/Drink',
            price: 3,
            num_items: 2,
          },
        ],
      },
    ]);
  });

  test('Test for empty properties', () => {
    xPixel = new XPixel(basicConfig, { loglevel: 'DEBUG' });
    xPixel.init();
    window.twq.track = jest.fn();
    xPixel.track({
      message: {
        type: 'track',
        context: {},
        event: 'Sign Up',
        properties: {},
      },
    });
    expect(window.twq.mock.calls[1]).toEqual(['event', '123', {}]);
  });
});
