import { batch } from '@preact/signals-core';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type {
  Destination,
  DestinationConfig,
} from '@rudderstack/analytics-js-common/types/Destination';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { EventRepository } from '../../../src/components/eventRepository';
import { state, resetState } from '../../../src/state';
import { PluginsManager } from '../../../src/components/pluginsManager';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { defaultLogger } from '../../../src/services/Logger';
import { StoreManager } from '../../../src/services/StoreManager';

describe('EventRepository', () => {
  const defaultPluginsManager = new PluginsManager(
    defaultPluginEngine,
    defaultErrorHandler,
    defaultLogger,
  );

  const defaultStoreManager = new StoreManager(defaultPluginsManager);

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
      'transformEvent.init',
      state,
      defaultPluginsManager,
      expect.objectContaining({}),
      defaultStoreManager,
      undefined,
      undefined,
    );
    expect(spy).nthCalledWith(
      3,
      'destinationsEventsQueue.init',
      state,
      defaultPluginsManager,
      defaultStoreManager,
      undefined,
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
      {
        ...testEvent,
        integrations: { All: true },
      },
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
    expect(mockEventCallback).toBeCalledWith({
      ...testEvent,
      integrations: { All: true },
    });
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
    );
  });

  it('should buffer the data plane events if the pre-consent event delivery strategy is set to buffer', () => {
    const eventRepository = new EventRepository(mockPluginsManager, defaultStoreManager);

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

    expect(mockDataplaneEventsQueue.start).not.toBeCalled();
  });

  describe('resume', () => {
    it('should resume events processing on resume', () => {
      const eventRepository = new EventRepository(mockPluginsManager, defaultStoreManager);
      eventRepository.init();

      eventRepository.resume();
      expect(mockDataplaneEventsQueue.start).toBeCalled();
    });

    it('should clear the events queue if discardPreConsentEvents is set to true', () => {
      const eventRepository = new EventRepository(mockPluginsManager, defaultStoreManager);

      state.consents.postConsent.value.discardPreConsentEvents = true;

      eventRepository.init();

      eventRepository.resume();

      expect(mockDataplaneEventsQueue.clear).toBeCalled();
      expect(mockDestinationsEventsQueue.clear).toBeCalled();
    });
  });
});
