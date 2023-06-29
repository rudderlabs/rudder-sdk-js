import {
  getNormalizedQueueOptions,
  getDeliveryUrl,
} from '@rudderstack/analytics-js-plugins/xhrQueue/utilities';

describe('xhrQueue Plugin Utilities', () => {
  describe('getNormalizedQueueOptions', () => {
    it('should return default queue options if input queue options is empty object', () => {
      const queueOptions = getNormalizedQueueOptions({});

      expect(queueOptions).toEqual({
        maxRetryDelay: 360000,
        minRetryDelay: 1000,
        backoffFactor: 2,
        maxAttempts: 10,
        maxItems: 100,
      });
    });

    it('should return default queue options if input queue options is null', () => {
      const queueOptions = getNormalizedQueueOptions(null);

      expect(queueOptions).toEqual({
        maxRetryDelay: 360000,
        minRetryDelay: 1000,
        backoffFactor: 2,
        maxAttempts: 10,
        maxItems: 100,
      });
    });

    it('should return default queue options if input queue options is undefined', () => {
      const queueOptions = getNormalizedQueueOptions(undefined);

      expect(queueOptions).toEqual({
        maxRetryDelay: 360000,
        minRetryDelay: 1000,
        backoffFactor: 2,
        maxAttempts: 10,
        maxItems: 100,
      });
    });

    it('should return queue options with default values for missing fields', () => {
      const queueOptions = getNormalizedQueueOptions({
        maxRetryDelay: 720000,
        minRetryDelay: 3000,
        maxAttempts: 100,
      });

      expect(queueOptions).toEqual({
        maxRetryDelay: 720000,
        minRetryDelay: 3000,
        backoffFactor: 2,
        maxAttempts: 100,
        maxItems: 100,
      });
    });
  });

  describe('getDeliveryUrl', () => {
    it('should return delivery url if valid dataplane url and event type are provided', () => {
      const deliveryUrl = getDeliveryUrl('https://test.com', 'track');

      expect(deliveryUrl).toEqual('https://test.com/v1/track');
    });

    it('should return delivery url if even if dataplane url contains extra slashes', () => {
      const deliveryUrl = getDeliveryUrl('https://test.com/', 'track');

      expect(deliveryUrl).toEqual('https://test.com/v1/track');
    });

    it('should return delivery url if dataplane url contains additional path components', () => {
      const deliveryUrl = getDeliveryUrl('https://test.com/some/path////', 'track');

      expect(deliveryUrl).toEqual('https://test.com/some/path/v1/track');
    });
  });
});
