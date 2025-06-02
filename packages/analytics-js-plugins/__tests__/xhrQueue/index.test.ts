/* eslint-disable import/no-extraneous-dependencies */
import { batch } from '@preact/signals-core';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { defaultStoreManager } from '@rudderstack/analytics-js-common/__mocks__/StoreManager';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import type { ExtensionPoint } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { defaultHttpClient } from '@rudderstack/analytics-js-common/__mocks__/HttpClient';
import type { RetryQueue } from '../../src/utilities/retryQueue/RetryQueue';
import type { QueueItem, QueueItemData } from '../../src/types/plugins';
import { resetState, state } from '../../__mocks__/state';
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
  beforeAll(() => {
    resetState();
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

  it('should add itself to the loaded plugins list on initialized', () => {
    XhrQueue()?.initialize?.(state);

    expect(state.plugins.loadedPlugins.value).toContain('XhrQueue');
  });

  it('should return a queue object on init', () => {
    const queue = (XhrQueue()?.dataplaneEventsQueue as ExtensionPoint).init?.(
      state,
      defaultHttpClient,
      defaultStoreManager,
      defaultErrorHandler,
      defaultLogger,
    ) as RetryQueue;

    expect(queue).toBeDefined();
    expect(queue.name).toBe('rudder_sampleWriteKey');
  });

  it('should add item in queue on enqueue', () => {
    const queue = (XhrQueue()?.dataplaneEventsQueue as ExtensionPoint).init?.(
      state,
      defaultHttpClient,
      defaultStoreManager,
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

    (XhrQueue()?.dataplaneEventsQueue as ExtensionPoint).enqueue?.(state, queue, event);

    expect(addItemSpy).toHaveBeenCalledWith({
      url: 'https://sampleurl.com/v1/track',
      headers: {
        AnonymousId: 'c2FtcGxlQW5vbklk', // Base64 encoded anonymousId
      },
      event: mergeDeepRight(event, { sentAt: 'sample_timestamp' }),
    });

    addItemSpy.mockRestore();
  });

  it('should process queue item on start', () => {
    // Mock getAsyncData to return a successful response

    defaultHttpClient.getAsyncData.mockImplementation(({ callback }) => {
      callback?.(true);
    });
    const queue = (XhrQueue()?.dataplaneEventsQueue as ExtensionPoint).init?.(
      state,
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

    (XhrQueue()?.dataplaneEventsQueue as ExtensionPoint).enqueue?.(state, queue, event);

    // Explicitly start the queue to process the item
    // In actual implementation, this is done based on the state signals
    queue.start();

    expect(queueProcessCbSpy).toHaveBeenCalledWith(
      {
        url: 'https://sampleurl.com/v1/track',
        headers: {
          AnonymousId: 'c2FtcGxlQW5vbklk', // Base64 encoded anonymousId
        },
        event: mergeDeepRight(event, { sentAt: 'sample_timestamp' }),
      },
      expect.any(Function),
      {
        retryAttemptNumber: 0,
        maxRetryAttempts: 10,
        willBeRetried: true,
        timeSinceFirstAttempt: expect.any(Number),
        timeSinceLastAttempt: expect.any(Number),
        reclaimed: false,
        isPageAccessible: true,
      },
    );

    // Item is successfully processed and removed from queue
    expect((queue.getStorageEntry('queue') as QueueItem<QueueItemData>[]).length).toBe(0);

    queueProcessCbSpy.mockRestore();
  });

  it('should log error on retryable failure and requeue the item', () => {
    // Mock getAsyncData to return a retryable failure

    defaultHttpClient.getAsyncData.mockImplementation(({ callback }) => {
      callback?.(false, { error: { message: 'Too many requests' }, xhr: { status: 429 } });
    });
    const queue = (XhrQueue()?.dataplaneEventsQueue as ExtensionPoint).init?.(
      state,
      defaultHttpClient,
      defaultStoreManager,
      undefined,
      defaultLogger,
    ) as RetryQueue;

    const schedule = new Schedule();
    // Override the timestamp generation function to return a fixed value
    schedule.now = () => 1;

    queue.schedule = schedule;

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

    (XhrQueue()?.dataplaneEventsQueue as ExtensionPoint).enqueue?.(state, queue, event);

    // Explicitly start the queue to process the item
    // In actual implementation, this is done based on the state signals
    queue.start();

    expect(defaultLogger.warn).toHaveBeenCalledWith(
      'XhrQueuePlugin:: Failed to deliver event(s). Cause: Too many requests. The event(s) will be retried.',
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
        lastAttemptedAt: expect.any(Number),
        firstAttemptedAt: expect.any(Number),
        id: 'sample_uuid',
        time: 1 + 1000 * 2 ** 1, // this is the delay calculation in RetryQueue
        type: 'Single',
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

    const queue = (XhrQueue()?.dataplaneEventsQueue as ExtensionPoint).init?.(
      state,
      defaultHttpClient,
      defaultStoreManager,
      undefined,
      defaultLogger,
    ) as RetryQueue;
    const queueProcessCbSpy = jest.spyOn(queue, 'processQueueCb');

    const schedule = new Schedule();
    // Override the timestamp generation function to return a fixed value
    schedule.now = () => 1;

    queue.schedule = schedule;

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

    const event2 = {
      type: 'track',
      event: 'test2',
      userId: 'test2',
      properties: {
        test2: 'test2',
      },
      anonymousId: 'sampleAnonId',
      messageId: 'test2',
      originalTimestamp: 'test2',
    } as unknown as RudderEvent;

    (XhrQueue()?.dataplaneEventsQueue as ExtensionPoint).enqueue?.(state, queue, event);
    (XhrQueue()?.dataplaneEventsQueue as ExtensionPoint).enqueue?.(state, queue, event2);

    // Explicitly start the queue to process the item
    // In actual implementation, this is done based on the state signals
    queue.start();

    expect(queueProcessCbSpy).toHaveBeenCalledWith(
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
      {
        retryAttemptNumber: 0,
        maxRetryAttempts: 10,
        willBeRetried: true,
        timeSinceFirstAttempt: expect.any(Number),
        timeSinceLastAttempt: expect.any(Number),
        reclaimed: false,
        isPageAccessible: true,
      },
    );

    expect(defaultHttpClient.getAsyncData).toHaveBeenCalledWith({
      url: 'https://sampleurl.com/v1/batch',
      options: {
        method: 'POST',
        headers: {
          AnonymousId: 'c2FtcGxlQW5vbklk', // Base64 encoded anonymousId
          SentAt: 'sample_timestamp',
        },
        sendRawData: true,
        data: '{"batch":[{"type":"track","event":"test","userId":"test","properties":{"test":"test"},"anonymousId":"sampleAnonId","messageId":"test","originalTimestamp":"test","sentAt":"sample_timestamp"},{"type":"track","event":"test2","userId":"test2","properties":{"test2":"test2"},"anonymousId":"sampleAnonId","messageId":"test2","originalTimestamp":"test2","sentAt":"sample_timestamp"}],"sentAt":"sample_timestamp"}',
      },
      isRawResponse: true,
      timeout: 30000,
      callback: expect.any(Function),
    });
  });
});
