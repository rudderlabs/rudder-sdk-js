import { Signal, signal } from '@preact/signals-core';
import { PluginName } from '@rudderstack/analytics-js/components/pluginsManager/types';

export type ConsentsState = {
  deniedConsentIds: Signal<string[]>;
  allowedConsents: Signal<Record<string, string>>;
  activeConsentProviderPluginName: Signal<PluginName | undefined>;
  consentProviderInitialized: Signal<boolean>;
};

const consentsState: ConsentsState = {
  deniedConsentIds: signal([]),
  allowedConsents: signal({}),
  activeConsentProviderPluginName: signal(undefined),
  consentProviderInitialized: signal(false),
};

export { consentsState };
