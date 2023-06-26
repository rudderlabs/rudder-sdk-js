import { DestinationIntgConfig } from '@rudderstack/common/types/common';
import { isUndefined } from '@rudderstack/common/utilities/common';

const isDestIntgConfigTruthy = (destIntgConfig: DestinationIntgConfig): boolean =>
  !isUndefined(destIntgConfig) && Boolean(destIntgConfig) === true;

const isDestIntgConfigFalsy = (destIntgConfig: DestinationIntgConfig): boolean =>
  !isUndefined(destIntgConfig) && Boolean(destIntgConfig) === false;

export { isDestIntgConfigTruthy, isDestIntgConfigFalsy };
