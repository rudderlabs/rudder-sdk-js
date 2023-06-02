/* eslint-disable unicorn/prefer-export-from */
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
import { isString } from '@rudderstack/analytics-js/components/utilities/checks';
import { PreloadedEventCall } from '@rudderstack/analytics-js/components/preloadBuffer/types';
import { getPreloadedLoadEvent } from '@rudderstack/analytics-js/components/preloadBuffer';
import { Analytics } from '../components/core/Analytics';
import { IAnalytics } from '../components/core/IAnalytics';
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
    this.triggerBufferedLoadEvent = this.triggerBufferedLoadEvent.bind(this);
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

    RudderAnalytics.globalSingleton = this;

    // start loading if a load event was buffered or wait for explicit load call
    this.triggerBufferedLoadEvent();

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
  load(writeKey: string, dataPlaneUrl: string, loadOptions?: Partial<LoadOptions>) {
    const shouldSkipLoad = !isString(writeKey) || Boolean(this.analyticsInstances[writeKey]);
    if (shouldSkipLoad) {
      return;
    }

    this.setDefaultInstanceKey(writeKey);
    this.analyticsInstances[writeKey] = new Analytics();
    this.getAnalyticsInstance(writeKey).load(writeKey, dataPlaneUrl, loadOptions);
  }

  /**
   * Trigger load event in buffer queue if exists
   */
  triggerBufferedLoadEvent() {
    const preloadedEventsArray: PreloadedEventCall[] = Array.isArray(
      (window as any).rudderanalytics,
    )
      ? (window as any).rudderanalytics
      : [];

    // Get any load method call that is buffered if any
    const loadEvent: PreloadedEventCall = getPreloadedLoadEvent(preloadedEventsArray);

    // Process load method if present in the buffered requests
    if (loadEvent.length > 0) {
      // Remove the event name from the Buffered Event array and keep only arguments
      loadEvent.shift();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.load.apply(null, loadEvent);
    }
  }

  /**
   * Get ready callback arguments and forward to ready call
   */
  ready(callback: ApiCallback) {
    this.getAnalyticsInstance().ready(callback);
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
    to?: Nullable<string> | ApiCallback,
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

  getAnonymousId(options?: AnonymousIdOptions) {
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
}

export { RudderAnalytics };
