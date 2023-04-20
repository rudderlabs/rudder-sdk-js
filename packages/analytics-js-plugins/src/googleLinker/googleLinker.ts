import { ExtensionPlugin, Nullable } from '@rudderstack/analytics-js-plugins/types/common';
import { ApplicationState } from '@rudderstack/analytics-js/state';
import { AMP_LINKER_ANONYMOUS_ID_KEY } from './constants';
import parseLinker from './utils';

const pluginName = 'googleLinker';

// TODO: refactor this plugin and all related sourcecode to be typesafe
const googleLinker = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  userSession: {
    anonymousIdGoogleLinker(rudderAmpLinkerParam?: Nullable<string>): Nullable<string> {
      if (!rudderAmpLinkerParam) {
        return null;
      }

      const parsedAnonymousIdObj = rudderAmpLinkerParam ? parseLinker(rudderAmpLinkerParam) : null;
      return parsedAnonymousIdObj ? parsedAnonymousIdObj[AMP_LINKER_ANONYMOUS_ID_KEY] : null;
    },
  },
});

export { googleLinker };

export default googleLinker;
