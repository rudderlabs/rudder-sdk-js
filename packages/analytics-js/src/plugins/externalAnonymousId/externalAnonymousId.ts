import { externallyLoadedSessionStorageKeys } from '@rudderstack/analytics-js/components/userSessionManager/sessionStorageKeys';
import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';
import {
  defaultCookieStorage,
  defaultLocalStorage,
} from '@rudderstack/analytics-js/services/StoreManager/storages';
import { AnonymousIdOptions } from '@rudderstack/analytics-js/state/types';

const externalAnonymousId: ExtensionPlugin = {
  name: 'externalAnonymousId',
  storage: {
    getAnonymousId(options?: AnonymousIdOptions) {
      let anonymousId;
      if (options?.autoCapture?.enabled && options.autoCapture.source) {
        const source = options.autoCapture.source.toLowerCase();
        if (!Object.keys(externallyLoadedSessionStorageKeys).includes(source)) {
          return anonymousId;
        }
        switch (source) {
          case 'segment':
            /**
             * First check the local storage for anonymousId
             * Ref: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#identify
             */
            if (defaultLocalStorage.isSupportAvailable) {
              anonymousId = defaultCookieStorage.getItem(
                externallyLoadedSessionStorageKeys[source],
              );
            }
            // If anonymousId is not present in local storage and check cookie support exists
            // fetch it from cookie
            if (!anonymousId && defaultCookieStorage.isSupportAvailable) {
              anonymousId = defaultCookieStorage.getItem(
                externallyLoadedSessionStorageKeys[source],
              );
            }
            return anonymousId;

          default:
            return anonymousId;
        }
      }
      return anonymousId;
    },
  },
};

export { externalAnonymousId };
