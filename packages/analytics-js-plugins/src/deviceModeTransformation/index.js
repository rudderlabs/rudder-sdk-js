import { MEMORY_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import { isErrRetryable } from '@rudderstack/analytics-js-common/utilities/http';
import { createPayload, sendTransformedEventToDestinations } from './utilities';
import { getDMTDeliveryPayload } from '../utilities/eventsDelivery';
import { DEFAULT_TRANSFORMATION_QUEUE_OPTIONS, QUEUE_NAME, REQUEST_TIMEOUT_MS } from './constants';
import { RetryQueue } from '../utilities/retryQueue/RetryQueue';
const pluginName = 'DeviceModeTransformation';
const DeviceModeTransformation = () => ({
  name: pluginName,
  deps: [],
  initialize: state => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  transformEvent: {
    init(state, pluginsManager, httpClient, storeManager, errorHandler, logger) {
      const writeKey = state.lifecycle.writeKey.value;
      httpClient.setAuthHeader(writeKey);
      const eventsQueue = new RetryQueue(
        // adding write key to the queue name to avoid conflicts
        `${QUEUE_NAME}_${writeKey}`,
        DEFAULT_TRANSFORMATION_QUEUE_OPTIONS,
        (item, done, attemptNumber, maxRetryAttempts) => {
          const payload = createPayload(item.event, item.destinationIds, item.token);
          httpClient.getAsyncData({
            url: `${state.lifecycle.dataPlaneUrl.value}/transform`,
            options: {
              method: 'POST',
              data: getDMTDeliveryPayload(payload),
              sendRawData: true,
            },
            isRawResponse: true,
            timeout: REQUEST_TIMEOUT_MS,
            callback: (result, details) => {
              var _a;
              // null means item will not be requeued
              const queueErrResp = isErrRetryable(details) ? details : null;
              if (!queueErrResp || attemptNumber === maxRetryAttempts) {
                sendTransformedEventToDestinations(
                  state,
                  pluginsManager,
                  item.destinationIds,
                  result,
                  (_a = details === null || details === void 0 ? void 0 : details.xhr) === null ||
                    _a === void 0
                    ? void 0
                    : _a.status,
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
    enqueue(state, eventsQueue, event, destinations) {
      const destinationIds = destinations.map(d => d.id);
      eventsQueue.addItem({
        event,
        destinationIds,
        token: state.session.authToken.value,
      });
    },
  },
});
export { DeviceModeTransformation };
export default DeviceModeTransformation;
