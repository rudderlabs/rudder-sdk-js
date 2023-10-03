import { signal } from '@preact/signals-core';
import { SessionState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';
import { defaultUserSessionValues } from '../../components/userSessionManager/userSessionStorageKeys';
import { DEFAULT_SESSION_TIMEOUT_MS } from '../../constants/timeouts';

const defaultSessionInfo: SessionInfo = {
  autoTrack: true,
  timeout: DEFAULT_SESSION_TIMEOUT_MS,
};

const sessionState: SessionState = {
  userId: signal(defaultUserSessionValues.userId),
  userTraits: signal(defaultUserSessionValues.userTraits),
  anonymousId: signal(defaultUserSessionValues.anonymousId),
  groupId: signal(defaultUserSessionValues.groupId),
  groupTraits: signal(defaultUserSessionValues.groupTraits),
  initialReferrer: signal(defaultUserSessionValues.initialReferrer),
  initialReferringDomain: signal(defaultUserSessionValues.initialReferringDomain),
  sessionInfo: signal(defaultUserSessionValues.sessionInfo),
  authToken: signal(defaultUserSessionValues.authToken),
};

export { sessionState, defaultSessionInfo };
