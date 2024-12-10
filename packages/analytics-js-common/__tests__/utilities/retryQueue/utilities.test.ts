import type { QueueItem, QueueItemData } from '../../../src/utilities/retryQueue/types';
import {
  sortByTime,
  findOtherQueues,
  getNumberOptionVal,
  clearQueueEntries,
} from '../../../src/utilities/retryQueue/utilities';
import { Store } from '../../../__mocks__/Store';
import { defaultStoreManager } from '../../../__mocks__/StoreManager';
import { defaultLogger } from '../../../__mocks__/Logger';

describe('utilities', () => {
  describe('sortByTime', () => {
    it('should sort the items by time', () => {
      const items = [{ time: 3 }, { time: 1 }, { time: 2 }] as QueueItem<QueueItemData>[];
      const sortedItems = items.slice().sort(sortByTime);
      expect(sortedItems).toEqual([{ time: 1 }, { time: 2 }, { time: 3 }]);
    });

    it('should sort the items by time in descending order', () => {
      const items = [{ time: 3 }, { time: 1 }, { time: 2 }] as QueueItem<QueueItemData>[];
      // eslint-disable-next-line sonarjs/arguments-order
      const sortedItems = items.slice().sort((a, b) => sortByTime(b, a));
      expect(sortedItems).toEqual([{ time: 3 }, { time: 2 }, { time: 1 }]);
    });

    it('should sort the items with the same time', () => {
      const items = [
        { time: 2, attempt: 1 },
        { time: 1 },
        { time: 2 },
      ] as QueueItem<QueueItemData>[];
      const sortedItems = items.slice().sort(sortByTime);
      expect(sortedItems).toEqual([{ time: 1 }, { time: 2, attempt: 1 }, { time: 2 }]);
    });
  });

  describe('findOtherQueues', () => {
    afterEach(() => {
      window.localStorage.clear();
    });

    it('should find the other queues', () => {
      const store1 = new Store({
        name: 'test',
        id: '1',
      });
      store1.set('ack', 'value1');

      const store2 = new Store({
        name: 'test',
        id: '2',
      });
      store2.set('ack', 'value2');

      const curStore = new Store({
        name: 'test',
        id: '3',
      });

      const otherQueues = findOtherQueues(
        curStore.getOriginalEngine(),
        defaultStoreManager,
        'test',
        '3',
      );
      expect(otherQueues[0].id).toBe('1');
      expect(otherQueues[1].id).toBe('2');
    });

    it('should not find the other queues if the name does not match', () => {
      const store1 = new Store({
        name: 'test',
        id: '1',
      });
      store1.set('ack', 'value1');

      const store2 = new Store({
        name: 'test',
        id: '2',
      });
      store2.set('ack', 'value2');

      const curStore = new Store({
        name: 'test2',
        id: '3',
      });

      const otherQueues = findOtherQueues(
        curStore.getOriginalEngine(),
        defaultStoreManager,
        'test2',
        '3',
      );
      expect(otherQueues).toEqual([]);
    });

    it('should not find the other queues if the id matches', () => {
      const store1 = new Store({
        name: 'test',
        id: '3',
      });
      store1.set('ack', 'value1');

      const store2 = new Store({
        name: 'test',
        id: '3',
      });
      store2.set('ack', 'value2');

      const curStore = new Store({
        name: 'test',
        id: '3',
      });

      const otherQueues = findOtherQueues(
        curStore.getOriginalEngine(),
        defaultStoreManager,
        'test',
        '3',
      );
      expect(otherQueues).toEqual([]);
    });

    it('should not find the other queues if the ack key is not found', () => {
      const store1 = new Store({
        name: 'test',
        id: '1',
      });
      store1.set('ack1', 'value1');

      const store2 = new Store({
        name: 'test',
        id: '2',
      });
      store2.set('ack2', 'value2');

      const curStore = new Store({
        name: 'test',
        id: '3',
      });

      const otherQueues = findOtherQueues(
        curStore.getOriginalEngine(),
        defaultStoreManager,
        'test',
        '3',
      );
      expect(otherQueues).toEqual([]);
    });

    it('should not find other queues if the ack key is not in the correct format', () => {
      // queue id is missing in the key
      window.localStorage.setItem('test.ack', 'value1');

      const curStore = new Store({
        name: 'test',
        id: '3',
      });

      const otherQueues = findOtherQueues(
        curStore.getOriginalEngine(),
        defaultStoreManager,
        'test',
        '3',
      );
      expect(otherQueues).toEqual([]);
    });
  });

  describe('getNumberOptionVal', () => {
    it('should return the default value if the option is not a number', () => {
      expect(getNumberOptionVal('test', 1)).toBe(1);
    });

    it('should return the option value if it is a number', () => {
      expect(getNumberOptionVal(2, 1)).toBe(2);
    });

    it('should return the option value if it is within the min and max value', () => {
      expect(getNumberOptionVal(3, 2, 1, 4)).toBe(3);
    });

    it('should return the min value if the option is less than the min value', () => {
      expect(getNumberOptionVal(0, 2, 1, 4)).toBe(1);
    });

    it('should return the min value if the option is equal to the min value', () => {
      expect(getNumberOptionVal(1, 2, 1, 4)).toBe(1);
    });

    it('should return the max value if the option is greater than the max value', () => {
      expect(getNumberOptionVal(5, 2, 1, 4)).toBe(4);
    });

    it('should return the max value if the option is equal to the max value', () => {
      expect(getNumberOptionVal(4, 2, 1, 4)).toBe(4);
    });

    it('should return the option value if it is within the min and max value', () => {
      expect(getNumberOptionVal(3, 2, 1, 4)).toBe(3);
    });
  });

  describe('clearQueueEntries', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.setSystemTime(0);
      jest.clearAllTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    const DEFAULT_BACKOFF = 1;
    const RETRY_DELAY = 40;
    // This value is well over the time it should take to clear the entries
    // including retries with backoff
    const MAX_TIME_TO_CLEAR = 1000;
    it('should clear the queue entries', done => {
      const store = new Store({
        name: 'test',
        id: '1',
      });
      store.set('inProgress', 'value1');
      store.set('queue', 'value2');
      store.set('ack', 'value3');
      store.set('batchQueue', 'value4');
      store.set('reclaimStart', 'value5');
      store.set('reclaimEnd', 'value6');

      clearQueueEntries(store);

      setTimeout(() => {
        expect(store.get('inProgress')).toBe(null);
        expect(store.get('queue')).toBe(null);
        expect(store.get('ack')).toBe(null);
        expect(store.get('batchQueue')).toBe(null);
        expect(store.get('reclaimStart')).toBe(null);
        expect(store.get('reclaimEnd')).toBe(null);
        done();
      }, MAX_TIME_TO_CLEAR);

      jest.advanceTimersByTime(MAX_TIME_TO_CLEAR);
    });

    it('should clear the queue entries with a backoff time', () => {
      const store = new Store({
        name: 'test',
        id: '1',
      });
      store.set('queue', 'value1');
      store.set('ack', 'value2');

      clearQueueEntries(store, undefined, 2);

      setTimeout(() => {
        expect(store.get('queue')).toBe(null);
        expect(store.get('ack')).toBe(null);
      }, MAX_TIME_TO_CLEAR);

      jest.advanceTimersByTime(MAX_TIME_TO_CLEAR);
    });

    it('should clear only the standard queue entries', () => {
      const store = new Store({
        name: 'test',
        id: '1',
      });
      store.set('inProgress', 'value1');
      store.set('queue', 'value2');
      store.set('ack', 'value3');
      store.set('batchQueue', 'value4');
      store.set('reclaimStart', 'value5');
      store.set('reclaimEnd', 'value6');
      // some custom key
      store.set('custom', 'value7');

      clearQueueEntries(store, undefined, 1);

      setTimeout(() => {
        expect(store.get('inProgress')).toBe(null);
        expect(store.get('queue')).toBe(null);
        expect(store.get('ack')).toBe(null);
        expect(store.get('batchQueue')).toBe(null);
        expect(store.get('reclaimStart')).toBe(null);
        expect(store.get('reclaimEnd')).toBe(null);
        expect(store.get('custom')).toBe('value7');
      }, MAX_TIME_TO_CLEAR);

      jest.advanceTimersByTime(MAX_TIME_TO_CLEAR);
    });

    it('should clear only the current store entries', () => {
      const store1 = new Store({
        name: 'test',
        id: '1',
      });
      store1.set('queue', 'value1');
      store1.set('ack', 'value2');

      const store2 = new Store({
        name: 'test',
        id: '2',
      });
      store2.set('queue', 'value3');
      store2.set('ack', 'value4');

      clearQueueEntries(store1);

      setTimeout(() => {
        expect(store1.get('queue')).toBe(null);
        expect(store1.get('ack')).toBe(null);
        expect(store2.get('queue')).toBe('value3');
        expect(store2.get('ack')).toBe('value4');
      }, MAX_TIME_TO_CLEAR);

      jest.advanceTimersByTime(MAX_TIME_TO_CLEAR);
    });

    it('should log an error if an error occurs while clearing the entries', () => {
      const store = new Store({
        name: 'test',
        id: '1',
      });
      store.remove = jest.fn(() => {
        throw new Error('error');
      });

      store.set('inProgress', 'value1');
      store.set('queue', 'value2');
      store.set('ack', 'value3');
      store.set('batchQueue', 'value4');
      store.set('reclaimStart', 'value5');
      store.set('reclaimEnd', 'value6');

      const logger = defaultLogger;

      clearQueueEntries(store, logger);

      setTimeout(() => {
        expect(logger.error).toHaveBeenCalledTimes(6);
        expect(logger.error).toHaveBeenNthCalledWith(
          1,
          'RetryQueue:: Failed to remove local storage entry "inProgress" (attempt: 1).',
          new Error('error'),
        );
        expect(logger.error).toHaveBeenNthCalledWith(
          2,
          'RetryQueue:: Failed to remove local storage entry "queue" (attempt: 1).',
          new Error('error'),
        );
        expect(logger.error).toHaveBeenNthCalledWith(
          3,
          'RetryQueue:: Failed to remove local storage entry "batchQueue" (attempt: 1).',
          new Error('error'),
        );
        expect(logger.error).toHaveBeenNthCalledWith(
          4,
          'RetryQueue:: Failed to remove local storage entry "reclaimStart" (attempt: 1).',
          new Error('error'),
        );
        expect(logger.error).toHaveBeenNthCalledWith(
          5,
          'RetryQueue:: Failed to remove local storage entry "reclaimEnd" (attempt: 1).',
          new Error('error'),
        );
        expect(logger.error).toHaveBeenNthCalledWith(
          6,
          'RetryQueue:: Failed to remove local storage entry "ack" (attempt: 1).',
          new Error('error'),
        );

        // The entries should still be there
        expect(store.get('inProgress')).toBe('value1');
        expect(store.get('queue')).toBe('value2');
        expect(store.get('ack')).toBe('value3');
        expect(store.get('batchQueue')).toBe('value4');
        expect(store.get('reclaimStart')).toBe('value5');
        expect(store.get('reclaimEnd')).toBe('value6');
      }, MAX_TIME_TO_CLEAR);

      jest.advanceTimersByTime(MAX_TIME_TO_CLEAR);
    });

    it('should retry clearing an entry if the storage is busy', () => {
      const store = new Store({
        name: 'test',
        id: '1',
      });

      const originalStoreRemove = store.remove;
      store.remove = jest.fn(() => {
        const error = new Error('Store issue');
        error.name = 'NS_ERROR_STORAGE_BUSY';
        throw error;
      });

      store.set('inProgress', 'value1');
      store.set('queue', 'value2');
      store.set('ack', 'value3');
      store.set('batchQueue', 'value4');
      store.set('reclaimStart', 'value5');
      store.set('reclaimEnd', 'value6');

      clearQueueEntries(store);

      // Advance the time by backoff
      jest.advanceTimersByTime(DEFAULT_BACKOFF);

      // The value is not cleared yet
      expect(store.get('inProgress')).toBe('value1');

      // Restore the original store remove function
      store.remove = originalStoreRemove;

      // Advance the time to retry clearing the entries
      jest.advanceTimersByTime(DEFAULT_BACKOFF + RETRY_DELAY);

      // Expect that the inProgress entry is deleted now
      expect(store.get('inProgress')).toBe(null);

      // The other entries should still be there
      expect(store.get('queue')).toBe('value2');
      expect(store.get('ack')).toBe('value3');
      expect(store.get('batchQueue')).toBe('value4');
      expect(store.get('reclaimStart')).toBe('value5');
      expect(store.get('reclaimEnd')).toBe('value6');

      // Mock the store remove function to throw an error again
      store.remove = jest.fn(() => {
        const error = new Error('Store issue');
        error.code = 'NS_ERROR_STORAGE_BUSY';
        throw error;
      });

      // Advance the time to clear the next entry
      jest.advanceTimersByTime(DEFAULT_BACKOFF);

      expect(store.get('queue')).toBe('value2');

      // Restore the original store remove function
      store.remove = originalStoreRemove;

      // Advance the time to retry clearing the entries
      jest.advanceTimersByTime(DEFAULT_BACKOFF + RETRY_DELAY);

      // Expect that the queue entry is deleted now
      expect(store.get('queue')).toBe(null);

      // The other entries should still be there
      expect(store.get('ack')).toBe('value3');
      expect(store.get('batchQueue')).toBe('value4');
      expect(store.get('reclaimStart')).toBe('value5');
      expect(store.get('reclaimEnd')).toBe('value6');

      // Mock the store remove function to throw an error again
      store.remove = jest.fn(() => {
        const error = new Error('Store issue');
        error.code = 0x80630001;
        throw error;
      });

      // Advance the time to clear the next entry
      jest.advanceTimersByTime(DEFAULT_BACKOFF);

      expect(store.get('batchQueue')).toBe('value4');

      // Restore the original store remove function
      store.remove = originalStoreRemove;

      // Advance the time to retry clearing the entries
      jest.advanceTimersByTime(DEFAULT_BACKOFF + RETRY_DELAY);

      // Expect that the queue entry is deleted now
      expect(store.get('batchQueue')).toBe(null);

      // The other entries should still be there
      expect(store.get('ack')).toBe('value3');
      expect(store.get('reclaimStart')).toBe('value5');
      expect(store.get('reclaimEnd')).toBe('value6');

      // Advance the time to clear all the remaining entries
      jest.advanceTimersByTime(MAX_TIME_TO_CLEAR);

      expect(store.get('ack')).toBe(null);
      expect(store.get('reclaimStart')).toBe(null);
      expect(store.get('reclaimEnd')).toBe(null);
    });

    it('should give up retry clearing an entry after the max attempts', () => {
      const store = new Store({
        name: 'test',
        id: '1',
      });

      const originalStoreRemove = store.remove;
      store.remove = jest.fn(() => {
        const error = new Error('Store issue');
        error.name = 'NS_ERROR_STORAGE_BUSY';
        throw error;
      });

      store.set('inProgress', 'value1');
      store.set('queue', 'value2');
      store.set('ack', 'value3');
      store.set('batchQueue', 'value4');
      store.set('reclaimStart', 'value5');
      store.set('reclaimEnd', 'value6');

      clearQueueEntries(store, defaultLogger);

      // Advance the time by backoff
      jest.advanceTimersByTime(DEFAULT_BACKOFF);

      // The value is not cleared yet
      expect(store.get('inProgress')).toBe('value1');

      // Advance the time to retry clearing the entry
      jest.advanceTimersByTime(DEFAULT_BACKOFF + RETRY_DELAY);

      // Expect that the inProgress entry is not deleted
      expect(store.get('inProgress')).toBe('value1');

      expect(defaultLogger.error).toHaveBeenCalledTimes(1);
      expect(defaultLogger.error).toHaveBeenCalledWith(
        'RetryQueue:: Failed to remove local storage entry "inProgress" (attempt: 2).',
        expect.any(Error),
      );

      // At this point, even the remaining entries should not be cleared
      expect(store.get('queue')).toBe('value2');
      expect(store.get('ack')).toBe('value3');
      expect(store.get('batchQueue')).toBe('value4');
      expect(store.get('reclaimStart')).toBe('value5');
      expect(store.get('reclaimEnd')).toBe('value6');

      // Restore the original store remove function
      store.remove = originalStoreRemove;

      // Advance the time to clear the next entry
      jest.advanceTimersByTime(DEFAULT_BACKOFF);

      // Expect that the queue entry is deleted now
      expect(store.get('queue')).toBe(null);

      // The other entries should still be there including the inProgress entry
      expect(store.get('ack')).toBe('value3');
      expect(store.get('batchQueue')).toBe('value4');
      expect(store.get('reclaimStart')).toBe('value5');
      expect(store.get('reclaimEnd')).toBe('value6');
      expect(store.get('inProgress')).toBe('value1');

      // Advance the time to clear all the remaining entries
      jest.advanceTimersByTime(MAX_TIME_TO_CLEAR);

      // Expect all the entries are cleared except the inProgress entry
      expect(store.get('inProgress')).toBe('value1');
      expect(store.get('ack')).toBe(null);
      expect(store.get('batchQueue')).toBe(null);
      expect(store.get('reclaimStart')).toBe(null);
      expect(store.get('reclaimEnd')).toBe(null);
      expect(store.get('queue')).toBe(null);
    });
  });
});
