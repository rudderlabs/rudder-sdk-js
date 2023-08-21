import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';

export type BeaconQueueItemData = {
  event: RudderEvent;
};

export type BeaconBatchData = {
  batch: RudderEvent[];
};
