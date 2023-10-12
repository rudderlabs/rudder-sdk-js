import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { TransformationRequestPayload } from '../deviceModeTransformation/types';
/**
 * Utility to get the stringified event payload
 * @param event RudderEvent object
 * @param logger Logger instance
 * @returns stringified event payload. Empty string if error occurs.
 */
declare const getDeliveryPayload: (event: RudderEvent, logger?: ILogger) => Nullable<string>;
declare const getDMTDeliveryPayload: (
  dmtRequestPayload: TransformationRequestPayload,
  logger?: ILogger,
) => Nullable<string>;
/**
 * Utility to validate final payload size before sending to server
 * @param event RudderEvent object
 * @param logger Logger instance
 */
declare const validateEventPayloadSize: (event: RudderEvent, logger?: ILogger) => void;
/**
 * Mutates the event and return final event for delivery
 * Updates certain parameters like sentAt timestamp, integrations config etc.
 * @param event RudderEvent object
 * @returns Final event ready to be delivered
 */
declare const getFinalEventForDeliveryMutator: (event: RudderEvent) => RudderEvent;
export {
  getDeliveryPayload,
  validateEventPayloadSize,
  getFinalEventForDeliveryMutator,
  getDMTDeliveryPayload,
};
