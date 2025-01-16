/* eslint-disable no-plusplus */
import { batch } from '@preact/signals-core';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultStoreManager } from '@rudderstack/analytics-js-common/__mocks__/StoreManager';
import type { ExtensionPoint } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { RetryQueue } from '@rudderstack/analytics-js-common/utilities/retryQueue/RetryQueue';
import type {
  QueueItem,
  QueueItemData,
} from '@rudderstack/analytics-js-common/utilities/retryQueue/types';
import type { ResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
import { defaultHttpClient } from '@rudderstack/analytics-js-common/__mocks__/HttpClient';
import { defaultPluginsManager } from '@rudderstack/analytics-js-common/__mocks__/PluginsManager';
import { HttpClientError } from '@rudderstack/analytics-js-common/services/HttpClientError';
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
    // Mock the implementation of request to return a successful response
    defaultHttpClient.request.mockImplementation(({ callback }) => {
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
      0,
      3,
      true,
    );

    // Item is successfully processed and removed from queue
    expect((queue.getStorageEntry('queue') as QueueItem<QueueItemData>[]).length).toBe(0);

    queueProcessCbSpy.mockRestore();
    defaultHttpClient.request.mockRestore();
  });

  it('should process transformed events in case of successful transformation', () => {
    // Mock the implementation of request to return a successful response
    defaultHttpClient.request.mockImplementation(({ callback }) => {
      callback?.(JSON.stringify(dmtSuccessResponse), {
        response: { status: 200 } as Response,
      } as ResponseDetails);
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
      {
        response: { status: 200 } as Response,
      },
      event,
      defaultErrorHandler,
      defaultLogger,
    );

    mockSendTransformedEventToDestinations.mockRestore();
    defaultHttpClient.request.mockRestore();
  });
  it('should not process transformed events in case of unsuccessful transformation', () => {
    // Mock the implementation of request to return a retryable error response
    defaultHttpClient.request.mockImplementation(({ callback }) => {
      callback?.(null, {
        error: new HttpClientError('some error', {
          status: 502,
        }),
      } as ResponseDetails);
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
        id: 'sample_uuid',
        time: expect.any(Number),
        // time: 1 + 500 * 2 ** 1, // this is the delay calculation in RetryQueue
        type: 'Single',
      },
    ]);
    mockSendTransformedEventToDestinations.mockRestore();
  });
});
