import { Signal, signal } from '@preact/signals-core';

export type CapabilitiesState = {
  isOnline: Signal<boolean>;
  storage: {
    isLocalStorageAvailable: Signal<boolean>;
    isCookieStorageAvailable: Signal<boolean>;
    isSessionStorageAvailable: Signal<boolean>;
  };
  isBeaconAvailable: Signal<boolean>;
  isLegacyDOM: Signal<boolean>;
  isUaCHAvailable: Signal<boolean>;
  isCryptoAvailable: Signal<boolean>;
  isIE11: Signal<boolean>;
  isAdBlocked: Signal<boolean>;
};

const capabilitiesState: CapabilitiesState = {
  isOnline: signal(true),
  storage: {
    isLocalStorageAvailable: signal(false),
    isCookieStorageAvailable: signal(false),
    isSessionStorageAvailable: signal(false),
  },
  isBeaconAvailable: signal(false),
  isLegacyDOM: signal(false),
  isUaCHAvailable: signal(false),
  isCryptoAvailable: signal(false),
  isIE11: signal(false),
  isAdBlocked: signal(false),
};

export { capabilitiesState };
