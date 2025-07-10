import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type {
  TransformationRequestPayload,
  TransformationResponsePayload,
  TransformedBatch,
  TransformedEvent,
  TransformedPayload,
} from './types';
import { DMT_PLUGIN } from './constants';
import {
  DMT_EXCEPTION,
  DMT_REQUEST_FAILED_ERROR,
  DMT_SERVER_ACCESS_DENIED_WARNING,
  DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR,
} from './logMessages';
import { isNonEmptyObject } from '../shared-chunks/common';

/**
 * A helper function that will take rudderEvent and generate
 * a batch payload that will be sent to transformation server
 *
 */
const createPayload = (
  event: RudderEvent,
  destinationIds: string[],
  token: Nullable<string>,
): TransformationRequestPayload => {
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

/**
 * Helper function to get destination identifier consistently
 */
const getDestinationId = (dest: Destination): string => dest.originalId ?? dest.id;

/**
 * Helper function to log once per destination to avoid duplicate messages
 */
const logOncePerDestination = (
  destinationId: string,
  loggedDestinations: string[],
  logFn: () => void,
): void => {
  if (!loggedDestinations.includes(destinationId)) {
    loggedDestinations.push(destinationId);
    logFn();
  }
};

const sendTransformedEventToDestinations = (
  state: ApplicationState,
  pluginsManager: IPluginsManager,
  destinationIds: string[],
  result: any,
  status: number | undefined,
  event: RudderEvent,
  errorHandler?: IErrorHandler,
  logger?: ILogger,
) => {
  const NATIVE_DEST_EXT_POINT = 'destinationsEventsQueue.enqueueEventToDestination';
  const ACTION_TO_SEND_UNTRANSFORMED_EVENT = 'Sending untransformed event';
  const ACTION_TO_DROP_EVENT = 'Dropping the event';
  const destinations: Destination[] = state.nativeDestinations.initializedDestinations.value.filter(
    d => d && destinationIds.includes(d.originalId ?? d.id),
  );

  const loggedDestinations: string[] = [];
  destinations.forEach(dest => {
    try {
      const eventsToSend: TransformedEvent[] = [];
      const destinationId = getDestinationId(dest);
      switch (status) {
        case 200: {
          const response: TransformationResponsePayload = JSON.parse(result);
          const destTransformedResult = response.transformedBatch.find(
            (e: TransformedBatch) => e.id === destinationId,
          );
          destTransformedResult?.payload.forEach((tEvent: TransformedPayload) => {
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
                logOncePerDestination(destinationId, loggedDestinations, () => {
                  logger?.warn(
                    DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR(
                      DMT_PLUGIN,
                      dest.displayName,
                      reason,
                      action,
                    ),
                  );
                });
              } else {
                logOncePerDestination(destinationId, loggedDestinations, () => {
                  logger?.error(
                    DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR(
                      DMT_PLUGIN,
                      dest.displayName,
                      reason,
                      action,
                    ),
                  );
                });
              }
            }
          });

          break;
        }
        // Transformation server access denied
        case 404: {
          logOncePerDestination(destinationId, loggedDestinations, () => {
            logger?.warn(DMT_SERVER_ACCESS_DENIED_WARNING(DMT_PLUGIN));
          });
          eventsToSend.push(event);
          break;
        }
        default: {
          if (dest.propagateEventsUntransformedOnError === true) {
            logOncePerDestination(destinationId, loggedDestinations, () => {
              logger?.warn(
                DMT_REQUEST_FAILED_ERROR(
                  DMT_PLUGIN,
                  dest.displayName,
                  status,
                  ACTION_TO_SEND_UNTRANSFORMED_EVENT,
                ),
              );
            });
            eventsToSend.push(event);
          } else {
            logOncePerDestination(destinationId, loggedDestinations, () => {
              logger?.error(
                DMT_REQUEST_FAILED_ERROR(
                  DMT_PLUGIN,
                  dest.displayName,
                  status,
                  ACTION_TO_DROP_EVENT,
                ),
              );
            });
          }
          break;
        }
      }
      eventsToSend?.forEach((tEvent?: TransformedEvent) => {
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
    } catch (err) {
      errorHandler?.onError({
        error: err,
        context: DMT_PLUGIN,
        customMessage: DMT_EXCEPTION(dest.displayName),
      });
    }
  });
};

export { createPayload, sendTransformedEventToDestinations };
