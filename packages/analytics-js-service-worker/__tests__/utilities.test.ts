import { getDataPlaneUrl, isFunction, isValidUrl, setImmediate } from '../src/utilities';

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

  describe('isFunction', () => {
    it('should return true if value is a function', () => {
      const testFunction = () => {};
      expect(isFunction(testFunction)).toBe(true);
    });

    it('should return false if value is not a function', () => {
      expect(isFunction('test')).toBe(false);
    });

    it('should return false if value is undefined', () => {
      expect(isFunction(undefined)).toBe(false);
    });

    it('should return false if value is null', () => {
      expect(isFunction(null)).toBe(false);
    });

    it('should return false if value is empty', () => {
      expect(isFunction('')).toBe(false);
    });

    it('should return true if value is a simple function', () => {
      const testFunction = function () {};
      expect(isFunction(testFunction)).toBe(true);
    });
  });

  describe('setImmediate', () => {
    it('should return a promise', () => {
      expect(setImmediate(() => {})).toBeInstanceOf(Promise);
    });

    it('should execute the callback', async () => {
      const callback = jest.fn();
      await setImmediate(callback);
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('getDataPlaneUrl', () => {
    it('should return the data plane URL with /v1/batch appended', () => {
      const dataPlaneUrl = 'https://some.reallookingurl.com';
      expect(getDataPlaneUrl(dataPlaneUrl)).toBe(`${dataPlaneUrl}/v1/batch`);
    });

    it('should return the same data plane URL if it already has the batch endpoint', () => {
      const dataPlaneUrl = 'https://some.reallookingurl.com/v1/batch';
      expect(getDataPlaneUrl(dataPlaneUrl)).toBe(dataPlaneUrl);
    });

    it('should return the data plane URL with /v1/batch appended even if it has trailing slashes', () => {
      const dataPlaneUrl = 'https://some.reallookingurl.com/';
      expect(getDataPlaneUrl(dataPlaneUrl)).toBe(`${dataPlaneUrl}v1/batch`);
    });

    it('should return the data plane URL with /v1/batch appended even if it has multiple trailing slashes', () => {
      const dataPlaneUrl = 'https://some.reallookingurl.com//';
      expect(getDataPlaneUrl(dataPlaneUrl)).toBe(`https://some.reallookingurl.com/v1/batch`);
    });
  });
});
