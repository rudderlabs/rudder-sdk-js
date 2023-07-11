import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';

export type BeaconQueueItem = {
  event: RudderEvent;
};

export type BeaconBatchData = {
  batch: RudderEvent[];
};
