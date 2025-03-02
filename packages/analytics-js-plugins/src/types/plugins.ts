import type { IStore, IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';

export type RudderEventType = 'page' | 'track' | 'identify' | 'alias' | 'group';

export type LogLevel = 'LOG' | 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | 'NONE';

export type QueueItemType = 'Single' | 'Batch';

export type QueueItem<T = QueueItemData> = {
  item: T;
  attemptNumber: number;
  time: number;
  id: string;
  type: QueueItemType;
  lastAttemptedAt?: number;
  firstAttemptedAt?: number;
  reclaimed?: boolean;
};

export type QueueItemData =
  | Record<string, any>
  | string
  | number
  | Record<string, any>[]
  | string[]
  | number[];

/**
 * @typedef {Object} QueueProcessCallbackInfo
 * @property {number} retryAttemptNumber The number of times this item has been attempted to retry
 * @property {number} maxRetryAttempts The maximum number of times this item should be attempted to retry
 * @property {boolean} willBeRetried A boolean indicating if the item will be retried later
 * @property {number} timeSinceFirstAttempt The number of seconds since the first attempt
 * @property {number} timeSinceLastAttempt The number of seconds since the last attempt
 * @property {boolean} reclaimed A boolean indicating if the item has been reclaimed
 */
export type QueueProcessCallbackInfo = {
  retryAttemptNumber: number;
  maxRetryAttempts: number;
  willBeRetried: boolean;
  timeSinceLastAttempt: number;
  timeSinceFirstAttempt: number;
  reclaimed: boolean;
};

/**
 * @callback QueueProcessCallback
 * @param {any} item The item added to the queue to process
 * @param {Function} done A function to call when processing is completed.
 * @param {Object} info An object containing the following properties:
 *   - retryAttemptNumber: The number of times this item has been attempted to retry
 *   - maxRetryAttempts: The maximum number of times this item should be attempted to retry
 *   - willBeRetried: A boolean indicating if the item will be retried later
 *   - timeSinceLastAttempt: The number of seconds since the last attempt
 *   - timeSinceFirstAttempt: The number of seconds since the first attempt
 *   - reclaimed: A boolean indicating if the item has been reclaimed
 */
export type QueueProcessCallback<T = any> = (
  item: T,
  done: DoneCallback,
  info: QueueProcessCallbackInfo,
) => void;

export type QueueBatchItemsSizeCalculatorCallback<T = any> = (item: T) => number;

/**
 * @callback DoneCallback
 * @param {Error} Optional error parameter if the processing failed
 * @param {Response} Optional response parameter to emit for async handling
 */
export type DoneCallback = (error?: any, response?: any) => void;

export interface IQueue<T = any> {
  name: string;
  id: string;
  processQueueCb: QueueProcessCallback;
  store: IStore;
  storeManager: IStoreManager;
  maxItems: number;
  timeouts: Record<string, number>;
  scheduleTimeoutActive: boolean;
  getStorageEntry(name?: string): Nullable<QueueItem<T>[] | Record<string, any> | number>;
  setStorageEntry(
    name?: string,
    value?: Nullable<QueueItem<T>[] | Record<string, any> | number>,
  ): void;
  start(): void;
  stop(): void;
  enqueue(item: QueueItem<T>): void;
  addItem(item: T): void;
}
