import type { IStore, IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { BatchOpts, QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import type {
  IQueue,
  QueueItem,
  QueueItemData,
  QueueBatchItemsSizeCalculatorCallback,
  QueueProcessCallback,
  QueueItemType,
} from '../../types/plugins';
import { Schedule, ScheduleModes } from './Schedule';
import { RETRY_QUEUE_ENTRY_REMOVE_ERROR, RETRY_QUEUE_PROCESS_ERROR } from './logMessages';
import type { QueueTimeouts, QueueBackoff, InProgressQueueItem } from './types';
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
  SINGLE_QUEUE_ITEM_TYPE,
  BATCH_QUEUE_ITEM_TYPE,
} from './constants';
import {
  generateUUID,
  isDefined,
  isFunction,
  isNullOrUndefined,
  isObjectLiteralAndNotNull,
  LOCAL_STORAGE,
  onPageLeave,
  QueueStatuses,
} from '../../shared-chunks/common';

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
  batch: BatchOpts;
  flushBatchTaskId?: string;
  batchingInProgress?: boolean;
  batchSizeCalcCb?: QueueBatchItemsSizeCalculatorCallback<QueueItemData>;
  reclaimStartVal?: Nullable<string>;
  reclaimEndVal?: Nullable<string>;
  isPageAccessible: boolean;

  constructor(
    name: string,
    options: QueueOpts,
    queueProcessCb: QueueProcessCallback,
    storeManager: IStoreManager,
    storageType: StorageType = LOCAL_STORAGE,
    logger?: ILogger,
    queueBatchItemsSizeCalculatorCb?: QueueBatchItemsSizeCalculatorCallback,
  ) {
    this.storeManager = storeManager;
    this.logger = logger;
    this.name = name;
    this.id = generateUUID();

    this.processQueueCb = queueProcessCb;
    this.batchSizeCalcCb = queueBatchItemsSizeCalculatorCb;

    this.maxItems = options.maxItems || DEFAULT_MAX_ITEMS;
    this.maxAttempts = options.maxAttempts || DEFAULT_MAX_RETRY_ATTEMPTS;

    this.batch = { enabled: false };
    this.configureBatchMode(options);

    this.backoff = {
      minRetryDelay: options.minRetryDelay || DEFAULT_MIN_RETRY_DELAY_MS,
      maxRetryDelay: options.maxRetryDelay || DEFAULT_MAX_RETRY_DELAY_MS,
      factor: options.backoffFactor || DEFAULT_BACKOFF_FACTOR,
      jitter: options.backoffJitter || DEFAULT_BACKOFF_JITTER,
    };

    // Limit the timer scale factor to the minimum value
    let timerScaleFactor = Math.max(
      options.timerScaleFactor ?? MIN_TIMER_SCALE_FACTOR,
      MIN_TIMER_SCALE_FACTOR,
    );

    // Limit the timer scale factor to the maximum value
    timerScaleFactor = Math.min(timerScaleFactor, MAX_TIMER_SCALE_FACTOR);

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
      errorHandler: this.storeManager.errorHandler,
      logger: this.storeManager.logger,
    });
    this.setDefaultQueueEntries();

    // bind recurring tasks for ease of use
    this.ack = this.ack.bind(this);
    this.checkReclaim = this.checkReclaim.bind(this);
    this.processHead = this.processHead.bind(this);
    this.flushBatch = this.flushBatch.bind(this);

    this.isPageAccessible = true;

    // Flush the queue on page leave
    this.flushBatchOnPageLeave();

    this.scheduleTimeoutActive = false;
  }

  private setDefaultQueueEntries() {
    this.setStorageEntry(QueueStatuses.IN_PROGRESS, {});
    this.setStorageEntry(QueueStatuses.QUEUE, []);
    this.setStorageEntry(QueueStatuses.BATCH_QUEUE, []);
  }

  configureBatchMode(options: QueueOpts) {
    this.batchingInProgress = false;

    if (!isObjectLiteralAndNotNull(options.batch)) {
      return;
    }

    const batchOptions = options.batch as BatchOpts;

    this.batch.enabled = batchOptions.enabled === true;
    if (this.batch.enabled) {
      // Set upper cap on the batch payload size
      this.batch.maxSize = Math.min(
        batchOptions.maxSize ?? DEFAULT_MAX_BATCH_SIZE_BYTES,
        DEFAULT_MAX_BATCH_SIZE_BYTES,
      );
      this.batch.maxItems = batchOptions.maxItems ?? DEFAULT_MAX_BATCH_ITEMS;
      this.batch.flushInterval = batchOptions.flushInterval ?? DEFAULT_BATCH_FLUSH_INTERVAL_MS;
    }
  }

  flushBatchOnPageLeave() {
    if (this.batch.enabled) {
      onPageLeave(this.flushBatch);
    }
  }

  getStorageEntry(
    name: string,
  ): Nullable<QueueItem<QueueItemData>[] | Record<string, any> | number> {
    return this.store.get(name);
  }

  // TODO: fix the type of different queues to be the same if possible
  setStorageEntry(
    name: string,
    value?: Nullable<QueueItem<QueueItemData>[] | Record<string, any>> | number,
  ) {
    if (isNullOrUndefined(value)) {
      this.store.remove(name);
    } else {
      this.store.set(name, value);
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
    this.checkReclaim();
    this.processHead();
  }

  /**
   * Configures the timeout handler for flushing the batch queue
   */
  scheduleFlushBatch() {
    if (this.batch.enabled && this.batch?.flushInterval) {
      if (this.flushBatchTaskId) {
        this.schedule.cancel(this.flushBatchTaskId);
      }

      this.flushBatchTaskId = this.schedule.run(
        this.flushBatch,
        this.batch.flushInterval,
        ScheduleModes.ASAP,
      );
    }
  }

  /**
   * Flushes the batch queue
   */
  flushBatch(isAccessible = true) {
    if (!this.batchingInProgress) {
      this.isPageAccessible = isAccessible;
      this.batchingInProgress = true;
      let batchQueue =
        (this.getStorageEntry(QueueStatuses.BATCH_QUEUE) as Nullable<QueueItem[]>) ?? [];
      if (batchQueue.length > 0) {
        batchQueue = batchQueue.slice(-batchQueue.length);

        const batchEntry = this.genQueueItem(
          batchQueue.map(queueItem => queueItem.item),
          BATCH_QUEUE_ITEM_TYPE,
        );

        this.setStorageEntry(QueueStatuses.BATCH_QUEUE, []);

        this.pushToMainQueue(batchEntry);
      }
      this.batchingInProgress = false;

      // Re-schedule the flush task
      this.scheduleFlushBatch();
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
  handleNewItemForBatch(entry: QueueItem<QueueItemData>) {
    let curEntry: QueueItem<QueueItemData> | undefined;
    let batchQueue =
      (this.getStorageEntry(QueueStatuses.BATCH_QUEUE) as Nullable<QueueItem[]>) ?? [];

    if (!this.batchingInProgress) {
      this.batchingInProgress = true;
      batchQueue = batchQueue.slice(-batchQueue.length);
      batchQueue.push(entry);

      const batchDispatchInfo = this.getBatchDispatchInfo(batchQueue);
      // if batch criteria is met, queue the batch events to the main queue and clear batch queue
      if (batchDispatchInfo.criteriaMet || batchDispatchInfo.criteriaExceeded) {
        let batchEntries;
        if (batchDispatchInfo.criteriaExceeded) {
          batchEntries = batchQueue.slice(0, batchQueue.length - 1);
          batchQueue = [entry];
        } else {
          batchEntries = batchQueue;
          batchQueue = [];
        }

        // Don't make any batch request if there are no items
        if (batchEntries.length > 0) {
          const isReclaimed = batchEntries.every(queueItem => queueItem.reclaimed);
          const batchItems = batchEntries.map(queueItem => queueItem.item);
          if (isReclaimed) {
            curEntry = this.genQueueItem(batchItems, BATCH_QUEUE_ITEM_TYPE, true);
          } else {
            curEntry = this.genQueueItem(batchItems, BATCH_QUEUE_ITEM_TYPE);
          }
        }

        // re-attach the timeout handler
        this.scheduleFlushBatch();
      }
      this.batchingInProgress = false;
    } else {
      batchQueue.push(entry);
    }

    // update the batch queue
    this.setStorageEntry(QueueStatuses.BATCH_QUEUE, batchQueue);
    return curEntry;
  }

  pushToMainQueue(curEntry: QueueItem<QueueItemData>) {
    let queue =
      (this.getStorageEntry(QueueStatuses.QUEUE) as Nullable<QueueItem<QueueItemData>[]>) ?? [];

    queue = queue.slice(-(this.maxItems - 1));
    queue.push(curEntry);
    queue = queue.sort(sortByTime);

    this.setStorageEntry(QueueStatuses.QUEUE, queue);

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
  genQueueItem(
    itemData: QueueItemData,
    type: QueueItemType = SINGLE_QUEUE_ITEM_TYPE,
    reclaimed?: boolean,
  ): QueueItem<QueueItemData> {
    return {
      item: itemData,
      attemptNumber: 0,
      time: this.schedule.now(),
      id: generateUUID(),
      type,
      ...(isDefined(reclaimed) ? { reclaimed } : {}),
    };
  }

  /**
   * Adds an item to the retry queue
   *
   * @param {Object} qItem The item to process
   * @param {Error} [error] The error that occurred during processing
   */
  requeue(qItem: QueueItem<QueueItemData>, error?: Error) {
    const { attemptNumber, item, type, id, firstAttemptedAt, lastAttemptedAt, reclaimed } = qItem;
    // Increment the attempt number as we're about to retry
    const attemptNumberToUse = attemptNumber + 1;
    if (this.shouldRetry(item, attemptNumberToUse)) {
      this.enqueue({
        item,
        attemptNumber: attemptNumberToUse,
        time: this.schedule.now() + this.getDelay(attemptNumberToUse),
        id: id ?? generateUUID(),
        type,
        firstAttemptedAt: firstAttemptedAt,
        lastAttemptedAt: lastAttemptedAt,
        reclaimed: reclaimed,
      });
    } else {
      // Discard item
    }
  }

  /**
   * Returns the information about whether the batch criteria is met or exceeded
   * @param batchItems Prospective batch items
   * @returns Batch dispatch info
   */
  getBatchDispatchInfo(batchItems: QueueItem[]) {
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
      const curBatchSize = (this.batchSizeCalcCb as QueueBatchItemsSizeCalculatorCallback)(
        batchItems.map(queueItem => queueItem.item),
      );

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
    let queue =
      (this.getStorageEntry(QueueStatuses.QUEUE) as Nullable<QueueItem<QueueItemData>[]>) ?? [];
    const now = this.schedule.now();
    const toRun: InProgressQueueItem[] = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const processItemCallback = (el: QueueItem, id: string) => (err?: Error, res?: any) => {
      const inProgress =
        (this.getStorageEntry(QueueStatuses.IN_PROGRESS) as Nullable<Record<string, any>>) ?? {};
      const inProgressItem = inProgress[id];

      const firstAttemptedAt = inProgressItem?.firstAttemptedAt;
      const lastAttemptedAt = inProgressItem?.lastAttemptedAt;

      delete inProgress[id];

      this.setStorageEntry(QueueStatuses.IN_PROGRESS, inProgress);

      if (err) {
        this.requeue({ ...el, firstAttemptedAt, lastAttemptedAt }, err);
      }
    };

    const enqueueItem = (el: QueueItem, id: string) => {
      toRun.push({
        id,
        item: el.item,
        done: processItemCallback(el, id),
        attemptNumber: el.attemptNumber,
      });
    };

    let inProgress =
      (this.getStorageEntry(QueueStatuses.IN_PROGRESS) as Nullable<Record<string, any>>) ?? {};
    // If the page is unloading, clear the previous in progress queue also to avoid any stale data
    // Otherwise, the next page load will retry the items which were in progress previously
    if (!this.isPageAccessible) {
      inProgress = {};
    }
    let inProgressSize = Object.keys(inProgress).length;

    // eslint-disable-next-line no-plusplus
    while (
      queue.length > 0 &&
      (queue[0] as QueueItem).time <= now &&
      inProgressSize++ < this.maxItems
    ) {
      const el = queue.shift();
      if (el) {
        const id = generateUUID();

        // If the page is unloading, don't add items to the in progress queue
        if (this.isPageAccessible) {
          // Save this to the in progress map
          inProgress[id] = {
            item: el.item,
            attemptNumber: el.attemptNumber,
            time: this.schedule.now(),
            type: el.type,
            firstAttemptedAt: el.firstAttemptedAt,
            lastAttemptedAt: el.lastAttemptedAt,
            reclaimed: el.reclaimed,
          };
        }

        enqueueItem(el, id);
      }
    }

    this.setStorageEntry(QueueStatuses.QUEUE, queue);
    this.setStorageEntry(QueueStatuses.IN_PROGRESS, inProgress);

    toRun.forEach(el => {
      // TODO: handle processQueueCb timeout
      try {
        const now = this.schedule.now();

        const inProgress =
          (this.getStorageEntry(QueueStatuses.IN_PROGRESS) as Nullable<Record<string, any>>) ?? {};
        const inProgressItem = inProgress[el.id];

        const firstAttemptedAt = inProgressItem?.firstAttemptedAt ?? now;
        const lastAttemptedAt = inProgressItem?.lastAttemptedAt ?? now;

        // A decimal integer representing the seconds since the first attempt
        const timeSinceFirstAttempt = Math.round((now - firstAttemptedAt) / 1000);

        // A decimal integer representing the seconds since the last attempt
        const timeSinceLastAttempt = Math.round((now - lastAttemptedAt) / 1000);

        // Indicates if the item has been reclaimed from local storage
        const reclaimed = inProgressItem?.reclaimed ?? false;

        // Update the first attempted at timestamp for the in progress item
        inProgressItem.firstAttemptedAt = firstAttemptedAt;
        // Update the last attempted at to current timestamp for the in progress item
        inProgressItem.lastAttemptedAt = now;

        inProgress[el.id] = inProgressItem;
        this.setStorageEntry(QueueStatuses.IN_PROGRESS, inProgress);

        const willBeRetried = this.shouldRetry(el.item, el.attemptNumber + 1);
        this.processQueueCb(el.item, el.done, {
          retryAttemptNumber: el.attemptNumber,
          maxRetryAttempts: this.maxAttempts,
          willBeRetried,
          timeSinceFirstAttempt,
          timeSinceLastAttempt,
          reclaimed,
        });
      } catch (err) {
        this.logger?.error(RETRY_QUEUE_PROCESS_ERROR(RETRY_QUEUE), err);
      }
    });

    // re-read the queue in case the process function finished immediately or added another item
    queue =
      (this.getStorageEntry(QueueStatuses.QUEUE) as Nullable<QueueItem<QueueItemData>[]>) ?? [];
    this.schedule.cancel(this.processId);

    if (queue.length > 0) {
      const nextProcessExecutionTime = (queue[0] as QueueItem).time - now;
      this.processId = this.schedule.run(
        this.processHead,
        nextProcessExecutionTime,
        ScheduleModes.ASAP,
      );
    }
  }

  // Ack continuously to prevent other tabs from claiming our queue
  ack() {
    this.setStorageEntry(QueueStatuses.ACK, this.schedule.now());

    if (this.reclaimStartVal != null) {
      this.reclaimStartVal = null;
      this.setStorageEntry(QueueStatuses.RECLAIM_START, null);
    }

    if (this.reclaimEndVal != null) {
      this.reclaimEndVal = null;
      this.setStorageEntry(QueueStatuses.RECLAIM_END, null);
    }

    this.schedule.run(this.ack, this.timeouts.ackTimer, ScheduleModes.ASAP);
  }

  reclaim(id: string) {
    const other = this.storeManager.setStore({
      id,
      name: this.name,
      validKeys: QueueStatuses,
      type: LOCAL_STORAGE,
      errorHandler: this.storeManager.errorHandler,
      logger: this.storeManager.logger,
    });
    const our = {
      queue: (this.getStorageEntry(QueueStatuses.QUEUE) ?? []) as QueueItem[],
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
        const id = el.id ?? generateUUID();

        if (trackMessageIds.includes(id)) {
          // duplicated event
        } else {
          // Hack to determine the item type by the contents of the entry
          // After some point, we can remove this hack as most of the stale data will have been processed
          // and the new entries will have the type field set
          const type = Array.isArray(el.item) ? BATCH_QUEUE_ITEM_TYPE : SINGLE_QUEUE_ITEM_TYPE;

          our.queue.push({
            item: el.item,
            attemptNumber: el.attemptNumber + incrementAttemptNumberBy,
            time: this.schedule.now(),
            id,
            type: el.type ?? type,
            firstAttemptedAt: el.firstAttemptedAt,
            lastAttemptedAt: el.lastAttemptedAt,
            // Mark the item as reclaimed from local storage
            reclaimed: true,
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
    if (this.batch.enabled) {
      their.batchQueue.forEach((el: QueueItem) => {
        const id = el.id ?? generateUUID();
        if (trackMessageIds.includes(id)) {
          // duplicated event
        } else {
          this.enqueue({
            ...el,
            id,
            // Mark the item as reclaimed from local storage
            reclaimed: true,
            type: el.type ?? SINGLE_QUEUE_ITEM_TYPE,
            time: this.schedule.now(),
          });
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

    this.setStorageEntry(QueueStatuses.QUEUE, our.queue);

    // remove all keys one by on next tick to avoid NS_ERROR_STORAGE_BUSY error
    this.clearQueueEntries(other, 1);

    // process the new items we claimed
    this.processHead();
  }

  // eslint-disable-next-line class-methods-use-this
  clearQueueEntries(other: IStore, localStorageBackoff: number) {
    this.removeStorageEntry(other, 0, localStorageBackoff);
  }

  removeStorageEntry(store: IStore, entryIdx: number, backoff: number, attempt = 1) {
    const maxAttempts = 2;
    const queueEntryKeys = Object.keys(QueueStatuses);
    const entry = QueueStatuses[queueEntryKeys[entryIdx] as keyof typeof QueueStatuses];

    (globalThis as typeof window).setTimeout(() => {
      try {
        store.remove(entry);

        // clear the next entry
        if (entryIdx + 1 < queueEntryKeys.length) {
          this.removeStorageEntry(store, entryIdx + 1, backoff);
        }
      } catch (err) {
        const storageBusyErr = 'NS_ERROR_STORAGE_BUSY';
        const isLocalStorageBusy =
          (err as any).name === storageBusyErr ||
          (err as any).code === storageBusyErr ||
          (err as any).code === 0x80630001;

        if (isLocalStorageBusy && attempt < maxAttempts) {
          // Try clearing the same entry again with some extra delay
          this.removeStorageEntry(store, entryIdx, backoff + 40, attempt + 1);
        } else {
          this.logger?.error(RETRY_QUEUE_ENTRY_REMOVE_ERROR(RETRY_QUEUE, entry, attempt), err);
        }

        // clear the next entry after we've exhausted our attempts
        if (attempt === maxAttempts && entryIdx + 1 < queueEntryKeys.length) {
          this.removeStorageEntry(store, entryIdx + 1, backoff);
        }
      }
    }, backoff);
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
      const storageEngine = this.store.getOriginalEngine();
      let storageKeys = [];
      // 'keys' API is not supported by all the core SDK versions
      // Hence, we need this backward compatibility check
      if (isFunction(storageEngine.keys)) {
        storageKeys = storageEngine.keys();
      } else {
        for (let i = 0; i < storageEngine.length; i++) {
          const key = storageEngine.key(i);
          if (key) {
            storageKeys.push(key);
          }
        }
      }

      storageKeys.forEach((k: string) => {
        const keyParts: string[] = k ? k.split('.') : [];

        if (
          keyParts.length >= 3 &&
          keyParts[0] === name &&
          keyParts[1] !== this.id &&
          keyParts[2] === QueueStatuses.ACK
        ) {
          res.push(
            this.storeManager.setStore({
              id: keyParts[1] as string,
              name,
              validKeys: QueueStatuses,
              type: LOCAL_STORAGE,
              errorHandler: this.storeManager.errorHandler,
              logger: this.storeManager.logger,
            }),
          );
        }
      });

      return res;
    };

    findOtherQueues(this.name).forEach(store => {
      if (this.schedule.now() - store.get(QueueStatuses.ACK) < this.timeouts.reclaimTimeout) {
        return;
      }

      tryReclaim(store);
    });

    this.schedule.run(this.checkReclaim, this.timeouts.reclaimTimer, ScheduleModes.RESCHEDULE);
  }

  clear() {
    this.schedule.cancelAll();
    this.setDefaultQueueEntries();
  }
}

export { RetryQueue };
