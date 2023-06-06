/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  INITIALIZED_CHECK_TIMEOUT,
  LOAD_CHECK_POLL_INTERVAL,
} from '@rudderstack/analytics-js-plugins/deviceModeDestinations/constants';
import { clone } from 'ramda';
import {
  ApplicationState,
  Destination,
  DeviceModeDestination,
  ILogger,
  IntegrationOpts,
} from '@rudderstack/analytics-js-plugins/types/common';
import { destCNamesToDispNamesMap } from './destCNamesToDispNames';
import { DeviceModeDestinationsAnalyticsInstance } from './types';
import { isUndefined } from '../utilities/common';

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
): boolean => {
  try {
    const scriptIsEvaluated = Boolean(
      destSDKIdentifier &&
        sdkTypeName &&
        (globalThis as any)[destSDKIdentifier] &&
        (globalThis as any)[destSDKIdentifier][sdkTypeName] &&
        (globalThis as any)[destSDKIdentifier][sdkTypeName].prototype &&
        typeof (globalThis as any)[destSDKIdentifier][sdkTypeName].prototype.constructor !==
          'undefined',
    );

    return scriptIsEvaluated;
  } catch (e) {
    logger?.error(e);
    return false;
  }
};

const wait = (time: number) =>
  // eslint-disable-next-line compat/compat
  new Promise(resolve => {
    globalThis.setTimeout(resolve, time);
  });

const createDestinationInstance = (
  destSDKIdentifier: string,
  sdkTypeName: string,
  dest: Destination,
  state: ApplicationState,
  logger?: ILogger,
) => {
  const analytics = (globalThis as any).rudderanalytics;

  // TODO: avoid this object wrapping of the RudderAnalytics API methods
  return new (globalThis as any)[destSDKIdentifier][sdkTypeName](
    clone(dest.config),
    {
      loadIntegration: state.nativeDestinations.loadIntegration.value,
      logLevel: state.lifecycle.logLevel.value,
      loadOnlyIntegrations: state.nativeDestinations.loadOnlyIntegrations.value,
      track: (...args: any) => analytics.track(...args),
      page: (...args: any) => analytics.page(...args),
      identify: (...args: any) => analytics.identify(...args),
      group: (...args: any) => analytics.group(...args),
      alias: (...args: any) => analytics.alias(...args),
      getAnonymousId: () => analytics.getAnonymousId(),
      getUserId: () => analytics.getUserId(),
      getUserTraits: () => analytics.getUserTraits(),
      getGroupId: () => analytics.getGroupId(),
      getGroupTraits: () => analytics.getGroupTraits(),
      getSessionId: () => analytics.getSessionId(),
    } as DeviceModeDestinationsAnalyticsInstance,
    {
      areTransformationsConnected: dest.areTransformationsConnected,
      destinationId: dest.id,
    },
  );
};

const isDestinationReady = (dest: Destination, logger?: ILogger, time = 0) =>
  // eslint-disable-next-line compat/compat
  new Promise((resolve, reject) => {
    const instance = dest.instance as DeviceModeDestination;
    if (instance.isLoaded() && (!instance.isReady || instance.isReady())) {
      resolve(this);
    } else if (time >= INITIALIZED_CHECK_TIMEOUT) {
      reject(new Error(`Destination "${dest.userFriendlyId}" ready check timed out`));
    } else {
      wait(LOAD_CHECK_POLL_INTERVAL)
        .then(() =>
          isDestinationReady(dest, logger, time + LOAD_CHECK_POLL_INTERVAL)
            .then(resolve)
            .catch(e => reject(e)),
        )
        .catch(e => reject(e));
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
      if (!isUndefined(intgOpts[dispName]) && Boolean(intgOpts[dispName]) === false) {
        isDestEnabled = false;
      }
    } else {
      isDestEnabled = false;
      if (!isUndefined(intgOpts[dispName]) && Boolean(intgOpts[dispName]) === true) {
        isDestEnabled = true;
      }
    }
    return isDestEnabled;
  });
};

export {
  isDestinationSDKEvaluated,
  wait,
  createDestinationInstance,
  isDestinationReady,
  normalizeIntegrationOptions,
  filterDestinations,
};
