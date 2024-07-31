import md5 from 'md5';
import sha256 from 'crypto-js/sha256';
import {
  handleCommonFields,
  handleProductAdded,
  getEmailHashes,
  getEmail,
} from '../../../src/integrations/Criteo/utils';

describe('handleCommonFields', () => {
  const inputEvent = {
    message: {
      userId: 'u1',
      anonymousId: 'a1',
      properties: {
        email: 'abc@gmail.com',
      },
    },
  };
  const defaultExpected = [
    { event: 'setCustomerId', id: md5('u1').toString() },
    { event: 'setRetailerVisitorId', id: md5('a1').toString() },
  ];
  it('when properties.email is present, for md5 hashmethod the relevant mapping should be included', () => {
    const out = handleCommonFields(inputEvent, 'md5');
    expect(out).toEqual([
      ...defaultExpected,
      {
        email: '3f009d72559f51e7e454b16e5d0687a1',
        hash_method: 'md5',
        event: 'setEmail',
      },
    ]);
  });
  it('when properties.email is present, for sha256 hashmethod the relevant mapping should be included', () => {
    const output = handleCommonFields(inputEvent, 'sha256');
    expect(output).toEqual([
      ...defaultExpected,
      {
        email: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
        hash_method: 'sha256',
        event: 'setEmail',
      },
    ]);
  });
  it('when properties.email is present, for random hashmethod the relevant mapping should be included', () => {
    const output = handleCommonFields(inputEvent, 'random');
    expect(output).toEqual([
      ...defaultExpected,
      {
        email: 'abc@gmail.com',
        hash_method: 'random',
        event: 'setEmail',
      },
    ]);
  });
});

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

describe('getEmailHashes', () => {
  // Returns correct hashes when hashMethod is 'both'
  it('should return correct hashes when hashMethod is "both"', () => {
    const email = 'test@example.com';
    const hashMethod = 'both';
    const result = getEmailHashes(email, hashMethod);
    expect(result).toEqual([
      { event: 'setEmail', hash_method: 'sha256', email: getEmail(email, 'sha256') },
      { event: 'setEmail', hash_method: 'md5', email: getEmail(email, 'md5') },
    ]);
  });

  // Handles empty email input
  it('should handle empty email input', () => {
    const email = '';
    const hashMethod = 'both';
    const result = getEmailHashes(email, hashMethod);
    expect(result).toEqual([
      { event: 'setEmail', hash_method: 'sha256', email: getEmail(email, 'sha256') },
      { event: 'setEmail', hash_method: 'md5', email: getEmail(email, 'md5') },
    ]);
  });

  it('should return correct hash when hashMethod is sha256', () => {
    const email = 'test@example.com';
    const hashMethod = 'sha256';
    const expectedHash = sha256(email).toString();
    const result = getEmailHashes(email, hashMethod);
    expect(result).toEqual([{ event: 'setEmail', hash_method: 'sha256', email: expectedHash }]);
  });
});
