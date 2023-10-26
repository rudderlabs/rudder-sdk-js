import Webengage from '../../../src/integrations/Webengage/browser';

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

describe('Webengage init tests', () => {
  let webengage;

  test('Testing init call of Webengage', () => {
    webengage = new Webengage(
      { licenseCode: '12567839', hashEmail: false, dataCentre: 'standard', hashPhone: false },
      { loadOnlyIntegrations: {}, loglevel: 'debug' },
    );
    webengage.init();
    expect(typeof window.webengage).toBe('object');
  });
});

describe('Webengage Track event', () => {
  let webengage;
  beforeEach(() => {
    webengage = new Webengage(
      { licenseCode: '12567839', hashEmail: false, dataCentre: 'standard', hashPhone: false },
      { loadOnlyIntegrations: {}, loglevel: 'debug' },
    );
    window.webengage.track = jest.fn();
  });
  test('Testing Track Custom Events', () => {
    webengage.track('Added To Cart', {
      ProductID: 1337,
      Price: 39.8,
      Quantity: 1,
      Product: 'Givenchy Pour Homme Cologne',
      Category: 'Fragrance',
      Currency: 'USD',
      Discounted: true,
    });
    expect(window.webengage.event.mock.calls[0][0]).toEqual('Custom');
    expect(window.webengage.event.mock.calls[0][1]).toEqual({
      customProp: 'testProp',
      checkoutId: 'what is checkout id here??',
      eventId: 'purchaseId',
      orderId: 'transactionId',
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
    });
  });
});
