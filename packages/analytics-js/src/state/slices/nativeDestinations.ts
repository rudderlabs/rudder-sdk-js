import { Signal, signal } from '@preact/signals-core';
import {
  Destination,
  DeviceModeDestination,
  IntegrationOpts,
} from '@rudderstack/analytics-js/state/types';

export type NativeDestinationsState = {
  configuredDestinations: Signal<Destination[]>;
  activeDestinations: Signal<Destination[]>;
  loadOnlyIntegrations: Signal<IntegrationOpts>;
  loadedDestinationScripts: Signal<string[]>;
  failedDestinationScripts: Signal<string[]>;
  loadIntegration: Signal<boolean>;
  integrationsData: Signal<Record<string, any>>;
  initializedDestinations: Signal<Record<string, DeviceModeDestination>>;
  clientIntegrationsReady: Signal<boolean>;
};

const nativeDestinationsState: NativeDestinationsState = {
  configuredDestinations: signal([]),
  activeDestinations: signal([]),
  loadOnlyIntegrations: signal({}),
  loadedDestinationScripts: signal([]),
  failedDestinationScripts: signal([]),
  loadIntegration: signal(true),
  integrationsData: signal({}),
  initializedDestinations: signal({}),
  clientIntegrationsReady: signal(false),
};

export { nativeDestinationsState };
