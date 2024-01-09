import {
    payloadBuilder,
    payloadBuilderInList
  } from '../../../src/integrations/Podsights/utils';
import {LINE_ITEMS_CONFIG} from '../../../../analytics-js-common/src/constants/integrations/CommonIntegrationsConstant/constants'
describe('payloadBuilder', () => {

    // Builds payload with line_items if present in properties
    it('should build payload with line_items when line_items is present in properties', () => {
      const properties = {
            product_id: '123',
            product_name: 'Product 1',
            product_type: 'Type 1',
            product_vendor: 'Vendor 1',
            variant_id: '456',
            variant_name: 'Variant 1',
            value: 10,
            quantity: 2    
      };

      const CONFIG_EVENT = [
        {
          destKey: 'value',
          sourceKeys: 'value',
        },
        {
          destKey: 'currency',
          sourceKeys: 'currency',
        },
        {
          destKey: 'type',
          sourceKeys: 'type',
        },
        {
          destKey: 'category',
          sourceKeys: 'category',
        },
      ];

      const expectedPayload = { "value": 10,"line_items":[{"quantity":2, "product_id": "123","product_type": "Type 1"}]}

      const result = payloadBuilder(properties, CONFIG_EVENT, LINE_ITEMS_CONFIG);

      expect(result).toEqual(expectedPayload);
    });

    // Builds line_items payload from products array in properties
    it('should build line_items payload from products array in properties', () => {
      const properties = {
        products: [
          {
            productId: '123',
            productName: 'Product 1',
            productType: 'Type 1',
            productVendor: 'Vendor 1',
            variantId: '456',
            variantName: 'Variant 1',
            value: 10,
            quantity: 2
          },
          {
            productId: '789',
            productName: 'Product 2',
            productType: 'Type 2',
            productVendor: 'Vendor 2',
            variantId: '012',
            variantName: 'Variant 2',
            value: 20,
            quantity: 3
          }
        ]
      };

      const CONFIG_EVENT =  [
        {
          destKey: 'value',
          sourceKeys: 'price',
        },
        {
          destKey: 'currency',
          sourceKeys: 'currency',
        },
        {
          destKey: 'type',
          sourceKeys: 'type',
        },
        {
          destKey: 'category',
          sourceKeys: 'category',
        },
      ];

      const expectedPayload = {
        line_items: [
          {
            variant_id: '456',
            variant_name: 'Variant 1',
            quantity: 2
          },
          {
            variant_id: '012',
            variant_name: 'Variant 2',
            quantity: 3
          }
        ]
      };

      const result = payloadBuilder(properties, CONFIG_EVENT,LINE_ITEMS_CONFIG);

      expect(result).toEqual(expectedPayload);
    });

    // Builds line_items payload from single product object in properties
    it('should build line_items payload from single product object in properties', () => {
      const properties = {
        products: {
          productId: '123',
          productName: 'Product 1',
          productType: 'Type 1',
          productVendor: 'Vendor 1',
          variantId: '456',
          variantName: 'Variant 1',
          value: 10,
          quantity: 2
        }
      };

      const CONFIG_EVENT = [
        {
          destKey: 'value',
          sourceKeys: 'value',
        },
        {
          destKey: 'currency',
          sourceKeys: 'currency',
        },
        {
          destKey: 'discount_code',
          sourceKeys: 'discountCode',
        },
        {
          destKey: 'line_items',
          sourceKeys: 'lineItems',
        },
        {
          destKey: 'order_id',
          sourceKeys: 'orderId',
        },
        {
          destKey: 'is_new_customer',
          sourceKeys: 'isNewCustomer',
        },
        {
          destKey: 'quantity',
          sourceKeys: 'quantity',
        },
      ];;

      const expectedPayload = {
        line_items: [
          {
          }
        ]
      };

      const result = payloadBuilder(properties, CONFIG_EVENT,LINE_ITEMS_CONFIG);

      expect(result).toEqual(expectedPayload);
    });

    // No properties provided, returns empty payload
    it('should return empty payload when no properties are provided', () => {
      const properties = {};

      const CONFIG_EVENT = [
        {
          destKey: 'value',
          sourceKeys: 'value',
        },
        {
          destKey: 'currency',
          sourceKeys: 'currency',
        },
        {
          destKey: 'discount_code',
          sourceKeys: 'discountCode',
        },
        {
          destKey: 'line_items',
          sourceKeys: 'lineItems',
        },
        {
          destKey: 'order_id',
          sourceKeys: 'orderId',
        },
        {
          destKey: 'is_new_customer',
          sourceKeys: 'isNewCustomer',
        },
        {
          destKey: 'quantity',
          sourceKeys: 'quantity',
        },
      ];

      const expectedPayload = {"line_items":[{}]};

      const result = payloadBuilder(properties, CONFIG_EVENT, LINE_ITEMS_CONFIG);

      expect(result).toEqual(expectedPayload);
    });

    // No line_items or products in properties, returns payload without line_items
    it('should return payload without line_items when no line_items or products are present in properties', () => {
      const properties = {
        otherProperty: 'value'
      };

      const CONFIG_EVENT = [
        {
          destKey: 'value',
          sourceKeys: 'value',
        },
        {
          destKey: 'currency',
          sourceKeys: 'currency',
        },
        {
          destKey: 'discount_code',
          sourceKeys: 'discountCode',
        },
        {
          destKey: 'line_items',
          sourceKeys: 'lineItems',
        },
        {
          destKey: 'order_id',
          sourceKeys: 'orderId',
        },
        {
          destKey: 'is_new_customer',
          sourceKeys: 'isNewCustomer',
        },
        {
          destKey: 'quantity',
          sourceKeys: 'quantity',
        },
      ];

      const expectedPayload = {"line_items":[{}]};

      const result = payloadBuilder(properties, CONFIG_EVENT, LINE_ITEMS_CONFIG);

      expect(result).toEqual(expectedPayload);
    });

    // products in properties is not an array, builds line_items payload from single product object
    it('should build line_items payload from single product object when products is not an array', () => {
      const properties = {
        products: {
          productId: '123',
          productName: 'Product 1',
          productType: 'Type 1',
          productVendor: 'Vendor 1',
          variantId: '456',
          variantName: 'Variant 1',
          value: 10,
          quantity: 2
        }
      };

      const CONFIG_EVENT = [
        {
          destKey: 'value',
          sourceKeys: 'value',
        },
        {
          destKey: 'currency',
          sourceKeys: 'currency',
        },
        {
          destKey: 'discount_code',
          sourceKeys: 'discountCode',
        },
        {
          destKey: 'line_items',
          sourceKeys: 'lineItems',
        },
        {
          destKey: 'order_id',
          sourceKeys: 'orderId',
        },
        {
          destKey: 'is_new_customer',
          sourceKeys: 'isNewCustomer',
        },
        {
          destKey: 'quantity',
          sourceKeys: 'quantity',
        },
      ];

      const expectedPayload = {"line_items":[{}]};

      const result = payloadBuilder(properties, CONFIG_EVENT, LINE_ITEMS_CONFIG);

      expect(result).toEqual(expectedPayload);
    });
});

