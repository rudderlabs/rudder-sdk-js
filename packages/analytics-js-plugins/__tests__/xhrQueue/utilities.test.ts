import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { ResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { state, resetState } from '@rudderstack/analytics-js/state';
import {
  getNormalizedQueueOptions,
  getDeliveryUrl,
  getBatchDeliveryUrl,
  logErrorOnFailure,
  getRequestInfo,
} from '../../src/xhrQueue/utilities';

jest.mock('@rudderstack/analytics-js-common/utilities/timestamp', () => ({
  getCurrentTimeFormatted: () => '2021-01-01T00:00:00.000Z',
}));

describe('xhrQueue Plugin Utilities', () => {
  const mockLogger = {
    error: jest.fn(),
  } as unknown as ILogger;

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
    it('should not log error if there is no error', () => {
      const details = {
        response: {},
      } as ResponseDetails;

      logErrorOnFailure(details, 'https://test.com/v1/page', false, 1, 10, mockLogger);

      expect(mockLogger.error).not.toBeCalled();
    });

    it('should log an error for delivery failure', () => {
      const details = {
        error: {},
      } as ResponseDetails;

      logErrorOnFailure(details, 'https://test.com/v1/page', false, 1, 10, mockLogger);

      expect(mockLogger.error).toBeCalledWith(
        'XhrQueuePlugin:: Failed to deliver event(s) to https://test.com/v1/page. The event(s) will be dropped.',
      );
    });

    it('should log an error for retryable network failure', () => {
      const details = {
        error: {},
        xhr: {
          status: 429,
        },
      } as ResponseDetails;

      logErrorOnFailure(details, 'https://test.com/v1/page', true, 1, 10, mockLogger);

      expect(mockLogger.error).toBeCalledWith(
        'XhrQueuePlugin:: Failed to deliver event(s) to https://test.com/v1/page. It/they will be retried. Retry attempt 1 of 10.',
      );

      // Retryable error but it's the first attempt
      details.xhr.status = 429;

      logErrorOnFailure(details, 'https://test.com/v1/page', true, 0, 10, mockLogger);

      expect(mockLogger.error).toBeCalledWith(
        'XhrQueuePlugin:: Failed to deliver event(s) to https://test.com/v1/page. It/they will be retried.',
      );

      // 500 error
      details.xhr.status = 500;

      logErrorOnFailure(details, 'https://test.com/v1/page', true, 1, 10, mockLogger);

      expect(mockLogger.error).toBeCalledWith(
        'XhrQueuePlugin:: Failed to deliver event(s) to https://test.com/v1/page. It/they will be retried. Retry attempt 1 of 10.',
      );

      // 5xx error
      details.xhr.status = 501;

      logErrorOnFailure(details, 'https://test.com/v1/page', true, 1, 10, mockLogger);

      expect(mockLogger.error).toBeCalledWith(
        'XhrQueuePlugin:: Failed to deliver event(s) to https://test.com/v1/page. It/they will be retried. Retry attempt 1 of 10.',
      );

      // 600 error
      details.xhr.status = 600;

      logErrorOnFailure(details, 'https://test.com/v1/page', true, 1, 10, mockLogger);

      expect(mockLogger.error).toBeCalledWith(
        'XhrQueuePlugin:: Failed to deliver event(s) to https://test.com/v1/page. The event(s) will be dropped.',
      );

      // Retryable error but exhausted all tries
      details.xhr.status = 520;

      logErrorOnFailure(details, 'https://test.com/v1/page', false, 10, 10, mockLogger);

      expect(mockLogger.error).toBeCalledWith(
        'XhrQueuePlugin:: Failed to deliver event(s) to https://test.com/v1/page. Retries exhausted (10). The event(s) will be dropped.',
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

      const requestInfo = getRequestInfo(queueItemData, state, mockLogger);

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

      const requestInfo = getRequestInfo(queueItemData, state, mockLogger);

      expect(requestInfo).toEqual({
        url: 'https://test.dataplaneurl.com/v1/batch',
        headers: {
          AnonymousId: 'anonymous-id1',
        },
        data: '{"batch":[{"type":"track","properties":{"prop1":"value1"},"sentAt":"2021-01-01T00:00:00.000Z"},{"type":"track","properties":{"prop2":"value2"},"sentAt":"2021-01-01T00:00:00.000Z"}]}',
      });
    });
  });
});
