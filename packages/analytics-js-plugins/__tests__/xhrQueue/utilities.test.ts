import {
  getDeliveryPayload,
  getNormalizedQueueOptions,
  getDeliveryUrl,
  validatePayloadSize,
} from '@rudderstack/analytics-js-plugins/xhrQueue/utilities';
import { RudderEvent, ILogger } from '@rudderstack/analytics-js-plugins/types/common';
import * as xhrConstants from '@rudderstack/analytics-js-plugins/xhrQueue/constants';

class MockLogger implements ILogger {
  warn = jest.fn();
  log = jest.fn();
  error = jest.fn();
  info = jest.fn();
  debug = jest.fn();
  minLogLevel = 0;
  scope = 'test scope';
  setMinLogLevel = jest.fn();
  setScope = jest.fn();
  logProvider = console;
}

const mockLogger = new MockLogger();

describe('xhrQueue Plugin Utilities', () => {
  describe('getDeliveryPayload', () => {
    it('should return undefined if event is undefined', () => {
      expect(getDeliveryPayload(undefined)).not.toBeDefined();
    });

    it('should return null string if event is null', () => {
      expect(getDeliveryPayload(null)).not.toBeDefined();
    });

    it('should return stringified event payload', () => {
      const event = {
        channel: 'test',
        type: 'track',
        anonymousId: 'test',
        context: {
          traits: {
            trait_1: 'trait_1',
            trait_2: 'trait_2',
          },
          sessionId: 1,
          sessionStart: true,
          consentManagement: {
            deniedConsentIds: ['1', '2', '3'],
          },
          'ua-ch': {
            test: 'test',
          },
          app: {
            name: 'test',
            version: 'test',
            namespace: 'test',
          },
          library: {
            name: 'test',
            version: 'test',
          },
          userAgent: 'test',
          os: {
            name: 'test',
            version: 'test',
          },
          locale: 'test',
          screen: {
            width: 1,
            height: 1,
            density: 1,
            innerWidth: 1,
            innerHeight: 1,
          },
          campaign: {
            source: 'test',
            medium: 'test',
            name: 'test',
            term: 'test',
            content: 'test',
          },
        },
        originalTimestamp: 'test',
        integrations: {
          All: true,
        },
        messageId: 'test',
        previousId: 'test',
        sentAt: 'test',
        category: 'test',
        traits: {
          trait_1: 'trait_11',
          trait_2: 'trait_12',
        },
        groupId: 'test',
        event: 'test',
        userId: 'test',
        properties: {
          test: 'test',
        },
      };

      expect(getDeliveryPayload(event)).toEqual(
        '{"channel":"test","type":"track","anonymousId":"test","context":{"traits":{"trait_1":"trait_1","trait_2":"trait_2"},"sessionId":1,"sessionStart":true,"consentManagement":{"deniedConsentIds":["1","2","3"]},"ua-ch":{"test":"test"},"app":{"name":"test","version":"test","namespace":"test"},"library":{"name":"test","version":"test"},"userAgent":"test","os":{"name":"test","version":"test"},"locale":"test","screen":{"width":1,"height":1,"density":1,"innerWidth":1,"innerHeight":1},"campaign":{"source":"test","medium":"test","name":"test","term":"test","content":"test"}},"originalTimestamp":"test","integrations":{"All":true},"messageId":"test","previousId":"test","sentAt":"test","category":"test","traits":{"trait_1":"trait_11","trait_2":"trait_12"},"groupId":"test","event":"test","userId":"test","properties":{"test":"test"}}',
      );
    });

    it('should return stringified event payload filtering the null values', () => {
      const event = {
        channel: 'test',
        type: 'track',
        anonymousId: 'test',
        context: {
          traits: {
            trait_1: 'trait_1',
            trait_2: 'trait_2',
          },
          sessionId: 1,
          sessionStart: true,
          consentManagement: null,
          'ua-ch': {
            test: 'test',
          },
          app: {
            name: 'test',
            version: 'test',
            namespace: 'test',
          },
          library: {
            name: 'test',
            version: 'test',
          },
          userAgent: 'test',
          os: {
            name: 'test',
            version: 'test',
          },
          locale: 'test',
          screen: {
            width: 1,
            height: 1,
            density: 1,
            innerWidth: 1,
            innerHeight: 1,
          },
          campaign: null,
        },
        originalTimestamp: 'test',
        integrations: {
          All: true,
        },
        messageId: 'test',
        previousId: 'test',
        sentAt: 'test',
        category: 'test',
        traits: null,
        groupId: 'test',
        event: 'test',
        userId: 'test',
        properties: {
          test: 'test',
          test2: null,
        },
      };

      expect(getDeliveryPayload(event)).toEqual(
        '{"channel":"test","type":"track","anonymousId":"test","context":{"traits":{"trait_1":"trait_1","trait_2":"trait_2"},"sessionId":1,"sessionStart":true,"ua-ch":{"test":"test"},"app":{"name":"test","version":"test","namespace":"test"},"library":{"name":"test","version":"test"},"userAgent":"test","os":{"name":"test","version":"test"},"locale":"test","screen":{"width":1,"height":1,"density":1,"innerWidth":1,"innerHeight":1}},"originalTimestamp":"test","integrations":{"All":true},"messageId":"test","previousId":"test","sentAt":"test","category":"test","groupId":"test","event":"test","userId":"test","properties":{"test":"test"}}',
      );
    });

    it('should return empty string if event has a circular dependency', () => {
      const event = {
        channel: 'test',
        type: 'track',
        anonymousId: 'test',
        context: {
          traits: {
            trait_1: 'trait_1',
            trait_2: 'trait_2',
          },
          sessionId: 1,
          sessionStart: true,
          consentManagement: {
            deniedConsentIds: ['1', '2', '3'],
          },
          'ua-ch': {
            test: 'test',
          },
          app: {
            name: 'test',
            version: 'test',
            namespace: 'test',
          },
          library: {
            name: 'test',
            version: 'test',
          },
          userAgent: 'test',
          os: {
            name: 'test',
            version: 'test',
          },
          locale: 'test',
          screen: {
            width: 1,
            height: 1,
            density: 1,
            innerWidth: 1,
            innerHeight: 1,
          },
          campaign: {
            source: 'test',
            medium: 'test',
            name: 'test',
            term: 'test',
            content: 'test',
          },
        },
        originalTimestamp: 'test',
        integrations: {
          All: true,
        },
        messageId: 'test',
        previousId: 'test',
        sentAt: 'test',
        category: 'test',
        traits: {
          trait_1: 'trait_11',
          trait_2: 'trait_12',
        },
        groupId: 'test',
        event: 'test',
        userId: 'test',
        properties: {
          test: 'test',
        },
      } as RudderEvent;

      event.traits = event.context.traits;
      event.context.traits.newTraits = event.traits;

      expect(getDeliveryPayload(event, mockLogger)).toEqual('');
      expect(mockLogger.error)
        .toHaveBeenCalledWith(`Error while converting event object to string. Error: TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    --- property 'newTraits' closes the circle.`);
    });
  });

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
  });

  describe('validatePayloadSize', () => {
    const originalMaxEventPayloadSize = xhrConstants.MAX_EVENT_PAYLOAD_SIZE_BYTES;
    beforeEach(() => {
      xhrConstants.MAX_EVENT_PAYLOAD_SIZE_BYTES = 50;
    });

    afterEach(() => {
      xhrConstants.MAX_EVENT_PAYLOAD_SIZE_BYTES = originalMaxEventPayloadSize;
    });

    it('should log a warning if the payload size is greater than the max limit', () => {
      const event = {
        channel: 'test',
        type: 'track',
        traits: {
          trait_1: 'trait_1',
          trait_2: 'trait_2',
        },
        userId: 'test',
        properties: {
          test: 'test',
        },
      };
      validatePayloadSize(event, mockLogger);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'The event payload size (129) exceeds the maximum limit of 50 bytes. The event might get dropped.',
      );
    });

    it('should not log a warning if the payload size is less than the max limit', () => {
      const event = {
        channel: 'test',
        type: 'track',
      };

      validatePayloadSize(event, mockLogger);

      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should not log a warning if the payload size is equal to the max limit', () => {
      // This event payload size is 50 bytes
      const event = {
        channel: 'test',
        type: 'track',
        ab: 'd',
        g: 'j',
      };

      validatePayloadSize(event, mockLogger);

      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should log an error if the payload size could not be calculated', () => {
      const event = {
        channel: 'test',
        type: 'track',
        traits: {
          trait_1: 'trait_1',
          trait_2: 'trait_2',
        },
        userId: 'test',
        properties: {
          test: 'test',
        },
      } as RudderEvent;

      event.properties.traits = event.traits;
      event.traits.newTraits = event.properties;

      validatePayloadSize(event, mockLogger);

      expect(mockLogger.error).toHaveBeenCalledWith('Error while calculating event payload size.');
    });
  });
});
