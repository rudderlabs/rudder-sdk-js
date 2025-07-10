/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type {
  IPluginsManager,
  PluginName,
} from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { createPayload, sendTransformedEventToDestinations } from './utilities';
import { getDMTDeliveryPayload } from '../utilities/eventsDelivery';
import { DEFAULT_TRANSFORMATION_QUEUE_OPTIONS, QUEUE_NAME, REQUEST_TIMEOUT_MS } from './constants';
import { RetryQueue } from '../utilities/retryQueue/RetryQueue';
import type { DoneCallback, IQueue, QueueProcessCallbackInfo } from '../types/plugins';
import type { TransformationQueueItemData } from './types';
import { isErrRetryable, isUndefined, MEMORY_STORAGE } from '../shared-chunks/common';

const pluginName: PluginName = 'DeviceModeTransformation';

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
        (
          item: TransformationQueueItemData,
          done: DoneCallback,
          qItemProcessInfo: QueueProcessCallbackInfo,
        ) => {
          const payload = createPayload(item.event, item.destinationIds, item.token);

          httpClient.getAsyncData({
            url: `${state.lifecycle.activeDataplaneUrl.value}/transform`,
            options: {
              method: 'POST',
              data: getDMTDeliveryPayload(payload) as string,
              sendRawData: true,
            },
            isRawResponse: true,
            timeout: REQUEST_TIMEOUT_MS,
            callback: (result, details) => {
              const isRetryable = isErrRetryable(details?.xhr?.status ?? 0);

              // If there is no error, or the error is not retryable, or the attempt number is the max retry attempts, then attempt send the event to the destinations
              if (
                isUndefined(details?.error) ||
                !isRetryable ||
                qItemProcessInfo.retryAttemptNumber === qItemProcessInfo.maxRetryAttempts
              ) {
                sendTransformedEventToDestinations(
                  state,
                  pluginsManager,
                  item.destinationIds,
                  result,
                  details?.xhr?.status,
                  item.event,
                  errorHandler,
                  logger,
                );

                done(null);
              } else {
                // Requeue the item as the error is retryable.
                done(details);
              }
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
      const destinationIds: string[] = [];
      destinations.forEach(d => {
        const id = d.originalId ?? d.id;
        if (!destinationIds.includes(id)) {
          destinationIds.push(id);
        }
      });

      eventsQueue.addItem({
        event,
        destinationIds,
        token: state.session.authToken.value,
      } as TransformationQueueItemData);
    },
  },
});

export { DeviceModeTransformation };

export default DeviceModeTransformation;
