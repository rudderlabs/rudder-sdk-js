import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { resetState, state } from '../../__mocks__/state';
import NativeDestinationQueue from '../../src/nativeDestinationQueue';

// Mock the utilities and shared chunks
jest.mock('../../src/nativeDestinationQueue/utilities', () => {
  const originalModule = jest.requireActual('../../src/nativeDestinationQueue/utilities');

  return {
    __esModule: true,
    ...originalModule,
    getNormalizedQueueOptions: jest.fn(options => ({
      maxRetryAttempts: 3,
      retryDelay: 1000,
      ...options,
    })),
    isEventDenyListed: jest.fn(() => false),
    sendEventToDestination: jest.fn(),
  };
});

jest.mock('../../src/shared-chunks/deviceModeDestinations', () => {
  const originalModule = jest.requireActual('../../src/shared-chunks/deviceModeDestinations');

  return {
    __esModule: true,
    ...originalModule,
    filterDestinations: jest.fn((integrations, destinations) => destinations),
  };
});

jest.mock('../../src/utilities/retryQueue/RetryQueue', () => ({
  RetryQueue: jest.fn().mockImplementation(() => ({
    addItem: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  })),
}));

import {
  getNormalizedQueueOptions,
  isEventDenyListed,
  sendEventToDestination,
} from '../../src/nativeDestinationQueue/utilities';
import { filterDestinations } from '../../src/shared-chunks/deviceModeDestinations';
import { RetryQueue } from '../../src/utilities/retryQueue/RetryQueue';
import type { QueueProcessCallback, QueueProcessCallbackInfo } from '../../src/types/plugins';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';

const mockGetNormalizedQueueOptions = getNormalizedQueueOptions as jest.MockedFunction<
  typeof getNormalizedQueueOptions
>;
const mockIsEventDenyListed = isEventDenyListed as jest.MockedFunction<typeof isEventDenyListed>;
const mockSendEventToDestination = sendEventToDestination as jest.MockedFunction<
  typeof sendEventToDestination
>;
const mockFilterDestinations = filterDestinations as jest.MockedFunction<typeof filterDestinations>;
const MockRetryQueue = RetryQueue as jest.MockedClass<typeof RetryQueue>;

