import { RudderEvent } from '../types/common';

export type BeaconQueueItem = {
  event: RudderEvent;
};

export type BeaconBatchData = {
  batch: RudderEvent[];
};
