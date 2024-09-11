/* eslint-disable import/no-extraneous-dependencies */
import { Schedule } from '../../../src/utilities/retryQueue/Schedule';
import { RetryQueue } from '../../../src/utilities/retryQueue/RetryQueue';
import { defaultStoreManager } from '../../../__mocks__/StoreManager';
import { Store } from '../../../__mocks__/Store';
import type {
  DoneCallback,
  QueueData,
  QueueItemData,
} from '../../../src/utilities/retryQueue/types';
import {
  DEFAULT_BACKOFF_DELETION,
  IN_PROGRESS,
  QUEUE,
  QueueStatuses,
} from '../../../src/utilities/retryQueue/constants';

const size = (queue: RetryQueue): { queue: number; inProgress: number } => ({
  queue: (queue.store.get(QUEUE) ?? []).length,
  inProgress: (queue.store.get(IN_PROGRESS) ?? []).length,
});

const DEFAULT_RECLAIM_TIMER_MS = 3000;
const DEFAULT_RECLAIM_TIMEOUT_MS = 10000;
const DEFAULT_RECLAIM_WAIT_MS = 500;

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
        maxAttempts: 2,
        maxItems: 100,
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

  describe('addItem', () => {
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

    it('should dispatch applicable batch items to main queue when size criteria is exceeded', () => {
      const batchQueue = new RetryQueue(
        'test',
        { batch: { enabled: true, maxSize: 4 } },
        jest.fn(),
        defaultStoreManager,
        undefined,
        undefined,
        // eslint-disable-next-line sonarjs/no-nested-functions
        (items: QueueItemData[]) => {
          let size = 0;
          items.forEach(item => {
            size += item.val;
          });
          return size;
        },
      );

      batchQueue.addItem({ a: 'a', val: 1 });
      batchQueue.addItem({ b: 'b', val: 2 });
      batchQueue.addItem({ c: 'c', val: 4 });

      expect(batchQueue.getStorageEntry('queue')).toEqual([
        {
          item: [
            { a: 'a', val: 1 },
            { b: 'b', val: 2 },
          ],
          attemptNumber: 0,
          time: expect.any(Number),
          id: expect.any(String),
        },
      ]);

      expect(batchQueue.getStorageEntry('batchQueue')).toEqual([
        {
          item: { c: 'c', val: 4 },
          attemptNumber: 0,
          time: expect.any(Number),
          id: expect.any(String),
        },
      ]);
    });

    it('should respect maxItems', () => {
      for (let i = 0; i < 105; i += 1) {
        jest.advanceTimersByTime(1);
        queue.addItem(i);
      }

      const storedQueue = queue.getStorageEntry('queue') as QueueData<QueueItemData>;
      expect(storedQueue.length).toEqual(100);
      expect(storedQueue[0].item).toEqual(5); // this is the item that left after shifting 5 items
      expect(storedQueue[99].item).toEqual(104);
    });

    it('should limit inProgress using maxItems', () => {
      const waiting: DoneCallback[] = [];
      let i;

      queue.processQueueCb = (_, done) => {
        waiting.push(done);
      };

      // add maxItems * 2 items
      for (i = 0; i < 100 * 2; i++) {
        queue.addItem({ index: i });
      }

      // the queue should be full
      expect(size(queue).queue).toEqual(100);

      queue.start();

      // the queue is now empty and everything is in progress
      expect(size(queue).queue).toEqual(0);
      expect(size(queue).inProgress).toEqual(100);

      // while the items are in progress let's add maxItems times two items
      for (i = 0; i < 100 * 2; i += 1) {
        queue.addItem({ index: i });
      }

      // inProgress and queue should be full
      expect(size(queue).queue).toEqual(100);
      expect(size(queue).inProgress).toEqual(100);
      expect(waiting.length).toEqual(100);

      // resolved all waiting items
      while (waiting.length > 0) {
        (waiting.pop() as DoneCallback)();
      }

      // inProgress should now be empty
      expect(size(queue).queue).toEqual(100);
      expect(size(queue).inProgress).toEqual(0);

      // wait for the queue to be processed
      jest.advanceTimersByTime(queue.getRetryDelay(0));

      // items should now be in progress
      expect(size(queue).queue).toEqual(0);
      expect(size(queue).inProgress).toEqual(100);
    });
  });

  describe('start', () => {
    it('should process a queued item', () => {
      queue.addItem('a');

      queue.start();

      expect(queue.getStorageEntry('queue')).toEqual(null);

      expect(queue.getStorageEntry('inProgress')).toEqual([
        {
          item: 'a',
          attemptNumber: 0,
          time: expect.any(Number),
          id: expect.any(String),
        },
      ]);

      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'a',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
    });

    it('should flush queued batch events on flush interval', () => {
      const batchQueue = new RetryQueue(
        'test',
        { batch: { enabled: true, maxSize: 2, flushInterval: 1000 } },
        jest.fn(),
        defaultStoreManager,
        undefined,
        undefined,
        (items: QueueItemData[]) => items.length,
      );

      batchQueue.addItem('a');

      batchQueue.start();

      jest.advanceTimersByTime(1000);

      expect(batchQueue.getStorageEntry('batchQueue')).toEqual(null);

      expect(batchQueue.getStorageEntry('inProgress')).toEqual([
        {
          item: ['a'],
          attemptNumber: 0,
          time: expect.any(Number),
          id: expect.any(String),
        },
      ]);

      expect(batchQueue.processQueueCb).toHaveBeenCalledWith(
        ['a'],
        expect.any(Function),
        0,
        Infinity,
        true,
        true,
      );
    });
  });

  describe('queue items processing', () => {
    it('should retry a task with delay if it fails', () => {
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
        2,
        true,
        true,
      );

      // Delay for the first retry
      mockProcessItemCb.mockReset();
      const nextTickDelay = queue.getRetryDelay(1);
      jest.advanceTimersByTime(nextTickDelay);

      expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
      // Attempt number should be incremented
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'a',
        expect.any(Function),
        1,
        2,
        true,
        true,
      );
    });

    it('should respect shouldRetry', () => {
      // Always fail
      const mockProcessItemCb = jest.fn((_, cb) => cb(new Error('no')));
      queue.processQueueCb = mockProcessItemCb;

      queue.start();

      queue.addItem('a');
      expect(mockProcessItemCb).toHaveBeenCalledTimes(1);

      // Delay for the first retry
      jest.advanceTimersByTime(queue.getRetryDelay(1));
      expect(mockProcessItemCb).toHaveBeenCalledTimes(2);

      // Delay for the second retry
      jest.advanceTimersByTime(queue.getRetryDelay(2));
      expect(mockProcessItemCb).toHaveBeenCalledTimes(3);

      expect(queue.getStorageEntry('queue')).toEqual(null);
      expect(queue.getStorageEntry('inProgress')).toEqual(null);

      // Delay for the third retry
      jest.advanceTimersByTime(queue.getRetryDelay(3));
      expect(mockProcessItemCb).toHaveBeenCalledTimes(3);
    });

    it('should respect maxAttempts when rejected', () => {
      const calls = new Array(100);

      queue.processQueueCb = (item, done) => {
        if (!calls[(item as Record<string, any>).index]) {
          calls[(item as Record<string, any>).index] = 1;
        } else {
          calls[(item as Record<string, any>).index] += 1;
        }

        done(new Error());
      };

      for (let i = 0; i < calls.length; i += 1) {
        queue.addItem({ index: i });
      }

      queue.start();

      jest.advanceTimersByTime(queue.getRetryDelay(1) + queue.getRetryDelay(2));
      calls.forEach(call => {
        expect(call === 2 + 1).toBeTruthy();
      });
    });
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
      jest.advanceTimersByTime(DEFAULT_RECLAIM_TIMEOUT_MS);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(DEFAULT_RECLAIM_TIMER_MS + DEFAULT_RECLAIM_WAIT_MS * 2);

      expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'a',
        expect.any(Function),
        0,
        2,
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
      jest.advanceTimersByTime(DEFAULT_RECLAIM_TIMEOUT_MS);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(DEFAULT_RECLAIM_TIMER_MS + DEFAULT_RECLAIM_WAIT_MS * 2);

      expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'a',
        expect.any(Function),
        1,
        2,
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
      jest.advanceTimersByTime(DEFAULT_RECLAIM_TIMEOUT_MS);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(DEFAULT_RECLAIM_TIMER_MS + DEFAULT_RECLAIM_WAIT_MS * 2);

      expect(queue.processQueueCb).toHaveBeenCalledTimes(2);
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'a',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'b',
        expect.any(Function),
        1,
        2,
        true,
        true,
      );
    });
  });

  describe('Reclaim stale queues', () => {
    it('should take over a queued items if a queue is abandoned', () => {
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
      jest.setSystemTime(DEFAULT_RECLAIM_TIMEOUT_MS);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(DEFAULT_RECLAIM_WAIT_MS * 2);

      expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'a',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
    });

    it('should not take over a queued items if a queue is abandoned but not reclaim worthy', () => {
      const foundQueue1 = new Store({
        name: 'test',
        id: 'fake-id-1',
      });
      foundQueue1.set('queue', [
        {
          item: 'a',
          time: 0,
          attemptNumber: 0,
        },
      ]);

      const foundQueue2 = new Store({
        name: 'test',
        id: 'fake-id-1',
      });
      foundQueue2.set('ack', 'xyz'); // invalid ack value
      foundQueue2.set('queue', [
        {
          item: 'b',
          time: 0,
          attemptNumber: 0,
        },
      ]);

      const foundQueue3 = new Store({
        name: 'test',
        id: 'fake-id-1',
      });
      foundQueue3.set('ack', 0); // valid ack value
      foundQueue3.set('queue', [
        {
          item: 'c',
          time: 0,
          attemptNumber: 0,
        },
      ]);

      // Advance by a tick
      // No stale queues are expired at this point
      jest.setSystemTime(1);

      queue.start();

      expect(queue.processQueueCb).not.toHaveBeenCalled();
    });

    it('should not take over a queued items if a queue is abandoned but reclaim parameters are invalid', () => {
      const foundQueue1 = new Store({
        name: 'test',
        id: 'fake-id-1',
      });
      foundQueue1.set('ack', 0); // valid ack value
      foundQueue1.set('queue', [
        {
          item: 'a',
          time: 0,
          attemptNumber: 0,
        },
      ]);

      const foundQueue2 = new Store({
        name: 'test',
        id: 'fake-id-2',
      });
      foundQueue2.set('ack', 0); // valid ack value
      foundQueue2.set('queue', [
        {
          item: 'b',
          time: 0,
          attemptNumber: 0,
        },
      ]);

      // wait for the queue to expire
      jest.setSystemTime(DEFAULT_RECLAIM_TIMEOUT_MS);

      queue.start();

      // Manually reset the reclaim start to an invalid value
      foundQueue1.set('reclaimStart', 'xyz');

      // wait long enough to set the reclaim start
      jest.advanceTimersByTime(DEFAULT_RECLAIM_WAIT_MS);

      // Manually reset the reclaim end to an invalid value
      foundQueue2.set('reclaimEnd', 'xyz');

      // wait long enough to start the reclaiming process
      jest.advanceTimersByTime(DEFAULT_RECLAIM_WAIT_MS);

      // By this time both the queues should have become ineligible for reclaiming
      // as the reclaim parameters are invalid (do not match the current queue ID)

      expect(queue.processQueueCb).not.toHaveBeenCalled();
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
      jest.setSystemTime(DEFAULT_RECLAIM_TIMEOUT_MS);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(DEFAULT_RECLAIM_WAIT_MS * 2);

      expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
      // Attempt number will be incremented by 1 for the in-progress task
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'a',
        expect.any(Function),
        1,
        2,
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
          id: '123',
        },
      ]);

      // wait for the queue to expire
      jest.setSystemTime(DEFAULT_RECLAIM_TIMEOUT_MS);

      batchQueue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(DEFAULT_RECLAIM_WAIT_MS * 2);

      expect(batchQueue.processQueueCb).toHaveBeenCalledTimes(1);
      expect(batchQueue.processQueueCb).toHaveBeenCalledWith(
        ['a', 'b'],
        expect.any(Function),
        0,
        Infinity,
        true,
        true,
      );
    });

    it('should take over a abandoned batch queued task to main queue if batching is not enabled in current queue', () => {
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
      jest.setSystemTime(DEFAULT_RECLAIM_TIMEOUT_MS);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(DEFAULT_RECLAIM_WAIT_MS * 2);

      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        1,
        'a',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        2,
        'b',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
    });

    it('should deduplicate ids when reclaiming abandoned queue', () => {
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
          item: 'b',
          time: 0,
          attemptNumber: 0,
          id: '123',
        },
        {
          item: 'c',
          time: 0,
          attemptNumber: 0,
          id: '1234',
        },
      ]);
      foundQueue.set('inProgress', [
        {
          id: '1235',
          item: 'd',
          time: 0,
          attemptNumber: 0,
        },
        {
          id: '123',
          item: 'e',
          time: 0,
          attemptNumber: 0,
        },
        {
          id: '123',
          item: 'f',
          time: 0,
          attemptNumber: 0,
        },
      ]);
      foundQueue.set('batchQueue', [
        {
          item: 'g',
          time: 0,
          attemptNumber: 0,
          id: '123',
        },
        {
          item: 'h',
          time: 0,
          attemptNumber: 0,
          id: '123',
        },
        {
          item: 'i',
          time: 0,
          attemptNumber: 0,
          id: '123456',
        },
      ]);

      // wait for the queue to expire
      jest.advanceTimersByTime(DEFAULT_RECLAIM_TIMEOUT_MS);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(DEFAULT_RECLAIM_TIMER_MS + DEFAULT_RECLAIM_WAIT_MS * 2);

      expect(queue.processQueueCb).toHaveBeenCalledTimes(4);
      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        1,
        'a',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        2,
        'c',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        3,
        'i',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        4,
        'd',
        expect.any(Function),
        1,
        2,
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
        {
          item: 'a',
          time: 0,
          attemptNumber: 0,
        },
      ]);
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
        {
          item: 'a',
          time: 0,
          attemptNumber: 0,
        },
      ]);
      foundQueue.set('batchQueue', [
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
        {
          item: 'a',
          time: 0,
          attemptNumber: 0,
        },
      ]);

      // wait for the queue to expire
      jest.advanceTimersByTime(DEFAULT_RECLAIM_TIMEOUT_MS);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(DEFAULT_RECLAIM_TIMER_MS + DEFAULT_RECLAIM_WAIT_MS * 2);

      expect(queue.processQueueCb).toHaveBeenCalledTimes(9);
      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        1,
        'a',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        2,
        'a',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        3,
        'a',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        4,
        'a',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        5,
        'a',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        6,
        'a',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        7,
        'a',
        expect.any(Function),
        1,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        8,
        'a',
        expect.any(Function),
        1,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenNthCalledWith(
        9,
        'a',
        expect.any(Function),
        1,
        2,
        true,
        true,
      );
    });

    it('should take over multiple tasks if a queue is abandoned', () => {
      // Delete any existing queue data
      queue.setStorageEntry('queue', null);

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
      jest.advanceTimersByTime(DEFAULT_RECLAIM_TIMEOUT_MS);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(DEFAULT_RECLAIM_WAIT_MS * 2);

      expect(queue.processQueueCb).toHaveBeenCalledTimes(3);
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'a',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'b',
        expect.any(Function),
        1,
        2,
        true,
        true,
      );
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'c',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );

      // Advance time to ensure all the reclaimed entries are deleted
      jest.advanceTimersByTime(DEFAULT_BACKOFF_DELETION * 6);

      // Ensure all the reclaimed entries are deleted
      expect(foundQueue.get('queue')).toEqual(null);
      expect(foundQueue.get('inProgress')).toEqual(null);
      expect(foundQueue.get('batchQueue')).toEqual(null);
      expect(foundQueue.get('ack')).toEqual(null);
      expect(foundQueue.get('reclaimStart')).toEqual(null);
      expect(foundQueue.get('reclaimEnd')).toEqual(null);
    });

    it('should periodically reclaim stale queues', () => {
      queue.start();

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

      // wait for the queue to expire
      jest.setSystemTime(DEFAULT_RECLAIM_TIMEOUT_MS);

      // let the reclaim timer run
      jest.advanceTimersByTime(DEFAULT_RECLAIM_TIMER_MS);

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(DEFAULT_RECLAIM_WAIT_MS * 2);

      expect(queue.processQueueCb).toHaveBeenCalledTimes(1);
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'a',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );

      // Advance time to ensure all the reclaimed entries are deleted
      jest.advanceTimersByTime(1000);

      // Ensure the reclaimed entry is deleted
      expect(foundQueue.get('queue')).toEqual(null);
      expect(foundQueue.get('ack')).toEqual(null);
      expect(foundQueue.get('reclaimStart')).toEqual(null);
      expect(foundQueue.get('reclaimEnd')).toEqual(null);

      // set up another fake queue that pops up randomly
      const foundQueue2 = new Store({
        name: 'test',
        id: 'fake-id-2',
        validKeys: QueueStatuses,
      });
      foundQueue2.set('ack', -15000);
      foundQueue2.set('queue', [
        {
          item: 'b',
          time: 0,
          attemptNumber: 0,
        },
      ]);

      // let the reclaim timer run
      jest.advanceTimersByTime(DEFAULT_RECLAIM_TIMER_MS);

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(DEFAULT_RECLAIM_WAIT_MS * 2);

      expect(queue.processQueueCb).toHaveBeenCalledTimes(2);
      expect(queue.processQueueCb).toHaveBeenCalledWith(
        'b',
        expect.any(Function),
        0,
        2,
        true,
        true,
      );

      // Advance time to ensure all the reclaimed entries are deleted
      jest.advanceTimersByTime(1000);

      // Ensure the reclaimed entry is deleted
      expect(foundQueue2.get('queue')).toEqual(null);
      expect(foundQueue2.get('ack')).toEqual(null);
      expect(foundQueue2.get('reclaimStart')).toEqual(null);
      expect(foundQueue2.get('reclaimEnd')).toEqual(null);
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

describe('E2E', () => {
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
