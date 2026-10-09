const DEFAULT_RETRY_QUEUE_OPTIONS = {
  maxRetryDelay: 540000,
  minRetryDelay: 1000,
  backoffFactor: 2,
  backoffJitter: 0.2,
  maxAttempts: 30, // ~3h of retries at these delays
  maxItems: 100,
};

const REQUEST_TIMEOUT_MS = 30 * 1000; // 30 seconds

const DATA_PLANE_API_VERSION = 'v1';

const QUEUE_NAME = 'rudder';

const XHR_QUEUE_PLUGIN = 'XhrQueuePlugin';

export {
  DEFAULT_RETRY_QUEUE_OPTIONS,
  REQUEST_TIMEOUT_MS,
  DATA_PLANE_API_VERSION,
  QUEUE_NAME,
  XHR_QUEUE_PLUGIN,
};
