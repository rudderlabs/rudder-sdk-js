import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import type { ResetOptions } from '@rudderstack/analytics-js-common/types/EventApi';
import type { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';
import type { UserSessionKey } from '@rudderstack/analytics-js-common/types/UserSessionStorage';

const DEFAULT_USER_SESSION_VALUES: Record<UserSessionKey, any> = {
  userId: '',
  userTraits: {} as ApiObject,
  anonymousId: '',
  groupId: '',
  groupTraits: {} as ApiObject,
  initialReferrer: '',
  initialReferringDomain: '',
  sessionInfo: {} as SessionInfo,
  authToken: null,
};

const DEFAULT_RESET_OPTIONS: ResetOptions = {
  entries: {
    userId: true,
    userTraits: true,
    groupId: true,
    groupTraits: true,
    sessionInfo: true,
    authToken: true,
    anonymousId: false,
    initialReferrer: false,
    initialReferringDomain: false,
  },
};

const SERVER_SIDE_COOKIES_DEBOUNCE_TIME = 10; // milliseconds

export { DEFAULT_USER_SESSION_VALUES, SERVER_SIDE_COOKIES_DEBOUNCE_TIME, DEFAULT_RESET_OPTIONS };
