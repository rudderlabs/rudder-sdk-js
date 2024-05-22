import {
  buildCommonPayload,
  buildEcommPayload,
  handleProductsArray,
  constructPidPayload,
} from '../../../src/integrations/BingAds/utils';
import { query, products } from './__fixtures__/data';

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
        ecomm_category: '80',
        transaction_id: 'txn-123',
        ecomm_pagetype: 'Cart',
        query,
        products,
      },
    });
    expect(payload).toEqual({
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

  test('Test for ecomm total value computed from products array', () => {
    const payload = buildEcommPayload({
      properties: {
        category: 'Food',
        category_id: '80',
        transaction_id: 'txn-123',
        ecomm_pagetype: 'Cart',
        query,
        products,
      },
    });
    expect(payload).toEqual({
      search_term: 'Sport T-Shirt',
      ecomm_query: 'Sport T-Shirt',
      ecomm_category: '80',
      transaction_id: 'txn-123',
      ecomm_pagetype: 'Cart',
      ecomm_prodid: ['123', '345'],
      items: [
        { id: '123', price: 14.99, quantity: 2 },
        { id: '345', price: 3.99, quantity: 1 },
      ],
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
      ecomm_pagetype: 'other',
    });
  });
});

describe('Construct PID payload for enahcned conversions', () => {
  it('should return undefined when both email and phone are undefined', () => {
    // Arrange
    const message = {};

    // Act
    const result = constructPidPayload(message);

    // Assert
    expect(result).toEqual(undefined);
  });

  // Returns undefined when email is invalid
  it('should return undefined when email is invalid and phone is not given', () => {
    // Arrange
    const message = {
      context: {
        traits: {
          email: 'invalidemail',
        },
      },
    };

    // Act
    const result = constructPidPayload(message);

    // Assert
    expect(result).toBeUndefined();
  });

  // Returns an object with only email property when only email is defined
  it('should return an object with only email property when only email is defined', () => {
    // Arrange
    const message = {
      context: {
        traits: {
          email: 'test+1@example.com',
        },
      },
    };

    // Act
    const result = constructPidPayload(message);

    // Assert
    expect(result).toEqual({
      em: '973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b',
      '': '',
    });
  });

  // Returns an object with only phone property when only phone is defined
  it('should return an object with only phone property when only phone is defined', () => {
    // Arrange
    const message = {
      traits: {
        phone: '1234567890',
      },
    };

    // Act
    const result = constructPidPayload(message);

    // Assert
    expect(result).toEqual({
      ph: '422ce82c6fc1724ac878042f7d055653ab5e983d186e616826a72d4384b68af8',
      '': '',
    });
  });

  // Returns an object with both email and phone properties when both are defined
  it('should return an object with both email and phone properties when both are defined', () => {
    // Arrange
    const message = {
      context: {
        traits: {
          email: 'test@example.com',
        },
      },
      traits: {
        phone: '1234567890',
      },
    };

    // Act
    const result = constructPidPayload(message);

    // Assert
    expect(result).toEqual({
      em: '973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b',
      ph: '422ce82c6fc1724ac878042f7d055653ab5e983d186e616826a72d4384b68af8',
    });
  });
});
