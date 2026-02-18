import { signal } from '@preact/signals-core';
import type { ContextState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import {
  APP_NAME,
  APP_NAMESPACE,
  APP_VERSION,
  MODULE_TYPE,
  BUILD_VARIANT,
} from '../../constants/app';

// Helper to get the variant value
const getVariantValue = (): string | undefined => {
  // For CDN builds, use runtime window.rudderAnalyticsBuildType
  if ((BUILD_VARIANT as string) === 'CDN_RUNTIME_VALUE') {
    return (globalThis as typeof window).rudderAnalyticsBuildType;
  }
  return BUILD_VARIANT;
};

const contextState: ContextState = {
  app: signal({
    name: APP_NAME,
    namespace: APP_NAMESPACE,
    version: APP_VERSION,
    installType: MODULE_TYPE,
  }),
  traits: signal(null),
  library: signal({
    name: APP_NAME,
    version: APP_VERSION,
    snippetVersion: (globalThis as typeof window).RudderSnippetVersion,
    variant: getVariantValue(),
  }),
  userAgent: signal(null),
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
