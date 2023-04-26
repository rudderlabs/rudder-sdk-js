import { externallyLoadedSessionStorageKeys } from '@rudderstack/analytics-js/components/userSessionManager/sessionStorageKeys';
import { ExtensionPlugin } from '@rudderstack/analytics-js-plugins/types/common';
import { AnonymousIdOptions } from '@rudderstack/analytics-js/state/types';
import { getSegmentAnonymousId } from './util';

const externalAnonymousId = (): ExtensionPlugin => ({
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
            anonymousId = getSegmentAnonymousId();
            break;

          default:
            break;
        }
      }
      return anonymousId;
    },
  },
});

export { externalAnonymousId };

export default externalAnonymousId;
