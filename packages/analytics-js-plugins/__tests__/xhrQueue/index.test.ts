/* eslint-disable import/no-extraneous-dependencies */
import { batch } from '@preact/signals-core';
import { HttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { state } from '@rudderstack/analytics-js/state';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { StoreManager } from '@rudderstack/analytics-js/services/StoreManager';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { XhrQueue } from '../../src/xhrQueue';
import { Schedule } from '../../src/utilities/retryQueue/Schedule';

jest.mock('@rudderstack/analytics-js-common/utilities/timestamp', () => ({
  ...jest.requireActual('@rudderstack/analytics-js-common/utilities/timestamp'),
  getCurrentTimeFormatted: jest.fn(() => 'sample_timestamp'),
}));

jest.mock('@rudderstack/analytics-js-common/utilities/uuId', () => ({
  ...jest.requireActual('@rudderstack/analytics-js-common/utilities/uuId'),
  generateUUID: jest.fn(() => 'sample_uuid'),
}));

describe('XhrQueue', () => {
  const defaultPluginsManager = new PluginsManager(
    defaultPluginEngine,
    defaultErrorHandler,
    defaultLogger,
  );

  const defaultStoreManager = new StoreManager(defaultPluginsManager);

  const mockLogger = {
    error: jest.fn(),
  } as unknown as ILogger;

  beforeAll(() => {
    batch(() => {
      state.lifecycle.writeKey.value = 'sampleWriteKey';
      state.lifecycle.activeDataplaneUrl.value = 'https://sampleurl.com';
      state.loadOptions.value.queueOptions = {
        minRetryDelay: 1000,
        maxRetryDelay: 360000,
        backoffFactor: 2,
        maxAttempts: 10,
        maxItems: 100,
      };
    });
  });

  const httpClient = new HttpClient();

  it('should add itself to the loaded plugins list on initialized', () => {
    XhrQueue().initialize(state);

    expect(state.plugins.loadedPlugins.value).toContain('XhrQueue');
  });

  it('should return a queue object on init', () => {
    const queue = XhrQueue().dataplaneEventsQueue?.init(
      state,
      httpClient,
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    );

    expect(queue).toBeDefined();
    expect(queue.name).toBe('rudder_sampleWriteKey');
  });

  it('should add item in queue on enqueue', () => {
    const queue = XhrQueue().dataplaneEventsQueue?.init(state, httpClient, defaultStoreManager);

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

    XhrQueue().dataplaneEventsQueue?.enqueue(state, queue, event);

    expect(addItemSpy).toBeCalledWith({
      url: 'https://sampleurl.com/v1/track',
      headers: {
        AnonymousId: 'c2FtcGxlQW5vbklk', // Base64 encoded anonymousId
      },
      event: mergeDeepRight(event, { sentAt: 'sample_timestamp' }),
    });

    addItemSpy.mockRestore();
  });

  it('should process queue item on start', () => {
    const mockHttpClient = {
      getAsyncData: ({ callback }) => {
        callback(true);
      },
      setAuthHeader: jest.fn(),
    };
    const queue = XhrQueue().dataplaneEventsQueue?.init(state, mockHttpClient, defaultStoreManager);

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

    XhrQueue().dataplaneEventsQueue?.enqueue(state, queue, event);

    // Explicitly start the queue to process the item
    // In actual implementation, this is done based on the state signals
    queue.start();

    expect(queueProcessCbSpy).toBeCalledWith(
      {
        url: 'https://sampleurl.com/v1/track',
        headers: {
          AnonymousId: 'c2FtcGxlQW5vbklk', // Base64 encoded anonymousId
        },
        event: mergeDeepRight(event, { sentAt: 'sample_timestamp' }),
      },
      expect.any(Function),
      0,
      10,
      true,
    );

    // Item is successfully processed and removed from queue
    expect(queue.getStorageEntry('queue').length).toBe(0);

    queueProcessCbSpy.mockRestore();
  });

  it('should log error on retryable failure and requeue the item', () => {
    const mockHttpClient = {
      getAsyncData: ({ callback }) => {
        callback(false, { error: 'some error', xhr: { status: 429 } });
      },
      setAuthHeader: jest.fn(),
    } as unknown as IHttpClient;

    const queue = XhrQueue().dataplaneEventsQueue?.init(
      state,
      mockHttpClient,
      defaultStoreManager,
      undefined,
      mockLogger,
    );

    const schedule = new Schedule();
    // Override the timestamp generation function to return a fixed value
    schedule.now = () => 1;

    queue.schedule = schedule;

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

    XhrQueue().dataplaneEventsQueue?.enqueue(state, queue, event);

    // Explicitly start the queue to process the item
    // In actual implementation, this is done based on the state signals
    queue.start();

    expect(mockLogger.error).toBeCalledWith(
      'XhrQueuePlugin:: Failed to deliver event(s) to https://sampleurl.com/v1/track. It/they will be retried.',
    );

    // The element is requeued
    expect(queue.getStorageEntry('queue')).toStrictEqual([
      {
        item: {
          url: 'https://sampleurl.com/v1/track',
          headers: {
            AnonymousId: 'c2FtcGxlQW5vbklk', // Base64 encoded anonymousId
          },
          event: mergeDeepRight(event, { sentAt: 'sample_timestamp' }),
        },
        attemptNumber: 1,
        id: 'sample_uuid',
        time: 1 + 1000 * 2 ** 1, // this is the delay calculation in RetryQueue
      },
    ]);
  });

  it('should queue and process events when running in batch mode', () => {
    batch(() => {
      state.loadOptions.value.queueOptions = {
        minRetryDelay: 1000,
        maxRetryDelay: 360000,
        backoffFactor: 2,
        maxAttempts: 10,
        maxItems: 100,
        batch: {
          enabled: true,
          maxSize: 1024,
          maxItems: 2,
        },
      };
    });

    const mockHttpClient = {
      getAsyncData: jest.fn(),
      setAuthHeader: jest.fn(),
    } as unknown as IHttpClient;

    const queue = XhrQueue().dataplaneEventsQueue?.init(
      state,
      mockHttpClient,
      defaultStoreManager,
      undefined,
      mockLogger,
    );
    const queueProcessCbSpy = jest.spyOn(queue, 'processQueueCb');

    const schedule = new Schedule();
    // Override the timestamp generation function to return a fixed value
    schedule.now = () => 1;

    queue.schedule = schedule;

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

    const event2: RudderEvent = {
      type: 'track',
      event: 'test2',
      userId: 'test2',
      properties: {
        test2: 'test2',
      },
      anonymousId: 'sampleAnonId',
      messageId: 'test2',
      originalTimestamp: 'test2',
    };

    XhrQueue().dataplaneEventsQueue?.enqueue(state, queue, event);
    XhrQueue().dataplaneEventsQueue?.enqueue(state, queue, event2);

    // Explicitly start the queue to process the item
    // In actual implementation, this is done based on the state signals
    queue.start();

    expect(queueProcessCbSpy).toBeCalledWith(
      [
        {
          url: 'https://sampleurl.com/v1/track',
          headers: {
            AnonymousId: 'c2FtcGxlQW5vbklk', // Base64 encoded anonymousId
          },
          event: mergeDeepRight(event, { sentAt: 'sample_timestamp' }),
        },
        {
          url: 'https://sampleurl.com/v1/track',
          headers: {
            AnonymousId: 'c2FtcGxlQW5vbklk', // Base64 encoded anonymousId
          },
          event: mergeDeepRight(event2, { sentAt: 'sample_timestamp' }),
        },
      ],
      expect.any(Function),
      0,
      10,
      true,
    );

    expect(mockHttpClient.getAsyncData).toBeCalledWith({
      url: 'https://sampleurl.com/v1/batch',
      options: {
        method: 'POST',
        headers: {
          AnonymousId: 'c2FtcGxlQW5vbklk', // Base64 encoded anonymousId
        },
        sendRawData: true,
        data: '{"batch":[{"type":"track","event":"test","userId":"test","properties":{"test":"test"},"anonymousId":"sampleAnonId","messageId":"test","originalTimestamp":"test","sentAt":"sample_timestamp"},{"type":"track","event":"test2","userId":"test2","properties":{"test2":"test2"},"anonymousId":"sampleAnonId","messageId":"test2","originalTimestamp":"test2","sentAt":"sample_timestamp"}]}',
      },
      isRawResponse: true,
      timeout: 10000,
      callback: expect.any(Function),
    });
  });
});
