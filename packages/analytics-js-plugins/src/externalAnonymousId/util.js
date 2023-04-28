import { externallyLoadedSessionStorageKeys } from '@rudderstack/analytics-js/components/userSessionManager/sessionStorageKeys';
import { getStorageEngine } from '@rudderstack/analytics-js/services/StoreManager/storages/storageEngine';

const getSegmentAnonymousId = () => {
  let anonymousId;
  /**
   * First check the local storage for anonymousId
   * Ref: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#identify
   */
  if (getStorageEngine('localStorage')?.isEnabled) {
    anonymousId = getStorageEngine('localStorage').getItem(
      externallyLoadedSessionStorageKeys.segment,
    );
  }
  // If anonymousId is not present in local storage and check cookie support exists
  // fetch it from cookie
  if (!anonymousId && getStorageEngine('cookieStorage')?.isEnabled) {
    anonymousId = getStorageEngine('cookieStorage').getItem(
      externallyLoadedSessionStorageKeys.segment,
    );
  }
  return anonymousId;
};

export { getSegmentAnonymousId };
