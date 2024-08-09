const DEFAULT_RETRY_QUEUE_OPTIONS = {
  maxRetryDelay: 360000,
  minRetryDelay: 1000,
  backoffFactor: 2,
  maxAttempts: 10,
  maxItems: 100,
};

const REQUEST_TIMEOUT_MS = 30 * 1000; // 30 seconds

const DATA_PLANE_API_VERSION = 'v1';

const QUEUE_NAME = 'rudder';

const FETCH_QUEUE_PLUGIN = 'FetchQueuePlugin';

export {
  DEFAULT_RETRY_QUEUE_OPTIONS,
  REQUEST_TIMEOUT_MS,
  DATA_PLANE_API_VERSION,
  QUEUE_NAME,
  FETCH_QUEUE_PLUGIN,
};
