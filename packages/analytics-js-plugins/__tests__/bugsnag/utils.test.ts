import { isApiKeyValid } from '@rudderstack/analytics-js-plugins/bugsnag/utils';

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
});
