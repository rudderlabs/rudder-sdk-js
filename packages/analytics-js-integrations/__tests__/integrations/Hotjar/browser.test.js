import { Hotjar } from '../../../src/integrations/Hotjar/browser';

afterAll(() => {
  jest.restoreAllMocks();
});
describe('Hotjar init tests', () => {
  let hotjar;

  test('Testing init call of Hotjar', () => {
    hotjar = new Hotjar({ siteId: '12567839' }, { loglevel: 'debug' });
    hotjar.init();
    expect(typeof window.hj).toBe('function');
  });
});

const traits = {
  name: 'Alex Keener',
  email: 'alex@example.com',
  company: {
    id: 'group01',
    name: 'Tech Group',
    remove: true,
  },
};

describe('Hotjar Identify event', () => {
  let hotjar;
  beforeEach(() => {
    hotjar = new Hotjar({ siteId: '12567839' }, { loglevel: 'debug' });
    hotjar.analytics.loadOnlyIntegrations = {};
    window.hj = jest.fn();
  });
  test('Testing Identify Events to create or update user information', () => {
    hotjar.identify({
      message: {
        userId: 'rudder01',
        anonymousId: 'urgyffsd43weehjdbs44fvdsd',
        context: { traits },
        createdAt: 'Mon May 19 2019 18:34:24 GMT0000 (UTC)',
      },
    });
    expect(window.hj.mock.calls[0][0]).toEqual('identify');
    expect(window.hj.mock.calls[0][1]).toEqual('rudder01');
    expect(window.hj.mock.calls[0][2]).toEqual(traits);
  });
});

describe('Hotjar Track event', () => {
  let hotjar;
  beforeEach(() => {
    hotjar = new Hotjar({ siteId: '12567839' }, { loglevel: 'debug' });
    window.hj = jest.fn();
  });
  test('Testing Track Events', () => {
    hotjar.track({
      message: {
        context: {},
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
    expect(window.hj.mock.calls[0][0]).toEqual('event');
    expect(window.hj.mock.calls[0][1]).toEqual('Order_Completed');
  });
  test('Testing Track Events without event', () => {
    try {
      hotjar.track({
        message: {
          context: {},
          properties: {
            order_id: '140021222',
            checkout_id: 'WAP3211',
            products: 'sports_shoes',
            revenue: 77.95,
            currency: 'USD',
          },
        },
      });
    } catch (error) {
      expect(error).toEqual('Event name is not present');
    }
  });
  test('Testing Track Events with non-string event name', () => {
    try {
      hotjar.track({
        message: {
          context: {},
          event: 43434,
          properties: {
            order_id: '140021222',
            checkout_id: 'WAP3211',
            products: 'sports_shoes',
            revenue: 77.95,
            currency: 'USD',
          },
        },
      });
    } catch (error) {
      expect(error).toEqual('Event name should be string');
    }
  });
});
