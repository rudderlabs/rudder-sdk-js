import type { QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';

const QUEUE_NAME = 'rudder';

const DATA_PLANE_API_VERSION = 'v1';

const DEFAULT_RETRY_QUEUE_OPTIONS: QueueOpts = {
  maxRetryDelay: 360000,
  minRetryDelay: 1000,
  backoffFactor: 2,
  maxAttempts: 10,
  maxItems: 100,
  batch: {
    enabled: true,
    flushInterval: 1000, // 1 second
  },
};

const REQUEST_TIMEOUT_MS = 30 * 1000; // 30 seconds

const DATA_PLANE_EVENTS_QUEUE = 'DataPlaneEventsQueue';

const EVENT_PAYLOAD_SIZE_BYTES_LIMIT = 32 * 1024; // 32 KB

export {
  QUEUE_NAME,
  DEFAULT_RETRY_QUEUE_OPTIONS,
  DATA_PLANE_API_VERSION,
  REQUEST_TIMEOUT_MS,
  DATA_PLANE_EVENTS_QUEUE,
  EVENT_PAYLOAD_SIZE_BYTES_LIMIT,
};
