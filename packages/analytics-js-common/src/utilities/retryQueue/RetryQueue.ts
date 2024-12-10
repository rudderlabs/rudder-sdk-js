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
import { ABANDON, ASAP, RESCHEDULE, Schedule } from './Schedule';
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
  QueueItemType,
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
  BATCH_QUEUE_ITEM_TYPE,
  SINGLE_QUEUE_ITEM_TYPE,
} from './constants';
import { clearQueueEntries, findOtherQueues, getNumberOptionVal, sortByTime } from './utilities';
import { isNumber } from '../number';

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
  batchSizeCalcCb?: QueueBatchItemsSizeCalculatorCallback<QueueItemData>;
  IsPageAccessible: boolean;
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

    this.IsPageAccessible = true;

    this.flushBatchOnPageLeave();

    this.scheduleTimeoutActive = false;
  }

  configureForBatching(options: QueueOpts) {
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
    onPageLeave(isAccessible => {
      this.IsPageAccessible = isAccessible;
      this.flushForPageLeave();
    });
  }

  getStorageEntry(name: string): Nullable<QueueData<QueueItemData>> {
    return this.store.get(name);
  }

  setStorageEntry(name: string, value?: QueueData<QueueItemData> | number) {
    // Clear an entry if the value is not significant
    // Like an empty array or an empty object or null or undefined
    if (
      !isNullOrUndefined(value) &&
      (isNumber(value) || (Array.isArray(value) && value.length > 0) || isNonEmptyObject(value))
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
        ASAP,
      );
    }
  }

  /**
   * Flushes the batch queue
   */
  flushBatch() {
    const batchQueue = this.getStorageEntry(BATCH_QUEUE) ?? [];
    if (batchQueue.length > 0) {
      const batchItems = batchQueue.slice(-batchQueue.length);

      const batchEntry = this.genQueueItem(
        batchItems.map(queueItem => queueItem.item),
        BATCH_QUEUE_ITEM_TYPE,
      );

      this.setStorageEntry(BATCH_QUEUE, []);

      this.pushToMainQueue(batchEntry);
    }
    // Re-schedule the next flush task
    this.scheduleFlushBatch();
  }

  /**
   * Flushes the batch queue
   */
  flushForPageLeave() {
    let dataSource: string;
    if (this.batch.enabled) {
      dataSource = BATCH_QUEUE;
    } else {
      dataSource = QUEUE;
    }

    const dataSourceQueue = this.getStorageEntry(dataSource) ?? [];
    if (dataSourceQueue.length === 0) {
      return;
    }

    const batchItems: QueueItem<QueueItemData>[] = [];
    // Try to send as many items as possible
    // eslint-disable-next-line no-restricted-syntax
    for (const queueItem of dataSourceQueue) {
      if (
        (this.batchSizeCalcCb as QueueBatchItemsSizeCalculatorCallback<QueueItemData>)(
          [...batchItems, queueItem].map(queueItem => queueItem.item),
        ) > MAX_PAGE_UNLOAD_BATCH_SIZE_BYTES
      ) {
        break;
      }

      batchItems.push(queueItem);
    }

    const batchEntry = this.genQueueItem(
      batchItems.map(queueItem => queueItem.item),
      BATCH_QUEUE_ITEM_TYPE,
    );

    this.setStorageEntry(dataSource, dataSourceQueue.slice(batchItems.length));

    this.pushToMainQueue(batchEntry);
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
    if (this.batch.enabled && entry.type === SINGLE_QUEUE_ITEM_TYPE) {
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
    let batchQueue = this.getStorageEntry(BATCH_QUEUE) ?? [];

    batchQueue = batchQueue.slice(-batchQueue.length);
    batchQueue.push(entry);

    const batchDispatchInfo = this.getBatchDispatchInfo(batchQueue);
    // if batch criteria is met, queue the batch events to the main queue and clear batch queue
    if (batchDispatchInfo.criteriaMet || batchDispatchInfo.criteriaExceeded) {
      let batchItems: QueueItemData[];
      if (batchDispatchInfo.criteriaExceeded) {
        batchItems = batchQueue.slice(0, batchQueue.length - 1).map(queueItem => queueItem.item);
        batchQueue = [entry];
      } else {
        batchItems = batchQueue.map(queueItem => queueItem.item);
        batchQueue = [];
      }

      curEntry = this.genQueueItem(batchItems, BATCH_QUEUE_ITEM_TYPE);

      // re-attach the timeout handler
      this.scheduleFlushBatch();
    }

    // update the batch queue
    this.setStorageEntry(BATCH_QUEUE, batchQueue);
    return curEntry;
  }

  pushToMainQueue(curEntry: QueueItem<QueueItemData>) {
    let queue = this.getStorageEntry(QUEUE) ?? [];

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
    this.enqueue(this.genQueueItem(itemData, SINGLE_QUEUE_ITEM_TYPE));
  }

  /**
   * Generates a queue item
   * @param itemData Queue item data
   * @returns Queue item
   */
  genQueueItem(itemData: QueueItemData, type: QueueItemType): QueueItem<QueueItemData> {
    return {
      item: itemData,
      attemptNumber: 0,
      time: this.schedule.now(),
      id: generateUUID(),
      type,
    };
  }

  /**
   * Adds an item to the retry queue
   *
   * @param {Object} qItem The item to process
   */
  requeue(qItem: QueueItem<QueueItemData>) {
    const { attemptNumber, item, type, id } = qItem;
    // Increment the attempt number as we're about to retry
    const attemptNumberToUse = attemptNumber + 1;
    if (this.shouldRetry(attemptNumberToUse)) {
      this.enqueue({
        item,
        attemptNumber: attemptNumberToUse,
        time: this.schedule.now() + this.getRetryDelay(attemptNumberToUse),
        id: id ?? generateUUID(),
        type,
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
    let queue = this.getStorageEntry(QUEUE) ?? [];
    const now = this.schedule.now();
    const toRun: ProcessQueueItem<QueueItemData>[] = [];

    const processItemCallback = (el: QueueItem<QueueItemData>, id: string) => (err?: any) => {
      const inProgress = this.getStorageEntry(IN_PROGRESS) ?? [];

      // Remove processed item from inProgress queue
      const pItemIdx = inProgress.findIndex(item => item.id === id);
      if (pItemIdx !== -1) {
        inProgress.splice(pItemIdx, 1);
      }

      this.setStorageEntry(IN_PROGRESS, inProgress);

      if (!isNullOrUndefined(err)) {
        this.requeue(el);
      }
    };

    const enqueueItem = (el: QueueItem<QueueItemData>, id: string) => {
      toRun.push({
        item: el.item,
        done: processItemCallback(el, id),
        attemptNumber: el.attemptNumber,
      });
    };

    const inProgress = this.getStorageEntry(IN_PROGRESS) ?? [];
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
          type: el.type,
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
          this.IsPageAccessible,
        );
      } catch (err) {
        this.logger?.error(RETRY_QUEUE_PROCESS_ERROR, err);
      }
    });

    // re-read the queue in case the process function finished immediately or added another item
    queue = this.getStorageEntry(QUEUE) ?? [];
    this.schedule.cancel(this.processId);

    if (queue.length > 0) {
      const nextProcessExecutionTime = (queue[0] as QueueItem<QueueItemData>).time - now;
      this.processId = this.schedule.run(this.processHead, nextProcessExecutionTime, ASAP);
    }
  }

  // Ack continuously to prevent other tabs from claiming our queue
  ack() {
    // Schedule the next ack
    this.schedule.run(this.ack, this.timeouts.ackTimer, ASAP);

    this.setStorageEntry(ACK, this.schedule.now());
  }

  reclaim(otherStore: IStore) {
    const ourData = {
      queue: this.getStorageEntry(QUEUE) ?? [],
    };
    const otherData = {
      inProgress: otherStore.get(IN_PROGRESS) ?? [],
      batchQueue: otherStore.get(BATCH_QUEUE) ?? [],
      queue: otherStore.get(QUEUE) ?? [],
    };
    const trackMessageIds: string[] = [];

    const concatOtherQueue = (
      queue: QueueData<QueueItemData>,
      incrementAttemptNumberBy: number = 0,
    ) => {
      let finalQueue = queue;
      // As the structure of inProgress queue entry changed,
      // this is to handle the backward compatibility for the inProgress queue
      // data from older SDKs
      if (!Array.isArray(queue)) {
        finalQueue = Object.values(queue);
      }

      finalQueue.forEach((item: QueueItem<QueueItemData>) => {
        // ignore duplicates
        if (!item.id || !trackMessageIds.includes(item.id)) {
          // Hack to determine the item type by the contents of the entry
          // After some point, we can remove this hack as most of the stale data will have been processed
          // and the new entries will have the type field set
          const type = Array.isArray(item.item) ? BATCH_QUEUE_ITEM_TYPE : SINGLE_QUEUE_ITEM_TYPE;

          ourData.queue.push({
            item: item.item,
            attemptNumber: item.attemptNumber + incrementAttemptNumberBy,
            time: this.schedule.now(),
            id: item.id ?? generateUUID(),
            type: item.type ?? type,
          });

          if (item.id) {
            trackMessageIds.push(item.id);
          }
        }
      });
    };

    // add their queue to ours, resetting run-time to immediate and copying the attempt#
    concatOtherQueue(otherData.queue);

    // Process batch queue items
    if (this.batch.enabled) {
      otherData.batchQueue.forEach((el: QueueItem<QueueItemData>) => {
        // ignore duplicates
        if (!el.id || !trackMessageIds.includes(el.id)) {
          this.enqueue({
            item: el.item,
            attemptNumber: el.attemptNumber,
            time: this.schedule.now(),
            id: el.id ?? generateUUID(),
            type: el.type ?? SINGLE_QUEUE_ITEM_TYPE,
          });

          if (el.id) {
            trackMessageIds.push(el.id);
          }
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

      this.schedule.run(createReclaimTask(store), this.timeouts.reclaimWait, ABANDON);
    };

    const initiateReclaim = (otherStore: IStore) => {
      otherStore.set(RECLAIM_START, this.id);
      otherStore.set(ACK, this.schedule.now());

      this.schedule.run(createReclaimEndTask(otherStore), this.timeouts.reclaimWait, ABANDON);
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

    this.schedule.run(this.checkReclaim, this.timeouts.reclaimTimer, RESCHEDULE);
  }

  clear() {
    this.schedule.cancelAll();
    clearQueueEntries(this.store);
  }
}

export { RetryQueue };