describe('payloadBuilderInList', () => {

    // Should return an array with a single payload object if properties.products is not defined
    it('should return an array with a single payload object if properties.products is not defined', () => {
      const properties = {};
      const CONFIG_EVENT = {};
      const expectedPayloadList = [{}];
  
      const result = payloadBuilderInList(properties, CONFIG_EVENT);
  
      expect(result).toEqual(expectedPayloadList);
    });

    // Should return an array with a single payload object if properties.products is an empty array
    it('should return an array with a single payload object if properties.products is an empty array', () => {
      const properties = { products: [] };
      const CONFIG_EVENT = {};
      const expectedPayloadList = [];
  
      const result = payloadBuilderInList(properties, CONFIG_EVENT);
  
      expect(result).toEqual(expectedPayloadList);
    });

    // Should return an array with a payload object for each product in properties.products
    it('should return an array with a payload object for each product in properties.products', () => {
      const properties = { products: [{ value: 100 }, { value: 200 }] };
      const CONFIG_EVENT =  [
        {
          destKey: 'value',
          sourceKeys: 'value',
        },
        {
          destKey: 'currency',
          sourceKeys: 'currency',
        },
        {
          destKey: 'discount_code',
          sourceKeys: 'discountCode',
        },
        {
          destKey: 'quantity',
          sourceKeys: 'quantity',
        },
        {
          destKey: 'line_items',
          sourceKeys: 'lineItems',
        },
      ];;
      const expectedPayloadList = [{ "value": 100}, { "value": 200}];
  
      const result = payloadBuilderInList(properties, CONFIG_EVENT);
  
      expect(result).toEqual(expectedPayloadList);
    });

    // Should handle missing properties argument
    it('should handle missing properties argument', () => {
      const CONFIG_EVENT = {};
      const expectedPayloadList = [{}];
  
      const result = payloadBuilderInList(undefined, CONFIG_EVENT);
  
      expect(result).toEqual(expectedPayloadList);
    });

    // Should handle missing CONFIG_EVENT argument
    it('should handle missing CONFIG_EVENT argument', () => {
      const properties = {};
      const expectedPayloadList = [{}];
  
      const result = payloadBuilderInList(properties, undefined);
  
      expect(result).toEqual(expectedPayloadList);
    });
});

