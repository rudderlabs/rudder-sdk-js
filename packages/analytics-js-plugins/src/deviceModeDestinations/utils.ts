/* eslint-disable @typescript-eslint/no-unused-vars */
import { clone } from 'ramda';
import {
  isNonEmptyObject,
  mergeDeepRight,
  removeUndefinedAndNullValues,
} from '@rudderstack/analytics-js-common/utilities/object';
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
import type {
  AnonymousIdOptions,
  SourceConfigurationOverride,
  SourceConfigurationOverrideDestination,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
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
import {
  aliasArgumentsToCallOptions,
  groupArgumentsToCallOptions,
  identifyArgumentsToCallOptions,
  isHybridModeDestination,
  pageArgumentsToCallOptions,
  trackArgumentsToCallOptions,
} from '../shared-chunks/deviceModeDestinations';
import { getSanitizedValue, isFunction } from '../shared-chunks/common';
import { isBoolean } from '@rudderstack/analytics-js-common/utilities/checks';

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

const wait = (time: number) =>
  new Promise(resolve => {
    (globalThis as typeof window).setTimeout(resolve, time);
  });

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
        pageArgumentsToCallOptions(
          getSanitizedValue(category),
          getSanitizedValue(name),
          getSanitizedValue(properties),
          getSanitizedValue(options),
          getSanitizedValue(callback),
        ),
      ),
    track: (
      event: string,
      properties?: Nullable<ApiObject> | ApiCallback,
      options?: Nullable<ApiOptions> | ApiCallback,
      callback?: ApiCallback,
    ) =>
      analytics.track(
        trackArgumentsToCallOptions(
          getSanitizedValue(event),
          getSanitizedValue(properties),
          getSanitizedValue(options),
          getSanitizedValue(callback),
        ),
      ),
    identify: (
      userId: string | number | Nullable<IdentifyTraits>,
      traits?: Nullable<IdentifyTraits> | Nullable<ApiOptions> | ApiCallback,
      options?: Nullable<ApiOptions> | ApiCallback,
      callback?: ApiCallback,
    ) =>
      analytics.identify(
        identifyArgumentsToCallOptions(
          getSanitizedValue(userId),
          getSanitizedValue(traits),
          getSanitizedValue(options),
          getSanitizedValue(callback),
        ),
      ),
    alias: (
      to: string,
      from?: string | Nullable<ApiOptions> | ApiCallback,
      options?: Nullable<ApiOptions> | ApiCallback,
      callback?: ApiCallback,
    ) =>
      analytics.alias(
        aliasArgumentsToCallOptions(
          getSanitizedValue(to),
          getSanitizedValue(from),
          getSanitizedValue(options),
          getSanitizedValue(callback),
        ),
      ),
    group: (
      groupId: string | number | Nullable<ApiObject>,
      traits?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
      options?: Nullable<ApiOptions> | ApiCallback,
      callback?: ApiCallback,
    ) =>
      analytics.group(
        groupArgumentsToCallOptions(
          getSanitizedValue(groupId),
          getSanitizedValue(traits),
          getSanitizedValue(options),
          getSanitizedValue(callback),
        ),
      ),
    getAnonymousId: (options?: AnonymousIdOptions) =>
      analytics.getAnonymousId(getSanitizedValue(options)),
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

