import { Signal, signal } from '@preact/signals-core';
import { Destination, IntegrationOpts } from '@rudderstack/analytics-js/state/types';

export type NativeDestinationsState = {
  configuredDestinations: Signal<Destination[]>;
  activeDestinations: Signal<Destination[]>;
  loadOnlyIntegrations: Signal<IntegrationOpts>;
  failedDestinations: Signal<Destination[]>;
  loadIntegration: Signal<boolean>;
  initializedDestinations: Signal<Destination[]>;
  clientDestinationsReady: Signal<boolean>;
  integrationsConfig: Signal<IntegrationOpts>;
};

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
