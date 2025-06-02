import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { resetState, state } from '../../__mocks__/state';
import BeaconQueue from '../../src/beaconQueue';
import type { QueueProcessCallback, QueueProcessCallbackInfo } from '../../src/types/plugins';

// Mock the utilities and shared chunks
jest.mock('../../src/beaconQueue/utilities', () => {
  const originalModule = jest.requireActual('../../src/beaconQueue/utilities');

  return {
    __esModule: true,
    ...originalModule,
    getNormalizedBeaconQueueOptions: jest.fn(options => ({
      flushQueueInterval: 10000,
      maxItems: 100,
      ...options,
    })),
    getDeliveryUrl: jest.fn((_dataplaneUrl, _writeKey) => 'https://api.rudderstack.com/v1/batch'),
    getBatchDeliveryPayload: jest.fn(
      () => new Blob(['test payload'], { type: 'application/json' }),
    ),
  };
});

jest.mock('../../src/shared-chunks/common', () => {
  const originalModule = jest.requireActual('../../src/shared-chunks/common');

  return {
    __esModule: true,
    ...originalModule,
    getCurrentTimeFormatted: jest.fn(() => '2023-01-01T00:00:00Z'),
    getFinalEventForDeliveryMutator: jest.fn(event => event),
    validateEventPayloadSize: jest.fn(),
  };
});

jest.mock('../../src/utilities/retryQueue/RetryQueue', () => ({
  RetryQueue: jest.fn().mockImplementation(() => ({
    addItem: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  })),
}));

// Mock navigator.sendBeacon
const mockSendBeacon = jest.fn();
Object.defineProperty(global.navigator, 'sendBeacon', {
  value: mockSendBeacon,
  writable: true,
});

import {
  getNormalizedBeaconQueueOptions,
  getBatchDeliveryPayload,
} from '../../src/beaconQueue/utilities';
import {
  getFinalEventForDeliveryMutator,
  validateEventPayloadSize,
} from '../../src/shared-chunks/common';
import { RetryQueue } from '../../src/utilities/retryQueue/RetryQueue';

const mockGetNormalizedBeaconQueueOptions = getNormalizedBeaconQueueOptions as jest.MockedFunction<
  typeof getNormalizedBeaconQueueOptions
>;
const mockGetBatchDeliveryPayload = getBatchDeliveryPayload as jest.MockedFunction<
  typeof getBatchDeliveryPayload
>;
const mockGetFinalEventForDeliveryMutator = getFinalEventForDeliveryMutator as jest.MockedFunction<
  typeof getFinalEventForDeliveryMutator
>;
const mockValidateEventPayloadSize = validateEventPayloadSize as jest.MockedFunction<
  typeof validateEventPayloadSize
>;
const MockRetryQueue = RetryQueue as jest.MockedClass<typeof RetryQueue>;

