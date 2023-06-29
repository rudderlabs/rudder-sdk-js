import { signal } from '@preact/signals-core';
import { DEFAULT_SESSION_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';
import { SessionState } from '@rudderstack/common/types/ApplicationState';
import { SessionInfo } from '@rudderstack/common/types/Session';

const defaultSessionInfo: SessionInfo = {
  autoTrack: true,
  timeout: DEFAULT_SESSION_TIMEOUT,
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
