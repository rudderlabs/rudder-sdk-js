import { DestinationIntgConfig } from '../types/common';
import { isUndefined } from './common';

const isDestIntgConfigTruthy = (destIntgConfig: DestinationIntgConfig): boolean =>
  !isUndefined(destIntgConfig) && Boolean(destIntgConfig) === true;

const isDestIntgConfigFalsy = (destIntgConfig: DestinationIntgConfig): boolean =>
  !isUndefined(destIntgConfig) && Boolean(destIntgConfig) === false;

export { isDestIntgConfigTruthy, isDestIntgConfigFalsy };
