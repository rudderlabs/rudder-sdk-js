import type { DoneCallback } from '../../types/plugins';

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
  id: string;
  item: Record<string, any> | string | number | Record<string, any>[] | string[] | number[];
  done: DoneCallback;
  attemptNumber: number;
};
