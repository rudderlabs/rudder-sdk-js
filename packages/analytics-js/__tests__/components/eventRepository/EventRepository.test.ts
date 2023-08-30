import { EventRepository } from '@rudderstack/analytics-js/components/eventRepository';
import { state, resetState } from '@rudderstack/analytics-js/state';
import { batch } from '@preact/signals-core';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { StoreManager } from '@rudderstack/analytics-js/services/StoreManager';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import {
  Destination,
  DestinationConfig,
  DestinationConnectionMode,
} from '@rudderstack/analytics-js-common/types/Destination';
import { RudderEventType } from '@rudderstack/analytics-js-common/types/EventApi';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';

describe('EventRepository', () => {
  const defaultPluginsManager = new PluginsManager(
    defaultPluginEngine,
    defaultErrorHandler,
    defaultLogger,
  );

  const defaultStoreManager = new StoreManager(defaultPluginsManager);

  const mockDestinationsEventsQueue = {
    start: jest.fn(),
  };

  const mockDataplaneEventsQueue = {
    start: jest.fn(),
  };

  const mockPluginsManager = {
    invokeSingle: (extPoint: string) => {
      if (extPoint === 'destinationsEventsQueue.init') {
        return mockDestinationsEventsQueue;
      } else {
        return mockDataplaneEventsQueue;
      }
    },
  } as IPluginsManager;

  const testEvent = {
    type: RudderEventType.Track,
    event: 'test-event',
    userId: 'test-user',
    properties: {
      test: 'test',
    },
  } as unknown as RudderEvent;

  const activeDestinationsWithHybridMode = [
    {
      id: 'test-destination',
      displayName: 'Test Destination',
      config: {
        connectionMode: DestinationConnectionMode.Hybrid,
      } as unknown as DestinationConfig,
    } as Destination,
    {
      id: 'test-destination-2',
      displayName: 'Test Destination 2',
      config: {
        useNativeSDK: false,
        connectionMode: DestinationConnectionMode.Cloud,
      } as unknown as DestinationConfig,
    } as Destination,
  ];

  beforeEach(() => {
    batch(() => {
      resetState();
    });
  });

  it('should invoke appropriate plugins start on init', () => {
    const eventRepository = new EventRepository(defaultPluginsManager, defaultStoreManager);
    const spy = jest.spyOn(defaultPluginsManager, 'invokeSingle');
    eventRepository.init();

    expect(spy).nthCalledWith(
      1,
      'dataplaneEventsQueue.init',
      state,
      expect.objectContaining({}),
      defaultStoreManager,
      undefined,
      undefined,
    );
    expect(spy).nthCalledWith(
      2,
      'destinationsEventsQueue.init',
      state,
      defaultPluginsManager,
      defaultStoreManager,
      undefined,
      undefined,
    );
    spy.mockRestore();
  });

  it('should start the destinations events queue when the client destinations are ready', () => {
    const eventRepository = new EventRepository(mockPluginsManager, defaultStoreManager);

    eventRepository.init();

    state.nativeDestinations.clientDestinationsReady.value = true;

    expect(mockDestinationsEventsQueue.start).toBeCalledTimes(1);
  });

  it('should start the dataplane events queue when no hybrid destinations are present', () => {
    const eventRepository = new EventRepository(mockPluginsManager, defaultStoreManager);

    state.nativeDestinations.activeDestinations.value = [
      {
        id: 'test-destination',
        displayName: 'Test Destination',
        config: {
          useNativeSDK: true,
          connectionMode: DestinationConnectionMode.Device,
        } as unknown as DestinationConfig,
      } as Destination,
      {
        id: 'test-destination-2',
        displayName: 'Test Destination 2',
        config: {
          useNativeSDK: false,
          connectionMode: DestinationConnectionMode.Cloud,
        } as unknown as DestinationConfig,
      } as Destination,
    ];

    eventRepository.init();

    expect(mockDataplaneEventsQueue.start).toBeCalledTimes(1);
  });

  it('should start the dataplane events queue when hybrid destinations are present and bufferDataPlaneEventsUntilReady is false', () => {
    const eventRepository = new EventRepository(mockPluginsManager, defaultStoreManager);

    state.nativeDestinations.activeDestinations.value = activeDestinationsWithHybridMode;

    state.loadOptions.value.bufferDataPlaneEventsUntilReady = false;

    eventRepository.init();

    expect(mockDataplaneEventsQueue.start).toBeCalledTimes(1);
  });

  it('should start the dataplane events queue when hybrid destinations are present and bufferDataPlaneEventsUntilReady is true and client destinations are ready after some time', done => {
    const eventRepository = new EventRepository(mockPluginsManager, defaultStoreManager);

    state.nativeDestinations.activeDestinations.value = activeDestinationsWithHybridMode;

    state.loadOptions.value.bufferDataPlaneEventsUntilReady = true;
    state.loadOptions.value.dataPlaneEventsBufferTimeout = 3000;

    eventRepository.init();

    expect(mockDataplaneEventsQueue.start).not.toBeCalled();

    setTimeout(() => {
      state.nativeDestinations.clientDestinationsReady.value = true;
      expect(mockDataplaneEventsQueue.start).toBeCalledTimes(1);
      done();
    }, 500);
  });

  it('should start the dataplane events queue when hybrid destinations are present and bufferDataPlaneEventsUntilReady is true and client destinations are not ready until buffer timeout expires', done => {
    const eventRepository = new EventRepository(mockPluginsManager, defaultStoreManager);

    state.nativeDestinations.activeDestinations.value = activeDestinationsWithHybridMode;

    state.loadOptions.value.bufferDataPlaneEventsUntilReady = true;
    state.loadOptions.value.dataPlaneEventsBufferTimeout = 500;

    eventRepository.init();

    expect(mockDataplaneEventsQueue.start).not.toBeCalled();

    setTimeout(() => {
      expect(mockDataplaneEventsQueue.start).toBeCalledTimes(1);
      done();
    }, state.loadOptions.value.dataPlaneEventsBufferTimeout + 50);
  });

  it('should pass the enqueued event to both dataplane and destinations events queues', () => {
    const eventRepository = new EventRepository(mockPluginsManager, defaultStoreManager);

    eventRepository.init();

    const invokeSingleSpy = jest.spyOn(mockPluginsManager, 'invokeSingle');
    eventRepository.enqueue(testEvent);

    expect(invokeSingleSpy).nthCalledWith(
      1,
      'dataplaneEventsQueue.enqueue',
      state,
      mockDataplaneEventsQueue,
      testEvent,
      undefined,
      undefined,
    );
    expect(invokeSingleSpy).nthCalledWith(
      2,
      'destinationsEventsQueue.enqueue',
      state,
      mockDestinationsEventsQueue,
      testEvent,
      undefined,
      undefined,
    );

    invokeSingleSpy.mockRestore();
  });

  it('should invoke event callback function if provided', () => {
    const eventRepository = new EventRepository(mockPluginsManager, defaultStoreManager);

    eventRepository.init();

    const mockEventCallback = jest.fn();
    eventRepository.enqueue(testEvent, mockEventCallback);

    expect(mockEventCallback).toBeCalledTimes(1);
    expect(mockEventCallback).toBeCalledWith(testEvent);
  });

  it('should handle error if event callback function throws', () => {
    const mockErrorHandler = {
      onError: jest.fn(),
    } as unknown as IErrorHandler;

    const eventRepository = new EventRepository(
      mockPluginsManager,
      defaultStoreManager,
      mockErrorHandler,
    );

    eventRepository.init();

    const mockEventCallback = jest.fn(() => {
      throw new Error('test error');
    });
    eventRepository.enqueue(testEvent, mockEventCallback);

    expect(mockErrorHandler.onError).toBeCalledTimes(1);
    expect(mockErrorHandler.onError).toBeCalledWith(
      new Error('test error'),
      'EventRepository',
      'API Callback Invocation Failed',
      undefined,
    );
  });
});
