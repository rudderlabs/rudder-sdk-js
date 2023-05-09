import BingAds from '../../../src/integrations/BingAds';
import { event, query, products } from './__mocks__/data';

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
    window.bing12567839.push = jest.fn((x) => output.push(x));
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
    window.bing12567839.push = jest.fn((x, y, z) => output.push({ event: y, ...z }));
  });

  test('Test for all properties not null', () => {
    bingAds.track({
      message: {
        type: 'track',
        context: {},
        event,
        properties: {
          eventAction: 'button_click',
          category: 'Food',
          currency: 'INR',
          total: 18.9,
          value: 20,
          revenue: 25.5,
          ecommCategory: 'Sports',
          transaction_id: 'txn-123',
          ecommPageType: 'Cart',
          query,
          products,
        },
      },
    });
    expect(output[0]).toEqual({
      event: 'button_click',
      event_label: event,
      event_category: 'Food',
      currency: 'INR',
      revenue_value: 18.9,
      search_term: query,
      ecomm_query: query,
      ecomm_category: 'Sports',
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
          eventAction: 'button_click',
          category: 'Food',
          currency: 'INR',
          customProp: 'custom',
        },
      },
    });
    expect(output[1]).toEqual({
      event: 'button_click',
      event_label: event,
      event_category: 'Food',
      currency: 'INR',
      ecomm_category: 'Food',
      customProp: 'custom',
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

    expect(output[2]).toEqual({
      event: 'track',
      event_label: event,
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
});
