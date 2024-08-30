import type { Nullable } from '../../types/Nullable';
import type { IStore, IStoreManager } from '../../types/Store';

export type DoneCallback = (error?: any, response?: any) => void;

export type QueueBackoff = {
  minRetryDelay: number;
  maxRetryDelay: number;
  factor: number;
  jitter: number;
};

export type QueueTimeouts = {
  ackTimer: number;
  reclaimTimer: number;
  reclaimTimeout: number;
  reclaimWait: number;
};

export type InProgressQueueItem = {
  item: Record<string, any> | string | number | Record<string, any>[] | string[] | number[];
  done: DoneCallback;
  attemptNumber: number;
};

export type QueueItem<T = QueueItemData> = {
  item: T;
  attemptNumber: number;
  time: number;
  id: string;
};

export type QueueItemData =
  | Record<string, any>
  | string
  | number
  | Record<string, any>[]
  | string[]
  | number[];

/**
 * @callback QueueProcessCallback
 * @param {any} item The item added to the queue to process
 * @param {Function} done A function to call when processing is completed.
 * @param {Number} retryAttemptNumber The number of times this item has been attempted to retry
 * @param {Number} maxRetryAttempts The maximum number of times this item should be attempted to retry
 * @param {Number} willBeRetried A boolean indicating if the item will be retried later
 * @param {Number} isPageAccessible A boolean indicating if the page is accessible
 */
export type QueueProcessCallback<T = any> = (
  item: T,
  done: DoneCallback,
  retryAttemptNumber?: number,
  maxRetryAttempts?: number,
  willBeRetried?: boolean,
  isPageAccessible?: boolean,
) => void;

export type QueueBatchItemsSizeCalculatorCallback<T = any> = (item: T) => number;

/**
 * @callback DoneCallback
 * @param {Error} Optional error parameter if the processing failed
 * @param {Response} Optional response parameter to emit for async handling
 */

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
