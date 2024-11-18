/* eslint-disable no-underscore-dangle */
import { Adroll } from '../../../src/integrations/Adroll';

beforeEach(() => {
  window.__adroll = {};
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
  delete window.__adroll;
  delete window._adroll_email;
});

describe('Init tests', () => {
  let adroll;

  test('Basic initialization', () => {
    adroll = new Adroll({ advId: 'TEST_ADV_ID', pixId: 'TEST_PIX_ID' }, { logLevel: 'debug' });
    adroll.init();
    expect(window.adroll_adv_id).toBe('TEST_ADV_ID');
    expect(window.adroll_pix_id).toBe('TEST_PIX_ID');
  });
});

describe('isLoaded and isReady tests', () => {
  let adroll;

  beforeEach(() => {
    adroll = new Adroll({ advId: 'TEST_ADV_ID', pixId: 'TEST_PIX_ID' }, { logLevel: 'debug' });
  });

  test('isLoaded should return true when window.__adroll is available', () => {
    window.__adroll = { record_user: jest.fn() };
    expect(adroll.isLoaded()).toBe(true);
  });

  test('isLoaded should return false when window.__adroll is not available', () => {
    window.__adroll = undefined;
    expect(adroll.isLoaded()).toBe(false);
  });

  test('isReady should match isLoaded', () => {
    window.__adroll = { record_user: jest.fn() };
    expect(adroll.isReady()).toBe(adroll.isLoaded());
  });
});

describe('Identify tests', () => {
  let adroll;

  beforeEach(() => {
    adroll = new Adroll({ advId: 'TEST_ADV_ID', pixId: 'TEST_PIX_ID' }, { logLevel: 'debug' });
    window.__adroll = {
      record_adroll_email: jest.fn(),
    };
  });

  test('should identify user with email from context.traits', () => {
    const email = 'test@example.com';
    adroll.identify({
      message: {
        context: {
          traits: { email },
        },
      },
    });
    expect(window._adroll_email).toBe(email);
    expect(window.__adroll.record_adroll_email).toHaveBeenCalledWith('segment');
  });

  test('should identify user with email from traits', () => {
    const email = 'test@example.com';
    adroll.identify({
      message: {
        traits: { email },
      },
    });
    expect(window._adroll_email).toBe(email);
    expect(window.__adroll.record_adroll_email).toHaveBeenCalledWith('segment');
  });

  test('should not call record_adroll_email when email is missing', () => {
    adroll.identify({
      message: {
        traits: {},
      },
    });
    expect(window.__adroll.record_adroll_email).not.toHaveBeenCalled();
  });
});

describe('Track tests', () => {
  let adroll;

  beforeEach(() => {
    adroll = new Adroll(
      {
        advId: 'TEST_ADV_ID',
        pixId: 'TEST_PIX_ID',
        eventsMap: [
          { from: 'product viewed', to: 'abc123' },
          { from: 'order completed', to: 'def456' },
          { from: 'custom event', to: 'ghi789' },
        ],
      },
      { logLevel: 'debug' },
    );
    window.__adroll = {
      record_user: jest.fn(),
    };
  });

  test('should track product events', () => {
    adroll.track({
      message: {
        event: 'Product Viewed',
        properties: {
          product_id: '123',
          price: 99.99,
        },
      },
    });
    expect(window.__adroll.record_user).toHaveBeenCalledWith(
      expect.objectContaining({
        adroll_segments: 'abc123',
        product_id: '123',
      }),
    );
  });

  test('should track order events', () => {
    adroll.track({
      message: {
        event: 'Order Completed',
        properties: {
          order_id: 'ORDER123',
          revenue: 199.99,
        },
      },
    });
    expect(window.__adroll.record_user).toHaveBeenCalledWith(
      expect.objectContaining({
        adroll_segments: 'def456',
        order_id: 'ORDER123',
      }),
    );
  });

  test('should not track unmapped events', () => {
    adroll.track({
      message: {
        event: 'Unmapped Event',
        properties: {},
      },
    });
    expect(window.__adroll.record_user).not.toHaveBeenCalled();
  });

  test('should handle non-string event names', () => {
    // Test number event
    adroll.track({
      message: {
        event: 123,
        properties: {}
      }
    });
    
    // Test object event
    adroll.track({
      message: {
        event: { toString: () => 'custom event' },
        properties: {}
      }
    });
    
    expect(window.__adroll.record_user).toHaveBeenCalledWith(
      expect.objectContaining({
        adroll_segments: 'ghi789'
      })
    );
  });
});

describe('Page tests', () => {
  let adroll;

  beforeEach(() => {
    adroll = new Adroll(
      {
        advId: 'TEST_ADV_ID',
        pixId: 'TEST_PIX_ID',
        eventsMap: [
          { from: 'Viewed Landing Home Page', to: 'page123' }, // Updated mapping
        ],
      },
      { logLevel: 'debug' },
    );
    window.__adroll = {
      record_user: jest.fn(),
    };
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
        href: 'https://www.test-host.com/',
      },
      writable: true,
    });
  });

  test('should track page view with category and name', () => {
    adroll.page({
      message: {
        name: 'Home',
        category: 'Landing',
        properties: {},
      },
    });
    expect(window.__adroll.record_user).toHaveBeenCalledWith({
      name: 'Viewed Landing Home Page',
      path: '/',
      url: 'https://www.test-host.com/',
      adroll_segments: 'page123',
      referrer: '',
      search: undefined,
      title: '',
    });
  });
});
