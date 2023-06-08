import { StorageType, IStorage } from '../types/common';
import { externallyLoadedSessionStorageKeys } from './constants';

const getSegmentAnonymousId = (getStorageEngine: (type?: StorageType) => IStorage) => {
  let anonymousId;
  /**
   * First check the local storage for anonymousId
   * Ref: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#identify
   */
  const lsEngine = getStorageEngine('localStorage');
  if (lsEngine?.isEnabled) {
    anonymousId = lsEngine.getItem(externallyLoadedSessionStorageKeys.segment);
  }

  // If anonymousId is not present in local storage and find it in cookies
  const csEngine = getStorageEngine('cookieStorage');
  if (!anonymousId && csEngine?.isEnabled) {
    anonymousId = csEngine.getItem(externallyLoadedSessionStorageKeys.segment);
  }
  return anonymousId;
};

export { getSegmentAnonymousId };
