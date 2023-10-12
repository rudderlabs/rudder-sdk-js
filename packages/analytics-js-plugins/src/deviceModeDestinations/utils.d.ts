import { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IntegrationOpts } from '@rudderstack/analytics-js-common/types/Integration';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
/**
 * Determines if the destination SDK code is evaluated
 * @param destSDKIdentifier The name of the global globalThis object that contains the destination SDK
 * @param sdkTypeName The name of the destination SDK type
 * @param logger Logger instance
 * @returns true if the destination SDK code is evaluated, false otherwise
 */
declare const isDestinationSDKMounted: (
  destSDKIdentifier: string,
  sdkTypeName: string,
  logger?: ILogger,
) => boolean;
declare const wait: (time: number) => Promise<unknown>;
declare const createDestinationInstance: (
  destSDKIdentifier: string,
  sdkTypeName: string,
  dest: Destination,
  state: ApplicationState,
) => any;
declare const isDestinationReady: (dest: Destination) => Promise<unknown>;
/**
 * Extracts the integration config, if any, from the given destination
 * and merges it with the current integrations config
 * @param dest Destination object
 * @param curDestIntgConfig Current destinations integration config
 * @param logger Logger object
 * @returns Combined destinations integrations config
 */
declare const getCumulativeIntegrationsConfig: (
  dest: Destination,
  curDestIntgConfig: IntegrationOpts,
  errorHandler?: IErrorHandler,
) => IntegrationOpts;
declare const initializeDestination: (
  dest: Destination,
  state: ApplicationState,
  destSDKIdentifier: string,
  sdkTypeName: string,
  errorHandler?: IErrorHandler,
  logger?: ILogger,
) => void;
export {
  isDestinationSDKMounted,
  wait,
  createDestinationInstance,
  isDestinationReady,
  getCumulativeIntegrationsConfig,
  initializeDestination,
};
