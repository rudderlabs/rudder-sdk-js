import { Signal, signal } from '@preact/signals-core';
import { CookieConsentOptions } from '@rudderstack/analytics-js/state/types';

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
