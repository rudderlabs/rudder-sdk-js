import { isNonEmptyObject, isObjectLiteralAndNotNull } from '../object';
import type { IStore, IStoreManager } from '../../types/Store';
import type { StorageType } from '../../types/Storage';
import type { Nullable } from '../../types/Nullable';
import type { ILogger } from '../../types/Logger';
import type { BatchOpts, QueueOpts } from '../../types/LoadOptions';
import { isDefined, isNullOrUndefined } from '../checks';
import { LOCAL_STORAGE } from '../../constants/storages';
import { generateUUID } from '../uuId';
import { onPageLeave } from '../page';
import { Schedule, ScheduleModes } from './Schedule';
import { RETRY_QUEUE_ENTRY_REMOVE_ERROR, RETRY_QUEUE_PROCESS_ERROR } from './logMessages';
import type {
  QueueTimeouts,
  QueueBackoff,
  IQueue,
  QueueBatchItemsSizeCalculatorCallback,
  QueueItem,
  QueueItemData,
  QueueProcessCallback,
  ProcessQueueItem,
  QueueData,
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
  MIN_TIMER_SCALE_FACTOR,
  MAX_TIMER_SCALE_FACTOR,
  MAX_PAGE_UNLOAD_BATCH_SIZE_BYTES,
  BATCH_QUEUE,
  ACK,
  IN_PROGRESS,
  QUEUE,
  QueueStatuses,
  RECLAIM_END,
  RECLAIM_START,
} from './constants';
import { clearQueueEntries, findOtherQueues, getNumberOptionVal, sortByTime } from './utilities';

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
  batch: BatchOpts;
  flushBatchTaskId?: string;
  flushInProgress?: boolean;
  batchSizeCalcCb?: QueueBatchItemsSizeCalculatorCallback<QueueItemData>;
  isPageAccessible: boolean;
  storageType: StorageType;

  constructor(
    name: string,
    options: QueueOpts,
    queueProcessCb: QueueProcessCallback<QueueItemData>,
    storeManager: IStoreManager,
    storageType: StorageType = LOCAL_STORAGE,
    logger?: ILogger,
    queueBatchItemsSizeCalculatorCb?: QueueBatchItemsSizeCalculatorCallback<QueueItemData>,
  ) {
    this.storeManager = storeManager;
    this.logger = logger;
    this.name = name;
    this.storageType = storageType;
    this.id = generateUUID();

    this.processQueueCb = queueProcessCb;
    this.batchSizeCalcCb = queueBatchItemsSizeCalculatorCb;

    this.maxItems = getNumberOptionVal(
      options.maxItems,
      DEFAULT_MAX_ITEMS,
      undefined,
      DEFAULT_MAX_ITEMS,
    );
    this.maxAttempts = getNumberOptionVal(
      options.maxAttempts,
      DEFAULT_MAX_RETRY_ATTEMPTS,
      undefined,
      DEFAULT_MAX_RETRY_ATTEMPTS,
    );

    this.batch = { enabled: false };
    this.configureForBatching(options);

    this.backoff = {
      minRetryDelay: getNumberOptionVal(options.minRetryDelay, DEFAULT_MIN_RETRY_DELAY_MS),
      maxRetryDelay: getNumberOptionVal(options.maxRetryDelay, DEFAULT_MAX_RETRY_DELAY_MS),
      factor: getNumberOptionVal(options.backoffFactor, DEFAULT_BACKOFF_FACTOR),
      jitter: getNumberOptionVal(options.backoffJitter, DEFAULT_BACKOFF_JITTER),
    };

    const timerScaleFactor = getNumberOptionVal(
      options.timerScaleFactor,
      MIN_TIMER_SCALE_FACTOR,
      MIN_TIMER_SCALE_FACTOR,
      MAX_TIMER_SCALE_FACTOR,
    );

    // painstakingly tuned. that's why they're not "easily" configurable
    this.timeouts = {
      ackTimer: Math.round(timerScaleFactor * DEFAULT_ACK_TIMER_MS),
      reclaimTimer: Math.round(timerScaleFactor * DEFAULT_RECLAIM_TIMER_MS),
      reclaimTimeout: Math.round(timerScaleFactor * DEFAULT_RECLAIM_TIMEOUT_MS),
      reclaimWait: Math.round(timerScaleFactor * DEFAULT_RECLAIM_WAIT_MS),
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

    // bind recurring tasks for ease of use
    this.ack = this.ack.bind(this);
    this.checkReclaim = this.checkReclaim.bind(this);
    this.processHead = this.processHead.bind(this);
    this.flushBatch = this.flushBatch.bind(this);

    this.isPageAccessible = true;

    this.flushBatchOnPageLeave();

    this.scheduleTimeoutActive = false;
  }

  configureForBatching(options: QueueOpts) {
    this.flushInProgress = false;
    const { batch: batchOptions } = options;

    if (!isObjectLiteralAndNotNull(batchOptions)) {
      return;
    }

    this.batch.enabled = batchOptions.enabled === true;
    if (this.batch.enabled) {
      this.batch.maxSize = getNumberOptionVal(
        batchOptions.maxSize,
        DEFAULT_MAX_BATCH_SIZE_BYTES,
        undefined,
        DEFAULT_MAX_BATCH_SIZE_BYTES,
      );

      this.batch.maxItems = getNumberOptionVal(batchOptions.maxItems, DEFAULT_MAX_BATCH_ITEMS);
      this.batch.flushInterval = getNumberOptionVal(
        batchOptions.flushInterval,
        DEFAULT_BATCH_FLUSH_INTERVAL_MS,
      );
    }
  }

  flushBatchOnPageLeave() {
    if (this.batch.enabled) {
      onPageLeave(this.flushBatch);
    }
  }

  getStorageEntry(name: string): Nullable<QueueData<QueueItemData>> {
    return this.store.get(name);
  }

  setStorageEntry(name: string, value?: QueueData<QueueItemData> | number) {
    // Clear an entry if the value is not significant
    // Like an empty array or an empty object or null or undefined
    if (
      !isNullOrUndefined(value) &&
      ((Array.isArray(value) && value.length > 0) || isNonEmptyObject(value))
    ) {
      this.store.set(name, value);
    } else {
      try {
        this.store.remove(name);
      } catch (err) {
        this.logger?.error(RETRY_QUEUE_ENTRY_REMOVE_ERROR(name), err);
      }
    }
  }

  /**
   * Stops processing the queue
   */
  stop() {
    this.schedule.cancelAll();
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
    this.scheduleFlushBatch();
    this.ack();
    // Reclaiming any abandoned queues is only applicable for localStorage
    if (this.storageType === LOCAL_STORAGE) {
      this.checkReclaim();
    }
    this.processHead();
  }

  /**
   * Configures the timeout handler for flushing the batch queue
   */
  scheduleFlushBatch() {
    if (this.batch.enabled) {
      if (this.flushBatchTaskId) {
        this.schedule.cancel(this.flushBatchTaskId);
      }

      this.flushBatchTaskId = this.schedule.run(
        this.flushBatch,
        this.batch.flushInterval as number,
        ScheduleModes.ASAP,
      );
    }
  }

  /**
   * Flushes the batch queue
   */
  flushBatch(isAccessible = true) {
    this.isPageAccessible = isAccessible;

    // If batching is already in progress, don't start another batch
    if (this.flushInProgress) {
      return;
    }

    // Set the flag to indicate that batching is in progress
    this.flushInProgress = true;

    const batchQueue = (this.getStorageEntry(BATCH_QUEUE) ?? []) as QueueData<QueueItemData>;
    if (batchQueue.length > 0) {
      let batchItems: QueueItem<QueueItemData>[] = [];
      let remainingBatchItems: QueueItem<QueueItemData>[] = [];

      if (this.isPageAccessible) {
        batchItems = batchQueue.slice(-batchQueue.length);
      } else {
        // If the page is not accessible, try to send as many items as possible
        // eslint-disable-next-line no-restricted-syntax
        for (const queueItem of batchQueue) {
          if (
            (this.batchSizeCalcCb as QueueBatchItemsSizeCalculatorCallback<QueueItemData>)(
              [...batchItems, queueItem].map(queueItem => queueItem.item),
            ) > MAX_PAGE_UNLOAD_BATCH_SIZE_BYTES
          ) {
            break;
          }

          batchItems.push(queueItem);
        }

        remainingBatchItems = batchQueue.slice(batchItems.length);
      }

      const batchEntry = this.genQueueItem(batchItems.map(queueItem => queueItem.item));

      this.setStorageEntry(BATCH_QUEUE, remainingBatchItems);

      this.pushToMainQueue(batchEntry);
    }
    this.flushInProgress = false;

    // Re-schedule the next flush task
    this.scheduleFlushBatch();
  }

  /**
   * Decides whether to retry. Overridable.
   *
   * @param {Number} attemptNumber The attemptNumber (1 for first retry)
   * @return {Boolean} Whether to requeue the message
   */
  shouldRetry(attemptNumber: number): boolean {
    return attemptNumber <= this.maxAttempts;
  }

  /**
   * Calculates the delay (in ms) for a retry attempt
   *
   * @param {Number} attemptNumber The attemptNumber (1 for first retry)
   * @return {Number} The delay in milliseconds to wait before attempting a retry
   */
  getRetryDelay(attemptNumber: number): number {
    let ms = this.backoff.minRetryDelay * this.backoff.factor ** attemptNumber;

    if (this.backoff.jitter) {
      // eslint-disable-next-line sonarjs/pseudo-random
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
    if (this.batch.enabled) {
      curEntry = this.handleNewItemForBatch(entry);
    } else {
      curEntry = entry;
    }

    // when batching is enabled, `curEntry` could be `undefined` if the batch criteria is not met
    if (curEntry) {
      this.pushToMainQueue(curEntry);
    }
  }

  /**
   * Handles a new item added to the retry queue when batching is enabled
   * @param entry New item added to the retry queue
   * @returns Undefined or batch entry object
   */
  handleNewItemForBatch(entry: QueueItem<QueueItemData>): QueueItem<QueueItemData> | undefined {
    let curEntry: QueueItem<QueueItemData> | undefined;
    let batchQueue = (this.getStorageEntry(BATCH_QUEUE) ?? []) as QueueData<QueueItemData>;

    if (this.flushInProgress) {
      batchQueue.push(entry);
    } else {
      batchQueue = batchQueue.slice(-batchQueue.length);
      batchQueue.push(entry);

      const batchDispatchInfo = this.getBatchDispatchInfo(batchQueue);
      // if batch criteria is met, queue the batch events to the main queue and clear batch queue
      if (batchDispatchInfo.criteriaMet || batchDispatchInfo.criteriaExceeded) {
        this.flushInProgress = true;
        let batchItems: QueueItemData[];
        if (batchDispatchInfo.criteriaExceeded) {
          batchItems = batchQueue.slice(0, batchQueue.length - 1).map(queueItem => queueItem.item);
          batchQueue = [entry];
        } else {
          batchItems = batchQueue.map(queueItem => queueItem.item);
          batchQueue = [];
        }

        // Don't make any batch request if there are no items
        if (batchItems.length > 0) {
          curEntry = this.genQueueItem(batchItems);
        }

        // re-attach the timeout handler
        this.scheduleFlushBatch();
      }
      this.flushInProgress = false;
    }

    // update the batch queue
    this.setStorageEntry(BATCH_QUEUE, batchQueue);
    return curEntry;
  }

  pushToMainQueue(curEntry: QueueItem<QueueItemData>) {
    let queue = (this.getStorageEntry(QUEUE) ?? []) as QueueData<QueueItemData>;

    queue = queue.slice(-(this.maxItems - 1));
    queue.push(curEntry);
    queue = queue.sort(sortByTime);

    this.setStorageEntry(QUEUE, queue);

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
    this.enqueue(this.genQueueItem(itemData));
  }

  /**
   * Generates a queue item
   * @param itemData Queue item data
   * @returns Queue item
   */
  genQueueItem(itemData: QueueItemData): QueueItem<QueueItemData> {
    return {
      item: itemData,
      attemptNumber: 0,
      time: this.schedule.now(),
      id: generateUUID(),
    };
  }

  /**
   * Adds an item to the retry queue
   *
   * @param {Object} itemData The item to retry
   * @param {Number} attemptNumber The attempt number (1 for first retry)
   * @param {String} [id] The id of the queued message used for tracking duplicate entries
   */
  requeue(itemData: QueueItemData, attemptNumber: number, id?: string) {
    if (this.shouldRetry(attemptNumber)) {
      this.enqueue({
        item: itemData,
        attemptNumber,
        time: this.schedule.now() + this.getRetryDelay(attemptNumber),
        id: id ?? generateUUID(),
      });
    }
  }

  /**
   * Returns the information about whether the batch criteria is met or exceeded
   * @param batchItems Prospective batch items
   * @returns Batch dispatch info
   */
  getBatchDispatchInfo(batchItems: QueueItem<QueueItemData>[]) {
    let lengthCriteriaMet = false;
    let lengthCriteriaExceeded = false;
    const configuredBatchMaxItems = this.batch?.maxItems as number;
    if (isDefined(configuredBatchMaxItems)) {
      lengthCriteriaMet = batchItems.length === configuredBatchMaxItems;
      lengthCriteriaExceeded = batchItems.length > configuredBatchMaxItems;
    }

    if (lengthCriteriaMet || lengthCriteriaExceeded) {
      return {
        criteriaMet: lengthCriteriaMet,
        criteriaExceeded: lengthCriteriaExceeded,
      };
    }

    let sizeCriteriaMet = false;
    let sizeCriteriaExceeded = false;
    const configuredBatchMaxSize = this.batch?.maxSize as number;
    if (isDefined(configuredBatchMaxSize) && isDefined(this.batchSizeCalcCb)) {
      const curBatchSize = (
        this.batchSizeCalcCb as QueueBatchItemsSizeCalculatorCallback<QueueItemData>
      )(batchItems.map(queueItem => queueItem.item));

      sizeCriteriaMet = curBatchSize === configuredBatchMaxSize;
      sizeCriteriaExceeded = curBatchSize > configuredBatchMaxSize;
    }

    return {
      criteriaMet: sizeCriteriaMet,
      criteriaExceeded: sizeCriteriaExceeded,
    };
  }

  processHead() {
    // cancel the scheduled task if it exists
    this.schedule.cancel(this.processId);

    // Pop the head off the queue
    let queue = (this.getStorageEntry(QUEUE) ?? []) as QueueData<QueueItemData>;
    const now = this.schedule.now();
    const toRun: ProcessQueueItem<QueueItemData>[] = [];

    const processItemCallback = (el: QueueItem<QueueItemData>, id: string) => (err?: any) => {
      const inProgress = (this.getStorageEntry(IN_PROGRESS) ?? []) as QueueData<QueueItemData>;

      // Remove processed item from inProgress queue
      const pItemIdx = inProgress.findIndex(item => item.id === id);
      if (pItemIdx !== -1) {
        inProgress.splice(pItemIdx, 1);
      }

      this.setStorageEntry(IN_PROGRESS, inProgress);

      if (!isNullOrUndefined(err)) {
        this.requeue(el.item, el.attemptNumber + 1, el.id);
      }
    };

    const enqueueItem = (el: QueueItem<QueueItemData>, id: string) => {
      toRun.push({
        item: el.item,
        done: processItemCallback(el, id),
        attemptNumber: el.attemptNumber,
      });
    };

    const inProgress = (this.getStorageEntry(IN_PROGRESS) ?? []) as QueueItem<QueueItemData>[];
    while (
      queue.length > 0 &&
      (queue[0] as QueueItem<QueueItemData>).time <= now &&
      inProgress.length < this.maxItems
    ) {
      const el = queue.shift();
      if (el) {
        const id = generateUUID();

        // Save this to the in progress map
        inProgress.push({
          item: el.item,
          attemptNumber: el.attemptNumber,
          time: this.schedule.now(),
          id,
        });

        enqueueItem(el, id);
      }
    }

    this.setStorageEntry(QUEUE, queue);
    this.setStorageEntry(IN_PROGRESS, inProgress);

    toRun.forEach(el => {
      // TODO: handle processQueueCb timeout
      try {
        const willBeRetried = this.shouldRetry(el.attemptNumber + 1);
        this.processQueueCb(
          el.item,
          el.done,
          el.attemptNumber,
          this.maxAttempts,
          willBeRetried,
          this.isPageAccessible,
        );
      } catch (err) {
        this.logger?.error(RETRY_QUEUE_PROCESS_ERROR, err);
      }
    });

    // re-read the queue in case the process function finished immediately or added another item
    queue = (this.getStorageEntry(QUEUE) ?? []) as QueueItem<QueueItemData>[];
    this.schedule.cancel(this.processId);

    if (queue.length > 0) {
      const nextProcessExecutionTime = (queue[0] as QueueItem<QueueItemData>).time - now;
      this.processId = this.schedule.run(
        this.processHead,
        nextProcessExecutionTime,
        ScheduleModes.ASAP,
      );
    }
  }

  // Ack continuously to prevent other tabs from claiming our queue
  ack() {
    // Schedule the next ack
    this.schedule.run(this.ack, this.timeouts.ackTimer, ScheduleModes.ASAP);

    this.setStorageEntry(ACK, this.schedule.now());
  }

  reclaim(otherStore: IStore) {
    const ourData = {
      queue: (this.getStorageEntry(QUEUE) ?? []) as QueueData<QueueItemData>,
    };
    const otherData = {
      inProgress: (otherStore.get(IN_PROGRESS) ?? []) as QueueData<QueueItemData>,
      batchQueue: (otherStore.get(BATCH_QUEUE) ?? []) as QueueData<QueueItemData>,
      queue: (otherStore.get(QUEUE) ?? []) as QueueData<QueueItemData>,
    };
    const trackMessageIds: string[] = [];

    const concatOtherQueue = (
      queue: QueueData<QueueItemData>,
      incrementAttemptNumberBy: number = 0,
    ) => {
      queue.forEach((item: QueueItem<QueueItemData>) => {
        const id = item.id ?? generateUUID();

        // ignore duplicates
        if (!trackMessageIds.includes(id)) {
          ourData.queue.push({
            item: item.item,
            attemptNumber: item.attemptNumber + incrementAttemptNumberBy,
            time: this.schedule.now(),
            id,
          });
          trackMessageIds.push(id);
        }
      });
    };

    // add their queue to ours, resetting run-time to immediate and copying the attempt#
    concatOtherQueue(otherData.queue);

    // Process batch queue items
    if (this.batch.enabled) {
      otherData.batchQueue.forEach((el: QueueItem<QueueItemData>) => {
        const id = el.id ?? generateUUID();
        if (trackMessageIds.includes(id)) {
          // duplicated event
        } else {
          this.enqueue(el);
          trackMessageIds.push(id);
        }
      });
    } else {
      // if batching is not enabled in the current instance, add those items to the main queue directly
      concatOtherQueue(otherData.batchQueue);
    }

    // if the queue is abandoned, all the in-progress are failed. retry them immediately and increment the attempt#
    concatOtherQueue(otherData.inProgress, 1);

    ourData.queue.sort(sortByTime);

    this.setStorageEntry(QUEUE, ourData.queue);

    // remove all keys one by one
    clearQueueEntries(otherStore, this.logger);

    // process the new items we claimed
    this.processHead();

    this.ack();
  }

  checkReclaim() {
    const createReclaimTask = (store: IStore) => () => {
      if (store.get(RECLAIM_START) !== this.id || store.get(RECLAIM_END) !== this.id) {
        return;
      }

      this.reclaim(store);
    };

    const createReclaimEndTask = (store: IStore) => () => {
      if (store.get(RECLAIM_START) !== this.id) {
        return;
      }

      store.set(RECLAIM_END, this.id);

      this.schedule.run(createReclaimTask(store), this.timeouts.reclaimWait, ScheduleModes.ABANDON);
    };

    const initiateReclaim = (otherStore: IStore) => {
      otherStore.set(RECLAIM_START, this.id);
      otherStore.set(ACK, this.schedule.now());

      this.schedule.run(
        createReclaimEndTask(otherStore),
        this.timeouts.reclaimWait,
        ScheduleModes.ABANDON,
      );
    };

    findOtherQueues(this.store.getOriginalEngine(), this.storeManager, this.name, this.id).forEach(
      otherStore => {
        const otherStoreAck = otherStore.get(ACK);
        if (
          isNullOrUndefined(otherStoreAck) ||
          !Number.isInteger(otherStoreAck) ||
          this.schedule.now() - (otherStoreAck as number) < this.timeouts.reclaimTimeout
        ) {
          return;
        }

        initiateReclaim(otherStore);
      },
    );

    this.schedule.run(this.checkReclaim, this.timeouts.reclaimTimer, ScheduleModes.RESCHEDULE);
  }

  clear() {
    this.schedule.cancelAll();
    clearQueueEntries(this.store);
  }
}

export { RetryQueue };
