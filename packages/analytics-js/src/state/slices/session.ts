import { signal } from '@preact/signals-core';
import type { SessionState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { DEFAULT_USER_SESSION_VALUES } from '../../components/userSessionManager/constants';

const sessionState: SessionState = {
  userId: signal(DEFAULT_USER_SESSION_VALUES.userId),
  userTraits: signal(DEFAULT_USER_SESSION_VALUES.userTraits),
  anonymousId: signal(DEFAULT_USER_SESSION_VALUES.anonymousId),
  groupId: signal(DEFAULT_USER_SESSION_VALUES.groupId),
  groupTraits: signal(DEFAULT_USER_SESSION_VALUES.groupTraits),
  initialReferrer: signal(DEFAULT_USER_SESSION_VALUES.initialReferrer),
  initialReferringDomain: signal(DEFAULT_USER_SESSION_VALUES.initialReferringDomain),
  sessionInfo: signal(DEFAULT_USER_SESSION_VALUES.sessionInfo),
  authToken: signal(DEFAULT_USER_SESSION_VALUES.authToken),
};

export { sessionState };
