import { getSegmentAnonymousId } from './util';
import { externallyLoadedSessionStorageKeys } from './constants';
const pluginName = 'ExternalAnonymousId';
const ExternalAnonymousId = () => ({
  name: pluginName,
  initialize: state => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  storage: {
    getAnonymousId(getStorageEngine, options) {
      var _a;
      let anonymousId;
      if (
        ((_a = options === null || options === void 0 ? void 0 : options.autoCapture) === null ||
        _a === void 0
          ? void 0
          : _a.enabled) &&
        options.autoCapture.source
      ) {
        const source = options.autoCapture.source.toLowerCase();
        if (!Object.keys(externallyLoadedSessionStorageKeys).includes(source)) {
          return anonymousId;
        }
        // eslint-disable-next-line sonarjs/no-small-switch
        switch (source) {
          case 'segment':
            anonymousId = getSegmentAnonymousId(getStorageEngine);
            break;
          default:
            break;
        }
      }
      return anonymousId;
    },
  },
});
export { ExternalAnonymousId };
export default ExternalAnonymousId;