describe('BeaconQueue Plugin - Additional Tests', () => {
  let plugin: any;
  let mockState: ApplicationState;
  let mockHttpClient: IHttpClient;
  let mockStoreManager: IStoreManager;
  let mockErrorHandler: IErrorHandler;
  let mockLogger: ILogger;
  let mockQueue: any;

  const queueProcessCallbackInfo: QueueProcessCallbackInfo = {
    retryAttemptNumber: 0,
    maxRetryAttempts: 3,
    willBeRetried: false,
    timeSinceLastAttempt: 0,
    timeSinceFirstAttempt: 0,
    reclaimed: false,
  };

  const sampleEvent = {
    type: 'track',
    event: 'Test Event',
    userId: 'user123',
    anonymousId: 'anon123',
    properties: { test: 'value' },
    timestamp: '2023-01-01T00:00:00Z',
    messageId: 'message123',
    integrations: {},
    channel: 'web',
    context: {
      app: { name: 'test-app', version: '1.0.0', namespace: 'test', installType: 'cdn' },
      library: { name: 'rudder-js-sdk', version: '3.0.0' },
      page: { url: 'https://test.com' },
      userAgent: 'test-agent',
      ip: '127.0.0.1',
      locale: 'en-US',
      screen: { width: 1920, height: 1080, density: 1, innerWidth: 1920, innerHeight: 1080 },
      timezone: 'America/New_York',
      os: { name: 'unknown', version: '1.0' },
    },
    originalTimestamp: '2023-01-01T00:00:00Z',
  } as RudderEvent;

  beforeEach(() => {
    resetState();
    plugin = BeaconQueue();

    mockState = state;
    mockState.lifecycle.writeKey.value = 'test-write-key';
    mockState.lifecycle.activeDataplaneUrl.value = 'https://api.rudderstack.com';
    mockState.loadOptions.value = {
      beaconQueueOptions: {
        flushQueueInterval: 5000,
        maxItems: 50,
      },
    };

    mockHttpClient = {} as IHttpClient;
    mockStoreManager = {} as IStoreManager;
    mockErrorHandler = defaultErrorHandler;
    mockLogger = defaultLogger;

    mockQueue = {
      addItem: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    };

    // Reset mocks
    jest.clearAllMocks();
    mockSendBeacon.mockReturnValue(true);
    MockRetryQueue.mockImplementation(() => mockQueue);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Plugin Structure', () => {
    it('should export BeaconQueue as default', () => {
      expect(BeaconQueue).toBeDefined();
      expect(typeof BeaconQueue).toBe('function');
    });

    it('should return plugin object with correct structure', () => {
      expect(plugin).toHaveProperty('name', 'BeaconQueue');
      expect(plugin).toHaveProperty('deps', []);
      expect(plugin).toHaveProperty('initialize');
      expect(plugin).toHaveProperty('dataplaneEventsQueue');
      expect(plugin.dataplaneEventsQueue).toHaveProperty('init');
      expect(plugin.dataplaneEventsQueue).toHaveProperty('enqueue');
    });
  });

  describe('Queue Processing Callback - Edge Cases', () => {
    let queueProcessCallback: QueueProcessCallback;

    beforeEach(() => {
      plugin.dataplaneEventsQueue.init(
        mockState,
        mockHttpClient,
        mockStoreManager,
        mockErrorHandler,
        mockLogger,
      );

      // Get the callback that was passed to RetryQueue
      const retryQueueCall = MockRetryQueue.mock.calls[0];
      if (retryQueueCall && retryQueueCall[2]) {
        queueProcessCallback = retryQueueCall[2];
      }
    });

    it('should handle empty item data array', () => {
      const itemData: any[] = [];
      const mockDone = jest.fn();

      queueProcessCallback(itemData, mockDone, queueProcessCallbackInfo);

      expect(mockGetFinalEventForDeliveryMutator).not.toHaveBeenCalled();
      expect(mockGetBatchDeliveryPayload).toHaveBeenCalledWith(
        [],
        '2023-01-01T00:00:00Z',
        mockLogger,
      );
    });

    it('should handle undefined payload from getBatchDeliveryPayload', () => {
      const itemData = [{ event: sampleEvent }];
      const mockDone = jest.fn();

      mockGetBatchDeliveryPayload.mockReturnValueOnce(undefined);

      queueProcessCallback(itemData, mockDone, queueProcessCallbackInfo);

      expect(mockSendBeacon).not.toHaveBeenCalled();
      expect(mockDone).toHaveBeenCalledWith(null);
    });

    it('should handle beacon API throwing an error', () => {
      const itemData = [{ event: sampleEvent }];
      const mockDone = jest.fn();
      const mockPayload = new Blob(['test'], { type: 'application/json' });
      const beaconError = new Error('Beacon API error');

      mockGetBatchDeliveryPayload.mockReturnValueOnce(mockPayload);
      mockSendBeacon.mockImplementationOnce(() => {
        throw beaconError;
      });

      queueProcessCallback(itemData, mockDone, queueProcessCallbackInfo);

      expect(mockErrorHandler.onError).toHaveBeenCalledWith({
        error: beaconError,
        context: 'BeaconQueuePlugin',
        customMessage:
          "Failed to send events batch data to the browser's beacon queue for URL https://api.rudderstack.com/v1/batch. The events will be dropped.",
      });
      expect(mockDone).toHaveBeenCalledWith(null);
    });

    it('should process multiple events correctly', () => {
      const event2 = { ...sampleEvent, event: 'Second Event', messageId: 'message456' };
      const event3 = { ...sampleEvent, event: 'Third Event', messageId: 'message789' };
      const itemData = [{ event: sampleEvent }, { event: event2 }, { event: event3 }];
      const mockDone = jest.fn();
      const mockPayload = new Blob(['batch payload'], { type: 'application/json' });

      mockGetBatchDeliveryPayload.mockReturnValueOnce(mockPayload);
      mockSendBeacon.mockReturnValueOnce(true);

      queueProcessCallback(itemData, mockDone, queueProcessCallbackInfo);

      expect(mockGetFinalEventForDeliveryMutator).toHaveBeenCalledTimes(3);
      expect(mockGetFinalEventForDeliveryMutator).toHaveBeenNthCalledWith(
        1,
        sampleEvent,
        '2023-01-01T00:00:00Z',
      );
      expect(mockGetFinalEventForDeliveryMutator).toHaveBeenNthCalledWith(
        2,
        event2,
        '2023-01-01T00:00:00Z',
      );
      expect(mockGetFinalEventForDeliveryMutator).toHaveBeenNthCalledWith(
        3,
        event3,
        '2023-01-01T00:00:00Z',
      );
      expect(mockDone).toHaveBeenCalledWith(null, true);
    });
  });

  describe('Event Enqueuing - Edge Cases', () => {
    let mockEventsQueue: any;

    beforeEach(() => {
      mockEventsQueue = {
        addItem: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
      };
    });

    it('should handle event without sentAt property', () => {
      const eventWithoutSentAt = { ...sampleEvent };
      delete eventWithoutSentAt.sentAt;

      plugin.dataplaneEventsQueue.enqueue(
        mockState,
        mockEventsQueue,
        eventWithoutSentAt,
        mockErrorHandler,
        mockLogger,
      );

      expect(eventWithoutSentAt.sentAt).toBe('2023-01-01T00:00:00Z');
      expect(mockValidateEventPayloadSize).toHaveBeenCalledWith(eventWithoutSentAt, mockLogger);
      expect(mockEventsQueue.addItem).toHaveBeenCalledWith({
        event: eventWithoutSentAt,
      });
    });

    it('should handle event with existing sentAt property', () => {
      const eventWithSentAt = { ...sampleEvent, sentAt: '2022-12-31T23:59:59Z' };

      plugin.dataplaneEventsQueue.enqueue(
        mockState,
        mockEventsQueue,
        eventWithSentAt,
        mockErrorHandler,
        mockLogger,
      );

      expect(eventWithSentAt.sentAt).toBe('2023-01-01T00:00:00Z');
      expect(mockEventsQueue.addItem).toHaveBeenCalledWith({
        event: eventWithSentAt,
      });
    });

    it('should handle enqueue with minimal parameters', () => {
      const eventToEnqueue = { ...sampleEvent };

      plugin.dataplaneEventsQueue.enqueue(mockState, mockEventsQueue, eventToEnqueue);

      expect(mockValidateEventPayloadSize).toHaveBeenCalledWith(eventToEnqueue, undefined);
      expect(mockEventsQueue.addItem).toHaveBeenCalledWith({
        event: eventToEnqueue,
      });
    });

    it('should handle different event types', () => {
      const identifyEvent = {
        ...sampleEvent,
        type: 'identify',
        traits: { name: 'John Doe', email: 'john@example.com' },
      };

      plugin.dataplaneEventsQueue.enqueue(
        mockState,
        mockEventsQueue,
        identifyEvent,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockEventsQueue.addItem).toHaveBeenCalledWith({
        event: identifyEvent,
      });
    });
  });

  describe('Size Calculator Function - Edge Cases', () => {
    beforeEach(() => {
      plugin.dataplaneEventsQueue.init(
        mockState,
        mockHttpClient,
        mockStoreManager,
        mockErrorHandler,
        mockLogger,
      );
    });

    it('should handle empty item data array in size calculator', () => {
      const retryQueueCall = MockRetryQueue.mock.calls[0];
      const sizeCalculator = retryQueueCall && retryQueueCall[6];

      if (sizeCalculator) {
        const itemData: any[] = [];
        const mockBlob = new Blob([''], { type: 'application/json' });
        Object.defineProperty(mockBlob, 'size', { value: 0 });

        mockGetBatchDeliveryPayload.mockReturnValue(mockBlob);

        const size = sizeCalculator(itemData);

        expect(mockGetBatchDeliveryPayload).toHaveBeenCalledWith(
          [],
          '2023-01-01T00:00:00Z',
          mockLogger,
        );
        expect(size).toBe(0);
      }
    });

    it('should handle large payload size', () => {
      const retryQueueCall = MockRetryQueue.mock.calls[0];
      const sizeCalculator = retryQueueCall && retryQueueCall[6];

      if (sizeCalculator) {
        const itemData = [{ event: sampleEvent }];
        const mockBlob = new Blob(['large payload'], { type: 'application/json' });
        Object.defineProperty(mockBlob, 'size', { value: 1048576 }); // 1MB

        mockGetBatchDeliveryPayload.mockReturnValue(mockBlob);

        const size = sizeCalculator(itemData);

        expect(size).toBe(1048576);
      }
    });
  });

  describe('Queue Configuration', () => {
    it('should use default options when beaconQueueOptions is undefined', () => {
      mockState.loadOptions.value = {};

      plugin.dataplaneEventsQueue.init(
        mockState,
        mockHttpClient,
        mockStoreManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockGetNormalizedBeaconQueueOptions).toHaveBeenCalledWith({});
    });

    it('should pass correct queue name with write key', () => {
      mockState.lifecycle.writeKey.value = 'custom-write-key';

      plugin.dataplaneEventsQueue.init(
        mockState,
        mockHttpClient,
        mockStoreManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(MockRetryQueue).toHaveBeenCalledWith(
        'rudder_beacon_custom-write-key',
        expect.any(Object),
        expect.any(Function),
        mockStoreManager,
        'localStorage',
        mockLogger,
        expect.any(Function),
      );
    });

    it('should configure batch options correctly', () => {
      const customOptions = {
        flushQueueInterval: 15000,
        maxItems: 200,
      };
      mockState.loadOptions.value.beaconQueueOptions = customOptions;
      mockGetNormalizedBeaconQueueOptions.mockReturnValue(customOptions);

      plugin.dataplaneEventsQueue.init(
        mockState,
        mockHttpClient,
        mockStoreManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(MockRetryQueue).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          batch: expect.objectContaining({
            enabled: true,
            flushInterval: 15000,
            maxItems: 200,
          }),
        }),
        expect.any(Function),
        mockStoreManager,
        'localStorage',
        mockLogger,
        expect.any(Function),
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle logger being undefined', () => {
      plugin.dataplaneEventsQueue.init(
        mockState,
        mockHttpClient,
        mockStoreManager,
        mockErrorHandler,
        undefined,
      );

      const retryQueueCall = MockRetryQueue.mock.calls[0];
      const queueProcessCallback = retryQueueCall && retryQueueCall[2];

      if (queueProcessCallback) {
        const itemData = [{ event: sampleEvent }];
        const mockDone = jest.fn();
        const mockPayload = new Blob(['test'], { type: 'application/json' });

        mockGetBatchDeliveryPayload.mockReturnValue(mockPayload);
        mockSendBeacon.mockReturnValue(false);

        queueProcessCallback(itemData, mockDone, queueProcessCallbackInfo);

        expect(mockDone).toHaveBeenCalledWith(null, false);
      }
    });

    it('should handle errorHandler being undefined', () => {
      plugin.dataplaneEventsQueue.init(
        mockState,
        mockHttpClient,
        mockStoreManager,
        undefined,
        mockLogger,
      );

      const retryQueueCall = MockRetryQueue.mock.calls[0];
      const queueProcessCallback = retryQueueCall && retryQueueCall[2];

      if (queueProcessCallback) {
        const itemData = [{ event: sampleEvent }];
        const mockDone = jest.fn();
        const mockPayload = new Blob(['test'], { type: 'application/json' });
        const beaconError = new Error('Beacon error');

        mockGetBatchDeliveryPayload.mockReturnValue(mockPayload);
        mockSendBeacon.mockImplementationOnce(() => {
          throw beaconError;
        });

        expect(() =>
          queueProcessCallback(itemData, mockDone, queueProcessCallbackInfo),
        ).not.toThrow();
        expect(mockDone).toHaveBeenCalledWith(null);
      }
    });
  });
});
