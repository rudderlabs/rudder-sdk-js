import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';

export type FetchQueueItemData = {
  url: string;
  headers: Record<string, string>;
  event: RudderEvent;
};

export type FetchQueueBatchItemData = FetchQueueItemData[];

export type FetchRetryQueueItemData = FetchQueueItemData | FetchQueueBatchItemData;

export type FetchBatchPayload = {
  batch: RudderEvent[];
  sentAt: string;
};
