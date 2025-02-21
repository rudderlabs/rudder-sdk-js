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
import {
  PageLifecycleEvents,
  type AnonymousIdOptions,
  type ConsentOptions,
  type LoadOptions,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { ApiCallback, ApiOptions } from '@rudderstack/analytics-js-common/types/EventApi';
import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { RSA } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import type { IdentifyTraits } from '@rudderstack/analytics-js-common/types/traits';
import { generateUUID } from '@rudderstack/analytics-js-common/utilities/uuId';
import { onPageLeave } from '@rudderstack/analytics-js-common/utilities/page';
import { isString } from '@rudderstack/analytics-js-common/utilities/checks';
import { getFormattedTimestamp } from '@rudderstack/analytics-js-common/utilities/timestamp';
import { dispatchErrorEvent } from '@rudderstack/analytics-js-common/utilities/errors';
import { getSanitizedValue } from '@rudderstack/analytics-js-common/utilities/json';
import { GLOBAL_PRELOAD_BUFFER } from '../constants/app';
import {
  getPreloadedLoadEvent,
  promotePreloadedConsentEventsToTop,
} from '../components/preloadBuffer';
import type { PreloadedEventCall } from '../components/preloadBuffer/types';
import { getExposedGlobal, setExposedGlobal } from '../components/utilities/globals';
import type { IAnalytics } from '../components/core/IAnalytics';
import { Analytics } from '../components/core/Analytics';
import { defaultLogger } from '../services/Logger/Logger';
import { PAGE_UNLOAD_ON_BEACON_DISABLED_WARNING } from '../constants/logMessages';
import { state } from '../state';

// TODO: add analytics restart/reset mechanism

/*
 * RudderAnalytics facade singleton that is exposed as global object and will:
 * expose overloaded methods
 * handle multiple Analytics instances
 * consume SDK preload event buffer
 */
class RudderAnalytics implements IRudderAnalytics<IAnalytics> {
  // START-NO-SONAR-SCAN
  // eslint-disable-next-line sonarjs/public-static-readonly
  static globalSingleton: Nullable<RudderAnalytics> = null;
  // END-NO-SONAR-SCAN
  analyticsInstances: Record<string, IAnalytics> = {};
  defaultAnalyticsKey = '';
  logger = defaultLogger;

  // Singleton with constructor bind methods
  constructor() {
    try {
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
      this.setAuthToken = this.setAuthToken.bind(this);
      this.consent = this.consent.bind(this);

      RudderAnalytics.globalSingleton = this;

      state.autoTrack.pageLifecycle.visitId.value = generateUUID();
      state.autoTrack.pageLifecycle.pageLoadedTimestamp.value = Date.now();

      // start loading if a load event was buffered or wait for explicit load call
      this.triggerBufferedLoadEvent();

      // Assign to global "rudderanalytics" object after processing the preload buffer (if any exists)
      // for CDN bundling IIFE exports covers this but for npm ESM and CJS bundling has to be done explicitly
      (globalThis as typeof window).rudderanalytics = this;
    } catch (error: any) {
      dispatchErrorEvent(error);
    }
  }

  /**
   * Set instance to use if no specific writeKey is provided in methods
   * automatically for the first created instance
   * TODO: to support multiple analytics instances in the near future
   */
  setDefaultInstanceKey(writeKey: string) {
    // IMP: Add try-catch block to handle any unhandled errors
    // similar to other public methods
    // if the implementation of this method goes beyond
    // this simple implementation
    if (isString(writeKey) && writeKey) {
      this.defaultAnalyticsKey = writeKey;
    }
  }

  /**
   * Retrieve an existing analytics instance
   */
  getAnalyticsInstance(writeKey?: string): IAnalytics | undefined {
    try {
      let instanceId = writeKey;
      if (!isString(instanceId) || !instanceId) {
        instanceId = this.defaultAnalyticsKey;
      }

      const analyticsInstanceExists = Boolean(this.analyticsInstances[instanceId]);

      if (!analyticsInstanceExists) {
        this.analyticsInstances[instanceId] = new Analytics();
      }

      return this.analyticsInstances[instanceId] as IAnalytics;
    } catch (error: any) {
      dispatchErrorEvent(error);
      return undefined;
    }
  }

  /**
   * Loads the SDK
   * @param writeKey Source write key
   * @param dataPlaneUrl Data plane URL
   * @param loadOptions Additional options for loading the SDK
   * @returns none
   */
  load(writeKey: string, dataPlaneUrl: string, loadOptions?: Partial<LoadOptions>): void {
    try {
      if (this.analyticsInstances[writeKey]) {
        return;
      }

      this.setDefaultInstanceKey(writeKey);
      // Get the preloaded events array from global buffer instead of window.rudderanalytics
      // as the constructor must have already pushed the events to the global buffer
      const preloadedEventsArray = getExposedGlobal(GLOBAL_PRELOAD_BUFFER) as PreloadedEventCall[];

      // Track page loaded lifecycle event if enabled
      this.trackPageLifecycleEvents(preloadedEventsArray, loadOptions);

      // The array will be mutated in the below method
      promotePreloadedConsentEventsToTop(preloadedEventsArray);

      setExposedGlobal(GLOBAL_PRELOAD_BUFFER, clone(preloadedEventsArray));

      this.getAnalyticsInstance(writeKey)?.load(
        writeKey,
        dataPlaneUrl,
        getSanitizedValue(loadOptions),
      );
    } catch (error: any) {
      dispatchErrorEvent(error);
    }
  }

  /**
   * A function to track page lifecycle events like page loaded and page unloaded
   * @param preloadedEventsArray
   * @param loadOptions
   * @returns
   */
  trackPageLifecycleEvents(
    preloadedEventsArray: PreloadedEventCall[],
    loadOptions?: Partial<LoadOptions>,
  ) {
    const { autoTrack, useBeacon } = loadOptions ?? {};
    const {
      enabled: autoTrackEnabled = false,
      options: autoTrackOptions = {},
      pageLifecycle,
    } = autoTrack ?? {};

    const {
      events = [PageLifecycleEvents.LOADED, PageLifecycleEvents.UNLOADED],
      enabled: pageLifecycleEnabled = autoTrackEnabled,
      options = autoTrackOptions,
    } = pageLifecycle ?? {};

    state.autoTrack.pageLifecycle.enabled.value = pageLifecycleEnabled;

    // Set the autoTrack enabled state
    // if at least one of the autoTrack options is enabled
    // IMPORTANT: make sure this is done at the end as it depends on the above states
    state.autoTrack.enabled.value = autoTrackEnabled || pageLifecycleEnabled;

    if (!pageLifecycleEnabled) {
      return;
    }
    this.trackPageLoadedEvent(events, options, preloadedEventsArray);
    this.setupPageUnloadTracking(events, useBeacon, options);
  }

  /**
   * Buffer the page loaded event in the preloaded events array
   * @param events
   * @param options
   * @param preloadedEventsArray
   */
  // eslint-disable-next-line class-methods-use-this
  trackPageLoadedEvent(
    events: PageLifecycleEvents[],
    options: ApiOptions,
    preloadedEventsArray: PreloadedEventCall[],
  ) {
    if (events.length === 0 || events.includes(PageLifecycleEvents.LOADED)) {
      preloadedEventsArray.unshift([
        'track',
        PageLifecycleEvents.LOADED,
        {},
        {
          ...options,
          originalTimestamp: getFormattedTimestamp(
            new Date(state.autoTrack.pageLifecycle.pageLoadedTimestamp.value as number),
          ),
        },
      ]);
    }
  }

  /**
   * Setup page unload tracking if enabled
   * @param events
   * @param useBeacon
   * @param options
   */
  setupPageUnloadTracking(
    events: PageLifecycleEvents[],
    useBeacon: boolean | undefined,
    options: ApiOptions,
  ) {
    if (events.length === 0 || events.includes(PageLifecycleEvents.UNLOADED)) {
      if (useBeacon === true) {
        onPageLeave((isAccessible: boolean) => {
          if (isAccessible === false && state.lifecycle.loaded.value) {
            const pageUnloadedTimestamp = Date.now();
            const visitDuration =
              pageUnloadedTimestamp -
              (state.autoTrack.pageLifecycle.pageLoadedTimestamp.value as number);

            this.track(
              PageLifecycleEvents.UNLOADED,
              {
                visitDuration,
              },
              {
                ...options,
                originalTimestamp: getFormattedTimestamp(new Date(pageUnloadedTimestamp)),
              },
            );
          }
        });
      } else {
        // log warning if beacon is disabled
        this.logger.warn(PAGE_UNLOAD_ON_BEACON_DISABLED_WARNING(RSA));
      }
    }
  }

  /**
   * Trigger load event in buffer queue if exists and stores the
   * remaining preloaded events array in global object
   */
  triggerBufferedLoadEvent() {
    const preloadedEventsArray = Array.isArray((globalThis as typeof window).rudderanalytics)
      ? ((globalThis as typeof window).rudderanalytics as unknown as PreloadedEventCall[])
      : ([] as PreloadedEventCall[]);

    // Get any load method call that is buffered if any
    // BTW, load method is also removed from the array
    // So, the Analytics object can directly consume the remaining events
    const loadEvent: PreloadedEventCall = getPreloadedLoadEvent(preloadedEventsArray);

    // Set the final preloaded events array in global object
    setExposedGlobal(GLOBAL_PRELOAD_BUFFER, clone([...preloadedEventsArray]));

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
    try {
      this.getAnalyticsInstance()?.ready(getSanitizedValue(callback));
    } catch (error: any) {
      dispatchErrorEvent(error);
    }
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
    try {
      this.getAnalyticsInstance()?.page(
        pageArgumentsToCallOptions(
          getSanitizedValue(category),
          getSanitizedValue(name),
          getSanitizedValue(properties),
          getSanitizedValue(options),
          getSanitizedValue(callback),
        ),
      );
    } catch (error: any) {
      dispatchErrorEvent(error);
    }
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
    try {
      this.getAnalyticsInstance()?.track(
        trackArgumentsToCallOptions(
          getSanitizedValue(event),
          getSanitizedValue(properties),
          getSanitizedValue(options),
          getSanitizedValue(callback),
        ),
      );
    } catch (error: any) {
      dispatchErrorEvent(error);
    }
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
    try {
      this.getAnalyticsInstance()?.identify(
        identifyArgumentsToCallOptions(
          getSanitizedValue(userId),
          getSanitizedValue(traits),
          getSanitizedValue(options),
          getSanitizedValue(callback),
        ),
      );
    } catch (error: any) {
      dispatchErrorEvent(error);
    }
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
    try {
      this.getAnalyticsInstance()?.alias(
        aliasArgumentsToCallOptions(
          getSanitizedValue(to),
          getSanitizedValue(from),
          getSanitizedValue(options),
          getSanitizedValue(callback),
        ),
      );
    } catch (error: any) {
      dispatchErrorEvent(error);
    }
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
    try {
      this.getAnalyticsInstance()?.group(
        groupArgumentsToCallOptions(
          getSanitizedValue(groupId),
          getSanitizedValue(traits),
          getSanitizedValue(options),
          getSanitizedValue(callback),
        ),
      );
    } catch (error: any) {
      dispatchErrorEvent(error);
    }
  }

  reset(resetAnonymousId?: boolean) {
    try {
      this.getAnalyticsInstance()?.reset(getSanitizedValue(resetAnonymousId));
    } catch (error: any) {
      dispatchErrorEvent(error);
    }
  }

  getAnonymousId(options?: AnonymousIdOptions): string | undefined {
    try {
      return this.getAnalyticsInstance()?.getAnonymousId(getSanitizedValue(options));
    } catch (error: any) {
      dispatchErrorEvent(error);
      return undefined;
    }
  }

  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string): void {
    try {
      this.getAnalyticsInstance()?.setAnonymousId(
        getSanitizedValue(anonymousId),
        getSanitizedValue(rudderAmpLinkerParam),
      );
    } catch (error: any) {
      dispatchErrorEvent(error);
    }
  }

  getUserId() {
    try {
      return this.getAnalyticsInstance()?.getUserId();
    } catch (error: any) {
      dispatchErrorEvent(error);
      return undefined;
    }
  }

  getUserTraits() {
    try {
      return this.getAnalyticsInstance()?.getUserTraits();
    } catch (error: any) {
      dispatchErrorEvent(error);
      return undefined;
    }
  }

  getGroupId() {
    try {
      return this.getAnalyticsInstance()?.getGroupId();
    } catch (error: any) {
      dispatchErrorEvent(error);
      return undefined;
    }
  }

  getGroupTraits() {
    try {
      return this.getAnalyticsInstance()?.getGroupTraits();
    } catch (error: any) {
      dispatchErrorEvent(error);
      return undefined;
    }
  }

  startSession(sessionId?: number): void {
    try {
      this.getAnalyticsInstance()?.startSession(getSanitizedValue(sessionId));
    } catch (error: any) {
      dispatchErrorEvent(error);
    }
  }

  endSession(): void {
    try {
      this.getAnalyticsInstance()?.endSession();
    } catch (error: any) {
      dispatchErrorEvent(error);
    }
  }

  getSessionId() {
    try {
      return this.getAnalyticsInstance()?.getSessionId();
    } catch (error: any) {
      dispatchErrorEvent(error);
      return undefined;
    }
  }

  setAuthToken(token: string): void {
    try {
      this.getAnalyticsInstance()?.setAuthToken(getSanitizedValue(token));
    } catch (error: any) {
      dispatchErrorEvent(error);
    }
  }

  consent(options?: ConsentOptions): void {
    try {
      this.getAnalyticsInstance()?.consent(getSanitizedValue(options));
    } catch (error: any) {
      dispatchErrorEvent(error);
    }
  }
}

export { RudderAnalytics };
