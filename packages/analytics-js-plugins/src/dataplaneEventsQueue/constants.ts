const MAX_EVENT_PAYLOAD_SIZE_BYTES = 32 * 1024; // 32 KB

const DEFAULT_QUEUE_OPTIONS = {
  maxRetryDelay: 360000,
  minRetryDelay: 1000,
  backoffFactor: 2,
  maxAttempts: 10,
  maxItems: 100,
};

const REQUEST_TIMEOUT_MS = 10 * 1000; // 10 seconds

export { MAX_EVENT_PAYLOAD_SIZE_BYTES, DEFAULT_QUEUE_OPTIONS, REQUEST_TIMEOUT_MS };
