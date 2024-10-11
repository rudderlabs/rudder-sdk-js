import type { IntegrationOpts } from '@rudderstack/analytics-js-common/types/Integration';
import { clone } from 'ramda';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';

/**
 * Filters and returns the user supplied integrations config that should take preference over the destination specific integrations config
 * @param eventIntgConfig User supplied integrations config at event level
 * @param destinationsIntgConfig Cumulative integrations config from all destinations
 * @returns Filtered user supplied integrations config
 */
const getOverriddenIntegrationOptions = (
  eventIntgConfig: IntegrationOpts,
  destinationsIntgConfig: IntegrationOpts,
): IntegrationOpts =>
  Object.keys(eventIntgConfig)
    .filter(intgName => eventIntgConfig[intgName] !== true || !destinationsIntgConfig[intgName])
    .reduce((obj: IntegrationOpts, key: string) => {
      const retVal = clone(obj);
      retVal[key] = eventIntgConfig[key];
      return retVal;
    }, {});

/**
 * Returns the event object with final integrations config
 * @param event RudderEvent object
 * @param state Application state
 * @returns Mutated event with final integrations config
 */
const getFinalEvent = (event: RudderEvent, state: ApplicationState) => {
  const finalEvent = clone(event);
  // Merge the destination specific integrations config with the event's integrations config
  // In general, the preference is given to the event's integrations config
  const destinationsIntgConfig = state.nativeDestinations.integrationsConfig.value;
  const overriddenIntgOpts = getOverriddenIntegrationOptions(
    event.integrations,
    destinationsIntgConfig,
  );

  finalEvent.integrations = mergeDeepRight(destinationsIntgConfig, overriddenIntgOpts);
  return finalEvent;
};

const shouldBufferEventsForPreConsent = (state: ApplicationState): boolean =>
  state.consents.preConsent.value.enabled &&
  state.consents.preConsent.value.events?.delivery === 'buffer' &&
  (state.consents.preConsent.value.storage?.strategy === 'session' ||
    state.consents.preConsent.value.storage?.strategy === 'none');

export { getOverriddenIntegrationOptions, getFinalEvent, shouldBufferEventsForPreConsent };
