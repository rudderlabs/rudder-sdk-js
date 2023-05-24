import { XhrQueue } from '@rudderstack/analytics-js-plugins/xhrQueue';
import { state, mergeDeepRight } from '@rudderstack/analytics-js-plugins/utilities/common';
import { batch } from '@preact/signals-core';
import { RudderEvent } from '@rudderstack/analytics-js-plugins/types/common';

jest.mock('@rudderstack/analytics-js-plugins/utilities/common', () => ({
  ...jest.requireActual('@rudderstack/analytics-js-plugins/utilities/common'),
  getCurrentTimeFormatted: jest.fn(() => 'sample_timestamp'),
}));

describe('XhrQueue', () => {
  it('should add itself to the loaded plugins list on initialized', () => {
    XhrQueue().initialize(state);

    expect(state.plugins.loadedPlugins.value).toContain('XhrQueue');
  });

  it('should return a queue object on init', () => {
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

    const queue = XhrQueue().dataplaneEventsQueue.init(state);

    expect(queue).toBeDefined();
    expect(queue.running).toBeFalsy();
    expect(queue.name).toBe('rudder');
  });

  it('should start the queue on start', () => {
    const queue = XhrQueue().dataplaneEventsQueue.init(state);
    XhrQueue().dataplaneEventsQueue.start(queue);
    expect(queue.running).toBeTruthy();
  });

  it('should add item in queue on enqueue', () => {
    const queue = XhrQueue().dataplaneEventsQueue.init(state);

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
      originalTimestamp: 'test'
    };

    XhrQueue().dataplaneEventsQueue.enqueue(state, queue, event);

    expect(addItemSpy).toBeCalledWith({
      url: 'https://sampleurl.com/v1/track',
      headers: {
        AnonymousId: 'c2FtcGxlQW5vbklk' // Base64 encoded anonymousId
      },
      event: mergeDeepRight(event, { sentAt: 'sample_timestamp' })
    });

    addItemSpy.mockRestore();
  });

  it('should process queue item on start', () => {
    const queue = XhrQueue().dataplaneEventsQueue.init(state);

    const event: RudderEvent = {
      type: 'track',
      event: 'test',
      userId: 'test',
      properties: {
        test: 'test',
      },
      anonymousId: 'sampleAnonId',
      messageId: 'test',
      originalTimestamp: 'test'
    };

    XhrQueue().dataplaneEventsQueue.enqueue(state, queue, event);

    const queueProcessCbSpy = jest.spyOn(queue, 'fn');

    XhrQueue().dataplaneEventsQueue.start(queue);

    expect(queueProcessCbSpy).toBeCalledWith(
      {
        url: 'https://sampleurl.com/v1/track',
        headers: {
          AnonymousId: 'c2FtcGxlQW5vbklk' // Base64 encoded anonymousId
        },
        event: mergeDeepRight(event, { sentAt: 'sample_timestamp' })
      },
      expect.any(Function),
      0,
      10,
      true
    );

    queueProcessCbSpy.mockRestore();
  });
});
