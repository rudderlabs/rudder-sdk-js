import * as R from 'ramda';
import { Analytics } from '@rudderstack/analytics-js/components/core/Analytics';
import { IAnalytics } from '@rudderstack/analytics-js/components/core/IAnalytics';
import { Nullable } from '@rudderstack/analytics-js/types';
import {
  ApiCallback,
  ApiObject,
  ApiOptions,
  LoadOptions,
} from '@rudderstack/analytics-js/state/types';
import { pageArgumentsToPageCallOptions } from '@rudderstack/analytics-js/components/core/eventMethodOverloads';
import Emitter from 'component-emitter';
import { retrievePreloadBufferEvents } from '@rudderstack/analytics-js/components/preloadBuffer/preloadBuffer';
import { BufferQueue } from '@rudderstack/analytics-js/components/preloadBuffer/BufferQueue';
import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import { PreloadedEventCall } from '@rudderstack/analytics-js/components/preloadBuffer/types';
import { IRudderAnalytics } from './IRudderAnalytics';

// TODO: add analytics restart/reset mechanism
class RudderAnalytics {
  // implements IRudderAnalytics {
  static globalSingleton: Nullable<RudderAnalytics> = null;
  analyticsInstances: Record<string, IAnalytics> = {};
  defaultAnalyticsKey = '';
  preloadBuffer: BufferQueue<PreloadedEventCall> = new BufferQueue();

  constructor() {
    if (RudderAnalytics.globalSingleton) {
      return RudderAnalytics.globalSingleton;
    }

    this.load = this.load.bind(this);
    this.getAnalyticsInstance = this.getAnalyticsInstance.bind(this);
    this.page = this.page.bind(this);

    RudderAnalytics.globalSingleton = this;
    return this;
  }

  /**
   * Set instance to use if no specific writeKey is provided in methods
   */
  setDefaultInstanceKey(writeKey: string) {
    if (R.isEmpty(this.analyticsInstances)) {
      this.defaultAnalyticsKey = writeKey;
    }
  }

  getAnalyticsInstance(writeKey?: string): IAnalytics {
    return this.analyticsInstances[writeKey || this.defaultAnalyticsKey];
  }

  /**
   * Create new analytics instance and start application lifecycle
   */
  load(writeKey: string, dataPlaneUrl: string, loadOptions?: LoadOptions) {
    if (this.analyticsInstances[writeKey]) {
      return;
    }

    this.setDefaultInstanceKey(writeKey);
    this.analyticsInstances[writeKey] = new Analytics();
    this.processDataInPreloadBuffer();
    this.getAnalyticsInstance(writeKey).load(writeKey, dataPlaneUrl, loadOptions);
  }

  enqueuePreloadBufferEvents(bufferedEvents: PreloadedEventCall[]) {
    if (Array.isArray(bufferedEvents)) {
      bufferedEvents.forEach(bufferedEvent => this.preloadBuffer.enqueue(bufferedEvent));
    }
  }

  processDataInPreloadBuffer() {
    for (let i = 0; i < this.preloadBuffer.size(); i++) {
      const eventToProcess = this.preloadBuffer.dequeue();

      if (eventToProcess) {
        const event = [...eventToProcess];
        const methodName = event.shift();

        if (isFunction((this as any)[methodName])) {
          (this as any)[methodName](...event);
        }
      }
    }
  }

  /**
   * Process page params and forward to page call
   */
  page(
    category?: string | ApiObject,
    name?: string | ApiObject | ApiCallback,
    properties?: ApiObject | ApiCallback,
    options?: ApiOptions | ApiCallback,
    callback?: ApiCallback,
  ) {
    this.getAnalyticsInstance().page(
      pageArgumentsToPageCallOptions(category, name, properties, options, callback),
    );
  }
}

const instance = new RudderAnalytics();

// TODO: remove the need for Emitter and deprecate it
Emitter(instance);

retrievePreloadBufferEvents(instance as any);

//
//
// window.addEventListener(
//   'error',
//   e => {
//     handleError(e, undefined, instance);
//   },
//   true,
// );

//
// const ready = instance.ready.bind(instance);
// const identify = instance.identify.bind(instance);
// const track = instance.track.bind(instance);
// const alias = instance.alias.bind(instance);
// const group = instance.group.bind(instance);
// const reset = instance.reset.bind(instance);
// const initialized = (instance.initialized = true);
// const getUserId = instance.getUserId.bind(instance);
// const getSessionId = instance.getSessionId.bind(instance);
// const getUserTraits = instance.getUserTraits.bind(instance);
// const getAnonymousId = instance.getAnonymousId.bind(instance);
// const setAnonymousId = instance.setAnonymousId.bind(instance);
// const getGroupId = instance.getGroupId.bind(instance);
// const getGroupTraits = instance.getGroupTraits.bind(instance);
// const startSession = instance.startSession.bind(instance);
// const endSession = instance.endSession.bind(instance);
//

const { load, getAnalyticsInstance, page } = instance;

export { load, getAnalyticsInstance, page };
