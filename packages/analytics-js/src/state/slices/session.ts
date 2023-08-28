import { signal } from '@preact/signals-core';
import { SessionState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';
import { DEFAULT_SESSION_TIMEOUT_MS } from '@rudderstack/analytics-js/constants/timeouts';

const defaultSessionInfo: SessionInfo = {
  autoTrack: true,
  timeout: DEFAULT_SESSION_TIMEOUT_MS,
};

const sessionState: SessionState = {
  userId: signal(undefined),
  userTraits: signal(undefined),
  anonymousUserId: signal(undefined),
  groupId: signal(undefined),
  groupTraits: signal(undefined),
  initialReferrer: signal(undefined),
  initialReferringDomain: signal(undefined),
  sessionInfo: signal({ ...defaultSessionInfo }),
};

export { sessionState, defaultSessionInfo };
