import { Schedule } from '@rudderstack/analytics-js-plugins/xhrQueue/localstorage-retry/Schedule';
import { Queue } from '@rudderstack/analytics-js-plugins/xhrQueue/localstorage-retry';
import { QueueStatuses } from '@rudderstack/analytics-js-plugins/xhrQueue/localstorage-retry/QueueStatuses';
import { getStorageEngine, Store } from '@rudderstack/analytics-js-plugins/utilities/common';

const size = (queue: Queue): { queue: number; inProgress: number } => ({
  queue: queue.store.get(QueueStatuses.QUEUE).length,
  inProgress: Object.keys(queue.store.get(QueueStatuses.IN_PROGRESS) || {}).length,
});

describe('Queue', () => {
  let queue: Queue;
  // let clock: InstalledClock;
  let schedule: Schedule;
  const engine = getStorageEngine('localStorage');

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    engine.clear();
    schedule = new Schedule();
    schedule.now = () => +new window.Date();

    // Have the default function be a spied success
    queue = new Queue('test', {}, jest.fn());
    queue.schedule = schedule;
  });

  afterEach(() => {
    queue.stop();
    schedule.resetClock();
    jest.setSystemTime(0);
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should run a task', () => {
    queue.start();

    queue.addItem('a');

    expect(queue.fn).toHaveBeenCalled();
    expect(queue.fn).toHaveBeenCalledWith('a', expect.any(Function), 0, Infinity, true);
  });

  it('should retry a task if it fails', () => {
    queue.start();

    // Fail the first time, Succeed the second time
    const mockProcessItemCb = jest
      .fn()
      .mockImplementationOnce((_, cb) => cb(new Error('no')))
      .mockImplementationOnce((_, cb) => cb());
    queue.fn = mockProcessItemCb;

    queue.addItem('a');

    expect(queue.fn).toHaveBeenCalledTimes(1);
    expect(queue.fn).toHaveBeenCalledWith('a', expect.any(Function), 0, Infinity, true);

    // Delay for the first retry
    mockProcessItemCb.mockReset();
    const nextTickDelay = queue.getDelay(1);
    jest.advanceTimersByTime(nextTickDelay);

    expect(queue.fn).toHaveBeenCalledTimes(1);
    expect(queue.fn).toHaveBeenCalledWith('a', expect.any(Function), 1, Infinity, true);
  });

  it('should delay retries', () => {
    const mockProcessItemCb = jest.fn((_, cb) => cb());
    queue.fn = mockProcessItemCb;
    queue.start();

    queue.requeue('b', 1);
    queue.addItem('a');

    expect(queue.fn).toHaveBeenCalledTimes(1);
    expect(queue.fn).toHaveBeenCalledWith('a', expect.any(Function), 0, Infinity, true);

    // Delay for the retry
    mockProcessItemCb.mockReset();
    const nextTickDelay = queue.getDelay(1);
    jest.advanceTimersByTime(nextTickDelay);

    expect(queue.fn).toHaveBeenCalledTimes(1);
    expect(queue.fn).toHaveBeenCalledWith('b', expect.any(Function), 1, Infinity, true);
  });

  it('should respect shouldRetry', () => {
    queue.shouldRetry = (_, attemptNumber) => {
      if (attemptNumber > 2) {
        return false;
      }

      return true;
    };

    const mockProcessItemCb = jest.fn((_, cb) => cb(new Error('no')));

    // Fail
    queue.fn = mockProcessItemCb;
    queue.start();

    // over maxattempts
    queue.requeue('a', 3);
    jest.advanceTimersByTime(queue.getDelay(3));
    expect(queue.fn).toBeCalledTimes(0);

    mockProcessItemCb.mockReset();
    queue.requeue('a', 2);
    jest.advanceTimersByTime(queue.getDelay(2));
    expect(queue.fn).toBeCalledTimes(1);

    // logic based on item state (eg. could be msg timestamp field)
    queue.shouldRetry = item => {
      if (item.shouldRetry === false) {
        return false;
      }

      return true;
    };

    mockProcessItemCb.mockReset();
    queue.requeue({ shouldRetry: false }, 1);
    jest.advanceTimersByTime(queue.getDelay(1));

    expect(queue.fn).toBeCalledTimes(0);
  });

  it('should respect maxItems', () => {
    queue.maxItems = 100;

    for (let i = 0; i < 105; i = i + 1) {
      jest.advanceTimersByTime(1);
      queue.addItem(i);
    }

    const storedQueue = queue.store.get(QueueStatuses.QUEUE);
    expect(storedQueue.length).toEqual(100);
    expect(storedQueue[0].item).toEqual(5);
    expect(storedQueue[99].item).toEqual(104);
  });

  it('should take over a queued task if a queue is abandoned', () => {
    // a wild queue of interest appears
    const foundQueue = new Store(
      {
        name: 'test',
        id: 'fake-id',
        validKeys: QueueStatuses,
      },
      getStorageEngine('localStorage'),
    );
    foundQueue.set(foundQueue.validKeys.ACK, 0); // fake timers starts at time 0
    foundQueue.set(foundQueue.validKeys.QUEUE, [
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
    ]);

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMEOUT);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMER + queue.timeouts.RECLAIM_WAIT * 2);

    expect(queue.fn).toHaveBeenCalledTimes(1);
    expect(queue.fn).toHaveBeenCalledWith('a', expect.any(Function), 0, Infinity, true);
  });

  it('should take over an in-progress task if a queue is abandoned', () => {
    // set up a fake queue
    const foundQueue = new Store(
      {
        name: 'test',
        id: 'fake-id',
        validKeys: QueueStatuses,
      },
      getStorageEngine('localStorage'),
    );
    foundQueue.set(foundQueue.validKeys.ACK, -15000);
    foundQueue.set(foundQueue.validKeys.IN_PROGRESS, {
      'task-id': {
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
    });

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMEOUT);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMER + queue.timeouts.RECLAIM_WAIT * 2);

    expect(queue.fn).toHaveBeenCalledTimes(1);
    expect(queue.fn).toHaveBeenCalledWith('a', expect.any(Function), 1, Infinity, true);
  });

  it('should deduplicate ids when reclaiming abandoned queue tasks', () => {
    // set up a fake queue
    const foundQueue = new Store(
      {
        name: 'test',
        id: 'fake-id',
        validKeys: QueueStatuses,
      },
      getStorageEngine('localStorage'),
    );
    foundQueue.set(foundQueue.validKeys.ACK, -15000);
    foundQueue.set(foundQueue.validKeys.QUEUE, [
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
    jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMEOUT);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMER + queue.timeouts.RECLAIM_WAIT * 2);

    expect(queue.fn).toHaveBeenCalledTimes(1);
    expect(queue.fn).toHaveBeenCalledWith('a', expect.any(Function), 0, Infinity, true);
  });

  it('should deduplicate ids when reclaiming abandoned in-progress tasks', () => {
    // set up a fake queue
    const foundQueue = new Store(
      {
        name: 'test',
        id: 'fake-id',
        validKeys: QueueStatuses,
      },
      getStorageEngine('localStorage'),
    );
    foundQueue.set(foundQueue.validKeys.ACK, -15000);
    foundQueue.set(foundQueue.validKeys.IN_PROGRESS, {
      'task-id-0': {
        item: 'a',
        time: 0,
        attemptNumber: 0,
        id: '123',
      },
      'task-id-1': {
        item: 'a',
        time: 0,
        attemptNumber: 0,
        id: '123',
      },
    });

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMEOUT);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMER + queue.timeouts.RECLAIM_WAIT * 2);

    expect(queue.fn).toHaveBeenCalledTimes(1);
    expect(queue.fn).toHaveBeenCalledWith('a', expect.any(Function), 1, Infinity, true);
  });

  it('should deduplicate ids when reclaiming abandoned in-progress and queue tasks', () => {
    // set up a fake queue
    const foundQueue = new Store(
      {
        name: 'test',
        id: 'fake-id',
        validKeys: QueueStatuses,
      },
      getStorageEngine('localStorage'),
    );
    foundQueue.set(foundQueue.validKeys.ACK, -15000);
    foundQueue.set(foundQueue.validKeys.IN_PROGRESS, {
      'task-id-0': {
        item: 'a',
        time: 0,
        attemptNumber: 0,
        id: '123',
      },
      'task-id-1': {
        item: 'b',
        time: 0,
        attemptNumber: 0,
        id: '456',
      },
    });

    foundQueue.set(foundQueue.validKeys.QUEUE, [
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

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMEOUT);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMER + queue.timeouts.RECLAIM_WAIT * 2);

    expect(queue.fn).toHaveBeenCalledTimes(2);
    expect(queue.fn).toHaveBeenCalledWith('a', expect.any(Function), 0, Infinity, true);
    expect(queue.fn).toHaveBeenCalledWith('b', expect.any(Function), 0, Infinity, true);
  });

  it('should not deduplicate tasks when ids are not set during reclaim', () => {
    // set up a fake queue
    const foundQueue = new Store(
      {
        name: 'test',
        id: 'fake-id',
        validKeys: QueueStatuses,
      },
      getStorageEngine('localStorage'),
    );
    foundQueue.set(foundQueue.validKeys.ACK, -15000);
    foundQueue.set(foundQueue.validKeys.IN_PROGRESS, {
      'task-id-0': {
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
      'task-id-1': {
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
    });

    foundQueue.set(foundQueue.validKeys.QUEUE, [
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
    jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMEOUT);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMER + queue.timeouts.RECLAIM_WAIT * 2);

    expect(queue.fn).toHaveBeenCalledTimes(4);
    expect(queue.fn).toHaveBeenCalledWith('a', expect.any(Function), 0, Infinity, true);
  });

  it('should take over multiple tasks if a queue is abandoned', () => {
    // set up a fake queue
    const foundQueue = new Store(
      {
        name: 'test',
        id: 'fake-id',
        validKeys: QueueStatuses,
      },
      getStorageEngine('localStorage'),
    );
    foundQueue.set(foundQueue.validKeys.ACK, -15000);
    foundQueue.set(foundQueue.validKeys.QUEUE, [
      {
        item: 'a',
        time: 0,
        attemptNumber: 0,
      },
    ]);
    foundQueue.set(foundQueue.validKeys.IN_PROGRESS, {
      'task-id': {
        item: 'b',
        time: 1,
        attemptNumber: 0,
      },
    });

    // wait for the queue to expire
    jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMEOUT);

    queue.start();

    // wait long enough for the other queue to expire and be reclaimed
    jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMER + queue.timeouts.RECLAIM_WAIT * 2);

    expect(queue.fn).toHaveBeenCalledTimes(2);
    expect(queue.fn).toHaveBeenCalledWith('a', expect.any(Function), 0, Infinity, true);
    expect(queue.fn).toHaveBeenCalledWith('b', expect.any(Function), 1, Infinity, true);
  });

  describe('while using in memory engine', () => {
    beforeEach(() => {
      queue.store.swapQueueStoreToInMemoryEngine();
    });

    it('should take over a queued task if a queue is abandoned', () => {
      // a wild queue of interest appears
      const foundQueue = new Store(
        {
          name: 'test',
          id: 'fake-id',
          validKeys: QueueStatuses,
        },
        getStorageEngine('localStorage'),
      );
      foundQueue.set(foundQueue.validKeys.ACK, 0); // fake timers starts at time 0
      foundQueue.set(foundQueue.validKeys.QUEUE, [
        {
          item: 'a',
          time: 0,
          attemptNumber: 0,
        },
      ]);

      // wait for the queue to expire
      jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMEOUT);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMER + queue.timeouts.RECLAIM_WAIT * 2);

      expect(queue.fn).toHaveBeenCalledTimes(1);
      expect(queue.fn).toHaveBeenCalledWith('a', expect.any(Function), 0, Infinity, true);
    });

    it('should take over an in-progress task if a queue is abandoned', () => {
      // set up a fake queue
      const foundQueue = new Store(
        {
          name: 'test',
          id: 'fake-id',
          validKeys: QueueStatuses,
        },
        getStorageEngine('localStorage'),
      );
      foundQueue.set(foundQueue.validKeys.ACK, -15000);
      foundQueue.set(foundQueue.validKeys.IN_PROGRESS, {
        'task-id': {
          item: 'a',
          time: 0,
          attemptNumber: 0,
        },
      });

      // wait for the queue to expire
      jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMEOUT);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMER + queue.timeouts.RECLAIM_WAIT * 2);

      expect(queue.fn).toHaveBeenCalledTimes(1);
      expect(queue.fn).toHaveBeenCalledWith('a', expect.any(Function), 1, Infinity, true);
    });

    it('should take over multiple tasks if a queue is abandoned', () => {
      // set up a fake queue
      const foundQueue = new Store(
        {
          name: 'test',
          id: 'fake-id',
          validKeys: QueueStatuses,
        },
        getStorageEngine('localStorage'),
      );
      foundQueue.set(foundQueue.validKeys.ACK, -15000);
      foundQueue.set(foundQueue.validKeys.QUEUE, [
        {
          item: 'a',
          time: 0,
          attemptNumber: 0,
        },
      ]);
      foundQueue.set(foundQueue.validKeys.IN_PROGRESS, {
        'task-id': {
          item: 'b',
          time: 1,
          attemptNumber: 0,
        },
      });

      // wait for the queue to expire
      jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMEOUT);

      queue.start();

      // wait long enough for the other queue to expire and be reclaimed
      jest.advanceTimersByTime(queue.timeouts.RECLAIM_TIMER + queue.timeouts.RECLAIM_WAIT * 2);

      expect(queue.fn).toHaveBeenCalledTimes(2);
      expect(queue.fn).toHaveBeenCalledWith('a', expect.any(Function), 0, Infinity, true);
      expect(queue.fn).toHaveBeenCalledWith('b', expect.any(Function), 1, Infinity, true);
    });
  });

  it('should respect maxAttempts when rejected', () => {
    const calls = new Array(100);

    queue.maxItems = calls.length;
    queue.maxAttempts = 2;

    queue.fn = (item, done) => {
      if (!calls[item.index]) {
        calls[item.index] = 1;
      } else {
        calls[item.index]++;
      }

      done(new Error());
    };

    for (let i = 0; i < calls.length; i = i + 1) {
      queue.addItem({ index: i });
    }

    queue.start();

    jest.advanceTimersByTime(queue.getDelay(1) + queue.getDelay(2));
    calls.forEach(call => {
      expect(call === queue.maxAttempts + 1).toBeTruthy();
    });
  });

  it('should limit inProgress using maxItems', () => {
    const waiting: Function[] = [];
    let i;

    queue.maxItems = 100;
    queue.maxAttempts = 2;
    queue.fn = (_, done) => {
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
    for (i = 0; i < queue.maxItems * 2; i = i + 1) {
      queue.addItem({ index: i });
    }

    // inProgress and queue should be full
    expect(size(queue).queue).toEqual(queue.maxItems);
    expect(size(queue).inProgress).toEqual(queue.maxItems);
    expect(waiting.length).toEqual(queue.maxItems);

    // resolved all waiting items
    while (waiting.length > 0) {
      waiting.pop()();
    }

    // inProgress should now be empty
    expect(size(queue).queue).toEqual(queue.maxItems);
    expect(size(queue).inProgress).toEqual(0);

    // wait for the queue to be processed
    jest.advanceTimersByTime(queue.getDelay(0));

    // items should now be in progress
    expect(size(queue).queue).toEqual(0);
    expect(size(queue).inProgress).toEqual(queue.maxItems);
  });
});

