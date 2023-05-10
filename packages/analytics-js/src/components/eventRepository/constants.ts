const DEFAULT_QUEUE_OPTIONS = {
  maxRetryDelay: 360000, // 6 minutes
  minRetryDelay: 1000, // 1 second
  backoffFactor: 2,
  maxAttempts: 10,
  maxItems: 100,
};

const MAX_EVENT_PAYLOAD_SIZE = 32 * 1024; // ~32 KB

export { DEFAULT_QUEUE_OPTIONS, MAX_EVENT_PAYLOAD_SIZE };
