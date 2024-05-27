// Function returns an object with all provided valid identifiers

import {
  createUserIdentifier,
  verifySignUpMapped,
  isAppleFamily,
} from '../../../src/integrations/RedditPixel/utils';

describe('RedditPixel util functions test', () => {
  describe('isAppleFamily tests', () => {
    it('should return true for iOS platform', () => {
      expect(isAppleFamily('ios')).toBe(true);
    });

    it('should return false when input is null', () => {
      expect(isAppleFamily(null)).toBe(false);
    });
  });
  describe('createUserIdentifier tests', () => {
    it('should return an object with all non-empty identifiers when provided', () => {
      const traits = { email: 'test@example.com', externalId: '12345', idfa: '', aaid: null };
      const result = createUserIdentifier(traits);
      expect(result).toEqual({
        email: '973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b',
        externalId: '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5',
      });
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
        email: '973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b',
        externalId: '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5',
        idfa: '1d1e1142069743008fb6b5733bef8a02f9718f3aee9a8584e2d2d36090e58d86',
      });
    });
    it('should return an empty object when called with no arguments', () => {
      const result = createUserIdentifier();
      expect(result).toEqual({});
    });
  });

  describe('verifySignUpMapped tests', () => {
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
