import { isApiKeyValid, getGlobalBugsnagLibInstance } from '@rudderstack/analytics-js-plugins/bugsnag/utils';

describe('Bugsnag utilities', () => {
  describe('isApiKeyValid', () => {
    it('should return true for a valid API key', () => {
      const apiKey = '1234567890abcdef';
      expect(isApiKeyValid(apiKey)).toBe(true);
    });

    it('should return false for an invalid API key', () => {
      const apiKey = '{{invalid-api-key}}';
      expect(isApiKeyValid(apiKey)).toBe(false);
    });

    it('should return false for an invalid API key', () => {
      const apiKey = '';
      expect(isApiKeyValid(apiKey)).toBe(false);
    });
  });

  describe('getGlobalBugsnagLibInstance', () => {
    it('should return the global Bugsnag instance if defined on the window object', () => {
      const bsObj = {
        version: "1.2.3",
      };
      (window as any).bugsnag = bsObj;

      expect(getGlobalBugsnagLibInstance()).toBe(bsObj);

      delete (window as any).bugsnag;
    });

    it('should return undefined if the global Bugsnag instance is not defined on the window object', () => {
      expect(getGlobalBugsnagLibInstance()).toBe(undefined);
    });
  });
});
