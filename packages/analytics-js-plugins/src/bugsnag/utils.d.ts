import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { BugsnagLib } from '../types/plugins';
declare const isValidVersion: (globalLibInstance: any) => any;
declare const isRudderSDKError: (event: any) => boolean;
declare const enhanceErrorEventMutator: (event: any, metadataSource: any) => void;
declare const onError: (state: ApplicationState) => (event: any) => boolean;
declare const getReleaseStage: () => 'development' | '__RS_BUGSNAG_RELEASE_STAGE__';
declare const getGlobalBugsnagLibInstance: () => any;
declare const getNewClient: (state: ApplicationState, logger?: ILogger) => BugsnagLib.Client;
declare const isApiKeyValid: (apiKey: string) => boolean;
declare const loadBugsnagSDK: (externalSrcLoader: IExternalSrcLoader, logger?: ILogger) => void;
declare const initBugsnagClient: (
  state: ApplicationState,
  promiseResolve: (value: any) => void,
  promiseReject: (reason?: any) => void,
  logger?: ILogger,
  time?: number,
) => void;
declare const getAppStateForMetadata: (state: ApplicationState) => Record<string, any> | undefined;
export {
  isValidVersion,
  getNewClient,
  isApiKeyValid,
  loadBugsnagSDK,
  getGlobalBugsnagLibInstance,
  initBugsnagClient,
  getReleaseStage,
  isRudderSDKError,
  enhanceErrorEventMutator,
  onError,
  getAppStateForMetadata,
};
