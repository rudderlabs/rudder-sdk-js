declare const MAX_BATCH_PAYLOAD_SIZE_BYTES: number;
declare const DEFAULT_BEACON_QUEUE_OPTIONS: {
  maxItems: number;
  flushQueueInterval: number;
};
declare const REQUEST_TIMEOUT_MS: number;
declare const DATA_PLANE_API_VERSION = 'v1';
declare const QUEUE_NAME = 'rudder_beacon';
declare const BEACON_QUEUE_PLUGIN = 'BeaconQueuePlugin';
export {
  MAX_BATCH_PAYLOAD_SIZE_BYTES,
  DEFAULT_BEACON_QUEUE_OPTIONS,
  REQUEST_TIMEOUT_MS,
  DATA_PLANE_API_VERSION,
  QUEUE_NAME,
  BEACON_QUEUE_PLUGIN,
};
