/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
import { Queue } from '@rudderstack/analytics-js/npmPackages/localstorage-retry';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js/components/utilities/timestamp';
import { toBase64 } from '@rudderstack/analytics-js/components/utilities/string';
import { IHttpClient } from '@rudderstack/analytics-js/services/HttpClient/types';
import { replaceNullValues } from '@rudderstack/analytics-js/components/utilities/json';
import {
  ExtensionPlugin,
  PluginName,
  ApplicationState,
  QueueOpts,
  RudderEvent,
  ILogger,
} from '../types/common';
import { getDeliveryPayload, validatePayloadSize, getDeliveryUrl } from './utilities';
import { DEFAULT_RETRY_QUEUE_OPTIONS, REQUEST_TIMEOUT_MS } from './constants';

const pluginName = PluginName.DataplaneEventsQueue;

let eventsQueue: Queue;
let dataplaneUrl: string;
let httpClient: IHttpClient;
let initialized = false;

const DataplaneEventsQueue = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  dataplaneEventsQueue: {
    init(writeKey: string, inDataplaneUrl: string, queueOpts: QueueOpts): void {
      if (initialized) {
        return;
      }

      httpClient.setAuthHeader(writeKey);
      dataplaneUrl = inDataplaneUrl;

      const qOpts = mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS, queueOpts);
      eventsQueue = new Queue('rudder', qOpts, (item, done) => {
        const payloadData = getDeliveryPayload(item.event);
        if (payloadData) {
          httpClient.getAsyncData({
            url: item.url,
            options: {
              method: 'POST',
              headers: item.headers,
              data: JSON.stringify(item.event, replaceNullValues),
            },
            timeout: REQUEST_TIMEOUT_MS,
            callback: result => {
              if (result !== undefined) {
                done(result);
              } else {
                done(null);
              }
            },
          });
        } else {
          done(null);
        }
      });
      initialized = true;
    },

    /**
     * Start the queue for delivery
     * @returns none
     */
    start(): void {
      if (!initialized) {
        return;
      }
      eventsQueue.start();
    },

    /**
     * Add event to the queue for delivery
     * @param event RudderEvent object
     * @param logger Logger instance
     * @returns none
     */
    enqueue(event: RudderEvent, logger?: ILogger): void {
      if (!initialized) {
        return;
      }

      // sentAt is only added here for the validation step
      // It'll be updated to the latest timestamp during actual delivery
      event.sentAt = getCurrentTimeFormatted();
      validatePayloadSize(event, logger);

      const url = getDeliveryUrl(dataplaneUrl, event.type);
      // Other default headers are added by the HttpClient
      // Auth header is added during initialization
      const headers = {
        AnonymousId: toBase64(event.anonymousId),
      };

      eventsQueue.addItem({
        url,
        headers,
        event,
      });
    },
  },
});

export { DataplaneEventsQueue };

export default DataplaneEventsQueue;
