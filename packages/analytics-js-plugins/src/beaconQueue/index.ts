/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { Queue } from '@rudderstack/analytics-js-plugins/utilities/retryQueue';
import {
  ExtensionPlugin,
  ApplicationState,
  ILogger,
  IErrorHandler,
  RudderEvent,
  IHttpClient,
  IStoreManager,
  BeaconQueueOpts,
} from '../types/common';
import { getNormalizedBeaconQueueOptions, getDeliveryUrl } from './utilities';

const pluginName = 'BeaconQueue';

const BeaconQueue = (): ExtensionPlugin => ({
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
     * @returns Queue instance
     */
    init(
      state: ApplicationState,
      httpClient: IHttpClient,
      storeManager: IStoreManager,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): Queue {
      const dataplaneUrl = state.lifecycle.activeDataplaneUrl.value as string;
      const url = getDeliveryUrl(dataplaneUrl);

      const finalQOpts = getNormalizedBeaconQueueOptions(
        state.loadOptions.value.beaconQueueOptions ?? ({} as BeaconQueueOpts),
      );

      // const eventsQueue = new Queue();
      //
      // window.addEventListener('unload', sendQueueData);
      //
      // return eventsQueue;

      return new Queue('dummy', {}, () => {}, storeManager);
    },

    /**
     * Add event to the queue for delivery
     * @param state Application state
     * @param eventsQueue Queue instance
     * @param event RudderEvent object
     * @param errorHandler Error handler instance
     * @param logger Logger instance
     * @returns none
     */
    enqueue(
      state: ApplicationState,
      eventsQueue: any,
      event: RudderEvent,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): void {
      // TODO: Implement this
      // TODO: Remove this console log
      logger?.log('Item enqueued', event);
    },
  },
});

export { BeaconQueue };

export default BeaconQueue;
