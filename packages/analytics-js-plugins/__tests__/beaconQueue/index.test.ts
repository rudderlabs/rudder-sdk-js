import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { QueueProcessCallbackInfo } from '../../src/types/plugins';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { resetState, state } from '../../__mocks__/state';
import BeaconQueue from '../../src/beaconQueue';

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
  getDeliveryUrl,
  getBatchDeliveryPayload,
} from '../../src/beaconQueue/utilities';
import {
  getCurrentTimeFormatted,
  getFinalEventForDeliveryMutator,
  validateEventPayloadSize,
} from '../../src/shared-chunks/common';
import { RetryQueue } from '../../src/utilities/retryQueue/RetryQueue';

const mockGetNormalizedBeaconQueueOptions = getNormalizedBeaconQueueOptions as jest.MockedFunction<
  typeof getNormalizedBeaconQueueOptions
>;
const mockGetDeliveryUrl = getDeliveryUrl as jest.MockedFunction<typeof getDeliveryUrl>;
const mockGetBatchDeliveryPayload = getBatchDeliveryPayload as jest.MockedFunction<
  typeof getBatchDeliveryPayload
>;
const mockGetCurrentTimeFormatted = getCurrentTimeFormatted as jest.MockedFunction<
  typeof getCurrentTimeFormatted
>;
const mockGetFinalEventForDeliveryMutator = getFinalEventForDeliveryMutator as jest.MockedFunction<
  typeof getFinalEventForDeliveryMutator
>;
const mockValidateEventPayloadSize = validateEventPayloadSize as jest.MockedFunction<
  typeof validateEventPayloadSize
>;
const MockRetryQueue = RetryQueue as jest.MockedClass<typeof RetryQueue>;

const queueProcessCallbackInfo: QueueProcessCallbackInfo = {
  retryAttemptNumber: 0,
  maxRetryAttempts: 3,
  willBeRetried: false,
  timeSinceLastAttempt: 0,
  timeSinceFirstAttempt: 0,
  reclaimed: false,
  isPageAccessible: true,
};

