import { clone } from 'ramda';
import {
  getCurrentTimeFormatted,
  isUndefined,
  mergeDeepRight,
  stringifyWithoutCircular,
} from '@rudderstack/analytics-js-common/index';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { IntegrationOpts } from '@rudderstack/analytics-js-common/types/Integration';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { isDestIntgConfigFalsy } from './destination';
import { EVENT_PAYLOAD_SIZE_BYTES_LIMIT } from './constants';

const QUEUE_UTILITIES = 'QueueUtilities';

/**
 * Utility to get the stringified event payload
 * @param event RudderEvent object
 * @param logger Logger instance
 * @returns stringified event payload. Empty string if error occurs.
 */
const getDeliveryPayload = (event: RudderEvent, logger?: ILogger): Nullable<string> => {
  let deliveryPayloadStr: Nullable<string> = '';
  try {
    deliveryPayloadStr = stringifyWithoutCircular<RudderEvent>(event, true) as Nullable<string>;
  } catch (err) {
    logger?.error(`${QUEUE_UTILITIES}:: Failed to convert event object to string.`, err);
  }
  return deliveryPayloadStr;
};

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
        `${QUEUE_UTILITIES}:: The size of the event payload (${payloadSize} bytes) exceeds the maximum limit of ${EVENT_PAYLOAD_SIZE_BYTES_LIMIT} bytes. Events with large payloads may be dropped in the future. Please review your instrumentation to ensure that event payloads are within the size limit.`,
      );
    }
  } else {
    logger?.warn(
      `${QUEUE_UTILITIES}:: Failed to validate event payload size. Please make sure that the event payload is within the size limit and is a valid JSON object.`,
    );
  }
};

const getOverriddenIntegrationOptions = (
  finalIntgConfig: IntegrationOpts,
  destinationsIntgConfig: IntegrationOpts,
): IntegrationOpts =>
  Object.keys(finalIntgConfig)
    .filter(intgName => {
      const eventDestConfig = finalIntgConfig[intgName];
      const globalDestConfig = destinationsIntgConfig[intgName];

      // unless the event dest config is undefined, use it (falsy or truthy)
      if (typeof eventDestConfig !== 'boolean') {
        return !isUndefined(eventDestConfig);
      }

      if (eventDestConfig === false || isUndefined(globalDestConfig)) {
        return true;
      }

      return isDestIntgConfigFalsy(globalDestConfig);
    })
    .reduce((obj: IntegrationOpts, key: string) => {
      const retVal = clone(obj);
      retVal[key] = finalIntgConfig[key];
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

  // IMPORTANT: This logic has been improved over the v1.1 to handle other generic cases as well
  // Merge the destination specific integrations config with the event's integrations config
  // In general, the preference is given to the event's integrations config
  let finalIntgConfig = event.integrations;
  const destinationsIntgConfig = state.nativeDestinations.integrationsConfig.value;
  const overriddenIntgOpts = getOverriddenIntegrationOptions(
    finalIntgConfig,
    destinationsIntgConfig,
  );

  finalIntgConfig = mergeDeepRight(destinationsIntgConfig, overriddenIntgOpts);
  finalEvent.integrations = finalIntgConfig;

  return finalEvent;
};

const removeDuplicateSlashes = (str: string): string => str.replace(/\/{2,}/g, '/');

export {
  getDeliveryPayload,
  validateEventPayloadSize,
  getOverriddenIntegrationOptions,
  getFinalEventForDeliveryMutator,
  removeDuplicateSlashes,
};
