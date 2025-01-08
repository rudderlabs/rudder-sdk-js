import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { HttpClient } from '../../../src/services/HttpClient/HttpClient';
import { defaultLogger } from '../../../__mocks__/Logger';
import { DataPlaneEventsQueue } from '../../../src/components/dataPlaneEventsQueue/DataPlaneEventsQueue';
import { StoreManager } from '../../../src/services/StoreManager';
import { PluginsManager } from '../../../src/components/pluginsManager/PluginsManager';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import { resetState, state } from '../../../src/state';
import { EVENT_PAYLOAD_SIZE_BYTES_LIMIT } from '../../../src/components/dataPlaneEventsQueue/constants';

// mock getCurrentTimeFormatted
jest.mock('@rudderstack/analytics-js-common/utilities/time', () => ({
  getCurrentTimeFormatted: jest.fn(() => '1999-01-01T00:00:00.000Z'),
}));

describe('DataPlaneEventsQueue', () => {
  const httpClient = new HttpClient();
  const pluginsManager = new PluginsManager(defaultPluginEngine);
  const storeManager = new StoreManager(pluginsManager);
  const dataPlaneEventsQueue = new DataPlaneEventsQueue(httpClient, storeManager, defaultLogger);

  const testEvent = {
    type: 'track',
    event: 'test event',
    anonymousId: 'test_anonymous_id',
  } as unknown as RudderEvent;

  beforeEach(() => {
    state.lifecycle.activeDataplaneUrl.value = 'https://12345.com';
    dataPlaneEventsQueue.clear();
    dataPlaneEventsQueue.stop();
  });

  afterAll(() => {
    resetState();
  });

  describe('constructor', () => {
    it('should create an instance where event processing is not active', () => {
      expect(dataPlaneEventsQueue.isRunning()).toBe(false);
    });
  });

  describe('start', () => {
    it('should start the event processing', () => {
      dataPlaneEventsQueue.start();
      expect(dataPlaneEventsQueue.isRunning()).toBe(true);

      // Stop the event processing
      dataPlaneEventsQueue.stop();
    });

    it('should not start the event processing if it is already running', () => {
      dataPlaneEventsQueue.start();

      const startSpy = jest.spyOn(dataPlaneEventsQueue.eventsQueue, 'start');
      dataPlaneEventsQueue.start();
      expect(dataPlaneEventsQueue.isRunning()).toBe(true);

      expect(startSpy).not.toHaveBeenCalled();

      startSpy.mockRestore();

      // Stop the event processing
      dataPlaneEventsQueue.stop();
    });
  });

  describe('stop', () => {
    it('should stop the event processing', () => {
      dataPlaneEventsQueue.start();
      dataPlaneEventsQueue.stop();
      expect(dataPlaneEventsQueue.isRunning()).toBe(false);
    });

    it('should not stop the event processing if it is already stopped', () => {
      const stopSpy = jest.spyOn(dataPlaneEventsQueue.eventsQueue, 'stop');
      dataPlaneEventsQueue.stop();
      expect(dataPlaneEventsQueue.isRunning()).toBe(false);

      expect(stopSpy).not.toHaveBeenCalled();

      stopSpy.mockRestore();
    });
  });

  describe('enqueue', () => {
    it('should add the event to the event queue', () => {
      const addItemSpy = jest.spyOn(dataPlaneEventsQueue.eventsQueue, 'addItem');

      dataPlaneEventsQueue.enqueue(testEvent);

      expect(addItemSpy).toHaveBeenCalledWith({
        url: 'https://12345.com/v1/track',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          // Base 64 encoding of 'test_anonymous_id'
          AnonymousId: 'dGVzdF9hbm9ueW1vdXNfaWQ=',
        },
        event: {
          ...testEvent,
          sentAt: '1999-01-01T00:00:00.000Z',
        },
      });
    });

    it('should log a warning if the event size exceeds the maximum allowed size', () => {
      const originalMaxPayloadSize = EVENT_PAYLOAD_SIZE_BYTES_LIMIT;

      // Temporarily set the maximum payload size to a smaller value
      // @ts-expect-error needed for testing
      EVENT_PAYLOAD_SIZE_BYTES_LIMIT = 32;

      dataPlaneEventsQueue.enqueue(testEvent);

      expect(defaultLogger.warn).toHaveBeenCalledWith(
        'DataPlaneEventsQueue:: The size of the event payload (107 bytes) exceeds the maximum limit of 32 bytes. Events with large payloads may be dropped in the future. Please review your instrumentation to ensure that event payloads are within the size limit.',
      );

      // @ts-expect-error needed for testing
      EVENT_PAYLOAD_SIZE_BYTES_LIMIT = originalMaxPayloadSize;
    });

    it('should process an enqueued event when the event processing is started', () => {
      dataPlaneEventsQueue.enqueue(testEvent);

      const requestSpy = jest.spyOn(httpClient, 'request');

      dataPlaneEventsQueue.start();

      const queueEntry = dataPlaneEventsQueue.eventsQueue.getStorageEntry('queue');
      const batchQueueEntry = dataPlaneEventsQueue.eventsQueue.getStorageEntry('batchQueue');

      expect(queueEntry).toBeNull();
      expect(batchQueueEntry).toBeNull();

      expect(requestSpy).toHaveBeenCalledWith({
        url: 'https://12345.com/v1/track',
        options: {
          method: 'POST',
          body: '{"type":"track","event":"test event","anonymousId":"test_anonymous_id","sentAt":"1999-01-01T00:00:00.000Z"}',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            AnonymousId: 'dGVzdF9hbm9ueW1vdXNfaWQ=',
          },
          useAuth: true,
          keepalive: false,
        },
        isRawResponse: true,
        timeout: 10000,
        callback: expect.any(Function),
      });

      requestSpy.mockRestore();
    });

    it('should process the response of the request', () => {
      dataPlaneEventsQueue.start();

      const originalRequest = httpClient.request;

      let requestOverride: any;

      httpClient.request = jest.fn().mockImplementation(config => {
        requestOverride(config);
      });

      // Retryable failure
      requestOverride = (config: any) => {
        const { callback } = config;
        callback(undefined, { error: { status: 502, message: 'unknown' } });
      };

      dataPlaneEventsQueue.enqueue(testEvent);

      expect(defaultLogger.error).toHaveBeenCalledWith(
        'DataPlaneEventsQueue:: Failed to deliver event(s): unknown. It/they will be retried.',
      );

      defaultLogger.error.mockClear();

      // Success response
      requestOverride = (config: any) => {
        const { callback } = config;
        callback('{"raw": "sample"}', {});
      };

      dataPlaneEventsQueue.enqueue(testEvent);

      expect(defaultLogger.error).not.toHaveBeenCalled();

      // Restore the original request method
      httpClient.request = originalRequest;
    });

    it('should process last batch of events when the page is being unloaded', () => {
      state.loadOptions.value.queueOptions = {
        batch: {
          enabled: true,
          maxItems: 10,
        },
      };

      const requestSpy = jest.spyOn(httpClient, 'request');

      const tmpDataPlaneEventsQueue = new DataPlaneEventsQueue(
        httpClient,
        storeManager,
        defaultLogger,
      );

      tmpDataPlaneEventsQueue.start();

      tmpDataPlaneEventsQueue.enqueue(testEvent);
      tmpDataPlaneEventsQueue.enqueue(testEvent);

      // Dispatch the 'beforeunload' event
      window.dispatchEvent(new Event('beforeunload'));

      expect(requestSpy).toHaveBeenCalledWith({
        url: 'https://12345.com/v1/batch',
        options: {
          method: 'POST',
          // batch payload
          body: '{"batch":[{"type":"track","event":"test event","anonymousId":"test_anonymous_id","sentAt":"1999-01-01T00:00:00.000Z"},{"type":"track","event":"test event","anonymousId":"test_anonymous_id","sentAt":"1999-01-01T00:00:00.000Z"}],"sentAt":"1999-01-01T00:00:00.000Z"}',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            AnonymousId: 'dGVzdF9hbm9ueW1vdXNfaWQ=',
          },
          useAuth: true,
          keepalive: true,
        },
        isRawResponse: true,
        timeout: 10000,
        callback: expect.any(Function),
      });

      const queueEntry = tmpDataPlaneEventsQueue.eventsQueue.getStorageEntry('queue');
      const batchQueueEntry = tmpDataPlaneEventsQueue.eventsQueue.getStorageEntry('batchQueue');

      expect(queueEntry).toBeNull();
      expect(batchQueueEntry).toBeNull();

      // Restore the page's state
      window.dispatchEvent(new Event('focus'));
      requestSpy.mockRestore();
    });
  });

  describe('clear', () => {
    it('should clear the event queue', () => {
      jest.useFakeTimers();

      dataPlaneEventsQueue.enqueue(testEvent);

      dataPlaneEventsQueue.clear();

      jest.runAllTimers();

      const queueEntry = dataPlaneEventsQueue.eventsQueue.getStorageEntry('queue');
      const batchQueueEntry = dataPlaneEventsQueue.eventsQueue.getStorageEntry('batchQueue');

      expect(queueEntry).toBeNull();
      expect(batchQueueEntry).toBeNull();

      jest.useRealTimers();
    });
  });
});
