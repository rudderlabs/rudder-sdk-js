import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import type { SessionInfo } from '@rudderstack/analytics-js-common/types/Session';

const USER_SESSION_STORAGE_KEYS = {
  userId: 'rl_user_id',
  userTraits: 'rl_trait',
  anonymousId: 'rl_anonymous_id',
  groupId: 'rl_group_id',
  groupTraits: 'rl_group_trait',
  initialReferrer: 'rl_page_init_referrer',
  initialReferringDomain: 'rl_page_init_referring_domain',
  sessionInfo: 'rl_session',
  authToken: 'rl_auth_token',
};

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

export {
  USER_SESSION_STORAGE_KEYS,
  DEFAULT_USER_SESSION_VALUES,
  SERVER_SIDE_COOKIES_DEBOUNCE_TIME,
};
