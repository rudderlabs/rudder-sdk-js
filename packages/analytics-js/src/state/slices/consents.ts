import { Signal, signal } from '@preact/signals-core';
import { PluginName } from '@rudderstack/analytics-js/components/pluginsManager/types';

export type ConsentsState = {
  deniedConsentIds: Signal<string[]>;
  allowedConsents: Signal<Record<string, string> | string[]>;
  activeConsentManagerPluginName: Signal<PluginName | undefined>;
  consentManagerInitialized: Signal<boolean>;
};

const consentsState: ConsentsState = {
  deniedConsentIds: signal([]),
  allowedConsents: signal({}),
  activeConsentManagerPluginName: signal(undefined),
  consentManagerInitialized: signal(false),
};

export { consentsState };
