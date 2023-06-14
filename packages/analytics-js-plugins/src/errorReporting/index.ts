/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import {
  ExtensionPlugin,
  ApplicationState,
  Nullable,
  ILogger,
  IExternalSrcLoader,
  IPluginEngine,
} from '../types/common';

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
        logger?.error(`Invalid source configuration or source id.`);
        return null;
      }

      return pluginEngine.invokeSingle(
        'errorReportingProvider.init',
        state,
        externalSrcLoader,
        logger,
      );
    },
  },
  notify: (pluginEngine: IPluginEngine, client: any, error: Error, logger?: ILogger): void => {
    pluginEngine.invokeSingle('errorReportingProvider.notify', client, error, logger);
  },
  breadcrumb: (
    pluginEngine: IPluginEngine,
    client: any,
    message: string,
    logger?: ILogger,
  ): void => {
    pluginEngine.invokeSingle('errorReportingProvider.breadcrumb', client, message, logger);
  },
});

export { ErrorReporting };

export default ErrorReporting;
