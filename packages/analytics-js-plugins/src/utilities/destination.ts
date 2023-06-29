import { isUndefined } from '@rudderstack/common/v3/utilities/common';
import { DestinationIntgConfig } from '@rudderstack/common/types/Integration';

const isDestIntgConfigTruthy = (destIntgConfig: DestinationIntgConfig): boolean =>
  !isUndefined(destIntgConfig) && Boolean(destIntgConfig) === true;

const isDestIntgConfigFalsy = (destIntgConfig: DestinationIntgConfig): boolean =>
  !isUndefined(destIntgConfig) && Boolean(destIntgConfig) === false;

export { isDestIntgConfigTruthy, isDestIntgConfigFalsy };
