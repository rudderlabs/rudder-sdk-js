import { getDataPlaneUrl, isFunction, setImmediate } from '../src/utilities';

describe('Utilities', () => {
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

    it('should return the data plane URL with /v1/batch appended even if the input is exceedingly large', () => {
      // An input like this may cause super-linear runtime issue due to backtracking
      // if proper care is not taken while writing the regex
      const dataPlaneUrl = `https://some.reallookingurl.com/${'a'.repeat(10000)}/`;
      expect(getDataPlaneUrl(dataPlaneUrl)).toBe(
        `https://some.reallookingurl.com/${'a'.repeat(10000)}/v1/batch`,
      );
    });
  });
});
