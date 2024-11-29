import type { IStoreManager } from '../../types/Store';

export type DoneCallback = (error?: any, response?: any) => void;

export type QueueItemType = 'Single' | 'Batch';

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

export type ProcessQueueItem<T> = {
  item: T | T[];
  attemptNumber: number;
  done: DoneCallback;
};

export type QueueItem<T> = {
  item: T | T[];
  attemptNumber: number;
  time: number;
  id: string;
  type: QueueItemType;
};

export type QueueItemData =
  | Record<string, any>
  | string
  | number
  | Record<string, any>[]
  | string[]
  | number[];

export type QueueData<T> = QueueItem<T>[];

/**
 * @callback QueueProcessCallback
 * @param {any} item The item added to the queue to process
 * @param {Function} done A function to call when processing is completed.
 * @param {Number} retryAttemptNumber The number of times this item has been attempted to retry
 * @param {Number} maxRetryAttempts The maximum number of times this item should be attempted to retry
 * @param {Number} willBeRetried A boolean indicating if the item will be retried later
 * @param {Number} isPageAccessible A boolean indicating if the page is accessible
 */
export type QueueProcessCallback<T = QueueItemData> = (
  item: T,
  done: DoneCallback,
  retryAttemptNumber?: number,
  maxRetryAttempts?: number,
  willBeRetried?: boolean,
  isPageAccessible?: boolean,
) => void;

export type QueueBatchItemsSizeCalculatorCallback<T> = (items: T[]) => number;

/**
 * @callback DoneCallback
 * @param {Error} Optional error parameter if the processing failed
 * @param {Response} Optional response parameter to emit for async handling
 */

export interface IQueue<T = any> {
  name: string;
  id: string;
  storeManager: IStoreManager;
  scheduleTimeoutActive: boolean;
  start(): void;
  stop(): void;
  addItem(item: T): void;
  clear(): void;
}
