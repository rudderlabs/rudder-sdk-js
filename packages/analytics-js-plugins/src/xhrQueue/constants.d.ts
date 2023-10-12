declare const DEFAULT_RETRY_QUEUE_OPTIONS: {
  maxRetryDelay: number;
  minRetryDelay: number;
  backoffFactor: number;
  maxAttempts: number;
  maxItems: number;
};
declare const REQUEST_TIMEOUT_MS: number;
declare const DATA_PLANE_API_VERSION = 'v1';
declare const QUEUE_NAME = 'rudder';
declare const XHR_QUEUE_PLUGIN = 'XhrQueuePlugin';
export {
  DEFAULT_RETRY_QUEUE_OPTIONS,
  REQUEST_TIMEOUT_MS,
  DATA_PLANE_API_VERSION,
  QUEUE_NAME,
  XHR_QUEUE_PLUGIN,
};
