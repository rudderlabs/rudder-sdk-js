/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { BugsnagLib } from '../types/plugins';
import { BUGSNAG_API_KEY_VALIDATION_ERROR, BUGSNAG_SDK_URL_ERROR } from './logMessages';
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
    ): Promise<BugsnagLib.Client> =>
      new Promise((resolve, reject) => {
        // If API key token is not parsed or invalid, don't proceed to initialize the client
        if (!isApiKeyValid(API_KEY)) {
          reject(new Error(BUGSNAG_API_KEY_VALIDATION_ERROR(API_KEY)));
          return;
        }

        // If SDK URL is empty, don't proceed to initialize the client
        // eslint-disable-next-line no-constant-condition
        if (!'__RS_BUGSNAG_SDK_URL__') {
          reject(new Error(BUGSNAG_SDK_URL_ERROR));
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
      client.notify(error);
    },
    breadcrumb: (client: BugsnagLib.Client, message: string, logger?: ILogger): void => {
      client?.leaveBreadcrumb(message);
    },
  },
});

export { Bugsnag };

export default Bugsnag;
