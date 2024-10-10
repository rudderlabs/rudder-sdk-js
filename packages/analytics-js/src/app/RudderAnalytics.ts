/* eslint-disable unicorn/prefer-export-from */
import { clone } from 'ramda';
import {
  aliasArgumentsToCallOptions,
  groupArgumentsToCallOptions,
  identifyArgumentsToCallOptions,
  pageArgumentsToCallOptions,
  trackArgumentsToCallOptions,
} from '@rudderstack/analytics-js-common/utilities/eventMethodOverloads';
import type { IRudderAnalytics } from '@rudderstack/analytics-js-common/types/IRudderAnalytics';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type {
  AnonymousIdOptions,
  ConsentOptions,
  LoadOptions,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { ApiCallback, ApiOptions } from '@rudderstack/analytics-js-common/types/EventApi';
import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { RS_APP } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { isString } from '@rudderstack/analytics-js-common/utilities/checks';
import type { IdentifyTraits } from '@rudderstack/analytics-js-common/types/traits';
import { GLOBAL_PRELOAD_BUFFER } from '../constants/app';
import {
  getPreloadedLoadEvent,
  promotePreloadedConsentEventsToTop,
} from '../components/preloadBuffer';
import type { PreloadedEventCall } from '../components/preloadBuffer/types';
import { setExposedGlobal } from '../components/utilities/globals';
import type { IAnalytics } from '../components/core/IAnalytics';
import { Analytics } from '../components/core/Analytics';
import { defaultLogger } from '../services/Logger/Logger';
import { EMPTY_GROUP_CALL_ERROR, WRITE_KEY_NOT_A_STRING_ERROR } from '../constants/logMessages';
import { defaultErrorHandler } from '../services/ErrorHandler';

// TODO: add analytics restart/reset mechanism

/*
 * RudderAnalytics facade singleton that is exposed as global object and will:
 * expose overloaded methods
 * handle multiple Analytics instances
 * consume SDK preload event buffer
 */
class RudderAnalytics implements IRudderAnalytics<IAnalytics> {
  // eslint-disable-next-line sonarjs/public-static-readonly
  static private_globalSingleton: Nullable<RudderAnalytics>;
  private_analyticsInstances: Record<string, IAnalytics> = {};
  private_defaultAnalyticsKey = '';
  private_logger = defaultLogger;

  // Singleton with constructor bind methods
  constructor() {
    if (RudderAnalytics.private_globalSingleton) {
      // START-NO-SONAR-SCAN
      // eslint-disable-next-line no-constructor-return
      return RudderAnalytics.private_globalSingleton;
      // END-NO-SONAR-SCAN
    }
    defaultErrorHandler.private_attachErrorListeners();

    this.setDefaultInstanceKey = this.setDefaultInstanceKey.bind(this);
    this.getAnalyticsInstance = this.getAnalyticsInstance.bind(this);
    this.load = this.load.bind(this);
    this.ready = this.ready.bind(this);
    this.private_triggerBufferedLoadEvent = this.private_triggerBufferedLoadEvent.bind(this);
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
    this.setAuthToken = this.setAuthToken.bind(this);
    this.consent = this.consent.bind(this);

    RudderAnalytics.private_globalSingleton = this;

    // start loading if a load event was buffered or wait for explicit load call
    this.private_triggerBufferedLoadEvent();

    // Assign to global "rudderanalytics" object after processing the preload buffer (if any exists)
    // for CDN bundling IIFE exports covers this but for npm ESM and CJS bundling has to be done explicitly
    (globalThis as typeof window).rudderanalytics = this;
  }

  /**
   * Set instance to use if no specific writeKey is provided in methods
   * automatically for the first created instance
   * TODO: to support multiple analytics instances in the near future
   */
  setDefaultInstanceKey(writeKey: string) {
    if (writeKey) {
      this.private_defaultAnalyticsKey = writeKey;
    }
  }

  /**
   * Retrieve an existing analytics instance
   */
  getAnalyticsInstance(writeKey?: string): IAnalytics {
    const instanceId = writeKey ?? this.private_defaultAnalyticsKey;

    const analyticsInstanceExists = Boolean(this.private_analyticsInstances[instanceId]);

    if (!analyticsInstanceExists) {
      this.private_analyticsInstances[instanceId] = new Analytics();
    }

    return this.private_analyticsInstances[instanceId] as IAnalytics;
  }

  /**
   * Create new analytics instance and trigger application lifecycle start
   */
  load(writeKey: string, dataPlaneUrl: string, loadOptions?: Partial<LoadOptions>) {
    if (!isString(writeKey)) {
      this.private_logger.error(WRITE_KEY_NOT_A_STRING_ERROR(RS_APP, writeKey));
      return;
    }

    if (this.private_analyticsInstances[writeKey]) {
      return;
    }

    this.setDefaultInstanceKey(writeKey);
    this.private_analyticsInstances[writeKey] = new Analytics();
    this.getAnalyticsInstance(writeKey).load(writeKey, dataPlaneUrl, loadOptions);
  }

  /**
   * Trigger load event in buffer queue if exists and stores the
   * remaining preloaded events array in global object
   */
  private_triggerBufferedLoadEvent() {
    const preloadedEventsArray = Array.isArray((globalThis as typeof window).rudderanalytics)
      ? ((globalThis as typeof window).rudderanalytics as unknown as PreloadedEventCall[])
      : ([] as PreloadedEventCall[]);

    // The array will be mutated in the below method
    promotePreloadedConsentEventsToTop(preloadedEventsArray);

    // Get any load method call that is buffered if any
    // BTW, load method is also removed from the array
    // So, the Analytics object can directly consume the remaining events
    const loadEvent: PreloadedEventCall = getPreloadedLoadEvent(preloadedEventsArray);

    // Set the final preloaded events array in global object
    setExposedGlobal(GLOBAL_PRELOAD_BUFFER, clone(preloadedEventsArray));

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
  // These overloads should be same as AnalyticsPageMethod in @rudderstack/analytics-js-common/types/IRudderAnalytics
  page(
    category: string,
    name: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  page(
    category: string,
    name: string,
    properties?: Nullable<ApiObject>,
    callback?: ApiCallback,
  ): void;
  page(category: string, name: string, callback?: ApiCallback): void;
  page(
    name: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  page(name: string, properties?: Nullable<ApiObject>, callback?: ApiCallback): void;
  page(name: string, callback?: ApiCallback): void;
  page(
    properties: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  page(properties: Nullable<ApiObject>, callback?: ApiCallback): void;
  page(callback?: ApiCallback): void;
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
  // These overloads should be same as AnalyticsTrackMethod in @rudderstack/analytics-js-common/types/IRudderAnalytics
  track(
    event: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  track(event: string, properties?: Nullable<ApiObject>, callback?: ApiCallback): void;
  track(event: string, callback?: ApiCallback): void;
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
  // These overloads should be same as AnalyticsIdentifyMethod in @rudderstack/analytics-js-common/types/IRudderAnalytics
  identify(
    userId: string,
    traits?: Nullable<IdentifyTraits>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  identify(userId: string, traits?: Nullable<IdentifyTraits>, callback?: ApiCallback): void;
  identify(userId: string, callback?: ApiCallback): void;
  identify(
    traits: Nullable<IdentifyTraits>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  identify(traits: Nullable<IdentifyTraits>, callback?: ApiCallback): void;
  identify(
    userId: string | number | Nullable<IdentifyTraits>,
    traits?: Nullable<IdentifyTraits> | Nullable<ApiOptions> | ApiCallback,
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
  // These overloads should be same as AnalyticsAliasMethod in @rudderstack/analytics-js-common/types/IRudderAnalytics
  alias(to: string, from?: string, options?: Nullable<ApiOptions>, callback?: ApiCallback): void;
  alias(to: string, from?: string, callback?: ApiCallback): void;
  alias(to: string, options?: Nullable<ApiOptions>, callback?: ApiCallback): void;
  alias(to: string, callback?: ApiCallback): void;
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
  // These overloads should be same as AnalyticsGroupMethod in @rudderstack/analytics-js-common/types/IRudderAnalytics
  group(
    groupId: string,
    traits?: Nullable<IdentifyTraits>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  group(groupId: string, traits?: Nullable<IdentifyTraits>, callback?: ApiCallback): void;
  group(groupId: string, callback?: ApiCallback): void;
  group(
    traits: Nullable<IdentifyTraits>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  group(traits: Nullable<IdentifyTraits>, callback?: ApiCallback): void;
  group(
    groupId: string | number | Nullable<ApiObject>,
    traits?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
    options?: Nullable<ApiOptions> | ApiCallback,
    callback?: ApiCallback,
  ) {
    if (arguments.length === 0) {
      this.private_logger.error(EMPTY_GROUP_CALL_ERROR(RS_APP));
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

  setAuthToken(token: string) {
    return this.getAnalyticsInstance().setAuthToken(token);
  }

  consent(options?: ConsentOptions) {
    return this.getAnalyticsInstance().consent(options);
  }
}

export { RudderAnalytics };
