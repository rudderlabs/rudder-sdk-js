/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { ApplicationState } from '@rudderstack/common/types/ApplicationState';
import { ILogger } from '@rudderstack/common/types/Logger';
import { IExternalSrcLoader } from '@rudderstack/common/services/ExternalSrcLoader/types';
import { ExtensionPlugin } from '@rudderstack/common/types/PluginEngine';
import { BugsnagLib } from '../types/plugins';
import { API_KEY } from './constants';
import { initBugsnagClient, loadBugsnagSDK, isApiKeyValid, getAppStateForMetadata } from './utils';

const pluginName = 'Bugsnag';

const Bugsnag = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  errorReportingProvider: {
    init: (
      state: ApplicationState,
      externalSrcLoader: IExternalSrcLoader,
      logger?: ILogger,
    ): Promise<BugsnagLib.Client> =>
      new Promise((resolve, reject) => {
        // If API key token is not parsed or invalid, don't proceed to initialize the client
        if (!isApiKeyValid(API_KEY)) {
          reject(new Error(`The Bugsnag API key (${API_KEY}) is invalid or not provided.`));
          return;
        }

        loadBugsnagSDK(externalSrcLoader, logger);

        initBugsnagClient(state, resolve, reject, logger);
      }),
    notify: (
      client: BugsnagLib.Client,
      error: Error,
      state: ApplicationState,
      logger?: ILogger,
    ): void => {
      client?.notify(error, {
        metaData: {
          state: getAppStateForMetadata(state),
        },
      });
    },
    breadcrumb: (client: BugsnagLib.Client, message: string, logger?: ILogger): void => {
      client?.leaveBreadcrumb(message);
    },
  },
});

export { Bugsnag };

export default Bugsnag;
