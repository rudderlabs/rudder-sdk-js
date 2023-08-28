const DEFAULT_MIN_RETRY_DELAY_MS = 1000;
const DEFAULT_MAX_RETRY_DELAY_MS = 30000;
const DEFAULT_BACKOFF_FACTOR = 2;
const DEFAULT_BACKOFF_JITTER = 0;

const DEFAULT_MAX_RETRY_ATTEMPTS = Infinity;
const DEFAULT_MAX_ITEMS = Infinity;

const DEFAULT_ACK_TIMER_MS = 1000;
const DEFAULT_RECLAIM_TIMER_MS = 3000;
const DEFAULT_RECLAIM_TIMEOUT_MS = 10000;
const DEFAULT_RECLAIM_WAIT_MS = 500;

const DEFAULT_MAX_BATCH_SIZE_BYTES = 1024 * 1024; // 1MB
const DEFAULT_MAX_BATCH_ITEMS = 100;

export {
  DEFAULT_MIN_RETRY_DELAY_MS,
  DEFAULT_MAX_RETRY_DELAY_MS,
  DEFAULT_BACKOFF_FACTOR,
  DEFAULT_BACKOFF_JITTER,
  DEFAULT_MAX_RETRY_ATTEMPTS,
  DEFAULT_MAX_ITEMS,
  DEFAULT_ACK_TIMER_MS,
  DEFAULT_RECLAIM_TIMER_MS,
  DEFAULT_RECLAIM_TIMEOUT_MS,
  DEFAULT_RECLAIM_WAIT_MS,
  DEFAULT_MAX_BATCH_SIZE_BYTES,
  DEFAULT_MAX_BATCH_ITEMS,
};
