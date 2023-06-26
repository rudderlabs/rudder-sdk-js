import { RudderEvent } from '@rudderstack/common/types/common';

export type BeaconQueueItem = {
  event: RudderEvent;
};

export type BeaconBatchData = {
  batch: RudderEvent[];
};
