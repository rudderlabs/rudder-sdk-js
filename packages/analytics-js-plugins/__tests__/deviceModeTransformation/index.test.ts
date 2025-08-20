/* eslint-disable no-plusplus */
import { batch } from '@preact/signals-core';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultStoreManager } from '@rudderstack/analytics-js-common/__mocks__/StoreManager';
import type { ExtensionPoint } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { defaultHttpClient } from '@rudderstack/analytics-js-common/__mocks__/HttpClient';
import { defaultPluginsManager } from '@rudderstack/analytics-js-common/__mocks__/PluginsManager';
import * as utils from '../../src/deviceModeTransformation/utilities';
import { DeviceModeTransformation } from '../../src/deviceModeTransformation';
import {
  dummyDataplaneHost,
  dummyWriteKey,
  authToken,
  dmtSuccessResponse,
} from '../../__fixtures__/fixtures';
import { server } from '../../__fixtures__/msw.server';
import { resetState, state } from '../../__mocks__/state';
import type { RetryQueue } from '../../src/utilities/retryQueue/RetryQueue';
import type { QueueItem, QueueItemData } from '../../src/types/plugins';

jest.mock('@rudderstack/analytics-js-common/utilities/uuId', () => ({
  ...jest.requireActual('@rudderstack/analytics-js-common/utilities/uuId'),
  generateUUID: jest.fn(() => 'sample_uuid'),
}));

