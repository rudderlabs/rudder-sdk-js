/* eslint-disable no-param-reassign */
import type { IStorage } from '@rudderstack/analytics-js-common/types/Store';
import type { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { AnonymousIdOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { getSegmentAnonymousId } from './util';
import { externallyLoadedSessionStorageKeys } from './constants';

const pluginName: PluginName = 'ExternalAnonymousId';

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
