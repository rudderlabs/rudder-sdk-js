import BingAds from '../../../src/integrations/BingAds/browser';
import { event, query, products } from './__fixtures__/data';

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

describe('BingAds init tests', () => {
  let Bingads;
  test('Testing init call of Bing ads', () => {
    Bingads = new BingAds({ tagID: '12567839' }, { loglevel: 'debug' });
    Bingads.init();
    expect(typeof window.bing12567839).toBe('object');
  });
});

describe('BingAds page', () => {
  let bingAds;
  const output = [];
  beforeEach(() => {
    bingAds = new BingAds({ tagID: '12567839' }, { loglevel: 'debug' });
    bingAds.init();
    window.bing12567839.push = jest.fn(x => output.push(x));
  });

  test('send pageview', () => {
    bingAds.page({
      context: {},
      properties: {
        category: 'test category',
        path: '/test',
        url: 'http://localhost',
        referrer: '',
        title: 'test page',
        testDimension: 'abc',
      },
    });
    expect(output[0]).toEqual('pageLoad');
  });
});

describe('BingAds Track event', () => {
  let bingAds;
  const output = [];
  beforeEach(() => {
    bingAds = new BingAds({ tagID: '12567839' }, { loglevel: 'DEBUG' });
    bingAds.init();
    window.bing12567839.push = jest.fn((_, y, z) => output.push({ event: y, ...z }));
  });
  test('Test for custom properties with enhanced conversions using email only with hashing disabled', () => {
    bingAds = new BingAds(
      { tagID: '12567839', enableEnhancedConversions: true, isHashRequired: false },
      { loglevel: 'DEBUG' },
    );
    bingAds.init();
    window.bing12567839.push = jest.fn((_, y, z) => output.push({ event: y, ...z }));
    bingAds.track({
      message: {
        type: 'track',
        context: {
          traits: { email: 'hashed_email' },
        },
        event,
        properties: {
          event_action: 'button_click',
          category: 'Food',
          currency: 'INR',
          customProp: 'custom',
        },
      },
    });
    expect(output[0]).toEqual({
      event: 'button_click',
      event_label: event,
      event_category: 'Food',
      currency: 'INR',
      customProp: 'custom',
      ecomm_pagetype: 'other',
      pid: {
        '': '',
        em: 'hashed_email',
      },
    });
  });

  test('Test for all properties not null', () => {
    bingAds.track({
      message: {
        type: 'track',
        context: {},
        event,
        properties: {
          event_action: 'button_click',
          category: 'Food',
          currency: 'INR',
          total: 18.9,
          value: 20,
          revenue: 25.5,
          ecomm_category: '80',
          transaction_id: 'txn-123',
          ecomm_pagetype: 'Cart',
          query,
          products,
        },
      },
    });
    expect(output[1]).toEqual({
      event: 'button_click',
      event_label: event,
      event_category: 'Food',
      currency: 'INR',
      revenue_value: 18.9,
      search_term: query,
      ecomm_query: query,
      ecomm_category: '80',
      transaction_id: 'txn-123',
      ecomm_pagetype: 'Cart',
      ecomm_prodid: ['123', '345'],
      items: [
        { id: '123', price: 14.99, quantity: 2 },
        { id: '345', price: 3.99, quantity: 1 },
      ],
      ecomm_totalvalue: 18.9,
    });
  });

  test('Test for custom properties', () => {
    bingAds.track({
      message: {
        type: 'track',
        context: {},
        event,
        properties: {
          event_action: 'button_click',
          category: 'Food',
          currency: 'INR',
          customProp: 'custom',
        },
      },
    });
    expect(output[2]).toEqual({
      event: 'button_click',
      event_label: event,
      event_category: 'Food',
      currency: 'INR',
      customProp: 'custom',
      ecomm_pagetype: 'other',
    });
  });

  test('Test for empty properties', () => {
    bingAds.track({
      message: {
        type: 'track',
        context: {},
        event,
        properties: {},
      },
    });

    expect(output[3]).toEqual({
      event: 'track',
      event_label: event,
      ecomm_pagetype: 'other',
    });
  });

  test('Test for empty/null type', () => {
    try {
      bingAds.track({
        message: {
          context: {},
          event: 'Custom',
          properties: {
            category: 'testCategory',
            currency: 'INR',
            value: 500,
            revenue: 200,
            total: 300,
          },
        },
      });
    } catch (error) {
      expect(error).toEqual('Event type not present');
    }
  });
  test('Test for all properties not null with pid data present in context.traits', () => {
    bingAds = new BingAds(
      { tagID: '12567839', enableEnhancedConversions: true },
      { loglevel: 'DEBUG' },
    );
    bingAds.init();
    window.bing12567839.push = jest.fn((_, y, z) => output.push({ event: y, ...z }));

    bingAds.track({
      message: {
        type: 'track',
        context: {
          traits: {
            pid: {
              phn: '422ce82c6fc1724ac878042f7d055653ab5e983d186e616826a72d4384b68af8',
              em: 'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d',
            },
          },
        },
        event,
        properties: {
          event_action: 'button_click',
          category: 'Food',
          currency: 'INR',
          total: 18.9,
          value: 20,
          revenue: 25.5,
          ecomm_category: '80',
          transaction_id: 'txn-123',
          ecomm_pagetype: 'Cart',
          query,
          products,
        },
      },
    });
    expect(output[4]).toEqual({
      event: 'button_click',
      event_label: event,
      event_category: 'Food',
      currency: 'INR',
      revenue_value: 18.9,
      search_term: query,
      ecomm_query: query,
      ecomm_category: '80',
      transaction_id: 'txn-123',
      ecomm_pagetype: 'Cart',
      ecomm_prodid: ['123', '345'],
      items: [
        { id: '123', price: 14.99, quantity: 2 },
        { id: '345', price: 3.99, quantity: 1 },
      ],
      ecomm_totalvalue: 18.9,
      pid: {
        phn: '422ce82c6fc1724ac878042f7d055653ab5e983d186e616826a72d4384b68af8',
        em: 'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d',
      },
    });
  });
  test('Test for custom properties with enhanced conversions using email only with hashing set as true', () => {
    bingAds = new BingAds(
      { tagID: '12567839', enableEnhancedConversions: true, isHashRequired: true },
      { loglevel: 'DEBUG' },
    );
    bingAds.init();
    window.bing12567839.push = jest.fn((_, y, z) => output.push({ event: y, ...z }));
    bingAds.track({
      message: {
        type: 'track',
        context: {
          traits: { email: 'abc+!@xyz.com' },
        },
        event,
        properties: {
          event_action: 'button_click',
          category: 'Food',
          currency: 'INR',
          customProp: 'custom',
        },
      },
    });
    expect(output[5]).toEqual({
      event: 'button_click',
      event_label: event,
      event_category: 'Food',
      currency: 'INR',
      customProp: 'custom',
      ecomm_pagetype: 'other',
      pid: {
        '': '',
        em: 'ee278943de84e5d6243578ee1a1057bcce0e50daad9755f45dfa64b60b13bc5d',
      },
    });
  });
});

describe('BingAds isLoaded tests', () => {
  let bingAds;

  beforeEach(() => {
    bingAds = new BingAds({ tagID: '12567839' }, { loglevel: 'debug' });
    // Clean up any existing UET environment
    delete window.UET;
    delete window.bing12567839;
  });

  test('should return true and set consent when fully loaded', () => {
    // Mock the UET environment
    window.UET = function () {};
    window.bing12567839 = {
      push: jest.fn(),
    };

    const isLoaded = bingAds.isLoaded();

    expect(isLoaded).toBe(true);
    expect(window.bing12567839.push).toHaveBeenCalledWith('consent', 'default', {
      ad_storage: 'granted',
    });
  });

  test('should return false and not set consent when not loaded', () => {
    // Don't mock anything to simulate not loaded state
    const isLoaded = bingAds.isLoaded();

    expect(isLoaded).toBe(false);
    // Should not throw any errors and no consent should be set
  });
});
