const userIdKey = 'rl_user_id';
const userTraitsKey = 'rl_trait';
const anonymousUserIdKey = 'rl_anonymous_id';
const groupIdKey = 'rl_group_id';
const groupTraitsKey = 'rl_group_trait';
const pageInitialReferrerKey = 'rl_page_init_referrer';
const pageInitialReferringDomainKey = 'rl_page_init_referring_domain';
const sessionInfoKey = 'rl_session';
const authTokenKey = 'rl_auth_token';

const COOKIE_KEYS = {
  userId: userIdKey,
  userTraits: userTraitsKey,
  anonymousId: anonymousUserIdKey,
  groupId: groupIdKey,
  groupTraits: groupTraitsKey,
  initialReferrer: pageInitialReferrerKey,
  initialReferringDomain: pageInitialReferringDomainKey,
  sessionInfo: sessionInfoKey,
  authToken: authTokenKey,
};

const ENCRYPTION_PREFIX_V3 = 'RS_ENC_v3_';

export {
  COOKIE_KEYS,
  ENCRYPTION_PREFIX_V3,
  userIdKey,
  userTraitsKey,
  anonymousUserIdKey,
  groupIdKey,
  groupTraitsKey,
  pageInitialReferrerKey,
  pageInitialReferringDomainKey,
  sessionInfoKey,
  authTokenKey,
};
