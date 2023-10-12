import { clone } from 'ramda';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { DEFAULT_INTEGRATIONS_CONFIG } from '@rudderstack/analytics-js-common/constants/integrationsConfig';
/**
 * Filters and returns the user supplied integrations config that should take preference over the destination specific integrations config
 * @param eventIntgConfig User supplied integrations config at event level
 * @param destinationsIntgConfig Cumulative integrations config from all destinations
 * @returns Filtered user supplied integrations config
 */
const getOverriddenIntegrationOptions = (eventIntgConfig, destinationsIntgConfig) =>
  Object.keys(eventIntgConfig)
    .filter(intgName => eventIntgConfig[intgName] !== true || !destinationsIntgConfig[intgName])
    .reduce((obj, key) => {
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
const getFinalEvent = (event, state) => {
  var _a;
  const finalEvent = clone(event);
  // Merge the destination specific integrations config with the event's integrations config
  // In general, the preference is given to the event's integrations config
  const eventIntgConfig =
    (_a = event.integrations) !== null && _a !== void 0 ? _a : DEFAULT_INTEGRATIONS_CONFIG;
  const destinationsIntgConfig = state.nativeDestinations.integrationsConfig.value;
  const overriddenIntgOpts = getOverriddenIntegrationOptions(
    eventIntgConfig,
    destinationsIntgConfig,
  );
  finalEvent.integrations = mergeDeepRight(destinationsIntgConfig, overriddenIntgOpts);
  return finalEvent;
};
export { getOverriddenIntegrationOptions, getFinalEvent };
