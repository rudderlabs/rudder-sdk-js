/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-relative-packages */
export { isFunction, isUndefined } from '../../../analytics-js/src/components/utilities/checks';
export { getCurrentTimeFormatted } from '../../../analytics-js/src/components/utilities/timestamp';
export { toBase64 } from '../../../analytics-js/src/components/utilities/string';
export { mergeDeepRight } from '../../../analytics-js/src/components/utilities/object';
export { stringifyWithoutCircular } from '../../../analytics-js/src/components/utilities/json';
export { generateUUID } from '../../../analytics-js/src/components/utilities/uuId';
export {
  pageArgumentsToCallOptions,
  trackArgumentsToCallOptions,
  identifyArgumentsToCallOptions,
  aliasArgumentsToCallOptions,
  groupArgumentsToCallOptions,
} from '../../../analytics-js/src/components/core/eventMethodOverloads';

export { isHybridModeDestination } from '../../../analytics-js/src/components/utilities/destinations';

export { ExternalSrcLoader } from '../../../analytics-js/src/services/ExternalSrcLoader/ExternalSrcLoader';
