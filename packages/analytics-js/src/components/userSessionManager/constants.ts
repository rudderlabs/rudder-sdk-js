import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import type { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';

const DEFAULT_USER_SESSION_VALUES = {
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

const SERVER_SIDE_COOKIES_DEBOUNCE_TIME = 10; // milliseconds

export { DEFAULT_USER_SESSION_VALUES, SERVER_SIDE_COOKIES_DEBOUNCE_TIME };
