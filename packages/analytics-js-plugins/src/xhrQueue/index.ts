/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type {
  IHttpClient,
  IResponseDetails,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js-common/utilities/timestamp';
import type {
  IQueue,
  QueueItemData,
  DoneCallback,
} from '@rudderstack/analytics-js-common/utilities/retryQueue/types';
import { toBase64 } from '@rudderstack/analytics-js-common/utilities/string';
import { FAILED_REQUEST_ERR_MSG_PREFIX } from '@rudderstack/analytics-js-common/constants/errors';
import { storages, http, timestamp, string, eventsDelivery } from '../shared-chunks/common';
import {
  getNormalizedQueueOptions,
  getDeliveryUrl,
  logErrorOnFailure,
  getRequestInfo,
  getBatchDeliveryPayload,
} from './utilities';
import { QUEUE_NAME, REQUEST_TIMEOUT_MS } from './constants';
import type { XHRRetryQueueItemData, XHRQueueItemData } from './types';
import { RetryQueue } from '../shared-chunks/retryQueue';
import { DELIVERY_ERROR, REQUEST_ERROR } from './logMessages';

const pluginName: PluginName = 'XhrQueue';

const XhrQueue = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  dataplaneEventsQueue: {
    /**
     * Initialize the queue for delivery
     * @param state Application state
     * @param httpClient http client instance
     * @param storeManager Store Manager instance
     * @param errorHandler Error handler instance
     * @param logger Logger instance
     * @returns RetryQueue instance
     */
    init(
      state: ApplicationState,
      httpClient: IHttpClient,
      storeManager: IStoreManager,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): IQueue {
      const writeKey = state.lifecycle.writeKey.value as string;
      httpClient.setAuthHeader(writeKey);

      const finalQOpts = getNormalizedQueueOptions(
        state.loadOptions.value.queueOptions as QueueOpts,
      );

      const eventsQueue = new RetryQueue(
        // adding write key to the queue name to avoid conflicts
        `${QUEUE_NAME}_${writeKey}`,
        finalQOpts,
        (
          itemData: QueueItemData,
          done: DoneCallback,
          attemptNumber?: number,
          maxRetryAttempts?: number,
          willBeRetried?: boolean,
        ) => {
          const { data, url, headers } = getRequestInfo(
            itemData as XHRRetryQueueItemData,
            state,
            logger,
          );

          const handleResponse = (
            err?: any,
            status?: number,
            statusText?: string,
            ev?: ProgressEvent,
          ) => {
            let errMsg;
            if (err) {
              errMsg = REQUEST_ERROR(
                FAILED_REQUEST_ERR_MSG_PREFIX,
                url,
                REQUEST_TIMEOUT_MS,
                err,
                ev,
              );
            } else if (status && (status < 200 || status > 300)) {
              errMsg = DELIVERY_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX, status, url, statusText, ev);
            }

            const details = {
              error: {
                status,
              },
            } as IResponseDetails;

            const isRetryableFailure = http.isErrRetryable(details);

            // null means item will not be requeued
            const queueErrResp = isRetryableFailure ? details : null;

            logErrorOnFailure(
              isRetryableFailure,
              url,
              errMsg,
              willBeRetried,
              attemptNumber,
              maxRetryAttempts,
              logger,
            );

            done(queueErrResp);
          };

          const xhr = new XMLHttpRequest();
          try {
            xhr.open('POST', url, true);
          } catch (err: any) {
            handleResponse(err);
            return;
          }

          // The timeout property may be set only in the time interval between a call to the open method
          // and the first call to the send method in legacy browsers
          xhr.timeout = REQUEST_TIMEOUT_MS;

          if (headers) {
            Object.entries(headers).forEach(([headerName, headerValue]) => {
              xhr.setRequestHeader(headerName, headerValue);
            });
          }

          xhr.onload = () => {
            // This is same as fetch API
            if (xhr.status >= 200 && xhr.status < 300) {
              handleResponse(null, xhr.status, xhr.statusText);
            }
          };

          const xhrCallback = (ev: ProgressEvent) => {
            handleResponse(undefined, xhr.status, xhr.statusText, ev);
          };

          xhr.ontimeout = xhrCallback;
          xhr.onerror = xhrCallback;
          xhr.onabort = xhrCallback;

          try {
            xhr.send(data);
          } catch (err: any) {
            handleResponse(err, xhr.status, xhr.statusText);
          }
        },
        storeManager,
        storages.LOCAL_STORAGE,
        logger,
        (itemData: XHRQueueItemData[]): number => {
          const currentTime = getCurrentTimeFormatted();
          const events = itemData.map((queueItemData: XHRQueueItemData) => queueItemData.event);
          // type casting to string as we know that the event has already been validated prior to enqueue
          return (getBatchDeliveryPayload(events, currentTime, logger) as string)?.length;
        },
      );

      return eventsQueue;
    },

    /**
     * Add event to the queue for delivery
     * @param state Application state
     * @param eventsQueue RetryQueue instance
     * @param event RudderEvent object
     * @param errorHandler Error handler instance
     * @param logger Logger instance
     * @returns none
     */
    enqueue(
      state: ApplicationState,
      eventsQueue: IQueue,
      event: RudderEvent,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): void {
      // sentAt is only added here for the validation step
      // It'll be updated to the latest timestamp during actual delivery
      event.sentAt = timestamp.getCurrentTimeFormatted();
      eventsDelivery.validateEventPayloadSize(event, logger);

      const dataplaneUrl = state.lifecycle.activeDataplaneUrl.value as string;
      const url = getDeliveryUrl(dataplaneUrl, event.type);
      // Other default headers are added by the HttpClient
      // Auth header is added during initialization
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Basic ${toBase64(`${state.lifecycle.writeKey.value as string}:`)}`,
        // To maintain event ordering while using the HTTP API as per is documentation,
        // make sure to include anonymousId as a header
        AnonymousId: string.toBase64(event.anonymousId),
      };

      eventsQueue.addItem({
        url,
        headers,
        event,
      } as XHRRetryQueueItemData);
    },
  },
});

export { XhrQueue };

export default XhrQueue;
