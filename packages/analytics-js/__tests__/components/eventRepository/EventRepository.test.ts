import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type {
  Destination,
  DestinationConfig,
} from '@rudderstack/analytics-js-common/types/Destination';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultHttpClient } from '../../../src/services/HttpClient';
import { EventRepository } from '../../../src/components/eventRepository';
import { state, resetState } from '../../../src/state';
import { PluginsManager } from '../../../src/components/pluginsManager';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import { StoreManager } from '../../../src/services/StoreManager';
import type { DataPlaneEventsQueue } from '../../../src/components/dataPlaneEventsQueue/DataPlaneEventsQueue';

describe('EventRepository', () => {
  const defaultPluginsManager = new PluginsManager(
    defaultPluginEngine,
    defaultErrorHandler,
    defaultLogger,
  );

  const defaultStoreManager = new StoreManager(
    defaultPluginsManager,
    defaultErrorHandler,
    defaultLogger,
  );

  const mockDestinationsEventsQueue = {
    scheduleTimeoutActive: false,
    start: jest.fn(),
    clear: jest.fn(),
  };

  const mockDMTEventsQueue = {
    scheduleTimeoutActive: false,
    start: jest.fn(),
    clear: jest.fn(),
  };

  const mockPluginsManager = {
    invokeSingle: (extPoint: string) => {
      if (extPoint === 'destinationsEventsQueue.init') {
        return mockDestinationsEventsQueue;
      }
      if (extPoint === 'transformEvent.init') {
        return mockDMTEventsQueue;
      }
    },
  } as IPluginsManager;

  const testEvent = {
    type: 'track',
    event: 'test-event',
    userId: 'test-user',
    properties: {
      test: 'test',
    },
    integrations: {
      All: true,
    },
  } as unknown as RudderEvent;

  const activeDestinationsWithHybridMode = [
    {
      id: 'test-destination',
      displayName: 'Test Destination',
      config: {
        connectionMode: 'hybrid',
      } as unknown as DestinationConfig,
    } as Destination,
    {
      id: 'test-destination-2',
      displayName: 'Test Destination 2',
      config: {
        useNativeSDK: false,
        connectionMode: 'cloud',
      } as unknown as DestinationConfig,
    } as Destination,
  ];

  beforeEach(() => {
    state.lifecycle.activeDataplaneUrl.value = 'https://example.com/dataplane';
  });

  afterEach(() => {
    resetState();
  });

  it('should invoke appropriate plugins start on init', () => {
    const eventRepository = new EventRepository(
      defaultPluginsManager,
      defaultStoreManager,
      defaultHttpClient,
      defaultErrorHandler,
      defaultLogger,
    );

    expect(eventRepository.dataplaneEventsQueue).toBeDefined();

    const spy = jest.spyOn(defaultPluginsManager, 'invokeSingle');
    eventRepository.init();

    expect(spy).toHaveBeenNthCalledWith(
      1,
      'transformEvent.init',
      state,
      defaultPluginsManager,
      expect.objectContaining({}),
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(spy).toHaveBeenNthCalledWith(
      2,
      'destinationsEventsQueue.init',
      state,
      defaultPluginsManager,
      defaultStoreManager,
      undefined,
      defaultErrorHandler,
      defaultLogger,
    );
    spy.mockRestore();
  });

  it('should start the destinations events queue when the client destinations are ready', () => {
    const eventRepository = new EventRepository(
      mockPluginsManager,
      defaultStoreManager,
      defaultHttpClient,
      defaultErrorHandler,
      defaultLogger,
    );

    eventRepository.init();

    state.nativeDestinations.clientDestinationsReady.value = true;

    expect(mockDestinationsEventsQueue.start).toHaveBeenCalledTimes(1);
  });

  it('should start the dataplane events queue when no hybrid destinations are present', () => {
    const eventRepository = new EventRepository(
      mockPluginsManager,
      defaultStoreManager,
      defaultHttpClient,
      defaultErrorHandler,
      defaultLogger,
    );

    state.nativeDestinations.activeDestinations.value = [
      {
        id: 'test-destination',
        displayName: 'Test Destination',
        config: {
          useNativeSDK: true,
          connectionMode: 'device',
        } as unknown as DestinationConfig,
      } as Destination,
      {
        id: 'test-destination-2',
        displayName: 'Test Destination 2',
        config: {
          useNativeSDK: false,
          connectionMode: 'cloud',
        } as unknown as DestinationConfig,
      } as Destination,
    ];

    const dpEventsQueueStartSpy = jest.spyOn(
      eventRepository.dataplaneEventsQueue as DataPlaneEventsQueue,
      'start',
    );

    eventRepository.init();

    expect(dpEventsQueueStartSpy).toHaveBeenCalledTimes(1);
  });

  it('should start the dataplane events queue when hybrid destinations are present and bufferDataPlaneEventsUntilReady is false', () => {
    const eventRepository = new EventRepository(
      mockPluginsManager,
      defaultStoreManager,
      defaultHttpClient,
      defaultErrorHandler,
      defaultLogger,
    );

    state.nativeDestinations.activeDestinations.value = activeDestinationsWithHybridMode;

    state.loadOptions.value.bufferDataPlaneEventsUntilReady = false;

    const dpEventsQueueStartSpy = jest.spyOn(
      eventRepository.dataplaneEventsQueue as DataPlaneEventsQueue,
      'start',
    );

    eventRepository.init();

    expect(dpEventsQueueStartSpy).toHaveBeenCalledTimes(1);
  });

  it('should start the dataplane events queue when hybrid destinations are present and bufferDataPlaneEventsUntilReady is true and client destinations are ready after some time', done => {
    const eventRepository = new EventRepository(
      mockPluginsManager,
      defaultStoreManager,
      defaultHttpClient,
      defaultErrorHandler,
      defaultLogger,
    );

    state.nativeDestinations.activeDestinations.value = activeDestinationsWithHybridMode;

    state.loadOptions.value.bufferDataPlaneEventsUntilReady = true;
    state.loadOptions.value.dataPlaneEventsBufferTimeout = 3000;

    const dpEventsQueueStartSpy = jest.spyOn(
      eventRepository.dataplaneEventsQueue as DataPlaneEventsQueue,
      'start',
    );

    eventRepository.init();

    expect(dpEventsQueueStartSpy).not.toHaveBeenCalled();

    // After 500ms, the client destinations are ready
    setTimeout(() => {
      state.nativeDestinations.clientDestinationsReady.value = true;
      expect(dpEventsQueueStartSpy).toHaveBeenCalledTimes(1);
      done();
    }, 500);
  });

  it('should start the dataplane events queue when hybrid destinations are present and bufferDataPlaneEventsUntilReady is true and client destinations are not ready until buffer timeout expires', done => {
    const eventRepository = new EventRepository(
      mockPluginsManager,
      defaultStoreManager,
      defaultHttpClient,
      defaultErrorHandler,
      defaultLogger,
    );

    state.nativeDestinations.activeDestinations.value = activeDestinationsWithHybridMode;

    state.loadOptions.value.bufferDataPlaneEventsUntilReady = true;
    state.loadOptions.value.dataPlaneEventsBufferTimeout = 500;

    const dpEventsQueueStartSpy = jest.spyOn(
      eventRepository.dataplaneEventsQueue as DataPlaneEventsQueue,
      'start',
    );

    eventRepository.init();

    expect(dpEventsQueueStartSpy).not.toHaveBeenCalled();

    // After 500ms, the client destinations are ready
    setTimeout(() => {
      expect(dpEventsQueueStartSpy).toHaveBeenCalledTimes(1);
      done();
    }, state.loadOptions.value.dataPlaneEventsBufferTimeout + 50);
  });

  it('should pass the enqueued event to both dataplane and destinations events queues', () => {
    const eventRepository = new EventRepository(
      mockPluginsManager,
      defaultStoreManager,
      defaultHttpClient,
      defaultErrorHandler,
      defaultLogger,
    );

    eventRepository.init();

    eventRepository?.dataplaneEventsQueue?.stop();

    const dpEventsQueueEnqueueSpy = jest.spyOn(
      eventRepository.dataplaneEventsQueue as DataPlaneEventsQueue,
      'enqueue',
    );

    const invokeSingleSpy = jest.spyOn(mockPluginsManager, 'invokeSingle');
    eventRepository.enqueue(testEvent);

    expect(dpEventsQueueEnqueueSpy).toHaveBeenNthCalledWith(1, {
      ...testEvent,
      integrations: { All: true },
    });

    expect(invokeSingleSpy).toHaveBeenNthCalledWith(
      1,
      'destinationsEventsQueue.enqueue',
      state,
      mockDestinationsEventsQueue,
      testEvent,
      defaultErrorHandler,
      defaultLogger,
    );

    invokeSingleSpy.mockRestore();
    dpEventsQueueEnqueueSpy.mockRestore();
  });

  it('should invoke event callback function if provided', () => {
    const eventRepository = new EventRepository(
      mockPluginsManager,
      defaultStoreManager,
      defaultHttpClient,
      defaultErrorHandler,
      defaultLogger,
    );

    eventRepository.init();

    const mockEventCallback = jest.fn();
    eventRepository.enqueue(testEvent, mockEventCallback);

    expect(mockEventCallback).toHaveBeenCalledTimes(1);
    expect(mockEventCallback).toHaveBeenCalledWith({
      ...testEvent,
      integrations: { All: true },
    });
  });

  it('should log an error if the event callback function is not a function', () => {
    const eventRepository = new EventRepository(
      mockPluginsManager,
      defaultStoreManager,
      defaultHttpClient,
      defaultErrorHandler,
      defaultLogger,
    );

    eventRepository.init();

    eventRepository.enqueue(testEvent, 'invalid-callback' as any);

    expect(defaultLogger.error).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledWith(
      'TrackAPI:: The provided callback parameter is not a function.',
    );
  });

  it('should handle error if event callback function throws', () => {
    const eventRepository = new EventRepository(
      mockPluginsManager,
      defaultStoreManager,
      defaultHttpClient,
      defaultErrorHandler,
      defaultLogger,
    );

    eventRepository.init();

    const mockEventCallback = jest.fn(() => {
      throw new Error('test error');
    });
    eventRepository.enqueue(testEvent, mockEventCallback);

    expect(defaultLogger.error).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledWith(
      'TrackAPI:: The callback threw an exception',
      new Error('test error'),
    );
  });

  it('should buffer the data plane events if the pre-consent event delivery strategy is set to buffer', () => {
    const eventRepository = new EventRepository(
      mockPluginsManager,
      defaultStoreManager,
      defaultHttpClient,
      defaultErrorHandler,
      defaultLogger,
    );

    state.consents.preConsent.value = {
      enabled: true,
      events: {
        delivery: 'buffer',
      },
      storage: {
        strategy: 'session', // the value should be either 'session' or 'anonymousId'
      },
    };

    const dpEventsQueueStartSpy = jest.spyOn(
      eventRepository.dataplaneEventsQueue as DataPlaneEventsQueue,
      'start',
    );

    eventRepository.init();

    expect(dpEventsQueueStartSpy).not.toHaveBeenCalled();
  });

  describe('resume', () => {
    it('should resume events processing on resume', () => {
      const eventRepository = new EventRepository(
        mockPluginsManager,
        defaultStoreManager,
        defaultHttpClient,
        defaultErrorHandler,
        defaultLogger,
      );
      const dpEventsQueueStartSpy = jest.spyOn(
        eventRepository.dataplaneEventsQueue as DataPlaneEventsQueue,
        'start',
      );
      eventRepository.init();

      eventRepository.resume();
      expect(dpEventsQueueStartSpy).toHaveBeenCalled();
    });

    it('should clear the events queue if discardPreConsentEvents is set to true', () => {
      const eventRepository = new EventRepository(
        mockPluginsManager,
        defaultStoreManager,
        defaultHttpClient,
        defaultErrorHandler,
        defaultLogger,
      );

      const dpEventsQueueClearSpy = jest.spyOn(
        eventRepository.dataplaneEventsQueue as DataPlaneEventsQueue,
        'clear',
      );

      state.consents.preConsent.value.enabled = true;
      state.consents.preConsent.value.events = {
        delivery: 'buffer',
      };
      state.consents.preConsent.value.storage = {
        strategy: 'session',
      };
      state.consents.postConsent.value.discardPreConsentEvents = true;

      eventRepository.init();

      eventRepository.resume();

      expect(dpEventsQueueClearSpy).toHaveBeenCalled();
      expect(mockDestinationsEventsQueue.clear).toHaveBeenCalled();
    });
  });
});
