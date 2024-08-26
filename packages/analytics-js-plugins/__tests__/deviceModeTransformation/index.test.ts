/* eslint-disable no-plusplus */
import { batch } from '@preact/signals-core';
import { HttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { state } from '@rudderstack/analytics-js/state';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { StoreManager } from '@rudderstack/analytics-js/services/StoreManager';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type {
  IHttpClient,
  IResponseDetails,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import {
  dummyDataplaneHost,
  dummyWriteKey,
  authToken,
  dmtSuccessResponse,
} from '../../__fixtures__/fixtures';
import { server } from '../../__fixtures__/msw.server';
import * as utils from '@rudderstack/analytics-js-plugins/deviceModeTransformation/utilities';
import { DeviceModeTransformation } from '@rudderstack/analytics-js-plugins/deviceModeTransformation';
import { HttpClientError } from '@rudderstack/analytics-js/services/HttpClient/utils';

jest.mock('@rudderstack/analytics-js-common/utilities/uuId', () => ({
  ...jest.requireActual('@rudderstack/analytics-js-common/utilities/uuId'),
  generateUUID: jest.fn(() => 'sample_uuid'),
}));

describe('Device mode transformation plugin', () => {
  const defaultPluginsManager = new PluginsManager(
    defaultPluginEngine,
    defaultErrorHandler,
    defaultLogger,
  );

  const defaultStoreManager = new StoreManager(defaultPluginsManager);

  beforeAll(() => {
    server.listen();
    batch(() => {
      state.lifecycle.writeKey.value = dummyWriteKey;
      state.lifecycle.activeDataplaneUrl.value = dummyDataplaneHost;
      state.session.authToken.value = authToken;
    });
  });

  const httpClient = new HttpClient(defaultLogger);

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
    const queue = DeviceModeTransformation().transformEvent?.init(
      state,
      defaultPluginsManager,
      httpClient,
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    );

    expect(queue).toBeDefined();
    expect(queue.name).toBe('rudder_dummy-write-key');
  });

  it('should add item in queue on enqueue', () => {
    const queue = DeviceModeTransformation().transformEvent?.init(
      state,
      defaultPluginsManager,
      httpClient,
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    );

    const addItemSpy = jest.spyOn(queue, 'addItem');

    const event: RudderEvent = {
      type: 'track',
      event: 'test',
      userId: 'test',
      properties: {
        test: 'test',
      },
      anonymousId: 'sampleAnonId',
      messageId: 'test',
      originalTimestamp: 'test',
    };

    DeviceModeTransformation().transformEvent?.enqueue(state, queue, event, destinations);

    expect(addItemSpy).toHaveBeenCalledWith({
      token: authToken,
      destinationIds,
      event,
    });

    addItemSpy.mockRestore();
  });

  it('should process queue item on start', () => {
    const mockHttpClient = {
      request: ({ callback }) => {
        callback(true);
      },
      setAuthHeader: jest.fn(),
    };
    const queue = DeviceModeTransformation().transformEvent?.init(
      state,
      defaultPluginsManager,
      mockHttpClient,
      defaultStoreManager,
    );

    const event: RudderEvent = {
      type: 'track',
      event: 'test',
      userId: 'test',
      properties: {
        test: 'test',
      },
      anonymousId: 'sampleAnonId',
      messageId: 'test',
      originalTimestamp: 'test',
    };

    const queueProcessCbSpy = jest.spyOn(queue, 'processQueueCb');

    DeviceModeTransformation().transformEvent?.enqueue(state, queue, event, destinations);

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
      false,
    );

    // Item is successfully processed and removed from queue
    expect(queue.getStorageEntry('queue').length).toBe(0);

    queueProcessCbSpy.mockRestore();
  });

  it('SendTransformedEventToDestinations function is called in case of successful transformation', () => {
    const mockHttpClient: IHttpClient = {
      request: ({ callback }) => {
        callback?.(JSON.stringify(dmtSuccessResponse), {
          response: { status: 200 } as Response,
        } as IResponseDetails);
      },
      setAuthHeader: jest.fn(),
    };
    const mockSendTransformedEventToDestinations = jest.spyOn(
      utils,
      'sendTransformedEventToDestinations',
    );

    const queue = DeviceModeTransformation().transformEvent?.init(
      state,
      defaultPluginsManager,
      mockHttpClient,
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    );

    const event: RudderEvent = {
      type: 'track',
      event: 'test',
      userId: 'test',
      properties: {
        test: 'test',
      },
      anonymousId: 'sampleAnonId',
      messageId: 'test',
      originalTimestamp: 'test',
    };

    queue.start();
    DeviceModeTransformation().transformEvent?.enqueue(state, queue, event, destinations);

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
  });
  it('SendTransformedEventToDestinations function should not be called in case of unsuccessful transformation', () => {
    const mockHttpClient: IHttpClient = {
      request: ({ callback }) => {
        callback?.(null, { error: new HttpClientError('some error', 502) } as IResponseDetails);
      },
      setAuthHeader: jest.fn(),
    };
    const mockSendTransformedEventToDestinations = jest.spyOn(
      utils,
      'sendTransformedEventToDestinations',
    );

    const queue = DeviceModeTransformation().transformEvent?.init(
      state,
      defaultPluginsManager,
      mockHttpClient,
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    );

    const event: RudderEvent = {
      type: 'track',
      event: 'test',
      userId: 'test',
      properties: {
        test: 'test',
      },
      anonymousId: 'sampleAnonId',
      messageId: 'test',
      originalTimestamp: 'test',
    };

    queue.start();
    DeviceModeTransformation().transformEvent?.enqueue(state, queue, event, destinations);

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
      },
    ]);
    mockSendTransformedEventToDestinations.mockRestore();
  });
});
