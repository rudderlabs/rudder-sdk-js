import { Signal, signal } from '@preact/signals-core';
import {
  ClientIntegration,
  Destination,
  InitializedIntegration,
  IntegrationInstance,
  IntegrationOpts,
} from '@rudderstack/analytics-js/state/types';

export type NativeDestinationsState = {
  destinations: Signal<Destination[]>;
  activeIntegrations: Signal<ClientIntegration[]>;
  loadOnlyIntegrations: Signal<IntegrationOpts>;
  clientIntegrationObjects: Signal<IntegrationInstance[] | undefined>;
  loadedIntegrationScripts: Signal<string[]>;
  failedIntegrationScripts: Signal<string[]>;
  loadIntegration: Signal<boolean>;
  integrationsData: Signal<Record<string, any>>;
  initializedIntegrations: Signal<Record<string, InitializedIntegration>>;
  clientIntegrationsReady: Signal<boolean>;
};

const nativeDestinationsState: NativeDestinationsState = {
  destinations: signal([]),
  activeIntegrations: signal([]),
  loadOnlyIntegrations: signal({}),
  clientIntegrationObjects: signal(undefined),
  loadedIntegrationScripts: signal([]),
  failedIntegrationScripts: signal([]),
  loadIntegration: signal(true),
  integrationsData: signal({}),
  initializedIntegrations: signal({}),
  clientIntegrationsReady: signal(false),
};

export { nativeDestinationsState };
