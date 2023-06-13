import path from 'path';
import { clone } from 'ramda';
import {
  MAX_EVENT_PAYLOAD_SIZE_BYTES,
  DATA_PLANE_API_VERSION,
  DEFAULT_RETRY_QUEUE_OPTIONS,
} from './constants';
import {
  getCurrentTimeFormatted,
  isUndefined,
  mergeDeepRight,
  stringifyWithoutCircular,
} from '../utilities/common';
import {
  QueueOpts,
  RudderEvent,
  RudderEventType,
  ILogger,
  Nullable,
  ApplicationState,
  IntegrationOpts,
  DestinationIntgConfig,
} from '../types/common';

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
    logger?.error(`Error while converting event object to string. Error: ${err}.`);
  }
  return deliveryPayloadStr;
};

/**
 * Utility to validate final payload size before sending to server
 * @param event RudderEvent object
 * @param logger Logger instance
 */
const validatePayloadSize = (event: RudderEvent, logger?: ILogger) => {
  const payloadStr = getDeliveryPayload(event, logger);
  if (payloadStr) {
    const payloadSize = payloadStr.length;
    if (payloadSize > MAX_EVENT_PAYLOAD_SIZE_BYTES) {
      logger?.warn(
        `The event payload size (${payloadSize}) exceeds the maximum limit of ${MAX_EVENT_PAYLOAD_SIZE_BYTES} bytes. The event might get dropped.`,
      );
    }
  } else {
    logger?.error(`Error while calculating event payload size.`);
  }
};

const getNormalizedQueueOptions = (queueOpts: QueueOpts): QueueOpts =>
  mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS, queueOpts);

const getDeliveryUrl = (dataplaneUrl: string, eventType: RudderEventType): string =>
  // eslint-disable-next-line compat/compat
  new URL(path.join(DATA_PLANE_API_VERSION, eventType), dataplaneUrl).toString();

const isDestIntgConfigTruthy = (destIntgConfig: DestinationIntgConfig): boolean =>
  !isUndefined(destIntgConfig) && Boolean(destIntgConfig) === true;

const isDestIntgConfigFalsy = (destIntgConfig: DestinationIntgConfig): boolean =>
  !isUndefined(destIntgConfig) && Boolean(destIntgConfig) === false;

/**
 * Mutates the event and return final event for delivery
 * Updates certain parameters like sentAt timestamp, integrations config etc.
 * @param event RudderEvent object
 * @param state Application state
 * @returns Final event ready to be delivered
 */
const getFinalEventForDelivery = (event: RudderEvent, state: ApplicationState): RudderEvent => {
  const finalEvent = clone(event);

  // Update sentAt timestamp to the latest timestamp
  finalEvent.sentAt = getCurrentTimeFormatted();

  // IMPORTANT: This logic has been improved over the v1.1 to handle other generic cases as well
  // Merge the destination specific integrations config with the event's integrations config
  // In general, the preference is given to the event's integrations config
  let finalIntgConfig = event.integrations;
  const destinationsIntgConfig = state.nativeDestinations.integrationsConfig.value;
  const overriddenIntgOpts = Object.keys(finalIntgConfig)
    .filter(intgName => {
      const eventDestConfig = finalIntgConfig[intgName];
      const globalDestConfig = destinationsIntgConfig[intgName];

      // unless the event dest config is undefined, use it (falsy or truthy)
      if (typeof eventDestConfig !== 'boolean') {
        return !isUndefined(eventDestConfig);
      }

      return eventDestConfig === false ? true : isDestIntgConfigFalsy(globalDestConfig);
    })
    .reduce((obj: IntegrationOpts, key: string) => {
      const retVal = clone(obj);
      retVal[key] = finalIntgConfig[key];
      return retVal;
    }, {});

  finalIntgConfig = mergeDeepRight(destinationsIntgConfig, overriddenIntgOpts);
  finalEvent.integrations = finalIntgConfig;

  return finalEvent;
};

export {
  validatePayloadSize,
  getDeliveryPayload,
  getDeliveryUrl,
  getNormalizedQueueOptions,
  getFinalEventForDelivery,
  isDestIntgConfigTruthy,
  isDestIntgConfigFalsy,
};
