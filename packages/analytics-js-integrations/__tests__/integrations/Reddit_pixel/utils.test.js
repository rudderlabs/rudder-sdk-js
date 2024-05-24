// Function returns an object with all provided valid identifiers

import {
  createUserIdentifier,
  verifySignUpMapped,
} from '../../../src/integrations/RedditPixel/utils';

describe('RedditPixel util functions test', () => {
  describe('createUserIdentifier tests', () => {
    it('should return an object with all non-empty identifiers when provided', () => {
      const traits = { email: 'test@example.com', externalId: '12345', idfa: '', aaid: null };
      const result = createUserIdentifier(traits);
      expect(result).toEqual({ email: 'test@example.com', externalId: '12345' });
    });
    it('should return an object with idfa provided through context.device', () => {
      const traits = { email: 'test@example.com', externalId: '12345', idfa: '', aaid: null };
      const context = {
        os: {
          name: 'ios',
        },
        device: {
          advertisingId: 'idfaid1234',
        },
      };
      const result = createUserIdentifier(traits, context);
      expect(result).toEqual({
        email: 'test@example.com',
        externalId: '12345',
        idfa: 'idfaid1234',
      });
    });
    it('should return an empty object when called with no arguments', () => {
      const result = createUserIdentifier();
      expect(result).toEqual({});
    });
  });

  describe('', () => {
    it('should return true when a mapping with "to" field equal to "SignUp" exists', () => {
      const mappings = [
        { from: 'sign up', to: 'SignUp' },
        { from: 'Add to cart', to: 'addToCart' },
      ];
      const result = verifySignUpMapped(mappings);
      expect(result).toBeTruthy();
    });
    it('should return false when input array is empty', () => {
      const mappings = [];
      const result = verifySignUpMapped(mappings);
      expect(result).toBeFalsy();
    });
  });
});
