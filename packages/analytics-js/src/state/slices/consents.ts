import { Signal, signal } from '@preact/signals-core';

export type CookieConsentOptions = {
  // OneTrust
  oneTrust?: {
    enabled: boolean;
  };
};

export type ConsentsState = {
  deniedConsentIds: Signal<string[]>;
  allowedConsentIds: Signal<string[]>;
  cookieConsentOptions: Signal<CookieConsentOptions>;
};

const consentsState: ConsentsState = {
  deniedConsentIds: signal([]),
  allowedConsentIds: signal([]),
  cookieConsentOptions: signal({}),
};

export { consentsState };
