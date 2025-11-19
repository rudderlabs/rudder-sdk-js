import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { clone } from 'ramda';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { EVENT_PAYLOAD_SIZE_BYTES_LIMIT } from './constants';
import type { TransformationRequestPayload } from '../deviceModeTransformation/types';
import {
  LOCAL_STORAGE,
  MEMORY_STORAGE,
  SESSION_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import { isStorageAvailable } from '@rudderstack/analytics-js-common/utilities/storage';
import type { StorageType } from '@rudderstack/analytics-js-common/types/Storage';

const EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING = (
  context: string,
  payloadSize: number,
  sizeLimit: number,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The size of the event payload (${payloadSize} bytes) exceeds the maximum limit of ${sizeLimit} bytes. Events with large payloads may be dropped in the future. Please review your instrumentation to ensure that event payloads are within the size limit.`;

const EVENT_PAYLOAD_SIZE_VALIDATION_WARNING = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to validate event payload size. Please make sure that the event payload is within the size limit and is a valid JSON object.`;

const QUEUE_UTILITIES = 'QueueUtilities';

/**
 * Utility to get the stringified event payload
 * @param event RudderEvent object
 * @param logger Logger instance
 * @returns stringified event payload. Empty string if error occurs.
 */
const getDeliveryPayload = (event: RudderEvent, logger?: ILogger): Nullable<string> =>
  stringifyWithoutCircular<RudderEvent>(event, true, undefined, logger);

const getDMTDeliveryPayload = (
  dmtRequestPayload: TransformationRequestPayload,
  logger?: ILogger,
): Nullable<string> =>
  stringifyWithoutCircular<TransformationRequestPayload>(
    dmtRequestPayload,
    true,
    undefined,
    logger,
  );

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
 * Mutates the event and return final event for delivery
 * Updates certain parameters like sentAt timestamp, integrations config etc.
 * @param event RudderEvent object
 * @returns Final event ready to be delivered
 */
const getFinalEventForDeliveryMutator = (event: RudderEvent, currentTime: string): RudderEvent => {
  const finalEvent = clone(event);

  // Update sentAt timestamp to the latest timestamp
  finalEvent.sentAt = currentTime;

  return finalEvent;
};

/**
 * Utility to get the storage type for events persistence
 * If local storage is available, use it; else, fall back to session storage; else, fall back to memory storage.
 * On some browsers, persistence storage is blocked for the JS SDK that is loaded from RS domains.
 * In such cases, we need to verify all the storage types and use the first one that is available.
 * @param logger Logger instance for logging storage availability warnings
 * @returns StorageType
 */
const getStorageTypeForEventsPersistence = (logger?: ILogger): StorageType => {
  if (isStorageAvailable(LOCAL_STORAGE, undefined, logger)) {
    return LOCAL_STORAGE;
  }

  if (isStorageAvailable(SESSION_STORAGE, undefined, logger)) {
    return SESSION_STORAGE;
  }

  // Don't use cookie storage as it can potentially cause overhead with the network requests.
  // Note that events will not be persisted across page reloads in this case.
  return MEMORY_STORAGE;
};

export {
  getDeliveryPayload,
  validateEventPayloadSize,
  getFinalEventForDeliveryMutator,
  getDMTDeliveryPayload,
  getStorageTypeForEventsPersistence,
};
