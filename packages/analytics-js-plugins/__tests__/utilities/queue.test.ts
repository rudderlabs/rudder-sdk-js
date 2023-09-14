import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import {
  getDeliveryPayload,
  validateEventPayloadSize,
  getBatchDeliveryPayload,
} from '../../src/utilities/queue';
import * as utilConstants from '../../src/utilities/constants';

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

describe('Queue Plugins Utilities', () => {
  describe('getDeliveryPayload', () => {
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

    it('should return string with circular dependencies replaced with static string', () => {
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

      expect(getDeliveryPayload(event, mockLogger)).toContain('[Circular Reference]');
    });

    it('should return null if the payload cannot be stringified', () => {
      const event = {
        channel: 'test',
        type: 'track',
        properties: {
          someBigInt: BigInt(9007199254740991),
        },
      } as unknown as RudderEvent;

      expect(getDeliveryPayload(event, mockLogger)).toBeNull();
    });
  });

  describe('validateEventPayloadSize', () => {
    const originalMaxEventPayloadSize = utilConstants.EVENT_PAYLOAD_SIZE_BYTES_LIMIT;

    beforeEach(() => {
      utilConstants.EVENT_PAYLOAD_SIZE_BYTES_LIMIT = 50;
    });

    afterEach(() => {
      utilConstants.EVENT_PAYLOAD_SIZE_BYTES_LIMIT = originalMaxEventPayloadSize;
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
      validateEventPayloadSize(event, mockLogger);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'QueueUtilities:: The size of the event payload (129 bytes) exceeds the maximum limit of 50 bytes. Events with large payloads may be dropped in the future. Please review your instrumentation to ensure that event payloads are within the size limit.',
      );
    });

    it('should not log a warning if the payload size is less than the max limit', () => {
      const event = {
        channel: 'test',
        type: 'track',
      };

      validateEventPayloadSize(event, mockLogger);

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

      validateEventPayloadSize(event, mockLogger);

      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('should log a warning if the payload size could not be calculated', () => {
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
          test1: BigInt(9007199254740991),
        },
      } as unknown as RudderEvent;

      validateEventPayloadSize(event, mockLogger);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'QueueUtilities:: Failed to validate event payload size. Please make sure that the event payload is within the size limit and is a valid JSON object.',
      );
    });
  });

  describe('getBatchDeliveryPayload', () => {
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

      expect(getBatchDeliveryPayload(events, mockLogger)).toBe(
        '{"batch":[{"channel":"test","type":"track","anonymousId":"test","properties":{"test":"test"}},{"channel":"test","type":"track","anonymousId":"test","properties":{"test1":"test1"}}]}',
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

      expect(getBatchDeliveryPayload(events, mockLogger)).toBe(
        '{"batch":[{"channel":"test","type":"track","anonymousId":"test","properties":{"test":"test"}},{"channel":"test","type":"track","anonymousId":"test","properties":{"test1":"test1","test3":{}}}]}',
      );
    });

    it('should return string with circular dependencies replaced with static string', () => {
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

      events[1].properties.test5 = events[1];

      expect(getBatchDeliveryPayload(events, mockLogger)).toContain('[Circular Reference]');
    });

    it('should return null if the payload cannot be stringified', () => {
      const events = [
        {
          channel: 'test',
          type: 'track',
          anonymousId: 'test',
          properties: {
            someBigInt: BigInt(9007199254740991),
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

      expect(getBatchDeliveryPayload(events, mockLogger)).toBeNull();
    });
  });
});
