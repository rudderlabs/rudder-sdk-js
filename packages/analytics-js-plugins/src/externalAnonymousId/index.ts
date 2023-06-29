/* eslint-disable no-param-reassign */
import { IStorage, StorageType } from '@rudderstack/common/types/Store';
import { ApplicationState } from '@rudderstack/common/types/ApplicationState';
import { ExtensionPlugin } from '@rudderstack/common/types/PluginEngine';
import { AnonymousIdOptions } from '@rudderstack/common/types/LoadOptions';
import { getSegmentAnonymousId } from './util';
import { externallyLoadedSessionStorageKeys } from './constants';

const pluginName = 'ExternalAnonymousId';

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
