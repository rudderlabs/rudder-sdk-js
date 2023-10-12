/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { clone } from 'ramda';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { checks } from '../shared-chunks/common';
import { eventMethodOverloads, destinations } from '../shared-chunks/deviceModeDestinations';
import { DEVICE_MODE_DESTINATIONS_PLUGIN, READY_CHECK_TIMEOUT_MS } from './constants';
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
const isDestinationSDKMounted = (destSDKIdentifier, sdkTypeName, logger) =>
  Boolean(
    globalThis[destSDKIdentifier] &&
      globalThis[destSDKIdentifier][sdkTypeName] &&
      globalThis[destSDKIdentifier][sdkTypeName].prototype &&
      typeof globalThis[destSDKIdentifier][sdkTypeName].prototype.constructor !== 'undefined',
  );
const wait = time =>
  new Promise(resolve => {
    globalThis.setTimeout(resolve, time);
  });
const createDestinationInstance = (destSDKIdentifier, sdkTypeName, dest, state) => {
  const rAnalytics = globalThis.rudderanalytics;
  const analytics = rAnalytics.getAnalyticsInstance(state.lifecycle.writeKey.value);
  return new globalThis[destSDKIdentifier][sdkTypeName](
    clone(dest.config),
    {
      loadIntegration: state.nativeDestinations.loadIntegration.value,
      logLevel: state.lifecycle.logLevel.value,
      loadOnlyIntegrations: state.nativeDestinations.loadOnlyIntegrations.value,
      page: (category, name, properties, options, callback) =>
        analytics.page(
          eventMethodOverloads.pageArgumentsToCallOptions(
            category,
            name,
            properties,
            options,
            callback,
          ),
        ),
      track: (event, properties, options, callback) =>
        analytics.track(
          eventMethodOverloads.trackArgumentsToCallOptions(event, properties, options, callback),
        ),
      identify: (userId, traits, options, callback) =>
        analytics.identify(
          eventMethodOverloads.identifyArgumentsToCallOptions(userId, traits, options, callback),
        ),
      alias: (to, from, options, callback) =>
        analytics.alias(
          eventMethodOverloads.aliasArgumentsToCallOptions(to, from, options, callback),
        ),
      group: (groupId, traits, options, callback) =>
        analytics.group(
          eventMethodOverloads.groupArgumentsToCallOptions(groupId, traits, options, callback),
        ),
      getAnonymousId: () => analytics.getAnonymousId(),
      getUserId: () => analytics.getUserId(),
      getUserTraits: () => analytics.getUserTraits(),
      getGroupId: () => analytics.getGroupId(),
      getGroupTraits: () => analytics.getGroupTraits(),
      getSessionId: () => analytics.getSessionId(),
    },
    {
      shouldApplyDeviceModeTransformation: dest.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: dest.propagateEventsUntransformedOnError,
      destinationId: dest.id,
    },
  );
};
const isDestinationReady = dest =>
  new Promise((resolve, reject) => {
    const instance = dest.instance;
    let handleNumber;
    const checkReady = () => {
      if (instance.isLoaded() && (!instance.isReady || instance.isReady())) {
        resolve(true);
      } else {
        handleNumber = globalThis.requestAnimationFrame(checkReady);
      }
    };
    checkReady();
    setTimeout(() => {
      globalThis.cancelAnimationFrame(handleNumber);
      reject(
        new Error(DESTINATION_READY_TIMEOUT_ERROR(READY_CHECK_TIMEOUT_MS, dest.userFriendlyId)),
      );
    }, READY_CHECK_TIMEOUT_MS);
  });
/**
 * Extracts the integration config, if any, from the given destination
 * and merges it with the current integrations config
 * @param dest Destination object
 * @param curDestIntgConfig Current destinations integration config
 * @param logger Logger object
 * @returns Combined destinations integrations config
 */
const getCumulativeIntegrationsConfig = (dest, curDestIntgConfig, errorHandler) => {
  var _a, _b;
  let integrationsConfig = curDestIntgConfig;
  if (
    checks.isFunction(
      (_a = dest.instance) === null || _a === void 0 ? void 0 : _a.getDataForIntegrationsObject,
    )
  ) {
    try {
      integrationsConfig = mergeDeepRight(
        curDestIntgConfig,
        (_b = dest.instance) === null || _b === void 0 ? void 0 : _b.getDataForIntegrationsObject(),
      );
    } catch (err) {
      errorHandler === null || errorHandler === void 0
        ? void 0
        : errorHandler.onError(
            err,
            DEVICE_MODE_DESTINATIONS_PLUGIN,
            DESTINATION_INTEGRATIONS_DATA_ERROR(dest.userFriendlyId),
          );
    }
  }
  return integrationsConfig;
};
const initializeDestination = (
  dest,
  state,
  destSDKIdentifier,
  sdkTypeName,
  errorHandler,
  logger,
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
        logger === null || logger === void 0 ? void 0 : logger.error(err);
      });
  } catch (err) {
    state.nativeDestinations.failedDestinations.value = [
      ...state.nativeDestinations.failedDestinations.value,
      dest,
    ];
    errorHandler === null || errorHandler === void 0
      ? void 0
      : errorHandler.onError(
          err,
          DEVICE_MODE_DESTINATIONS_PLUGIN,
          DESTINATION_INIT_ERROR(dest.userFriendlyId),
        );
  }
};
export {
  isDestinationSDKMounted,
  wait,
  createDestinationInstance,
  isDestinationReady,
  getCumulativeIntegrationsConfig,
  initializeDestination,
};
