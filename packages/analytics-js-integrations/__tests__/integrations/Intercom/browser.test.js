import INTERCOM from '../../../src/integrations/INTERCOM/browser';

afterAll(() => {
  jest.restoreAllMocks();
});
describe('Intercom init tests', () => {
  let intercom;

  test('Testing init call of Intercom', () => {
    intercom = new INTERCOM({ appId: '12567839' }, { loglevel: 'debug' });
    intercom.init();
    expect(typeof window.Intercom).toBe('function');
  });
});

beforeEach(() => {
  // Add a dummy script as it is required by the init script
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
  delete window.Intercom;
});

describe('Intercom Identify event', () => {
  let intercom;
  beforeEach(() => {
    intercom = new INTERCOM({ appId: '12567839' }, { loglevel: 'debug' });
    intercom.analytics.loadOnlyIntegrations = {};
    window.Intercom = jest.fn();
  });
  test('Testing Identify Events to create or update user information', () => {
    intercom.identify({
      message: {
        userId: 'rudder01',
        anonymousId: 'urgyffsd43weehjdbs44fvdsd',
        context: {
          traits: {
            name: 'Alex Keener',
            email: 'alex@example.com',
            company: {
              id: 'group01',
              name: 'Tech Group',
              remove: true,
            },
          },
        },
        createdAt: 'Mon May 19 2019 18:34:24 GMT0000 (UTC)',
      },
    });
    expect(window.Intercom.mock.calls[0][0]).toEqual('update');
    expect(window.Intercom.mock.calls[0][1]).toEqual({
      name: 'Alex Keener',
      email: 'alex@example.com',
      companies: [
        {
          company_id: 'group01',
          name: 'Tech Group',
          remove: true,
        },
      ],
      user_id: 'rudder01',
    });
  });
  test('Identify Events to create or update user information', () => {
    intercom.identify({
      message: {
        userId: 'rudder01',
        anonymousId: 'urgyffsd43weehjdbs44fvdsd',
        context: {
          traits: {
            name: 'Alex Keener',
            email: 'alex@example.com',
            company: {
              id: 'group01',
              name: 'Tech Group',
              remove: true,
            },
          },
        },
        createdAt: 'Mon May 19 2019 18:34:24 GMT0000 (UTC)',
      },
    });
    expect(window.Intercom.mock.calls[0][0]).toEqual('update');
    expect(window.Intercom.mock.calls[0][1]).toEqual({
      name: 'Alex Keener',
      email: 'alex@example.com',
      companies: [
        {
          company_id: 'group01',
          name: 'Tech Group',
          remove: true,
        },
      ],
      user_id: 'rudder01',
    });
  });
});

describe('Intercom Track event', () => {
  let intercom;
  beforeEach(() => {
    intercom = new INTERCOM({ appId: '12567839' }, { loglevel: 'debug' });
    window.Intercom = jest.fn();
  });
  test('Testing Track Events', () => {
    intercom.track({
      message: {
        context: {},
        // eslint-disable-next-line sonarjs/no-duplicate-string
        event: 'Order Completed',
        properties: {
          order_id: '140021222',
          checkout_id: 'WAP3211',
          products: 'sports_shoes',
          revenue: 77.95,
          currency: 'USD',
        },
      },
    });
    expect(window.Intercom.mock.calls[0][0]).toEqual('trackEvent');
    expect(window.Intercom.mock.calls[0][1]).toEqual('Order Completed');
    expect(window.Intercom.mock.calls[0][2]).toEqual({
      checkout_id: 'WAP3211',
      created_at: NaN,
      currency: 'USD',
      event_name: 'Order Completed',
      order_id: '140021222',
      products: 'sports_shoes',
      revenue: 77.95,
      user_id: undefined,
    });
  });
});
