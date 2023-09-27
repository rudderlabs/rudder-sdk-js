const DEFAULT_TRANSFORMATION_QUEUE_OPTIONS = {
  minRetryDelay: 500,
  backoffFactor: 2,
  maxAttempts: 3,
};

const REQUEST_TIMEOUT_MS = 10 * 1000; // 10 seconds

const QUEUE_NAME = 'dmt';

export { DEFAULT_TRANSFORMATION_QUEUE_OPTIONS, REQUEST_TIMEOUT_MS, QUEUE_NAME };
