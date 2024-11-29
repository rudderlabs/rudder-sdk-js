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
const MIN_TIMER_SCALE_FACTOR = 1;
const MAX_TIMER_SCALE_FACTOR = 10;

const DEFAULT_MAX_BATCH_SIZE_BYTES = 512 * 1024; // 512 KB; this is also the max size of a batch
const DEFAULT_MAX_BATCH_ITEMS = 100;
const DEFAULT_BATCH_FLUSH_INTERVAL_MS = 10 * 1000; // 10 seconds

const MAX_PAGE_UNLOAD_BATCH_SIZE_BYTES = 64 * 1024; // 64 KB

const RETRY_QUEUE = 'RetryQueue';

const DEFAULT_BACKOFF_DELETION = 1;
const MAX_ATTEMPTS_ENTRY_DELETION = 2;
const RETRY_DELAY_ENTRY_DELETION = 40;

// Queue entries
const IN_PROGRESS = 'inProgress';
const QUEUE = 'queue';
const RECLAIM_START = 'reclaimStart';
const RECLAIM_END = 'reclaimEnd';
const ACK = 'ack';
const BATCH_QUEUE = 'batchQueue';

// The ACK entry is intentionally kept as the last item in the array
// to ensure that it is the last one to be processed (deleted) during the cleanup
const QueueStatuses = [IN_PROGRESS, QUEUE, BATCH_QUEUE, RECLAIM_START, RECLAIM_END, ACK];

const BATCH_QUEUE_ITEM_TYPE = 'Batch';
const SINGLE_QUEUE_ITEM_TYPE = 'Single';

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
  DEFAULT_BATCH_FLUSH_INTERVAL_MS,
  MIN_TIMER_SCALE_FACTOR,
  MAX_TIMER_SCALE_FACTOR,
  MAX_PAGE_UNLOAD_BATCH_SIZE_BYTES,
  RETRY_QUEUE,
  QueueStatuses,
  IN_PROGRESS,
  QUEUE,
  RECLAIM_START,
  RECLAIM_END,
  ACK,
  BATCH_QUEUE,
  MAX_ATTEMPTS_ENTRY_DELETION,
  RETRY_DELAY_ENTRY_DELETION,
  DEFAULT_BACKOFF_DELETION,
  BATCH_QUEUE_ITEM_TYPE,
  SINGLE_QUEUE_ITEM_TYPE,
};
