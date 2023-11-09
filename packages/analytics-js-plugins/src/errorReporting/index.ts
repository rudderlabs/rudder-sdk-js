/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type {
  ExtensionPlugin,
  IPluginEngine,
} from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { INVALID_SOURCE_CONFIG_ERROR } from './logMessages';

const pluginName: PluginName = 'ErrorReporting';

const ErrorReporting = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  errorReporting: {
    init: (
      state: ApplicationState,
      pluginEngine: IPluginEngine,
      externalSrcLoader: IExternalSrcLoader,
      logger?: ILogger,
    ): Nullable<Promise<any>> => {
      if (!state.source.value?.config || !state.source.value?.id) {
        return Promise.reject(new Error(INVALID_SOURCE_CONFIG_ERROR));
      }

      return pluginEngine.invokeSingle(
        'errorReportingProvider.init',
        state,
        externalSrcLoader,
        logger,
      );
    },
    notify: (
      pluginEngine: IPluginEngine,
      client: any,
      error: Error,
      state: ApplicationState,
      logger?: ILogger,
    ): void => {
      pluginEngine.invokeSingle('errorReportingProvider.notify', client, error, state, logger);
    },
    breadcrumb: (
      pluginEngine: IPluginEngine,
      client: any,
      message: string,
      logger?: ILogger,
    ): void => {
      pluginEngine.invokeSingle('errorReportingProvider.breadcrumb', client, message, logger);
    },
  },
});

export { ErrorReporting };

export default ErrorReporting;
