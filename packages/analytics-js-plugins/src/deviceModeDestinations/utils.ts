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
} from '../types/common';
import { destCNamesToDispNamesMap } from './destCNamesToDispNames';

/**
 * Determines if the destination SDK code is evaluated
 * @param destSDKIdentifier The name of the global window object that contains the destination SDK
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
        (window as any)[destSDKIdentifier] &&
        (window as any)[destSDKIdentifier][sdkTypeName] &&
        (window as any)[destSDKIdentifier][sdkTypeName].prototype &&
        typeof (window as any)[destSDKIdentifier][sdkTypeName].prototype.constructor !==
          'undefined',
    );

    return scriptIsEvaluated;
  } catch (e) {
    logger?.error(e);
    return false;
  }
};

const pause = (time: number) =>
  // eslint-disable-next-line compat/compat
  new Promise(resolve => {
    window.setTimeout(resolve, time);
  });

const createDestinationInstance = (
  destSDKIdentifier: string,
  sdkTypeName: string,
  dest: Destination,
  state: ApplicationState,
  logger?: ILogger,
) =>
  // TODO: why we pass all analytics instance here? used in browser.constructor of each integration ????
  // TODO: create the correct values from te state instead of dummy hardcoded ones
  // TODO: should we just pass the write key and then get the instance from global object?

  new (window as any)[destSDKIdentifier][sdkTypeName](
    dest.config,
    {
      loadIntegration: state.nativeDestinations.loadIntegration.value,
      userId: state.session.userId.value,
      anonymousId: state.session.anonymousUserId.value,
      userTraits: state.session.userTraits.value,
      loadOnlyIntegrations: state.nativeDestinations.loadOnlyIntegrations.value,
      groupId: state.session.groupId.value,
      groupTraits: state.session.groupTraits.value,
    },
    {
      areTransformationsConnected: dest.areTransformationsConnected,
      destinationId: dest.id,
    },
  );

//  new integrationInstance[modName](
//   dest.config,
//   {
//     loadIntegration: true,
//     userId: undefined,
//     anonymousId: '123456',
//     logLevel: 'error',
//     userTraits: undefined,
//     loadOnlyIntegrations: {
//       VWO: {
//         loadIntegration: true,
//       },
//     },
//     groupId: undefined,
//     groupTraits: undefined,
//     methodToCallbackMapping: {
//       syncPixel: false,
//     },
//     uSession: {
//       sessionInfo: {
//         id: 123456,
//       },
//     },
//     emit: () => {},
//   },
//   dest.destinationInfo,
// )
const isDestinationReady = (instance: DeviceModeDestination, time = 0, logger?: ILogger) =>
  // eslint-disable-next-line compat/compat
  new Promise(resolve => {
    if (instance.isLoaded() && (!instance.isReady || instance.isReady())) {
      logger?.debug('instance is loaded and ready', instance);
      resolve(this);
    } else if (time >= INITIALIZED_CHECK_TIMEOUT) {
      throw Error('instance.init timeout expired');
    } else {
      pause(LOAD_CHECK_POLL_INTERVAL).then(() =>
        isDestinationReady(instance, time + LOAD_CHECK_POLL_INTERVAL, logger)
          .then(resolve)
          .catch(e => {
            throw e;
          }),
      );
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
        normalizedIntegrationOptions[key] = destOpts as boolean;
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

  if (normalizedIntegrationOptions.All === undefined) {
    normalizedIntegrationOptions.All = true;
  }

  return normalizedIntegrationOptions;
};

const filterDestinationsToLoad = (
  loadIntgOpts: IntegrationOpts,
  configSupportedDestinations: Destination[],
) => {
  const allOptVal = loadIntgOpts.All;
  return configSupportedDestinations.filter(dest => {
    const dispName = dest.displayName;
    let isDestEnabled;
    if (allOptVal) {
      isDestEnabled = true;
      if (loadIntgOpts[dispName] !== undefined && Boolean(loadIntgOpts[dispName]) === false) {
        isDestEnabled = false;
      }
    } else {
      isDestEnabled = false;
      // All false ==> check if intg true supplied
      if (loadIntgOpts[dispName] !== undefined && Boolean(loadIntgOpts[dispName]) === true) {
        isDestEnabled = true;
      }
    }
    return isDestEnabled;
  });
};

export {
  isDestinationSDKEvaluated,
  pause,
  createDestinationInstance,
  isDestinationReady,
  normalizeIntegrationOptions,
  filterDestinationsToLoad,
};
