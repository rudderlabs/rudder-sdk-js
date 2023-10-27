import { signal } from '@preact/signals-core';
import type { NativeDestinationsState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const nativeDestinationsState: NativeDestinationsState = {
  configuredDestinations: signal([]),
  activeDestinations: signal([]),
  loadOnlyIntegrations: signal({}),
  failedDestinations: signal([]),
  loadIntegration: signal(true),
  initializedDestinations: signal([]),
  clientDestinationsReady: signal(false),
  integrationsConfig: signal({}),
};

export { nativeDestinationsState };
