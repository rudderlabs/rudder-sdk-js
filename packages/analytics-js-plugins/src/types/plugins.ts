import { IStore, IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';

export type { Bugsnag as BugsnagLib } from '@bugsnag/js';

// Not using the analytics-js package enums to avoid generation of another shared bundle
export type PluginName =
  | 'BeaconQueue'
  | 'DeviceModeDestinations'
  | 'DeviceModeTransformation'
  | 'ErrorReporting'
  | 'ExternalAnonymousId'
  | 'GoogleLinker'
  | 'NativeDestinationQueue'
  | 'StorageEncryption'
  | 'StorageEncryptionLegacy'
  | 'StorageMigrator'
  | 'XhrQueue'
  | 'OneTrustConsentManager'
  | 'KetchConsentManager'
  | 'Bugsnag';

export type RudderEventType = 'page' | 'track' | 'identify' | 'alias' | 'group';

export type LogLevel = 'LOG' | 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | 'NONE';

export type QueueItem<T = Record<string, any> | string | number> = {
  item: T;
  attemptNumber: number;
  time: number;
  id: string;
};

export type QueueItemData = Record<string, any> | string | number;

/**
 * @callback processFunc
 * @param {any} item The item added to the queue to process
 * @param {Function} done A function to call when processing is completed.
 * @param {Number} retryAttemptNumber The number of times this item has been attempted to retry
 * @param {Number} maxRetryAttempts The maximum number of times this item should be attempted to retry
 * @param {Number} willBeRetried A boolean indicating if the item will be retried later
 */
export type QueueProcessCallback<T = any> = (
  item: T,
  done: DoneCallback,
  retryAttemptNumber?: number,
  maxRetryAttempts?: number,
  willBeRetried?: boolean,
) => void;

export type QueueItemSizeCalculatorCallback<T = any> = (item: T) => number;

/**
 * @callback doneCallback
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
  attachListeners?(): void;
  getQueue(name?: string): Nullable<QueueItem<T>[] | Record<string, any> | number>;
  setQueue(name?: string, value?: Nullable<QueueItem<T>[] | Record<string, any> | number>): void;
  start(): void;
  stop(): void;
  enqueue(item: QueueItem<T>): void;
  addItem(item: T): void;
}
