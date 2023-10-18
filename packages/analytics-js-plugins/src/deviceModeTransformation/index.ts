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
import { MEMORY_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { isErrRetryable } from '@rudderstack/analytics-js-common/utilities/http';
import { createPayload, sendTransformedEventToDestinations } from './utilities';
import { getDMTDeliveryPayload } from '../utilities/eventsDelivery';
import { DEFAULT_TRANSFORMATION_QUEUE_OPTIONS, QUEUE_NAME, REQUEST_TIMEOUT_MS } from './constants';
import { RetryQueue } from '../utilities/retryQueue/RetryQueue';
import type { DoneCallback, IQueue } from '../types/plugins';
import type { TransformationQueueItemData } from './types';

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
          attemptNumber?: number,
          maxRetryAttempts?: number,
        ) => {
          const payload = createPayload(item.event, item.destinationIds, item.token);

          httpClient.getAsyncData({
            url: `${state.lifecycle.dataPlaneUrl.value}/transform`,
            options: {
              method: 'POST',
              data: getDMTDeliveryPayload(payload) as string,
              sendRawData: true,
            },
            isRawResponse: true,
            timeout: REQUEST_TIMEOUT_MS,
            callback: (result, details) => {
              // null means item will not be requeued
              const queueErrResp = isErrRetryable(details) ? details : null;

              if (!queueErrResp || attemptNumber === maxRetryAttempts) {
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
