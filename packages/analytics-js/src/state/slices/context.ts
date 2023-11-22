import { signal } from '@preact/signals-core';
import type { ContextState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { APP_NAME, APP_NAMESPACE, APP_VERSION } from '../../constants/app';

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
    snippetVersion: (globalThis as typeof window).RudderSnippetVersion,
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
  timezone: signal(undefined),
};

export { contextState };
