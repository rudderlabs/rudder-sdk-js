/* eslint-disable no-param-reassign */
import { ApplicationState } from '@rudderstack/common/types/common';
import { ExtensionPlugin, Nullable } from '../types/plugins';
import { AMP_LINKER_ANONYMOUS_ID_KEY } from './constants';
import { parseLinker } from './utils';

const pluginName = 'GoogleLinker';

// TODO: refactor this plugin and all related sourcecode to be typesafe
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
