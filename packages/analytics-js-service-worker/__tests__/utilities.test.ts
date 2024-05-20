import { isValidUrl } from '../src/utilities';

describe('Utilities', () => {
  describe('isValidUrl', () => {
    it('should return true if URL is valid', () => {
      expect(isValidUrl('https://some.reallookingurl.com')).toBe(true);
    });

    it('should return false if URL is invalid', () => {
      expect(isValidUrl('dataplaneurl')).toBe(false);
    });

    it('should return false if URL is empty', () => {
      expect(isValidUrl('')).toBe(false);
    });

    it('should return false if URL is undefined', () => {
      expect(isValidUrl(undefined)).toBe(false);
    });

    it('should return false if URL is null', () => {
      expect(isValidUrl(null)).toBe(false);
    });

    it('should return false if URL is not a string', () => {
      expect(isValidUrl(123)).toBe(false);
    });

    it('should return true if URL is valid with port', () => {
      expect(isValidUrl('https://some.reallookingurl.com:8080')).toBe(true);
    });

    it('should return false if URL is invalid with port', () => {
      expect(isValidUrl('https://some.reallookingurl.com:port')).toBe(false);
    });

    it('should return false if URL is invalid with port', () => {
      expect(isValidUrl('https://some.reallookingurl.com:port/')).toBe(false);
    });
  });
});
