/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DestinationsQueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import type {
  Destination,
  DeviceModeIntegrationEventAPIs,
} from '@rudderstack/analytics-js-common/types/Destination';
import type { RSAEvent, RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { RudderEventType } from '../types/plugins';
import { DEFAULT_QUEUE_OPTIONS, NATIVE_DESTINATION_QUEUE_PLUGIN } from './constants';
import { INTEGRATION_EVENT_FORWARDING_ERROR } from './logMessages';
import { mergeDeepRight } from '../shared-chunks/common';
import { INTEGRATIONS_ERROR_CATEGORY } from '../utilities/constants';

const getNormalizedQueueOptions = (queueOpts: DestinationsQueueOpts): DestinationsQueueOpts =>
  mergeDeepRight(DEFAULT_QUEUE_OPTIONS, queueOpts);

const isValidEventName = (eventName: Nullable<string>) =>
  eventName && typeof eventName === 'string';

const isEventDenyListed = (
  eventType: RudderEventType,
  eventName: Nullable<string>,
  dest: Destination,
) => {
  if (eventType !== 'track') {
    return false;
  }

  const { blacklistedEvents, whitelistedEvents, eventFilteringOption } = dest.config;

  switch (eventFilteringOption) {
    // Blacklist is chosen for filtering events
    case 'blacklistedEvents': {
      if (!isValidEventName(eventName)) {
        return false;
      }
      const trimmedEventName = (eventName as string).trim();
      if (Array.isArray(blacklistedEvents)) {
        return blacklistedEvents.some(eventObj => eventObj.eventName.trim() === trimmedEventName);
      }
      return false;
    }

    // Whitelist is chosen for filtering events
    case 'whitelistedEvents': {
      if (!isValidEventName(eventName)) {
        return true;
      }
      const trimmedEventName = (eventName as string).trim();
      if (Array.isArray(whitelistedEvents)) {
        return !whitelistedEvents.some(eventObj => eventObj.eventName.trim() === trimmedEventName);
      }
      return true;
    }

    case 'disable':
    default:
      return false;
  }
};

const sendEventToDestination = (
  item: RudderEvent,
  dest: Destination,
  errorHandler?: IErrorHandler,
  logger?: ILogger,
) => {
  const methodName = item.type.toString();
  try {
    // Destinations expect the event to be wrapped under the `message` key
    const integrationEvent: RSAEvent = {
      message: item,
    };

    dest.integration![methodName as keyof DeviceModeIntegrationEventAPIs]?.(integrationEvent);
  } catch (err) {
    errorHandler?.onError({
      error: err,
      context: NATIVE_DESTINATION_QUEUE_PLUGIN,
      customMessage: INTEGRATION_EVENT_FORWARDING_ERROR(
        methodName,
        dest.userFriendlyId,
        item.event,
      ),
      groupingHash: INTEGRATION_EVENT_FORWARDING_ERROR(methodName, dest.displayName, item.event),
      category: INTEGRATIONS_ERROR_CATEGORY,
    });
  }
};

/**
 * A function to check if device mode transformation should be applied for a destination.
 * @param dest Destination object
 * @returns Boolean indicating whether the transformation should be applied
 */
const shouldApplyTransformation = (dest: Destination): boolean => {
  return dest.shouldApplyDeviceModeTransformation && !dest.cloned;
};

export {
  getNormalizedQueueOptions,
  isEventDenyListed,
  sendEventToDestination,
  shouldApplyTransformation,
};
