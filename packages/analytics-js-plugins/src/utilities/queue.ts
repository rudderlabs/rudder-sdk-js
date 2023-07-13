import { clone } from 'ramda';
import { ApplicationState, ILogger, IntegrationOpts, RudderEvent } from '../types/common';
import { Nullable } from '../types/plugins';
import {
  getCurrentTimeFormatted,
  isUndefined,
  mergeDeepRight,
  stringifyWithoutCircular,
} from './common';
import { isDestIntgConfigFalsy } from './destination';
import { EVENT_PAYLOAD_SIZE_BYTES_LIMIT } from './constants';
import {
  EVENT_STRINGIFY_ERROR,
  EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING,
  EVENT_PAYLOAD_SIZE_VALIDATION_WARNING,
} from './logMessages';

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
    logger?.error(EVENT_STRINGIFY_ERROR(QUEUE_UTILITIES), err);
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
