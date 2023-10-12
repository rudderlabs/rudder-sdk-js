import { BUGSNAG_API_KEY_VALIDATION_ERROR } from './logMessages';
import { API_KEY } from './constants';
import { initBugsnagClient, loadBugsnagSDK, isApiKeyValid, getAppStateForMetadata } from './utils';
const pluginName = 'Bugsnag';
const Bugsnag = () => ({
  name: pluginName,
  deps: [],
  initialize: state => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  errorReportingProvider: {
    init: (state, externalSrcLoader, logger) =>
      new Promise((resolve, reject) => {
        // If API key token is not parsed or invalid, don't proceed to initialize the client
        if (!isApiKeyValid(API_KEY)) {
          reject(new Error(BUGSNAG_API_KEY_VALIDATION_ERROR(API_KEY)));
          return;
        }
        loadBugsnagSDK(externalSrcLoader, logger);
        initBugsnagClient(state, resolve, reject, logger);
      }),
    notify: (client, error, state, logger) => {
      client === null || client === void 0
        ? void 0
        : client.notify(error, {
            metaData: {
              state: getAppStateForMetadata(state),
            },
          });
    },
    breadcrumb: (client, message, logger) => {
      client === null || client === void 0 ? void 0 : client.leaveBreadcrumb(message);
    },
  },
});
export { Bugsnag };
export default Bugsnag;
