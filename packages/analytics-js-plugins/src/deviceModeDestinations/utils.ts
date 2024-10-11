/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { clone } from 'ramda';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import type {
  Destination,
  DeviceModeDestination,
} from '@rudderstack/analytics-js-common/types/Destination';
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IRudderAnalytics } from '@rudderstack/analytics-js-common/types/IRudderAnalytics';
import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import type { ApiCallback, ApiOptions } from '@rudderstack/analytics-js-common/types/EventApi';
import type { IntegrationOpts } from '@rudderstack/analytics-js-common/types/Integration';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { IdentifyTraits } from '@rudderstack/analytics-js-common/types/traits';
import type { AnonymousIdOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { checks, time } from '../shared-chunks/common';
import { eventMethodOverloads, destinations } from '../shared-chunks/deviceModeDestinations';
import type { DeviceModeDestinationsAnalyticsInstance } from './types';
import {
  DEVICE_MODE_DESTINATIONS_PLUGIN,
  READY_CHECK_INTERVAL_MS,
  READY_CHECK_TIMEOUT_MS,
} from './constants';
import {
  DESTINATION_INIT_ERROR,
  DESTINATION_INTEGRATIONS_DATA_ERROR,
  DESTINATION_READY_TIMEOUT_ERROR,
} from './logMessages';

/**
 * Determines if the destination SDK code is evaluated
 * @param destSDKIdentifier The name of the global globalThis object that contains the destination SDK
 * @param sdkTypeName The name of the destination SDK type
 * @param logger Logger instance
 * @returns true if the destination SDK code is evaluated, false otherwise
 */
const isDestinationSDKMounted = (
  destSDKIdentifier: string,
  sdkTypeName: string,
  logger?: ILogger,
): boolean =>
  Boolean(
    (globalThis as any)[destSDKIdentifier]?.[sdkTypeName]?.prototype &&
      typeof (globalThis as any)[destSDKIdentifier][sdkTypeName].prototype.constructor !==
        'undefined',
  );

const createDestinationInstance = (
  destSDKIdentifier: string,
  sdkTypeName: string,
  dest: Destination,
  state: ApplicationState,
): DeviceModeDestination => {
  const rAnalytics = (globalThis as any).rudderanalytics as IRudderAnalytics;
  const analytics = rAnalytics.getAnalyticsInstance(state.lifecycle.writeKey.value);

  const analyticsInstance: DeviceModeDestinationsAnalyticsInstance = {
    loadIntegration: state.nativeDestinations.loadIntegration.value,
    logLevel: state.lifecycle.logLevel.value,
    loadOnlyIntegrations:
      state.consents.postConsent.value?.integrations ??
      state.nativeDestinations.loadOnlyIntegrations.value,
    page: (
      category?: string | Nullable<ApiObject> | ApiCallback,
      name?: string | Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
      properties?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
      options?: Nullable<ApiOptions> | ApiCallback,
      callback?: ApiCallback,
    ) =>
      analytics.page(
        eventMethodOverloads.pageArgumentsToCallOptions(
          category,
          name,
          properties,
          options,
          callback,
        ),
      ),
    track: (
      event: string,
      properties?: Nullable<ApiObject> | ApiCallback,
      options?: Nullable<ApiOptions> | ApiCallback,
      callback?: ApiCallback,
    ) =>
      analytics.track(
        eventMethodOverloads.trackArgumentsToCallOptions(event, properties, options, callback),
      ),
    identify: (
      userId: string | number | Nullable<IdentifyTraits>,
      traits?: Nullable<IdentifyTraits> | Nullable<ApiOptions> | ApiCallback,
      options?: Nullable<ApiOptions> | ApiCallback,
      callback?: ApiCallback,
    ) =>
      analytics.identify(
        eventMethodOverloads.identifyArgumentsToCallOptions(userId, traits, options, callback),
      ),
    alias: (
      to: string,
      from?: string | Nullable<ApiOptions> | ApiCallback,
      options?: Nullable<ApiOptions> | ApiCallback,
      callback?: ApiCallback,
    ) =>
      analytics.alias(
        eventMethodOverloads.aliasArgumentsToCallOptions(to, from, options, callback),
      ),
    group: (
      groupId: string | number | Nullable<ApiObject>,
      traits?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
      options?: Nullable<ApiOptions> | ApiCallback,
      callback?: ApiCallback,
    ) =>
      analytics.group(
        eventMethodOverloads.groupArgumentsToCallOptions(groupId, traits, options, callback),
      ),
    getAnonymousId: (options?: AnonymousIdOptions) => analytics.getAnonymousId(options),
    getUserId: () => analytics.getUserId(),
    getUserTraits: () => analytics.getUserTraits(),
    getGroupId: () => analytics.getGroupId(),
    getGroupTraits: () => analytics.getGroupTraits(),
    getSessionId: () => analytics.getSessionId(),
  };

  const deviceModeDestination: DeviceModeDestination = new (globalThis as any)[destSDKIdentifier][
    sdkTypeName
  ](clone(dest.config), analyticsInstance, {
    shouldApplyDeviceModeTransformation: dest.shouldApplyDeviceModeTransformation,
    propagateEventsUntransformedOnError: dest.propagateEventsUntransformedOnError,
    destinationId: dest.id,
  });

  return deviceModeDestination;
};

const isDestinationReady = (dest: Destination, delay = 0) =>
  new Promise((resolve, reject) => {
    const instance = dest.instance as DeviceModeDestination;
    if (instance.isLoaded() && (!instance.isReady || instance.isReady())) {
      resolve(true);
    } else if (delay >= READY_CHECK_TIMEOUT_MS) {
      reject(
        new Error(DESTINATION_READY_TIMEOUT_ERROR(READY_CHECK_TIMEOUT_MS, dest.userFriendlyId)),
      );
    } else {
      const curTime = Date.now();
      time
        .wait(READY_CHECK_INTERVAL_MS)
        .then(() => {
          const elapsedTime = Date.now() - curTime;
          isDestinationReady(dest, delay + elapsedTime)
            .then(resolve)
            .catch((err: Error) => reject(err));
        })
        .catch((err: Error) => reject(err));
    }
  });

/**
 * Extracts the integration config, if any, from the given destination
 * and merges it with the current integrations config
 * @param dest Destination object
 * @param curDestIntgConfig Current destinations integration config
 * @param logger Logger object
 * @returns Combined destinations integrations config
 */
const getCumulativeIntegrationsConfig = (
  dest: Destination,
  curDestIntgConfig: IntegrationOpts,
  errorHandler?: IErrorHandler,
): IntegrationOpts => {
  let integrationsConfig: IntegrationOpts = curDestIntgConfig;
  if (checks.isFunction(dest.instance?.getDataForIntegrationsObject)) {
    try {
      integrationsConfig = mergeDeepRight(
        curDestIntgConfig,
        dest.instance?.getDataForIntegrationsObject(),
      );
    } catch (err: any) {
      errorHandler?.onError(
        err,
        DEVICE_MODE_DESTINATIONS_PLUGIN,
        DESTINATION_INTEGRATIONS_DATA_ERROR(dest.userFriendlyId),
      );
    }
  }
  return integrationsConfig;
};

const initializeDestination = (
  dest: Destination,
  state: ApplicationState,
  destSDKIdentifier: string,
  sdkTypeName: string,
  errorHandler?: IErrorHandler,
  logger?: ILogger,
) => {
  try {
    const initializedDestination = clone(dest);
    const destInstance = createDestinationInstance(destSDKIdentifier, sdkTypeName, dest, state);
    initializedDestination.instance = destInstance;

    destInstance.init();

    isDestinationReady(initializedDestination)
      .then(() => {
        // Collect the integrations data for the hybrid mode destinations
        if (destinations.isHybridModeDestination(initializedDestination)) {
          state.nativeDestinations.integrationsConfig.value = getCumulativeIntegrationsConfig(
            initializedDestination,
            state.nativeDestinations.integrationsConfig.value,
            errorHandler,
          );
        }

        state.nativeDestinations.initializedDestinations.value = [
          ...state.nativeDestinations.initializedDestinations.value,
          initializedDestination,
        ];
      })
      .catch(err => {
        state.nativeDestinations.failedDestinations.value = [
          ...state.nativeDestinations.failedDestinations.value,
          dest,
        ];

        // The error message is already formatted in the isDestinationReady function
        logger?.error(err);
      });
  } catch (err: any) {
    state.nativeDestinations.failedDestinations.value = [
      ...state.nativeDestinations.failedDestinations.value,
      dest,
    ];

    errorHandler?.onError(
      err,
      DEVICE_MODE_DESTINATIONS_PLUGIN,
      DESTINATION_INIT_ERROR(dest.userFriendlyId),
    );
  }
};

export {
  isDestinationSDKMounted,
  createDestinationInstance,
  isDestinationReady,
  getCumulativeIntegrationsConfig,
  initializeDestination,
};
