const persistedSessionStorageKeys = {
  userId: 'rl_user_id',
  userTraits: 'rl_trait',
  anonymousUserId: 'rl_anonymous_id',
  groupId: 'rl_group_id',
  groupTraits: 'rl_group_trait',
  initialReferrer: 'rl_page_init_referrer',
  initialReferringDomain: 'rl_page_init_referring_domain',
  sessionInfo: 'rl_session',
};

const externallyLoadedSessionStorageKeys = {
  segment: 'ajs_anonymous_id',
};

const inMemorySessionKeys = {
  session_id: 'sessionId',
};

export { persistedSessionStorageKeys, externallyLoadedSessionStorageKeys, inMemorySessionKeys };
