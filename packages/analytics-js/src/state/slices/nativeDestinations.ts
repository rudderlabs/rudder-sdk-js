import { Signal, signal } from '@preact/signals-core';
import { DestinationConfig } from '@rudderstack/analytics-js/components/configManager/types';
import { IntegrationOpts } from '@rudderstack/analytics-js/components/core/IAnalytics';

export type ClientIntegrations = {
  name: string;
  config: DestinationConfig;
};

export type IntegrationInstance = {
  isLoaded: () => boolean;
  isReady?: () => boolean;
};

// TODO: is this still used? only lotame used it
export type ClientSuppliedCallbacks = {
  syncPixel?: () => void;
};

// TODO: is this still used? only lotame used it
export type MethodToCallbackMap = {
  syncPixel: string;
};

// TODO: is this still used? const intMod = window[pluginName];
export type DynamicallyLoadedIntegration = Record<string, any>;

export type NativeDestinationsState = {
  clientIntegrations: Signal<ClientIntegrations[]>;
  loadOnlyIntegrations: Signal<IntegrationOpts>;
  clientIntegrationObjects: Signal<IntegrationInstance[] | undefined>;
  successfullyLoadedIntegration: Signal<IntegrationInstance[]>;
  failedToBeLoadedIntegration: Signal<IntegrationInstance[]>;
  clientSuppliedCallbacks: Signal<ClientSuppliedCallbacks | undefined>;
  methodToCallbackMapping: Signal<MethodToCallbackMap | undefined>;
  loadIntegration: Signal<boolean>;
  integrationsData: Signal<Record<string, any>>;
  dynamicallyLoadedIntegrations: Signal<Record<string, DynamicallyLoadedIntegration>>;
  clientIntegrationsReady: Signal<boolean>;
};

const nativeDestinationsState: NativeDestinationsState = {
  clientIntegrations: signal([]),
  loadOnlyIntegrations: signal({}),
  clientIntegrationObjects: signal(undefined),
  successfullyLoadedIntegration: signal([]),
  failedToBeLoadedIntegration: signal([]),
  clientSuppliedCallbacks: signal(undefined),
  methodToCallbackMapping: signal({
    syncPixel: 'syncPixelCallback',
  }),
  loadIntegration: signal(true),
  integrationsData: signal({}),
  dynamicallyLoadedIntegrations: signal({}),
  clientIntegrationsReady: signal(false),
};

export { nativeDestinationsState };
