/* eslint-disable @typescript-eslint/no-unused-vars */
import { clone } from 'ramda';
import { isDestIntgConfigFalsy, isDestIntgConfigTruthy } from '../utilities/destination';
import {
  ApiCallback,
  ApiObject,
  ApiOptions,
  ApplicationState,
  Destination,
  DeviceModeDestination,
  ILogger,
  IRudderAnalytics,
  IntegrationOpts,
} from '../types/common';
import { Nullable } from '../types/plugins';
import {
  DEVICE_MODE_DESTINATIONS_PLUGIN,
  INITIALIZED_CHECK_TIMEOUT,
  LOAD_CHECK_POLL_INTERVAL,
} from './constants';
import { destCNamesToDispNamesMap } from './destCNamesToDisplayNames';
import { DeviceModeDestinationsAnalyticsInstance } from './types';
import {
  aliasArgumentsToCallOptions,
  groupArgumentsToCallOptions,
  identifyArgumentsToCallOptions,
  isFunction,
  isUndefined,
  mergeDeepRight,
  pageArgumentsToCallOptions,
  trackArgumentsToCallOptions,
} from '../utilities/common';

/**
 * Determines if the destination SDK code is evaluated
 * @param destSDKIdentifier The name of the global globalThis object that contains the destination SDK
 * @param sdkTypeName The name of the destination SDK type
 * @param logger Logger instance
 * @returns true if the destination SDK code is evaluated, false otherwise
 */
const isDestinationSDKEvaluated = (
  destSDKIdentifier: string,
  sdkTypeName: string,
  logger?: ILogger,
): boolean =>
  Boolean(
    (globalThis as any)[destSDKIdentifier] &&
      (globalThis as any)[destSDKIdentifier][sdkTypeName] &&
      (globalThis as any)[destSDKIdentifier][sdkTypeName].prototype &&
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
  logger?: ILogger,
) => {
  const rAnalytics = (globalThis as any).rudderanalytics as IRudderAnalytics;
  const analytics = rAnalytics.getAnalyticsInstance(state.lifecycle.writeKey.value);

  return new (globalThis as any)[destSDKIdentifier][sdkTypeName](
    clone(dest.config),
    {
      loadIntegration: state.nativeDestinations.loadIntegration.value,
      logLevel: state.lifecycle.logLevel.value,
      loadOnlyIntegrations: state.nativeDestinations.loadOnlyIntegrations.value,
      page: (
        category?: string | Nullable<ApiObject> | ApiCallback,
        name?: string | Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
        properties?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
        options?: Nullable<ApiOptions> | ApiCallback,
        callback?: ApiCallback,
      ) =>
        analytics.page(pageArgumentsToCallOptions(category, name, properties, options, callback)),
      track: (
        event: string,
        properties?: Nullable<ApiObject> | ApiCallback,
        options?: Nullable<ApiOptions> | ApiCallback,
        callback?: ApiCallback,
      ) => analytics.track(trackArgumentsToCallOptions(event, properties, options, callback)),
      identify: (
        userId?: string | number | Nullable<ApiObject>,
        traits?: Nullable<ApiObject> | ApiCallback,
        options?: Nullable<ApiOptions> | ApiCallback,
        callback?: ApiCallback,
      ) => analytics.identify(identifyArgumentsToCallOptions(userId, traits, options, callback)),
      alias: (
        to?: Nullable<string> | ApiCallback,
        from?: string | Nullable<ApiOptions> | ApiCallback,
        options?: Nullable<ApiOptions> | ApiCallback,
        callback?: ApiCallback,
      ) => analytics.alias(aliasArgumentsToCallOptions(to, from, options, callback)),
      group: (
        groupId: string | number | Nullable<ApiObject> | ApiCallback,
        traits?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
        options?: Nullable<ApiOptions> | ApiCallback,
        callback?: ApiCallback,
      ) => analytics.group(groupArgumentsToCallOptions(groupId, traits, options, callback)),
      getAnonymousId: () => analytics.getAnonymousId(),
      getUserId: () => analytics.getUserId(),
      getUserTraits: () => analytics.getUserTraits(),
      getGroupId: () => analytics.getGroupId(),
      getGroupTraits: () => analytics.getGroupTraits(),
      getSessionId: () => analytics.getSessionId(),
    } as DeviceModeDestinationsAnalyticsInstance,
    {
      enableTransformationForDeviceMode: dest.enableTransformationForDeviceMode,
      propagateEventsUntransformedOnError: dest.propagateEventsUntransformedOnError,
      destinationId: dest.id,
    },
  );
};

