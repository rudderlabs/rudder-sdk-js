import {
  defaultCookieStorage,
  defaultLocalStorage,
} from '@rudderstack/analytics-js/services/StoreManager/storages';
import { externallyLoadedSessionStorageKeys } from '@rudderstack/analytics-js/components/userSessionManager/sessionStorageKeys';

const fetchAnonymousIdFromSegment = source => {
  let anonymousId;
  /**
   * First check the local storage for anonymousId
   * Ref: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#identify
   */
  if (defaultLocalStorage.isSupportAvailable) {
    anonymousId = defaultLocalStorage.getItem(externallyLoadedSessionStorageKeys[source]);
  }
  // If anonymousId is not present in local storage and check cookie support exists
  // fetch it from cookie
  if (!anonymousId && defaultCookieStorage.isSupportAvailable) {
    anonymousId = defaultCookieStorage.getItem(externallyLoadedSessionStorageKeys[source]);
  }
  return anonymousId;
};

export { fetchAnonymousIdFromSegment };
