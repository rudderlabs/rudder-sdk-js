import { isNonEmptyObject } from '@rudderstack/analytics-js-common/utilities/object';
import { DMT_PLUGIN } from './constants';
import {
  DMT_EXCEPTION,
  DMT_REQUEST_FAILED_ERROR,
  DMT_SERVER_ACCESS_DENIED_WARNING,
  DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR,
} from './logMessages';
/**
 * A helper function that will take rudderEvent and generate
 * a batch payload that will be sent to transformation server
 *
 */
const createPayload = (event, destinationIds, token) => {
  const orderNo = Date.now();
  const payload = {
    metadata: {
      'Custom-Authorization': token,
    },
    batch: [
      {
        orderNo,
        destinationIds,
        event,
      },
    ],
  };
  return payload;
};
const sendTransformedEventToDestinations = (
  state,
  pluginsManager,
  destinationIds,
  result,
  status,
  event,
  errorHandler,
  logger,
) => {
  const NATIVE_DEST_EXT_POINT = 'destinationsEventsQueue.enqueueEventToDestination';
  const ACTION_TO_SEND_UNTRANSFORMED_EVENT = 'Sending untransformed event';
  const ACTION_TO_DROP_EVENT = 'Dropping the event';
  const destinations = state.nativeDestinations.initializedDestinations.value.filter(
    d => d && destinationIds.includes(d.id),
  );
  destinations.forEach(dest => {
    try {
      const eventsToSend = [];
      switch (status) {
        case 200: {
          const response = JSON.parse(result);
          const destTransformedResult = response.transformedBatch.find(e => e.id === dest.id);
          destTransformedResult === null || destTransformedResult === void 0
            ? void 0
            : destTransformedResult.payload.forEach(tEvent => {
                if (tEvent.status === '200') {
                  eventsToSend.push(tEvent.event);
                } else {
                  let reason = 'Unknown';
                  if (tEvent.status === '410') {
                    reason = 'Transformation is not available';
                  }
                  let action = ACTION_TO_DROP_EVENT;
                  if (dest.propagateEventsUntransformedOnError === true) {
                    action = ACTION_TO_SEND_UNTRANSFORMED_EVENT;
                    eventsToSend.push(event);
                    logger === null || logger === void 0
                      ? void 0
                      : logger.warn(
                          DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR(
                            DMT_PLUGIN,
                            dest.displayName,
                            reason,
                            action,
                          ),
                        );
                  } else {
                    logger === null || logger === void 0
                      ? void 0
                      : logger.error(
                          DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR(
                            DMT_PLUGIN,
                            dest.displayName,
                            reason,
                            action,
                          ),
                        );
                  }
                }
              });
          break;
        }
        // Transformation server access denied
        case 404: {
          logger === null || logger === void 0
            ? void 0
            : logger.warn(DMT_SERVER_ACCESS_DENIED_WARNING(DMT_PLUGIN));
          eventsToSend.push(event);
          break;
        }
        default: {
          if (dest.propagateEventsUntransformedOnError === true) {
            logger === null || logger === void 0
              ? void 0
              : logger.warn(
                  DMT_REQUEST_FAILED_ERROR(
                    DMT_PLUGIN,
                    dest.displayName,
                    status,
                    ACTION_TO_SEND_UNTRANSFORMED_EVENT,
                  ),
                );
            eventsToSend.push(event);
          } else {
            logger === null || logger === void 0
              ? void 0
              : logger.error(
                  DMT_REQUEST_FAILED_ERROR(
                    DMT_PLUGIN,
                    dest.displayName,
                    status,
                    ACTION_TO_DROP_EVENT,
                  ),
                );
          }
          break;
        }
      }
      eventsToSend === null || eventsToSend === void 0
        ? void 0
        : eventsToSend.forEach(tEvent => {
            if (isNonEmptyObject(tEvent)) {
              pluginsManager.invokeSingle(
                NATIVE_DEST_EXT_POINT,
                state,
                tEvent,
                dest,
                errorHandler,
                logger,
              );
            }
          });
    } catch (e) {
      errorHandler === null || errorHandler === void 0
        ? void 0
        : errorHandler.onError(e, DMT_PLUGIN, DMT_EXCEPTION(dest.displayName));
    }
  });
};
export { createPayload, sendTransformedEventToDestinations };
