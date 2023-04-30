import {
  buildCommonPayload,
  buildEcommPayload,
  handleProductsArray,
} from '../../../src/integrations/BingAds/utils';
import { query, products } from './__mocks__/data';

describe('Build common payload utility tests', () => {
  test('Test for all properties not null', () => {
    const payload = buildCommonPayload({
      event: 'Test',
      properties: {
        category: 'Food',
        currency: 'INR',
        total: 18.9,
        value: 20,
        revenue: 25.5,
      },
    });
    expect(payload).toEqual({
      event_label: 'Test',
      event_category: 'Food',
      currency: 'INR',
      revenue_value: 18.9,
    });
  });

  test('Test for empty payload', () => {
    const payload = buildCommonPayload({});
    expect(payload).toEqual({
      event_label: undefined,
      event_category: undefined,
      currency: undefined,
      revenue_value: undefined,
    });
  });
});

describe('Handle products array utility tests', () => {
  test('Test for multiple products in products array', () => {
    const payload = handleProductsArray({
      products,
    });
    expect(payload).toEqual({
      ecomm_prodid: ['123', '345'],
      items: [
        { id: '123', price: 14.99, quantity: 2 },
        { id: '345', price: 3.99, quantity: 1 },
      ],
      ecomm_totalvalue: 33.97,
    });
  });

  test('Test for single product at root level properties', () => {
    const payload = handleProductsArray({
      product_id: '123',
      sku: 'F15',
      price: 13.49,
      quantity: 2,
    });
    expect(payload).toEqual({
      ecomm_prodid: ['123'],
      items: [{ id: '123', price: 13.49, quantity: 2 }],
      ecomm_totalvalue: 26.98,
    });
  });

  test('Test for empty properties', () => {
    const payload = handleProductsArray({});
    expect(payload).toEqual({});
  });
});

describe('Build ecomm payload utility tests', () => {
  test('Test for all properties not null', () => {
    const payload = buildEcommPayload({
      properties: {
        category: 'Food',
        total: 18.9,
        value: 20,
        revenue: 25.5,
        ecommCategory: 'Sports',
        transaction_id: 'txn-123',
        ecommPageType: 'Cart',
        query,
        products,
      },
    });
    expect(payload).toEqual({
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

  test('Test for ecomm total value computed from products array', () => {
    const payload = buildEcommPayload({
      properties: {
        category: 'Food',
        ecommCategory: 'Sports',
        transaction_id: 'txn-123',
        ecommPageType: 'Cart',
        query,
        products,
      },
    });
    expect(payload).toEqual({
      search_term: 'Sport T-Shirt',
      ecomm_query: 'Sport T-Shirt',
      ecomm_category: 'Sports',
      transaction_id: 'txn-123',
      ecomm_pagetype: 'Cart',
      ecomm_prodid: ['123', '345'],
      items: [
        { id: '123', price: 14.99, quantity: 2 },
        { id: '345', price: 3.99, quantity: 1 },
      ],
      ecomm_totalvalue: 33.97,
    });
  });

  test('Test for empty payload', () => {
    const payload = buildEcommPayload({});
    expect(payload).toEqual({
      search_term: undefined,
      ecomm_query: undefined,
      ecomm_category: undefined,
      transaction_id: undefined,
      ecomm_totalvalue: undefined,
    });
  });
});
