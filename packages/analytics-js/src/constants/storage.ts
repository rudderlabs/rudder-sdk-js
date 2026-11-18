import type { UserSessionKey } from '@rudderstack/analytics-js-common/types/UserSessionStorage';

const STORAGE_TEST_TOP_LEVEL_DOMAIN = '__tld__';
const LOCAL_STORAGE_PROBE_KEY = '_Is_Incognit';

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
  STORAGE_TEST_TOP_LEVEL_DOMAIN,
  LOCAL_STORAGE_PROBE_KEY,
  CLIENT_DATA_STORE_NAME,
  CLIENT_DATA_STORE_COOKIE,
  CLIENT_DATA_STORE_LS,
  CLIENT_DATA_STORE_MEMORY,
  CLIENT_DATA_STORE_SESSION,
  USER_SESSION_KEYS,
};
