import { ApplicationState } from '@rudderstack/analytics-js/state';

// TODO: find all values that need to be exposed in globals if anything else
export type ExposedGlobals = {
  state?: ApplicationState;
};

// As key we use the default value 'analytic' or a unique value if multiple
// instances in same DOM
export interface IRudderStackGlobals {
  [key: string]: ExposedGlobals;
}
