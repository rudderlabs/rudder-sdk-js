import { isUndefined } from '@rudderstack/analytics-js-common/index';
import { DestinationIntgConfig } from '@rudderstack/analytics-js-common/types/Integration';

const isDestIntgConfigTruthy = (destIntgConfig: DestinationIntgConfig): boolean =>
  !isUndefined(destIntgConfig) && Boolean(destIntgConfig) === true;

const isDestIntgConfigFalsy = (destIntgConfig: DestinationIntgConfig): boolean =>
  !isUndefined(destIntgConfig) && Boolean(destIntgConfig) === false;

export { isDestIntgConfigTruthy, isDestIntgConfigFalsy };
