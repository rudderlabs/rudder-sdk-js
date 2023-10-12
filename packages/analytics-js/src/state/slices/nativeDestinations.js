import { signal } from '@preact/signals-core';
const nativeDestinationsState = {
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
