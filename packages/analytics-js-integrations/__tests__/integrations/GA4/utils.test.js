import {
  getItem,
  getItemList,
  getItemsArray,
  extractLastKey,
  filterUserTraits,
  shouldSendUserId,
  getExclusionFields,
  removeInvalidParams,
  isReservedEventName,
  getCustomParameters,
  formatAndValidateEventName,
  prepareStandardEventParams,
} from '../../../src/integrations/GA4/utils';

import {
  mapping,
  expectedItemsArray,
  inputProductsArray,
  outputProductsArray,
} from './__mocks__/data';

import {
  eventsConfig,
  itemsArrayParams,
  customParametersExclusion,
} from '../../../src/integrations/GA4/config';

describe('Google Analytics 4 utilities tests', () => {
  describe('sendUserIdToGA4 function tests', () => {
    test('Default integrationsObj', () => {
      const sendUserIdToGA4 = shouldSendUserId({ All: true });
      expect(sendUserIdToGA4).toEqual(true);
    });

    test('IntegrationsObj with GA4 and without sendUserId property', () => {
      const sendUserIdToGA4 = shouldSendUserId({ All: true, GA4: { sessionId: '1782034567' } });
      expect(sendUserIdToGA4).toEqual(true);
    });

    test('IntegrationsObj with GA4 and sendUserId set to true', () => {
      const sendUserIdToGA4 = shouldSendUserId({
        All: true,
        GA4: { sessionId: '1782034567', sendUserId: true },
      });
      expect(sendUserIdToGA4).toEqual(true);
    });

    test('IntegrationsObj with GA4 and sendUserId set to false', () => {
      const sendUserIdToGA4 = shouldSendUserId({
        All: true,
        GA4: { sessionId: '1782034567', sendUserId: false },
      });
      expect(sendUserIdToGA4).toEqual(false);
    });
  });

  describe('isReservedEventName function tests', () => {
    test('Standard Google Analytics 4 event name', () => {
      const isReserved = isReservedEventName('Products Searched');
      expect(isReserved).toEqual(false);
    });

    test('Custom Google Analytics 4 event name', () => {
      const isReserved = isReservedEventName('Product page visit');
      expect(isReserved).toEqual(false);
    });

    test('Reserved Google Analytics 4 event name', () => {
      const isReserved = isReservedEventName('app_remove');
      expect(isReserved).toEqual(true);
    });
  });

  describe('extractLastKey function tests', () => {
    test('Should extract last key from a string with dot', () => {
      const lastKey = extractLastKey('properties.product_id');
      expect(lastKey).toEqual('product_id');
    });

    test('Should return the input string when there is no dot', () => {
      const lastKey = extractLastKey('currency');
      expect(lastKey).toEqual('currency');
    });
  });

  describe('formatAndValidateEventName function tests', () => {
    test('Valid event name with spaces', () => {
      // Test a valid event name with spaces
      const eventName = 'product searched';
      const result = formatAndValidateEventName(eventName);
      // Expect the result to be the formatted event name with spaces replaced by underscores
      expect(result).toEqual('product_searched');
    });

    test('Empty event name', () => {
      // Test an empty event name
      const eventName = '';
      const result = formatAndValidateEventName(eventName);
      // Expect the result to be null
      expect(result).toBeNull();
    });

    test('Reserved event name', () => {
      // Test a reserved event name
      const eventName = 'click';
      const result = formatAndValidateEventName(eventName);
      // Expect the result to be null
      expect(result).toBeNull();
    });
  });

  describe('getCustomParameters function tests', () => {
    test('Return an empty object when message is empty', () => {
      const message = {};
      const keys = [];
      const exclusionFields = [];
      const result = getCustomParameters(message, keys, exclusionFields);
      expect(result).toEqual({});
    });

    test('Extract custom fields and flatten JSON', () => {
      const message = {
        properties: {
          product_id: '12345',
          price: 99.99,
          category: 'electronics',
        },
        user: {
          id: 'user123',
          name: 'John Doe',
        },
      };
      const keys = ['properties', 'user'];
      const exclusionFields = [];
      const result = getCustomParameters(message, keys, exclusionFields);
      expect(result).toEqual({
        product_id: '12345',
        price: 99.99,
        category: 'electronics',
        id: 'user123',
        name: 'John Doe',
      });
    });

    test('Exclude specified fields from extraction', () => {
      const message = {
        properties: {
          product_id: '12345',
          price: 99.99,
          category: 'electronics',
        },
        user: {
          id: 'user123',
          name: 'John Doe',
        },
      };
      const keys = ['properties', 'user'];
      const exclusionFields = ['price', 'name'];
      const result = getCustomParameters(message, keys, exclusionFields);
      expect(result).toEqual({
        product_id: '12345',
        category: 'electronics',
        id: 'user123',
      });
    });

    test('Handle root level extraction when keys parameter is "root"', () => {
      const message = {
        event: 'click',
        timestamp: 1625102800000,
        user: {
          id: 'user123',
          name: 'John Doe',
        },
      };
      const keys = 'root';
      const exclusionFields = [];
      const result = getCustomParameters(message, keys, exclusionFields);
      expect(result).toEqual({
        event: 'click',
        timestamp: 1625102800000,
        user_id: 'user123',
        user_name: 'John Doe',
      });
    });
  });

  describe('getExclusionFields function tests', () => {
    test('Return exclusion fields for mapping with string source keys', () => {
      const event = 'purchase';
      const exclusionFields = getExclusionFields(false, mapping, event);
      expect(exclusionFields).toEqual(['product_id', 'price', 'products']);
    });

    test('Include customParametersExclusion when mapRootLevelPropertiesToGA4ItemsArray is true and event supports root level products', () => {
      const event = 'select_item';
      const exclusionFields = getExclusionFields(true, mapping, event);
      const expectedExclusionFields = [
        'product_id',
        'price',
        'products',
        ...customParametersExclusion,
      ];
      expect(exclusionFields).toEqual(expectedExclusionFields);
    });

    test('Exclude "products" for events supporting root level products, regardless of mapping or mapRootLevelPropertiesToGA4ItemsArray value', () => {
      const event = 'purchase';
      const exclusionFields1 = getExclusionFields(false, mapping, event);
      const exclusionFields2 = getExclusionFields(true, mapping, event);
      expect(exclusionFields1).toContain('products');
      expect(exclusionFields2).toContain('products');
    });
  });

  describe('getItemList function tests', () => {
    test('Return an empty array if message properties.products is undefined', () => {
      const message = { properties: {} };
      const items = getItemList(message);
      expect(items).toEqual([]);
    });

    test('Return an empty array if message properties.products is an empty array', () => {
      const message = { properties: { products: [] } };
      const items = getItemList(message);
      expect(items).toEqual([]);
    });

    test('Construct payload and return an array of items', () => {
      const message = {
        properties: {
          products: inputProductsArray,
        },
      };
      const items = getItemList(message, itemsArrayParams);
      expect(items).toEqual(outputProductsArray);
    });

    test('Products is an object and return an array of items', () => {
      const message = {
        properties: {
          products: inputProductsArray[0],
        },
      };
      const items = getItemList(message, itemsArrayParams);
      expect(items).toEqual([outputProductsArray[0]]);
    });
  });

  describe('getItem function tests', () => {
    test('Return an empty array if properties is undefined', () => {
      const message = {};
      const item = getItem(message);
      expect(item).toEqual([]);
    });

    test('Return an empty array if properties is an empty object', () => {
      const message = {
        properties: {},
      };
      const item = getItem(message);
      expect(item).toEqual([]);
    });

    test('Return an array with a single item if properties is not empty', () => {
      const message = {
        properties: inputProductsArray[0],
      };

      const item = getItem(message);
      expect(item).toEqual([expectedItemsArray[0]]);
    });

    test('Return an empty array if the constructed item is an empty object', () => {
      const message = {
        properties: {
          invalidField: null,
        },
      };
      const item = getItem(message);
      expect(item).toEqual([]);
    });
  });

  describe('getItemsArray function tests', () => {
    test('Returns items array and mapRootLevelPropertiesToGA4ItemsArray as false when product parameter is supported', () => {
      const message = {
        properties: {
          products: inputProductsArray,
        },
      };
      const config = eventsConfig.PRODUCT_ADDED;

      const itemsArray = getItemsArray(message, config);
      expect(itemsArray).toEqual({
        items: outputProductsArray,
        mapRootLevelPropertiesToGA4ItemsArray: false,
      });
    });

    test('Returns items array and mapRootLevelPropertiesToGA4ItemsArray as true when product parameter is not supported', () => {
      const message = {
        properties: inputProductsArray[1],
      };
      const config = eventsConfig.PRODUCTS_CLICKED;

      const itemsArray = getItemsArray(message, config);
      expect(itemsArray).toEqual({
        items: [expectedItemsArray[1]],
        mapRootLevelPropertiesToGA4ItemsArray: true,
      });
    });
  });

  describe('removeInvalidValues function tests', () => {
    it('Should remove empty values except for "items"', () => {
      const params = {
        name: 'John',
        age: 30,
        email: '',
        city: null,
        items: [],
        address: {},
        phone: '123456789',
      };

      const expected = {
        name: 'John',
        items: [],
        age: 30,
        phone: '123456789',
      };

      const result = removeInvalidParams(params);
      expect(result).toEqual(expected);
    });
  });

  describe('filterUserTraits function tests', () => {
    it('Should update mentioned PII keys value to null', () => {
      const piiPropertiesToIgnore = [
        { piiProperty: 'email' },
        { piiProperty: 'phone' },
        { piiProperty: 'card_number' },
      ];

      const userTraits = {
        name: 'SDK Test',
        email: 'sdk@test.com',
        card_number: '123456',
        phone: '123456789',
        country: 'usa',
      };

      const filteredUserTraits = {
        name: 'SDK Test',
        country: 'usa',
        email: null,
        card_number: null,
        phone: null,
      };

      const result = filterUserTraits(piiPropertiesToIgnore, userTraits);
      expect(result).toEqual(filteredUserTraits);
    });

    it('Should override values of pii fields to null', () => {
      const piiPropertiesToIgnore = [
        { piiProperty: 'email' },
        { piiProperty: 'name' },
        { piiProperty: 'isPaid' },
        { piiProperty: undefined },
        { piiProperty: {} },
      ];

      const userTraits = {
        name: 'SDK Test',
        email: 'sdk@test.com',
        isPaid: false,
      };

      const result = filterUserTraits(piiPropertiesToIgnore, userTraits);
      expect(result).toEqual({
        name: null,
        email: null,
        isPaid: null,
      });
    });
  });
});

