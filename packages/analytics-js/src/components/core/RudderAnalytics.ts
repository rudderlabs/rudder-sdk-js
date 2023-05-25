import { isEmpty } from 'ramda';
import Emitter from 'component-emitter';
import { Nullable } from '@rudderstack/analytics-js/types';
import {
  AnonymousIdOptions,
  ApiCallback,
  ApiObject,
  ApiOptions,
  LoadOptions,
} from '@rudderstack/analytics-js/state/types';
import {
  aliasArgumentsToCallOptions,
  groupArgumentsToCallOptions,
  identifyArgumentsToCallOptions,
  pageArgumentsToCallOptions,
  trackArgumentsToCallOptions,
} from '@rudderstack/analytics-js/components/core/eventMethodOverloads';
import { isFunction, isString } from '@rudderstack/analytics-js/components/utilities/checks';
import { PreloadedEventCall } from '@rudderstack/analytics-js/components/preloadBuffer/types';
import { retrievePreloadBufferEvents } from '@rudderstack/analytics-js/components/preloadBuffer';
import { Analytics } from './Analytics';
import { IAnalytics } from './IAnalytics';
import { BufferQueue } from './BufferQueue';
import { IRudderAnalytics } from './IRudderAnalytics';

// TODO: add analytics restart/reset mechanism

/*
 * RudderAnalytics facade singleton that is exposed as global object and will:
 * expose overloaded methods
 * handle multiple Analytics instances
 * consume SDK preload event buffer
 * attach Emitter
 */
class RudderAnalytics implements IRudderAnalytics {
  static globalSingleton: Nullable<RudderAnalytics> = null;
  analyticsInstances: Record<string, IAnalytics> = {};
  defaultAnalyticsKey = '';
  preloadBuffer: BufferQueue<PreloadedEventCall> = new BufferQueue();

  // Singleton with constructor bind methods
  constructor() {
    if (RudderAnalytics.globalSingleton) {
      // eslint-disable-next-line no-constructor-return
      return RudderAnalytics.globalSingleton;
    }

    this.setDefaultInstanceKey = this.setDefaultInstanceKey.bind(this);
    this.getAnalyticsInstance = this.getAnalyticsInstance.bind(this);
    this.load = this.load.bind(this);
    this.ready = this.ready.bind(this);
    this.enqueuePreloadBufferEvents = this.enqueuePreloadBufferEvents.bind(this);
    this.processDataInPreloadBuffer = this.processDataInPreloadBuffer.bind(this);
    this.page = this.page.bind(this);
    this.track = this.track.bind(this);
    this.identify = this.identify.bind(this);
    this.alias = this.alias.bind(this);
    this.group = this.group.bind(this);
    this.reset = this.reset.bind(this);
    this.getAnonymousId = this.getAnonymousId.bind(this);
    this.setAnonymousId = this.setAnonymousId.bind(this);
    this.getUserId = this.getUserId.bind(this);
    this.getUserTraits = this.getUserTraits.bind(this);
    this.getGroupId = this.getGroupId.bind(this);
    this.getGroupTraits = this.getGroupTraits.bind(this);
    this.startSession = this.startSession.bind(this);
    this.endSession = this.endSession.bind(this);
    this.getSessionId = this.getSessionId.bind(this);
    this.getSessionInfo = this.getSessionInfo.bind(this);

    RudderAnalytics.globalSingleton = this;

    // initialize the preloaded events enqueuing
    retrievePreloadBufferEvents(this);

    // TODO: remove the need for Emitter and deprecate it
    Emitter(this);

    // eslint-disable-next-line no-constructor-return
    return this;
  }

  /**
   * Set instance to use if no specific writeKey is provided in methods
   * automatically for the first created instance
   * TODO: to support multiple analytics instances in the near future
   */
  setDefaultInstanceKey(writeKey: string) {
    if (isEmpty(this.analyticsInstances)) {
      this.defaultAnalyticsKey = writeKey;
    }
  }

  /**
   * Retrieve an existing analytics instance
   */
  getAnalyticsInstance(writeKey?: string): IAnalytics {
    const instanceId = writeKey || this.defaultAnalyticsKey;

    const analyticsInstanceExists = Boolean(this.analyticsInstances[instanceId]);

    if (!analyticsInstanceExists) {
      this.analyticsInstances[instanceId] = new Analytics();
    }

    return this.analyticsInstances[instanceId];
  }

