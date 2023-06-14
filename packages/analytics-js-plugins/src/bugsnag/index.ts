/* eslint-disable compat/compat */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import {
  ExtensionPlugin,
  ApplicationState,
  IExternalSrcLoader,
  ILogger,
  IErrorHandler,
} from '../types/common';
import { API_KEY } from './constants';
import { initBugsnagClient, loadBugsnagSDK, isApiKeyValid } from './utils';

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
    ): Promise<any> =>
      new Promise((resolve, reject) => {
        // If API key token is not parsed or invalid, don't proceed to initialize the client
        if (!isApiKeyValid()) {
          reject(new Error(`The Bugsnag API key (${API_KEY}) is invalid or not provided`));
          return;
        }

        loadBugsnagSDK(externalSrcLoader, logger);

        initBugsnagClient(state, resolve, reject, logger);
      }),
    notify: (client: any, error: Error, logger?: ILogger): void => {
      client?.notify(error);
    },
    breadcrumb: (client: any, message: string, logger?: ILogger): void => {
      client?.leaveBreadcrumb(message);
    },
  },
});

export { Bugsnag };

export default Bugsnag;
