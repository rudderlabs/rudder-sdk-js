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
import type {
  DoneCallback,
  IQueue,
  QueueItemData,
} from '@rudderstack/analytics-js-common/utilities/retryQueue/types';
import { createPayload, sendTransformedEventToDestinations } from './utilities';
import { getDMTDeliveryPayload } from '../utilities/eventsDelivery';
import { DEFAULT_TRANSFORMATION_QUEUE_OPTIONS, QUEUE_NAME, REQUEST_TIMEOUT_MS } from './constants';
import type { TransformationQueueItemData, TransformationResponsePayload } from './types';
import { isErrRetryable, MEMORY_STORAGE, RetryQueue } from '../shared-chunks/common';

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
          item: QueueItemData,
          done: DoneCallback,
          attemptNumber?: number,
          maxRetryAttempts?: number,
        ) => {
          const curItem = item as TransformationQueueItemData;
          const payload = createPayload(curItem.event, curItem.destinationIds, curItem.token);

          httpClient.request<TransformationResponsePayload>({
            url: `${state.lifecycle.activeDataplaneUrl.value}/transform`,
            options: {
              method: 'POST',
              body: getDMTDeliveryPayload(payload) as string,
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
              },
              useAuth: true,
            },
            isRawResponse: true,
            timeout: REQUEST_TIMEOUT_MS,
            callback: (result, details) => {
              // null means item will not be requeued
              let queueErrResp = null;
              let shouldSendEvents = false;
              if (details.error) {
                const isRetryableFailure = isErrRetryable(details);
                if (isRetryableFailure) {
                  queueErrResp = details;
                } else if (attemptNumber === maxRetryAttempts) {
                  shouldSendEvents = true;
                }
              } else {
                shouldSendEvents = true;
              }

              // Sends events when the request is successful or when the max retry attempts are reached
              if (shouldSendEvents) {
                sendTransformedEventToDestinations(
                  state,
                  pluginsManager,
                  curItem.destinationIds,
                  result,
                  details,
                  curItem.event,
                  errorHandler,
                  logger,
                );
              }

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
