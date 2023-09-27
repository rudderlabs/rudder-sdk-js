/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { MEMORY_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { isErrRetryable } from '@rudderstack/analytics-js-common/utilities/http';
import { isNonEmptyObject } from '@rudderstack/analytics-js-common/utilities/object';
import { createPayload } from './utilities';
import { getDMTDeliveryPayload } from '../utilities/queue';
import { DEFAULT_TRANSFORMATION_QUEUE_OPTIONS, QUEUE_NAME, REQUEST_TIMEOUT_MS } from './constants';
import { RetryQueue } from '../utilities/retryQueue/RetryQueue';
import { DoneCallback, IQueue } from '../types/plugins';
import {
  TransformationQueueItemData,
  TransformedBatch,
  TransformedEvent,
  TransformedPayload,
} from './types';
import {
  DMT_EXCEPTION,
  DMT_REQUEST_FAILED_ERROR,
  DMT_SERVER_ACCESS_DENIED_WARNING,
  DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR,
} from '../utilities/logMessages';

const pluginName = 'DeviceModeTransformation';

const DeviceModeTransformation = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  transformEvent: {
    init(
      state: ApplicationState,
      pluginsManager: IPluginsManager,
      httpClient: IHttpClient,
      storeManager: IStoreManager,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ) {
      const writeKey = state.lifecycle.writeKey.value as string;
      httpClient.setAuthHeader(writeKey);

      const eventsQueue = new RetryQueue(
        // adding write key to the queue name to avoid conflicts
        `${QUEUE_NAME}_${writeKey}`,
        DEFAULT_TRANSFORMATION_QUEUE_OPTIONS,
        (item: TransformationQueueItemData, done: DoneCallback) => {
          httpClient.getAsyncData({
            url: `${state.lifecycle.dataPlaneUrl.value}/transform`,
            options: {
              method: 'POST',
              data: getDMTDeliveryPayload(item.payload) as string,
              sendRawData: true,
            },
            isRawResponse: true,
            timeout: REQUEST_TIMEOUT_MS,
            callback: (result, details) => {
              // null means item will not be requeued
              const queueErrResp = isErrRetryable(details) ? details : null;

              pluginsManager.invokeSingle(
                'transformEvent.sendDataToDestination',
                state,
                pluginsManager,
                result,
                details?.xhr?.status,
                item.event,
                errorHandler,
                logger,
              );
              done(queueErrResp, result);
            },
          });
        },
        storeManager,
        MEMORY_STORAGE,
      );

      return eventsQueue;
    },

    enqueue(
      state: ApplicationState,
      eventsQueue: IQueue,
      event: RudderEvent,
      destinations: Destination[],
    ) {
      const destinationIds = destinations.map(d => d.id);
      const payload = createPayload(event, destinationIds, state.session.authToken.value);
      eventsQueue.addItem({ event, payload } as TransformationQueueItemData);
    },

    sendDataToDestination(
      state: ApplicationState,
      pluginsManager: IPluginsManager,
      result: any,
      status: number,
      event: RudderEvent,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ) {
      const NATIVE_DEST_EXT_POINT = 'destinationsEventsQueue.enqueueEventToDestination';
      const ACTION_TO_SEND_UNTRANSFORMED_EVENT = 'Sending untransformed event';
      const ACTION_TO_DROP_EVENT = 'Dropping the event';
      const destinations = state.nativeDestinations.dmtEnabledDestinations.value;

      destinations.forEach(dest => {
        try {
          const eventsToSend: TransformedEvent[] = [];
          switch (status) {
            case 200: {
              const response = JSON.parse(result);
              const destTransformedResult = response.transformedBatch.find(
                (e: TransformedBatch) => e.id === dest.id,
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
                  let logMethod = logger?.error;
                  if (dest.propagateEventsUntransformedOnError === true) {
                    action = ACTION_TO_SEND_UNTRANSFORMED_EVENT;
                    logMethod = logger?.warn;
                    eventsToSend.push(event);
                  }
                  if (logMethod) {
                    logMethod(
                      DMT_TRANSFORMATION_UNSUCCESSFUL_ERROR(dest.displayName, reason, action),
                    );
                  }
                }
              });

              break;
            }
            // Transformation server access denied
            case 404: {
              logger?.warn(DMT_SERVER_ACCESS_DENIED_WARNING());
              eventsToSend.push(event);
              break;
            }
            default: {
              if (dest.propagateEventsUntransformedOnError === true) {
                logger?.warn(
                  DMT_REQUEST_FAILED_ERROR(
                    dest.displayName,
                    status,
                    ACTION_TO_SEND_UNTRANSFORMED_EVENT,
                  ),
                );
                eventsToSend.push(event);
              } else {
                logger?.error(
                  DMT_REQUEST_FAILED_ERROR(dest.displayName, status, ACTION_TO_DROP_EVENT),
                );
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
        } catch (e) {
          if (e instanceof Error) {
            e.message = DMT_EXCEPTION(dest.displayName, e.message);
          }
          errorHandler?.onError(e);
        }
      });
    },
  },
});

export { DeviceModeTransformation };

export default DeviceModeTransformation;
