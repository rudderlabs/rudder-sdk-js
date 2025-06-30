/* eslint-disable @typescript-eslint/no-unused-vars */
import { clone } from 'ramda';
import {
  isNonEmptyObject,
  removeUndefinedAndNullValues,
} from '@rudderstack/analytics-js-common/utilities/object';
import type {
  Destination,
  DeviceModeIntegration,
} from '@rudderstack/analytics-js-common/types/Destination';
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ILogger, RSALogger } from '@rudderstack/analytics-js-common/types/Logger';
import type {
  IntegrationRSAnalytics,
  RSACustomIntegration,
  RSAnalytics,
} from '@rudderstack/analytics-js-common/types/IRudderAnalytics';
import type { IntegrationOpts } from '@rudderstack/analytics-js-common/types/Integration';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type {
  SourceConfigurationOverride,
  SourceConfigurationOverrideDestination,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import {
  isBoolean,
  isDefined,
  isNullOrUndefined,
  isString,
  isUndefined,
} from '@rudderstack/analytics-js-common/utilities/checks';
import type { RSAEvent } from '@rudderstack/analytics-js-common/types/Event';
import { generateUUID } from '@rudderstack/analytics-js-common/utilities/uuId';
import { getDestinationUserFriendlyId } from '@rudderstack/analytics-js-common/utilities/destinations';
import {
  DEVICE_MODE_DESTINATIONS_PLUGIN,
  READY_CHECK_INTERVAL_MS,
  READY_CHECK_TIMEOUT_MS,
} from './constants';
import {
  INTEGRATION_INIT_ERROR,
  INTEGRATIONS_DATA_ERROR,
  INTEGRATION_READY_TIMEOUT_ERROR,
  INTEGRATION_READY_CHECK_ERROR,
  CUSTOM_INTEGRATION_INVALID_NAME_ERROR,
  CUSTOM_INTEGRATION_ALREADY_EXISTS_ERROR,
  INVALID_CUSTOM_INTEGRATION_ERROR,
} from './logMessages';
import {
  destDisplayNamesToFileNamesMap,
  isHybridModeDestination,
} from '../shared-chunks/deviceModeDestinations';
import { getSanitizedValue, isFunction } from '../shared-chunks/common';
import { INTEGRATIONS_ERROR_CATEGORY } from '../utilities/constants';

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

const createIntegrationInstance = (
  destSDKIdentifier: string,
  sdkTypeName: string,
  dest: Destination,
  state: ApplicationState,
): DeviceModeIntegration => {
  const analyticsInstance: IntegrationRSAnalytics = {
    loadIntegration: state.nativeDestinations.loadIntegration.value,
    logLevel: state.lifecycle.logLevel.value,
    loadOnlyIntegrations:
      state.consents.postConsent.value?.integrations ??
      state.nativeDestinations.loadOnlyIntegrations.value,
    ...(state.lifecycle.safeAnalyticsInstance.value as RSAnalytics),
  };

  const integration: DeviceModeIntegration = new (globalThis as any)[destSDKIdentifier][
    sdkTypeName
  ](clone(dest.config), analyticsInstance, {
    shouldApplyDeviceModeTransformation: dest.shouldApplyDeviceModeTransformation,
    propagateEventsUntransformedOnError: dest.propagateEventsUntransformedOnError,
    destinationId: dest.id,
  });

  return integration;
};

const isDestinationReady = (dest: Destination, time = 0) =>
  new Promise((resolve, reject) => {
    if (dest.integration?.isReady()) {
      resolve(true);
    } else if (time >= READY_CHECK_TIMEOUT_MS) {
      reject(new Error(INTEGRATION_READY_TIMEOUT_ERROR(READY_CHECK_TIMEOUT_MS)));
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
  if (isFunction(dest.integration?.getDataForIntegrationsObject)) {
    try {
      integrationsConfig = {
        ...curDestIntgConfig,
        ...getSanitizedValue(dest.integration.getDataForIntegrationsObject()),
      };
    } catch (err) {
      errorHandler?.onError({
        error: err,
        context: DEVICE_MODE_DESTINATIONS_PLUGIN,
        customMessage: INTEGRATIONS_DATA_ERROR(dest.userFriendlyId),
        groupingHash: INTEGRATIONS_DATA_ERROR(dest.displayName),
        category: INTEGRATIONS_ERROR_CATEGORY,
      });
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
    let integration: DeviceModeIntegration | undefined = initializedDestination.integration;
    if (isUndefined(integration)) {
      integration = createIntegrationInstance(destSDKIdentifier, sdkTypeName, dest, state);
      initializedDestination.integration = integration;
    }

    integration.init?.();

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

        errorHandler?.onError({
          error: err,
          context: DEVICE_MODE_DESTINATIONS_PLUGIN,
          customMessage: INTEGRATION_READY_CHECK_ERROR(dest.userFriendlyId),
          groupingHash: INTEGRATION_READY_CHECK_ERROR(dest.displayName),
          category: INTEGRATIONS_ERROR_CATEGORY,
        });
      });
  } catch (err) {
    state.nativeDestinations.failedDestinations.value = [
      ...state.nativeDestinations.failedDestinations.value,
      dest,
    ];

    errorHandler?.onError({
      error: err,
      context: DEVICE_MODE_DESTINATIONS_PLUGIN,
      customMessage: INTEGRATION_INIT_ERROR(dest.userFriendlyId),
      groupingHash: INTEGRATION_INIT_ERROR(dest.displayName),
      category: INTEGRATIONS_ERROR_CATEGORY,
    });
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
    return filterDisabledDestinations(destinations);
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

    if (overrides.length > 1) {
      // Multiple overrides for the same destination, create clones
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

  return filterDisabledDestinations(processedDestinations);
};

/**
 * This function filters out disabled destinations from the provided array.
 * @param destinations Array of destinations to filter
 * @returns Filtered destinations to only include enabled ones
 */
const filterDisabledDestinations = (destinations: Destination[]): Destination[] =>
  destinations.filter(dest => dest.enabled);

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

/**
 * Validates if a custom integration name is unique and not conflicting with existing destinations
 * @param name - The integration name to validate
 * @param integration - The custom integration instance
 * @param state - Application state
 * @param logger - Logger instance
 * @returns boolean indicating if the name is valid
 */
const validateCustomIntegration = (
  name: string,
  integration: RSACustomIntegration,
  state: ApplicationState,
  logger: ILogger,
): boolean => {
  if (!isString(name) || name.trim().length === 0) {
    logger.error(CUSTOM_INTEGRATION_INVALID_NAME_ERROR(DEVICE_MODE_DESTINATIONS_PLUGIN, name));
    return false;
  }

  // Check against existing configured destinations
  const activeDestinations = state.nativeDestinations.activeDestinations.value || [];

  if (
    isDefined(destDisplayNamesToFileNamesMap[name]) ||
    activeDestinations.some(dest => dest.displayName === name)
  ) {
    logger.error(CUSTOM_INTEGRATION_ALREADY_EXISTS_ERROR(DEVICE_MODE_DESTINATIONS_PLUGIN, name));
    return false;
  }

  // Check if the integration is correctly implemented
  if (
    isNullOrUndefined(integration) ||
    !isFunction(integration.isReady) ||
    (isDefined(integration.init) && !isFunction(integration.init)) ||
    (isDefined(integration.track) && !isFunction(integration.track)) ||
    (isDefined(integration.page) && !isFunction(integration.page)) ||
    (isDefined(integration.identify) && !isFunction(integration.identify)) ||
    (isDefined(integration.group) && !isFunction(integration.group)) ||
    (isDefined(integration.alias) && !isFunction(integration.alias))
  ) {
    logger.error(INVALID_CUSTOM_INTEGRATION_ERROR(DEVICE_MODE_DESTINATIONS_PLUGIN, name));
    return false;
  }

  return true;
};

/**
 * Creates a Destination instance for a custom integration
 * @param name - The name of the custom integration
 * @param integration - The custom integration instance
 * @returns Destination instance configured for the custom integration
 */
const createCustomIntegrationDestination = (
  name: string,
  integration: RSACustomIntegration,
  state: ApplicationState,
  logger: ILogger,
): Destination => {
  // Generate unique ID for the custom integration
  const uniqueId = `custom_${generateUUID()}`;
  const analyticsInstance = state.lifecycle.safeAnalyticsInstance.value as RSAnalytics;

  // Create a new logger object for the custom integration
  // to avoid conflicts with the main logger
  const integrationLogger = clone(logger);
  // Set the scope to the custom integration name
  // for easy identification in the logs
  integrationLogger.setScope(name);

  // Bind only the necessary methods to the new logger object
  const safeLogger: RSALogger = {
    log: integrationLogger.log.bind(integrationLogger),
    info: integrationLogger.info.bind(integrationLogger),
    debug: integrationLogger.debug.bind(integrationLogger),
    warn: integrationLogger.warn.bind(integrationLogger),
    error: integrationLogger.error.bind(integrationLogger),
    setMinLogLevel: integrationLogger.setMinLogLevel.bind(integrationLogger),
  };

  // Create a destination object for the custom integration
  // similar to the standard device mode integrations
  const destination: Destination = {
    id: uniqueId,
    displayName: name,
    userFriendlyId: getDestinationUserFriendlyId(name, uniqueId),
    shouldApplyDeviceModeTransformation: false,
    propagateEventsUntransformedOnError: false,
    config: {
      blacklistedEvents: [],
      whitelistedEvents: [],
      eventFilteringOption: 'disable',
      connectionMode: 'device',
      useNativeSDKToSend: true,
    },
    enabled: true,
    isCustomIntegration: true,
    // Create a wrapper around the custom integration APIs
    // to make them consistent with the standard device mode integrations
    integration: {
      ...(integration.init && { init: () => integration.init!(analyticsInstance, safeLogger) }),
      ...(integration.track && {
        track: (event: RSAEvent) => integration.track!(analyticsInstance, safeLogger, event),
      }),
      ...(integration.page && {
        page: (event: RSAEvent) => integration.page!(analyticsInstance, safeLogger, event),
      }),
      ...(integration.identify && {
        identify: (event: RSAEvent) => integration.identify!(analyticsInstance, safeLogger, event),
      }),
      ...(integration.group && {
        group: (event: RSAEvent) => integration.group!(analyticsInstance, safeLogger, event),
      }),
      ...(integration.alias && {
        alias: (event: RSAEvent) => integration.alias!(analyticsInstance, safeLogger, event),
      }),
      isReady: () => integration.isReady(analyticsInstance, safeLogger),
    },
  };

  return destination;
};

export {
  isDestinationSDKMounted,
  wait,
  createIntegrationInstance,
  isDestinationReady,
  getCumulativeIntegrationsConfig,
  initializeDestination,
  applySourceConfigurationOverrides,
  applyOverrideToDestination,
  filterDisabledDestinations,
  validateCustomIntegration,
  createCustomIntegrationDestination,
};
