declare const DEFAULT_TRANSFORMATION_QUEUE_OPTIONS: {
  minRetryDelay: number;
  backoffFactor: number;
  maxAttempts: number;
};
declare const REQUEST_TIMEOUT_MS: number;
declare const QUEUE_NAME = 'rudder';
declare const DMT_PLUGIN = 'DeviceModeTransformationPlugin';
export { DEFAULT_TRANSFORMATION_QUEUE_OPTIONS, REQUEST_TIMEOUT_MS, QUEUE_NAME, DMT_PLUGIN };
