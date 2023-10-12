import { IntegrationOpts } from '@rudderstack/analytics-js-common/types/Integration';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
/**
 * Filters and returns the user supplied integrations config that should take preference over the destination specific integrations config
 * @param eventIntgConfig User supplied integrations config at event level
 * @param destinationsIntgConfig Cumulative integrations config from all destinations
 * @returns Filtered user supplied integrations config
 */
declare const getOverriddenIntegrationOptions: (
  eventIntgConfig: IntegrationOpts,
  destinationsIntgConfig: IntegrationOpts,
) => IntegrationOpts;
/**
 * Returns the event object with final integrations config
 * @param event RudderEvent object
 * @param state Application state
 * @returns Mutated event with final integrations config
 */
declare const getFinalEvent: (event: RudderEvent, state: ApplicationState) => RudderEvent;
export { getOverriddenIntegrationOptions, getFinalEvent };
