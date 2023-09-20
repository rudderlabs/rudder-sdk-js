import { isObjectLiteralAndNotNull } from '@rudderstack/analytics-js-common/utilities/object';
import { QueueStatuses } from '@rudderstack/analytics-js-common/constants/QueueStatuses';
import { IStore, IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { checks, storages } from '../../shared-chunks/common';
import { uuId } from '../../shared-chunks/eventsDelivery';
import {
  IQueue,
  QueueItem,
  QueueItemData,
  QueueBatchItemsSizeCalculatorCallback,
  QueueProcessCallback,
} from '../../types/plugins';
import { Schedule, ScheduleModes } from './Schedule';
import { RETRY_QUEUE_PROCESS_ERROR } from './logMessages';
import {
  QueueTimeouts,
  QueueBackoff,
  BatchOptions,
  QueueOptions,
  InProgressQueueItem,
} from './types';
import {
  DEFAULT_MAX_ITEMS,
  DEFAULT_MAX_RETRY_ATTEMPTS,
  DEFAULT_MAX_BATCH_SIZE_BYTES,
  DEFAULT_MAX_BATCH_ITEMS,
  DEFAULT_MIN_RETRY_DELAY_MS,
  DEFAULT_MAX_RETRY_DELAY_MS,
  DEFAULT_BACKOFF_FACTOR,
  DEFAULT_BACKOFF_JITTER,
  DEFAULT_ACK_TIMER_MS,
  DEFAULT_RECLAIM_TIMER_MS,
  DEFAULT_RECLAIM_TIMEOUT_MS,
  DEFAULT_RECLAIM_WAIT_MS,
  DEFAULT_BATCH_FLUSH_INTERVAL_MS,
} from './constants';

const sortByTime = (a: QueueItem, b: QueueItem) => a.time - b.time;

const RETRY_QUEUE = 'RetryQueue';

/**
 * Constructs a RetryQueue backed by localStorage
 *
 * @constructor
 * @param {String} name The name of the queue. Will be used to find abandoned queues and retry their items
 * @param {Object} [opts] Optional argument to override `maxItems`, `maxAttempts`, `minRetryDelay, `maxRetryDelay`, `backoffFactor` and `backoffJitter`.
 * @param {QueueProcessCallback} fn The function to call in order to process an item added to the queue
 */
class RetryQueue implements IQueue<QueueItemData> {
  name: string;
  id: string;
  processQueueCb: QueueProcessCallback<QueueItemData>;
  store: IStore;
  storeManager: IStoreManager;
  maxItems: number;
  timeouts: QueueTimeouts;
  scheduleTimeoutActive: boolean;

  maxAttempts: number;
  backoff: QueueBackoff;
  schedule: Schedule;
  processId: string;
  logger?: ILogger;
  enableBatching: boolean;
  batch?: BatchOptions;
  flushQueueTimeout?: number;
  batchDispatchInProgress: boolean;
  queueBatchItemsSizeCalculatorCb?: QueueBatchItemsSizeCalculatorCallback<QueueItemData>;

  constructor(
    name: string,
    options: QueueOptions,
    queueProcessCb: QueueProcessCallback,
    storeManager: IStoreManager,
    storageType: StorageType = storages.LOCAL_STORAGE,
    logger?: ILogger,
    queueBatchItemsSizeCalculatorCb?: QueueBatchItemsSizeCalculatorCallback,
  ) {
    this.storeManager = storeManager;
    this.name = name;
    this.id = uuId.generateUUID();
    this.processQueueCb = queueProcessCb;
    this.maxItems = options.maxItems || DEFAULT_MAX_ITEMS;
    this.maxAttempts = options.maxAttempts || DEFAULT_MAX_RETRY_ATTEMPTS;
    this.enableBatching = isObjectLiteralAndNotNull(options.batch);

    this.queueBatchItemsSizeCalculatorCb = queueBatchItemsSizeCalculatorCb;
    this.configureBatchingOptions(options);
    this.batchDispatchInProgress = false;

    this.logger = logger;

    this.backoff = {
      minRetryDelay: options.minRetryDelay || DEFAULT_MIN_RETRY_DELAY_MS,
      maxRetryDelay: options.maxRetryDelay || DEFAULT_MAX_RETRY_DELAY_MS,
      factor: options.backoffFactor || DEFAULT_BACKOFF_FACTOR,
      jitter: options.backoffJitter || DEFAULT_BACKOFF_JITTER,
    };

    // painstakingly tuned. that's why they're not "easily" configurable
    this.timeouts = {
      ackTimer: DEFAULT_ACK_TIMER_MS,
      reclaimTimer: DEFAULT_RECLAIM_TIMER_MS,
      reclaimTimeout: DEFAULT_RECLAIM_TIMEOUT_MS,
      reclaimWait: DEFAULT_RECLAIM_WAIT_MS,
    };

    this.schedule = new Schedule();
    this.processId = '0';

    // Set up our empty queues
    this.store = this.storeManager.setStore({
      id: this.id,
      name: this.name,
      validKeys: QueueStatuses,
      type: storageType,
    });
    this.setQueue(QueueStatuses.IN_PROGRESS, {});
    this.setQueue(QueueStatuses.QUEUE, []);
    this.setQueue(QueueStatuses.BATCH_QUEUE, []);

    // bind recurring tasks for ease of use
    this.ack = this.ack.bind(this);
    this.checkReclaim = this.checkReclaim.bind(this);
    this.processHead = this.processHead.bind(this);
    this.flushQueue = this.flushQueue.bind(this);

    this.attachListeners();

    this.scheduleTimeoutActive = false;
  }

  configureBatchingOptions(options: QueueOptions) {
    if (this.enableBatching) {
      this.batch = options.batch as BatchOptions;
      this.enableBatching = false;
      if (checks.isDefined(this.batch.maxSize)) {
        this.batch.maxSize = +(this.batch.maxSize as number) || DEFAULT_MAX_BATCH_SIZE_BYTES;
        this.enableBatching = true;
      }

      if (checks.isDefined(this.batch.maxItems)) {
        this.batch.maxItems = +(this.batch.maxItems as number) || DEFAULT_MAX_BATCH_ITEMS;
        this.enableBatching = true;
      }

      if (checks.isDefined(this.batch.flushInterval)) {
        this.batch.flushInterval =
          +(this.batch.flushInterval as number) || DEFAULT_BATCH_FLUSH_INTERVAL_MS;
        this.attachListeners();
        this.enableBatching = true;
      }
    }
  }

  attachListeners() {
    (globalThis as typeof window).addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushQueue();
      }
    });
  }

  getQueue(name?: string): Nullable<QueueItem<QueueItemData>[] | Record<string, any> | number> {
    return this.store.get(name ?? this.name);
  }

  // TODO: fix the type of different queues to be the same if possible
  setQueue(
    name?: string,
    value?: Nullable<QueueItem<QueueItemData>[] | Record<string, any>> | number,
  ) {
    this.store.set(name ?? this.name, value ?? []);
  }

  /**
   * Stops processing the queue
   */
  stop() {
    this.schedule.cancelAll();
    (globalThis as typeof window).clearTimeout(this.flushQueueTimeout);
    this.scheduleTimeoutActive = false;
  }

  /**
   * Starts processing the queue
   */
  start() {
    if (this.scheduleTimeoutActive) {
      this.stop();
    }

    this.scheduleTimeoutActive = true;
    this.configureFlushTimeoutHandler();
    this.ack();
    this.checkReclaim();
    this.processHead();
  }

  private configureFlushTimeoutHandler() {
    if (this.enableBatching && this.batch?.flushInterval) {
      (globalThis as typeof window).clearTimeout(this.flushQueueTimeout);
      this.flushQueueTimeout = (globalThis as typeof window).setTimeout(
        this.flushQueue,
        this.batch?.flushInterval,
      );
    }
  }

  flushQueue() {
    if (!this.batchDispatchInProgress) {
      this.batchDispatchInProgress = true;
      let batchQueue = (this.getQueue(QueueStatuses.BATCH_QUEUE) as Nullable<QueueItem[]>) ?? [];
      if (batchQueue.length > 0) {
        batchQueue = batchQueue.slice(-batchQueue.length);

        const batchItems = batchQueue.map(queueItem => queueItem.item);
        const batchEntry = this.generateQueueItem(batchItems);

        this.setQueue(QueueStatuses.BATCH_QUEUE, []);

        this.pushToMainQueue(batchEntry);
      }
      this.batchDispatchInProgress = false;
      this.configureFlushTimeoutHandler();
    }
  }

  /**
   * Decides whether to retry. Overridable.
   *
   * @param {Object} item The item being processed
   * @param {Number} attemptNumber The attemptNumber (1 for first retry)
   * @return {Boolean} Whether to requeue the message
   */
  shouldRetry(item: QueueItemData, attemptNumber: number): boolean {
    return attemptNumber <= this.maxAttempts;
  }

  /**
   * Calculates the delay (in ms) for a retry attempt
   *
   * @param {Number} attemptNumber The attemptNumber (1 for first retry)
   * @return {Number} The delay in milliseconds to wait before attempting a retry
   */
  getDelay(attemptNumber: number): number {
    let ms = this.backoff.minRetryDelay * this.backoff.factor ** attemptNumber;

    if (this.backoff.jitter) {
      const rand = Math.random();
      const deviation = Math.floor(rand * this.backoff.jitter * ms);

      if (Math.floor(rand * 10) < 5) {
        ms -= deviation;
      } else {
        ms += deviation;
      }
    }

    return Number(Math.min(ms, this.backoff.maxRetryDelay).toPrecision(1));
  }

  enqueue(entry: QueueItem<QueueItemData>) {
    let curEntry: QueueItem<QueueItemData> | undefined;
    if (this.enableBatching) {
      let batchQueue = (this.getQueue(QueueStatuses.BATCH_QUEUE) as Nullable<QueueItem[]>) ?? [];
      if (!this.batchDispatchInProgress) {
        this.batchDispatchInProgress = true;
        batchQueue = batchQueue.slice(-batchQueue.length);
        batchQueue.push(entry);

        const batchDispatchInfo = this.getBatchDispatchInfo(batchQueue);
        // if batch criteria is met, queue the batch events to the main queue and clear batch queue
        if (batchDispatchInfo.criteriaMet || batchDispatchInfo.criteriaExceeded) {
          let batchItems;
          if (batchDispatchInfo.criteriaExceeded) {
            batchItems = batchQueue
              .slice(0, batchQueue.length - 1)
              .map(queueItem => queueItem.item);
            batchQueue = [entry];
          } else {
            batchItems = batchQueue.map(queueItem => queueItem.item);
            batchQueue = [];
          }
          curEntry = this.generateQueueItem(batchItems);
        }
        this.batchDispatchInProgress = false;

        this.configureFlushTimeoutHandler();
      } else {
        batchQueue.push(entry);
      }
      this.setQueue(QueueStatuses.BATCH_QUEUE, batchQueue);
    } else {
      curEntry = entry;
    }

    // when batching is enabled, `curEntry` could be `undefined` if the batch criteria is not met
    if (curEntry) {
      this.pushToMainQueue(curEntry);
    }
  }

  private pushToMainQueue(curEntry: QueueItem<QueueItemData>) {
    let queue = (this.getQueue(QueueStatuses.QUEUE) as Nullable<QueueItem<QueueItemData>[]>) ?? [];

    queue = queue.slice(-(this.maxItems - 1));
    queue.push(curEntry);
    queue = queue.sort(sortByTime);

    this.setQueue(QueueStatuses.QUEUE, queue);

    if (this.scheduleTimeoutActive) {
      this.processHead();
    }
  }

  /**
   * Adds an item to the queue
   *
   * @param {Object} itemData The item to process
   */
  addItem(itemData: QueueItemData) {
    this.enqueue(this.generateQueueItem(itemData));
  }

  generateQueueItem(itemData: QueueItemData): QueueItem<QueueItemData> {
    return {
      item: itemData,
      attemptNumber: 0,
      time: this.schedule.now(),
      id: uuId.generateUUID(),
    };
  }

  /**
   * Adds an item to the retry queue
   *
   * @param {Object} itemData The item to retry
   * @param {Number} attemptNumber The attempt number (1 for first retry)
   * @param {Error} [error] The error from previous attempt, if there was one
   * @param {String} [id] The id of the queued message used for tracking duplicate entries
   */
  requeue(itemData: QueueItemData, attemptNumber: number, error?: Error, id?: string) {
    if (this.shouldRetry(itemData, attemptNumber)) {
      this.enqueue({
        item: itemData,
        attemptNumber,
        time: this.schedule.now() + this.getDelay(attemptNumber),
        id: id || uuId.generateUUID(),
      });
    } else {
      // Discard item
    }
  }

  getBatchDispatchInfo(batchItems: QueueItem[]) {
    let lengthCriteriaMet = false;
    let lengthCriteriaExceeded = false;
    if (checks.isDefined(this.batch?.maxItems)) {
      lengthCriteriaMet = batchItems.length === (this.batch?.maxItems as number);
      lengthCriteriaExceeded = batchItems.length > (this.batch?.maxItems as number);
    }

    let sizeCriteriaMet = false;
    let sizeCriteriaExceeded = false;
    if (
      checks.isDefined(this.batch?.maxSize) &&
      checks.isDefined(this.queueBatchItemsSizeCalculatorCb)
    ) {
      const curBatchSize = (
        this.queueBatchItemsSizeCalculatorCb as QueueBatchItemsSizeCalculatorCallback
      )(batchItems.map(queueItem => queueItem.item));

      sizeCriteriaMet = curBatchSize === (this.batch?.maxSize as number);
      sizeCriteriaExceeded = curBatchSize > (this.batch?.maxSize as number);
    }

    return {
      criteriaMet: lengthCriteriaMet || sizeCriteriaMet,
      criteriaExceeded: lengthCriteriaExceeded || sizeCriteriaExceeded,
    };
  }

  processHead() {
    // cancel the scheduled task if it exists
    this.schedule.cancel(this.processId);

    // Pop the head off the queue
    let queue = (this.getQueue(QueueStatuses.QUEUE) as Nullable<QueueItem<QueueItemData>[]>) ?? [];
    const inProgress =
      (this.getQueue(QueueStatuses.IN_PROGRESS) as Nullable<Record<string, any>>) ?? {};
    const now = this.schedule.now();
    const toRun: InProgressQueueItem[] = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const processItemCallback = (el: QueueItem, id: string) => (err?: Error, res?: any) => {
      const inProgress =
        (this.getQueue(QueueStatuses.IN_PROGRESS) as Nullable<Record<string, any>>) ?? {};
      delete inProgress[id];

      this.setQueue(QueueStatuses.IN_PROGRESS, inProgress);

      if (err) {
        this.requeue(el.item, el.attemptNumber + 1, err, el.id);
      }
    };

    const enqueueItem = (el: QueueItem, id: string) => {
      toRun.push({
        item: el.item,
        done: processItemCallback(el, id),
        attemptNumber: el.attemptNumber,
      });
    };

    let inProgressSize = Object.keys(inProgress).length;

    // eslint-disable-next-line no-plusplus
    while (queue.length > 0 && queue[0].time <= now && inProgressSize++ < this.maxItems) {
      const el = queue.shift();
      if (el) {
        const id = uuId.generateUUID();

        // Save this to the in progress map
        inProgress[id] = {
          item: el.item,
          attemptNumber: el.attemptNumber,
          time: this.schedule.now(),
        };

        enqueueItem(el, id);
      }
    }

    this.setQueue(QueueStatuses.QUEUE, queue);
    this.setQueue(QueueStatuses.IN_PROGRESS, inProgress);

    toRun.forEach(el => {
      // TODO: handle processQueueCb timeout
      try {
        const willBeRetried = this.shouldRetry(el.item, el.attemptNumber + 1);
        this.processQueueCb(el.item, el.done, el.attemptNumber, this.maxAttempts, willBeRetried);
      } catch (err) {
        this.logger?.error(RETRY_QUEUE_PROCESS_ERROR(RETRY_QUEUE), err);
      }
    });

    // re-read the queue in case the process function finished immediately or added another item
    queue = (this.getQueue(QueueStatuses.QUEUE) as Nullable<QueueItem<QueueItemData>[]>) ?? [];
    this.schedule.cancel(this.processId);

    if (queue.length > 0) {
      const nextProcessExecutionTime = queue[0].time - now;
      this.processId = this.schedule.run(
        this.processHead,
        nextProcessExecutionTime,
        ScheduleModes.ASAP,
      );
    }
  }

  // Ack continuously to prevent other tabs from claiming our queue
  ack() {
    this.setQueue(QueueStatuses.ACK, this.schedule.now());
    this.setQueue(QueueStatuses.RECLAIM_START, null);
    this.setQueue(QueueStatuses.RECLAIM_END, null);
    this.schedule.run(this.ack, this.timeouts.ackTimer, ScheduleModes.ASAP);
  }

  reclaim(id: string) {
    const other = this.storeManager.setStore({
      id,
      name: this.name,
      validKeys: QueueStatuses,
      type: storages.LOCAL_STORAGE,
    });
    const our = {
      queue: (this.getQueue(QueueStatuses.QUEUE) ?? []) as QueueItem[],
    };
    const their = {
      inProgress: other.get(QueueStatuses.IN_PROGRESS) ?? {},
      batchQueue: other.get(QueueStatuses.BATCH_QUEUE) ?? [],
      queue: (other.get(QueueStatuses.QUEUE) ?? []) as QueueItem[],
    };
    const trackMessageIds: string[] = [];

    const addConcatQueue = (
      queue: QueueItem[] | Record<string, any> | null,
      incrementAttemptNumberBy: number,
    ) => {
      const concatIterator = (el: QueueItem | Record<string, any>) => {
        const id = el.id || uuId.generateUUID();

        if (trackMessageIds.includes(id)) {
          // duplicated event
        } else {
          our.queue.push({
            item: el.item,
            attemptNumber: el.attemptNumber + incrementAttemptNumberBy,
            time: this.schedule.now(),
            id,
          });
          trackMessageIds.push(id);
        }
      };

      if (Array.isArray(queue)) {
        queue.forEach(concatIterator);
      } else if (queue) {
        Object.values(queue).forEach(concatIterator);
      }
    };

    // add their queue to ours, resetting run-time to immediate and copying the attempt#
    addConcatQueue(their.queue, 0);

    // Process batch queue items
    if (this.enableBatching) {
      their.batchQueue.forEach((el: QueueItem) => {
        const id = el.id || uuId.generateUUID();
        if (trackMessageIds.includes(id)) {
          // duplicated event
        } else {
          this.enqueue(el);
          trackMessageIds.push(id);
        }
      });
    } else {
      // if batching is not enabled in the current instance, add those items to the main queue directly
      addConcatQueue(their.batchQueue, 0);
    }

    // if the queue is abandoned, all the in-progress are failed. retry them immediately and increment the attempt#
    addConcatQueue(their.inProgress, 1);

    our.queue = our.queue.sort(sortByTime);

    this.setQueue(QueueStatuses.QUEUE, our.queue);

    // remove all keys one by on next tick to avoid NS_ERROR_STORAGE_BUSY error
    try {
      this.clearOtherQueue(other, 1);
    } catch (e) {
      const isLocalStorageBusy =
        (e as any).name === 'NS_ERROR_STORAGE_BUSY' ||
        (e as any).code === 'NS_ERROR_STORAGE_BUSY' ||
        (e as any).code === 0x80630001;
      if (isLocalStorageBusy) {
        try {
          this.clearOtherQueue(other, 40);
        } catch (retryError) {
          this.logger?.error(retryError);
        }
      } else {
        this.logger?.error(e);
      }
    }

    // process the new items we claimed
    this.processHead();
  }

  // eslint-disable-next-line class-methods-use-this
  clearOtherQueue(other: IStore, localStorageBackoff: number) {
    (globalThis as typeof window).setTimeout(() => {
      other.remove(QueueStatuses.BATCH_QUEUE);
      (globalThis as typeof window).setTimeout(() => {
        other.remove(QueueStatuses.IN_PROGRESS);
        (globalThis as typeof window).setTimeout(() => {
          other.remove(QueueStatuses.QUEUE);
          (globalThis as typeof window).setTimeout(() => {
            other.remove(QueueStatuses.RECLAIM_START);
            (globalThis as typeof window).setTimeout(() => {
              other.remove(QueueStatuses.RECLAIM_END);
              (globalThis as typeof window).setTimeout(() => {
                other.remove(QueueStatuses.ACK);
              }, localStorageBackoff);
            }, localStorageBackoff);
          }, localStorageBackoff);
        }, localStorageBackoff);
      }, localStorageBackoff);
    }, localStorageBackoff);
  }

  checkReclaim() {
    const createReclaimStartTask = (store: IStore) => () => {
      if (store.get(QueueStatuses.RECLAIM_END) !== this.id) {
        return;
      }

      if (store.get(QueueStatuses.RECLAIM_START) !== this.id) {
        return;
      }

      this.reclaim(store.id);
    };
    const createReclaimEndTask = (store: IStore) => () => {
      if (store.get(QueueStatuses.RECLAIM_START) !== this.id) {
        return;
      }

      store.set(QueueStatuses.RECLAIM_END, this.id);

      this.schedule.run(
        createReclaimStartTask(store),
        this.timeouts.reclaimWait,
        ScheduleModes.ABANDON,
      );
    };
    const tryReclaim = (store: IStore) => {
      store.set(QueueStatuses.RECLAIM_START, this.id);
      store.set(QueueStatuses.ACK, this.schedule.now());

      this.schedule.run(
        createReclaimEndTask(store),
        this.timeouts.reclaimWait,
        ScheduleModes.ABANDON,
      );
    };
    const findOtherQueues = (name: string): IStore[] => {
      const res: IStore[] = [];
      const storage = this.store.getOriginalEngine();

      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        const parts: string[] = k ? k.split('.') : [];

        if (parts.length !== 3) {
          // eslint-disable-next-line no-continue
          continue;
        }

        if (parts[0] !== name) {
          // eslint-disable-next-line no-continue
          continue;
        }

        if (parts[2] !== QueueStatuses.ACK) {
          // eslint-disable-next-line no-continue
          continue;
        }

        res.push(
          this.storeManager.setStore({
            id: parts[1],
            name,
            validKeys: QueueStatuses,
            type: storages.LOCAL_STORAGE,
          }),
        );
      }

      return res;
    };

    findOtherQueues(this.name).forEach(store => {
      if (store.id === this.id) {
        return;
      }

      if (this.schedule.now() - store.get(QueueStatuses.ACK) < this.timeouts.reclaimTimeout) {
        return;
      }

      tryReclaim(store);
    });

    this.schedule.run(this.checkReclaim, this.timeouts.reclaimTimer, ScheduleModes.RESCHEDULE);
  }
}

export { RetryQueue };
