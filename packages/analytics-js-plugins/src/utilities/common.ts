/* eslint-disable import/no-extraneous-dependencies */
import { isUndefined } from '@rudderstack/analytics-js/components/utilities/checks';
import { DestinationIntgConfig } from '../types/common';

export { isFunction, isUndefined } from '@rudderstack/analytics-js/components/utilities/checks';
export { getCurrentTimeFormatted } from '@rudderstack/analytics-js/components/utilities/timestamp';
export { toBase64 } from '@rudderstack/analytics-js/components/utilities/string';
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

const isDestIntgConfigTruthy = (destIntgConfig: DestinationIntgConfig): boolean =>
  !isUndefined(destIntgConfig) && Boolean(destIntgConfig) === true;

const isDestIntgConfigFalsy = (destIntgConfig: DestinationIntgConfig): boolean =>
  !isUndefined(destIntgConfig) && Boolean(destIntgConfig) === false;

export { isDestIntgConfigTruthy, isDestIntgConfigFalsy };
