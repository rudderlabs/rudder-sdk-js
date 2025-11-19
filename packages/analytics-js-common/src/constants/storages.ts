import type { StorageType } from '../types/Storage';

const COOKIE_STORAGE: StorageType = 'cookieStorage';
const LOCAL_STORAGE: StorageType = 'localStorage';
const SESSION_STORAGE: StorageType = 'sessionStorage';
const MEMORY_STORAGE: StorageType = 'memoryStorage';
const NO_STORAGE: StorageType = 'none';

const STORAGE_TEST_COOKIE = 'test_rudder_cookie';
const STORAGE_TEST_LOCAL_STORAGE = 'test_rudder_ls';
const STORAGE_TEST_SESSION_STORAGE = 'test_rudder_ss';

export {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  SESSION_STORAGE,
  MEMORY_STORAGE,
  NO_STORAGE,
  STORAGE_TEST_COOKIE,
  STORAGE_TEST_LOCAL_STORAGE,
  STORAGE_TEST_SESSION_STORAGE,
};
