/* eslint-disable import/no-extraneous-dependencies */
import { Schedule } from '../../../src/utilities/retryQueue/Schedule';
import { RetryQueue } from '../../../src/utilities/retryQueue/RetryQueue';
import { defaultStoreManager } from '../../../__mocks__/StoreManager';
import { Store } from '../../../__mocks__/Store';
import type { DoneCallback, QueueItemData } from '../../../src/utilities/retryQueue/types';
import { IN_PROGRESS, QUEUE, QueueStatuses } from '../../../src/utilities/retryQueue/constants';
import type { BatchOpts } from '../../../src/types/LoadOptions';

const size = (queue: RetryQueue): { queue: number; inProgress: number } => ({
  queue: (queue.store.get(QUEUE) ?? []).length,
  inProgress: (queue.store.get(IN_PROGRESS) ?? []).length,
});

describe('RetryQueue', () => {
  let queue: RetryQueue;
  let schedule: Schedule;
  const engine = window.localStorage;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    engine.clear();
    schedule = new Schedule();
    schedule.now = () => +new window.Date();

    // Have the default function be a spied success
    queue = new RetryQueue(
      'test',
      {
        // scales the timers by 2x. Not a necessity, but added this option to test the timer scaling
        timerScaleFactor: 2,
      },
      jest.fn(),
      defaultStoreManager,
    );
    queue.schedule = schedule;
  });

  afterEach(() => {
    queue.stop();
    jest.setSystemTime(0);
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should add an item to the queue', () => {
    queue.addItem('a');

    expect(queue.getStorageEntry('queue')).toEqual([
      {
        item: 'a',
        attemptNumber: 0,
        time: expect.any(Number),
        id: expect.any(String),
      },
    ]);
  });

  it('should add an item to the batch queue in batch mode', () => {
    const batchQueue = new RetryQueue(
      'test',
      { batch: { maxItems: 10, enabled: true } },
      jest.fn(),
      defaultStoreManager,
    );

    batchQueue.addItem('a');

    expect(batchQueue.getStorageEntry('batchQueue')).toEqual([
      {
        item: 'a',
        attemptNumber: 0,
        time: expect.any(Number),
        id: expect.any(String),
      },
    ]);

    expect(batchQueue.getStorageEntry('queue')).toEqual(null);
  });

  it('should dispatch batch items to main queue when length criteria is met', () => {
    const batchQueue = new RetryQueue(
      'test',
      { batch: { enabled: true, maxItems: 2 } },
      jest.fn(),
      defaultStoreManager,
    );

    batchQueue.addItem('a');
    batchQueue.addItem('b');

    expect(batchQueue.getStorageEntry('batchQueue')).toEqual(null);

    expect(batchQueue.getStorageEntry('queue')).toEqual([
      {
        item: ['a', 'b'],
        attemptNumber: 0,
        time: expect.any(Number),
        id: expect.any(String),
      },
    ]);
  });

  it('should dispatch batch items to main queue when size criteria is met', () => {
    const batchQueue = new RetryQueue(
      'test',
      { batch: { enabled: true, maxSize: 2 } },
      jest.fn(),
      defaultStoreManager,
      undefined,
      undefined,
      (items: QueueItemData[]) => items.length,
    );

    batchQueue.addItem('a');
    batchQueue.addItem('b');

    expect(batchQueue.getStorageEntry('batchQueue')).toEqual(null);

    expect(batchQueue.getStorageEntry('queue')).toEqual([
      {
        item: ['a', 'b'],
        attemptNumber: 0,
        time: expect.any(Number),
        id: expect.any(String),
      },
    ]);
  });

  it('should flush queued batch events', () => {
    const batchQueue = new RetryQueue(
      'test',
      { batch: { enabled: true, maxSize: 2 } },
      jest.fn(),
      defaultStoreManager,
      undefined,
      undefined,
      (items: QueueItemData[]) => items.length,
    );

    batchQueue.addItem('a');

    batchQueue.flushBatch();

    expect(batchQueue.getStorageEntry('batchQueue')).toEqual(null);

    expect(batchQueue.getStorageEntry('queue')).toEqual([
      {
        item: ['a'],
        attemptNumber: 0,
        time: expect.any(Number),
        id: expect.any(String),
      },
    ]);
  });

  it('should not flush queued batch events if another flush is in progress', () => {
    const batchQueue = new RetryQueue(
      'test',
      { batch: { enabled: true, maxSize: 2 } },
      jest.fn(),
      defaultStoreManager,
      undefined,
      undefined,
      (items: QueueItemData[]) => items.length,
    );

    batchQueue.batchingInProgress = true;

    batchQueue.addItem('a');

    batchQueue.flushBatch();

    expect(batchQueue.getStorageEntry('batchQueue')).toEqual([
      {
        item: 'a',
        attemptNumber: 0,
        time: expect.any(Number),
        id: expect.any(String),
      },
    ]);

    expect(batchQueue.getStorageEntry('queue')).toEqual(null);
  });

  it('should run a task', () => {
    queue.start();

    queue.addItem('a');

    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'a',
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );
  });

  it('should retry a task if it fails', () => {
    queue.start();

    // Fail the first time, Succeed the second time
    const mockProcessItemCb = jest
      .fn()
      .mockImplementationOnce((_, cb) => cb(new Error('no')))
      .mockImplementationOnce((_, cb) => cb());
    queue.processQueueCb = mockProcessItemCb;

    queue.addItem('a');

    expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'a',
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );

    // Delay for the first retry
    mockProcessItemCb.mockReset();
    const nextTickDelay = queue.getRetryDelay(1);
    jest.advanceTimersByTime(nextTickDelay);

    expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'a',
      expect.any(Function),
      1,
      Infinity,
      true,
      true,
    );
  });

  it('should delay retries', () => {
    const mockProcessItemCb = jest.fn((_, cb) => cb());
    queue.processQueueCb = mockProcessItemCb;
    queue.start();

    queue.requeue('b', 1);
    queue.addItem('a');

    expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'a',
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );

    // Delay for the retry
    mockProcessItemCb.mockReset();
    const nextTickDelay = queue.getRetryDelay(1);
    jest.advanceTimersByTime(nextTickDelay);

    expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'b',
      expect.any(Function),
      1,
      Infinity,
      true,
      true,
    );
  });

  it('should respect shouldRetry', () => {
    queue.shouldRetry = attemptNumber => attemptNumber <= 2;

    const mockProcessItemCb = jest.fn((_, cb) => cb(new Error('no')));

    // Fail
    queue.processQueueCb = mockProcessItemCb;
    queue.start();

    // over maxattempts
    queue.requeue('a', 3);
    jest.advanceTimersByTime(queue.getRetryDelay(3));
    expect(queue.processQueueCb).toHaveBeenCalledTimes(0);

    mockProcessItemCb.mockReset();
    queue.requeue('a', 2);
    jest.advanceTimersByTime(queue.getRetryDelay(2));
    expect(queue.processQueueCb).toHaveBeenCalledTimes(1);

    mockProcessItemCb.mockReset();
    queue.requeue('a', 3);
    jest.advanceTimersByTime(queue.getRetryDelay(1));
    expect(queue.processQueueCb).toHaveBeenCalledTimes(0);
  });

  it('should respect maxItems', () => {
    expect(queue.batch.enabled).toBe(false);

    queue.maxItems = 100;

    for (let i = 0; i < 105; i += 1) {
      jest.advanceTimersByTime(1);
      queue.addItem(i);
    }

    const storedQueue = queue.store.get(QUEUE);
    expect(storedQueue.length).toEqual(100);
    expect(storedQueue[0].item).toEqual(5);
    expect(storedQueue[99].item).toEqual(104);
  });

  it('should take over a queued task if a queue is abandoned', () => {
    // a wild queue of interest appears
    const foundQueue = new Store({
      name: 'test',
      id: 'fake-id',
    });
    foundQueue.set('ack', 0); // fake timers starts at time 0
    foundQueue.set('queue', [
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
    ]);

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.reclaimTimeout);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.reclaimTimer + queue.timeouts.reclaimWait * 2);

    expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'a',
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );
  });

  it('should take over an in-progress task if a queue is abandoned', () => {
    // set up a fake queue
    const foundQueue = new Store({
      name: 'test',
      id: 'fake-id',
    });
    foundQueue.set('ack', -15000);
    foundQueue.set('inProgress', [
      {
        id: 'task-id',
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
    ]);

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.reclaimTimeout);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.reclaimTimer + queue.timeouts.reclaimWait * 2);

    expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'a',
      expect.any(Function),
      1,
      Infinity,
      true,
      true,
    );
  });

  it('should take over a batch queued task if a queue is abandoned', () => {
    const batchQueue = new RetryQueue(
      'test',
      { batch: { maxItems: 2, enabled: true } },
      jest.fn(),
      defaultStoreManager,
    );

    // a wild queue of interest appears
    const foundQueue = new Store({
      name: 'test',
      id: 'fake-id',
    });
    foundQueue.set('ack', 0); // fake timers starts at time 0
    foundQueue.set('batchQueue', [
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
      {
        item: 'b',
        time: 0,
        attemptNumber: 0,
      },
    ]);

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.reclaimTimeout);

    batchQueue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(
      batchQueue.timeouts.reclaimTimer + batchQueue.timeouts.reclaimWait * 2,
    );

    expect(batchQueue.processQueueCb).toHaveBeenCalledWith(
      ['a', 'b'],
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );
  });

  it('should take over a batch queued task to main queue if a queue is abandoned', () => {
    // a wild queue of interest appears
    const foundQueue = new Store({
      name: 'test',
      id: 'fake-id',
    });
    foundQueue.set('ack', 0); // fake timers starts at time 0
    foundQueue.set('batchQueue', [
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
      {
        item: 'b',
        time: 0,
        attemptNumber: 0,
      },
    ]);

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.reclaimTimeout);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.reclaimTimer + queue.timeouts.reclaimWait * 2);

    expect(queue.processQueueCb).toHaveBeenNthCalledWith(
      1,
      'a',
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );
    expect(queue.processQueueCb).toHaveBeenNthCalledWith(
      2,
      'b',
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );
  });

  it('should deduplicate ids when reclaiming abandoned queue tasks', () => {
    // set up a fake queue
    const foundQueue = new Store({
      name: 'test',
      id: 'fake-id',
      validKeys: QueueStatuses,
    });
    foundQueue.set('ack', -15000);
    foundQueue.set('queue', [
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
        id: '123',
      },
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
        id: '123',
      },
    ]);

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.reclaimTimeout);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.reclaimTimer + queue.timeouts.reclaimWait * 2);

    expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'a',
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );
  });

  it('should deduplicate ids when reclaiming abandoned in-progress tasks', () => {
    // set up a fake queue
    const foundQueue = new Store({
      name: 'test',
      id: 'fake-id',
      validKeys: QueueStatuses,
    });
    foundQueue.set('ack', -15000);
    foundQueue.set('inProgress', [
      {
        id: '123',
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
      {
        id: '123',
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
    ]);

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.reclaimTimeout);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.reclaimTimer + queue.timeouts.reclaimWait * 2);

    expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'a',
      expect.any(Function),
      1,
      Infinity,
      true,
      true,
    );
  });

  it('should deduplicate ids when reclaiming abandoned batch queue tasks', () => {
    // set up a fake queue
    const foundQueue = new Store({
      name: 'test',
      id: 'fake-id',
      validKeys: QueueStatuses,
    });
    foundQueue.set('ack', -15000);
    foundQueue.set('batchQueue', [
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
        id: '123',
      },
      {
        item: 'b',
        time: 0,
        attemptNumber: 0,
        id: '123',
      },
    ]);

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.reclaimTimeout);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.reclaimTimer + queue.timeouts.reclaimWait * 2);

    expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'a',
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );
  });

  it('should deduplicate ids when reclaiming abandoned batch, in-progress and queue tasks', () => {
    // set up a fake queue
    const foundQueue = new Store({
      name: 'test',
      id: 'fake-id',
      validKeys: QueueStatuses,
    });
    foundQueue.set('ack', -15000);
    foundQueue.set('inProgress', [
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
        id: '123',
      },
      {
        item: 'b',
        time: 0,
        attemptNumber: 0,
        id: '456',
      },
    ]);

    foundQueue.set('queue', [
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
        id: '123',
      },
      {
        item: 'b',
        time: 0,
        attemptNumber: 0,
        id: '456',
      },
    ]);

    foundQueue.set('batchQueue', [
      {
        item: 'c',
        time: 0,
        attemptNumber: 0,
        id: '789',
      },
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
        id: '123',
      },
    ]);

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.reclaimTimeout);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.reclaimTimer + queue.timeouts.reclaimWait * 2);

    expect(queue.processQueueCb).toHaveBeenCalledTimes(3);
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'c',
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'a',
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'b',
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );
  });

  it('should not deduplicate tasks when ids are not set during reclaim', () => {
    // set up a fake queue
    const foundQueue = new Store({
      name: 'test',
      id: 'fake-id',
      validKeys: QueueStatuses,
    });
    foundQueue.set('ack', -15000);
    foundQueue.set('inProgress', [
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
    ]);

    foundQueue.set('queue', [
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
    ]);

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.reclaimTimeout);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.reclaimTimer + queue.timeouts.reclaimWait * 2);

    expect(queue.processQueueCb).toHaveBeenCalledTimes(4);
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'a',
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );
  });

  it('should take over multiple tasks if a queue is abandoned', () => {
    // set up a fake queue
    const foundQueue = new Store({
      name: 'test',
      id: 'fake-id',
      validKeys: QueueStatuses,
    });
    foundQueue.set('ack', -15000);
    foundQueue.set('queue', [
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
    ]);
    foundQueue.set('inProgress', [
      {
        item: 'b',
        time: 1,
        attemptNumber: 0,
      },
    ]);
    foundQueue.set('batchQueue', [
      {
        item: 'c',
        time: 1,
        attemptNumber: 0,
      },
    ]);

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.reclaimTimeout);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.reclaimTimer + queue.timeouts.reclaimWait * 2);

    expect(queue.processQueueCb).toHaveBeenCalledTimes(3);
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'a',
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'b',
      expect.any(Function),
      1,
      Infinity,
      true,
      true,
    );
    expect(queue.processQueueCb).toHaveBeenCalledWith(
      'c',
      expect.any(Function),
      0,
      Infinity,
      true,
      true,
    );
  });

  describe('while using in memory engine', () => {
    beforeEach(() => {
      queue.store.swapQueueStoreToInMemoryEngine();
    });

    it('should take over a queued task if a queue is abandoned', () => {
      // a wild queue of interest appears
      const foundQueue = new Store({
        name: 'test',
        id: 'fake-id',
        validKeys: QueueStatuses,
      });
      foundQueue.set('ack', 0); // fake timers starts at time 0
      foundQueue.set('queue', [
        {
          item: 'a',
          time: 0,
          attemptNumber: 0,
        },
      ]);

      // wait for the queue to expire
      jest.advanceTimersByTime(queue.timeouts.reclaimTimeout);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(queue.timeouts.reclaimTimer + queue.timeouts.reclaimWait * 2);

      expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'a',
        expect.any(Function),
        0,
        Infinity,
        true,
        true,
      );
    });

    it('should take over an in-progress task if a queue is abandoned', () => {
      // set up a fake queue
      const foundQueue = new Store({
        name: 'test',
        id: 'fake-id',
        validKeys: QueueStatuses,
      });
      foundQueue.set('ack', -15000);
      foundQueue.set('inProgress', [
        {
          item: 'a',
          time: 0,
          attemptNumber: 0,
        },
      ]);

      // wait for the queue to expire
      jest.advanceTimersByTime(queue.timeouts.reclaimTimeout);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(queue.timeouts.reclaimTimer + queue.timeouts.reclaimWait * 2);

      expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'a',
        expect.any(Function),
        1,
        Infinity,
        true,
        true,
      );
    });

    it('should take over multiple tasks if a queue is abandoned', () => {
      // set up a fake queue
      const foundQueue = new Store({
        name: 'test',
        id: 'fake-id',
        validKeys: QueueStatuses,
      });
      foundQueue.set('ack', -15000);
      foundQueue.set('queue', [
        {
          item: 'a',
          time: 0,
          attemptNumber: 0,
        },
      ]);
      foundQueue.set('inProgress', [
        {
          item: 'b',
          time: 1,
          attemptNumber: 0,
        },
      ]);

      // wait for the queue to expire
      jest.advanceTimersByTime(queue.timeouts.reclaimTimeout);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(queue.timeouts.reclaimTimer + queue.timeouts.reclaimWait * 2);

      expect(queue.processQueueCb).toHaveBeenCalledTimes(2);
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'a',
        expect.any(Function),
        0,
        Infinity,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'b',
        expect.any(Function),
        1,
        Infinity,
        true,
        true,
      );
    });
  });

  it('should respect maxAttempts when rejected', () => {
    const calls = new Array(100);

    queue.maxItems = calls.length;
    queue.maxAttempts = 2;

    queue.processQueueCb = (item, done) => {
      if (!calls[(item as Record<string, any>).index]) {
        calls[(item as Record<string, any>).index] = 1;
      } else {
        calls[(item as Record<string, any>).index]++;
      }

      done(new Error());
    };

    for (let i = 0; i < calls.length; i += 1) {
      queue.addItem({ index: i });
    }

    queue.start();

    jest.advanceTimersByTime(queue.getRetryDelay(1) + queue.getRetryDelay(2));
    calls.forEach(call => {
      expect(call === queue.maxAttempts + 1).toBeTruthy();
    });
  });

  it('should limit inProgress using maxItems', () => {
    const waiting: DoneCallback[] = [];
    let i;

    queue.maxItems = 100;
    queue.maxAttempts = 2;
    queue.processQueueCb = (_, done) => {
      waiting.push(done);
    };

    // add maxItems * 2 items
    for (i = 0; i < queue.maxItems * 2; i++) {
      queue.addItem({ index: i });
    }

    // the queue should be full
    expect(size(queue).queue).toEqual(queue.maxItems);

    queue.start();
    // the queue is now empty and everything is in progress
    expect(size(queue).queue).toEqual(0);
    expect(size(queue).inProgress).toEqual(queue.maxItems);

    // while the items are in progress let's add maxItems times two items
    for (i = 0; i < queue.maxItems * 2; i += 1) {
      queue.addItem({ index: i });
    }

    // inProgress and queue should be full
    expect(size(queue).queue).toEqual(queue.maxItems);
    expect(size(queue).inProgress).toEqual(queue.maxItems);
    expect(waiting.length).toEqual(queue.maxItems);

    // resolved all waiting items
    while (waiting.length > 0) {
      (waiting.pop() as DoneCallback)();
    }

    // inProgress should now be empty
    expect(size(queue).queue).toEqual(queue.maxItems);
    expect(size(queue).inProgress).toEqual(0);

    // wait for the queue to be processed
    jest.advanceTimersByTime(queue.getRetryDelay(0));

    // items should now be in progress
    expect(size(queue).queue).toEqual(0);
    expect(size(queue).inProgress).toEqual(queue.maxItems);
  });

  it('should configure batch mode as per options', () => {
    let batchQueue = new RetryQueue(
      'batchQueue',
      {
        batch: {} as BatchOpts,
      },
      () => {},
      defaultStoreManager,
    );

    expect(batchQueue.batch).toEqual({ enabled: false });

    batchQueue = new RetryQueue(
      'batchQueue',
      {
        batch: {
          enabled: true,
          maxSize: 1024,
          maxItems: 1,
        },
      },
      () => {},
      defaultStoreManager,
    );

    expect(batchQueue.batch).toEqual({
      enabled: true,
      maxSize: 1024,
      maxItems: 1,
      flushInterval: 60000,
    });

    batchQueue = new RetryQueue(
      'batchQueue',
      {
        batch: {
          enabled: true,
          maxSize: 3,
          maxItems: 20,
        },
      },
      () => {},
      defaultStoreManager,
    );

    expect(batchQueue.batch).toEqual({
      enabled: true,
      maxSize: 3,
      maxItems: 20,
      flushInterval: 60000,
    });

    batchQueue = new RetryQueue(
      'batchQueue',
      {
        batch: {
          enabled: true,
          maxItems: 30,
        },
      },
      () => {},
      defaultStoreManager,
    );

    expect(batchQueue.batch).toEqual({
      enabled: true,
      maxItems: 30,
      maxSize: 524288,
      flushInterval: 60000,
    });

    batchQueue = new RetryQueue(
      'batchQueue',
      {
        batch: {
          enabled: true,
          maxSize: 1000,
        },
      },
      () => {},
      defaultStoreManager,
    );

    expect(batchQueue.batch).toEqual({
      enabled: true,
      maxSize: 1000,
      flushInterval: 60000,
      maxItems: 100,
    });

    batchQueue = new RetryQueue(
      'batchQueue',
      {
        batch: {
          enabled: true,
          maxItems: 30,
          maxSize: 1000,
        },
      },
      () => {},
      defaultStoreManager,
    );

    expect(batchQueue.batch).toEqual({
      enabled: true,
      maxItems: 30,
      maxSize: 1000,
      flushInterval: 60000,
    });
  });

  describe('clear', () => {
    it('should reset all the queue entries upon invoking clear method', () => {
      queue.processQueueCb = (_, done) => {
        // always fail
        done(true);
      };

      queue.addItem('a');
      queue.addItem('b');
      queue.addItem('c');

      expect(queue.getStorageEntry('queue')).toEqual([
        {
          item: 'a',
          attemptNumber: 0,
          time: expect.any(Number),
          id: expect.any(String),
        },
        {
          item: 'b',
          attemptNumber: 0,
          time: expect.any(Number),
          id: expect.any(String),
        },
        {
          item: 'c',
          attemptNumber: 0,
          time: expect.any(Number),
          id: expect.any(String),
        },
      ]);

      queue.start();

      queue.clear();

      // Each entry is attempted twice to delete in case of failures which takes at least 50ms
      // 1 second is added to ensure all the entries are cleared
      jest.advanceTimersByTime(1000);

      expect(queue.getStorageEntry('queue')).toEqual(null);
      expect(queue.getStorageEntry('inProgress')).toEqual(null);
      expect(queue.getStorageEntry('batchQueue')).toEqual(null);
    });
  });
});

describe('end-to-end', () => {
  let queue: RetryQueue;

  beforeEach(() => {
    queue = new RetryQueue(
      'e2e_test',
      {},
      (_, cb) => {
        cb();
      },
      defaultStoreManager,
    );
  });

  afterEach(() => {
    queue.stop();
  });

  it('should run end-to-end', done => {
    queue.processQueueCb = (item, cb) => {
      cb();
      done();
    };
    queue.start();
    queue.addItem({ a: 'b' });
  });

  it('should run end-to-end async', done => {
    queue.processQueueCb = (item, cb) => {
      setTimeout(() => {
        cb();
        done();
      }, 1000);
    };

    queue.start();
    queue.addItem({ a: 'b' });
  });
});