describe('prepareStandardEventParams function tests', () => {
  it('Should not fail when values are 0', () => {
    const eventConfig = {
      event: 'UserSignup',
      mapping: [
        { sourceKeys: ['properties.total'], destKey: 'order_total', required: true },
        { sourceKeys: ['properties.value'], destKey: 'order_value', required: true },
        { sourceKeys: ['properties.revenue'], destKey: 'order_revenue', required: true },
        { sourceKeys: ['properties.price'], destKey: 'order_price', required: true },
      ],
    };
    const message = {
      properties: {
        total: 0, // Total is 0 but should pass without failure
        value: 0, // Value is 0 but should pass without failure
        revenue: 0, // Revenue is 0 but should pass without failure
        price: 0, // Price is 0 but should pass without failure
      },
      event: 'UserSignup',
    };
    const result = prepareStandardEventParams(message, eventConfig);
    expect(result).toEqual({
      order_total: 0,
      order_value: 0,
      order_revenue: 0,
      order_price: 0,
    });
  });

  it('Should handle mixed types (string, number, array, boolean) in the same payload', () => {
    const eventConfig = {
      event: 'UserSignup',
      mapping: [
        { sourceKeys: ['properties.total'], destKey: 'order_total', required: true },
        { sourceKeys: ['properties.value'], destKey: 'order_value', required: true },
        { sourceKeys: ['properties.revenue'], destKey: 'order_revenue', required: true },
        { sourceKeys: ['properties.price'], destKey: 'order_price', required: true },
      ],
    };
    const message = {
      properties: {
        total: '100', // String
        value: 0, // Number
        revenue: [50, 60], // Array
        price: true, // Boolean
      },
      event: 'UserSignup',
    };
    const result = prepareStandardEventParams(message, eventConfig);
    expect(result).toEqual({
      order_total: '100',
      order_value: 0,
      order_revenue: [50, 60],
      order_price: true,
    });
  });

  it('should handle undefined and null values appropriately', () => {
    const eventConfig = {
      event: 'UserSignup',
      mapping: [
        { sourceKeys: ['properties.total'], destKey: 'order_total', required: true },
        { sourceKeys: ['properties.optional'], destKey: 'optional_field', required: false },
      ],
    };

    const message = {
      properties: {
        total: 0,
        optional: undefined,
      },
      event: 'UserSignup',
    };

    const result = prepareStandardEventParams(message, eventConfig);
    expect(result).toEqual({
      order_total: 0,
    });
  });

  it('should handle negative values correctly', () => {
    const eventConfig = {
      event: 'Refund',
      mapping: [{ sourceKeys: ['properties.amount'], destKey: 'refund_amount', required: true }],
    };

    const message = {
      properties: {
        amount: -50,
      },
      event: 'Refund',
    };

    const result = prepareStandardEventParams(message, eventConfig);
    expect(result).toEqual({
      refund_amount: -50,
    });
  });

  it('Should correctly handle a mix of data types (string, number, array, boolean) and metadata', () => {
    const eventConfig = {
      event: 'UserSignup',
      mapping: [
        { sourceKeys: ['properties.total'], destKey: 'order_total', required: true },
        { sourceKeys: ['properties.value'], destKey: 'order_value', required: true },
        { sourceKeys: ['properties.revenue'], destKey: 'order_revenue', required: true },
        { sourceKeys: ['properties.price'], destKey: 'order_price', required: true },
        { sourceKeys: ['properties.isActive'], destKey: 'user_isActive', required: true },
        { sourceKeys: ['properties.items'], destKey: 'order_items', required: false }, // Optional field
      ],
    };

    const message = {
      properties: {
        total: 0, // Number
        value: '200', // String
        revenue: [300, 400], // Array
        price: 12, // Number
        isActive: false, // Boolean
        items: ['item1', 'item2'], // Array (optional)
      },
      event: 'UserSignup',
    };

    const metadata = {
      order_total: 0,
      order_value: 0,
      order_revenue: 0,
      order_price: 12,
      user_isActive: true,
      order_items: ['item3', 'item4'],
    };

    const result = prepareStandardEventParams(message, eventConfig, metadata);

    // Using toEqual to check if the result matches the expected object
    expect(result).toEqual({
      order_total: 0,
      order_value: '200',
      order_revenue: [300, 400],
      order_price: 12,
      user_isActive: false,
      order_items: ['item1', 'item2'],
    });
  });

  it('should return null when required parameters are missing', () => {
    const eventConfig = {
      event: 'Purchase',
      mapping: [
        { sourceKeys: ['properties.total'], destKey: 'order_total', required: true },
        { sourceKeys: ['properties.currency'], destKey: 'currency', required: true }
      ],
    };

    const message = {
      properties: {
        // total is missing
        currency: 'USD'
      },
      event: 'Purchase',
    };

    const result = prepareStandardEventParams(message, eventConfig);
    expect(result).toBeNull();
  });
});
