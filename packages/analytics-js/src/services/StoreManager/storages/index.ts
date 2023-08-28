export { CookieStorage } from '@rudderstack/analytics-js/services/StoreManager/storages/CookieStorage';
export {
  InMemoryStorage,
  defaultInMemoryStorage,
} from '@rudderstack/analytics-js/services/StoreManager/storages/InMemoryStorage';
export {
  LocalStorage,
  defaultLocalStorage,
} from '@rudderstack/analytics-js/services/StoreManager/storages/LocalStorage';
export {
  getStorageEngine,
  configureCookieStorageEngine,
  configureLocalStorageEngine,
  configureInMemoryStorageEngine,
  configureStorageEngines,
} from '@rudderstack/analytics-js/services/StoreManager/storages/storageEngine';
export {
  getDefaultCookieOptions,
  getDefaultLocalStorageOptions,
  getDefaultInMemoryStorageOptions,
} from '@rudderstack/analytics-js/services/StoreManager/storages/defaultOptions';
