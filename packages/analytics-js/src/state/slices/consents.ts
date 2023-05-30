import { Signal, signal } from '@preact/signals-core';

export type ConsentsState = {
  deniedConsentIds: Signal<string[]>;
  allowedConsents: Signal<Record<string, string>>;
  activeConsentProviderPluginName: Signal<string | undefined>;
  consentProviderInitialized: Signal<boolean>;
};

const consentsState: ConsentsState = {
  deniedConsentIds: signal([]),
  allowedConsents: signal({}),
  activeConsentProviderPluginName: signal(undefined),
  consentProviderInitialized: signal(false),
};

export { consentsState };
