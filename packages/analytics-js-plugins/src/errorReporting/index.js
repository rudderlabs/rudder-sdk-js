import { INVALID_SOURCE_CONFIG_ERROR } from './logMessages';
const pluginName = 'ErrorReporting';
const ErrorReporting = () => ({
  name: pluginName,
  deps: [],
  initialize: state => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  errorReporting: {
    init: (state, pluginEngine, externalSrcLoader, logger) => {
      var _a, _b;
      if (
        !((_a = state.source.value) === null || _a === void 0 ? void 0 : _a.config) ||
        !((_b = state.source.value) === null || _b === void 0 ? void 0 : _b.id)
      ) {
        return Promise.reject(new Error(INVALID_SOURCE_CONFIG_ERROR));
      }
      return pluginEngine.invokeSingle(
        'errorReportingProvider.init',
        state,
        externalSrcLoader,
        logger,
      );
    },
    notify: (pluginEngine, client, error, state, logger) => {
      pluginEngine.invokeSingle('errorReportingProvider.notify', client, error, state, logger);
    },
    breadcrumb: (pluginEngine, client, message, logger) => {
      pluginEngine.invokeSingle('errorReportingProvider.breadcrumb', client, message, logger);
    },
  },
});
export { ErrorReporting };
export default ErrorReporting;
