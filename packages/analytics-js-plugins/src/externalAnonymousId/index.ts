/* eslint-disable no-param-reassign */
import {
  ExtensionPlugin,
  PluginName,
  ApplicationState,
  AnonymousIdOptions,
  StorageType,
  IStorage,
} from '../types/common';
import { getSegmentAnonymousId } from './util';
import { externallyLoadedSessionStorageKeys } from './constants';

const pluginName = PluginName.ExternalAnonymousId;

const ExternalAnonymousId = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  storage: {
    getAnonymousId(
      getStorageEngine: (type?: StorageType) => IStorage,
      options?: AnonymousIdOptions,
    ) {
      let anonymousId;
      if (options?.autoCapture?.enabled && options.autoCapture.source) {
        const source = options.autoCapture.source.toLowerCase();
        if (!Object.keys(externallyLoadedSessionStorageKeys).includes(source)) {
          return anonymousId;
        }
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
