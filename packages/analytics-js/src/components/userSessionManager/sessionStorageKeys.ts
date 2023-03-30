const persistedSessionStorageKeys = {
  user_storage_key: 'rl_user_id',
  user_storage_trait: 'rl_trait',
  user_storage_anonymousId: 'rl_anonymous_id',
  group_storage_key: 'rl_group_id',
  group_storage_trait: 'rl_group_trait',
  page_storage_init_referrer: 'rl_page_init_referrer',
  page_storage_init_referring_domain: 'rl_page_init_referring_domain',
  session_info: 'rl_session',
  key: 'Rudder',
};

const externallyLoadedSessionStorageKeys = {
  segment: 'ajs_anonymous_id',
};

const inMemorySessionKeys = {
  session_id: 'sessionId',
};

export { persistedSessionStorageKeys, externallyLoadedSessionStorageKeys, inMemorySessionKeys };
