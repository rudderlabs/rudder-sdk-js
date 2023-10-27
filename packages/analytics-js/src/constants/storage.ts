import type { UserSessionKey } from '@rudderstack/analytics-js-common/types/UserSessionStorage';

const STORAGE_TEST_COOKIE = 'test_rudder_cookie';
const STORAGE_TEST_LOCAL_STORAGE = 'test_rudder_ls';
const STORAGE_TEST_SESSION_STORAGE = 'test_rudder_ss';
const STORAGE_TEST_TOP_LEVEL_DOMAIN = '__tld__';
const STOREJS_IS_INCOGNITO = '_Is_Incognit';

const CLIENT_DATA_STORE_NAME = 'clientData';

const CLIENT_DATA_STORE_COOKIE = 'clientDataInCookie';
const CLIENT_DATA_STORE_LS = 'clientDataInLocalStorage';
const CLIENT_DATA_STORE_MEMORY = 'clientDataInMemory';
const CLIENT_DATA_STORE_SESSION = 'clientDataInSessionStorage';

const USER_SESSION_KEYS: UserSessionKey[] = [
  'userId',
  'userTraits',
  'anonymousId',
  'groupId',
  'groupTraits',
  'initialReferrer',
  'initialReferringDomain',
  'sessionInfo',
  'authToken',
];

export {
  STORAGE_TEST_COOKIE,
  STORAGE_TEST_LOCAL_STORAGE,
  STORAGE_TEST_SESSION_STORAGE,
  STORAGE_TEST_TOP_LEVEL_DOMAIN,
  STOREJS_IS_INCOGNITO,
  CLIENT_DATA_STORE_NAME,
  CLIENT_DATA_STORE_COOKIE,
  CLIENT_DATA_STORE_LS,
  CLIENT_DATA_STORE_MEMORY,
  CLIENT_DATA_STORE_SESSION,
  USER_SESSION_KEYS,
};
