/* eslint-disable @typescript-eslint/no-unused-vars */
import { mergeDeepRight } from 'ramda';
import {
  Destination,
  DestinationsQueueOpts,
  IErrorHandler,
  ILogger,
  Nullable,
  RudderEvent,
} from '../types/common';
import { DEFAULT_QUEUE_OPTIONS } from './constants';

const getNormalizedQueueOptions = (queueOpts: DestinationsQueueOpts): DestinationsQueueOpts =>
  mergeDeepRight(DEFAULT_QUEUE_OPTIONS, queueOpts);

const isEventDenyListed = (eventName: Nullable<string>, dest: Destination) => {
  if (!eventName || !(typeof eventName === 'string')) {
    return false;
  }

  const { blacklistedEvents, whitelistedEvents, eventFilteringOption } = dest.config;
  // TODO: might have to make this logic case-sensitive
  const formattedEventName = eventName.trim().toUpperCase();
  switch (eventFilteringOption) {
    // Blacklist is chosen for filtering events
    case 'blacklistedEvents':
      if (Array.isArray(blacklistedEvents)) {
        return blacklistedEvents.some(
          eventObj => eventObj.eventName.trim().toUpperCase() === formattedEventName,
        );
      }
      return false;

    // Whitelist is chosen for filtering events
    case 'whitelistedEvents':
      if (Array.isArray(whitelistedEvents)) {
        return !whitelistedEvents.some(
          eventObj => eventObj.eventName.trim().toUpperCase() === formattedEventName,
        );
      }
      return true;

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
