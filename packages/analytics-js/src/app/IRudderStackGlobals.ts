import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { PreloadedEventCall } from '../components/preloadBuffer/types';

/**
 * Exposed values that can be accessed as global objects per analytics instance
 * TODO: find all values that need to be exposed in globals if anything else
 */
export type ExposedGlobals = {
  state?: ApplicationState;
  preloadedEventsBuffer?: PreloadedEventCall[];
  pluginsCDNPath?: string;
  [key: string]: any;
};

/**
 * Exposing all globally accessible values for all analytics instances
 * As key, we use the value of writeKey assigned to analytics instance that the values belong to
 */
export interface IRudderStackGlobals {
  [key: string]: ExposedGlobals;
}
