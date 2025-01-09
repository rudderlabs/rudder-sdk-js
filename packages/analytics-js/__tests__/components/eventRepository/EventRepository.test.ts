import { batch } from '@preact/signals-core';
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

  const mockDataplaneEventsQueue = {
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
      return mockDataplaneEventsQueue;
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
    batch(() => {
      resetState();
    });
  });

  it('should invoke appropriate plugins start on init', () => {
    const eventRepository = new EventRepository(
      defaultPluginsManager,
      defaultStoreManager,
      defaultHttpClient,
      defaultErrorHandler,
      defaultLogger,
    );
    const spy = jest.spyOn(defaultPluginsManager, 'invokeSingle');
    eventRepository.init();

    expect(spy).toHaveBeenNthCalledWith(
      1,
      'dataplaneEventsQueue.init',
      state,
      expect.objectContaining({}),
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(spy).toHaveBeenNthCalledWith(
      2,
      'transformEvent.init',
      state,
      defaultPluginsManager,
      expect.objectContaining({}),
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(spy).toHaveBeenNthCalledWith(
      3,
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

    eventRepository.init();

    expect(mockDataplaneEventsQueue.start).toHaveBeenCalledTimes(1);
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

    eventRepository.init();

    expect(mockDataplaneEventsQueue.start).toHaveBeenCalledTimes(1);
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

    eventRepository.init();

    expect(mockDataplaneEventsQueue.start).not.toHaveBeenCalled();

    setTimeout(() => {
      state.nativeDestinations.clientDestinationsReady.value = true;
      expect(mockDataplaneEventsQueue.start).toHaveBeenCalledTimes(1);
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

    eventRepository.init();

    expect(mockDataplaneEventsQueue.start).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(mockDataplaneEventsQueue.start).toHaveBeenCalledTimes(1);
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

    const invokeSingleSpy = jest.spyOn(mockPluginsManager, 'invokeSingle');
    eventRepository.enqueue(testEvent);

    expect(invokeSingleSpy).toHaveBeenNthCalledWith(
      1,
      'dataplaneEventsQueue.enqueue',
      state,
      mockDataplaneEventsQueue,
      {
        ...testEvent,
        integrations: { All: true },
      },
      defaultErrorHandler,
      defaultLogger,
    );
    expect(invokeSingleSpy).toHaveBeenNthCalledWith(
      2,
      'destinationsEventsQueue.enqueue',
      state,
      mockDestinationsEventsQueue,
      testEvent,
      defaultErrorHandler,
      defaultLogger,
    );

    invokeSingleSpy.mockRestore();
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

    eventRepository.init();

    expect(mockDataplaneEventsQueue.start).not.toHaveBeenCalled();
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
      eventRepository.init();

      eventRepository.resume();
      expect(mockDataplaneEventsQueue.start).toHaveBeenCalled();
    });

    it('should clear the events queue if discardPreConsentEvents is set to true', () => {
      const eventRepository = new EventRepository(
        mockPluginsManager,
        defaultStoreManager,
        defaultHttpClient,
        defaultErrorHandler,
        defaultLogger,
      );

      state.consents.postConsent.value.discardPreConsentEvents = true;

      eventRepository.init();

      eventRepository.resume();

      expect(mockDataplaneEventsQueue.clear).toHaveBeenCalled();
      expect(mockDestinationsEventsQueue.clear).toHaveBeenCalled();
    });
  });
});