  /**
   * Create new analytics instance and trigger application lifecycle start
   */
  load(writeKey: string, dataPlaneUrl: string, loadOptions?: LoadOptions) {
    const shouldSkipLoad = !isString(writeKey) || Boolean(this.analyticsInstances[writeKey]);
    if (shouldSkipLoad) {
      return;
    }

    this.setDefaultInstanceKey(writeKey);
    this.analyticsInstances[writeKey] = new Analytics();
    this.getAnalyticsInstance(writeKey).load(writeKey, dataPlaneUrl, loadOptions);
    this.processDataInPreloadBuffer();
  }

  /**
   * Process ready arguments and forward to page call
   */
  ready(callback: ApiCallback) {
    this.getAnalyticsInstance().ready(callback);
  }

  /**
   * Enqueue in SDK preload buffer events, used from preloadBuffer component
   */
  enqueuePreloadBufferEvents(bufferedEvents: PreloadedEventCall[]) {
    if (Array.isArray(bufferedEvents)) {
      bufferedEvents.forEach(bufferedEvent => this.preloadBuffer.enqueue(bufferedEvent));
    }
  }

  /**
   * Process the buffer preloaded events by passing their arguments to the respective facade methods
   */
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
   * Process page arguments and forward to page call
   */
  page(
    category?: string | Nullable<ApiObject> | ApiCallback,
    name?: string | Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
    properties?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
    options?: Nullable<ApiOptions> | ApiCallback,
    callback?: ApiCallback,
  ) {
    this.getAnalyticsInstance().page(
      pageArgumentsToCallOptions(category, name, properties, options, callback),
    );
  }

  /**
   * Process track arguments and forward to page call
   */
  track(
    event: string,
    properties?: Nullable<ApiObject> | ApiCallback,
    options?: Nullable<ApiOptions> | ApiCallback,
    callback?: ApiCallback,
  ) {
    this.getAnalyticsInstance().track(
      trackArgumentsToCallOptions(event, properties, options, callback),
    );
  }

  /**
   * Process identify arguments and forward to page call
   */
  identify(
    userId?: string | number | Nullable<ApiObject>,
    traits?: Nullable<ApiObject> | ApiCallback,
    options?: Nullable<ApiOptions> | ApiCallback,
    callback?: ApiCallback,
  ) {
    this.getAnalyticsInstance().identify(
      identifyArgumentsToCallOptions(userId, traits, options, callback),
    );
  }

  /**
   * Process alias arguments and forward to page call
   */
  alias(
    to: string,
    from?: string | Nullable<ApiOptions> | ApiCallback,
    options?: Nullable<ApiOptions> | ApiCallback,
    callback?: ApiCallback,
  ) {
    this.getAnalyticsInstance().alias(aliasArgumentsToCallOptions(to, from, options, callback));
  }

  /**
   * Process group arguments and forward to page call
   */
  group(
    groupId: string | number | Nullable<ApiObject> | ApiCallback,
    traits?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
    options?: Nullable<ApiOptions> | ApiCallback,
    callback?: ApiCallback,
  ) {
    this.getAnalyticsInstance().group(
      groupArgumentsToCallOptions(groupId, traits, options, callback),
    );
  }

  reset(resetAnonymousId?: boolean) {
    this.getAnalyticsInstance().reset(resetAnonymousId);
  }

  getAnonymousId(options?: AnonymousIdOptions): string {
    return this.getAnalyticsInstance().getAnonymousId(options);
  }

  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string) {
    this.getAnalyticsInstance().setAnonymousId(anonymousId, rudderAmpLinkerParam);
  }

  getUserId() {
    return this.getAnalyticsInstance().getUserId();
  }

  getUserTraits() {
    return this.getAnalyticsInstance().getUserTraits();
  }

  getGroupId() {
    return this.getAnalyticsInstance().getGroupId();
  }

  getGroupTraits() {
    return this.getAnalyticsInstance().getGroupTraits();
  }

  startSession(sessionId?: number) {
    return this.getAnalyticsInstance().startSession(sessionId);
  }

  endSession() {
    return this.getAnalyticsInstance().endSession();
  }

  getSessionId() {
    return this.getAnalyticsInstance().getSessionId();
  }

  getSessionInfo() {
    return this.getAnalyticsInstance().getSessionInfo();
  }
}

export { RudderAnalytics };
