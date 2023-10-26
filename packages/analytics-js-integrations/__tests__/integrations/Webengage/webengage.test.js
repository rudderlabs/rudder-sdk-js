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
    webengage.track({
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
        },
      },
    });
    expect(window.webengage.track.mock.calls[0][0]).toEqual('Custom');
    expect(window.webengage.track.mock.calls[0][1]).toEqual({
      customProp: 'testProp',
      checkout_id: 'what is checkout id here??',
      event_id: 'purchaseId',
      order_id: 'transactionId',
      value: 35.0,
      shipping: 4.0,
      coupon: 'APPARELSALE',
      currency: 'GBP',
    });
  });
});

describe('Webengage Identify event', () => {
  let webengage;
  beforeEach(() => {
    webengage = new Webengage(
      { licenseCode: '12567839', hashEmail: false, dataCentre: 'standard', hashPhone: false },
      { loadOnlyIntegrations: {}, loglevel: 'debug' },
    );
    window.webengage.track = jest.fn();
  });
  test('Testing Identify', () => {
    webengage.identify({
      message: {
        context: {
          traits: {
            email: 'alex@example.com',
            firstName: 'Alex',
            lastName: 'Keener',
          },
        },
        userId: 'user101',
      },
    });
    expect(window.webengage.user.login('user101'));
    expect(window.webengage.user.setAttribute('we_email', 'alex@example.com'));
    expect(window.webengage.user.setAttribute('we_first_name', 'Alex'));
    expect(window.webengage.user.setAttribute('we_last_name', 'Keener'));
  });
});
