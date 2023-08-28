import { clone } from 'ramda';
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js-common/utilities/timestamp';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { normalizeIntegrationOptions } from '@rudderstack/analytics-js-common/utilities/integrationsOptions';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { IntegrationOpts } from '@rudderstack/analytics-js-common/types/Integration';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { EVENT_PAYLOAD_SIZE_BYTES_LIMIT } from '@rudderstack/analytics-js-plugins/utilities/constants';
import {
  EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING,
  EVENT_PAYLOAD_SIZE_VALIDATION_WARNING,
} from '@rudderstack/analytics-js-plugins/utilities/logMessages';

const QUEUE_UTILITIES = 'QueueUtilities';

/**
 * Utility to get the stringified event payload
 * @param event RudderEvent object
 * @param logger Logger instance
 * @returns stringified event payload. Empty string if error occurs.
 */
const getDeliveryPayload = (event: RudderEvent, logger?: ILogger): Nullable<string> =>
  stringifyWithoutCircular<RudderEvent>(event, true, undefined, logger);

const getBatchDeliveryPayload = (events: RudderEvent[], logger?: ILogger): Nullable<string> =>
  stringifyWithoutCircular({ batch: events }, true, undefined, logger);

/**
 * Utility to validate final payload size before sending to server
 * @param event RudderEvent object
 * @param logger Logger instance
 */
const validateEventPayloadSize = (event: RudderEvent, logger?: ILogger) => {
  const payloadStr = getDeliveryPayload(event, logger);
  if (payloadStr) {
    const payloadSize = payloadStr.length;
    if (payloadSize > EVENT_PAYLOAD_SIZE_BYTES_LIMIT) {
      logger?.warn(
        EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING(
          QUEUE_UTILITIES,
          payloadSize,
          EVENT_PAYLOAD_SIZE_BYTES_LIMIT,
        ),
      );
    }
  } else {
    logger?.warn(EVENT_PAYLOAD_SIZE_VALIDATION_WARNING(QUEUE_UTILITIES));
  }
};

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
 * Mutates the event and return final event for delivery
 * Updates certain parameters like sentAt timestamp, integrations config etc.
 * @param event RudderEvent object
 * @param state Application state
 * @returns Final event ready to be delivered
 */
const getFinalEventForDeliveryMutator = (
  event: RudderEvent,
  state: ApplicationState,
): RudderEvent => {
  const finalEvent = clone(event);

  // Update sentAt timestamp to the latest timestamp
  finalEvent.sentAt = getCurrentTimeFormatted();

  // Merge the destination specific integrations config with the event's integrations config
  // In general, the preference is given to the event's integrations config
  const eventIntgConfig = normalizeIntegrationOptions(event.integrations);
  const destinationsIntgConfig = state.nativeDestinations.integrationsConfig.value;
  const overriddenIntgOpts = getOverriddenIntegrationOptions(
    eventIntgConfig,
    destinationsIntgConfig,
  );

  finalEvent.integrations = mergeDeepRight(destinationsIntgConfig, overriddenIntgOpts);

  return finalEvent;
};

export {
  getDeliveryPayload,
  validateEventPayloadSize,
  getOverriddenIntegrationOptions,
  getFinalEventForDeliveryMutator,
  getBatchDeliveryPayload,
};
