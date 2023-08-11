import { DoneCallback } from '../../types/plugins';

export interface QueueOptions {
  maxItems?: number;
  maxAttempts?: number;
  minRetryDelay?: number;
  maxRetryDelay?: number;
  backoffFactor?: number;
  backoffJitter?: number;
}

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
  item: Record<string, any> | string | number;
  done: DoneCallback;
  attemptNumber: number;
};
