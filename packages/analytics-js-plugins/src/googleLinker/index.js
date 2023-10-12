import { AMP_LINKER_ANONYMOUS_ID_KEY } from './constants';
import { parseLinker } from './utils';
const pluginName = 'GoogleLinker';
const GoogleLinker = () => ({
  name: pluginName,
  initialize: state => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  userSession: {
    anonymousIdGoogleLinker(rudderAmpLinkerParam) {
      if (!rudderAmpLinkerParam) {
        return null;
      }
      const parsedAnonymousIdObj = rudderAmpLinkerParam ? parseLinker(rudderAmpLinkerParam) : null;
      return parsedAnonymousIdObj ? parsedAnonymousIdObj[AMP_LINKER_ANONYMOUS_ID_KEY] : null;
    },
  },
});
export { GoogleLinker };
export default GoogleLinker;
