import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js-common/utilities/time';
import {
  getNormalizedQueueOptions,
  getDeliveryUrl,
  getBatchDeliveryUrl,
  logErrorOnFailure,
  getRequestInfo,
  getBatchDeliveryPayload,
} from '../../src/xhrQueue/utilities';
import { resetState, state } from '../../__mocks__/state';

jest.mock('@rudderstack/analytics-js-common/utilities/time', () => ({
  getCurrentTimeFormatted: () => '2021-01-01T00:00:00.000Z',
}));

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
      // @ts-expect-error Testing for null
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
      // @ts-expect-error Testing for undefined
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

  describe('getBatchDeliveryUrl', () => {
    it('should return batch delivery url if valid dataplane url and event type are provided', () => {
      const deliveryUrl = getBatchDeliveryUrl('https://test.com');

      expect(deliveryUrl).toEqual('https://test.com/v1/batch');
    });

    it('should return batch delivery url if even if dataplane url contains extra slashes', () => {
      const deliveryUrl = getBatchDeliveryUrl('https://test.com/');

      expect(deliveryUrl).toEqual('https://test.com/v1/batch');
    });

    it('should return batch delivery url if dataplane url contains additional path components', () => {
      const deliveryUrl = getBatchDeliveryUrl('https://test.com/some/path///');

      expect(deliveryUrl).toEqual('https://test.com/some/path/v1/batch');
    });
  });

  describe('logErrorOnFailure', () => {
    it('should log an error for delivery failure', () => {
      logErrorOnFailure(
        false,
        'https://test.com/v1/page',
        'Something bad happened',
        false,
        1,
        10,
        defaultLogger,
      );

      expect(defaultLogger.error).toHaveBeenCalledWith(
        'XhrQueuePlugin:: Failed to deliver event(s) to URL "https://test.com/v1/page": Something bad happened. The event(s) will be dropped.',
      );
    });

    it('should log an error for retryable network failure', () => {
      logErrorOnFailure(
        true,
        'https://test.com/v1/page',
        'Something bad happened',
        true,
        1,
        10,
        defaultLogger,
      );

      expect(defaultLogger.error).toHaveBeenCalledWith(
        'XhrQueuePlugin:: Failed to deliver event(s) to URL "https://test.com/v1/page": Something bad happened. It/they will be retried. Retry attempt 1 of 10.',
      );

      // Retryable error but it's the first attempt
      logErrorOnFailure(
        true,
        'https://test.com/v1/page',
        'Something bad happened',
        true,
        0,
        10,
        defaultLogger,
      );

      expect(defaultLogger.error).toHaveBeenCalledWith(
        'XhrQueuePlugin:: Failed to deliver event(s) to URL "https://test.com/v1/page": Something bad happened. It/they will be retried.',
      );

      // Retryable error but exhausted all tries
      logErrorOnFailure(
        true,
        'https://test.com/v1/page',
        'Something bad happened',
        false,
        10,
        10,
        defaultLogger,
      );

      expect(defaultLogger.error).toHaveBeenCalledWith(
        'XhrQueuePlugin:: Failed to deliver event(s) to URL "https://test.com/v1/page": Something bad happened. Retries exhausted (10). The event(s) will be dropped.',
      );
    });
  });

  describe('getRequestInfo', () => {
    beforeEach(() => {
      resetState();
    });

    it('should return request info for single event queue item', () => {
      const queueItemData = {
        event: {
          type: 'track',
          properties: {
            prop1: 'value1',
          },
        } as unknown as RudderEvent,
        url: 'https://test.com/v1/track',
        headers: {
          AnonymousId: 'anonymous-id',
        },
      };

      const requestInfo = getRequestInfo(queueItemData, state, defaultLogger);

      expect(requestInfo).toEqual({
        url: 'https://test.com/v1/track',
        headers: {
          AnonymousId: 'anonymous-id',
        },
        data: '{"type":"track","properties":{"prop1":"value1"},"sentAt":"2021-01-01T00:00:00.000Z"}',
      });
    });

    it('should return request info for batch queue item', () => {
      const queueItemData = [
        {
          event: {
            type: 'track',
            properties: {
              prop1: 'value1',
            },
          } as unknown as RudderEvent,
          url: 'https://test.com/v1/track',
          headers: {
            AnonymousId: 'anonymous-id1',
          },
        },
        {
          event: {
            type: 'track',
            properties: {
              prop2: 'value2',
            },
          } as unknown as RudderEvent,
          url: 'https://test.com/v1/track',
          headers: {
            AnonymousId: 'anonymous-id2',
          },
        },
      ];

      state.lifecycle.activeDataplaneUrl.value = 'https://test.dataplaneurl.com/';

      const requestInfo = getRequestInfo(queueItemData, state, defaultLogger);

      expect(requestInfo).toEqual({
        url: 'https://test.dataplaneurl.com/v1/batch',
        headers: {
          AnonymousId: 'anonymous-id1',
        },
        data: '{"batch":[{"type":"track","properties":{"prop1":"value1"},"sentAt":"2021-01-01T00:00:00.000Z"},{"type":"track","properties":{"prop2":"value2"},"sentAt":"2021-01-01T00:00:00.000Z"}],"sentAt":"2021-01-01T00:00:00.000Z"}',
      });
    });
  });

  describe('getBatchDeliveryPayload', () => {
    const currentTime = getCurrentTimeFormatted();
    it('should return stringified batch event payload', () => {
      const events = [
        {
          channel: 'test',
          type: 'track',
          anonymousId: 'test',
          properties: {
            test: 'test',
          },
        } as unknown as RudderEvent,
        {
          channel: 'test',
          type: 'track',
          anonymousId: 'test',
          properties: {
            test1: 'test1',
          },
        } as unknown as RudderEvent,
      ];

      expect(getBatchDeliveryPayload(events, currentTime, defaultLogger)).toBe(
        '{"batch":[{"channel":"test","type":"track","anonymousId":"test","properties":{"test":"test"}},{"channel":"test","type":"track","anonymousId":"test","properties":{"test1":"test1"}}],"sentAt":"2021-01-01T00:00:00.000Z"}',
      );
    });

    it('should return stringified event payload filtering the null values', () => {
      const events = [
        {
          channel: 'test',
          type: 'track',
          anonymousId: 'test',
          userId: null,
          properties: {
            test: 'test',
            test2: null,
          },
        } as unknown as RudderEvent,
        {
          channel: 'test',
          type: 'track',
          anonymousId: 'test',
          groupId: null,
          properties: {
            test1: 'test1',
            test3: {
              test4: null,
            },
          },
        } as unknown as RudderEvent,
      ];
      expect(getBatchDeliveryPayload(events, currentTime, defaultLogger)).toBe(
        '{"batch":[{"channel":"test","type":"track","anonymousId":"test","properties":{"test":"test"}},{"channel":"test","type":"track","anonymousId":"test","properties":{"test1":"test1","test3":{}}}],"sentAt":"2021-01-01T00:00:00.000Z"}',
      );
    });
  });
});
