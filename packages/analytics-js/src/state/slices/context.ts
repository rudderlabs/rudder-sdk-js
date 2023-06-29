import { signal } from '@preact/signals-core';
import { APP_NAME, APP_NAMESPACE, APP_VERSION } from '@rudderstack/analytics-js/constants/app';
import { ContextState } from '@rudderstack/common/types/ApplicationState';

const contextState: ContextState = {
  app: signal({
    name: APP_NAME,
    namespace: APP_NAMESPACE,
    version: APP_VERSION,
  }),
  traits: signal(null),
  library: signal({
    name: APP_NAME,
    version: APP_VERSION,
  }),
  userAgent: signal(''),
  device: signal(null),
  network: signal(null),
  os: signal({
    name: '',
    version: '',
  }),
  locale: signal(null),
  screen: signal({
    density: 0,
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
  }),
  'ua-ch': signal(undefined),
  campaign: signal({}),
};

export { contextState };