describe('Device mode transformation plugin', () => {
  beforeAll(() => {
    server.listen();
    resetState();
    batch(() => {
      state.lifecycle.writeKey.value = dummyWriteKey;
      state.lifecycle.activeDataplaneUrl.value = dummyDataplaneHost;
      state.session.authToken.value = authToken;
    });
  });

  afterAll(() => {
    server.close();
  });

  const destinations = [
    {
      id: 'id1',
      displayName: 'Destination 1',
      userFriendlyId: 'Destination_568fhgvb7689',
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: false,
      config: {},
    },
    {
      id: 'id2',
      displayName: 'Destination 2',
      userFriendlyId: 'Destination_0986fhgvb7689',
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: true,
      config: {},
    },
    {
      id: 'id3',
      displayName: 'Destination 3',
      userFriendlyId: 'Destination_123fhgvb7689',
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: false,
      config: {},
    },
  ];
  const destinationIds = ['id1', 'id2', 'id3'];

  it('should add DeviceModeTransformation plugin in the loaded plugin list', () => {
    DeviceModeTransformation().initialize?.(state);
    expect(state.plugins.loadedPlugins.value.includes('DeviceModeTransformation')).toBe(true);
  });

  it('should return a queue object on init', () => {
    const queue = (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.init?.(
      state,
      defaultPluginsManager,
      defaultHttpClient,
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    ) as RetryQueue;

    expect(queue).toBeDefined();
    expect(queue.name).toBe('rudder_dummy-write-key');
  });

  it('should add item in queue on enqueue', () => {
    const queue = (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.init?.(
      state,
      defaultPluginsManager,
      defaultHttpClient,
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    ) as RetryQueue;

    const addItemSpy = jest.spyOn(queue, 'addItem');

    const event = {
      type: 'track',
      event: 'test',
      userId: 'test',
      properties: {
        test: 'test',
      },
      anonymousId: 'sampleAnonId',
      messageId: 'test',
      originalTimestamp: 'test',
    } as unknown as RudderEvent;

    (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.enqueue?.(
      state,
      queue,
      event,
      destinations,
    );

    expect(addItemSpy).toHaveBeenCalledWith({
      token: authToken,
      destinationIds,
      event,
    });

    addItemSpy.mockRestore();
  });

  it('should process queue item on start', () => {
    // Mock the implementation of getAsyncData to return a successful response
    defaultHttpClient.getAsyncData.mockImplementation(({ callback }) => {
      callback(true);
    });

    const queue = (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.init?.(
      state,
      defaultPluginsManager,
      defaultHttpClient,
      defaultStoreManager,
    ) as RetryQueue;

    const event = {
      type: 'track',
      event: 'test',
      userId: 'test',
      properties: {
        test: 'test',
      },
      anonymousId: 'sampleAnonId',
      messageId: 'test',
      originalTimestamp: 'test',
    } as unknown as RudderEvent;

    const queueProcessCbSpy = jest.spyOn(queue, 'processQueueCb');

    (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.enqueue?.(
      state,
      queue,
      event,
      destinations,
    );

    // Explicitly start the queue to process the item
    // In actual implementation, this is done based on the state signals
    queue.start();

    expect(queueProcessCbSpy).toHaveBeenCalledWith(
      {
        token: authToken,
        destinationIds,
        event,
      },
      expect.any(Function),
      {
        willBeRetried: true,
        retryAttemptNumber: 0,
        maxRetryAttempts: 3,
        reclaimed: false,
        timeSinceFirstAttempt: expect.any(Number),
        timeSinceLastAttempt: expect.any(Number),
        isPageAccessible: true,
        retryReason: 'client-network',
      },
    );

    // Item is successfully processed and removed from queue
    expect((queue.getStorageEntry('queue') as QueueItem<QueueItemData>[]).length).toBe(0);

    queueProcessCbSpy.mockRestore();
    defaultHttpClient.getAsyncData.mockRestore();
  });

  it('should process transformed events in case of successful transformation', () => {
    // Mock the implementation of getAsyncData to return a successful response
    defaultHttpClient.getAsyncData.mockImplementation(({ callback }) => {
      callback(JSON.stringify(dmtSuccessResponse), { xhr: { status: 200 } });
    });

    const mockSendTransformedEventToDestinations = jest.spyOn(
      utils,
      'sendTransformedEventToDestinations',
    );

    const queue = (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.init?.(
      state,
      defaultPluginsManager,
      defaultHttpClient,
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    ) as RetryQueue;

    const event = {
      type: 'track',
      event: 'test',
      userId: 'test',
      properties: {
        test: 'test',
      },
      anonymousId: 'sampleAnonId',
      messageId: 'test',
      originalTimestamp: 'test',
    } as unknown as RudderEvent;

    queue.start();
    (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.enqueue?.(
      state,
      queue,
      event,
      destinations,
    );

    expect(mockSendTransformedEventToDestinations).toHaveBeenCalledTimes(1);
    expect(mockSendTransformedEventToDestinations).toHaveBeenCalledWith(
      state,
      defaultPluginsManager,
      destinationIds,
      JSON.stringify(dmtSuccessResponse),
      200,
      event,
      defaultErrorHandler,
      defaultLogger,
    );

    mockSendTransformedEventToDestinations.mockRestore();
    defaultHttpClient.getAsyncData.mockRestore();
  });
  it('should not process transformed events in case of unsuccessful transformation', () => {
    // Mock the implementation of getAsyncData to return a retryable error response
    defaultHttpClient.getAsyncData.mockImplementation(({ callback }) => {
      callback(false, { error: 'some error', xhr: { status: 502 } });
    });

    const mockSendTransformedEventToDestinations = jest.spyOn(
      utils,
      'sendTransformedEventToDestinations',
    );

    const queue = (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.init?.(
      state,
      defaultPluginsManager,
      defaultHttpClient,
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    ) as RetryQueue;

    const event = {
      type: 'track',
      event: 'test',
      userId: 'test',
      properties: {
        test: 'test',
      },
      anonymousId: 'sampleAnonId',
      messageId: 'test',
      originalTimestamp: 'test',
    } as unknown as RudderEvent;

    queue.start();
    (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.enqueue?.(
      state,
      queue,
      event,
      destinations,
    );

    expect(mockSendTransformedEventToDestinations).not.toHaveBeenCalled();
    // The element is requeued
    expect(queue.getStorageEntry('queue')).toStrictEqual([
      {
        item: {
          token: authToken,
          destinationIds,
          event,
        },
        attemptNumber: 1,
        firstAttemptedAt: expect.any(Number),
        lastAttemptedAt: expect.any(Number),
        reclaimed: undefined,
        retryReason: expect.any(String),
        id: 'sample_uuid',
        time: expect.any(Number),
        // time: 1 + 500 * 2 ** 1, // this is the delay calculation in RetryQueue
        type: 'Single',
      },
    ]);
    mockSendTransformedEventToDestinations.mockRestore();
  });

  describe('Cloned destinations support', () => {
    it('should collect unique destination IDs from cloned destinations in enqueue', () => {
      const queue = (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.init?.(
        state,
        defaultPluginsManager,
        defaultHttpClient,
        defaultStoreManager,
        defaultErrorHandler,
        defaultLogger,
      ) as RetryQueue;

      const addItemSpy = jest.spyOn(queue, 'addItem');

      const event = {
        type: 'track',
        event: 'test',
        userId: 'test',
        properties: {
          test: 'test',
        },
        anonymousId: 'sampleAnonId',
        messageId: 'test',
        originalTimestamp: 'test',
      } as unknown as RudderEvent;

      // Use only cloned destinations with same originalId
      const clonedDestinations = [
        {
          id: 'id4_1',
          originalId: 'id4',
          displayName: 'Destination 4',
          userFriendlyId: 'Destination_123fhgvb4567_1',
          shouldApplyDeviceModeTransformation: true,
          propagateEventsUntransformedOnError: false,
          cloned: true,
          overridden: true,
          config: {
            apiKey: 'cloneA',
          },
        },
        {
          id: 'id4_2',
          originalId: 'id4',
          displayName: 'Destination 4',
          userFriendlyId: 'Destination_123fhgvb4567_2',
          shouldApplyDeviceModeTransformation: true,
          propagateEventsUntransformedOnError: false,
          cloned: true,
          overridden: true,
          config: {
            apiKey: 'cloneB',
          },
        },
      ];

      (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.enqueue?.(
        state,
        queue,
        event,
        clonedDestinations,
      );

      // Should only include unique destination IDs based on originalId
      expect(addItemSpy).toHaveBeenCalledWith({
        token: authToken,
        destinationIds: ['id4'], // Only one unique ID despite multiple clones
        event,
      });

      addItemSpy.mockRestore();
    });

    it('should collect unique destination IDs from mixed original and cloned destinations', () => {
      const queue = (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.init?.(
        state,
        defaultPluginsManager,
        defaultHttpClient,
        defaultStoreManager,
        defaultErrorHandler,
        defaultLogger,
      ) as RetryQueue;

      const addItemSpy = jest.spyOn(queue, 'addItem');

      const event = {
        type: 'track',
        event: 'test',
        userId: 'test',
        properties: {
          test: 'test',
        },
        anonymousId: 'sampleAnonId',
        messageId: 'test',
        originalTimestamp: 'test',
      } as unknown as RudderEvent;

      // Mix of original and cloned destinations
      const mixedDestinations = [
        {
          id: 'id1',
          displayName: 'Destination 1',
          userFriendlyId: 'Destination_568fhgvb7689',
          shouldApplyDeviceModeTransformation: true,
          propagateEventsUntransformedOnError: false,
          config: {},
        },
        {
          id: 'id4_1',
          originalId: 'id4',
          displayName: 'Destination 4',
          userFriendlyId: 'Destination_123fhgvb4567_1',
          shouldApplyDeviceModeTransformation: true,
          propagateEventsUntransformedOnError: false,
          cloned: true,
          overridden: true,
          config: {
            apiKey: 'cloneA',
          },
        },
        {
          id: 'id4_2',
          originalId: 'id4',
          displayName: 'Destination 4',
          userFriendlyId: 'Destination_123fhgvb4567_2',
          shouldApplyDeviceModeTransformation: true,
          propagateEventsUntransformedOnError: false,
          cloned: true,
          overridden: true,
          config: {
            apiKey: 'cloneB',
          },
        },
      ];

      (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.enqueue?.(
        state,
        queue,
        event,
        mixedDestinations,
      );

      // Should collect unique IDs: id1 from original destination, id4 from cloned destinations
      expect(addItemSpy).toHaveBeenCalledWith({
        token: authToken,
        destinationIds: ['id1', 'id4'], // Two unique IDs
        event,
      });

      addItemSpy.mockRestore();
    });

    it('should process transformed events for cloned destinations successfully', () => {
      // Mock successful response with cloned destination data
      const dmtSuccessResponseForCloned = {
        transformedBatch: [
          {
            id: 'id4', // Original ID used in transformation response
            payload: [
              {
                orderNo: 1,
                status: '200',
                event: {
                  type: 'track',
                  event: 'test_transformed',
                  userId: 'test',
                  properties: {
                    test: 'test_transformed',
                  },
                },
              },
            ],
          },
        ],
      };

      defaultHttpClient.getAsyncData.mockImplementation(({ callback }) => {
        callback(JSON.stringify(dmtSuccessResponseForCloned), { xhr: { status: 200 } });
      });

      const mockSendTransformedEventToDestinations = jest.spyOn(
        utils,
        'sendTransformedEventToDestinations',
      );

      const queue = (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.init?.(
        state,
        defaultPluginsManager,
        defaultHttpClient,
        defaultStoreManager,
        defaultErrorHandler,
        defaultLogger,
      ) as RetryQueue;

      const event = {
        type: 'track',
        event: 'test',
        userId: 'test',
        properties: {
          test: 'test',
        },
        anonymousId: 'sampleAnonId',
        messageId: 'test',
        originalTimestamp: 'test',
      } as unknown as RudderEvent;

      // Use only cloned destinations
      const clonedDestinations = [
        {
          id: 'id4_1',
          originalId: 'id4',
          displayName: 'Destination 4',
          userFriendlyId: 'Destination_123fhgvb4567_1',
          shouldApplyDeviceModeTransformation: true,
          propagateEventsUntransformedOnError: false,
          cloned: true,
          overridden: true,
          config: {
            apiKey: 'cloneA',
          },
        },
        {
          id: 'id4_2',
          originalId: 'id4',
          displayName: 'Destination 4',
          userFriendlyId: 'Destination_123fhgvb4567_2',
          shouldApplyDeviceModeTransformation: true,
          propagateEventsUntransformedOnError: false,
          cloned: true,
          overridden: true,
          config: {
            apiKey: 'cloneB',
          },
        },
      ];

      queue.start();
      (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.enqueue?.(
        state,
        queue,
        event,
        clonedDestinations,
      );

      expect(mockSendTransformedEventToDestinations).toHaveBeenCalledTimes(1);
      expect(mockSendTransformedEventToDestinations).toHaveBeenCalledWith(
        state,
        defaultPluginsManager,
        ['id4'], // Original ID used for transformation
        JSON.stringify(dmtSuccessResponseForCloned),
        200,
        event,
        defaultErrorHandler,
        defaultLogger,
      );

      mockSendTransformedEventToDestinations.mockRestore();
      defaultHttpClient.getAsyncData.mockRestore();
    });

    it('should handle empty destination array without errors', () => {
      const queue = (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.init?.(
        state,
        defaultPluginsManager,
        defaultHttpClient,
        defaultStoreManager,
        defaultErrorHandler,
        defaultLogger,
      ) as RetryQueue;

      const addItemSpy = jest.spyOn(queue, 'addItem');

      const event = {
        type: 'track',
        event: 'test',
        userId: 'test',
        properties: {
          test: 'test',
        },
        anonymousId: 'sampleAnonId',
        messageId: 'test',
        originalTimestamp: 'test',
      } as unknown as RudderEvent;

      (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.enqueue?.(
        state,
        queue,
        event,
        [], // Empty destinations array
      );

      expect(addItemSpy).toHaveBeenCalledWith({
        token: authToken,
        destinationIds: [], // Empty array
        event,
      });

      addItemSpy.mockRestore();
    });

    it('should not duplicate destination IDs when multiple clones have different originalIds', () => {
      const queue = (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.init?.(
        state,
        defaultPluginsManager,
        defaultHttpClient,
        defaultStoreManager,
        defaultErrorHandler,
        defaultLogger,
      ) as RetryQueue;

      const addItemSpy = jest.spyOn(queue, 'addItem');

      const event = {
        type: 'track',
        event: 'test',
        userId: 'test',
        properties: {
          test: 'test',
        },
        anonymousId: 'sampleAnonId',
        messageId: 'test',
        originalTimestamp: 'test',
      } as unknown as RudderEvent;

      // Destinations with different originalIds
      const destinationsWithDifferentOriginalIds = [
        {
          id: 'id4_1',
          originalId: 'id4',
          displayName: 'Destination 4',
          userFriendlyId: 'Destination_123fhgvb4567_1',
          shouldApplyDeviceModeTransformation: true,
          propagateEventsUntransformedOnError: false,
          cloned: true,
          overridden: true,
          config: {
            apiKey: 'cloneA',
          },
        },
        {
          id: 'id5_1',
          originalId: 'id5',
          displayName: 'Destination 5',
          userFriendlyId: 'Destination_123fhgvb5678_1',
          shouldApplyDeviceModeTransformation: true,
          propagateEventsUntransformedOnError: false,
          cloned: true,
          overridden: true,
          config: {
            apiKey: 'cloneB',
          },
        },
      ];

      (DeviceModeTransformation()?.transformEvent as ExtensionPoint)?.enqueue?.(
        state,
        queue,
        event,
        destinationsWithDifferentOriginalIds,
      );

      // Should include both unique originalIds
      expect(addItemSpy).toHaveBeenCalledWith({
        token: authToken,
        destinationIds: ['id4', 'id5'], // Two different original IDs
        event,
      });

      addItemSpy.mockRestore();
    });
  });
});
