import { handleProductAdded } from '../../../src/integrations/Criteo/utils';

describe('handleProductAdded', () => {
    // The function correctly extracts the 'properties' object from the 'message' parameter.
    it('should correctly extract properties object from message parameter', () => {
      const message = {
        properties: {
          product_id: '123',
          price: '9.99',
          quantity: '5',
          currency: 'USD',
        },
      };
      const finalPayload = [];
  
      handleProductAdded(message, finalPayload);
  
      expect(finalPayload.length).toBe(1);
      expect(finalPayload[0].event).toBe('addToCart');
      expect(finalPayload[0].currency).toBe('USD');
      expect(finalPayload[0].item.length).toBe(1);
      expect(finalPayload[0].item[0].id).toBe('123');
      expect(finalPayload[0].item[0].price).toBe(9.99);
      expect(finalPayload[0].item[0].quantity).toBe(5);
    });
  
    // When the 'message' parameter is undefined, the function throws an error.
    it('should throw an error when message parameter is undefined', () => {
      const message = undefined;
      const finalPayload = [];
  
      expect(() => {
        handleProductAdded(message, finalPayload);
      }).toThrow();
    });
  
    // When the 'properties' object is valid, the function creates an 'addToCartObject' with the correct structure.
    it('should create addToCartObject with correct structure when properties object is valid', () => {
      const message = {
        properties: {
          product_id: '123',
          price: '9.99',
          quantity: '5',
          currency: 'USD',
        },
      };
      const finalPayload = [];
  
      handleProductAdded(message, finalPayload);
  
      expect(finalPayload.length).toBe(1);
      expect(finalPayload[0].event).toBe('addToCart');
      expect(finalPayload[0].currency).toBe('USD');
      expect(finalPayload[0].item.length).toBe(1);
      expect(finalPayload[0].item[0].id).toBe('123');
      expect(finalPayload[0].item[0].price).toBe(9.99);
      expect(finalPayload[0].item[0].quantity).toBe(5);
    });
  
    // When the product is valid, the function adds the product object to the 'item' property of the 'addToCartObject'.
    it("should add product object to 'item' property when product is valid", () => {
      const message = {
        properties: {
          product_id: '123',
          price: '9.99',
          quantity: '5',
          currency: 'USD',
        },
      };
      const finalPayload = [];
  
      handleProductAdded(message, finalPayload);
  
      expect(finalPayload.length).toBe(1);
      expect(finalPayload[0].event).toBe('addToCart');
      expect(finalPayload[0].currency).toBe('USD');
      expect(finalPayload[0].item.length).toBe(1);
      expect(finalPayload[0].item[0].id).toBe('123');
      expect(finalPayload[0].item[0].price).toBe(9.99);
      expect(finalPayload[0].item[0].quantity).toBe(5);
    });
  
    // The function correctly pushes the 'addToCartObject' to the 'finalPayload' array.
    it("should correctly push 'addToCartObject' to 'finalPayload' array", () => {
      const message = {
        properties: {
          product_id: '123',
          price: '9.99',
          quantity: '5',
          currency: 'USD',
        },
      };
      const finalPayload = [];
  
      handleProductAdded(message, finalPayload);
  
      expect(finalPayload.length).toBe(1);
      expect(finalPayload[0].event).toBe('addToCart');
      expect(finalPayload[0].currency).toBe('USD');
      expect(finalPayload[0].item.length).toBe(1);
      expect(finalPayload[0].item[0].id).toBe('123');
      expect(finalPayload[0].item[0].price).toBe(9.99);
      expect(finalPayload[0].item[0].quantity).toBe(5);
    });
  
    // When the 'properties' object is missing the 'currency' property, the function creates an 'addToCartObject' without the 'currency' property.
    it("should create 'addToCartObject' without 'currency' property when 'properties' object is missing 'currency'", () => {
      const message = {
        properties: {
          product_id: '123',
          price: '9.99',
          quantity: '5',
        },
      };
      const finalPayload = [];
  
      handleProductAdded(message, finalPayload);
  
      expect(finalPayload.length).toBe(1);
      expect(finalPayload[0].event).toBe('addToCart');
      expect(finalPayload[0].currency).toBeUndefined();
      expect(finalPayload[0].item.length).toBe(1);
      expect(finalPayload[0].item[0].id).toBe('123');
      expect(finalPayload[0].item[0].price).toBe(9.99);
      expect(finalPayload[0].item[0].quantity).toBe(5);
    });
  });