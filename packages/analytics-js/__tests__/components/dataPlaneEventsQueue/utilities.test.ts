import type { QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { defaultLogger } from '../../../__mocks__/Logger';
import {
  getBatchDeliveryPayload,
  getBatchDeliveryUrl,
  getDeliveryPayload,
  getDeliveryUrl,
  getFinalEventForDeliveryMutator,
  getNormalizedQueueOptions,
  getRequestInfo,
  logErrorOnFailure,
  validateEventPayloadSize,
} from '../../../src/components/dataPlaneEventsQueue/utilities';
import type { EventsQueueItemData } from '../../../src/components/dataPlaneEventsQueue/types';
import { resetState, state } from '../../../src/state';
import { EVENT_PAYLOAD_SIZE_BYTES_LIMIT } from '../../../src/components/dataPlaneEventsQueue/constants';

// mock getCurrentTimeFormatted
jest.mock('@rudderstack/analytics-js-common/utilities/time', () => ({
  getCurrentTimeFormatted: jest.fn(() => '1999-01-01T00:00:00.000Z'),
}));

describe('DataPlaneEventsQueue utilities', () => {
  describe('getNormalizedQueueOptions', () => {
    const DEFAULT_RETRY_QUEUE_OPTIONS: QueueOpts = {
      maxAttempts: 10,
      maxItems: 100,
    };

    it('should return the default retry queue options when no queue options are configured', () => {
      const loadOptions = {};
      const result = getNormalizedQueueOptions(loadOptions);
      expect(result).toEqual(DEFAULT_RETRY_QUEUE_OPTIONS);
    });

    it('should return queue options after merging with default retry queue options when queue options are configured', () => {
      const loadOptions = {
        queueOptions: {
          maxAttempts: 5,
        },
      };
      const result = getNormalizedQueueOptions(loadOptions);
      expect(result).toEqual({
        maxAttempts: 5,
        maxItems: 100,
      });
    });

    it('should convert beacon queue options into queue options', () => {
      const loadOptions = {
        useBeacon: true,
        beaconQueueOptions: {
          maxItems: 10,
          flushQueueInterval: 1000,
        },
      };
      const result = getNormalizedQueueOptions(loadOptions);
      expect(result).toEqual({
        maxAttempts: 10,
        maxItems: 100,
        batch: {
          enabled: true,
          maxItems: 10,
          flushInterval: 1000,
        },
      });
    });

    it('should not convert beacon queue options into queue options when useBeacon is false', () => {
      const loadOptions = {
        useBeacon: false,
        beaconQueueOptions: {
          maxItems: 10,
          flushQueueInterval: 1000,
        },
      };
      const result = getNormalizedQueueOptions(loadOptions);
      expect(result).toEqual(DEFAULT_RETRY_QUEUE_OPTIONS);
    });
  });

  describe('getFinalEventForDeliveryMutator', () => {
    it('should return the final event with updated sentAt timestamp', () => {
      const event = {
        type: 'track',
        event: 'test event',
        properties: {
          key: 'value',
        },
        sentAt: '1900-01-01T00:00:00.000Z',
      } as unknown as RudderEvent;

      const currentTime = '2021-01-01T00:00:00.000Z';
      const result = getFinalEventForDeliveryMutator(event, currentTime);
      expect(result).toEqual({
        type: 'track',
        event: 'test event',
        properties: {
          key: 'value',
        },
        sentAt: '2021-01-01T00:00:00.000Z',
      });
    });
  });

  describe('getDeliveryUrl', () => {
    it('should return the delivery URL', () => {
      const dataplaneUrl = 'https://dataplane.rudderstack.com';
      const endpoint = 'track';
      const result = getDeliveryUrl(dataplaneUrl, endpoint);
      expect(result).toEqual('https://dataplane.rudderstack.com/v1/track');
    });

    it('should return the delivery URL without any duplicate slashes', () => {
      const dataplaneUrl = 'https://dataplane.rudderstack.com/';
      const endpoint = '/track';
      const result = getDeliveryUrl(dataplaneUrl, endpoint);
      expect(result).toEqual('https://dataplane.rudderstack.com/v1/track');
    });
  });

  describe('getBatchDeliveryUrl', () => {
    it('should return the batch delivery URL', () => {
      const dataplaneUrl = 'https://dataplane.rudderstack.com';
      const result = getBatchDeliveryUrl(dataplaneUrl);
      expect(result).toEqual('https://dataplane.rudderstack.com/v1/batch');
    });
  });

  describe('getBatchDeliveryPayload', () => {
    it('should return the stringified batch delivery payload', () => {
      const events = [
        {
          type: 'track',
          event: 'test event',
          properties: {
            key: 'value',
            nullProperty: null,
            undefinedProperty: undefined,
          },
          sentAt: '2021-01-01T00:00:00.000Z',
        } as unknown as RudderEvent,
      ];
      const currentTime = '2021-01-01T00:00:00.000Z';
      const result = getBatchDeliveryPayload(events, currentTime);
      expect(result).toEqual(
        '{"batch":[{"type":"track","event":"test event","properties":{"key":"value"},"sentAt":"2021-01-01T00:00:00.000Z"}],"sentAt":"2021-01-01T00:00:00.000Z"}',
      );
    });
  });

  describe('getDeliveryPayload', () => {
    it('should return the stringified event payload', () => {
      const event = {
        type: 'track',
        event: 'test event',
        properties: {
          key: 'value',
          nullProperty: null,
          undefinedProperty: undefined,
        },
        sentAt: '2021-01-01T00:00:00.000Z',
      } as unknown as RudderEvent;
      const result = getDeliveryPayload(event);
      expect(result).toEqual(
        '{"type":"track","event":"test event","properties":{"key":"value"},"sentAt":"2021-01-01T00:00:00.000Z"}',
      );
    });
  });

  describe('getRequestInfo', () => {
    afterEach(() => {
      resetState();
    });

    it('should return the final request info for single event', () => {
      const event = {
        type: 'track',
        event: 'test event',
        properties: {
          key: 'value',
        },
        sentAt: '2021-01-01T00:00:00.000Z',
      } as unknown as RudderEvent;

      const item = {
        event,
        url: 'https://dataplane.rudderstack.com/v1/track',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as EventsQueueItemData;

      const result = getRequestInfo(item, state);
      expect(result).toEqual({
        url: 'https://dataplane.rudderstack.com/v1/track',
        data: '{"type":"track","event":"test event","properties":{"key":"value"},"sentAt":"1999-01-01T00:00:00.000Z"}',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should return the final request info for batch events', () => {
      state.lifecycle.activeDataplaneUrl.value = 'https://dataplane.rudderstack.com';

      const event1 = {
        type: 'track',
        event: 'test event 1',
        properties: {
          key: 'value',
        },
        sentAt: '2021-01-01T00:00:00.000Z',
      } as unknown as RudderEvent;

      const event2 = {
        type: 'track',
        event: 'test event 2',
        properties: {
          key: 'value',
        },
        sentAt: '2021-01-01T00:00:00.000Z',
      } as unknown as RudderEvent;

      const item = [
        {
          event: event1,
          headers: {
            'Content-Type': 'application/json',
            header1: 'value1',
          },
        },
        {
          event: event2,
          headers: {
            'Content-Type': 'application/json',
            header2: 'value2',
          },
        },
      ] as unknown as EventsQueueItemData;

      const result = getRequestInfo(item, state);

      // The sentAt timestamp is set to the current time
      // Headers are taken from the first event
      expect(result).toEqual({
        url: 'https://dataplane.rudderstack.com/v1/batch',
        data: '{"batch":[{"type":"track","event":"test event 1","properties":{"key":"value"},"sentAt":"1999-01-01T00:00:00.000Z"},{"type":"track","event":"test event 2","properties":{"key":"value"},"sentAt":"1999-01-01T00:00:00.000Z"}],"sentAt":"1999-01-01T00:00:00.000Z"}',
        headers: {
          'Content-Type': 'application/json',
          header1: 'value1',
        },
      });
    });
  });

  describe('logErrorOnFailure', () => {
    it('should log the error message when the failure is retryable for first attempt', () => {
      const isRetryableFailure = true;
      const errorMessage = 'test error message';
      const willBeRetried = true;
      const attemptNumber = 0;
      const maxRetryAttempts = 3;
      const logger = defaultLogger;

      logErrorOnFailure(
        isRetryableFailure,
        errorMessage,
        willBeRetried,
        attemptNumber,
        maxRetryAttempts,
        logger,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'DataPlaneEventsQueue:: Failed to deliver event(s): test error message. It/they will be retried.',
      );
    });

    it('should log the error message when the failure is retryable for subsequent attempts', () => {
      const isRetryableFailure = true;
      const errorMessage = 'test error message';
      const willBeRetried = true;
      const attemptNumber = 1;
      const maxRetryAttempts = 3;
      const logger = defaultLogger;

      logErrorOnFailure(
        isRetryableFailure,
        errorMessage,
        willBeRetried,
        attemptNumber,
        maxRetryAttempts,
        logger,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'DataPlaneEventsQueue:: Failed to deliver event(s): test error message. It/they will be retried. Retry attempt 1 of 3.',
      );
    });

    it('should log the error message when the failure is retryable for all attempts', () => {
      const isRetryableFailure = true;
      const errorMessage = 'test error message';
      const willBeRetried = false;
      const attemptNumber = 3;
      const maxRetryAttempts = 3;
      const logger = defaultLogger;

      logErrorOnFailure(
        isRetryableFailure,
        errorMessage,
        willBeRetried,
        attemptNumber,
        maxRetryAttempts,
        logger,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'DataPlaneEventsQueue:: Failed to deliver event(s): test error message. Retries exhausted (3). The event(s) will be dropped.',
      );
    });

    it('should log the error message when the failure is not retryable', () => {
      const isRetryableFailure = false;
      const errorMessage = 'test error message';
      const willBeRetried = true;
      const attemptNumber = 0;
      const maxRetryAttempts = 3;
      const logger = defaultLogger;

      logErrorOnFailure(
        isRetryableFailure,
        errorMessage,
        willBeRetried,
        attemptNumber,
        maxRetryAttempts,
        logger,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'DataPlaneEventsQueue:: Failed to deliver event(s): test error message. The event(s) will be dropped.',
      );
    });
  });

  describe('validateEventPayloadSize', () => {
    const originalMaxPayloadSize = EVENT_PAYLOAD_SIZE_BYTES_LIMIT;

    afterEach(() => {
      EVENT_PAYLOAD_SIZE_BYTES_LIMIT = originalMaxPayloadSize;
    });

    it('should not log a warning when the event payload size is within the maximum limit', () => {
      const event = {
        type: 'track',
        event: 'test event',
        properties: {
          key: 'value',
        },
        sentAt: '2021-01-01T00:00:00.000Z',
      } as unknown as RudderEvent;

      validateEventPayloadSize(event, defaultLogger);
      expect(defaultLogger.warn).not.toHaveBeenCalled();
    });

    it('should log a warning when the event payload size exceeds the maximum limit', () => {
      // Temporarily set the maximum payload size to a smaller value
      EVENT_PAYLOAD_SIZE_BYTES_LIMIT = 32;

      const event = {
        type: 'track',
        event: 'test event',
        properties: {
          key: 'value',
        },
        sentAt: '2021-01-01T00:00:00.000Z',
      } as unknown as RudderEvent;

      validateEventPayloadSize(event, defaultLogger);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        'DataPlaneEventsQueue:: The size of the event payload (102 bytes) exceeds the maximum limit of 32 bytes. Events with large payloads may be dropped in the future. Please review your instrumentation to ensure that event payloads are within the size limit.',
      );
    });
  });
});
