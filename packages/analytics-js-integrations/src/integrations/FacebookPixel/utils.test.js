import { getProductListViewedEventParams } from './utils';

describe('Facebook Pixel utils', () => {
  describe('getProductListViewedEventParams', () => {
    // When products is an array, it should extract contentIds and contents correctly
    it('should extract contentIds and contents correctly when products is an array', () => {
      const mockContents = [
        { id: 'prod1', quantity: 2 },
        { id: 'prod2', quantity: 1 },
      ];
      const mockContentIds = ['prod1', 'prod2'];

      // Test data
      const properties = {
        products: [
          { product_id: 'prod1', quantity: 2 },
          { product_id: 'prod2', quantity: 1 },
        ],
      };

      // Execute the function
      const result = getProductListViewedEventParams(properties);

      // Assertions
      expect(result).toEqual({
        contentIds: mockContentIds,
        contentType: 'product',
        contents: mockContents,
      });
    });

    // When products array is empty
    it('should return empty arrays when products array is empty', () => {
      const properties = {
        products: [],
      };

      const result = getProductListViewedEventParams(properties);

      expect(result).toEqual({
        contentIds: [],
        contents: [],
      });
    });

    // When products is undefined
    it('should return empty arrays when products is undefined', () => {
      const properties = {};

      const result = getProductListViewedEventParams(properties);

      expect(result).toEqual({
        contentIds: [],
        contents: [],
      });
    });

    // When product_id is missing in some products
    it('should handle missing product_id in products array', () => {
      const properties = {
        products: [
          { product_id: 'prod1', quantity: 2 },
          { quantity: 1 }, // Missing product_id
          { product_id: 'prod3', quantity: 3 },
        ],
      };

      const result = getProductListViewedEventParams(properties);

      expect(result).toEqual({
        contentIds: ['prod1', 'prod3'],
        contentType: 'product',
        contents: [
          { id: 'prod1', quantity: 2 },
          { id: 'prod3', quantity: 3 },
        ],
      });
    });

    // When quantity is missing in some products
    it('should default to quantity 1 when quantity is missing', () => {
      const properties = {
        products: [
          { product_id: 'prod1' }, // Missing quantity
          { product_id: 'prod2', quantity: 2 },
        ],
      };

      const result = getProductListViewedEventParams(properties);

      expect(result).toEqual({
        contentIds: ['prod1', 'prod2'],
        contentType: 'product',
        contents: [
          { id: 'prod1', quantity: 1 }, // Default quantity
          { id: 'prod2', quantity: 2 },
        ],
      });
    });
  });
});
