/* eslint-disable no-param-reassign */
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { AMP_LINKER_ANONYMOUS_ID_KEY } from './constants';
import { parseLinker } from './utils';

const pluginName = 'GoogleLinker';

const GoogleLinker = (): ExtensionPlugin => ({
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

export { GoogleLinker };

export default GoogleLinker;
