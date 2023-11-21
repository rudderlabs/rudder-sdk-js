import {
  getXhrHeaders,
  getPropertyBlackList,
  getDestinationOptions,
} from '../../../src/integrations/Posthog/utils';

describe('Posthog Util test', () => {
  describe('getXhrHeaders()', () => {});

  describe('getDestinationOptions', () => {
    it('should return null when integrationsOptions is provided', () => {
      const integrationsOptions = {};

      const result = getDestinationOptions(integrationsOptions);

      expect(result).toEqual(undefined);
    });

    it('should return options', () => {
      const integrationsOptions = {
        PostHog: { loadIntegration: true },
      };

      const result = getDestinationOptions(integrationsOptions);

      expect(result).toEqual({ loadIntegration: true });
    });
  });

  describe('getXhrHeaders', () => {
    it('should return empty object when config has no xhrHeaders', () => {
      const config = {};
      const result = getXhrHeaders(config);
      expect(result).toEqual({});
    });

    it('should return empty object when xhrHeaders in config is empty', () => {
      const config = {
        xhrHeaders: [],
      };
      const result = getXhrHeaders(config);
      expect(result).toEqual({});
    });

    it('should return xhrHeaders object with valid headers', () => {
      const config = {
        xhrHeaders: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: 'Bearer *******' },
        ],
      };
      const result = getXhrHeaders(config);
      expect(result).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Bearer *******',
      });
    });

    it('should ignore invalid headers in config', () => {
      const config = {
        xhrHeaders: [
          { key: 'Content-Type', value: 'application/json' },
          { key: '', value: 'Bearer *******' }, // Invalid header with empty key
          { key: 'Authorization', value: '' }, // Invalid header with empty value
        ],
      };

      const result = getXhrHeaders(config);

      expect(result).toEqual({
        'Content-Type': 'application/json',
      });
    });
  });
  describe('getPropertyBlackList', () => {
    it('should return empty array when config has no propertyBlackList', () => {
      const config = {};
      const result = getPropertyBlackList(config);
      expect(result).toEqual([]);
    });

    it('should return empty array when propertyBlackList in config is empty', () => {
      const config = {
        propertyBlackList: [],
      };
      const result = getPropertyBlackList(config);
      expect(result).toEqual([]);
    });

    it('should return propertyBlackList array with valid properties', () => {
      const config = {
        propertyBlackList: [{ property: 'password' }, { property: 'creditCardNumber' }],
      };
      const result = getPropertyBlackList(config);
      expect(result).toEqual(['password', 'creditCardNumber']);
    });

    it('should ignore elements with empty or whitespace properties in config', () => {
      const config = {
        propertyBlackList: [
          { property: 'password' },
          { property: '   ' }, // Empty property
          { property: '' }, // Empty property
          { property: 'creditCardNumber' },
        ],
      };
      const result = getPropertyBlackList(config);
      expect(result).toEqual(['password', 'creditCardNumber']);
    });
  });
});
