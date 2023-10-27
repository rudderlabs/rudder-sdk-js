import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';

export type BeaconQueueItemData = {
  event: RudderEvent;
};

export type BeaconQueueBatchItemData = BeaconQueueItemData[];

export type BeaconBatchData = {
  batch: RudderEvent[];
};
