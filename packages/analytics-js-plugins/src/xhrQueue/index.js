import { storages, http, timestamp, string, eventsDelivery } from '../shared-chunks/common';
import {
  getNormalizedQueueOptions,
  getDeliveryUrl,
  logErrorOnFailure,
  getRequestInfo,
  getBatchDeliveryPayload,
} from './utilities';
import { RetryQueue } from '../utilities/retryQueue/RetryQueue';
import { QUEUE_NAME, REQUEST_TIMEOUT_MS } from './constants';
const pluginName = 'XhrQueue';
const XhrQueue = () => ({
  name: pluginName,
  deps: [],
  initialize: state => {
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
    init(state, httpClient, storeManager, errorHandler, logger) {
      const writeKey = state.lifecycle.writeKey.value;
      httpClient.setAuthHeader(writeKey);
      const finalQOpts = getNormalizedQueueOptions(state.loadOptions.value.queueOptions);
      const eventsQueue = new RetryQueue(
        // adding write key to the queue name to avoid conflicts
        `${QUEUE_NAME}_${writeKey}`,
        finalQOpts,
        (itemData, done, attemptNumber, maxRetryAttempts, willBeRetried) => {
          const { data, url, headers } = getRequestInfo(itemData, state, logger);
          httpClient.getAsyncData({
            url,
            options: {
              method: 'POST',
              headers,
              data: data,
              sendRawData: true,
            },
            isRawResponse: true,
            timeout: REQUEST_TIMEOUT_MS,
            callback: (result, details) => {
              // null means item will not be requeued
              const queueErrResp = http.isErrRetryable(details) ? details : null;
              logErrorOnFailure(
                details,
                url,
                willBeRetried,
                attemptNumber,
                maxRetryAttempts,
                logger,
              );
              done(queueErrResp, result);
            },
          });
        },
        storeManager,
        storages.LOCAL_STORAGE,
        logger,
        itemData => {
          var _a;
          const events = itemData.map(queueItemData => queueItemData.event);
          // type casting to string as we know that the event has already been validated prior to enqueue
          return (_a = getBatchDeliveryPayload(events, logger)) === null || _a === void 0
            ? void 0
            : _a.length;
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
    enqueue(state, eventsQueue, event, errorHandler, logger) {
      // sentAt is only added here for the validation step
      // It'll be updated to the latest timestamp during actual delivery
      event.sentAt = timestamp.getCurrentTimeFormatted();
      eventsDelivery.validateEventPayloadSize(event, logger);
      const dataplaneUrl = state.lifecycle.activeDataplaneUrl.value;
      const url = getDeliveryUrl(dataplaneUrl, event.type);
      // Other default headers are added by the HttpClient
      // Auth header is added during initialization
      const headers = {
        // To maintain event ordering while using the HTTP API as per is documentation,
        // make sure to include anonymousId as a header
        AnonymousId: string.toBase64(event.anonymousId),
      };
      eventsQueue.addItem({
        url,
        headers,
        event,
      });
    },
  },
});
export { XhrQueue };
export default XhrQueue;
