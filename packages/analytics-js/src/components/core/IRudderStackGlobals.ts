import { IApplicationState } from '@rudderstack/analytics-js/state/IApplicationState';

/**
 * Exposed values that can be accessed as global objects per analytics instance
 * // TODO: find all values that need to be exposed in globals if anything else
 */
export type ExposedGlobals = {
  state?: IApplicationState;
};

/**
 * Exposing all globally accessible values for all analytics instances
 * As key, we use the value of writeKey assigned to analytics instance that the values belong to
 */
export interface IRudderStackGlobals {
  [key: string]: ExposedGlobals;
}
