import { Signal, signal } from '@preact/signals-core';

export type ConsentsState = {
  deniedConsentIds: Signal<string[]>;
  allowedConsentIds: Signal<string[]>;
  consentManager: Signal<string | undefined>;
  consentManagerInitialized: Signal<boolean>;
};

const consentsState: ConsentsState = {
  deniedConsentIds: signal([]),
  allowedConsentIds: signal([]),
  consentManager: signal(undefined),
  consentManagerInitialized: signal(false),
};

export { consentsState };
