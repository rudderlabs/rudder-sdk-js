import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';

export type XHRQueueItemData = {
  url: string;
  headers: Record<string, string>;
  event: RudderEvent;
};

export type XHRBatchQueueItemData = XHRQueueItemData[];

export type RetryQueueItemData = XHRQueueItemData | XHRBatchQueueItemData;
