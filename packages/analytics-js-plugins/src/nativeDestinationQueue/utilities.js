/* eslint-disable @typescript-eslint/no-unused-vars */
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { DEFAULT_QUEUE_OPTIONS, NATIVE_DESTINATION_QUEUE_PLUGIN } from './constants';
import { DESTINATION_EVENT_FORWARDING_ERROR } from './logMessages';
const getNormalizedQueueOptions = queueOpts => mergeDeepRight(DEFAULT_QUEUE_OPTIONS, queueOpts);
const isValidEventName = eventName => eventName && typeof eventName === 'string';
const isEventDenyListed = (eventType, eventName, dest) => {
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
      const trimmedEventName = eventName.trim();
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
      const trimmedEventName = eventName.trim();
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
const sendEventToDestination = (item, dest, errorHandler, logger) => {
  var _a, _b;
  const methodName = item.type.toString();
  try {
    // Destinations expect the event to be wrapped under the `message` key
    // This will remain until we update the destinations to accept the event directly
    (_b = (_a = dest.instance) === null || _a === void 0 ? void 0 : _a[methodName]) === null ||
    _b === void 0
      ? void 0
      : _b.call(_a, { message: item });
  } catch (err) {
    errorHandler === null || errorHandler === void 0
      ? void 0
      : errorHandler.onError(
          err,
          NATIVE_DESTINATION_QUEUE_PLUGIN,
          DESTINATION_EVENT_FORWARDING_ERROR(dest.userFriendlyId),
        );
  }
};
export { getNormalizedQueueOptions, isEventDenyListed, sendEventToDestination };