const isDestinationReady = (dest: Destination, time = 0) =>
  new Promise((resolve, reject) => {
    const instance = dest.instance as DeviceModeDestination;
    if (instance.isLoaded() && (!instance.isReady || instance.isReady())) {
      resolve(true);
    } else if (time >= READY_CHECK_TIMEOUT_MS) {
      reject(
        new Error(DESTINATION_READY_TIMEOUT_ERROR(READY_CHECK_TIMEOUT_MS, dest.userFriendlyId)),
      );
    } else {
      const curTime = Date.now();
      wait(READY_CHECK_INTERVAL_MS).then(() => {
        const elapsedTime = Date.now() - curTime;
        isDestinationReady(dest, time + elapsedTime)
          .then(resolve)
          .catch((err: Error) => reject(err));
      });
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
  if (isFunction(dest.instance?.getDataForIntegrationsObject)) {
    try {
      integrationsConfig = mergeDeepRight(
        curDestIntgConfig,
        getSanitizedValue(dest.instance?.getDataForIntegrationsObject()),
      );
    } catch (err) {
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
        if (isHybridModeDestination(initializedDestination)) {
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
  } catch (err) {
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

/**
 * Applies source configuration overrides to destinations
 * @param destinations Array of destinations to process
 * @param sourceConfigOverride Source configuration override options
 * @param logger Logger instance for warnings
 * @returns Array of destinations with overrides applied
 */
const applySourceConfigurationOverrides = (
  destinations: Destination[],
  sourceConfigOverride: SourceConfigurationOverride,
  logger?: ILogger,
): Destination[] => {
  if (!sourceConfigOverride?.destinations?.length) {
    return destinations;
  }

  const destIds = destinations.map(dest => dest.id);

  // Group overrides by destination ID to support future cloning
  // When cloning is implemented, multiple overrides with same ID will create multiple destination instances
  const overridesByDestId: Record<string, SourceConfigurationOverrideDestination[]> = {};
  sourceConfigOverride.destinations.forEach((override: SourceConfigurationOverrideDestination) => {
    const existing = overridesByDestId[override.id] || [];
    existing.push(override);
    overridesByDestId[override.id] = existing;
  });

  // Find unmatched destination IDs and log warning
  const unmatchedIds = Object.keys(overridesByDestId).filter(id => !destIds.includes(id));

  if (unmatchedIds.length > 0) {
    logger?.warn(
      `${DEVICE_MODE_DESTINATIONS_PLUGIN}:: Source configuration override - Unable to identify the destinations with the following IDs: "${unmatchedIds.join(', ')}"`,
    );
  }

  // Process overrides and apply them to destinations
  const processedDestinations: Destination[] = [];

  destinations.forEach(dest => {
    const overrides = overridesByDestId[dest.id];
    if (!overrides || overrides.length === 0) {
      // No override for this destination, keep original
      processedDestinations.push(dest);
      return;
    }

    // For now, we assume there will be only one entry in the overrides array
    // const overriddenDestination = applyOverrideToDestination(dest, overrides[0]!);
    // processedDestinations.push(overriddenDestination);

    // TODO: Future enhancement - Support for cloning destinations
    // When cloning is implemented, this is where we would:
    // 1. Process each override in the overrides array, if there is more than one entry in the overrides array, then it's a clone scenario
    // 2. Each entry in the overrides array is treated as a clone of the destination
    // 3. Each clone is applied to the destination
    // 4. The destination is marked as cloned
    // 5. The destination is marked as overridden if the enabled status or config or both have changed
    // 6. The destination is added to the processedDestinations array

    if (overrides.length > 1) {
      overrides.forEach((override: SourceConfigurationOverrideDestination, index: number) => {
        const overriddenDestination = applyOverrideToDestination(dest, override, `${index + 1}`);
        overriddenDestination.cloned = true;
        processedDestinations.push(overriddenDestination);
      });
    } else {
      const overriddenDestination = applyOverrideToDestination(dest, overrides[0]!);
      processedDestinations.push(overriddenDestination);
    }
  });

  return processedDestinations;
};

/**
 * Applies a single override configuration to a destination
 * @param destination Original destination
 * @param override Override configuration
 * @param cloneId Unique identifier for the clone,
 * if provided, the value is appended to the id and userFriendlyId of the destination
 * @returns Modified destination with override applied
 */
const applyOverrideToDestination = (
  destination: Destination,
  override: SourceConfigurationOverrideDestination,
  cloneId?: string,
): Destination => {
  // Check if any changes are needed
  const isEnabledStatusChanged =
    isBoolean(override.enabled) && override.enabled !== destination.enabled;

  // Check if config is provided
  const isConfigChanged = isNonEmptyObject(override.config);

  // Determine the final enabled status after applying overrides
  const finalEnabledStatus = isBoolean(override.enabled) ? override.enabled : destination.enabled;

  // Check if config will actually be applied (only for enabled destinations)
  const willApplyConfig = isConfigChanged && finalEnabledStatus;

  // If no changes needed and no cloneId, return original destination
  if (!isEnabledStatusChanged && !willApplyConfig && !cloneId) {
    return destination;
  }

  // Clone destination and apply overrides
  const clonedDest = clone(destination);
  if (cloneId) {
    clonedDest.id = `${destination.id}_${cloneId}`;
    clonedDest.userFriendlyId = `${destination.userFriendlyId}_${cloneId}`;
  }

  // Apply enabled status override if provided and different
  if (isEnabledStatusChanged) {
    clonedDest.enabled = override.enabled!;

    // Mark as overridden
    clonedDest.overridden = true;
  }

  // Apply config overrides if provided for enabled destination
  if (willApplyConfig) {
    // Override the config with the new config and remove undefined and null values
    clonedDest.config = removeUndefinedAndNullValues({ ...clonedDest.config, ...override.config });
    clonedDest.overridden = true;
  }

  return clonedDest;
};

export {
  isDestinationSDKMounted,
  wait,
  createDestinationInstance,
  isDestinationReady,
  getCumulativeIntegrationsConfig,
  initializeDestination,
  applySourceConfigurationOverrides,
  applyOverrideToDestination,
};
