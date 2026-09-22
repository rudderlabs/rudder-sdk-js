import { signal } from '@preact/signals-core';
import type {
  CapabilitiesState,
  CspViolation,
  SdkCdnProbeResult,
} from '@rudderstack/analytics-js-common/types/ApplicationState';

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
  isAdBlockerDetectionInProgress: signal<boolean>(false),
  isAdBlocked: signal<boolean | undefined>(undefined),
  cspViolations: signal<CspViolation[]>([]),
  sdkCdnProbe: signal<Record<string, SdkCdnProbeResult>>({}),
};

export { capabilitiesState };