const isDestinationReady = (dest: Destination, logger?: ILogger, time = 0) =>
  new Promise((resolve, reject) => {
    const instance = dest.instance as DeviceModeDestination;
    if (instance.isLoaded() && (!instance.isReady || instance.isReady())) {
      resolve(true);
    } else if (time >= INITIALIZED_CHECK_TIMEOUT) {
      reject(new Error(`Destination "${dest.userFriendlyId}" ready check timed out`));
    } else {
      wait(LOAD_CHECK_POLL_INTERVAL)
        .then(() =>
          isDestinationReady(dest, logger, time + LOAD_CHECK_POLL_INTERVAL)
            .then(resolve)
            .catch(err => reject(err)),
        )
        .catch(err => reject(err));
    }
  });

/**
 * Converts the common names of the destinations to their display names
 * @param intgOptions Load or API integration options
 */
const normalizeIntegrationOptions = (intgOptions?: IntegrationOpts): IntegrationOpts => {
  const normalizedIntegrationOptions: IntegrationOpts = {};
  if (intgOptions) {
    Object.keys(intgOptions).forEach(key => {
      const destOpts = clone(intgOptions[key]);
      if (key === 'All') {
        normalizedIntegrationOptions[key] = Boolean(destOpts);
      } else {
        const displayName = destCNamesToDispNamesMap[key];
        if (displayName) {
          normalizedIntegrationOptions[displayName] = destOpts;
        } else {
          normalizedIntegrationOptions[key] = destOpts;
        }
      }
    });
  }

  if (isUndefined(normalizedIntegrationOptions.All)) {
    normalizedIntegrationOptions.All = true;
  }

  return normalizedIntegrationOptions;
};

/**
 * Filters the destinations that should not be loaded or forwarded events to based on the integration options (load or events API)
 * @param intgOpts Integration options object
 * @param destinations Destinations array
 * @returns Destinations array filtered based on the integration options
 */
const filterDestinations = (intgOpts: IntegrationOpts, destinations: Destination[]) => {
  const allOptVal = intgOpts.All;
  return destinations.filter(dest => {
    const dispName = dest.displayName;
    let isDestEnabled;
    if (allOptVal) {
      isDestEnabled = true;
      if (isDestIntgConfigFalsy(intgOpts[dispName])) {
        isDestEnabled = false;
      }
    } else {
      isDestEnabled = false;
      if (isDestIntgConfigTruthy(intgOpts[dispName])) {
        isDestEnabled = true;
      }
    }
    return isDestEnabled;
  });
};

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
  logger?: ILogger,
): IntegrationOpts => {
  let integrationsConfig: IntegrationOpts = curDestIntgConfig;
  if (isFunction(dest.instance?.getDataForIntegrationsObject)) {
    try {
      integrationsConfig = mergeDeepRight(
        curDestIntgConfig,
        dest.instance?.getDataForIntegrationsObject(),
      );
    } catch (err) {
      logger?.error(
        `${DEVICE_MODE_DESTINATIONS_PLUGIN}:: Failed to retrieve data for integrations object of destination "${dest.userFriendlyId}".`,
        err,
      );
    }
  }
  return integrationsConfig;
};

export {
  isDestinationSDKEvaluated,
  wait,
  createDestinationInstance,
  isDestinationReady,
  normalizeIntegrationOptions,
  filterDestinations,
  getCumulativeIntegrationsConfig,
};
