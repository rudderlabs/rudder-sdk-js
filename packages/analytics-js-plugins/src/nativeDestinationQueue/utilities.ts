/* eslint-disable @typescript-eslint/no-unused-vars */
import { mergeDeepRight } from '@rudderstack/analytics-js-plugins/utilities/common';
import {
  Destination,
  DestinationsQueueOpts,
  IErrorHandler,
  ILogger,
  Nullable,
  RudderEvent,
  RudderEventType,
} from '../types/common';
import { DEFAULT_QUEUE_OPTIONS } from './constants';

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
      // TODO: might have to make this logic case-sensitive
      const formattedEventName = (eventName as string).trim().toUpperCase();
      if (Array.isArray(blacklistedEvents)) {
        return blacklistedEvents.some(
          eventObj => eventObj.eventName.trim().toUpperCase() === formattedEventName,
        );
      }
      return false;
    }

    // Whitelist is chosen for filtering events
    case 'whitelistedEvents': {
      if (!isValidEventName(eventName)) {
        return true;
      }
      // TODO: might have to make this logic case-sensitive
      const formattedEventName = (eventName as string).trim().toUpperCase();
      if (Array.isArray(whitelistedEvents)) {
        return !whitelistedEvents.some(
          eventObj => eventObj.eventName.trim().toUpperCase() === formattedEventName,
        );
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
    // This will remain until we update the destinations to accept the event directly
    dest.instance?.[methodName]?.({ message: item });
  } catch (err) {
    errorHandler?.onError(
      err,
      'NativeDestinationQueue',
      `Error in forwarding event to destination: ${dest.userFriendlyId}`,
    );
  }
};

export { getNormalizedQueueOptions, isEventDenyListed, sendEventToDestination };
