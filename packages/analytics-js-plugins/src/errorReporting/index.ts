/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import {
  ApplicationState,
  ILogger,
  IExternalSrcLoader,
  IPluginEngine,
} from '@rudderstack/common/types/common';
import { ExtensionPlugin, Nullable } from '../types/plugins';

const pluginName = 'ErrorReporting';

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
        return Promise.reject(new Error('Invalid source configuration or source id.'));
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
