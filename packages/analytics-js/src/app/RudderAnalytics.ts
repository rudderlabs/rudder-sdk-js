/* eslint-disable unicorn/prefer-export-from */
import { clone, isEmpty } from 'ramda';
import {
  aliasArgumentsToCallOptions,
  groupArgumentsToCallOptions,
  identifyArgumentsToCallOptions,
  pageArgumentsToCallOptions,
  trackArgumentsToCallOptions,
} from '@rudderstack/analytics-js-common/utilities/eventMethodOverloads';
import { IRudderAnalytics } from '@rudderstack/analytics-js-common/types/IRudderAnalytics';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import {
  AnonymousIdOptions,
  LoadOptions,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import { ApiCallback, ApiOptions } from '@rudderstack/analytics-js-common/types/EventApi';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { RS_APP } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { isString } from '@rudderstack/analytics-js-common/utilities/checks';
import { GLOBAL_PRELOAD_BUFFER } from '../constants/app';
import { getPreloadedLoadEvent } from '../components/preloadBuffer';
import { PreloadedEventCall } from '../components/preloadBuffer/types';
import { setExposedGlobal } from '../components/utilities/globals';
import { IAnalytics } from '../components/core/IAnalytics';
import { Analytics } from '../components/core/Analytics';
import { defaultLogger } from '../services/Logger/Logger';
import { EMPTY_GROUP_CALL_ERROR, WRITE_KEY_NOT_A_STRING_ERROR } from '../constants/logMessages';

// TODO: add analytics restart/reset mechanism

/*
 * RudderAnalytics facade singleton that is exposed as global object and will:
 * expose overloaded methods
 * handle multiple Analytics instances
 * consume SDK preload event buffer
 */
class RudderAnalytics implements IRudderAnalytics<IAnalytics> {
  static globalSingleton: Nullable<RudderAnalytics> = null;
  analyticsInstances: Record<string, IAnalytics> = {};
  defaultAnalyticsKey = '';
  logger = defaultLogger;

  // Singleton with constructor bind methods
  constructor() {
    if (RudderAnalytics.globalSingleton) {
      // START-NO-SONAR-SCAN
      // eslint-disable-next-line no-constructor-return
      return RudderAnalytics.globalSingleton;
      // END-NO-SONAR-SCAN
    }

    this.setDefaultInstanceKey = this.setDefaultInstanceKey.bind(this);
    this.getAnalyticsInstance = this.getAnalyticsInstance.bind(this);
    this.load = this.load.bind(this);
    this.ready = this.ready.bind(this);
    this.getPreloadBuffer = this.getPreloadBuffer.bind(this);
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

    // get the preloaded events before replacing global object
    this.getPreloadBuffer();

    // start loading if a load event was buffered or wait for explicit load call
    this.triggerBufferedLoadEvent();
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
    const instanceId = writeKey ?? this.defaultAnalyticsKey;

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
    if (!isString(writeKey)) {
      this.logger.error(WRITE_KEY_NOT_A_STRING_ERROR(RS_APP, writeKey));
      return;
    }

    if (this.analyticsInstances[writeKey]) {
      return;
    }

    this.setDefaultInstanceKey(writeKey);
    this.analyticsInstances[writeKey] = new Analytics();
    this.getAnalyticsInstance(writeKey).load(writeKey, dataPlaneUrl, loadOptions);
  }

  /**
   * Get preloaded events in buffer queue if exists
   */
  // eslint-disable-next-line class-methods-use-this
  getPreloadBuffer() {
    const preloadedEventsArray: PreloadedEventCall[] = Array.isArray(
      (globalThis as typeof window).rudderanalytics,
    )
      ? (globalThis as typeof window).rudderanalytics
      : [];

    // Expose buffer to global objects
    setExposedGlobal(GLOBAL_PRELOAD_BUFFER, clone(preloadedEventsArray));
  }

  /**
   * Trigger load event in buffer queue if exists
   */
  triggerBufferedLoadEvent() {
    const preloadedEventsArray: PreloadedEventCall[] = Array.isArray(
      (globalThis as typeof window).rudderanalytics,
    )
      ? (globalThis as typeof window).rudderanalytics
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
    if (arguments.length === 0) {
      this.logger.error(EMPTY_GROUP_CALL_ERROR(RS_APP));
      return;
    }

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
