/* eslint-disable import/no-extraneous-dependencies */
export {
  isFunction,
  isUndefined,
  isNullOrUndefined,
} from '@rudderstack/analytics-js/components/utilities/checks';
export { getCurrentTimeFormatted } from '@rudderstack/analytics-js/components/utilities/timestamp';
export { toBase64, fromBase64 } from '@rudderstack/analytics-js/components/utilities/string';
export { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
export { stringifyWithoutCircular } from '@rudderstack/analytics-js/components/utilities/json';
export { generateUUID } from '@rudderstack/analytics-js/components/utilities/uuId';
export {
  pageArgumentsToCallOptions,
  trackArgumentsToCallOptions,
  identifyArgumentsToCallOptions,
  aliasArgumentsToCallOptions,
  groupArgumentsToCallOptions,
} from '@rudderstack/analytics-js/components/core/eventMethodOverloads';

export { isHybridModeDestination } from '@rudderstack/analytics-js/components/utilities/destinations';

export { ExternalSrcLoader } from '@rudderstack/analytics-js/services/ExternalSrcLoader/ExternalSrcLoader';

export {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  SESSION_STORAGE,
  MEMORY_STORAGE,
} from '@rudderstack/analytics-js/constants/storages';

export { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js/constants/logMessages';