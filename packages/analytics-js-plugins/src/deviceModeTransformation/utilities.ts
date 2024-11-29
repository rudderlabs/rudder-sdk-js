import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { isDefinedAndNotNull } from '@rudderstack/analytics-js-common/utilities/checks';
import type { ResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
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

const sendTransformedEventToDestinations = (
  state: ApplicationState,
  pluginsManager: IPluginsManager,
  destinationIds: string[],
  response: TransformationResponsePayload | undefined | null,
  details: ResponseDetails,
  event: RudderEvent,
  errorHandler?: IErrorHandler,
  logger?: ILogger,
  // eslint-disable-next-line sonarjs/sonar-max-params
) => {
  const NATIVE_DEST_EXT_POINT = 'destinationsEventsQueue.enqueueEventToDestination';
  const ACTION_TO_SEND_UNTRANSFORMED_EVENT = 'Sending untransformed event';
  const ACTION_TO_DROP_EVENT = 'Dropping the event';
  const destinations: Destination[] = state.nativeDestinations.initializedDestinations.value.filter(
    d => d && destinationIds.includes(d.id),
  );

  const reqFailedHandler = (
    dest: Destination,
    status: number | undefined,
    eventsToSend: TransformedEvent[],
  ) => {
    if (dest.propagateEventsUntransformedOnError === true) {
      logger?.warn(
        DMT_REQUEST_FAILED_ERROR(
          DMT_PLUGIN,
          dest.displayName,
          status,
          ACTION_TO_SEND_UNTRANSFORMED_EVENT,
        ),
      );
      eventsToSend.push(event);
    } else {
      logger?.error(
        DMT_REQUEST_FAILED_ERROR(DMT_PLUGIN, dest.displayName, status, ACTION_TO_DROP_EVENT),
      );
    }
  };

  const status = details.error?.status ?? details.response?.status;

  destinations.forEach(dest => {
    try {
      const eventsToSend: TransformedEvent[] = [];
      // If the response is invalid, handle it
      if (!isDefinedAndNotNull(response)) {
        reqFailedHandler(dest, status, eventsToSend);
      } else {
        switch (status) {
          case 200: {
            const destTransformedResult = response?.transformedBatch.find(
              (e: TransformedBatch) => e.id === dest.id,
            );
            destTransformedResult?.payload.forEach((tEvent: TransformedPayload) => {
              if (tEvent.status === '200') {
                eventsToSend.push(tEvent.event as TransformedEvent);
              } else {
                let reason = 'Unknown';
                if (tEvent.status === '410') {
                  reason = 'Transformation is not available';
                }

                let action = ACTION_TO_DROP_EVENT;
                if (dest.propagateEventsUntransformedOnError === true) {
                  action = ACTION_TO_SEND_UNTRANSFORMED_EVENT;
                  eventsToSend.push(event);
                  logger?.warn(
                    DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR(
                      DMT_PLUGIN,
                      dest.displayName,
                      reason,
                      action,
                    ),
                  );
                } else {
                  logger?.error(
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
            logger?.warn(DMT_SERVER_ACCESS_DENIED_WARNING(DMT_PLUGIN));
            eventsToSend.push(event);
            break;
          }
          default: {
            reqFailedHandler(dest, status, eventsToSend);
            break;
          }
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
    } catch (e: any) {
      errorHandler?.onError(e, DMT_PLUGIN, DMT_EXCEPTION(dest.displayName));
    }
  });
};

export { createPayload, sendTransformedEventToDestinations };
