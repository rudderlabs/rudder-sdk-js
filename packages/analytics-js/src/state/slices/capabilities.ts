import { signal } from '@preact/signals-core';
import type { CapabilitiesState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const capabilitiesState: CapabilitiesState = {
  isOnline: signal(true),
  storage: {
    isLocalStorageAvailable: signal(false),
    isCookieStorageAvailable: signal(false),
    isSessionStorageAvailable: signal(false),
  },
  isLegacyDOM: signal(false),
  isUaCHAvailable: signal(false),
  isCryptoAvailable: signal(false),
  isIE11: signal(false),
  isAdBlocked: signal(false),
};

export { capabilitiesState };