describe('NativeDestinationQueue Plugin', () => {
  let plugin: any;
  let mockState: ApplicationState;
  let mockPluginsManager: IPluginsManager;
  let mockStoreManager: IStoreManager;
  let mockErrorHandler: IErrorHandler;
  let mockLogger: ILogger;
  let mockQueue: any;
  let mockDmtQueue: any;

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

  const mockDestinations: Destination[] = [
    {
      id: 'dest1',
      displayName: 'GA4',
      userFriendlyId: 'GA4___dest1',
      enabled: true,
      shouldApplyDeviceModeTransformation: false,
      propagateEventsUntransformedOnError: false,
      config: {
        apiKey: 'key1',
        blacklistedEvents: [],
        whitelistedEvents: [],
        eventFilteringOption: 'disable' as const,
      },
    },
    {
      id: 'dest2',
      displayName: 'Amplitude',
      userFriendlyId: 'Amplitude___dest2',
      enabled: true,
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: false,
      config: {
        apiKey: 'key2',
        blacklistedEvents: [],
        whitelistedEvents: [],
        eventFilteringOption: 'disable' as const,
      },
    },
  ];

  beforeEach(() => {
    resetState();
    plugin = NativeDestinationQueue();

    mockState = state;
    mockState.lifecycle.writeKey.value = 'test-write-key';
    mockState.nativeDestinations.initializedDestinations.value = [...mockDestinations];
    mockState.loadOptions.value = {
      destinationsQueueOptions: {
        maxItems: 100,
      },
    };

    mockPluginsManager = {
      invokeSingle: jest.fn(),
    } as any;

    mockStoreManager = {} as IStoreManager;
    mockErrorHandler = defaultErrorHandler;
    mockLogger = defaultLogger;

    mockQueue = {
      addItem: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    };

    mockDmtQueue = {
      addItem: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    };

    // Reset mocks
    jest.clearAllMocks();
    MockRetryQueue.mockImplementation(() => mockQueue);
    mockFilterDestinations.mockImplementation((integrations, destinations) => destinations);
    mockIsEventDenyListed.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Plugin Initialization', () => {
    it('should add plugin name to loaded plugins', () => {
      plugin.initialize(mockState);

      expect(mockState.plugins.loadedPlugins.value).toContain('NativeDestinationQueue');
    });

    it('should have correct plugin name', () => {
      expect(plugin.name).toBe('NativeDestinationQueue');
    });

    it('should have empty dependencies', () => {
      expect(plugin.deps).toEqual([]);
    });

    it('should have destinationsEventsQueue extension point', () => {
      expect(plugin.destinationsEventsQueue).toBeDefined();
      expect(plugin.destinationsEventsQueue.init).toBeDefined();
      expect(plugin.destinationsEventsQueue.enqueue).toBeDefined();
      expect(plugin.destinationsEventsQueue.enqueueEventToDestination).toBeDefined();
    });
  });

  describe('Queue Initialization', () => {
    it('should initialize queue with correct configuration', () => {
      const queue = plugin.destinationsEventsQueue.init(
        mockState,
        mockPluginsManager,
        mockStoreManager,
        mockDmtQueue,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockGetNormalizedQueueOptions).toHaveBeenCalledWith({
        maxItems: 100,
      });

      expect(MockRetryQueue).toHaveBeenCalledWith(
        'rudder_destinations_events_test-write-key',
        expect.objectContaining({
          maxRetryAttempts: 3,
          retryDelay: 1000,
        }),
        expect.any(Function),
        mockStoreManager,
        'memoryStorage',
      );

      expect(queue).toBe(mockQueue);
    });

    it('should handle missing destinations queue options', () => {
      mockState.loadOptions.value = {};

      plugin.destinationsEventsQueue.init(
        mockState,
        mockPluginsManager,
        mockStoreManager,
        mockDmtQueue,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockGetNormalizedQueueOptions).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Queue Processing Callback', () => {
    let queueProcessCallback: QueueProcessCallback;

    const queueProcessCallbackInfo: QueueProcessCallbackInfo = {
      retryAttemptNumber: 0,
      maxRetryAttempts: 3,
      willBeRetried: false,
      timeSinceLastAttempt: 0,
      timeSinceFirstAttempt: 0,
      reclaimed: false,
      isPageAccessible: true,
      retryReason: 'client-network',
    };

    beforeEach(() => {
      plugin.destinationsEventsQueue.init(
        mockState,
        mockPluginsManager,
        mockStoreManager,
        mockDmtQueue,
        mockErrorHandler,
        mockLogger,
      );

      // Get the callback that was passed to RetryQueue
      // Use the last call instead of assuming it's the first call
      const retryQueueCall = MockRetryQueue.mock.calls[MockRetryQueue.mock.calls.length - 1];
      if (retryQueueCall && retryQueueCall[2]) {
        queueProcessCallback = retryQueueCall[2];
      }
    });

    it('should process events and send to destinations without transformation', () => {
      const mockDone = jest.fn();
      mockFilterDestinations.mockReturnValueOnce([mockDestinations[0]!]);

      queueProcessCallback(sampleEvent, mockDone, queueProcessCallbackInfo);

      expect(mockFilterDestinations).toHaveBeenCalledWith(
        sampleEvent.integrations,
        mockDestinations,
      );
      expect(mockIsEventDenyListed).toHaveBeenCalledWith(
        sampleEvent.type,
        sampleEvent.event,
        mockDestinations[0],
      );
      expect(mockSendEventToDestination).toHaveBeenCalledWith(
        sampleEvent,
        mockDestinations[0],
        mockErrorHandler,
        mockLogger,
      );
      expect(mockDone).toHaveBeenCalledWith(null);
    });

    it('should process events and enqueue for transformation when needed', () => {
      const mockDone = jest.fn();
      mockFilterDestinations.mockReturnValueOnce([mockDestinations[1]!]);

      queueProcessCallback(sampleEvent, mockDone, queueProcessCallbackInfo);

      expect(mockPluginsManager.invokeSingle).toHaveBeenCalledWith(
        'transformEvent.enqueue',
        mockState,
        mockDmtQueue,
        sampleEvent,
        [mockDestinations[1]],
        mockErrorHandler,
        mockLogger,
      );
      expect(mockSendEventToDestination).not.toHaveBeenCalled();
      expect(mockDone).toHaveBeenCalledWith(null);
    });

    it('should handle mixed destinations (some with transformation, some without)', () => {
      const mockDone = jest.fn();
      mockFilterDestinations.mockReturnValueOnce(mockDestinations);

      queueProcessCallback(sampleEvent, mockDone, queueProcessCallbackInfo);

      expect(mockSendEventToDestination).toHaveBeenCalledWith(
        sampleEvent,
        mockDestinations[0],
        mockErrorHandler,
        mockLogger,
      );
      expect(mockPluginsManager.invokeSingle).toHaveBeenCalledWith(
        'transformEvent.enqueue',
        mockState,
        mockDmtQueue,
        sampleEvent,
        [mockDestinations[1]],
        mockErrorHandler,
        mockLogger,
      );
      expect(mockDone).toHaveBeenCalledWith(null);
    });

    it('should filter out deny-listed events', () => {
      const mockDone = jest.fn();
      mockFilterDestinations.mockReturnValueOnce([mockDestinations[0]!]);
      mockIsEventDenyListed.mockReturnValueOnce(true);

      queueProcessCallback(sampleEvent, mockDone, queueProcessCallbackInfo);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'NativeDestinationQueuePlugin:: The "Test Event" track event has been filtered for the "GA4___dest1" destination.',
      );
      expect(mockSendEventToDestination).not.toHaveBeenCalled();
      expect(mockDone).toHaveBeenCalledWith(null);
    });

    it('should handle errors during destination processing', () => {
      const mockDone = jest.fn();
      const processError = new Error('Processing failed');
      mockFilterDestinations.mockReturnValueOnce([mockDestinations[0]!]);
      mockSendEventToDestination.mockImplementationOnce(() => {
        throw processError;
      });

      queueProcessCallback(sampleEvent, mockDone, queueProcessCallbackInfo);

      expect(mockErrorHandler.onError).toHaveBeenCalledWith({
        error: processError,
        context: 'NativeDestinationQueuePlugin',
        category: 'integrations',
      });
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

    it('should enqueue event to queue', () => {
      plugin.destinationsEventsQueue.enqueue(
        mockState,
        mockEventsQueue,
        sampleEvent,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockEventsQueue.addItem).toHaveBeenCalledWith(sampleEvent);
    });

    it('should handle enqueue without optional parameters', () => {
      plugin.destinationsEventsQueue.enqueue(mockState, mockEventsQueue, sampleEvent);

      expect(mockEventsQueue.addItem).toHaveBeenCalledWith(sampleEvent);
    });
  });

  describe('Direct Event to Destination Enqueuing', () => {
    it('should send event directly to destination', () => {
      plugin.destinationsEventsQueue.enqueueEventToDestination(
        mockState,
        sampleEvent,
        mockDestinations[0],
        mockErrorHandler,
        mockLogger,
      );

      expect(mockSendEventToDestination).toHaveBeenCalledWith(
        sampleEvent,
        mockDestinations[0],
        mockErrorHandler,
        mockLogger,
      );
    });

    it('should handle direct enqueue without optional parameters', () => {
      plugin.destinationsEventsQueue.enqueueEventToDestination(
        mockState,
        sampleEvent,
        mockDestinations[0],
      );

      expect(mockSendEventToDestination).toHaveBeenCalledWith(
        sampleEvent,
        mockDestinations[0],
        undefined,
        undefined,
      );
    });
  });
});
