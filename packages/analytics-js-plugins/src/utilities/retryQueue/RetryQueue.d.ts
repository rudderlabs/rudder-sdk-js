import { IStore, IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { BatchOpts, QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import {
  IQueue,
  QueueItem,
  QueueItemData,
  QueueBatchItemsSizeCalculatorCallback,
  QueueProcessCallback,
} from '../../types/plugins';
import { Schedule } from './Schedule';
import { QueueTimeouts, QueueBackoff } from './types';
/**
 * Constructs a RetryQueue backed by localStorage
 *
 * @constructor
 * @param {String} name The name of the queue. Will be used to find abandoned queues and retry their items
 * @param {Object} [opts] Optional argument to override `maxItems`, `maxAttempts`, `minRetryDelay, `maxRetryDelay`, `backoffFactor` and `backoffJitter`.
 * @param {QueueProcessCallback} fn The function to call in order to process an item added to the queue
 */
declare class RetryQueue implements IQueue<QueueItemData> {
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
  constructor(
    name: string,
    options: QueueOpts,
    queueProcessCb: QueueProcessCallback,
    storeManager: IStoreManager,
    storageType?: StorageType,
    logger?: ILogger,
    queueBatchItemsSizeCalculatorCb?: QueueBatchItemsSizeCalculatorCallback,
  );
  configureBatchMode(options: QueueOpts): void;
  attachListeners(): void;
  getQueue(name?: string): Nullable<QueueItem<QueueItemData>[] | Record<string, any> | number>;
  setQueue(
    name?: string,
    value?: Nullable<QueueItem<QueueItemData>[] | Record<string, any>> | number,
  ): void;
  /**
   * Stops processing the queue
   */
  stop(): void;
  /**
   * Starts processing the queue
   */
  start(): void;
  /**
   * Configures the timeout handler for flushing the batch queue
   */
  scheduleFlushBatch(): void;
  /**
   * Flushes the batch queue
   */
  flushBatch(): void;
  /**
   * Decides whether to retry. Overridable.
   *
   * @param {Object} item The item being processed
   * @param {Number} attemptNumber The attemptNumber (1 for first retry)
   * @return {Boolean} Whether to requeue the message
   */
  shouldRetry(item: QueueItemData, attemptNumber: number): boolean;
  /**
   * Calculates the delay (in ms) for a retry attempt
   *
   * @param {Number} attemptNumber The attemptNumber (1 for first retry)
   * @return {Number} The delay in milliseconds to wait before attempting a retry
   */
  getDelay(attemptNumber: number): number;
  enqueue(entry: QueueItem<QueueItemData>): void;
  /**
   * Handles a new item added to the retry queue when batching is enabled
   * @param entry New item added to the retry queue
   * @returns Undefined or batch entry object
   */
  handleNewItemForBatch(entry: QueueItem<QueueItemData>): QueueItem<QueueItemData> | undefined;
  pushToMainQueue(curEntry: QueueItem<QueueItemData>): void;
  /**
   * Adds an item to the queue
   *
   * @param {Object} itemData The item to process
   */
  addItem(itemData: QueueItemData): void;
  /**
   * Generates a queue item
   * @param itemData Queue item data
   * @returns Queue item
   */
  genQueueItem(itemData: QueueItemData): QueueItem<QueueItemData>;
  /**
   * Adds an item to the retry queue
   *
   * @param {Object} itemData The item to retry
   * @param {Number} attemptNumber The attempt number (1 for first retry)
   * @param {Error} [error] The error from previous attempt, if there was one
   * @param {String} [id] The id of the queued message used for tracking duplicate entries
   */
  requeue(itemData: QueueItemData, attemptNumber: number, error?: Error, id?: string): void;
  /**
   * Returns the information about whether the batch criteria is met or exceeded
   * @param batchItems Prospective batch items
   * @returns Batch dispatch info
   */
  getBatchDispInfo(batchItems: QueueItem[]): {
    criteriaMet: boolean;
    criteriaExceeded: boolean;
  };
  processHead(): void;
  ack(): void;
  reclaim(id: string): void;
  clearOtherQueue(other: IStore, localStorageBackoff: number): void;
  removeStorageEntry(store: IStore, entryIdx: number, backoff: number, attempt?: number): void;
  checkReclaim(): void;
}
export { RetryQueue };