describe('events', () => {
  let queue: Queue;
  beforeEach(() => {
    queue = new Queue('events', (_, cb) => {
      cb();
    });
  });

  afterEach(() => {
    queue.stop();
  });

  it('should emit processed with response, and item', done => {
    queue.fn = (item, cb) => {
      cb(null, { text: 'ok' });
    };
    queue.on('processed', (err, res, item) => {
      if (err) done(err);
      expect(item.a).toEqual('b');
      expect(res.text).toEqual('ok');
      done();
    });
    queue.start();
    queue.addItem({ a: 'b' });
  });

  it('should include errors in callback to processed event', done => {
    queue.fn = (item, cb) => {
      cb(new Error('fail'));
    };

    queue.on('processed', (err, res, item) => {
      expect(item.a).toEqual('c');
      expect(err && err.message).toEqual('fail');
      done();
    });

    queue.start();
    queue.addItem({ a: 'c' });
  });

  it('should emit discard if the message fails shouldRetry', done => {
    queue.fn = (item, cb) => {
      cb(new Error('no'));
    };
    queue.shouldRetry = (item, attemptNumber) => attemptNumber < 2;
    queue.on('discard', (item: Record<string, any>, attempts: number) => {
      expect(item.a).toEqual('b');
      expect(attempts).toEqual(2);
      done();
    });
    queue.start();
    queue.addItem({ a: 'b' });
  });
});

describe('end-to-end', () => {
  let queue: Queue;
  beforeEach(() => {
    queue = new Queue('e2e_test', (_, cb) => {
      cb();
    });
  });

  afterEach(() => {
    queue.stop();
  });

  it('should run end-to-end', done => {
    queue.fn = (item, cb) => {
      cb();
      done();
    };
    queue.start();
    queue.addItem({ a: 'b' });
  });

  it('should run end-to-end async', done => {
    queue.fn = (item, cb) => {
      setTimeout(() => {
        cb();
      }, 1000);
    };
    queue.on('processed', () => {
      done();
    });

    queue.start();
    queue.addItem({ a: 'b' });
  });
});
