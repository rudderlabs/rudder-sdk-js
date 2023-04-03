import * as R from 'ramda';
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
import { BufferQueue } from '@rudderstack/analytics-js/components/preloadBuffer/BufferQueue';
import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import { PreloadedEventCall } from '@rudderstack/analytics-js/components/preloadBuffer/types';
import { retrievePreloadBufferEvents } from '@rudderstack/analytics-js/components/preloadBuffer';
import Emitter from 'component-emitter';
import { Analytics } from './Analytics';
import { IAnalytics } from './IAnalytics';
import { IRudderAnalytics } from './IRudderAnalytics';

// TODO: add analytics restart/reset mechanism
class RudderAnalytics implements IRudderAnalytics {
  static globalSingleton: Nullable<RudderAnalytics> = null;
  analyticsInstances: Record<string, IAnalytics> = {};
  defaultAnalyticsKey = '';
  preloadBuffer: BufferQueue<PreloadedEventCall> = new BufferQueue();

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
    retrievePreloadBufferEvents(this as any);
    // TODO: remove the need for Emitter and deprecate it
    Emitter(this);
    // eslint-disable-next-line no-constructor-return
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

  ready(callback: ApiCallback) {
    this.getAnalyticsInstance().ready(callback);
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
   * Process track params and forward to track call
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
   * Process identify params and forward to identify call
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
   * Process alias params and forward to identify call
   */
  alias(
    to: string,
    from?: string | Nullable<ApiOptions> | ApiCallback,
    options?: Nullable<ApiOptions> | ApiCallback,
    callback?: ApiCallback,
  ) {
    this.getAnalyticsInstance().alias(aliasArgumentsToCallOptions(to, from, options, callback));
  }

  group(
    groupId: string | Nullable<ApiObject> | ApiCallback,
    traits?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
    options?: Nullable<ApiOptions> | ApiCallback,
    callback?: ApiCallback,
  ) {
    this.getAnalyticsInstance().alias(
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