describe('BeaconQueue Plugin', () => {
  let plugin: any;
  let mockState: ApplicationState;
  let mockHttpClient: IHttpClient;
  let mockStoreManager: IStoreManager;
  let mockErrorHandler: IErrorHandler;
  let mockLogger: ILogger;
  let mockQueue: any;

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

  describe('Plugin Initialization', () => {
    it('should add plugin name to loaded plugins', () => {
      plugin.initialize(mockState);

      expect(mockState.plugins.loadedPlugins.value).toContain('BeaconQueue');
    });

    it('should have correct plugin name', () => {
      expect(plugin.name).toBe('BeaconQueue');
    });

    it('should have empty dependencies', () => {
      expect(plugin.deps).toEqual([]);
    });

    it('should have dataplaneEventsQueue extension point', () => {
      expect(plugin.dataplaneEventsQueue).toBeDefined();
      expect(plugin.dataplaneEventsQueue.init).toBeDefined();
      expect(plugin.dataplaneEventsQueue.enqueue).toBeDefined();
    });
  });

  describe('Queue Initialization', () => {
    it('should initialize queue with correct configuration', () => {
      const queue = plugin.dataplaneEventsQueue.init(
        mockState,
        mockHttpClient,
        mockStoreManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockGetNormalizedBeaconQueueOptions).toHaveBeenCalledWith({
        flushQueueInterval: 5000,
        maxItems: 50,
      });

      expect(mockGetDeliveryUrl).toHaveBeenCalledWith(
        'https://api.rudderstack.com',
        'test-write-key',
      );

      expect(MockRetryQueue).toHaveBeenCalledWith(
        'rudder_beacon_test-write-key',
        expect.objectContaining({
          batch: expect.objectContaining({
            enabled: true,
            flushInterval: 5000,
            maxItems: 50,
          }),
        }),
        expect.any(Function),
        mockStoreManager,
        'localStorage',
        mockLogger,
        expect.any(Function),
      );

      expect(queue).toBe(mockQueue);
    });

    it('should handle missing beacon queue options', () => {
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
  });

  describe('Queue Processing Callback', () => {
    let queueProcessCallback: any;

    beforeEach(() => {
      plugin.dataplaneEventsQueue.init(
        mockState,
        mockHttpClient,
        mockStoreManager,
        mockErrorHandler,
        mockLogger,
      );

      // Get the callback that was passed to RetryQueue
      const retryQueueCall = MockRetryQueue.mock.calls[MockRetryQueue.mock.calls.length - 1];
      if (retryQueueCall && retryQueueCall[2]) {
        queueProcessCallback = retryQueueCall[2];
      }
    });

    it('should process batch items successfully', () => {
      const itemData = [
        { event: sampleEvent },
        { event: { ...sampleEvent, event: 'Another Event' } },
      ];
      const mockDone = jest.fn();
      const mockPayload = new Blob(['batch payload'], { type: 'application/json' });

      mockGetBatchDeliveryPayload.mockReturnValueOnce(mockPayload);
      mockSendBeacon.mockReturnValueOnce(true);

      queueProcessCallback(itemData, mockDone, queueProcessCallbackInfo);

      expect(mockGetCurrentTimeFormatted).toHaveBeenCalled();
      expect(mockGetFinalEventForDeliveryMutator).toHaveBeenCalledTimes(2);
      expect(mockGetBatchDeliveryPayload).toHaveBeenCalledWith(
        [sampleEvent, { ...sampleEvent, event: 'Another Event' }],
        '2023-01-01T00:00:00Z',
        mockLogger,
      );
      expect(mockSendBeacon).toHaveBeenCalledWith(
        'https://api.rudderstack.com/v1/batch',
        mockPayload,
      );
      expect(mockDone).toHaveBeenCalledWith(null);
    });

    it('should handle beacon send failure', () => {
      const itemData = [{ event: sampleEvent }];
      const mockDone = jest.fn();
      const mockPayload = new Blob(['batch payload'], { type: 'application/json' });

      mockGetBatchDeliveryPayload.mockReturnValueOnce(mockPayload);
      mockSendBeacon.mockReturnValueOnce(false);

      queueProcessCallback(itemData, mockDone, queueProcessCallbackInfo);

      expect(mockLogger.error).toHaveBeenCalledWith(
        "BeaconQueuePlugin:: Failed to send events batch data to the browser's beacon queue for URL https://api.rudderstack.com/v1/batch. The event(s) will be dropped.",
      );
      expect(mockDone).toHaveBeenCalledWith(null);
    });

    it('should handle beacon send exception', () => {
      const itemData = [{ event: sampleEvent }];
      const mockDone = jest.fn();
      const mockPayload = new Blob(['batch payload'], { type: 'application/json' });
      const sendError = new Error('Beacon send failed');

      mockGetBatchDeliveryPayload.mockReturnValueOnce(mockPayload);
      mockSendBeacon.mockImplementationOnce(() => {
        throw sendError;
      });

      queueProcessCallback(itemData, mockDone, queueProcessCallbackInfo);

      expect(mockErrorHandler.onError).toHaveBeenCalledWith({
        error: sendError,
        context: 'BeaconQueuePlugin',
        customMessage:
          "Failed to send events batch data to the browser's beacon queue for URL https://api.rudderstack.com/v1/batch.",
      });
      expect(mockDone).toHaveBeenCalledWith(null);
    });

    it('should handle empty payload', () => {
      const itemData = [{ event: sampleEvent }];
      const mockDone = jest.fn();

      mockGetBatchDeliveryPayload.mockReturnValueOnce(undefined);

      queueProcessCallback(itemData, mockDone, queueProcessCallbackInfo);

      expect(mockSendBeacon).not.toHaveBeenCalled();
      expect(mockDone).toHaveBeenCalledWith(null);
    });
  });

  describe('Event Enqueuing', () => {
    let mockEventsQueue: any;

    beforeEach(() => {
      mockEventsQueue = {
        addItem: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
      };
    });

    it('should enqueue event with sentAt timestamp', () => {
      const eventToEnqueue = { ...sampleEvent };
      delete eventToEnqueue.sentAt;

      plugin.dataplaneEventsQueue.enqueue(
        mockState,
        mockEventsQueue,
        eventToEnqueue,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockValidateEventPayloadSize).toHaveBeenCalledWith(eventToEnqueue, mockLogger);
      expect(eventToEnqueue.sentAt).toBe('2023-01-01T00:00:00Z');
      expect(mockEventsQueue.addItem).toHaveBeenCalledWith({
        event: eventToEnqueue,
      });
    });

    it('should update existing sentAt timestamp', () => {
      const eventToEnqueue = { ...sampleEvent, sentAt: '2022-01-01T00:00:00Z' };

      plugin.dataplaneEventsQueue.enqueue(
        mockState,
        mockEventsQueue,
        eventToEnqueue,
        mockErrorHandler,
        mockLogger,
      );

      expect(eventToEnqueue.sentAt).toBe('2023-01-01T00:00:00Z');
      expect(mockEventsQueue.addItem).toHaveBeenCalledWith({
        event: eventToEnqueue,
      });
    });

    it('should handle enqueue without optional parameters', () => {
      const eventToEnqueue = { ...sampleEvent };

      plugin.dataplaneEventsQueue.enqueue(mockState, mockEventsQueue, eventToEnqueue);

      expect(mockValidateEventPayloadSize).toHaveBeenCalledWith(eventToEnqueue, undefined);
      expect(mockEventsQueue.addItem).toHaveBeenCalledWith({
        event: eventToEnqueue,
      });
    });
  });

  describe('Size Calculator Function', () => {
    beforeEach(() => {
      plugin.dataplaneEventsQueue.init(
        mockState,
        mockHttpClient,
        mockStoreManager,
        mockErrorHandler,
        mockLogger,
      );
    });

    it('should calculate batch size correctly', () => {
      const retryQueueCall = MockRetryQueue.mock.calls[MockRetryQueue.mock.calls.length - 1];
      const sizeCalculator = retryQueueCall && retryQueueCall[6];

      if (sizeCalculator) {
        const itemData = [{ event: sampleEvent }, { event: { ...sampleEvent, event: 'Another' } }];

        // Create a custom blob that has the desired size
        const mockBlobContent = 'x'.repeat(100); // 100 character string to get size 100
        const mockBlob = new Blob([mockBlobContent], { type: 'application/json' });

        mockGetBatchDeliveryPayload.mockReturnValueOnce(mockBlob);

        const size = sizeCalculator(itemData);

        expect(mockGetCurrentTimeFormatted).toHaveBeenCalled();
        expect(mockGetBatchDeliveryPayload).toHaveBeenCalledWith(
          [sampleEvent, { ...sampleEvent, event: 'Another' }],
          '2023-01-01T00:00:00Z',
          mockLogger,
        );
        expect(size).toBe(100);
      }
    });
  });
});
