import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
export type XHRQueueItemData = {
  url: string;
  headers: Record<string, string>;
  event: RudderEvent;
};
export type XHRQueueBatchItemData = XHRQueueItemData[];
export type XHRRetryQueueItemData = XHRQueueItemData | XHRQueueBatchItemData;
export type XHRBatchPayload = {
  batch: RudderEvent[];
};
