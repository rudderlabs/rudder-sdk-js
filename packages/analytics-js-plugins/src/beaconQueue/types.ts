import { RudderEvent } from '@rudderstack/common/types/Event';

export type BeaconQueueItem = {
  event: RudderEvent;
};

export type BeaconBatchData = {
  batch: RudderEvent[];
};
